"use client";

import Link from "next/link";
import { useOptimistic } from "react";
import { motion, useReducedMotion } from "motion/react";

import { CoverImage } from "@/components/browse/cover-image";
import { OperatorDoor } from "@/components/profile/operator-door";
import { formatScore } from "@/lib/constants";
import {
  ACCENT_STYLE,
  padRank,
  stampNameplate,
  type ProfileAccent,
  type RankedCabinetGame,
} from "@/lib/profile/types";
import { cn } from "@/lib/utils";

import type { CabinetView } from "./cabinet-view";

const ROASTS = [
  "O gabinete ainda reclama.",
  "Dropou. Sem replay. Sem desculpa.",
  "Nota baixa, peito aberto.",
  "A casa não esquece esse tilt.",
  "Friendly fire no próprio save.",
];

export function TrophyRoom({ cabinet }: { cabinet: CabinetView }) {
  const reduce = useReducedMotion();
  const [accent, setAccent] = useOptimistic(
    cabinet.profile.accent,
    (_current: ProfileAccent, next: ProfileAccent) => next,
  );
  const style = ACCENT_STYLE[accent];
  const plate = stampNameplate(
    cabinet.profile.nameplate,
    cabinet.profile.displayName,
  );
  const platinum = cabinet.ranks.platinum;
  const first = platinum[0];

  return (
    <div
      data-accent={accent}
      className={cn("relative min-h-[92vh] overflow-hidden", style.wash)}
    >
      <div className="pointer-events-none absolute inset-0 arcade-grid opacity-25" />

      <div className="relative mx-auto max-w-[1440px] px-4 pb-28 pt-36 md:px-8 md:pt-32">
        <motion.header
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.45 }}
          className="grid items-end gap-8 lg:grid-cols-12"
        >
          <div className="relative score-ticket overflow-hidden rounded-r-2xl border border-white/10 p-5 md:p-8 lg:col-span-7">
            <p className={cn("font-pixel text-[9px] tracking-[0.28em]", style.text)}>
              HIGH SCORE CARD
            </p>
            <div className="nameplate-stamp mt-4 inline-block rounded-[2px] px-3 py-1.5 font-pixel text-[10px] tracking-[0.32em]">
              {plate}
            </div>
            <h1
              className={cn(
                "mt-4 text-[clamp(2.6rem,8vw,6.4rem)] leading-[0.88] font-semibold tracking-tighter",
                style.text,
                accent === "gold" && "text-glow-gold",
                accent === "cyan" && "text-glow-cyan",
              )}
            >
              {cabinet.profile.displayName}
            </h1>
            <p className="mt-4 max-w-xl text-base text-foreground/85 md:text-lg">
              {cabinet.profile.bio}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {cabinet.profile.favoriteGenres.map((genre) => (
                <span
                  key={genre}
                  className={cn(
                    "rounded-sm border px-2 py-0.5 font-pixel text-[8px] tracking-widest",
                    style.chip,
                  )}
                >
                  {genre}
                </span>
              ))}
            </div>
            <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <Stat label="Platinas" value={cabinet.stats.platinum} tone={style.text} />
              <Stat label="Zerados" value={cabinet.stats.beaten} tone="text-emerald-400" />
              <Stat label="Jogando" value={cabinet.stats.playing ?? 0} tone="text-neon-cyan" />
              <Stat label="Backlog" value={cabinet.stats.wishlist} tone="text-neon-magenta" />
              <Stat label="Horas" value={cabinet.stats.hours} tone="text-foreground" />
              <Stat label="Piores" value={cabinet.stats.dropped} tone="text-neon-magenta" />
            </dl>
            <p className="mt-5 text-xs text-muted-foreground">
              Manda o print. É pra flexionar — 2 segundos e o amigo já entendeu.
            </p>
          </div>

          <PinnedShrine
            games={cabinet.pinned}
            firstPlatinum={first}
            accent={accent}
          />
        </motion.header>

        <PlayQueue
          nowPlaying={cabinet.nowPlaying}
          backlog={cabinet.backlog}
        />

        <PlatinumPodium games={platinum} reduce={Boolean(reduce)} accent={accent} />

        <BeatenWall games={cabinet.showcase} />

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-start">
          <NumberedCabinet
            className="lg:col-span-7"
            cabinet="HIGH SCORE"
            title="Zerados"
            empty="Nada no pódio de zerados. Marca Zerei no gabinete e ordena no operador."
            games={cabinet.ranks.beaten}
            tone="cyan"
          />
          <RoastCabinet games={cabinet.ranks.worst} />
        </div>

        {platinum.length > 3 && (
          <NumberedCabinet
            className="mt-8"
            cabinet="HIGH SCORE"
            title="Platinas — o resto da tabela"
            empty=""
            games={platinum.slice(3)}
            startAt={4}
            tone="gold"
          />
        )}
      </div>

      <OperatorDoor
        cabinet={cabinet}
        accent={accent}
        onAccentPreview={setAccent}
      />
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="border border-white/10 bg-void/40 px-3 py-2">
      <dt className="font-pixel text-[8px] tracking-widest text-muted-foreground">
        {label}
      </dt>
      <dd className={cn("mt-1 text-3xl font-semibold tabular-nums", tone)}>
        {String(value).padStart(2, "0")}
      </dd>
    </div>
  );
}

