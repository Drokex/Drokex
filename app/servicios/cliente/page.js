"use client";

import { useState } from "react";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";

const ORG = "#FF790F";
const ORG_BG = "rgba(255,121,15,0.13)";
const ORG_BORDER = "rgba(255,121,15,0.28)";

const services = [
  { icon: "/sp-icon-productos.png",  title: "Catálogos verificados",    desc: "Accede a miles de catálogos de proveedores reales con fotos y descripciones detalladas de sus productos." },
  { icon: "/sp-icon-analitica.png",  title: "Búsqueda avanzada",        desc: "Filtra por categoría, país de origen y disponibilidad para encontrar exactamente lo que necesitas." },
  { icon: "/sp-icon-pagos.png",      title: "Chat directo",             desc: "Escríbele al proveedor directo desde su catálogo. Sin intermediarios, sin esperas innecesarias." },
  { icon: "/sp-icon-seguridad.png",  title: "Cliente Pro",              desc: "Con Cliente Pro envías mensajes sin límites y accedes a funciones avanzadas de contacto y seguimiento." },
  { icon: "/sp-icon-logistica.png",  title: "Historial de contactos",   desc: "Guarda proveedores favoritos y revisa todas tus conversaciones desde un solo lugar." },
  { icon: "/sp-icon-soporte.png",    title: "Soporte dedicado",         desc: "Nuestro equipo te ayuda a encontrar el proveedor ideal para tu negocio." },
];

const countries = [
  { flag: "🇳🇮", label: "Nicaragua",            count: "800+" },
  { flag: "🇭🇳", label: "Honduras",             count: "800+" },
  { flag: "🇬🇹", label: "Guatemala",            count: "800+" },
  { flag: "🇸🇻", label: "El Salvador",          count: "800+" },
  { flag: "🇩🇴", label: "República Dominicana", count: "800+" },
  { flag: "🇨🇴", label: "Colombia",             count: "800+" },
  { flag: "🇵🇪", label: "Perú",                 count: "800+" },
  { flag: "🇲🇽", label: "México",               count: "800+" },
];

const steps = [
  {
    icon: "/sp-step-1.png",
    title: "Crea tu cuenta",
    nav: "Registro",
    desc: "Regístrate gratis y accede al directorio completo de proveedores verificados en toda LATAM.",
  },
  {
    icon: "/sp-step-2.png",
    title: "Busca proveedores",
    nav: "Búsqueda",
    desc: "Usa el buscador para encontrar proveedores por categoría, producto, país de origen o nombre.",
  },
  {
    icon: "/sp-step-3.png",
    title: "Explora catálogos",
    nav: "Catálogos",
    desc: "Ve los productos, fotos y descripciones de cada proveedor. Compara opciones antes de contactar.",
  },
  {
    icon: "/sp-step-4.png",
    title: "Envía un mensaje",
    nav: "Contacto",
    desc: "Escríbele directo al proveedor desde su catálogo. Con cuenta básica tienes mensajes limitados; con Cliente Pro son ilimitados.",
  },
  {
    icon: "/sp-step-5.png",
    title: "Negocia y cierra",
    nav: "Cierre",
    desc: "Tú y el proveedor acuerdan condiciones, cantidades y entrega directamente. Sin intermediarios.",
  },
];

const benefits = [
  { icon: "/sp-ben-ventas.png",   title: "Proveedores reales",    desc: "Todos los proveedores están verificados. Sabes exactamente con quién estás negociando." },
  { icon: "/sp-ben-friccion.png", title: "Sin intermediarios",    desc: "Contacto directo con el proveedor. Sin comisiones ni terceros en la negociación." },
  { icon: "/sp-ben-global.png",   title: "Todo en un lugar",      desc: "Busca, compara y contacta proveedores de múltiples países desde Drokex." },
  { icon: "/sp-ben-control.png",  title: "Cliente Pro",           desc: "Desbloquea mensajes ilimitados y acceso a funciones avanzadas por un precio accesible." },
];

