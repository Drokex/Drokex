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
  { n: "01", label: "EXPLORAR PAÍSES",        desc: "Rota el globo y haz click en el punto de un país.", icon: Globe2 },
  { n: "02", label: "VER TIENDAS PRO",        desc: "Descubre proveedores verificados por mercado.",      icon: Store },
  { n: "03", label: "CONECTAR · COTIZAR",     desc: "Accede directo a la tienda y solicita tu precio.",  icon: Zap   },
];

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
              <div className="mt-5 space-y-3">
                {countryLandings.map((l) => {
                  const s = l.store || {};
                  const primary = s.primaryColor || "#22c400";
                  const firstProduct = l.products?.find(p => p.image);
                  return (
                    <motion.a
                      key={l.slug}
                      href={`/proveedor-pro/tienda/${l.slug}`}
                      whileHover={{ x: 4 }}
                      style={{ textDecoration: "none" }}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/35 p-3 transition hover:border-lime-300/40"
                    >
                      <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: primary, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "1rem", color: "#fff" }}>
                        {s.logo
                          ? <img src={s.logo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                          : (s.brand || "?").charAt(0)}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: "0.9rem", color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.brand || "Tienda"}</p>
                        <p style={{ margin: 0, fontSize: "0.72rem", color: "#888" }}>{l.products?.length || 0} producto{l.products?.length !== 1 ? "s" : ""}</p>
                      </div>
                      {firstProduct && (
                        <div style={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                          <img src={firstProduct.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      )}
                      <span style={{ fontSize: "0.8rem", color: "#bef264", fontWeight: 900 }}>→</span>
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

        {HOW_IT_WORKS.map(({ n, label, desc }) => (
          <motion.div
            key={n}
            whileHover={{ x: 5 }}
            className="flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-black/60 px-5 py-4 backdrop-blur-xl w-72 cursor-default"
          >
            <span className="mt-0.5 text-xs font-black text-lime-400/40 leading-none shrink-0">{n}</span>
            <div>
              <p className="text-sm font-black tracking-[0.08em] text-lime-300 uppercase leading-none mb-1.5">{label}</p>
              <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
            </div>
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
    </main>
  );
}
