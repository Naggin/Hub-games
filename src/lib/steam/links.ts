/**
 * Overlay-friendly Steam link store.
 * Mock Map always wins in-process; DB column is the durable copy when Neon is up.
 */

export type SteamLink = {
  steamId: string | null;
  lastSyncedAt: Date | null;
};

const links = new Map<string, SteamLink>();

export function getSteamLink(userId: string): SteamLink | undefined {
  return links.get(userId);
}

export function setSteamLink(
  userId: string,
  patch: Partial<SteamLink> & { steamId?: string | null },
): SteamLink {
  const current = links.get(userId) ?? { steamId: null, lastSyncedAt: null };
  const next: SteamLink = {
    steamId: patch.steamId !== undefined ? patch.steamId : current.steamId,
    lastSyncedAt:
      patch.lastSyncedAt !== undefined
        ? patch.lastSyncedAt
        : current.lastSyncedAt,
  };
  links.set(userId, next);
  return next;
}

export function clearSteamLink(userId: string) {
  links.delete(userId);
}
