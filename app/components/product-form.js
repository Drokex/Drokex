"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "Automatizacion industrial",
  "Empaque y logistica",
  "Movilidad electrica",
  "Agroindustria",
  "Retail y consumo",
  "Construccion modular",
];

const AVAILABILITY = [
  "Entrega inmediata",
  "Disponible por pedido",
  "Produccion programada",
];

function ImageUploadBox({ label, value, onChange }) {
  const ref = useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
  }

  return (
    <div className="pf-img-box" onClick={() => ref.current?.click()} title={label}>
      {value ? (
        <img src={value} alt={label} className="pf-img-preview" />
      ) : (
        <span className="pf-img-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          {label}
        </span>
      )}
      <input ref={ref} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
    </div>
  );
}

export default function ProductForm({ initial = {}, productId = null }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: initial.name || "",
    sku: initial.sku || "",
    category: initial.category || CATEGORIES[0],
    supplier: initial.supplier || "",
    originCountry: initial.originCountry || "Colombia",
    priceValue: initial.priceValue ?? "",
    stock: initial.stock ?? "",
    minimumStock: initial.minimumStock ?? 3,
    availability: initial.availability || AVAILABILITY[0],
    shortDescription: initial.shortDescription || "",
    description: initial.description || "",
    application: initial.application || "",
    featured: initial.featured || false,
    active: initial.active !== false,
    image: initial.image || "",
    galleryImages: initial.galleryImages || [],
  });

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setGallery(index, value) {
    setForm((f) => {
      const imgs = [...f.galleryImages];
      imgs[index] = value;
      return { ...f, galleryImages: imgs };
    });
  }

  function addGallerySlot() {
    setForm((f) => ({ ...f, galleryImages: [...f.galleryImages, ""] }));
  }

  function removeGallery(index) {
    setForm((f) => {
      const imgs = f.galleryImages.filter((_, i) => i !== index);
      return { ...f, galleryImages: imgs };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const method = productId ? "PATCH" : "POST";
      const url = productId ? `/api/products/${productId}` : "/api/products";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "No fue posible guardar el producto.");
        setSaving(false);
        return;
      }

      router.push("/mi-cuenta/productos/inventario");
      router.refresh();
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
      setSaving(false);
    }
  }

  return (
    <form className="pf-form" onSubmit={handleSubmit}>
      <div className="pf-section">
        <h3>Imágenes</h3>
        <div className="pf-images-row">
          <div>
            <p className="pf-label">Imagen principal</p>
            <ImageUploadBox
              label="Subir imagen"
              value={form.image}
              onChange={(v) => set("image", v)}
            />
          </div>
          <div className="pf-gallery">
            <p className="pf-label">Galería adicional</p>
            <div className="pf-gallery-row">
              {form.galleryImages.map((img, i) => (
                <div key={i} className="pf-gallery-slot">
                  <ImageUploadBox
                    label={`Foto ${i + 1}`}
                    value={img}
                    onChange={(v) => setGallery(i, v)}
                  />
                  <button type="button" className="pf-gallery-remove" onClick={() => removeGallery(i)}>×</button>
                </div>
              ))}
              {form.galleryImages.length < 5 && (
                <button type="button" className="pf-gallery-add" onClick={addGallerySlot}>+ Foto</button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pf-section">
        <h3>Información básica</h3>
        <div className="pf-grid-2">
          <div className="pf-field">
            <label>Nombre del producto *</label>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="Ej. Módulo IoT Trazabilidad" />
          </div>
          <div className="pf-field">
            <label>SKU</label>
            <input value={form.sku} onChange={(e) => set("sku", e.target.value)} placeholder="Ej. DRK-001" />
          </div>
          <div className="pf-field">
            <label>Categoría</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="pf-field">
            <label>Disponibilidad</label>
            <select value={form.availability} onChange={(e) => set("availability", e.target.value)}>
              {AVAILABILITY.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="pf-field">
            <label>Proveedor / Empresa</label>
            <input value={form.supplier} onChange={(e) => set("supplier", e.target.value)} placeholder="Ej. Nova Tracking Labs" />
          </div>
          <div className="pf-field">
            <label>País de origen</label>
            <input value={form.originCountry} onChange={(e) => set("originCountry", e.target.value)} placeholder="Colombia" />
          </div>
        </div>
      </div>

      <div className="pf-section">
        <h3>Precio e inventario</h3>
        <div className="pf-grid-3">
          <div className="pf-field">
            <label>Precio (USD cents) *</label>
            <input type="number" min="0" value={form.priceValue} onChange={(e) => set("priceValue", e.target.value)} required placeholder="150000" />
          </div>
          <div className="pf-field">
            <label>Stock disponible</label>
            <input type="number" min="0" value={form.stock} onChange={(e) => set("stock", e.target.value)} placeholder="0" />
          </div>
          <div className="pf-field">
            <label>Stock mínimo</label>
            <input type="number" min="0" value={form.minimumStock} onChange={(e) => set("minimumStock", e.target.value)} placeholder="3" />
          </div>
        </div>
      </div>

      <div className="pf-section">
        <h3>Descripción</h3>
        <div className="pf-field">
          <label>Descripción corta *</label>
          <input value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} required placeholder="Una línea que resume el producto" />
        </div>
        <div className="pf-field">
          <label>Descripción completa</label>
          <textarea rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Detalle técnico, usos, ventajas..." />
        </div>
        <div className="pf-field">
          <label>Aplicación / Uso principal</label>
          <input value={form.application} onChange={(e) => set("application", e.target.value)} placeholder="Ej. Monitoreo de cadena de frío" />
        </div>
      </div>

      <div className="pf-section pf-section-row">
        <label className="pf-toggle">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
          <span>Producto destacado</span>
        </label>
        <label className="pf-toggle">
          <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} />
          <span>Producto activo</span>
        </label>
      </div>

      {error && <p className="pf-error">{error}</p>}

      <div className="pf-footer">
        <a href="/mi-cuenta/productos/inventario" className="pf-cancel">Cancelar</a>
        <button type="submit" className="pf-submit" disabled={saving}>
          {saving ? "Guardando..." : productId ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </form>
  );
}
