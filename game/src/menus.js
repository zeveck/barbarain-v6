// Journal, map, saves, settings, the More menu, endings and credits.
import { R, S, check, saveTo, readSlot, setState, meta, setMeta, chapterNum } from './state.js';
import * as U from './ui.js';
import { el, fmtTime } from './util.js';
import { sfx, setAudio, audioSettings, playMusic } from './audio.js';
import { B } from './battle.js';

export const SLOTS = ['1', '2', '3'];
export const ENDINGS = {
  A: { name: 'The Wanderer', blurb: 'The dragon is driven back between the worlds. Shadizar half-burns, and Brannoc goes on to the next horizon.' },
  B: { name: 'The Dragon Crown', blurb: 'You took the crown of every age. Your friends did not follow.' },
  C: { name: 'Iron and Steel', blurb: 'Iron and steel unmade the dragon in every age. Shadizar stands, and the future is green.' },
};

export function autosave() { if (S.room) saveTo('auto', 'Autosave'); }

export function settings() { return meta().settings || {}; }
export function setSetting(patch) { const s = { ...settings(), ...patch }; setMeta({ settings: s }); applySettings(); return s; }
export function applySettings() {
  const s = settings();
  document.documentElement.style.setProperty('--prose', s.big ? '20px' : '17px');
  B.speed = s.speed || 1;
  document.getElementById('cmd')?.classList.toggle('hidden', s.typing === false);
}

// ---------- More menu ----------
export function openMenu() {
  U.openModal('Menu', body => {
    const g = el('div', { class: 'list' });
    const add = (lbl, sub, act, fn) => g.append(el('button', { class: 'row', 'data-act': act, onclick: fn }, el('div', { class: 'main' }, el('div', { class: 't' }, el('b', { text: lbl })), sub ? el('div', { class: 'd', text: sub }) : null)));
    add('Journal', 'Quests, objectives and hints', 'menu:journal', () => openJournal());
    add('Map', 'Where you have been in this chapter', 'menu:map', () => openMap());
    add('Save game', 'Three slots, plus autosave on every step', 'menu:save', () => openSaves('save'));
    add('Load game', '', 'menu:load', () => openSaves('load'));
    add('Settings', 'Music, sound, text size, battle speed, easy mode', 'menu:settings', () => openSettings());
    add('How to play', '', 'menu:help', () => openHelp());
    add('Quit to title', 'Your progress is autosaved', 'menu:title', () => { U.closeModal(); import('./main.js').then(m => m.showTitle()); });
    body.append(g);
  });
}

// ---------- Journal ----------
let hintLevel = 0, hintKey = null;
export function openJournal() {
  U.openModal('Journal', buildJournal);
}
function buildJournal(body) {
  const qs = Object.entries(S.quests).filter(([id, st]) => st > 0 && R.quests[id]);
  qs.sort(([a], [b]) => (R.quests[b].main ? 1 : 0) - (R.quests[a].main ? 1 : 0));
  const active = qs.filter(([id, st]) => !(R.quests[id].done && st >= R.quests[id].done));
  const done = qs.filter(([id, st]) => R.quests[id].done && st >= R.quests[id].done);
  if (!qs.length) body.append(el('p', { text: 'Nothing written yet.' }));
  for (const [id, st] of active) {
    const q = R.quests[id];
    const txt = q.stages[st] || Object.entries(q.stages).filter(([k]) => +k <= st).pop()?.[1] || '';
    body.append(el('div', { class: 'quest' + (q.side ? ' side' : '') }, el('h4', { text: (q.side ? 'Side quest: ' : '') + q.name }), el('p', { text: txt })));
  }
  if (done.length) {
    body.append(el('h4', { text: 'Completed', style: { color: 'var(--dim)', fontWeight: 400, margin: '14px 0 0' } }));
    for (const [id] of done) body.append(el('div', { class: 'quest donep' }, el('h4', { text: R.quests[id].name })));
  }
  // hints
  const hint = R.hints.find(h => h.chapter === S.chapter && check(h.if));
  const box = el('div', { class: 'hintbox' });
  box.append(el('h4', { text: 'Stuck?', style: { margin: '0 0 6px', fontWeight: 400, color: 'var(--verd-l)' } }));
  if (!hint) box.append(el('p', { text: 'Explore, look at things, and talk to people. The way forward is usually in front of you.' }));
  else {
    const key = hint.if + hint.nudge;
    if (hintKey !== key) { hintKey = key; hintLevel = 0; }
    if (hintLevel >= 1) box.append(el('p', { text: hint.nudge }));
    if (hintLevel >= 2) box.append(el('p', { html: '<b>Answer:</b> ' + hint.answer.replace(/[<>]/g, '') }));
    if (hintLevel < 2) box.append(U.button(hintLevel === 0 ? 'Give me a nudge' : 'Just tell me', hintLevel === 0 ? 'hint:nudge' : 'hint:answer', () => { hintLevel++; U.refreshModal(null, buildJournal); }, hintLevel === 0 ? '' : 'ghost'));
  }
  body.append(box);
  body.append(el('p', { class: 'd', style: { color: 'var(--dim)', marginTop: '12px', fontFamily: 'var(--ui)', fontSize: '13px' }, text: `Play time ${fmtTime(S.playTime)} · Brannoc level ${S.members.brannoc?.level || 1}` }));
}

