import type {
  PlayerProfile,
  RankCandidate,
  RankedCabinetGame,
} from "@/lib/profile/types";

export type CabinetStats = {
  platinum: number;
  beaten: number;
  hours: number;
  dropped: number;
  wishlist: number;
  playing?: number;
  total?: number;
};

export type CabinetView = {
  profile: Omit<PlayerProfile, "updatedAt"> & { updatedAt: string };
  stats: CabinetStats;
  genrePool: string[];
  pinned: RankedCabinetGame[];
  showcase: RankedCabinetGame[];
  ranks: {
    platinum: RankedCabinetGame[];
    beaten: RankedCabinetGame[];
    worst: RankedCabinetGame[];
  };
  candidates: {
    platinum: RankCandidate[];
    beaten: RankCandidate[];
    worst: RankCandidate[];
    pinned: RankCandidate[];
  };
};
