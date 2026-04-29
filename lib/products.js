import { prisma } from "@/lib/prisma";
import {
  availabilityOptions,
  categoryOptions,
  sampleProducts,
} from "@/lib/sample-products";
import { formatMoney, inferCurrencyFromOriginCountry } from "@/lib/market-pricing";

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeImage(value) {
  const image = (value || "").trim();

  if (
    image.startsWith("/") ||
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  return "";
}

function normalizeTextList(values) {
  return (values || []).map((item) => (item || "").trim()).filter(Boolean);
}

function normalizeSpecs(specs) {
  if (!Array.isArray(specs)) return [];

  return specs
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const label = typeof item.etiqueta === "string" ? item.etiqueta.trim() : "";
      const value = typeof item.valor === "string" ? item.valor.trim() : "";
      if (!label || !value) return null;
      return { etiqueta: label, valor: value };
    })
    .filter(Boolean);
}

function inventoryTone(stock, minimumStock) {
  if (stock <= 0) return "out-of-stock";
  if (stock <= minimumStock) return "low-stock";
  return "in-stock";
}

function toStoreProduct(product) {
  const priceCurrency = inferCurrencyFromOriginCountry(product.originCountry);

  return {
    id: product.id || product.slug,
    slug: product.slug,
    sku: product.sku || "",
    supplier: product.supplier,
    originCountry: product.originCountry,
    category: product.category,
    name: product.name,
    priceCurrency,
    priceValue: product.price,
    previousPriceValue: product.previousPrice,
    price: formatMoney(product.price, priceCurrency),
    previousPrice: formatMoney(product.previousPrice, priceCurrency),
    stock: product.stock,
    minimumStock: product.minimumStock,
    inventoryState: inventoryTone(product.stock, product.minimumStock),
    image: product.id && normalizeImage(product.image)?.startsWith("data:")
      ? `/api/products/${product.id}/image`
      : normalizeImage(product.image),
    galleryImages: normalizeTextList(product.galleryImages).map(normalizeImage).filter(Boolean),
    availability: product.availability,
    shortDescription: product.shortDescription,
    description: product.description,
    application: product.application || "",
    marketFocus: product.marketFocus || "",
    compatibility: normalizeTextList(product.compatibility),
    technicalSpecs: normalizeSpecs(product.technicalSpecs),
    featured: Boolean(product.featured),
    active: product.active !== false,
  };
}

export async function getProducts() {
  if (!prisma) {
    return sampleProducts.map(toStoreProduct);
  }

  const records = await prisma.product.findMany({
    where: { active: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return records.map(toStoreProduct);
}

export async function getAdminProducts() {
  if (!prisma) {
    return sampleProducts.map(toStoreProduct);
  }

  const records = await prisma.product.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return records.map(toStoreProduct);
}

export async function getProductBySlug(slug) {
  const products = await getProducts();
  return products.find((item) => item.slug === slug) || null;
}

function normalizeProductInput(input) {
  const name = (input.name || "").trim();
  const slug = (input.slug || "").trim() || slugify(name);

  if (!name) {
    throw new Error("El nombre es obligatorio.");
  }

  return {
    slug,
    sku: (input.sku || "").trim() || null,
    supplier: (input.supplier || "").trim() || "Drokex Supplier",
    originCountry: (input.originCountry || "").trim() || "Colombia",
    category: categoryOptions.includes(input.category) ? input.category : categoryOptions[0],
    name,
    price: Number(input.priceValue || 0),
    previousPrice: Number(input.previousPriceValue || input.priceValue || 0),
    stock: Number(input.stock || 0),
    minimumStock: Number(input.minimumStock || 0),
    image: normalizeImage(input.image),
    galleryImages: normalizeTextList(input.galleryImages).map(normalizeImage).filter(Boolean),
    availability: availabilityOptions.includes(input.availability)
      ? input.availability
      : availabilityOptions[0],
    shortDescription: (input.shortDescription || "").trim(),
    description: (input.description || "").trim(),
    application: (input.application || "").trim() || null,
    marketFocus: (input.marketFocus || "").trim() || null,
    compatibility: normalizeTextList(input.compatibility),
    technicalSpecs: normalizeSpecs(input.technicalSpecs),
    featured: Boolean(input.featured),
    active: input.active !== false,
  };
}

export async function createProduct(input) {
  const payload = normalizeProductInput(input);

  if (!prisma) {
    return toStoreProduct(payload);
  }

  const created = await prisma.product.create({
    data: payload,
  });

  await prisma.inventoryMovement.create({
    data: {
      productId: created.id,
      type: "CREATED",
      quantity: created.stock,
      stockAfter: created.stock,
      note: "Producto creado desde el panel Drokex.",
    },
  });

  return toStoreProduct(created);
}

export async function updateProduct(id, input) {
  const payload = normalizeProductInput(input);

  if (!prisma) {
    return toStoreProduct({ id, ...payload });
  }

  const updated = await prisma.product.update({
    where: { id },
    data: payload,
  });

  return toStoreProduct(updated);
}

export async function getInventoryMovements() {
  if (!prisma) {
    return [];
  }

  const records = await prisma.inventoryMovement.findMany({
    orderBy: { createdAt: "desc" },
    take: 12,
    include: { product: true },
  });

  return records.map((record) => ({
    id: record.id,
    productName: record.product.name,
    productSlug: record.product.slug,
    type: record.type,
    quantity: record.quantity,
    stockAfter: record.stockAfter,
    note: record.note,
    createdAt: record.createdAt,
  }));
}

export async function deleteProduct(id) {
  if (!prisma) return;
  await prisma.product.delete({ where: { id } });
}

export { availabilityOptions, categoryOptions };
