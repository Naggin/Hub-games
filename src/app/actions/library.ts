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
  revalidatePath("/perfil");
}

export async function updateLibrarySaveAction(
  gameId: string,
  slug: string,
  personalScore: number | null,
  hoursPlayed: number | null,
  status?: LibraryStatus | null,
) {
  const userId = await requireUserId();
  await upsertLibraryEntry(userId, gameId, {
    status: status ?? "wishlist",
    personalScore,
    hoursPlayed,
  });
  revalidatePath("/hub");
  revalidatePath("/library");
  revalidatePath(`/library/${slug}`);
  revalidatePath("/perfil");
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
  revalidatePath("/perfil");
}