const faqs = [
  { q: "¿Es gratis usar Drokex como cliente?",         a: "Sí. Puedes explorar catálogos y enviar un número limitado de mensajes de forma gratuita. Con Cliente Pro tienes mensajes ilimitados y funciones avanzadas de contacto." },
  { q: "¿Cómo contacto a un proveedor?",               a: "Desde el catálogo del proveedor haz clic en 'Enviar mensaje'. El proveedor recibe tu mensaje directo en su panel y puede responderte desde allí." },
  { q: "¿Qué es Cliente Pro?",                         a: "Es el plan premium para compradores. Con Cliente Pro puedes enviar mensajes sin límites, guardar proveedores favoritos y acceder a historial completo de conversaciones." },
  { q: "¿Los proveedores están verificados?",           a: "Sí. Todos los proveedores en Drokex pasan por un proceso de verificación antes de aparecer en el directorio." },
  { q: "¿En qué países hay proveedores disponibles?",   a: "Tenemos proveedores en Nicaragua, Honduras, Guatemala, El Salvador, República Dominicana, Colombia, Perú y México." },
];

function Faq() {
  const [open, setOpen] = useState(null);
  return (
    <div className="sp-faq-list">
      {faqs.map((item, i) => (
        <div key={i} className={open === i ? "sp-faq-item is-open" : "sp-faq-item"}>
          <button className="sp-faq-question" onClick={() => setOpen(open === i ? null : i)}>
            {item.q}
          </button>
          <div className="sp-faq-answer">{item.a}</div>
        </div>
      ))}
    </div>
  );
}

