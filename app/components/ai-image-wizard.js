"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Briefcase, Palette, Sparkles, Leaf, Paperclip, Check, X, RefreshCw, Wand2 } from "lucide-react";

// Reduce fotos del usuario antes de subirlas (Vercel corta el body en 4.5 MB)
function shrinkImage(dataUrl, max = 1024) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      // PNG si puede traer transparencia (mascota recortada), JPEG si no
      resolve(dataUrl.startsWith("data:image/png") ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg", 0.85));
    };
    img.src = dataUrl;
  });
}

async function urlToDataUrl(url) {
  if (url.startsWith("data:")) return url;
  const blob = await (await fetch(url)).blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

// Tamaños que acepta el modelo, según la forma
const SIZE_BY_ASPECT = (a) => (a >= 1.2 ? "1536x1024" : a <= 0.8 ? "1024x1536" : "1024x1024");

const LOADING_MESSAGES = [
  [0,  "Preparando la escena..."],
  [6,  "Dibujando tu imagen..."],
  [18, "Ajustando luces y detalles..."],
  [35, "Dando los últimos toques..."],
];

const STYLES = [
  { id: "profesional", label: "Profesional", Icon: Briefcase, desc: "Limpio, serio y moderno" },
  { id: "alegre",      label: "Alegre",       Icon: Palette,   desc: "Colorido y llamativo" },
  { id: "elegante",    label: "Elegante",     Icon: Sparkles,  desc: "Lujoso y sofisticado" },
  { id: "natural",     label: "Natural",      Icon: Leaf,      desc: "Orgánico y fresco" },
];

const STEPS = [
  { id: "color",       title: "¿Cuál es el color principal de tu marca?",     sub: "Elige el color que más representa tu negocio." },
  { id: "productos",   title: "¿Qué productos o servicios ofreces?",           sub: "Descríbelos brevemente y, si quieres, di qué debe aparecer sí o sí." },
  { id: "mascota",     title: "¿Tu marca tiene mascota o personaje?",          sub: "Si tienes una imagen de referencia, súbela para incluirla." },
  { id: "fotoproducto",title: "¿Quieres mostrar productos en el banner?",      sub: "Opcional — sube hasta 3 fotos de tus productos." },
  { id: "estilo",      title: "¿Qué estilo quieres para tu banner?",           sub: "Elige el que mejor describe tu marca." },
];

// targetAspect: ancho/alto del recuadro donde va la imagen (medido al abrir).
// noWide: nunca estirar a banner (fotos de producto). currentImage: imagen ya puesta, editable con IA.
// layout: plantilla del hero (dónde irá el título), para que la IA deje ese hueco libre.
// brandColor: color de la tienda, para que el paso 1 arranque con él.
export default function AiImageWizard({ onClose, onGenerated, onUploadFile, targetAspect = 1.5, noWide = false, currentImage = null, layout = null, brandColor = null }) {
  const [step, setStep]                 = useState(-1); // -1 = pantalla inicial
  const [color, setColor]               = useState(/^#[0-9a-f]{6}$/i.test(brandColor || "") ? brandColor : "#7FE040");
  const [productos, setProductos]       = useState("");
  const [tieneMascota, setTieneMascota] = useState(null);
  const [mascotaImg, setMascotaImg]     = useState(null);
  const [productosImgs, setProductosImgs] = useState([]);
  const [mustInclude, setMustInclude]   = useState("");
  const [estilo, setEstilo]             = useState("profesional");
  const [loading, setLoading]           = useState(false);
  const [partial, setPartial]           = useState(null);   // imagen a medio generar (stream)
  const [elapsed, setElapsed]           = useState(0);
  const [result, setResult]             = useState(null);   // imagen cruda del modelo
  const [preview, setPreview]           = useState(null);   // lo que se va a usar (banner ya compuesto)
  const [lastBody, setLastBody]         = useState(null);
  const [changeText, setChangeText]     = useState("");
  const [showChange, setShowChange]     = useState(false);
  const [focusX, setFocusX]             = useState(50);     // dónde queda el sujeto (% horizontal) para encuadrar
  const [openingCurrent, setOpeningCurrent] = useState(false);
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

  // Extiende la imagen a la forma ancha del recuadro, con relleno del color del borde izquierdo.
  // Devuelve también focusX: dónde quedó el sujeto, para que el encuadre (móvil) no caiga en el relleno.
  function toWideFormat(imageUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const H = 800;
        const W = Math.round(H * Math.min(targetAspect, 3.2));
        const sw = img.width * (H / img.height);
        if (W <= sw + 1) return resolve({ image: imageUrl, focusX: 50 });

        const canvas = document.createElement("canvas");
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext("2d");
        // Color real del borde izquierdo, no el hex de marca: el modelo nunca clava el tono y se notaba la costura
        const probe = document.createElement("canvas");
        probe.width = 1; probe.height = 1;
        const pctx = probe.getContext("2d");
        pctx.drawImage(img, 0, 0, Math.max(1, Math.round(img.width * 0.04)), img.height, 0, 0, 1, 1);
        const [r, g, b] = pctx.getImageData(0, 0, 1, 1).data;

        // Si el borde izquierdo no es un fondo liso (mesa, escena), estirarlo deja una costura:
        // mejor devolverla tal cual y que el recuadro la recorte un poco arriba/abajo
        const strip = document.createElement("canvas");
        strip.width = 1; strip.height = 12;
        const sctx = strip.getContext("2d");
        sctx.drawImage(img, 0, 0, Math.max(1, Math.round(img.width * 0.02)), img.height, 0, 0, 1, 12);
        const px = sctx.getImageData(0, 0, 1, 12).data;
        let maxDiff = 0;
        for (let i = 0; i < px.length; i += 4) maxDiff = Math.max(maxDiff, Math.abs(px[i] - r) + Math.abs(px[i + 1] - g) + Math.abs(px[i + 2] - b));
        if (maxDiff > 60) return resolve({ image: imageUrl, focusX: 50 });

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(0, 0, W, H);

        const x = W - sw;
        ctx.drawImage(img, x, 0, sw, H);
        const blendW = Math.min(sw * 0.18, 220);
        const grad = ctx.createLinearGradient(x, 0, x + blendW, 0);
        grad.addColorStop(0, `rgb(${r},${g},${b})`);
        grad.addColorStop(0.7, `rgba(${r},${g},${b},0.3)`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(x, 0, blendW, H);

        resolve({ image: canvas.toDataURL("image/jpeg", 0.9), focusX: Math.round(((x + sw * 0.55) / W) * 100) });
      };
      img.src = imageUrl;
    });
  }

  useEffect(() => {
    if (!loading) return;
    const t0 = Date.now();
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - t0) / 1000)), 500);
    return () => clearInterval(id);
  }, [loading]);

  const format = !noWide && targetAspect >= 1.7 ? "wide" : targetAspect >= 1.2 ? "landscape" : targetAspect <= 0.8 ? "portrait" : "square";
  const isBanner = format === "wide";
  const frameRatio = format === "portrait" ? "2 / 3" : format === "square" ? "1 / 1" : "3 / 2";
  const frameMaxWidth = format === "portrait" ? 300 : format === "square" ? 440 : "none";

  async function runRequest(body) {
    setLoading(true);
    setError("");
    setPartial(null);
    setElapsed(0);
    setShowChange(false);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error generando imagen");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "", finalImage = null;
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();
        for (const line of lines) {
          if (!line.trim()) continue;
          const msg = JSON.parse(line);
          if (msg.type === "partial") setPartial(msg.image);
          else if (msg.type === "done") finalImage = msg.image;
          else if (msg.type === "error") throw new Error(msg.error);
        }
      }
      if (!finalImage) throw new Error("La generación se cortó, intenta de nuevo");
      setResult(finalImage);
      const composed = isBanner ? await toWideFormat(finalImage) : { image: finalImage, focusX: 50 };
      setPreview(composed.image);
      setFocusX(composed.focusX);
      setChangeText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    const body = {
      guided: true,
      color,
      productos: productos.trim(),
      mustInclude: mustInclude.trim(),
      tieneMascota,
      mascotaImg: tieneMascota && mascotaImg ? await shrinkImage(mascotaImg) : null,
      productosImgs: await Promise.all(productosImgs.map(img => shrinkImage(img))),
      estilo,
      format,
      layout,
    };
    setLastBody(body);
    runRequest(body);
  }

  function handleChange() {
    if (!changeText.trim() || !result) return;
    // Se pide ya con la forma del recuadro destino, así no hay que estirarla después
    runRequest({ edit: { image: result, instruction: changeText.trim(), size: SIZE_BY_ASPECT(targetAspect) } });
  }

  // Editar con IA la imagen que ya está puesta, sin generar una nueva desde cero
  async function openCurrent() {
    setOpeningCurrent(true);
    setError("");
    try {
      setResult(await shrinkImage(await urlToDataUrl(currentImage), 1536));
      setPreview(currentImage);
      setFocusX(50);
      setLastBody(null);
      setShowChange(true);
    } catch {
      setError("No se pudo abrir la imagen actual");
    } finally {
      setOpeningCurrent(false);
    }
  }

  function usePreview() {
    if (preview !== currentImage) onGenerated(preview, { focusX });
    onClose();
  }

  const loadingMessage = [...LOADING_MESSAGES].reverse().find(([t]) => elapsed >= t)[1];
  const busy = loading || !!preview;

  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, overflowY: "auto" }}
      onClick={() => { if (!busy) onClose(); }}>
      <div style={{ background: "#0f0f0f", border: "1px solid rgba(127,224,64,0.25)", borderRadius: 24, padding: "36px 32px", width: "100%", maxWidth: (loading || preview) ? 640 : 500, position: "relative", margin: "auto" }}
        onClick={e => e.stopPropagation()}>

        {/* Generando: progreso en vivo con la imagen a medio dibujar */}
        {loading && (
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#7FE040", fontSize: "0.72rem", fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>Drokex Estudio</p>
            <h3 style={{ color: "#fff", fontSize: "1.15rem", fontWeight: 800, margin: "0 0 18px" }}>{loadingMessage}</h3>
            <div style={{ position: "relative", width: "100%", maxWidth: frameMaxWidth, margin: "0 auto", aspectRatio: frameRatio, borderRadius: 16, overflow: "hidden", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {/* Mientras llega el primer parcial, la imagen anterior (si es un cambio u otra versión) */}
              {partial || result
                ? <img src={partial || result} alt="Generando" style={{ width: "100%", height: "100%", objectFit: "cover", filter: partial ? "blur(2px)" : "blur(6px) brightness(0.6)", transition: "filter 0.4s" }} />
                : <div className="ai-wizard-shimmer" style={{ position: "absolute", inset: 0 }} />}
            </div>
            <div style={{ marginTop: 16, height: 4, borderRadius: 4, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
              {/* ponytail: progreso estimado (~40s), la API no da porcentaje real */}
              <div style={{ height: "100%", width: `${Math.min(95, (elapsed / 40) * 100)}%`, background: "#7FE040", transition: "width 0.5s linear" }} />
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", margin: "10px 0 0" }}>{elapsed}s · suele tardar entre 20 y 40 segundos</p>
            <style>{`.ai-wizard-shimmer{background:linear-gradient(110deg,rgba(255,255,255,0.03) 30%,rgba(127,224,64,0.12) 50%,rgba(255,255,255,0.03) 70%);background-size:200% 100%;animation:aiWizardShimmer 1.4s linear infinite}@keyframes aiWizardShimmer{to{background-position:-200% 0}}`}</style>
          </div>
        )}

        {/* Vista previa: usar, generar otra o pedir un cambio */}
        {!loading && preview && (
          <div>
            <p style={{ color: "#7FE040", fontSize: "0.72rem", fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>Vista previa</p>
            <h3 style={{ color: "#fff", fontSize: "1.15rem", fontWeight: 800, margin: "0 0 16px" }}>¿Te gusta cómo quedó?</h3>
            <img src={preview} alt="Imagen generada" style={{ width: "auto", maxWidth: "100%", maxHeight: "55vh", margin: "0 auto", borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)", display: "block" }} />

            {showChange ? (
              <div style={{ marginTop: 16 }}>
                <textarea value={changeText} onChange={e => setChangeText(e.target.value)} rows={3} autoFocus
                  placeholder="Ej: agrega una taza con vapor al lado del empaque, haz el fondo más oscuro"
                  style={{ ...inputStyle, resize: "vertical" }} />
                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  <button type="button" onClick={() => setShowChange(false)} style={secondaryBtn}>Cancelar</button>
                  <button type="button" onClick={handleChange} disabled={!changeText.trim()}
                    style={{ ...primaryBtn, opacity: changeText.trim() ? 1 : 0.4, cursor: changeText.trim() ? "pointer" : "not-allowed" }}>
                    <Wand2 size={16} strokeWidth={2.5} /> Aplicar cambio
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button type="button" onClick={usePreview} style={{ ...primaryBtn, width: "100%", marginTop: 16 }}>
                  <Check size={17} strokeWidth={3} /> Usar esta imagen
                </button>
                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  <button type="button" onClick={() => setShowChange(true)} style={secondaryBtn}>
                    <Wand2 size={15} /> Pedir un cambio
                  </button>
                  {lastBody && (
                    <button type="button" onClick={() => runRequest(lastBody)} style={secondaryBtn}>
                      <RefreshCw size={15} /> Generar otra
                    </button>
                  )}
                </div>
              </>
            )}
            {error && <p style={{ color: "#f87171", fontSize: "0.8rem", marginTop: 12 }}>{error}</p>}
            <button type="button" onClick={onClose}
              style={{ width: "100%", borderRadius: 12, border: "none", background: "transparent", color: "rgba(255,255,255,0.3)", padding: "12px 10px 0", fontWeight: 600, cursor: "pointer", fontSize: "0.8rem" }}>
              Descartar
            </button>
          </div>
        )}

        {/* Pantalla inicial de selección */}
        {!busy && step === -1 && (
          <div>
            {/* Header llamativo */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(127,224,64,0.1)", border: "1px solid rgba(127,224,64,0.25)", borderRadius: 20, padding: "5px 14px", marginBottom: 16 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#7FE040", display: "inline-block" }} />
                <span style={{ color: "#7FE040", fontSize: "0.72rem", fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>IA generativa</span>
              </div>
              <h3 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 900, margin: "0 0 8px", lineHeight: 1.2 }}>
                Drokex <span style={{ color: "#7FE040" }}>Estudio</span>
              </h3>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.83rem", margin: 0, lineHeight: 1.5 }}>
                Crea banners e imágenes profesionales<br/>con inteligencia artificial en segundos.
              </p>
            </div>

            {/* Preview visual de banners generados */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, borderRadius: 14, overflow: "hidden", height: 90 }}>
              <video src="/hero-banner-dark-anim.mp4" autoPlay loop muted playsInline style={{ flex: 1, minWidth: 0, objectFit: "cover", borderRadius: 10 }} />
              <img src="/catalog-banner-orange.jpg" alt="" style={{ flex: 1, minWidth: 0, objectFit: "cover", borderRadius: 10 }} />
              <img src="/banner tiendas drokex virtual .jpg" alt="" style={{ flex: 1, minWidth: 0, objectFit: "cover", borderRadius: 10 }} />
            </div>

            {/* Features */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
              {["Genera imágenes únicas para tu marca", "Incluye tu mascota o personaje", "Elige color, estilo y productos"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(127,224,64,0.15)", border: "1px solid rgba(127,224,64,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7FE040" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.82rem" }}>{f}</span>
                </div>
              ))}
            </div>

            {/* CTA principal */}
            <button type="button" onClick={() => setStep(0)}
              style={{ width: "100%", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #7FE040 0%, #5bc42d 100%)", padding: "15px 18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10, boxShadow: "0 6px 24px rgba(127,224,64,0.35)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050505" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              <span style={{ color: "#050505", fontWeight: 900, fontSize: "0.97rem" }}>Crear con Drokex Estudio</span>
            </button>

            {/* Editar con IA la imagen actual */}
            {currentImage && (
              <button type="button" onClick={openCurrent} disabled={openingCurrent}
                style={{ width: "100%", borderRadius: 14, border: "1.5px solid rgba(127,224,64,0.35)", background: "rgba(127,224,64,0.06)", padding: "13px 18px", cursor: openingCurrent ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, marginBottom: 10, color: "#7FE040", fontWeight: 800, fontSize: "0.88rem" }}>
                <Wand2 size={16} /> {openingCurrent ? "Abriendo imagen..." : "Editar la imagen actual con IA"}
              </button>
            )}
            {!busy && step === -1 && error && <p style={{ color: "#f87171", fontSize: "0.8rem", margin: "0 0 10px", textAlign: "center" }}>{error}</p>}

            {/* Opción subir imagen */}
            {onUploadFile && (
              <button type="button" onClick={() => { onUploadFile(); onClose(); }}
                style={{ width: "100%", borderRadius: 14, border: "1.5px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", padding: "13px 18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, marginBottom: 10 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span style={{ color: "rgba(255,255,255,0.55)", fontWeight: 700, fontSize: "0.88rem" }}>Subir mi propia imagen</span>
              </button>
            )}

            <button type="button" onClick={onClose}
              style={{ width: "100%", borderRadius: 12, border: "none", background: "transparent", color: "rgba(255,255,255,0.25)", padding: "10px", fontWeight: 600, cursor: "pointer", fontSize: "0.8rem" }}>
              Cancelar
            </button>
          </div>
        )}

        {/* Barra de progreso (solo en pasos del wizard) */}
        {!busy && step >= 0 && (<>
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
          <div>
            <textarea value={productos} onChange={e => setProductos(e.target.value)} rows={3}
              placeholder="Ej: Café molido premium, café en grano, café instantáneo, té verde"
              style={{ ...inputStyle, resize: "vertical" }} />
            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", fontWeight: 700, margin: "16px 0 8px" }}>
              ¿Algo que deba aparecer sí o sí? <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>(opcional)</span>
            </label>
            <textarea value={mustInclude} onChange={e => setMustInclude(e.target.value)} rows={2}
              placeholder="Ej: una taza de café humeante, una prensa francesa"
              style={{ ...inputStyle, resize: "vertical" }} />
          </div>
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
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    {mascotaImg ? <><Check size={16} strokeWidth={3} /> Imagen cargada — clic para cambiar</> : <><Paperclip size={16} /> Subir imagen de la mascota</>}
                  </span>
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
                    style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", background: "#f87171", border: "none", color: "#fff", fontSize: "0.7rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}><X size={12} strokeWidth={3} /></button>
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
                <s.Icon size={24} color={estilo === s.id ? "#7FE040" : "rgba(255,255,255,0.7)"} style={{ marginBottom: 8 }} />
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
            onClick={() => step === 0 ? setStep(-1) : setStep(s => s - 1)}
            disabled={loading}
            style={{ flex: 1, borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "rgba(255,255,255,0.5)", padding: "13px", fontWeight: 700, cursor: "pointer", fontSize: "0.88rem" }}>
            {step === 0 ? "← Volver" : "← Atrás"}
          </button>

          {step < total - 1 ? (
            <button type="button" onClick={() => setStep(s => s + 1)} disabled={!canNext()}
              style={{ flex: 2, borderRadius: 12, border: "none", background: canNext() ? "#7FE040" : "rgba(127,224,64,0.25)", color: "#050505", padding: "13px", fontWeight: 900, cursor: canNext() ? "pointer" : "not-allowed", fontSize: "0.88rem" }}>
              Siguiente →
            </button>
          ) : (
            <button type="button" onClick={handleGenerate} disabled={loading || !canNext()}
              style={{ flex: 2, borderRadius: 12, border: "none", background: loading ? "rgba(127,224,64,0.4)" : "#7FE040", color: "#050505", padding: "13px", fontWeight: 900, cursor: loading ? "not-allowed" : "pointer", fontSize: "0.88rem" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Sparkles size={16} strokeWidth={2.5} /> {isBanner ? "Crear mi banner" : "Crear mi imagen"}
              </span>
            </button>
          )}
        </div>
        </>)}
      </div>
    </div>,
    document.body
  );
}

const primaryBtn = {
  flex: 2, borderRadius: 12, border: "none", background: "#7FE040", color: "#050505", padding: "13px",
  fontWeight: 900, cursor: "pointer", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
};

const secondaryBtn = {
  flex: 1, borderRadius: 12, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.75)",
  padding: "12px", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
};

const inputStyle = {
  width: "100%", borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.05)", color: "#fff", padding: "13px 15px",
  fontSize: "0.9rem", outline: "none", boxSizing: "border-box", fontFamily: "inherit",
};
