import { getCurrentSession } from "@/lib/current-user";
import { respondToQuote, updateQuoteStatus } from "@/lib/quotes";

export async function PATCH(request, context) {
  const session = await getCurrentSession();
  if (!session?.userId) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { id } = await context.params;
  const body = await request.json();

  try {
    if (body.action === "respond") {
      if (session.role !== "ADMIN" && session.role !== "PROVIDER") {
        return Response.json({ error: "Solo proveedores pueden responder cotizaciones." }, { status: 403 });
      }
      const quote = await respondToQuote(id, { providerPrice: body.providerPrice, providerNote: body.providerNote });
      return Response.json({ quote });
    }

    if (body.action === "status") {
      const quote = await updateQuoteStatus(id, body.status);
      return Response.json({ quote });
    }

    return Response.json({ error: "Acción no válida." }, { status: 400 });
  } catch (e) {
    return Response.json({ error: "No fue posible actualizar la cotización." }, { status: 500 });
  }
}
