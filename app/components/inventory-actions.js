"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <div className="inv-actions">
      <a href={`/mi-cuenta/productos/${productId}/editar`} className="inv-btn inv-btn-edit">
        Editar
      </a>
      <button
        className="inv-btn inv-btn-delete"
        onClick={handleDelete}
        disabled={deleting}
      >
        {deleting ? "..." : "Eliminar"}
      </button>
    </div>
  );
}
