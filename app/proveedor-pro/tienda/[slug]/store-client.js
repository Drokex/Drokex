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
  productCtaText: "Agregar al carrito",
  finalEyebrow: "Listo para comprar",
  finalTitle: "Descubre la coleccion de Mi Tienda",
  finalCtaText: "Ver catalogo",
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

export default function ProveedorProStoreClient({ slug, fallbackBrand }) {
  const [store, setStore] = useState({ ...fallbackStore, brand: fallbackBrand || fallbackStore.brand });
  const [products, setProducts] = useState(fallbackProducts);
  const [notFound, setNotFound] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(`drokex-proveedor-pro:${slug}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStore({ ...fallbackStore, brand: fallbackBrand || fallbackStore.brand, ...(parsed.store || {}) });
        setProducts(parsed.products?.length ? parsed.products : fallbackProducts);
      } catch {
        setNotFound(true);
      }
    } else {
      setNotFound(true);
    }
    setHasLoaded(true);
  }, [slug, fallbackBrand]);

  const bg = store.backgroundColor || "#fff";
  const primary = store.primaryColor || "#ff9f2e";
  const muted = store.mutedTextColor || "#666";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: bg }}>
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
      <div style={{ paddingTop: 0, backgroundColor: bg, minHeight: "100vh" }}>
        <LandingPreview store={store} products={products} standalone />
      </div>
    </div>
  );
}
