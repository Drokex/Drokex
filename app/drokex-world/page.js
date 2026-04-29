"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  ShoppingBag,
  Globe2,
  X,
  Send,
  Sparkles,
  Bot,
  Gamepad2,
  Navigation,
  Plane,
  Radar,
  Zap,
  Store,
  ArrowRight,
  MousePointer2,
} from "lucide-react";

const countries = [
  {
    id: "mexico",
    country: "México",
    city: "CDMX",
    label: "MX",
    name: "Tech Norte MX",
    category: "Tecnología",
    x: 31,
    y: 24,
    color: "from-orange-300 to-orange-500",
    glow: "bg-orange-400/25",
    shops: 18,
    status: "Alta demanda",
    products: [
      { name: "Smartwatch Pro", tag: "Nuevo", type: "Importación" },
      { name: "Audífonos ANC", tag: "Tendencia", type: "Retail" },
      { name: "Cámara deportiva", tag: "Top búsqueda", type: "Proveedor" },
    ],
  },
  {
    id: "guatemala",
    country: "Guatemala",
    city: "Guatemala City",
    label: "GT",
    name: "Agro GT Market",
    category: "Agroindustria",
    x: 35,
    y: 29,
    color: "from-yellow-300 to-yellow-500",
    glow: "bg-yellow-400/25",
    shops: 11,
    status: "Exportación activa",
    products: [
      { name: "Café premium", tag: "Exportación", type: "Agroindustria" },
      { name: "Azúcar refinada", tag: "Mayorista", type: "Commodities" },
      { name: "Textil bordado", tag: "Artesanal", type: "Retail" },
    ],
  },
  {
    id: "honduras",
    country: "Honduras",
    city: "Tegucigalpa",
    label: "HN",
    name: "Maquila HN",
    category: "Manufactura",
    x: 39,
    y: 29,
    color: "from-cyan-300 to-cyan-500",
    glow: "bg-cyan-400/25",
    shops: 13,
    status: "Maquila activa",
    products: [
      { name: "Ropa deportiva", tag: "B2B", type: "Textiles" },
      { name: "Palma de aceite", tag: "Mayorista", type: "Agroindustria" },
      { name: "Camarones frescos", tag: "Exportación", type: "Alimentos" },
    ],
  },
  {
    id: "elsalvador",
    country: "El Salvador",
    city: "San Salvador",
    label: "SV",
    name: "Textil SV Hub",
    category: "Textiles",
    x: 37,
    y: 32,
    color: "from-blue-300 to-blue-500",
    glow: "bg-blue-400/25",
    shops: 8,
    status: "Zona franca",
    products: [
      { name: "Tejido técnico", tag: "Zona franca", type: "Textiles" },
      { name: "Confección sport", tag: "Exportación", type: "Retail" },
      { name: "Café tostado", tag: "Premium", type: "Alimentos" },
    ],
  },
  {
    id: "nicaragua",
    country: "Nicaragua",
    city: "Managua",
    label: "NI",
    name: "Agro Nica Market",
    category: "Agropecuario",
    x: 40,
    y: 33,
    color: "from-red-300 to-red-500",
    glow: "bg-red-400/25",
    shops: 7,
    status: "Mercado emergente",
    products: [
      { name: "Frijoles negros", tag: "Mayorista", type: "Agropecuario" },
      { name: "Cuero procesado", tag: "B2B", type: "Materias primas" },
      { name: "Oro artesanal", tag: "Premium", type: "Exportación" },
    ],
  },
  {
    id: "dominicana",
    country: "Rep. Dominicana",
    city: "Santo Domingo",
    label: "DO",
    name: "Caribe Trade DO",
    category: "Comercio",
    x: 57,
    y: 25,
    color: "from-rose-300 to-rose-500",
    glow: "bg-rose-400/25",
    shops: 16,
    status: "Puerto libre",
    products: [
      { name: "Tabaco premium", tag: "Exportación", type: "Agroindustria" },
      { name: "Cacao orgánico", tag: "Premium", type: "Alimentos" },
      { name: "Textil caribeño", tag: "Zona franca", type: "Textiles" },
    ],
  },
  {
    id: "colombia",
    country: "Colombia",
    city: "Bogotá",
    label: "CO",
    name: "MotorPartes Andina",
    category: "Repuestos",
    x: 44,
    y: 41,
    color: "from-lime-300 to-lime-500",
    glow: "bg-lime-400/25",
    shops: 32,
    status: "Cotización rápida",
    products: [
      { name: "Kit de frenos", tag: "Alta rotación", type: "Stock local" },
      { name: "Filtro de aceite", tag: "Disponible", type: "Mayorista" },
      { name: "Batería pesada", tag: "B2B", type: "Proveedor" },
    ],
  },
  {
    id: "peru",
    country: "Perú",
    city: "Lima",
    label: "PE",
    name: "Casa Perú Market",
    category: "Hogar",
    x: 42,
    y: 58,
    color: "from-sky-300 to-sky-500",
    glow: "bg-sky-400/25",
    shops: 14,
    status: "Nuevos proveedores",
    products: [
      { name: "Organizador modular", tag: "Top venta", type: "Hogar" },
      { name: "Lámpara LED", tag: "Stock medio", type: "Retail" },
      { name: "Set cocina", tag: "Promoción", type: "Cotizable" },
    ],
  },
  {
    id: "chile",
    country: "Chile",
    city: "Santiago",
    label: "CL",
    name: "Andino Trade CL",
    category: "Minería",
    x: 44,
    y: 74,
    color: "from-indigo-300 to-indigo-500",
    glow: "bg-indigo-400/25",
    shops: 21,
    status: "Exportación activa",
    products: [
      { name: "Cobre industrial", tag: "Exportación", type: "Minería" },
      { name: "Vino premium", tag: "Premium", type: "Agroindustria" },
      { name: "Salmón fresco", tag: "Mayorista", type: "Alimentos" },
    ],
  },
  {
    id: "brasil",
    country: "Brasil",
    city: "São Paulo",
    label: "BR",
    name: "BrasilTech Hub",
    category: "Tecnología",
    x: 60,
    y: 55,
    color: "from-green-300 to-green-500",
    glow: "bg-green-400/25",
    shops: 45,
    status: "Mayor mercado LATAM",
    products: [
      { name: "Electrónica local", tag: "Alta rotación", type: "Tecnología" },
      { name: "Soja commodity", tag: "Exportación", type: "Agroindustria" },
      { name: "Calzado premium", tag: "B2B", type: "Retail" },
    ],
  },
];

