// Game state, registries, conditions and saving.
import { makeRng } from './util.js';

export const SAVE_PREFIX = 'barbarain.v1.';
export const SAVE_VERSION = 1;

// Global registries, filled from data/ and content/ at boot.
export const R = {
  rooms: {}, npcs: {}, dialogues: {}, items: {}, enemies: {}, shops: {}, quests: {},
  hints: [], combine: [], scripts: {}, chapters: {}, chapterOrder: [], members: {}, skills: {},
  roomChapter: {},
};

export function register(mod, chapterId) {
  for (const key of ['rooms', 'npcs', 'dialogues', 'items', 'enemies', 'shops', 'quests', 'scripts']) {
    for (const [id, v] of Object.entries(mod[key] || {})) {
      if (R[key][id] && chapterId) console.warn(`duplicate ${key} id: ${id} (${chapterId})`);
      R[key][id] = v;
      if (key === 'rooms' && chapterId) { R.roomChapter[id] = chapterId; v.id = id; }
    }
  }
  for (const h of mod.hints || []) R.hints.push({ ...h, chapter: chapterId });
  for (const c of mod.combine || []) R.combine.push(c);
  if (chapterId) { R.chapters[chapterId] = mod; R.chapterOrder.push(chapterId); }
}

export function newState(seed = (Date.now() ^ 0x5eed) >>> 0) {
  return {
    version: SAVE_VERSION,
    chapter: 'ch1', room: null, flags: {}, vars: {}, gold: 0,
    party: ['brannoc'], members: {}, inv: {}, newItems: {}, order: {}, orderSeq: 0,
    visited: {}, seen: {}, won: {}, quests: {}, done: {}, onceChoices: {},
    playTime: 0, seed, rngState: seed, easy: false, savedAt: 0, label: '',
  };
}

export let S = newState();
export function setState(s) { S = s; rng.set(s.rngState || s.seed || 1); }

const rng = makeRng(1);
export function random() { const v = rng(); S.rngState = rng.get(); return v; }
export function rint(a, b) { return a + Math.floor(random() * (b - a + 1)); }

// ---------- conditions ----------
const cache = new Map();
export function check(cond) {
  if (cond == null || cond === '' || cond === true) return true;
  if (cond === false) return false;
  if (typeof cond === 'function') { try { return !!cond(api()); } catch (e) { console.error(e); return false; } }
  let fn = cache.get(cond);
  if (!fn) { fn = compile(cond); cache.set(cond, fn); }
  return fn();
}

function cmp(a, op, b) {
  switch (op) {
    case '>=': return a >= b; case '<=': return a <= b; case '>': return a > b;
    case '<': return a < b; case '==': case '=': return a == b; case '!=': return a != b;
  }
  return false;
}

function compile(str) {
  const groups = str.split('|').map(g => g.split('&').map(a => a.trim()).filter(Boolean).map(atom));
  return () => groups.some(g => g.every(f => f()));
}

function atom(a) {
  let neg = false;
  if (a.startsWith('!')) { neg = true; a = a.slice(1).trim(); }
  const f = atomFn(a);
  return neg ? () => !f() : f;
}

function atomFn(a) {
  if (a === 'true') return () => true;
  if (a === 'false') return () => false;
  if (a === 'easy') return () => !!S.easy;
  let m;
  if ((m = a.match(/^(gold|level|chapter)\s*(>=|<=|==|!=|>|<|=)\s*(-?\d+)$/))) {
    const [, k, op, n] = m; const v = +n;
    return () => cmp(k === 'gold' ? S.gold : k === 'level' ? (S.members.brannoc?.level || 1) : chapterNum(), op, v);
  }
  if ((m = a.match(/^(item|quest|var):([\w.\-]+)\s*(>=|<=|==|!=|>|<|=)\s*(-?\d+)$/))) {
    const [, k, id, op, n] = m; const v = +n;
    return () => cmp(k === 'item' ? (S.inv[id] || 0) : k === 'quest' ? (S.quests[id] || 0) : (S.vars[id] || 0), op, v);
  }
  if ((m = a.match(/^(flag|item|party|visited|won|quest|var|done|once):([\w.\-:]+)$/))) {
    const [, k, id] = m;
    switch (k) {
      case 'flag': return () => !!S.flags[id];
      case 'item': return () => (S.inv[id] || 0) > 0;
      case 'party': return () => S.party.includes(id);
      case 'visited': return () => !!S.visited[id];
      case 'won': return () => !!S.won[id];
      case 'quest': return () => (S.quests[id] || 0) > 0;
      case 'var': return () => (S.vars[id] || 0) > 0;
      case 'done': case 'once': return () => !!S.done[id];
    }
  }
  console.warn('bad condition atom:', a);
  return () => false;
}

export function chapterNum() { return R.chapters[S.chapter]?.num || 1; }

// A tiny API handed to content scripts and function conditions; filled in by world.js.
let apiObj = {};
export function api() { return apiObj; }
export function setApi(o) { apiObj = o; }

// ---------- saving ----------
export function slotKey(slot) { return SAVE_PREFIX + 'slot.' + slot; }

export function saveTo(slot, label) {
  try {
    S.savedAt = Date.now();
    S.label = label || S.label;
    localStorage.setItem(slotKey(slot), JSON.stringify(S));
    return true;
  } catch (e) { console.warn('save failed', e); return false; }
}

export function readSlot(slot) {
  try {
    const raw = localStorage.getItem(slotKey(slot));
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s || s.version !== SAVE_VERSION || !s.room || (Object.keys(R.rooms).length > 20 && !R.rooms[s.room])) return { broken: true };
    if (!Array.isArray(s.party) || !s.members || typeof s.inv !== 'object' || !s.party.length) return { broken: true };
    for (const id of s.party) if (!s.members[id] || (Object.keys(R.members).length && !R.members[id])) return { broken: true };
    return s;
  } catch (e) { return { broken: true }; }
}

export function deleteSlot(slot) { try { localStorage.removeItem(slotKey(slot)); } catch (e) {} }

// Data that lives across playthroughs: endings found, settings.
export function meta() {
  try { return JSON.parse(localStorage.getItem(SAVE_PREFIX + 'meta')) || {}; } catch (e) { return {}; }
}
export function setMeta(patch) {
  const m = { ...meta(), ...patch };
  try { localStorage.setItem(SAVE_PREFIX + 'meta', JSON.stringify(m)); } catch (e) {}
  return m;
}
