import Link from "next/link";
import { Trophy } from "lucide-react";

import { CoverImage } from "@/components/browse/cover-image";
import { MonetizationBadge } from "@/components/browse/monetization-badge";
import { Badge } from "@/components/ui/badge";
import { formatScore, statusColors, statusLabels } from "@/lib/constants";
import type { Monetization } from "@/lib/games/catalog";
import { cn } from "@/lib/utils";

export type PosterCardProps = {
  slug: string;
  title: string;
  coverUrl: string;
  synopsis: string;
  pitch?: string;
  posterUrl?: string;
  releaseYear?: number | null;
  communityScore?: number | null;
  personalScore?: number | null;
  communityTake?: string;
  monetization: Monetization;
  status?: string | null;
  genres?: string[];
  variant?: "row" | "grid";
};

export function PosterCard({
  slug,
  title,
  coverUrl,
  synopsis,
  pitch,
  posterUrl,
  releaseYear,
  communityScore,
  personalScore,
  communityTake,
  monetization,
  status,
  genres = [],
  variant = "grid",
}: PosterCardProps) {
  const isRow = variant === "row";
  const imageSrc = isRow ? (posterUrl ?? coverUrl) : coverUrl;
  const blurb = pitch || synopsis;

  return (
    <Link
      href={`/library/${slug}`}
      className={cn(
        "group relative block",
        isRow && "w-[148px] shrink-0 snap-start sm:w-[168px] lg:w-[184px]",
      )}
    >
      <article
        className={cn(
          "overflow-hidden rounded-xl border border-neon-cyan/15 bg-card/70 transition duration-300",
          "group-hover:z-20 group-hover:border-neon-cyan/50 group-hover:box-glow-cyan",
          "group-focus-visible:border-neon-cyan/50",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden",
            isRow ? "aspect-[2/3]" : "aspect-[460/215]",
          )}
        >
          <CoverImage
            src={imageSrc}
            fallbackSrc={imageSrc === coverUrl ? undefined : coverUrl}
            alt={title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
            sizes={
              isRow ? "184px" : "(max-width: 768px) 100vw, 33vw"
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/25 to-transparent" />

          <div className="absolute left-2 top-2">
            <MonetizationBadge monetization={monetization} size="sm" />
          </div>

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

          <div className="absolute inset-x-0 bottom-0 space-y-1.5 p-3">
            <h3 className="line-clamp-2 text-sm font-medium text-glow-cyan group-hover:text-neon-cyan">
              {title}
            </h3>
            <p className="line-clamp-3 text-[11px] leading-snug text-foreground/90 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:opacity-100">
              {blurb}
            </p>
            {communityTake && (
              <p className="line-clamp-2 text-[11px] leading-snug text-neon-magenta/90 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:opacity-100">
                “{communityTake}”
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 px-3 py-2 text-[11px]">
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

        {!isRow && (
          <div className="flex flex-wrap gap-1 px-3 pb-3">
            {releaseYear && (
              <span className="text-[10px] text-muted-foreground">
                {releaseYear}
              </span>
            )}
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
        )}
      </article>
    </Link>
  );
}
