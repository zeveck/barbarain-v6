# BarbarAIn

*Steal a star. Cross the sea. Outrun a thousand years. Kill the dragon between worlds.*

## Pitch

A modern, button-driven text adventure RPG in Robert E. Howard's Hyborian Age. Brannoc, a broke Cimmerian, takes one heist job in Shadizar, the City of Thieves, and the "jewel" he steals turns out to be the heart of an iron man from the far future. Explore richly described scenes, solve comic item puzzles, fight turn-based battles with a party of rogues and sorcerers, and make one choice in the middle of the story that decides whether the best ending can exist at all.

## Settings

- Platform: both (desktop and phone, portrait on phone; phone landscape also works)
- Target: web (plain HTML, CSS and JavaScript ES modules, no build step)
- Scope: large: five chapters, about two hours (≈140 min), three endings, three side quests (asked for explicitly)
- Budget: $20 for generated art and audio, with a stated contingency of $2.32 (see Budget)
- Tools available: imagegen2 (OpenAI), nanogen (Gemini), anim8gen, audiogen (ElevenLabs, restricted key: plan unknown, `audiogen plan` returns `unknown`; settled by the first sound), playwright-cli, Python + Pillow 13, Node
- Credit: none (no name known)
- Decisions made on the player's behalf:
  - **The hero is Brannoc, an original Cimmerian, not Conan.** The request wants a new story with characters that *evoke* the books and films. Every character is original and evokes an archetype (Zamorian thief, pirate queen, grumpy wizard, serpent priest, alien in the tower), and speaks like one.
  - Howard's setting names and gods are used freely (Shadizar, Zamora, Argos, Messantia, Stygia, Cimmeria, Crom, Mitra, Set, Bel). No film-only names, lines or imagery.
  - All the loose twist ideas are used and tied into one mythology: a heist, robots from the future, pirates, time travel and a trans-dimensional dragon.
  - "Say three" endings: exactly three. "Maybe three" side quests: exactly three, plus small optional errands.
  - DOM interface (HTML text and buttons) with a 320×180 pixel-art canvas for scenes and battles, not a canvas game, so long prose reads well on phones and buttons are real buttons.
  - No random battles on every step. Battles are placed, some rooms have an "ambush" chance on entry, and wild areas have a **Hunt** button for grinding on purpose.
  - Desktop also accepts typed commands ("take rope", "n", "use sausage on hounds") as a modern parser shortcut; everything is also reachable by buttons.
  - Chapters are one-way, but every chapter exit warns first and lists open quests (see Side quests and "Point of no return").

## The player's fantasy

Being a Howard barbarian: a big, quiet, deadly man with a sharp mind under the scowl, who trusts steel over sorcery, keeps his word, cracks heads, wins hearts, laughs at kings, and outwits a city full of thieves, a sorcerer, a sea and a god.

## The mythology (shared bible, short form)

- **Ygg-Sothar, the Dragon Between Worlds.** A vast serpent-dragon that coils through the gaps between times and worlds. Where it feeds, a world's future is eaten. The serpent cult of **Set** worships it as Set's true face.
- **The far future** (thousands of years ahead, after the Hyborian lands have sunk and risen again): Ygg-Sothar woke and ate the world. The last humans built **the Watchers**, iron men powered by **Starhearts** (time-engine cores, glowing blue-white), and sent them back through a **Gate** to kill the dragon while it slept in the Hyborian Age. Lesser engines run on **star-cells** (fist-sized, dimmer; a Starheart is to a star-cell what the sun is to a lamp).
- **The Gate** sits on a nameless island off the Black Coast, the **Isle of the Iron Dead**. Its ring wakes only when fed a Starheart; its outer door opens for two star-cells. Watchers sent back from the future came out of its ring, and most arrived broken: the island is a graveyard of them.
- **The Gate sends; the Standing Stones catch.** The Gate has a twin: a ring of **Standing Stones** in the valley where Shadizar now stands. A crossing that goes wide comes out of the Stones instead of the ring. One Watcher did, centuries ago, and walked into **Azhrim the Collector**, a decadent sorcerer-merchant who had built his tower *on* the Stones because they hum; he chained it in the tower's crown as a curiosity before it could walk to the Isle. The Stones stay open while a crossing still burns in them, and fed a Starheart they send travellers back to the age they came from. (So: the Watcher is in Shadizar because the Stones are under the tower; the party lands at the Stones in Ch IV, a thousand years back, before there is a tower; and comes home out of the Stones in the tower's ruins in Ch V.)
- **Thoth-Seketh**, High Priest of the Serpent, wants a Starheart: fed to Ygg-Sothar at the moment it last woke (a thousand years ago), it would give the dragon a body in every age at once. Watchers' hearts burn the hands of serpent-blooded men, so he needs a human to carry it.
- **Shadizar** was founded a thousand years ago by nomad thieves who built their city over the hoard of a dragon that sank into the earth and slept. Its founder is remembered only as **the Nameless Thief**, whose worn statue stands in the square holding a star.

## The three twists (and the clues)

1. **The jewel is a heart (end of Chapter I).** The "Starheart" Brannoc is hired to steal is the glowing core of a chained iron man from the far future, the **Iron Watcher**, who begs him to carry it to the Gate before it dies. *Clues:* the jewel is described as "warm, and it beats"; the tower hums; scholars at the temple talk of "a bronze idol that weeps oil".
2. **The wizard is the serpent priest (end of Chapter III).** Ptahk, the grumpy, funny Khitan sorcerer who saved the party in Chapter I and has been teaching and healing them, is Thoth-Seketh in a glamour. At the Gate he has Brannoc feed the heart to the ring, takes it with smoking gloved hands and steps through into the past. *Clues (fair, never blunt):* Ptahk never eats ("my stomach is older than your country"); always makes Brannoc carry the heart ("old hands"); reads Stygian too well; at the Oasis of Bones (Ch II) Shevra thinks she sees his eyes go slit-pupilled in the firelight, and he laughs it off: "The smoke, child. And my old eyes, which are older than yours and uglier." (ambiguous: the player can believe either); he talks Brannoc out of destroying the heart; on the Isle he argues warmly for opening the Vault (see the choice) and insists "the ring drinks a *heart*, not a cell. Yours." *Payoff:* his reveal speech explains the Chapter I ambush: "Who do you think paid Tullia's blades, and told my brothers which alley? A rescuer is always trusted, barbarian." In Ch V, Tullia confirms it if rescued ("A Khitan paid double. I never asked why a Khitan paid in Stygian gold.").
3. **Brannoc is the Nameless Thief (Chapter IV).** The Gate throws the party a thousand years back, into the empty valley where Shadizar will stand. Brannoc's party steals the heart back from the dragon's hoard, and with the nomads' help brings the hoard's ceiling down on the waking dragon, which sinks into the earth to sleep; the nomads build their first walls with its gold and name their city after the deed. Brannoc *is* the founder. In Chapter V the statue in the square visibly has his face (and Shevra never lets him forget it). And the city has been sitting on the dragon all along: Thoth-Seketh, back in the present, is waking it under Shadizar. *Clues:* the statue in Chapter I "has a jaw like a Cimmerian's"; the old priest of Bel says the founder "came from nowhere and went nowhere"; the city's oldest curse is "may the floor wake".

Smaller surprises: the patron Tullia double-crosses the party at the end of Chapter I (and was paid to: see twist 2); the ghost captain is Ilsa's grandfather; the arena champion, Khalla, turns up to fight beside you in the finale if you beat her; the statue's face, black with a thousand years of lamp-soot, is scoured clean by the fire in Ch V (Shevra: "Fire's a better scrubber than the city council. Oh. *Oh*, Bear.").

## The party

| Member | Id | Archetype (evokes) | Joins / leaves | Weapons (kinds) | Role and voice |
|---|---|---|---|---|---|
| **Brannoc** | `brannoc` | the Cimmerian barbarian | always | sword, greatsword, axe, mace, spear | Heavy damage, high HP, low MP ("Spirit" for war-arts). Terse, grim, wry; swears by Crom; distrusts sorcery and kings; generous to the poor; never begs. |
| **Shevra** | `shevra` | the Zamorian master thief | Ch I (tavern) | dagger, thrown, sling | Fast, crits, steals, unlocks things. Mocking, quick, greedy, secretly loyal. Calls Brannoc "the Bear". |
| **Ptahk** | `ptahk` | the grumbling Eastern wizard | end Ch I → betrays end Ch III | staff | Fire, wards, heals. Theatrical complaints, bad jokes about his knees, real wisdom. (Is Thoth-Seketh.) |
| **Ilsa Redhand** | `ilsa` | the pirate queen of the Black Coast | Ch II (the Brig) | sword, cutlass, bow, thrown | Hits all enemies, rallies. Fierce, proud, laughs in storms, flirts with danger more than with Brannoc. |
| **Nine** | `nine` | the iron man from the future | Ch IV, **only if freed in Ch III** | module | Lightning, Cold, repair (heal all), shields; Blunt piston and Star for iron foes. Literal, gentle, learning what "friend" means. Calls Brannoc "Original Human Brannoc" until told to stop. |
| **Zelara** | `zelara` | the priestess of Mitra | Ch IV camp in both branches; **joins only if Nine was not freed** | mace, staff | Holy light, healing, cleansing. Calm, stubborn, unafraid of Brannoc's glare. Last priestess of the Mitran order that kept the Standing Stones; Thoth-Seketh's ancient cult burned her shrine there. In the Vault branch she joins to see him dead and walks forward through the Stones with the party ("Your age needs a priestess more than mine"). In the Nine branch she stays with the nomads ("Your iron friend has my place"), gives the Frost Flask, and is remembered in Ch V by her name carved on Mitra's oldest stone. |

Party size in battle: up to 4. Ch I: Brannoc (+Shevra from the tavern); Ptahk joins in the escape after the boss. Ch II: Ilsa joins at the Brig → four. Ch III: four until the betrayal (Ptahk channels during the Mother of Coils, so that boss is fought by three). Ch IV–V: Brannoc, Shevra, Ilsa + Nine or Zelara.

## Story by chapter

Each chapter: a hub to explore, a dungeon, puzzle chains with one comic "aha" each, placed battles, a boss, and a closing cutscene. The full room list with ids is in the Manifest's room table; the puzzle chains with every item source and in-room clue are in "Puzzle chains".

### Chapter I — The City of Thieves (Shadizar) · ~35 min · Lv 1→6 · 16 rooms

Brannoc arrives at Shadizar's desert gate, broke. **Madam Tullia**, a perfumed Nemedian fence, hires him (and the thief **Shevra**, whom he meets in the Gilded Jackal) to steal the "Starheart" from **Azhrim the Collector's** tower for 500 gold.

