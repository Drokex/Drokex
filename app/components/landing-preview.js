"use client";

import { useRef, useState, useEffect } from "react";
import { buildMarketPrice, inferCurrencyFromOriginCountry, COUNTRY_PREFERENCE_STORAGE_KEY } from "@/lib/market-pricing";

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
  const wrapperRef = useRef(null);
  const [focused, setFocused] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (ref.current && !focused) ref.current.innerText = value || "";
  }, [value, focused]);

  const computedStyle = { ...style, fontSize: fontSize ? `${fontSize}px` : undefined, color: fontColor || undefined };

  if (!isEditable) return <Tag className={className} style={computedStyle}>{value}</Tag>;

  const btnStyle = { background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, color: "#fff", fontWeight: 900, fontSize: "0.72rem", padding: "3px 8px", cursor: "pointer", lineHeight: 1.4, display: "flex", alignItems: "center", gap: 4 };
  const nativePickerRef = useRef(null);

  function hslToHex(h, s, l) {
    l /= 100; const a = s * Math.min(l, 1 - l) / 100;
    const f = n => { const k = (n + h / 30) % 12; const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1); return Math.round(255 * c).toString(16).padStart(2, "0"); };
    return `#${f(0)}${f(8)}${f(4)}`;
  }
  const PAL_HUES = [0, 24, 48, 60, 72, 96, 120, 144, 168, 192, 216, 240, 270, 300];
  const PAL_LIGHTS = [10, 20, 30, 40, 55, 65, 75, 85];
  const grayscaleRow = Array.from({ length: 14 }, (_, i) => { const v = Math.round(i * 255 / 13).toString(16).padStart(2, "0"); return `#${v}${v}${v}`; });
  const colorPalette = [grayscaleRow, ...PAL_LIGHTS.map(l => PAL_HUES.map(h => hslToHex(h, 100, l)))];

  const Wrapper = inline ? "span" : "div";

  return (
    <Wrapper
      ref={wrapperRef}
      onBlur={(e) => {
        if (!wrapperRef.current?.contains(e.relatedTarget)) {
          setFocused(false);
          setColorOpen(false);
          onTextChange?.(ref.current?.innerText || "");
        }
      }}
      style={{ position: "relative", display: inline ? "inline-block" : "block", ...wrapperStyle }}
    >
      {focused && (
        <div onMouseDown={e => e.preventDefault()}
          style={{ position: "fixed", top: toolbarPos.top, left: toolbarPos.left, zIndex: 9999, background: "#0c140c", border: "1px solid rgba(89,255,53,0.5)", borderRadius: 10, padding: "7px 10px", display: "flex", gap: 6, alignItems: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.6)", whiteSpace: "nowrap" }}>
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
                top: 46,
                left: 0,
                padding: "10px 10px 8px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "#2a2a2a",
                boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
                zIndex: 500,
              }}
            >
              {/* Color grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(14, 16px)", gap: 2 }}>
                {colorPalette.flat().map((color, i) => (
                  <button
                    key={i}
                    type="button"
                    title={color}
                    onMouseDown={e => { e.preventDefault(); onFontColorChange?.(color); }}
                    style={{
                      width: 16, height: 16,
                      borderRadius: 2,
                      border: color.toLowerCase() === (fontColor || "").toLowerCase() ? "2px solid #fff" : "1px solid rgba(0,0,0,0.3)",
                      background: color,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  />
                ))}
              </div>
              {/* Hex input */}
              <input
                value={fontColor || ""}
                onMouseDown={e => e.stopPropagation()}
                onChange={e => {
                  const next = e.target.value;
                  if (next === "" || /^#[0-9a-fA-F]{0,6}$/.test(next)) onFontColorChange?.(next);
                }}
                onBlur={e => {
                  const val = e.target.value;
                  if (val && !val.startsWith("#")) onFontColorChange?.(`#${val}`);
                }}
                placeholder="#000000"
                maxLength={7}
                style={{
                  width: "100%",
                  marginTop: 8,
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  padding: "6px 10px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              {/* Native picker button */}
              <input
                ref={nativePickerRef}
                type="color"
                value={/^#[0-9a-fA-F]{6}$/.test(fontColor || "") ? fontColor : "#000000"}
                onMouseDown={e => e.stopPropagation()}
                onChange={e => onFontColorChange?.(e.target.value)}
                style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }}
              />
              <button
                type="button"
                onMouseDown={e => { e.preventDefault(); nativePickerRef.current?.click(); }}
                style={{
                  marginTop: 6,
                  width: "100%",
                  borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#ccc",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  padding: "6px",
                  cursor: "pointer",
                }}
              >
                Mostrar colores...
              </button>
            </div>
          )}
        </div>
      )}
      <Tag
        ref={ref}
        contentEditable suppressContentEditableWarning
        onFocus={(e) => {
          setFocused(true);
          const rect = e.currentTarget.getBoundingClientRect();
          const toolbarH = 44;
          const top = rect.top >= toolbarH + 8 ? rect.top - toolbarH - 8 : rect.bottom + 8;
          setToolbarPos({ top, left: Math.min(rect.left, window.innerWidth - 320) });
        }}
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
      style={{ position: "relative", cursor: "pointer", ...style }}
      onClick={(e) => { if (e.target.isContentEditable || e.target.closest("[contenteditable]")) return; fileRef.current?.click(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      {hovered && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.52)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: "inherit", zIndex: 20, pointerEvents: "none", overflow: "hidden" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#59ff35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          <span style={{ color: "#59ff35", fontSize: "0.68rem", fontWeight: 900, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", maxWidth: "100%", padding: "0 4px" }}>
            {value ? "Cambiar" : "Subir"}
          </span>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} onClick={e => e.stopPropagation()} />
    </div>
  );
}

