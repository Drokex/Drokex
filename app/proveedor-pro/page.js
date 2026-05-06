"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import SiteHeader from "@/app/components/site-header";
import LandingPreview, { hexToRgba as _hexToRgba } from "@/app/components/landing-preview";

const VALID_CODE = "15472007";

const hexToRgba = _hexToRgba;
const PRO_FRAME_COUNT = 72;
const PRO_FRAME_BASE = "/proveedor-pro-frames";

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ScrollFrameSequence({ alt, children }) {
  const [frameIndex, setFrameIndex] = useState(0);
  const frameRef = useRef(null);
  const targetRef = useRef(0);
  const visibleRef = useRef(0);

  const getFrameSrc = (index) => `${PRO_FRAME_BASE}/frame-${String(index).padStart(3, "0")}.jpg`;

  useEffect(() => {
    const preloadFrames = [];
    for (let index = 0; index < PRO_FRAME_COUNT; index += 1) {
      const img = new Image();
      img.src = getFrameSrc(index);
      preloadFrames.push(img);
    }
  }, []);

  const animateTowardTarget = () => {
    const diff = targetRef.current - visibleRef.current;
    visibleRef.current += diff * 0.24;

    const nextFrame = Math.round(visibleRef.current);
    setFrameIndex((current) => (current === nextFrame ? current : nextFrame));

    if (Math.abs(diff) > 0.04) {
      frameRef.current = requestAnimationFrame(animateTowardTarget);
    } else {
      visibleRef.current = targetRef.current;
      setFrameIndex(Math.round(targetRef.current));
      frameRef.current = null;
    }
  };

  const handleWheel = (event) => {
    event.preventDefault();

    targetRef.current = Math.min(
      PRO_FRAME_COUNT - 1,
      Math.max(0, targetRef.current + event.deltaY * 0.075),
    );

    if (!frameRef.current) {
      frameRef.current = requestAnimationFrame(animateTowardTarget);
    }
  };

  useEffect(() => () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div
      onWheel={handleWheel}
      style={{ position: "relative", overflow: "hidden" }}
    >
      <img
        src={getFrameSrc(frameIndex)}
        alt={alt}
        draggable={false}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", userSelect: "none" }}
      />
      {children}
    </div>
  );
}

