"use client";

import dynamic from "next/dynamic";
import SiteHeader from "@/app/components/site-header";

const Cables3D = dynamic(() => import("@/app/components/cables-3d"), { ssr: false });

export default function Page3D() {
  return (
    <main style={{ minHeight: "100vh", background: "#000", color: "#fff" }}>
      <SiteHeader />
      <div style={{ width: "100%", height: "100vh" }}>
        <Cables3D />
      </div>
    </main>
  );
}
