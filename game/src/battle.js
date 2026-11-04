// Turn-based front-view battles drawn over the room's picture.
import { R, S, random, check } from './state.js';
import * as U from './ui.js';
import { el, sleep, clamp } from './util.js';
import { sfx, playMusic, musicId } from './audio.js';
import { stats, skillsOf, renderParty, flashMember, floatOnMember, memberName, addXp } from './party.js';
import { itemDef, itemName, giveItem, takeItem } from './items.js';

const SIZE_H = { s: 48, m: 72, l: 100, xl: 140 };
const SIZE_W = { s: 64, m: 80, l: 100, xl: 150 };
const POS_X = { left: 60, center: 160, right: 260 };
export const TINTS = { teal: '#3e8c9a', cyan: '#6cd0e0', white: '#f0f0f0', grey: '#9a9aa3', gray: '#9a9aa3', red: '#d0503f', tan: '#cdbf9f', steel: '#8fa3b8', gold: '#e8b04b', violet: '#8a4aa8', dark: '#5a5a70', bone: '#e9dec4', green: '#8fb04a', blue: '#5fb4d9', orange: '#e0883a', fire: '#ff9a5a', void: '#a07ad0' };
const PHASE_TINT = { fire: '#ffb070', void: '#a98ae0' };
export const B = { on: false, auto: false, speed: 1, policy: 'manual', errors: [] };

let battle = null;
const wait = ms => sleep(B.speed >= 99 ? 30 : ms / (B.speed || 1));
const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

function parseSprite(d, id) {
  const raw = d.sprite || id;
  const [sp, t] = String(raw).split('@');
  return { sprite: sp, tint: d.tint || t || null };
}

function enemyFromDef(id, letter, startHp = 1) {
  const d = R.enemies[id];
  if (!d) throw new Error('unknown enemy ' + id);
  const e = S.easy ? 0.7 : 1;
  const hp = Math.max(1, Math.round(d.hp * e));
  const { sprite, tint } = parseSprite(d, id);
  return {
    side: 'enemy', id, d, name: d.name + (letter ? ' ' + letter : ''), hp: Math.max(1, Math.round(hp * startHp)), maxhp: hp,
    atk: Math.round(d.atk * (S.easy ? 0.75 : 1)), def: d.def || 0, res: d.res || 0, agi: d.agi || 5,
    status: {}, flash: 0, dead: false, fade: 1, sprite, tint, img: U.img(U.enemyPath(sprite)), bob: random() * 6,
    mirror: !!d.mirror,
  };
}

// weak/resist/immune, honoring the current phase
function affinity(e) {
  if (!e || !e.d) return { weak: [], resist: [], immune: [] };
  const ph = battle?.phase && e.d.phases?.[battle.phase];
  return { weak: ph?.weak || e.d.weak || [], resist: ph?.resist || e.d.resist || [], immune: ph?.immune || e.d.immune || [] };
}

function layoutEnemies() {
  const list = battle.enemies.filter(e => !e.dead || e.fade > 0);
  const n = list.length;
  for (const e of list) {
    const h0 = SIZE_H[e.d.size || 'm'] || 72, w0 = SIZE_W[e.d.size || 'm'] || 80;
    const ar = e.img.ok ? e.img.naturalWidth / e.img.naturalHeight : 0.8;
    let h = h0, w = h * ar;
    if (w > w0) { w = w0; h = w / ar; }
    e.w = w; e.h = h;
  }
  const fixed = list.filter(e => e.d.pos);
  const free = list.filter(e => !e.d.pos);
  for (const e of fixed) { const cx = POS_X[e.d.pos] ?? 160; e.x = cx - e.w / 2; }
  // free enemies: spread evenly across the space; total ≤ 300 with overlap if needed
  if (free.length) {
    const total = free.reduce((a, e) => a + e.w, 0);
    const span = Math.min(300, Math.max(total, 120 * free.length));
    const gap = free.length > 1 ? (span - total) / (free.length - 1) : 0;
    let x = 160 - Math.min(span, total + gap * (free.length - 1)) / 2;
    if (fixed.length) {
      // put free ones in the gaps between fixed parts
      const slots = [100, 220, 40, 280];
      free.forEach((e, i) => { e.x = (slots[i % slots.length]) - e.w / 2; });
    } else {
      for (const e of free) { e.x = x; x += e.w + gap; }
    }
  }
  for (const e of list) {
    e.x = clamp(e.x, 2, 318 - e.w);
    e.y = 170 - e.h - (e.d.float ? 14 : 0);
  }
}

const tintCache = new Map();
function spriteFor(e, white) {
  const phaseTint = battle?.phase && e.d.phases ? PHASE_TINT[battle.phase] : null;
  const tint = white ? '#ffffff' : (phaseTint || (e.tint ? (TINTS[e.tint] || e.tint) : null));
  const key = e.sprite + '|' + (tint || '') + (e.mirror ? '|m' : '');
  if (tintCache.has(key)) return tintCache.get(key);
  if (!e.img.ok) return null;
  const c = document.createElement('canvas'); c.width = e.img.naturalWidth; c.height = e.img.naturalHeight;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
  if (e.mirror) { g.translate(c.width, 0); g.scale(-1, 1); }
  g.drawImage(e.img, 0, 0);
  g.setTransform(1, 0, 0, 1, 0, 0);
  if (tint) {
    const base = document.createElement('canvas'); base.width = c.width; base.height = c.height;
    base.getContext('2d').drawImage(c, 0, 0);
    g.globalCompositeOperation = white ? 'source-in' : 'multiply';
    g.fillStyle = tint; g.fillRect(0, 0, c.width, c.height);
    if (!white) { g.globalCompositeOperation = 'destination-in'; g.drawImage(base, 0, 0); }
  }
  tintCache.set(key, c);
  return c;
}

