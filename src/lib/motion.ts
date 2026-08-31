import type { Transition, Variants } from "motion/react";

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.7,
};

export const springSoft: Transition = {
  type: "spring",
  stiffness: 240,
  damping: 28,
};

export const easeOutArcade: Transition = {
  duration: 0.4,
  ease: [0.16, 1, 0.3, 1],
};

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045 } },
};
