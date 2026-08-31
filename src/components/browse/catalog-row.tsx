"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import { PosterCard, type PosterCardProps } from "@/components/browse/poster-card";
import { Button } from "@/components/ui/button";

export function CatalogRow({
  cabinet,
  title,
  games,
}: {
  cabinet: string;
  title: string;
  games: PosterCardProps[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    const node = scrollerRef.current;
    if (!node) return;
    const delta = Math.round(node.clientWidth * 0.85) * (direction === "left" ? -1 : 1);
    node.scrollBy({ left: delta, behavior: "smooth" });
  }

  if (games.length === 0) return null;

  return (
    <section className="group/row space-y-3">
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

      <div
        ref={scrollerRef}
        className="hide-scrollbar flex gap-3 overflow-x-auto px-4 pb-2 pt-1 snap-x snap-mandatory md:px-8"
      >
        {games.map((game) => (
          <PosterCard key={game.slug} variant="row" {...game} />
        ))}
      </div>
    </section>
  );
}
