import { updateProduct, deleteProduct } from "@/lib/products";

export async function PATCH(request, context) {
  try {
    const { id } = await context.params;
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
    await deleteProduct(id);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "No fue posible eliminar el producto." },
      { status: 400 },
    );
  }
}
