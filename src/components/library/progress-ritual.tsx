"use client";

import { useTransition } from "react";
import confetti from "canvas-confetti";
import { motion } from "motion/react";
import { Crown, Gamepad2, Skull, Star, Trophy } from "lucide-react";

import { updateLibraryStatusAction } from "@/app/actions/library";
import { Button } from "@/components/ui/button";
import type { LibraryStatus } from "@/lib/db/schema";
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

function celebrate(status: LibraryStatus) {
  if (status === "beaten" || status === "platinum") {
    confetti({
      particleCount: status === "platinum" ? 120 : 60,
      spread: 70,
      origin: { y: 0.7 },
      colors:
        status === "platinum"
          ? ["#ffd700", "#fff", "#ff00aa"]
          : ["#7cff6b", "#00f5ff", "#fff"],
    });
  }
}

export function ProgressRitual({
  gameId,
  slug,
  currentStatus,
}: {
  gameId: string;
  slug: string;
  currentStatus?: LibraryStatus | null;
}) {
  const [pending, startTransition] = useTransition();

  function handleStatus(status: LibraryStatus) {
    startTransition(async () => {
      await updateLibraryStatusAction(gameId, status, slug);
      celebrate(status);
    });
  }

  return (
    <div className="space-y-3">
      <p className="font-pixel text-[10px] text-neon-cyan">RITUAL DE PROGRESSO</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {rituals.map(({ status, label, icon: Icon, className }) => (
          <motion.div key={status} whileTap={{ scale: 0.96 }}>
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => handleStatus(status)}
              className={cn(
                "h-auto w-full flex-col gap-2 py-4",
                className,
                currentStatus === status && "ring-2 ring-current",
              )}
            >
              <Icon className="size-5" />
              <span className="text-xs">{label}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
