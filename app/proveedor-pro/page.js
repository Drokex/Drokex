"use client";

import { useRef, useState, useEffect } from "react";
import SiteHeader from "@/app/components/site-header";

const VALID_CODE = "15472007";

function hexToRgba(hex, alpha) {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3
    ? normalized.split("").map((char) => `${char}${char}`).join("")
    : normalized;

  const number = Number.parseInt(value, 16);
  const red = (number >> 16) & 255;
  const green = (number >> 8) & 255;
  const blue = number & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ProveedorProPage() {
  const [code, setCode] = useState("");
  const [isPro, setIsPro] = useState(false);
  const [openSection, setOpenSection] = useState("hero");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [landingLink, setLandingLink] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [error, setError] = useState("");

  const [store, setStore] = useState({
    brand: "Muebles del Sur",
    country: "Colombia",
    logo: "",
    heroTitle: "Diseño premium para hogares modernos",
    heroSubtitle:
      "Muebles elegantes, cómodos y listos para transformar cualquier espacio.",
    heroImage: "",
    ctaText: "Comprar colección",
    promoText: "Nueva colección 2026",
    aboutTitle: "Una marca pensada para espacios con estilo",
    aboutText:
      "Creamos productos funcionales, modernos y de alta calidad para hogares que buscan diseño y comodidad.",
    bannerSecondary: "",
    benefit1: "Stock disponible en Colombia",
    benefit2: "Envíos rápidos y seguros",
    benefit3: "Garantía directa del proveedor",
    primaryColor: "#c89b5c",
    backgroundColor: "#11100d",
    surfaceColor: "#1c1712",
    textColor: "#fff8ee",
    mutedTextColor: "#c7b9a7",
    buttonTextColor: "#15100a",
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

  function activatePro() {
    if (code === VALID_CODE) {
      setIsPro(true);
      setError("");
    } else {
      setError("Código inválido. Usa el código de prueba correcto.");
    }
  }

  function updateStore(field, value) {
    setStore({ ...store, [field]: value });
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
    const origin = window.location.origin;
    const link = `${origin}/proveedor-pro/tienda/${slug}`;

    window.localStorage.setItem(
      `drokex-proveedor-pro:${slug}`,
      JSON.stringify({
        store,
        products,
        createdAt: new Date().toISOString(),
      })
    );

    setLandingLink(link);
    setCopiedLink(false);
  }

  async function copyLandingLink() {
    if (!landingLink) return;

    await navigator.clipboard?.writeText(landingLink);
    setCopiedLink(true);
  }

  return (
    <main className="min-h-screen bg-[#030503] text-white">
      <SiteHeader />

      {!isPro ? (
        <section style={{ display: "grid", gridTemplateColumns: "420px 1fr", minHeight: "calc(100vh - 80px)", background: "#030503" }}>
          {/* Left: text + plan + form */}
          <div style={{ padding: "64px 40px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}>
            <span style={{ display: "inline-block", background: "rgba(89,255,53,0.12)", color: "#59ff35", fontSize: "0.7rem", fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 6, border: "1px solid rgba(89,255,53,0.25)", alignSelf: "flex-start" }}>
              Proveedor Pro
            </span>

            <h1 style={{ fontSize: "clamp(1.35rem, 2vw, 1.9rem)", fontWeight: 700, lineHeight: 1.25, margin: 0, color: "#fff", letterSpacing: "-0.01em" }}>
              Crea tu tienda premium<br />dentro de{" "}
              <span style={{ color: "#59ff35" }}>Drokex</span>
            </h1>

            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>
              Activa el modo Pro para construir una landing personalizada, subir banners, productos, textos comerciales y vender directo.
            </p>

            <div style={{ borderRadius: 24, border: "1px solid rgba(89,255,53,0.3)", background: "rgba(89,255,53,0.08)", padding: "24px" }}>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.45)", fontSize: "0.82rem" }}>Plan demo</p>
              <h2 style={{ margin: "8px 0 0", fontSize: "2.4rem", fontWeight: 900, color: "#59ff35", lineHeight: 1 }}>$99.000 COP</h2>
              <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.4)", fontSize: "0.82rem" }}>Simulación para validar experiencia.</p>
            </div>

            <div style={{ borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", padding: "28px" }}>
              <h2 style={{ margin: "0 0 20px", fontSize: "1.3rem", fontWeight: 900, color: "#fff" }}>Adquiere Proveedor Pro</h2>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Código de activación"
                style={{ width: "100%", borderRadius: 14, border: "1px solid rgba(255,255,255,0.12)", background: "#000", color: "#fff", padding: "14px 18px", fontSize: "0.92rem", outline: "none", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = "#59ff35"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
              />
              {error && <p style={{ margin: "8px 0 0", color: "#f87171", fontSize: "0.82rem" }}>{error}</p>}
              <button
                onClick={activatePro}
                style={{ marginTop: 14, width: "100%", borderRadius: 14, background: "#59ff35", color: "#050505", fontWeight: 900, fontSize: "1rem", padding: "14px", border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(89,255,53,0.35)" }}
              >
                Activar plan Pro
              </button>
              <p style={{ margin: "12px 0 0", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.75rem" }}>Código demo: 15472007</p>
            </div>
          </div>

          {/* Right: pago image */}
          <div style={{ position: "relative", overflow: "hidden" }}>
            <img
              src="/pago.png"
              alt="Drokex Proveedor Pro"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(3,5,3,0.75) 0%, rgba(3,5,3,0.1) 50%)" }} />

            {/* Benefits overlay */}
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 48px" }}>
              <p style={{ margin: "0 0 20px", fontSize: "0.7rem", fontWeight: 900, letterSpacing: "0.16em", textTransform: "uppercase", color: "#59ff35" }}>¿Por qué tener una landing?</p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  ["Tu vitrina 24/7", "Vende mientras duermes con una página siempre activa."],
                  ["Más confianza, más ventas", "Los compradores confían más en marcas con presencia propia."],
                  ["Control total", "Tú decides el diseño, los productos y los precios."],
                  ["Sin intermediarios", "Conecta directo con tus clientes desde Drokex."],
                ].map(([title, desc]) => (
                  <li key={title} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ marginTop: 3, flexShrink: 0, width: 7, height: 7, borderRadius: "50%", background: "#59ff35", boxShadow: "0 0 8px #59ff35" }} />
                    <div>
                      <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 800, color: "#fff" }}>{title}</p>
                      <p style={{ margin: "2px 0 0", fontSize: "0.73rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
        <section className="grid min-h-[calc(100vh-80px)] grid-cols-1 lg:grid-cols-[360px_1fr]">
          <aside style={{ borderRight: "1px solid rgba(255,255,255,0.08)", background: "#060906", display: "flex", flexDirection: "column", overflowY: "auto" }}>
            {/* Brand header */}
            <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: store.primaryColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "1rem", color: store.buttonTextColor, flexShrink: 0 }}>
                  {store.logo
                    ? <img src={store.logo} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                    : store.brand.charAt(0)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 900, fontSize: "0.9rem", color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{store.brand}</p>
                  <p style={{ margin: 0, fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>{store.country}</p>
                </div>
                <span style={{ marginLeft: "auto", flexShrink: 0, background: "rgba(89,255,53,0.15)", color: "#59ff35", fontSize: "0.62rem", fontWeight: 900, letterSpacing: "0.1em", padding: "3px 8px", borderRadius: 6, textTransform: "uppercase" }}>Pro</span>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ padding: "14px 16px", display: "flex", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <button type="button" onClick={createLanding}
                style={{ flex: 1, borderRadius: 12, background: "#59ff35", color: "#050505", fontWeight: 900, fontSize: "0.82rem", padding: "11px 8px", border: "none", cursor: "pointer" }}>
                Publicar
              </button>
              <button type="button" onClick={() => setIsPreviewMode(true)}
                style={{ flex: 1, borderRadius: 12, background: "rgba(255,255,255,0.06)", color: "#fff", fontWeight: 700, fontSize: "0.82rem", padding: "11px 8px", border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer" }}>
                Previsualizar
              </button>
            </div>

            {/* Landing link */}
            {landingLink && (
              <div style={{ margin: "12px 16px", borderRadius: 14, border: "1px solid rgba(89,255,53,0.3)", background: "rgba(89,255,53,0.07)", padding: "14px" }}>
                <p style={{ margin: "0 0 6px", fontSize: "0.68rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.14em", color: "#59ff35" }}>Landing publicada</p>
                <a href={landingLink} style={{ display: "block", wordBreak: "break-all", fontSize: "0.72rem", color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>{landingLink}</a>
                <button type="button" onClick={copyLandingLink}
                  style={{ width: "100%", borderRadius: 10, border: "1px solid rgba(89,255,53,0.4)", background: "transparent", color: "#59ff35", fontWeight: 900, fontSize: "0.78rem", padding: "8px", cursor: "pointer" }}>
                  {copiedLink ? "Copiado" : "Copiar link"}
                </button>
              </div>
            )}

            {/* Section list */}
            <div style={{ padding: "12px 16px 24px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              <p style={{ margin: "0 0 8px", fontSize: "0.68rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)" }}>Secciones de tu landing</p>

              <SectionCard id="hero" label="Portada" icon={<HeroIcon />} open={openSection === "hero"} onToggle={() => setOpenSection(s => s === "hero" ? null : "hero")}>
                <Input label="Titulo principal" value={store.heroTitle} onChange={v => updateStore("heroTitle", v)} />
                <Textarea label="Subtitulo" value={store.heroSubtitle} onChange={v => updateStore("heroSubtitle", v)} />
                <Input label="Texto del boton" value={store.ctaText} onChange={v => updateStore("ctaText", v)} />
                <Input label="Texto promocional" value={store.promoText} onChange={v => updateStore("promoText", v)} />
                <ImageUploader label="Imagen de fondo" value={store.heroImage} onChange={v => updateStore("heroImage", v)} />
              </SectionCard>

              <SectionCard id="benefits" label="Beneficios" icon={<CheckIcon />} open={openSection === "benefits"} onToggle={() => setOpenSection(s => s === "benefits" ? null : "benefits")}>
                <Input label="Beneficio 1" value={store.benefit1} onChange={v => updateStore("benefit1", v)} />
                <Input label="Beneficio 2" value={store.benefit2} onChange={v => updateStore("benefit2", v)} />
                <Input label="Beneficio 3" value={store.benefit3} onChange={v => updateStore("benefit3", v)} />
                <ImageUploader label="Banner secundario" value={store.bannerSecondary} onChange={v => updateStore("bannerSecondary", v)} />
              </SectionCard>

              <SectionCard id="brand" label="Tu marca" icon={<BrandIcon />} open={openSection === "brand"} onToggle={() => setOpenSection(s => s === "brand" ? null : "brand")}>
                <Input label="Nombre de marca" value={store.brand} onChange={v => updateStore("brand", v)} />
                <Input label="Pais" value={store.country} onChange={v => updateStore("country", v)} />
                <ImageUploader label="Logo" value={store.logo} onChange={v => updateStore("logo", v)} />
                <Input label="Titulo seccion marca" value={store.aboutTitle} onChange={v => updateStore("aboutTitle", v)} />
                <Textarea label="Historia / descripcion" value={store.aboutText} onChange={v => updateStore("aboutText", v)} />
              </SectionCard>

              <SectionCard id="products" label="Productos" icon={<ProductIcon />} open={openSection === "products"} onToggle={() => setOpenSection(s => s === "products" ? null : "products")}>
                {products.map((product, index) => (
                  <div key={index} style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.3)", padding: "14px", display: "flex", flexDirection: "column", gap: 12 }}>
                    <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 900, color: "#59ff35" }}>Producto {index + 1}</p>
                    <Input label="Nombre" value={product.name} onChange={v => updateProduct(index, "name", v)} />
                    <Input label="Categoria" value={product.category} onChange={v => updateProduct(index, "category", v)} />
                    <Input label="Precio" value={product.price} onChange={v => updateProduct(index, "price", v)} />
                    <Input label="Stock" value={product.stock} onChange={v => updateProduct(index, "stock", v)} />
                    <ImageUploader label="Imagen" value={product.image} onChange={v => updateProduct(index, "image", v)} />
                    <Textarea label="Descripcion" value={product.description} onChange={v => updateProduct(index, "description", v)} />
                  </div>
                ))}
                <button onClick={addProduct} style={{ width: "100%", borderRadius: 12, border: "1px dashed rgba(89,255,53,0.4)", background: "transparent", color: "#59ff35", fontWeight: 900, fontSize: "0.82rem", padding: "12px", cursor: "pointer" }}>
                  + Agregar producto
                </button>
              </SectionCard>

              <SectionCard id="style" label="Colores y diseño" icon={<PaletteIcon />} open={openSection === "style"} onToggle={() => setOpenSection(s => s === "style" ? null : "style")}>
                <ColorInput label="Color principal" value={store.primaryColor} onChange={v => updateStore("primaryColor", v)} />
                <ColorInput label="Fondo de landing" value={store.backgroundColor} onChange={v => updateStore("backgroundColor", v)} />
                <ColorInput label="Color de secciones" value={store.surfaceColor} onChange={v => updateStore("surfaceColor", v)} />
                <ColorInput label="Texto principal" value={store.textColor} onChange={v => updateStore("textColor", v)} />
                <ColorInput label="Texto secundario" value={store.mutedTextColor} onChange={v => updateStore("mutedTextColor", v)} />
                <ColorInput label="Texto de botones" value={store.buttonTextColor} onChange={v => updateStore("buttonTextColor", v)} />
              </SectionCard>
            </div>
          </aside>

          <section className="overflow-y-auto p-6" style={{ backgroundColor: store.backgroundColor }}>
            <LandingPreview store={store} products={products} isEditable onUpdate={updateStore} />
          </section>
        </section>
      )}
    </main>
  );
}

function LandingPreview({ store, products, fullWidth = false, isEditable = false, onUpdate }) {
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
              {store.country}
            </p>
          </div>
        </div>

        <nav className="hidden gap-6 text-sm md:flex" style={{ color: store.mutedTextColor }}>
          <a>Inicio</a>
          <a>Productos</a>
          <a>Marca</a>
          <a>Contacto</a>
        </nav>

        <button
          className="rounded-xl px-5 py-3 font-black"
          style={{
            backgroundColor: store.primaryColor,
            color: store.buttonTextColor,
          }}
        >
          Comprar
        </button>
      </header>

      <section
        className="relative min-h-[520px] bg-cover bg-center px-8 py-16"
        style={{
          backgroundColor: store.backgroundColor,
          backgroundImage: store.heroImage
            ? `linear-gradient(90deg, rgba(0,0,0,.82), rgba(0,0,0,.22)), url(${store.heroImage})`
            : `radial-gradient(circle at 75% 25%, ${primaryGlow}, transparent 35%)`,
        }}
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
      </section>

      <section className="grid gap-4 p-8 md:grid-cols-3" style={{ backgroundColor: store.backgroundColor }}>
        {[store.benefit1, store.benefit2, store.benefit3].map((benefit) => (
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

        <div className="min-h-[280px] overflow-hidden rounded-[2rem]" style={{ backgroundColor: store.backgroundColor }}>
          {store.bannerSecondary ? (
            <img
              src={store.bannerSecondary}
              alt="Banner secundario"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center" style={{ color: store.mutedTextColor }}>
              Banner secundario
            </div>
          )}
        </div>
      </section>

      <section className="p-8" style={{ backgroundColor: store.backgroundColor }}>
        <h2 className="text-4xl font-black">Productos destacados</h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {products.map((product, index) => (
            <article
              key={index}
              className="overflow-hidden rounded-[2rem] border border-white/10 p-4"
              style={{ backgroundColor: store.surfaceColor }}
            >
              <div className="h-56 overflow-hidden rounded-[1.5rem]" style={{ backgroundColor: store.backgroundColor }}>
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name || "Producto"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center" style={{ color: store.mutedTextColor }}>
                    Imagen producto
                  </div>
                )}
              </div>

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
        className="flex min-h-36 w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/15 bg-[#050705] text-sm font-bold text-white/40 transition hover:border-[#59ff35]/70 hover:text-[#59ff35]"
      >
        {value ? (
          <img src={value} alt={label} className="h-full min-h-36 w-full object-cover" />
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
