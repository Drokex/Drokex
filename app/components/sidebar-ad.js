"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Fallback si /api/banners?slot=sidebar falla o aún no hay banners en BD.
const FALLBACK_BANNERS = [
  { src: "/popup-geu.png", alt: "GEU — Resistencia que perdura. Soluciones en caucho para cada industria" },
  { src: "/popup-kliniu.png", alt: "Kliniu — Higiene que se siente, calidad que se nota" },
];

// Se elige tras montar (no en el render del servidor) para no romper la hidratación.
export default function SidebarAd() {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    fetch("/api/banners?slot=sidebar")
      .then((r) => r.json())
      .then((data) => {
        const pool = data.banners?.length
          ? data.banners.map((b) => ({ src: b.imageUrl, alt: b.alt }))
          : FALLBACK_BANNERS;
        setBanner(pool[Math.floor(Math.random() * pool.length)]);
      })
      .catch(() => {
        setBanner(FALLBACK_BANNERS[Math.floor(Math.random() * FALLBACK_BANNERS.length)]);
      });
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
