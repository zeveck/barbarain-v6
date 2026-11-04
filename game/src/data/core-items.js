// All gear, consumables and shared junk (GAME_DESIGN.md → Gear power per chapter).
import { weaponPrice, armorPrice } from './balance.js';

const W = (name, kind, dmg, power, desc, extra = {}) => ({
  name, type: 'weapon', icon: kind, desc, price: extra.price ?? weaponPrice(power),
  weapon: { kind, dmg, power, el: extra.el || null, twoHanded: ['greatsword', 'spear', 'bow', 'staff'].includes(kind), magic: kind === 'staff' || kind === 'module' && !!extra.magic },
  ...(extra.stats ? { stats: extra.stats } : {}), ...(extra.users ? { users: extra.users } : {}),
});
const A = (name, slot, def, desc, extra = {}) => ({
  name, type: slot, icon: slot, desc, price: extra.price ?? armorPrice(def + (extra.bonus || 0)),
  stats: { def, ...(extra.stats || {}) }, heavy: !!extra.heavy, ...(extra.users ? { users: extra.users } : {}),
});
const T = (name, desc, stats, price, extra = {}) => ({ name, type: 'trinket', icon: 'trinket', desc, price, stats, ...extra });
const C = (name, use, price, desc, icon = 'potion') => ({ name, type: 'consumable', icon, desc, price, use });
const J = (name, price, desc, icon = 'junk') => ({ name, type: 'junk', icon, desc, price });

