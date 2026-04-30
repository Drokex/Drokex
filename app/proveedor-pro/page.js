"use client";

import { useState } from "react";
import SiteHeader from "@/app/components/site-header";

const VALID_CODE = "15472007";

export default function ProveedorProPage() {
  const [code, setCode] = useState("");
  const [isPro, setIsPro] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
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
      ) : (
        <section className="grid min-h-[calc(100vh-80px)] grid-cols-1 lg:grid-cols-[360px_1fr]">
          <aside className="border-r border-white/10 bg-[#080c08] p-5">
            <div className="rounded-3xl bg-[#59ff35] p-5 text-black">
              <h2 className="text-xl font-black">Proveedor Pro activo</h2>
              <p className="text-sm">Constructor de landing Drokex</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2">
              {[
                ["home", "Home"],
                ["brand", "Marca"],
                ["media", "Imagenes"],
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
                  <Input
                    label="Logo URL"
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
                  <Input
                    label="Banner principal URL"
                    value={store.heroImage}
                    onChange={(value) => updateStore("heroImage", value)}
                  />
                  <Input
                    label="Banner secundario URL"
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
                      <Input
                        label="Imagen URL"
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

          <section className="overflow-y-auto bg-[#050705] p-6">
            <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c120c]">
              <header className="flex items-center justify-between border-b border-white/10 px-8 py-5">
                <div className="flex items-center gap-3">
                  {store.logo ? (
                    <img
                      src={store.logo}
                      alt={`${store.brand} logo`}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#59ff35] font-black text-black">
                      {store.brand.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-black">{store.brand}</h3>
                    <p className="text-xs text-white/40">{store.country}</p>
                  </div>
                </div>

                <nav className="hidden gap-6 text-sm text-white/50 md:flex">
                  <a>Inicio</a>
                  <a>Productos</a>
                  <a>Marca</a>
                  <a>Contacto</a>
                </nav>

                <button className="rounded-xl bg-[#59ff35] px-5 py-3 font-black text-black">
                  Comprar
                </button>
              </header>

              <section
                className="relative min-h-[520px] bg-cover bg-center px-8 py-16"
                style={{
                  backgroundImage: store.heroImage
                    ? `linear-gradient(90deg, rgba(0,0,0,.9), rgba(0,0,0,.25)), url(${store.heroImage})`
                    : "radial-gradient(circle at 75% 25%, rgba(89,255,53,.35), transparent 35%)",
                }}
              >
                <span className="rounded-full bg-[#59ff35]/15 px-4 py-2 text-sm font-black text-[#59ff35]">
                  {store.promoText}
                </span>

                <h1 className="mt-8 max-w-3xl text-6xl font-black leading-none">
                  {store.heroTitle}
                </h1>

                <p className="mt-6 max-w-xl text-lg text-white/65">
                  {store.heroSubtitle}
                </p>

                <button className="mt-8 rounded-2xl bg-[#59ff35] px-8 py-4 font-black text-black">
                  {store.ctaText}
                </button>
              </section>

              <section className="grid gap-4 p-8 md:grid-cols-3">
                {[store.benefit1, store.benefit2, store.benefit3].map(
                  (benefit) => (
                    <div
                      key={benefit}
                      className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
                    >
                      <div className="mb-4 h-10 w-10 rounded-full bg-[#59ff35]" />
                      <h4 className="font-black">{benefit}</h4>
                    </div>
                  )
                )}
              </section>

              <section className="grid gap-8 p-8 md:grid-cols-2">
                <div>
                  <h2 className="text-4xl font-black">{store.aboutTitle}</h2>
                  <p className="mt-4 text-white/60">{store.aboutText}</p>
                </div>

                <div className="min-h-[280px] overflow-hidden rounded-[2rem] bg-black">
                  {store.bannerSecondary ? (
                    <img
                      src={store.bannerSecondary}
                      alt="Banner secundario"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/30">
                      Banner secundario
                    </div>
                  )}
                </div>
              </section>

              <section className="p-8">
                <h2 className="text-4xl font-black">Productos destacados</h2>

                <div className="mt-8 grid gap-6 md:grid-cols-3">
                  {products.map((product, index) => (
                    <article
                      key={index}
                      className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="h-56 overflow-hidden rounded-[1.5rem] bg-black">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name || "Producto"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-white/30">
                            Imagen producto
                          </div>
                        )}
                      </div>

                      <p className="mt-4 text-xs font-black text-[#59ff35]">
                        {product.category || "Categoria"}
                      </p>

                      <h3 className="mt-1 text-xl font-black">
                        {product.name || "Nombre producto"}
                      </h3>

                      <p className="mt-2 text-sm text-white/50">
                        {product.description || "Descripcion del producto"}
                      </p>

                      <p className="mt-4 text-xl font-black text-[#59ff35]">
                        {product.price
                          ? `$${Number(product.price).toLocaleString("es-CO")} COP`
                          : "$0 COP"}
                      </p>

                      <p className="text-sm text-white/40">
                        Stock: {product.stock || "0"}
                      </p>

                      <button className="mt-5 w-full rounded-xl bg-white px-5 py-3 font-black text-black hover:bg-[#59ff35]">
                        Agregar al carrito
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </section>
      )}
    </main>
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
