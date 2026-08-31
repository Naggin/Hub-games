import { Badge } from "@/components/ui/badge";
import {
  monetizationCopy,
  type Monetization,
} from "@/lib/games/catalog";
import { cn } from "@/lib/utils";

export function MonetizationBadge({
  monetization,
  size = "md",
}: {
  monetization: Monetization;
  size?: "sm" | "md";
}) {
  const copy = monetizationCopy[monetization];

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-pixel tracking-wide",
        size === "sm" ? "h-5 text-[8px]" : "h-6 text-[9px]",
        copy.className,
      )}
    >
      {size === "sm" ? copy.cabinet : `${copy.cabinet} · ${copy.label}`}
    </Badge>
  );
}
