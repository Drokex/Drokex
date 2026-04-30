import Link from "next/link";
import SiteHeader from "@/app/components/site-header";

function titleFromSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function ProveedorProStorePage({ params }) {
  const resolvedParams = await params;
  const brand = titleFromSlug(resolvedParams.slug || "Mi Tienda");

  return (
    <main className="min-h-screen bg-[#11100d] text-[#fff8ee]">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#1c1712]">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-8 py-5">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[#c89b5c]">
                Landing Proveedor Pro
              </p>
              <h1 className="mt-2 text-3xl font-black">{brand}</h1>
            </div>

            <Link
              href="/proveedor-pro"
              className="rounded-2xl bg-[#c89b5c] px-5 py-3 font-black text-[#15100a]"
            >
              Editar landing
            </Link>
          </header>

          <section className="min-h-[520px] bg-[radial-gradient(circle_at_75%_25%,rgba(200,155,92,.34),transparent_36%)] px-8 py-16">
            <span className="rounded-full bg-[#c89b5c]/15 px-4 py-2 text-sm font-black text-[#c89b5c]">
              Pagina publicada
            </span>

            <h2 className="mt-8 max-w-3xl text-6xl font-black leading-none">
              {brand} ya tiene una landing lista para compartir
            </h2>

            <p className="mt-6 max-w-xl text-lg text-[#c7b9a7]">
              Esta es una vista publica demo. El siguiente paso es conectar el
              constructor con base de datos para guardar imagenes, colores,
              productos y contenido de cada proveedor.
            </p>

            <button className="mt-8 rounded-2xl bg-[#c89b5c] px-8 py-4 font-black text-[#15100a]">
              Ver productos
            </button>
          </section>
        </div>
      </section>
    </main>
  );
}
