import { HubShell } from "@/components/layout/hub-shell";
import { TrophyRoom } from "@/components/profile/trophy-room";
import { getAuthUserId } from "@/lib/auth";
import { getProfileCabinet } from "@/lib/games/queries";

export const metadata = {
  title: "Perfil | Hub-games",
  description: "Sua sala de troféus — platinas, zerados e o hall da vergonha.",
};

export default async function PerfilPage() {
  const userId = await getAuthUserId();
  if (!userId) return null;

  const cabinet = await getProfileCabinet(userId);

  return (
    <HubShell browse>
      <TrophyRoom
        cabinet={{
          profile: {
            ...cabinet.profile,
            updatedAt: cabinet.profile.updatedAt.toISOString(),
          },
          stats: cabinet.stats,
          genrePool: cabinet.genrePool,
          pinned: cabinet.pinned,
          showcase: cabinet.showcase,
          nowPlaying: cabinet.nowPlaying,
          backlog: cabinet.backlog,
          ranks: cabinet.ranks,
          candidates: cabinet.candidates,
        }}
      />
    </HubShell>
  );
}
