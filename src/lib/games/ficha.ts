import { hasDossierOverlay, getGameDossier } from "@/lib/games/dossier";
import { FICHA_BY_SLUG } from "@/lib/games/ficha-overlay";

export type StoreKind =
  | "steam"
  | "playstation"
  | "xbox"
  | "nintendo"
  | "epic"
  | "gog"
  | "microsoft"
  | "mobile"
  | "official"
  | "launcher";

export type StoreLink = {
  kind: StoreKind;
  label: string;
  url?: string;
};

export type SpecSheet = {
  os: string;
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
};

export type PcSpecs = {
  minimum: SpecSheet;
  recommended: SpecSheet;
  note?: string;
};

export type LanguageTrack = {
  name: string;
  interface: boolean;
  audio: boolean;
  subtitles: boolean;
};

export type DlcEntry = {
  name: string;
  blurb: string;
  stores: StoreLink[];
};

export type PlayModes = {
  offline: boolean;
  alwaysOnline?: boolean;
  coop?: string;
  multiplayer?: string;
  note?: string;
};

export type StoreDraft = {
  kind: StoreKind;
  label?: string;
  url?: string;
};

export type DlcDraft = {
  name: string;
  blurb: string;
  stores: StoreDraft[];
};

/** Overlay by slug — flagship cabinets get the full dossier. */
export type FichaOverlay = {
  developer?: string;
  publisher?: string;
  ageRating?: string;
  releaseDate?: string;
  platforms?: string[];
  stores?: StoreDraft[];
  pcSpecs?: PcSpecs | "not-pc";
  pcNote?: string;
  languages?: LanguageTrack[];
  dlcs?: DlcDraft[] | "none" | "live";
  dlcNote?: string;
  playModes?: PlayModes;
};

export type PcIntel =
  | { status: "ready"; specs: PcSpecs }
  | { status: "unknown" }
  | { status: "not-pc"; note: string };

export type LanguageIntel =
  | { status: "ready"; tracks: LanguageTrack[] }
  | { status: "unknown" };

export type DlcIntel =
  | { status: "ready"; items: DlcEntry[] }
  | { status: "none"; note: string }
  | { status: "live"; note: string }
  | { status: "unknown" };

export type GameFicha = {
  slug: string;
  platforms: string[];
  stores: StoreLink[];
  pc: PcIntel;
  languages: LanguageIntel;
  dlcs: DlcIntel;
  developer: string | null;
  publisher: string | null;
  ageRating: string | null;
  releaseDate: string | null;
  playModes: PlayModes | null;
  rich: boolean;
};

export type FichaGameInput = {
  slug: string;
  platforms?: string[];
  steamAppId?: number | null;
  releaseYear?: number | null;
};

export const STORE_LABELS: Record<StoreKind, string> = {
  steam: "Steam",
  playstation: "PlayStation Store",
  xbox: "Xbox Store",
  nintendo: "Nintendo eShop",
  epic: "Epic Games Store",
  gog: "GOG",
  microsoft: "Microsoft Store",
  mobile: "App Store / Google Play",
  official: "Site oficial",
  launcher: "Launcher oficial",
};

export function steamStoreUrl(appId: number) {
  return `https://store.steampowered.com/app/${appId}`;
}

export function isPtBrLanguage(name: string) {
  return /portugu[eê]s.*brasil|pt-?br|brasileiro/i.test(name);
}

export function languageFlags(track: LanguageTrack) {
  const bits: string[] = [];
  if (track.interface) bits.push("interface");
  if (track.audio) bits.push("áudio");
  if (track.subtitles) bits.push("legendas");
  return bits;
}

function normalizePlatforms(platforms: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of platforms) {
    const value = raw.trim();
    if (!value) continue;
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
}

function hasPlatform(platforms: string[], ...needles: string[]) {
  const lower = platforms.map((item) => item.toLowerCase());
  return needles.some((needle) =>
    lower.some((item) => item.includes(needle.toLowerCase())),
  );
}

function hydrateStore(
  store: { kind: StoreKind; label?: string; url?: string },
  steamAppId?: number | null,
): StoreLink {
  const url =
    store.url ??
    (store.kind === "steam" && steamAppId && steamAppId > 0
      ? steamStoreUrl(steamAppId)
      : undefined);

  return {
    kind: store.kind,
    label: store.label ?? STORE_LABELS[store.kind],
    url,
  };
}

function inferStores(
  platforms: string[],
  steamAppId?: number | null,
): StoreLink[] {
  const stores: StoreLink[] = [];
  const push = (kind: StoreKind, url?: string) => {
    if (stores.some((item) => item.kind === kind)) return;
    stores.push({ kind, label: STORE_LABELS[kind], url });
  };

  if (steamAppId && steamAppId > 0) {
    push("steam", steamStoreUrl(steamAppId));
  }
  if (hasPlatform(platforms, "playstation")) push("playstation");
  if (hasPlatform(platforms, "xbox")) push("xbox");
  if (hasPlatform(platforms, "switch", "wii u", "nintendo")) push("nintendo");
  if (hasPlatform(platforms, "mobile")) push("mobile");

  if (
    hasPlatform(platforms, "pc") &&
    !stores.some((item) => item.kind === "steam" || item.kind === "launcher")
  ) {
    push("official");
  }

  return stores;
}

