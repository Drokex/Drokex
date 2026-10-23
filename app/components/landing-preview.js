"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { buildMarketPrice, inferCurrencyFromOriginCountry, COUNTRY_PREFERENCE_STORAGE_KEY } from "@/lib/market-pricing";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ImagePlus, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, ZoomIn, ZoomOut, Trash2, Camera, SlidersHorizontal, X, RotateCcw, Play } from "lucide-react";
import AiImageWizard from "@/app/components/ai-image-wizard";
import { uploadImage } from "@/app/proveedor-pro/upload-image";

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
    return <div ref={containerRef} data-hero-text style={{ ...offsetStyle, ...style }}>{children}</div>;
  }

  function handleOuterMouseDown(e) {
    if (e.target.closest('[contenteditable]') || e.target.closest('button') || e.target.closest('input') || e.target.closest('a')) return;
    startDrag(e);
  }

  return (
    <div
      ref={containerRef}
      data-hero-text
      style={{ ...offsetStyle, cursor: dragging ? "grabbing" : "grab", userSelect: dragging ? "none" : undefined, ...style }}
      onPointerDown={handleOuterMouseDown}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => { if (!dragging) setHovering(false); }}
    >
      {/* Handle pill — siempre visible en edit mode */}
      <div data-drag-handle style={{ position: "absolute", top: -38, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 5, zIndex: 200, pointerEvents: "auto", userSelect: "none" }}>
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

export const HERO_FX_DEFAULTS = { heroOverlay: "none", heroOverlayStrength: 40, heroMotion: "none", heroFilter: "none", heroGrain: false, heroBlend: false, heroEntrance: "none" };

// Entrada del texto del hero. El título se parte en letras solo durante la animación y se
// restaura al terminar (EditableText escribe con innerText, así que el editor no se rompe).
function useHeroTextEntrance(rootRef, mode, replay) {
  useEffect(() => {
    const root = rootRef.current;
    // El SSR deja el texto oculto (data-hero-entrance) para que no parpadee antes de animar
    const ready = () => root?.setAttribute("data-hero-entrance-ready", "");
    const block = root?.querySelector("#inicio [data-hero-text]");
    if (!block || !mode || mode === "none" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return ready();
    gsap.registerPlugin(SplitText);
    const items = [...block.children].filter((c) => !c.hasAttribute("data-drag-handle"));
    const title = items.find((c) => c.matches("h1") || c.querySelector("h1"));
    const titleEl = title && (title.matches("h1") ? title : title.querySelector("h1"));
    const rest = items.filter((c) => c !== title);
    const clear = "opacity,transform,filter";
    let split;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => { split?.revert(); split = null; gsap.set(items, { clearProps: clear }); } });
      if (mode === "fadeup") {
        tl.from(items, { opacity: 0, y: 28, duration: 0.7, ease: "power3.out", stagger: 0.12 });
      } else if (mode === "blur") {
        tl.from(items, { opacity: 0, filter: "blur(14px)", scale: 1.03, duration: 0.9, ease: "power2.out", stagger: 0.12 });
      } else if (titleEl) {
        split = SplitText.create(titleEl, { type: "words,chars", mask: mode === "letters" ? "words" : undefined });
        if (mode === "letters") tl.from(split.chars, { yPercent: 110, duration: 0.7, ease: "power4.out", stagger: 0.025 });
        else tl.from(split.chars, { opacity: 0, duration: 0.01, ease: "none", stagger: 0.045 }); // máquina de escribir
        if (rest.length) tl.from(rest, { opacity: 0, y: 16, duration: 0.5, ease: "power2.out", stagger: 0.1 }, "-=0.25");
      }
    }, block);
    ready();
    return () => { ctx.revert(); split?.revert(); gsap.set(items, { clearProps: clear }); };
  }, [rootRef, mode, replay]);
}

