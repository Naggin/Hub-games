"use client";

import { useState, useTransition } from "react";

import { updateLibrarySaveAction } from "@/app/actions/library";
import { Input } from "@/components/ui/input";
import type { LibraryStatus } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

const SCORE_PAD = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
const HOUR_CHIPS = [10, 25, 50, 100] as const;

export function SaveStrip({
  gameId,
  slug,
  status,
  personalScore,
  hoursPlayed,
}: {
  gameId: string;
  slug: string;
  status?: LibraryStatus | null;
  personalScore?: number | null;
  hoursPlayed?: number | null;
}) {
  const [score, setScore] = useState<number | null>(personalScore ?? null);
  const [hours, setHours] = useState(
    hoursPlayed != null ? String(hoursPlayed) : "",
  );
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function parseHours(raw: string) {
    const trimmed = raw.trim();
    if (trimmed === "") return null;
    const value = Number(trimmed);
    if (Number.isNaN(value) || value < 0) return null;
    return value;
  }

  function persist(nextScore: number | null, nextHoursRaw: string) {
    const nextHours = parseHours(nextHoursRaw);
    startTransition(async () => {
      await updateLibrarySaveAction(
        gameId,
        slug,
        nextScore,
        nextHours,
        status ?? "wishlist",
      );
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1600);
    });
  }

  return (
    <section className="score-ticket relative overflow-hidden rounded-r-xl border border-neon-cyan/20 p-4 md:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-pixel text-[9px] tracking-[0.28em] text-neon-cyan">
          SEU SAVE
        </p>
        <p className="text-[11px] text-muted-foreground">
          {pending
            ? "Gravando..."
            : saved
              ? "Save gravado"
              : "Um toque. Sem ficha extra."}
        </p>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Nota e horas — opcional. O ritual em cima já cravou o status.
      </p>

      <div className="mt-4 space-y-2">
        <p className="text-xs text-muted-foreground">Nota (1–10)</p>
        <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
          {SCORE_PAD.map((value) => (
            <button
              key={value}
              type="button"
              disabled={pending}
              aria-pressed={score === value}
              aria-label={`Nota ${value} de 10`}
              onClick={() => {
                setScore(value);
                persist(value, hours);
              }}
              className={cn(
                "h-10 rounded-lg border text-sm tabular-nums transition",
                score === value
                  ? "border-neon-magenta bg-neon-magenta/20 text-neon-magenta"
                  : "border-neon-cyan/20 bg-secondary/40 text-foreground hover:border-neon-cyan/50",
              )}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-xs text-muted-foreground">Horas</p>
        <div className="flex flex-wrap items-center gap-2">
          {HOUR_CHIPS.map((value) => (
            <button
              key={value}
              type="button"
              disabled={pending}
              aria-pressed={Number(hours) === value}
              onClick={() => {
                const next = String(value);
                setHours(next);
                persist(score, next);
              }}
              className={cn(
                "h-9 rounded-full border px-3 text-xs tabular-nums transition",
                Number(hours) === value
                  ? "border-neon-cyan bg-neon-cyan/15 text-neon-cyan"
                  : "border-neon-cyan/20 bg-secondary/40 text-muted-foreground hover:border-neon-cyan/50 hover:text-foreground",
              )}
            >
              {value}h
            </button>
          ))}
          <Input
            id="hours-played"
            inputMode="decimal"
            min={0}
            step="0.5"
            value={hours}
            disabled={pending}
            aria-label="Horas jogadas"
            onChange={(event) => setHours(event.target.value)}
            onBlur={() => persist(score, hours)}
            placeholder="ou digita"
            className="h-9 w-28 border-neon-cyan/20 bg-secondary/40 tabular-nums"
          />
        </div>
      </div>
    </section>
  );
}
