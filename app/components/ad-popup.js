"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";

// width/height marcan la proporción: los hay verticales (300x600) y cuadrados (1080).
const BANNERS = [
  { src: "/popup-geu.png", alt: "GEU — Resistencia que perdura. Soluciones en caucho para cada industria", width: 300, height: 600 },
  { src: "/popup-kliniu.png", alt: "Kliniu — Higiene que se siente, calidad que se nota", width: 300, height: 600 },
  { src: "/popup-totalpars.png", alt: "TotalPars — Compatibles con tu ruta. Repuestos para vehículos de carga", width: 300, height: 600 },
  { src: "/popup-lego.png", alt: "LEGO — Construye tu mundo. Imagina. Crea. Juega.", width: 300, height: 600 },
  { src: "/popup-geu-cuadrado.webp", alt: "GEU — Todo empieza con una buena solución", width: 1080, height: 1080 },
  { src: "/popup-kliniu-cuadrado.webp", alt: "Kliniu — Limpieza profesional para cada necesidad", width: 1080, height: 1080 },
];

// Páginas del menú principal: el popup no aparece en ninguna otra.
const ALLOWED_PATHS = [
  "/productos",
  "/directorio",
  "/para-proveedores",
  "/servicios/proveedor",
  "/servicios/cliente",
  "/sobre-nosotros",
  "/ayuda",
  "/home-v1",
];

// Solo al navegar entre páginas: en la primera carga (entrada al sitio) no aparece.
export default function AdPopup() {
  const pathname = usePathname();
  const [banner, setBanner] = useState(null);
  const [closing, setClosing] = useState(false);
  // Guardamos la ruta de entrada: solo dispara cuando cambia de verdad.
  // (Un flag "primera vez" no vale: en dev los efectos se montan dos veces.)
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (!ALLOWED_PATHS.includes(pathname)) {
      setBanner(null);
      return;
    }
    setBanner(BANNERS[Math.floor(Math.random() * BANNERS.length)]);
  }, [pathname]);

  useEffect(() => {
    if (!banner) return;
    const onKey = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [banner]);

  function close() {
    setClosing(true);
    setTimeout(() => { setBanner(null); setClosing(false); }, 220);
  }

  if (!banner) return null;

  return (
    <div
      className={`ad-popup${closing ? " is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Publicidad"
      onClick={close}
    >
      <div className="ad-popup__card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="ad-popup__close" onClick={close} aria-label="Cerrar publicidad">
          <X size={18} strokeWidth={2.5} aria-hidden="true" />
        </button>
        <Image
          src={banner.src}
          alt={banner.alt}
          width={banner.width}
          height={banner.height}
          sizes="(max-width: 520px) 78vw, 420px"
          loading="eager"
          className={`ad-popup__image${banner.width === banner.height ? " ad-popup__image--wide" : ""}`}
        />
      </div>
    </div>
  );
}
