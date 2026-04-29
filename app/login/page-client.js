"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";

const initialState = {
  email: "",
  password: "",
};

const loginAudiences = [
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

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedAudience = searchParams.get("role");
  const isProvider = selectedAudience === "proveedor";
  const [form, setForm] = useState(initialState);
  const [adminPin, setAdminPin] = useState("");
  const [requiresAdminPin, setRequiresAdminPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState("neutral");

  useEffect(() => {
    const audienceText =
      selectedAudience === "proveedor"
        ? "Demo proveedor: admin@drokex.com / admin123"
        : "Demo cliente: cliente@drokex.com / cliente123";

    setMessage(
      selectedAudience ? audienceText : "Elige primero cómo quieres usar Drokex para continuar.",
    );
    setTone("neutral");
  }, [selectedAudience]);

  function handleAudienceSelect(role) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("role", role);
    router.push(`/login?${params.toString()}`);
  }

  function handleBackToSelector() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("role");
    router.push(params.toString() ? `/login?${params.toString()}` : "/login");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        adminPin,
        audience: selectedAudience,
      }),
    });

    const payload = await response.json();
    setIsSubmitting(false);

    if (response.status === 202 && payload.requiresAdminPin) {
      setRequiresAdminPin(true);
      setTone("success");
      setMessage(payload.message || "Confirma el PIN del administrador.");
      return;
    }

    if (!response.ok) {
      setTone("error");
      setMessage(payload.error || "No fue posible iniciar sesión.");
      return;
    }

    const nextPath = searchParams.get("next");
    const redirectTo =
      payload.user?.role === "ADMIN"
        ? "/admin"
        : nextPath || `/mi-cuenta?role=${selectedAudience}`;

    setTone("success");
    setMessage(payload.message || "Inicio de sesión correcto.");
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <main className="commerce-page">
      <SiteHeader />
      <section className="auth-shell shell">
        {!selectedAudience ? (
          <div className="auth-choice-shell">
            <div className="auth-choice-header">
              <p className="section-tag">Acceso Drokex</p>
              <h1>¿Cómo quieres usar Drokex?</h1>
              <p className="auth-copy">
                Elige el tipo de acceso que mejor describe tu operación y luego te mostramos el
                formulario para iniciar sesión.
              </p>
            </div>

            <div className="login-audience-grid">
              {loginAudiences.map((audience) => (
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
                <p className="section-tag">Acceso Drokex</p>
                <h1>
                  {isProvider
                    ? "Inicia sesión como proveedor."
                    : "Inicia sesión como cliente."}
                </h1>
                <p className="auth-copy">
                  {isProvider
                    ? "Entra para gestionar tu catálogo, revisar pedidos y mover tu operación comercial."
                    : "Entra para explorar productos, revisar actividad y gestionar tu experiencia comercial como cliente."}
                </p>
              </div>
              <button type="button" className="auth-back-link" onClick={handleBackToSelector}>
                Cambiar tipo de acceso
              </button>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <label>
                <span>Correo electrónico</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  placeholder="correo@empresa.com"
                />
              </label>

              <label>
                <span>Contraseña</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  placeholder="Tu contraseña"
                />
              </label>

              {requiresAdminPin ? (
                <label>
                  <span>PIN administrador</span>
                  <input
                    type="password"
                    value={adminPin}
                    onChange={(event) => setAdminPin(event.target.value)}
                    placeholder="PIN adicional"
                  />
                </label>
              ) : null}

              {message ? (
                <div className={tone === "error" ? "auth-message is-error" : tone === "success" ? "auth-message is-success" : "auth-message"}>
                  {message}
                </div>
              ) : null}

              <div className="auth-actions">
                <button
                  type="submit"
                  className={isProvider ? "primary-button auth-submit-button is-provider" : "primary-button auth-submit-button is-client"}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
                </button>
                <Link
                  href={isProvider ? "/registro?role=proveedor" : "/registro?role=cliente"}
                  className={isProvider ? "secondary-button secondary-button-dark auth-secondary-button is-provider" : "secondary-button secondary-button-dark auth-secondary-button is-client"}
                >
                  Crear cuenta
                </Link>
              </div>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}