function resolvePc(overlay: FichaOverlay | undefined, platforms: string[]): PcIntel {
  const specs = overlay?.pcSpecs;
  if (specs === "not-pc") {
    return {
      status: "not-pc",
      note: overlay?.pcNote ?? "Não tem versão de PC. A ficha de máquina não se aplica.",
    };
  }
  if (specs && typeof specs === "object") {
    return { status: "ready", specs };
  }
  if (!hasPlatform(platforms, "pc")) {
    return {
      status: "not-pc",
      note: "Não tem versão de PC neste catálogo.",
    };
  }
  return { status: "unknown" };
}

function resolveLanguages(overlay: FichaOverlay | undefined): LanguageIntel {
  if (!overlay?.languages?.length) return { status: "unknown" };
  const tracks = [...overlay.languages].sort((a, b) => {
    const aPt = isPtBrLanguage(a.name) ? 0 : 1;
    const bPt = isPtBrLanguage(b.name) ? 0 : 1;
    if (aPt !== bPt) return aPt - bPt;
    return a.name.localeCompare(b.name, "pt-BR");
  });
  return { status: "ready", tracks };
}

function resolveDlcs(
  overlay: FichaOverlay | undefined,
  steamAppId?: number | null,
): DlcIntel {
  const dlcs = overlay?.dlcs;
  if (dlcs === "none") {
    return {
      status: "none",
      note: overlay?.dlcNote ?? "Sem DLC pago. O que tem é o jogo.",
    };
  }
  if (dlcs === "live") {
    return {
      status: "live",
      note:
        overlay?.dlcNote ??
        "Sem expansão clássica. O conteúdo anda no calendário live — passe, season ou banner.",
    };
  }
  if (Array.isArray(dlcs)) {
    return {
      status: "ready",
      items: dlcs.map((item) => ({
        name: item.name,
        blurb: item.blurb,
        stores: item.stores.map((store) => hydrateStore(store, steamAppId)),
      })),
    };
  }
  return { status: "unknown" };
}

function overlayFromDossier(game: FichaGameInput): FichaOverlay | undefined {
  if (!hasDossierOverlay(game.slug)) return undefined;
  const dossier = getGameDossier({
    slug: game.slug,
    title: game.slug,
    platforms: game.platforms,
    steamAppId: game.steamAppId,
  });

  const overlay: FichaOverlay = {};

  if (dossier.pc === "console-only") {
    overlay.pcSpecs = "not-pc";
    overlay.pcNote = "Não tem versão de PC neste catálogo.";
  } else if (dossier.pc) {
    overlay.pcSpecs = {
      minimum: {
        os: "",
        cpu: dossier.pc.min,
        gpu: "",
        ram: "",
        storage: "",
      },
      recommended: {
        os: "",
        cpu: dossier.pc.rec,
        gpu: "",
        ram: "",
        storage: "",
      },
      note: dossier.pc.note,
    };
  }

  if (dossier.languages) {
    const { text, audio, ptBr } = dossier.languages;
    const tracks: LanguageTrack[] = text.map((name) => {
      const pt = /portugu/i.test(name);
      return {
        name: pt ? "Português (Brasil)" : name,
        interface: true,
        audio: pt ? ptBr === "full" : audio.includes(name),
        subtitles: pt ? ptBr !== "none" : true,
      };
    });
    if (ptBr === "none") {
      tracks.unshift({
        name: "Português (Brasil)",
        interface: false,
        audio: false,
        subtitles: false,
      });
    } else if (!tracks.some((track) => isPtBrLanguage(track.name))) {
      tracks.unshift({
        name: "Português (Brasil)",
        interface: true,
        audio: ptBr === "full",
        subtitles: true,
      });
    }
    overlay.languages = tracks;
  }

  if (dossier.dlcs) {
    overlay.dlcs =
      dossier.dlcs.length === 0
        ? "none"
        : dossier.dlcs.map((item) => ({
            name: item.name,
            blurb: item.note ?? "Expansão do gabinete.",
            stores: [],
          }));
  }

  return overlay;
}

export function resolveGameFicha(game: FichaGameInput): GameFicha {
  const overlay = FICHA_BY_SLUG[game.slug] ?? overlayFromDossier(game);
  const platforms = normalizePlatforms(
    overlay?.platforms ?? game.platforms ?? [],
  );
  const steamAppId = game.steamAppId && game.steamAppId > 0 ? game.steamAppId : null;

  const stores = overlay?.stores?.length
    ? overlay.stores.map((store) => hydrateStore(store, steamAppId))
    : inferStores(platforms, steamAppId);

  return {
    slug: game.slug,
    platforms,
    stores,
    pc: resolvePc(overlay, platforms),
    languages: resolveLanguages(overlay),
    dlcs: resolveDlcs(overlay, steamAppId),
    developer: overlay?.developer ?? null,
    publisher: overlay?.publisher ?? null,
    ageRating: overlay?.ageRating ?? null,
    releaseDate: overlay?.releaseDate ?? (game.releaseYear ? String(game.releaseYear) : null),
    playModes: overlay?.playModes ?? null,
    rich: Boolean(overlay),
  };
}

export function hasRichFicha(slug: string) {
  return Boolean(FICHA_BY_SLUG[slug] || hasDossierOverlay(slug));
}
