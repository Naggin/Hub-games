import { ExternalLink } from "lucide-react";

import {
  isPtBrLanguage,
  languageFlags,
  type DlcIntel,
  type GameFicha,
  type LanguageTrack,
  type PcIntel,
  type SpecSheet,
  type StoreKind,
  type StoreLink,
} from "@/lib/games/ficha";
import { cn } from "@/lib/utils";

const STORE_TONE: Record<StoreKind, string> = {
  steam: "border-[#66c0f4]/50 bg-[#66c0f4]/10 text-[#8bd3f8]",
  playstation: "border-[#0070d1]/50 bg-[#0070d1]/10 text-[#7eb8ff]",
  xbox: "border-[#107c10]/50 bg-[#107c10]/10 text-[#7CFF6B]",
  nintendo: "border-[#e60012]/50 bg-[#e60012]/10 text-[#ff8a96]",
  epic: "border-white/30 bg-white/5 text-foreground",
  gog: "border-[#c08dff]/50 bg-[#c08dff]/10 text-[#e0c2ff]",
  microsoft: "border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan",
  mobile: "border-neon-magenta/40 bg-neon-magenta/10 text-neon-magenta",
  official: "border-neon-gold/40 bg-neon-gold/10 text-neon-gold",
  launcher: "border-neon-gold/40 bg-neon-gold/10 text-neon-gold",
};

export function FichaDossier({ ficha }: { ficha: GameFicha }) {
  return (
    <section className="overflow-hidden border border-neon-gold/25 bg-card/55">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-neon-gold/15 px-5 py-4 md:px-7">
        <div>
          <p className="font-pixel text-[9px] tracking-[0.28em] text-neon-gold">
            DOSSIÊ DO CABINET
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Onde roda, o que pede, se tem PT-BR, o DLC e a loja. Sem wiki.
          </p>
        </div>
        {ficha.ageRating && (
          <span className="rounded-sm border border-neon-gold/50 px-2 py-1 font-pixel text-[10px] text-neon-gold">
            {ficha.ageRating}
          </span>
        )}
      </header>

      <div className="grid gap-0 lg:grid-cols-12">
        <div className="space-y-5 border-b border-white/5 p-5 md:p-7 lg:col-span-5 lg:border-b-0 lg:border-r">
          <MetaBlock ficha={ficha} />
          <Platforms platforms={ficha.platforms} />
          <Stores stores={ficha.stores} />
          <PlayModesBlock ficha={ficha} />
        </div>

        <div className="space-y-6 p-5 md:p-7 lg:col-span-7">
          <PcBlock pc={ficha.pc} />
          <LanguageBlock languages={ficha.languages} />
        </div>
      </div>

      <div className="border-t border-neon-magenta/20 bg-void/30 px-5 py-5 md:px-7">
        <DlcBlock dlcs={ficha.dlcs} />
      </div>
    </section>
  );
}

