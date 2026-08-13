import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/products";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";
import CatalogHeart from "@/app/components/catalog-heart";
import CatalogThemeToggle from "@/app/components/catalog-theme-toggle";
import CatalogSidebar from "@/app/components/catalog-sidebar";
import CatalogHeroCarousel from "@/app/components/catalog-hero-carousel";

const COUNTRY_FLAG = {
  Nicaragua: "🇳🇮", Colombia: "🇨🇴", China: "🇨🇳",
  "Turquía": "🇹🇷", Turquia: "🇹🇷", "Estados Unidos": "🇺🇸",
  Mexico: "🇲🇽", Brasil: "🇧🇷", Peru: "🇵🇪",
};

function getInventoryLabel(state) {
  if (state === "out-of-stock") return "Agotado";
  if (state === "low-stock") return "Stock bajo";
  return "Disponible";
}

function toArray(val) {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

export default async function CategoriasPage({ searchParams }) {
  const params = await searchParams;
  const selectedCategories = toArray(params?.categoria);
  const selectedAvailability = toArray(params?.disponibilidad);
  const selectedOrigin = toArray(params?.origen);

  let products = await getProducts();

  if (selectedCategories.length > 0)
    products = products.filter(p => selectedCategories.includes(p.category));
  if (selectedAvailability.length > 0)
    products = products.filter(p => selectedAvailability.includes(p.availability));
  if (selectedOrigin.length > 0)
    products = products.filter(p => selectedOrigin.includes(p.originCountry));

  return (
    <main className="cdk-page cdk-light">
      <SiteHeader />
      <CatalogThemeToggle />

      <div className="shell cdk-layout">
        <CatalogSidebar />

        {/* ── Main ── */}
        <div className="cdk-main">

          {/* Hero carousel */}
          <CatalogHeroCarousel />

          {/* Toolbar */}
          <div className="cdk-toolbar">
            <p>Mostrando <strong>{products.length}</strong> resultados disponibles</p>
            <button className="cdk-sort-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              Más relevantes
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>

          {/* Product grid */}
          <div className="cdk-grid">
            {products.length === 0 ? (
              <div className="cdk-no-results">
                <p>No hay productos con los filtros seleccionados.</p>
                <Link href="/productos" className="cdk-btn-primary">Limpiar filtros</Link>
              </div>
            ) : products.map((product) => {
              const flag = COUNTRY_FLAG[product.originCountry] || "";
              return (
                <article key={product.slug} className="cdk-card">
                  <div className="cdk-card-image-wrap" style={{ position: "relative" }}>
                    <Link href={`/producto/${product.slug}`} style={{ position: "absolute", inset: 0, display: "block" }}>
                      <img src={product.image} alt={product.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    </Link>
                    <CatalogHeart />
                  </div>
                  <div className="cdk-card-body">
                    <div className="cdk-card-supplier-row">
                      <span className="cdk-card-supplier">{product.supplier}</span>
                      <span className="cdk-card-origin">{flag} {product.originCountry}</span>
                    </div>
                    <h2 className="cdk-card-name"><Link href={`/producto/${product.slug}`}>{product.name}</Link></h2>
                    <div className="cdk-card-tags">
                      <span>{product.category}</span>
                      <span>{product.availability}</span>
                      <span>{getInventoryLabel(product.inventoryState)}</span>
                    </div>
                    <p className="cdk-card-offer-badge"><span className="cdk-offer-dot" />Oferta activa</p>
                    <div className="cdk-card-btns">
                      <Link href={`/producto/${product.slug}`} className="cdk-btn-primary">
                        Ver producto
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Bottom trust bar */}
          <div className="cdk-bottom-trust">
            <div className="cdk-trust-item">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <div>
                <strong>Tu vitrina global</strong>
                <p>Publica tus productos y hazlos visibles para compradores en cualquier país del mundo.</p>
                <a href="https://wa.me/573115312623?text=Hola%2C%20quiero%20publicar%20mis%20productos%20en%20Drokex" target="_blank" rel="noopener noreferrer" className="cdk-trust-link">
                  Publicar mis productos <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </a>
              </div>
            </div>
            <div className="cdk-trust-item">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <div><strong>Compradores reales</strong><p>Conecta directo con importadores, distribuidores y empresas de todo el mundo.</p></div>
            </div>
            <div className="cdk-trust-item">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              <div><strong>Catálogo digital</strong><p>Tu empresa y productos siempre disponibles, sin horarios y sin fronteras.</p></div>
            </div>
            <div className="cdk-trust-item">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
              <div><strong>Empresa verificada</strong><p>Tu negocio lleva el sello Drokex: confianza y credibilidad ante cualquier comprador.</p></div>
            </div>
            <div className="cdk-trust-item">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              <div><strong>Sin comisiones</strong><p>Vende y negocia directamente con tus clientes, sin intermediarios ni cobros ocultos.</p></div>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