function drawBattle(g, k) {
  if (!battle) return;
  const t = performance.now() / 1000;
  for (const e of battle.enemies) {
    if (e.dead && e.fade <= 0) continue;
    // a whole-pixel bob (no fractional scaling)
    const bob = e.dead ? 0 : Math.round(Math.sin(t * (e.d.boss ? 1.6 : 2) + e.bob) * (e.d.boss ? 1.5 : 1));
    const sx = Math.round(e.x) * k, sy = (Math.round(e.y) + bob) * k, sw = Math.round(e.w) * k, sh = Math.round(e.h) * k;
    g.globalAlpha = e.dead ? Math.max(0, e.fade) : 1;
    g.fillStyle = 'rgba(0,0,0,.35)';
    g.beginPath(); g.ellipse((e.x + e.w / 2) * k, 172 * k, e.w * 0.38 * k, 3 * k, 0, 0, Math.PI * 2); g.fill();
    const spr = spriteFor(e);
    if (spr) {
      g.drawImage(spr, sx, sy, sw, sh);
      if (e.flash > 0) { g.globalAlpha = Math.min(1, e.flash) * 0.85; g.drawImage(spriteFor(e, true), sx, sy, sw, sh); }
    } else {
      g.fillStyle = '#5c1418'; g.fillRect(sx, sy, sw, sh);
      g.fillStyle = '#e9dec4'; g.font = `${8 * k}px "Pixelify Sans"`; g.textAlign = 'center'; g.fillText(e.d.name, sx + sw / 2, sy + sh / 2);
    }
    g.globalAlpha = 1;
    if (!e.dead && battle.targeting && battle.targeting.includes(e)) {
      const blink = (Math.sin(t * 8) + 1) / 2;
      g.fillStyle = `rgba(232,176,75,${0.6 + blink * 0.4})`;
      const cx = (e.x + e.w / 2) * k, cy = (e.y - 4) * k;
      g.beginPath(); g.moveTo(cx - 5 * k, cy - 6 * k); g.lineTo(cx + 5 * k, cy - 6 * k); g.lineTo(cx, cy); g.fill();
    }
    if (!e.dead) {
      const bw = Math.max(26, Math.min(60, e.w)) * k, bx = (e.x + e.w / 2) * k - bw / 2, by = 175 * k;
      g.fillStyle = '#000'; g.fillRect(bx, by, bw, 3 * k);
      g.fillStyle = '#d0503f'; g.fillRect(bx, by, bw * Math.max(0, e.hp / e.maxhp), 3 * k);
    }
    if (e.flash > 0) e.flash -= 0.08;
    if (e.dead && e.fade > 0) e.fade -= 0.04;
  }
}

let raf = 0;
function loop() { if (!B.on) return; U.drawScene(); raf = requestAnimationFrame(loop); }

// ---------- start ----------
export function startBattle(f) {
  return new Promise(async resolve => {
    const prevMusic = musicId();
    const counts = {}, letters = {};
    for (const id of f.enemies) counts[id] = (counts[id] || 0) + 1;
    const startHp = f.start?.hp ?? 1;
    let enemies;
    try {
      enemies = f.enemies.map(id => {
        let letter = '';
        if (counts[id] > 1 && !R.enemies[id]?.pos) { letters[id] = (letters[id] || 0) + 1; letter = 'ABCDEFG'[letters[id] - 1]; }
        return enemyFromDef(id, letter, startHp);
      });
    } catch (err) { console.error(err); B.errors.push(String(err)); resolve('win'); return; }
    // mirrored pairs: a second copy of a positioned part goes on the other side
    const seen = {};
    for (const e of enemies) {
      if (e.d.pos === 'left' || e.d.pos === 'right') {
        seen[e.id] = (seen[e.id] || 0) + 1;
        if (seen[e.id] === 2) { e.d = { ...e.d, pos: e.d.pos === 'left' ? 'right' : 'left' }; e.mirror = !e.mirror; e.name = e.d.name + ' (right)'; }
        else if (counts[e.id] > 1) e.name = e.d.name + ' (left)';
      }
    }
    await Promise.all(enemies.map(e => U.whenLoaded(e.img)));
    const arenaSnap = f.arena ? JSON.stringify(Object.fromEntries(S.party.map(id => [id, { hp: S.members[id].hp, mp: S.members[id].mp }]))) : null;
    battle = { f, enemies, round: 0, resolve, fired: new Set(), lastFired: {}, phase: null, last: {}, repeatRound: false, autoRound: false };
    layoutEnemies();
    B.on = true; B.auto = B.policy === 'auto';
    document.getElementById('game').classList.add('battle');
    const room = R.rooms[S.room];
    let bg = f.bg || room?.bg, tint = null;
    if (typeof bg !== 'string') bg = (await import('./world.js')).roomBg(room).join('@');
    [bg, tint] = String(bg).split('@');
    U.setScene(bg, tint || null);
    U.scene.dim = 0.22;
    U.scene.extra = drawBattle;
    U.layout();
    loop();
    const boss = f.boss || enemies.some(e => e.d.boss);
    playMusic(f.music || (boss ? 'boss' : 'battle'));
    sfx(boss ? 'roar' : 'battle-start');
    if (boss) U.shake();
    U.logDivider();
    U.logBattle(`<span class="w">${f.intro ? esc(f.intro) : 'Battle!'}</span>`);
    renderParty();
    let result;
    try { result = await battleLoop(); }
    catch (err) { console.error(err); B.errors.push(String(err && err.stack || err)); result = 'win'; }
    B.on = false; cancelAnimationFrame(raf);
    U.scene.extra = null; U.scene.dim = 0;
    document.getElementById('game').classList.remove('battle');
    document.getElementById('scene-fx').innerHTML = '';
    for (const id of S.party) { const m = S.members[id]; m.status = {}; m.defending = false; if (result !== 'lose' && m.hp <= 0) m.hp = 1; }
    if (f.arena && arenaSnap) { const snap = JSON.parse(arenaSnap); for (const id of S.party) Object.assign(S.members[id], snap[id]); }
    // put weapons back if swapped during the fight
    for (const id of S.party) { const m = S.members[id]; if (m.swapped) { const w = m.equip.weapon; m.equip.weapon = m.equip.side; m.equip.side = w; m.swapped = false; } }
    U.layout();
    const w = await import('./world.js');
    const [rb, rt] = w.roomBg(room || {});
    if (rb) U.setScene(rb, rt);
    playMusic(room && 'music' in room ? room.music : (R.chapters[S.chapter]?.music || prevMusic));
    battle = null;
    renderParty();
    resolve(result);
  });
}

function liveEnemies() { return battle.enemies.filter(e => !e.dead); }
function liveParty() { return S.party.filter(id => S.members[id].hp > 0); }

// ---------- main loop ----------
async function battleLoop() {
  for (;;) {
    battle.round++;
    battle.repeatRound = false; battle.autoRound = false;
    const pre = await runTriggers('round');
    if (pre) return pre;
    const actors = [
      ...liveParty().map(id => ({ side: 'party', id, agi: stats(id).agi + random() * 6 })),
      ...liveEnemies().map(e => ({ side: 'enemy', e, agi: e.agi + random() * 6 })),
    ].sort((a, b) => b.agi - a.agi);
    battle.order = actors;
    for (let i = 0; i < battle.order.length; i++) {
      const a = battle.order[i];
      battle.turnIndex = i;
      if (a.side === 'party' && S.members[a.id].hp <= 0) continue;
      if (a.side === 'enemy' && a.e.dead) continue;
      drawQueue(i);
      const r = a.side === 'party' ? await partyTurn(a.id) : await enemyTurn(a.e);
      if (r === 'flee') return 'flee';
      const end = await checkEnd();
      if (end) return end;
    }
    for (const id of liveParty()) await tickStatus({ side: 'party', id });
    for (const e of liveEnemies()) await tickStatus({ side: 'enemy', e });
    const end = await checkEnd();
    if (end) return end;
  }
}

