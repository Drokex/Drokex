"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";

function ProLandingThumbnail({ slug, landing }) {
  const store = landing.store || {};
  const products = landing.products || [];
  const primary = store.primaryColor || "#ff9f2e";
  const gradFrom = store.gradientFromColor || "#b86cff";
  const gradTo = store.gradientToColor || "#ff7db8";
  const bg = store.backgroundColor || "#fff7fb";
  const surface = store.surfaceColor || "#ffffff";
  const btnText = store.buttonTextColor || "#ffffff";
  const heroImg = store.heroImage || "";
  const countryDisplay = (store.countries?.length ? store.countries : store.country ? [store.country] : []).join(" · ");

  return (
    <Link href={`/proveedor-pro/tienda/${slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <article
        style={{ borderRadius: 22, overflow: "hidden", background: "#fff", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", cursor: "pointer", transition: "transform 0.18s, box-shadow 0.18s", height: "100%", display: "flex", flexDirection: "column" }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.13)`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.06)"; }}
      >
        {/* Hero banner */}
        <div style={{
          height: 160, position: "relative", overflow: "hidden",
          background: heroImg ? `url(${heroImg}) center/cover no-repeat` : `linear-gradient(135deg, ${gradFrom}, ${gradTo})`,
        }}>
          {/* Overlay escuro suave */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.45) 100%)" }} />

          {/* PRO badge */}
          <span style={{ position: "absolute", top: 12, right: 12, background: "#7FE040", color: "#050505", fontSize: "0.58rem", fontWeight: 900, letterSpacing: "0.12em", padding: "3px 9px", borderRadius: 7, textTransform: "uppercase" }}>
            PRO
          </span>

          {/* Mini product strip si no hay hero image */}
          {!heroImg && products.some(p => p.image) && (
            <div style={{ position: "absolute", bottom: 12, left: 12, display: "flex", gap: 6 }}>
              {products.slice(0, 3).filter(p => p.image).map((p, i) => (
                <div key={i} style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", border: "2px solid rgba(255,255,255,0.4)", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
                  <img src={p.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logo flotante */}
        <div style={{ padding: "0 18px", marginTop: -20, position: "relative", zIndex: 1 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%", background: primary,
            border: "3px solid #fff", boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: "1rem", color: btnText, overflow: "hidden", flexShrink: 0,
          }}>
            {store.logo
              ? <img src={store.logo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }} />
              : (store.brand || "M").charAt(0)}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "10px 18px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
          <p style={{ margin: 0, fontWeight: 900, fontSize: "1rem", color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {store.brand || "Mi Tienda"}
          </p>
          {countryDisplay && (
            <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#999", fontWeight: 600 }}>{countryDisplay}</p>
          )}
          <p style={{ margin: "8px 0 0", fontSize: "0.8rem", color: "#555", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.55 }}>
            {store.heroTitle || store.heroSubtitle || "Tienda Proveedor Pro"}
          </p>
          <div style={{ marginTop: "auto", paddingTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.73rem", background: `${primary}18`, color: primary, fontWeight: 800, padding: "4px 10px", borderRadius: 8 }}>
              {products.length} producto{products.length !== 1 ? "s" : ""}
            </span>
            <span style={{ fontSize: "0.75rem", fontWeight: 900, color: "#111", display: "flex", alignItems: "center", gap: 4 }}>
              Ver tienda
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function DirectorioPage({ initialSuppliers = [], initialProLandings = [] }) {
  const [query, setQuery] = useState("");
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [proLandings, setProLandings] = useState(initialProLandings);
  const [loading, setLoading] = useState(false);
  const [proLoading, setProLoading] = useState(false);

  const fetchSuppliers = useCallback(async (q) => {
    setLoading(true);
    const res = await fetch(`/api/directorio?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setSuppliers(data.suppliers || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Refresh local unpublished previews if another tab updates them.
    function handleStorage() {
      const localLandings = [];
      const knownSlugs = new Set(proLandings.map(({ slug }) => slug));

      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith("drokex-proveedor-pro:")) {
            const slug = key.replace("drokex-proveedor-pro:", "");
            if (knownSlugs.has(slug)) continue;
            const raw = localStorage.getItem(key);
            if (raw) localLandings.push({ slug, landing: JSON.parse(raw) });
          }
        }
      } catch {}

      if (localLandings.length) {
        setProLandings((current) => [...current, ...localLandings]);
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [proLandings]);

  useEffect(() => {
    /*
      Kept as a fallback for same-tab constructor saves that happen before
      the database request finishes.
    */
    try {
      const localOnly = [];
      const knownSlugs = new Set(proLandings.map(({ slug }) => slug));
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("drokex-proveedor-pro:")) {
          const slug = key.replace("drokex-proveedor-pro:", "");
          if (knownSlugs.has(slug)) continue;
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw);
            localOnly.push({ slug, landing: parsed });
          }
        }
      }
      if (localOnly.length) setProLandings((current) => [...current, ...localOnly]);
    } catch {}
  }, [proLandings]);

  useEffect(() => {
    const timer = setTimeout(() => fetchSuppliers(query), 300);
    return () => clearTimeout(timer);
  }, [query, fetchSuppliers]);

  // Filter pro landings by query
  const filteredPro = proLandings.filter(({ landing }) => {
    if (!query) return true;
    const s = landing.store || {};
    const q = query.toLowerCase();
    return (
      (s.brand || "").toLowerCase().includes(q) ||
      (s.country || "").toLowerCase().includes(q) ||
      (s.heroTitle || "").toLowerCase().includes(q)
    );
  });

  return (
    <main className="directorio-page">
      <SiteHeader />

      <section className="directorio-hero">
        <div className="shell">
          <p className="directorio-eyebrow">Directorio Drokex</p>
          <h1>Encuentra tu <span>proveedor</span></h1>
          <p className="directorio-sub">
            Busca por nombre, categoría o país de origen.
          </p>

          <div className="directorio-search-wrap">
            <svg className="directorio-search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="directorio-search"
              type="search"
              placeholder="Buscar proveedor, categoría o país..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      </section>

      {/* Pro landings section */}
      {(proLoading || filteredPro.length > 0) && (
        <section className="shell" style={{ padding: "32px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <span style={{ background: "#7FE040", color: "#050505", fontSize: "0.65rem", fontWeight: 900, letterSpacing: "0.12em", padding: "3px 10px", borderRadius: 6, textTransform: "uppercase" }}>Pro</span>
            <p style={{ margin: 0, fontWeight: 800, fontSize: "0.95rem", color: "#111" }}>Tiendas Proveedor Pro</p>
            <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "#777" }}>
              {proLoading ? "Cargando..." : `${filteredPro.length} tienda${filteredPro.length !== 1 ? "s" : ""}`}
            </span>
          </div>
          {!proLoading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20, marginBottom: 40 }}>
              {filteredPro.map(({ slug, landing }) => (
                <ProLandingThumbnail key={slug} slug={slug} landing={landing} />
              ))}
            </div>
          )}
        </section>
      )}

      {!loading && suppliers.length === 0 && filteredPro.length === 0 && (
        <section className="directorio-results shell">
          <p className="directorio-empty">No se encontraron proveedores para <strong>"{query}"</strong>.</p>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
