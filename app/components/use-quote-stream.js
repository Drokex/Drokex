"use client";

import { useEffect } from "react";

export function useQuoteStream(onUpdate) {
  useEffect(() => {
    const es = new EventSource("/api/quotes/stream");

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type !== "connected") onUpdate(data);
      } catch {}
    };

    es.onerror = () => es.close();

    return () => es.close();
  }, [onUpdate]);
}
