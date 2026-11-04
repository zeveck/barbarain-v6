// Party members: stats, growth, levels, equipment, the party strip and the Party screen.
import { R, S } from './state.js';
import * as U from './ui.js';
import { el } from './util.js';
import { sfx } from './audio.js';
import { itemDef, itemName, canEquip, giveItem, takeItem, SLOT_OF, statLine } from './items.js';

export const SLOTS = ['weapon', 'side', 'head', 'body', 'offhand', 'trinket'];
export const SLOT_NAMES = { weapon: 'Weapon', side: 'Sidearm', head: 'Head', body: 'Body', offhand: 'Off-hand', trinket: 'Trinket' };
export const MAX_LEVEL = 25;

export function xpToReach(level) { // total XP needed to reach `level`
  if (level <= 1) return 0;
  let t = 0;
  for (let L = 1; L < level; L++) t += Math.round(R.xpStep ? R.xpStep(L) : 20 * Math.pow(L, 1.6));
  return t;
}

export function member(id) { return S.members[id]; }
export function memberName(id) { return R.members[id]?.name || id; }

export function baseStats(id, level) {
  const d = R.members[id];
  const s = {};
  for (const k of ['hp', 'mp', 'str', 'agi', 'wil', 'def', 'res']) s[k] = Math.round((d.base[k] || 0) + (d.growth[k] || 0) * (level - 1));
  return s;
}

// Full stats, optionally with one slot swapped for a different item (for comparisons).
export function stats(id, swap) {
  const m = S.members[id];
  const b = baseStats(id, m.level);
  const s = { maxhp: b.hp, maxmp: b.mp, str: b.str, agi: b.agi, wil: b.wil, def: b.def, res: b.res, power: 0, dmg: 'blunt', el: null, kind: null, status: [] };
  const eq = { ...m.equip };
  if (swap) eq[swap.slot] = swap.item;
  for (const slot of SLOTS) {
    if (slot === 'side') continue; // the sidearm only counts when drawn
    const it = eq[slot] && itemDef(eq[slot]);
    if (!it) continue;
    const st = it.stats || {};
    s.maxhp += st.hp || 0; s.maxmp += st.mp || 0; s.str += st.str || 0; s.agi += st.agi || 0;
    s.wil += st.wil || 0; s.def += st.def || 0; s.res += st.res || 0;
    if (it.immune) s.status.push(...it.immune);
    if (slot === 'weapon' && it.weapon) { s.power = it.weapon.power; s.dmg = it.weapon.dmg; s.el = it.weapon.el || null; s.kind = it.weapon.kind; s.magicWeapon = !!it.weapon.magic; }
  }
  s.atk = s.str + s.power;
  s.mag = s.wil + Math.round(s.power * (s.magicWeapon ? 0.8 : 0.25));
  return s;
}

export function alive(id) { return S.members[id] && S.members[id].hp > 0; }

export function healAll(frac = 1) {
  for (const id of S.party) {
    const m = S.members[id]; const st = stats(id);
    if (frac >= 1) { m.hp = st.maxhp; m.mp = st.maxmp; }
    else { m.hp = Math.max(m.hp, Math.ceil(st.maxhp * frac)); m.mp = Math.max(m.mp, Math.ceil(st.maxmp * frac)); }
    m.status = {};
  }
}

export function clampHp(id) {
  const m = S.members[id]; const st = stats(id);
  m.hp = Math.min(m.hp, st.maxhp); m.mp = Math.min(m.mp, st.maxmp);
}

export function skillsOf(id) {
  const d = R.members[id]; const m = S.members[id];
  const list = [];
  for (const [lvl, sk] of d.skills || []) if (m.level >= lvl) list.push(sk);
  for (const sk of m.learned || []) if (!list.includes(sk)) list.push(sk);
  return list.filter(sk => R.skills[sk] && (!R.skills[sk].req || checkReq(R.skills[sk].req)));
}
function checkReq(req) { return (S.inv[req.replace('item:', '')] || 0) > 0; }

export function learnSkill(id, sk) {
  const m = S.members[id]; if (!m) return;
  m.learned = m.learned || [];
  if (!m.learned.includes(sk)) m.learned.push(sk);
  U.logSys(`${memberName(id)} learned ${R.skills[sk]?.name || sk}!`, 'xp'); sfx('levelup');
}

export function newMember(id, level) {
  const d = R.members[id];
  const lv = Math.max(level || 1, d.startLevel || 1);
  const m = { level: lv, xp: xpToReach(lv), hp: 1, mp: 0, equip: {}, learned: [], status: {} };
  for (const [slot, it] of Object.entries(d.start || {})) m.equip[slot] = it;
  S.members[id] = m;
  const st = stats(id); m.hp = st.maxhp; m.mp = st.maxmp;
  return m;
}

