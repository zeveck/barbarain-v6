// Rooms, things, verbs, the effect runner, dialogue and the typed-command parser.
import { R, S, check, setApi, random, saveTo, meta, setMeta, chapterNum } from './state.js';
import * as U from './ui.js';
import { el } from './util.js';
import { sfx, playMusic, playAmb } from './audio.js';
import { itemName, giveItem, takeItem, openBag, combineItems, itemDef, useConsumableOn } from './items.js';
import { addXp, joinMember, leaveMember, renderParty, healAll, member, memberName, learnSkill, openParty } from './party.js';
import { startBattle } from './battle.js';
import { openShop } from './shop.js';
import { openJournal, openMap, openMenu, autosave, playEnding } from './menus.js';

import { Abort } from './util.js';
export { Abort };

// When the last running script ends, redraw the dock (a goto inside a script can't do it itself).
export function resetWorld() {
  W.busy = 0; W.mode = 'explore'; W.selected = null; W.usingOn = null; W.lastFailedOn = null; W.musicOverride = null;
}

function release() {
  W.busy = Math.max(0, W.busy - 1);
  if (W.busy === 0) setTimeout(() => { if (!W.busy && !W.holdDock && W.mode === 'explore' && !document.getElementById('game').classList.contains('battle')) renderDock(); }, 0);
}
export const W = { busy: 0, tab: 'here', selected: null, mode: 'explore', usingOn: null, lastAmbushRoom: null, justLoaded: false };

const DIRS = { n: ['North', '↑'], s: ['South', '↓'], e: ['East', '→'], w: ['West', '←'], ne: ['Northeast', '↗'], nw: ['Northwest', '↖'], se: ['Southeast', '↘'], sw: ['Southwest', '↙'], u: ['Up', '⤒'], d: ['Down', '⤓'], in: ['Inside', '⇥'], out: ['Outside', '⇤'] };
const DIR_ORDER = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw', 'u', 'd', 'in', 'out'];

export function fmt(text) {
  return String(text ?? '').replace(/\{gold\}/g, S.gold).replace(/\{hero\}/g, 'Brannoc');
}

export function room() { return R.rooms[S.room]; }

export function npcName(id) {
  if (id === 'narrator') return '';
  if (R.members[id]) return memberName(id);
  return R.npcs[id]?.name || id;
}
export function npcPortrait(id) {
  if (R.members[id]) return R.members[id].portrait || id;
  return R.npcs[id]?.portrait ?? id;
}

// ---------- script API ----------
export const g = {
  flag: x => !!S.flags[x], set: x => { S.flags[x] = true; }, clear: x => { delete S.flags[x]; },
  var: x => S.vars[x] || 0, setVar: (x, n) => { S.vars[x] = n; },
  has: x => (S.inv[x] || 0) > 0, check, run: e => run(e), say: t => U.logSay(fmt(t)),
  line: (w, t) => run([{ line: [w, t] }]), room: () => S.room, refresh: () => renderDock(), rng: () => random(),
  state: () => S, ui: U,
};
setApi(g);

// ---------- effect runner ----------
export async function run(effects) {
  if (!effects) return;
  if (typeof effects === 'string') { U.logSay(fmt(effects)); return; }
  if (!Array.isArray(effects)) effects = [effects];
  W.busy++;
  try {
    for (const e of effects) {
      if (!e) continue;
      const r = await runOne(e);
      if (r === 'stop') return 'stop';
    }
  } finally {
    release();
  }
}

