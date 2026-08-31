import { GameGridSkeleton } from "@/components/library/game-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function LibraryLoading() {
  return (
    <div className="space-y-8">
      <section>
        <p className="font-pixel text-[10px] text-neon-magenta">BIBLIOTECA</p>
        <Skeleton className="mt-2 h-9 w-72 bg-neon-magenta/5" />
        <Skeleton className="mt-3 h-5 w-96 bg-neon-magenta/5" />
      </section>

      <Skeleton className="h-10 w-full bg-neon-cyan/5" />

      <GameGridSkeleton count={8} />
    </div>
  );
}
