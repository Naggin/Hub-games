import {
  integer,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const libraryStatusEnum = pgEnum("library_status", [
  "wishlist",
  "playing",
  "beaten",
  "platinum",
  "dropped",
]);

export const games = pgTable("games", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  synopsis: text("synopsis").notNull(),
  coverUrl: text("cover_url").notNull(),
  releaseYear: integer("release_year"),
  genres: text("genres").array().notNull().default([]),
  platforms: text("platforms").array().notNull().default([]),
  steamAppId: integer("steam_app_id"),
  rawgId: integer("rawg_id"),
  metacritic: integer("metacritic"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const libraryEntries = pgTable(
  "library_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    status: libraryStatusEnum("status").notNull().default("wishlist"),
    personalScore: integer("personal_score"),
    hoursPlayed: real("hours_played"),
    shortNote: text("short_note"),
    startedAt: timestamp("started_at"),
    beatenAt: timestamp("beaten_at"),
    platinumAt: timestamp("platinum_at"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("library_entries_user_game_idx").on(
      table.userId,
      table.gameId,
    ),
  ],
);

export const communityNotes = pgTable(
  "community_notes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    score: integer("score").notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("community_notes_user_game_idx").on(
      table.userId,
      table.gameId,
    ),
  ],
);

export type Game = typeof games.$inferSelect;
export type LibraryEntry = typeof libraryEntries.$inferSelect;
export type CommunityNote = typeof communityNotes.$inferSelect;
export type LibraryStatus = (typeof libraryStatusEnum.enumValues)[number];