async function runOne(e) {
  if (e.if !== undefined && !('then' in e) && !('else' in e)) {
    // `if` used as a guard on a single effect: { if: cond, say: '...' }
    if (!check(e.if)) return;
    const { if: _, ...rest } = e;
    return runOne(rest);
  }
  if (e.once) {
    if (S.done[e.once]) return;
    const r = await run(e.do || []);
    S.done[e.once] = true;
    return r;
  }
  if ('say' in e) { U.logSay(fmt(e.say)); return; }
  if (e.line) {
    const [who, text] = e.line;
    U.logLine(npcName(who), fmt(text), npcPortrait(who), !!R.members[who]);
    return;
  }
  if (e.give) { giveItem(e.give, e.n || 1, e.quiet); return; }
  if (e.take) { takeItem(e.take, e.n || 1, e.quiet); return; }
  if ('gold' in e) {
    S.gold = Math.max(0, S.gold + e.gold);
    if (!e.quiet) U.logSys(e.gold >= 0 ? `+${e.gold} gold` : `${e.gold} gold`, 'gold');
    if (e.gold > 0) sfx('coins');
    updateTop();
    return;
  }
  if (e.set) { for (const f of [].concat(e.set)) S.flags[f] = true; return; }
  if (e.clear) { for (const f of [].concat(e.clear)) delete S.flags[f]; return; }
  if (e.var) { const [k, n] = e.var; S.vars[k] = (S.vars[k] || 0) + n; return; }
  if (e.setvar) { const [k, n] = e.setvar; S.vars[k] = n; return; }
  if (e.xp) {
    if (typeof e.xp === 'object') {
      const n = (e.xp.as || []).reduce((a, id) => a + (R.enemies[id]?.xp || 0), 0) + (e.xp.n || 0);
      U.toast(`Clever! +${n} XP`); sfx('sting-solved');
      await addXp(n, 'clever!');
    } else await addXp(e.xp, e.text);
    return;
  }
  if (e.fight) { return doFight(e.fight); }
  if (e.goto) { await enterRoom(e.goto); return 'stop'; }
  if (e.talk) { return dialogue(e.talk); }
  if (e.join) { await joinMember(e.join, e.level, e.quiet); renderParty(); return; }
  if (e.leave) { leaveMember(e.leave, e.quiet); renderParty(); return; }
  if (e.chapter) { await startChapter(e.chapter); return 'stop'; }
  if (e.quest) { setQuest(e.quest[0], e.quest[1], e.quiet); return; }
  if (e.shop) { await openShop(e.shop); return; }
  if (e.inn !== undefined) { await inn(e.inn, e.text); return; }
  if (e.heal) { healAll(); renderParty(); sfx('heal'); if (!e.quiet) U.logSys('The party is fully restored.'); return; }
  if (e.scene) {
    const sc = e.scene;
    await U.showCard({ img: sc.img, tint: sc.tint, title: sc.title, kicker: sc.kicker, text: fmt(sc.text || ''), buttons: [{ label: 'Continue ▸', act: 'continue', cls: 'primary' }] });
    if (sc.log !== false && sc.text) U.logSay(fmt(sc.text));
    return;
  }
  if (e.pause) { await U.continueBtn(typeof e.pause === 'string' ? e.pause : 'Continue'); return; }
  if ('sfx' in e) { sfx(e.sfx); return; }
  if ('music' in e) { playMusic(e.music); W.musicOverride = e.music; return; }
  if ('amb' in e) { playAmb(e.amb); return; }
  if (e.refresh) { return; }
  if (e.choice) {
    const opts = e.choice.filter(c => check(c.if));
    const i = await U.choose(opts.map((c, k) => ({ label: fmt(c.text), act: 'choice:' + (c.id ?? k) })), { prompt: e.prompt ? fmt(e.prompt) : null });
    if (opts[i].text && !opts[i].quiet) U.logYou(fmt(opts[i].text));
    return run(opts[i].do || []);
  }
  if (e.confirm) {
    const c = e.confirm;
    const i = await U.showCard({ kicker: c.kicker || 'A weighty choice', title: c.title || '', text: fmt(c.text), buttons: [{ label: c.yesLabel || 'Yes', cls: 'primary', act: 'confirm:yes' }, { label: c.noLabel || 'Not yet', act: 'confirm:no' }] });
    return run(i === 0 ? (c.yes || []) : (c.no || []));
  }
  if ('if' in e) { return run(check(e.if) ? (e.then || []) : (e.else || [])); }
  if (e.learn) { learnSkill(e.learn[0], e.learn[1]); return; }
  if (e.toast) { U.toast(fmt(e.toast)); return; }
  if (e.ending) { await playEnding(e.ending); return 'stop'; }
  if (e.call) {
    const fn = R.scripts[e.call];
    if (!fn) { console.error('missing script', e.call); return; }
    return fn(g, e.args || {});
  }
  if (e.autosave) {
    if (e.autosave === true) autosave();
    else {
      const keep = JSON.stringify(S);
      if (e.autosave === 'choice' && W.actionSnap) { Object.assign(S, JSON.parse(W.actionSnap)); saveTo('choice', 'Before the Choice'); Object.assign(S, JSON.parse(keep)); }
      else saveTo(e.autosave, snapshotLabel(e.autosave));
      U.toast(`Saved: ${snapshotLabel(e.autosave)}`);
    }
    return;
  }
  if (e.snapshot) { saveTo(e.snapshot, snapshotLabel(e.snapshot)); return; }
  if (e.shake) { U.shake(); return; }
  if (e.do) { return run(e.do); }
  console.warn('unknown effect', e);
}