const routePairs = [
  ["mexico", "colombia"],
  ["colombia", "peru"],
  ["peru", "chile"],
  ["colombia", "brasil"],
  ["mexico", "brasil"],
];

const particles = Array.from({ length: 34 }).map((_, index) => ({
  id: index,
  x: 8 + ((index * 19) % 86),
  y: 12 + ((index * 31) % 76),
  delay: (index % 8) * 0.35,
  size: index % 4 === 0 ? "h-1.5 w-1.5" : "h-1 w-1",
}));

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getCountry(id) {
  return countries.find((country) => country.id === id);
}

function LatamMap() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {/* Zoom al cuadrante LATAM del mapa mundial */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/world.svg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "220% auto",
          backgroundPosition: "12% 60%",
          opacity: 0.55,
          filter: "contrast(1.3) brightness(1.1)",
        }}
      />
      {/* Oscurece zonas fuera de LATAM */}
      <div className="absolute inset-0 bg-black/40" />
      {/* Resplandor sobre LATAM */}
      <div className="absolute left-[30%] top-[20%] w-[45%] h-[65%] bg-lime-300/[0.12] blur-3xl rounded-full" />
    </div>
  );
}

function AnimatedRoutes({ activeCountry }) {
  return (
    <svg className="absolute inset-0 z-10 h-full w-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="routeGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(190,242,100,0.05)" />
          <stop offset="50%" stopColor="rgba(190,242,100,0.65)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
        </linearGradient>
        <filter id="routeGlow">
          <feGaussianBlur stdDeviation="0.7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {routePairs.map(([fromId, toId], index) => {
        const from = getCountry(fromId);
        const to = getCountry(toId);
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2 - 11;
        const isActive = activeCountry?.id === fromId || activeCountry?.id === toId;
        const path = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
        return (
          <g key={`${fromId}-${toId}`} opacity={isActive ? 1 : 0.45}>
            <path d={path} fill="none" stroke="url(#routeGradient)" strokeWidth={isActive ? 0.55 : 0.28} strokeLinecap="round" filter="url(#routeGlow)" />
            <motion.circle r="0.65" fill="rgba(190,242,100,0.95)">
              <animateMotion dur={`${3.2 + index * 0.35}s`} repeatCount="indefinite" path={path} />
            </motion.circle>
          </g>
        );
      })}
    </svg>
  );
}