function MetaBlock({ ficha }: { ficha: GameFicha }) {
  const bits = [
    ficha.developer && { label: "Studio", value: ficha.developer },
    ficha.publisher && { label: "Publisher", value: ficha.publisher },
    ficha.releaseDate && { label: "Saiu", value: ficha.releaseDate },
  ].filter(Boolean) as { label: string; value: string }[];

  if (bits.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 gap-3">
      {bits.map((bit) => (
        <div key={bit.label}>
          <dt className="font-pixel text-[8px] tracking-widest text-muted-foreground">
            {bit.label}
          </dt>
          <dd className="mt-1 text-sm">{bit.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Platforms({ platforms }: { platforms: string[] }) {
  if (platforms.length === 0) return null;
  return (
    <div>
      <p className="font-pixel text-[8px] tracking-widest text-neon-cyan">
        PLATAFORMAS
      </p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {platforms.map((platform) => (
          <li
            key={platform}
            className="rounded-sm border border-neon-cyan/30 bg-neon-cyan/10 px-2 py-0.5 text-xs text-neon-cyan"
          >
            {platform}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stores({ stores }: { stores: StoreLink[] }) {
  if (stores.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Sem loja mapeada ainda. A casa infere pelo que o catálogo conhece.
      </p>
    );
  }

  return (
    <div>
      <p className="font-pixel text-[8px] tracking-widest text-neon-gold">
        ONDE COMPRA
      </p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {stores.map((store) => {
          const className = cn(
            "inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-xs transition",
            STORE_TONE[store.kind],
            store.url && "hover:brightness-125",
          );
          const inner = (
            <>
              {store.label}
              {store.url ? <ExternalLink className="size-3 opacity-70" /> : null}
            </>
          );
          return (
            <li key={`${store.kind}-${store.label}`}>
              {store.url ? (
                <a
                  href={store.url}
                  target="_blank"
                  rel="noreferrer"
                  className={className}
                >
                  {inner}
                </a>
              ) : (
                <span className={className}>{inner}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PlayModesBlock({ ficha }: { ficha: GameFicha }) {
  const modes = ficha.playModes;
  if (!modes) return null;

  const chips: string[] = [];
  if (modes.offline) chips.push("Offline");
  if (modes.alwaysOnline) chips.push("Always online");
  if (modes.coop) chips.push(modes.coop);
  if (modes.multiplayer) chips.push(modes.multiplayer);

  return (
    <div>
      <p className="font-pixel text-[8px] tracking-widest text-neon-magenta">
        MODO
      </p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {chips.map((chip) => (
          <li
            key={chip}
            className="rounded-sm border border-white/15 bg-secondary/50 px-2 py-0.5 text-xs"
          >
            {chip}
          </li>
        ))}
      </ul>
      {modes.note && (
        <p className="mt-2 text-sm text-muted-foreground">{modes.note}</p>
      )}
    </div>
  );
}

function PcBlock({ pc }: { pc: PcIntel }) {
  return (
    <div>
      <p className="font-pixel text-[8px] tracking-widest text-neon-cyan">
        PC · MÍNIMO / RECOMENDADO
      </p>
      {pc.status === "not-pc" && (
        <p className="mt-3 rounded-sm border border-dashed border-white/15 px-3 py-3 text-sm text-muted-foreground">
          {pc.note}
        </p>
      )}
      {pc.status === "unknown" && (
        <p className="mt-3 text-sm text-muted-foreground">
          Ainda sem ficha de máquina. A casa infere que roda em PC — min/rec
          entram nos flagships primeiro.
        </p>
      )}
      {pc.status === "ready" && (
        <>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <SpecCard label="Mínimo" sheet={pc.specs.minimum} tone="muted" />
            <SpecCard label="Recomendado" sheet={pc.specs.recommended} tone="gold" />
          </div>
          {pc.specs.note && (
            <p className="mt-3 text-xs text-muted-foreground">{pc.specs.note}</p>
          )}
        </>
      )}
    </div>
  );
}

function SpecCard({
  label,
  sheet,
  tone,
}: {
  label: string;
  sheet: SpecSheet;
  tone: "muted" | "gold";
}) {
  const rows: { k: string; v: string }[] = [
    { k: "OS", v: sheet.os },
    { k: "CPU", v: sheet.cpu },
    { k: "GPU", v: sheet.gpu },
    { k: "RAM", v: sheet.ram },
    { k: "Disco", v: sheet.storage },
  ];

  return (
    <div
      className={cn(
        "border bg-void/40 p-3",
        tone === "gold" ? "border-neon-gold/30" : "border-white/10",
      )}
    >
      <p
        className={cn(
          "font-pixel text-[8px] tracking-widest",
          tone === "gold" ? "text-neon-gold" : "text-muted-foreground",
        )}
      >
        {label}
      </p>
      <dl className="mt-2 space-y-1.5">
        {rows.map((row) => (
          <div key={row.k} className="grid grid-cols-[52px_1fr] gap-2 text-xs">
            <dt className="text-muted-foreground">{row.k}</dt>
            <dd className="leading-snug">{row.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function LanguageBlock({ languages }: { languages: GameFicha["languages"] }) {
  return (
    <div>
      <p className="font-pixel text-[8px] tracking-widest text-neon-magenta">
        IDIOMAS
      </p>
      {languages.status === "unknown" && (
        <p className="mt-3 text-sm text-muted-foreground">
          Sem trilha mapeada. Se for flagship, a casa ainda está preenchendo o
          PT-BR.
        </p>
      )}
      {languages.status === "ready" && (
        <ul className="mt-3 space-y-2">
          {languages.tracks.map((track) => (
            <LanguageRow key={track.name} track={track} />
          ))}
        </ul>
      )}
    </div>
  );
}

function LanguageRow({ track }: { track: LanguageTrack }) {
  const pt = isPtBrLanguage(track.name);
  const flags = languageFlags(track);
  const missing = !track.interface && !track.audio && !track.subtitles;

  return (
    <li
      className={cn(
        "flex flex-wrap items-center justify-between gap-2 rounded-sm border px-3 py-2",
        pt
          ? "border-neon-gold/40 bg-neon-gold/10"
          : "border-white/10 bg-void/30",
      )}
    >
      <span className={cn("text-sm", pt && "text-neon-gold")}>
        {track.name}
        {pt ? " · a casa" : ""}
      </span>
      <span className="text-[11px] text-muted-foreground">
        {missing ? "não tem" : flags.join(" · ")}
      </span>
    </li>
  );
}

function DlcBlock({ dlcs }: { dlcs: DlcIntel }) {
  return (
    <div>
      <p className="font-pixel text-[8px] tracking-widest text-neon-magenta">
        DLC · EXPANSÃO
      </p>
      {dlcs.status === "unknown" && (
        <p className="mt-3 text-sm text-muted-foreground">
          Sem dossiê de DLC neste título. Se a loja vender extra, a ficha ainda
          não cravou.
        </p>
      )}
      {dlcs.status === "none" && (
        <p className="mt-3 text-sm">{dlcs.note}</p>
      )}
      {dlcs.status === "live" && (
        <p className="mt-3 text-sm">
          <span className="mr-2 rounded-sm border border-neon-magenta/40 px-1.5 py-0.5 font-pixel text-[8px] text-neon-magenta">
            LIVE
          </span>
          {dlcs.note}
        </p>
      )}
      {dlcs.status === "ready" && (
        <ul className="mt-3 space-y-3">
          {dlcs.items.map((item) => (
            <li
              key={item.name}
              className="border border-white/10 bg-card/40 px-3 py-3"
            >
              <p className="text-sm font-medium">{item.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.blurb}</p>
              {item.stores.length > 0 && (
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {item.stores.map((store) => store.label).join(" · ")}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
