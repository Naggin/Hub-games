import { LibraryExplorer } from "@/components/library/library-explorer";
import { HubShell } from "@/components/layout/hub-shell";
import { getAuthUserId } from "@/lib/auth";
import { getGamesWithStats } from "@/lib/games/queries";

export default async function LibraryPage({
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
  const games = await getGamesWithStats(userId, {
    search: params.q,
    status: params.status as never,
    genre: params.genre,
    limit: 200,
  });

  const allGenres = Array.from(
    new Set(games.flatMap((game) => game.genres)),
  ).slice(0, 12);

  return (
    <HubShell>
      <div className="space-y-8">
        <section>
          <p className="font-pixel text-[10px] text-neon-magenta">BIBLIOTECA</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Catálogo de sonhos
          </h1>
          <p className="mt-2 text-muted-foreground">
            {games.length} jogos no cabinet — busca, filtro, e o selo de P2W na capa.
          </p>
        </section>

        <LibraryExplorer
          games={games}
          genres={allGenres}
          initialQuery={params.q ?? ""}
          initialStatus={params.status ?? ""}
          initialGenre={params.genre ?? ""}
          initialMonetization={params.monetization ?? ""}
        />
      </div>
    </HubShell>
  );
}
