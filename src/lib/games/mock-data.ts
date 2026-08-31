import { enrichGame, type Monetization } from "@/lib/games/catalog";
import { seedGames } from "@/lib/games/seed-data";
import {
  clampPinned,
  defaultPlayerProfile,
  sanitizeGenres,
  type PlayerProfile,
  type ProfileAccent,
  type ProfilePatch,
} from "@/lib/profile/types";

const mockLibrary = new Map<
  string,
  {
    status: "wishlist" | "playing" | "beaten" | "platinum" | "dropped";
    personalScore?: number | null;
    hoursPlayed?: number | null;
    shortNote?: string | null;
  }
>();

const mockNotes = new Map<
  string,
  { userId: string; score: number; body: string }[]
>();

const mockProfiles = new Map<string, PlayerProfile>();

let mockInitialized = false;

function ensureMockLibrary(userId: string) {
  if (mockInitialized) return;
  mockInitialized = true;

  mockLibrary.set(`${userId}:the-witcher-3-wild-hunt`, {
    status: "playing",
    personalScore: 9,
    hoursPlayed: 48,
  });
  mockLibrary.set(`${userId}:cyberpunk-2077`, {
    status: "playing",
    personalScore: 8,
    hoursPlayed: 22,
  });
  mockLibrary.set(`${userId}:baldurs-gate-3`, {
    status: "playing",
    personalScore: 10,
    hoursPlayed: 67,
  });
  mockLibrary.set(`${userId}:elden-ring`, {
    status: "platinum",
    personalScore: 10,
    hoursPlayed: 120,
  });
  mockLibrary.set(`${userId}:red-dead-redemption-2`, {
    status: "beaten",
    personalScore: 8,
    hoursPlayed: 54,
  });
  mockLibrary.set(`${userId}:hades`, {
    status: "wishlist",
  });
  mockLibrary.set(`${userId}:hollow-knight`, {
    status: "platinum",
    personalScore: 10,
    hoursPlayed: 62,
  });
  mockLibrary.set(`${userId}:celeste`, {
    status: "platinum",
    personalScore: 10,
    hoursPlayed: 18,
  });
  mockLibrary.set(`${userId}:god-of-war`, {
    status: "beaten",
    personalScore: 9,
    hoursPlayed: 31,
  });
  mockLibrary.set(`${userId}:stardew-valley`, {
    status: "beaten",
    personalScore: 9,
    hoursPlayed: 86,
  });
  mockLibrary.set(`${userId}:portal-2`, {
    status: "beaten",
    personalScore: 10,
    hoursPlayed: 12,
  });
  mockLibrary.set(`${userId}:starfield`, {
    status: "dropped",
    personalScore: 4,
    hoursPlayed: 19,
    shortNote: "O vazio venceu.",
  });
  mockLibrary.set(`${userId}:payday-2`, {
    status: "dropped",
    personalScore: 3,
    hoursPlayed: 8,
    shortNote: "DLC demais, poder pago.",
  });
  mockLibrary.set(`${userId}:pokemon-scarlet-violet`, {
    status: "dropped",
    personalScore: 5,
    hoursPlayed: 14,
  });

  mockProfiles.set(userId, {
    ...defaultPlayerProfile(userId),
    displayName: "Arcade Kid",
    nameplate: "KID 1P",
    bio: "Voltei do trampo. Platina no fim de semana, drop sem culpa.",
    favoriteGenres: ["RPG", "Soulslike", "Indie"],
    accent: "gold",
    pinnedSlugs: [
      "elden-ring",
      "hollow-knight",
      "red-dead-redemption-2",
      "god-of-war",
    ],
    platinumRank: ["elden-ring", "hollow-knight", "celeste"],
    beatenRank: [
      "portal-2",
      "god-of-war",
      "red-dead-redemption-2",
      "stardew-valley",
    ],
    worstRank: ["payday-2", "starfield", "pokemon-scarlet-violet"],
    steamId: null,
  });
}

export function isMockDbEnabled() {
  return !process.env.DATABASE_URL;
}

export function getMockGames(limit = 48) {
  return seedGames.slice(0, limit).map((game, index) =>
    enrichGame({
      id: `mock-${index}`,
      slug: game.slug,
      title: game.title,
      synopsis: game.synopsis,
      coverUrl: game.coverUrl,
      releaseYear: game.releaseYear,
      genres: game.genres,
      platforms: game.platforms,
      steamAppId: game.steamAppId,
      rawgId: null,
      metacritic: game.metacritic ?? null,
    }),
  );
}

