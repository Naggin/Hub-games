import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function GameCardSkeleton() {
  return (
    <Card className="overflow-hidden border-neon-cyan/10 bg-card/40">
      <Skeleton className="aspect-[460/215] rounded-none bg-neon-cyan/5" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-3/4 bg-neon-cyan/5" />
        <Skeleton className="h-3 w-1/4 bg-neon-cyan/5" />
        <div className="flex gap-1">
          <Skeleton className="h-4 w-16 bg-neon-cyan/5" />
          <Skeleton className="h-4 w-16 bg-neon-cyan/5" />
        </div>
      </div>
    </Card>
  );
}

export function GameGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <GameCardSkeleton key={index} />
      ))}
    </div>
  );
}