// ---------- triggers ----------
function triggerDue(t, i, phase) {
  const when = String(t.when || (t.below !== undefined ? `hp<${t.below}` : 'hp<0.5')).replace(/\s+/g, '');
  let m;
  if ((m = when.match(/^round>=(\d+)$/))) {
    if (phase !== 'round' || battle.round < +m[1]) return false;
    if (t.every) { const last = battle.lastFired[i]; return last === undefined || battle.round - last >= t.every; }
    return !battle.fired.has(i);
  }
  if (phase === 'round') return false;
  if (battle.fired.has(i) && !t.every) return false;
  if (when === 'dead') { const e = battle.enemies.find(x => x.id === t.enemy); return !!e && e.dead; }
  if (when === 'allDead') return battle.enemies.filter(x => !x.d.boss).every(x => x.dead);
  if ((m = when.match(/^hp(<=|<)([\d.]+)$/))) {
    const e = t.enemy ? battle.enemies.find(x => x.id === t.enemy && !x.dead) || battle.enemies.find(x => x.id === t.enemy) : null;
    const frac = e ? e.hp / e.maxhp : liveEnemies().reduce((a, x) => a + x.hp, 0) / battle.enemies.reduce((a, x) => a + x.maxhp, 0);
    return m[1] === '<' ? frac < +m[2] : frac <= +m[2];
  }
  return false;
}

async function runTriggers(phase) {
  for (const [i, t] of (battle.f.triggers || []).entries()) {
    if (!triggerDue(t, i, phase)) continue;
    if (t.if && !check(t.if)) continue;
    battle.fired.add(i); battle.lastFired[i] = battle.round;
    const r = await battleEffects(t.do || []);
    if (r) return r;
  }
  return null;
}

async function battleEffects(list) {
  const w = await import('./world.js');
  for (const e of list) {
    if (e.endBattle) return finishWin();
    if (e.phase !== undefined) {
      battle.phase = e.phase; tintCache.clear();
      if (B.auto && B.policy !== 'auto') { B.auto = false; U.toast('The battle changes! You take over.'); }
      sfx('roar'); U.shake();
      continue;
    }
    if (e.hit) {
      const h = e.hit;
      if (h.text) U.logBattle(`<span class="w">${esc(h.text)}</span>`);
      const ts = h.target === 'all' ? liveEnemies() : h.target === 'one' || !h.target ? [liveEnemies()[0]] : liveEnemies().filter(x => x.id === h.target);
      for (const t of ts) {
        if (!t) continue;
        const res = calcMagic(0, t, h.el || null, h.power || 30);
        sfx(h.el ? hitSfx(h.el) : 'blunt'); applyDamage(t, res.dmg); popFor(t, res);
      }
      await wait(450);
      continue;
    }
    if (e.summon) {
      for (const id of [].concat(e.summon)) {
        if (liveEnemies().length >= 4) break;
        const ne = enemyFromDef(id, '');
        await U.whenLoaded(ne.img);
        battle.enemies.push(ne);
        U.logBattle(`${esc(ne.name)} appears!`);
      }
      layoutEnemies(); sfx('summon');
      continue;
    }
    if (e.heal && !e.say) {
      for (const id of liveParty()) { const m = S.members[id]; const st = stats(id); const h = Math.round(st.maxhp * (typeof e.heal === 'number' ? e.heal : 0.3)); m.hp = Math.min(st.maxhp, m.hp + h); floatOnMember(id, '+' + h, '#8ff0a8'); }
      sfx('heal'); renderParty(); continue;
    }
    if (e.buff) {
      const b = e.buff;
      if (b.target === 'enemies') for (const t of liveEnemies()) { if (b.stat === 'atk') t.atk = Math.round(t.atk * (1 + (b.amount || 0.2))); else t.status[b.stat] = 3; }
      else for (const id of liveParty()) S.members[id].status[b.stat || 'atkUp'] = b.turns || 3;
      sfx('buff'); continue;
    }
    if (e.shake) { U.shake(); continue; }
    const r = await w.run([e]);
    if (r === 'stop') return finishWin();
  }
  return null;
}

async function checkEnd() {
  const t = await runTriggers('action');
  if (t) return t;
  if (!liveEnemies().length) return finishWin();
  if (!liveParty().length) {
    U.logBattle('<span class="c">Your party has fallen.</span>');
    sfx('sting-gameover');
    await wait(900);
    return 'lose';
  }
  if (B.auto && B.policy !== 'auto' && liveParty().some(id => S.members[id].hp / stats(id).maxhp < 0.3)) {
    B.auto = false; U.toast('Someone is badly hurt. You take over.');
  }
  return null;
}

async function finishWin() {
  battle.targeting = null;
  sfx('sting-victory');
  let xp = 0, gold = 0; const drops = [];
  for (const e of battle.enemies) {
    xp += e.d.xp || 0; gold += e.d.gold || 0;
    for (const dr of e.d.drops || []) if (random() < (dr.chance ?? 1)) drops.push(dr.id);
  }
  if (battle.f.xp !== undefined) xp = battle.f.xp;
  U.logBattle('<span class="w">Victory!</span>');
  await wait(500);
  if (xp) await addXp(xp);
  if (gold) { S.gold += gold; U.logSys(`+${gold} gold`, 'gold'); }
  for (const d of drops) { if (itemDef(d)?.type === 'key' && S.inv[d] > 0) continue; giveItem(d, 1); }
  (await import('./world.js')).updateTop();
  return 'win';
}

function drawQueue(i) {
  const fx = document.getElementById('scene-fx');
  let q = fx.querySelector('.queue');
  if (!q) { q = el('div', { class: 'queue' }); fx.append(q); }
  q.innerHTML = '';
  const up = battle.order.slice(i).filter(a => a.side === 'party' ? S.members[a.id].hp > 0 : !a.e.dead).slice(0, 5);
  for (const a of up) {
    if (a.side === 'party') q.append(U.portraitCanvas(R.members[a.id].portrait || a.id, memberName(a.id), 48, true));
    else {
      const c = el('canvas', { width: 32, height: 32 });
      const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
      if (a.e.img.ok) { const ar = a.e.img.naturalWidth / a.e.img.naturalHeight; const w = ar >= 1 ? 32 : 32 * ar, h = ar >= 1 ? 32 / ar : 32; g.drawImage(a.e.img, (32 - w) / 2, (32 - h) / 2, w, h); }
      else { g.fillStyle = '#a3262a'; g.fillRect(4, 4, 24, 24); }
      q.append(c);
    }
  }
}

