"use client";

import styles from "./confirm-popup.module.css";

export default function ConfirmPopup({ open, title, message, confirmLabel = "Confirmar", danger = true, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        {title && <h3 className={styles.title}>{title}</h3>}
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button type="button" className={danger ? styles.dangerBtn : styles.primaryBtn} onClick={onConfirm}>
            {confirmLabel}
          </button>
          <button type="button" className={styles.ghostBtn} onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
