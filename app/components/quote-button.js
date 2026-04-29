"use client";

import { useState } from "react";
import QuoteForm from "@/app/components/quote-form";

export default function QuoteButton({ productId, productName }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="quote-cta-btn" onClick={() => setOpen(true)}>
        Cotizar producto
      </button>

      {open && (
        <div className="qf-overlay" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="qf-modal">
            <button className="qf-close" onClick={() => setOpen(false)} aria-label="Cerrar">×</button>
            <QuoteForm productId={productId} productName={productName} onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
