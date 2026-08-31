"use client";

import { useState, useTransition } from "react";

import { submitCommunityNoteAction } from "@/app/actions/library";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CommunityNoteForm({
  gameId,
  slug,
  existingScore,
  existingBody,
}: {
  gameId: string;
  slug: string;
  existingScore?: number | null;
  existingBody?: string | null;
}) {
  const [score, setScore] = useState(existingScore ?? 8);
  const [body, setBody] = useState(existingBody ?? "");
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      await submitCommunityNoteAction(gameId, score, body, slug);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-neon-magenta/20 bg-card/70 p-4">
      <p className="font-pixel text-[10px] text-neon-magenta">SUA NOTA PRA COMUNIDADE</p>

      <div className="space-y-2">
        <Label htmlFor="score">Nota ({score}/10)</Label>
        <input
          id="score"
          type="range"
          min={1}
          max={10}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="w-full accent-neon-magenta"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">Comentário</Label>
        <Textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Vale a platina? Como é o final?"
          required
          minLength={10}
          className="border-neon-magenta/20 bg-secondary/40"
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="bg-neon-magenta text-white hover:bg-neon-magenta/90"
      >
        {pending ? "Salvando..." : saved ? "Salvo!" : "Publicar nota"}
      </Button>
    </form>
  );
}
