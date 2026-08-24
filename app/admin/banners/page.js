"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useHeroEntrance } from "@/app/components/use-hero-entrance";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowUpDown, X } from "lucide-react";
import SiteHeader from "@/app/components/site-header";
import ConfirmPopup from "@/app/components/confirm-popup";
import styles from "./banners.module.css";

const SLOTS = [
  {
    key: "home",
    label: "Banner ancho del home",
    description: "Aparece en la página de inicio (/), debajo de los destacados. Solo se muestra el primero activo.",
    dims: "2400 × 800 px (horizontal, proporción 3:1)",
    width: 2400,
    height: 800,
  },
  {
    key: "popup",
    label: "Pop-up al navegar",
    description:
      "Aparece como modal al cambiar de página en /productos, /directorio, /para-proveedores, /servicios, /sobre-nosotros, /ayuda y /home-v1. Se elige uno al azar entre los activos en cada visita.",
    dims: "300 × 600 px (vertical) o 1080 × 1080 px (cuadrado)",
    width: 300,
    height: 600,
  },
  {
    key: "sidebar",
    label: "Banner lateral del catálogo",
    description: "Aparece en la barra lateral de /productos, junto al listado. Se elige uno al azar entre los activos en cada visita.",
    dims: "300 × 600 px (vertical)",
    width: 300,
    height: 600,
  },
];

const FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "home", label: "Home" },
  { key: "popup", label: "Pop-up" },
  { key: "sidebar", label: "Lateral" },
  { key: "activos", label: "Activos" },
  { key: "inactivos", label: "Inactivos" },
];

