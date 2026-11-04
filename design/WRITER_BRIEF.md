# Chapter writer brief

You are writing one chapter of **BarbarAIn**, a five-chapter sword-and-sorcery text adventure RPG (desktop and phone, web). Four other writers are writing the other chapters at the same time. The engine is finished and owned by the lead.

## Read first (in this order)

1. `design/GAME_DESIGN.md` — the whole design. Your chapter's story section, its **Puzzle chains** table, its **placed fights** list, the **Manifest** (ids, room table, NPCs, enemies table), **Balance**, the family weakness table, the endings and side quests that touch your chapter. These are binding.
2. `design/CONTENT_SCHEMA.md` — the data format: rooms, things, verbs, effects, conditions, dialogue, fights, triggers, items, quests, hints, `data-act` ids, solutions.
3. `game/src/content/manifest.js` — `ROOM` (spread it into every room: `'c1-gate': { ...ROOM['c1-gate'], desc, exits, things, ... }`), `NPCS`, `ASSETS`, `ITEMS`, `QUESTS`, `CHAPTER_STARTS`.
4. `game/src/data/` — `balance.js` (`enemyStats`), `party-data.js` (members, skills), `core-items.js` (all gear and consumables: use these ids in shops and loot), `core-enemies.js` (shared enemies).
5. Skim the engine if you need to know exactly how something behaves: `game/src/world.js` (effects runner, rooms, verbs, dialogue), `game/src/battle.js` (fights, triggers).

## What you write

- **One file: `game/src/content/ch<N>.js`** (`export default { id, num, title, card, start, startDo, rooms, npcs, dialogues, items, enemies, shops, quests, hints, combine, scripts, partyUse }`), exactly per the schema.
- **Solution files** for your chapter in `design/solutions/` (names in the schema / your task).
- You may NOT edit any other file. If the engine lacks something you need, use a chapter `script` (`scripts: { name: async (g, args) => {...} }`, called with `{ call: 'name' }`), or describe the gap in your final report. If you find an engine bug, work around it and report it precisely (file, line, repro).
- Ids: rooms are fixed by the Manifest. Everything else you invent is prefixed `c<N>-` unless the Manifest already names it. Never invent asset ids (pictures, portraits, sprites, icons, music, sfx, amb) — use only `ASSETS` in manifest.js. Chapter-only key items use icons from `ASSETS.icons` (tints allowed: `'sausage@green'`).
- Enemies: `{ ...enemyStats(level, role), name, sprite, tint, size, weak, resist, immune, desc, skills, drops, attackDmg }`, level/role from the Manifest enemy table, weaknesses from the family table. Story items dropped by enemies use `chance: 1`. Junk drops use shared junk ids from core-items.js.

## Writing

- The game's soul is the writing. Vivid, pulpy, Howard-flavoured prose in second person, present tense ("You shoulder through the bead curtain…"). Short paragraphs (under ~70 words). Humour in refusals and banter. No HTML; `*emphasis*` and `\n\n` only.
- Characters behave in character (see The party and NPC notes): Brannoc terse, grim, wry, swears by Crom, distrusts sorcery, generous to the poor, never begs. Shevra mocking and quick ("the Bear"). Ptahk theatrical grumbler (and secretly Thoth-Seketh: plant the design's clues, subtly). Ilsa fierce and proud, laughs in storms. Nine literal and gentle ("Original Human Brannoc"). Zelara calm and stubborn.
- **Lots to explore:** every room has 3–6 things worth looking at, each with its own Look text; people have real dialogue trees (2–5 topics each, with `once` choices for one-off gifts or hints); companions banter on first visits (`first: [{ line: ['shevra', '…'] }]`). Wrong-item uses on important things get funny custom refusals (`'*': '…'`).
- Every puzzle step needs its clue **in the room where it's solved**, and a **hint** (`hints`: nudge + answer) active while that step is open.
- No dead ends: an item consumed by a required step must have a repeatable source (shop, a thing that gives another) or exactly one consumer. Never let a required item be sold (key items can't be) or lost.
- Story and boss fights: give them an `id`, and `noFlee: true` (bosses are automatically no-flee). Clever puzzle solutions that skip a fight give `{ xp: { as: [...] } }`.
- Use `once` blocks for one-time rewards. Use `{ quest: ['ch<N>-main', k] }` to keep the Journal's objective current at every step.
- Pictures: rooms use the Manifest picture; `scene` cards (`{ scene: { img, text } }`) for big moments (twists, boss intros, chapter end), using only picture ids from ASSETS.bg.
- Music: rooms carry it from the Manifest; bosses use `music: 'boss'` (or `'boss-dragon'`). Use sfx ids from ASSETS.sfx for door creaks, puzzle stings (`sting-solved`), rumbles, gate-open, heartbeat etc.

## Testing your chapter (required)

The game is served at **http://127.0.0.1:8123/** (already running; don't start or stop servers). Work from `/workspaces/gg-test3` and use your own playwright session name (`-s=ch<N>`):

```bash
cd /workspaces/gg-test3
node tools/lint-content.mjs                  # must report 0 errors for your chapter (warnings: fix or justify)
playwright-cli -s=ch3 open http://127.0.0.1:8123/
playwright-cli -s=ch3 resize 1280 720
tools/pw.sh ch3 title:start                  # unlock audio once per session
tools/replay.sh ch3 design/solutions/ch3-free.json    # replays your solution with real clicks; prints PASS/FAIL
playwright-cli -s=ch3 eval "JSON.stringify(window.__game.state())"
playwright-cli -s=ch3 eval "JSON.stringify(window.__game.acts())"     # the clickable data-act ids right now
playwright-cli -s=ch3 console error
playwright-cli -s=ch3 screenshot --filename=design/screenshots/ch3-<room>.png
```

- `tools/replay.sh` starts your chapter from its Manifest snapshot (`__game.chapter(n, branch, seed)`), clicks each step by `data-act`, auto-clicks `continue`, plays battles on Auto and retries defeats. If it reports STUCK, it prints the visible ids: fix your content or the solution.
- `tools/pw.sh <session> act1 act2 …` clicks a few ids and prints a state summary (handy while exploring).
- After editing your chapter file, `playwright-cli -s=ch<N> reload` and `tools/pw.sh ch<N> title:start` before replaying (ES modules are re-fetched on reload).
- Battle balance: if your solution needs more than one retry for an ordinary fight, or a boss can't be won on Auto at the snapshot level with the gear available, adjust enemy levels/groups (within the Manifest's spirit) and say so in your report.
- Play some of it by hand too (look at things, talk to everyone, try wrong items) and read the log: does it read well? Take 2–3 screenshots of your chapter's key moments and look at them.

## Report (your final message)

- Rooms written, things/dialogues count, fights placed (with total battle XP and puzzle XP vs the band).
- Each solution file: PASS/FAIL output.
- Lint result.
- Engine bugs or gaps found (precise), and anything in the design you changed or couldn't do.
