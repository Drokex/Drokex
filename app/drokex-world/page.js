"use client";

import { DrokexWorldSection, MarketsSection } from "@/app/components/drokex-world-experience";

export default function DrokexWorldPage() {
  return (
    <main className="relative bg-black text-white">
      <DrokexWorldSection />
      <MarketsSection />
    </main>
  );
}
