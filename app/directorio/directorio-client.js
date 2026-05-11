"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";

const MOCK_STORES = [
  { slug: "mock-techzone", brand: "TechZone", country: "México", heroTitle: "Electrónica premium", description: "Gadgets y tecnología de última generación", heroImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80", primaryColor: "#00C9FF" },
  { slug: "mock-moda-latina", brand: "Moda Latina", country: "Colombia", heroTitle: "Ropa mayorista", description: "Tendencias para toda Latinoamérica", heroImage: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80", primaryColor: "#FF6B9D" },
  { slug: "mock-agromax", brand: "AgroMax", country: "Perú", heroTitle: "Insumos agrícolas", description: "Del campo a tu negocio", heroImage: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80", primaryColor: "#7FE040" },
  { slug: "mock-ferretotal", brand: "FerreTotal", country: "Guatemala", heroTitle: "Ferretería industrial", description: "Todo para construcción y obra", heroImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80", primaryColor: "#FF9500" },
  { slug: "mock-belleza-pro", brand: "Belleza Pro", country: "República Dominicana", heroTitle: "Cosméticos mayoristas", description: "Productos de belleza certificados", heroImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80", primaryColor: "#FF3CAC" },
  { slug: "mock-sportex", brand: "SportEx", country: "Chile", heroTitle: "Artículos deportivos", description: "Equipamiento para alto rendimiento", heroImage: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80", primaryColor: "#00D4FF" },
  { slug: "mock-alimentos-del-sur", brand: "Alimentos del Sur", country: "Argentina", heroTitle: "Alimentos gourmet", description: "Sabores únicos de Sudamérica", heroImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", primaryColor: "#FFB800" },
  { slug: "mock-mueblart", brand: "Mueblart", country: "Honduras", heroTitle: "Muebles artesanales", description: "Diseño y calidad garantizada", heroImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80", primaryColor: "#C0A060" },
  { slug: "mock-electrohogar", brand: "ElectroHogar", country: "El Salvador", heroTitle: "Electrodomésticos", description: "Las mejores marcas al precio justo", heroImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80", primaryColor: "#5B5FFF" },
  { slug: "mock-papeleria-plus", brand: "Papelería Plus", country: "Nicaragua", heroTitle: "Artículos de oficina", description: "Todo para tu empresa o negocio", heroImage: "https://images.unsplash.com/photo-1568667256531-8e2b97e7c9e8?w=800&q=80", primaryColor: "#FF5733" },
  { slug: "mock-naturaverde", brand: "NaturaVerde", country: "Ecuador", heroTitle: "Productos naturales", description: "Salud y bienestar al por mayor", heroImage: "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=800&q=80", primaryColor: "#4CAF50" },
  { slug: "mock-plastimax", brand: "PlastiMax", country: "Venezuela", heroTitle: "Envases plásticos", description: "Soluciones de empaque para industria", heroImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80", primaryColor: "#00BCD4" },
  { slug: "mock-joyaslatam", brand: "Joyas Latam", country: "Bolivia", heroTitle: "Joyería fina", description: "Bisutería y joyería al por mayor", heroImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80", primaryColor: "#FFD700" },
  { slug: "mock-textil-hn", brand: "Textil HN", country: "Honduras", heroTitle: "Telas y textiles", description: "Fábrica mayorista de textiles", heroImage: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80", primaryColor: "#E040FB" },
  { slug: "mock-mascotas-felices", brand: "Mascotas Felices", country: "México", heroTitle: "Pet supplies", description: "Todo para tu mascota al precio mayorista", heroImage: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80", primaryColor: "#FF7043" },
  { slug: "mock-libros-sa", brand: "Libros S.A.", country: "Argentina", heroTitle: "Editorial mayorista", description: "Distribución de libros y papelería", heroImage: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=800&q=80", primaryColor: "#8D6E63" },
  { slug: "mock-automotriz-gt", brand: "Automotriz GT", country: "Guatemala", heroTitle: "Repuestos automotrices", description: "Partes y accesorios para vehículos", heroImage: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80", primaryColor: "#F44336" },
  { slug: "mock-farmaplus", brand: "FarmaPlus", country: "Colombia", heroTitle: "Insumos médicos", description: "Equipos y medicamentos mayoristas", heroImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80", primaryColor: "#26C6DA" },
  { slug: "mock-constructora-pe", brand: "ConstructoPe", country: "Perú", heroTitle: "Materiales de construcción", description: "Cemento, varillas y más", heroImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80", primaryColor: "#A1887F" },
  { slug: "mock-semillas-sv", brand: "Semillas SV", country: "El Salvador", heroTitle: "Semillas certificadas", description: "Agricultura de precisión", heroImage: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80", primaryColor: "#66BB6A" },
  { slug: "mock-impresiones-mx", brand: "ImpresionMX", country: "México", heroTitle: "Imprenta industrial", description: "Impresión y packaging al por mayor", heroImage: "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=800&q=80", primaryColor: "#AB47BC" },
  { slug: "mock-cafelatam", brand: "CaféLatam", country: "Colombia", heroTitle: "Café premium", description: "Exportación directa de café", heroImage: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80", primaryColor: "#795548" },
  { slug: "mock-solar-ni", brand: "SolarNi", country: "Nicaragua", heroTitle: "Energía solar", description: "Paneles y sistemas fotovoltaicos", heroImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80", primaryColor: "#FFC107" },
  { slug: "mock-pescados-do", brand: "Pescados DO", country: "República Dominicana", heroTitle: "Mariscos y pescados", description: "Del mar directo al negocio", heroImage: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&q=80", primaryColor: "#0288D1" },
  { slug: "mock-maderas-cr", brand: "Maderas CR", country: "Costa Rica", heroTitle: "Madera certificada", description: "Maderas finas para carpintería", heroImage: "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=800&q=80", primaryColor: "#8D6E63" },
  { slug: "mock-logistica-cl", brand: "LogísticaCL", country: "Chile", heroTitle: "Servicios logísticos", description: "Almacenamiento y distribución Latam", heroImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80", primaryColor: "#607D8B" },
  { slug: "mock-quimicos-co", brand: "QuímicosCO", country: "Colombia", heroTitle: "Productos químicos", description: "Insumos industriales certificados", heroImage: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&q=80", primaryColor: "#00BFA5" },
  { slug: "mock-juguetes-mx", brand: "JuguetesMX", country: "México", heroTitle: "Juguetería mayorista", description: "Importación y distribución de juguetes", heroImage: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80", primaryColor: "#FF5722" },
  { slug: "mock-calzado-bo", brand: "CalzadoBO", country: "Bolivia", heroTitle: "Calzado artesanal", description: "Cuero genuino boliviano", heroImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", primaryColor: "#795548" },
  { slug: "mock-pinturas-gt", brand: "PinturasGT", country: "Guatemala", heroTitle: "Pinturas industriales", description: "Para construcción y acabados", heroImage: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=800&q=80", primaryColor: "#FF7043" },
].map(s => ({
  slug: s.slug,
  landing: {
    store: { brand: s.brand, country: s.country, heroTitle: s.heroTitle, description: s.description, heroImage: s.heroImage, primaryColor: s.primaryColor },
    products: Array.from({ length: Math.floor(Math.random() * 80 + 5) }),
  }
}));

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
function HeroFeatured({ slug, landing, sideItems, featured, setFeatured, allItems }) {
  const hero    = getHero(landing);
  const brand   = getBrand(landing);
  const country = getCountry(landing);
  const desc    = getDesc(landing);
  const logo    = getLogo(landing);
  const count   = getProductCount(landing);

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      {/* Video full-width */}
      <video
        key={HERO_VIDEO}
        autoPlay muted loop playsInline preload="auto"
        src={HERO_VIDEO}
        crossOrigin="anonymous"
        onCanPlay={(event) => {
          const playPromise = event.currentTarget.play();
          if (playPromise) playPromise.catch(() => {});
        }}
        style={{ position: "absolute", inset: 0, zIndex: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
      />
      {/* Gradiente lateral izquierdo para texto legible */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "linear-gradient(90deg, rgba(4,8,5,0.85) 0%, rgba(4,8,5,0.4) 50%, rgba(4,8,5,0.05) 100%)",
      }} />
      {/* Fade hacia abajo al color de fondo */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 1,
        height: "35%",
        background: "linear-gradient(to bottom, transparent 0%, #040806 100%)",
      }} />

      {/* Headline centrado arriba */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 2,
        display: "flex", flexDirection: "column", alignItems: "center",
        paddingTop: 36, textAlign: "center", pointerEvents: "none",
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{
            margin: 0,
            fontSize: "clamp(0.65rem, 1.1vw, 0.9rem)",
            fontWeight: 700,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#7FE040",
            marginBottom: 10,
            opacity: 0.8,
          }}>
            Directorio de tiendas · Drokex
          </p>
          <p style={{
            margin: 0,
            fontSize: "clamp(1.8rem, 3.8vw, 3.6rem)",
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            lineHeight: 1.1,
            background: "linear-gradient(135deg, #ffffff 0%, #c8f5a0 50%, #7FE040 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "none",
            filter: "drop-shadow(0 0 18px rgba(127,224,64,0.25))",
          }}>
            Latam vende Latam
          </p>
        </div>
      </div>

      {/* Contenido overlaid */}
      <div className="shell" style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", alignItems: "flex-start", gap: 24, paddingTop: "22vh" }}>
        {/* Izquierda: info tienda */}
        <div style={{ flex: 1 }}>
          <h2 style={{
            margin: "0 0 20px", lineHeight: 1.15,
            fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)",
            fontWeight: 900, color: "#fff",
            textShadow: "0 2px 30px rgba(0,0,0,0.6)",
            maxWidth: 580,
          }}>
            Compra directo a proveedores.<br />
            <span style={{ color: "#7FE040" }}>Sin intermediarios. Sin fronteras.</span>
          </h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
            {[
              "✓ Proveedores verificados",
              "✓ Envíos a toda Latam",
              "✓ Precios mayoristas",
              "✓ Soporte directo",
            ].map(b => (
              <span key={b} style={{
                fontSize: "0.72rem", fontWeight: 700, color: "#7FE040",
                background: "rgba(127,224,64,0.1)", border: "1px solid rgba(127,224,64,0.25)",
                borderRadius: 20, padding: "5px 12px",
              }}>{b}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Card del grid ──
function StoreCard({ slug, landing, lm = false }) {
  const hero    = getHero(landing);
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
          <div style={{ position: "absolute", inset: 0, background: lm ? "linear-gradient(to top, rgba(255,255,255,0.6) 0%, rgba(0,0,0,0.05) 60%)" : "linear-gradient(to top, rgba(5,8,6,0.9) 0%, rgba(0,0,0,0.1) 60%)" }} />
          <span style={{ position: "absolute", top: 8, right: 8, background: "#7FE040", color: "#050505", fontSize: "0.52rem", fontWeight: 900, letterSpacing: "0.1em", padding: "2px 7px", borderRadius: 5, textTransform: "uppercase" }}>PRO</span>
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
  const [proLandings, setProLandings] = useState([...initialProLandings, ...MOCK_STORES]);
  const [loading, setLoading]       = useState(false);
  const [featured, setFeatured]     = useState(0);
  const [selCountry, setSelCountry] = useState("");
  const [selCategory, setSelCategory] = useState("");
  const [page, setPage] = useState(1);
  const [lm, setLm]     = useState(false);
  const PER_PAGE = 24;

  // Helpers de tema
  const bg    = lm ? "#f4f6f4" : "#040806";
  const card  = lm ? "#ffffff" : "rgba(255,255,255,0.04)";
  const txt   = lm ? "#111"   : "#fff";
  const sub   = lm ? "rgba(0,0,0,0.45)"  : "rgba(255,255,255,0.45)";
  const brd   = lm ? "rgba(0,0,0,0.09)"  : "rgba(255,255,255,0.07)";
  const w     = (op) => lm ? `rgba(0,0,0,${op})` : `rgba(255,255,255,${op})`;

  const fetchSuppliers = useCallback(async (q) => {
    setLoading(true);
    const res  = await fetch(`/api/directorio?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setSuppliers(data.suppliers || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchSuppliers(query), 300);
    return () => clearTimeout(timer);
  }, [query, fetchSuppliers]);

  useEffect(() => { setPage(1); }, [query, selCountry, selCategory]);

  useEffect(() => {
    try {
      const knownSlugs = new Set(proLandings.map(({ slug }) => slug));
      const localOnly  = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("drokex-proveedor-pro:")) {
          const slug = key.replace("drokex-proveedor-pro:", "");
          if (knownSlugs.has(slug)) continue;
          const raw = localStorage.getItem(key);
          if (raw) localOnly.push({ slug, landing: JSON.parse(raw) });
        }
      }
      if (localOnly.length) setProLandings(c => [...c, ...localOnly]);
    } catch {}
  }, []);

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
        onClick={() => setLm(v => !v)}
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
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "rgba(255,255,255,0.45)" }}>Tiendas Proveedor Pro</span>
            </div>
          </div>

          {/* Hero full-width */}
          {featuredItem && (
            <HeroFeatured
              slug={featuredItem.slug}
              landing={featuredItem.landing}
              allItems={filteredPro}
              featured={featured}
              setFeatured={setFeatured}
            />
          )}

        </section>
      )}

      {/* ── BUSCADOR + GRID ───────────────────────────── */}
      <section style={{ padding: "0 0 80px", marginTop: "-44vh", position: "relative", zIndex: 10 }}>
        <div className="shell">
          {/* Search bar */}
          <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative", flex: 1, maxWidth: 480 }}>
              <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="search"
                placeholder="Buscar proveedor, categoría o país..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{
                  width: "100%", padding: "12px 14px 12px 40px",
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
          </div>

          {/* Sidebar + Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 24, alignItems: "start" }}>

            {/* ── Sidebar filtros ── */}
            <div style={{ background: lm ? "#fff" : "rgba(255,255,255,0.03)", border: `1px solid ${brd}`, borderRadius: 14, padding: "20px 16px", position: "sticky", top: 90, boxShadow: lm ? "0 2px 16px rgba(0,0,0,0.07)" : "none" }}>

              {/* País */}
              <p style={{ margin: "0 0 10px", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: w(0.35) }}>País</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 22 }}>
                {["", ...allCountries].map(c => (
                  <button key={c || "__all__"} onClick={() => setSelCountry(c)} style={{
                    textAlign: "left", background: selCountry === c ? "rgba(127,224,64,0.12)" : "transparent",
                    border: `1px solid ${selCountry === c ? "rgba(127,224,64,0.35)" : "transparent"}`,
                    borderRadius: 7, padding: "6px 10px", cursor: "pointer", fontFamily: "inherit",
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
                    borderRadius: 7, padding: "6px 10px", cursor: "pointer", fontFamily: "inherit",
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
                  padding: "7px 10px", cursor: "pointer", fontFamily: "inherit",
                  fontSize: "0.72rem", fontWeight: 700, color: w(0.4),
                }}>
                  Limpiar filtros ✕
                </button>
              )}
            </div>

            {/* ── Grid ── */}
            <div id="directorio-grid">
              {pagedPro.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
                  {pagedPro.map(({ slug, landing }) => (
                    <StoreCard key={slug} slug={slug} landing={landing} lm={lm} />
                  ))}
                </div>
              ) : (
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.9rem", marginTop: 40 }}>
                  No se encontraron tiendas para los filtros seleccionados.
                </p>
              )}

              {/* Paginación */}
              {totalPages > 1 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 40 }}>
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
    </main>
  );
}
