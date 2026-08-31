export const PROFILE_ACCENTS = ["cyan", "magenta", "gold"] as const;
export type ProfileAccent = (typeof PROFILE_ACCENTS)[number];

export const RANK_LISTS = ["platinum", "beaten", "worst"] as const;
export type RankListId = (typeof RANK_LISTS)[number];

export const PINNED_MAX = 4;
export const BIO_MAX = 180;
export const NAME_MAX = 32;
export const NAMEPLATE_MAX = 16;
export const GENRES_MAX = 6;

export type PlayerProfile = {
  userId: string;
  displayName: string;
  nameplate: string;
  bio: string;
  favoriteGenres: string[];
  accent: ProfileAccent;
  pinnedSlugs: string[];
  platinumRank: string[];
  beatenRank: string[];
  worstRank: string[];
  updatedAt: Date;
};

export type ProfilePatch = Partial<
  Pick<
    PlayerProfile,
    | "displayName"
    | "nameplate"
    | "bio"
    | "favoriteGenres"
    | "accent"
    | "pinnedSlugs"
    | "platinumRank"
    | "beatenRank"
    | "worstRank"
  >
>;

export type RankedCabinetGame = {
  slug: string;
  title: string;
  coverUrl: string;
  posterUrl: string;
  personalScore: number | null;
  communityScore: number | null;
  status: string | null;
  hoursPlayed?: number | null;
};

export type RankCandidate = { slug: string; title: string };

export const RANK_COPY: Record<
  RankListId,
  { cabinet: string; title: string; empty: string; add: string }
> = {
  platinum: {
    cabinet: "HIGH SCORE",
    title: "Platinas",
    empty: "Ainda sem ranking de platina. Platina no ritual, depois sobe o 1º lugar aqui.",
    add: "Subir uma platina",
  },
  beaten: {
    cabinet: "HIGH SCORE",
    title: "Zerados",
    empty: "Nada no pódio de zerados. Marca Zerei no gabinete e ordena aqui.",
    add: "Subir um zerado",
  },
  worst: {
    cabinet: "LOW SCORE",
    title: "Piores",
    empty: "Sem hall da vergonha. Drop, nota baixa ou o game que te irritou — você curadoria.",
    add: "Entra nos piores",
  },
};

export const ACCENT_STYLE: Record<
  ProfileAccent,
  {
    label: string;
    vibe: string;
    ring: string;
    text: string;
    border: string;
    glow: string;
    chip: string;
    wash: string;
  }
> = {
  cyan: {
    label: "Ciano",
    vibe: "Ice cabinet — madrugada no fliperama.",
    ring: "border-neon-cyan/70",
    text: "text-neon-cyan",
    border: "border-neon-cyan/30",
    glow: "box-glow-cyan",
    chip: "border-neon-cyan/50 bg-neon-cyan/15 text-neon-cyan",
    wash: "trophy-wash-cyan",
  },
  magenta: {
    label: "Magenta",
    vibe: "Tokyo 3AM — néon no vidro sujo.",
    ring: "border-neon-magenta/70",
    text: "text-neon-magenta",
    border: "border-neon-magenta/30",
    glow: "shadow-[0_0_28px_rgba(255,0,170,0.22)]",
    chip: "border-neon-magenta/50 bg-neon-magenta/15 text-neon-magenta",
    wash: "trophy-wash-magenta",
  },
  gold: {
    label: "Ouro",
    vibe: "Hall da fama. O marquee ainda quente.",
    ring: "border-neon-gold/70",
    text: "text-neon-gold",
    border: "border-neon-gold/30",
    glow: "box-glow-gold",
    chip: "border-neon-gold/50 bg-neon-gold/15 text-neon-gold",
    wash: "trophy-wash-gold",
  },
};

export function defaultPlayerProfile(userId: string): PlayerProfile {
  return {
    userId,
    displayName: "Player 1",
    nameplate: "1P",
    bio: "Voltei do trampo. Cadê o save?",
    favoriteGenres: ["RPG", "Soulslike"],
    accent: "gold",
    pinnedSlugs: [],
    platinumRank: [],
    beatenRank: [],
    worstRank: [],
    updatedAt: new Date(),
  };
}

export function stampNameplate(nameplate: string, displayName: string) {
  const raw = (nameplate || displayName || "1P").trim();
  return raw.slice(0, NAMEPLATE_MAX).toUpperCase();
}

export function padRank(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function rankKey(list: RankListId): keyof Pick<
  PlayerProfile,
  "platinumRank" | "beatenRank" | "worstRank"
> {
  if (list === "platinum") return "platinumRank";
  if (list === "beaten") return "beatenRank";
  return "worstRank";
}

export function moveSlug(
  list: string[],
  slug: string,
  direction: -1 | 1,
): string[] {
  const index = list.indexOf(slug);
  if (index < 0) return list;
  const next = index + direction;
  if (next < 0 || next >= list.length) return list;
  const copy = [...list];
  const current = copy[index];
  const swap = copy[next];
  if (current == null || swap == null) return list;
  copy[index] = swap;
  copy[next] = current;
  return copy;
}

export function addSlug(list: string[], slug: string, max?: number): string[] {
  if (list.includes(slug)) return list;
  if (max != null && list.length >= max) return list;
  return [...list, slug];
}

export function removeSlug(list: string[], slug: string): string[] {
  return list.filter((item) => item !== slug);
}

export function clampPinned(slugs: string[]) {
  return [...new Set(slugs)].slice(0, PINNED_MAX);
}

export function sanitizeGenres(genres: string[]) {
  return [...new Set(genres.map((genre) => genre.trim()).filter(Boolean))].slice(
    0,
    GENRES_MAX,
  );
}
