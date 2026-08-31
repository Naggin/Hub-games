import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { ArrowLeft } from "lucide-react";

import { CompanionCabinet } from "@/components/companion/companion-cabinet";
import { CommunityNoteForm } from "@/components/library/community-note-form";
import { ProgressRitual } from "@/components/library/progress-ritual";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getAuthUserId } from "@/lib/auth";
import { formatScore } from "@/lib/constants";
import { getGameWithFullDetails } from "@/lib/games/queries";

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const userId = await getAuthUserId();
  if (!userId) return null;

  const data = await getGameWithFullDetails(slug, userId);
  if (!data) notFound();

  const { game, communityScore, communityReviewCount, userEntry, notes } = data;
  const userNote = notes.find((note) => note.userId === userId);

  return (
    <div className="space-y-6">
      <Link
        href="/library"
        transitionTypes={["nav-back"]}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-neon-cyan"
      >
        <ArrowLeft className="size-4" />
        Voltar para a biblioteca
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="relative aspect-[460/215] overflow-hidden rounded-2xl border border-neon-cyan/20">
            <ViewTransition name={`cover-${game.slug}`} share="morph" default="none">
              <Image
                src={game.coverUrl}
                alt={game.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </ViewTransition>
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />
            <div className="absolute bottom-0 p-6">
              <p className="font-pixel text-[10px] text-neon-cyan">FICHA DO JOGO</p>
              <h1 className="mt-2 text-3xl font-semibold">{game.title}</h1>
              {game.releaseYear && (
                <p className="text-muted-foreground">{game.releaseYear}</p>
              )}
            </div>
          </div>

          <Reveal delay={0.05}>
            <Card className="border-neon-cyan/10 bg-card/50 p-6">
              <p className="leading-relaxed text-muted-foreground">
                {game.synopsis}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {game.genres.map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <span>
                  Comunidade:{" "}
                  <strong className="text-neon-cyan">
                    {formatScore(communityScore)}
                  </strong>{" "}
                  ({communityReviewCount} notas)
                </span>
                {game.metacritic && (
                  <span>
                    Metacritic:{" "}
                    <strong className="text-neon-gold">{game.metacritic}</strong>
                  </span>
                )}
                <span>
                  Plataformas: {game.platforms.slice(0, 4).join(", ")}
                </span>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={0.1}>
            <ProgressRitual
              gameId={game.id}
              slug={game.slug}
              currentStatus={userEntry?.status}
            />
          </Reveal>

          <Separator className="bg-neon-cyan/10" />

          <CommunityNoteForm
            gameId={game.id}
            slug={game.slug}
            existingScore={userNote?.score}
            existingBody={userNote?.body}
          />

          {notes.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Notas da comunidade</h2>
              <div className="space-y-3">
                {notes.slice(0, 8).map((note) => (
                  <Card
                    key={note.id}
                    className="border-neon-magenta/10 bg-card/40 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-neon-magenta">
                        Player • {note.score}/10
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{note.body}</p>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>

        <CompanionCabinet />
      </div>
    </div>
  );
}
