"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const SLIDES = [
  { type: "drokex" },
  { type: "image", src: "/banner-kliniu-productos.png", alt: "Kliniu - Increíbles productos para tu día a día" },
  { type: "image", src: "/banner-kliniu-mascotas.png", alt: "Kliniu - Productos para mascotas felices" },
  { type: "image", src: "/banner-mecanix.png", alt: "Mecanix - Repuestos de calidad" },
];

const INTERVAL = 5000;

export default function CatalogHeroCarousel() {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const handleDotClick = (i) => {
    setActive(i);
    startTimer();
  };

  return (
    <div className="cdk-carousel">
      <div className="cdk-carousel-track">
        {SLIDES.map((slide, i) =>
          slide.type === "drokex" ? (
            <div key={i} className={`cdk-carousel-slide${i === active ? " is-active" : ""}`}>
              <div className="cdk-hero">
                <div className="cdk-hero-content">
                  <p className="cdk-hero-eyebrow">DROKEX GLOBAL SOURCING</p>
                  <h2 className="cdk-hero-title">
                    Lleva tu portafolio al siguiente nivel con oferta internacional lista para <span>escalar.</span>
                  </h2>
                  <Link href="/registro" className="cdk-hero-cta">
                    Explorar ofertas
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </Link>
                  <div className="cdk-hero-trust">
                    <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>Proveedores verificados</span>
                    <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Negociación segura</span>
                    <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>Envíos internacionales</span>
                  </div>
                </div>
                <img src="/banner productor.jpg" alt="Drokex marketplace" className="cdk-hero-bg" style={{ objectFit: "cover", objectPosition: "center" }} />
              </div>
            </div>
          ) : (
            <div key={i} className={`cdk-carousel-slide${i === active ? " is-active" : ""}`}>
              <img src={slide.src} alt={slide.alt} className="cdk-carousel-banner-img" />
            </div>
          )
        )}
      </div>

      <button className="cdk-carousel-arrow cdk-carousel-arrow--prev" onClick={() => { setActive((active - 1 + SLIDES.length) % SLIDES.length); startTimer(); }} aria-label="Anterior">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button className="cdk-carousel-arrow cdk-carousel-arrow--next" onClick={() => { setActive((active + 1) % SLIDES.length); startTimer(); }} aria-label="Siguiente">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>

      <div className="cdk-carousel-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`cdk-carousel-dot${i === active ? " is-active" : ""}`}
            onClick={() => handleDotClick(i)}
            aria-label={`Banner ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
