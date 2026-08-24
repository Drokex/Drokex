"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Pencil,
  Trash2,
  X,
  ImageOff,
  Upload,
  Package,
  Tag,
  Truck,
  Globe,
  DollarSign,
  Layers,
  AlertTriangle,
  ImagePlus,
  Save,
  CheckCircle2,
} from "lucide-react";
import SiteHeader from "@/app/components/site-header";
import ConfirmPopup from "@/app/components/confirm-popup";
import { inferCurrencyFromOriginCountry } from "@/lib/market-pricing";
import styles from "./productos.module.css";

function formatPrice(value, originCountry) {
  const currency = inferCurrencyFromOriginCountry(originCountry) || "USD";
  try {
    return new Intl.NumberFormat("es-CO", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
  } catch {
    return `${currency} ${value}`;
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const MAX_IMAGE_DIMENSION = 1600;
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15MB, antes de comprimir

// Guardar una imagen pesada tal cual (varios MB en base64 dentro de una fila)
// cuelga el pooler de Supabase. Redimensionamos/comprimimos en el navegador
// para que lo que viaja a la BD nunca pese más de ~1-2MB.
async function fileToBase64(file) {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("La imagen es demasiado pesada (máx. 15MB).");
  }

  const dataUrl = await readFileAsDataUrl(file);
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return dataUrl;
  }

  const img = new Image();
  const loaded = new Promise((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
  });
  img.src = dataUrl;
  await loaded;

  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(img.width, img.height));
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", 0.82);
}

function toFormState(product) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku || "",
    supplier: product.supplier,
    originCountry: product.originCountry,
    category: product.category,
    priceValue: String(product.priceValue),
    previousPriceValue: String(product.previousPriceValue),
    stock: String(product.stock),
    minimumStock: String(product.minimumStock),
    image: product.image,
    galleryImages: product.galleryImages,
    video: product.video || "",
    availability: product.availability,
    shortDescription: product.shortDescription,
    description: product.description,
    application: product.application,
    marketFocus: product.marketFocus,
    compatibility: product.compatibility.join(", "),
    technicalSpecs: product.technicalSpecs.map((item) => `${item.etiqueta}: ${item.valor}`).join("\n"),
    featured: product.featured,
  };
}

function toPayload(form) {
  return {
    slug: form.slug,
    sku: form.sku,
    supplier: form.supplier,
    originCountry: form.originCountry,
    category: form.category,
    name: form.name,
    priceValue: Number(form.priceValue),
    previousPriceValue: Number(form.previousPriceValue),
    stock: Number(form.stock),
    minimumStock: Number(form.minimumStock),
    image: form.image,
    galleryImages: form.galleryImages.filter(Boolean),
    video: form.video,
    availability: form.availability,
    shortDescription: form.shortDescription,
    description: form.description,
    application: form.application,
    marketFocus: form.marketFocus,
    compatibility: form.compatibility.split(",").map((item) => item.trim()).filter(Boolean),
    technicalSpecs: form.technicalSpecs
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, ...rest] = line.split(":");
        return { etiqueta: (label || "").trim(), valor: rest.join(":").trim() };
      })
      .filter((item) => item.etiqueta && item.valor),
    featured: form.featured,
  };
}

