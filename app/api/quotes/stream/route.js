import { getCurrentSession } from "@/lib/current-user";

const clients = new Map();

export function notifyQuoteUpdate(userId, quote) {
  const send = clients.get(userId);
  if (send) send(quote);
  const adminSend = clients.get("__all__");
  if (adminSend) adminSend(quote);
}

export async function GET() {
  const session = await getCurrentSession();
  if (!session?.userId) return new Response("No autorizado.", { status: 401 });

  const key = session.role === "ADMIN" || session.role === "PROVIDER" ? "__all__" : session.userId;

  const stream = new ReadableStream({
    start(controller) {
      const send = (data) => {
        try {
          controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
        } catch {}
      };

      clients.set(key, send);
      send({ type: "connected" });

      const ping = setInterval(() => {
        try { controller.enqueue(": ping\n\n"); } catch { clearInterval(ping); }
      }, 25000);

      return () => {
        clearInterval(ping);
        clients.delete(key);
      };
    },
    cancel() {
      clients.delete(key);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
