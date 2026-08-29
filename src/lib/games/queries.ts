import { and, avg, count, desc, eq, ilike, or } from "drizzle-orm";

import { getDb } from "@/lib/db";
import {
  communityNotes,
  games,
  libraryEntries,
  type LibraryStatus,
} from "@/lib/db/schema";
import { isMockDbEnabled } from "@/lib/games/mock-data";
import * as mock from "@/lib/games/mock-data";

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

    return {
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
    };
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

export async function getUserStats(userId: string) {
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
  const hours = entries.reduce((sum, e) => sum + (e.hoursPlayed ?? 0), 0);

  return {
    total: entries.length,
    playing: playing.length,
    beaten: beaten.length,
    platinum: platinum.length,
    wishlist: wishlist.length,
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
      mock.updateMockLibraryStatus(userId, game.slug, data.status);
    }

    return {
      id: `mock-${gameId}`,
      userId,
      gameId,
      status: data.status,
      personalScore: data.personalScore ?? null,
      hoursPlayed: data.hoursPlayed ?? null,
      shortNote: data.shortNote ?? null,
      startedAt: null,
      beatenAt: null,
      platinumAt: null,
      updatedAt: new Date(),
    };
  }

  const db = getDb();
  const now = new Date();

  const timestamps: {
    startedAt?: Date;
    beatenAt?: Date | null;
    platinumAt?: Date | null;
  } = {};

  if (data.status === "playing") {
    timestamps.startedAt = now;
  }

  if (data.status === "beaten" || data.status === "platinum") {
    timestamps.beatenAt = now;
  }

  if (data.status === "platinum") {
    timestamps.platinumAt = now;
    timestamps.beatenAt = now;
  }

  const [entry] = await db
    .insert(libraryEntries)
    .values({
      userId,
      gameId,
      status: data.status,
      personalScore: data.personalScore ?? null,
      hoursPlayed: data.hoursPlayed ?? null,
      shortNote: data.shortNote ?? null,
      ...timestamps,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [libraryEntries.userId, libraryEntries.gameId],
      set: {
        status: data.status,
        personalScore: data.personalScore ?? null,
        hoursPlayed: data.hoursPlayed ?? null,
        shortNote: data.shortNote ?? null,
        updatedAt: now,
        ...(data.status === "playing" ? { startedAt: now } : {}),
        ...(data.status === "beaten" || data.status === "platinum"
          ? { beatenAt: now }
          : {}),
        ...(data.status === "platinum" ? { platinumAt: now } : {}),
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

  return {
    game,
    communityScore: community?.avgScore ? Number(community.avgScore) : null,
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
      game,
    }));
  }

  const db = getDb();

  return db
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
