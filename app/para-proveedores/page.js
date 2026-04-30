"use client";

import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";

const checkIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="9" cy="9" r="9" fill="#84cc16" fillOpacity="0.15" />
    <path d="M5 9.5l3 3 5-5.5" stroke="#84cc16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const dashIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="9" cy="9" r="9" fill="rgba(255,255,255,0.06)" />
    <path d="M6 9h6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
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

const compareRows = [
  { label: "Mostrar productos",           explorer: checkIcon,  pro: checkIcon },
  { label: "Generar leads / cotizaciones", explorer: checkIcon,  pro: checkIcon },
  { label: "Venta directa",               explorer: dashIcon,   pro: checkIcon },
  { label: "Landing page personalizada",  explorer: <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>Básica</span>, pro: starIcon },
  { label: "Gestión de pedidos",          explorer: dashIcon,   pro: checkIcon },
  { label: "Herramientas de publicidad con IA", explorer: checkIcon, pro: checkIcon },
  { label: "Escalar a nuevos mercados",   explorer: <span style={{ fontSize: "0.78rem" }}>⚡</span>, pro: rocketIcon },
];

const footerStats = [
  { icon: "👥", label: "Comunidad en crecimiento", sub: "Miles de compradores" },
  { icon: "🌎", label: "Presencia en LATAM",       sub: "Múltiples países" },
  { icon: "🔒", label: "Transacciones seguras",    sub: "Pagos protegidos" },
  { icon: "💬", label: "Soporte dedicado",         sub: "Estamos contigo" },
];