export default {
  items: {
    // ---------- Tier I ----------
    'rusty-broadsword': W('Rusty Broadsword', 'sword', 'slash', 8, 'Notched, rusty, and taken off a dead Aquilonian. It still cuts.', { price: 20 }),
    broadsword: W('Broadsword', 'sword', 'slash', 12, 'Honest Zamorian steel, oiled and keen.'),
    'hand-axe': W('Hand Axe', 'axe', 'slash', 13, 'A woodsman\'s axe with a soldier\'s edge.'),
    'iron-mace': W('Iron Mace', 'mace', 'blunt', 12, 'For bones, armor and arguments.'),
    'boar-spear': W('Boar Spear', 'spear', 'pierce', 13, 'Cross-barred so the boar can\'t run up the shaft. Two hands.'),
    'zamorian-stiletto': W('Zamorian Stiletto', 'dagger', 'pierce', 10, 'Thin as a rumor, sharp as a debt collector.'),
    'throwing-knives': W('Throwing Knives', 'thrown', 'pierce', 9, 'A bandolier of balanced blades.'),
    sling: W('Sling', 'sling', 'blunt', 8, 'A strip of leather and a pocketful of lead.'),
    'khitan-staff': W('Khitan Staff', 'staff', 'blunt', 9, 'Black lacquered wood carved with characters nobody here can read.', { stats: { wil: 2 } }),
    'short-bow': W('Short Bow', 'bow', 'pierce', 11, 'A horseman\'s bow. Two hands.'),
    'hyrkanian-bow': W('Hyrkanian Bow', 'bow', 'pierce', 16, 'Horn and sinew, from Ghaul of the Pit. It sings when drawn.', { price: 260 }),
    'leather-harness': A('Leather Harness', 'body', 3, 'Straps and studs. Mostly for show, partly for stopping knives.'),
    'iron-cap': A('Iron Cap', 'head', 2, 'A simple helm, dented by someone else\'s head.', { heavy: true }),
    buckler: A('Buckler', 'offhand', 3, 'A small round shield for turning blades.', { heavy: true }),
    'thief-leathers': A('Thief Leathers', 'body', 3, 'Dark, quiet, many-pocketed.', { stats: { agi: 2 }, bonus: 1 }),
    'silk-robe': A('Silk Robe', 'body', 2, 'Embroidered with cranes. Smells of incense.', { stats: { wil: 2 }, bonus: 1 }),
    'pit-gauntlets': T('Pit Gauntlets', 'Bloodstained gauntlets from the Pit of Shadizar.', { str: 3 }, 160),
    'lucky-coin': T('Lucky Coin', 'An Aquilonian crown worn smooth by a gambler\'s thumb. Critical hits come easier.', { agi: 2 }, 120),

    // ---------- Tier II ----------
    'akbitanan-blade': W('Akbitanan Blade', 'sword', 'slash', 20, 'Blue-black steel from the forges of Akbitana.'),
    'nordheimer-axe': W('Nordheimer Axe', 'axe', 'slash', 22, 'A bearded axe from the frozen north. Smells faintly of mead.'),
    'war-hammer': W('War Hammer', 'mace', 'blunt', 20, 'A soldier\'s answer to armor.'),
    kris: W('Kris', 'dagger', 'pierce', 18, 'A wavy Vendhyan blade. The waves make wounds that won\'t close.'),
    'steel-knives': W('Steel Knives', 'thrown', 'pierce', 17, 'Better steel, better balance.'),
    'lead-sling': W('Lead Sling', 'sling', 'blunt', 16, 'Lead shot, cast in moulds shaped like little skulls.'),
    'barachan-cutlass': W('Barachan Cutlass', 'cutlass', 'slash', 18, 'A pirate\'s blade, notched from a dozen boardings.'),
    'argos-saber': W('Argossean Saber', 'cutlass', 'slash', 21, 'A navy officer\'s saber. The officer won\'t miss it.'),
    'oak-rod': W('Oak Rod', 'staff', 'blunt', 16, 'A druid-cut rod of black oak.', { stats: { wil: 4 } }),
    'mail-shirt': A('Mail Shirt', 'body', 10, 'Riveted iron rings to the knee.', { heavy: true }),
    'steel-helm': A('Steel Helm', 'head', 4, 'An Argossean marine\'s helm.', { heavy: true }),
    'round-shield': A('Round Shield', 'offhand', 5, 'Painted with a red kraken.', { heavy: true }),
    'shadow-leathers': A('Shadow Leathers', 'body', 7, 'Oiled black leather that drinks the light.', { stats: { agi: 4 }, bonus: 2 }),
    'embroidered-robe': A('Embroidered Robe', 'body', 6, 'Sigils stitched in gold thread.', { stats: { wil: 4 }, bonus: 2 }),
    'ilsa-longcoat': A('Ilsa\'s Longcoat', 'body', 9, 'Red wool, salt-stained, with a hidden mail lining.', { stats: { agi: 2 }, users: ['ilsa'] }),
    'witch-knot': T('Witch-Knot', 'Mother Sagra\'s knotted charm of hair and sea-glass. Immune to poison and sleep.', { res: 2 }, 300, { immune: ['poison', 'sleep'] }),

    // ---------- Tier III ----------
    'watcher-blade': W('Watcher Blade', 'sword', 'slash', 32, 'Taken from a fallen iron man. The edge never dulls.'),
    'aesir-hammer': W('Aesir Hammer', 'mace', 'blunt', 31, 'A northern war hammer bound with runes.'),
    'hyrkanian-lance': W('Hyrkanian Lance', 'spear', 'pierce', 30, 'A horse-archer\'s lance, long and wicked. Two hands.'),
    'iron-dead-shiv': W('Iron-Dead Shiv', 'dagger', 'pierce', 29, 'A splinter of future steel wrapped in leather.'),
    'reaver-bow': W('Reaver Bow', 'bow', 'pierce', 28, 'A black recurve bow. Two hands.'),
    'serpent-rod': W('Serpent Rod', 'staff', 'blunt', 26, 'A rod of green bronze shaped like a coiled snake.', { stats: { wil: 8 } }),
    'redhand-cutlass': W('Redhand\'s Cutlass', 'cutlass', 'slash', 34, 'Morvan Redhand\'s own blade, freed from the drowned with his blessing.', { price: 1200 }),
    kingsbane: W('Kingsbane', 'axe', 'slash', 40, 'A drowned king\'s great axe of black iron, crusted with pearls. It has ended dynasties.', { price: 1600 }),
    'scale-hauberk': A('Scale Hauberk', 'body', 15, 'Bronze scales over leather, like a fish of war.', { heavy: true }),
    'horned-helm': A('Horned Helm', 'head', 6, 'A Vanir helm with bull horns.', { heavy: true }),
    'kite-shield': A('Kite Shield', 'offhand', 8, 'A tall shield painted with a sea-eagle.', { heavy: true }),
    nightcloak: A('Nightcloak', 'body', 10, 'Woven of shadow and spider-silk.', { stats: { agi: 6 }, bonus: 3 }),
    'star-amulet': T('Star Amulet', 'A shard of a Starheart in a silver cage. It hums against sorcery.', { res: 6 }, 650),

    // ---------- Tier IV ----------
    'bronze-khopesh': W('Bronze Khopesh', 'sword', 'slash', 38, 'A sickle-sword of the old kingdoms, a thousand years before Shadizar.'),
    'bone-maul': W('Bone Maul', 'mace', 'blunt', 38, 'A drake\'s thighbone set with flint.'),
    'drake-tooth': W('Drake Tooth', 'dagger', 'pierce', 36, 'A drake\'s fang, still warm.'),
    'nomad-bow': W('Nomad Bow', 'bow', 'pierce', 35, 'A long, light bow of the valley nomads.'),
    'piston-module': W('Piston Module', 'module', 'blunt', 34, 'Nine\'s forearm hammer. Strikes like a ram.', { users: ['nine'] }),
    'sun-mace': W('Sun Mace', 'mace', 'blunt', 34, 'A temple mace with a gilded sunburst head.', { stats: { wil: 6 } }),
    'nine-plating': A('Legion Plating', 'body', 16, 'Nine\'s own armor, part of its body.', { users: ['nine'], price: 0 }),
    drakescale: A('Drakescale', 'body', 20, 'Armor of shed drake scales. It shrugs off fire.', { heavy: true }),
    'bronze-helm': A('Bronze Helm', 'head', 8, 'A crested helm of the old kingdoms.', { heavy: true }),
    'bone-shield': A('Bone Shield', 'offhand', 11, 'A drake\'s shoulder blade with a hand grip.', { heavy: true }),
    'nomad-silks': A('Nomad Silks', 'body', 14, 'Layered desert silks, cool and tough.', { stats: { agi: 8 }, bonus: 4 }),
    'mitran-vestment': A('Mitran Vestment', 'body', 13, 'White and gold, embroidered with the sun.', { stats: { wil: 8 }, bonus: 4 }),

    // ---------- Tier V ----------
    'bel-blade': W('Blade of Bel', 'sword', 'slash', 48, 'Blessed by the god of thieves. It has never been paid for.'),
    'stygian-greataxe': W('Stygian Greataxe', 'axe', 'slash', 50, 'Black bronze, serpent-etched, taken from a fanatic.'),
    'shadizars-fang': W('Shadizar\'s Fang', 'dagger', 'pierce', 46, 'The legendary dagger of the city\'s founder. Shevra finds the irony delicious.'),
    'star-lance-module': W('Star-Lance Module', 'module', 'pierce', 48, 'A spear of hard light for Nine\'s arm.', { users: ['nine'] }),
    'hammer-of-bel': W('Hammer of Bel', 'mace', 'blunt', 48, 'A temple hammer that rings like a gong.'),
    'champions-greatsword': W('Champion\'s Greatsword', 'greatsword', 'slash', 56, 'The prize of the Pit: the greatsword of the champion of Shadizar. Two hands.', { price: 3000 }),
    'gilded-plate': A('Gilded Plate', 'body', 26, 'A Turanian prince\'s parade armor. It works anyway.', { heavy: true }),
    'bull-horn-helm': A('Bull-Horn Helm', 'head', 10, 'The Iron Bull of Turan\'s helm. Heavy, horned, glorious.', { heavy: true }),
    'tower-shield': A('Tower Shield', 'offhand', 14, 'A wall you can carry.', { heavy: true }),
    'thief-kings-mail': A('Thief-King\'s Mail', 'body', 18, 'Fine black mail from the Thieves\' Den\'s secret vault.', { stats: { agi: 10 }, bonus: 5 }),
    'serpent-charm': T('Serpent Charm', 'A carved serpent swallowing its tail. Wards off venom and the void.', { res: 10 }, 900, { immune: ['poison', 'fear'], resist: ['void'] }),

    // ---------- Consumables ----------
    'healing-draught': C('Healing Draught', { heal: 40 }, 15, 'Bitter herbs in cheap wine. Restores 40 HP.', 'potion@red'),
    'great-draught': C('Great Draught', { heal: 120 }, 60, 'A thick red tonic. Restores 120 HP.', 'potion@violet'),
    'elixir-of-bel': C('Elixir of Bel', { heal: 9999 }, 400, 'Holy wine of the thieves\' god. Restores all HP.', 'potion@gold'),
    'mana-lotus': C('Mana Lotus', { mp: 20 }, 30, 'A dried blue lotus to chew. Restores 20 MP.', 'potion@blue'),
    antidote: C('Antidote', { cure: ['poison'] }, 10, 'Charcoal and goat\'s milk. Cures poison.', 'potion@green'),
    'smelling-salts': C('Smelling Salts', { revive: 0.25 }, 50, 'Wakes the fallen at a quarter of their HP.', 'potion@tan'),
    'fire-flask': C('Fire Flask', { damage: { el: 'fire', power: 40 } }, 40, 'Stygian oil in a clay flask. Throw for fire damage.', 'potion@orange'),
    'frost-flask-item': C('Frost Flask', { damage: { el: 'cold', power: 40 } }, 40, 'Snow from the Kezankian peaks, kept by sorcery. Throw for cold damage.', 'potion@cyan'),
    'holy-water': C('Holy Water', { damage: { el: 'holy', power: 40 } }, 40, 'Blessed in Mitra\'s name. Throw for holy damage.', 'potion@white'),
    'smoke-bomb': C('Smoke Bomb', { flee: true }, 30, 'Escape any ambush or hunt (story fights hold you fast).', 'potion@grey'),

    // ---------- Shared junk ----------
    'jackal-pelt': J('Jackal Pelt', 12, 'Mangy, but a furrier will take it.'),
    'cult-sigil': J('Serpent Sigil', 30, 'A bronze serpent pin worn by cultists of Set.'),
    'scorpion-tail': J('Scorpion Tail', 20, 'Still twitching. Apothecaries pay for the venom.'),
    'iron-scrap': J('Iron-Dead Scrap', 60, 'A strange curved plate of future iron.'),
    'drake-scale': J('Drake Scale', 90, 'Warm to the touch for hours.'),
    'serpent-scale': J('Serpent Scale', 45, 'Iridescent, big as a shield-boss.'),
    'bone-charm': J('Bone Charm', 70, 'A wraith\'s fetish of finger bones.'),
  },
};
