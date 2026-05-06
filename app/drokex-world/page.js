"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, X, Radar, Sparkles } from "lucide-react";
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
    <main className="h-screen overflow-hidden bg-[#030403] text-white flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(163,230,53,0.12),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(163,230,53,0.06),transparent_40%)]" />

      {/* Header */}
      <header className="relative z-[80] flex flex-wrap items-center justify-between gap-4 mx-4 mt-4 rounded-[2rem] border border-white/10 bg-white/[0.045] px-5 py-4 shadow-2xl shadow-black/30 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-lime-300 font-black text-black shadow-[0_0_28px_rgba(190,242,100,0.28)]">D</div>
          <div>
            <p className="text-xs text-zinc-400">Marketplace exploratorio · LATAM</p>
            <h1 className="text-xl font-black">Drokex World</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 max-md:w-full">
          <div className="hidden items-center gap-2 rounded-full border border-lime-300/15 bg-lime-300/10 px-4 py-2 text-xs font-semibold text-lime-100 md:flex">
            <Radar size={15} /> {countries.length} países activos
          </div>
          <div className="relative w-full min-w-[260px] max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar país..."
              className="w-full rounded-2xl border border-white/10 bg-black/55 py-3 pl-11 pr-4 text-sm outline-none placeholder:text-zinc-600 focus:border-lime-300/60"
            />
          </div>
        </div>

        {/* Search results dropdown */}
        {query && filteredCountries.length > 0 && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[90] flex gap-2 flex-wrap justify-center">
            {filteredCountries.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => { handleCountrySelect(c.id); setQuery(""); }}
                className="rounded-full border border-lime-300/30 bg-black/80 px-4 py-2 text-sm font-semibold text-lime-200 backdrop-blur-md hover:bg-lime-300/10 transition"
              >
                {c.country}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Globe */}
      <div className="relative flex-1 min-h-0 mx-4 mb-4 mt-3 rounded-[2.5rem] overflow-hidden border border-white/10">
        <DrokexGlobe onCountrySelect={handleCountrySelect} selectedCountry={selectedCountry} />

        {/* Hint */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-xs text-zinc-400 backdrop-blur-md pointer-events-none">
          <Sparkles size={13} className="text-lime-300" /> Haz click en un país para ver sus tiendas
        </div>

        <StorePanel country={selectedCountry} onClose={() => setSelectedCountry(null)} proLandings={proLandings} />
      </div>
    </main>
  );
}
