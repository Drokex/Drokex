"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const COUNTRY_PREFERENCE_STORAGE_KEY = "drokex-selected-country";

const globalMarkets = [
  { id: "ni", label: "Nicaragua",            flag: "🇳🇮", lang: "es" },
  { id: "hn", label: "Honduras",             flag: "🇭🇳", lang: "es" },
  { id: "gt", label: "Guatemala",            flag: "🇬🇹", lang: "es" },
  { id: "sv", label: "El Salvador",          flag: "🇸🇻", lang: "es" },
  { id: "do", label: "República Dominicana", flag: "🇩🇴", lang: "es" },
  { id: "co", label: "Colombia",             flag: "🇨🇴", lang: "es" },
  { id: "pe", label: "Perú",                 flag: "🇵🇪", lang: "es" },
  { id: "mx", label: "México",               flag: "🇲🇽", lang: "es" },
  { id: "us", label: "United States",        flag: "🇺🇸", lang: "en" },
  { id: "ca", label: "Canada",               flag: "🇨🇦", lang: "en" },
];

const LANG_KEY = "drokex-lang";

const copy = {
  es: {
    tag: "Marketplace internacional",
    title: "¿En qué país te encuentras?",
    subtitle: "Selecciona tu mercado para mostrarte la entrada comercial, oportunidades y contenido más cercano a tu operación.",
    cta: "Entrar a Drokex",
  },
  en: {
    tag: "International Marketplace",
    title: "Where are you located?",
    subtitle: "Select your market so we can show you the most relevant business opportunities and content for your region.",
    cta: "Enter Drokex",
  },
};

export default function CountryEntryGate({ children }) {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [hasEntered, setHasEntered] = useState(false);

  const selectedMarket = globalMarkets.find(m => m.id === selectedCountry);
  const lang = selectedMarket?.lang || "es";
  const t = copy[lang];

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
    const market = globalMarkets.find(m => m.id === selectedCountry);
    window.localStorage.setItem(COUNTRY_PREFERENCE_STORAGE_KEY, selectedCountry);
    window.localStorage.setItem(LANG_KEY, market?.lang || "es");
    window.dispatchEvent(new CustomEvent("drokex-country-change", { detail: selectedCountry }));
    window.dispatchEvent(new CustomEvent("drokex-lang-change", { detail: market?.lang || "es" }));
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
          <p className="section-tag section-tag-green">{t.tag}</p>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>

          <div className="country-entry-options" role="list" aria-label="Available markets">
            {globalMarkets.map((market) => (
              <button
                key={market.id}
                type="button"
                className={selectedCountry === market.id ? "country-entry-option is-active" : "country-entry-option"}
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
            {t.cta}
          </button>
        </div>
      </section>
    </main>
  );
}
