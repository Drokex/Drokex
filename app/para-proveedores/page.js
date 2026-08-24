"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";
import styles from "@/app/mi-cuenta/provider-shell.module.css";
import { useGlobalTheme } from "@/app/components/global-theme";

const checkIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="9" cy="9" r="9" fill="#7FE040" fillOpacity="0.15" />
    <path d="M5 9.5l3 3 5-5.5" stroke="#7FE040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
    <circle cx="9" cy="9" r="9" fill="rgba(127, 224, 64, 0.15)" />
    <text x="9" y="13" textAnchor="middle" fontSize="10" fill="#7FE040">🚀</text>
  </svg>
);

// ── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  es: {
    // Hero section tag
    heroTag: "Para proveedores",
    // Hero headline (parts rendered separately with styled spans)
    heroLine1: "Sube tu catálogo,",
    heroLine2: "recibe compradores",
    heroLine3: "y cierra negocios",
    // Hero body
    heroBody: "Publica tu empresa y catálogo en Drokex. Los compradores te buscan, te escriben directo y negocian contigo sin intermediarios.",
    // Hero CTAs
    heroCta1: "Subir mi catálogo",
    heroCta2: "Ver cómo funciona",
    // Toggle button labels
    toggleDark: "Modo oscuro",
    toggleLight: "Modo claro",
    toggleTitleToDark: "Cambiar a modo oscuro",
    toggleTitleToLight: "Cambiar a modo claro",
    // Section: two paths
    pathsHeadline: "Así funciona en",
    pathsHighlight: "tres pasos",
    // Explorer card
    explorerTitle: "Publica tu catálogo",
    explorerSubtitle: "Gratis y en minutos",
    explorerBody: "Crea tu perfil, sube tus productos y",
    explorerBodyBold: "empieza a aparecer",
    explorerBodyEnd: "ante compradores de toda LATAM.",
    explorerClock: "Tu catálogo visible en toda la red Drokex",
    explorerFeatures: [
      "Perfil de empresa verificado",
      "Catálogo de productos con fotos y descripción",
      "Visible para compradores en múltiples países",
    ],
    explorerCta: "Publicar gratis",
    // Pro card
    proTitle: "Recibe mensajes y cierra",
    proSubtitle: "Chat directo con compradores",
    proBody: "Los compradores interesados te escriben directo desde tu catálogo. Tú respondes, negocias y cierras sin salir de Drokex.",
    proFeatures: [
      "Chat integrado con compradores reales",
      "Cotizaciones y pedidos desde la plataforma",
      "Sin intermediarios ni comisiones ocultas",
      "Historial de conversaciones y seguimiento",
      "Notificaciones en tiempo real",
    ],
    proCta: "Empezar ahora",
    // Compare table
    compareTitle: "¿Qué incluye",
    compareTitleHighlight: "tu cuenta",
    compareTitleEnd: "?",
    compareColFeatures: "Funcionalidad",
    compareRows: [
      "Perfil de empresa verificado",
      "Catálogo de productos público",
      "Chat directo con compradores",
      "Historial y seguimiento de conversaciones",
      "Notificaciones en tiempo real",
    ],
    compareBasic: "Gratis",
    // Side card
    sideCardBody: "Publica tu catálogo hoy y empieza a recibir mensajes de compradores reales.",
    sideCardCta: "Así de simple",
    // Experience section
    experienceTitle: "Tu catálogo,",
    experienceTitleHighlight: "siempre visible",
    experienceBody1: "Drokex conecta tu catálogo con compradores activos en toda LATAM.",
    experienceBody2: "Sin ferias, sin intermediarios. Ellos te buscan, tú cierras el negocio.",
    experienceSteps: ["Publicas", "Te encuentran", "Chatean", "Cierras"],
    // Studio section
    studioNav: ["Crear banner", "Mis diseños", "Plantillas", "Inspiración"],
    studioPromptLabel: "Describe tu banner",
    studioPromptPlaceholder: "Banner moderno para promocionar sofás de lujo en Colombia",
    studioGenerateBtn: "Generar con IA",
    studioImageAlt1: "Banner sofás de lujo",
    studioImageAlt2: "Banner comodidad y estilo",
    studioOverlay1Line1: "SOFÁS",
    studioOverlay1Line2: "DE LUJO",
    studioOverlay2Line1: "COMODIDAD",
    studioOverlay2Line2: "Y ESTILO",
    studioTitle: "Drokex",
    studioTitleHighlight: "Studio",
    studioBody: "Crea banners y publicidad profesional con inteligencia artificial en segundos.",
    studioFeatures: [
      "Genera imágenes impactantes",
      "Personaliza tu tienda",
      "Atrae más compradores",
    ],
    studioCta: "Probar Drokex Studio",
    studioNavLabel: "Drokex Studio",
    // Final CTA
    finalCtaTitle1: "Sube tu catálogo hoy en",
    finalCtaTitle2: "Drokex",
    finalCtaTitle3: "y empieza a recibir compradores.",
    finalCtaBtn: "Subir mi catálogo gratis",
    // Stats bar
    stats: [
      { label: "Compradores activos", sub: "Buscando proveedores ahora" },
      { label: "Presencia en LATAM", sub: "Múltiples países" },
      { label: "Chat directo", sub: "Sin intermediarios" },
      { label: "Soporte dedicado", sub: "Estamos contigo" },
    ],
    // Hero image alt
    heroImgAlt: "Red Drokex en LATAM",
    // Explorer image alt
    explorerImgAlt: "Panel de productos Explorer",
    // Pro image alt
    proImgAlt: "Landing page Proveedor Pro",
    // Experience image alt
    experienceImgAlt: "Drokex mundo virtual",
  },
  en: {
    // Hero section tag
    heroTag: "For suppliers",
    // Hero headline
    heroLine1: "Upload your catalog,",
    heroLine2: "receive buyers",
    heroLine3: "and close deals",
    // Hero body
    heroBody: "Publish your company and catalog on Drokex. Buyers find you, message you directly and negotiate without middlemen.",
    // Hero CTAs
    heroCta1: "Upload my catalog",
    heroCta2: "See how it works",
    // Toggle button labels
    toggleDark: "Dark mode",
    toggleLight: "Light mode",
    toggleTitleToDark: "Switch to dark mode",
    toggleTitleToLight: "Switch to light mode",
    // Section: two paths
    pathsHeadline: "How it works in",
    pathsHighlight: "three steps",
    // Explorer card
    explorerTitle: "Publish your catalog",
    explorerSubtitle: "Free and in minutes",
    explorerBody: "Create your profile, upload your products and",
    explorerBodyBold: "start appearing",
    explorerBodyEnd: "to buyers across LATAM.",
    explorerClock: "Your catalog visible across the Drokex network",
    explorerFeatures: [
      "Verified company profile",
      "Product catalog with photos and description",
      "Visible to buyers in multiple countries",
    ],
    explorerCta: "Publish for free",
    // Pro card
    proTitle: "Receive messages and close",
    proSubtitle: "Direct chat with buyers",
    proBody: "Interested buyers message you directly from your catalog. You respond, negotiate and close deals without leaving Drokex.",
    proFeatures: [
      "Integrated chat with real buyers",
      "Quotes and orders from the platform",
      "No middlemen or hidden fees",
      "Conversation history and follow-up",
      "Real-time notifications",
    ],
    proCta: "Get started now",
    // Compare table
    compareTitle: "What's included in",
    compareTitleHighlight: "your account",
    compareTitleEnd: "?",
    compareColFeatures: "Feature",
    compareRows: [
      "Verified company profile",
      "Public product catalog",
      "Direct chat with buyers",
      "Conversation history & follow-up",
      "Real-time notifications",
    ],
    compareBasic: "Free",
    // Side card
    sideCardBody: "Publish your catalog today and start receiving messages from real buyers.",
    sideCardCta: "That simple",
    // Experience section
    experienceTitle: "Your catalog,",
    experienceTitleHighlight: "always visible",
    experienceBody1: "Drokex connects your catalog with active buyers across LATAM.",
    experienceBody2: "No fairs, no middlemen. They find you, you close the deal.",
    experienceSteps: ["Publish", "Get found", "Chat", "Close"],
    // Studio section
    studioNav: ["Create banner", "My designs", "Templates", "Inspiration"],
    studioPromptLabel: "Describe your banner",
    studioPromptPlaceholder: "Modern banner to promote luxury sofas in Colombia",
    studioGenerateBtn: "Generate with AI",
    studioImageAlt1: "Luxury sofa banner",
    studioImageAlt2: "Comfort and style banner",
    studioOverlay1Line1: "LUXURY",
    studioOverlay1Line2: "SOFAS",
    studioOverlay2Line1: "COMFORT",
    studioOverlay2Line2: "& STYLE",
    studioTitle: "Drokex",
    studioTitleHighlight: "Studio",
    studioBody: "Create professional banners and advertising with artificial intelligence in seconds.",
    studioFeatures: [
      "Generate impactful images",
      "Customize your store",
      "Attract more buyers",
    ],
    studioCta: "Try Drokex Studio",
    studioNavLabel: "Drokex Studio",
    // Final CTA
    finalCtaTitle1: "Start today on",
    finalCtaTitle2: "Drokex",
    finalCtaTitle3: "and take your brand to new countries.",
    finalCtaBtn: "Create supplier account",
    // Stats bar
    stats: [
      { label: "Growing community", sub: "Thousands of buyers" },
      { label: "Presence in LATAM", sub: "Multiple countries" },
      { label: "Secure transactions", sub: "Protected payments" },
      { label: "Dedicated support", sub: "We're with you" },
    ],
    // Hero image alt
    heroImgAlt: "Drokex network in LATAM",
    // Explorer image alt
    explorerImgAlt: "Explorer product panel",
    // Pro image alt
    proImgAlt: "Pro Supplier landing page",
    // Experience image alt
    experienceImgAlt: "Drokex virtual world",
  },
};