const emptyForm = { id: "", slot: "popup", imageUrl: "", alt: "", linkUrl: "", width: 300, height: 600, active: true, order: 0 };

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("todos");
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [formError, setFormError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const heroRef = useRef(null);
  useHeroEntrance(heroRef);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/banners");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al cargar banners");
      setBanners(data.banners || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleActive(banner) {
    await fetch("/api/admin/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...banner, active: !banner.active }),
    });
    load();
  }

  async function confirmRemove() {
    const banner = pendingDelete;
    setPendingDelete(null);
    await fetch(`/api/admin/banners?id=${banner.id}`, { method: "DELETE" });
    load();
  }

  async function handleFileUpload(file) {
    if (!file) return;
    setUploading(true);
    setUploadError(""); setFormError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/banners/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al subir imagen");
      setForm((f) => ({ ...f, imageUrl: data.url }));
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function saveForm(e) {
    e.preventDefault();
    setFormError("");
    if (!form.imageUrl) {
      setFormError("Sube una imagen o pega una URL antes de guardar.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");
      setForm(null);
      load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const visibleSlots = useMemo(() => {
    if (filter === "todos" || filter === "activos" || filter === "inactivos") return SLOTS;
    return SLOTS.filter((s) => s.key === filter);
  }, [filter]);

  function bannersFor(slotKey) {
    let list = banners.filter((b) => b.slot === slotKey);
    if (filter === "activos") list = list.filter((b) => b.active);
    if (filter === "inactivos") list = list.filter((b) => !b.active);
    list = [...list].sort((a, b) =>
      sortNewestFirst ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt),
    );
    return list;
  }

  const totalCount = banners.length;

  return (
    <div className={styles.page}>
      <SiteHeader />
      <div className={styles.shell} ref={heroRef} data-hero-item>
        <div className={styles.topBar}>
          <div>
            <Link href="/admin" className={styles.backLink}>← Panel admin</Link>
            <h1 className={styles.title}>Banners y publicidad</h1>
            <p className={styles.subtitle}>
              Administra las campañas publicitarias y los banners de tu tienda. {totalCount} en total.
            </p>
          </div>
          <div className={styles.topActions}>
            <button
              type="button"
              className={styles.newButton}
              onClick={() => {
                setUploadError(""); setFormError("");
                setForm({ ...emptyForm });
              }}
            >
              <Plus size={16} strokeWidth={2.5} /> Nuevo banner
            </button>
          </div>
        </div>

        {error && <p style={{ color: "#b00020" }}>{error}</p>}

        <div className={styles.filterRow}>
          <div className={styles.pills}>
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                className={`${styles.pill} ${filter === f.key ? styles.pillActive : ""}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button type="button" className={styles.sortSelect} onClick={() => setSortNewestFirst((v) => !v)}>
            <ArrowUpDown size={14} /> {sortNewestFirst ? "Más recientes" : "Más antiguos"}
          </button>
        </div>

        {loading ? (
          <p className={styles.emptyState}>Cargando…</p>
        ) : (
          visibleSlots.map((slotInfo) => {
            const list = bannersFor(slotInfo.key);
            return (
              <section key={slotInfo.key} className={styles.section}>
                <div className={styles.sectionHead}>
                  <h2>{slotInfo.label}</h2>
                  <span className={styles.sectionCount}>{list.length} banners</span>
                </div>
                <p className={styles.sectionDesc}>{slotInfo.description}</p>

                <div className={styles.grid}>
                  {list.map((banner) => (
                    <div key={banner.id} className={styles.card}>
                      <div className={styles.cardMedia} style={{ aspectRatio: `${banner.width} / ${banner.height}` }}>
                        <Image src={banner.imageUrl} alt={banner.alt} fill sizes="220px" style={{ objectFit: "cover" }} />
                      </div>
                      <div className={styles.cardBody}>
                        <p className={styles.cardTitle}>{banner.alt}</p>
                        <span className={styles.cardMeta}>{slotInfo.label}</span>
                        <div className={styles.statusRow}>
                          <span className={`${styles.dot} ${banner.active ? styles.dotActive : ""}`} />
                          <span className={banner.active ? styles.statusActive : styles.statusInactive}>
                            {banner.active ? "Activo" : "Inactivo"}
                          </span>
                        </div>
                        <div className={styles.cardActions}>
                          <button
                            className={styles.iconBtn}
                            title="Editar"
                            onClick={() => {
                              setUploadError(""); setFormError("");
                              setForm(banner);
                            }}
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            className={styles.iconBtn}
                            title={banner.active ? "Desactivar" : "Activar"}
                            onClick={() => toggleActive(banner)}
                          >
                            {banner.active ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                          <button
                            className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                            title="Borrar"
                            onClick={() => setPendingDelete(banner)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filter !== "activos" && filter !== "inactivos" && (
                    <button
                      type="button"
                      className={styles.addCard}
                      onClick={() => {
                        setUploadError(""); setFormError("");
                        setForm({
                          ...emptyForm,
                          slot: slotInfo.key,
                          width: slotInfo.width,
                          height: slotInfo.height,
                        });
                      }}
                    >
                      <span className={styles.addIconCircle}>
                        <Plus size={16} strokeWidth={2.5} />
                      </span>
                      Agregar banner
                      <span>Otro anuncio o campaña para {slotInfo.label.toLowerCase()}.</span>
                    </button>
                  )}

                  {list.length === 0 && (filter === "activos" || filter === "inactivos") && (
                    <p className={styles.emptyState}>No hay banners {filter} en esta ubicación.</p>
                  )}
                </div>
              </section>
            );
          })
        )}

        {form && (
          <div className={styles.modalOverlay} onClick={() => setForm(null)}>
            <form onSubmit={saveForm} className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHead}>
                <h2>{form.id ? "Editar banner" : "Nuevo banner"}</h2>
                <button type="button" className={styles.iconBtn} onClick={() => setForm(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className={styles.field}>
                <label>Ubicación</label>
                <select
                  value={form.slot}
                  onChange={(e) => {
                    const slotInfo = SLOTS.find((s) => s.key === e.target.value);
                    setForm({ ...form, slot: e.target.value, width: slotInfo.width, height: slotInfo.height });
                  }}
                >
                  {SLOTS.map((s) => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
                <p className={styles.dimsHint}>
                  Tamaño recomendado: {SLOTS.find((s) => s.key === form.slot)?.dims}
                </p>
              </div>

              <div className={styles.field}>
                <label>Imagen del banner</label>
                <label className={styles.uploadZone}>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={(e) => handleFileUpload(e.target.files?.[0])}
                    hidden
                  />
                  {form.imageUrl ? (
                    <div className={styles.previewBox} style={{ aspectRatio: `${form.width} / ${form.height}` }}>
                      <Image src={form.imageUrl} alt="preview" fill sizes="200px" style={{ objectFit: "cover" }} />
                      <span className={styles.previewOverlay}>{uploading ? "Subiendo…" : "Cambiar imagen"}</span>
                    </div>
                  ) : (
                    <span className={styles.uploadZoneText}>
                      {uploading ? "Subiendo…" : "Haz clic para subir una imagen"}
                    </span>
                  )}
                </label>
                {uploadError && <p className={styles.fieldError}>{uploadError}</p>}
                <details className={styles.urlFallback}>
                  <summary>O pega una ruta/URL manualmente</summary>
                  <input
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="/popup-mi-banner.png"
                  />
                </details>
              </div>

              <div className={styles.field}>
                <label>Texto alternativo / descripción</label>
                <input value={form.alt} onChange={(e) => setForm({ ...form, alt: e.target.value })} required />
              </div>

              <div className={styles.field}>
                <label>Enlace al hacer clic (opcional)</label>
                <input
                  value={form.linkUrl || ""}
                  onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Ancho</label>
                  <input type="number" value={form.width} onChange={(e) => setForm({ ...form, width: e.target.value })} />
                </div>
                <div className={styles.field}>
                  <label>Alto</label>
                  <input type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} />
                </div>
              </div>

              {formError && <p className={styles.fieldError}>{formError}</p>}

              <div className={styles.modalActions}>
                <button type="submit" className={styles.primaryBtn} disabled={saving}>
                  {saving ? "Guardando…" : "Guardar"}
                </button>
                <button type="button" className={styles.ghostBtn} onClick={() => setForm(null)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <ConfirmPopup
          open={Boolean(pendingDelete)}
          title="Borrar banner"
          message={pendingDelete ? `¿Borrar el banner "${pendingDelete.alt}"?` : ""}
          confirmLabel="Borrar"
          onConfirm={confirmRemove}
          onCancel={() => setPendingDelete(null)}
        />
      </div>
    </div>
  );
}
