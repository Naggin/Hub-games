"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useRef } from "react";

import { PosterCard, type PosterCardProps } from "@/components/browse/poster-card";
import { Button } from "@/components/ui/button";
import { posterItem, posterItemStatic, posterStagger } from "@/lib/motion";

export function CatalogRow({
  id,
  cabinet,
  title,
  games,
}: {
  id?: string;
  cabinet: string;
  title: string;
  games: PosterCardProps[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const itemVariants = reducedMotion ? posterItemStatic : posterItem;

  function scroll(direction: "left" | "right") {
    const node = scrollerRef.current;
    if (!node) return;
    const delta = Math.round(node.clientWidth * 0.85) * (direction === "left" ? -1 : 1);
    node.scrollBy({ left: delta, behavior: "smooth" });
  }

  if (games.length === 0) return null;

  return (
    <section id={id} className="group/row scroll-mt-28 space-y-3">
      <div className="flex items-end justify-between px-4 md:px-8">
        <div>
          <p className="font-pixel text-[9px] text-neon-cyan text-glow-cyan">
            {cabinet}
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight md:text-xl">
            {title}
          </h2>
        </div>
        <div className="hidden gap-1 sm:flex">
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            className="border-neon-cyan/20"
            onClick={() => scroll("left")}
            aria-label={`Rolar ${title} para a esquerda`}
          >
            <ChevronLeft />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            className="border-neon-cyan/20"
            onClick={() => scroll("right")}
            aria-label={`Rolar ${title} para a direita`}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <motion.div
        ref={scrollerRef}
        className="hide-scrollbar flex gap-3 overflow-x-auto px-4 pb-2 pt-1 snap-x snap-mandatory md:px-8"
        variants={posterStagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {games.map((game) => (
          <motion.div key={game.slug} className="shrink-0" variants={itemVariants}>
            <PosterCard variant="row" {...game} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
