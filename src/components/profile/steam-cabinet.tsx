"use client";

import { useEffect, useState, useTransition } from "react";

import {
  linkSteamAction,
  syncSteamLibraryAction,
  unlinkSteamAction,
  type SteamSyncItem,
} from "@/app/actions/steam";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { statusLabels } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type SteamCabinetState = {
  steamId: string | null;
  demo: boolean;
  lastSyncedAt: string | null;
};

export function SteamCabinetDoor({ steam }: { steam: SteamCabinetState }) {
  return (
    <Sheet>
      <SheetTrigger
        className={cn(
          "group fixed left-4 z-40 flex items-center gap-3 rounded-r-sm border-y border-r px-3 py-3",
          "border-neon-cyan/50 bg-void/90 backdrop-blur-md box-glow-cyan",
          "bottom-4 md:bottom-8",
        )}
      >
        <ValveMark className="size-10" />
        <span className="text-left">
          <span className="block font-pixel text-[8px] tracking-widest text-neon-cyan">
            STEAM CABINET
          </span>
          <span className="block text-xs text-muted-foreground">
            {steam.steamId ? "Sincronizar horas" : "Liga a conta"}
          </span>
        </span>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-full gap-0 overflow-y-auto border-neon-cyan/25 bg-void sm:max-w-lg"
      >
        <SheetHeader className="border-b border-neon-cyan/15 p-5">
          <SheetTitle className="font-pixel text-[11px] tracking-widest text-neon-cyan">
            STEAM CABINET
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Liga a Steam, a gente puxa o que você jogou e as horas. Perfil de
            jogos precisa estar público.
          </SheetDescription>
        </SheetHeader>
        <div className="p-5">
          <SteamCabinetPanel steam={steam} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function SteamCabinetPanel({ steam }: { steam: SteamCabinetState }) {
  const [pending, startTransition] = useTransition();
  const [identity, setIdentity] = useState("");
  const [steamId, setSteamId] = useState(steam.steamId);
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<"ok" | "err" | null>(null);
  const [items, setItems] = useState<SteamSyncItem[]>([]);

  useEffect(() => {
    setSteamId(steam.steamId);
  }, [steam.steamId]);

  const linked = Boolean(steamId);

  function connect() {
    startTransition(async () => {
      const result = await linkSteamAction(identity);
      setTone(result.ok ? "ok" : "err");
      setMessage(result.message);
      if (result.ok) {
        setSteamId(result.steamId);
        setIdentity("");
      }
    });
  }

  function disconnect() {
    startTransition(async () => {
      const result = await unlinkSteamAction();
      setTone(result.ok ? "ok" : "err");
      setMessage(result.message);
      if (result.ok) {
        setSteamId(null);
        setItems([]);
      }
    });
  }

  function sync() {
    startTransition(async () => {
      const result = await syncSteamLibraryAction();
      setTone(result.ok ? "ok" : "err");
      setMessage(result.message);
      if (result.ok) setItems(result.items);
      else setItems([]);
    });
  }

  return (
    <section className="space-y-4">
      <div className="relative overflow-hidden rounded-lg border border-neon-cyan/30 bg-card/70 p-4 box-glow-cyan">
        <div className="pointer-events-none absolute inset-0 scanlines opacity-40" />
        <div className="relative flex items-center gap-4">
          <ValveMark className="size-16 shrink-0" />
          <div>
            <p className="font-pixel text-[8px] tracking-[0.28em] text-neon-cyan">
              {steam.demo ? "MODO DEMO" : "LIVE WIRE"}
            </p>
            <p className="mt-2 text-sm text-foreground/90">
              {linked
                ? "Cabo plugado. Um toque puxa as horas."
                : "Cola a URL do perfil e entra. Sem formulário de cinco campos."}
            </p>
          </div>
        </div>
      </div>

      {!linked ? (
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            connect();
          }}
        >
          <label htmlFor="steam-identity" className="text-xs text-muted-foreground">
            URL / vanity / steamid64
          </label>
          <Input
            id="steam-identity"
            value={identity}
            onChange={(event) => setIdentity(event.target.value)}
            placeholder="steamcommunity.com/id/seuNick"
            className="mt-1 h-11 border-neon-cyan/30 bg-card/80 font-mono text-sm"
            autoComplete="off"
          />
          <Button
            type="submit"
            disabled={pending || !identity.trim()}
            className="h-11 w-full bg-neon-cyan text-void hover:bg-neon-cyan/90"
          >
            {pending ? "Ligando…" : "Conectar"}
          </Button>
        </form>
      ) : (
        <div className="space-y-3">
          <p className="rounded-md border border-white/10 bg-void/50 px-3 py-2 font-mono text-xs text-neon-cyan">
            {steamId}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              onClick={sync}
              disabled={pending}
              className="h-11 flex-1 bg-neon-cyan text-void hover:bg-neon-cyan/90"
            >
              {pending
                ? "Puxando save…"
                : steam.demo
                  ? "Sincronizar (demo)"
                  : "Sincronizar"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={disconnect}
              disabled={pending}
              className="h-11 border-white/15"
            >
              Desligar
            </Button>
          </div>
        </div>
      )}

      {steam.demo && !linked && (
        <>
          <Button
            type="button"
            variant="outline"
            onClick={sync}
            disabled={pending}
            className="h-11 w-full border-neon-gold/40 text-neon-gold hover:bg-neon-gold/10"
          >
            {pending ? "Puxando save…" : "Sincronizar (demo)"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Sem <span className="font-mono text-neon-gold">STEAM_API_KEY</span> o
            sync demo preenche Witcher e Elden a partir do seed. Não é a tua Steam
            de verdade.
          </p>
        </>
      )}

      {message && (
        <p
          className={cn(
            "rounded-md border px-3 py-2 text-sm",
            tone === "ok"
              ? "border-neon-cyan/30 bg-neon-cyan/10 text-foreground"
              : "border-destructive/40 bg-destructive/10 text-destructive",
          )}
        >
          {message}
        </p>
      )}

      {items.length > 0 && (
        <ul className="space-y-1.5">
          {items.map((item) => (
            <li
              key={item.title}
              className="flex items-center justify-between gap-2 rounded-md border border-white/10 bg-card/50 px-3 py-2 text-sm"
            >
              <span className="min-w-0 truncate">{item.title}</span>
              <span className="shrink-0 font-pixel text-[8px] tracking-widest text-muted-foreground">
                {item.hours}H ·{" "}
                {statusLabels[item.status] ?? item.status}
                {item.created ? " · NOVO" : ""}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs leading-relaxed text-muted-foreground">
        A gente só fala com a Web API oficial. Se o perfil de jogos estiver
        privado, a Valve não manda a lista — em Privacidade, deixa{" "}
        <strong className="text-foreground">Detalhes dos jogos</strong> público.
        Platina, zerado, drop, nota e recado não são sobrescritos.
      </p>
    </section>
  );
}

function ValveMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative grid place-items-center rounded-full border-2 border-neon-cyan/80",
        className,
      )}
    >
      <span className="absolute inset-1 rounded-full border border-neon-cyan/40" />
      <span className="size-2.5 rounded-full bg-neon-cyan shadow-[0_0_10px_rgba(0,245,255,0.8)]" />
    </span>
  );
}
