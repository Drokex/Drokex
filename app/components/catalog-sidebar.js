"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

const CATEGORY_META = {
  "Automatizacion industrial": { count: 127, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/><path d="M22 12a10 10 0 0 1-10 10A10 10 0 0 1 2 12"/></svg> },
  "Empaque y logistica": { count: 98, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> },
  "Movilidad electrica": { count: 64, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
  "Agroindustria": { count: 76, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12M12 12C12 7 7 4 2 4c0 5 3 9 10 8M12 12c0-5 5-8 10-8-1 5-4 9-10 8"/></svg> },
  "Retail y consumo": { count: 112, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
  "Construccion modular": { count: 51, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
};

const AVAILABILITY_META = {
  "Entrega inmediata": { count: 132, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  "Disponible por pedido": { count: 214, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> },
  "Produccion programada": { count: 87, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
};

const ORIGIN_DATA = [
  { name: "Colombia", flag: "🇨🇴", count: 189 },
  { name: "China", flag: "🇨🇳", count: 245 },
  { name: "Turquía", flag: "🇹🇷", count: 68 },
  { name: "Estados Unidos", flag: "🇺🇸", count: 102 },
];

const CATEGORIES = Object.keys(CATEGORY_META);
const AVAILABILITIES = Object.keys(AVAILABILITY_META);

export default function CatalogSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getArray = (key) => {
    const val = searchParams.getAll(key);
    return val;
  };

  const selectedCategories = getArray("categoria");
  const selectedAvailability = getArray("disponibilidad");
  const selectedOrigin = getArray("origen");

  const toggle = useCallback((key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll(key);
    params.delete(key);
    if (current.includes(value)) {
      current.filter(v => v !== value).forEach(v => params.append(key, v));
    } else {
      [...current, value].forEach(v => params.append(key, v));
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  const clearAll = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const hasFilters = selectedCategories.length > 0 || selectedAvailability.length > 0 || selectedOrigin.length > 0;

  return (
    <aside className="cdk-sidebar">
      <div className="cdk-sidebar-header">
        <div>
          <p className="cdk-sidebar-kicker">FILTRAR POR</p>
          <p className="cdk-sidebar-desc">Refina por categoría, disponibilidad y accede rápido al panel comercial.</p>
        </div>
        <button className="cdk-filter-btn" aria-label="Filtros">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/>
          </svg>
        </button>
      </div>

      <div className="cdk-sidebar-section">
        <p className="cdk-section-label">CATEGORÍAS</p>
        {CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat];
          const active = selectedCategories.includes(cat);
          return (
            <label key={cat} className={`cdk-filter-row${active ? " is-active" : ""}`} onClick={() => toggle("categoria", cat)} style={{ cursor: "pointer" }}>
              <span className="cdk-filter-icon">{meta.icon}</span>
              <span className="cdk-filter-name">{cat}</span>
              <span className="cdk-filter-count">{meta.count}</span>
            </label>
          );
        })}
        <button className="cdk-show-more">
          Ver todas las categorías
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      <div className="cdk-sidebar-section">
        <p className="cdk-section-label">DISPONIBILIDAD</p>
        {AVAILABILITIES.map((opt) => {
          const meta = AVAILABILITY_META[opt];
          const active = selectedAvailability.includes(opt);
          return (
            <label key={opt} className={`cdk-filter-row${active ? " is-active" : ""}`} onClick={() => toggle("disponibilidad", opt)} style={{ cursor: "pointer" }}>
              <span className="cdk-filter-icon">{meta.icon}</span>
              <span className="cdk-filter-name">{opt}</span>
              <span className="cdk-filter-count">{meta.count}</span>
            </label>
          );
        })}
      </div>

      <div className="cdk-sidebar-section">
        <p className="cdk-section-label">ORIGEN</p>
        {ORIGIN_DATA.map((c) => {
          const active = selectedOrigin.includes(c.name);
          return (
            <label key={c.name} className={`cdk-filter-row${active ? " is-active" : ""}`} onClick={() => toggle("origen", c.name)} style={{ cursor: "pointer" }}>
              <span className="cdk-filter-flag">{c.flag}</span>
              <span className="cdk-filter-name">{c.name}</span>
              <span className="cdk-filter-count">{c.count}</span>
            </label>
          );
        })}
        <button className="cdk-show-more">
          Ver más países
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      <button className="cdk-clear-btn" onClick={clearAll} disabled={!hasFilters}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4"/>
        </svg>
        Limpiar filtros
      </button>
    </aside>
  );
}
