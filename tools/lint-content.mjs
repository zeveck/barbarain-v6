#!/usr/bin/env node
// Content lint for BarbarAIn. Usage: node tools/lint-content.mjs [ch1 ch2 ...]
// Checks ids, reachability, conditions, flags, items and assets across all content.
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(ROOT, 'game', 'src');
const imp = p => import(pathToFileURL(path.join(SRC, p)).href);

const only = process.argv.slice(2);
const manifest = await imp('content/manifest.js');
const party = await imp('data/party-data.js');
const items0 = (await imp('data/core-items.js')).default.items;
const enemies0 = (await imp('data/core-enemies.js')).default.enemies;
const { ROOM, NPCS, ASSETS, ITEMS, QUESTS } = manifest;

const chapters = {};
for (const id of ['ch1', 'ch2', 'ch3', 'ch4', 'ch5']) {
  const f = path.join(SRC, 'content', id + '.js');
  if (!fs.existsSync(f)) continue;
  try { chapters[id] = (await imp(`content/${id}.js`)).default; }
  catch (e) { console.log(`ERROR ${id}: cannot import: ${e.message}`); process.exitCode = 1; }
}

const R = { rooms: {}, items: { ...items0, ...ITEMS }, enemies: { ...enemies0 }, npcs: { ...NPCS }, dialogues: {}, shops: {}, quests: { ...QUESTS }, scripts: {}, combine: [], roomCh: {} };
const owner = {};
for (const [cid, ch] of Object.entries(chapters)) {
  for (const k of ['rooms', 'items', 'enemies', 'npcs', 'dialogues', 'shops', 'quests', 'scripts']) {
    for (const [id, v] of Object.entries(ch[k] || {})) {
      if (R[k][id] && !(k === 'npcs' && NPCS[id])) err(cid, `duplicate ${k} id "${id}" (also in ${owner[k + id] || 'core/manifest'})`);
      R[k][id] = v; owner[k + id] = cid;
      if (k === 'rooms') R.roomCh[id] = cid;
    }
  }
  for (const c of ch.combine || []) R.combine.push({ ...c, ch: cid });
}

let errors = 0, warnings = 0;
function err(where, msg) { errors++; console.log(`ERROR ${where}: ${msg}`); }
function warn(where, msg) { warnings++; console.log(`warn  ${where}: ${msg}`); }

const members = Object.keys(party.members);
const skills = party.skills;
const bgOk = id => {
  if (!id) return false;
  const [b, t] = String(id).split('@');
  return (ASSETS.bg.includes(b) || b === 'starheart') && (!t || ASSETS.tints.includes(t));
};
const spriteOk = id => ASSETS.sprites.includes(String(id).split('@')[0]);
const iconOk = id => ASSETS.icons.includes(String(id).split('@')[0]);

// ---------- collect: flags set, fights, once ids, gives, takes ----------
const flagsSet = new Set(['dummy']), flagsRead = [], fights = new Set(), onceIds = new Set();
const gives = {}, takes = {}, shopsSell = new Set();
const condRefs = [];   // [where, cond]
for (const s of Object.values(R.shops)) for (const i of s.items || []) shopsSell.add(i);

function walk(effects, where, cb) {
  if (!effects) return;
  if (typeof effects === 'string') return;
  if (!Array.isArray(effects)) effects = [effects];
  let afterStop = false;
  for (const e of effects) {
    if (!e || typeof e !== 'object') continue;
    if (afterStop) warn(where, `effect after goto/chapter is ignored: ${JSON.stringify(e).slice(0, 60)}`);
    cb(e, where);
    if (e.if !== undefined) condRefs.push([where, e.if]);
    for (const k of ['then', 'else', 'do', 'yes', 'no', 'win', 'lose', 'flee']) if (e[k]) walk(e[k], where, cb);
    if (e.confirm) { walk(e.confirm.yes, where, cb); walk(e.confirm.no, where, cb); }
    if (e.choice) for (const c of e.choice) { if (c.if) condRefs.push([where, c.if]); walk(c.do, where, cb); }
    if (e.fight) {
      walk(e.fight.win, where, cb); walk(e.fight.lose, where, cb); walk(e.fight.flee, where, cb);
      for (const t of e.fight.triggers || []) { if (t.if) condRefs.push([where, t.if]); walk(t.do, where, cb); }
    }
    if (e.goto || e.chapter || e.ending) afterStop = true;
  }
}

