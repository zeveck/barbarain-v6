// The Manifest (GAME_DESIGN.md → Manifest): every id that crosses a chapter boundary.
// Chapter files spread ROOM['c1-gate'] into their room definitions so names, pictures,
// music and map positions stay exactly as designed.

const r = (name, bg, music, x, y, extra = {}) => ({ name, bg, music, map: { x, y }, ...extra });

export const ROOM = {
  // ---- Chapter I ----
  'c1-gate': r('The Desert Gate', 'bg-desert-gate', 'shadizar', 2, 5),
  'c1-street': r('Street of Lamps', 'bg-street', 'shadizar', 2, 4, { amb: 'amb-crowd' }),
  'c1-tavern': r('The Gilded Jackal', 'bg-tavern', 'shadizar', 1, 4, { safe: true }),
  'c1-den': r("Thieves' Den", 'bg-thieves-den', 'shadizar', 0, 4),
  'c1-bazaar': r('The Bazaar', 'bg-bazaar', 'shadizar', 3, 4, { amb: 'amb-crowd' }),
  'c1-square': r('Statue Square', 'bg-statue-square', 'shadizar', 2, 3),
  'c1-pit': r('The Pit', 'bg-arena', 'shadizar', 1, 3, { amb: 'amb-crowd' }),
  'c1-temple-row': r('Temple Row', 'bg-temple-row', 'shadizar', 3, 3),
  'c1-tullia': r("Tullia's House", 'bg-tullia', 'shadizar', 1, 2),
  'c1-alley': r('Back Alleys', 'bg-alley', 'shadizar', 2, 2),
  'c1-tower-wall': r('The Tower Wall', 'bg-tower-wall', 'heist', 3, 2),
  'c1-tower-garden': r('The Tower Garden', 'bg-tower-garden', 'heist', 4, 2),
  'c1-tower-hall': r('The Tower Hall', 'bg-tower-hall', 'heist', 5, 2),
  'c1-undercroft': r('The Undercroft', 'bg-undercroft', 'heist', 5, 3),
  'c1-moon-stair': r('The Moon Stair', 'bg-moon-stair', 'heist', 5, 1, { safe: true }),
  'c1-crown': r('The Tower Crown', 'bg-tower-crown', 'heist', 5, 0),
  // ---- Chapter II ----
  'c2-road': r('The Caravan Road', 'bg-desert-road', 'road', 0, 1),
  'c2-oasis': r('Oasis of Bones', 'bg-oasis', 'road', 1, 1, { safe: true }),
  'c2-marsh': r('The Salt Marsh', 'bg-salt-marsh', 'road', 1, 2, { amb: 'amb-jungle' }),
  'c2-witch': r("The Witch's Hut", 'bg-witch-hut', 'road', 0, 2),
  'c2-mgate': r('Messantia Gate', 'bg-messantia@dusk', 'sea', 2, 1),
  'c2-docks': r('The Docks', 'bg-messantia', 'sea', 3, 1, { amb: 'amb-sea' }),
  'c2-gull': r('The Drowned Gull', 'bg-harbor-tavern', 'sea', 3, 0, { safe: true }),
  'c2-office': r('Harbor Office', 'bg-harbor-office', 'sea', 4, 0),
  'c2-warehouse': r('Customs Warehouse', 'bg-warehouse', 'sea', 4, 1),
  'c2-tunnels': r("The Smugglers' Tunnels", 'bg-sea-tunnels', 'sea', 4, 3),
  'c2-cistern': r('The Drowned Cistern', 'bg-sea-tunnels@dark', 'sea', 5, 3),
  'c2-pen': r("The Debtors' Pen", 'bg-jail', 'sea', 3, 2),
  'c2-brig': r('The Brig', 'bg-jail@dark', 'sea', 4, 2),
  'c2-deck': r('Deck of the Sea-Wolf', 'bg-ship-deck', 'sea', 5, 1, { amb: 'amb-sea' }),
  'c2-open-sea': r('The Open Sea', 'bg-ship-deck@dusk', 'sea', 6, 1, { amb: 'amb-sea' }),
  'c2-storm': r('The Storm', 'bg-storm', 'sea', 7, 1, { amb: 'amb-storm' }),
  // ---- Chapter III ----
  'c3-beach': r('Wreck Beach', 'bg-beach', 'isle', 1, 3, { safe: true, amb: 'amb-sea' }),
  'c3-ghost-ship': r('The Ghost Ship', 'bg-ghost-ship', 'isle', 0, 3),
  'c3-jungle': r('Jungle Path', 'bg-jungle', 'isle', 1, 2, { amb: 'amb-jungle' }),
  'c3-ape-rocks': r('The Ape Rocks', 'bg-ape-rocks', 'isle', 0, 2),
  'c3-river': r('Serpent River', 'bg-serpent-river', 'isle', 2, 2, { amb: 'amb-jungle' }),
  'c3-gateway': r('The Ruined Gateway', 'bg-ruined-gateway', 'isle', 1, 1),
  'c3-graveyard': r('The Iron Graveyard', 'bg-iron-graveyard', 'isle', 2, 1),
  'c3-glyphs': r('Hall of Glyphs', 'bg-glyph-hall', 'isle', 1, 0),
  'c3-wells': r('The Power Wells', 'bg-power-wells', 'isle', 0, 0),
  'c3-prison': r('The Prison of Nine', 'bg-prison-nine', 'isle', 2, 0),
  'c3-vault': r('Vault of the Drowned Kings', 'bg-vault', 'isle', 0, 1),
  'c3-gate-chamber': r('The Gate Chamber', 'bg-gate-chamber', 'isle', 1, -1),
  // ---- Chapter IV ----
  'c4-stones': r('The Standing Stones', 'bg-standing-stones', 'ancient', 0, 2),
  'c4-valley': r('The Scorched Valley', 'bg-ancient-valley', 'ancient', 1, 2),
  'c4-camp': r('The Nomad Camp', 'bg-nomad-camp', 'ancient', 1, 3, { safe: true }),
  'c4-bones': r('The Bone Fields', 'bg-bone-fields', 'ancient', 2, 3),
  'c4-picket': r('The Cult Picket', 'bg-cult-camp@dusk', 'ancient', 2, 2),
  'c4-cult': r('The Cult Camp', 'bg-cult-camp', 'ancient', 3, 2),
  'c4-mouth': r("The Dragon's Mouth", 'bg-dragon-caves', 'ancient', 3, 1, { amb: 'amb-fire' }),
  'c4-echoes': r('The Hall of Echoes', 'bg-dragon-caves@dark', null, 4, 1),
  'c4-bridge': r('The Molten Bridge', 'bg-molten-bridge', 'ancient', 5, 1, { amb: 'amb-fire' }),
  'c4-hoard': r('The Hoard Hall', 'bg-hoard', 'ancient', 5, 0),
  'c4-bed': r("The Dragon's Bed", 'bg-hoard@fire', 'boss-dragon', 6, 0),
  'c4-walls': r('The First Walls', 'bg-founding', 'ending', 1, 1),
  // ---- Chapter V ----
  'c5-ruins': r('The Tower Ruins', 'bg-tower-ruins', 'finale', 3, 0, { amb: 'amb-fire' }),
  'c5-street': r('Street of Lamps, Burning', 'bg-burning-street', 'finale', 2, 1, { amb: 'amb-fire' }),
  'c5-alley': r('Back Alleys, Burning', 'bg-alley@fire', 'finale', 3, 1),
  'c5-tavern': r('The Gilded Jackal', 'bg-tavern@night', 'shadizar', 1, 1, { safe: true }),
  'c5-square': r('Statue Square', 'bg-burning-square', 'finale', 2, 2),
  'c5-pit': r('The Pit', 'bg-arena@night', 'finale', 1, 2),
  'c5-bazaar': r('The Bazaar', 'bg-bazaar@fire', 'finale', 3, 2),
  'c5-temple': r('Temple Row, Burning', 'bg-temple-row@fire', 'finale', 4, 2),
  'c5-cellar': r('The Temple Cellar', 'bg-undercroft@dark', 'finale', 4, 3),
  'c5-undercity': r('The Undercity', 'bg-undercity', 'finale', 2, 3),
  'c5-coils': r('The Coil Tunnels', 'bg-dragon-caves@void', 'finale', 2, 4),
  'c5-throat': r('The Throat', 'bg-dragon-caves@fire', 'finale', 2, 5),
  'c5-heart': r("The Dragon's Heart", 'bg-dragon-heart', 'boss-dragon', 2, 6),
};

