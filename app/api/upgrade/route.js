import { getCurrentSession } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/auth";

const PROMO_CODE = process.env.PLAN_PROMO_CODE || "1234";

export async function POST(request) {
  const session = await getCurrentSession();
  if (!session?.userId) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { code } = await request.json();

  if (!code || code.trim() !== PROMO_CODE) {
    return Response.json({ error: "Código incorrecto. Inténtalo de nuevo." }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: session.userId },
    data: { plan: "DIRECT" },
  });

  await setSessionCookie({
    userId: user.id,
    email: user.email,
    role: user.role,
    plan: user.plan,
    audience: session.audience,
  });

  return Response.json({ success: true, plan: "DIRECT" });
}