export default function AdminProductosPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [toast, setToast] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/products");
    if (res.ok) {
      const data = await res.json();
      setProducts(Array.isArray(data.products) ? data.products : []);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name, p.category, p.supplier, p.originCountry].filter(Boolean).some((v) => v.toLowerCase().includes(q)),
    );
  }, [products, search]);

  async function confirmRemove() {
    const product = pendingDelete;
    setPendingDelete(null);
    await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    load();
    setToast(`"${product.name}" eliminado.`);
    setTimeout(() => setToast(""), 3000);
  }

  function openEdit(product) {
    setEditing(product);
    setForm(toFormState(product));
    setSaveError("");
  }

  function closeEdit() {
    setEditing(null);
    setForm(null);
  }

  async function saveEdit(e) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setSaveError("");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    let res;
    try {
      res = await fetch(`/api/products/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(form)),
        signal: controller.signal,
      });
    } catch (err) {
      setSaving(false);
      setSaveError(
        err.name === "AbortError"
          ? "El guardado tardó demasiado. Probá con una foto más liviana o revisá tu conexión."
          : "No fue posible conectar con el servidor.",
      );
      return;
    } finally {
      clearTimeout(timeout);
    }

    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setSaveError(data.error || "No fue posible guardar los cambios.");
      return;
    }
    closeEdit();
    load();
    setToast("Producto actualizado correctamente.");
    setTimeout(() => setToast(""), 3000);
  }

  async function handleMainImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaveError("");
    try {
      const base64 = await fileToBase64(file);
      setForm((f) => ({ ...f, image: base64 }));
    } catch (err) {
      setSaveError(err.message || "No fue posible procesar la imagen.");
    }
    e.target.value = "";
  }

  async function handleGalleryImages(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setSaveError("");
    try {
      const encoded = await Promise.all(files.map(fileToBase64));
      setForm((f) => ({ ...f, galleryImages: [...f.galleryImages, ...encoded] }));
    } catch (err) {
      setSaveError(err.message || "No fue posible procesar alguna imagen.");
    }
    e.target.value = "";
  }

  function removeGalleryImage(index) {
    setForm((f) => ({ ...f, galleryImages: f.galleryImages.filter((_, i) => i !== index) }));
  }

  return (
    <div className={styles.page}>
      <SiteHeader />

      {toast ? (
        <div className={styles.toast}>
          <CheckCircle2 size={16} />
          {toast}
        </div>
      ) : null}
      <div className={styles.shell}>
        <div className={styles.topBar}>
          <div>
            <Link href="/admin" className={styles.backLink}>← Panel admin</Link>
            <h1 className={styles.title}>Productos</h1>
            <p className={styles.subtitle}>Catálogo completo de productos publicados en Drokex.</p>
          </div>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={15} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, categoría, proveedor o país..."
            />
          </div>
        </div>

        <p className={styles.countRow}>{filtered.length} producto{filtered.length === 1 ? "" : "s"}</p>

        {loading ? (
          <p className={styles.emptyState}>Cargando productos...</p>
        ) : filtered.length === 0 ? (
          <p className={styles.emptyState}>No se encontraron productos.</p>
        ) : (
          <div className={styles.grid}>
            {filtered.map((product) => {
              const lowStock = Number(product.stock) <= 5;
              return (
                <article key={product.id} className={styles.card}>
                  <div className={styles.cardMedia}>
                    {product.image ? (
                      <img src={product.image} alt={product.name} loading="lazy" />
                    ) : (
                      <div className={styles.cardMediaPlaceholder}>
                        <ImageOff size={28} strokeWidth={1.6} />
                      </div>
                    )}
                    <span className={lowStock ? `${styles.stockBadge} ${styles.stockBadgeLow}` : styles.stockBadge}>
                      Stock: {product.stock}
                    </span>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.identity}>
                      <strong>{product.name}</strong>
                      <span>{product.category} · {product.supplier}</span>
                    </div>
                    <div className={styles.priceRow}>
                      <span className={styles.price}>{formatPrice(product.priceValue, product.originCountry)}</span>
                      {Number(product.previousPriceValue) > Number(product.priceValue) ? (
                        <span className={styles.previousPrice}>{formatPrice(product.previousPriceValue, product.originCountry)}</span>
                      ) : null}
                    </div>
                  </div>

                  <div className={styles.actionsRow}>
                    <button type="button" className={styles.actionBtn} onClick={() => openEdit(product)}>
                      <Pencil size={13} /> Editar
                    </button>
                    <button
                      type="button"
                      className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                      onClick={() => setPendingDelete(product)}
                      aria-label="Eliminar producto"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <ConfirmPopup
          open={Boolean(pendingDelete)}
          title="Borrar producto"
          message={pendingDelete ? `¿Borrar el producto "${pendingDelete.name}"? Esta acción no se puede deshacer.` : ""}
          confirmLabel="Borrar"
          onConfirm={confirmRemove}
          onCancel={() => setPendingDelete(null)}
        />

        {form ? (
          <div className={styles.modalOverlay} onClick={closeEdit}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHead}>
                <div className={styles.modalHeadTitle}>
                  <span className={styles.modalHeadIcon}>
                    <Package size={19} />
                  </span>
                  <div>
                    <h2>Editar producto</h2>
                    <p>Actualiza la información de tu producto.</p>
                  </div>
                </div>
                <button type="button" className={styles.modalClose} onClick={closeEdit} aria-label="Cerrar">
                  <X size={16} />
                </button>
              </div>

              <form id="edit-product-form" onSubmit={saveEdit} className={styles.formGrid}>
                <div className={`${styles.field} ${styles.fieldWide}`}>
                  <label>Nombre del producto<span className={styles.required}>*</span></label>
                  <div className={styles.inputIconWrap}>
                    <Package size={15} strokeWidth={2} />
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Categoría<span className={styles.required}>*</span></label>
                  <div className={styles.inputIconWrap}>
                    <Tag size={15} strokeWidth={2} />
                    <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Proveedor<span className={styles.required}>*</span></label>
                  <div className={styles.inputIconWrap}>
                    <Truck size={15} strokeWidth={2} />
                    <input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>País de origen</label>
                  <div className={styles.inputIconWrap}>
                    <Globe size={15} strokeWidth={2} />
                    <input value={form.originCountry} onChange={(e) => setForm({ ...form, originCountry: e.target.value })} />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Precio<span className={styles.required}>*</span></label>
                  <div className={styles.inputIconWrap}>
                    <DollarSign size={15} strokeWidth={2} />
                    <input
                      type="number"
                      value={form.priceValue}
                      onChange={(e) => setForm({ ...form, priceValue: e.target.value })}
                    />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Precio anterior</label>
                  <div className={styles.inputIconWrap}>
                    <Tag size={15} strokeWidth={2} />
                    <input
                      type="number"
                      value={form.previousPriceValue}
                      onChange={(e) => setForm({ ...form, previousPriceValue: e.target.value })}
                    />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Stock<span className={styles.required}>*</span></label>
                  <div className={styles.inputIconWrap}>
                    <Layers size={15} strokeWidth={2} />
                    <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Stock mínimo<span className={styles.required}>*</span></label>
                  <div className={styles.inputIconWrap}>
                    <AlertTriangle size={15} strokeWidth={2} />
                    <input
                      type="number"
                      value={form.minimumStock}
                      onChange={(e) => setForm({ ...form, minimumStock: e.target.value })}
                    />
                  </div>
                </div>

                <hr className={styles.sectionDivider} />

                <div className={styles.field}>
                  <span className={styles.sectionLabel}>Foto principal</span>
                  <span className={styles.sectionHint}>Esta imagen se mostrará como portada del producto.</span>
                  <div className={styles.uploadRow}>
                    {form.image ? (
                      <img src={form.image} alt="" className={styles.uploadPreview} />
                    ) : (
                      <div className={`${styles.uploadPreview} ${styles.uploadPreviewEmpty}`}>
                        <ImageOff size={20} strokeWidth={1.6} />
                      </div>
                    )}
                    <label className={styles.uploadDropzone}>
                      <span><Upload size={14} /> Subir foto</span>
                      <small>JPG, PNG · Máx. 5MB</small>
                      <input type="file" accept="image/*" onChange={handleMainImage} hidden />
                    </label>
                  </div>
                </div>

                <div className={styles.field}>
                  <span className={styles.sectionLabel}>Fotos adicionales</span>
                  <span className={styles.sectionHint}>Agrega imágenes adicionales del producto.</span>
                  <div className={styles.galleryRow}>
                    {form.galleryImages.map((src, i) => (
                      <div key={i} className={styles.galleryThumb}>
                        <img src={src} alt="" />
                        <button type="button" onClick={() => removeGalleryImage(i)} aria-label="Quitar foto">
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                    <label className={styles.uploadDropzone}>
                      <span><ImagePlus size={14} /> Agregar fotos</span>
                      <small>JPG, PNG · Máx. 5MB por imagen</small>
                      <input type="file" accept="image/*" multiple onChange={handleGalleryImages} hidden />
                    </label>
                  </div>
                </div>

                <hr className={styles.sectionDivider} />

                <div className={styles.field}>
                  <label>Video (enlace de YouTube, Vimeo o .mp4)</label>
                  <input
                    value={form.video}
                    onChange={(e) => setForm({ ...form, video: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className={styles.field}>
                  <label>Disponibilidad</label>
                  <input value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} />
                </div>
                <div className={`${styles.field} ${styles.fieldWide}`}>
                  <label>Descripción corta</label>
                  <textarea
                    rows={2}
                    value={form.shortDescription}
                    onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  />
                </div>

                {saveError ? <p className={`${styles.fieldError} ${styles.fieldWide}`}>{saveError}</p> : null}
              </form>

              <div className={styles.modalActions}>
                <button type="button" className={styles.ghostBtn} onClick={closeEdit}>
                  Cancelar
                </button>
                <button type="submit" form="edit-product-form" className={styles.primaryBtn} disabled={saving}>
                  <Save size={14} />
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
