"use client";

import { useEffect, useState } from "react";

const fallbackStore = {
  brand: "Mi Tienda",
  country: "Colombia",
  logo: "",
  heroTitle: "Tu landing ya esta lista para compartir",
  heroSubtitle:
    "Vuelve al constructor para crear o actualizar el contenido de esta tienda.",
  heroImage: "",
  ctaText: "Ver productos",
  promoText: "Pagina publicada",
  aboutTitle: "Contenido pendiente de sincronizar",
  aboutText:
    "Esta vista usa los datos guardados en este navegador cuando presionas Crear landing.",
  bannerSecondary: "",
  benefit1: "Landing personalizada",
  benefit2: "Productos destacados",
  benefit3: "Link para compartir",
  primaryColor: "#c89b5c",
  backgroundColor: "#11100d",
  surfaceColor: "#1c1712",
  textColor: "#fff8ee",
  mutedTextColor: "#c7b9a7",
  buttonTextColor: "#15100a",
};

function hexToRgba(hex, alpha) {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized.split("").map((char) => `${char}${char}`).join("")
      : normalized;
  const number = Number.parseInt(value, 16);
  const red = (number >> 16) & 255;
  const green = (number >> 8) & 255;
  const blue = number & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export default function ProveedorProStoreClient({ slug, fallbackBrand }) {
  const [landing, setLanding] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(`drokex-proveedor-pro:${slug}`);

    if (saved) {
      try {
        setLanding(JSON.parse(saved));
      } catch {
        setLanding(null);
      }
    }

    setHasLoaded(true);
  }, [slug]);

  const store = {
    ...fallbackStore,
    brand: fallbackBrand || fallbackStore.brand,
    ...(landing?.store || {}),
  };
  const products = landing?.products || [];
  const primaryGlow = hexToRgba(store.primaryColor, 0.35);
  const primarySoft = hexToRgba(store.primaryColor, 0.16);

  return (
    <section
      className="min-h-screen"
      style={{
        backgroundColor: store.backgroundColor,
        color: store.textColor,
      }}
    >
      {!landing && hasLoaded ? (
        <div className="mx-auto max-w-7xl p-5">
          <div className="rounded-3xl border border-[#c89b5c]/30 bg-[#c89b5c]/10 p-5">
          <p className="font-black text-[#c89b5c]">
            Esta landing todavia no tiene datos guardados en este navegador.
          </p>
          <p className="mt-2 text-sm text-[#c7b9a7]">
            Vuelve al constructor, ajusta la tienda y presiona Crear landing
            para publicar el contenido en este link.
          </p>
          </div>
        </div>
      ) : null}

      <div
        className="min-h-screen w-full overflow-hidden"
        style={{ backgroundColor: store.surfaceColor }}
      >
        <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5 backdrop-blur-xl md:px-10 lg:px-14">
          <div className="flex items-center gap-3">
            {store.logo ? (
              <img
                src={store.logo}
                alt={`${store.brand} logo`}
                className="h-11 w-11 rounded-full object-cover"
              />
            ) : (
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full font-black"
                style={{
                  backgroundColor: store.primaryColor,
                  color: store.buttonTextColor,
                }}
              >
                {store.brand.charAt(0)}
              </div>
            )}

            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.2em]"
                style={{ color: store.primaryColor }}
              >
                {store.country}
              </p>
              <h1 className="mt-1 text-3xl font-black">{store.brand}</h1>
            </div>
          </div>

          <nav
            className="hidden items-center gap-8 text-sm font-bold md:flex"
            style={{ color: store.mutedTextColor }}
          >
            <a href="#inicio">Inicio</a>
            <a href="#beneficios">Beneficios</a>
            <a href="#marca">Marca</a>
            <a href="#productos">Productos</a>
          </nav>

          <a
            href="#productos"
            className="rounded-2xl px-5 py-3 font-black"
            style={{
              backgroundColor: store.primaryColor,
              color: store.buttonTextColor,
            }}
          >
            Comprar
          </a>
        </header>

        <section
          id="inicio"
          className="grid min-h-[calc(100vh-84px)] items-center bg-cover bg-center px-6 py-16 md:px-10 lg:px-14"
          style={{
            backgroundColor: store.backgroundColor,
            backgroundImage: store.heroImage
              ? `linear-gradient(90deg, rgba(0,0,0,.82), rgba(0,0,0,.22)), url(${store.heroImage})`
              : `radial-gradient(circle at 75% 25%, ${primaryGlow}, transparent 36%)`,
          }}
        >
          <div className="max-w-3xl">
            <span
              className="rounded-full px-4 py-2 text-sm font-black"
              style={{
                backgroundColor: primarySoft,
                color: store.primaryColor,
              }}
            >
              {store.promoText}
            </span>

            <h2 className="mt-8 text-6xl font-black leading-none md:text-7xl">
              {store.heroTitle}
            </h2>

            <p
              className="mt-6 max-w-xl text-lg font-semibold md:text-xl"
              style={{ color: store.mutedTextColor }}
            >
              {store.heroSubtitle}
            </p>

            <a
              href="#productos"
              className="mt-8 inline-flex rounded-2xl px-8 py-4 font-black"
              style={{
                backgroundColor: store.primaryColor,
                color: store.buttonTextColor,
              }}
            >
              {store.ctaText}
            </a>
          </div>
        </section>

        <section
          id="beneficios"
          className="grid gap-5 px-6 py-10 md:grid-cols-3 md:px-10 lg:px-14"
          style={{ backgroundColor: store.backgroundColor }}
        >
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
              <h3 className="font-black">{benefit}</h3>
            </div>
          ))}
        </section>

        <section id="marca" className="grid gap-10 px-6 py-16 md:grid-cols-2 md:px-10 lg:px-14">
          <div>
            <p
              className="text-sm font-black uppercase tracking-[0.24em]"
              style={{ color: store.primaryColor }}
            >
              Nuestra marca
            </p>
            <h2 className="text-4xl font-black">{store.aboutTitle}</h2>
            <p className="mt-4" style={{ color: store.mutedTextColor }}>
              {store.aboutText}
            </p>
          </div>

          <div
            className="min-h-[280px] overflow-hidden rounded-[2rem]"
            style={{ backgroundColor: store.backgroundColor }}
          >
            {store.bannerSecondary ? (
              <img
                src={store.bannerSecondary}
                alt="Banner secundario"
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="flex h-full items-center justify-center"
                style={{ color: store.mutedTextColor }}
              >
                Banner secundario
              </div>
            )}
          </div>
        </section>

        <section
          id="productos"
          className="px-6 py-16 md:px-10 lg:px-14"
          style={{ backgroundColor: store.backgroundColor }}
        >
          <h2 className="text-4xl font-black">Productos destacados</h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <article
                key={index}
                className="overflow-hidden rounded-[2rem] border border-white/10 p-4"
                style={{ backgroundColor: store.surfaceColor }}
              >
                <div
                  className="h-56 overflow-hidden rounded-[1.5rem]"
                  style={{ backgroundColor: store.backgroundColor }}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name || "Producto"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-full items-center justify-center"
                      style={{ color: store.mutedTextColor }}
                    >
                      Imagen producto
                    </div>
                  )}
                </div>

                <p
                  className="mt-4 text-xs font-black"
                  style={{ color: store.primaryColor }}
                >
                  {product.category || "Categoria"}
                </p>
                <h3 className="mt-1 text-xl font-black">
                  {product.name || "Nombre producto"}
                </h3>
                <p className="mt-2 text-sm" style={{ color: store.mutedTextColor }}>
                  {product.description || "Descripcion del producto"}
                </p>
                <p
                  className="mt-4 text-xl font-black"
                  style={{ color: store.primaryColor }}
                >
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
    </section>
  );
}
