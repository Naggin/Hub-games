"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

import { PosterCard } from "@/components/browse/poster-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { statusLabels } from "@/lib/constants";
import { monetizationCopy, type Monetization } from "@/lib/games/catalog";
import { cn } from "@/lib/utils";

export type CabinetGame = {
  id: string;
  slug: string;
  title: string;
  synopsis: string;
  coverUrl: string;
  releaseYear: number | null;
  genres: string[];
  communityScore?: number | null;
  communityTake?: string;
  monetization: Monetization;
  pitch?: string;
  posterUrl?: string;
  status?: string | null;
  personalScore?: number | null;
  userEntry?: {
    status?: string | null;
    personalScore?: number | null;
  } | null;
};

const monetizationFilters: { key: Monetization | ""; label: string }[] = [
  { key: "", label: "Toda caixa" },
  { key: "fair", label: "Sem P2W" },
  { key: "cosmetics", label: "Só cosmético" },
  { key: "gacha", label: "Gacha" },
  { key: "pay_to_win", label: "Pay to win" },
];

function gameStatus(game: CabinetGame) {
  return game.status ?? game.userEntry?.status ?? null;
}

function gameScore(game: CabinetGame) {
  return game.personalScore ?? game.userEntry?.personalScore ?? null;
}

function matchesQuery(game: CabinetGame, raw: string) {
  const q = raw.trim().toLowerCase();
  if (!q) return true;
  return (
    game.title.toLowerCase().includes(q) ||
    game.synopsis.toLowerCase().includes(q) ||
    game.genres.some((genre) => genre.toLowerCase().includes(q))
  );
}

export function CabinetSearch({
  games,
  genres,
  initialQuery,
  initialStatus,
  initialGenre,
  initialMonetization,
  children,
}: {
  games: CabinetGame[];
  genres: string[];
  initialQuery: string;
  initialStatus: string;
  initialGenre: string;
  initialMonetization: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState(initialStatus);
  const [genre, setGenre] = useState(initialGenre);
  const [monetization, setMonetization] = useState(initialMonetization);
  const [opened, setOpened] = useState(
    Boolean(
      initialQuery.trim() ||
        initialStatus ||
        initialGenre ||
        initialMonetization,
    ),
  );

  const hasFilters = Boolean(
    query.trim() || status || genre || monetization,
  );
  const expanded = opened || hasFilters;

  const visibleGames = useMemo(
    () =>
      games.filter((game) => {
        if (!matchesQuery(game, query)) return false;
        if (status && gameStatus(game) !== status) return false;
        if (genre && !game.genres.includes(genre)) return false;
        if (monetization && game.monetization !== monetization) return false;
        return true;
      }),
    [games, query, status, genre, monetization],
  );

  useEffect(() => {
    if (window.location.hash === "#buscar") setOpened(true);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams();
      const q = query.trim();
      if (q) params.set("q", q);
      if (status) params.set("status", status);
      if (genre) params.set("genre", genre);
      if (monetization) params.set("monetization", monetization);
      const next = params.size ? `/hub?${params.toString()}` : "/hub";
      const current = `${window.location.pathname}${window.location.search}`;
      if (current !== next) {
        router.replace(next, { scroll: false });
      }
    }, 220);
    return () => window.clearTimeout(timer);
  }, [query, status, genre, monetization, router]);

  function clearAndCollapse() {
    setQuery("");
    setStatus("");
    setGenre("");
    setMonetization("");
    setOpened(false);
  }

  return (
    <div className="space-y-10">
      <section
        id="buscar"
        className="scroll-mt-28 space-y-4 px-4 md:px-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-pixel text-[9px] text-neon-magenta text-glow-cyan">
              BUSCAR NO CABINET
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight md:text-xl">
              O catálogo mora aqui
            </h2>
          </div>
          <button
            type="button"
            onClick={() =>
              expanded ? clearAndCollapse() : setOpened(true)
            }
            className="inline-flex items-center gap-1.5 rounded-full border border-neon-cyan/25 bg-card/70 px-3 py-1.5 text-[11px] text-muted-foreground transition hover:border-neon-cyan/50 hover:text-neon-cyan"
          >
            {expanded ? "Voltar às filas" : "Ver o cabinet inteiro"}
            <ChevronDown
              className={cn(
                "size-3.5 transition",
                expanded && "rotate-180",
              )}
            />
          </button>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-neon-cyan/20 bg-card/75 box-glow-cyan backdrop-blur">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />
          <div className="relative flex items-center gap-2 p-3 md:p-4">
            <Search className="size-4 shrink-0 text-neon-cyan" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!opened) setOpened(true);
              }}
              onFocus={() => setOpened(true)}
              placeholder="Elden, Hades, o que tiver no save..."
              aria-label="Buscar no cabinet"
              className="h-11 border-0 bg-transparent text-base shadow-none focus-visible:ring-0 md:text-sm"
            />
            <span className="hidden font-pixel text-[8px] tracking-widest text-neon-gold sm:inline">
              1 CREDIT
            </span>
          </div>
        </div>

        {expanded && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {monetizationFilters.map(({ key, label }) => (
                <Badge
                  key={key || "all-box"}
                  variant="outline"
                  className={cn(
                    "h-7 cursor-pointer px-2.5",
                    monetization === key && "border-neon-gold text-neon-gold",
                  )}
                  onClick={() => setMonetization(key)}
                >
                  {key ? monetizationCopy[key].cabinet : label}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "h-7 cursor-pointer px-2.5",
                  !status && "border-neon-cyan text-neon-cyan",
                )}
                onClick={() => setStatus("")}
              >
                Todos status
              </Badge>
              {Object.entries(statusLabels).map(([key, label]) => (
                <Badge
                  key={key}
                  variant="outline"
                  className={cn(
                    "h-7 cursor-pointer px-2.5",
                    status === key && "border-neon-cyan text-neon-cyan",
                  )}
                  onClick={() => setStatus(key)}
                >
                  {label}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className={cn(
                  "h-7 cursor-pointer px-2.5",
                  !genre && "bg-neon-magenta/20 text-neon-magenta",
                )}
                onClick={() => setGenre("")}
              >
                Todos gêneros
              </Badge>
              {genres.map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className={cn(
                    "h-7 cursor-pointer px-2.5",
                    genre === item && "bg-neon-magenta/20 text-neon-magenta",
                  )}
                  onClick={() => setGenre(item)}
                >
                  {item}
                </Badge>
              ))}
            </div>

            <p className="font-pixel text-[9px] text-muted-foreground">
              {visibleGames.length} NO CABINET
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleGames.map((game) => (
                <PosterCard
                  key={game.id}
                  slug={game.slug}
                  title={game.title}
                  coverUrl={game.coverUrl}
                  synopsis={game.synopsis}
                  pitch={game.pitch}
                  posterUrl={game.posterUrl}
                  releaseYear={game.releaseYear}
                  communityScore={game.communityScore}
                  personalScore={gameScore(game)}
                  communityTake={game.communityTake}
                  monetization={game.monetization}
                  status={gameStatus(game)}
                  genres={game.genres}
                />
              ))}
            </div>

            {visibleGames.length === 0 && (
              <p className="rounded-xl border border-dashed border-neon-cyan/20 bg-card/60 p-6 text-center text-muted-foreground">
                Nenhum jogo com esse recorte. Tenta outro nome — o cabinet tá
                cheio.
              </p>
            )}
          </div>
        )}
      </section>

      {!expanded && children}
    </div>
  );
}