function snapshotLabel(id) { return { choice: 'Before the Choice', final: 'Before the Final Choice' }[id] || id; }

async function doFight(f) {
  const before = JSON.stringify(S);
  for (;;) {
    const result = await startBattle(f);
    if (result === 'win') {
      if (f.id) S.won[f.id] = true;
      renderParty();
      return run(f.win || []);
    }
    if (result === 'flee') { renderParty(); return run(f.flee || []); }
    // lost
    if (f.lose) { healAll(0.3); renderParty(); return run(f.lose); }
    const pick = await U.showCard({
      img: f.bg || room()?.bg, tint: 'dim', kicker: 'Defeat', title: 'You fall.',
      text: 'Crom laughs at you from his mountain. But the gods of the Hyborian Age are not done with you yet.',
      buttons: [{ label: 'Retry the battle', act: 'retry', cls: 'primary' }, { label: 'Load autosave', act: 'load-auto' }],
    });
    const saved = JSON.parse(before);
    Object.assign(S, saved);
    if (pick === 0) { healAll(); renderParty(); continue; }
    const { loadSlot } = await import('./menus.js');
    W.gen = (W.gen || 0) + 1;
    setTimeout(() => loadSlot('auto'), 0);   // after this run has unwound
    throw new Abort();
  }
}

// ---------- quests ----------
export function setQuest(id, stage, quiet) {
  const q = R.quests[id];
  const prev = S.quests[id] || 0;
  if (stage === prev) return;
  S.quests[id] = stage;
  if (quiet || !q) return;
  if (q.done && stage >= q.done) { U.toast(`Quest complete: ${q.name}`); U.logSys(`Quest complete: ${q.name}`, 'gold'); sfx('solve'); }
  else if (prev === 0) { U.toast(`New quest: ${q.name}`); U.logSys(`New quest: ${q.name}`, 'gold'); }
  else { U.toast(`Journal updated`); }
}

// ---------- inn ----------
async function inn(cost, text) {
  const i = await U.choose([{ label: cost ? `Rest (${cost} gold)` : 'Rest', cls: 'primary', disabled: S.gold < cost, act: 'inn:yes' }, { label: 'Not now', act: 'inn:no' }], { prompt: fmt(text || `A bed and a hot meal for ${cost} gold.`) });
  if (i !== 0) return;
  S.gold -= cost; updateTop();
  healAll(); renderParty(); sfx('heal');
  U.logSay('You sleep like the dead and wake with your strength restored.');
  autosave();
}

// ---------- chapters ----------
export async function startChapter(id) {
  const ch = R.chapters[id];
  S.chapter = id;
  U.closeModal();
  await U.showCard({ img: ch.card?.img, tint: ch.card?.tint, kicker: `Chapter ${['', 'I', 'II', 'III', 'IV', 'V'][ch.num] || ch.num}`, title: ch.title, text: ch.card?.text || '' });
  U.clearLog();
  updateTop();
  healAll(); renderParty();   // a new chapter starts rested
  S.room = ch.start;
  await run(ch.startDo || []);
  await enterRoom(ch.start);
}

export function updateTop() {
  const ch = R.chapters[S.chapter];
  const t = document.getElementById('chap-name');
  if (t && ch) t.textContent = `${['', 'I', 'II', 'III', 'IV', 'V'][ch.num]} · ${ch.title}`;
  const gd = document.getElementById('gold');
  if (gd) { gd.innerHTML = ''; gd.append(U.iconCanvas('gold', 16), document.createTextNode(String(S.gold))); }
}

// ---------- rooms ----------
function descOf(r) {
  if (typeof r.desc === 'function') return r.desc(g);
  if (Array.isArray(r.desc)) return r.desc.filter(p => check(p.if)).map(p => p.text).join('\n\n');
  return r.desc || '';
}

// Clear the dock so stale buttons can't be clicked while a scripted action runs.
function lockDock() { U.setTabs(null); U.dockClear(); }

