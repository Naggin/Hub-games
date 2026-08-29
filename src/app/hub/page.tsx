import Link from "next/link";
import { Trophy, Gamepad2, Star, Clock } from "lucide-react";

import { CompanionCabinet } from "@/components/companion/companion-cabinet";
import { HubShell } from "@/components/layout/hub-shell";
import { GameCard } from "@/components/library/game-card";
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

  const statCards = [
    { label: "Jogando", value: stats.playing, icon: Gamepad2, color: "text-neon-cyan" },
    { label: "Zerados", value: stats.beaten, icon: Star, color: "text-emerald-400" },
    { label: "Platinas", value: stats.platinum, icon: Trophy, color: "text-neon-gold" },
    { label: "Horas", value: stats.hours, icon: Clock, color: "text-neon-magenta" },
  ];

  return (
    <HubShell>
      <div className="space-y-10">
        <section className="space-y-2">
          <p className="font-pixel text-[10px] text-neon-cyan">BEM-VINDO DE VOLTA</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Continuar jogando
          </h1>
          <p className="text-muted-foreground">
            Seu ritual começa aqui — um toque pra atualizar o save.
          </p>
        </section>

        {playing.length > 0 ? (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {playing.map(({ game, entry }) => (
              <GameCard
                key={game.id}
                slug={game.slug}
                title={game.title}
                coverUrl={game.coverUrl}
                releaseYear={game.releaseYear}
                status={entry.status}
                personalScore={entry.personalScore}
                genres={game.genres}
              />
            ))}
          </section>
        ) : (
          <Card className="border-dashed border-neon-cyan/20 bg-card/40 p-8 text-center">
            <p className="text-muted-foreground">
              Nada em andamento.{" "}
              <Link href="/library" className="text-neon-cyan hover:underline">
                Escolha um jogo na biblioteca
              </Link>{" "}
              e marque como Jogando.
            </p>
          </Card>
        )}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <Card
              key={label}
              className="border-neon-cyan/10 bg-card/50 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-1 text-3xl font-semibold">{value}</p>
                </div>
                <Icon className={`size-8 ${color}`} />
              </div>
            </Card>
          ))}
        </section>

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
            <div className="grid gap-4 sm:grid-cols-2">
              {recent.slice(0, 4).map((game) => (
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
          </div>

          <CompanionCabinet />
        </section>
      </div>
    </HubShell>
  );
}
