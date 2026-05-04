export const COUNTRY_PREFERENCE_STORAGE_KEY = "drokex-selected-country";

export const marketConfigs = {
  ni: { id: "ni", label: "Nicaragua", flag: "🇳🇮", currency: "NIO", locale: "es-NI" },
  hn: { id: "hn", label: "Honduras", flag: "🇭🇳", currency: "HNL", locale: "es-HN" },
  gt: { id: "gt", label: "Guatemala", flag: "🇬🇹", currency: "GTQ", locale: "es-GT" },
  sv: { id: "sv", label: "El Salvador", flag: "🇸🇻", currency: "USD", locale: "es-SV" },
  do: { id: "do", label: "República Dominicana", flag: "🇩🇴", currency: "DOP", locale: "es-DO" },
  co: { id: "co", label: "Colombia", flag: "🇨🇴", currency: "COP", locale: "es-CO" },
  pe: { id: "pe", label: "Perú", flag: "🇵🇪", currency: "PEN", locale: "es-PE" },
  mx: { id: "mx", label: "México", flag: "🇲🇽", currency: "MXN", locale: "es-MX" },
};

const defaultMarketId = "co";

const currencyPerOriginCountry = {
  colombia: "COP",
  mexico: "MXN",
  méxico: "MXN",
  nicaragua: "NIO",
  guatemala: "GTQ",
  honduras: "HNL",
  "el salvador": "USD",
  "republica dominicana": "DOP",
  "república dominicana": "DOP",
  peru: "PEN",
  perú: "PEN",
  china: "CNY",
  turquia: "TRY",
  "turquía": "TRY",
  usa: "USD",
  "estados unidos": "USD",
};

const currencyLocales = {
  COP: "es-CO",
  MXN: "es-MX",
  NIO: "es-NI",
  GTQ: "es-GT",
  HNL: "es-HN",
  DOP: "es-DO",
  PEN: "es-PE",
  CNY: "zh-CN",
  TRY: "tr-TR",
  USD: "en-US",
};

const usdRates = {
  USD: 1,
  COP: 3920,
  MXN: 17.1,
  NIO: 36.8,
  GTQ: 7.8,
  HNL: 24.8,
  DOP: 59,
  PEN: 3.7,
  CNY: 7.24,
  TRY: 32.4,
};

function normalizeKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function getMarketConfig(countryId) {
  return marketConfigs[countryId] || marketConfigs[defaultMarketId];
}

export function inferCurrencyFromOriginCountry(originCountry) {
  return currencyPerOriginCountry[normalizeKey(originCountry)] || "USD";
}

export function formatMoney(amount, currency, locale) {
  return new Intl.NumberFormat(locale || currencyLocales[currency] || "es-CO", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
}

export function convertMoney(amount, fromCurrency, toCurrency) {
  const numericAmount = Number(amount || 0);

  if (!numericAmount || fromCurrency === toCurrency) {
    return numericAmount;
  }

  const fromRate = usdRates[fromCurrency];
  const toRate = usdRates[toCurrency];

  if (!fromRate || !toRate) {
    return numericAmount;
  }

  const amountInUsd = numericAmount / fromRate;
  return amountInUsd * toRate;
}

export function buildMarketPrice({
  amount,
  previousAmount,
  baseCurrency,
  selectedCountryId,
  originCountry,
}) {
  const market = getMarketConfig(selectedCountryId);
  const targetCurrency = market.currency;
  const shouldConvert = Boolean(selectedCountryId) && targetCurrency !== baseCurrency;
  const displayAmount = shouldConvert ? convertMoney(amount, baseCurrency, targetCurrency) : amount;
  const displayPreviousAmount =
    previousAmount > 0
      ? shouldConvert
        ? convertMoney(previousAmount, baseCurrency, targetCurrency)
        : previousAmount
      : 0;

  return {
    market,
    baseCurrency,
    displayCurrency: shouldConvert ? targetCurrency : baseCurrency,
    displayPrice: formatMoney(displayAmount, shouldConvert ? targetCurrency : baseCurrency, market.locale),
    displayPreviousPrice: displayPreviousAmount
      ? formatMoney(
          displayPreviousAmount,
          shouldConvert ? targetCurrency : baseCurrency,
          market.locale,
        )
      : "",
    basePrice: formatMoney(amount, baseCurrency),
    basePreviousPrice: previousAmount ? formatMoney(previousAmount, baseCurrency) : "",
    shouldConvert,
    note: shouldConvert
      ? `Precio estimado para ${market.label}`
      : `Precio base del proveedor en ${baseCurrency}`,
    originNote: shouldConvert
      ? `Origen: ${originCountry || "Mercado internacional"} · ${formatMoney(amount, baseCurrency)}`
      : `Origen: ${originCountry || "Mercado internacional"}`,
  };
}
