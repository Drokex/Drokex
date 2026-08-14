import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// heroImage es base64 dentro del JSONB `store` (450KB–750KB por tienda, ~2s por query).
// Caché en memoria + Cache-Control para que el listado del directorio no repita el costo
// en cada visita. Misma estrategia que el _dirCache de app/directorio/page.js.
const CACHE_TTL = 5 * 60_000;
const cache = globalThis.__drokexThumbCache ?? new Map();
if (!globalThis.__drokexThumbCache) globalThis.__drokexThumbCache = cache;

// Peticiones simultáneas del mismo slug comparten una sola query.
const inflight = globalThis.__drokexThumbInflight ?? new Map();
if (!globalThis.__drokexThumbInflight) globalThis.__drokexThumbInflight = inflight;

const cached = (heroImage, status = 200) =>
  NextResponse.json(
    { heroImage },
    {
      status,
      headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=86400" },
    }
  );

async function loadHeroImage(slug) {
  const rows = await prisma.$queryRaw`
    SELECT store->>'heroImage' AS "heroImage"
    FROM "ProveedorProLanding"
    WHERE slug = ${slug}
    LIMIT 1
  `;
  if (!rows.length) return { heroImage: null, found: false };
  return { heroImage: rows[0].heroImage || null, found: true };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  if (!prisma) return NextResponse.json({ heroImage: null });

  const hit = cache.get(slug);
  if (hit && Date.now() - hit.ts < CACHE_TTL) {
    return cached(hit.heroImage, hit.found ? 200 : 404);
  }

  let promise = inflight.get(slug);
  if (!promise) {
    promise = loadHeroImage(slug).finally(() => inflight.delete(slug));
    inflight.set(slug, promise);
  }

  const result = await promise;
  cache.set(slug, { ...result, ts: Date.now() });
  return cached(result.heroImage, result.found ? 200 : 404);
}
