"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import SiteHeader from "@/app/components/site-header";
import authFieldStyles from "@/app/components/auth-fields.module.css";
import styles from "@/app/components/auth-account.module.css";

export default function RestablecerPasswordPage() {
  return (
    <Suspense fallback={null}>
      <RestablecerPasswordInner />
    </Suspense>
  );
}

function RestablecerPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState("neutral");

  async function handleSubmit(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setTone("error");
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    setIsSubmitting(true);

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const payload = await response.json();

    if (!response.ok) {
      setIsSubmitting(false);
      setTone("error");
      setMessage(payload.error || "No fue posible restablecer la contraseña.");
      return;
    }

    setTone("success");
    setMessage("Contraseña actualizada. Ya puedes iniciar sesión.");
    setTimeout(() => router.push("/login"), 1500);
  }

  if (!token) {
    return (
      <main className="commerce-page">
        <SiteHeader />
        <section className={`${styles.authShell} shell`}>
          <div className={styles.authCard}>
            <p className="section-tag">Acceso Drokex</p>
            <h1>Enlace inválido</h1>
            <p className={styles.authCopy}>
              Este enlace no incluye un token válido. Solicita uno nuevo desde{" "}
              <Link href="/recuperar-password">recuperar contraseña</Link>.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="commerce-page">
      <SiteHeader />
      <section className={`${styles.authShell} shell`}>
        <div className={styles.authCard}>
          <div className={styles.authCardTop}>
            <div>
              <p className="section-tag">Acceso Drokex</p>
              <h1>Crea tu nueva contraseña</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <label>
              <span>Nueva contraseña</span>
              <div className={authFieldStyles.pwWrap}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
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

            <label>
              <span>Confirma la contraseña</span>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repite la contraseña"
                required
              />
            </label>

            {message ? (
              <div className={tone === "error" ? `${styles.authMessage} ${styles.isError}` : tone === "success" ? `${styles.authMessage} ${styles.isSuccess}` : styles.authMessage}>
                {message}
              </div>
            ) : null}

            <div className="auth-actions">
              <button type="submit" className={`primary-button ${styles.authSubmitButton} ${styles.isProvider}`} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 size={17} strokeWidth={2.6} className={styles.authSpinner} aria-hidden="true" />
                    Guardando...
                  </>
                ) : (
                  "Guardar contraseña"
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
