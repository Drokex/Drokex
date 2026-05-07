"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import HeroDistortion from "@/app/components/hero-distortion";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
});

const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
});

const fadeRight = (delay = 0) => ({
  initial: { opacity: 0, x: 40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
});

const benefits = [
  "Origen colombiano",
  "Expansion LATAM",
  "Red de aliados",
  "Logistica eficiente",
];

const tabs = [
  {
    id: "dropshippers",
    label: "Dropshippers",
    image: "/plataforma-dropshippers.png",
    alt: "Vista plataforma para dropshippers",
    title: "Visualiza productos y proveedores con mas claridad para vender mejor.",
    description:
      "Una experiencia pensada para quienes necesitan detectar oportunidades, comparar oferta y validar origen sin perder tiempo entre canales dispersos.",
  },
  {
    id: "marcas",
    label: "Cliente",
    image: "/plataforma-marcas.png",
    alt: "Vista plataforma para marcas",
    title: "Escala tu catalogo con una plataforma preparada para crecer entre mercados.",
    description:
      "Drokex ayuda a organizar busqueda, seleccion y relacion comercial para marcas que quieren expandirse con estructura y velocidad.",
  },
  {
    id: "proveedores",
    label: "Proveedor",
    image: "/plataforma-proveedores.png",
    alt: "Infografia para proveedores Drokex",
    title: "Presenta tu oferta internacional de una forma mas directa y mas comercial.",
    description:
      "Fabricantes y distribuidores pueden mostrar capacidad, alcance y propuesta de valor en una vitrina pensada para negocios reales.",
  },
];

const platformHighlights = {
  marcas: [
    "Explora catalogos listos para vender en nuevos mercados.",
    "Conecta con proveedores verificados y gestiona oportunidades desde un solo lugar.",
    "Acelera compras, cotizaciones y rutas sin depender de mensajes dispersos.",
  ],
  proveedores: [
    "Convierte tu inventario en una vitrina comercial para compradores de Latinoamérica.",
    "Muestra productos, capacidad y condiciones con una experiencia más clara.",
    "Recibe contactos, cotizaciones y pedidos con trazabilidad dentro de Drokex.",
  ],
};

const videos = [
  {
    src: "/mauren-blandon.jpeg",
    name: "Mauren Blandon",
    role: "Empresaria",
    embedUrl: "https://drive.google.com/file/d/1Piu2tC1qIiWiUtDpOwJ2Y9p5TzLZM7xK/preview",
  },
  {
    src: "/market-person-2.jpg",
    name: "Carlos Rojas",
    role: "Dropshipper",
    embedUrl: "https://drive.google.com/file/d/1j24Dzx4kzy9itXC7CvLNOcr83Be-JT3E/preview",
  },
  {
    src: "/andres-carrillo.jpeg",
    name: "Andres",
    role: "Marca",
    embedUrl: "https://drive.google.com/file/d/1teHl1mOAA7BXlawO8rZWOC8gaq1KEli3/preview",
  },
  {
    src: "/javier-hurtado.jpeg",
    name: "Andres Perez",
    role: "Proveedor",
    embedUrl: "https://drive.google.com/file/d/11kT2qn8KyjXVOuEEIxa8vNML0_eD5iql/preview",
  },
  {
    src: "/market-person-1.jpg",
    name: "Sofia Torres",
    role: "E-commerce",
    embedUrl: "https://drive.google.com/file/d/12QheSMJssohHWDCq-VkW0HGMAA1Lhr3a/preview",
  },
];

const heroThemes = [
  { id: "dark", image: "/hero-banner-dark.gif" },
  { id: "green", image: "/hero-banner-green.jpg" },
  { id: "orange", image: "/hero-banner-orange.jpg" },
];

const globalMarkets = [
  {
    id: "ni",
    label: "Nicaragua",
    flag: "🇳🇮",
    seller: "Camila Rivas",
    role: "Aliada comercial",
    badge: "CR",
    portrait: "/market-person-3.jpg",
    accent: "#7FE040",
    accentSoft: "rgba(127, 224, 64, 0.22)",
    orderLabel: "Pedido para NI",
    orderAmount: "US$ 125,00",
    headline: "Activa oportunidades comerciales para Nicaragua con una vitrina más clara.",
    description:
      "Adapta tu vitrina a mercados clave y muestra una propuesta mas confiable para compradores que necesitan velocidad, contexto y seguimiento.",
  },
  {
    id: "hn",
    label: "Honduras",
    flag: "🇭🇳",
    seller: "Sofia Ramirez",
    role: "Aliada comercial",
    badge: "SR",
    portrait: "/market-person-2.jpg",
    accent: "#6e87ff",
    accentSoft: "rgba(110, 135, 255, 0.2)",
    orderLabel: "Pedido para HN",
    orderAmount: "US$ 110,00",
    headline: "Convierte expansión regional en una experiencia más visual y más ágil.",
    description:
      "Desde el interes inicial hasta el pedido, Drokex puede mostrar una narrativa comercial distinta para cada pais objetivo.",
  },
  {
    id: "gt",
    label: "Guatemala",
    flag: "🇬🇹",
    seller: "Andrea Solis",
    role: "Proveedor exportador",
    badge: "AS",
    portrait: "/market-person-1.jpg",
    accent: "#7FE040",
    accentSoft: "rgba(127, 224, 64, 0.2)",
    orderLabel: "Pedido para GT",
    orderAmount: "US$ 94,00",
    headline: "Haz que tu oferta se sienta lista para crecer en Centroamerica.",
    description:
      "Con vistas comerciales mas ordenadas y mensajes mas claros, tus productos pueden generar confianza desde el primer contacto.",
  },
  {
    id: "sv",
    label: "El Salvador",
    flag: "🇸🇻",
    seller: "Mariana Perez",
    role: "Compradora mayorista",
    badge: "MP",
    portrait: "/market-person-3.jpg",
    accent: "#ff7a66",
    accentSoft: "rgba(255, 122, 102, 0.2)",
    orderLabel: "Pedido para SV",
    orderAmount: "US$ 138,00",
    headline: "Presenta una experiencia comercial pensada para El Salvador.",
    description:
      "Cada bandera puede activar otra vitrina, otra historia y otro ritmo de conversión para una expansión más inteligente.",
  },
  {
    id: "do",
    label: "República Dominicana",
    flag: "🇩🇴",
    seller: "Daniela Cruz",
    role: "Compradora mayorista",
    badge: "DC",
    portrait: "/market-person-1.jpg",
    accent: "#f97316",
    accentSoft: "rgba(249, 115, 22, 0.2)",
    orderLabel: "Pedido para DO",
    orderAmount: "US$ 142,00",
    headline: "Abre una entrada comercial mas directa para República Dominicana.",
    description:
      "La experiencia adapta mensajes, precios y contexto para que cada oportunidad internacional se sienta mas cercana.",
  },
  {
    id: "co",
    label: "Colombia",
    flag: "🇨🇴",
    seller: "Laura Torres",
    role: "Marca de consumo",
    badge: "LT",
    portrait: "/market-person-2.jpg",
    accent: "#18c4d9",
    accentSoft: "rgba(24, 196, 217, 0.2)",
    orderLabel: "Pedido para CO",
    orderAmount: "US$ 82,00",
    headline: "Activa mercados cercanos con una experiencia mas local y mas directa.",
    description:
      "Drokex ayuda a presentar catalogo, origen y oportunidad comercial con una capa visual lista para hablarle a cada mercado.",
  },
  {
    id: "pe",
    label: "Perú",
    flag: "🇵🇪",
    seller: "Renata Salas",
    role: "Distribuidora retail",
    badge: "RS",
    portrait: "/market-person-3.jpg",
    accent: "#ef4444",
    accentSoft: "rgba(239, 68, 68, 0.18)",
    orderLabel: "Pedido para PE",
    orderAmount: "US$ 118,00",
    headline: "Conecta productos y compradores en Perú con una vitrina mas confiable.",
    description:
      "Drokex ordena el contenido comercial para que el mercado vea disponibilidad, origen y propuesta con rapidez.",
  },
  {
    id: "mx",
    label: "México",
    flag: "🇲🇽",
    seller: "Valeria Mendez",
    role: "Distribuidora industrial",
    badge: "VM",
    portrait: "/market-person-3.jpg",
    accent: "#7FE040",
    accentSoft: "rgba(127, 224, 64, 0.2)",
    orderLabel: "Pedido para MX",
    orderAmount: "US$ 125,00",
    headline: "Vende y realiza envios a México con mas claridad comercial.",
    description:
      "Adapta tu vitrina a mercados clave y muestra una propuesta mas confiable para compradores que necesitan velocidad, contexto y seguimiento.",
  },
];

const COUNTRY_PREFERENCE_STORAGE_KEY = "drokex-selected-country";

const operatingSteps = [
  {
    number: "01",
    title: "Conexion activa",
    description:
      "Detectamos oportunidades de compra y venta en tiempo real para empresas que quieren moverse mejor en LATAM.",
    iconSrc: "/conexion activa.png",
  },
  {
    number: "02",
    title: "Cotizacion inteligente",
    description:
      "La plataforma conecta oferta y demanda para ayudarte a responder con mas contexto y mejor timing comercial.",
    iconSrc: "/cotizacion inteligente.png",
  },
  {
    number: "03",
    title: "Operacion segura",
    description:
      "Validamos pagos, contactos y señales de confianza para cuidar cada proceso de principio a fin.",
    iconSrc: "/operacion segura.png",
  },
  {
    number: "04",
    title: "Ruta optimizada",
    description:
      "Aterrizamos la operación con rutas logísticas y decisiones más claras según el destino y el tipo de pedido.",
    iconSrc: "/ruta optimizada.png",
  },
  {
    number: "05",
    title: "Expansión lograda",
    description:
      "Tu negocio gana alcance real: nuevos mercados, mejores conexiones y más oportunidades para crecer.",
    iconSrc: "/expansion lograda.png",
  },
];

const operatingHighlights = [
  {
    title: "Visibilidad total",
    description: "Monitorea el avance de cada operación con una lectura más clara.",
    icon: <SystemTargetIcon />,
  },
  {
    title: "Control y seguridad",
    description: "Tu decides como avanzar y Drokex ayuda a proteger el proceso.",
    icon: <SystemLockIcon />,
  },
  {
    title: "Integracion simple",
    description: "Conecta tu oferta y tus flujos sin depender de procesos dispersos.",
    icon: <SystemNodesIcon />,
  },
  {
    title: "Soporte humano",
    description: "Un equipo cercano que entiende el mercado y acompana cada paso.",
    icon: <SystemHeadsetIcon />,
  },
];

function getWrappedOffset(index, activeIndex, total) {
  const direct = index - activeIndex;
  const forward = direct > 0 ? direct - total : direct + total;
  const candidates = [direct, forward];

  return candidates.reduce((best, current) =>
    Math.abs(current) < Math.abs(best) ? current : best,
  );
}

const gifItems = [
  { src: "/home-feature-globe.mp4", label: "Expande a nuevos mercados" },
  { src: "/home-feature-delivery.mp4", label: "Activa rutas logísticas" },
  { src: "/home-feature-laptop.mp4", label: "Crea tu tienda digital" },
  { src: "/home-feature-products.mp4", label: "Gestiona tus productos" },
  { src: "/home-feature-warehouse-mobile.mp4", label: "Controla inventario" },
  { src: "/home-feature-warehouse-workflow.mp4", label: "Opera pedidos en equipo" },
];

function FeatureVideoCarousel() {
  const [active, setActive] = useState(2);
  const activeRef = useRef(2);
  const carouselRef = useRef(null);
  const cooldown = useRef(false);
  const activeVideo = gifItems[active];

  const goTo = (index) => {
    const total = gifItems.length;
    const nextIndex = (index + total) % total;
    activeRef.current = nextIndex;
    setActive(nextIndex);
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    let isCentered = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isCentered = entry.intersectionRatio >= 0.72;
      },
      { threshold: [0, 0.72, 1] },
    );
    observer.observe(el);

    const onWheel = (event) => {
      if (!isCentered) return;
      if (Math.abs(event.deltaY) < 10 && Math.abs(event.deltaX) < 10) return;

      event.preventDefault();
      if (cooldown.current) return;
      cooldown.current = true;
      setTimeout(() => {
        cooldown.current = false;
      }, 560);

      const goingNext = event.deltaY > 0 || event.deltaX > 0;
      goTo(activeRef.current + (goingNext ? 1 : -1));
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      observer.disconnect();
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <div className="feature-video-carousel" ref={carouselRef}>
      <button className="gif-scroll-arrow" onClick={() => goTo(active - 1)} aria-label="Video anterior">◀</button>
      <div className="feature-video-frame">
        <div className="gif-card gif-card-single" key={activeVideo.src}>
          <div className="gif-card-media">
            <video
              src={activeVideo.src}
              aria-label={activeVideo.label}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          </div>
          <div className="gif-card-label">
            <p>{activeVideo.label}</p>
          </div>
        </div>
      </div>

      <button className="gif-scroll-arrow" onClick={() => goTo(active + 1)} aria-label="Siguiente video">▶</button>

      <div className="gif-scroll-dots">
        {gifItems.map((_, i) => (
          <button key={i} className={i === active ? "gif-dot is-active" : "gif-dot"} onClick={() => goTo(i)} aria-label={`Ir al video ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState(2);
  const [currentVideo, setCurrentVideo] = useState(2);
  const [openVideo, setOpenVideo] = useState(null);
  const [heroTheme, setHeroTheme] = useState("dark");
  const [activeMarket, setActiveMarket] = useState(0);

  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactStatus, setContactStatus] = useState(null); // null | "sending" | "sent" | "error"

  const activeAudience = useMemo(() => tabs[activeTab], [activeTab]);
  const activePlatformHighlights = platformHighlights[activeAudience.id] || platformHighlights.marcas;

  async function handleContactSubmit(e) {
    e.preventDefault();
    setContactStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      if (res.ok) {
        setContactStatus("sent");
        setContactForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setContactStatus("error");
      }
    } catch {
      setContactStatus("error");
    }
  }

  const activeHeroTheme = useMemo(
    () => heroThemes.find((theme) => theme.id === heroTheme) || heroThemes[0],
    [heroTheme],
  );
  const currentMarket = useMemo(() => globalMarkets[activeMarket], [activeMarket]);

  useEffect(() => {
    const savedCountry = window.localStorage.getItem(COUNTRY_PREFERENCE_STORAGE_KEY) || "";

    if (!savedCountry) return;

    const savedIndex = globalMarkets.findIndex((market) => market.id === savedCountry);

    if (savedIndex < 0) return;

    setActiveMarket(savedIndex);
  }, []);

  useEffect(() => {
    if (!openVideo) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpenVideo(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openVideo]);

  const previousVideo = () => {
    setCurrentVideo((value) => (value === 0 ? videos.length - 1 : value - 1));
  };

  const nextVideo = () => {
    setCurrentVideo((value) => (value === videos.length - 1 ? 0 : value + 1));
  };

  return (
    <main className="drokex-home">
      <SiteHeader />

      <section className="hero-section" id="inicio" onMouseLeave={() => setHeroTheme("dark")}>
        <div className="hero-backgrounds" aria-hidden="true">
          {heroThemes.map((theme) => (
            <img
              key={theme.id}
              className={heroTheme === theme.id ? "hero-background is-active" : "hero-background"}
              src={theme.image}
              alt=""
              draggable="false"
            />
          ))}
        </div>
        <div className="hero-overlay" />
        <div className="hero-grid-overlay" aria-hidden="true" />
        <HeroDistortion image={activeHeroTheme.image} />

        <div className="shell hero-shell">
          <div className="hero-copy hero-copy-compact">
            <motion.p className="section-tag" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              Marketplace internacional
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}>
              Tecnologia que conecta empresas con oportunidades globales.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.55 }}>
              Drokex conecta proveedores latinoamericanos con compradores
              internacionales de forma agil, visual y con una experiencia pensada
              para crecer.
            </motion.p>
          </div>

          <motion.div className="hero-actions hero-actions-split" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/para-proveedores"
                className="hero-option-button hero-option-button-green"
                onMouseEnter={() => setHeroTheme("green")}
                onFocus={() => setHeroTheme("green")}
                onPointerDown={() => setHeroTheme("green")}
              >
                <span>Quiero</span>
                <strong>vender productos</strong>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/productos"
                className="hero-option-button hero-option-button-orange"
                onMouseEnter={() => setHeroTheme("orange")}
                onFocus={() => setHeroTheme("orange")}
                onPointerDown={() => setHeroTheme("orange")}
              >
                <span>Quiero</span>
                <strong>buscar proveedor</strong>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="system-section">
        <BackgroundMap side="left" />
        <BackgroundMap side="right" />

        <div className="shell">
          <motion.div className="system-header" {...fadeUp(0)}>
            <p className="section-tag section-tag-green">Sistema operativo Drokex</p>
            <h2>
              <span>Un sistema diseñado para</span>
              <span>mover tu negocio sin límites</span>
            </h2>
            <div className="system-header-line" aria-hidden="true" />
            <p>
              Conectamos descubrimiento, cotización, confianza y operación para
              que vender y expandirse en LATAM se sienta más simple.
            </p>
          </motion.div>

          <div className="system-timeline">
            <div className="system-timeline-line" aria-hidden="true" />
            <div className="system-steps">
              {operatingSteps.map((step, i) => (
                <motion.article
                  key={step.number}
                  className="system-step"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="system-step-number">{step.number}</div>
                  <div className="system-step-orb">
                    <div className="system-step-orb-glow" aria-hidden="true" />
                    <motion.div
                      className="system-step-icon"
                      whileHover={{ scale: 1.08 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    >
                      <img src={step.iconSrc} alt={step.title} className="system-step-hologram" />
                    </motion.div>
                  </div>
                  <div className="system-step-marker" aria-hidden="true"><span /></div>
                  <h3>{step.title}</h3>
                  <div className="system-step-accent" aria-hidden="true" />
                  <p>{step.description}</p>
                </motion.article>
              ))}
            </div>
          </div>

          <div className="system-highlights">
            {operatingHighlights.map((item, index) => (
              <motion.article
                key={item.title}
                className={index < operatingHighlights.length - 1 ? "system-highlight has-divider" : "system-highlight"}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: index * 0.1 }}
                whileHover={{ x: 6, transition: { duration: 0.2 } }}
              >
                <motion.div className="system-highlight-icon" whileHover={{ scale: 1.2, rotate: 10 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                  {item.icon}
                </motion.div>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="benefits-strip">
        <div className="shell benefits-grid">
          {benefits.map((item, i) => (
            <motion.article
              key={item}
              className="benefit-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <p>{item}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="markets-section">
        <div className="shell">
          <div className="markets-stage">
            <div className="markets-robot-accent" aria-hidden="true">
              <Image
                src="/markets-robot-right.png"
                alt=""
                width={538}
                height={744}
                sizes="(max-width: 960px) 0px, 280px"
                className="markets-robot-image"
              />
            </div>

            <div className="markets-grid">
              <div className="markets-content">
                <div className="markets-brand">
                  <Image
                    src="/logo.png"
                    alt="Drokex"
                    width={550}
                    height={144}
                    sizes="(max-width: 720px) 220px, 320px"
                    className="markets-brand-logo"
                  />
                  <p>Crece en todo el mundo</p>
                </div>

                <div className="markets-interactive">
                  <div className="markets-rail" role="tablist" aria-label="Mercados">
                    {globalMarkets.map((market, index) => (
                      <button
                        key={market.id}
                        type="button"
                        className={activeMarket === index ? "market-flag is-active" : "market-flag"}
                        onClick={() => setActiveMarket(index)}
                        aria-selected={activeMarket === index}
                        role="tab"
                      >
                        <span aria-hidden="true">{market.flag}</span>
                        <span className="sr-only">{market.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="markets-scene">
                    <div className="markets-glow" aria-hidden="true" />
                    <div className="markets-pattern" aria-hidden="true" />

                    <div className="markets-cards" aria-hidden="true">
                      {globalMarkets.map((market, index) => {
                        const offset = getWrappedOffset(index, activeMarket, globalMarkets.length);
                        const hidden = Math.abs(offset) > 1;

                        return (
                          <article
                            key={market.id}
                            className={offset === 0 ? "market-card is-active" : "market-card"}
                            style={{
                              "--market-accent": market.accent,
                              "--market-accent-soft": market.accentSoft,
                              "--market-offset": offset,
                              "--market-shift-y": `${Math.abs(offset) * 12}px`,
                              "--market-opacity": hidden ? 0 : offset === 0 ? 1 : 0.24,
                              "--market-scale": offset === 0 ? 1 : 0.84,
                              "--market-rotate": `${offset * 4}deg`,
                              zIndex: offset === 0 ? 3 : offset < 0 ? 2 : 1,
                            }}
                          >
                            <div className="market-card-frame">
                              <div className="market-card-photo">
                                <Image
                                  src={market.portrait}
                                  alt={market.seller}
                                  width={736}
                                  height={1103}
                                  sizes="240px"
                                  className="market-card-portrait"
                                />
                                <div className="market-avatar-ring">
                                  <span>{market.badge}</span>
                                </div>
                                <div className="market-card-copy">
                                  <strong>{market.seller}</strong>
                                  <span>{market.role}</span>
                                </div>
                              </div>
                              <div className="market-card-action">Compra ahora</div>
                            </div>
                          </article>
                        );
                      })}
                    </div>

                    <div
                      key={`${currentMarket.id}-pill`}
                      className="market-order-pill"
                      style={{ "--market-pill-accent": currentMarket.accent }}
                    >
                      <span className="market-order-flag" aria-hidden="true">
                        {currentMarket.flag}
                      </span>
                      <span className="market-order-copy">
                        <strong>{currentMarket.orderLabel}</strong>
                        <span>{currentMarket.orderAmount}</span>
                      </span>
                    </div>

                  </div>
                </div>

                <div key={`${currentMarket.id}-copy`} className="markets-copy">
                  <h3>{currentMarket.headline}</h3>
                  <p>{currentMarket.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="platform-section" id="plataforma">
        <div className="shell">
          <div className="platform-layout">
            <motion.div className="platform-copy" {...fadeLeft(0)}>
              <div className="platform-header">
                <p className="section-tag section-tag-dark">Plataforma</p>
                <h2>Conoce a Drokex</h2>
              </div>

              <div className="platform-tabs" role="tablist" aria-label="Audiencias">
                <button
                  type="button"
                  className={activeTab === 2 ? "platform-tab is-active" : "platform-tab"}
                  onClick={() => setActiveTab(2)}
                  aria-selected={activeTab === 2}
                  role="tab"
                >
                  Proveedor
                </button>
                <button
                  type="button"
                  className={activeTab === 1 ? "platform-tab is-active" : "platform-tab"}
                  onClick={() => setActiveTab(1)}
                  aria-selected={activeTab === 1}
                  role="tab"
                >
                  Cliente
                </button>
              </div>

              <div className="platform-copy-body">
                <h3>{activeAudience.title}</h3>
                <p>{activeAudience.description}</p>
                <ul>
                  {activePlatformHighlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div className="platform-panel" {...fadeRight(0.08)}>
              <FeatureVideoCarousel />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="shell">
          <motion.div className="testimonials-header" {...fadeUp(0)}>
            <p className="section-tag">Casos de exito</p>
            <h2>
              Asi crecen con <span>Drokex</span>
            </h2>
            <p>
              Historias de empresarios, marcas y operadores que usan Drokex
              para abrir nuevas oportunidades comerciales.
            </p>
          </motion.div>

          <div className="testimonials-carousel">
            <button type="button" className="carousel-button" onClick={previousVideo} aria-label="Video anterior">
              ◀
            </button>

            <div className="video-rail">
              {videos.map((video, index) => {
                const isActive = index === currentVideo;

                return (
                  <article key={video.src} className={isActive ? "video-card is-active" : "video-card"}>
                    <button
                      type="button"
                      onClick={() => setOpenVideo(video)}
                      className="video-link"
                      aria-label={`Reproducir historia de ${video.name}`}
                    >
                    <img
                      src={video.src}
                      alt={`${video.name}, ${video.role}`}
                      className="video-frame"
                    />
                      <span className="video-play-indicator" aria-hidden="true">▶</span>
                    </button>

                    {isActive ? (
                      <div className="video-meta">
                        <p>{video.name}</p>
                        <span>{video.role}</span>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>

            <button type="button" className="carousel-button" onClick={nextVideo} aria-label="Siguiente video">
              ▶
            </button>
          </div>
        </div>
      </section>

      {openVideo ? (
        <div className="video-modal" role="dialog" aria-modal="true" aria-label={`Historia de ${openVideo.name}`}>
          <button type="button" className="video-modal-backdrop" onClick={() => setOpenVideo(null)} aria-label="Cerrar video" />
          <div className="video-modal-panel">
            <div className="video-modal-header">
              <div>
                <p>{openVideo.name}</p>
                <span>{openVideo.role}</span>
              </div>
              <button type="button" className="video-modal-close" onClick={() => setOpenVideo(null)} aria-label="Cerrar video">
                X
              </button>
            </div>
            <iframe
              className="video-modal-player"
              src={openVideo.embedUrl}
              title={`Video de ${openVideo.name}`}
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      ) : null}

      <section className="contact-section" id="contacto">
        <div className="shell contact-grid">
          <motion.div className="contact-card" {...fadeLeft(0)}>
            <h3>Envianos un mensaje</h3>

            <form className="contact-form" onSubmit={handleContactSubmit}>
              <input
                type="text"
                placeholder="Nombre"
                value={contactForm.name}
                onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
              <input
                type="email"
                placeholder="Correo electronico"
                value={contactForm.email}
                onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
              <div className="contact-select-wrap">
                <select
                  value={contactForm.subject}
                  onChange={(e) => setContactForm((f) => ({ ...f, subject: e.target.value }))}
                >
                  <option value="" disabled>
                    Selecciona un motivo
                  </option>
                  <option value="Ventas">Ventas</option>
                  <option value="Soporte">Soporte</option>
                  <option value="Alianzas">Alianzas</option>
                </select>
              </div>
              <textarea
                rows={4}
                placeholder="Escribe tu mensaje aqui..."
                value={contactForm.message}
                onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                required
              />
              {contactStatus === "sent" && (
                <p style={{ color: "#7FE040", fontSize: "0.9rem" }}>Mensaje enviado correctamente.</p>
              )}
              {contactStatus === "error" && (
                <p style={{ color: "#ef4444", fontSize: "0.9rem" }}>No fue posible enviar. Intenta de nuevo.</p>
              )}
              <button type="submit" className="submit-button" disabled={contactStatus === "sending"}>
                {contactStatus === "sending" ? "Enviando..." : "Enviar mensaje"}
              </button>
            </form>
          </motion.div>

          <motion.div className="contact-copy" {...fadeRight(0.15)}>
            <p className="section-tag section-tag-green">Contacto</p>
            <h2>
              <span>Hablemos de</span>
              <span>crecimiento</span>
              <span>internacional.</span>
            </h2>
            <div className="contact-list">
              <p>contacto@drokex.com</p>
              <p>+57 311 531 2623</p>
              <p>Bogota, Colombia</p>
            </div>
            <a href="#" className="whatsapp-link">
              Escribenos por WhatsApp
            </a>
          </motion.div>

          <div className="contact-robot" aria-hidden="true">
            <Image
              src="/robot-contact.png"
              alt=""
              width={1344}
              height={1771}
              sizes="(max-width: 1180px) 0px, 22vw"
              className="contact-robot-image"
            />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function BackgroundMap({ side }) {
  return (
    <div
      className={side === "left" ? "system-map system-map-left" : "system-map system-map-right"}
      aria-hidden="true"
    >
      <svg
        width="340"
        height="340"
        viewBox="0 0 340 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 44C61 95 72 133 87 168C96 189 111 207 137 225C167 246 191 273 208 307"
          stroke="#f07a1e"
          strokeOpacity="0.28"
          strokeWidth="1.5"
        />
        <circle cx="18" cy="44" r="4" fill="#f07a1e" fillOpacity="0.92" />
        <circle cx="87" cy="168" r="4" fill="#f07a1e" fillOpacity="0.92" />
        <circle cx="208" cy="307" r="4" fill="#f07a1e" fillOpacity="0.92" />
        <path
          d="M38 30C80 12 123 12 152 22C192 36 231 72 252 104C277 142 286 193 277 230C268 267 248 300 213 327"
          stroke="#d7ddd7"
          strokeWidth="1"
          strokeDasharray="2 5"
          strokeOpacity="0.9"
        />
      </svg>
    </div>
  );
}

function SystemTargetIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3" /><path d="M12 19v3" /><path d="M2 12h3" /><path d="M19 12h3" />
    </svg>
  );
}
function SystemLockIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </svg>
  );
}
function SystemNodesIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="12" r="2" /><circle cx="19" cy="5" r="2" /><circle cx="19" cy="19" r="2" />
      <path d="M7 12h4l4-5" /><path d="M11 12h4l2 5" />
    </svg>
  );
}
function SystemHeadsetIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 13a8 8 0 0 1 16 0" />
      <rect x="3" y="12" width="4" height="7" rx="2" />
      <rect x="17" y="12" width="4" height="7" rx="2" />
      <path d="M12 20h2a2 2 0 0 0 2-2" />
    </svg>
  );
}
