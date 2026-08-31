"use client";

import { Clock, Layers, Star, Trophy } from "lucide-react";
import { motion } from "motion/react";

import { AnimatedCounter } from "@/components/motion/animated-counter";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { easeOutArcade } from "@/lib/motion";

type Stats = {
  total: number;
  beaten: number;
  platinum: number;
  wishlist: number;
  hours: number;
};

export function PrideStats({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: "Zerados",
      value: stats.beaten,
      icon: Star,
      color: "text-emerald-400",
    },
    {
      label: "Platinas",
      value: stats.platinum,
      icon: Trophy,
      color: "text-neon-gold",
    },
    {
      label: "Backlog",
      value: stats.wishlist,
      icon: Layers,
      color: "text-neon-magenta",
    },
    {
      label: "Horas",
      value: stats.hours,
      icon: Clock,
      color: "text-neon-cyan",
    },
  ];

  const beatenShare =
    stats.total > 0 ? Math.min(100, (stats.beaten / stats.total) * 100) : 0;
  const platinumShare =
    stats.total > 0 ? Math.min(100, (stats.platinum / stats.total) * 100) : 0;

  return (
    <section className="space-y-4">
      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <StaggerItem key={label}>
            <Card className="border-neon-cyan/10 bg-card/50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className={`mt-1 text-3xl font-semibold ${color}`}>
                    <AnimatedCounter value={value} />
                  </p>
                </div>
                <Icon className={`size-8 ${color}`} />
              </div>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>

      {stats.total > 0 && (
        <Card className="border-neon-cyan/10 bg-card/40 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-pixel text-[10px] text-neon-cyan">
              PROGRESSO DA COLEÇÃO
            </p>
            <p className="text-sm text-muted-foreground">
              {stats.beaten} de {stats.total} jogos zerados
            </p>
          </div>

          <div className="relative mt-4 h-2.5 overflow-hidden rounded-full bg-secondary">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${beatenShare}%` }}
              transition={easeOutArcade}
              className="absolute inset-y-0 left-0 rounded-full bg-emerald-400/70"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${platinumShare}%` }}
              transition={{ ...easeOutArcade, delay: 0.15 }}
              className="absolute inset-y-0 left-0 rounded-full bg-neon-gold"
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-neon-gold" />
              {stats.platinum} platinados
            </span>
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400/70" />
              {stats.beaten - stats.platinum} zerados sem platina
            </span>
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-secondary" />
              {Math.max(0, stats.total - stats.beaten)} ainda sem zerar
            </span>
          </div>
        </Card>
      )}
    </section>
  );
}