function forEachEffectList(cb) {
  for (const [cid, ch] of Object.entries(chapters)) {
    cb(ch.startDo, `${cid}.startDo`);
    for (const [k, v] of Object.entries(ch.partyUse || {})) cb(v, `${cid}.partyUse.${k}`);
    for (const c of ch.combine || []) cb(c.do, `${cid}.combine`);
  }
  for (const [rid, r] of Object.entries(R.rooms)) {
    cb(r.enter, `${rid}.enter`); cb(r.first, `${rid}.first`);
    for (const [d, x] of Object.entries(r.exits || {})) if (typeof x === 'object') cb(x.do, `${rid}.exit.${d}`);
    for (const t of r.things || []) {
      const w = `${rid}/${t.id}`;
      for (const k of ['look', 'talk', 'take']) if (Array.isArray(t[k])) cb(t[k], `${w}.${k}`);
      for (const [v, e] of Object.entries(t.verbs || {})) cb(Array.isArray(e) ? e : e?.do, `${w}.verb.${v}`);
      for (const [i, e] of Object.entries(t.use || {})) if (typeof e !== 'string') cb(e, `${w}.use.${i}`);
    }
  }
  for (const [did, d] of Object.entries(R.dialogues)) for (const [nid, n] of Object.entries(d.nodes || {})) {
    cb(n.do, `dlg ${did}.${nid}`);
    for (const c of n.choices || []) cb(c.do, `dlg ${did}.${nid}.choice`);
  }
}

forEachEffectList((list, where) => walk(list, where, (e) => {
  if (e.set) for (const f of [].concat(e.set)) flagsSet.add(f);
  if (e.fight?.id) fights.add(e.fight.id);
  if (e.once) onceIds.add(e.once);
  if (e.give) (gives[e.give] ||= []).push(where);
  if (e.take) (takes[e.take] ||= []).push(where);
}));
for (const c of R.combine) (gives[c.make] ||= []).push('combine');
for (const [eid, e] of Object.entries(R.enemies)) for (const d of e.drops || []) if ((d.chance ?? 1) >= 1) (gives[d.id] ||= []).push('drop:' + eid);
for (const s of Object.values(manifest.CHAPTER_STARTS || {})) for (const f of s.flags || []) flagsSet.add(f);

