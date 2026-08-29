"use client";

import Link from "next/link";
import { motion } from "motion/react";

import {
  ArcadeBackground,
  InsertCoinPrompt,
  MarqueeTitle,
} from "@/components/arcade/arcade-background";
import { Button } from "@/components/ui/button";
import { isDevBypassEnabledClient } from "@/lib/env-client";

export function DevArcadeSignIn() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <ArcadeBackground />
      <div className="scanlines relative z-10 flex min-h-screen flex-col">
        <MarqueeTitle text="HUB-GAMES • O HUB DOS SONHOS DOS GAMERS • 1 CREDIT" />

        <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8 text-center"
          >
            <p className="font-pixel text-xs text-neon-magenta">PLAYER 1</p>
            <h1 className="mt-4 font-pixel text-lg text-neon-cyan text-glow-cyan md:text-2xl">
              HUB-GAMES
            </h1>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Preview arcade do login. Configure Clerk para auth real.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="box-glow-cyan w-full max-w-md rounded-2xl border border-neon-cyan/30 bg-card/80 p-6 backdrop-blur-xl text-center"
          >
            <InsertCoinPrompt onInsert={() => {}} />
            <div className="mt-6">
              <Button
                asChild
                className="w-full bg-neon-cyan font-pixel text-[10px] text-void hover:bg-neon-cyan/90"
              >
                <Link href="/hub">ENTRAR NO HUB — DEV</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function DevArcadeSignUp() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <ArcadeBackground />
      <div className="scanlines relative z-10 flex min-h-screen flex-col">
        <MarqueeTitle text="NEW GAME • CRIE SEU SAVE • HUB-GAMES" />
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
          <Button asChild className="bg-neon-magenta font-pixel text-[10px]">
            <Link href="/hub">ENTRAR NO HUB — DEV</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
