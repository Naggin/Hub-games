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

O Hub-games traz um kit para deixar o cabinet **legal e confortável** — ver [AGENTS.md](./AGENTS.md).

**Skills** (`.cursor/skills/`): `player-lens`, `arcade-visual`, `progress-rituals`, `companion-voice`, `comfort-atmosphere`.

**Subagentes** (`.cursor/agents/`): `hub-comfort` (curadoria), `arcade-stylist` (visual), `player-ritual` (progresso), `companion-writer` (tom do chat).

Peça no Agent, por exemplo: *"roda o hub-comfort nessa tela"* ou *"usa o arcade-stylist no login"*.
