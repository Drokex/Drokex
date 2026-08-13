import { getSessionFromCookies } from "@/lib/auth";
import { requireAdminUser } from "@/lib/admin";
import { getAllOrders, getOrdersForUser } from "@/lib/orders";
import { getUserById } from "@/lib/users";

export async function GET() {
  try {
    const session = await getSessionFromCookies();

    if (!session?.userId) {
      return Response.json({ error: "No autorizado." }, { status: 401 });
    }

    if (session.role === "ADMIN") {
      await requireAdminUser();
      const orders = await getAllOrders();
      return Response.json({ orders });
    }

    const user = await getUserById(session.userId);
    const orders = await getOrdersForUser(user);
    return Response.json({ orders });
  } catch (error) {
    const message =
      error instanceof Error && error.message === "FORBIDDEN"
        ? "No tienes permisos para ver pedidos."
        : "No fue posible cargar los pedidos.";

    const status =
      error instanceof Error && error.message === "FORBIDDEN"
        ? 403
        : 500;

    return Response.json({ error: message }, { status });
  }
}
