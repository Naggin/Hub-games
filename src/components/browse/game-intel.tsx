import { MonetizationBadge } from "@/components/browse/monetization-badge";
import { formatScore } from "@/lib/constants";
import {
  monetizationCopy,
  type Monetization,
  type SpoilerFreeSummary,
} from "@/lib/games/catalog";

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
    <div className="space-y-6">
      <section className="relative overflow-hidden border border-neon-cyan/20 bg-card/60">
        <div className="absolute right-4 top-4 rotate-[-8deg] border-2 border-neon-gold/70 px-3 py-1 font-pixel text-[8px] tracking-widest text-neon-gold">
          SEM SPOILER
        </div>
        <div className="grid gap-0 lg:grid-cols-12">
          <div className="border-b border-white/5 p-5 md:p-7 lg:col-span-7 lg:border-b-0 lg:border-r">
            <p className="font-pixel text-[9px] tracking-[0.28em] text-neon-cyan">
              PREMISSA
            </p>
            <p className="mt-4 max-w-2xl text-xl font-medium leading-snug md:text-2xl">
              {summary?.premise ?? pitch ?? synopsis}
            </p>
            {platforms && platforms.length > 0 && (
              <p className="mt-5 text-xs text-muted-foreground">
                {platforms.slice(0, 4).join(" · ")}
              </p>
            )}
          </div>
          <div className="space-y-6 p-5 md:p-7 lg:col-span-5">
            <div>
              <p className="font-pixel text-[8px] tracking-widest text-neon-cyan">
                COMO SE JOGA
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                {summary?.howYouPlay ?? synopsis}
              </p>
            </div>
            {summary ? (
              <div className="score-ticket relative overflow-hidden rounded-r-lg border border-neon-gold/25 p-4 pl-6">
                <p className="font-pixel text-[8px] tracking-widest text-neon-gold">
                  PRA QUEM É
                </p>
                <p className="mt-2 text-sm leading-relaxed">{summary.whoItsFor}</p>
              </div>
            ) : null}
          </div>
        </div>
        {summary && (
          <div className="border-t border-neon-magenta/25 bg-neon-magenta/5 px-5 py-5 md:px-7">
            <p className="font-pixel text-[8px] tracking-widest text-neon-magenta">
              A GALERA DISCUTE — SEM PLOT
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground/90">
              {summary.communityTalks}
            </p>
          </div>
        )}
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-neon-magenta/20 bg-card/70 p-5">
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
        </div>

        <div className="border border-neon-gold/20 bg-card/70 p-5">
          <p className="font-pixel text-[9px] text-neon-gold">PAY TO WIN?</p>
          <div className="mt-3">
            <MonetizationBadge monetization={monetization} />
          </div>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            {copy.blurb}
          </p>
        </div>
      </div>
    </div>
  );
}
