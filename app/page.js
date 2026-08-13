"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import HeroDistortion from "@/app/components/hero-distortion";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";
import ProductChat from "@/app/components/product-chat";
import awStyles from "@/app/components/auth-wall.module.css";
import qfStyles from "@/app/components/quote-form.module.css";
import styles from "./page.module.css";

// styles[`${base}${Capitalized(id)}`] with graceful fallback when no modifier class exists (e.g. "proveedores" default)
const variantClass = (base, id) => styles[`${base}${id.charAt(0).toUpperCase()}${id.slice(1)}`] || "";

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

// ─── Translations ────────────────────────────────────────────────────────────
const T = {
  es: {
    // Hero
    heroTag: "Catálogo internacional",
    heroHeadline: "Tu empresa, visible para el mundo.",
    heroSubtitle:
      "Drokex es tu catálogo digital para atraer clientes en otros países y expandir tu negocio sin fronteras.",
    heroSellSpan: "Quiero",
    heroSellStrong: "llevar mi empresa al mundo",
    heroBuySpan: "Quiero",
    heroBuyStrong: "encontrar proveedores reales",

    // System section
    systemTag: "PARA EMPRESAS",
    systemHeadlineLine1: "Un catálogo diseñado para",
    systemHeadlineLine2: "conectarte con el mundo",
    systemBody:
      "Ponemos tu empresa frente a compradores internacionales para que puedas crecer sin necesidad de salir a buscarlos.",

    // Operating steps
    step1Title: "Crea tu catálogo",
    step1Desc:
      "Publica tu empresa, productos y catálogo para que compradores de otros países encuentren lo que ofreces.",
    step2Title: "Alcance global",
    step2Desc:
      "Tu perfil es visible para empresas y compradores en múltiples países que buscan activamente proveedores.",
    step3Title: "Contacto directo",
    step3Desc:
      "Los compradores interesados te contactan directamente desde la plataforma para iniciar una conversación comercial.",
    step4Title: "Leads calificados",
    step4Desc:
      "Recibes oportunidades reales de empresas con intención de compra, listas para negociar contigo.",
    step5Title: "Expansion lograda",
    step5Desc:
      "Tu negocio gana presencia internacional y construye relaciones comerciales duraderas más allá de tus fronteras.",

    // Operating highlights
    highlight1Title: "Visibilidad total",
    highlight1Desc: "Monitorea el avance de cada operación con una lectura más clara.",
    highlight2Title: "Control y seguridad",
    highlight2Desc: "Tu decides como avanzar y Drokex ayuda a proteger el proceso.",
    highlight3Title: "Integracion simple",
    highlight3Desc: "Conecta tu oferta y tus flujos sin depender de procesos dispersos.",
    highlight4Title: "Soporte humano",
    highlight4Desc: "Un equipo cercano que entiende el mercado y acompana cada paso.",

    // Benefits
    benefit1: "Origen colombiano",
    benefit2: "Expansion LATAM",
    benefit3: "Red de aliados",
    benefit4: "Logistica eficiente",

    // Markets
    marketsGrow: "Crece en todo el mundo",
    marketsBuyNow: "Compra ahora",

    // Platform section
    platformTag: "Plataforma",
    platformHeading: "Conoce a Drokex",
    platformTabProvider: "Proveedor",
    platformTabClient: "Cliente",

    // Tabs
    tabDropshippersLabel: "Distribuidor",
    tabDropshippersTitle:
      "Encuentra productos y proveedores para ampliar tu oferta sin complicaciones.",
    tabDropshippersDesc:
      "Explora el catálogo de Drokex, compara proveedores y conecta con quienes tienen lo que necesitas para hacer crecer tu negocio.",
    tabMarcasLabel: "Cliente",
    tabMarcasTitle:
      "Encuentra proveedores reales para tu negocio en un solo lugar.",
    tabMarcasDesc:
      "Accede al catálogo de Drokex y conecta con empresas verificadas que tienen lo que necesitas, sin intermediarios y sin perder tiempo.",
    tabProveedoresLabel: "Proveedor",
    tabProveedoresTitle:
      "Publica tu catálogo y atrae compradores internacionales.",
    tabProveedoresDesc:
      "Crea tu perfil en Drokex y pon tu empresa frente a clientes de todo el mundo que buscan activamente lo que tú ofreces.",

    // Platform highlights – marcas
    phMarcas1: "Busca y compara proveedores de diferentes países en un solo lugar.",
    phMarcas2:
      "Accede a catálogos completos con información real de cada proveedor.",
    phMarcas3:
      "Contacta directamente al proveedor y negocia desde la plataforma.",

    // Platform highlights – proveedores
    phProveedores1:
      "Publica tu empresa y catálogo de productos para ser encontrado por compradores internacionales.",
    phProveedores2:
      "Muestra tus productos, precios y capacidad de entrega de forma clara y profesional.",
    phProveedores3:
      "Recibe contactos directos de empresas con intención real de compra.",

    // GIF / feature labels
    gifLabel1: "Llega a compradores globales",
    gifLabel2: "Publica tu catálogo",
    gifLabel3: "Crea tu perfil empresarial",
    gifLabel4: "Gestiona tus productos",
    gifLabel5: "Atrae clientes internacionales",
    gifLabel6: "Conecta con compradores reales",

    // Testimonials section
    testimonialsTag: "Casos de exito",
    testimonialsHeadlinePre: "Asi crecen con ",
    testimonialsBody:
      "Historias de empresarios, marcas y operadores que usan Drokex para abrir nuevas oportunidades comerciales.",

    // Aria labels
    ariaVideoPrev: "Video anterior",
    ariaVideoNext: "Siguiente video",
    ariaVideoPlay: "Reproducir historia de",
    ariaVideoGoto: "Ir al video",
    ariaModalClose: "Cerrar video",
    ariaMarkets: "Mercados",
    ariaAudiences: "Audiencias",

    // Contact section
    contactSectionTag: "Contacto",
    contactHeadline1: "Hablemos de",
    contactHeadline2: "crecimiento",
    contactHeadline3: "internacional.",
    contactFormHeading: "Envianos un mensaje",
    contactPlaceholderName: "Nombre",
    contactPlaceholderEmail: "Correo electronico",
    contactSelectDefault: "Selecciona un motivo",
    contactOptionSales: "Ventas",
    contactOptionSupport: "Soporte",
    contactOptionAlliances: "Alianzas",
    contactPlaceholderMessage: "Escribe tu mensaje aqui...",
    contactMsgSent: "Mensaje enviado correctamente.",
    contactMsgError: "No fue posible enviar. Intenta de nuevo.",
    contactBtnSending: "Enviando...",
    contactBtnSend: "Enviar mensaje",
    contactWhatsApp: "Escribenos por WhatsApp",
  },
  en: {
    // Hero
    heroTag: "International Catalog",
    heroHeadline: "Your business, visible to the world.",
    heroSubtitle:
      "Drokex is your digital catalog to attract clients in other countries and expand your business across borders.",
    heroSellSpan: "I want to",
    heroSellStrong: "take my company global",
    heroBuySpan: "I want to",
    heroBuyStrong: "find real suppliers",

    // System section
    systemTag: "FOR BUSINESSES",
    systemHeadlineLine1: "A catalog designed to",
    systemHeadlineLine2: "connect you with the world",
    systemBody:
      "We put your business in front of international buyers so you can grow without having to go out and find them.",

    // Operating steps
    step1Title: "Build your catalog",
    step1Desc:
      "Publish your company, products and catalog so buyers from other countries can find what you offer.",
    step2Title: "Global reach",
    step2Desc:
      "Your profile is visible to companies and buyers in multiple countries actively looking for suppliers.",
    step3Title: "Direct contact",
    step3Desc:
      "Interested buyers reach out to you directly through the platform to start a commercial conversation.",
    step4Title: "Qualified leads",
    step4Desc:
      "You receive real opportunities from companies with purchase intent, ready to negotiate with you.",
    step5Title: "Growth achieved",
    step5Desc:
      "Your business gains international presence and builds lasting commercial relationships beyond your borders.",

    // Operating highlights
    highlight1Title: "Full Visibility",
    highlight1Desc: "Monitor the progress of every operation with a clearer reading.",
    highlight2Title: "Control & Security",
    highlight2Desc: "You decide how to move forward and Drokex helps protect the process.",
    highlight3Title: "Simple Integration",
    highlight3Desc: "Connect your offer and your workflows without depending on scattered processes.",
    highlight4Title: "Human Support",
    highlight4Desc: "A close-knit team that understands the market and accompanies every step.",

    // Benefits
    benefit1: "Colombian origin",
    benefit2: "LATAM expansion",
    benefit3: "Ally network",
    benefit4: "Efficient logistics",

    // Markets
    marketsGrow: "Grow worldwide",
    marketsBuyNow: "Buy now",

    // Platform section
    platformTag: "Platform",
    platformHeading: "Meet Drokex",
    platformTabProvider: "Supplier",
    platformTabClient: "Client",

    // Tabs
    tabDropshippersLabel: "Distributor",
    tabDropshippersTitle:
      "Find products and suppliers to expand your offer without the hassle.",
    tabDropshippersDesc:
      "Browse the Drokex catalog, compare suppliers, and connect with those who have what you need to grow your business.",
    tabMarcasLabel: "Client",
    tabMarcasTitle:
      "Find real suppliers for your business in one place.",
    tabMarcasDesc:
      "Access the Drokex catalog and connect with verified companies that have what you need — no middlemen, no wasted time.",
    tabProveedoresLabel: "Supplier",
    tabProveedoresTitle:
      "Publish your catalog and attract international buyers.",
    tabProveedoresDesc:
      "Create your Drokex profile and put your business in front of clients worldwide who are actively looking for what you offer.",

    // Platform highlights – marcas
    phMarcas1: "Search and compare suppliers from different countries in one place.",
    phMarcas2:
      "Access complete catalogs with real information from each supplier.",
    phMarcas3:
      "Contact the supplier directly and negotiate from the platform.",

    // Platform highlights – proveedores
    phProveedores1:
      "Publish your company and product catalog to be found by international buyers.",
    phProveedores2:
      "Show your products, prices, and delivery capacity clearly and professionally.",
    phProveedores3:
      "Receive direct contacts from companies with real purchase intent.",

    // GIF / feature labels
    gifLabel1: "Reach global buyers",
    gifLabel2: "Publish your catalog",
    gifLabel3: "Create your business profile",
    gifLabel4: "Manage your products",
    gifLabel5: "Attract international clients",
    gifLabel6: "Connect with real buyers",

    // Testimonials section
    testimonialsTag: "Success stories",
    testimonialsHeadlinePre: "Growing with ",
    testimonialsBody:
      "Stories from entrepreneurs, brands, and operators who use Drokex to open new commercial opportunities.",

    // Aria labels
    ariaVideoPrev: "Previous video",
    ariaVideoNext: "Next video",
    ariaVideoPlay: "Play story of",
    ariaVideoGoto: "Go to video",
    ariaModalClose: "Close video",
    ariaMarkets: "Markets",
    ariaAudiences: "Audiences",

    // Contact section
    contactSectionTag: "Contact",
    contactHeadline1: "Let's talk about",
    contactHeadline2: "international",
    contactHeadline3: "growth.",
    contactFormHeading: "Send us a message",
    contactPlaceholderName: "Name",
    contactPlaceholderEmail: "Email address",
    contactSelectDefault: "Select a reason",
    contactOptionSales: "Sales",
    contactOptionSupport: "Support",
    contactOptionAlliances: "Partnerships",
    contactPlaceholderMessage: "Write your message here...",
    contactMsgSent: "Message sent successfully.",
    contactMsgError: "Could not send. Please try again.",
    contactBtnSending: "Sending...",
    contactBtnSend: "Send message",
    contactWhatsApp: "Message us on WhatsApp",
  },
};
// ─────────────────────────────────────────────────────────────────────────────

