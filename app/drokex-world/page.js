"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, X, Globe2, Store, Zap, ArrowRight } from "lucide-react";
import DrokexGlobe from "./globe-component";

const countries = [
  { id: "mexico",     country: "México",               glow: "bg-orange-400/25" },
  { id: "guatemala",  country: "Guatemala",             glow: "bg-yellow-400/25" },
  { id: "elsalvador", country: "El Salvador",           glow: "bg-blue-400/25"   },
  { id: "honduras",   country: "Honduras",              glow: "bg-cyan-400/25"   },
  { id: "nicaragua",  country: "Nicaragua",             glow: "bg-red-400/25"    },
  { id: "dominicana", country: "República Dominicana",  glow: "bg-rose-400/25"   },
  { id: "colombia",   country: "Colombia",              glow: "bg-lime-400/25"   },
  { id: "peru",       country: "Perú",                  glow: "bg-sky-400/25"    },
];

const HOW_IT_WORKS = [
  {
    n: "01", label: "EXPLORAR PAÍSES", icon: Globe2,
    desc: "Rota el globo y haz click en el punto de un país.",
    title: "Explora el mapa de proveedores LATAM",
    detail: "Drokex World es un mapa interactivo 3D de toda la red de proveedores en América Latina. Cada punto de color representa un país activo con tiendas Pro disponibles.",
    steps: [
      "Arrastra el globo para rotarlo y navegar por la región.",
      "Haz zoom con la rueda del mouse para acercarte.",
      "Haz click en cualquier punto de color para entrar al país.",
    ],
  },
  {
    n: "02", label: "VER TIENDAS PRO", icon: Store,
    desc: "Descubre proveedores verificados por mercado.",
    title: "Tiendas Pro — proveedores verificados",
    detail: "Al entrar a un país, verás todas las tiendas Proveedor Pro activas en ese mercado. Son catálogos oficiales con productos reales, precios y datos de contacto del proveedor.",
    steps: [
      "Cada tarjeta muestra el nombre, logo y cantidad de productos.",
      "Toca «Ver tienda» para ver el catálogo completo.",
      "Puedes filtrar países desde la barra de búsqueda arriba.",
    ],
  },
  {
    n: "03", label: "CONECTAR · COTIZAR", icon: Zap,
    desc: "Accede directo a la tienda y solicita tu precio.",
    title: "Conecta y solicita cotizaciones",
    detail: "Dentro de cada tienda Pro puedes ver el catálogo, explorar productos con precios en tu moneda local y contactar directamente al proveedor para negociar volumen y precio.",
    steps: [
      "Los precios se convierten automáticamente a tu moneda.",
      "Contacta al proveedor directamente desde su tienda.",
      "¿Eres proveedor? Publica tu tienda desde «Para proveedores».",
    ],
  },
];