export default function ParaProveedoresPage() {
  return (
    <main style={{ background: "#050505", minHeight: "100vh", color: "#fff" }}>
      <SiteHeader />

      {/* ── HERO ────────────────────────────────────────── */}
      <section style={{ padding: "80px 0 64px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="shell" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <span style={{
              display: "inline-block", background: "rgba(132,204,22,0.15)",
              color: "#84cc16", fontSize: "0.72rem", fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase",
              padding: "4px 12px", borderRadius: 4, marginBottom: 20,
              border: "1px solid rgba(132,204,22,0.3)",
            }}>
              Para proveedores
            </span>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 20px" }}>
              Lleva tu marca<br />
              <span style={{ color: "#84cc16" }}>a nuevos mercados</span><br />
              sin fronteras
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", lineHeight: 1.7, margin: "0 0 36px", maxWidth: 440 }}>
              Drokex te ofrece dos caminos para expandir tu negocio en Latinoamérica. Tú eliges cómo empezar.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link href="/registro" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#84cc16", color: "#050505", fontWeight: 700,
                padding: "14px 28px", borderRadius: 10, fontSize: "0.95rem",
                textDecoration: "none",
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

          <div style={{
            aspectRatio: "4/3", borderRadius: 20,
            overflow: "hidden", border: "1px solid rgba(132,204,22,0.15)",
            position: "relative",
          }}>
            <img
              src="/Banner mapa casas.jpg"
              alt="Red Drokex en LATAM"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
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
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20, padding: 36,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 24 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(132,204,22,0.15)", border: "1px solid rgba(132,204,22,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, color: "#84cc16", fontSize: "1.1rem", flexShrink: 0,
                }}>1</div>
                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: "1.3rem", fontWeight: 800 }}>Proveedor Explorer</h3>
                  <p style={{ margin: 0, color: "#84cc16", fontWeight: 600, fontSize: "0.9rem" }}>Valida tu mercado</p>
                </div>
              </div>

              <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 24 }}>
                Publica tus productos y recibe <strong style={{ color: "#fff" }}>contactos y cotizaciones</strong> de compradores interesados.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                {["Publica tus productos", "Recibe contactos y cotizaciones", "Mide el interés real en otros países", "Sin necesidad de tener stock"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>
                    {checkIcon} {f}
                  </div>
                ))}
              </div>

              <Link href="/registro" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "transparent", color: "#fff", fontWeight: 600,
                padding: "12px 24px", borderRadius: 10, fontSize: "0.9rem",
                border: "1px solid rgba(255,255,255,0.22)", textDecoration: "none",
              }}>
                Probar sin riesgo <span>→</span>
              </Link>
            </div>

            {/* PRO */}
            <div style={{
              background: "rgba(132,204,22,0.06)", border: "1px solid rgba(132,204,22,0.25)",
              borderRadius: 20, padding: 36, position: "relative",
            }}>
              <div style={{
                position: "absolute", top: 20, right: 20,
                background: "#84cc16", color: "#050505",
                fontSize: "0.7rem", fontWeight: 800, padding: "3px 10px", borderRadius: 20,
                letterSpacing: "0.08em",
              }}>PRO</div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 24 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(132,204,22,0.2)", border: "1px solid rgba(132,204,22,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, color: "#84cc16", fontSize: "1.1rem", flexShrink: 0,
                }}>2</div>
                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: "1.3rem", fontWeight: 800 }}>Proveedor Pro</h3>
                  <p style={{ margin: 0, color: "#84cc16", fontWeight: 600, fontSize: "0.9rem" }}>Vende directamente</p>
                </div>
              </div>

              <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 24 }}>
                Si ya tienes stock en el país, vende directo desde Drokex con tu propia tienda y gestión completa.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                {["Stock disponible en el país", "Venta directa desde Drokex", "Landing page propia", "Pagos y pedidos gestionados", "Acceso a herramientas de marketing"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>
                    {checkIcon} {f}
                  </div>
                ))}
              </div>

              <Link href="/proveedor-pro" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#84cc16", color: "#050505", fontWeight: 700,
                padding: "12px 24px", borderRadius: 10, fontSize: "0.9rem",
                textDecoration: "none",
              }}>
                Quiero vender ya <span>→</span>
              </Link>
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
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16, overflow: "hidden",
            }}>
              {/* Header */}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 120px 120px",
                padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
              }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", fontWeight: 600 }}>Características</span>
                <span style={{ textAlign: "center", fontSize: "0.82rem", fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>① Explorer</span>
                <span style={{ textAlign: "center", fontSize: "0.82rem", fontWeight: 700, color: "#84cc16" }}>② Pro</span>
              </div>
              {compareRows.map((row, i) => (
                <div key={row.label} style={{
                  display: "grid", gridTemplateColumns: "1fr 120px 120px",
                  padding: "14px 24px",
                  borderBottom: i < compareRows.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  alignItems: "center",
                }}>
                  <span style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.75)" }}>{row.label}</span>
                  <div style={{ display: "flex", justifyContent: "center" }}>{row.explorer}</div>
                  <div style={{ display: "flex", justifyContent: "center" }}>{row.pro}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Side card */}
          <div style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16, padding: 28, maxWidth: 220, marginTop: 52,
          }}>
            <div style={{ fontSize: "2rem", marginBottom: 12 }}>🌐</div>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.92rem", lineHeight: 1.6, margin: "0 0 20px" }}>
              Empieza como Explorer y escala a Pro cuando estés listo.
            </p>
            <Link href="/registro" style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "rgba(255,255,255,0.07)", color: "#fff", fontWeight: 600,
              padding: "12px 16px", borderRadius: 10, fontSize: "0.88rem",
              border: "1px solid rgba(255,255,255,0.14)", textDecoration: "none",
            }}>
              Así de simple <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCIA ─────────────────────────────────── */}
      <section style={{ padding: "80px 0", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="shell" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, margin: "0 0 16px" }}>
              Una experiencia de <span style={{ color: "#84cc16" }}>otro nivel</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: "0 0 36px" }}>
              Drokex no es un catálogo tradicional. Es un mundo interactivo donde los compradores exploran marcas como si fuera un juego.
            </p>
            <div style={{ display: "flex", gap: 32 }}>
              {["🔍 Explorar", "🔎 Descubrir", "🔗 Conectar", "🛒 Comprar"].map(step => (
                <div key={step} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.4rem", marginBottom: 6 }}>{step.split(" ")[0]}</div>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{step.split(" ")[1]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Brand bubbles */}
          <div style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(132,204,22,0.08) 0%, transparent 70%)",
            border: "1px solid rgba(132,204,22,0.12)", borderRadius: 20,
            padding: 36, position: "relative", minHeight: 240,
          }}>
            <div style={{ fontSize: "3.5rem", textAlign: "center", marginBottom: 8 }}>🌆</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
              {[
                { flag: "🇨🇴", name: "Muebles del Sur" },
                { flag: "🇲🇽", name: "Design Future" },
                { flag: "🇨🇱", name: "Home & Deco" },
                { flag: "🇵🇪", name: "Casa Lima" },
              ].map(b => (
                <div key={b.name} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 20, padding: "6px 14px", fontSize: "0.8rem",
                }}>
                  {b.flag} {b.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DROKEX STUDIO ───────────────────────────────── */}
      <section style={{ padding: "80px 0" }}>
        <div className="shell" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          {/* Studio preview card */}
          <div style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20, padding: 28, minHeight: 240,
            display: "flex", flexDirection: "column", gap: 14,
          }}>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{
                background: "#84cc16", color: "#050505", fontWeight: 700,
                padding: "6px 16px", borderRadius: 8, fontSize: "0.82rem",
              }}>Drokex Studio</div>
            </div>
            <div style={{
              flex: 1, background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: 20,
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: "0.78rem" }}>Describe tu banner</p>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
                Banner moderno para promocionar tus productos en Latinoamérica
              </p>
              <button style={{
                background: "#84cc16", color: "#050505", fontWeight: 700,
                padding: "10px 20px", borderRadius: 8, border: "none",
                fontSize: "0.85rem", alignSelf: "flex-start", cursor: "pointer",
              }}>
                Generar con IA ✨
              </button>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, margin: "0 0 16px" }}>
              Drokex <span style={{ color: "#84cc16" }}>Studio</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: "0 0 24px" }}>
              Crea banners y publicidad profesional con inteligencia artificial en segundos.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
              {["Genera imágenes impactantes", "Personaliza tu tienda", "Atrae más compradores"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.92rem", color: "rgba(255,255,255,0.8)" }}>
                  {checkIcon} {f}
                </div>
              ))}
            </div>
            <Link href="/registro" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "transparent", color: "#84cc16", fontWeight: 600,
              padding: "12px 24px", borderRadius: 10, fontSize: "0.9rem",
              border: "1px solid rgba(132,204,22,0.4)", textDecoration: "none",
            }}>
              Probar Drokex Studio <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────── */}
      <section style={{
        background: "rgba(132,204,22,0.06)", borderTop: "1px solid rgba(132,204,22,0.2)",
        borderBottom: "1px solid rgba(132,204,22,0.2)", padding: "64px 0",
      }}>
        <div className="shell" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, margin: 0 }}>
            Empieza hoy en <span style={{ color: "#84cc16" }}>Drokex</span><br />
            <span style={{ fontSize: "0.85em", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
              y lleva tu marca a nuevos países.
            </span>
          </h2>
          <Link href="/registro" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "#84cc16", color: "#050505", fontWeight: 800,
            padding: "16px 32px", borderRadius: 12, fontSize: "1rem",
            textDecoration: "none", whiteSpace: "nowrap",
          }}>
            Crear cuenta de proveedor <span>→</span>
          </Link>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────── */}
      <div style={{
        background: "#050505", borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "28px 0",
      }}>
        <div className="shell" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {footerStats.map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: "1.6rem" }}>{s.icon}</span>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "0.88rem" }}>{s.label}</p>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.45)", fontSize: "0.78rem" }}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
