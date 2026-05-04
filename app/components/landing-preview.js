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

function EditableText({ tag: Tag = "p", value, fontSize, fontColor, onTextChange, onFontSizeChange, onFontColorChange, isEditable, className, style, inline = false, wrapperStyle }) {
  const ref = useRef(null);
  const [focused, setFocused] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);

  useEffect(() => {
    if (ref.current && !focused) ref.current.innerText = value || "";
  }, [value, focused]);

  const computedStyle = { ...style, fontSize: fontSize ? `${fontSize}px` : undefined, color: fontColor || undefined };

  if (!isEditable) return <Tag className={className} style={computedStyle}>{value}</Tag>;

  const btnStyle = { background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, color: "#fff", fontWeight: 900, fontSize: "0.72rem", padding: "3px 8px", cursor: "pointer", lineHeight: 1.4, display: "flex", alignItems: "center", gap: 4 };
  const colorOptions = ["#191421", "#ffffff", "#59ff35", "#ff9f2e", "#ff7db8", "#b86cff", "#00cfff", "#111827", "#6f6477", "#dc2626"];

  const Wrapper = inline ? "span" : "div";

  return (
    <Wrapper style={{ position: "relative", display: inline ? "inline-block" : "block", ...wrapperStyle }}>
      {focused && (
        <div onMouseDown={e => e.preventDefault()}
          style={{ position: "absolute", top: -50, left: 0, zIndex: 400, background: "#0c140c", border: "1px solid rgba(89,255,53,0.5)", borderRadius: 10, padding: "7px 10px", display: "flex", gap: 6, alignItems: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.6)", whiteSpace: "nowrap" }}>
          <button style={btnStyle} onMouseDown={e => { e.preventDefault(); onFontSizeChange?.(Math.max(10, (fontSize || 16) - 2)); }}>A−</button>
          <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)", minWidth: 34, textAlign: "center" }}>{fontSize || "auto"}px</span>
          <button style={btnStyle} onMouseDown={e => { e.preventDefault(); onFontSizeChange?.((fontSize || 16) + 2); }}>A+</button>
          <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.12)", margin: "0 2px" }} />
          <button
            type="button"
            style={btnStyle}
            onMouseDown={e => {
              e.preventDefault();
              setColorOpen(open => !open);
            }}
          >
            <span style={{ width: 14, height: 14, borderRadius: 4, background: fontColor || "#ffffff", border: "1px solid rgba(255,255,255,0.4)", display: "inline-block", flexShrink: 0 }} />
            Color
          </button>
          {colorOpen && (
            <div
              style={{
                position: "absolute",
                top: 42,
                right: 8,
                width: 202,
                padding: 10,
                borderRadius: 12,
                border: "1px solid rgba(89,255,53,0.35)",
                background: "#071007",
                boxShadow: "0 12px 34px rgba(0,0,0,0.55)",
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 7,
              }}
            >
              {colorOptions.map(color => (
                <button
                  key={color}
                  type="button"
                  aria-label={`Color ${color}`}
                  onMouseDown={e => {
                    e.preventDefault();
                    onFontColorChange?.(color);
                  }}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    border: color.toLowerCase() === (fontColor || "").toLowerCase() ? "2px solid #59ff35" : "1px solid rgba(255,255,255,0.22)",
                    background: color,
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.28)",
                  }}
                />
              ))}
              <input
                value={fontColor || ""}
                onMouseDown={e => e.stopPropagation()}
                onChange={e => {
                  const next = e.target.value;
                  if (/^#[0-9a-fA-F]{0,6}$/.test(next)) onFontColorChange?.(next);
                }}
                placeholder="#191421"
                maxLength={7}
                style={{
                  gridColumn: "1 / -1",
                  width: "100%",
                  marginTop: 4,
                  border: "1px solid rgba(255,255,255,0.16)",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.06)",
                  color: "#fff",
                  padding: "7px 9px",
                  fontSize: "0.75rem",
                  outline: "none",
                }}
              />
            </div>
          )}
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
    </Wrapper>
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
  const productButtonText = store.productCtaText || "Agregar al carrito";

  function updateProductField(index, field, value) {
    const copy = [...products];
    copy[index] = { ...copy[index], [field]: value };
    onUpdate?.("__products__", copy);
  }

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
            <EditableText
              tag="h3" value={store.brand}
              fontColor={store.textColor}
              onTextChange={v => onUpdate?.("brand", v)}
              onFontColorChange={v => onUpdate?.("textColor", v)}
              isEditable={isEditable}
              className="font-black"
            />
            <EditableText
              tag="p" value={store.country}
              fontColor={store.mutedTextColor}
              onTextChange={v => onUpdate?.("country", v)}
              onFontColorChange={v => onUpdate?.("mutedTextColor", v)}
              isEditable={isEditable}
              className="text-xs"
            />
          </div>
        </div>
        <nav className="hidden gap-6 text-sm md:flex" style={{ color: store.mutedTextColor }}>
          <a href="#inicio" style={{ cursor: "pointer" }}>
            <EditableText tag="span" value={store.nav1 || "Inicio"} fontColor={store.mutedTextColor} onTextChange={v => onUpdate?.("nav1", v)} onFontColorChange={v => onUpdate?.("mutedTextColor", v)} isEditable={isEditable} inline />
          </a>
          <a href="#productos" style={{ cursor: "pointer" }}>
            <EditableText tag="span" value={store.nav2 || "Productos"} fontColor={store.mutedTextColor} onTextChange={v => onUpdate?.("nav2", v)} onFontColorChange={v => onUpdate?.("mutedTextColor", v)} isEditable={isEditable} inline />
          </a>
          <a href="#marca" style={{ cursor: "pointer" }}>
            <EditableText tag="span" value={store.nav3 || "Marca"} fontColor={store.mutedTextColor} onTextChange={v => onUpdate?.("nav3", v)} onFontColorChange={v => onUpdate?.("mutedTextColor", v)} isEditable={isEditable} inline />
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section
        id="inicio"
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
            <EditableText
              tag="span" value={store.promoText}
              fontColor={store.primaryColor}
              onTextChange={v => onUpdate?.("promoText", v)}
              onFontColorChange={v => onUpdate?.("primaryColor", v)}
              isEditable={isEditable}
              inline
            />
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
            <EditableText
              tag="span" value={store.ctaText}
              fontColor={store.buttonTextColor}
              onTextChange={v => onUpdate?.("ctaText", v)}
              onFontColorChange={v => onUpdate?.("buttonTextColor", v)}
              isEditable={isEditable}
              inline
            />
          </button>
          <button className="ml-3 mt-8 rounded-2xl border border-white/15 px-8 py-4 font-black"
            style={{ color: store.textColor }}>
            <EditableText
              tag="span" value={store.secondaryCtaText}
              fontColor={store.textColor}
              onTextChange={v => onUpdate?.("secondaryCtaText", v)}
              onFontColorChange={v => onUpdate?.("textColor", v)}
              isEditable={isEditable}
              inline
            />
          </button>
        </div>
      </section>

      {/* Benefits */}
      <section className="grid gap-4 p-8 md:grid-cols-3" style={{ backgroundColor: store.backgroundColor }}>
        {[
          [store.benefit1, store.benefit1Text],
          [store.benefit2, store.benefit2Text],
          [store.benefit3, store.benefit3Text],
        ].map(([benefit, description], index) => (
          <div key={index} className="rounded-3xl border border-white/10 p-6"
            style={{ backgroundColor: store.surfaceColor }}>
            <div className="mb-4 h-10 w-10 rounded-full" style={{ backgroundColor: store.primaryColor }} />
            <EditableText
              tag="h4" value={benefit}
              fontColor={store.textColor}
              onTextChange={v => onUpdate?.(`benefit${index + 1}`, v)}
              onFontColorChange={v => onUpdate?.("textColor", v)}
              isEditable={isEditable}
              className="font-black"
            />
            <EditableText
              tag="p" value={description}
              fontColor={store.mutedTextColor}
              onTextChange={v => onUpdate?.(`benefit${index + 1}Text`, v)}
              onFontColorChange={v => onUpdate?.("mutedTextColor", v)}
              isEditable={isEditable}
              className="mt-3 text-sm"
            />
          </div>
        ))}
      </section>

      {/* About */}
      <section id="marca" className="grid gap-8 p-8 md:grid-cols-2">
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
      <section id="productos" className="p-8" style={{ backgroundColor: store.backgroundColor }}>
        <EditableText
          tag="p" value={store.catalogEyebrow}
          fontColor={store.primaryColor}
          onTextChange={v => onUpdate?.("catalogEyebrow", v)}
          onFontColorChange={v => onUpdate?.("primaryColor", v)}
          isEditable={isEditable}
          className="text-sm font-black uppercase tracking-[0.2em]"
        />
        <EditableText
          tag="h2" value={store.catalogTitle}
          fontColor={store.textColor}
          onTextChange={v => onUpdate?.("catalogTitle", v)}
          onFontColorChange={v => onUpdate?.("textColor", v)}
          isEditable={isEditable}
          className="mt-3 text-4xl font-black"
        />
        <EditableText
          tag="p" value={store.catalogText}
          fontColor={store.mutedTextColor}
          onTextChange={v => onUpdate?.("catalogText", v)}
          onFontColorChange={v => onUpdate?.("mutedTextColor", v)}
          isEditable={isEditable}
          className="mt-3 max-w-2xl text-sm"
        />
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
              <EditableText
                tag="p" value={product.category || "Categoria"}
                fontColor={store.primaryColor}
                onTextChange={v => updateProductField(index, "category", v)}
                onFontColorChange={v => onUpdate?.("primaryColor", v)}
                isEditable={isEditable}
                className="mt-4 text-xs font-black"
              />
              <EditableText
                tag="h3" value={product.name || "Nombre producto"}
                fontColor={store.textColor}
                onTextChange={v => updateProductField(index, "name", v)}
                onFontColorChange={v => onUpdate?.("textColor", v)}
                isEditable={isEditable}
                className="mt-1 text-xl font-black"
              />
              <EditableText
                tag="p" value={product.description || "Descripcion del producto"}
                fontColor={store.mutedTextColor}
                onTextChange={v => updateProductField(index, "description", v)}
                onFontColorChange={v => onUpdate?.("mutedTextColor", v)}
                isEditable={isEditable}
                className="mt-2 text-sm"
              />
              <EditableText
                tag="p" value={product.price ? `$${Number(product.price).toLocaleString("es-CO")} COP` : "$0 COP"}
                fontColor={store.primaryColor}
                onTextChange={v => updateProductField(index, "price", v.replace(/[^\d]/g, ""))}
                onFontColorChange={v => onUpdate?.("primaryColor", v)}
                isEditable={isEditable}
                className="mt-4 text-xl font-black"
              />
              <p className="text-sm" style={{ color: store.mutedTextColor }}>
                Stock:{" "}
                <EditableText
                  tag="span" value={product.stock || "0"}
                  fontColor={store.mutedTextColor}
                  onTextChange={v => updateProductField(index, "stock", v)}
                  onFontColorChange={v => onUpdate?.("mutedTextColor", v)}
                  isEditable={isEditable}
                  inline
                />
              </p>
              <button className="mt-5 w-full rounded-xl px-5 py-3 font-black"
                style={{ backgroundColor: store.primaryColor, color: store.buttonTextColor }}>
                <EditableText
                  tag="span" value={productButtonText}
                  fontColor={store.buttonTextColor}
                  onTextChange={v => onUpdate?.("productCtaText", v)}
                  onFontColorChange={v => onUpdate?.("buttonTextColor", v)}
                  isEditable={isEditable}
                  inline
                />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-8 py-16 text-center" style={{ backgroundColor: store.surfaceColor }}>
        <EditableText
          tag="p" value={store.finalEyebrow}
          fontColor={store.primaryColor}
          onTextChange={v => onUpdate?.("finalEyebrow", v)}
          onFontColorChange={v => onUpdate?.("primaryColor", v)}
          isEditable={isEditable}
          className="text-sm font-black uppercase tracking-[0.2em]"
        />
        <EditableText
          tag="h2" value={store.finalTitle}
          fontColor={store.textColor}
          onTextChange={v => onUpdate?.("finalTitle", v)}
          onFontColorChange={v => onUpdate?.("textColor", v)}
          isEditable={isEditable}
          className="mx-auto mt-4 max-w-2xl text-4xl font-black"
        />
        <button className="mt-8 rounded-2xl px-10 py-4 font-black"
          style={{ backgroundColor: store.primaryColor, color: store.buttonTextColor }}>
          <EditableText
            tag="span" value={store.finalCtaText}
            fontColor={store.buttonTextColor}
            onTextChange={v => onUpdate?.("finalCtaText", v)}
            onFontColorChange={v => onUpdate?.("buttonTextColor", v)}
            isEditable={isEditable}
            inline
          />
        </button>
      </section>
    </div>
  );
}
