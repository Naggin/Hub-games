"use client";

import { useState, useTransition } from "react";

import { updateLibrarySaveAction } from "@/app/actions/library";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LibraryStatus } from "@/lib/db/schema";

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
  const [score, setScore] = useState(personalScore != null ? String(personalScore) : "");
  const [hours, setHours] = useState(hoursPlayed != null ? String(hoursPlayed) : "");
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextScore = score.trim() === "" ? null : Number(score);
    const nextHours = hours.trim() === "" ? null : Number(hours);
    if (nextScore != null && (nextScore < 1 || nextScore > 10 || Number.isNaN(nextScore))) {
      return;
    }
    if (nextHours != null && (nextHours < 0 || Number.isNaN(nextHours))) {
      return;
    }

    startTransition(async () => {
      await updateLibrarySaveAction(
        gameId,
        slug,
        nextScore,
        nextHours,
        status ?? "wishlist",
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="score-ticket relative overflow-hidden rounded-r-xl border border-neon-cyan/20 p-4 md:p-5"
    >
      <p className="font-pixel text-[9px] tracking-[0.28em] text-neon-cyan">
        SEU SAVE
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Nota e horas — opcional. O ritual em cima já cravou o status.
      </p>
      <div className="mt-4 flex flex-wrap items-end gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="personal-score" className="text-xs text-muted-foreground">
            Nota (1–10)
          </Label>
          <Input
            id="personal-score"
            inputMode="numeric"
            min={1}
            max={10}
            value={score}
            onChange={(event) => setScore(event.target.value)}
            placeholder="—"
            className="h-10 w-24 border-neon-cyan/20 bg-secondary/40 tabular-nums"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hours-played" className="text-xs text-muted-foreground">
            Horas
          </Label>
          <Input
            id="hours-played"
            inputMode="decimal"
            min={0}
            step="0.5"
            value={hours}
            onChange={(event) => setHours(event.target.value)}
            placeholder="0"
            className="h-10 w-28 border-neon-cyan/20 bg-secondary/40 tabular-nums"
          />
        </div>
        <Button
          type="submit"
          disabled={pending}
          className="bg-neon-cyan text-void hover:bg-neon-cyan/90"
        >
          {pending ? "Salvando..." : saved ? "Save gravado" : "Gravar save"}
        </Button>
      </div>
    </form>
  );
}
