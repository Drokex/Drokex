"use client";

import { useState } from "react";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";

const services = [
  { icon: "/sp-icon-productos.png",  title: "Gestión de productos",       desc: "Administra tu catálogo, precios, inventario y deja disponibles de forma sencilla." },
  { icon: "/sp-icon-logistica.png",  title: "Logística internacional",    desc: "Nos encargamos del almacenamiento, envíos y entrega en toda Latinoamérica." },
  { icon: "/sp-icon-pagos.png",      title: "Pagos y recaudo",            desc: "Recibe tus pagos de forma segura y sin manejo local." },
  { icon: "/sp-icon-analitica.png",  title: "Analítica y reportes",       desc: "Monitorea tus ventas en tiempo real con reportes claros y métricas avanzadas." },
  { icon: "/sp-icon-seguridad.png",  title: "Cumplimiento y seguridad",   desc: "Cumplimos con estándares internacionales para proteger tu negocio." },
  { icon: "/sp-icon-soporte.png",    title: "Soporte especializado",      desc: "Un equipo dedicado para ayudarte en cada paso de tu operación." },
];

const countries = [
  { flag: "🇲🇽", label: "México",     count: "800+" },
  { flag: "🇨🇺", label: "Cuba",       count: "800+" },
  { flag: "🇬🇹", label: "Guatemala",  count: "800+" },
  { flag: "🇭🇳", label: "Honduras",   count: "800+" },
  { flag: "🇨🇴", label: "Colombia",   count: "800+" },
  { flag: "🌎",  label: "+ Más países", count: "Seguimos expandiendo nuestra cobertura" },
];

const steps = [
  {
    icon: "/sp-step-1.png",
    title: "Registro",
    nav: "Registro",
    desc: "Crea tu cuenta como proveedor y valida tu empresa para comenzar a vender en Drokex.",
  },
  {
    icon: "/sp-step-2.png",
    title: "Portafolio",
    nav: "Portafolio",
    desc: "Carga tus productos con fotos, descripciones y precios para mostrar tu oferta al mercado internacional.",
  },
  {
    icon: "/sp-step-3.png",
    title: "Exportaciones",
    nav: "Exportaciones",
    desc: "Drokex coordina documentación y requisitos para conectar tus productos con compradores.",
  },
  {
    icon: "/sp-step-4.png",
    title: "Almacenaje",
    nav: "Almacenaje",
    desc: "Integramos inventario y espacios logísticos aliados para optimizar tiempos y disponibilidad.",
  },
  {
    icon: "/sp-step-5.png",
    title: "Venta",
    nav: "Venta",
    desc: "Tus productos quedan disponibles para compradores activos en los mercados conectados.",
  },
  {
    icon: "/sp-step-6.png",
    title: "Empaque",
    nav: "Empaque",
    desc: "Preparamos cada orden con criterios comerciales, protección y presentación para la entrega.",
  },
  {
    icon: "/sp-step-7.png",
    title: "Envío",
    nav: "Envío",
    desc: "Activamos rutas y aliados para llevar tus productos al cliente final de forma confiable.",
  },
  {
    icon: "/sp-step-8.png",
    title: "Recaudo",
    nav: "Recaudo",
    desc: "Centralizamos pagos y reportes para que tengas claridad sobre ventas, cobros y crecimiento.",
  },
];

const benefits = [
  { icon: "/sp-ben-ventas.png",   title: "Más ventas",     desc: "Accede a miles de compradores en toda Latinoamérica." },
  { icon: "/sp-ben-friccion.png", title: "Sin fricción",   desc: "Nos encargamos de logística, pagos y soporte." },
  { icon: "/sp-ben-global.png",   title: "Estabilidad",    desc: "Vende en más países sin preocuparte por procesos aduanales." },
  { icon: "/sp-ben-control.png",  title: "Control Total",  desc: "Gestiona tu negocio desde un solo lugar." },
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
  { q: "¿Cuánto cuesta vender en Drokex?",              a: "Tenemos planes adaptados a cada tipo de proveedor. Puedes comenzar sin costo inicial y escalar según tu volumen de ventas." },
  { q: "¿En qué países puedo vender mis productos?",    a: "Operamos en México, Cuba, Guatemala, Honduras, Colombia y seguimos expandiendo nuestra cobertura en LATAM." },
  { q: "¿Cómo funcionan los pagos?",                    a: "Recibes tus pagos de forma segura a través de nuestra plataforma, con conversión automática y transferencias directas a tu cuenta." },
  { q: "¿Quién se encarga de la logística y entrega?",  a: "Drokex gestiona la logística con aliados como DHL, FedEx, UPS y más, para garantizar entregas confiables en cada mercado." },
  { q: "¿Necesito tener empresa para vender?",          a: "Puedes empezar como persona natural o empresa. Nuestro equipo te guía en el proceso de verificación según tu caso." },
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
            Conecta con miles de compradores en toda Latinoamérica mientras Drokex gestiona la
            operación para que tú te enfoques en crecer.
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
