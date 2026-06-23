import { prisma } from "@/lib/prisma";
import DirectorioPage from "./directorio-client";
import { getProducts, getSampleStoreProducts } from "@/lib/products";

const _dirCache = globalThis.__drokexDirCache5 ?? { suppliers: null, proLandings: null, ts: 0 };
if (!globalThis.__drokexDirCache5) globalThis.__drokexDirCache5 = _dirCache;
const DIR_CACHE_TTL = 15_000;

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
    select: { supplier: true, category: true, originCountry: true },
  });

  return getSuppliersFromProducts(products);
}

async function getProLandings() {
  if (!prisma) return [];

  // Selecciona solo slug y store (sin products que puede tener imágenes base64 pesadas)
  const landings = await prisma.proveedorProLanding.findMany({
    orderBy: { updatedAt: "desc" },
    select: { slug: true, store: true },
  });

  return landings.map(({ slug, store }) => {
    const s = (store && typeof store === "object") ? store : {};
    const countries = Array.isArray(s.countries) ? s.countries : (s.country ? [s.country] : []);
    return {
      slug,
      landing: {
        store: {
          brand: s.brand || null,
          country: countries[0] || null,
          countries,
          primaryColor: s.primaryColor || null,
          logo: s.logo || null,
          heroImage: s.heroImage || null,
        },
        products: [],
      },
    };
  });
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

  try {
    [suppliers, proLandings] = await withTimeout(
      Promise.all([getSuppliers(), getProLandings()]),
      8000
    );
    _dirCache.suppliers = suppliers;
    _dirCache.proLandings = proLandings;
    _dirCache.ts = Date.now();
  } catch (error) {
    if (!canUseDirectoryFallback(error)) throw error;
    suppliers = getSuppliersFromProducts(getSampleStoreProducts());
    proLandings = [];
    _dirCache.suppliers = suppliers;
    _dirCache.proLandings = proLandings;
    _dirCache.ts = Date.now();
  }

  return <DirectorioPage initialSuppliers={suppliers} initialProLandings={proLandings} />;
}