// ---------- party turn ----------
async function partyTurn(id) {
  const m = S.members[id];
  renderParty(id);
  if (m.status.sleep) { U.logBattle(`${memberName(id)} is asleep.`); await wait(500); return; }
  if (m.status.stun) { U.logBattle(`${memberName(id)} is stunned!`); delete m.status.stun; await wait(500); return; }
  m.defending = false;
  m.swappedThisTurn = false;
  let act;
  if (B.auto || battle.autoRound) act = autoAction(id);
  else if (battle.repeatRound && battle.last[id]) act = repeatAction(id);
  else act = await chooseAction(id);
  if (act === 'flee') return tryFlee();
  if (!act) return;
  battle.last[id] = rememberAction(act);
  return perform({ side: 'party', id }, act);
}

function rememberAction(act) {
  const r = { ...act };
  if (act.target && act.target.side === 'enemy') r.targetIdx = battle.enemies.indexOf(act.target);
  return r;
}
function repeatAction(id) {
  const l = battle.last[id];
  const m = S.members[id];
  if (l.kind === 'skill') { const s = R.skills[l.skill]; if (!s || s.mp > m.mp) return autoAction(id); }
  if (l.kind === 'item' && !(S.inv[l.item] > 0)) return autoAction(id);
  const act = { ...l };
  if (l.targetIdx !== undefined) {
    const t = battle.enemies[l.targetIdx];
    act.target = t && !t.dead ? t : liveEnemies().slice().sort((a, b) => a.hp - b.hp)[0];
  }
  if (act.kind === 'swap') return autoAction(id);
  return act;
}

function knownWeak(e, type) { return !!type && S.flags['studied:' + e.id] && affinity(e).weak.includes(type); }

function autoAction(id) {
  const m = S.members[id]; const st = stats(id);
  const sk = skillsOf(id).map(s => ({ id: s, ...R.skills[s] })).filter(s => s.mp <= m.mp && s.mp <= stats(id).maxmp / 2 + 1);
  const hurt = liveParty().filter(p => S.members[p].hp / stats(p).maxhp < 0.4);
  const heal = sk.find(s => s.type === 'heal' && (s.power || 0) > 0);
  if (hurt.length && heal) return { kind: 'skill', skill: heal.id, target: heal.target === 'allies' ? 'all' : hurt[0] };
  const foes = liveEnemies();
  // prefer a foe with a known weakness to our weapon (or our sidearm: swap first)
  const side = m.equip.side && itemDef(m.equip.side)?.weapon;
  let target = foes.find(e => knownWeak(e, st.dmg));
  if (!target && side && !m.swappedThisTurn) {
    const t2 = foes.find(e => knownWeak(e, side.dmg));
    if (t2) { doSwap(id, true); target = t2; }
  }
  if (!target) {
    const spell = sk.filter(s => s.type === 'magic').find(s => foes.some(e => knownWeak(e, s.el)));
    if (spell) return { kind: 'skill', skill: spell.id, target: spell.target === 'enemies' ? 'all' : foes.find(e => knownWeak(e, spell.el)) };
  }
  if (!target) target = foes.slice().sort((a, b) => a.hp - b.hp)[0];
  if (!target) return { kind: 'defend' };
  const stNow = stats(id);
  if (stNow.mag > stNow.atk + 4) {
    const bolt = sk.filter(s => s.type === 'magic' && s.target === 'enemy' && !affinity(target).immune.includes(s.el) && !affinity(target).resist.includes(s.el)).sort((a, b) => (b.power || 0) - (a.power || 0))[0];
    if (bolt) return { kind: 'skill', skill: bolt.id, target };
  }
  if (affinity(target).immune.includes(stNow.dmg)) {
    const any = sk.find(s => s.type === 'magic' && !affinity(target).immune.includes(s.el));
    if (any) return { kind: 'skill', skill: any.id, target: any.target === 'enemies' ? 'all' : target };
    const flask = Object.keys(S.inv).find(x => S.inv[x] > 0 && itemDef(x)?.use?.damage && !affinity(target).immune.includes(itemDef(x).use.damage.el));
    if (flask) return { kind: 'item', item: flask, target };
    return { kind: 'defend' };
  }
  return { kind: 'attack', target };
}

function doSwap(id, quiet) {
  const m = S.members[id];
  const w = m.equip.weapon; m.equip.weapon = m.equip.side; m.equip.side = w;
  m.swapped = !m.swapped; m.swappedThisTurn = true;
  if (!quiet) { U.logBattle(`${memberName(id)} draws the ${esc(itemName(m.equip.weapon))} (${itemDef(m.equip.weapon).weapon.dmg}).`); }
  sfx('equip'); renderParty(id);
}

const TYPE_LABEL = { slash: 'Slash', pierce: 'Pierce', blunt: 'Blunt' };

