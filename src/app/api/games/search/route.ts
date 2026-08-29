import { NextResponse } from "next/server";

import { searchGames, upsertGameFromRawg } from "@/lib/games/queries";
import { rawgToGamePayload, searchRawg } from "@/lib/rawg";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";

  try {
    const localResults = await searchGames(query, 24);

    let rawgResults: Awaited<ReturnType<typeof searchRawg>> = [];
    if (process.env.RAWG_API_KEY && query.trim()) {
      rawgResults = await searchRawg(query);

      for (const result of rawgResults.slice(0, 6)) {
        const payload = rawgToGamePayload(result);
        await upsertGameFromRawg(payload);
      }

      if (rawgResults.length > 0) {
        const merged = await searchGames(query, 24);
        return NextResponse.json({
          games: merged,
          source: "local+rawg",
        });
      }
    }

    return NextResponse.json({
      games: localResults,
      source: "local",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ games: [], error: "Search failed" }, { status: 500 });
  }
}