const videos = [
  {
    src: "/mauren-blandon.jpeg",
    name: "Mariana G.",
    role: "Directora Comercial",
    quote: "Más visibilidad, más control y más clientes satisfechos.",
    embedUrl: "https://drive.google.com/file/d/1Piu2tC1qIiWiUtDpOwJ2Y9p5TzLZM7xK/preview",
  },
  {
    src: "/market-person-2.jpg",
    name: "Sofía L.",
    role: "CEO · Importaciones 360",
    quote: "Con Drokex conectamos con proveedores y mercados globales.",
    embedUrl: "https://drive.google.com/file/d/1j24Dzx4kzy9itXC7CvLNOcr83Be-JT3E/preview",
  },
  {
    src: "/andres-carrillo.jpeg",
    name: "Andres",
    role: "Fundador · Logística Global",
    quote: "Drokex nos permitió escalar operaciones y abrir nuevos mercados en tiempo récord.",
    embedUrl: "https://drive.google.com/file/d/1teHl1mOAA7BXlawO8rZWOC8gaq1KEli3/preview",
  },
  {
    src: "/javier-hurtado.jpeg",
    name: "Carlos M.",
    role: "Operaciones · Distribuidora Sur",
    quote: "La plataforma que nos da confianza para crecer cada día.",
    embedUrl: "https://drive.google.com/file/d/11kT2qn8KyjXVOuEEIxa8vNML0_eD5iql/preview",
  },
  {
    src: "/market-person-1.jpg",
    name: "Valeria T.",
    role: "COO · Tech Supply",
    quote: "Innovación y tecnología que realmente impulsan nuestro negocio.",
    embedUrl: "https://drive.google.com/file/d/12QheSMJssohHWDCq-VkW0HGMAA1Lhr3a/preview",
  },
];