// ---------- check every effect ----------
const sfxIds = new Set(ASSETS.sfx), musicIds = new Set(ASSETS.music), ambIds = new Set(ASSETS.amb);
forEachEffectList((list, where) => walk(list, where, (e, w) => {
  if (e.give && !R.items[e.give]) err(w, `give: unknown item "${e.give}"`);
  if (e.take && !R.items[e.take]) err(w, `take: unknown item "${e.take}"`);
  if (e.goto && !R.rooms[e.goto]) err(w, `goto: unknown room "${e.goto}"`);
  if (e.talk && !R.dialogues[e.talk]) err(w, `talk: unknown dialogue "${e.talk}"`);
  if (e.join && !members.includes(e.join)) err(w, `join: unknown member "${e.join}"`);
  if (e.leave && !members.includes(e.leave)) err(w, `leave: unknown member "${e.leave}"`);
  if (e.shop && !R.shops[e.shop]) err(w, `shop: unknown shop "${e.shop}"`);
  if (e.quest && !R.quests[e.quest[0]]) err(w, `quest: unknown quest "${e.quest[0]}"`);
  if (e.chapter && !['ch1', 'ch2', 'ch3', 'ch4', 'ch5'].includes(e.chapter)) err(w, `chapter: bad id ${e.chapter}`);
  if (e.call && !R.scripts[e.call]) err(w, `call: unknown script "${e.call}"`);
  if (e.learn && (!members.includes(e.learn[0]) || !skills[e.learn[1]])) err(w, `learn: bad ${JSON.stringify(e.learn)}`);
  if (e.sfx && !sfxIds.has(e.sfx)) err(w, `sfx: unknown id "${e.sfx}"`);
  if ('music' in e && e.music !== null && !musicIds.has(e.music)) err(w, `music: unknown id "${e.music}"`);
  if ('amb' in e && e.amb !== null && !ambIds.has(e.amb)) err(w, `amb: unknown id "${e.amb}"`);
  if (e.scene && e.scene.img && !bgOk(e.scene.img)) err(w, `scene: unknown picture "${e.scene.img}"`);
  if (e.line) { const who = e.line[0]; if (!members.includes(who) && !R.npcs[who]) err(w, `line: unknown speaker "${who}"`); }
  if (e.ending && !['A', 'B', 'C'].includes(e.ending)) err(w, `ending: bad id ${e.ending}`);
  if (e.xp && typeof e.xp === 'object') for (const id of e.xp.as || []) if (!R.enemies[id]) err(w, `xp.as: unknown enemy "${id}"`);
  if (e.autosave && e.autosave !== true && !['choice', 'final'].includes(e.autosave)) err(w, `autosave: bad slot ${e.autosave}`);
  if (e.fight) {
    const f = e.fight;
    for (const id of f.enemies || []) if (!R.enemies[id]) err(w, `fight: unknown enemy "${id}"`);
    if (f.bg && !bgOk(f.bg)) err(w, `fight: unknown bg "${f.bg}"`);
    if (f.music && !musicIds.has(f.music)) err(w, `fight: unknown music "${f.music}"`);
    const boss = f.boss || (f.enemies || []).some(id => R.enemies[id]?.boss);
    if ((boss || f.id) && !f.noFlee && !boss && !f.arena) warn(w, `story fight "${f.id}" should be noFlee`);
    for (const t of f.triggers || []) for (const x of t.do || []) {
      if (x.summon) for (const id of [].concat(x.summon)) if (!R.enemies[id]) err(w, `trigger summon: unknown enemy "${id}"`);
    }
  }
}));

// ---------- conditions ----------
function checkCond(where, cond) {
  if (typeof cond !== 'string') return;
  for (const g of cond.split('|')) for (let a of g.split('&')) {
    a = a.trim(); if (!a) continue;
    if (a.startsWith('!')) a = a.slice(1).trim();
    let m;
    if (['true', 'false', 'easy'].includes(a)) continue;
    if (/^(gold|level|chapter)\s*(>=|<=|==|!=|>|<|=)\s*-?\d+$/.test(a)) continue;
    if ((m = a.match(/^(item|quest|var):([\w.\-]+)(\s*(>=|<=|==|!=|>|<|=)\s*-?\d+)?$/))) {
      if (m[1] === 'item' && !R.items[m[2]]) err(where, `condition: unknown item "${m[2]}"`);
      if (m[1] === 'quest' && !R.quests[m[2]]) err(where, `condition: unknown quest "${m[2]}"`);
      continue;
    }
    if ((m = a.match(/^(flag|party|visited|won|once|done):([\w.\-:]+)$/))) {
      const id = m[2];
      if (m[1] === 'flag') { flagsRead.push([where, id]); if (!flagsSet.has(id) && !id.startsWith('studied:') && !id.startsWith('ending:')) err(where, `condition: flag "${id}" is never set`); }
      if (m[1] === 'party' && !members.includes(id)) err(where, `condition: unknown member "${id}"`);
      if (m[1] === 'visited' && !R.rooms[id]) err(where, `condition: unknown room "${id}"`);
      if (m[1] === 'won' && !fights.has(id)) err(where, `condition: fight id "${id}" never fought`);
      if ((m[1] === 'once' || m[1] === 'done') && !onceIds.has(id)) err(where, `condition: once id "${id}" never used`);
      continue;
    }
    err(where, `condition: bad atom "${a}"`);
  }
}
for (const [rid, r] of Object.entries(R.rooms)) {
  for (const p of Array.isArray(r.desc) ? r.desc : []) if (p.if) condRefs.push([rid + '.desc', p.if]);
  if (Array.isArray(r.bg)) for (const p of r.bg) if (p.if) condRefs.push([rid + '.bg', p.if]);
  for (const [d, x] of Object.entries(r.exits || {})) if (typeof x === 'object') { if (x.if) condRefs.push([`${rid}.exit.${d}`, x.if]); if (x.hidden) condRefs.push([`${rid}.exit.${d}`, x.hidden]); }
  for (const t of r.things || []) { if (t.if) condRefs.push([`${rid}/${t.id}`, t.if]); if (t.hot) condRefs.push([`${rid}/${t.id}.hot`, t.hot]); }
  if (r.ambush?.if) condRefs.push([rid + '.ambush', r.ambush.if]);
}
for (const [did, d] of Object.entries(R.dialogues)) for (const [nid, n] of Object.entries(d.nodes || {})) {
  if (n.if) condRefs.push([`dlg ${did}.${nid}`, n.if]);
  for (const c of n.choices || []) if (c.if) condRefs.push([`dlg ${did}.${nid}`, c.if]);
}
for (const [cid, ch] of Object.entries(chapters)) for (const h of ch.hints || []) condRefs.push([`${cid}.hint`, h.if]);
for (const c of R.combine) if (c.if) condRefs.push(['combine', c.if]);
for (const [w, c] of condRefs) checkCond(w, c);