export const NPCS = {
  tullia: { name: 'Madam Tullia', portrait: 'tullia' },
  abulet: { name: 'Abulet', portrait: 'abulet' },
  hasdrubal: { name: 'Hasdrubal', portrait: 'hasdrubal' },
  nimm: { name: 'Old Nimm', portrait: 'nimm' },
  ommo: { name: 'Fat Ommo', portrait: 'ommo' },
  doru: { name: 'Doru the Lanista', portrait: 'doru' },
  khalla: { name: 'Khalla the Unbroken', portrait: 'khalla' },
  poet: { name: 'The Drunk Poet', portrait: 'poet' },
  azhrim: { name: 'Azhrim the Collector', portrait: 'azhrim' },
  'iron-watcher': { name: 'The Iron Watcher', portrait: 'iron-watcher' },
  'bel-priest': { name: 'Priest of Bel', portrait: 'bel-priest' },
  'guard-captain': { name: 'Gate Guard', portrait: 'generic-man' },
  butcher: { name: 'Butcher', portrait: 'generic-man' },
  scholar: { name: 'Scholar', portrait: 'generic-man' },
  beggar: { name: 'Beggar', portrait: 'generic-man' },
  pickpocket: { name: 'Pickpocket', portrait: 'generic-man' },
  valerio: { name: 'Count Valerio', portrait: 'valerio' },
  jailer: { name: 'The Jailer', portrait: 'jailer' },
  sagra: { name: 'Mother Sagra', portrait: 'sagra' },
  singer: { name: 'The Singer', portrait: 'generic-woman' },
  barmaid: { name: 'Barmaid', portrait: 'generic-woman' },
  'old-drunk': { name: 'Old Drunk', portrait: 'generic-man' },
  clerk: { name: 'Clerk', portrait: 'generic-man' },
  'harbor-guard': { name: 'Harbor Guard', portrait: 'generic-man' },
  morvan: { name: 'Morvan Redhand', portrait: 'morvan' },
  kesh: { name: 'Grandmother Kesh', portrait: 'kesh' },
  hermit: { name: 'The Melon Hermit', portrait: 'hermit' },
  'thoth-seketh': { name: 'Thoth-Seketh', portrait: 'thoth-seketh' },
  'ygg-sothar': { name: 'Ygg-Sothar', portrait: 'ygg-sothar' },
  'arms-keeper': { name: 'Argossean Armorer', portrait: 'generic-man' },
  quartermaster: { name: 'The Quartermaster', portrait: 'generic-man' },
  'kesh-grandson': { name: "Kesh's Grandson", portrait: 'generic-man' },
};

