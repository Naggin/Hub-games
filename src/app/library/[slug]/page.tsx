import { notFound } from "next/navigation";

import { CoverImage } from "@/components/browse/cover-image";
import { GameIntel } from "@/components/browse/game-intel";
import { MonetizationBadge } from "@/components/browse/monetization-badge";
import { HubShell } from "@/components/layout/hub-shell";
import { CommunityNoteForm } from "@/components/library/community-note-form";
import { ProgressRitual } from "@/components/library/progress-ritual";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getAuthUserId } from "@/lib/auth";
import { formatScore } from "@/lib/constants";
import { getCatalogIntel } from "@/lib/games/catalog";
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
  const intel = getCatalogIntel({
    ...game,
    communityScore,
  });
  const monetization =
    "monetization" in game ? game.monetization : intel.monetization;
  const communityTake =
    "communityTake" in game ? game.communityTake : intel.communityTake;
  const pitch = "pitch" in game ? game.pitch : intel.pitch;
  const backdropUrl =
    "backdropUrl" in game ? game.backdropUrl : intel.backdropUrl;

  return (
    <HubShell browse>
      <section className="relative isolate min-h-[70vh] overflow-hidden border-b border-neon-cyan/20">
        <CoverImage
          src={backdropUrl || game.coverUrl}
          fallbackSrc={game.coverUrl}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/80 to-void/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/40" />
        <div className="scanlines pointer-events-none absolute inset-0 opacity-20" />

        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-end px-4 pb-10 pt-28 md:px-8">
          <p className="font-pixel text-[10px] text-neon-cyan text-glow-cyan">
            FICHA DO CABINET
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
            {game.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-foreground/90">{pitch}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <MonetizationBadge monetization={monetization} />
            {game.releaseYear && (
              <Badge variant="outline" className="border-white/20 text-muted-foreground">
                {game.releaseYear}
              </Badge>
            )}
            {game.genres.map((genre) => (
              <Badge key={genre} variant="secondary">
                {genre}
              </Badge>
            ))}
          </div>
          <p className="mt-4 text-sm">
            Comunidade{" "}
            <strong className="text-neon-cyan">{formatScore(communityScore)}</strong>
            <span className="text-muted-foreground">
              {" "}
              · “{communityTake}”
            </span>
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-8">
        <GameIntel
          pitch={pitch}
          synopsis={game.synopsis}
          communityScore={communityScore}
          communityReviewCount={communityReviewCount}
          communityTake={communityTake}
          monetization={monetization}
          personalScore={userEntry?.personalScore}
          metacritic={game.metacritic}
          platforms={game.platforms}
        />

        <ProgressRitual
          gameId={game.id}
          slug={game.slug}
          currentStatus={userEntry?.status}
        />

        <Separator className="bg-neon-cyan/10" />

        <CommunityNoteForm
          gameId={game.id}
          slug={game.slug}
          existingScore={userNote?.score}
          existingBody={userNote?.body}
        />

        {notes.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-pixel text-[10px] text-neon-magenta">
              NOTAS DA COMUNIDADE
            </h2>
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
    </HubShell>
  );
}
