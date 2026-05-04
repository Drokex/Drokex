"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const COUNTRY_PREFERENCE_STORAGE_KEY = "drokex-selected-country";

const globalMarkets = [
  { id: "ni", label: "Nicaragua", flag: "🇳🇮" },
  { id: "hn", label: "Honduras", flag: "🇭🇳" },
  { id: "gt", label: "Guatemala", flag: "🇬🇹" },
  { id: "sv", label: "El Salvador", flag: "🇸🇻" },
  { id: "do", label: "República Dominicana", flag: "🇩🇴" },
  { id: "co", label: "Colombia", flag: "🇨🇴" },
  { id: "pe", label: "Perú", flag: "🇵🇪" },
  { id: "mx", label: "México", flag: "🇲🇽" },
];

export default function CountryEntryGate({ children }) {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const savedCountry = window.localStorage.getItem(COUNTRY_PREFERENCE_STORAGE_KEY) || "";
    const isAvailableCountry = globalMarkets.some((market) => market.id === savedCountry);

    if (isAvailableCountry) {
      setSelectedCountry(savedCountry);
      setHasEntered(true);
    }
  }, []);

  function handleCountryContinue() {
    if (!selectedCountry) return;

    window.localStorage.setItem(COUNTRY_PREFERENCE_STORAGE_KEY, selectedCountry);
    window.dispatchEvent(new CustomEvent("drokex-country-change", { detail: selectedCountry }));
    setHasEntered(true);
  }

  if (hasEntered) {
    return children;
  }

  return (
    <main className="country-entry-page">
      <section
        className="country-entry-shell"
        style={{ backgroundImage: 'url("/country-entry-bg.png")' }}
      >
        <div className="country-entry-overlay" />

        <div className="country-entry-card">
          <Image
            src="/logo.png"
            alt="Drokex"
            width={220}
            height={110}
            className="country-entry-logo"
            style={{ height: "auto" }}
            priority
          />
          <p className="section-tag section-tag-green">Marketplace internacional</p>
          <h1>¿En qué país te encuentras?</h1>
          <p>
            Selecciona tu mercado para mostrarte la entrada comercial, oportunidades y contenido
            más cercano a tu operación.
          </p>

          <div className="country-entry-options" role="list" aria-label="Países disponibles">
            {globalMarkets.map((market) => (
              <button
                key={market.id}
                type="button"
                className={
                  selectedCountry === market.id
                    ? "country-entry-option is-active"
                    : "country-entry-option"
                }
                onClick={() => setSelectedCountry(market.id)}
              >
                <span aria-hidden="true">{market.flag}</span>
                <strong>{market.label}</strong>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="country-entry-cta"
            disabled={!selectedCountry}
            onClick={handleCountryContinue}
          >
            Entrar a Drokex
          </button>
        </div>
      </section>
    </main>
  );
}