export function getMockGamesWithStats(userId: string, limit = 48) {
  ensureMockLibrary(userId);

  return getMockGames(limit).map((game) => {
    const entry = mockLibrary.get(`${userId}:${game.slug}`);
    const notes = mockNotes.get(game.slug) ?? [];

    const communityScore =
      notes.length > 0
        ? notes.reduce((sum, n) => sum + n.score, 0) / notes.length
        : mockCommunityScore(game.slug, game.metacritic);

    return enrichGame({
      ...game,
      communityScore,
      communityReviewCount: notes.length || 12,
      userEntry: entry
        ? {
            status: entry.status,
            personalScore: entry.personalScore ?? null,
            hoursPlayed: entry.hoursPlayed ?? null,
            shortNote: entry.shortNote ?? null,
          }
        : null,
    });
  });
}

function mockCommunityScore(slug: string, metacritic: number | null) {
  if (metacritic) return Math.min(10, Math.round((metacritic / 10) * 10) / 10);
  const salt = slug.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return 7.4 + (salt % 22) / 10;
}

export function getMockGameBySlug(slug: string) {
  const game = getMockGames(200).find((g) => g.slug === slug);
  return game ?? null;
}

export function getMockUserStats(userId: string) {
  ensureMockLibrary(userId);
  const entries = [...mockLibrary.entries()].filter(([key]) =>
    key.startsWith(`${userId}:`),
  );
  const hours = entries.reduce(
    (sum, [, entry]) => sum + (entry.hoursPlayed ?? 0),
    0,
  );

  return {
    total: entries.length,
    playing: entries.filter(([, e]) => e.status === "playing").length,
    beaten: entries.filter(([, e]) =>
      ["beaten", "platinum"].includes(e.status),
    ).length,
    platinum: entries.filter(([, e]) => e.status === "platinum").length,
    wishlist: entries.filter(([, e]) => e.status === "wishlist").length,
    dropped: entries.filter(([, e]) => e.status === "dropped").length,
    hours: Math.round(hours),
    currentlyPlaying: entries
      .filter(([, e]) => e.status === "playing")
      .map(([key]) => key.split(":")[1]),
  };
}

export function getMockPlayingGames(userId: string) {
  ensureMockLibrary(userId);

  return getMockGames(200)
    .filter((game) => {
      const entry = mockLibrary.get(`${userId}:${game.slug}`);
      return entry?.status === "playing";
    })
    .map((game) => ({
      game,
      entry: {
        status: "playing" as const,
        personalScore: mockLibrary.get(`${userId}:${game.slug}`)
          ?.personalScore,
      },
    }));
}

export function getMockLibraryEntry(userId: string, slug: string) {
  ensureMockLibrary(userId);
  return mockLibrary.get(`${userId}:${slug}`) ?? null;
}

export function getMockGamesBySteamAppIds(appIds: number[]) {
  const wanted = new Set(appIds);
  return getMockGames(200).filter(
    (game) => game.steamAppId != null && wanted.has(game.steamAppId),
  );
}

export function listMockLibraryRows(userId: string) {
  ensureMockLibrary(userId);
  const games = getMockGames(200);
  const bySlug = new Map(games.map((game) => [game.slug, game]));

  return [...mockLibrary.entries()]
    .filter(([key]) => key.startsWith(`${userId}:`))
    .flatMap(([key, entry]) => {
      const slug = key.slice(userId.length + 1);
      const game = bySlug.get(slug);
      if (!game) return [];
      return [
        {
          gameId: game.id,
          slug: game.slug,
          status: entry.status,
          personalScore: entry.personalScore ?? null,
          hoursPlayed: entry.hoursPlayed ?? null,
          shortNote: entry.shortNote ?? null,
        },
      ];
    });
}

export function updateMockLibraryStatus(
  userId: string,
  slug: string,
  status: "wishlist" | "playing" | "beaten" | "platinum" | "dropped",
) {
  patchMockLibrary(userId, slug, { status });
}

export function patchMockLibrary(
  userId: string,
  slug: string,
  patch: {
    status?: "wishlist" | "playing" | "beaten" | "platinum" | "dropped";
    personalScore?: number | null;
    hoursPlayed?: number | null;
    shortNote?: string | null;
  },
) {
  const current = mockLibrary.get(`${userId}:${slug}`);
  mockLibrary.set(`${userId}:${slug}`, {
    status: patch.status ?? current?.status ?? "wishlist",
    personalScore:
      patch.personalScore !== undefined
        ? patch.personalScore
        : (current?.personalScore ?? null),
    hoursPlayed:
      patch.hoursPlayed !== undefined
        ? patch.hoursPlayed
        : (current?.hoursPlayed ?? null),
    shortNote:
      patch.shortNote !== undefined ? patch.shortNote : (current?.shortNote ?? null),
  });
}

