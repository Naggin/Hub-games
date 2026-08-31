import { HubShell } from "@/components/layout/hub-shell";
import { ProfileCabinet } from "@/components/profile/profile-cabinet";
import { getAuthUserId } from "@/lib/auth";
import { getProfileCabinet } from "@/lib/games/queries";

export const metadata = {
  title: "Perfil | Hub-games",
  description:
    "Seu cabinet: platinas, zerados, piores, e a vibe que você escolhe.",
};

export default async function PerfilPage() {
  const userId = await getAuthUserId();
  if (!userId) return null;

  const data = await getProfileCabinet(userId);

  return (
    <HubShell>
      <ProfileCabinet
        profile={data.profile}
        stats={{
          platinum: data.stats.platinum,
          beaten: data.stats.beaten,
          playing: data.stats.playing,
          wishlist: data.stats.wishlist,
          dropped: data.stats.dropped,
          hours: data.stats.hours,
        }}
        genrePool={data.genrePool}
        pinned={data.pinned}
        showcase={data.showcase}
        ranks={data.ranks}
        candidates={data.candidates}
      />
    </HubShell>
  );
}
