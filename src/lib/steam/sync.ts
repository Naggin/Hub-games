import { getSteamApiKey, isSteamApiConfigured } from "@/lib/env";
import type { LibraryStatus } from "@/lib/db/schema";

const STEAM_API = "https://api.steampowered.com";
const OWNED_CACHE_TTL_MS = 10 * 60 * 1000;
const SYNC_COOLDOWN_MS = 45 * 1000;
const STEAMID64 = /^7656119\d{10}$/;

export type SteamOwnedGame = {
  appId: number;
  name: string;
  playtimeForever: number;
  playtime2Weeks: number;
};

export type CatalogSteamGame = {
  id: string;
  slug: string;
  title: string;
  steamAppId: number;
};

export type ExistingLibraryRow = {
  gameId: string;
  status: LibraryStatus;
  personalScore: number | null;
  hoursPlayed: number | null;
  shortNote: string | null;
};

export type ImportPlanItem = {
  gameId: string;
  slug: string;
  title: string;
  steamAppId: number;
  hoursPlayed: number;
  status: LibraryStatus;
  created: boolean;
  statusChanged: boolean;
};

export type SteamImportPlan = {
  items: ImportPlanItem[];
  skippedUnknown: number;
  skippedNoPlaytime: number;
};

export type ParsedSteamIdentity =
  | { kind: "steamid64"; steamId: string }
  | { kind: "vanity"; vanity: string }
  | { kind: "invalid" };

type OwnedCacheEntry = {
  at: number;
  games: SteamOwnedGame[];
  privateProfile: boolean;
};

const ownedCache = new Map<string, OwnedCacheEntry>();
const lastSyncAt = new Map<string, number>();

const LOCKED_STATUS = new Set<LibraryStatus>([
  "platinum",
  "beaten",
  "dropped",
]);

/** Demo library matching seed steamAppIds — Witcher/Elden hours + a couple of edge cases. */
export const DEMO_STEAM_LIBRARY: SteamOwnedGame[] = [
  {
    appId: 292030,
    name: "The Witcher 3: Wild Hunt",
    playtimeForever: 11220,
    playtime2Weeks: 420,
  },
  {
    appId: 1245620,
    name: "Elden Ring",
    playtimeForever: 12840,
    playtime2Weeks: 0,
  },
  {
    appId: 1145360,
    name: "Hades",
    playtimeForever: 2520,
    playtime2Weeks: 180,
  },
  {
    appId: 220,
    name: "Half-Life 2",
    playtimeForever: 720,
    playtime2Weeks: 0,
  },
  {
    appId: 9999999,
    name: "Jogo que o Hub ainda não tem",
    playtimeForever: 600,
    playtime2Weeks: 0,
  },
];

export function minutesToHours(minutes: number): number {
  if (minutes <= 0) return 0;
  const hours = minutes / 60;
  if (hours < 10) return Math.round(hours * 10) / 10;
  return Math.round(hours);
}

export function parseSteamIdentity(raw: string): ParsedSteamIdentity {
  const input = raw.trim();
  if (!input) return { kind: "invalid" };

  const fromUrl = parseSteamCommunityUrl(input);
  if (fromUrl) return fromUrl;

  if (STEAMID64.test(input)) {
    return { kind: "steamid64", steamId: input };
  }

  if (/^[a-zA-Z0-9_-]{2,32}$/.test(input)) {
    return { kind: "vanity", vanity: input };
  }

  return { kind: "invalid" };
}

function parseSteamCommunityUrl(input: string): ParsedSteamIdentity | null {
  const candidate = input.includes("://")
    ? input
    : input.includes("steamcommunity.com")
      ? `https://${input}`
      : null;
  if (!candidate) return null;

  try {
    const url = new URL(candidate);
    if (!url.hostname.endsWith("steamcommunity.com")) return { kind: "invalid" };

    const profiles = url.pathname.match(/\/profiles\/(\d{17})\/?/);
    if (profiles?.[1] && STEAMID64.test(profiles[1])) {
      return { kind: "steamid64", steamId: profiles[1] };
    }

    const vanity = url.pathname.match(/\/id\/([^/]+)\/?/);
    if (vanity?.[1]) {
      return { kind: "vanity", vanity: decodeURIComponent(vanity[1]) };
    }
  } catch {
    return { kind: "invalid" };
  }

  return { kind: "invalid" };
}

export function planSteamImport(
  owned: SteamOwnedGame[],
  catalog: CatalogSteamGame[],
  existing: ExistingLibraryRow[],
): SteamImportPlan {
  const catalogByApp = new Map<number, CatalogSteamGame>();
  for (const game of catalog) {
    if (!catalogByApp.has(game.steamAppId)) {
      catalogByApp.set(game.steamAppId, game);
    }
  }

  const existingByGameId = new Map(existing.map((row) => [row.gameId, row]));

  const items: ImportPlanItem[] = [];
  let skippedUnknown = 0;
  let skippedNoPlaytime = 0;

  for (const ownedGame of owned) {
    const match = catalogByApp.get(ownedGame.appId);
    if (!match) {
      skippedUnknown += 1;
      continue;
    }

    if (ownedGame.playtimeForever <= 0) {
      skippedNoPlaytime += 1;
      continue;
    }

    const hoursPlayed = minutesToHours(ownedGame.playtimeForever);
    const recent = ownedGame.playtime2Weeks > 0;
    const current = existingByGameId.get(match.id);

    items.push({
      gameId: match.id,
      slug: match.slug,
      title: match.title,
      steamAppId: match.steamAppId,
      hoursPlayed,
      status: nextImportStatus(current?.status, recent),
      created: !current,
      statusChanged: Boolean(
        current && nextImportStatus(current.status, recent) !== current.status,
      ),
    });
  }

  return { items, skippedUnknown, skippedNoPlaytime };
}

