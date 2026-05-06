import { createUser } from "@/lib/users";
import { setSessionCookie } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const user = await createUser(body);

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      role: user.role,
      audience: body.audience === "proveedor" ? "proveedor" : "cliente",
    });

    return Response.json({ user, message: "Cuenta creada correctamente." }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error && error.message === "EMAIL_EXISTS"
        ? "Este correo ya está registrado."
        : error instanceof Error && error.message === "MISSING_FIELDS"
          ? "Completa nombre, correo y contraseña."
          : "No fue posible crear la cuenta.";

    return Response.json({ error: message }, { status: 400 });
  }
}
