import { streamText, tool, convertToModelMessages, type UIMessage } from "ai";
import { z } from "zod";

import { getAuthUserId } from "@/lib/auth";
import type { LibraryStatus } from "@/lib/db/schema";
import {
  getPlayingGamesWithDetails,
  getUserLibrary,
  getUserStats,
  searchGames,
  upsertLibraryEntry,
} from "@/lib/games/queries";
import { isMockDbEnabled } from "@/lib/games/mock-data";

const personaPrompts = {
  recommender: `Você é o Recommender do Hub-games. Sugira jogos com base no backlog, gêneros que o player zera e notas da comunidade. Seja direto e empolgante.`,
  coach: `Você é o Progress Coach. Lembre o que está em "jogando", sugira marcar zerou/platina. Ritual de 1 toque — sem burocracia.`,
  platinum: `Você é o Platinum Hunter. Fale de platina só para jogos na biblioteca do player. Dicas honestas, sem spoilers.`,
};

export async function handleCompanionChat(
  messages: UIMessage[],
  persona: keyof typeof personaPrompts = "recommender",
) {
  const userId = await getAuthUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (isMockDbEnabled()) {
    const { createUIMessageStreamResponse } = await import("ai");
    const lastMessage = messages.at(-1);
    const userText =
      lastMessage?.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join("") || "";

    const reply =
      persona === "platinum"
        ? `Caçador de platina na linha. Vi "${userText}". No dev mode o Gateway tá off — mas seu mock já tem Elden Ring no pódio. A ficha espera o ritual.`
        : persona === "coach"
          ? `Coach: Witcher 3 ainda tá em JOGANDO. Quer cravar Zerei hoje? Um toque no ritual e o save atualiza.`
          : `Indica: continua o Witcher ou mete Hades no cabinet. Sem P2W, loop honesto, a casa recomenda.`;

    return createUIMessageStreamResponse({
      stream: new ReadableStream({
        start(controller) {
          controller.enqueue({ type: "text-start", id: "mock-1" });
          controller.enqueue({ type: "text-delta", id: "mock-1", delta: reply });
          controller.enqueue({ type: "text-end", id: "mock-1" });
          controller.close();
        },
      }),
    });
  }

  const stats = await getUserStats(userId);
  const playing = await getPlayingGamesWithDetails(userId);

  const system = `${personaPrompts[persona]}

Tom: gamer BR, acolhedor, sem spoilers sem permissão.
Stats do player: ${stats.playing} jogando, ${stats.beaten} zerados, ${stats.platinum} platinas, ${stats.wishlist} na wishlist, ${stats.hours}h totais.
Jogando agora: ${playing.map((p) => p.game.title).join(", ") || "nenhum"}.

Use tools para buscar jogos e propor mudanças de status.`;

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system,
    messages: await convertToModelMessages(messages),
    tools: {
      searchGames: tool({
        description: "Busca jogos no catálogo do Hub-games",
        inputSchema: z.object({
          query: z.string(),
        }),
        execute: async ({ query }) => {
          const results = await searchGames(query, 6);
          return results.map((g) => ({
            slug: g.slug,
            title: g.title,
            year: g.releaseYear,
            genres: g.genres,
          }));
        },
      }),
      getLibrary: tool({
        description: "Lista a biblioteca pessoal do player",
        inputSchema: z.object({
          limit: z.number().optional(),
        }),
        execute: async ({ limit = 10 }) => {
          const library = await getUserLibrary(userId);
          return library.slice(0, limit).map((row) => ({
            title: row.game.title,
            slug: row.game.slug,
            status: row.entry.status,
            score: row.entry.personalScore,
          }));
        },
      }),
      proposeStatusChange: tool({
        description:
          "Propõe mudança de status para um jogo (wishlist/playing/beaten/platinum/dropped)",
        inputSchema: z.object({
          gameSlug: z.string(),
          status: z.enum([
            "wishlist",
            "playing",
            "beaten",
            "platinum",
            "dropped",
          ]),
        }),
        execute: async ({ gameSlug, status }) => {
          const { getGameBySlug } = await import("@/lib/games/queries");
          const game = await getGameBySlug(gameSlug);
          if (!game) return { ok: false, message: "Jogo não encontrado" };

          await upsertLibraryEntry(userId, game.id, {
            status: status as LibraryStatus,
          });

          return {
            ok: true,
            message: `Status de ${game.title} atualizado para ${status}.`,
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
