"use client";

import { useEffect, useState } from "react";
import LandingPreview, { hexToRgba } from "@/app/components/landing-preview";

const fallbackStore = {
  brand: "Mi Tienda",
  country: "Colombia",
  logo: "",
  heroTitle: "Tu landing ya esta lista para compartir",
  heroSubtitle: "Vuelve al constructor para crear o actualizar el contenido de esta tienda.",
  heroImage: "",
  ctaText: "Ver productos",
  secondaryCtaText: "Conocer marca",
  promoText: "Pagina publicada",
  headerCtaText: "Comprar",
  trustEyebrow: "Vitrina activa",
  trustText: "Compra directa, identidad propia y productos listos para compartir con clientes.",
  stockLabel: "Stock",
  stockValue: "Local",
  partner1: "Apple", partner2: "Microsoft", partner3: "Google", partner4: "Zoho",
  searchTitle: "Busca productos",
  searchPlaceholder: "Buscar en esta tienda...",
  searchButtonText: "Buscar",
  aboutTitle: "Contenido pendiente de sincronizar",
  aboutText: "Esta vista usa los datos guardados en este navegador cuando presionas Crear landing.",
  bannerSecondary: "",
  benefit1: "Landing personalizada", benefit1Text: "Una razon clara para confiar en la marca antes de comprar.",
  benefit2: "Productos destacados", benefit2Text: "Entrega una promesa comercial concreta y facil de entender.",
  benefit3: "Link para compartir", benefit3Text: "Refuerza seguridad, respaldo y decision de compra.",
  catalogEyebrow: "Catalogo",
  catalogTitle: "Productos destacados",
  catalogText: "Selecciona, cotiza o compra productos directamente desde la vitrina del proveedor.",
  productCtaText: "Contactar",
  finalEyebrow: "Listo para comprar",
  finalTitle: "Descubre la coleccion de Mi Tienda",
  finalCtaText: "Ver catalogo",
  catalogPdf: "",
  primaryColor: "#ff9f2e",
  backgroundColor: "#fff7fb",
  surfaceColor: "#ffffff",
  textColor: "#191421",
  mutedTextColor: "#6f6477",
  buttonTextColor: "#ffffff",
  gradientFromColor: "#b86cff",
  gradientToColor: "#ff7db8",
  nav1: "Inicio", nav2: "Productos", nav3: "Marca",
  heroTitleSize: 60, heroTitleColor: "",
  heroSubtitleSize: 18, heroSubtitleColor: "",
  aboutTitleSize: 36, aboutTitleColor: "",
  aboutBodySize: 16, aboutBodyColor: "",
};

const fallbackProducts = [
  {
    name: "Producto destacado",
    category: "Coleccion",
    price: "0",
    stock: "Disponible",
    image: "",
    description: "Agrega productos desde el constructor para completar esta vitrina.",
  },
];

