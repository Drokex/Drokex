"use client";
import { useState, useRef } from "react";

function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "").padEnd(6, "0").slice(0, 6);
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

const STYLES = [
  { id: "profesional", label: "Profesional", emoji: "💼", desc: "Limpio, serio y moderno" },
  { id: "alegre",      label: "Alegre",       emoji: "🎨", desc: "Colorido y llamativo" },
  { id: "elegante",    label: "Elegante",     emoji: "✨", desc: "Lujoso y sofisticado" },
  { id: "natural",     label: "Natural",      emoji: "🌿", desc: "Orgánico y fresco" },
];

const STEPS = [
  { id: "color",       title: "¿Cuál es el color principal de tu marca?",     sub: "Elige el color que más representa tu negocio." },
  { id: "productos",   title: "¿Qué productos o servicios ofreces?",           sub: "Descríbelos brevemente. Ej: café molido, café en grano." },
  { id: "mascota",     title: "¿Tu marca tiene mascota o personaje?",          sub: "Si tienes una imagen de referencia, súbela para incluirla." },
  { id: "fotoproducto",title: "¿Quieres mostrar productos en el banner?",      sub: "Opcional — sube hasta 3 fotos de tus productos." },
  { id: "estilo",      title: "¿Qué estilo quieres para tu banner?",           sub: "Elige el que mejor describe tu marca." },
];

