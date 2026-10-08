"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import styles from "@/app/categorias/page.module.css";

export default function CatalogSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQ = searchParams.get("q") || "";
  const [value, setValue] = useState(urlQ);
  const lastPushed = useRef(urlQ);

  // Cambio externo (ej. "Limpiar filtros" del sidebar): reflejarlo en el input.
  useEffect(() => {
    if (urlQ !== lastPushed.current) {
      lastPushed.current = urlQ;
      setValue(urlQ);
    }
  }, [urlQ]);

  function push(next) {
    const q = next.trim();
    if (q === lastPushed.current) return;
    lastPushed.current = q;
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set("q", q);
    else params.delete("q");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  // Debounce al escribir; Enter y la X empujan al instante.
  useEffect(() => {
    const t = setTimeout(() => push(value), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <form
      className={styles.cdkSearch}
      role="search"
      onSubmit={(e) => { e.preventDefault(); push(value); }}
    >
      <Search size={18} aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar productos, proveedores o referencias"
        aria-label="Buscar productos"
        maxLength={100}
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          className={styles.cdkSearchClear}
          aria-label="Borrar búsqueda"
          onClick={() => { setValue(""); push(""); }}
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </form>
  );
}
