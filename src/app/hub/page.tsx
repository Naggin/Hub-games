import { CabinetSearch } from "@/components/browse/cabinet-search";
import { CatalogRow } from "@/components/browse/catalog-row";
import { TitleBillboard } from "@/components/browse/title-billboard";
import { HubShell } from "@/components/layout/hub-shell";
import { Card } from "@/components/ui/card";
import { getAuthUserId } from "@/lib/auth";
import type { LibraryStatus } from "@/lib/db/schema";
import { buildCatalogRows, type BrowseGame } from "@/lib/games/catalog";
import {
  getGamesWithStats,
  getPlayingGamesWithDetails,
  getUserStats,
} from "@/lib/games/queries";

function toPosterProps(game: BrowseGame) {
  return {
    slug: game.slug,
    title: game.title,
    coverUrl: game.coverUrl,
    synopsis: game.synopsis,
    pitch: game.pitch,
    posterUrl: game.posterUrl,
    releaseYear: game.releaseYear,
    communityScore: game.communityScore,
    personalScore: game.personalScore ?? game.userEntry?.personalScore,
    communityTake: game.communityTake,
    monetization: game.monetization,
    status: game.status ?? game.userEntry?.status,
    genres: game.genres,
  };
}

function shelfByStatus(games: BrowseGame[], status: LibraryStatus) {
  return games.filter(
    (game) => (game.status ?? game.userEntry?.status) === status,
  );
}

function toBrowseGame(
  game: {
    id: string;
    slug: string;
    title: string;
    synopsis: string;
    coverUrl: string;
    releaseYear: number | null;
    genres: string[];
    communityScore?: number | null;
    communityReviewCount?: number;
    monetization: BrowseGame["monetization"];
    communityTake: string;
    pitch?: string;
    posterUrl?: string;
    backdropUrl?: string;
    userEntry?: {
      status?: LibraryStatus | null;
      personalScore?: number | null;
    } | null;
  },
  extras?: { status?: LibraryStatus | null; personalScore?: number | null },
): BrowseGame {
  return {
    ...game,
    communityScore: game.communityScore ?? null,
    status: (extras?.status ?? game.userEntry?.status ?? null) as BrowseGame["status"],
    personalScore: extras?.personalScore ?? game.userEntry?.personalScore ?? null,
    userEntry: game.userEntry as BrowseGame["userEntry"],
  };
}

export default async function HubPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    genre?: string;
    monetization?: string;
  }>;
}) {
  const userId = await getAuthUserId();
  if (!userId) return null;

  const params = await searchParams;

  const [stats, playingRows, catalog] = await Promise.all([
    getUserStats(userId),
    getPlayingGamesWithDetails(userId),
    getGamesWithStats(userId, { limit: 200 }),
  ]);

  const catalogBySlug = new Map(catalog.map((game) => [game.slug, game]));

  const playing = playingRows.map(({ game, entry }) => {
    const fromCatalog = catalogBySlug.get(game.slug);
    return toBrowseGame(
      {
        id: game.id,
        slug: game.slug,
        title: game.title,
        synopsis: game.synopsis,
        coverUrl: game.coverUrl,
        releaseYear: game.releaseYear,
        genres: game.genres,
        communityScore: fromCatalog?.communityScore ?? null,
        communityReviewCount: fromCatalog?.communityReviewCount,
        monetization: fromCatalog?.monetization ?? game.monetization,
        communityTake: fromCatalog?.communityTake ?? game.communityTake,
        pitch: fromCatalog?.pitch ?? game.pitch,
        posterUrl: fromCatalog?.posterUrl ?? game.posterUrl,
        backdropUrl: fromCatalog?.backdropUrl ?? game.backdropUrl,
        userEntry: {
          status: entry.status,
          personalScore: entry.personalScore,
        },
      },
      {
        status: entry.status,
        personalScore: entry.personalScore,
      },
    );
  });

  const games = catalog.map((game) => toBrowseGame(game));
  const featured =
    playing[0] ??
    [...games].sort(
      (a, b) => (b.communityScore ?? 0) - (a.communityScore ?? 0),
    )[0];

  const rows = buildCatalogRows(games, playing);
  const continuar = rows.find((row) => row.id === "continuar");
  const rest = rows.filter((row) => row.id !== "continuar");
  const prideRows = [
    {
      id: "platinas",
      cabinet: "TROPHY",
      title: "Suas platinas",
      games: shelfByStatus(games, "platinum"),
    },
    {
      id: "zerados",
      cabinet: "CLEAR",
      title: "Zerados",
      games: shelfByStatus(games, "beaten"),
    },
    {
      id: "backlog",
      cabinet: "1 UP",
      title: "Backlog",
      games: shelfByStatus(games, "wishlist"),
    },
  ].filter((row) => row.games.length > 0);
  const allGenres = Array.from(
    new Set(games.flatMap((game) => game.genres)),
  ).slice(0, 12);

  return (
    <HubShell browse>
      {featured ? (
        <TitleBillboard
          game={featured}
          isPlaying={playing.some((game) => game.slug === featured.slug)}
          stats={stats}
        />
      ) : (
        <Card
          id="continuar"
          className="mx-4 mt-8 scroll-mt-28 border-dashed border-neon-cyan/20 bg-card/70 p-8 text-center md:mx-8"
        >
          <p className="font-pixel text-[10px] text-neon-gold">NO GAME IN PLAY</p>
          <p className="mt-3 text-muted-foreground">
            Nada no cabinet.{" "}
            <a href="#buscar" className="text-neon-cyan hover:underline">
              Busca um jogo aqui
            </a>{" "}
            e marca como Jogando.
          </p>
        </Card>
      )}

      <div className="relative space-y-10 py-10">
        {playing.length === 0 && featured && (
          <div id="continuar" className="scroll-mt-28 px-4 md:px-8">
            <Card className="border-dashed border-neon-cyan/20 bg-card/70 p-6">
              <p className="font-pixel text-[10px] text-neon-cyan">CONTINUE?</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Continuar jogando fica sempre no topo.{" "}
                <a href="#buscar" className="text-neon-cyan hover:underline">
                  Insert coin no cabinet
                </a>{" "}
                e marca Jogando — um toque.
              </p>
            </Card>
          </div>
        )}

        {continuar && (
          <CatalogRow
            key={continuar.id}
            id={continuar.id}
            cabinet={continuar.cabinet}
            title={continuar.title}
            games={continuar.games.map(toPosterProps)}
          />
        )}

        <CabinetSearch
          games={games}
          genres={allGenres}
          initialQuery={params.q ?? ""}
          initialStatus={params.status ?? ""}
          initialGenre={params.genre ?? ""}
          initialMonetization={params.monetization ?? ""}
        >
          {prideRows.map((row) => (
            <CatalogRow
              key={row.id}
              id={row.id}
              cabinet={row.cabinet}
              title={row.title}
              games={row.games.map(toPosterProps)}
            />
          ))}
          {rest.map((row) => (
            <CatalogRow
              key={row.id}
              id={row.id}
              cabinet={row.cabinet}
              title={row.title}
              games={row.games.map(toPosterProps)}
            />
          ))}
        </CabinetSearch>
      </div>
    </HubShell>
  );
}