const footerStatsIcons = [
  <svg key="community" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7FE040" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  <svg key="latam" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7FE040" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
  <svg key="secure" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7FE040" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  <svg key="support" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7FE040" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 5.29 5.29l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
];

export default function ParaProveedoresPage() {
  const [theme, toggleTheme] = useGlobalTheme();
  const lightMode = theme === "light";
  const [lang, setLang] = useState("es");
  const [providerLink, setProviderLink] = useState("/registro?role=proveedor");

  useEffect(() => {
    // Read initial language from localStorage
    const stored = localStorage.getItem("drokex-lang") || "es";
    setLang(stored);

    // Listen for language changes
    const handleLangChange = () => {
      const updated = localStorage.getItem("drokex-lang") || "es";
      setLang(updated);
    };
    window.addEventListener("drokex-lang-change", handleLangChange);

    // Check session for provider link
    fetch("/api/account", { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((payload) => {
        if (!payload?.user) return;
        const isProvider =
          payload.session?.audience === "proveedor" ||
          (payload.user?.role !== "ADMIN" && payload.user?.role !== "CUSTOMER");
        if (isProvider) setProviderLink("/mi-cuenta?role=proveedor");
      })
      .catch(() => {});

    return () => {
      window.removeEventListener("drokex-lang-change", handleLangChange);
    };
  }, []);

  const t = T[lang] || T["es"];

  const [hoveredCard, setHoveredCard] = useState(null);

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
    { label: t.compareRows[0], explorer: checkIcon, pro: checkIcon },
    { label: t.compareRows[1], explorer: checkIcon, pro: checkIcon },
    { label: t.compareRows[2], explorer: dashIcon,  pro: checkIcon },
    { label: t.compareRows[3], explorer: dashIcon,  pro: checkIcon },
    { label: t.compareRows[4], explorer: dashIcon,  pro: checkIcon },
  ];

  return (
    <main className={styles.providerPageAnimated} style={{ background: bg, minHeight: "100vh", color: txt }}>
      <SiteHeader />

      {/* Toggle button */}
      <button
        onClick={toggleTheme}
        title={lightMode ? t.toggleTitleToDark : t.toggleTitleToLight}
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
            {t.toggleDark}
          </>
        ) : (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            {t.toggleLight}
          </>
        )}
      </button>

      {/* ── HERO ────────────────────────────────────────── */}
      <section className={styles.providerHeroAnimated} style={{ position: "relative", minHeight: 480, display: "flex", alignItems: "center", borderBottom: `1px solid ${w(0.06)}`, overflow: "hidden" }}>
        <img
          className={styles.providerHeroBg}
          src="/Banner mapa casas.jpg"
          alt={t.heroImgAlt}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        <div style={{
          position: "absolute",
          inset: 0,
          background: lightMode
            ? "linear-gradient(90deg, rgba(5,12,8,0.78) 0%, rgba(5,12,8,0.42) 44%, rgba(5,12,8,0.04) 100%)"
            : "linear-gradient(90deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.75) 50%, rgba(5,5,5,0.2) 100%)",
        }} />
        <div className="shell provider-hero-copy" style={{ position: "relative", zIndex: 1, padding: "80px 0" }}>
          <span className={`${styles.providerReveal} ${styles.providerDelay1}`} style={{
            display: "inline-block", background: "rgba(127, 224, 64, 0.15)",
            color: "#7FE040", fontSize: "0.72rem", fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
            padding: "4px 12px", borderRadius: 4, marginBottom: 20,
            border: "1px solid rgba(127, 224, 64, 0.3)",
          }}>
            {t.heroTag}
          </span>
          <h1 className={`${styles.providerReveal} ${styles.providerDelay2}`} style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 20px", maxWidth: 560, color: "#fff" }}>
            {t.heroLine1}<br />
            <span style={{ color: "#7FE040" }}>{t.heroLine2}</span><br />
            {t.heroLine3}
          </h1>
          <p className={`${styles.providerReveal} ${styles.providerDelay3}`} style={{ color: "rgba(255,255,255,0.65)", fontSize: "1rem", lineHeight: 1.7, margin: "0 0 36px", maxWidth: 440 }}>
            {t.heroBody}
          </p>
          <div className={`${styles.providerReveal} ${styles.providerDelay4}`} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link className={`${styles.providerCtaPulse} ${styles.providerHoverLift}`} href={providerLink} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#7FE040", color: "#050505", fontWeight: 700,
              padding: "14px 28px", borderRadius: 10, fontSize: "0.95rem",
              textDecoration: "none", boxShadow: "0 4px 24px rgba(127, 224, 64, 0.4)",
            }}>
              {t.heroCta1} <span>→</span>
            </Link>
            <Link className={styles.providerHoverLift} href="/servicios/proveedor" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.07)", color: "#fff", fontWeight: 600,
              padding: "14px 28px", borderRadius: 10, fontSize: "0.95rem",
              border: "1px solid rgba(255,255,255,0.14)", textDecoration: "none",
            }}>
              {t.heroCta2} <span style={{ opacity: 0.7 }}>▷</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── DOS CAMINOS ─────────────────────────────────── */}
      <section className={styles.providerSectionRise} style={{ padding: "80px 0" }}>
        <div className="shell">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <style>{`
              @keyframes shimmer-sweep {
                0%   { background-position: -200% center; }
                100% { background-position: 200% center; }
              }
              .negocio-shimmer {
                background: linear-gradient(90deg, #7FE040 0%, #c8ff90 45%, #ffffff 50%, #c8ff90 55%, #7FE040 100%);
                background-size: 200% auto;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: shimmer-sweep 2.5s linear infinite;
              }
            `}</style>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, margin: "0 0 8px" }}
            >
              {t.pathsHeadline}{" "}
              <span className="negocio-shimmer">{t.pathsHighlight}</span>
            </motion.h2>
          </div>

          <div className={styles.providerCardsGrid} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "stretch" }}>

            {/* EXPLORER */}
            <div
              onMouseEnter={() => setHoveredCard("explorer")}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                transition: "transform 0.38s cubic-bezier(0.22,1,0.36,1), box-shadow 0.38s ease, opacity 0.38s ease",
                transform: hoveredCard === "explorer" ? "scale(1.06)" : hoveredCard === "pro" ? "scale(0.94)" : "scale(1)",
                opacity: hoveredCard === "pro" ? 0.5 : 1,
                boxShadow: hoveredCard === "explorer" ? "0 32px 80px rgba(0,0,0,0.6)" : "none",
                borderRadius: 20,
                position: "relative", zIndex: hoveredCard === "explorer" ? 10 : 1,
                display: "flex", flexDirection: "column",
              }}
            ><div className={styles.providerCardAnimated} style={{
                background: card, border: `1px solid ${w(0.08)}`,
                borderRadius: 20, overflow: "hidden",
                display: "grid", gridTemplateColumns: "180px 1fr",
                flex: 1,
              }}>
              <div style={{ position: "relative", background: cardDark, minHeight: 200 }}>
                <img
                  src="/motor-producto.png"
                  alt={t.explorerImgAlt}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                />
              </div>
              <div style={{ padding: 32 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: w(0.07), border: `1px solid ${w(0.15)}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, color: w(0.5), fontSize: "1rem",
                  }}>1</div>
                  <div>
                    <h3 style={{ margin: "0 0 3px", fontSize: "1.2rem", fontWeight: 800, color: w(0.75) }}>{t.explorerTitle}</h3>
                    <p style={{ margin: 0, color: w(0.35), fontWeight: 600, fontSize: "0.85rem" }}>{t.explorerSubtitle}</p>
                  </div>
                </div>
                <p style={{ color: w(0.45), lineHeight: 1.65, marginBottom: 12, fontSize: "0.9rem" }}>
                  {t.explorerBody} <strong style={{ color: w(0.65) }}>{t.explorerBodyBold}</strong> {t.explorerBodyEnd}
                </p>
                <p style={{ color: "#7FE040", fontWeight: 600, fontSize: "0.82rem", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#7FE040" fillOpacity="0.15"/><path d="M8 4v4l2.5 2.5" stroke="#7FE040" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  {t.explorerClock}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                  {t.explorerFeatures.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.88rem", color: w(0.45) }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke={w(0.2)} strokeWidth="1.5"/><path d="M5 8l2 2 4-4" stroke={w(0.35)} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> {f}
                    </div>
                  ))}
                </div>
                <Link className={styles.providerHoverLift} href={providerLink} style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "transparent", color: w(0.5), fontWeight: 600,
                  padding: "11px 22px", borderRadius: 10, fontSize: "0.88rem",
                  border: `1px solid ${w(0.15)}`, textDecoration: "none",
                }}>
                  {t.explorerCta} <span>→</span>
                </Link>
              </div>
            </div></div>

            {/* PRO */}
            <div
              onMouseEnter={() => setHoveredCard("pro")}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                transition: "transform 0.38s cubic-bezier(0.22,1,0.36,1), box-shadow 0.38s ease, opacity 0.38s ease",
                transform: hoveredCard === "pro" ? "scale(1.06)" : hoveredCard === "explorer" ? "scale(0.94)" : "scale(1)",
                opacity: hoveredCard === "explorer" ? 0.5 : 1,
                boxShadow: hoveredCard === "pro" ? "0 32px 80px rgba(0,0,0,0.6), 0 0 50px rgba(245,158,11,0.35)" : "none",
                borderRadius: 20,
                position: "relative", zIndex: hoveredCard === "pro" ? 10 : 1,
                display: "flex", flexDirection: "column",
              }}
            ><div
              className={`${styles.providerCardAnimated} ${styles.providerCardPro}`}
              style={{
                background: "linear-gradient(135deg, #1a1100 0%, #2a1d00 50%, #1a1100 100%)",
                border: "1.5px solid #F59E0B",
                boxShadow: "0 0 50px rgba(245,158,11,0.2), inset 0 1px 0 rgba(245,158,11,0.12)",
                borderRadius: 20, overflow: "hidden", position: "relative",
                display: "grid", gridTemplateColumns: "1fr 1fr",
                flex: 1,
              }}>
              {/* glow de fondo */}
              <div style={{
                position: "absolute", top: -80, left: -80, width: 300, height: 300,
                background: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />
              <div style={{ padding: "24px 20px 24px 24px", position: "relative" }}>
                <div style={{
                  position: "absolute", top: 16, right: 16,
                  background: "#F59E0B", color: "#000",
                  fontSize: "0.68rem", fontWeight: 800, padding: "3px 10px", borderRadius: 20,
                  letterSpacing: "0.08em",
                  animation: "provider-soft-pulse-gold 2.8s ease-in-out infinite",
                }}>PRO</div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: "#F59E0B",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, color: "#000", fontSize: "1rem",
                    boxShadow: "0 2px 14px rgba(245,158,11,0.5)",
                  }}>2</div>
                  <div>
                    <h3 style={{ margin: "0 0 3px", fontSize: "1.2rem", fontWeight: 800, color: "#fff" }}>{t.proTitle}</h3>
                    <p style={{ margin: 0, color: "#F59E0B", fontWeight: 700, fontSize: "0.85rem" }}>{t.proSubtitle}</p>
                  </div>
                </div>
                <p style={{ color: "rgba(255,235,180,0.8)", lineHeight: 1.65, marginBottom: 20, fontSize: "0.9rem" }}>
                  {t.proBody}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                  {t.proFeatures.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.88rem", color: "rgba(255,235,180,0.9)" }}>
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="rgba(245,158,11,0.2)" stroke="#F59E0B" strokeWidth="1.2"/><path d="M5 8l2 2 4-4" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> {f}
                    </div>
                  ))}
                </div>
                <Link className={styles.providerHoverLift} href="/proveedor-pro" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#F59E0B", color: "#000", fontWeight: 800,
                  padding: "12px 26px", borderRadius: 10, fontSize: "0.9rem",
                  textDecoration: "none",
                  animation: "provider-cta-glow-gold 2.6s ease-in-out infinite",
                }}>
                  {t.proCta} <span>→</span>
                </Link>
              </div>
              <div style={{ position: "relative", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <img
                  src="/landing sillas.jpeg"
                  alt={t.proImgAlt}
                  style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center" }}
                />
              </div>
            </div></div>

          </div>
        </div>
      </section>

      {/* ── TABLA COMPARATIVA ───────────────────────────── */}
      <section className={`${styles.providerSectionRise} ${styles.providerDelay2}`} style={{ padding: "0 0 80px" }}>
        <div className={`shell ${styles.providerComparisonLayout}`} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "start" }}>
          <div>
            <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)", fontWeight: 800, margin: "0 0 28px" }}>
              {t.compareTitle} <span style={{ color: "#7FE040" }}>{t.compareTitleHighlight}</span>{t.compareTitleEnd}
            </h2>
            <div className={`${styles.providerTableAnimated} ${styles.providerTableScroll}`} style={{
              background: card, border: `1px solid ${w(0.08)}`,
              borderRadius: 16, overflow: "hidden",
            }}>
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 160px 160px",
                padding: "16px 24px", borderBottom: `1px solid ${w(0.08)}`,
                background: w(0.03), alignItems: "center",
              }}>
                <span style={{ color: w(0.45), fontSize: "0.82rem", fontWeight: 600 }}>{t.compareColFeatures}</span>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: "#7FE040", display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, color: "#050505", fontSize: "0.85rem",
                  }}>1</div>
                  <span className={styles.providerComparePlanName} data-mobile-label="Catálogo" style={{ fontSize: "0.88rem", fontWeight: 700, color: txt }}>{t.explorerTitle}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: "#7FE040", display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, color: "#050505", fontSize: "0.85rem",
                  }}>2</div>
                  <span className={styles.providerComparePlanName} data-mobile-label="Mensajes" style={{ fontSize: "0.88rem", fontWeight: 700, color: txt }}>{t.proTitle}</span>
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
          <div className={styles.providerSideCardAnimated} style={{
            background: card, border: `1px solid ${w(0.1)}`,
            borderRadius: 16, padding: 28, maxWidth: 230, marginTop: 52,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, marginBottom: 16,
              background: "rgba(127, 224, 64, 0.15)", border: "1px solid rgba(127, 224, 64, 0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7FE040" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <p style={{ color: w(0.85), fontSize: "1rem", lineHeight: 1.6, margin: "0 0 22px", fontWeight: 600 }}>
              {t.sideCardBody}
            </p>
            <Link className={styles.providerHoverLift} href={providerLink} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "transparent", color: txt, fontWeight: 700,
              padding: "12px 18px", borderRadius: 10, fontSize: "0.92rem",
              border: "1px solid rgba(127, 224, 64, 0.5)", textDecoration: "none",
            }}>
              {t.sideCardCta} <span style={{ color: "#7FE040" }}>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCIA ─────────────────────────────────── */}
      <section className={`${styles.providerSectionRise} ${styles.providerDelay3}`} style={{ padding: "40px 0 80px" }}>
        <div className="shell">
          <div className={styles.providerExperienceBanner} style={{ position: "relative", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(127, 224, 64, 0.15)", minHeight: 320 }}>
            <img
              src="/banner tiendas drokex virtual .jpg"
              alt={t.experienceImgAlt}
              className={styles.providerExperienceImage}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "70% center" }}
            />
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.7) 40%, rgba(5,5,5,0.1) 100%)",
            }} />

            <div style={{ position: "relative", zIndex: 2, padding: "44px 40px", maxWidth: 420 }}>
              <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", fontWeight: 800, margin: "0 0 14px", lineHeight: 1.15, color: "#fff" }}>
                {t.experienceTitle} <span style={{ color: "#7FE040" }}>{t.experienceTitleHighlight}</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 32px", fontSize: "0.92rem" }}>
                {t.experienceBody1}<br />
                <strong style={{ color: "rgba(255,255,255,0.85)" }}>{t.experienceBody2}</strong>
              </p>
              <div className={styles.providerExperienceSteps} style={{ display: "flex", gap: 28 }}>
                {[
                  { label: t.experienceSteps[0], icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7FE040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
                  { label: t.experienceSteps[1], icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7FE040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
                  { label: t.experienceSteps[2], icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7FE040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> },
                  { label: t.experienceSteps[3], icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7FE040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
                ].map(step => (
                  <div key={step.label} style={{ textAlign: "center" }}>
                    <div className={styles.providerStepIcon} style={{
                      width: 48, height: 48, borderRadius: 12, marginBottom: 8,
                      background: "rgba(127, 224, 64, 0.12)", border: "1px solid rgba(127, 224, 64, 0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{step.icon}</div>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{step.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${styles.providerFloatingTag} provider-float-a`} style={{ position: "absolute", bottom: "22%", left: "clamp(460px, 34%, 620px)", zIndex: 3, background: "rgba(10,10,10,0.82)", border: "1px solid rgba(127, 224, 64, 0.25)", backdropFilter: "blur(8px)", borderRadius: 10, padding: "8px 14px" }}>
              <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "#fff" }}>🏠 Muebles del Sur</div>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", marginTop: 2 }}>🇨🇴 Colombia</div>
            </div>
            <div className={`${styles.providerFloatingTag} ${styles.providerFloatB}`} style={{ position: "absolute", top: "12%", right: "4%", zIndex: 3, background: "rgba(10,10,10,0.82)", border: "1px solid rgba(127, 224, 64, 0.25)", backdropFilter: "blur(8px)", borderRadius: 10, padding: "8px 14px" }}>
              <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "#fff" }}>🏬 Design Future</div>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", marginTop: 2 }}>🇲🇽 México</div>
            </div>
            <div className={`${styles.providerFloatingTag} ${styles.providerFloatC}`} style={{ position: "absolute", bottom: "18%", right: "2%", zIndex: 3, background: "rgba(10,10,10,0.82)", border: "1px solid rgba(127, 224, 64, 0.25)", backdropFilter: "blur(8px)", borderRadius: 10, padding: "8px 14px" }}>
              <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "#fff" }}>🏡 Home & Deco</div>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", marginTop: 2 }}>🇨🇱 Chile</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DROKEX STUDIO ───────────────────────────────── */}
      <section className={`${styles.providerSectionRise} ${styles.providerDelay4}`} style={{ padding: "80px 0" }}>
        <div className={`shell ${styles.providerStudioLayout}`} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>

          <div className={styles.providerStudioPanel} style={{
            background: cardDark, border: `1px solid ${w(0.1)}`,
            borderRadius: 20, overflow: "hidden",
            display: "grid", gridTemplateColumns: "140px 1fr 160px",
            minHeight: 280,
          }}>
            <div style={{ borderRight: `1px solid ${w(0.07)}`, padding: "20px 0" }}>
              <p style={{ margin: "0 0 16px", padding: "0 16px", color: w(0.5), fontSize: "0.75rem", fontWeight: 700 }}>
                {t.studioNavLabel}
              </p>
              {t.studioNav.map((item, i) => (
                <div key={item} style={{
                  padding: "9px 16px", fontSize: "0.82rem", cursor: "pointer",
                  background: i === 0 ? "rgba(127, 224, 64, 0.12)" : "transparent",
                  color: i === 0 ? "#7FE040" : w(0.45),
                  fontWeight: i === 0 ? 700 : 400,
                  borderLeft: i === 0 ? "2px solid #7FE040" : "2px solid transparent",
                }}>
                  {item}
                </div>
              ))}
            </div>

            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ margin: 0, color: w(0.4), fontSize: "0.72rem", letterSpacing: "0.05em" }}>
                {t.studioPromptLabel}
              </p>
              <div style={{
                flex: 1, background: w(0.04), border: `1px solid ${w(0.08)}`,
                borderRadius: 10, padding: 14,
                color: w(0.65), fontSize: "0.82rem", lineHeight: 1.6,
              }}>
                {t.studioPromptPlaceholder}
              </div>
              <button className={`${styles.providerCtaPulse} ${styles.providerHoverLift}`} style={{
                background: "#7FE040", color: "#050505", fontWeight: 700,
                padding: "10px 18px", borderRadius: 8, border: "none",
                fontSize: "0.82rem", cursor: "pointer", textAlign: "center",
                boxShadow: "0 4px 16px rgba(127, 224, 64, 0.35)",
              }}>
                {t.studioGenerateBtn}
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 0, borderLeft: `1px solid ${w(0.07)}` }}>
              <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
                <img src="/sillas.jpeg" alt={t.studioImageAlt1} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 100%)", display: "flex", alignItems: "flex-end", padding: 10 }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: "0.78rem", color: "#fff", lineHeight: 1.2 }}>{t.studioOverlay1Line1}<br />{t.studioOverlay1Line2}</p>
                    <p style={{ margin: "3px 0 0", fontSize: "0.6rem", color: "rgba(255,255,255,0.55)" }}>★ DROKEX STU...</p>
                  </div>
                </div>
              </div>
              <div style={{ flex: 1, position: "relative", overflow: "hidden", borderTop: `1px solid ${w(0.07)}` }}>
                <img src="/landing sillas.jpeg" alt={t.studioImageAlt2} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 100%)", display: "flex", alignItems: "flex-end", padding: 10 }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: "0.78rem", color: "#fff", lineHeight: 1.2 }}>{t.studioOverlay2Line1}<br />{t.studioOverlay2Line2}</p>
                    <p style={{ margin: "3px 0 0", fontSize: "0.6rem", color: "rgba(255,255,255,0.55)" }}>★ DROKEX STU...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, margin: "0 0 16px" }}>
              <a href="/studio" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
                {t.studioTitle} <span style={{ color: "#7FE040" }}>{t.studioTitleHighlight}</span>
              </a>
            </h2>
            <p style={{ color: w(0.55), lineHeight: 1.7, margin: "0 0 24px", fontSize: "0.95rem" }}>
              {t.studioBody}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {t.studioFeatures.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.92rem", color: w(0.8) }}>
                  {checkIcon} {f}
                </div>
              ))}
            </div>
            <a href="/studio" target="_blank" rel="noopener noreferrer" className={`${styles.providerCtaPulse} ${styles.providerHoverLift}`} style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "#7FE040", color: "#050505", fontWeight: 700,
              padding: "13px 26px", borderRadius: 10, fontSize: "0.92rem",
              textDecoration: "none", boxShadow: "0 4px 20px rgba(127, 224, 64, 0.35)",
            }}>
              {t.studioCta} <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────── */}
      <section className={`${styles.providerSectionRise} ${styles.providerDelay4}`} style={{ padding: "40px 0 48px" }}>
        <div className="shell">
          <div className={styles.providerFinalCta} style={{
            background: lightMode ? "#e8f5e3" : "linear-gradient(135deg, #0a1a0a 0%, #0d2010 100%)",
            border: "1px solid rgba(127, 224, 64, 0.3)",
            borderRadius: 20, padding: "52px 56px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 24,
            boxShadow: "0 0 60px rgba(127, 224, 64, 0.08)",
          }}>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, margin: 0, lineHeight: 1.2, color: txt }}>
              {t.finalCtaTitle1} <span style={{ color: "#7FE040" }}>{t.finalCtaTitle2}</span><br />
              {t.finalCtaTitle3}
            </h2>
            <Link className={`${styles.providerCtaPulse} ${styles.providerHoverLift}`} href={providerLink} style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "#7FE040", color: "#050505", fontWeight: 800,
              padding: "16px 36px", borderRadius: 12, fontSize: "1rem",
              textDecoration: "none", whiteSpace: "nowrap",
              boxShadow: "0 4px 28px rgba(127, 224, 64, 0.4)",
            }}>
              {t.finalCtaBtn} <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────── */}
      <div className={styles.providerStatsBar} style={{
        background: lightMode ? "#ebebeb" : "#050505",
        borderBottom: `1px solid ${w(0.06)}`,
        padding: "28px 0",
      }}>
        <div className={`shell ${styles.providerStatsGrid}`} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {t.stats.map((s, i) => (
            <div className={styles.providerStatItem} key={s.label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: "rgba(127, 224, 64, 0.1)", border: "1px solid rgba(127, 224, 64, 0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{footerStatsIcons[i]}</div>
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
