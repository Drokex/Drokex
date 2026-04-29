"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, animate } from "framer-motion";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";
import HeroDistortion from "@/app/components/hero-distortion";

const mapStats = [
  { icon: "/about-icon-providers.png", value: 1000, prefix: "+", suffix: "", label: "Proveedores activos" },
  { icon: "/about-icon-countries.png", value: 24,   prefix: "+", suffix: "", label: "Países conectados" },
  { icon: "/about-icon-orders.png",    value: 2.5,  prefix: "+", suffix: "M", label: "Órdenes procesadas" },
];

const pillars = [
  { icon: "/about-icon-purpose.png", title: "Nuestro propósito", text: "Impulsar el comercio internacional desde LATAM con tecnología accesible, conexiones reales y operaciones más simples." },
  { icon: "/about-icon-mission.png", title: "Nuestra misión",    text: "Conectar proveedores, empresas y compradores para abrir oportunidades comerciales en nuevos mercados." },
  { icon: "/about-icon-vision.png",  title: "Nuestra visión",    text: "Ser la plataforma que acelera la expansión regional de miles de negocios con confianza y trazabilidad." },
];

const team = [
  { photo: "/andres-carrillo.jpeg", popup: "/popup-andres-carrillo.png", name: "Andrés Carrillo", role: "Dirección Comercial" },
  { photo: "/javier-hurtado.jpeg",  popup: "/popup-javier-hurtado.png",  name: "Javier Hurtado",  role: "Expansión LATAM" },
  { photo: "/luis-urdaneta.jpeg",   popup: "/popup-luis-urdaneta.png",   name: "Luis Urdaneta",   role: "Alianzas Estratégicas" },
  { photo: "/mauren-blandon.jpeg",  popup: "/popup-maureen-blandon.png", name: "Mauren Blandón",  role: "Operaciones" },
];

const values = [
  { icon: "/about-icon-purpose.png",   title: "Confianza",   text: "Creamos relaciones comerciales claras y verificables." },
  { icon: "/about-icon-mission.png",   title: "Innovación",  text: "Usamos tecnología para simplificar procesos complejos." },
  { icon: "/about-icon-providers.png", title: "Conexión",    text: "Acercamos empresas, compradores y proveedores." },
  { icon: "/about-icon-vision.png",    title: "Excelencia",  text: "Cuidamos cada detalle de la experiencia comercial." },
  { icon: "/about-icon-countries.png", title: "Compromiso",  text: "Acompañamos el crecimiento regional de nuestros aliados." },
];

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

