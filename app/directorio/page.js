import { prisma } from "@/lib/prisma";
import DirectorioPage from "./directorio-client";
import { getProducts, getSampleStoreProducts } from "@/lib/products";
import { getProLandingsLite } from "@/lib/proveedor-pro-landings";

const _dirCache = globalThis.__drokexDirCache6 ?? { suppliers: null, proLandings: null, ts: 0 };
if (!globalThis.__drokexDirCache6) globalThis.__drokexDirCache6 = _dirCache;
const DIR_CACHE_TTL = 15_000;

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
    select: { supplier: true, category: true, originCountry: true },
  });

  return getSuppliersFromProducts(products);
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("DATABASE timeout")), ms)
    ),
  ]);
}

export default async function DirectorioServerPage() {
  // Devolver caché si está vigente
  if (_dirCache.suppliers && Date.now() - _dirCache.ts < DIR_CACHE_TTL) {
    return <DirectorioPage initialSuppliers={_dirCache.suppliers} initialProLandings={_dirCache.proLandings} />;
  }

  let suppliers = [];
  let proLandings = [];

  // Queries independientes: si uno falla/timeout el otro no se pierde
  const [suppliersResult, landingsResult] = await Promise.allSettled([
    withTimeout(getSuppliers(), 10000),
    withTimeout(getProLandingsLite(), 10000),
  ]);

  if (suppliersResult.status === "fulfilled") {
    suppliers = suppliersResult.value;
  } else {
    suppliers = getSuppliersFromProducts(getSampleStoreProducts());
  }

  if (landingsResult.status === "fulfilled") {
    proLandings = landingsResult.value;
  }
  // si landings falla, queda [] — no borrar lo que había en caché anterior
  else if (_dirCache.proLandings) {
    proLandings = _dirCache.proLandings;
  }

  _dirCache.suppliers = suppliers;
  _dirCache.proLandings = proLandings;
  _dirCache.ts = Date.now();

  return <DirectorioPage initialSuppliers={suppliers} initialProLandings={proLandings} />;
}