export async function enterRoom(id, opts = {}) {
  const r = R.rooms[id];
  if (!r) { console.error('no room', id); return; }
  lockDock();
  U.ui.entering = true;
  W.selected = null; W.tab = 'here'; W.usingOn = null;
  const firstTime = !S.visited[id];
  S.room = id;
  if (R.roomChapter[id] && R.roomChapter[id] !== S.chapter && !opts.keepChapter) S.chapter = R.roomChapter[id];
  if (!opts.noSave) autosave();
  W.entered = W.entered || {}; W.entered[id] = true;
  const [bgId, bgTint] = roomBg(r);
  U.setScene(bgId, bgTint);
  U.showSpeaker(null);
  document.getElementById('room-label').textContent = r.name;
  if ('music' in r) { playMusic(r.music); W.musicOverride = null; }
  else playMusic(W.musicOverride || R.chapters[S.chapter]?.music || null);
  playAmb(r.amb || null);
  if (!opts.silent) sfx('step');
  updateTop();
  U.logHeading(r.name);
  U.logSay(fmt(descOf(r)));
  W.busy++;
  try {
    if (r.enter) { if (await run(r.enter) === 'stop') { S.visited[id] = true; return; } }
    if (firstTime && r.first) { const st = await run(r.first); S.visited[id] = true; if (st === 'stop') return; }
    S.visited[id] = true;
    if (r.ambush && !opts.fromLoad && !firstTime && check(r.ambush.if) && random() < (S.easy ? r.ambush.chance * 0.6 : r.ambush.chance)) {
      const grp = r.ambush.groups[Math.floor(random() * r.ambush.groups.length)];
      if (await doFight({ enemies: grp, intro: r.ambush.text || 'An ambush!' }) === 'stop') return;
    }
  } catch (err) {
    if (err instanceof Abort) return;
    throw err;
  } finally { U.ui.entering = false; release(); }
  renderDock();
}

export function roomBg(r) {
  let b = r.bg;
  if (typeof b === 'function') b = b(g);
  if (Array.isArray(b)) b = (b.find(p => check(p.if)) || b[b.length - 1]).bg;
  const [id, tint] = String(b || '').split('@');
  return [id, tint || r.tint || null];
}

export function visibleThings(r = room()) { return (r.things || []).filter(t => check(t.if)); }

// Point of no return: list open quests of this chapter and carried ones, then Go on / Not yet.
async function noReturn(text) {
  const open = Object.entries(R.quests).filter(([id, q]) => !q.main && (q.chapter === chapterNum() || q.carry) && (S.quests[id] || 0) < (q.done || 1) && (S.quests[id] || q.carry));
  const i = await U.showCard({
    kicker: 'Point of no return', title: 'Are you ready?', text: fmt(text),
    list: open.length ? { head: 'Unfinished', items: open.map(([id, q]) => `${q.name}${q.carry ? ' (it will wait for you)' : ' (you cannot come back for it)'}`) } : null,
    buttons: [{ label: 'Go on', cls: 'primary', act: 'noreturn:go' }, { label: 'Not yet', act: 'noreturn:stay' }],
  });
  return i === 0;
}

function exitsOf(r = room()) {
  const out = [];
  for (const d of DIR_ORDER) {
    let x = r.exits?.[d];
    if (!x) continue;
    if (typeof x === 'string') x = { to: x };
    const ok = check(x.if);
    if (!ok && !x.blocked) continue;
    if (x.hidden && check(x.hidden)) continue;
    out.push({ dir: d, ...x, ok });
  }
  // custom named exits (e.g. "ship": {...})
  for (const [k, v] of Object.entries(r.exits || {})) {
    if (DIR_ORDER.includes(k)) continue;
    const x = typeof v === 'string' ? { to: v } : v;
    const ok = check(x.if);
    if (!ok && !x.blocked) continue;
    out.push({ dir: k, ...x, ok });
  }
  return out;
}

function exitLabel(x) {
  const dest = R.rooms[x.to];
  const known = S.visited[x.to];
  const name = x.label || (known ? dest?.name : '???') || '???';
  const d = DIRS[x.dir];
  return { dir: d ? d[1] : '•', dirName: d ? d[0] : x.dir, name, unvisited: !known && x.ok };
}

export async function go(x) {
  if (W.busy) return;
  if (!x.ok) { U.logSay(fmt(x.blocked)); sfx('refuse'); return; }
  W.actionSnap = JSON.stringify(S);
  if (!x.noReturn) lockDock();
  if (x.noReturn) {
    W.busy++;
    let ok;
    try { ok = await noReturn(x.noReturn); } catch (err) { if (err instanceof Abort) return; throw err; } finally { W.busy = Math.max(0, W.busy - 1); }
    if (!ok) { renderDock(); return; }
  }
  try {
    if (x.do) { if (await run(x.do) === 'stop') return; }
    U.logYou(`Go ${exitLabel(x).dirName.toLowerCase()}`);
    await enterRoom(x.to);
  } catch (err) { if (!(err instanceof Abort)) throw err; }
}

