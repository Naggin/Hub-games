import { GameCardSkeleton } from "@/components/library/game-card-skeleton";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function HubLoading() {
  return (
    <div className="space-y-10">
      <section className="space-y-2">
        <p className="font-pixel text-[10px] text-neon-cyan">BEM-VINDO DE VOLTA</p>
        <Skeleton className="h-9 w-64 bg-neon-cyan/5" />
        <Skeleton className="h-5 w-80 bg-neon-cyan/5" />
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <GameCardSkeleton key={index} />
        ))}
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border-neon-cyan/10 bg-card/50 p-5">
              <Skeleton className="h-4 w-20 bg-neon-cyan/5" />
              <Skeleton className="mt-3 h-8 w-12 bg-neon-cyan/5" />
            </Card>
          ))}
        </div>

        <Card className="border-neon-cyan/10 bg-card/40 p-5">
          <p className="font-pixel text-[10px] text-neon-cyan">
            PROGRESSO DA COLEÇÃO
          </p>
          <Skeleton className="mt-4 h-2.5 w-full rounded-full bg-neon-cyan/5" />
        </Card>
      </div>
    </div>
  );
}
