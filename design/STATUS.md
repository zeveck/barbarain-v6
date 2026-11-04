# BarbarAIn

## Requests

1. (initial, exactly as typed)

```
We want to make a modern-leaning text adventure. It should describe scenes and let you explore dungeons and fight monsters and gain levels and HP and MP and magic. They should use a range of weapons.
  ▎ Typical RPG elements. It should have relatively simple 16-bit style graphics depicting environments and towns people and the hero's party and enemies. It should have enough interface to be playable on
  ▎ desktop and mobile. It is called BarbarAIn. It should be heavily based on the world of Conan the Barbarian as depicted in the books and stories by author Robert E. Howard. It should have characters evoking
  ▎ those from the books and movies and they should behave "in character" when present. However, we want this to be a new story, and it should have at least three major twists and surprises, and they should
  ▎ make sense in the world. Anything goes -- robots from the future? time travel? pirates? trans-dimensional dragons? a heist? Sure, if you can make it fit into the world. There should be light adventure game
  ▎ style puzzles a la Secret of Monkey Island. It should have items and armor and weapons with a good quality of life system for managing inventory. It should have more than one ending -- say three -- and at
  ▎ least one of them should only open up because of a choice you made back in the middle of the story, so what you decide actually matters. There should also be a few optional side quests off the main path,
  ▎ maybe three, and one of them should be an arena in Shadizar where you can fight your way up. It should be a big game -- a couple of hours, five or so chapters, with lots to explore. Good luck!
```

## Settings

- Platform: both (desktop + mobile)
- Target: web
- Scope: large (five chapters, a couple of hours, requested explicitly)
- Budget: $20
- Rounds: 2
- 3D: no
- Folder: /workspaces/gg-test3 (was empty)
- Credit: Rich Conlan (from GAMEGEN_CREDIT; confirmed when publishing)
- ElevenLabs tier: paid (item-get generated at mp3_44100_128). Note: a 429 said 2 concurrent requests (the free-tier limit), so the credits mention ElevenLabs anyway.
- Available: imagegen2 (OpenAI ok), nanogen (Gemini ok), anim8gen, audiogen (ElevenLabs ok, restricted key), playwright-cli ok, Pillow installed this run

## Phases

- [x] 1 Brief — design/BRIEF.md written
- [x] 2 Design — design/GAME_DESIGN.md (large, 5 chapters)
- [x] 3 Design review — 2 rounds (53 findings), converged; see REVIEW_LOG.md
- [x] 4 Assets — all made: 63 scenes, 26 portraits, 35 sprites, 54 icons, 12 music, 36 sfx; ≈$15.27 of $20 (see ASSETS.md)
- [x] 5 Build — all 5 chapters + engine done; 13 solutions + a full New Game→Ending C run pass
- [x] 6 Play-test — all solutions PASS; full-game run PASS; menus scanned at desktop/phone; first-load filmstrip fixed (title appears once); layouts at 1280×720, 800×600, 852×393, iPhone 15
- [x] 7 Final review — round 1: playtester (10) + bug hunter (10, 3 must-fix); round 2 bug hunter verified fixes, 7 smaller issues fixed. Content fixes in ch1/ch3/ch5.
- [x] 8 Polish — 12 findings (pixel-font ligature glyphs, no-return card, battle label/queue/party strip on phones, room-heading anchoring, landscape cards, naming consistency, desktop party compacting) fixed; all 14 replays incl. full New Game→Ending C PASS; offline OK
- [x] 9 Wrap up — social card, README + screenshots, Pages workflow, served at http://localhost:8000

## Notes
- imagegen2 medium 1024² measured ≈ 440 output tokens ≈ $0.013 (cheaper than the estimate).
- Sprites use a smooth LANCZOS downscale + slight sharpen (pixelize default); scenes/portraits use 2×-then-nearest.
- Palette extended with skin midtones (51 colours).

## Published
- https://barbarainv6.synapticnoise.com (repo zeveck/barbarain-v6, made public), gallery card "BarbarAIn (v6)" on synapticnoise.com, kept alongside the original BarbarAIn for comparison.
