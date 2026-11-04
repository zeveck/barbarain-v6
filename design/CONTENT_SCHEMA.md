# BarbarAIn content schema

All story content is plain data in ES modules under `game/src/content/`. Each chapter is one file (`ch1.js` … `ch5.js`) that `export default` an object. The engine merges every chapter's registries (rooms, dialogues, items, enemies, npcs, shops, quests, scripts) into global ones, so **ids must be unique across all chapters**.

## Ids and the manifest

- `game/src/content/manifest.js` (written by the lead from GAME_DESIGN.md → Manifest) exports every id that crosses a chapter boundary: cross-chapter items, flags, quests, NPCs and portraits, the room table, enemy ids, asset ids and the chapter-start snapshots. **Use only manifest ids for anything another chapter sets or reads.**
- Every other id you invent is prefixed with your chapter: rooms `c1-…`, flags `c1-…`, chapter-only items/dialogues/enemies/shops/scripts `c1-…` unless the Manifest already names them (e.g. Ch I's `rope`, `meat-hook`).
- Core items (all gear, consumables, junk), shared enemies, party members and skills live in `game/src/data/` (lead). Chapters may `import { enemyStats } from '../data/balance.js'`.
- Asset ids (pictures, portraits, sprites, icons, music, sfx, ambience) come only from GAME_DESIGN.md's Asset list. Never invent one; `tools/lint-content.mjs` rejects unknown ids.

```js
import { enemyStats } from '../data/balance.js';
export default {
  id: 'ch1',                     // 'ch1'..'ch5'
  num: 1,
  title: 'The City of Thieves',
  card: { img: 'bg-street', text: 'One line under the chapter title.' },
  start: 'c1-gate',              // room id where the chapter begins
  prologue: { img: 'bg-prologue', music: 'title', text: ['…', '…'] },  // ch1 only: shown on New Game before the chapter card
  startDo: [ /* effects run once when the chapter starts, after the card */ ],
  rooms: { /* id: Room */ },
  npcs: { /* id: { name, portrait } */ },
  dialogues: { /* id: Dialogue */ },
  items: { /* id: Item */ },      // chapter-only items (mostly key items)
  enemies: { /* id: Enemy */ },   // chapter-only enemies
  shops: { /* id: Shop */ },
  quests: { /* id: Quest */ },
  hints: [ /* Hint */ ],
  combine: [ /* Recipe */ ],
  scripts: { /* name: async (g, args) => {} */ },
};
```

## Text

- Prose is plain strings. Use `\n\n` for paragraph breaks. Use `*word*` for emphasis (rendered italic). No HTML.
- `{gold}` in any text is replaced by the current gold; `{hero}` by "Brannoc".
- Keep each paragraph under ~70 words; the log is read on phones.
- Write in a pulpy, vivid Howard-inspired voice. Second person for narration ("You push through the bead curtain."), present tense. Characters speak in character (see the bible in GAME_DESIGN.md). Humor is welcome, especially in puzzle refusals.
- Every puzzle step needs its clue **in the room where it's solved** (room text, a Look, or a companion line). See GAME_DESIGN.md → Puzzle chains for your chapter's table; it is binding.

## Conditions (`if` strings)

A condition is a string: OR-groups separated by `|`, each an AND of atoms separated by `&`. Whitespace ignored. `!` negates an atom.

| Atom | True when |
|---|---|
| `flag:x` | flag x is set |
| `item:x` | the bag holds at least one x (also `item:x>=3`) |
| `gold>=N` (also `>`, `<`, `<=`, `==`) | gold compared to N |
| `level>=N` | Brannoc's level |
| `party:x` | member x is in the party |
| `quest:x>=N` (any comparison) | quest stage (0 if never started) |
| `var:x>=N` (any comparison) | a numeric variable |
| `visited:room` | the room has been entered (its `first` effects finished) |
| `won:fightId` | that fight has been won |
| `once:id` | that `once` block has completed |
| `chapter>=N` | current chapter number |
| `easy` | easy mode is on |
| `true` / `false` | constants |

A condition can also be a JS function `(g) => boolean` (avoid: lint can't check it). An empty or missing condition is true.

## Effects

An effect list is an array of objects, run in order; each object has one main key. Text effects add to the log. Effects that need the player (dialogue, fight, choice, scene, pause, confirm, shop) wait for them.

| Effect | Meaning |
|---|---|
| `{ say: 'text' }` | narration paragraph |
| `{ line: ['who', 'text'] }` | a spoken line in the log with the speaker's name and small portrait. `who` = party member id or npc id |
| `{ give: 'itemId', n: 1, quiet: false }` | add item (shows "Received: X") |
| `{ take: 'itemId', n: 1, quiet: false }` | remove item (key items: "X is gone" line unless quiet) |
| `{ gold: 50 }` | add (or subtract with negative) gold |
| `{ set: 'flag' }` / `{ clear: 'flag' }` | flags |
| `{ var: ['name', 1] }` | add to a numeric var; `{ setvar: ['name', 3] }` sets it |
| `{ xp: 40 }` | XP to the party (level-ups shown) |
| `{ xp: { as: ['tower-hound', 'tower-hound'] } }` | **clever solution**: XP equal to that fight's enemies, toast "Clever! +N XP" |
| `{ fight: Fight }` | start a battle (see below). Loss shows Game Over unless `lose` is given |
| `{ goto: 'roomId' }` | move to a room (autosave, then its enter/first effects). Must be the last effect in a list |
| `{ talk: 'dialogueId' }` | run a dialogue |
| `{ join: 'memberId', level: 6 }` | member joins at `max(level, Brannoc's level)` (equipment from party data). `quiet` option |
| `{ leave: 'memberId' }` | member leaves (their equipment goes to the bag) |
| `{ chapter: 'ch2' }` | end the chapter: chapter card, then the new chapter's start room. Last effect |
| `{ quest: ['questId', 2] }` | set a quest's stage (shows "Quest updated"/"Quest complete") |
| `{ shop: 'shopId' }` | open a shop |
| `{ inn: 20, text: '...' }` | offer rest for gold (0 = free): full HP/MP, autosave |
| `{ heal: true }` | full HP/MP for the party, revive the fallen |
| `{ scene: { img: 'bg-id', text: 'caption', portrait: 'id' } }` | full illustration card with text and a Continue button (`img` may carry a picture tint, be a statue close-up, or `starheart`: the 64×64 sprite `assets/sprites/starheart.png` drawn at 2× centred on Night Indigo) |
| `{ pause: true }` | waits for Continue |
| `{ sfx: 'name' }` / `{ music: 'name' }` / `{ amb: 'name' }` | audio (`null` stops). Ids exactly as in the Asset list, e.g. `level-up`, `item-get`, `heal`, `steal`, `drink`, `summon`, `rumble`, `gate-open`, `heartbeat`, `door`, `refuse`. Stings are sfx: `sting-solved`, `sting-victory`, `sting-gameover` |
| `{ choice: [ { id, text, if, do: [effects] } ], prompt: 'optional question' }` | inline choice buttons (`id` optional; gives a stable `data-act`) |
| `{ confirm: { text, yes: [...], no: [...] } }` | yes/no box, for weighty choices |
| `{ if: cond, then: [...], else: [...] }` | branch |
| `{ once: 'id', do: [...] }` | run `do` only the first time; sets `once:id` when the block **finishes** |
| `{ learn: ['memberId', 'skillId'] }` | teach a skill |
| `{ toast: 'text' }` | small floating notice |
| `{ ending: 'A' }` | **must be the last effect of its list.** Records the ending (A, B or C) in `meta` (endings found, best time) and shows the ending summary card (name, play time, level, "N of 3 endings found", Return to the Final Choice / Replay from the Choice). It shows **no story text**: the ending's story is the `scene`/`say`/`line` effects (with `if` variants for Khalla, Tullia, Morvan, the fleet, Zelara, Nine) written before it in the same list |
| `{ call: 'scriptName', args: {} }` | run a chapter script `async (g, args) => {}` |
| `{ autosave: true }` | write the `auto` slot now |
| `{ autosave: 'choice' }` / `{ autosave: 'final' }` | write a **protected** slot (see Saving) |
| `{ shake: true }` | screen shake |
| `{ refresh: true }` | re-render the room's things and exits (after flags change them) |

### The effects runner (how lists run)

- `run(effects)` is **async**: each effect is awaited in order. `fight`, `talk`, `choice`, `confirm`, `scene`, `pause`, `shop`, `inn` and `call` resolve only when the player finishes them. Nested lists (`if`, `once`, `choice.do`, dialogue `do`, fight `win`) run inside the same run.
- **One action at a time.** A tap on a verb, exit, item use or combine starts one top-level run; the UI disables other actions (buttons get `aria-disabled`) until it ends. Saving is only allowed when no run is active.
- **Room entry order:** set `room` → write the `auto` save (**before** any entry effects) → show description → `enter` effects → `first` effects (first visit only; the room counts as `visited` when they finish) → ambush roll. Loading an autosave re-runs `enter`, and `first` if it never finished.
- **Defeat and retry.** Before each `fight`, the runner takes a **pre-fight snapshot** (the whole state as it is at that moment, including everything earlier effects in the same list already gave or took). If the battle is lost and the fight has no `lose`:
  - **Retry** restores the pre-fight snapshot, sets the party to full HP/MP, and starts the same fight again. The suspended list then continues after the win. Effects before the fight are **not** run again (no double rewards); `win` effects run exactly once.
  - **Load autosave** discards the run and loads the `auto` slot (room entry).
  - If the fight has `lose`, a loss runs `lose` and the list continues (no Game Over, no snapshot restore).
- **Interrupting effects:** `goto` and `chapter` end the current list (anything after them is ignored; lint warns).
- `once` blocks and `once: true` dialogue choices are recorded in the state, so they survive saves.

## Room

```js
'c1-gate': {
  name: 'The Desert Gate',
  bg: 'bg-desert-gate',         // picture id; optional tint: 'bg-jail@dark' (night dusk fire dark fog void)
                                // or a function/array of parts like desc: [{ if: 'flag:c3-night', bg: 'bg-beach@night' }, { bg: 'bg-beach' }]
  music: 'shadizar',            // music id from the room table; null = silence; omit to keep the current track
  amb: 'amb-crowd',             // optional ambience loop id
  map: { x: 2, y: 5 },          // from the Manifest room table (integers; one room per cell)
  desc: 'Static text',          // or an array of parts: [{ text: '...' }, { if: 'flag:x', text: '...' }]
                                // every part whose `if` passes is shown, in order. Or (g) => string
  exits: {
    n: 'c1-street',             // simple
    e: { to: 'c1-pit', if: 'flag:c1-gate-open', blocked: 'The guards cross their spears.', label: 'The Pit' },
    u: { to: 'c1-crown', noReturn: 'Beyond this door the job is done, one way or another. You leave Shadizar tonight.' },
    // keys: n e s w ne nw se sw u d in out. If `if` fails: shown greyed when `blocked` is set
    // (tapping shows the blocked text), hidden otherwise.
    // noReturn: a confirmation box with this text, the open quests of this chapter (and carry quests),
    // and the buttons "Go on" / "Not yet". Also allowed on a thing verb: verbs: { 'Cast off': { noReturn: '…', do: [...] } }
  },
  things: [ /* Thing */ ],
  enter: [ /* effects every time, after the description */ ],
  first: [ /* effects on the first visit only, after the description */ ],
  ambush: { chance: 0.25, groups: [['jackal', 'jackal'], ['thug']], if: '!flag:x' },  // rolled after entry effects
  hunt: [['jackal', 'jackal'], ['thug', 'thug']],  // shows a Hunt button (deliberate battle)
  safe: true,                   // optional: no ambush, shows as a rest/safe room on the map
}
```

## Thing (people and objects in a room)

```js
{
  id: 'butcher', name: 'Butcher', kind: 'person',   // 'person' or 'thing'
  if: '!flag:c1-butcher-gone',  // visible only when true
  portrait: 'generic-man',      // portrait id from the Manifest (people)
  look: 'text' | [effects],
  talk: 'dialogueId' | [effects],
  take: 'refusal text' | [effects],         // omitted: generic refusal
  verbs: { Open: [effects], Turn: [effects] },   // custom verbs (button labels); or { noReturn, do }
  use: {                        // using an item from the bag on this thing
    'bone': [effects],
    '*': 'Default refusal for any other item.',
  },
  hot: 'flag:x',                // optional condition: gold dot (something new to do)
}
```

People default to the verbs Look, Talk, Use; things to Look, Take, Use, plus custom verbs. Hide Take on scenery by giving `take: 'refusal'` (still shown) or `noTake: true` (not shown).

Every room also has an implicit target **"the party"** (`id: 'party'`) in Use lists, for items used on yourselves (`beeswax`). Give it uses with a room-independent table in the chapter: `partyUse: { 'beeswax': [effects] }`.

### UI behaviours writers can rely on (engine does these; don't script them)

- **New markers:** a gold dot on a thing never looked at (or with `hot` true), and on exits to unvisited rooms; the dock's Here/Go tabs carry a dot when any of their buttons does.
- **Item lists for Use:** key items first, newest at the top, then other usable items.
- **Wrong item:** the thing's `'*'` refusal (or a generic one), `refuse` sfx, then a one-tap **Try another item** button.
- **Point of no return:** see `noReturn` above. The engine builds the open-quest list from quests with `chapter: <current>` (not done) and quests with `carry: true`.
- **Battle helpers:** Auto, Auto until done, Repeat, Study, battle speed and **Swap (free once per turn)** are engine features; scripted solutions use the battle policy `auto`.

## Dialogue

```js
c1_tullia_job: {
  start: 'a',
  nodes: {
    a: { who: 'tullia', text: 'Line', next: 'b' },
    b: { who: 'brannoc', text: 'Line', do: [effects], choices: [
        { id: 'take-job', text: 'Choice text (what Brannoc says)', to: 'c', if: 'cond', do: [effects], once: true },
        { id: 'leave', text: 'Leave.', end: true },
    ] },
    c: { who: 'tullia', text: '...', goto: 'a' }, // goto another node (same as next)
  },
}
```

`who` is a party member id, an npc id, or `'narrator'`. A node with no `next` and no `choices` ends the dialogue. `once: true` choices disappear after being picked. Node `do` effects run when the node is shown, before its choices. Give choices an `id` (unique within the dialogue) so solutions can name them.

## Fight

```js
{ fight: {
  id: 'c1-gate-jackals',        // recorded so `won:c1-gate-jackals` works; required for boss and story fights
  enemies: ['jackal', 'jackal'],
  bg: 'bg-desert-gate',         // default: current room's picture (tint allowed: 'bg-hoard@fire')
  music: 'battle',              // default battle; bosses 'boss'; Ygg-Sothar 'boss-dragon'
  boss: true, noFlee: true,     // boss and arena imply noFlee. RULE: every `fight` effect needs noFlee: true
                                // (or boss/arena); only engine-made ambush and Hunt battles can be fled. Lint fails otherwise.
  intro: 'Two jackals slink from the dunes.',
  win: [effects], lose: [effects],   // lose given = losing continues the story instead of Game Over
  arena: true,                  // arena rules: no flee, no items, HP restored after (win or lose)
  start: { hp: 0.6 },           // optional: enemies start at this fraction of HP (Redhand Company)
  triggers: [ /* Trigger */ ],
} }
```

### Triggers (mid-battle scripted moments)

```js
triggers: [
  { when: 'hp<0.5', enemy: 'waking-head', do: [            // checked after every action
      { line: ['brannoc', 'CROM!'] }, { shake: true }, { sfx: 'dragon-roar' },
      { scene: { img: 'bg-hoard@fire', text: 'The ceiling comes down.' } },
      { endBattle: 'win' } ] },
  { when: 'hp<0.66', enemy: 'final-head', do: [{ phase: 'void' }] },
  { when: 'round>=1', every: 1, if: 'flag:c3-took-vault', do: [{ hit: { target: 'all', power: 30, text: 'The Redhand Company fires a volley!' } }] },
  { when: 'dead', enemy: 'brass-serpent', do: [{ line: ['azhrim', 'My beautiful toy!'] }] },
]
```

- `when`: `hp<F` / `hp<=F` (fraction of that enemy's max HP), `round>=N`, `dead`, `allDead` (all but bosses). Triggers fire **once** unless `every: N` (rounds).
- Battle-only effects: `hit: { target: 'all'|'one'|enemyId, power, el, text }`, `summon: ['serpent-man', ...]` (max 4 enemies on screen), `phase: 'fire'|'void'|null` (tints the boss sprites and swaps to the enemy's `phases[name]` weak/resist/immune), `endBattle: 'win'`, `heal` (party), `buff: { target: 'party'|'enemies', stat, amount }`. Plus `say`, `line`, `shake`, `sfx`, `scene`, `set`.
- A fight with a trigger that ends it as a win counts as won (`won:id`) and runs `win`.

## Enemy

```js
jackal: {
  ...enemyStats(1, 'minion'),   // hp atk def res agi xp gold from data/balance.js (see GAME_DESIGN.md → Balance)
  name: 'Desert Jackal', sprite: 'jackal', tint: null,   // sprite id from the asset list; tint: a code tint name
                                // (grey red tan gold violet teal blue green orange cyan white steel bone dark) or a CSS colour.
                                // Prefer this explicit form; 'jackal@grey' in `sprite` is also accepted.
  size: 's',                    // s 48×≤64, m 72×≤80, l 100×≤100, xl 140×≤150 (height × width cap, picture units)
  pos: null,                    // optional fixed x for multi-part bosses: 'left' (60) | 'center' (160) | 'right' (260); mirror: true
                                // otherwise the engine's slot layout places 1–4 enemies (GAME_DESIGN.md → Manifest → Battle layout rule)
  weak: ['slash'], resist: [], immune: [],   // from the family table: slash pierce blunt fire lightning cold holy star void
  phases: { fire: { weak: [...], resist: [...], immune: [...] }, void: { ... } },   // optional
  desc: 'One line shown when studied.',
  skills: [ { name: 'Savage Bite', power: 1.4, dmg: 'pierce', chance: 0.3, target: 'one', status: { poison: 0.25 }, sfx: 'bite' } ],
  // attack uses dmg type of the first skill unless `attackDmg` is given; magic skills: { magic: true, el: 'fire' }
  // elements: fire lightning cold holy star void (void = the dragon's servants and Set's curses; the party has no void attacks)
  drops: [ { id: 'jackal-pelt', chance: 1 } ],   // story items must be chance 1
  boss: false,
}
```

Level and role for every enemy are fixed in the Manifest's enemy table, and every chapter's placed fights (enemies, levels, XP) are listed under that chapter in GAME_DESIGN.md → Story by chapter: write those fights with those ids. Don't hand-tune stats; if a fight feels wrong, change its group or level and tell the lead. Shared enemies (●, incl. the Pit fighters and their Ch V `-v` variants) come from `data/core-enemies.js`; don't redefine them.

## Item

```js
'broadsword': {
  name: 'Broadsword', type: 'weapon',      // weapon body head offhand trinket consumable key junk
  icon: 'sword',                            // icon id (assets/icons/<id>.png); may carry a tint: 'sausage@green'
  desc: 'Flavor line.',
  price: 145,                               // buy price; sells for half; key items unsellable
  weapon: { kind: 'sword', dmg: 'slash', power: 12, el: null, twoHanded: false },
  stats: { def: 0, res: 0, str: 0, agi: 0, wil: 0, hp: 0, mp: 0 },
  users: ['brannoc', 'ilsa'],               // optional; default from weapon kind / armor class
  use: { heal: 40 },                        // consumables: heal, mp, revive, cure, damage:{el,power,all}, flee, buff
}
```

Equipment slots: weapon, **sidearm** (any weapon the member can use; Swap toggles), body, head, offhand (blocked by `twoHanded`), trinket.

Weapon kinds and who can use them by default: `sword` (Brannoc, Ilsa), `greatsword` (Brannoc, two-handed), `axe` (Brannoc), `mace` (Brannoc, Zelara), `spear` (Brannoc, two-handed), `dagger` (Shevra), `thrown` (Shevra, Ilsa), `sling` (Shevra), `cutlass` (Ilsa), `bow` (Ilsa, two-handed), `staff` (Ptahk, Zelara, two-handed), `module` (Nine).

## Shop

```js
'c1-hasdrubal': { name: "Hasdrubal's Arms", keeper: 'hasdrubal', items: ['broadsword', 'rope', 'healing-draught'] }
```

Shop stock is unlimited (so items sold for puzzles are repeatable sources).

## Quest

```js
'sq-pit': { name: 'The Pit of Shadizar', side: true, carry: true, stages: { 1: 'Objective text...', 2: '...', 5: '...' }, done: 5 }
'e-ledger': { name: "Fat Ommo's Ledger", errand: true, chapter: 1, stages: { 1: '...', 2: '...' }, done: 2 }
```

Main-story objectives are a quest with `main: true` per chapter (`ch1-main`). The Journal shows each active quest's current stage text. `chapter: N` (side quests and errands) puts an unfinished quest on that chapter's point-of-no-return list; `carry: true` lists it as "will wait for you".

## Hint

```js
{ if: 'quest:ch1-main==2 & !item:grapnel', nudge: 'The wall is high...', answer: 'Combine the rope with the meat hook.' }
```
The Journal shows the first hint whose `if` is true. Every puzzle step in your chapter's table needs one.

## Recipe (combine)

```js
{ a: 'rope', b: 'meat-hook', make: 'grapnel', text: 'You knot the rope to the hook.' }
{ a: 'valerio-signet', b: 'blank-order', make: 'sealed-order', keep: 'a', text: 'Hot wax, a firm press.' }   // keep: 'a'|'b' keeps that ingredient
```

## Scripts

`scripts.name = async (g, args) => {}` gets the game API `g`:
`g.flag(x)`, `g.set(x)`, `g.clear(x)`, `g.var(x)`, `g.setVar(x, n)`, `g.has(item)`, `await g.run(effects)`, `g.say(text)`, `g.line(who, text)`, `g.room()`, `g.refresh()` (re-render the room's things and exits), `g.rng()` (seeded 0..1).
Use scripts only for special puzzles (like turning mirrors); prefer data. A script must not touch the DOM or save; run effects through `g.run`.

## Saving

- Slots: `auto` (room entry), `1`–`3` (player), and the protected `choice` and `final`. Key: `barbarain.v1.slot.<name>`; meta (endings found, best time): `barbarain.v1.meta`.
- `{ autosave: 'choice' }` is written by Ch III as the **first effect** of the two verbs that open the choice (Nine's "Give the cell" and the Vault socket's "Set the cell"), inside `{ if: '!flag:c3-choice-made & item:star-cell>=3', then: [...] }` and **never inside a `once`** (so no `once` id is recorded in it). It stores the state as it was when that tap started, so loading puts the player idle in that room with 3 cells and the choice still open; opening the confirm again just rewrites the same state. After the choice is made it is never written again.
- `{ autosave: 'final' }` is written by Ch V right after the final boss's `win` effects set `c5-dragon-down`. The endings are verbs on the `c5-heart` thing "The Dragon's Heart", so loading `final` puts the player idle in front of them.
- Protected slots are never written by `auto` and are offered on the title and ending screens once `meta.endings` is not empty.

## Stable action ids (`data-act`)

Every interactive element has a `data-act` attribute that stays the same across renders, so solutions and tests can click by name:

| Element | `data-act` |
|---|---|
| Exit button | `go:n` (direction key) |
| Thing chip / verb | `thing:<thingId>`, `verb:<thingId>:<Verb>` (e.g. `verb:butcher:Look`) |
| Use item on thing | `use:<itemId>:<thingId>` (also `use:<itemId>:party`); Try another item: `use-again` |
| Bag item / combine | `bag:<itemId>`, `combine:<itemA>:<itemB>` |
| Dock tabs | `tab:go`, `tab:here`, `tab:bag`, `tab:party`, `tab:more` |
| Dialogue choice | `dlg:<choiceId>` (falls back to `dlg:<index>`) |
| Inline choice | `choice:<id>` (falls back to `choice:<index>`) |
| Continue / confirm | `continue`, `confirm:yes`, `confirm:no`, `noreturn:go`, `noreturn:stay` |
| Battle | `battle:attack`, `battle:skill:<skillId>`, `battle:item:<itemId>`, `battle:defend`, `battle:swap`, `battle:flee`, `battle:auto`, `battle:auto-all`, `battle:repeat`, `target:<index>`, `retry`, `load-auto` |
| Shops / inn | `shop:buy:<itemId>`, `shop:sell:<itemId>`, `shop:close`, `inn:yes`, `inn:no` |
| Menus | `menu:<name>` (journal, map, save, load, settings), `hint:nudge`, `hint:answer`, `save:<slot>`, `load:<slot>` |
| Title / ending | `title:new`, `title:continue`, `title:final`, `title:choice`, `ending:final`, `ending:choice` |

## Solutions

`design/solutions/<name>.json` (names: `ch1`, `ch2`, `ch3-free`, `ch3-vault`, `ch4-nine`, `ch4-zelara`, `ch5-a`, `ch5-b`, `ch5-c`, `sq-arena`, `sq-witch`, `sq-bride`):

```json
{ "start": { "chapter": 3, "branch": null, "seed": 1234 },
  "battle": "auto",
  "steps": ["go:n", "verb:palm:Shake", "go:w", "use:coconut:plates", "continue"],
  "expect": ["item:star-cell>=1", "flag:c3-choice-made"] }
```

`start` loads the Manifest snapshot through `__game.chapter(n, branch)` with the seed (snapshots are cumulative: party, gold, equip, items, flags, quests, vars and `learn`ed skills of all earlier chapters); each step clicks the element with that `data-act` (waiting until it exists and is enabled); battles run with the Auto policy; `expect` conditions are checked at the end. Each chapter writer delivers their chapter's solution files.

## Lint (`tools/lint-content.mjs`)

Fails on: a `fight` effect without `noFlee: true` (or `boss`/`arena`); an `ending` effect that isn't last in its list; unknown ids (rooms, items, npcs, portraits, pictures, music, sfx, amb, dialogues, enemies, quests, skills, scripts); rooms not reachable from the chapter start; a consumed key item with neither a repeatable source (shop, `↻` thing or verb that gives it again) nor exactly one consumer; a condition atom nothing can make true; a manifest flag set or read by a chapter the Manifest doesn't name; a non-manifest id used by two chapters; effects after `goto`/`chapter`; a puzzle step without a hint.

## Asset ids

Pictures, portraits, enemy sprites, icons, music, sfx and ambience ids are listed in GAME_DESIGN.md's Asset list and Manifest. Use only those ids. A missing picture falls back to a dark placeholder; never invent new asset ids without telling the lead.
