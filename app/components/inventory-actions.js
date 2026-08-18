"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "@/app/mi-cuenta/productos/inventario/inventory.module.css";

export default function InventoryActions({ productId }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    setConfirming(false);
    setDeleting(true);
    await fetch(`/api/products/${productId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className={styles.invActions}>
      <a href={`/mi-cuenta/productos/${productId}/editar`} className={`${styles.invBtn} ${styles.invBtnEdit}`}>
        Editar
      </a>
      <button
        className={`${styles.invBtn} ${styles.invBtnDelete}`}
        onClick={() => setConfirming(true)}
        disabled={deleting}
      >
        {deleting ? "..." : "Eliminar"}
      </button>

      {confirming && (
        <div className={styles.invConfirmOverlay} onClick={() => setConfirming(false)}>
          <div className={styles.invConfirmCard} onClick={(e) => e.stopPropagation()}>
            <p className={styles.invConfirmTitle}>¿Eliminar este producto?</p>
            <p className={styles.invConfirmDesc}>Esta acción no se puede deshacer.</p>
            <div className={styles.invConfirmActions}>
              <button className={styles.invConfirmCancel} onClick={() => setConfirming(false)}>Cancelar</button>
              <button className={styles.invConfirmDelete} onClick={handleDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