function PinnedShrine({
  games,
  firstPlatinum,
  accent,
}: {
  games: RankedCabinetGame[];
  firstPlatinum?: RankedCabinetGame;
  accent: ProfileAccent;
}) {
  const wall = games.length > 0 ? games : firstPlatinum ? [firstPlatinum] : [];
  const hero = wall[0];
  const rest = wall.slice(1, 4);
  const style = ACCENT_STYLE[accent];

  if (!hero) {
    return (
      <div className="flex min-h-[280px] items-center border border-dashed border-white/15 p-6 text-sm text-muted-foreground lg:col-span-5">
        Pin uma capa na parede de CRT. Sem vitrine, o flex fica mudo.
      </div>
    );
  }

  return (
    <div className="relative min-h-[320px] lg:col-span-5">
      <p className={cn("mb-3 font-pixel text-[8px] tracking-[0.28em]", style.text)}>
        VITRINE
      </p>
      <div className="relative h-[340px] sm:h-[400px]">
        <Link
          href={`/library/${hero.slug}`}
          className={cn(
            "crt-bezel absolute top-0 left-0 z-20 w-[62%] overflow-hidden rounded-[22px] p-2 rotate-[-3deg]",
            style.glow,
          )}
        >
          <div className="relative aspect-[2/3] overflow-hidden rounded-md">
            <CoverImage
              src={hero.posterUrl || hero.coverUrl}
              fallbackSrc={hero.coverUrl}
              alt={hero.title}
              fill
              priority
              className="object-cover"
              sizes="280px"
            />
            <div className="scanlines pointer-events-none absolute inset-0 opacity-40" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void/90 to-transparent p-3">
              <p className="text-sm font-medium leading-tight">{hero.title}</p>
            </div>
          </div>
        </Link>
        {rest.map((game, index) => (
          <Link
            key={game.slug}
            href={`/library/${game.slug}`}
            className={cn(
              "crt-bezel absolute z-10 w-[38%] overflow-hidden rounded-[16px] p-1.5",
              index === 0 && "top-6 right-0 rotate-[6deg]",
              index === 1 && "bottom-8 right-8 rotate-[-7deg]",
              index === 2 && "bottom-0 left-[18%] rotate-[3deg] z-0 w-[32%]",
            )}
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-sm">
              <CoverImage
                src={game.posterUrl || game.coverUrl}
                fallbackSrc={game.coverUrl}
                alt={game.title}
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function PlatinumPodium({
  games,
  reduce,
  accent,
}: {
  games: RankedCabinetGame[];
  reduce: boolean;
  accent: ProfileAccent;
}) {
  const [first, second, third] = games;
  const style = ACCENT_STYLE[accent];

  return (
    <motion.section
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduce ? 0 : 0.12, duration: reduce ? 0 : 0.45 }}
      className="mt-14"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-pixel text-[9px] tracking-[0.28em] text-neon-gold">
            PODIUM · PLATINAS
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">
            O monumento.
          </h2>
        </div>
        <p className="hidden max-w-xs text-right text-sm text-muted-foreground md:block">
          #1 ocupa a sala. O resto que dispute a prateleira.
        </p>
      </div>

      {games.length === 0 ? (
        <p className="mt-6 max-w-lg text-muted-foreground">
          Sem platina no pódio ainda. Marca Platinei no ritual, depois sobe o 1º
          no operador — o CRT espera.
        </p>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-12 lg:items-stretch">
          {first && (
            <Link
              href={`/library/${first.slug}`}
              className={cn(
                "crt-bezel group relative overflow-hidden rounded-[28px] p-3 lg:col-span-7",
                style.glow,
              )}
            >
              <p className="px-2 pb-2 font-pixel text-[10px] tracking-[0.35em] text-neon-gold">
                1ST · HIGH SCORE
              </p>
              <div className="relative min-h-[280px] overflow-hidden rounded-xl sm:min-h-[380px]">
                <CoverImage
                  src={first.coverUrl}
                  fallbackSrc={first.posterUrl}
                  alt={first.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />
                <div className="scanlines pointer-events-none absolute inset-0 opacity-30" />
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                  <p className="font-pixel text-[9px] text-neon-gold">01</p>
                  <h3 className="mt-1 text-3xl font-semibold tracking-tight md:text-5xl">
                    {first.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Você {first.personalScore ?? "—"} · Casa{" "}
                    {formatScore(first.communityScore)}
                  </p>
                </div>
              </div>
            </Link>
          )}
          <div className="flex flex-col gap-5 lg:col-span-5">
            {second ? (
              <PodiumSide
                rank="02"
                label="2ND"
                game={second}
                className="min-h-[180px] lg:flex-1"
              />
            ) : (
              <EmptySide label="2ND espera um gabinete." />
            )}
            {third ? (
              <PodiumSide
                rank="03"
                label="3RD"
                game={third}
                className="min-h-[160px] lg:flex-1"
              />
            ) : (
              <EmptySide label="3RD ainda vazio. A disputa continua." />
            )}
          </div>
        </div>
      )}
    </motion.section>
  );
}

function PodiumSide({
  rank,
  label,
  game,
  className,
}: {
  rank: string;
  label: string;
  game: RankedCabinetGame;
  className?: string;
}) {
  return (
    <Link
      href={`/library/${game.slug}`}
      className={cn(
        "crt-bezel group relative overflow-hidden rounded-[20px] p-2",
        className,
      )}
    >
      <div className="relative h-full min-h-[150px] overflow-hidden rounded-lg">
        <CoverImage
          src={game.coverUrl}
          fallbackSrc={game.posterUrl}
          alt={game.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
          sizes="40vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-void/88 via-void/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          <p className="font-pixel text-[9px] tracking-widest text-neon-cyan">
            {label} · {rank}
          </p>
          <h3 className="mt-1 text-xl font-semibold leading-tight">{game.title}</h3>
        </div>
      </div>
    </Link>
  );
}

function EmptySide({ label }: { label: string }) {
  return (
    <div className="flex min-h-[140px] flex-1 items-center border border-dashed border-white/15 px-4 text-sm text-muted-foreground">
      {label}
    </div>
  );
}

function PlayQueue({
  nowPlaying,
  backlog,
}: {
  nowPlaying: RankedCabinetGame[];
  backlog: RankedCabinetGame[];
}) {
  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-12">
      <QueueShelf
        className="lg:col-span-7"
        cabinet="CONTINUE?"
        title="Jogando agora"
        empty="Nada no CONTINUE?. Marca Jogando no cabinet — um toque, volta pro trampo."
        href="/hub#continuar"
        hrefLabel="Ir pro save"
        games={nowPlaying}
        tone="cyan"
        showHours
      />
      <QueueShelf
        className="lg:col-span-5"
        cabinet="INSERT COIN"
        title="Backlog"
        empty="Wishlist vazia. Busca no hub e manda pra fila."
        href="/hub?status=wishlist"
        hrefLabel="Abrir a fila"
        games={backlog}
        tone="magenta"
      />
    </div>
  );
}

function QueueShelf({
  cabinet,
  title,
  empty,
  href,
  hrefLabel,
  games,
  tone,
  className,
  showHours = false,
}: {
  cabinet: string;
  title: string;
  empty: string;
  href: string;
  hrefLabel: string;
  games: RankedCabinetGame[];
  tone: "cyan" | "magenta";
  className?: string;
  showHours?: boolean;
}) {
  const toneClass = tone === "cyan" ? "text-neon-cyan" : "text-neon-magenta";

  return (
    <section className={cn("min-w-0", className)}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className={cn("font-pixel text-[8px] tracking-[0.28em]", toneClass)}>
            {cabinet}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h2>
        </div>
        <Link
          href={href}
          className={cn("shrink-0 text-xs hover:underline", toneClass)}
        >
          {hrefLabel}
        </Link>
      </div>

      {games.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          {games.map((game) => (
            <Link
              key={game.slug}
              href={`/library/${game.slug}`}
              className="crt-bezel w-[112px] shrink-0 overflow-hidden rounded-[16px] p-1.5 sm:w-[128px]"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-sm">
                <CoverImage
                  src={game.posterUrl || game.coverUrl}
                  fallbackSrc={game.coverUrl}
                  alt={game.title}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void to-transparent p-2">
                  <p className="line-clamp-2 text-[11px] font-medium leading-tight">
                    {game.title}
                  </p>
                  {showHours && game.hoursPlayed != null && (
                    <p className="mt-0.5 font-pixel text-[8px] text-neon-cyan">
                      {Math.round(game.hoursPlayed)}h
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function BeatenWall({ games }: { games: RankedCabinetGame[] }) {
  if (games.length === 0) return null;

  return (
    <section className="mt-12">
      <p className="font-pixel text-[8px] tracking-[0.28em] text-emerald-400">
        JÁ LEVOU
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
        Capas que você zerou.
      </h2>
      <div className="mt-5 flex gap-0 overflow-x-auto pb-4 hide-scrollbar">
        {games.map((game, index) => (
          <Link
            key={game.slug}
            href={`/library/${game.slug}`}
            className={cn(
              "crt-bezel relative w-[108px] shrink-0 overflow-hidden rounded-[14px] p-1.5 sm:w-[124px]",
              index > 0 && "-ml-6 hover:z-20 hover:-translate-y-1",
            )}
            style={{ zIndex: games.length - index }}
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-sm">
              <CoverImage
                src={game.posterUrl || game.coverUrl}
                fallbackSrc={game.coverUrl}
                alt={game.title}
                fill
                className="object-cover"
                sizes="124px"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function NumberedCabinet({
  cabinet,
  title,
  empty,
  games,
  tone,
  className,
  startAt = 1,
}: {
  cabinet: string;
  title: string;
  empty: string;
  games: RankedCabinetGame[];
  tone: "cyan" | "gold";
  className?: string;
  startAt?: number;
}) {
  return (
    <section className={cn("rounded-2xl border border-white/10 bg-card/40 p-4 md:p-6", className)}>
      <p
        className={cn(
          "font-pixel text-[8px] tracking-[0.28em]",
          tone === "gold" ? "text-neon-gold" : "text-neon-cyan",
        )}
      >
        {cabinet}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
      {games.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ol className="mt-5 divide-y divide-white/10">
          {games.map((game, index) => {
            const rank = startAt + index;
            return (
              <li key={game.slug}>
                <Link
                  href={`/library/${game.slug}`}
                  className="group flex items-center gap-3 py-3 md:gap-5"
                >
                  <span
                    className={cn(
                      "w-14 shrink-0 font-pixel text-lg tabular-nums md:w-20 md:text-2xl",
                      tone === "gold" ? "text-neon-gold" : "text-neon-cyan",
                    )}
                  >
                    {padRank(rank - 1)}
                  </span>
                  <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-sm border border-white/10 md:h-16 md:w-12">
                    <CoverImage
                      src={game.posterUrl || game.coverUrl}
                      fallbackSrc={game.coverUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-medium md:text-lg">
                      {game.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Você {game.personalScore ?? "—"} · Casa{" "}
                      {formatScore(game.communityScore)}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

function RoastCabinet({ games }: { games: RankedCabinetGame[] }) {
  return (
    <section className="lg:col-span-5 lg:-mt-6 lg:rotate-[-1.6deg]">
      <div className="rounded-2xl border-2 border-neon-magenta/50 bg-[#1c1424] p-5 shadow-[0_0_40px_rgba(255,0,170,0.12)] md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-pixel text-[8px] tracking-[0.28em] text-neon-magenta">
              LOW SCORE · TILT
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neon-magenta">
              Piores
            </h2>
          </div>
          <span className="font-pixel text-[10px] text-destructive">GAME OVER</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Hall da vergonha. Curadoria sua — a casa só segura o microfone.
        </p>
        {games.length === 0 ? (
          <p className="mt-5 text-sm text-muted-foreground">
            Sem tilt na ficha. Drop ou nota baixa entra aqui. Sem culpa.
          </p>
        ) : (
          <ol className="mt-5 space-y-4">
            {games.map((game, index) => (
              <li key={game.slug}>
                <Link href={`/library/${game.slug}`} className="flex gap-3">
                  <span className="font-pixel text-sm text-neon-magenta">
                    F{index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-medium leading-tight">{game.title}</p>
                    <p className="mt-0.5 text-xs text-neon-magenta/80">
                      {ROASTS[index % ROASTS.length]}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Nota {game.personalScore ?? "—"}
                      {game.status === "dropped" ? " · drop" : ""}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
