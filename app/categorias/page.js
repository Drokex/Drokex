import Link from "next/link";
import Image from "next/image";
import { availabilityOptions, categoryOptions, getProducts } from "@/lib/products";
import MarketPrice from "@/app/components/market-price";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";

function getInventoryLabel(state) {
  if (state === "out-of-stock") return "Agotado";
  if (state === "low-stock") return "Stock bajo";
  return "Disponible";
}

function getDiscountPercent(price, previousPrice) {
  if (!price || !previousPrice || previousPrice <= price) return null;
  return Math.round(((previousPrice - price) / previousPrice) * 100);
}

export default async function CategoriasPage() {
  const products = await getProducts();

  return (
    <main className="commerce-page">
      <SiteHeader />
      <section className="catalog-banner">
        <Image
          src="/catalog-banner-orange.jpg"
          alt="Drokex marketplace internacional"
          fill
          priority
          sizes="100vw"
          className="catalog-banner-image"
        />
        <div className="catalog-banner-overlay" />
        <div className="shell catalog-banner-content">
          <div>
            <p className="section-tag">Marketplace Drokex</p>
            <h1>Oferta internacional lista para moverse.</h1>
            <p>
              Encuentra productos listos para escalar, conecta operaciones y organiza tu vitrina
              global desde una sola lectura.
            </p>
          </div>
        </div>
      </section>

      <section className="shell catalog-shell">
        <aside className="catalog-filters">
          <div className="filter-card filter-card-intro">
            <p className="filter-kicker">Filtrar por</p>
            <p className="filter-intro-copy">
              Refina por categoria, disponibilidad y acceso rapido al panel comercial.
            </p>
          </div>

          <div className="filter-card">
            <p className="filter-kicker">Categorias</p>
            <div className="filter-chip-list">
              {categoryOptions.map((category) => (
                <label key={category} className="filter-option-row">
                  <span className="filter-option-box" />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-card">
            <p className="filter-kicker">Disponibilidad</p>
            <div className="filter-chip-list">
              {availabilityOptions.map((item) => (
                <label key={item} className="filter-option-row">
                  <span className="filter-option-box" />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-card">
            <p className="filter-kicker">Origen</p>
            <div className="filter-chip-list">
              {["Colombia", "China", "Turquia"].map((item) => (
                <label key={item} className="filter-option-row">
                  <span className="filter-option-box" />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-card">
            <p className="filter-kicker">Panel</p>
            <Link href="/admin" className="green-link">
              Ir al administrador
            </Link>
          </div>
        </aside>

        <div className="catalog-results-panel">
          <div className="catalog-toolbar">
            <p>
              Mostrando <strong>{products.length}</strong> resultados disponibles
            </p>

          </div>

          <Link href="/registro" className="catalog-promo-banner">
            <div>
              <small>Drokex global sourcing</small>
              <strong>Lleva tu portafolio al siguiente nivel con oferta internacional lista para escalar.</strong>
            </div>
            <span>Comenzar</span>
          </Link>

          <div className="catalog-product-list">
            {products.map((product, index) => {
              const discount = getDiscountPercent(product.priceValue, product.previousPriceValue);

              return (
                <article key={product.slug} className="catalog-product-row">
                  <div className="catalog-product-row-top">
                    <h2>
                      <Link href={`/producto/${product.slug}`}>{product.name}</Link>
                    </h2>
                  </div>

                  <div className="catalog-product-row-body">
                    <Link href={`/producto/${product.slug}`} className="catalog-product-image-wrap">
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </Link>

                    <div className="catalog-product-main">
                      <div className="catalog-brand-line">
                        <span>{product.supplier}</span>
                        <span>{product.originCountry}</span>
                      </div>

                      <ul className="catalog-product-specs">
                        {product.technicalSpecs.slice(0, 3).map((spec) => (
                          <li key={`${product.slug}-${spec.etiqueta}`}>
                            <span>{spec.etiqueta}</span>
                            <strong>{spec.valor}</strong>
                          </li>
                        ))}
                      </ul>

                      <div className="catalog-product-tags">
                        <span>{product.category}</span>
                        <span>{product.availability}</span>
                        <span>{getInventoryLabel(product.inventoryState)}</span>
                      </div>

                      <div className="catalog-product-links">
                        <Link href={`/producto/${product.slug}`}>Ver mas detalles</Link>
                        <Link href="/mi-cuenta">Contactar proveedor</Link>
                      </div>
                    </div>

                    <div className="catalog-product-aside">
                      <div className="catalog-product-badges">
                        <span className="catalog-badge is-hot">Oferta activa</span>
                      </div>

                      <div className="catalog-price-wrap">
                        {discount ? <small className="catalog-discount">-{discount}%</small> : null}
                        <MarketPrice
                          priceValue={product.priceValue}
                          previousPriceValue={product.previousPriceValue}
                          baseCurrency={product.priceCurrency}
                          originCountry={product.originCountry}
                          className="market-price-block"
                        />
                      </div>

                      <Link href={`/producto/${product.slug}`} className="catalog-cart-button">
                        Ver producto
                      </Link>
                    </div>
                  </div>

                  {index === 0 ? (
                    <div className="catalog-row-promo">
                      <strong>Logistica lista para exportacion</strong>
                      <span>Activa proveedores, inventario y negociacion desde una sola vitrina comercial.</span>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
