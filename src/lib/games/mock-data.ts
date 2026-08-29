import { seedGames } from "@/lib/games/seed-data";

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

let mockInitialized = false;

function ensureMockLibrary(userId: string) {
  if (mockInitialized) return;
  mockInitialized = true;

  mockLibrary.set(`${userId}:${seedGames[0].slug}`, {
    status: "playing",
    personalScore: 9,
  });
  mockLibrary.set(`${userId}:${seedGames[1].slug}`, {
    status: "platinum",
    personalScore: 10,
  });
  mockLibrary.set(`${userId}:${seedGames[2].slug}`, {
    status: "beaten",
    personalScore: 8,
  });
}

export function isMockDbEnabled() {
  return !process.env.DATABASE_URL;
}

export function getMockGames(limit = 48) {
  return seedGames.slice(0, limit).map((game, index) => ({
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
  }));
}

export function getMockGamesWithStats(userId: string, limit = 48) {
  ensureMockLibrary(userId);

  return getMockGames(limit).map((game) => {
    const entry = mockLibrary.get(`${userId}:${game.slug}`);
    const notes = mockNotes.get(game.slug) ?? [];

    return {
      ...game,
      communityScore:
        notes.length > 0
          ? notes.reduce((sum, n) => sum + n.score, 0) / notes.length
          : 8.5,
      communityReviewCount: notes.length || 12,
      userEntry: entry
        ? {
            status: entry.status,
            personalScore: entry.personalScore ?? null,
            hoursPlayed: entry.hoursPlayed ?? null,
            shortNote: entry.shortNote ?? null,
          }
        : null,
    };
  });
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

  return {
    total: entries.length,
    playing: entries.filter(([, e]) => e.status === "playing").length,
    beaten: entries.filter(([, e]) =>
      ["beaten", "platinum"].includes(e.status),
    ).length,
    platinum: entries.filter(([, e]) => e.status === "platinum").length,
    wishlist: entries.filter(([, e]) => e.status === "wishlist").length,
    hours: 142,
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

export function updateMockLibraryStatus(
  userId: string,
  slug: string,
  status: "wishlist" | "playing" | "beaten" | "platinum" | "dropped",
) {
  mockLibrary.set(`${userId}:${slug}`, {
    status,
    personalScore: mockLibrary.get(`${userId}:${slug}`)?.personalScore ?? null,
  });
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
  const game = getMockGameBySlug(slug);
  if (!game) return null;

  const entry = mockLibrary.get(`${userId}:${slug}`);
  const notes = mockNotes.get(slug) ?? [
    {
      userId: "community_1",
      score: 9,
      body: "Obra-prima. Vale cada hora.",
    },
    {
      userId: "community_2",
      score: 8,
      body: "Platina exige paciência, mas recompensa.",
    },
  ];

  return {
    game,
    communityScore:
      notes.reduce((sum, n) => sum + n.score, 0) / Math.max(notes.length, 1),
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
