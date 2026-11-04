// Chapter II — The Black Coast (Caravan Road, Salt Marsh, Messantia, the tunnels, the sea).
import { enemyStats } from '../data/balance.js';
import { ROOM } from './manifest.js';

// ---------- helpers ----------
const say = t => ({ say: t });
const ln = (who, t) => ({ line: [who, t] });
const sh = t => ({ if: 'party:shevra', line: ['shevra', t] });
const pt = t => ({ if: 'party:ptahk', line: ['ptahk', t] });
const il = t => ({ if: 'party:ilsa', line: ['ilsa', t] });
const MAIN = { call: 'c2-main' };

// Topic nodes return to a short "anything else?" hub instead of repeating the greeting.
function hub(d, text) {
  const a = d.nodes[d.start];
  d.nodes.hub = { who: a.who, text, choices: a.choices };
  for (const n of Object.values(d.nodes)) if (n.next === 'a') n.next = 'hub';
  return d;
}

// The marines on the trapdoor (both the trapdoor and the marines lead here).
const marinesFight = [
  { line: ['c2-marine', `Customs business, we said. Now it's *our* business.`] },
  { fight: { id: 'c2-marines', enemies: ['marine', 'marine'], noFlee: true,
    intro: 'The marines draw steel. Iron scale: blades skate, hammers bite!',
    win: [{ say: `The second marine goes down with a clang like a dropped stewpot. Under him, the trapdoor; beside him, his iron boat hook.` }, { give: 'boat-hook' }] } },
];

// Freeing Ilsa (three ways: brig key, hairpin, or up through the grate).
const ilsaJoins = [
  ln('ilsa', `Ha! I knew the gods owed me one. They just sent it in an ugly wrapper.`),
  { join: 'ilsa', level: 6 },
  { call: 'c2-ilsa-coat', args: { join: true } },
  { set: 'c2-ilsa-free' },
  ln('ilsa', `The marines took my coat and my sea-chest. Sold the chest to the smugglers who nest under the Customs Warehouse: Gull-Eye Marro's rats. My charts are in it. The Isle isn't on any chart but mine.`),
  ln('ilsa', `And my crew rots in the Debtors' Pen, and my *Sea-Wolf* sits impounded at the customs quay. Free them all, and I'll sail you to the edge of the world.`),
  sh(`She's charming. Like a knife in a bouquet.`),
  MAIN,
];

// Sagra: hand over whatever ingredients you carry.
const deliver = [
  { if: 'item:liar-hair', then: [
    { take: 'liar-hair' }, { set: 'c2-gave-hair' }, { var: ['c2-witch', 1] },
    ln('sagra', `Oooh, a *liar's* hair, still curled from the lie. Count Valerio, is it? I'd know that pomade in the dark.`), { xp: 120 },
  ] },
  { if: 'item:last-breath', then: [
    { take: 'last-breath' }, { set: 'c2-gave-breath' }, { var: ['c2-witch', 1] },
    ln('sagra', `A sailor's last breath. She uncorks it, sniffs, and reels. "Rum and regret. *Perfect.*"`), { xp: 120 },
  ] },
  { if: 'item:eel-tooth', then: [
    { take: 'eel-tooth' }, { set: 'c2-gave-tooth' }, { var: ['c2-witch', 1] },
    ln('sagra', `The tooth of the marsh eel! You've the stink of it on you. Good. Love should have teeth.`), { xp: 120 },
  ] },
  { if: 'var:c2-witch==1', then: [{ quest: ['sq-witch', 2] }] },
  { if: 'var:c2-witch==2', then: [{ quest: ['sq-witch', 3] }] },
  { if: 'var:c2-witch>=3 & quest:sq-witch<4', then: [
    say(`Sagra tips hair, breath and tooth into the pot. It hisses like a cat in a sack, turns the colour of a sunset in a bordello, and settles into something pink and glittering.`),
    { sfx: 'sting-solved' },
    { scene: { img: 'bg-witch-hut', text: `"For my gentleman of the sea," Mother Sagra croons, corking the potion with her teeth. "He sails past my window every night and never stops. This will make him stop."\n\nThen she presses it into your hand. "You'll see him before I do, pretty one. Give it to him. Tell him Sagra still waits."` } },
    { give: 'love-potion' },
    ln('sagra', `And for your trouble: my knot, against poison and sleep. And a little charm for the big one, to keep the sea out of his skull.`),
    { give: 'witch-knot' },
    { learn: ['brannoc', 'sea-witch-ward'] },
    { xp: 300 },
    { quest: ['sq-witch', 4] },
    pt(`Hm. A charm *against* sorcery, from a sorceress. Even you might find use for it, barbarian.`),
  ] },
];

