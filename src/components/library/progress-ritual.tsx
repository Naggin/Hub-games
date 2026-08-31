"use client";

import {
  startTransition,
  useCallback,
  useOptimistic,
  useRef,
  useState,
} from "react";
import { motion } from "motion/react";
import { Check, Crown, Gamepad2, Skull, Star, Trophy } from "lucide-react";

import { updateLibraryStatusAction } from "@/app/actions/library";
import {
  ProgressCelebration,
  type Celebration,
} from "@/components/library/progress-celebration";
import { Button } from "@/components/ui/button";
import type { LibraryStatus } from "@/lib/db/schema";
import { springSnappy } from "@/lib/motion";
import { cn } from "@/lib/utils";

const rituals: {
  status: LibraryStatus;
  label: string;
  icon: typeof Gamepad2;
  className: string;
}[] = [
  {
    status: "playing",
    label: "Jogando",
    icon: Gamepad2,
    className: "border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10",
  },
  {
    status: "beaten",
    label: "Zerei",
    icon: Star,
    className: "border-emerald-400/40 text-emerald-400 hover:bg-emerald-400/10",
  },
  {
    status: "platinum",
    label: "Platinei",
    icon: Trophy,
    className: "border-neon-gold/40 text-neon-gold hover:bg-neon-gold/10 box-glow-gold",
  },
  {
    status: "wishlist",
    label: "Wishlist",
    icon: Crown,
    className: "border-neon-magenta/40 text-neon-magenta hover:bg-neon-magenta/10",
  },
  {
    status: "dropped",
    label: "Drop",
    icon: Skull,
    className: "border-muted-foreground/40 text-muted-foreground hover:bg-muted/20",
  },
];

export function ProgressRitual({
  gameId,
  slug,
  title,
  currentStatus,
}: {
  gameId: string;
  slug: string;
  title: string;
  currentStatus?: LibraryStatus | null;
}) {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    currentStatus ?? null,
  );
  const [celebration, setCelebration] = useState<Celebration | null>(null);
  const celebrationCount = useRef(0);

  const dismissCelebration = useCallback(() => setCelebration(null), []);

  function handleStatus(status: LibraryStatus) {
    if (status === optimisticStatus) return;

    if (status === "beaten" || status === "platinum") {
      celebrationCount.current += 1;
      setCelebration({
        id: celebrationCount.current,
        kind: status,
        gameTitle: title,
      });
    }

    startTransition(async () => {
      setOptimisticStatus(status);
      await updateLibraryStatusAction(gameId, status, slug);
    });
  }

  return (
    <div className="space-y-3">
      <p className="font-pixel text-[10px] text-neon-cyan">RITUAL DE PROGRESSO</p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {rituals.map(({ status, label, icon: Icon, className }) => {
          const active = optimisticStatus === status;
          const implied = status === "beaten" && optimisticStatus === "platinum";

          return (
            <motion.div key={status} whileTap={{ scale: 0.96 }}>
              <Button
                type="button"
                variant="outline"
                aria-pressed={active}
                onClick={() => handleStatus(status)}
                className={cn(
                  "relative h-auto w-full flex-col gap-2 py-4",
                  className,
                )}
              >
                {active && (
                  <motion.span
                    layoutId="ritual-active"
                    transition={springSnappy}
                    className="absolute inset-0 rounded-md ring-2 ring-current"
                  />
                )}

                {implied && (
                  <Check
                    aria-label="Preenchido pela platina"
                    className="absolute right-2 top-2 size-3 opacity-70"
                  />
                )}

                <Icon className="size-5" />
                <span className="text-xs">{label}</span>
              </Button>
            </motion.div>
          );
        })}
      </div>

      {optimisticStatus === "platinum" && (
        <p className="text-xs text-muted-foreground">
          Platina preenche zerado automaticamente.
        </p>
      )}

      <ProgressCelebration
        celebration={celebration}
        onDismiss={dismissCelebration}
      />
    </div>
  );
}
