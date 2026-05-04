"use client";

import { useState } from "react";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";

const checkIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="9" cy="9" r="9" fill="#84cc16" fillOpacity="0.15" />
    <path d="M5 9.5l3 3 5-5.5" stroke="#84cc16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const starIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="9" cy="9" r="9" fill="rgba(251,191,36,0.15)" />
    <path d="M9 4l1.2 3.6h3.8l-3 2.2 1.1 3.4L9 11l-3.1 2.2 1.1-3.4-3-2.2h3.8z" fill="#fbbf24" />
  </svg>
);

const rocketIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="9" cy="9" r="9" fill="rgba(132,204,22,0.15)" />
    <text x="9" y="13" textAnchor="middle" fontSize="10" fill="#84cc16">🚀</text>
  </svg>
);

const footerStats = [
  {
    label: "Comunidad en crecimiento", sub: "Miles de compradores",
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    label: "Presencia en LATAM", sub: "Múltiples países",
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
  },
  {
    label: "Transacciones seguras", sub: "Pagos protegidos",
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  },
  {
    label: "Soporte dedicado", sub: "Estamos contigo",
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 5.29 5.29l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  },
];

export default function ParaProveedoresPage() {
  const [lightMode, setLightMode] = useState(false);

  const bg    = lightMode ? "#f5f5f5" : "#050505";
  const card  = lightMode ? "#fff"    : "rgba(255,255,255,0.04)";
  const cardDark = lightMode ? "#f0f0f0" : "#131313";
  const txt   = lightMode ? "#111"    : "#fff";
  const w     = (op) => lightMode ? `rgba(0,0,0,${op})` : `rgba(255,255,255,${op})`;

  const dashIcon = (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="9" cy="9" r="9" fill={w(0.06)} />
      <path d="M6 9h6" stroke={w(0.3)} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  const compareRows = [
    { label: "Mostrar productos",           explorer: checkIcon,  pro: checkIcon },
    { label: "Generar leads / cotizaciones", explorer: checkIcon, pro: dashIcon },
    { label: "Venta directa",               explorer: dashIcon,   pro: checkIcon },
    { label: "Landing page personalizada",  explorer: <span style={{ fontSize: "0.78rem", color: w(0.5) }}>Básica</span>, pro: <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.8rem", fontWeight: 700, color: "#fbbf24" }}>★ PRO</span> },
    { label: "Gestión de pedidos",          explorer: dashIcon,   pro: checkIcon },
    { label: "Herramientas de publicidad con IA", explorer: checkIcon, pro: checkIcon },
    { label: "Escalar a nuevos mercados",   explorer: <span style={{ fontSize: "0.78rem" }}>⚡</span>, pro: rocketIcon },
  ];

  return (
    <main style={{ background: bg, minHeight: "100vh", color: txt }}>
      <SiteHeader />

      {/* Toggle button */}
      <button
        onClick={() => setLightMode((v) => !v)}
        title={lightMode ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
        style={{
          position: "fixed", top: 88, right: 20, zIndex: 999,
          display: "flex", alignItems: "center", gap: 7,
          padding: "8px 14px", borderRadius: 10,
          border: lightMode ? "1px solid rgba(0,0,0,0.12)" : "1px solid rgba(255,255,255,0.12)",
          background: lightMode ? "#ffffff" : "#1a1a1a",
          color: lightMode ? "#111" : "#fff",
          fontSize: "0.78rem", fontWeight: 800, cursor: "pointer",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)", transition: "all 0.2s",
        }}
      >
        {lightMode ? (
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

      {/* ── HERO ────────────────────────────────────────── */}
      <section style={{ position: "relative", minHeight: 480, display: "flex", alignItems: "center", borderBottom: `1px solid ${w(0.06)}`, overflow: "hidden" }}>
        <img
          src="/Banner mapa casas.jpg"
          alt="Red Drokex en LATAM"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.75) 50%, rgba(5,5,5,0.2) 100%)" }} />
        <div className="shell" style={{ position: "relative", zIndex: 1, padding: "80px 0" }}>
          <span style={{
            display: "inline-block", background: "rgba(132,204,22,0.15)",
            color: "#84cc16", fontSize: "0.72rem", fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
            padding: "4px 12px", borderRadius: 4, marginBottom: 20,
            border: "1px solid rgba(132,204,22,0.3)",
          }}>
            Para proveedores
          </span>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 20px", maxWidth: 560 }}>
            Lleva tu marca<br />
            <span style={{ color: "#84cc16" }}>a nuevos mercados</span><br />
            sin fronteras
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1rem", lineHeight: 1.7, margin: "0 0 36px", maxWidth: 440 }}>
            Drokex te ofrece dos caminos para expandir tu negocio en Latinoamérica. Tú eliges cómo empezar.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href="/registro" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#84cc16", color: "#050505", fontWeight: 700,
              padding: "14px 28px", borderRadius: 10, fontSize: "0.95rem",
              textDecoration: "none", boxShadow: "0 4px 24px rgba(132,204,22,0.4)",
            }}>
              Quiero ser proveedor <span>→</span>
            </Link>
            <Link href="/servicios/proveedor" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.07)", color: "#fff", fontWeight: 600,
              padding: "14px 28px", borderRadius: 10, fontSize: "0.95rem",
              border: "1px solid rgba(255,255,255,0.14)", textDecoration: "none",
            }}>
              Ver cómo funciona <span style={{ opacity: 0.7 }}>▷</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── DOS CAMINOS ─────────────────────────────────── */}
      <section style={{ padding: "80px 0" }}>
        <div className="shell">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, margin: "0 0 8px" }}>
              Elige el camino que mejor se adapta a{" "}
              <span style={{ color: "#84cc16" }}>tu negocio</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

            {/* EXPLORER */}
            <div style={{
              background: card, border: `1px solid ${w(0.1)}`,
              borderRadius: 20, overflow: "hidden",
              display: "grid", gridTemplateColumns: "180px 1fr",
            }}>
              <div style={{ position: "relative", background: cardDark }}>
                <img
                  src="/sillas pequeño.png"
                  alt="Panel de productos Explorer"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                />
              </div>
              <div style={{ padding: 32 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: "rgba(132,204,22,0.15)", border: "1px solid rgba(132,204,22,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, color: "#84cc16", fontSize: "1rem",
                  }}>1</div>
                  <div>
                    <h3 style={{ margin: "0 0 3px", fontSize: "1.2rem", fontWeight: 800 }}>Proveedor Explorer</h3>
                    <p style={{ margin: 0, color: "#84cc16", fontWeight: 600, fontSize: "0.85rem" }}>Valida tu mercado</p>
                  </div>
                </div>
                <p style={{ color: w(0.6), lineHeight: 1.65, marginBottom: 20, fontSize: "0.9rem" }}>
                  Publica tus productos y recibe <strong style={{ color: txt }}>contactos y cotizaciones</strong> de compradores interesados.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                  {["Publica tus productos", "Recibe contactos y cotizaciones", "Mide el interés real en otros países", "Sin necesidad de tener stock"].map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.88rem", color: w(0.8) }}>
                      {checkIcon} {f}
                    </div>
                  ))}
                </div>
                <Link href="/registro" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "transparent", color: txt, fontWeight: 600,
                  padding: "11px 22px", borderRadius: 10, fontSize: "0.88rem",
                  border: `1px solid ${w(0.22)}`, textDecoration: "none",
                }}>
                  Probar sin riesgo <span>→</span>
                </Link>
              </div>
            </div>

            {/* PRO */}
            <div style={{
              background: "rgba(132,204,22,0.06)", border: "1px solid rgba(132,204,22,0.25)",
              borderRadius: 20, overflow: "hidden", position: "relative",
              display: "grid", gridTemplateColumns: "1fr 1fr",
            }}>
              <div style={{ padding: "24px 20px 24px 24px" }}>
                <div style={{
                  position: "absolute", top: 16, right: 16,
                  background: "#84cc16", color: "#050505",
                  fontSize: "0.68rem", fontWeight: 800, padding: "3px 10px", borderRadius: 20,
                  letterSpacing: "0.08em",
                }}>PRO</div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: "rgba(132,204,22,0.2)", border: "1px solid rgba(132,204,22,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, color: "#84cc16", fontSize: "1rem",
                  }}>2</div>
                  <div>
                    <h3 style={{ margin: "0 0 3px", fontSize: "1.2rem", fontWeight: 800 }}>Proveedor Pro</h3>
                    <p style={{ margin: 0, color: "#84cc16", fontWeight: 600, fontSize: "0.85rem" }}>Vende directamente</p>
                  </div>
                </div>
                <p style={{ color: w(0.6), lineHeight: 1.65, marginBottom: 20, fontSize: "0.9rem" }}>
                  Si ya tienes stock en el país, vende directo desde Drokex con tu propia tienda y gestión completa.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                  {["Stock disponible en el país", "Venta directa desde Drokex", "Landing page propia", "Pagos y pedidos gestionados", "Acceso a herramientas de marketing"].map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.88rem", color: w(0.8) }}>
                      {checkIcon} {f}
                    </div>
                  ))}
                </div>
                <Link href="/proveedor-pro" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#84cc16", color: "#050505", fontWeight: 700,
                  padding: "11px 22px", borderRadius: 10, fontSize: "0.88rem",
                  textDecoration: "none", boxShadow: "0 4px 18px rgba(132,204,22,0.35)",
                }}>
                  Quiero vender ya <span>→</span>
                </Link>
              </div>
              <div style={{ position: "relative", background: cardDark, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <img
                  src="/landing sillas.jpeg"
                  alt="Landing page Proveedor Pro"
                  style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center" }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── TABLA COMPARATIVA ───────────────────────────── */}
      <section style={{ padding: "0 0 80px" }}>
        <div className="shell" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "start" }}>
          <div>
            <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)", fontWeight: 800, margin: "0 0 28px" }}>
              ¿Qué incluye <span style={{ color: "#84cc16" }}>cada opción</span>?
            </h2>
            <div style={{
              background: card, border: `1px solid ${w(0.08)}`,
              borderRadius: 16, overflow: "hidden",
            }}>
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 160px 160px",
                padding: "16px 24px", borderBottom: `1px solid ${w(0.08)}`,
                background: w(0.03), alignItems: "center",
              }}>
                <span style={{ color: w(0.45), fontSize: "0.82rem", fontWeight: 600 }}>Características</span>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: "#84cc16", display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, color: "#050505", fontSize: "0.85rem",
                  }}>1</div>
                  <span style={{ fontSize: "0.88rem", fontWeight: 700, color: txt }}>Proveedor Explorer</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: "#84cc16", display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, color: "#050505", fontSize: "0.85rem",
                  }}>2</div>
                  <span style={{ fontSize: "0.88rem", fontWeight: 700, color: txt }}>Proveedor Pro</span>
                </div>
              </div>
              {compareRows.map((row, i) => (
                <div key={row.label} style={{
                  display: "grid", gridTemplateColumns: "1fr 160px 160px",
                  padding: "14px 24px",
                  borderBottom: i < compareRows.length - 1 ? `1px solid ${w(0.06)}` : "none",
                  alignItems: "center",
                }}>
                  <span style={{ fontSize: "0.88rem", color: w(0.75) }}>{row.label}</span>
                  <div style={{ display: "flex", justifyContent: "center" }}>{row.explorer}</div>
                  <div style={{ display: "flex", justifyContent: "center" }}>{row.pro}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Side card */}
          <div style={{
            background: card, border: `1px solid ${w(0.1)}`,
            borderRadius: 16, padding: 28, maxWidth: 230, marginTop: 52,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, marginBottom: 16,
              background: "rgba(132,204,22,0.15)", border: "1px solid rgba(132,204,22,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <p style={{ color: w(0.85), fontSize: "1rem", lineHeight: 1.6, margin: "0 0 22px", fontWeight: 600 }}>
              Empieza como Explorer y escala a Pro cuando estés listo.
            </p>
            <Link href="/registro" style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "transparent", color: txt, fontWeight: 700,
              padding: "12px 18px", borderRadius: 10, fontSize: "0.92rem",
              border: "1px solid rgba(132,204,22,0.5)", textDecoration: "none",
            }}>
              Así de simple <span style={{ color: "#84cc16" }}>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCIA ─────────────────────────────────── */}
      <section style={{ padding: "40px 0 80px" }}>
        <div className="shell">
          <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(132,204,22,0.15)", minHeight: 320 }}>
            <img
              src="/banner tiendas drokex virtual .jpg"
              alt="Drokex mundo virtual"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.7) 40%, rgba(5,5,5,0.1) 100%)" }} />

            <div style={{ position: "relative", zIndex: 2, padding: "44px 40px", maxWidth: 420 }}>
              <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", fontWeight: 800, margin: "0 0 14px", lineHeight: 1.15 }}>
                Una experiencia de <span style={{ color: "#84cc16" }}>otro nivel</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 32px", fontSize: "0.92rem" }}>
                Drokex no es un catálogo tradicional.<br />
                <strong style={{ color: "rgba(255,255,255,0.85)" }}>Es un mundo interactivo donde los compradores exploran marcas como si fuera un juego.</strong>
              </p>
              <div style={{ display: "flex", gap: 28 }}>
                {[
                  { label: "Explorar", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
                  { label: "Descubrir", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
                  { label: "Conectar", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> },
                  { label: "Comprar", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
                ].map(step => (
                  <div key={step.label} style={{ textAlign: "center" }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 12, marginBottom: 8,
                      background: "rgba(132,204,22,0.12)", border: "1px solid rgba(132,204,22,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{step.icon}</div>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{step.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ position: "absolute", top: "14%", left: "22%", zIndex: 3, background: "rgba(10,10,10,0.82)", border: "1px solid rgba(132,204,22,0.25)", backdropFilter: "blur(8px)", borderRadius: 10, padding: "8px 14px" }}>
              <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "#fff" }}>🏠 Muebles del Sur</div>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", marginTop: 2 }}>🇨🇴 Colombia</div>
            </div>
            <div style={{ position: "absolute", top: "12%", right: "4%", zIndex: 3, background: "rgba(10,10,10,0.82)", border: "1px solid rgba(132,204,22,0.25)", backdropFilter: "blur(8px)", borderRadius: 10, padding: "8px 14px" }}>
              <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "#fff" }}>🏬 Design Future</div>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", marginTop: 2 }}>🇲🇽 México</div>
            </div>
            <div style={{ position: "absolute", bottom: "18%", right: "2%", zIndex: 3, background: "rgba(10,10,10,0.82)", border: "1px solid rgba(132,204,22,0.25)", backdropFilter: "blur(8px)", borderRadius: 10, padding: "8px 14px" }}>
              <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "#fff" }}>🏡 Home & Deco</div>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", marginTop: 2 }}>🇨🇱 Chile</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DROKEX STUDIO ───────────────────────────────── */}
      <section style={{ padding: "80px 0" }}>
        <div className="shell" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>

          <div style={{
            background: cardDark, border: `1px solid ${w(0.1)}`,
            borderRadius: 20, overflow: "hidden",
            display: "grid", gridTemplateColumns: "140px 1fr 160px",
            minHeight: 280,
          }}>
            <div style={{ borderRight: `1px solid ${w(0.07)}`, padding: "20px 0" }}>
              <p style={{ margin: "0 0 16px", padding: "0 16px", color: w(0.5), fontSize: "0.75rem", fontWeight: 700 }}>
                Drokex Studio
              </p>
              {["Crear banner", "Mis diseños", "Plantillas", "Inspiración"].map((item, i) => (
                <div key={item} style={{
                  padding: "9px 16px", fontSize: "0.82rem", cursor: "pointer",
                  background: i === 0 ? "rgba(132,204,22,0.12)" : "transparent",
                  color: i === 0 ? "#84cc16" : w(0.45),
                  fontWeight: i === 0 ? 700 : 400,
                  borderLeft: i === 0 ? "2px solid #84cc16" : "2px solid transparent",
                }}>
                  {item}
                </div>
              ))}
            </div>

            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ margin: 0, color: w(0.4), fontSize: "0.72rem", letterSpacing: "0.05em" }}>
                Describe tu banner
              </p>
              <div style={{
                flex: 1, background: w(0.04), border: `1px solid ${w(0.08)}`,
                borderRadius: 10, padding: 14,
                color: w(0.65), fontSize: "0.82rem", lineHeight: 1.6,
              }}>
                Banner moderno para promocionar sofás de lujo en Colombia
              </div>
              <button style={{
                background: "#84cc16", color: "#050505", fontWeight: 700,
                padding: "10px 18px", borderRadius: 8, border: "none",
                fontSize: "0.82rem", cursor: "pointer", textAlign: "center",
                boxShadow: "0 4px 16px rgba(132,204,22,0.35)",
              }}>
                Generar con IA
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 0, borderLeft: `1px solid ${w(0.07)}` }}>
              <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
                <img src="/sillas.jpeg" alt="Banner sofás de lujo" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 100%)", display: "flex", alignItems: "flex-end", padding: 10 }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: "0.78rem", color: "#fff", lineHeight: 1.2 }}>SOFÁS<br />DE LUJO</p>
                    <p style={{ margin: "3px 0 0", fontSize: "0.6rem", color: "rgba(255,255,255,0.55)" }}>★ DROKEX STU...</p>
                  </div>
                </div>
              </div>
              <div style={{ flex: 1, position: "relative", overflow: "hidden", borderTop: `1px solid ${w(0.07)}` }}>
                <img src="/landing sillas.jpeg" alt="Banner comodidad y estilo" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 100%)", display: "flex", alignItems: "flex-end", padding: 10 }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: "0.78rem", color: "#fff", lineHeight: 1.2 }}>COMODIDAD<br />Y ESTILO</p>
                    <p style={{ margin: "3px 0 0", fontSize: "0.6rem", color: "rgba(255,255,255,0.55)" }}>★ DROKEX STU...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, margin: "0 0 16px" }}>
              Drokex <span style={{ color: "#84cc16" }}>Studio</span>
            </h2>
            <p style={{ color: w(0.55), lineHeight: 1.7, margin: "0 0 24px", fontSize: "0.95rem" }}>
              Crea banners y publicidad profesional con inteligencia artificial en segundos.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {["Genera imágenes impactantes", "Personaliza tu tienda", "Atrae más compradores"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.92rem", color: w(0.8) }}>
                  {checkIcon} {f}
                </div>
              ))}
            </div>
            <Link href="/registro" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "#84cc16", color: "#050505", fontWeight: 700,
              padding: "13px 26px", borderRadius: 10, fontSize: "0.92rem",
              textDecoration: "none", boxShadow: "0 4px 20px rgba(132,204,22,0.35)",
            }}>
              Probar Drokex Studio <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────── */}
      <section style={{ padding: "40px 0 48px" }}>
        <div className="shell">
          <div style={{
            background: lightMode ? "#e8f5e3" : "linear-gradient(135deg, #0a1a0a 0%, #0d2010 100%)",
            border: "1px solid rgba(132,204,22,0.3)",
            borderRadius: 20, padding: "52px 56px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 24,
            boxShadow: "0 0 60px rgba(132,204,22,0.08)",
          }}>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, margin: 0, lineHeight: 1.2, color: txt }}>
              Empieza hoy en <span style={{ color: "#84cc16" }}>Drokex</span><br />
              y lleva tu marca a nuevos países.
            </h2>
            <Link href="/registro" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "#84cc16", color: "#050505", fontWeight: 800,
              padding: "16px 36px", borderRadius: 12, fontSize: "1rem",
              textDecoration: "none", whiteSpace: "nowrap",
              boxShadow: "0 4px 28px rgba(132,204,22,0.4)",
            }}>
              Crear cuenta de proveedor <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────── */}
      <div style={{
        background: lightMode ? "#ebebeb" : "#050505",
        borderBottom: `1px solid ${w(0.06)}`,
        padding: "28px 0",
      }}>
        <div className="shell" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {footerStats.map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: "rgba(132,204,22,0.1)", border: "1px solid rgba(132,204,22,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{s.icon}</div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "0.88rem" }}>{s.label}</p>
                <p style={{ margin: 0, color: w(0.45), fontSize: "0.78rem" }}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