export const ASSETS = {
  bg: ['bg-title', 'bg-prologue', 'bg-founding', 'bg-ending-a', 'bg-ending-b', 'bg-ending-c',
    'statue-worn', 'statue-brannoc', 'statue-serpent', 'statue-two',
    'bg-desert-gate', 'bg-street', 'bg-tavern', 'bg-bazaar', 'bg-temple-row', 'bg-statue-square', 'bg-arena', 'bg-thieves-den', 'bg-tullia', 'bg-alley', 'bg-tower-wall', 'bg-tower-garden', 'bg-tower-hall', 'bg-moon-stair', 'bg-tower-crown', 'bg-undercroft',
    'bg-desert-road', 'bg-oasis', 'bg-salt-marsh', 'bg-witch-hut', 'bg-messantia', 'bg-harbor-tavern', 'bg-harbor-office', 'bg-jail', 'bg-warehouse', 'bg-sea-tunnels', 'bg-ship-deck', 'bg-storm',
    'bg-beach', 'bg-ghost-ship', 'bg-jungle', 'bg-ape-rocks', 'bg-serpent-river', 'bg-ruined-gateway', 'bg-iron-graveyard', 'bg-glyph-hall', 'bg-power-wells', 'bg-prison-nine', 'bg-vault', 'bg-gate-chamber',
    'bg-standing-stones', 'bg-ancient-valley', 'bg-nomad-camp', 'bg-bone-fields', 'bg-cult-camp', 'bg-dragon-caves', 'bg-molten-bridge', 'bg-hoard',
    'bg-tower-ruins', 'bg-burning-street', 'bg-burning-square', 'bg-undercity', 'bg-dragon-heart', 'starheart'],
  tints: ['night', 'dusk', 'fire', 'dark', 'fog', 'void'],
  portraits: ['brannoc', 'shevra', 'ptahk', 'ilsa', 'nine', 'zelara', 'thoth-seketh', 'iron-watcher', 'tullia', 'abulet', 'hasdrubal', 'nimm', 'ommo', 'doru', 'khalla', 'poet', 'sagra', 'valerio', 'jailer', 'morvan', 'kesh', 'azhrim', 'bel-priest', 'hermit', 'ygg-sothar', 'generic-man', 'generic-woman'],
  sprites: ['cultist', 'jackal', 'thug', 'city-guard', 'tower-hound', 'spider', 'twin-swordsman', 'ghaul', 'scorpion', 'bandit', 'hyena', 'marsh-eel', 'marine', 'ghost-sailor', 'man-ape', 'river-serpent', 'iron-husk', 'sentinel', 'stygian', 'drake', 'bone-wraith', 'salamander', 'serpent-man', 'rift-horror', 'khalla-fight', 'iron-bull', 'brass-serpent', 'azhrim-fight', 'sea-serpent', 'mother-of-coils', 'dragon-waking-head', 'dragon-waking-coil', 'thoth-true', 'dragon-final-head', 'dragon-final-coil'],
  icons: ['sword', 'greatsword', 'axe', 'mace', 'spear', 'dagger', 'bow', 'sling', 'thrown', 'cutlass', 'staff', 'module', 'body', 'head', 'offhand', 'trinket', 'potion', 'scroll', 'junk', 'gold',
    'rope', 'meat-hook', 'grapnel', 'bone', 'sausage', 'poppy-tears', 'spectacles', 'ledger', 'knucklebones', 'worn-boots', 'jackal-pelt', 'kraken-rum', 'hairpin', 'brig-key', 'blank-order', 'valerio-signet', 'empty-bottle', 'last-breath', 'liar-hair', 'eel-tooth', 'love-potion', 'wedding-ring', 'star-cell', 'coconut', 'thorn-branch', 'sling-cord', 'long-arm', 'cult-robes', 'beeswax', 'frost-flask', 'snow-melon', 'glow-moss', 'starheart', 'key'],
  music: ['title', 'shadizar', 'heist', 'battle', 'boss', 'boss-dragon', 'road', 'sea', 'isle', 'ancient', 'finale', 'ending'],
  sfx: ['slash', 'pierce', 'blunt', 'crit', 'enemy-die', 'hurt', 'bite', 'fire', 'lightning', 'cold', 'holy', 'star', 'buff', 'debuff', 'roar', 'dragon-roar', 'level-up', 'item-get', 'door', 'refuse', 'battle-start', 'heal', 'steal', 'drink', 'summon', 'rumble', 'gate-open', 'heartbeat', 'sting-victory', 'sting-gameover', 'sting-solved',
    'ui-click', 'menu-open', 'equip', 'footsteps', 'save-chime', 'defend', 'status-tick', 'miss', 'coins', 'flee'],
  amb: ['amb-crowd', 'amb-sea', 'amb-storm', 'amb-fire', 'amb-jungle'],
};

