// Party members and skills (GAME_DESIGN.md → The party, Characters and growth, Balance).
export { xpStep } from './balance.js';

export const members = {
  brannoc: {
    name: 'Brannoc', title: 'Cimmerian barbarian', portrait: 'brannoc',
    bio: 'Black-maned and blue-eyed, out of the gloomy hills of Cimmeria. Trusts steel, hates sorcery, keeps his word.',
    base: { hp: 60, mp: 8, str: 12, agi: 8, wil: 4, def: 6, res: 3 },
    growth: { hp: 14, mp: 1.5, str: 2.2, agi: 1.2, wil: 0.6, def: 1.4, res: 0.8 },
    skills: [[1, 'starfire'], [1, 'cleave'], [4, 'war-cry'], [9, 'croms-fury'], [13, 'unbroken'], [17, 'iron-wind']],
    start: { weapon: 'rusty-broadsword', body: 'leather-harness' },
  },
  shevra: {
    name: 'Shevra', title: 'Zamorian thief', portrait: 'shevra',
    bio: 'The quickest hands in Shadizar and the quickest tongue. Calls Brannoc "the Bear". Greedy, mocking, and loyal when it counts.',
    base: { hp: 42, mp: 12, str: 9, agi: 14, wil: 6, def: 4, res: 4 },
    growth: { hp: 9, mp: 2, str: 1.6, agi: 2.0, wil: 0.8, def: 1.0, res: 0.9 },
    skills: [[1, 'steal'], [1, 'size-up'], [3, 'backstab'], [7, 'smoke-powder'], [10, 'venom-edge'], [15, 'thousand-cuts']],
    start: { weapon: 'zamorian-stiletto', body: 'thief-leathers' },
  },
  ptahk: {
    name: 'Ptahk', title: 'Khitan sorcerer', portrait: 'ptahk',
    bio: 'A wizened sorcerer out of far Khitai who complains about his knees, the food and the young. He knows a great deal more than he says.',
    base: { hp: 36, mp: 24, str: 5, agi: 7, wil: 14, def: 3, res: 8 },
    growth: { hp: 7, mp: 4, str: 0.8, agi: 1.0, wil: 2.2, def: 0.8, res: 1.6 },
    skills: [[1, 'lotus-flame'], [1, 'mend'], [1, 'study'], [6, 'sleep-dust'], [8, 'jade-ward'], [10, 'thunder-of-khitai']],
    start: { weapon: 'khitan-staff', body: 'silk-robe' },
  },
  ilsa: {
    name: 'Ilsa Redhand', title: 'Barachan pirate captain', portrait: 'ilsa',
    bio: 'Captain of the Sea-Wolf. Fierce, proud, and happiest in a storm. Respects Brannoc; would die before saying so.',
    base: { hp: 50, mp: 12, str: 11, agi: 11, wil: 6, def: 5, res: 4 },
    growth: { hp: 11, mp: 2, str: 1.9, agi: 1.6, wil: 0.8, def: 1.2, res: 1.0 },
    skills: [[1, 'broadside'], [1, 'rally'], [9, 'grapnel-snare'], [12, 'captains-luck'], [16, 'storm-of-blades']],
    start: { weapon: 'barachan-cutlass', body: 'ilsa-longcoat' },
  },
  nine: {
    name: 'Nine', title: 'Watcher of the Last Legion', portrait: 'nine', offhand: false,
    bio: 'An iron man from the far future, built to kill a dragon. Literal, gentle, and learning what a friend is.',
    base: { hp: 55, mp: 20, str: 10, agi: 7, wil: 12, def: 8, res: 7 },
    growth: { hp: 12, mp: 3.2, str: 1.6, agi: 1.0, wil: 2.0, def: 1.6, res: 1.4 },
    skills: [[1, 'lightning-eye'], [1, 'repair-field'], [1, 'study'], [14, 'shield-lattice'], [15, 'cryo-lance'], [17, 'overclock'], [19, 'last-light']],
    start: { weapon: 'piston-module', body: 'nine-plating' },
  },
  zelara: {
    name: 'Zelara', title: 'Priestess of Mitra', portrait: 'zelara',
    bio: 'A priestess of the young god Mitra among the nomads of the old valley. Calm, stubborn, and unimpressed by Cimmerian scowls.',
    base: { hp: 44, mp: 22, str: 8, agi: 8, wil: 13, def: 5, res: 9 },
    growth: { hp: 9, mp: 3.6, str: 1.2, agi: 1.0, wil: 2.1, def: 1.2, res: 1.7 },
    skills: [[1, 'light-of-mitra'], [1, 'healing-hands'], [1, 'study'], [14, 'purify'], [15, 'sanctuary'], [16, 'dawn-hammer'], [18, 'sunburst']],
    start: { weapon: 'sun-mace', body: 'mitran-vestment' },
  },
};

