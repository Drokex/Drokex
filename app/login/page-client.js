"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import SiteHeader from "@/app/components/site-header";
import authFieldStyles from "@/app/components/auth-fields.module.css";
import styles from "@/app/components/auth-account.module.css";

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
    cardClassName: `${styles.loginAudienceCard} ${styles.isClient}`,
    imageClassName: `${styles.loginAudienceImage} ${styles.isClient}`,
  },
  {
    id: "proveedor",
    title: "Vende tus productos a miles de tiendas",
    description: "Conecta con negocios que buscan productos como los tuyos.",
    bullets: ["Más clientes", "Mayor alcance", "Crecimiento en LATAM"],
    cta: "Proveedor",
    image: "/quiero-distribuir.png",
    cardClassName: `${styles.loginAudienceCard} ${styles.isProvider}`,
    imageClassName: `${styles.loginAudienceImage} ${styles.isProvider}`,
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
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setMessage(
      selectedAudience ? "" : "Elige primero cómo quieres usar Drokex para continuar.",
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

    if (response.status === 202 && payload.requiresAdminPin) {
      setIsSubmitting(false);
      setRequiresAdminPin(true);
      setTone("success");
      setMessage(payload.message || "Confirma el PIN del administrador.");
      return;
    }

    if (!response.ok) {
      setIsSubmitting(false);
      setTone("error");
      setMessage(payload.error || "No fue posible iniciar sesión.");
      return;
    }

    // En caso de éxito no reactivamos el botón: el spinner sigue hasta que
    // la navegación al panel se complete.

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
      <section className={`${styles.authShell} shell`}>
        {!selectedAudience ? (
          <div className={styles.authChoiceShell}>
            <div className={styles.authChoiceHeader}>
              <p className="section-tag">Acceso Drokex</p>
              <h1>¿Cómo quieres usar Drokex?</h1>
              <p className={styles.authCopy}>
                Elige el tipo de acceso que mejor describe tu operación y luego te mostramos el
                formulario para iniciar sesión.
              </p>
            </div>

            <div className={styles.loginAudienceGrid}>
              {loginAudiences.map((audience) => (
                <button
                  key={audience.id}
                  type="button"
                  className={audience.cardClassName}
                  onClick={() => handleAudienceSelect(audience.id)}
                >
                  <div className={styles.loginAudienceVisual}>
                    <Image
                      src={audience.image}
                      alt=""
                      width={440}
                      height={560}
                      className={audience.imageClassName}
                      style={{ height: "auto" }}
                    />
                  </div>
                  <div className={styles.loginAudienceCopy}>
                    <strong>{audience.title}</strong>
                    <p>{audience.description}</p>
                    <ul className={styles.loginAudienceList}>
                      {audience.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                  <span className={styles.loginAudienceCta}>{audience.cta}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={isProvider ? `${styles.authCard} ${styles.isProvider}` : `${styles.authCard} ${styles.isClient}`}>
            <div className={styles.authCardTop}>
              <div>
                <p className="section-tag">Acceso Drokex</p>
                <h1>
                  {isProvider
                    ? "Inicia sesión como proveedor."
                    : "Inicia sesión como cliente."}
                </h1>
                <p className={styles.authCopy}>
                  {isProvider
                    ? "Entra para gestionar tu catálogo, revisar pedidos y mover tu operación comercial."
                    : "Entra para explorar productos, revisar actividad y gestionar tu experiencia comercial como cliente."}
                </p>
              </div>
              <button type="button" className={styles.authBackLink} onClick={handleBackToSelector}>
                Cambiar tipo de acceso
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.authForm}>
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
                <div className={authFieldStyles.pwWrap}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(event) => setForm({ ...form, password: event.target.value })}
                    placeholder="Tu contraseña"
                  />
                  <button type="button" className={authFieldStyles.pwEye} onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}>
                    {showPassword
                      ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
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
                <div className={tone === "error" ? `${styles.authMessage} ${styles.isError}` : tone === "success" ? `${styles.authMessage} ${styles.isSuccess}` : styles.authMessage}>
                  {message}
                </div>
              ) : null}

              <div className="auth-actions">
                <button
                  type="submit"
                  className={isProvider ? `primary-button ${styles.authSubmitButton} ${styles.isProvider}` : `primary-button ${styles.authSubmitButton} ${styles.isClient}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={17} strokeWidth={2.6} className={styles.authSpinner} aria-hidden="true" />
                      Ingresando...
                    </>
                  ) : (
                    "Iniciar sesión"
                  )}
                </button>
                <Link
                  href={isProvider ? "/registro?role=proveedor" : "/registro?role=cliente"}
                  className={isProvider ? `secondary-button secondary-button-dark ${styles.authSecondaryButton} ${styles.isProvider}` : `secondary-button secondary-button-dark ${styles.authSecondaryButton} ${styles.isClient}`}
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