export default function AiImageWizard({ onClose, onGenerated, onUploadFile, bannerLabel = "banner" }) {
  const [step, setStep]                 = useState(0);
  const [color, setColor]               = useState("#7FE040");
  const [productos, setProductos]       = useState("");
  const [tieneMascota, setTieneMascota] = useState(null);
  const [mascotaImg, setMascotaImg]     = useState(null);
  const [productosImgs, setProductosImgs] = useState([]);
  const [estilo, setEstilo]             = useState("profesional");
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const mascotaRef     = useRef(null);
  const productoRef    = useRef(null);

  const total = STEPS.length;
  const current = STEPS[step];

  function handleMascotaFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setMascotaImg(ev.target.result);
    reader.readAsDataURL(file);
  }

  function handleProductoFile(e) {
    const files = Array.from(e.target.files || []);
    files.slice(0, 3 - productosImgs.length).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setProductosImgs(prev => [...prev, ev.target.result].slice(0, 3));
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }

  function canNext() {
    if (current.id === "color")        return !!color;
    if (current.id === "productos")    return productos.trim().length > 0;
    if (current.id === "mascota")      return tieneMascota !== null;
    if (current.id === "fotoproducto") return true; // opcional
    if (current.id === "estilo")       return !!estilo;
    return true;
  }

  // Construye referencia combinada: mascota (dcha) + fotos producto (izq) en un canvas
  function buildReferenceImage(mascotUrl, productoUrls) {
    return new Promise((resolve) => {
      const SIZE = 1024;
      const canvas = document.createElement("canvas");
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, SIZE, SIZE);

      const loadImg = (url) => new Promise((res) => {
        const i = new Image(); i.onload = () => res(i); i.src = url;
      });

      Promise.all([loadImg(mascotUrl), ...productoUrls.map(loadImg)]).then(([mascot, ...prods]) => {
        // Mascota en mitad derecha
        const mScale = Math.min((SIZE / 2) / mascot.width, SIZE / mascot.height);
        const mw = mascot.width * mScale, mh = mascot.height * mScale;
        ctx.drawImage(mascot, SIZE / 2 + (SIZE / 2 - mw) / 2, (SIZE - mh) / 2, mw, mh);

        // Productos en mitad izquierda (hasta 3, apilados)
        if (prods.length > 0) {
          const cellH = SIZE / prods.length;
          prods.forEach((p, i) => {
            const pScale = Math.min((SIZE / 2 - 16) / p.width, (cellH - 8) / p.height);
            const pw = p.width * pScale, ph = p.height * pScale;
            ctx.drawImage(p, (SIZE / 2 - pw) / 2, i * cellH + (cellH - ph) / 2, pw, ph);
          });
        }

        // Línea divisoria sutil
        ctx.strokeStyle = "rgba(0,0,0,0.15)";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(SIZE / 2, 0); ctx.lineTo(SIZE / 2, SIZE); ctx.stroke();

        resolve(canvas.toDataURL("image/png"));
      });
    });
  }

  // Extiende la imagen generada a formato banner horizontal con degradado
  function toBannerFormat(imageUrl, brandColor) {
    return new Promise((resolve) => {
      const BANNER_W = 1920;
      const BANNER_H = 600;
      const canvas = document.createElement("canvas");
      canvas.width = BANNER_W;
      canvas.height = BANNER_H;
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = brandColor;
      ctx.fillRect(0, 0, BANNER_W, BANNER_H);

      const img = new Image();
      img.onload = () => {
        const scale = BANNER_H / img.height;
        const sw = img.width * scale;
        const x = BANNER_W - sw;
        ctx.drawImage(img, x, 0, sw, BANNER_H);

        // Degradado solo en la zona de unión — no toca el contenido de la imagen
        const blendW = Math.min(sw * 0.18, 220);
        const grad = ctx.createLinearGradient(x, 0, x + blendW, 0);
        grad.addColorStop(0, brandColor);
        grad.addColorStop(0.7, hexToRgba(brandColor, 0.3));
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(x, 0, blendW, BANNER_H);

        resolve(canvas.toDataURL("image/png"));
      };
      img.src = imageUrl;
    });
  }

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      // Si hay mascota + fotos de producto, crear imagen de referencia combinada
      let refImg = tieneMascota ? mascotaImg : null;
      if (tieneMascota && mascotaImg && productosImgs.length > 0) {
        refImg = await buildReferenceImage(mascotaImg, productosImgs);
      }

      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guided: true,
          color,
          productos: productos.trim(),
          tieneMascota,
          mascotaImg: refImg,
          tieneProductosImg: productosImgs.length > 0,
          estilo,
          bannerLabel,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error generando imagen");
      const isBanner = bannerLabel !== "imagen";
      const finalImage = isBanner ? await toBannerFormat(data.image, color) : data.image;
      onGenerated(finalImage);
      onClose();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={() => { if (!loading) onClose(); }}>
      <div style={{ background: "#0f0f0f", border: "1px solid rgba(127,224,64,0.25)", borderRadius: 24, padding: "36px 32px", width: "100%", maxWidth: 500, position: "relative" }}
        onClick={e => e.stopPropagation()}>

        {/* Subir foto propia */}
        {onUploadFile && (
          <button type="button" onClick={() => { onUploadFile(); onClose(); }}
            style={{ width: "100%", border: "1.5px dashed rgba(255,255,255,0.15)", borderRadius: 12, background: "transparent", color: "rgba(255,255,255,0.5)", padding: "11px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Subir mi propia imagen
          </button>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.72rem" }}>o crea una con IA</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* Barra de progreso */}
        <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= step ? "#7FE040" : "rgba(255,255,255,0.1)", transition: "background 0.3s" }} />
          ))}
        </div>

        {/* Encabezado */}
        <p style={{ color: "#7FE040", fontSize: "0.72rem", fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>
          Paso {step + 1} de {total}
        </p>
        <h3 style={{ color: "#fff", fontSize: "1.15rem", fontWeight: 800, margin: "0 0 6px", lineHeight: 1.3 }}>{current.title}</h3>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", margin: "0 0 24px" }}>{current.sub}</p>

        {/* PASO: COLOR */}
        {current.id === "color" && (
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
              {["#7FE040","#FF5733","#3B82F6","#F59E0B","#EC4899","#8B5CF6","#06B6D4","#000000","#FFFFFF"].map(c => (
                <button key={c} type="button" onClick={() => setColor(c)} style={{
                  width: 40, height: 40, borderRadius: 10, background: c, border: color === c ? "3px solid #fff" : "2px solid rgba(255,255,255,0.15)",
                  cursor: "pointer", flexShrink: 0, boxShadow: color === c ? "0 0 0 2px #7FE040" : "none",
                }} />
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>O elige un color personalizado:</span>
              <input type="color" value={color} onChange={e => setColor(e.target.value)}
                style={{ width: 40, height: 40, border: "none", borderRadius: 8, cursor: "pointer", background: "none", padding: 0 }} />
            </div>
            <div style={{ marginTop: 14, padding: "12px 16px", borderRadius: 12, background: color, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#000", mixBlendMode: "difference", filter: "invert(1)" }}>Vista previa del color seleccionado</span>
            </div>
          </div>
        )}

        {/* PASO: PRODUCTOS (texto) */}
        {current.id === "productos" && (
          <textarea value={productos} onChange={e => setProductos(e.target.value)} rows={4}
            placeholder="Ej: Café molido premium, café en grano, café instantáneo, té verde"
            style={{ ...inputStyle, resize: "vertical" }} />
        )}

        {/* PASO: MASCOTA */}
        {current.id === "mascota" && (
          <div>
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              {[{ val: false, label: "No tengo mascota" }, { val: true, label: "Sí tengo mascota" }].map(opt => (
                <button key={String(opt.val)} type="button" onClick={() => { setTieneMascota(opt.val); if (!opt.val) setMascotaImg(null); }}
                  style={{ flex: 1, padding: "14px 10px", borderRadius: 14, border: `2px solid ${tieneMascota === opt.val ? "#7FE040" : "rgba(255,255,255,0.12)"}`,
                    background: tieneMascota === opt.val ? "rgba(127,224,64,0.1)" : "rgba(255,255,255,0.03)",
                    color: tieneMascota === opt.val ? "#7FE040" : "rgba(255,255,255,0.6)", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer" }}>
                  {opt.label}
                </button>
              ))}
            </div>
            {tieneMascota && (
              <div>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", marginBottom: 10 }}>
                  Sube una imagen de tu mascota para que la IA la incluya en el banner:
                </p>
                <button type="button" onClick={() => mascotaRef.current?.click()}
                  style={{ width: "100%", border: "2px dashed rgba(127,224,64,0.35)", borderRadius: 14, background: "rgba(127,224,64,0.04)", padding: "18px", cursor: "pointer", color: "#7FE040", fontWeight: 700, fontSize: "0.85rem" }}>
                  {mascotaImg ? "✓ Imagen cargada — clic para cambiar" : "📎 Subir imagen de la mascota"}
                </button>
                <input ref={mascotaRef} type="file" accept="image/*" onChange={handleMascotaFile} style={{ display: "none" }} />
                {mascotaImg && (
                  <img src={mascotaImg} alt="mascota" style={{ marginTop: 12, width: "100%", maxHeight: 140, objectFit: "contain", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }} />
                )}
              </div>
            )}
          </div>
        )}

        {/* PASO: FOTOS DE PRODUCTO */}
        {current.id === "fotoproducto" && (
          <div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              {productosImgs.map((img, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={img} alt={`producto ${i+1}`} style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)" }} />
                  <button type="button" onClick={() => setProductosImgs(prev => prev.filter((_, j) => j !== i))}
                    style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", background: "#f87171", border: "none", color: "#fff", fontSize: "0.7rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>✕</button>
                </div>
              ))}
              {productosImgs.length < 3 && (
                <button type="button" onClick={() => productoRef.current?.click()}
                  style={{ width: 90, height: 90, borderRadius: 12, border: "2px dashed rgba(127,224,64,0.35)", background: "rgba(127,224,64,0.04)", color: "#7FE040", fontSize: "1.6rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
              )}
            </div>
            <input ref={productoRef} type="file" accept="image/*" multiple onChange={handleProductoFile} style={{ display: "none" }} />
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem" }}>
              {productosImgs.length === 0 ? "Puedes saltar este paso si no tienes fotos." : `${productosImgs.length}/3 foto(s) — la IA las incluirá en la escena del banner.`}
            </p>
          </div>
        )}

        {/* PASO: ESTILO */}
        {current.id === "estilo" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {STYLES.map(s => (
              <button key={s.id} type="button" onClick={() => setEstilo(s.id)}
                style={{ padding: "18px 14px", borderRadius: 14, border: `2px solid ${estilo === s.id ? "#7FE040" : "rgba(255,255,255,0.1)"}`,
                  background: estilo === s.id ? "rgba(127,224,64,0.1)" : "rgba(255,255,255,0.03)",
                  cursor: "pointer", textAlign: "left" }}>
                <div style={{ fontSize: "1.6rem", marginBottom: 6 }}>{s.emoji}</div>
                <div style={{ color: estilo === s.id ? "#7FE040" : "#fff", fontWeight: 800, fontSize: "0.92rem" }}>{s.label}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", marginTop: 2 }}>{s.desc}</div>
              </button>
            ))}
          </div>
        )}

        {error && <p style={{ color: "#f87171", fontSize: "0.8rem", marginTop: 12 }}>{error}</p>}

        {/* Botones de navegación */}
        <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
          <button type="button"
            onClick={() => step === 0 ? onClose() : setStep(s => s - 1)}
            disabled={loading}
            style={{ flex: 1, borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "rgba(255,255,255,0.5)", padding: "13px", fontWeight: 700, cursor: "pointer", fontSize: "0.88rem" }}>
            {step === 0 ? "Cancelar" : "← Atrás"}
          </button>

          {step < total - 1 ? (
            <button type="button" onClick={() => setStep(s => s + 1)} disabled={!canNext()}
              style={{ flex: 2, borderRadius: 12, border: "none", background: canNext() ? "#7FE040" : "rgba(127,224,64,0.25)", color: "#050505", padding: "13px", fontWeight: 900, cursor: canNext() ? "pointer" : "not-allowed", fontSize: "0.88rem" }}>
              Siguiente →
            </button>
          ) : (
            <button type="button" onClick={handleGenerate} disabled={loading || !canNext()}
              style={{ flex: 2, borderRadius: 12, border: "none", background: loading ? "rgba(127,224,64,0.4)" : "#7FE040", color: "#050505", padding: "13px", fontWeight: 900, cursor: loading ? "not-allowed" : "pointer", fontSize: "0.88rem" }}>
              {loading ? "Creando tu banner... ⏳" : "✦ Crear mi banner"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.05)", color: "#fff", padding: "13px 15px",
  fontSize: "0.9rem", outline: "none", boxSizing: "border-box", fontFamily: "inherit",
};