export async function joinMember(id, level, quiet) {
  level = Math.max(level || 1, S.members.brannoc?.level || 1);
  if (!S.members[id]) newMember(id, level);
  else if (level && S.members[id].level < level) { S.members[id].level = level; S.members[id].xp = xpToReach(level); }
  if (!S.party.includes(id)) S.party.push(id);
  const st = stats(id); const m = S.members[id]; m.hp = Math.max(m.hp, st.maxhp); m.mp = Math.max(m.mp, st.maxmp);
  if (!quiet) { U.logSys(`${memberName(id)} joins the party!`, 'gold'); U.toast(`${memberName(id)} joins the party`); sfx('levelup'); }
}

export function leaveMember(id, quiet) {
  const i = S.party.indexOf(id);
  if (i < 0) return;
  S.party.splice(i, 1);
  const m = S.members[id];
  for (const slot of SLOTS) {
    const it = m.equip[slot];
    if (it && !(R.members[id].keep || []).includes(it) && !(R.members[id].start && R.members[id].start[slot] === it && R.members[id].keepStart)) { giveItem(it, 1, true); }
    delete m.equip[slot];
  }
  if (!quiet) U.logSys(`${memberName(id)} has left the party. Their gear is in your bag.`, 'bad');
}

export async function addXp(n, text) {
  if (!n) return;
  if (S.easy) n = Math.round(n * 1.25);
  U.logSys(`+${n} XP${text ? ' · ' + text : ''}`, 'xp');
  for (const id of S.party) {
    const m = S.members[id];
    if (m.level >= MAX_LEVEL) continue;
    m.xp += n;
    while (m.level < MAX_LEVEL && m.xp >= xpToReach(m.level + 1)) {
      const before = stats(id); const skBefore = skillsOf(id);
      m.level++;
      const after = stats(id);
      m.hp += after.maxhp - before.maxhp; m.mp += after.maxmp - before.maxmp;
      clampHp(id);
      const gained = skillsOf(id).filter(s => !skBefore.includes(s));
      U.logSys(`${memberName(id)} reaches level ${m.level}! HP +${after.maxhp - before.maxhp}, MP +${after.maxmp - before.maxmp}, STR +${after.str - before.str}${gained.length ? ' · learned ' + gained.map(s => R.skills[s].name).join(', ') : ''}`, 'xp');
      U.toast(`${memberName(id)}: level ${m.level}!`);
      sfx('levelup');
      flashMember(id, 'healfx');
    }
  }
  renderParty();
}

// Keep sidearm/weapon on swap, etc.
export function equip(id, slot, itemId) {
  const m = S.members[id];
  const old = m.equip[slot];
  if (itemId) takeItem(itemId, 1, true);
  if (old) giveItem(old, 1, true);
  if (itemId) m.equip[slot] = itemId; else delete m.equip[slot];
  // two-handed weapons block the off-hand
  if (slot === 'weapon' && itemId && itemDef(itemId)?.weapon?.twoHanded && m.equip.offhand) { giveItem(m.equip.offhand, 1, true); delete m.equip.offhand; }
  if (slot === 'offhand' && itemId && m.equip.weapon && itemDef(m.equip.weapon)?.weapon?.twoHanded) { const w = m.equip.weapon; giveItem(w, 1, true); delete m.equip.weapon; }
  clampHp(id);
  sfx('equip');
}

// Pick the best item for each slot, by a simple score.
export function score(id, slot, itemId) {
  const st = stats(id, { slot, item: itemId });
  if (slot === 'weapon') return st.atk * 2 + st.mag + st.def + st.res;
  if (slot === 'side') {
    const it = itemDef(itemId); if (!it?.weapon) return 0;
    const main = S.members[id].equip.weapon && itemDef(S.members[id].equip.weapon)?.weapon;
    return it.weapon.power + (main && main.dmg !== it.weapon.dmg ? 100 : 0);
  }
  return st.def * 2 + st.res * 2 + st.maxhp / 5 + st.maxmp / 3 + st.str + st.agi + st.wil;
}
export function bestFor(id) {
  let changed = 0;
  for (const slot of SLOTS) {
    const m = S.members[id];
    if (slot === 'offhand' && m.equip.weapon && itemDef(m.equip.weapon)?.weapon?.twoHanded) continue;
    const cur = m.equip[slot];
    let best = cur, bestScore = cur ? score(id, slot, cur) : score(id, slot, null);
    for (const it of Object.keys(S.inv)) {
      if (!(S.inv[it] > 0) || !canEquip(id, it, slot)) continue;
      const sc = score(id, slot, it);
      if (sc > bestScore + 0.001) { best = it; bestScore = sc; }
    }
    if (best !== cur) { equip(id, slot, best); changed++; }
  }
  return changed;
}

