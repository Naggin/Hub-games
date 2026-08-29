"use client";

import dynamic from "next/dynamic";

const ArcadeBackgroundInner = dynamic(
  () =>
    import("@/components/arcade/arcade-background-inner").then(
      (mod) => mod.ArcadeBackgroundInner,
    ),
  { ssr: false },
);

export function ArcadeBackground() {
  return <ArcadeBackgroundInner />;
}

export { MarqueeTitle, InsertCoinPrompt } from "@/components/arcade/arcade-background-inner";
