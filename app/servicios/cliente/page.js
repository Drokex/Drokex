"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";
import { useAccountCta } from "@/app/components/use-account-cta";
import { useHeroEntrance } from "@/app/components/use-hero-entrance";
import ScrollReveal from "@/app/components/scroll-reveal";
import styles from "../servicios-proveedor.module.css";

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
    <div className={styles.spFaqList}>
      {faqs.map((item, i) => (
        <div key={i} className={open === i ? `${styles.spFaqItem} ${styles.isOpen}` : styles.spFaqItem}>
          <button className={styles.spFaqQuestion} onClick={() => setOpen(open === i ? null : i)}>
            {item.q}
          </button>
          <div className={styles.spFaqAnswer}>{item.a}</div>
        </div>
      ))}
    </div>
  );
}

export default function ClientePage() {
  const accountCta = useAccountCta("/registro?role=cliente");
  const heroRef = useRef(null);
  useHeroEntrance(heroRef);
  const [activeStep, setActiveStep] = useState(0);

  // mismo patrón que /servicios/proveedor: 4 tarjetas en orden, para que
  // coincida con el grid de 4 columnas (el filtro anterior a veces devolvía
  // solo 3, dejando el grid desalineado y el orden desordenado)
  const visibleSteps = [-1, 0, 1, 2].map((offset) => {
    const index = (activeStep + offset + steps.length) % steps.length;
    return { ...steps[index], index };
  });

  function moveStep(dir) {
    setActiveStep((s) => (s + dir + steps.length) % steps.length);
  }

  return (
    <div className={`${styles.spPage} ${styles.spPageCliente}`}>
      <SiteHeader />
      <ScrollReveal />

      {/* HERO */}
      <section className={styles.spHero}>
        <img src="/sp-hero-bga.jpg" alt="" className={styles.spHeroBg} aria-hidden="true" />
        <div className="shell">
          <div className={styles.spHeroContent} ref={heroRef}>
            <p className={styles.spHeroTag} style={{ color: ORG }} data-hero-item>Clientes</p>
            <h1 data-hero-item>
              Encuentra los proveedores que necesitas para tu <span style={{ color: ORG }}>negocio</span>
            </h1>
            <p className={styles.spHeroDesc} data-hero-item>
              Explora catálogos verificados, contacta directamente y cierra tratos sin intermediarios.
              Con Cliente Pro, mensajes ilimitados sin restricciones.
            </p>
            <Link href="/productos" className={styles.spHeroCta} style={{ background: ORG, color: "#fff" }} data-hero-item>
              Explorar catálogos
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className={styles.spServices}>
        <div className="shell">
          <p className={styles.spServicesTag} style={{ color: ORG }} data-reveal>Para clientes</p>
          <h2 data-reveal>Todo lo que necesitas para<br />encontrar tu proveedor ideal</h2>
          <div className={styles.spServicesGrid}>
            {services.map((s, i) => (
              <div key={i} className={styles.spServiceCard} data-reveal>
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
        <div className="shell" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }} data-reveal>
          <div>
            <p style={{ color: ORG, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, fontSize: "0.82rem" }}>Cliente Pro</p>
            <h2 style={{ margin: 0, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800 }}>
              Mensajes <span style={{ color: ORG }}>sin límites</span> con los proveedores que elijas
            </h2>
            <p style={{ margin: "12px 0 0", color: "rgba(255,255,255,0.6)", maxWidth: 520 }}>
              La cuenta básica incluye mensajes limitados. Con Cliente Pro desbloqueas contacto ilimitado, historial completo y acceso a proveedores exclusivos.
            </p>
          </div>
          <Link href={accountCta} style={{ flexShrink: 0, display: "inline-block", padding: "14px 32px", background: ORG, color: "#fff", fontWeight: 800, borderRadius: 12, fontSize: "0.95rem", whiteSpace: "nowrap" }}>
            Activar Cliente Pro
          </Link>
        </div>
      </section>

      {/* COBERTURA */}
      <section className={styles.spCoverage}>
        <div className={`shell ${styles.spCoverageGrid}`}>
          <div data-reveal>
            <h2>Proveedores en los<br />países donde <span style={{ color: ORG }}>operas</span></h2>
            <p className={styles.spCoverageDesc}>
              Tenemos proveedores verificados en los principales mercados de Latinoamérica
              para que encuentres exactamente lo que necesitas.
            </p>
          </div>
          <div className={styles.spCountriesGrid}>
            {countries.map((c, i) => (
              <div key={i} className={styles.spCountryCard} data-reveal>
                <p className={styles.flagLabel}>{c.flag} {c.label}</p>
                <p className={styles.activos}>Proveedores</p>
                <p className={styles.count}>{c.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PASOS */}
      <section className={styles.spSteps}>
        <div className="shell">
          <h2 data-reveal>Empieza a encontrar proveedores en <span style={{ color: ORG }}>5 pasos</span></h2>
          <div className={styles.spStepsShowcase}>
            <aside className={styles.spStepsIntro} data-reveal>
              <p>
                Busca, contacta y negocia con proveedores reales de toda LATAM — directo, sin intermediarios.
              </p>
              <div className={styles.spStepsIntroLine} />
              <div className={styles.spStepsNote}>
                <span>+</span>
                <div>
                  <strong>Rápido y sin complicaciones</strong>
                  <p>En minutos puedes estar hablando con el proveedor que necesitas.</p>
                </div>
              </div>
            </aside>

            <div className={styles.spStepsCarousel} aria-live="polite" data-reveal>
              <button type="button" className={styles.spStepsArrow} aria-label="Paso anterior" onClick={() => moveStep(-1)}>&lt;</button>
              <div className={styles.spStepCards}>
                {visibleSteps.map((step) => (
                  <article
                    key={step.index}
                    className={step.index === activeStep ? `${styles.spStepCard} ${styles.isActive}` : styles.spStepCard}
                  >
                    <span className={styles.spStepBadge} style={step.index === activeStep ? { background: ORG_BG, borderColor: ORG_BORDER, color: ORG } : {}}>{step.index + 1}</span>
                    <img src={step.icon} alt="" aria-hidden="true" />
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </article>
                ))}
              </div>
              <button type="button" className={styles.spStepsArrow} aria-label="Paso siguiente" onClick={() => moveStep(1)}>&gt;</button>
            </div>

            <div className={styles.spStepsProgress} aria-label="Seleccionar paso">
              {steps.map((step, i) => (
                <button
                  key={step.nav}
                  type="button"
                  className={i === activeStep ? styles.isActive : ""}
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
      <section className={styles.spBenefits}>
        <div className={`shell ${styles.spBenefitsGrid}`}>
          <div data-reveal>
            <h2>
              Más que un directorio,<br />
              tu puente directo<br />
              con <span style={{ color: ORG }}>proveedores reales</span>
            </h2>
          </div>
          <div className={styles.spBenefitsCards}>
            {benefits.map((b, i) => (
              <div key={i} className={styles.spBenefitCard} data-reveal>
                <img src={b.icon} alt={b.title} />
                <h4>{b.title}</h4>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.spFaq}>
        <div className="shell">
          <h2 data-reveal>Resolvemos tus <span style={{ color: ORG }}>dudas</span> más comunes</h2>
          <div className={styles.spFaqGrid}>
            <div className={styles.spFaqImage} data-reveal>
              <img src="/sp-faq-image.png" alt="Soporte Drokex" />
            </div>
            <div data-reveal>
              <Faq />
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className={styles.spCta}>
        <img src="/banner venta final.jpg" alt="" className={styles.spCtaBg} aria-hidden="true" />
        <div className={styles.spCtaContent} data-reveal>
          <h2>¿Listo para encontrar<br /><span style={{ color: ORG }}>tu proveedor ideal?</span></h2>
          <p>Explora catálogos verificados y empieza a negociar directo con proveedores reales en toda LATAM.</p>
          <Link href="/productos" style={{ background: ORG, color: "#fff" }}>Explorar catálogos</Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
