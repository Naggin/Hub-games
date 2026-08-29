import Image from "next/image";
import Link from "next/link";
import { Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatScore, statusColors, statusLabels } from "@/lib/constants";
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
};

export function GameCard({
  slug,
  title,
  coverUrl,
  releaseYear,
  communityScore,
  personalScore,
  status,
  genres = [],
}: GameCardProps) {
  return (
    <Link href={`/library/${slug}`} className="group block">
      <Card className="overflow-hidden border-neon-cyan/10 bg-card/60 transition duration-300 group-hover:border-neon-cyan/40 group-hover:box-glow-cyan">
        <div className="relative aspect-[460/215] overflow-hidden">
          <Image
            src={coverUrl}
            alt={title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
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
    </Link>
  );
}
