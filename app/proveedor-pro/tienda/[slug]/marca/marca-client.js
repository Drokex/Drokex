"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { hexToRgba } from "@/app/components/landing-preview";

const fallbackStore = {
  brand: "Mi Tienda", country: "", logo: "",
  aboutTitle: "Una marca pensada para ti", aboutText: "",
  bannerSecondary: "",
  primaryColor: "#ff9f2e", backgroundColor: "#fff7fb",
  surfaceColor: "#ffffff", textColor: "#191421",
  mutedTextColor: "#6f6477", buttonTextColor: "#ffffff",
};

export default function MarcaClient({ slug, fallbackBrand }) {
  const [store, setStore] = useState({ ...fallbackStore, brand: fallbackBrand || fallbackStore.brand });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/proveedor-pro?slug=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          setStore({ ...fallbackStore, brand: fallbackBrand || fallbackStore.brand, ...(data.store || {}) });
          return;
        }
      } catch {}
      try {
        const saved = window.localStorage.getItem(`drokex-proveedor-pro:${slug}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          setStore({ ...fallbackStore, brand: fallbackBrand || fallbackStore.brand, ...(parsed.store || {}) });
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
      <header style={{ position: "sticky", top: 0, zIndex: 50, backgroundColor: hexToRgba(surface, 0.92), backdropFilter: "blur(12px)", borderBottom: `1px solid ${hexToRgba(text, 0.08)}`, padding: "0 24px", display: "flex", alignItems: "center", gap: 16, height: 64 }}>
        <Link href="../" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: muted, fontSize: "0.85rem" }}>
          ← Inicio
        </Link>
        <span style={{ color: hexToRgba(text, 0.2) }}>|</span>
        {store.logo ? (
          <img src={store.logo} alt={store.brand} style={{ height: 32, width: 32, borderRadius: "50%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: primary, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: btnText, fontSize: "0.85rem" }}>
            {store.brand.charAt(0)}
          </div>
        )}
        <span style={{ fontWeight: 900, color: text, fontSize: "0.9rem" }}>{store.brand}</span>
      </header>

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "64px 32px", display: "grid", gap: 48, gridTemplateColumns: store.bannerSecondary ? "1fr 1fr" : "1fr" }}>
        <div>
          {store.country && (
            <p style={{ margin: "0 0 12px", fontSize: "0.75rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", color: primary }}>
              {store.country}
            </p>
          )}
          <h1 style={{ margin: 0, fontSize: "2.5rem", fontWeight: 900, color: text, lineHeight: 1.1 }}>
            {store.aboutTitle}
          </h1>
          <p style={{ margin: "20px 0 0", fontSize: "1rem", color: muted, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
            {store.aboutText}
          </p>
        </div>
        {store.bannerSecondary && (
          <div style={{ borderRadius: 24, overflow: "hidden", minHeight: 320 }}>
            <img src={store.bannerSecondary} alt={store.brand} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
      </section>
    </div>
  );
}
