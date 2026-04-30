"use client";

import { useState } from "react";

const VALID_CODE = "15472007";

export default function ProveedorProPage() {
  const [code, setCode] = useState("");
  const [isPro, setIsPro] = useState(false);
  const [error, setError] = useState("");

  const [store, setStore] = useState({
    brand: "Muebles del Sur",
    country: "Colombia",
    title: "Muebles premium para hogares modernos",
    description:
      "Diseños cómodos, elegantes y listos para vender dentro de Drokex.",
    banner: "",
  });

  const [products, setProducts] = useState([
    {
      name: "Sofá Modular Premium",
      price: "1890000",
      stock: "12",
      image: "",
    },
  ]);

  function activatePro() {
    if (code === VALID_CODE) {
      setIsPro(true);
      setError("");
    } else {
      setError("Código inválido. Prueba con el código correcto.");
    }
  }

  function addProduct() {
    setProducts([...products, { name: "", price: "", stock: "", image: "" }]);
  }

  function updateProduct(index, field, value) {
    const copy = [...products];
    copy[index] = { ...copy[index], [field]: value };
    setProducts(copy);
  }

  return (
    <main className="min-h-screen bg-[#050705] px-6 py-10 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="mb-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
          <span className="rounded-full bg-[#59ff35]/10 px-4 py-2 text-xs font-bold text-[#59ff35]">
            Modo Proveedor Pro
          </span>

          <h1 className="mt-6 max-w-3xl text-5xl font-black leading-tight">
            Activa tu tienda Pro y vende directo en{" "}
            <span className="text-[#59ff35]">Drokex</span>
          </h1>

          <p className="mt-4 max-w-2xl text-white/60">
            Simula la compra del plan Pro, desbloquea tu panel y empieza a
            construir tu landing, subir productos y organizar precios.
          </p>
        </div>

        {!isPro ? (
          <section className="grid gap-8 md:grid-cols-2">
            <div className="rounded-[2rem] border border-[#59ff35]/30 bg-[#59ff35]/10 p-8">
              <h2 className="text-3xl font-black">Adquiere Proveedor Pro</h2>

              <p className="mt-4 text-white/70">
                Este plan te permite tener landing propia, productos con compra
                directa, stock local y herramientas de publicidad.
              </p>

              <div className="mt-8 rounded-2xl bg-black/40 p-6">
                <p className="text-sm text-white/50">Plan mensual</p>
                <h3 className="mt-2 text-4xl font-black text-[#59ff35]">
                  $99.000 COP
                </h3>
                <p className="mt-2 text-sm text-white/50">
                  Simulación para validar flujo de compra.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
              <h3 className="text-2xl font-black">Código de activación</h3>

              <p className="mt-3 text-white/60">
                Ingresa el código de prueba para activar el panel Pro.
              </p>

              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ej: 15472007"
                className="mt-6 w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-[#59ff35]"
              />

              {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

              <button
                onClick={activatePro}
                className="mt-6 w-full rounded-2xl bg-[#59ff35] px-6 py-4 font-black text-black transition hover:scale-[1.02]"
              >
                Activar Proveedor Pro
              </button>

              <p className="mt-4 text-center text-xs text-white/40">
                Código demo: 15472007
              </p>
            </div>
          </section>
        ) : (
          <section className="grid gap-8 lg:grid-cols-[420px_1fr]">
            {/* PANEL */}
            <aside className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-6 rounded-2xl bg-[#59ff35] px-5 py-4 text-black">
                <h2 className="font-black">Proveedor Pro activo</h2>
                <p className="text-sm">Ya puedes editar tu tienda.</p>
              </div>

              <h3 className="text-xl font-black">1. Información de marca</h3>

              <div className="mt-5 space-y-4">
                <input
                  value={store.brand}
                  onChange={(e) =>
                    setStore({ ...store, brand: e.target.value })
                  }
                  placeholder="Nombre de la marca"
                  className="input"
                />

                <input
                  value={store.country}
                  onChange={(e) =>
                    setStore({ ...store, country: e.target.value })
                  }
                  placeholder="País"
                  className="input"
                />

                <input
                  value={store.title}
                  onChange={(e) =>
                    setStore({ ...store, title: e.target.value })
                  }
                  placeholder="Título principal"
                  className="input"
                />

                <textarea
                  value={store.description}
                  onChange={(e) =>
                    setStore({ ...store, description: e.target.value })
                  }
                  placeholder="Descripción"
                  className="input min-h-28 resize-none"
                />

                <input
                  value={store.banner}
                  onChange={(e) =>
                    setStore({ ...store, banner: e.target.value })
                  }
                  placeholder="URL del banner"
                  className="input"
                />
              </div>

              <h3 className="mt-8 text-xl font-black">
                2. Productos y precios
              </h3>

              <div className="mt-5 space-y-5">
                {products.map((product, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/10 bg-black/40 p-4"
                  >
                    <p className="mb-3 text-sm font-bold text-[#59ff35]">
                      Producto {index + 1}
                    </p>

                    <input
                      value={product.name}
                      onChange={(e) =>
                        updateProduct(index, "name", e.target.value)
                      }
                      placeholder="Nombre del producto"
                      className="input mb-3"
                    />

                    <input
                      value={product.price}
                      onChange={(e) =>
                        updateProduct(index, "price", e.target.value)
                      }
                      placeholder="Precio"
                      className="input mb-3"
                    />

                    <input
                      value={product.stock}
                      onChange={(e) =>
                        updateProduct(index, "stock", e.target.value)
                      }
                      placeholder="Stock"
                      className="input mb-3"
                    />

                    <input
                      value={product.image}
                      onChange={(e) =>
                        updateProduct(index, "image", e.target.value)
                      }
                      placeholder="URL de imagen"
                      className="input"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={addProduct}
                className="mt-5 w-full rounded-2xl border border-[#59ff35]/50 px-5 py-4 font-bold text-[#59ff35] transition hover:bg-[#59ff35] hover:text-black"
              >
                + Agregar producto
              </button>
            </aside>

            {/* PREVIEW */}
            <section className="rounded-[2rem] border border-white/10 bg-[#0b100b] p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#59ff35]">
                    Vista previa de landing
                  </p>
                  <h2 className="text-2xl font-black">{store.brand}</h2>
                </div>

                <span className="rounded-full bg-[#59ff35]/10 px-4 py-2 text-sm text-[#59ff35]">
                  {store.country}
                </span>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black">
                <div
                  className="flex min-h-[320px] items-end bg-cover bg-center p-8"
                  style={{
                    backgroundImage: store.banner
                      ? `linear-gradient(to top, rgba(0,0,0,.85), transparent), url(${store.banner})`
                      : "radial-gradient(circle at 70% 20%, rgba(89,255,53,.25), transparent 40%)",
                  }}
                >
                  <div>
                    <h1 className="max-w-2xl text-5xl font-black">
                      {store.title}
                    </h1>
                    <p className="mt-4 max-w-xl text-white/70">
                      {store.description}
                    </p>

                    <button className="mt-6 rounded-2xl bg-[#59ff35] px-6 py-4 font-black text-black">
                      Comprar ahora
                    </button>
                  </div>
                </div>
              </div>

              <h3 className="mt-8 text-2xl font-black">
                Productos destacados
              </h3>

              <div className="mt-6 grid gap-5 md:grid-cols-3">
                {products.map((product, index) => (
                  <article
                    key={index}
                    className="rounded-3xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex h-44 items-center justify-center overflow-hidden rounded-2xl bg-black/60">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm text-white/30">
                          Sube tu imagen aquí
                        </span>
                      )}
                    </div>

                    <h4 className="mt-4 font-black">
                      {product.name || "Nombre del producto"}
                    </h4>

                    <p className="mt-1 text-[#59ff35]">
                      {product.price
                        ? `$${Number(product.price).toLocaleString("es-CO")} COP`
                        : "$0 COP"}
                    </p>

                    <p className="mt-1 text-sm text-white/40">
                      Stock: {product.stock || "0"}
                    </p>

                    <button className="mt-4 w-full rounded-xl bg-white px-4 py-3 font-bold text-black hover:bg-[#59ff35]">
                      Agregar al carrito
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </section>
        )}
      </section>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.55);
          padding: 1rem;
          color: white;
          outline: none;
        }

        .input:focus {
          border-color: #59ff35;
        }
      `}</style>
    </main>
  );
}
