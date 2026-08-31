export const UNKNOWN_FICHA = "ainda sem ficha";

export type PtBrSupport = "full" | "text" | "none";

export type StoreLink = {
  name: string;
  href: string;
};

export type DlcEntry = {
  name: string;
  note?: string;
};

export type DossierOverlay = {
  /** Omit = ainda sem ficha. "console-only" = não roda no PC. */
  pc?: { min: string; rec: string; note?: string } | "console-only";
  languages?: {
    text: string[];
    audio: string[];
    ptBr: PtBrSupport;
  };
  /** Omit = ainda sem ficha. [] = sem DLC pago no gabinete. */
  dlcs?: DlcEntry[];
  /** Extra stores beyond auto Steam. */
  stores?: StoreLink[];
};

export type GameDossier = {
  platforms: string[];
  pc: DossierOverlay["pc"] | undefined;
  languages: DossierOverlay["languages"] | undefined;
  dlcs: DlcEntry[] | undefined;
  stores: StoreLink[];
};

const NINTENDO: StoreLink = {
  name: "Nintendo eShop",
  href: "https://www.nintendo.com/us/store/",
};

const PLAYSTATION: StoreLink = {
  name: "PlayStation Store",
  href: "https://store.playstation.com/",
};

const XBOX: StoreLink = {
  name: "Xbox Store",
  href: "https://www.xbox.com/games/store",
};

const PT = "Português (BR)";
const EN = "Inglês";
const JP = "Japonês";
const ES = "Espanhol";
const FR = "Francês";
const DE = "Alemão";
const KO = "Coreano";
const ZH = "Chinês";
const IT = "Italiano";
const RU = "Russo";
const PL = "Polonês";
const NL = "Holandês";

const FULL_WEST = [PT, EN, ES, FR, DE, IT];
const TEXT_WEST = [PT, EN, ES, FR, DE];

