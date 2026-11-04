// Chapter V — The Night Shadizar Burned (and all three endings).
import { enemyStats } from '../data/balance.js';
import { ROOM } from './manifest.js';

// ---------------------------------------------------------------- shared bits
const VOID_FAMILY = { weak: ['holy', 'star'], resist: ['cold'], immune: ['void'] };
const FIRE_PHASE = { weak: ['cold', 'star'], resist: ['slash'], immune: ['fire'] };
const VOID_PHASE = { weak: ['holy', 'star'], resist: ['pierce'], immune: ['cold', 'void'] };

// Bel's blessing (c5-bel-blessing): +RES for the whole party in the final dungeon's battles.
const BLESS = {
  when: 'round>=1', if: 'flag:c5-bel-blessing',
  do: [{ buff: { target: 'party', stat: 'resUp', turns: 99 } }, { say: `Bel's blessing prickles along your arms like stolen silk. The dark slides off you a little easier.` }],
};
// The Redhand Company (c3-took-vault) at the Undercity Gate: a volley every round.
const REDHAND = {
  when: 'round>=1', every: 1, if: 'flag:c3-took-vault',
  do: [{ hit: { target: 'all', power: 50, text: 'The Redhand Company looses a volley from the broken wall!' } }],
};

const GATE_FIGHT = {
  id: 'c5-undercity-gate', noFlee: true,
  enemies: ['serpent-man', 'serpent-man', 'rift-horror', 'serpent-man'],
  intro: 'Serpent-men pour out of the dark between the old walls, and behind them something tears the air open.',
  triggers: [BLESS, REDHAND],
  win: [
    { say: `The last serpent-man hisses into ash. The rift-thing folds up into nowhere like a letter nobody wanted to read.` },
    { if: 'flag:c3-took-vault', then: [
      { line: ['c5-bosun', `Captain! We bought every sword in Shadizar, like you said. Then the city caught fire, so we kept the swords and lost the receipts.`] },
      { line: ['ilsa', `Ha! Hold this hole, you sea-dogs. Nothing comes up out of it but us.`] },
    ] },
    { quest: ['ch5-main', 3] },
  ],
};

// Pit fights (sq-pit stage counts ranks beaten).
const pitLose = [{ line: ['doru', `Down in the sand! The book pays out on the other fellow. Get up, barbarian, and try again when you've stopped bleeding.`] }];
const arena = (id, enemies, intro, stage, win) => ({
  fight: { id, enemies, arena: true, noFlee: true, bg: 'bg-arena@night', intro, lose: pitLose, win: [{ quest: ['sq-pit', stage] }, ...win] },
});

// ---------------------------------------------------------------- endings
const NINE_FAREWELL_A = [
  { if: 'party:nine', then: [
    { line: ['nine', `My people's stars should be visible from the deep desert, if they are still burning. I am going to look for them, friend Brannoc. I will write. I have recently learned what writing is for.`] },
    { say: `At dawn Nine walks south into the sand, slow and upright, its chest-light the last star to go out on the horizon.` },
  ] },
];

const KHALLA_GOOD = { if: 'flag:c5-khalla-beaten', then: [
  { line: ['khalla', `The snakes came up through the Pit drains all night. None got past the gate. Tell the next champion that, Cimmerian.`] },
  { say: `Khalla the Unbroken held the Pit gate till sunrise with a broken sword and a table leg. Doru is already selling seats to the story.` },
] };
const TULLIA_GOOD = { if: 'flag:c5-tullia-saved', then: [
  { say: `A week later Madam Tullia reopens her house, scented and lamplit, as an honest fence. Honest-ish. The painting of the moon over the river hangs crooked now, on purpose.` },
  { line: ['tullia', `Five hundred gold, I promised you. Consider it on account, darling. Forever.`] },
] };
const MORVAN_GOOD = { if: 'quest:sq-bride>=3', then: [
  { say: `Far out past the coast, when Ilsa raises her stern lantern, a green light answers it from an empty sea, three times, the old Redhand signal. She laughs and does not explain.` },
] };

const ENDING_A = [
  { music: 'ending' },
  { scene: { img: 'starheart', text: `You lift the Starheart. It beats in your fist like a second heart, and for a moment you hear what it has always been saying: a thousand iron men, a dying future, a single word. *Now.*` } },
  { say: `You drive it into the dragon's heart to the wrist. Blue-white fire runs up the veins of the beast like a lamp-wick catching.` },
  { line: ['ygg-sothar', `THIEF. LITTLE THIEF. YOU STOLE MY—`] },
  { sfx: 'dragon-roar' }, { shake: true },
  { say: `It never finishes. Ygg-Sothar tears loose from every age at once and falls back into the gaps between the worlds, and the hollow where it slept falls in after it. Half of Shadizar goes too: the Street of Lamps, three temples, the tax office, and a great many debts.` },
  { if: 'flag:c3-took-vault', then: [
    // ---- The Red Sails (Vault-branch variant of A)
    { scene: { img: 'bg-burning-square', text: `Red sashes everywhere. The Redhand Company comes down the broken streets with ropes and lanterns, hauling the wounded out of the pit, singing filthy songs to keep them awake.` } },
    { if: 'party:zelara', then: [
      { line: ['zelara', `Mitra's temple stands on the lip of the pit. Half of it, anyway. I will rebuild it. Your age needs a priestess more than mine did.`] },
      { say: `Zelara stays in Shadizar, sleeves rolled, bossing masons. Within a year the white shrine is the only building on Temple Row nobody dares to rob.` },
    ] },
    KHALLA_GOOD, TULLIA_GOOD,
    { line: ['shevra', `I'm taking a sack of gold, a fast horse and a new name. Don't come looking for me, Bear. Do come looking for me in a year or so.`] },
    { scene: { img: 'bg-ship-deck@dusk', text: `Ilsa Redhand, queen of a fleet bought with drowned kings' gold, stands at the rail of the *Sea-Wolf* and looks at you the way she looks at weather.` } },
    { line: ['ilsa', `Every road in Aquilonia is muddy, Cimmerian. I've a deck that needs a man who can't be killed. Come and be bored on the sea with me.`] },
    { line: ['brannoc', `Crom. Fine. But I'm not learning the knots.`] },
    MORVAN_GOOD,
    { scene: { img: 'bg-ship-deck@dusk', text: `The fleet puts out at dawn under red sails, twenty hulls riding high, and behind you Shadizar smokes against the sunrise, still standing, more or less.\n\nThe future is uncertain. But it has not been eaten yet.` } },
  ], else: [
    // ---- The Wanderer
    KHALLA_GOOD, TULLIA_GOOD,
    ...NINE_FAREWELL_A,
    { line: ['shevra', `I'm taking a sack of gold, a fast horse and a new name. Don't come looking for me, Bear. Do come looking for me in a year or so.`] },
    { line: ['ilsa', `My ship is in Messantia and my sea is out there. If you ever learn to swim, Cimmerian, come find me.`] },
    MORVAN_GOOD,
    { scene: { img: 'bg-ending-a', text: `You walk out of the west gate at dawn with an empty purse, a notched sword, and a face on a statue behind you. Westward lies Aquilonia, where they say the kings are fat and the wine is cheap.\n\nThere is always another city.` } },
  ] },
  { quest: ['ch5-main', 8], quiet: true },
  { set: 'c5-ending-a' },
  { ending: 'A' },
];

const ENDING_B = [
  { music: 'ancient' },
  { line: ['ygg-sothar', `YOU ARE THE FOUNDER. THE CITY IS YOURS. TAKE THE REST. EVERY AGE, EVERY THRONE, EVERY KING YOU EVER SPAT AT. KNEEL TO NOTHING, FOREVER.`] },
  { say: `The crown rises out of the beating light: serpent bone, warm, sized exactly for your head. It always was.` },
  { say: `You put it on. For a heartbeat you see all of it at once: Atlantis drowning, Aquilonia burning, iron men falling like rain on the Isle. Yours. All yours. The dragon's coils settle around your throne like a dog's tail.` },
  { sfx: 'dragon-roar' }, { shake: true },
  { scene: { img: 'bg-ending-b', text: `The Dragon-King of Shadizar does not die. He does not sleep. He sits on a throne built on a dragon's skull, and every age pays him tribute, and none of them love him.` } },
  { line: ['shevra', `I robbed kings for twenty years, Bear. I never wanted to be one. And I never, ever wanted to watch you turn into one.`] },
  { say: `Shevra turns her back and walks out of the throne-hall, and does not steal a single thing on the way. That is how you know she means it.` },
  { line: ['ilsa', `I'll not sail for a serpent. Not even one with your face.`] },
  { if: 'flag:c3-took-vault', then: [{ say: `At dawn the Red Sails put out from the coast and turn west, away from the Dragon-King's city, and do not come back.` }] },
  { if: 'quest:sq-bride>=3', then: [{ say: `Far out at sea, Ilsa raises her lantern three times. Nothing answers. Even the dead have stopped visiting.` }] },
  { if: 'party:zelara', then: [{ line: ['zelara', `I kept Mitra's light for a thousand years so a thing like you could not sit there. I will not bow.`] }, { say: `Zelara turns her back on the throne, and Mitra's temple is the first thing in Shadizar that you burn.` }] },
  { if: 'party:nine', then: [
    { say: `Nine walks up the steps and stands in front of the throne, close enough to touch. Its chest-light flickers.` },
    { line: ['nine', `Friend Brannoc. This is the future my people ran from. I am asking once. Please stop.`] },
    { say: `You do not stop. Nine stands there a long time. Then it walks away, slowly, the way it walked out of the past, and you never see its light again.` },
  ] },
  { if: 'flag:c5-khalla-beaten', then: [{ say: `Khalla the Unbroken is the first to kneel at the foot of the throne. She means it as a challenge. She is the first one you kill.` }] },
  { if: 'flag:c5-tullia-saved', then: [{ say: `Madam Tullia is the first to sell your likeness in the bazaar. She charges double and lights a candle to Mitra for every one she sells.` }] },
  { scene: { img: 'statue-serpent', text: `In Statue Square, under a sky that is never quite day, the face of the Nameless Thief changes in the night. The jaw is gone. The eyes are slits. The star in its hand has gone violet.\n\nThe city still calls him the founder. It does not say his name.` } },
  { quest: ['ch5-main', 8], quiet: true },
  { set: 'c5-ending-b' },
  { ending: 'B' },
];

const ENDING_C = [
  { music: 'ending' },
  { line: ['nine', `Friend Brannoc. My heart is a lesser engine, but it was made by the same hands. Joined to the Starheart, it can do what the legion was sent to do. Not drive the dragon off. Shut every door it has, in every age, at once.`] },
  { line: ['brannoc', `And you?`] },
  { line: ['nine', `I will be very tired. Let me finish what my people began.`] },
  { say: `You give it the Starheart. Nine opens its chest, and the two lights meet with a sound like a struck bell the size of the world.` },
  { sfx: 'star' }, { shake: true },
  { line: ['ygg-sothar', `NO. NO DOOR. I AM THE DOOR. I AM—`] },
  { say: `The dragon goes out of the world the way a dream goes out of a sleeper's head at cockcrow. Not falling. Simply *not there*, in this age or any other. The hollow under Shadizar fills with clean cold air, and the city above it stands.` },
  { scene: { img: 'bg-ending-c', text: `For one heartbeat, through the light, you see it: green hills under a gentle sun, a rebuilt city on them, and on the stump of a broken tower an iron giant standing guard. The future the iron men died for. Not eaten. Not even nibbled.` } },
  KHALLA_GOOD, TULLIA_GOOD,
  { say: `The priests of Mitra find a name carved on the oldest stone of their plinth, *Zelara of the Stones kept this light*, and that night they light a lamp beside it that has not gone out since.` },
  { line: ['shevra', `I'm taking a sack of gold, a fast horse and a new name. Don't come looking for me, Bear. Do come looking for me in a year or so.`] },
  { line: ['ilsa', `My ship is in Messantia and my sea is out there. If you ever learn to swim, Cimmerian, come find me.`] },
  MORVAN_GOOD,
  { say: `They carry Nine's iron body up to the stump of Azhrim's tower and stand it facing the desert. Its light is very dim. Every so often, when the wind is right, it turns its head.` },
  { line: ['nine', `Rest is a strange word, friend Brannoc. I think I like it.`] },
  { scene: { img: 'statue-two', text: `And in Statue Square, one morning, nobody can say quite how, the old plinth carries two figures: a big scowling thief and an iron man, holding one star between them.\n\nShadizar stands. The future is green. And Brannoc of Cimmeria walks west with an empty purse, whistling.` } },
  { quest: ['ch5-main', 8], quiet: true },
  { set: 'c5-ending-c' },
  { ending: 'C' },
];

