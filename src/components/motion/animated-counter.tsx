"use client";

import { useEffect } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

export function AnimatedCounter({
  value,
  duration = 0.9,
}: {
  value: number;
  duration?: number;
}) {
  const reducedMotion = useReducedMotion();
  const count = useMotionValue(0);
  const label = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString("pt-BR"),
  );

  useEffect(() => {
    if (reducedMotion) {
      count.set(value);
      return;
    }

    const controls = animate(count, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });

    return () => controls.stop();
  }, [value, duration, count, reducedMotion]);

  return <motion.span>{label}</motion.span>;
}
