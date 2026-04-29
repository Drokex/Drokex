import { createProduct, getAdminProducts } from "@/lib/products";

export async function GET() {
  const products = await getAdminProducts();
  return Response.json({ products });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const product = await createProduct(body);
    return Response.json({ product }, { status: 201 });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "No fue posible crear el producto.",
      },
      { status: 400 },
    );
  }
}
