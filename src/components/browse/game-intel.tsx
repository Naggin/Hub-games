import { MonetizationBadge } from "@/components/browse/monetization-badge";
import { Card } from "@/components/ui/card";
import { formatScore } from "@/lib/constants";
import {
  monetizationCopy,
  type Monetization,
  type SpoilerFreeSummary,
} from "@/lib/games/catalog";

function Beat({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-secondary/40 p-4">
      <p className="font-pixel text-[8px] tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90">{text}</p>
    </div>
  );
}

export function GameIntel({
  pitch,
  synopsis,
  summary,
  communityScore,
  communityReviewCount,
  communityTake,
  monetization,
  personalScore,
  metacritic,
  platforms,
}: {
  pitch?: string;
  synopsis: string;
  summary?: SpoilerFreeSummary;
  communityScore: number | null;
  communityReviewCount: number;
  communityTake: string;
  monetization: Monetization;
  personalScore?: number | null;
  metacritic?: number | null;
  platforms?: string[];
}) {
  const copy = monetizationCopy[monetization];

  return (
    <div className="space-y-4">
      <Card className="border-neon-cyan/15 bg-card/70 p-5 md:p-6">
        <p className="font-pixel text-[9px] text-neon-cyan">O QUE É</p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Sem spoiler de história — premissa, loop e pra quem é.
        </p>
        {pitch && (
          <p className="mt-3 max-w-3xl text-lg font-medium leading-snug">
            {pitch}
          </p>
        )}
        {summary ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Beat label="PREMISSA" text={summary.premise} />
            <Beat label="COMO SE JOGA" text={summary.howYouPlay} />
            <Beat label="PRA QUEM É" text={summary.whoItsFor} />
            <Beat label="A GALERA DISCUTE" text={summary.communityTalks} />
          </div>
        ) : (
          (!pitch || synopsis.trim() !== pitch.trim()) && (
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {synopsis}
            </p>
          )
        )}
        {platforms && platforms.length > 0 && (
          <p className="mt-4 text-xs text-muted-foreground">
            {platforms.slice(0, 4).join(" · ")}
          </p>
        )}
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-neon-magenta/20 bg-card/70 p-5">
          <p className="font-pixel text-[9px] text-neon-magenta">A GALERA</p>
          <p className="mt-3 text-2xl font-semibold text-neon-cyan">
            {formatScore(communityScore)}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              /10 · {communityReviewCount} notas
            </span>
          </p>
          <p className="mt-2 text-sm">
            Você:{" "}
            <strong className="text-neon-magenta">
              {personalScore ?? "—"}
            </strong>
            {metacritic != null && (
              <>
                {" · "}Metacritic{" "}
                <strong className="text-neon-gold">{metacritic}</strong>
              </>
            )}
          </p>
          <blockquote className="mt-3 text-sm leading-relaxed text-muted-foreground">
            “{communityTake}”
          </blockquote>
        </Card>

        <Card className="border-neon-gold/20 bg-card/70 p-5">
          <p className="font-pixel text-[9px] text-neon-gold">PAY TO WIN?</p>
          <div className="mt-3">
            <MonetizationBadge monetization={monetization} />
          </div>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            {copy.blurb}
          </p>
        </Card>
      </div>
    </div>
  );
}
