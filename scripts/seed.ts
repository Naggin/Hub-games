import "dotenv/config";

import { sql } from "drizzle-orm";

import { getDb } from "../src/lib/db";
import { games } from "../src/lib/db/schema";
import { seedGames } from "../src/lib/games/seed-data";

async function main() {
  const db = getDb();

  console.log(`Seeding ${seedGames.length} games...`);

  for (const game of seedGames) {
    await db
      .insert(games)
      .values({
        slug: game.slug,
        title: game.title,
        synopsis: game.synopsis,
        coverUrl: game.coverUrl,
        releaseYear: game.releaseYear,
        genres: game.genres,
        platforms: game.platforms,
        steamAppId: game.steamAppId || null,
        metacritic: game.metacritic ?? null,
      })
      .onConflictDoUpdate({
        target: games.slug,
        set: {
          title: game.title,
          synopsis: game.synopsis,
          coverUrl: game.coverUrl,
          releaseYear: game.releaseYear,
          genres: game.genres,
          platforms: game.platforms,
          steamAppId: game.steamAppId || null,
          metacritic: game.metacritic ?? null,
        },
      });
  }

  const count = await db.select({ count: sql<number>`count(*)` }).from(games);
  console.log(`Done. Total games in database: ${count[0]?.count ?? 0}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
