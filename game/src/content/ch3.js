// Chapter III — The Isle of the Iron Dead.
import { enemyStats } from '../data/balance.js';
import { ROOM } from './manifest.js';

// ---------- shared effect lists ----------

// After any star-cell is gained: keep the Journal current.
const cellGained = [
  { if: 'quest:ch3-main<2', then: [{ quest: ['ch3-main', 2], quiet: true }] },
  { if: 'item:star-cell>=3 & !flag:c3-choice-made', then: [
    { quest: ['ch3-main', 3] },
    { line: ['ilsa', `Three cells. The door eats two. So the question is what the third one buys, and I know what my crew will say.`] },
    { line: ['shevra', `Bear. There's an iron man in the prison who's dying for want of exactly one of these. Just saying.`] },
  ] },
];

const notThreeYet = `Find all three cells first: the door needs two, and then you'll know what the third can buy.`;

// Free Nine (the Prison) — THE CHOICE, side one.
const freeNine = [
  { if: '!flag:c3-choice-made & item:star-cell>=3', then: [
    { autosave: 'choice' },
    { confirm: {
      text: `Set the third star-cell in Nine's chest?\n\nThis choice cannot be undone. It changes who stands with you, and how the story can end.`,
      yesLabel: 'Free Nine', noLabel: 'Not yet',
      yes: [
        { take: 'star-cell' },
        { set: ['c3-choice-made', 'c3-freed-nine'] },
        { sfx: 'heartbeat' },
        { say: `You kneel in the grit and push the cell into the socket. It sinks in with a click like a key in a good lock. For a breath nothing happens.` },
        { sfx: 'gate-open' }, { shake: true },
        { scene: { img: 'bg-prison-nine', title: 'Nine Wakes', text: `Blue light floods the iron chest and fills the eyes. The pillar groans. Then Nine *lifts* it, the way a man lifts a blanket, and sets it aside.` } },
        { line: ['nine', `Power at thirty-one percent. Rising. Original Human Brannoc. You spent your third cell on me. That was not efficient.`] },
        { line: ['brannoc', `No. It wasn't.`] },
        { line: ['nine', `I will remember it. I am very good at remembering.`] },
        { line: ['nine', `I am too weak to walk with you. I must sleep in the wells and mend. But I am a Watcher. We are built to cross time. I will find you across it.`] },
        { line: ['shevra', `"Find you across time." That's either the sweetest or the creepiest thing anyone's ever said to you, Bear.`] },
        { line: ['ilsa', `Crom's teeth, Cimmerian! That cell was a king's ransom! My crew bled for this island!`] },
        { line: ['ilsa', `They'll sail home with empty holds and curse my name in every port from here to Tortage. Fine. *Fine.* I hope your tin friend is grateful.`] },
        { line: ['ptahk', `...Sentiment. Well. It is your heart to spend, my bear. I only hope the machine remembers who paid for its breakfast.`] },
        { say: `Ptahk smiles. It does not reach his eyes. For an instant, in the blue light, his pupils look narrow as knife cuts. Then he blinks, and he is only an old man rubbing his knees.` },
        { say: `Nine walks, stiff and careful, into the dark of the lower wells. Its light dwindles to a spark, and then to nothing.` },
        { xp: 50 },
        { quest: ['ch3-main', 4] },
      ],
      no: [{ say: `You close your fist on the cell. Nine's dim eyes follow it. "Understood," it whispers. "There is... still a little time."` }],
    } },
  ], else: [
    { if: 'flag:c3-choice-made', then: [
      { if: 'flag:c3-freed-nine', then: [{ say: `Nine is gone into the wells to mend. Only the dent of its body remains in the dust.` }],
        else: [{ say: `Nine's chest is cold and dark. There is nothing left to give it, and no one left to take it.` }] },
    ], else: [{ say: notThreeYet }] },
  ] },
];

// Open the Vault — THE CHOICE, side two.
const openVault = [
  { if: '!flag:c3-choice-made & item:star-cell>=3', then: [
    { autosave: 'choice' },
    { confirm: {
      text: `Set the third star-cell in the Vault door?\n\nThis choice cannot be undone. It changes who stands with you, and how the story can end.`,
      yesLabel: 'Open the Vault', noLabel: 'Not yet',
      yes: [
        { take: 'star-cell' },
        { set: ['c3-choice-made', 'c3-took-vault'] },
        { say: `You thumb the cell into the socket. Blue fire runs along the seams of the door like water finding cracks.` },
        { sfx: 'rumble' }, { shake: true }, { sfx: 'gate-open' },
        { scene: { img: 'bg-vault', title: 'The Vault of the Drowned Kings', text: `The door grinds up into the rock. Gold in drifts, crowns rusted to skulls, pearls like hail. And on a black altar, an axe.` } },
        { say: `It is a king's war-axe of black iron, crusted with pearls, its edge still bright after a thousand years in the dark. It sits in your hands as if it has been waiting for them.` },
        { give: 'kingsbane' },
        { gold: 2500 },
        { line: ['ilsa', `Now *that* is treasure. Ha! Look at it, Cimmerian! Sixty cutthroats just fell in love with you.`] },
        { line: ['ilsa', `Here's how it goes. My crew takes the gold to Shadizar, where the old snake is headed, and buys every sword in it. When you need an army, you'll have the Redhand Company.`] },
        { line: ['ptahk', `Wise, wise. Gold buys ships, swords and loyalty, my bear. You will not regret this.`] },
        { line: ['shevra', `...Somebody should tell the iron man.`] },
        { xp: 50 },
        { quest: ['ch3-main', 4] },
      ],
      no: [{ say: `You step back. The third cell stays in your bag, for now. The drowned kings grin; they have waited a long time and can wait a little longer.` }],
    } },
  ], else: [
    { if: 'flag:c3-took-vault', then: [{ say: `The Vault stands open and half empty. Ilsa's sailors are carrying out the rest in sea-chests, singing.` }],
      else: [{ if: 'flag:c3-choice-made', then: [{ say: `The socket waits, empty. The cell that could have filled it beats in Nine's chest now. The kings will keep their gold.` }], else: [{ say: notThreeYet }] }] },
  ] },
];

// The Gate Chamber door (Hall of Glyphs).
const setDoorCells = [
  { if: 'flag:c3-door-open', then: [{ say: `The great door stands open. Cold blue light pours out of the Gate Chamber.` }], else: [
    { if: '!flag:c3-choice-made', then: [
      { if: 'item:star-cell>=3', then: [{ line: ['ilsa', `My crew won't follow you through that door until we settle what that third cell buys. Nine, or the Vault. Choose, Cimmerian.`] }],
        else: [{ say: notThreeYet }] },
      { sfx: 'refuse' },
    ], else: [
      { take: 'star-cell', n: 2 },
      { say: `You set the two cells in the door's eyes. They flare. The iron *looks* at you, you'd swear it, and then the door splits down the middle and slides into the walls.` },
      { sfx: 'gate-open' }, { shake: true },
      { set: 'c3-door-open' },
      { xp: 20 },
      { quest: ['ch3-main', 5] },
      { line: ['ptahk', `At last. At last! Come, come. The Gate is waiting, and so am I.`] },
    ] },
  ] },
];

// The twist: set the Starheart in the ring.
const twist = [
  { say: `You lift the Starheart out of your bag. It beats against your palm, warm and heavy as a melon, as it has every day since Shadizar. Ptahk watches it the way a starving man watches bread.` },
  { line: ['ptahk', `Into the ring, bear. Gently. My old hands would only drop it.`] },
  { take: 'starheart', quiet: true },
  { say: `You set the heart in the cradle at the ring's base. It locks with a sound like a bell struck underwater.` },
  { sfx: 'heartbeat' }, { sfx: 'gate-open' }, { shake: true },
  { scene: { img: 'bg-gate-chamber', title: 'The Gate Wakes', text: `Light races around the ring, faster and faster, until the air inside it tears like silk and you are looking into a night sky that is not this one.` } },
  { say: `Behind you, Ptahk laughs. It is not his laugh. It is deep and dry and slow, like a snake sliding over old paper.` },
  { sfx: 'rumble' },
  { scene: { img: 'bg-gate-chamber@void', title: `The Old Man's Knees`, text: `The old Khitan straightens, and straightens, and goes on straightening. His knees do not creak. Not once.` } },
  { say: `The glamour falls from him like a shed skin. What stands there is tall and gaunt, with eyes slit like a serpent's.` },
  { say: `The coiled sigil of Set is burned into his shaven brow. The voice is the same voice that told you bad jokes about his knees for a year. That is the worst of it.` },
  { line: ['thoth-seketh', `Ahhh. That is better. Do you know how it aches, barbarian, to stoop for a year? To grumble about knees and porridge and the young?`] },
  { line: ['thoth-seketh', `The old fool Ptahk died in a ditch outside Khorshemish. I wore his face because it was a face you would pity.`] },
  { line: ['thoth-seketh', `Who do you think paid Tullia's blades, and told my brothers which alley? A rescuer is always trusted, barbarian. And you carried my heart so *carefully*.`] },
  { line: ['thoth-seketh', `The hearts of the Watchers burn the hands of the Serpent's children. So I needed hands. Big, honest, stupid hands.`] },
  { line: ['shevra', `I knew that smoke was no smoke.`] },
  { line: ['thoth-seketh', `You knew nothing, little thief. You *suspected*, and then you let an old man make you laugh.`] },
  { if: 'flag:c3-freed-nine', then: [{ line: ['thoth-seketh', `And you spent a cell on that iron cripple. It should have rotted in the dark. No matter. It is a thousand years too slow to stop me.`] }],
    else: [{ line: ['thoth-seketh', `You even let the machine die for me, and bought yourselves a pirate's gold to be remembered by. Thank you.`] }] },
  { line: ['brannoc', `You talk too much for a dead man.`] },
  { line: ['thoth-seketh', `A thousand years ago Ygg-Sothar woke, and was put back to sleep. I go to feed it this heart at the moment it wakes. Then it will wear a body in every age at once. Yours included.`] },
  { line: ['ilsa', `Over my corpse, snake.`] },
  { line: ['thoth-seketh', `As you wish. Mother of Coils, my sweet. Keep them busy while the ring drinks.`] },
  { leave: 'ptahk' },
  { say: `He raises his hands to the ring and begins to chant in a tongue that hurts your teeth. The well under the dais heaves. Something endless, scaled in rust and green, pours up out of it.` },
  { sfx: 'roar' },
  { fight: {
    id: 'c3-mother', enemies: ['mother-of-coils'], boss: true, noFlee: true, music: 'boss',
    intro: `The Mother of Coils rises between you and the ring, a serpent thick as a galley, her hood spread like a sail!`,
    triggers: [
      { when: 'hp<0.5', enemy: 'mother-of-coils', do: [
        { line: ['thoth-seketh', `Enough! The ring is drunk. It is *done*.`] },
        { shake: true }, { sfx: 'gate-open' },
        { endBattle: 'win' },
      ] },
    ],
    win: [
      { scene: { img: 'bg-gate-chamber@void', title: 'Through the Ring', text: `Thoth-Seketh plucks the Starheart from the cradle. His gloves smoke and blister; he does not let go. He steps into the ring, and the night swallows him.` } },
      { say: `The Mother of Coils, bleeding, wheels and pours herself into the ring after her master, coil after coil after coil. The light begins to shrink.` },
      { line: ['brannoc', `By Crom, I'll gut that old man in whatever century he hides.`] },
      { say: `You don't think about it. You run, and leap.` },
      { line: ['ilsa', `Ha! Into the storm, then!`] },
      { line: ['shevra', `Bear, you absolute lunatic, wait for me!`] },
      { set: 'c3-done' },
      { quest: ['ch3-main', 6] },
      { sfx: 'rumble' },
      { scene: { img: 'bg-gate-chamber@void', title: 'The Gate Closes', text: `The ring snaps shut behind the three of you, with a sound like the whole world blinking.` } },
      { say: `On the Isle of the Iron Dead, the dust settles over the wells, and the drowned kings go back to sleep.` },
      { chapter: 'ch4' },
    ],
  } },
];

