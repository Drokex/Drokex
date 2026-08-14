// Sube la imagen y devuelve su URL pública.
// Antes se usaba FileReader.readAsDataURL y el base64 terminaba dentro del
// JSONB de la landing, inflando el HTML de la tienda a varios MB.
export async function uploadImage(file) {
  const body = new FormData();
  body.append("file", file);

  const res = await fetch("/api/proveedor-pro/upload", { method: "POST", body });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.error || "No se pudo subir la imagen.");
  return data.url;
}
