import { prisma } from "@/lib/prisma";

function hasOrderDelegates() {
  return Boolean(prisma && "order" in prisma && "orderItem" in prisma);
}

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
  if (!user || !hasOrderDelegates()) {
    return [];
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

  return orders.map(formatOrderForUi);
}

export async function getAllOrders() {
  if (!hasOrderDelegates()) {
    return [];
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

// Vista de admin: todos los pedidos de todos los proveedores, con el mismo shape
// que getOrdersForProvider (providerSubtotal/providerItemCount) pero sobre el total
// completo de cada pedido, no la porción de un solo proveedor.
export async function getOrdersForAdmin() {
  const orders = await getAllOrders();
  return orders.map((order) => ({
    ...order,
    providerSubtotal: order.subtotal,
    providerSubtotalLabel: order.subtotalLabel,
    providerItemCount: order.totalItems,
  }));
}

export async function getOrdersForProvider(providerId) {
  if (!providerId || !hasOrderDelegates()) {
    return [];
  }

  const providerProducts = await prisma.product.findMany({
    where: { providerId },
    select: { id: true },
  });
  const providerProductIds = providerProducts.map((product) => product.id);

  if (!providerProductIds.length) {
    return [];
  }

  const items = await prisma.orderItem.findMany({
    where: { productId: { in: providerProductIds } },
    orderBy: { createdAt: "desc" },
    include: {
      order: true,
    },
  });

  const byOrder = new Map();
  for (const item of items) {
    const entry = byOrder.get(item.orderId) || {
      order: item.order,
      items: [],
      providerSubtotal: 0,
    };
    entry.items.push(item);
    entry.providerSubtotal += item.lineTotal;
    byOrder.set(item.orderId, entry);
  }

  return Array.from(byOrder.values())
    .sort((a, b) => new Date(b.order.createdAt) - new Date(a.order.createdAt))
    .map(({ order, items: providerItems, providerSubtotal }) => ({
      ...formatOrderForUi({ ...order, items: providerItems }),
      providerSubtotal,
      providerSubtotalLabel: new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }).format(providerSubtotal),
      providerItemCount: providerItems.reduce((sum, item) => sum + item.quantity, 0),
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
