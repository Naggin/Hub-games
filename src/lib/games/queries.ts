import { and, avg, count, desc, eq, ilike, or } from "drizzle-orm";

import { getDb } from "@/lib/db";
import {
  communityNotes,
  games,
  libraryEntries,
  playerProfiles,
  type LibraryStatus,
} from "@/lib/db/schema";
import { enrichGame, type Monetization } from "@/lib/games/catalog";
import type { GameFicha } from "@/lib/games/ficha";
import { isMockDbEnabled } from "@/lib/games/mock-data";
import * as mock from "@/lib/games/mock-data";
import {
  clampPinned,
  defaultPlayerProfile,
  sanitizeGenres,
  type PlayerProfile,
  type ProfileAccent,
  type ProfilePatch,
} from "@/lib/profile/types";

export type GameWithStats = {
  id: string;
  slug: string;
  title: string;
  synopsis: string;
  coverUrl: string;
  releaseYear: number | null;
  genres: string[];
  platforms: string[];
  steamAppId: number | null;
  rawgId: number | null;
  metacritic: number | null;
  communityScore: number | null;
  communityReviewCount: number;
  monetization: Monetization;
  monetizationLabel: string;
  communityTake: string;
  pitch: string;
  posterUrl: string;
  backdropUrl: string;
  summary: {
    premise: string;
    howYouPlay: string;
    whoItsFor: string;
    communityTalks: string;
  };
  longPitch: string;
  ficha: GameFicha;
  userEntry: {
    status: LibraryStatus;
    personalScore: number | null;
    hoursPlayed: number | null;
    shortNote: string | null;
  } | null;
};

export async function getGameBySlug(slug: string) {
  if (isMockDbEnabled()) return mock.getMockGameBySlug(slug);

  const db = getDb();
  const [game] = await db.select().from(games).where(eq(games.slug, slug)).limit(1);
  return game ?? null;
}

export async function searchGames(query: string, limit = 24) {
  if (isMockDbEnabled()) {
    const q = query.trim().toLowerCase();
    const all = mock.getMockGames(200);
    if (!q) return all.slice(0, limit);
    return all
      .filter(
        (game) =>
          game.title.toLowerCase().includes(q) ||
          game.synopsis.toLowerCase().includes(q),
      )
      .slice(0, limit);
  }

  const db = getDb();
  const pattern = `%${query.trim()}%`;

  if (!query.trim()) {
    return db.select().from(games).orderBy(desc(games.releaseYear)).limit(limit);
  }

  return db
    .select()
    .from(games)
    .where(
      or(ilike(games.title, pattern), ilike(games.synopsis, pattern)),
    )
    .orderBy(desc(games.releaseYear))
    .limit(limit);
}

export async function getGamesWithStats(
  userId: string | null,
  options: {
    status?: LibraryStatus;
    genre?: string;
    search?: string;
    limit?: number;
  } = {},
) {
  const { status, genre, search, limit = 48 } = options;

  if (isMockDbEnabled() && userId) {
    let result = mock.getMockGamesWithStats(userId, limit * 2);

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (game) =>
          game.title.toLowerCase().includes(q) ||
          game.synopsis.toLowerCase().includes(q),
      );
    }

    if (genre) {
      result = result.filter((game) => game.genres.includes(genre));
    }

    if (status) {
      result = result.filter((game) => game.userEntry?.status === status);
    }

    return result.slice(0, limit);
  }

  const db = getDb();

  const allGames = await db
    .select()
    .from(games)
    .orderBy(desc(games.releaseYear))
    .limit(limit * 2);

  const communityStats = await db
    .select({
      gameId: communityNotes.gameId,
      communityScore: avg(communityNotes.score),
      communityReviewCount: count(communityNotes.id),
    })
    .from(communityNotes)
    .groupBy(communityNotes.gameId);

  const communityMap = new Map(
    communityStats.map((row) => [
      row.gameId,
      {
        score: row.communityScore ? Number(row.communityScore) : null,
        count: Number(row.communityReviewCount ?? 0),
      },
    ]),
  );

  let userEntries: (typeof libraryEntries.$inferSelect)[] = [];
  if (userId) {
    userEntries = await db
      .select()
      .from(libraryEntries)
      .where(eq(libraryEntries.userId, userId));
  }

  const entryMap = new Map(userEntries.map((entry) => [entry.gameId, entry]));

  let result: GameWithStats[] = allGames.map((game) => {
    const community = communityMap.get(game.id);
    const entry = entryMap.get(game.id);

    return enrichGame({
      id: game.id,
      slug: game.slug,
      title: game.title,
      synopsis: game.synopsis,
      coverUrl: game.coverUrl,
      releaseYear: game.releaseYear,
      genres: game.genres,
      platforms: game.platforms,
      steamAppId: game.steamAppId,
      rawgId: game.rawgId,
      metacritic: game.metacritic,
      communityScore: community?.score ?? null,
      communityReviewCount: community?.count ?? 0,
      userEntry: entry
        ? {
            status: entry.status,
            personalScore: entry.personalScore,
            hoursPlayed: entry.hoursPlayed,
            shortNote: entry.shortNote,
          }
        : null,
    });
  });

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (game) =>
        game.title.toLowerCase().includes(q) ||
        game.synopsis.toLowerCase().includes(q),
    );
  }

  if (genre) {
    result = result.filter((game) => game.genres.includes(genre));
  }

  if (status) {
    result = result.filter((game) => game.userEntry?.status === status);
  }

  return result.slice(0, limit);
}

