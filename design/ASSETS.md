# BarbarAIn — asset ledger

Prices looked up 2026-11-03 (same statement as GAME_DESIGN.md → Budget estimate):
- imagegen2 (gpt-image-2.5-flare) reports tokens, not prices. Third-party summaries of OpenAI's table (live page not confirmed) give ≈ $0.006 low, ≈ $0.053 medium, ≈ $0.21 high per 1024² image. With reference-image input tokens and rounding up, the **budget uses $0.03 (low) and $0.06 (medium)**; after the first three images, recompute from the reported usage and record the actual cost per row here.
- nanogen flash 1K: $0.034–0.067 per image (skill's own table is inconsistent; use the higher number).
- audiogen: music ≈ $0.30/min, sfx ≈ $0.12 each.

| ID | File | Tool | Prompt (short) | Tries | Face at (portraits) | Est. cost |
|---|---|---|---|---|---|---|

Running total: $0.00

## Ledger (as made)

| Group | Files | Tool | Generations | Est. cost | Notes |
|---|---|---|---|---|---|
| Style anchor (Brannoc portrait) | portraits/brannoc.png (+face), style-anchor.png | imagegen2 medium | 1 | $0.02 | full-res kept in .gamegen/anchors |
| Enemy anchor (cultist) | enemies/cultist.png, anchor-enemy.png | imagegen2 medium 1024×1536 | 1 | $0.02 | |
| Scene anchor | bg/bg-street.png | nanogen flash 1K | 1 | $0.07 | |
| Portraits | 25 in portraits/ (+5 party faces) | imagegen2 low/medium, anchor ref | 27 | $0.47 | doru, kesh retried once |
| ygg-sothar portrait | portraits/ygg-sothar.png | code (crop of dragon-final-head) | 0 | $0 | |
| Enemy sprites | 34 in enemies/ | imagegen2 low/medium, enemy anchor ref | 38 | $0.80 | iron-husk, dragon head, final coil retried |
| Starheart + icon sheets | icons/starheart.png + 53 icons | imagegen2 medium | 4 | $0.09 | sheet 1 retried (fixed-grid cut, checked) |
| App icons | favicon, apple-touch, 192, 512, maskable | code (from starheart) | 0 | $0 | |
| Scenes, key art, statue set | 62 in bg/ | nanogen flash 1K, scene anchor ref | 74 | $4.96 | storm, dragon-heart, tower-wall, jail, ship-deck (text painted out), ending-a, ending-c, statue-worn, statue-two retried |
| Music | 12 in audio/music/ | audiogen music 60–75 s | 12 | $3.68 | fade tails trimmed at frame boundaries for looping |
| SFX, stings, ambience | 36 in audio/sfx/ | audiogen sfx | 43 | $5.16 | 6 retries; quiet files gain-boosted |

**Running total: ≈ $15.27 of $20** (80% mark $16 not reached).