// ---------- Map ----------
export function openMap() {
  U.openModal('Map', body => {
    const rooms = Object.values(R.rooms).filter(r => R.roomChapter[r.id] === S.chapter && r.map);
    const known = rooms.filter(r => S.visited[r.id]);
    const adj = new Set();
    for (const r of known) for (const x of Object.values(r.exits || {})) { const to = typeof x === 'string' ? x : x.to; if (to && !S.visited[to]) adj.add(to); }
    const show = rooms.filter(r => S.visited[r.id] || adj.has(r.id));
    if (!show.length) { body.append(el('p', { text: 'No map for this place.' })); return; }
    const xs = show.map(r => r.map.x), ys = show.map(r => r.map.y);
    const minx = Math.min(...xs), miny = Math.min(...ys), maxx = Math.max(...xs), maxy = Math.max(...ys);
    const avail = Math.min(680, window.innerWidth - 50);
    const cols = maxx - minx + 1;
    const cw = Math.max(54, Math.min(96, Math.floor(avail / cols) - 10)), chh = 40, gx = cw + 10, gy = 56;
    const map = el('div', { class: 'map', style: { width: (cols * gx) + 'px', height: ((maxy - miny + 1) * gy) + 'px' } });
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', cols * gx); svg.setAttribute('height', (maxy - miny + 1) * gy);
    const center = r => [(r.map.x - minx) * gx + cw / 2, (r.map.y - miny) * gy + chh / 2];
    for (const r of show) {
      if (!S.visited[r.id]) continue;
      for (const x of Object.values(r.exits || {})) {
        const to = R.rooms[typeof x === 'string' ? x : x.to];
        if (!to || !to.map || !show.includes(to) || R.roomChapter[to.id] !== S.chapter) continue;
        const [x1, y1] = center(r), [x2, y2] = center(to);
        const ln = document.createElementNS(svgNS, 'line');
        ln.setAttribute('x1', x1); ln.setAttribute('y1', y1); ln.setAttribute('x2', x2); ln.setAttribute('y2', y2);
        ln.setAttribute('stroke', '#6b3f1c'); ln.setAttribute('stroke-width', '3');
        svg.append(ln);
      }
    }
    map.append(svg);
    for (const r of show) {
      const vis = S.visited[r.id];
      map.append(el('div', { class: 'cell' + (r.id === S.room ? ' here' : '') + (vis ? '' : ' unknown'), style: { left: ((r.map.x - minx) * gx) + 'px', top: ((r.map.y - miny) * gy) + 'px', width: cw + 'px', height: chh + 'px' }, text: vis ? r.name : '?' }));
    }
    body.append(el('div', { style: { overflowX: 'auto' } }, map));
    body.append(el('p', { text: 'The bright room is where you stand. Dashed rooms are places you have seen a way into but not yet entered.', style: { fontSize: '14px', color: 'var(--dim)' } }));
  });
}

