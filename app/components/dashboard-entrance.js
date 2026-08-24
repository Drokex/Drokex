"use client";

import { useRef } from "react";
import { useHeroEntrance } from "@/app/components/use-hero-entrance";

// Envuelve el contenido de un dashboard (server component) para animar
// [data-hero-item] al montar, igual que los heroes públicos.
export default function DashboardEntrance({ as: Tag = "div", className, children, ...rest }) {
  const rootRef = useRef(null);
  useHeroEntrance(rootRef);
  return (
    <Tag ref={rootRef} className={className} {...rest}>
      {children}
    </Tag>
  );
}
