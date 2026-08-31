"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Gamepad2, Home, Library, User } from "lucide-react";
import { motion } from "motion/react";

import { isClerkConfiguredClient } from "@/lib/env-client";
import { springSnappy } from "@/lib/motion";
import { cn } from "@/lib/utils";

const links = [
  { href: "/hub", label: "Hub", icon: Home },
  { href: "/library", label: "Biblioteca", icon: Library },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  layoutId,
  className,
}: {
  href: string;
  label: string;
  icon: typeof Home;
  active: boolean;
  layoutId: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors",
        active ? "text-neon-cyan" : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {active && (
        <motion.span
          layoutId={layoutId}
          transition={springSnappy}
          className="absolute inset-0 rounded-full bg-neon-cyan/15"
        />
      )}
      <Icon className="relative size-4" />
      <span className="relative">{label}</span>
    </Link>
  );
}

export function HubShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const clerkConfigured = isClerkConfiguredClient();

  return (
    <div className="min-h-screen">
      <header
        style={{ viewTransitionName: "hub-header" }}
        className="sticky top-0 z-40 border-b border-neon-cyan/15 bg-void/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/hub" className="group flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: -8, scale: 1.06 }}
              transition={springSnappy}
              className="rounded-lg border border-neon-cyan/30 bg-neon-cyan/10 p-2"
            >
              <Gamepad2 className="size-5 text-neon-cyan" />
            </motion.div>
            <div>
              <p className="font-pixel text-[10px] text-neon-cyan text-glow-cyan">
                HUB-GAMES
              </p>
              <p className="text-xs text-muted-foreground">Seu save universal</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {links.map(({ href, label, icon: Icon }) => (
              <NavLink
                key={href}
                href={href}
                label={label}
                icon={Icon}
                active={pathname.startsWith(href)}
                layoutId="nav-pill-desktop"
              />
            ))}
          </nav>

          {clerkConfigured ? (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "border border-neon-cyan/40",
                },
              }}
            />
          ) : (
            <div className="flex size-8 items-center justify-center rounded-full border border-neon-gold/40 bg-neon-gold/10">
              <User className="size-4 text-neon-gold" />
            </div>
          )}
        </div>

        <nav className="flex gap-2 border-t border-neon-cyan/10 px-4 py-2 md:hidden">
          {links.map(({ href, label, icon: Icon }) => (
            <NavLink
              key={href}
              href={href}
              label={label}
              icon={Icon}
              active={pathname.startsWith(href)}
              layoutId="nav-pill-mobile"
              className="flex-1 justify-center text-xs"
            />
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
