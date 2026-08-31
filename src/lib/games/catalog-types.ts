export type MonetizationKind = "fair" | "cosmetics" | "gacha" | "pay_to_win";

export type SpoilerFreeSummary = {
  premise: string;
  howYouPlay: string;
  whoItsFor: string;
  communityTalks: string;
};

export type CatalogOverlay = {
  pitch?: string;
  communityTake?: string;
  monetization?: MonetizationKind;
  /** Optional inline override; flagship copy lives in spoiler-free.ts. */
  summary?: SpoilerFreeSummary;
};
