"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";

export default function DirectorioPage() {
  const [query, setQuery] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = useCallback(async (q) => {
    setLoading(true);
    const res = await fetch(`/api/directorio?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setSuppliers(data.suppliers || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchSuppliers(query), 300);
    return () => clearTimeout(timer);
  }, [query, fetchSuppliers]);

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

      <section className="directorio-results shell">
        {loading ? (
          <p className="directorio-empty">Cargando proveedores...</p>
        ) : suppliers.length === 0 ? (
          <p className="directorio-empty">No se encontraron proveedores para <strong>"{query}"</strong>.</p>
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
