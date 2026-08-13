"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "drokex-cookie-consent-v1";
const COOKIE_NAME = "drokex_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(!window.localStorage.getItem(STORAGE_KEY));
    } catch {
      setVisible(true);
    }
  }, []);

  function saveConsent(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
      document.cookie = `${COOKIE_NAME}=${value}; Max-Age=31536000; Path=/; SameSite=Lax`;
    } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <section className="cookie-consent" aria-label="Aviso de cookies">
      <div>
        <p className="cookie-consent__eyebrow">Privacidad Drokex</p>
        <h2>Usamos cookies para que la experiencia funcione mejor.</h2>
        <p>
          Guardamos preferencias esenciales como acceso, país, sesión y ajustes de la plataforma. También podemos usar
          medición anónima para mejorar rendimiento y estabilidad.
        </p>
      </div>
      <div className="cookie-consent__actions">
        <button type="button" className="cookie-consent__secondary" onClick={() => saveConsent("necessary")}>
          Solo necesarias
        </button>
        <button type="button" className="cookie-consent__primary" onClick={() => saveConsent("accepted")}>
          Aceptar cookies
        </button>
      </div>
    </section>
  );
}
