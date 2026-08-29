import slugify from "slugify";

const RAWG_BASE = "https://api.rawg.io/api";

export type RawgSearchResult = {
  id: number;
  slug: string;
  name: string;
  released: string | null;
  background_image: string | null;
  metacritic: number | null;
  genres: { name: string }[];
  platforms: { platform: { name: string } }[];
  description_raw?: string;
};

export async function searchRawg(query: string): Promise<RawgSearchResult[]> {
  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey || !query.trim()) return [];

  const url = new URL(`${RAWG_BASE}/games`);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("search", query.trim());
  url.searchParams.set("page_size", "12");

  const response = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    console.error("RAWG search failed", response.status);
    return [];
  }

  const data = (await response.json()) as { results: RawgSearchResult[] };
  return data.results ?? [];
}

export function rawgToGamePayload(result: RawgSearchResult) {
  const slug = slugify(result.slug || result.name, { lower: true, strict: true });

  return {
    slug,
    title: result.name,
    synopsis:
      result.description_raw?.slice(0, 500) ||
      `${result.name} — descoberto via busca RAWG.`,
    coverUrl:
      result.background_image ||
      `https://placehold.co/460x215/05040a/00f5ff?text=${encodeURIComponent(result.name.slice(0, 16))}`,
    releaseYear: result.released
      ? new Date(result.released).getFullYear()
      : null,
    genres: result.genres.map((g) => g.name),
    platforms: result.platforms.map((p) => p.platform.name),
    rawgId: result.id,
    metacritic: result.metacritic,
  };
}

export async function fetchRawgGameDetails(rawgId: number) {
  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) return null;

  const url = new URL(`${RAWG_BASE}/games/${rawgId}`);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  if (!response.ok) return null;

  return (await response.json()) as RawgSearchResult;
}