function ParticleField() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute ${particle.size} rounded-full bg-lime-200/40 shadow-[0_0_16px_rgba(190,242,100,0.6)]`}
          style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
          animate={{ y: [0, -18, 0], opacity: [0.12, 0.85, 0.12], scale: [0.7, 1.25, 0.7] }}
          transition={{ repeat: Infinity, duration: 4.8, delay: particle.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function CountryNode({ country, nearby, active, onEnter, onTravel }) {
  return (
    <motion.div
      className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${country.x}%`, top: `${country.y}%` }}
      animate={{ y: nearby ? [-2, -8, -2] : [0, -4, 0] }}
      transition={{ repeat: Infinity, duration: nearby ? 1.6 : 3.4, ease: "easeInOut" }}
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); nearby ? onEnter(country) : onTravel(country); }}
        className="group relative outline-none"
      >
        <motion.div
          animate={{ scale: active ? 1.55 : 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
        >
          <div className={`absolute -inset-5 rounded-full blur-3xl transition ${nearby || active ? country.glow : "bg-white/5"}`} />
          <div className="absolute left-1/2 top-[30px] h-9 w-11 -translate-x-1/2 rotate-45 rounded-xl bg-black/50 blur-lg" />
          <div className="relative h-[55px] w-[52px]">
            <div className="absolute left-1/2 top-5 h-9 w-9 -translate-x-1/2 rotate-45 rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.015] shadow-[0_10px_24px_rgba(0,0,0,0.6)]" />
            <div className="absolute left-[15px] top-[17px] h-7 w-6 skew-y-[-22deg] rounded-md border border-white/10 bg-zinc-800" />
            <div className="absolute left-[27px] top-[18px] h-7 w-5 skew-y-[28deg] rounded-md border border-white/10 bg-zinc-950" />
            <div className={`absolute left-1/2 top-1.5 h-7 w-7 -translate-x-1/2 rotate-45 rounded-xl bg-gradient-to-br ${country.color} shadow-md`} />
            <div className="absolute left-1/2 top-5 grid h-[18px] w-[18px] -translate-x-1/2 place-items-center rounded-md border border-white/20 bg-black/75">
              <Store size={9} className="text-white/80" />
            </div>
            <motion.div
              className={`absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${nearby ? "bg-lime-100" : "bg-white/70"}`}
              animate={{ scale: nearby ? [1, 1.65, 1] : [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: nearby ? 1.1 : 2.4 }}
            />
            <div className="absolute left-1/2 top-[41px] -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/70 px-1.5 py-px text-[8px] font-semibold text-white/80 backdrop-blur-md">
              {nearby ? `Entrar · ${country.country}` : country.country}
            </div>
            {active && (
              <motion.div layoutId="active-country-ring" className="absolute inset-0 rounded-full border border-lime-300 shadow-[0_0_45px_rgba(190,242,100,0.55)]" />
            )}
          </div>
        </motion.div>
      </button>
    </motion.div>
  );
}

function Player({ player, moving }) {
  return (
    <motion.div
      className="absolute z-40 -translate-x-1/2 -translate-y-1/2"
      animate={{ left: `${player.x}%`, top: `${player.y}%` }}
      transition={{ type: "spring", stiffness: 80, damping: 15 }}
    >
      <motion.div className="relative" animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}>
        <AnimatePresence>
          {moving && (
            <motion.div
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 0.9, scale: 1 }}
              exit={{ opacity: 0, scale: 1.7 }}
              className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-lime-300/30 bg-lime-300/10 blur-sm"
            />
          )}
        </AnimatePresence>
        <div className="absolute left-1/2 top-[60px] h-16 w-20 -translate-x-1/2 rounded-full bg-lime-300/20 blur-2xl" />
        <div className="relative grid h-[78px] w-[78px] place-items-center rounded-[1.7rem] border border-lime-300/30 bg-black/80 shadow-[0_0_40px_rgba(190,242,100,0.28)] backdrop-blur-xl">
          <Bot className="text-lime-300" size={38} />
          <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full border border-black bg-lime-300" />
        </div>
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/85 px-3 py-1 text-xs text-zinc-300 shadow-lg">
          Drokex Bot
        </div>
      </motion.div>
    </motion.div>
  );
}

