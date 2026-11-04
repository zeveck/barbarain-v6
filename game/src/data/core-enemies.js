// Enemies shared by more than one chapter (Manifest → Enemies, marked ●).
import { enemyStats } from './balance.js';

export default {
  enemies: {
    thug: {
      ...enemyStats(2, 'minion'), name: 'Street Thug', sprite: 'thug', size: 'm',
      weak: ['pierce'], resist: [], immune: [],
      desc: 'A Shadizar bravo with a cudgel and bad breath.',
      skills: [{ name: 'Cudgel Swing', power: 1.3, dmg: 'blunt', chance: 0.3, sfx: 'blunt' }],
      attackDmg: 'blunt',
      drops: [{ id: 'healing-draught', chance: 0.2 }],
    },
    cultist: {
      ...enemyStats(3, 'caster'), name: 'Cultist of Set', sprite: 'cultist', size: 'm',
      weak: ['pierce', 'holy'], resist: [], immune: [],
      desc: 'A hooded servant of the Serpent, with a curved knife and a curse on his lips.',
      skills: [
        { name: 'Serpent\'s Curse', magic: true, el: 'void', power: 1.2, chance: 0.35, status: { poison: 0.3 }, sfx: 'debuff' },
        { name: 'Curved Knife', power: 1.2, dmg: 'slash', chance: 0.3 },
      ],
      attackDmg: 'slash',
      drops: [{ id: 'cult-sigil', chance: 0.5 }],
    },
    // ---- The Pit (sq-pit): ranks 5-3 are fought in Ch I; any left over are fought in Ch V
    // as the re-levelled "-v" variants (Lv 15, same sprites). Ranks 2-1 (iron-bull, khalla) are Ch V's own.
    ...pit('', { sandRat: 2, twin: 4, ghaul: 6, wolf: 5 }),
    ...pit('-v', { sandRat: 15, twin: 15, ghaul: 15, wolf: 15 }),
  },
};

function pit(suffix, lv) {
  const vet = suffix ? ' (Veteran)' : '';
  return {
    ['sand-rat' + suffix]: {
      ...enemyStats(lv.sandRat, 'minion'), name: 'Sand Rat' + vet, sprite: 'thug', tint: 'tan', size: 'm',
      weak: ['pierce'], resist: [], immune: [],
      desc: 'A Pit novice with a net, a club and big dreams.',
      skills: [{ name: 'Sand in the Eyes', power: 0.6, dmg: 'blunt', chance: 0.25, status: { blind: 0.5 } }],
      attackDmg: 'blunt', drops: [],
    },
    ['kothian-twin' + suffix]: {
      ...enemyStats(lv.twin, 'minion'), name: 'Kothian Twin' + vet, sprite: 'twin-swordsman', size: 'm',
      weak: ['pierce'], resist: [], immune: [],
      desc: 'One of two brothers who fight as one. Hit one and the other strikes back.',
      skills: [{ name: 'Brother\'s Riposte', power: 1.3, dmg: 'slash', chance: 0.3 }],
      attackDmg: 'slash', drops: [],
    },
    ['ghaul' + suffix]: {
      ...enemyStats(lv.ghaul, 'brute'), name: 'Ghaul the Hyrkanian' + vet, sprite: 'ghaul', size: 'm',
      weak: ['pierce'], resist: [], immune: [],
      desc: 'A Hyrkanian horse-archer without a horse, and angry about it.',
      skills: [{ name: 'Twin Arrows', power: 0.8, dmg: 'pierce', chance: 0.35, hits: 2 }],
      attackDmg: 'pierce', drops: [],
    },
    ['wolf' + suffix]: {
      ...enemyStats(lv.wolf, 'minion'), name: 'Steppe Wolf' + vet, sprite: 'jackal', tint: 'grey', size: 's',
      weak: ['slash'], resist: [], immune: [],
      desc: 'One of Ghaul\'s wolves. It goes for the hamstring.',
      skills: [{ name: 'Hamstring', power: 1.2, dmg: 'pierce', chance: 0.3, sfx: 'bite' }],
      attackDmg: 'pierce', drops: [],
    },
  };
}
