export const statusLabels: Record<string, string> = {
  wishlist: "Quero jogar",
  playing: "Jogando",
  beaten: "Zerei",
  platinum: "Platinei",
  dropped: "Abandonei",
};

export const statusColors: Record<string, string> = {
  wishlist: "border-neon-magenta/50 text-neon-magenta",
  playing: "border-neon-cyan/50 text-neon-cyan",
  beaten: "border-emerald-400/50 text-emerald-400",
  platinum: "border-neon-gold/50 text-neon-gold",
  dropped: "border-muted-foreground/50 text-muted-foreground",
};

export function formatScore(score: number | null | undefined) {
  if (score == null) return "—";
  return score.toFixed(1);
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
