// Subida de imágenes a Supabase Storage vía API REST (sin SDK).
// Las landings guardaban las imágenes como data:URL dentro del JSONB, lo que
// inflaba el HTML de cada tienda a varios MB. Aquí solo viaja la URL.

const BUCKET = "landings";

function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

export function isStorageConfigured() {
  return config() !== null;
}

const EXT_BY_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

export function extensionFor(contentType) {
  return EXT_BY_TYPE[contentType] || null;
}

/**
 * Sube un buffer y devuelve la URL pública.
 * @param {Buffer|Uint8Array} data
 * @param {string} path  ruta dentro del bucket, ej "mecanix/logo-8f3a.png"
 * @param {string} contentType
 */
export async function uploadImage(data, path, contentType) {
  const cfg = config();
  if (!cfg) throw new Error("Supabase Storage no está configurado.");

  const res = await fetch(`${cfg.url}/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.key}`,
      "Content-Type": contentType,
      "x-upsert": "true",
    },
    body: data,
  });

  if (!res.ok) {
    throw new Error(`Storage respondió ${res.status}: ${await res.text()}`);
  }

  return `${cfg.url}/storage/v1/object/public/${BUCKET}/${path}`;
}
