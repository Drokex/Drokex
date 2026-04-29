"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildMarketPrice,
  COUNTRY_PREFERENCE_STORAGE_KEY,
  getMarketConfig,
} from "@/lib/market-pricing";

export default function MarketPrice({
  priceValue,
  previousPriceValue,
  baseCurrency,
  originCountry,
  className = "",
  showOriginal = true,
}) {
  const [selectedCountryId, setSelectedCountryId] = useState("");

  useEffect(() => {
    function syncCountry() {
      const storedCountry = window.localStorage.getItem(COUNTRY_PREFERENCE_STORAGE_KEY) || "";
      setSelectedCountryId(storedCountry);
    }

    function handleCountryChange(event) {
      setSelectedCountryId(event?.detail || "");
    }

    syncCountry();
    window.addEventListener("storage", syncCountry);
    window.addEventListener("drokex-country-change", handleCountryChange);

    return () => {
      window.removeEventListener("storage", syncCountry);
      window.removeEventListener("drokex-country-change", handleCountryChange);
    };
  }, []);

  const pricing = useMemo(
    () =>
      buildMarketPrice({
        amount: priceValue,
        previousAmount: previousPriceValue,
        baseCurrency,
        selectedCountryId,
        originCountry,
      }),
    [baseCurrency, originCountry, previousPriceValue, priceValue, selectedCountryId],
  );

  const market = getMarketConfig(selectedCountryId);

  return (
    <div className={className}>
      <strong>{pricing.displayPrice}</strong>
      {pricing.displayPreviousPrice ? <small>{pricing.displayPreviousPrice}</small> : null}
      <span className="market-price-note">{pricing.note}</span>
      {showOriginal ? (
        <span className="market-price-origin">
          {pricing.shouldConvert
            ? `${market.flag} ${pricing.originNote}`
            : `${pricing.originNote} · ${pricing.basePrice}`}
        </span>
      ) : null}
    </div>
  );
}
