export type MonetizationKind = "fair" | "cosmetics" | "gacha" | "pay_to_win";

export const MONETIZATION_LABELS: Record<MonetizationKind, string> = {
  fair: "Sem P2W",
  cosmetics: "Só cosmético",
  gacha: "Gacha",
  pay_to_win: "Pay to win",
};

export type CatalogOverlay = {
  pitch?: string;
  communityTake?: string;
  monetization?: MonetizationKind;
};

export type CatalogIdentity = {
  pitch: string;
  communityTake: string;
  monetization: MonetizationKind;
  monetizationLabel: string;
  posterUrl: string;
  backdropUrl: string;
};

type CatalogGameInput = {
  slug: string;
  title: string;
  synopsis: string;
  genres: string[];
  coverUrl: string;
  steamAppId?: number | null;
  communityScore?: number | null;
};

/**
 * Overlay by slug — pitches, community takes and monetization for known titles.
 * Games missing here still get inferred identity (genres + Steam art).
 */
export const CATALOG_BY_SLUG: Record<string, CatalogOverlay> = {
  "the-witcher-3-wild-hunt": {
    pitch: "Mundo aberto de escolhas pesadas, monstros e um bruxo cansado.",
    communityTake: "Ainda o RPG que a galera indica de olhos fechados.",
    monetization: "fair",
  },
  "elden-ring": {
    pitch: "Soulslike em mundo aberto — você, o mapa e a porrada justa.",
    communityTake: "Difícil, justo, viciante. Platina é crachá de honra.",
    monetization: "fair",
  },
  "red-dead-redemption-2": {
    pitch: "Faroeste cinematográfico. O mundo respira; o epílogo dói.",
    communityTake: "Lento no começo, inesquecível no fim. A casa ama.",
    monetization: "fair",
  },
  "god-of-war": {
    pitch: "Pai, filho e machado — mitologia nórdica sem enrolação.",
    communityTake: "Combate e história no mesmo nível. Consenso alto.",
    monetization: "fair",
  },
  hades: {
    pitch: "Roguelike de Olimpo: morre, sobe, flerta, tenta de novo.",
    communityTake: "Cada run ensina. A galera não larga o Zagreus.",
    monetization: "fair",
  },
  celeste: {
    pitch: "Plataforma de precisão sobre ansiedade e persistência.",
    communityTake: "Curto, honesto, emociona. Assist mode incluso.",
    monetization: "fair",
  },
  "hollow-knight": {
    pitch: "Metroidvania sombrio, preciso e cheio de segredo.",
    communityTake: "Difícil na medida. A platina é peregrinação.",
    monetization: "fair",
  },
  "baldurs-gate-3": {
    pitch: "RPG de mesa em tela cheia — cada diálogo é um save novo.",
    communityTake: "Obra-prima da década. A comunidade não cansa.",
    monetization: "fair",
  },
  "cyberpunk-2077": {
    pitch: "Night City em primeira pessoa: corpo, chrome e escolha.",
    communityTake: "Nasceu quebrado, hoje a galera defende. Vale o tempo.",
    monetization: "fair",
  },
  "disco-elysium": {
    pitch: "RPG de fala e fracasso. Sem combate, com ressaca existencial.",
    communityTake: "Quem termina recomenda pra vida. Texto de outro nível.",
    monetization: "fair",
  },
  "outer-wilds": {
    pitch: "Exploração espacial com um segredo que só você descobre.",
    communityTake: "Não spoila. Joga cego. A casa insiste nisso.",
    monetization: "fair",
  },
  "stardew-valley": {
    pitch: "Fazenda, vila e a paz que o trampo não te dá.",
    communityTake: "Confort food. Zero pressão, mil horas.",
    monetization: "fair",
  },
  minecraft: {
    pitch: "Blocos, sobrevivência e o save que nunca acaba.",
    communityTake: "O sandbox eterno. Sem loja no progresso.",
    monetization: "fair",
  },
  "persona-5-royal": {
    pitch: "Ladrões-fantasma, calendário escolar e estilo lá no teto.",
    communityTake: "Longo, estiloso, vicia. A Royal é a versão certa.",
    monetization: "fair",
  },
  "the-last-of-us-part-i": {
    pitch: "Viagem pós-apocalíptica de cuidado e violência.",
    communityTake: "História pesa mais que o tiro. Remake caprichado.",
    monetization: "fair",
  },
  "alan-wake-2": {
    pitch: "Survival horror literário — o escritor preso na própria trama.",
    communityTake: "Atmosfera absurda. A galera do terror aplaude.",
    monetization: "fair",
  },
  "black-myth-wukong": {
    pitch: "Soulslike de Wukong: bosses, mito e espetáculo.",
    communityTake: "Lindo e bruto. A comunidade ainda discute o fim.",
    monetization: "fair",
  },
  "expedition-33": {
    pitch: "RPG por turnos com estilo francês e combate no ritmo.",
    communityTake: "Surpresa da casa. Quem jogou não cala a boca.",
    monetization: "fair",
  },
  "helldivers-2": {
    pitch: "Coop caótico pra espalhar democracia… e friendly fire.",
    communityTake: "Porradaria justa. Warbond é skin, não poder.",
    monetization: "cosmetics",
  },
  "counter-strike-2": {
    pitch: "O 5v5 tático que nunca sai da máquina.",
    communityTake: "Skill fala. Skin não te faz headshot.",
    monetization: "cosmetics",
  },
  valorant: {
    pitch: "Tático com agente — um round, um clutch, um eco.",
    communityTake: "Ranked vicia. Loja de visual, combate honesto.",
    monetization: "cosmetics",
  },
  "apex-legends": {
    pitch: "Battle royale de movimentação e squad que respira junto.",
    communityTake: "O tiro é skill. Heirloom é ego, não aim.",
    monetization: "cosmetics",
  },
  "overwatch-2": {
    pitch: "Hero shooter 5v5 — compose, ult, discute o balance.",
    communityTake: "A loja irrita. O PvP em si não é pay to win.",
    monetization: "cosmetics",
  },
  "destiny-2": {
    pitch: "Looter shooter de raid, season e FOMO espacial.",
    communityTake: "A loja é visual; o tempo/season que cobra caro.",
    monetization: "cosmetics",
  },
  "diablo-iv": {
    pitch: "ARPG sombrio de season, loot e Sanctuary.",
    communityTake: "Battle pass de visual. O grind que come sua noite.",
    monetization: "cosmetics",
  },
  "path-of-exile": {
    pitch: "ARPG free com árvore infinita — e stash que dói no bolso.",
    communityTake: "Build de doido. A galera chama stash de P2W mesmo.",
    monetization: "pay_to_win",
  },
  "league-of-legends": {
    pitch: "MOBA eterno: lane, dragão e o chat que você muta.",
    communityTake: "Skin não ganka por você. O vício, sim.",
    monetization: "cosmetics",
  },
  "dota-2": {
    pitch: "MOBA hardcore da Valve. The International no horizonte.",
    communityTake: "Curva cruel, combate justo. Cosmético é teatro.",
    monetization: "cosmetics",
  },
  hearthstone: {
    pitch: "Cartas da Blizzard — arena, ranking e expansão no calendário.",
    communityTake: "Gacha de pacote. Sem whale, o ladder sobe devagar.",
    monetization: "gacha",
  },
  "genshin-impact": {
    pitch: "Open world elemental — explora de graça, puxa no banner.",
    communityTake: "Mapa lindo. O gacha quebra quem quer o C6.",
    monetization: "gacha",
  },
  "honkai-star-rail": {
    pitch: "RPG por turnos no expresso — banner, relíquia, hopium.",
    communityTake: "A história puxa. O gacha empurra. A casa avisa.",
    monetization: "gacha",
  },
  fortnite: {
    pitch: "Battle royale, creative e o evento que todo mundo assiste.",
    communityTake: "V-Bucks é skin e passe. A vitória ainda é aim.",
    monetization: "cosmetics",
  },
  "pubg-battlegrounds": {
    pitch: "O battle royale realista que ensinou o gênero a cair de avião.",
    communityTake: "Loja de visual. O spray que decide.",
    monetization: "cosmetics",
  },
  "marvel-rivals": {
    pitch: "Hero shooter da Marvel — time, ult e caos colorido.",
    communityTake: "Lançamento quente. Skin não te revive.",
    monetization: "cosmetics",
  },
  palworld: {
    pitch: "Pokémon com arma — captura, base e o meme que virou jogo.",
    communityTake: "Vicia o early. A casa ainda discute o late.",
    monetization: "fair",
  },
  "no-mans-sky": {
    pitch: "Universo procedural que a Hello Games não largou nunca.",
    communityTake: "Redenção lendária. Sem loja no caminho.",
    monetization: "fair",
  },
  "sea-of-thieves": {
    pitch: "Pirata coop: vela, grog e o PvP que aparece no horizonte.",
    communityTake: "Cosmético de navio. A lenda se faz no mar.",
    monetization: "cosmetics",
  },
  "deep-rock-galactic": {
    pitch: "Anão, picareta, bug e rock. Coop 4P que funciona.",
    communityTake: "Loot de visual. O anão que não te abandona.",
    monetization: "cosmetics",
  },
  "zelda-breath-of-the-wild": {
    pitch: "Hyrule aberto: sobe, desce, cozinha, improvisa.",
    communityTake: "Redefiniu mundo aberto. Sem microtransação.",
    monetization: "fair",
  },
  "zelda-tears-of-the-kingdom": {
    pitch: "BOTW com Ultrahand — o teto também é mapa.",
    communityTake: "Criatividade no talo. A platina é maratona.",
    monetization: "fair",
  },
  "super-mario-odyssey": {
    pitch: "Chapéu, captura e o 3D mais alegre da Nintendo.",
    communityTake: "Pura joia. Sem loja, sem enrolação.",
    monetization: "fair",
  },
  "portal-2": {
    pitch: "Portal gun, ciência duvidosa e a melhor co-op de puzzle.",
    communityTake: "Impecável. A galera ainda cita as falas.",
    monetization: "fair",
  },
  "half-life-2": {
    pitch: "Gordon, grav gun e a resistência contra a Combine.",
    communityTake: "Clássico que não envelheceu a proposta.",
    monetization: "fair",
  },
  "resident-evil-4-remake": {
    pitch: "Survival horror de ação — o remake que acertou a mão.",
    communityTake: "A comunidade chama de aula de remake.",
    monetization: "fair",
  },
  "doom-eternal": {
    pitch: "Rip and tear em FPS que é ballet de munição.",
    communityTake: "O combate mais viciado da casa. Justo e brutal.",
    monetization: "fair",
  },
  "hades-2": {
    pitch: "Roguelike da Supergiant — agora com Melinoë.",
    monetization: "fair",
  },
  returnal: {
    pitch: "Roguelike sci-fi de 3ª pessoa: morre, entende, volta.",
    communityTake: "Difícil, hipnótico. Sem loja no meio.",
    monetization: "fair",
  },
  "it-takes-two": {
    pitch: "Co-op obrigatório de casal em crise — e fases-brinquedo.",
    communityTake: "Joga com alguém. A platina é de dois.",
    monetization: "fair",
  },
  "street-fighter-6": {
    pitch: "Luta moderna: Drive Rush, ranked e World Tour.",
    communityTake: "Passe de visual. No round, o execution que manda.",
    monetization: "cosmetics",
  },
  "tekken-8": {
    pitch: "Tekken no heat — agressivo, cinematográfico, ranked.",
    communityTake: "Loja de skin. O combo você que apanha pra aprender.",
    monetization: "cosmetics",
  },
  "rocket-league": {
    pitch: "Futebol de carro. Um overtime e sua noite acabou.",
    communityTake: "Crate morreu. Agora é só paint job.",
    monetization: "cosmetics",
  },
  "forza-horizon-5": {
    pitch: "Festival no México — sol, comboio e o mapa aberto.",
    communityTake: "Carnê de carro. Ninguém paga pra ganhar corrida.",
    monetization: "cosmetics",
  },
  "animal-crossing-new-horizons": {
    pitch: "Ilha, Nook e a rotina fofa que vicia de leve.",
    communityTake: "Sem P2W. O DLC é extra, não poder.",
    monetization: "fair",
  },
  "pokemon-scarlet-violet": {
    pitch: "Open world Pokémon — bugs no lançamento, amizade no box.",
    communityTake: "Técnico falhou. Pay to win não é o problema.",
    monetization: "fair",
  },
  starfield: {
    pitch: "RPG espacial da Bethesda — aterrissa, loot, discute o vazio.",
    communityTake: "Divisivo. Sem loja; o pacing que polariza.",
    monetization: "fair",
  },
  "lies-of-p": {
    pitch: "Soulslike de Pinóquio sombrio — parry ou morre.",
    communityTake: "A casa respeita. Platina justa, boss memorável.",
    monetization: "fair",
  },
  "sekiro-shadows-die-twice": {
    pitch: "Shinobi, posture e o parry que vira religião.",
    communityTake: "Sem RPG de build. Skill pura. A galera ama ou dropa.",
    monetization: "fair",
  },
  "dark-souls-3": {
    pitch: "O canto do cisne das chamas — boss rush com alma.",
    communityTake: "Ainda o Souls mais jogado da galera.",
    monetization: "fair",
  },
  bloodborne: {
    pitch: "Caçada gótica. Insight alto, sanidade baixa.",
    communityTake: "Obra-prima. A platina é ritual.",
    monetization: "fair",
  },
  "ghost-of-tsushima": {
    pitch: "Samurai vs mongol — o vento mostra o caminho.",
    communityTake: "Lindo e satisfatório. Sem microtransação.",
    monetization: "fair",
  },
  "spider-man-remastered": {
    pitch: "Balanço, foto e combos no telhado de Nova York.",
    communityTake: "Power fantasy limpa. A casa recomenda de boa.",
    monetization: "fair",
  },
  "final-fantasy-vii-remake": {
    pitch: "Midgar em alta — combate híbrido e nostalgia com peso.",
    communityTake: "Divisivo no pacing, unânime no carinho.",
    monetization: "fair",
  },
  "mass-effect-legendary": {
    pitch: "A trilogia toda: squad, paragon/renegade e o fim eterno.",
    communityTake: "A jornada importa mais que o final. Ainda vale.",
    monetization: "fair",
  },
  "indiana-jones-great-circle": {
    pitch: "Aventura em 1ª pessoa — chicote, puzzle e set piece.",
    communityTake: "Surpresa boa. Sem loja no caminho do ídolo.",
    monetization: "fair",
  },
  "payday-2": {
    pitch: "Heist coop — máscara, drill e o alarme que sempre toca.",
    communityTake: "DLC demais. O poder pago aparece; a casa resmunga.",
    monetization: "pay_to_win",
  },
  "left-4-dead-2": {
    pitch: "Horde coop que ainda ensina a gritar 'spitter!'.",
    communityTake: "Clássico justo. Mods da comunidade, zero loja.",
    monetization: "fair",
  },
  balatro: {
    pitch: "Poker roguelike. Mais uma run. Sempre mais uma run.",
    communityTake: "Vício honesto. Sem microtransação.",
    monetization: "fair",
  },
  "slay-the-spire": {
    pitch: "Deckbuilder que definiu o gênero. Sobe o Spire de novo.",
    communityTake: "Profundo, justo, eterno.",
    monetization: "fair",
  },
  "vampire-survivors": {
    pitch: "Horda, build e o 'só mais um minuto' mais perigoso.",
    communityTake: "Baratinho e honesto. DLC é conteúdo, não poder pago no PvP.",
    monetization: "fair",
  },
  "dead-cells": {
    pitch: "Roguelite metroidvania — arma no chão, run na cabeça.",
    communityTake: "Difícil e justo. A DLC soma, não vende vantagem.",
    monetization: "fair",
  },
  undertale: {
    pitch: "RPG onde não matar também é build.",
    communityTake: "Não spoila. Joga. A casa concorda.",
    monetization: "fair",
  },
  "control": {
    pitch: "Bureau, telecinese e o brutalismo mais estiloso do hub.",
    communityTake: "Atmosfera única. A galera do Remedy recomenda o pacote.",
    monetization: "fair",
  },
  "horizon-zero-dawn": {
    pitch: "Máquinas, tribo e arco no mundo pós-colapso.",
    communityTake: "Open world caprichado. Sem loja no upgrade.",
    monetization: "fair",
  },
  "monster-hunter-world": {
    pitch: "Cace o bicho, come o bicho, veste o bicho. Em 4.",
    communityTake: "Coop da casa. Sem P2W na caçada.",
    monetization: "fair",
  },
  "armored-core-vi": {
    pitch: "Mecha FromSoft — build de peça, boss de arena.",
    communityTake: "Justo e estiloso. A galera de AC voltou.",
    monetization: "fair",
  },
  "kingdom-come-deliverance-2": {
    pitch: "RPG histórico: lama, fala e porrada medieval sem magia.",
    communityTake: "Imersivo pra quem topa o ritmo. Sem loja.",
    monetization: "fair",
  },
  enshrouded: {
    pitch: "Sobrevivência voxel com magia e base no vale.",
    communityTake: "Early que vicia. Sem P2W no shroud.",
    monetization: "fair",
  },
  "astro-bot": {
    pitch: "Plataforma 3D que é carta de amor ao PlayStation.",
    communityTake: "Nota altíssima. Puro jogo, zero loja.",
    monetization: "fair",
  },
  "ratchet-clank-rift-apart": {
    pitch: "Dimensão, arma maluca e produção AAA sorrindo.",
    communityTake: "Leve e caprichado. A platina é gostosa.",
    monetization: "fair",
  },
  "gran-turismo-7": {
    pitch: "Simcade da Polyphony — curva, paint e o café da manhã.",
    communityTake: "Grind de crédito irrita; não é who-pay-wins no time.",
    monetization: "cosmetics",
  },
  "f1-24": {
    pitch: "Temporada de F1 — piloto, setup e o safety car.",
    communityTake: "Passe de visual. No hotlap, o setup manda.",
    monetization: "cosmetics",
  },
};

