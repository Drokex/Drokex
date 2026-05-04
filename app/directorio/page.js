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
  const text = store.textColor || "#191421";
  const muted = store.mutedTextColor || "#6f6477";
  const btnText = store.buttonTextColor || "#ffffff";

  return (
    <Link href={`/proveedor-pro/tienda/${slug}`} style={{ textDecoration: "none", display: "block" }}>
      <article style={{
        borderRadius: 18,
        overflow: "hidden",
        background: surface,
        border: "1.5px solid rgba(0,0,0,0.07)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        cursor: "pointer",
        transition: "transform 0.15s, box-shadow 0.15s",
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.12)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)"; }}
      >
        {/* Thumbnail visual */}
        <div style={{
          height: 140,
          background: `linear-gradient(135deg, ${gradFrom}44, ${gradTo}44), linear-gradient(180deg, ${bg}, ${surface})`,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}>
          {/* Mini page preview */}
          <div style={{ position: "absolute", inset: 0, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 5 }}>
            {/* Mini header */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: `${surface}cc`, borderRadius: 6, padding: "4px 8px" }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: primary, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.45rem", fontWeight: 900, color: btnText }}>
                {store.logo
                  ? <img src={store.logo} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                  : (store.brand || "M").charAt(0)}
              </div>
              <div style={{ height: 4, width: 40, borderRadius: 4, background: text, opacity: 0.5 }} />
              <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                {[28, 22, 24].map((w, i) => <div key={i} style={{ height: 4, width: w, borderRadius: 4, background: muted, opacity: 0.3 }} />)}
              </div>
            </div>
            {/* Mini hero */}
            <div style={{ flex: 1, borderRadius: 8, background: `${surface}99`, padding: "6px 8px", display: "flex", flexDirection: "column", gap: 4, justifyContent: "center" }}>
              <div style={{ height: 5, width: "70%", borderRadius: 4, background: text, opacity: 0.7 }} />
              <div style={{ height: 4, width: "50%", borderRadius: 4, background: text, opacity: 0.4 }} />
              <div style={{ height: 4, width: "40%", borderRadius: 4, background: text, opacity: 0.3 }} />
              <div style={{ marginTop: 4, height: 16, width: 52, borderRadius: 6, background: primary }} />
            </div>
            {/* Mini product row */}
            <div style={{ display: "flex", gap: 4 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ flex: 1, height: 26, borderRadius: 6, background: surface, border: `1px solid ${primary}33`, overflow: "hidden" }}>
                  {products[i]?.image && (
                    <img src={products[i].image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* PRO badge */}
          <div style={{
            position: "absolute", top: 10, right: 10,
            background: "#59ff35", color: "#050505",
            fontSize: "0.6rem", fontWeight: 900, letterSpacing: "0.1em",
            padding: "3px 8px", borderRadius: 6, textTransform: "uppercase",
          }}>
            PRO
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", background: primary,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: "0.95rem", color: btnText, flexShrink: 0,
            }}>
              {store.logo
                ? <img src={store.logo} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                : (store.brand || "M").charAt(0)}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 900, fontSize: "0.95rem", color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {store.brand || "Mi Tienda"}
              </p>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#888" }}>{store.country || "—"}</p>
            </div>
          </div>
          <p style={{ margin: "10px 0 0", fontSize: "0.78rem", color: "#555", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.5 }}>
            {store.heroTitle || store.heroSubtitle || "Landing Proveedor Pro"}
          </p>
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.75rem", color: primary, fontWeight: 700 }}>
              {products.length} producto{products.length !== 1 ? "s" : ""}
            </span>
            <span style={{ fontSize: "0.72rem", fontWeight: 900, color: primary, letterSpacing: "0.04em" }}>
              Ver tienda →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function DirectorioPage() {
  const [query, setQuery] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [proLandings, setProLandings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = useCallback(async (q) => {
    setLoading(true);
    const res = await fetch(`/api/directorio?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setSuppliers(data.suppliers || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Load pro landings from localStorage
    try {
      const landings = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("drokex-proveedor-pro:")) {
          const slug = key.replace("drokex-proveedor-pro:", "");
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw);
            landings.push({ slug, landing: parsed });
          }
        }
      }
      setProLandings(landings);
    } catch {}
  }, []);

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
      {filteredPro.length > 0 && (
        <section className="shell" style={{ padding: "32px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <span style={{ background: "#59ff35", color: "#050505", fontSize: "0.65rem", fontWeight: 900, letterSpacing: "0.12em", padding: "3px 10px", borderRadius: 6, textTransform: "uppercase" }}>Pro</span>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "0.95rem", color: "#fff" }}>Tiendas Proveedor Pro</p>
            <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "rgba(255,255,255,0.35)" }}>{filteredPro.length} tienda{filteredPro.length !== 1 ? "s" : ""}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20, marginBottom: 40 }}>
            {filteredPro.map(({ slug, landing }) => (
              <ProLandingThumbnail key={slug} slug={slug} landing={landing} />
            ))}
          </div>
        </section>
      )}

      <section className="directorio-results shell">
        {loading ? (
          <p className="directorio-empty">Cargando proveedores...</p>
        ) : suppliers.length === 0 ? (
          filteredPro.length === 0 ? (
            <p className="directorio-empty">No se encontraron proveedores para <strong>"{query}"</strong>.</p>
          ) : null
        ) : (
          <>
            <p className="directorio-count">
              <strong>{suppliers.length}</strong> proveedores encontrados
            </p>
            <div className="directorio-grid">
              {suppliers.map((supplier) => (
                <article key={supplier.name} className="directorio-card">
                  <div className="directorio-card-image">
                    <Image
                      src={supplier.image}
                      alt={supplier.name}
                      width={80}
                      height={80}
                      className="directorio-card-img"
                    />
                  </div>
                  <div className="directorio-card-body">
                    <h3 className="directorio-card-name">{supplier.name}</h3>
                    <p className="directorio-card-country">{supplier.country}</p>
                    <div className="directorio-card-tags">
                      {supplier.categories.slice(0, 3).map((cat) => (
                        <span key={cat} className="directorio-tag">{cat}</span>
                      ))}
                    </div>
                  </div>
                  <div className="directorio-card-footer">
                    <span className="directorio-card-count">{supplier.productCount} producto{supplier.productCount !== 1 ? "s" : ""}</span>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
