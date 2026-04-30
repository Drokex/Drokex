"use client";

import { useState } from "react";

function AccordionSection({ title, icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="accordion-section">
      <button className="accordion-trigger" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="accordion-trigger-left">
          <span className="accordion-icon">{icon}</span>
          <span className="accordion-title">{title}</span>
        </span>
        <svg
          className={`accordion-chevron${open ? " accordion-chevron--open" : ""}`}
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      {open && <div className="accordion-body">{children}</div>}
    </div>
  );
}

export default function ProductAccordion({ product }) {
  return (
    <div className="accordion-stack">
      <AccordionSection
        title="APLICACIÓN"
        defaultOpen={true}
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        }
      >
        <p className="accordion-text">
          {product.application || "Producto listo para operaciones internacionales y nuevas oportunidades comerciales."}
        </p>
      </AccordionSection>

      <AccordionSection
        title="COMPATIBILIDAD"
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        }
      >
        <div className="accordion-tag-list">
          {product.compatibility.map((item) => (
            <span key={item} className="accordion-tag">{item}</span>
          ))}
        </div>
      </AccordionSection>

      <AccordionSection
        title="FICHA TÉCNICA"
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="13" y2="15"/></svg>
        }
      >
        <div className="accordion-spec-grid">
          {product.technicalSpecs.map((spec) => (
            <article key={`${spec.etiqueta}-${spec.valor}`} className="accordion-spec-card">
              <span>{spec.etiqueta}</span>
              <strong>{spec.valor}</strong>
            </article>
          ))}
        </div>
      </AccordionSection>
    </div>
  );
}
