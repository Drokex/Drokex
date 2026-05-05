import Link from "next/link";
import Image from "next/image";
import { availabilityOptions, categoryOptions, getProducts } from "@/lib/products";
import MarketPrice from "@/app/components/market-price";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";
import CatalogHeart from "@/app/components/catalog-heart";
import CatalogThemeToggle from "@/app/components/catalog-theme-toggle";

const CATEGORY_META = {
  "Automatizacion industrial": {
    count: 127,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
        <path d="M22 12a10 10 0 0 1-10 10A10 10 0 0 1 2 12"/>
      </svg>
    ),
  },
  "Empaque y logistica": {
    count: 98,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
  },
  "Movilidad electrica": {
    count: 64,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  "Agroindustria": {
    count: 76,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V12M12 12C12 7 7 4 2 4c0 5 3 9 10 8M12 12c0-5 5-8 10-8-1 5-4 9-10 8"/>
      </svg>
    ),
  },
  "Retail y consumo": {
    count: 112,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
  },
  "Construccion modular": {
    count: 51,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
};

const AVAILABILITY_META = {
  "Entrega inmediata": {
    count: 132,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  "Disponible por pedido": {
    count: 214,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      </svg>
    ),
  },
  "Produccion programada": {
    count: 87,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
};

const ORIGIN_DATA = [
  { name: "Colombia", flag: "🇨🇴", count: 189 },
  { name: "China", flag: "🇨🇳", count: 245 },
  { name: "Turquía", flag: "🇹🇷", count: 68 },
  { name: "Estados Unidos", flag: "🇺🇸", count: 102 },
];

const COUNTRY_FLAG = {
  Nicaragua: "🇳🇮",
  Colombia: "🇨🇴",
  China: "🇨🇳",
  "Turquía": "🇹🇷",
  Turquia: "🇹🇷",
  "Estados Unidos": "🇺🇸",
  Mexico: "🇲🇽",
  Brasil: "🇧🇷",
  Peru: "🇵🇪",
};

function getInventoryLabel(state) {
  if (state === "out-of-stock") return "Agotado";
  if (state === "low-stock") return "Stock bajo";
  return "Disponible";
}

export default async function CategoriasPage() {
  const products = await getProducts();

  return (
    <main className="cdk-page cdk-light">
      <SiteHeader />
      <CatalogThemeToggle />

      <div className="shell cdk-layout">
        {/* ── Sidebar ── */}
        <aside className="cdk-sidebar">
          <div className="cdk-sidebar-header">
            <div>
              <p className="cdk-sidebar-kicker">FILTRAR POR</p>
              <p className="cdk-sidebar-desc">Refina por categoría, disponibilidad y accede rápido al panel comercial.</p>
            </div>
            <button className="cdk-filter-btn" aria-label="Filtros">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/>
              </svg>
            </button>
          </div>

          <div className="cdk-sidebar-section">
            <p className="cdk-section-label">CATEGORÍAS</p>
            {categoryOptions.map((cat) => {
              const meta = CATEGORY_META[cat] || {};
              return (
                <label key={cat} className="cdk-filter-row">
                  <span className="cdk-filter-icon">{meta.icon}</span>
                  <span className="cdk-filter-name">{cat}</span>
                  {meta.count && <span className="cdk-filter-count">{meta.count}</span>}
                </label>
              );
            })}
            <button className="cdk-show-more">
              Ver todas las categorías
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          <div className="cdk-sidebar-section">
            <p className="cdk-section-label">DISPONIBILIDAD</p>
            {availabilityOptions.map((opt) => {
              const meta = AVAILABILITY_META[opt] || {};
              return (
                <label key={opt} className="cdk-filter-row">
                  <span className="cdk-filter-icon">{meta.icon}</span>
                  <span className="cdk-filter-name">{opt}</span>
                  {meta.count && <span className="cdk-filter-count">{meta.count}</span>}
                </label>
              );
            })}
          </div>

          <div className="cdk-sidebar-section">
            <p className="cdk-section-label">ORIGEN</p>
            {ORIGIN_DATA.map((c) => (
              <label key={c.name} className="cdk-filter-row">
                <span className="cdk-filter-flag">{c.flag}</span>
                <span className="cdk-filter-name">{c.name}</span>
                <span className="cdk-filter-count">{c.count}</span>
              </label>
            ))}
            <button className="cdk-show-more">
              Ver más países
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          <button className="cdk-clear-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4"/>
            </svg>
            Limpiar filtros
          </button>
        </aside>

        {/* ── Main ── */}
        <div className="cdk-main">

          {/* Hero banner */}
          <div className="cdk-hero">
            <div className="cdk-hero-content">
              <p className="cdk-hero-eyebrow">DROKEX GLOBAL SOURCING</p>
              <h2 className="cdk-hero-title">
                Lleva tu portafolio al siguiente nivel con oferta internacional lista para <span>escalar.</span>
              </h2>
              <Link href="/registro" className="cdk-hero-cta">
                Explorar ofertas
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
              <div className="cdk-hero-trust">
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Proveedores verificados
                </span>
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Negociación segura
                </span>
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  Envíos internacionales
                </span>
              </div>
            </div>
            <Image src="/banner productor.jpg" alt="Drokex marketplace" fill className="cdk-hero-bg" style={{ objectFit: "cover", objectPosition: "center" }} />
          </div>

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
            {products.map((product) => {
              const flag = COUNTRY_FLAG[product.originCountry] || "";
              return (
                <article key={product.slug} className="cdk-card">
                  <div className="cdk-card-image-wrap" style={{ position: "relative" }}>
                    <Link href={`/producto/${product.slug}`} style={{ position: "absolute", inset: 0, display: "block" }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </Link>
                    <CatalogHeart />
                  </div>

                  <div className="cdk-card-body">
                    <div className="cdk-card-supplier-row">
                      <span className="cdk-card-supplier">{product.supplier}</span>
                      <span className="cdk-card-origin">{flag} {product.originCountry}</span>
                    </div>

                    <h2 className="cdk-card-name">
                      <Link href={`/producto/${product.slug}`}>{product.name}</Link>
                    </h2>

                    <div className="cdk-card-tags">
                      <span>{product.category}</span>
                      <span>{product.availability}</span>
                      <span>{getInventoryLabel(product.inventoryState)}</span>
                    </div>

                    <p className="cdk-card-offer-badge">
                      <span className="cdk-offer-dot" />
                      Oferta activa
                    </p>

                    <MarketPrice
                      priceValue={product.priceValue}
                      previousPriceValue={product.previousPriceValue}
                      baseCurrency={product.priceCurrency}
                      originCountry={product.originCountry}
                      className="cdk-market-price"
                    />

                    <div className="cdk-card-btns">
                      <Link href={`/producto/${product.slug}`} className="cdk-btn-outline">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        Ver detalles
                      </Link>
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
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <div>
                <strong>Drokex protege tu negocio</strong>
                <p>Conectamos oportunidades globales con seguridad y confianza.</p>
                <Link href="/sobre-nosotros" className="cdk-trust-link">Conoce cómo funciona <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg></Link>
              </div>
            </div>
            <div className="cdk-trust-item">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
              <div>
                <strong>Proveedores verificados</strong>
                <p>Validamos identidad, capacidad y cumplimiento.</p>
              </div>
            </div>
            <div className="cdk-trust-item">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <div>
                <strong>Transacciones seguras</strong>
                <p>Negocia con protección y pagos internacionales.</p>
              </div>
            </div>
            <div className="cdk-trust-item">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <div>
                <strong>Logística global</strong>
                <p>Soluciones de envío puerta a puerta con soporte experto.</p>
              </div>
            </div>
            <div className="cdk-trust-item">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 5.29 5.29l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <div>
                <strong>Soporte especializado</strong>
                <p>Acompañamiento real de nuestro equipo en cada paso.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