const heartLook = [
  { say: `The heart of Ygg-Sothar hangs exposed in a cage of cracked ribs, the size of a house, scaled and glowing and slowly beating. The Starheart in your bag beats with it, out of step, like a man arguing.` },
  { line: ['ygg-sothar', `LITTLE FOUNDER. YOU HAVE WON. NOW CHOOSE WHAT WINNING MEANS.`] },
];
const endA = { 'Drive in the Starheart': [{ confirm: {
  text: 'Drive the Starheart into the dragon\'s heart? This ends the story (Ending A). The game saved "Before the Final Choice", so you can come back and choose again.',
  yesLabel: 'Drive it in', yes: ENDING_A, no: [{ say: `You weigh the Starheart in your hand. Not yet.` }],
} }] };
const endB = { 'Take the Crown': [{ confirm: {
  text: 'Take the crown Ygg-Sothar offers? This ends the story (Ending B).',
  yesLabel: 'Take it', yes: ENDING_B, no: [{ say: `You look at the crown a long moment. Then you spit on it. It hisses.` }],
} }] };
const endC = { 'Let Nine Finish It': [{ confirm: {
  text: 'Give Nine the Starheart and let it seal the dragon out of every age? This ends the story (Ending C).',
  yesLabel: 'Let Nine finish it', yes: ENDING_C, no: [{ line: ['nine', `I understand. I will wait. I am good at waiting.`] }],
} }] };

// ---------------------------------------------------------------- the Pit (Doru's slate, by sq-pit stage)
const PIT_CHOICES = [
  { id: 'rank5', text: `"Rank five. The Sand Rats. Again."`, if: 'quest:sq-pit==0', to: 'g', do: [arena('c5-pit-rank5', ['sand-rat-v', 'sand-rat-v'], 'The Sand Rats are back, and they have been practising for years!', 1, [
    { gold: 40 }, { line: ['doru', `Rank five, at long last! Your name moves up the slate, barbarian.`] }])] },
  { id: 'rank4', text: `"Rank four. The Kothian Twins."`, if: 'quest:sq-pit==1', to: 'g', do: [arena('c5-pit-rank4', ['kothian-twin-v', 'kothian-twin-v'], 'The Kothian Twins, older, greyer, still finishing each other\'s parries!', 2, [
    { gold: 80 }, { give: 'pit-gauntlets' }, { line: ['doru', `The Twins, down at last! Take the gauntlets, they're tradition.`] }])] },
  { id: 'rank3', text: `"Rank three. Ghaul and his wolves."`, if: 'quest:sq-pit==2', to: 'g', do: [arena('c5-pit-rank3', ['ghaul-v', 'wolf-v', 'wolf-v'], 'Ghaul the Hyrkanian, still without a horse, still angry about it!', 3, [
    { gold: 150 }, { give: 'hyrkanian-bow' }, { line: ['doru', `Ghaul's bow is yours. He'll want it back. Tell him no.`] }])] },
  { id: 'rank2', text: `"Rank two. The Iron Bull."`, if: 'quest:sq-pit==3', to: 'g', do: [arena('c5-pit-rank2', ['iron-bull'], 'The Iron Bull of Turan lowers his horned helm and charges!', 4, [
    { gold: 400 }, { give: 'bull-horn-helm' }, { xp: 300 },
    { line: ['doru', `The Bull is down! Somebody fetch a lever, we'll never get him out of that armour. Take his helm, barbarian. One more rank.`] }])] },
  { id: 'rank1', text: `"Rank one. Khalla."`, if: 'quest:sq-pit==4 & level>=18', to: 'g', do: [
    { line: ['khalla', `Finally.`] },
    arena('c5-pit-rank1', ['khalla'], 'Khalla the Unbroken steps onto the sand. The burning city goes quiet to watch.', 5, [
      { set: 'c5-khalla-beaten' }, { give: 'champions-greatsword' }, { xp: 750 },
      { sfx: 'sting-victory' },
      { say: `Khalla goes down on one knee in the sand, and for the first time in nine years, she stays there. The half-burned stands go mad.` },
      { line: ['khalla', `Unbroken. Not any more. Take the sword, champion. And hear me: the snakes come up through the Pit drains. I'll hold the gate. Nothing gets past me tonight.`] },
      { line: ['doru', `THE CHAMPION OF THE PIT OF SHADIZAR! On the night the city burns! I'm going to be *so* rich.`] },
    ])] },
  { id: 'rank1-wait', text: `"Rank one. Khalla."`, if: 'quest:sq-pit==4 & level<18', to: 'locked' },
  { id: 'odds', text: `"What are the odds tonight?"`, to: 'odds' },
  { id: 'champ', text: `"How's the book, Doru?"`, if: 'quest:sq-pit>=5', to: 'champ' },
  { id: 'bye', text: `"Later."`, end: true },
];

// ---------------------------------------------------------------- set pieces as data
const STATUE_PAYOFF = [
  { sfx: 'heartbeat' },
  { scene: { img: 'statue-brannoc', text: `Then you look up at the statue, and the world stops.\n\nThe fire has scoured a thousand years of lamp-soot off the Nameless Thief. For the first time in its life the stone face can be read. The jaw. The scowl. The nose somebody broke in Cimmeria. It's *you*. It has always been you.` } },
  { if: 'flag:c1-statue-seen', say: `You've stared at that jaw before, the first night you came to Shadizar. You thought it looked like a Cimmerian's. You had no idea.` },
  { line: ['shevra', `Fire's a better scrubber than the city council. Oh. *Oh*, Bear.`] },
  { line: ['brannoc', `Crom. They gave me a nose like a ram's.`] },
  { line: ['ilsa', `They gave you a *star*, Cimmerian. I'd stop complaining about the nose.`] },
  { if: 'party:nine', line: ['nine', `The statue has Original Human Brannoc's face. I believe this is what you call a family tradition.`] },
  { if: 'party:zelara', line: ['zelara', `Mitra keep us. You built a city, and forgot to tell it your name.`] },
  { line: ['shevra', `I'm never letting you forget this. When we're old I'll make you stand next to it and charge a copper a look.`] },
  { set: 'c5-statue-seen' },
];

const DOOR_OPENS = [
  { sfx: 'rumble' }, { shake: true },
  { say: `The word goes into the stone mouth and the whole wall *hears* it. Dust sifts from the lintel. The carved hand with the star seems to tighten its grip. Then, with a groan a thousand years deep, the founder's door swings inward.` },
  { sfx: 'gate-open' },
  { line: ['shevra', `Doors outlive people. I *told* you to remember it.`] },
  { set: 'c5-door-open' }, { xp: 30 }, { quest: ['ch5-main', 4] },
];
const doorDust = w => [
  { say: {
    Set: `"Set?" Shevra hisses. "To a door your own people hung? Bear, honestly."`,
    Mitra: `Mitra's name echoes politely off the stone. The door was hung by thieves. It has no opinion about Mitra.`,
    curse: `The mouth seems to consider this. It does not consider it for long.`,
  }[w] || `You say it clearly into the stone mouth. The stone mouth considers it.` },
  { sfx: 'refuse' },
  { say: `Then it coughs a cloud of thousand-year dust straight into your face. Somewhere in the cough, you'd swear, are the words *not that one, founder*.` },
  { line: ['shevra', `The picture under the mouth, Bear. Look at the picture. *You* chose it.`] },
];

const candleTest = m => [{ say: m === 'left'
  ? `You hold the thief's candle at the left mouth. The flame leans hard *into* the tunnel, then streams back toward you, in and out, slow as breathing. Living air.`
  : `You hold the thief's candle at the ${m} mouth. The flame stands perfectly still, then shrinks away from the dark and leans back toward the left-hand tunnel.` }];
const THROAT_NO_RETURN = `The left tunnel drops steeply into the Throat. Once you go down, there is no climbing back: only the priest, the dragon, and whatever comes after. Anything left undone up in the burning city stays undone.`;
const RIGHT_TUNNEL = [{ if: 'flag:c5-coil-path', then: [{ say: `The left tunnel breathes at you, warm and patient.` }], else: [
  { say: `You step into the left mouth. The air flows past you, warm, then draws back, like the breath of something enormous asleep. The floor slopes down, and down, and the light ahead beats red.` },
  { line: ['brannoc', `This one. It's breathing.`] },
  { sfx: 'sting-solved' },
  { set: 'c5-coil-path' }, { xp: 30 }, { quest: ['ch5-main', 5] }, { refresh: true },
] },
{ confirm: { text: THROAT_NO_RETURN, yesLabel: 'Go down', noLabel: 'Not yet', yes: [{ goto: 'c5-throat' }],
  no: [{ say: `You step back out to the junction. The left mouth breathes on, patient as a sleeping dog. It will wait (south, when you're ready).` }] } }];
const wrongTunnel = m => [
  { say: m === 'middle'
    ? `You step into the middle mouth. Ten paces in, the dark gets thicker, colder, and something with too many edges unfolds out of it.`
    : `You step into the right mouth. The clicking stops. Then it starts again, much closer, from every side at once.` },
  { fight: {
    id: 'c5-wrong-tunnel', noFlee: true, enemies: m === 'middle' ? ['serpent-man', 'serpent-man'] : ['serpent-man', 'cultist-fanatic', 'serpent-man'],
    intro: 'The tunnel was a lair!', triggers: [BLESS],
    win: [{ say: `You fight your way back out of the dead-end tunnel to the junction, breathing hard. The other mouths wait.` }],
  } },
];

