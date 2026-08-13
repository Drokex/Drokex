import ProductosClient from "./productos-client";

function titleFromSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function ProductosPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || "mi-tienda";
  const brand = titleFromSlug(slug);

  return (
    <main className="min-h-screen">
      <ProductosClient slug={slug} fallbackBrand={brand} />
    </main>
  );
}
