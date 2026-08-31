import Link from "next/link";
import { Library, Sparkles } from "lucide-react";

import { CompanionCabinet } from "@/components/companion/companion-cabinet";
import { PrideStats } from "@/components/hub/pride-stats";
import { GameCard } from "@/components/library/game-card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { getAuthUserId } from "@/lib/auth";
import {
  getGamesWithStats,
  getPlayingGamesWithDetails,
  getUserStats,
} from "@/lib/games/queries";

export default async function HubPage() {
  const userId = await getAuthUserId();
  if (!userId) return null;

  const [stats, playing, recent] = await Promise.all([
    getUserStats(userId),
    getPlayingGamesWithDetails(userId),
    getGamesWithStats(userId, { limit: 8 }),
  ]);

  return (
    <div className="space-y-10">
      <Reveal>
        <section className="space-y-2">
          <p className="font-pixel text-[10px] text-neon-cyan">BEM-VINDO DE VOLTA</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Continuar jogando
          </h1>
          <p className="text-muted-foreground">
            Seu ritual começa aqui — um toque pra atualizar o save.
          </p>
        </section>
      </Reveal>

      {playing.length > 0 ? (
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {playing.map(({ game, entry }) => (
            <StaggerItem key={game.id}>
              <GameCard
                slug={game.slug}
                title={game.title}
                coverUrl={game.coverUrl}
                releaseYear={game.releaseYear}
                status={entry.status}
                personalScore={entry.personalScore}
                genres={game.genres}
              />
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <Reveal>
          <Card className="border-dashed border-neon-cyan/20 bg-card/40 p-10 text-center">
            <Sparkles className="mx-auto size-8 text-neon-cyan" />
            <p className="mt-4 font-pixel text-[10px] text-neon-cyan">
              READY PLAYER ONE
            </p>
            <p className="mt-4 text-muted-foreground">
              Nenhum jogo em andamento agora. Escolha um da biblioteca e marque
              como Jogando — ele aparece aqui no próximo login.
            </p>
            <Link
              href="/library"
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-neon-cyan/40 px-4 py-2 text-sm text-neon-cyan transition-colors hover:bg-neon-cyan/10"
            >
              <Library className="size-4" />
              Explorar biblioteca
            </Link>
          </Card>
        </Reveal>
      )}

      <PrideStats stats={stats} />

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Descobrir na biblioteca</h2>
            <Link
              href="/library"
              className="text-sm text-neon-cyan hover:underline"
            >
              Ver tudo
            </Link>
          </div>
          <Stagger className="grid gap-4 sm:grid-cols-2">
            {recent.slice(0, 4).map((game) => (
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
        </div>

        <CompanionCabinet />
      </section>
    </div>
  );
}
