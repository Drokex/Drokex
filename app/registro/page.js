"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import authFieldStyles from "@/app/components/auth-fields.module.css";
import styles from "./page.module.css";
import authStyles from "@/app/components/auth-account.module.css";

const registerAudiences = [
  {
    id: "cliente",
    title: "Compra y gestiona tu operación desde un solo lugar",
    description: "Accede a productos, seguimiento y herramientas comerciales con una experiencia pensada para clientes.",
    bullets: ["Explora productos", "Seguimiento fácil", "Gestión comercial"],
    cta: "Cliente",
    image: "/quiero-vender.png",
    cardClassName: `${authStyles.loginAudienceCard} ${authStyles.isClient}`,
    imageClassName: `${authStyles.loginAudienceImage} ${authStyles.isClient}`,
  },
  {
    id: "proveedor",
    title: "Vende tus productos a miles de tiendas",
    description: "Conecta con negocios que buscan productos como los tuyos.",
    bullets: ["Más clientes", "Mayor alcance", "Crecimiento en LATAM"],
    cta: "Proveedor",
    image: "/quiero-distribuir.png",
    cardClassName: `${authStyles.loginAudienceCard} ${authStyles.isProvider}`,
    imageClassName: `${authStyles.loginAudienceImage} ${authStyles.isProvider}`,
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
  return (
    <Suspense fallback={null}>
      <RegisterPageInner />
    </Suspense>
  );
}

function RegisterPageInner() {
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
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);
  const [existingAccount, setExistingAccount] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Si ya hay sesión activa, no tiene sentido mostrar el selector — se manda
  // directo al panel. Se gatea el render con checkingSession para que no
  // alcance a parpadear el selector antes de redirigir.
  useEffect(() => {
    fetch("/api/account", { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((payload) => {
        if (!payload?.user) {
          setCheckingSession(false);
          return;
        }
        const audience = payload.session?.audience === "proveedor" || payload.user?.role === "PROVIDER"
          ? "proveedor"
          : "cliente";
        router.replace(`/mi-cuenta?role=${audience}`);
      })
      .catch(() => setCheckingSession(false));
  }, [router]);

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

  if (checkingSession) {
    return (
      <main className="commerce-page">
        <SiteHeader />
      </main>
    );
  }

  return (
    <main className="commerce-page">
      <SiteHeader />
      <section className={`${authStyles.authShell} shell`}>
        {!selectedAudience ? (
          <div className={authStyles.authChoiceShell}>
            <div className={authStyles.authChoiceHeader}>
              <p className="section-tag">Registro Drokex</p>
              <h1>¿Cómo quieres usar Drokex?</h1>
              <p className={authStyles.authCopy}>
                Elige el tipo de cuenta que mejor describe tu operación y luego te mostramos el
                formulario para crear tu acceso.
              </p>
            </div>

            <div className={authStyles.loginAudienceGrid}>
              {registerAudiences.map((audience) => (
                <button
                  key={audience.id}
                  type="button"
                  className={audience.cardClassName}
                  onClick={() => handleAudienceSelect(audience.id)}
                >
                  <div className={authStyles.loginAudienceVisual}>
                    <Image
                      src={audience.image}
                      alt=""
                      width={440}
                      height={560}
                      className={audience.imageClassName}
                      style={{ height: "auto" }}
                    />
                  </div>
                  <div className={authStyles.loginAudienceCopy}>
                    <strong>{audience.title}</strong>
                    <p>{audience.description}</p>
                    <ul className={authStyles.loginAudienceList}>
                      {audience.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                  <span className={authStyles.loginAudienceCta}>{audience.cta}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={isProvider ? `${authStyles.authCard} ${authStyles.isProvider}` : `${authStyles.authCard} ${authStyles.isClient}`}>
            <div className={authStyles.authCardTop}>
              <div>
                <p className="section-tag">Registro Drokex</p>
                <h1>
                  {isProvider
                    ? "Crea tu cuenta como proveedor."
                    : "Crea tu cuenta como cliente."}
                </h1>
                <p className={authStyles.authCopy}>
                  {isProvider
                    ? "Publica tu catálogo, recibe pedidos y conecta con compradores en toda la región."
                    : "Explora productos, haz seguimiento de tus pedidos y gestiona tu experiencia comercial."}
                </p>
                {existingAccount && existingAccount.audience !== selectedAudience && (
                  <p style={{
                    margin: "14px 0 0", padding: "10px 14px", borderRadius: 10,
                    background: "rgba(251, 191, 36, 0.1)", border: "1px solid rgba(251, 191, 36, 0.3)",
                    color: "#fbbf24", fontSize: "0.85rem", fontWeight: 600,
                  }}>
                    Ya tienes una cuenta como {existingAccount.audience === "proveedor" ? "proveedor" : "cliente"}.
                    {isProvider
                      ? " Para vender en Drokex crea una cuenta de proveedor con otro correo."
                      : " Para comprar en Drokex crea una cuenta de cliente con otro correo."}
                  </p>
                )}
              </div>
              <button type="button" className={authStyles.authBackLink} onClick={handleBackToSelector}>
                Cambiar tipo de cuenta
              </button>
            </div>

            <form onSubmit={handleSubmit} className={authStyles.authForm}>
              <div className={styles.authLogoWrap}>
                <button
                  type="button"
                  className={styles.authLogoCircle}
                  onClick={() => fileInputRef.current?.click()}
                  title="Subir logo"
                >
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className={styles.authLogoPreview} />
                  ) : (
                    <span className={styles.authLogoInitial}>{getInitial()}</span>
                  )}
                  <span className={styles.authLogoBadge}>+</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  style={{ display: "none" }}
                />
                <p className={styles.authLogoHint}>Subir logo</p>
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
                <div className={authFieldStyles.pwWrap}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Mínimo 8 caracteres"
                    required
                  />
                  <button type="button" className={authFieldStyles.pwEye} onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}>
                    {showPassword
                      ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </label>

              {message ? (
                <div className={tone === "error" ? `${authStyles.authMessage} ${authStyles.isError}` : `${authStyles.authMessage} ${authStyles.isSuccess}`}>
                  {message}
                </div>
              ) : null}

              <div className="auth-actions">
                <button
                  type="submit"
                  className={isProvider ? `primary-button ${authStyles.authSubmitButton} ${authStyles.isProvider}` : `primary-button ${authStyles.authSubmitButton} ${authStyles.isClient}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
                </button>
                <Link
                  href={isProvider ? "/login?role=proveedor" : "/login?role=cliente"}
                  className={isProvider ? `secondary-button secondary-button-dark ${authStyles.authSecondaryButton} ${authStyles.isProvider}` : `secondary-button secondary-button-dark ${authStyles.authSecondaryButton} ${authStyles.isClient}`}
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
