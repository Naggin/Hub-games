"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { DEV_USER_ID, isDevBypassEnabled } from "@/lib/env";
import { getPlayerProfile, updatePlayerProfile } from "@/lib/games/queries";
import {
  addSlug,
  clampPinned,
  moveSlug,
  rankKey,
  removeSlug,
  type ProfileAccent,
  type ProfilePatch,
  type RankListId,
} from "@/lib/profile/types";

async function requireUserId() {
  if (isDevBypassEnabled()) {
    return DEV_USER_ID;
  }

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

function refreshProfile() {
  revalidatePath("/perfil");
  revalidatePath("/hub");
}

export async function savePlayerProfileAction(patch: ProfilePatch) {
  const userId = await requireUserId();
  const profile = await updatePlayerProfile(userId, patch);
  refreshProfile();
  return profile;
}

export async function moveRankAction(
  list: RankListId,
  slug: string,
  direction: -1 | 1,
) {
  const userId = await requireUserId();
  const profile = await getPlayerProfile(userId);
  const key = rankKey(list);
  await updatePlayerProfile(userId, {
    [key]: moveSlug(profile[key], slug, direction),
  });
  refreshProfile();
}

export async function addToRankAction(list: RankListId, slug: string) {
  const userId = await requireUserId();
  const profile = await getPlayerProfile(userId);
  const key = rankKey(list);
  await updatePlayerProfile(userId, {
    [key]: addSlug(profile[key], slug),
  });
  refreshProfile();
}

export async function removeFromRankAction(list: RankListId, slug: string) {
  const userId = await requireUserId();
  const profile = await getPlayerProfile(userId);
  const key = rankKey(list);
  await updatePlayerProfile(userId, {
    [key]: removeSlug(profile[key], slug),
  });
  refreshProfile();
}

export async function togglePinnedGameAction(slug: string) {
  const userId = await requireUserId();
  const profile = await getPlayerProfile(userId);
  const exists = profile.pinnedSlugs.includes(slug);
  const pinnedSlugs = exists
    ? removeSlug(profile.pinnedSlugs, slug)
    : clampPinned(addSlug(profile.pinnedSlugs, slug, 4));
  await updatePlayerProfile(userId, { pinnedSlugs });
  refreshProfile();
}

export async function setAccentAction(accent: ProfileAccent) {
  const userId = await requireUserId();
  await updatePlayerProfile(userId, { accent });
  refreshProfile();
}
