import { getCurrentSession } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const session = await getCurrentSession();
  if (!session?.userId) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const { logoUrl } = await request.json();
    if (!logoUrl) return Response.json({ error: "No se recibió imagen." }, { status: 400 });

    await prisma.user.update({
      where: { id: session.userId },
      data: { logoUrl },
    });

    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: "No fue posible guardar el logo." }, { status: 500 });
  }
}