export async function getUserLibrary(userId: string) {
  const db = getDb();

  return db
    .select({
      entry: libraryEntries,
      game: games,
      communityScore: avg(communityNotes.score),
    })
    .from(libraryEntries)
    .innerJoin(games, eq(games.id, libraryEntries.gameId))
    .leftJoin(communityNotes, eq(communityNotes.gameId, games.id))
    .where(eq(libraryEntries.userId, userId))
    .groupBy(libraryEntries.id, games.id)
    .orderBy(desc(libraryEntries.updatedAt));
}

export type UserPrideStats = {
  total: number;
  playing: number;
  beaten: number;
  platinum: number;
  wishlist: number;
  dropped: number;
  hours: number;
};

export async function getUserStats(userId: string): Promise<
  UserPrideStats & { currentlyPlaying: unknown }
> {
  if (isMockDbEnabled()) return mock.getMockUserStats(userId);

  const db = getDb();

  const entries = await db
    .select()
    .from(libraryEntries)
    .where(eq(libraryEntries.userId, userId));

  const playing = entries.filter((e) => e.status === "playing");
  const beaten = entries.filter(
    (e) => e.status === "beaten" || e.status === "platinum",
  );
  const platinum = entries.filter((e) => e.status === "platinum");
  const wishlist = entries.filter((e) => e.status === "wishlist");
  const dropped = entries.filter((e) => e.status === "dropped");
  const hours = entries.reduce((sum, e) => sum + (e.hoursPlayed ?? 0), 0);

  return {
    total: entries.length,
    playing: playing.length,
    beaten: beaten.length,
    platinum: platinum.length,
    wishlist: wishlist.length,
    dropped: dropped.length,
    hours: Math.round(hours),
    currentlyPlaying: playing.slice(0, 6),
  };
}

