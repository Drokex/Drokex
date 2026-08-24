"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import LogoutButton from "@/app/components/logout-button";
import ConfirmPopup from "@/app/components/confirm-popup";
import adminStyles from "../page.module.css";

export default function AdminTiendasPage() {
  const [landings, setLandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [editError, setEditError] = useState("");
  const [storeJson, setStoreJson] = useState("");
  const [productsJson, setProductsJson] = useState("");
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

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

  function startEdit(landing) {
    setEditing(landing);
    setStoreJson(JSON.stringify(landing.store, null, 2));
    setProductsJson(JSON.stringify(landing.products, null, 2));
  }

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

  async function saveEdit() {
    setSaving(true);
    setEditError("");
    try {
      const store = JSON.parse(storeJson);
      const products = JSON.parse(productsJson);
      const res = await fetch("/api/proveedor-pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: editing.userId,
          slug: editing.slug,
          store,
          products,
          publish: editing.published,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");
      setEditing(null);
      load();
    } catch (err) {
      setEditError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={adminStyles.adminPage}>
      <SiteHeader />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 20px 88px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <Link href="/admin" style={{ fontSize: "0.85rem" }}>← Panel admin</Link>
            <h1 style={{ margin: "8px 0 0" }}>Tiendas de proveedores</h1>
          </div>
          <LogoutButton />
        </div>

        {error && <p style={{ color: "#b00020" }}>{error}</p>}
        {loading ? (
          <p>Cargando…</p>
        ) : (
          <div className={adminStyles.adminList}>
            {landings.map((landing) => (
              <div key={landing.id} className={adminStyles.adminPanelCard}>
                <div className={adminStyles.adminPanelHeading}>
                  <h2>{landing.slug}</h2>
                  <span>{landing.published ? "Publicada" : "Borrador"}</span>
                </div>
                <p style={{ margin: "6px 0", fontSize: "0.9rem" }}>
                  {landing.user?.fullName} — {landing.user?.email}
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button onClick={() => togglePublish(landing)}>
                    {landing.published ? "Despublicar" : "Publicar"}
                  </button>
                  <button onClick={() => startEdit(landing)}>Editar JSON</button>
                  <button onClick={() => setPendingDelete(landing)} style={{ color: "#b00020" }}>
                    Borrar
                  </button>
                  <Link href="/directorio" target="_blank">
                    Ver en directorio ↗
                  </Link>
                </div>
              </div>
            ))}
            {landings.length === 0 && <p>No hay tiendas registradas todavía.</p>}
          </div>
        )}

        {editing && (
          <div className={adminStyles.adminPanelCard} style={{ marginTop: 24 }}>
            <h2>Editando: {editing.slug}</h2>
            <label>store (JSON)</label>
            <textarea
              value={storeJson}
              onChange={(e) => setStoreJson(e.target.value)}
              rows={14}
              style={{ width: "100%", fontFamily: "monospace", fontSize: "0.8rem" }}
            />
            <label>products (JSON)</label>
            <textarea
              value={productsJson}
              onChange={(e) => setProductsJson(e.target.value)}
              rows={10}
              style={{ width: "100%", fontFamily: "monospace", fontSize: "0.8rem" }}
            />
            {editError && <p style={{ color: "#b00020", fontSize: "0.85rem" }}>{editError}</p>}
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button onClick={saveEdit} disabled={saving}>
                {saving ? "Guardando…" : "Guardar"}
              </button>
              <button onClick={() => setEditing(null)}>Cancelar</button>
            </div>
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
