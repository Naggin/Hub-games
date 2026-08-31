import Link from "next/link";
import { Play, Trophy, Star, Clock, ListTodo } from "lucide-react";

import { CoverImage } from "@/components/browse/cover-image";
import { MonetizationBadge } from "@/components/browse/monetization-badge";
import { ProgressRitual } from "@/components/library/progress-ritual";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatScore } from "@/lib/constants";
import { monetizationCopy, type Monetization } from "@/lib/games/catalog";

type BillboardGame = {
  id: string;
  slug: string;
  title: string;
  synopsis: string;
  pitch?: string;
  coverUrl: string;
  backdropUrl?: string;
  releaseYear?: number | null;
  genres: string[];
  platforms?: string[];
  communityScore?: number | null;
  communityTake: string;
  monetization: Monetization;
  personalScore?: number | null;
  status?: string | null;
};

export function TitleBillboard({
  game,
  isPlaying,
  stats,
}: {
  game: BillboardGame;
  isPlaying: boolean;
  stats: {
    beaten: number;
    platinum: number;
    wishlist: number;
    hours: number;
  };
}) {
  const copy = monetizationCopy[game.monetization];
  const pitch = game.pitch || game.synopsis;

  return (
    <section className="relative isolate min-h-[82vh] overflow-hidden border-b border-neon-cyan/20">
      <CoverImage
        src={game.backdropUrl || game.coverUrl}
        fallbackSrc={game.coverUrl}
        alt=""
        fill
        priority
        className="object-cover object-center scale-105"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-void via-void/85 to-void/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/55" />
      <div className="scanlines pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative z-10 mx-auto flex min-h-[82vh] max-w-7xl flex-col justify-end px-4 pb-10 pt-28 md:px-8 md:pb-14">
        <p className="font-pixel text-[10px] text-neon-gold text-glow-gold">
          {isPlaying ? "NOW PLAYING" : "FEATURED CABINET"}
        </p>

        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-glow-cyan md:text-6xl">
          {game.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <MonetizationBadge monetization={game.monetization} />
          {game.releaseYear && (
            <Badge variant="outline" className="border-white/20 text-muted-foreground">
              {game.releaseYear}
            </Badge>
          )}
          {game.genres.slice(0, 3).map((genre) => (
            <Badge key={genre} variant="secondary" className="bg-secondary/70">
              {genre}
            </Badge>
          ))}
        </div>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/90 md:text-lg">
          {pitch}
        </p>

        <blockquote className="mt-4 max-w-2xl border-l-2 border-neon-magenta/60 pl-4 text-sm text-muted-foreground md:text-base">
          A galera: “{game.communityTake}”
        </blockquote>

        <p className="mt-3 max-w-2xl text-xs text-muted-foreground">
          {copy.blurb}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
          <span>
            Comunidade{" "}
            <strong className="text-neon-cyan">
              {formatScore(game.communityScore)}
            </strong>
          </span>
          <span>
            Você{" "}
            <strong className="text-neon-magenta">
              {game.personalScore ?? "—"}
            </strong>
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            asChild
            size="lg"
            className="bg-neon-cyan text-void hover:bg-neon-cyan/90"
          >
            <Link href={`/library/${game.slug}`}>
              <Play className="size-4" />
              {isPlaying ? "Continuar" : "Ver ficha"}
            </Link>
          </Button>
          {!isPlaying && (
            <p className="font-pixel text-[9px] text-neon-magenta">
              1 CREDIT · ABRIR CABINET
            </p>
          )}
        </div>

        {isPlaying && (
          <div className="mt-6 max-w-3xl">
            <ProgressRitual
              gameId={game.id}
              slug={game.slug}
              currentStatus="playing"
              compact
            />
          </div>
        )}

        <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Platinas", value: stats.platinum, icon: Trophy, tone: "text-neon-gold" },
            { label: "Zerados", value: stats.beaten, icon: Star, tone: "text-emerald-400" },
            { label: "Backlog", value: stats.wishlist, icon: ListTodo, tone: "text-neon-cyan" },
            { label: "Horas", value: stats.hours, icon: Clock, tone: "text-neon-magenta" },
          ].map(({ label, value, icon: Icon, tone }) => (
            <div
              key={label}
              className="rounded-lg border border-neon-cyan/15 bg-void/60 px-3 py-2 backdrop-blur"
            >
              <dt className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Icon className={`size-3.5 ${tone}`} />
                {label}
              </dt>
              <dd className="mt-0.5 text-xl font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
