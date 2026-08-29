# Hub-games — O hub arcade do gamer

Biblioteca de jogos, progresso (zerou/platinou), notas da comunidade e companheiro IA — com vibe arcade.

## Stack

- Next.js 16 App Router + TypeScript + Tailwind + shadcn/ui
- Clerk (auth) + Neon Postgres (Drizzle)
- Vercel AI SDK + AI Gateway (companheiro)
- RAWG API (busca opcional)

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Provisionar integrações (Vercel Marketplace)

```bash
npx vercel link
npx vercel integration add clerk --yes
npx vercel integration add neon --yes
npx vercel env pull .env.local --yes
```

Copie `.env.example` → `.env.local` se necessário. Opcional: `RAWG_API_KEY` de [rawg.io/apidocs](https://rawg.io/apidocs).

### 3. Banco de dados

```bash
npm run db:push
npm run db:seed
```

### 4. Dev

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Rotas

| Rota | Descrição |
|------|-----------|
| `/sign-in` | Login arcade (insert coin) |
| `/sign-up` | Cadastro NEW GAME |
| `/hub` | Home — continuar jogando, stats, companheiro |
| `/library` | Catálogo com busca e filtros |
| `/library/[slug]` | Ficha do jogo + ritual de progresso |

## Agentes Cursor

Veja [AGENTS.md](./AGENTS.md) e `.cursor/skills/` para skills de player-lens, arcade-visual, progress-rituals e companion-voice.
