// Items: registry helpers, the Bag screen, combining and using.
import { R, S } from './state.js';
import * as U from './ui.js';
import { el } from './util.js';
import { sfx } from './audio.js';

export const KIND_USERS = {
  sword: ['brannoc', 'ilsa'], greatsword: ['brannoc'], axe: ['brannoc'], mace: ['brannoc', 'zelara'], spear: ['brannoc'],
  dagger: ['shevra'], thrown: ['shevra', 'ilsa'], sling: ['shevra'], cutlass: ['ilsa'], bow: ['ilsa'], staff: ['ptahk', 'zelara'], module: ['nine'],
};
export const KIND_NAMES = { sword: 'Sword', greatsword: 'Greatsword', axe: 'Axe', mace: 'Mace', spear: 'Spear', dagger: 'Dagger', thrown: 'Thrown', sling: 'Sling', cutlass: 'Cutlass', bow: 'Bow', staff: 'Staff', module: 'Module' };
export const SLOT_OF = { weapon: 'weapon', body: 'body', head: 'head', offhand: 'offhand', trinket: 'trinket' };
const TYPE_ORDER = { weapon: 0, body: 1, head: 2, offhand: 3, trinket: 4, consumable: 5, key: 6, junk: 7 };
const ALL = ['brannoc', 'shevra', 'ptahk', 'ilsa', 'nine', 'zelara'];

export function itemDef(id) { return R.items[id]; }
export function itemName(id) { return R.items[id]?.name || id; }

export function usersOf(id) {
  const it = R.items[id]; if (!it) return [];
  if (it.users) return it.users;
  if (it.type === 'weapon') return KIND_USERS[it.weapon?.kind] || [];
  if (it.type === 'body') return it.heavy ? ['brannoc', 'ilsa', 'zelara'] : ALL.filter(x => x !== 'nine');
  if (it.type === 'head' || it.type === 'offhand') return it.heavy ? ['brannoc', 'ilsa', 'zelara'] : ALL.filter(x => x !== 'nine');
  if (it.type === 'trinket') return ALL;
  return [];
}

export function canEquip(member, id, slot) {
  const it = R.items[id]; if (!it) return false;
  const t = slot === 'side' ? 'weapon' : slot;
  if (it.type !== t) return false;
  return usersOf(id).includes(member);
}

export function statLine(id) {
  const it = R.items[id]; if (!it) return '';
  const p = [];
  if (it.weapon) p.push(`${KIND_NAMES[it.weapon.kind] || it.weapon.kind} · ${it.weapon.dmg}${it.weapon.el ? ' + ' + it.weapon.el : ''} · power ${it.weapon.power}`);
  const st = it.stats || {};
  for (const [k, n] of [['def', 'DEF'], ['res', 'RES'], ['str', 'STR'], ['agi', 'AGI'], ['wil', 'WIL'], ['hp', 'HP'], ['mp', 'MP']]) if (st[k]) p.push(`${n} ${st[k] > 0 ? '+' : ''}${st[k]}`);
  if (it.immune) p.push('immune: ' + it.immune.join(', '));
  if (it.use) {
    const u = it.use;
    if (u.heal) p.push(u.heal >= 9999 ? 'restores all HP' : `restores ${u.heal} HP`);
    if (u.mp) p.push(`restores ${u.mp} MP`);
    if (u.revive) p.push(`revives at ${Math.round(u.revive * 100)}%`);
    if (u.cure) p.push(`cures ${[].concat(u.cure).join(', ')}`);
    if (u.damage) p.push(`${u.damage.el || ''} damage ${u.damage.power}${u.damage.all ? ', all foes' : ''}`);
    if (u.flee) p.push('escape any non-boss battle');
    if (u.party) p.push('whole party');
  }
  const out = p.join(' · ');
  return out.charAt(0).toUpperCase() + out.slice(1);
}

