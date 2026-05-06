import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) return Response.json({ error: "slug requerido" }, { status: 400 });

  const landing = await prisma.proveedorProLanding.findUnique({ where: { slug } });
  if (!landing) return Response.json({ error: "no encontrado" }, { status: 404 });

  return Response.json({ store: landing.store, products: landing.products });
}

export async function POST(request) {
  const { slug, store, products } = await request.json();
  if (!slug) return Response.json({ error: "slug requerido" }, { status: 400 });

  const landing = await prisma.proveedorProLanding.upsert({
    where: { slug },
    update: { store, products },
    create: { slug, store, products },
  });

  return Response.json({ ok: true, slug: landing.slug });
}
