---
name: progress-rituals
description: Estados da biblioteca e celebração de progresso no Hub-games. Use ao implementar library_entries, botões de status e feedback de platina.
---

# Progress Rituals

## Status

`wishlist` | `playing` | `beaten` | `platinum` | `dropped`

## Regras

- `platinum` → auto-set `beatenAt` e `platinumAt`.
- Botões visuais distintos por status; platina com badge dourado.
- Celebração breve (confetti/glow) ao marcar zerou ou platinou.

## Campos opcionais

- Nota pessoal 1–10, horas, nota curta — secundários ao ritual principal.
