import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist_Mono, Outfit, Press_Start_2P } from "next/font/google";

import { DevModeBanner } from "@/components/layout/dev-mode-banner";
import { MotionProvider } from "@/components/motion/motion-provider";
import { isClerkConfigured } from "@/lib/env";

import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  weight: "400",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hub-games | O hub arcade do gamer",
  description:
    "O arcade do nerd gamer — vitrine de jogos, P2W na capa, notas da comunidade e companheiro IA.",
};

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`dark ${outfit.variable} ${pressStart.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <DevModeBanner />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!isClerkConfigured()) {
    return <AppShell>{children}</AppShell>;
  }

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#00f5ff",
          colorBackground: "#171428",
        },
      }}
    >
      <AppShell>{children}</AppShell>
    </ClerkProvider>
  );
}
