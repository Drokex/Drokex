"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const BANNERS = [
  { src: "/popup-geu.png", alt: "GEU — Resistencia que perdura. Soluciones en caucho para cada industria" },
  { src: "/popup-kliniu.png", alt: "Kliniu — Higiene que se siente, calidad que se nota" },
  { src: "/popup-totalpars.png", alt: "TotalPars — Compatibles con tu ruta. Repuestos para vehículos de carga" },
  { src: "/popup-lego.png", alt: "LEGO — Construye tu mundo. Imagina. Crea. Juega." },
];

// Se elige tras montar (no en el render del servidor) para no romper la hidratación.
export default function SidebarAd() {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    setBanner(BANNERS[Math.floor(Math.random() * BANNERS.length)]);
  }, []);

  if (!banner) return null;

  return (
    <div className="catalog-banner">
      <Image
        src={banner.src}
        alt={banner.alt}
        width={300}
        height={600}
        sizes="280px"
        className="catalog-banner__image"
      />
    </div>
  );
}