export function giveItem(id, n = 1, quiet = false) {
  if (!R.items[id]) { console.error('unknown item', id); return; }
  S.inv[id] = (S.inv[id] || 0) + n;
  S.order[id] = ++S.orderSeq;
  S.newItems[id] = true;
  if (!quiet) {
    U.logSys(`Received: ${itemName(id)}${n > 1 ? ' ×' + n : ''}`, R.items[id].type === 'key' ? 'gold' : '');
    sfx(R.items[id].type === 'key' ? 'solve' : 'item');
  }
}

export function takeItem(id, n = 1, quiet = false) {
  if (!S.inv[id]) return false;
  S.inv[id] -= n;
  if (S.inv[id] <= 0) { delete S.inv[id]; delete S.newItems[id]; }
  if (!quiet) U.logSys(`${itemName(id)} ${R.items[id]?.type === 'key' ? 'is gone' : 'used'}${n > 1 ? ' ×' + n : ''}.`);
  return true;
}

export async function combineItems(a, b) {
  const r = R.combine.find(c => (c.a === a && c.b === b) || (c.a === b && c.b === a));
  if (!r || (r.if && !(await import('./state.js')).check(r.if))) {
    U.logSay(`You turn the ${itemName(a).toLowerCase()} and the ${itemName(b).toLowerCase()} over in your hands. They don't go together.`);
    sfx('refuse');
    return false;
  }
  const keepA = r.keepA || r.keep === 'a' || r.keep === r.a, keepB = r.keepB || r.keep === 'b' || r.keep === r.b;
  if (!keepA) takeItem(r.a, 1, true);
  if (!keepB) takeItem(r.b, 1, true);
  if (r.text) U.logSay(r.text);
  giveItem(r.make, 1);
  if (r.do) { const w = await import('./world.js'); await w.run(r.do); }
  sfx('solve');
  return true;
}

// Field use of a consumable on a member. Returns true if used.
export function useConsumableOn(memberId, id) {
  const it = R.items[id]; const u = it?.use; if (!u) return false;
  // imported lazily to avoid a cycle at load
  return import('./party.js').then(P => {
    const targets = u.party ? [...S.party] : [memberId];
    let did = false;
    for (const t of targets) {
      const m = S.members[t]; const st = P.stats(t);
      if (u.revive && m.hp <= 0) { m.hp = Math.ceil(st.maxhp * u.revive); did = true; }
      if (m.hp <= 0) continue;
      if (u.heal && m.hp < st.maxhp) { m.hp = Math.min(st.maxhp, m.hp + u.heal); did = true; }
      if (u.mp && m.mp < st.maxmp) { m.mp = Math.min(st.maxmp, m.mp + u.mp); did = true; }
      if (u.cure && m.status && Object.keys(m.status).length) { m.status = {}; did = true; }
    }
    if (!did) { U.toast('It would do nothing now.'); return false; }
    takeItem(id, 1, true);
    sfx('heal');
    U.logSys(`${itemName(id)} used.`);
    P.renderParty();
    return true;
  });
}

// ---------- the Bag ----------
const BAG = { tab: 'all', sort: 'new', sel: null };
const TABS = [['all', 'All'], ['weapon', 'Weapons'], ['armor', 'Armor'], ['trinket', 'Trinkets'], ['consumable', 'Use'], ['key', 'Key items'], ['junk', 'Junk']];

export function openBag(selectId) {
  if (selectId) BAG.sel = selectId;
  U.openModal('Bag', buildBag, () => { S.newItems = {}; import('./world.js').then(w => w.renderDock()); });
}

function inTab(it) {
  if (BAG.tab === 'all') return true;
  if (BAG.tab === 'armor') return ['body', 'head', 'offhand'].includes(it.type);
  return it.type === BAG.tab;
}

function power(id) {
  const it = R.items[id];
  if (it.weapon) return it.weapon.power;
  const s = it.stats || {};
  return (s.def || 0) + (s.res || 0) + (s.str || 0) + (s.agi || 0) + (s.wil || 0) + (s.hp || 0) / 5 + (s.mp || 0) / 3 + (it.use?.heal || 0) / 10;
}

