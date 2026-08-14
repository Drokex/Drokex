import { getCurrentSession } from "@/lib/current-user";
import { createQuote, getQuotesForClient, getQuotesForProvider } from "@/lib/quotes";

export async function GET() {
  const session = await getCurrentSession();
  if (!session?.userId) return Response.json({ error: "No autorizado." }, { status: 401 });

  const isAdmin = session.role === "ADMIN";
  const isProvider = isAdmin || session.role === "PROVIDER";
  const quotes = isProvider
    ? await getQuotesForProvider(isAdmin ? null : session.userId)
    : await getQuotesForClient(session.userId);

  return Response.json({ quotes });
}

export async function POST(request) {
  const session = await getCurrentSession();
  if (!session?.userId) return Response.json({ error: "No autorizado." }, { status: 401 });

  try {
    const { productId, quantity, destinationCountry, message } = await request.json();
    if (!productId || !quantity || !destinationCountry) {
      return Response.json({ error: "Producto, cantidad y destino son requeridos." }, { status: 400 });
    }

    const quote = await createQuote({
      productId,
      clientId: session.userId,
      quantity,
      destinationCountry,
      message,
    });

    return Response.json({ quote }, { status: 201 });
  } catch (e) {
    console.error("Quote error:", e?.message, e?.code);
    return Response.json({ error: e?.message || "No fue posible crear la cotización." }, { status: 500 });
  }
}
