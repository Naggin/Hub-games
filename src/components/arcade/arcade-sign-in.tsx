"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs/legacy";
import { motion } from "motion/react";
import Link from "next/link";

import {
  ArcadeBackground,
  InsertCoinPrompt,
  MarqueeTitle,
} from "@/components/arcade/arcade-background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ArcadeSignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [coinInserted, setCoinInserted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (!coinInserted && event.code === "Space") {
        event.preventDefault();
        setCoinInserted(true);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [coinInserted]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isLoaded || !signIn) return;

    setLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/hub");
      } else {
        setError("Complete a verificação adicional para continuar.");
      }
    } catch (err) {
      setError("Credenciais inválidas. Tente de novo, player.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

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
              Seu save universal. Biblioteca, progresso, platinas e notas da
              comunidade — tudo num cabinet neon.
            </p>
          </motion.div>

          {!coinInserted ? (
            <InsertCoinPrompt onInsert={() => setCoinInserted(true)} />
          ) : (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="box-glow-cyan w-full max-w-md rounded-2xl border border-neon-cyan/30 bg-card/80 p-6 backdrop-blur-xl"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="player@hub.games"
                    required
                    className="border-neon-cyan/30 bg-void/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="border-neon-cyan/30 bg-void/50"
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-neon-cyan font-pixel text-[10px] text-void hover:bg-neon-cyan/90"
                >
                  {loading ? "CARREGANDO..." : "CONTINUAR — 1P"}
                </Button>
              </form>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                Novo no hub?{" "}
                <Link
                  href="/sign-up"
                  className="text-neon-magenta hover:underline"
                >
                  NEW GAME
                </Link>
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
