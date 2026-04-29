import { prisma } from "@/lib/prisma";

export async function GET(request, context) {
  const { id } = await context.params;

  const product = await prisma.product.findUnique({ where: { id }, select: { image: true } });

  if (!product?.image || !product.image.startsWith("data:")) {
    return new Response(null, { status: 404 });
  }

  const [meta, base64] = product.image.split(",");
  const mimeType = meta.match(/data:([^;]+)/)?.[1] || "image/jpeg";
  const buffer = Buffer.from(base64, "base64");

  return new Response(buffer, {
    headers: {
      "Content-Type": mimeType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