// ---------------------------------------------------------------- the chapter
export default {
  id: 'ch5',
  num: 5,
  title: 'The Night Shadizar Burned',
  music: 'finale',
  card: { img: 'bg-burning-street', text: 'You come home out of the Stones a thousand years late, and find the city on fire.' },
  start: 'c5-ruins',
  startDo: [{ quest: ['ch5-main', 1], quiet: true }],

  npcs: {
    'c5-bosun': { name: 'Redhand Bosun', portrait: 'generic-man' },
    'c5-boy': { name: 'A Frightened Boy', portrait: 'generic-man' },
    'c5-refugee': { name: 'Refugee', portrait: 'generic-woman' },
    'c5-kneeler': { name: 'Kneeling Citizen', portrait: 'generic-man' },
    'c5-fanatic': { name: 'Dying Fanatic', portrait: 'generic-man' },
  },

  rooms: {
    // ------------------------------------------------------------ Tower Ruins
    'c5-ruins': {
      ...ROOM['c5-ruins'],
      desc: [
        { text: `You step out of the Standing Stones into the burned cellar of Azhrim's tower. The stones hiss and smoke behind you. Above, the tower is a black stump open to a red sky, and below the hill all Shadizar is burning.` },
        { if: 'won:c5-ruins-cultists', text: `Dead fanatics sprawl among the rubble. The ground shivers every few heartbeats, like something enormous turning over in its sleep.` },
      ],
      exits: { s: 'c5-alley' },
      first: [
        { scene: { img: 'bg-tower-ruins', text: `Home. A thousand years late and a night too early. The Stones spit you out into the ash of the tower you robbed, and the hill under your feet is *breathing*.` } },
        { line: ['shevra', `Shadizar. Smells like home. Home on fire, but still.`] },
        { line: ['ilsa', `Is the whole city supposed to glow like that, or is that the snake's doing?`] },
        { if: 'party:nine', line: ['nine', `Original Human Brannoc, we have arrived in your own year. The ground's movement matches a large organism waking. I recommend urgency.`] },
        { if: 'party:zelara', line: ['zelara', `So this is your age. It smells of smoke and wine and fear. Mitra, it needs me after all.`] },
        { say: `Red-robed shapes climb the rubble toward you, knives out, chanting the Worm's name.` },
        { fight: {
          id: 'c5-ruins-cultists', noFlee: true, enemies: ['cultist-fanatic', 'cultist-fanatic', 'cultist-fanatic'],
          intro: 'Cult fanatics swarm up the rubble, howling for the Worm!',
          win: [
            { line: ['brannoc', `Crom. Home a heartbeat and already stabbing people.`] },
            { say: `One fanatic is still breathing. He grins at you with red teeth.` },
            { line: ['c5-fanatic', `The Master wakes the Worm under the square... you are too late, thief... too late...`] },
            { say: `He dies smiling. You hate it when they do that.` },
            { quest: ['ch5-main', 1] },
          ],
        } },
      ],
      things: [
        { id: 'stones', name: 'The Standing Stones', look: [
          { say: `The ring of Stones sits in the tower's broken cellar, cracked, scorched, steaming like horses after a run. The crossing that brought you home has burned out of them. Whatever door they were, they are shut now.` },
          { once: 'c5-stones-banter', do: [{ line: ['shevra', `A thousand years, there and back, and I still haven't been paid for the first job.`] }] },
        ], take: `They weigh as much as a temple each. Even you have limits.`,
        use: { starheart: `You hold the Starheart up to the Stones. Nothing. They have done their work. The heart has a different job tonight.`, '*': `The Stones are done with doors for one night.` } },
        { id: 'stump', name: 'The Tower Stump', look: `What's left of Azhrim's tower: a black shell of stone, the spiral stair climbing up into nothing. Somewhere up there you once stole a heart.`,
          verbs: { Climb: [
            { say: `You climb the broken stair as high as it goes and look out over Shadizar. Fires everywhere; the Street of Lamps a river of flame. The worst of it rings Statue Square, and from under the square comes a glow that is not fire: slow, violet, pulsing like a heartbeat.` },
            { once: 'c5-stump-climb', do: [{ line: ['ilsa', `The square, then. Where the glow is. It always is, with snakes.`] }] },
          ] } },
        { id: 'chains', name: 'Broken Chains', look: [
          { say: `In the rubble lie the chains that held the Iron Watcher, the links fused together by the night the tower burned. A rust-red hand-print is still on one of them.` },
          { if: 'party:nine', then: [{ once: 'c5-chains-nine', do: [
            { line: ['nine', `A unit of my legion stood here. Unit Two-Hundred-and-Six. It came out of the wrong door and waited in chains for a thief.`] },
            { line: ['brannoc', `It found one.`] },
            { line: ['nine', `Yes. It chose well.`] },
          ] }] },
        ], take: `They're fused into the rock. And you've carried enough chains for one lifetime.` },
        { id: 'curios', name: "Azhrim's Smashed Cases", look: `Glass cases from Azhrim's collection lie smashed in the ash. Most of the curios melted. A few clay flasks with Stygian seals survived, which says something about Stygian clay.`,
          take: [{ if: 'once:c5-curios', say: `Nothing left but melted glass and bad memories.` }, { once: 'c5-curios', do: [
            { say: `You pick through the glass and come up with two sealed flasks of Stygian fire-oil. Azhrim won't miss them.` },
            { give: 'fire-flask', n: 2 },
          ] }] },
      ],
    },

    // ------------------------------------------------------------ Back Alleys
    'c5-alley': {
      ...ROOM['c5-alley'],
      desc: `The back alleys are a maze of smoke. Laundry lines burn overhead like strings of lanterns, dropping cinders on your shoulders. Somewhere a dog barks itself hoarse. This is the alley where Tullia's blades jumped you, a lifetime and a thousand years ago.`,
      exits: { n: 'c5-ruins', w: 'c5-street', s: 'c5-bazaar' },
      first: [
        { line: ['shevra', `Same alley. Same smell. Fewer friends of Ptahk's in it, I hope.`] },
        { line: ['shevra', `Don't trust your feet tonight, Bear. Half the walls in the quarter are down and the fire's cut new lanes through the old ones. The Street of Lamps is *west* of here now, through what used to be a dyer's house, and the Bazaar's straight south. Nothing's where it was. Very Shadizar.`] },
      ],
      things: [
        { id: 'laundry', name: 'Burning Laundry', look: `Someone's best robes, dyed saffron, burning beautifully on a line. A fortune in silk turning to fireflies.`,
          take: [{ line: ['shevra', `It's on fire, Bear. Even I don't steal things that are on fire.`] }] },
        { id: 'corner', name: 'The Old Ambush Corner', look: [
          { say: `Here's the corner where Tullia's hired blades and the cultists came at you, the night you stole the heart. The wall still carries a scorch the shape of a fireball.` },
          { once: 'c5-corner-banter', do: [
            { line: ['shevra', `Rescued by the man who paid for the knives. I'd laugh, if I weren't still so angry.`] },
            { line: ['brannoc', `He's under the city. Save the anger. You'll get to spend it.`] },
          ] },
        ], take: `It's a corner. It belongs to the alley.` },
        { id: 'boy', name: 'A Frightened Boy', kind: 'person', portrait: 'generic-man', talk: [
          { line: ['c5-boy', `D-don't hurt me! I'm not one of them! They took everyone from the perfume-house, the lady too, the one with all the rings. Dragged her to the temples, down in the cellars!`] },
          { if: '!quest:e-tullia>=1', quest: ['e-tullia', 1] },
          { once: 'c5-boy-coin', do: [{ choice: [
            { id: 'give-coin', text: `Give him a fistful of gold. "Get out of the city, boy."`, if: 'gold>=20', do: [
              { gold: -20 },
              { line: ['c5-boy', `G-gold? From a barbarian? Mitra bless you, sir!`] },
              { say: `He runs off toward the desert gate clutching the coins. Shevra watches him go with an expression she'd deny under torture.` },
            ] },
            { id: 'go-on', text: `"Hide somewhere stone. Go."`, do: [{ say: `He nods and vanishes into a cellar like a rat into a wall.` }] },
          ] }] },
        ], look: `A boy of ten, black with soot, hiding under a cart with a kitchen knife. He's trying very hard to look dangerous.` },
        { id: 'barrel', name: 'Rain Barrel', look: `A rain barrel, half full, with a cracked lid. The kind of place a careful thief keeps a stash.`,
          verbs: { Search: [{ if: 'once:c5-barrel', say: `Just rainwater, with ash on it.` }, { once: 'c5-barrel', do: [
            { say: `Under the lid, wrapped in oilcloth, someone's emergency stash: a stoppered red bottle.` },
            { give: 'great-draught' },
            { line: ['shevra', `Amateur. I'd have put it under the water.`] },
          ] }] } },
      ],
    },

    // ------------------------------------------------------------ Street of Lamps
    'c5-street': {
      ...ROOM['c5-street'],
      desc: [
        { text: `The Street of Lamps has become the street of one great lamp. Every hanging lantern has fallen and their oil runs burning down the gutters. Awnings flare and collapse. Cultists in red stalk through the smoke, dragging away anyone too slow to hide.` },
        { text: `West, the Gilded Jackal's door is shut and barred, a light behind its shutters. South, Statue Square glows brightest of all.` },
      ],
      exits: { e: 'c5-alley', w: 'c5-tavern', s: 'c5-square' },
      ambush: { chance: 0.3, groups: [['cultist-fanatic', 'cultist-fanatic'], ['serpent-man', 'cultist-fanatic']], text: 'Fanatics burst out of a burning doorway!' },
      first: [
        { line: ['ilsa', `I've seen ports burned by pirates. Pirates leave the taverns standing. These people have no manners.`] },
        { if: 'party:nine', line: ['nine', `Many small fires. One large heartbeat beneath. The heartbeat is the problem.`] },
        { if: 'party:zelara', line: ['zelara', `They're dragging people south. To the square. Feeding something.`] },
      ],
      things: [
        { id: 'lamps', name: 'The Fallen Lamps', look: `A hundred brass lamps lie in the street, dented and spilling. The lamp-makers of Shadizar will be rich next year, if there is a next year.`,
          take: `They're burning. Also, they're heavy. Also, see the first thing.` },
        { id: 'refugees', name: 'Refugees', kind: 'person', portrait: 'generic-woman', look: `A knot of townsfolk hiding in a doorway: a baker, two old women, a goat. They stare at you as if they've seen your face somewhere.`,
          talk: [
            { line: ['c5-refugee', `You! You look like... no. Never mind. Abulet's letting folk in at the Jackal, if you can get past the snakes. And the cultists are herding everyone else to the square.`] },
            { once: 'c5-refugee-gold', do: [{ choice: [
              { id: 'give', text: `Press some coin on them. "For the road."`, if: 'gold>=30', do: [{ gold: -30 }, { line: ['c5-refugee', `Bless you, stranger. You've a kind face. A familiar one.`] }] },
              { id: 'nod', text: `Nod and move on.`, do: [] },
            ] }] },
          ] },
        { id: 'banner', name: 'Serpent Banner', if: '!flag:c5-banner-down', look: `A long red banner with a coiled black serpent, nailed over the lamp-makers' guildhall. Somebody worked hard on the embroidery. Somebody should be punished.`,
          verbs: { 'Tear down': [
            { say: `You rip the banner down with one heave and throw it in the burning gutter. The serpent curls up and blackens.` },
            { line: ['c5-refugee', `Ha! Did you see that? Did you SEE that?`] },
            { set: 'c5-banner-down' },
          ] }, take: `It's nailed up high. Try tearing it down.` },
        { id: 'guard', name: 'A Fallen City Guard', look: `A city guard lies against a doorpost, his spear snapped, a dozen cultists' knife-cuts in him. He didn't run. You close his eyes.`,
          verbs: { Search: [{ if: 'once:c5-guard', say: `You've taken what he can spare. Let him rest.` }, { once: 'c5-guard', do: [
            { say: `In his belt pouch: a vial of smelling salts and a list of overdue bribes. You take the salts.` },
            { give: 'smelling-salts' },
          ] }] } },
      ],
    },

    // ------------------------------------------------------------ Gilded Jackal
    'c5-tavern': {
      ...ROOM['c5-tavern'],
      desc: `The Gilded Jackal is barred and shuttered, packed with frightened townsfolk sitting on the floor among the cushions. The carved jackal over the bar has an arrow in its eye. Abulet stands behind the bar with a meat cleaver and the face of a man who has decided that tonight, drinks are free.`,
      exits: { e: 'c5-street' },
      first: [
        { line: ['abulet', `You! The Cimmerian! Mitra's mercy, I thought you'd be dead or hanged by now. Get in, get in, bar the door behind you.`] },
        { line: ['shevra', `Abulet. Still watering the wine?`] },
        { line: ['abulet', `Tonight? Tonight I'm watering nothing. End of the world, the house pays.`] },
      ],
      things: [
        { id: 'abulet', name: 'Abulet', kind: 'person', portrait: 'abulet', talk: 'c5-abulet', look: `Abulet, round and sweating, a cleaver in one fist and a wine jug in the other. He's been pouring all night.` },
        { id: 'bar', name: 'The Bar', look: `The long bar, sticky with a decade of spilled wine. Above it the gilded jackal glares down with one good eye. The other has an arrow in it, cult-fletched.`,
          verbs: { Rest: [{ inn: 0, text: `Abulet waves at a pile of cushions in the back room. "Sleep, barbarian. On the house. Somebody should be rested when the floor wakes up."` }] } },
        { id: 'townsfolk', name: 'The Townsfolk', kind: 'person', portrait: 'generic-woman', look: `Sixty people on the floor, holding each other. Every time the ground shakes, the cups on the shelves chatter and someone starts to pray.`,
          talk: [
            { line: ['c5-refugee', `My grandmother always said "may the floor wake". It was a curse, you know? Just a thing you said. Nobody thought it *meant* anything.`] },
            { once: 'c5-townsfolk', do: [{ line: ['brannoc', `It means something tonight. Keep your heads down.`] }] },
          ] },
        { id: 'door', name: 'The Barred Door', look: `Three planks and a table hold the door. Something has been scratching at it from outside. It stopped a while ago, which is worse.`,
          take: `It's holding sixty lives together. Leave it.` },
      ],
    },

    // ------------------------------------------------------------ Statue Square
    'c5-square': {
      ...ROOM['c5-square'],
      desc: [
        { text: `Statue Square is a ring of fire. The fountain has collapsed into a black hole in the paving, and violet light pulses up out of it with the slow beat of a sleeping heart. Above it all stands the statue of the Nameless Thief, lit gold by the flames.` },
        { if: 'flag:c5-statue-seen', text: `The statue's face, scoured clean by the fire, is unmistakably yours.` },
        { text: `Steps of broken fountain stone lead *down* into the hole.` },
      ],
      exits: { n: 'c5-street', w: 'c5-pit', e: 'c5-bazaar', d: { to: 'c5-undercity', label: 'Into the hole' } },
      first: [
        { fight: {
          id: 'c5-square-cultists', noFlee: true, enemies: ['cultist-fanatic', 'serpent-man', 'cultist-fanatic'],
          intro: 'Fanatics guarding the hole turn on you, and something scaled climbs up out of it!',
          win: [{ say: `The last of them topples into the fountain hole. You hear it fall for a long, long time.` }],
        } },
        ...STATUE_PAYOFF,
        { quest: ['ch5-main', 2] },
      ],
      things: [
        { id: 'statue', name: 'The Statue', look: [
          { scene: { img: 'statue-brannoc', text: `The Nameless Thief, founder of Shadizar, holding up his star. The soot is gone. The face is yours: the jaw, the scowl, the nose someone broke in Cimmeria. Even the scar.` } },
          { once: 'c5-statue-again', do: [{ line: ['shevra', `I'm going to make you stand next to it. Every day. For money.`] }] },
        ], take: `It's a ton of stone with your face on it. Even you can't carry that much ego.`,
        use: { starheart: `You hold the Starheart up beside the stone star. The statue's star is a rough lump of granite. The sculptor never saw the real thing up close. Fair enough: neither did you, until you stole it.`, '*': `You hold it up to the statue. Stone-you looks unimpressed. Stone-you has always looked unimpressed.` } },
        { id: 'hole', name: 'The Fountain Hole', look: `The fountain has fallen through the paving into a cavity below. Stairs of broken basin-stone spiral down into the dark. Far below: old walls, older than the city, and a violet glow that beats.`,
          verbs: { Listen: [{ sfx: 'heartbeat' }, { say: `You kneel at the lip and listen. Down there, far below the city, something vast is breathing. Slow. Deep. Every breath a little shorter than the last. Waking.` }] } },
        { id: 'kneelers', name: 'Kneeling Citizens', kind: 'person', portrait: 'generic-man', if: 'won:c5-square-cultists', look: `A dozen townsfolk the cultists had herded here, now kneeling at the statue's foot, looking from the stone face to yours and back again.`,
          talk: [
            { line: ['c5-kneeler', `Founder! The Nameless Thief has come back to save his city! Just like the old songs!`] },
            { line: ['brannoc', `I have a name.`] },
            { line: ['c5-kneeler', `Of course, lord! What is it?`] },
            { line: ['shevra', `Don't you dare tell them, Bear. It'll ruin the legend.`] },
          ] },
        { id: 'pigeons', name: 'Pigeons', look: `The pigeons of Statue Square, unbothered by the end of the world, sit on the statue's head as they have for a thousand years. On *your* head.`,
          take: `They scatter at your hand, then come right back. They've known you longer than anyone.` },
      ],
    },

    // ------------------------------------------------------------ The Pit
    'c5-pit': {
      ...ROOM['c5-pit'],
      desc: `The Pit's stands are half-burned and the betting board is cracked, but the sand is raked and torches burn around the ring. Doru the Lanista sits at his table with his book open. Even the end of the world has odds.`,
      exits: { e: 'c5-square' },
      first: [
        { line: ['doru', `Ha! The Cimmerian! I had you at forty to one to be dead. Never mind, the house covers it.`] },
        { line: ['ilsa', `You're running fights? Tonight?`] },
        { line: ['doru', `My dear lady, the end of the world is the *best* night for it. Nobody's saving their money.`] },
      ],
      things: [
        { id: 'doru', name: 'Doru the Lanista', kind: 'person', portrait: 'doru', talk: 'c5-doru', look: `Doru, fat and jewelled, with his book and his abacus. The book is open to a page headed "BRANNOC (CIMM.)".` },
        { id: 'khalla', name: 'Khalla the Unbroken', kind: 'person', portrait: 'khalla', talk: 'c5-khalla', look: [
          { if: '!flag:c5-khalla-beaten', say: `Khalla the Unbroken, champion of the Pit, sharpening a greatsword taller than Shevra. She has watched you since you came in, the way a lioness watches a goat that might be a wolf.` },
          { if: 'flag:c5-khalla-beaten', say: `Khalla the Unbroken, champion no longer, binding her ribs. She looks happier than you've ever seen her. She has something to do tonight.` },
        ] },
        { id: 'board', name: 'The Betting Board', look: [
          { say: `Chalked on the cracked board: "END OF THE WORLD: 3 to 1. CITY SURVIVES: 9 to 1. CIMMERIAN SAVES IT: 200 to 1."` },
          { once: 'c5-board-bet', do: [{ line: ['shevra', `Put fifty on the Cimmerian for me, Doru.`] }, { line: ['doru', `Done. Your funeral, darling. Or the world's.`] }] },
        ] },
        { id: 'sand', name: 'The Sand', look: `Raked smooth. A few old bloodstains, a few new ones. Your own bootprints from years ago are long gone, but you still remember where you fell the first time.`,
          take: `You pick up a handful of Pit sand and let it run out of your fist. There. Very dramatic.` },
      ],
    },

    // ------------------------------------------------------------ Bazaar
    'c5-bazaar': {
      ...ROOM['c5-bazaar'],
      desc: `The covered bazaar burns overhead, its canvas roof a sheet of fire. Stalls lie overturned. In the middle of the ruin, under a wet tarpaulin, Hasdrubal has set up a handcart loaded with the best steel left in Shadizar, and he's still haggling.`,
      exits: { n: 'c5-alley', w: 'c5-square', e: 'c5-temple' },
      first: [
        { line: ['hasdrubal', `Barbarian! I knew you'd come back. Your kind always do, the night the price is highest.`] },
      ],
      things: [
        { id: 'hasdrubal', name: 'Hasdrubal', kind: 'person', portrait: 'hasdrubal', talk: 'c5-hasdrubal', look: `Hasdrubal the armorer, singed beard, leather apron, a crossbow under the cart and a ledger in his teeth.` },
        { id: 'cart', name: "Hasdrubal's Cart", look: `A handcart piled with the city's last good steel: a temple blade, a Stygian greataxe, gilded plate off some fled prince, and a dagger Hasdrubal swears is the founder's own.`,
          verbs: { Browse: [{ shop: 'c5-cart' }] } },
        { id: 'nimm', name: "Old Nimm's Stall", look: `Old Nimm's apothecary is shuttered tight. A sign on the door: "BACK SOON. DON'T." Somewhere behind it, something is bubbling.`,
          take: [{ line: ['shevra', `Steal from Nimm? On the night the world ends? Bear, I want to die *of* the dragon, not of whatever she'd put in my tea.`] }] },
        { id: 'hooks', name: "The Butcher's Hooks", look: `The butcher's stall is empty, the meat long gone. The great hooks still hang there, big enough to hang half a camel. You've used one before. You feel oddly sentimental about it.`,
          take: `You already own enough rope-and-hook memories for a lifetime.` },
      ],
    },

    // ------------------------------------------------------------ Temple Row
    'c5-temple': {
      ...ROOM['c5-temple'],
      desc: [
        { text: `Temple Row burns. The columns of Bel's porch are black with smoke, but the old priest still sits on its steps. Across the way, the little white shrine of Mitra has been smashed and smeared with serpent signs. The shrine of Set stands dark and empty: its priests are all underground tonight.` },
        { text: `Behind Bel's porch, a cellar stair leads *down*. Someone is shouting down there.` },
      ],
      exits: { w: 'c5-bazaar', d: 'c5-cellar' },
      first: [
        { if: 'party:zelara', line: ['zelara', `That shrine. Those signs on it. I have seen this before, a thousand years ago, at the foot of the Stones.`] },
        { if: 'party:nine', line: ['nine', `The small white building has been damaged on purpose. People do that to things they are afraid of.`] },
      ],
      things: [
        { id: 'priest', name: 'The Priest of Bel', kind: 'person', portrait: 'bel-priest', talk: 'c5-bel-priest', look: `The old priest of Bel, god of thieves, sitting on his steps with a lamp, as if waiting for a late visitor. When he sees your face he starts to laugh.` },
        { id: 'mitra', name: "Mitra's Shrine", look: [
          { if: 'party:zelara', then: [
            { if: '!flag:c5-mitra-cleansed', then: [
              { scene: { img: 'bg-temple-row@fire', text: `Zelara walks into the wrecked shrine without a word. She kneels in the broken glass, wipes the serpent-filth off Mitra's sun with her own sleeve, and prays. Her voice is steady. The fire outside seems to lean away from the white stone.` } },
              { line: ['zelara', `A thousand years ago they burned my shrine at the Stones. Tonight they will not have this one. Take these. Mitra's water, blessed in her own house.`] },
              { give: 'holy-water', n: 3 },
              { set: 'c5-mitra-cleansed' },
              { line: ['brannoc', `Crom doesn't do this sort of thing.`] },
              { line: ['zelara', `I know. That's why you have me.`] },
            ], else: [{ say: `The shrine is clean now, the sun on its altar faintly bright. Zelara's prayer hangs in the air like the smell after rain.` }] },
          ], else: [
            { say: `The shrine is smashed and daubed with serpent signs. But at the foot of the plinth the oldest stone is untouched, its carving worn almost smooth. You crouch and read it by firelight: *Zelara of the Stones kept this light.*` },
            { once: 'c5-mitra-stone', do: [
              { line: ['brannoc', `She kept it a thousand years. We'll keep it a night.`] },
              { if: 'party:nine', line: ['nine', `She gave us the Frost Flask. I remember. I am glad someone else remembered her too.`] },
            ] },
          ] },
        ] },
        { id: 'set-shrine', name: 'Shrine of Set', look: `The serpent shrine is a black mouth in the temple wall. The idol is gone from its niche, and a trail of slime leads from it to a drain. Everything in Set's house has gone down to meet its god.`,
          verbs: { Kick: [{ if: 'once:c5-kick-set', say: `It's already broken. You kick it again anyway. Still satisfying.` }, { once: 'c5-kick-set', do: [{ say: `You kick the empty altar. It cracks across the middle with a very satisfying noise.` }, { line: ['shevra', `Feel better?`] }, { line: ['brannoc', `Yes.`] }] }] } },
        { id: 'porch', name: "Bel's Porch", look: `The god of thieves' temple has no doors, only columns: Bel's priests say a god who locks his house deserves to be robbed. Tonight even the cult hasn't dared go in.`,
          take: `There's nothing in Bel's temple worth stealing. That's the joke. That's always been the joke.` },
      ],
    },

    // ------------------------------------------------------------ Temple Cellar
    'c5-cellar': {
      ...ROOM['c5-cellar'],
      desc: [
        { text: `A low vaulted cellar under Bel's temple, stacked with crates the cult has looted from half the city. Candles burn on a crude serpent altar.` },
        { if: '!flag:c5-tullia-saved', text: `Tied to a pillar beside it, scented and furious and missing most of her rings, is Madam Tullia.` },
        { if: 'flag:c5-tullia-saved', text: `The ropes that held Tullia lie cut on the floor.` },
      ],
      exits: { u: 'c5-temple' },
      first: [
        { line: ['tullia', `Oh, *wonderful*. Of all the cellars in all of Shadizar.`] },
        { fight: {
          id: 'c5-cellar-cultists', noFlee: true, enemies: ['cultist-fanatic', 'cultist-fanatic'],
          intro: 'Two fanatics at the altar draw curved knives. "The perfumed one is the Worm\'s! Find your own!"',
          win: [{ say: `The fanatics drop across their own altar. The candles gutter.` }, { if: '!quest:e-tullia>=1', quest: ['e-tullia', 1] }],
        } },
      ],
      things: [
        { id: 'tullia', name: 'Madam Tullia', kind: 'person', portrait: 'tullia', talk: 'c5-tullia', if: '!flag:c5-tullia-saved',
          look: `Madam Tullia, the Nemedian fence who hired you for the Starheart and then sold you to the knives. Tied to a pillar, perfume and soot and rage. She still has one ring. You suspect it's hidden somewhere unpleasant.`,
          hot: 'won:c5-cellar-cultists & !flag:c5-tullia-saved' },
        { id: 'altar', name: 'Serpent Altar', look: `A slab of stone painted with a coiled serpent. A bowl on it holds blood that isn't quite dry. You don't ask whose.`,
          verbs: { Overturn: [{ if: 'once:c5-altar', say: `It's already upside down, and it's staying that way.` }, { once: 'c5-altar', do: [{ say: `You heave the altar over. The bowl shatters. Under the slab, in a hollow, the cult hid its pay-chest.` }, { gold: 150 }] }] } },
        { id: 'crates', name: 'Looted Crates', look: `Crates of loot from half the city: candlesticks, carpets, a harp, and, propped against the wall, a big painting of a moon over a river and a throne-dome. Tullia's painting, from her salon.`,
          take: `You don't have room for a harp. You barely have room for your sense of humor.` },
      ],
    },

    // ------------------------------------------------------------ The Undercity
    'c5-undercity': {
      ...ROOM['c5-undercity'],
      desc: [
        { text: `Under the streets of Shadizar lies another Shadizar: the buried first walls, mud-brick and gold-veined stone, older than every temple above. The ceiling is the underside of the square. Violet light pulses from somewhere far below.` },
        { text: `Ahead stands a postern in walls older than the city, carved with a hand holding a star: the same hand as the statue's. It has no handle, only a stone mouth, and under the mouth a worn pictogram.` },
        { if: 'flag:c5-door-open', text: `The founder's door stands open on a tunnel that slopes down into the dark.` },
      ],
      exits: {
        u: { to: 'c5-square', label: 'Up to the square' },
        s: { to: 'c5-coils', if: 'flag:c5-door-open', blocked: `The founder's door is shut. Its stone mouth waits for a word.` },
      },
      first: [
        { say: `You climb down the broken fountain into the dark, and your boots land on paving older than any city on earth. You know these walls. You watched them go up.` },
        { line: ['shevra', `Bear. Bear, these are *your* walls. Kesh's walls. We were here when they were *mud*.`] },
        { if: 'flag:c3-took-vault', then: [
          { say: `Boots on the stairs behind you. Red sashes. Thirty cutthroats with crossbows come down the fountain hole two at a time, grinning.` },
          { line: ['c5-bosun', `Captain Redhand! The Company bought every sword in Shadizar, like you ordered. Where d'you want 'em pointed?`] },
          { line: ['ilsa', `HA! At the snakes, you beautiful dogs! Fire at will!`] },
          { fight: { ...GATE_FIGHT, start: { hp: 0.6 } } },
        ], else: [
          { fight: GATE_FIGHT },
        ] },
      ],
      things: [
        { id: 'founders-door', name: "The Founder's Door", look: [
          { if: '!flag:c5-door-open', say: `A low postern of black stone set in the first wall. In its lintel: a hand holding a star, carved by someone who'd seen it done. No handle, no lock, no hinges you can see. Only a stone mouth at head height, lips parted, waiting to be spoken to.` },
          { if: 'flag:c5-door-open', say: `The founder's door stands open. Its stone mouth looks almost smug.` },
          { once: 'c5-door-banter', do: [{ line: ['shevra', `You were there, Bear. Kesh asked you. What word did you give them?`] }] },
        ],
        verbs: { Speak: [{ if: 'flag:c5-door-open', then: [{ say: `You clear your throat at the open door. It ignores you. It has done its job.` }], else: [{ choice: [
          { id: 'crom', text: `"Crom!"`, do: [{ if: 'var:c4-door-word==1', then: [...DOOR_OPENS], else: [...doorDust('Crom')] }] },
          { id: 'melon', text: `"Melon!"`, do: [{ if: 'var:c4-door-word==2', then: [...DOOR_OPENS], else: [...doorDust('Melon')] }] },
          { id: 'shevra', text: `"Shevra!"`, do: [{ if: 'var:c4-door-word==3', then: [...DOOR_OPENS], else: [...doorDust('Shevra')] }] },
          { id: 'set', text: `"Set!"`, do: [...doorDust('Set')] },
          { id: 'mitra', text: `"Mitra!"`, do: [...doorDust('Mitra')] },
          { id: 'curse', text: `"Open, curse you!"`, do: [...doorDust('curse')] },
        ], prompt: 'You lean close to the stone mouth. What do you say?' }] }] },
        use: { starheart: `You hold the Starheart up to the stone mouth. It glows nicely on the carved lips. The door does not care. It wants a word, not a jewel.`, '*': `The stone mouth doesn't eat. It *listens*.` } },
        { id: 'pictogram', name: 'The Worn Pictogram', look: [
          { say: `Under the stone mouth, worn by a thousand years of damp, someone cut a little picture with a chisel and great care.` },
          { if: 'var:c4-door-word==1', say: `It shows a mountain with a storm for a crown, lightning cracking off its peak. A god's mountain.` },
          { if: 'var:c4-door-word==2', say: `It shows a round fruit, striped, with a single leaf on top. Someone has carved it very lovingly. It is unmistakably a melon.` },
          { if: 'var:c4-door-word==3', say: `It shows a slim woman with a knife in one hand and, unless the stone lies, her other hand in somebody's purse.` },
          { if: '!var:c4-door-word>=1', say: `It's been worn almost smooth. You can make out a round fruit, striped, with a single leaf on top. A melon?` },
          { once: 'c5-picto-banter', do: [{ line: ['ilsa', `Grandsons with chisels. That's how the old words survive, Cimmerian. Someone cuts a picture so the fool who chose them can remember.`] }] },
        ] },
        { id: 'walls', name: 'The First Walls', look: [
          { say: `Mud-brick faced with stone, the stone veined with gold the nomads hacked from the dragon's hoard. You remember the grandsons slapping on the mud. You remember Kesh shouting at them about the corners.` },
          { if: 'flag:c4-done', say: `Low on one stone, cut in the nomads' scratchy hand, someone has added: *KESH'S BOYS HUNG THIS DOOR. KESH SAYS TIP THEM.*` },
          { once: 'c5-walls-banter', do: [{ line: ['shevra', `A thousand years and she's still asking for money. I could weep.`] }] },
        ] },
        { id: 'glow', name: 'The Violet Glow', look: `Light seeps up through cracks in the old paving, violet, beating. With every pulse the gold veins in the walls shine for a heartbeat, and the dust on the floor shivers.`,
          verbs: { Listen: [{ sfx: 'heartbeat' }, { say: `Thump. A long pause. Thump. Below the door, below everything.` }] } },
      ],
    },

    // ------------------------------------------------------------ The Coil Tunnels
    'c5-coils': {
      ...ROOM['c5-coils'],
      desc: [
        { text: `Beyond the founder's door the passage opens into a junction of three tunnel mouths, bored through the rock by something round and enormous. The walls are smooth as the inside of a gut and faintly scaled. The air shimmers violet.` },
        { text: `Three mouths: left, middle, right. Only one goes down to the dragon's throat. Whatever the other two go to, it's hungry.` },
        { if: 'flag:c5-coil-path', text: `The left mouth, the warm one, the breathing one, leads down. The way to the Throat.` },
      ],
      exits: {
        n: { to: 'c5-undercity', label: "The founder's door" },
        s: { to: 'c5-throat', if: 'flag:c5-coil-path', label: 'Down the left mouth', noReturn: THROAT_NO_RETURN },
      },
      first: [
        { say: `Two shapes peel themselves off the junction walls: rents in the world with claws on their edges.` },
        { fight: {
          id: 'c5-coil-keepers', noFlee: true, enemies: ['rift-horror', 'rift-horror'], triggers: [BLESS],
          intro: 'Rift-horrors guard the junction!',
          win: [{ say: `The rift-horrors fold up into nothing. The three tunnel mouths breathe at you.` }, { quest: ['ch5-main', 4] }],
        } },
        { line: ['shevra', `Three doors and two of them are traps. My favourite kind of job. Somebody find me which one's *breathing*.`] },
      ],
      things: [
        { id: 'mouth-left', name: 'The Left Mouth', look: `The left tunnel breathes warm, slow, like a sleeper. Every few heartbeats a gust comes out of it, smelling of hot stone and old gold, and then draws back in.`,
          verbs: { Enter: RIGHT_TUNNEL },
          use: { 'thief-candle': candleTest('left'), '*': `The tunnel swallows nothing that small. It's waiting for you.` } },
        { id: 'mouth-middle', name: 'The Middle Mouth', look: `The middle tunnel breathes nothing at all. A cold wind whistles *past* it rather than out of it, and the dark inside is too dark, as if light gives up a little way in.`,
          verbs: { Enter: wrongTunnel('middle') },
          use: { 'thief-candle': candleTest('middle'), '*': `You hold it up to the middle mouth. The dark does not care.` } },
        { id: 'mouth-right', name: 'The Right Mouth', look: `The right tunnel clicks. Wet little clicks, far in, like many teeth tapping. The air coming out of it is cold and smells of nothing.`,
          verbs: { Enter: wrongTunnel('right') },
          use: { 'thief-candle': candleTest('right'), '*': `Something in the right mouth clicks at you, interested.` } },
        { id: 'coil-walls', name: 'The Scaled Walls', look: [
          { say: `You lay your palm on the tunnel wall. It's warm. It's *scaled*. These aren't tunnels the dragon dug: they're the shapes its coils left in the rock as it settled, a thousand years ago, buried under your city's gold.` },
          { once: 'c5-coil-walls', do: [
            { line: ['ilsa', `We're crawling around inside its old bed, then. Like fleas in a dog's blanket.`] },
            { if: 'party:nine', line: ['nine', `Only one of these tunnels connects to the organism. A living thing breathes. Follow the breath.`] },
            { if: 'party:zelara', line: ['zelara', `The living path breathes. The dead ones only whistle. Mitra's priests taught that of caves. It holds for monsters too.`] },
          ] },
        ] },
      ],
    },

    // ------------------------------------------------------------ The Throat
    'c5-throat': {
      ...ROOM['c5-throat'],
      desc: [
        { text: `The Throat: a vast gullet of rock and scale, lit from below by fire, falling away toward a light that beats like a drum. Bridges of the dragon's own ribs cross the chasm.` },
        { if: 'won:c5-thoth', text: `Thoth-Seketh lies broken on the rib-bridge. Below, the heart of the dragon throbs, waiting.` },
      ],
      exits: { s: { to: 'c5-heart', if: 'won:c5-thoth', blocked: 'Thoth-Seketh stands on the rib-bridge between you and the heart.', label: "The Dragon's Heart" } },
      enter: [{ if: '!won:c5-thoth', then: [
        { scene: { img: 'bg-dragon-caves@fire', text: `On the rib-bridge over the chasm, robed in black and gold, waits a tall thin figure with a face like a serpent's and eyes like old coins. He bows, slowly. You'd know that bow anywhere: you've watched it a hundred times, complaining about its knees.` } },
        { line: ['thoth-seketh', `My bear. You took the long way round. I did warn you about your sense of direction.`] },
        { line: ['shevra', `Ptahk. Or whatever's left of him under the scales.`] },
        { line: ['thoth-seketh', `Thoth-Seketh, child. Ptahk was a hat I wore. A comfortable one. I do miss the knees. Mine have been perfect for three thousand years, and nobody pities me for them.`] },
        { line: ['thoth-seketh', `You sealed my god under a city and named the city after yourself. Very funny. But a thousand years of sleep has made it hungry, and tonight its sleep is ripe. Give me the heart, Brannoc, as you always have. You carry it so *carefully*.`] },
        { line: ['brannoc', `Come and take it, old man.`] },
        { if: 'party:nine', line: ['nine', `You argued for my death on the Isle. I have thought about that a great deal. I would like to discuss it with my piston.`] },
        { if: 'party:zelara', line: ['zelara', `You burned my shrine at the Stones. I have walked a thousand years to say this: Mitra sees you.`] },
        { if: 'item:serpent-charm', then: [{ line: ['shevra', `Bear! Tullia's serpent charm, the one in your bag. *Wear* it, you great ox. Snake curses slide right off it, and he's all snake.`] }] },
        { line: ['ilsa', `And drink when you bleed, Cimmerian. A draught in the bag never saved anyone.`] },
        { fight: {
          id: 'c5-thoth', boss: true, noFlee: true, music: 'boss', enemies: ['thoth-true'],
          intro: 'Thoth-Seketh, High Priest of the Serpent, throws off his robe!',
          triggers: [
            BLESS,
            { when: 'round>=2', do: [{ line: ['thoth-seketh', `Children of the Coil! To your father!`] }, { summon: ['c5-thoth-spawn', 'c5-thoth-spawn'] }] },
            { when: 'hp<0.5', enemy: 'thoth-true', do: [{ line: ['thoth-seketh', `You were *supposed* to be the stupid one!`] }, { summon: ['c5-thoth-spawn', 'c5-thoth-spawn'] }] },
          ],
          win: [
            { say: `Thoth-Seketh staggers to the edge of the rib-bridge, clutching at the air.` },
            { line: ['thoth-seketh', `You'd have made... a magnificent... servant...`] },
            { line: ['brannoc', `I never served anyone. Not even you, Ptahk.`] },
            { say: `He falls. He falls a long way, into the light, and the heart below swallows him without a sound.` },
            { line: ['shevra', `That's for Tullia's knives. And for the jokes about your knees. They were terrible.`] },
            { say: `The Starheart in your bag flares, warm as a hand on your back. Your wounds close. Your breath comes back. Whatever is left of the Watcher's people is with you.` },
            { heal: true },
            { quest: ['ch5-main', 6] },
          ],
        } },
      ] }],
      things: [
        { id: 'thoth-body', name: 'The Priest\'s Robe', if: 'won:c5-thoth', look: [
          { say: `All that's left of Thoth-Seketh on the bridge is his black-and-gold robe. Under it, folded neatly, you find a familiar pair of quilted Khitan knee-wraps.` },
          { once: 'c5-kneewraps', do: [{ line: ['shevra', `He *kept* them. Three thousand years old, perfect knees, and he kept the knee-wraps.`] }, { line: ['ilsa', `Everyone needs a hobby.`] }] },
        ], take: `You leave the knee-wraps where they lie. Let the dragon have them.` },
        { id: 'ribs', name: 'The Rib-Bridge', look: `A bridge made of one of the dragon's ribs, grown over the chasm like a white root. It's warm under your boots, and it moves, very slightly, every time the heart below beats.` },
        { id: 'chasm', name: 'The Chasm', look: `Down and down, fire and scale, to a light that beats. Heat rises in waves that make your eyes water. Somewhere down there is the heart of the thing that ate the future.`,
          verbs: { Spit: [{ say: `You spit into the chasm. It sizzles a long way down.` }, { once: 'c5-spit', do: [{ line: ['shevra', `Barbarian diplomacy.`] }] }] } },
      ],
    },

    // ------------------------------------------------------------ The Dragon's Heart
    'c5-heart': {
      ...ROOM['c5-heart'],
      desc: [
        { if: '!flag:c5-dragon-down', text: `A cavern the size of a city, and in the middle of it, a heart. Scaled, glowing, beating, as big as a house. Around it the coils of Ygg-Sothar fill the dark, and above them a head the size of a galley turns toward you.` },
        { if: 'flag:c5-dragon-down', text: `Ygg-Sothar lies broken in its own cavern, its coils slack, its great head on the stone. Only the heart still beats, exposed in a cage of cracked ribs, waiting. Far above, through the hole you fell through, a sliver of Shadizar's burning sky.` },
      ],
      exits: {},
      enter: [{ if: '!flag:c5-dragon-down', then: [
        { scene: { img: 'bg-dragon-heart', text: `Ygg-Sothar, the Dragon Between Worlds, wakes. Its coils grind through a thousand years of your city's foundations. Its eyes open, and in each one you see a different sky.` } },
        { line: ['ygg-sothar', `LITTLE THIEF. YOU AGAIN. YOU BURIED ME UNDER GOLD AND NAMED THE GRAVE AFTER YOURSELF. I REMEMBER YOUR SMELL.`] },
        { line: ['brannoc', `Good. Remember this too.`] },
        { line: ['ilsa', `Ha! Look at the size of it! What a night to be alive!`] },
        { if: 'flag:c5-khalla-beaten', say: `Somewhere far above, faint through the rock, you hear the roar of the Pit crowd and Khalla's voice bellowing at the cult. The city is holding.` },
        { fight: {
          id: 'c5-final', boss: true, noFlee: true, music: 'boss-dragon', enemies: ['final-head', 'final-coil', 'final-coil'],
          intro: 'Ygg-Sothar, Between Worlds, rises! Its coils blaze with fire!',
          triggers: [
            BLESS,
            { when: 'round>=1', do: [{ phase: 'fire' }, { say: `Fire runs along the dragon's scales. Cold and starlight will bite it now; fire only feeds it.` }] },
            { when: 'hp<0.66', enemy: 'final-head', do: [
              { phase: 'void' }, { sfx: 'dragon-roar' }, { shake: true },
              { line: ['ygg-sothar', `I AM BETWEEN. I AM NOWHERE. STRIKE AT NOTHING.`] },
              { say: `The fire goes out of the dragon and the void pours in: its scales turn violet and half-there. Holy light and starfire still find it; cold falls through it.` },
            ] },
            { when: 'hp<0.33', enemy: 'final-head', do: [
              { phase: 'fire' }, { sfx: 'dragon-roar' }, { shake: true },
              { line: ['ygg-sothar', `BURN, THEN. BURN WITH YOUR CITY.`] },
              { say: `The dragon blazes up again, fire-born and desperate. Cold and starlight, now!` },
            ] },
            { when: 'dead', enemy: 'final-head', do: [
              { sfx: 'dragon-roar' }, { shake: true },
              { say: `The great head crashes down onto the cavern floor. The coils thrash once and go slack, and the ribs around the heart crack open like a gate.` },
              { endBattle: 'win' },
            ] },
          ],
          win: [
            { set: 'c5-dragon-down' },
            { autosave: 'final' },
            { scene: { img: 'bg-dragon-heart', text: `Ygg-Sothar lies broken. Its heart hangs exposed and beating in the cage of its ribs, and the Starheart in your bag beats with it, faster and faster, as if it knows what comes next.` } },
            { line: ['shevra', `Bear. Whatever you're going to do with that thing, do it before it gets up.`] },
            { quest: ['ch5-main', 7] },
          ],
        } },
      ] }],
      things: [
        { id: 'dragon-heart', name: "The Dragon's Heart", if: 'flag:c5-dragon-down & !party:nine', look: heartLook, verbs: { ...endA, ...endB },
          use: { starheart: [{ say: `To drive the Starheart in, choose "Drive in the Starheart". You want to be sure.` }], '*': `The heart beats on, indifferent. This is not a night for small gestures.` } },
        { id: 'dragon-heart-nine', name: "The Dragon's Heart", if: 'flag:c5-dragon-down & party:nine', look: [...heartLook,
          { line: ['nine', `Friend Brannoc. There is a third way. My heart and the Starheart were made by the same hands. Let me finish what my people began.`] }],
          verbs: { ...endA, ...endB, ...endC },
          use: { starheart: [{ say: `To drive the Starheart in, choose "Drive in the Starheart". You want to be sure.` }], '*': `The heart beats on, indifferent. This is not a night for small gestures.` } },
        { id: 'dragon-eye', name: "Ygg-Sothar's Eye", kind: 'person', portrait: 'ygg-sothar', if: 'flag:c5-dragon-down', look: [
          { say: `One eye is still open, huge as a shield, and in it you see skies that aren't this one: a drowned city, a green hill, a red world under a black sun.` },
          { line: ['ygg-sothar', `A CROWN, LITTLE FOUNDER. OVER EVERY AGE. YOU HAVE ONLY TO REACH FOR IT.`] },
        ], talk: [{ line: ['brannoc', `You ate a world.`] }, { line: ['ygg-sothar', `I EAT ALL OF THEM. I AM VERY OLD AND VERY HUNGRY. I COULD STOP, FOR A KING WHO ASKED.`] }, { line: ['brannoc', `Crom. You're a worse liar than Ptahk.`] }] },
        { id: 'friends', name: 'Your Companions', kind: 'person', portrait: 'shevra', if: 'flag:c5-dragon-down', look: `Your friends, bloodied and grinning and waiting for you to decide. Nobody says it, but every one of them is looking at the heart.`,
          talk: [
            { line: ['shevra', `Don't look at me, Bear. You're the founder. Found something.`] },
            { line: ['ilsa', `Whatever you do, do it like you mean it. I hate a man who hesitates at sea.`] },
            { if: 'party:nine', line: ['nine', `I have an offer, friend Brannoc. Look at the heart when you are ready to hear it.`] },
            { if: 'party:zelara', line: ['zelara', `The dragon will offer you everything. Remember that it ate everything, too.`] },
          ] },
      ],
    },
  },

  // ---------------------------------------------------------------- dialogues
  dialogues: {
    'c5-abulet': {
      start: 'a',
      nodes: {
        m: { who: 'abulet', text: `Anything else? The roof won't hold forever.`, choices: [
          { id: 'what', text: `"What happened here?"`, to: 'what' },
          { id: 'tullia', text: `"Seen Madam Tullia?"`, to: 'tullia' },
          { id: 'statue', text: `"Why does everybody keep staring at me?"`, to: 'statue' },
          { id: 'gift', text: `"Got anything stronger than wine?"`, to: 'gift', if: '!once:c5-abulet-gift' },
          { id: 'rest', text: `"I need a bed."`, to: 'rest' },
          { id: 'bye', text: `"Keep the door barred."`, end: true },
        ] },
        a: { who: 'abulet', text: `What'll it be, Cimmerian? Wine's free, food's free, the roof's on fire. Ask quick.`, choices: [
          { id: 'what', text: `"What happened here?"`, to: 'what' },
          { id: 'tullia', text: `"Seen Madam Tullia?"`, to: 'tullia' },
          { id: 'statue', text: `"Why does everybody keep staring at me?"`, to: 'statue' },
          { id: 'gift', text: `"Got anything stronger than wine?"`, to: 'gift', if: '!once:c5-abulet-gift' },
          { id: 'rest', text: `"I need a bed."`, to: 'rest' },
          { id: 'bye', text: `"Keep the door barred."`, end: true },
        ] },
        what: { who: 'abulet', text: `Three nights ago the ground started heaving. Last night the fountain in the square fell in, and out of the hole came cultists. Hundreds. And things with scales. They're herding folk down into the hole like goats. "Food for the Worm", they say.`, next: 'what2' },
        what2: { who: 'abulet', text: `My grandmother used to say "may the floor wake" when she wanted to curse someone. I always thought it was just a thing you said.`, goto: 'm' },
        tullia: { who: 'abulet', text: `Tullia? The cult dragged her out of her house screaming. Her and her perfume. Took her up Temple Row, to the cellars under Bel's porch. Can't say I wept, but... nobody deserves the Worm.`, do: [{ if: '!quest:e-tullia>=1', quest: ['e-tullia', 1] }], goto: 'm' },
        statue: { who: 'abulet', text: `You haven't seen? The fire burned the soot off the old Nameless Thief in the square. Half the city's down there on its knees. He's got your face, Cimmerian. Your exact ugly face.`, next: 'statue2' },
        statue2: { who: 'shevra', text: `I've been telling him for days. He won't listen. He's very modest, for a city.`, goto: 'm' },
        gift: { who: 'abulet', text: `For the founder of Shadizar? Heh. Here: my last bottle of Elixir of Bel, kept for my own funeral. If you're going down that hole, you'll need it more than I will.`, do: [{ once: 'c5-abulet-gift', do: [{ give: 'elixir-of-bel' }] }], goto: 'm' },
        rest: { who: 'abulet', text: `Back room. On the house.`, do: [{ inn: 0, text: `Abulet waves at a pile of cushions in the back room. "Sleep, barbarian. Somebody should be rested when the floor wakes up."` }], goto: 'm' },
      },
    },

    'c5-hasdrubal': {
      start: 'a',
      nodes: {
        m: { who: 'hasdrubal', text: `Anything else, barbarian? I've a city to overcharge.`, choices: [
          { id: 'shop', text: `"Show me what you've got."`, do: [{ shop: 'c5-cart' }], to: 'a' },
          { id: 'why', text: `"Why are you still here?"`, to: 'why' },
          { id: 'fang', text: `"That dagger. The founder's?"`, to: 'fang' },
          { id: 'bye', text: `"Stay alive, Hasdrubal."`, end: true },
        ] },
        a: { who: 'hasdrubal', text: `Best steel left in Shadizar, barbarian. Prices reflect the apocalypse.`, choices: [
          { id: 'shop', text: `"Show me what you've got."`, do: [{ shop: 'c5-cart' }], to: 'm' },
          { id: 'why', text: `"Why are you still here?"`, to: 'why' },
          { id: 'fang', text: `"That dagger. The founder's?"`, to: 'fang' },
          { id: 'bye', text: `"Stay alive, Hasdrubal."`, end: true },
        ] },
        why: { who: 'hasdrubal', text: `Because tonight every man in Shadizar wants a sword, and tomorrow, if there's a tomorrow, they'll all want to sell them back. I win twice. Forty years in the trade, I never once got to win twice.`, goto: 'm' },
        fang: { who: 'hasdrubal', text: `Shadizar's Fang. Dug out of the founder's own foundations, they say, by my grandfather's grandfather. Probably a lie. Still a fine dagger.`, next: 'fang2' },
        fang2: { who: 'shevra', text: `Bear. *Bear.* Did you lose a dagger in the mud a thousand years ago?`, next: 'fang3' },
        fang3: { who: 'brannoc', text: `It was yours.`, next: 'fang4' },
        fang4: { who: 'shevra', text: `...I'm buying back my own dagger. From the future. At a markup. This is the worst day of my life.`, goto: 'm' },
      },
    },

    'c5-doru': {
      start: 'g',
      nodes: {
        g: { who: 'doru', if: 'quest:sq-pit<3', else: 'g2', text: `Your name's still on the slate, barbarian. Unfinished business from years back. The book's been waiting, and the book never forgets.`, choices: PIT_CHOICES },
        g2: { who: 'doru', if: 'quest:sq-pit<5', else: 'g3', text: `Ranks two and one, Cimmerian. The top of the slate. Only for blades with real scars on them.`, choices: PIT_CHOICES },
        g3: { who: 'doru', text: `The champion of the Pit of Shadizar! On the night the city burns! You're the best thing that's happened to my book since the plague.`, choices: PIT_CHOICES },
        locked: { who: 'doru', text: `Khalla? Not yet, not yet. Look at you: you've got the scars, but not enough of them. Come back with more of a reputation. (Rank 1 needs level 18.)`, goto: 'g' },
        odds: { who: 'doru', text: `End of the world, three to one. The city lives, nine to one. You saving it single-handed, two hundred to one. I'd bet against you myself, but it seems rude.`, goto: 'g' },
        champ: { who: 'doru', text: `Every seat sold, champion. The cult won't touch the Pit: Khalla's on the gate. Go and kill a god, there's a good lad. I've money on it.`, goto: 'g' },
      },
    },

    'c5-khalla': {
      start: 'a',
      nodes: {
        a: { who: 'khalla', if: '!flag:c5-khalla-beaten', else: 'b', text: `Cimmerian. I saw you fight here years ago. You were raw meat with a sword. Now you have the look of a man who has killed things with no names.`, choices: [
          { id: 'fight', text: `"Fight me, then."`, to: 'fight' },
          { id: 'city', text: `"The city's burning. Why are you sitting here?"`, to: 'city' },
          { id: 'bye', text: `Leave her to her whetstone.`, end: true },
        ] },
        fight: { who: 'khalla', text: `Not with your fists, outside the sand. Ask Doru. Fight me in the Pit, under the rules, and if you win, I'll do whatever you say. Even save this stinking city.`, goto: 'a' },
        city: { who: 'khalla', text: `I am the champion of the Pit. I fight in the Pit. I don't fight for cities. Cities never paid me. Beat me, and maybe I'll learn something new.`, goto: 'a' },
        b: { who: 'khalla', text: `You beat me fair. Nobody's done that in nine years. So: the snakes come up through the drains under the sand. I'll hold the Pit gate. Nothing gets past me tonight. Go and kill whatever's under the square.`, choices: [
          { id: 'thanks', text: `"Hold it till dawn."`, to: 'b2' },
          { id: 'bye', text: `Nod and go.`, end: true },
        ] },
        b2: { who: 'khalla', text: `Till dawn. And then, Cimmerian, I want a rematch.` },
      },
    },

    'c5-bel-priest': {
      start: 'a',
      nodes: {
        m: { who: 'bel-priest', text: `What else, founder? The god of thieves is listening. He always is.`, choices: [
          { id: 'lore', text: `"Tell me about the founder."`, to: 'lore' },
          { id: 'bless', text: `"Bless us, priest. We're going down."`, to: 'bless', if: 'once:c5-lore & !flag:c5-bel-blessing' },
          { id: 'candle', text: `"Got a light?"`, to: 'candle', if: '!item:thief-candle' },
          { id: 'tullia', text: `"Someone's shouting in your cellar."`, to: 'tullia', if: '!flag:c5-tullia-saved' },
          { id: 'bye', text: `"Pray for us, old man."`, end: true },
        ] },
        a: { who: 'bel-priest', text: `Ha! Ha ha! Sit, sit. I told you the founder came from nowhere and went nowhere. I didn't think *nowhere* would come back for his statue.`, choices: [
          { id: 'lore', text: `"Tell me about the founder."`, to: 'lore' },
          { id: 'bless', text: `"Bless us, priest. We're going down."`, to: 'bless', if: 'once:c5-lore & !flag:c5-bel-blessing' },
          { id: 'candle', text: `"Got a light?"`, to: 'candle', if: '!item:thief-candle' },
          { id: 'tullia', text: `"Someone's shouting in your cellar."`, to: 'tullia', if: '!flag:c5-tullia-saved' },
          { id: 'bye', text: `"Pray for us, old man."`, end: true },
        ] },
        lore: { who: 'bel-priest', text: `The oldest temple scrolls say: a thief came out of the Stones with a star in his fist and fire at his heels. He robbed a dragon in its own bed, buried it under its own gold, and walked back into the Stones. The nomads built a city on the grave so nobody would ever dig it up.`, next: 'lore2' },
        lore2: { who: 'bel-priest', text: `And they set a door in the first walls, the founder's door, that opens only for the founder's word. Nobody's opened it in a thousand years. Nobody knew the word. Do you?`, next: 'lore3' },
        lore3: { who: 'brannoc', text: `I said it once. A thousand years ago. Felt like last week.`, next: 'lore4' },
        lore4: { who: 'bel-priest', text: `Ha! Bel loves a thief who can't keep his story straight. Ask me for a blessing before you go down, founder. You'll want one.`, do: [{ once: 'c5-lore', do: [] }], goto: 'm' },
        bless: { who: 'bel-priest', text: `Kneel. Not to me. To the god of thieves, who never asks anyone to kneel twice.`, next: 'bless2' },
        bless2: { who: 'narrator', text: `The old priest dabs wine on your brow, and Shevra's, and Ilsa's, and your last companion's, and mutters a prayer that sounds a lot like a list of pockets. Something prickly and quick settles on your skin.`,
          do: [{ set: 'c5-bel-blessing' }, { sfx: 'buff' }, { toast: "Bel's Blessing: more resistance in the battles below" }], next: 'bless3' },
        bless3: { who: 'bel-priest', text: `Bel's blessing. Sorcery slides off a thief like a hand off oiled skin. It'll hold till the bottom of the world. After that you're on your own.`, goto: 'm' },
        candle: { who: 'bel-priest', text: `A thief's candle. Rendered from a temple mouse that stole from Bel and got away with it. Its flame leans toward living air, always. Under the earth that's worth more than a sword.`, do: [{ give: 'thief-candle' }], next: 'candle2' },
        candle2: { who: 'bel-priest', text: `Lose it and come back. I've a box of them. Bel's mice are very successful.`, goto: 'm' },
        tullia: { who: 'bel-priest', text: `The cult's down there with some perfumed woman. They think Bel's house is safe because nobody robs Bel. Ha! Go and rob them, founder. Bel will consider it a tithe.`, do: [{ if: '!quest:e-tullia>=1', quest: ['e-tullia', 1] }], goto: 'm' },
      },
    },

    'c5-tullia': {
      start: 'a',
      nodes: {
        a: { who: 'tullia', if: 'won:c5-cellar-cultists', else: 'z', text: `Well? Are you going to stand there enjoying this, or cut me loose? I'll admit, darling, you have every reason to enjoy it.`, choices: [
          { id: 'why', text: `"Tell me why I should."`, to: 'why' },
          { id: 'cut', text: `Cut her loose.`, to: 'cut' },
        ] },
        z: { who: 'tullia', text: `Brannoc, there are two men with knives behind you. I mention it purely in passing.` },
        why: { who: 'tullia', text: `Because I owe you five hundred gold and a confession, and I can't pay either tied to a pillar.`, next: 'why2' },
        why2: { who: 'shevra', text: `She also sold us to the knives in that alley. Just reminding everyone.`, choices: [
          { id: 'cut-anyway', text: `Cut her loose anyway.`, to: 'cut' },
        ] },
        cut: { who: 'narrator', text: `You cut the ropes. Tullia rubs her wrists, straightens what's left of her silks, and for once in her life doesn't smile.`, next: 'conf' },
        conf: { who: 'tullia', text: `The blades in the alley. Yes, I hired them. A Khitan paid me double to set it up: which alley, which night, which way you'd run. A funny old man, always complaining about his knees.`, next: 'conf2' },
        conf2: { who: 'tullia', text: `I never asked why a Khitan paid in Stygian gold. I should have. Greed makes you stupid. I'm told it does the same to barbarians, but you seem to have been spared.`, next: 'conf3' },
        conf3: { who: 'brannoc', text: `He's under the city. I'll give him your regards.`, next: 'gift' },
        gift: { who: 'tullia', text: `Give him this instead. A serpent charm, Stygian work: wards off venom and the void. I took it off a priest who stopped needing it. I owe you more, darling. Consider this... on account.`,
          do: [{ give: 'serpent-charm' }, { set: 'c5-tullia-saved' }, { quest: ['e-tullia', 2] }, { xp: 200 }], next: 'bye' },
        bye: { who: 'tullia', text: `Now if you'll excuse me, I have a house to reopen, a painting to steal back, and a great deal of perfume to buy. Don't die, Brannoc. It would be terribly bad for business.` },
      },
    },
  },

  // ---------------------------------------------------------------- items
  items: {
    'thief-candle': { name: "Thief's Candle", type: 'key', icon: 'scroll@gold', desc: 'A stub of yellow candle from the priest of Bel. Its flame always leans toward living air.' },
  },

  // ---------------------------------------------------------------- enemies
  enemies: {
    'cultist-fanatic': {
      ...enemyStats(17, 'minion'), name: 'Cult Fanatic', sprite: 'cultist', tint: 'red', size: 'm',
      weak: ['pierce', 'holy'], resist: [], immune: [],
      desc: 'A red-robed zealot of the Worm, drunk on the end of the world.',
      skills: [
        { name: 'Frenzied Knife', power: 1.3, dmg: 'slash', chance: 0.3, sfx: 'slash' },
        { name: "Set's Curse", magic: true, el: 'void', power: 1.0, chance: 0.25, status: { poison: 0.3 }, sfx: 'debuff' },
      ],
      attackDmg: 'slash', drops: [{ id: 'cult-sigil', chance: 0.4 }],
    },
    'serpent-man': {
      ...enemyStats(18, 'minion'), name: 'Serpent-Man', sprite: 'serpent-man', size: 'm', ...VOID_FAMILY,
      desc: 'One of the old race of the Coil, scaled and cold-eyed, risen from under the city. Holy light and starfire burn it.',
      skills: [
        { name: 'Void Fang', magic: true, el: 'void', power: 0.9, chance: 0.25, sfx: 'bite' },
        { name: 'Coil Strike', power: 1.2, dmg: 'pierce', chance: 0.2, status: { poison: 0.25 } },
      ],
      attackDmg: 'pierce', drops: [{ id: 'serpent-scale', chance: 0.3 }],
    },
    'c5-thoth-spawn': {
      ...enemyStats(18, 'minion'), xp: 0, gold: 0, name: 'Child of the Coil', sprite: 'serpent-man', tint: 'violet', size: 'm', ...VOID_FAMILY,
      desc: "A serpent-man called up by Thoth-Seketh's sorcery. It fights for its master and leaves nothing behind.",
      skills: [{ name: 'Void Fang', magic: true, el: 'void', power: 1.0, chance: 0.3, sfx: 'bite' }],
      attackDmg: 'pierce', drops: [],
    },
    'rift-horror': {
      ...enemyStats(19, 'brute'), name: 'Rift-Horror', sprite: 'rift-horror', size: 'l', ...VOID_FAMILY,
      desc: 'A tear in the world with claws along its edges. What looks out of it is hungry.',
      skills: [
        { name: 'Unmaking', magic: true, el: 'void', power: 0.7, chance: 0.2, target: 'all', sfx: 'debuff' },
        { name: 'Rend', power: 1.4, dmg: 'slash', chance: 0.3, sfx: 'slash' },
      ],
      attackDmg: 'slash', drops: [{ id: 'serpent-scale', chance: 0.5 }],
    },
    'thoth-true': {
      ...enemyStats(19, 'boss'), name: 'Thoth-Seketh', sprite: 'thoth-true', size: 'l',
      weak: ['pierce', 'holy'], resist: [], immune: [],
      desc: 'High Priest of the Serpent, unmasked: no knees to complain of now. Pierce and holy light find his heart.',
      skills: [
        { name: 'Curse of the Coil', magic: true, el: 'void', power: 0.75, chance: 0.2, target: 'all', status: { fear: 0.15 }, sfx: 'debuff' },
        { name: 'Venom Bolt', magic: true, el: 'void', power: 1.3, chance: 0.3, status: { poison: 0.4 }, sfx: 'debuff' },
        { name: 'Lotus Flame', magic: true, el: 'fire', power: 1.2, chance: 0.2, msg: '(an old trick of Ptahk\'s)', sfx: 'fire' },
      ],
      attackDmg: 'pierce', drops: [],
    },
    'final-head': {
      ...enemyStats(19, 'boss'), name: 'Ygg-Sothar', sprite: 'dragon-final-head', size: 'xl', pos: 'center',
      ...FIRE_PHASE, phases: { fire: FIRE_PHASE, void: VOID_PHASE },
      desc: 'The Dragon Between Worlds. Fire phase: cold and star wound it, fire feeds it. Void phase: holy and star; cold passes through.',
      skills: [
        { name: 'Breath of Burning Ages', magic: true, el: 'fire', power: 0.7, chance: 0.25, target: 'all', phase: 'fire', status: { burn: 0.25 }, sfx: 'fire' },
        { name: 'Maw of Nowhere', magic: true, el: 'void', power: 0.7, chance: 0.25, target: 'all', phase: 'void', status: { fear: 0.2 }, sfx: 'dragon-roar' },
        { name: 'Devouring Bite', power: 1.4, dmg: 'pierce', chance: 0.25, sfx: 'bite' },
      ],
      attackDmg: 'pierce', drops: [],
    },
    'final-coil': {
      ...enemyStats(19, 'boss', { hp: 0.4, xp: 0.3 }), name: 'Coil of Ygg-Sothar', sprite: 'dragon-final-coil', size: 'l', pos: 'left',
      ...FIRE_PHASE, phases: { fire: FIRE_PHASE, void: VOID_PHASE },
      desc: 'A coil of the dragon, thick as a tower. It crushes what the head misses.',
      skills: [{ name: 'Crushing Coil', power: 1.2, dmg: 'blunt', chance: 0.25, status: { stun: 0.2 }, sfx: 'blunt' }],
      attackDmg: 'blunt', drops: [],
    },
    'iron-bull': {
      ...enemyStats(16, 'brute'), name: 'The Iron Bull of Turan', sprite: 'iron-bull', size: 'l',
      weak: ['blunt'], resist: ['slash'], immune: [],
      desc: 'A Turanian giant in horned plate. Swords skate off him; hammers and sorcery do not.',
      skills: [
        { name: 'Bull Rush', power: 1.5, dmg: 'blunt', chance: 0.3, status: { stun: 0.25 }, sfx: 'blunt' },
        { name: 'Horn Gore', power: 1.3, dmg: 'pierce', chance: 0.25 },
      ],
      attackDmg: 'blunt', drops: [],
    },
    khalla: {
      ...enemyStats(18, 'boss', { hp: 0.6 }), name: 'Khalla the Unbroken', sprite: 'khalla-fight', size: 'l',
      weak: [], resist: [], immune: [],
      desc: 'Champion of the Pit for nine years. She has no weakness anyone has lived to report.',
      skills: [
        { name: 'Unbroken Cleave', power: 1.2, dmg: 'slash', chance: 0.3, target: 'all', sfx: 'slash' },
        { name: 'Champion\'s Roar', buff: { atkUp: 3 }, chance: 0.15, sfx: 'roar' },
        { name: 'Pommel Crack', power: 1.4, dmg: 'blunt', chance: 0.2, status: { stun: 0.3 } },
      ],
      attackDmg: 'slash', drops: [],
    },
  },

  shops: {
    'c5-cart': {
      name: "Hasdrubal's Cart", keeper: 'hasdrubal',
      items: ['bel-blade', 'stygian-greataxe', 'hammer-of-bel', 'shadizars-fang', 'star-lance-module', 'gilded-plate', 'tower-shield', 'thief-kings-mail',
        'great-draught', 'elixir-of-bel', 'mana-lotus', 'smelling-salts', 'holy-water', 'frost-flask-item', 'fire-flask', 'antidote'],
    },
  },

  quests: {
    'ch5-main': {
      name: 'The Night Shadizar Burned', main: true,
      stages: {
        1: 'Shadizar is burning and something vast is waking under it. The glow is brightest under Statue Square.',
        2: 'The fountain in Statue Square has fallen into the old city below. Climb down into the Undercity.',
        3: "The founder's door in the first walls opens only for the word you gave Kesh's grandsons a thousand years ago.",
        4: 'Three tunnel mouths in the Coil Tunnels; only one leads to the dragon. Find the one that breathes.',
        5: 'Go down into the Throat, where Thoth-Seketh waits.',
        6: "Thoth-Seketh is dead. Go down to the Dragon's Heart.",
        7: "Ygg-Sothar lies broken. Its heart is exposed. Decide how this ends.",
        8: 'It is over.',
      },
      done: 8,
    },
    'e-tullia': {
      name: "Tullia's Last Deal", errand: true, chapter: 5,
      stages: { 1: 'The cult dragged Madam Tullia to the cellar under Bel\'s temple on Temple Row.', 2: 'Tullia is free, and has confessed who paid for the alley ambush.' },
      done: 2,
    },
  },

  hints: [
    { if: 'quest:ch5-main==1 & !visited:c5-square', nudge: 'Climb the tower stump and look over the city: where is the strange glow?', answer: 'Go south through the Back Alleys, west to the Street of Lamps, then south to Statue Square.' },
    { if: 'quest:ch5-main==2', nudge: 'The fountain in Statue Square has fallen in. Where does the hole lead?', answer: 'In Statue Square, take the exit Down (into the hole) to the Undercity.' },
    { if: 'quest:ch5-main==3 & var:c4-door-word==1', nudge: 'Look at the pictogram under the stone mouth. What word did Brannoc give Kesh at the First Walls?', answer: 'Use the Speak verb on the founder\'s door and say "Crom!" (the storm-crowned mountain).' },
    { if: 'quest:ch5-main==3 & var:c4-door-word==3', nudge: 'Look at the pictogram under the stone mouth. What word did Brannoc give Kesh at the First Walls?', answer: 'Use the Speak verb on the founder\'s door and say "Shevra!" (the woman with a knife).' },
    { if: 'quest:ch5-main==3', nudge: 'Look at the pictogram under the stone mouth. What word did Brannoc give Kesh at the First Walls?', answer: 'Use the Speak verb on the founder\'s door and say "Melon!" (the round striped fruit).' },
    { if: 'quest:ch5-main==4 & !flag:c5-coil-path', nudge: 'Look at each tunnel mouth. Which one breathes like a sleeper? (The priest of Bel\'s thief\'s candle leans toward living air.)', answer: 'Enter the Left Mouth: it breathes warm and slow. Then go south.' },
    { if: 'quest:ch5-main==4 & flag:c5-coil-path', nudge: 'You found the living tunnel.', answer: 'Go south from the Coil Tunnels, down into the Throat.' },
    { if: 'quest:ch5-main==5', nudge: 'Thoth-Seketh is a sorcerer of the Serpent.', answer: 'Pierce weapons and holy light hurt him most. Kill his summoned serpent-men with holy or star attacks.' },
    { if: 'quest:ch5-main==6', nudge: 'The dragon changes between fire and void.', answer: 'Fire phase: cold and star. Void phase: holy and star. Frost Flasks and Holy Water help; Bel\'s blessing from the priest raises your resistance.' },
    { if: 'quest:ch5-main==7', nudge: 'Look at the Dragon\'s Heart.', answer: 'Choose one of the verbs on the Dragon\'s Heart. Each ends the story differently, and the game saved just before, so you can return and choose again.' },
  ],

  combine: [],

  scripts: {},
};