// ---------- rooms, things, dialogues ----------
for (const [rid, r] of Object.entries(R.rooms)) {
  const cid = R.roomCh[rid];
  if (!ROOM[rid]) warn(rid, 'room is not in the Manifest room table');
  const bgs = typeof r.bg === 'string' ? [r.bg] : Array.isArray(r.bg) ? r.bg.map(p => p.bg) : [];
  for (const b of bgs) if (!bgOk(b)) err(rid, `unknown picture "${b}"`);
  if ('music' in r && r.music !== null && !musicIds.has(r.music)) err(rid, `unknown music "${r.music}"`);
  if (r.amb && !ambIds.has(r.amb)) err(rid, `unknown ambience "${r.amb}"`);
  if (!r.name) err(rid, 'room has no name');
  if (!r.desc) err(rid, 'room has no desc');
  for (const [d, x] of Object.entries(r.exits || {})) {
    const to = typeof x === 'string' ? x : x.to;
    if (!R.rooms[to]) err(rid, `exit ${d}: unknown room "${to}"`);
  }
  for (const g of [...(r.ambush?.groups || []), ...(r.hunt || [])]) for (const id of g) if (!R.enemies[id]) err(rid, `ambush/hunt: unknown enemy "${id}"`);
  const seenIds = new Set();
  for (const t of r.things || []) {
    if (!t.id || !t.name) err(rid, `thing without id/name: ${JSON.stringify(t).slice(0, 60)}`);
    if (seenIds.has(t.id)) err(rid, `duplicate thing id "${t.id}"`); seenIds.add(t.id);
    if (typeof t.talk === 'string' && !R.dialogues[t.talk]) err(`${rid}/${t.id}`, `talk: unknown dialogue "${t.talk}"`);
    if (t.portrait && !ASSETS.portraits.includes(t.portrait)) err(`${rid}/${t.id}`, `unknown portrait "${t.portrait}"`);
    for (const i of Object.keys(t.use || {})) if (i !== '*' && !R.items[i]) err(`${rid}/${t.id}`, `use: unknown item "${i}"`);
  }
}
for (const [did, d] of Object.entries(R.dialogues)) {
  const nodes = d.nodes || {};
  if (!nodes[d.start || Object.keys(nodes)[0]]) err(`dlg ${did}`, 'start node missing');
  for (const [nid, n] of Object.entries(nodes)) {
    const who = n.who || 'narrator';
    if (who !== 'narrator' && !members.includes(who) && !R.npcs[who]) err(`dlg ${did}.${nid}`, `unknown speaker "${who}"`);
    for (const k of ['next', 'goto', 'else']) if (n[k] && !nodes[n[k]]) err(`dlg ${did}.${nid}`, `${k}: unknown node "${n[k]}"`);
    for (const c of n.choices || []) if (c.to && !nodes[c.to]) err(`dlg ${did}.${nid}`, `choice to unknown node "${c.to}"`);
  }
}
for (const [nid, n] of Object.entries(R.npcs)) if (n.portrait && !ASSETS.portraits.includes(n.portrait)) err(`npc ${nid}`, `unknown portrait "${n.portrait}"`);
for (const [eid, e] of Object.entries(R.enemies)) {
  if (!spriteOk(e.sprite || eid)) err(`enemy ${eid}`, `unknown sprite "${e.sprite || eid}"`);
  for (const k of ['hp', 'atk', 'def', 'agi', 'xp']) if (typeof e[k] !== 'number') err(`enemy ${eid}`, `missing ${k} (use enemyStats)`);
  for (const d of e.drops || []) if (!R.items[d.id]) err(`enemy ${eid}`, `drop: unknown item "${d.id}"`);
  for (const s of e.skills || []) if (s.summon) for (const id of [].concat(s.summon)) if (!R.enemies[id]) err(`enemy ${eid}`, `summon unknown "${id}"`);
}
for (const [iid, it] of Object.entries(R.items)) if (it.icon && !iconOk(it.icon)) err(`item ${iid}`, `unknown icon "${it.icon}"`);
for (const [sid, s] of Object.entries(R.shops)) for (const i of s.items || []) if (!R.items[i]) err(`shop ${sid}`, `unknown item "${i}"`);
for (const c of R.combine) for (const k of ['a', 'b', 'make']) if (!R.items[c[k]]) err(`combine (${c.ch})`, `unknown item "${c[k]}"`);

