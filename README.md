# Hub-games — O arcade do nerd gamer

Vitrine estilo Netflix com alma de fliperama: capa grande, o que o jogo é, o que a galera fala e se é pay to win — tudo na hora.

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
| `/hub` | Vitrine + catálogo — billboard, continuar, busca/filtros e selo P2W |
| `/hub?q=` | Deep-link de busca no cabinet |
| `/library` | Redireciona para `/hub` (query string preservada) |
| `/library/[slug]` | Ficha do cabinet: proposta, comunidade, P2W e ritual |
| `/perfil` | Sala de troféus do player |

## Agentes Cursor

Veja [AGENTS.md](./AGENTS.md) e `.cursor/skills/` para skills de player-lens, arcade-visual, progress-rituals e companion-voice.