export default function ClientePage() {
  const [activeStep, setActiveStep] = useState(0);

  const visibleSteps = steps.map((step, index) => ({ ...step, index })).filter((step) => {
    const total = steps.length;
    const prev = (activeStep - 1 + total) % total;
    const next = (activeStep + 1) % total;
    return [prev, activeStep, next].includes(step.index);
  });

  function moveStep(dir) {
    setActiveStep((s) => (s + dir + steps.length) % steps.length);
  }

  return (
    <div className="sp-page sp-page--cliente">
      <SiteHeader />

      {/* HERO */}
      <section className="sp-hero">
        <img src="/sp-hero-bga.jpg" alt="" className="sp-hero-bg" aria-hidden="true" />
        <div className="shell">
          <div className="sp-hero-content">
            <p className="sp-hero-tag" style={{ color: ORG }}>Clientes</p>
            <h1>
              Encuentra los proveedores que necesitas para tu <span style={{ color: ORG }}>negocio</span>
            </h1>
            <p className="sp-hero-desc">
              Explora catálogos verificados, contacta directamente y cierra tratos sin intermediarios.
              Con Cliente Pro, mensajes ilimitados sin restricciones.
            </p>
            <Link href="/productos" className="sp-hero-cta" style={{ background: ORG, color: "#fff" }}>
              Explorar catálogos
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="sp-services">
        <div className="shell">
          <p className="sp-services-tag" style={{ color: ORG }}>Para clientes</p>
          <h2>Todo lo que necesitas para<br />encontrar tu proveedor ideal</h2>
          <div className="sp-services-grid">
            {services.map((s, i) => (
              <div key={i} className="sp-service-card">
                <img src={s.icon} alt={s.title} />
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENTE PRO BANNER */}
      <section style={{ background: ORG_BG, borderTop: `1px solid ${ORG_BORDER}`, borderBottom: `1px solid ${ORG_BORDER}`, padding: "48px 0" }}>
        <div className="shell" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
          <div>
            <p style={{ color: ORG, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, fontSize: "0.82rem" }}>Cliente Pro</p>
            <h2 style={{ margin: 0, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800 }}>
              Mensajes <span style={{ color: ORG }}>sin límites</span> con los proveedores que elijas
            </h2>
            <p style={{ margin: "12px 0 0", color: "rgba(255,255,255,0.6)", maxWidth: 520 }}>
              La cuenta básica incluye mensajes limitados. Con Cliente Pro desbloqueas contacto ilimitado, historial completo y acceso a proveedores exclusivos.
            </p>
          </div>
          <Link href="/registro" style={{ flexShrink: 0, display: "inline-block", padding: "14px 32px", background: ORG, color: "#fff", fontWeight: 800, borderRadius: 12, fontSize: "0.95rem", whiteSpace: "nowrap" }}>
            Activar Cliente Pro
          </Link>
        </div>
      </section>

      {/* COBERTURA */}
      <section className="sp-coverage">
        <div className="shell sp-coverage-grid">
          <div>
            <h2>Proveedores en los<br />países donde <span style={{ color: ORG }}>operas</span></h2>
            <p className="sp-coverage-desc">
              Tenemos proveedores verificados en los principales mercados de Latinoamérica
              para que encuentres exactamente lo que necesitas.
            </p>
          </div>
          <div className="sp-countries-grid">
            {countries.map((c, i) => (
              <div key={i} className="sp-country-card">
                <p className="flag-label">{c.flag} {c.label}</p>
                <p className="activos">Proveedores</p>
                <p className="count">{c.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PASOS */}
      <section className="sp-steps">
        <div className="shell">
          <h2>Empieza a encontrar proveedores en <span style={{ color: ORG }}>5 pasos</span></h2>
          <div className="sp-steps-showcase">
            <aside className="sp-steps-intro">
              <p>
                Busca, contacta y negocia con proveedores reales de toda LATAM — directo, sin intermediarios.
              </p>
              <div className="sp-steps-intro-line" />
              <div className="sp-steps-note">
                <span>+</span>
                <div>
                  <strong>Rápido y sin complicaciones</strong>
                  <p>En minutos puedes estar hablando con el proveedor que necesitas.</p>
                </div>
              </div>
            </aside>

            <div className="sp-steps-carousel" aria-live="polite">
              <button type="button" className="sp-steps-arrow" aria-label="Paso anterior" onClick={() => moveStep(-1)}>&lt;</button>
              <div className="sp-step-cards">
                {visibleSteps.map((step) => (
                  <article
                    key={step.index}
                    className={step.index === activeStep ? "sp-step-card is-active" : "sp-step-card"}
                  >
                    <span className="sp-step-badge" style={step.index === activeStep ? { background: ORG_BG, borderColor: ORG_BORDER, color: ORG } : {}}>{step.index + 1}</span>
                    <img src={step.icon} alt="" aria-hidden="true" />
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </article>
                ))}
              </div>
              <button type="button" className="sp-steps-arrow" aria-label="Paso siguiente" onClick={() => moveStep(1)}>&gt;</button>
            </div>

            <div className="sp-steps-progress" aria-label="Seleccionar paso">
              {steps.map((step, i) => (
                <button
                  key={step.nav}
                  type="button"
                  className={i === activeStep ? "is-active" : ""}
                  style={i === activeStep ? { color: ORG } : {}}
                  onClick={() => setActiveStep(i)}
                >
                  <span style={i === activeStep ? { background: ORG_BG, borderColor: ORG_BORDER, color: ORG } : {}}>{i + 1}</span>
                  {step.nav}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="sp-benefits">
        <div className="shell sp-benefits-grid">
          <div>
            <h2>
              Más que un directorio,<br />
              tu puente directo<br />
              con <span style={{ color: ORG }}>proveedores reales</span>
            </h2>
          </div>
          <div className="sp-benefits-cards">
            {benefits.map((b, i) => (
              <div key={i} className="sp-benefit-card">
                <img src={b.icon} alt={b.title} />
                <h4>{b.title}</h4>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sp-faq">
        <div className="shell">
          <h2>Resolvemos tus <span style={{ color: ORG }}>dudas</span> más comunes</h2>
          <div className="sp-faq-grid">
            <div className="sp-faq-image">
              <img src="/sp-faq-image.png" alt="Soporte Drokex" />
            </div>
            <Faq />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="sp-cta">
        <img src="/banner venta final.jpg" alt="" className="sp-cta-bg" aria-hidden="true" />
        <div className="sp-cta-content">
          <h2>¿Listo para encontrar<br /><span style={{ color: ORG }}>tu proveedor ideal?</span></h2>
          <p>Explora catálogos verificados y empieza a negociar directo con proveedores reales en toda LATAM.</p>
          <Link href="/productos" style={{ background: ORG, color: "#fff" }}>Explorar catálogos</Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