export function getMockPlayerProfile(userId: string): PlayerProfile {
  ensureMockLibrary(userId);
  return mockProfiles.get(userId) ?? defaultPlayerProfile(userId);
}

export function updateMockPlayerProfile(
  userId: string,
  patch: ProfilePatch,
): PlayerProfile {
  ensureMockLibrary(userId);
  const current = mockProfiles.get(userId) ?? defaultPlayerProfile(userId);
  const next: PlayerProfile = {
    ...current,
    ...patch,
    displayName:
      patch.displayName?.trim().slice(0, 32) || current.displayName,
    nameplate:
      patch.nameplate != null
        ? patch.nameplate.trim().slice(0, 16).toUpperCase() || current.nameplate
        : current.nameplate,
    bio:
      patch.bio != null ? patch.bio.trim().slice(0, 180) : current.bio,
    favoriteGenres: patch.favoriteGenres
      ? sanitizeGenres(patch.favoriteGenres)
      : current.favoriteGenres,
    accent: isAccent(patch.accent) ? patch.accent : current.accent,
    pinnedSlugs: patch.pinnedSlugs
      ? clampPinned(patch.pinnedSlugs)
      : current.pinnedSlugs,
    platinumRank: uniqueSlugs(patch.platinumRank ?? current.platinumRank),
    beatenRank: uniqueSlugs(patch.beatenRank ?? current.beatenRank),
    worstRank: uniqueSlugs(patch.worstRank ?? current.worstRank),
    steamId: patch.steamId !== undefined ? patch.steamId : current.steamId,
    updatedAt: new Date(),
  };
  mockProfiles.set(userId, next);
  return next;
}

function uniqueSlugs(slugs: string[]) {
  return [...new Set(slugs.filter(Boolean))];
}

function isAccent(value: unknown): value is ProfileAccent {
  return value === "cyan" || value === "magenta" || value === "gold";
}

export function upsertMockCommunityNote(
  userId: string,
  slug: string,
  score: number,
  body: string,
) {
  const notes = mockNotes.get(slug) ?? [];
  const filtered = notes.filter((n) => n.userId !== userId);
  filtered.unshift({ userId, score, body });
  mockNotes.set(slug, filtered);
}

export function getMockGameDetails(slug: string, userId: string) {
  ensureMockLibrary(userId);
  const game = getMockGameBySlug(slug);
  if (!game) return null;

  const entry = mockLibrary.get(`${userId}:${slug}`);
  const notes = mockNotes.get(slug) ?? defaultNotesFor(game.monetization);

  const communityScore =
    notes.reduce((sum, n) => sum + n.score, 0) / Math.max(notes.length, 1);

  return {
    game: enrichGame({ ...game, communityScore }),
    communityScore,
    communityReviewCount: notes.length,
    userEntry: entry
      ? {
          id: `mock-entry-${slug}`,
          userId,
          gameId: game.id,
          status: entry.status,
          personalScore: entry.personalScore ?? null,
          hoursPlayed: entry.hoursPlayed ?? null,
          shortNote: entry.shortNote ?? null,
          startedAt: null,
          beatenAt: null,
          platinumAt: null,
          updatedAt: new Date(),
        }
      : null,
    notes: notes.map((note, index) => ({
      id: `mock-note-${index}`,
      userId: note.userId,
      gameId: game.id,
      score: note.score,
      body: note.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  };
}

function defaultNotesFor(monetization: Monetization) {
  if (monetization === "gacha") {
    return [
      {
        userId: "community_1",
        score: 8,
        body: "Mundo lindo. Só não entra achando que o banner é opcional.",
      },
      {
        userId: "community_2",
        score: 6,
        body: "Gacha pesado. Dá pra ir F2P, mas o poder mora no caixa.",
      },
    ];
  }

  if (monetization === "pay_to_win") {
    return [
      {
        userId: "community_1",
        score: 7,
        body: "Divertido até o ranked. Depois o pay to win aparece.",
      },
      {
        userId: "community_2",
        score: 5,
        body: "Quem paga, avança. A comunidade não esconde isso.",
      },
    ];
  }

  if (monetization === "cosmetics") {
    return [
      {
        userId: "community_1",
        score: 8,
        body: "Live service honesto: skin cara, poder não se compra.",
      },
      {
        userId: "community_2",
        score: 8,
        body: "A galera tilt, a skill é grátis. Fair no competitivo.",
      },
    ];
  }

  return [
    {
      userId: "community_1",
      score: 9,
      body: "Obra-prima. Vale cada hora.",
    },
    {
      userId: "community_2",
      score: 8,
      body: "Platina exige paciência, mas recompensa. Sem P2W.",
    },
  ];
}
