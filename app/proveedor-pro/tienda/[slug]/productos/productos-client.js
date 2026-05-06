"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { hexToRgba } from "@/app/components/landing-preview";

const fallbackStore = {
  brand: "Mi Tienda",
  primaryColor: "#ff9f2e",
  backgroundColor: "#fff7fb",
  surfaceColor: "#ffffff",
  textColor: "#191421",
  mutedTextColor: "#6f6477",
  buttonTextColor: "#ffffff",
  catalogEyebrow: "Catálogo",
  catalogTitle: "Productos destacados",
  catalogText: "Selecciona, cotiza o compra productos directamente desde la vitrina del proveedor.",
  productCtaText: "Agregar al carrito",
  logo: "",
};

const fallbackProducts = [
  { name: "Producto destacado", category: "Colección", price: "0", stock: "Disponible", image: "", description: "Agrega productos desde el constructor para completar esta vitrina." },
];

export default function ProductosClient({ slug, fallbackBrand }) {
  const [store, setStore] = useState({ ...fallbackStore, brand: fallbackBrand || fallbackStore.brand });
  const [products, setProducts] = useState(fallbackProducts);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/proveedor-pro?slug=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          setStore({ ...fallbackStore, brand: fallbackBrand || fallbackStore.brand, ...(data.store || {}) });
          setProducts(data.products?.length ? data.products : fallbackProducts);
          return;
        }
      } catch {}
      try {
        const saved = window.localStorage.getItem(`drokex-proveedor-pro:${slug}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          setStore({ ...fallbackStore, brand: fallbackBrand || fallbackStore.brand, ...(parsed.store || {}) });
          setProducts(parsed.products?.length ? parsed.products : fallbackProducts);
        }
      } catch {}
    }
    load();
  }, [slug, fallbackBrand]);

  const primary = store.primaryColor || "#ff9f2e";
  const bg = store.backgroundColor || "#fff";
  const surface = store.surfaceColor || "#fff";
  const text = store.textColor || "#111";
  const muted = store.mutedTextColor || "#666";
  const btnText = store.buttonTextColor || "#fff";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: bg }}>
      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, backgroundColor: hexToRgba(surface, 0.92), backdropFilter: "blur(12px)", borderBottom: `1px solid ${hexToRgba(text, 0.08)}`, padding: "0 24px", display: "flex", alignItems: "center", gap: 16, height: 64 }}>
        <Link href={`../`} style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: muted, fontSize: "0.85rem" }}>
          ← Inicio
        </Link>
        <span style={{ color: hexToRgba(text, 0.2) }}>|</span>
        {store.logo ? (
          <img src={store.logo} alt={store.brand} style={{ height: 32, width: 32, borderRadius: "50%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: primary, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: btnText, fontSize: "0.85rem", flexShrink: 0 }}>
            {store.brand.charAt(0)}
          </div>
        )}
        <span style={{ fontWeight: 900, color: text, fontSize: "0.9rem" }}>{store.brand}</span>
      </header>

      {/* Catalog */}
      <section style={{ padding: "48px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", color: primary }}>
          {store.catalogEyebrow}
        </p>
        <h1 style={{ margin: "12px 0 0", fontSize: "2.5rem", fontWeight: 900, color: text }}>
          {store.catalogTitle}
        </h1>
        <p style={{ margin: "12px 0 0", maxWidth: 640, fontSize: "0.95rem", color: muted, lineHeight: 1.65 }}>
          {store.catalogText}
        </p>

        <div style={{ marginTop: 40, display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {products.map((product, index) => (
            <article key={index} style={{ borderRadius: 24, border: `1px solid ${hexToRgba(text, 0.08)}`, overflow: "hidden", backgroundColor: surface, display: "flex", flexDirection: "column" }}>
              <div style={{ height: 220, backgroundColor: bg, overflow: "hidden" }}>
                {product.image ? (
                  <img src={product.image} alt={product.name || "Producto"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: muted, fontSize: "0.85rem" }}>
                    Sin imagen
                  </div>
                )}
              </div>
              <div style={{ padding: "20px 20px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
                <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: primary }}>
                  {product.category || "Categoría"}
                </p>
                <h2 style={{ margin: "6px 0 0", fontSize: "1.15rem", fontWeight: 900, color: text }}>
                  {product.name || "Nombre producto"}
                </h2>
                <p style={{ margin: "8px 0 0", fontSize: "0.85rem", color: muted, lineHeight: 1.55, flex: 1 }}>
                  {product.description}
                </p>
                <p style={{ margin: "16px 0 0", fontSize: "1.3rem", fontWeight: 900, color: primary }}>
                  {product.price ? `$${Number(product.price).toLocaleString("es-CO")} COP` : "$0 COP"}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: muted }}>
                  Stock: {product.stock || "0"}
                </p>
                <button style={{ marginTop: 16, width: "100%", borderRadius: 14, padding: "12px", fontWeight: 900, fontSize: "0.9rem", border: "none", cursor: "pointer", backgroundColor: primary, color: btnText }}>
                  {store.productCtaText || "Agregar al carrito"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
