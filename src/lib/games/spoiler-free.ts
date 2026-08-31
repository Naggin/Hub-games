type MonetizationKind = "fair" | "cosmetics" | "gacha" | "pay_to_win";

export type SpoilerFreeSummary = {
  premise: string;
  howYouPlay: string;
  whoItsFor: string;
  communityTalks: string;
};

type GameHint = {
  slug: string;
  title: string;
  synopsis: string;
  genres: string[];
  pitch?: string;
  communityTake?: string;
  monetization: MonetizationKind;
};

/**
 * Flagship cabinets: 4 beats, zero spoiler de plot.
 * Premissa / loop / pra quem é / o que a galera discute — sem twist, sem ending.
 */
export const SUMMARIES_BY_SLUG: Record<string, SpoilerFreeSummary> = {
  "the-witcher-3-wild-hunt": {
    premise:
      "Você é um bruxo profissional num continente sujo: contratos de monstro, política de taverna e um mundo que não espera você ficar bom. A missão pessoal existe, mas o mapa vive sozinho.",
    howYouPlay:
      "Mundo aberto de cavalo, Gwent na mesa e combate de sinais + espada. Side quest aqui não é fetch quest de mentira — cada vilarejo tem fofoca com peso. Você escolhe o ritmo: caça, conversa, ou some no pântano.",
    whoItsFor:
      "Quem curte RPG de escolha com cara de novela medieval, sem pressa de 'terminar o mapa'. Se você odeia ler, vai sofrer. Se você ama NPC com nome e problema, é casa.",
    communityTalks:
      "A galera discute build de sinais, se vale 100% o mapa e qual contrato é o mais gostoso. Ninguém aqui vai te contar o que acontece no fim da caçada.",
  },
  "elden-ring": {
    premise:
      "As Terras Intermédias não te seguram pela mão. Você acorda, olha o horizonte e decide por onde apanhar. Castelo, pântano, caverna — o mundo é o tutorial.",
    howYouPlay:
      "Soulslike a cavalo: stamina, postura, build de força/fé/arcano. Morre, lê o chão, volta. Sem marcador piscando 'vá aqui agora'. Spirit ashes existem pra quem quer companhia na porrada.",
    whoItsFor:
      "Quem gosta de descobrir sozinho e de chefes que ensinam no soco. Se 'git gud' te dá urticária, ainda dá pra jogar mais lento — só não espere um GPS.",
    communityTalks:
      "Build, se o boss é justo, e se a platina vale o grind de finais. A casa não spoila quem senta no trono nem o que mora atrás da névoa.",
  },
  "red-dead-redemption-2": {
    premise:
      "Faroeste lento e sujo. Você vive numa gangue no fim da linha, num mundo que respira: neve, cidade, lampejo de civlização. Não é um GTA de cavalo — é um dia-a-dia de foragido.",
    howYouPlay:
      "Mundo aberto cinematográfico. Caça, camp, honra, tiro cinemático. Missão principal anda no passo de novela; o mapa enche de conversa, dívida e bicho. Vale ir devagar.",
    whoItsFor:
      "Quem topa um jogo que pede paciência e atenção pra gesto pequeno. Se você quer só tiro e checklist, vai achar lento. Se você curte mundo que existe sem você, é o auge.",
    communityTalks:
      "A galera discute o começo lento, a imersão e se vale 100% o mapa. Sem falar de epílogo, destino de ninguém, nem o que o camp vira.",
  },
  "god-of-war": {
    premise:
      "Um pai fechado, um filho curioso, um machado que volta. Mitologia nórdica sem aula: você anda, luta e escuta os dois tentando não se odiar.",
    howYouPlay:
      "Ação em terceira, câmera colada, quebra-quebra de rundas e puzzles de palácio. Combate pesado, upgrade de machado, um pouco de exploração entre as porradas.",
    whoItsFor:
      "Quem quer história e combate no mesmo nível, sem mundo aberto infinito. Bom pra quem curte set piece e ainda quer um 'mais um cofre'.",
    communityTalks:
      "A casa fala de combate, da relação pai-filho e se o reboot passou o grego. Sem spoiler de deuses, mortes ou o que tem no topo da montanha.",
  },
  hades: {
    premise:
      "Você é o filho do Hades tentando sair do Submundo. Cada run é uma fuga. Morrer não é game over — é voltar pra casa, flertar, melhorar a arma e tentar de novo.",
    howYouPlay:
      "Roguelike de ação em salas. Boon dos deuses, arma da câmara, diálogo que muda porque você morreu de novo. Loop curto, viciante, e o hub entre runs é metade do jogo.",
    whoItsFor:
      "Quem curte 'mais uma run' de 20–40 min e texto com graça. Casual-friendly no começo, profundo se você caçar todas as rotas de conversa.",
    communityTalks:
      "A galera discute arma, heat e quem é o crush do Olimpo. Sem spoiler de quem ajuda na saída nem do que tem acima.",
  },
  celeste: {
    premise:
      "Madeline quer subir uma montanha. O jogo é sobre persistência, ansiedade e o pulo que você jura que não dá. Assist mode existe e não é trapaça.",
    howYouPlay:
      "Plataforma de precisão: dash, cabelo, death rápido, checkpoint justo. Fases curtas, die-and-retry honesto. Colecionáveis pra quem quer sofrer mais, não pra quem quer só chegar no topo.",
    whoItsFor:
      "Quem curte desafio justo e história curta que respeita o player. Se plataforma te irrita, o Assist Mode é o convite — a casa não zuça quem usa.",
    communityTalks:
      "A comunidade discute B-sides, Farewell e se Assist 'conta'. Ninguém vai te contar o que a montanha representa no fim.",
  },
  "hollow-knight": {
    premise:
      "Um inseto mudo numa ruína de reino subterrâneo. Hallownest é mapa, mistério e bicho que te ensina no hit. Você cai, ganha um pulo, volta num canto que era parede.",
    howYouPlay:
      "Metroidvania clássico: pogo, dash, amuleto, boss que pede padrão. Exploração sem GPS. A platina é peregrinação — não um checklist de 3 horas.",
    whoItsFor:
      "Quem gosta de se perder de propósito e de combate preciso. Se você odeia backtrack, vai resmungar. Se você ama mapa que 'clica', é religião.",
    communityTalks:
      "A galera discute boss, panela e se a platina é sadismo. Sem nomear o que mora no fundo nem o que o reino foi.",
  },
  "baldurs-gate-3": {
    premise:
      "RPG de mesa jogável: tadpole na cabeça, costa de Sword Coast, e cada diálogo é um save novo. Você monta um grupo de gente quebrada e tenta não virar o problema.",
    howYouPlay:
      "D&D 5e na tela: turno, dado, furtivo, fala, ou soco. Split da party, cutscene que muda se você tava no teto. Camp entre atos é taverna e terapia.",
    whoItsFor:
      "Quem topa 80–150h e ler. Se você quer um hack-and-slash, tem origem melhor. Se você quer sentir que o mundo lembra do que você fez, é o teto da década.",
    communityTalks:
      "A casa discute origem, romance (sem nomear o fim) e se o Ato 3 cansa. Zero spoiler de mind flayer, de quem trai, de quem sobe no palco.",
  },
  "cyberpunk-2077": {
    premise:
      "Night City em primeira pessoa: corpo, chrome e um chip na cabeça que não te larga. Você é merc, não messias. A cidade é o personagem — neon, corpo e conta bancária.",
    howYouPlay:
      "RPG de ação em 1ª: stealth, hack, tiro, diálogo. Build de netrunner ou gorila de gorja. Missões de gigs, carro, e um arco principal que você pode enrolar caçando street cred.",
    whoItsFor:
      "Quem curte imersão de cidade e escolha de playstyle. O lançamento foi um desastre; hoje o gabinete tá jogável. Se você só lembra do meme, vale olhar de novo.",
    communityTalks:
      "A galera discute se 'já dá pra jogar', Phantom Liberty e build de cyberware. Sem spoiler de Relic, de quem some, nem do que a cidade cobra no fim.",
  },
  "disco-elysium": {
    premise:
      "Você é um detetive com ressaca existencial numa cidade que já perdeu a revolução. Sem tiro clássico. O combate é fala, skill check e a voz na sua cabeça te zuando.",
    howYouPlay:
      "RPG isométrico de texto: você anda, fala, falha lindo. Skills são personalidade — Enciclopédia, Drama, Inland Empire. Falhar um dado também é conteúdo.",
    whoItsFor:
      "Quem lê de boa e curte mundo político-triste com humor ácido. Se você quer action, fuja. Se você quer o melhor texto de game da década, entra cego.",
    communityTalks:
      "A casa recomenda jogar cego e não googlar build. Discutem skill, política do game, se vale o DLC. Sem o caso, sem o que tem no corpo, sem o final.",
  },
  "outer-wilds": {
    premise:
      "Um piloto num sistema solar pequenininho, com um mistério que o universo não vai te contar duas vezes. Exploração, curiosidade, e um loop que você descobre jogando — não lendo wiki.",
    howYouPlay:
      "Você voa, pousa, lê, morre, tenta de novo. O 'progresso' é o que você entendeu, não um XP. Sem combate clássico. Sem mapa de objetivos. Só o que você notou.",
    whoItsFor:
      "Quem topa jogar cego e não ser spoilado por amigo. Se você odeia mistério, pula. Se você ama a sensação de 'espera, então é ISSO', é o melhor gabinete do hub.",
    communityTalks:
      "A regra da casa: não spoila. Nem o loop, nem o que tem em cada astro, nem o porquê do céu. A galera só diz: joga. Depois a gente conversa.",
  },
  "stardew-valley": {
    premise:
      "Você herda uma fazenda zoada e uma vila que não cobra DPS. Planta, pesca, bebe no saloon, namora se quiser. O combate existe no andar de baixo — não é o ponto.",
    howYouPlay:
      "Calendário de estação, energia, upgrade de ferramenta, relacionamento. Sem fail state pesado. Você decide se o dia é mina, fazenda ou festival.",
    whoItsFor:
      "Quem quer desligar o cérebro depois do trampo sem se sentir ocioso. Confort food. Mil horas se você deixar. Sem loja no meio do nabo.",
    communityTalks:
      "A galera discute cônjuge, layout de fazenda e se o late game cansa. Sem spoiler de eventos de coração nem do que tem na mina fundo.",
  },
  minecraft: {
    premise:
      "Blocos, noite, e o save que nunca acaba. Você nasce, punha madeira, e de repente tem uma casa, uma fazenda e um nether portal 'só pra ver'.",
    howYouPlay:
      "Sandbox de sobrevivência ou criativo. Mina, craft, redstone, multiplayer. O jogo não te conta o objetivo — você inventa. Bosses existem pra quem quer ritual.",
    whoItsFor:
      "Todo mundo, literalmente. Criança, pai, nerd de redstone, builder. Sem P2W no progresso do mundo. Realm/servidor é outra história de social.",
    communityTalks:
      "A casa discute versão, tech e se vale o ritual do End. Sem spoiler de dimensão, de estrutura, de quem espera no fim.",
  },
  "persona-5-royal": {
    premise:
      "Colegial em Tóquio, ladrão-fantasma de noite. Calendário escolar, estilo no teto, e um palácio que é palco. A Royal é a versão que a casa manda jogar.",
    howYouPlay:
      "Social sim + dungeon: dia você estuda/namora/trabalha, noite você invade palácio por turno. Persona, fusion, lock. Longo. Estiloso. Vicia o calendário.",
    whoItsFor:
      "Quem topa 100h+ e JRPG com cara de anime fashion. Se você odeia calendário, vai achar pad. Se você ama elenco e groove, é o teto.",
    communityTalks:
      "A galera discute confidant, Royal vs vanilla e se o terceiro semestre vale. Sem spoiler de palácio, de traidor, de quem é o quê.",
  },
  "the-last-of-us-part-i": {
    premise:
      "Viagem de costa a costa num EUA pós-pandemia. Você cuida de alguém. O tiro existe; o silêncio pesa mais. Remake caprichado, história da casa.",
    howYouPlay:
      "Ação-aventura linear: stealth, recurso curto, set piece. Não é looter. Não é mundo aberto. É corredor com alma e um combate que pune o desperdício.",
    whoItsFor:
      "Quem quer história cinematográfica com gameplay que não é filme interativo o tempo todo. Pesado. Se você só quer tiro, tem FPS mais honesto.",
    communityTalks:
      "A casa discute se o remake 'precisava' e se a história ainda segura. Sem o que tem no hospital, sem o fim da estrada, sem quem mora no meio.",
  },
  "alan-wake-2": {
    premise:
      "Survival horror literário: um escritor preso na própria trama, uma investigação que não cabe no caderno. A floresta e a cidade não te explicam nada de graça.",
    howYouPlay:
      "Survival de recurso, flashlight, troca de protagonista, e um 'caso' que você monta no board. Mais atmosfera do que jumpscare barato. Explorar é ler o espaço.",
    whoItsFor:
      "Quem curte Remedy, Twin Peaks e terror que pede atenção. Se você quer só correr e atirar, vai achar pretensioso. Se você ama mood, é o gabinete.",
    communityTalks:
      "A galera do terror aplaude atmosfera e trilha. Discutem New Game+ e se a história 'fecha'. Sem o que o manuscrito revela, sem o lago, sem o palco.",
  },
  "helldivers-2": {
    premise:
      "Cooperativo caótico pra espalhar democracia galáctica. Você cai de órbita, pede orbital, e alguém da squad te acerta com o friendly fire mais sincero do ano.",
    howYouPlay:
      "Tiro em 3ª, 4 players, estratagema no D-pad, extração que quase nunca é limpa. Dificuldade escala o inseto e o bot. Warbond é visual — o poder vem de coordenação.",
    whoItsFor:
      "Quem tem 3 amigos e humor pra morrer ridículo. Solo dá, mas o jogo brilha no microfone. Live service sem P2W no gatilho.",
    communityTalks:
      "A casa discute warbond, se o balance tá justo e o meme do friendly fire. Sem spoiler de campanha — o live service é o loop, não um filme.",
  },
  "zelda-breath-of-the-wild": {
    premise:
      "Hyrule aberto depois do desastre. Você sobe, desce, cozinha, improvisa uma ponte com tronco. O santuário ensina física; o mapa ensina curiosidade.",
    howYouPlay:
      "Climb, glide, cook, break weapon, think. Puzzle de santuário, torre, e o 'será que dá pra...?' que vira yes. Combate existe; criatividade é o sistema.",
    whoItsFor:
      "Quem ama mundo aberto que não é checklist de ícone. Se você quer história falada o tempo todo, é mais silêncio do que cutscene. Vale cada torre.",
    communityTalks:
      "A galera discute se TOTK passa, se vale 100% o mapa e o meme da bomba redonda. Sem o que tem no castelo, sem o mestre, sem o fim da planície.",
  },
  "zelda-tears-of-the-kingdom": {
    premise:
      "BOTW com o teto virando mapa. Ultrahand: você cola o que quiser. O céu, a superfície e o embaixo são três Hyrules no mesmo save.",
    howYouPlay:
      "Mesmo loop de curiosidade, agora com engenhoca. Fuse, vehicle improvisado, cavernas. A platina/100% é maratona — o prazer é a invenção de meio de tarde.",
    whoItsFor:
      "Fãs de BOTW e gente que gosta de quebrar o jogo de propósito. Se você odiou durabilidade de arma, ainda tá aqui. Se você ama sandbox, é o DLC mental do primeiro.",
    communityTalks:
      "A casa discute Ultrahand, se o mapa cansa e as builds de veículo. Sem o que tem nas ilhas, sem o subterrâneo profundo, sem o trono.",
  },
  "portal-2": {
    premise:
      "Portal gun, ciência duvidosa e uma IA que te odeia com charme. Test chambers, gel, e a melhor co-op de puzzle que o gabinete conhece.",
    howYouPlay:
      "Puzzle de física em primeira pessoa. Solo é campanha de set piece; co-op é campanha à parte. Sem tiro de verdade. O humor carrega quando o cérebro trava.",
    whoItsFor:
      "Quem curte puzzle que 'clica' e humor ácido. Curto, impecável, dá pra zerar num fim de semana. Co-op vale um amigo paciente.",
    communityTalks:
      "A galera ainda cita as falas e discute se o co-op é melhor que o solo. Sem o que tem atrás das câmaras, sem o wheatley... espera, nem o nome direito. Joga.",
  },
  "sekiro-shadows-die-twice": {
    premise:
      "Shinobi no Japão senchi. Sem RPG de build pra esconder o erro. O parry é a religião: postura, deflect, o boss que só abre se você não piscar.",
    howYouPlay:
      "Ação precisa, salto, grapple, deathblow. Mortes ensinam o compasso. Sem summon clássico de Souls. Você ou aprende o ritmo, ou dropa — a casa avisa.",
    whoItsFor:
      "Quem quer skill pura e aceita apanhar. Se você amou Souls pela build, pode odiar. Se você ama duelo, é o teto da From.",
    communityTalks:
      "A galera discute se é o melhor combate da From e quem dropou no primeiro genichiro-sem-nomear. Sem o dragão, sem o ending, sem o que o lobo carrega.",
  },
  bloodborne: {
    premise:
      "Caçada gótica numa cidade que adoece de noite. Insight sobe, sanidade baixa. Você é caçador; a rua não é tutorial — é convite.",
    howYouPlay:
      "Ação agressiva: rally, saw, visceral. Escudo é piada. Exploração de atalho, insight, e um DLC que a casa trata como obrigatório se você achar.",
    whoItsFor:
      "Fãs de Souls que querem mais pressa e horror. Só no PlayStation / emulação da galera. A platina é ritual, não um fim de tarde.",
    communityTalks:
      "Obra-prima da casa. Discutem build de arcane, se o DLC é o auge, e a platina. Sem o que a lua faz, sem os deuses, sem o que você caça de verdade.",
  },
  "dark-souls-3": {
    premise:
      "O canto do cisne das chamas. Lordes, cinza, e um mapa que ainda é 'vá pra lá e apanhe'. Boss rush com alma de Souls clássico.",
    howYouPlay:
      "Souls tradicional: fogueira, atalho, build de arma. Mais linear que Elden, mais 'feira de chefes' que o 1. PvP ainda vive na comunidade.",
    whoItsFor:
      "Quem quer a From mais 'videogame de boss'. Bom ponto de entrada pra Souls. A platina pede NG+ e paciência de anel.",
    communityTalks:
      "Ainda o Souls mais jogado da galera. Discutem arma, DLC e se o 1 é 'melhor obra'. Sem o que a fogueira significa no fim, sem os lordes nomeados no plot.",
  },
  "lies-of-p": {
    premise:
      "Soulslike de Pinóquio sombrio numa cidade de mentira. Parry ou morre. A mentira é mecânica; o nariz é meme — o combate é sério.",
    howYouPlay:
      "Ação precisa, arma que desmonta (cabo + lâmina), fábula distorcida. Mais linear que Elden. Boss memorável, platina justa segundo a casa.",
    whoItsFor:
      "Quem curte Souls e quer algo que não seja From. Se você odeia parry, vai sofrer. Se você ama duelo de padrão, a casa respeita.",
    communityTalks:
      "A casa discute se 'passa de Sekiro', platina e o DLC. Sem o que a marionete descobre, sem o final das mentiras, sem quem puxa os fios.",
  },
  "doom-eternal": {
    premise:
      "Rip and tear. FPS que é ballet de munição: você voa, serra, troca de arma porque a munição acabou no propósito. O demo não te esconde — te empurra.",
    howYouPlay:
      "Arena, glory kill, resource da arena. Se você ficar parado, morre. Plataforma de demônio. A dificuldade justa é brutal se o cérebro entrar no ritmo.",
    whoItsFor:
      "Quem curte FPS de movimento e recusa camping. Se você quer campanha cinematográfica lenta, o 2016 é mais 'filme'. Eternal é o esporte.",
    communityTalks:
      "O combate mais viciado da casa. Discutem UN e se o DLC passa. Sem o lore da Slayer, sem o que o pai do... não. Só atira.",
  },
  "it-takes-two": {
    premise:
      "Co-op obrigatório: um casal em crise vira brinquedo. Cada fase é um gênero diferente. A platina é de dois — sem split screen friend, não rola o gabinete.",
    howYouPlay:
      "Ação-aventura em co-op local ou online. Puzzle que só fecha com os dois. Sem modo solo de verdade. Campanha de uma tarde longa / dois serões.",
    whoItsFor:
      "Casal, amigo, irmão. Se você joga só solo, pula. Se você quer um jogo que força conversar, é o mais honesto do hub.",
    communityTalks:
      "A galera recomenda jogar com alguém que você aguenta. Sem o plot da terapia, sem o que os bonecos descobrem no fim da casa.",
  },
  balatro: {
    premise:
      "Poker que virou roguelike. Você monta combo de carta + joker e diz 'só mais uma ânte'. Não é GTO. É vício honesto, sem microtransação.",
    howYouPlay:
      "Run de blinds, construir sinergia, quebrar o jogo de propósito. Cada joker muda a matemática. Morte rápida, restart instantâneo.",
    whoItsFor:
      "Quem curte deckbuilder e 'mais uma'. Curto na sessão, infinito no save. Cérebro de planilha opcional — dá pra ir no feeling.",
    communityTalks:
      "A casa discute seed, joker quebrado e se o gold stake é sadismo. Sem spoiler porque o spoiler é a sinergia que você descobre na mesa.",
  },
  "slay-the-spire": {
    premise:
      "O deckbuilder que definiu o gênero. Sobe a Spire, pega carta, morre, entende o porquê, sobe de novo. Três (quatro) personagens, infinito de seed.",
    howYouPlay:
      "Turno, energia, relic, ato. Cada escolha de carta é o run. Elites doem, bosses ensinam o deck. A subida é a sessão.",
    whoItsFor:
      "Quem ama 'mais uma run' com cérebro ligado. Se você odeia perder progresso, o unlock é lento e justo. Sem P2W, sem passe.",
    communityTalks:
      "A galera discute A20, personagem e se o Watcher é crime. Sem spoiler de evento raro que muda o ato — o prazer é achar na subida.",
  },
  undertale: {
    premise:
      "RPG onde não matar também é build. Humor, pixel, e uma regra da casa: joga cego. Combate de bullet-hell + conversa. Você decide o tom da jornada.",
    howYouPlay:
      "Exploração de RPG clássico, luta de dodge, e a opção de spare. Save existe; o jogo lembra mais do que você quer. Curto. Denso.",
    whoItsFor:
      "Quem topa pixel e texto com alma. Se você só quer grind e loot, não é aqui. Se você quer um game que conversa com o jeito que você joga, entra sem wiki.",
    communityTalks:
      "Não spoila. Nem rota, nem quem é quem, nem o que o save faz. A casa só diz: joga. Depois a gente discute se você foi legal.",
  },
  "genshin-impact": {
    premise:
      "Open world elemental grátis: voa, cozinha, escala. O mapa é o gancho. O banner é o gancho do caixa. Dá pra explorar de graça; o maxo mora no gacha.",
    howYouPlay:
      "Ação de elemento, co-op leve, daily, abyss. Exploração é o melhor; o combat endgame empurra personagem do banner. Pity existe. C6 é whale.",
    whoItsFor:
      "Quem topa live service e mapa lindo. F2P dá pra se divertir no overworld. Se você quer 'ter o elenco todo', o cartão chora. A casa avisa o gacha.",
    communityTalks:
      "A galera discute região nova, se o gacha tá pesado e se vale o tempo. Sem spoiler de lore de nação, de archon, de quem some no enredo.",
  },
  "path-of-exile": {
    premise:
      "ARPG free com árvore de passiva do tamanho de um tapete. Build de doido. O combate é justo; o inventário cobrado (stash) é o que a casa chama de P2W.",
    howYouPlay:
      "League, mapa, crafting obscuro. Curva cruel. Filtro de loot. Sem battle pass de poder clássico — o stash tab que dói no bolso e na qualidade de vida.",
    whoItsFor:
      "Nerd de build que aceita wiki aberta. Se você quer um Diablo mais casual, fuja. Se você ama quebrar o jogo no papel, é o teto. A casa marca P2W no selo.",
    communityTalks:
      "A galera discute league, stash e se 'é P2W de verdade'. O selo do hub não é meme. Sem spoiler de atlas endgame que muda toda season.",
  },
  "counter-strike-2": {
    premise:
      "O 5v5 tático que nunca sai da máquina. Dust, eco, clutch. Skin não dá headshot. A aim que dá.",
    howYouPlay:
      "Round, economia, utilitário. Premier/Faceit. Morte rápida, tilt mais rápido. Sem campanha. O jogo é a fila.",
    whoItsFor:
      "Quem curte FPS tático e aceita comunidade dura. Skill fala. Loja de visual. Não é P2W no spray — é tempo de tela.",
    communityTalks:
      "A casa discute ranking, smurf e skin cara. Sem 'lore'. O que se discute é o meta da smoke e se o Premier tá justo.",
  },
  hearthstone: {
    premise:
      "Cartas da Blizzard, arena, ranking e expansão no calendário. O lance é montar o baralho; o gacha é o pacote. Sem whale, o ladder sobe devagar.",
    howYouPlay:
      "Turno, mana, ranked. Modos rotativos. Expansão a cada poucos meses. F2P existe com paciência; o meta de treino cobra o conjunto novo.",
    whoItsFor:
      "Quem curte cardgame digital e aceita gacha de pacote. Se você odeia 'pay to keep up', o selo do hub é Gacha de propósito.",
    communityTalks:
      "A galera discute meta, arena e se a economia melhorou. Sem spoiler — o spoiler é o deck do mês. A casa avisa o caixa.",
  },
  "ghost-of-tsushima": {
    premise:
      "Samurai vs mongol. A ilha é um quadro; o vento mostra o caminho. Honra e stealth brigam na mesma cutscene de postura.",
    howYouPlay:
      "Mundo aberto de stance, ghost tools, haiku. Combate de duelo e acampamento. Sem microtransação. A platina é bonita e longa.",
    whoItsFor:
      "Quem curte samurai, foto mode e um open world que não grita ícone o tempo todo. Se você quer Souls, o combate é mais 'filme'. Ainda vale.",
    communityTalks:
      "A casa discute ghost vs honra, Iki Island e a platina. Sem o que acontece com o tio, sem o cerco, sem o fim da ilha.",
  },
  "spider-man-remastered": {
    premise:
      "Balanço, foto e combo no telhado de Nova York. Power fantasy limpa: você já é o herói, o jogo é o prazer de se mover.",
    howYouPlay:
      "Open world de traversal, combate de gadget, lado de bairro. Traversal é o gameplay. Missão principal é filme de herói bem feito.",
    whoItsFor:
      "Quem quer desligar e voar entre prédios. Fácil de entrar, platina gostosa. Sem loja no upgrade. A casa recomenda de boa.",
    communityTalks:
      "A galera discute se o 2 passa, NG+ e o photo mode. Sem o vilão da vez no plot, sem o que a tia... não. Só balança.",
  },
  returnal: {
    premise:
      "Roguelike sci-fi de 3ª: você cai num planeta que reseta, e cada morte ensina o bioma. Hipnótico. Sem loja no meio da run.",
    howYouPlay:
      "Tiro de 3ª, dodge, parasite, bioma. Run que mistura skill e um pouco de persistência entre ciclos. Difícil, justo se você lê o padrão.",
    whoItsFor:
      "Quem curte roguelike e horrores cósmicos. Se você odeia perder chão, o ciclo dói. Se você ama 'mais uma', é vício de elite.",
    communityTalks:
      "A casa discute se o 'plot' fecha e a platina cruel. Sem o que o planeta é, sem o loop narrativo, sem o que a astronauta encontra.",
  },
  "resident-evil-4-remake": {
    premise:
      "Survival horror de ação: vilarejo, laser, estoque da mala. O remake que a comunidade chama de aula. Leon, Spain, o pedido da filha do presidente — você já viu o poster.",
    howYouPlay:
      "Tiro em over-shoulder, faca, merchant, upgrade. Tensão de recurso no começo, ação no meio. Dificuldade que respeita o veterano.",
    whoItsFor:
      "Fãs do 2005 e gente que nunca jogou. Se você quer terror puro de esconderijo, o 2 Remake é mais 'horror'. O 4 é o equilíbrio.",
    communityTalks:
      "Aula de remake. Discutem Separate Ways, profissional e se passou o original. Sem o que tem na ilha, sem o parasita, sem o fim do castelo.",
  },
  "black-myth-wukong": {
    premise:
      "Soulslike de Wukong: bosses, mito chinês, espetáculo de transformação. Você apanha de chefão, aprende o padrão, fica lindo na screenshot.",
    howYouPlay:
      "Ação de báculo, transformação, árvore de talento. Mais linear que Elden. Boss rush com exploração curta entre os espetáculos.",
    whoItsFor:
      "Quem curte mitologia, boss fight e gráfico que derrete GPU. Se você quer RPG de conversa, não é aqui. Se você quer 'mais um chefão', entra.",
    communityTalks:
      "A comunidade ainda discute o fim — então a ficha não conta. Discutem dificuldade, PC port e se o combat segura 40h. Sem o destinos dos reis macacos.",
  },
  "expedition-33": {
    premise:
      "RPG por turnos com cara francesa e combate no ritmo. A expedição sai sabendo que o relógio não é amigo. Estilo no talo; a casa ainda tá eufórica.",
    howYouPlay:
      "Turno com QTE de defesa/ataque, exploração de bioma, party. Visual de pintura. Combate que pede atenção, não só menu.",
    whoItsFor:
      "Quem curte JRPG mas quer algo que não seja Japão. Surpresa da casa. Se você odeia QTE, testa antes. Se você ama turn-based com swing, entra.",
    communityTalks:
      "Quem jogou não cala a boca. Discutem acto, trilha e se 'é o GOTY'. Sem o que a expedição encontra, sem o número, sem o fim da pintura.",
  },
  "mass-effect-legendary": {
    premise:
      "A trilogia toda num pacote: squad, nave, paragon/renegade. Você monta a família da Normandy e carrega ela por três jogos. O fim é eterno na discussão — a jornada que importa.",
    howYouPlay:
      "RPG de ação de 3ª, diálogo de roda, squaddie. 1 é mais velho, 2 é o auge de missão, 3 é guerra. Legendary alisa o 1.",
    whoItsFor:
      "Quem topa 60–90h de sci-fi de esquadrão. Se você só quer o 2, ainda vale o pacote. A casa avisa: a jornada > o slide final.",
    communityTalks:
      "A jornada importa mais que o final — e a gente para aqui. Discutem romance, squad e se o 3 'salvou'. Sem o primordial, sem o destino da galáxia.",
  },
  starfield: {
    premise:
      "RPG espacial da Bethesda: aterrissa, loot, fala, discute o vazio. Mil planetas. Nem todo planeta merece o pouso. A Constellation te puxa pra um mistério de artefato.",
    howYouPlay:
      "Bethesda clássico no espaço: skill, outpost, nave, dialogue tree. Fast travel pesado. O vazio entre POIs é o debate da casa.",
    whoItsFor:
      "Fã de Bethesda que aceita 'mais do mesmo' em órbita. Divisivo. Sem loja; o pacing que polariza. Se você quer No Man's Sky de exploração, calibra a expectativa.",
    communityTalks:
      "Divisivo de propósito. A galera discute copy-paste de planeta, se o DLC salva, e o NG+. Sem o que o artefato é, sem o Unity, sem o que tem depois da linha.",
  },
  "hollow-knight-silksong": {
    premise:
      "Hornet, reino novo, agulha. Mesma religião de mapa e precisão, outro bicho no controle. A casa espera — se o gabinete tiver o jogo, o spoiler continua proibido.",
    howYouPlay:
      "Metroidvania de precisão, agora com kit da Hornet. Exploração, boss, backtrack. A platina, se existir no seu save, é peregrinação de novo.",
    whoItsFor:
      "Fãs de Hallownest e gente que ama mapa que clica. Se você dropou HK na dificuldade, calibra. Se você ama o primeiro, é o gabinete obrigatório.",
    communityTalks:
      "A casa discute se 'passa do primeiro' e a dificuldade. Sem o que o reino novo esconde — mapa é mistério, não wiki.",
  },
};

