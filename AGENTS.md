<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Hub-games — agentes Cursor

Objetivo: manter o cabinet **legal e confortável** — gamer BR que volta do trampo, atualiza o save e sente orgulho, sem dashboard corporativo.

## Quando usar o quê

| Precisa de… | Use |
|-------------|-----|
| Regra sempre ligada (UX player) | `.cursor/rules/hub-player.mdc` |
| Tokens/UI ao editar TSX/CSS | `.cursor/rules/arcade-ui.mdc` |
| Workflow sob demanda | Skills em `.cursor/skills/` |
| Especialista com contexto isolado | Subagentes em `.cursor/agents/` |

## Skills

| Skill | Quando |
|-------|--------|
| `player-lens` | Desenhar/revisar hub, biblioteca, progresso |
| `arcade-visual` | Auth, shell, motion, glow, scanline |
| `progress-rituals` | Status, platina, celebração |
| `companion-voice` | Prompts e tom do chat |
| `comfort-atmosphere` | Respiro, hierarquia, anti-cansaço visual |

## Subagentes

Delegue com o Task tool / menção ao agente quando a tarefa for revisão longa ou implementação focada:

| Agente | Papel |
|--------|--------|
| `hub-comfort` | Curadoria de conforto (readonly) — veredito + atritos |
| `arcade-stylist` | Identidade visual arcade e tokens |
| `player-ritual` | Ritual de progresso e "continuar jogando" |
| `companion-writer` | Copy e prompts do companheiro (Indica / Coach / Platina) |

## Orquestração sugerida

1. **Nova tela / layout** → `comfort-atmosphere` + `hub-comfort` (revisão) → `arcade-stylist` se envolver visual.
2. **Status / biblioteca** → `progress-rituals` + `player-ritual`.
3. **Chat / personas** → `companion-voice` + `companion-writer`.
4. Antes de merge de UI: passar `hub-comfort` e checar `prefers-reduced-motion`.

## Norte do produto (não negociar)

- PT-BR acolhedor; "continuar jogando" sempre visível no hub.
- Ritual em 1 toque; platinou implica zerado.
- Capas grandes; nota comunidade + pessoal lado a lado.
- Conforto visual > densidade de informação.
