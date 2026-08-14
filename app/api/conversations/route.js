import { getCurrentSession } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const session = await getCurrentSession();
  if (!session?.userId) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { productId } = await request.json();
  if (!productId) return Response.json({ error: "productId requerido." }, { status: 400 });

  const include = {
    product: { select: { name: true, supplier: true, slug: true } },
    messages: {
      orderBy: { createdAt: "asc" },
      include: { sender: { select: { id: true, fullName: true, role: true } } },
    },
  };

  let conversation = await prisma.conversation.findFirst({
    where: { productId, clientId: session.userId },
    include,
  });

  if (!conversation) {
    try {
      conversation = await prisma.conversation.create({
        data: { productId, clientId: session.userId },
        include,
      });
    } catch (e) {
      if (e?.code === "P2002") {
        conversation = await prisma.conversation.findFirst({
          where: { productId, clientId: session.userId },
          include,
        });
      } else {
        throw e;
      }
    }
  }

  return Response.json({ conversation }, { status: 200 });
}

export async function GET() {
  const session = await getCurrentSession();
  if (!session?.userId) return Response.json({ error: "No autorizado." }, { status: 401 });

  const isAdmin = session.role === "ADMIN";
  const isProvider = session.role === "PROVIDER";

  const where = isAdmin
    ? undefined
    : isProvider
      ? { product: { providerId: session.userId } }
      : { clientId: session.userId };

  const conversations = isAdmin || isProvider
    ? await prisma.conversation.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        include: {
          product: { select: { name: true, slug: true, supplier: true } },
          client: { select: { id: true, fullName: true, company: true } },
          messages: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      })
    : await prisma.conversation.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        include: {
          product: { select: { name: true, slug: true, supplier: true } },
          messages: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      });

  return Response.json({ conversations });
}