// Cross-chapter key items are defined here once (the rest live in their chapter).
export const ITEMS = {
  starheart: { name: 'The Starheart', type: 'key', icon: 'starheart', desc: 'Heavy as a melon, warm, and it beats. Blue-white light leaks between your fingers.' },
  'valerio-signet': { name: "Valerio's Signet", type: 'key', icon: 'valerio-signet', desc: 'A fat gold ring with the Count\'s seal: a leaping dolphin, badly drawn.' },
  'wedding-ring': { name: "A Drowned Man's Ring", type: 'key', icon: 'wedding-ring', desc: 'A heavy gold ring from the sea serpent\'s gut. Inside: "M. to I., forever".' },
  'love-potion': { name: "Sagra's Love Potion", type: 'key', icon: 'love-potion', desc: 'A pink, glittering potion "for a gentleman of the sea". It smells of roses and low tide.' },
  'star-cell': { name: 'Star-cell', type: 'key', icon: 'star-cell', desc: 'A cylinder of crystal and iron, glowing faintly blue. A little brother of the Starheart.' },
  'frost-flask': { name: 'Frost Flask (Key)', type: 'key', icon: 'frost-flask', desc: 'A flask of killing cold, sealed with wax. Enough to crust a river of fire.' },
};

// Chapter-start snapshots for __game.chapter(n, branch) (GAME_DESIGN.md → Chapter-start snapshots).
// Each snapshot is CUMULATIVE: the whole state at that chapter card (every flag, quest, var and
// learned skill from earlier chapters), never a delta. Fields: party, gold, equip, items, flags, quests, vars, learn.
const eqB2 = { weapon: 'broadsword', side: 'iron-mace', body: 'leather-harness', head: 'iron-cap', offhand: 'buckler', trinket: 'pit-gauntlets' };
const eqB3 = { weapon: 'akbitanan-blade', side: 'war-hammer', body: 'mail-shirt', head: 'steel-helm', offhand: 'round-shield', trinket: 'witch-knot' };
const eqB4 = { weapon: 'watcher-blade', side: 'aesir-hammer', body: 'scale-hauberk', head: 'horned-helm', offhand: 'kite-shield', trinket: 'witch-knot' };
const eqB5 = { weapon: 'bronze-khopesh', side: 'bone-maul', body: 'drakescale', head: 'bronze-helm', offhand: 'bone-shield', trinket: 'witch-knot' };
const ch4Flags = ['c1-done', 'c1-statue-seen', 'c2-done', 'c2-ptahk-eyes', 'c3-done', 'c3-choice-made'];
export const CHAPTER_STARTS = {
  ch1: { party: { brannoc: 1 }, gold: 0, equip: { brannoc: { weapon: 'rusty-broadsword', body: 'leather-harness' } }, items: { 'healing-draught': 2 }, flags: [] },
  ch2: {
    party: { brannoc: 6, shevra: 6, ptahk: 6 }, gold: 180,
    equip: { brannoc: eqB2, shevra: { weapon: 'zamorian-stiletto', side: 'sling', body: 'thief-leathers', trinket: 'lucky-coin' }, ptahk: { weapon: 'khitan-staff', body: 'silk-robe' } },
    items: { starheart: 1, 'healing-draught': 4, 'mana-lotus': 2, antidote: 1 }, flags: ['c1-done', 'c1-statue-seen'], quests: { 'sq-pit': 3 },
  },
  ch3: {
    party: { brannoc: 10, shevra: 10, ptahk: 10, ilsa: 10 }, gold: 450,
    equip: { brannoc: eqB3, shevra: { weapon: 'kris', side: 'lead-sling', body: 'shadow-leathers' }, ptahk: { weapon: 'oak-rod', body: 'embroidered-robe' }, ilsa: { weapon: 'barachan-cutlass', side: 'steel-knives', body: 'ilsa-longcoat' } },
    items: { starheart: 1, 'valerio-signet': 1, 'wedding-ring': 1, 'love-potion': 1, 'healing-draught': 5, 'great-draught': 2, 'mana-lotus': 3 },
    flags: ['c1-done', 'c1-statue-seen', 'c2-done', 'c2-ptahk-eyes'], quests: { 'sq-pit': 3, 'sq-witch': 4 }, learn: { brannoc: ['sea-witch-ward'] },
  },
  'ch4-nine': {
    party: { brannoc: 14, shevra: 14, ilsa: 14 }, gold: 700,
    equip: { brannoc: eqB4, shevra: { weapon: 'iron-dead-shiv', side: 'lead-sling', body: 'nightcloak' }, ilsa: { weapon: 'redhand-cutlass', side: 'reaver-bow', body: 'ilsa-longcoat', trinket: 'star-amulet' } },
    items: { 'healing-draught': 6, 'great-draught': 4, 'mana-lotus': 4, 'smelling-salts': 2 },
    flags: [...ch4Flags, 'c3-freed-nine'], quests: { 'sq-pit': 3, 'sq-witch': 4, 'sq-bride': 3 }, learn: { brannoc: ['sea-witch-ward'] },
  },
  'ch4-zelara': {
    party: { brannoc: 14, shevra: 14, ilsa: 14 }, gold: 3200,
    equip: { brannoc: { ...eqB4, weapon: 'kingsbane' }, shevra: { weapon: 'iron-dead-shiv', side: 'lead-sling', body: 'nightcloak' }, ilsa: { weapon: 'redhand-cutlass', side: 'reaver-bow', body: 'ilsa-longcoat', trinket: 'star-amulet' } },
    items: { 'healing-draught': 6, 'great-draught': 4, 'mana-lotus': 4, 'smelling-salts': 2 },
    flags: [...ch4Flags, 'c3-took-vault'], quests: { 'sq-pit': 3, 'sq-witch': 4, 'sq-bride': 3 }, learn: { brannoc: ['sea-witch-ward'] },
  },
  'ch5-nine': {
    party: { brannoc: 17, shevra: 17, ilsa: 17, nine: 17 }, gold: 1400,
    equip: { brannoc: eqB5, shevra: { weapon: 'drake-tooth', side: 'lead-sling', body: 'nomad-silks' }, ilsa: { weapon: 'redhand-cutlass', side: 'nomad-bow', body: 'ilsa-longcoat', trinket: 'star-amulet' }, nine: { weapon: 'piston-module', body: 'nine-plating' } },
    items: { starheart: 1, 'great-draught': 6, 'mana-lotus': 4, 'smelling-salts': 3, 'frost-flask-item': 2 },
    flags: [...ch4Flags, 'c3-freed-nine', 'c4-done'], quests: { 'sq-pit': 3, 'sq-witch': 4, 'sq-bride': 3 }, vars: { 'c4-door-word': 2 }, learn: { brannoc: ['sea-witch-ward'] },
  },
  'ch5-zelara': {
    party: { brannoc: 17, shevra: 17, ilsa: 17, zelara: 17 }, gold: 3600,
    equip: { brannoc: { ...eqB5, weapon: 'kingsbane' }, shevra: { weapon: 'drake-tooth', side: 'lead-sling', body: 'nomad-silks' }, ilsa: { weapon: 'redhand-cutlass', side: 'nomad-bow', body: 'ilsa-longcoat', trinket: 'star-amulet' }, zelara: { weapon: 'sun-mace', body: 'mitran-vestment', head: 'bronze-helm' } },
    items: { starheart: 1, 'great-draught': 6, 'mana-lotus': 4, 'smelling-salts': 3, 'frost-flask-item': 2 },
    flags: [...ch4Flags, 'c3-took-vault', 'c4-done'], quests: { 'sq-pit': 3, 'sq-witch': 4, 'sq-bride': 3 }, vars: { 'c4-door-word': 2 }, learn: { brannoc: ['sea-witch-ward'] },
  },
};
CHAPTER_STARTS.ch4 = CHAPTER_STARTS['ch4-nine'];
CHAPTER_STARTS.ch5 = CHAPTER_STARTS['ch5-nine'];

