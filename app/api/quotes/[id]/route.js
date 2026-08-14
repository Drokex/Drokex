import { getCurrentSession } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { respondToQuote, updateQuoteStatus } from "@/lib/quotes";

async function assertQuoteAccess(id, session) {
  if (session.role === "ADMIN") return true;

  const quote = await prisma.quote.findUnique({
    where: { id },
    select: { clientId: true, product: { select: { providerId: true } } },
  });

  if (!quote) return false;
  if (quote.clientId === session.userId) return true;
  return quote.product?.providerId === session.userId;
}

export async function PATCH(request, context) {
  const session = await getCurrentSession();
  if (!session?.userId) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { id } = await context.params;

  if (!(await assertQuoteAccess(id, session))) {
    return Response.json({ error: "No autorizado." }, { status: 403 });
  }

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