export default {
  id: 'ch2',
  num: 2,
  title: 'The Black Coast',
  card: { img: 'bg-desert-road', text: 'Shadizar burns behind you. Ahead: the caravan road, the sea, and a ship that will sail to the edge of the world.' },
  start: 'c2-road',
  startDo: [{ quest: ['ch2-main', 1], quiet: true }],

  // ======================================================================
  rooms: {
    // ---------------------------------------------------------------- Road
    'c2-road': {
      ...ROOM['c2-road'],
      desc: [
        { text: `The caravan road runs red and empty between wind-gnawed rocks, the kind of rocks that grow bandits the way a corpse grows flies. Far ahead, a line of blue mountains; somewhere past them, the sea.\n\nThe Starheart thuds against your ribs like a second heart, warm through the leather.` },
        { if: 'won:c2-road-ambush', text: `Dead bandits bake where they fell. The vultures are working up their nerve.` },
      ],
      exits: { e: 'c2-oasis' },
      things: [
        { id: 'wreck', name: 'Burnt Wagon', look: [say(`A merchant's wagon, burnt to the axles. Whoever owned it owns nothing now. Arrows in the sideboards, Zamorian fletching.`), sh(`Zamorian arrows. Tullia's friends get around.`)], verbs: { Search: [{ if: 'once:c2-wagon', say: `Nothing left but ash and a bad smell.` }, { once: 'c2-wagon', do: [say(`Under a charred plank you find a clay jar the fire missed.`), { give: 'healing-draught', n: 2 }] }] } },
        { id: 'milestone', name: 'Milestone', take: `It weighs as much as a camel and is worth less.`, look: [say(`A worn stone post. One face says SHADIZAR in Zamorian; the other, MESSANTIA, in the neat letters of Argos. Someone has scratched underneath: *the gods hate travellers*.`), ln('brannoc', `The gods hate everyone. Travellers just notice.`)] },
        { id: 'vultures', name: 'Vultures', noTake: true, look: `Three vultures on a dead thorn tree, hunched like moneylenders. They watch you with professional interest.`, verbs: { Shoo: [say(`You wave your arms. The vultures shuffle a hand's width to the left and resume watching.`), sh(`They know a good investment, Bear.`)] } },
        { id: 'mountains', name: 'Far Mountains', noTake: true, look: [say(`Blue teeth on the horizon. Past them the land falls to the Black Coast, where the sea eats ships.`), pt(`My knees can feel every one of those mountains already. Every one.`)] },
        { id: 'heart', name: 'The Starheart', noTake: true, look: [say(`You pull it from your belt-pouch. Heavy as a melon, warm, and it beats: slow, patient, like something waiting. Blue-white light leaks between your fingers.`), { sfx: 'heartbeat' }, pt(`Put it away, barbarian. And keep it on *your* belt. These are old hands; they drop things.`)] },
      ],
      first: [
        sh(`Sand, rocks and more sand. Tell me again why we didn't steal camels.`),
        ln('brannoc', `We stole a heart. One theft a week.`),
        { fight: { id: 'c2-road-ambush', enemies: ['bandit', 'scorpion', 'bandit'], noFlee: true,
          intro: 'Bandits boil out of the rocks, and something with a stinger skitters after them!',
          win: [say(`The last bandit falls across the road. His scorpion-pet, it turns out, was not a pet.`), sh(`Scorpions: hit them with something blunt. Or fire. Or don't touch them at all, my favourite.`)] } },
      ],
      ambush: { chance: 0.3, groups: [['bandit', 'bandit'], ['scorpion', 'scorpion'], ['bandit', 'scorpion']], text: 'Desert scum spill from the rocks!' },
      hunt: [['bandit', 'bandit'], ['scorpion', 'scorpion'], ['bandit', 'scorpion', 'bandit']],
    },

    // ---------------------------------------------------------------- Oasis
    'c2-oasis': {
      ...ROOM['c2-oasis'],
      bg: [{ if: 'visited:c2-oasis', bg: 'bg-oasis@night' }, { bg: 'bg-oasis' }],
      desc: [
        { text: `Palms lean over a black pool, and the sand around it is white with bones: camel bones, horse bones, and running through them like a buried road, the vertebrae of something no one ever named. Each one is the size of a cart wheel.` },
        { if: 'flag:c2-ptahk-eyes', text: `Your campfire still smoulders in its ring of skulls. A good place to rest, if you don't mind being watched by sockets.` },
      ],
      exits: { w: 'c2-road', e: 'c2-mgate', s: 'c2-marsh' },
      things: [
        { id: 'pool', name: 'Black Pool', noTake: true, look: [say(`Still water, sweet and cold, black as Stygian ink. Your reflection looks wearier than you feel.`)], verbs: { Drink: [say(`You drink like a camel. The water tastes of iron and old stone.`), { heal: true }] } },
        { id: 'spine', name: 'The Great Spine', take: `Each bone weighs more than you do. Even Shevra can't fence that.`, look: [say(`A spine of bones as big as wagon wheels, half buried, running off into the dunes in a long lazy curve. Whatever it was, it was a serpent, and it crawled a long way from the sea to die here.`), sh(`I don't like a world where snakes come that size.`), pt(`It is only old bones, child. Even gods leave those.`)] },
        { id: 'stone', name: 'Carved Stone', take: `It's carved into the bedrock. Brannoc tries anyway. It wins.`, look: [say(`A standing stone furred with lichen, cut with a coiling script.`), pt(`Stygian. "Here He rested between the worlds, and the world was salted where He lay." Old priests' nonsense. Very old.`), sh(`You read that awfully quick for a Khitan, grandfather.`), pt(`I read everything quickly. It's why I'm so wise and so tired.`)] },
        { id: 'campfire', name: 'Campfire', if: 'flag:c2-ptahk-eyes', noTake: true, look: `A ring of skulls around warm ashes. Somebody has arranged the skulls to face outward. Probably Shevra.`, verbs: { Rest: [{ inn: 0, text: 'Sleep by the embers under the cold stars?' }] } },
        { id: 'ptahk', name: 'Ptahk', kind: 'person', portrait: 'ptahk', if: 'party:ptahk', look: [say(`The old Khitan sits with his back to a palm, his staff across his knees, his face lined like a dry riverbed. His eyes are half shut. They are, just now, perfectly ordinary eyes.`)], talk: 'c2-ptahk' },
      ],
      first: [
        say(`You make camp as the sun goes down like a struck gong. The bones go blue, then grey, then dark.`),
        { fight: { id: 'c2-oasis-hyenas', enemies: ['hyena', 'hyena'], noFlee: true, bg: 'bg-oasis@night',
          intro: 'Laughter in the dark! Hyenas come loping over the bones.',
          win: [sh(`They laugh less now.`)] } },
        say(`Later, the fire burns low. Shevra roasts a lizard on a dagger and offers it around.`),
        sh(`Grandfather? A leg? It's mostly crunch.`),
        pt(`Keep it, child. My stomach is older than your country, and more particular.`),
        sh(`You never eat. Not once since Shadizar.`),
        pt(`I ate in Khitai, in my youth. I am still full.`),
        { sfx: 'heartbeat' },
        { scene: { img: 'bg-oasis@night', text: `The fire pops. Across it, Ptahk lifts his head, and the flames catch his eyes.\n\nFor one heartbeat the pupils are not round. They are thin and black and upright, like a cat's.\n\nLike a snake's.` } },
        ln('shevra', `Old man. Your *eyes*.`),
        ln('ptahk', `The smoke, child. And my old eyes, which are older than yours and uglier.`),
        say(`He laughs, rubs his face with both hands, and when he looks up his eyes are just an old man's eyes: red-rimmed, wet with smoke, tired.`),
        ln('brannoc', `Get some sleep. All of you.`),
        say(`Shevra lies down close to you, her back to the fire. "I know what I saw, Bear," she breathes.\n\nYou say nothing. You watch the old man until the stars wheel, and he never moves at all.`),
        { set: 'c2-ptahk-eyes' },
        { heal: true },
      ],
      safe: true,
    },

    // ---------------------------------------------------------------- Marsh
    'c2-marsh': {
      ...ROOM['c2-marsh'],
      desc: [
        { text: `The road gives way to grey-green salt marsh: reeds taller than a man, crusts of white salt, and channels of black water that move when nothing is moving them. Far off, a crooked hut squats on stilts, smoke curling from its roof.` },
      ],
      exits: { n: 'c2-oasis', w: 'c2-witch' },
      enter: [{ set: 'c2-in-marsh' }],
      things: [
        { id: 'eel-waters', name: 'Eel Waters', noTake: true,
          look: [say(`A deep channel of black water. Something long and thick as your thigh slides under the scum and is gone. The fishermen's bones on the bank have teeth-marks the size of daggers.`), { if: 'quest:sq-witch>=1 & !item:eel-tooth & !flag:c2-gave-tooth', line: ['shevra', `Mother Sagra wants a tooth, Bear. There's a tooth. Attached to the rest of it.`] }],
          verbs: { Fish: [
            { if: 'item:eel-tooth | flag:c2-gave-tooth', then: [say(`You trail a line in the water. Nothing bites. The eels of the Salt Marsh have learned your name.`)],
              else: [
                say(`You tie a strip of lizard to a cord and slap it on the water. The water slaps back.`),
                { fight: { id: 'c2-marsh-eel', enemies: ['marsh-eel'], noFlee: true, intro: 'The marsh eel erupts from the channel, all teeth and slime!',
                  win: [say(`The eel thrashes once more and lies still on the salt. Its teeth are as long as your thumb. You work one loose with your knife.`), { give: 'eel-tooth' }, sh(`Eels: cut them. Don't burn them, it just makes them angry and smell like supper.`)] } },
              ] },
          ] } },
        { id: 'reeds', name: 'Reeds', take: `You pull up a reed. Congratulations: you own a reed. You throw it away.`, look: `Reeds rattle in the wind like bones in a cup. Paths wind through them, made by something low and wide.` },
        { id: 'boat', name: 'Sunken Skiff', noTake: true, look: `A fisherman's skiff, half sunk in the mud, its bottom stove in from below.`, verbs: { Search: [{ if: 'once:c2-skiff', say: `Mud, and a crab that resents you.` }, { once: 'c2-skiff', do: [say(`In the stern locker, wrapped in oilcloth: a fisherman's lucky charm. It's a dried blue lotus. He won't need it.`), { give: 'mana-lotus' }] }] } },
        { id: 'salt', name: 'Salt Crust', take: [say(`You lick your finger, touch the crust and taste it. Salt. Crom, it's a salt marsh.`)], look: `White crusts of salt, cracked in hexagons like a giant's honeycomb.` },
        { id: 'hut', name: 'Hut on Stilts', noTake: true, look: [say(`A crooked hut on crooked stilts, hung with bottles that clink in the wind. A path of planks leads to it across the mud.`), pt(`A witch. Every marsh has one, like every dog has fleas.`)] },
      ],
      first: [
        sh(`Something just touched my ankle. Tell me it was a reed. Lie if you have to.`),
      ],
      hunt: [['hyena', 'hyena'], ['bandit', 'scorpion']],
    },

    // ---------------------------------------------------------------- Witch
    'c2-witch': {
      ...ROOM['c2-witch'],
      desc: [
        { text: `Inside, the hut is hot as a mouth. Herbs hang from every rafter, a pot bubbles green over a peat fire, and the shelves sag under jars of things that were alive once and may be again. A round window looks out over the marsh to the far grey line of the sea.` },
        { if: 'quest:sq-witch>=4', text: `The pot simmers, satisfied. Mother Sagra hums a sailors' song to herself.` },
      ],
      exits: { e: 'c2-marsh' },
      enter: [{ set: 'c2-in-marsh' }],
      things: [
        { id: 'sagra', name: 'Mother Sagra', kind: 'person', portrait: 'sagra', talk: 'c2-sagra',
          look: `A Stygian crone, bent as a fishhook, with black eyes bright as a magpie's and rings on every crooked finger. She smells of brine and roses.`,
          use: {
            'liar-hair': [{ if: 'quest:sq-witch>=1', then: [{ call: 'c2-deliver' }], else: [ln('sagra', `Ask first, then give, pretty one. That's manners.`)] }],
            'last-breath': [{ if: 'quest:sq-witch>=1', then: [{ call: 'c2-deliver' }], else: [ln('sagra', `Ask first, then give, pretty one. That's manners.`)] }],
            'eel-tooth': [{ if: 'quest:sq-witch>=1', then: [{ call: 'c2-deliver' }], else: [ln('sagra', `An eel tooth! Now why would you bring me that before I asked for it? Ask me what I'm brewing.`)] }],
            starheart: [ln('sagra', `Put that AWAY. That thing is a door, and I don't want to see what knocks.`)],
            'kraken-rum': [ln('sagra', `Kraken! Ha. Not before supper, pretty one.`)],
            '*': `Sagra squints at it, sniffs it, and hands it back. "Not for my pot."`,
          } },
        { id: 'pot', name: 'Bubbling Pot', take: `It's full of something boiling and alive. Brannoc declines.`, look: [say(`Green broth, thick as porridge. Something surfaces, looks at you, and sinks again.`), { if: 'quest:sq-witch>=1 & quest:sq-witch<4', say: `It needs three more things, Sagra says: a liar's hair, a sailor's last breath, and the tooth of the marsh eel.` }] },
        { id: 'jars', name: 'Jars', take: `Sagra's eyes are on you. You decide you don't want anything in a jar that badly.`, look: [say(`Jars of eyes, tongues, bats, a pickled baby crocodile, and one jar that is only darkness. Each wears a label in a coiling script.`), pt(`"Essence of Drowned Lover, third pressing." "Bats, assorted." "Do not open: Tuesday." Stygian, all of it, and a vile hand.`), sh(`You read Stygian like a market list, grandfather.`), pt(`A scholar reads what's in front of him. You should try it.`)] },
        { id: 'window', name: 'Round Window', noTake: true, look: [say(`Through the salt-crusted glass, the marsh runs grey to the grey sea. On the sill, a single candle stands burnt down to a stub, the way you leave a light for someone coming home.`), { if: 'quest:sq-witch>=1', say: `"Every night he sails past," Sagra says without turning. "No lamps. And he never stops."` }] },
        { id: 'croc', name: 'Stuffed Crocodile', take: `It's nailed to the wall. Also, its eyes followed you.`, look: `A crocodile, stuffed badly and grinning worse, hangs over the door. Its glass eyes are not glass.` },
      ],
      first: [
        sh(`It smells like a perfumer drowned in a fish barrel.`),
        ln('sagra', `Come in, come in, pretty ones! Mind the bats. Mind the big one's head. Oh, *very* big one.`),
      ],
    },

    // ---------------------------------------------------------------- Messantia Gate
    'c2-mgate': {
      ...ROOM['c2-mgate'],
      desc: [
        { text: `Messantia rises from the coast in tiers of white stone gone gold in the dusk, crowned with domes and gulls. The great gate stands open. Argossean guards in blue cloaks lean on their spears, checking carts with the bored contempt of men who are paid either way.` },
      ],
      exits: { w: 'c2-oasis', e: 'c2-docks' },
      enter: [{ clear: 'c2-in-marsh' }],
      things: [
        { id: 'gate-guard', name: 'Gate Sergeant', kind: 'person', portrait: 'generic-man', talk: 'c2-gate-guard', look: `A thick-necked Argossean sergeant with a blue cloak and a face like a clenched fist. He chews something and spits it at your boots without malice.` },
        { id: 'poster', name: 'Wanted Poster', take: [{ if: 'once:c2-poster', say: `There's only the nail left.` }, { once: 'c2-poster', do: [say(`You tear it down. Shevra takes it from you, folds it carefully and tucks it away. "Souvenir. She's going to hate this drawing."`)] }],
          look: [say(`WANTED: ILSA REDHAND, Barachan pirate, for piracy, insolence and laughing at an officer of the Crown. Fifty gold, alive. The drawing shows a woman with wild red hair and a grin you could cut yourself on.`), sh(`"Laughing at an officer." Now *that* is a hanging offence.`)] },
        { id: 'beggar', name: 'Blind Beggar', kind: 'person', portrait: 'generic-man', look: `An old sailor with milky eyes and a tin cup, sitting against the gate's warm stones. His hands are covered in old rope-scars.`,
          talk: [
            { if: 'once:c2-beggar', then: [ln('c2-beggar', `Go on, big man. Mind the tunnels.`)],
              else: [
                ln('c2-beggar', `Spare a copper for an old salt? The sea took my eyes and the Count took my pension.`),
                { choice: [
                  { id: 'give', text: 'Drop five gold in his cup.', if: 'gold>=5', do: [{ gold: -5 }, { once: 'c2-beggar', do: [
                    ln('c2-beggar', `Five! Mitra bless you, big man. For that, a secret: the customs men and the smugglers are the same men in different hats. Under the Customs Warehouse there's a trapdoor, and under that, the old tunnels, all the way to the drowned cistern. Even under the Brig.`),
                    { xp: 40 },
                  ] }] },
                  { id: 'no', text: 'Not today.', do: [ln('c2-beggar', `Nor any day. Bless you anyway.`)] },
                ] },
              ] },
          ] },
        { id: 'banner', name: 'Dolphin Banner', noTake: true, look: [say(`Over the gate hangs a blue banner embroidered with a leaping dolphin: the arms of Count Valerio, harbor master of Messantia. The dolphin looks like a sausage that has been surprised.`)] },
      ],
      first: [
        pt(`Messantia. Ships, sailors and swindlers. Mind your purses; mind the heart most of all.`),
      ],
    },

    // ---------------------------------------------------------------- Docks
    'c2-docks': {
      ...ROOM['c2-docks'],
      desc: [
        { text: `The docks of Messantia stink gloriously of tar, fish and money. Galleys lie three deep at the quays; cranes groan; gulls fight over guts. North, a tavern sign shows a drowned gull. South, past an iron gate, the Debtors' Pen and the Brig. East, the long roof of the Customs Warehouse.` },
        { if: '!flag:c2-ilsa-free', text: `Every captain you ask spits and makes the sign against evil when you say *Isle of the Iron Dead*.` },
      ],
      exits: { w: 'c2-mgate', n: 'c2-gull', s: 'c2-pen', e: 'c2-warehouse' },
      things: [
        { id: 'arms', name: 'Argossean Arms', kind: 'person', portrait: 'generic-man', talk: 'c2-arms', look: `A stall of racked blades and hammers under a striped awning, run by a one-armed Argossean veteran who tests every edge on his thumbnail.` },
        { id: 'dockhand', name: 'Dockhand', kind: 'person', portrait: 'generic-man', talk: 'c2-dockhand', look: `A barrel-chested dockhand coiling a hawser, his arms tattooed with every port from here to Kush.` },
        { id: 'galleys', name: 'Galleys', noTake: true, look: [say(`Fat merchant galleys from Zingara and Kordava, and a lean war galley flying the dolphin. None of them is going where you are going.`), { if: 'party:ilsa', line: ['ilsa', `Tubs. Every one of them. My *Sea-Wolf* could run rings round them with her sails furled.`] }] },
        { id: 'gulls', name: 'Gulls', noTake: true, look: `A gull eyes the bulge of the Starheart in your pouch, decides it isn't a fish, and screams at you anyway.`, verbs: { Shoo: [say(`You flap. The gulls flap. Everyone feels foolish.`)] } },
        { id: 'crane', name: 'Cargo Crane', noTake: true, look: [say(`A great wooden crane swings a net of amphorae over the water, worked by six slaves on a treadwheel.`), ln('brannoc', `In Cimmeria we carry our own wine.`), sh(`In Cimmeria you have wine?`)] },
      ],
      first: [
        say(`You ask after a ship for the Isle of the Iron Dead. The first captain laughs. The second spits. The third crosses himself to Mitra and walks into the sea up to his knees to get away from you.`),
        ln('c2-dockhand', `The Isle? Nobody sails for the Isle, friend. Nobody *sane*. Only one captain on this coast ever came back from it: Ilsa Redhand. And she's in the Brig, waiting for the Count to decide how to hang her.`),
        { set: 'c2-heard-ilsa' },
        MAIN,
      ],
    },

    // ---------------------------------------------------------------- Drowned Gull
    'c2-gull': {
      ...ROOM['c2-gull'],
      desc: [
        { text: `The Drowned Gull is low and dark and loud, hung with old nets and older sailors. A black barrel of Kraken rum squats behind the bar like an idol. On a stage the size of a door, a singer with a pin in her hair sings about the sea to men who don't listen.` },
      ],
      exits: { s: 'c2-docks', e: 'c2-office' },
      things: [
        { id: 'barmaid', name: 'Barmaid', kind: 'person', portrait: 'generic-woman', talk: 'c2-barmaid', look: `A broad, cheerful Argossean with forearms like a blacksmith's and a rag over one shoulder. She has heard every story in the world twice.` },
        { id: 'rum', name: 'Kraken Rum Barrel', take: `It's chained to the bar. The barmaid is watching. So is the barrel.`,
          look: [say(`A squat black barrel branded with a kraken. A chalk sign: KRAKEN RUM, 20 GOLD THE BOTTLE. PUTS A SAILOR FLAT FOR A DAY. NO REFUNDS.`), sh(`"Flat for a day." That's not a warning, Bear. That's a tool.`)],
          verbs: { 'Buy a bottle': [{ if: 'gold>=20', then: [{ gold: -20 }, { sfx: 'coins' }, say(`The barmaid fills a black bottle from the barrel and corks it with her thumb.`), { give: 'kraken-rum' }], else: [say(`"Twenty gold, love," says the barmaid. "The kraken doesn't do credit."`), { sfx: 'refuse' }] }] } },
        { id: 'singer', name: 'The Singer', kind: 'person', portrait: 'generic-woman', talk: 'c2-singer', look: `A thin, dark-eyed woman in a faded blue gown, singing with her eyes shut. A long silver pin holds up her hair.` },
        { id: 'old-drunk', name: 'Old Drunk', kind: 'person', portrait: 'generic-man', talk: 'c2-old-drunk', look: `An ancient sailor slumped over a cup, beard in the puddle. He looks like he's been here since the tavern was built, and possibly was used to build it.`,
          use: {
            'empty-bottle': [
              ln('old-drunk', `Breathe in a bottle? For the witch? Ha! All right, all right. It's my last, I swear. I'm quitting.`),
              say(`He breathes into the bottle, long and slow, a breath of forty years of rum. You cork it fast. The glass fogs and stays fogged.`),
              { take: 'empty-bottle', quiet: true }, { give: 'last-breath' },
              sh(`If that's his last breath, I'm the Queen of Aquilonia.`),
            ],
            'kraken-rum': [ln('old-drunk', `Ohhh, no. No. Kraken put me under for three days in the year of the comet. I woke up married. Keep it away.`)],
            '*': `He peers at it through one eye. "Can I drink it? No? Then why are you showing me?"`,
          } },
        { id: 'nets', name: 'Old Nets', take: `You pull a net. A dried pufferfish falls out and rolls under a table, glaring.`, look: `Fishing nets hang from the beams, full of dried starfish, cork floats and one boot.` },
      ],
      first: [
        sh(`Finally, civilisation. It smells like feet.`),
        il(`Gods, I've missed this hole. Barmaid! Whatever kills fastest.`),
      ],
      safe: true,
    },

    // ---------------------------------------------------------------- Harbor Office
    'c2-office': {
      ...ROOM['c2-office'],
      desc: [
        { text: `The Harbor Office is all polished wood and dolphin-crested brass, and every wall is papered with poetry. Sheets of it, pinned edge to edge, curling in the sea air. A great desk sags under seals and ledgers.` },
        { if: '!flag:c2-valerio-out', text: `Behind the desk, Count Valerio, harbor master of Messantia, poses with a quill like a man expecting a sculptor.` },
        { if: 'flag:c2-valerio-out', text: `Count Valerio lies across his desk, snoring like a bilge pump, a black bottle in his fist.` },
      ],
      exits: { w: 'c2-gull', s: 'c2-warehouse' },
      things: [
        { id: 'valerio', name: 'Count Valerio', kind: 'person', portrait: 'valerio', if: '!flag:c2-valerio-out', talk: 'c2-valerio',
          look: `A plump, perfumed Argossean nobleman in a peacock-blue doublet, with oiled curls, a beauty mark painted on one cheek and a fat gold signet ring on his finger. He catches you looking at the ring and turns it so the dolphin shows.`,
          use: {
            'kraken-rum': [{ if: 'flag:c2-valerio-pleased', then: [say(`He waves the bottle off without looking. "Pour, pour, into the goblet, I'm composing."`)], else: [ln('valerio', `Sailor's swill? In *my* office? I drink only the white of Kordava, like my father and his poet.`)] }],
            'sealed-order': [ln('valerio', `Oh, my seal! How it shines. Go on, show it to someone important.`)],
            '*': `Count Valerio looks at it as if it were a bad rhyme.`,
          } },
        { id: 'valerio-out', name: 'Count Valerio (snoring)', kind: 'person', portrait: 'valerio', if: 'flag:c2-valerio-out',
          look: [say(`The Count sleeps the sleep of the Kraken, cheek in a puddle of ink. His curls have come uncurled. His bare finger has a pale band where a signet ring used to be.`), { if: 'quest:sq-witch>=1 & !item:liar-hair & !flag:c2-gave-hair', line: ['shevra', `Mother Sagra wants a liar's hair, Bear. And look who's asleep.`] }],
          verbs: { Snip: [
            { if: 'item:liar-hair | flag:c2-gave-hair', then: [say(`He has hair enough left, but one lock is plenty for any witch.`)],
              else: [{ if: 'quest:sq-witch>=1', then: [say(`You draw your dagger and saw off one perfumed curl. Valerio smiles in his sleep and murmurs, "...a hundred cantos..."`), { give: 'liar-hair' }, sh(`A liar's hair. He lies in his sleep. That's dedication.`)],
                else: [say(`You consider giving the Count a haircut. It would improve him, but it would be pointless.`)] }] },
          ] } },
        { id: 'poetry', name: 'Poetry on the Walls', take: `There are hundreds. Taking one would only leave room for another.`,
          look: [
            say(`Odes to the Count's ships, the Count's dolphin, the Count's moustache. There is not a single rhyme anywhere.\n\nIn the margins, notes in the same proud hand: *"Rhyme is for tavern-songs!"* Beside a cut-down verse: *"Longer! Longer!"* And under a fair copy: *"Clerks write neatly. Poets write TRULY."*`),
            sh(`A man who writes this much wants to be told it's good. That's all. Not *how* it's good. Just good. The best.`),
          ] },
        { id: 'desk', name: 'Desk', look: [say(`A desk the size of a boat, with drawers labelled in gold: PERMITS, FINES, POEMS (DRAFTS), POEMS (MASTERPIECES), and RELEASE ORDERS. The last drawer is stuffed with blank release orders, waiting for the Count's seal.`)],
          take: [{ if: 'item:blank-order | item:sealed-order', then: [say(`You already have one. The drawer holds a hundred more; the Count releases nobody.`)], else: [say(`You lift a blank release order from the drawer. There are a hundred more where it came from.`), { give: 'blank-order' }] }] },
        { id: 'goblet', name: "Valerio's Goblet", if: 'flag:c2-valerio-pleased & !flag:c2-valerio-out', noTake: true,
          look: [say(`Valerio has poured himself a goblet the size of a helmet and you a thimble of pale Kordavan wine. He toasts himself after every line, and he never looks at what's in his cup, only at his own reflection in it.`), sh(`He'd drink seawater if you poured it. Or something stronger.`)],
          use: {
            'kraken-rum': [
              say(`While the Count reads his ninth canto aloud with his eyes closed, you empty the Kraken into his goblet. It's black as a well. He doesn't notice.`),
              { take: 'kraken-rum', quiet: true },
              ln('valerio', `To me! To Valerio, whose verses shall outlive the... the... oh my. Oh, that's... robust...`),
              { sfx: 'drink' },
              say(`He drains it. His eyes cross. He says "dolphin" very slowly, and goes face down onto the desk like a felled tree.`),
              { set: 'c2-valerio-out' },
              say(`Shevra is already at his side. Her fingers flicker. When she straightens, the fat gold signet is gone from his hand.`),
              { sfx: 'steal' },
              { give: 'valerio-signet' },
              ln('shevra', `One Count's seal. He'll wake tomorrow with a headache and a hole in his poetry.`),
              { xp: 30 },
              MAIN,
            ],
            '*': `You hover over the goblet with it. Shevra kicks your ankle. "Something he'll *drink*, Bear."`,
          } },
        { id: 'seal-press', name: 'Seal Press', noTake: true, look: `A brass press for stamping wax, and a pot of the Count's crimson sealing wax, warm on its little lamp. It's useless without the Count's own ring: the dolphin is cut into that, not into the press.` },
      ],
      first: [
        sh(`Mitra's mercy. Every wall. Every single wall.`),
        il(`That's the peacock who jailed me. I laughed at one of his poems in the market. *One.*`),
      ],
    },

    // ---------------------------------------------------------------- Customs Warehouse
    'c2-warehouse': {
      ...ROOM['c2-warehouse'],
      desc: [
        { text: `The Customs Warehouse is a cathedral of bales and casks, dim and dusty, smelling of pepper and wet rope. Impounded goods are stacked to the rafters, each tagged with the dolphin seal. Big doors on the far side open onto the customs quay.` },
        { if: '!won:c2-marines', text: `Two Argossean marines in iron scale stand on a trapdoor in the floor with the look of men guarding someone else's money.` },
        { if: 'won:c2-marines', text: `The trapdoor stands open on a ladder into the dark. It breathes up a cold smell of the sea.` },
      ],
      exits: {
        w: 'c2-docks', n: 'c2-office',
        e: { to: 'c2-deck', if: 'flag:c2-ship-free', blocked: `The harbor guard on the quay lowers his spear. "That ship's impounded by order of the Count. Nobody boards without a stamped release."` },
        d: { to: 'c2-tunnels', if: 'won:c2-marines', blocked: `The trapdoor is shut, and two marines are standing on it.` },
      },
      things: [
        { id: 'marines', name: 'Marines', kind: 'person', portrait: 'generic-man', if: '!won:c2-marines',
          look: [say(`Two Argossean marines in iron scale and steel helms, swords on their hips. Iron scale turns a blade nicely. It does nothing at all for a hammer.`), sh(`Bear, swap to the mace for these two. Edges just skate off that scale.`)],
          talk: [ln('c2-marine', `Move along. Customs business.`), ln('brannoc', `What's under the trapdoor?`), ln('c2-marine', `Customs business. Move along, or we'll *impound* you.`)],
          verbs: { Fight: marinesFight } },
        { id: 'trapdoor', name: 'Trapdoor', noTake: true,
          look: [say(`A heavy oak trapdoor bound in iron, with a ring for a handle. Wet bootprints lead to it and away from it: not customs boots. Smugglers' boots.`), { if: 'party:ilsa & !flag:c2-charts', line: ['ilsa', `Marro's rats come and go through there. My chest went down that hole.`] }],
          verbs: { Open: [{ if: 'won:c2-marines', then: [say(`It's open. The ladder goes down into the dark.`)], else: marinesFight }] } },
        { id: 'bales', name: 'Impounded Bales', noTake: true, look: `Bales of Vendhyan pepper, Shemite wool and Zingaran silk, all tagged IMPOUNDED. A few are tagged IMPOUNDED (COUNT'S PERSONAL).`,
          verbs: { Search: [{ if: 'once:c2-bales', say: `Nothing else worth stealing. Shevra checks twice anyway.` }, { once: 'c2-bales', do: [say(`Between two bales tagged COUNT'S PERSONAL, Shevra finds a crate of Stygian fire-oil in clay flasks. "Personal," she says, pocketing two.`), { give: 'fire-flask', n: 2 }] }] } },
        { id: 'harbor-guard', name: 'Harbor Guard', kind: 'person', portrait: 'generic-man',
          look: [say(`A lanky harbor guard leans in the big doors to the customs quay, guarding a lean black galley with a wolf's-head prow.`), { if: '!flag:c2-ship-free', say: `He has a slate of impounded ships and a stub of chalk, and he takes both very seriously.` }],
          talk: [{ if: 'flag:c2-ship-free', then: [ln('harbor-guard', `Stamped twice, that order. Never seen the like. Go on, she's yours.`)], else: [ln('harbor-guard', `That's the *Sea-Wolf*. Impounded. Nobody boards without a release stamped with the Count's own seal. And the Count (he lowers his voice) never stamps anything.`)] }],
          use: { 'sealed-order': [ln('harbor-guard', `Fine seal. But it's made out for the *crew*, see? The clerk at the Pen has to stamp it for the ship too.`)], '*': `The guard looks at it, then at you. "That's not a release."` } },
        { id: 'ship-view', name: 'The Sea-Wolf', noTake: true, look: [say(`Through the big doors: a lean black galley, low and fast, her furled sails patched red. A wolf's head snarls at her prow.`), il(`There she is. My girl. Don't you *dare* call her a tub.`)] },
      ],
    },

    // ---------------------------------------------------------------- Smugglers' Tunnels
    'c2-tunnels': {
      ...ROOM['c2-tunnels'],
      desc: [
        { text: `Old brick tunnels sweat in the lamplight, older than Messantia, older than Argos. Water drips. The ladder climbs back to the warehouse.` },
        { if: '!flag:c2-sluice & !flag:c2-swum', text: `Eastward, black water fills the passage to the roof. A sluice wheel stands in the wall; its iron spoke has snapped off at the hub. Tide-marks on the brick show the water drains when the wheel turns.` },
        { if: 'flag:c2-sluice | flag:c2-swum', text: `Eastward, the passage drips and gleams where the water was. It leads on toward a great dark echo.` },
        { text: `Above, in the roof of a side passage, a rusted grate lets down a little grey light.` },
      ],
      exits: {
        u: 'c2-warehouse',
        e: { to: 'c2-cistern', if: 'flag:c2-sluice | flag:c2-swum', blocked: `Black water fills the passage to the roof. You'd have to swim it, or drain it.` },
        n: { to: 'c2-brig', if: 'flag:c2-grate-open' },
      },
      things: [
        { id: 'sluice', name: 'Sluice Wheel', noTake: true,
          look: [say(`A great iron wheel set in the wall, crusted with barnacles, its axle running down into the flooded passage. One spoke has snapped off at the hub, and without it you can't get a grip to turn it.`), { if: '!flag:c2-sluice & party:ilsa', line: ['ilsa', `Find me something long with a hook to it and I'll turn that wheel myself.`] }, { if: '!flag:c2-sluice & !party:ilsa', line: ['shevra', `Something long, Bear. To stick in the hub. Even you can manage that.`] }],
          verbs: { Turn: [{ if: 'flag:c2-sluice', then: [say(`It's turned. The passage is drained.`)], else: [say(`You grip the hub with both hands and heave until your eyes bulge. Rust flakes off. The wheel doesn't care.`), sh(`It's missing a spoke, Bear. Muscles aren't spokes.`)] }] },
          use: {
            'boat-hook': [
              say(`You jam the marine's boat hook into the empty socket at the hub. It fits like it was made for it. You lean on it.`),
              say(`The wheel shrieks, turns, turns again. Somewhere below, iron gates grind. The black water gurgles, sucks, and drops, foot by foot, out of the passage, leaving it gleaming and full of flopping fish.`),
              { take: 'boat-hook', quiet: true },
              { sfx: 'rumble' }, { shake: true }, { sfx: 'sting-solved' },
              { set: 'c2-sluice' }, { xp: 20 },
              il(`*That's* how a Cimmerian opens a door. Good. Now let's find my chest.`),
            ],
            starheart: [pt(`Do NOT dunk the heart, barbarian.`)],
            '*': `You try to fit it into the hub. It's too short, too fat, or too stupid. Something long, with a hook.`,
          } },
        { id: 'flood', name: 'Flooded Passage', noTake: true, if: '!flag:c2-sluice & !flag:c2-swum',
          look: [say(`Black water, still as oil, right up to the arch. Something long ripples under the surface and is gone.`), sh(`Eels. It's always eels.`)],
          verbs: { Swim: [
            say(`You take a breath, set your knife between your teeth, and go in. The water is cold as a grave, and it is full of teeth.`),
            { fight: { id: 'c2-tunnel-eels', enemies: ['marsh-eel', 'marsh-eel'], noFlee: true, intro: 'Tunnel eels come out of the dark water!',
              win: [say(`You drag yourself out on the far side, gasping, and haul the others after you.`), { set: 'c2-swum' }] } },
          ] } },
        { id: 'grate', name: 'Rusted Grate', noTake: true,
          look: [say(`In the roof of a side passage: a grate of rusted iron, red as a scab. Through it you hear a fat man snoring and someone pacing.`), { if: '!party:ilsa', say: `The pacing stops. A woman's voice drifts down: "If that's a rat, I'm going to eat you."` }],
          verbs: { Push: [
            { if: 'flag:c2-grate-open', then: [say(`The grate is already off.`)],
              else: [{ if: '!won:c2-tunnel-smugglers', then: [say(`You can't get at it with smugglers at your back.`)],
                else: [
                  say(`You set your shoulders under the grate and push. Rust screams; the bolts let go all at once and the grate bangs up into the cell above.`),
                  { sfx: 'door' }, { set: 'c2-grate-open' },
                  { if: '!party:ilsa', then: [
                    say(`A face appears in the square of light: fierce green eyes, a mane of red hair, a grin.`),
                    ln('ilsa', `Well. I've been rescued by sea, by sword and by bribery. Never by a Cimmerian coming up through the floor.`),
                    say(`She drops down into the tunnel beside you, light as a cat.`),
                    ...ilsaJoins,
                  ] },
                ] }] },
          ] } },
        { id: 'crates', name: "Smugglers' Crates", noTake: true, look: `Crates stencilled FISH, which are not fish. Some clink. Some tick. One growls faintly.`,
          verbs: { Search: [{ if: 'once:c2-crates', say: `The growling crate is the only one you haven't opened. You leave it that way.` }, { once: 'c2-crates', do: [say(`You pry the lids. Mostly Stygian lotus and cheap Kothian swords. At the bottom, a purse and a flask of good red tonic.`), { gold: 60 }, { give: 'great-draught' }] }] } },
        { id: 'tidemarks', name: 'Tide-Marks', noTake: true, look: `Lines of green slime on the brick, one above another, like the rings of a tree. The water rises and falls here with the sluice, not with the sea.` },
      ],
      first: [
        { fight: { id: 'c2-tunnel-smugglers', enemies: ['smuggler', 'smuggler', 'smuggler'], noFlee: true,
          intro: 'Three smugglers look up from a dice game, and reach for their knives!',
          win: [say(`The dice game is over. Everyone lost.`), sh(`Teal sashes. Gull-Eye Marro's boys. He's down here somewhere.`)] } },
      ],
    },

    // ---------------------------------------------------------------- Drowned Cistern
    'c2-cistern': {
      ...ROOM['c2-cistern'],
      desc: [
        { text: `A cistern as big as a temple, its roof held up by a forest of pillars carved with drowned faces. Black water laps at broken steps. On a dais of stacked casks sits a throne made from a ship's figurehead.` },
        { if: 'won:c2-marro', text: `Gull-Eye Marro's throne is empty now. His treasure is heaped around it, waiting for new owners.` },
      ],
      exits: { w: 'c2-tunnels' },
      things: [
        { id: 'chest', name: "Ilsa's Sea-Chest", if: 'won:c2-marro', noTake: true,
          look: [say(`A sea-chest of black oak, banded in brass, a red hand painted on the lid. It's been pried at by someone who gave up.`), { if: 'flag:c2-charts', say: `Empty now, but for the smell of tar and old maps.` }],
          verbs: { Open: [{ if: 'once:c2-chest', say: `Empty now, but for the smell of tar.` }, { once: 'c2-chest', do: [
            say(`The lock is stiff. Shevra sighs, kneels, and opens it in the time it takes you to say "let me".`),
            { sfx: 'door' },
            say(`Inside, wrapped in oilcloth: a fat roll of sea-charts in a dozen inks, one sheet scorched at the edges and marked with a red skull and the words *Isle of the Iron Dead*. A red longcoat, folded. And a purse of Barachan silver.`),
            { set: 'c2-charts' },
            { give: 'ilsa-longcoat' },
            { gold: 150 },
            { call: 'c2-ilsa-coat' },
            il(`My charts. My coat. My *money*. Brannoc, I could kiss you. I won't. But I could.`),
            { if: '!party:ilsa', say: `You roll the charts under your arm. Somebody, somewhere, will want these.` },
            MAIN,
          ] }] } },
        { id: 'marro', name: "Marro's Body", if: 'won:c2-marro', noTake: true, kind: 'thing',
          look: [say(`Gull-Eye Marro lies where he fell, his famous glass eye staring at the roof. It's painted to look like a gull's. It doesn't help.`)],
          verbs: { Search: [{ if: 'once:c2-marro-body', say: `You've robbed him once. Twice is just rude.` }, { once: 'c2-marro-body', do: [say(`In his boot: a Kordavan dagger and a love letter, misspelled. You keep neither, but the purse in his belt comes with you.`), { gold: 40 }] }] } },
        { id: 'pillars', name: 'Drowned Pillars', noTake: true, look: [say(`Every pillar is carved with faces, eyes shut, mouths open, hair floating as if underwater. Some are weeping. Some are laughing.`), pt(`The old Argossean kings built this for their sea-god. Then the sea-god came to collect.`)] },
        { id: 'throne', name: 'Figurehead Throne', noTake: true, look: `A ship's figurehead, a bare-breasted mermaid with a chipped nose, set on its back and cushioned with stolen velvet. A smuggler king's throne.`, verbs: { Sit: [say(`You sit. It's lumpy. You feel like a king, which is to say, uncomfortable.`), sh(`It suits you, Bear. Give it a thousand years.`)] } },
        { id: 'water', name: 'Black Water', noTake: true, look: `Still and black. Far down, something pale turns over slowly, like a drowned man dreaming.` },
      ],
      first: [
        say(`A big man rises from the figurehead throne: bald, bearded, one eye blue and the other a glass ball painted like a gull's. His teal-sashed bodyguards spread out between the pillars.`),
        ln('c2-marro', `Visitors in Marro's house! And look: one of them carries something that *glows*. Gull-Eye always gets the shiny things in the end.`),
        { if: 'party:ilsa', then: [ln('ilsa', `You've got my chest, Marro.`), ln('c2-marro', `Redhand! Out of the Brig? Then I'll sell you twice!`)], else: [ln('brannoc', `I want the red sea-chest.`), ln('c2-marro', `Want's a fine word, northerner. Let's see you *buy*.`)] },
        { fight: { id: 'c2-marro', enemies: ['smuggler', 'smuggler-chief', 'smuggler'], noFlee: true, intro: 'Gull-Eye Marro and his bodyguards attack!',
          win: [say(`Gull-Eye Marro goes down among his pillars and doesn't get up. Behind his throne, among the stolen treasure, sits a black sea-chest with a red hand on the lid.`), { sfx: 'sting-victory' }] } },
      ],
    },

    // ---------------------------------------------------------------- Debtors' Pen
    'c2-pen': {
      ...ROOM['c2-pen'],
      desc: [
        { text: `The Debtors' Pen is a stone yard behind iron bars, packed with men who owe the Crown money and are now paying it back by sitting in the sun. A clerk at a high desk guards the gate with a quill and a heap of papers.` },
        { if: '!flag:c2-ship-free', text: `In one corner, two dozen hard-faced sailors with red-hand tattoos sit together and pointedly don't mingle.` },
      ],
      exits: { n: 'c2-docks', e: 'c2-brig' },
      things: [
        { id: 'clerk', name: 'Clerk', kind: 'person', portrait: 'generic-man', talk: 'c2-clerk',
          look: [say(`A pale, stooped clerk with ink to the elbows. He reads every paper upside down, with great care, nodding. He has never once noticed.`), { if: 'party:ilsa & !flag:c2-ship-free', line: ['ilsa', `A clerk will free anything with enough wax on it. Find me a seal and I'll find you a crew.`] }],
          use: {
            'sealed-order': [{ if: 'flag:c2-ship-free', then: [ln('clerk', `Already stamped! Twice! I have never stamped anything twice before. It was wonderful.`)],
              else: [{ if: '!party:ilsa', then: [
                ln('clerk', `A release! Sealed by the Count! For... the crew of the *Sea-Wolf*.` ),
                ln('c2-bosun', `We're not walking out of here without our captain, clerk. Bring us Redhand, northerner, then wave your paper.`),
              ], else: [
                say(`The clerk takes the order, turns it upside down, reads it with great care and nods.`),
                ln('clerk', `The Count's own dolphin. Release of the crew of the *Sea-Wolf*. Very proper. And since the crew are released, their *ship* is released, it follows, by the logic of the paper. I'll stamp it again for the ship.`),
                { sfx: 'door' },
                say(`Thump, thump. The gate swings open. Ilsa's crew pour out, slapping her back, swearing, laughing, and making for the customs quay at a run.`),
                { scene: { img: 'bg-messantia', text: `Twenty-two Barachan cutthroats run down the quay roaring Ilsa's name, and the harbor guard at the *Sea-Wolf*'s gangplank takes one look at the twice-stamped order and steps smartly aside.` } },
                { set: 'c2-ship-free' }, { xp: 15 },
                ln('ilsa', `Crew, ship and captain. All we lack is a reason to leave port without being chased by the whole Argossean navy.`),
                MAIN,
              ] }] }],
            'blank-order': [ln('clerk', `This is blank. I can stamp a blank, but it would be a *blank* release, and then who would I release? Everybody? Nobody? I'd have to lie down.`)],
            'valerio-signet': [ln('clerk', `A ring? I can't stamp a ring. It needs to go on *paper*. With wax. Then I can stamp the paper.`)],
            '*': `The clerk turns it upside down, reads it with great care, and hands it back. "Not a document."`,
          } },
        { id: 'crew', name: "Ilsa's Crew", kind: 'person', portrait: 'generic-man', if: '!flag:c2-ship-free', talk: 'c2-bosun',
          look: `Barachan pirates, all scars and earrings and red-hand tattoos. Their bosun, a grey-bearded giant, sits apart, sharpening a spoon into a knife.` },
        { id: 'debtors', name: 'Debtors', kind: 'person', portrait: 'generic-man', look: `A cobbler, a failed priest, three gamblers and a poet who owes the Count for paper. They play knucklebones for each other's debts.`,
          talk: [ln('c2-debtor', `I owe the Crown nine gold for "insufficient applause" at the Count's last reading. Nine! I clapped till my hands bled!`)] },
        { id: 'slate', name: 'Debt Slate', noTake: true, look: `A great slate of names and sums. SEA-WOLF, CREW OF: harbor dues, mooring fines, "insolence", "laughter (public)". Total: 200 gold. Someone has drawn a rude picture of a dolphin next to it.` },
      ],
    },

    // ---------------------------------------------------------------- Brig
    'c2-brig': {
      ...ROOM['c2-brig'],
      desc: [
        { text: `The Brig is a row of barred cells in the damp belly of the harbor wall, lit by one smoky lamp. A fat jailer sits on a stool by the door; a hand-lettered sign is nailed to the stool.` },
        { if: '!flag:c2-ilsa-free', text: `In the end cell, a red-haired woman paces like a caged leopard.` },
        { if: '!flag:c2-jailer-out & !flag:c2-ilsa-free', text: `The fat jailer licks his lips every time someone mentions the Gull's black rum. The sign on his stool forbids drinking on duty, by order of Count Valerio.` },
        { if: 'flag:c2-ilsa-free', text: `The end cell stands empty.` },
      ],
      exits: { w: 'c2-pen', s: { to: 'c2-tunnels', if: 'flag:c2-grate-open' } },
      things: [
        { id: 'jailer', name: 'The Jailer', kind: 'person', portrait: 'jailer', if: '!flag:c2-jailer-out', talk: 'c2-jailer',
          look: `A vast man in a stained tunic, his keys on a ring at his belt. He sweats like a cheese. Every time the door opens and a whiff of the Gull blows in, his tongue darts over his lips.`,
          use: {
            'kraken-rum': [ln('jailer', `Ohhh, *Kraken*. No. No! Look at the sign. Unless... no. Only the Count himself could make me.`), sh(`Bear. *Talk* to the man. Tell him who it's from.`)],
            '*': `The jailer eyes it. "Is that rum? No? Then it's no use to me."`,
          } },
        { id: 'jailer-asleep', name: 'The Jailer (snoring)', kind: 'person', portrait: 'jailer', if: 'flag:c2-jailer-out',
          look: [say(`The jailer snores on his stool, an empty black bottle cradled like a baby. His keys hang at his belt.`), { if: '!item:brig-key & !flag:c2-ilsa-free', line: ['shevra', `Keys, Bear. Right there. He won't feel a thing.`] }],
          verbs: { 'Take keys': [{ if: 'item:brig-key | flag:c2-ilsa-free', then: [say(`You've had what you need from him.`)], else: [say(`You lift the ring of keys from his belt. He mumbles "...for the Count..." and smiles in his sleep.`), { sfx: 'steal' }, { give: 'brig-key' }] }] } },
        { id: 'sign', name: "Sign on the Stool", noTake: true, look: [say(`Painted in careful capitals: NO DRINKING ON DUTY. BY ORDER OF HIS EXCELLENCY COUNT VALERIO, HARBOR MASTER, POET.`), sh(`"Poet." He signed that one himself, I'd bet.`)] },
        { id: 'ilsa', name: 'Ilsa Redhand', kind: 'person', portrait: 'ilsa', if: '!flag:c2-ilsa-free', talk: 'c2-ilsa-cell',
          look: `Tall, lean, freckled and furious, in a torn shirt and sea-boots, with a mane of red hair and green eyes that measure you for a coffin and then, grudgingly, for a crew. Her right hand is tattooed red from fingertips to wrist.`,
          use: { 'kraken-rum': [ln('ilsa', `Later. I'll drink to my freedom when I *have* it.`)], '*': `Ilsa looks at it through the bars. "Unless that opens locks, northerner, stop waving it at me."` } },
        { id: 'cell-door', name: 'Cell Door', if: '!flag:c2-ilsa-free', noTake: true,
          look: `A door of thick iron bars and a lock the size of your fist. The jailer's ring holds the key. Then again, any lock opens for someone clever enough.`,
          verbs: { Open: [say(`You rattle the door. It rattles back. Ilsa watches with the expression of a woman who has already tried that.`)] },
          use: {
            'brig-key': [
              say(`The big key turns with a clank. The cell door swings open.`),
              { sfx: 'door' }, { take: 'brig-key', quiet: true }, { xp: 30 },
              ...ilsaJoins,
            ],
            hairpin: [
              say(`The jailer launches into a long complaint about the Count's poetry, aimed at your chest. Behind your broad back, Shevra kneels at the lock with the singer's silver pin.`),
              { sfx: 'steal' },
              say(`Click. She's opening the door before the jailer gets to the second stanza. "Thank you for the recital," she tells him, and you leave him blinking.`),
              { take: 'hairpin', quiet: true }, { xp: 30 },
              ...ilsaJoins,
            ],
            starheart: [ln('ilsa', `Pretty. Does it open doors?`), pt(`It opens *one* door, captain, and this isn't it.`)],
            '*': `You try it on the lock. The lock is unimpressed.`,
          } },
        { id: 'prisoner', name: 'Other Prisoner', kind: 'person', portrait: 'generic-man', look: `In the next cell, a one-eyed Kushite sits cross-legged with his eyes shut. He has been praying for three days, the jailer says, for the jailer to choke.`,
          talk: [ln('c2-kushite', `The woman next door has sworn to kill every man in Messantia. I am praying she starts with the Count. Also, there is a grate in her floor, and something under it that walks at night.`)] },
      ],
      first: [
        { if: '!flag:c2-ilsa-free', then: [
          ln('ilsa', `Another fool come to gawk at the pirate? Gawk away. It's the last free thing in Messantia.`),
          ln('brannoc', `I need a ship that will sail to the Isle of the Iron Dead.`),
          say(`She stops pacing. She looks at you properly for the first time, and she laughs, a big reckless laugh that rings off the stones.`),
          ln('ilsa', `*Now* we're talking. Free me, my crew and my ship, and I'll sail you to the edge of the world.`),
          { set: 'c2-met-ilsa' }, MAIN,
        ] },
      ],
    },

    // ---------------------------------------------------------------- Deck
    'c2-deck': {
      ...ROOM['c2-deck'],
      desc: [
        { text: `The deck of the *Sea-Wolf* is scrubbed white and alive with crew: men aloft in the rigging, men at the oars, the bosun bawling at all of them. She strains at her mooring lines like a hound on a leash.` },
        { if: '!flag:c2-charts', text: `Ilsa stands at the wheel with her arms crossed, not giving the order.` },
        { if: 'flag:c2-charts', text: `Ilsa has her charts spread on the binnacle, weighted with a dagger. She's grinning like a wolf.` },
      ],
      exits: { w: 'c2-warehouse' },
      things: [
        { id: 'lines-wait', name: 'Mooring Lines', if: '!flag:c2-charts', noTake: true,
          look: `Thick hawsers hold the *Sea-Wolf* to the quay. One slash and she's free.`,
          verbs: { 'Cast off': [
            ln('ilsa', `No charts, no Isle. I'm not sailing blind into a sea that eats ships. Get my chest back from Marro, under the Customs Warehouse.`),
            { sfx: 'refuse' },
          ] } },
        { id: 'lines', name: 'Mooring Lines', if: 'flag:c2-charts', noTake: true,
          look: `Thick hawsers hold the *Sea-Wolf* to the quay. One slash and she's free.`,
          verbs: { 'Cast off': { noReturn: `Once the Sea-Wolf clears the harbor, there's no turning back for Messantia, the marsh or the road.`, do: [
            ln('ilsa', `CAST OFF! Oars out! Let's go see what the edge of the world looks like!`),
            say(`You draw your sword and cut the bow line yourself. The crew roar. Oars bite. The *Sea-Wolf* slides away from Messantia, and the white city shrinks behind you into a gull's feather on the horizon.`),
            { sfx: 'gate-open' },
            { set: 'c2-at-sea' },
            MAIN,
            { goto: 'c2-open-sea' },
          ] } } },
        { id: 'bosun', name: 'Bosun Haddo', kind: 'person', portrait: 'generic-man', talk: 'c2-bosun', look: `The grey-bearded giant from the Pen, now in his element, a rope's end in his fist and a song in his throat. He calls everyone "lad", including Shevra and the mast.` },
        { id: 'wheel', name: 'Wheel', noTake: true, look: [say(`A great spoked wheel of black wood, polished by Ilsa's hands. Carved on the hub: *She bites back*.`)], verbs: { Steer: [ln('ilsa', `Hands off my wheel, northerner. I don't touch your sword.`)] } },
        { id: 'figurehead', name: 'Wolf Figurehead', noTake: true, look: [say(`At the prow, a carved wolf's head snarls at the sea, its eyes inlaid with red glass.`), il(`My grandfather carved that. He said a ship needs a face the sea respects.`)] },
        { id: 'rigging', name: 'Rigging', noTake: true, look: `A web of tarred rope and patched red canvas. Men swarm up it like spiders.`, verbs: { Climb: [say(`You climb halfway up the shrouds. The deck sways. The sea sways. You climb down again with great dignity.`), sh(`Bear's afraid of heights!`), ln('brannoc', `Bear's afraid of *falling*. Different thing.`)] } },
      ],
      first: [
        say(`The crew cheer as you come aboard. One of them tries to shake your hand and bounces off.`),
        il(`Welcome aboard the *Sea-Wolf*, the fastest keel on the Black Coast.`),
        { if: '!flag:c2-charts', line: ['ilsa', `But I'm not taking her out until I have my charts. No charts, no Isle. I'm not sailing blind into a sea that eats ships.`] },
      ],
    },

    // ---------------------------------------------------------------- Open Sea
    'c2-open-sea': {
      ...ROOM['c2-open-sea'],
      desc: [
        { text: `Open sea, wine-dark at dusk, and nothing on any side but water and the long red sail cracking above. The *Sea-Wolf* runs before the wind, east and south toward the Black Coast. On the horizon ahead, clouds pile up like a black wall.` },
      ],
      exits: { e: { to: 'c2-storm', label: 'Into the storm' } },
      things: [
        { id: 'horizon', name: 'Storm Clouds', noTake: true, look: [say(`A wall of cloud, black as the inside of a fist, lit from within by lightning that makes no sound yet.`), il(`Khurath's weather. The serpent of the Black Coast lives in storms like that. Ha! I've always wanted to meet it.`)] },
        { id: 'ptahk-rail', name: 'Ptahk', kind: 'person', portrait: 'ptahk', if: 'party:ptahk', talk: 'c2-ptahk-sea', look: `Ptahk hangs over the rail, grey-green, clutching his staff. When the cook comes round with biscuit and salt pork he waves it off without looking.` },
        { id: 'wake', name: 'Wake', noTake: true, look: `The ship's wake runs white and straight behind you, all the way back to the world you knew. Dolphins play in it. Real ones. They look nothing like the Count's.` },
        { id: 'crew-sea', name: 'Crew', kind: 'person', portrait: 'generic-man', look: `The crew sing at the oars, a filthy song about a mermaid and a Kothian tax collector.`, talk: [ln('c2-bosun', `Fine wind, lad! Pray it holds. Past those clouds there's nothing but the serpent and the Isle, and I'm not sure which is worse.`)] },
      ],
      first: [
        say(`For a day and a night the *Sea-Wolf* runs before a fine wind. The crew sing. Shevra learns to throw dice on a pitching deck and wins three earrings and a parrot, which she loses again.`),
        ln('shevra', `Bear. I'm keeping the Count's ring. As a souvenir.`),
        ln('brannoc', `Crom. Keep it.`),
        ln('ilsa', `Shadizar, a beating heart and an island nobody comes back from. You are the best cargo I've ever carried, northerner.`),
        ln('brannoc', `And the worst paying.`),
        { line: ['ilsa', `Ha! The best things never pay.`] },
        say(`She laughs into the wind, red hair whipping, and turns the bow toward the black wall of the storm.`),
      ],
    },

    // ---------------------------------------------------------------- Storm
    'c2-storm': {
      ...ROOM['c2-storm'],
      desc: [
        { text: `The storm swallows the *Sea-Wolf* whole. Waves taller than temples. Rain like thrown gravel. Lightning, and in the lightning, something rising beside the ship: a coil as thick as a tower, scaled black and green, wrapping the sea.` },
      ],
      exits: {},
      things: [
        { id: 'sea', name: 'The Sea', noTake: true, if: '!won:c2-khurath', look: `Black water and white foam, heaving. Somewhere down there the serpent's kin are coiling.` },
        { id: 'isle', name: 'The Isle of the Iron Dead', noTake: true, if: 'won:c2-khurath',
          look: [say(`A black island in a white collar of surf. Cliffs, jungle, and on every beach, half buried in the sand, great iron shapes like giants who fell asleep in their armor and never woke. The Starheart beats against your ribs, quick and eager.`), il(`I told you I'd been there as a girl. I didn't tell you I had nightmares for a year.`)],
          verbs: { 'Make landfall': [
            ln('ilsa', `Bosun! Take us in. Gently. The rocks here have teeth.`),
            say(`The *Sea-Wolf* noses in toward the Isle on the morning tide, past the wrecks of ships that came before her.`),
            { set: 'c2-done' },
            { chapter: 'ch3' },
          ] } },
        { id: 'deck-wreck', name: 'Wrecked Deck', noTake: true, if: 'won:c2-khurath', look: [say(`Smashed rail, a cracked mast, and scales the size of shields scattered across the planks. The crew are already prying them up to sell.`), sh(`Serpent scale. Forty-five gold apiece in Messantia. I'm just saying.`)] },
      ],
      first: [
        ln('ilsa', `HA! Look at it! LOOK AT IT! Every man to his station! Brannoc, get your steel out, it's coming over the rail!`),
        { sfx: 'roar' }, { shake: true },
        { scene: { img: 'bg-storm', text: `Out of the waves rears *Khurath*, the serpent of the Black Coast: a head like an upturned galley, eyes like sunken lamps, a mouth that has swallowed ships whole. The rain hisses off its scales.\n\nIt looks down at you. It looks at the glow on your belt. And it strikes.` } },
        { fight: { id: 'c2-khurath', enemies: ['khurath'], boss: true, noFlee: true, music: 'boss',
          intro: 'Khurath, the sea serpent of the Black Coast, rises over the rail!',
          triggers: [
            { when: 'hp<0.5', enemy: 'khurath', do: [{ line: ['ilsa', `It's bleeding! Hit it again! Cut the bastard into steaks!`] }, { shake: true }] },
            { when: 'round>=3', do: [{ line: ['brannoc', `By Crom, it's half the size of a city wall.`] }] },
          ],
          win: [
            { sfx: 'sting-victory' },
            { scene: { img: 'bg-storm', text: `Khurath screams, a sound like a ship's keel tearing on rock, and crashes across the deck. The *Sea-Wolf* groans and rolls. Then the great body slides back into the sea, and its belly splits on the rail as it goes.\n\nOut of the reeking gut, among the bones of drowned men, something small and gold rolls across the planks and stops against your boot.` } },
            { give: 'wedding-ring' },
            say(`You pick it up: a heavy gold ring, a man's, worn thin. Inside, worn almost smooth: *M. to I., forever.*`),
            ln('ilsa', `Some drowned fool's promise. Keep it, Brannoc. The sea gives back what it can't digest.`),
            say(`But her thumb lingers on the letters before she gives it back, and for a moment she is very quiet.`),
            ln('ilsa', `Did you see? It went for every one of us but the old man. Not once at you, grandfather.`),
            pt(`Serpents have taste, captain. I am all gristle and opinions.`),
            sh(`Hm.`),
          ] } },
        say(`The storm blows itself out before dawn. The sea goes flat and grey and silent, and the crew bail and curse and laugh at being alive.`),
        { scene: { img: 'bg-ship-deck@dusk', text: `At sunrise, the lookout cries out. Ahead, rising from a sea of mist: a black island, all cliffs and jungle, its beaches littered with shapes like fallen giants. Iron shapes.\n\nThe Isle of the Iron Dead.\n\nAgainst your ribs, the Starheart beats faster.` } },
        { sfx: 'heartbeat' },
        ln('ptahk', `There it is. Where the stars drown. Keep it close, barbarian. We are nearly home.`),
        ln('brannoc', `*Your* home, maybe. Not mine.`),
        { quest: ['ch2-main', 9] },
      ],
    },
  },

  // ======================================================================
  npcs: {
    'c2-beggar': { name: 'Blind Beggar', portrait: 'generic-man' },
    'c2-dockhand': { name: 'Dockhand', portrait: 'generic-man' },
    'c2-gate-sergeant': { name: 'Gate Sergeant', portrait: 'generic-man' },
    'c2-marine': { name: 'Marine', portrait: 'generic-man' },
    'c2-marro': { name: 'Gull-Eye Marro', portrait: 'generic-man' },
    'c2-bosun': { name: 'Bosun Haddo', portrait: 'generic-man' },
    'c2-debtor': { name: 'A Debtor', portrait: 'generic-man' },
    'c2-kushite': { name: 'One-Eyed Kushite', portrait: 'generic-man' },
  },

  // ======================================================================
  dialogues: {
    'c2-ptahk': hub({
      start: 'a',
      nodes: {
        a: { who: 'ptahk', text: `What now, barbarian? My knees are complaining in three languages.`, choices: [
          { id: 'isle', text: 'What do you know of the Isle?', to: 'isle' },
          { id: 'heart', text: 'Why do I always carry the heart?', to: 'heart' },
          { id: 'eyes', text: 'Shevra says your eyes went strange.', if: 'flag:c2-ptahk-eyes', to: 'eyes' },
          { id: 'bye', text: 'Nothing. Rest.', end: true },
        ] },
        isle: { who: 'ptahk', text: `An island off the Black Coast where iron men fell from the sky like hail, long ago. There is a gate there, a ring of strange metal. Your heart is the key that wakes it. The iron man told you as much, did he not? "Where the stars drown."`, next: 'a' },
        heart: { who: 'ptahk', text: `Because I am old, and old hands shake, and drop things, and that is not a thing to drop. Besides, it likes you. Listen to it beat when you are angry. A sorcerer could make nothing of that. A barbarian is the perfect jar.`, next: 'heart2' },
        heart2: { who: 'brannoc', text: `I'm not a jar.`, next: 'heart3' },
        heart3: { who: 'ptahk', text: `No. Jars don't sulk.`, next: 'a' },
        eyes: { who: 'ptahk', text: `The child sees snakes in every shadow. It is a thief's gift: it keeps them alive. I am a tired old man with smoke in his eyes. Do I look like a snake to you, barbarian?`, next: 'eyes2' },
        eyes2: { who: 'brannoc', text: `You look like a man who doesn't eat.`, next: 'eyes3' },
        eyes3: { who: 'ptahk', text: `Ha! Then I am the cheapest wizard you'll ever hire. Go to sleep.`, next: 'a' },
      },
    }, `Well? My knees are waiting.`),


    'c2-ptahk-sea': hub({
      start: 'a',
      nodes: {
        a: { who: 'ptahk', text: `Leave me to die, barbarian. I have been seasick since the Vilayet, and that was four hundred... forty years ago.`, choices: [
          { id: 'eat', text: 'Eat something. Ship biscuit settles the gut.', to: 'eat' },
          { id: 'storm', text: 'That storm ahead. Sorcery?', to: 'storm' },
          { id: 'bye', text: 'Die quietly, then.', end: true },
        ] },
        eat: { who: 'ptahk', text: `My stomach is older than your country, and it remembers every meal it ever regretted. No biscuit.`, next: 'a' },
        storm: { who: 'ptahk', text: `Not sorcery. Hunger. Khurath of the Black Coast. A serpent, old and stupid, that smells the heart on you as a dog smells meat. It will come. Strike for the soft places, and use *cold* if you have it, or plain edges. Fire only warms its blood.`, next: 'a' },
      },
    }, `Anything else? Quickly, before I lose my breakfast. Metaphorically.`),


    'c2-sagra': hub({
      start: 'a',
      nodes: {
        a: { who: 'sagra', text: `Well, well. A barbarian, a thief and a wizard walk into a witch's hut. I've heard this one. It ends with soup.`, choices: [
          { id: 'who', text: 'Who are you?', to: 'who' },
          { id: 'brew', text: "What are you brewing?", if: 'quest:sq-witch<1', to: 'brew' },
          { id: 'need', text: 'What did you need again?', if: 'quest:sq-witch>=1 & quest:sq-witch<4', to: 'need' },
          { id: 'give', text: "Here's what we found.", if: 'quest:sq-witch>=1 & quest:sq-witch<4 & item:liar-hair | quest:sq-witch>=1 & quest:sq-witch<4 & item:last-breath | quest:sq-witch>=1 & quest:sq-witch<4 & item:eel-tooth', to: 'give' },
          { id: 'gent', text: "Who's the gentleman of the sea?", if: 'quest:sq-witch>=1', to: 'gent' },
          { id: 'bye', text: 'Farewell, mother.', end: true },
        ] },
        who: { who: 'sagra', text: `Mother Sagra, out of Stygia, once a priestess's handmaid and now a free woman with a hut and a pot. The salt keeps the snakes off. Snakes don't like salt, pretty one. Remember that.`, next: 'a' },
        brew: { who: 'sagra', text: `Love, pretty one. A love potion, for a gentleman of the sea. But my pot is three things short: *a liar's hair*, *a sailor's last breath*, and *the tooth of the marsh eel*. Fetch me those and I'll make it worth your while: a knot against poison and sleep, a charm for the big one, and a little something for the gentleman.`, choices: [
          { id: 'accept', text: "We'll fetch them.", to: 'accepted', do: [{ quest: ['sq-witch', 1] }] },
          { id: 'decline', text: 'Not our business.', to: 'a' },
        ] },
        accepted: { who: 'sagra', text: `Good! The eel lives in the channel just outside: fish for it, if you dare. Liars are thick in Messantia, and the biggest has the nicest hair. And a sailor's last breath... every tavern has an old drunk who swears this is his last.`, next: 'a' },
        need: { who: 'sagra', text: `A liar's hair (the biggest liar in Messantia, pretty one: think who jails people for laughing). A sailor's last breath, in a bottle, from an old salt who's quitting. And the tooth of the marsh eel, from the channel outside.`, next: 'a' },
        give: { who: 'sagra', text: `Let's see, let's see...`, do: deliver, next: 'a' },
        gent: { who: 'sagra', text: `He sails past my window every night, my gentleman, and never stops. His ship has no lamps, and his crew sing under the water. Forty years I've waited. A little potion, and he'll stop. They always stop, for Sagra.`, next: 'a' },
      },
    }, `What else, pretty one?`),


    'c2-gate-guard': hub({
      start: 'a',
      nodes: {
        a: { who: 'c2-gate-sergeant', text: `Messantia welcomes all honest travellers. You don't look honest, but you look like you'd be expensive to arrest. Business?`, choices: [
          { id: 'ship', text: "We need a ship.", to: 'ship' },
          { id: 'count', text: 'Who rules the harbor?', to: 'count' },
          { id: 'redhand', text: 'Who is Ilsa Redhand?', to: 'redhand' },
          { id: 'bye', text: 'Just passing.', end: true },
        ] },
        ship: { who: 'c2-gate-sergeant', text: `Docks are through the gate. Plenty of ships, and every one of them needs a stamp from the Harbor Office before it so much as farts. Good luck with that.`, next: 'a' },
        count: { who: 'c2-gate-sergeant', text: `Count Valerio, harbor master, Mitra preserve us. He writes poetry. He reads it out loud. If he invites you to a reading, fall in the harbor.`, next: 'a' },
        redhand: { who: 'c2-gate-sergeant', text: `Barachan pirate. Best captain on the coast and the worst mouth. Laughed at the Count's poem in the market square, in front of half the town. He had her in irons by sunset, and her crew in the Debtors' Pen for her harbor fees.`, next: 'a' },
      },
    }, `Anything else? The line's growing.`),


    'c2-dockhand': hub({
      start: 'a',
      nodes: {
        a: { who: 'c2-dockhand', text: `Still looking for a madman with a ship, friend?`, choices: [
          { id: 'ilsa', text: 'Tell me about Ilsa Redhand.', to: 'ilsa' },
          { id: 'smug', text: 'Who runs the smuggling here?', to: 'smug' },
          { id: 'serpent', text: 'Why does nobody sail for the Isle?', to: 'serpent' },
          { id: 'bye', text: 'Back to work.', end: true },
        ] },
        ilsa: { who: 'c2-dockhand', text: `Redhand? Sails like the devil's own daughter. Her ship, the *Sea-Wolf*, is impounded at the customs quay, east of here. Her crew owe the Crown two hundred gold and sit in the Pen. And she's in the Brig, south, behind the Pen. Shame. Messantia's quieter without her. Duller, too.`, next: 'a' },
        smug: { who: 'c2-dockhand', text: `Smuggling? In Messantia? Never heard of it.` , next: 'smug2' },
        smug2: { who: 'c2-dockhand', text: `(He winks.) Gull-Eye Marro. Under the Customs Warehouse. The marines on the trapdoor take a cut of everything. You didn't hear it from me.`, next: 'a' },
        serpent: { who: 'c2-dockhand', text: `The storms off the Black Coast, and what lives in them. Khurath. Big as a street. Eats galleys like you'd eat an olive. And past it, the Isle, where the iron dead lie on the beaches. No thank you.`, next: 'a' },
      },
    }, `Anything else, friend?`),


    'c2-arms': {
      start: 'a',
      nodes: {
        a: { who: 'arms-keeper', text: `Steel from Akbitana, axes from Nordheim, hammers from wherever hammers come from. What'll it be, big man?`, choices: [
          { id: 'shop', text: 'Show me your wares.', do: [{ shop: 'c2-arms' }], to: 'a2' },
          { id: 'advice', text: 'Any advice for a man going to sea?', to: 'advice' },
          { id: 'bye', text: 'Later.', end: true },
        ] },
        a2: { who: 'arms-keeper', text: `Anything else?`, choices: [
          { id: 'shop2', text: 'Show me again.', do: [{ shop: 'c2-arms' }], to: 'a2' },
          { id: 'advice2', text: 'Any advice?', to: 'advice' },
          { id: 'bye2', text: 'That will do.', end: true },
        ] },
        advice: { who: 'arms-keeper', text: `Carry two weapons. An edge for flesh and a hammer for iron. Marines wear scale: a sword skates off it, a hammer folds it. Serpents and eels, now, they want cutting, and a cold blade if you can find one. Fire just warms 'em up. Lost my arm learning that.`, next: 'a2' },
      },
    },

    'c2-barmaid': hub({
      start: 'a',
      nodes: {
        a: { who: 'barmaid', text: `What'll it be, love? Ale, a bed, gossip or trouble?`, choices: [
          { id: 'buy', text: 'Drinks and supplies.', do: [{ shop: 'c2-gull' }], to: 'a' },
          { id: 'room', text: 'A bed for the night (10 gold).', do: [{ inn: 10, text: 'A hammock above the taproom and a bowl of fish stew: 10 gold.' }], to: 'a' },
          { id: 'rum', text: 'Tell me about the Kraken rum.', to: 'rum' },
          { id: 'bottle', text: 'Got an empty bottle?', if: '!item:empty-bottle & !item:last-breath & !flag:c2-gave-breath', to: 'bottle' },
          { id: 'gossip', text: 'Any gossip?', to: 'gossip' },
          { id: 'bye', text: 'Nothing, thanks.', end: true },
        ] },
        rum: { who: 'barmaid', text: `Black as a Stygian's heart and twice as strong. One bottle puts a sailor flat for a day; two and he's speaking to his ancestors. The jailer at the Brig used to drink it by the bucket, until the Count forbade it. Now he just sniffs the door.`, next: 'a' },
        bottle: { who: 'barmaid', text: `Empties? Got a hundred. Here, take one, they breed back there.`, do: [{ give: 'empty-bottle' }], next: 'a' },
        gossip: { who: 'barmaid', text: `The Count's having another reading tonight. Old Bram there swears every cup's his last. And the singer's sweet on anyone who pays for a song, which is nobody, ever, so she's sweet on nobody.`, next: 'a' },
      },
    }, `Anything else, love?`),


    'c2-singer': hub({
      start: 'a',
      nodes: {
        a: { who: 'singer', text: `(She finishes her verse to no applause at all.) Sailor. Or not a sailor. You're too big for a ship.`, choices: [
          { id: 'song', text: 'Sing me something. (5 gold)', if: 'gold>=5', to: 'song', do: [{ gold: -5 }] },
          { id: 'pin', text: "That's a fine pin in your hair.", if: 'flag:c2-heard-song & !item:hairpin & !flag:c2-ilsa-free & !once:c2-pin', to: 'pin' },
          { id: 'bye', text: 'Goodbye.', end: true },
        ] },
        song: { who: 'singer', text: `(Her eyes light up. Somebody PAID.) Then here's an old one. "The Weeping Bride".`, next: 'song2' },
        song2: { who: 'narrator', text: `*Oh the Bride sails out by the dark of the moon, / with never a lamp to burn, / her captain went down with gold on his hand, / and swore that he'd return. / And the serpent took him, and the serpent keeps / his ring in its belly cold, / and the Bride sails on through the deeps, the deeps, / for the want of a ring of gold.*`, do: [{ set: 'c2-heard-song' }], next: 'song3' },
        song3: { who: 'singer', text: `(She curtsies.) First money I've had in a month. For a man who pays for songs, anything.`, next: 'a' },
        pin: { who: 'singer', text: `This old thing? Silver, from Kordava. A man who pays for songs can have anything, I said, and I meant it. Bring it back if it's lucky.`, do: [{ once: 'c2-pin', do: [{ give: 'hairpin' }, sh(`Oh, *that's* a good pin. I could open a temple with this.`)] }], next: 'a' },
      },
    }, `(She tunes a string.) Something else?`),


    'c2-old-drunk': hub({
      start: 'a',
      nodes: {
        a: { who: 'old-drunk', text: `Eh? Whosat? Buy an old man a drink. My last. I'm quitting.`, choices: [
          { id: 'last', text: 'Your last?', to: 'last' },
          { id: 'count', text: 'What do you know of Count Valerio?', to: 'count' },
          { id: 'sea', text: 'What lives in the storms off the Black Coast?', to: 'sea' },
          { id: 'bye', text: 'Sleep it off.', end: true },
        ] },
        last: { who: 'old-drunk', text: `Last drink. Last breath. Last everything. I swear on my mother. I've sworn it every night for forty years and I'll swear it tomorrow. It's my last, I swear, I'm quitting.`, next: 'a' },
        count: { who: 'old-drunk', text: `Valerio? Biggest liar in Argos. Says his grandfather sank a Barachan fleet. His grandfather sold eels. Says he wrote his poems himself. Well, that one's true, more's the pity.`, next: 'a' },
        sea: { who: 'old-drunk', text: `Khurath. The serpent. I saw it once, in the year of the comet. Took the *Weeping Bride* whole, her captain and all, gold ring on his hand and his bride's name on his lips. He still sails, they say, the captain. Dead men don't stop.`, next: 'a' },
      },
    }, `Eh? Still here?`),


    'c2-valerio': {
      start: 'a',
      nodes: {
        a: { who: 'valerio', if: '!flag:c2-valerio-pleased', text: `Visitors! Admirers, surely. Come, come. I am Count Valerio, harbor master, patron of the arts, and *the* arts.`, else: 'friend', choices: [
          { id: 'ship', text: 'We want Ilsa Redhand released. And her ship.', to: 'ship' },
          { id: 'poem', text: 'Read us a poem, then.', to: 'poem' },
          { id: 'bye', text: 'Another time.', end: true },
        ] },
        friend: { who: 'valerio', text: `My friends! My *audience*! Drink, drink! Another canto?`, choices: [
          { id: 'toast', text: 'Raise your thimble of wine.', to: 'toast' },
          { id: 'ship-f', text: 'About Ilsa Redhand...', to: 'ship' },
          { id: 'bye-f', text: 'We must go.', end: true },
        ] },
        toast: { who: 'valerio', text: `To me! (He drains his goblet, refills it to the brim, and gazes into it at his own reflection.) To ME.`, next: 'friend' },
        ship: { who: 'valerio', text: `The pirate? She *laughed*. In the market. At my "Ode to a Dolphin at Dawn", second canto, the delicate part. Release requires an order sealed with my own dolphin, and I have sealed exactly nothing in eleven years. I don't *give* things. Things are given to me.`, next: 'vhub' },
        vhub: { who: 'valerio', if: '!flag:c2-valerio-pleased', else: 'friend', text: `Now. Where were we? Ah, yes: me.`, choices: [
          { id: 'poem', text: 'Read us a poem, then.', to: 'poem' },
          { id: 'bye', text: 'Another time.', end: true },
        ] },
        poem: { who: 'valerio', text: `(He rises. He clears his throat. He lifts a sheet with a trembling hand.)`, next: 'poem2' },
        poem2: { who: 'narrator', text: `*"O Dolphin! O leaping fish of the morning, which is not a fish, / but a mammal, as I, Valerio, have discovered. / You leap. I leap also, in my heart. / O Dolphin. O Valerio. We are not so different, / you and I, / except that you are wet."*\n\nHe reads on. The sun moves across the floor. Somewhere, a gull dies of old age.`, next: 'judge' },
        judge: { who: 'valerio', text: `Well? WELL? What do you think?`, choices: [
          { id: 'rhymes', text: 'The rhymes are very clever.', to: 'w-rhyme' },
          { id: 'short', text: 'Short and sweet.', to: 'w-short' },
          { id: 'hand', text: 'Your penmanship is very fine.', to: 'w-hand' },
          { id: 'greatest', text: "It's the greatest poem ever written. The gulls themselves should weep.", to: 'right' },
        ] },
        'w-rhyme': { who: 'valerio', text: `Rhymes? RHYMES? I *scorn* rhyme! Rhyme is for tavern-songs and Nemedians! Get out of my sight until you've learned to listen!`, next: 'sulk' },
        'w-short': { who: 'valerio', text: `SHORT? That was the first of forty cantos! I'll have you know I cut nothing! Out! Out until you've learned to listen!`, next: 'sulk' },
        'w-hand': { who: 'valerio', text: `*Penmanship?* Any clerk can hold a pen! I asked about my *soul*, barbarian, not my letters! Out!`, next: 'sulk' },
        sulk: { who: 'shevra', text: `(Whispering.) Bear. Read the walls. He wants to be told it's good. Not how. Just *good*.` },
        right: { who: 'valerio', text: `(His lip trembles. A tear rolls down to his beauty mark.) The gulls... should weep. Yes. YES. At last, a man of taste, in Messantia! You must drink with me, my friend. I insist!`, do: [
          say(`He pours himself a goblet the size of a helmet, and you a thimble of thin Kordavan wine. He toasts himself. He toasts himself again.`),
          { set: 'c2-valerio-pleased' },
          sh(`(Whispering.) Bear. He'll drink anything you put in that cup. *Anything.*`),
        ] },
      },
    },

    'c2-jailer': hub({
      start: 'a',
      nodes: {
        a: { who: 'jailer', text: `Visiting hours are over. Visiting hours are always over. What d'you want?`, choices: [
          { id: 'sign', text: "What's the sign on your stool?", to: 'sign' },
          { id: 'cell', text: "Who's in the end cell?", to: 'cell' },
          { id: 'sell', text: 'Want to buy a bottle of Kraken?', if: 'item:kraken-rum', to: 'sell' },
          { id: 'drink', text: '(Uncork the Kraken and drink in front of him.)', if: 'item:kraken-rum', to: 'drink' },
          { id: 'dare', text: 'I dare you to drink this.', if: 'item:kraken-rum', to: 'dare' },
          { id: 'gift', text: 'A gift from Count Valerio, for your loyal service.', if: 'item:kraken-rum', to: 'gift' },
          { id: 'bye', text: 'Nothing.', end: true },
        ] },
        sign: { who: 'jailer', text: `"No drinking on duty, by order of the Count." He put it up himself, the day I fell asleep and the Kushite nearly got out. Only the Count himself could make me drink on duty, and he never gives anybody anything.`, next: 'a' },
        cell: { who: 'jailer', text: `Ilsa Redhand. Pirate. Laughed at the Count's poem. Hangs when he finishes writing her an ode, which he says will take a year. She's eaten two of my spoons.`, next: 'a' },
        sell: { who: 'jailer', text: `On duty! Can't you read the sign? On DUTY. (He looks at the bottle the way a dog looks at a roast.)`, next: 'a' },
        drink: { who: 'narrator', text: `You uncork the bottle and take a long, slow pull. The jailer watches the bottle go up and down. A single tear rolls down his fat cheek. You cork it again; the bottle's still mostly full. He weeps quietly into his sleeve.`, next: 'a' },
        dare: { who: 'jailer', text: `Dare me? The Count would hang me! Then he'd write a poem about it! I'd rather hang twice!`, next: 'a' },
        gift: { who: 'jailer', text: `From... from the *Count*? For me? For my loyal service? (His eyes fill.) Eleven years. Eleven years, and he never gave anybody anything. Well. A man can't refuse the Count. That would be *disloyal*.`, next: 'gift2' },
        gift2: { who: 'narrator', text: `He takes the bottle in both hands like a holy relic, drains half of it in one swallow, says "To the Count!", drains the rest, and topples gently back against the wall. In a moment he is snoring like a walrus. His keys hang at his belt.`, do: [{ take: 'kraken-rum', quiet: true }, { sfx: 'drink' }, { set: 'c2-jailer-out' }, sh(`Loyalty. It'll get you every time.`)] },
      },
    }, `Anything else? I'm very busy sitting.`),


    'c2-ilsa-cell': hub({
      start: 'a',
      nodes: {
        a: { who: 'ilsa', text: `Well, northerner? Have you come to free me or to stare?`, choices: [
          { id: 'who', text: 'Who are you?', to: 'who' },
          { id: 'isle', text: 'You know the way to the Isle of the Iron Dead?', to: 'isle' },
          { id: 'how', text: 'How do I get you out?', to: 'how' },
          { id: 'bye', text: 'Hold on.', end: true },
        ] },
        who: { who: 'ilsa', text: `Ilsa Redhand, captain of the *Sea-Wolf*, terror of the Black Coast, and the only woman in Argos who laughed at Count Valerio's poetry out loud. Everyone else laughs at home.`, next: 'a' },
        isle: { who: 'ilsa', text: `Been there once, as a girl, with my grandfather's old charts. Iron giants lying on the beaches like drowned men, and things in the jungle you don't want to know. I've wanted to go back every day since. Free me, my crew and my ship, and I'll sail you to the edge of the world.`, next: 'a' },
        how: { who: 'ilsa', text: `Fat Gorbo there has the key on his belt. He'd drink himself blind if the Count let him. Or bring me something to pick the lock with, if your thief's any good. Or come up through the floor; there's a grate in here, rusted shut, and I'd swear the tunnels under it run all the way to the Customs Warehouse.`, next: 'a' },
      },
    }, `Well? I'm not going anywhere. That's rather the problem.`),


    'c2-clerk': hub({
      start: 'a',
      nodes: {
        a: { who: 'clerk', text: `(He looks up from a paper he is reading upside down.) Release, payment, complaint or enquiry?`, choices: [
          { id: 'release', text: "Release the Sea-Wolf's crew.", to: 'release' },
          { id: 'pay', text: 'Pay off their debt. (200 gold)', if: 'gold>=200 & party:ilsa & !flag:c2-ship-free', to: 'pay' },
          { id: 'paper', text: "You're holding that upside down.", to: 'paper' },
          { id: 'bye', text: 'Enquiry. Never mind.', end: true },
        ] },
        release: { who: 'clerk', text: `A release requires a release order sealed with the Count's own dolphin. Or payment in full: two hundred gold. The Count has sealed no orders in eleven years, so I recommend payment. Or patience. I have a great deal of patience. It's all I have.`, next: 'a' },
        paper: { who: 'clerk', text: `(He turns the paper over, reads it with great care, frowns, and turns it back.) No, I don't think so.`, next: 'a' },
        pay: { who: 'clerk', text: `Two hundred! In coin! (He counts it twice, upside down.) The crew of the *Sea-Wolf* are released, and since the crew are released, their ship is released, by the logic of the receipt. I'll stamp it.`, do: [
          { gold: -200 }, { sfx: 'door' },
          say(`The gate swings open. Ilsa's crew pour out, roaring her name, and make for the customs quay at a run. The harbor guard takes one look at the stamped receipt and steps aside.`),
          { set: 'c2-ship-free' }, { xp: 15 },
          ln('ilsa', `Crew, ship and captain. Expensive, northerner. I'll pay you back in adventure.`),
          MAIN,
        ] },
      },
    }, `Anything further? Release, payment, complaint or enquiry?`),


    'c2-bosun': hub({
      start: 'a',
      nodes: {
        a: { who: 'c2-bosun', if: '!flag:c2-ship-free', text: `You're the big northerner who wants the captain? Get in line, lad. The whole crew wants the captain.`, else: 'free', choices: [
          { id: 'ilsa', text: "I'm getting her out.", to: 'out' },
          { id: 'debt', text: 'Why are you in here?', to: 'debt' },
          { id: 'bye', text: 'Hold fast.', end: true },
        ] },
        out: { who: 'c2-bosun', text: `Then you'll have twenty-two cutthroats who'd follow you into the sea. But we don't walk out of here without her. That clerk will let anybody go if you wave enough wax at him.`, next: 'a' },
        debt: { who: 'c2-bosun', text: `Harbor dues, mooring fines, and "laughter (public)". Two hundred gold. We had it, too, till the marines "impounded" the captain's chest and sold it to Marro the same night.`, next: 'a' },
        free: { who: 'c2-bosun', text: `Fine day for it, lad! Wind's fair, the captain's back, and I've had a bath. Mostly.`, choices: [
          { id: 'ship', text: 'Tell me about the Sea-Wolf.', to: 'ship' },
          { id: 'bye-f', text: 'Carry on.', end: true },
        ] },
        ship: { who: 'c2-bosun', text: `Fastest keel on the Black Coast. Old Captain Redhand built her, the captain's grandfather, before the sea took him. She bites back, lad. Same as the captain.`, next: 'free' },
      },
    }, `Anything else, lad?`),

  },

  // ======================================================================
  items: {
    'kraken-rum': { name: 'Kraken Rum', type: 'key', icon: 'kraken-rum', price: 20, desc: 'A black bottle of the Drowned Gull\'s famous rum. Puts a sailor flat for a day.' },
    hairpin: { name: 'Silver Hairpin', type: 'key', icon: 'hairpin', desc: 'The singer\'s long silver pin from Kordava. Shevra says she could open a temple with it.' },
    'brig-key': { name: 'Brig Key', type: 'key', icon: 'brig-key', desc: 'A big iron key off the jailer\'s ring. It smells faintly of rum.' },
    'blank-order': { name: 'Blank Release Order', type: 'key', icon: 'blank-order', desc: 'A release order for the Debtors\' Pen, made out for the crew of the Sea-Wolf. It wants the Count\'s seal.' },
    'sealed-order': { name: 'Sealed Release Order', type: 'key', icon: 'blank-order@red', desc: 'A release order with a fat crimson seal: the Count\'s own dolphin. Any clerk would bow to it.' },
    'boat-hook': { name: 'Boat Hook', type: 'key', icon: 'meat-hook@grey', desc: 'A marine\'s iron boat hook on a stout shaft. Long, with a hook to it.' },
    'empty-bottle': { name: 'Empty Bottle', type: 'key', icon: 'empty-bottle', desc: 'An empty rum bottle from the Drowned Gull. It still smells of better days.' },
    'last-breath': { name: "A Sailor's Last Breath", type: 'key', icon: 'last-breath', desc: 'A corked bottle, fogged from inside with forty years of rum. "It\'s my last, I swear."' },
    'liar-hair': { name: "A Liar's Hair", type: 'key', icon: 'liar-hair', desc: 'One perfumed curl of Count Valerio\'s hair. It smells of pomade and untruth.' },
    'eel-tooth': { name: 'Eel Tooth', type: 'key', icon: 'eel-tooth', desc: 'A marsh eel\'s tooth, long as your thumb and still slimy.' },
  },

  // ======================================================================
  enemies: {
    bandit: {
      ...enemyStats(7, 'minion'), name: 'Road Bandit', sprite: 'bandit', size: 'm',
      weak: ['pierce'], resist: [], immune: [],
      desc: 'A desert bandit in a dusty headcloth with a tulwar and nothing to lose.',
      skills: [{ name: 'Dirty Cut', power: 1.3, dmg: 'slash', chance: 0.3, sfx: 'slash' }],
      attackDmg: 'slash', drops: [{ id: 'healing-draught', chance: 0.2 }],
    },
    scorpion: {
      ...enemyStats(7, 'minion'), name: 'Giant Scorpion', sprite: 'scorpion', size: 'm',
      weak: ['blunt', 'fire'], resist: ['pierce'], immune: [],
      desc: 'A scorpion the size of a dog, armored like a Kothian knight. Its sting drips.',
      skills: [{ name: 'Venom Sting', power: 1.1, dmg: 'pierce', chance: 0.35, status: { poison: 0.4 }, sfx: 'pierce' }],
      attackDmg: 'pierce', drops: [{ id: 'scorpion-tail', chance: 0.5 }],
    },
    hyena: {
      ...enemyStats(8, 'minion'), name: 'Bone Hyena', sprite: 'hyena', size: 'm',
      weak: ['slash'], resist: [], immune: [],
      desc: 'A spotted hyena fat on oasis bones. It laughs when it bites.',
      skills: [{ name: 'Laughing Bite', power: 1.3, dmg: 'pierce', chance: 0.3, sfx: 'bite' }],
      attackDmg: 'pierce', drops: [{ id: 'healing-draught', chance: 0.15 }],
    },
    'marsh-eel': {
      ...enemyStats(9, 'brute'), name: 'Marsh Eel', sprite: 'marsh-eel', size: 'l',
      weak: ['slash', 'cold'], resist: ['fire'], immune: [],
      desc: 'A slimy eel as long as a rowing boat, with a mouth full of daggers.',
      skills: [
        { name: 'Coil and Squeeze', power: 1.4, dmg: 'blunt', chance: 0.3, status: { stun: 0.25 }, sfx: 'blunt' },
        { name: 'Dagger Teeth', power: 1.2, dmg: 'pierce', chance: 0.3, sfx: 'bite' },
      ],
      attackDmg: 'pierce', drops: [{ id: 'serpent-scale', chance: 0.3 }],
    },
    marine: {
      ...enemyStats(9, 'brute'), name: 'Argossean Marine', sprite: 'marine', size: 'm',
      weak: ['blunt'], resist: ['slash'], immune: [],
      desc: 'A marine in iron scale with a short sword and a long grudge. Edges skate off that scale; hammers fold it.',
      skills: [{ name: 'Shield Bash', power: 1.2, dmg: 'blunt', chance: 0.25, status: { stun: 0.2 }, sfx: 'blunt' }],
      attackDmg: 'slash', drops: [{ id: 'healing-draught', chance: 0.3 }],
    },
    smuggler: {
      ...enemyStats(8, 'minion'), name: 'Smuggler', sprite: 'bandit', tint: 'teal', size: 'm',
      weak: ['pierce'], resist: [], immune: [],
      desc: 'One of Gull-Eye Marro\'s rats, in a teal sash, with a curved knife and a loaded die.',
      skills: [{ name: 'Knife in the Dark', power: 1.3, dmg: 'pierce', chance: 0.3, sfx: 'pierce' }],
      attackDmg: 'slash', drops: [{ id: 'healing-draught', chance: 0.2 }],
    },
    'smuggler-chief': {
      ...enemyStats(9, 'brute'), name: 'Gull-Eye Marro', sprite: 'bandit', tint: 'red', size: 'l',
      weak: ['pierce'], resist: [], immune: [],
      desc: 'The smuggler king of Messantia: one blue eye and one glass gull\'s eye, both greedy.',
      skills: [
        { name: 'Gull-Eye\'s Hook', power: 1.5, dmg: 'slash', chance: 0.3, sfx: 'slash' },
        { name: 'Pepper in the Eyes', power: 0.6, dmg: 'blunt', chance: 0.2, status: { blind: 0.5 } },
      ],
      attackDmg: 'slash', drops: [{ id: 'great-draught', chance: 1 }],
    },
    khurath: {
      ...enemyStats(9, 'boss'), name: 'Khurath', sprite: 'sea-serpent', size: 'xl',
      weak: ['slash', 'cold'], resist: ['fire'], immune: [],
      desc: 'The sea serpent of the Black Coast, old and hungry, with a gut full of drowned men. Cut it; fire only warms its blood.',
      skills: [
        { name: 'Tail Lash', power: 1.0, dmg: 'blunt', chance: 0.25, target: 'all', sfx: 'blunt', msg: 'The great tail sweeps the deck!' },
        { name: 'Swallowing Strike', power: 1.6, dmg: 'pierce', chance: 0.25, sfx: 'bite' },
        { name: 'Drowning Wave', power: 0.9, dmg: 'blunt', chance: 0.2, target: 'all', status: { stun: 0.15 }, msg: 'A green wall of sea crashes over the rail!' },
      ],
      attackDmg: 'pierce', drops: [{ id: 'serpent-scale', chance: 1 }],
    },
  },

  // ======================================================================
  shops: {
    'c2-arms': { name: 'Argossean Arms', keeper: 'arms-keeper', greet: 'An edge for flesh, a hammer for iron.',
      items: ['akbitanan-blade', 'nordheimer-axe', 'war-hammer', 'kris', 'steel-knives', 'lead-sling', 'argos-saber', 'oak-rod', 'mail-shirt', 'steel-helm', 'round-shield', 'shadow-leathers', 'embroidered-robe', 'frost-flask-item', 'fire-flask'] },
    'c2-gull': { name: 'The Drowned Gull', keeper: 'barmaid', greet: 'Ale\'s cheap, the Kraken isn\'t.',
      items: ['kraken-rum', 'healing-draught', 'great-draught', 'mana-lotus', 'antidote', 'smelling-salts', 'smoke-bomb'] },
  },

  // ======================================================================
  quests: {
    'ch2-main': { name: 'The Black Coast', main: true, done: 9, stages: {
      1: 'Follow the Caravan Road to Messantia, the great port of Argos, and find a ship bold enough to sail for the Isle of the Iron Dead.',
      2: 'No captain in Messantia will sail for the Isle, except Ilsa Redhand, who is locked in the Brig (south of the Docks, past the Debtors\' Pen).',
      3: 'Ilsa Redhand will sail you to the edge of the world if you free her, her crew and her ship. First, get her out of that cell.',
      4: 'Ilsa is free. Now free her crew and her ship (the Debtors\' Pen clerk wants a release order with Count Valerio\'s seal), and get her sea-chest back from the smugglers under the Customs Warehouse.',
      5: 'The Sea-Wolf and her crew are free. Now get Ilsa\'s sea-chest back from Gull-Eye Marro\'s smugglers, under the Customs Warehouse.',
      6: 'You have Ilsa\'s charts. Now free her crew and her ship: the Debtors\' Pen clerk wants a release order with Count Valerio\'s seal.',
      7: 'Captain, crew, ship and charts. Board the Sea-Wolf (through the Customs Warehouse, east) and cast off.',
      8: 'At sea. Sail east, through the storm, for the Isle of the Iron Dead.',
      9: 'The sea serpent is dead and the Isle of the Iron Dead lies ahead.',
    } },
  },

  // ======================================================================
  hints: [
    // Side quest (only while you're out in the marsh or at the hut)
    { if: 'flag:c2-in-marsh & quest:sq-witch>=1 & quest:sq-witch<4 & item:liar-hair | flag:c2-in-marsh & quest:sq-witch>=1 & quest:sq-witch<4 & item:last-breath | flag:c2-in-marsh & quest:sq-witch>=1 & quest:sq-witch<4 & item:eel-tooth', nudge: 'Mother Sagra is waiting for her ingredients.', answer: 'Use each ingredient on Mother Sagra (or talk to her and hand them over).' },
    { if: 'flag:c2-in-marsh & quest:sq-witch>=1 & quest:sq-witch<4 & !item:eel-tooth & !flag:c2-gave-tooth', nudge: 'The eel lives in the channel just outside the hut. Something long moves in the Eel Waters.', answer: 'In the Salt Marsh, choose Eel Waters and Fish. Beat the marsh eel (it hates edges and cold) for its tooth.' },
    { if: 'flag:c2-in-marsh & quest:sq-witch>=1 & quest:sq-witch<4', nudge: 'A liar\'s hair: the biggest liar in Messantia jails people for laughing. A last breath: every tavern has an old drunk who swears it\'s his last.', answer: 'Snip Count Valerio\'s hair while he\'s passed out (after you get his signet). Get an empty bottle from the Drowned Gull\'s barmaid and use it on the old drunk.' },
    // Main path
    { if: 'quest:ch2-main==1', nudge: 'The road runs on to the sea. Messantia lies beyond the Oasis of Bones.', answer: 'Go east to the Oasis, then east to Messantia Gate and the Docks, and ask about a ship.' },
    { if: 'quest:ch2-main==2', nudge: 'The dockhand said the only captain who has been to the Isle is locked in the Brig.', answer: 'From the Docks go south to the Debtors\' Pen, then east to the Brig, and talk to Ilsa.' },
    { if: 'quest:ch2-main==3 & !flag:c2-jailer-out & !item:hairpin & !item:kraken-rum', nudge: 'The jailer licks his lips at the mention of the Gull\'s black rum, but the sign forbids drinking on duty, by the Count\'s order. Only the Count himself could make him drink.', answer: 'Buy Kraken rum from the barrel in the Drowned Gull (20 gold), then talk to the jailer. (Or pay the Gull\'s singer for a song and ask about her hairpin.)' },
    { if: 'quest:ch2-main==3 & !flag:c2-jailer-out & item:kraken-rum', nudge: 'He won\'t drink on duty, unless the Count orders it. And the Count never gives anybody anything.', answer: 'Talk to the jailer and say: "A gift from Count Valerio, for your loyal service."' },
    { if: 'quest:ch2-main==3 & flag:c2-jailer-out & !item:brig-key', nudge: 'He\'s snoring, and his keys hang at his belt.', answer: 'Choose the snoring jailer and Take keys.' },
    { if: 'quest:ch2-main==3', nudge: 'Something to open the cell door with...', answer: 'Use the brig key (or the singer\'s hairpin) on the Cell Door.' },
    { if: 'quest:ch2-main==4 & !flag:c2-ship-free & !item:valerio-signet & !flag:c2-valerio-pleased | quest:ch2-main==6 & !item:valerio-signet & !flag:c2-valerio-pleased', nudge: 'The clerk wants an order sealed with the Count\'s own ring. Valerio\'s walls are papered with his poems; read the margins, and listen to Shevra.', answer: 'Talk to Count Valerio, ask him to read a poem, and say: "It\'s the greatest poem ever written."' },
    { if: 'quest:ch2-main==4 & !flag:c2-ship-free & !item:valerio-signet | quest:ch2-main==6 & !item:valerio-signet', nudge: 'He never looks at what\'s in his goblet. Something that puts a sailor flat for a day...', answer: 'Buy Kraken rum at the Drowned Gull and use it on Valerio\'s goblet.' },
    { if: 'quest:ch2-main==4 & !flag:c2-ship-free & !item:sealed-order | quest:ch2-main==6 & !item:sealed-order', nudge: 'A ring with a dolphin, and a drawer full of blank orders waiting for a seal.', answer: 'Take a blank release order from Valerio\'s desk, then in the Bag combine it with Valerio\'s signet.' },
    { if: 'quest:ch2-main==4 & !flag:c2-ship-free | quest:ch2-main==6', nudge: 'A clerk will free anything with enough wax on it.', answer: 'In the Debtors\' Pen, use the sealed release order on the clerk.' },
    { if: 'quest:ch2-main>=4 & quest:ch2-main<=5 & !won:c2-marines', nudge: 'The smugglers come and go through the trapdoor in the Customs Warehouse. Iron scale turns a blade; a hammer folds it.', answer: 'In the Customs Warehouse, Open the trapdoor and beat the two marines. Swap to blunt weapons (Brannoc\'s mace, Shevra\'s sling).' },
    { if: 'quest:ch2-main>=4 & quest:ch2-main<=5 & !flag:c2-sluice & !flag:c2-swum', nudge: 'The sluice wheel is missing a spoke. Something long, with a hook to it, would do. The marines carried one.', answer: 'Use the boat hook (dropped by the marines) on the Sluice Wheel. Or Swim the flooded passage and fight the eels.' },
    { if: 'quest:ch2-main>=4 & quest:ch2-main<=5 & !won:c2-marro', nudge: 'Ilsa\'s chest is with Gull-Eye Marro, east of the sluice.', answer: 'Go east from the tunnels into the Drowned Cistern and beat Marro.' },
    { if: 'quest:ch2-main>=4 & quest:ch2-main<=5', nudge: 'Marro is dead. His treasure is heaped around his throne.', answer: 'Open Ilsa\'s Sea-Chest in the Drowned Cistern.' },
    { if: 'quest:ch2-main==7', nudge: 'Ilsa has her charts and her ship. Nothing holds you in Messantia but a rope.', answer: 'Go east from the Customs Warehouse onto the Sea-Wolf\'s deck and Cast off at the Mooring Lines.' },
    { if: 'quest:ch2-main==8', nudge: 'The storm waits. So does what lives in it.', answer: 'Sail east into the storm. Khurath is a serpent: edges and cold, not fire.' },
  ],

  // ======================================================================
  combine: [
    { a: 'valerio-signet', b: 'blank-order', make: 'sealed-order', keep: 'a', text: 'A drop of hot crimson wax, a firm press of the Count\'s ring, and the dolphin leaps on the order, surprised as ever.',
      do: [{ once: 'c2-sealed', do: [{ xp: 15 }] }] },
  ],

  // ======================================================================
  scripts: {
    'c2-deliver': async (g) => { await g.run(deliver); },
    // Keep the Journal's main objective in step with what has been done.
    'c2-main': async (g) => {
      let s = 1;
      if (g.flag('c2-at-sea')) s = 8;
      else if (g.check('party:ilsa')) {
        const ship = g.flag('c2-ship-free'), charts = g.flag('c2-charts');
        s = ship && charts ? 7 : ship ? 5 : charts ? 6 : 4;
      } else if (g.flag('c2-met-ilsa')) s = 3;
      else if (g.flag('c2-heard-ilsa')) s = 2;
      const cur = g.state().quests['ch2-main'] || 0;
      if (s > cur || (cur >= 4 && cur <= 7 && s >= 4)) await g.run([{ quest: ['ch2-main', s] }]);
    },
    // Ilsa comes out of the Brig without her longcoat (the marines took it); she gets it back from the sea-chest.
    'c2-ilsa-coat': async (g, args) => {
      const S = g.state();
      const m = S.members.ilsa;
      if (!m || !S.party.includes('ilsa')) return;
      if (args.join) {
        // she comes in level with the party, not at the bottom of Brannoc's level
        const b = S.members.brannoc;
        if (b && m.level === b.level && m.xp < b.xp) m.xp = b.xp;
        if (m.equip.body === 'ilsa-longcoat') delete m.equip.body;
      }
      if (!m.equip.body && (S.inv['ilsa-longcoat'] || 0) > 0) {
        await g.run([{ take: 'ilsa-longcoat', quiet: true }]);
        m.equip.body = 'ilsa-longcoat';
        g.say('Ilsa shrugs into her red longcoat and turns up the collar. "Now I feel like a captain."');
      }
    },
  },
};
