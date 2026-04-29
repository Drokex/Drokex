"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";

const registerAudiences = [
  {
    id: "cliente",
    title: "Compra y gestiona tu operación desde un solo lugar",
    description: "Accede a productos, seguimiento y herramientas comerciales con una experiencia pensada para clientes.",
    bullets: ["Explora productos", "Seguimiento fácil", "Gestión comercial"],
    cta: "Cliente",
    image: "/quiero-vender.png",
    cardClassName: "login-audience-card is-client",
    imageClassName: "login-audience-image is-client",
  },
  {
    id: "proveedor",
    title: "Vende tus productos a miles de tiendas",
    description: "Conecta con negocios que buscan productos como los tuyos.",
    bullets: ["Más clientes", "Mayor alcance", "Crecimiento en LATAM"],
    cta: "Proveedor",
    image: "/quiero-distribuir.png",
    cardClassName: "login-audience-card is-provider",
    imageClassName: "login-audience-image is-provider",
  },
];

const initialState = {
  fullName: "",
  email: "",
  company: "",
  phone: "",
  password: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedAudience = searchParams.get("role");
  const isProvider = selectedAudience === "proveedor";

  const [form, setForm] = useState(initialState);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoBase64, setLogoBase64] = useState("");
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState("neutral");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  function handleLogoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoPreview(ev.target.result);
      setLogoBase64(ev.target.result);
    };
    reader.readAsDataURL(file);
  }

  function getInitial() {
    return (form.company || form.fullName || "?").charAt(0).toUpperCase();
  }

  function handleAudienceSelect(role) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("role", role);
    router.push(`/registro?${params.toString()}`);
  }

  function handleBackToSelector() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("role");
    router.push(params.toString() ? `/registro?${params.toString()}` : "/registro");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, audience: selectedAudience, logoUrl: logoBase64 }),
    });

    const payload = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setTone("error");
      setMessage(payload.error || "No fue posible crear la cuenta.");
      return;
    }

    setTone("success");
    setMessage(payload.message || "Cuenta creada correctamente.");
    router.push(`/mi-cuenta?role=${selectedAudience}`);
    router.refresh();
  }

  return (
    <main className="commerce-page">
      <SiteHeader />
      <section className="auth-shell shell">
        {!selectedAudience ? (
          <div className="auth-choice-shell">
            <div className="auth-choice-header">
              <p className="section-tag">Registro Drokex</p>
              <h1>¿Cómo quieres usar Drokex?</h1>
              <p className="auth-copy">
                Elige el tipo de cuenta que mejor describe tu operación y luego te mostramos el
                formulario para crear tu acceso.
              </p>
            </div>

            <div className="login-audience-grid">
              {registerAudiences.map((audience) => (
                <button
                  key={audience.id}
                  type="button"
                  className={audience.cardClassName}
                  onClick={() => handleAudienceSelect(audience.id)}
                >
                  <div className="login-audience-visual">
                    <Image
                      src={audience.image}
                      alt=""
                      width={440}
                      height={560}
                      className={audience.imageClassName}
                      style={{ height: "auto" }}
                    />
                  </div>
                  <div className="login-audience-copy">
                    <strong>{audience.title}</strong>
                    <p>{audience.description}</p>
                    <ul className="login-audience-list">
                      {audience.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                  <span className="login-audience-cta">{audience.cta}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={isProvider ? "auth-card is-provider" : "auth-card is-client"}>
            <div className="auth-card-top">
              <div>
                <p className="section-tag">Registro Drokex</p>
                <h1>
                  {isProvider
                    ? "Crea tu cuenta como proveedor."
                    : "Crea tu cuenta como cliente."}
                </h1>
                <p className="auth-copy">
                  {isProvider
                    ? "Publica tu catálogo, recibe pedidos y conecta con compradores en toda la región."
                    : "Explora productos, haz seguimiento de tus pedidos y gestiona tu experiencia comercial."}
                </p>
              </div>
              <button type="button" className="auth-back-link" onClick={handleBackToSelector}>
                Cambiar tipo de cuenta
              </button>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-logo-wrap">
                <button
                  type="button"
                  className="auth-logo-circle"
                  onClick={() => fileInputRef.current?.click()}
                  title="Subir logo"
                >
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="auth-logo-preview" />
                  ) : (
                    <span className="auth-logo-initial">{getInitial()}</span>
                  )}
                  <span className="auth-logo-badge">+</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  style={{ display: "none" }}
                />
                <p className="auth-logo-hint">Subir logo</p>
              </div>
              <label>
                <span>Nombre completo</span>
                <input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Tu nombre completo"
                  required
                />
              </label>
              <label>
                <span>Correo electrónico</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="correo@empresa.com"
                  required
                />
              </label>
              <label>
                <span>Empresa</span>
                <input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Nombre de tu empresa"
                />
              </label>
              <label>
                <span>Teléfono</span>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+57 300 000 0000"
                />
              </label>
              <label>
                <span>Contraseña</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Mínimo 8 caracteres"
                  required
                />
              </label>

              {message ? (
                <div className={tone === "error" ? "auth-message is-error" : "auth-message is-success"}>
                  {message}
                </div>
              ) : null}

              <div className="auth-actions">
                <button
                  type="submit"
                  className={isProvider ? "primary-button auth-submit-button is-provider" : "primary-button auth-submit-button is-client"}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
                </button>
                <Link
                  href={isProvider ? "/login?role=proveedor" : "/login?role=cliente"}
                  className={isProvider ? "secondary-button secondary-button-dark auth-secondary-button is-provider" : "secondary-button secondary-button-dark auth-secondary-button is-client"}
                >
                  Ya tengo cuenta
                </Link>
              </div>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}