function chooseAction(id) {
  return new Promise(resolve0 => {
    const m = S.members[id];
    let keyHandler = null;
    let settled = false;
    const resolve = v => { if (settled) return; settled = true; if (keyHandler) window.removeEventListener('keydown', keyHandler); if (battle) battle.targeting = null; U.dockClear(); resolve0(v); };
    const keyMenu = opts => {
      if (keyHandler) window.removeEventListener('keydown', keyHandler);
      keyHandler = e => {
        if (U.modalOpen() || (e.target && e.target.tagName === 'INPUT')) return;
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= opts.length && !opts[n - 1][3]) { e.preventDefault(); opts[n - 1][2](); }
        else if (e.key === 'Escape' || e.key === 'Backspace') { const b = opts.find(o => o[1] === 'back'); if (b) { e.preventDefault(); b[2](); } }
      };
      window.addEventListener('keydown', keyHandler);
    };
    const mainMenu = () => {
      battle.targeting = null;
      const st = stats(id);
      U.setTabs(null); U.dockClear();
      U.dockPrompt(`${memberName(id)}: HP ${m.hp}/${st.maxhp}${st.maxmp ? ` · MP ${m.mp}/${st.maxmp}` : ''}`);
      const side = m.equip.side && itemDef(m.equip.side);
      const fleeOk = !(battle.f.noFlee || battle.f.boss || battle.f.arena || battle.enemies.some(e => e.d.boss));
      const opts = [
        [`Attack · ${TYPE_LABEL[st.dmg] || st.dmg}`, 'battle:attack', () => pickEnemy(t => resolve({ kind: 'attack', target: t }), mainMenu)],
        ['Skills', 'battle:skills', () => skillsMenu()],
        ['Items', 'battle:items', () => itemsMenu()],
        ['Defend', 'battle:defend', () => resolve({ kind: 'defend' })],
        [side ? `Swap → ${TYPE_LABEL[side.weapon.dmg]}` : 'Swap', 'battle:swap', () => { doSwap(id); mainMenu(); }, !side || m.swappedThisTurn],
        ['Flee', 'battle:flee', () => resolve('flee'), !fleeOk],
        ['Repeat', 'battle:repeat', () => { battle.repeatRound = true; resolve(battle.last[id] ? repeatAction(id) : autoAction(id)); }, !Object.keys(battle.last).length],
        ['Auto', 'battle:auto', () => { battle.autoRound = true; resolve(autoAction(id)); }],
        ['Auto all', 'battle:auto-all', () => { B.auto = true; U.toast('Auto battle: tap Stop to take over'); resolve(autoAction(id)); }],
      ];
      opts.forEach(([l, act, fn, dis], i) => U.dockAdd(U.button(`<span>${l}</span>${i < 9 ? `<span class="k">${i + 1}</span>` : ''}`, act, fn, (i === 0 ? 'primary' : '') + (i >= 6 ? ' third' : ''), dis ? { disabled: true } : {})));
      keyMenu(opts);
    };
    const skillsMenu = () => {
      const st = stats(id);
      const list = skillsOf(id).map(s => ({ id: s, ...R.skills[s] }));
      if (!list.some(s => s.type === 'study')) list.push({ id: 'study', ...R.skills.study, name: 'Study' });
      U.dockClear(); U.dockPrompt(`${memberName(id)} · MP ${m.mp}/${st.maxmp}`);
      const opts = list.map(s => [`${s.name} <span class="k">${s.mp ? s.mp + ' MP' : 'free'}</span>`, 'battle:skill:' + s.id, () => pickTargetFor(s), s.mp > m.mp]);
      opts.push(['Back', 'back', mainMenu]);
      opts.forEach(([l, act, fn, dis]) => U.dockAdd(U.button(l, act, fn, act === 'back' ? 'ghost full' : '', dis ? { disabled: true } : {})));
      keyMenu(opts);
    };
    const pickTargetFor = s => {
      if (s.target === 'enemy') pickEnemy(t => resolve({ kind: 'skill', skill: s.id, target: t }), skillsMenu);
      else if (s.target === 'ally' || s.target === 'ko-ally') pickAlly(t => resolve({ kind: 'skill', skill: s.id, target: t }), skillsMenu, s.target === 'ko-ally');
      else resolve({ kind: 'skill', skill: s.id, target: 'all' });
    };
    const itemsMenu = () => {
      const ids = Object.keys(S.inv).filter(x => S.inv[x] > 0 && itemDef(x)?.type === 'consumable');
      U.dockClear(); U.dockPrompt(battle.f.arena ? 'No items in the Pit: arena rules.' : 'Items');
      const opts = ids.map(x => [`${itemName(x)} <span class="k">×${S.inv[x]}</span>`, 'battle:item:' + x, () => {
        const u = itemDef(x).use;
        if (u.damage) { if (u.damage.all) resolve({ kind: 'item', item: x, target: 'all' }); else pickEnemy(t => resolve({ kind: 'item', item: x, target: t }), itemsMenu); }
        else if (u.flee) resolve({ kind: 'item', item: x });
        else if (u.party) resolve({ kind: 'item', item: x, target: 'all' });
        else pickAlly(t => resolve({ kind: 'item', item: x, target: t }), itemsMenu, !!u.revive);
      }, !!battle.f.arena || (itemDef(x).use.flee && (battle.f.noFlee || battle.f.boss))]);
      if (!ids.length) U.dockPrompt('No usable items.');
      opts.push(['Back', 'back', mainMenu]);
      opts.forEach(([l, act, fn, dis]) => U.dockAdd(U.button(l, act, fn, act === 'back' ? 'ghost full' : '', dis ? { disabled: true } : {})));
      keyMenu(opts);
    };
    let cvOff = () => {};
    const pickEnemy = (done, back) => {
      const foes = liveEnemies();
      if (foes.length === 1) { done(foes[0]); return; }
      battle.targeting = foes;
      U.dockClear(); U.dockPrompt('Choose a target (or tap it in the picture)');
      const opts = foes.map(e => {
        const a = affinity(e); const known = S.flags['studied:' + e.id];
        const tag = known && a.weak.length ? ` · weak ${a.weak.join('/')}` : '';
        return [`${esc(e.name)} <span class="k">${Math.ceil(100 * e.hp / e.maxhp)}%${tag}</span>`, 'target:' + battle.enemies.indexOf(e), () => { cvOff(); done(e); }];
      });
      opts.push(['Back', 'back', () => { cvOff(); back(); }]);
      opts.forEach(([l, act, fn]) => U.dockAdd(U.button(l, act, fn, act === 'back' ? 'ghost full' : '')));
      keyMenu(opts);
      const cv = document.getElementById('scene');
      const onTap = ev => {
        const r = cv.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width * 320, y = (ev.clientY - r.top) / r.height * 180;
        const hits = foes.filter(e => x >= e.x - 3 && x <= e.x + e.w + 3 && y >= e.y - 8 && y <= 180);
        const hit = hits.sort((a, b) => Math.abs(x - (a.x + a.w / 2)) - Math.abs(x - (b.x + b.w / 2)))[0];
        if (hit) { cvOff(); sfx('ui-click'); done(hit); }
      };
      cvOff = () => { battle.targeting = null; cv.removeEventListener('pointerdown', onTap); };
      cv.addEventListener('pointerdown', onTap);
    };
    const pickAlly = (done, back, ko) => {
      U.dockClear(); U.dockPrompt('Choose who');
      const opts = S.party.filter(p => ko || S.members[p].hp > 0).map(p => [`${memberName(p)} <span class="k">${S.members[p].hp}/${stats(p).maxhp}</span>`, 'ally:' + p, () => done(p)]);
      opts.push(['Back', 'back', back]);
      opts.forEach(([l, act, fn]) => U.dockAdd(U.button(l, act, fn, act === 'back' ? 'ghost full' : '')));
      keyMenu(opts);
    };
    mainMenu();
  });
}

function showStopAuto() {
  U.setTabs(null); U.dockClear();
  U.dockAdd(U.button('Stop auto battle', 'battle:stop-auto', () => { B.auto = false; U.dockClear(); U.dockPrompt('You will take over at the next turn.'); }, 'danger full'));
}

async function tryFlee() {
  const pa = liveParty().reduce((a, id) => a + stats(id).agi, 0) / Math.max(1, liveParty().length);
  const ea = liveEnemies().reduce((a, e) => a + e.agi, 0) / Math.max(1, liveEnemies().length);
  const chance = clamp(0.55 + (pa - ea) / 40, 0.25, 0.92);
  if (random() < chance) { sfx('flee'); U.logBattle('You break away and escape!'); await wait(500); return 'flee'; }
  U.logBattle('You try to flee, but they cut you off!'); await wait(500);
}