// Animated counter for stats
function AnimatedStat({ stat }) {
  const ref = useRef(null);
  const spanRef = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  useEffect(() => {
    if (!inView || !spanRef.current) return;
    const controls = animate(0, stat.value, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate(val) {
        if (!spanRef.current) return;
        const formatted = stat.value < 10
          ? val.toFixed(1)
          : Math.floor(val).toLocaleString("es-CO");
        spanRef.current.textContent = `${stat.prefix}${formatted}${stat.suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, stat]);

  return (
    <motion.article
      ref={ref}
      className="about-map-stat"
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.06, transition: { duration: 0.2 } }}
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src={stat.icon} alt="" width={72} height={72} className="about-stat-icon" />
      </motion.div>
      <strong ref={spanRef}>{stat.prefix}0{stat.suffix}</strong>
      <span>{stat.label}</span>
    </motion.article>
  );
}

export default function AboutPage() {
  const [selectedPerson, setSelectedPerson] = useState(null);

  return (
    <main className="about-page">

      {/* POPUP */}
      {selectedPerson && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedPerson(null)}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }}
          >
            <button onClick={() => setSelectedPerson(null)} style={{ position: "absolute", top: -16, right: -16, background: "#fff", border: "none", borderRadius: "50%", width: 36, height: 36, fontSize: 20, cursor: "pointer", zIndex: 1001, lineHeight: "36px", textAlign: "center" }}>×</button>
            <Image src={selectedPerson.popup} alt={selectedPerson.name} width={1200} height={900} style={{ borderRadius: 16, objectFit: "contain", maxHeight: "90vh", maxWidth: "90vw", width: "auto" }} />
          </motion.div>
        </motion.div>
      )}

      <SiteHeader />

      {/* HERO */}
      <section className="about-hero">
        <Image src="/about-map-banner.png" alt="Mapa de expansión Drokex en Latinoamérica" fill priority sizes="100vw" className="about-hero-image" />
        <div className="about-hero-shade" />
        <div className="about-hero-scanlines" />
        <div className="about-hero-grid" />
        <HeroDistortion image="/about-map-banner.png" />

        <div className="shell about-hero-content">
          <motion.p
            className="about-eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Sobre nosotros
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            Desde Colombia, conectamos con <span>Centroamérica</span>
          </motion.h1>

          <motion.p
            className="about-hero-copy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            Drokex está diseñado específicamente para empresas latinoamericanas que buscan crecer internacionalmente.
          </motion.p>

          <div className="about-map-stats">
            {mapStats.map((stat, i) => (
              <AnimatedStat key={stat.label} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="about-section about-pillars-section">
        <div className="shell">
          <motion.div className="about-section-heading" {...fadeUp(0)}>
            <h2>Impulsamos el comercio <span>sin fronteras</span></h2>
            <p>En Drokex conectamos empresas, logística y tecnología para transformar la forma en que los negocios crecen en Latinoamérica.</p>
          </motion.div>

          <div className="about-pillars">
            {pillars.map((pillar, i) => (
              <motion.article
                key={pillar.title}
                className="about-pillar-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, boxShadow: "0 24px 48px rgba(255,133,0,0.15)", transition: { duration: 0.25 } }}
              >
                <motion.div
                  animate={{ y: [0, -6, 0], rotate: [0, 2, -2, 0] }}
                  transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                >
                  <Image src={pillar.icon} alt="" width={90} height={90} />
                </motion.div>
                <div>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.text}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="about-team-section">
        <div className="shell about-team-grid">
          <motion.div className="about-team-copy" {...fadeLeft(0)}>
            <h2>Nuestro <span>Equipo</span></h2>
            <p>Un grupo de personas apasionadas por transformar el comercio entre empresas de la región.</p>
            <Link href="/registro" className="about-small-link">Conoce más sobre nosotros</Link>
          </motion.div>

          <div className="about-team-list">
            {team.map((person, i) => (
              <motion.article
                key={person.name}
                className="about-team-card"
                onClick={() => setSelectedPerson(person)}
                style={{ cursor: "pointer" }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -10, scale: 1.03, transition: { duration: 0.22 } }}
              >
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: "hidden", borderRadius: 12 }}
                >
                  <Image src={person.photo} alt={person.name} width={180} height={220} style={{ display: "block" }} />
                </motion.div>
                <h3>{person.name}</h3>
                <p>{person.role}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="about-section about-values-section">
        <div className="shell">
          <motion.div className="about-section-heading" {...fadeUp(0)}>
            <h2>Nuestros <span>valores</span></h2>
            <p>Cada acción en Drokex está diseñada para generar confianza, eficiencia y crecimiento real para nuestros usuarios.</p>
          </motion.div>

          <div className="about-values">
            {values.map((value, i) => (
              <motion.article
                key={value.title}
                className="about-value-card"
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.05, y: -6, transition: { duration: 0.2 } }}
              >
                <motion.span
                  whileHover={{ rotate: 15, scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  style={{ display: "inline-block" }}
                >
                  <Image src={value.icon} alt="" width={46} height={46} />
                </motion.span>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta-banner">
        <Image src="/about-sale-banner.jpg" alt="" fill sizes="100vw" className="about-cta-image" />
        <div className="about-cta-overlay" />
        <div className="shell about-cta-content">
          <motion.div {...fadeLeft(0.1)}>
            <p className="about-eyebrow">Únete</p>
            <h2>Estamos construyendo el futuro del comercio en <span>LATAM</span></h2>
            <p>Y tú puedes ser parte.</p>
          </motion.div>
          <motion.div className="about-cta-actions" {...fadeRight(0.25)}>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/registro" className="about-cta-primary">
                Soy proveedor
                <span>Quiero publicar productos</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/registro" className="about-cta-secondary">
                Soy cliente
                <span>Quiero comprar</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
