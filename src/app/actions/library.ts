"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import type { LibraryStatus } from "@/lib/db/schema";
import { DEV_USER_ID, isDevBypassEnabled } from "@/lib/env";
import {
  upsertCommunityNote,
  upsertLibraryEntry,
} from "@/lib/games/queries";

async function requireUserId() {
  if (isDevBypassEnabled()) {
    return DEV_USER_ID;
  }

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

export async function updateLibraryStatusAction(
  gameId: string,
  status: LibraryStatus,
  slug: string,
) {
  const userId = await requireUserId();
  await upsertLibraryEntry(userId, gameId, { status });
  revalidatePath("/hub");
  revalidatePath("/library");
  revalidatePath(`/library/${slug}`);
}

export async function updatePersonalScoreAction(
  gameId: string,
  personalScore: number,
  slug: string,
) {
  const userId = await requireUserId();
  const { getDb } = await import("@/lib/db");
  const { libraryEntries } = await import("@/lib/db/schema");
  const { and, eq } = await import("drizzle-orm");

  const db = getDb();
  const [existing] = await db
    .select()
    .from(libraryEntries)
    .where(
      and(
        eq(libraryEntries.userId, userId),
        eq(libraryEntries.gameId, gameId),
      ),
    )
    .limit(1);

  await upsertLibraryEntry(userId, gameId, {
    status: existing?.status ?? "wishlist",
    personalScore,
  });

  revalidatePath("/hub");
  revalidatePath("/library");
  revalidatePath(`/library/${slug}`);
}

export async function submitCommunityNoteAction(
  gameId: string,
  score: number,
  body: string,
  slug: string,
) {
  const userId = await requireUserId();
  await upsertCommunityNote(userId, gameId, score, body);
  revalidatePath("/library");
  revalidatePath(`/library/${slug}`);
  revalidatePath("/hub");
}