// ---------- thing verbs ----------
function thingKey(t) { return S.room + ':' + t.id; }
function verbsOf(t) {
  const v = ['Look'];
  if (t.kind === 'person' || t.talk) { if (t.talk) v.push('Talk'); }
  if (t.kind !== 'person' && !t.noTake && t.take !== undefined) v.push('Take');
  for (const k of Object.keys(t.verbs || {})) v.push(k);
  if (t.kind !== 'person' && !t.noTake && t.take === undefined && !t.verbs) { /* generic take hidden */ }
  v.push('Use…');
  return v;
}

export async function doVerb(t, verb) {
  if (W.busy) return;
  S.seen[thingKey(t)] = true;
  W.actionSnap = JSON.stringify(S);
  if (verb !== 'Use…') lockDock();
  try {
    if (verb === 'Look') {
      U.logYou(`Look at ${t.name}`);
      if (typeof t.look === 'string' || !t.look) U.logSay(fmt(t.look || `You see nothing special about the ${t.name.toLowerCase()}.`));
      else await run(t.look);
    } else if (verb === 'Talk') {
      U.logYou(`Talk to ${t.name}`);
      if (typeof t.talk === 'string') await dialogue(t.talk); else await run(t.talk);
      W.selected = null;
    } else if (verb === 'Take') {
      U.logYou(`Take ${t.name}`);
      if (typeof t.take === 'string') { U.logSay(fmt(t.take)); sfx('refuse'); }
      else await run(t.take);
    } else if (verb === 'Use…') {
      W.usingOn = t; renderDock(); return;
    } else {
      const v = t.verbs[verb];
      if (v && !Array.isArray(v) && v.noReturn) {
        W.busy++; let ok;
        try { ok = await noReturn(v.noReturn); } catch (err) { if (err instanceof Abort) return; throw err; } finally { W.busy = Math.max(0, W.busy - 1); }
        if (!ok) { renderDock(); return; }
        U.logYou(`${verb} ${t.name}`);
        await run(v.do || []);
      } else {
        U.logYou(`${verb} ${t.name}`);
        await run(v);
      }
    }
  } catch (err) { if (!(err instanceof Abort)) throw err; return; }
  afterAction();
}

export const PARTY_THING = { id: 'party', name: 'the party', kind: 'thing' };
function partyUses() {
  const out = {};
  for (const ch of Object.values(R.chapters)) Object.assign(out, ch.partyUse || {});
  return out;
}

export async function useItemOn(itemId, t) {
  if (W.busy) return;
  W.actionSnap = JSON.stringify(S);
  lockDock();
  if (t === PARTY_THING || t.id === 'party') t = { ...PARTY_THING, use: { ...partyUses(), '*': PARTY_REFUSAL(itemId) } };
  const it = itemDef(itemId);
  W.usingOn = null;
  U.logYou(`Use ${it?.name || itemId} on ${t.name}`);
  const handler = t.use?.[itemId];
  try {
    if (handler) { await run(handler); afterAction(); return; }
    // consumables on a person in the party are handled by the bag
    const fallback = t.use?.['*'];
    if (fallback) { if (typeof fallback === 'string') U.logSay(fmt(fallback)); else await run(fallback); }
    else U.logSay(refusal(it, t));
    sfx('refuse');
  } catch (err) { if (!(err instanceof Abort)) throw err; return; }
  W.lastFailedOn = t;
  afterAction(true);
}

const PARTY_REFUSAL = id => {
  const it = itemDef(id);
  if (it?.type === 'consumable') return [{ call: '__useConsumable', args: { id } }];
  return 'You pass the ' + (it?.name || 'thing').toLowerCase() + ' around. Everyone looks at it. Nobody knows why.';
};
const REFUSALS = [
  'You try. The {thing} is unimpressed with your {item}.',
  'Brannoc considers the {item}, then the {thing}, then the {item} again. "No."',
  'That would accomplish nothing but making you look foolish, and the gods are watching.',
  '"Crom," you mutter. The {item} and the {thing} have nothing to say to each other.',
  'Shevra would laugh at you for trying that. Fortunately she missed it.',
];
function refusal(it, t) {
  const s = REFUSALS[Math.floor(random() * REFUSALS.length)];
  return s.replace(/\{thing\}/g, t.name.toLowerCase()).replace(/\{item\}/g, (it?.name || 'thing').toLowerCase());
}