// Tipografía de títulos. Las variables vienen de next/font en app/layout.js.
const STORE_FONTS = [["system", "Clásica"], ["grotesk", "Geométrica"], ["bold", "Impacto"], ["serif", "Cálida"], ["luxury", "Lujo"], ["editorial", "Editorial"]];
const FONT_VARS = { grotesk: "var(--font-space-grotesk)", bold: "var(--font-bricolage)", serif: "var(--font-fraunces)", luxury: "var(--font-playfair)", editorial: "var(--font-bodoni)" };
// Tiendas guardadas antes de existir fontHeading: la fuente sale de su plantilla (layout)
const LAYOUT_FONT = { split: "grotesk", overlay: "bold", centered: "serif", feature: "luxury", magazine: "editorial" };
const storeFont = (store) => store.fontHeading || LAYOUT_FONT[store.layout || "overlay"];

const HERO_FILTERS = {
  none: undefined,
  bw: "grayscale(1) contrast(1.08)",
  warm: "sepia(0.25) saturate(1.2) hue-rotate(-8deg)",
  cool: "saturate(0.9) hue-rotate(12deg) brightness(1.03)",
  contrast: "contrast(1.25) saturate(1.15)",
};

const GRAIN_URL = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

function isLightColor(hex) {
  const h = (hex || "#000000").replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) || 0);
  return 0.299 * r + 0.587 * g + 0.114 * b > 150;
}

// Imagen del hero como capa (no background-image): zoom/encuadre + efectos (superposición, filtro,
// movimiento, grano, fundir con el tema). Todo CSS; el "tilt" es lo único con JS.
function HeroImageLayer({ store }) {
  const motionRef = useRef(null);
  const fx = { ...HERO_FX_DEFAULTS, ...store };
  const motion = fx.heroMotion;

  useEffect(() => {
    if (motion !== "tilt" || !motionRef.current) return;
    const el = motionRef.current;
    const frame = el.parentElement?.parentElement;
    if (!frame || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e) => {
      const r = frame.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5, dy = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `scale(1.06) translate(${(-dx * 2.5).toFixed(2)}%, ${(-dy * 2.5).toFixed(2)}%)`;
    };
    const onLeave = () => { el.style.transform = "scale(1.06)"; };
    onLeave();
    frame.addEventListener("mousemove", onMove);
    frame.addEventListener("mouseleave", onLeave);
    return () => { frame.removeEventListener("mousemove", onMove); frame.removeEventListener("mouseleave", onLeave); el.style.transform = ""; };
  }, [motion]);

  if (!store.heroImage) return null;
  const x = store.heroImageX ?? 50, y = store.heroImageY ?? 50, zoom = store.heroImageZoom ?? 1;
  const a = Math.max(0, Math.min(80, fx.heroOverlayStrength)) / 100;
  const lightTheme = isLightColor(store.backgroundColor);
  const duotone = fx.heroOverlay === "duotone";
  const overlay = {
    gradient: `linear-gradient(to right, rgba(0,0,0,${a + 0.15}) 0%, rgba(0,0,0,${a / 2}) 45%, transparent 80%)`,
    vignette: `radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,${a + 0.2}) 100%)`,
    dark: `rgba(0,0,0,${a})`,
    light: `rgba(255,255,255,${a})`,
    duotone: `linear-gradient(135deg, ${store.gradientFromColor || store.primaryColor}, ${store.gradientToColor || store.primaryColor})`,
  }[fx.heroOverlay];
  // Fundir: en tema claro el blanco de la foto desaparece (multiply); en oscuro, los bordes se desvanecen
  const blendStyle = fx.heroBlend
    ? lightTheme
      ? { mixBlendMode: "multiply" }
      : { maskImage: "radial-gradient(ellipse 70% 75% at 50% 50%, #000 45%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 70% 75% at 50% 50%, #000 45%, transparent 100%)" }
    : {};
  const filter = [duotone ? "grayscale(1) contrast(1.1)" : HERO_FILTERS[fx.heroFilter]].filter(Boolean).join(" ") || undefined;

  return (
    // overflow "clip" (no "hidden"): hidden crea un contenedor de scroll y rompe animation-timeline: view() del parallax
    <div style={{ position: "absolute", inset: 0, overflow: "clip", pointerEvents: "none", backgroundColor: fx.heroBlend ? store.backgroundColor : undefined }}>
      <div ref={motionRef} className={motion === "kenburns" ? "hero-fx-kenburns" : motion === "parallax" ? "hero-fx-parallax" : motion === "tilt" ? "hero-fx-tilt" : undefined} style={{ position: "absolute", inset: 0 }}>
        <img src={store.heroImage} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: `${x}% ${y}%`, transform: zoom !== 1 ? `scale(${zoom})` : undefined, transformOrigin: `${x}% ${y}%`, filter, ...blendStyle }} />
      </div>
      {overlay && <div style={{ position: "absolute", inset: 0, background: overlay, mixBlendMode: duotone ? "multiply" : undefined, opacity: duotone ? Math.min(1, a + 0.45) : 1 }} />}
      {fx.heroGrain && <div style={{ position: "absolute", inset: 0, backgroundImage: GRAIN_URL, opacity: 0.16, mixBlendMode: "overlay" }} />}
    </div>
  );
}

