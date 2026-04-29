import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

function formatQuote(q) {
  return {
    id: q.id,
    productId: q.productId,
    productName: q.product?.name || "",
    productSlug: q.product?.slug || "",
    productImage: q.product?.id ? `/api/products/${q.product.id}/image` : "",
    clientId: q.clientId,
    clientName: q.client?.fullName || "",
    clientEmail: q.client?.email || "",
    clientCompany: q.client?.company || "",
    quantity: q.quantity,
    destinationCountry: q.destinationCountry,
    message: q.message || "",
    status: q.status,
    providerPrice: q.providerPrice,
    providerNote: q.providerNote || "",
    createdAt: q.createdAt,
    updatedAt: q.updatedAt,
  };
}

const include = {
  product: { select: { id: true, name: true, slug: true } },
  client: { select: { fullName: true, email: true, company: true } },
};

export async function createQuote({ productId, clientId, quantity, destinationCountry, message }) {
  const quote = await prisma.quote.create({
    data: { productId, clientId, quantity: Number(quantity), destinationCountry, message },
    include,
  });

  await sendQuoteEmail(quote);
  return formatQuote(quote);
}

export async function getQuotesForClient(clientId) {
  const quotes = await prisma.quote.findMany({
    where: { clientId },
    include,
    orderBy: { createdAt: "desc" },
  });
  return quotes.map(formatQuote);
}

export async function getQuotesForProvider() {
  const quotes = await prisma.quote.findMany({
    include,
    orderBy: { createdAt: "desc" },
  });
  return quotes.map(formatQuote);
}

export async function respondToQuote(id, { providerPrice, providerNote }) {
  const quote = await prisma.quote.update({
    where: { id },
    data: {
      providerPrice: Number(providerPrice),
      providerNote: providerNote || null,
      status: "QUOTED",
    },
    include,
  });

  await sendQuoteResponseEmail(quote);
  return formatQuote(quote);
}

export async function updateQuoteStatus(id, status) {
  const quote = await prisma.quote.update({
    where: { id },
    data: { status },
    include,
  });
  return formatQuote(quote);
}

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });
}

async function sendQuoteEmail(quote) {
  if (!process.env.GMAIL_USER) return;
  try {
    await getTransporter().sendMail({
      from: `"Drokex" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `[Drokex] Nueva cotización — ${quote.product?.name}`,
      html: `
        <h2>Nueva solicitud de cotización</h2>
        <p><strong>Producto:</strong> ${quote.product?.name}</p>
        <p><strong>Cliente:</strong> ${quote.client?.fullName} (${quote.client?.email})</p>
        <p><strong>Cantidad:</strong> ${quote.quantity}</p>
        <p><strong>Destino:</strong> ${quote.destinationCountry}</p>
        <p><strong>Mensaje:</strong> ${quote.message || "—"}</p>
        <p><a href="http://localhost:3000/mi-cuenta/cotizaciones/proveedor">Ver en el dashboard</a></p>
      `,
    });
  } catch {}
}

async function sendQuoteResponseEmail(quote) {
  if (!process.env.GMAIL_USER || !quote.client?.email) return;
  try {
    await getTransporter().sendMail({
      from: `"Drokex" <${process.env.GMAIL_USER}>`,
      to: quote.client.email,
      replyTo: process.env.GMAIL_USER,
      subject: `[Drokex] Tu cotización de ${quote.product?.name} tiene respuesta`,
      html: `
        <h2>Tienes una respuesta a tu cotización</h2>
        <p><strong>Producto:</strong> ${quote.product?.name}</p>
        <p><strong>Precio cotizado:</strong> $${(quote.providerPrice / 100).toFixed(2)} USD</p>
        <p><strong>Nota del proveedor:</strong> ${quote.providerNote || "—"}</p>
        <p><a href="http://localhost:3000/mi-cuenta/cotizaciones">Ver en tu dashboard</a></p>
      `,
    });
  } catch {}
}
