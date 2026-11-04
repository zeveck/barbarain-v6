# BarbarAIn

*Steal a star. Cross the sea. Outrun a thousand years. Kill the dragon between worlds.*

A sword-and-sorcery text adventure RPG in the Hyborian Age, with 16-bit pictures. You are Brannoc, a broke Cimmerian who takes one heist job in Shadizar, the City of Thieves. The "jewel" he steals turns out to be the beating heart of an iron man from the far future. Read richly described scenes, solve sly item puzzles, fight turn-based battles with a party of rogues, pirates and sorcerers, and make one choice halfway through that decides which endings exist at all.

**[▶ Play BarbarAIn](https://barbarainv6.synapticnoise.com/)** in your browser. No install, works on desktop and on phones.

![Title screen](media/screenshots/title.png)

## The world

Five chapters, about two hours, three endings and three side quests.

| | |
|---|---|
| ![Shadizar](media/screenshots/shadizar.png) **I. The City of Thieves.** Shadizar, a fence's job, a tower full of hounds and a door that only opens if you make it laugh. | ![A battle](media/screenshots/battle.png) **Battles.** Every weapon slashes, stabs or smashes, and every foe is weak to something. Swap to your sidearm when it counts. |
| ![The Black Coast](media/screenshots/coast.png) **II. The Black Coast.** A pirate queen in a cell, a vain harbour master, smugglers' tunnels and a sea serpent in the storm. | ![The Isle](media/screenshots/isle.png) **III. The Isle of the Iron Dead.** A jungle full of fallen iron men, and the choice that changes everything. |
| ![A thousand years before](media/screenshots/past.png) **IV. A Thousand Years Before.** A heist on a waking dragon's hoard, before Shadizar was ever built. | ![Burning Shadizar](media/screenshots/finale.png) **V. The Night Shadizar Burned.** Home again, and the city is on fire. |

Side quests: fight your way up the five ranks of **the Pit of Shadizar**, brew a love potion for **the Salt Witch**, and lay **the Weeping Bride**'s ghost captain to rest.

## How to play

- **Explore:** read the scene, then use **Here** (people and things: Look, Talk, Take, Use an item on it) and **Go** (the ways out). A gold dot means something new.
- **Puzzles:** carry things around, use them on people and objects, and combine two items in the **Bag**. Stuck? The **Journal** has your objective and a two-step hint.
- **Battle:** pick Attack, Skills, Items, Defend or Swap for each fighter, then a target. **Auto** fights for you; **Repeat** does last round again. Battle speed is in Settings.
- **Gear:** the Bag shows who gains what from every item; **Best gear** equips the strongest kit in one tap.
- **Keyboard:** arrows or N/E/S/W to move, L look, I bag, P party, J journal, M map, 1–9 for choices, Space to continue, Esc for the menu. On wide screens you can also type commands like `take rope` or `use grapnel on wall`.
- **Phone:** everything is on big buttons at the bottom; tap the room's name to shrink the picture and get more room for the story. You can install it from your browser's menu and play full screen, even offline.

The game autosaves every time you enter a room, and has three save slots. Losing a battle lets you retry it straight away. Before the big choice and before the final choice the game keeps special saves, so you can go back and find the other endings.

## How it was made

BarbarAIn was made by [Claude Code](https://claude.com/claude-code) with [gamegen](https://github.com/zeveck/gamegen), from this request:

> We want to make a modern-leaning text adventure. It should describe scenes and let you explore dungeons and fight monsters and gain levels and HP and MP and magic. They should use a range of weapons. Typical RPG elements. It should have relatively simple 16-bit style graphics depicting environments and towns people and the hero's party and enemies. It should have enough interface to be playable on desktop and mobile. It is called BarbarAIn. It should be heavily based on the world of Conan the Barbarian as depicted in the books and stories by author Robert E. Howard. It should have characters evoking those from the books and movies and they should behave "in character" when present. However, we want this to be a new story, and it should have at least three major twists and surprises, and they should make sense in the world. Anything goes -- robots from the future? time travel? pirates? trans-dimensional dragons? a heist? Sure, if you can make it fit into the world. There should be light adventure game style puzzles a la Secret of Monkey Island. It should have items and armor and weapons with a good quality of life system for managing inventory. It should have more than one ending -- say three -- and at least one of them should only open up because of a choice you made back in the middle of the story, so what you decide actually matters. There should also be a few optional side quests off the main path, maybe three, and one of them should be an arena in Shadizar where you can fight your way up. It should be a big game -- a couple of hours, five or so chapters, with lots to explore. Good luck!

gamegen wrote a brief and a design, had review agents (a player, a builder and an art and sound director) go over it in two rounds, then made the art and sound, built the engine, had five helper writers write a chapter each from a shared design, and play-tested every chapter, branch, ending and side quest with recorded replays, plus a playtester, a bug hunter and a polish reviewer. The design notes, review logs and replays are in [`design/`](design/).

- [nanogen](https://github.com/zeveck/nanogen): the 63 scenes, key art, ending pictures and the statue close-ups
- [imagegen2](https://github.com/zeveck/imagegen2): the 26 character portraits, the 35 enemy and boss sprites, the item icons and the Starheart
- [audiogen](https://github.com/zeveck/audiogen): the 12 music tracks and 36 sound effects and ambient loops

## Playing locally

BarbarAIn is a plain web page with no build step. Serve the `game` folder with any static web server, for example:

    cd game
    python3 -m http.server 8000

then open http://localhost:8000. (Browsers won't run it from a double-clicked file.)

## Credits

An idea by Rich Conlan.

An original story set in the Hyborian Age created by Robert E. Howard (1906–1936). Brannoc and every character in this game are original.

Fonts, bundled in `game/fonts/` with their licenses: Metal Mania (SIL Open Font License), Alegreya by Huerta Tipográfica (SIL Open Font License), Pixelify Sans (SIL Open Font License).

Music and sound effects created with ElevenLabs.
