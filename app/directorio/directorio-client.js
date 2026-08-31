"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";
import SidebarAd from "@/app/components/sidebar-ad";
import ConfirmPopup from "@/app/components/confirm-popup";
import { SlidersHorizontal } from "lucide-react";
import styles from "./directorio.module.css";
import { useGlobalTheme } from "@/app/components/global-theme";


// Cada thumbnail es base64 pesado (hasta ~750KB): se piden una sola vez por slug en toda
// la página (aunque varios componentes usen el mismo) y solo cuando la card entra en pantalla.
const thumbCache = new Map();

function fetchThumbnail(slug) {
  if (!thumbCache.has(slug)) {
    thumbCache.set(
      slug,
      fetch(`/api/proveedor-pro/thumbnail?slug=${encodeURIComponent(slug)}`)
        .then(r => r.json())
        .then(d => d.heroImage || null)
        .catch(() => null)
    );
  }
  return thumbCache.get(slug);
}

function useThumbnail(slug, fallback) {
  const [src, setSrc] = useState(fallback);

  useEffect(() => {
    let alive = true;
    fetchThumbnail(slug).then(hero => { if (alive && hero) setSrc(hero); });
    return () => { alive = false; };
  }, [slug]);

  return src;
}

const FALLBACK_BANNERS = [
  "/hero-banner-dark.jpg",
  "/banner tiendas drokex virtual .jpg",
  "/landing sillas.jpeg",
  "/about-sale-banner.jpg",
];

function getHero(landing) {
  const store = landing?.store || {};
  return store.heroImage || FALLBACK_BANNERS[0];
}

function getBrand(landing) { return landing?.store?.brand || "Tienda Pro"; }
function getCountry(landing) {
  const s = landing?.store || {};
  return (s.countries?.length ? s.countries : s.country ? [s.country] : []).join(" · ");
}
function getDesc(landing) {
  const s = landing?.store || {};
  return s.heroTitle || s.heroSubtitle || s.description || "Tienda Proveedor Pro en Drokex";
}
function getPrimary(landing) { return landing?.store?.primaryColor || "#7FE040"; }
function getLogo(landing) { return landing?.store?.logo || null; }
function getProductCount(landing) { return (landing?.products || []).length; }

// ── Mini thumbnail (sidebar derecho del hero) ──
function HeroThumb({ slug, landing, active, onClick }) {
  const hero    = getHero(landing);
  const brand   = getBrand(landing);
  const primary = getPrimary(landing);

  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        background: active ? "rgba(127,224,64,0.1)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${active ? "rgba(127,224,64,0.4)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 10, padding: "8px 10px", cursor: "pointer",
        textAlign: "left", transition: "all 0.2s", width: "100%",
        fontFamily: "inherit",
      }}
    >
      <div style={{
        width: 60, height: 44, borderRadius: 7, overflow: "hidden",
        flexShrink: 0, background: `url(${hero}) center/cover no-repeat`,
        border: `1.5px solid ${active ? "rgba(127,224,64,0.5)" : "rgba(255,255,255,0.1)"}`,
      }} />
      <div style={{ overflow: "hidden" }}>
        <p style={{ margin: 0, fontWeight: 800, fontSize: "0.8rem", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {brand}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: "0.66rem", color: active ? "#7FE040" : "rgba(255,255,255,0.35)", fontWeight: 600 }}>
          {getProductCount(landing)} producto{getProductCount(landing) !== 1 ? "s" : ""}
        </p>
      </div>
    </button>
  );
}

const HERO_VIDEO =
  "https://f96gfpetvymkefdo.public.blob.vercel-storage.com/drokex%20video%20pro.mp4";

