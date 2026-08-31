"use client";

import { MotionConfig } from "motion/react";

import { springSoft } from "@/lib/motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={springSoft}>
      {children}
    </MotionConfig>
  );
}