const GENRE_PLAY: { test: (g: string[]) => boolean; text: string }[] = [
  {
    test: (g) => g.some((x) => x.includes("soulslike") || x.includes("souls")),
    text: "Combate de stamina e padrão de boss. Morre, lê o hit, volta. Exploração ensina mais que o menu de missão.",
  },
  {
    test: (g) => g.some((x) => x.includes("roguelike") || x.includes("roguelite")),
    text: "Run, morre, sobe mais um andar. Cada morte é tutorial. O loop curto é o ponto — não um save de 80h linear.",
  },
  {
    test: (g) => g.some((x) => x.includes("metroid")),
    text: "Mapa trancado que abre com habilidade nova. Você volta num canto que era parede. Backtrack é o design, não preguiça.",
  },
  {
    test: (g) => g.some((x) => x.includes("horror") || x.includes("survival")),
    text: "Recurso curto, tensão, flashlight. Correr também é gameplay. O susto mora no áudio e no estoque, não só no jumpscare.",
  },
  {
    test: (g) => g.some((x) => x.includes("fps") || x.includes("tiro")),
    text: "Aim, recuo, o clutch. Campanha ou ranked — skill na mão. A loja, quando existe, a casa já selou na capa.",
  },
  {
    test: (g) =>
      g.some((x) => x.includes("moba") || x.includes("moba") || x === "moba"),
    text: "Lane, objetivo, o chat que você muta. Partida de 30–50 min. O poder não se compra no round — a casa marca o selo se for diferente.",
  },
  {
    test: (g) => g.some((x) => x.includes("battle royale")),
    text: "Cai, saqueia, fecha o círculo. Uma partida é a sessão. Skin é ego; a vitória ainda é posicionamento e aim.",
  },
  {
    test: (g) => g.some((x) => x.includes("plataforma") || x.includes("precisão")),
    text: "Pulo, dash, death rápido, checkpoint. O nível é o professor. Colecionável é extra de masoquista, não o caminho crítico.",
  },
  {
    test: (g) => g.some((x) => x.includes("estratégia") || x.includes("4x") || x.includes("cartas")),
    text: "Turno ou pausa tática. Você lê o campo, gasta o recurso, reza o RNG. A sessão pode ser 'mais um turno' até de madrugada.",
  },
  {
    test: (g) => g.some((x) => x.includes("rpg")),
    text: "Build, diálogo, mapa. Você escolhe o ritmo — e as merdas que combina na ficha. Side content costuma ser o verdadeiro jogo.",
  },
  {
    test: (g) => g.some((x) => x.includes("luta") || x.includes("fighting")),
    text: "Round, execution, ranked. Lab é o endgame. A loja, se tiver, é visual — no round o combo você que apanha pra aprender.",
  },
  {
    test: (g) => g.some((x) => x.includes("corrida") || x.includes("racing")),
    text: "Curva, setup, o ghost. Festival ou simulador — a sessão é a volta. Paint job não ganha corrida.",
  },
];

