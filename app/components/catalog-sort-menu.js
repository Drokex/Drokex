"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "@/app/categorias/page.module.css";

const OPTIONS = [
  { value: "", label: "Más relevantes" },
  { value: "recientes", label: "Más recientes" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
  { value: "nombre", label: "Nombre A-Z" },
];

export default function CatalogSortMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const current = searchParams.get("orden") || "";
  const currentLabel = OPTIONS.find(o => o.value === current)?.label || OPTIONS[0].label;

  useEffect(() => {
    if (!isOpen) return;
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isOpen]);

  function select(value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("orden", value);
    else params.delete("orden");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  }

  return (
    <div ref={ref} className={styles.cdkSortWrap}>
      <button type="button" className={styles.cdkSortBtn} aria-haspopup="listbox" aria-expanded={isOpen} onClick={() => setIsOpen(o => !o)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        {currentLabel}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {isOpen && (
        <ul className={styles.cdkSortMenu} role="listbox">
          {OPTIONS.map(o => (
            <li key={o.value || "relevancia"}>
              <button
                type="button"
                role="option"
                aria-selected={current === o.value}
                className={`${styles.cdkSortOption}${current === o.value ? ` ${styles.cdkSortOptionActive}` : ""}`}
                onClick={() => select(o.value)}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
