"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const FALLBACK = { src: "/banner-lego-dragon.png", alt: "LEGO — Cada pieza despierta una aventura", width: 2400, height: 800 };

export default function HomeBanner({ className }) {
  const [banner, setBanner] = useState(FALLBACK);

  useEffect(() => {
    fetch("/api/banners?slot=home")
      .then((r) => r.json())
      .then((data) => {
        if (data.banners?.length) {
          const b = data.banners[0];
          setBanner({ src: b.imageUrl, alt: b.alt, width: b.width, height: b.height });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <Image
      src={banner.src}
      alt={banner.alt}
      width={banner.width}
      height={banner.height}
      sizes="(max-width: 1200px) 100vw, 1200px"
      className={className}
      priority={false}
    />
  );
}
