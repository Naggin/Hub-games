"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

function useDevBypass() {
  const getSnapshot = () => process.env.NEXT_PUBLIC_DEV_BYPASS === "true";

  return useSyncExternalStore(
    () => () => {},
    getSnapshot,
    getSnapshot,
  );
}

export function DevModeBanner() {
  const bypass = useDevBypass();
  if (!bypass) return null;

  return (
    <div className="flex h-9 items-center justify-center border-b border-neon-gold/30 bg-neon-gold/10 px-4 text-center text-xs text-neon-gold">
      Modo dev sem Clerk/Neon — UI preview. Configure `.env.local` com Clerk + DATABASE_URL para produção.{" "}
      <Link href="/hub" className="underline">
        Ir pro hub
      </Link>
    </div>
  );
}
