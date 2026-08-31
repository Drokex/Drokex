"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CatalogHeart from "@/app/components/catalog-heart";
import styles from "@/app/categorias/page.module.css";

const STORAGE_KEY = "drokex_favoritos";

const COUNTRY_FLAG = {
  Nicaragua: "🇳🇮", Colombia: "🇨🇴", China: "🇨🇳",
  "Turquía": "🇹🇷", Turquia: "🇹🇷", "Estados Unidos": "🇺🇸",
  Mexico: "🇲🇽", Brasil: "🇧🇷", Peru: "🇵🇪",
};

function getInventoryLabel(state) {
  if (state === "out-of-stock") return "Agotado";
  if (state === "low-stock") return "Stock bajo";
  return "Disponible";
}

export default function FavoritosGrid({ products }) {
  const [favSlugs, setFavSlugs] = useState(null);

  useEffect(() => {
    try {
      setFavSlugs(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []);
    } catch {
      setFavSlugs([]);
    }
  }, []);

  if (favSlugs === null) return null;

  const favoritos = products.filter((p) => favSlugs.includes(p.slug));

  if (favoritos.length === 0) {
    return (
      <div className={styles.cdkNoResults}>
        <p>Aún no has guardado productos como favoritos.</p>
        <Link href="/productos" className={styles.cdkBtnPrimary}>Explorar productos</Link>
      </div>
    );
  }

  return (
    <div className={styles.cdkGrid}>
      {favoritos.map((product) => {
        const flag = COUNTRY_FLAG[product.originCountry] || "";
        return (
          <article key={product.slug} className={styles.cdkCard}>
            <div className={styles.cdkCardImageWrap} style={{ position: "relative" }}>
              <Link href={`/producto/${product.slug}`} style={{ position: "absolute", inset: 0, display: "block" }}>
                <img src={product.image} alt={product.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              </Link>
              <CatalogHeart
                slug={product.slug}
                onToggle={(nowLiked) => {
                  if (!nowLiked) setFavSlugs((prev) => prev.filter((s) => s !== product.slug));
                }}
              />
            </div>
            <div className={styles.cdkCardBody}>
              <div className={styles.cdkCardSupplierRow}>
                <span className={styles.cdkCardSupplier}>{product.supplier}</span>
                <span className={styles.cdkCardOrigin}>{flag} {product.originCountry}</span>
              </div>
              <h2 className={styles.cdkCardName}><Link href={`/producto/${product.slug}`}>{product.name}</Link></h2>
              <div className={styles.cdkCardTags}>
                <span>{product.category}</span>
                <span>{product.availability}</span>
                <span>{getInventoryLabel(product.inventoryState)}</span>
              </div>
              <div className={styles.cdkCardBtns}>
                <Link href={`/producto/${product.slug}`} className={styles.cdkBtnPrimary}>
                  Ver producto
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
