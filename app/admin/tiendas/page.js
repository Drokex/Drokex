"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useHeroEntrance } from "@/app/components/use-hero-entrance";
import Link from "next/link";
import { Search, Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink, ArrowUpDown, X } from "lucide-react";
import SiteHeader from "@/app/components/site-header";
import ConfirmPopup from "@/app/components/confirm-popup";
import LandingPreview from "@/app/components/landing-preview";
import styles from "./tiendas.module.css";

const FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "published", label: "Publicadas" },
  { key: "draft", label: "Borrador" },
];

const AVATAR_COLORS = ["#ffd6dd", "#d8f5c2", "#d6e4ff", "#ffe6b3", "#e3d6ff", "#c9f2e6"];

function avatarColor(seed) {
  let hash = 0;
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[hash];
}

const PAGE_SIZE = 10;

export default function AdminTiendasPage() {
  const [landings, setLandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [page, setPage] = useState(1);
  const heroRef = useRef(null);
  useHeroEntrance(heroRef);

  const [pendingDelete, setPendingDelete] = useState(null);

  const [creating, setCreating] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [createError, setCreateError] = useState("");
  const [createBusy, setCreateBusy] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/proveedor-pro?all=1");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al cargar tiendas");
      setLandings(data.landings || []);
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

  async function togglePublish(landing) {
    await fetch("/api/proveedor-pro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetUserId: landing.userId,
        slug: landing.slug,
        store: landing.store,
        products: landing.products,
        publish: !landing.published,
        unpublish: landing.published,
      }),
    });
    load();
  }

  async function confirmRemove() {
    const landing = pendingDelete;
    setPendingDelete(null);
    await fetch(`/api/proveedor-pro?targetUserId=${landing.userId}`, { method: "DELETE" });
    load();
  }

  async function createStore(e) {
    e.preventDefault();
    setCreateError("");
    if (!newEmail.trim() || !newSlug.trim()) {
      setCreateError("Completa el correo del proveedor y el slug de la tienda.");
      return;
    }
    setCreateBusy(true);
    try {
      const lookupRes = await fetch(`/api/admin/users/lookup?email=${encodeURIComponent(newEmail.trim())}`);
      const lookupData = await lookupRes.json();
      if (!lookupRes.ok) throw new Error(lookupData.error || "No se encontró ese usuario");

      const res = await fetch("/api/proveedor-pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: lookupData.user.id,
          slug: newSlug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
          store: { brand: lookupData.user.fullName || lookupData.user.email },
          products: [],
          publish: false,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear la tienda");
      setCreating(false);
      setNewEmail("");
      setNewSlug("");
      load();
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreateBusy(false);
    }
  }

  const filtered = useMemo(() => {
    let list = landings;
    if (filter === "published") list = list.filter((l) => l.published);
    if (filter === "draft") list = list.filter((l) => !l.published);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (l) =>
          l.slug.toLowerCase().includes(q) ||
          l.user?.fullName?.toLowerCase().includes(q) ||
          l.user?.email?.toLowerCase().includes(q),
      );
    }
    return [...list].sort((a, b) =>
      sortNewestFirst ? new Date(b.updatedAt) - new Date(a.updatedAt) : new Date(a.updatedAt) - new Date(b.updatedAt),
    );
  }, [landings, filter, search, sortNewestFirst]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  return (
    <div className={styles.page}>
      <SiteHeader />
      <div className={styles.shell} ref={heroRef} data-hero-item>
        <div className={styles.topBar}>
          <div>
            <Link href="/admin" className={styles.backLink}>← Panel admin</Link>
            <h1 className={styles.title}>Tiendas de proveedores</h1>
            <p className={styles.subtitle}>Gestiona y publica las tiendas de los proveedores.</p>
          </div>
          <button
            type="button"
            className={styles.newButton}
            onClick={() => {
              setCreateError("");
              setCreating(true);
            }}
          >
            <Plus size={16} strokeWidth={2.5} /> Nueva tienda
          </button>
        </div>

        {error && <p style={{ color: "#b00020" }}>{error}</p>}

        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={15} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar tiendas, proveedores o correo..."
            />
          </div>
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
            <ArrowUpDown size={14} /> {sortNewestFirst ? "Más recientes" : "Más antiguas"}
          </button>
        </div>

        <p className={styles.countRow}>{filtered.length} tiendas</p>

        {loading ? (
          <p className={styles.emptyState}>Cargando…</p>
        ) : pageItems.length === 0 ? (
          <p className={styles.emptyState}>No hay tiendas que coincidan con la búsqueda/filtro.</p>
        ) : (
          <div className={styles.list}>
            {pageItems.map((landing) => {
              const name = landing.user?.fullName || landing.slug;
              const initial = name.charAt(0).toUpperCase();
              return (
                <div key={landing.id} className={styles.card}>
                  <div className={styles.cardMedia}>
                    <div className={styles.cardMediaInner}>
                      <LandingPreview store={landing.store} products={landing.products} standalone />
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <span className={styles.avatar} style={{ background: avatarColor(landing.slug) }}>
                      {initial}
                    </span>
                    <div className={styles.identity}>
                      <strong>{landing.slug}</strong>
                      <span>{landing.user?.fullName} — {landing.user?.email}</span>
                    </div>
                    <span className={`${styles.statusBadge} ${landing.published ? styles.statusPublished : styles.statusDraft}`}>
                      {landing.published ? "● Publicada" : "● Borrador"}
                    </span>
                  </div>

                  <div className={styles.actionsRow}>
                    <button
                      className={`${styles.actionBtn} ${landing.published ? "" : styles.actionBtnPublish}`}
                      onClick={() => togglePublish(landing)}
                    >
                      {landing.published ? <EyeOff size={14} /> : <Eye size={14} />}
                      {landing.published ? "Despublicar" : "Publicar"}
                    </button>
                    <Link href={`/admin/tiendas/${landing.slug}`} className={styles.actionBtn}>
                      <Pencil size={14} /> Editar
                    </Link>
                    <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => setPendingDelete(landing)}>
                      <Trash2 size={14} /> Borrar
                    </button>
                    <span className={styles.spacer} />
                    <Link href="/directorio" target="_blank" className={styles.actionBtn}>
                      <ExternalLink size={14} /> Ver en directorio
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className={styles.pagination}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={`${styles.pageBtn} ${n === page ? styles.pageBtnActive : ""}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
          </div>
        )}

        {creating && (
          <div className={styles.modalOverlay} onClick={() => setCreating(false)}>
            <form onSubmit={createStore} className={styles.modal} style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHead}>
                <h2>Nueva tienda</h2>
                <button type="button" className={styles.ghostBtn} onClick={() => setCreating(false)} style={{ padding: 6 }}>
                  <X size={18} />
                </button>
              </div>
              <div className={styles.field}>
                <label>Correo del proveedor (debe tener cuenta ya creada)</label>
                <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="proveedor@correo.com" />
              </div>
              <div className={styles.field}>
                <label>Slug de la tienda</label>
                <input value={newSlug} onChange={(e) => setNewSlug(e.target.value)} placeholder="mi-tienda" />
              </div>
              {createError && <p className={styles.fieldError}>{createError}</p>}
              <div className={styles.modalActions}>
                <button type="submit" className={styles.primaryBtn} disabled={createBusy}>
                  {createBusy ? "Creando…" : "Crear tienda"}
                </button>
                <button type="button" className={styles.ghostBtn} onClick={() => setCreating(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <ConfirmPopup
          open={Boolean(pendingDelete)}
          title="Borrar tienda"
          message={pendingDelete ? `¿Borrar la tienda "${pendingDelete.slug}"? Esta acción no se puede deshacer.` : ""}
          confirmLabel="Borrar"
          onConfirm={confirmRemove}
          onCancel={() => setPendingDelete(null)}
        />
      </div>
    </div>
  );
}