export default function LandingPreview({ store, products, fullWidth = false, standalone = false, basePath = "", productsOnly = false, marcaOnly = false, isEditable = false, onUpdate }) {
  const [visitorCountryId, setVisitorCountryId] = useState("");
  useEffect(() => {
    try { setVisitorCountryId(localStorage.getItem(COUNTRY_PREFERENCE_STORAGE_KEY) || ""); } catch {}
    const sync = () => { try { setVisitorCountryId(localStorage.getItem(COUNTRY_PREFERENCE_STORAGE_KEY) || ""); } catch {} };
    window.addEventListener("drokex-country-change", sync);
    return () => window.removeEventListener("drokex-country-change", sync);
  }, []);

  const originCountry = (store.countries?.length ? store.countries[0] : store.country) || "";
  const baseCurrency = inferCurrencyFromOriginCountry(originCountry);

  function formatProductPrice(rawPrice) {
    if (!rawPrice) return "$0";
    const { displayPrice } = buildMarketPrice({
      amount: Number(rawPrice),
      baseCurrency,
      selectedCountryId: visitorCountryId,
      originCountry,
    });
    return displayPrice;
  }

  const primaryGlow = hexToRgba(store.primaryColor, 0.35);
  const primarySoft = hexToRgba(store.primaryColor, 0.16);
  const productButtonText = store.productCtaText || "Agregar al carrito";
  const textColor = (field, fallback) => store[field] || fallback;
  const productTextColor = (product, field, fallback) => product?.[field] || fallback;
  const shellClassName = standalone
    ? "w-full overflow-hidden"
    : `mx-auto overflow-hidden border border-white/10 ${fullWidth ? "max-w-7xl rounded-[2rem]" : "max-w-6xl rounded-[2rem]"}`;
  const sectionPadding = standalone ? "p-5 md:p-7" : "p-8";
  const heroClassName = standalone
    ? "relative bg-cover bg-center px-5 py-12 md:px-8 md:py-20"
    : "relative min-h-[520px] bg-cover bg-center px-8 py-16";
  const heroTitleSize = Math.min(store.heroTitleSize || 60, standalone ? 42 : 72);
  const heroSubtitleSize = Math.min(store.heroSubtitleSize || 18, standalone ? 16 : 24);
  const aboutTitleSize = Math.min(store.aboutTitleSize || 36, standalone ? 28 : 48);
  const aboutBodySize = Math.min(store.aboutBodySize || 16, standalone ? 15 : 22);
  const standalonePath = basePath.replace(/\/$/, "");

  function updateProductField(index, field, value) {
    const copy = [...products];
    copy[index] = { ...copy[index], [field]: value };
    onUpdate?.("__products__", copy);
  }

  return (
    <div
      className={shellClassName}
      style={{ backgroundColor: store.surfaceColor, color: store.textColor }}
    >
      {/* Header */}
      <header style={{
        position: standalone ? "sticky" : "relative",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        backgroundColor: hexToRgba(store.surfaceColor || "#ffffff", 0.82),
        borderBottom: `1px solid ${hexToRgba(store.textColor || "#000", 0.07)}`,
        boxShadow: "0 2px 24px rgba(0,0,0,0.06)",
      }}>
        <div className={`${standalone ? "mx-auto max-w-6xl" : ""} flex items-center justify-between px-5 py-3 md:px-8`}>
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div style={{
              width: 64, height: 64, borderRadius: 16, overflow: "hidden", flexShrink: 0,
              background: store.logo ? "transparent" : store.primaryColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: "1.1rem", color: store.buttonTextColor,
              boxShadow: store.logo ? "none" : `0 4px 14px ${hexToRgba(store.primaryColor || "#000", 0.3)}`,
            }}>
              {store.logo
                ? <img src={store.logo} alt={store.brand} style={{ width: 64, height: 64, objectFit: "contain" }} />
                : store.brand?.charAt(0)}
            </div>
            <div>
              <EditableText
                tag="p" value={store.brand}
                fontColor={textColor("brandColor", store.textColor)}
                onTextChange={v => onUpdate?.("brand", v)}
                onFontColorChange={v => onUpdate?.("brandColor", v)}
                isEditable={isEditable}
                style={{ margin: 0, fontWeight: 900, fontSize: "0.95rem", lineHeight: 1.2 }}
              />
              {(store.countries?.length || store.country) ? (
                <p style={{ margin: 0, fontSize: "0.7rem", fontWeight: 600, color: store.mutedTextColor, lineHeight: 1.2, marginTop: 1 }}>
                  {(store.countries?.length ? store.countries : [store.country]).join(" · ")}
                </p>
              ) : null}
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden gap-1 text-sm md:flex items-center">
            {[
              { label: store.nav1 || "Inicio", key: "nav1", active: !productsOnly && !marcaOnly, nav: "home", anchor: "#inicio" },
              { label: store.nav2 || "Productos", key: "nav2", active: productsOnly, nav: "products", anchor: "#productos" },
              { label: store.nav3 || "Marca", key: "nav3", active: marcaOnly, nav: "marca", anchor: "#marca" },
            ].map(({ label, key, active, nav, anchor }) => (
              <a
                key={key}
                href={isEditable ? undefined : standalonePath ? `${standalonePath}${anchor}` : anchor}
                onClick={isEditable ? (e) => { e.preventDefault(); onUpdate?.("__nav__", nav); } : undefined}
                style={{
                  cursor: "pointer", textDecoration: "none",
                  padding: "6px 14px", borderRadius: 10,
                  fontWeight: active ? 800 : 500,
                  fontSize: "0.85rem",
                  color: active ? store.primaryColor : store.mutedTextColor,
                  background: active ? hexToRgba(store.primaryColor || "#000", 0.08) : "transparent",
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                <EditableText tag="span" value={label} fontColor={active ? store.primaryColor : textColor(`${key}Color`, store.mutedTextColor)} onTextChange={v => onUpdate?.(key, v)} onFontColorChange={v => onUpdate?.(`${key}Color`, v)} isEditable={isEditable} inline />
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero */}
      {!productsOnly && !marcaOnly && <section
        id="inicio"
        className={heroClassName}
        style={{
          minHeight: standalone ? "clamp(520px, 68vh, 760px)" : undefined,
          backgroundColor: store.backgroundColor,
          backgroundImage: store.heroImage
            ? `url(${store.heroImage})`
            : `radial-gradient(circle at 75% 25%, ${primaryGlow}, transparent 35%)`,
          backgroundSize: store.heroImage ? "cover" : undefined,
          backgroundPosition: store.heroImage ? "center center" : undefined,
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
        <div className={`${standalone ? "mx-auto w-full max-w-6xl" : "max-w-3xl"} p-2`}>
          <div className={standalone ? "max-w-xl" : ""}>
          <span className="rounded-full px-4 py-2 text-sm font-black"
            style={{ backgroundColor: primarySoft, color: store.primaryColor }}>
            <EditableText
              tag="span" value={store.promoText}
              fontColor={textColor("promoTextColor", store.primaryColor)}
              onTextChange={v => onUpdate?.("promoText", v)}
              onFontColorChange={v => onUpdate?.("promoTextColor", v)}
              isEditable={isEditable}
              inline
            />
          </span>
          <EditableText
            tag="h1" value={store.heroTitle}
            fontSize={heroTitleSize} fontColor={store.heroTitleColor || store.textColor}
            onTextChange={v => onUpdate?.("heroTitle", v)}
            onFontSizeChange={v => onUpdate?.("heroTitleSize", v)}
            onFontColorChange={v => onUpdate?.("heroTitleColor", v)}
            isEditable={isEditable}
            className="mt-8 max-w-3xl font-black leading-none"
          />
          <EditableText
            tag="p" value={store.heroSubtitle}
            fontSize={heroSubtitleSize} fontColor={store.heroSubtitleColor || store.mutedTextColor}
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
              fontColor={textColor("ctaTextColor", store.buttonTextColor)}
              onTextChange={v => onUpdate?.("ctaText", v)}
              onFontColorChange={v => onUpdate?.("ctaTextColor", v)}
              isEditable={isEditable}
              inline
            />
          </button>
          <button className="ml-3 mt-8 rounded-2xl border border-white/15 px-8 py-4 font-black"
            style={{ color: store.textColor }}>
            <EditableText
              tag="span" value={store.secondaryCtaText}
              fontColor={textColor("secondaryCtaTextColor", store.textColor)}
              onTextChange={v => onUpdate?.("secondaryCtaText", v)}
              onFontColorChange={v => onUpdate?.("secondaryCtaTextColor", v)}
              isEditable={isEditable}
              inline
            />
          </button>
          </div>
        </div>
      </section>}

      {!productsOnly && !marcaOnly && <section className={`mx-auto grid max-w-6xl gap-4 ${sectionPadding} md:grid-cols-3`} style={{ backgroundColor: store.backgroundColor }}>
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
              fontColor={textColor(`benefit${index + 1}Color`, store.textColor)}
              onTextChange={v => onUpdate?.(`benefit${index + 1}`, v)}
              onFontColorChange={v => onUpdate?.(`benefit${index + 1}Color`, v)}
              isEditable={isEditable}
              className="font-black"
            />
            <EditableText
              tag="p" value={description}
              fontColor={textColor(`benefit${index + 1}TextColor`, store.mutedTextColor)}
              onTextChange={v => onUpdate?.(`benefit${index + 1}Text`, v)}
              onFontColorChange={v => onUpdate?.(`benefit${index + 1}TextColor`, v)}
              isEditable={isEditable}
              className="mt-3 text-sm"
            />
          </div>
        ))}
      </section>}

      {!productsOnly && <section id="marca" className={`mx-auto grid max-w-6xl gap-7 ${sectionPadding} md:grid-cols-2`}>
        <div>
          <EditableText
            tag="h2" value={store.aboutTitle}
            fontSize={aboutTitleSize} fontColor={store.aboutTitleColor || store.textColor}
            onTextChange={v => onUpdate?.("aboutTitle", v)}
            onFontSizeChange={v => onUpdate?.("aboutTitleSize", v)}
            onFontColorChange={v => onUpdate?.("aboutTitleColor", v)}
            isEditable={isEditable}
            className="font-black"
          />
          <EditableText
            tag="p" value={store.aboutText}
            fontSize={aboutBodySize} fontColor={store.aboutBodyColor || store.mutedTextColor}
            onTextChange={v => onUpdate?.("aboutText", v)}
            onFontSizeChange={v => onUpdate?.("aboutBodySize", v)}
            onFontColorChange={v => onUpdate?.("aboutBodyColor", v)}
            isEditable={isEditable}
            className={standalone ? "mt-4 text-justify" : "mt-4"}
          />
        </div>
        <ClickableImageZone
          value={store.bannerSecondary}
          onUpload={v => onUpdate?.("bannerSecondary", v)}
          isEditable={isEditable}
          className={`${standalone ? "min-h-[220px]" : "min-h-[280px]"} overflow-hidden rounded-[1.5rem]`}
          style={{ backgroundColor: store.backgroundColor }}
        >
          {store.bannerSecondary ? (
            <img src={store.bannerSecondary} alt="Banner secundario" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full min-h-[280px] items-center justify-center" style={{ color: store.mutedTextColor }}>
              <EditableText
                tag="span" value={store.bannerSecondaryLabel || "Banner secundario"}
                fontColor={textColor("bannerSecondaryLabelColor", store.mutedTextColor)}
                onTextChange={v => onUpdate?.("bannerSecondaryLabel", v)}
                onFontColorChange={v => onUpdate?.("bannerSecondaryLabelColor", v)}
                isEditable={isEditable}
                inline
              />
            </div>
          )}
        </ClickableImageZone>
      </section>}

      {/* Catalog */}
      {!marcaOnly && <section id="productos" className={`mx-auto max-w-6xl ${sectionPadding}`} style={{ backgroundColor: store.backgroundColor }}>
        <EditableText
          tag="p" value={store.catalogEyebrow}
          fontColor={textColor("catalogEyebrowColor", store.primaryColor)}
          onTextChange={v => onUpdate?.("catalogEyebrow", v)}
          onFontColorChange={v => onUpdate?.("catalogEyebrowColor", v)}
          isEditable={isEditable}
          className="text-sm font-black uppercase tracking-[0.2em]"
        />
        <EditableText
          tag="h2" value={store.catalogTitle}
          fontColor={textColor("catalogTitleColor", store.textColor)}
          onTextChange={v => onUpdate?.("catalogTitle", v)}
          onFontColorChange={v => onUpdate?.("catalogTitleColor", v)}
          isEditable={isEditable}
          className="mt-3 text-4xl font-black"
        />
        <EditableText
          tag="p" value={store.catalogText}
          fontColor={textColor("catalogTextColor", store.mutedTextColor)}
          onTextChange={v => onUpdate?.("catalogText", v)}
          onFontColorChange={v => onUpdate?.("catalogTextColor", v)}
          isEditable={isEditable}
          className="mt-3 max-w-2xl text-sm"
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
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
                className={`${standalone ? "h-44" : "h-56"} overflow-hidden rounded-[1.25rem]`}
                style={{ backgroundColor: store.backgroundColor }}
              >
                {product.image ? (
                  <img src={product.image} alt={product.name || "Producto"} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-56 items-center justify-center" style={{ color: store.mutedTextColor }}>
                    <EditableText
                      tag="span" value={product.imageLabel || "Imagen producto"}
                      fontColor={productTextColor(product, "imageLabelColor", store.mutedTextColor)}
                      onTextChange={v => updateProductField(index, "imageLabel", v)}
                      onFontColorChange={v => updateProductField(index, "imageLabelColor", v)}
                      isEditable={isEditable}
                      inline
                    />
                  </div>
                )}
              </ClickableImageZone>
              <EditableText
                tag="p" value={product.category || "Categoria"}
                fontColor={productTextColor(product, "categoryColor", store.primaryColor)}
                onTextChange={v => updateProductField(index, "category", v)}
                onFontColorChange={v => updateProductField(index, "categoryColor", v)}
                isEditable={isEditable}
                className="mt-4 text-xs font-black"
              />
              <EditableText
                tag="h3" value={product.name || "Nombre producto"}
                fontColor={productTextColor(product, "nameColor", store.textColor)}
                onTextChange={v => updateProductField(index, "name", v)}
                onFontColorChange={v => updateProductField(index, "nameColor", v)}
                isEditable={isEditable}
                className="mt-1 text-xl font-black"
              />
              <EditableText
                tag="p" value={product.description || "Descripcion del producto"}
                fontColor={productTextColor(product, "descriptionColor", store.mutedTextColor)}
                onTextChange={v => updateProductField(index, "description", v)}
                onFontColorChange={v => updateProductField(index, "descriptionColor", v)}
                isEditable={isEditable}
                className="mt-2 text-sm"
              />
              <EditableText
                tag="p" value={product.price ? formatProductPrice(product.price) : "$0"}
                fontColor={productTextColor(product, "priceColor", store.primaryColor)}
                onTextChange={v => updateProductField(index, "price", v.replace(/[^\d]/g, ""))}
                onFontColorChange={v => updateProductField(index, "priceColor", v)}
                isEditable={isEditable}
                className="mt-4 text-xl font-black"
              />
              <p className="text-sm" style={{ color: productTextColor(product, "stockLabelColor", store.mutedTextColor) }}>
                <EditableText
                  tag="span" value={product.stockLabel || "Stock:"}
                  fontColor={productTextColor(product, "stockLabelColor", store.mutedTextColor)}
                  onTextChange={v => updateProductField(index, "stockLabel", v)}
                  onFontColorChange={v => updateProductField(index, "stockLabelColor", v)}
                  isEditable={isEditable}
                  inline
                />{" "}
                <EditableText
                  tag="span" value={product.stock || "0"}
                  fontColor={productTextColor(product, "stockColor", store.mutedTextColor)}
                  onTextChange={v => updateProductField(index, "stock", v)}
                  onFontColorChange={v => updateProductField(index, "stockColor", v)}
                  isEditable={isEditable}
                  inline
                />
              </p>
              <button className="mt-5 w-full rounded-xl px-5 py-3 font-black"
                style={{ backgroundColor: store.primaryColor, color: store.buttonTextColor }}>
                <EditableText
                  tag="span" value={productButtonText}
                  fontColor={textColor("productCtaTextColor", store.buttonTextColor)}
                  onTextChange={v => onUpdate?.("productCtaText", v)}
                  onFontColorChange={v => onUpdate?.("productCtaTextColor", v)}
                  isEditable={isEditable}
                  inline
                />
              </button>
            </article>
          ))}
        </div>
      </section>}

      {/* Final CTA */}
      {!productsOnly && !marcaOnly && <section className={`${standalone ? "px-5 py-12 md:px-8" : "px-8 py-16"} text-center`} style={{ backgroundColor: store.surfaceColor }}>
        <EditableText
          tag="p" value={store.finalEyebrow}
          fontColor={textColor("finalEyebrowColor", store.primaryColor)}
          onTextChange={v => onUpdate?.("finalEyebrow", v)}
          onFontColorChange={v => onUpdate?.("finalEyebrowColor", v)}
          isEditable={isEditable}
          className="text-sm font-black uppercase tracking-[0.2em]"
        />
        <EditableText
          tag="h2" value={store.finalTitle}
          fontColor={textColor("finalTitleColor", store.textColor)}
          onTextChange={v => onUpdate?.("finalTitle", v)}
          onFontColorChange={v => onUpdate?.("finalTitleColor", v)}
          isEditable={isEditable}
          className="mx-auto mt-4 max-w-2xl text-4xl font-black"
        />
        {store.catalogPdf && !isEditable ? (
          <a
            href={store.catalogPdf}
            target="_blank"
            rel="noopener noreferrer"
            download="catalogo.pdf"
            className="mt-8 inline-block rounded-2xl px-10 py-4 font-black"
            style={{ backgroundColor: store.primaryColor, color: store.buttonTextColor, textDecoration: "none" }}
          >
            {store.finalCtaText || "Ver catálogo"}
          </a>
        ) : (
          <button className="mt-8 rounded-2xl px-10 py-4 font-black"
            style={{ backgroundColor: store.primaryColor, color: store.buttonTextColor }}>
            <EditableText
              tag="span" value={store.finalCtaText}
              fontColor={textColor("finalCtaTextColor", store.buttonTextColor)}
              onTextChange={v => onUpdate?.("finalCtaText", v)}
              onFontColorChange={v => onUpdate?.("finalCtaTextColor", v)}
              isEditable={isEditable}
              inline
            />
          </button>
        )}
        {isEditable && (
          <div style={{ marginTop: 16, display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <label style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 10, border: `1px dashed ${store.primaryColor}`, padding: "8px 18px", fontSize: "0.8rem", fontWeight: 700, color: store.primaryColor }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              {store.catalogPdf ? "Cambiar PDF" : "Subir PDF del catálogo"}
              <input
                type="file"
                accept="application/pdf"
                style={{ display: "none" }}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = ev => onUpdate?.("catalogPdf", ev.target.result);
                  reader.readAsDataURL(file);
                }}
              />
            </label>
            {store.catalogPdf && (
              <button
                type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={() => onUpdate?.("catalogPdf", "")}
                style={{ fontSize: "0.72rem", color: "#f87171", background: "none", border: "none", cursor: "pointer" }}
              >
                Quitar PDF
              </button>
            )}
          </div>
        )}
      </section>}
    </div>
  );
}
