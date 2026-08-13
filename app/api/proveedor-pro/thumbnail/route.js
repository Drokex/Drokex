import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  if (!prisma) return NextResponse.json({ heroImage: null });

  const rows = await prisma.$queryRaw`
    SELECT store->>'heroImage' AS "heroImage"
    FROM "ProveedorProLanding"
    WHERE slug = ${slug}
    LIMIT 1
  `;

  if (!rows.length) return NextResponse.json({ heroImage: null }, { status: 404 });

  return NextResponse.json({ heroImage: rows[0].heroImage || null });
}
