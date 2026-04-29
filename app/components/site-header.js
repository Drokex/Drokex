"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LogoutButton from "@/app/components/logout-button";

const COUNTRY_PREFERENCE_STORAGE_KEY = "drokex-selected-country";
const marketFlags = {
  mx: "🇲🇽",
  co: "🇨🇴",
  gt: "🇬🇹",
  cu: "🇨🇺",
  hn: "🇭🇳",
};
const marketLabels = {
  mx: "Mexico",
  co: "Colombia",
  gt: "Guatemala",
  cu: "Cuba",
  hn: "Honduras",
};

const menuItems = [
  { label: "Portal", href: "/portal" },
  { label: "Productos", href: "/productos" },
  { label: "Directorio", href: "/directorio" },
  {
    label: "Servicios",
    submenu: [
      { label: "Proveedor", href: "/servicios/proveedor" },
      { label: "Cliente", href: "/servicios/cliente" },
    ],
  },
  { label: "Aprende", href: "/aprende" },
  { label: "Sobre nosotros", href: "/sobre-nosotros" },
  { label: "Contacto", href: "/#contacto" },
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

export default function SiteHeader() {
  const [user, setUser] = useState(null);
  const [accountLink, setAccountLink] = useState("/mi-cuenta");
  const [countryFlag, setCountryFlag] = useState("");
  const [countryLabel, setCountryLabel] = useState("");
  const [isCountryDialogOpen, setIsCountryDialogOpen] = useState(false);

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
          setUser(null);
          return;
        }

        const payload = await response.json();
        setUser(payload.user ?? null);
        setAccountLink(
          payload.user?.role === "ADMIN"
            ? "/admin"
            : payload.session?.audience === "cliente" || payload.user?.role === "CUSTOMER"
              ? "/mi-cuenta?role=cliente"
              : "/mi-cuenta?role=proveedor",
        );
      } catch {
        if (isMounted) {
          setUser(null);
          setAccountLink("/mi-cuenta");
        }
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
    }

    function handleCountryChange(event) {
      const nextCountryId = event?.detail || "";
      setCountryFlag(marketFlags[nextCountryId] || "");
      setCountryLabel(marketLabels[nextCountryId] || "");
    }

    syncCountryFlag();
    window.addEventListener("storage", syncCountryFlag);
    window.addEventListener("drokex-country-change", handleCountryChange);

    return () => {
      window.removeEventListener("storage", syncCountryFlag);
      window.removeEventListener("drokex-country-change", handleCountryChange);
    };
  }, []);

  return (
    <header className="site-header">
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
          {countryFlag ? (
            <button
              type="button"
              className="header-country-trigger"
              onClick={handleCountryFlagClick}
              aria-label="Cambiar país"
              title="Cambiar país"
            >
              <span className="header-country-flag" aria-hidden="true">
                {countryFlag}
              </span>
            </button>
          ) : null}

          {user ? (
            <>
              <Link href={accountLink} className="text-link header-account-link">
                Mi cuenta
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-link">
                Iniciar sesión
              </Link>
              <Link href="/registro" className="primary-button">
                Registrate
              </Link>
            </>
          )}
        </div>
      </div>

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
              <span className="header-country-modal-flag" aria-hidden="true">
                {countryFlag}
              </span>
              <span>{countryLabel || "Tu mercado actual"}</span>
            </div>
            <h3 id="change-country-title">¿Quieres cambiar de país?</h3>
            <p>
              Volverás al selector inicial para elegir otro mercado y adaptar la experiencia de
              Drokex a ese país.
            </p>
            <div className="header-country-modal-actions">
              <button
                type="button"
                className="header-country-modal-secondary"
                onClick={handleCountryDialogClose}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="header-country-modal-primary"
                onClick={handleCountryChangeConfirm}
              >
                Sí, cambiar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