// ---------- party strip ----------
export function flashMember(id, cls = 'flash') {
  for (const node of document.querySelectorAll(`.pm[data-id="${id}"]`)) { node.classList.remove(cls); void node.offsetWidth; node.classList.add(cls); }
}
export function floatOnMember(id, text, color) {
  for (const node of document.querySelectorAll(`.pm[data-id="${id}"]`)) {
    const f = el('span', { class: 'float', text, style: { color } }); node.append(f); setTimeout(() => f.remove(), 1000);
  }
}

export function renderParty(activeId) {
  const thin = document.getElementById('party');
  const wide = document.getElementById('party-wide');
  if (!thin) return;
  thin.innerHTML = ''; wide.innerHTML = '';
  wide.classList.toggle('many', S.party.length >= 3);
  for (const id of S.party) {
    const m = S.members[id]; if (!m) continue;
    const st = stats(id);
    const mk = size => {
      const node = el('div', { class: 'pm' + (m.hp <= 0 ? ' down' : '') + (id === activeId ? ' active' : ''), 'data-id': id, 'data-act': 'member:' + id, role: 'button', 'aria-label': memberName(id), onclick: () => { if (!document.getElementById('game').classList.contains('battle')) openParty(id); } },
        U.portraitCanvas(R.members[id].portrait || id, memberName(id), size, true),
        el('div', { class: 'info' },
          el('div', { class: 'nm' }, el('span', { text: memberName(id) }), el('b', { text: 'Lv ' + m.level })),
          el('div', { class: 'bar' }, el('i', { style: { width: Math.max(0, 100 * m.hp / st.maxhp) + '%' } })),
          st.maxmp ? el('div', { class: 'bar mp' }, el('i', { style: { width: Math.max(0, 100 * m.mp / st.maxmp) + '%' } })) : null,
          el('div', { class: 'nums', text: `HP ${m.hp}/${st.maxhp}` + (st.maxmp ? `  MP ${m.mp}/${st.maxmp}` : '') })));
      return node;
    };
    thin.append(mk(48)); wide.append(mk(48));
  }
}

// ---------- Party screen ----------
let partySel = null;
export function openParty(id) {
  partySel = id && S.party.includes(id) ? id : (partySel && S.party.includes(partySel) ? partySel : S.party[0]);
  U.openModal('Party', buildParty, () => { renderParty(); import('./world.js').then(w => w.renderDock()); });
}

function buildParty(body) {
  const seg = el('div', { class: 'seg' });
  for (const id of S.party) seg.append(el('button', { class: id === partySel ? 'on' : '', 'data-act': 'pick:' + id, text: memberName(id), onclick: () => { partySel = id; U.refreshModal(null, buildParty); } }));
  body.append(seg);
  const id = partySel; const m = S.members[id]; const d = R.members[id]; const st = stats(id);
  const next = m.level >= MAX_LEVEL ? '—' : (xpToReach(m.level + 1) - m.xp);
  body.append(el('div', { class: 'member-head' }, U.portraitCanvas(d.portrait || id, d.name, 96),
    el('div', {}, el('h4', { text: d.name }), el('div', { class: 'role', text: d.title || '' }), el('div', { class: 'role', text: `Level ${m.level} · next level in ${next} XP` }))));
  const stt = el('div', { class: 'stats' });
  const row = (k, v) => stt.append(el('div', {}, el('b', { text: k }), el('span', { text: String(v) })));
  row('HP', `${m.hp}/${st.maxhp}`); row('MP', `${m.mp}/${st.maxmp}`); row('Attack', st.atk); row('Magic', st.mag);
  row('Strength', st.str); row('Agility', st.agi); row('Will', st.wil); row('Defense', st.def); row('Resist', st.res);
  body.append(stt);
  if (d.bio) body.append(el('p', { text: d.bio }));

  body.append(el('div', { class: 'actions' },
    U.button('Best gear', 'best', () => { const n = bestFor(id); U.toast(n ? `${d.name}: ${n} item${n > 1 ? 's' : ''} changed` : 'Already wearing the best'); U.refreshModal(null, buildParty); }, 'primary'),
    U.button('Best gear for all', 'best-all', () => { let n = 0; for (const p of S.party) n += bestFor(p); U.toast(n ? `${n} item${n > 1 ? 's' : ''} changed` : 'Everyone is already well armed'); U.refreshModal(null, buildParty); })));

  const slots = el('div', { class: 'slots' });
  for (const slot of SLOTS) {
    if (slot === 'offhand' && !(d.offhand ?? true)) continue;
    const it = m.equip[slot];
    const r = el('button', { class: 'row', 'data-act': 'slot:' + slot, onclick: () => pickForSlot(id, slot) },
      U.iconCanvas(it ? itemDef(it).icon : 'empty', 32),
      el('div', { class: 'main' }, el('div', { class: 't' }, el('span', { class: 'n', text: SLOT_NAMES[slot] + ':' }), el('b', { text: it ? itemName(it) : '— empty —' })),
        el('div', { class: 'd', text: it ? statLine(it) : (slot === 'side' ? 'A second weapon to Swap to in battle' : 'Tap to equip') })));
    slots.append(r);
  }
  body.append(slots);

  body.append(el('h4', { text: 'Skills', style: { color: 'var(--gold-l)', fontWeight: 400, margin: '14px 0 6px' } }));
  const sk = el('div', { class: 'list' });
  const known = skillsOf(id);
  for (const [lvl, s] of d.skills || []) {
    const def = R.skills[s]; if (!def) continue;
    const has = known.includes(s);
    sk.append(el('div', { class: 'row', style: { cursor: 'default', opacity: has ? 1 : 0.5 } },
      el('div', { class: 'main' }, el('div', { class: 't' }, el('b', { text: def.name }), el('span', { class: 'n', text: has ? `${def.mp} MP` : `Level ${lvl}` }), def.el ? el('span', { class: 'tag ' + def.el, text: def.el }) : null),
        el('div', { class: 'd', text: def.desc || '' }))));
  }
  for (const s of m.learned || []) {
    if ((d.skills || []).some(([, x]) => x === s)) continue;
    const def = R.skills[s]; if (!def) continue;
    const has = known.includes(s);
    sk.append(el('div', { class: 'row', style: { cursor: 'default', opacity: has ? 1 : 0.5 } },
      el('div', { class: 'main' }, el('div', { class: 't' }, el('b', { text: def.name }), el('span', { class: 'n', text: `${def.mp} MP` + (has ? '' : ' (needs the Starheart)') })),
        el('div', { class: 'd', text: def.desc || '' }))));
  }
  body.append(sk);
}

