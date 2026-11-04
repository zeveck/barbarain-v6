// Chapter I — The City of Thieves (Shadizar).
import { enemyStats } from '../data/balance.js';
import { ROOM } from './manifest.js';

// A companion's first-time remark, played the first time they are present when this runs.
const bant = (id, who, text) => ({ if: `party:${who}`, then: [{ once: id, do: [{ line: [who, text] }] }] });
const hurt = (n, who = 'brannoc') => ({ call: 'c1-hurt', args: { n, who } });

// ---------------------------------------------------------------- the heist's end
const azhrimFight = {
  id: 'c1-azhrim', enemies: ['brass-serpent', 'azhrim'], boss: true, noFlee: true, music: 'boss',
  intro: 'Azhrim the Collector and his brass serpent!',
  triggers: [
    { when: 'dead', enemy: 'brass-serpent', do: [{ line: ['azhrim', `My serpent! My beautiful toy! Do you know what that *cost*?`] }] },
    { when: 'hp<0.5', enemy: 'azhrim', do: [{ line: ['azhrim', `You will make a *magnificent* statue, barbarian. I'll put you by the pool.`] }] },
  ],
};

const escapeFight = {
  id: 'c1-escape', enemies: ['tullia-blade', 'cultist', 'tullia-blade'], noFlee: true, bg: 'bg-alley@night',
  intro: `Tullia's blades and the serpent's priests close in!`,
  triggers: [
    { when: 'round>=3', do: [
      { say: `A cracked old voice says something in a language like breaking glass. The alley turns *orange*.` },
      { sfx: 'fire' }, { shake: true },
      { line: ['ptahk', `Down, children!`] },
      { say: `A ball of fire the size of a cart rolls down the alley and bursts among the red sashes and the hooded men. Silk burns. Hoods burn. The ambushers scatter screaming into the dark, slapping at their clothes.` },
      { endBattle: 'win' },
    ] },
  ],
};

// The run out of the burning tower: the text follows how the guards and hounds were dealt with.
const ESCAPE_RUN = [{ if: 'won:c1-hall-guards', then: [
  { if: 'won:c1-hounds', then: [{ say: `Down the Moon Stair three steps at a time, through a hall where the glass cases are bursting in the heat, out past the Collector's guards, still lying where you left them among their scattered coppers, through a garden full of screaming peacocks and two dead hounds in the black roses, up your rope and over the wall. Behind you, the black tower burns like a torch over Shadizar.` }], else: [{ say: `Down the Moon Stair three steps at a time, through a hall where the glass cases are bursting in the heat, out past the Collector's guards, still lying where you left them among their scattered coppers, through a garden full of screaming peacocks, where the hounds sleep on through all of it, paws twitching, up your rope and over the wall. Behind you, the black tower burns like a torch over Shadizar.` }] },
], else: [
  { if: 'won:c1-hounds', then: [{ say: `Down the Moon Stair three steps at a time, through a hall where the glass cases are bursting in the heat, out past the two guards, still snoring across their broken table, through a garden full of screaming peacocks and two dead hounds in the black roses, up your rope and over the wall. Behind you, the black tower burns like a torch over Shadizar.` }], else: [{ say: `Down the Moon Stair three steps at a time, through a hall where the glass cases are bursting in the heat, out past the two guards, still snoring across their broken table, through a garden full of screaming peacocks, where the hounds sleep on through all of it, paws twitching, up your rope and over the wall. Behind you, the black tower burns like a torch over Shadizar.` }] },
] }];

const TAKE_HEART = [
  { set: 'c1-took-heart' },
  { sfx: 'heartbeat' },
  { say: `You reach into the iron man's open chest. The silver wires part for your fingers like the strings of a harp. The jewel comes free into your hands: heavy as a melon, warm, and *beating*.` },
  { give: 'starheart' },
  { scene: { img: 'starheart', text: `The Starheart beats in your hands, blue-white, warm as a living thing.\n\nA strange strength floods up your arms with every beat. You could swear you can feel the stars wheeling overhead.` } },
  { line: ['iron-watcher', `Good. It knows you. It will lend you its fire, a little, while you carry it.`] },
  { toast: 'Brannoc can use Starfire while he carries the Starheart.' },
  { line: ['iron-watcher', `The Isle of the Iron Dead. Where the stars drown. Do not let the serpent have it. Do not let it... go out...`] },
  { say: `The blue light in its lenses dims to an ember, and then to nothing. The iron head sinks onto its chest. The hum that has filled Shadizar for a month stops, and the silence is enormous.` },
  bant('c1-b-dead', 'shevra', `It said "please" with its eyes, Bear. I've never seen iron say please.`),
  { line: ['brannoc', `Crom keep you, iron man. Whatever god you had.`] },
  { pause: true },
  { sfx: 'door' },
  { say: `Behind you, the black glass door hisses open. A man in cloth of gold stands in the moonlight, rings on every finger, a staff of brass in one hand. Something long and brass and jointed unwinds from the stair behind him.` },
  { line: ['azhrim', `Thieves. In my Crown. Touching my *Watcher*.` ] },
  { line: ['azhrim', `Do you know what you've done, you hairy ape? Three hundred years it talked to me. *Three hundred years.* And you've killed my conversation.`] },
  { line: ['brannoc', `It asked me to.`] },
  { line: ['azhrim', `It asked *everybody*. I'll have that heart back, and I'll have you stuffed and put in the garden, and the girl I'll keep in a box.`] },
  { line: ['shevra', `I don't *fit* in boxes.`] },
  { line: ['azhrim', `You'd be surprised what fits.`] },
  { fight: { ...azhrimFight, win: [
    { set: 'c1-azhrim-down' },
    { say: `Azhrim staggers back against the frame of chains, clutching at the wound in his silks. His brass staff falls, rolls, and cracks against the green glass. Blue fire leaks from it, then white, then red, crawling up the chains and the bronze frame and the old dry tapestries.` },
    { line: ['azhrim', `My collection... my *collection*...`] },
    { sfx: 'rumble' }, { shake: true },
    { scene: { img: 'bg-tower-crown@fire', text: `The Crown burns. The green windows burst with a sound like the sky breaking. Azhrim crawls toward the flames, toward his treasures, and the floor of the Crown folds and takes him down with it.\n\nYou run.` } },
    { refresh: true },
    ...ESCAPE_RUN,
    { say: `You drop off the wall into the dark of the lane and stop for ten heartbeats, chests heaving. Shevra binds your cuts with strips torn off one of Azhrim's tapestries and tips something from a little silver flask down your throat. It tastes like a lie and works like a miracle.` },
    { line: ['shevra', `Collector's own medicine. I kept a bottle back from his niche, for emergencies. You, Bear, are a walking emergency.`] },
    { sfx: 'heal' }, { heal: true },
    { goto: 'c1-alley' },
  ] } },
];

// Back in the Back Alleys after the tower burns: Tullia's ambush (runs from the alley's `enter`).
const TULLIA_AMBUSH = [
    { scene: { img: 'bg-alley@night', text: `The Back Alleys, past midnight. Patched and panting, the Starheart thumping against your ribs under your cloak, you round the last corner.\n\nAt the end of the alley stands Madam Tullia, in violet silk, with all four of her red sashes. And behind them, hooded men who smell of myrrh.` } },
    { line: ['tullia', `Darling! You actually did it. I'm *so* sorry about this part.`] },
    { line: ['shevra', `Tullia. You *sow*.`] },
    { line: ['tullia', `Nothing personal, sweet. A better offer came along, and my new friends want the jewel and no witnesses. Hand it over, Cimmerian, and you die quickly. Hold on to it, and you die *slowly*. Either way, you die.`] },
    { line: ['brannoc', `Come and take it.`] },
    { fight: { ...escapeFight, win: [
      { scene: { img: 'bg-alley@night', text: `When the smoke clears, the alley is empty but for scorched cobbles, a dropped knife, and a single violet slipper. Tullia is gone.\n\nAn old man shuffles out of the smoke: a wizened Khitan in a robe embroidered with cranes, leaning on a black staff and wheezing like a bellows.` } },
      { line: ['ptahk', `Oh, my knees. My *knees*. Nobody tells you, when you learn the great fire, that you'll have to bend down to throw it.`] },
      { line: ['brannoc', `Who are you?`] },
      { line: ['ptahk', `Ptahk, of Khitai, sorcerer, scholar, and, tonight, your savior. Don't thank me. Nobody does.` ] },
      { line: ['ptahk', `That trinket under your cloak screams loud enough for every sorcerer from here to Khitai. You heard Tullia. Nemedian knives, Zamorian gold, Stygian prayers: somebody paid a great deal for you tonight, barbarian. They will pay more tomorrow. Walk with me, or die stupid.`] },
      { line: ['shevra', `How do you know what's under his cloak?`] },
      { line: ['ptahk', `Child, the whole *city* knows. The tower's on fire.`] },
      { join: 'ptahk', level: 6 },
      { line: ['ptahk', `Now. Let me guess: the iron man asked you to take it to the Isle of the Iron Dead. They always ask that. Oh, don't look at me like that; I've read the old books. The Isle is real. It lies off the Black Coast, and no map shows it, and no sane captain sails there.`] },
      { line: ['brannoc', `Then we find an insane one.`] },
      { line: ['ptahk', `Spoken like a Cimmerian. Messantia, on the coast of Argos. Every mad captain in the world drinks in Messantia, sooner or later. It's a long walk. My knees will hate every step of it.`] },
      { line: ['shevra', `Here, old man. A fig. I stole it from Tullia's bowl on the way out. You look like you haven't eaten in a week.`] },
      { line: ['ptahk', `Keep it, child. My stomach is older than your country, and twice as particular.`] },
      { line: ['shevra', `Suit yourself. Bear? Want to carry the heart, or should I?`] },
      { line: ['ptahk', `Let the barbarian carry it. Young hands. Old hands drop things.`] },
      { set: 'c1-done' }, { quest: ['ch1-main', 10] },
      { scene: { img: 'bg-street', text: `By dawn the Collector's tower is a smoking stump, and three travelers are walking out of the Desert Gate, past a guard who doesn't blink: a Cimmerian with a beating star under his cloak, a thief counting her new fig, and an old sorcerer complaining about the sand.\n\nBehind them, under the city's floor, something very old turns over in its sleep.` } },
      { chapter: 'ch2' },
    ] } },
];

// The pickpocket fight is to the death (the log says "slain"), so the epilogue says so too.
const PICKPOCKET_WIN = [
  { set: 'c1-ledger-got' },
  { say: `The pickpocket won't be lifting anything from anyone again, and his friend with the cudgel has whistled his last. Fat Ommo's ledger lies in the gutter between them, a little muddy, a little bloody, and every page still full of other people's debts.` },
  bant('c1-b-pickdead', 'shevra', `Ommo won't mind the stains, Bear. He'll just add them to somebody's bill.`),
  { if: 'quest:e-ledger<1', then: [{ quest: ['e-ledger', 1] }] },
];

// ---------------------------------------------------------------- the Pit
const PIT = {
  5: { id: 'c1-pit-5', enemies: ['sand-rat', 'sand-rat'], intro: `Rank five: the Sand Rats!`,
    pre: `The gate grinds up. Two wiry youths in loincloths slink onto the sand, nets over their shoulders, clubs in their fists, grinning with too many gaps. The crowd boos them happily.`,
    win: [{ quest: ['sq-pit', 1] }, { gold: 40 }, { line: ['doru', `The Cimmerian takes rank five! Forty gold, my friend, and the crowd's eternal love, which lasts about a week.`] }] },
  4: { id: 'c1-pit-4', enemies: ['kothian-twin', 'kothian-twin'], intro: `Rank four: the Kothian Twins!`,
    pre: `Two lean swordsmen stride out in matching scarlet, each the other's mirror, even to the scars. They salute the crowd as one, then you as one, then raise their blades as one.`,
    triggers: [{ when: 'dead', enemy: 'kothian-twin', do: [{ say: `The surviving twin howls his brother's name and comes at you like a storm.` }, { buff: { target: 'enemies', stat: 'atk', amount: 0.25 } }] }],
    win: [{ quest: ['sq-pit', 2] }, { gold: 80 }, { give: 'pit-gauntlets' }, { line: ['doru', `Rank four falls! Eighty gold, and the Pit Gauntlets, stained with the blood of better men than you. Well. Previous men.`] }] },
  3: { id: 'c1-pit-3', enemies: ['wolf', 'ghaul', 'wolf'], intro: `Rank three: Ghaul the Hyrkanian and his wolves!`,
    pre: `A squat Hyrkanian in a fur hat stalks out, bow already strung, two grey steppe wolves pacing at his heels. He spits on the sand. "No horse," he growls. "They take my horse. So now I shoot *you*."`,
    win: [{ quest: ['sq-pit', 3] }, { gold: 150 }, { give: 'hyrkanian-bow' }, { line: ['doru', `Rank three! A hundred and fifty gold and the Hyrkanian's own bow! Cimmerian, you're the talk of Shadizar. Two ranks left, and those two are monsters. Come back when you're a legend.`] }] },
};

function pitFight(rank) {
  const p = PIT[rank];
  return [
    { say: p.pre },
    { fight: { id: p.id, enemies: p.enemies, arena: true, noFlee: true, intro: p.intro, triggers: p.triggers,
      win: p.win,
      lose: [{ line: ['doru', `And the Cimmerian is DOWN! The sand doesn't care, friend. My surgeons will have you sewn up by supper. Try again when you're ready.`] }] } },
  ];
}

const MIRRORS_SOLVED = [{ if: 'var:c1-mirrors-ok>=1 & !flag:c1-mirrors-done', then: [
  { say: `Moonlight pours through the east window onto the first mirror, leaps south to the second, strikes the third, and blazes north toward the palace dome... and in its path stands the door of black glass. The glass drinks the light. It glows silver. Without a sound, it swings open on a stair that climbs into the Crown.` },
  { set: 'c1-mirrors-done' }, { sfx: 'sting-solved' }, { xp: 30 }, { quest: ['ch1-main', 9] }, { refresh: true },
  { if: 'party:shevra', then: [{ line: ['shevra', `"Moon bows to the East, then the River, then the Throne." I *love* a mad painter.`] }] },
] }];

