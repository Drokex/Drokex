import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });
}

const siteUrl = process.env.SITE_URL || "https://drokex.com";

async function sendWhatsAppNotification(text) {
  const phone = process.env.WHATSAPP_NOTIFY_PHONE;
  const apiKey = process.env.WHATSAPP_CALLMEBOT_KEY;
  if (!phone || !apiKey) return;
  try {
    const encoded = encodeURIComponent(text);
    await fetch(`https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encoded}&apikey=${apiKey}`);
  } catch (e) {
    console.error("[whatsapp] notificación falló:", e?.message);
  }
}

export async function sendNewChatNotification({ providerEmail, providerName, clientName, clientCompany, productName, productSlug }) {
  const label = clientCompany ? `${clientName} (${clientCompany})` : clientName;

  // WhatsApp
  sendWhatsAppNotification(
    `💬 Nuevo mensaje en Drokex\nCliente: ${label}\nProducto: ${productName}\nVer: ${siteUrl}/mi-cuenta/mensajes`
  );

  // Email
  if (!process.env.GMAIL_USER || !providerEmail) return;
  try {
    await getTransporter().sendMail({
      from: `"Drokex" <${process.env.GMAIL_USER}>`,
      to: providerEmail,
      replyTo: process.env.GMAIL_USER,
      subject: `[Drokex] Tienes un nuevo mensaje de un posible cliente`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
          <h2 style="color:#1a1a1a">💬 Nuevo mensaje en Drokex</h2>
          <p>Hola <strong>${providerName}</strong>,</p>
          <p>Un posible cliente inició una conversación contigo sobre el producto <strong>${productName}</strong>.</p>
          <table style="border-collapse:collapse;width:100%;margin:16px 0">
            <tr><td style="padding:8px;background:#f5f5f5;font-weight:600;width:140px">Cliente</td><td style="padding:8px">${label}</td></tr>
            <tr><td style="padding:8px;background:#f5f5f5;font-weight:600">Producto</td><td style="padding:8px">${productName}</td></tr>
          </table>
          <a href="${siteUrl}/mi-cuenta/mensajes" style="display:inline-block;background:#22c55e;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Ver conversación →</a>
          <p style="margin-top:24px;color:#666;font-size:13px">Este mensaje fue enviado automáticamente por Drokex.</p>
        </div>
      `,
    });
  } catch (e) {
    console.error("[email] sendNewChatNotification falló:", e?.message);
  }
}