// type: phys (× ATK) | magic (WIL + power) | heal | buff | debuff | steal | study
// target: enemy | enemies | ally | allies | self | ko-ally
export const skills = {
  // Brannoc
  starfire: { name: 'Starfire', mp: 8, target: 'enemy', type: 'magic', el: 'star', power: 20, levelPower: 2, req: 'item:starheart', desc: 'The Starheart burns through you. Star damage to one foe (needs the Starheart).' },
  cleave: { name: 'Cleave', mp: 4, target: 'enemies', type: 'phys', power: 0.7, desc: 'A great sweeping blow at every foe.' },
  'war-cry': { name: 'War Cry', mp: 6, target: 'allies', type: 'buff', buff: { atkUp: 3 }, msg: 'A Cimmerian war cry! The party\'s blows grow heavier.', desc: 'Raises the party\'s attack for 3 rounds.' },
  'croms-fury': { name: "Crom's Fury", mp: 8, target: 'enemy', type: 'phys', power: 2.2, desc: 'One huge blow with everything behind it.' },
  unbroken: { name: 'Unbroken', mp: 8, target: 'self', type: 'buff', buff: { unbroken: 99 }, msg: 'Brannoc sets his feet. He will not fall to the next blow.', desc: 'Survive the next killing blow with 1 HP.' },
  'iron-wind': { name: 'Iron Wind', mp: 14, target: 'enemies', type: 'phys', power: 1.2, desc: 'A whirlwind of steel that strikes every foe.' },
  'sea-witch-ward': { name: "Sea-Witch's Ward", mp: 8, target: 'allies', type: 'heal', power: 0, cure: true, buff: { resUp: 3 }, desc: 'Mother Sagra\'s charm: party resistance up and sleep washed away.' },
  // Shevra
  steal: { name: 'Steal', mp: 0, target: 'enemy', type: 'steal', desc: 'Lift gold or loot from a foe.' },
  'size-up': { name: 'Size Up', mp: 0, target: 'enemy', type: 'study', desc: 'Learn a foe\'s weaknesses and resistances.' },
  backstab: { name: 'Backstab', mp: 4, target: 'enemy', type: 'phys', power: 1.2, crit: 0.5, desc: 'A knife where it hurts. High critical chance.' },
  'smoke-powder': { name: 'Smoke Powder', mp: 6, target: 'allies', type: 'buff', buff: { evade: 3 }, msg: 'Stinking smoke hides the party.', desc: 'The party dodges more for 3 rounds.' },
  'venom-edge': { name: 'Venom Edge', mp: 6, target: 'enemy', type: 'phys', power: 1, status: { poison: 0.85 }, desc: 'A poisoned cut.' },
  'thousand-cuts': { name: 'Thousand Cuts', mp: 14, target: 'enemy', type: 'phys', power: 0.6, hits: 4, desc: 'Four lightning-quick strikes.' },
  // Ptahk
  'lotus-flame': { name: 'Lotus Flame', mp: 4, target: 'enemy', type: 'magic', el: 'fire', power: 12, desc: 'Fire blooms like a lotus. Fire damage to one foe.' },
  mend: { name: 'Mend', mp: 4, target: 'ko-ally', type: 'heal', power: 20, wilMul: 2, revive: 0.25, desc: 'Heals one ally (and can rouse the fallen).' },
  study: { name: 'Study', mp: 0, target: 'enemy', type: 'study', desc: 'Learn a foe\'s weaknesses and resistances.' },
  'sleep-dust': { name: 'Sleep Dust', mp: 6, target: 'enemies', type: 'debuff', status: { sleep: 0.5 }, desc: 'May put every foe to sleep.' },
  'jade-ward': { name: 'Jade Ward', mp: 8, target: 'allies', type: 'buff', buff: { defUp: 3 }, msg: 'Green light settles over the party like armor.', desc: 'Raises the party\'s defense for 3 rounds.' },
  'thunder-of-khitai': { name: 'Thunder of Khitai', mp: 14, target: 'enemies', type: 'magic', el: 'lightning', power: 24, desc: 'Lightning on every foe.' },
  // Ilsa
  broadside: { name: 'Broadside', mp: 4, target: 'enemies', type: 'phys', power: 0.8, dmg: 'pierce', desc: 'A volley of thrown steel at every foe (pierce).' },
  rally: { name: 'Rally', mp: 6, target: 'allies', type: 'heal', power: 15, wilMul: 1, cure: true, desc: 'A captain\'s shout: heals the party a little and banishes fear.' },
  'grapnel-snare': { name: 'Grapnel Snare', mp: 6, target: 'enemy', type: 'phys', power: 0.8, dmg: 'pierce', status: { stun: 0.65 }, desc: 'Hook a foe and yank it off its feet. May stun.' },
  'captains-luck': { name: "Captain's Luck", mp: 6, target: 'allies', type: 'buff', buff: { luck: 3 }, msg: 'Fortune favors the bold.', desc: 'Critical hits much more likely for 3 rounds.' },
  'storm-of-blades': { name: 'Storm of Blades', mp: 14, target: 'enemies', type: 'phys', power: 1.3, desc: 'Ilsa dances through the enemy line.' },
  // Nine
  'lightning-eye': { name: 'Lightning Eye', mp: 8, target: 'enemies', type: 'magic', el: 'lightning', power: 24, desc: 'Lightning from Nine\'s eye. Hits every foe.' },
  'repair-field': { name: 'Repair Field', mp: 8, target: 'allies', type: 'heal', power: 15, wilMul: 1, desc: 'A humming blue field heals the party.' },
  'shield-lattice': { name: 'Shield Lattice', mp: 8, target: 'allies', type: 'buff', buff: { defUp: 3, resUp: 3 }, msg: 'A lattice of light wraps the party.', desc: 'Raises the party\'s defense and resistance.' },
  'cryo-lance': { name: 'Cryo Lance', mp: 14, target: 'enemy', type: 'magic', el: 'cold', power: 40, desc: 'A lance of killing frost.' },
  overclock: { name: 'Overclock', mp: 8, target: 'ally', type: 'buff', buff: {}, extraTurn: true, msg: 'Nine floods an ally with borrowed speed.', desc: 'One ally acts again at once.' },
  'last-light': { name: 'Last Light', mp: 22, target: 'enemy', type: 'magic', el: 'star', power: 60, desc: 'The light of a future that hasn\'t died yet. Huge star damage.' },
  // Zelara
  'light-of-mitra': { name: 'Light of Mitra', mp: 4, target: 'enemy', type: 'magic', el: 'holy', power: 24, desc: 'Holy light on one foe.' },
  'healing-hands': { name: 'Healing Hands', mp: 4, target: 'ko-ally', type: 'heal', power: 20, wilMul: 2, revive: 0.25, desc: 'Heals one ally (and can rouse the fallen).' },
  purify: { name: 'Purify', mp: 6, target: 'allies', type: 'heal', power: 0, cure: true, desc: 'Cures every ailment in the party.' },
  sanctuary: { name: 'Sanctuary', mp: 8, target: 'allies', type: 'buff', buff: { regen: 4 }, msg: 'A warm light: the party heals each round.', desc: 'The party regains HP each round for 4 rounds.' },
  'dawn-hammer': { name: 'Dawn Hammer', mp: 8, target: 'enemy', type: 'phys', power: 1.4, dmg: 'blunt', el: 'holy', desc: 'A blunt blow blazing with holy light.' },
  sunburst: { name: 'Sunburst', mp: 22, target: 'enemies', type: 'magic', el: 'holy', power: 60, desc: 'Mitra\'s noon on every foe.' },
};