function buildBag(body) {
  const seg = el('div', { class: 'seg' });
  for (const [k, n] of TABS) {
    const count = Object.keys(S.inv).filter(id => S.inv[id] > 0 && R.items[id] && (k === 'all' || (k === 'armor' ? ['body', 'head', 'offhand'].includes(R.items[id].type) : R.items[id].type === k))).length;
    if (k !== 'all' && !count) continue;
    seg.append(el('button', { class: BAG.tab === k ? 'on' : '', 'data-act': 'bagtab:' + k, text: `${n} ${count}`, onclick: () => { BAG.tab = k; BAG.sel = null; U.refreshModal(null, buildBag); } }));
  }
  body.append(seg);
  const sortSeg = el('div', { class: 'seg' }, el('span', { text: 'Sort:', style: { color: 'var(--dim)', fontSize: '13px', alignSelf: 'center', marginRight: '4px' } }));
  for (const [k, n] of [['new', 'Newest'], ['type', 'Type'], ['power', 'Power'], ['value', 'Value'], ['name', 'Name']]) sortSeg.append(el('button', { class: BAG.sort === k ? 'on' : '', 'data-act': 'sort:' + k, text: n, onclick: () => { BAG.sort = k; U.refreshModal(null, buildBag); } }));
  body.append(sortSeg);
  let ids = Object.keys(S.inv).filter(id => S.inv[id] > 0 && R.items[id] && inTab(R.items[id]));
  const cmp = {
    new: (a, b) => (S.order[b] || 0) - (S.order[a] || 0),
    type: (a, b) => TYPE_ORDER[R.items[a].type] - TYPE_ORDER[R.items[b].type] || itemName(a).localeCompare(itemName(b)),
    power: (a, b) => power(b) - power(a),
    value: (a, b) => (R.items[b].price || 0) - (R.items[a].price || 0),
    name: (a, b) => itemName(a).localeCompare(itemName(b)),
  }[BAG.sort];
  ids.sort(cmp);
  if (!ids.length) body.append(el('p', { text: 'Nothing here. A Cimmerian travels light.' }));
  if (BAG.sel && S.inv[BAG.sel] > 0) { const d = detail(BAG.sel); body.append(d); requestAnimationFrame(() => d.scrollIntoView({ block: 'nearest' })); }
  const list = el('div', { class: 'list' });
  for (const id of ids) {
    const it = R.items[id];
    const equippedBy = [];
    list.append(el('button', { class: 'row' + (BAG.sel === id ? ' sel' : '') + (it.type === 'junk' ? ' junk' : ''), 'data-act': 'bag:' + id, onclick: () => { BAG.sel = BAG.sel === id ? null : id; delete S.newItems[id]; U.refreshModal(null, buildBag); } },
      U.iconCanvas(it.icon || 'key', 32),
      el('div', { class: 'main' },
        el('div', { class: 't' }, el('b', { text: it.name }), S.inv[id] > 1 ? el('span', { class: 'n', text: '×' + S.inv[id] }) : null, S.newItems[id] ? el('span', { class: 'new', text: 'NEW' }) : null),
        el('div', { class: 'd', text: statLine(id) || it.desc || '' })),
      it.price && it.type !== 'key' ? el('div', { class: 'side', text: `${Math.floor(it.price / 2)}g` }) : null));
  }
  body.append(list);
}

