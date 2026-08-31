import type { Transition } from "motion/react";

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
