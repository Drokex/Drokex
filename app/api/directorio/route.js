import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase().trim() || "";

  const products = await prisma.product.findMany({
    where: { active: true },
    select: {
      supplier: true,
      category: true,
      originCountry: true,
      image: true,
    },
  });

  const suppliersMap = new Map();

  for (const p of products) {
    if (!suppliersMap.has(p.supplier)) {
      suppliersMap.set(p.supplier, {
        name: p.supplier,
        country: p.originCountry,
        image: p.image,
        categories: new Set(),
        productCount: 0,
      });
    }
    const s = suppliersMap.get(p.supplier);
    s.categories.add(p.category);
    s.productCount += 1;
  }

  let suppliers = Array.from(suppliersMap.values()).map((s) => ({
    ...s,
    categories: Array.from(s.categories),
  }));

  if (query) {
    suppliers = suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.categories.some((c) => c.toLowerCase().includes(query)) ||
        s.country.toLowerCase().includes(query)
    );
  }

  suppliers.sort((a, b) => b.productCount - a.productCount);

  return NextResponse.json({ suppliers });
}