function normalizeGenres(genres: string[]) {
  return genres.map((genre) => genre.toLowerCase());
}

function inferHowYouPlay(genres: string[], monetization: MonetizationKind) {
  const g = normalizeGenres(genres);
  const match = GENRE_PLAY.find((row) => row.test(g));
  const base =
    match?.text ??
    "Você entra, aprende o loop, e decide se vale o tempo. Sem spoiler de missão — só o que o gênero promete na caixa.";

  if (monetization === "gacha") {
    return `${base} Banner e pity andam no fundo: dá pra se divertir no mapa, o maxo cobra no elenco.`;
  }
  if (monetization === "pay_to_win") {
    return `${base} A casa já selou P2W: quem paga avança. Entra sabendo.`;
  }
  if (monetization === "cosmetics") {
    return `${base} Live service de visual: a loja não deveria comprar o round.`;
  }
  return base;
}

function inferWhoItsFor(genres: string[], monetization: MonetizationKind) {
  const g = normalizeGenres(genres);
  const bits: string[] = [];

  if (g.some((x) => x.includes("soulslike") || x.includes("souls"))) {
    bits.push("Quem aceita apanhar e aprender no hit.");
  } else if (g.some((x) => x.includes("indie"))) {
    bits.push("Quem curte gabinete menor com ideia clara, sem AAA inchado.");
  } else if (g.some((x) => x.includes("rpg"))) {
    bits.push("Quem topa ler, escolher e viver num save longo.");
  } else if (g.some((x) => x.includes("horror"))) {
    bits.push("Quem quer tensão, não só tiro. Fone ajuda.");
  } else {
    bits.push("Quem curte o gênero na caixa e aceita o ritmo que o game pede.");
  }

  if (monetization === "gacha" || monetization === "pay_to_win") {
    bits.push("Entra com o selo da capa na cabeça — a casa não esconde o caixa.");
  } else if (monetization === "fair") {
    bits.push("Jogo honesto: você paga o game, não o poder.");
  }

  return bits.join(" ");
}

