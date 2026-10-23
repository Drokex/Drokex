import OpenAI from "openai";
import { getCurrentUser } from "@/lib/current-user";

function hexToColorName(hex) {
  const h = hex.replace("#", "").toLowerCase();
  const r = parseInt(h.slice(0,2),16);
  const g = parseInt(h.slice(2,4),16);
  const b = parseInt(h.slice(4,6),16);
  if (r > 200 && g < 80  && b < 80)  return "red";
  if (r > 220 && g > 100 && b < 80)  return "orange";
  if (r > 200 && g > 200 && b < 80)  return "yellow";
  if (r < 100 && g > 160 && b < 100) return "green";
  if (r < 100 && g < 100 && b > 180) return "blue";
  if (r > 120 && g < 80  && b > 150) return "purple";
  if (r > 220 && g > 220 && b > 220) return "white";
  if (r < 40  && g < 40  && b < 40)  return "black";
  if (r > 180 && g > 130 && b < 80)  return "golden";
  return `color ${hex}`;
}

const MODEL = "gpt-image-2";
// wide = banner que el cliente estira a la izquierda; el resto se usa tal cual en su recuadro
const SIZE_BY_FORMAT = { wide: "1536x1024", landscape: "1536x1024", square: "1024x1024", portrait: "1024x1536" };
const STYLE_MAP = { profesional: "corporate", alegre: "playful", elegante: "luxury", natural: "minimal" };

function dataUrlToFile(dataUrl, name) {
  const match = /^data:(image\/(png|jpeg|webp));base64,/.exec(dataUrl || "");
  if (!match) throw new Error("Imagen de referencia inválida");
  const buffer = Buffer.from(dataUrl.slice(match[0].length), "base64");
  return new File([buffer], `${name}.${match[2]}`, { type: match[1] });
}

function buildPrompt({ color, productos, mustInclude, estilo, format, hasMascota, productCount }) {
  const lines = [
    format === "wide"
      ? "Create a premium horizontal website banner."
      : `Create a premium ${format} commercial image for an online store.`,
    "Do NOT add any new text, words or letters to the image.",
    `The business sells: ${productos}. Make the scene and any props thematically match it.`,
  ];
  if (mustInclude) lines.push(`REQUIRED — this MUST appear in the image, clearly visible and recognizable: ${mustInclude}.`);
  if (hasMascota) lines.push("The FIRST reference image is the brand mascot/character: include it FULLY VISIBLE, keeping its exact design, colors and proportions.");
  if (productCount) lines.push(`${hasMascota ? "The other reference images show" : "The reference images show"} the real products: show them faithfully (same shape, colors, packaging and label design, including any printed text or artwork on them), naturally arranged in the scene.`);
  if (!hasMascota) lines.push("No people, no characters, no animals.");
  lines.push(format === "wide"
    // El cliente ya extiende el banner con espacio vacío a la izquierda (toWideFormat)
    ? "Composition: the subjects are large and prominent, filling the center and right of the frame. Keep only a narrow strip on the far LEFT edge as plain background, so it blends into a wider banner."
    : "Composition: subjects centered and filling most of the frame, with comfortable margins; nothing important touching the edges. Clean commercial photography.");
  lines.push(`Background: flat, uniform solid ${hexToColorName(color)} (${color}). Style: ${STYLE_MAP[estilo] || "corporate"}.`);
  return lines.join("\n\n");
}

// Responde NDJSON: {type:"partial"|"done", image} ... o {type:"error", error}
export async function POST(request) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "PROVIDER" && user.role !== "ADMIN")) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const body = await request.json();
    let prompt, refs = [], size = "1536x1024";

    if (body.edit) {
      // Cambio sobre una imagen ya generada (tipo chat)
      const instruction = String(body.edit.instruction || "").trim().slice(0, 500);
      if (!instruction) return Response.json({ error: "Describe el cambio" }, { status: 400 });
      refs = [dataUrlToFile(body.edit.image, "actual")];
      size = Object.values(SIZE_BY_FORMAT).includes(body.edit.size) ? body.edit.size : "1536x1024";
      prompt = `Edit this image. Apply ONLY this change: ${instruction}\n\nKeep everything else exactly the same: composition, products and their labels, background color, lighting and style. Do not add new text.`;
    } else if (body.guided) {
      const productos = String(body.productos || "").trim().slice(0, 500);
      if (!productos) return Response.json({ error: "Describe tus productos" }, { status: 400 });
      const format = SIZE_BY_FORMAT[body.format] ? body.format : "wide";
      const hasMascota = !!(body.tieneMascota && body.mascotaImg);
      const productImgs = (Array.isArray(body.productosImgs) ? body.productosImgs : []).slice(0, 3);
      if (hasMascota) refs.push(dataUrlToFile(body.mascotaImg, "mascota"));
      productImgs.forEach((img, i) => refs.push(dataUrlToFile(img, `producto-${i + 1}`)));
      size = SIZE_BY_FORMAT[format];
      prompt = buildPrompt({
        color: /^#[0-9a-f]{6}$/i.test(body.color) ? body.color : "#7FE040",
        productos,
        mustInclude: String(body.mustInclude || "").trim().slice(0, 300),
        estilo: body.estilo,
        format,
        hasMascota,
        productCount: productImgs.length,
      });
    } else {
      prompt = String(body.prompt || "").trim().slice(0, 1000);
      if (!prompt) return Response.json({ error: "Descripción requerida" }, { status: 400 });
    }

    const params = { model: MODEL, prompt, size, output_format: "jpeg", output_compression: 90, stream: true, partial_images: 2 };
    const stream = refs.length
      ? await openai.images.edit({ ...params, image: refs })
      : await openai.images.generate(params);

    const encoder = new TextEncoder();
    return new Response(new ReadableStream({
      async start(controller) {
        const send = (obj) => controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
        try {
          for await (const event of stream) {
            const image = `data:image/jpeg;base64,${event.b64_json}`;
            if (event.type.endsWith(".partial_image")) send({ type: "partial", image });
            else if (event.type.endsWith(".completed")) send({ type: "done", image });
          }
        } catch (err) {
          console.error("generate-image stream error:", err);
          send({ type: "error", error: err.message || "Error generando imagen" });
        }
        controller.close();
      },
    }), { headers: { "Content-Type": "application/x-ndjson", "Cache-Control": "no-store" } });

  } catch (err) {
    console.error("generate-image error:", err);
    return Response.json({ error: err.message || "Error generando imagen" }, { status: 500 });
  }
}
