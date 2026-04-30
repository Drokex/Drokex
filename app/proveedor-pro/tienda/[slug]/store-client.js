"use client";

import { useEffect, useMemo, useState } from "react";

const fallbackStore = {
  brand: "Mi Tienda",
  country: "Colombia",
  logo: "",
  heroTitle: "Tu landing ya esta lista para compartir",
  heroSubtitle:
    "Vuelve al constructor para crear o actualizar el contenido de esta tienda.",
  heroImage: "",
  ctaText: "Ver productos",
  secondaryCtaText: "Conocer marca",
  promoText: "Pagina publicada",
  headerCtaText: "Comprar",
  trustEyebrow: "Vitrina activa",
  trustText:
    "Compra directa, identidad propia y productos listos para compartir con clientes.",
  stockLabel: "Stock",
  stockValue: "Local",
  partner1: "Apple",
  partner2: "Microsoft",
  partner3: "Google",
  partner4: "Zoho",
  searchTitle: "Busca productos",
  searchPlaceholder: "Buscar en esta tienda...",
  searchButtonText: "Buscar",
  aboutTitle: "Contenido pendiente de sincronizar",
  aboutText:
    "Esta vista usa los datos guardados en este navegador cuando presionas Crear landing.",
  bannerSecondary: "",
  benefit1: "Landing personalizada",
  benefit1Text: "Una razon clara para confiar en la marca antes de comprar.",
  benefit2: "Productos destacados",
  benefit2Text: "Entrega una promesa comercial concreta y facil de entender.",
  benefit3: "Link para compartir",
  benefit3Text: "Refuerza seguridad, respaldo y decision de compra.",
  catalogEyebrow: "Catalogo",
  catalogTitle: "Productos destacados",
  catalogText:
    "Selecciona, cotiza o compra productos directamente desde la vitrina del proveedor.",
  finalEyebrow: "Listo para comprar",
  finalTitle: "Descubre la coleccion de Mi Tienda",
  finalCtaText: "Ver catalogo",
  primaryColor: "#ff9f2e",
  backgroundColor: "#fff7fb",
  surfaceColor: "#ffffff",
  textColor: "#191421",
  mutedTextColor: "#6f6477",
  buttonTextColor: "#ffffff",
  gradientFromColor: "#b86cff",
  gradientToColor: "#ff7db8",
};

const fallbackProducts = [
  {
    name: "Producto destacado",
    category: "Coleccion",
    price: "0",
    stock: "Disponible",
    image: "",
    description: "Agrega productos desde el constructor para completar esta vitrina.",
  },
];