Hub: Desert Gate (tutorial jackal fight; guards' toll puzzle), Street of Lamps, Gilded Jackal (Abulet, the drunk poet, Shevra), Bazaar (Hasdrubal's arms, Old Nimm's apothecary, the butcher), Temple Row (Bel, a Set shrine, scholars), Statue Square, the Pit (side quest 1), Thieves' Den (Fat Ommo), Tullia's House, Back Alleys. Tower: Tower Wall, Tower Garden, Tower Hall, Undercroft (optional), Moon Stair, Tower Crown.

Story beats: the heist chain (see Puzzle chains: wall, hounds, hall guards, Smiling Door, Moon Stair); at the Crown, **Twist 1**: the **Iron Watcher**, chained, chest open, a beating blue-white jewel inside, asks Brannoc to carry its heart to "the Gate on the Isle of the Iron Dead, where the stars drown". Taking it gives the **Starheart** (key item; grants Brannoc *Starfire* while carried) and the Watcher dies with a farewell. **Boss: Azhrim the Collector** with a **brass serpent** construct, fought by Brannoc and Shevra alone (tuned for two: see the fights list). The tower shakes and burns. **Escape:** in the Back Alleys, Tullia's hired blades and Set cultists ambush you (the double-cross). At round 3 **Ptahk** appears, scatters them with a fireball (the fight ends as a win), complains about his knees, and joins: "That trinket screams loud enough for every sorcerer from here to Khitai. Walk with me, or die stupid." (He paid for the ambush: twist 2.) He knows of the Isle; you need a ship: Messantia, on the coast of Argos. Chapter ends.

**Placed fights** (XP at the round-2 scale; every one is a `fight` effect with an id, so `noFlee`; puzzle alternatives give the same XP as "Clever!"):

| Fight | Enemies (level role) | XP |
|---|---|---|
| `c1-gate-jackal` (tutorial) | jackal (1 minion) | 11 |
| `c1-alley-boots` (first Back Alleys visit) | thug (2 minion) | 24 |
| `c1-pickpocket` (or Shevra's Steal) | pickpocket + thug (2 minion) | 48 |
| `c1-hounds` (or drugged sausage) | tower-hound ×2 (3 brute) | 120 |
| `c1-hall-guards` (or knucklebones) | city-guard ×2 (3 brute) | 120 |
| Puzzles (`xp` effects: gate 10, wall 20, door 25, mirrors 30) | | 85 |
| **Before the boss** | | **408 → Lv 5** (band top − 1) |
| `c1-azhrim` (boss) | azhrim (5 boss `{hp:0.8}`) + brass-serpent (5 brute `{hp:0.6}`) | 307 → Lv 6 |
| `c1-escape` (ends at round 3) | tullia-blade ×2 (4 minion) + cultist (3 caster) | 153 → **868, Lv 6** |

Optional on top: alley ambushes, the Undercroft spider (107), Pit ranks 5–3, errands, jackal Hunt.

### Chapter II — The Black Coast · ~30 min · Lv 6→10 · 16 rooms

Caravan Road (bandits and a scorpion attack on the first visit), Oasis of Bones (night camp: hyenas, then the **Ptahk's eyes** moment, ambiguous, always plays on first visit), Salt Marsh and Witch's Hut (side quest 2), Messantia Gate, Docks (Argossean Arms), the Drowned Gull tavern, Harbor Office (**Count Valerio**, harbor master), Debtors' Pen (Ilsa's crew), the Brig (Ilsa), Customs Warehouse, **the dungeon: the Smugglers' Tunnels and the Drowned Cistern** under the warehouse, the *Sea-Wolf*'s deck, Open Sea, the Storm.

Main chain (see Puzzle chains): free **Ilsa Redhand** from the Brig; get Valerio's seal on a release order, which frees her crew *and* her ship in one stamp; then Ilsa won't sail without her sea-chest ("The Isle isn't on any chart but mine"), which the marines sold to smugglers: fight the marines in the Customs Warehouse, go down the trapdoor into the Smugglers' Tunnels (drain the flooded passage with the sluice wheel), and beat the smuggler chief, Gull-Eye Marro, in the Drowned Cistern for the chest (charts, `ilsa-longcoat`, 150 g). The tunnels also run under the Brig: a rusted grate there is the crude way to free Ilsa. Cast off (point of no return), banter on the Open Sea, **Boss: the sea serpent Khurath** in the Storm. Its gut always yields a **wedding ring** (side quest 3). Shevra keeps **Valerio's signet** "as a souvenir"; it matters on the Isle.

**Placed fights:**

| Fight | Enemies (level role) | XP |
|---|---|---|
| `c2-road-ambush` (first visit) | bandit ×2 + scorpion (7 minion) | 291 |
| `c2-oasis-hyenas` (first night) | hyena ×2 (8 minion) | 226 |
| `c2-marines` (Customs Warehouse) | marine ×2 (9 brute) | 412 |
| `c2-tunnel-smugglers` (first visit) | smuggler ×3 (8 minion) | 339 |
| `c2-marro` (Drowned Cistern) | smuggler-chief (9 brute) + smuggler ×2 (8 minion) | 432 |
| Puzzles (brig key 30, signet 30, order 15, crew and ship 15, sluice 20) | | 110 |
| **Before the boss** (644 + 1,810) | | **2,454 → Lv 9** |
| `c2-khurath` (boss) | khurath (9 boss) | 387 → **2,841, Lv 10** |

Optional on top: marsh eel and the witch's errands, road and marsh Hunt.

### Chapter III — The Isle of the Iron Dead · ~25 min · Lv 10→14 · 12 rooms

Wreck Beach (the *Sea-Wolf* anchored; rest point; by night the ghost ship appears: side quest 3), Jungle Path, Ape Rocks, Serpent River, Ruined Gateway, Iron Graveyard ("they fell like rain"), Hall of Glyphs, Power Wells, Prison of Nine, Vault of the Drowned Kings, Gate Chamber, and the Ghost Ship (side).

**The star-cell rule (one rule, used everywhere):** there are exactly **three star-cells** on the Isle (Power Wells, Iron Graveyard, Ape Rocks). The **Gate Chamber door** has two sockets and opens for **two** cells. The **Gate's ring** inside wakes only for the **Starheart** (not a cell). The third cell is the spare: it can wake **Nine** *or* open the **Vault** — never both. The Hall of Glyphs mural shows exactly this ("a door of two eyes; a sleeper of one; a vault of one; a ring that drinks a heart"), and Ptahk reads it aloud.

1. Gather the three cells (Puzzle chains).
2. **THE CHOICE (mid-story, recorded forever).** Available only while the bag holds **3 star-cells**; with fewer, Nine's prison and the Vault socket say "Find all three cells first: the door needs two, and then you'll know what the third can buy." In the Prison of Nine, a damaged Watcher, **Unit Nine**, is pinned under a fallen pillar, its heart failing. The Vault of the Drowned Kings has a cell socket. Ilsa's crew is near mutiny for want of treasure. Just before the confirmation box, the game writes the protected **"Before the Choice"** save.
   - **Free Nine**: put the cell in Nine. Nine wakes, thanks you, and says it must recover; it will "find you across time". Ilsa is angry; her crew grumbles and sails home. **Opens Ending C and Nine as a party member in Ch IV.**
   - **Open the Vault**: 2,500 gold, the axe **Kingsbane** (best weapon until Ch V), and Ilsa's crew's loyalty: Ilsa orders them to take the gold "to Shadizar, where the old snake is headed, and buy every sword in it". **In Ch V the Redhand Company fights beside you at the Undercity Gate** (they bombard every round and the enemies start at 60% HP), and the fleet appears in Ending A. Nine goes dark forever with a quiet last line. **Zelara joins in Ch IV.**
   - **Ptahk argues warmly for the Vault** (he needs Nine dead: a waking Watcher could stop him): "Gold buys ships, swords and loyalty, my bear. That poor machine is already a corpse. Let it rest." Shevra, uneasy, argues for Nine; Ilsa for the gold. Their lines play when the player first Looks at Nine's pillar.
   - The confirmation box says plainly: "This choice cannot be undone. It changes who stands with you, and how the story can end."
3. The Gate Chamber door accepts the two cells only after the choice is made (Ilsa: "My crew won't follow you through that door until we settle what that third cell buys."). Entering the Gate Chamber is the chapter's point of no return.
4. **Twist 2.** Ptahk asks Brannoc to set the Starheart in the ring. The Gate opens. His glamour falls: he is **Thoth-Seketh**. His speech pays off the clues: "Who do you think paid Tullia's blades, and told my brothers which alley? A rescuer is always trusted, barbarian. And you carried my heart so *carefully*." Shevra: "I knew that smoke was no smoke." **Boss: Mother of Coils** (a giant serpent) while he channels, fought by Brannoc, Shevra and Ilsa. When she drops below half HP, his channel completes (trigger: `hp<0.5` → `endBattle: 'win'`; the fight counts as won, full XP): he seizes the heart with gloved, smoking hands and steps through, and the serpent pours into the ring after its master. Brannoc leaps after them; the party follows. ("By Crom, I'll gut that old man in whatever century he hides.") Ptahk's gear drops into the bag.

**Placed fights:**

| Fight | Enemies (level role) | XP |
|---|---|---|
| `c3-jungle-apes` (first visit) | man-ape ×3 (11 minion) | 483 |
| `c3-river-ford` (first visit; the only way to the Iron Graveyard) | river-serpent ×2 (12 brute) | 570 |
| `c3-gateway-husks` (first visit) | iron-husk ×3 (12 minion) | 534 |
| `c3-wells` (or the coconut) | iron-husk ×3 (12 minion) | 534 |
| `c3-sentinel` (cell 2) | sentinel (13 brute) + iron-husk ×2 (12 minion) | 667 |
| `c3-apes-chief` (or the signet trade) | ape-chief (13 brute) + man-ape ×2 (11 minion) | 633 |
| Puzzles (glyphs 20, choice 50, gate door 20) | | 90 |
| **Before the boss** (2,676 + 3,511) | | **6,187 → Lv 13** |
| `c3-mother` (boss; ends at 50%) | mother-of-coils (13 boss) | 584 → **6,771, Lv 14** |

Optional on top: the ghost ship (ghost-sailor fights), jungle Hunt.

### Chapter IV — A Thousand Years Before · ~25 min · Lv 14→17 · 12 rooms

The Gate throws the party wide and a thousand years back: out of the Standing Stones, in a scorched valley. No city, no tower. The mountain above the valley smokes: Ygg-Sothar, stirring. Thoth-Seketh's ancient Stygian followers are camped below the dragon's mountain preparing the **Feeding at the Conjunction** ("three nights": story only, never a clock).

Standing Stones (arrival: the Gate's twin ring; a burned Mitran shrine at its foot; Nine, if freed, is waiting: it "went the long way" and is very tired), Scorched Valley, Nomad Camp (**Grandmother Kesh** and the thieves who will found Shadizar; barter shop; **Zelara**, the last Mitran of the Stones, whose shrine Thoth's cult burned: she joins here if Nine was not freed, otherwise she stays and gives the Frost Flask), Bone Fields (wraiths; the melon hermit), Cult Picket, Cult Camp, Dragon's Mouth, Hall of Echoes, Molten Bridge, Hoard Hall, the Dragon's Bed, the First Walls.

Heist 2, the dragon's hoard (see Puzzle chains): steal cult robes and the password; learn the heart lies on the **weighing-altar** in the hoard; cross the Hall of Echoes with wax in your ears; crust the Molten Bridge with a Frost Flask; swap the heart for a **glowing snow-melon** of the same weight. Brannoc has the Starheart again (Starfire returns). Kesh's grandsons have climbed above the Hoard Hall's cracked dome: "If the worm wakes, shout Crom's name and my boys knock out the props."

**Boss: Ygg-Sothar, the Waking** (head and two coils as separate targets). When the head drops below half HP, Brannoc roars "CROM!" and the nomads knock out the bone props: the gold-veined ceiling comes down on the dragon, which, buried in its own hoard, screams and sinks into the earth to sleep. (The Starheart is *not* used here; driving it into the dragon is saved for Ending A.) Thoth-Seketh, maimed, flees through the Standing Stones (still burning from the crossing) to the present, crying that he will wake it "when its sleep is ripest".

**Twist 3** at the First Walls: the nomads, rich with the hoard, start building walls on the spot. Grandmother Kesh: "Every city needs a founder. Ours will be a thief." They ask Brannoc's name; Shevra says "he hasn't got one worth carving". They carve him holding a star (picture `bg-founding`). **The time-loop plant:** Kesh's grandsons are hanging the postern door of the first wall, "the founder's door, that opens only for the founder's word". Kesh asks Brannoc for the word (inline choice, no wrong answer): **"Crom"**, **"Melon"** or **"Shevra"**; it sets var `c4-door-word` to 1, 2 or 3, and a grandson cuts a pictogram of it under the door's stone mouth (a storm-crowned mountain, a round fruit, a woman with a knife). Shevra: "Remember it, Bear. Doors outlive people." Then the party walks back into the Standing Stones, still burning from Thoth's flight; Brannoc sets the Starheart in them and they carry the party home to its own age, out of the Stones under the ruined tower.

**Placed fights:**

| Fight | Enemies (level role) | XP |
|---|---|---|
| `c4-valley-drake` (first visit) | drake (15 brute) | 365 |
| `c4-bone-wraiths` (first visit) | bone-wraith ×2 (15 minion) | 456 |
| `c4-picket` (or hide in the barrel) | stygian ×3 (14 minion) | 633 |
| `c4-mouth-beasts` (first visit) | salamander (16 caster) + bat-swarm ×2 (14 minion) | 741 |
| `c4-echoes-bats` (or the earplugs) | bat-swarm ×3 (14 minion) | 633 |
| `c4-hoard-alarm` (or the melon swap) | stygian ×3 (14 minion) + salamander (16 caster) | 952 |
| Puzzles (robes 20, plan 20, echoes 25, bridge 25) | | 90 |
| **Before the boss** (6,677 + 3,870) | | **10,547 → Lv 16** |
| `c4-waking` (boss; ends at head 50%) | waking-head (16 boss) + waking-coil ×2 (16 boss `{hp:0.4, xp:0.3}`) | 1,178 → **11,725, Lv 17** |

Optional on top: valley drake Hunt, Bone Fields ambushes.

### Chapter V — The Night Shadizar Burned · ~25 min · Lv 17→20 · 12 rooms

They come out of the ruined Tower into present-day Shadizar at night. The ground heaves. Cultists hold the streets. The dragon is waking under the city.

Hub (changed Chapter I places): Tower Ruins (the Standing Stones in the cellar, still smoking), Street of Lamps (burning), Back Alleys (burning), Statue Square (Brannoc's face: payoff scene, `statue-brannoc` close-up; the fire has scoured off a thousand years of lamp-soot, so the face reads clearly for the first time), Gilded Jackal (refuge, inn; Abulet), the Pit (side quest 1: Doru still runs it, "even the end of the world has a betting book"), Bazaar (Hasdrubal sells from a cart: best gear), Temple Row, burning (Bel's old priest: lore payoff, the blessing and the thief's candle; **Mitra's shrine, desecrated** by the cult: in the Vault branch Zelara finds it, a scene card on `bg-temple-row@fire` where she cleanses it and prays (gives 3 `holy-water`, sets `c5-mitra-cleansed`); in the Nine branch its Look finds the oldest stone of the plinth carved "Zelara of the Stones kept this light", and Brannoc: "She kept it a thousand years. We'll keep it a night.") and its cellar (Tullia, captured by cultists, can be rescued for a redemption scene, her confession about the Khitan's gold, and a gift). Final dungeon: the Undercity (old Shadizar's buried first walls: Brannoc's own walls), the Coil Tunnels, the Throat, the Dragon's Heart.

Final sequence:
1. **The Undercity Gate**: a big battle with serpent-men (with the Redhand Company if you opened the Vault). Then **the founder's door**: the postern Brannoc's nomads hung a thousand years ago, opened by the word he gave them (the time-loop puzzle; see Puzzle chains).
2. **The Coil Tunnels** (puzzle) → **the Throat** (point of no return) → **Boss: Thoth-Seketh unmasked** (a serpent-man sorcerer with summons).
3. **Final boss: Ygg-Sothar, Between Worlds** (head, left coil, right coil; it shifts between "fire" and "void" phases at 66% and 33% of the head's HP).
4. The game writes the protected **"Before the Final Choice"** save, and **the ending choice** appears as verbs on the dragon's exposed heart (see Endings).

**Placed fights:**

| Fight | Enemies (level role) | XP |
|---|---|---|
| `c5-ruins-cultists` (arrival) | cultist-fanatic ×3 (17 minion) | 789 |
| `c5-square-cultists` (first visit) | cultist-fanatic ×2 (17 minion) + serpent-man (18 minion) | 806 |
| `c5-undercity-gate` | serpent-man ×3 (18 minion) + rift-horror (19 brute) | 1,316 |
| `c5-coil-keepers` (the junction) | rift-horror ×2 (19 brute) | 952 |
| Puzzles (founder's door 30, coil tunnels 30) | | 60 |
| **Before the bosses** (11,253 + 3,923) | | **15,176 → Lv 19** |
| `c5-thoth` (boss; summoned serpent-men give no XP) | thoth-true (19 boss) | 893 → 16,069, Lv 19 |
| `c5-final` (boss) | final-head (19 boss) + final-coil ×2 (19 boss `{hp:0.4, xp:0.3}`) | 1,429 → **17,498, Lv 20** |

Optional on top: Pit ranks (carried ranks at Lv 15, iron-bull 393, Khalla 840), Tullia's cellar (cultist-fanatic ×2), street ambushes, wrong coil tunnels.

## Endings

| Ending | How to get it | What happens | Picture · music |
|---|---|---|---|
| **A. The Wanderer** | Always offered after the final boss: "Drive the Starheart into the dragon's heart" | The heart burns out and the dragon is blasted back between worlds. Half of Shadizar falls into the pit. The future is uncertain, but not eaten yet. The party splits: Shevra with a sack of gold, Ilsa to the sea, Brannoc west toward Aquilonia. "There is always another city." **Vault-branch variant, "The Red Sails"** (when `c3-took-vault`): the Redhand Company carries the wounded out of the pit; Zelara stays to rebuild Mitra's temple on its lip; Ilsa, now queen of a fleet bought with drowned kings' gold, offers Brannoc a deck instead of a road, and he takes it: the last scene is the fleet putting out at dawn with the city smoking behind. | `bg-ending-a` · `ending` (variant: `bg-ship-deck@dusk`) |
| **B. The Dragon Crown** | Always offered: Ygg-Sothar offers Brannoc a crown over every age; "Take the crown" | Brannoc becomes the undying Dragon-King of all times. His friends turn away. The last scene: the statue's face changed into a serpent's. Dark, short, memorable. | `bg-ending-b`, then `statue-serpent` · `ancient` (the dark past theme, reused) |
| **C. Iron and Steel** | **Only if Nine was freed in Ch III** (Nine is in the party). Nine offers to join its heart to the Starheart: "Let me finish what my people began." | Nine and the heart seal the dragon out of *every* age. Shadizar stands. The future of green hills is glimpsed. Nine's iron body becomes the city's new guardian on the tower stump, and the statue now shows two figures. Best ending. | `bg-ending-c`, then `statue-two` · `ending` |

**How endings are authored (binding for the Ch V writer):** each ending is a verb on the `c5-heart` thing whose `do` list is the ending itself: a run of `scene` cards and `say`/`line` effects, written as data with `if` branches, followed by `{ ending: 'A' | 'B' | 'C' }` as the **last** effect. `ending` only records the ending in `meta` (endings found, best time) and shows the summary card (name, play time, level, "2 of 3 endings found", the two replay buttons); it shows no story text of its own. Variant lines, one `if` each, in every ending where they make sense:
- Khalla (`c5-khalla-beaten`): she holds the Pit gate against the cult, or (B) kneels to the Dragon-King and is the first he kills.
- Tullia (`c5-tullia-saved`): she reopens her house as an honest fence ("honest-ish").
- Morvan (`sq-bride`==3): Ilsa sees a ghost ship's lantern answer hers.
- The fleet (`c3-took-vault`): the Red Sails variant above, or (B) the fleet sails away from the Dragon-King's city.
- Zelara (`party:zelara`): she rededicates Mitra's temple (A), or turns her back on the throne (B). Nine (`party:nine`): Ending C is its story; in A it walks into the desert to look for its people's stars; in B it stands in front of the throne and asks Brannoc, once, to stop.

Ending ids stay A, B, C (three endings; the Red Sails is A's Vault-branch variant, counted as A).

The ending screen names the ending, shows play time, level and which other endings exist ("2 of 3 endings found"; Ending C's name is shown as "???" until found, with the hint "Some doors close in the middle of the story."), and saves found endings across playthroughs. After any ending, two buttons (also on the title screen once one ending is found):
- **Return to the Final Choice** (loads the protected `final` save: see another ending in seconds),
- **Replay from the Choice** (loads the protected `choice` save, in the Prison of Nine or the Vault, whichever socket the player first opened the choice at: about 50 minutes to the other branch).

## Side quests

Every side quest has a `chapter` (or `carry: true`) so the point-of-no-return box can list it.

1. **The Pit of Shadizar** (`sq-pit`; arena; Ch I and Ch V). Doru the Lanista runs five ranks. Ranks 5–3 open in Ch I, ranks 2–1 in Ch V. **The quest stage counts ranks beaten**: stage 0 → fight rank 5, 1 → rank 4, 2 → rank 3, 3 → rank 2, 4 → rank 1, 5 = champion. **Unfinished Ch I ranks carry over to Ch V** (Doru: "Your name's still on the slate"): Ch V fights them first, in order, using the re-levelled Lv 15 variants `sand-rat-v`, `kothian-twin-v`, `ghaul-v`, `wolf-v` (shared enemies in `data/core-enemies.js`, same sprites and purses), then ranks 2–1. Doru has one dialogue per chapter (`c1-doru`, `c5-doru`), both driven only by the `sq-pit` stage. Arena rules: no flee, no items, HP restored after.
   - Rank 5: Sand Rats (2 thugs). Lv 2+. 40 gold (the first good way to earn the rope money).
   - Rank 4: the Kothian Twins (paired swordsmen who guard each other: hit one and the other counterattacks). Lv 4+. 80 gold, Pit Gauntlets.
   - Rank 3: Ghaul the Hyrkanian archer and his two wolves. **Lv 5+**. 150 gold, Hyrkanian Bow.
   - Rank 2: the Iron Bull of Turan (armored brute: Blunt and magic work best). Lv 16+. 400 gold, Bull-Horn Helm.
   - Rank 1: **Khalla the Unbroken**, champion. Lv 18+. The Champion's Greatsword and the title; Khalla joins the defense of the city in every ending text.
2. **The Salt Witch** (`sq-witch`; Ch II). Mother Sagra, a Stygian hag in the marsh, wants three things for a love potion "for a gentleman of the sea": *a liar's hair* (snip Count Valerio while he's passed out), *a sailor's last breath* (a bottle the old drunk in the Drowned Gull breathes into: "it's my last, I swear, I'm quitting"), and *the tooth of the marsh eel* (an optional battle in the Salt Marsh). Reward: the **Witch-Knot** (immune to poison and sleep), the spell scroll **Sea-Witch's Ward** (Brannoc learns it), and the **love potion** (key item for side quest 3). The "gentleman" turns out to be the ghost captain.
3. **The Weeping Bride** (`sq-bride`; Ch III, from Wreck Beach). Rest at the camp and a ghost ship drifts offshore by night. Row out: its drowned crew fight (ghost sailors); the captain, Morvan Redhand, will rest only with his wedding ring (from the sea serpent's gut), and gives a bonus scene if you also bring Mother Sagra's love potion. He is Ilsa's grandfather. Reward: **Redhand's Cutlass** (Ilsa's best weapon until Ch V) and an emotional Ilsa scene.

Errands (small, in hubs): the scholar's spectacles (`e-spectacles`, Ch I), Fat Ommo's ledger (`e-ledger`, Ch I), the beggar's boots (`e-boots`, Ch I), Tullia's rescue (`e-tullia`, Ch V). They give gold, items, XP and lore.

**Point of no return.** Each chapter's last exit is marked `noReturn` (Ch I: Moon Stair → Tower Crown; Ch II: "Cast off" on the deck; Ch III: Gate Chamber door; Ch IV: Hoard Hall → Dragon's Bed; Ch V: Coil Tunnels → the Throat). Taking it shows a box: "You won't be able to come back here" (Ch I adds "until Chapter V"), lists open quests and errands of this chapter (and "The Pit: ranks left will wait for you" for `carry` quests), and offers **Go on** and **Not yet**.

## Puzzle chains (every item sourced, every clue in the room)

Rules for all chains:
- Every step has a clue **in the room where it's solved** (room text, a Look, or a companion's banter line), plus a Journal hint (nudge, then answer).
- Every step has a cruder alternative (usually a harder fight) unless marked.
- **Clever pays:** solving a step that replaces a fight gives the XP of that fight, with a "Clever! +N XP" toast (effect `{ xp: { as: [enemy ids] } }`). Solving a step with no fight gives the XP shown.
- Consumed key items have a **repeatable source** (marked ↻) or are single-use in exactly one place. `tools/lint-content.mjs` checks this.

### Chapter I

| Step | Needs | Source of each item | In-room clue | Alternative | XP |
|---|---|---|---|---|---|
| Gate toll | — | — | The haughty guard "hasn't blinked since the last caravan"; Shevra isn't here yet, so Brannoc's own line: "I've out-stared wolves." | Pay with the `jackal-pelt` (dropped 100% by the tutorial jackal) | 10 |
| Rope money | 40 gold | Pit rank 5 (40); Fat Ommo's ledger errand (30); sell `jackal-pelt` (15) at the Bazaar; jackal Hunt at the Gate (↻) | Hasdrubal: "Forty, and not a copper less, barbarian." | — | — |
| **Wall** → `grapnel` | `rope` + `meat-hook` (combine) | `rope`: Hasdrubal's shop, 40 g ↻. `meat-hook`: butcher's stall (Bazaar): give `bone` to the butcher's skinny dog → it runs off with the butcher after it → Take hook. `bone`: Abulet's scrap bucket (Gilded Jackal, Take ↻) | Look at the Tower Wall: "smooth, high, a lip of carved stone at the top: something with a hook could catch it". Look at the hook: "big enough to hang half a camel" | Climb verb: fails twice with damage, Shevra sighs "Hook. Rope. Bear." | 20 |
| **Hounds** → `drugged-sausage` | `sausage` + `poppy-tears` (combine) | `sausage`: Abulet sells, 5 g ↻. `poppy-tears`: Old Nimm (won't sell to Brannoc; sells to Shevra, or to anyone after the `spectacles` errand) 15 g ↻. `spectacles`: Statue Square fountain, Search (scholar at Temple Row says he lost them "feeding the pigeons by the fountain") | Garden text: "Two hounds with jaws like bear-traps; one gnaws a joint of meat, slobbering"; Shevra: "Dogs eat anything. Even trouble." | Fight 2 tower hounds | as 2× `tower-hound` |
| **Hall guards** | `knucklebones` | Fat Ommo (Thieves' Den) trades them for his `ledger`; the `ledger` is on the pickpocket in the Back Alleys (ambush fight, or Shevra's Steal on the "jumpy pickpocket" thing) | Hall text: "Two guards play knucklebones and accuse each other of cheating; one more cheat and blood will flow." | Fight 2 city-guards | as 2× `city-guard` |
| **Smiling Door** | the joke (flag `c1-joke`) | The drunk poet (Gilded Jackal) remembers it after you buy him a cup (Abulet, 3 g ↻) | Door text: "I open for one who makes me smile." Shevra: "The poet at the Jackal swears he once made a statue laugh." | Wrong jokes: bites for small damage, retry | 25 |
| **Moon Stair** | turn 3 mirrors | — (Turn verb cycles N/E/S/W) | Tullia's painting (Look): "Moon bows to the East, then the River, then the Throne"; Shevra at the painting: "Throne means the palace: north, where throne-sitters look down on us." Moon Stair text: "Slit windows: moonrise in the east; to the south, the silver thread of the river; to the north, the dome of the King's palace." Mirror 3's Look mentions the palace dome. | None needed: wrong settings are harmless; hint after two failures | 30 |
| Before the Crown | — | **Draught stash**: niche on the Moon Stair landing, 3 `healing-draught` ("Azhrim's own medicine. Rude not to.") + a free full heal at the landing's basin (once). The Moon Stair is `safe`. | — | — | — |

Errand `e-boots`: the beggar on the Street of Lamps wants boots; the first Back Alleys thug always drops `worn-boots` → beggar gives a rumor about the statue and the `lucky-coin` trinket (+5% crit).

### Chapter II

| Step | Needs | Source | In-room clue | Alternative | XP |
|---|---|---|---|---|---|
| Meet Ilsa | — | the Brig | Ilsa: "Free me, my crew and my ship, and I'll sail you to the edge of the world." | — | — |
| **Brig key** | `kraken-rum` + the right line | `kraken-rum`: the Drowned Gull, 20 g ↻ (needed twice: jailer and Valerio). The line: dialogue `c2-jailer` with four choices: "Sell you a bottle?" ("On duty!"), "Drink it yourself in front of him" (he weeps), "Dare him" ("The Count would hang me"), and the right one, **"A gift from Count Valerio, for your loyal service."** He can't refuse the Count: he drinks, snores, and you Take the `brig-key` from his belt | Brig text: "The fat jailer licks his lips every time someone mentions the Gull's black rum. A sign on his stool forbids drinking on duty, by order of Count Valerio." Jailer: "Only the Count himself could make me drink on duty, and he never gives anybody anything." | `hairpin` from the Gull's singer (pay 5 g for a song, then ask) → Use on the cell lock: Shevra picks it. Cruder: the rusted grate from the Smugglers' Tunnels (Push; after the tunnel fight) | 30 |
| Ilsa joins | brig key, hairpin or grate | — | — | — | — |
| **Signet** | flatter Valerio + `kraken-rum` | Harbor Office: Valerio recites poetry (comic dialogue: three wrong compliments, one right); he invites you to drink and a `goblet` thing appears; Use `kraken-rum` on goblet → he passes out (flag `c2-valerio-out`, stays out for the chapter) → Shevra lifts the `valerio-signet` | Valerio's poetry is pinned all over the walls; Shevra: "A man who writes this much wants to be told it's good." | none for the signet (dialogue retries freely) | 30 |
| **Release order** | `valerio-signet` + `blank-order` (combine; the signet is kept) | `blank-order`: Harbor Office desk, Take ↻ ("a whole drawer of them") | Desk text: "Blank release orders, waiting for the Count's seal." | — | 15 |
| **Crew and ship** (one step) | `sealed-order` (shown, kept) | Debtors' Pen: show it to the clerk; he frees the crew and stamps the order a second time for the *Sea-Wolf* (flag `c2-ship-free`); the harbor guard at the gangplank stands aside from then on | The clerk "holds every paper upside down"; Ilsa: "A clerk will free anything with enough wax on it." | Pay the clerk 200 g (same result) | 15 |
| **Sluice** (dungeon) | `boat-hook` | dropped 100% by the marines (`c2-marines`, Customs Warehouse) | Tunnels text: "Black water fills the passage to the roof. A sluice wheel stands in the wall; its iron spoke has snapped off at the hub. Tide-marks show the water drains when the wheel turns." | Swim it: the tunnel eels attack (marsh-eel ×2), then you're through | 20 |
| **Sea-chest** | — | Drowned Cistern: beat Gull-Eye Marro (`c2-marro`) → chest: charts (flag `c2-charts`), `ilsa-longcoat`, 150 g | Ilsa on the deck: "No charts, no Isle. I'm not sailing blind into a sea that eats ships." | — (it's a fight) | battle |
| Cast off | `c2-ship-free` & `c2-charts` & Ilsa | the deck's "Cast off" verb (point of no return) | — | — | — |

Side quest items: `liar-hair` (Snip verb on the passed-out Valerio, appears when `quest:sq-witch>=1`), `empty-bottle` (Gull barkeep, Talk ↻) → Use on the old drunk → `last-breath`; `eel-tooth` (Salt Marsh "Eel waters" thing, verb Fish → fight `marsh-eel`, 100% drop, ↻ until held). Deliver all three to Sagra → `witch-knot`, `sea-witch-ward` (learned), `love-potion`.

### Chapter III

| Step | Needs | Source | In-room clue | Alternative | XP |
|---|---|---|---|---|---|
| Glyphs | — | Hall of Glyphs: Ptahk reads the mural | The mural: "a door of two eyes; a sleeper of one; a vault of one; a ring that drinks a heart"; "Weigh the way before you walk it" (over the Power Wells arch) | — | 20 |
| **Cell 1** (Power Wells) | `coconut` | Jungle Path palm, verb Shake ↻ | Wells text: "Some plates are thick with dust; others gleam, as if something heavy rolled across them." Shevra: "Throw something first. Not me." | Walk it: the floor sinks, 3 `iron-husk` attack, then you get the cell | as 3× `iron-husk` |
| **Cell 2** (Iron Graveyard) | — | the sentinel husk that still fights | "One husk's chest still glows; its fingers twitch." | — (it's a fight) | battle |
| **Cell 3** (Ape Rocks) | `valerio-signet` | kept from Ch II | Ape Rocks text: "The chief's nest glitters with bottle glass, a brass button, a gull ring. A young ape trades a shiny shell for a heap of bananas." Shevra: "He's a fence. I like him." | Fight the `ape-chief` and two `man-ape` | as that fight |
| **The Choice** | 3 `star-cell` | — | Nine (Look): "Its chest socket is the size of a star-cell." Vault socket (Look): same. Ilsa's crew grumbling at the Beach and Vault. | — | 50 |
| Gate door | 2 `star-cell`, `flag:c3-choice-made` | — | Door: "Two empty sockets, like eyes." | — | 20 |

Side quest 3: Wreck Beach "Camp" thing, verb Rest (free inn; sets `c3-night`) → the "Ghost ship" thing appears, verb Row out → Ghost Ship room → 2 `ghost-sailor` fights → Morvan; Use `wedding-ring` on Morvan → rest; also Use `love-potion` for the bonus scene → `redhand-cutlass`.

### Chapter IV

| Step | Needs | Source | In-room clue | Alternative | XP |
|---|---|---|---|---|---|
| **Robes** | `long-arm` = `thorn-branch` + `sling-cord` (combine) | `thorn-branch`: Scorched Valley dead tree, Take ↻. `sling-cord`: Shevra gives it when you Look at the drying line ↻ ("Too far. Find me a stick and I'll lend you my sling cord.") | Cult Picket text: "Black robes flap on a line strung across a gully, out of reach." | — | 20 |
| Password | — | Cult Picket: the "Wine barrel" thing, verb Hide in → overhear "Ssssss... with feeling" (flag `c4-password`) | "A wine barrel stands by the picket fire; the guards keep demanding the word from each other." | Fight the picket (3 `stygian`), then walk in robed but flagged as a stranger: one more fight in camp | as that fight |
| Into the camp | `cult-robes` & `c4-password` | — | Exit blocked text: "Robes and the word, or a spear in the belly." | — | — |
| Learn the plan | — | Cult Camp: overheard talk (auto on first visit): the heart lies on the **weighing-altar**: "if its weight changes by a hair, the altar screams"; "the heart weighs like a ripe melon" (echoing Ch I's Starheart Look: "heavy as a melon, warm, and it beats") | — | — | 20 |
| **Hall of Echoes** | `earplugs` (Use `beeswax` on "the party") | `beeswax`: Grandmother Kesh's candles, Talk ↻ | Dragon's Mouth text: "Every cultist who comes out of the deep has wax plugs in his ears." Echoes: "A cough comes back as a thousand." | Walk in talking: bat swarm battle (`bat-swarm` ×3), thrown back to the Mouth; repeatable | 25 |
| **Molten Bridge** | `frost-flask` (single use) or `snow-melon` | `frost-flask`: given by Zelara at the Nomad Camp in both branches (Mitra's frost-water; as she joins in the Vault branch, as an NPC in the Nine branch). `snow-melon`: Bone Fields hermit, Talk ↻ whenever none is held ("I've a cellar full. Snow from the high peaks, packed in melons. Don't ask.") | Bridge: "The crust cracks and glows; where a drip of water fell, it went black and hard." | — | 25 |
| **Hoard** → `starheart` | `fake-starheart` = `snow-melon` + `glow-moss` (combine) | `glow-moss`: Dragon's Mouth walls, verb Scrape ↻ | Altar Look: "a bronze scale-pan, the heart in it, the pan humming at its weight". Shevra: "Swap it. Same weight, same glow. Easy." | Grab it: the altar screams, fight 3 `stygian` + `salamander`; you keep the heart | as that fight |
| Dragon's Bed | — | — | Kesh's "shout Crom's name" line (told in camp; repeated by Shevra at the Hoard Hall exit) | — | — |
| **Founder's word** (time-loop plant) | — | First Walls: Kesh asks for the door-word; inline choice Crom / Melon / Shevra sets var `c4-door-word` = 1 / 2 / 3; the pictogram is cut under the door's mouth | Kesh: "A founder's door opens for one word. Choose one you'll remember." | — (no wrong answer) | — |

### Chapter V

| Step | Needs | Source | In-room clue | Alternative | XP |
|---|---|---|---|---|---|
| The way down | — | Statue Square: the fountain has collapsed into a hole (exit `d` to the Undercity) | — | — | — |
| **Founder's door** (time loop) | the word Brannoc gave in Ch IV | — (verb **Speak** on the door: Crom / Melon / Shevra / Set / Mitra / "Open, curse you"; right when it equals `var:c4-door-word`) | Undercity text: "A postern in walls older than the city, carved with a hand holding a star: the same hand as the statue's. It has no handle, only a stone mouth, and under the mouth a worn pictogram." The pictogram's Look describes the one cut in Ch IV (a storm-crowned mountain / a round fruit / a woman with a knife). Shevra: "You were there, Bear. What word did you give them?" | Wrong word: the mouth spits a cloud of thousand-year dust ("Not that one, founder"), retry; Journal hint gives the answer | 30 |
| **Coil Tunnels** | `thief-candle` (optional) | Temple of Bel: the old priest, Talk ↻ | Three tunnel mouths; Look: one "breathes warm, slow, like a sleeper". The candle's flame leans toward the living air. | Wrong tunnel: ambush, then back to the junction (never a dead end) | 30 |

Tullia (`e-tullia`): Temple Cellar, fight 2 `cultist-fanatic` → Tullia's redemption scene → `serpent-charm` trinket (resist Void/poison). Bel's blessing (Talk priest after his lore) → flag `c5-bel-blessing`: +10% RES for the final dungeon.

## Core loop

- **10 seconds:** read a scene, tap an exit, a thing, or a verb; get a line of prose (often funny), maybe an item.
- **1 minute:** explore a room's things, notice a problem (a wall, a hound, a door), carry items around, combine them, solve it; or fight a battle (3–6 rounds).
- **Session:** finish a chain of puzzles to open the next area, get stronger, find better gear, push the story to the next twist; side quests and the arena for rewards.
- **The mechanic it lives or dies by:** **the scene-and-verb interaction** (looking at things, taking, using items on things, talking). It must be fast, tactile and full of good writing. Battles are the second pillar: quick, readable, with weapon types that matter.

## Controls

### Desktop (mouse + keyboard)

| Action | Mouse | Keyboard |
|---|---|---|
| Go | click an exit button | arrow keys / N, E, S, W; U/D for up/down; or type "go north" |
| Look around | Look button | L or type "look" |
| Interact | click a thing chip, then a verb (Look, Talk, Take, Use, Open, Turn...) | type "take rope", "talk to shevra", "use grapnel on wall" |
| Use / combine items | Bag → item → Use on... / Combine with...; or thing → Use → item | type "use X on Y", "combine X with Y" |
| Dialogue | click a choice | 1–9 |
| Battle | click a command, then a target | 1–9 for commands, then 1–9 for targets, Esc back; A auto, R repeat |
| Menus | Bag, Party, Journal, Map, Menu buttons | I, P, J, M (map), Esc (menu) |
| Continue text | Continue button | Space or Enter |

### Phone (portrait)

| Action | Touch |
|---|---|
| Everything | big buttons (at least 48 px tall, the main ones 56) in a bottom action dock, thumb reach |
| Dock tabs | **Go** (exits), **Here** (things and people), **Bag**, **Party**, **More** (journal, map, save, settings); one tab's buttons open at a time, at most two rows |
| Battle | the dock becomes the command menu; enemies are tappable in the picture; target lists also appear as buttons |
| Dialogue | choices are full-width buttons in the dock |

## Phone layout and height budget

The picture is drawn on a 320×180 canvas at the **largest whole-number scale in device pixels** that fits (`k = floor(min(availW·dpr/320, maxH·dpr/180))`, CSS size = 320k/dpr), with `image-rendering: pixelated`, framed by a bronze CSS border. On common phones this is exactly 320×180 CSS px (dpr 2 or 3). A fractional scale is used only above 3× (large desktops). Battles darken the picture; they never zoom it.

Exploring shows a **thin party row** (28 px: name initial + HP/MP pips per member; tap to expand into the full strip). The full strip (48×48 faces, HP/MP bars) shows only in battle and when expanded. The picture can **collapse to a 48 px banner** (tap the room name), remembered in settings; it auto-expands for battles and illustrated scene cards.

| Size (CSS px) | Layout | Height budget (top → bottom) | Text log gets |
|---|---|---|---|
| **375×667** (small phone, portrait) | one column | top bar 32 · picture 180 (≤ 27%) · party row 28 · log · dock 156 (tabs 44 + two 48 px rows + gaps) | **271 px** (403 with the picture collapsed) |
| **390×844** (modern phone, portrait; safe areas ≈ 47 top, 34 bottom) | one column | 47 · 32 · 180 · 28 · log · 156 · 34 | **367 px** |
| **852×393** (phone landscape; side insets ≈ 47) | two columns: left 320 (top bar, picture, party strip), right ≈ 420 (log above dock) | left: 32 + 180 + 160 full strip = 372 · right: log + dock 156 | **237 px** |
| **1280×720** (desktop) | picture 2× (640×360) over the log on the left; right sidebar 300 px: party strip and dock | 40 · 360 · log | **320 px** |
| **800×600** (small desktop) | picture capped at 45% of height → 1× (320×180) centred; sidebar 260 px | 40 · 180 · log | **380 px** |

Rules: the dock never covers the log (the log scrolls above it); safe-area insets are respected; no rotate overlay; text size setting (S/M/L) reflows only the log. Every size above is in the definition of done.

## Systems

### Exploration
- Rooms have a picture, a name, a description that changes with flags, exits (compass directions with destination names once visited), and **things** (people and objects) with verbs.
- **Verbs** per thing: Look (always), Talk (people), Take, Use (an item on it), and special verbs (Open, Turn, Push, Climb, Search, Read, Shake, Scrape, Hide in...). Only verbs that do something are shown for a thing, plus Look and Use.
- **New markers:** a gold dot on a thing chip that has never been looked at or has a `hot` condition true, and on an exit that leads to an unvisited room; the Here and Go tabs show a dot when any of their buttons has one.
- **Use item on**: Bag → item → "Use on…" lists the things here and "the party"; or thing → Use → item list. Item lists show **key items first, newest at the top**. A wrong item gives a funny refusal line, never a dead end, followed by a one-tap **"Try another item"** button that reopens the list.
- **Combine** two key items in the Bag (rope + meat hook = grapnel).
- **Banter**: companions comment on some rooms and things (first visit only), in character.
- **Hints**: the Journal shows the current objective and a **Hint** button with two levels per puzzle (a nudge, then the answer).
- **No dead ends**: no required item can be lost before it's used; consumed items have repeatable sources; every condition can become true. Checked by `tools/lint-content.mjs`.

### Battle
- Front view: enemies stand on the scene picture (darkened, not zoomed); the party strip shows faces with HP and MP bars.
- Turn order by Agility each round, shown as a small queue.
- Commands: **Attack** (labelled with the active weapon's type, e.g. "Attack · Blunt"), **Skills** (MP), **Item**, **Defend** (halve damage, +2 MP), **Swap** (toggle weapon ↔ sidearm; **free once per turn**: it doesn't use the member's action, a second Swap in the same turn is disabled; the button shows the other weapon's type), **Study** (Look at one enemy: reveals its weak/resist/immune; uses the action), **Flee** (only in ambush and Hunt battles; chance by party Agility). Every fight written as a `fight` effect is `noFlee` (see the schema), so a story fight can never be skipped into a dead end.
- **Speed and repetition:** **Auto** (this round: each member attacks the weakest enemy with a *known* weakness, swapping to the sidearm if it hits a known weakness; healers heal anyone under 40% HP; no items, no MP above half), **Auto until done** (a toggle; stops when an ally drops below 30% HP or a boss changes phase), **Repeat** (last round's commands; dead targets re-target to the weakest). Battle speed setting 1× / 2× / Instant.
- **Weapon types matter.** Every weapon is **Slash**, **Pierce** or **Blunt**; spells are **Fire**, **Lightning**, **Cold**, **Holy**, **Star** or **Void** (Void is the dragon's and its servants' element: the party has no Void attacks, only the `serpent-charm` and Sea-Witch's Ward against it). Weak ×1.5 ("WEAK!"), resist ×0.5, immune ×0. Weaknesses become *known* after a hit of that type lands or after **Study** (Look in battle); known weaknesses show on the enemy card.

| Enemy family | Weak | Resist | Immune |
|---|---|---|---|
| Men (thug, bandit, smuggler, pickpocket, Pit fighters) | Pierce | — | — |
| Beasts (jackal, hound, wolf, hyena, man-ape, bat-swarm) | Slash | — | — |
| Serpents and eels (river-serpent, Khurath, Mother of Coils, marsh-eel) | Slash, Cold | Fire | — |
| Armored men (city-guard, marine, Iron Bull) | Blunt | Slash | — |
| Shelled things (scorpion, spider) | Blunt, Fire | Pierce | — |
| Iron dead and constructs (iron-husk, sentinel, brass-serpent) | Blunt, Cold | Lightning, Fire | — |
| Bones and wraiths (bone-wraith) | Blunt, Holy | Slash, Pierce | — |
| Ghosts (ghost-sailor) | Holy, Star, Fire | — | Slash, Pierce, Blunt |
| Cultists and sorcerers (cultist, stygian, Azhrim, Thoth-Seketh; curses are Void) | Pierce, Holy | — | — |
| Serpent-men and the void (serpent-man, rift-horror; attacks are Void) | Holy, Star | Cold | Void |
| Fire creatures (drake, salamander) | Cold | — | Fire |
| Ygg-Sothar, fire phase | Cold, Star | Slash | Fire |
| Ygg-Sothar, void phase (attacks are Void) | Holy, Star | Pierce | Cold, Void |

  Every party has an answer: Brannoc carries a sidearm (usually Blunt), Nine's piston module is Blunt and Last Light is Star, Zelara is Holy/Blunt, Ptahk has Fire and Lightning, Frost Flasks give anyone Cold.
- Damage: `atk = STR + weapon power`; `dmg = max(1, round((atk × mult − DEF × 0.5) × rand(0.9, 1.1)))`; crit chance `5% + AGI/4 %` for ×1.6. Magic: `(WIL + spell power) × mult − RES × 0.5`.
- Status effects: Poison (5% max HP per turn), Sleep (skip until hit), Stun (skip one turn), Burn (4% max HP per turn, −DEF), Blind (−50% hit), Fear (can't use skills), ATK/DEF/RES up/down for 3 turns.
- **Defeat** → "You fall. Crom laughs." → **Retry** (restores the state from just before this battle, party at full HP and MP, and fights it again: nothing given before the fight is given twice and nothing taken is lost) or **Load the autosave**. Never lose more than one room.
- After a win: XP and gold; loot; level-up screen with what improved. All members in the party get full XP.
- **Battle triggers** (scripted moments) fire at HP thresholds, rounds or deaths: the Ch IV ceiling collapse, the final boss's phase changes, Thoth-Seketh's summons, the Redhand Company's bombardment.

### Characters and growth (see Balance for numbers)
- Stats: HP, MP, STR, AGI, WIL, DEF, RES. Level cap 25. Joining members come in at `max(given level, Brannoc's level)`.
- Brannoc: Cleave (all foes, Lv 1), War Cry (party ATK up, Lv 4), Crom's Fury (huge single hit, Lv 9), Unbroken (survive one killing blow, Lv 13), Iron Wind (heavy hit to all, Lv 17). **Starfire** (Star; only while the Starheart is in the bag: end Ch I → Ch III betrayal, and from the Ch IV hoard to the end). **Sea-Witch's Ward** (party RES up + cures Sleep; side quest 2).
- Shevra: Steal (Lv 1), Backstab (×2 crit on a foe targeting someone else, Lv 3), Smoke Powder (party evasion, Lv 7), Venom Edge (poison, Lv 10), Thousand Cuts (Lv 15).
- Ptahk: Lotus Flame (Fire, Lv 1), Mend (heal, Lv 1), Sleep Dust (Lv 6), Jade Ward (party DEF up, Lv 8), Thunder of Khitai (Lightning, all, Lv 10).
- Ilsa: Broadside (hits all, Lv 1), Rally (small party heal + cure Fear, Lv 1), Grapnel Snare (stun, Lv 9), Captain's Luck (crit up, Lv 12), Storm of Blades (Lv 16).
- Nine: Lightning Eye (Lightning, all, Lv 1), Repair Field (party heal, Lv 1), Shield Lattice (party DEF/RES up, Lv 14), Cryo Lance (Cold, one, Lv 15), Overclock (one ally acts twice, Lv 17), Last Light (huge Star damage, Lv 19).
- Zelara: Light of Mitra (Holy, Lv 1), Healing Hands (Lv 1), Purify (cure all status, Lv 14), Sanctuary (party regen, Lv 15), Dawn Hammer (Blunt + Holy physical, Lv 16), Sunburst (Holy, all, Lv 18).

### Items and inventory (quality of life)
- **Bag tabs**: All · Weapons · Armor · Trinkets · Consumables · Key Items. **Sort** by Newest, Type, Power, Value. Stack counts.
- Every item card shows: icon, name, a one-line flavor text, stats, type (Slash/Pierce/Blunt), who can equip it (portrait dots), and for gear, the **change for each party member** (+3 ATK in green, −2 DEF in red).
- **Equip screen** per member: slots **Weapon, Sidearm, Body, Head, Off-hand, Trinket**. Tap a slot to list only what fits, sorted best first, with deltas. **Best** auto-equips the strongest gear (and as sidearm the best weapon of a *different* damage type); **Best for all**. Two-handed weapons (greatsword, staff, bow, spear) block the Off-hand slot.
- **New** badge on items not yet looked at. **Junk** (monster trophies) is grey and sells in one tap: "Sell all junk".
- Key items live in their own tab, can't be sold or dropped, and disappear when their job is done (with a line saying so).
- Shops: buy/sell lists with the same deltas and "who can use it", quantity picker for consumables, and a confirmation for anything over 200 gold.
- Consumables: Healing Draught (40 HP), Great Draught (120), Elixir of Bel (full HP), Mana Lotus (20 MP), Antidote, Smelling Salts (revive at 25%), Fire Flask (thrown Fire), Frost Flask (thrown Cold), Holy Water (Holy), Smoke Bomb (guaranteed flee).
- Weapons cover the requested range (see Balance → Gear for ids and numbers): swords, greatswords, axes, maces and hammers, spears, daggers, slings and throwing knives, bows, cutlasses and sabers, staves and rods, Nine's modules, Zelara's maces.

### Saving
- **Autosave** (slot `auto`) on entering every room, written **before** the room's `enter`/`first` effects run, so loading re-runs them; never during battle, dialogue or a running effect list. 3 manual slots (`1`–`3`). Save anywhere when idle.
- **Protected slots**, written only by story effects and never by autosave: `choice` ("Before the Choice", Ch III) and `final` ("Before the Final Choice", Ch V). Where they are written is fixed in the schema (Saving): `choice` by the first effect of the Nine verb and of the Vault-socket verb, guarded by `!flag:c3-choice-made` and never inside a `once`, storing the state as it was when that tap started (the player idle in the Prison of Nine or the Vault with all 3 cells); `final` right after the final boss's `win` sets `c5-dragon-down`. Loadable from Load and, once any ending is found, from the title and ending screens (`title:choice`, `title:final`, `ending:choice`, `ending:final`).
- Endings found and best play time are kept across saves (`barbarain.v1.meta`). Settings (music, sound, text speed, text size, battle speed, picture collapsed, easy) are separate.
- Save format: JSON under `barbarain.v1.slot.<auto|1|2|3|choice|final>` with a `version`. Broken saves are caught and ignored with a message.

## Balance

All numbers live in `game/src/data/balance.js` (lead builder); chapter writers import `enemyStats` and never invent stats. `tools/balance.mjs` (Node) sums each chapter's placed-fight XP (+ `xp` effects) against the level bands (the lists under each chapter in "Story by chapter") and simulates every boss with the **pre-boss party** (Auto policy, seeded): the members actually present at that boss, at the "before the boss" level of that chapter's fights list, wearing the snapshot gear upgraded by **Best** from the chapter's shop, with the chapter's guaranteed consumables. Specifically: Azhrim with Brannoc + Shevra at Lv 5 plus the 3 Moon Stair draughts; Khurath with four at Lv 9; Mother of Coils with Brannoc, Shevra, Ilsa at Lv 13 (ends at 50%); the Waking with four at Lv 16 (ends at head 50%); Thoth-Seketh and the final dragon with four at Lv 19, in both branches. It must report each boss as winnable in 4–12 rounds and each chapter ending within ±1 level of its band, using no Hunt and no side content.

### Party stats

`stat(L) = round(base + growth × (L − 1))`

| Member | HP | MP | STR | AGI | WIL | DEF | RES |
|---|---|---|---|---|---|---|---|
| Brannoc | 60 +14 | 8 +1.5 | 12 +2.2 | 8 +1.2 | 4 +0.6 | 6 +1.4 | 3 +0.8 |
| Shevra | 42 +9 | 12 +2 | 9 +1.6 | 14 +2.0 | 6 +0.8 | 4 +1.0 | 4 +0.9 |
| Ptahk | 36 +7 | 24 +4 | 5 +0.8 | 7 +1.0 | 14 +2.2 | 3 +0.8 | 8 +1.6 |
| Ilsa | 50 +11 | 12 +2 | 11 +1.9 | 11 +1.6 | 6 +0.8 | 5 +1.2 | 4 +1.0 |
| Nine | 55 +12 | 20 +3.2 | 10 +1.6 | 7 +1.0 | 12 +2.0 | 8 +1.6 | 7 +1.4 |
| Zelara | 44 +9 | 22 +3.6 | 8 +1.2 | 8 +1.0 | 13 +2.1 | 5 +1.2 | 9 +1.7 |

Examples: Brannoc Lv 6: HP 130, STR 23, DEF 13. Lv 20: HP 326, STR 54, DEF 33. Shevra Lv 20: HP 213, AGI 52.

Skill numbers: spells `power` 12 (tier 1), 24 (tier 2), 40 (tier 3), 60 (ultimate: Last Light, Sunburst); Starfire's power is `20 + 2 × Brannoc's level`; MP 4 / 8 / 14 / 22. Physical skills multiply ATK: Cleave 0.7 all, Crom's Fury 2.2, Iron Wind 1.2 all, Broadside 0.8 all, Storm of Blades 1.3 all, Thousand Cuts 4 hits × 0.6, Dawn Hammer 1.4 Blunt+Holy. Heals: Mend/Healing Hands `WIL × 2 + 20`, Repair Field / Rally party `WIL + 15`.

### XP curve and level bands

XP to go from level L to L+1: `round(20 × L^1.6)`. Cumulative XP to *reach* a level: Lv 6 = 644, Lv 10 = 2,676, Lv 14 = 6,677, Lv 17 = 11,253, Lv 20 = 17,376.

| Chapter | Band | XP the chapter must provide | Placed fights before the boss | Puzzle `xp` | Boss(es) | Chapter total (end level) |
|---|---|---|---|---|---|---|
| I | 1 → 6 | 644 | 323 | 85 | 307 + escape 153 | 868 (Lv 6) |
| II | 6 → 10 | 2,032 | 1,700 | 110 | 387 | 2,197 (Lv 10) |
| III | 10 → 14 | 4,001 | 3,421 | 90 | 584 | 4,095 (Lv 14) |
| IV | 14 → 17 | 4,576 | 3,780 | 90 | 1,178 | 5,048 (Lv 17) |
| V | 17 → 20 | 6,123 | 3,863 | 60 | 893 + 1,429 | 6,245 (Lv 20) |

Each chapter's own list (under "Story by chapter") names every fight, its enemies with level and role, and its XP; "before the boss" lands at band top − 1 and the boss XP carries the party to the band top. Solving a puzzle instead of its fight gives the same XP ("Clever!"), so the totals hold either way. Side quests, errands, ambushes and Hunt are on top of the band (doing them puts you about one level ahead, which is the reward). Quest `xp` effects use these sizes: errand 40 × chapter, side-quest step 60 × chapter, side-quest completion 150 × chapter.

### `enemyStats(level, role, mul = {})`

Base at level L, then multiplied by the role (and optional per-stat `mul` overrides, e.g. `{ hp: 0.5 }` for boss parts), rounded:

| Base | hp | atk | def | res | agi | xp | gold |
|---|---|---|---|---|---|---|---|
| formula | 18 + 11L | 6 + 3.2L | 2 + 1.4L | 1 + 1.1L | 5 + 1.3L | 11 × L^1.12 (= 4.4 × 2.5, the round-2 scale) | 2 + 1.5L |

| Role | hp | atk | def | res | agi | xp | gold | Notes |
|---|---|---|---|---|---|---|---|---|
| minion | ×1 | ×1 | ×1 | ×1 | ×1 | ×1 | ×1 | groups of 2–4 |
| brute | ×1.8 | ×1.25 | ×1.4 | ×0.7 | ×0.8 | ×1.6 | ×1.5 | 1–2 per group |
| caster | ×0.8 | ×1.15 (as magic power) | ×0.7 | ×1.6 | ×1 | ×1.3 | ×1.3 | uses elemental skills |
| boss | ×5 | ×1.3 | ×1.3 | ×1.3 | ×1.1 | ×3 | ×10 | parts use `{ hp: 0.4, xp: 0.3 }` each. Boss XP ×3 (not ×6) so a boss gives about the last level of its band, not two |

Example numbers:

| Call | hp | atk | def | res | agi | xp | gold |
|---|---|---|---|---|---|---|---|
| `enemyStats(1,'minion')` (jackal) | 29 | 9 | 3 | 2 | 6 | 11 | 4 |
| `enemyStats(3,'minion')` | 51 | 16 | 6 | 4 | 9 | 38 | 7 |
| `enemyStats(5,'boss',{hp:0.8})` (Azhrim) | 292 | 29 | 12 | 8 | 13 | 200 | 95 |
| `enemyStats(10,'minion')` | 128 | 38 | 16 | 12 | 18 | 145 | 17 |
| `enemyStats(13,'boss')` (Mother of Coils) | 805 | 62 | 26 | 20 | 24 | 584 | 215 |
| `enemyStats(18,'caster')` | 173 | 73 | 19 | 33 | 28 | 364 | 38 |
| `enemyStats(20,'brute')` | 428 | 88 | 42 | 16 | 25 | 504 | 48 |
| `enemyStats(19,'boss')` (final head) | 1135 | 87 | 37 | 28 | 33 | 893 | 305 |
| `enemyStats(19,'boss',{hp:0.4,xp:0.3})` (final coil) | 454 | 87 | 37 | 28 | 33 | 268 | 305 |

Easy mode: enemies −30% HP and damage.

### Gear power per chapter

| Tier | Chapter | Where | Weapon power | Heavy armor DEF (body / head / shield) | Light armor DEF (body / head) | Price band |
|---|---|---|---|---|---|---|
| I | Ch I | Hasdrubal, Pit, loot | 8–16 | 5 / 2 / 3 | 3 / 1 (+AGI or WIL 2) | 40–250 |
| II | Ch II | Argossean Arms (Messantia docks), loot | 16–24 | 10 / 4 / 5 | 7 / 3 (+4) | 250–650 |
| III | Ch III | Sea-Wolf quartermaster (Wreck Beach), loot, Vault | 26–34 (Kingsbane 40) | 15 / 6 / 8 | 10 / 4 (+6) | 600–1,200 |
| IV | Ch IV | Kesh's barter, loot | 34–42 | 20 / 8 / 11 | 14 / 6 (+8) | 1,000–1,800 |
| V | Ch V | Hasdrubal's cart, Pit | 44–52 (Champion's Greatsword 56) | 26 / 10 / 14 | 18 / 7 (+10) | 1,800–3,000 |

Prices: weapons `round(power² / 5) × 5`, armor `round(12 × DEF^1.5 / 5) × 5`.

Named gear (ids, all in `game/src/data/core-items.js`, written by the lead):

| Tier | Weapons (id · kind · type · power) | Armor and trinkets (id · slot · DEF/effect) |
|---|---|---|
| I | `rusty-broadsword` sword S 8 (start) · `broadsword` sword S 12 · `hand-axe` axe S 13 · `iron-mace` mace B 12 · `boar-spear` spear P 13 · `zamorian-stiletto` dagger P 10 · `throwing-knives` thrown P 9 · `sling` sling B 8 · `khitan-staff` staff B 9 · `short-bow` bow P 11 · `hyrkanian-bow` bow P 16 (Pit 3) | `leather-harness` body 3 · `iron-cap` head 2 · `buckler` off 3 · `thief-leathers` body 3 +AGI 2 · `silk-robe` body 2 +WIL 2 · `pit-gauntlets` trinket +STR 3 · `lucky-coin` trinket +5% crit |
| II | `akbitanan-blade` sword S 20 · `nordheimer-axe` axe S 22 · `war-hammer` mace B 20 · `kris` dagger P 18 · `steel-knives` thrown P 17 · `lead-sling` sling B 16 · `barachan-cutlass` cutlass S 18 (Ilsa start) · `argos-saber` cutlass S 21 · `oak-rod` staff B 16 +WIL 4 | `mail-shirt` body 10 · `steel-helm` head 4 · `round-shield` off 5 · `shadow-leathers` body 7 +AGI 4 · `embroidered-robe` body 6 +WIL 4 · `ilsa-longcoat` body 9 +AGI 2 · `witch-knot` trinket (immune poison, sleep) |
| III | `watcher-blade` sword S 32 · `aesir-hammer` mace B 31 · `hyrkanian-lance` spear P 30 · `iron-dead-shiv` dagger P 29 · `reaver-bow` bow P 28 · `serpent-rod` staff B 26 +WIL 8 · `redhand-cutlass` cutlass S 34 (side quest 3) · `kingsbane` axe S 40 (Vault) | `scale-hauberk` body 15 · `horned-helm` head 6 · `kite-shield` off 8 · `nightcloak` body 10 +AGI 6 · `star-amulet` trinket +RES 6 |
| IV | `bronze-khopesh` sword S 38 · `bone-maul` mace B 38 · `drake-tooth` dagger P 36 · `nomad-bow` bow P 35 · `piston-module` module B 34 (Nine start) · `sun-mace` mace B 34 +WIL 6 (Zelara start) | `drakescale` body 20 · `bronze-helm` head 8 · `bone-shield` off 11 · `nomad-silks` body 14 +AGI 8 · `mitran-vestment` body 13 +WIL 8 (Zelara start) |
| V | `bel-blade` sword S 48 · `stygian-greataxe` axe S 50 · `shadizars-fang` dagger P 46 · `star-lance-module` module P 48 · `hammer-of-bel` mace B 48 · `champions-greatsword` greatsword S 56 (Pit 1) | `gilded-plate` body 26 · `bull-horn-helm` head 10 (Pit 2) · `tower-shield` off 14 · `thief-kings-mail` body 18 +AGI 10 · `serpent-charm` trinket (resist Void, poison) |

Consumable ids: `healing-draught` (15 g), `great-draught` (60), `elixir-of-bel` (400), `mana-lotus` (30), `antidote` (10), `smelling-salts` (50), `fire-flask` (40), `frost-flask-item`* (40), `holy-water` (40), `smoke-bomb` (30). *`frost-flask-item` is the shop consumable (thrown Cold); the Ch IV key item `frost-flask` is a separate id so the bridge puzzle never depends on shop stock. Using a `frost-flask-item` on the Molten Bridge also works (an extra way, never a requirement).

## Manifest

The lead builder turns this section into `game/src/content/manifest.js` (exported constants) and `game/src/data/`. **Chapter writers use only these ids for anything that crosses a chapter boundary.** Anything a writer invents must be prefixed `c<N>-` (rooms already are) and must not be read by another chapter.

### Id rules
- Rooms: `c1-…` … `c5-…` (all listed below). Chapter flags: `c<N>-…`. Chapter-only items, dialogues, enemies, shops, scripts: `c<N>-…` unless listed here.
- Portrait ids = npc ids, except where the table says otherwise; minor people without their own portrait use `generic-man` / `generic-woman` with their own name.
- Asset ids (pictures, sprites, icons, music, sfx) are only those in the Asset list.

### Cross-chapter key items

| Id | Name | Set (given) in | Read (used) in | Notes |
|---|---|---|---|---|
| `starheart` | The Starheart | Ch I (Tower Crown) | Ch I–III (Starfire), Ch III (Gate ring: taken by Thoth), Ch IV (Hoard: given back; the Stones home), Ch V (Endings A/C) | never sold; Look: "heavy as a melon, warm, and it beats". Pictures: icon `assets/icons/starheart.png` (32×32) and sprite `assets/sprites/starheart.png` (64×64, used by `scene: { img: 'starheart' }`: drawn at 2× centred on Night Indigo) |
| `valerio-signet` | Valerio's Signet | Ch II (Harbor Office) | Ch II (release order, kept), Ch III (Ape Rocks trade, consumed) | |
| `wedding-ring` | A Drowned Man's Ring | Ch II (Khurath, 100%) | Ch III (Morvan) | |
| `love-potion` | Sagra's Love Potion | Ch II (`sq-witch` reward) | Ch III (Morvan bonus scene) | optional |
| `star-cell` | Star-cell (stack) | Ch III (×3) | Ch III only | listed because the rule is shared with the Gate |
| `frost-flask` | Frost Flask (key) | Ch IV (Zelara, at the camp, both branches) | Ch IV (Molten Bridge) | |

Chapter-only key items (owned by that chapter's writer, ids fixed here so hints and lint agree): Ch I `rope`, `meat-hook`, `bone`, `grapnel`, `sausage`, `poppy-tears`, `drugged-sausage`, `spectacles`, `ledger`, `knucklebones`, `worn-boots`; junk `jackal-pelt`. Ch II `kraken-rum`, `hairpin`, `brig-key`, `blank-order`, `sealed-order`, `boat-hook` (icon `meat-hook@grey`), `empty-bottle`, `last-breath`, `liar-hair`, `eel-tooth`. Ch III `coconut`. Ch IV `thorn-branch`, `sling-cord`, `long-arm`, `cult-robes`, `beeswax`, `earplugs`, `snow-melon`, `glow-moss`, `fake-starheart`. Ch V `thief-candle`.

### Cross-chapter flags, vars and quests

| Id | Kind | Set by | Read by | Meaning |
|---|---|---|---|---|
| `c1-statue-seen` | flag | Ch I (Look statue) | Ch V (square payoff: extra line "You've stared at that jaw before") | |
| `c1-done` | flag | Ch I end | snapshots | |
| `c2-ptahk-eyes` | flag | Ch II (Oasis scene) | Ch III (betrayal: Shevra "I knew that smoke was no smoke") | always set on the main path |
| `c2-done` | flag | Ch II end | snapshots | |
| `c3-choice-made` | flag | Ch III | Ch III (Gate door) | |
| `c3-freed-nine` | flag | Ch III | Ch IV (Nine joins), Ch V, Ending C | exclusive with the next |
| `c3-took-vault` | flag | Ch III | Ch IV (Zelara joins), Ch V (Redhand Company), Ending A text | |
| `c3-done` | flag | Ch III end | snapshots | |
| `c4-done` | flag | Ch IV end | snapshots, Ch V (Kesh's carved name joke) | |
| `c4-door-word` | var 1–3 | Ch IV (First Walls) | Ch V (founder's door) | 1 Crom, 2 Melon, 3 Shevra; snapshots use 2 |
| `c5-tullia-saved` | flag | Ch V | endings | |
| `c5-khalla-beaten` | flag | Ch V (Pit rank 1) | endings | |
| `c5-bel-blessing` | flag | Ch V | Ch V final battles | |
| `c5-dragon-down` | flag | Ch V (final boss win) | ending verbs | |
| `sq-pit` | quest 0–5 (ranks beaten) | Ch I (1–3), Ch V (any left, 4–5) | Ch V Doru, endings | `carry: true` |
| `sq-witch` | quest 0–4 (4 = done) | Ch II | Ch III (Morvan mentions Sagra) | `chapter: 2` |
| `sq-bride` | quest 0–3 (3 = done) | Ch III | endings | `chapter: 3` |
| `ch1-main` … `ch5-main` | quest | each chapter | Journal | `main: true` |
| `e-spectacles`, `e-ledger`, `e-boots` | quest | Ch I | — | `chapter: 1` |
| `e-tullia` | quest | Ch V | endings via `c5-tullia-saved` | `chapter: 5` |

### NPCs

| Id | Name | Ch | Portrait | Notes |
|---|---|---|---|---|
| `tullia` | Madam Tullia | I, V | `tullia` | |
| `abulet` | Abulet the tavernkeeper | I, V | `abulet` | |
| `hasdrubal` | Hasdrubal the armorer | I, V | `hasdrubal` | shops `c1-hasdrubal`, `c5-cart` |
| `nimm` | Old Nimm | I | `nimm` | |
| `ommo` | Fat Ommo | I | `ommo` | |
| `doru` | Doru the Lanista | I, V | `doru` | |
| `khalla` | Khalla the Unbroken | I (seen), V | `khalla` | battle sprite `khalla-fight` |
| `poet` | the drunk poet | I | `poet` | |
| `azhrim` | Azhrim the Collector | I | `azhrim` | battle sprite `azhrim-fight` |
| `iron-watcher` | the Iron Watcher | I | `iron-watcher` | |
| `bel-priest` | the old priest of Bel | I, V | `bel-priest` | |
| `guard-captain` | the haughty gate guard | I | `generic-man` | |
| `butcher`, `scholar`, `beggar`, `pickpocket` | minor | I | `generic-man` | |
| `valerio` | Count Valerio | II | `valerio` | |
| `jailer` | the fat jailer | II | `jailer` | |
| `sagra` | Mother Sagra | II | `sagra` | |
| `singer`, `barmaid` | minor | II | `generic-woman` | |
| `old-drunk`, `clerk`, `harbor-guard` | minor | II | `generic-man` | |
| `morvan` | Morvan Redhand | III | `morvan` | |
| `kesh` | Grandmother Kesh | IV | `kesh` | shop `c4-barter` |
| `hermit` | the melon hermit | IV | `hermit` | |
| `thoth-seketh` | Thoth-Seketh | III–V | `thoth-seketh` | battle sprite `thoth-true` |
| `ygg-sothar` | Ygg-Sothar | IV–V | `ygg-sothar` | speaks in the boss fights and Ending B; portrait = a 96×96 crop of the `dragon-final-head` sprite (no generation) |
| `arms-keeper` | the Argossean armorer | II | `generic-man` | shop `c2-arms` (Docks) |
| `quartermaster` | the *Sea-Wolf*'s quartermaster | III | `generic-man` | shop `c3-quartermaster` (Wreck Beach) |
| `kesh-grandson` | Kesh's grandsons | IV | `generic-man` | the dome props; the founder's door |
| `zelara` (as NPC) | Zelara | IV (Nine branch) | `zelara` | the party id doubles as the NPC id when she doesn't join |
| party | `brannoc`, `shevra`, `ptahk`, `ilsa`, `nine`, `zelara` | — | same ids | `line: ['shevra', '…']` |

### Room table (all five chapters)

Picture ids may carry a code tint after `@`: `night` (blue multiply, darker), `dusk` (amber-violet), `fire` (orange glow + ember overlay), `dark` (−50% brightness), `fog` (grey-green wash), `void` (violet, slow shimmer). Map x,y: integer grid per chapter, y grows south; exits follow map adjacency unless noted (`u`/`d`/`in`/`out` exits may connect non-adjacent cells). Ambience ids are optional loops.

**Chapter I** (start `c1-gate`)

| Room id | Name | Picture | Music | Map | Notes |
|---|---|---|---|---|---|
| `c1-gate` | The Desert Gate | `bg-desert-gate` | `shadizar` | 2,5 | tutorial jackal; Hunt (jackals) |
| `c1-street` | Street of Lamps | `bg-street` | `shadizar` | 2,4 | hub; amb `amb-crowd`; beggar |
| `c1-tavern` | The Gilded Jackal | `bg-tavern` | `shadizar` | 1,4 | safe; inn |
| `c1-den` | Thieves' Den | `bg-thieves-den` | `shadizar` | 0,4 | Fat Ommo |
| `c1-bazaar` | The Bazaar | `bg-bazaar` | `shadizar` | 3,4 | amb `amb-crowd`; shops |
| `c1-square` | Statue Square | `bg-statue-square` | `shadizar` | 2,3 | statue close-up `statue-worn` on Look |
| `c1-pit` | The Pit | `bg-arena` | `shadizar` | 1,3 | amb `amb-crowd`; Doru |
| `c1-temple-row` | Temple Row | `bg-temple-row` | `shadizar` | 3,3 | |
| `c1-tullia` | Tullia's House | `bg-tullia` | `shadizar` | 1,2 | the painting |
| `c1-alley` | Back Alleys | `bg-alley` | `shadizar` | 2,2 | ambush 25%; escape ambush at chapter end |
| `c1-tower-wall` | The Tower Wall | `bg-tower-wall` | `heist` | 3,2 | |
| `c1-tower-garden` | The Tower Garden | `bg-tower-garden` | `heist` | 4,2 | |
| `c1-tower-hall` | The Tower Hall | `bg-tower-hall` | `heist` | 5,2 | Smiling Door `u` |
| `c1-undercroft` | The Undercroft | `bg-undercroft` | `heist` | 5,3 | optional; `d` from the hall; giant spider |
| `c1-moon-stair` | The Moon Stair | `bg-moon-stair` | `heist` | 5,1 | safe; draught stash; `u` is `noReturn` |
| `c1-crown` | The Tower Crown | `bg-tower-crown` | `heist` | 5,0 | boss music `boss`; after the boss: `bg-tower-crown@fire` |

**Chapter II** (start `c2-road`)

| Room id | Name | Picture | Music | Map | Notes |
|---|---|---|---|---|---|
| `c2-road` | The Caravan Road | `bg-desert-road` | `road` | 0,1 | ambush 30%; Hunt |
| `c2-oasis` | Oasis of Bones | `bg-oasis` | `road` | 1,1 | safe; night camp; Ptahk's eyes |
| `c2-marsh` | The Salt Marsh | `bg-salt-marsh` | `road` | 1,2 | amb `amb-jungle`; eel waters; Hunt |
| `c2-witch` | The Witch's Hut | `bg-witch-hut` | `road` | 0,2 | Sagra |
| `c2-mgate` | Messantia Gate | `bg-messantia@dusk` | `sea` | 2,1 | |
| `c2-docks` | The Docks | `bg-messantia` | `sea` | 3,1 | hub; amb `amb-sea`; Argossean Arms shop |
| `c2-gull` | The Drowned Gull | `bg-harbor-tavern` | `sea` | 3,0 | safe; inn; rum |
| `c2-office` | Harbor Office | `bg-harbor-office` | `sea` | 4,0 | Valerio |
| `c2-warehouse` | Customs Warehouse | `bg-warehouse` | `sea` | 4,1 | marines battle; trapdoor `d` to the tunnels |
| `c2-tunnels` | The Smugglers' Tunnels | `bg-sea-tunnels` | `sea` | 4,3 | dungeon; smugglers; sluice (blocks `e`); `u` to the warehouse; rusted grate `n` up into the Brig |
| `c2-cistern` | The Drowned Cistern | `bg-sea-tunnels@dark` | `sea` | 5,3 | Gull-Eye Marro; Ilsa's sea-chest |
| `c2-pen` | The Debtors' Pen | `bg-jail` | `sea` | 3,2 | crew; clerk |
| `c2-brig` | The Brig | `bg-jail@dark` | `sea` | 4,2 | Ilsa; jailer |
| `c2-deck` | Deck of the *Sea-Wolf* | `bg-ship-deck` | `sea` | 5,1 | amb `amb-sea`; "Cast off" is `noReturn` |
| `c2-open-sea` | The Open Sea | `bg-ship-deck@dusk` | `sea` | 6,1 | banter event |
| `c2-storm` | The Storm | `bg-storm` | `sea` | 7,1 | amb `amb-storm`; boss Khurath (`boss`) |

**Chapter III** (start `c3-beach`)

| Room id | Name | Picture | Music | Map | Notes |
|---|---|---|---|---|---|
| `c3-beach` | Wreck Beach | `bg-beach` (`bg-beach@night` when `c3-night`) | `isle` | 1,3 | safe; rest; quartermaster shop; amb `amb-sea` |
| `c3-ghost-ship` | The Ghost Ship | `bg-ghost-ship` | `isle` | 0,3 | side quest 3; `in`/`out` from the beach |
| `c3-jungle` | Jungle Path | `bg-jungle` | `isle` | 1,2 | amb `amb-jungle`; coconut palm; Hunt |
| `c3-ape-rocks` | The Ape Rocks | `bg-ape-rocks` | `isle` | 0,2 | cell 3 |
| `c3-river` | Serpent River | `bg-serpent-river` | `isle` | 2,2 | amb `amb-jungle`; river-serpent fight |
| `c3-gateway` | The Ruined Gateway | `bg-ruined-gateway` | `isle` | 1,1 | |
| `c3-graveyard` | The Iron Graveyard | `bg-iron-graveyard` | `isle` | 2,1 | cell 2 (sentinel); reached only across the river ford (no `w` exit to the gateway: a fallen wall) |
| `c3-glyphs` | Hall of Glyphs | `bg-glyph-hall` | `isle` | 1,0 | the mural |
| `c3-wells` | The Power Wells | `bg-power-wells` | `isle` | 0,0 | cell 1 |
| `c3-prison` | The Prison of Nine | `bg-prison-nine` | `isle` | 2,0 | the choice (protected save `choice`) |
| `c3-vault` | Vault of the Drowned Kings | `bg-vault` | `isle` | 0,1 | the choice (other side) |
| `c3-gate-chamber` | The Gate Chamber | `bg-gate-chamber` | `isle` | 1,-1 | entered by `noReturn` door `n` from the glyphs hall; boss (`boss`) |

**Chapter IV** (start `c4-stones`)

| Room id | Name | Picture | Music | Map | Notes |
|---|---|---|---|---|---|
| `c4-stones` | The Standing Stones | `bg-standing-stones` | `ancient` | 0,2 | Nine waits here if freed; burned Mitran shrine |
| `c4-valley` | The Scorched Valley | `bg-ancient-valley` | `ancient` | 1,2 | thorn tree; Hunt (drakes) |
| `c4-camp` | The Nomad Camp | `bg-nomad-camp` | `ancient` | 1,3 | safe; Kesh; Zelara (joins, or gives the Frost Flask); barter |
| `c4-bones` | The Bone Fields | `bg-bone-fields` | `ancient` | 2,3 | hermit; ambush 30% |
| `c4-picket` | The Cult Picket | `bg-cult-camp@dusk` | `ancient` | 2,2 | drying line; wine barrel |
| `c4-cult` | The Cult Camp | `bg-cult-camp` | `ancient` | 3,2 | needs robes + password |
| `c4-mouth` | The Dragon's Mouth | `bg-dragon-caves` | `ancient` | 3,1 | amb `amb-fire`; glow-moss |
| `c4-echoes` | The Hall of Echoes | `bg-dragon-caves@dark` | none (silence) | 4,1 | needs earplugs |
| `c4-bridge` | The Molten Bridge | `bg-molten-bridge` | `ancient` | 5,1 | amb `amb-fire` |
| `c4-hoard` | The Hoard Hall | `bg-hoard` | `ancient` | 5,0 | weighing-altar; exit to the Bed is `noReturn` |
| `c4-bed` | The Dragon's Bed | `bg-hoard@fire` | `boss-dragon` | 6,0 | boss: the Waking |
| `c4-walls` | The First Walls | `bg-founding` | `ending` | 1,1 | twist 3; Kesh; the door-word; return through the Stones |

**Chapter V** (start `c5-ruins`)

| Room id | Name | Picture | Music | Map | Notes |
|---|---|---|---|---|---|
| `c5-ruins` | The Tower Ruins | `bg-tower-ruins` | `finale` | 3,0 | amb `amb-fire` |
| `c5-street` | Street of Lamps, Burning | `bg-burning-street` | `finale` | 2,1 | amb `amb-fire`; ambush 30% |
| `c5-alley` | Back Alleys, Burning | `bg-alley@fire` | `finale` | 3,1 | |
| `c5-tavern` | The Gilded Jackal | `bg-tavern@night` | `shadizar` | 1,1 | safe; inn; Abulet |
| `c5-square` | Statue Square | `bg-burning-square` | `finale` | 2,2 | `statue-brannoc` payoff; `d` to the Undercity |
| `c5-pit` | The Pit | `bg-arena@night` | `finale` | 1,2 | Doru; ranks |
| `c5-bazaar` | The Bazaar | `bg-bazaar@fire` | `finale` | 3,2 | Hasdrubal's cart |
| `c5-temple` | Temple Row, Burning | `bg-temple-row@fire` | `finale` | 4,2 | Bel's priest; blessing; candle; Mitra's desecrated shrine |
| `c5-cellar` | The Temple Cellar | `bg-undercroft@dark` | `finale` | 4,3 | Tullia (`d` from the temple) |
| `c5-undercity` | The Undercity | `bg-undercity` | `finale` | 2,3 | Undercity Gate battle; founder's door (Speak) |
| `c5-coils` | The Coil Tunnels | `bg-dragon-caves@void` | `finale` | 2,4 | tunnel puzzle; exit to the Throat is `noReturn` |
| `c5-throat` | The Throat | `bg-dragon-caves@fire` | `finale` | 2,5 | boss Thoth-Seketh (`boss`) |
| `c5-heart` | The Dragon's Heart | `bg-dragon-heart` | `boss-dragon` | 2,6 | final boss; protected save `final`; ending verbs |

(Ch II has 16 rooms with the tunnels; Ch V has 13 counting the cellar; the cellar is optional.)

Chapter cards: Ch I `bg-street`, Ch II `bg-desert-road`, Ch III `bg-beach`, Ch IV `bg-ancient-valley`, Ch V `bg-burning-street`. Prologue: `bg-prologue` (music `title`), defined in `ch1.js` as `prologue: { img: 'bg-prologue', music: 'title', text: [...] }` and shown by the engine on New Game, before Ch I's card. Title: `bg-title`.

### Enemies (id · sprite[ + tint] · level · role · family)

Writers define their chapter's enemies as `{ ...enemyStats(level, role, mul), name, sprite, tint, size, weak, resist, immune, skills, desc }` using the family table for weaknesses. Tints are written explicitly: `sprite: 'thug', tint: 'grey'` (the engine also accepts `sprite: 'thug@grey'`; prefer the explicit form). Shared ones (used in two chapters) are defined by the lead in `data/core-enemies.js` (marked ●). Bosses sit at **band top − 1** so they are met at the level the placed fights deliver.

| Ch | Enemies |
|---|---|
| I | `jackal` jackal 1 minion beast · `thug`● thug 2 minion men · `city-guard` 3 brute armored · `cultist`● 3 caster cultist · `tower-hound` 3 brute beast · `giant-spider` spider 5 brute shelled · `pickpocket` thug + grey 2 minion men · `brass-serpent` 5 brute `{hp: 0.6}` construct · `azhrim` azhrim-fight 5 boss `{hp: 0.8}` sorcerer · `tullia-blade` thug + red 4 minion men · Pit●: `sand-rat` thug + tan 2 minion men · `kothian-twin` twin-swordsman 4 minion men (×2) · `ghaul` 6 brute men · `wolf` jackal + grey 5 minion beast |
| II | `scorpion` 7 minion shelled · `bandit` 7 minion men · `hyena` 8 minion beast · `marsh-eel` 9 brute serpent · `marine` 9 brute armored · `smuggler` bandit + teal 8 minion men · `smuggler-chief` (Gull-Eye Marro) bandit + red 9 brute men · `khurath` sea-serpent 9 boss serpent |
| III | `ghost-sailor` 11 minion ghost · `man-ape` 11 minion beast · `ape-chief` man-ape + gold 13 brute beast · `river-serpent` 12 brute serpent · `iron-husk` 12 minion iron · `sentinel` 13 brute iron · `mother-of-coils` 13 boss serpent |
| IV | `stygian` 14 minion cultist · `stygian-priest` cultist + violet 15 caster · `bat-swarm` drake + dark 14 minion beast (size `s`) · `drake` 15 brute fire · `bone-wraith` 15 minion bones · `salamander` 16 caster fire · `waking-head` dragon-waking-head 16 boss · `waking-coil` dragon-waking-coil 16 boss `{hp: 0.4, xp: 0.3}` ×2 |
| V | `cultist-fanatic` cultist + red 17 minion cultist · `serpent-man` 18 minion void · `rift-horror` 19 brute void · `thoth-true` 19 boss sorcerer (summons serpent-men, which give no XP) · `final-head` dragon-final-head 19 boss · `final-coil` dragon-final-coil 19 boss `{hp: 0.4, xp: 0.3}` ×2 · Pit: `sand-rat-v`, `kothian-twin-v`, `ghaul-v`, `wolf-v`● (carried ranks, Lv 15) · `iron-bull` 16 brute armored · `khalla` khalla-fight 18 boss `{hp: 0.6}` (no weakness) |

**Sizes and width caps** (picture units): `s` 48 tall × ≤ 64 wide, `m` 72 × ≤ 80, `l` 100 × ≤ 100, `xl` 140 × ≤ 150. `pixelize.py sprite --h <size> --w <cap>` fits each sprite in that box (its defaults are these caps). Multi-part bosses: head `xl` (`--w 150`), coils `l` (`--w 80`), prompts say "compact, coiled, head-on".

**Battle layout rule** (engine): enemies stand bottom-aligned at y=170 with slot centres by count: 1 → 160; 2 → 110, 210; 3 → 70, 160, 250; 4 → 50, 120, 200, 270. Total width stays within x 10–310 (≤ 300); neighbours may overlap by up to 16 px, the later slot drawn in front. Fixed positions override the slots: multi-part bosses head at 160, coils at 60 and 260 (right coil mirrored in code); Azhrim at 200 with the brass serpent at 90. Summons fill free slots (max 4 on screen).

### Chapter-start snapshots (`__game.chapter(n, branch)`)

State at the moment the chapter card shows, before `startDo`. Snapshots are **cumulative**: each holds the whole state at that point (every flag, quest stage, var and learned non-level skill from all earlier chapters), never a delta from the previous one. Fields: `party` (id: level), `gold`, `equip`, `items`, `flags`, `quests`, `vars`, `learn` (skills taught by effects, e.g. `sea-witch-ward`; level skills come from the level). Members are at the given level with skills by level; gear is equipped as listed (main / sidearm; body, head, off-hand, trinket). Typical gold assumes ordinary play with the side content of earlier chapters done.

| Snapshot | Party (level) | Gold | Gear | Bag | Flags / quests |
|---|---|---|---|---|---|
| `ch1` | Brannoc 1 | 0 | rusty-broadsword; leather-harness | 2 healing-draught | — |
| `ch2` | Brannoc, Shevra, Ptahk 6 | 180 | B: broadsword / iron-mace; leather-harness, iron-cap, buckler, pit-gauntlets · S: zamorian-stiletto / sling; thief-leathers, lucky-coin · P: khitan-staff; silk-robe | starheart; 4 healing-draught, 2 mana-lotus, 1 antidote | `c1-done`, `c1-statue-seen`; `sq-pit`=3 |
| `ch3` | Brannoc, Shevra, Ptahk, Ilsa 10 | 450 | B: akbitanan-blade / war-hammer; mail-shirt, steel-helm, round-shield, witch-knot · S: kris / lead-sling; shadow-leathers · P: oak-rod; embroidered-robe · I: barachan-cutlass / steel-knives; ilsa-longcoat | starheart, valerio-signet, wedding-ring, love-potion; 5 healing-draught, 2 great-draught, 3 mana-lotus | + `c2-done`, `c2-ptahk-eyes`; `sq-witch`=4; Brannoc knows `sea-witch-ward` |
| `ch4` branch `nine` | Brannoc, Shevra, Ilsa 14 (Nine joins at the Stones, 14) | 700 | B: watcher-blade / aesir-hammer; scale-hauberk, horned-helm, kite-shield, witch-knot · S: iron-dead-shiv / lead-sling; nightcloak · I: redhand-cutlass / reaver-bow; ilsa-longcoat, star-amulet | 6 healing-draught, 4 great-draught, 4 mana-lotus, 2 smelling-salts (no starheart) | + `c3-done`, `c3-choice-made`, `c3-freed-nine`; `sq-bride`=3 |
| `ch4` branch `zelara` | same three, 14 (Zelara joins at the camp, 14) | 3,200 | as above but B: kingsbane / aesir-hammer | as above | + `c3-done`, `c3-choice-made`, `c3-took-vault`; `sq-bride`=3 |
| `ch5` branch `nine` | Brannoc, Shevra, Ilsa, Nine 17 | 1,400 | B: bronze-khopesh / bone-maul; drakescale, bronze-helm, bone-shield, witch-knot · S: drake-tooth / lead-sling; nomad-silks · I: redhand-cutlass / nomad-bow; ilsa-longcoat, star-amulet · N: piston-module; (built-in armor: body DEF 16) | starheart; 6 great-draught, 4 mana-lotus, 3 smelling-salts, 2 frost-flask-item | + `c4-done`; `sq-pit`=3; var `c4-door-word`=2 |
| `ch5` branch `zelara` | Brannoc, Shevra, Ilsa, Zelara 17 | 3,600 | as above but B: kingsbane / bone-maul · Z: sun-mace; mitran-vestment, bronze-helm | as above | + `c4-done`, `c3-took-vault`; `sq-pit`=3; var `c4-door-word`=2 |

## Structure and difficulty

| Ch | Area | New things | Boss | Party level |
|---|---|---|---|---|
| I | Shadizar | exploration, verbs, combining, shops, arena, Brannoc + Shevra, then Ptahk | Azhrim the Collector | 1→6 |
| II | Road, marsh, Messantia, sea | weapon-type weaknesses matter, sidearms, Ilsa, travel, side quest 2 | sea serpent Khurath | 6→10 |
| III | Isle of the Iron Dead | ruins, the choice, side quest 3, the betrayal | Mother of Coils | 10→14 |
| IV | the valley, a thousand years ago | stealth heist, Nine or Zelara, multi-part boss, battle triggers | Ygg-Sothar, the Waking | 14→17 |
| V | burning Shadizar and below | the payoff, arena finals, endings | Thoth-Seketh, Ygg-Sothar | 17→20 |

- **Learning:** Ch I's first scenes teach Look, Take, Go, Talk, then one fight with a jackal, then using and combining items, with the Journal pointing the way. Early battles are easy.
- **Challenge:** bosses need the right weapon types, buffs and healing; the final boss needs a full party, good gear, and the arena or side quest rewards help a lot.
- **Avoiding frustration:** retry any battle at once with full HP; hint button; no dead ends; clever solutions pay full XP; a Hunt button for grinding if stuck; an "Easy" setting (enemies −30% HP and damage) switchable any time; the Journal always says where to go next; point-of-no-return warnings.

## Win, lose and progress

- Win: reach one of the three endings. Lose a battle: retry (from just before the battle) or reload; never lose more than one room.
- Saved: autosave per room, 3 slots, protected `choice` and `final` slots, endings found, settings.

## Screens

- **Title:** key art, the BarbarAIn logo (drawn in a bundled font), New Game, Continue, Load, Settings, Credits; once an ending is found, also Return to the Final Choice and Replay from the Choice. "Tap to begin" first so audio can start.
- **Prologue:** a short illustrated intro (`bg-prologue`: "Know, O traveler, that between the years when the oceans drank Atlantis…": original wording, in Howard's chronicle style).
- **Explore:** picture with room name (tap to collapse), the text log, thin party row, action dock (Go / Here / Bag / Party / More), an optional command field on desktop.
- **Dialogue:** portrait (96×96), name, line, choices.
- **Battle:** enemies on the darkened picture, damage numbers, turn queue, party strip, command menu (Attack · type, Skills, Item, Defend, Swap, Flee, Auto, Repeat), target selection.
- **Bag, Equip, Party (stats and skills), Shop, Journal (objective, quests, hints), Map (visited rooms of the chapter, current room marked, unvisited exits dotted), Save/Load, Settings (music, sound, text speed, text size, battle speed, easy mode, typed commands on/off), Credits.**
- **Chapter cards** between chapters (title, art, one line), **Point of no return** box.
- **Level up**, **Game over** (retry/load), **Ending** screens.

## Juice

- (must) Text appears with a quick fade per paragraph (instant on tap; a "text speed" setting).
- (must) Hit flash and shake on enemies; damage numbers pop up; "WEAK!" and "CRIT!" tags; screen shake on big hits and boss roars.
- (must) Sound on every button, hit, spell, pickup and level up; a sting (`sting-solved`) when a puzzle is solved, with a gold glow on the item.
- (must) Picture crossfades between rooms; battle starts with a short swipe and a drum hit.
- (should) Enemies idle with a 1 px bob (whole pixels only: sprites are never scaled, so the pixel grid holds); bosses bob 1 px on a slower beat; the Starheart sprite glows by brightness pulse (filter, not scale) when shown.
- (should) Level up: a golden burst over the portrait, stats tick up.
- (should) Item gain toast that slides in at the top of the log, not over the picture.
- (nice) Weather overlays in code: rain at sea, embers in burning Shadizar and `@fire` rooms, dust in the desert.

## Art direction

- **Style line (paste into every prompt):** "16-bit SNES-era pixel art, sword-and-sorcery, rich and moody: warm lamplight gold and amber, deep indigo night, blood red and verdigris bronze; crisp dark outlines, dithered shading, limited palette, no text, no letters."
- **Anchors (made first, in this order):**
  1. `style-anchor.png`: the portrait of **Brannoc**: black-maned Cimmerian, blue eyes, scarred, bare-chested with a leather harness, broadsword hilt over the shoulder. Reference for **portraits only**.
  2. `anchor-enemy.png`: a **full-body Set cultist** (hooded, serpent-scale robe, curved knife, full figure head to feet, standing). Reference for **every enemy and boss sprite**, so monsters don't grow human torsos from a bust.
  3. `bg-street`: the Street of Lamps, the **scene anchor**. Every nanogen scene passes it as a reference with: "Use this image only for its palette, lighting and pixel rendering; make a new composition." Before the scene batch, test three very different scenes (`bg-storm`, `bg-iron-graveyard`, `bg-dragon-heart`) and look at them; adjust the prompt wording once if they drift.
- **Reference-file rule:** the accepted **full-resolution** candidates of the three anchors are copied to `.gamegen/anchors/` (`style-anchor.png`, `anchor-enemy.png`, `bg-street.png`), and those files are what every later prompt passes as its reference image: never the pixelized 96×96 / 320×180 game assets. Every **enemy and portrait** prompt ends with: "Reference image is for style only (palette, outline weight, shading, pixel rendering); do not copy its subject, pose or clothing." 
- **Master palette:** `game/assets/palette.png`, 47 colours (built by `tools/pixelize.py palette`): ramps from the seven key hues — Lamplight Gold #E8B04B, Desert Amber #C9773A, Night Indigo #1C1F3A, Blood Red #A3262A, Verdigris #3E8C7A, Bone #E9DEC4, Ink #0E0C12 — plus foliage green, skin, sea/Starheart blue, stone grey and sorcery violet. **Every** image is quantized against this one palette.
- **Pixelize pipeline** (`tools/pixelize.py`, already in the repo; run it on the anchor first and look at the result):
  1. Chroma-key removal if the source has a key colour (`--key`).
  2. Crop to the target aspect (scenes) or trim to the alpha bounding box (sprites).
  3. Downscale **LANCZOS to 2× the target, then NEAREST to 1×** (no box filter: crisp, not mushy).
  4. Sprites: bleed edge colour into transparent pixels, then **threshold alpha to 1 bit at 128** (no halos).
  5. Quantize the RGB against the master palette (Pillow can't median-cut RGBA, so RGB and alpha are handled separately): **Floyd–Steinberg dither for scenes, no dither for sprites, portraits and icons**.
  6. Sprites, portraits and icons: add a **1 px Ink (#0E0C12) outline**.
  7. Modes: `scene` (320×180), `sprite --h <size>`, `portrait` (96×96), `icon` (32×32), `sheet` (cuts a grid into named icons).
- **Scenes:** 320×180 PNG (nanogen 16:9, 1K).
- **Portraits:** 96×96, transparent. Shown at 1× (phones) or 2× (desktop) in dialogue. Every portrait prompt asks for "head and shoulders, face in the upper-centre third, head fills about half the frame", so the default face crop usually fits. The party strip uses a **48×48 face crop** cut from the 96×96 portrait at 1× (an integer crop, not a scale): `pixelize.py face <id>.png <id>-face.png --at x,y`, default `--at 24,8`; look at each crop and move the point when the face sits elsewhere, and record every crop point used in `design/ASSETS.md` (column "Face at").
- **Enemies:** transparent sprites facing the viewer or 3/4 view, in a box of height × width cap: `s` 48 × 64, `m` 72 × 80, `l` 100 × 100, `xl` 140 × 150 (`pixelize.py sprite --h <h> --w <cap>`). Variants are code tints of a base sprite (`tint` field; see Code tints).
- **Multi-part bosses:** separate sprites `dragon-waking-head` (xl, `--w 150`), `dragon-waking-coil` (l, `--w 80`), `dragon-final-head` (xl, `--w 150`), `dragon-final-coil` (l, `--w 80`); prompts ask for "compact, coiled, head-on" so they fill a narrow box. Positions follow the **battle layout rule** in the Manifest (head 160, coils 60/260, right coil mirrored; Azhrim 200, brass serpent 90; slots for 1–4 ordinary enemies within 300 px). Fire and void phases are code tints.
- **Code tints** (multiply over the sprite or icon, outline kept Ink): `grey` #8A8A90, `red` #C0403A, `tan` #C8A878, `gold` #E8B04B, `violet` #8A4FB0, `teal` #3E8C7A, `blue` #4A7FD0, `green` #6AAE4A, `orange` #E07A2A, `cyan` #7AD8E8, `white` #F0E8D8, `steel` #9AA8B8, `bone` #E9DEC4, `dark` (−50% brightness). Picture tints (`night`, `dusk`, `fire`, `dark`, `fog`, `void`) are listed with the room table.
- **Key art beyond rooms:** `bg-prologue`, `bg-founding` (the nomads raising the first walls and carving the statue), `bg-prison-nine` (room), and the **statue close-up set** made from one base by nanogen edits (same framing, 320×180): `statue-worn` (Ch I, a weathered, soot-black Cimmerian jaw; made from the scene anchor as style reference), `statue-brannoc` (Ch V, clearly Brannoc's face, soot burned off: an edit of `statue-worn` that **also passes `.gamegen/anchors/style-anchor.png`** for the face), `statue-serpent` (Ending B, an edit of `statue-brannoc`), `statue-two` (Ending C, Brannoc and an iron figure: an edit of `statue-brannoc` that **also passes the accepted full-res `nine` portrait** for the iron figure).
- **Icons:** 32×32. **Sheet rules:** each sheet is generated on a **flat chroma-key background (#FF00FF, no transparency, no shadows)**, objects drawn separately with **wide gutters** (at least a quarter of a cell between objects, nothing touching), in row-major order of the names. `pixelize.py sheet --key '#ff00ff'` removes the key, finds objects by **connected components** and cuts them only if the object count equals the name count; otherwise it falls back to the fixed grid and says so (then look at every icon, and regenerate the sheet once if any is wrong). Sheet 1: **20 category icons, 5 columns × 4 rows, 1536×1024**; sheets 2–3: **16 key-item icons each, 4 × 4, 1024×1024**. Each object is trimmed and centred in 32×32.
- **Tinted icon variants (code, no generation):** `drugged-sausage` = `sausage@green`, `sealed-order` = `blank-order@red`, `earplugs` = `beeswax@grey`, `fake-starheart` = `snow-melon@blue`, `boat-hook` = `meat-hook@grey`, `thief-candle` = `scroll@gold`, `key` (generic fallback for a key item with no icon) = `brig-key`. **Consumables** each get their own colour of `potion`: `healing-draught` @red, `great-draught` @violet, `elixir-of-bel` @gold, `mana-lotus` @blue, `antidote` @green, `smelling-salts` @tan, `fire-flask` @orange, `frost-flask-item` @cyan, `holy-water` @white, `smoke-bomb` @grey (already in `data/core-items.js`).
- **Starheart sprite:** one imagegen2 candidate (blue-white glowing core in a bronze-ringed socket shape, transparent) pixelized twice: `assets/sprites/starheart.png` 64×64 (scene cards: `scene: { img: 'starheart' }` draws it at 2× centred on Night Indigo, pulsing by brightness) and `assets/icons/starheart.png` 32×32 (bag icon). Also the source for the app icon.
- **UI:** dark leather-and-bronze panels drawn in CSS (borders, gradients), not images. Fonts (bundled, OFL files present in `game/fonts/`): **Metal Mania** (title and headings), **Alegreya** (prose), **Pixelify Sans** (UI labels and numbers).
- **Tool settings (pinned):**
  - nanogen: always `--model flash --size 1K` (`--aspect 16:9` for scenes); never `pro` or 2K (the skill's own asset table suggests pro 2K for backgrounds, which would double the price). Scenes pass the scene anchor with `--image`.
  - imagegen2: `--background transparent` for sprites, portraits, icons; `--quality low` for normal enemies, minor portraits and retries; `--quality medium` for the two anchors, party portraits, bosses and icon sheets; size `1024x1024` (portraits, sprites, icons) or `1024x1536` (tall full-body anchor and bosses). Default model (flare); don't pass `--model`.
  - Every image goes to `.gamegen/candidates/` first; only accepted takes are pixelized into `game/assets/`.

## Audio direction

**Music** (looping, instrumental, `--force-instrumental`, 60 s each except `title` 75 s):

| Id | Mood | Used in |
|---|---|---|
| `title` | epic: brass and war drums, choir pad, a lonely horn (the theme). Made first; its description is reused in the others for a common voice | title, prologue, credits |
| `shadizar` | decadent city: oud, hand drums, low strings, a sly melody | Ch I hub, Ch V tavern |
| `heist` | tense pizzicato strings, soft frame drum, creeping | Ch I tower rooms |
| `battle` | driving drums and low brass, fast | ordinary battles, Pit ranks 5–2 |
| `boss` | heavier, choir and timpani | Azhrim, Khurath, Mother of Coils, Thoth-Seketh, Khalla |
| `boss-dragon` | vast, dissonant choir, deep drums, a rising horn version of the theme | both Ygg-Sothar fights, `c4-bed`, `c5-heart` |
| `road` | desert travel: frame drum walk, dusty strings, wind | Ch II road, oasis, marsh, witch |
| `sea` | rolling strings and drums like oars, a shanty lilt | Ch II Messantia and the ship |
| `isle` | jungle drums, eerie metallic shimmer (the iron dead) | Ch III |
| `ancient` | sparse bone flutes, deep drone, dragon-breath swells | Ch IV; **Ending B** (dark, reused) |
| `finale` | burning city: full orchestra, urgent | Ch V (except tavern and the heart) |
| `ending` | the theme, slow and noble | Endings A and C, `c4-walls` |

**Loop seams:** music has no seamless-loop option. `audio.js` plays each track as a buffer and, 2 s before its end, starts a second copy from 0 and crossfades (equal-power, 2 s) into it, so the seam is masked; per-track loop points can be trimmed later (`loopEnd`) if a tail is silent.

**Stings** are made with `audiogen sfx` (not music): `sting-victory` (3 s fanfare), `sting-gameover` (gong and low drone, 4 s), `sting-solved` (bright pluck and chime, 1.5 s).

**Sound effects** (generated with `audiogen sfx`, 0.5–2 s): `slash`, `pierce`, `blunt`, `crit`, `enemy-die`, `hurt`, `bite`, `fire`, `lightning`, `cold`, `holy`, `star`, `buff`, `debuff`, `roar` (generic monster), `dragon-roar`, `level-up`, `item-get`, `door`, `refuse` (a dull thud for wrong item uses), `battle-start` (drum hit), and seven more: `heal` (soft rising chime: every heal skill and draught), `steal` (quick cloth swish and coin clink: Steal, pickpocket things), `drink` (gulp and cork pop: drinking draughts, the jailer and Valerio), `summon` (hiss and rush of air: Thoth's summons), `rumble` (deep stone rumble: the ceiling collapse, the waking city, shake effects), `gate-open` (rising hum into a bright whoomp: the Gate, the Stones, the founder's door), `heartbeat` (slow deep double beat: the Starheart scene cards and the Dragon's Heart).

**Sound ids are the asset list's ids** (`level-up`, `item-get`, `sting-solved`, `sting-victory`, `sting-gameover`, `ui-click`, `menu-open`, `save-chime`, `footsteps`, `status-tick`, …); the engine and every chapter use exactly these.

**Ambience loops** (`audiogen sfx --loop`, 10–15 s, played under music at low volume per the room table): `amb-crowd`, `amb-sea`, `amb-storm`, `amb-fire`, `amb-jungle`. mp3 encoding pads each file with a little silence, which clicks at the loop point: `audio.js` trims leading and trailing near-silence once after decoding (every music, ambience and sfx buffer) and loops ambience with a 0.3 s self-crossfade (music keeps its 2 s crossfade).

**Synthesized in code (Web Audio, no files):** `ui-click`, `menu-open`, `equip`, `footsteps`, `save-chime`, `defend`, `status-tick`, `miss` (noise whoosh), `coins` (short metallic pings), `flee`. **Every generated sfx id also has a synthesized fallback** in `audio.js` (a small recipe table: noise burst + filter for hits, pitched sine/triangle sweeps for spells and chimes), used when the file is missing or failed to load, so the game is never silent.

**Settling the plan (first generation):** the key can't read the plan (`audiogen plan` → `unknown`). The first generation is one sfx (`item-get`) at the default `mp3_44100_128`. If it works, the plan is paid: record that in `design/STATUS.md`, no credit line. If audiogen reports the free-tier `output_format` restriction, it's the free plan: use `--output-format mp3_44100_64` from then on, add "Music and sound effects created with ElevenLabs." to the README credits, and expect only ~10,000 credits — then generate in this priority order and stop when credits run out (the synthesized fallbacks cover the rest): `title`, `battle`, `shadizar`, `boss`, `sting-victory`, `sting-gameover`, `slash`, `blunt`, `pierce`, `hurt`, `enemy-die`, `level-up`, `item-get`, then the remaining music, then the remaining sfx and ambience. The same order is used on a paid plan.

## Asset list

All final files under `game/assets/` (see the asset guide's folders). Priority: **must** (made first), **should**, **nice** (only from leftover contingency).

**Anchors** (imagegen2 medium, transparent): `style-anchor` (Brannoc bust), `anchor-enemy` (full-body cultist; also becomes the `cultist` sprite). must.

**Scenes** (nanogen flash 1K, 16:9 → 320×180), 63:

| Group | Ids |
|---|---|
| Key art (6) | `bg-title` (Brannoc on a cliff above Shadizar under a blue star, dragon coil in clouds), `bg-prologue` (the Hyborian world at dusk from a high pass, ruins and seas), `bg-founding`, `bg-ending-a` (Brannoc walking west at dawn), `bg-ending-b` (dark throne, dragon crown), `bg-ending-c` (green hills, iron guardian on the tower stump, dawn) |
| Statue set (4, edits of one base) | `statue-worn`, `statue-brannoc`, `statue-serpent`, `statue-two` |
| Ch I (16) | `bg-desert-gate`, `bg-street` (scene anchor), `bg-tavern`, `bg-bazaar`, `bg-temple-row`, `bg-statue-square`, `bg-arena`, `bg-thieves-den`, `bg-tullia`, `bg-alley`, `bg-tower-wall`, `bg-tower-garden`, `bg-tower-hall`, `bg-moon-stair`, `bg-tower-crown`, `bg-undercroft` (should) |
| Ch II (12) | `bg-desert-road`, `bg-oasis`, `bg-salt-marsh`, `bg-witch-hut`, `bg-messantia`, `bg-harbor-tavern`, `bg-harbor-office`, `bg-jail`, `bg-warehouse` (should), `bg-sea-tunnels` (should), `bg-ship-deck`, `bg-storm` |
| Ch III (12) | `bg-beach`, `bg-ghost-ship`, `bg-jungle`, `bg-ape-rocks`, `bg-serpent-river`, `bg-ruined-gateway`, `bg-iron-graveyard`, `bg-glyph-hall`, `bg-power-wells`, `bg-prison-nine`, `bg-vault`, `bg-gate-chamber` |
| Ch IV (8) | `bg-standing-stones`, `bg-ancient-valley`, `bg-nomad-camp`, `bg-bone-fields`, `bg-cult-camp`, `bg-dragon-caves`, `bg-molten-bridge`, `bg-hoard` |
| Ch V (5) | `bg-tower-ruins`, `bg-burning-street`, `bg-burning-square`, `bg-undercity`, `bg-dragon-heart` |

Every room in the Manifest maps to one of these ids (with an optional tint). `tools/lint-content.mjs` fails if a room's picture id isn't in this list.

**Picture shows** (one line per scene; goes into each prompt after the style line. Rule: **no people unless named here**; rooms are empty stages, since characters are portraits and sprites):

| Id | Picture shows |
|---|---|
| `bg-title` | Brannoc from behind on a cliff above Shadizar's domes at night, a blue star overhead, a dragon's coil half-hidden in the clouds |
| `bg-prologue` | the Hyborian world at dusk from a high mountain pass: ruined towers, a far sea, kingdoms as scattered lamps |
| `bg-founding` | nomads in robes raising the first mud-and-gold walls in a valley; in front, a fresh stone statue of a big man holding a star |
| `bg-ending-a` | Brannoc, small and alone, walking a western road at dawn; a smoking city behind him |
| `bg-ending-b` | a black throne on a dragon's skull, a crown of serpent bone on its seat, violet light; no one on it |
| `bg-ending-c` | green hills at dawn; on a broken tower stump an iron giant stands guard over a rebuilt city |
| `statue-worn` | close-up of a soot-black, weathered stone statue's head and raised hand holding a star; a square jaw is all you can read |
| `statue-brannoc` | the same statue scoured clean by fire: plainly Brannoc's face (from the style anchor), embers drifting |
| `statue-serpent` | the same statue, its face changed into a serpent's, violet light |
| `statue-two` | the same plinth now carrying two figures: Brannoc and an iron man (Nine) holding the star between them, dawn light |
| `bg-desert-gate` | Shadizar's sandstone desert gate at late afternoon, guard towers, camels' tracks, dunes behind |
| `bg-street` | (scene anchor) a crowded-looking street of hanging lamps at dusk, awnings, tiled domes; empty of people |
| `bg-tavern` | inside the Gilded Jackal: low lamplit tavern, a carved jackal over the bar, cushions, smoke |
| `bg-bazaar` | a covered bazaar: arms stall, apothecary jars, a butcher's stall with hooks and meat |
| `bg-temple-row` | a street of temples: Bel's columned porch, a dark serpent shrine, a small white Mitra shrine |
| `bg-statue-square` | a square with a dry fountain and a tall weathered statue holding a star, pigeons |
| `bg-arena` | the Pit: a sunken sand arena ringed by wooden stands and a betting board |
| `bg-thieves-den` | a cellar den of crates, stolen rugs, a big chair, ledgers, a single lamp |
| `bg-tullia` | a perfumed salon: silk cushions, a large painting of a moon over a river and a throne-dome |
| `bg-alley` | narrow back alleys at night, laundry lines, a tower looming over the rooftops |
| `bg-tower-wall` | the foot of a smooth, tall tower wall with a carved stone lip at the top, moonlight |
| `bg-tower-garden` | a walled night garden with a fountain, exotic trees and two empty kennels |
| `bg-tower-hall` | a marble hall of curiosities in cases, a table with knucklebones, a stair door carved with a smiling face |
| `bg-moon-stair` | a spiral stair landing with three tall bronze mirrors on pivots and slit windows: moonrise east, a river south, a palace dome north |
| `bg-tower-crown` | the tower's top chamber: an iron man chained upright, his chest open, a blue-white jewel glowing inside |
| `bg-undercroft` | a vaulted cellar of dusty crates and webs, a huge web in one corner |
| `bg-desert-road` | a caravan road through red desert, rocks for ambushes, a far mountain line |
| `bg-oasis` | a night oasis with palms, a campfire and old bleached bones in the sand |
| `bg-salt-marsh` | a grey-green salt marsh, reeds, dark eel waters, a crooked hut on stilts far off |
| `bg-witch-hut` | inside a witch's hut: hanging herbs, a bubbling pot, jars of strange things |
| `bg-messantia` | Messantia's docks: galleys, cranes, warehouses, gulls, a harbor office with a dolphin banner |
| `bg-harbor-tavern` | the Drowned Gull: a sailors' tavern with nets, a black rum barrel, a tiny stage |
| `bg-harbor-office` | an office papered with bad poetry, a big desk with drawers and seals |
| `bg-jail` | a stone jail of iron-barred cells, a stool with a hand-lettered sign |
| `bg-warehouse` | a customs warehouse of bales and casks, a trapdoor in the floor |
| `bg-sea-tunnels` | dripping brick smugglers' tunnels, black water, a sluice wheel in the wall, a rusted grate above |
| `bg-ship-deck` | the deck of a pirate galley, the *Sea-Wolf*, sails full, open sea |
| `bg-storm` | a ship's deck in a storm at night, huge waves, lightning, a great serpent's coil rising |
| `bg-beach` | a wreck-strewn beach with a pirate ship at anchor, a campfire, jungle behind |
| `bg-ghost-ship` | a rotting galleon glowing green on a night sea (used as the room and as the scene card when it appears off the beach) |
| `bg-jungle` | a jungle path with coconut palms and vines, broken iron limbs in the undergrowth |
| `bg-ape-rocks` | rocks with a big nest glittering with bottle glass and junk |
| `bg-serpent-river` | a jungle river ford, brown water, stepping stones |
| `bg-ruined-gateway` | a huge ruined stone gateway, half-buried iron figures |
| `bg-iron-graveyard` | a field of hundreds of fallen iron men, rusted, half sunk in earth |
| `bg-glyph-hall` | a hall whose wall mural shows a door with two eyes, a sleeper, a vault and a ring |
| `bg-power-wells` | a floor of metal plates over glowing wells, some dusty, some polished |
| `bg-prison-nine` | a damaged iron man pinned under a fallen pillar, his chest socket empty and dim |
| `bg-vault` | a vault of drowned kings: crowned skeletons, gold, a single empty socket in a stone door |
| `bg-gate-chamber` | a vast ring of iron and crystal on a dais, two sockets in the outer door |
| `bg-standing-stones` | a ring of tall standing stones in a scorched valley, a burned little white shrine at their foot |
| `bg-ancient-valley` | a scorched empty valley, a smoking mountain beyond, a dead thorn tree |
| `bg-nomad-camp` | a nomad camp of tents and candles, cooking fires |
| `bg-bone-fields` | a plain of giant bones and drake skulls, a hermit's hut with melons |
| `bg-cult-camp` | a Stygian cult camp: black tents, serpent banners, a line of black robes drying |
| `bg-dragon-caves` | volcanic caves with glowing moss on the walls |
| `bg-molten-bridge` | a stone bridge over a river of lava, its surface crusted and cracking |
| `bg-hoard` | a dragon's hoard hall: mountains of gold, a bronze weighing-altar with a heart in its pan, a cracked dome held by bone props |
| `bg-tower-ruins` | the burned stump of a tower at night, standing stones smoking in its broken cellar |
| `bg-burning-street` | the Street of Lamps on fire at night |
| `bg-burning-square` | Statue Square on fire, the fountain collapsed into a dark hole, the statue lit by flames |
| `bg-undercity` | buried ancient city walls under the streets, a stone postern with a carved mouth |
| `bg-dragon-heart` | a cavern around a huge exposed, beating heart of light and scales |


**Portraits** (imagegen2, transparent, → 96×96 + 48×48 face), 26: medium: `brannoc` (= the anchor), `shevra`, `ptahk`, `ilsa`, `nine`, `zelara`, `thoth-seketh`, `iron-watcher`; low: `tullia`, `abulet`, `hasdrubal`, `nimm`, `ommo`, `doru`, `khalla`, `poet`, `sagra`, `valerio`, `jailer`, `morvan`, `kesh`, `azhrim`, `bel-priest`, `hermit`, `generic-man`, `generic-woman` (hooded silhouettes). must: party + `thoth-seketh`, `tullia`, `azhrim`, `kesh`; the rest should (fallback: the generic silhouette). Plus `ygg-sothar` (not generated: a 96×96 crop of the `dragon-final-head` sprite, `pixelize.py face ... --size 96 --at x,y`, crop point recorded in ASSETS.md).

**Enemy sprites** (imagegen2, transparent, `anchor-enemy` as reference), 34: low: `jackal`, `thug`, `city-guard`, `tower-hound`, `spider`, `twin-swordsman`, `ghaul`, `scorpion`, `bandit`, `hyena`, `marsh-eel`, `marine`, `ghost-sailor`, `man-ape`, `river-serpent`, `iron-husk`, `sentinel`, `stygian`, `drake`, `bone-wraith`, `salamander`, `serpent-man`, `rift-horror`, `khalla-fight`, `iron-bull`; medium: `brass-serpent`, `azhrim-fight` (the portrait stays `azhrim`), `sea-serpent`, `mother-of-coils`, `dragon-waking-head`, `dragon-waking-coil`, `thoth-true`, `dragon-final-head`, `dragon-final-coil` (`cultist` is the pixelized `anchor-enemy`.) 25 low + 9 medium = 34 generations.

**Icons** (imagegen2 medium, chroma-key sheets → 32×32; see the sheet rules): sheet 1 (5×4, 20) categories: `sword`, `greatsword`, `axe`, `mace`, `spear`, `dagger`, `bow`, `sling`, `thrown`, `cutlass`, `staff`, `module`, `body`, `head`, `offhand`, `trinket`, `potion`, `scroll`, `junk`, `gold`. Sheets 2–3 (4×4 each) key items: `rope`, `meat-hook`, `grapnel`, `bone`, `sausage`, `poppy-tears`, `spectacles`, `ledger`, `knucklebones`, `worn-boots`, `jackal-pelt`, `kraken-rum`, `hairpin`, `brig-key`, `blank-order`, `valerio-signet`, `empty-bottle`, `last-breath`, `liar-hair`, `eel-tooth`, `love-potion`, `wedding-ring`, `star-cell`, `coconut`, `thorn-branch`, `sling-cord`, `long-arm`, `cult-robes`, `beeswax`, `frost-flask`, `snow-melon`, `glow-moss` (32; `thief-candle` uses `scroll`@gold). **Starheart sprite** (imagegen2 medium, 64×64). must.

App icon and social card: made in code from the Starheart sprite and `bg-title`.

**Audio** (audiogen): 12 music tracks (12.25 min), 3 stings + 28 sfx + 5 ambience loops = 36 sfx generations; 10 sounds synthesized in code.

**Animation** (anim8gen): none. Motion is done in code (bob, shake, flash, pulse, tints).

## Tech plan

```
game/
  index.html  styles.css  manifest.webmanifest  sw.js  icons, social-card.jpg
  fonts/ (Metal Mania, Alegreya, Pixelify Sans + OFL files)
  assets/style-anchor.png  assets/anchor-enemy.png  assets/palette.png
  assets/bg/*.png  assets/portraits/*.png (+ *-face.png)  assets/enemies/*.png  assets/icons/*.png  assets/sprites/starheart.png
  assets/audio/music/*.mp3  assets/audio/sfx/*.mp3
  src/
    main.js       boot, screens, title, settings
    state.js      game state, flags, conditions, save/load (exists)
    util.js       helpers, seeded rng (exists)
    ui.js         layout, log, dock, modals, toasts, data-act ids
    world.js      rooms, things, verbs, effects runner (async)
    dialogue.js   dialogue trees
    parser.js     typed commands
    battle.js     combat, triggers, auto/repeat
    party.js      characters, growth, skills
    items.js      item registry, equipment, shop logic
    audio.js      Web Audio music/sfx, loop crossfade, synthesized fallbacks (exists, to extend)
    debug.js      window.__game
    data/balance.js  data/core-items.js  data/core-enemies.js  data/party-data.js
    content/manifest.js  content/ch1.js ... ch5.js
tools/
  pixelize.py        image pipeline (exists)
  lint-content.mjs   content checks
  balance.mjs        XP bands and boss simulations
  replay.mjs         runs design/solutions/*.json in a browser
```

- Content is data: each chapter module exports rooms, things, dialogues, items, enemies, shops, quests, hints, combine recipes and optional `scripts` (small async functions for special puzzles like the mirrors), merged into global registries at load. **design/CONTENT_SCHEMA.md** defines effects, conditions, the effects runner, battle triggers, save slots and `data-act` ids, so chapters can be written in parallel. Each chapter writer gets: this design, the schema, the Manifest (as `content/manifest.js`) and their chapter's puzzle table.
- Rendering: DOM. The scene `<canvas>` (320×180 backing store) for the picture and battle, scaled per the height budget; everything else HTML/CSS.
- Input: buttons with pointer events; key shortcuts; optional text parser. Every interactive element has a stable `data-act` id (schema).
- Audio: Web Audio buffers, music self-crossfade at the loop point, ambience layer, synthesized fallbacks, mute toggles (music/sfx separate) in localStorage.
- Seeded randomness (ambush, damage variance) per save for deterministic tests; the debug hook can fix the seed.
- **Debug hook `window.__game`:** `state()`, `rooms()`, `acts()` (the visible `data-act` ids), `act(id)` (click it), `goto(room)`, `chapter(n, branch)` (loads a chapter-start snapshot from the Manifest), `setFlag`, `give`, `fight(enemies)`, `win()`, `seed(n)`, `battlePolicy('auto'|'manual')`, `run(solution)`, `audioState()`.
- **`tools/lint-content.mjs`** (Node, imports the content modules with a stub DOM): every referenced id exists (rooms, items, npcs, portraits, pictures, music, sfx, dialogues, enemies, quests, skills); every room is reachable from its chapter start; every consumed key item has a repeatable source or exactly one consumer; every condition atom can become true somewhere; every room has a picture in the asset list; manifest ids are only set/read by the chapters the Manifest names; no non-manifest id is shared between chapters; every `fight` effect has `noFlee: true` or `boss: true`; `{ ending }` is the last effect of its list.
- **Solutions** (`design/solutions/*.json`, replayed by `tools/replay.mjs` driving playwright-cli, each with a fixed seed and battle policy `auto`): `ch1`, `ch2`, `ch3-free`, `ch3-vault`, `ch4-nine`, `ch4-zelara`, `ch5-a` (zelara branch), `ch5-b` (nine branch), `ch5-c` (nine branch), `sq-arena` (Ch I ranks, then Ch V ranks), `sq-witch`, `sq-bride`. Plus one full New Game → Ending C run played with real clicks and taps, not the debug hook.

## Cut list (in order)

1. Typed command parser (buttons cover everything).
2. Weather overlays.
3. Minor NPC portraits (fall back to the generic silhouettes).
4. Arena ranks 2–1 merge into one fight.
5. Undercroft, Warehouse and Sea-tunnels pictures (remaps: `c1-undercroft` and `c5-cellar` → `bg-tower-hall@dark`; `c2-warehouse` → `bg-jail@dusk`; `c2-tunnels` → `bg-dragon-caves@fog`, `c2-cistern` → `bg-dragon-caves@dark`).
6. Map screen (journal still says where to go).
7. Some enemy sprites become tinted variants of others (`twin-swordsman` → `thug@steel`, `hyena` → `jackal@tan`, `bone-wraith` → `ghost-sailor@bone`).
8. Ambience loops (music alone).

Never cut: the chapters, the three twists, the choice and three endings, the three side quests, battles with weapon types, the inventory quality of life, the phone layout, the protected saves.

## Budget estimate

Prices (checked 2026-11-03; the same statement heads `design/ASSETS.md`): **nanogen** flash 1K — the skill states $0.067 in its model notes and $0.034 in its cost table; we budget the higher, **$0.067**. **imagegen2** reports tokens, not prices; third-party summaries of OpenAI's table (live page not confirmed) give ≈$0.006 (low) and ≈$0.053 (medium) per 1024² image; with reference-image input tokens and rounding up, we budget **$0.03 (low) and $0.06 (medium)**, and recompute from the reported usage after the first three images (the ledger records actual usage). **audiogen**: music ≈$0.30/min, sfx ≈$0.12 each.

| Kind | Count | Unit | Retries | Est. |
|---|---|---|---|---|
| Scenes + key art + statue set (nanogen flash 1K) | 63 | $0.067 | +20% | $5.07 |
| Anchors (imagegen2 medium) | 2 | $0.06 | ×2 | $0.25 |
| Portraits (8 medium, 18 low) | 26 | — | +40% | $1.45 |
| Enemy sprites (9 medium, 25 low; new enemies are tints) | 34 | — | +40% | $1.85 |
| Icon sheets (3) + Starheart (imagegen2 medium) | 4 | $0.06 | +100% | $0.50 |
| Music (12 tracks, 12.25 min) | 12 | $0.30/min | one spare track | $4.00 |
| Sound effects, stings, ambience (incl. the 7 added sfx) | 36 | $0.12 | 2 spares | $4.56 |
| **Total planned** | | | | **$17.68** |
| **Contingency** (stated, not to be spent on new asset kinds) | | | | **$2.32** |

At 80% of $20 ($16), note it in `design/STATUS.md` and switch every remaining image to low quality and one try. If the budget runs out, the cut list and code-drawn fallbacks (placeholder pictures, silhouettes, synthesized sounds) cover anything missing.

## Definition of done

- [ ] Starts with no console errors at **375×667, 390×844, 852×393 (landscape), 1280×720 and 800×600**, and every screen fits the height budget at each (no clipped buttons, log at least the listed height).
- [ ] Every solution file in `design/solutions/` replays to its end with its seed; one full New Game → ending run done with real input.
- [ ] `tools/lint-content.mjs` passes with no errors; `tools/balance.mjs` reports every chapter within ±1 level of its band and every boss winnable in 4–12 rounds.
- [ ] The Ch III choice is saved and Ending C appears only when Nine was freed; the `choice` and `final` protected saves load and lead to the other endings.
- [ ] All three side quests can be completed, including all five arena ranks (also with Ch I ranks carried over to Ch V).
- [ ] Losing a battle and retrying works and gives no double rewards; nothing gets stuck; no puzzle can become unsolvable.
- [ ] Every button and menu works with mouse, keyboard and touch, and has a `data-act` id.
- [ ] Every room shows its picture (no placeholders unless a cut is recorded), and pictures are drawn at whole-number device-pixel scales.
- [ ] Music and sound play after the first tap; music loops without an audible gap; music and sound mute work and are remembered; missing sound files fall back to synthesized sounds.
- [ ] Progress is saved and restored (autosave, slots, protected slots).
- [ ] Installs as an app and works offline.
