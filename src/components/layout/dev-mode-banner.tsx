import Link from "next/link";

import { isDevBypassEnabled } from "@/lib/env";

export function DevModeBanner() {
  if (!isDevBypassEnabled()) return null;

  return (
    <div className="border-b border-neon-gold/30 bg-neon-gold/10 px-4 py-2 text-center text-xs text-neon-gold">
      Modo dev sem Clerk/Neon — UI preview. Configure `.env.local` com Clerk + DATABASE_URL para produção.{" "}
      <Link href="/hub" className="underline">
        Ir pro hub
      </Link>
    </div>
  );
}
