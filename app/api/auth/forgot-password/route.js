import { setResetToken } from "@/lib/users";
import { sendPasswordResetEmail } from "@/lib/emails";

const GENERIC_MESSAGE = "Si el correo existe en Drokex, te enviamos un enlace para restablecer la contraseña.";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body.email?.trim() || "";

    if (!email) {
      return Response.json({ error: "Ingresa tu correo." }, { status: 400 });
    }

    const result = await setResetToken(email);
    if (result) {
      await sendPasswordResetEmail(result.user, result.token);
    }

    // Misma respuesta exista o no el correo, para no filtrar qué cuentas existen.
    return Response.json({ message: GENERIC_MESSAGE });
  } catch {
    return Response.json({ error: "No fue posible procesar la solicitud." }, { status: 500 });
  }
}
