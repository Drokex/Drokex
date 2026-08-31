"use client";

import { useEffect, useState } from "react";
import styles from "@/app/categorias/page.module.css";

const STORAGE_KEY = "drokex_favoritos";

function readFavoritos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export default function CatalogHeart({ slug, onToggle }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (slug) setLiked(readFavoritos().includes(slug));
  }, [slug]);

  function toggle(e) {
    e.preventDefault();
    if (!slug) return setLiked((prev) => !prev);

    const favoritos = readFavoritos();
    const nowLiked = !favoritos.includes(slug);
    const updated = nowLiked
      ? [...favoritos, slug]
      : favoritos.filter((s) => s !== slug);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setLiked(nowLiked);
    onToggle?.(nowLiked);
  }

  return (
    <button
      className={styles.cdkHeart}
      aria-label="Guardar"
      onClick={toggle}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: liked ? "#ef4444" : undefined }}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
  );
}