export default function ProveedorProStoreClient({ slug, fallbackBrand, initialStore, initialProducts }) {
  const [store, setStore] = useState(() => ({
    ...fallbackStore,
    brand: fallbackBrand || fallbackStore.brand,
    ...(initialStore || {}),
  }));
  const [products, setProducts] = useState(() =>
    initialProducts?.length ? initialProducts : fallbackProducts
  );
  const [notFound, setNotFound] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(!!initialStore);

  useEffect(() => {
    // Siempre revisar localStorage primero — puede tener datos más frescos que el server
    // (el flujo optimista guarda ahí antes de que Supabase responda)
    try {
      const saved = window.localStorage.getItem(`drokex-proveedor-pro:${slug}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        const localTs = parsed.savedAt || 0;
        const serverTs = initialStore?.__savedAt || 0;
        if (!initialStore || localTs > serverTs) {
          setStore({ ...fallbackStore, brand: fallbackBrand || fallbackStore.brand, ...(parsed.store || {}) });
          setProducts(parsed.products?.length ? parsed.products : fallbackProducts);
          setHasLoaded(true);
          return;
        }
      }
    } catch {}

    if (initialStore) { setHasLoaded(true); return; }

    async function load() {
      try {
        const res = await fetch(`/api/proveedor-pro?slug=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          setStore({ ...fallbackStore, brand: fallbackBrand || fallbackStore.brand, ...(data.store || {}) });
          setProducts(data.products?.length ? data.products : fallbackProducts);
          setHasLoaded(true);
          return;
        }
      } catch {}
      try {
        const saved = window.localStorage.getItem(`drokex-proveedor-pro:${slug}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          setStore({ ...fallbackStore, brand: fallbackBrand || fallbackStore.brand, ...(parsed.store || {}) });
          setProducts(parsed.products?.length ? parsed.products : fallbackProducts);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      }
      setHasLoaded(true);
    }
    load();
  }, [slug, fallbackBrand, initialStore]);

  const bg = store.backgroundColor || "#fff";
  const primary = store.primaryColor || "#ff9f2e";
  const muted = store.mutedTextColor || "#666";

  const contactLink = store.contactLink || "";
  const contactHref = contactLink
    ? /^https?:\/\//i.test(contactLink)
      ? contactLink
      : `https://wa.me/${contactLink.replace(/\D/g, "")}`
    : null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: bg }}>
      {contactHref && (
        <a
          href={contactHref}
          target="_blank"
          rel="noopener noreferrer"
          title="Contactar al proveedor"
          style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 100,
            width: 56, height: 56, borderRadius: "50%",
            background: "#25D366", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 28px rgba(37,211,102,0.45)",
            transition: "transform 0.15s, box-shadow 0.15s",
            textDecoration: "none",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(37,211,102,0.55)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(37,211,102,0.45)"; }}
        >
          <svg width="28" height="28" viewBox="0 0 32 32" fill="currentColor">
            <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.504L4 29l7.723-1.795A12.94 12.94 0 0 0 16 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10a10.94 10.94 0 0 1-5.586-1.537l-.396-.242-4.588 1.066 1.11-4.478-.258-.41A9.96 9.96 0 0 1 6 15c0-5.523 4.477-10 10-10zm-2.4 5.2c-.24 0-.627.09-.955.45-.328.36-1.25 1.22-1.25 2.975 0 1.754 1.28 3.45 1.46 3.69.18.24 2.508 3.83 6.077 5.218.848.326 1.51.52 2.026.666.851.241 1.626.207 2.238.126.683-.09 2.103-.86 2.4-1.69.299-.83.299-1.543.21-1.69-.09-.15-.33-.24-.69-.42-.36-.18-2.13-1.05-2.46-1.17-.33-.12-.57-.18-.81.18-.24.36-.93 1.17-1.14 1.41-.21.24-.42.27-.78.09-.36-.18-1.52-.56-2.9-1.79-1.072-.957-1.796-2.137-2.007-2.497-.21-.36-.022-.555.158-.735.162-.16.36-.42.54-.63.18-.21.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.81-1.95-1.11-2.67-.29-.7-.59-.6-.81-.61-.21-.01-.45-.01-.69-.01z"/>
          </svg>
        </a>
      )}
      {notFound && hasLoaded && (
        <div style={{
          position: "fixed", inset: "16px auto auto 50%", transform: "translateX(-50%)",
          zIndex: 50, maxWidth: 560, width: "calc(100% - 32px)",
          borderRadius: 20, border: "1px solid rgba(0,0,0,0.1)",
          padding: "16px 20px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          backdropFilter: "blur(16px)", backgroundColor: hexToRgba(store.surfaceColor || "#fff", 0.95),
        }}>
          <p style={{ margin: 0, fontWeight: 900, color: primary }}>
            Esta landing todavía no tiene datos en este navegador.
          </p>
          <p style={{ margin: "4px 0 0", fontSize: "0.88rem", color: muted }}>
            Vuelve al constructor, ajusta la tienda y presiona <strong>Publicar</strong> para guardar el contenido en este link.
          </p>
        </div>
      )}
      <div style={{ backgroundColor: bg, minHeight: "100vh" }}>
        <LandingPreview store={store} products={products} standalone basePath={`/proveedor-pro/tienda/${slug}`} />
      </div>
    </div>
  );
}
