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

export const fadeIn: Transition = {
  duration: 0.7,
  ease: "easeOut",
};

export const kenBurns: Transition = {
  duration: 22,
  repeat: Infinity,
  ease: "easeInOut",
};

export const posterStagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

export const posterItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: springSoft },
};

export const posterItemStatic: Variants = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0 },
};