// ---------- Saves ----------
function slotSummary(s) {
  if (!s) return 'Empty';
  if (s.broken) return 'Damaged save (cannot be loaded)';
  const ch = R.chapters[s.chapter];
  return `${ch ? 'Chapter ' + ['', 'I', 'II', 'III', 'IV', 'V'][ch.num] + ': ' : ''}${R.rooms[s.room]?.name || s.room} · Lv ${s.members?.brannoc?.level || 1} · ${fmtTime(s.playTime || 0)} · ${new Date(s.savedAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
}
export function openSaves(mode) {
  U.openModal(mode === 'save' ? 'Save game' : 'Load game', body => buildSaves(body, mode));
}
function buildSaves(body, mode) {
  const list = el('div', { class: 'list' });
  const slots = mode === 'save' ? SLOTS : ['auto', ...SLOTS, 'choice', 'final'];
  const names = { auto: 'Autosave', choice: 'Before the Choice (Ch III)', final: 'Before the Final Choice (Ch V)' };
  for (const id of slots) {
    const s = readSlot(id);
    if (mode === 'load' && !s && (id === 'choice' || id === 'final')) continue;
    list.append(el('button', { class: 'row slotrow', 'data-act': `${mode}:${id}`, disabled: mode === 'load' && (!s || s.broken) ? true : null,
      onclick: () => {
        if (mode === 'save') {
          if (document.getElementById('game').classList.contains('battle')) { U.toast('You cannot save in battle'); return; }
          if (saveTo(id, 'Slot ' + id)) { sfx('save'); U.toast('Saved'); U.refreshModal(null, b => buildSaves(b, mode)); }
          else U.toast('Could not save (storage full or blocked)');
        } else loadSlot(id);
      } },
      el('div', { class: 'main' }, el('div', { class: 't' }, el('b', { text: names[id] || 'Slot ' + id })), el('div', { class: 'd meta', text: slotSummary(s) }))));
  }
  body.append(list);
  if (mode === 'save') body.append(el('p', { text: 'The game also autosaves every time you enter a room.', style: { fontSize: '14px', color: 'var(--dim)' } }));
}

export async function loadSlot(id) {
  await (await import('./main.js')).ready();
  const s = readSlot(id);
  if (!s || s.broken) { U.toast('That save cannot be loaded'); return false; }
  U.cancelPending();
  (await import('./world.js')).resetWorld();
  U.closeModal();
  setState(s);
  const { resumeGame } = await import('./main.js');
  await resumeGame();
  U.toast('Loaded');
  return true;
}

// ---------- Settings ----------
export function openSettings() {
  U.openModal('Settings', buildSettings);
}
function buildSettings(body) {
  const s = settings(); const a = audioSettings();
  const row = (lbl, sub, on, act, fn) => body.append(el('div', { class: 'setting' }, el('div', { class: 'lbl', text: lbl }, sub ? el('small', { text: sub }) : null),
    U.button(on ? 'On' : 'Off', act, () => { fn(!on); U.refreshModal(null, buildSettings); }, on ? 'primary' : '')));
  row('Music', '', a.music, 'set:music', v => { setAudio({ music: v }); setSetting({ music: v }); });
  row('Sound effects', '', a.sfx, 'set:sfx', v => { setAudio({ sfx: v }); setSetting({ sfx: v }); });
  row('Large text', 'Bigger story text', !!s.big, 'set:big', v => setSetting({ big: v }));
  body.append(el('div', { class: 'setting' }, el('div', { class: 'lbl', text: 'Battle speed' }, el('small', { text: 'How long the pauses between blows last' })),
    el('div', { class: 'seg', style: { margin: 0 } }, ...[[1, '1×'], [2, '2×'], [99, 'Instant']].map(([v, l]) => el('button', { class: (s.speed || 1) === v ? 'on' : '', 'data-act': 'set:speed:' + v, text: l, onclick: () => { setSetting({ speed: v }); U.refreshModal(null, buildSettings); } })))));
  row('Easy mode', 'Weaker foes, more XP. Change any time.', !!S.easy, 'set:easy', v => { S.easy = v; setSetting({ easy: v }); });
  const coarse = matchMedia('(pointer: coarse)').matches;
  if (!coarse) row('Typed commands', 'Show the command line on wide screens', s.typing !== false, 'set:typing', v => setSetting({ typing: v }));
  if (!coarse) body.append(el('p', { text: 'Keys: arrows or N/E/S/W to move, L look, I bag, P party, J journal, M map, 1–9 for choices, Space to continue, Esc for the menu.', style: { fontSize: '14px', color: 'var(--dim)', marginTop: '12px' } }));
}

export function openHelp() {
  U.openModal('How to play', body => {
    for (const p of [
      'You are Brannoc, a Cimmerian far from home. Read each scene, then act.',
      '*Here* lists the people and things around you. Tap one to Look, Talk, Take, Use an item on it, or try its special actions. A gold dot means something new.',
      '*Go* lists the ways out. Unvisited places show a gold dot.',
      '*Bag* holds your gear. Tap an item to equip it, use it, or combine two key items into something better. Comparisons show who gains what.',
      'In battle, every weapon cuts (slash), stabs (pierce) or smashes (blunt), and every foe is weak to something. A sidearm lets a fighter Swap weapons mid-battle. *Auto* plays one round for you, *Repeat* repeats your last round, and *Auto all* fights on until you tap Stop.',
      'Lost? The *Journal* has your objectives and a hint button. The game autosaves every time you enter a room.',
    ]) body.append(el('p', { html: p.replace(/\*([^*]+)\*/g, '<em>$1</em>') }));
  });
}

export function openCredits() {
  U.openModal('Credits', body => {
    for (const p of [
      '*BarbarAIn* — a sword-and-sorcery text adventure RPG.',
      'An original story set in the Hyborian Age created by Robert E. Howard (1906–1936). Brannoc and every character in this game are original.',
      'Made with gamegen. Art generated with OpenAI image models and Google Gemini; music and sound generated with ElevenLabs.',
      'Fonts: Metal Mania (Open Font License), Alegreya by Huerta Tipográfica (Open Font License), Pixelify Sans (Open Font License).',
      'Thanks for playing. Crom does not care, but we do.',
    ]) body.append(el('p', { html: p.replace(/\*([^*]+)\*/g, '<em>$1</em>') }));
  });
}

// ---------- Endings ----------
export async function playEnding(id) {
  const e = ENDINGS[id];
  const { S: _s } = await import('./state.js');
  const m = meta();
  const found = { ...(m.endings || {}), [id]: true };
  setMeta({ endings: found, bestTime: Math.min(m.bestTime || 1e9, S.playTime) });
  S.flags['ending:' + id] = true;
  playMusic(id === 'B' ? 'ancient' : 'ending');
  (await import('./audio.js')).playAmb(null);
  const n = Object.keys(found).length;
  const hasFinal = !!readSlot('final') && !readSlot('final').broken;
  const hasChoice = !!readSlot('choice') && !readSlot('choice').broken;
  const btns = [];
  if (hasFinal) btns.push({ label: 'Return to before the final choice', act: 'ending:final', cls: 'primary' });
  if (hasChoice) btns.push({ label: 'Replay from the Choice (Ch III)', act: 'ending:choice' });
  btns.push({ label: 'Credits', act: 'ending:credits' });
  btns.push({ label: 'Title screen', act: 'ending:title' });
  for (;;) {
    const pick = await U.showCard({
      img: 'bg-ending-' + id.toLowerCase(), kicker: `Ending ${id} · ${n} of 3 endings found`, title: e.name,
      text: `${e.blurb}\n\nEndings: ${['A', 'B', 'C'].map(k => found[k] ? ENDINGS[k].name : '???').join(' · ')}\n\nPlay time ${fmtTime(S.playTime)} · Brannoc level ${S.members.brannoc?.level || 1}` + (n < 3 ? `\n\n${3 - n === 1 ? 'One ending remains' : 'Two endings remain'} undiscovered.${!found.C ? ' One of them depends on a choice you make on the Isle of the Iron Dead.' : ''}` : '\n\nYou have found every ending. Crom himself might grunt in approval.'),
      buttons: btns,
    });
    const act = btns[pick].act;
    if (act === 'ending:final') { await loadSlot('final'); return; }
    if (act === 'ending:choice') { await loadSlot('choice'); return; }
    if (act === 'ending:credits') { await new Promise(r => { openCredits(); const iv = setInterval(() => { if (!U.modalOpen()) { clearInterval(iv); r(); } }, 200); }); continue; }
    const mm = await import('./main.js'); mm.showTitle(); return;
  }
}
