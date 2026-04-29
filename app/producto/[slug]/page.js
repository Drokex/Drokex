import Link from "next/link";
import { getProductBySlug, getProducts } from "@/lib/products";
import MarketPrice from "@/app/components/market-price";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";
import QuoteButton from "@/app/components/quote-button";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
        return (
          <main className="commerce-page">
            <SiteHeader />
            <section className="shell empty-state">
              <h1>Producto no encontrado</h1>
              <p>Este producto no existe o ya no esta disponible en el catalogo.</p>
              <Link href="/productos" className="green-link">
                Volver al catalogo
              </Link>
            </section>
            <SiteFooter />
          </main>
        );
  }

  const gallery = [product.image, ...product.galleryImages].filter(Boolean);

  return (
    <main className="commerce-page">
      <SiteHeader />
      <section className="shell product-detail-shell">
        <div className="product-breadcrumbs">
          <Link href="/">Inicio</Link>
          <span>/</span>
          <Link href="/productos">Productos</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="product-detail-grid">
          <div className="product-gallery-panel">
            <div className="detail-image-main">
              <img
                src={gallery[0]}
                alt={product.name}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {gallery.length > 1 ? (
              <div className="detail-thumb-grid">
                {gallery.slice(1).map((image, i) => (
                  <div key={i} className="detail-thumb">
                    <img src={image} alt={product.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="product-info-panel">
            <p className="section-tag">Oferta Drokex</p>
            <h1>{product.name}</h1>
            <p className="detail-subline">
              {product.originCountry} · {product.supplier} · {product.category}
            </p>
            <p className="detail-copy">{product.description}</p>

            <div className="detail-price-row">
              <MarketPrice
                priceValue={product.priceValue}
                previousPriceValue={product.previousPriceValue}
                baseCurrency={product.priceCurrency}
                originCountry={product.originCountry}
                className="market-price-block market-price-block-detail"
              />
            </div>

            <div className="detail-tag-grid">
              <span>{product.availability}</span>
              <span>Stock {product.stock}</span>
              <span>{product.marketFocus || "Mercado global"}</span>
            </div>

            <QuoteButton productId={product.id} productName={product.name} />

            <div className="detail-panel-block">
              <h2>Aplicacion</h2>
              <p>{product.application || "Producto listo para operaciones internacionales y nuevas oportunidades comerciales."}</p>
            </div>

            <div className="detail-panel-block">
              <h2>Compatibilidad</h2>
              <div className="detail-tag-grid">
                {product.compatibility.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <div className="detail-panel-block">
              <h2>Ficha tecnica</h2>
              <div className="spec-grid">
                {product.technicalSpecs.map((spec) => (
                  <article key={`${spec.etiqueta}-${spec.valor}`} className="spec-card">
                    <span>{spec.etiqueta}</span>
                    <strong>{spec.valor}</strong>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