const GACHA_GENRES = new Set(["gacha", "cartas"]);
const COSMETICS_GENRES = new Set([
  "free-to-play",
  "moba",
  "battle royale",
  "hero shooter",
  "mmo",
  "competitivo",
]);

const LIVE_SERVICE_SLUGS = new Set([
  "counter-strike-2",
  "valorant",
  "apex-legends",
  "overwatch-2",
  "destiny-2",
  "diablo-iv",
  "league-of-legends",
  "dota-2",
  "fortnite",
  "pubg-battlegrounds",
  "marvel-rivals",
  "rocket-league",
  "helldivers-2",
  "sea-of-thieves",
  "street-fighter-6",
  "tekken-8",
  "forza-horizon-5",
  "gran-turismo-7",
  "f1-24",
  "deep-rock-galactic",
]);

export function steamAsset(appId: number, file: "header" | "poster" | "hero") {
  const name =
    file === "poster"
      ? "library_600x900.jpg"
      : file === "hero"
        ? "library_hero.jpg"
        : "header.jpg";
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/${name}`;
}

export function inferMonetization(
  slug: string,
  genres: string[],
): MonetizationKind {
  const overlay = CATALOG_BY_SLUG[slug];
  if (overlay?.monetization) return overlay.monetization;

  const normalized = genres.map((genre) => genre.toLowerCase());
  if (normalized.some((genre) => GACHA_GENRES.has(genre))) return "gacha";
  if (LIVE_SERVICE_SLUGS.has(slug)) return "cosmetics";
  if (normalized.some((genre) => COSMETICS_GENRES.has(genre))) {
    return "cosmetics";
  }
  return "fair";
}

export function firstSentence(text: string) {
  const match = text.trim().match(/^[^.!?]+[.!?]?/);
  return (match?.[0] ?? text).trim();
}

export function inferCommunityTake(
  monetization: MonetizationKind,
  score: number | null | undefined,
) {
  if (monetization === "pay_to_win") {
    return score != null && score >= 8
      ? "Jogaço, mas a loja mexe no progresso. A galera avisa."
      : "Cuidado: pay to win. A comunidade não perdoa.";
  }
  if (monetization === "gacha") {
    return "Gacha pesado. Dá pra se divertir — o maxo cobra caro.";
  }
  if (monetization === "cosmetics") {
    return score != null && score >= 8
      ? "Combate honesto. A loja é skin — a galera respeita."
      : "Live service com loja de visual. Sem P2W no gameplay.";
  }
  if (score != null && score >= 9) {
    return "Consenso da casa: obra-prima. Entra sem medo.";
  }
  if (score != null && score >= 8) {
    return "A galera recomenda. Vale o tempo.";
  }
  if (score != null && score >= 6.5) {
    return "Misto. Tem fã de carteirinha e quem dropou.";
  }
  return "Ainda sem veredito forte da casa.";
}

export function getCatalogIdentity(game: CatalogGameInput): CatalogIdentity {
  const overlay = CATALOG_BY_SLUG[game.slug] ?? {};
  const monetization = inferMonetization(game.slug, game.genres);
  const appId = game.steamAppId && game.steamAppId > 0 ? game.steamAppId : null;

  return {
    pitch: overlay.pitch ?? firstSentence(game.synopsis),
    communityTake:
      overlay.communityTake ??
      inferCommunityTake(monetization, game.communityScore),
    monetization,
    monetizationLabel: MONETIZATION_LABELS[monetization],
    posterUrl: appId ? steamAsset(appId, "poster") : game.coverUrl,
    backdropUrl: appId ? steamAsset(appId, "hero") : game.coverUrl,
  };
}

export function enrichGame<T extends CatalogGameInput>(game: T) {
  return {
    ...game,
    ...getCatalogIdentity(game),
  };
}

export const withCatalogIdentity = enrichGame;

export type GameIdentity = ReturnType<typeof enrichGame<CatalogGameInput>>;

export type Monetization = MonetizationKind;

export const monetizationCopy: Record<
  MonetizationKind,
  { cabinet: string; label: string; className: string; blurb: string }
> = {
  fair: {
    cabinet: "SEM P2W",
    label: "Sem P2W",
    className: "border-emerald-400/60 bg-emerald-400/10 text-emerald-400",
    blurb: "Jogo honesto. Você paga o game, não o poder.",
  },
  cosmetics: {
    cabinet: "SÓ COSMÉTICO",
    label: "Só cosmético",
    className: "border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan",
    blurb: "A loja vende visual. No gameplay, skill que manda.",
  },
  gacha: {
    cabinet: "GACHA",
    label: "Gacha",
    className: "border-neon-magenta/60 bg-neon-magenta/10 text-neon-magenta",
    blurb: "Banner e pity. Dá pra jogar de graça — o maxo cobra.",
  },
  pay_to_win: {
    cabinet: "PAY TO WIN",
    label: "Pay to win",
    className: "border-destructive/70 bg-destructive/10 text-destructive",
    blurb: "Quem paga avança. A comunidade avisa antes de você meter a mão.",
  },
};

export function getCatalogIntel(game: CatalogGameInput) {
  return getCatalogIdentity(game);
}

export type BrowseGame = {
  id: string;
  slug: string;
  title: string;
  synopsis: string;
  coverUrl: string;
  releaseYear: number | null;
  genres: string[];
  communityScore: number | null;
  communityTake: string;
  monetization: MonetizationKind;
  pitch?: string;
  posterUrl?: string;
  backdropUrl?: string;
  personalScore?: number | null;
  status?: string | null;
  userEntry?: {
    status?: string | null;
    personalScore?: number | null;
  } | null;
};

export type CatalogRowDef = {
  id: string;
  cabinet: string;
  title: string;
  games: BrowseGame[];
};

const GENRE_ROWS = [
  "RPG",
  "Soulslike",
  "Ação",
  "Indie",
  "Horror",
  "FPS",
  "Aventura",
  "Estratégia",
] as const;

export function buildCatalogRows(
  games: BrowseGame[],
  playing: BrowseGame[],
): CatalogRowDef[] {
  const rows: CatalogRowDef[] = [];

  if (playing.length > 0) {
    rows.push({
      id: "continuar",
      cabinet: "CONTINUE?",
      title: "Continuar jogando",
      games: playing,
    });
  }

  const trending = [...games]
    .sort((a, b) => (b.communityScore ?? 0) - (a.communityScore ?? 0))
    .slice(0, 18);
  if (trending.length > 0) {
    rows.push({
      id: "trending",
      cabinet: "HIGH SCORE",
      title: "Em alta na comunidade",
      games: trending,
    });
  }

  const fair = games.filter((game) => game.monetization === "fair").slice(0, 18);
  if (fair.length > 0) {
    rows.push({
      id: "fair",
      cabinet: "FAIR PLAY",
      title: "Sem pay to win",
      games: fair,
    });
  }

  const cosmetics = games
    .filter((game) => game.monetization === "cosmetics")
    .slice(0, 18);
  if (cosmetics.length > 0) {
    rows.push({
      id: "cosmetics",
      cabinet: "SKINS ONLY",
      title: "Só cosmético",
      games: cosmetics,
    });
  }

  const gacha = games.filter((game) => game.monetization === "gacha");
  if (gacha.length > 0) {
    rows.push({
      id: "gacha",
      cabinet: "BANNER",
      title: "Gacha — a casa avisa",
      games: gacha,
    });
  }

  const payToWin = games.filter((game) => game.monetization === "pay_to_win");
  if (payToWin.length > 0) {
    rows.push({
      id: "p2w",
      cabinet: "CUIDADO",
      title: "Pay to win",
      games: payToWin,
    });
  }

  for (const genre of GENRE_ROWS) {
    const matches = games.filter((game) =>
      game.genres.some((item) => {
        if (genre === "Horror") {
          return item.toLowerCase().includes("horror");
        }
        return item === genre;
      }),
    );
    if (matches.length >= 4) {
      rows.push({
        id: `genre-${genre.toLowerCase()}`,
        cabinet: "GÊNERO",
        title: genre,
        games: matches.slice(0, 16),
      });
    }
  }

  return rows;
}
