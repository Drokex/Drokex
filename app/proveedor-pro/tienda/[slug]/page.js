import SiteHeader from "@/app/components/site-header";
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

  return (
    <main className="min-h-screen bg-[#11100d] text-[#fff8ee]">
      <SiteHeader />
      <ProveedorProStoreClient slug={slug} fallbackBrand={brand} />
    </main>
  );
}