function TravelLine({ from, to }) {
  if (!to) return null;
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2 - 10;
  const path = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
  return (
    <svg className="absolute inset-0 z-20 h-full w-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
      <motion.path
        d={path}
        fill="none"
        stroke="rgba(190,242,100,0.9)"
        strokeWidth="0.5"
        strokeDasharray="2 2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.9 }}
        exit={{ pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.6 }}
      />
    </svg>
  );
}

function CountryPreview({ country, onEnter }) {
  return (
    <AnimatePresence>
      {country && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          className="absolute bottom-6 left-1/2 z-50 w-[420px] -translate-x-1/2 rounded-[2rem] border border-lime-300/20 bg-black/80 p-4 shadow-2xl shadow-black/60 backdrop-blur-xl max-md:left-4 max-md:right-4 max-md:w-auto max-md:translate-x-0"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${country.color} font-black text-black`}>
                {country.label}
              </div>
              <div>
                <p className="text-xs text-lime-200">Estás cerca de</p>
                <h3 className="font-bold text-white">{country.country}</h3>
                <p className="text-xs text-zinc-400">{country.shops} tiendas · {country.status}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onEnter(country); }}
              className="flex items-center gap-2 rounded-2xl bg-lime-300 px-4 py-3 text-sm font-black text-black transition hover:bg-lime-200"
            >
              Entrar <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StorePanel({ country, onClose }) {
  return (
    <AnimatePresence>
      {country && (
        <motion.aside
          initial={{ opacity: 0, x: 42 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 42 }}
          transition={{ duration: 0.28 }}
          className="absolute right-5 top-5 z-[70] h-[calc(100%-2.5rem)] w-[390px] overflow-hidden rounded-[2.2rem] border border-white/10 bg-zinc-950/90 p-5 text-white shadow-2xl shadow-black/60 backdrop-blur-2xl max-lg:bottom-5 max-lg:left-5 max-lg:right-5 max-lg:top-auto max-lg:h-auto max-lg:w-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`absolute -right-20 -top-20 h-52 w-52 rounded-full ${country.glow} blur-3xl`} />
          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-xs text-lime-200">
                  <MapPin size={14} /> {country.city}, {country.country}
                </div>
                <h2 className="text-2xl font-black leading-tight">{country.name}</h2>
                <p className="mt-1 text-sm text-zinc-400">{country.category} · {country.shops} tiendas conectadas</p>
              </div>
              <button type="button" onClick={onClose} className="rounded-full border border-white/10 p-2 text-zinc-300 hover:bg-white/10">
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs text-zinc-500">Estado</p>
                <p className="mt-1 text-sm font-bold text-lime-200">{country.status}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs text-zinc-500">Zona</p>
                <p className="mt-1 text-sm font-bold text-white">LATAM Hub</p>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                  <ShoppingBag size={17} /> Productos destacados
                </div>
                <span className="rounded-full bg-lime-300/10 px-3 py-1 text-[11px] font-bold text-lime-200">Cotizable</span>
              </div>
              <div className="mt-4 space-y-3">
                {country.products.map((product) => (
                  <motion.div
                    key={product.name}
                    whileHover={{ x: 4 }}
                    className="rounded-2xl border border-white/10 bg-black/35 p-3 transition hover:border-lime-300/40"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-xs text-zinc-500">{product.type} · {product.tag}</p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-black">Ver</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <button type="button" className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 py-4 font-black text-black transition hover:bg-lime-200">
              <Send size={18} /> Solicitar cotización
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function Controls({ nearbyCountry, move, onEnter }) {
  return (
    <div
      className="absolute bottom-6 left-6 z-[60] rounded-[2rem] border border-white/10 bg-black/60 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl max-md:bottom-4 max-md:left-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-200">
        <Navigation size={16} /> Controles
      </div>
      <div className="grid grid-cols-3 gap-2">
        <span />
        <button type="button" onClick={() => move(0, -6)} className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 hover:bg-lime-300 hover:text-black">↑</button>
        <span />
        <button type="button" onClick={() => move(-6, 0)} className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 hover:bg-lime-300 hover:text-black">←</button>
        <button
          type="button"
          onClick={() => nearbyCountry && onEnter(nearbyCountry)}
          className={`rounded-xl px-4 py-3 font-black transition ${nearbyCountry ? "bg-lime-300 text-black hover:bg-lime-200" : "border border-white/10 bg-white/10 text-white/35"}`}
        >
          Entrar
        </button>
        <button type="button" onClick={() => move(6, 0)} className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 hover:bg-lime-300 hover:text-black">→</button>
        <span />
        <button type="button" onClick={() => move(0, 6)} className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 hover:bg-lime-300 hover:text-black">↓</button>
        <span />
      </div>
      <p className="mt-3 max-w-[210px] text-xs leading-5 text-zinc-500">
        {nearbyCountry ? `Zona activa: ${nearbyCountry.country}` : "Muévete cerca de un país para activar tiendas."}
      </p>
    </div>
  );
}

export default function DrokexWorldPage() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [query, setQuery] = useState("");
  const [player, setPlayer] = useState({ x: 44, y: 45 });
  const [destination, setDestination] = useState(null);
  const [moving, setMoving] = useState(false);

  const filteredCountries = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return countries;
    return countries.filter((country) =>
      `${country.country} ${country.city} ${country.name} ${country.category}`.toLowerCase().includes(text)
    );
  }, [query]);

  const nearbyCountry = useMemo(() => {
    return countries.find((country) => distance(player, country) < 10.5) || null;
  }, [player]);

  function pulseMove() {
    setMoving(true);
    window.clearTimeout(window.__drokexMoveTimeout);
    window.__drokexMoveTimeout = window.setTimeout(() => setMoving(false), 700);
  }

  function move(dx, dy) {
    setSelectedCountry(null);
    setDestination(null);
    setPlayer((current) => ({
      x: clamp(current.x + dx, 16, 84),
      y: clamp(current.y + dy, 16, 87),
    }));
    pulseMove();
  }

  function travelToCountry(country) {
    setSelectedCountry(null);
    setDestination({ x: country.x, y: country.y });
    setPlayer({ x: clamp(country.x - 2.5, 16, 84), y: clamp(country.y + 5, 16, 87) });
    pulseMove();
    window.setTimeout(() => setDestination(null), 900);
  }

  function enterCountry(country) {
    setSelectedCountry(country);
    setDestination(null);
  }

  function handleMapClick(event) {
    if (event.target.closest("button")) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 16, 84);
    const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 16, 87);
    setSelectedCountry(null);
    setDestination({ x, y });
    setPlayer({ x, y });
    pulseMove();
    window.setTimeout(() => setDestination(null), 850);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#030403] text-white">
      <section className="relative min-h-screen p-4 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(163,230,53,0.17),transparent_28%),radial-gradient(circle_at_70%_10%,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_60%_70%,rgba(163,230,53,0.08),transparent_34%),linear-gradient(180deg,#090a09,#000)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:48px_48px]" />

        <header className="relative z-[80] flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/[0.045] px-5 py-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
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
            <div className="relative w-full min-w-[280px] max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar país, tienda o categoría"
                className="w-full rounded-2xl border border-white/10 bg-black/55 py-3 pl-11 pr-4 text-sm outline-none placeholder:text-zinc-600 focus:border-lime-300/60"
              />
            </div>
          </div>
        </header>

        <div className="relative z-10 pt-6">
          <div
            onClick={handleMapClick}
            className="relative min-h-[880px] cursor-crosshair overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/50 backdrop-blur-sm max-lg:min-h-[760px]"
          >
            <ParticleField />
            <LatamMap />
            <AnimatedRoutes activeCountry={nearbyCountry || selectedCountry} />
            <TravelLine from={player} to={destination} />

            <div className="absolute left-6 top-6 z-40 max-w-xl pointer-events-none">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-black/45 px-3 py-1 text-xs font-semibold text-lime-200 backdrop-blur-md">
                <Gamepad2 size={14} /> Click para viajar · Acércate para entrar
              </div>
              <h2 className="max-w-[600px] text-5xl font-black tracking-tight max-md:text-3xl">
                Explora productos entre países como si fuera un mapa vivo.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-zinc-400">
                Drokex convierte el marketplace en una experiencia: viaja por LATAM, descubre tiendas y solicita cotizaciones por país.
              </p>
            </div>

            <div className="absolute right-6 top-6 z-40 hidden rounded-[2rem] border border-white/10 bg-black/45 p-4 backdrop-blur-xl lg:block">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                <Sparkles size={16} className="text-lime-300" /> Rutas comerciales
              </div>
              <div className="space-y-2 text-xs text-zinc-400">
                <div className="flex items-center justify-between gap-8"><span>México → Colombia</span><span className="text-lime-200">Activo</span></div>
                <div className="flex items-center justify-between gap-8"><span>Colombia → Perú</span><span className="text-lime-200">Activo</span></div>
                <div className="flex items-center justify-between gap-8"><span>Colombia → Brasil</span><span className="text-lime-200">Nuevo</span></div>
              </div>
            </div>

            {filteredCountries.map((country) => (
              <CountryNode
                key={country.id}
                country={country}
                nearby={nearbyCountry?.id === country.id}
                active={selectedCountry?.id === country.id}
                onEnter={enterCountry}
                onTravel={travelToCountry}
              />
            ))}

            <Player player={player} moving={moving} />
            <Controls nearbyCountry={nearbyCountry} move={move} onEnter={enterCountry} />

            <div className="absolute bottom-6 right-6 z-[60] flex flex-wrap justify-end gap-2 max-md:hidden" onClick={(e) => e.stopPropagation()}>
              {countries.map((country) => (
                <button
                  key={country.id}
                  type="button"
                  onClick={() => travelToCountry(country)}
                  className="group flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs font-semibold text-zinc-300 backdrop-blur-md transition hover:border-lime-300/50 hover:text-lime-100"
                >
                  <Plane size={13} className="transition group-hover:text-lime-300" /> Ir a {country.country}
                </button>
              ))}
            </div>

            <div className="absolute left-1/2 top-[92%] z-40 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-xs text-zinc-400 backdrop-blur-md xl:flex">
              <MousePointer2 size={14} /> También puedes hacer click en cualquier parte del mapa para mover el robot.
            </div>

            <CountryPreview country={!selectedCountry ? nearbyCountry : null} onEnter={enterCountry} />
            <StorePanel country={selectedCountry} onClose={() => setSelectedCountry(null)} />
          </div>
        </div>
      </section>
    </main>
  );
}
