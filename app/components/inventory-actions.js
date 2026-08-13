"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "@/app/mi-cuenta/productos/inventario/inventory.module.css";

export default function InventoryActions({ productId }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return;
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
        onClick={handleDelete}
        disabled={deleting}
      >
        {deleting ? "..." : "Eliminar"}
      </button>
    </div>
  );
}