// ---------------------------------------------------------------- rooms
const rooms = {
  // ------------------------------------------------ The Desert Gate
  'c1-gate': {
    ...ROOM['c1-gate'],
    desc: [
      { text: `The Desert Gate of Shadizar squats in the dunes like a fat man guarding his supper: two towers of honey-colored stone, a gate studded with bronze, and above it the city rising in domes, minarets and lies. The smell reaches you before the shade does. Perfume, dung, roasting lamb. Money.` },
      { if: '!flag:c1-gate-open', text: `A bored guard leans on his spear in the gateway. A dead camel lies by the road, its saddlebag still strapped on. Behind you, the desert you crossed shimmers and says nothing.` },
      { if: 'flag:c1-gate-open', text: `The gate stands open. The guard has gone back to the serious business of leaning on his spear. Jackals still nose along the dunes, if a man wanted a pelt or a fight.` },
    ],
    exits: {
      n: { to: 'c1-street', if: 'flag:c1-gate-open', blocked: `The guard lowers his spear across the gateway. "Toll first, Cimmerian."` },
    },
    first: [
      { line: ['brannoc', `Food first. Then work. Then more food.`] },
      { say: `*(Tap anything here to Look at it, Take it, or Talk to it. When you want to move on, the exits are under Go.)*` },
    ],
    hunt: [['jackal'], ['jackal', 'jackal']],
    things: [
      {
        id: 'guard', name: 'Gate Guard', kind: 'person', portrait: 'generic-man',
        look: [
          { say: `A Zamorian guard in a gilded helmet two sizes too big, with the dead-fish stare of a man who has been bored since birth. His eyes are fixed on the horizon. He hasn't blinked since the last caravan, and he is proud of it.` },
          { set: 'c1-guard-studied' },
          { if: '!flag:c1-gate-open', then: [{ line: ['brannoc', `(I've out-stared wolves.)`] }] },
        ],
        talk: 'c1-guard',
        use: {
          'jackal-pelt': [{ if: 'flag:c1-gate-open', then: [{ say: `"I've a collar already, thanks. My wife wants a coat now. Come back with forty more."` }], else: [{ take: 'jackal-pelt' }, { line: ['guard-captain', `A pelt? Mangy. Smells like a dead Kothian. My wife will love it. In you go, Cimmerian, before I change my mind.`] }, { set: 'c1-gate-open' }, { sfx: 'gate-open' }, { quest: ['ch1-main', 2] }] }],
          'healing-draught': `"I'm not ill, I'm on *duty*." He looks at the draught a long moment anyway.`,
          '*': `The guard looks at it. "Is that coin? No? Then it isn't toll."`,
        },
      },
      {
        id: 'saddlebag', name: 'Saddlebag', if: '!flag:c1-saddlebag',
        look: `A leather saddlebag still strapped to the dead camel. Something has been worrying at the buckle with its teeth.`,
        take: [
          { set: 'c1-saddlebag' },
          { say: `You crouch by the camel and work the buckle loose. The shadow under the carcass growls. A jackal, all ribs and yellow teeth, comes out of it like a curse out of a priest.` },
          { fight: { id: 'c1-gate-jackal', enemies: ['jackal'], noFlee: true, intro: `A starving jackal defends its dinner!`,
            win: [
              { say: `The jackal won't be needing its pelt. The saddlebag holds three coppers, a bottle of something medicinal, and a love letter in Kothic that you can't read and wouldn't want to.` },
              { gold: 3 }, { give: 'healing-draught' },
              { say: `*(The pelt is in your Bag. The guard might have an opinion about it.)*` },
            ] } },
        ],
      },
      {
        id: 'camel', name: 'Dead Camel',
        look: `Dead three days, by the smell. The caravan it belonged to left it and kept walking; caravans bound for Shadizar are in a hurry to be robbed.`,
        take: `You are hungry. You are not *that* hungry. Not yet.`,
      },
      {
        id: 'toll-board', name: 'Toll Board',
        look: `A painted board nailed beside the gate:\n\n*TOLL. Two coppers a head. Five a camel. Ten a Kushite elephant. Twenty a Cimmerian.*\n\nUnder it, scratched fresh: *and worth it*.`,
        take: `It's nailed to the gate. So, by the look of the dark stain, was the last man who argued with it.`,
      },
      {
        id: 'city', name: 'The City',
        look: `Over the wall rises Shadizar the Wicked: gold domes, rose-pink towers, a thousand rooftop gardens dripping vines. One tower stands taller than the rest, a black needle off to the east with a crown of green glass. Even from here, in the dusk, you'd swear it *hums*.`,
        take: `Patience. You'll take the city one purse at a time.`,
      },
    ],
  },

  // ------------------------------------------------ Street of Lamps
  'c1-street': {
    ...ROOM['c1-street'],
    desc: [
      { text: `The Street of Lamps runs straight from the gate into the city's painted heart. Brass lamps hang from every balcony, lit even at noon, because in Shadizar it is a sin to be seen being poor. Litters sway past, carried by sweating Kushites; perfume-sellers shout; a man sells shade by the minute under a striped awning.` },
      { text: `West, a sign shows a gilded jackal with a wine cup: a tavern. East, the roar of the Bazaar. North, the street opens onto a square with a great statue.` },
    ],
    exits: { s: 'c1-gate', w: 'c1-tavern', e: 'c1-bazaar', n: 'c1-square' },
    first: [{ say: `Somebody's hand drifts toward your belt, finds nothing worth lifting, and drifts away in disgust. Welcome to Shadizar.` }],
    enter: [bant('c1-b-street', 'shevra', `Smile at the litters, Bear. Half of them are stolen and the other half are about to be.`)],
    things: [
      {
        id: 'beggar', name: 'Beggar', kind: 'person', portrait: 'generic-man',
        look: [{ if: 'quest:e-boots>=2', then: [{ say: `The old beggar sits proudly in his new boots, feet stuck out where everyone can admire them.` }], else: [{ say: `An old man in rags at the base of a lamp-post, with a tin cup and feet like two cracked loaves. The cobbles of Shadizar are hot enough to fry an egg, and his soles are black with blisters.` }] }],
        talk: 'c1-beggar',
        use: {
          'worn-boots': [
            { line: ['brannoc', `Here. Take these boots.`] },
            { line: ['beggar', `Boots! *Boots!* Real ones, with soles! Gods of thieves, I can feel my feet again! Here, big man, here. It's all I have that's worth anything. My lucky coin. Never brought me luck, but maybe it was waiting for you.`] },
            { take: 'worn-boots' }, { give: 'lucky-coin' }, { xp: 40 }, { quest: ['e-boots', 2] },
            { line: ['beggar', `And a story, free. My grandmother's grandmother said that the Nameless Thief came out of nowhere, out of the empty desert, with a star in his fist and the gold of a dragon on his back. And his face was a hill-man's face. A northerner. Like yours. Funny, eh? Who'd make a hill-man a founder?`] },
          ],
          '*': `The beggar squints at it. "Can't eat it, can't wear it. Bless you anyway, big man."`,
        },
        hot: 'item:worn-boots & quest:e-boots<2',
      },
      {
        id: 'lamps', name: 'Lamps',
        look: `Thousands of brass lamps, filigreed like a courtesan's jewelry, burning good oil in broad daylight. A lamplighter told you once that Shadizar burns more oil than Zamora drinks wine. He was drunk, so he may have been understating it.`,
        take: `You reach for one. Six shopkeepers look up at once, as one, like hawks. You let it be.`,
      },
      {
        id: 'litter', name: 'Silk Litter',
        look: `A litter swaying past on the shoulders of four slaves, hung with violet silk. Through a gap in the curtains, a fat merchant is being fed grapes by one girl and fanned by another while a third reads his accounts aloud. He looks miserable. Rich men in Shadizar always look miserable. They know who lives next door.`,
        take: `You could carry off the whole thing, merchant and all. Then you'd own a merchant. Nobody wants that.`,
      },
      {
        id: 'curse-seller', name: 'Curse-Seller', kind: 'person', portrait: 'generic-man',
        look: `A wizened Zamorian behind a tray of clay tablets. A painted sign promises *CURSES, BLESSINGS, ALIBIS*. Curses are cheapest.`,
        talk: [
          { say: `"Curse your enemy, stranger? Boils, two coppers. Faithless wife, five. Debtor's bad luck, ten." He leans close. "Or the old one. The oldest curse in Shadizar. *May the floor wake.* Nobody knows what it means. It works anyway."` },
          { line: ['brannoc', `What happens when the floor wakes?`] },
          { say: `The old man shrugs. "Nobody's ever stayed to find out. Ten coppers, and I carve it in a tablet for you."` },
          bant('c1-b-curse', 'shevra', `My grandmother said it at weddings. She was not invited back.`),
        ],
        use: { '*': `"I sell curses, I don't buy junk. Unless it's cursed. Is it cursed? No? Pity."` },
      },
    ],
  },

  // ------------------------------------------------ The Gilded Jackal
  'c1-tavern': {
    ...ROOM['c1-tavern'],
    desc: [
      { text: `The Gilded Jackal is low and dark and roaring. Smoke hangs under the beams like a second ceiling. Mercenaries dice, a Shemite girl dances on a table for nobody in particular, and a golden jackal statue on the bar watches it all with ruby eyes that have been stolen and replaced eleven times.` },
      { text: `Abulet the tavernkeeper polishes a cup behind the bar. A drunk poet weeps into his empty one in the corner.` },
      { if: '!party:shevra', text: `At a table by the wall a woman in dark leathers sits with her boots up, watching you over a cup of wine. She has been watching you since the door.` },
      { if: 'party:shevra', text: `A curtained door at the back leads to the Thieves' Den, for those who are welcome there.` },
    ],
    exits: {
      e: 'c1-street',
      w: { to: 'c1-den', if: 'party:shevra', blocked: `A one-eyed doorman in the back passage folds his arms. "Members only. You ain't a member. You ain't even a thief. You're a *wardrobe*."` },
    },
    enter: [bant('c1-b-tavern', 'shevra', `Home sweet home. Don't drink the green wine. Don't drink the red wine either.`)],
    things: [
      {
        id: 'abulet', name: 'Abulet', kind: 'person', portrait: 'abulet',
        look: `A round, bald Zamorian with a beard oiled into a point and a smile that has been asked to leave every temple in town. He sells wine, sausages and beds, and buys gossip at a fair price.`,
        talk: 'c1-abulet',
        use: { '*': `Abulet weighs it in his palm. "I'll give you nothing for it, and that's my best price."` },
      },
      {
        id: 'shevra', name: 'Woman in Leathers', kind: 'person', portrait: 'shevra', if: '!party:shevra',
        look: `Dark-eyed, dark-haired, lean as a whip, with a smile like a knife half out of its sheath. Her fingers never stop moving: rolling a coin across her knuckles, tapping the table, drifting to the knife at her hip. A Zamorian thief, or you're a Stygian.`,
        talk: 'c1-shevra',
        use: { '*': `She laughs. "Are you courting me with *that*? Sit down, big man. Talk first."` },
        hot: '!party:shevra',
      },
      {
        id: 'poet', name: 'Drunk Poet', kind: 'person', portrait: 'poet',
        look: `A thin young man in a velvet doublet gone shiny at the elbows. He has ink on his fingers, wine on his chin, and the look of a man who has rhymed *Shadizar* with *bizarre* and been punched for it.`,
        talk: 'c1-poet',
        use: { '*': `"Is it wine?" the poet asks hopefully. It is not wine. He weeps.` },
        hot: 'quest:ch1-main==7 & !flag:c1-joke',
      },
      {
        id: 'bucket', name: 'Scrap Bucket',
        look: `A wooden bucket by the kitchen door, full of bones, gristle and things that might once have been onions. Abulet sells the scraps to the dog-men of the Bazaar. The dogs of the Bazaar are fussier.`,
        take: [{ if: 'item:bone', then: [{ say: `One greasy bone is enough for anyone.` }], else: [{ give: 'bone' }, { say: `You fish out a big greasy bone. Abulet sees and doesn't care.` }] }],
      },
      {
        id: 'jackal-statue', name: 'Golden Jackal',
        look: `A gilded wooden jackal on the bar, the tavern's namesake. Its ruby eyes are glass. Everybody knows its ruby eyes are glass; that is why they are still there. A notch in its ear is where a Turanian once tested the gilt with his teeth.`,
        take: `It's nailed to the bar with a nail as long as your forearm. Abulet has met Shadizar before.`,
      },
      {
        id: 'dancer', name: 'Dancer', kind: 'person', portrait: 'generic-woman', noTake: true,
        look: `A Shemite girl dances on a table, coins sewn to her hips, scorn sewn to her face. The mercenaries throw copper. She catches it without looking and without missing a step.`,
        talk: [{ line: ['brannoc', `You dance well.`] }, { say: `"You talk badly," she says, without missing a step, and holds out a palm for a copper. You haven't got one to spare. She puts her heel down an inch from your fingers instead. The mercenaries cheer.` }],
      },
    ],
  },

  // ------------------------------------------------ Thieves' Den
  'c1-den': {
    ...ROOM['c1-den'],
    desc: [
      { text: `Behind the tavern, down six steps and through a curtain of beads, the Thieves' Den is a low vaulted cellar thick with smoke and secrets. Every table has a crooked game on it. Every wall has a hole in it, and every hole has an ear.` },
      { text: `On a heap of stolen cushions at the far end, enthroned like a toad on a lily-pad, sits Fat Ommo, the king of thieves, eating dates and sweating.` },
    ],
    exits: { e: 'c1-tavern' },
    enter: [bant('c1-b-den', 'shevra', `Don't touch anything, Bear. Everything here is somebody's, just not the person holding it.`)],
    things: [
      {
        id: 'ommo', name: 'Fat Ommo', kind: 'person', portrait: 'ommo',
        look: `Fat Ommo is less a man than a weather system: vast, damp and in a bad mood. He wears six rings on each hand and a seventh in his nose. He is tapping his fingers on an empty table where, by the dust-mark, a big book usually sits.`,
        talk: 'c1-ommo',
        use: {
          ledger: [
            { line: ['brannoc', `Here's your ledger.`] },
            { line: ['ommo', `My ledger! My beautiful, beautiful book! Let me see... yes... yes, and he didn't even read it, the illiterate little worm. Cimmerian, you are Ommo's friend now. That is better than gold, but here is gold too, so you can tell the difference.`] },
            { take: 'ledger' }, { gold: 30 }, { give: 'knucklebones' }, { xp: 40 }, { quest: ['e-ledger', 2] },
            { line: ['ommo', `And the knucklebones. You looked at them like a dog at a sausage. Take them. Start a war with somebody Ommo doesn't like. That is everybody.`] },
          ],
          '*': `Ommo sneers at it. "I fence gold, gems and secrets. Not rubbish. Rubbish I *employ*."`,
        },
        hot: 'item:ledger',
      },
      {
        id: 'dice-table', name: 'Dice Table',
        look: `Four cutthroats hunch over a game of knucklebones. Every few throws, somebody accuses somebody of cheating, a knife comes halfway out, and Fat Ommo clears his throat. The knife goes back. Ommo owns the dice. Ommo owns the knives. Ommo, you suspect, owns the cutthroats.`,
        take: `You reach for the dice. Four knives clear their sheaths. You decide you weren't reaching for the dice.`,
      },
      {
        id: 'sleeper', name: 'Sleeping Cutpurse',
        look: `A cutpurse snoring face-down on a table, with a fat purse hanging from his belt. It's bait. Everyone in the room is watching to see if you'll take it.`,
        take: [{ if: 'party:shevra', then: [{ line: ['shevra', `It's a test, Bear. The purse is full of lead and the man is wide awake. Hello, Tamuz.`] }, { say: `The "sleeping" cutpurse opens one eye. "Hello, Shevra."` }], else: [{ say: `Something tells you this purse is a test.` }] }],
      },
      {
        id: 'wanted', name: 'Wall of Faces',
        look: `A wall of crude portraits nailed up by the city watch, each with a price. Thieves in the Den move their own picture higher when the price goes up; it's a point of pride. One Kothian has been chiselled out entirely. "Hanged," says someone at your elbow. "Lower price than his brother. Never got over it."`,
        take: `You're not on it yet. Give it time.`,
      },
    ],
  },

  // ------------------------------------------------ The Bazaar
  'c1-bazaar': {
    ...ROOM['c1-bazaar'],
    desc: [
      { text: `The Bazaar of Shadizar is a riot under awnings: Vendhyan silks, Kothian wine, caged songbirds, idols of every god at a discount, and men who swear on all of them. Hasdrubal's armory gleams under a red awning. Old Nimm's apothecary hunches beneath dried herbs and lizards. A furrier's stall reeks of hides.` },
      { if: '!flag:c1-butcher-gone', text: `At the butcher's stall, a burly man hacks at a side of goat beneath a great iron hook, while a skinny yellow dog stares at the meat with the patience of a saint.` },
      { if: 'flag:c1-butcher-gone & !flag:c1-took-hook', text: `The butcher's stall is unattended. Somewhere off down the Bazaar you can hear a man howling at a dog. The great iron hook hangs over the empty block.` },
      { if: 'flag:c1-took-hook', text: `The butcher has come back, out of breath and short one hook, and is hanging his goat from a nail and a prayer.` },
    ],
    exits: { w: 'c1-street' },
    enter: [bant('c1-b-bazaar', 'shevra', `My favorite place in the city. Everything's for sale, and the rest is for stealing.`)],
    things: [
      {
        id: 'hasdrubal', name: 'Hasdrubal', kind: 'person', portrait: 'hasdrubal',
        look: `A Shemite armorer with a forked beard and forearms like hams, scarred from forty years at the forge. Ropes, swords, axes and maces hang from his awning. A sign reads: *NO HAGGLING. NO CREDIT. NO CIMMERIANS.* Somebody has scratched out the last line. Probably a Cimmerian.`,
        talk: 'c1-hasdrubal',
        use: { '*': `Hasdrubal doesn't even look up. "I sell. I don't buy. Furrier's next door."` },
      },
      {
        id: 'nimm', name: 'Old Nimm', kind: 'person', portrait: 'nimm',
        look: `A tiny, ancient woman in a cave of dried herbs, peering at the world through eyes like two milky moons. Jars line her shelves: *Lion's Fat. Kothian Nightshade. Tears of the Poppy.* She sniffs the air as you approach, and her nose wrinkles.`,
        talk: 'c1-nimm',
        use: { '*': `"I can smell that's not money," says Nimm.` },
      },
      {
        id: 'butcher', name: 'Butcher', kind: 'person', portrait: 'generic-man', if: '!flag:c1-butcher-gone | flag:c1-took-hook',
        look: `A butcher built like a bull, with a bloody apron and a cleaver he twirls like a dancer's fan. He keeps one eye on his meat and the other on the dog.`,
        talk: 'c1-butcher',
        use: { bone: `"You trying to sell me my own scraps? Go feed that to the dog. Gods know he's earned it."`, '*': `The butcher points his cleaver at it. "Buying or dying, stranger? That's neither."` },
      },
      {
        id: 'dog', name: 'Skinny Dog', if: '!flag:c1-butcher-gone',
        look: `A yellow cur, ribs like a harp, sitting by the butcher's block. He doesn't dare steal from the stall: the butcher's cleaver has an opinion. But he would sell his soul for a bone, and run to the ends of the earth with it.`,
        take: `The dog looks at you with such sadness that you put him down again.`,
        use: {
          bone: [
            { take: 'bone', quiet: true },
            { say: `You toss the bone. The dog catches it in mid-air and bolts, a yellow streak through the crowd, tail high as a banner.\n\nUnfortunately for the butcher, the dog takes the shortcut across his block and the best goat cutlet with it. The butcher roars, seizes his cleaver, and charges off into the Bazaar after him. "COME BACK HERE, YOU FLEA-BITTEN SON OF A KOTHIAN!"` },
            { set: 'c1-butcher-gone' }, { sfx: 'sting-solved' },
            bant('c1-b-dog', 'shevra', `That was beautiful. I may cry.`),
          ],
          sausage: `The dog eyes the sausage, then the butcher's cleaver, then you. "Not here," his eyes say. A bone he could run off with; a sausage he'd have to eat on the spot, under the cleaver.`,
          '*': `The dog sniffs it and sighs. It is not a bone.`,
        },
      },
      {
        id: 'hook', name: 'Meat Hook', if: '!flag:c1-took-hook',
        look: `A great iron meat hook hangs over the butcher's block, black with old blood. It's big enough to hang half a camel, and curved like the claw of something that ate dragons for breakfast. Rope would tie neatly to its eye.`,
        take: [{ if: 'flag:c1-butcher-gone', then: [{ give: 'meat-hook' }, { set: 'c1-took-hook' }, { say: `You lift the hook down and tuck it under your cloak. Nobody stops you. In Shadizar, carrying a stolen meat hook barely counts as a hobby.` }], else: [{ line: ['butcher', `Touch that hook, stranger, and you'll be hanging from it. Buying or dying?`] }, { sfx: 'refuse' }] }],
      },
      {
        id: 'furrier', name: 'Furrier', kind: 'person', portrait: 'generic-man',
        look: `A Hyrkanian in a hat made of something that was alive this morning. Pelts hang all round his stall: wolf, lynx, leopard, and a suspicious number of cats.`,
        talk: [{ say: `"Furs! Pelts! Hides!" The Hyrkanian looks you up and down. "Jackal pelts, I pay fifteen coppers. Good ones. Bad ones. Whatever. The ladies of Shadizar wear jackal this season. Next season they'll wear *me*."` }],
        use: {
          'jackal-pelt': [{ take: 'jackal-pelt', quiet: true }, { say: `The furrier sniffs the pelt, shrugs, and pays you fifteen coppers. "It will be a hat by sunset."` }, { gold: 15 }],
          '*': `"That's not fur," says the furrier. "I know fur. I'm *wearing* fur."`,
        },
      },
    ],
  },

  // ------------------------------------------------ Statue Square
  'c1-square': {
    ...ROOM['c1-square'],
    desc: [
      { text: `Statue Square is the city's crossroads, paved in cracked marble the color of old teeth. Water-sellers, pigeons, gawkers and pickpockets circle a dry fountain. Above them all rises the city's founder: the Nameless Thief, a giant of black stone with one fist raised to the sky.` },
      { text: `West, a crowd roars inside the walls of the Pit. East lies Temple Row. North, the Back Alleys burrow off toward the black tower. South, the Street of Lamps.` },
    ],
    exits: { s: 'c1-street', w: 'c1-pit', e: 'c1-temple-row', n: 'c1-alley' },
    enter: [bant('c1-b-square', 'shevra', `Bow to the Thief, Bear. It's bad luck not to. Also, people get stabbed for it.`)],
    things: [
      {
        id: 'statue', name: 'Statue of the Thief',
        look: [
          { scene: { img: 'statue-worn', text: `The Nameless Thief: a statue twice the height of a man, grimed with a thousand years of lamp-soot. He stands with his weight on one leg like a man about to run, a cloak over his shoulder, and in his raised fist he holds a star.\n\nSoot has smoothed his features to a ghost. All you can make out is a jaw like a Cimmerian's: square, stubborn, built to take a punch.` } },
          { set: 'c1-statue-seen' },
          { line: ['brannoc', `Hm. A hill-man's jaw.`] },
          bant('c1-b-statue', 'shevra', `They say he came out of nowhere and built the walls with a dragon's gold. They also say he never paid for anything. My kind of founder.`),
        ],
        take: `Even you can't lift a thousand years of history. Not without help.`,
        use: { '*': `You offer it to the Thief. The Thief, being stone, does not take it. First time in a thousand years.` },
      },
      {
        id: 'fountain', name: 'Dry Fountain',
        look: `A wide marble basin, dry for a century, where people come to toss coppers for luck and pigeons come for the crumbs. Its bottom is a drift of sand, feathers, pigeon droppings and things people have dropped. You could rummage through it, if you had a strong stomach.`,
        verbs: {
          Search: [{ if: 'flag:c1-specs-found', then: [{ say: `You rake through the muck again. Feathers, sand, a copper with a hole in it, and the leavings of ten thousand pigeons. Nothing more worth having.` }], else: [
            { set: 'c1-specs-found' }, { give: 'spectacles' },
            { say: `You climb into the basin and rake through the muck. Pigeon droppings. Seeds. A dead lizard. And there, half buried, a pair of spectacles with thick crystal lenses, one cracked, and wire arms bent from being stepped on.` },
            { if: 'quest:e-spectacles>=1', then: [{ quest: ['e-spectacles', 2] }] },
          ] }],
        },
        take: `It's a fountain. You'd need a cart. And a reason.`,
        hot: 'quest:e-spectacles==1',
      },
      {
        id: 'pigeons', name: 'Pigeons',
        look: `Fat Shadizar pigeons strut over the marble with the swagger of tax collectors. They have learned from the people. One of them is eating another one's crumb while looking it in the eye.`,
        take: `You lunge. The pigeons rise in a cloud, circle once, and land on the statue's head to laugh at you.`,
      },
      {
        id: 'crier', name: 'Town Crier', kind: 'person', portrait: 'generic-man',
        look: `A man with a brass horn and a voice like a falling wall, bawling the news of the day for a copper a sentence.`,
        talk: [
          { say: `"HEAR YE! The King of Zamora has a cold! Bread up a copper! The Collector's tower HUMMED again last night, and the Collector has offered a reward for the man who stops putting rumors about it in my mouth! The PIT fights tonight: Doru presents Khalla the Unbroken, undefeated in forty bouts! And a reward for the return of a LEDGER to a certain FAT GENTLEMAN, no questions asked!"` },
          { line: ['brannoc', `How much was that?`] },
          { say: `"Six coppers. For you, free. You look like you'd make it free anyway."` },
        ],
        use: { '*': `"I announce news. That is not news."` },
      },
    ],
  },

  // ------------------------------------------------ The Pit
  'c1-pit': {
    ...ROOM['c1-pit'],
    desc: [
      { text: `The Pit is a bowl of sand sunk in a ring of stone benches, stained brown in a hundred places that nobody bothers to rake. The crowd is half drunk and half bankrupt and wholly delighted. Above the gate a slate lists tonight's bouts and the odds, which change every time someone bleeds.` },
      { text: `Doru the Lanista works the crowd with a ledger and a smile. In a corner of the sand, a tall woman with a greatsword is cutting the head off a straw man, again and again, without breaking a sweat.` },
    ],
    exits: { e: 'c1-square' },
    enter: [bant('c1-b-pit', 'shevra', `I'll bet against you the first time, Bear. For luck. Yours, not mine.`)],
    things: [
      {
        id: 'doru', name: 'Doru the Lanista', kind: 'person', portrait: 'doru',
        look: `Doru is a sleek Corinthian in a toga with gold borders, a stylus behind his ear and a ledger under his arm. He has the smile of a man who has never once lost money on a fight and never once fought.`,
        talk: 'c1-doru',
        use: { '*': `Doru waves it away. "In the Pit, friend, we fight with what we're given. Arena rules: no potions, no tricks, no fleeing."` },
        hot: 'quest:sq-pit==0 & level>=2 | quest:sq-pit==1 & level>=4 | quest:sq-pit==2 & level>=5',
      },
      {
        id: 'khalla', name: 'Khalla the Unbroken', kind: 'person', portrait: 'khalla',
        look: `Khalla the Unbroken is a head taller than most men and wears her scars like jewelry. Her greatsword is as long as she is. She cuts the straw man in two, sets it up, cuts it again: the same stroke, every time, to the width of a hair. Forty bouts, the slate says. Forty wins.`,
        talk: 'c1-khalla',
        use: { '*': `Khalla glances at it, then at you. "No."` },
      },
      {
        id: 'slate', name: 'Betting Slate',
        look: [{ if: 'quest:sq-pit>=3', then: [{ say: `The slate has your name chalked high now, three ranks up: *THE CIMMERIAN*, with the odds against you shrinking every night. Only two names stand above: the Iron Bull of Turan, and Khalla.` }], else: [{ say: `A great slate over the gate lists the ranks of the Pit, from five at the bottom to one at the top:\n\n*5. The Sand Rats. 4. The Kothian Twins. 3. Ghaul the Hyrkanian. 2. The Iron Bull of Turan. 1. Khalla the Unbroken.*\n\nSomebody has chalked "CIMMERIAN?" at the very bottom, with odds of forty to one.` }] }],
        take: `You'd need a wagon and a team of oxen. And then everyone would know.`,
      },
      {
        id: 'crowd', name: 'The Crowd', noTake: true,
        look: `Zamorian nobles in silk boxes, mercenaries on the benches, beggars on the walls, and in the very back row a priest of Mitra pretending he isn't there. Shadizar's only democracy is the Pit: everyone can lose money here.`,
      },
    ],
  },

  // ------------------------------------------------ Temple Row
  'c1-temple-row': {
    ...ROOM['c1-temple-row'],
    desc: [
      { text: `Temple Row is where Shadizar keeps its gods, and it keeps a great many of them, in case one is out. Bel, the god of thieves, has the biggest temple, its doors carved with grinning faces and its steps crowded with the faithful, who are robbing each other. Next to it, a squat shrine of black stone breathes incense and hisses with serpent-carvings.` },
      { text: `A huddle of scholars argues on the steps of a library. Over the rooftops to the north, the Collector's black tower looks down on all of them.` },
    ],
    exits: { w: 'c1-square', n: 'c1-tower-wall' },
    enter: [bant('c1-b-temple', 'shevra', `Bel's my god. Thief of the gods. He stole fire, then sold it back to them at a markup.`)],
    things: [
      {
        id: 'bel-priest', name: 'Priest of Bel', kind: 'person', portrait: 'bel-priest',
        look: `An old, old priest of Bel sits on the temple steps in a robe that has been patched so often there is no original robe left, only patches. He has quick eyes and no purse; he says a man with no purse has nothing to lose but his soul, and Bel doesn't want that either.`,
        talk: 'c1-bel',
        use: { '*': `The old priest smiles. "An offering? Bel accepts only what's been stolen. Is it stolen?" You admit it isn't. "Then keep it till it is."` },
      },
      {
        id: 'set-shrine', name: 'Shrine of Set',
        look: [
          { say: `A squat black shrine of the serpent god Set, out of Stygia. Bronze snakes coil up its doorposts with their mouths open, and the smoke from inside smells of myrrh and something rotten underneath. Two hooded men stand in the doorway, watching the street. They watch you particularly. They watch the black tower even more.` },
          bant('c1-b-set', 'shevra', `Stygians. They bought that shrine with gold so old it had pharaohs on it. Nobody knows where they get it. Nobody asks twice.`),
        ],
        take: `The two hooded men lay hands on their curved knives. You decide to take a walk instead.`,
        use: { '*': `A hooded man hisses at you. You hiss back. Neither of you is impressed.` },
      },
      {
        id: 'scholar', name: 'Scholar', kind: 'person', portrait: 'generic-man',
        look: [{ if: 'quest:e-spectacles>=3', then: [{ say: `The scholar is reading happily now, nose six inches from the page, spectacles firmly on.` }], else: [{ say: `A young scholar in an ink-stained robe, squinting desperately at a scroll held an inch from his nose. He keeps holding it up to people and asking them what it says.` }] }],
        talk: 'c1-scholar',
        use: {
          spectacles: [
            { line: ['brannoc', `Are these your spectacles?`] },
            { line: ['scholar', `My spectacles! Oh! Oh, you're *enormous*. Thank you, friend. Thank you. Here, take this, for your trouble, and a note: my wife's grandmother is Old Nimm the apothecary, and she trusts nobody but me. This says you're honest. In writing. She'll sell you anything now.`] },
            { take: 'spectacles' }, { gold: 15 }, { xp: 40 }, { set: 'c1-specs-done' }, { quest: ['e-spectacles', 3] },
          ],
          '*': `The scholar holds it up to his nose. "Is it... a turnip?" It isn't.`,
        },
        hot: 'item:spectacles',
      },
      {
        id: 'scholars', name: 'Arguing Scholars', noTake: true,
        look: `Four bearded scholars of the library argue on the steps. You catch pieces of it: "...a bronze idol that *weeps oil*, I tell you, chained in the Collector's crown..." "...idols don't weep, Ptolon, idols are *bronze*..." "...my cousin carried the Collector's laundry, and he heard it *speak*..." "...your cousin is a drunk..." "...then how did he know it spoke Stygian *wrong*?"`,
        talk: [{ line: ['brannoc', `Which of you knows about the tower?`] }, { say: `All four of them do, at once, loudly, and none of them agree. After a while the argument turns to whether you're a Cimmerian or an Aesir. You leave them to it. It sounds like it'll go on until the stars burn out.` }],
      },
      {
        id: 'mitra-shrine', name: "Mitra's Little Shrine",
        look: `Squeezed between Bel's temple and the Stygian shrine is a tiny white shrine of Mitra, the god of honest men. It's empty. A single lamp burns there, tended by nobody you can see. In Shadizar, honesty is a minority faith.`,
        take: `Even in Shadizar, nobody robs Mitra's lamp. Nobody's that poor.`,
      },
    ],
  },

  // ------------------------------------------------ Back Alleys
  'c1-alley': {
    ...ROOM['c1-alley'],
    bg: [{ if: 'flag:c1-azhrim-down', bg: 'bg-alley@night' }, { bg: 'bg-alley' }],
    desc: [
      { text: `The Back Alleys are where Shadizar keeps what it doesn't want seen: a maze of crooked lanes so narrow the balconies kiss overhead, washing hanging like flags of surrender, gutters running with things best left unnamed. Doors open a crack as you pass, and close.` },
      { text: `West, a tall house with a blue door and perfumed lamps: Madam Tullia's. East, the lane climbs to the foot of a great wall and, above it, the Collector's black tower. South lies Statue Square.` },
    ],
    exits: {
      s: 'c1-square',
      w: { to: 'c1-tullia', if: 'party:shevra', blocked: `Two hard men in red sashes block the blue door. "Madam Tullia receives by introduction only. You're not introduced. You're barely *dressed*."` },
      e: 'c1-tower-wall',
    },
    first: [
      { say: `You've gone ten steps when a big man steps out of a doorway with a cudgel, and another ten when he realizes you're bigger.` },
      { fight: { id: 'c1-alley-boots', enemies: ['thug'], noFlee: true, intro: `An alley bravo wants your purse!`,
        win: [
          { say: `The bravo leaves in a hurry, without his dignity, his cudgel or his boots. Good boots, too: worn but whole. You pick them up.` },
          { give: 'worn-boots' },
        ] } },
    ],
    enter: [
      { if: 'flag:c1-azhrim-down & !flag:c1-done', then: TULLIA_AMBUSH },
      bant('c1-b-alley', 'shevra', `Watch the rooftops. Watch the doors. Watch me, if you want, but don't get used to it.`),
    ],
    ambush: { chance: 0.25, groups: [['thug'], ['thug', 'thug']], text: `Bravos burst from a doorway!`, if: '!flag:c1-azhrim-down' },
    things: [
      {
        id: 'pickpocket', name: 'Jumpy Pickpocket', kind: 'person', portrait: 'generic-man', if: '!flag:c1-ledger-got',
        look: [
          { say: `A twitchy little man in a grey hood, loitering by a rain barrel. He keeps checking over his shoulder and patting his shirt, where something square and heavy as a brick is stuffed down the front: a big leather-bound book.` },
          bant('c1-b-pick', 'shevra', `That's Fat Ommo's ledger down his shirt, or I'm a nun. He's jumpy because he knows what Ommo does to people. Want me to lift it?`),
        ],
        talk: [
          { line: ['brannoc', `What's in your shirt?`] },
          { line: ['pickpocket', `M-my heart, sir! A big heart. Very square. Family trait.`] },
          { say: `He puts two fingers in his mouth and whistles. Down the alley, a door bangs open.` },
          { fight: { id: 'c1-pickpocket', enemies: ['pickpocket', 'thug'], noFlee: true, intro: `The pickpocket's friend comes running with a cudgel!`,
            win: PICKPOCKET_WIN } },
        ],
        verbs: {
          Steal: [{ if: 'party:shevra', then: [
            { line: ['shevra', `Watch and learn, Bear.`] },
            { say: `Shevra strolls past the pickpocket, trips on nothing, falls against him, apologizes sweetly, and strolls on. The pickpocket pats his shirt, finds it flat, and turns pale. By the time he looks up, Shevra is beside you with a big leather ledger under her arm.` },
            { sfx: 'steal' }, { give: 'ledger' }, { set: 'c1-ledger-got' },
            { line: ['shevra', `Amateur. Never steal from Fat Ommo unless you're going to steal from everyone, so nobody can tell it was you.`] },
            { xp: { as: ['pickpocket', 'thug'] } },
            { if: 'quest:e-ledger<1', then: [{ quest: ['e-ledger', 1] }] },
          ], else: [{ say: `You're a big man with big hands. Picking pockets is not your gift. Grabbing people by the throat is, but he'd see you coming.` }] }],
          Grab: [
            { say: `You lunge for the pickpocket. He squeals and whistles, and his friend with the cudgel comes running.` },
            { fight: { id: 'c1-pickpocket', enemies: ['pickpocket', 'thug'], noFlee: true, intro: `The pickpocket's friend comes running with a cudgel!`,
              win: PICKPOCKET_WIN } },
          ],
        },
        use: { '*': `The pickpocket backs away from it. "I don't want trouble! I've got enough trouble! I've got a *big* trouble, right here, down my shirt!"` },
      },
      {
        id: 'graffiti', name: 'Scrawled Curse',
        look: `On a wall, in letters as tall as a child, someone has painted the oldest curse in Shadizar: *MAY THE FLOOR WAKE*. Underneath, in a smaller hand: *and eat the landlord first*.`,
        take: `You can't take a wall. You can't really take a curse either, though plenty of folk in this city would sell you one.`,
      },
      {
        id: 'hooded', name: 'Hooded Watcher', kind: 'person', portrait: 'generic-man', noTake: true, if: '!flag:c1-hooded-gone',
        look: [
          { say: `In a doorway, a man in a dark hood leans and watches you. When you look straight at him he is suddenly not there, and only the smell of myrrh remains. The same myrrh as the black shrine on Temple Row.` },
          { set: 'c1-hooded-gone' }, { refresh: true },
          bant('c1-b-hood', 'shevra', `Stygian. They've been sniffing round these alleys for a month. Like dogs round a butcher's.`),
        ],
        talk: [{ line: ['brannoc', `You. What do you want?`] }, { say: `The doorway is empty. Only the smell of myrrh remains, the same as the black shrine on Temple Row.` }, { set: 'c1-hooded-gone' }, { refresh: true },
          bant('c1-b-hood', 'shevra', `Stygian. They've been sniffing round these alleys for a month. Like dogs round a butcher's.`)],
      },
      {
        id: 'tower-view', name: 'The Black Tower',
        look: `Above the rooftops to the east looms the Collector's tower, a black needle of basalt crowned with green glass. At this distance you can feel it as much as hear it: a hum in the soles of your feet, like a great slow heart.`,
        take: `That's what you're here for. Not from down here.`,
      },
    ],
  },

  // ------------------------------------------------ Tullia's House
  'c1-tullia': {
    ...ROOM['c1-tullia'],
    desc: [
      { text: `Madam Tullia's house is a jewel box turned inside out: silk on the walls, carpets three deep, braziers of rose incense, and everywhere *things*, every one of them stolen and every one of them beautiful. A painting of the moon fills one wall. A caged nightingale sings in a cage of gold wire.` },
      { text: `Madam Tullia reclines on a couch like a cat on a sunny wall. Behind her, hard men in red sashes study the ceiling with professional boredom.` },
    ],
    exits: { e: 'c1-alley' },
    enter: [bant('c1-b-tullia', 'shevra', `Smile, say nothing, touch nothing. She counts the spoons after every guest. *Twice*.`)],
    things: [
      {
        id: 'tullia', name: 'Madam Tullia', kind: 'person', portrait: 'tullia',
        look: `A Nemedian woman of a certain age and a very uncertain reputation, in violet silk with rings on every finger and a smile honed sharper than any knife in her house. She has the best-fenced goods in Shadizar and the best manners, and you would trust her as far as you could throw her couch.`,
        talk: 'c1-tullia',
        use: { '*': `Tullia smiles indulgently. "Darling, I fence *treasure*. Bring me the Starheart and I'll pretend I never saw that."` },
        hot: '!flag:c1-job',
      },
      {
        id: 'painting', name: 'Painting of the Moon',
        look: [
          { say: `A vast painting of the moon, robed like a queen, stepping down a stair of silver. Above her, in gilt Nemedian letters: *MOON BOWS TO THE EAST, THEN THE RIVER, THEN THE THRONE.*\n\nIt's old, and it's good, and it's stolen. A brass plate says it was painted in Azhrim the Collector's tower, by a mad painter he kept there for twenty years.` },
          { set: 'c1-saw-painting' },
          bant('c1-b-painting', 'shevra', `The river runs south of the city; Throne means the King's palace, north, where throne-sitters look down on the rest of us. The painter must have been looking out of one of the tower's windows.`),
          { if: '!party:shevra', then: [{ line: ['brannoc', `East, the river, the throne. Hm.`] }] },
        ],
        take: `It's eight feet wide and the red sashes are watching. Commit it to memory instead.`,
      },
      {
        id: 'nightingale', name: 'Nightingale',
        look: `A tiny brown bird in a cage of gold wire, singing as if its heart would break. Tullia stole it from a Turanian prince. Tullia stole the cage from a second Turanian prince. The second prince is still looking for the first one.`,
        take: `You'd free it if it would leave. It won't. It's the only bird in Shadizar that's fed every day.`,
      },
      {
        id: 'red-sashes', name: 'Red Sashes', kind: 'person', portrait: 'generic-man', noTake: true,
        look: `Tullia's bodyguards: four hard Nemedian blades with red silk sashes and faces like closed doors. One has a fresh knife scar; another is missing an ear. They watch your hands. They particularly watch Shevra's.`,
        talk: [{ line: ['brannoc', `Evening.`] }, { say: `The one without an ear looks at you. The one with the scar looks at Shevra's hands. Neither says a word. Tullia pays them by the hour, and conversation isn't in the contract.` }],
      },
      {
        id: 'treasures', name: 'Stolen Treasures',
        look: `A jade elephant from Vendhya. A crown that belonged to a king of Koth until it didn't. A shrunken head with a gold ring through its nose. A golden lamp shaped like a whale. Every piece here was stolen at least once and sold at least twice.`,
        take: [{ if: 'party:shevra', then: [{ line: ['shevra', `Bear. *No*. We're guests. We steal from her later, like professionals.`] }], else: [{ say: `A red sash clears his throat.` }] }],
      },
    ],
  },

  // ------------------------------------------------ The Tower Wall
  'c1-tower-wall': {
    ...ROOM['c1-tower-wall'],
    desc: [
      { text: `The lane ends at the foot of the Collector's wall: smooth dark basalt, three times your height, seamless as glass. Not a crack, not a vine, not a foothold. At the top runs a lip of carved stone, scalloped like a row of teeth.` },
      { text: `Over it rises the black tower itself, impossibly tall, crowned with green glass. The hum is strong here. Your teeth feel it.` },
      { if: 'flag:c1-wall-climbed', text: `Your grapnel's rope hangs down the wall from the stone lip, ready for the climb.` },
    ],
    exits: {
      w: 'c1-alley', s: 'c1-temple-row',
      e: { to: 'c1-tower-garden', if: 'flag:c1-wall-climbed', blocked: `The wall is smooth as a temple floor and three times your height. Even Cimmerian fingers can find nothing to hold.`, label: 'Over the wall' },
    },
    enter: [bant('c1-b-wall', 'shevra', `Azhrim's wall. Forty thieves have tried it. Thirty-nine fell off. The fortieth is in his collection, they say. Stuffed.`)],
    things: [
      {
        id: 'wall', name: 'The Wall',
        look: `Smooth, black, high: no crack in it even a gecko could love. But at the top a lip of carved stone juts out like a row of teeth. Something with a hook on the end of a rope could catch on it.`,
        verbs: {
          Climb: [{ if: 'flag:c1-wall-climbed', then: [{ say: `Your rope is waiting. You'll climb it when you go east.` }], else: [
            { var: ['c1-climbs', 1] },
            { if: 'var:c1-climbs>=3', then: [{ say: `You eye the wall again. Your hands and backside remember the last two attempts.` }, { line: ['shevra', `Hook. Rope. *Bear*.`] }, { if: '!party:shevra', then: [{ line: ['brannoc', `Crom. A hook and a rope.`] }] }],
              else: [{ say: `You take a run, leap, get your fingers six feet up the smooth stone, and slide straight back down it, losing skin on the way. You land on your back in the gutter.` }, hurt(6), { sfx: 'hurt' }] },
          ] }],
        },
        take: `It's a wall. Walls are famously hard to take. Ask any army.`,
        use: {
          grapnel: [
            { take: 'grapnel', quiet: true },
            { say: `You whirl the grapnel twice round your head and let it fly. It sails over the lip, and you haul back: the hook bites into the carved stone teeth and holds. You put your weight on it. It holds that too.` },
            { set: 'c1-wall-climbed' }, { sfx: 'sting-solved' }, { xp: 20 }, { quest: ['ch1-main', 5] },
            bant('c1-b-grap', 'shevra', `Ladies first, Bear. And don't look up.`),
          ],
          rope: `You throw the rope at the wall. It comes back down. You need something on the end of it that will catch on that stone lip.`,
          'meat-hook': `You could throw the hook up there, but then you'd be standing here with no hook. Tie a rope to it first.`,
          '*': `You weigh it against the wall. The wall wins.`,
        },
        hot: 'item:grapnel',
      },
      {
        id: 'tower', name: 'The Tower',
        look: `The Collector's tower goes up, and up, black basalt banded with bronze, its windows few and narrow as arrow-slits, and at the top a crown of green glass that catches the sun like the eye of a god. The whole thing hums, deep and slow. It is not the wind. Towers don't hum.`,
        take: `One thing at a time.`,
      },
      {
        id: 'grate', name: 'Drain Grate',
        look: `An iron drain grate at the foot of the wall, crusted with filth. The bars are a hand's width apart: too narrow even for Shevra, and a mercy, because something down there is breathing.`,
        take: `It's rusted solid. And something down there is breathing.`,
      },
    ],
  },

  // ------------------------------------------------ The Tower Garden
  'c1-tower-garden': {
    ...ROOM['c1-tower-garden'],
    desc: [
      { text: `You drop into a garden as lush as a lie. Black roses, blue lotus pools, peacocks asleep in silver trees, and everywhere statues: a centaur, a Kushite king, a dragon in green marble. The air smells of jasmine and money.` },
      { if: '!flag:c1-hounds-done', text: `Between you and the tower's bronze door lie two hounds with jaws like bear-traps. One gnaws a joint of meat, slobbering. The other is watching you over it, and its lip is curling.` },
      { if: 'flag:c1-hounds-done & flag:c1-hounds-slept', text: `The two hounds snore by the door, legs twitching as they dream of chasing Cimmerians.` },
      { if: 'flag:c1-hounds-done & !flag:c1-hounds-slept', text: `The hounds won't be guarding anything again. The tower door stands unwatched.` },
    ],
    exits: {
      w: { to: 'c1-tower-wall', label: 'Back over the wall' },
      e: { to: 'c1-tower-hall', if: 'flag:c1-hounds-done', blocked: `You take a step toward the door. Both hounds rise without a sound, hackles up, and the bigger one shows you every tooth in his head. You take the step back.` },
    },
    enter: [bant('c1-b-garden', 'shevra', `Dogs eat anything, Bear. Even trouble. Especially trouble with something in it.`)],
    things: [
      {
        id: 'hounds', name: 'Hounds', if: '!flag:c1-hounds-done',
        look: `Two tower hounds, bred from Hyrkanian wolf and Kothian mastiff and bad intentions. Collars of spiked bronze. Jaws like bear-traps. One gnaws a joint of meat, slobbering; they've been fed, and they're still hungry. Dogs like that will eat anything that's thrown to them.`,
        verbs: {
          Fight: [
            { say: `You draw steel. The hounds don't bark. They just come.` },
            { fight: { id: 'c1-hounds', enemies: ['tower-hound', 'tower-hound'], noFlee: true, intro: `The tower hounds attack!`,
              win: [{ set: 'c1-hounds-done' }, { quest: ['ch1-main', 6] }, { say: `Two dead hounds lie in the black roses. Nobody in the tower comes to look. Perhaps hounds die here often.` }] } },
          ],
        },
        take: `You'd lose the hand. Possibly the arm.`,
        use: {
          'drugged-sausage': [
            { take: 'drugged-sausage', quiet: true },
            { say: `You toss the sausage underarm. The bigger hound snaps it out of the air and gulps it whole; the other fights him for the smell of it.\n\nThen they both sit down. Then they both lie down. The big one yawns, a long whining yawn full of teeth, puts his head on his paws, and begins to snore like a Kothian sergeant.` },
            { set: ['c1-hounds-done', 'c1-hounds-slept'] }, { xp: { as: ['tower-hound', 'tower-hound'] } }, { quest: ['ch1-main', 6] },
            bant('c1-b-hounds', 'shevra', `Sleep well, puppies. Dream of me.`),
          ],
          sausage: `You toss them the sausage. One hound swallows it whole, licks his chops, and looks at you for the next one with fresh interest. That only made them hungrier. If only there were something *in* it.`,
          'poppy-tears': `The hounds won't lick a bottle. They're dogs, not drunks. Put it in something they'd eat.`,
          bone: `You throw the bone. The hound with the joint of meat looks at it with contempt. These dogs eat better than you do.`,
          '*': `The hounds watch it with flat yellow eyes. It isn't food. It isn't you. They go back to watching you.`,
        },
        hot: 'item:drugged-sausage',
      },
      {
        id: 'meat-joint', name: 'Joint of Meat', if: '!flag:c1-hounds-done',
        look: `A whole leg of lamb, half eaten and slobbered over. Somebody feeds these dogs well. They eat whatever they're thrown, as fast as they can, the way dogs do when they don't trust their own brother.`,
        take: `Take a bone from a hound with jaws like that? You'd sooner take a kiss from Set.`,
      },
      {
        id: 'statues', name: 'Garden Statues',
        look: `Azhrim's statues are not carved. You realize it slowly: the centaur has real hair on its tail, the Kushite king has a real gold tooth, and the green marble dragon has a cobweb inside one nostril. They are *collected*. Some were living once. One statue, a man in thief's black, is caught forever mid-step, eyes wide, one hand reaching toward the tower.`,
        take: `You're not taking anything from this garden that used to breathe.`,
      },
      {
        id: 'lotus-pool', name: 'Lotus Pool',
        look: `A pool of blue lotus, so clear you can see the bottom. Gold coins carpet it, thrown in by guests for luck. Among them, white as pearls, lie the small bones of a hand.`,
        take: `You reach for the gold. Then you look at the hand, and you don't.`,
      },
    ],
  },

  // ------------------------------------------------ The Tower Hall
  'c1-tower-hall': {
    ...ROOM['c1-tower-hall'],
    desc: [
      { text: `The tower's great hall is a museum of greed. Glass cases line the walls, crammed with treasures from a hundred ruined kingdoms; tapestries of conquests nobody remembers; the stuffed head of a white ape over the hearth. A stair spirals down to darkness.` },
      { if: '!flag:c1-guards-done', text: `By the far wall, under a carved stone face, two guards in bronze scale sit at a little table playing knucklebones and accusing each other of cheating. One more cheat, by the look of them, and blood will flow.` },
      { if: 'flag:c1-guards-done', text: `The guards' table is overturned and the guards are in no state to guard anything. The carved stone face on the far wall looks down at you: a door, shaped like a smiling mouth, its lips shut tight.` },
    ],
    exits: {
      w: 'c1-tower-garden',
      d: { to: 'c1-undercroft', label: 'The stair down' },
      u: { to: 'c1-moon-stair', if: 'flag:c1-door-open', blocked: `The way up is through the Smiling Door, and the Smiling Door is shut, its stone lips pressed together.`, label: 'Through the Smiling Door' },
    },
    enter: [bant('c1-b-hall', 'shevra', `Look at all this. I could retire on one of those cases. I could retire *twice*.`)],
    things: [
      {
        id: 'guards', name: 'Guards', kind: 'person', portrait: 'generic-man', if: '!flag:c1-guards-done',
        look: `Two of the Collector's guards, in bronze scale armor that turns a sword's edge, gambling at a little table. They have a pile of coppers each, and each pile is shrinking toward the other. "That's a cheat." "Your *mother*'s a cheat." "Leave my mother out of it, she's a *better* cheat than you." One more cheat and blood will flow.`,
        talk: [
          { line: ['brannoc', `Evening.`] },
          { say: `"Shh," says the first guard without looking up. "He's cheating." "I'm *not*." "Then why'd you roll double vultures three times?" "Because the gods love me!" "The gods don't love anybody, Kemal."` },
          { say: `They haven't noticed you. They'll notice if you walk past them to the door, though; nobody is that interested in knucklebones.` },
        ],
        verbs: {
          Fight: [
            { say: `You clear your throat. The guards look up, see the Cimmerian in the Collector's hall, and reach for their spears together, the first thing they've agreed on all night.` },
            { fight: { id: 'c1-hall-guards', enemies: ['city-guard', 'city-guard'], noFlee: true, intro: `The Collector's guards attack!`,
              win: [{ set: 'c1-guards-done' }, { quest: ['ch1-main', 7] }, { say: `The guards lie among their scattered coppers. Bronze scale turns a blade, but not a Cimmerian with a grudge.` }] } },
          ],
        },
        use: {
          knucklebones: [
            { take: 'knucklebones', quiet: true },
            { say: `You stroll past their table and, as Kemal shakes the cup, drop Ommo's loaded knucklebones in with his. He throws. Double vultures. He throws again. Double vultures. The other guard stares at the bones, then at Kemal.\n\n"*Four* bones," he says softly. "You're playing with *four* bones."\n\nIt is very quick after that, and very loud. When it's over both guards are lying across the broken table, snoring through split lips, and neither noticed you at all.` },
            { set: ['c1-guards-done', 'c1-guards-brawled'] }, { sfx: 'blunt' }, { xp: { as: ['city-guard', 'city-guard'] } }, { quest: ['ch1-main', 7] },
            bant('c1-b-guards', 'shevra', `Ommo's bones. I'd know them anywhere. They've started more wars than Aquilonia.`),
          ],
          '*': `You could interrupt their game with that, but they'd stop squabbling with each other and start on you.`,
        },
        hot: 'item:knucklebones',
      },
      {
        id: 'door', name: 'Smiling Door',
        look: [
          { say: `The door is a great stone face set in the wall, with fat cheeks and a mouth as wide as a man is tall, its lips shut tight. Words are cut round the brow in old Zamorian: *I OPEN FOR ONE WHO MAKES ME SMILE.* Below the chin, the stone is pitted and scored with teeth marks. Most of them are human.` },
          bant('c1-b-door', 'shevra', `The poet at the Jackal swears he once made a statue laugh. I thought it was the wine talking. Maybe it wasn't.`),
        ],
        talk: [{ if: '!flag:c1-guards-done', then: [{ say: `You can't reach the door without walking straight through the guards' game of knucklebones. You'd be noticed. Deal with them first.` }], else: [{ if: 'flag:c1-door-open', then: [{ say: `The door is still grinning. It's open. It's happy. Leave it be.` }], else: [{ talk: 'c1-door' }] }] }],
        take: `It's a door in a wall in a tower. It's the most taken thing in the building, and still nobody has.`,
        use: { '*': `You hold it up to the stone face. The stone face is not amused. That's rather the problem.` },
        hot: 'flag:c1-guards-done & flag:c1-joke & !flag:c1-door-open',
      },
      {
        id: 'mace', name: "Kemal's Mace", if: 'flag:c1-guards-done & !flag:c1-took-mace',
        look: `Kemal's iron mace lies under the broken table where it fell. A sword skates off bronze scale; a mace makes it ring. A brass serpent would ring nicely too.`,
        take: [{ set: 'c1-took-mace' }, { give: 'iron-mace' }, { say: `You heft the mace. Good balance. Kemal won't miss it; Kemal won't remember his own name till Tuesday. *(A mace makes a good sidearm: Swap to it in battle.)*` }],
      },
      {
        id: 'cases', name: 'Display Cases',
        look: `Azhrim's collection, labeled in a fussy hand: *Comb of a Mermaid (Argos). Breath of a Kothian King (jar, sealed). Third Eye of a Vendhyan Saint (do not open). Left Boot of Bel (unauthenticated).* And one empty case, larger than the rest, its label scratched out and rewritten: *The Iron Man. Moved to the Crown. Too loud.*`,
        take: `The cases are warded. Little blue sparks crawl over the glass as your hand comes near. Shevra slaps your wrist anyway.`,
      },
      {
        id: 'ape-head', name: 'White Ape Head',
        look: `The stuffed head of a great white ape over the hearth, mouth open in a silent roar. A brass plate reads: *Taken in the Kezankian Hills by Azhrim the Collector, who had it brought to him alive, for the sake of the conversation.*`,
        take: `It glares at you. It may be dead, but it hasn't given up.`,
      },
    ],
  },

  // ------------------------------------------------ The Undercroft
  'c1-undercroft': {
    ...ROOM['c1-undercroft'],
    desc: [
      { text: `The stair ends in a vaulted undercroft hung with webs as thick as sailcloth. The tower's foundations are here, and they are not the tower's at all: the walls are built around a ring of standing stones, rough and grey and far older than Shadizar. They hum. Here, beneath the hum of the tower, is where the hum comes from.` },
      { if: 'won:c1-spider', text: `The great spider lies dead in its own webs, legs curled like a fist. In the far corner, half wrapped in silk, is a strongbox.` },
    ],
    exits: { u: 'c1-tower-hall' },
    first: [
      { say: `Something big moves in the webs overhead. It drops: a spider the size of a pony, glossy black, its eyes clustered like a bunch of evil grapes.` },
      { fight: { id: 'c1-spider', enemies: ['giant-spider'], noFlee: true, intro: `A giant spider drops from the dark!` } },
    ],
    enter: [bant('c1-b-under', 'shevra', `I hate spiders. I hate *stones* that hum. I hate this whole room, Bear.`)],
    things: [
      {
        id: 'stones', name: 'Standing Stones',
        look: `A ring of rough grey stones, each taller than you, older than any city. The tower's foundations have been laid over them like a lid on a pot. The hum lives in them. When you put your palm on one, your hand goes numb to the wrist, and for a heartbeat you see something that cannot be here: open sky, an empty valley, and smoke rising from a mountain.`,
        take: `They've stood here since before men had names. They'll stand a while longer.`,
      },
      {
        id: 'strongbox', name: 'Strongbox', if: 'won:c1-spider & !flag:c1-box-opened',
        look: `An iron strongbox wrapped in spider silk, with a dead thief's hand still on the lid. Whoever he was, he got this far.`,
        take: [{ set: 'c1-box-opened' }, { say: `You tear away the silk and pry the lid up. The thief who got here first left his whole haul: a purse of Zamorian gold, a dented iron cap, and two draughts in good stoppered glass.` }, { gold: 60 }, { give: 'iron-cap' }, { give: 'healing-draught', n: 2 }],
        verbs: { Open: [{ set: 'c1-box-opened' }, { say: `You tear away the silk and pry the lid up. The thief who got here first left his whole haul: a purse of Zamorian gold, a dented iron cap, and two draughts in good stoppered glass.` }, { gold: 60 }, { give: 'iron-cap' }, { give: 'healing-draught', n: 2 }] },
      },
      {
        id: 'webs', name: 'Webs',
        look: `Sheets of grey silk hang from the vaults, heavy with dust and old husks: rats, birds, a cat, and one shape far too big to be a cat. A tatter of black cloth hangs from it. Another thief who wanted the Starheart.`,
        take: `It sticks to your fingers, your sleeve and your temper. You stop trying.`,
      },
    ],
  },

  // ------------------------------------------------ The Moon Stair
  'c1-moon-stair': {
    ...ROOM['c1-moon-stair'],
    desc: [
      { text: `Behind the Smiling Door a stair of white marble climbs the inside of the tower in a slow spiral, washed silver by moonlight from three slit windows. Moonrise burns in the east window. To the south, through the second, the silver thread of the river winds through the dark. To the north, the third frames the dome of the King's palace, gold even by night.` },
      { text: `On the landing stand three great bronze mirrors on pivots, each the height of a man. At the top of the stair is a door of black glass with no handle. A niche holds a cabinet; a basin of clear water stands by the wall.` },
      { if: 'flag:c1-mirrors-done', text: `Moonlight leaps from mirror to mirror to mirror and strikes the black glass door, which stands open on a stair of light.` },
    ],
    exits: {
      d: 'c1-tower-hall',
      u: { to: 'c1-crown', if: 'flag:c1-mirrors-done', blocked: `The black glass door has no handle and no lock, only your own scowl looking back at you. The moonlight from the windows falls on the mirrors and goes nowhere.`, label: 'The Crown', noReturn: `The door to the Crown stands open. Whatever happens up there, there's no coming back down this stair: you'll leave Shadizar tonight, one way or another, and you won't see it again until the very end of this tale (Chapter V), when Fat Ommo and everyone else's errands will be long past mending. If you're hurt, drink from the Moon Basin first: Azhrim himself is up there.` },
    },
    first: [
      { say: `The hum is much louder here. It comes from above, slow and steady: *thrum... thrum... thrum*, like a giant's heart beating in the dark.` },
      { say: `It's quiet on the landing, the first quiet since the wall. No hounds, no guards, nothing breathing in the webs. A stone basin of moon-cold water stands by the wall, and somebody's medicine cabinet sits in a niche. A good place to catch your breath before whatever waits at the top.` },
      bant('c1-b-moon', 'shevra', `Tullia's painting. "Moon bows to the East, then the River, then the Throne." Mirrors, Bear. It's always mirrors with wizards.`),
    ],
    things: [
      {
        id: 'mirror1', name: 'First Mirror',
        look: [{ say: `A man-high disc of polished bronze on a pivot, nearest the windows, where the moonlight falls first.` }, { call: 'c1-mirror-look', args: { m: 1 } }],
        verbs: { Turn: [{ call: 'c1-turn', args: { m: 1 } }, ...MIRRORS_SOLVED], 'Turn back': [{ call: 'c1-turn', args: { m: 1, back: true } }, ...MIRRORS_SOLVED] },
        take: `It's bolted to its pivot, and bronze, and the size of a door. You can turn it, though.`,
        use: { '*': `The mirror reflects it back at you, doubled. Not helpful.` },
      },
      {
        id: 'mirror2', name: 'Second Mirror',
        look: [{ say: `The second bronze mirror stands in the middle of the landing, angled to catch light from the first and throw it on.` }, { call: 'c1-mirror-look', args: { m: 2 } }],
        verbs: { Turn: [{ call: 'c1-turn', args: { m: 2 } }, ...MIRRORS_SOLVED], 'Turn back': [{ call: 'c1-turn', args: { m: 2, back: true } }, ...MIRRORS_SOLVED] },
        take: `It weighs as much as an ox. You can turn it, though.`,
        use: { '*': `The mirror shows you yourself, holding a strange object. You look ridiculous.` },
      },
      {
        id: 'mirror3', name: 'Third Mirror',
        look: [{ say: `The third mirror stands by the door of black glass, its face engraved with a tiny dome: the King's palace, that you see through the north window.` }, { call: 'c1-mirror-look', args: { m: 3 } }],
        verbs: { Turn: [{ call: 'c1-turn', args: { m: 3 } }, ...MIRRORS_SOLVED], 'Turn back': [{ call: 'c1-turn', args: { m: 3, back: true } }, ...MIRRORS_SOLVED] },
        take: `It's bolted down. You can turn it, though.`,
        use: { '*': `You hold it up to the mirror. The mirror holds one up to you. Stalemate.` },
      },
      {
        id: 'windows', name: 'Slit Windows',
        look: `Three slit windows: the *east*, where the moon is rising fat and white over the desert; the *south*, where the river winds silver beyond the city wall; and the *north*, which frames the gold dome of the King's palace, where the throne-sitters look down on Shadizar.`,
        take: `You could just about squeeze an arm through. Not a Cimmerian.`,
      },
      {
        id: 'niche', name: 'Medicine Niche',
        look: [{ if: 'flag:c1-stash', then: [{ say: `The cabinet in the niche is empty now, apart from a smell of bitter herbs.` }], else: [{ say: `A cabinet in a niche, labeled in Azhrim's fussy hand: *FOR THE COLLECTOR'S DIGESTION.* Inside, three stoppered bottles of healing draught.` }] }],
        take: [{ if: 'flag:c1-stash', then: [{ say: `Empty. You've had his medicine already.` }], else: [{ set: 'c1-stash' }, { give: 'healing-draught', n: 3 }, { line: ['brannoc', `Azhrim's own medicine. Rude not to.`] }] }],
        hot: '!flag:c1-stash',
      },
      {
        id: 'basin', name: 'Moon Basin',
        look: [{ if: 'flag:c1-basin', then: [{ say: `The basin is dry now. You drank the moon.` }], else: [{ say: `A basin of white stone filled with water that holds the moon in it, very still. It smells of snowmelt and cold mountains. The Collector drinks from it before he climbs, perhaps. A man with cuts on him could do worse than drink it too.` }] }],
        verbs: { Drink: [{ if: 'flag:c1-basin', then: [{ say: `Dry. There's only the cold stone left.` }], else: [{ set: 'c1-basin' }, { sfx: 'heal' }, { say: `You cup your hands and drink. Cold as starlight. The ache goes out of your bones, the cuts on your hands close, and the hum of the tower settles in your chest like a second heartbeat.` }, { heal: true }, bant('c1-b-basin', 'shevra', `Leave me some, Bear. ...Bear. *Bear.* You drank the moon. All of it.`)] }] },
        take: `It's a basin of stone set into the wall. Drink from it instead.`,
        hot: '!flag:c1-basin',
      },
    ],
  },

  // ------------------------------------------------ The Tower Crown
  'c1-crown': {
    ...ROOM['c1-crown'],
    bg: [{ if: 'flag:c1-azhrim-down', bg: 'bg-tower-crown@fire' }, { bg: 'bg-tower-crown' }],
    desc: [
      { text: `The Crown of the tower is a vaulted chamber of black stone, lit by torches in iron brackets, hung with Azhrim's crimson banners. High above, slit windows of green glass let in a sick green moonlight. Against the far wall, chained upright with a dozen chains, stands a man of iron.` },
      { if: '!flag:c1-took-heart', text: `It is twice your height, built of dark plates fitted like a beetle's shell. Its chest stands open like a cabinet, and inside, cradled in silver wires, beats a jewel of blue-white fire. *Thrum. Thrum.* The hum you've felt since the desert is this. It's a heartbeat.` },
      { if: 'flag:c1-took-heart', text: `The iron man hangs dark and still in its chains, its chest empty.` },
    ],
    exits: {},
    first: [
      { scene: { img: 'bg-tower-crown', text: `The iron man lifts its head. Two lenses in its faceless face kindle blue, dim as embers. They turn on you with a soft clicking.\n\nIt speaks. Its voice is like a man talking from the bottom of a well, in a Zamorian a thousand years too old and a thousand years too new.` } },
      { line: ['iron-watcher', `Human. You are not the Collector. Good. Come closer. I do not have much time. I have had too much of it.`] },
      bant('c1-b-crown', 'shevra', `Bear. The jewel. It's *in* him. The jewel is in the iron man.`),
      { quest: ['ch1-main', 9] },
    ],
    things: [
      {
        id: 'watcher', name: 'The Iron Watcher', kind: 'person', portrait: 'iron-watcher',
        look: [{ if: 'flag:c1-took-heart', then: [{ say: `The Watcher hangs dead in its chains, its lenses dark. Somewhere a long way off, past the end of the world, its people are waiting for it to come home. It won't.` }], else: [{ say: `An iron man, twice the height of a man, chained by the wrists, the neck, the knees. Its plates are scored with burns and old dents. Some unknown smith wrote on its shoulder in letters you can't read, and a tally of strokes like a prisoner's count of days runs down its thigh: hundreds of them. Inside its open chest, the jewel beats. *Thrum.*` }] }],
        talk: [{ if: 'flag:c1-took-heart', then: [{ say: `The Watcher is silent. It has said its last.` }], else: [{ talk: 'c1-watcher' }] }],
        use: { '*': `The Watcher's lenses follow it. "That will not help. Only the heart matters now. Take it."` },
      },
      {
        id: 'heart', name: 'The Starheart', if: '!flag:c1-took-heart',
        look: `The Starheart: a jewel the size of a melon, blue-white, too bright to look at for long. It isn't cut like a gem. It *pulses*. Light runs through the silver wires that hold it, out into the iron man's limbs, and back. It is warm. You can feel the warmth from here. And it beats.`,
        take: [
          { if: '!flag:c1-watcher-talked', then: [{ line: ['iron-watcher', `Wait. Listen first. Then take it. It is the only thing I will ever ask of anyone.`] }, { talk: 'c1-watcher' }] },
          ...TAKE_HEART,
        ],
        use: { '*': `That's not what you came for. The Starheart beats, patient.` },
      },
      {
        id: 'chains', name: 'Chains',
        look: `A dozen chains of bronze, each link as thick as your wrist, sunk into the floor with lead. Runes are scratched into every link. Azhrim didn't trust iron to hold an iron man; he trusted sorcery.`,
        take: `You haul on one. The runes spit blue sparks at you. Sorcery. Of course.`,
      },
      {
        id: 'dome', name: 'Green Windows',
        look: `High in the vault, narrow windows of green glass, each cast in a single piece. Through them the moon looks green and sick, and the stars beyond swarm thicker than you've ever seen them. The iron man's face is turned up to them.`,
        take: `They're forty feet up. Even Shevra would want a ladder.`,
      },
    ],
  },
};

