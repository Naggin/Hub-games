import { MonetizationBadge } from "@/components/browse/monetization-badge";
import { Card } from "@/components/ui/card";
import { formatScore } from "@/lib/constants";
import { monetizationCopy, type Monetization } from "@/lib/games/catalog";

export function GameIntel({
  pitch,
  synopsis,
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
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-neon-cyan/15 bg-card/70 p-5">
        <p className="font-pixel text-[9px] text-neon-cyan">O QUE É</p>
        {pitch && (
          <p className="mt-3 text-base font-medium leading-snug">{pitch}</p>
        )}
        {(!pitch || synopsis.trim() !== pitch.trim()) && (
          <p className="mt-3 leading-relaxed text-muted-foreground">{synopsis}</p>
        )}
        {platforms && platforms.length > 0 && (
          <p className="mt-4 text-xs text-muted-foreground">
            {platforms.slice(0, 4).join(" · ")}
          </p>
        )}
      </Card>

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
          <strong className="text-neon-magenta">{personalScore ?? "—"}</strong>
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
        <p className="mt-3 leading-relaxed text-muted-foreground">{copy.blurb}</p>
      </Card>
    </div>
  );
}