// Quests shared across chapters (each chapter may add its own c<N>- quests and errands).
export const QUESTS = {
  'sq-pit': { name: 'The Pit of Shadizar', side: true, carry: true, stages: { 0: 'Doru the Lanista runs the Pit. Fight your way up five ranks.', 1: 'Rank 5 beaten. Rank 4, the Kothian Twins, awaits (level 4+).', 2: 'Rank 4 beaten. Rank 3, Ghaul the Hyrkanian, awaits (level 5+).', 3: 'Rank 3 beaten. The top ranks fight only for seasoned blades (level 16+). Come back one day.', 4: 'Rank 2 beaten. Only Khalla the Unbroken remains.', 5: 'You are the champion of the Pit of Shadizar.' }, done: 5 },
  'sq-witch': { name: 'The Salt Witch', side: true, chapter: 2, stages: { 1: 'Mother Sagra wants three things for a love potion: a liar\'s hair, a sailor\'s last breath, and the tooth of the marsh eel.', 2: 'One of three ingredients found.', 3: 'Two of three ingredients found.', 4: 'Mother Sagra brewed her love potion "for a gentleman of the sea".' }, done: 4 },
  'sq-bride': { name: 'The Weeping Bride', side: true, chapter: 3, stages: { 1: 'A ghost ship drifts off Wreck Beach by night. Its captain will not rest.', 2: 'The ghost captain, Morvan Redhand, wants his wedding ring.', 3: 'Morvan Redhand rests at last.' }, done: 3 },
};

export default { npcs: NPCS, items: ITEMS, quests: QUESTS };
