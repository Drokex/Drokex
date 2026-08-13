"use client";

import { useState } from "react";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";

const services = [
  { icon: "/sp-icon-productos.png",  title: "Catálogo digital",           desc: "Sube tus productos con fotos y descripción. Tu catálogo queda visible para compradores en toda LATAM." },
  { icon: "/sp-icon-analitica.png",  title: "Visibilidad en LATAM",       desc: "Tu empresa aparece ante compradores activos en múltiples países sin que tengas que hacer nada extra." },
  { icon: "/sp-icon-pagos.png",      title: "Chat directo",               desc: "Los compradores interesados te escriben directo desde tu catálogo. Tú decides con quién negociar." },
  { icon: "/sp-icon-seguridad.png",  title: "Perfil verificado",          desc: "Tu empresa aparece con un sello de verificación que genera confianza en los compradores." },
  { icon: "/sp-icon-logistica.png",  title: "Historial de contactos",     desc: "Lleva el control de todas las conversaciones, cotizaciones y seguimiento desde un solo lugar." },
  { icon: "/sp-icon-soporte.png",    title: "Soporte especializado",      desc: "Un equipo dedicado para ayudarte a optimizar tu catálogo y cerrar más negocios." },
];

const countries = [
  { flag: "🇳🇮", label: "Nicaragua",  count: "800+" },
  { flag: "🇭🇳", label: "Honduras",   count: "800+" },
  { flag: "🇬🇹", label: "Guatemala",  count: "800+" },
  { flag: "🇸🇻", label: "El Salvador", count: "800+" },
  { flag: "🇩🇴", label: "República Dominicana", count: "800+" },
  { flag: "🇨🇴", label: "Colombia",   count: "800+" },
  { flag: "🇵🇪", label: "Perú",       count: "800+" },
  { flag: "🇲🇽", label: "México",     count: "800+" },
];

const steps = [
  {
    icon: "/sp-step-1.png",
    title: "Crea tu cuenta",
    nav: "Registro",
    desc: "Regístrate como proveedor y verifica tu empresa. En minutos tu perfil está listo para recibir compradores.",
  },
  {
    icon: "/sp-step-2.png",
    title: "Sube tu catálogo",
    nav: "Catálogo",
    desc: "Carga tus productos con fotos y descripción. Sin precios si prefieres — el comprador te contacta para negociar.",
  },
  {
    icon: "/sp-step-3.png",
    title: "Te encuentran",
    nav: "Visibilidad",
    desc: "Tu catálogo queda visible ante compradores activos en toda LATAM. Ellos te buscan, tú no tienes que salir a vender.",
  },
  {
    icon: "/sp-step-4.png",
    title: "Recibes mensajes",
    nav: "Chat",
    desc: "Los compradores interesados te escriben directo desde tu catálogo. El chat queda en tu panel de Drokex.",
  },
  {
    icon: "/sp-step-5.png",
    title: "Negocias directo",
    nav: "Negociación",
    desc: "Tú y el comprador acuerdan condiciones, cantidades y entrega directamente, sin intermediarios.",
  },
  {
    icon: "/sp-step-6.png",
    title: "Cierras el negocio",
    nav: "Cierre",
    desc: "Confirmas el trato y coordinas la entrega según tus propias condiciones comerciales.",
  },
];

const benefits = [
  { icon: "/sp-ben-ventas.png",   title: "Más contactos",  desc: "Compradores activos de toda LATAM encuentran tu catálogo y te escriben directo." },
  { icon: "/sp-ben-friccion.png", title: "Sin intermediarios", desc: "Tú y el comprador negocian directo. Sin comisiones ocultas ni terceros en medio." },
  { icon: "/sp-ben-global.png",   title: "Presencia global", desc: "Tu catálogo visible en múltiples países sin ferias, viajes ni inversión extra." },
  { icon: "/sp-ben-control.png",  title: "Control total",  desc: "Tú decides precios, condiciones y con quién cerrar. Drokex solo te conecta." },
];

const partnerLogos = [
  { src: "/partner-logo-drokex-black.png", alt: "Drokex" },
  { src: "/partner-logo-drokex-green.png", alt: "Drokex" },
  { src: "/partner-logo-drokex-black.png", alt: "Drokex" },
  { src: "/partner-logo-drokex-green.png", alt: "Drokex" },
  { src: "/partner-logo-drokex-black.png", alt: "Drokex" },
  { src: "/partner-logo-drokex-green.png", alt: "Drokex" },
];