function inferPremise(game: GameHint) {
  const pitch = game.pitch?.trim();
  const syn = game.synopsis.trim();
  if (pitch && syn && !syn.startsWith(pitch) && pitch.length < 160) {
    return `${pitch} ${syn}`;
  }
  if (syn.length > 40) return syn;
  if (pitch) return pitch;
  return `${game.title} — a ficha ainda tá magra, mas o gabinete tá no catálogo.`;
}

function inferCommunityTalks(
  game: GameHint,
): string {
  const take = game.communityTake?.trim();
  const extra =
    "A ficha não conta plot: sem twist, sem ending, sem personagem que aparece tarde.";
  if (take) return `${take} ${extra}`;
  return extra;
}

export function getSpoilerFreeSummary(game: GameHint): SpoilerFreeSummary {
  const overlay = SUMMARIES_BY_SLUG[game.slug];
  if (overlay) return overlay;

  return {
    premise: inferPremise(game),
    howYouPlay: inferHowYouPlay(game.genres, game.monetization),
    whoItsFor: inferWhoItsFor(game.genres, game.monetization),
    communityTalks: game.communityTake
      ? `${game.communityTake} Sem spoiler de história — só o veredito da casa.`
      : inferCommunityTalks(game),
  };
}

export function formatLongPitch(summary: SpoilerFreeSummary) {
  return [
    summary.premise,
    summary.howYouPlay,
    summary.whoItsFor,
    summary.communityTalks,
  ].join("\n\n");
}