// ---------- damage ----------
function multFor(target, type) {
  if (!type) return 1;
  if (target.side === 'enemy') {
    const a = affinity(target);
    if (a.immune.includes(type)) return 0;
    if (a.weak.includes(type)) return 1.5;
    if (a.resist.includes(type)) return 0.5;
  }
  return 1;
}

function defOf(t) {
  if (t.side === 'enemy') return { def: t.def * (t.status.defDown ? 0.6 : 1), res: t.res };
  const st = stats(t.id); const m = S.members[t.id];
  let def = st.def, res = st.res;
  if (m.status.defUp) def *= 1.4;
  if (m.status.resUp) res *= 1.4;
  if (m.status.burn) def *= 0.85;
  return { def, res };
}

function applyDamage(t, amount) {
  if (t.side === 'enemy') {
    t.hp = Math.max(0, t.hp - amount);
    t.flash = 1;
    if (t.status.sleep) delete t.status.sleep;
    if (t.hp <= 0 && !t.dead) { t.dead = true; sfx('enemy-die'); queueMicrotask(() => U.logBattle(`<span class="w">${esc(t.name)} is slain!</span>`)); }
  } else {
    const m = S.members[t.id];
    if (m.defending) amount = Math.ceil(amount / 2);
    if (m.hp - amount <= 0 && m.status.unbroken) { amount = m.hp - 1; delete m.status.unbroken; U.logBattle(`${memberName(t.id)} refuses to fall!`); }
    m.hp = Math.max(0, m.hp - amount);
    if (m.status.sleep) delete m.status.sleep;
    flashMember(t.id); floatOnMember(t.id, '-' + amount, '#ff7a6a');
    sfx('hurt', { vol: 0.6 });
    if (m.hp <= 0) queueMicrotask(() => U.logBattle(`<span class="c">${memberName(t.id)} falls!</span>`));
    renderParty(t.id);
  }
  return amount;
}

function posOf(t) { return { x: t.x + t.w / 2, y: t.y + t.h * 0.3 }; }

function calcPhys(attackerAtk, t, type, power = 1, critChance = 0.05) {
  const { def } = defOf(t);
  const mult = multFor(t, type);
  let dmg = (attackerAtk * power * mult - def * 0.5) * (0.9 + random() * 0.2);
  const crit = mult > 0 && random() < critChance;
  if (crit) dmg *= 1.6;
  dmg = mult === 0 ? 0 : Math.max(1, Math.round(dmg));
  return { dmg, mult, crit };
}
function calcMagic(mag, t, elem, power) {
  const { res } = defOf(t);
  const mult = multFor(t, elem);
  let dmg = ((mag + power) * mult - res * 0.5) * (0.9 + random() * 0.2);
  dmg = mult === 0 ? 0 : Math.max(1, Math.round(dmg));
  return { dmg, mult, crit: false };
}

function popFor(t, res, heal) {
  if (t.side !== 'enemy') return;
  const p = posOf(t);
  if (heal) { U.popNumber(p.x, p.y, '+' + heal, 'heal'); return; }
  if (res.mult === 0) { U.popNumber(p.x, p.y, 'IMMUNE', 'miss'); return; }
  U.popNumber(p.x, p.y, String(res.dmg), res.mult > 1 ? 'weak' : '', res.crit ? 'CRIT!' : res.mult > 1 ? 'WEAK!' : res.mult < 1 ? 'resist' : '');
}
function tagText(res) {
  return (res.crit ? ' <span class="c">Critical!</span>' : '') + (res.mult > 1 ? ' <span class="w">Weak!</span>' : '') + (res.mult > 0 && res.mult < 1 ? ' (resisted)' : '') + (res.mult === 0 ? ' (immune)' : '');
}
function hitSfx(type) {
  return { slash: 'slash', pierce: 'pierce', blunt: 'blunt', fire: 'fire', lightning: 'lightning', holy: 'holy', star: 'star', cold: 'cold', void: 'debuff' }[type] || 'blunt';
}
function learn(t, type, mult) { if (mult > 1 || mult === 0 || mult < 1) S.flags['studied:' + t.id] = S.flags['studied:' + t.id] || mult !== 1; }

function inflict(t, status) {
  if (!status) return;
  for (const [s, ch] of Object.entries(status)) {
    if (t.side === 'party' && stats(t.id).status.includes(s)) continue;
    if (t.side === 'enemy' && (t.d.immuneStatus || []).includes(s)) continue;
    if (t.side === 'enemy' && t.d.boss && ['sleep', 'stun'].includes(s) && random() < 0.6) continue;
    if (random() < ch) {
      const st = t.side === 'enemy' ? t.status : S.members[t.id].status;
      st[s] = { poison: 4, burn: 3, sleep: 2, stun: 1, blind: 3, fear: 3, defDown: 3 }[s] || 3;
      U.logBattle(`${esc(t.side === 'enemy' ? t.name : memberName(t.id))} is ${{ poison: 'poisoned', burn: 'burning', sleep: 'asleep', stun: 'stunned', blind: 'blinded', fear: 'afraid', defDown: 'exposed' }[s] || s}!`);
      sfx('status-tick');
    }
  }
}

async function tickStatus(a) {
  const st = a.side === 'enemy' ? a.e.status : S.members[a.id].status;
  const name = a.side === 'enemy' ? a.e.name : memberName(a.id);
  const maxhp = a.side === 'enemy' ? a.e.maxhp : stats(a.id).maxhp;
  const tgt = a.side === 'enemy' ? a.e : { side: 'party', id: a.id };
  for (const s of Object.keys(st)) {
    if (s === 'poison' || s === 'burn') {
      if (!(a.side === 'enemy' && a.e.d.boss)) {
        const dmg = Math.max(1, Math.round(maxhp * (s === 'poison' ? 0.05 : 0.04)));
        U.logBattle(`${esc(name)} takes ${dmg} ${s} damage.`);
        applyDamage(tgt, dmg); if (tgt.side === 'enemy') popFor(tgt, { dmg, mult: 1 });
        sfx('status-tick');
        await wait(250);
      }
    }
    if (s === 'regen' && a.side === 'party' && S.members[a.id].hp > 0) {
      const h = Math.round(maxhp * 0.1); const m = S.members[a.id]; m.hp = Math.min(maxhp, m.hp + h); floatOnMember(a.id, '+' + h, '#8ff0a8');
    }
    if (typeof st[s] === 'number') { st[s]--; if (st[s] <= 0) delete st[s]; }
  }
  renderParty();
}

