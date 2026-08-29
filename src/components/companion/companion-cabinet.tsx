"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Bot, Send, Sparkles, Target, Trophy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const personas = [
  {
    id: "recommender" as const,
    label: "Recommender",
    icon: Sparkles,
    color: "text-neon-cyan",
  },
  {
    id: "coach" as const,
    label: "Coach",
    icon: Target,
    color: "text-emerald-400",
  },
  {
    id: "platinum" as const,
    label: "Platinum",
    icon: Trophy,
    color: "text-neon-gold",
  },
];

export function CompanionCabinet() {
  const [persona, setPersona] =
    useState<(typeof personas)[number]["id"]>("recommender");
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { persona },
    }),
  });

  const loading = status === "streaming" || status === "submitted";

  return (
    <Card className="border-neon-cyan/20 bg-card/60 backdrop-blur">
      <div className="flex items-center gap-3 border-b border-neon-cyan/10 p-4">
        <div className="rounded-lg bg-neon-cyan/10 p-2">
          <Bot className="size-5 text-neon-cyan" />
        </div>
        <div>
          <p className="font-pixel text-[10px] text-neon-cyan">COMPANHEIRO</p>
          <p className="text-sm text-muted-foreground">
            Seu squad IA no hub
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-4">
        {personas.map(({ id, label, icon: Icon, color }) => (
          <Button
            key={id}
            type="button"
            size="sm"
            variant={persona === id ? "default" : "outline"}
            onClick={() => setPersona(id)}
            className={cn(
              persona === id
                ? "bg-neon-cyan/20 text-neon-cyan"
                : "border-neon-cyan/20",
            )}
          >
            <Icon className={cn("mr-1 size-3", color)} />
            {label}
          </Button>
        ))}
      </div>

      <ScrollArea className="h-64 px-4">
        <div className="space-y-3 pb-4">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Pergunte o que jogar, peça dicas de platina ou atualize seu
              progresso.
            </p>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "rounded-lg px-3 py-2 text-sm",
                message.role === "user"
                  ? "ml-8 bg-neon-magenta/10 text-foreground"
                  : "mr-8 bg-neon-cyan/10 text-foreground",
              )}
            >
              {message.parts.map((part, index) =>
                part.type === "text" ? (
                  <span key={index}>{part.text}</span>
                ) : null,
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!input.trim()) return;
          sendMessage({ text: input });
          setInput("");
        }}
        className="flex gap-2 border-t border-neon-cyan/10 p-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="O que jogo hoje?"
          className="flex-1 rounded-lg border border-neon-cyan/20 bg-void/50 px-3 py-2 text-sm outline-none focus:border-neon-cyan/50"
        />
        <Button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-neon-cyan text-void hover:bg-neon-cyan/90"
        >
          <Send className="size-4" />
        </Button>
      </form>
    </Card>
  );
}
