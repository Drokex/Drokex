import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/admin";

export async function GET(request) {
  try {
    await requireAdminUser();
  } catch {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.trim().toLowerCase();
  if (!email) return Response.json({ error: "email requerido" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, fullName: true, email: true, role: true },
  });

  if (!user) return Response.json({ error: "No existe ningún usuario con ese correo." }, { status: 404 });

  return Response.json({ user });
}
