"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import LogoutButton from "@/app/components/logout-button";
import { shouldClearSession } from "@/lib/session-status";

const COUNTRY_PREFERENCE_STORAGE_KEY = "drokex-selected-country";
const LANG_KEY = "drokex-lang";
const EN_COUNTRIES = new Set(["us", "ca"]);
const marketFlags = {
  ni: "🇳🇮",
  hn: "🇭🇳",
  gt: "🇬🇹",
  sv: "🇸🇻",
  do: "🇩🇴",
  co: "🇨🇴",
  pe: "🇵🇪",
  mx: "🇲🇽",
  us: "🇺🇸",
  ca: "🇨🇦",
};
const marketLabels = {
  ni: "Nicaragua",
  hn: "Honduras",
  gt: "Guatemala",
  sv: "El Salvador",
  do: "República Dominicana",
  co: "Colombia",
  pe: "Perú",
  mx: "México",
  us: "United States",
  ca: "Canada",
};

const menuItemsEs = [
  { label: "Productos", href: "/productos" },
  { label: "Directorio", href: "/directorio" },
  { label: "Para proveedores", href: "/para-proveedores" },
  { label: "Servicios", submenu: [{ label: "Proveedor", href: "/servicios/proveedor" }, { label: "Cliente", href: "/servicios/cliente" }] },
  { label: "Sobre nosotros", href: "/sobre-nosotros" },
  { label: "Ayuda / PQR", href: "/ayuda" },
  { label: "Home V1", href: "/home-v1" },
];
const menuItemsEn = [
  { label: "Products", href: "/productos" },
  { label: "Directory", href: "/directorio" },
  { label: "For suppliers", href: "/para-proveedores" },
  { label: "Services", submenu: [{ label: "Supplier", href: "/servicios/proveedor" }, { label: "Buyer", href: "/servicios/cliente" }] },
  { label: "About us", href: "/sobre-nosotros" },
  { label: "Help / PQR", href: "/ayuda" },
  { label: "Home V1", href: "/home-v1" },
];

