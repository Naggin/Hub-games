"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Gamepad2, Home, Library, User } from "lucide-react";
import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

const links = [
  { href: "/hub", label: "Hub", icon: Home },
  { href: "/library", label: "Biblioteca", icon: Library },
];

function useDevBypass() {
  const getSnapshot = () => process.env.NEXT_PUBLIC_DEV_BYPASS === "true";

  return useSyncExternalStore(
    () => () => {},
    getSnapshot,
    getSnapshot,
  );
}

export function HubShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const devBypass = useDevBypass();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-neon-cyan/15 bg-void/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/hub" className="flex items-center gap-3">
            <div className="rounded-lg border border-neon-cyan/30 bg-neon-cyan/10 p-2">
              <Gamepad2 className="size-5 text-neon-cyan" />
            </div>
            <div>
              <p className="font-pixel text-[10px] text-neon-cyan text-glow-cyan">
                HUB-GAMES
              </p>
              <p className="text-xs text-muted-foreground">Seu save universal</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm transition",
                  pathname.startsWith(href)
                    ? "bg-neon-cyan/15 text-neon-cyan"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
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

        <nav className="flex gap-2 border-t border-neon-cyan/10 px-4 py-2 md:hidden">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs",
                pathname.startsWith(href)
                  ? "bg-neon-cyan/15 text-neon-cyan"
                  : "text-muted-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
