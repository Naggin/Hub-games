"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Crown,
  Gamepad2,
  ListTodo,
  Pencil,
  Skull,
  Star,
  Trophy,
  X,
} from "lucide-react";

import {
  addToRankAction,
  removeFromRankAction,
  moveRankAction,
  savePlayerProfileAction,
  togglePinnedGameAction,
} from "@/app/actions/profile";
import { CoverImage } from "@/components/browse/cover-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { formatScore, getInitials } from "@/lib/constants";
import type { LibraryStatus } from "@/lib/db/schema";
import {
  ACCENT_STYLE,
  BIO_MAX,
  NAME_MAX,
  PINNED_MAX,
  PROFILE_ACCENTS,
  RANK_COPY,
  type PlayerProfile,
  type ProfileAccent,
  type RankListId,
} from "@/lib/profile/types";
import { cn } from "@/lib/utils";

type RankedGame = {
  slug: string;
  title: string;
  coverUrl: string;
  posterUrl: string;
  personalScore: number | null;
  communityScore: number | null;
  status: LibraryStatus | null;
};

type Candidate = { slug: string; title: string };

type ProfileCabinetProps = {
  profile: PlayerProfile;
  stats: {
    platinum: number;
    beaten: number;
    playing: number;
    wishlist: number;
    dropped: number;
    hours: number;
  };
  genrePool: string[];
  pinned: RankedGame[];
  showcase: RankedGame[];
  ranks: Record<RankListId, RankedGame[]>;
  candidates: Record<RankListId | "pinned", Candidate[]>;
};

