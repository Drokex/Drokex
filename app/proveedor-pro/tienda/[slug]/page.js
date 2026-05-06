import { prisma } from "@/lib/prisma";
import ProveedorProStoreClient from "./store-client";

function titleFromSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function ProveedorProStorePage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || "mi-tienda";
  const brand = titleFromSlug(slug);

  let initialStore = null;
  let initialProducts = null;

  try {
    const landing = await prisma.proveedorProLanding.findUnique({ where: { slug } });
    if (landing) {
      initialStore = landing.store;
      initialProducts = landing.products;
    }
  } catch {}

  return (
    <main className="min-h-screen bg-[#11100d] text-[#fff8ee]">
      <ProveedorProStoreClient
        slug={slug}
        fallbackBrand={brand}
        initialStore={initialStore}
        initialProducts={initialProducts}
      />
    </main>
  );
}
