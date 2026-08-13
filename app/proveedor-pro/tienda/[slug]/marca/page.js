import MarcaClient from "./marca-client";

function titleFromSlug(slug) {
  return slug.split("-").filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export default async function MarcaPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || "mi-tienda";
  return (
    <main className="min-h-screen">
      <MarcaClient slug={slug} fallbackBrand={titleFromSlug(slug)} />
    </main>
  );
}
