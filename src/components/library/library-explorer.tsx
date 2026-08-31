"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  startTransition,
  useCallback,
  useEffect,
  useOptimistic,
  useRef,
  useState,
} from "react";
import { Loader2, Search, X } from "lucide-react";

import { GameCard } from "@/components/library/game-card";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { statusLabels } from "@/lib/constants";
import type { LibraryStatus } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

const SEARCH_DEBOUNCE_MS = 350;

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
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(initialStatus);
  const [optimisticGenre, setOptimisticGenre] = useOptimistic(initialGenre);
  const [isPending, setIsPending] = useOptimistic(false);
  const lastPushedQuery = useRef(initialQuery);

  const pushFilters = useCallback(
    (next: { q: string; status: string; genre: string }) => {
      const params = new URLSearchParams();
      if (next.q) params.set("q", next.q);
      if (next.status) params.set("status", next.status);
      if (next.genre) params.set("genre", next.genre);

      const search = params.toString();
      router.push(search ? `/library?${search}` : "/library");
    },
    [router],
  );

  useEffect(() => {
    if (query === lastPushedQuery.current) return;

    const timer = setTimeout(() => {
      lastPushedQuery.current = query;
      startTransition(() => {
        setIsPending(true);
        pushFilters({
          q: query,
          status: optimisticStatus,
          genre: optimisticGenre,
        });
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [
    query,
    optimisticStatus,
    optimisticGenre,
    pushFilters,
    setIsPending,
  ]);

  function selectStatus(status: string) {
    startTransition(() => {
      setOptimisticStatus(status);
      setIsPending(true);
      lastPushedQuery.current = query;
      pushFilters({ q: query, status, genre: optimisticGenre });
    });
  }

  function selectGenre(genre: string) {
    startTransition(() => {
      setOptimisticGenre(genre);
      setIsPending(true);
      lastPushedQuery.current = query;
      pushFilters({ q: query, status: optimisticStatus, genre });
    });
  }

  function clearFilters() {
    setQuery("");
    startTransition(() => {
      setOptimisticStatus("");
      setOptimisticGenre("");
      setIsPending(true);
      lastPushedQuery.current = "";
      pushFilters({ q: "", status: "", genre: "" });
    });
  }

  const hasFilters = Boolean(query || optimisticStatus || optimisticGenre);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar jogo..."
          aria-label="Buscar jogo pelo título"
          className="border-neon-cyan/20 bg-card/50 pl-10 pr-20"
        />
        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
          {isPending && (
            <Loader2 className="size-4 animate-spin text-neon-cyan" />
          )}
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Limpar busca"
              className="text-muted-foreground transition-colors hover:text-neon-cyan"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge
          variant="outline"
          className={cn(
            "cursor-pointer transition-colors",
            !optimisticStatus && "border-neon-cyan text-neon-cyan",
          )}
          onClick={() => selectStatus("")}
        >
          Todos status
        </Badge>
        {Object.entries(statusLabels).map(([key, label]) => (
          <Badge
            key={key}
            variant="outline"
            className={cn(
              "cursor-pointer transition-colors",
              optimisticStatus === key && "border-neon-cyan text-neon-cyan",
            )}
            onClick={() => selectStatus(key)}
          >
            {label}
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge
          variant="secondary"
          className={cn(
            "cursor-pointer transition-colors",
            !optimisticGenre && "bg-neon-magenta/20 text-neon-magenta",
          )}
          onClick={() => selectGenre("")}
        >
          Todos gêneros
        </Badge>
        {genres.map((genre) => (
          <Badge
            key={genre}
            variant="secondary"
            className={cn(
              "cursor-pointer transition-colors",
              optimisticGenre === genre && "bg-neon-magenta/20 text-neon-magenta",
            )}
            onClick={() => selectGenre(genre)}
          >
            {genre}
          </Badge>
        ))}
      </div>

      {games.length > 0 ? (
        <Stagger
          key={`${initialQuery}|${initialStatus}|${initialGenre}`}
          className={cn(
            "grid gap-4 transition-opacity duration-200 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
            isPending && "opacity-50",
          )}
        >
          {games.map((game) => (
            <StaggerItem key={game.id}>
              <GameCard
                slug={game.slug}
                title={game.title}
                coverUrl={game.coverUrl}
                releaseYear={game.releaseYear}
                communityScore={game.communityScore}
                personalScore={game.userEntry?.personalScore}
                status={game.userEntry?.status}
                genres={game.genres}
              />
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <Card className="border-dashed border-neon-cyan/20 bg-card/40 p-10 text-center">
          <p className="font-pixel text-[10px] text-neon-magenta">NO RESULTS</p>
          <p className="mt-4 text-muted-foreground">
            Nenhum jogo bateu com esses filtros.
          </p>
          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-lg border border-neon-cyan/40 px-4 py-2 text-sm text-neon-cyan transition-colors hover:bg-neon-cyan/10"
            >
              Limpar filtros
            </button>
          ) : (
            <Link
              href="/hub"
              className="mt-4 inline-block text-sm text-neon-cyan hover:underline"
            >
              Voltar para o hub
            </Link>
          )}
        </Card>
      )}
    </div>
  );
}
