import { getCurrentSession, getCurrentUser } from "@/lib/current-user";

export async function GET() {
  const session = await getCurrentSession();
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "No has iniciado sesión." }, { status: 401 });
  }

  return Response.json({ user, session });
}