const heroThemes = [
  { id: "dark", image: "/hero-banner-dark.jpg" },
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
    headline: "Activa oportunidades comerciales para Nicaragua con una catálogo más clara.",
    description:
      "Adapta tu catálogo a mercados clave y muestra una propuesta mas confiable para compradores que necesitan velocidad, contexto y seguimiento.",
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
      "Cada bandera puede activar otra catálogo, otra historia y otro ritmo de conversión para una expansión más inteligente.",
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
    headline: "Conecta productos y compradores en Perú con una catálogo mas confiable.",
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
      "Adapta tu catálogo a mercados clave y muestra una propuesta mas confiable para compradores que necesitan velocidad, contexto y seguimiento.",
  },
];

const COUNTRY_PREFERENCE_STORAGE_KEY = "drokex-selected-country";

const platformFlowSteps = [
  { num: "1.", title: "PUBLICAS", desc: "Creas tu perfil y publicas tu catálogo de productos.", iconPath: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" },
  { num: "2.", title: "TE ENCUENTRAN", desc: "Compradores de todo el mundo te descubren fácilmente.", iconPath: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" },
  { num: "3.", title: "RECIBES CONTACTOS", desc: "Empresas interesadas te contactan directamente.", iconPath: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
  { num: "4.", title: "GENERAS NEGOCIOS", desc: "Conectas, negocias y cierras oportunidades.", iconPath: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { num: "5.", title: "EXPANDES", desc: "Haces crecer tu empresa en nuevos mercados.", iconPath: "M22 7 13.5 15.5 8.5 10.5 2 17M16 7h6v6" },
];

const tabStats = {
  proveedores: [
    { iconPath: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z", label: "Alcance global", value: "80+ países" },
    { iconPath: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75", label: "Compradores activos", value: "10K+" },
    { iconPath: "M22 7 13.5 15.5 8.5 10.5 2 17M16 7h6v6", label: "Oportunidades reales", value: "Crecimiento" },
  ],
  marcas: [
    { iconPath: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z", label: "Alcance de marca", value: "500K+" },
    { iconPath: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z", label: "Distribuidores", value: "2K+" },
    { iconPath: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", label: "Ventas generadas", value: "Récord" },
  ],
  dropshippers: [
    { iconPath: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0", label: "Catálogos activos", value: "2K+" },
    { iconPath: "M5 12h14M12 5l7 7-7 7", label: "Pedidos gestionados", value: "50K+" },
    { iconPath: "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01 9 11.01", label: "Margen optimizado", value: "+35%" },
  ],
};

const operatingSteps = [
  {
    number: "01",
    titleKey: "step1Title",
    descKey: "step1Desc",
    iconSrc: "/sp-step-2.png",
  },
  {
    number: "02",
    titleKey: "step2Title",
    descKey: "step2Desc",
    iconSrc: "/sp-step-3.png",
  },
  {
    number: "03",
    titleKey: "step3Title",
    descKey: "step3Desc",
    iconSrc: "/sp-step-1.png",
  },
  {
    number: "04",
    titleKey: "step4Title",
    descKey: "step4Desc",
    iconSrc: "/sp-step-5.png",
  },
  {
    number: "05",
    titleKey: "step5Title",
    descKey: "step5Desc",
    iconSrc: "/sp-step-4.png",
  },
];

const operatingHighlights = [
  {
    titleKey: "highlight1Title",
    descKey: "highlight1Desc",
    icon: <SystemTargetIcon />,
  },
  {
    titleKey: "highlight2Title",
    descKey: "highlight2Desc",
    icon: <SystemLockIcon />,
  },
  {
    titleKey: "highlight3Title",
    descKey: "highlight3Desc",
    icon: <SystemNodesIcon />,
  },
  {
    titleKey: "highlight4Title",
    descKey: "highlight4Desc",
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
  { src: "/home-feature-globe.mp4", labelKey: "gifLabel1" },
  { src: "/home-feature-laptop.mp4", labelKey: "gifLabel2" },
  { src: "/home-feature-products.mp4", labelKey: "gifLabel3" },
  { src: "/home-feature-globe.mp4", labelKey: "gifLabel5" },
  { src: "/home-feature-laptop.mp4", labelKey: "gifLabel6" },
];

function FeatureVideoCarousel({ lang }) {
  const [active, setActive] = useState(2);
  const activeRef = useRef(2);
  const carouselRef = useRef(null);
  const cooldown = useRef(false);
  const activeVideo = gifItems[active];
  const t = T[lang];

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
    <div className={styles.featureVideoCarousel} ref={carouselRef}>
      <button className={styles.gifScrollArrow} onClick={() => goTo(active - 1)} aria-label={t.ariaVideoPrev}>◀</button>
      <div className={styles.featureVideoFrame}>
        <div className={`${styles.gifCard} ${styles.gifCardSingle}`} key={activeVideo.src}>
          <div className={styles.gifCardMedia}>
            <video
              src={activeVideo.src}
              aria-label={t[activeVideo.labelKey]}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          </div>
          <div className={styles.gifCardLabel}>
            <p>{t[activeVideo.labelKey]}</p>
          </div>
        </div>
      </div>

      <button className={styles.gifScrollArrow} onClick={() => goTo(active + 1)} aria-label={t.ariaVideoNext}>▶</button>

      <div className={styles.gifScrollDots}>
        {gifItems.map((_, i) => (
          <button key={i} className={i === active ? `${styles.gifDot} ${styles.isActive}` : styles.gifDot} onClick={() => goTo(i)} aria-label={`${t.ariaVideoGoto} ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

function PlatformEditorial({ tabs, platformHighlights, activeIdx }) {
  const activeTab = tabs[activeIdx];
  const highlights = platformHighlights[activeTab.id] || [];
  const stats = tabStats[activeTab.id] || [];

  return (
    <div className={styles.pfEditorial}>
      <div className={styles.pfGrid}>
        {/* Left: editorial copy */}
        <div className={styles.pfCopyWrap}>
          <motion.div
            key={`copy-${activeIdx}`}
            className={styles.pfCopy}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className={`${styles.pfEditorialLabel} ${variantClass("pfEditorialLabel", activeTab.id)}`}>{activeTab.label}</p>
            <h3 className={styles.pfTitle}>{activeTab.title}</h3>
            <p className={styles.pfDesc}>{activeTab.description}</p>
            <ul className={`${styles.fanFeatures} ${styles.pfFeats}`}>
              {highlights.map((h, i) => (
                <motion.li
                  key={h}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.09, ease: "easeOut" }}
                >
                  <svg viewBox="0 0 24 24" fill="none" width="17" height="17" className={`${styles.pfCheck} ${variantClass("pfCheck", activeTab.id)}`} aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
                    <polyline points="9 12 11 14 15 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {h}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Right: dark featured card */}
        <div className={styles.pfMedia}>
          <motion.div
            key={`video-${activeIdx}`}
            className={`${styles.pfFeatured} ${variantClass("pfFeatured", activeTab.id)}`}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* World map background */}
            <div className={styles.pfFeaturedMap} aria-hidden="true">
              <img src="/world.svg" alt="" />
            </div>

            {/* Stats + video inner layout */}
            <div className={styles.pfFeaturedInner}>
              <div className={styles.pfStatChips}>
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className={`${styles.pfStatChip} ${variantClass("pfStatChip", activeTab.id)}`}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                  >
                    <div className={styles.pfStatChipIcon} aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="15" height="15">
                        <path d={stat.iconPath} />
                      </svg>
                    </div>
                    <div>
                      <p className={styles.pfStatChipLabel}>{stat.label}</p>
                      <p className={`${styles.pfStatChipValue} ${variantClass("pfStatChipValue", activeTab.id)}`}>{stat.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className={styles.pfFeaturedMedia}>
                <video src={activeTab.video} autoPlay muted loop playsInline className={styles.pfFeaturedVideo} />
              </div>
            </div>

            {/* Bottom glow */}
            <div className={`${styles.pfFeaturedGlow} ${variantClass("pfFeaturedGlow", activeTab.id)}`} aria-hidden="true" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState("es");
  const [activeTab, setActiveTab] = useState(2);
  const [currentVideo, setCurrentVideo] = useState(2);
  const [openVideo, setOpenVideo] = useState(null);
  const [heroTheme, setHeroTheme] = useState("dark");
  const [hoveredHeroBtn, setHoveredHeroBtn] = useState(null);
  const [marketChatState, setMarketChatState] = useState("idle"); // idle | auth-wall | chat
  const [marketChatTarget, setMarketChatTarget] = useState(null);

  function handleMarketContact(market) {
    const msg = encodeURIComponent(`Hola, estoy interesado en conectar con el mercado de ${market.label} a través de Drokex. ¿Me puedes ayudar?`);
    window.open(`https://wa.me/573209654384?text=${msg}`, "_blank");
  }
  const [activeMarket, setActiveMarket] = useState(0);
  const marketPausedRef = useRef(false);
  const [platformActive, setPlatformActive] = useState(0);
  const pfViewportRef = useRef(null);
  const pfCardRef = useRef(null);
  const pfActiveRef = useRef(0);

  function pfGoTo(i) {
    pfActiveRef.current = i;
    setPlatformActive(i);
    if (pfViewportRef.current) {
      pfViewportRef.current.scrollTo({ left: i * pfViewportRef.current.offsetWidth, behavior: "smooth" });
    }
  }

  useEffect(() => {
    const el = pfViewportRef.current;
    if (!el) return;
    let startX, startSL, dragging = false;

    function onDown(e) {
      startX = e.clientX;
      startSL = el.scrollLeft;
      dragging = true;
      const card = pfCardRef.current;
      if (card) {
        card.style.transition = "transform 0.18s ease, box-shadow 0.18s ease";
        card.style.transform = "scale(0.972)";
        card.style.boxShadow = "0 28px 80px rgba(0,0,0,0.55)";
      }
    }
    function onMove(e) {
      if (!dragging) return;
      e.preventDefault();
      const dx = e.clientX - startX;
      el.scrollLeft = startSL - dx;
      const card = pfCardRef.current;
      if (card) {
        const tilt  = Math.max(-9, Math.min(9, dx * 0.022));
        const lift  = Math.min(Math.abs(dx) * 0.08, 14);
        card.style.transition = "none";
        card.style.transform  = `perspective(1100px) rotateY(${-tilt}deg) scale(0.972) translateY(${-lift}px)`;
        card.style.boxShadow  = `${-tilt * 2.5}px ${24 + lift}px ${70 + lift * 2}px rgba(0,0,0,0.52)`;
      }
    }
    function onUp() {
      if (!dragging) return;
      dragging = false;
      const card = pfCardRef.current;
      if (card) {
        card.style.transition = "transform 0.65s cubic-bezier(0.34,1.44,0.64,1), box-shadow 0.5s ease";
        card.style.transform  = "";
        card.style.boxShadow  = "";
      }
      const i = Math.round(el.scrollLeft / el.offsetWidth);
      pfGoTo(i);
    }

    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove, { passive: false });
    window.addEventListener("mouseup", onUp);
    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactStatus, setContactStatus] = useState(null); // null | "sending" | "sent" | "error"

  const t = T[lang];

  // Derived tab data using translation keys
  const tabs = [
    {
      id: "proveedores",
      label: t.tabProveedoresLabel,
      video: "/home-feature-laptop.mp4",
      title: t.tabProveedoresTitle,
      description: t.tabProveedoresDesc,
    },
    {
      id: "marcas",
      label: t.tabMarcasLabel,
      video: "/home-feature-globe.mp4",
      title: t.tabMarcasTitle,
      description: t.tabMarcasDesc,
    },
    {
      id: "dropshippers",
      label: t.tabDropshippersLabel,
      video: "/home-feature-products.mp4",
      title: t.tabDropshippersTitle,
      description: t.tabDropshippersDesc,
    },
  ];

  const platformHighlights = {
    marcas: [t.phMarcas1, t.phMarcas2, t.phMarcas3],
    proveedores: [t.phProveedores1, t.phProveedores2, t.phProveedores3],
  };

  const benefits = [t.benefit1, t.benefit2, t.benefit3, t.benefit4];

  const activeAudience = useMemo(() => tabs[activeTab], [activeTab, lang]);
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

  // Read lang from localStorage on mount and listen for changes
  useEffect(() => {
    const stored = localStorage.getItem("drokex-lang") || "es";
    setLang(stored === "en" ? "en" : "es");

    const handleLangChange = () => {
      const updated = localStorage.getItem("drokex-lang") || "es";
      setLang(updated === "en" ? "en" : "es");
    };

    window.addEventListener("drokex-lang-change", handleLangChange);
    return () => window.removeEventListener("drokex-lang-change", handleLangChange);
  }, []);

  useEffect(() => {
    const savedCountry = window.localStorage.getItem(COUNTRY_PREFERENCE_STORAGE_KEY) || "";

    if (!savedCountry) return;

    const savedIndex = globalMarkets.findIndex((market) => market.id === savedCountry);

    if (savedIndex < 0) return;

    setActiveMarket(savedIndex);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!marketPausedRef.current) {
        setActiveMarket(prev => (prev + 1) % globalMarkets.length);
      }
    }, 3000);
    return () => clearInterval(interval);
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

  const getTestiOffset = (i) => {
    const n = videos.length;
    let off = i - currentVideo;
    if (off > 2) off -= n;
    if (off < -2) off += n;
    return off;
  };

  return (
    <main className="drokex-home">
      <SiteHeader />

      <section className={styles.heroSection} id="inicio" onMouseLeave={() => setHeroTheme("dark")}>
        <div className={styles.heroBackgrounds} aria-hidden="true">
          {heroThemes.map((theme) => (
            <img
              key={theme.id}
              className={heroTheme === theme.id ? `${styles.heroBackground} ${styles.isActive}` : styles.heroBackground}
              src={theme.image}
              alt=""
              draggable="false"
            />
          ))}
        </div>
        <div className={styles.heroOverlay} />
        <div className={styles.heroGridOverlay} aria-hidden="true" />
        <HeroDistortion image={activeHeroTheme.image} />

        <div className={`shell ${styles.heroShell}`}>
          <div className={`${styles.heroCopy} ${styles.heroCopyCompact}`}>
            <motion.p className="section-tag" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              {t.heroTag}
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}>
              {t.heroHeadline}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.55 }}>
              {t.heroSubtitle}
            </motion.p>
          </div>

          <motion.div className={styles.heroActionsSplit} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}>
            {/* Botón verde */}
            <div
              className={styles.heroBtnGroup}
              onMouseEnter={() => { setHeroTheme("green"); setHoveredHeroBtn("sell"); }}
              onMouseLeave={() => { setHeroTheme("dark"); setHoveredHeroBtn(null); }}
            >
              <AnimatePresence>
                {hoveredHeroBtn === "sell" && (
                  <motion.div className={`${styles.heroBtnFeaturesCard} ${styles.heroBtnFeaturesCardGreen}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.22 }}>
                    {[
                      { icon: <><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></>, title: "Registro gratuito", desc: "Crea tu perfil en minutos, sin costo." },
                      { icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>, title: "Visibilidad inmediata", desc: "Tu empresa visible al instante." },
                      { icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>, title: "Solicitudes directas", desc: "Compradores te contactan sin filtros." },
                      { icon: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>, title: "Sin comisiones", desc: "Vende con total libertad y sin cobros." },
                    ].map((f, i) => (
                      <div key={i} className={styles.heroBtnFeaturesRow}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20" aria-hidden="true">{f.icon}</svg>
                        <div><strong>{f.title}</strong><span>{f.desc}</span></div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div whileTap={{ scale: 0.97 }}>
                <Link href="/para-proveedores" className={`${styles.heroOptionButton} ${styles.heroOptionButtonGreen}`}>
                  <span>{t.heroSellSpan}</span>
                  <strong>{t.heroSellStrong}</strong>
                </Link>
              </motion.div>
            </div>

            {/* Botón naranja */}
            <div
              className={styles.heroBtnGroup}
              onMouseEnter={() => { setHeroTheme("orange"); setHoveredHeroBtn("buy"); }}
              onMouseLeave={() => { setHeroTheme("dark"); setHoveredHeroBtn(null); }}
            >
              <AnimatePresence>
                {hoveredHeroBtn === "buy" && (
                  <motion.div className={`${styles.heroBtnFeaturesCard} ${styles.heroBtnFeaturesCardOrange}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.22 }}>
                    {[
                      { icon: <><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></>, title: "Acceso gratuito", desc: "Explora sin costo ni registro previo." },
                      { icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>, title: "100% verificados", desc: "Empresas validadas por Drokex." },
                      { icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>, title: "Cotización directa", desc: "Habla con el proveedor sin intermediarios." },
                      { icon: <><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></>, title: "Pago seguro", desc: "Transacciones protegidas en todo momento." },
                    ].map((f, i) => (
                      <div key={i} className={styles.heroBtnFeaturesRow}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20" aria-hidden="true">{f.icon}</svg>
                        <div><strong>{f.title}</strong><span>{f.desc}</span></div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div whileTap={{ scale: 0.97 }}>
                <Link href="/productos" className={`${styles.heroOptionButton} ${styles.heroOptionButtonOrange}`}>
                  <span>{t.heroBuySpan}</span>
                  <strong>{t.heroBuyStrong}</strong>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Banner de features en la base del hero */}
          <AnimatePresence>
            {hoveredHeroBtn && (
              <motion.div
                className={`${styles.heroFeaturesBar} ${hoveredHeroBtn === "sell" ? styles.heroFeaturesBarGreen : styles.heroFeaturesBarOrange}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                {hoveredHeroBtn === "sell" ? (
                  <>
                    <div className={styles.heroFeatureItem}>
                      <div className={styles.heroFeatureIcon}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div>
                      <div><strong>Conecta +25 países</strong><p>Expande tu negocio sin fronteras.</p></div>
                    </div>
                    <div className={styles.heroFeatureItem}>
                      <div className={styles.heroFeatureIcon}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
                      <div><strong>Catálogo digital</strong><p>Publica y gestiona tus productos.</p></div>
                    </div>
                    <div className={styles.heroFeatureItem}>
                      <div className={styles.heroFeatureIcon}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                      <div><strong>Compradores globales</strong><p>Recibe solicitudes internacionales.</p></div>
                    </div>
                    <div className={styles.heroFeatureItem}>
                      <div className={styles.heroFeatureIcon}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22" aria-hidden="true"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div>
                      <div><strong>Plataforma inteligente</strong><p>Tecnología que impulsa tus ventas.</p></div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.heroFeatureItem}>
                      <div className={styles.heroFeatureIcon}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                      <div><strong>Proveedores verificados</strong><p>Negocia con confianza y seguridad.</p></div>
                    </div>
                    <div className={styles.heroFeatureItem}>
                      <div className={styles.heroFeatureIcon}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg></div>
                      <div><strong>Miles de productos</strong><p>De múltiples industrias listos para conectar.</p></div>
                    </div>
                    <div className={styles.heroFeatureItem}>
                      <div className={styles.heroFeatureIcon}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div>
                      <div><strong>Búsqueda avanzada</strong><p>Filtra por producto, precio y ubicación.</p></div>
                    </div>
                    <div className={styles.heroFeatureItem}>
                      <div className={styles.heroFeatureIcon}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22" aria-hidden="true"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div>
                      <div><strong>Plataforma inteligente</strong><p>Tecnología que te ayuda a encontrar oportunidades.</p></div>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className={styles.systemSection}>
        <BackgroundMap side="left" />
        <BackgroundMap side="right" />

        <div className="shell">
          <motion.div className={styles.systemHeader} {...fadeUp(0)}>
            <p className={`section-tag ${styles.sectionTagGreen}`}>{t.systemTag}</p>
            <h2>
              <span>{t.systemHeadlineLine1}</span>
              <span>
                <em className={styles.systemEm}>{t.systemHeadlineLine2.split(" ")[0]}</em>
                {" " + t.systemHeadlineLine2.split(" ").slice(1).join(" ")}
              </span>
            </h2>
            <div className={styles.systemHeaderLine} aria-hidden="true" />
            <p>{t.systemBody}</p>
          </motion.div>

          <div className={styles.systemTimeline}>
            <div className={styles.systemTimelineLine} aria-hidden="true" />
            <div className={styles.systemSteps}>
              {operatingSteps.map((step, i) => (
                <motion.article
                  key={step.number}
                  className={styles.systemStep}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className={styles.systemStepOrb}>
                    <motion.div
                      className={styles.systemStepIcon}
                      whileHover={{ scale: 1.06 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    >
                      <img src={step.iconSrc} alt={t[step.titleKey]} className={styles.systemStepHologram} />
                    </motion.div>
                  </div>
                  <h3>{t[step.titleKey]}</h3>
                  <div className={styles.systemStepAccent} aria-hidden="true" />
                  <p>{t[step.descKey]}</p>
                </motion.article>
              ))}
            </div>
          </div>

          <div className={styles.systemHighlights}>
            {operatingHighlights.map((item, index) => (
              <motion.article
                key={item.titleKey}
                className={index < operatingHighlights.length - 1 ? `${styles.systemHighlight} ${styles.hasDivider}` : styles.systemHighlight}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: index * 0.1 }}
                whileHover={{ x: 6, transition: { duration: 0.2 } }}
              >
                <motion.div className={styles.systemHighlightIcon} whileHover={{ scale: 1.2, rotate: 10 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                  {item.icon}
                </motion.div>
                <div>
                  <h4>{t[item.titleKey]}</h4>
                  <p>{t[item.descKey]}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>


      <section className={styles.marketsSection}>
        <div className="shell">
          <div className={styles.marketsStage}>
            <div className={styles.marketsRobotAccent} aria-hidden="true">
              <Image
                src="/markets-robot-right.png"
                alt=""
                width={538}
                height={744}
                sizes="(max-width: 960px) 0px, 280px"
                className={styles.marketsRobotImage}
              />
            </div>

            <div className={styles.marketsGrid}>
              <div className={styles.marketsContent}>
                <div className={styles.marketsBrand}>
                  <Image
                    src="/logo.png"
                    alt="Drokex"
                    width={550}
                    height={144}
                    sizes="(max-width: 720px) 220px, 320px"
                    className={styles.marketsBrandLogo}
                  />
                  <p>{t.marketsGrow}</p>
                </div>

                <div className={styles.marketsInteractive}>
                  <div className={styles.marketsRail} role="tablist" aria-label={t.ariaMarkets}>
                    {globalMarkets.map((market, index) => (
                      <button
                        key={market.id}
                        type="button"
                        className={activeMarket === index ? `${styles.marketFlag} ${styles.isActive}` : styles.marketFlag}
                        onClick={() => { setActiveMarket(index); marketPausedRef.current = true; setTimeout(() => { marketPausedRef.current = false; }, 6000); }}
                        aria-selected={activeMarket === index}
                        role="tab"
                      >
                        <span aria-hidden="true">{market.flag}</span>
                        <span className="sr-only">{market.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className={styles.marketsScene}>
                    <div className={styles.marketsGlow} aria-hidden="true" />
                    <div className={styles.marketsPattern} aria-hidden="true" />

                    <div className={styles.marketsCards} aria-hidden="true">
                      {globalMarkets.map((market, index) => {
                        const offset = getWrappedOffset(index, activeMarket, globalMarkets.length);
                        const hidden = Math.abs(offset) > 1;

                        return (
                          <article
                            key={market.id}
                            className={offset === 0 ? `${styles.marketCard} ${styles.isActive}` : styles.marketCard}
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
                            <div className={styles.marketCardFrame}>
                              <div className={styles.marketCardPhoto}>
                                <Image
                                  src={market.portrait}
                                  alt={market.seller}
                                  width={736}
                                  height={1103}
                                  sizes="240px"
                                  className={styles.marketCardPortrait}
                                />
                                <div className={styles.marketAvatarRing}>
                                  <span>{market.badge}</span>
                                </div>
                                <div className={styles.marketCardCopy}>
                                  <strong>{market.seller}</strong>
                                  <span>{market.role}</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                className={styles.marketCardAction}
                                onClick={() => handleMarketContact(market)}
                              >
                                Contáctame ahora
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>

                    <div
                      key={`${currentMarket.id}-pill`}
                      className={styles.marketOrderPill}
                      style={{ "--market-pill-accent": currentMarket.accent }}
                    >
                      <span className={styles.marketOrderFlag} aria-hidden="true">
                        {currentMarket.flag}
                      </span>
                      <span className={styles.marketOrderCopy}>
                        <strong>{currentMarket.orderLabel}</strong>
                        <span>{currentMarket.orderAmount}</span>
                      </span>
                    </div>

                  </div>
                </div>

                <div key={`${currentMarket.id}-copy`} className={styles.marketsCopy}>
                  <h3>{currentMarket.headline}</h3>
                  <p>{currentMarket.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo ticker strip */}
      <div className={styles.logoTickerStrip}>
        <p className={styles.logoTickerTitle}>Trabajamos con los mejores para entregar <span>siempre</span></p>
        <div className={styles.logoTickerTrackWrap} aria-hidden="true">
          <div className={styles.logoTickerTrack}>
            {["black","green","black","green","black","green","black","green","black","green","black","green","black","green","black","green"].map((variant, i) => (
              <img key={i} src={`/partner-logo-drokex-${variant}.png`} alt="Drokex" className={styles.logoTickerItem} />
            ))}
          </div>
        </div>
      </div>

      <section className={styles.platformSection} id="plataforma">
        <div className="shell">
          <motion.div className={styles.platformHeaderCenter} {...fadeUp(0)}>
            <p className={`section-tag ${styles.sectionTagDark}`}>{t.platformTag}</p>
            <h2>{t.platformHeading}</h2>
          </motion.div>

          {/* Drag carousel */}
          <div className={styles.pfCardWrap} ref={pfCardRef}>
            {/* Left arrow hint */}
            <button
              className={`${styles.pfDragArrow} ${styles.pfDragArrowLeft}${platformActive === 0 ? ` ${styles.pfDragArrowHidden}` : ""}`}
              onClick={() => pfGoTo(platformActive - 1)}
              aria-label="Anterior"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg>
            </button>

            <div
              className={styles.pfCarouselViewport}
              ref={pfViewportRef}
            >
            <div className={styles.pfCarouselTrack}>
              {tabs.map((tab) => {
                const highlights = platformHighlights[tab.id] || [];
                const stats = tabStats[tab.id] || [];
                return (
                  <div key={tab.id} className={styles.pfCarouselSlide}>
                    <div className={styles.pfGrid}>
                      {/* Copy */}
                      <div className={styles.pfCopyWrap}>
                        <div className={styles.pfCopy}>
                          <p className={`${styles.pfEditorialLabel} ${variantClass("pfEditorialLabel", tab.id)}`}>{tab.label}</p>
                          <h3 className={styles.pfTitle}>{tab.title}</h3>
                          <p className={styles.pfDesc}>{tab.description}</p>
                          <ul className={`${styles.fanFeatures} ${styles.pfFeats}`}>
                            {highlights.map((h) => (
                              <li key={h}>
                                <svg viewBox="0 0 24 24" fill="none" width="17" height="17" className={`${styles.pfCheck} ${variantClass("pfCheck", tab.id)}`} aria-hidden="true">
                                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
                                  <polyline points="9 12 11 14 15 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {/* Featured card */}
                      <div className={styles.pfMedia}>
                        <div className={`${styles.pfFeatured} ${variantClass("pfFeatured", tab.id)}`}>
                          <div className={styles.pfFeaturedMap} aria-hidden="true">
                            <img src="/world.svg" alt="" />
                          </div>
                          <div className={styles.pfFeaturedInner}>
                            <div className={styles.pfStatChips}>
                              {stats.map((stat) => (
                                <div key={stat.label} className={`${styles.pfStatChip} ${variantClass("pfStatChip", tab.id)}`}>
                                  <div className={styles.pfStatChipIcon} aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="15" height="15">
                                      <path d={stat.iconPath} />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className={styles.pfStatChipLabel}>{stat.label}</p>
                                    <p className={`${styles.pfStatChipValue} ${variantClass("pfStatChipValue", tab.id)}`}>{stat.value}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className={styles.pfFeaturedMedia}>
                              <video src={tab.video} autoPlay muted loop playsInline className={styles.pfFeaturedVideo} />
                            </div>
                          </div>
                          <div className={`${styles.pfFeaturedGlow} ${variantClass("pfFeaturedGlow", tab.id)}`} aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

            {/* Right arrow hint */}
            <button
              className={`${styles.pfDragArrow} ${styles.pfDragArrowRight}${platformActive === tabs.length - 1 ? ` ${styles.pfDragArrowHidden}` : ""}`}
              onClick={() => pfGoTo(platformActive + 1)}
              aria-label="Siguiente"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="18" height="18"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>{/* /pfCardWrap */}

          {/* Navigation dots */}
          <div className={styles.pfCarouselDots}>
            {tabs.map((tab, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.pfCarouselDot}${i === platformActive ? ` ${styles.pfCarouselDotActive} ${variantClass("pfCarouselDot", tab.id)}` : ""}`}
                onClick={() => pfGoTo(i)}
                aria-label={tab.label}
              />
            ))}
          </div>

          {/* Flow bar */}
          <div className={styles.pfFlowBar}>
            {platformFlowSteps.map((step, i) => (
              <div key={step.num} className={styles.pfFlowRow}>
                <div className={styles.pfFlowStep}>
                  <div className={styles.pfFlowIcon} aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="22" height="22">
                      <path d={step.iconPath} />
                    </svg>
                  </div>
                  <div className={styles.pfFlowText}>
                    <span className={styles.pfFlowNum}>{step.num} {step.title}</span>
                    <span className={styles.pfFlowDesc}>{step.desc}</span>
                  </div>
                </div>
                {i < platformFlowSteps.length - 1 && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" className={styles.pfFlowArrow} aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.testimonialsSection}>
        <div className="shell">
          <motion.div className={styles.testimonialsHeader} {...fadeUp(0)}>
            <p className="section-tag">{t.testimonialsTag}</p>
            <h2>{t.testimonialsHeadlinePre}<span>Drokex</span></h2>
            <p>{t.testimonialsBody}</p>
          </motion.div>
        </div>

        {/* Full-width card stage */}
        <div className={styles.tcStage}>
          <button type="button" className={styles.tcArrow} onClick={previousVideo} aria-label={t.ariaVideoPrev}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className={styles.tcTrack}>
            {videos.map((video, i) => {
              const off = getTestiOffset(i);
              const absOff = Math.abs(off);
              const isActive = off === 0;
              const TC_POS = {
                "-2": { x: -460, scale: 0.62, opacity: 0.38, zIndex: 1 },
                "-1": { x: -248, scale: 0.80, opacity: 0.70, zIndex: 3 },
                "0":  { x: 0,    scale: 1,    opacity: 1,    zIndex: 5 },
                "1":  { x: 248,  scale: 0.80, opacity: 0.70, zIndex: 3 },
                "2":  { x: 460,  scale: 0.62, opacity: 0.38, zIndex: 1 },
              };
              const pos = TC_POS[String(off)] ?? { x: off < 0 ? -660 : 660, scale: 0.45, opacity: 0, zIndex: 0 };
              const TC_ICONS = ["M22 7 13.5 15.5 8.5 10.5 2 17M16 7h6v6", "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z", null, "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", "M13 2 3 14h9l-1 8 10-12h-9l1-8z"];

              return (
                <motion.div
                  key={video.src}
                  className={`${styles.tcCard}${isActive ? " " + styles.tcCardActive : ""}`}
                  animate={{ x: pos.x, scale: pos.scale, opacity: pos.opacity }}
                  transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  style={{ zIndex: pos.zIndex, cursor: isActive ? "default" : "pointer" }}
                  onClick={() => !isActive && setCurrentVideo(i)}
                >
                  <img src={video.src} alt={video.name} className={styles.tcImg} />
                  <div className={styles.tcOverlay} />

                  {/* Icon badge top-left (non-active cards) */}
                  {!isActive && TC_ICONS[i] && (
                    <div className={styles.tcIconWrap} aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15">
                        <path d={TC_ICONS[i]} />
                      </svg>
                    </div>
                  )}

                  {/* DESTACADO badge on active */}
                  {isActive && <span className={styles.tcBadge}>DESTACADO</span>}

                  {/* Quote + person info */}
                  <div className={`${styles.tcContent}${isActive ? " " + styles.tcContentActive : ""}`}>
                    {isActive && <span className={styles.tcQuoteMark} aria-hidden="true">"</span>}
                    <p className={styles.tcQuote}>{video.quote}</p>
                    <div className={styles.tcPerson}>
                      <strong>{video.name}</strong>
                      <span>{video.role}</span>
                    </div>
                  </div>

                  {/* Play button on active */}
                  {isActive && (
                    <button
                      type="button"
                      className={styles.testiPlayBtn}
                      onClick={() => setOpenVideo(video)}
                      aria-label={`${t.ariaVideoPlay} ${video.name}`}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>

          <button type="button" className={styles.tcArrow} onClick={nextVideo} aria-label={t.ariaVideoNext}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Progress dots */}
        <div className={styles.tcDots}>
          {videos.map((_, i) => (
            <button
              key={i}
              className={`${styles.tcDot}${i === currentVideo ? " " + styles.tcDotActive : ""}`}
              onClick={() => setCurrentVideo(i)}
              aria-label={videos[i].name}
            />
          ))}
        </div>
      </section>

      {openVideo ? (
        <div className={styles.videoModal} role="dialog" aria-modal="true" aria-label={`${t.ariaVideoPlay} ${openVideo.name}`}>
          <button type="button" className={styles.videoModalBackdrop} onClick={() => setOpenVideo(null)} aria-label={t.ariaModalClose} />
          <div className={styles.videoModalPanel}>
            <button type="button" className={styles.videoModalClose} onClick={() => setOpenVideo(null)} aria-label={t.ariaModalClose}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="18" height="18">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <iframe
              className={styles.videoModalPlayer}
              src={openVideo.embedUrl}
              title={`${t.ariaVideoPlay} ${openVideo.name}`}
              allow="autoplay; fullscreen"
              allowFullScreen
            />
            <div className={styles.videoModalFooter}>
              <p className={styles.videoModalName}>{openVideo.name}</p>
              <span className={styles.videoModalRole}>{openVideo.role}</span>
            </div>
          </div>
        </div>
      ) : null}

      {false && <section className={styles.contactSection} id="contacto">
        <div className={`shell ${styles.contactGrid}`}>
          <motion.div className={styles.contactCard} {...fadeLeft(0)}>
            <h3>{t.contactFormHeading}</h3>

            <form className={styles.contactForm} onSubmit={handleContactSubmit}>
              <input
                type="text"
                placeholder={t.contactPlaceholderName}
                value={contactForm.name}
                onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
              <input
                type="email"
                placeholder={t.contactPlaceholderEmail}
                value={contactForm.email}
                onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
              <div className={styles.contactSelectWrap}>
                <select
                  value={contactForm.subject}
                  onChange={(e) => setContactForm((f) => ({ ...f, subject: e.target.value }))}
                >
                  <option value="" disabled>
                    {t.contactSelectDefault}
                  </option>
                  <option value="Ventas">{t.contactOptionSales}</option>
                  <option value="Soporte">{t.contactOptionSupport}</option>
                  <option value="Alianzas">{t.contactOptionAlliances}</option>
                </select>
              </div>
              <textarea
                rows={4}
                placeholder={t.contactPlaceholderMessage}
                value={contactForm.message}
                onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                required
              />
              {contactStatus === "sent" && (
                <p style={{ color: "#7FE040", fontSize: "0.9rem" }}>{t.contactMsgSent}</p>
              )}
              {contactStatus === "error" && (
                <p style={{ color: "#ef4444", fontSize: "0.9rem" }}>{t.contactMsgError}</p>
              )}
              <button type="submit" className={styles.submitButton} disabled={contactStatus === "sending"}>
                {contactStatus === "sending" ? t.contactBtnSending : t.contactBtnSend}
              </button>
            </form>
          </motion.div>

          <motion.div className={styles.contactCopy} {...fadeRight(0.15)}>
            <p className={`section-tag ${styles.sectionTagGreen}`}>{t.contactSectionTag}</p>
            <h2>
              <span>{t.contactHeadline1}</span>
              <span>{t.contactHeadline2}</span>
              <span>{t.contactHeadline3}</span>
            </h2>
            <div className={styles.contactList}>
              <p>contacto@drokex.com</p>
              <p>+57 311 531 2623</p>
              <p>Bogota, Colombia</p>
            </div>
            <a
              href="https://wa.me/573115312623?text=Hola%2C%20quiero%20hablar%20con%20Drokex"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappLink}
            >
              {t.contactWhatsApp}
            </a>
          </motion.div>

          <div className={styles.contactRobot} aria-hidden="true">
            <Image
              src="/robot-contact.png"
              alt=""
              width={1344}
              height={1771}
              sizes="(max-width: 1180px) 0px, 22vw"
              className={styles.contactRobotImage}
            />
          </div>
        </div>
      </section>}

      {/* Market contact modals */}
      {marketChatState === "auth-wall" && (
        <div className={qfStyles.qfOverlay} onClick={e => e.target === e.currentTarget && setMarketChatState("idle")}>
          <div className={awStyles.awModal}>
            <button className={qfStyles.qfClose} onClick={() => setMarketChatState("idle")} aria-label="Cerrar">×</button>
            <div className={awStyles.awIcon}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
            <h3 className={awStyles.awTitle}>Inicia el chat con el proveedor</h3>
            <p className={awStyles.awSubtitle}>Para contactar directamente con el proveedor necesitas una cuenta en Drokex. Es gratis y toma menos de un minuto.</p>
            <div className={awStyles.awActions}>
              <a href="/registro" className={awStyles.awBtnPrimary}>Crear cuenta gratis</a>
              <a href="/login" className={awStyles.awBtnSecondary}>Ya tengo cuenta</a>
            </div>
            <p className={awStyles.awFooter}>Proveedores verificados · Negociación segura · LATAM</p>
          </div>
        </div>
      )}


      {/* Drokex World Banner */}
      <Link href="/drokex-world" className={styles.dwBannerImgLink}>
        <Image src="/banner-drokex-world.png" alt="Explorar Drokex World" width={1920} height={280} className={styles.dwBannerImg} priority={false} />
      </Link>

      <SiteFooter />
    </main>
  );
}

function BackgroundMap({ side }) {
  return (
    <div
      className={side === "left" ? `${styles.systemMap} ${styles.systemMapLeft}` : `${styles.systemMap} ${styles.systemMapRight}`}
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