function afterAction(failedUse) {
  renderParty(); updateTop();
  if (failedUse && W.lastFailedOn && (visibleThings().includes(W.lastFailedOn) || W.lastFailedOn.id === 'party')) {
    const t = W.lastFailedOn; W.lastFailedOn = null;
    U.setTabs(null); U.dockClear();
    W.holdDock = true;
    U.dockAdd(U.button('Try another item', 'use-again', () => { W.holdDock = false; W.usingOn = t.id === 'party' ? PARTY_THING : t; renderDock(); }, 'primary'));
    U.dockAdd(U.button(`${U.icon('back')}<span>Back</span>`, 'back', () => { W.holdDock = false; renderDock(); }, 'ghost'));
    return;
  }
  // keep the thing selected if it's still here
  if (W.selected && !visibleThings().includes(W.selected)) W.selected = null;
  renderDock();
}

// ---------- dialogue ----------
export async function dialogue(id) {
  const d = R.dialogues[id];
  if (!d) { console.error('no dialogue', id); return; }
  let nodeId = d.start || Object.keys(d.nodes)[0];
  W.busy++;
  try {
    while (nodeId) {
      const n = d.nodes[nodeId];
      if (!n) { console.error('no node', id, nodeId); break; }
      if (n.if !== undefined && !check(n.if)) { nodeId = n.else || null; continue; }
      const who = n.who || 'narrator';
      if (who === 'narrator') { U.showSpeaker(null); U.logSay(fmt(n.text)); }
      else {
        U.showSpeaker(npcPortrait(who), npcName(who));
        if (n.text) U.logLine(npcName(who), fmt(n.text), npcPortrait(who), !!R.members[who]);
      }
      if (n.do) { if (await run(n.do) === 'stop') return 'stop'; }
      if (n.choices) {
        const opts = n.choices.filter(c => check(c.if) && !(c.once && S.onceChoices[id + ':' + nodeId + ':' + c.text]));
        if (!opts.length) break;
        const i = await U.choose(opts.map((c, k) => ({ label: fmt(c.text), cls: c.end ? 'ghost' : '', act: 'dlg:' + (c.id ?? k) })));
        const c = opts[i];
        if (c.once) S.onceChoices[id + ':' + nodeId + ':' + c.text] = true;
        if (!c.end && !c.silent) U.logYou(fmt(c.text));
        if (c.do) { if (await run(c.do) === 'stop') return 'stop'; }
        if (c.end) break;
        nodeId = c.to || null;
      } else {
        const next = n.next || n.goto || null;
        if (next || !n.noWait) await U.continueBtn(next ? 'Continue' : 'Done');
        nodeId = next;
      }
    }
  } finally {
    release();
    U.showSpeaker(null);
  }
}

// ---------- the dock ----------
const TABS_PHONE = [
  { id: 'here', label: 'Here', icon: 'here' },
  { id: 'go', label: 'Go', icon: 'go' },
  { id: 'bag', label: 'Bag', icon: 'bag' },
  { id: 'party', label: 'Party', icon: 'party' },
  { id: 'more', label: 'More', icon: 'more' },
];

export function renderDock() {
  if (W.busy || W.mode !== 'explore') return;
  W.holdDock = false;
  const r = room();
  if (!r) return;
  U.dockClear();
  const wide = U.ui.mode === 'wide' || U.ui.mode === 'land';
  const things = visibleThings(r);
  const exits = exitsOf(r);
  const newHere = things.some(t => !S.seen[thingKey(t)] || (t.hot && check(t.hot)));
  const newGo = exits.some(x => !S.visited[x.to] && x.ok);

  if (W.usingOn) return renderUsePicker(W.usingOn);
  if (W.selected) return renderVerbs(W.selected);

  const tabs = TABS_PHONE.map(t => ({ ...t, badge: (t.id === 'here' && newHere && W.tab !== 'here') || (t.id === 'go' && newGo && W.tab !== 'go') || (t.id === 'bag' && Object.keys(S.newItems).length > 0) }));
  if (wide) {
    U.setTabs(null);
    renderHere(things, r);
    renderGo(exits, r);
    U.dockLabel('');
    tools();
  } else {
    U.setTabs(tabs, W.tab, id => {
      if (id === 'bag') return openBag();
      if (id === 'party') return openParty();
      if (id === 'more') return openMenu();
      W.tab = id; renderDock();
    });
    if (W.tab === 'go') renderGo(exits, r); else renderHere(things, r);
  }
}

function tools() {
  const add = (lbl, ic, act, fn, dot) => U.dockAdd(U.button(`${U.icon(ic)}<span>${lbl}</span>`, act, fn, 'third' + (dot ? ' dot' : '')));
  add('Bag', 'bag', 'tab:bag', () => openBag(), Object.keys(S.newItems).length > 0);
  add('Party', 'party', 'tab:party', () => openParty());
  add('Journal', 'journal', 'menu:journal', () => openJournal());
  add('Map', 'map', 'menu:map', () => openMap());
  add('Save', 'save', 'menu:save', () => import('./menus.js').then(m => m.openSaves('save')));
  add('Menu', 'menu', 'tab:more', () => openMenu());
}