function NavDropdown({ item }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="nav-dropdown-wrap" ref={ref}>
      <button
        className="nav-dropdown-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {item.label}
        <span className={open ? "nav-dropdown-chevron is-open" : "nav-dropdown-chevron"}>▾</span>
      </button>
      {open && (
        <div className="nav-dropdown-menu">
          {item.submenu.map((sub) => (
            <Link key={sub.href} href={sub.href} className="nav-dropdown-link" onClick={() => setOpen(false)}>
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileNavPanel({ items, top, onClose, panelRef, sessionChecked, user, accountLink, lang }) {
  const [openSub, setOpenSub] = useState(null);

  return (
    <div
      id="mobile-nav-panel"
      className="mobile-nav-panel"
      style={{ top }}
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
    >
      {items.map((item) =>
        item.submenu ? (
          <div key={item.label} className="mobile-nav-group">
            <button
              type="button"
              className="mobile-nav-toggle"
              onClick={() => setOpenSub((v) => (v === item.label ? null : item.label))}
              aria-expanded={openSub === item.label}
            >
              {item.label}
              <span className={openSub === item.label ? "nav-dropdown-chevron is-open" : "nav-dropdown-chevron"}>▾</span>
            </button>
            {openSub === item.label && (
              <div className="mobile-nav-submenu">
                {item.submenu.map((sub) => (
                  <Link key={sub.href} href={sub.href} className="mobile-nav-link" onClick={onClose}>
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Link key={item.label} href={item.href} className="mobile-nav-link" onClick={onClose}>
            {item.label}
          </Link>
        )
      )}
      <div className="mobile-nav-session-actions">
        {!sessionChecked ? null : user ? (
          <>
            <Link href={accountLink} className="mobile-nav-account-link" onClick={onClose}>
              <span
                className="header-account-avatar"
                aria-hidden="true"
                style={{ background: user.role === "CUSTOMER" ? "var(--orange)" : "var(--lime)" }}
              >
                {(user.fullName || "?").charAt(0).toUpperCase()}
              </span>
              {user.fullName || (lang === "en" ? "My account" : "Mi cuenta")}
            </Link>
            <Link href="/favoritos" className="mobile-nav-link" onClick={onClose}>
              {lang === "en" ? "My favorites" : "Mis favoritos"}
            </Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login" className="mobile-nav-login-link" onClick={onClose}>
              {lang === "en" ? "Sign in" : "Iniciar sesión"}
            </Link>
            <Link href="/registro" className="mobile-nav-register-link" onClick={onClose}>
              {lang === "en" ? "Sign up" : "Registrate"}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function SiteHeader({ hideCountry = false }) {
  const [user, setUser] = useState(null);
  // Hasta que /api/account responda no sabemos si hay sesión. Pintar
  // "Iniciar sesión" mientras tanto provoca un parpadeo en cada carga.
  const [sessionChecked, setSessionChecked] = useState(false);
  const [accountLink, setAccountLink] = useState("/mi-cuenta");
  const [countryFlag, setCountryFlag] = useState("");
  const [countryLabel, setCountryLabel] = useState("");
  const [isCountryDialogOpen, setIsCountryDialogOpen] = useState(false);
  const [lang, setLang] = useState("es");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [panelTop, setPanelTop] = useState(0);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const headerRef = useRef(null);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);
  const accountMenuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (!accountMenuRef.current?.contains(e.target)) setShowAccountMenu(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    const returnFocusElement = toggleRef.current;
    document.body.style.overflow = "hidden";

    function updateTop() {
      if (headerRef.current) setPanelTop(headerRef.current.offsetHeight);
    }
    updateTop();
    const focusPanel = window.requestAnimationFrame(() => {
      panelRef.current?.querySelector("a[href], button:not([disabled])")?.focus();
    });

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = Array.from(
        panelRef.current?.querySelectorAll('a[href], button:not([disabled])') || [],
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    function handleResize() {
      if (window.innerWidth > 1023) setMobileOpen(false);
      else updateTop();
    }
    function handleClickOutside(e) {
      if (panelRef.current?.contains(e.target)) return;
      if (toggleRef.current?.contains(e.target)) return;
      setMobileOpen(false);
    }

    window.addEventListener("resize", handleResize);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(focusPanel);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      returnFocusElement?.focus();
    };
  }, [mobileOpen]);

  function handleCountryFlagClick() {
    setIsCountryDialogOpen(true);
  }

  function handleCountryDialogClose() {
    setIsCountryDialogOpen(false);
  }

  function handleCountryChangeConfirm() {
    window.localStorage.removeItem(COUNTRY_PREFERENCE_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("drokex-country-change", { detail: "" }));
    window.location.href = "/";
  }

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      try {
        const response = await fetch("/api/account", {
          credentials: "include",
          cache: "no-store",
        });

        if (!isMounted) return;

        if (!response.ok) {
          if (shouldClearSession(response.status)) {
            setUser(null);
            setSessionChecked(true);
          }
          return;
        }

        const payload = await response.json();
        setUser(payload.user ?? null);
        setSessionChecked(true);
        setAccountLink(
          payload.user?.role === "ADMIN"
            ? "/admin"
            : payload.session?.audience === "cliente" || payload.user?.role === "CUSTOMER"
              ? "/mi-cuenta?role=cliente"
              : "/mi-cuenta?role=proveedor",
        );
      } catch {
        // fallo de red/DB transitorio — no es logout, no tocar el estado.
      }
    }

    loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    function syncCountryFlag() {
      const countryId = window.localStorage.getItem(COUNTRY_PREFERENCE_STORAGE_KEY) || "";
      setCountryFlag(marketFlags[countryId] || "");
      setCountryLabel(marketLabels[countryId] || "");
      setLang(EN_COUNTRIES.has(countryId) ? "en" : "es");
    }

    function handleCountryChange(event) {
      const nextCountryId = event?.detail || "";
      setCountryFlag(marketFlags[nextCountryId] || "");
      setCountryLabel(marketLabels[nextCountryId] || "");
      setLang(EN_COUNTRIES.has(nextCountryId) ? "en" : "es");
    }

    syncCountryFlag();
    window.addEventListener("storage", syncCountryFlag);
    window.addEventListener("drokex-country-change", handleCountryChange);

    return () => {
      window.removeEventListener("storage", syncCountryFlag);
      window.removeEventListener("drokex-country-change", handleCountryChange);
    };
  }, []);

  const menuItems = lang === "en" ? menuItemsEn : menuItemsEs;

  return (
    <header className="site-header" ref={headerRef}>
      <div className="shell header-row">
        <Link href="/" className="brand-link" aria-label="Drokex">
          <Image
            src="/logo.png"
            alt="Drokex"
            width={203}
            height={102}
            priority
            className="brand-image"
            style={{ height: "auto" }}
          />
        </Link>

        <nav className="main-nav" aria-label="Principal">
          {menuItems.map((item) =>
            item.submenu ? (
              <NavDropdown key={item.label} item={item} />
            ) : (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="header-actions">
          {countryFlag && !hideCountry ? (
            <button
              type="button"
              className="header-country-trigger"
              onClick={handleCountryFlagClick}
              aria-label={lang === "en" ? "Change country" : "Cambiar país"}
              title={lang === "en" ? "Change country" : "Cambiar país"}
            >
              <span className="header-country-flag" aria-hidden="true">
                {countryFlag}
              </span>
            </button>
          ) : null}

          {!sessionChecked ? (
            // Espacio reservado: evita el salto "Iniciar sesión" → nombre del usuario.
            <span className="header-session-placeholder" aria-hidden="true" />
          ) : user ? (
            <div className="nav-dropdown-wrap" ref={accountMenuRef}>
              <button
                type="button"
                className="header-account-link"
                onClick={() => setShowAccountMenu((v) => !v)}
                aria-expanded={showAccountMenu}
              >
                <span
                  className="header-account-avatar"
                  aria-hidden="true"
                  style={{ background: user.role === "CUSTOMER" ? "var(--orange)" : "var(--lime)" }}
                >
                  {(user.fullName || "?").charAt(0).toUpperCase()}
                </span>
                <span className="header-user-name">{user.fullName || (lang === "en" ? "My account" : "Mi cuenta")}</span>
                <span className={showAccountMenu ? "nav-dropdown-chevron is-open" : "nav-dropdown-chevron"}>▾</span>
              </button>
              {showAccountMenu && (
                <div className="nav-dropdown-menu header-account-menu">
                  <Link href={accountLink} className="nav-dropdown-link" onClick={() => setShowAccountMenu(false)}>
                    {lang === "en" ? "My account" : "Mi cuenta"}
                  </Link>
                  <Link href="/favoritos" className="nav-dropdown-link" onClick={() => setShowAccountMenu(false)}>
                    {lang === "en" ? "My favorites" : "Mis favoritos"}
                  </Link>
                  <div className="nav-dropdown-logout">
                    <LogoutButton />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-link">
                {lang === "en" ? "Sign in" : "Iniciar sesión"}
              </Link>
              <Link href="/registro" className="primary-button">
                {lang === "en" ? "Sign up" : "Registrate"}
              </Link>
            </>
          )}

          <button
            type="button"
            className="mobile-menu-trigger"
            ref={toggleRef}
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            aria-label={mobileOpen ? (lang === "en" ? "Close menu" : "Cerrar menú") : (lang === "en" ? "Open menu" : "Abrir menú")}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && typeof document !== "undefined"
        ? createPortal(
            <MobileNavPanel
              items={menuItems}
              top={panelTop}
              onClose={() => setMobileOpen(false)}
              panelRef={panelRef}
              sessionChecked={sessionChecked}
              user={user}
              accountLink={accountLink}
              lang={lang}
            />,
            document.body
          )
        : null}

      {isCountryDialogOpen ? (
        <div className="header-country-modal-backdrop" onClick={handleCountryDialogClose}>
          <div
            className="header-country-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="change-country-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="header-country-modal-chip">
              <span className="header-country-modal-flag" aria-hidden="true">{countryFlag}</span>
              <span>{countryLabel || (lang === "en" ? "Your current market" : "Tu mercado actual")}</span>
            </div>
            <h3 id="change-country-title">
              {lang === "en" ? "Want to change your country?" : "¿Quieres cambiar de país?"}
            </h3>
            <p>
              {lang === "en"
                ? "You'll return to the initial selector to choose another market and adapt your Drokex experience."
                : "Volverás al selector inicial para elegir otro mercado y adaptar la experiencia de Drokex a ese país."}
            </p>
            <div className="header-country-modal-actions">
              <button type="button" className="header-country-modal-secondary" onClick={handleCountryDialogClose}>
                {lang === "en" ? "Cancel" : "Cancelar"}
              </button>
              <button type="button" className="header-country-modal-primary" onClick={handleCountryChangeConfirm}>
                {lang === "en" ? "Yes, change" : "Sí, cambiar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
