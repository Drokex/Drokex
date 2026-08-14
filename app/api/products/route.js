import { getCurrentUser } from "@/lib/current-user";
import { createProduct, getAdminProducts } from "@/lib/products";

export async function GET() {
  const products = await getAdminProducts();
  return Response.json({ products });
}

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "No autorizado." }, { status: 401 });
    }
    const body = await request.json();
    const product = await createProduct(body, user.id);
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
