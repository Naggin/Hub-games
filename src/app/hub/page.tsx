import Link from "next/link";

import { CatalogRow } from "@/components/browse/catalog-row";
import { TitleBillboard } from "@/components/browse/title-billboard";
import { HubShell } from "@/components/layout/hub-shell";
import { Card } from "@/components/ui/card";
import { getAuthUserId } from "@/lib/auth";
import { buildCatalogRows, type BrowseGame } from "@/lib/games/catalog";
import {
  getGamesWithStats,
  getPlayingGamesWithDetails,
  getUserStats,
} from "@/lib/games/queries";

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
    userEntry?: {
      status?: string | null;
      personalScore?: number | null;
    } | null;
  },
  extras?: { status?: string | null; personalScore?: number | null },
): BrowseGame {
  return {
    ...game,
    communityScore: game.communityScore ?? null,
    status: extras?.status ?? game.userEntry?.status ?? null,
    personalScore: extras?.personalScore ?? game.userEntry?.personalScore ?? null,
    userEntry: game.userEntry,
  };
}

export default async function HubPage() {
  const userId = await getAuthUserId();
  if (!userId) return null;

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

  return (
    <HubShell browse>
      {featured ? (
        <TitleBillboard
          game={featured}
          isPlaying={playing.some((game) => game.slug === featured.slug)}
          stats={stats}
        />
      ) : (
        <Card className="mx-4 mt-8 border-dashed border-neon-cyan/20 bg-card/40 p-8 text-center md:mx-8">
          <p className="font-pixel text-[10px] text-neon-gold">NO GAME IN PLAY</p>
          <p className="mt-3 text-muted-foreground">
            Nada no cabinet.{" "}
            <Link href="/library" className="text-neon-cyan hover:underline">
              Escolha um jogo na biblioteca
            </Link>{" "}
            e marque como Jogando.
          </p>
        </Card>
      )}

      <div className="relative space-y-10 py-10">
        {playing.length === 0 && featured && (
          <div className="px-4 md:px-8">
            <Card className="border-dashed border-neon-cyan/20 bg-card/40 p-6">
              <p className="font-pixel text-[10px] text-neon-cyan">CONTINUE?</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Continuar jogando fica sempre no topo.{" "}
                <Link href="/library" className="text-neon-cyan hover:underline">
                  Insert coin na biblioteca
                </Link>{" "}
                e marca Jogando — um toque.
              </p>
            </Card>
          </div>
        )}

        {rows.map((row) => (
          <CatalogRow
            key={row.id}
            cabinet={row.cabinet}
            title={row.title}
            games={row.games.map((game) => ({
              slug: game.slug,
              title: game.title,
              coverUrl: game.coverUrl,
              synopsis: game.synopsis,
              releaseYear: game.releaseYear,
              communityScore: game.communityScore,
              personalScore: game.personalScore ?? game.userEntry?.personalScore,
              communityTake: game.communityTake,
              monetization: game.monetization,
              status: game.status ?? game.userEntry?.status,
              genres: game.genres,
            }))}
          />
        ))}
      </div>
    </HubShell>
  );
}
