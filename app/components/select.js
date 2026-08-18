"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./select.module.css";

export default function Select({ value, onChange, options, placeholder = "Selecciona", onCreate, createLabel = "Crear nueva" }) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newValue, setNewValue] = useState("");
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
        setCreating(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (creating) inputRef.current?.focus();
  }, [creating]);

  function confirmCreate() {
    const v = newValue.trim();
    if (v) {
      onCreate(v);
      onChange(v);
    }
    setNewValue("");
    setCreating(false);
    setOpen(false);
  }

  return (
    <div className={styles.selectRoot} ref={rootRef}>
      <button
        type="button"
        className={styles.selectTrigger}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{value || placeholder}</span>
        <svg className={open ? `${styles.selectChevron} ${styles.isOpen}` : styles.selectChevron} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className={styles.selectPanel} role="listbox">
          {onCreate && (
            creating ? (
              <div className={styles.selectCreateRow}>
                <input
                  ref={inputRef}
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); confirmCreate(); }
                    if (e.key === "Escape") setCreating(false);
                  }}
                  placeholder="Nombre de la categoría"
                  className={styles.selectCreateInput}
                />
                <button type="button" className={styles.selectCreateConfirm} onClick={confirmCreate}>Añadir</button>
              </div>
            ) : (
              <button type="button" className={styles.selectCreateBtn} onClick={() => setCreating(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                {createLabel}
              </button>
            )
          )}

          {options.map((opt) => (
            <button
              type="button"
              key={opt}
              role="option"
              aria-selected={opt === value}
              className={opt === value ? `${styles.selectOption} ${styles.isSelected}` : styles.selectOption}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
