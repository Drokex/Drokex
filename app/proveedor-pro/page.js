"use client";

import { useRef, useState } from "react";
import SiteHeader from "@/app/components/site-header";

const VALID_CODE = "15472007";

function hexToRgba(hex, alpha) {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3
    ? normalized.split("").map((char) => `${char}${char}`).join("")
    : normalized;

  const number = Number.parseInt(value, 16);
  const red = (number >> 16) & 255;
  const green = (number >> 8) & 255;
  const blue = number & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export default function ProveedorProPage() {
  const [code, setCode] = useState("");
  const [isPro, setIsPro] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [error, setError] = useState("");

  const [store, setStore] = useState({
    brand: "Muebles del Sur",
    country: "Colombia",
    logo: "",
    heroTitle: "Diseño premium para hogares modernos",
    heroSubtitle:
      "Muebles elegantes, cómodos y listos para transformar cualquier espacio.",
    heroImage: "",
    ctaText: "Comprar colección",
    promoText: "Nueva colección 2026",
    aboutTitle: "Una marca pensada para espacios con estilo",
    aboutText:
      "Creamos productos funcionales, modernos y de alta calidad para hogares que buscan diseño y comodidad.",
    bannerSecondary: "",
    benefit1: "Stock disponible en Colombia",
    benefit2: "Envíos rápidos y seguros",
    benefit3: "Garantía directa del proveedor",
    primaryColor: "#c89b5c",
    backgroundColor: "#11100d",
    surfaceColor: "#1c1712",
    textColor: "#fff8ee",
    mutedTextColor: "#c7b9a7",
    buttonTextColor: "#15100a",
  });

  const [products, setProducts] = useState([
    {
      name: "Sofá Modular Premium",
      price: "1890000",
      stock: "12",
      image: "",
      description: "Sofá moderno con acabados premium.",
      category: "Sala",
    },
  ]);

  function activatePro() {
    if (code === VALID_CODE) {
      setIsPro(true);
      setError("");
    } else {
      setError("Código inválido. Usa el código de prueba correcto.");
    }
  }

  function updateStore(field, value) {
    setStore({ ...store, [field]: value });
  }

  function addProduct() {
    setProducts([
      ...products,
      {
        name: "",
        price: "",
        stock: "",
        image: "",
        description: "",
        category: "",
      },
    ]);
  }

  function updateProduct(index, field, value) {
    const copy = [...products];
    copy[index] = { ...copy[index], [field]: value };
    setProducts(copy);
  }

  return (
    <main className="min-h-screen bg-[#030503] text-white">
      <SiteHeader />

      {!isPro ? (
        <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2">
          <div>
            <span className="rounded-full bg-[#59ff35]/10 px-4 py-2 text-xs font-black text-[#59ff35]">
              PROVEEDOR PRO
            </span>

            <h1 className="mt-6 text-5xl font-black leading-tight">
              Crea tu tienda premium dentro de{" "}
              <span className="text-[#59ff35]">Drokex</span>
            </h1>

            <p className="mt-5 text-lg text-white/60">
              Activa el modo Pro para construir una landing personalizada, subir
              banners, productos, textos comerciales y vender directo.
            </p>

            <div className="mt-8 rounded-[2rem] border border-[#59ff35]/30 bg-[#59ff35]/10 p-6">
              <p className="text-white/50">Plan demo</p>
              <h2 className="mt-2 text-4xl font-black text-[#59ff35]">
                $99.000 COP
              </h2>
              <p className="mt-2 text-sm text-white/50">
                Simulación para validar experiencia.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-2xl font-black">Adquiere Proveedor Pro</h2>

            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Código de activación"
              className="mt-6 w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-[#59ff35]"
            />

            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

            <button
              onClick={activatePro}
              className="mt-6 w-full rounded-2xl bg-[#59ff35] px-6 py-4 font-black text-black"
            >
              Activar plan Pro
            </button>

            <p className="mt-4 text-center text-xs text-white/40">
              Código demo: 15472007
            </p>
          </div>
        </section>
      ) : isPreviewMode ? (
        <section className="bg-[#050705] px-4 py-6 sm:px-6 lg:px-10">
          <div className="mx-auto mb-5 flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#59ff35]">
                Previsualizacion
              </p>
              <h2 className="mt-1 text-2xl font-black">
                Landing completa de {store.brand}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setIsPreviewMode(false)}
              className="rounded-2xl border border-white/15 px-5 py-3 font-black text-white transition hover:border-[#59ff35] hover:text-[#59ff35]"
            >
              Volver a editar
            </button>
          </div>

          <LandingPreview store={store} products={products} fullWidth />
        </section>
      ) : (
        <section className="grid min-h-[calc(100vh-80px)] grid-cols-1 lg:grid-cols-[360px_1fr]">
          <aside className="border-r border-white/10 bg-[#080c08] p-5">
            <div className="rounded-3xl bg-[#59ff35] p-5 text-black">
              <h2 className="text-xl font-black">Proveedor Pro activo</h2>
              <p className="text-sm">Constructor de landing Drokex</p>
            </div>

            <button
              type="button"
              onClick={() => setIsPreviewMode(true)}
              className="mt-4 w-full rounded-2xl bg-white px-5 py-4 font-black text-black transition hover:bg-[#59ff35]"
            >
              Previsualizar landing completa
            </button>

            <div className="mt-6 grid grid-cols-2 gap-2">
              {[
                ["home", "Home"],
                ["brand", "Marca"],
                ["media", "Imagenes"],
                ["style", "Estilo"],
                ["products", "Productos"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`rounded-xl px-4 py-3 text-sm font-bold ${
                    activeTab === id
                      ? "bg-[#59ff35] text-black"
                      : "bg-white/5 text-white/60"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              {activeTab === "home" && (
                <>
                  <Input
                    label="Titulo principal"
                    value={store.heroTitle}
                    onChange={(value) => updateStore("heroTitle", value)}
                  />
                  <Textarea
                    label="Texto del hero"
                    value={store.heroSubtitle}
                    onChange={(value) => updateStore("heroSubtitle", value)}
                  />
                  <Input
                    label="Texto del boton"
                    value={store.ctaText}
                    onChange={(value) => updateStore("ctaText", value)}
                  />
                  <Input
                    label="Texto promocional"
                    value={store.promoText}
                    onChange={(value) => updateStore("promoText", value)}
                  />
                </>
              )}

              {activeTab === "brand" && (
                <>
                  <Input
                    label="Nombre de marca"
                    value={store.brand}
                    onChange={(value) => updateStore("brand", value)}
                  />
                  <Input
                    label="Pais"
                    value={store.country}
                    onChange={(value) => updateStore("country", value)}
                  />
                  <ImageUploader
                    label="Logo de marca"
                    value={store.logo}
                    onChange={(value) => updateStore("logo", value)}
                  />
                  <Input
                    label="Titulo seccion marca"
                    value={store.aboutTitle}
                    onChange={(value) => updateStore("aboutTitle", value)}
                  />
                  <Textarea
                    label="Historia / descripcion de marca"
                    value={store.aboutText}
                    onChange={(value) => updateStore("aboutText", value)}
                  />
                </>
              )}

              {activeTab === "media" && (
                <>
                  <ImageUploader
                    label="Banner principal"
                    value={store.heroImage}
                    onChange={(value) => updateStore("heroImage", value)}
                  />
                  <ImageUploader
                    label="Banner secundario"
                    value={store.bannerSecondary}
                    onChange={(value) =>
                      updateStore("bannerSecondary", value)
                    }
                  />
                  <Input
                    label="Beneficio 1"
                    value={store.benefit1}
                    onChange={(value) => updateStore("benefit1", value)}
                  />
                  <Input
                    label="Beneficio 2"
                    value={store.benefit2}
                    onChange={(value) => updateStore("benefit2", value)}
                  />
                  <Input
                    label="Beneficio 3"
                    value={store.benefit3}
                    onChange={(value) => updateStore("benefit3", value)}
                  />
                </>
              )}

              {activeTab === "style" && (
                <>
                  <ColorInput
                    label="Color principal"
                    value={store.primaryColor}
                    onChange={(value) => updateStore("primaryColor", value)}
                  />
                  <ColorInput
                    label="Fondo de landing"
                    value={store.backgroundColor}
                    onChange={(value) => updateStore("backgroundColor", value)}
                  />
                  <ColorInput
                    label="Color de secciones"
                    value={store.surfaceColor}
                    onChange={(value) => updateStore("surfaceColor", value)}
                  />
                  <ColorInput
                    label="Texto principal"
                    value={store.textColor}
                    onChange={(value) => updateStore("textColor", value)}
                  />
                  <ColorInput
                    label="Texto secundario"
                    value={store.mutedTextColor}
                    onChange={(value) => updateStore("mutedTextColor", value)}
                  />
                  <ColorInput
                    label="Texto de botones"
                    value={store.buttonTextColor}
                    onChange={(value) => updateStore("buttonTextColor", value)}
                  />
                </>
              )}

              {activeTab === "products" && (
                <>
                  {products.map((product, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/10 bg-black/40 p-4"
                    >
                      <p className="mb-3 font-black text-[#59ff35]">
                        Producto {index + 1}
                      </p>

                      <Input
                        label="Nombre"
                        value={product.name}
                        onChange={(value) =>
                          updateProduct(index, "name", value)
                        }
                      />
                      <Input
                        label="Categoria"
                        value={product.category}
                        onChange={(value) =>
                          updateProduct(index, "category", value)
                        }
                      />
                      <Input
                        label="Precio"
                        value={product.price}
                        onChange={(value) =>
                          updateProduct(index, "price", value)
                        }
                      />
                      <Input
                        label="Stock"
                        value={product.stock}
                        onChange={(value) =>
                          updateProduct(index, "stock", value)
                        }
                      />
                      <ImageUploader
                        label="Imagen del producto"
                        value={product.image}
                        onChange={(value) =>
                          updateProduct(index, "image", value)
                        }
                      />
                      <Textarea
                        label="Descripcion"
                        value={product.description}
                        onChange={(value) =>
                          updateProduct(index, "description", value)
                        }
                      />
                    </div>
                  ))}

                  <button
                    onClick={addProduct}
                    className="w-full rounded-2xl border border-[#59ff35] py-4 font-black text-[#59ff35]"
                  >
                    + Agregar producto
                  </button>
                </>
              )}
            </div>
          </aside>

          <section className="overflow-y-auto p-6" style={{ backgroundColor: store.backgroundColor }}>
            <LandingPreview store={store} products={products} />
          </section>
        </section>
      )}
    </main>
  );
}

function LandingPreview({ store, products, fullWidth = false }) {
  const primaryGlow = hexToRgba(store.primaryColor, 0.35);
  const primarySoft = hexToRgba(store.primaryColor, 0.16);

  return (
    <div
      className={`mx-auto overflow-hidden border border-white/10 ${
        fullWidth ? "max-w-7xl rounded-[2rem]" : "max-w-6xl rounded-[2rem]"
      }`}
      style={{
        backgroundColor: store.surfaceColor,
        color: store.textColor,
      }}
    >
      <header className="flex items-center justify-between border-b border-white/10 px-8 py-5">
        <div className="flex items-center gap-3">
          {store.logo ? (
            <img
              src={store.logo}
              alt={`${store.brand} logo`}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full font-black"
              style={{
                backgroundColor: store.primaryColor,
                color: store.buttonTextColor,
              }}
            >
              {store.brand.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="font-black">{store.brand}</h3>
            <p className="text-xs" style={{ color: store.mutedTextColor }}>
              {store.country}
            </p>
          </div>
        </div>

        <nav className="hidden gap-6 text-sm md:flex" style={{ color: store.mutedTextColor }}>
          <a>Inicio</a>
          <a>Productos</a>
          <a>Marca</a>
          <a>Contacto</a>
        </nav>

        <button
          className="rounded-xl px-5 py-3 font-black"
          style={{
            backgroundColor: store.primaryColor,
            color: store.buttonTextColor,
          }}
        >
          Comprar
        </button>
      </header>

      <section
        className="relative min-h-[520px] bg-cover bg-center px-8 py-16"
        style={{
          backgroundColor: store.backgroundColor,
          backgroundImage: store.heroImage
            ? `linear-gradient(90deg, rgba(0,0,0,.82), rgba(0,0,0,.22)), url(${store.heroImage})`
            : `radial-gradient(circle at 75% 25%, ${primaryGlow}, transparent 35%)`,
        }}
      >
        <span
          className="rounded-full px-4 py-2 text-sm font-black"
          style={{
            backgroundColor: primarySoft,
            color: store.primaryColor,
          }}
        >
          {store.promoText}
        </span>

        <h1 className="mt-8 max-w-3xl text-6xl font-black leading-none">
          {store.heroTitle}
        </h1>

        <p className="mt-6 max-w-xl text-lg" style={{ color: store.mutedTextColor }}>
          {store.heroSubtitle}
        </p>

        <button
          className="mt-8 rounded-2xl px-8 py-4 font-black"
          style={{
            backgroundColor: store.primaryColor,
            color: store.buttonTextColor,
          }}
        >
          {store.ctaText}
        </button>
      </section>

      <section className="grid gap-4 p-8 md:grid-cols-3" style={{ backgroundColor: store.backgroundColor }}>
        {[store.benefit1, store.benefit2, store.benefit3].map((benefit) => (
          <div
            key={benefit}
            className="rounded-3xl border border-white/10 p-6"
            style={{ backgroundColor: store.surfaceColor }}
          >
            <div
              className="mb-4 h-10 w-10 rounded-full"
              style={{ backgroundColor: store.primaryColor }}
            />
            <h4 className="font-black">{benefit}</h4>
          </div>
        ))}
      </section>

      <section className="grid gap-8 p-8 md:grid-cols-2">
        <div>
          <h2 className="text-4xl font-black">{store.aboutTitle}</h2>
          <p className="mt-4" style={{ color: store.mutedTextColor }}>
            {store.aboutText}
          </p>
        </div>

        <div className="min-h-[280px] overflow-hidden rounded-[2rem]" style={{ backgroundColor: store.backgroundColor }}>
          {store.bannerSecondary ? (
            <img
              src={store.bannerSecondary}
              alt="Banner secundario"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center" style={{ color: store.mutedTextColor }}>
              Banner secundario
            </div>
          )}
        </div>
      </section>

      <section className="p-8" style={{ backgroundColor: store.backgroundColor }}>
        <h2 className="text-4xl font-black">Productos destacados</h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {products.map((product, index) => (
            <article
              key={index}
              className="overflow-hidden rounded-[2rem] border border-white/10 p-4"
              style={{ backgroundColor: store.surfaceColor }}
            >
              <div className="h-56 overflow-hidden rounded-[1.5rem]" style={{ backgroundColor: store.backgroundColor }}>
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name || "Producto"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center" style={{ color: store.mutedTextColor }}>
                    Imagen producto
                  </div>
                )}
              </div>

              <p className="mt-4 text-xs font-black" style={{ color: store.primaryColor }}>
                {product.category || "Categoria"}
              </p>

              <h3 className="mt-1 text-xl font-black">
                {product.name || "Nombre producto"}
              </h3>

              <p className="mt-2 text-sm" style={{ color: store.mutedTextColor }}>
                {product.description || "Descripcion del producto"}
              </p>

              <p className="mt-4 text-xl font-black" style={{ color: store.primaryColor }}>
                {product.price
                  ? `$${Number(product.price).toLocaleString("es-CO")} COP`
                  : "$0 COP"}
              </p>

              <p className="text-sm" style={{ color: store.mutedTextColor }}>
                Stock: {product.stock || "0"}
              </p>

              <button
                className="mt-5 w-full rounded-xl px-5 py-3 font-black"
                style={{
                  backgroundColor: store.primaryColor,
                  color: store.buttonTextColor,
                }}
              >
                Agregar al carrito
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ColorInput({ label, value, onChange }) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-black/30 p-3">
      <span className="mb-3 block text-xs font-bold text-white/40">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-14 cursor-pointer rounded-lg border border-white/10 bg-transparent p-1"
        />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none focus:border-[#59ff35]"
        />
      </div>
    </label>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-white/40">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none focus:border-[#59ff35]"
      />
    </label>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-white/40">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-24 w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none focus:border-[#59ff35]"
      />
    </label>
  );
}

function ImageUploader({ label, value, onChange }) {
  const fileRef = useRef(null);

  function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      onChange(readerEvent.target.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-white/40">{label}</span>
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/60 hover:bg-white/15"
          >
            Quitar
          </button>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="flex min-h-36 w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/15 bg-[#050705] text-sm font-bold text-white/40 transition hover:border-[#59ff35]/70 hover:text-[#59ff35]"
      >
        {value ? (
          <img src={value} alt={label} className="h-full min-h-36 w-full object-cover" />
        ) : (
          <span>Subir imagen</span>
        )}
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      <input
        value={value?.startsWith("data:") ? "" : value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="O pegar URL de imagen"
        className="mt-3 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none focus:border-[#59ff35]"
      />
    </div>
  );
}