// ---------------------------------------------------------------- dialogues
const openGate = [{ set: 'c1-gate-open' }, { sfx: 'gate-open' }, { quest: ['ch1-main', 2] }];

const dialogues = {
  'c1-guard': {
    start: 'a',
    nodes: {
      a: { if: 'flag:c1-gate-open', who: 'guard-captain', text: `In or out, Cimmerian. Make up your mind; you're blocking the camels.`, else: 'b' },
      b: { who: 'guard-captain', text: `Halt. Toll's two coppers a head, five a camel. Cimmerians: twenty. It's on the board.`, choices: [
        { id: 'why', text: `Why twenty for Cimmerians?`, to: 'why' },
        { id: 'pay', text: `Pay twenty coppers.`, if: 'gold>=20', to: 'paid' },
        { id: 'nocoin', text: `I have no coin.`, if: 'gold<20', to: 'nocoin' },
        { id: 'pelt', text: `Offer him the jackal pelt.`, if: 'item:jackal-pelt', to: 'pelt' },
        { id: 'stare', text: `Say nothing. Out-stare him.`, if: 'flag:c1-guard-studied', to: 'stare' },
        { id: 'leave', text: `Leave.`, end: true },
      ] },
      why: { who: 'guard-captain', text: `Last one broke the gate. Then my nose. Then the gate again, on his way out. Twenty coppers is the city's compromise between letting you in and never letting you in.`, next: 'b' },
      nocoin: { who: 'guard-captain', text: `Then you've a long walk back to whatever hill coughed you up. Unless you've got something worth trading. My wife's been at me for a fur collar. The jackals have been bold since that caravan died out there; plenty of fur walking around.`, next: 'b' },
      paid: { who: 'narrator', text: `You count twenty coppers into his palm. He counts them again, bites one, and looks disappointed it's real.`, do: [{ gold: -20 }], next: 'open' },
      pelt: { who: 'guard-captain', text: `A pelt? Mangy. Smells like a dead Kothian. My wife will love it.`, do: [{ take: 'jackal-pelt' }], next: 'open' },
      stare: { who: 'narrator', text: `You say nothing. You plant your feet and look him in the eye.\n\nHe looks back. He's proud of his stare. The moon climbs a finger's width. Flies land on both of you. A camel sneezes. Sweat runs into his eye; yours are as dry as the desert you came out of. You've out-stared wolves in the snow, and a wolf has better reasons to win.\n\nHe blinks.`, do: [{ xp: 10 }], next: 'stare2' },
      stare2: { who: 'guard-captain', text: `...That's sand. I got sand in it. It doesn't count. Gods, fine. Go on in. *Don't* tell the others.`, next: 'open' },
      open: { who: 'guard-captain', text: `Shadizar welcomes you, Cimmerian. It welcomes everyone. Then it robs them blind.`, do: openGate },
    },
  },

  'c1-shevra': {
    start: 'a',
    nodes: {
      a: { who: 'shevra', text: `You walk like a man with an empty purse, Cimmerian. I know, because I just checked it.`, do: [{ sfx: 'steal' }], next: 'h' },
      h: { who: 'shevra', text: `Well? Sit. You're blotting out the lamp.`, choices: [
        { id: 'purse', text: `Give me back my purse.`, to: 'purse', once: true },
        { id: 'who', text: `Who are you?`, to: 'who', once: true },
        { id: 'work', text: `I'm looking for work.`, to: 'work' },
        { id: 'leave', text: `Leave.`, end: true },
      ] },
      purse: { who: 'shevra', text: `Give back *what*? There was nothing in it but sand and a dead beetle. I kept the beetle. It's the principle of the thing.`, do: [{ line: ['brannoc', `Keep the beetle.`] }], next: 'h' },
      who: { who: 'shevra', text: `Shevra. Best hands in Shadizar, and the best everything else. I've robbed three temples, two kings and a Stygian, and I'm still alive, which tells you the order of difficulty.`, next: 'h' },
      work: { who: 'shevra', text: `Then you're in luck, or the other thing. Madam Tullia, the richest fence in the city, wants something lifted from the Collector's tower. She wants a thief: that's me. And she wants something big enough to walk through walls. You're big. Can you walk through walls?`, next: 'work2' },
      work2: { who: 'brannoc', text: `Through men, mostly.`, next: 'work3' },
      work3: { who: 'shevra', text: `Close enough. Five hundred gold, split down the middle, and I get the middle. Come on, Bear. Tullia's house is off the Back Alleys, north of Statue Square. I'll introduce you. Try not to eat anyone.`, do: [{ join: 'shevra', level: 1 }, { quest: ['ch1-main', 3] }, { refresh: true }] },
    },
  },

  'c1-abulet': {
    start: 'a',
    nodes: {
      a: { who: 'abulet', text: `Welcome to the Gilded Jackal, stranger, best tavern in the worst city in the world! Wine, sausages, a bed, a dancer to look at and a poet to ignore. What'll it be?`, next: 'h' },
      h: { who: 'abulet', text: `Anything else? Gossip's free with every sausage.`, choices: [
        { id: 'buy', text: `What have you got?`, do: [{ shop: 'c1-abulet' }], end: true },
        { id: 'bed', text: `A bed for the night.`, do: [{ inn: 10, text: `A straw bed upstairs, clean-ish, and a bowl of lamb stew: ten coppers.` }], end: true },
        { id: 'gossip', text: `What's the news?`, to: 'gossip' },
        { id: 'woman', text: `Who's the woman watching me?`, if: '!party:shevra', to: 'woman' },
        { id: 'poet', text: `Who's the sot in the corner?`, to: 'poet' },
        { id: 'tower', text: `What's that black tower?`, to: 'tower' },
        { id: 'bucket', text: `What's in that bucket?`, to: 'bucket' },
        { id: 'leave', text: `Leave.`, end: true },
      ] },
      gossip: { who: 'abulet', text: `Fat Ommo's lost his ledger and he's sweating like a cheese. The Pit's paying forty a bout for fresh meat, and you're fresh meat. And the Stygians from the black shrine have been drinking here a month, ordering wine and never touching it.`, next: 'h' },
      woman: { who: 'abulet', text: `Shevra. Best thief in Shadizar, she says, and nobody's argued with her twice. Keep your hand on your purse. Though from the look of you, there's no point.`, next: 'h' },
      poet: { who: 'abulet', text: `Him? Ezio. Calls himself the Voice of Shadizar. Drinks like the Voice of a whole province and pays like a mute. Buy him a cup and he'll tell you anything. Buy him two and he'll *sing* it, so don't.`, next: 'h' },
      tower: { who: 'abulet', text: `Azhrim the Collector's. A sorcerer, a merchant, a hoarder of everything strange under the sun. Lately it hums at night, like a hive. The cups on my shelves walk to the edge. Nobody's sleeping well since he moved something up into the crown.`, next: 'h' },
      bucket: { who: 'abulet', text: `Scraps. Bones, gristle, onion skins. I sell it to the dog-men of the Bazaar. Help yourself, if you're that hungry. I've seen Cimmerians eat worse.`, next: 'h' },
    },
  },

  'c1-poet': {
    start: 'a',
    nodes: {
      a: { if: 'flag:c1-joke', who: 'poet', text: `My patron! My barbarian! My audience! Have you come to hear the joke again? Everyone does. Nobody laughs, but everyone comes back.`, else: 'b' },
      b: { who: 'poet', text: `*O Shadizar, thou whore of cities, thou... thou...* What rhymes with cities? Nothing. Nothing rhymes, nothing scans, and my cup is *empty*, sir.`, choices: [
        { id: 'cup', text: `Abulet! A cup for the poet. (3 coppers)`, if: '!flag:c1-joke & gold>=3', to: 'cup' },
        { id: 'nocup', text: `I can't afford to buy you a cup.`, if: '!flag:c1-joke & gold<3', to: 'nocup' },
        { id: 'statue', text: `Shevra says you once made a statue laugh.`, if: '!flag:c1-joke', to: 'statue' },
        { id: 'again', text: `Tell me the joke again.`, if: 'flag:c1-joke', to: 'joke' },
        { id: 'leave', text: `Leave.`, end: true },
      ] },
      statue: { who: 'poet', text: `I did! The Nameless Thief himself, in the square. I told him a joke, and the next morning his stone lips were *curved*. Or so I'm told. I was asleep in the fountain. But for a cup of wine I would tell it to you, and perhaps your face will curve too. It's a stone face, sir. A professional can tell.`, next: 'b' },
      nocup: { who: 'poet', text: `Then we are brothers in poverty, and I won't hold it against you. Come back when you've robbed someone.`, next: 'b' },
      cup: { who: 'narrator', text: `You slap three coppers on the bar. Abulet pours, the poet drinks, and the color comes back into his nose.`, do: [{ gold: -3 }, { sfx: 'drink' }], next: 'joke' },
      joke: { who: 'poet', text: `Ahem. *Why has the Nameless Thief stood in the square for a thousand years?*\n\nBecause in a thousand years, not one man in Shadizar would *give him a hand down*... and he's far too honest to *steal* one.`, do: [{ set: 'c1-joke' }], next: 'joke2' },
      joke2: { who: 'brannoc', text: `...`, do: [bant('c1-b-joke', 'shevra', `Oh, that's *terrible*. That's wonderful. A statue would laugh at that out of pure pity.`)], next: 'joke3' },
      joke3: { who: 'poet', text: `Remember it, sir. A joke is a key. You never know what door it will open.` },
    },
  },

  'c1-ommo': {
    start: 'a',
    nodes: {
      a: { who: 'ommo', text: `A Cimmerian in my Den. Shevra, did you bring me a pet? Does it do tricks? Does it *steal*?`, next: 'h' },
      h: { who: 'ommo', text: `Talk, big man. Ommo's time is worth gold, and you are not.`, choices: [
        { id: 'give', text: `Here's your ledger.`, if: 'item:ledger', to: 'give' },
        { id: 'ledger', text: `You look worried.`, if: '!item:ledger & quest:e-ledger<2', to: 'ledger' },
        { id: 'bones', text: `What are those knucklebones on your belt?`, if: '!item:knucklebones & quest:e-ledger<2', to: 'bones' },
        { id: 'tower', text: `What do you know about the Collector's tower?`, to: 'tower' },
        { id: 'leave', text: `Leave.`, end: true },
      ] },
      ledger: { who: 'ommo', text: `Worried? *Me?* My ledger was stolen, Cimmerian. My *ledger*. Every debt in Shadizar is in that book, and who owes it, and what I know about their wives. Some jumpy little nobody lifted it off my table and ran into the Back Alleys. Bring it back, and Ommo is generous. Ommo is *famously* generous.`, do: [{ if: 'quest:e-ledger<1', then: [{ quest: ['e-ledger', 1] }] }], next: 'ledger2' },
      ledger2: { who: 'narrator', text: `A cutthroat nearby mutters, "Famously." Another one says, "Once."`, next: 'h' },
      bones: { who: 'ommo', text: `These? My loaded knucklebones. Carved from the knuckles of a Kothian cheat, and they've kept his habits. Drop one in another man's game and every throw comes up double vultures. The players always accuse each other. Ommo has started three blood feuds and a small war with these. Not for sale. For a *favor*, maybe.`, next: 'h' },
      tower: { who: 'ommo', text: `The Collector's? Ommo has sent nine thieves over that wall. Two came back. One had seen dogs. The other had seen a door that bit him, and stairs full of moonlight, and he went to Mitra after that and became honest. Terrible waste.`, next: 'h' },
      give: { who: 'ommo', text: `My ledger! My beautiful, beautiful book! Let me see... yes... yes, and he didn't even read it, the illiterate little worm. Cimmerian, you are Ommo's friend now. That is better than gold, but here is gold too, so you can tell the difference.`, do: [{ take: 'ledger' }, { gold: 30 }, { give: 'knucklebones' }, { xp: 40 }, { quest: ['e-ledger', 2] }], next: 'give2' },
      give2: { who: 'ommo', text: `And the knucklebones. You looked at them like a dog at a sausage. Take them. Start a war with somebody Ommo doesn't like. That is everybody.`, next: 'h' },
    },
  },

  'c1-hasdrubal': {
    start: 'a',
    nodes: {
      a: { who: 'hasdrubal', text: `Steel, leather, rope. Honest goods at dishonest prices. What do you want, northerner?`, choices: [
        { id: 'shop', text: `Show me your goods.`, do: [{ shop: 'c1-hasdrubal' }], end: true },
        { id: 'rope', text: `How much for rope?`, to: 'rope' },
        { id: 'haggle', text: `I don't suppose you'd haggle?`, to: 'haggle', once: true },
        { id: 'tower', text: `Ever been inside the Collector's tower?`, to: 'tower' },
        { id: 'leave', text: `Leave.`, end: true },
      ] },
      rope: { who: 'hasdrubal', text: `Forty, and not a copper less, barbarian. Good Shemite hemp, strong enough to hang a king. I've sold three to the palace already this year.`, next: 'a' },
      haggle: { who: 'hasdrubal', text: `Haggle? Read the sign. *No haggling.* Then read it again. I put the sign up because the last man who haggled with me went home with one fewer ear. He haggled for that too.`, next: 'a' },
      tower: { who: 'hasdrubal', text: `Sold Azhrim's guards their armor. Bronze scale, the best I make: a sword-edge slides off it like rain. A mace, though... a mace doesn't care what a man's wearing. That's free advice. The mace costs extra.`, next: 'a' },
    },
  },

  'c1-nimm': {
    start: 'a',
    nodes: {
      a: { if: 'party:shevra | flag:c1-specs-done', who: 'nimm', text: `Mm. You smell of honest company now, big one. Or dishonest company I know. What will it be? Poppy for sleep, herbs for wounds, lotus for the spirit?`, choices: [
        { id: 'buy', text: `Show me what you sell.`, do: [{ shop: 'c1-nimm' }], end: true },
        { id: 'poppy', text: `What do poppy tears do?`, to: 'poppy' },
        { id: 'leave', text: `Leave.`, end: true },
      ], else: 'no' },
      no: { who: 'nimm', text: `No, no, no. I can smell you from here: desert, sweat, blood and *barbarian*. I don't sell to barbarians. The last one bought my poppy, put a whole caravan to sleep, and robbed it. The caravan was *mine*.`, choices: [
        { id: 'honest', text: `I'm honest.`, to: 'honest' },
        { id: 'leave2', text: `Leave.`, end: true },
      ] },
      honest: { who: 'nimm', text: `Hah! And I'm a Brythunian milkmaid. Bring someone I trust to vouch for you. Shevra, now. Shevra robs everyone but me, because I'm her godmother. Or a scholar's word in writing. Scholars can't lie, they don't know how.` },
      poppy: { who: 'nimm', text: `Tears of the poppy. One drop and you sleep, two and you dream, three and you're a Stygian. Mix it in food and anything that eats will snore till noon. Man or beast. Or husband.`, next: 'a' },
    },
  },

  'c1-butcher': {
    start: 'a',
    nodes: {
      a: { who: 'butcher', text: `Goat, lamb, camel, and don't ask about the sausage. Buying or dying, stranger?`, choices: [
        { id: 'hook', text: `That's a big hook.`, if: '!flag:c1-took-hook', to: 'hook' },
        { id: 'dog', text: `Is that your dog?`, if: '!flag:c1-butcher-gone', to: 'dog' },
        { id: 'stolen', text: `Lose something?`, if: 'flag:c1-took-hook', to: 'stolen' },
        { id: 'leave', text: `Leave.`, end: true },
      ] },
      hook: { who: 'butcher', text: `Best hook in the Bazaar. My father's, and his father's. Hung half a camel on it every day for forty years. Touch it and I'll hang *you* on it.`, next: 'a' },
      dog: { who: 'butcher', text: `That cur? He's nobody's. Sits there all day staring at my meat. He knows if he so much as sniffs it I'll make sausages of him. Give him a bone and he'd run to Khitai with it. Not one of *my* bones, mind.`, next: 'a' },
      stolen: { who: 'butcher', text: `My hook! Some son of a Stygian took my hook while I was chasing that gods-cursed dog! When I find him I'll... What are you smiling at?`, next: 'a' },
    },
  },

  'c1-beggar': {
    start: 'a',
    nodes: {
      a: { if: 'quest:e-boots>=2', who: 'beggar', text: `The big man! My boots are the envy of the Street, sir. I walk up and down in them all day, just to be seen. Bless you, and the Thief bless you.`, else: 'b' },
      b: { who: 'beggar', text: `Alms, big man? Alms for an old thief whose feet have given out? These cobbles burn like a Stygian's griddle. If I had boots, sir, I'd walk to the temple and thank every god in it.`, choices: [
        { id: 'boots', text: `Here. Take these boots.`, if: 'item:worn-boots', to: 'boots' },
        { id: 'coin', text: `Give him a copper.`, if: 'gold>=1', to: 'coin', once: true },
        { id: 'nocoin', text: `I've nothing to give.`, if: 'gold<1', to: 'nocoin' },
        { id: 'leave', text: `Leave.`, end: true },
      ], do: [{ if: 'quest:e-boots<1', then: [{ quest: ['e-boots', 1] }] }] },
      coin: { who: 'beggar', text: `A copper! From a man with barely two. You're no Zamorian, sir. Zamorians give alms with one hand and take them back with the other.`, do: [{ gold: -1 }], next: 'b' },
      nocoin: { who: 'beggar', text: `Then we're brothers, sir. Sit with me a while. The view's terrible.`, next: 'b' },
      boots: { who: 'beggar', text: `Boots! *Boots!* Real ones, with soles! Gods of thieves, I can feel my feet again! Here, big man, here. It's all I have that's worth anything. My lucky coin. Never brought me luck, but maybe it was waiting for you.`, do: [{ take: 'worn-boots' }, { give: 'lucky-coin' }, { xp: 40 }, { quest: ['e-boots', 2] }], next: 'boots2' },
      boots2: { who: 'beggar', text: `And a story, free. My grandmother's grandmother said that the Nameless Thief came out of nowhere, out of the empty desert, with a star in his fist and the gold of a dragon on his back. And his face was a hill-man's face. A northerner. Like yours. Funny, eh? Who'd make a hill-man a founder?` },
    },
  },

  'c1-scholar': {
    start: 'a',
    nodes: {
      a: { if: 'quest:e-spectacles>=3', who: 'scholar', text: `My friend with the large hands! I can read! I can read *everything*! I've read four scrolls since breakfast and one of them was a menu.`, choices: [
        { id: 'idol2', text: `Tell me again about the weeping idol.`, to: 'idol' },
        { id: 'leave', text: `Leave.`, end: true },
      ], else: 'b' },
      b: { who: 'scholar', text: `Pardon, is that a person or a very large door? I can't see a thing. I lost my spectacles feeding the pigeons by the fountain in Statue Square, and now the scrolls might as well be soup.`, do: [{ if: 'quest:e-spectacles<1', then: [{ quest: ['e-spectacles', 1] }] }], choices: [
        { id: 'give', text: `Are these your spectacles?`, if: 'item:spectacles', to: 'give' },
        { id: 'idol', text: `What were you scholars arguing about?`, to: 'idol' },
        { id: 'leave2', text: `Leave.`, end: true },
      ] },
      idol: { who: 'scholar', text: `Ah! The Collector's new piece. A bronze idol that weeps oil, they say, chained up in his crown, too big to fit in any case. My colleague's cousin carried his laundry and swears it *talks*. In Zamorian, but wrong Zamorian, like a man reading it off a tablet a thousand years old. Or a thousand years *new*, Ptolon says, but Ptolon is an idiot.`, next: 'a' },
      give: { who: 'scholar', text: `My spectacles! Oh! Oh, you're *enormous*. Thank you, friend. Thank you. Here, take this, for your trouble, and a note: my wife's grandmother is Old Nimm the apothecary, and she trusts nobody but me. This says you're honest. In writing. She'll sell you anything now.`, do: [{ take: 'spectacles' }, { gold: 15 }, { xp: 40 }, { set: 'c1-specs-done' }, { quest: ['e-spectacles', 3] }], next: 'a' },
    },
  },

  'c1-bel': {
    start: 'a',
    nodes: {
      a: { who: 'bel-priest', text: `A northerner on Bel's steps. Welcome, son. Bel loves strangers. They have such full purses, at first.`, choices: [
        { id: 'bel', text: `Who is Bel?`, to: 'bel', once: true },
        { id: 'founder', text: `Who was the Nameless Thief?`, to: 'founder' },
        { id: 'curse', text: `What does "may the floor wake" mean?`, to: 'curse' },
        { id: 'tower', text: `What do you know of the Collector?`, to: 'tower' },
        { id: 'leave', text: `Leave.`, end: true },
      ] },
      bel: { who: 'bel-priest', text: `The god of thieves. He stole fire from the other gods and sold it back to them. He stole the night from the day so that thieves would have somewhere to work. He has never once paid for anything, and he never once forgot a friend. Shadizar is his favorite child. Look at her. A thief of a city.`, next: 'a' },
      founder: { who: 'bel-priest', text: `The founder? Nobody knows his name, son, not even the temple, and the temple knows everyone's. The oldest scroll says only this: *he came from nowhere and went nowhere*. He walked out of the desert with a star in his hand, gave the nomads a dragon's gold to build their walls, and walked away again. Bel's own kind of man.`, next: 'a' },
      curse: { who: 'bel-priest', text: `The oldest curse in the city. Older than the temple. The nomads said it before there were walls. My teacher thought the city was built on something sleeping. My teacher drank. But I've noticed nobody in Shadizar ever digs a cellar deeper than a man is tall.`, next: 'a' },
      tower: { who: 'bel-priest', text: `Azhrim. A collector of curiosities, and a sorcerer to keep them. He built his tower on the old hill where the stones hum; even the nomads wouldn't camp there. Now the whole tower hums. Whatever he's put up in his crown, son, it wants out.`, next: 'a' },
    },
  },

  'c1-doru': {
    start: 'a',
    nodes: {
      a: { if: 'quest:sq-pit>=3', who: 'doru', text: `The Cimmerian! Three ranks in a month: the crowd adores you, and better, the crowd *bets* on you. Ranks two and one are another matter. The Iron Bull and Khalla fight only seasoned blades, legends, men with songs about them. Come back when they're singing. Your name stays on my slate.`, else: 'b' },
      b: { if: 'quest:sq-pit==2', who: 'doru', text: `Rank three: Ghaul the Hyrkanian and his two steppe wolves. He shoots two arrows at once, and they don't care which of them hits you. A hundred and fifty gold, and his own Hyrkanian bow if you win. Rank three wants a fighter of some standing. Level five or better.`, choices: [
        { id: 'r3', text: `Send in Ghaul.`, if: 'level>=5', do: pitFight(3), end: true },
        { id: 'r3-no', text: `I'm ready.`, if: 'level<5', to: 'green' },
        { id: 'rules', text: `What are the rules?`, to: 'rules' },
        { id: 'leave', text: `Leave.`, end: true },
      ], else: 'c' },
      c: { if: 'quest:sq-pit==1', who: 'doru', text: `Rank four: the Kothian Twins. Two brothers who fight like one man with four arms. Hit one and the other takes it personally. Eighty gold, and a pair of Pit Gauntlets for the winner. Level four or better, friend; I don't sell funerals.`, choices: [
        { id: 'r4', text: `Send in the twins.`, if: 'level>=4', do: pitFight(4), end: true },
        { id: 'r4-no', text: `I'm ready.`, if: 'level<4', to: 'green' },
        { id: 'rules2', text: `What are the rules?`, to: 'rules' },
        { id: 'leave2', text: `Leave.`, end: true },
      ], else: 'd' },
      d: { who: 'doru', text: `New meat! Big new meat. Doru the Lanista, and this is the Pit of Shadizar, five ranks from the bottom to the top and gold at every one. Rank five: the Sand Rats, two hungry boys with nets and clubs. Forty gold for the winner. You look like you've at least been in a fight once. Level two or better, I'd say.`, choices: [
        { id: 'r5', text: `Send in the Sand Rats.`, if: 'level>=2', do: pitFight(5), end: true },
        { id: 'r5-no', text: `I'm ready.`, if: 'level<2', to: 'green' },
        { id: 'khalla', text: `Who's the woman with the greatsword?`, to: 'khalla' },
        { id: 'rules3', text: `What are the rules?`, to: 'rules' },
        { id: 'leave3', text: `Leave.`, end: true },
      ] },
      green: { who: 'doru', text: `You're green, friend. Greener than a Vendhyan parrot. Go and get some blood on you somewhere else first. The jackals at the Desert Gate are always hiring.` },
      rules: { who: 'doru', text: `Arena rules! No fleeing; the gates are barred. No potions; the crowd wants blood, not chemistry. And when it's over, win or lose, my surgeons sew you back together for free. Free! Nobody in Shadizar does *anything* for free. Except die.`, next: 'b' },
      khalla: { who: 'doru', text: `Khalla the Unbroken. Champion of the Pit, forty bouts, forty wins, and she's never once smiled. She fights only rank one. If you ever get to her, Cimmerian, I'll sell tickets to your funeral and split the take with your widow.`, next: 'b' },
    },
  },

  'c1-khalla': {
    start: 'a',
    nodes: {
      a: { who: 'khalla', text: `...`, next: 'b' },
      b: { who: 'narrator', text: `Khalla finishes her stroke. The straw man's head rolls to your feet. She looks you up and down, the way a horse-trader looks at a horse.`, next: 'c' },
      c: { if: 'quest:sq-pit>=3', who: 'khalla', text: `Three ranks. You fight like a man with nowhere to run. That is how I fight. One day, Cimmerian. Not yet. Get older. Get worse.`, else: 'd' },
      d: { who: 'khalla', text: `You've got the shoulders. You haven't got the scars. Come back with a rank or two, and then we'll talk. Or don't come back. The Pit doesn't care either way.` },
    },
  },

  'c1-tullia': {
    start: 'a',
    nodes: {
      a: { if: 'flag:c1-job', who: 'tullia', text: `Back so soon, darling? I don't see a Starheart in your hands. I see dirt. I'm not paying for dirt.`, next: 'h', else: 'intro' },
      intro: { who: 'tullia', text: `So *this* is Shevra's Cimmerian. Darling, you're even bigger than she said. Sit, sit. No, not on that, it's Vendhyan. On the floor. Good.`, next: 'intro2' },
      intro2: { who: 'tullia', text: `I'll be brief, because Shevra charges by the hour. Azhrim the Collector has a jewel in the crown of his tower: the *Starheart*. My client wants it. You will steal it. I will pay you five hundred gold. Everyone will be very happy except Azhrim, and nobody has been able to make him happy for years.`, next: 'h' },
      h: { who: 'tullia', text: `Questions, darling? Make them clever.`, choices: [
        { id: 'job', text: `I'll do it. Half up front.`, if: '!flag:c1-job', to: 'job' },
        { id: 'heart', text: `What is this Starheart?`, to: 'heart' },
        { id: 'tower', text: `Tell me about the tower.`, to: 'tower' },
        { id: 'client', text: `Who's your client?`, to: 'client' },
        { id: 'azhrim', text: `Who is Azhrim?`, to: 'azhrim', once: true },
        { id: 'leave', text: `Leave.`, end: true },
      ] },
      job: { who: 'tullia', text: `Half up front? Darling, nothing up front. Up front is how men disappear to Aquilonia. But you'll have everything else when it's in my hands. Five hundred gold, split however Shevra lets you.`, do: [{ set: 'c1-job' }, { quest: ['ch1-main', 4] }], next: 'job2' },
      job2: { who: 'shevra', text: `I let him have *some*.`, next: 'job3' },
      job3: { who: 'tullia', text: `And darling, you are *not* robbing a sorcerer with that rusty butter knife. It's embarrassing for all of us. Take this. I'll take it out of your share.`, do: [{ give: 'broadsword' }, { say: `A red sash hands you a Zamorian broadsword in a good leather scabbard. *(Equip it from the Bag.)*` }], next: 'tower' },
      heart: { who: 'tullia', text: `A jewel the size of a melon that glows blue-white like a star. My client says it is *warm* to the touch, and that it beats. Like a heart. I said, "Darling, nothing beats." He said, "This does." He was very insistent. He's a very insistent man.`, next: 'h' },
      tower: { who: 'tullia', text: `First the wall: smooth as my conscience, so you'll want a rope and something to hook it with. Then the garden, where Azhrim keeps two hounds that bite. Then the hall, where he keeps two guards that bite worse. Then the Smiling Door, which bites best of all. And then the Moon Stair. My painting on the wall there came out of that tower; the painter lived there for twenty years. Look at it. *Closely*.`, next: 'h' },
      client: { who: 'tullia', text: `Darling. In Shadizar, asking a fence who her client is is like asking a priest of Set what's for dinner. You won't like the answer, and you might be it.`, next: 'h' },
      azhrim: { who: 'tullia', text: `A sorcerer-merchant. He collects everything rare under the sun: books, beasts, gods, people. He bought the tower hill because the stones hum, and he's spent thirty years making it hum louder. He hasn't come down from the crown in a month. Whatever the Starheart is, he's in love with it. That makes him careless. Love always does.`, next: 'h' },
    },
  },

  'c1-door': {
    start: 'a',
    nodes: {
      a: { who: 'narrator', text: `The stone face's eyes roll down to look at you. Its lips part with a grinding sound, showing teeth like millstones. A voice like a quarry speaks: "I OPEN FOR ONE WHO MAKES ME SMILE. MAKE ME SMILE, LITTLE MAN. OR FEED ME."`, choices: [
        { id: 'poet-joke', text: `"Why has the Nameless Thief stood in the square for a thousand years?"`, if: 'flag:c1-joke', to: 'right' },
        { id: 'cimmerian', text: `Tell it a Cimmerian joke.`, to: 'cimm' },
        { id: 'knock', text: `"Knock, knock."`, to: 'knock' },
        { id: 'shevra-joke', text: `Let Shevra tell one.`, if: 'party:shevra', to: 'shev' },
        { id: 'leave', text: `Back away.`, end: true },
      ] },
      cimm: { who: 'brannoc', text: `A Cimmerian went out in the snow to hunt. He didn't come back. In spring they found him. He was dead.`, next: 'cimm2' },
      cimm2: { who: 'narrator', text: `"THAT IS NOT A JOKE," says the door. "THAT IS A CENSUS OF CIMMERIA." Its lips snap out and bite you on the shoulder.`, do: [hurt(8), { sfx: 'bite' }, { shake: true }], next: 'a' },
      knock: { who: 'narrator', text: `"*I* AM THE DOOR, LITTLE MAN." There is a long, grinding silence. Then it bites you, slowly and thoughtfully, to make the point.`, do: [hurt(8), { sfx: 'bite' }, { shake: true }], next: 'a' },
      shev: { who: 'shevra', text: `A Nemedian bishop, a Kushite eunuch and a camel walk into a bathhouse...`, next: 'shev2' },
      shev2: { who: 'narrator', text: `It's a long joke and a filthy one. The stone face's cheeks go faintly pink. But it doesn't smile. "VULGAR," it booms, and bites Shevra on the backside. She swears in four languages.`, do: [hurt(6, 'shevra'), { sfx: 'bite' }], next: 'a' },
      right: { who: 'brannoc', text: `Because in a thousand years, not one man in Shadizar would give him a hand down. And he's too honest to steal one.`, next: 'right2' },
      right2: { who: 'narrator', text: `Silence. A grain of dust trickles from the stone face's brow. Then the corners of its great lips begin to creak upward, crack by crack, and a sound comes out of it like a landslide having a good day.\n\n"HAH. HAH. HAH. *TOO HONEST TO STEAL ONE.*" The mouth gapes wide, wider, till it is an arch, and beyond it a stair of white marble climbs into moonlight.`, do: [{ set: 'c1-door-open' }, { sfx: 'door' }, { xp: 25 }, { quest: ['ch1-main', 8] }, { refresh: true }] },
    },
  },

  'c1-watcher': {
    start: 'a',
    nodes: {
      a: { who: 'iron-watcher', text: `Listen. I am a Watcher. I was made at the end of the world, thousands of years from this night, by the last of your kind. A dragon ate our sky. It ate our seas, our cities, our future. It eats *time*. The last men sent us back, to kill it while it slept. Here. In your age.`, do: [{ set: 'c1-watcher-talked' }], choices: [
        { id: 'dragon', text: `What dragon?`, to: 'dragon' },
        { id: 'heart', text: `The jewel in your chest. What is it?`, to: 'heart' },
        { id: 'here', text: `How did you end up chained here?`, to: 'here' },
        { id: 'ask', text: `What do you want from me?`, to: 'ask' },
      ] },
      dragon: { who: 'iron-watcher', text: `Ygg-Sothar. The Dragon Between Worlds. It coils in the gaps between the ages. Your priests of the serpent call it the true face of their god. They are not wrong. They are not right. They are hungry, like it.`, next: 'a2' },
      heart: { who: 'iron-watcher', text: `A Starheart. An engine of time. It is what I am, more than this iron. With it a Gate can be opened, and the dragon found where it sleeps. In the wrong hands it can feed the dragon instead. There are hands in this city that want it very much. I hear them. They whisper in Stygian.`, next: 'a2' },
      here: { who: 'iron-watcher', text: `The Gate sends; the stones catch. I came through too wide and fell out of the stones under this tower, into the hands of a man who collects things. He put me in chains to hear me talk. I have talked for three hundred of your years. I have counted every day. It was not a good conversation.`, next: 'a2' },
      a2: { who: 'iron-watcher', text: `My heart is failing. Soon it will be only a jewel, and I only iron. Ask, quickly.`, choices: [
        { id: 'dragon2', text: `What dragon?`, to: 'dragon' },
        { id: 'heart2', text: `The jewel in your chest. What is it?`, to: 'heart' },
        { id: 'here2', text: `How did you end up chained here?`, to: 'here' },
        { id: 'ask2', text: `What do you want from me?`, to: 'ask' },
      ] },
      ask: { who: 'iron-watcher', text: `Take my heart. Carry it to the Gate on the Isle of the Iron Dead, where the stars drown. Set it in the ring. My brothers fell there; the Gate remembers them. Finish what we could not.`, next: 'ask2' },
      ask2: { who: 'brannoc', text: `I was paid to steal a jewel, not to fight a god.`, next: 'ask3' },
      ask3: { who: 'iron-watcher', text: `Then you were paid too little. I am sorry for it. Take it anyway. There is no one else in all of time who has climbed this stair and spoken to me as if I were a man.`, do: [bant('c1-b-watcher', 'shevra', `Bear... it's *asking*. Nobody asks for anything in Shadizar.`)] },
    },
  },
};

