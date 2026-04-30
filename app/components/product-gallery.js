"use client";

import { useState } from "react";

export default function ProductGallery({ gallery, productName }) {
  const [current, setCurrent] = useState(0);
  const [liked, setLiked] = useState(false);

  function prev() {
    setCurrent((c) => (c === 0 ? gallery.length - 1 : c - 1));
  }

  function next() {
    setCurrent((c) => (c === gallery.length - 1 ? 0 : c + 1));
  }

  return (
    <div className="product-gallery-panel">
      <div className="detail-image-main">
        <img
          src={gallery[current]}
          alt={productName}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />

        {gallery.length > 1 && (
          <>
            <button className="gallery-arrow gallery-arrow-prev" onClick={prev} aria-label="Anterior">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button className="gallery-arrow gallery-arrow-next" onClick={next} aria-label="Siguiente">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            <span className="gallery-counter">{current + 1} / {gallery.length}</span>
          </>
        )}

        <button
          className={`gallery-heart${liked ? " gallery-heart--active" : ""}`}
          onClick={() => setLiked((l) => !l)}
          aria-label="Guardar en favoritos"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>

        {gallery[0] && (
          <span className="gallery-novelos-tag">NOVELOS</span>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="detail-thumb-row">
          {gallery.map((img, i) => (
            <button
              key={i}
              className={`detail-thumb-btn${i === current ? " detail-thumb-btn--active" : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={`Imagen ${i + 1}`}
            >
              <img src={img} alt={`${productName} ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
