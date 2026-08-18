"use client";

import { useCallback, useEffect, useState } from "react";

const THEME_KEY = "drokex-theme";
const THEME_EVENT = "drokex-theme-change";

export function applyGlobalTheme(theme) {
  const next = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  document.documentElement.style.colorScheme = next;
  localStorage.setItem(THEME_KEY, next);
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: next }));
}

export function useGlobalTheme() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const sync = (next) => setTheme(next === "light" ? "light" : "dark");
    const stored = localStorage.getItem(THEME_KEY);
    const initial = stored === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = initial;
    document.documentElement.style.colorScheme = initial;
    sync(initial);

    const onThemeChange = (event) => sync(event.detail);
    const onStorage = (event) => {
      if (event.key === THEME_KEY) sync(event.newValue);
    };
    window.addEventListener(THEME_EVENT, onThemeChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(THEME_EVENT, onThemeChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const toggleTheme = useCallback(() => applyGlobalTheme(theme === "dark" ? "light" : "dark"), [theme]);
  return [theme, toggleTheme];
}

export default function GlobalTheme() {
  useGlobalTheme();
  return null;
}
