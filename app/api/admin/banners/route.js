import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/admin";

export async function GET() {
  try {
    await requireAdminUser();
  } catch {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  const banners = await prisma.banner.findMany({ orderBy: [{ slot: "asc" }, { order: "asc" }] });
  return Response.json({ banners });
}

export async function POST(request) {
  try {
    await requireAdminUser();
  } catch {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id, slot, imageUrl, alt, linkUrl, width, height, active, order } = await request.json();
  if (!slot || !imageUrl || !alt) {
    return Response.json({ error: "slot, imageUrl y alt son requeridos." }, { status: 400 });
  }

  const data = {
    slot,
    imageUrl,
    alt,
    linkUrl: linkUrl || null,
    width: Number(width) || 300,
    height: Number(height) || 600,
    active: active !== false,
    order: Number(order) || 0,
  };

  const banner = id
    ? await prisma.banner.update({ where: { id }, data })
    : await prisma.banner.create({ data });

  return Response.json({ banner });
}

export async function DELETE(request) {
  try {
    await requireAdminUser();
  } catch {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "id requerido" }, { status: 400 });

  await prisma.banner.delete({ where: { id } });
  return Response.json({ ok: true });
}