export default function ProveedorProPage({
  initialIsPro = false,
  initialStore = null,
  initialProducts = null,
  initialSlug = "",
  accountMode = false,
}) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isPro, setIsPro] = useState(initialIsPro);
  const [authStatus, setAuthStatus] = useState(accountMode ? "ready" : "checking");
  const [openSection, setOpenSection] = useState("hero");
  const [showProductsDrawer, setShowProductsDrawer] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const countryDropdownRef = useRef(null);
  const countryBtnRef = useRef(null);
  const logoInputRef = useRef(null);
  const [countryDropdownPos, setCountryDropdownPos] = useState({ top: 0, right: 0 });
  const [previewPage, setPreviewPage] = useState("home");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [landingLink, setLandingLink] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [error, setError] = useState("");
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const [store, setStore] = useState({
    brand: "Muebles del Sur",
    countries: [],
    logo: "",
    heroTitle: "Diseño premium para hogares modernos",
    heroSubtitle:
      "Muebles elegantes, cómodos y listos para transformar cualquier espacio.",
    heroImage: "",
    ctaText: "Comprar colección",
    secondaryCtaText: "Conocer marca",
    promoText: "Nueva colección 2026",
    headerCtaText: "Comprar",
    trustEyebrow: "Vitrina activa",
    trustText:
      "Compra directa, identidad propia y productos listos para compartir con clientes.",
    stockLabel: "Stock",
    stockValue: "Local",
    partner1: "Apple",
    partner2: "Microsoft",
    partner3: "Google",
    partner4: "Zoho",
    searchTitle: "Busca productos",
    searchPlaceholder: "Buscar en esta tienda...",
    searchButtonText: "Buscar",
    aboutTitle: "Una marca pensada para espacios con estilo",
    aboutText:
      "Creamos productos funcionales, modernos y de alta calidad para hogares que buscan diseño y comodidad.",
    bannerSecondary: "",
    benefit1: "Stock disponible en Colombia",
    benefit1Text: "Una razón clara para confiar en la marca antes de comprar.",
    benefit2: "Envíos rápidos y seguros",
    benefit2Text: "Entrega una promesa comercial concreta y fácil de entender.",
    benefit3: "Garantía directa del proveedor",
    benefit3Text: "Refuerza seguridad, respaldo y decisión de compra.",
    catalogEyebrow: "Catálogo",
    catalogTitle: "Productos destacados",
    catalogText:
      "Selecciona, cotiza o compra productos directamente desde la vitrina del proveedor.",
    productCtaText: "Agregar al carrito",
    finalEyebrow: "Listo para comprar",
    finalTitle: "Descubre la colección de Muebles del Sur",
    finalCtaText: "Ver catálogo",
    catalogPdf: "",
    primaryColor: "#ff9f2e",
    backgroundColor: "#fff7fb",
    surfaceColor: "#ffffff",
    textColor: "#191421",
    mutedTextColor: "#6f6477",
    buttonTextColor: "#ffffff",
    gradientFromColor: "#b86cff",
    gradientToColor: "#ff7db8",
    nav1: "Inicio",
    nav2: "Productos",
    nav3: "Marca",
    heroTitleSize: 60,
    heroTitleColor: "",
    heroSubtitleSize: 18,
    heroSubtitleColor: "",
    aboutTitleSize: 36,
    aboutTitleColor: "",
    aboutBodySize: 16,
    aboutBodyColor: "",
  });

  const [products, setProducts] = useState([
    {
      name: "Sofá Modular Premium",
      price: "1890000",
      stock: "12",
      image: "",
      description: "Sofá moderno con acabados premium.",
      category: "Sala",
    },
  ]);

  useEffect(() => {
    if (initialStore) {
      setStore((current) => ({ ...current, ...initialStore }));
    }

    if (Array.isArray(initialProducts) && initialProducts.length > 0) {
      setProducts(initialProducts);
    }

    if (initialSlug && typeof window !== "undefined") {
      setLandingLink(`${window.location.origin}/proveedor-pro/tienda/${initialSlug}`);
    }
  }, [initialStore, initialProducts, initialSlug]);

  useEffect(() => {
    if (accountMode) return;

    let active = true;

    async function verifyAccount() {
      try {
        const response = await fetch("/api/account", { cache: "no-store" });

        if (!response.ok) {
          router.replace(`/login?role=proveedor&next=${encodeURIComponent("/proveedor-pro")}`);
          return;
        }

        if (active) setAuthStatus("ready");
      } catch {
        if (active) setAuthStatus("ready");
      }
    }

    verifyAccount();

    return () => {
      active = false;
    };
  }, [accountMode, router]);

  useEffect(() => {
    if (!showCountryDropdown) return;
    const close = (e) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target)) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [showCountryDropdown]);

  function activatePro() {
    if (authStatus !== "ready") return;

    if (code === VALID_CODE) {
      setIsPro(true);
      setError("");
    } else {
      setError("Código inválido. Usa el código de prueba correcto.");
    }
  }

  function updateStore(field, value) {
    setStore((current) => {
      const nextStore = { ...current, [field]: value };

      if (
        field === "brand" &&
        current.finalTitle === `Descubre la colección de ${current.brand}`
      ) {
        nextStore.finalTitle = `Descubre la colección de ${value}`;
      }

      return nextStore;
    });
  }

  function addProduct() {
    setProducts([
      ...products,
      {
        name: "",
        price: "",
        stock: "",
        image: "",
        description: "",
        category: "",
      },
    ]);
  }

  function updateProduct(index, field, value) {
    const copy = [...products];
    copy[index] = { ...copy[index], [field]: value };
    setProducts(copy);
  }

  async function createLanding() {
    const slug = slugify(store.brand) || "mi-tienda";
    const link = `/proveedor-pro/tienda/${slug}`;

    if (!store.countries?.length) {
      setError("Selecciona al menos un país antes de publicar.");
      return;
    }
    setIsPublishing(true);
    setError("");

    try {
      const res = await fetch("/api/proveedor-pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, store, products }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "api");
      }
      try { window.localStorage.setItem(`drokex-proveedor-pro:${slug}`, JSON.stringify({ store, products })); } catch {}
      setLandingLink(`${window.location.origin}${link}`);
      setCopiedLink(false);
      setError("");
      setIsPublishing(false);
      setPublishSuccess(true);
      setTimeout(() => { setPublishSuccess(false); router.push(link); }, 1800);
    } catch (err) {
      setIsPublishing(false);
      setError(err.message === "api" ? "No se pudo guardar. Verifica tu conexión e intenta de nuevo." : (err.message || "No se pudo guardar."));
    }
  }

  async function copyLandingLink() {
    if (!landingLink) return;

    await navigator.clipboard?.writeText(landingLink);
    setCopiedLink(true);
  }

  return (
    <main className="min-h-screen bg-white text-[#111]">
      <SiteHeader hideCountry={isPro} />

      {authStatus === "checking" ? (
        <section className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-white px-6 text-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2ea600]">
              Proveedor Pro
            </p>
            <h1 className="mt-3 text-3xl font-black text-[#111]">Validando tu cuenta...</h1>
            <p className="mt-2 text-sm text-[#666]">Para activar este servicio necesitas iniciar sesión.</p>
          </div>
        </section>
      ) : !isPro ? (
        <section style={{ display: "grid", gridTemplateColumns: "420px 1fr", minHeight: "calc(100vh - 80px)", background: "#ffffff" }}>
          {/* Left: text + plan + form */}
          <div style={{ padding: "64px 40px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 24, background: "#ffffff" }}>
            <span style={{ display: "inline-block", background: "rgba(46,166,0,0.1)", color: "#2ea600", fontSize: "0.7rem", fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 6, border: "1px solid rgba(46,166,0,0.25)", alignSelf: "flex-start" }}>
              Proveedor Pro
            </span>

            <h1 style={{ fontSize: "clamp(1.35rem, 2vw, 1.9rem)", fontWeight: 700, lineHeight: 1.25, margin: 0, color: "#111", letterSpacing: "-0.01em" }}>
              Crea tu tienda premium<br />dentro de{" "}
              <span style={{ color: "#2ea600" }}>Drokex</span>
            </h1>

            <p style={{ color: "#666", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>
              Activa el modo Pro para construir una landing personalizada, subir banners, productos, textos comerciales y vender directo.
            </p>

            <div style={{ borderRadius: 24, border: "1px solid rgba(46,166,0,0.25)", background: "rgba(46,166,0,0.06)", padding: "24px" }}>
              <p style={{ margin: 0, color: "#888", fontSize: "0.82rem" }}>Plan demo</p>
              <h2 style={{ margin: "8px 0 0", fontSize: "2.4rem", fontWeight: 900, color: "#2ea600", lineHeight: 1 }}>$99.000 COP</h2>
              <p style={{ margin: "8px 0 0", color: "#999", fontSize: "0.82rem" }}>Simulación para validar experiencia.</p>
            </div>

            <div style={{ borderRadius: 24, border: "1px solid rgba(0,0,0,0.1)", background: "#f7f7f7", padding: "28px" }}>
              <h2 style={{ margin: "0 0 20px", fontSize: "1.3rem", fontWeight: 900, color: "#111" }}>Adquiere Proveedor Pro</h2>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Código de activación"
                style={{ width: "100%", borderRadius: 14, border: "1px solid rgba(0,0,0,0.15)", background: "#fff", color: "#111", padding: "14px 18px", fontSize: "0.92rem", outline: "none", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = "#2ea600"}
                onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.15)"}
              />
              {error && <p style={{ margin: "8px 0 0", color: "#dc2626", fontSize: "0.82rem" }}>{error}</p>}
              <button
                onClick={activatePro}
                style={{ marginTop: 14, width: "100%", borderRadius: 14, background: "#2ea600", color: "#fff", fontWeight: 900, fontSize: "1rem", padding: "14px", border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(46,166,0,0.3)" }}
              >
                Activar plan Pro
              </button>
              <p style={{ margin: "12px 0 0", textAlign: "center", color: "#aaa", fontSize: "0.75rem" }}>Código demo: 15472007</p>
            </div>
          </div>

          {/* Right: scroll-controlled frame sequence */}
          <ScrollFrameSequence alt="Drokex Proveedor Pro">
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(3,5,3,0.75) 0%, rgba(3,5,3,0.1) 50%)" }} />
          </ScrollFrameSequence>
        </section>
      ) : isPreviewMode ? (
        <section className="bg-[#050705] px-4 py-6 sm:px-6 lg:px-10">
          <div className="mx-auto mb-5 flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#59ff35]">
                Previsualizacion
              </p>
              <h2 className="mt-1 text-2xl font-black">
                Landing completa de {store.brand}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setIsPreviewMode(false)}
              className="rounded-2xl border border-white/15 px-5 py-3 font-black text-white transition hover:border-[#59ff35] hover:text-[#59ff35]"
            >
              Volver a editar
            </button>
          </div>

          <LandingPreview store={store} products={products} fullWidth />
        </section>
      ) : (
        <section className="relative min-h-[calc(100vh-80px)]" style={{ backgroundColor: store.backgroundColor }}>
          <div
            style={{
              position: "sticky",
              top: 80,
              zIndex: 70,
              display: "flex",
              justifyContent: "center",
              padding: "12px 18px",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: "min(1120px, 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 18,
                background: "rgba(255,255,255,0.88)",
                boxShadow: "0 18px 48px rgba(0,0,0,0.16)",
                backdropFilter: "blur(18px)",
                padding: "8px 10px",
                pointerEvents: "auto",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = ev => updateStore("logo", ev.target.result);
                    reader.readAsDataURL(file);
                  }}
                />
                <button
                  type="button"
                  title={store.logo ? "Cambiar logo" : "Subir logo"}
                  onClick={() => logoInputRef.current?.click()}
                  style={{ width: 72, height: 72, borderRadius: 16, background: store.logo ? "transparent" : store.primaryColor, color: store.buttonTextColor, display: "grid", placeItems: "center", fontWeight: 950, flexShrink: 0, border: store.logo ? "1.5px solid rgba(0,0,0,0.08)" : "none", boxShadow: store.logo ? "none" : `0 4px 12px ${store.primaryColor}55`, cursor: "pointer", overflow: "hidden", position: "relative" }}
                  onMouseEnter={e => { e.currentTarget.lastChild.style.opacity = "1"; }}
                  onMouseLeave={e => { e.currentTarget.lastChild.style.opacity = "0"; }}
                >
                  {store.logo
                    ? <img src={store.logo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>}
                  <span style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "grid", placeItems: "center", opacity: 0, transition: "opacity 0.15s" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  </span>
                </button>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, color: "#111", fontSize: "0.86rem", fontWeight: 950, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{store.brand}</p>
                  <p style={{ margin: 0, color: "#777", fontSize: "0.72rem" }}>Editando landing Pro</p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                {error && <span style={{ color: "#b91c1c", fontSize: "0.74rem", fontWeight: 800 }}>{error}</span>}
                {(() => {
                  const COUNTRIES = [
                    { label: "Nicaragua", flag: "🇳🇮" },
                    { label: "Honduras", flag: "🇭🇳" },
                    { label: "Guatemala", flag: "🇬🇹" },
                    { label: "El Salvador", flag: "🇸🇻" },
                    { label: "República Dominicana", flag: "🇩🇴" },
                    { label: "Colombia", flag: "🇨🇴" },
                    { label: "Perú", flag: "🇵🇪" },
                    { label: "México", flag: "🇲🇽" },
                  ];
                  const selected = store.countries || [];
                  const toggle = (label) => {
                    const next = selected.includes(label)
                      ? selected.filter(l => l !== label)
                      : [...selected, label];
                    updateStore("countries", next);
                  };
                  const label = selected.length === 0
                    ? "🌎 Países"
                    : selected.length === 1
                      ? `${COUNTRIES.find(c => c.label === selected[0])?.flag} ${selected[0]}`
                      : `🌎 ${selected.length} países`;
                  return (
                    <div ref={countryDropdownRef} style={{ position: "relative" }}>
                      <button
                        ref={countryBtnRef}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!showCountryDropdown && countryBtnRef.current) {
                            const r = countryBtnRef.current.getBoundingClientRect();
                            setCountryDropdownPos({ top: r.bottom + 6, right: window.innerWidth - r.right });
                          }
                          setShowCountryDropdown(v => !v);
                        }}
                        style={{ borderRadius: 13, border: `1px solid ${selected.length ? "rgba(0,0,0,0.1)" : "rgba(34,196,0,0.5)"}`, background: selected.length ? "#fff" : "rgba(34,196,0,0.06)", color: "#111", fontWeight: 900, padding: "10px 13px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", whiteSpace: "nowrap" }}
                      >
                        <span>{label}</span>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.4, flexShrink: 0 }}>
                          <path d="M2 3.5L5 6.5L8 3.5" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      {showCountryDropdown && typeof document !== "undefined" && createPortal(
                        <div
                          onMouseDown={e => e.stopPropagation()}
                          onClick={e => e.stopPropagation()}
                          style={{ position: "fixed", top: countryDropdownPos.top, right: countryDropdownPos.right, zIndex: 99999, background: "#fff", borderRadius: 14, boxShadow: "0 12px 36px rgba(0,0,0,0.14)", border: "1px solid rgba(0,0,0,0.08)", overflow: "hidden", minWidth: 210 }}
                        >
                          <p style={{ margin: 0, padding: "10px 14px 6px", fontSize: "0.7rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "#aaa" }}>Selecciona los países</p>
                          {COUNTRIES.map(c => {
                            const active = selected.includes(c.label);
                            return (
                              <button
                                key={c.label}
                                type="button"
                                onClick={(e) => { e.stopPropagation(); toggle(c.label); }}
                                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", background: active ? "rgba(34,196,0,0.07)" : "transparent", border: "none", cursor: "pointer", fontSize: "0.88rem", fontWeight: active ? 900 : 600, color: "#111", textAlign: "left" }}
                              >
                                <span style={{ fontSize: "1.1rem" }}>{c.flag}</span>
                                <span style={{ flex: 1 }}>{c.label}</span>
                                <span style={{ width: 18, height: 18, borderRadius: 6, border: `2px solid ${active ? "#22c400" : "rgba(0,0,0,0.15)"}`, background: active ? "#22c400" : "transparent", display: "grid", placeItems: "center", flexShrink: 0 }}>
                                  {active && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                </span>
                              </button>
                            );
                          })}
                        </div>,
                        document.body
                      )}
                    </div>
                  );
                })()}
                <button type="button" onClick={() => { setShowProductsDrawer((open) => !open); setOpenSection(null); }}
                  style={{ borderRadius: 13, border: "1px solid rgba(0,0,0,0.1)", background: showProductsDrawer ? "#111" : "#fff", color: showProductsDrawer ? "#fff" : "#111", fontWeight: 900, padding: "10px 13px", cursor: "pointer" }}>
                  Productos · {products.length}
                </button>
                <button type="button" onClick={() => { setOpenSection((s) => s === "style" ? null : "style"); setShowProductsDrawer(false); }}
                  style={{ borderRadius: 13, border: "1px solid rgba(0,0,0,0.1)", background: openSection === "style" ? "#111" : "#fff", color: openSection === "style" ? "#fff" : "#111", fontWeight: 900, padding: "10px 13px", cursor: "pointer" }}>
                  Colores
                </button>
                <button type="button" onClick={createLanding} disabled={isPublishing}
                  style={{ borderRadius: 13, border: "none", background: isPublishing ? "#aaa" : "#22c400", color: "#fff", fontWeight: 950, padding: "10px 16px", boxShadow: isPublishing ? "none" : "0 12px 28px rgba(34,196,0,0.28)", cursor: isPublishing ? "not-allowed" : "pointer", transition: "background 0.2s" }}>
                  {isPublishing ? "Publicando..." : "Publicar"}
                </button>
              </div>
            </div>
          </div>

          {landingLink && (
            <div style={{ position: "fixed", left: 22, bottom: 22, zIndex: 80, width: 300, borderRadius: 18, border: "1px solid rgba(34,196,0,0.3)", background: "rgba(255,255,255,0.92)", boxShadow: "0 18px 50px rgba(0,0,0,0.16)", padding: 14, backdropFilter: "blur(14px)" }}>
              <p style={{ margin: "0 0 6px", color: "#22a600", fontSize: "0.68rem", fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase" }}>Landing publicada</p>
              <a href={landingLink} style={{ display: "block", color: "#555", fontSize: "0.74rem", wordBreak: "break-all", marginBottom: 8 }}>{landingLink}</a>
              <button type="button" onClick={copyLandingLink} style={{ width: "100%", borderRadius: 11, border: "1px solid rgba(34,196,0,0.35)", background: "rgba(34,196,0,0.08)", color: "#159000", fontWeight: 950, padding: "8px 10px", cursor: "pointer" }}>
                {copiedLink ? "Copiado" : "Copiar link"}
              </button>
            </div>
          )}

          {showProductsDrawer && (
            <FloatingEditorCard title="Productos" onClose={() => setShowProductsDrawer(false)}>
              <Input label="Etiqueta de catalogo" value={store.catalogEyebrow} onChange={v => updateStore("catalogEyebrow", v)} />
              <Input label="Titulo de catalogo" value={store.catalogTitle} onChange={v => updateStore("catalogTitle", v)} />
              <Textarea label="Texto de catalogo" value={store.catalogText} onChange={v => updateStore("catalogText", v)} />
              <Input label="Boton de producto" value={store.productCtaText} onChange={v => updateStore("productCtaText", v)} />
              <p style={{ margin: "4px 0 0", fontSize: "0.68rem", fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.36)" }}>Tus productos</p>
              {products.map((product, index) => (
                <div key={index} style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                  <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 950, color: "#59ff35" }}>Producto {index + 1}</p>
                  <Input label="Nombre" value={product.name} onChange={v => updateProduct(index, "name", v)} />
                  <Input label="Categoria" value={product.category} onChange={v => updateProduct(index, "category", v)} />
                  <Input label="Precio" value={product.price} onChange={v => updateProduct(index, "price", v)} />
                  <Input label="Stock" value={product.stock} onChange={v => updateProduct(index, "stock", v)} />
                  <ImageUploader label="Imagen" value={product.image} onChange={v => updateProduct(index, "image", v)} />
                  <Textarea label="Descripcion" value={product.description} onChange={v => updateProduct(index, "description", v)} />
                </div>
              ))}
              <button onClick={addProduct} style={{ width: "100%", borderRadius: 14, border: "1px dashed rgba(89,255,53,0.48)", background: "rgba(89,255,53,0.08)", color: "#59ff35", fontWeight: 950, fontSize: "0.84rem", padding: "12px", cursor: "pointer" }}>
                + Agregar producto
              </button>
              <p style={{ margin: "4px 0 0", fontSize: "0.68rem", fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.36)" }}>Cierre final</p>
              <Input label="Etiqueta cierre final" value={store.finalEyebrow} onChange={v => updateStore("finalEyebrow", v)} />
              <Input label="Titulo cierre final" value={store.finalTitle} onChange={v => updateStore("finalTitle", v)} />
              <Input label="Boton cierre final" value={store.finalCtaText} onChange={v => updateStore("finalCtaText", v)} />
            </FloatingEditorCard>
          )}

          {openSection === "style" && (
            <FloatingEditorCard title="Colores y diseño" onClose={() => setOpenSection(null)}>
              <ColorInput label="Color principal" value={store.primaryColor} onChange={v => updateStore("primaryColor", v)} />
              <ColorInput label="Fondo de landing" value={store.backgroundColor} onChange={v => updateStore("backgroundColor", v)} />
              <ColorInput label="Color de secciones" value={store.surfaceColor} onChange={v => updateStore("surfaceColor", v)} />
              <ColorInput label="Texto principal" value={store.textColor} onChange={v => updateStore("textColor", v)} />
              <ColorInput label="Texto secundario" value={store.mutedTextColor} onChange={v => updateStore("mutedTextColor", v)} />
              <ColorInput label="Texto de botones" value={store.buttonTextColor} onChange={v => updateStore("buttonTextColor", v)} />
            </FloatingEditorCard>
          )}

          <LandingPreview
            store={store}
            products={products}
            isEditable
            standalone
            basePath=""
            productsOnly={previewPage === "products"}
            marcaOnly={previewPage === "marca"}
            onUpdate={(field, value) => {
              if (field === "__products__") setProducts(value);
              else if (field === "__nav__") setPreviewPage(value === "products" ? "products" : value === "marca" ? "marca" : "home");
              else updateStore(field, value);
            }}
          />
        </section>
      )}

      {isPublishing && (
        <>
          <style>{`@keyframes drokex-spin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.18)", backdropFilter: "blur(4px)" }}>
            <div style={{ background: "#fff", borderRadius: 22, padding: "36px 48px", textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", border: "4px solid #e5e5e5", borderTopColor: "#22c400", animation: "drokex-spin 0.8s linear infinite" }} />
              <p style={{ margin: 0, fontSize: "1.15rem", fontWeight: 900, color: "#111" }}>Publicando tu página...</p>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#888" }}>Esto solo tomará un momento</p>
            </div>
          </div>
        </>
      )}
      {publishSuccess && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.18)", backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: 22, padding: "36px 48px", textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#22c400", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: 900, color: "#111" }}>¡Publicada con éxito!</p>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "#666" }}>Redirigiendo a tu tienda...</p>
          </div>
        </div>
      )}
    </main>
  );
}

// LandingPreview, EditableText, ClickableImageZone → imported from @/app/components/landing-preview
function _LandingPreview_UNUSED({ store, products, fullWidth = false, isEditable = false, onUpdate }) {
  const primaryGlow = hexToRgba(store.primaryColor, 0.35);
  const primarySoft = hexToRgba(store.primaryColor, 0.16);

  return (
    <div
      className={`mx-auto overflow-hidden border border-white/10 ${
        fullWidth ? "max-w-7xl rounded-[2rem]" : "max-w-6xl rounded-[2rem]"
      }`}
      style={{
        backgroundColor: store.surfaceColor,
        color: store.textColor,
      }}
    >
      <header className="flex items-center justify-between border-b border-white/10 px-8 py-5">
        <div className="flex items-center gap-3">
          {store.logo ? (
            <img
              src={store.logo}
              alt={`${store.brand} logo`}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full font-black"
              style={{
                backgroundColor: store.primaryColor,
                color: store.buttonTextColor,
              }}
            >
              {store.brand.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="font-black">{store.brand}</h3>
            <p className="text-xs" style={{ color: store.mutedTextColor }}>
              {(store.countries?.length ? store.countries : store.country ? [store.country] : []).join(" · ")}
            </p>
          </div>
        </div>

        <nav className="hidden gap-6 text-sm md:flex" style={{ color: store.mutedTextColor }}>
          <a>Inicio</a>
          <a>Productos</a>
          <a>Marca</a>
          <a>Contacto</a>
        </nav>

      </header>

      <section
        className="relative min-h-[520px] bg-cover bg-center px-8 py-16"
        style={{
          backgroundColor: store.backgroundColor,
          backgroundImage: store.heroImage
            ? `url(${store.heroImage})`
            : `radial-gradient(circle at 75% 25%, ${primaryGlow}, transparent 35%)`,
        }}
      >
        {isEditable && (
          <ClickableImageZone
            value={store.heroImage}
            onUpload={v => onUpdate?.("heroImage", v)}
            isEditable={isEditable}
            style={{ position: "absolute", top: 12, right: 12, zIndex: 30, borderRadius: 12, overflow: "hidden", width: 44, height: 44, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(89,255,53,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#59ff35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </ClickableImageZone>
        )}
        <div
          className="max-w-3xl rounded-[2rem] p-6 backdrop-blur-[2px]"
          style={{ backgroundColor: hexToRgba(store.surfaceColor, 0.58) }}
        >
        <span
          className="rounded-full px-4 py-2 text-sm font-black"
          style={{
            backgroundColor: primarySoft,
            color: store.primaryColor,
          }}
        >
          {store.promoText}
        </span>

        <EditableText
          tag="h1" value={store.heroTitle}
          fontSize={store.heroTitleSize} fontColor={store.heroTitleColor || store.textColor}
          onTextChange={v => onUpdate?.("heroTitle", v)}
          onFontSizeChange={v => onUpdate?.("heroTitleSize", v)}
          onFontColorChange={v => onUpdate?.("heroTitleColor", v)}
          isEditable={isEditable}
          className="mt-8 max-w-3xl font-black leading-none"
        />

        <EditableText
          tag="p" value={store.heroSubtitle}
          fontSize={store.heroSubtitleSize} fontColor={store.heroSubtitleColor || store.mutedTextColor}
          onTextChange={v => onUpdate?.("heroSubtitle", v)}
          onFontSizeChange={v => onUpdate?.("heroSubtitleSize", v)}
          onFontColorChange={v => onUpdate?.("heroSubtitleColor", v)}
          isEditable={isEditable}
          className="mt-6 max-w-xl"
        />

        <button
          className="mt-8 rounded-2xl px-8 py-4 font-black"
          style={{
            backgroundColor: store.primaryColor,
            color: store.buttonTextColor,
          }}
        >
          {store.ctaText}
        </button>
        <button
          className="ml-3 mt-8 rounded-2xl border border-white/15 px-8 py-4 font-black"
          style={{ color: store.textColor }}
        >
          {store.secondaryCtaText}
        </button>
        </div>
      </section>

      <section className="grid gap-4 p-8 md:grid-cols-3" style={{ backgroundColor: store.backgroundColor }}>
        {[
          [store.benefit1, store.benefit1Text],
          [store.benefit2, store.benefit2Text],
          [store.benefit3, store.benefit3Text],
        ].map(([benefit, description]) => (
          <div
            key={benefit}
            className="rounded-3xl border border-white/10 p-6"
            style={{ backgroundColor: store.surfaceColor }}
          >
            <div
              className="mb-4 h-10 w-10 rounded-full"
              style={{ backgroundColor: store.primaryColor }}
            />
            <h4 className="font-black">{benefit}</h4>
            <p className="mt-3 text-sm" style={{ color: store.mutedTextColor }}>
              {description}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-8 p-8 md:grid-cols-2">
        <div>
          <EditableText
            tag="h2" value={store.aboutTitle}
            fontSize={store.aboutTitleSize} fontColor={store.aboutTitleColor || store.textColor}
            onTextChange={v => onUpdate?.("aboutTitle", v)}
            onFontSizeChange={v => onUpdate?.("aboutTitleSize", v)}
            onFontColorChange={v => onUpdate?.("aboutTitleColor", v)}
            isEditable={isEditable}
            className="font-black"
          />
          <EditableText
            tag="p" value={store.aboutText}
            fontSize={store.aboutBodySize} fontColor={store.aboutBodyColor || store.mutedTextColor}
            onTextChange={v => onUpdate?.("aboutText", v)}
            onFontSizeChange={v => onUpdate?.("aboutBodySize", v)}
            onFontColorChange={v => onUpdate?.("aboutBodyColor", v)}
            isEditable={isEditable}
            className="mt-4"
          />
        </div>

        <ClickableImageZone
          value={store.bannerSecondary}
          onUpload={v => onUpdate?.("bannerSecondary", v)}
          isEditable={isEditable}
          className="min-h-[280px] overflow-hidden rounded-[2rem]"
          style={{ backgroundColor: store.backgroundColor }}
        >
          {store.bannerSecondary ? (
            <img
              src={store.bannerSecondary}
              alt="Banner secundario"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[280px] items-center justify-center" style={{ color: store.mutedTextColor }}>
              Banner secundario
            </div>
          )}
        </ClickableImageZone>
      </section>

      <section className="p-8" style={{ backgroundColor: store.backgroundColor }}>
        <p className="text-sm font-black uppercase tracking-[0.2em]" style={{ color: store.primaryColor }}>
          {store.catalogEyebrow}
        </p>
        <h2 className="mt-3 text-4xl font-black">{store.catalogTitle}</h2>
        <p className="mt-3 max-w-2xl text-sm" style={{ color: store.mutedTextColor }}>
          {store.catalogText}
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {products.map((product, index) => (
            <article
              key={index}
              className="overflow-hidden rounded-[2rem] border border-white/10 p-4"
              style={{ backgroundColor: store.surfaceColor }}
            >
              <ClickableImageZone
                value={product.image}
                onUpload={v => {
                  const copy = [...products];
                  copy[index] = { ...copy[index], image: v };
                  onUpdate?.("__products__", copy);
                }}
                isEditable={isEditable}
                className="h-56 overflow-hidden rounded-[1.5rem]"
                style={{ backgroundColor: store.backgroundColor }}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name || "Producto"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center" style={{ color: store.mutedTextColor }}>
                    Imagen producto
                  </div>
                )}
              </ClickableImageZone>

              <p className="mt-4 text-xs font-black" style={{ color: store.primaryColor }}>
                {product.category || "Categoria"}
              </p>

              <h3 className="mt-1 text-xl font-black">
                {product.name || "Nombre producto"}
              </h3>

              <p className="mt-2 text-sm" style={{ color: store.mutedTextColor }}>
                {product.description || "Descripcion del producto"}
              </p>

              <p className="mt-4 text-xl font-black" style={{ color: store.primaryColor }}>
                {product.price
                  ? `$${Number(product.price).toLocaleString("es-CO")} COP`
                  : "$0 COP"}
              </p>

              <p className="text-sm" style={{ color: store.mutedTextColor }}>
                Stock: {product.stock || "0"}
              </p>

              <button
                className="mt-5 w-full rounded-xl px-5 py-3 font-black"
                style={{
                  backgroundColor: store.primaryColor,
                  color: store.buttonTextColor,
                }}
              >
                Agregar al carrito
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="px-8 py-16 text-center" style={{ backgroundColor: store.surfaceColor }}>
        <p className="text-sm font-black uppercase tracking-[0.2em]" style={{ color: store.primaryColor }}>
          {store.finalEyebrow}
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-black">{store.finalTitle}</h2>
        <button
          className="mt-8 rounded-2xl px-10 py-4 font-black"
          style={{ backgroundColor: store.primaryColor, color: store.buttonTextColor }}
        >
          {store.finalCtaText}
        </button>
      </section>
    </div>
  );
}

function EditableText({ tag: Tag = "p", value, fontSize, fontColor, onTextChange, onFontSizeChange, onFontColorChange, isEditable, className, style }) {
  const ref = useRef(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (ref.current && !focused) ref.current.innerText = value || "";
  }, [value, focused]);

  const computedStyle = { ...style, fontSize: fontSize ? `${fontSize}px` : undefined, color: fontColor || undefined };

  if (!isEditable) return <Tag className={className} style={computedStyle}>{value}</Tag>;

  const btnStyle = { background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, color: "#fff", fontWeight: 900, fontSize: "0.72rem", padding: "3px 8px", cursor: "pointer", lineHeight: 1.4 };

  return (
    <div style={{ position: "relative" }}>
      {focused && (
        <div onMouseDown={e => e.preventDefault()}
          style={{ position: "absolute", top: -50, left: 0, zIndex: 400, background: "#0c140c", border: "1px solid rgba(89,255,53,0.5)", borderRadius: 10, padding: "7px 10px", display: "flex", gap: 6, alignItems: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.6)", whiteSpace: "nowrap" }}>
          <button style={btnStyle} onMouseDown={e => { e.preventDefault(); onFontSizeChange?.(Math.max(10, (fontSize || 16) - 2)); }}>A−</button>
          <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)", minWidth: 34, textAlign: "center" }}>{fontSize || "auto"}px</span>
          <button style={btnStyle} onMouseDown={e => { e.preventDefault(); onFontSizeChange?.((fontSize || 16) + 2); }}>A+</button>
          <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.12)", margin: "0 2px" }} />
          <label style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }} onMouseDown={e => e.stopPropagation()}>
            <div style={{ width: 20, height: 20, borderRadius: 5, background: fontColor || "#fff", border: "1px solid rgba(255,255,255,0.25)", flexShrink: 0 }} />
            <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)" }}>Color</span>
            <input type="color" value={fontColor || "#ffffff"} onChange={e => onFontColorChange?.(e.target.value)}
              style={{ width: 0, height: 0, opacity: 0, position: "absolute", pointerEvents: "none" }}
              ref={el => { if (el) el.style.pointerEvents = "auto"; }}
            />
          </label>
        </div>
      )}
      <Tag
        ref={ref}
        contentEditable suppressContentEditableWarning
        onFocus={() => setFocused(true)}
        onBlur={() => { setFocused(false); onTextChange?.(ref.current?.innerText || ""); }}
        className={className}
        style={{ ...computedStyle, outline: focused ? "2px dashed rgba(89,255,53,0.6)" : "2px dashed transparent", outlineOffset: 4, borderRadius: 4, cursor: "text", minWidth: 40 }}
      />
    </div>
  );
}

function ClickableImageZone({ value, onUpload, isEditable, className, style, placeholder, children }) {
  const [hovered, setHovered] = useState(false);
  const fileRef = useRef(null);

  function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => onUpload(e.target.result);
    reader.readAsDataURL(file);
  }

  if (!isEditable) return <div className={className} style={style}>{children}</div>;

  return (
    <div
      className={className}
      style={{ ...style, position: "relative", cursor: "pointer" }}
      onClick={() => fileRef.current?.click()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      {hovered && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.52)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: "inherit", zIndex: 20, pointerEvents: "none" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#59ff35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          <span style={{ color: "#59ff35", fontSize: "0.8rem", fontWeight: 900 }}>{value ? "Cambiar imagen" : "Subir imagen"}</span>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} onClick={e => e.stopPropagation()} />
    </div>
  );
}

function FloatingEditorCard({ title, onClose, children }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 154,
        right: 22,
        zIndex: 90,
        width: "min(430px, calc(100vw - 32px))",
        maxHeight: "calc(100vh - 184px)",
        overflowY: "auto",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 22,
        background: "rgba(6,9,6,0.94)",
        boxShadow: "0 28px 80px rgba(0,0,0,0.36)",
        backdropFilter: "blur(18px)",
        padding: 16,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: -16,
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          margin: "-16px -16px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(6,9,6,0.96)",
          padding: "15px 16px",
          backdropFilter: "blur(18px)",
        }}
      >
        <p style={{ margin: 0, color: "#fff", fontSize: "0.92rem", fontWeight: 950 }}>{title}</p>
        <button
          type="button"
          onClick={onClose}
          style={{
            width: 34,
            height: 34,
            display: "grid",
            placeItems: "center",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10,
            background: "rgba(255,255,255,0.08)",
            color: "#fff",
            fontSize: "1.1rem",
            fontWeight: 950,
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>{children}</div>
    </div>
  );
}

function SectionCard({ id, label, icon, open, onToggle, children }) {
  return (
    <div style={{ borderRadius: 14, border: open ? "1px solid rgba(89,255,53,0.25)" : "1px solid rgba(255,255,255,0.07)", overflow: "hidden", background: open ? "rgba(89,255,53,0.04)" : "rgba(255,255,255,0.02)" }}>
      <button type="button" onClick={onToggle}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "13px 14px", background: "transparent", border: "none", cursor: "pointer", color: "#fff" }}>
        <span style={{ color: open ? "#59ff35" : "rgba(255,255,255,0.35)", display: "flex", alignItems: "center" }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: "0.85rem", flex: 1, textAlign: "left" }}>{label}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={open ? "#59ff35" : "rgba(255,255,255,0.3)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div style={{ padding: "0 14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
          {children}
        </div>
      )}
    </div>
  );
}

function HeroIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}
function BrandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5"/><path d="M3 21v-2a7 7 0 0 1 14 0v2"/>
    </svg>
  );
}
function ProductIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}
function PaletteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    </svg>
  );
}

function ColorInput({ label, value, onChange }) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-black/30 p-3">
      <span className="mb-3 block text-xs font-bold text-white/40">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-14 cursor-pointer rounded-lg border border-white/10 bg-transparent p-1"
        />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none focus:border-[#59ff35]"
        />
      </div>
    </label>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-white/40">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none focus:border-[#59ff35]"
      />
    </label>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-white/40">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-24 w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none focus:border-[#59ff35]"
      />
    </label>
  );
}

function ImageUploader({ label, value, onChange }) {
  const fileRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      onChange(readerEvent.target.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-white/40">{label}</span>
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/60 hover:bg-white/15"
          >
            Quitar
          </button>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex min-h-36 w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/15 bg-[#050705] text-sm font-bold text-white/40 transition hover:border-[#59ff35]/70 hover:text-[#59ff35]"
      >
        {value ? (
          <>
            <img src={value} alt={label} className="h-full min-h-36 w-full object-cover" />
            {hovered && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#59ff35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <span style={{ color: "#59ff35", fontSize: "0.72rem", fontWeight: 900 }}>Cambiar imagen</span>
              </div>
            )}
          </>
        ) : (
          <span>Subir imagen</span>
        )}
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      <input
        value={value?.startsWith("data:") ? "" : value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="O pegar URL de imagen"
        className="mt-3 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none focus:border-[#59ff35]"
      />
    </div>
  );
}