// ---------------------------------------------------------------- items
const items = {
  rope: { name: 'Rope', type: 'key', icon: 'rope', price: 40, desc: 'Fifty feet of good Shemite hemp, "strong enough to hang a king".' },
  'meat-hook': { name: 'Meat Hook', type: 'key', icon: 'meat-hook', desc: 'A great iron butcher\'s hook, big enough to hang half a camel. Rope would tie neatly to its eye.' },
  grapnel: { name: 'Grapnel', type: 'key', icon: 'grapnel', desc: 'A butcher\'s hook on fifty feet of rope. A thief\'s ladder.' },
  bone: { name: 'Greasy Bone', type: 'key', icon: 'bone', desc: 'A big greasy bone from Abulet\'s scrap bucket. Any dog\'s dream.' },
  sausage: { name: 'Sausage', type: 'key', icon: 'sausage', price: 5, desc: 'A fat Zamorian sausage. Abulet says not to ask what\'s in it.' },
  'poppy-tears': { name: 'Poppy Tears', type: 'key', icon: 'poppy-tears', price: 15, desc: 'A tiny bottle of Old Nimm\'s sleeping drops. Mix it in food and anything that eats will snore till noon.' },
  'drugged-sausage': { name: 'Drugged Sausage', type: 'key', icon: 'sausage@green', desc: 'A sausage soaked in poppy tears. Smells delicious. Smells *sleepy*.' },
  spectacles: { name: 'Spectacles', type: 'key', icon: 'spectacles', desc: 'Crystal spectacles with bent wire arms, fished out of the fountain. One lens is cracked.' },
  ledger: { name: 'Fat Ommo\'s Ledger', type: 'key', icon: 'ledger', desc: 'A fat leather book of every debt in Shadizar. You can\'t read it. Ommo can, and wants it back.' },
  knucklebones: { name: 'Loaded Knucklebones', type: 'key', icon: 'knucklebones', desc: 'Ommo\'s loaded dice, carved from a cheat\'s knuckles. Drop them in another man\'s game and every throw comes up double vultures.' },
  'worn-boots': { name: 'Worn Boots', type: 'key', icon: 'worn-boots', desc: 'A bravo\'s boots: worn but whole. Somebody barefoot would love these.' },
};

