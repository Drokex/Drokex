import { getCurrentSession } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  const session = await getCurrentSession();
  if (!session?.userId) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { id } = await params;

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      product: { select: { name: true, supplier: true, slug: true, providerId: true } },
      client: { select: { id: true, fullName: true, company: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, fullName: true, role: true } } },
      },
    },
  });

  if (!conversation) return Response.json({ error: "Conversación no encontrada." }, { status: 404 });

  const isAdmin = session.role === "ADMIN";
  const isOwnerProvider = session.role === "PROVIDER" && conversation.product?.providerId === session.userId;
  const isClient = conversation.clientId === session.userId;
  if (!isClient && !isOwnerProvider && !isAdmin) return Response.json({ error: "Sin acceso." }, { status: 403 });

  return Response.json({ conversation });
}