export function ProfileCabinet(props: ProfileCabinetProps) {
  const accent = ACCENT_STYLE[props.profile.accent];

  return (
    <div className="space-y-10" data-accent={props.profile.accent}>
      <ProfileHero
        profile={props.profile}
        pinned={props.pinned}
        genrePool={props.genrePool}
        candidates={props.candidates.pinned}
        accent={accent}
      />

      <PrideDashboard stats={props.stats} />

      {props.pinned.length > 0 && (
        <section>
          <p className={cn("font-pixel text-[10px]", accent.text)}>VITRINE</p>
          <h2 className="mt-1 text-2xl font-semibold">Jogos no cabinet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Até {PINNED_MAX} capas na frente. O resto mora no ranking.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {props.pinned.map((game) => (
              <ShowcasePoster key={game.slug} game={game} />
            ))}
          </div>
        </section>
      )}

      <section>
        <p className="font-pixel text-[10px] text-emerald-400">ZERADOS & PLATINAS</p>
        <h2 className="mt-1 text-2xl font-semibold">O que você já levou</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Capas de quem zerou ou platinou. Ritual continua de 1 toque na ficha.
        </p>
        {props.showcase.length === 0 ? (
          <Card className="mt-4 border-dashed border-neon-cyan/20 bg-card/70 p-6">
            <p className="text-sm text-muted-foreground">
              Ainda sem capa de orgulho.{" "}
              <Link href="/library" className="text-neon-cyan hover:underline">
                Abre a biblioteca
              </Link>
              , marca Zerei ou Platinei — um toque.
            </p>
          </Card>
        ) : (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2 hide-scrollbar snap-x">
            {props.showcase.map((game) => (
              <div key={game.slug} className="w-[120px] shrink-0 snap-start sm:w-[140px]">
                <ShowcasePoster game={game} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <RankCabinet
          list="platinum"
          games={props.ranks.platinum}
          candidates={props.candidates.platinum}
        />
        <RankCabinet
          list="beaten"
          games={props.ranks.beaten}
          candidates={props.candidates.beaten}
        />
        <RankCabinet
          list="worst"
          games={props.ranks.worst}
          candidates={props.candidates.worst}
        />
      </section>
    </div>
  );
}

function ProfileHero({
  profile,
  pinned,
  genrePool,
  candidates,
  accent,
}: {
  profile: PlayerProfile;
  pinned: RankedGame[];
  genrePool: string[];
  candidates: Candidate[];
  accent: (typeof ACCENT_STYLE)[ProfileAccent];
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-card/80 p-5 md:p-8",
        accent.border,
        accent.glow,
        profile.accent === "cyan" && "trophy-wash-cyan",
        profile.accent === "magenta" && "trophy-wash-magenta",
        profile.accent === "gold" && "trophy-wash-gold",
      )}
    >
      <div className="scanlines pointer-events-none absolute inset-0 opacity-15" />
      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "crt-bezel flex size-20 shrink-0 items-center justify-center rounded-full border-2 font-pixel text-lg md:size-24",
              accent.ring,
              accent.text,
            )}
          >
            {getInitials(profile.displayName)}
          </div>
          <div>
            <p className={cn("font-pixel text-[10px]", accent.text)}>PLAYER CARD</p>
            <h1 className="nameplate-stamp mt-2 inline-block rounded px-3 py-1.5 text-2xl font-semibold tracking-tight md:text-3xl">
              {profile.displayName}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {profile.bio}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {profile.favoriteGenres.map((genre) => (
                <Badge
                  key={genre}
                  variant="outline"
                  className={accent.chip}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <CustomizeSheet
          profile={profile}
          genrePool={genrePool}
          pinned={pinned}
          candidates={candidates}
        />
      </div>
    </section>
  );
}

function PrideDashboard({
  stats,
}: {
  stats: ProfileCabinetProps["stats"];
}) {
  const tiles = [
    { label: "Platinas", value: stats.platinum, icon: Trophy, tone: "text-neon-gold" },
    { label: "Zerados", value: stats.beaten, icon: Star, tone: "text-emerald-400" },
    { label: "Jogando", value: stats.playing, icon: Gamepad2, tone: "text-neon-cyan" },
    { label: "Backlog", value: stats.wishlist, icon: ListTodo, tone: "text-neon-magenta" },
    { label: "Horas", value: stats.hours, icon: Clock, tone: "text-neon-cyan" },
    { label: "Piores", value: stats.dropped, icon: Skull, tone: "text-destructive" },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {tiles.map(({ label, value, icon: Icon, tone }) => (
        <div
          key={label}
          className="rounded-xl border border-neon-cyan/15 bg-card/70 px-3 py-3"
        >
          <dt className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Icon className={cn("size-3.5", tone)} />
            {label}
          </dt>
          <dd className="mt-1 text-2xl font-semibold">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ShowcasePoster({ game }: { game: RankedGame }) {
  return (
    <Link
      href={`/library/${game.slug}`}
      className="group block overflow-hidden rounded-xl border border-neon-cyan/20 bg-card/80"
    >
      <div className="relative aspect-[2/3]">
        <CoverImage
          src={game.posterUrl || game.coverUrl}
          fallbackSrc={game.coverUrl}
          alt={game.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
          sizes="160px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-transparent" />
        {game.status === "platinum" && (
          <Crown className="absolute right-2 top-2 size-4 text-neon-gold" />
        )}
        <p className="absolute inset-x-0 bottom-0 p-2 text-xs font-medium leading-tight">
          {game.title}
        </p>
      </div>
    </Link>
  );
}

function RankCabinet({
  list,
  games,
  candidates,
}: {
  list: RankListId;
  games: RankedGame[];
  candidates: Candidate[];
}) {
  const copy = RANK_COPY[list];
  const [pending, startTransition] = useTransition();
  const tone =
    list === "platinum"
      ? "text-neon-gold"
      : list === "beaten"
        ? "text-emerald-400"
        : "text-destructive";
  const border =
    list === "platinum"
      ? "border-neon-gold/25"
      : list === "beaten"
        ? "border-emerald-400/20"
        : "border-destructive/25";

  function run(action: () => Promise<void>) {
    startTransition(async () => {
      await action();
    });
  }

  return (
    <Card className={cn("border bg-card/75 p-4", border)}>
      <p className={cn("font-pixel text-[9px]", tone)}>{copy.cabinet}</p>
      <h3 className="mt-1 text-lg font-semibold">{copy.title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Sobe e desce. Não é nota — é o teu pódio.
      </p>

      {games.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">{copy.empty}</p>
      ) : (
        <ol className="mt-4 space-y-2">
          {games.map((game, index) => (
            <li
              key={game.slug}
              className="score-ticket relative flex items-center gap-2 rounded-lg border border-white/5 p-1.5 pl-3"
            >
              <span
                className={cn(
                  "w-6 text-center font-pixel text-[10px]",
                  tone,
                )}
              >
                {index + 1}
              </span>
              <Link
                href={`/library/${game.slug}`}
                className="relative size-10 shrink-0 overflow-hidden rounded-md"
              >
                <CoverImage
                  src={game.posterUrl || game.coverUrl}
                  fallbackSrc={game.coverUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/library/${game.slug}`}
                  className="line-clamp-1 text-sm hover:text-neon-cyan"
                >
                  {game.title}
                </Link>
                <p className="text-[10px] text-muted-foreground">
                  Você {game.personalScore ?? "—"} · Casa{" "}
                  {formatScore(game.communityScore)}
                </p>
              </div>
              <div className="flex flex-col">
                <Button
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  disabled={pending || index === 0}
                  aria-label={`Subir ${game.title}`}
                  onClick={() =>
                    run(() => moveRankAction(list, game.slug, -1))
                  }
                >
                  <ChevronUp className="size-3" />
                </Button>
                <Button
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  disabled={pending || index === games.length - 1}
                  aria-label={`Descer ${game.title}`}
                  onClick={() =>
                    run(() => moveRankAction(list, game.slug, 1))
                  }
                >
                  <ChevronDown className="size-3" />
                </Button>
              </div>
              <Button
                type="button"
                size="icon-xs"
                variant="ghost"
                disabled={pending}
                aria-label={`Tirar ${game.title} do ranking`}
                onClick={() =>
                  run(() => removeFromRankAction(list, game.slug))
                }
              >
                <X className="size-3" />
              </Button>
            </li>
          ))}
        </ol>
      )}

      {candidates.length > 0 && (
        <div className="mt-4">
          <label className="sr-only" htmlFor={`add-${list}`}>
            {copy.add}
          </label>
          <select
            id={`add-${list}`}
            disabled={pending}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm"
            onChange={(event) => {
              const slug = event.target.value;
              if (!slug) return;
              run(() => addToRankAction(list, slug));
              event.target.value = "";
            }}
          >
            <option value="">{copy.add}</option>
            {candidates.map((game) => (
              <option key={game.slug} value={game.slug}>
                {game.title}
              </option>
            ))}
          </select>
        </div>
      )}
    </Card>
  );
}

function CustomizeSheet({
  profile,
  genrePool,
  pinned,
  candidates,
}: {
  profile: PlayerProfile;
  genrePool: string[];
  pinned: RankedGame[];
  candidates: Candidate[];
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio);
  const [accent, setAccent] = useState<ProfileAccent>(profile.accent);
  const [genres, setGenres] = useState(profile.favoriteGenres);

  const pinnedTitles = useMemo(
    () => new Map(pinned.map((game) => [game.slug, game.title])),
    [pinned],
  );

  function toggleGenre(genre: string) {
    setGenres((current) =>
      current.includes(genre)
        ? current.filter((item) => item !== genre)
        : current.length >= 6
          ? current
          : [...current, genre],
    );
  }

  function save() {
    startTransition(async () => {
      await savePlayerProfileAction({
        displayName,
        bio,
        accent,
        favoriteGenres: genres,
      });
      setOpen(false);
    });
  }

  function pin(slug: string) {
    startTransition(async () => {
      await togglePinnedGameAction(slug);
    });
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-neon-cyan/40 bg-transparent px-2.5 text-sm text-neon-cyan transition hover:bg-neon-cyan/10">
        <Pencil className="size-4" />
        Customizar
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-neon-cyan/20 bg-card sm:max-w-md"
      >
        <SheetHeader>
          <SheetTitle className="font-pixel text-[11px] text-neon-cyan">
            CUSTOMIZAR PERFIL
          </SheetTitle>
          <SheetDescription>
            Nome, vibe, gêneros e vitrine. Ranking fica nos cabinets — sobe e desce lá.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-8">
          <div className="space-y-2">
            <Label htmlFor="display-name">Nome no cabinet</Label>
            <Input
              id="display-name"
              value={displayName}
              maxLength={NAME_MAX}
              onChange={(event) => setDisplayName(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Tagline</Label>
            <Textarea
              id="bio"
              value={bio}
              maxLength={BIO_MAX}
              onChange={(event) => setBio(event.target.value)}
            />
            <p className="text-[11px] text-muted-foreground">
              {bio.length}/{BIO_MAX}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Cor do neon</p>
            <div className="flex gap-2">
              {PROFILE_ACCENTS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setAccent(item)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs",
                    ACCENT_STYLE[item].chip,
                    accent === item && "ring-2 ring-current",
                  )}
                >
                  {ACCENT_STYLE[item].label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Gêneros favoritos</p>
            <div className="flex flex-wrap gap-1.5">
              {genrePool.slice(0, 18).map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px]",
                    genres.includes(genre)
                      ? "border-neon-cyan/60 bg-neon-cyan/15 text-neon-cyan"
                      : "border-white/10 text-muted-foreground",
                  )}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              Vitrine ({profile.pinnedSlugs.length}/{PINNED_MAX})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {profile.pinnedSlugs.map((slug) => (
                <button
                  key={slug}
                  type="button"
                  onClick={() => pin(slug)}
                  className="rounded-full border border-neon-gold/40 bg-neon-gold/10 px-2.5 py-1 text-[11px] text-neon-gold"
                >
                  {pinnedTitles.get(slug) ?? slug} ×
                </button>
              ))}
            </div>
            {profile.pinnedSlugs.length < PINNED_MAX && candidates.length > 0 && (
              <select
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm"
                defaultValue=""
                disabled={pending}
                onChange={(event) => {
                  const slug = event.target.value;
                  if (!slug) return;
                  pin(slug);
                  event.target.value = "";
                }}
              >
                <option value="">Fixar um jogo da biblioteca</option>
                {candidates.map((game) => (
                  <option key={game.slug} value={game.slug}>
                    {game.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          <Button
            type="button"
            disabled={pending}
            onClick={save}
            className="w-full bg-neon-cyan text-void hover:bg-neon-cyan/90"
          >
            Salvar vibe
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
