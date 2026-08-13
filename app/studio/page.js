"use client";

import { useState } from "react";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import AiImageWizard from "@/app/components/ai-image-wizard";
import PortalPixelCursor from "@/app/components/portal-pixel-cursor";
import Personaje360 from "@/app/components/personaje-360";

const hudLeft = [
  {
    num: "01",
    label: "Genera banners con IA",
    title: "Banners generados con Inteligencia Artificial",
    desc: "Describe en palabras simples lo que quieres promocionar y nuestra IA crea un banner profesional al instante. No necesitas conocimientos de diseño ni software especializado.",
    bullets: [
      "Resultados en menos de 30 segundos",
      "Estilos: profesional, elegante, alegre, natural",
      "Resolución lista para web y redes sociales",
    ],
    icon: "✦",
  },
  {
    num: "02",
    label: "Personaliza tu tienda",
    title: "Tu tienda, tu identidad de marca",
    desc: "Sube tu logo, elige tus colores y configura tu landing page de proveedor con banners generados por IA. Cada pieza refleja tu marca al 100%.",
    bullets: [
      "Colores y tipografía de tu marca",
      "Sube fotos reales de tus productos",
      "Incluye tu mascota o personaje de marca",
    ],
    icon: "◈",
  },
  {
    num: "03",
    label: "Atrae más compradores",
    title: "Más visibilidad, más ventas en LATAM",
    desc: "Los banners profesionales aumentan el CTR de tus productos y generan más confianza en compradores de toda la región. Studio está diseñado para impulsar tu conversión.",
    bullets: [
      "Mayor visibilidad en el catálogo Drokex",
      "Banners optimizados para compradores B2B",
      "Conecta con tiendas en 24+ países",
    ],
    icon: "▲",
  },
];

const steps = [
  { num: "01", title: "Describe tu banner", desc: "Escribe qué quieres promocionar en lenguaje natural." },
  { num: "02", title: "Elige tu estilo",     desc: "Colores, estilo visual y fotos de tus productos." },
  { num: "03", title: "Genera con IA",       desc: "Banner profesional listo en segundos." },
];