// ── Hero principal (full-width) ──
function HeroFeatured({ lm = false }) {
  const heroBg     = lm ? "#f5f7f5" : "#050807";
  const titleGrad  = lm
    ? "linear-gradient(135deg, #1a3d0f 0%, #2d8a1f 50%, #4db82e 100%)"
    : "linear-gradient(135deg, #ffffff 0%, #c8f5a0 50%, #7FE040 100%)";
  const subColor   = lm ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)";
  const eyeColor   = lm ? "#2d8a1f" : "#7FE040";
  const badgeBg    = lm ? "rgba(45,138,31,0.08)" : "rgba(127,224,64,0.1)";
  const badgeBdr   = lm ? "rgba(45,138,31,0.3)" : "rgba(127,224,64,0.25)";
  const badgeColor = lm ? "#2d8a1f" : "#7FE040";

  return (
    <div style={{ background: heroBg, padding: "56px 24px 48px", textAlign: "center" }}>
      <p style={{
        margin: "0 0 12px", fontSize: "clamp(0.65rem, 1.1vw, 0.82rem)",
        fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase",
        color: eyeColor, opacity: 0.85,
      }}>
        Directorio de tiendas · Drokex
      </p>
      <h1 style={{
        margin: "0 0 18px", fontSize: "clamp(2rem, 4vw, 3.8rem)",
        fontWeight: 900, letterSpacing: "0.04em", textTransform: "uppercase", lineHeight: 1.05,
        // backgroundImage (no el shorthand `background`): al cambiar de tema React actualiza
        // solo esta prop y el shorthand reseteaba background-clip → el título salía como barra
        backgroundImage: titleGrad,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
      }}>
        Latam vende al mundo
      </h1>
      <p style={{ margin: "0 0 24px", fontSize: "clamp(0.9rem, 1.3vw, 1.1rem)", color: subColor, fontWeight: 500 }}>
        Compra directo a proveedores.{" "}
        <span style={{ color: badgeColor, fontWeight: 700 }}>Sin intermediarios. Sin fronteras.</span>
      </p>
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8 }}>
        {["✓ Proveedores verificados", "✓ Envíos a toda Latam", "✓ Precios mayoristas", "✓ Soporte directo"].map(b => (
          <span key={b} style={{
            fontSize: "0.72rem", fontWeight: 700, color: badgeColor,
            background: badgeBg, border: `1px solid ${badgeBdr}`,
            borderRadius: 20, padding: "5px 14px",
          }}>{b}</span>
        ))}
      </div>
    </div>
  );
}

