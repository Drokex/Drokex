import { getCurrentSession, getCurrentUser } from "@/lib/current-user";
import { UserLookupUnavailableError } from "@/lib/session-status";

export async function GET() {
  const session = await getCurrentSession();

  // Sin cookie válida sí es un 401 real: no hay sesión que mantener.
  if (!session?.userId) {
    return Response.json({ error: "No has iniciado sesión." }, { status: 401 });
  }

  let user;
  try {
    user = await getCurrentUser();
  } catch (error) {
    if (!(error instanceof UserLookupUnavailableError)) throw error;

    // La BD no respondió. La sesión firmada sigue siendo válida, así que
    // devolvemos lo que el token ya lleva en vez de aparentar un logout.
    return Response.json({
      user: {
        id: session.userId,
        email: session.email ?? null,
        role: session.role ?? null,
        fullName: session.fullName ?? null,
        company: null,
        phone: null,
        logoUrl: null,
      },
      session,
      degraded: true,
    });
  }

  if (!user) {
    return Response.json({ error: "No has iniciado sesión." }, { status: 401 });
  }

  return Response.json({ user, session });
}
