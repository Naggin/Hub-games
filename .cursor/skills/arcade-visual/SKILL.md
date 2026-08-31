---
name: arcade-visual
description: Guia visual arcade para Hub-games — login attract-mode, glow, scanline, motion fluido. Use em telas de auth, hub shell e componentes visuais.
---

# Arcade Visual

## Tokens

- `--void`: #171428 (piso do cabinet à noite — indigo, não caverna)
- `--background` / `--card`: #171428 / #221e3a
- `--neon-cyan`: #00f5ff
- `--neon-magenta`: #ff00aa
- `--neon-gold`: #ffd700

## Surfaces

- Dark arcade, not light mode: piso indigo com wash neon (ciano/magenta/ouro).
- Billboard e hero da ficha: overlay `from-void/88 via-void/40 to-transparent` — capa visível, texto ainda legível.
- Cards, header e sheets usam `--card` / `--secondary`, não preto puro.

- Grid/partículas de fundo; marquee "HUB-GAMES".
- Insert coin (clique ou Espaço) antes do form.
- Scanline CSS opacity ≤0.04.

## Motion

- Use `motion` para transições de página e hover de cards.
- `prefers-reduced-motion: reduce` → desabilitar animações não essenciais.