const SMALL = new Set(['a', 'an', 'the', 'of', 'and', 'or', 'in', 'on', 'at', 'to', 'by', 'for', 'with']);
export function chipName(n) {
  return String(n).split(' ').map((w, i) => (i > 0 && SMALL.has(w.toLowerCase())) ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function renderHere(things, r) {
  U.dockLabel('Here');
  U.dockAdd(U.button(`${U.icon('look')}<span>Look around</span>`, 'look', () => lookAround(), 'chip'));
  for (const t of things) {
    const dot = !S.seen[thingKey(t)] || (t.hot && check(t.hot));
    U.dockAdd(U.button(`<span>${chipName(t.name)}</span>`, 'thing:' + t.id, () => { W.selected = t; S.seen[thingKey(t)] = true; renderDock(); }, 'chip' + (t.kind === 'person' ? ' person' : '') + (dot ? ' dot' : '')));
  }
  if (r.hunt) U.dockAdd(U.button(`${U.icon('hunt')}<span>Hunt for foes</span>`, 'hunt', () => hunt(), 'chip'));
}

function renderGo(exits) {
  U.dockLabel('Go');
  if (!exits.length) U.dockPrompt('No way out but forward.');
  for (const x of exits) {
    const l = exitLabel(x);
    U.dockAdd(U.button(`<span class="dir">${l.dir}</span><span>${l.name}</span>`, 'go:' + x.dir, () => go(x), 'exit' + (x.ok ? '' : ' blocked') + (l.unvisited ? ' dot' : ''), { title: l.dirName }));
  }
}

function renderVerbs(t) {
  U.setTabs(null);
  U.dockPrompt(chipName(t.name));
  for (const v of verbsOf(t)) {
    U.dockAdd(U.button(v, 'verb:' + t.id + ':' + v.replace('…', ''), () => doVerb(t, v), v === 'Talk' ? 'primary' : ''));
  }
  U.dockAdd(U.button(`${U.icon('back')}<span>Back</span>`, 'back', () => { W.selected = null; renderDock(); }, 'ghost'));
}

function renderUsePicker(t) {
  U.setTabs(null);
  U.dockPrompt(`Use what on ${t.name}?`);
  const ids = Object.keys(S.inv).filter(id => S.inv[id] > 0 && itemDef(id) && ['key', 'consumable', 'junk'].includes(itemDef(id).type));
  ids.sort((a, b) => {
    const ka = itemDef(a).type === 'key' ? 0 : 1, kb = itemDef(b).type === 'key' ? 0 : 1;
    return ka - kb || (S.order[b] || 0) - (S.order[a] || 0);
  });
  if (!ids.length) U.dockPrompt('Your bag holds nothing useful.');
  for (const id of ids) {
    const b = U.button('', 'use:' + id + ':' + t.id, () => useItemOn(id, t), 'chip');
    b.append(U.iconCanvas(itemDef(id).icon || 'key', 24), el('span', { text: itemName(id) + (S.inv[id] > 1 ? ` ×${S.inv[id]}` : '') }));
    U.dockAdd(b);
  }
  U.dockAdd(U.button(`${U.icon('back')}<span>Back</span>`, 'back', () => { W.usingOn = null; renderDock(); }, 'ghost full'));
}

export function lookAround() {
  if (W.busy) return;
  const r = room();
  U.logYou('Look around');
  U.logSay(fmt(descOf(r)));
  const things = visibleThings(r);
  if (things.length) U.logSay('You notice: ' + things.map(t => t.name).join(', ') + '.');
}

async function hunt() {
  if (W.busy) return;
  const r = room();
  const grp = r.hunt[Math.floor(random() * r.hunt.length)];
  U.logYou('Hunt for foes');
  W.busy++; lockDock();
  try { await doFight({ enemies: grp, intro: 'You go looking for trouble, and find it.' }); }
  catch (err) { if (!(err instanceof Abort)) throw err; return; }
  finally { release(); }
}

// ---------- typed commands ----------
const ALIASES = { n: 'n', north: 'n', s: 's', south: 's', e: 'e', east: 'e', w: 'w', west: 'w', ne: 'ne', northeast: 'ne', nw: 'nw', northwest: 'nw', se: 'se', southeast: 'se', sw: 'sw', southwest: 'sw', u: 'u', up: 'u', d: 'd', down: 'd', in: 'in', inside: 'in', enter: 'in', out: 'out', outside: 'out', leave: 'out' };
function findThing(word) {
  word = word.replace(/^(the|a|an|at|to|with)\s+/g, '').trim();
  if (!word) return null;
  const ts = visibleThings();
  return ts.find(t => t.name.toLowerCase() === word) || ts.find(t => t.name.toLowerCase().includes(word)) || ts.find(t => t.id.includes(word.replace(/\s+/g, '-')));
}
function findItem(word) {
  word = word.replace(/^(the|a|an)\s+/, '').trim();
  const ids = Object.keys(S.inv).filter(id => S.inv[id] > 0);
  return ids.find(id => itemName(id).toLowerCase() === word) || ids.find(id => itemName(id).toLowerCase().includes(word)) || ids.find(id => id.includes(word.replace(/\s+/g, '-')));
}

export async function command(text) {
  if (W.busy || W.mode !== 'explore' || document.getElementById('game').classList.contains('battle')) return;
  const s = text.toLowerCase().trim().replace(/[.!?]+$/, '');
  if (!s) return;
  let m;
  const dir = ALIASES[s] || ((m = s.match(/^(?:go|walk|run|head)\s+(?:to\s+)?(\w+)$/)) && ALIASES[m[1]]);
  if (dir) {
    const x = exitsOf().find(e => e.dir === dir);
    if (!x) { U.logYou(text); U.logSay('You cannot go that way.'); return; }
    return go(x);
  }
  if (/^(l|look|look around)$/.test(s)) return lookAround();
  if (/^(i|inv|inventory|bag)$/.test(s)) return openBag();
  if (/^(j|journal|quests?)$/.test(s)) return openJournal();
  if (/^(map)$/.test(s)) return openMap();
  if (/^(hint|help)$/.test(s)) return openJournal();
  if ((m = s.match(/^(?:go|walk)\s+(?:to\s+)?(.+)$/))) {
    const x = exitsOf().find(e => (R.rooms[e.to]?.name || '').toLowerCase().includes(m[1]) && S.visited[e.to]);
    if (x) return go(x);
  }
  if ((m = s.match(/^(?:use|give|put|throw|show|feed)\s+(.+?)\s+(?:on|to|at|in|into|with)\s+(.+)$/))) {
    const it = findItem(m[1]); const t = findThing(m[2]);
    if (!it) { U.logYou(text); U.logSay(`You have no "${m[1]}".`); return; }
    if (!t) { U.logYou(text); U.logSay(`There is no "${m[2]}" here.`); return; }
    return useItemOn(it, t);
  }
  if ((m = s.match(/^(?:combine|tie|attach|mix)\s+(.+?)\s+(?:with|to|and|onto)\s+(.+)$/))) {
    const a = findItem(m[1]), b = findItem(m[2]);
    U.logYou(text);
    if (!a || !b) { U.logSay('You need to have both of those.'); return; }
    await combineItems(a, b); renderDock(); return;
  }
  if ((m = s.match(/^(?:look at|look|examine|x|inspect|read)\s+(.+)$/))) {
    const t = findThing(m[1]);
    if (t) return doVerb(t, 'Look');
    const it = findItem(m[1]);
    if (it) { U.logYou(text); U.logSay(itemDef(it).desc || itemName(it)); return; }
  }
  if ((m = s.match(/^(?:talk to|talk with|talk|speak to|speak with|ask)\s+(.+)$/))) {
    const t = findThing(m[1]);
    if (t && t.talk) return doVerb(t, 'Talk');
  }
  if ((m = s.match(/^(?:take|get|grab|pick up|steal)\s+(.+)$/))) {
    const t = findThing(m[1]);
    if (t) return doVerb(t, 'Take');
  }
  if ((m = s.match(/^(\w+)\s+(.+)$/))) {
    const t = findThing(m[2]);
    const verb = t && Object.keys(t.verbs || {}).find(v => v.toLowerCase() === m[1]);
    if (verb) return doVerb(t, verb);
    if (t && m[1] === 'use') { W.usingOn = t; renderDock(); return; }
  }
  U.logYou(text);
  U.logSay('Brannoc frowns. "Speak plainly." (Try: look, n/s/e/w, take X, talk to X, use X on Y.)');
}

export function exitsForKeys() { return exitsOf(); }

R.scripts.__useConsumable = async (g2, { id }) => {
  const { openBag } = await import('./items.js');
  openBag(id);
};
