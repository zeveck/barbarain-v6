// Chapter IV — A Thousand Years Before.
// The Gate throws the party a thousand years back, into the empty valley where Shadizar will stand.
// Heist 2 (the dragon's hoard), the Waking, and twist 3: Brannoc is the Nameless Thief.
import { enemyStats } from '../data/balance.js';
import { ROOM } from './manifest.js';
import { W } from '../world.js';

// Advance the main quest only forward (the player may solve steps out of order).
const Q = n => ({ if: `quest:ch4-main<${n}`, then: [{ quest: ['ch4-main', n] }] });
const STY3 = ['stygian', 'stygian', 'stygian'];

export default {
  id: 'ch4', num: 4, title: 'A Thousand Years Before', music: 'ancient',
  card: { img: 'bg-ancient-valley', text: 'No city. No tower. Only a smoking mountain, a ring of stones, and a thief who has not been born yet.' },
  start: 'c4-stones',
  startDo: [{ quest: ['ch4-main', 1], quiet: true }],

  npcs: {
    'c4-guard': { name: 'Stygian Guard', portrait: 'generic-man' },
    'c4-acolyte': { name: 'Stygian Acolyte', portrait: 'generic-man' },
  },

  // ======================================================================= ROOMS
  rooms: {
    // ------------------------------------------------------------- the Stones
    'c4-stones': {
      ...ROOM['c4-stones'],
      desc: [
        { text: 'A ring of nine grey stones, each taller than three Cimmerians, leans together on a bald hill. The seams between them still burn a cold blue, like frost on fire. Below, a scorched valley runs east toward a mountain that breathes smoke.' },
        { text: 'At the foot of the ring squats a little shrine, burned to its bones. Someone painted a serpent over its sun-disc in soot.' },
        { if: 'party:nine', text: 'Moss grows on the north side of every stone. It also grows on the north side of Nine.' },
      ],
      exits: { e: 'c4-valley' },
      things: [
        {
          id: 'ring', name: 'The Standing Stones',
          look: [
            { say: 'You put your palm to the nearest stone. It hums, deep and slow, like a hive in winter. Blue fire crawls along the seams where the crossing tore through. Under your boots the grass is pressed flat in a wide circle, as if something enormous sat here and then was gone.' },
            { once: 'c4-ring-banter', do: [
              { line: ['ilsa', 'These are the twins of the Gate. The ring on the Isle *sends*. These *catch*. My grandfather said there was a door in the desert that drowned men came out of. I called him a drunk.'] },
              { line: ['brannoc', 'He was a drunk.'] },
              { line: ['ilsa', 'He was also right. Most drunks are, about one thing.'] },
            ] },
          ],
          take: 'You lean on the nearest stone. Nine Cimmerians could not move it. One Cimmerian looks foolish trying.',
          use: {
            'starheart': [{ say: 'Not yet. The heart has work to do in this age before it carries you home.' }],
            '*': 'The Stones hum at it politely and do nothing. They were built to drink something bigger.',
          },
        },
        {
          id: 'shrine', name: 'Burned shrine',
          look: [
            { say: 'A sun-disc of beaten copper, blistered black. A stone altar split by heat. Someone daubed a coiled serpent over the sun in soot and spit, and wrote under it in Stygian: *THE STONES ARE HIS*.' },
            { line: ['shevra', 'Your old friend left his calling card, Bear. Charming. He always did have terrible handwriting.'] },
          ],
          verbs: {
            Search: [
              { if: 'once:c4-shrine-search', then: [{ say: 'Ashes, a cracked altar and the stink of old sorcery. Nothing more.' }], else: [{ once: 'c4-shrine-search', do: [
                { say: 'Under the altar\'s cracked lid, wrapped in an oiled cloth, you find two stoppered flasks of water so clear it seems to glow. A sun is pressed into each wax seal. Someone hid them here before the fire, and did not come back for them.' },
                { give: 'holy-water', n: 2 },
              ] }] },
            ],
          },
          take: 'It\'s a shrine, not a souvenir. Even Shevra draws the line somewhere. Somewhere further on, but somewhere.',
          use: { '*': 'You offer it to the burned altar. The god of this place has bigger problems.' },
        },
        {
          id: 'tracks', name: 'Smoking tracks',
          look: [
            { say: 'A line of sandal prints leads east out of the ring, each one scorched into the grass. Beside them, every few paces, a black handprint on a rock: someone steadying himself with gloved hands that still smoke. The prints are days old, and they have not cooled.' },
            { line: ['brannoc', 'He came through ahead of us. Days ahead. The ring threw us wide, him less.'] },
            { line: ['ilsa', 'Then we\'re late. I hate being late. It\'s how you lose a ship.'] },
          ],
          take: 'You can\'t take footprints. You can follow them, which is better.',
        },
        {
          id: 'nest', name: 'Bird\'s nest', if: 'party:nine',
          look: [
            { say: 'A neat cup of grass and feathers sits in the hollow of Nine\'s shoulder joint. Three speckled eggs lie in it.' },
            { line: ['nine', 'They have nested there for four generations. I did not wish to evict them. I have been told that is what friends do. Is it?'] },
            { line: ['shevra', 'For birds, sure. Don\'t try it with the Bear.'] },
          ],
          take: [{ line: ['nine', 'Please do not. The mother is very fierce. She once drove off a hawk by shouting at it. I admired her technique.'] }],
        },
      ],
      first: [
        { sfx: 'gate-open' },
        { scene: { img: 'bg-standing-stones', text: 'The ring spits you out like a seed. You hit grass, roll, and come up with steel in your fist, but there is nothing to cut: only wind, a ring of blue-burning stones, and a valley black with old fire.' } },
        { line: ['shevra', 'Bear. Where\'s the sea? Where\'s the Isle? Where\'s *anything*?'] },
        { line: ['brannoc', 'Gone. Or not built yet.'] },
        { say: 'East, a mountain smokes against a bruised sky. Its breath comes in slow pulses, like a sleeper\'s. Ilsa shades her eyes and goes quiet, which for Ilsa is a kind of fear.' },
        { if: 'flag:c3-freed-nine', then: [
          { say: 'Something at the edge of the ring moves. What you took for a mossy standing stone unfolds, slowly, with a sound like a door that has not opened in years. Lichen falls from it. A blue light kindles behind its faceplate.' },
          { scene: { img: 'bg-standing-stones', portrait: 'nine', text: 'It is Nine: the iron man you woke on the Isle with your last star-cell. Moss on its shoulders. A bird\'s nest in one elbow. Its voice is a whisper of rust.' } },
          { line: ['nine', 'Original Human Brannoc. You are late. I followed you into the ring, but I went the long way. I arrived eleven years ago. I have been standing here. It is called waiting. I do not recommend it.'] },
          { line: ['brannoc', 'Eleven years. Crom.'] },
          { line: ['nine', 'I counted every day. I counted the birds also. Would you like the total?'] },
          { line: ['shevra', 'Later. Much later. Possibly never.'] },
          { line: ['nine', 'I am very tired. But I am here. The dragon sleeps under that mountain, and a man with burning hands went into its camp four days ago. I watched him pass. I could not stop him alone. I can now.'] },
          { join: 'nine', level: 14 },
          { set: 'c4-nine-joined' },
          { line: ['brannoc', 'And stop calling me *Original Human*.'] },
          { line: ['nine', 'Understood, Original Brannoc.'] },
        ] },
        { quest: ['ch4-main', 1] },
      ],
    },

    // ------------------------------------------------------------- the Valley
    'c4-valley': {
      ...ROOM['c4-valley'],
      desc: [
        { text: 'A wide valley, black and grey. Old fire has eaten everything here down to the roots. A dead thorn tree claws at the sky, its branches long and hooked. East, the land climbs toward the smoking mountain; a thread of cookfire smoke rises from a hollow to the south.' },
        { text: 'A cold wind moves through the valley. Something about the lie of the land is familiar, the way a stranger\'s face is familiar.' },
      ],
      exits: { w: 'c4-stones', s: 'c4-camp', e: 'c4-picket' },
      things: [
        {
          id: 'thorn-tree', name: 'Dead thorn tree',
          look: 'A twisted black thorn, killed by fire but too stubborn to fall. Its branches are long and straight and end in hooked thorns as long as your finger. One snapped off would make a fine reaching-stick, if you had the patience. Or the cord.',
          take: [
            { if: 'item:thorn-branch | item:long-arm | flag:c4-robes', then: [
              { say: 'You already have all the thorn you need. The tree looks relieved.' },
            ], else: [
              { say: 'You set your boot against the trunk and snap off a long, hooked branch. It comes away with a crack like a bone.' },
              { give: 'thorn-branch' },
            ] },
          ],
          use: { '*': 'The tree has suffered enough.' },
        },
        {
          id: 'mountain', name: 'The smoking mountain',
          look: [
            { say: 'A broad, bald mountain with a cleft high on its flank. Smoke breathes out of the cleft in slow pulses: in, and out, and in. Between the breaths the whole valley seems to hold still. A red seam runs down from the cleft like a wound that will not close.' },
            { once: 'c4-mountain-banter', do: [
              { line: ['brannoc', 'That\'s not a mountain. It\'s breathing.'] },
              { line: ['ilsa', 'Mountains don\'t breathe.'] },
              { line: ['brannoc', 'That one does.'] },
            ] },
          ],
          take: 'You\'ll have to settle for something smaller.',
        },
        {
          id: 'lay', name: 'Lay of the land',
          look: [
            { say: 'You turn a slow circle. The stones on their hill to the west. A dip in the ground where a square might sit. The way the land slopes south, as if water once ran there, or will.' },
            { line: ['shevra', 'Bear... if you stood just there, and the Street of Lamps ran down that slope, and the Bazaar was there... no. No. I need to sit down.'] },
            { line: ['brannoc', 'Sit later. Walk now.'] },
          ],
          take: 'You pick up a handful of ash. It runs through your fingers. Nothing here is yours yet.',
        },
        {
          id: 'drake-bones', name: 'Scorched bones', if: 'won:c4-valley-drake',
          look: 'The drake you killed lies in a heap of scales and steam. Its fire is going out slowly, like a forge at night. Something that size was a hatchling to whatever lives under that mountain.',
          take: 'The scales are still too hot to touch. The smell is worse.',
        },
      ],
      first: [
        { say: 'Halfway down the slope the ash heaves. A drake bursts out of it: a red-scaled thing the size of a warhorse, smoke curling from its nostrils, eyes like coals.' },
        { fight: { id: 'c4-valley-drake', enemies: ['drake'], noFlee: true, intro: 'A drake erupts from the ash!' } },
        { line: ['ilsa', 'If that\'s the hatchling, I want to go home.'] },
        { line: ['brannoc', 'Can\'t. Home isn\'t built yet.'] },
      ],
      hunt: [['drake'], ['bat-swarm', 'bat-swarm']],
    },

    // ------------------------------------------------------------- the Camp
    'c4-camp': {
      ...ROOM['c4-camp'],
      desc: [
        { text: 'A hollow full of hide tents, goats and cookfires. Children with knives in their belts. Old men mending stolen saddles. Everyone here looks at your purses before your faces: these are thieves, born and bred, and proud of it.' },
        { text: 'An old woman with a pipe sits on a heap of stolen rugs like a queen on a throne, surrounded by tallow candles. Up on a ridge above the camp, young men practise knocking props out from under a timber frame.' },
        { if: '!party:zelara', text: 'By the cookfire, a woman in a scorched white robe sits apart, staring west toward the Stones.' },
      ],
      exits: { n: 'c4-valley', e: 'c4-bones' },
      things: [
        { id: 'kesh', name: 'Grandmother Kesh', kind: 'person', portrait: 'kesh',
          look: 'A tiny, leathery old woman with a clay pipe, three gold rings in each ear and a dagger in her lap like a pet. Her eyes are bright and black and missing nothing. A tray of beeswax candles burns around her, guttering in the wind.',
          talk: 'c4-kesh',
          use: {
            'starheart': [{ line: ['kesh', 'Put that away before my grandsons see it. I raised thieves, not saints.'] }],
            'snow-melon': [{ line: ['kesh', 'The mad hermit\'s melons. He gives them away. Nobody knows why. Nobody eats them twice.'] }],
            '*': [{ line: ['kesh', 'Hah! You want to *trade*? Talk to me, then. I don\'t do business with people who just wave things.'] }],
          },
        },
        { id: 'zelara', name: 'Zelara', kind: 'person', portrait: 'zelara', if: '!party:zelara',
          look: 'A tall woman in a white robe scorched brown at the hem. Her dark hair is bound with a gold cord, and a small sun of beaten copper hangs at her throat. She has a mace across her knees and the look of someone who has not slept in four days and does not intend to start.',
          talk: 'c4-zelara',
          use: {
            'holy-water': [{ line: ['zelara', 'That is Mitra\'s water. From my shrine. You found what I hid. Keep it. You will need it more than I will.'] }],
            '*': [{ line: ['zelara', 'I don\'t want gifts, Cimmerian. I want the man who burned my shrine.'] }],
          },
        },
        { id: 'grandsons', name: 'Kesh\'s grandsons', kind: 'person', portrait: 'generic-man',
          look: 'Six lanky young men with ropes over their shoulders and hammers in their belts. On the ridge they have built a timber frame held up by drake bones, and they keep knocking the bones out with mallets, catching the frame, and putting it back. Over and over. They are very fast.',
          talk: 'c4-grandsons',
        },
        { id: 'tent', name: 'Kesh\'s tent',
          look: 'A big tent of stitched goat hide, heaped with rugs, stolen cushions and the snores of whatever grandson is off-shift. It smells of smoke and sheep. It looks like heaven.',
          verbs: { Rest: [{ inn: 0, text: 'Kesh waves her pipe at the tent. "Sleep. Thieves who don\'t sleep make mistakes, and mistakes make widows."' }] },
          take: 'Even you can\'t carry off a tent full of sleeping thieves.',
        },
        { id: 'loot', name: 'Heap of loot',
          look: [
            { say: 'Saddles, bridles, bolts of silk, a bronze lamp shaped like a fish, a Stygian priest\'s left sandal. Every item still has the faint air of belonging to someone else.' },
            { once: 'c4-loot-banter', do: [
              { line: ['shevra', 'I love these people. Bear, I\'ve found my ancestors. Look at that fence work. Look at the *stacking*.'] },
            ] },
          ],
          take: [{ line: ['kesh', 'Touch my loot and I\'ll sell your fingers back to you one at a time. Trade, if you want something.'] }],
        },
      ],
      first: [
        { say: 'Forty knives come out as you walk down into the hollow. Then the old woman on the rugs takes the pipe out of her mouth and laughs.' },
        { line: ['kesh', 'Put them away, puppies. Look at them: a giant, a pirate, a pickpocket. They\'re *ours*. Lost thieves from somewhere. Sit, strangers. I\'m Kesh. Everything you can see belongs to me, or will.'] },
        { line: ['shevra', 'I like her already.'] },
        Q(2),
      ],
    },

    // ------------------------------------------------------------- the Bone Fields
    'c4-bones': {
      ...ROOM['c4-bones'],
      desc: [
        { text: 'A plain of bones. Not men\'s bones: drakes\', ribs like the frames of ships, skulls as big as huts, all bleached and cracked and fused to the ground by old fire. Wind whistles through the eye-holes with a sound like mourning.' },
        { text: 'In the shelter of one great skull sits a hut of hides, and around it, against all reason, a little patch of fat green melons.' },
      ],
      exits: { w: 'c4-camp', n: 'c4-picket' },
      things: [
        { id: 'hermit', name: 'The melon hermit', kind: 'person', portrait: 'hermit',
          look: 'A bony old man in a coat of goat hides, with a beard tied in three knots and frost in his eyebrows, though the day is warm. He is hugging a melon. He has the serene look of a man who has made all his worst decisions long ago and come to terms with them.',
          talk: 'c4-hermit',
          use: {
            'snow-melon': [{ line: ['hermit', 'That one\'s mine! No, wait. They\'re all mine. Keep it, keep it. I have a cellar full.'] }],
            '*': [{ line: ['hermit', 'Is it a melon? No? Then I don\'t want it.'] }],
          },
        },
        { id: 'skull', name: 'Great drake skull',
          look: 'A drake skull the size of a cart, its jaw still wide open. Rows of teeth stand in it, yellow and long. Most are cracked. One, near the front, is loose in its socket and as long as a dagger.',
          verbs: {
            Search: [
              { if: 'once:c4-skull-tooth', then: [{ say: 'Only cracked teeth now, and a smell of very old smoke.' }], else: [{ once: 'c4-skull-tooth', do: [
                { say: 'You climb into the jaw (Ilsa makes a noise you will not forget) and work the loose fang free. It comes away with a grinding crack: a curved white tooth, needle-sharp, still faintly warm after who knows how many years.' },
                { line: ['shevra', 'Give. *Give*. Oh, that\'s lovely. That\'s a knife, Bear. That\'s a knife that bites back.'] },
                { give: 'drake-tooth' },
              ] }] },
            ],
          },
          take: 'You would need a cart and six oxen. And a reason.',
        },
        { id: 'melons', name: 'Melon patch',
          look: 'Fat round melons, green-striped, growing out of soil that has no business growing anything. When you knock on one, it sounds hollow and cold. A rime of frost gathers on its skin in the hot wind.',
          take: [{ line: ['hermit', 'Hoi! Thief! Ask nicely and I\'ll give you one. Don\'t ask and I\'ll curse you with a lifetime of gourds.'] }],
        },
        { id: 'cairns', name: 'Bone cairns',
          look: 'Little towers of finger bones stand among the great skulls, tied with rags and wound with hair. Someone built them to keep something in. Or out.',
          take: 'You reach for one. The wind stops. You take your hand back. The wind starts again.',
        },
      ],
      first: [
        { say: 'The bone cairns rattle as you pass. Then the wind turns cold, and pale shapes pull themselves up out of the bones: wraiths, made of ash and the memory of hunger.' },
        { fight: { id: 'c4-bone-wraiths', enemies: ['bone-wraith', 'bone-wraith'], noFlee: true, intro: 'Bone-wraiths rise from the field!' } },
        { line: ['hermit', 'Oh, well done! Well done! They\'ve been at my melons for a year.'] },
      ],
      ambush: { chance: 0.3, groups: [['bone-wraith', 'bone-wraith'], ['bone-wraith', 'bat-swarm']], text: 'The bones stir. Wraiths!' },
    },

    // ------------------------------------------------------------- the Picket
    'c4-picket': {
      ...ROOM['c4-picket'],
      desc: [
        { text: 'A rocky gully below the mountain, the last cover before the cult\'s camp. Black robes flap on a line strung across the gully, out of reach, high over a crack too wide to jump. A serpent banner snaps in the dusk wind.' },
        { if: '!won:c4-picket', text: 'Three Stygian guards in black robes squat by a picket fire, passing a wineskin. A wine barrel stands by the fire; the guards keep demanding the word from each other and arguing about the answer.' },
        { if: 'won:c4-picket', text: 'The picket fire smoulders over three guards who will never argue about anything again.' },
      ],
      exits: {
        w: 'c4-valley', s: 'c4-bones',
        e: { to: 'c4-cult', if: 'item:cult-robes & flag:c4-password | item:cult-robes & won:c4-picket',
          blocked: 'Robes and the word, or a spear in the belly. That\'s how the guards greet anyone who walks up the gully without both.',
          do: [
            { if: 'flag:c4-password & !won:c4-picket', then: [
              { once: 'c4-pass-word', do: [
                { line: ['c4-guard', 'Hold, brothers. The word.'] },
                { say: 'Brannoc draws himself up under the black hood, takes a breath, and hisses. Long. Low. With feeling.' },
                { line: ['brannoc', 'Ssssssssssss.'] },
                { line: ['c4-guard', '...Beautiful. Pass, brother. Set\'s coils keep you.'] },
                { line: ['shevra', 'I will never let you forget that.'] },
              ] },
            ] },
          ] },
      },
      things: [
        { id: 'drying-line', name: 'Drying line', if: '!flag:c4-robes',
          look: [
            { say: 'A line of braided hair strung across the gully, from a stake on your side to a rock on the far side of a crack too wide to jump. Five black cult robes hang from it, flapping, out of reach. Something with a hook on a long reach could snag one.' },
            { if: '!item:sling-cord & !item:long-arm', then: [
              { line: ['shevra', 'Too far. Find me a stick, Bear, and I\'ll lend you my sling cord. Tie one to the other and we\'ll go fishing for robes.'] },
              { say: 'She unwinds the cord from her sling and slaps it into your palm.' },
              { give: 'sling-cord' },
            ] },
          ],
          take: 'You stretch. You stretch further. The crack under you yawns. You stop stretching.',
          use: {
            'long-arm': [
              { take: 'long-arm', quiet: true },
              { say: 'You lie flat on the lip of the crack and reach out with the thorn. The hook snags a robe, slips, snags again. A slow pull, and a black robe drops into your hand. Then another. Then enough for everyone, and a spare that Shevra rolls up "for later".' },
              { give: 'cult-robes' },
              { set: 'c4-robes' },
              { sfx: 'sting-solved' },
              { xp: 20 },
              { line: ['shevra', 'Black suits you, Bear. Brings out the murder in your eyes.'] },
              { say: 'The thorn-stick snaps in the last pull. Shevra takes her sling cord back.' },
            ],
            'thorn-branch': [{ say: 'You poke at the line with the branch. It falls short by an arm\'s length. You need something to lengthen it.' }],
            'sling-cord': [{ say: 'You swing the cord at the robes like a whip. It doesn\'t reach, and now the guards are looking at you oddly. A cord needs a stick.' }],
            '*': 'You hold it out toward the robes. It does not grow longer, no matter how hard you glare.',
          },
        },
        { id: 'barrel', name: 'Wine barrel', if: '!won:c4-picket',
          look: [
            { say: 'A fat barrel of sour Stygian wine, mostly drunk, its lid lying beside it. It stands right beside the guards\' fire: close enough to hear them breathe, and big enough for a thief to fold herself into. Or, with a great deal of swearing, a barbarian.' },
            { if: '!flag:c4-password', line: ['shevra', 'They keep asking each other for the word. Someone inside that barrel would hear it. I\'m only saying.'] },
          ],
          verbs: {
            'Hide in': [
              { if: 'flag:c4-password', then: [
                { say: 'You fold yourself back into the barrel. It smells exactly as bad as last time. The guards are still arguing about whose turn it is.' },
              ], else: [
                { say: 'You wait for the guards to turn to the fire, then fold yourself into the barrel. Your knees are around your ears. The dregs soak through your breeches. Above you, a wineskin sloshes.' },
                { line: ['c4-guard', 'Brothers, the word. Come on. The word.'] },
                { line: ['c4-acolyte', 'It\'s "Ssss". Everyone knows it\'s "Ssss".'] },
                { line: ['c4-guard', 'It is *not* just "Ssss". The priest said. You have to say it *with feeling*. Like this. Ssssssssssss.'] },
                { line: ['c4-acolyte', '...That\'s beautiful, brother.'] },
                { say: 'You wait until they\'re snoring, then unfold yourself from the barrel, one aching joint at a time.' },
                { set: 'c4-password' },
                { line: ['brannoc', 'Ssss. With feeling. Crom.'] },
                { xp: { as: STY3 } },
                Q(3),
              ] },
            ],
          },
          take: 'It\'s half full of sour wine and weighs as much as Ilsa. Ilsa would like that sentence taken back.',
          use: { '*': 'You drop it in the barrel. It sinks into the dregs. You fish it out again, sticky and ashamed.' },
        },
        { id: 'guards', name: 'Picket guards', kind: 'person', portrait: 'generic-man', if: '!won:c4-picket',
          look: 'Three Stygians in black robes, shaven heads tattooed with coils. Curved knives, wine-stained teeth. They argue in whispers about the password, as if it might hear them.',
          talk: [
            { line: ['c4-guard', 'Hssst! Who goes? Give the word, or we give you the knife.'] },
            { if: 'flag:c4-password & item:cult-robes', then: [{ say: 'You are already robed and know the word. Just walk up the gully.' }],
              else: [{ line: ['brannoc', '...Hello.'] }, { line: ['c4-guard', 'That is *not* the word.'] }, { say: 'You back off down the gully before he decides to find out what is.' }] },
          ],
          verbs: {
            Attack: [
              { line: ['brannoc', 'I\'ve a better word.'] },
              { fight: { id: 'c4-picket', enemies: STY3, noFlee: true, intro: 'The picket guards leap up from the fire!',
                win: [{ say: 'The gully is quiet. Nobody in the camp beyond seems to have heard. But without the password, robed strangers will draw eyes there.' }, Q(3)] } },
            ],
          },
          use: { '*': 'The guards eye it, and you, and their knives. You put it away.' },
        },
        { id: 'banner', name: 'Serpent banner',
          look: 'A black banner with a green serpent coiled around a red sun, the serpent\'s jaws closing on the sun\'s edge. The same sign was daubed on the shrine at the Stones. Under it, in Stygian: *THE FEEDING AT THE CONJUNCTION*.',
          take: 'You could tear it down. Then every cultist in the valley would know someone did.',
        },
      ],
      first: [
        { say: 'You creep up the gully on your bellies. Ahead, the picket fire; beyond it, a glow of many fires under the mountain.' },
        { line: ['ilsa', 'Three of them. We could take them.'] },
        { line: ['shevra', 'We could. Then everyone in that camp counts heads at supper and comes up three short. Thieves don\'t cut throats when they can cut corners.'] },
      ],
    },

    // ------------------------------------------------------------- the Cult Camp
    'c4-cult': {
      ...ROOM['c4-cult'],
      desc: [
        { text: 'Black tents in a ring under the mountain, serpent banners on every pole. Hundreds of robed Stygians come and go, chanting, sharpening knives, carrying bundles of black candles up a cut in the rock to the north, where the mountain opens like a mouth.' },
        { text: 'In the centre stands a pavilion of green silk. Before it, on a chair of bones, a tall figure watches the mountain with his gloved hands folded.' },
      ],
      exits: { w: 'c4-picket', n: 'c4-mouth' },
      things: [
        { id: 'thoth', name: 'The figure on the bone chair', kind: 'person', portrait: 'thoth-seketh',
          look: [
            { say: 'You know the shape of him before you know the face. The stooped shoulders are gone; so is the Khitan beard. Thoth-Seketh sits straight-backed and tall, his skin the green-bronze of old coins, his eyes slit-pupilled and golden. His gloves are still smoking where the Starheart burned them.' },
            { once: 'c4-thoth-banter', do: [
              { line: ['brannoc', 'There he is.'] },
              { say: 'Your hand goes to your hilt. Shevra\'s goes to your wrist, quick as a snake.' },
              { line: ['shevra', 'Heist first. Murder later. You promised.'] },
              { line: ['brannoc', 'I never promised.'] },
              { line: ['shevra', 'You promised with your *eyebrows*.'] },
              { if: 'party:zelara', line: ['zelara', 'He burned my sisters in their beds. When the time comes, Cimmerian, he is mine.'] },
              { if: 'party:nine', line: ['nine', 'His heart is wrong. It beats slowly, like a snake\'s. I would like to stop it. Is that a friend thing?'] },
            ] },
          ],
          talk: [{ say: 'You are wearing a stolen robe in the middle of his army. Walking up to say hello would be a short conversation.' }],
          use: { '*': 'Not here. Not with five hundred knives around you. Later.' },
        },
        { id: 'priests', name: 'Chanting priests',
          look: 'A knot of senior priests stands by the pavilion arguing over a wax tablet covered in sums: weights, star-angles, hours. One keeps saying "a hair, a single hair," and tapping the tablet. Another has a ripe melon on the table beside him and is using it to show the others something about weight.',
          verbs: {
            Listen: [
              { say: 'You drift close with your hood up and your head bowed.' },
              { line: ['c4-acolyte', 'The heart lies on the weighing-altar in the hoard, where the master set it. If its weight changes by a hair, the altar screams, and the whole mountain hears.'] },
              { line: ['c4-guard', 'And it weighs?'] },
              { line: ['c4-acolyte', 'Like a ripe melon. This one, near enough. Warm, and it beats.'] },
            ],
          },
          take: 'You would be taking a priest. People notice that.',
        },
        { id: 'rack', name: 'Weapon rack',
          look: 'A rack of old-kingdom weapons by a sleeping smith: sickle-swords, bronze-headed axes, spears with leaf blades. One khopesh, longer and finer than the rest, has a dragon chased along its blade.',
          take: [
            { if: 'once:c4-rack-take', then: [{ say: 'Taking one sword is a heist. Taking two is a pattern. Patterns get you caught.' }], else: [{ once: 'c4-rack-take', do: [
              { say: 'You stroll past the rack, robed and humming, and stroll on with the khopesh under your robe. The smith snores on.' },
              { line: ['shevra', 'Look at you. A month with me and you\'re *shoplifting*. I\'ve never been prouder.'] },
              { give: 'bronze-khopesh' },
            ] }] },
          ],
        },
        { id: 'candles', name: 'Black candles',
          look: 'Bundles of fat black candles, each stamped with a serpent. The acolytes carry them up into the mountain by the armful. They smell of tar and something sweeter, like a dead flower.',
          take: 'You lift one. An acolyte smiles at you, delighted, and hands you twenty more. You slip them back onto the pile when he turns away.',
        },
      ],
      first: [
        { if: '!flag:c4-password', then: [
          { say: 'A big priest with a ritual brand on his cheek steps into your path and peers under Brannoc\'s hood.' },
          { line: ['c4-acolyte', 'Brother. The *word*.'] },
          { line: ['brannoc', '...Mitra?'] },
          { fight: { id: 'c4-camp-stranger', enemies: ['stygian', 'stygian', 'stygian-priest'], noFlee: true, intro: 'Strangers in the camp!' } },
          { say: 'You drag the bodies behind a tent. In the din of five hundred chanting voices, nobody has noticed. You were lucky. Lucky does not happen twice.' },
        ] },
        { say: 'You walk in robed and silent, heads bowed, past chanting priests and stacks of black candles. Nobody looks twice. Shevra walks like she was born in a robe. Brannoc walks like a bear wearing a curtain, but he walks.' },
        { say: 'By the green pavilion you slow your step, and catch the priests at their argument.' },
        { line: ['c4-acolyte', 'The heart lies on the weighing-altar in the hoard, where the master set it. If its weight changes by a hair, the altar screams, and the whole mountain hears.'] },
        { line: ['c4-guard', 'And it weighs?'] },
        { line: ['c4-acolyte', 'Like a ripe melon. Warm, and it beats. In three nights, at the Conjunction, the master feeds it to the Lord Below, and the Lord wakes in every age at once.'] },
        { line: ['shevra', 'A weighing-altar. Weight of a melon. Bear, I have an idea, and you\'re going to hate it.'] },
        { set: 'c4-plan' },
        { xp: 20 },
        Q(4),
      ],
    },

    // ------------------------------------------------------------- the Dragon's Mouth
    'c4-mouth': {
      ...ROOM['c4-mouth'],
      desc: [
        { text: 'The cave mouth breathes hot and slow. Inside, the walls are slick and furred with a pale green moss that glows like a dying lamp. Lava-light flickers from deep below. Cultists come and go down a passage to the east, single file, and every one who comes out of the deep has wax plugs in his ears.' },
      ],
      exits: {
        s: 'c4-cult',
        e: { to: 'c4-echoes', do: [
          { if: '!item:earplugs', then: [
            { say: 'You step into the passage. Your boot scuffs. The scuff comes back as a thousand scuffs, then a thousand thousand, a roar of stone. Overhead, a black ceiling peels away and screams.' },
            { line: ['shevra', 'Bats! Run! Or fight! Or both!'] },
            { fight: { id: 'c4-echoes-bats', enemies: ['bat-swarm', 'bat-swarm', 'bat-swarm'], noFlee: true, intro: 'The echoes wake the bats!' } },
            { say: 'More come, and more, a living storm. The noise alone drives you back, staggering, hands over your ears, until you fall out of the passage into the Mouth again.' },
            { line: ['ilsa', 'Every man coming out of there has wax in his ears. I don\'t think that\'s fashion.'] },
            { goto: 'c4-mouth' },
          ] },
        ] },
      },
      things: [
        { id: 'moss', name: 'Glowing moss',
          look: 'Pale green moss furs the cave walls in thick mats. Where you press it, it glows brighter, the cold soft light of a Starheart seen through a hand. Scraped off, it would coat anything with that glow.',
          verbs: {
            Scrape: [
              { if: 'item:glow-moss | item:fake-starheart | flag:c4-heart-taken', then: [
                { say: 'You have enough moss to light a palace. Your hands are already glowing faintly green.' },
              ], else: [
                { say: 'You scrape a thick handful of moss off the wall with your knife. It glows in your palm like a captured moon, and smells of mushrooms.' },
                { give: 'glow-moss' },
              ] },
            ],
          },
          take: 'It comes away in your fingers and stops glowing. Scrape a thick mat of it, with a blade.',
        },
        { id: 'plugged', name: 'Cultists with earplugs', kind: 'person', portrait: 'generic-man',
          look: [
            { say: 'Robed cultists file past toward the deep passage. As each reaches the threshold he stops, pinches a plug of yellow wax from a pouch, and twists it into each ear. Those coming out pull theirs free with sighs of relief.' },
            { line: ['ilsa', 'Wax in the ears. Sailors do it when they pass the singing rocks. Whatever\'s down there doesn\'t like a noise.'] },
          ],
          talk: [{ say: 'You open your mouth to ask. The nearest cultist points at his ears and shrugs. He can\'t hear a word.' }],
        },
        { id: 'skeletons', name: 'Old skeletons',
          look: 'In a side alcove lie three skeletons in the rags of fine clothes, their jaws hanging open in a silent shout, their finger-bones jammed into their ear-holes.',
          take: 'They died with their fingers in their ears. Leave them their dignity, such as it is.',
        },
        { id: 'vent', name: 'Breathing vent',
          look: 'A crack in the floor breathes up hot air, slow and regular, ten heartbeats in, ten heartbeats out. Deep down, something very large is sleeping.',
          take: 'You hold your hand over it. It is warm as breath. You take your hand back.',
        },
      ],
      first: [
        { say: 'As you step into the Mouth, a lump of the glowing lava below the ledge shrugs and crawls up the rock toward you: a salamander, with a ragged cloud of bats screeching around it.' },
        { fight: { id: 'c4-mouth-beasts', enemies: ['bat-swarm', 'salamander', 'bat-swarm'], noFlee: true, intro: 'A salamander and its bats!' } },
        { line: ['brannoc', 'Quiet, after that. Too quiet.'] },
      ],
      enter: [{ call: 'c4-redock' }],
    },

    // ------------------------------------------------------------- the Hall of Echoes
    'c4-echoes': {
      ...ROOM['c4-echoes'],
      desc: [
        { text: 'A cavern so tall the lava-light never reaches the roof. The roof moves, in the dark: a living ceiling of bats, millions, folded and asleep. Every surface is carved smooth by sound. A cough here comes back as a thousand.' },
        { text: 'With the wax in your ears the world is a soft muffled hum. You walk in silence, as if under the sea.' },
      ],
      exits: { w: 'c4-mouth', e: 'c4-bridge' },
      things: [
        { id: 'bats', name: 'The living ceiling',
          look: 'You look up into the dark and slowly understand that the ceiling is breathing. Bats beyond counting, wings folded, hanging close as the scales of a fish. If they all woke at once, there would be nothing in this hall but teeth and noise.',
          take: 'You would rather take a bath in the lava.',
        },
        { id: 'shevra-signs', name: 'Shevra\'s hand signs',
          look: [
            { say: 'Shevra signs at you in thieves\' cant, fast and furious. You catch: *Bear. Feet. Quieter. You walk like a cow falling downstairs.*' },
            { say: 'You sign back the only sign you know. She grins and signs it back twice.' },
            { if: 'party:nine', say: 'Nine watches the exchange carefully, then gravely repeats both signs to Ilsa, who nearly laughs and wakes every bat in the world.' },
          ],
          take: 'Her hands are faster than yours. That is rather the point.',
        },
        { id: 'stones', name: 'Whispering stone',
          look: 'A pillar in the middle of the hall carved with hundreds of tiny ears and mouths, worn smooth by touching. A sound-shrine. Nobody has made a sound here on purpose in a thousand years.',
          take: 'It is part of the mountain. So, increasingly, are you.',
        },
      ],
      first: [
        { once: 'c4-echoes-cross', do: [
          { say: 'You step into the hall with the wax in your ears. Brannoc\'s boot scuffs; a whisper of echo shivers overhead and dies. Nobody wakes. You cross the hall one slow step at a time, like men walking a rope over a gorge.' },
          { xp: { as: ['bat-swarm', 'bat-swarm', 'bat-swarm'], n: 25 } },
          Q(5),
        ] },
      ],
    },

    // ------------------------------------------------------------- the Molten Bridge
    'c4-bridge': {
      ...ROOM['c4-bridge'],
      desc: [
        { text: 'A stone bridge, no wider than a cart, spans a river of lava. Its surface is a crust of half-cooled rock that cracks and glows with every pulse of heat from below. The air shimmers. Your eyebrows are very nervous.' },
        { if: '!flag:c4-bridge-crusted', text: 'Just at the near end, where a drip of water fell from the roof, the glowing crust has gone black and hard.' },
        { if: 'flag:c4-bridge-crusted', text: 'A path of black, frost-cracked stone now runs from end to end of the bridge, steaming and solid as a road.' },
      ],
      exits: {
        w: 'c4-echoes',
        n: { to: 'c4-hoard', if: 'flag:c4-bridge-crusted', blocked: 'You put one boot on the glowing crust. The leather smokes. You take it back. Brannoc\'s boots would last three steps. Brannoc would last four.' },
      },
      things: [
        { id: 'crust', name: 'Glowing crust',
          look: [
            { say: 'The bridge\'s surface is a skin of rock over fire, cracked like old bread, glowing red in every crack. Where the single drip of water fell from the roof, the crust went black and hard. Something much colder than a drip could make a road of it.' },
            { if: '!flag:c4-bridge-crusted & party:zelara', line: ['zelara', 'Mitra\'s frost-water. It turned the river at the Stones to ice once, in my grandmother\'s day. Use the flask, Cimmerian.'] },
            { if: '!flag:c4-bridge-crusted & !party:zelara', line: ['ilsa', 'Water hardens it. We need cold. A lot of cold, all at once.'] },
          ],
          take: 'You\'d be taking it with your bare hand. Your hand disagrees.',
          use: {
            'frost-flask': [
              { take: 'frost-flask', quiet: true },
              { say: 'You break the wax and hurl the Frost Flask down the bridge. It bursts in a white flower. A crackle like a forest in winter rolls end to end, and the glowing crust goes black, hard and smoking with frost.' },
              { sfx: 'cold' },
              { set: 'c4-bridge-crusted' }, { sfx: 'sting-solved' }, { xp: 25 }, Q(6),
            ],
            'frost-flask-item': [
              { take: 'frost-flask-item', quiet: true },
              { say: 'You hurl the flask of mountain snow down the bridge. It bursts in a white cloud. The crust crackles, goes black and hard from end to end, and smokes like a doused forge.' },
              { sfx: 'cold' },
              { set: 'c4-bridge-crusted' }, { sfx: 'sting-solved' }, { xp: 25 }, Q(6),
            ],
            'snow-melon': [
              { take: 'snow-melon', quiet: true },
              { say: 'You raise the hermit\'s melon over your head and smash it down on the bridge. Packed mountain snow bursts out of it in a white explosion. The crust hisses, cracks, and goes black and hard from end to end.' },
              { line: ['shevra', 'The mad old man was right. You *can* cross a river of fire with a melon. I want to go back and apologise to him.'] },
              { sfx: 'cold' },
              { set: 'c4-bridge-crusted' }, { sfx: 'sting-solved' }, { xp: 25 }, Q(6),
            ],
            'holy-water': [{ say: 'You splash a little holy water on the crust. It hisses and goes black for a hand-width, then glows again. Blessed, but not cold enough. You need *cold*.' }],
            'fake-starheart': [{ line: ['shevra', 'Don\'t you *dare*. That\'s three hours of my best work.'] }],
            '*': 'You toss it onto the bridge. It smokes, chars and drops into a crack. The lava burps.',
          },
        },
        { id: 'lava', name: 'River of lava',
          look: 'A slow river of liquid fire, crusted over in places, churning in others. Things float in it: lumps of rock, the black ribs of something, a helmet. The heat comes up in waves that you can see.',
          take: 'No.',
          use: { '*': 'You drop it in. It flares and is gone. You feel faintly sick.' },
        },
        { id: 'drip', name: 'Drip from the roof',
          look: 'Far above, a crack in the rock weeps a single drop of water every few heartbeats. Each drop falls, hisses on the bridge, and leaves a black, hard scab where the crust was glowing.',
          take: 'You catch a drop. It is cool and tastes of iron. The bridge is very long and drops are very small.',
        },
      ],
      first: [
        { line: ['ilsa', 'I\'ve walked a burning deck in a storm. I\'ve never walked a burning *road*.'] },
      ],
    },

    // ------------------------------------------------------------- the Hoard Hall
    'c4-hoard': {
      ...ROOM['c4-hoard'],
      desc: [
        { text: 'Gold. Hills of it, rivers of it, gold coins and gold cups and gold crowns from kingdoms whose names are lost. It runs up to a great cracked dome held up by a forest of drake bones. In the centre, on a dais, stands a bronze altar with a scale-pan.' },
        { if: '!flag:c4-heart-taken', text: 'In the pan something beats with blue-white light. Priests in black kneel facing away from the altar, wax in their ears, chanting the long chant of the Feeding.' },
        { if: 'flag:c4-heart-taken', text: 'On the altar a mossy green melon glows softly in the scale-pan. The priests chant on, unknowing.' },
        { text: 'Far up, between the bone props, you can see faces in a crack of the dome: Kesh\'s grandsons, mallets in hand.' },
      ],
      exits: {
        s: 'c4-bridge',
        e: { to: 'c4-bed', if: 'flag:c4-heart-taken', blocked: 'East, a vast cave mouth breathes heat. You did not come all this way to go in without the heart.',
          noReturn: 'East lies the Dragon\'s Bed, where Thoth-Seketh waits for the Feeding. There will be no coming back through this hall.',
          do: [
            { line: ['shevra', 'Remember what Kesh said, Bear. If the worm wakes, you shout Crom\'s name. Loud. Her boys knock the props out and the roof comes down.'] },
            { line: ['brannoc', 'Loud. I can do loud.'] },
          ] },
      },
      things: [
        { id: 'altar', name: 'The weighing-altar',
          look: [
            { if: '!flag:c4-heart-taken', then: [
              { say: 'A bronze scale-pan on a bronze arm, so finely balanced it trembles at your breath. The Starheart lies in the pan, heavy as a melon, beating blue-white. The pan hums at its weight. A thread runs from the arm down into a bronze horn the size of a man: if the pan moves by a hair, the horn will scream.' },
              { line: ['shevra', 'Swap it. Same weight, same glow. Easy.'] },
              { if: '!item:fake-starheart', line: ['brannoc', 'Same weight. Same glow. Crom.'] },
            ], else: [
              { say: 'The hermit\'s melon sits in the scale-pan, glowing green-white with moss, beating not at all. The pan has not moved a hair. The horn is silent.' },
            ] },
          ],
          take: [
            { if: 'flag:c4-heart-taken', then: [{ say: 'Leave the melon. It has a long, dignified career ahead of it.' }], else: [
              { confirm: { text: 'Grab the heart and run? The altar will scream, and every priest in the hall will hear it.', yesLabel: 'Grab it', noLabel: 'Not like that',
                yes: [
                  { say: 'You snatch the heart. The pan leaps. The bronze horn SCREAMS, a sound like a slaughtered god, and every priest in the hall turns at once, wax or no wax.' },
                  { sfx: 'roar' }, { shake: true },
                  { fight: { id: 'c4-hoard-alarm', enemies: ['stygian', 'salamander', 'stygian', 'stygian'], noFlee: true, intro: 'The altar screams! The priests attack!' } },
                  { say: 'The last priest falls. Deep in the mountain, something heard the scream, and turned over in its sleep.' },
                  { set: 'c4-heart-taken' }, { give: 'starheart' }, { sfx: 'heartbeat' },
                  { line: ['brannoc', 'Mine again.'] },
                  Q(7),
                ] } },
            ] },
          ],
          use: {
            'fake-starheart': [
              { take: 'fake-starheart', quiet: true },
              { say: 'Shevra breathes out. You breathe in. With one hand you lift the Starheart; with the other, in the same motion, you set the glowing melon in the pan.' },
              { say: 'The pan dips... and holds. The horn is silent. The priests chant on.' },
              { scene: { img: 'starheart', text: 'The Starheart beats in your fist, warm and heavy as a melon. Blue-white light leaks between your fingers. Starfire runs up your arm like a remembered song.' } },
              { sfx: 'heartbeat' },
              { give: 'starheart' },
              { set: 'c4-heart-taken' },
              { xp: { as: ['stygian', 'salamander', 'stygian', 'stygian'] } },
              { line: ['shevra', 'Same weight. Same glow. *Easy*. Somebody tell me I\'m wonderful.'] },
              { line: ['brannoc', 'You\'re wonderful.'] },
              { line: ['shevra', 'Hah! I\'ll carve that on something.'] },
              Q(7),
            ],
            'snow-melon': [{ line: ['shevra', 'A plain green melon on a glowing altar? Even a Stygian would notice. It has to *glow*, Bear.'] }],
            'glow-moss': [{ line: ['shevra', 'Moss weighs nothing. The pan would leap a mile. Moss on something that weighs like the heart, Bear.'] }],
            'starheart': [{ say: 'You have it. You are not putting it back.' }],
            '*': [{ if: 'flag:c4-heart-taken', then: [{ line: ['shevra', 'Leave the altar alone, Bear. The melon is doing a beautiful job.'] }],
              else: [{ line: ['shevra', 'Not unless it weighs exactly like the heart and glows like it too. Think, Bear. Melon. Glow.'] }] }],
          },
        },
        { id: 'gold', name: 'Heaps of gold',
          look: 'Gold coins stamped with the faces of kings nobody remembers. Gold cups. A gold throne, half buried. Armor of red drake-scale and a shield cut from a drake\'s shoulder blade lie on one heap, as if a hero came here once and did not leave.',
          take: [
            { if: 'once:c4-gold-take', then: [{ say: 'Your pouches are full. Your boots are full. Shevra is still trying to fit one more cup down her shirt.' }], else: [{ once: 'c4-gold-take', do: [
              { say: 'You fill every pouch, boot and helmet you own while the priests chant with their backs to you. Shevra fills hers twice. Then you strip the dead hero\'s drake-scale armor and his bone shield from the heap. He won\'t mind. He minded nothing for a long time.' },
              { gold: 600 },
              { give: 'drakescale' },
              { give: 'bone-shield' },
              { line: ['ilsa', 'My crew would mutiny if they saw this. My crew would mutiny *for* this.'] },
            ] }] },
          ],
        },
        { id: 'dome', name: 'The cracked dome',
          look: [
            { say: 'The dome is cracked like an eggshell, gold-veined rock held up by drake thighbones as thick as temple pillars. High above, in the crack, a grandson of Kesh waves at you, mallet in hand, and mimes knocking a prop out. Then he mimes the roof falling. Then he mimes a dragon squashed flat.' },
            { line: ['ilsa', 'They\'re in place. If the worm wakes, we shout.'] },
          ],
          take: 'It\'s holding up a mountain. Leave it be until you need it to stop.',
        },
        { id: 'priests', name: 'Kneeling priests', kind: 'person', portrait: 'generic-man',
          look: 'Robed priests kneel facing the great cave to the east, wax in their ears, chanting the Feeding in a long throbbing drone. Their backs are to the altar. Professionals would never stand like that. Shevra looks personally offended.',
          talk: [{ say: 'They have wax in their ears. So do you. It would be a short and silly conversation.' }],
        },
      ],
      first: [
        { say: 'You come up out of the heat and into the hoard, and every one of you stops dead.' },
        { line: ['shevra', 'Oh. Oh, Bear. Oh, I could die here. I could die *happy* here.'] },
        { line: ['brannoc', 'Then don\'t. Heart first.'] },
      ],
    },

    // ------------------------------------------------------------- the Dragon's Bed
    'c4-bed': {
      ...ROOM['c4-bed'],
      desc: 'A cavern like the inside of a skull, red with lava light. Gold lies drifted in it like snow. And the gold is moving: rising and falling in long slow swells, because under it, coiled around the whole cavern, something vast is breathing.',
      exits: {},
      things: [],
      first: [
        { take: 'earplugs', quiet: true },
        { say: 'You pull the wax from your ears. The sound of the place falls on you: a breathing like surf, a chanting like bees, and over it one cold, beautiful voice.' },
        { scene: { img: 'bg-hoard@fire', portrait: 'thoth-seketh', text: 'Thoth-Seketh stands on a dais of gold before the sleeping head of the dragon, arms raised. An acolyte runs up to him and kneels, holding up the scale-pan from the altar. In it, glowing softly, sits the Starheart. Or something like it.' } },
        { line: ['thoth-seketh', 'At last. Three nights, my Lord, and a thousand years. Wake, and eat, and be in every age at once.'] },
        { say: 'He lifts the glowing thing in his smoking gloves. It does not burn him. He stops. He looks at it. He turns it over.' },
        { line: ['thoth-seketh', '...It is a *melon*.'] },
        { say: 'He digs his fingers in. Snow and green moss spill out over his gloves. Slowly, very slowly, he lifts his golden eyes and finds you at the cavern mouth.' },
        { line: ['shevra', 'Same weight. Same glow. Hello again, Grandad.'] },
        { line: ['thoth-seketh', 'The Cimmerian. Of course. You carried my heart halfway across the world, barbarian, and now you have carried it back to me. How *thoughtful*.'] },
        { line: ['brannoc', 'Come and take it.'] },
        { line: ['thoth-seketh', 'Oh, I will. I will take it from your ashes.'] },
        { say: 'He rakes his nails across the great closed eyelid at his feet. The eye opens. It is the size of a door, and it burns.' },
        { line: ['thoth-seketh', 'Wake, my Lord. Wake *hungry*. There is your Feeding: a heart in a barbarian\'s fist.'] },
        { sfx: 'dragon-roar' }, { shake: true },
        { scene: { img: 'bg-hoard@fire', portrait: 'ygg-sothar', text: 'The gold explodes upward. Ygg-Sothar rises out of its hoard: a head like a burning cathedral, coils as thick as towers, scales black and red and full of stars. It is not all here. Parts of it are somewhere else, somewhen else, and you can feel them moving.' } },
        { line: ['ygg-sothar', 'SMALL... THIEF... GIVE... ME... THE... HEART.'] },
        { line: ['brannoc', 'By Crom, no.'] },
        { say: 'The huge eye rolls toward you, and flinches: from the white frost still crusted on your boots, and from the blue-white light leaking between Brannoc\'s fingers.' },
        { line: ['shevra', 'Did you see that? It hates the cold. And it hates the *heart*.'] },
        { if: 'party:nine', line: ['nine', 'Confirmed. Cold and starlight. My people learned that too late. You will not.'] },
        { if: 'party:zelara', line: ['zelara', 'Fire is its blood. Do not feed it. Freeze it, and burn it with the star.'] },
        { set: ['studied:waking-head', 'studied:waking-coil'] },
        { fight: { id: 'c4-waking', enemies: ['waking-coil', 'waking-head', 'waking-coil'], boss: true, noFlee: true, music: 'boss-dragon', bg: 'bg-hoard@fire',
          intro: 'Ygg-Sothar, the Waking!',
          triggers: [
            { when: 'round>=2', do: [{ line: ['ilsa', 'Bear! The coils guard the head! Cut them away, then go for the eyes!'] }] },
            { when: 'dead', enemy: 'waking-coil', do: [{ line: ['ygg-sothar', 'I... AM... NOT... ONLY... HERE.'] }] },
            { when: 'hp<0.5', enemy: 'waking-head', do: [
              { line: ['ygg-sothar', 'THE HEART... THE HEART...!'] },
              { say: 'The dragon\'s head rears back, wounded and furious, and its jaws open over you like the gates of a burning city. Brannoc plants his feet, throws back his head, and roars the name of his god.' },
              { line: ['brannoc', 'CROOOOOM!'] },
              { sfx: 'rumble' }, { shake: true },
              { scene: { img: 'bg-hoard@fire', text: 'Far above, in the crack of the dome, six mallets swing as one. The bone props fly out like knocked teeth. For one heartbeat nothing happens. Then the whole gold-veined ceiling of the Hoard comes down, a mountain of rock and treasure, onto the dragon\'s head.' } },
              { sfx: 'dragon-roar' }, { shake: true },
              { endBattle: 'win' },
            ] },
          ],
          win: [
            { scene: { img: 'bg-hoard@fire', portrait: 'ygg-sothar', text: 'Ygg-Sothar screams under its own hoard. The cavern floor splits. Buried in gold and stone, the dragon sinks, coil by coil, down into the dark of the earth, and its scream sinks with it, deeper and deeper, until it is only a shudder in the soles of your feet. Then it is a snore.' } },
            { say: 'In the falling dust a figure staggers out of the rubble: Thoth-Seketh, his robes torn, one arm hanging crushed and useless, blood the colour of bile on his face.' },
            { line: ['thoth-seketh', 'You think you have killed it? You have only put it to *bed*. I will go home and wait. And when its sleep is ripest, I will wake it, Cimmerian, and you will be a thousand years dust!'] },
            { say: 'He flings a handful of green fire at you. When the smoke clears he is gone, running west, toward the Standing Stones, still burning from the crossing.' },
            { line: ['brannoc', 'Run, old man. I know where you\'re going.'] },
            { set: 'c4-dragon-down' },
            { take: 'cult-robes', quiet: true },
            Q(8),
            { goto: 'c4-walls' },
          ] } },
      ],
    },

    // ------------------------------------------------------------- the First Walls
    'c4-walls': {
      ...ROOM['c4-walls'],
      desc: [
        { text: 'Where the Bone Fields met the valley, a wall is rising: mud brick and drake bone and stolen stone, faced with the dragon\'s gold. The nomads swarm over it like ants. Kesh sits on a heap of treasure supervising, and the treasure is very large, and so is her smile.' },
        { text: 'By the gate stands a block of white stone, half carved, and beside the gate a narrow postern door hangs on new hinges. West, on its hill, the ring of Standing Stones still burns blue.' },
      ],
      exits: {},
      enter: [{ call: 'c4-redock' }],
      things: [
        { id: 'kesh', name: 'Grandmother Kesh', kind: 'person', portrait: 'kesh',
          look: 'Kesh sits on the biggest heap of the dragon\'s gold like a hen on an egg, smoking, shouting orders and occasionally biting a coin. She has never looked happier. She may never have been happier.',
          talk: [
            { line: ['kesh', 'Founder! Need anything before you go? I\'ll give you the founder\'s price: full price, but I\'ll smile.'] },
            { shop: 'c4-barter' },
          ],
        },
        { id: 'statue', name: 'The half-carved statue',
          look: [
            { say: 'A grandson with a chisel is carving a big man out of white stone: a scowl, a heavy jaw, square shoulders, one hand raised. In the hand, roughly blocked out, a round shape: a star, or a heart.' },
            { line: ['shevra', 'That jaw. I walked past that jaw every day of my life, Bear. It was black with lamp-soot and pigeon muck and nobody knew whose it was. *Nobody knew whose it was.*'] },
            { line: ['brannoc', 'Crom.'] },
          ],
          take: 'It\'s you. You don\'t need two.',
        },
        { id: 'door', name: 'The founder\'s door',
          look: [
            { say: 'A narrow postern of black oak bound in dragon-gold, hung low in the new wall. It has no handle, only a stone mouth carved in its lintel, open as if to speak. Under the mouth, the grandsons have cut a pictogram:' },
            { if: 'var:c4-door-word==1', say: 'A mountain, crowned with a storm: Crom on his mountain.' },
            { if: 'var:c4-door-word==2', say: 'A round fruit, striped. A melon.' },
            { if: 'var:c4-door-word==3', say: 'A woman with a knife, and a wicked grin cut into the stone.' },
            { line: ['shevra', 'Remember it, Bear. Doors outlive people.'] },
          ],
          take: 'It is a door into a city that does not exist yet. You leave it where it can wait.',
        },
        { id: 'grandsons', name: 'Kesh\'s grandsons', kind: 'person', portrait: 'generic-man',
          look: 'The six young men who brought a mountain down on a god are now arguing about where to put a well. One has a broken arm in a sling and the proudest face you have ever seen.',
          talk: [
            { line: ['kesh-grandson', 'Crom! *Crom!* We heard you through a mile of rock. Grandmother says when we have sons they\'ll all be named Crom.'] },
            { line: ['brannoc', 'Name one Brannoc. Crom won\'t mind.'] },
          ],
        },
        { id: 'zelara', name: 'Zelara', kind: 'person', portrait: 'zelara', if: '!party:zelara',
          look: 'Zelara stands at the foot of the wall, a chisel in her hand. She has begun to carve a sun on the first stone of what will be a shrine.',
          talk: [
            { line: ['zelara', 'You put the worm to sleep and sent the snake-priest running. Mitra has no better gift for me.'] },
            { line: ['zelara', 'I will build a light here, on the new wall, and keep it. If you come back, look for my name on the oldest stone.'] },
            { if: 'party:nine', line: ['nine', 'I will look for it. I am very good at waiting.'] },
          ],
        },
        { id: 'stones', name: 'The Standing Stones (go home)',
          look: 'On their hill to the west, the Standing Stones still burn blue where Thoth-Seketh tore through them. The crossing is closing. Not fast, but it is closing.',
          verbs: {
            'Go home': { noReturn: 'The Stones still burn from Thoth-Seketh\'s flight. Step through them with the Starheart, and this age closes behind you.', do: [
              { scene: { img: 'bg-standing-stones', text: 'You climb the hill to the ring. The blue fire in its seams is guttering like a lamp out of oil. Brannoc takes the Starheart out of his shirt, warm and beating, and presses it into the hollow where the stones lean together.' } },
              { if: 'party:zelara', then: [
                { line: ['zelara', 'My shrine is ash, and the man who burned it has run into your age. I am coming with you. Your age needs a priestess more than mine.'] },
              ], else: [
                { say: 'Down by the wall, Zelara raises her hand. You raise yours.' },
              ] },
              { if: 'party:nine', line: ['nine', 'I have waited eleven years to go home with you. I would like to go now.'] },
              { line: ['kesh', 'Go on, founder! And if you ever need a door opened in my city, you know the word!'] },
              { sfx: 'gate-open' },
              { say: 'The ring roars into blue-white light. Brannoc snatches the heart back out of the stone as the world folds, and you fall, together, a thousand years forward, toward a city that is burning.' },
              { set: 'c4-done' },
              { quest: ['ch4-main', 10] },
              { chapter: 'ch5' },
            ] },
          },
          take: 'Nine Cimmerians couldn\'t lift them. They\'re for walking through.',
        },
      ],
      first: [
        { scene: { img: 'bg-founding', text: 'By the third morning the valley is full of hammering. The nomads have dug the dragon\'s gold out of the fallen mountain by the cartload, and with it, on the spot, they are building walls.' } },
        { line: ['kesh', 'Every city needs a founder. Ours will be a thief. Hah! What else?'] },
        { line: ['kesh-grandson', 'Grandmother says we\'re to carve the founder over the gate. What\'s your name, big man?'] },
        { line: ['shevra', 'Oh, he hasn\'t got one worth carving. Just carve him scowling. Nobody will know the difference.'] },
        { say: 'So they carve you holding a star, and leave the plinth blank, because nobody can agree how to spell Brannoc. Kesh names the city in the old valley tongue: *Shadizar*, the place where a thief sat on a dragon.' },
        { line: ['ilsa', 'Founder of the City of Thieves. Your mother would be so proud.'] },
        { line: ['brannoc', 'My mother would have hit me with a pot.'] },
        { if: 'party:nine', line: ['nine', 'In my time, there is no city here. There is no anything. But there is a statue in the old records. A man holding a star. We thought he was a god.'] },
        { if: 'party:zelara', line: ['zelara', 'Mitra has a strange sense of humour. A thief, saving the world. Well. He chose a fisherman once.'] },
        Q(9),
        { pause: true },
        { say: 'Two grandsons are hanging a narrow postern door in the new wall. It has no handle, only a stone mouth carved in the lintel.' },
        { line: ['kesh', 'The founder\'s door. It opens only for the founder\'s word. A founder\'s door opens for one word, big man. Choose one you\'ll remember.'] },
        { choice: [
          { id: 'crom', text: '"Crom."', do: [
            { setvar: ['c4-door-word', 1] },
            { line: ['kesh', 'Your god? Hah. Nobody here can pronounce him anyway.'] },
            { say: 'Under the stone mouth, a grandson cuts a mountain crowned with a storm.' },
          ] },
          { id: 'melon', text: '"Melon."', do: [
            { setvar: ['c4-door-word', 2] },
            { line: ['kesh', '*Melon*? Hah! A thief\'s word. No priest would ever guess it.'] },
            { say: 'Under the stone mouth, a grandson cuts a round, striped fruit.' },
          ] },
          { id: 'shevra', text: '"Shevra."', do: [
            { setvar: ['c4-door-word', 3] },
            { line: ['shevra', '...Oh. Oh, you great soft bear.'] },
            { say: 'Under the stone mouth, a grandson cuts a woman with a knife and a wicked grin.' },
          ] },
        ], prompt: 'Kesh waits, pipe in her teeth. What word opens the founder\'s door?' },
        { sfx: 'door' },
        { line: ['shevra', 'Remember it, Bear. Doors outlive people.'] },
      ],
    },
  },

  // ======================================================================= DIALOGUES
  dialogues: {
    'c4-kesh': {
      start: 'a',
      nodes: {
        a: { who: 'kesh', text: 'Well, lost thieves? Kesh is listening. Kesh is always listening. It\'s cheaper than talking.', next: 'hub' },
        hub: { who: 'kesh', choices: [
          { id: 'who', text: 'Who are you people?', to: 'who' },
          { id: 'serpents', text: 'Have you seen an old man with smoking gloves?', to: 'serpents' },
          { id: 'candles', text: 'Those candles. Can you spare some wax?', to: 'candles', if: '!item:beeswax & !item:earplugs' },
          { id: 'dome', text: 'The dragon\'s hall. If we go in there after the heart...', to: 'dome', if: 'flag:c4-plan' },
          { id: 'trade', text: 'What have you got to trade?', to: 'trade' },
          { id: 'bye', text: 'Later, Grandmother.', end: true },
        ] },
        who: { who: 'kesh', text: 'Thieves. The best in the world. We rob caravans on the old road and Stygians in their tents and each other on feast days. We never stay. Thieves don\'t build. Thieves *take*.', next: 'who2' },
        who2: { who: 'kesh', text: 'Though between you and me, my knees are tired of staying not. Somebody ought to build something one day. Somewhere with a roof. And a good fence.', next: 'hub' },
        serpents: { who: 'kesh', text: 'Smoking gloves? Yes. He came out of the Stones four nights ago, smoking like a doused fire, and the serpent-men bowed down in the ash to him. He carried a light in a box. Blue. It beat like a heart.', next: 'serpents2' },
        serpents2: { who: 'kesh', text: 'They camp under the mountain where the worm sleeps. In three nights, at the Conjunction, they mean to feed it. Get into their camp and you\'ll need their black robes and their password. They hang their robes to dry in the gully past the bone fields. Fools.', do: [Q(2)], next: 'hub' },
        candles: { who: 'kesh', text: 'Beeswax from the wild hives. My grandsons stuff their ears with it when I sing. Take a lump. Kesh is generous to people she likes, and she likes people who ask for strange things.', do: [{ give: 'beeswax' }], next: 'hub' },
        dome: { who: 'kesh', text: 'The hoard? My boys know a crack in its roof. They\'ve been in. They\'ve looked. They came out with *one cup each* and a very bad feeling.', next: 'dome2' },
        dome2: { who: 'kesh', text: 'That roof is held up with drake bones. My boys will climb above it. If the worm wakes, shout Crom\'s name, whoever Crom is, and my boys knock out the props. Then the roof comes down and the gold comes with it. And then, ah, then we dig.', do: [{ set: 'c4-crom-plan' }], next: 'hub' },
        trade: { who: 'kesh', text: 'Gold talks in every age. Show me yours.', do: [{ shop: 'c4-barter' }], next: 'hub' },
      },
    },

    'c4-zelara': {
      start: 'a',
      nodes: {
        a: { who: 'zelara', text: 'You came out of the Stones. I saw the light from here. I keep... I *kept* the Stones. The light of Mitra burned at their foot for two hundred years, and I was the last to tend it.', next: 'hub' },
        hub: { who: 'zelara', choices: [
          { id: 'shrine', text: 'What happened to your shrine?', to: 'shrine' },
          { id: 'thoth', text: 'The man with the smoking gloves. We know him.', to: 'thoth' },
          { id: 'going', text: 'We\'re going after him. Into the mountain.', to: 'going', if: '!flag:c4-flask-given' },
          { id: 'bye', text: 'Rest, priestess.', end: true },
        ] },
        shrine: { who: 'zelara', text: 'His priests came in the night before he did, to make the Stones ready for their master. They nailed the doors and burned my sisters inside. I was out on the hill with the goats. I heard it. I hear it still.', next: 'hub' },
        thoth: { who: 'zelara', text: 'His name is Thoth-Seketh. His cult has always called the dragon under that mountain "the true face of Set". He wants it awake. I want him dead. We will get along, Cimmerian.', next: 'hub' },
        going: { who: 'zelara', text: 'Into the worm\'s house. Then you will cross the river of fire, and fire does not care how brave you are.', next: 'going2' },
        going2: { if: 'party:nine', who: 'zelara', text: 'I would come. But I see your iron friend has my place, and someone must stay with these thieves and keep a light burning for when you come back.', else: 'going3', next: 'flask' },
        going3: { who: 'zelara', text: 'I am coming with you. Do not argue, Cimmerian; better men than you have tried, and I am still here and they are not.', next: 'join' },
        join: { who: 'brannoc', text: 'Wasn\'t going to argue.', do: [{ join: 'zelara', level: 14 }], next: 'flask' },
        flask: { who: 'zelara', text: 'Take this. Mitra\'s frost-water, from the spring under the Stones. It turned a river to ice once. It will crust the fire for you, once. Only once.', do: [{ give: 'frost-flask' }, { set: 'c4-flask-given' }], next: 'hub' },
      },
    },

    'c4-hermit': {
      start: 'a',
      nodes: {
        a: { who: 'hermit', text: 'Visitors! Live ones! Have a melon. No, have two. No, have one, I counted wrong.', next: 'hub' },
        hub: { who: 'hermit', choices: [
          { id: 'melon', text: 'I\'ll take a melon.', to: 'melon', if: '!item:snow-melon' },
          { id: 'why', text: 'Why are your melons cold?', to: 'why' },
          { id: 'bones', text: 'What happened to all these drakes?', to: 'bones' },
          { id: 'future', text: 'Seen the future lately?', to: 'future' },
          { id: 'bye', text: 'Farewell, melon-father.', end: true },
        ] },
        melon: { who: 'hermit', text: 'There! Take it. I\'ve a cellar full. Snow from the high peaks, packed in melons. Don\'t ask. Come back when it\'s gone; there\'s always another.', do: [{ give: 'snow-melon' }], next: 'hub' },
        why: { who: 'hermit', text: 'I hollow them out and pack them with snow from the high peaks, and sing to them, and they keep. Cold as a dead man\'s kiss for a month. The serpent priests buy them off me to walk their burning road. Then they cheat me. Then I curse them. It\'s a living.', next: 'hub' },
        bones: { who: 'hermit', text: 'The Lord under the mountain eats them when it wakes. It woke, once, before I was born. It ate the drakes, the sky and my grandfather\'s hat. Then it slept. The priests want it awake again. I want it asleep. The melons don\'t mind either way.', next: 'hub' },
        future: { who: 'hermit', text: 'Only in dreams. I dreamed a thief sat down on a dragon and called it a throne. A big scowling thief. Holding a star.', next: 'future2' },
        future2: { who: 'shevra', text: 'Bear. He means you. Why does everyone in this age mean you?', next: 'hub' },
      },
    },

    'c4-grandsons': {
      start: 'a',
      nodes: {
        a: { who: 'kesh-grandson', text: 'Big man! Watch this.', next: 'b' },
        b: { who: 'narrator', text: 'Six mallets swing. Six bones fly out from under the timber frame. The frame drops a hand\'s breadth, and six young men catch it with their shoulders, grunting, and slide the bones back in.', next: 'c' },
        c: { who: 'kesh-grandson', text: 'Grandmother says one day we\'ll knock out the bones under something big. So we practise. If you need anything brought down, just shout!' },
      },
    },
  },

  // ======================================================================= ITEMS
  items: {
    'thorn-branch': { name: 'Thorn Branch', type: 'key', icon: 'thorn-branch', desc: 'A long, straight branch from a dead thorn tree, ending in a hooked thorn as long as your finger.' },
    'sling-cord': { name: 'Sling Cord', type: 'key', icon: 'sling-cord', desc: 'Shevra\'s sling cord, braided horsehair. "I want it back, Bear."' },
    'long-arm': { name: 'Long Arm', type: 'key', icon: 'long-arm', desc: 'A thorn branch lashed to a sling cord: a hooked reaching-stick for fishing things out of reach.' },
    'cult-robes': { name: 'Cult Robes', type: 'key', icon: 'cult-robes', desc: 'Black Stygian robes with deep hoods, enough for everyone. They smell of tar and incense and somebody else.' },
    beeswax: { name: 'Beeswax', type: 'key', icon: 'beeswax', desc: 'A soft yellow lump of beeswax from Kesh\'s candles. Kesh\'s grandsons stuff their ears with it when she sings.' },
    earplugs: { name: 'Earplugs', type: 'key', icon: 'beeswax@grey', desc: 'Plugs of beeswax for every ear in the party. The world sounds like the bottom of the sea.' },
    'snow-melon': { name: 'Snow Melon', type: 'key', icon: 'snow-melon', desc: 'A green-striped melon, hollowed out and packed with mountain snow. Frost forms on its skin. It is about as heavy as a Starheart.' },
    'glow-moss': { name: 'Glow Moss', type: 'key', icon: 'glow-moss', desc: 'A mat of pale moss from the Dragon\'s Mouth. It glows the soft blue-white of a Starheart seen through fingers.' },
    'fake-starheart': { name: 'Glowing Melon', type: 'key', icon: 'snow-melon@blue', desc: 'A snow melon wrapped in glowing moss. In bad light, to a tired priest, it is a Starheart. Shevra calls it her masterpiece.' },
  },

  combine: [
    { a: 'thorn-branch', b: 'sling-cord', make: 'long-arm', text: 'You lash Shevra\'s sling cord to the thorn branch. It makes a long, hooked reaching-stick. Shevra watches your knots with deep suspicion.' },
    { a: 'snow-melon', b: 'glow-moss', make: 'fake-starheart', text: 'Shevra packs the moss over the melon with quick thief\'s fingers, pressing and smoothing until it glows blue-white all over. In the dark, at a distance, to a tired priest: a Starheart.' },
  ],

  partyUse: {
    beeswax: [
      { take: 'beeswax', quiet: true },
      { say: 'You tear the beeswax into lumps and pass them round. Everyone rolls two plugs and twists them in. The world goes soft and far away, like the bottom of the sea.' },
      { line: ['shevra', 'WHAT?'] },
      { line: ['brannoc', 'I SAID NOTHING.'] },
      { if: 'party:nine', say: 'Nine simply turns its hearing off, with a small click, and looks smug about it.' },
      { give: 'earplugs' },
    ],
    earplugs: [{ say: 'They\'re already in. You can tell, because Shevra has been mouthing insults at you for some time and you\'ve been nodding.' }],
    'snow-melon': [{ say: 'You knock on the melon and offer it round. Ilsa sniffs it. "It\'s full of *snow*, Bear." Nobody is hungry enough for that.' }],
    'fake-starheart': [{ line: ['shevra', 'Don\'t eat my masterpiece, Bear.'] }],
  },

  // ======================================================================= ENEMIES
  enemies: {
    stygian: {
      ...enemyStats(14, 'minion'), name: 'Stygian Cultist', sprite: 'stygian', size: 'm',
      weak: ['pierce', 'holy'], resist: [], immune: [],
      desc: 'A shaven-headed servant of the Serpent from a thousand years ago, tattooed with coils. Same knife, older god.',
      skills: [
        { name: 'Curse of the Coil', magic: true, el: 'void', power: 1.1, chance: 0.25, status: { poison: 0.3 }, sfx: 'debuff' },
        { name: 'Curved Knife', power: 1.3, dmg: 'slash', chance: 0.3, sfx: 'slash' },
      ],
      attackDmg: 'slash',
      drops: [{ id: 'cult-sigil', chance: 0.4 }],
    },
    'stygian-priest': {
      ...enemyStats(15, 'caster'), name: 'Stygian Priest', sprite: 'cultist', tint: 'violet', size: 'm',
      weak: ['pierce', 'holy'], resist: [], immune: [],
      desc: 'A priest of the Feeding, branded on the cheek. His curses smell of the void between worlds.',
      skills: [
        { name: 'Void Lash', magic: true, el: 'void', power: 1.3, chance: 0.4, sfx: 'debuff' },
        { name: 'Serpent\'s Gaze', magic: true, el: 'void', power: 0.8, chance: 0.2, status: { fear: 0.4 }, sfx: 'debuff' },
      ],
      attackDmg: 'blunt',
      drops: [{ id: 'cult-sigil', chance: 0.6 }, { id: 'mana-lotus', chance: 0.3 }],
    },
    'bat-swarm': {
      ...enemyStats(14, 'minion'), name: 'Bat Swarm', sprite: 'drake', tint: 'dark', size: 's',
      weak: ['slash'], resist: [], immune: [],
      desc: 'A shrieking cloud of cave bats with fire-red eyes. Each one is small. There are a great many ones.',
      skills: [
        { name: 'Shrieking Cloud', power: 0.7, dmg: 'pierce', chance: 0.3, target: 'all', status: { blind: 0.25 }, sfx: 'bite' },
      ],
      attackDmg: 'pierce',
      drops: [],
    },
    drake: {
      ...enemyStats(15, 'brute'), name: 'Ash Drake', sprite: 'drake', size: 'l',
      weak: ['cold'], resist: [], immune: ['fire'],
      desc: 'A warhorse-sized drake with coal eyes and a belly full of fire. A hatchling, by the standards of the mountain.',
      skills: [
        { name: 'Fire Breath', magic: true, el: 'fire', power: 1.0, chance: 0.3, target: 'all', status: { burn: 0.25 }, sfx: 'fire' },
        { name: 'Raking Claws', power: 1.4, dmg: 'slash', chance: 0.3, sfx: 'slash' },
      ],
      attackDmg: 'pierce',
      drops: [{ id: 'drake-scale', chance: 0.6 }],
    },
    'bone-wraith': {
      ...enemyStats(15, 'minion'), name: 'Bone-Wraith', sprite: 'bone-wraith', size: 'm',
      weak: ['blunt', 'holy'], resist: ['slash', 'pierce'], immune: [],
      desc: 'Ash and old hunger held together by a drake\'s grudge. Blades pass through it. Hammers don\'t.',
      skills: [
        { name: 'Grave Chill', magic: true, el: 'cold', power: 1.1, chance: 0.3, sfx: 'cold' },
        { name: 'Wail', power: 0.5, dmg: 'blunt', chance: 0.15, target: 'all', status: { fear: 0.3 }, sfx: 'debuff' },
      ],
      attackDmg: 'slash',
      drops: [{ id: 'bone-charm', chance: 0.4 }],
    },
    salamander: {
      ...enemyStats(16, 'caster'), name: 'Salamander', sprite: 'salamander', size: 'm',
      weak: ['cold'], resist: [], immune: ['fire'],
      desc: 'A lizard of living lava that swims in the mountain\'s blood. Hot enough to melt a sword. Cold kills it.',
      skills: [
        { name: 'Magma Spit', magic: true, el: 'fire', power: 1.3, chance: 0.4, status: { burn: 0.35 }, sfx: 'fire' },
        { name: 'Searing Tail', power: 1.2, dmg: 'blunt', chance: 0.2, sfx: 'blunt' },
      ],
      attackDmg: 'blunt',
      drops: [{ id: 'drake-scale', chance: 0.4 }, { id: 'fire-flask', chance: 0.4 }],
    },
    'waking-head': {
      ...enemyStats(16, 'boss', { atk: 0.85 }), name: 'Ygg-Sothar, the Waking', sprite: 'dragon-waking-head', size: 'xl', pos: 'center',
      weak: ['cold', 'star'], resist: ['slash'], immune: ['fire'],
      desc: 'The Dragon Between Worlds, half awake and furious. Its head is a burning cathedral. Cold and starlight hurt it; fire feeds it.',
      skills: [
        { name: 'Dragonfire', magic: true, el: 'fire', power: 0.85, chance: 0.25, target: 'all', status: { burn: 0.3 }, sfx: 'fire' },
        { name: 'Hoard-Crushing Bite', power: 1.5, dmg: 'pierce', chance: 0.3, sfx: 'bite' },
      ],
      attackDmg: 'pierce',
      drops: [],
    },
    'waking-coil': {
      ...enemyStats(16, 'boss', { hp: 0.4, xp: 0.3, atk: 0.7 }), name: 'Coil of Ygg-Sothar', sprite: 'dragon-waking-coil', size: 'l', pos: 'left',
      weak: ['cold', 'star'], resist: ['slash'], immune: ['fire'],
      desc: 'A loop of the dragon\'s body, thick as a tower, bursting up out of the gold. Part of it is somewhere else.',
      skills: [
        { name: 'Constrict', power: 1.1, dmg: 'blunt', chance: 0.25, status: { stun: 0.3 }, sfx: 'blunt' },
        { name: 'Gold Avalanche', power: 0.7, dmg: 'blunt', chance: 0.15, target: 'all', sfx: 'rumble' },
      ],
      attackDmg: 'blunt',
      drops: [],
    },
  },

  // ======================================================================= SHOPS
  shops: {
    'c4-barter': { name: 'Kesh\'s Barter', keeper: 'kesh', items: [
      'bronze-khopesh', 'bone-maul', 'drake-tooth', 'nomad-bow', 'sun-mace',
      'drakescale', 'bronze-helm', 'bone-shield', 'nomad-silks', 'mitran-vestment',
      'healing-draught', 'great-draught', 'mana-lotus', 'smelling-salts', 'antidote', 'frost-flask-item', 'holy-water',
    ] },
  },

  // ======================================================================= QUESTS
  quests: {
    'ch4-main': { name: 'A Thousand Years Before', main: true, done: 10, stages: {
      1: 'The Gate threw you a thousand years back. Thoth-Seketh\'s smoking tracks lead east. Find someone who knows this valley.',
      2: 'Grandmother Kesh says the serpent cult camps under the smoking mountain. To get in you need their black robes and their password.',
      3: 'Robes and the word: get both, then walk up the gully into the Cult Camp.',
      4: 'The Starheart lies on a weighing-altar in the dragon\'s hoard: change its weight by a hair and the altar screams. It weighs like a ripe melon. Get through the Dragon\'s Mouth and the Hall of Echoes.',
      5: 'Cross the Molten Bridge.',
      6: 'Take the Starheart from the weighing-altar without making it scream.',
      7: 'You have the Starheart. Go east into the Dragon\'s Bed and stop the Feeding. If the worm wakes, shout Crom\'s name.',
      8: 'The dragon sleeps under its own hoard. Go to the nomads\' new walls.',
      9: 'Kesh\'s city has a founder. Go home through the Standing Stones before the crossing closes.',
      10: 'Home, a thousand years forward.',
    } },
  },

  // ======================================================================= HINTS (first match wins)
  hints: [
    { if: 'visited:c4-walls & !flag:c4-done', nudge: 'The crossing in the Standing Stones is closing.', answer: 'Use the "Go home" verb on the Standing Stones at the First Walls.' },
    { if: 'flag:c4-heart-taken & !flag:c4-dragon-down', nudge: 'Kesh\'s grandsons are above the dome. Remember what to shout.', answer: 'Go east from the Hoard Hall into the Dragon\'s Bed and fight. When the dragon\'s head is badly hurt, Brannoc shouts "Crom!" and the roof comes down.' },
    { if: 'flag:c4-bridge-crusted & !flag:c4-heart-taken & !item:fake-starheart', nudge: 'The altar screams if the weight changes by a hair. The heart weighs like a ripe melon, and it glows.', answer: 'Get a snow melon from the hermit in the Bone Fields and Scrape glow moss off the walls in the Dragon\'s Mouth. Combine them in the Bag, then Use the glowing melon on the weighing-altar.' },
    { if: 'item:fake-starheart & !flag:c4-heart-taken', nudge: 'Same weight, same glow.', answer: 'Use the glowing melon on the weighing-altar in the Hoard Hall.' },
    { if: 'visited:c4-echoes & !flag:c4-bridge-crusted', nudge: 'Where a drip of water fell, the crust went black and hard. You need a great deal of cold.', answer: 'Use Zelara\'s Frost Flask on the glowing crust (talk to Zelara at the Nomad Camp about going into the mountain). A snow melon from the hermit works too.' },
    { if: 'flag:c4-plan & !item:earplugs', nudge: 'Every cultist who comes out of the deep has wax plugs in his ears.', answer: 'Ask Grandmother Kesh at the Nomad Camp for wax from her candles, then Use the beeswax on the party (Bag, beeswax, Use on something here, the party).' },
    { if: 'item:earplugs & !visited:c4-echoes', nudge: 'Your ears are stopped. The Hall of Echoes is east of the Dragon\'s Mouth.', answer: 'Go north from the Cult Camp into the Dragon\'s Mouth, then east into the Hall of Echoes.' },
    { if: 'item:cult-robes & !flag:c4-password & !won:c4-picket', nudge: 'The guards keep demanding the word from each other, right beside that barrel.', answer: 'Hide in the wine barrel at the Cult Picket and listen. (Or attack the picket guards, and fight your way in.)' },
    { if: '!item:cult-robes & !flag:c4-plan & quest:ch4-main>=2', nudge: 'Black robes flap on a line at the Cult Picket, out of reach. Something with a hook on a long reach could snag one.', answer: 'Take a branch from the dead thorn tree in the Scorched Valley. Look at the drying line: Shevra lends you her sling cord. Combine them in the Bag into a long arm, and Use it on the drying line.' },
    { if: 'item:cult-robes & !flag:c4-plan', nudge: 'You have the robes and the word.', answer: 'Go east from the Cult Picket into the Cult Camp.' },
    { if: 'quest:ch4-main<2', nudge: 'A thread of cookfire smoke rises south of the valley.', answer: 'Go east into the Scorched Valley, then south to the Nomad Camp, and talk to Grandmother Kesh about the old man with smoking gloves.' },
  ],

  scripts: {
    // Engine workaround: a room entered by `goto` from inside another list (a room's first/enter or an
    // exit's do) never re-renders the dock, because renderDock() is skipped while the outer run is busy.
    // Wait (off the run) until the effect runner is idle, then redraw the dock once.
    'c4-redock': async (g) => {
      let n = 0;
      const tick = () => { if (W.busy === 0 && W.mode === 'explore') g.refresh(); else if (++n < 600) setTimeout(tick, 100); };
      setTimeout(tick, 50);
    },
  },
};
