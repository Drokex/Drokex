"use client";

import Image from "next/image";
import Link from "next/link";

const products = [
  {
    name: "Sofá Modular Premium",
    price: "$1.890.000 COP",
    tag: "Más vendido",
    gradient: "from-[#1a2a1a] to-[#0d1f0d]",
    emoji: "🛋️",
  },
  {
    name: "Mesa Centro Minimal",
    price: "$420.000 COP",
    tag: "Stock local",
    gradient: "from-[#1a1a2a] to-[#0d0d1f]",
    emoji: "🪑",
  },
  {
    name: "Silla Nórdica",
    price: "$260.000 COP",
    tag: "Entrega rápida",
    gradient: "from-[#2a1a1a] to-[#1f0d0d]",
    emoji: "🪑",
  },
];

const benefits = [
  { num: 1, label: "Stock disponible en el país" },
  { num: 2, label: "Venta directa desde Drokex" },
  { num: 3, label: "Landing page personalizada" },
  { num: 4, label: "Pagos y pedidos gestionados" },
];

export default function ProveedorProPage() {
  return (
    <main className="min-h-screen bg-[#050705] text-white">

      {/* ── NAV ───────────────────────────────────────── */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-black tracking-tight">
            DROKE<span className="text-[#59ff35]">X</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a href="#productos" className="hover:text-white transition-colors">Productos</a>
            <a href="#beneficios" className="hover:text-white transition-colors">Beneficios</a>
            <a href="#landing" className="hover:text-white transition-colors">Landing Pro</a>
          </nav>

          <Link
            href="/registro"
            className="rounded-xl bg-[#59ff35] px-5 py-2 text-sm font-bold text-black hover:brightness-110 transition"
          >
            Contactar proveedor
          </Link>
        </div>
      </header>

      {/* ── HERO ──────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(89,255,53,0.22),transparent_38%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,rgba(89,255,53,0.08),transparent_40%)]" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-24 md:grid-cols-2">
          <div>
            <span className="mb-6 inline-flex rounded-full border border-[#59ff35]/40 bg-[#59ff35]/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#59ff35]">
              Proveedor Pro
            </span>

            <h1 className="max-w-xl text-5xl font-black leading-[1.1] md:text-6xl">
              Tu marca lista para vender en{" "}
              <span className="text-[#59ff35]">otro país</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/65">
              Con Proveedor Pro tienes productos con stock local, landing page
              propia, venta directa y herramientas para impulsar tu marca dentro
              de Drokex.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/registro"
                className="rounded-2xl bg-[#59ff35] px-8 py-4 font-bold text-black transition hover:scale-105 hover:brightness-110"
              >
                Quiero vender directo
              </Link>
              <a
                href="#landing"
                className="rounded-2xl border border-white/15 px-8 py-4 font-bold text-white transition hover:border-[#59ff35]/60"
              >
                Ver ejemplo de tienda
              </a>
            </div>
          </div>

          {/* Hero image card */}
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 shadow-2xl">
            <div className="relative h-[360px] overflow-hidden rounded-[1.5rem] bg-[#0d150d]">
              <Image
                src="/hero-banner-green.jpg"
                alt="Proveedor Pro Drokex"
                fill
                className="object-cover opacity-80"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
              {/* Overlay branding */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#59ff35]/20 border border-[#59ff35]/30 px-4 py-2 text-sm font-bold text-[#59ff35]">
                  🟢 Tienda activa · Colombia
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFICIOS ────────────────────────────────── */}
      <section id="beneficios" className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {benefits.map(({ num, label }) => (
            <div
              key={label}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 hover:border-[#59ff35]/30 transition"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#59ff35] font-black text-black text-lg">
                {num}
              </div>
              <h3 className="text-base font-bold leading-snug">{label}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* ── LANDING PREVIEW ───────────────────────────── */}
      <section id="landing" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <h2 className="text-4xl font-black">
            Tu propia landing dentro de{" "}
            <span className="text-[#59ff35]">Drokex</span>
          </h2>
          <p className="mt-3 max-w-2xl text-white/55 text-lg">
            Cada proveedor Pro puede tener una página publicitaria para contar su historia,
            destacar productos y vender directamente.
          </p>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b100b]">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <span className="inline-flex rounded-full bg-[#59ff35]/10 border border-[#59ff35]/20 px-4 py-2 text-xs font-bold text-[#59ff35] w-fit">
                Tu Marca · Colombia
              </span>

              <h3 className="mt-6 text-4xl font-black leading-tight">
                Muebles premium para hogares modernos
              </h3>

              <p className="mt-4 text-white/60 leading-relaxed">
                Una tienda diseñada para mostrar productos, generar confianza y
                vender sin que el cliente salga de Drokex.
              </p>

              <div className="mt-8 flex gap-3">
                <button className="rounded-xl bg-[#59ff35] px-5 py-3 font-bold text-black hover:brightness-110 transition">
                  Comprar ahora
                </button>
                <button className="rounded-xl border border-white/15 px-5 py-3 font-bold hover:border-[#59ff35]/50 transition">
                  Cotizar
                </button>
              </div>
            </div>

            <div className="relative min-h-[320px] overflow-hidden">
              <Image
                src="/catalog-banner-orange.jpg"
                alt="Landing proveedor Pro"
                fill
                className="object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0b100b]/40" />
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCTOS ─────────────────────────────────── */}
      <section id="productos" className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-4xl font-black">Productos listos para vender</h2>
        <p className="mt-3 max-w-2xl text-white/55 text-lg">
          Esta sería la vitrina comercial del proveedor Pro con compra directa,
          stock local y productos destacados.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.name}
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 transition hover:border-[#59ff35]/60 hover:-translate-y-1"
            >
              {/* Product image placeholder */}
              <div className={`relative h-64 overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${product.gradient} flex items-center justify-center`}>
                <span className="text-7xl opacity-40">{product.emoji}</span>
                <span className="absolute left-4 top-4 rounded-full bg-[#59ff35] px-3 py-1 text-xs font-black text-black">
                  {product.tag}
                </span>
              </div>

              <div className="p-4">
                <h3 className="text-xl font-black">{product.name}</h3>
                <p className="mt-2 text-[#59ff35] font-bold">{product.price}</p>
                <button className="mt-5 w-full rounded-xl bg-white px-5 py-3 font-bold text-black transition hover:bg-[#59ff35]">
                  Agregar al carrito
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-[2rem] border border-[#59ff35]/30 bg-[#59ff35]/8 p-12 text-center">
          <h2 className="text-4xl font-black leading-tight">
            Convierte tu marca en una tienda activa<br className="hidden md:block" /> dentro de Drokex
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-white/65 text-lg">
            Ideal para proveedores que ya tienen stock en el país y quieren
            vender directamente con una experiencia más profesional.
          </p>
          <Link
            href="/registro"
            className="mt-8 inline-block rounded-2xl bg-[#59ff35] px-10 py-4 font-black text-black text-lg hover:brightness-110 transition hover:scale-105"
          >
            Activar modo Proveedor Pro →
          </Link>
        </div>
      </section>
    </main>
  );
}