function pickForSlot(id, slot) {
  const m = S.members[id];
  U.refreshModal(`${memberName(id)}: ${SLOT_NAMES[slot]}`, body => {
    const cands = Object.keys(S.inv).filter(it => S.inv[it] > 0 && canEquip(id, it, slot));
    cands.sort((a, b) => score(id, slot, b) - score(id, slot, a));
    const cur = m.equip[slot];
    const list = el('div', { class: 'list' });
    const base = stats(id);
    const deltaEl = it => {
      const st = stats(id, { slot, item: it });
      const ds = el('div', { class: 'deltas' });
      const add = (k, a, b) => { const dlt = b - a; if (dlt) ds.append(el('span', { class: dlt > 0 ? 'up' : 'down', text: `${k} ${dlt > 0 ? '+' : ''}${dlt}` })); };
      if (slot === 'side') { const w = itemDef(it)?.weapon; if (w) ds.append(el('span', { class: 'same', text: `${w.dmg} · power ${w.power}` })); return ds; }
      add('ATK', base.atk, st.atk); add('MAG', base.mag, st.mag); add('DEF', base.def, st.def); add('RES', base.res, st.res);
      add('HP', base.maxhp, st.maxhp); add('MP', base.maxmp, st.maxmp); add('AGI', base.agi, st.agi); add('STR', base.str, st.str); add('WIL', base.wil, st.wil);
      if (!ds.childElementCount) ds.append(el('span', { class: 'same', text: 'no change' }));
      return ds;
    };
    if (cur) list.append(el('button', { class: 'row', 'data-act': 'unequip', onclick: () => { equip(id, slot, null); U.refreshModal('Party', buildParty); } },
      el('div', { class: 'main' }, el('div', { class: 't' }, el('b', { text: `Remove ${itemName(cur)}` })))));
    if (!cands.length) list.append(el('p', { text: 'Nothing in your bag fits this slot.' }));
    for (const it of cands) {
      list.append(el('button', { class: 'row', 'data-act': 'equip:' + it, onclick: () => { equip(id, slot, it); U.refreshModal('Party', buildParty); } },
        U.iconCanvas(itemDef(it).icon, 32),
        el('div', { class: 'main' }, el('div', { class: 't' }, el('b', { text: itemName(it) }), S.inv[it] > 1 ? el('span', { class: 'n', text: '×' + S.inv[it] }) : null),
          el('div', { class: 'd', text: statLine(it) }), deltaEl(it))));
    }
    body.append(list);
    body.append(el('div', { class: 'actions' }, U.button('Back', 'back', () => U.refreshModal('Party', buildParty), 'ghost')));
  });
}
