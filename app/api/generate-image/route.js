import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

export async function POST(request) {
  try {
    const body = await request.json();
    let b64;

    if (body.guided) {
      const { color, productos, tieneMascota, mascotaImg, tieneProductosImg, estilo } = body;
      const colorName = hexToColorName(color);

      const styleMap = {
        profesional: "corporate",
        alegre:      "playful",
        elegante:    "luxury",
        natural:     "minimal",
      };
      const styleWord = styleMap[estilo] || "corporate";

      const businessContext = `Products/Services: ${productos}`;

      if (tieneMascota && mascotaImg) {
        // Con mascota: gpt-image-1 genera el banner completo con el personaje
        const mimeMatch = mascotaImg.match(/^data:([^;]+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : "image/png";
        const ext = mimeType.split("/")[1] || "png";
        const buffer = Buffer.from(mascotaImg.replace(/^data:[^;]+;base64,/, ""), "base64");
        const blob = new Blob([buffer], { type: mimeType });
        const file = new File([blob], `mascota.${ext}`, { type: mimeType });

        const mascotPrompt = tieneProductosImg
          ? `Create a premium horizontal website banner. NO TEXT, NO WORDS, NO LETTERS anywhere.

The uploaded reference image is split in two halves: LEFT HALF shows product items to include in the scene, RIGHT HALF shows the mascot/character. Use both as visual references.

Place the exact mascot character (from the right half of the reference) FULLY VISIBLE on the right side of the banner. Display the products (from the left half of the reference) naturally arranged in the scene around the character.

The far LEFT area of the banner must be clean — only the background color.

Background: solid ${colorName} (${color}). Style: ${styleWord}.`
          : `Create a premium horizontal website banner. NO TEXT, NO WORDS, NO LETTERS anywhere.

The character from the uploaded image appears on the RIGHT SIDE of the banner, FULLY VISIBLE from head to feet with comfortable space around it. The character maintains its exact colors, design and style. It blends naturally with the scene.

The LEFT HALF is completely empty — only the background color.

Background: solid ${colorName} (${color}). Style: ${styleWord}. Context: ${businessContext}.`;

        const res = await openai.images.edit({
          model: "gpt-image-1",
          image: file,
          prompt: mascotPrompt,
          n: 1,
          size: "1536x1024",
        });
        b64 = res.data[0].b64_json;

      } else {
        // Sin mascota: DALL-E 3 genera escena de productos, sin personajes
        const noMascotPrompt =
`Premium horizontal website banner background. NO TEXT. NO CHARACTERS. NO ANIMALS. NO PEOPLE.

Solid ${colorName} (${color}) background. Right side has elegant product/lifestyle objects related to: ${businessContext}. Left side completely empty. ${styleWord} aesthetic, ultra clean, professional. 1792x1024.`;

        const res = await openai.images.generate({
          model: "dall-e-3",
          prompt: noMascotPrompt,
          n: 1,
          size: "1792x1024",
          response_format: "b64_json",
        });
        b64 = res.data[0].b64_json;
      }

    } else {
      if (!body.prompt?.trim()) {
        return Response.json({ error: "Descripción requerida" }, { status: 400 });
      }
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: body.prompt.trim(),
        n: 1,
        size: "1792x1024",
        response_format: "b64_json",
      });
      b64 = response.data[0].b64_json;
    }

    return Response.json({ image: `data:image/png;base64,${b64}` }); // fallback modo libre

  } catch (err) {
    console.error("generate-image error:", err);
    return Response.json({ error: err.message || "Error generando imagen" }, { status: 500 });
  }
}