// ---------- reachability (exits + goto) ----------
for (const [cid, ch] of Object.entries(chapters)) {
  if (!R.rooms[ch.start]) { err(cid, `start room "${ch.start}" missing`); continue; }
  const gotos = {};
  for (const [rid, r] of Object.entries(R.rooms)) {
    const list = [];
    const grab = l => walk(l, rid, e => { if (e.goto) list.push(e.goto); });
    grab(r.enter); grab(r.first);
    for (const t of r.things || []) {
      for (const k of ['look', 'talk', 'take']) if (Array.isArray(t[k])) grab(t[k]);
      for (const e of Object.values(t.verbs || {})) grab(Array.isArray(e) ? e : e?.do);
      for (const e of Object.values(t.use || {})) if (typeof e !== 'string') grab(e);
      if (typeof t.talk === 'string' && R.dialogues[t.talk]) for (const n of Object.values(R.dialogues[t.talk].nodes)) { grab(n.do); for (const c of n.choices || []) grab(c.do); }
    }
    gotos[rid] = list;
  }
  const seen = new Set([ch.start]); const q = [ch.start];
  while (q.length) {
    const rid = q.shift(); const r = R.rooms[rid]; if (!r) continue;
    const next = [...Object.values(r.exits || {}).map(x => typeof x === 'string' ? x : x.to), ...(gotos[rid] || [])];
    for (const n of next) if (n && !seen.has(n) && R.roomCh[n] === cid) { seen.add(n); q.push(n); }
  }
  for (const rid of Object.keys(ch.rooms || {})) if (!seen.has(rid)) err(cid, `room "${rid}" is not reachable from ${ch.start}`);
  // all manifest rooms of this chapter exist
  for (const rid of Object.keys(ROOM)) if (rid.startsWith('c' + cid.slice(2) + '-') && !R.rooms[rid]) warn(cid, `manifest room "${rid}" not defined`);
  if (!(ch.hints || []).length) warn(cid, 'no hints');
  if (!Object.values(ch.quests || {}).some(q => q.main)) warn(cid, 'no main quest');
}

// ---------- key items: consumed items need a source ----------
for (const [id, list] of Object.entries(takes)) {
  const it = R.items[id]; if (!it || it.type !== 'key') continue;
  const srcs = (gives[id] || []).length + (shopsSell.has(id) ? 99 : 0);
  if (!srcs) err('items', `key item "${id}" is consumed but never given`);
  else if (srcs === 1 && list.length > 1) warn('items', `key item "${id}" is given once but consumed in ${list.length} places: ${list.join(', ')}`);
}

console.log(`\n${errors} error(s), ${warnings} warning(s) across ${Object.keys(chapters).join(', ') || 'no chapters'}.`);
process.exitCode = errors ? 1 : 0;
