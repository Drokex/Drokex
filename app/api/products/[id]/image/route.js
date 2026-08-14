import { prisma } from "@/lib/prisma";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export async function GET(request, context) {
  const { id } = await context.params;

  const product = await prisma.product.findUnique({ where: { id }, select: { image: true } });

  if (!product?.image || !product.image.startsWith("data:")) {
    return new Response(null, { status: 404 });
  }

  const [meta, base64] = product.image.split(",");
  const mimeType = meta.match(/data:([^;]+)/)?.[1] || "";

  if (!ALLOWED_IMAGE_TYPES.has(mimeType)) {
    return new Response(null, { status: 404 });
  }

  const buffer = Buffer.from(base64, "base64");

  return new Response(buffer, {
    headers: {
      "Content-Type": mimeType,
      "Cache-Control": "public, max-age=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