function InfoPopup({ item, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 900,
        background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 520,
          background: "rgba(2,8,6,0.94)",
          border: "1px solid rgba(127,224,64,0.28)",
          boxShadow: "0 0 80px rgba(127,224,64,0.1), 0 32px 64px rgba(0,0,0,0.6)",
          backdropFilter: "blur(20px)",
          padding: "40px 36px 36px",
          position: "relative",
        }}
      >
        {/* Scanlines decorativas */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.12,
          background: "repeating-linear-gradient(180deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 1px, transparent 4px, transparent 8px)",
        }} />

        {/* Kicker */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          border: "1px solid rgba(127,224,64,0.28)", padding: "4px 12px",
          fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.16em",
          textTransform: "uppercase", color: "rgba(255,255,255,0.6)",
          marginBottom: 24, background: "rgba(127,224,64,0.06)",
        }}>
          <span style={{ color: "#7FE040" }}>{item.num}</span>
          Drokex Studio
        </div>

        {/* Icono + Título */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
          <div style={{
            fontSize: "2rem", color: "#7FE040", lineHeight: 1,
            textShadow: "0 0 24px rgba(127,224,64,0.6)", flexShrink: 0,
          }}>
            {item.icon}
          </div>
          <h2 style={{
            margin: 0, fontSize: "1.4rem", fontWeight: 900, lineHeight: 1.2,
            color: "#fff",
          }}>
            {item.title}
          </h2>
        </div>

        {/* Descripción */}
        <p style={{
          margin: "0 0 24px", color: "rgba(255,255,255,0.6)",
          fontSize: "0.92rem", lineHeight: 1.7,
        }}>
          {item.desc}
        </p>

        {/* Bullets */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          {item.bullets.map((b) => (
            <div key={b} style={{
              display: "flex", alignItems: "center", gap: 10,
              fontSize: "0.85rem", color: "rgba(255,255,255,0.78)",
              borderLeft: "2px solid #7FE040", paddingLeft: 12,
            }}>
              {b}
            </div>
          ))}
        </div>

        {/* Acciones */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "12px 0", background: "#7FE040", color: "#071008",
              fontWeight: 900, fontSize: "0.8rem", letterSpacing: "0.08em",
              textTransform: "uppercase", border: "none", cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Entendido
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "12px 18px", background: "transparent", color: "rgba(255,255,255,0.5)",
              fontWeight: 700, fontSize: "0.8rem", border: "1px solid rgba(255,255,255,0.15)",
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StudioPage() {
  const [showWizard, setShowWizard] = useState(false);
  const [generatedImg, setGeneratedImg] = useState(null);
  const [activeInfo, setActiveInfo] = useState(null);

  return (
    <main className="portal-page studio-page">
      <SiteHeader />

      <section className="portal-stage" aria-label="Drokex Studio">
        <img src="/portal-gateway.gif" alt="Drokex Studio" className="portal-gif" />
        <div className="portal-vignette" />
        <div className="portal-scanlines" />
        <div className="portal-grid" />
        <PortalPixelCursor />

        <div className="portal-shell">
          <div className="portal-kicker">
            <span />
            Drokex Studio — IA Creativa
          </div>

          <div className="portal-copy">
            <p className="portal-status">Módulo activo / Banners con IA</p>
            <h1>
              Diseño profesional, <span>generado por IA.</span>
            </h1>
            <p>
              Crea banners y publicidad para tu tienda en segundos.
              Sin diseñador, sin software complejo.
            </p>
          </div>

          <div className="portal-actions">
            <Link href="/proveedor-pro" className="portal-action portal-action-primary">
              Crea tu página con Proveedor Pro
            </Link>
          </div>
        </div>

        {/* Personaje 360 centrado */}
        <div style={{
          position: "absolute",
          right: "18%",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 7,
          pointerEvents: "auto",
        }}>
          <Personaje360 size={380} />
        </div>

        {/* HUD izquierdo — clicable */}
        <aside className="portal-hud portal-hud-right" aria-label="Funciones Studio">
          {hudLeft.map((item) => (
            <button
              key={item.num}
              onClick={() => setActiveInfo(item)}
              className="portal-signal studio-signal-btn"
              style={{
                cursor: "pointer", background: "rgba(2,8,6,0.42)", fontFamily: "inherit",
                border: "1px solid rgba(127,224,64,0.22)", width: "100%", textAlign: "left",
              }}
            >
              <span>{item.num}</span>
              {item.label}
              <span style={{
                marginLeft: "auto", fontSize: "0.6rem", color: "rgba(127,224,64,0.6)",
                letterSpacing: 0,
              }}>▶</span>
            </button>
          ))}
        </aside>

        <div className="portal-bottom-bar">
          <span>DROKEX STUDIO</span>
          <span>IA GENERATIVA</span>
          <span>BANNERS 4K</span>
          <span>LATAM READY</span>
        </div>
      </section>

      {/* Popup info */}
      {activeInfo && (
        <InfoPopup item={activeInfo} onClose={() => setActiveInfo(null)} />
      )}

      {/* Wizard modal */}
      {showWizard && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.82)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
        }}>
          <AiImageWizard
            onClose={() => setShowWizard(false)}
            onGenerated={(img) => { setGeneratedImg(img); setShowWizard(false); }}
            onUploadFile={() => {}}
          />
        </div>
      )}

      {/* Resultado generado */}
      {generatedImg && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.9)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: 20, padding: 24,
        }}>
          <img
            src={generatedImg}
            alt="Banner generado"
            style={{ maxWidth: 700, maxHeight: "70vh", borderRadius: 16, objectFit: "contain" }}
          />
          <div style={{ display: "flex", gap: 12 }}>
            <a
              href={generatedImg}
              download="banner-drokex.png"
              className="portal-action portal-action-primary"
              style={{ textDecoration: "none" }}
            >
              Descargar →
            </a>
            <button
              onClick={() => setGeneratedImg(null)}
              className="portal-action"
              style={{ cursor: "pointer", fontFamily: "inherit" }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
