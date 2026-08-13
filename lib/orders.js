import { prisma } from "@/lib/prisma";

function hasOrderDelegates() {
  return Boolean(prisma && "order" in prisma && "orderItem" in prisma);
}

const demoOrders = [
  {
    id: "DX-2401",
    userId: "demo-customer",
    customerName: "Comprador Demo",
    customerEmail: "cliente@drokex.com",
    customerPhone: "+57 301 000 0000",
    company: "Cliente Global",
    status: "IN_PROGRESS",
    paymentStatus: "PAID",
    trackingNumber: "TRK-2401",
    carrier: "DHL",
    notes: "Entregar en horario de oficina.",
    subtotal: 1240000,
    totalItems: 2,
    createdAt: new Date("2026-04-22T10:00:00.000Z"),
    updatedAt: new Date("2026-04-22T10:00:00.000Z"),
    items: [
      {
        id: "DX-2401-1",
        productId: "modulo-iot-para-trazabilidad-de-flotas",
        name: "Modulo IoT para trazabilidad de flotas",
        image: "/catalog-banner-orange.jpg",
        unitPrice: 620000,
        quantity: 2,
        lineTotal: 1240000,
        createdAt: new Date("2026-04-22T10:00:00.000Z"),
      },
    ],
  },
  {
    id: "DX-2402",
    userId: "demo-customer",
    customerName: "Comprador Demo",
    customerEmail: "cliente@drokex.com",
    customerPhone: "+57 301 000 0000",
    company: "Cliente Global",
    status: "SHIPPED",
    paymentStatus: "PAID",
    trackingNumber: "TRK-2402",
    carrier: "FedEx",
    notes: null,
    subtotal: 860000,
    totalItems: 1,
    createdAt: new Date("2026-04-20T12:00:00.000Z"),
    updatedAt: new Date("2026-04-21T09:00:00.000Z"),
    items: [
      {
        id: "DX-2402-1",
        productId: "linea-oem-de-empaque-flexible-para-exportacion",
        name: "Linea OEM de empaque flexible para exportacion",
        image: "/catalog-banner-orange.jpg",
        unitPrice: 860000,
        quantity: 1,
        lineTotal: 860000,
        createdAt: new Date("2026-04-20T12:00:00.000Z"),
      },
    ],
  },
  {
    id: "DX-2403",
    userId: "demo-customer",
    customerName: "Comprador Demo",
    customerEmail: "cliente@drokex.com",
    customerPhone: "+57 301 000 0000",
    company: "Cliente Global",
    status: "DELIVERED",
    paymentStatus: "PAID",
    trackingNumber: "TRK-2403",
    carrier: "Coordinadora",
    notes: null,
    subtotal: 2110000,
    totalItems: 3,
    createdAt: new Date("2026-04-18T08:00:00.000Z"),
    updatedAt: new Date("2026-04-19T18:00:00.000Z"),
    items: [
      {
        id: "DX-2403-1",
        productId: "estacion-ac-comercial-para-carga-de-flotas",
        name: "Estacion AC comercial para carga de flotas",
        image: "/catalog-banner-orange.jpg",
        unitPrice: 703334,
        quantity: 3,
        lineTotal: 2110000,
        createdAt: new Date("2026-04-18T08:00:00.000Z"),
      },
    ],
  },
];

function serializeOrder(order) {
  return {
    id: order.id,
    userId: order.userId,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone || null,
    company: order.company || null,
    status: order.status,
    paymentStatus: order.paymentStatus,
    trackingNumber: order.trackingNumber || null,
    carrier: order.carrier || null,
    notes: order.notes || null,
    subtotal: order.subtotal,
    totalItems: order.totalItems,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items: (order.items || []).map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.name,
      image: item.image,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      lineTotal: item.lineTotal,
      createdAt: item.createdAt,
    })),
  };
}

function normalizeStatusLabel(status) {
  if (status === "IN_PROGRESS") return "En proceso";
  if (status === "SHIPPED") return "Enviado";
  if (status === "DELIVERED") return "Entregado";
  if (status === "CANCELLED") return "Cancelado";
  return "Pendiente";
}

export function formatOrderForUi(order) {
  return {
    ...serializeOrder(order),
    statusLabel: normalizeStatusLabel(order.status),
    subtotalLabel: new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(order.subtotal),
  };
}

export async function getOrdersForUser(user) {
  if (!user) {
    return [];
  }

  if (!hasOrderDelegates()) {
    return demoOrders
      .filter(
        (order) =>
          order.userId === user.id ||
          order.customerEmail.toLowerCase() === user.email.toLowerCase(),
      )
      .map(formatOrderForUi);
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!orders.length) {
    return demoOrders
      .filter((order) => order.customerEmail.toLowerCase() === user.email.toLowerCase())
      .map(formatOrderForUi);
  }

  return orders.map(formatOrderForUi);
}

export async function getAllOrders() {
  if (!hasOrderDelegates()) {
    return demoOrders.map(formatOrderForUi);
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          company: true,
        },
      },
      items: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!orders.length) {
    return demoOrders.map(formatOrderForUi);
  }

  return orders.map((order) => ({
    ...formatOrderForUi(order),
    user: order.user
      ? {
          id: order.user.id,
          fullName: order.user.fullName,
          email: order.user.email,
          company: order.user.company,
        }
      : null,
  }));
}

export async function updateOrderStatus(orderId, input) {
  if (!hasOrderDelegates()) {
    throw new Error("DATABASE_NOT_CONFIGURED");
  }

  const status = input.status;
  const trackingNumber = input.trackingNumber?.trim() || null;
  const carrier = input.carrier?.trim() || null;

  if (!["PENDING", "IN_PROGRESS", "SHIPPED", "DELIVERED", "CANCELLED"].includes(status)) {
    throw new Error("INVALID_STATUS");
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      trackingNumber,
      carrier,
    },
    include: {
      items: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return formatOrderForUi(updated);
}