// Morvan's rest (sq-bride).
const morvanRest = [
  { if: 'quest:sq-bride<2', then: [{ line: ['morvan', `A ring? Many men have rings, girl. Tell me first why you've come aboard my ship.`] }], else: [
    { if: 'item:love-potion & !flag:c3-potion-poured', then: [
      { line: ['ilsa', `Wait. The witch's potion. "For a gentleman of the sea," she said. I think the old hag meant *him*.`] },
      { set: 'c3-potion-poured' },
      { line: ['morvan', `Sagra's brew. Sagra of the salt marsh! She swore she'd make it the day I was sorry enough. Seventy years. She always did keep a grudge.`] },
      { take: 'love-potion' },
      { say: `Morvan pulls the cork with his teeth and pours the pink stuff over the rail. Where it touches the black sea, the water begins to glow like dawn.` },
      { scene: { img: 'bg-ghost-ship@dusk', title: 'The Weeping Bride', text: `A woman rises from the waves in a wedding dress of sea-foam. She has wept for seventy years. When she sees him, she stops.` } },
    ] },
    { say: `You hold out the ring. Morvan takes it in fingers like cold fog, turns it once to read the words inside: *M. to I., forever.*` },
    { take: 'wedding-ring', quiet: true },
    { line: ['morvan', `I sailed out on our wedding night for one last prize. A Stygian treasure galley. The sea took me, and the prize, and she waited on that beach until she was bones. Forever, I wrote. Fool.`] },
    { if: 'flag:c3-potion-poured', then: [
      { say: `He steps off the rail and onto the glowing water as if it were a dance floor. The bride takes his hand. The ring slides home on her finger. They turn, once, twice, laughing, and then they are only light on the water.` },
    ], else: [
      { say: `He slides the ring onto his own finger and turns toward the shore, where a pale shape has always waited among the wrecks. "I'll tell her myself," he says, and walks down into the sea, and is gone.` },
    ] },
    { line: ['ilsa', `Grandfather.`] },
    { say: `It's the only time you have ever heard Ilsa Redhand's voice break. She was named for the bride. She never told you that.` },
    { line: ['ilsa', `My mother told me he was a drunk who ran off with a Shemite dancer. I'm going to haunt *her* for that.`] },
    { say: `Something clatters on the deck where Morvan stood: his cutlass, its blade bright and clean as the day it was forged. The rot is gone from the ship. So, in a moment, is the ship, sinking softly and gladly into the sea while you scramble for the boat.` },
    { give: 'redhand-cutlass' },
    { line: ['ilsa', `He'd want me to have it. And he'd want me to sink more Stygians with it than he did.`] },
    { xp: 450 },
    { quest: ['sq-bride', 3] },
    { clear: 'c3-night' },
    { goto: 'c3-beach' },
  ] },
];

const glyphRead = [
  { if: '!once:c3-glyphs-read', then: [{ once: 'c3-glyphs-read', do: [
    { line: ['ptahk', `Hmph. Let an old scholar through. Iron-folk pictures, but simple enough. A child could read them, and fortunately I am an old child.`] },
    { say: `He traces the panels one by one with a yellow fingernail.` },
    { line: ['ptahk', `"A door of two eyes." That is the great door here: two sockets, two cells. "A sleeper of one": something that lies waiting for a single cell. "A vault of one": a treasure-house that opens for a single cell. And "a ring that drinks a heart."`] },
    { line: ['ptahk', `The ring is the Gate, bear. It drinks a *heart*. Not a cell. Yours.`] },
    { line: ['shevra', `So three cells on the island, two for the door, one spare. And the spare goes to the sleeper *or* the vault. Never both.`] },
    { line: ['ptahk', `Clever girl. Find the cells. Then we shall see what the spare is worth.`] },
    { xp: 20 },
    { if: 'quest:ch3-main<2', then: [{ quest: ['ch3-main', 2] }] },
  ] }], else: [{ say: `The mural, as Ptahk read it: a door of two eyes; a sleeper of one; a vault of one; a ring that drinks a heart. Three cells on the Isle. Two for the door. One spare, for the sleeper or the vault.` }] },
];