function detail(id) {
  const it = R.items[id];
  const box = el('div', { class: 'detail' });
  box.append(el('h4', { text: it.name }));
  if (it.desc) box.append(el('div', { class: 'flav', text: it.desc }));
  const sl = statLine(id); if (sl) box.append(el('div', { text: sl }));
  if (it.weapon) box.append(el('div', {}, el('span', { class: 'tag ' + it.weapon.dmg, text: it.weapon.dmg }), it.weapon.el ? el('span', { class: 'tag ' + it.weapon.el, text: it.weapon.el }) : null));
  const acts = el('div', { class: 'actions' });
  const close = () => U.closeModal();
  if (['weapon', 'body', 'head', 'offhand', 'trinket'].includes(it.type)) {
    import('./party.js').then(P => {
      const deltas = el('div', { class: 'deltas' });
      for (const m of S.party) {
        if (!canEquip(m, id, it.type)) continue;
        const a = P.stats(m), b = P.stats(m, { slot: it.type, item: id });
        const d = it.type === 'weapon' ? b.atk - a.atk : (b.def - a.def) + (b.res - a.res);
        const lbl = it.type === 'weapon' ? 'ATK' : 'DEF+RES';
        deltas.append(el('span', { class: d > 0 ? 'up' : d < 0 ? 'down' : 'same' }, U.portraitCanvas(R.members[m].portrait || m, P.memberName(m), 14), `${P.memberName(m)} ${lbl} ${d > 0 ? '+' : ''}${d}`));
        acts.append(U.button(`Equip: ${P.memberName(m)}`, `equip:${m}`, () => { P.equip(m, it.type, id); BAG.sel = S.inv[id] > 0 ? id : null; U.toast(`${P.memberName(m)} equips ${it.name}`); U.refreshModal(null, buildBag); }, ''));
        if (it.type === 'weapon') acts.append(U.button(`Sidearm: ${P.memberName(m)}`, `side:${m}`, () => { P.equip(m, 'side', id); BAG.sel = S.inv[id] > 0 ? id : null; U.toast(`${P.memberName(m)} carries ${it.name} as a sidearm`); U.refreshModal(null, buildBag); }, 'ghost'));
      }
      if (!deltas.childElementCount) deltas.append(el('span', { class: 'same', text: 'No one in the party can use this.' }));
      box.insertBefore(deltas, acts);
    });
  }
  if (it.type === 'consumable' && it.use && !it.use.damage && !it.use.flee) {
    import('./party.js').then(P => {
      for (const m of S.party) acts.append(U.button(`Use on ${P.memberName(m)}`, `use:${m}`, async () => { await useConsumableOn(m, id); if (!(S.inv[id] > 0)) BAG.sel = null; U.refreshModal(null, buildBag); }, ''));
    });
  }
  if (it.type === 'key' || it.type === 'consumable' || it.type === 'junk') {
    acts.append(U.button('Use on something here…', 'use-here:' + id, () => { close(); import('./world.js').then(w => { w.W.selected = null; pickThingFor(id); }); }, 'primary'));
  }
  if (it.type === 'key') {
    const others = Object.keys(S.inv).filter(o => o !== id && S.inv[o] > 0 && R.items[o]?.type === 'key');
    if (others.length) acts.append(U.button('Combine with…', 'combine', () => {
      U.refreshModal(`Combine ${it.name} with…`, body => {
        const list = el('div', { class: 'list' });
        for (const o of others) list.append(el('button', { class: 'row', 'data-act': 'combine:' + id + ':' + o, onclick: async () => { const ok = await combineItems(id, o); BAG.sel = null; if (ok) U.toast('Combined!'); U.refreshModal('Bag', buildBag); } }, U.iconCanvas(R.items[o].icon || 'key', 32), el('div', { class: 'main' }, el('b', { text: R.items[o].name }))));
        body.append(list, el('div', { class: 'actions' }, U.button('Back', 'back', () => U.refreshModal('Bag', buildBag), 'ghost')));
      });
    }));
  }
  box.append(acts);
  return box;
}

// After "Use on something here…": show the room's things in the dock.
async function pickThingFor(id) {
  const w = await import('./world.js');
  const things = [...w.visibleThings(), w.PARTY_THING];
  const opts = things.map(t => ({ label: t === w.PARTY_THING ? 'The party (yourselves)' : t.name, act: 'use:' + id + ':' + t.id }));
  opts.push({ label: 'Cancel', cls: 'ghost', act: 'back' });
  w.W.busy++;
  let i;
  try { i = await U.choose(opts, { prompt: `Use ${itemName(id)} on…` }); } catch (err) { return; } finally { w.W.busy = Math.max(0, w.W.busy - 1); }
  if (i >= things.length) { w.renderDock(); return; }
  await w.useItemOn(id, things[i]);
}