// ── Card del grid ──
function StoreCard({ slug, landing, lm = false, isLocal = false, onDelete }) {
  const hero    = useThumbnail(slug, getHero(landing));
  const brand   = getBrand(landing);
  const country = getCountry(landing);
  const primary = getPrimary(landing);
  const logo    = getLogo(landing);
  const count   = getProductCount(landing);
  const cardBg  = lm ? "#fff" : "rgba(255,255,255,0.04)";
  const cardBrd = lm ? "rgba(0,0,0,0.09)" : "rgba(255,255,255,0.07)";
  const txtMain = lm ? "#111" : "#fff";
  const txtSub  = lm ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)";

  return (
    <Link href={`/proveedor-pro/tienda/${slug}`} style={{ textDecoration: "none", display: "flex" }}>
      <div
        style={{
          borderRadius: 14, overflow: "hidden",
          background: cardBg, border: `1px solid ${cardBrd}`,
          transition: "transform 0.22s, box-shadow 0.22s, border-color 0.22s",
          cursor: "pointer", width: "100%", display: "flex", flexDirection: "column",
          boxShadow: lm ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
          e.currentTarget.style.boxShadow = lm ? "0 20px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(127,224,64,0.4)" : "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(127,224,64,0.3)";
          e.currentTarget.style.borderColor = "rgba(127,224,64,0.4)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = lm ? "0 2px 12px rgba(0,0,0,0.06)" : "none";
          e.currentTarget.style.borderColor = cardBrd;
        }}
      >
        {/* Poster */}
        <div style={{ height: 170, flexShrink: 0, position: "relative", background: `url(${hero}) center/cover no-repeat` }}>
          <span style={{ position: "absolute", top: 8, right: 8, background: "#7FE040", color: "#050505", fontSize: "0.52rem", fontWeight: 900, letterSpacing: "0.1em", padding: "2px 7px", borderRadius: 5, textTransform: "uppercase" }}>PRO</span>
          {isLocal && onDelete && (
            <button
              type="button"
              title="Eliminar del directorio"
              onClick={e => { e.preventDefault(); e.stopPropagation(); onDelete(slug); }}
              style={{ position: "absolute", top: 8, left: 8, width: 26, height: 26, borderRadius: 8, background: "rgba(200,30,30,0.82)", border: "none", color: "#fff", fontWeight: 900, fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}
            >✕</button>
          )}
          <div style={{ position: "absolute", bottom: 10, left: 12, width: 36, height: 36, borderRadius: 9, background: logo ? (lm ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.5)") : primary, border: "1.5px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "0.85rem", color: "#fff", overflow: "hidden" }}>
            {logo ? <img src={logo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 3 }} /> : brand.charAt(0)}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "12px 14px 14px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <p style={{ margin: 0, fontWeight: 800, fontSize: "0.88rem", color: txtMain, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{brand}</p>
          {country && <p style={{ margin: "2px 0 0", fontSize: "0.68rem", color: txtSub, fontWeight: 600 }}>{country}</p>}
          <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.68rem", background: `${primary}22`, color: primary, fontWeight: 800, padding: "3px 8px", borderRadius: 6 }}>
              {count} producto{count !== 1 ? "s" : ""}
            </span>
            <span style={{ fontSize: "0.68rem", color: txtSub, fontWeight: 700 }}>Ver →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function DirectorioPage({ initialSuppliers = [], initialProLandings = [] }) {
  const [query, setQuery]           = useState("");
  const [suppliers, setSuppliers]   = useState(initialSuppliers);
  const [proLandings, setProLandings] = useState(() => {
    const seen = new Set();
    return initialProLandings.filter(({ slug }) => seen.has(slug) ? false : seen.add(slug));
  });
  const [loading, setLoading]       = useState(false);
  const [featured, setFeatured]     = useState(0);
  const [selCountry, setSelCountry] = useState("");
  const [selCategory, setSelCategory] = useState("");
  const [page, setPage] = useState(1);
  const [theme, toggleTheme] = useGlobalTheme();
  const lm = theme === "light";
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const PER_PAGE = 24;

  useEffect(() => {
    fetch("/api/account", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setIsAdmin(data?.user?.role === "ADMIN"))
      .catch(() => {});
  }, []);

  // Helpers de tema
  const bg    = lm ? "#f4f6f4" : "#040806";
  const card  = lm ? "#ffffff" : "rgba(255,255,255,0.04)";
  const txt   = lm ? "#111"   : "#fff";
  const sub   = lm ? "rgba(0,0,0,0.45)"  : "rgba(255,255,255,0.45)";
  const brd   = lm ? "rgba(0,0,0,0.09)"  : "rgba(255,255,255,0.07)";
  const w     = (op) => lm ? `rgba(0,0,0,${op})` : `rgba(255,255,255,${op})`;

  const fetchSuppliers = useCallback(async (q) => {
    setLoading(true);
    try {
      const res  = await fetch(`/api/directorio?q=${encodeURIComponent(q)}`);
      if (!res.ok) return;
      const data = await res.json();
      setSuppliers(data.suppliers || []);
    } finally {
      setLoading(false);
    }
  }, []);

  // El primer render ya trae los suppliers del server: no repetir la query vacía al montar.
  const skipFirstFetch = useRef(initialSuppliers.length > 0);
  useEffect(() => {
    if (skipFirstFetch.current) {
      skipFirstFetch.current = false;
      if (!query) return;
    }
    const timer = setTimeout(() => fetchSuppliers(query), 300);
    return () => clearTimeout(timer);
  }, [query, fetchSuppliers]);

  useEffect(() => { setPage(1); }, [query, selCountry, selCategory]);

  const [localSlugs, setLocalSlugs] = useState(new Set());

  // Cargar landings desde BD vía API (evita el timeout del server render)
  useEffect(() => {
    fetch("/api/directorio/landings")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.landings?.length) return;
        setProLandings(c => {
          const known = new Set(c.map(x => x.slug));
          const fresh = data.landings.filter(x => !known.has(x.slug));
          return fresh.length ? [...fresh, ...c] : c;
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    try {
      const knownSlugs = new Set(proLandings.map(({ slug }) => slug));
      const localOnly  = [];
      const foundLocal = new Set();
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("drokex-proveedor-pro:")) {
          const slug = key.replace("drokex-proveedor-pro:", "");
          if (knownSlugs.has(slug)) continue;
          const raw = localStorage.getItem(key);
          if (raw) { localOnly.push({ slug, landing: JSON.parse(raw) }); foundLocal.add(slug); }
        }
      }
      if (localOnly.length) {
        setLocalSlugs(foundLocal);
        setProLandings(c => {
          const known = new Set(c.map(x => x.slug));
          return [...c, ...localOnly.filter(x => !known.has(x.slug))];
        });
      }
    } catch {}
  }, []);

  function deleteLocalLanding(slug) {
    try { localStorage.removeItem(`drokex-proveedor-pro:${slug}`); } catch {}
    setProLandings(c => c.filter(x => x.slug !== slug));
    setLocalSlugs(s => { const n = new Set(s); n.delete(slug); return n; });
  }

  const [pendingDeleteSlug, setPendingDeleteSlug] = useState(null);

  const allCountries = [...new Set(proLandings.map(({ landing }) => landing.store?.country).filter(Boolean))].sort();

  const CATEGORIES = [
    { label: "Tecnología", keywords: ["tech", "electr", "gadget", "solar", "logís"] },
    { label: "Moda", keywords: ["moda", "ropa", "calzado", "textil"] },
    { label: "Alimentos", keywords: ["aliment", "café", "pescado", "semilla"] },
    { label: "Construcción", keywords: ["construc", "ferret", "madera", "pinturas", "material"] },
    { label: "Belleza", keywords: ["belleza", "cosmét"] },
    { label: "Hogar", keywords: ["muebl", "electrohog", "jugue", "mascot"] },
    { label: "Industria", keywords: ["químico", "plasti", "impres", "automotr"] },
    { label: "Salud", keywords: ["farma", "natural"] },
    { label: "Agricultura", keywords: ["agro", "semilla"] },
  ];

  const filteredPro = proLandings.filter(({ landing }) => {
    const s = landing.store || {};
    const q = query.toLowerCase();
    const matchQ = !query ||
      (s.brand || "").toLowerCase().includes(q) ||
      (s.country || "").toLowerCase().includes(q) ||
      (s.heroTitle || "").toLowerCase().includes(q);
    const matchCountry = !selCountry || s.country === selCountry;
    const matchCategory = !selCategory || (() => {
      const cat = CATEGORIES.find(c => c.label === selCategory);
      if (!cat) return true;
      const text = `${s.brand} ${s.heroTitle} ${s.description}`.toLowerCase();
      return cat.keywords.some(k => text.includes(k));
    })();
    return matchQ && matchCountry && matchCategory;
  });

  const totalPages  = Math.ceil(filteredPro.length / PER_PAGE);
  const pagedPro    = filteredPro.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const featuredItem = filteredPro[featured] || filteredPro[0];
  const sideItems    = filteredPro.filter((_, i) => i !== featured).slice(0, 5);

  function changePage(p) {
    setPage(p);
    window.scrollTo({ top: document.getElementById("directorio-grid")?.offsetTop - 100, behavior: "smooth" });
  }

  return (
    <main style={{ minHeight: "100vh", background: bg, color: txt, transition: "background 0.3s, color 0.3s" }}>
      <SiteHeader />

      {/* Toggle modo claro/oscuro */}
      <button
        onClick={toggleTheme}
        title={lm ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
        style={{
          position: "fixed", top: 88, right: 20, zIndex: 999,
          display: "flex", alignItems: "center", gap: 7,
          padding: "8px 14px", borderRadius: 10,
          border: lm ? "1px solid rgba(0,0,0,0.12)" : "1px solid rgba(255,255,255,0.12)",
          background: lm ? "#ffffff" : "#1a1a1a",
          color: lm ? "#111" : "#fff",
          fontSize: "0.78rem", fontWeight: 800, cursor: "pointer",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)", transition: "all 0.2s",
        }}
      >
        {lm ? (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            Modo oscuro
          </>
        ) : (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            Modo claro
          </>
        )}
      </button>

      {/* ── HERO ─────────────────────────────────────── */}
      {filteredPro.length > 0 && (
        <section style={{ paddingTop: 0 }}>
          {/* Eyebrow */}
          <div className="shell" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ background: "#7FE040", color: "#050505", fontSize: "0.6rem", fontWeight: 900, letterSpacing: "0.12em", padding: "3px 9px", borderRadius: 6, textTransform: "uppercase" }}>Pro</span>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: w(0.45) }}>Tiendas Proveedor Pro</span>
            </div>
          </div>

          {/* Hero full-width */}
          <HeroFeatured lm={lm} />

        </section>
      )}

      {/* ── BANNER PATROCINADO ────────────────────────── */}
      <section style={{ padding: "0 0 32px" }}>
        <div className="shell">
          <div style={{
            borderRadius: 14, overflow: "hidden", lineHeight: 0,
            border: lm ? "1px solid rgba(0,0,0,0.09)" : "1px solid rgba(255,255,255,0.07)",
            boxShadow: lm ? "0 2px 12px rgba(0,0,0,0.06)" : "0 18px 48px rgba(0,0,0,0.45)",
          }}>
            <img
              src="/banner-geu-caucho.png"
              alt="GEU — Resistencia que mueve industrias. Rollos, láminas, espumas y soluciones en caucho"
              style={{ display: "block", width: "100%", height: "auto" }}
            />
          </div>
        </div>
      </section>

      {/* ── BUSCADOR + GRID ───────────────────────────── */}
      <section style={{ padding: "0 0 80px" }}>
        <div className="shell">
          {/* Search bar */}
          <div className={styles.dirSearchRow}>
            <div className={styles.dirSearchField}>
              <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                className={styles.dirSearchInput}
                type="search"
                aria-label="Buscar proveedores"
                name="supplier-search"
                autoComplete="off"
                placeholder="Buscar proveedor, categoría o país..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{
                  padding: "12px 14px 12px 40px",
                  background: lm ? "#fff" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${brd}`,
                  borderRadius: 10, color: txt, fontSize: "0.85rem",
                  outline: "none", fontFamily: "inherit", transition: "border-color 0.2s",
                  boxShadow: lm ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(127,224,64,0.5)"}
                onBlur={e => e.target.style.borderColor = brd}
              />
            </div>
            <span style={{ fontSize: "0.78rem", color: w(0.3), fontWeight: 600 }}>
              {filteredPro.length} tienda{filteredPro.length !== 1 ? "s" : ""}
            </span>
            <button
              type="button"
              className={styles.dirFiltersToggle}
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((open) => !open)}
              style={{
                alignSelf: "flex-start",
                alignItems: "center",
                gap: 6,
                minHeight: 44,
                padding: "0 14px",
                background: filtersOpen ? "#7FE040" : (lm ? "#fff" : "rgba(255,255,255,0.05)"),
                border: `1px solid ${filtersOpen ? "#7FE040" : brd}`,
                borderRadius: 10,
                color: filtersOpen ? "#050505" : txt,
                fontSize: "0.8rem",
                fontWeight: 700,
                fontFamily: "inherit",
                cursor: "pointer",
                boxShadow: lm && !filtersOpen ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                position: "relative",
              }}
            >
              <SlidersHorizontal size={16} />
              Filtros
              {(selCountry || selCategory) && !filtersOpen && (
                <span style={{
                  position: "absolute", top: -3, right: -3, width: 9, height: 9,
                  borderRadius: "50%", background: "#7FE040",
                  border: `2px solid ${lm ? "#f4f6f4" : "#040806"}`,
                }} />
              )}
            </button>
          </div>

          {/* Sidebar + Grid */}
          <div className={styles.dirLayout}>

            {/* ── Sidebar filtros ── */}
            <div className={`sidebar-col ${styles.dirSidebar}${filtersOpen ? ` ${styles.isOpen}` : ""}`}>
            <div style={{ background: lm ? "#fff" : "rgba(255,255,255,0.03)", border: `1px solid ${brd}`, borderRadius: 14, padding: "20px 16px", boxShadow: lm ? "0 2px 16px rgba(0,0,0,0.07)" : "none" }}>

              {/* País */}
              <p style={{ margin: "0 0 10px", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: w(0.35) }}>País</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 22 }}>
                {["", ...allCountries].map(c => (
                  <button key={c || "__all__"} onClick={() => setSelCountry(c)} style={{
                    textAlign: "left", background: selCountry === c ? "rgba(127,224,64,0.12)" : "transparent",
                    border: `1px solid ${selCountry === c ? "rgba(127,224,64,0.35)" : "transparent"}`,
                    borderRadius: 7, padding: "6px 10px", minHeight: 44, cursor: "pointer", fontFamily: "inherit",
                    fontSize: "0.78rem", fontWeight: 600,
                    color: selCountry === c ? "#5aaa20" : w(0.55),
                    transition: "all 0.15s",
                  }}>
                    {c || "Todos los países"}
                  </button>
                ))}
              </div>

              {/* Categoría */}
              <p style={{ margin: "0 0 10px", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: w(0.35) }}>Categoría</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {["", ...CATEGORIES.map(c => c.label)].map(c => (
                  <button key={c || "__all__"} onClick={() => setSelCategory(c)} style={{
                    textAlign: "left", background: selCategory === c ? "rgba(127,224,64,0.12)" : "transparent",
                    border: `1px solid ${selCategory === c ? "rgba(127,224,64,0.35)" : "transparent"}`,
                    borderRadius: 7, padding: "6px 10px", minHeight: 44, cursor: "pointer", fontFamily: "inherit",
                    fontSize: "0.78rem", fontWeight: 600,
                    color: selCategory === c ? "#5aaa20" : w(0.55),
                    transition: "all 0.15s",
                  }}>
                    {c || "Todas las categorías"}
                  </button>
                ))}
              </div>

              {/* Limpiar */}
              {(selCountry || selCategory) && (
                <button onClick={() => { setSelCountry(""); setSelCategory(""); }} style={{
                  marginTop: 18, width: "100%", background: "transparent",
                  border: `1px solid ${brd}`, borderRadius: 7,
                  padding: "7px 10px", minHeight: 44, cursor: "pointer", fontFamily: "inherit",
                  fontSize: "0.72rem", fontWeight: 700, color: w(0.4),
                }}>
                  Limpiar filtros ✕
                </button>
              )}
            </div>

              <SidebarAd />
            </div>

            {/* ── Grid ── */}
            <div id="directorio-grid">
              {pagedPro.length > 0 ? (
                <div className={styles.dirGrid}>
                  {pagedPro.map(({ slug, landing }) => (
                    <StoreCard key={slug} slug={slug} landing={landing} lm={lm} isLocal={localSlugs.has(slug)} onDelete={isAdmin ? setPendingDeleteSlug : null} />
                  ))}
                </div>
              ) : (
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.9rem", marginTop: 40 }}>
                  No se encontraron tiendas para los filtros seleccionados.
                </p>
              )}

              {/* Paginación */}
              {totalPages > 1 && (
                <div className={styles.dirPagination}>
                  <button onClick={() => changePage(page - 1)} disabled={page === 1} style={{
                    padding: "8px 16px", borderRadius: 8, border: `1px solid ${brd}`,
                    background: lm ? "#fff" : "rgba(255,255,255,0.05)", color: page === 1 ? w(0.2) : txt,
                    cursor: page === 1 ? "default" : "pointer", fontWeight: 700, fontSize: "0.82rem", fontFamily: "inherit",
                  }}>← Anterior</button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => changePage(p)} style={{
                      width: 36, height: 36, borderRadius: 8,
                      border: `1px solid ${p === page ? "rgba(127,224,64,0.5)" : brd}`,
                      background: p === page ? "rgba(127,224,64,0.15)" : (lm ? "#fff" : "rgba(255,255,255,0.04)"),
                      color: p === page ? "#5aaa20" : w(0.5),
                      cursor: "pointer", fontWeight: 800, fontSize: "0.82rem", fontFamily: "inherit",
                    }}>{p}</button>
                  ))}

                  <button onClick={() => changePage(page + 1)} disabled={page === totalPages} style={{
                    padding: "8px 16px", borderRadius: 8, border: `1px solid ${brd}`,
                    background: lm ? "#fff" : "rgba(255,255,255,0.05)", color: page === totalPages ? w(0.2) : txt,
                    cursor: page === totalPages ? "default" : "pointer", fontWeight: 700, fontSize: "0.82rem", fontFamily: "inherit",
                  }}>Siguiente →</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />

      <ConfirmPopup
        open={Boolean(pendingDeleteSlug)}
        title="Eliminar tienda"
        message={pendingDeleteSlug ? `¿Eliminar "${pendingDeleteSlug}" del directorio? Esta acción no se puede deshacer.` : ""}
        confirmLabel="Eliminar"
        onConfirm={() => { deleteLocalLanding(pendingDeleteSlug); setPendingDeleteSlug(null); }}
        onCancel={() => setPendingDeleteSlug(null)}
      />
    </main>
  );
}
