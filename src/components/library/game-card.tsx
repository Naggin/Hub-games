import { PosterCard, type PosterCardProps } from "@/components/browse/poster-card";

export function GameCard(props: PosterCardProps) {
  return <PosterCard variant="grid" {...props} />;
}