const faqs = [
  { q: "¿Cuánto cuesta publicar mi catálogo en Drokex?", a: "Publicar tu catálogo es gratis. Crea tu cuenta, sube tus productos y empieza a recibir mensajes de compradores sin ningún costo inicial." },
  { q: "¿En qué países me pueden contactar compradores?", a: "Tenemos compradores activos en Nicaragua, Honduras, Guatemala, El Salvador, República Dominicana, Colombia, Perú y México." },
  { q: "¿Cómo me contactan los compradores?",            a: "A través del chat integrado de Drokex. El comprador ve tu catálogo, te escribe directamente y tú respondes desde tu panel." },
  { q: "¿Drokex se encarga de la logística o los pagos?", a: "No. Drokex es el puente de conexión. La logística, el pago y las condiciones de entrega las acuerdas directamente con el comprador." },
  { q: "¿Necesito tener empresa para publicar?",          a: "Puedes empezar como persona natural o empresa. Nuestro equipo te guía en la verificación según tu caso." },
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

export default function ProveedorPage() {
  const [activeStep, setActiveStep] = useState(1);
  const visibleSteps = [-1, 0, 1, 2].map((offset) => {
    const index = (activeStep + offset + steps.length) % steps.length;
    return { ...steps[index], index };
  });

  const moveStep = (direction) => {
    setActiveStep((current) => (current + direction + steps.length) % steps.length);
  };

  return (
    <div className="sp-page">
      <SiteHeader />

      {/* HERO */}
      <section className="sp-hero">
        <img src="/sp-hero-bga.jpg" alt="" className="sp-hero-bg" aria-hidden="true" />
        <div className="shell">
        <div className="sp-hero-content">
          <p className="sp-hero-tag">Proveedores</p>
          <h1>
            Convierte tus productos en un negocio <span>internacional</span>
          </h1>
          <p className="sp-hero-desc">
            Sube tu catálogo, recibe mensajes de compradores reales y cierra negocios directo —
            sin intermediarios, sin logística de nuestra parte.
          </p>
          <Link href="/registro" className="sp-hero-cta">
            Empezar como proveedor
          </Link>
        </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="sp-services">
        <div className="shell">
          <p className="sp-services-tag">Servicios</p>
          <h2>Todo lo que necesitas <br />para vender sin límites</h2>
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

      {/* COBERTURA */}
      <section className="sp-coverage">
        <div className="shell sp-coverage-grid">
          <div>
            <h2>Llegamos a donde<br />están tus <span>clientes</span></h2>
            <p className="sp-coverage-desc">
              Tenemos presencia en los principales países de Latinoamérica
              para que tus productos lleguen más lejos.
            </p>
          </div>
          <div className="sp-countries-grid">
            {countries.map((c, i) => (
              <div key={i} className="sp-country-card">
                <p className="flag-label">{c.flag} {c.label}</p>
                <p className="activos">Activos</p>
                <p className="count">{c.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PASOS */}
      <section className="sp-steps">
        <div className="shell">
          <h2>Empieza a vender en <span>8 simples pasos</span></h2>
          <div className="sp-steps-showcase">
            <aside className="sp-steps-intro">
              <p>
                Creamos el puente entre tu tienda y tus clientes. Nosotros nos encargamos del
                resto.
              </p>
              <div className="sp-steps-intro-line" />
              <div className="sp-steps-note">
                <span>+</span>
                <div>
                  <strong>Fácil, rápido y sin complicaciones</strong>
                  <p>Todo lo que necesitas para vender online sin inventario.</p>
                </div>
              </div>
            </aside>

            <div className="sp-steps-carousel" aria-live="polite">
              <button
                type="button"
                className="sp-steps-arrow"
                aria-label="Paso anterior"
                onClick={() => moveStep(-1)}
              >
                &lt;
              </button>
              <div className="sp-step-cards">
                {visibleSteps.map((step) => (
                  <article
                    key={step.index}
                    className={step.index === activeStep ? "sp-step-card is-active" : "sp-step-card"}
                  >
                    <span className="sp-step-badge">{step.index + 1}</span>
                    <img src={step.icon} alt="" aria-hidden="true" />
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </article>
                ))}
              </div>
              <button
                type="button"
                className="sp-steps-arrow"
                aria-label="Paso siguiente"
                onClick={() => moveStep(1)}
              >
                &gt;
              </button>
            </div>

            <div className="sp-steps-progress" aria-label="Seleccionar paso">
              {steps.map((step, i) => (
                <button
                  key={step.nav}
                  type="button"
                  className={i === activeStep ? "is-active" : ""}
                  onClick={() => setActiveStep(i)}
                >
                  <span>{i + 1}</span>
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
              Más que una plataforma<br />
              somos tu aliado<br />
              de <span>crecimiento</span>
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

      {/* ALIADOS LOGÍSTICOS */}
      <section className="sp-partners">
        <div className="shell">
          <h2>Trabajamos con los mejores para entregar <span>siempre</span></h2>
          <div className="sp-partners-marquee" aria-label="Aliados Drokex">
            <div className="sp-partners-track">
              {[...partnerLogos, ...partnerLogos].map((logo, i) => (
                <div key={`${logo.src}-${i}`} className="sp-partner-logo">
                  <img src={logo.src} alt={logo.alt} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sp-faq">
        <div className="shell">
          <h2>Resolvemos tus <span>dudas</span> más comunes</h2>
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
          <h2>¿Listo para llevar tus productos<br /><span>al siguiente nivel?</span></h2>
          <p>Únete a cientos de proveedores que ya están vendiendo en toda Latinoamérica con Drokex.</p>
          <Link href="/registro">Empezar como proveedor</Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
