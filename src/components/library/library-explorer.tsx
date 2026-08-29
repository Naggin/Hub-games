"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { Search } from "lucide-react";

import { GameCard } from "@/components/library/game-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { statusLabels } from "@/lib/constants";
import type { LibraryStatus } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

type GameItem = {
  id: string;
  slug: string;
  title: string;
  coverUrl: string;
  releaseYear: number | null;
  genres: string[];
  communityScore: number | null;
  userEntry: {
    status: LibraryStatus;
    personalScore: number | null;
  } | null;
};

export function LibraryExplorer({
  games,
  genres,
  initialQuery,
  initialStatus,
  initialGenre,
}: {
  games: GameItem[];
  genres: string[];
  initialQuery: string;
  initialStatus: string;
  initialGenre: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [pending, startTransition] = useTransition();

  const updateFilters = useCallback(
    (next: { q?: string; status?: string; genre?: string }) => {
      const params = new URLSearchParams();
      const q = next.q ?? query;
      const status = next.status ?? initialStatus;
      const genre = next.genre ?? initialGenre;

      if (q) params.set("q", q);
      if (status) params.set("status", status);
      if (genre) params.set("genre", genre);

      startTransition(() => {
        router.push(`/library?${params.toString()}`);
      });
    },
    [query, initialStatus, initialGenre, router],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") updateFilters({ q: query });
            }}
            placeholder="Buscar jogo..."
            className="border-neon-cyan/20 bg-card/50 pl-10"
          />
        </div>
        <button
          type="button"
          onClick={() => updateFilters({ q: query })}
          className="rounded-lg bg-neon-cyan px-4 py-2 font-pixel text-[10px] text-void"
        >
          BUSCAR
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge
          variant="outline"
          className={cn(
            "cursor-pointer",
            !initialStatus && "border-neon-cyan text-neon-cyan",
          )}
          onClick={() => updateFilters({ status: "" })}
        >
          Todos status
        </Badge>
        {Object.entries(statusLabels).map(([key, label]) => (
          <Badge
            key={key}
            variant="outline"
            className={cn(
              "cursor-pointer",
              initialStatus === key && "border-neon-cyan text-neon-cyan",
            )}
            onClick={() => updateFilters({ status: key })}
          >
            {label}
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge
          variant="secondary"
          className={cn(
            "cursor-pointer",
            !initialGenre && "bg-neon-magenta/20 text-neon-magenta",
          )}
          onClick={() => updateFilters({ genre: "" })}
        >
          Todos gêneros
        </Badge>
        {genres.map((genre) => (
          <Badge
            key={genre}
            variant="secondary"
            className={cn(
              "cursor-pointer",
              initialGenre === genre && "bg-neon-magenta/20 text-neon-magenta",
            )}
            onClick={() => updateFilters({ genre })}
          >
            {genre}
          </Badge>
        ))}
      </div>

      <div
        className={cn(
          "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          pending && "opacity-60",
        )}
      >
        {games.map((game) => (
          <GameCard
            key={game.id}
            slug={game.slug}
            title={game.title}
            coverUrl={game.coverUrl}
            releaseYear={game.releaseYear}
            communityScore={game.communityScore}
            personalScore={game.userEntry?.personalScore}
            status={game.userEntry?.status}
            genres={game.genres}
          />
        ))}
      </div>

      {games.length === 0 && (
        <p className="text-center text-muted-foreground">
          Nenhum jogo encontrado. Tente outra busca ou adicione via RAWG.
        </p>
      )}
    </div>
  );
}
