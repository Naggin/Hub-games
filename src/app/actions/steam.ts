"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { DEV_USER_ID, isDevBypassEnabled } from "@/lib/env";
import {
  applySteamImportPlan,
  getCatalogBySteamAppIds,
  getLibraryRowsForSteam,
  getPlayerProfile,
  updatePlayerProfile,
} from "@/lib/games/queries";
import { setSteamLink } from "@/lib/steam/links";
import {
  demoOwnedGames,
  fetchOwnedGames,
  isSyncCoolingDown,
  markSynced,
  parseSteamIdentity,
  planSteamImport,
  resolveSteamId,
  steamSyncMode,
} from "@/lib/steam/sync";

export type SteamLinkResult =
  | { ok: true; steamId: string; demo: boolean; message: string }
  | { ok: false; error: string; message: string };

export type SteamSyncItem = {
  title: string;
  hours: number;
  status: string;
  created: boolean;
};

export type SteamSyncResult =
  | {
      ok: true;
      demo: boolean;
      matched: number;
      created: number;
      updated: number;
      skippedUnknown: number;
      items: SteamSyncItem[];
      message: string;
    }
  | { ok: false; error: string; message: string };

async function requireUserId() {
  if (isDevBypassEnabled()) {
    return DEV_USER_ID;
  }

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

function refreshSteamSurfaces() {
  revalidatePath("/perfil");
  revalidatePath("/hub");
  revalidatePath("/library");
}

export async function linkSteamAction(raw: string): Promise<SteamLinkResult> {
  const userId = await requireUserId();
  const demo = steamSyncMode() === "demo";
  const identity = parseSteamIdentity(raw);

  if (identity.kind === "invalid") {
    return {
      ok: false,
      error: "invalid",
      message:
        "Cola a URL do perfil, o vanity ou o steamid64. Tipo steamcommunity.com/id/seuNick.",
    };
  }

  const resolved = await resolveSteamId(identity);
  if (!resolved.ok) {
    if (resolved.error === "needs_key") {
      return {
        ok: false,
        error: "needs_key",
        message:
          "Sem STEAM_API_KEY a gente não resolve vanity. Cola o steamid64 ou a URL /profiles/7656… — ou dispara o sync demo.",
      };
    }
    if (resolved.error === "vanity_not_found") {
      return {
        ok: false,
        error: "vanity_not_found",
        message:
          "Não achei esse nick na Steam. Confere o vanity, ou cola a URL /profiles/ com o número.",
      };
    }
    return {
      ok: false,
      error: resolved.error,
      message: "A Steam não respondeu. Tenta de novo daqui a pouco.",
    };
  }

  await updatePlayerProfile(userId, { steamId: resolved.steamId });
  refreshSteamSurfaces();

  return {
    ok: true,
    steamId: resolved.steamId,
    demo,
    message: demo
      ? "Steam anotada. Sem chave da API o sync ainda é demo — puxa horas do seed, não da tua conta real."
      : "Steam ligada. Um toque em Sincronizar e a gente puxa o que você jogou.",
  };
}

export async function unlinkSteamAction(): Promise<SteamLinkResult> {
  const userId = await requireUserId();
  await updatePlayerProfile(userId, { steamId: null });
  setSteamLink(userId, { steamId: null, lastSyncedAt: null });
  refreshSteamSurfaces();
  return {
    ok: true,
    steamId: "",
    demo: steamSyncMode() === "demo",
    message: "Steam desligada. Tua biblioteca do Hub ficou; só parou o cabo.",
  };
}

export async function syncSteamLibraryAction(): Promise<SteamSyncResult> {
  const userId = await requireUserId();
  const cooldown = isSyncCoolingDown(userId);
  if (cooldown > 0) {
    const seconds = Math.ceil(cooldown / 1000);
    return {
      ok: false,
      error: "rate_limited",
      message: `A Valve não gosta de spam. Espera ${seconds}s e sincroniza de novo.`,
    };
  }

  const demo = steamSyncMode() === "demo";
  const profile = await getPlayerProfile(userId);

  let owned = demoOwnedGames();

  if (!demo) {
    if (!profile.steamId) {
      return {
        ok: false,
        error: "not_linked",
        message:
          "Liga a Steam primeiro — cola a URL do perfil e toca em Conectar.",
      };
    }

    const fetched = await fetchOwnedGames(profile.steamId);
    if (!fetched.ok) {
      if (fetched.error === "private_profile") {
        return {
          ok: false,
          error: "private_profile",
          message:
            "Perfil de jogos privado. Na Steam: Privacidade → Detalhes dos jogos → Público. Sem isso a Valve não manda a lista.",
        };
      }
      if (fetched.error === "rate_limited") {
        return {
          ok: false,
          error: "rate_limited",
          message:
            "A Steam pediu pra diminuir o ritmo. Espera um minuto e tenta de novo.",
        };
      }
      return {
        ok: false,
        error: fetched.error,
        message: "Não rolou puxar a biblioteca na Steam. Tenta de novo.",
      };
    }
    owned = fetched.games;
  }

  const catalog = await getCatalogBySteamAppIds(owned.map((game) => game.appId));
  const existing = await getLibraryRowsForSteam(userId);
  const plan = planSteamImport(owned, catalog, existing);

  await applySteamImportPlan(userId, plan.items);
  markSynced(userId);
  setSteamLink(userId, {
    steamId: profile.steamId,
    lastSyncedAt: new Date(),
  });
  refreshSteamSurfaces();

  const created = plan.items.filter((item) => item.created).length;
  const updated = plan.items.length - created;

  return {
    ok: true,
    demo,
    matched: plan.items.length,
    created,
    updated,
    skippedUnknown: plan.skippedUnknown,
    items: plan.items.map((item) => ({
      title: item.title,
      hours: item.hoursPlayed,
      status: item.status,
      created: item.created,
    })),
    message: demo
      ? syncDemoCopy(plan.items.length, created, plan.skippedUnknown)
      : syncLiveCopy(plan.items.length, created, plan.skippedUnknown),
  };
}

function syncDemoCopy(matched: number, created: number, skipped: number) {
  const extra =
    skipped > 0
      ? ` ${skipped} título${skipped === 1 ? "" : "s"} fora do Hub a gente pulou.`
      : "";
  return `Sync demo: ${matched} jogo${matched === 1 ? "" : "s"} do seed, ${created} novo${created === 1 ? "" : "s"} na estante. Horas do Witcher e do Elden atualizadas. Platina e zerado ficaram quietos.${extra}`;
}

function syncLiveCopy(matched: number, created: number, skipped: number) {
  const extra =
    skipped > 0
      ? ` ${skipped} que a Steam tem e o Hub ainda não, a gente não despejou como card vazio.`
      : "";
  return `Puxamos ${matched} jogo${matched === 1 ? "" : "s"} que você jogou. ${created} entrada${created === 1 ? "" : "s"} nova${created === 1 ? "" : "s"}. Horas atualizadas; platina, zerado e drop não foram mexidos.${extra}`;
}
