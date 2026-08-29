"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs/legacy";
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

export function ArcadeSignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [coinInserted, setCoinInserted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp(event: React.FormEvent) {
    event.preventDefault();
    if (!isLoaded || !signUp) return;

    setLoading(true);
    setError("");

    try {
      await signUp.create({
        emailAddress: email,
        password,
        username: username || undefined,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
    } catch (err) {
      setError("Não foi possível criar a conta. Verifique os dados.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(event: React.FormEvent) {
    event.preventDefault();
    if (!isLoaded || !signUp) return;

    setLoading(true);
    setError("");

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/hub");
      }
    } catch (err) {
      setError("Código inválido. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <ArcadeBackground />
      <div className="scanlines relative z-10 flex min-h-screen flex-col">
        <MarqueeTitle text="NEW GAME • CRIE SEU SAVE • HUB-GAMES" />

        <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8 text-center"
          >
            <p className="font-pixel text-xs text-neon-gold">PLAYER 2</p>
            <h1 className="mt-4 font-pixel text-lg text-neon-magenta md:text-2xl">
              NEW GAME
            </h1>
          </motion.div>

          {!coinInserted ? (
            <InsertCoinPrompt onInsert={() => setCoinInserted(true)} />
          ) : (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="box-glow-cyan w-full max-w-md rounded-2xl border border-neon-magenta/30 bg-card/80 p-6 backdrop-blur-xl"
            >
              {!pendingVerification ? (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Gamertag</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="NightRunner"
                      className="border-neon-magenta/30 bg-void/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-neon-magenta/30 bg-void/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-neon-magenta/30 bg-void/50"
                    />
                  </div>

                  {error && <p className="text-sm text-destructive">{error}</p>}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-neon-magenta font-pixel text-[10px] text-white hover:bg-neon-magenta/90"
                  >
                    {loading ? "CRIANDO..." : "START GAME"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerify} className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Enviamos um código para {email}. Confirme para entrar no hub.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="code">Código</Label>
                    <Input
                      id="code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="123456"
                      required
                      className="border-neon-magenta/30 bg-void/50"
                    />
                  </div>

                  {error && <p className="text-sm text-destructive">{error}</p>}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-neon-magenta font-pixel text-[10px] text-white"
                  >
                    {loading ? "VERIFICANDO..." : "CONFIRMAR"}
                  </Button>
                </form>
              )}

              <p className="mt-4 text-center text-sm text-muted-foreground">
                Já tem save?{" "}
                <Link href="/sign-in" className="text-neon-cyan hover:underline">
                  CONTINUAR — 1P
                </Link>
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
