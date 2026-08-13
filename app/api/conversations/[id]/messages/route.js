import { getCurrentSession } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { sendNewChatNotification } from "@/lib/emails";

const BLOCKED_PATTERNS = [
  /\b[\w.+-]+@[\w-]+\.[a-z]{2,}\b/i,
  /(\+?[\d\s\-().]{7,}\d)/,
  /https?:\/\/[^\s]+/i,
  /\bwa\.me\b|\bwhatsapp\b/i,
  /\bt\.me\b|\btelegram\b/i,
  /\binstagram\.com\b|\bfacebook\.com\b|\blinkedin\.com\b/i,
  /\bwww\.[^\s]+/i,
];

function containsRestrictedContent(text) {
  return BLOCKED_PATTERNS.some((pattern) => pattern.test(text));
}

// Un fragmento de dígitos es un mensaje compuesto solo por números, espacios y separadores típicos de teléfono.
function isDigitFragment(text) {
  return /^[\d\s\-().+]+$/.test(text.trim()) && /\d/.test(text);
}

async function isPhoneEvasion(conversationId, senderId, newContent) {
  if (!isDigitFragment(newContent)) return false;

  const recent = await prisma.chatMessage.findMany({
    where: { conversationId, senderId },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: { content: true },
  });

  const combined = [...recent.map((m) => m.content), newContent]
    .filter(isDigitFragment)
    .join("");

  return combined.replace(/\D/g, "").length >= 7;
}

export async function POST(request, { params }) {
  const session = await getCurrentSession();
  if (!session?.userId) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { id } = await params;
  const { content } = await request.json();
  if (!content?.trim()) return Response.json({ error: "Mensaje vacío." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { plan: true } });
  const isPaid = user?.plan === "DIRECT";

  if (!isPaid && (containsRestrictedContent(content) || await isPhoneEvasion(id, session.userId, content))) {
    return Response.json({ error: "PLAN_REQUIRED" }, { status: 422 });
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      product: { select: { name: true, slug: true, provider: { select: { email: true, fullName: true } } } },
      client: { select: { fullName: true, company: true } },
      _count: { select: { messages: true } },
    },
  });
  if (!conversation) return Response.json({ error: "Conversación no encontrada." }, { status: 404 });

  const isProvider = session.role === "PROVIDER" || session.role === "ADMIN";
  const isClient = conversation.clientId === session.userId;
  if (!isClient && !isProvider) return Response.json({ error: "Sin acceso." }, { status: 403 });

  const isFirstMessage = conversation._count.messages === 0;

  const [message] = await prisma.$transaction([
    prisma.chatMessage.create({
      data: { conversationId: id, senderId: session.userId, content: content.trim() },
      include: { sender: { select: { id: true, fullName: true, role: true } } },
    }),
    prisma.conversation.update({ where: { id }, data: { updatedAt: new Date() } }),
  ]);

  if (isFirstMessage && isClient) {
    const provider = conversation.product?.provider;
    if (provider?.email) {
      sendNewChatNotification({
        providerEmail: provider.email,
        providerName: provider.fullName,
        clientName: conversation.client?.fullName || "Un cliente",
        clientCompany: conversation.client?.company || "",
        productName: conversation.product?.name || "",
        productSlug: conversation.product?.slug || "",
      });
    }
  }

  return Response.json({ message }, { status: 201 });
}