const FX_GROUPS = [
  ["heroOverlay", "Superposición", [["none", "Ninguna"], ["gradient", "Degradado"], ["vignette", "Viñeta"], ["dark", "Oscurecer"], ["light", "Aclarar"], ["duotone", "Duotono"]]],
  ["heroFilter", "Filtro", [["none", "Normal"], ["bw", "B/N"], ["warm", "Cálido"], ["cool", "Frío"], ["contrast", "Contraste"]]],
  ["heroMotion", "Movimiento", [["none", "Quieta"], ["kenburns", "Zoom lento"], ["parallax", "Parallax"], ["tilt", "Sigue el mouse"]]],
];

// Panel portalizado (el hero tiene overflow:hidden); se posiciona bajo el botón que lo abre
const ENTRANCE_OPTIONS = [["none", "Ninguna"], ["fadeup", "Desde abajo"], ["letters", "Letra por letra"], ["typewriter", "Máquina de escribir"], ["blur", "Desenfoque"]];

function HeroEffectsPanel({ store, onUpdate, anchor, onClose, onReplay }) {
  const fx = { ...HERO_FX_DEFAULTS, ...store };
  const panelRef = useRef(null);
  const [pos, setPos] = useState(null);

  useEffect(() => {
    const place = () => {
      const r = anchor.getBoundingClientRect();
      const width = Math.min(340, window.innerWidth - 24);
      // Si abajo no cabe (móvil), sube lo necesario para mostrar el panel entero (~510px)
      setPos({ top: Math.max(12, Math.min(r.bottom + 8, window.innerHeight - 520)), left: Math.max(12, Math.min(r.right - width, window.innerWidth - width - 12)), width });
    };
    place();
    const onDown = (e) => { if (!panelRef.current?.contains(e.target) && !anchor.contains(e.target)) onClose(); };
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [anchor, onClose]);

  if (!pos) return null;
  const chip = (active) => ({ borderRadius: 9, padding: "7px 11px", fontSize: "0.76rem", fontWeight: 700, cursor: "pointer", border: `1px solid ${active ? "#7FE040" : "rgba(255,255,255,0.12)"}`, background: active ? "rgba(127,224,64,0.14)" : "rgba(255,255,255,0.04)", color: active ? "#7FE040" : "rgba(255,255,255,0.75)" });
  const label = { color: "rgba(255,255,255,0.45)", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", margin: "14px 0 8px" };

  return createPortal(
    <div ref={panelRef} style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width, maxHeight: `calc(100vh - ${pos.top + 12}px)`, overflowY: "auto", zIndex: 9000, background: "#0f0f0f", border: "1px solid rgba(127,224,64,0.25)", borderRadius: 16, padding: "14px 16px 16px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ margin: 0, color: "#fff", fontWeight: 900, fontSize: "0.92rem" }}>Efectos del hero</p>
        <div style={{ display: "flex", gap: 6 }}>
          <button type="button" title="Restablecer" onClick={() => Object.entries(HERO_FX_DEFAULTS).forEach(([k, v]) => onUpdate?.(k, v))} style={{ ...toolbarBtn, width: 30, height: 30 }}><RotateCcw size={14} /></button>
          <button type="button" title="Cerrar" onClick={onClose} style={{ ...toolbarBtn, width: 30, height: 30 }}><X size={15} /></button>
        </div>
      </div>
      <p style={label}>Tipografía de títulos</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {STORE_FONTS.map(([value, text]) => (
          <button key={value} type="button" onClick={() => onUpdate?.("fontHeading", value)} style={{ ...chip(storeFont(store) === value), fontFamily: FONT_VARS[value] }}>{text}</button>
        ))}
      </div>
      <p style={label}>Entrada del texto</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {ENTRANCE_OPTIONS.map(([value, text]) => (
          <button key={value} type="button" onClick={() => { onUpdate?.("heroEntrance", value); onReplay(); }} style={chip(fx.heroEntrance === value)}>{text}</button>
        ))}
        {fx.heroEntrance !== "none" && (
          <button type="button" onClick={onReplay} style={{ ...chip(false), display: "inline-flex", alignItems: "center", gap: 5 }}><Play size={12} /> Ver de nuevo</button>
        )}
      </div>
      {store.heroImage && FX_GROUPS.map(([field, title, options]) => (
        <div key={field}>
          <p style={label}>{title}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {options.map(([value, text]) => (
              <button key={value} type="button" onClick={() => onUpdate?.(field, value)} style={chip(fx[field] === value)}>{text}</button>
            ))}
          </div>
          {field === "heroOverlay" && fx.heroOverlay !== "none" && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.74rem" }}>Intensidad</span>
              <input type="range" min={0} max={80} step={5} value={fx.heroOverlayStrength} onChange={(e) => onUpdate?.("heroOverlayStrength", Number(e.target.value))} style={{ flex: 1, accentColor: "#7FE040" }} />
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.74rem", width: 32, textAlign: "right" }}>{fx.heroOverlayStrength}%</span>
            </div>
          )}
        </div>
      ))}
      {store.heroImage && <p style={label}>Acabado</p>}
      {store.heroImage && <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <button type="button" onClick={() => onUpdate?.("heroGrain", !fx.heroGrain)} style={chip(fx.heroGrain)}>Grano fino</button>
        <button type="button" onClick={() => onUpdate?.("heroBlend", !fx.heroBlend)} style={chip(fx.heroBlend)} title="Disuelve el fondo de la foto en el color de la plantilla">Fundir con el tema</button>
      </div>}
    </div>,
    document.body
  );
}

const toolbarBtn = { width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 };

// frame: selector del recuadro real donde se ve la imagen (el hero mide su marco, no el botón de cámara).
// onUpload(url, { focusX }) — focusX: dónde quedó el sujeto, para encuadrar.
export function ClickableImageZone({ value, onUpload, isEditable, className, style, children, frame, noWide = false, layout = null, brandColor = null }) {
  const [hovered, setHovered] = useState(false);
  const [compact, setCompact] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [targetAspect, setTargetAspect] = useState(1.5);
  const fileRef = useRef(null);

  // Sube a Storage y guarda la URL: el base64 dentro del JSONB de la landing cuelga el pooler
  async function save(fileOrDataUrl, meta) {
    try {
      let file = fileOrDataUrl;
      if (typeof file === "string") {
        const blob = await (await fetch(file)).blob();
        file = new File([blob], `imagen.${blob.type.split("/")[1] || "jpg"}`, { type: blob.type });
      }
      onUpload(await uploadImage(file), meta);
    } catch (error) {
      console.error("[landing] subida fallida:", error.message);
      // Imagen generada (ya pagada): mejor guardarla en base64 que perderla
      if (typeof fileOrDataUrl === "string") onUpload(fileOrDataUrl, meta);
    }
  }

  function handleFile(event) {
    const file = event.target.files?.[0];
    if (file) save(file);
  }

  if (!isEditable) return <div className={className} style={style}>{children}</div>;

  return (
    <>
      <div
        className={className}
        style={{ position: "relative", cursor: "pointer", ...style }}
        onClick={(e) => {
          if (e.target.isContentEditable || e.target.closest("[contenteditable]")) return;
          const box = ((frame && e.currentTarget.closest(frame)) || e.currentTarget).getBoundingClientRect();
          if (box.width && box.height) setTargetAspect(box.width / box.height);
          setShowWizard(true);
        }}
        onMouseEnter={(e) => { setCompact(e.currentTarget.offsetWidth < 170 || e.currentTarget.offsetHeight < 110); setHovered(true); }}
        onMouseLeave={() => setHovered(false)}
      >
        {children}
        {hovered && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: "inherit", zIndex: 20, overflow: "hidden", pointerEvents: "none" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#7FE040", borderRadius: 10, padding: compact ? 8 : "8px 18px", color: "#050505", fontSize: "0.78rem", fontWeight: 900, whiteSpace: "nowrap" }}>
              <ImagePlus size={compact ? 18 : 14} strokeWidth={2.5} />{!compact && "Crear imagen"}
            </div>
            {!compact && <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem" }}>Subir o generar con IA</div>}
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} onClick={e => e.stopPropagation()} />
      </div>

      {showWizard && (
        <AiImageWizard
          targetAspect={targetAspect}
          noWide={noWide}
          currentImage={value || null}
          layout={layout}
          brandColor={brandColor}
          onClose={() => setShowWizard(false)}
          onGenerated={(img, meta) => { save(img, meta); setShowWizard(false); }}
          onUploadFile={() => fileRef.current?.click()}
        />
      )}
    </>
  );
}

export default function LandingPreview({ store, products, fullWidth = false, standalone = false, basePath = "", productsOnly = false, marcaOnly = false, isEditable = false, onUpdate }) {
  const [visitorCountryId, setVisitorCountryId] = useState("");
  const [fxAnchor, setFxAnchor] = useState(null);
  const closeFx = useCallback(() => setFxAnchor(null), []);
  const shellRef = useRef(null);
  const [entranceReplay, setEntranceReplay] = useState(0);
  useHeroTextEntrance(shellRef, store.heroEntrance, entranceReplay);
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
    ? "w-full overflow-clip"
    : `mx-auto overflow-clip border border-white/10 ${fullWidth ? "max-w-7xl rounded-[2rem]" : "max-w-6xl rounded-[2rem]"}`;
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
      <ClickableImageZone value={product.image} noWide onUpload={v => { const c=[...products]; c[index]={...c[index],image:v}; onUpdate?.("__products__",c); }} isEditable={isEditable} className={`overflow-hidden ${cls}`} style={{ backgroundColor: store.backgroundColor, ...sty }}>
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
      ref={shellRef}
      data-hero-entrance={store.heroEntrance && store.heroEntrance !== "none" ? "" : undefined}
      data-store-font={FONT_VARS[storeFont(store)] ? "" : undefined}
      className={shellClassName}
      style={{ backgroundColor: store.surfaceColor, color: store.textColor, "--store-font": FONT_VARS[storeFont(store)] }}
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

        // Mover = la imagen va hacia donde apunta la flecha (object-position al revés)
        const nudge = (field, delta) => onUpdate?.(field, Math.max(0, Math.min(100, (store[field] ?? 50) + delta)));
        const heroZoom = store.heroImageZoom ?? 1;
        const setZoom = (z) => onUpdate?.("heroImageZoom", Math.round(Math.max(1, Math.min(2.5, z)) * 100) / 100);
        const imgToolbar = isEditable && (
          <div style={{ position: "absolute", top: 12, right: 12, zIndex: 20, display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: 4, padding: 4, borderRadius: 13, background: "rgba(8,8,8,0.72)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", maxWidth: "calc(100% - 24px)" }}>
            {store.heroImage && (<>
              <button type="button" title="Alejar" disabled={heroZoom <= 1} onClick={() => setZoom(heroZoom - 0.25)} style={{ ...toolbarBtn, opacity: heroZoom <= 1 ? 0.35 : 1 }}><ZoomOut size={16} /></button>
              <button type="button" title="Acercar" disabled={heroZoom >= 2.5} onClick={() => setZoom(heroZoom + 0.25)} style={{ ...toolbarBtn, opacity: heroZoom >= 2.5 ? 0.35 : 1 }}><ZoomIn size={16} /></button>
              <button type="button" title="Mover a la izquierda" onClick={() => nudge("heroImageX", 10)} style={toolbarBtn}><ArrowLeft size={16} /></button>
              <button type="button" title="Mover arriba" onClick={() => nudge("heroImageY", 10)} style={toolbarBtn}><ArrowUp size={16} /></button>
              <button type="button" title="Mover abajo" onClick={() => nudge("heroImageY", -10)} style={toolbarBtn}><ArrowDown size={16} /></button>
              <button type="button" title="Mover a la derecha" onClick={() => nudge("heroImageX", -10)} style={toolbarBtn}><ArrowRight size={16} /></button>
              <button type="button" title="Eliminar imagen" onClick={() => onUpdate?.("heroImage", "")} style={{ ...toolbarBtn, background: "rgba(220,38,38,0.22)", border: "1px solid rgba(248,113,113,0.35)", color: "#fca5a5" }}><Trash2 size={15} /></button>
            </>)}
            <button type="button" title="Efectos" onClick={(e) => { const el = e.currentTarget; setFxAnchor((cur) => (cur ? null : el)); }} style={{ ...toolbarBtn, ...(fxAnchor ? { background: "rgba(127,224,64,0.16)", border: "1px solid rgba(127,224,64,0.45)", color: "#7FE040" } : {}) }}><SlidersHorizontal size={16} /></button>
            {fxAnchor && <HeroEffectsPanel store={store} onUpdate={onUpdate} anchor={fxAnchor} onClose={closeFx} onReplay={() => setEntranceReplay((n) => n + 1)} />}
            <ClickableImageZone value={store.heroImage} frame="[data-hero-frame]" layout={layout} brandColor={store.primaryColor} isEditable={isEditable}
              onUpload={(v, meta) => { onUpdate?.("heroImage", v); onUpdate?.("heroImageX", meta?.focusX ?? 50); onUpdate?.("heroImageY", 50); onUpdate?.("heroImageZoom", 1); }}
              style={{ ...toolbarBtn, background: "rgba(127,224,64,0.16)", border: "1px solid rgba(127,224,64,0.45)", overflow: "hidden" }}>
              <Camera size={17} color="#7FE040" />
            </ClickableImageZone>
          </div>
        );
        // Detalle propio de Fuego (layout overlay): sticker girado + botón con pulso
        const sticker = layout === "overlay";
        const heroTextContent = (centered = false, dark = false) => (
          <>
            {(store.promoText || isEditable) && (
              // Envoltorio: la entrada GSAP anima y limpia el transform del hijo directo; el giro va dentro
              <span style={{ display: "inline-block" }}><span className="rounded-full px-4 py-2 text-sm font-black" style={sticker
                ? { display: "inline-block", backgroundColor: store.primaryColor, color: store.buttonTextColor, transform: "rotate(-4deg)", boxShadow: `0 8px 22px ${primaryGlow}`, textTransform: "uppercase", letterSpacing: "0.06em" }
                : { display: "inline-block", backgroundColor: dark ? hexToRgba(store.primaryColor,0.25) : primarySoft, color: dark ? "#fff" : store.primaryColor }}>
                <EditableText tag="span" value={store.promoText} fontColor={textColor("promoTextColor", sticker ? store.buttonTextColor : dark ? "#fff" : store.primaryColor)} onTextChange={v => onUpdate?.("promoText", v)} onFontColorChange={v => onUpdate?.("promoTextColor", v)} isEditable={isEditable} inline />
              </span></span>
            )}
            <EditableText tag="h1" value={store.heroTitle} fontSize={heroTitleSize} fontColor={store.heroTitleColor || (dark ? "#fff" : store.textColor)} onTextChange={v => onUpdate?.("heroTitle", v)} onFontSizeChange={v => onUpdate?.("heroTitleSize", v)} onFontColorChange={v => onUpdate?.("heroTitleColor", v)} isEditable={isEditable} className={`mt-6 font-black leading-none ${centered ? "mx-auto" : "max-w-3xl"}`} />
            <EditableText tag="p" value={store.heroSubtitle} fontSize={heroSubtitleSize} fontColor={store.heroSubtitleColor || (dark ? "rgba(255,255,255,0.7)" : store.mutedTextColor)} onTextChange={v => onUpdate?.("heroSubtitle", v)} onFontSizeChange={v => onUpdate?.("heroSubtitleSize", v)} onFontColorChange={v => onUpdate?.("heroSubtitleColor", v)} isEditable={isEditable} className={`mt-4 ${centered ? "mx-auto max-w-lg" : "max-w-xl"}`} />
            <div className={`mt-8 flex gap-3 ${centered ? "justify-center" : ""} flex-wrap`}>
              <button className={`rounded-2xl px-8 py-4 font-black ${sticker ? "hero-sig-pulse" : ""}`} style={{ backgroundColor: store.primaryColor, color: store.buttonTextColor, "--sig-color": hexToRgba(store.primaryColor, 0.45) }}>
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
          <section id="inicio" data-hero-frame style={{ display: "grid", gridTemplateColumns: standalone ? "1fr 1fr" : "1fr 1fr", backgroundColor: store.backgroundColor, minHeight: standalone ? "clamp(520px,68vh,760px)" : 520, position: "relative", overflow: "clip" }}>
            <div aria-hidden className="hero-sig-mesh" style={{ position: "absolute", inset: "-20%", pointerEvents: "none", backgroundImage: `radial-gradient(circle at 20% 30%, ${hexToRgba(store.primaryColor, 0.22)}, transparent 40%), radial-gradient(circle at 70% 70%, ${hexToRgba(store.gradientToColor || store.primaryColor, 0.2)}, transparent 45%), radial-gradient(circle at 45% 90%, ${hexToRgba(store.gradientFromColor || store.primaryColor, 0.14)}, transparent 40%)` }} />
            <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: standalone ? "56px 40px 56px 56px" : "56px 40px" }}>
              <DraggableBlock xPct={heroBlockXPct} yPct={heroBlockYPct} onChange={heroBlockChange} isEditable={isEditable}>
                {heroTextContent()}
              </DraggableBlock>
            </div>
            <div data-hero-frame style={{ position: "relative", overflow: "clip" }}>
              {store.heroImage
                ? <HeroImageLayer store={store} />
                : <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${store.gradientFromColor||store.primaryColor}, ${store.gradientToColor||store.primaryColor})` }} />
              }
              {imgToolbar}
            </div>
          </section>
        );

        /* ── CENTERED (Bosque): full-width centered text, gradient bg ── */
        if (layout === "centered") return (
          <section id="inicio" data-hero-frame style={{ position: "relative", overflow: "clip", backgroundColor: store.backgroundColor, backgroundImage: store.heroImage ? undefined : `radial-gradient(ellipse at 50% -10%, ${primaryGlow}, transparent 55%), radial-gradient(ellipse at 80% 100%, ${hexToRgba(store.primaryColor,0.12)}, transparent 40%)`, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: standalone ? "clamp(520px,68vh,760px)" : 520, padding: standalone ? "72px 24px" : "80px 32px" }}>
            <HeroImageLayer store={store} />
            {imgToolbar}
            <div style={{ position: "relative", maxWidth: 780, width: "100%", margin: "0 auto" }}>
              <DraggableBlock xPct={heroBlockXPct} yPct={heroBlockYPct} onChange={heroBlockChange} isEditable={isEditable}>
                {heroTextContent(true)}
              </DraggableBlock>
            </div>
          </section>
        );

        /* ── FEATURE (Noche): full-bleed bg + text anchored bottom-left ── */
        if (layout === "feature") return (
          <section id="inicio" data-hero-frame style={{
            position: "relative", overflow: "clip",
            backgroundColor: store.backgroundColor,
            backgroundImage: store.heroImage
              ? undefined
              : `linear-gradient(160deg, ${store.gradientFromColor||store.primaryColor} 0%, ${store.gradientToColor||store.primaryColor} 100%)`,
            minHeight: standalone ? "clamp(520px,68vh,760px)" : 520,
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
          }}>
            <HeroImageLayer store={store} />
            {imgToolbar}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 55%, transparent 85%)" }} />
            <div className="hero-feature-text" style={{ position: "relative", zIndex: 2, padding: standalone ? "56px 48px" : "56px 40px", maxWidth: "58%" }}>
              <DraggableBlock xPct={heroBlockXPct} yPct={heroBlockYPct} onChange={heroBlockChange} isEditable={isEditable}>
                {(store.promoText || isEditable) && (
                  <span className="rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest mb-6 self-start" style={{ backgroundColor: hexToRgba(store.primaryColor,0.25), color: store.primaryColor, letterSpacing: "0.2em", display: "inline-block" }}>
                    <EditableText tag="span" value={store.promoText} fontColor={textColor("promoTextColor", store.primaryColor)} onTextChange={v => onUpdate?.("promoText", v)} onFontColorChange={v => onUpdate?.("promoTextColor", v)} isEditable={isEditable} inline />
                  </span>
                )}
                <EditableText tag="h1" value={store.heroTitle} fontSize={Math.min((heroTitleSize*1.25)|0, 80)} fontColor={store.heroTitleColor||"#fff"} onTextChange={v => onUpdate?.("heroTitle", v)} onFontSizeChange={v => onUpdate?.("heroTitleSize", v)} onFontColorChange={v => onUpdate?.("heroTitleColor", v)} isEditable={isEditable} className="font-black leading-none" />
                <div style={{ width: 48, height: 4, borderRadius: 2, background: store.primaryColor, margin: "20px 0" }} />
                <EditableText tag="p" value={store.heroSubtitle} fontSize={heroSubtitleSize} fontColor={store.heroSubtitleColor||"rgba(255,255,255,0.72)"} onTextChange={v => onUpdate?.("heroSubtitle", v)} onFontSizeChange={v => onUpdate?.("heroSubtitleSize", v)} onFontColorChange={v => onUpdate?.("heroSubtitleColor", v)} isEditable={isEditable} className="max-w-md mb-8" />
                <button className="hero-sig-shimmer rounded-2xl px-8 py-4 font-black self-start" style={{ backgroundColor: store.primaryColor, color: store.buttonTextColor }}>
                  <EditableText tag="span" value={store.ctaText} fontColor={textColor("ctaTextColor", store.buttonTextColor)} onTextChange={v => onUpdate?.("ctaText", v)} onFontColorChange={v => onUpdate?.("ctaTextColor", v)} isEditable={isEditable} inline />
                </button>
              </DraggableBlock>
            </div>
          </section>
        );

        /* ── MAGAZINE (Coral): bg image full + accent stripe bottom ── */
        if (layout === "magazine") return (
          <section id="inicio" data-hero-frame style={{ position: "relative", overflow: "clip", backgroundColor: store.backgroundColor, backgroundImage: store.heroImage ? undefined : `linear-gradient(135deg, ${store.gradientFromColor||store.primaryColor} 0%, ${store.gradientToColor||store.primaryColor} 100%)`, minHeight: standalone ? "clamp(520px,68vh,760px)" : 520, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <HeroImageLayer store={store} />
            {imgToolbar}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }} />
            {store.brand && <p aria-hidden className="hidden md:block" style={{ position: "absolute", right: 28, bottom: 48, zIndex: 1, margin: 0, writingMode: "vertical-rl", transform: "rotate(180deg)", fontFamily: "var(--store-font)", fontStyle: "italic", fontSize: "0.85rem", letterSpacing: "0.45em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", whiteSpace: "nowrap", maxHeight: "calc(100% - 96px)", overflow: "hidden", textOverflow: "ellipsis" }}>{store.brand}</p>}
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
          <section id="inicio" data-hero-frame className={heroClassName} style={{ overflow: "clip", minHeight: standalone ? "clamp(520px,68vh,760px)" : undefined, backgroundColor: store.backgroundColor, backgroundImage: store.heroImage ? undefined : `radial-gradient(circle at 75% 25%, ${primaryGlow}, transparent 35%)` }}>
            <HeroImageLayer store={store} />
            {imgToolbar}
            <div className={`relative ${standalone ? "mx-auto w-full max-w-6xl" : "max-w-3xl"} p-2`}>
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
          <ClickableImageZone value={store.bannerSecondary} onUpload={v=>onUpdate?.("bannerSecondary",v)} isEditable={isEditable} className="overflow-hidden rounded-[1.5rem]" style={{ backgroundColor: store.backgroundColor, position: "relative", height: "clamp(280px, 42vh, 500px)" }}>
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
