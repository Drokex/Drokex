import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  if (!prisma) return NextResponse.json({ heroImage: null });

  const landing = await prisma.proveedorProLanding.findUnique({
    where: { slug },
    select: { store: true },
  });

  if (!landing) return NextResponse.json({ heroImage: null }, { status: 404 });

  const store = landing.store || {};
  return NextResponse.json({ heroImage: store.heroImage || null });
}
