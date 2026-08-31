import { notFound } from "next/navigation";

import { CoverImage } from "@/components/browse/cover-image";
import { FichaDossier } from "@/components/browse/ficha-dossier";
import { GameIntel } from "@/components/browse/game-intel";
import { MonetizationBadge } from "@/components/browse/monetization-badge";
import { HubShell } from "@/components/layout/hub-shell";
import { CommunityNoteForm } from "@/components/library/community-note-form";
import { ProgressRitual } from "@/components/library/progress-ritual";
import { SaveStrip } from "@/components/library/save-strip";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getAuthUserId } from "@/lib/auth";
import { formatScore } from "@/lib/constants";
import { getCatalogIntel } from "@/lib/games/catalog";
import { isPtBrLanguage } from "@/lib/games/ficha";
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
  const posterUrl = "posterUrl" in game ? game.posterUrl : intel.posterUrl;
  const ficha = intel.ficha;
  const ptBr =
    ficha.languages.status === "ready"
      ? ficha.languages.tracks.find((track) => isPtBrLanguage(track.name))
      : undefined;

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
        <div className="absolute inset-0 bg-gradient-to-r from-void/85 via-void/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-void/75 via-transparent to-void/20" />
        <div className="scanlines pointer-events-none absolute inset-0 opacity-20" />

        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-end gap-8 px-4 pb-10 pt-28 md:flex-row md:items-end md:px-8">
          <div className="flex-1">
            <p className="font-pixel text-[10px] text-neon-cyan text-glow-cyan">
              FICHA DO CABINET
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
              {game.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-foreground/90">{pitch}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <MonetizationBadge monetization={monetization} />
              {ptBr && (ptBr.interface || ptBr.audio || ptBr.subtitles) ? (
                <Badge className="border-neon-gold/50 bg-neon-gold/15 text-neon-gold">
                  PT-BR {ptBr.audio ? "áudio" : "texto"}
                </Badge>
              ) : ficha.languages.status === "ready" ? (
                <Badge variant="outline" className="border-white/20 text-muted-foreground">
                  Sem PT-BR
                </Badge>
              ) : (
                <Badge variant="outline" className="border-white/20 text-muted-foreground">
                  ainda sem ficha de idioma
                </Badge>
              )}
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
              {ficha.platforms.slice(0, 4).map((platform) => (
                <Badge
                  key={platform}
                  variant="outline"
                  className="border-neon-cyan/30 text-neon-cyan"
                >
                  {platform}
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
          <div className="relative hidden w-[180px] shrink-0 overflow-hidden rounded-xl border border-neon-cyan/25 shadow-[0_0_28px_rgba(0,245,255,0.12)] md:block">
            <div className="relative aspect-[2/3]">
              <CoverImage
                src={posterUrl || game.coverUrl}
                fallbackSrc={game.coverUrl}
                alt={game.title}
                fill
                className="object-cover"
                sizes="180px"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-8">
        <ProgressRitual
          gameId={game.id}
          slug={game.slug}
          currentStatus={userEntry?.status}
        />

        <SaveStrip
          gameId={game.id}
          slug={game.slug}
          status={userEntry?.status}
          personalScore={userEntry?.personalScore}
          hoursPlayed={userEntry?.hoursPlayed}
        />

        <GameIntel
          pitch={pitch}
          synopsis={game.synopsis}
          summary={intel.summary}
          communityScore={communityScore}
          communityReviewCount={communityReviewCount}
          communityTake={communityTake}
          monetization={monetization}
          personalScore={userEntry?.personalScore}
          metacritic={game.metacritic}
        />

        <FichaDossier ficha={ficha} />

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
                  className="border-neon-magenta/10 bg-card/70 p-4"
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
