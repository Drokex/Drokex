"use client";

import { useRef, useState, useEffect } from "react";

export function hexToRgba(hex, alpha) {
  const normalized = (hex || "#000000").replace("#", "");
  const value =
    normalized.length === 3
      ? normalized.split("").map((c) => `${c}${c}`).join("")
      : normalized.padEnd(6, "0").slice(0, 6);
  const n = Number.parseInt(value, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

function EditableText({ tag: Tag = "p", value, fontSize, fontColor, onTextChange, onFontSizeChange, onFontColorChange, isEditable, className, style }) {
  const ref = useRef(null);
  const colorRef = useRef(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (ref.current && !focused) ref.current.innerText = value || "";
  }, [value, focused]);

  const computedStyle = { ...style, fontSize: fontSize ? `${fontSize}px` : undefined, color: fontColor || undefined };

  if (!isEditable) return <Tag className={className} style={computedStyle}>{value}</Tag>;

  const btnStyle = { background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, color: "#fff", fontWeight: 900, fontSize: "0.72rem", padding: "3px 8px", cursor: "pointer", lineHeight: 1.4, display: "flex", alignItems: "center", gap: 4 };

  return (
    <div style={{ position: "relative" }}>
      {focused && (
        <div onMouseDown={e => e.preventDefault()}
          style={{ position: "absolute", top: -50, left: 0, zIndex: 400, background: "#0c140c", border: "1px solid rgba(89,255,53,0.5)", borderRadius: 10, padding: "7px 10px", display: "flex", gap: 6, alignItems: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.6)", whiteSpace: "nowrap" }}>
          <button style={btnStyle} onMouseDown={e => { e.preventDefault(); onFontSizeChange?.(Math.max(10, (fontSize || 16) - 2)); }}>A−</button>
          <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)", minWidth: 34, textAlign: "center" }}>{fontSize || "auto"}px</span>
          <button style={btnStyle} onMouseDown={e => { e.preventDefault(); onFontSizeChange?.((fontSize || 16) + 2); }}>A+</button>
          <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.12)", margin: "0 2px" }} />
          <button
            style={btnStyle}
            onMouseDown={e => { e.preventDefault(); colorRef.current?.click(); }}
          >
            <span style={{ width: 14, height: 14, borderRadius: 4, background: fontColor || "#ffffff", border: "1px solid rgba(255,255,255,0.4)", display: "inline-block", flexShrink: 0 }} />
            Color
          </button>
          <input
            ref={colorRef}
            type="color"
            value={fontColor || "#ffffff"}
            onChange={e => onFontColorChange?.(e.target.value)}
            style={{ display: "none" }}
          />
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

export function ClickableImageZone({ value, onUpload, isEditable, className, style, children }) {
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

export default function LandingPreview({ store, products, fullWidth = false, standalone = false, isEditable = false, onUpdate }) {
  const primaryGlow = hexToRgba(store.primaryColor, 0.35);
  const primarySoft = hexToRgba(store.primaryColor, 0.16);

  return (
    <div
      className={standalone
        ? "w-full"
        : `mx-auto overflow-hidden border border-white/10 ${fullWidth ? "max-w-7xl rounded-[2rem]" : "max-w-6xl rounded-[2rem]"}`
      }
      style={{ backgroundColor: store.surfaceColor, color: store.textColor }}
    >
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/10 px-8 py-5">
        <div className="flex items-center gap-3">
          {store.logo ? (
            <img src={store.logo} alt={`${store.brand} logo`} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full font-black"
              style={{ backgroundColor: store.primaryColor, color: store.buttonTextColor }}>
              {store.brand.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="font-black">{store.brand}</h3>
            <p className="text-xs" style={{ color: store.mutedTextColor }}>{store.country}</p>
          </div>
        </div>
        <nav className="hidden gap-6 text-sm md:flex" style={{ color: store.mutedTextColor }}>
          <a>Inicio</a>
          <a>Productos</a>
          <a>Marca</a>
          <a>Contacto</a>
        </nav>
      </header>

      {/* Hero */}
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
        <div className="max-w-3xl p-2">
          <span className="rounded-full px-4 py-2 text-sm font-black"
            style={{ backgroundColor: primarySoft, color: store.primaryColor }}>
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
          <button className="mt-8 rounded-2xl px-8 py-4 font-black"
            style={{ backgroundColor: store.primaryColor, color: store.buttonTextColor }}>
            {store.ctaText}
          </button>
          <button className="ml-3 mt-8 rounded-2xl border border-white/15 px-8 py-4 font-black"
            style={{ color: store.textColor }}>
            {store.secondaryCtaText}
          </button>
        </div>
      </section>

      {/* Benefits */}
      <section className="grid gap-4 p-8 md:grid-cols-3" style={{ backgroundColor: store.backgroundColor }}>
        {[
          [store.benefit1, store.benefit1Text],
          [store.benefit2, store.benefit2Text],
          [store.benefit3, store.benefit3Text],
        ].map(([benefit, description]) => (
          <div key={benefit} className="rounded-3xl border border-white/10 p-6"
            style={{ backgroundColor: store.surfaceColor }}>
            <div className="mb-4 h-10 w-10 rounded-full" style={{ backgroundColor: store.primaryColor }} />
            <h4 className="font-black">{benefit}</h4>
            <p className="mt-3 text-sm" style={{ color: store.mutedTextColor }}>{description}</p>
          </div>
        ))}
      </section>

      {/* About */}
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
            <img src={store.bannerSecondary} alt="Banner secundario" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full min-h-[280px] items-center justify-center" style={{ color: store.mutedTextColor }}>
              Banner secundario
            </div>
          )}
        </ClickableImageZone>
      </section>

      {/* Catalog */}
      <section className="p-8" style={{ backgroundColor: store.backgroundColor }}>
        <p className="text-sm font-black uppercase tracking-[0.2em]" style={{ color: store.primaryColor }}>
          {store.catalogEyebrow}
        </p>
        <h2 className="mt-3 text-4xl font-black">{store.catalogTitle}</h2>
        <p className="mt-3 max-w-2xl text-sm" style={{ color: store.mutedTextColor }}>{store.catalogText}</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {products.map((product, index) => (
            <article key={index} className="overflow-hidden rounded-[2rem] border border-white/10 p-4"
              style={{ backgroundColor: store.surfaceColor }}>
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
                  <img src={product.image} alt={product.name || "Producto"} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-56 items-center justify-center" style={{ color: store.mutedTextColor }}>
                    Imagen producto
                  </div>
                )}
              </ClickableImageZone>
              <p className="mt-4 text-xs font-black" style={{ color: store.primaryColor }}>{product.category || "Categoria"}</p>
              <h3 className="mt-1 text-xl font-black">{product.name || "Nombre producto"}</h3>
              <p className="mt-2 text-sm" style={{ color: store.mutedTextColor }}>{product.description || "Descripcion del producto"}</p>
              <p className="mt-4 text-xl font-black" style={{ color: store.primaryColor }}>
                {product.price ? `$${Number(product.price).toLocaleString("es-CO")} COP` : "$0 COP"}
              </p>
              <p className="text-sm" style={{ color: store.mutedTextColor }}>Stock: {product.stock || "0"}</p>
              <button className="mt-5 w-full rounded-xl px-5 py-3 font-black"
                style={{ backgroundColor: store.primaryColor, color: store.buttonTextColor }}>
                Agregar al carrito
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-8 py-16 text-center" style={{ backgroundColor: store.surfaceColor }}>
        <p className="text-sm font-black uppercase tracking-[0.2em]" style={{ color: store.primaryColor }}>
          {store.finalEyebrow}
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-black">{store.finalTitle}</h2>
        <button className="mt-8 rounded-2xl px-10 py-4 font-black"
          style={{ backgroundColor: store.primaryColor, color: store.buttonTextColor }}>
          {store.finalCtaText}
        </button>
      </section>
    </div>
  );
}