// ---------- the chapter ----------
export default {
  id: 'ch3',
  num: 3,
  title: 'The Isle of the Iron Dead',
  music: 'isle',
  card: { img: 'bg-beach', text: 'The Sea-Wolf drops anchor off an island no chart admits to, where iron men fell like rain.' },
  start: 'c3-beach',
  startDo: [
    { quest: ['ch3-main', 1] },
  ],

  rooms: {
    // ---------------- Wreck Beach ----------------
    'c3-beach': {
      ...ROOM['c3-beach'],
      bg: [{ if: 'flag:c3-night', bg: 'bg-beach@night' }, { bg: 'bg-beach' }],
      desc: [
        { if: '!flag:c3-night', text: `Black sand and white bones of ships. Wrecks lie everywhere: galleys, dhows, a Stygian barge, gutted and greened by the surf. The *Sea-Wolf* rides at anchor in the bay while her crew drag casks up the beach and glare at the jungle.\n\nYour camp fire smokes under a leaning mast. Inland, through the trees, something glints like iron.` },
        { if: 'flag:c3-night', text: `Night. The fire has burned low and the surf hisses on the black sand. The crew sleep with their cutlasses in their fists.` },
        { if: 'flag:c3-night & quest:sq-bride<3', text: `Out on the bay, where nothing floated at sunset, a rotting galleon glows green. Its sails hang in rags. Somewhere aboard, a woman is weeping.` },
        { if: 'flag:c3-choice-made', text: `The crew have heard about the choice. You can tell by how they look at you.` },
      ],
      exits: {
        n: 'c3-jungle',
        in: { to: 'c3-ghost-ship', if: 'flag:c3-night & quest:sq-bride<3', label: 'Row out to the ghost ship' },
      },
      first: [
        { say: `The longboat grinds onto the sand. You jump out into the surf and wade ashore with the Starheart thumping in your bag like a second pulse.` },
        { line: ['ilsa', `The Isle of the Iron Dead. My father drew it on his chart and then drank for a month. Now I see why.`] },
        { line: ['shevra', `Lovely. Bones, wrecks, a jungle full of things that go "hoo." Bear, you take me to the nicest places.`] },
        { line: ['ptahk', `Mind the heart, bear. Keep it close. The Isle can smell it, I think.`] },
      ],
      things: [
        { id: 'sea-wolf', name: 'The Sea-Wolf', noTake: true,
          look: [
            { say: `Ilsa's galley rides at anchor, black-hulled and red-sailed, the best-looking thing on this whole cursed coast. A wolf's head snarls at her prow.` },
            { if: 'flag:c3-freed-nine', say: `The crew are loading water casks with the slow sullen care of men who plan to sail home with empty holds.` },
            { if: 'flag:c3-took-vault', say: `Her holds are filling with the drowned kings' gold. She sits lower in the water every hour, and the crew sing every hour louder.` },
          ] },
        { id: 'camp', name: 'Camp fire', noTake: true,
          look: `A ring of stones, a smoky fire of wreck-wood, a pot of turtle stew that smells better than it has any right to. Bedrolls lie around it. A safe place to rest, if anywhere on this island is.`,
          verbs: {
            Rest: [
              { say: `You stretch out by the fire. The surf talks to itself. Somewhere in the jungle something screams, and stops.` },
              { heal: true },
              { if: '!flag:c3-night & quest:sq-bride<3', then: [
                { set: 'c3-night' },
                { say: `You wake in the deep of the night. The fire is embers. Shevra is shaking your shoulder, and she isn't joking for once.` },
                { line: ['shevra', `Bear. Look at the bay.`] },
                { sfx: 'heartbeat' },
                { scene: { img: 'bg-ghost-ship', title: 'The Ghost Ship', text: `A rotting galleon drifts on the black water, glowing green. There is no wind, but her rags of sail are full. Somewhere aboard, a woman is weeping.` } },
                { line: ['ilsa', `That's no wreck. That's a ship *sailing*. With no wind.`] },
                { line: ['ptahk', `Drowned men's business. Leave it be. Nothing good comes of rowing out to the dead.`] },
                { line: ['ilsa', `Hah! Nothing good ever came of anything I did. Bear, there's a longboat on the sand.`] },
                { quest: ['sq-bride', 1] },
              ] },
              { autosave: true },
            ],
            'Sit by the fire': [
              { if: '!once:c3-fire-banter', then: [{ once: 'c3-fire-banter', do: [
                { say: `The crew's cook ladles turtle stew into bowls. You eat like a wolf. So do Shevra and Ilsa. Ptahk waves his bowl away.` },
                { line: ['shevra', `You never eat, old man. Not once since Shadizar. I've watched.`] },
                { line: ['ptahk', `My stomach is older than your country, child. It has eaten enough for three lifetimes and wants a rest.`] },
                { line: ['ilsa', `More stew for the living, then.`] },
                { line: ['ptahk', `Just so. Eat, eat. Grow big and strong and carry heavy things for me.`] },
              ] }], else: [{ say: `The fire crackles. Ilsa sharpens her cutlass. Shevra counts coins that may or may not be hers. Ptahk stares into the flames and smiles at something only he can see.` }] },
            ],
          },
          use: {
            'love-potion': `Ilsa grabs your wrist. "Pour that in the stew and I'll pour *you* in the bay."`,
            '*': `You hold it over the fire. Nothing happens except that it gets warm.`,
          } },
        { id: 'quartermaster', name: 'The Quartermaster', kind: 'person', portrait: 'generic-man',
          look: `A one-eyed Barachan with forearms like hawsers, sitting on a sea-chest full of other sea-chests. He sells from the *Sea-Wolf*'s stores, and the stores are better than you'd think. Pirates loot good.`,
          talk: 'c3-quartermaster' },
        { id: 'crew', name: 'Grumbling sailors', kind: 'person', portrait: 'generic-man',
          look: [
            { say: `A knot of sailors squat in the shade of a wreck, rolling dice and muttering. You catch the words "gold", "Captain", and "Cimmerian" more often than you'd like.` },
            { if: '!flag:c3-choice-made', say: `They are near mutiny. They came for treasure. So far they've found sand and bones.` },
          ],
          talk: 'c3-crew' },
        { id: 'wrecks', name: 'Wrecks', noTake: true,
          look: [
            { say: `Dozens of ships, centuries of them, piled on the reef like toys a child got bored of. Every one is gutted. Every one has a hole in the hull punched *outward*, from inside.` },
            { once: 'c3-wrecks-banter', do: [{ line: ['ilsa', `Something on this island kills ships. My father said the iron dead come down to the shore at night and rip out the hearts of anything that glows.`] }, { line: ['shevra', `And we've brought the glowiest thing in the world. Wonderful.`] }] },
          ],
          verbs: { Search: [
            { if: 'once:c3-wreck-loot', then: [{ say: `Nothing left but crabs and splinters.` }], else: [
              { once: 'c3-wreck-loot', do: [{ say: `Under a Stygian barge's rotten stern you find a sealed jar. Inside, wrapped in oilcloth: two draughts and a purse of old Stygian gold.` }, { give: 'great-draught', n: 2 }, { gold: 120 }] },
            ] },
          ] } },
        { id: 'ghost-ship', name: 'Ghost ship', noTake: true, if: 'flag:c3-night & quest:sq-bride<3',
          look: `A galleon of a style eighty years out of date, green with weed and glowing like rotten fish. On her stern, in flaking gold: *the Weeping Bride*. The weeping comes from her.`,
          verbs: { 'Row out': [
            { say: `You drag the longboat into the surf. Ilsa takes the oars; she won't let anyone else. The green glow grows until it lights your faces like drowned men's.` },
            { goto: 'c3-ghost-ship' },
          ] } },
      ],
    },

    // ---------------- The Ghost Ship (sq-bride) ----------------
    'c3-ghost-ship': {
      ...ROOM['c3-ghost-ship'],
      desc: [
        { text: `The deck is slick with weed and cold as a tomb. Lanterns burn green without oil. Barnacled cannon, coiled ropes, a figurehead of a weeping woman at the bow. The whole ship creaks like a man breathing in his sleep.` },
        { if: '!won:c3-ghost-cabin', text: `The captain's cabin door is shut, and something behind it is weeping.` },
        { if: 'won:c3-ghost-cabin', text: `A tall pale captain stands at the rail, looking at the shore.` },
      ],
      exits: { out: { to: 'c3-beach', label: 'Row back to the beach' } },
      first: [
        { line: ['ilsa', `A Barachan rig. Eighty years old if it's a day. Who sails a ship like this anymore?`] },
        { say: `The ropes on the deck stir. They are not ropes. They are drowned men, grey and swollen, rising with seawater pouring from their mouths.` },
        { line: ['ptahk', `Steel goes through the dead like fog, children. Fire, holy water, starlight. Anything else is wasted breath.`] },
        { fight: { id: 'c3-ghost-deck', enemies: ['ghost-sailor', 'ghost-sailor'], noFlee: true,
          intro: `The drowned crew of the Weeping Bride attacks!`,
          win: [{ say: `The drowned men come apart like wet smoke and soak into the deck.` }] } },
      ],
      things: [
        { id: 'cabin', name: "Captain's cabin", noTake: true, if: '!won:c3-ghost-cabin',
          look: `A carved door, swollen shut. Weeping seeps out from under it like a draught.`,
          verbs: { Open: [
            { say: `You put your shoulder to the door. It bursts inward in a gout of seawater, and the drowned officers inside turn their dead eyes on you.` },
            { fight: { id: 'c3-ghost-cabin', enemies: ['ghost-sailor', 'ghost-sailor'], noFlee: true,
              intro: `The ship's drowned officers rise from the captain's table!`,
              win: [
                { say: `The officers sink into the planks. In the silence, the weeping stops. Something tall walks out of the dark of the cabin and past you to the rail.` },
                { line: ['morvan', `Enough. Enough, all of you. They're living folk, and they've a captain's look about the girl.`] },
              ] } },
          ] } },
        { id: 'morvan', name: 'Morvan Redhand', kind: 'person', portrait: 'morvan', if: 'won:c3-ghost-cabin',
          look: [
            { say: `A tall captain in a rotted coat, red-bearded even in death, translucent as a jellyfish. His left hand is bare, and he keeps rubbing the place where a ring should be.` },
            { once: 'c3-morvan-look', do: [{ line: ['shevra', `Bear. Look at his face. Now look at Ilsa's. Now look at his face again.`] }] },
          ],
          talk: 'c3-morvan',
          use: {
            'wedding-ring': morvanRest,
            'love-potion': [{ line: ['morvan', `Is that... Sagra's brew? I'd know that stink across seven seas. Hold it, girl. First things first.`] }],
            starheart: [{ line: ['morvan', `Put that away. It burns my eyes.`] }],
            '*': [{ line: ['morvan', `I've been dead seventy years, lad. I don't need that.`] }],
          } },
        { id: 'figurehead', name: 'Figurehead', noTake: true,
          look: `A carved bride with her hands over her face, paint long gone. Someone has carved letters into her collar: *for I.* Seawater runs from her wooden eyes and never stops.` },
        { id: 'log', name: "Ship's log", noTake: true,
          look: `A log book swollen to twice its size, on a lectern by the wheel.`,
          verbs: { Read: [
            { say: `Most pages are pulp. The last legible line, in a big angry hand: *Wedding night. Stygian galley sighted. One last prize, and then I'm done with the sea forever. I swear it to her.*` },
            { once: 'c3-log-ilsa', do: [{ line: ['ilsa', `...M. Redhand, Master. That's my family's hand. My grandfather's.`] }] },
          ] } },
      ],
    },

    // ---------------- Jungle Path ----------------
    'c3-jungle': {
      ...ROOM['c3-jungle'],
      desc: `The jungle closes over you like a fist. Vines thick as hawsers, flowers the size of shields, air you could wring out like a rag. Coconut palms lean over the path. In the undergrowth lie broken iron limbs: hands, shins, a head with one cold glass eye.\n\nThe path splits. West, a racket of hooting from a heap of rocks. East, the roar of a river. North, through the trees, a great grey arch.`,
      exits: { s: 'c3-beach', w: 'c3-ape-rocks', e: 'c3-river', n: 'c3-gateway' },
      first: [
        { say: `Branches shake overhead. Something big drops onto the path in front of you, and two more behind: grey-furred, long-armed, with fangs like a leopard's.` },
        { fight: { id: 'c3-jungle-apes', enemies: ['man-ape', 'man-ape', 'man-ape'], noFlee: true,
          intro: `Man-apes drop from the trees, beating their chests!`,
          win: [{ line: ['shevra', `They had friends. I heard them run west, toward the rocks. Probably to tell their mothers.`] }] } },
      ],
      hunt: [['man-ape', 'man-ape'], ['man-ape', 'man-ape', 'man-ape']],
      ambush: { chance: 0.2, groups: [['man-ape', 'man-ape']], text: 'Man-apes drop out of the canopy!' },
      things: [
        { id: 'palm', name: 'Coconut palm', noTake: true,
          look: `A palm leaning over the path, heavy with coconuts. Each one is the size of a man's head and about as hard.`,
          verbs: { Shake: [
            { if: 'item:coconut', then: [{ say: `You already have a coconut.` }, { line: ['shevra', `One coconut's a snack, Bear. Two is a hobby.`] }], else: [
              { say: `You set your shoulder to the trunk and heave. A coconut drops and bounces off your skull with a sound like a temple gong.` },
              { sfx: 'blunt' },
              { give: 'coconut' },
              { once: 'c3-coconut-banter', do: [{ line: ['ilsa', `Ha! Cimmerian heads are harder than coconuts. That's going in the log.`] }] },
            ] },
          ] },
          use: { '*': `The palm doesn't want it. It has coconuts.` } },
        { id: 'iron-limbs', name: 'Iron limbs', noTake: true,
          look: [
            { say: `An iron hand, big as a shovel, its fingers still curled around nothing. Nearby, half an iron face. The metal is older than any metal should be, and fine as a jeweller's work.` },
            { once: 'c3-limbs-banter', do: [{ line: ['shevra', `It's like the thing in Azhrim's tower. Bear, how many of these are there?`] }, { line: ['ptahk', `Many, child. Many came. Few arrived whole.`] }] },
          ],
          take: `You try to lift the iron hand. It weighs as much as Shevra and is, she points out, less fun.` },
        { id: 'vines', name: 'Vines', noTake: true,
          look: `Thick as your wrist and lumpy with fat white flowers that smell of dead things. One of the vines, you realize, is a snake. It decides you aren't worth the trouble.` },
        { id: 'tracks', name: 'Tracks', noTake: true,
          look: `Big knuckle-prints in the mud, heading west toward the hooting rocks. Something there likes shiny things: the trail is littered with bits of broken bottle.` },
      ],
    },

    // ---------------- The Ape Rocks (cell 3) ----------------
    'c3-ape-rocks': {
      ...ROOM['c3-ape-rocks'],
      desc: [
        { text: `A tumble of grey boulders loud with man-apes. On the highest rock squats the chief in a nest of sticks, and the nest *glitters*: bottle glass, a brass button, a gull ring, a helmet, a sailor's spyglass. And, half buried in the middle, something that glows a steady blue.` },
        { text: `Below the nest, a young ape is haggling with an older one: a shiny shell for a heap of bananas. The deal is done with great seriousness.` },
        { if: 'flag:c3-cell-apes & !flag:c3-chief-gone', text: `The chief preens on his throne, admiring his new ring.` },
        { if: 'flag:c3-chief-gone', text: `The chief's nest is empty and scattered. The apes watch you from a distance, sulking.` },
      ],
      exits: { e: 'c3-jungle' },
      first: [
        { line: ['shevra', `He's a fence. That big grey one. Look at him, sorting his loot. I like him.`] },
        { line: ['ilsa', `Is that a *star-cell* in his nest?`] },
      ],
      things: [
        { id: 'chief', name: 'Ape chief', kind: 'person', if: '!flag:c3-chief-gone',
          look: [
            { say: `A silver-backed giant twice your weight, with a scarred snout and one torn ear. He turns the glowing cell over in his hands, sniffs it, sets it back in pride of place. He knows exactly what his treasures are worth: everything.` },
            { if: '!flag:c3-cell-apes', say: `When Shevra flashes a coin at him, his eyes follow it. When she puts it away, he hoots in disgust. Copper doesn't impress him.` },
          ],
          talk: [
            { say: `You grunt at the chief. The chief grunts back, louder, and slaps the rock. The negotiation stalls.` },
            { if: '!flag:c3-cell-apes', then: [{ line: ['shevra', `He doesn't want words, Bear. He wants something shinier than what he's got. Something *fancy*.`] }] },
          ],
          verbs: {
            'Climb to the nest': [
              { if: 'flag:c3-cell-apes', then: [{ say: `You've got what you came for. The chief has a ring he loves. Leave him to it.` }], else: [
                { say: `You start up the rocks. The chief stands, beats his chest, and roars. Every ape on the rocks roars with him.` },
                { fight: { id: 'c3-apes-chief', enemies: ['ape-chief', 'man-ape', 'man-ape'], noFlee: true,
                  intro: `The ape chief and his guards come down on you!`,
                  win: [
                    { say: `The chief flees howling into the jungle, his court behind him. You climb the nest and pluck the blue cell out of the junk.` },
                    { give: 'star-cell' },
                    { set: ['c3-cell-apes', 'c3-chief-gone'] },
                    ...cellGained,
                  ] } },
              ] },
            ],
          },
          use: {
            'valerio-signet': [
              { if: 'flag:c3-cell-apes', then: [{ say: `The chief already has the finest ring on the island.` }], else: [
                { say: `You hold up Count Valerio's signet. The gold catches the sun. The badly-drawn dolphin winks.` },
                { say: `The chief goes very still. Then he climbs down, slowly, with enormous dignity, and holds out a leathery hand.` },
                { line: ['shevra', `Don't give it to him for nothing! Point at the cell. Point at the *cell*, Bear.`] },
                { say: `You point at the cell. The chief considers. He looks at the ring. He looks at the cell. He hoots once, decisively, fetches the cell from his nest and slaps it into your palm. Then he snatches the ring and jams it on his thumb.` },
                { take: 'valerio-signet' },
                { give: 'star-cell' },
                { sfx: 'sting-solved' },
                { set: 'c3-cell-apes' },
                { xp: { as: ['ape-chief', 'man-ape', 'man-ape'] } },
                { line: ['shevra', `A pleasure doing business. Count Valerio would be so proud. The ring's finally on a hand that deserves it.`] },
                ...cellGained,
              ] },
            ],
            coconut: [{ say: `The chief takes the coconut, cracks it on his own head, drinks it, and tosses back the husk. He keeps the cell.` }],
            starheart: [{ say: `The chief's eyes go huge at the blue glow. He reaches for it. Ptahk raps his knuckles with his staff, hard and fast as a striking snake.` }, { line: ['ptahk', `*Not* that.`] }],
            'healing-draught': `He sniffs it, sneezes, and throws it at Ilsa.`,
            'wedding-ring': [{ say: `The chief reaches for the ring. Ilsa slaps his hand away before you can.` }, { line: ['ilsa', `That's a dead man's ring. Not for monkeys.`] }],
            '*': `The chief examines it, sniffs it, and hands it back with an expression of deep pity. Not shiny enough.`,
          } },
        { id: 'nest', name: "Chief's nest", noTake: true,
          look: [
            { if: '!flag:c3-cell-apes', say: `Bottle glass, a brass button, a gull ring, a cracked spyglass, a Stygian earring, and a cylinder of crystal and iron that glows a soft steady blue. A star-cell, sitting among the junk like a king among beggars.` },
            { if: 'flag:c3-cell-apes', say: `Bottle glass, a brass button, a gull ring, a spyglass. Where the star-cell sat there is a hollow.` },
          ],
          take: `The chief is sitting on it. And on you, if you try.` },
        { id: 'young-ape', name: 'Young ape', noTake: true, if: '!flag:c3-chief-gone',
          look: `A young ape trades a shiny shell for a heap of bananas, then immediately regrets it and tries to trade back. The older ape shakes his head. All sales final. Everything on these rocks is bought and sold for *shine*.`,
          use: { '*': `The young ape is interested, but the chief glares at him, and he flees. All trading on these rocks goes through the boss.` } },
      ],
    },

    // ---------------- Serpent River ----------------
    'c3-river': {
      ...ROOM['c3-river'],
      desc: `A slow brown river, wide as a city street, coils through the jungle. A line of flat stepping stones crosses it, green with slime. On the far bank the jungle thins, and beyond it you can see a field of something that glints.\n\nOn this bank, a squat stone idol with a serpent's head watches the ford.`,
      exits: { w: 'c3-jungle', n: { to: 'c3-graveyard', label: 'Across the ford' } },
      first: [
        { line: ['ptahk', `You carry the heart across, bear. Old hands drop things, and these stones are slick.`] },
        { say: `You are three stones out when the river *rises*. Two heads come up out of the brown water, each as long as a man, mouths gaping pink.` },
        { fight: { id: 'c3-river-ford', enemies: ['river-serpent', 'river-serpent'], noFlee: true,
          intro: `River serpents rise from the ford!`,
          win: [{ line: ['ilsa', `Serpent River. Whoever named it wasn't much of a poet.`] }] } },
      ],
      things: [
        { id: 'stones', name: 'Stepping stones', noTake: true,
          look: `Flat, regular, too regular: cut stone, set there long ago. The only way across to the far bank. The water around them is very deep.` },
        { id: 'water', name: 'The river', noTake: true,
          look: `Brown, slow, and full of eyes. Every so often something long turns over in it and shows a pale belly.`,
          use: { '*': `You toss it toward the water. Something rises an inch, considers it, and declines.` } },
        { id: 'idol', name: 'Serpent idol', noTake: true,
          look: [
            { say: `A squat, ancient idol of a serpent with a man's arms, carved in black basalt. Stygian work, worn to a smooth lump by centuries of rain.` },
            { once: 'c3-idol-banter', do: [
              { say: `Ptahk pats the idol's head as he passes, the way a man pats a dog he knows.` },
              { line: ['shevra', `Friend of yours?`] },
              { line: ['ptahk', `Every old god is a friend of mine, child. Old things should stick together.`] },
            ] },
          ],
          take: `It weighs as much as an ox and it looks like it would bite.` },
      ],
    },

    // ---------------- The Ruined Gateway ----------------
    'c3-gateway': {
      ...ROOM['c3-gateway'],
      desc: `A gateway built for giants: two pillars of grey stone, cracked from top to bottom, holding up half an arch. Around its feet, iron figures lie half-buried in earth and flowers, as if they knelt here and never got up.\n\nBeyond the arch to the north, a long hall lit by a cold blue glow. To the west, a stair goes down into the dark, carved with crowns.`,
      exits: { s: 'c3-jungle', n: 'c3-glyphs', w: { to: 'c3-vault', label: 'Down the stair of crowns' } },
      first: [
        { say: `Three of the kneeling figures stand up.` },
        { line: ['shevra', `Oh, I *hate* that.`] },
        { fight: { id: 'c3-gateway-husks', enemies: ['iron-husk', 'iron-husk', 'iron-husk'], noFlee: true,
          intro: `Iron husks lurch up out of the flowers!`,
          win: [{ line: ['brannoc', `Iron breaks. Like anything else.`] }] } },
      ],
      things: [
        { id: 'arch', name: 'The arch', noTake: true,
          look: [
            { say: `Carved all over with little figures falling out of a ring in the sky, legs and arms spread, like children jumping into a pond. Hundreds of them. Most are drawn broken when they land.` },
            { once: 'c3-arch-banter', do: [{ line: ['ilsa', `They fell like rain. That's what the old charts say about this place. "Here the iron men fell like rain."`] }] },
          ] },
        { id: 'figures', name: 'Kneeling figures', noTake: true,
          look: `Iron men, rusted, half-sunk in the earth, heads bowed. Flowers grow out of their joints. Their chests are all open and empty, like cupboards someone has robbed.` },
        { id: 'stair', name: 'Stair of crowns', noTake: true,
          look: `Steps going down under the west pillar, every one carved with a crown. The air coming up smells of salt and old gold.` },
        { id: 'glow', name: 'Blue glow', noTake: true,
          look: `Through the arch, a long hall lit from the walls by a light like moonlight on ice.` },
      ],
    },

    // ---------------- The Iron Graveyard (cell 2) ----------------
    'c3-graveyard': {
      ...ROOM['c3-graveyard'],
      desc: [
        { text: `A field of iron dead. Hundreds of them, thousands, lying where they fell: face down, sprawled, folded, sunk to the waist in red earth. Some still hold weapons that are not swords. Grass grows through their ribs. The silence is total; even the jungle birds won't sing here.\n\nWest, a fallen wall of the old city blocks the way. The only way back is the ford.` },
        { if: '!won:c3-sentinel', text: `One husk, bigger than the rest, sits against a broken pillar. Its chest still glows. Its fingers twitch.` },
      ],
      exits: { s: { to: 'c3-river', label: 'Back across the ford' } },
      first: [
        { line: ['shevra', `...Bear. They fell like rain.`] },
        { line: ['brannoc', `Crom. Who sends an army to die like this?`] },
        { line: ['ptahk', `People with nothing left to lose, I imagine. Desperate people. The desperate are always so... generous.`] },
      ],
      things: [
        { id: 'sentinel', name: 'Glowing husk', kind: 'person', if: '!won:c3-sentinel',
          look: [
            { say: `A great iron husk, a head taller than the rest, slumped against a pillar. Through a crack in its chest-plate, a star-cell glows blue. Its fingers twitch. Once, its head turns to follow you.` },
            { once: 'c3-sentinel-banter', do: [{ line: ['shevra', `That one's still awake. Which means if we want what's in its chest, we're going to have to argue.`] }] },
          ],
          talk: [{ say: `You speak to it. The husk's head rises. A voice like grinding gears: "IDENTIFY. IDENTIFY. HOSTILE." Well. You tried.` }],
          verbs: { 'Pry open its chest': [
            { say: `You get your fingers under the cracked chest-plate. The husk's eyes blaze. It rises to its full height, and all around the field, two more husks pull themselves out of the earth.` },
            { fight: { id: 'c3-sentinel', enemies: ['sentinel', 'iron-husk', 'iron-husk'], noFlee: true,
              intro: `The sentinel wakes, and the iron dead wake with it!`,
              win: [
                { say: `The sentinel crashes down. You wrench open its chest and lift out the star-cell. It's warm, and it hums against your hand like a cat.` },
                { give: 'star-cell' },
                { set: 'c3-cell-sentinel' },
                ...cellGained,
              ] } },
          ] },
          use: { '*': `The husk's hand snaps closed an inch from your wrist. Its message is clear.` } },
        { id: 'dead', name: 'The fallen', noTake: true,
          look: `Iron faces with no expressions, looking at the sky they fell from. Each has a number cut into its brow in strange angular figures. You realize there are no low numbers here: they start in the hundreds.`,
          verbs: { Search: [
            { if: 'once:c3-amulet', then: [{ say: `You search a dozen more. Empty chests, every one. The cells were taken long ago.` }], else: [{ once: 'c3-amulet', do: [
              { say: `Under the outstretched hand of a fallen husk, half sunk in mud, you find a silver cage on a chain, and in it a shard of blue crystal that hums against sorcery.` },
              { give: 'star-amulet' },
              { line: ['ptahk', `Hm. Pretty. Let the pirate wear it. It makes my teeth ache.`] },
            ] }] },
          ] } },
        { id: 'pillar', name: 'Broken pillar', noTake: true,
          look: `A pillar of the old city wall. Someone has scratched marks on it, long ago, with an iron finger: a tally, and under it one word in the angular script. Ptahk squints. "*Waiting*," he reads. "Or perhaps *nine*. The iron folk liked their puns."` },
      ],
    },

    // ---------------- Hall of Glyphs ----------------
    'c3-glyphs': {
      ...ROOM['c3-glyphs'],
      desc: [
        { text: `A long hall of black stone, lit by cold blue veins in the walls. Its whole east wall is one great mural in four panels, cut so deep and sharp it might have been carved yesterday. Under it, someone much later has scratched rough serpent-letters into the stone.\n\nAt the north end stands a great iron door with two empty round sockets, like eyes. West, an arch leads to a room of metal plates and glowing wells; east, a passage to a cell.` },
        { if: 'flag:c3-door-open', text: `The great door stands open. Beyond it, the Gate Chamber hums.` },
      ],
      exits: {
        s: 'c3-gateway', w: 'c3-wells', e: 'c3-prison',
        n: { to: 'c3-gate-chamber', if: 'flag:c3-door-open', label: 'The Gate Chamber', blocked: `The great iron door is shut. Two empty sockets stare at you like eyes.`,
          noReturn: `Beyond this door lies the Gate, and whatever it wants of you. You won't be able to come back to the Isle.` },
      },
      first: [
        { line: ['ptahk', `Ahh. Now *this* is worth the journey. Let an old scholar read, bear. Ask me to read the mural.`] },
      ],
      things: [
        { id: 'mural', name: 'The mural', noTake: true, hot: '!once:c3-glyphs-read',
          look: `Four panels. A door with two round eyes. A figure lying down, with one small round thing over its heart. A box full of crowns, with one small round thing over its lid. And a great ring, swallowing a big round blazing thing, like a sun. Angular script runs under each panel.`,
          verbs: { Read: glyphRead } },
        { id: 'graffiti', name: 'Serpent-letters', noTake: true,
          look: [
            { say: `Stygian letters, scratched with a knife. Hundreds of years old at least.` },
            { if: 'once:c3-graffiti', then: [{ say: `"Seven went in. One came back." You wonder which one.` }], else: [{ once: 'c3-graffiti', do: [
              { line: ['ptahk', `"Here the servants of Set came for the iron hearts, and here the iron killed them. Seven went in. One came back. Glory to the Old Serpent." Hmph. Bad grammar.`] },
              { line: ['shevra', `You read Stygian like a priest, old man.`] },
              { line: ['ptahk', `I read it like a man who was cheated by Stygian merchants for forty years. One learns the language of one's enemies, child.`] },
            ] }] },
          ] },
        { id: 'inscription', name: 'Inscription over the west arch', noTake: true,
          look: [
            { say: `Over the arch to the Power Wells, a single line of angular script.` },
            { line: ['ptahk', `"Weigh the way before you walk it." A warning for careless feet. I would heed it, bear. Your feet are very careless.`] },
          ] },
        { id: 'gate-door', name: 'Great iron door', noTake: true,
          look: [
            { say: `A door of seamless iron, three men high, with two empty round sockets in it like eyes. Each socket is exactly the size of a star-cell.` },
            { if: '!flag:c3-choice-made & item:star-cell>=3', then: [{ line: ['ilsa', `My crew won't follow you through that door until we settle what that third cell buys.`] }] },
          ],
          verbs: { 'Set the cells': setDoorCells },
          use: {
            'star-cell': setDoorCells,
            starheart: [{ say: `The heart is far too big for these little sockets.` }, { line: ['ptahk', `Not *that* door, bear. The heart is for the ring. Keep it safe a little longer.`] }],
            coconut: `It fits the socket perfectly. It does nothing. You take it back before anyone sees.`,
            '*': `The sockets want something round and full of light. That isn't it.`,
          } },
      ],
    },

    // ---------------- The Power Wells (cell 1) ----------------
    'c3-wells': {
      ...ROOM['c3-wells'],
      desc: [
        { text: `A square room floored with great metal plates over glowing wells. Blue light seeps up through the seams. Some plates are thick with dust; others gleam, as if something heavy rolled across them.\n\nIn the middle of the floor, on a pedestal, sits a crystal cylinder that glows like a little moon.` },
        { if: '!flag:c3-cell-wells', text: `Down in the wells, between the plates, you glimpse iron shapes. Sleeping. Probably.` },
        { if: 'flag:c3-cell-wells', text: `The pedestal is empty now.` },
      ],
      exits: { e: 'c3-glyphs' },
      first: [
        { line: ['shevra', `Throw something first. Not me.`] },
      ],
      things: [
        { id: 'plates', name: 'Metal plates', noTake: true,
          look: `Some plates are thick with grey dust, untouched for ages. Others gleam like new, and between the gleaming ones runs a scuffed track, as if something heavy rolled across them, often. Under the dusty plates you hear, very faintly, iron creaking.`,
          verbs: { Cross: [
            { if: 'flag:c3-cell-wells', then: [{ say: `You stroll across the gleaming plates and back. Nothing happens. You feel slightly foolish.` }], else: [
              { if: 'flag:c3-wells-known', then: [
                { say: `You walk the gleaming plates, one careful step at a time, and lift the cell from its pedestal.` },
                { give: 'star-cell' }, { set: 'c3-cell-wells' }, ...cellGained,
              ], else: [
                { say: `You stride out across the plates. The third one, thick with dust, drops under your boot like a trapdoor. Blue light blazes up, and iron hands come with it.` },
                { sfx: 'rumble' },
                { fight: { id: 'c3-wells', enemies: ['iron-husk', 'iron-husk', 'iron-husk'], noFlee: true,
                  intro: `The wells' guardians climb out of the light!`,
                  win: [
                    { say: `With the guardians smashed, you pick your way to the pedestal and lift the cell.` },
                    { give: 'star-cell' }, { set: ['c3-cell-wells', 'c3-wells-known'] }, ...cellGained,
                    { line: ['shevra', `"Throw something first," I said. Nobody listens to the thief.`] },
                  ] } },
              ] },
            ] },
          ] },
          use: {
            coconut: [
              { if: 'flag:c3-cell-wells', then: [{ say: `You've already got the cell. Save the coconut for lunch.` }], else: [
                { take: 'coconut' },
                { say: `You bowl the coconut out across the floor. It rolls happily along the gleaming plates, wobbles, and trundles onto a dusty one.` },
                { sfx: 'rumble' },
                { say: `The dusty plate drops like a trapdoor. Blue light blazes up; iron fingers snatch the coconut and crush it to pulp; then the plate swings shut and all is still.` },
                { line: ['shevra', `Dusty ones bite. Shiny ones don't. Told you. Throw something first.`] },
                { say: `You walk the gleaming plates, one careful step at a time, and lift the cell from its pedestal. Down in the wells, the iron guardians sleep on.` },
                { set: ['c3-cell-wells', 'c3-wells-known'] },
                { give: 'star-cell' },
                { xp: { as: ['iron-husk', 'iron-husk', 'iron-husk'] } },
                ...cellGained,
              ] },
            ],
            starheart: [{ line: ['ptahk', `Throw the *heart*? Have you lost your mind? Throw something you don't need, bear!`] }],
            '*': `You weigh it in your hand. Too precious to throw, or too light to trip anything. Something heavy and round would be better.`,
          } },
        { id: 'pedestal', name: 'Pedestal', noTake: true,
          look: [
            { if: '!flag:c3-cell-wells', say: `A crystal cylinder sits in a cradle on the pedestal, glowing blue. A star-cell. Between you and it: a floor of plates, some dusty, some bright.` },
            { if: 'flag:c3-cell-wells', say: `An empty cradle.` },
          ],
          take: [
            { if: 'flag:c3-cell-wells', then: [{ say: `It's empty.` }], else: [{ say: `It's in the middle of the floor. You'd have to cross the plates first.` }] },
          ] },
        { id: 'wells', name: 'Glowing wells', noTake: true,
          look: `Square shafts going down into blue light, deeper than you can see. Iron shapes hang in them like bats in a cave, folded, waiting. Every so often one twitches.` },
      ],
    },

    // ---------------- The Prison of Nine (the choice) ----------------
    'c3-prison': {
      ...ROOM['c3-prison'],
      desc: [
        { text: `A cell cut for a giant, its iron door torn off its hinges long ago. Half the ceiling has come down.` },
        { if: '!flag:c3-choice-made', text: `Under a fallen pillar lies an iron man, pinned across the chest. Its chest socket is empty, rimmed with a dying blue flicker. Its eyes are open, very dim. It is watching you.` },
        { if: 'flag:c3-freed-nine', text: `The fallen pillar lies to one side where Nine set it down. The dust still holds the shape of its body.` },
        { if: 'flag:c3-took-vault', text: `Under the fallen pillar lies an iron man, dark and still. Its chest socket is cold.` },
        { text: `The walls are covered in tiny scratched tally marks, thousands upon thousands of them.` },
      ],
      exits: { w: 'c3-glyphs' },
      enter: [
        { if: 'flag:c3-took-vault', then: [{ once: 'c3-nine-dark', do: [
          { say: `The iron man's eyes are almost black. They find you anyway.` },
          { line: ['nine', `Original Human Brannoc. I heard the Vault open. That is all right. Gold is a good thing to have when you fight a dragon.`] },
          { line: ['nine', `Please... remember that we came. That is all any of us wanted.`] },
          { say: `The last blue spark in its eyes goes out. It does not come back.` },
          { line: ['shevra', `...I hate this island, Bear.`] },
        ] }] },
      ],
      things: [
        { id: 'pillar', name: 'Fallen pillar', noTake: true,
          look: [
            { say: `A pillar of black stone as thick as an ox, fallen across the iron man's chest. It couldn't shift that weight now. With power in that empty socket, though, you'd guess it could throw the pillar across the room.` },
            { once: 'c3-pillar-argument', do: [
              { line: ['ptahk', `Gold buys ships, swords and loyalty, my bear. That poor machine is already a corpse. Let it rest.`] },
              { line: ['shevra', `It's not a corpse, it's *looking* at me. Bear, it's like the one in the tower. It's like the one that gave you the heart.`] },
              { line: ['ilsa', `And my crew have followed you across the sea for nothing but scars. Sixty men, Cimmerian. They want the Vault. So do I.`] },
              { line: ['ptahk', `Think, bear. A machine that wakes might wander off and get itself broken again. Gold stays bought.`] },
              { line: ['brannoc', `I'll think.`] },
            ] },
          ],
          take: `Even with Ilsa and Shevra pulling with you, the pillar won't budge an inch.` },
        { id: 'nine', name: 'Nine', kind: 'person', portrait: 'nine', if: '!flag:c3-freed-nine',
          look: [
            { if: '!flag:c3-choice-made', say: `An iron man, smaller and finer than the husks outside, with a face almost like a man's. On his brow, in the angular script, is cut a single figure, and you somehow know it means *nine*. Its chest socket is the size of a star-cell. A thin blue flicker runs round the rim of it, and every so often the flicker skips.` },
            { if: 'flag:c3-took-vault', say: `Dark iron. A face almost like a man's. Nothing moves in it now.` },
          ],
          talk: [
            { if: 'flag:c3-took-vault', then: [{ say: `There is no answer. There will never be an answer again.` }], else: [{ talk: 'c3-nine' }] },
          ],
          verbs: { 'Give the cell': freeNine },
          use: {
            'star-cell': freeNine,
            starheart: [{ line: ['nine', `No. Not the heart. The heart must go to the Gate. Please. Do not waste it on me.`] }],
            'healing-draught': [{ say: `You pour the draught into the socket. It sizzles.` }, { line: ['nine', `Thank you. That was... wine. I am not built for wine.`] }],
            '*': [{ line: ['nine', `Thank you. That is not what I need. I need a cell. A small sun.`] }],
          } },
        { id: 'tally', name: 'Tally marks', noTake: true,
          look: [
            { say: `Thousands of neat little scratches in rows, covering every wall. Days. Years. Someone has been counting for a very long time.` },
            { once: 'c3-tally', do: [{ line: ['shevra', `Bear. He's been lying here counting days since before Shadizar had walls. Crom.`] }] },
          ] },
      ],
    },

    // ---------------- Vault of the Drowned Kings (the choice) ----------------
    'c3-vault': {
      ...ROOM['c3-vault'],
      desc: [
        { text: `A vault of wet black stone, half drowned in seawater that comes and goes with the tide. Along the walls sit the drowned kings on their thrones: skeletons in rusted crowns, pearls in their eye sockets, gold pooled in their laps.` },
        { if: '!flag:c3-took-vault', text: `At the far end, a stone door carved with a crowned skull. In the skull's forehead, one round empty socket. Through a grille beside it you can see more gold than Shadizar has ever seen in one place.` },
        { if: 'flag:c3-took-vault', text: `The inner door stands open. Sailors are hauling out the drowned kings' gold in sea-chests and singing shanties about you, mostly rude.` },
      ],
      exits: { e: { to: 'c3-gateway', label: 'Up the stair of crowns' } },
      first: [
        { line: ['ilsa', `Gods of the deep. Cimmerian. Look at it. *Look* at it.`] },
        { line: ['shevra', `I'm looking. I'm looking so hard. Bear, my eyes are in love.`] },
        { say: `Behind you on the stair, a handful of Ilsa's sailors who followed you in have gone very quiet in a dangerous way.` },
      ],
      things: [
        { id: 'socket', name: 'Vault door', noTake: true,
          look: [
            { say: `A stone door carved with a crowned skull, sealed tight. In the skull's brow, a single empty round socket. It's the size of a star-cell.` },
            { if: '!flag:c3-choice-made', then: [{ once: 'c3-socket-banter', do: [
              { line: ['ptahk', `One cell and it opens. Gold for an army, bear. Think of it.`] },
              { line: ['ilsa', `My crew are a day from mutiny. This would make them mine forever.`] },
            ] }] },
          ],
          verbs: { 'Set the cell': openVault },
          use: {
            'star-cell': openVault,
            starheart: [{ line: ['ptahk', `Bear! Not *that*! The heart is for the ring. The cell, the cell!`] }],
            coconut: `The drowned kings were not that kind of king.`,
            '*': `The socket wants a star-cell. The kings don't take bribes; they *are* the bribe.`,
          } },
        { id: 'kings', name: 'Drowned kings', noTake: true,
          look: [
            { say: `Seven thrones, seven skeletons, seven crowns rusted to seven skulls. Pirate kings of a sea that sank before Atlantis did. Their bony hands still grip their scepters.` },
            { once: 'c3-kings', do: [{ line: ['brannoc', `They kept their gold. Much good it did them.`] }, { line: ['shevra', `Speak for yourself. I'd love to be that kind of dead.`] }] },
          ],
          take: `You reach for a crown. A skull turns, very slightly, toward your hand. You decide you don't want a crown.` },
        { id: 'grille', name: 'Grille', noTake: true,
          look: [
            { if: '!flag:c3-took-vault', say: `Through iron bars too close for even Shevra's arm: drifts of gold, rotten chests spilling pearls, and on a black altar, a great axe of black iron that seems to drink the light.` },
            { if: 'flag:c3-took-vault', say: `The grille stands open. The drifts of gold get smaller by the minute.` },
          ] },
        { id: 'sailors', name: 'Sailors on the stair', kind: 'person', portrait: 'generic-man',
          look: `Five of Ilsa's sailors, wet-eyed with greed. They glance from the gold to Ilsa to you, and their hands drift toward their knives.`,
          talk: [
            { if: '!flag:c3-choice-made', then: [{ line: ['c3-sailor', `Begging pardon, big man. But if you walk away from this, you'll be walking home. Ain't one of us rowing you.`] }, { line: ['ilsa', `Mind your tongue, Haskar. ...But he's not wrong.`] }] },
            { if: 'flag:c3-took-vault', then: [{ line: ['c3-sailor', `Three cheers for the Cimmerian! Hip! Hip!`] }] },
            { if: 'flag:c3-freed-nine', then: [{ line: ['c3-sailor', `Spent it on a tin man. A *tin man*.`] }, { say: `They spit, one after the other, into the seawater.` }] },
          ] },
      ],
    },

    // ---------------- The Gate Chamber (twist 2, boss) ----------------
    'c3-gate-chamber': {
      ...ROOM['c3-gate-chamber'],
      desc: `A round chamber so vast its roof is lost in shadow. On a stepped dais in the middle stands the Gate: a ring of iron and crystal as tall as a ship's mast, silent and dark. At its base, a cradle shaped to hold something round and the size of a melon. Under the dais, a black well breathes cold air.`,
      exits: {},
      first: [
        { say: `Your footsteps ring like hammer-blows. Ptahk hurries ahead, faster than you've ever seen him move, and stops at the foot of the dais.` },
        { line: ['ptahk', `Here. *Here.* Bear, the ring drinks a heart, not a cell. Yours. Set it in the cradle, and the Gate will wake.`] },
        { line: ['shevra', `And then what? We walk into a hole in the air?`] },
        { line: ['ptahk', `Then the Watcher's work is done, and the dragon's sleep is safe. Isn't that what the iron man begged of you? Come, come. Set the heart.`] },
      ],
      things: [
        { id: 'ring', name: 'The Gate', noTake: true,
          look: `A ring of black iron set with crystal, as tall as a mast. Close up, the iron is covered in the same angular script as the mural, running round and round. At its base, a cradle the size and shape of the Starheart. Ptahk can't take his eyes off it.`,
          verbs: { 'Set the Starheart': twist },
          use: {
            starheart: twist,
            '*': [{ line: ['ptahk', `A heart, bear. The ring drinks a *heart*. Your heart. The Starheart!`] }],
          } },
        { id: 'well', name: 'Black well', noTake: true,
          look: `A shaft under the dais, dark as a throat. Cold air rises from it in slow breaths, as if something very large is sleeping down there.` },
        { id: 'ptahk-here', name: 'Ptahk', kind: 'person', portrait: 'ptahk',
          look: `Ptahk stands at the foot of the dais, rubbing his gloved hands together. He's trembling. It might be the cold. He's never worn gloves before.`,
          talk: [{ line: ['ptahk', `Talk, talk, talk! Later, bear. Set the heart in the ring. Please. My old heart can't bear the waiting.`] }] },
      ],
    },
  },

  npcs: {
    'c3-sailor': { name: 'Sailor', portrait: 'generic-man' },
  },

  dialogues: {
    'c3-quartermaster': {
      start: 'a',
      nodes: {
        a: { who: 'quartermaster', text: `Captain says sell to you at cost. Captain says a lot of things lately. What'll it be, big man?`, next: 'm' },
        m: { who: 'quartermaster', text: ``, choices: [
          { id: 'trade', text: 'Show me what you have.', do: [{ shop: 'c3-quartermaster' }], to: 'm' },
          { id: 'ghost', text: 'Any stories about this island?', to: 'ghost' },
          { id: 'mood', text: 'How are the crew?', to: 'mood' },
          { id: 'leave', text: 'Leave.', end: true },
        ] },
        ghost: { who: 'quartermaster', text: `Stories? Only the one every Barachan knows. Morvan Redhand, the Captain's own grandsire. Sailed off on his wedding night after a Stygian treasure galley and never came home. They say his ship still sails these waters by night, crewed by the drowned.`, next: 'ghost2' },
        ghost2: { who: 'quartermaster', text: `If you see her, don't try steel. Fire or holy water, that's what my old mam said.`, do: [
          { once: 'c3-qm-flasks', do: [{ say: `He digs in a chest and presses two clay flasks into your hands.` }, { give: 'fire-flask', n: 2 }, { line: ['quartermaster', `On the house. Don't tell the Captain I'm soft.`] }] },
        ], next: 'm' },
        mood: { who: 'quartermaster', text: `Bad. We came for treasure. We've found sand, bones, apes, and iron dead men. The lads are a day from mutiny, and they'll want something shiny out of this rock, or they'll want a new captain.`, next: 'm' },
      },
    },
    'c3-crew': {
      start: 'a',
      nodes: {
        a: { who: 'c3-sailor', text: `What do you want, Cimmerian? Come to tell us about the treasure?`, next: 'm' },
        m: { who: 'c3-sailor', text: '', choices: [
          { id: 'treasure', text: 'What treasure?', to: 'treasure', if: '!flag:c3-choice-made' },
          { id: 'mutiny', text: 'You sound like men thinking about mutiny.', to: 'mutiny', if: '!flag:c3-choice-made' },
          { id: 'after-vault', text: 'Happy now?', to: 'happy', if: 'flag:c3-took-vault' },
          { id: 'after-nine', text: 'Still sulking?', to: 'sulk', if: 'flag:c3-freed-nine' },
          { id: 'leave', text: 'Leave.', end: true },
        ] },
        treasure: { who: 'c3-sailor', text: `The drowned kings' vault, that's what. Every Barachan knows the song: seven kings in their crowns, under the stair of crowns, and their gold behind a door with one eye. One eye! Find what opens it and we're all rich.`, next: 'm' },
        mutiny: { who: 'c3-sailor', text: `Mutiny? Us? Never. We love the Captain. We'd just love her more with gold in our pockets. You tell her that.`, next: 'm' },
        happy: { who: 'c3-sailor', text: `Happy? Big man, I'm going to buy a tavern. I'm going to buy *two* taverns and make them fight. Then the Captain says we're off to Shadizar to buy every sword in it for you. Redhand Company! Ha!`, next: 'm' },
        sulk: { who: 'c3-sailor', text: `We sail home at dawn with empty holds, thanks to you and your tin friend. No offense. Well. Some offense.`, next: 'm' },
      },
    },
    'c3-nine': {
      start: 'a',
      nodes: {
        a: { who: 'nine', text: `Original... Human Brannoc. Your signal is the Starheart's signal. The Watcher in the tower sang your name into the iron before it went dark. All of us heard.`, next: 'm' },
        m: { who: 'nine', text: '', choices: [
          { id: 'who', text: 'Who are you?', to: 'who' },
          { id: 'need', text: 'What do you need?', to: 'need' },
          { id: 'name', text: 'Stop calling me "Original Human".', to: 'name' },
          { id: 'dragon', text: 'What do you know of the dragon?', to: 'dragon' },
          { id: 'leave', text: 'Rest, iron man.', end: true },
        ] },
        who: { who: 'nine', text: `I am Unit Nine of the Last Legion. We were sent back to kill the dragon while it slept. Most of us arrived broken. I arrived... nearly whole. Then the ceiling fell. I have been counting days since. Many days.`, next: 'm' },
        need: { who: 'nine', text: `A cell. A small sun, the size of this socket. With one, I could lift this pillar. I could help. But I know there are only three on the Isle, and the door eats two. It is all right. I understand arithmetic.`, next: 'm' },
        name: { who: 'nine', text: `Understood, Original Human Brannoc. ...That was a joke. I am learning those. Brannoc. Just Brannoc.`, next: 'm' },
        dragon: { who: 'nine', text: `Ygg-Sothar eats the futures of worlds. It ate mine. There were green hills there once, my makers said. I never saw them. I would like to.`, do: [
          { once: 'c3-nine-dragon', do: [{ line: ['ptahk', `Sad. Very sad. Come away, bear. It's babbling.`] }] },
        ], next: 'm' },
      },
    },
    'c3-morvan': {
      start: 'a',
      nodes: {
        a: { who: 'morvan', text: `Living folk on my deck. It's been a long while. Speak, then, before the tide turns.`, next: 'm' },
        m: { who: 'morvan', text: '', choices: [
          { id: 'who', text: 'Who are you?', to: 'who' },
          { id: 'rest', text: 'Why can\'t you rest?', to: 'rest' },
          { id: 'sagra', text: 'Do you know a witch called Sagra?', to: 'sagra', if: 'quest:sq-witch>=4' },
          { id: 'leave', text: 'Leave.', end: true },
        ] },
        who: { who: 'morvan', text: `Morvan Redhand, master of the Weeping Bride, terror of the Stygian coast, and the biggest fool who ever sailed out of Tortage. And who's the red-haired lass with my glare?`, next: 'who2' },
        who2: { who: 'ilsa', text: `Ilsa Redhand. Captain of the Sea-Wolf. My father was Bran Redhand. His father was... Morvan.`, next: 'who3' },
        who3: { who: 'morvan', text: `...Ilsa. They named you Ilsa. Ah, gods of the deep. That was her name. My bride's.`, next: 'm' },
        rest: { who: 'morvan', text: `I left her on our wedding night. One more prize, I said. The sea took me with my ring still on my finger, and some great serpent swallowed it and me both. I can't go to her without it. I gave my word with that ring. Forever.`, do: [
          { if: 'quest:sq-bride<2', then: [{ quest: ['sq-bride', 2] }, { xp: 180 }] },
          { if: 'item:wedding-ring', then: [{ line: ['ilsa', `A serpent. Khurath. Bear, the ring from its gut. "M. to I., forever."`] }] },
        ], next: 'm' },
        sagra: { who: 'morvan', text: `Sagra of the salt marsh? Ha! She loved my bride like a sister and hated me like poison. She swore she'd brew me a cure the day I was sorry enough. If you've brought any of her brews, bring them here, and bring the ring.`, next: 'm' },
      },
    },
  },

  items: {
    coconut: { name: 'Coconut', type: 'key', icon: 'coconut', desc: 'Hard, hairy, heavy and round. Good for drinking, throwing, or bouncing off Cimmerian skulls.' },
  },

  enemies: {
    'ghost-sailor': {
      ...enemyStats(11, 'minion'), name: 'Drowned Sailor', sprite: 'ghost-sailor', size: 'm',
      weak: ['holy', 'star', 'fire'], resist: [], immune: ['slash', 'pierce', 'blunt'],
      desc: 'A drowned Barachan, grey and swollen, seawater running from its mouth. Steel passes through it like fog.',
      skills: [
        { name: 'Drowning Grasp', magic: true, el: 'cold', power: 1.2, chance: 0.3, sfx: 'cold' },
        { name: 'Rotten Cutlass', power: 1.1, dmg: 'slash', chance: 0.3 },
      ],
      attackDmg: 'slash', drops: [{ id: 'healing-draught', chance: 0.25 }],
    },
    'man-ape': {
      ...enemyStats(11, 'minion'), name: 'Man-Ape', sprite: 'man-ape', size: 'm',
      weak: ['slash'], resist: [], immune: [],
      desc: 'A grey-furred ape as big as a man, with a leopard\'s fangs and a thief\'s eye for shiny things.',
      skills: [{ name: 'Pummel', power: 1.3, dmg: 'blunt', chance: 0.3, sfx: 'blunt' }, { name: 'Savage Bite', power: 1.2, dmg: 'pierce', chance: 0.2, sfx: 'bite' }],
      attackDmg: 'blunt', drops: [{ id: 'healing-draught', chance: 0.2 }],
    },
    'ape-chief': {
      ...enemyStats(13, 'brute'), name: 'Ape Chief', sprite: 'man-ape', tint: 'gold', size: 'l',
      weak: ['slash'], resist: [], immune: [],
      desc: 'The silver-backed king of the Ape Rocks, and its only fence.',
      skills: [{ name: 'Chest-Beat', buff: { atkUp: 3 }, chance: 0.2, sfx: 'roar' }, { name: 'Boulder Smash', power: 1.5, dmg: 'blunt', chance: 0.3, sfx: 'blunt' }],
      attackDmg: 'blunt', drops: [{ id: 'great-draught', chance: 1 }],
    },
    'river-serpent': {
      ...enemyStats(12, 'brute'), name: 'River Serpent', sprite: 'river-serpent', size: 'l',
      weak: ['slash', 'cold'], resist: ['fire'], immune: [],
      desc: 'A pale-bellied serpent of the brown river, as long as a galley\'s oar-bank.',
      skills: [{ name: 'Crushing Coil', power: 1.4, dmg: 'blunt', chance: 0.25, status: { stun: 0.2 } }, { name: 'Fanged Strike', power: 1.2, dmg: 'pierce', chance: 0.3, status: { poison: 0.3 }, sfx: 'bite' }],
      attackDmg: 'pierce', drops: [{ id: 'serpent-scale', chance: 0.5 }],
    },
    'iron-husk': {
      ...enemyStats(12, 'minion'), name: 'Iron Husk', sprite: 'iron-husk', size: 'm',
      weak: ['blunt', 'cold'], resist: ['lightning', 'fire'], immune: [],
      desc: 'A broken Watcher from the far future, its heart gone, still obeying its last order: guard.',
      skills: [{ name: 'Piston Fist', power: 1.3, dmg: 'blunt', chance: 0.3, sfx: 'blunt' }, { name: 'Spark Eye', magic: true, el: 'lightning', power: 1.1, chance: 0.2, sfx: 'lightning' }],
      attackDmg: 'blunt', drops: [{ id: 'iron-scrap', chance: 0.4 }],
    },
    sentinel: {
      ...enemyStats(13, 'brute'), name: 'Sentinel', sprite: 'sentinel', size: 'l',
      weak: ['blunt', 'cold'], resist: ['lightning', 'fire'], immune: [],
      desc: 'A great Watcher that still holds one star-cell, and means to keep it.',
      skills: [{ name: 'Star Lance', magic: true, el: 'star', power: 1.3, chance: 0.3, sfx: 'star' }, { name: 'Iron Sweep', power: 0.9, dmg: 'blunt', target: 'all', chance: 0.2, sfx: 'blunt' }],
      attackDmg: 'blunt', drops: [{ id: 'watcher-blade', chance: 1 }, { id: 'iron-scrap', chance: 1 }],
    },
    'mother-of-coils': {
      ...enemyStats(13, 'boss'), name: 'Mother of Coils', sprite: 'mother-of-coils', size: 'xl',
      weak: ['slash', 'cold'], resist: ['fire'], immune: [],
      desc: 'Thoth-Seketh\'s pet: a serpent thick as a galley, hooded like a cobra, older than Stygia.',
      skills: [
        { name: 'Tail Sweep', power: 0.8, dmg: 'blunt', target: 'all', chance: 0.25, sfx: 'blunt' },
        { name: 'Crushing Coil', power: 1.5, dmg: 'blunt', chance: 0.25, status: { stun: 0.25 } },
        { name: 'Venom Rain', magic: true, el: 'void', power: 1.0, target: 'all', chance: 0.2, status: { poison: 0.4 }, sfx: 'debuff' },
      ],
      attackDmg: 'pierce', drops: [{ id: 'serpent-scale', chance: 1 }],
    },
  },

  shops: {
    'c3-quartermaster': { name: "The Sea-Wolf's Stores", keeper: 'quartermaster', items: [
      'watcher-blade', 'aesir-hammer', 'hyrkanian-lance', 'iron-dead-shiv', 'reaver-bow', 'serpent-rod',
      'scale-hauberk', 'horned-helm', 'kite-shield', 'nightcloak', 'star-amulet',
      'healing-draught', 'great-draught', 'mana-lotus', 'antidote', 'smelling-salts', 'fire-flask', 'holy-water',
    ] },
  },

  quests: {
    'ch3-main': { name: 'The Isle of the Iron Dead', main: true, chapter: 3, done: 6, stages: {
      1: 'The Gate lies somewhere inland on the Isle. Find it.',
      2: 'The mural: "a door of two eyes; a sleeper of one; a vault of one; a ring that drinks a heart." Find the Isle\'s three star-cells.',
      3: 'You hold all three star-cells. The door needs two. Decide what the third buys: Nine, in the Prison, or the Vault of the Drowned Kings.',
      4: 'The choice is made. Set the two remaining cells in the great door in the Hall of Glyphs.',
      5: 'The Gate Chamber is open. Ptahk wants the Starheart set in the ring.',
      6: 'Through the Gate, after Thoth-Seketh.',
    } },
  },

  hints: [
    { if: 'quest:ch3-main<2 & !visited:c3-glyphs', nudge: 'The Gate lies inland. The great grey arch north of the Jungle Path looks like the way.', answer: 'Go north from the beach to the Jungle Path, then north to the Ruined Gateway and the Hall of Glyphs.' },
    { if: 'visited:c3-glyphs & !once:c3-glyphs-read', nudge: 'Ptahk is itching to read the mural in the Hall of Glyphs.', answer: 'In the Hall of Glyphs, select the mural and choose Read.' },
    { if: '!flag:c3-cell-wells & visited:c3-wells & !item:coconut', nudge: 'In the Power Wells, some plates are dusty and some gleam. "Weigh the way before you walk it." Shevra says throw something first. Something heavy and round.', answer: 'Shake the coconut palm on the Jungle Path for a coconut, then Use the coconut on the metal plates in the Power Wells. (Or just Cross the plates and fight the guardians.)' },
    { if: '!flag:c3-cell-wells & visited:c3-wells & item:coconut', nudge: 'Something heavy and round, rolled across the plates, would show you which ones bite.', answer: 'Use the coconut on the metal plates in the Power Wells.' },
    { if: '!flag:c3-cell-sentinel & !visited:c3-graveyard', nudge: 'Something glints in a field beyond Serpent River.', answer: 'Go east from the Jungle Path to Serpent River and cross the ford north to the Iron Graveyard.' },
    { if: '!flag:c3-cell-sentinel & visited:c3-graveyard', nudge: 'One husk in the Iron Graveyard still glows. Its chest holds a cell, and it won\'t give it up without a fight.', answer: 'Select the glowing husk in the Iron Graveyard and choose "Pry open its chest", then win the fight.' },
    { if: '!flag:c3-cell-apes & !visited:c3-ape-rocks', nudge: 'Ape tracks lead west from the Jungle Path, littered with broken bottle glass. Apes who like shiny things.', answer: 'Go west from the Jungle Path to the Ape Rocks.' },
    { if: '!flag:c3-cell-apes & visited:c3-ape-rocks', nudge: 'The ape chief is a fence: on his rocks everything is traded for shine. You still carry something very shiny and very useless from Messantia.', answer: 'Use Valerio\'s signet on the ape chief. (Or "Climb to the nest" and fight him and his guards.)' },
    { if: 'item:star-cell>=3 & !flag:c3-choice-made', nudge: 'Three cells: two for the door, one spare. "A sleeper of one; a vault of one." Nine in the Prison, or the drowned kings\' Vault. Not both.', answer: 'Either "Give the cell" to Nine in the Prison of Nine, or "Set the cell" in the Vault door. The game saves just before you decide. Freeing Nine opens a later ending; the Vault brings gold, Kingsbane and an army.' },
    { if: 'flag:c3-choice-made & !flag:c3-door-open', nudge: 'The great door in the Hall of Glyphs has two eyes. You have two cells.', answer: 'In the Hall of Glyphs, select the great iron door and choose "Set the cells".' },
    { if: 'flag:c3-door-open', nudge: 'The ring drinks a heart, Ptahk says. Your heart.', answer: 'Go north into the Gate Chamber and choose "Set the Starheart" on the Gate.' },
    { if: 'quest:sq-bride==0 & !flag:c3-night', nudge: 'The beach is a safe place to rest. Who knows what drifts in by night?', answer: 'Choose Rest at the camp fire on Wreck Beach.' },
  ],

  combine: [],
  scripts: {},
};
