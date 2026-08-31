"use client";

import { TrophyRoom } from "@/components/profile/trophy-room";
import type { LibraryStatus } from "@/lib/db/schema";
import type { PlayerProfile, RankListId } from "@/lib/profile/types";

type RankedGame = {
  slug: string;
  title: string;
  coverUrl: string;
  posterUrl: string;
  personalScore: number | null;
  communityScore: number | null;
  status: LibraryStatus | null;
};

type Candidate = { slug: string; title: string };

type ProfileCabinetProps = {
  profile: PlayerProfile;
  stats: {
    platinum: number;
    beaten: number;
    playing: number;
    wishlist: number;
    dropped: number;
    hours: number;
  };
  genrePool: string[];
  pinned: RankedGame[];
  showcase: RankedGame[];
  ranks: Record<RankListId, RankedGame[]>;
  candidates: Record<RankListId | "pinned", Candidate[]>;
};

/** Adapter over the trophy room — keeps the previous props contract. */
export function ProfileCabinet(props: ProfileCabinetProps) {
  const updatedAt =
    props.profile.updatedAt instanceof Date
      ? props.profile.updatedAt.toISOString()
      : String(props.profile.updatedAt);

  return (
    <TrophyRoom
      cabinet={{
        profile: {
          ...props.profile,
          nameplate: props.profile.nameplate || "1P",
          updatedAt,
        },
        stats: props.stats,
        genrePool: props.genrePool,
        pinned: props.pinned,
        showcase: props.showcase,
        nowPlaying: [],
        backlog: [],
        steam: {
          steamId: props.profile.steamId ?? null,
          demo: true,
          lastSyncedAt: null,
        },
        ranks: props.ranks,
        candidates: props.candidates,
      }}
    />
  );
}