export async function upsertLibraryEntry(
  userId: string,
  gameId: string,
  data: {
    status: LibraryStatus;
    personalScore?: number | null;
    hoursPlayed?: number | null;
    shortNote?: string | null;
  },
) {
  if (isMockDbEnabled()) {
    const game = mock.getMockGames(200).find((g) => g.id === gameId);
    if (game) {
      mock.patchMockLibrary(userId, game.slug, data);
    }
    const stored = game ? mock.getMockLibraryEntry(userId, game.slug) : null;

    return {
      id: `mock-${gameId}`,
      userId,
      gameId,
      status: stored?.status ?? data.status,
      personalScore: stored?.personalScore ?? null,
      hoursPlayed: stored?.hoursPlayed ?? null,
      shortNote: stored?.shortNote ?? null,
      startedAt: null,
      beatenAt: null,
      platinumAt: null,
      updatedAt: new Date(),
    };
  }

  const db = getDb();
  const now = new Date();

  const [existing] = await db
    .select()
    .from(libraryEntries)
    .where(
      and(eq(libraryEntries.userId, userId), eq(libraryEntries.gameId, gameId)),
    )
    .limit(1);

  const personalScore =
    data.personalScore !== undefined
      ? data.personalScore
      : (existing?.personalScore ?? null);
  const hoursPlayed =
    data.hoursPlayed !== undefined
      ? data.hoursPlayed
      : (existing?.hoursPlayed ?? null);
  const shortNote =
    data.shortNote !== undefined ? data.shortNote : (existing?.shortNote ?? null);

  const timestamps: {
    startedAt?: Date;
    beatenAt?: Date | null;
    platinumAt?: Date | null;
  } = {};

  if (data.status === "playing") {
    timestamps.startedAt = existing?.startedAt ?? now;
  }

  if (data.status === "beaten" || data.status === "platinum") {
    timestamps.beatenAt = existing?.beatenAt ?? now;
  }

  if (data.status === "platinum") {
    timestamps.platinumAt = existing?.platinumAt ?? now;
    timestamps.beatenAt = existing?.beatenAt ?? now;
  }

  const [entry] = await db
    .insert(libraryEntries)
    .values({
      userId,
      gameId,
      status: data.status,
      personalScore,
      hoursPlayed,
      shortNote,
      ...timestamps,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [libraryEntries.userId, libraryEntries.gameId],
      set: {
        status: data.status,
        personalScore,
        hoursPlayed,
        shortNote,
        updatedAt: now,
        ...timestamps,
      },
    })
    .returning();

  return entry;
}

export async function getCommunityNotesForGame(gameId: string) {
  const db = getDb();

  return db
    .select()
    .from(communityNotes)
    .where(eq(communityNotes.gameId, gameId))
    .orderBy(desc(communityNotes.updatedAt));
}

