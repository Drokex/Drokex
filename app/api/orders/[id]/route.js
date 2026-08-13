import { requireAdminUser } from "@/lib/admin";
import { updateOrderStatus } from "@/lib/orders";

export async function PATCH(request, { params }) {
  try {
    await requireAdminUser();
    const body = await request.json();
    const order = await updateOrderStatus(params.id, {
      status: body.status || "PENDING",
      trackingNumber: body.trackingNumber,
      carrier: body.carrier,
    });

    return Response.json({ order, message: "Pedido actualizado." });
  } catch (error) {
    const message =
      error instanceof Error && error.message === "UNAUTHORIZED"
        ? "No autorizado."
        : error instanceof Error && error.message === "FORBIDDEN"
          ? "No tienes permisos para actualizar pedidos."
          : error instanceof Error && error.message === "INVALID_STATUS"
            ? "Estado de pedido no válido."
            : "No fue posible actualizar el pedido.";

    const status =
      error instanceof Error && error.message === "UNAUTHORIZED"
        ? 401
        : error instanceof Error && error.message === "FORBIDDEN"
          ? 403
          : error instanceof Error && error.message === "INVALID_STATUS"
            ? 400
            : 500;

    return Response.json({ error: message }, { status });
  }
}