function hexToRgba(hex, alpha) {
  const normalized = (hex || "#000000").replace("#", "");
  const value =
    normalized.length === 3
      ? normalized.split("").map((char) => `${char}${char}`).join("")
      : normalized.padEnd(6, "0").slice(0, 6);
  const number = Number.parseInt(value, 16);
  const red = (number >> 16) & 255;
  const green = (number >> 8) & 255;
  const blue = number & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function formatPrice(price) {
  const numeric = Number(price);
  if (!numeric) return "Consultar precio";
  return `$${numeric.toLocaleString("es-CO")} COP`;
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

  const products = landing?.products?.length ? landing.products : fallbackProducts;

  const palette = useMemo(
    () => ({
      primary: store.primaryColor,
      primarySoft: hexToRgba(store.primaryColor, 0.14),
      primaryGlow: hexToRgba(store.primaryColor, 0.35),
      bg: store.backgroundColor,
      surface: store.surfaceColor,
      text: store.textColor,
      muted: store.mutedTextColor,
      buttonText: store.buttonTextColor,
      gradientFrom: store.gradientFromColor || "#b86cff",
      gradientTo: store.gradientToColor || "#ff7db8",
    }),
    [store]
  );

  const stats = [
    { label: "Productos", value: products.length },
    { label: "Pais", value: store.country },
    { label: store.stockLabel || "Stock", value: store.stockValue || "Local" },
  ];
  const partners = [store.partner1, store.partner2, store.partner3, store.partner4].filter(Boolean);

  return (
    <main
      className="min-h-screen scroll-smooth"
      style={{ backgroundColor: palette.bg, color: palette.text }}
    >
      {!landing && hasLoaded ? (
        <div className="fixed inset-x-4 top-4 z-50 mx-auto max-w-3xl rounded-3xl border border-white/10 p-4 shadow-2xl backdrop-blur-xl" style={{ backgroundColor: palette.surface }}>
          <p className="font-black" style={{ color: palette.primary }}>
            Esta landing todavia no tiene datos guardados en este navegador.
          </p>
          <p className="mt-1 text-sm" style={{ color: palette.muted }}>
            Vuelve al constructor, ajusta la tienda y presiona Crear landing
            para publicar el contenido en este link.
          </p>
        </div>
      ) : null}

      <header
        className="fixed inset-x-0 top-0 z-40 backdrop-blur-2xl"
        style={{ backgroundColor: hexToRgba(store.surfaceColor, 0.9) }}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
          <a href="#inicio" className="flex min-w-0 items-center gap-3">
            {store.logo ? (
              <img
                src={store.logo}
                alt={`${store.brand} logo`}
                className="h-12 w-12 shrink-0 rounded-2xl object-cover"
              />
            ) : (
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-black"
                style={{
                  backgroundColor: palette.primary,
                  color: palette.buttonText,
                }}
              >
                {store.brand.charAt(0)}
              </div>
            )}

            <div className="min-w-0">
              <p
                className="text-[10px] font-black uppercase tracking-[0.22em]"
                style={{ color: palette.primary }}
              >
                {store.country}
              </p>
              <h1 className="truncate text-xl font-black md:text-2xl">
                {store.brand}
              </h1>
            </div>
          </a>

          <nav
            className="hidden items-center gap-7 text-sm font-black lg:flex"
            style={{ color: palette.muted }}
          >
            <a href="#inicio" className="hover:opacity-100">Inicio</a>
            <a href="#beneficios" className="hover:opacity-100">Beneficios</a>
            <a href="#marca" className="hover:opacity-100">Marca</a>
            <a href="#productos" className="hover:opacity-100">Productos</a>
          </nav>

          <a
            href="#productos"
            className="rounded-2xl px-5 py-3 text-sm font-black transition hover:scale-[1.02]"
            style={{
              backgroundColor: palette.primary,
              color: palette.buttonText,
            }}
          >
            {store.headerCtaText}
          </a>
        </div>
      </header>

      <section
        id="inicio"
        className="relative overflow-hidden px-4 pb-10 pt-28 sm:px-6 lg:px-10"
        style={{
          background: `linear-gradient(135deg, ${hexToRgba(palette.gradientFrom, 0.28)}, ${hexToRgba(palette.gradientTo, 0.28)})`,
        }}
      >
        <div
          className="mx-auto grid min-h-[760px] w-full max-w-[1440px] items-center gap-10 overflow-hidden rounded-[2.75rem] bg-cover bg-center p-7 shadow-2xl md:p-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.7fr)]"
          style={{
            backgroundColor: palette.surface,
            backgroundImage: store.heroImage
              ? `linear-gradient(90deg, ${hexToRgba(store.surfaceColor, 0.96)}, ${hexToRgba(store.surfaceColor, 0.62)}), url(${store.heroImage})`
              : `radial-gradient(circle at 76% 36%, ${palette.primaryGlow}, transparent 34%)`,
          }}
        >
          <div className="max-w-3xl">
            <span
              className="inline-flex rounded-full px-4 py-2 text-sm font-black"
              style={{
                backgroundColor: palette.primarySoft,
                color: palette.primary,
              }}
            >
              {store.promoText}
            </span>

            <h2 className="mt-8 text-5xl font-black leading-[0.95] sm:text-6xl lg:text-7xl">
              {store.heroTitle}
            </h2>

            <p
              className="mt-6 max-w-2xl text-lg font-semibold leading-relaxed sm:text-xl"
              style={{ color: palette.muted }}
            >
              {store.heroSubtitle}
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#productos"
                className="rounded-2xl px-8 py-4 font-black transition hover:scale-[1.03]"
                style={{
                  backgroundColor: palette.primary,
                  color: palette.buttonText,
                }}
              >
                {store.ctaText}
              </a>
              <a
                href="#marca"
                className="rounded-2xl border border-white/15 px-8 py-4 font-black transition hover:border-white/40"
                style={{ color: palette.text }}
              >
                {store.secondaryCtaText}
              </a>
            </div>
          </div>

          <aside
            className="relative min-h-[500px] rounded-[2.5rem] p-6"
            style={{
              background: `linear-gradient(135deg, ${hexToRgba(palette.gradientFrom, 0.42)}, ${hexToRgba(palette.gradientTo, 0.56)})`,
            }}
          >
            <div className="absolute inset-6 rounded-[2rem] border-2 border-dashed border-white/35" />
            <div className="relative z-10 flex h-full min-h-[452px] flex-col justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em]" style={{ color: palette.buttonText }}>
                  {store.trustEyebrow}
                </p>
                <p className="mt-4 max-w-sm text-2xl font-black leading-tight" style={{ color: palette.text }}>
                  {store.trustText}
                </p>
              </div>
              <div className="grid gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between rounded-2xl border border-white/20 px-4 py-4 shadow-lg"
                  style={{ backgroundColor: hexToRgba(store.surfaceColor, 0.84) }}
                >
                  <span className="text-sm" style={{ color: palette.muted }}>
                    {stat.label}
                  </span>
                  <strong>{stat.value}</strong>
                </div>
              ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section
        className="px-4 py-0 sm:px-6 lg:px-10"
        style={{ backgroundColor: palette.bg }}
      >
        <div
          className="mx-auto grid max-w-[1440px] items-center gap-4 overflow-hidden rounded-[2rem] px-6 py-5 md:grid-cols-[1fr_auto_1fr]"
          style={{
            background: `linear-gradient(90deg, ${palette.gradientFrom}, ${palette.gradientTo})`,
            color: palette.buttonText,
          }}
        >
          <div className="flex flex-wrap items-center gap-7 text-lg font-black opacity-90">
            {partners.map((partner) => (
              <span key={partner}>{partner}</span>
            ))}
          </div>
          <div className="hidden h-8 w-px bg-white/35 md:block" />
          <form className="flex min-w-0 items-center gap-2 rounded-2xl bg-white p-2 shadow-xl">
            <input
              placeholder={store.searchPlaceholder}
              className="min-w-0 flex-1 rounded-xl px-4 py-3 text-sm outline-none"
              style={{ color: palette.text }}
            />
            <button
              type="button"
              className="rounded-xl px-5 py-3 text-sm font-black"
              style={{ backgroundColor: palette.primary, color: palette.buttonText }}
            >
              {store.searchButtonText}
            </button>
          </form>
        </div>
      </section>

      <section
        id="beneficios"
        className="px-4 py-20 sm:px-6 lg:px-10"
        style={{ backgroundColor: palette.bg }}
      >
        <div className="mx-auto max-w-[1440px]">
          <h2 className="text-center text-4xl font-black md:text-5xl">
            {store.searchTitle}
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            [store.benefit1, store.benefit1Text],
            [store.benefit2, store.benefit2Text],
            [store.benefit3, store.benefit3Text],
          ].map(([benefit, description], index) => (
            <article
              key={benefit}
              className="rounded-[2rem] border border-white/10 p-7"
              style={{ backgroundColor: palette.surface }}
            >
              <div
                className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl font-black"
                style={{
                  backgroundColor: palette.primary,
                  color: palette.buttonText,
                }}
              >
                0{index + 1}
              </div>
              <h3 className="text-2xl font-black">{benefit}</h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: palette.muted }}>
                {description}
              </p>
            </article>
          ))}
          </div>
        </div>
      </section>

      <section
        id="marca"
        className="px-4 py-20 sm:px-6 lg:px-10"
        style={{ backgroundColor: palette.surface }}
      >
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p
              className="text-sm font-black uppercase tracking-[0.24em]"
              style={{ color: palette.primary }}
            >
              Nuestra marca
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
              {store.aboutTitle}
            </h2>
            <p
              className="mt-6 max-w-2xl text-lg leading-relaxed"
              style={{ color: palette.muted }}
            >
              {store.aboutText}
            </p>
          </div>

          <div
            className="min-h-[380px] overflow-hidden rounded-[2.5rem] border border-white/10"
            style={{ backgroundColor: palette.bg }}
          >
            {store.bannerSecondary ? (
              <img
                src={store.bannerSecondary}
                alt="Banner secundario"
                className="h-full min-h-[380px] w-full object-cover"
              />
            ) : (
              <div className="flex min-h-[380px] items-center justify-center px-8 text-center" style={{ color: palette.muted }}>
                Agrega un banner secundario para contar mejor la historia visual
                de tu marca.
              </div>
            )}
          </div>
        </div>
      </section>

      <section
        id="productos"
        className="px-4 py-20 sm:px-6 lg:px-10"
        style={{ backgroundColor: palette.bg }}
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p
                className="text-sm font-black uppercase tracking-[0.24em]"
                style={{ color: palette.primary }}
              >
                {store.catalogEyebrow}
              </p>
              <h2 className="mt-4 text-4xl font-black md:text-6xl">
                {store.catalogTitle}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed" style={{ color: palette.muted }}>
              {store.catalogText}
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product, index) => (
              <article
                key={`${product.name}-${index}`}
                className="group overflow-hidden rounded-[2rem] border border-white/10 p-4 transition hover:-translate-y-1"
                style={{ backgroundColor: palette.surface }}
              >
                <div
                  className="relative h-64 overflow-hidden rounded-[1.5rem]"
                  style={{ backgroundColor: palette.bg }}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name || "Producto"}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center" style={{ color: palette.muted }}>
                      Imagen producto
                    </div>
                  )}
                  <span
                    className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-black"
                    style={{
                      backgroundColor: palette.primary,
                      color: palette.buttonText,
                    }}
                  >
                    {product.category || "Categoria"}
                  </span>
                </div>

                <div className="p-2 pt-5">
                  <h3 className="text-2xl font-black">
                    {product.name || "Nombre producto"}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: palette.muted }}>
                    {product.description || "Descripcion del producto"}
                  </p>
                  <p className="mt-5 text-2xl font-black" style={{ color: palette.primary }}>
                    {formatPrice(product.price)}
                  </p>
                  <p className="mt-1 text-sm" style={{ color: palette.muted }}>
                    Stock: {product.stock || "0"}
                  </p>
                  <button
                    className="mt-5 w-full rounded-2xl px-5 py-4 font-black transition hover:scale-[1.02]"
                    style={{
                      backgroundColor: palette.primary,
                      color: palette.buttonText,
                    }}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-10" style={{ backgroundColor: palette.bg }}>
        <div
          className="mx-auto max-w-[1440px] rounded-[2.5rem] border border-white/10 p-8 md:p-12"
          style={{
            background: `linear-gradient(135deg, ${hexToRgba(palette.gradientFrom, 0.22)}, ${hexToRgba(palette.gradientTo, 0.28)}), ${palette.surface}`,
          }}
        >
          <p className="text-sm font-black uppercase tracking-[0.24em]" style={{ color: palette.primary }}>
            {store.finalEyebrow}
          </p>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
            <h2 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
              {store.finalTitle}
            </h2>
            <a
              href="#productos"
              className="rounded-2xl px-8 py-4 font-black"
              style={{
                backgroundColor: palette.primary,
                color: palette.buttonText,
              }}
            >
              {store.finalCtaText}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
