import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slot = searchParams.get("slot");
  if (!slot) return Response.json({ error: "slot requerido" }, { status: 400 });

  const banners = await prisma.banner.findMany({
    where: { slot, active: true },
    orderBy: { order: "asc" },
  });

  return Response.json({ banners });
}