export async function upsertCommunityNote(
  userId: string,
  gameId: string,
  score: number,
  body: string,
) {
  if (isMockDbEnabled()) {
    const game = mock.getMockGames(200).find((g) => g.id === gameId);
    if (game) {
      mock.upsertMockCommunityNote(userId, game.slug, score, body);
    }

    return {
      id: `mock-note-${gameId}`,
      userId,
      gameId,
      score,
      body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  const db = getDb();
  const now = new Date();

  const [note] = await db
    .insert(communityNotes)
    .values({
      userId,
      gameId,
      score,
      body,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [communityNotes.userId, communityNotes.gameId],
      set: {
        score,
        body,
        updatedAt: now,
      },
    })
    .returning();

  return note;
}

export async function getGameWithFullDetails(
  slug: string,
  userId: string | null,
) {
  if (isMockDbEnabled() && userId) {
    return mock.getMockGameDetails(slug, userId);
  }

  const game = await getGameBySlug(slug);
  if (!game) return null;

  const db = getDb();

  const [community] = await db
    .select({
      avgScore: avg(communityNotes.score),
      count: count(),
    })
    .from(communityNotes)
    .where(eq(communityNotes.gameId, game.id));

  let userEntry = null;
  if (userId) {
    const [entry] = await db
      .select()
      .from(libraryEntries)
      .where(
        and(
          eq(libraryEntries.userId, userId),
          eq(libraryEntries.gameId, game.id),
        ),
      )
      .limit(1);
    userEntry = entry ?? null;
  }

  const notes = await getCommunityNotesForGame(game.id);

  const communityScore = community?.avgScore
    ? Number(community.avgScore)
    : null;

  return {
    game: enrichGame({ ...game, communityScore }),
    communityScore,
    communityReviewCount: Number(community?.count ?? 0),
    userEntry,
    notes,
  };
}

export async function getPlayingGamesWithDetails(userId: string) {
  if (isMockDbEnabled()) {
    return mock.getMockPlayingGames(userId).map(({ game, entry }) => ({
      entry: {
        id: `mock-entry-${game.slug}`,
        userId,
        gameId: game.id,
        status: "playing" as const,
        personalScore: entry.personalScore ?? null,
        hoursPlayed: null,
        shortNote: null,
        startedAt: null,
        beatenAt: null,
        platinumAt: null,
        updatedAt: new Date(),
      },
      game: enrichGame(game),
    }));
  }

  const db = getDb();

  const rows = await db
    .select({
      entry: libraryEntries,
      game: games,
    })
    .from(libraryEntries)
    .innerJoin(games, eq(games.id, libraryEntries.gameId))
    .where(
      and(
        eq(libraryEntries.userId, userId),
        eq(libraryEntries.status, "playing"),
      ),
    )
    .orderBy(desc(libraryEntries.updatedAt))
    .limit(6);

  return rows.map(({ entry, game }) => ({
    entry,
    game: enrichGame(game),
  }));
}

export async function upsertGameFromRawg(data: {
  slug: string;
  title: string;
  synopsis: string;
  coverUrl: string;
  releaseYear: number | null;
  genres: string[];
  platforms: string[];
  rawgId: number;
  metacritic: number | null;
}) {
  const db = getDb();

  const [game] = await db
    .insert(games)
    .values({
      slug: data.slug,
      title: data.title,
      synopsis: data.synopsis,
      coverUrl: data.coverUrl,
      releaseYear: data.releaseYear,
      genres: data.genres,
      platforms: data.platforms,
      rawgId: data.rawgId,
      metacritic: data.metacritic,
    })
    .onConflictDoUpdate({
      target: games.slug,
      set: {
        title: data.title,
        synopsis: data.synopsis,
        coverUrl: data.coverUrl,
        releaseYear: data.releaseYear,
        genres: data.genres,
        platforms: data.platforms,
        rawgId: data.rawgId,
        metacritic: data.metacritic,
      },
    })
    .returning();

  return game;
}

function isAccent(value: unknown): value is ProfileAccent {
  return value === "cyan" || value === "magenta" || value === "gold";
}

function rowToProfile(
  userId: string,
  row: typeof playerProfiles.$inferSelect | undefined,
): PlayerProfile {
  if (!row) return defaultPlayerProfile(userId);
  return {
    userId: row.userId,
    displayName: row.displayName,
    nameplate: row.nameplate || "1P",
    bio: row.bio,
    favoriteGenres: row.favoriteGenres ?? [],
    accent: isAccent(row.accent) ? row.accent : "cyan",
    pinnedSlugs: row.pinnedSlugs ?? [],
    platinumRank: row.platinumRank ?? [],
    beatenRank: row.beatenRank ?? [],
    worstRank: row.worstRank ?? [],
    updatedAt: row.updatedAt,
  };
}

export async function getPlayerProfile(userId: string): Promise<PlayerProfile> {
  if (isMockDbEnabled()) return mock.getMockPlayerProfile(userId);

  const db = getDb();
  const [row] = await db
    .select()
    .from(playerProfiles)
    .where(eq(playerProfiles.userId, userId))
    .limit(1);

  return rowToProfile(userId, row);
}

export async function updatePlayerProfile(
  userId: string,
  patch: ProfilePatch,
): Promise<PlayerProfile> {
  if (isMockDbEnabled()) {
    return mock.updateMockPlayerProfile(userId, patch);
  }

  const current = await getPlayerProfile(userId);
  const next: PlayerProfile = {
    ...current,
    displayName:
      patch.displayName?.trim().slice(0, 32) || current.displayName,
    nameplate:
      patch.nameplate != null
        ? patch.nameplate.trim().slice(0, 16).toUpperCase() || current.nameplate
        : current.nameplate,
    bio: patch.bio != null ? patch.bio.trim().slice(0, 180) : current.bio,
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
    updatedAt: new Date(),
  };

  const db = getDb();
  await db
    .insert(playerProfiles)
    .values({
      userId,
      displayName: next.displayName,
      nameplate: next.nameplate,
      bio: next.bio,
      favoriteGenres: next.favoriteGenres,
      accent: next.accent,
      pinnedSlugs: next.pinnedSlugs,
      platinumRank: next.platinumRank,
      beatenRank: next.beatenRank,
      worstRank: next.worstRank,
      updatedAt: next.updatedAt,
    })
    .onConflictDoUpdate({
      target: playerProfiles.userId,
      set: {
        displayName: next.displayName,
        nameplate: next.nameplate,
        bio: next.bio,
        favoriteGenres: next.favoriteGenres,
        accent: next.accent,
        pinnedSlugs: next.pinnedSlugs,
        platinumRank: next.platinumRank,
        beatenRank: next.beatenRank,
        worstRank: next.worstRank,
        updatedAt: next.updatedAt,
      },
    });

  return next;
}

function uniqueSlugs(slugs: string[]) {
  return [...new Set(slugs.filter(Boolean))];
}

export type RankedGame = {
  slug: string;
  title: string;
  coverUrl: string;
  posterUrl: string;
  personalScore: number | null;
  communityScore: number | null;
  status: LibraryStatus | null;
  hoursPlayed?: number | null;
};

export async function getProfileCabinet(userId: string) {
  const [profile, gamesList, stats] = await Promise.all([
    getPlayerProfile(userId),
    getGamesWithStats(userId, { limit: 200 }),
    getUserStats(userId),
  ]);

  const bySlug = new Map(gamesList.map((game) => [game.slug, game]));

  function toRanked(game: NonNullable<ReturnType<typeof bySlug.get>>): RankedGame {
    return {
      slug: game.slug,
      title: game.title,
      coverUrl: game.coverUrl,
      posterUrl: game.posterUrl,
      personalScore: game.userEntry?.personalScore ?? null,
      communityScore: game.communityScore,
      status: game.userEntry?.status ?? null,
      hoursPlayed: game.userEntry?.hoursPlayed ?? null,
    };
  }

  function resolveList(slugs: string[]): RankedGame[] {
    return slugs
      .map((slug) => bySlug.get(slug))
      .filter((game): game is NonNullable<typeof game> => Boolean(game))
      .map(toRanked);
  }

  function mergeRank(curated: RankedGame[], eligible: RankedGame[]) {
    const seen = new Set<string>();
    const merged: RankedGame[] = [];
    for (const game of [...curated, ...eligible]) {
      if (seen.has(game.slug)) continue;
      seen.add(game.slug);
      merged.push(game);
    }
    return merged;
  }

  const library = gamesList.filter((game) => game.userEntry);
  const platinumEligible = library.filter(
    (game) => game.userEntry?.status === "platinum",
  );
  const beatenEligible = library.filter((game) =>
    ["beaten", "platinum"].includes(game.userEntry?.status ?? ""),
  );
  const worstEligible = library.filter((game) => {
    const status = game.userEntry?.status;
    const score = game.userEntry?.personalScore;
    if (status === "dropped") return true;
    if (score != null && score <= 5) return true;
    return Boolean(game.userEntry);
  });

  const showcase = beatenEligible.map(toRanked);
  const nowPlaying = library
    .filter((game) => game.userEntry?.status === "playing")
    .map(toRanked);
  const backlog = library
    .filter((game) => game.userEntry?.status === "wishlist")
    .map(toRanked);

  const platinumRanked = mergeRank(
    resolveList(profile.platinumRank),
    platinumEligible.map(toRanked),
  );
  const beatenRanked = mergeRank(
    resolveList(profile.beatenRank),
    beatenEligible.map(toRanked),
  );
  const worstRanked = mergeRank(
    resolveList(profile.worstRank),
    worstEligible
      .filter(
        (game) =>
          game.userEntry?.status === "dropped" ||
          (game.userEntry?.personalScore != null &&
            game.userEntry.personalScore <= 5),
      )
      .map(toRanked),
  );
  const pinnedResolved = resolveList(profile.pinnedSlugs);
  const pinned =
    pinnedResolved.length > 0
      ? pinnedResolved
      : [...platinumRanked, ...beatenRanked].slice(0, 4);

  const genrePool = [
    ...new Set(gamesList.flatMap((game) => game.genres)),
  ].sort((a, b) => a.localeCompare(b, "pt-BR"));

  return {
    profile,
    stats,
    games: gamesList,
    genrePool,
    pinned,
    showcase,
    nowPlaying,
    backlog,
    ranks: {
      platinum: platinumRanked,
      beaten: beatenRanked,
      worst: worstRanked,
    },
    candidates: {
      platinum: platinumEligible
        .filter((game) => !profile.platinumRank.includes(game.slug))
        .map((game) => ({ slug: game.slug, title: game.title })),
      beaten: beatenEligible
        .filter((game) => !profile.beatenRank.includes(game.slug))
        .map((game) => ({ slug: game.slug, title: game.title })),
      worst: worstEligible
        .filter((game) => !profile.worstRank.includes(game.slug))
        .map((game) => ({ slug: game.slug, title: game.title })),
      pinned: library
        .filter((game) => !profile.pinnedSlugs.includes(game.slug))
        .map((game) => ({ slug: game.slug, title: game.title })),
    },
  };
}