// ---------------------------------------------------------------- enemies
const enemies = {
  jackal: {
    ...enemyStats(1, 'minion'), name: 'Desert Jackal', sprite: 'jackal', size: 's',
    weak: ['slash'], resist: [], immune: [],
    desc: 'All ribs and teeth, and bold with hunger.',
    skills: [{ name: 'Snapping Bite', power: 1.3, dmg: 'pierce', chance: 0.25, sfx: 'bite' }],
    attackDmg: 'pierce', drops: [{ id: 'jackal-pelt', chance: 1 }],
  },
  pickpocket: {
    ...enemyStats(2, 'minion'), name: 'Jumpy Pickpocket', sprite: 'thug', tint: 'grey', size: 'm',
    weak: ['pierce'], resist: [], immune: [],
    desc: 'All elbows and excuses, with a knife he hasn\'t learned to hold.',
    skills: [{ name: 'Dirty Knife', power: 1.2, dmg: 'pierce', chance: 0.3, sfx: 'pierce' }],
    attackDmg: 'pierce', drops: [{ id: 'ledger', chance: 1 }],
  },
  'city-guard': {
    ...enemyStats(3, 'brute'), name: 'Tower Guard', sprite: 'city-guard', size: 'm',
    weak: ['blunt'], resist: ['slash'], immune: [],
    desc: 'Bronze scale armor turns an edge. A mace would make it ring.',
    skills: [{ name: 'Spear Thrust', power: 1.3, dmg: 'pierce', chance: 0.3, sfx: 'pierce' }],
    attackDmg: 'pierce', drops: [{ id: 'healing-draught', chance: 0.3 }],
  },
  'tower-hound': {
    ...enemyStats(3, 'brute'), name: 'Tower Hound', sprite: 'tower-hound', size: 'm',
    weak: ['slash'], resist: [], immune: [],
    desc: 'Half wolf, half mastiff, all teeth.',
    skills: [{ name: 'Bear-Trap Jaws', power: 1.4, dmg: 'pierce', chance: 0.3, sfx: 'bite' }],
    attackDmg: 'pierce', drops: [],
  },
  'giant-spider': {
    ...enemyStats(5, 'brute'), name: 'Giant Spider', sprite: 'spider', size: 'l',
    weak: ['blunt', 'fire'], resist: ['pierce'], immune: [],
    desc: 'A pony-sized spider with a shell like lacquered armor. Crush it; don\'t poke it.',
    skills: [
      { name: 'Venom Fang', power: 1.1, dmg: 'pierce', chance: 0.3, status: { poison: 0.5 }, sfx: 'bite' },
      { name: 'Web Shot', power: 0.5, dmg: 'blunt', chance: 0.2, status: { stun: 0.5 } },
    ],
    attackDmg: 'pierce', drops: [],
  },
  'brass-serpent': {
    ...enemyStats(5, 'brute', { hp: 0.6 }), name: 'Brass Serpent', sprite: 'brass-serpent', size: 'l',
    weak: ['blunt', 'cold'], resist: ['lightning', 'fire'], immune: [],
    desc: 'A clockwork serpent of brass and sorcery. Swords skate off it; a mace dents it.',
    skills: [{ name: 'Brass Coils', power: 1.2, dmg: 'blunt', chance: 0.3, status: { stun: 0.25 }, sfx: 'blunt' }],
    attackDmg: 'blunt', drops: [],
  },
  azhrim: {
    ...enemyStats(5, 'boss', { hp: 0.6, atk: 0.85 }), name: 'Azhrim the Collector', sprite: 'azhrim-fight', size: 'l',
    weak: ['pierce', 'holy'], resist: [], immune: [],
    desc: 'A sorcerer-merchant in cloth of gold. Soft flesh under the silk: a blade\'s point will find it.',
    skills: [
      { name: 'Collector\'s Curse', magic: true, el: 'void', power: 0.3, chance: 0.3, status: { poison: 0.3 }, sfx: 'debuff' },
      { name: 'Gilded Lightning', magic: true, el: 'lightning', power: 0.3, chance: 0.2, target: 'all', sfx: 'lightning' },
    ],
    attackDmg: 'blunt', drops: [],
  },
  'tullia-blade': {
    ...enemyStats(4, 'minion'), name: 'Red Sash', sprite: 'thug', tint: 'red', size: 'm',
    weak: ['pierce'], resist: [], immune: [],
    desc: 'One of Tullia\'s Nemedian bodyguards, bought and paid for.',
    skills: [{ name: 'Nemedian Cut', power: 1.3, dmg: 'slash', chance: 0.3, sfx: 'slash' }],
    attackDmg: 'slash', drops: [{ id: 'healing-draught', chance: 0.3 }],
  },
};

