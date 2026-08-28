import { consumeResetToken } from "@/lib/users";

export async function POST(request) {
  try {
    const body = await request.json();
    const token = body.token?.trim() || "";
    const password = body.password || "";

    if (!token || !password) {
      return Response.json({ error: "Faltan datos." }, { status: 400 });
    }

    if (password.length < 8) {
      return Response.json({ error: "La contraseña debe tener al menos 8 caracteres." }, { status: 400 });
    }

    await consumeResetToken(token, password);

    return Response.json({ message: "Contraseña actualizada correctamente." });
  } catch (error) {
    const message =
      error instanceof Error && error.message === "INVALID_OR_EXPIRED_TOKEN"
        ? "El enlace no es válido o ha expirado. Solicita uno nuevo."
        : "No fue posible restablecer la contraseña.";

    return Response.json({ error: message }, { status: 400 });
  }
}
