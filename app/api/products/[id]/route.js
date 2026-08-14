import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { updateProduct, deleteProduct } from "@/lib/products";

async function assertOwnership(id, user) {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  if (!prisma) return true;
  const product = await prisma.product.findUnique({ where: { id }, select: { providerId: true } });
  return Boolean(product) && product.providerId === user.id;
}

export async function PATCH(request, context) {
  try {
    const { id } = await context.params;
    const user = await getCurrentUser();
    if (!(await assertOwnership(id, user))) {
      return Response.json({ error: "No autorizado." }, { status: 403 });
    }
    const body = await request.json();
    const product = await updateProduct(id, body);
    return Response.json({ product });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "No fue posible actualizar el producto." },
      { status: 400 },
    );
  }
}

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    const user = await getCurrentUser();
    if (!(await assertOwnership(id, user))) {
      return Response.json({ error: "No autorizado." }, { status: 403 });
    }
    await deleteProduct(id);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "No fue posible eliminar el producto." },
      { status: 400 },
    );
  }
}
