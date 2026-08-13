import { authenticateUser } from "@/lib/users";
import { setSessionCookie } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body.email?.trim() || "";
    const password = body.password || "";
    const adminPin = body.adminPin?.trim() || "";
    const audience = body.audience?.trim() || "";

    if (!email || !password) {
      return Response.json({ error: "Ingresa tu correo y contraseña." }, { status: 400 });
    }

    const user = await authenticateUser(email, password);
    const expectedAdminPin = process.env.ADMIN_EXTRA_PIN?.trim() || "1234";

    if (user.role === "ADMIN" && !adminPin) {
      return Response.json(
        {
          requiresAdminPin: true,
          user,
          message: "Confirma el PIN adicional para entrar al panel.",
        },
        { status: 202 },
      );
    }

    if (user.role === "ADMIN" && adminPin !== expectedAdminPin) {
      return Response.json({ error: "El PIN de administrador es incorrecto." }, { status: 403 });
    }

    if (audience === "proveedor" && user.role !== "PROVIDER" && user.role !== "ADMIN") {
      return Response.json(
        { error: "Este acceso es solo para proveedores. Entra por Cliente con esa cuenta." },
        { status: 403 },
      );
    }

    if (audience === "cliente" && user.role !== "CUSTOMER" && user.role !== "ADMIN") {
      return Response.json(
        { error: "Este acceso es solo para clientes. Entra por Proveedor con esa cuenta." },
        { status: 403 },
      );
    }

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      role: user.role,
      audience,
    });

    return Response.json({ user, message: "Inicio de sesión correcto." });
  } catch (error) {
    const message =
      error instanceof Error && error.message === "INVALID_CREDENTIALS"
        ? "Correo o contraseña incorrectos."
        : "No fue posible iniciar sesión.";

    return Response.json({ error: message }, { status: 500 });
  }
}
