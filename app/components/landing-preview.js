"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { buildMarketPrice, inferCurrencyFromOriginCountry, COUNTRY_PREFERENCE_STORAGE_KEY } from "@/lib/market-pricing";
import AiImageWizard from "@/app/components/ai-image-wizard";

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
          // Normalizar: quitar \n, nbsp ( ) y espacios dobles que contentEditable introduce
          const raw = ref.current?.innerText || "";
          const clean = raw.replace(/ /g, " ").replace(/\n/g, " ").replace(/\s{2,}/g, " ").trim();
          if (ref.current) ref.current.innerText = clean;
          onTextChange?.(clean);
        }
      }}
      style={{ position: "relative", display: inline ? "inline-block" : "block", ...wrapperStyle }}
    >
      {/* Portal a document.body: este bloque puede quedar dentro del <button> del
          CTA (ej. tarjeta de producto). Con position:fixed sigue siendo hijo del
          DOM, y <button> dentro de <button> es HTML inválido — provoca el warning
          de hidratación "cannot be a descendant of". Fuera del árbol, no aplica. */}
      {focused && typeof document !== "undefined" && createPortal(
        <div onMouseDown={e => e.preventDefault()}
          style={{ position: "fixed", top: toolbarPos.top, left: toolbarPos.left, zIndex: 9999, background: "#0c140c", border: "1px solid rgba(127, 224, 64, 0.5)", borderRadius: 10, padding: "7px 10px", display: "flex", gap: 6, alignItems: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.6)", whiteSpace: "nowrap" }}>
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
          {onTextChange && (
            <>
              <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.12)", margin: "0 2px" }} />
              <button
                type="button"
                title="Borrar texto"
                style={{ ...btnStyle, borderColor: "rgba(255,80,80,0.35)", color: "#f87171" }}
                onMouseDown={e => { e.preventDefault(); onTextChange(""); if (ref.current) ref.current.innerText = ""; }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              </button>
            </>
          )}
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
        </div>,
        document.body,
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
        style={{ ...computedStyle, outline: focused ? "2px dashed rgba(127, 224, 64, 0.6)" : "2px dashed transparent", outlineOffset: 4, borderRadius: 4, cursor: "text", minWidth: 40, position: "relative", zIndex: 1 }}
      />
    </Wrapper>
  );
}

function DraggableBlock({ xPct, yPct, onChange, isEditable, children, style }) {
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef(null);
  const nx = xPct || 0;
  const ny = yPct || 0;
  const hasMoved = nx !== 0 || ny !== 0;

  function startDrag(e) {
    if (!onChange) return;
    e.preventDefault();
    e.stopPropagation();
    const parent = containerRef.current?.parentElement;
    const pr = parent?.getBoundingClientRect() ?? { width: 1, height: 1, left: 0, top: 0 };
    // Convert current % offset back to px to find mouse anchor point
    const curLeftPx = nx * pr.width / 100;
    const curTopPx = ny * pr.height / 100;
    const anchorX = e.clientX - curLeftPx;
    const anchorY = e.clientY - curTopPx;
    setDragging(true);
    function onMove(ev) {
      const newX = Math.round((ev.clientX - anchorX) / pr.width * 1000) / 10;
      const newY = Math.round((ev.clientY - anchorY) / pr.height * 1000) / 10;
      onChange(newX, newY);
    }
    function onUp() {
      setDragging(false);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
    }
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointercancel", onUp);
  }

  // Use position:relative + top/left % — scales proportionally in editor preview AND published page
  // position:relative avoids creating a stacking context that breaks position:fixed EditableText toolbar
  const offsetStyle = hasMoved
    ? { position: "relative", top: `${ny}%`, left: `${nx}%` }
    : { position: "relative" };

  if (!isEditable) {
    return <div ref={containerRef} style={{ ...offsetStyle, ...style }}>{children}</div>;
  }

  function handleOuterMouseDown(e) {
    if (e.target.closest('[contenteditable]') || e.target.closest('button') || e.target.closest('input') || e.target.closest('a')) return;
    startDrag(e);
  }

  return (
    <div
      ref={containerRef}
      style={{ ...offsetStyle, cursor: dragging ? "grabbing" : "grab", userSelect: dragging ? "none" : undefined, ...style }}
      onPointerDown={handleOuterMouseDown}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => { if (!dragging) setHovering(false); }}
    >
      {/* Handle pill — siempre visible en edit mode */}
      <div style={{ position: "absolute", top: -38, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 5, zIndex: 200, pointerEvents: "auto", userSelect: "none" }}>
        <div
          onPointerDown={e => { e.stopPropagation(); startDrag(e); }}
          title="Arrastra para mover el bloque de texto"
          style={{ display: "flex", alignItems: "center", gap: 5, background: dragging ? "rgba(127,224,64,0.22)" : "rgba(0,0,0,0.85)", border: "1px solid rgba(127,224,64,0.6)", borderRadius: 20, padding: "4px 12px", fontSize: "0.63rem", color: "#7FE040", fontWeight: 800, whiteSpace: "nowrap", cursor: dragging ? "grabbing" : "grab", boxShadow: "0 2px 10px rgba(0,0,0,0.5)", touchAction: "none" }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"/></svg>
          Mover bloque
        </div>
        {hasMoved && (
          <button type="button" onPointerDown={e => { e.preventDefault(); e.stopPropagation(); onChange(0, 0); }}
            style={{ background: "rgba(0,0,0,0.85)", border: "1px solid rgba(255,100,100,0.5)", borderRadius: 12, padding: "4px 9px", color: "#f87171", fontSize: "0.6rem", fontWeight: 800, cursor: "pointer", userSelect: "none", boxShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
            ↩ Reset
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export function ClickableImageZone({ value, onUpload, isEditable, className, style, children, bannerLabel = "banner" }) {
  const [hovered, setHovered] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
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
    <>
      <div
        className={className}
        style={{ position: "relative", cursor: "pointer", ...style }}
        onClick={(e) => { if (e.target.isContentEditable || e.target.closest("[contenteditable]")) return; setShowWizard(true); }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {children}
        {hovered && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: "inherit", zIndex: 20, overflow: "hidden", pointerEvents: "none" }}>
            <div style={{ background: "#7FE040", borderRadius: 10, padding: "8px 18px", color: "#050505", fontSize: "0.78rem", fontWeight: 900 }}>
              ✦ Crear imagen
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem" }}>Subir o generar con IA</div>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} onClick={e => e.stopPropagation()} />
      </div>

      {showWizard && (
        <AiImageWizard
          bannerLabel={bannerLabel}
          onClose={() => setShowWizard(false)}
          onGenerated={(img) => { onUpload(img); setShowWizard(false); }}
          onUploadFile={() => fileRef.current?.click()}
        />
      )}
    </>
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
  const productButtonText = store.productCtaText || "Contactar";
  const textColor = (field, fallback) => store[field] || fallback;
  const productTextColor = (product, field, fallback) => product?.[field] || fallback;
  const shellClassName = standalone
    ? "w-full overflow-hidden"
    : `mx-auto overflow-hidden border border-white/10 ${fullWidth ? "max-w-7xl rounded-[2rem]" : "max-w-6xl rounded-[2rem]"}`;
  const sectionPadding = standalone ? "p-5 md:p-7" : "p-8";
  const heroClassName = standalone
    ? "relative bg-cover bg-center px-5 py-12 md:px-8 md:py-20"
    : "relative min-h-[520px] bg-cover bg-center px-8 py-16";
  const heroTitleSize = Math.min(store.heroTitleSize || 60, 72);
  const heroSubtitleSize = Math.min(store.heroSubtitleSize || 18, 24);
  const aboutTitleSize = Math.min(store.aboutTitleSize || 36, 48);
  const aboutBodySize = Math.min(store.aboutBodySize || 16, 22);
  const standalonePath = basePath.replace(/\/$/, "");
  const layout = store.layout || "overlay";

  function updateProductField(index, field, value) {
    const copy = [...products];
    copy[index] = { ...copy[index], [field]: value };
    onUpdate?.("__products__", copy);
  }

  const contactHandler = (product) => !isEditable ? () => {
    const raw = store.contactLink || "";
    if (!raw) return;
    const href = /^https?:\/\//i.test(raw) ? raw : `https://wa.me/${raw.replace(/\D/g,"")}?text=${encodeURIComponent(`Hola, me interesa el producto: ${product.name}`)}`;
    window.open(href, "_blank");
  } : undefined;

  const renderProductCard = (product, index) => {
    const imgZone = (cls, sty = {}) => (
      <ClickableImageZone value={product.image} onUpload={v => { const c=[...products]; c[index]={...c[index],image:v}; onUpdate?.("__products__",c); }} isEditable={isEditable} className={`overflow-hidden ${cls}`} style={{ backgroundColor: store.backgroundColor, ...sty }}>
        {product.image ? <img src={product.image} alt={product.name||"Producto"} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center" style={{ color: store.mutedTextColor, minHeight: 120 }}><EditableText tag="span" value={product.imageLabel||"Imagen"} fontColor={productTextColor(product,"imageLabelColor",store.mutedTextColor)} onTextChange={v=>updateProductField(index,"imageLabel",v)} onFontColorChange={v=>updateProductField(index,"imageLabelColor",v)} isEditable={isEditable} inline /></div>}
      </ClickableImageZone>
    );
    const cat = <EditableText tag="p" value={product.category||"Categoría"} fontColor={productTextColor(product,"categoryColor",store.primaryColor)} onTextChange={v=>updateProductField(index,"category",v)} onFontColorChange={v=>updateProductField(index,"categoryColor",v)} isEditable={isEditable} className="text-xs font-black uppercase tracking-widest" />;
    const name = <EditableText tag="h3" value={product.name||"Nombre producto"} fontColor={productTextColor(product,"nameColor",store.textColor)} onTextChange={v=>updateProductField(index,"name",v)} onFontColorChange={v=>updateProductField(index,"nameColor",v)} isEditable={isEditable} className="mt-1 font-black leading-tight" style={{ fontSize: "1.1rem" }} />;
    const desc = <EditableText tag="p" value={product.description||"Descripción del producto"} fontColor={productTextColor(product,"descriptionColor",store.mutedTextColor)} onTextChange={v=>updateProductField(index,"description",v)} onFontColorChange={v=>updateProductField(index,"descriptionColor",v)} isEditable={isEditable} className="mt-2 text-sm" />;
    const ctaBtn = (full = true) => (
      <button className={`${full?"w-full":""}  rounded-xl px-5 py-3 font-black text-sm`} style={{ backgroundColor: store.primaryColor, color: store.buttonTextColor, cursor:"pointer", whiteSpace:"nowrap" }} onClick={contactHandler(product)}>
        <EditableText tag="span" value={productButtonText} fontColor={textColor("productCtaTextColor",store.buttonTextColor)} onTextChange={v=>onUpdate?.("productCtaText",v)} onFontColorChange={v=>onUpdate?.("productCtaTextColor",v)} isEditable={isEditable} inline />
      </button>
    );

    /* ── FEATURE (Noche): horizontal row ── */
    if (layout === "feature") return (
      <article key={index} style={{ display:"flex", gap: 20, alignItems:"center", padding:"20px 0", borderBottom:`1px solid ${hexToRgba(store.textColor,0.07)}` }}>
        {imgZone("rounded-2xl shrink-0", { width:120, height:120, minWidth:120 })}
        <div style={{ flex:1, minWidth:0 }}>
          {cat}
          {name}
          {desc}
        </div>
        <div style={{ flexShrink:0, paddingLeft:12 }}>{ctaBtn(false)}</div>
      </article>
    );

    /* ── MAGAZINE (Coral): first product is featured full-width ── */
    if (layout === "magazine" && index === 0) return (
      <article key={index} style={{ gridColumn:"1 / -1", display:"grid", gridTemplateColumns:"55% 45%", borderRadius:24, overflow:"hidden", border:`1px solid ${hexToRgba(store.textColor,0.07)}` }}>
        {imgZone("h-full", { minHeight:280 })}
        <div style={{ padding:"40px 36px", backgroundColor: store.surfaceColor, display:"flex", flexDirection:"column", justifyContent:"center" }}>
          {cat}
          <EditableText tag="h3" value={product.name||"Nombre producto"} fontColor={productTextColor(product,"nameColor",store.textColor)} onTextChange={v=>updateProductField(index,"name",v)} onFontColorChange={v=>updateProductField(index,"nameColor",v)} isEditable={isEditable} style={{ fontSize:"1.8rem", fontWeight:900, lineHeight:1.1, margin:"10px 0 14px" }} />
          {desc}
          <div style={{ marginTop:24 }}>{ctaBtn(false)}</div>
        </div>
      </article>
    );

    /* ── SPLIT (Océano): card with top accent border ── */
    if (layout === "split") return (
      <article key={index} style={{ borderRadius:20, overflow:"hidden", borderTop:`3px solid ${store.primaryColor}`, background: store.surfaceColor }}>
        {imgZone(`${standalone?"h-44":"h-56"} rounded-none`)}
        <div style={{ padding:"20px 20px 24px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <span style={{ fontSize:"0.65rem", fontWeight:900, textTransform:"uppercase", letterSpacing:"0.16em", color: store.primaryColor }}>{product.category||"Categoría"}</span>
          </div>
          {name}
          {desc}
          <div style={{ marginTop:16 }}>{ctaBtn()}</div>
        </div>
      </article>
    );

    /* ── CENTERED (Bosque): generous whitespace, minimal border ── */
    if (layout === "centered") return (
      <article key={index} style={{ borderRadius:24, overflow:"hidden", background: store.surfaceColor, border:`1px solid ${hexToRgba(store.textColor,0.07)}` }}>
        {imgZone(`${standalone?"h-56":"h-72"} rounded-none`)}
        <div style={{ padding:"24px 24px 28px" }}>
          {cat}
          {name}
          <div style={{ width:32, height:2, background: store.primaryColor, margin:"12px 0" }} />
          {desc}
          <div style={{ marginTop:20 }}>{ctaBtn()}</div>
        </div>
      </article>
    );

    /* ── OVERLAY (Fuego / default): standard clean card ── */
    return (
      <article key={index} style={{ borderRadius:24, overflow:"hidden", background: store.surfaceColor, boxShadow:`0 2px 16px ${hexToRgba(store.textColor,0.06)}` }}>
        {imgZone(`${standalone?"h-44":"h-56"} rounded-none`)}
        <div style={{ padding:"18px 20px 22px" }}>
          {cat}
          {name}
          {desc}
          <div style={{ marginTop:16 }}>{ctaBtn()}</div>
        </div>
      </article>
    );
  };

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

      {/* Hero — layout-aware */}
      {!productsOnly && !marcaOnly && (() => {
        const heroBlockXPct = store.heroBlock?.xPct || 0;
        const heroBlockYPct = store.heroBlock?.yPct || 0;
        const heroBlockChange = isEditable ? (xPct, yPct) => onUpdate?.("heroBlock", { xPct, yPct }) : null;

        const imgUploadBtn = isEditable && (
          <ClickableImageZone value={store.heroImage} onUpload={v => onUpdate?.("heroImage", v)} isEditable={isEditable}
            style={{ position: "absolute", top: 12, right: 12, zIndex: 30, borderRadius: 12, overflow: "hidden", width: 44, height: 44, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(127,224,64,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7FE040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </ClickableImageZone>
        );
        const imgPosControls = isEditable && store.heroImage && (
          <div style={{ position: "absolute", top: 12, right: 64, zIndex: 30, display: "flex", gap: 4 }}>
            {[["←","heroImageX",-10,0],["↑","heroImageY",-10,0],["↓","heroImageY",10,100],["→","heroImageX",10,100]].map(([label,field,delta,clamp],i)=>(
              <button key={i} type="button" title={label} onClick={() => onUpdate?.(field, delta<0 ? Math.max(clamp,(store[field]??50)+delta) : Math.min(clamp,(store[field]??50)+delta))}
                style={{ width:36,height:36,borderRadius:10,background:"rgba(0,0,0,0.6)",border:"1px solid rgba(255,255,255,0.2)",color:"#fff",fontSize:"1rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>{label}</button>
            ))}
            <button type="button" title="Eliminar imagen" onClick={() => onUpdate?.("heroImage", "")}
              style={{ width:36,height:36,borderRadius:10,background:"rgba(180,20,20,0.75)",border:"1px solid rgba(255,100,100,0.3)",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </button>
          </div>
        );
        const heroTextContent = (centered = false, dark = false) => (
          <>
            {(store.promoText || isEditable) && (
              <span className="rounded-full px-4 py-2 text-sm font-black" style={{ display: "inline-block", backgroundColor: dark ? hexToRgba(store.primaryColor,0.25) : primarySoft, color: dark ? "#fff" : store.primaryColor }}>
                <EditableText tag="span" value={store.promoText} fontColor={textColor("promoTextColor", dark ? "#fff" : store.primaryColor)} onTextChange={v => onUpdate?.("promoText", v)} onFontColorChange={v => onUpdate?.("promoTextColor", v)} isEditable={isEditable} inline />
              </span>
            )}
            <EditableText tag="h1" value={store.heroTitle} fontSize={heroTitleSize} fontColor={store.heroTitleColor || (dark ? "#fff" : store.textColor)} onTextChange={v => onUpdate?.("heroTitle", v)} onFontSizeChange={v => onUpdate?.("heroTitleSize", v)} onFontColorChange={v => onUpdate?.("heroTitleColor", v)} isEditable={isEditable} className={`mt-6 font-black leading-none ${centered ? "mx-auto" : "max-w-3xl"}`} />
            <EditableText tag="p" value={store.heroSubtitle} fontSize={heroSubtitleSize} fontColor={store.heroSubtitleColor || (dark ? "rgba(255,255,255,0.7)" : store.mutedTextColor)} onTextChange={v => onUpdate?.("heroSubtitle", v)} onFontSizeChange={v => onUpdate?.("heroSubtitleSize", v)} onFontColorChange={v => onUpdate?.("heroSubtitleColor", v)} isEditable={isEditable} className={`mt-4 ${centered ? "mx-auto max-w-lg" : "max-w-xl"}`} />
            <div className={`mt-8 flex gap-3 ${centered ? "justify-center" : ""} flex-wrap`}>
              <button className="rounded-2xl px-8 py-4 font-black" style={{ backgroundColor: store.primaryColor, color: store.buttonTextColor }}>
                <EditableText tag="span" value={store.ctaText} fontColor={textColor("ctaTextColor", store.buttonTextColor)} onTextChange={v => onUpdate?.("ctaText", v)} onFontColorChange={v => onUpdate?.("ctaTextColor", v)} isEditable={isEditable} inline />
              </button>
              <button className="rounded-2xl px-8 py-4 font-black" style={{ border: `1px solid ${dark ? "rgba(255,255,255,0.2)" : hexToRgba(store.textColor,0.15)}`, color: dark ? "#fff" : store.textColor, background: "transparent" }}>
                <EditableText tag="span" value={store.secondaryCtaText} fontColor={textColor("secondaryCtaTextColor", dark ? "#fff" : store.textColor)} onTextChange={v => onUpdate?.("secondaryCtaText", v)} onFontColorChange={v => onUpdate?.("secondaryCtaTextColor", v)} isEditable={isEditable} inline />
              </button>
            </div>
          </>
        );

        /* ── SPLIT (Océano): text left | image right explicit ── */
        if (layout === "split") return (
          <section id="inicio" style={{ display: "grid", gridTemplateColumns: standalone ? "1fr 1fr" : "1fr 1fr", backgroundColor: store.backgroundColor, minHeight: standalone ? "clamp(520px,68vh,760px)" : 520, position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: standalone ? "56px 40px 56px 56px" : "56px 40px" }}>
              <DraggableBlock xPct={heroBlockXPct} yPct={heroBlockYPct} onChange={heroBlockChange} isEditable={isEditable}>
                {heroTextContent()}
              </DraggableBlock>
            </div>
            <div style={{ position: "relative", overflow: "hidden" }}>
              {imgUploadBtn}
              {imgPosControls}
              {store.heroImage
                ? <img src={store.heroImage} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: `${store.heroImageX??50}% ${store.heroImageY??50}%` }} />
                : <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${store.gradientFromColor||store.primaryColor}, ${store.gradientToColor||store.primaryColor})` }} />
              }
            </div>
          </section>
        );

        /* ── CENTERED (Bosque): full-width centered text, gradient bg ── */
        if (layout === "centered") return (
          <section id="inicio" style={{ position: "relative", backgroundColor: store.backgroundColor, backgroundImage: store.heroImage ? `url(${store.heroImage})` : `radial-gradient(ellipse at 50% -10%, ${primaryGlow}, transparent 55%), radial-gradient(ellipse at 80% 100%, ${hexToRgba(store.primaryColor,0.12)}, transparent 40%)`, backgroundSize: "cover", backgroundPosition: `${store.heroImageX??50}% ${store.heroImageY??50}%`, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: standalone ? "clamp(520px,68vh,760px)" : 520, padding: standalone ? "72px 24px" : "80px 32px" }}>
            {imgUploadBtn}
            {imgPosControls}
            <div style={{ maxWidth: 780, width: "100%", margin: "0 auto" }}>
              <DraggableBlock xPct={heroBlockXPct} yPct={heroBlockYPct} onChange={heroBlockChange} isEditable={isEditable}>
                {heroTextContent(true)}
              </DraggableBlock>
            </div>
          </section>
        );

        /* ── FEATURE (Noche): full-bleed bg + text anchored bottom-left ── */
        if (layout === "feature") return (
          <section id="inicio" style={{
            position: "relative", overflow: "hidden",
            backgroundColor: store.backgroundColor,
            backgroundImage: store.heroImage
              ? `url(${store.heroImage})`
              : `linear-gradient(160deg, ${store.gradientFromColor||store.primaryColor} 0%, ${store.gradientToColor||store.primaryColor} 100%)`,
            backgroundSize: "cover",
            backgroundPosition: store.heroImage ? `${store.heroImageX??50}% ${store.heroImageY??50}%` : "center",
            minHeight: standalone ? "clamp(520px,68vh,760px)" : 520,
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
          }}>
            {imgUploadBtn}
            {imgPosControls}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 55%, transparent 85%)" }} />
            <div style={{ position: "relative", zIndex: 2, padding: standalone ? "56px 48px" : "56px 40px", maxWidth: "58%" }}>
              <DraggableBlock xPct={heroBlockXPct} yPct={heroBlockYPct} onChange={heroBlockChange} isEditable={isEditable}>
                {(store.promoText || isEditable) && (
                  <span className="rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest mb-6 self-start" style={{ backgroundColor: hexToRgba(store.primaryColor,0.25), color: store.primaryColor, letterSpacing: "0.2em", display: "inline-block" }}>
                    <EditableText tag="span" value={store.promoText} fontColor={textColor("promoTextColor", store.primaryColor)} onTextChange={v => onUpdate?.("promoText", v)} onFontColorChange={v => onUpdate?.("promoTextColor", v)} isEditable={isEditable} inline />
                  </span>
                )}
                <EditableText tag="h1" value={store.heroTitle} fontSize={Math.min((heroTitleSize*1.25)|0, 80)} fontColor={store.heroTitleColor||"#fff"} onTextChange={v => onUpdate?.("heroTitle", v)} onFontSizeChange={v => onUpdate?.("heroTitleSize", v)} onFontColorChange={v => onUpdate?.("heroTitleColor", v)} isEditable={isEditable} className="font-black leading-none" />
                <div style={{ width: 48, height: 4, borderRadius: 2, background: store.primaryColor, margin: "20px 0" }} />
                <EditableText tag="p" value={store.heroSubtitle} fontSize={heroSubtitleSize} fontColor={store.heroSubtitleColor||"rgba(255,255,255,0.72)"} onTextChange={v => onUpdate?.("heroSubtitle", v)} onFontSizeChange={v => onUpdate?.("heroSubtitleSize", v)} onFontColorChange={v => onUpdate?.("heroSubtitleColor", v)} isEditable={isEditable} className="max-w-md mb-8" />
                <button className="rounded-2xl px-8 py-4 font-black self-start" style={{ backgroundColor: store.primaryColor, color: store.buttonTextColor }}>
                  <EditableText tag="span" value={store.ctaText} fontColor={textColor("ctaTextColor", store.buttonTextColor)} onTextChange={v => onUpdate?.("ctaText", v)} onFontColorChange={v => onUpdate?.("ctaTextColor", v)} isEditable={isEditable} inline />
                </button>
              </DraggableBlock>
            </div>
          </section>
        );

        /* ── MAGAZINE (Coral): bg image full + accent stripe bottom ── */
        if (layout === "magazine") return (
          <section id="inicio" style={{ position: "relative", overflow: "hidden", backgroundColor: store.backgroundColor, backgroundImage: store.heroImage ? `url(${store.heroImage})` : `linear-gradient(135deg, ${store.gradientFromColor||store.primaryColor} 0%, ${store.gradientToColor||store.primaryColor} 100%)`, backgroundSize: "cover", backgroundPosition: `${store.heroImageX??50}% ${store.heroImageY??50}%`, minHeight: standalone ? "clamp(520px,68vh,760px)" : 520, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            {imgUploadBtn}
            {imgPosControls}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }} />
            <div style={{ position: "relative", zIndex: 2, padding: standalone ? "0 48px 48px" : "0 40px 56px", maxWidth: 800 }}>
              <DraggableBlock xPct={heroBlockXPct} yPct={heroBlockYPct} onChange={heroBlockChange} isEditable={isEditable}>
                {(store.promoText || isEditable) && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: store.primaryColor, color: store.buttonTextColor, borderRadius: 8, padding: "4px 14px 4px 6px", marginBottom: 20 }}>
                    <span style={{ width: 20, height: 20, borderRadius: 4, background: "rgba(255,255,255,0.3)", display: "inline-block" }} />
                    <EditableText tag="span" value={store.promoText} fontColor={textColor("promoTextColor", store.buttonTextColor)} onTextChange={v => onUpdate?.("promoText", v)} onFontColorChange={v => onUpdate?.("promoTextColor", v)} isEditable={isEditable} inline style={{ fontSize: "0.8rem", fontWeight: 900, letterSpacing: "0.1em" }} />
                  </div>
                )}
                <EditableText tag="h1" value={store.heroTitle} fontSize={heroTitleSize} fontColor={store.heroTitleColor||"#fff"} onTextChange={v => onUpdate?.("heroTitle", v)} onFontSizeChange={v => onUpdate?.("heroTitleSize", v)} onFontColorChange={v => onUpdate?.("heroTitleColor", v)} isEditable={isEditable} className="font-black leading-none max-w-3xl" />
                <EditableText tag="p" value={store.heroSubtitle} fontSize={heroSubtitleSize} fontColor={store.heroSubtitleColor||"rgba(255,255,255,0.7)"} onTextChange={v => onUpdate?.("heroSubtitle", v)} onFontSizeChange={v => onUpdate?.("heroSubtitleSize", v)} onFontColorChange={v => onUpdate?.("heroSubtitleColor", v)} isEditable={isEditable} className="mt-4 max-w-xl" />
                <div className="mt-8 flex gap-3 flex-wrap">
                  <button className="rounded-2xl px-8 py-4 font-black" style={{ backgroundColor: store.primaryColor, color: store.buttonTextColor }}>
                    <EditableText tag="span" value={store.ctaText} fontColor={textColor("ctaTextColor", store.buttonTextColor)} onTextChange={v => onUpdate?.("ctaText", v)} onFontColorChange={v => onUpdate?.("ctaTextColor", v)} isEditable={isEditable} inline />
                  </button>
                  <button className="rounded-2xl px-8 py-4 font-black" style={{ border: "1px solid rgba(255,255,255,0.3)", color: "#fff", background: "transparent" }}>
                    <EditableText tag="span" value={store.secondaryCtaText} fontColor={textColor("secondaryCtaTextColor","#fff")} onTextChange={v => onUpdate?.("secondaryCtaText", v)} onFontColorChange={v => onUpdate?.("secondaryCtaTextColor", v)} isEditable={isEditable} inline />
                  </button>
                </div>
              </DraggableBlock>
            </div>
          </section>
        );

        /* ── OVERLAY (default / Fuego): text overlay on bg image ── */
        return (
          <section id="inicio" className={heroClassName} style={{ minHeight: standalone ? "clamp(520px,68vh,760px)" : undefined, backgroundColor: store.backgroundColor, backgroundImage: store.heroImage ? `url(${store.heroImage})` : `radial-gradient(circle at 75% 25%, ${primaryGlow}, transparent 35%)`, backgroundSize: store.heroImage ? "cover" : undefined, backgroundPosition: store.heroImage ? `${store.heroImageX??50}% ${store.heroImageY??50}%` : undefined }}>
            {imgUploadBtn}
            {imgPosControls}
            <div className={`${standalone ? "mx-auto w-full max-w-6xl" : "max-w-3xl"} p-2`}>
              <div className={standalone ? "max-w-xl" : ""}>
              <DraggableBlock xPct={heroBlockXPct} yPct={heroBlockYPct} onChange={heroBlockChange} isEditable={isEditable}>
                {heroTextContent()}
              </DraggableBlock>
            </div>
            </div>
          </section>
        );
      })()}

      {!productsOnly && !marcaOnly && (() => {
        const benefits = [[store.benefit1,store.benefit1Text],[store.benefit2,store.benefit2Text],[store.benefit3,store.benefit3Text]];
        /* split (Océano): numbered list — 01 02 03 style */
        if (layout === "split") return (
          <section className={`mx-auto max-w-6xl ${sectionPadding}`} style={{ backgroundColor: store.backgroundColor }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background: hexToRgba(store.textColor,0.08), borderRadius:20, overflow:"hidden" }}>
              {benefits.map(([b,d],i) => (
                <div key={i} style={{ background: store.surfaceColor, padding:"28px 28px 32px" }}>
                  <span style={{ fontSize:"0.65rem", fontWeight:900, letterSpacing:"0.2em", color: store.primaryColor }}>0{i+1}</span>
                  <EditableText tag="h4" value={b} fontColor={textColor(`benefit${i+1}Color`,store.textColor)} onTextChange={v=>onUpdate?.(`benefit${i+1}`,v)} onFontColorChange={v=>onUpdate?.(`benefit${i+1}Color`,v)} isEditable={isEditable} className="font-black mt-3" style={{ fontSize:"1rem" }} />
                  <EditableText tag="p" value={d} fontColor={textColor(`benefit${i+1}TextColor`,store.mutedTextColor)} onTextChange={v=>onUpdate?.(`benefit${i+1}Text`,v)} onFontColorChange={v=>onUpdate?.(`benefit${i+1}TextColor`,v)} isEditable={isEditable} className="mt-2 text-sm" />
                </div>
              ))}
            </div>
          </section>
        );
        /* centered (Bosque): horizontal thin text rows, no cards */
        if (layout === "centered") return (
          <section className={`mx-auto max-w-3xl ${sectionPadding} text-center`} style={{ backgroundColor: store.backgroundColor }}>
            <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
              {benefits.map(([b,d],i) => (
                <div key={i} style={{ padding:"20px 0", borderBottom: i<2 ? `1px solid ${hexToRgba(store.textColor,0.07)}` : "none", display:"flex", alignItems:"baseline", gap:24, textAlign:"left" }}>
                  <span style={{ fontSize:"1.8rem", fontWeight:900, color: store.primaryColor, lineHeight:1, flexShrink:0, width:32, textAlign:"right" }}>·</span>
                  <div>
                    <EditableText tag="h4" value={b} fontColor={textColor(`benefit${i+1}Color`,store.textColor)} onTextChange={v=>onUpdate?.(`benefit${i+1}`,v)} onFontColorChange={v=>onUpdate?.(`benefit${i+1}Color`,v)} isEditable={isEditable} className="font-black" />
                    <EditableText tag="p" value={d} fontColor={textColor(`benefit${i+1}TextColor`,store.mutedTextColor)} onTextChange={v=>onUpdate?.(`benefit${i+1}Text`,v)} onFontColorChange={v=>onUpdate?.(`benefit${i+1}TextColor`,v)} isEditable={isEditable} className="mt-1 text-sm" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
        /* feature (Noche): left-border accent bars */
        if (layout === "feature") return (
          <section className={`mx-auto max-w-6xl ${sectionPadding}`} style={{ backgroundColor: store.backgroundColor }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
              {benefits.map(([b,d],i) => (
                <div key={i} style={{ paddingLeft:20, borderLeft:`3px solid ${store.primaryColor}` }}>
                  <EditableText tag="h4" value={b} fontColor={textColor(`benefit${i+1}Color`,store.textColor)} onTextChange={v=>onUpdate?.(`benefit${i+1}`,v)} onFontColorChange={v=>onUpdate?.(`benefit${i+1}Color`,v)} isEditable={isEditable} className="font-black" />
                  <EditableText tag="p" value={d} fontColor={textColor(`benefit${i+1}TextColor`,store.mutedTextColor)} onTextChange={v=>onUpdate?.(`benefit${i+1}Text`,v)} onFontColorChange={v=>onUpdate?.(`benefit${i+1}TextColor`,v)} isEditable={isEditable} className="mt-2 text-sm" />
                </div>
              ))}
            </div>
          </section>
        );
        /* magazine (Coral): minimal, no cards, just text columns */
        if (layout === "magazine") return (
          <section className={`mx-auto max-w-6xl ${sectionPadding}`} style={{ backgroundColor: store.backgroundColor, borderTop:`1px solid ${hexToRgba(store.textColor,0.07)}`, borderBottom:`1px solid ${hexToRgba(store.textColor,0.07)}` }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:32 }}>
              {benefits.map(([b,d],i) => (
                <div key={i}>
                  <div style={{ width:24, height:2, background:store.primaryColor, marginBottom:14 }} />
                  <EditableText tag="h4" value={b} fontColor={textColor(`benefit${i+1}Color`,store.textColor)} onTextChange={v=>onUpdate?.(`benefit${i+1}`,v)} onFontColorChange={v=>onUpdate?.(`benefit${i+1}Color`,v)} isEditable={isEditable} className="font-black text-sm uppercase tracking-wider" />
                  <EditableText tag="p" value={d} fontColor={textColor(`benefit${i+1}TextColor`,store.mutedTextColor)} onTextChange={v=>onUpdate?.(`benefit${i+1}Text`,v)} onFontColorChange={v=>onUpdate?.(`benefit${i+1}TextColor`,v)} isEditable={isEditable} className="mt-2 text-sm" />
                </div>
              ))}
            </div>
          </section>
        );
        /* overlay (Fuego / default): rounded shadow cards */
        return (
          <section className={`mx-auto grid max-w-6xl gap-4 ${sectionPadding} md:grid-cols-3`} style={{ backgroundColor: store.backgroundColor }}>
            {benefits.map(([b,d],i) => (
              <div key={i} style={{ borderRadius:20, padding:"24px 22px", backgroundColor: store.surfaceColor, boxShadow:`0 2px 16px ${hexToRgba(store.textColor,0.05)}` }}>
                <div style={{ width:36, height:36, borderRadius:10, background: hexToRgba(store.primaryColor,0.12), display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
                  <div style={{ width:14, height:14, borderRadius:"50%", background: store.primaryColor }} />
                </div>
                <EditableText tag="h4" value={b} fontColor={textColor(`benefit${i+1}Color`,store.textColor)} onTextChange={v=>onUpdate?.(`benefit${i+1}`,v)} onFontColorChange={v=>onUpdate?.(`benefit${i+1}Color`,v)} isEditable={isEditable} className="font-black" />
                <EditableText tag="p" value={d} fontColor={textColor(`benefit${i+1}TextColor`,store.mutedTextColor)} onTextChange={v=>onUpdate?.(`benefit${i+1}Text`,v)} onFontColorChange={v=>onUpdate?.(`benefit${i+1}TextColor`,v)} isEditable={isEditable} className="mt-2 text-sm" />
              </div>
            ))}
          </section>
        );
      })()}

      {!productsOnly && (() => {
        const aboutText = (
          <>
            <EditableText tag="h2" value={store.aboutTitle} fontSize={aboutTitleSize} fontColor={store.aboutTitleColor||store.textColor} onTextChange={v=>onUpdate?.("aboutTitle",v)} onFontSizeChange={v=>onUpdate?.("aboutTitleSize",v)} onFontColorChange={v=>onUpdate?.("aboutTitleColor",v)} isEditable={isEditable} className="font-black" />
            <EditableText tag="p" value={store.aboutText} fontSize={aboutBodySize} fontColor={store.aboutBodyColor||store.mutedTextColor} onTextChange={v=>onUpdate?.("aboutText",v)} onFontSizeChange={v=>onUpdate?.("aboutBodySize",v)} onFontColorChange={v=>onUpdate?.("aboutBodyColor",v)} isEditable={isEditable} className={standalone?"mt-4 text-justify":"mt-4"} />
          </>
        );
        const aboutImage = (
          <ClickableImageZone value={store.bannerSecondary} onUpload={v=>onUpdate?.("bannerSecondary",v)} isEditable={isEditable} bannerLabel="imagen" className="overflow-hidden rounded-[1.5rem]" style={{ backgroundColor: store.backgroundColor, position: "relative", height: "clamp(280px, 42vh, 500px)" }}>
            {store.bannerSecondary
              ? <img src={store.bannerSecondary} alt="Banner secundario" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              : <div className="flex h-full items-center justify-center" style={{ color: store.mutedTextColor, minHeight: 280 }}><EditableText tag="span" value={store.bannerSecondaryLabel||"Banner secundario"} fontColor={textColor("bannerSecondaryLabelColor",store.mutedTextColor)} onTextChange={v=>onUpdate?.("bannerSecondaryLabel",v)} onFontColorChange={v=>onUpdate?.("bannerSecondaryLabelColor",v)} isEditable={isEditable} inline /></div>}
          </ClickableImageZone>
        );
        /* centered: single column */
        if (layout === "centered") return (
          <section id="marca" className={`mx-auto max-w-4xl ${sectionPadding} text-center`}>
            <EditableText tag="h2" value={store.aboutTitle} fontSize={aboutTitleSize} fontColor={store.aboutTitleColor||store.textColor} onTextChange={v=>onUpdate?.("aboutTitle",v)} onFontSizeChange={v=>onUpdate?.("aboutTitleSize",v)} onFontColorChange={v=>onUpdate?.("aboutTitleColor",v)} isEditable={isEditable} className="font-black" />
            <EditableText tag="p" value={store.aboutText} fontSize={aboutBodySize} fontColor={store.aboutBodyColor||store.mutedTextColor} onTextChange={v=>onUpdate?.("aboutText",v)} onFontSizeChange={v=>onUpdate?.("aboutBodySize",v)} onFontColorChange={v=>onUpdate?.("aboutBodyColor",v)} isEditable={isEditable} className="mt-4 mx-auto max-w-2xl" />
            <div style={{ width: 64, height: 4, borderRadius: 2, background: store.primaryColor, margin: "28px auto 0" }} />
          </section>
        );
        /* split: image left, text right */
        if (layout === "split") return (
          <section id="marca" className={`mx-auto grid max-w-6xl gap-7 ${sectionPadding} md:grid-cols-2`} style={{ alignItems: "center" }}>
            {aboutImage}
            <div>{aboutText}</div>
          </section>
        );
        /* feature: full-width panel with accent bar */
        if (layout === "feature") return (
          <section id="marca" style={{ backgroundColor: store.surfaceColor }}>
            <div className={`mx-auto max-w-6xl ${sectionPadding}`} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
              <div>
                <div style={{ width: 40, height: 4, borderRadius: 2, background: store.primaryColor, marginBottom: 20 }} />
                {aboutText}
              </div>
              {aboutImage}
            </div>
          </section>
        );
        /* magazine: 3 columns — image, title, body */
        if (layout === "magazine") return (
          <section id="marca" className={`mx-auto max-w-6xl ${sectionPadding}`} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, alignItems: "start" }}>
            <div style={{ gridColumn: "1 / 2" }}>{aboutImage}</div>
            <div style={{ gridColumn: "2 / 4" }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: store.primaryColor, marginBottom: 16 }} />
              {aboutText}
            </div>
          </section>
        );
        /* overlay (default): text left, image right */
        return (
          <section id="marca" className={`mx-auto grid max-w-6xl gap-7 ${sectionPadding} md:grid-cols-2`} style={{ alignItems: "center" }}>
            <div>{aboutText}</div>
            {aboutImage}
          </section>
        );
      })()}

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
        <div className={`mt-8 ${layout === "feature" ? "" : "grid"} ${layout === "centered" ? "gap-8 md:grid-cols-2" : layout === "feature" ? "" : layout === "magazine" ? "gap-6 md:grid-cols-2" : "gap-5 md:grid-cols-3"}`}
          style={layout === "feature" ? { display:"flex", flexDirection:"column", gap:0 } : {}}>
          {products.map(renderProductCard)}
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
