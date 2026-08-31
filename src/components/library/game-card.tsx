"use client";

import Image from "next/image";
import Link, { useLinkStatus } from "next/link";
import { ViewTransition } from "react";
import { Trophy } from "lucide-react";
import { motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatScore, statusColors, statusLabels } from "@/lib/constants";
import { springSnappy } from "@/lib/motion";
import { cn } from "@/lib/utils";

type GameCardProps = {
  slug: string;
  title: string;
  coverUrl: string;
  releaseYear?: number | null;
  communityScore?: number | null;
  personalScore?: number | null;
  status?: string | null;
  genres?: string[];
  priority?: boolean;
};

function NavigationHint() {
  const { pending } = useLinkStatus();

  return (
    <span
      aria-hidden
      data-pending={pending ? "" : undefined}
      className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-neon-cyan opacity-0 transition-[opacity,transform] duration-500 ease-out data-pending:scale-x-100 data-pending:opacity-100 data-pending:delay-100"
    />
  );
}

export function GameCard({
  slug,
  title,
  coverUrl,
  releaseYear,
  communityScore,
  personalScore,
  status,
  genres = [],
  priority = false,
}: GameCardProps) {
  return (
    <Link href={`/library/${slug}`} className="group block h-full">
      <motion.div
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.985 }}
        transition={springSnappy}
        className="h-full"
      >
        <Card className="relative h-full overflow-hidden border-neon-cyan/10 bg-card/60 transition-[border-color,box-shadow] duration-300 group-hover:border-neon-cyan/40 group-hover:box-glow-cyan">
          <NavigationHint />

          <div className="relative aspect-[460/215] overflow-hidden">
            <ViewTransition name={`cover-${slug}`} share="morph" default="none">
              <Image
                src={coverUrl}
                alt={title}
                fill
                priority={priority}
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </ViewTransition>
            <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />

            {status === "platinum" && (
              <Badge className="absolute right-2 top-2 border-neon-gold/50 bg-neon-gold/20 text-neon-gold">
                <Trophy className="mr-1 size-3" />
                Platina
              </Badge>
            )}

            {status && status !== "platinum" && (
              <Badge
                variant="outline"
                className={cn(
                  "absolute right-2 top-2 bg-void/70 backdrop-blur",
                  statusColors[status],
                )}
              >
                {statusLabels[status]}
              </Badge>
            )}
          </div>

          <div className="space-y-3 p-4">
            <div>
              <h3 className="line-clamp-1 font-medium">{title}</h3>
              {releaseYear && (
                <p className="text-xs text-muted-foreground">{releaseYear}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-1">
              {genres.slice(0, 2).map((genre) => (
                <Badge
                  key={genre}
                  variant="secondary"
                  className="bg-secondary/80 text-[10px]"
                >
                  {genre}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Comunidade{" "}
                <strong className="text-neon-cyan">
                  {formatScore(communityScore)}
                </strong>
              </span>
              <span className="text-muted-foreground">
                Você{" "}
                <strong className="text-neon-magenta">
                  {personalScore ?? "—"}
                </strong>
              </span>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}
