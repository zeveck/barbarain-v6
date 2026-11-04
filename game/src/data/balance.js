// Balance numbers shared by every chapter (GAME_DESIGN.md → Balance).

export const xpStep = L => Math.round(20 * Math.pow(L, 1.6));

const ROLES = {
  minion: { hp: 1, atk: 1, def: 1, res: 1, agi: 1, xp: 1, gold: 1 },
  brute: { hp: 1.8, atk: 1.25, def: 1.4, res: 0.7, agi: 0.8, xp: 1.6, gold: 1.5 },
  caster: { hp: 0.8, atk: 1.15, def: 0.7, res: 1.6, agi: 1, xp: 1.3, gold: 1.3 },
  boss: { hp: 5, atk: 1.3, def: 1.3, res: 1.3, agi: 1.1, xp: 3, gold: 10 },  // xp 3 (was 6): boss XP is the last level of a band, not two
};

// enemyStats(level, role, mul) -> { level, hp, atk, def, res, agi, xp, gold }
export function enemyStats(L, role = 'minion', mul = {}) {
  const r = ROLES[role] || ROLES.minion;
  const base = {
    hp: 18 + 11 * L, atk: 6 + 3.2 * L, def: 2 + 1.4 * L, res: 1 + 1.1 * L,
    agi: 5 + 1.3 * L, xp: 11 * Math.pow(L, 1.12)  /* 4.4 × 2.5 (round-2 XP scale) */, gold: 2 + 1.5 * L,
  };
  const out = { level: L, role };
  for (const k of Object.keys(base)) out[k] = Math.max(1, Math.round(base[k] * r[k] * (mul[k] ?? 1)));
  if (role === 'boss') out.boss = true;
  return out;
}

export const weaponPrice = p => Math.round((p * p) / 5 / 5) * 5;
export const armorPrice = d => Math.max(10, Math.round((12 * Math.pow(d, 1.5)) / 5) * 5);