const scripts = {
  'c1-hurt': async (g, { n = 6, who = 'brannoc' }) => {
    const m = g.state().members[who];
    if (!m) return;
    m.hp = Math.max(1, m.hp - n);
    g.say(`*(−${n} HP)*`);
  },
  'c1-mirror-look': async (g, { m }) => {
    g.say(`It faces *${mirrorDir(g, m)}*.`);
  },
  'c1-turn': async (g, { m, back = false }) => {
    if (g.flag('c1-mirrors-done')) { g.say(`The mirrors are set. Moonlight runs through them like water through a channel. You leave them be.`); return; }
    g.setVar('c1-m' + m, (g.var('c1-m' + m) + (back ? 3 : 1)) % 4);
    const ord = ['first', 'second', 'third'][m - 1];
    const how = back ? `put your back against the ${ord} mirror and shove it the other way` : `set your shoulder to the ${ord} mirror and heave`;
    await g.run([{ sfx: 'door' }, { say: `You ${how}. It grinds round on its pivot. It now faces *${mirrorDir(g, m)}*.` }]);
    const want = ['east', 'south', 'north'];
    let k = 0;
    while (k < 3 && mirrorDir(g, k + 1) === want[k]) k++;
    if (k === 3) { g.setVar('c1-mirrors-ok', 1); return; }
    const msg = [
      `The moonlight from the east window falls on the first mirror and splashes uselessly against the stone.`,
      `Moonlight strikes the first mirror and leaps to the second... which throws it away into a dark corner.`,
      `Moonlight leaps from the first mirror to the second, and from the second to the third, which flings it uselessly at the wall.`,
    ][k];
    g.setVar('c1-mirror-tries', g.var('c1-mirror-tries') + 1);
    await g.run([{ say: msg }]);
  },
};