function nextImportStatus(
  current: LibraryStatus | undefined,
  recent: boolean,
): LibraryStatus {
  if (!current) return "playing";
  if (LOCKED_STATUS.has(current)) return current;
  if (current === "wishlist" && recent) return "playing";
  return current;
}

export function isSyncCoolingDown(userId: string): number {
  const last = lastSyncAt.get(userId);
  if (!last) return 0;
  const wait = SYNC_COOLDOWN_MS - (Date.now() - last);
  return wait > 0 ? wait : 0;
}

export function markSynced(userId: string) {
  lastSyncAt.set(userId, Date.now());
}

export async function resolveSteamId(identity: ParsedSteamIdentity): Promise<
  | { ok: true; steamId: string }
  | { ok: false; error: "invalid" | "vanity_not_found" | "needs_key" | "steam_error" }
> {
  if (identity.kind === "invalid") return { ok: false, error: "invalid" };
  if (identity.kind === "steamid64") return { ok: true, steamId: identity.steamId };

  const key = getSteamApiKey();
  if (!key) return { ok: false, error: "needs_key" };

  try {
    const url = new URL(`${STEAM_API}/ISteamUser/ResolveVanityURL/v1/`);
    url.searchParams.set("key", key);
    url.searchParams.set("vanityurl", identity.vanity);

    const payload = await steamGet<{
      response?: { success?: number; steamid?: string };
    }>(url);

    if (payload.response?.success === 1 && payload.response.steamid) {
      return { ok: true, steamId: payload.response.steamid };
    }
    return { ok: false, error: "vanity_not_found" };
  } catch {
    return { ok: false, error: "steam_error" };
  }
}

export async function fetchOwnedGames(steamId: string): Promise<
  | { ok: true; games: SteamOwnedGame[]; demo: false }
  | {
      ok: false;
      error: "private_profile" | "steam_error" | "needs_key" | "rate_limited";
      demo: false;
    }
> {
  const key = getSteamApiKey();
  if (!key) return { ok: false, error: "needs_key", demo: false };

  const cached = ownedCache.get(steamId);
  if (cached && Date.now() - cached.at < OWNED_CACHE_TTL_MS) {
    if (cached.privateProfile) {
      return { ok: false, error: "private_profile", demo: false };
    }
    return { ok: true, games: cached.games, demo: false };
  }

  try {
    const url = new URL(`${STEAM_API}/IPlayerService/GetOwnedGames/v1/`);
    url.searchParams.set("key", key);
    url.searchParams.set("steamid", steamId);
    url.searchParams.set("include_appinfo", "true");
    url.searchParams.set("include_played_free_games", "true");
    url.searchParams.set("format", "json");

    const payload = await steamGet<{
      response?: {
        game_count?: number;
        games?: Array<{
          appid: number;
          name?: string;
          playtime_forever?: number;
          playtime_2weeks?: number;
        }>;
      };
    }>(url);

    const response = payload.response ?? {};
    const privateProfile =
      response.games == null && response.game_count == null;

    if (privateProfile) {
      ownedCache.set(steamId, {
        at: Date.now(),
        games: [],
        privateProfile: true,
      });
      return { ok: false, error: "private_profile", demo: false };
    }

    const games: SteamOwnedGame[] = (response.games ?? []).map((game) => ({
      appId: game.appid,
      name: game.name ?? `app ${game.appid}`,
      playtimeForever: game.playtime_forever ?? 0,
      playtime2Weeks: game.playtime_2weeks ?? 0,
    }));

    ownedCache.set(steamId, {
      at: Date.now(),
      games,
      privateProfile: false,
    });

    return { ok: true, games, demo: false };
  } catch (error) {
    if (error instanceof Error && error.message === "rate_limited") {
      return { ok: false, error: "rate_limited", demo: false };
    }
    return { ok: false, error: "steam_error", demo: false };
  }
}

export function demoOwnedGames(): SteamOwnedGame[] {
  return DEMO_STEAM_LIBRARY;
}

export function steamSyncMode(): "live" | "demo" {
  return isSteamApiConfigured() ? "live" : "demo";
}

async function steamGet<T>(url: URL): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
    headers: { Accept: "application/json" },
  });

  if (response.status === 429) {
    throw new Error("rate_limited");
  }

  if (!response.ok) {
    throw new Error(`steam_http_${response.status}`);
  }

  return (await response.json()) as T;
}
