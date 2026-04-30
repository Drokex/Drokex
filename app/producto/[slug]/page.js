import Link from "next/link";
import { getProductBySlug, getProducts } from "@/lib/products";
import MarketPrice from "@/app/components/market-price";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";
import QuoteButton from "@/app/components/quote-button";
import ProductGallery from "@/app/components/product-gallery";
import ProductAccordion from "@/app/components/product-accordion";

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
    <main className="pd-page">
      <SiteHeader />

      <section className="shell pd-shell">
        <div className="pd-breadcrumbs">
          <Link href="/">Inicio</Link>
          <span>/</span>
          <Link href="/productos">Productos</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="pd-grid">
          <ProductGallery gallery={gallery} productName={product.name} />

          <div className="pd-info-panel">
            <p className="pd-offer-badge">OFERTA DROKEX</p>
            <h1 className="pd-title">{product.name}</h1>
            <p className="pd-subline">
              {product.originCountry}
              {" · "}
              <span className="pd-supplier">{product.supplier}</span>
              {" · "}
              {product.category}
            </p>

            <div className="pd-price-block">
              <MarketPrice
                priceValue={product.priceValue}
                previousPriceValue={product.previousPriceValue}
                baseCurrency={product.priceCurrency}
                originCountry={product.originCountry}
                className="pd-market-price"
              />
            </div>

            <div className="pd-tags">
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                {product.availability}
              </span>
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                Stock {product.stock}
              </span>
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                {product.marketFocus || "Mercado global"}
              </span>
            </div>

            <QuoteButton productId={product.id} productName={product.name} />

            <div className="pd-trust-row">
              <span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Proveedores verificados
              </span>
              <span>·</span>
              <span>Negociación segura</span>
              <span>·</span>
              <span>Envíos internacionales</span>
            </div>

            <ProductAccordion product={product} />
          </div>
        </div>
      </section>

      <div className="pd-features-bar">
        <div className="shell pd-features-inner">
          <div className="pd-feature">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <div>
              <strong>Negociación segura</strong>
              <p>Protegemos tu información y las transacciones.</p>
            </div>
          </div>
          <div className="pd-feature">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <div>
              <strong>Envíos internacionales</strong>
              <p>Llegamos a donde tu negocio nos necesite.</p>
            </div>
          </div>
          <div className="pd-feature">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <div>
              <strong>Calidad verificada</strong>
              <p>Proveedores verificados para tu tranquilidad.</p>
            </div>
          </div>
          <div className="pd-feature">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 5.29 5.29l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <div>
              <strong>Soporte especializado</strong>
              <p>Acompañamiento real en cada paso del proceso.</p>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
