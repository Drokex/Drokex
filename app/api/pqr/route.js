import { sendPqrEmail } from "@/lib/emails";

export async function POST(request) {
  try {
    const body = await request.json();
    const name = body.name?.trim() || "";
    const email = body.email?.trim() || "";
    const type = body.type?.trim() || "";
    const message = body.message?.trim() || "";

    if (!name || !email || !type || !message) {
      return Response.json({ error: "Completa todos los campos." }, { status: 400 });
    }

    await sendPqrEmail({ name, email, type, message });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "No fue posible enviar tu solicitud." }, { status: 500 });
  }
}
