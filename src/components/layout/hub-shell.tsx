"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Bot, Gamepad2, Home, Library, User } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

import { CompanionCabinet } from "@/components/companion/companion-cabinet";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  { href: "/hub", label: "Hub", icon: Home },
  { href: "/hub#continuar", label: "Continuar jogando", icon: Gamepad2 },
  { href: "/library", label: "Biblioteca", icon: Library },
];

function useDevBypass() {
  const getSnapshot = () =>
    process.env.NEXT_PUBLIC_DEV_BYPASS === "true" ||
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return useSyncExternalStore(
    () => () => {},
    getSnapshot,
    getSnapshot,
  );
}

export function HubShell({
  children,
  browse = false,
}: {
  children: React.ReactNode;
  browse?: boolean;
}) {
  const pathname = usePathname();
  const devBypass = useDevBypass();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!browse) return;
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [browse]);

  return (
    <div className="relative min-h-screen">
      <div className="arcade-grid pointer-events-none fixed inset-0 z-0 opacity-40" />

      <header
        className={cn(
          "z-40 transition-colors duration-300",
          browse
            ? cn(
                "fixed inset-x-0",
                devBypass ? "top-9" : "top-0",
                scrolled
                  ? "border-b border-neon-cyan/15 bg-void/70 backdrop-blur-xl"
                  : "border-transparent bg-gradient-to-b from-void/80 via-void/40 to-transparent",
              )
            : "sticky top-0 border-b border-neon-cyan/15 bg-void/65 backdrop-blur-xl",
        )}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 md:px-8">
          <Link href="/hub" className="flex items-center gap-3">
            <div className="rounded-lg border border-neon-cyan/30 bg-neon-cyan/10 p-2">
              <Gamepad2 className="size-5 text-neon-cyan" />
            </div>
            <div>
              <p className="font-pixel text-[10px] text-neon-cyan text-glow-cyan">
                HUB-GAMES
              </p>
              <p className="text-xs text-muted-foreground">
                O arcade do nerd gamer
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map(({ href, label, icon: Icon }) => {
              const active =
                href.includes("#")
                  ? false
                  : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm transition",
                    active
                      ? "bg-neon-cyan/15 text-neon-cyan"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              );
            })}
            <CompanionTrigger />
          </nav>

          {devBypass ? (
            <div className="flex size-8 items-center justify-center rounded-full border border-neon-gold/40 bg-neon-gold/10">
              <User className="size-4 text-neon-gold" />
            </div>
          ) : (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "border border-neon-cyan/40",
                },
              }}
            />
          )}
        </div>

        {!browse && (
          <div className="overflow-hidden border-t border-neon-cyan/10 bg-secondary/40 py-1.5">
            <p className="font-pixel animate-marquee text-[9px] tracking-widest text-neon-cyan/85 whitespace-nowrap">
              HUB-GAMES • O ARCADE DOS NERDS • CONTINUE? • FAIR PLAY • 1 CREDIT • HIGH SCORE • INSERT COIN •{" "}
              HUB-GAMES • O ARCADE DOS NERDS • CONTINUE? • FAIR PLAY • 1 CREDIT • HIGH SCORE • INSERT COIN •
            </p>
          </div>
        )}

        <nav className="flex gap-2 border-t border-white/5 px-4 py-2 lg:hidden">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-[11px]",
                pathname.startsWith(href.replace("#continuar", ""))
                  ? "bg-neon-cyan/15 text-neon-cyan"
                  : "text-muted-foreground",
              )}
            >
              <Icon className="size-4" />
              {label === "Continuar jogando" ? "Continuar" : label}
            </Link>
          ))}
          <CompanionTrigger mobile />
        </nav>
      </header>

      <main
        className={cn(
          "relative z-10",
          browse ? "w-full pb-12" : "mx-auto max-w-7xl px-4 py-8",
        )}
      >
        {children}
      </main>
    </div>
  );
}

function CompanionTrigger({ mobile = false }: { mobile?: boolean }) {
  return (
    <Sheet>
      <SheetTrigger
        className={cn(
          "flex items-center justify-center gap-2 rounded-full text-sm text-muted-foreground transition hover:text-neon-magenta",
          mobile ? "flex-1 rounded-lg py-2 text-[11px]" : "px-4 py-2",
        )}
      >
        <Bot className="size-4 text-neon-magenta" />
        Companheiro
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full border-neon-cyan/20 bg-card p-0 sm:max-w-md"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Companheiro</SheetTitle>
        </SheetHeader>
        <CompanionCabinet />
      </SheetContent>
    </Sheet>
  );
}