// ---------- performing actions ----------
async function perform(actor, act) {
  const name = memberName(actor.id);
  if (B.auto && B.policy !== 'auto') showStopAuto();
  if (act.kind === 'defend') {
    const m = S.members[actor.id];
    m.defending = true; m.mp = Math.min(stats(actor.id).maxmp, m.mp + 2);
    U.logBattle(`${name} braces behind steel.`); sfx('defend'); await wait(380); return;
  }
  if (act.kind === 'item') return useItem(actor, act);
  if (act.kind === 'attack') {
    let t = act.target;
    if (!t || t.dead) t = liveEnemies()[0];
    if (!t) return;
    const st = stats(actor.id); const m = S.members[actor.id];
    const atk = st.atk * (m.status.atkUp ? 1.3 : 1);
    if (m.status.blind && random() < 0.5) { U.logBattle(`${name} swings blind and misses!`); sfx('miss'); U.popNumber(t.x + t.w / 2, t.y + 10, 'MISS', 'miss'); await wait(420); return; }
    const res = calcPhys(atk, t, st.dmg, 1, 0.05 + st.agi / 400 + (m.status.luck ? 0.25 : 0) + (m.equip.trinket === 'lucky-coin' ? 0.05 : 0));
    if (st.el && res.mult > 0) { const em = multFor(t, st.el); if (em > 1) { res.dmg = Math.round(res.dmg * 1.25); res.mult = Math.max(res.mult, 1.5); } }
    if (res.mult !== 1) S.flags['studied:' + t.id] = true;
    sfx(res.crit ? 'crit' : hitSfx(st.dmg));
    applyDamage(t, res.dmg); popFor(t, res);
    if (res.crit || res.mult > 1) U.shake();
    U.logBattle(`${name} strikes ${esc(t.name)} for ${res.dmg}.${tagText(res)}`);
    await wait(500);
    return;
  }
  if (act.kind === 'skill') return useSkill(actor, R.skills[act.skill], act.target, act.skill);
}

async function useItem(actor, act) {
  const it = itemDef(act.item); const u = it.use;
  takeItem(act.item, 1, true);
  U.logBattle(`${memberName(actor.id)} uses ${esc(it.name)}.`);
  if (u.flee) { sfx('flee'); U.logBattle('A cloud of smoke! You slip away.'); await wait(500); return 'flee'; }
  if (u.damage) {
    const ts = act.target === 'all' ? liveEnemies() : [act.target && !act.target.dead ? act.target : liveEnemies()[0]];
    for (const t of ts) {
      if (!t) continue;
      const res = calcMagic(20, t, u.damage.el, u.damage.power);
      if (res.mult !== 1) S.flags['studied:' + t.id] = true;
      sfx(hitSfx(u.damage.el)); applyDamage(t, res.dmg); popFor(t, res);
      U.logBattle(`${esc(t.name)} takes ${res.dmg}.${tagText(res)}`);
    }
    await wait(480); return;
  }
  const targets = act.target === 'all' ? [...S.party] : [act.target];
  for (const id of targets) healMember(id, u);
  sfx('drink'); sfx('heal'); await wait(420);
}

function healMember(id, u) {
  const m = S.members[id]; const st = stats(id);
  if (u.revive && m.hp <= 0) { m.hp = Math.ceil(st.maxhp * u.revive); U.logBattle(`${memberName(id)} rises again!`); }
  if (m.hp <= 0) return;
  if (u.heal) { const h = Math.min(st.maxhp - m.hp, u.heal); m.hp += h; floatOnMember(id, '+' + h, '#8ff0a8'); }
  if (u.mp) { m.mp = Math.min(st.maxmp, m.mp + u.mp); }
  if (u.cure) m.status = Object.fromEntries(Object.entries(m.status).filter(([k]) => !['poison', 'burn', 'sleep', 'stun', 'blind', 'fear'].includes(k)));
  renderParty();
}

async function useSkill(actor, s, target, sid) {
  const id = actor.id; const m = S.members[id]; const st = stats(id);
  if (m.status.fear && s.type !== 'heal') { U.logBattle(`${memberName(id)} is too afraid to try that!`); await wait(380); return; }
  m.mp -= s.mp || 0;
  renderParty(id);
  U.logBattle(`${memberName(id)}: <span class="w">${esc(s.name)}</span>`);
  sfx(s.sfx || (s.type === 'heal' ? 'heal' : s.type === 'buff' ? 'buff' : s.type === 'debuff' ? 'debuff' : s.type === 'steal' ? 'steal' : s.el ? hitSfx(s.el) : hitSfx(s.dmg || st.dmg)));
  const enemiesT = s.target === 'enemies' ? liveEnemies() : s.target === 'enemy' ? [target && !target.dead && target.side === 'enemy' ? target : liveEnemies()[0]] : [];
  const allyT = s.target === 'allies' ? [...S.party] : (s.target === 'ally' || s.target === 'ko-ally') ? [target] : s.target === 'self' ? [id] : [];
  if (s.type === 'phys' || s.type === 'magic') {
    const hits = s.hits || 1;
    const power = (s.power || (s.type === 'magic' ? 10 : 1)) + (s.levelPower ? s.levelPower * m.level : 0);
    for (const t of enemiesT) {
      if (!t) continue;
      for (let h = 0; h < hits && !t.dead; h++) {
        let res;
        if (s.type === 'phys') {
          const type = s.dmg || st.dmg;
          res = calcPhys(st.atk * (m.status.atkUp ? 1.3 : 1), t, type, power, (s.crit || 0.05) + st.agi / 400 + (m.status.luck ? 0.25 : 0));
          if (s.el && res.mult > 0 && multFor(t, s.el) > 1) { res.dmg = Math.round(res.dmg * 1.3); res.mult = Math.max(res.mult, 1.5); }
        } else res = calcMagic(st.mag, t, s.el, power);
        if (res.mult !== 1) S.flags['studied:' + t.id] = true;
        applyDamage(t, res.dmg); popFor(t, res);
        U.logBattle(`${esc(t.name)} takes ${res.dmg}.${tagText(res)}`);
        if (res.mult > 0) inflict(t, s.status);
        await wait(240);
      }
    }
    if (enemiesT.length > 1 || power > 1.8 && s.type === 'phys') U.shake();
  }
  if (s.type === 'steal') {
    const t = enemiesT[0];
    if (t && !t.stolen && random() < 0.7) {
      t.stolen = true;
      const drops = t.d.drops || [];
      if (drops.length && random() < 0.6) { const d = drops[Math.floor(random() * drops.length)].id; giveItem(d, 1, true); U.logBattle(`${memberName(id)} lifts a ${esc(itemName(d))}!`); }
      else { const gold = 10 + Math.round((t.d.gold || 5) * 1.5); S.gold += gold; U.logBattle(`${memberName(id)} lifts ${gold} gold!`); (await import('./world.js')).updateTop(); }
      sfx('coins');
    } else { U.logBattle(t && t.stolen ? 'Nothing left to steal.' : 'Empty-handed!'); sfx('miss'); }
  }
  if (s.type === 'study') {
    const t = enemiesT[0];
    if (t) {
      S.flags['studied:' + t.id] = true;
      const a = affinity(t);
      U.logBattle(`${esc(t.name)}: ${esc(t.d.desc || '')} <span class="w">Weak: ${a.weak.join(', ') || 'nothing'}.</span> Resists: ${a.resist.join(', ') || 'nothing'}.${a.immune.length ? ' Immune: ' + a.immune.join(', ') + '.' : ''}`);
    }
  }
  if (s.type === 'heal') {
    for (const pid of allyT) {
      if (!pid || !S.members[pid]) continue;
      const pm = S.members[pid]; const pst = stats(pid);
      if (s.revive && pm.hp <= 0) { pm.hp = Math.ceil(pst.maxhp * s.revive); U.logBattle(`${memberName(pid)} rises!`); }
      if (pm.hp <= 0) continue;
      if (s.power) { const amt = Math.min(pst.maxhp - pm.hp, Math.round((st.wil * (s.wilMul || 1) + s.power) * (0.9 + random() * 0.2))); pm.hp += amt; floatOnMember(pid, '+' + amt, '#8ff0a8'); flashMember(pid, 'healfx'); }
      if (s.cure) pm.status = Object.fromEntries(Object.entries(pm.status).filter(([k]) => !['poison', 'burn', 'sleep', 'stun', 'blind', 'fear'].includes(k)));
      if (s.buff) Object.assign(pm.status, s.buff);
    }
    renderParty(id);
  }
  if (s.type === 'buff') {
    for (const pid of allyT) {
      if (!pid) continue;
      Object.assign(S.members[pid].status, s.buff || {});
      flashMember(pid, 'healfx');
      if (s.extraTurn && pid !== id && battle.order && S.members[pid].hp > 0) {
        battle.order.splice(battle.turnIndex + 1, 0, { side: 'party', id: pid, agi: 0 });
        U.logBattle(`${memberName(pid)} moves again!`);
      }
    }
    U.logBattle(esc(s.msg || 'The party feels stronger.'));
  }
  if (s.type === 'debuff') {
    for (const t of enemiesT.length ? enemiesT : liveEnemies()) inflict(t, s.status);
  }
  await wait(420);
}

