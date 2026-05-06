import { prisma } from "@/lib/prisma";
import DirectorioPage from "./directorio-client";

async function getSuppliers() {
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { supplier: true, category: true, originCountry: true, image: true },
  });

  const map = new Map();
  for (const p of products) {
    if (!map.has(p.supplier)) {
      map.set(p.supplier, { name: p.supplier, country: p.originCountry, image: p.image, categories: new Set(), productCount: 0 });
    }
    const s = map.get(p.supplier);
    s.categories.add(p.category);
    s.productCount += 1;
  }

  return Array.from(map.values())
    .map(s => ({ ...s, categories: Array.from(s.categories) }))
    .sort((a, b) => b.productCount - a.productCount);
}

async function getProLandings() {
  const landings = await prisma.proveedorProLanding.findMany({
    orderBy: { updatedAt: "desc" },
    select: { slug: true, store: true, products: true },
  });

  return landings.map(l => ({
    slug: l.slug,
    landing: { store: l.store || {}, products: Array.isArray(l.products) ? l.products : [] },
  }));
}

export default async function DirectorioServerPage() {
  const [suppliers, proLandings] = await Promise.all([getSuppliers(), getProLandings()]);

  return <DirectorioPage initialSuppliers={suppliers} initialProLandings={proLandings} />;
}
