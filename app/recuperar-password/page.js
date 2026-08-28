"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import SiteHeader from "@/app/components/site-header";
import styles from "@/app/components/auth-account.module.css";

export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState("neutral");

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const payload = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setTone("error");
      setMessage(payload.error || "No fue posible procesar la solicitud.");
      return;
    }

    setTone("success");
    setMessage(payload.message || "Si el correo existe en Drokex, te enviamos un enlace.");
  }

  return (
    <main className="commerce-page">
      <SiteHeader />
      <section className={`${styles.authShell} shell`}>
        <div className={styles.authCard}>
          <div className={styles.authCardTop}>
            <div>
              <p className="section-tag">Acceso Drokex</p>
              <h1>Recupera tu contraseña</h1>
              <p className={styles.authCopy}>
                Ingresa tu correo y te enviamos un enlace para crear una nueva contraseña.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <label>
              <span>Correo electrónico</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="correo@empresa.com"
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
                    Enviando...
                  </>
                ) : (
                  "Enviar enlace"
                )}
              </button>
              <Link href="/login" className={`secondary-button secondary-button-dark ${styles.authSecondaryButton} ${styles.isProvider}`}>
                Volver a iniciar sesión
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