// ---------- enemy turn ----------
async function enemyTurn(e) {
  if (e.status.sleep) { U.logBattle(`${esc(e.name)} sleeps.`); await wait(320); return; }
  if (e.status.stun) { U.logBattle(`${esc(e.name)} is stunned.`); delete e.status.stun; await wait(320); return; }
  e.flash = 0.5;
  const skills = e.d.skills || [];
  let sk = null;
  // a whole-party attack can't come two turns running from the same foe
  for (const s of skills) if (random() < (s.chance ?? 0.3) && (!s.below || e.hp / e.maxhp <= s.below) && (!s.phase || s.phase === battle.phase) && !(s.target === 'all' && e.lastAll === battle.round - 1)) { sk = s; break; }
  if (sk && sk.target === 'all') e.lastAll = battle.round;
  const party = liveParty();
  if (!party.length) return;
  const pick = () => {
    const pool = party.flatMap(id => S.members[id].defending ? [id] : [id, id]);
    return pool[Math.floor(random() * pool.length)];
  };
  const atkType = e.d.attackDmg || (skills[0] && !skills[0].magic ? skills[0].dmg : null) || 'slash';
  if (!sk) {
    const id = pick();
    if (e.status.blind && random() < 0.5) { U.logBattle(`${esc(e.name)} attacks wildly and misses.`); sfx('miss'); await wait(380); return; }
    const evade = S.members[id].status.evade ? 0.4 : 0;
    if (random() < 0.04 + stats(id).agi / 500 + evade) { U.logBattle(`${memberName(id)} dodges ${esc(e.name)}'s attack!`); sfx('miss'); floatOnMember(id, 'miss', '#9a8f7a'); await wait(380); return; }
    const res = calcPhys(e.atk, { side: 'party', id }, atkType, 1, 0.05);
    sfx(hitSfx(atkType));
    const dealt = applyDamage({ side: 'party', id }, res.dmg);
    U.logBattle(`${esc(e.name)} hits ${memberName(id)} for ${dealt}.${res.crit ? ' <span class="c">Critical!</span>' : ''}`);
    if (res.crit) U.shake();
    await wait(460);
    return;
  }
  U.logBattle(`${esc(e.name)}: <span class="c">${esc(sk.name)}</span>${sk.msg ? ' ' + esc(sk.msg) : ''}`);
  if (sk.summon) {
    for (const id of [].concat(sk.summon)) {
      if (liveEnemies().length >= 4) break;
      const ne = enemyFromDef(id, '');
      await U.whenLoaded(ne.img);
      battle.enemies.push(ne);
      U.logBattle(`${esc(ne.name)} appears!`);
    }
    layoutEnemies(); sfx('summon'); await wait(420); return;
  }
  if (sk.heal) {
    const h = Math.round(e.maxhp * sk.heal); e.hp = Math.min(e.maxhp, e.hp + h);
    U.popNumber(e.x + e.w / 2, e.y + 10, '+' + h, 'heal'); sfx('heal'); await wait(420); return;
  }
  if (sk.buff) { Object.assign(e.status, sk.buff); if (sk.buff.atkUp) e.atk = Math.round(e.atk * 1.15); sfx('buff'); await wait(380); return; }
  const targets = sk.target === 'all' ? party : [pick()];
  sfx(sk.sfx || (sk.magic ? hitSfx(sk.el) : hitSfx(sk.dmg || atkType)));
  if (sk.target === 'all' || (sk.power || 1) >= 1.6) U.shake();
  for (const id of targets) {
    const t = { side: 'party', id };
    let res;
    if (sk.magic) res = calcMagic(e.atk * 0.8, t, sk.el, (sk.power || 1) * e.atk * 0.6);
    else res = calcPhys(e.atk, t, sk.dmg || atkType, sk.power || 1.3, 0.05);
    if (sk.target === 'all') res.dmg = Math.max(1, Math.round(res.dmg * 0.75));
    const dealt = applyDamage(t, res.dmg);
    U.logBattle(`${memberName(id)} takes ${dealt}.`);
    inflict(t, sk.status);
    await wait(170);
  }
  if (sk.drain) { const h = Math.round(e.maxhp * 0.05); e.hp = Math.min(e.maxhp, e.hp + h); }
  await wait(320);
}

// ---------- debug ----------
export function debugWin() {
  if (!battle) return false;
  for (const e of battle.enemies) { e.hp = 0; e.dead = true; }
  B.auto = true;
  return true;
}
export function battleState() {
  if (!battle) return null;
  return { round: battle.round, phase: battle.phase, enemies: battle.enemies.map(e => ({ id: e.id, name: e.name, hp: e.hp, maxhp: e.maxhp, dead: e.dead, x: Math.round(e.x), w: Math.round(e.w) })), auto: B.auto };
}