function HowItWorksModal({ item, onClose }) {
  const Icon = item?.icon;
  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed left-1/2 top-1/2 z-[210] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-white/10 bg-zinc-950 p-7 shadow-2xl shadow-black/80"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow */}
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-lime-300/10 blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="relative flex items-start justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-lime-300/10 border border-lime-300/20">
                  {Icon && <Icon size={20} className="text-lime-300" />}
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-[0.18em] text-lime-400/60 uppercase">{item.n}</p>
                  <h3 className="text-lg font-black text-white leading-tight">{item.title}</h3>
                </div>
              </div>
              <button type="button" onClick={onClose} className="rounded-full border border-white/10 p-2 text-zinc-400 hover:bg-white/10 shrink-0">
                <X size={16} />
              </button>
            </div>

            {/* Detail */}
            <p className="relative text-sm text-zinc-400 leading-relaxed mb-5">{item.detail}</p>

            {/* Steps */}
            <div className="relative space-y-3">
              {item.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime-300/10 border border-lime-300/20 text-[10px] font-black text-lime-300">{i + 1}</span>
                  <p className="text-sm text-zinc-300 leading-snug">{step}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="relative mt-7 w-full rounded-2xl bg-lime-300 py-3 text-sm font-black text-black transition hover:bg-lime-200"
            >
              Entendido
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function StorePanel({ country, onClose, proLandings = [] }) {
  const countryLandings = useMemo(() => {
    if (!country) return [];
    const name = country.country;
    return proLandings.filter(l => {
      const s = l.store || {};
      const cs = s.countries?.length ? s.countries : s.country ? [s.country] : [];
      return cs.some(c => c.toLowerCase() === name.toLowerCase());
    });
  }, [country, proLandings]);

  return (
    <AnimatePresence>
      {country && (
        <motion.aside
          initial={{ opacity: 0, x: 42 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 42 }}
          transition={{ duration: 0.28 }}
          className="absolute right-5 top-5 z-[70] h-[calc(100%-2.5rem)] w-[360px] overflow-y-auto rounded-[2.2rem] border border-white/10 bg-zinc-950/90 p-5 text-white shadow-2xl shadow-black/60 backdrop-blur-2xl max-lg:bottom-5 max-lg:left-5 max-lg:right-5 max-lg:top-auto max-lg:h-auto max-lg:w-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`absolute -right-20 -top-20 h-52 w-52 rounded-full ${country.glow} blur-3xl`} />
          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-xs text-lime-200">
                  <MapPin size={14} /> {country.country}
                </div>
                <h2 className="text-2xl font-black leading-tight">{country.country}</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  {countryLandings.length} tienda{countryLandings.length !== 1 ? "s" : ""} Pro disponible{countryLandings.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button type="button" onClick={onClose} className="rounded-full border border-white/10 p-2 text-zinc-300 hover:bg-white/10">
                <X size={18} />
              </button>
            </div>

            {countryLandings.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center">
                <p className="text-sm text-zinc-500">Aún no hay tiendas Pro en {country.country}.</p>
                <p className="mt-1 text-xs text-zinc-600">Sé el primero en publicar aquí.</p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {countryLandings.map((l) => {
                  const s = l.store || {};
                  const primary = s.primaryColor || "#ff9f2e";
                  const gradFrom = s.gradientFromColor || "#b86cff";
                  const gradTo = s.gradientToColor || "#ff7db8";
                  const heroImg = s.heroImage || "";
                  const btnText = s.buttonTextColor || "#ffffff";
                  const products = l.products || [];
                  const countryDisplay = (s.countries?.length ? s.countries : s.country ? [s.country] : []).join(" · ");
                  return (
                    <motion.a
                      key={l.slug}
                      href={`/proveedor-pro/tienda/${l.slug}`}
                      whileHover={{ y: -3 }}
                      style={{ textDecoration: "none", display: "block", borderRadius: 18, overflow: "hidden", background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
                    >
                      {/* Hero banner */}
                      <div style={{ height: 130, position: "relative", overflow: "hidden", background: heroImg ? `url(${heroImg}) center/cover no-repeat` : `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}>
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.5) 100%)" }} />
                        <span style={{ position: "absolute", top: 10, right: 10, background: "#59ff35", color: "#050505", fontSize: "0.55rem", fontWeight: 900, letterSpacing: "0.12em", padding: "3px 8px", borderRadius: 6, textTransform: "uppercase" }}>PRO</span>
                        {!heroImg && products.some(p => p.image) && (
                          <div style={{ position: "absolute", bottom: 10, left: 10, display: "flex", gap: 5 }}>
                            {products.slice(0, 3).filter(p => p.image).map((p, i) => (
                              <div key={i} style={{ width: 38, height: 38, borderRadius: 8, overflow: "hidden", border: "2px solid rgba(255,255,255,0.3)" }}>
                                <img src={p.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Logo flotante */}
                      <div style={{ padding: "0 16px", marginTop: -18, position: "relative", zIndex: 1 }}>
                        <div style={{ width: 38, height: 38, borderRadius: "50%", background: s.logo ? "transparent" : primary, border: "3px solid #0d0d0d", boxShadow: "0 2px 10px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "0.9rem", color: btnText, overflow: "hidden" }}>
                          {s.logo ? <img src={s.logo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : (s.brand || "?").charAt(0)}
                        </div>
                      </div>
                      {/* Info */}
                      <div style={{ padding: "8px 16px 14px" }}>
                        <p style={{ margin: 0, fontWeight: 900, fontSize: "0.95rem", color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.brand || "Tienda"}</p>
                        {countryDisplay && <p style={{ margin: "2px 0 0", fontSize: "0.72rem", color: "#888", fontWeight: 600 }}>{countryDisplay}</p>}
                        <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "0.7rem", background: `${primary}22`, color: primary, fontWeight: 800, padding: "3px 9px", borderRadius: 7 }}>
                            {products.length} producto{products.length !== 1 ? "s" : ""}
                          </span>
                          <span style={{ fontSize: "0.72rem", fontWeight: 900, color: "#bef264", display: "flex", alignItems: "center", gap: 3 }}>
                            Ver tienda
                            <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </span>
                        </div>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export default function DrokexWorldPage() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [query, setQuery] = useState("");
  const [proLandings, setProLandings] = useState([]);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    fetch("/api/proveedor-pro")
      .then(r => r.ok ? r.json() : { landings: [] })
      .then(d => setProLandings(d.landings || []))
      .catch(() => {});
  }, []);

  function handleCountrySelect(id) {
    const country = countries.find(c => c.id === id);
    if (country) setSelectedCountry(country);
  }

  const filteredCountries = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(c => c.country.toLowerCase().includes(q));
  }, [query]);

  return (
    <main className="relative h-screen overflow-hidden bg-black text-white">

      {/* Globe — full screen */}
      <div className="absolute inset-0">
        <DrokexGlobe onCountrySelect={handleCountrySelect} selectedCountry={selectedCountry} />
      </div>

      {/* ── TOP BAR ── */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 pt-5">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-lime-300 font-black text-black text-lg shadow-[0_0_24px_rgba(190,242,100,0.4)]">D</div>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-lime-400/70 uppercase">Marketplace · LATAM</p>
            <h1 className="text-base font-black leading-none tracking-tight">Drokex World</h1>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={15} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar país..."
            className="w-56 rounded-2xl border border-white/10 bg-black/60 py-2.5 pl-9 pr-4 text-sm outline-none placeholder:text-zinc-600 focus:border-lime-300/50 backdrop-blur-xl"
          />
          {query && filteredCountries.length > 0 && (
            <div className="absolute top-full right-0 mt-2 z-[90] flex flex-col gap-1 min-w-full">
              {filteredCountries.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => { handleCountrySelect(c.id); setQuery(""); }}
                  className="rounded-xl border border-lime-300/20 bg-black/90 px-4 py-2 text-sm font-semibold text-lime-200 backdrop-blur-md hover:bg-lime-300/10 transition text-left"
                >
                  {c.country}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── LEFT PANEL: cómo funciona ── */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 max-lg:hidden">
        <p className="mb-1 text-[11px] font-bold tracking-[0.22em] text-lime-400/60 uppercase">Cómo funciona</p>

        {HOW_IT_WORKS.map((item) => (
          <motion.div
            key={item.n}
            whileHover={{ x: 5 }}
            onClick={() => setActiveModal(item)}
            className="flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-black/60 px-5 py-4 backdrop-blur-xl w-72 cursor-pointer hover:border-lime-300/20 transition-colors"
          >
            <span className="mt-0.5 text-xs font-black text-lime-400/40 leading-none shrink-0">{item.n}</span>
            <div className="flex-1">
              <p className="text-sm font-black tracking-[0.08em] text-lime-300 uppercase leading-none mb-1.5">{item.label}</p>
              <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
            </div>
            <ArrowRight size={13} className="text-lime-400/30 shrink-0 mt-0.5" />
          </motion.div>
        ))}

        {/* Stats */}
        <div className="mt-1 flex gap-3">
          <div className="flex-1 rounded-2xl border border-white/[0.07] bg-black/50 px-4 py-3 backdrop-blur-xl text-center">
            <p className="text-2xl font-black text-lime-300 leading-none">{countries.length}</p>
            <p className="text-[11px] text-zinc-600 mt-1">Países</p>
          </div>
          <div className="flex-1 rounded-2xl border border-white/[0.07] bg-black/50 px-4 py-3 backdrop-blur-xl text-center">
            <p className="text-2xl font-black text-lime-300 leading-none">{proLandings.length}</p>
            <p className="text-[11px] text-zinc-600 mt-1">Tiendas Pro</p>
          </div>
        </div>
      </div>

      {/* ── BOTTOM HINT ── */}
      <AnimatePresence>
        {!selectedCountry && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-black/55 px-5 py-2.5 text-xs text-zinc-400 backdrop-blur-xl pointer-events-none"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse" />
            Haz click en un país para ver sus tiendas Pro
          </motion.div>
        )}
      </AnimatePresence>

      {/* Store panel */}
      <StorePanel country={selectedCountry} onClose={() => setSelectedCountry(null)} proLandings={proLandings} />

      {/* How it works modal */}
      <HowItWorksModal item={activeModal} onClose={() => setActiveModal(null)} />
    </main>
  );
}
