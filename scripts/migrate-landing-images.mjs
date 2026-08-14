// Migra las imágenes embebidas como data:URL en ProveedorProLanding.store /
// .products a Supabase Storage, dejando solo la URL pública en el JSONB.
//
//   node scripts/migrate-landing-images.mjs --dry     (solo reporta)
//   node scripts/migrate-landing-images.mjs           (aplica)
//
// Es idempotente: las URLs ya migradas se ignoran.

import { createHash } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";
import { uploadImage, extensionFor, isStorageConfigured } from "../lib/storage.js";

const DRY = process.argv.includes("--dry");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const DATA_URL = /^data:(image\/[a-z+]+);base64,(.+)$/i;

// Misma imagen en varios campos → una sola subida.
const uploaded = new Map();

async function migrateValue(value, slug, stats) {
  if (typeof value !== "string") return value;

  const match = value.match(DATA_URL);
  if (!match) return value;

  const [, contentType, base64] = match;
  const ext = extensionFor(contentType);
  if (!ext) {
    stats.skipped.push(`${slug}: formato no admitido (${contentType})`);
    return value;
  }

  const buffer = Buffer.from(base64, "base64");
  const hash = createHash("sha256").update(buffer).digest("hex").slice(0, 16);
  stats.bytes += buffer.length;
  stats.found += 1;

  if (uploaded.has(hash)) return uploaded.get(hash);
  if (DRY) return value;

  const url = await uploadImage(buffer, `${slug}/${hash}.${ext}`, contentType);
  uploaded.set(hash, url);
  stats.migrated += 1;
  return url;
}

// Recorre el JSON completo: las imágenes viven a distintas profundidades.
async function walk(node, slug, stats) {
  if (Array.isArray(node)) {
    const out = [];
    for (const item of node) out.push(await walk(item, slug, stats));
    return out;
  }
  if (node && typeof node === "object") {
    const out = {};
    for (const [key, val] of Object.entries(node)) out[key] = await walk(val, slug, stats);
    return out;
  }
  return migrateValue(node, slug, stats);
}

async function main() {
  if (!DRY && !isStorageConfigured()) {
    console.error("Falta SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en el entorno.");
    process.exit(1);
  }

  const landings = await prisma.proveedorProLanding.findMany({
    select: { id: true, slug: true, store: true, products: true },
  });

  console.log(`${landings.length} landings.${DRY ? "  (dry-run: no se escribe nada)" : ""}\n`);

  for (const landing of landings) {
    const stats = { found: 0, migrated: 0, bytes: 0, skipped: [] };

    const store = await walk(landing.store, landing.slug, stats);
    const products = await walk(landing.products, landing.slug, stats);

    if (stats.found === 0) {
      console.log(`  ${landing.slug}: sin imágenes embebidas`);
      continue;
    }

    if (!DRY) {
      await prisma.proveedorProLanding.update({
        where: { id: landing.id },
        data: { store, products },
      });
    }

    const mb = (stats.bytes / 1024 / 1024).toFixed(2);
    console.log(`  ${landing.slug}: ${stats.found} imágenes, ${mb} MB${DRY ? " (por migrar)" : " migradas"}`);
    for (const s of stats.skipped) console.log(`    ! ${s}`);
  }

  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
