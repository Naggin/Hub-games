"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Star, Trophy } from "lucide-react";

import { springSnappy } from "@/lib/motion";

export type CelebrationKind = "beaten" | "platinum";

export type Celebration = {
  id: number;
  kind: CelebrationKind;
  gameTitle: string;
};

const CELEBRATION_MS = 2600;

const copy = {
  beaten: {
    headline: "GAME CLEAR",
    message: "Zerado. Mais um pra coleção.",
    icon: Star,
    accent: "text-emerald-400",
    ring: "border-emerald-400/40",
    glow: "text-glow-cyan",
    confetti: ["#7cff6b", "#00f5ff", "#ffffff"],
    particles: 70,
  },
  platinum: {
    headline: "PLATINUM GET",
    message: "Platina na conta. Isso é dedicação.",
    icon: Trophy,
    accent: "text-neon-gold",
    ring: "border-neon-gold/50",
    glow: "text-glow-gold",
    confetti: ["#ffd700", "#ffffff", "#ff00aa"],
    particles: 140,
  },
} satisfies Record<CelebrationKind, unknown>;

export function ProgressCelebration({
  celebration,
  onDismiss,
}: {
  celebration: Celebration | null;
  onDismiss: () => void;
}) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!celebration) return;

    const theme = copy[celebration.kind];

    if (!reducedMotion) {
      confetti({
        particleCount: theme.particles,
        spread: 78,
        origin: { y: 0.65 },
        colors: theme.confetti,
      });
    }

    const timer = setTimeout(onDismiss, CELEBRATION_MS);

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onDismiss();
    }

    window.addEventListener("keydown", handleKey);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKey);
    };
  }, [celebration, reducedMotion, onDismiss]);

  return (
    <AnimatePresence>
      {celebration && (
        <motion.div
          key={celebration.id}
          role="status"
          aria-live="polite"
          onClick={onDismiss}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-void/85 p-6 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.85, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={springSnappy}
            className={`scanlines relative overflow-hidden rounded-2xl border bg-card/90 px-8 py-10 text-center ${copy[celebration.kind].ring}`}
          >
            <CelebrationIcon kind={celebration.kind} />

            <p
              className={`mt-6 font-pixel text-lg ${copy[celebration.kind].accent} ${copy[celebration.kind].glow}`}
            >
              {copy[celebration.kind].headline}
            </p>

            <p className="mt-4 text-lg font-medium">{celebration.gameTitle}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {copy[celebration.kind].message}
            </p>

            <p className="mt-6 font-pixel text-[8px] text-muted-foreground">
              TOQUE PARA CONTINUAR
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CelebrationIcon({ kind }: { kind: CelebrationKind }) {
  const reducedMotion = useReducedMotion();
  const theme = copy[kind];
  const Icon = theme.icon;

  return (
    <motion.div
      animate={reducedMotion ? undefined : { scale: [1, 1.12, 1] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      className="mx-auto w-fit"
    >
      <Icon className={`size-14 ${theme.accent}`} />
    </motion.div>
  );
}
