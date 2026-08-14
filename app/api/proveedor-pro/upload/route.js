import { randomBytes } from "node:crypto";
import { getCurrentSession } from "@/lib/current-user";
import { uploadImage, extensionFor, isStorageConfigured } from "@/lib/storage";

const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(request) {
  const session = await getCurrentSession();
  if (!session?.userId) return Response.json({ error: "No autorizado." }, { status: 401 });

  if (!isStorageConfigured()) {
    return Response.json({ error: "Almacenamiento no configurado." }, { status: 503 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!file || typeof file.arrayBuffer !== "function") {
    return Response.json({ error: "Archivo requerido." }, { status: 400 });
  }

  const ext = extensionFor(file.type);
  if (!ext) return Response.json({ error: "Formato de imagen no admitido." }, { status: 415 });
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "La imagen supera los 8 MB." }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const path = `${session.userId}/${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;

  try {
    const url = await uploadImage(buffer, path, file.type);
    return Response.json({ url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 502 });
  }
}