function mirrorDir(g, m) {
  const names = ['north', 'east', 'south', 'west'];
  const off = { 1: 3, 2: 0, 3: 2 };   // starting directions: west, north, south
  return names[(g.var('c1-m' + m) + off[m]) % 4];
}

// ---------------------------------------------------------------- quests and hints
const quests = {
  'ch1-main': {
    name: 'The City of Thieves', main: true, done: 10,
    stages: {
      1: 'Get past the guard at the Desert Gate and into Shadizar.',
      2: 'Find work. The Gilded Jackal, west off the Street of Lamps, is where the city\'s rogues drink.',
      3: 'Shevra says Madam Tullia is hiring. Her house is west off the Back Alleys, north of Statue Square.',
      4: 'Steal the Starheart from Azhrim\'s tower. First, get over the Tower Wall (east of the Back Alleys). A rope and a hook would do it.',
      5: 'You are over the wall. Get past the hounds in the Tower Garden.',
      6: 'Get past the two guards gambling in the Tower Hall.',
      7: 'Open the Smiling Door in the Tower Hall: make it smile.',
      8: 'Find the way up the Moon Stair. Tullia\'s painting had something to say about the moon.',
      9: 'Climb to the Tower Crown and take the Starheart.',
      10: 'You escaped Shadizar with the Starheart, and a new companion.',
    },
  },
  'e-spectacles': { name: 'The Scholar\'s Spectacles', errand: true, chapter: 1, done: 3, stages: { 1: 'A scholar on Temple Row lost his spectacles feeding the pigeons by the fountain in Statue Square.', 2: 'You found the spectacles. Return them to the scholar on Temple Row.', 3: 'The scholar can read again. Old Nimm will sell to you now.' } },
  'e-ledger': { name: 'Fat Ommo\'s Ledger', errand: true, chapter: 1, done: 2, stages: { 1: 'Fat Ommo\'s ledger was stolen by a jumpy pickpocket in the Back Alleys. Return it to Ommo in the Thieves\' Den before you go up the tower: once the Starheart job is done you leave Shadizar, and this errand is lost for good.', 2: 'Ommo has his ledger back and you have his loaded knucklebones.' } },
  'e-boots': { name: 'The Beggar\'s Boots', errand: true, chapter: 1, done: 2, stages: { 1: 'The old beggar on the Street of Lamps needs boots.', 2: 'The beggar has boots, and you have his lucky coin.' } },
};

