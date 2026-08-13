"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import SiteHeader from "@/app/components/site-header";
import LogoutButton from "@/app/components/logout-button";
import { inferCurrencyFromOriginCountry } from "@/lib/market-pricing";

const emptyForm = {
  id: "",
  name: "",
  slug: "",
  sku: "",
  supplier: "",
  originCountry: "",
  category: "Automatizacion industrial",
  priceValue: "0",
  previousPriceValue: "0",
  stock: "0",
  minimumStock: "0",
  image: "",
  galleryImages: "",
  availability: "Entrega inmediata",
  shortDescription: "",
  description: "",
  application: "",
  marketFocus: "",
  compatibility: "",
  technicalSpecs: "",
  featured: false,
};

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
    galleryImages: product.galleryImages.join(", "),
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
    galleryImages: form.galleryImages.split(",").map((item) => item.trim()).filter(Boolean),
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
        return {
          etiqueta: (label || "").trim(),
          valor: rest.join(":").trim(),
        };
      })
      .filter((item) => item.etiqueta && item.valor),
    featured: form.featured,
  };
}

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("Cargando productos...");
  const [saving, setSaving] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const productListRef = useRef(null);
  const productFormRef = useRef(null);

  async function loadProducts() {
    setStatus("Cargando productos...");
    const response = await fetch("/api/products");
    const payload = await response.json();
    setProducts(payload.products || []);
    setStatus(payload.products?.length ? "" : "No hay productos cargados todavia.");
  }

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    async function loadAccount() {
      const response = await fetch("/api/account");
      const payload = await response.json();

      if (response.ok) {
        setUser(payload.user || null);
      }
    }

    loadAccount();
  }, []);

  const productCount = useMemo(() => products.length, [products.length]);
  const featuredProducts = products.slice(0, 3);
  const initials = (user?.fullName || "Admin Drokex")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
  const recentActivity = [
    {
      type: "Base de catálogo activa",
      detail: `${productCount} productos listos para editar desde el panel administrador.`,
      badge: "Live",
      avatar: "C",
      badgeTone: "green",
    },
    {
      type: "Producto destacado",
      detail: `${featuredProducts[0]?.name || "Tu catálogo principal"} está visible en la vitrina actual.`,
      badge: "New",
      avatar: "P",
      badgeTone: "green",
    },
    {
      type: "Inventario en revisión",
      detail: `${featuredProducts[1]?.name || "Una línea clave"} está listo para actualización comercial.`,
      badge: "Draft",
      avatar: "I",
      badgeTone: "blue",
    },
  ];

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    const payload = toPayload(form);
    const endpoint = form.id ? `/api/products/${form.id}` : "/api/products";
    const method = form.id ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error || "No fue posible guardar el producto.");
      setSaving(false);
      return;
    }

    setStatus(form.id ? "Producto actualizado." : "Producto creado.");
    setForm(emptyForm);
    setSaving(false);
    await loadProducts();
  }

  function scrollToSection(ref) {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openPanel(panel) {
    setActivePanel(panel);

    window.requestAnimationFrame(() => {
      if (panel === "list") {
        scrollToSection(productListRef);
      }

      if (panel === "form") {
        scrollToSection(productFormRef);
      }
    });
  }

  return (
    <main className="provider-dashboard-page admin-page">
      <SiteHeader />
      <section className="shell provider-clean-shell">
        <div className="provider-clean-hero">
          <div className="provider-clean-avatar-wrap">
            <div className="provider-clean-avatar" aria-hidden="true">
              {initials}
            </div>
          </div>

          <div className="provider-clean-copy">
            <p className="provider-kicker">Panel de control</p>
            <h1>Dashboard del Administrador</h1>
            <p>
              Bienvenido a tu panel de control. Aquí puedes administrar el catálogo, revisar la
              base activa y mantener la operación comercial de Drokex.
            </p>
            <div className="provider-inline-meta">
              <span>{user?.company || "Drokex"}</span>
              <span>Administrador activo</span>
            </div>
          </div>

          <div className="provider-clean-tools">
            <div className="provider-clean-pill" aria-hidden="true" />
            <LogoutButton />
          </div>
        </div>

        <nav className="provider-clean-menu" aria-label="Accesos del proveedor">
          <Link href="/mi-cuenta/tienda" className="provider-clean-menu-item">
            <span>Mi tienda</span>
          </Link>
          <Link href="/mi-cuenta/productos" className="provider-clean-menu-item">
            <span>Mis productos</span>
          </Link>
          <Link href="/mi-cuenta/ventas" className="provider-clean-menu-item">
            <span>Ventas</span>
          </Link>
          <Link href="/mi-cuenta/logistica" className="provider-clean-menu-item">
            <span>Envíos / logística</span>
          </Link>
          <Link href="/mi-cuenta/ganancias" className="provider-clean-menu-item">
            <span>Ganancias / comisiones</span>
          </Link>
        </nav>

        <section className="provider-activity-card provider-activity-card-clean">
          <div className="provider-section-heading">
            <div>
              <p className="provider-section-kicker">Seguimiento</p>
              <h2>Actividad Reciente</h2>
            </div>
            <span className="provider-text-link">Vista administrador</span>
          </div>

          <div className="provider-activity-list">
            {recentActivity.map((item, index) => (
              <article key={`${item.type}-${index}`} className="provider-activity-item">
                <div
                  className={`provider-activity-avatar ${item.badgeTone === "blue" ? "is-lime" : ""}`}
                >
                  {item.avatar}
                </div>
                <div className="provider-activity-copy">
                  <strong>{item.type}</strong>
                  <p>{item.detail}</p>
                  <small>Panel administrador</small>
                </div>
                <span
                  className={item.badgeTone === "blue" ? "provider-badge is-blue" : "provider-badge"}
                >
                  {item.badge}
                </span>
              </article>
            ))}
          </div>
        </section>

        {activePanel ? (
        <div className="admin-grid">
          <aside className="admin-list">
            <div className="admin-panel-card" id="admin-product-list" ref={productListRef}>
              <div className="admin-panel-heading">
                <h2>Productos</h2>
                <button type="button" className="green-link-button" onClick={() => setForm(emptyForm)}>
                  Nuevo
                </button>
              </div>

              {status ? <p className="admin-status">{status}</p> : null}

              <div className="admin-product-stack">
                {products.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    className="admin-product-item"
                    onClick={() => setForm(toFormState(product))}
                  >
                    <strong>{product.name}</strong>
                    <span>{product.category}</span>
                    <small>
                      {product.originCountry} · {product.supplier}
                    </small>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="admin-form-wrap">
            <form
              onSubmit={handleSubmit}
              className="admin-form-card"
              id="admin-product-form"
              ref={productFormRef}
            >
              <div className="admin-panel-heading">
                <h2>{form.id ? "Editar producto" : "Crear producto"}</h2>
              </div>

              <div className="admin-form-grid">
                <label>
                  <span>Nombre</span>
                  <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                </label>
                <label>
                  <span>Slug</span>
                  <input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
                </label>
                <label>
                  <span>SKU</span>
                  <input value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} />
                </label>
                <label>
                  <span>Proveedor</span>
                  <input value={form.supplier} onChange={(event) => setForm({ ...form, supplier: event.target.value })} />
                </label>
                <label>
                  <span>Pais de origen</span>
                  <input value={form.originCountry} onChange={(event) => setForm({ ...form, originCountry: event.target.value })} />
                </label>
                <label>
                  <span>Moneda origen</span>
                  <input value={inferCurrencyFromOriginCountry(form.originCountry)} readOnly />
                </label>
                <label>
                  <span>Categoria</span>
                  <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
                </label>
                <label>
                  <span>Precio</span>
                  <input value={form.priceValue} onChange={(event) => setForm({ ...form, priceValue: event.target.value })} />
                </label>
                <label>
                  <span>Precio anterior</span>
                  <input value={form.previousPriceValue} onChange={(event) => setForm({ ...form, previousPriceValue: event.target.value })} />
                </label>
                <label>
                  <span>Stock</span>
                  <input value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} />
                </label>
                <label>
                  <span>Stock minimo</span>
                  <input value={form.minimumStock} onChange={(event) => setForm({ ...form, minimumStock: event.target.value })} />
                </label>
                <label>
                  <span>Disponibilidad</span>
                  <input value={form.availability} onChange={(event) => setForm({ ...form, availability: event.target.value })} />
                </label>
                <label>
                  <span>Mercado foco</span>
                  <input value={form.marketFocus} onChange={(event) => setForm({ ...form, marketFocus: event.target.value })} />
                </label>
              </div>

              <label>
                <span>Imagen principal</span>
                <input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} />
              </label>

              <label>
                <span>Imagenes extra</span>
                <input
                  value={form.galleryImages}
                  onChange={(event) => setForm({ ...form, galleryImages: event.target.value })}
                />
              </label>

              <label>
                <span>Descripcion corta</span>
                <textarea
                  rows={2}
                  value={form.shortDescription}
                  onChange={(event) => setForm({ ...form, shortDescription: event.target.value })}
                />
              </label>

              <label>
                <span>Descripcion completa</span>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                />
              </label>

              <label>
                <span>Aplicacion</span>
                <textarea
                  rows={3}
                  value={form.application}
                  onChange={(event) => setForm({ ...form, application: event.target.value })}
                />
              </label>

              <label>
                <span>Compatibilidad</span>
                <input
                  value={form.compatibility}
                  onChange={(event) => setForm({ ...form, compatibility: event.target.value })}
                />
              </label>

              <label>
                <span>Ficha tecnica</span>
                <textarea
                  rows={5}
                  value={form.technicalSpecs}
                  onChange={(event) => setForm({ ...form, technicalSpecs: event.target.value })}
                />
              </label>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) => setForm({ ...form, featured: event.target.checked })}
                />
                <span>Mostrar como producto destacado</span>
              </label>

              <div className="admin-actions">
                <button type="submit" className="primary-button" disabled={saving}>
                  {saving ? "Guardando..." : form.id ? "Actualizar producto" : "Crear producto"}
                </button>
              </div>
            </form>
          </section>
        </div>
        ) : null}
      </section>
    </main>
  );
}