export const DOSSIER_BY_SLUG: Record<string, DossierOverlay> = {
  "the-witcher-3-wild-hunt": {
    pc: {
      min: "Win 7/10 64-bit · CPU 3.3 GHz · 6 GB RAM · GTX 660 2 GB · 50 GB",
      rec: "Win 10 · i5 3.2 GHz / FX-8350 · 8 GB · GTX 770 / R9 290 · 50 GB SSD",
      note: "Next-gen / Complete Edition pede mais VRAM.",
    },
    languages: { text: FULL_WEST, audio: [PT, EN, RU, JP], ptBr: "full" },
    dlcs: [
      { name: "Hearts of Stone", note: "Expansão média, contrato novo." },
      { name: "Blood and Wine", note: "Toussaint. A casa trata como obrigatória." },
    ],
  },
  "elden-ring": {
    pc: {
      min: "Win 10 · i5-8400 / R5 1500X · 12 GB · GTX 1060 3 GB / RX 580 4 GB · 60 GB",
      rec: "Win 10/11 · i7-8700K / R5 3600X · 16 GB · GTX 1070 8 GB / Vega 56 · SSD",
    },
    languages: { text: FULL_WEST.concat(KO, ZH, JP, PL), audio: [EN, JP], ptBr: "text" },
    dlcs: [{ name: "Shadow of the Erdtree", note: "O DLC. A casa trata como segundo jogo." }],
  },
  "red-dead-redemption-2": {
    pc: {
      min: "Win 10 · i7-3770K / FX-9590 · 8 GB · GTX 770 2 GB / R9 280 · 150 GB",
      rec: "Win 10 · i7-4770K / R5 1500X · 12 GB · GTX 1060 6 GB / RX 480 4 GB · SSD",
    },
    languages: { text: FULL_WEST, audio: [PT, EN, ES, FR, DE, IT], ptBr: "full" },
    dlcs: [],
  },
  "god-of-war": {
    pc: {
      min: "Win 10 · i5-2500K / R3 1200 · 8 GB · GTX 960 / R9 380 · 70 GB",
      rec: "Win 10 · i5-6600K / R5 2400G · 8 GB · GTX 1060 / RX 570 · SSD",
    },
    languages: { text: FULL_WEST, audio: [PT, EN, ES, FR, DE, IT, RU], ptBr: "full" },
    dlcs: [],
  },
  hades: {
    pc: {
      min: "Win 7 · dual-core 2.4 GHz · 4 GB · Intel HD 5000 / GT 640 · 10 GB",
      rec: "Win 10 · i5 / R5 · 8 GB · GTX 960 / RX 560 · SSD",
    },
    languages: { text: FULL_WEST.concat(KO, ZH, JP, RU), audio: [EN], ptBr: "text" },
    dlcs: [],
  },
  "hades-2": {
    pc: {
      min: "Win 10 · dual-core 3 GHz · 8 GB · GTX 960 / RX 560 · 10 GB",
      rec: "Win 10/11 · i5 / R5 · 16 GB · GTX 1060 / RX 580 · SSD",
    },
    languages: { text: FULL_WEST.concat(KO, ZH, JP), audio: [EN], ptBr: "text" },
    dlcs: [],
  },
  celeste: {
    pc: {
      min: "Win 7 · dual-core · 2 GB · Intel HD 4000 · 1 GB",
      rec: "Win 10 · dual-core · 4 GB · qualquer GPU de 2014+ · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, RU), audio: [], ptBr: "text" },
    dlcs: [],
  },
  "hollow-knight": {
    pc: {
      min: "Win 7 · dual-core 2 GHz · 4 GB · Intel HD 4000 · 9 GB",
      rec: "Win 10 · i5 · 8 GB · GTX 750 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, RU), audio: [], ptBr: "text" },
    dlcs: [],
  },
  "baldurs-gate-3": {
    pc: {
      min: "Win 10 · i5-4690 / R5 1400 · 8 GB · GTX 970 / RX 480 · 150 GB SSD",
      rec: "Win 10/11 · i7-8700K / R5 3600 · 16 GB · RTX 2060 Super / RX 5700 XT · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, ZH, KO, JP, "Ucraniano"), audio: [EN], ptBr: "text" },
    dlcs: [],
  },
  "cyberpunk-2077": {
    pc: {
      min: "Win 10 · i7-6700 / R5 1600 · 12 GB · GTX 1060 6 GB / RX 580 · 70 GB SSD",
      rec: "Win 10/11 · i7-12700 / R7 7800X3D · 16 GB · RTX 2060 Super / RX 6700 XT · SSD",
      note: "RT/Path tracing é outro patamar de GPU.",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO, ZH), audio: [PT, EN, JP, RU, PL], ptBr: "full" },
    dlcs: [{ name: "Phantom Liberty", note: "Expansão. A casa trata como o jogo maduro." }],
  },
  "disco-elysium": {
    pc: {
      min: "Win 7 · dual-core 2.2 GHz · 4 GB · Intel HD 4000 · 20 GB",
      rec: "Win 10 · i5 · 8 GB · GTX 960 · SSD",
    },
    languages: { text: FULL_WEST.concat(RU, ZH, KO, JP, PL), audio: [EN], ptBr: "text" },
    dlcs: [{ name: "The Final Cut", note: "A versão certa — vozes e conteúdo extra." }],
  },
  "outer-wilds": {
    pc: {
      min: "Win 10 · dual-core 2.8 GHz · 4 GB · GTX 560 / HD 6870 · 8 GB",
      rec: "Win 10 · i5 · 8 GB · GTX 970 / RX 480 · SSD",
    },
    languages: { text: FULL_WEST.concat(RU, JP, KO, ZH, PL), audio: [EN], ptBr: "text" },
    dlcs: [{ name: "Echoes of the Eye", note: "DLC. A casa manda jogar cego também." }],
  },
  "stardew-valley": {
    pc: {
      min: "Win 7 · 2 GHz · 2 GB · shader model 3.0 · 500 MB",
      rec: "Win 10 · dual-core · 4 GB · qualquer GPU · SSD",
    },
    languages: { text: FULL_WEST.concat(RU, JP, KO, ZH, "Turco"), audio: [], ptBr: "text" },
    dlcs: [],
  },
  minecraft: {
    pc: {
      min: "Win 10 · i3 / dual-core · 4 GB · Intel HD 4000 · 4 GB",
      rec: "Win 11 · i5 / R5 · 8 GB · GTX 1060 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, RU, PL), audio: [], ptBr: "text" },
    dlcs: [],
    stores: [{ name: "Minecraft.net", href: "https://www.minecraft.net/" }],
  },
  "persona-5-royal": {
    pc: {
      min: "Win 10 · i5-2300 / FX-4350 · 8 GB · GTX 650 / HD 6870 · 41 GB",
      rec: "Win 10 · i7-4790 / R3 1200 · 8 GB · GTX 760 / RX 570 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH), audio: [JP, EN], ptBr: "text" },
    dlcs: [],
  },
  "the-last-of-us-part-i": {
    pc: {
      min: "Win 10 · i7-4770K / R5 1500X · 16 GB · GTX 970 / RX 470 · 100 GB SSD",
      rec: "Win 10 · i7-9700K / R5 3600X · 16 GB · RTX 2070 Super / RX 5700 XT · SSD",
    },
    languages: { text: FULL_WEST, audio: [PT, EN, ES, FR, DE, IT], ptBr: "full" },
    dlcs: [{ name: "Left Behind", note: "Incluído no remake." }],
  },
  "alan-wake-2": {
    pc: {
      min: "Win 10/11 · i5-7600K / R5 1600 · 16 GB · GTX 1070 / RX 5600 XT · 90 GB SSD",
      rec: "Win 10/11 · i7-8700K / R5 3600 · 16 GB · RTX 3060 / RX 6600 XT · SSD",
      note: "RT e path tracing pedem GPU de outra prateleira.",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP), audio: [EN], ptBr: "text" },
    dlcs: [
      { name: "Night Springs" },
      { name: "The Lake House" },
    ],
  },
  "black-myth-wukong": {
    pc: {
      min: "Win 10 · i5-8400 / R5 1600 · 16 GB · GTX 1060 6 GB / RX 580 · 130 GB SSD",
      rec: "Win 10/11 · i7-9700 / R5 5500 · 16 GB · RTX 2060 / RX 5700 XT · SSD",
    },
    languages: { text: FULL_WEST.concat(ZH, JP, KO), audio: [ZH, EN], ptBr: "text" },
    dlcs: [],
  },
  "expedition-33": {
    pc: {
      min: "Win 10 · i7-8700K / R5 3600 · 16 GB · GTX 1070 / RX 5600 XT · 45 GB SSD",
      rec: "Win 10/11 · i7-12700K / R7 5800X3D · 16 GB · RTX 3070 / RX 6800 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, PL), audio: [EN, FR], ptBr: "text" },
    dlcs: [],
    stores: [{ name: "Steam", href: "https://store.steampowered.com/app/1903340/" }],
  },
  "helldivers-2": {
    pc: {
      min: "Win 10 · i7-4790K / R5 1500X · 8 GB · GTX 1050 Ti / RX 470 · 100 GB",
      rec: "Win 10 · i7-9700K / R5 3600 · 16 GB · RTX 2060 / RX 6600 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO, ZH), audio: [EN], ptBr: "text" },
    dlcs: [{ name: "Warbonds", note: "Passe de visual. A casa selou cosmética." }],
  },
  "counter-strike-2": {
    pc: {
      min: "Win 10 · 4 threads · 8 GB · GTX 1050 / Vega 8 · 85 GB SSD",
      rec: "Win 10/11 · i5 / R5 · 16 GB · GTX 1660 / RX 5600 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, ZH, KO, JP, "Turco"), audio: [EN], ptBr: "text" },
    dlcs: [],
  },
  valorant: {
    pc: {
      min: "Win 10 · i3-4150 / A8-6600K · 4 GB · Intel HD 3000 · 10 GB",
      rec: "Win 10/11 · i5-4460 / R5 1400 · 8 GB · GTX 1050 Ti · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, RU, "Turco"), audio: [EN], ptBr: "text" },
    dlcs: [{ name: "Battle Pass", note: "Skin. O round não se compra." }],
    stores: [{ name: "Riot Client", href: "https://playvalorant.com/" }],
  },
  "apex-legends": {
    pc: {
      min: "Win 10 · i3-6100 / FX-4350 · 6 GB · GTX 660 / HD 7730 · 56 GB",
      rec: "Win 10 · i5-3570K / R5 2600 · 8 GB · GTX 970 / RX 580 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, RU, PL), audio: [EN], ptBr: "text" },
    dlcs: [{ name: "Heirloom / passe", note: "Cosmético. A vitória ainda é rotation." }],
  },
  "overwatch-2": {
    pc: {
      min: "Win 10 · i3 / dual-core · 6 GB · GTX 600 / HD 7000 · 50 GB",
      rec: "Win 10 · i5 / R5 · 8 GB · GTX 1060 / RX 580 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, RU, PL), audio: [PT, EN, ES, FR, DE, JP], ptBr: "full" },
    dlcs: [{ name: "Passe de temporada", note: "Skin. O PvP não é P2W." }],
    stores: [{ name: "Battle.net", href: "https://overwatch.blizzard.com/" }],
  },
  "destiny-2": {
    pc: {
      min: "Win 10 · i5-7600 / R5 1600 · 8 GB · GTX 1050 Ti / RX 560 · 105 GB SSD",
      rec: "Win 10 · i7-9700K / R7 3700X · 16 GB · RTX 2060 / RX 5700 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO, ZH), audio: [EN], ptBr: "text" },
    dlcs: [{ name: "Expansões / seasons", note: "Conteúdo no calendário. Loja de visual." }],
  },
  "diablo-iv": {
    pc: {
      min: "Win 10 · i5-2500K / FX-8350 · 8 GB · GTX 660 / HD 7950 · 90 GB",
      rec: "Win 10 · i5-4670K / R5 1600 · 16 GB · GTX 970 / RX 470 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO, ZH), audio: [PT, EN, ES, FR, DE, IT], ptBr: "full" },
    dlcs: [{ name: "Vessel of Hatred + seasons", note: "Expansão e passe de visual." }],
  },
  "path-of-exile": {
    pc: {
      min: "Win 7 · dual-core 2.6 GHz · 4 GB · Intel HD 4000 · 40 GB",
      rec: "Win 10 · i5 / R5 · 8 GB · GTX 970 / RX 580 · SSD",
    },
    languages: { text: [PT, EN, FR, DE, ES, RU, JP, KO, ZH], audio: [EN], ptBr: "text" },
    dlcs: [{ name: "Stash tabs", note: "A casa selou P2W de QoL. League é grátis." }],
  },
  "league-of-legends": {
    pc: {
      min: "Win 10 · i3-530 · 2 GB · Intel HD 3000 · 16 GB",
      rec: "Win 10 · i5-3300 · 4 GB · GeForce 560 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, RU, PL), audio: [PT, EN, ES, FR, DE], ptBr: "full" },
    dlcs: [{ name: "Skins / passe", note: "Visual. O gank não se compra." }],
    stores: [{ name: "Riot Client", href: "https://www.leagueoflegends.com/" }],
  },
  "dota-2": {
    pc: {
      min: "Win 10 · dual-core 2.8 GHz · 4 GB · DirectX 11 · 60 GB",
      rec: "Win 10 · i5 / R5 · 8 GB · GTX 960 · SSD",
    },
    languages: { text: FULL_WEST.concat(RU, ZH, KO, JP, PL), audio: [EN], ptBr: "text" },
    dlcs: [{ name: "Tesouros / Battle Pass", note: "Cosmético. The International no horizonte." }],
  },
  hearthstone: {
    pc: {
      min: "Win 10 · dual-core · 4 GB · DirectX 10 · 10 GB",
      rec: "Win 10 · i5 · 8 GB · GTX 750 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, RU, PL), audio: [PT, EN, ES, FR, DE], ptBr: "full" },
    dlcs: [{ name: "Expansões / pacotes", note: "Gacha de carta. A casa selou." }],
    stores: [{ name: "Battle.net", href: "https://hearthstone.blizzard.com/" }],
  },
  "genshin-impact": {
    pc: {
      min: "Win 10 · i5 · 8 GB · GTX 760 / HD 7870 · 30 GB+",
      rec: "Win 10/11 · i7 / R5 · 16 GB · GTX 1060 / RX 580 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, RU), audio: [PT, EN, JP, KO, ZH], ptBr: "full" },
    dlcs: [{ name: "Banners", note: "Gacha. O mapa é de graça; o C6 cobra." }],
    stores: [
      { name: "HoYoverse", href: "https://genshin.hoyoverse.com/" },
      { name: "PlayStation Store", href: PLAYSTATION.href },
    ],
  },
  "honkai-star-rail": {
    pc: {
      min: "Win 10 · i5 · 8 GB · GTX 760 · 20 GB+",
      rec: "Win 10/11 · i7 / R5 · 16 GB · GTX 1060 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, RU), audio: [PT, EN, JP, KO, ZH], ptBr: "full" },
    dlcs: [{ name: "Banners", note: "Gacha. A história puxa; o maxo empurra." }],
    stores: [{ name: "HoYoverse", href: "https://hsr.hoyoverse.com/" }],
  },
  fortnite: {
    pc: {
      min: "Win 10 · i3-3225 · 4 GB · Intel HD 4000 · 30 GB+",
      rec: "Win 10/11 · i5 / R5 · 8 GB · GTX 960 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, RU, PL), audio: [PT, EN, ES], ptBr: "full" },
    dlcs: [{ name: "V-Bucks / passe", note: "Skin e passe. A vitória ainda é aim." }],
    stores: [
      { name: "Epic Games", href: "https://store.epicgames.com/en-US/p/fortnite" },
      { name: "Fortnite.com", href: "https://www.fortnite.com/" },
    ],
  },
  "pubg-battlegrounds": {
    pc: {
      min: "Win 10 · i5-4430 · 8 GB · GTX 960 2 GB · 30 GB+",
      rec: "Win 10 · i5-6600K / R5 1600 · 16 GB · GTX 1060 3 GB · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, RU, PL), audio: [EN], ptBr: "text" },
    dlcs: [],
  },
  "marvel-rivals": {
    pc: {
      min: "Win 10 · i5-6600 / R5 1400 · 8 GB · GTX 1060 / RX 580 · 50 GB SSD",
      rec: "Win 10/11 · i7-8700K / R5 3600 · 16 GB · RTX 2060 / RX 5700 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, RU), audio: [EN], ptBr: "text" },
    dlcs: [{ name: "Passe / skins", note: "Visual. Skin não revive." }],
  },
  palworld: {
    pc: {
      min: "Win 10 · i5-7500 / R5 1500X · 16 GB · GTX 1060 / RX 580 · 40 GB",
      rec: "Win 10/11 · i5-12400 / R5 5600 · 16 GB · RTX 2070 / RX 6700 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH), audio: [JP, EN], ptBr: "text" },
    dlcs: [],
  },
  "no-mans-sky": {
    pc: {
      min: "Win 10 · i3 · 8 GB · GTX 480 / HD 7870 · 15 GB",
      rec: "Win 10 · i5 / R5 · 16 GB · GTX 1060 / RX 580 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO, ZH), audio: [EN], ptBr: "text" },
    dlcs: [],
  },
  "sea-of-thieves": {
    pc: {
      min: "Win 10 · i5-4690 / FX-6300 · 8 GB · GTX 770 / R9 280X · 50 GB",
      rec: "Win 10 · i7-4790K / R5 1600 · 16 GB · GTX 1070 / RX 580 · SSD",
    },
    languages: { text: FULL_WEST, audio: [EN], ptBr: "text" },
    dlcs: [{ name: "Passe / cosmética de navio", note: "A lenda se faz no mar." }],
  },
  "deep-rock-galactic": {
    pc: {
      min: "Win 10 · i3-3210 · 8 GB · GTX 660 / HD 7870 · 10 GB",
      rec: "Win 10 · i5-3570 · 8 GB · GTX 970 / R9 290 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO, ZH), audio: [EN], ptBr: "text" },
    dlcs: [{ name: "Cosmetic DLC / seasons", note: "Visual. Rock and stone." }],
  },
  "zelda-breath-of-the-wild": {
    pc: "console-only",
    languages: { text: [PT, EN, ES, FR, DE, IT, JP, KO, ZH], audio: [JP, EN], ptBr: "text" },
    dlcs: [{ name: "The Master Trials + The Champion's Ballad", note: "Pack de expansão." }],
    stores: [NINTENDO],
  },
  "zelda-tears-of-the-kingdom": {
    pc: "console-only",
    languages: { text: [PT, EN, ES, FR, DE, IT, JP, KO, ZH], audio: [JP, EN], ptBr: "text" },
    dlcs: [],
    stores: [NINTENDO],
  },
  "super-mario-odyssey": {
    pc: "console-only",
    languages: { text: [PT, EN, ES, FR, DE, IT, JP, KO, ZH], audio: [EN, JP], ptBr: "text" },
    dlcs: [],
    stores: [NINTENDO],
  },
  "portal-2": {
    pc: {
      min: "Win 7 · 1.7 GHz · 2 GB · DirectX 9 · 8 GB",
      rec: "Win 10 · dual-core · 4 GB · DirectX 9 GPU · SSD",
    },
    languages: { text: FULL_WEST.concat(RU, PL, KO, ZH), audio: [EN], ptBr: "text" },
    dlcs: [],
  },
  "half-life-2": {
    pc: {
      min: "Win 7 · 1.7 GHz · 1 GB · DirectX 9 · 4 GB",
      rec: "Win 10 · dual-core · 4 GB · qualquer GPU · SSD",
    },
    languages: { text: [PT, EN, ES, FR, DE, IT, RU], audio: [EN], ptBr: "text" },
    dlcs: [
      { name: "Episode One" },
      { name: "Episode Two" },
    ],
  },
  "resident-evil-4-remake": {
    pc: {
      min: "Win 10 · i5-7500 / R3 1200 · 8 GB · GTX 1050 Ti / RX 560 · 60 GB SSD",
      rec: "Win 10 · i7-8700 / R5 3600 · 16 GB · GTX 1070 / RX 5700 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH), audio: [PT, EN, ES, FR, DE, IT, JP], ptBr: "full" },
    dlcs: [{ name: "Separate Ways", note: "Campanha da Ada. A casa recomenda." }],
  },
  "doom-eternal": {
    pc: {
      min: "Win 10 · i5-2580K / FX-8350 · 8 GB · GTX 1050 Ti / RX 470 · 50 GB",
      rec: "Win 10 · i7-6700K / R5 1600 · 8 GB · GTX 1060 6 GB / RX 480 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP), audio: [EN], ptBr: "text" },
    dlcs: [
      { name: "The Ancient Gods — Part One" },
      { name: "The Ancient Gods — Part Two" },
    ],
  },
  returnal: {
    pc: {
      min: "Win 10 · i5-6400 / R5 1500X · 16 GB · GTX 1060 6 GB / RX 580 · 60 GB SSD",
      rec: "Win 10 · i5-8400 / R5 3600 · 16 GB · RTX 2060 Super / RX 6700 XT · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO), audio: [EN], ptBr: "text" },
    dlcs: [{ name: "Tower of Sisyphus", note: "Modo extra. Incluído nas versões atuais." }],
  },
  "it-takes-two": {
    pc: {
      min: "Win 8.1 · i5-2400 / FX-4100 · 8 GB · GTX 660 / HD 7870 · 50 GB",
      rec: "Win 10 · i5-3570K / R5 1600 · 16 GB · GTX 980 / RX 480 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO, ZH), audio: [PT, EN, ES, FR, DE], ptBr: "full" },
    dlcs: [],
  },
  "street-fighter-6": {
    pc: {
      min: "Win 10 · i5-7500 / R5 1400 · 8 GB · GTX 1060 6 GB / RX 480 · 60 GB",
      rec: "Win 10 · i7-8700 / R5 3600 · 16 GB · RTX 2070 / RX 5700 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH), audio: [JP, EN], ptBr: "text" },
    dlcs: [{ name: "Year passes / lutadores", note: "Roster extra e visual. No round, o execution." }],
  },
  "tekken-8": {
    pc: {
      min: "Win 10 · i5-6600K / R5 1600 · 8 GB · GTX 1050 Ti / RX 560 · 100 GB SSD",
      rec: "Win 10 · i7-7700K / R5 3600 · 16 GB · RTX 2060 / RX 5700 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH), audio: [JP, EN], ptBr: "text" },
    dlcs: [{ name: "Season pass", note: "Lutador e skin. O combo você treina." }],
  },
  "rocket-league": {
    pc: {
      min: "Win 10 · dual-core 2.5 GHz · 4 GB · DirectX 11 · 20 GB",
      rec: "Win 10 · i5 · 8 GB · GTX 960 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO, ZH), audio: [EN], ptBr: "text" },
    dlcs: [{ name: "Rocket Pass", note: "Paint job. Crate morreu." }],
  },
  "forza-horizon-5": {
    pc: {
      min: "Win 10 · i5-4460 / FX-4350 · 8 GB · GTX 970 / R9 290X · 110 GB",
      rec: "Win 10 · i5-8400 / R5 1500X · 16 GB · GTX 1070 / RX 590 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO, ZH), audio: [PT, EN, ES, FR, DE], ptBr: "full" },
    dlcs: [
      { name: "Hot Wheels" },
      { name: "Rally Adventure" },
    ],
  },
  "gran-turismo-7": {
    pc: "console-only",
    languages: { text: FULL_WEST.concat(JP, KO, ZH), audio: [EN, JP], ptBr: "text" },
    dlcs: [{ name: "Passe / carros extra", note: "Grind de crédito irrita; não é who-pay-wins no time." }],
    stores: [PLAYSTATION],
  },
  "f1-24": {
    pc: {
      min: "Win 10 · i5-9600K / R5 2600X · 8 GB · GTX 1660 Ti / RX 590 · 80 GB",
      rec: "Win 10/11 · i7-11700K / R7 5800X · 16 GB · RTX 3070 / RX 6700 XT · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, JP, NL), audio: [EN], ptBr: "text" },
    dlcs: [{ name: "Passe de visual", note: "No hotlap, o setup manda." }],
  },
  "animal-crossing-new-horizons": {
    pc: "console-only",
    languages: { text: [PT, EN, ES, FR, DE, IT, JP, KO, ZH], audio: [], ptBr: "text" },
    dlcs: [{ name: "Happy Home Paradise", note: "Extra, não poder." }],
    stores: [NINTENDO],
  },
  "pokemon-scarlet-violet": {
    pc: "console-only",
    languages: { text: [PT, EN, ES, FR, DE, IT, JP, KO, ZH], audio: [], ptBr: "text" },
    dlcs: [{ name: "The Hidden Treasure of Area Zero", note: "Teal Mask + Indigo Disk." }],
    stores: [NINTENDO],
  },
  starfield: {
    pc: {
      min: "Win 10 · i5-8400 / R5 2600X · 16 GB · GTX 1070 Ti / RX 5700 · 125 GB SSD",
      rec: "Win 10/11 · i7-10700K / R5 5600X · 16 GB · RTX 2080 / RX 6800 XT · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, JP), audio: [EN], ptBr: "text" },
    dlcs: [{ name: "Shattered Space", note: "Expansão. A casa ainda discute se salva o pacing." }],
  },
  "lies-of-p": {
    pc: {
      min: "Win 10 · i5-6300T / R5 1400 · 8 GB · GTX 960 / RX 560 · 50 GB",
      rec: "Win 10 · i7-8700K / R5 3600 · 16 GB · RTX 2060 / RX 5700 XT · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH), audio: [EN, JP], ptBr: "text" },
    dlcs: [{ name: "Overture", note: "Prequel. A casa trata como obrigatório." }],
  },
  "sekiro-shadows-die-twice": {
    pc: {
      min: "Win 7/10 · i3-2100 / FX-6300 · 4 GB · GTX 760 / HD 7950 · 25 GB",
      rec: "Win 10 · i5-2500K / R5 1400 · 8 GB · GTX 970 / R9 290 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, PL, RU), audio: [JP, EN], ptBr: "text" },
    dlcs: [],
  },
  "dark-souls-3": {
    pc: {
      min: "Win 7 · i3-2100 / FX-6300 · 4 GB · GTX 750 Ti / HD 6870 · 25 GB",
      rec: "Win 10 · i7-3770 / FX-8350 · 8 GB · GTX 970 / R9 290 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, PL, RU), audio: [EN, JP], ptBr: "text" },
    dlcs: [
      { name: "Ashes of Ariandel" },
      { name: "The Ringed City", note: "A casa trata o segundo como o auge." },
    ],
  },
  bloodborne: {
    pc: "console-only",
    languages: { text: FULL_WEST.concat(JP, KO, ZH, PL, RU), audio: [EN, JP], ptBr: "text" },
    dlcs: [{ name: "The Old Hunters", note: "A casa trata como obrigatório." }],
    stores: [PLAYSTATION],
  },
  "ghost-of-tsushima": {
    pc: {
      min: "Win 10 · i3-7100 / R3 1200 · 8 GB · GTX 960 / RX 550 · 60 GB",
      rec: "Win 10 · i5-8600 / R5 3600 · 16 GB · GTX 1060 / RX 570 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, PL, RU), audio: [EN, JP], ptBr: "text" },
    dlcs: [{ name: "Iki Island", note: "Incluído na Director's Cut." }],
  },
  "spider-man-remastered": {
    pc: {
      min: "Win 10 · i3-4160 / FX-6300 · 8 GB · GTX 950 / R7 260X · 75 GB",
      rec: "Win 10 · i5-4670 / R5 1600 · 16 GB · GTX 1060 6 GB / RX 580 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP), audio: [PT, EN, ES, FR, DE, IT], ptBr: "full" },
    dlcs: [{ name: "The Heist / Turf Wars / Silver Lining", note: "Incluídos no Remastered." }],
  },
  "final-fantasy-vii-remake": {
    pc: {
      min: "Win 10 · i5-3330 / R5 1400 · 8 GB · GTX 780 / R9 280X · 100 GB",
      rec: "Win 10 · i7-3770 / R7 2700X · 12 GB · GTX 1080 / RX 5700 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, PL), audio: [JP, EN], ptBr: "text" },
    dlcs: [{ name: "INTERmission (Yuffie)", note: "Incluído no Intergrade." }],
  },
  "mass-effect-legendary": {
    pc: {
      min: "Win 10 · i5-3570 / FX-8350 · 8 GB · GTX 760 / R9 270 · 120 GB",
      rec: "Win 10 · i7-7700 / R5 1600 · 16 GB · GTX 1070 / RX 5700 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP), audio: [EN], ptBr: "text" },
    dlcs: [],
  },
  "indiana-jones-great-circle": {
    pc: {
      min: "Win 10/11 · i7-8700K / R5 3600 · 16 GB · GTX 1070 / RX 5600 XT · 120 GB SSD",
      rec: "Win 10/11 · i7-12700K / R7 5800X3D · 16 GB · RTX 3080 / RX 6800 XT · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, JP, RU), audio: [EN], ptBr: "text" },
    dlcs: [],
    stores: [XBOX, { name: "Steam", href: "https://store.steampowered.com/app/2677660/" }],
  },
  "payday-2": {
    pc: {
      min: "Win 7 · dual-core 2.3 GHz · 4 GB · GTX 460 / HD 5770 · 80 GB+",
      rec: "Win 10 · i5 · 8 GB · GTX 960 · SSD",
    },
    languages: { text: FULL_WEST.concat(RU, PL), audio: [EN], ptBr: "text" },
    dlcs: [{ name: "Catálogo enorme de heist/arma", note: "A casa selou P2W de conteúdo/poder." }],
  },
  "left-4-dead-2": {
    pc: {
      min: "Win 7 · 3 GHz · 2 GB · DirectX 9 · 13 GB",
      rec: "Win 10 · dual-core · 4 GB · GTX 660 · SSD",
    },
    languages: { text: [PT, EN, ES, FR, DE, RU], audio: [EN], ptBr: "text" },
    dlcs: [],
  },
  balatro: {
    pc: {
      min: "Win 10 · dual-core · 4 GB · Intel HD 4000 · 200 MB",
      rec: "Win 10 · dual-core · 8 GB · qualquer GPU · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, RU, PL), audio: [], ptBr: "text" },
    dlcs: [],
  },
  "slay-the-spire": {
    pc: {
      min: "Win 7 · dual-core · 2 GB · Intel HD 4000 · 1 GB",
      rec: "Win 10 · dual-core · 4 GB · GTX 750 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, RU, PL), audio: [], ptBr: "text" },
    dlcs: [],
  },
  "vampire-survivors": {
    pc: {
      min: "Win 7 · dual-core · 2 GB · Intel HD 4000 · 500 MB",
      rec: "Win 10 · dual-core · 4 GB · qualquer GPU",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, RU, PL), audio: [], ptBr: "text" },
    dlcs: [
      { name: "Legacy of the Moonspell" },
      { name: "Tides of the Foscari" },
      { name: "Emergency Meeting" },
      { name: "Operation Guns" },
      { name: "Ode to Castlevania" },
    ],
  },
  "dead-cells": {
    pc: {
      min: "Win 7 · dual-core 2.4 GHz · 2 GB · Intel HD 4000 · 2 GB",
      rec: "Win 10 · i5 · 4 GB · GTX 750 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, RU, PL), audio: [], ptBr: "text" },
    dlcs: [
      { name: "Rise of the Giant", note: "Grátis." },
      { name: "The Bad Seed" },
      { name: "Fatal Falls" },
      { name: "The Queen and the Sea" },
      { name: "Return to Castlevania" },
    ],
  },
  undertale: {
    pc: {
      min: "Win 7 · dual-core · 2 GB · DirectX 9 · 200 MB",
      rec: "Win 10 · dual-core · 4 GB · qualquer GPU",
    },
    languages: { text: [PT, EN, ES, FR, DE, IT, JP, ZH], audio: [], ptBr: "text" },
    dlcs: [],
  },
  control: {
    pc: {
      min: "Win 7 · i5-4690 / FX-4350 · 8 GB · GTX 780 / R9 280X · 42 GB",
      rec: "Win 10 · i5-7600K / R5 1600 · 16 GB · GTX 1660 / RX 580 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO, ZH), audio: [EN], ptBr: "text" },
    dlcs: [
      { name: "The Foundation" },
      { name: "AWE" },
    ],
  },
  "horizon-zero-dawn": {
    pc: {
      min: "Win 10 · i5-2500K / FX-6300 · 8 GB · GTX 780 / R9 290 · 100 GB",
      rec: "Win 10 · i7-4770K / R5 1600 · 16 GB · GTX 1060 6 GB / RX 580 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO, ZH), audio: [PT, EN, ES, FR, DE, IT], ptBr: "full" },
    dlcs: [{ name: "The Frozen Wilds" }],
  },
  "monster-hunter-world": {
    pc: {
      min: "Win 10 · i5-4460 / FX-6300 · 8 GB · GTX 760 / R7 260X · 48 GB",
      rec: "Win 10 · i7-3770 / FX-8350 · 8 GB · GTX 1060 / RX 570 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, RU, PL), audio: [EN, JP], ptBr: "text" },
    dlcs: [{ name: "Iceborne", note: "O pacote. A casa trata como o jogo completo." }],
  },
  "armored-core-vi": {
    pc: {
      min: "Win 10 · i5-2300 / FX-6300 · 8 GB · GTX 1050 Ti / RX 570 · 50 GB",
      rec: "Win 10 · i7-8700 / R5 3600 · 12 GB · GTX 1660 / RX 590 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, PL, RU), audio: [EN, JP], ptBr: "text" },
    dlcs: [],
  },
  "kingdom-come-deliverance-2": {
    pc: {
      min: "Win 10 · i5-8400 / R5 1500X · 16 GB · GTX 1060 6 GB / RX 580 · 100 GB SSD",
      rec: "Win 10/11 · i7-9700K / R5 3600 · 16 GB · RTX 2060 / RX 5700 XT · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO, ZH, "Tcheco"), audio: [EN], ptBr: "text" },
    dlcs: [],
  },
  enshrouded: {
    pc: {
      min: "Win 10 · i5-8400 / R5 1600 · 16 GB · GTX 1060 6 GB / RX 580 · 40 GB",
      rec: "Win 10/11 · i7-9700K / R5 3600 · 16 GB · RTX 2060 / RX 5700 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO, ZH), audio: [EN], ptBr: "text" },
    dlcs: [],
  },
  "astro-bot": {
    pc: "console-only",
    languages: { text: FULL_WEST.concat(JP, KO, ZH), audio: [EN, JP], ptBr: "text" },
    dlcs: [],
    stores: [PLAYSTATION],
  },
  "ratchet-clank-rift-apart": {
    pc: {
      min: "Win 10 · i3-8100 / R3 1200 · 8 GB · GTX 1060 6 GB / RX 5500 XT · 75 GB SSD",
      rec: "Win 10 · i5-8400 / R5 3600 · 16 GB · RTX 2060 Super / RX 5700 XT · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO, ZH), audio: [EN], ptBr: "text" },
    dlcs: [],
    stores: [
      { name: "Steam", href: "https://store.steampowered.com/app/1350780/" },
      PLAYSTATION,
    ],
  },
};

function steamStore(appId: number): StoreLink {
  return {
    name: "Steam",
    href: `https://store.steampowered.com/app/${appId}/`,
  };
}

function nintendoSearch(title: string): StoreLink {
  return {
    name: "Nintendo eShop",
    href: `https://www.nintendo.com/us/search/store?q=${encodeURIComponent(title)}`,
  };
}

function playstationSearch(title: string): StoreLink {
  return {
    name: "PlayStation Store",
    href: `https://store.playstation.com/search/${encodeURIComponent(title)}`,
  };
}

const EXTRA_DOSSIERS: Record<string, DossierOverlay> = {
  terraria: {
    pc: {
      min: "Win 7 · 2.0 GHz · 2.5 GB · DirectX 10 · 200 MB",
      rec: "Win 10 · dual-core 3 GHz · 4 GB · qualquer GPU · SSD",
    },
    languages: { text: FULL_WEST.concat(RU, JP, KO, ZH, PL), audio: [], ptBr: "text" },
    dlcs: [],
  },
  factorio: {
    pc: {
      min: "Win 10 · dual-core 3 GHz · 4 GB · DirectX 10.1 · 5 GB",
      rec: "Win 10 · i5 / R5 · 8 GB · GTX 750 · SSD",
    },
    languages: { text: FULL_WEST.concat(RU, JP, KO, ZH, PL, "Tcheco"), audio: [], ptBr: "text" },
    dlcs: [{ name: "Space Age", note: "A expansão grande. O base já é um vício." }],
  },
  rimworld: {
    pc: {
      min: "Win 7 · Core 2 Duo · 4 GB · DirectX 11 · 2 GB",
      rec: "Win 10 · i5 · 8 GB · GTX 750 · SSD",
    },
    languages: { text: FULL_WEST.concat(RU, JP, KO, ZH, PL), audio: [], ptBr: "text" },
    dlcs: [
      { name: "Royalty" },
      { name: "Ideology" },
      { name: "Biotech" },
      { name: "Anomaly" },
    ],
  },
  "civilization-vi": {
    pc: {
      min: "Win 7 · i3-3225 · 4 GB · Intel HD 4000 · 17 GB+",
      rec: "Win 10 · i5-4690 · 8 GB · GTX 770 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO, ZH), audio: [EN], ptBr: "text" },
    dlcs: [
      { name: "Rise and Fall" },
      { name: "Gathering Storm", note: "O pacote que fecha o jogo." },
    ],
  },
  "xcom-2": {
    pc: {
      min: "Win 7 · i3-4160 · 4 GB · Intel HD 4000 · 45 GB",
      rec: "Win 10 · i5-4690 · 8 GB · GTX 770 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO, ZH), audio: [EN], ptBr: "text" },
    dlcs: [{ name: "War of the Chosen", note: "O jeito certo de jogar." }],
  },
  "total-war-warhammer-3": {
    pc: {
      min: "Win 10 · i3-2100 · 4 GB · GTX 460 1 GB · 120 GB",
      rec: "Win 10 · i5-6600 · 8 GB · GTX 1660 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO, ZH), audio: [EN], ptBr: "text" },
    dlcs: [{ name: "Lords / raças", note: "Modelo de DLC de roster. O campo é fair." }],
  },
  "monster-hunter-rise": {
    pc: {
      min: "Win 10 · i3-4130 / FX-6100 · 8 GB · GTX 1050 / RX 560 · 26 GB",
      rec: "Win 10 · i5-4690 / R5 1500X · 8 GB · GTX 1060 / RX 570 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH), audio: [JP, EN], ptBr: "text" },
    dlcs: [{ name: "Sunbreak", note: "O endgame." }],
  },
  "devil-may-cry-5": {
    pc: {
      min: "Win 7 · i5-4460 / FX-6300 · 8 GB · GTX 760 / R7 260X · 35 GB",
      rec: "Win 10 · i7-3770 / FX-9590 · 8 GB · GTX 1060 / RX 480 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH), audio: [EN, JP], ptBr: "text" },
    dlcs: [{ name: "Vergil", note: "Playable. A casa recomenda." }],
  },
  bayonetta: {
    pc: {
      min: "Win 7 · dual-core 2.4 GHz · 2 GB · DirectX 9 · 8 GB",
      rec: "Win 10 · i5 · 4 GB · GTX 750 · SSD",
    },
    languages: { text: [EN, JP, ES, FR, DE, IT], audio: [EN, JP], ptBr: "none" },
    dlcs: [],
  },
  "metal-gear-solid-v": {
    pc: {
      min: "Win 7 · i5-4460 · 4 GB · GTX 760 · 30 GB",
      rec: "Win 10 · i7-4790 · 8 GB · GTX 970 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, RU, PL), audio: [EN, JP], ptBr: "text" },
    dlcs: [],
  },
  "hitman-3": {
    pc: {
      min: "Win 10 · i5-2500K · 8 GB · GTX 660 / HD 7770 · 80 GB",
      rec: "Win 10 · i7-4790 · 16 GB · GTX 1070 / RX 580 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO, ZH), audio: [EN], ptBr: "text" },
    dlcs: [{ name: "Trilogy access + maps extra", note: "O 3 importa os mapas do 1 e 2." }],
  },
  "dishonored-2": {
    pc: {
      min: "Win 7 · i5-2400 / FX-8320 · 6 GB · GTX 660 / HD 7970 · 40 GB",
      rec: "Win 10 · i7-4770 / R5 1600 · 8 GB · GTX 1060 / RX 480 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP), audio: [EN], ptBr: "text" },
    dlcs: [],
  },
  prey: {
    pc: {
      min: "Win 7 · i5-2400 · 8 GB · GTX 660 · 20 GB",
      rec: "Win 10 · i7-4770 · 16 GB · GTX 970 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO, ZH), audio: [EN], ptBr: "text" },
    dlcs: [{ name: "Mooncrash", note: "Roguelite na Lua. A casa recomenda." }],
  },
  "resident-evil-2-remake": {
    pc: {
      min: "Win 10 · i5-4460 / FX-6300 · 8 GB · GTX 760 / R7 260X · 26 GB",
      rec: "Win 10 · i7-3770 / FX-9590 · 8 GB · GTX 1060 / RX 480 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH), audio: [PT, EN, ES, FR, DE, IT, JP], ptBr: "full" },
    dlcs: [],
  },
  "silent-hill-2": {
    pc: {
      min: "Win 10 · i7-8700K / R5 3600 · 16 GB · GTX 1070 Ti / RX 5700 · 50 GB SSD",
      rec: "Win 10/11 · i7-11700K / R7 5800X · 16 GB · RTX 3080 / RX 6800 XT · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO, ZH), audio: [EN], ptBr: "text" },
    dlcs: [],
  },
  "dead-space-remake": {
    pc: {
      min: "Win 10 · i5-8600 / R5 2600 · 8 GB · GTX 1070 / RX 5600 XT · 50 GB SSD",
      rec: "Win 10 · i7-9700 / R5 3600X · 16 GB · RTX 2070 / RX 5700 XT · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO, ZH), audio: [EN], ptBr: "text" },
    dlcs: [],
  },
  "uncharted-4": {
    pc: {
      min: "Win 10 · i5-4430 / FX-6300 · 8 GB · GTX 960 / RX 470 · 126 GB",
      rec: "Win 10 · i7-4770 / R5 1600 · 16 GB · GTX 1060 6 GB / RX 570 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO, ZH), audio: [PT, EN, ES, FR, DE, IT], ptBr: "full" },
    dlcs: [{ name: "The Lost Legacy", note: "Incluído no Legacy of Thieves." }],
  },
  "titanfall-2": {
    pc: {
      min: "Win 7 · i3-6300T · 8 GB · GTX 660 · 45 GB",
      rec: "Win 10 · i5-6600 · 16 GB · GTX 1060 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP), audio: [EN], ptBr: "text" },
    dlcs: [],
  },
  "doom-2016": {
    pc: {
      min: "Win 7 · i3-3225 · 8 GB · GTX 760 / R7 260X · 55 GB",
      rec: "Win 10 · i7-3770 · 8 GB · GTX 970 / R9 290 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP), audio: [EN], ptBr: "text" },
    dlcs: [],
  },
  "wolfenstein-the-new-order": {
    pc: {
      min: "Win 7 · dual-core 2.4 GHz · 4 GB · GTX 460 · 50 GB",
      rec: "Win 10 · i5 · 8 GB · GTX 660 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU), audio: [EN], ptBr: "text" },
    dlcs: [],
  },
  "dragon-age-inquisition": {
    pc: {
      min: "Win 7 · i3-2100 · 4 GB · GTX 260 · 26 GB+",
      rec: "Win 10 · i5 · 8 GB · GTX 660 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP), audio: [EN], ptBr: "text" },
    dlcs: [{ name: "Trespasser", note: "O fechamento. A casa trata como obrigatório." }],
  },
  "divinity-original-sin-2": {
    pc: {
      min: "Win 7 · i5 · 4 GB · Intel HD 4000 · 20 GB",
      rec: "Win 10 · i7 · 8 GB · GTX 770 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO, ZH), audio: [EN], ptBr: "text" },
    dlcs: [],
  },
  "pillars-of-eternity": {
    pc: {
      min: "Win 7 · dual-core 2.8 GHz · 4 GB · Intel HD 4000 · 25 GB",
      rec: "Win 10 · i5 · 8 GB · GTX 770 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU), audio: [EN], ptBr: "text" },
    dlcs: [{ name: "The White March Parts I & II" }],
  },
  omori: {
    pc: {
      min: "Win 7 · dual-core · 2 GB · DirectX 9 · 4 GB",
      rec: "Win 10 · dual-core · 4 GB · qualquer GPU",
    },
    languages: { text: [EN, ES, FR, KO, ZH, JP], audio: [], ptBr: "none" },
    dlcs: [],
  },
  cuphead: {
    pc: {
      min: "Win 7 · dual-core 2.7 GHz · 3 GB · Intel HD 4000 · 4 GB",
      rec: "Win 10 · i5 · 4 GB · GTX 750 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, RU), audio: [EN], ptBr: "text" },
    dlcs: [{ name: "The Delicious Last Course" }],
  },
  "ori-and-the-blind-forest": {
    pc: {
      min: "Win 7 · i5 2.0 GHz · 4 GB · DirectX 9 · 8 GB",
      rec: "Win 10 · i5 · 8 GB · GTX 750 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO, ZH), audio: [], ptBr: "text" },
    dlcs: [],
  },
  "ori-and-the-will-of-the-wisps": {
    pc: {
      min: "Win 10 · i5 2.0 GHz · 8 GB · GTX 650 · 20 GB",
      rec: "Win 10 · i5 · 8 GB · GTX 950 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO, ZH), audio: [], ptBr: "text" },
    dlcs: [],
  },
  "super-meat-boy": {
    pc: {
      min: "Win 7 · 1.2 GHz · 1 GB · DirectX 8 · 50 MB",
      rec: "Win 10 · dual-core · 2 GB · qualquer GPU",
    },
    languages: { text: [EN], audio: [], ptBr: "none" },
    dlcs: [],
  },
  "shovel-knight": {
    pc: {
      min: "Win 7 · dual-core · 2 GB · DirectX 9 · 250 MB",
      rec: "Win 10 · dual-core · 4 GB · qualquer GPU",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, RU), audio: [], ptBr: "text" },
    dlcs: [{ name: "Treasure Trove", note: "O pack das quatro campanhas." }],
  },
  inscryption: {
    pc: {
      min: "Win 10 · dual-core 2.4 GHz · 4 GB · Intel HD 4000 · 4 GB",
      rec: "Win 10 · i5 · 8 GB · GTX 750 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH, RU, PL), audio: [EN], ptBr: "text" },
    dlcs: [],
  },
  "super-smash-bros-ultimate": {
    pc: "console-only",
    languages: { text: [PT, EN, ES, FR, DE, IT, JP, KO, ZH], audio: [EN, JP], ptBr: "text" },
    dlcs: [{ name: "Fighters Pass 1 & 2", note: "Lutadores. No round, o execution." }],
    stores: [NINTENDO],
  },
  "metroid-dread": {
    pc: "console-only",
    languages: { text: [PT, EN, ES, FR, DE, IT, JP, KO, ZH], audio: [EN, JP], ptBr: "text" },
    dlcs: [],
    stores: [NINTENDO],
  },
  "fire-emblem-three-houses": {
    pc: "console-only",
    languages: { text: [PT, EN, ES, FR, DE, IT, JP, KO, ZH], audio: [EN, JP], ptBr: "text" },
    dlcs: [{ name: "Cindered Shadows / Ashen Wolves" }],
    stores: [NINTENDO],
  },
  "xenoblade-chronicles-3": {
    pc: "console-only",
    languages: { text: [EN, ES, FR, DE, IT, JP, KO, ZH], audio: [JP, EN], ptBr: "none" },
    dlcs: [{ name: "Future Redeemed" }],
    stores: [NINTENDO],
  },
  "yakuza-like-a-dragon": {
    pc: {
      min: "Win 10 · i5-3470 · 6 GB · GTX 660 · 40 GB",
      rec: "Win 10 · i7-3770 · 8 GB · GTX 1060 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH), audio: [JP, EN], ptBr: "text" },
    dlcs: [],
  },
  "yakuza-0": {
    pc: {
      min: "Win 10 · i5-3470 · 4 GB · GTX 660 · 35 GB",
      rec: "Win 10 · i7-3770 · 8 GB · GTX 760 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH), audio: [JP, EN], ptBr: "text" },
    dlcs: [],
  },
  judgment: {
    pc: {
      min: "Win 10 · i5-3470 · 6 GB · GTX 660 · 40 GB",
      rec: "Win 10 · i7-3770 · 8 GB · GTX 1060 · SSD",
    },
    languages: { text: [EN, ES, FR, DE, IT, JP, KO, ZH], audio: [JP, EN], ptBr: "none" },
    dlcs: [],
  },
  "ninja-gaiden-master-collection": {
    pc: {
      min: "Win 10 · i3-6300 · 6 GB · GTX 750 Ti · 20 GB",
      rec: "Win 10 · i5-8400 · 8 GB · GTX 1060 · SSD",
    },
    languages: { text: [EN, JP, ES, FR, DE, IT], audio: [EN, JP], ptBr: "none" },
    dlcs: [],
  },
  subnautica: {
    pc: {
      min: "Win 7 · i5-2xxx · 4 GB · Intel HD 4000 · 20 GB",
      rec: "Win 10 · i5 · 8 GB · GTX 550 Ti · SSD",
    },
    languages: { text: FULL_WEST.concat(RU, JP, KO, ZH, PL), audio: [EN], ptBr: "text" },
    dlcs: [],
  },
  "the-forest": {
    pc: {
      min: "Win 7 · dual-core 2.4 GHz · 4 GB · GTX 560 · 5 GB",
      rec: "Win 10 · i5 · 8 GB · GTX 760 · SSD",
    },
    languages: { text: FULL_WEST.concat(RU, PL, JP, KO, ZH), audio: [EN], ptBr: "text" },
    dlcs: [],
  },
  "sons-of-the-forest": {
    pc: {
      min: "Win 10 · i5-8400 / R5 3400 · 8 GB · GTX 1060 / RX 560 · 20 GB",
      rec: "Win 10 · i5-10600 / R5 3600 · 16 GB · RTX 2060 / RX 5700 · SSD",
    },
    languages: { text: FULL_WEST.concat(RU, PL, JP, KO, ZH), audio: [EN], ptBr: "text" },
    dlcs: [],
  },
  "a-way-out": {
    pc: {
      min: "Win 7 · i3-2100T · 8 GB · GTX 650 Ti · 25 GB",
      rec: "Win 10 · i5-3570K · 16 GB · GTX 760 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP, KO, ZH), audio: [EN], ptBr: "text" },
    dlcs: [],
  },
  "nioh-2": {
    pc: {
      min: "Win 10 · i5-3450 · 4 GB · GTX 760 · 80 GB",
      rec: "Win 10 · i7-3770 · 8 GB · GTX 1060 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH), audio: [EN, JP], ptBr: "text" },
    dlcs: [
      { name: "The Tengu's Disciple" },
      { name: "Darkness in the Capital" },
      { name: "The First Samurai" },
    ],
  },
  "wo-long-fallen-dynasty": {
    pc: {
      min: "Win 10 · i5-8400 / R3 3100 · 8 GB · GTX 1650 Super / RX 570 · 60 GB",
      rec: "Win 10 · i7-8700K / R5 3600 · 16 GB · GTX 1070 / RX 5700 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH), audio: [EN, JP], ptBr: "text" },
    dlcs: [{ name: "Season pass / DLCs de mapa" }],
  },
  "kingdom-come-deliverance": {
    pc: {
      min: "Win 7 · i5-2500K · 8 GB · GTX 660 · 40 GB",
      rec: "Win 10 · i5-4690K · 16 GB · GTX 970 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, "Tcheco"), audio: [EN], ptBr: "text" },
    dlcs: [
      { name: "From the Ashes" },
      { name: "The Amorous Adventures of Bold Sir Hans Capon" },
      { name: "Band of Bastards" },
      { name: "A Woman's Lot" },
    ],
  },
  "lies-of-p-overture": {
    pc: {
      min: "Win 10 · i5-6300T / R5 1400 · 8 GB · GTX 960 / RX 560 · 20 GB extra",
      rec: "Win 10 · i7-8700K / R5 3600 · 16 GB · RTX 2060 · SSD",
    },
    languages: { text: FULL_WEST.concat(JP, KO, ZH), audio: [EN, JP], ptBr: "text" },
    dlcs: [],
  },
  "bioshock-infinite": {
    pc: {
      min: "Win 7 · dual-core 2.4 GHz · 2 GB · DirectX 10 · 20 GB",
      rec: "Win 10 · i5 · 4 GB · GTX 560 · SSD",
    },
    languages: { text: FULL_WEST.concat(PL, RU, JP), audio: [EN], ptBr: "text" },
    dlcs: [{ name: "Burial at Sea", note: "Episódios. A casa discute o fim — a ficha não." }],
  },
};

const ALL_DOSSIERS: Record<string, DossierOverlay> = {
  ...DOSSIER_BY_SLUG,
  ...EXTRA_DOSSIERS,
};

export function hasDossierOverlay(slug: string) {
  const overlay = ALL_DOSSIERS[slug];
  if (!overlay) return false;
  return Boolean(
    overlay.pc || overlay.languages || overlay.dlcs !== undefined,
  );
}

export function getGameDossier(game: {
  slug: string;
  title: string;
  platforms?: string[];
  steamAppId?: number | null;
}): GameDossier {
  const overlay = ALL_DOSSIERS[game.slug] ?? {};
  const platforms = game.platforms ?? [];
  const stores = resolveStores(game, overlay);

  return {
    platforms,
    pc: overlay.pc,
    languages: overlay.languages,
    dlcs: overlay.dlcs,
    stores,
  };
}

function resolveStores(
  game: { slug: string; title: string; platforms?: string[]; steamAppId?: number | null },
  overlay: DossierOverlay,
): StoreLink[] {
  const seen = new Set<string>();
  const stores: StoreLink[] = [];

  function push(store: StoreLink) {
    const key = store.name.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    stores.push(store);
  }

  overlay.stores?.forEach(push);

  const appId = game.steamAppId && game.steamAppId > 0 ? game.steamAppId : null;
  if (appId) push(steamStore(appId));

  const platforms = (game.platforms ?? []).map((item) => item.toLowerCase());
  if (platforms.includes("switch") && !appId) push(nintendoSearch(game.title));
  if (platforms.includes("playstation") && !appId) push(playstationSearch(game.title));
  if (platforms.includes("xbox") && !appId) push(XBOX);

  return stores;
}

export function ptBrLabel(support: PtBrSupport) {
  if (support === "full") return "PT-BR completo (texto + áudio)";
  if (support === "text") return "PT-BR na interface";
  return "Sem PT-BR oficial";
}