const hints = [
  { if: 'quest:ch1-main==1', nudge: 'The guard wants a toll you can\'t pay. Look at him closely. And jackals have pelts.', answer: 'Look at the guard, then Talk to him and choose "Out-stare him". Or take the saddlebag from the dead camel, beat the jackal, and give the guard its pelt.' },
  { if: 'quest:ch1-main==2', nudge: 'Taverns are where work finds a man.', answer: 'Go north to the Street of Lamps, then west into the Gilded Jackal, and talk to the woman in leathers (Shevra) about work.' },
  { if: 'quest:ch1-main==3', nudge: 'Tullia lives off the Back Alleys.', answer: 'From Statue Square go north into the Back Alleys, then west into Tullia\'s House. Talk to Tullia and take the job.' },
  { if: 'quest:ch1-main==4 & !item:grapnel & !item:rope & gold<40', nudge: 'Hasdrubal sells rope, but it costs forty coppers. The city is full of ways to earn.', answer: 'Earn 40 gold: win rank 5 in the Pit (Doru, west of Statue Square), return Fat Ommo\'s ledger (the pickpocket in the Back Alleys has it), sell jackal pelts to the furrier in the Bazaar, or hunt jackals at the Desert Gate.' },
  { if: 'quest:ch1-main==4 & !item:grapnel & !item:rope', nudge: 'Hasdrubal in the Bazaar sells rope.', answer: 'Talk to Hasdrubal in the Bazaar and buy rope (40 gold).' },
  { if: 'quest:ch1-main==4 & !item:grapnel & !item:meat-hook', nudge: 'The butcher\'s hook is big enough to hang half a camel, and his dog would run to Khitai with a bone.', answer: 'Take a bone from the scrap bucket in the Gilded Jackal, use it on the skinny dog in the Bazaar, then take the meat hook while the butcher chases the dog.' },
  { if: 'quest:ch1-main==4 & !item:grapnel', nudge: 'A hook. A rope.', answer: 'Open the Bag and combine the rope with the meat hook to make a grapnel.' },
  { if: 'quest:ch1-main==4', nudge: 'The wall has a lip of carved stone at the top.', answer: 'Use the grapnel on the wall at the Tower Wall.' },
  { if: 'quest:ch1-main==5 & !item:drugged-sausage & !item:sausage', nudge: 'Dogs eat anything. Even trouble. Who sells food?', answer: 'Buy a sausage from Abulet in the Gilded Jackal (5 gold), and poppy tears from Old Nimm in the Bazaar. Combine them. (Or just fight the hounds.)' },
  { if: 'quest:ch1-main==5 & !item:drugged-sausage & !item:poppy-tears', nudge: 'Old Nimm the apothecary sells something that makes anything that eats snore till noon.', answer: 'Buy poppy tears from Old Nimm in the Bazaar (she sells when Shevra is with you), then combine them with the sausage.' },
  { if: 'quest:ch1-main==5 & !item:drugged-sausage', nudge: 'Put the sleep in the food.', answer: 'In the Bag, combine the sausage with the poppy tears.' },
  { if: 'quest:ch1-main==5', nudge: 'They\'ll eat whatever is thrown to them.', answer: 'Use the drugged sausage on the hounds. (Or choose Fight.)' },
  { if: 'quest:ch1-main==6 & !item:knucklebones & !item:ledger', nudge: 'The guards are one cheat away from killing each other. Who in Shadizar owns crooked dice?', answer: 'Fat Ommo (the Thieves\' Den, behind the Gilded Jackal) trades his loaded knucklebones for his stolen ledger. The jumpy pickpocket in the Back Alleys has it: have Shevra Steal it, or Grab him. (Or just fight the guards; they hate swords but fear maces.)' },
  { if: 'quest:ch1-main==6 & !item:knucklebones', nudge: 'Fat Ommo wants his ledger back.', answer: 'Give the ledger to Fat Ommo in the Thieves\' Den. He\'ll give you his loaded knucklebones.' },
  { if: 'quest:ch1-main==6', nudge: 'One more cheat and blood will flow.', answer: 'Use the loaded knucklebones on the guards.' },
  { if: 'quest:ch1-main==7 & !flag:c1-joke', nudge: 'The door wants a smile. Shevra mentioned a poet who made a statue laugh.', answer: 'Buy the drunk poet in the Gilded Jackal a cup (3 gold) and hear his joke. Then Talk to the Smiling Door and tell it.' },
  { if: 'quest:ch1-main==7', nudge: 'You know a joke that made a statue smile.', answer: 'Talk to the Smiling Door and tell the poet\'s joke about the Nameless Thief.' },
  { if: 'quest:ch1-main==8 & var:c1-mirror-tries<2', nudge: 'Tullia\'s painting: "Moon bows to the East, then the River, then the Throne." Look out of the windows.', answer: 'Turn the first mirror to face east, the second south (the river), the third north (the palace).' },
  { if: 'quest:ch1-main==8', nudge: 'East is the moonrise. The river is south. The throne is the palace, north.', answer: 'Turn the first mirror to face east, the second south, the third north.' },
  { if: 'quest:ch1-main==9', nudge: 'The way up is open.', answer: 'Go up into the Crown, talk to the iron man, and take the Starheart.' },
];

export default {
  id: 'ch1', num: 1, title: 'The City of Thieves',
  card: { img: 'bg-street', text: 'Shadizar the Wicked, where every lock has a price, and every price has a knife behind it.' },
  start: 'c1-gate',
  startDo: [
    { if: '!item:healing-draught', then: [{ give: 'healing-draught', n: 2, quiet: true }] },
    { quest: ['ch1-main', 1] },
  ],
  rooms,
  npcs: {},
  dialogues,
  items,
  enemies,
  shops: {
    'c1-hasdrubal': { name: "Hasdrubal's Arms", keeper: 'hasdrubal', greet: 'NO HAGGLING. NO CREDIT.', items: ['rope', 'broadsword', 'hand-axe', 'iron-mace', 'boar-spear', 'throwing-knives', 'sling', 'iron-cap', 'buckler', 'thief-leathers', 'healing-draught'] },
    'c1-abulet': { name: 'The Gilded Jackal', keeper: 'abulet', greet: 'Wine, sausages, and no questions.', items: ['sausage', 'healing-draught', 'antidote'] },
    'c1-nimm': { name: "Old Nimm's Apothecary", keeper: 'nimm', greet: 'Mind the jars. Some of them bite.', items: ['poppy-tears', 'healing-draught', 'antidote', 'mana-lotus', 'smoke-bomb'] },
  },
  quests,
  hints,
  combine: [
    { a: 'rope', b: 'meat-hook', make: 'grapnel', text: 'You knot the rope through the hook\'s eye, double it, and test it with your weight. A thief\'s ladder.' },
    { a: 'sausage', b: 'poppy-tears', make: 'drugged-sausage', text: 'You uncork the little bottle and soak the sausage until it drips. It smells delicious. It smells *sleepy*.' },
  ],
  scripts,
  partyUse: {},
};
