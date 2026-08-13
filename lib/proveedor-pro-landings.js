import { prisma } from "@/lib/prisma";

// `store` es un JSONB con heroImage/logo en base64 (hasta ~2-3MB por fila) —
// pedir la columna completa vía Prisma select cuelga el pooler de Supabase
// (pgbouncer transaction mode) en listados con varias filas. Se leen solo los
// campos livianos del listado con json path a nivel de SQL; heroImage/logo se
// cargan aparte por tienda vía /api/proveedor-pro/thumbnail (ya usado por el cliente).
export async function getProLandingsLite() {
  if (!prisma) return [];

  const rows = await prisma.$queryRaw`
    SELECT
      slug,
      store->>'brand' AS brand,
      store->>'country' AS country,
      store->'countries' AS countries,
      store->>'primaryColor' AS "primaryColor"
    FROM "ProveedorProLanding"
    ORDER BY "updatedAt" DESC
  `;

  return rows.map(({ slug, brand, country, countries, primaryColor }) => {
    const countryList = Array.isArray(countries) ? countries : country ? [country] : [];
    return {
      slug,
      landing: {
        store: {
          brand: brand || null,
          country: countryList[0] || null,
          countries: countryList,
          primaryColor: primaryColor || null,
          logo: null,
          heroImage: null,
        },
        products: [],
      },
    };
  });
}
