"use client";

import {
  useOptimistic,
  useState,
  useTransition,
  type TransitionStartFunction,
} from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

import {
  addToRankAction,
  moveRankAction,
  removeFromRankAction,
  savePlayerProfileAction,
  setAccentAction,
  togglePinnedGameAction,
} from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  ACCENT_STYLE,
  BIO_MAX,
  NAME_MAX,
  NAMEPLATE_MAX,
  PROFILE_ACCENTS,
  RANK_COPY,
  RANK_LISTS,
  type ProfileAccent,
  type RankListId,
} from "@/lib/profile/types";
import { cn } from "@/lib/utils";

import type { CabinetView } from "./cabinet-view";

export function OperatorDoor({
  cabinet,
  accent,
  onAccentPreview,
}: {
  cabinet: CabinetView;
  accent: ProfileAccent;
  onAccentPreview: (accent: ProfileAccent) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState(cabinet.profile.displayName);
  const [nameplate, setNameplate] = useState(cabinet.profile.nameplate);
  const [bio, setBio] = useState(cabinet.profile.bio);
  const [genres, setGenres] = useOptimistic(
    cabinet.profile.favoriteGenres,
    (_current: string[], next: string[]) => next,
  );

  function saveIdentity() {
    startTransition(async () => {
      await savePlayerProfileAction({
        displayName: name,
        nameplate,
        bio,
        favoriteGenres: genres,
      });
    });
  }

  function pickAccent(next: ProfileAccent) {
    startTransition(async () => {
      onAccentPreview(next);
      await setAccentAction(next);
    });
  }

  function toggleGenre(genre: string) {
    const next = genres.includes(genre)
      ? genres.filter((item) => item !== genre)
      : [...genres, genre].slice(0, 6);
    startTransition(async () => {
      setGenres(next);
      await savePlayerProfileAction({ favoriteGenres: next });
    });
  }

  return (
    <Sheet>
      <SheetTrigger
        className={cn(
          "group fixed right-4 z-40 flex items-center gap-3 rounded-l-sm border-y border-l px-3 py-3",
          "border-neon-gold/50 bg-void/90 backdrop-blur-md",
          "bottom-4 md:bottom-8",
        )}
      >
        <span className="block h-10 w-2 rounded-full bg-gradient-to-b from-neon-gold via-neon-magenta to-neon-cyan shadow-[0_0_12px_rgba(255,215,0,0.45)]" />
        <span className="text-left">
          <span className="block font-pixel text-[8px] tracking-widest text-neon-gold">
            OPERATOR
          </span>
          <span className="block text-xs text-muted-foreground">
            Abre o gabinete
          </span>
        </span>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto border-neon-gold/25 bg-void sm:max-w-lg"
      >
        <SheetHeader className="border-b border-neon-gold/15 p-5">
          <SheetTitle className="font-pixel text-[11px] tracking-widest text-neon-gold">
            MODO OPERADOR
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Isso muda a sala — não um card igual. Placa, néon, vitrine, ranking.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8 p-5">
          <section>
            <p className="font-pixel text-[8px] tracking-widest text-muted-foreground">
              NÉON DA SALA
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {PROFILE_ACCENTS.map((next) => {
                const style = ACCENT_STYLE[next];
                const active = accent === next;
                return (
                  <button
                    key={next}
                    type="button"
                    onClick={() => pickAccent(next)}
                    className={cn(
                      "rounded-lg border px-2 py-3 text-center transition",
                      style.border,
                      active ? cn(style.glow, "bg-card") : "bg-card/40 opacity-70",
                    )}
                  >
                    <span
                      className={cn(
                        "mx-auto block h-8 w-8 rounded-full border",
                        style.ring,
                        next === "cyan" && "bg-neon-cyan/80",
                        next === "magenta" && "bg-neon-magenta/80",
                        next === "gold" && "bg-neon-gold/80",
                      )}
                    />
                    <span className={cn("mt-2 block text-xs font-medium", style.text)}>
                      {style.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {ACCENT_STYLE[accent].vibe}
            </p>
          </section>

          <section className="space-y-3">
            <p className="font-pixel text-[8px] tracking-widest text-muted-foreground">
              PLACA DO CABINET
            </p>
            <div className="grid gap-3">
              <div>
                <Label htmlFor="player-name">Nome no marquee</Label>
                <Input
                  id="player-name"
                  value={name}
                  maxLength={NAME_MAX}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-1 h-10 text-base"
                />
              </div>
              <div>
                <Label htmlFor="player-plate">Nameplate (estampa)</Label>
                <Input
                  id="player-plate"
                  value={nameplate}
                  maxLength={NAMEPLATE_MAX}
                  onChange={(event) => setNameplate(event.target.value.toUpperCase())}
                  className="mt-1 h-10 font-pixel text-[11px] tracking-widest"
                />
              </div>
              <div>
                <Label htmlFor="player-bio">Uma linha pra flexionar</Label>
                <Textarea
                  id="player-bio"
                  value={bio}
                  maxLength={BIO_MAX}
                  onChange={(event) => setBio(event.target.value)}
                  className="mt-1 min-h-20"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {bio.length}/{BIO_MAX}
                </p>
              </div>
              <Button
                type="button"
                onClick={saveIdentity}
                disabled={pending}
                className="bg-neon-gold text-void hover:bg-neon-gold/90"
              >
                Gravar placa
              </Button>
            </div>
          </section>

          <section>
            <p className="font-pixel text-[8px] tracking-widest text-muted-foreground">
              ADESIVOS DE GÊNERO
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {cabinet.genrePool.slice(0, 18).map((genre) => {
                const on = genres.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs",
                      on
                        ? ACCENT_STYLE[accent].chip
                        : "border-white/10 text-muted-foreground",
                    )}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </section>

          <PinnedEditor cabinet={cabinet} pending={pending} startTransition={startTransition} />

          {RANK_LISTS.map((list) => (
            <RankEditor
              key={list}
              list={list}
              cabinet={cabinet}
              pending={pending}
              startTransition={startTransition}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function PinnedEditor({
  cabinet,
  pending,
  startTransition,
}: {
  cabinet: CabinetView;
  pending: boolean;
  startTransition: TransitionStartFunction;
}) {
  return (
    <section>
      <p className="font-pixel text-[8px] tracking-widest text-muted-foreground">
        VITRINE (ATÉ 4)
      </p>
      <ul className="mt-3 space-y-2">
        {cabinet.pinned.map((game) => (
          <li
            key={game.slug}
            className="flex items-center justify-between gap-2 rounded-md border border-white/10 bg-card/50 px-3 py-2 text-sm"
          >
            <span className="truncate">{game.title}</span>
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await togglePinnedGameAction(game.slug);
                })
              }
              className="text-muted-foreground hover:text-neon-magenta"
              aria-label={`Tirar ${game.title} da vitrine`}
            >
              <X className="size-4" />
            </button>
          </li>
        ))}
      </ul>
      {cabinet.candidates.pinned.length > 0 && cabinet.pinned.length < 4 && (
        <select
          className="mt-2 h-9 w-full rounded-lg border border-input bg-card/70 px-2 text-sm"
          defaultValue=""
          onChange={(event) => {
            const slug = event.target.value;
            event.target.value = "";
            if (!slug) return;
            startTransition(async () => {
              await togglePinnedGameAction(slug);
            });
          }}
        >
          <option value="">Pin na parede de CRT…</option>
          {cabinet.candidates.pinned.map((game) => (
            <option key={game.slug} value={game.slug}>
              {game.title}
            </option>
          ))}
        </select>
      )}
    </section>
  );
}

function RankEditor({
  list,
  cabinet,
  pending,
  startTransition,
}: {
  list: RankListId;
  cabinet: CabinetView;
  pending: boolean;
  startTransition: TransitionStartFunction;
}) {
  const copy = RANK_COPY[list];
  const games = cabinet.ranks[list];
  const candidates = cabinet.candidates[list];

  return (
    <section>
      <p className="font-pixel text-[8px] tracking-widest text-muted-foreground">
        {copy.cabinet} · {copy.title.toUpperCase()}
      </p>
      <ul className="mt-3 space-y-2">
        {games.map((game, index) => (
          <li
            key={game.slug}
            className="flex items-center gap-2 rounded-md border border-white/10 bg-card/50 px-2 py-1.5"
          >
            <span className="w-6 font-pixel text-[9px] text-neon-gold">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm">{game.title}</span>
            <div className="flex gap-1">
              <IconBtn
                disabled={pending || index === 0}
                label={`Subir ${game.title}`}
                onClick={() =>
                  startTransition(async () => {
                    await moveRankAction(list, game.slug, -1);
                  })
                }
              >
                <ChevronUp className="size-4" />
              </IconBtn>
              <IconBtn
                disabled={pending || index === games.length - 1}
                label={`Descer ${game.title}`}
                onClick={() =>
                  startTransition(async () => {
                    await moveRankAction(list, game.slug, 1);
                  })
                }
              >
                <ChevronDown className="size-4" />
              </IconBtn>
              <IconBtn
                disabled={pending}
                label={`Tirar ${game.title}`}
                onClick={() =>
                  startTransition(async () => {
                    await removeFromRankAction(list, game.slug);
                  })
                }
              >
                <X className="size-4" />
              </IconBtn>
            </div>
          </li>
        ))}
      </ul>
      {candidates.length > 0 && (
        <select
          className="mt-2 h-9 w-full rounded-lg border border-input bg-card/70 px-2 text-sm"
          defaultValue=""
          onChange={(event) => {
            const slug = event.target.value;
            event.target.value = "";
            if (!slug) return;
            startTransition(async () => {
              await addToRankAction(list, slug);
            });
          }}
        >
          <option value="">{copy.add}…</option>
          {candidates.map((game) => (
            <option key={game.slug} value={game.slug}>
              {game.title}
            </option>
          ))}
        </select>
      )}
    </section>
  );
}

function IconBtn({
  children,
  label,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="rounded p-1 text-muted-foreground hover:bg-white/5 hover:text-foreground disabled:opacity-30"
    >
      {children}
    </button>
  );
}
