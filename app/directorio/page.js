import { prisma } from "@/lib/prisma";
import DirectorioPage from "./directorio-client";
import { getProducts } from "@/lib/products";

function canUseDirectoryFallback(error) {
  return error instanceof Error && /ENOTFOUND|ECONN|tenant\/user|DATABASE/i.test(error.message);
}

function getSuppliersFromProducts(products) {
  const map = new Map();

  for (const p of products) {
    if (!map.has(p.supplier)) {
      map.set(p.supplier, {
        name: p.supplier,
        country: p.originCountry,
        image: p.image,
        categories: new Set(),
        productCount: 0,
      });
    }

    const s = map.get(p.supplier);
    s.categories.add(p.category);
    s.productCount += 1;
  }

  return Array.from(map.values())
    .map((s) => ({ ...s, categories: Array.from(s.categories) }))
    .sort((a, b) => b.productCount - a.productCount);
}

async function getSuppliers() {
  if (!prisma) {
    return getSuppliersFromProducts(await getProducts());
  }

  const products = await prisma.product.findMany({
    where: { active: true },
    select: { supplier: true, category: true, originCountry: true, image: true },
  });

  return getSuppliersFromProducts(products);
}

async function getProLandings() {
  if (!prisma) return [];

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
  let suppliers = [];
  let proLandings = [];

  try {
    [suppliers, proLandings] = await Promise.all([getSuppliers(), getProLandings()]);
  } catch (error) {
    if (!canUseDirectoryFallback(error)) throw error;
    suppliers = getSuppliersFromProducts(await getProducts());
    proLandings = [];
  }

  return <DirectorioPage initialSuppliers={suppliers} initialProLandings={proLandings} />;
}
