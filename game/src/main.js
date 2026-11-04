// Boot, title screen, new game / continue, global keys and the debug hook.
import { R, S, register, newState, setState, readSlot, meta, check, saveTo } from './state.js';
import * as U from './ui.js';
import { $, el, Abort } from './util.js';
import { audioInit, unlock, playMusic, playAmb, sfx, audioState, suspend, resume, preload, setAudio } from './audio.js';
import { resetWorld, W, enterRoom, startChapter, renderDock, command, updateTop, exitsForKeys, go, lookAround, run, dialogue, visibleThings, doVerb, useItemOn } from './world.js';
import { renderParty, joinMember, openParty, stats, newMember, xpToReach } from './party.js';
import { openBag, giveItem } from './items.js';
import { openJournal, openMap, openMenu, openSaves, openSettings, openCredits, settings, applySettings, loadSlot, ENDINGS } from './menus.js';
import { debugWin, battleState, B } from './battle.js';
import * as partyData from './data/party-data.js';
import * as coreItems from './data/core-items.js';
import * as coreEnemies from './data/core-enemies.js';
import manifest, { CHAPTER_STARTS } from './content/manifest.js';

const CHAPTERS = ['ch1', 'ch2', 'ch3', 'ch4', 'ch5'];
let contentReady = Promise.resolve();
export const ready = () => contentReady;
const SFX = ['slash', 'pierce', 'blunt', 'crit', 'enemy-die', 'hurt', 'bite', 'fire', 'lightning', 'cold', 'holy', 'star', 'heal', 'buff', 'debuff', 'steal', 'drink', 'roar', 'level-up', 'item-get', 'door', 'refuse', 'battle-start', 'sting-victory', 'sting-gameover', 'sting-solved'];

async function boot() {
  R.members = partyData.members; R.skills = partyData.skills; R.xpStep = partyData.xpStep;
  register(coreItems.default);
  register(coreEnemies.default);
  register(manifest);
  R.chapterStarts = CHAPTER_STARTS;
  // Chapters load in the background (in parallel) so the title shows at once.
  contentReady = Promise.all(CHAPTERS.map(id => import(`./content/${id}.js`).catch(e => { console.warn('chapter not loaded:', id, e.message); return null; })))
    .then(mods => { mods.forEach((m, i) => { if (m) register(m.default, CHAPTERS[i]); }); });
  const st = settings();
  audioInit({ music: st.music !== false, sfx: st.sfx !== false });
  applySettings();

  // UI wiring
  $('#btn-menu').innerHTML = U.icon('menu');
  $('#btn-menu').addEventListener('click', () => { unlock(); sfx('click'); if (B.on) openSettings(); else openMenu(); });
  $('#modal-close').innerHTML = U.icon('close');
  $('#modal-close').addEventListener('click', () => { sfx('click'); U.closeModal(); });
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') U.closeModal(); });
  $('#scene-toggle').innerHTML = U.icon('image');
  const toggleScene = () => { U.ui.sceneSmall = !U.ui.sceneSmall; U.layout(); };
  $('#scene-toggle').addEventListener('click', toggleScene);
  $('#room-label').addEventListener('click', toggleScene);
  $('#cmd').addEventListener('submit', e => { e.preventDefault(); const v = $('#cmd-input').value; $('#cmd-input').value = ''; unlock(); command(v); });
  window.addEventListener('resize', () => U.layout());
  window.addEventListener('orientationchange', () => setTimeout(() => U.layout(), 200));
  document.addEventListener('visibilitychange', () => { if (document.hidden) suspend(); else resume(); });
  window.addEventListener('pointerdown', () => unlock(), { capture: true });
  window.addEventListener('keydown', onKey);
  setInterval(() => { if (!document.hidden && $('#game').classList.contains('on')) S.playTime += 1; }, 1000);
  document.addEventListener('touchmove', e => { if (!e.target.closest('#log, #modal-body, #dock-body, #card .cap, .map')) e.preventDefault(); }, { passive: false });

  // Reveal the title only when its fonts and art are ready, so it appears once and stays put.
  const titleImg = U.img('assets/bg/bg-title.png');
  await Promise.all([
    Promise.all(['40px "Metal Mania"', '17px "Alegreya"', 'italic 17px "Alegreya"', '16px "Pixelify Sans"'].map(f => document.fonts.load(f).catch(() => {}))),
    new Promise(res => { const t = setTimeout(res, 12000); const done = () => { clearTimeout(t); (titleImg.decode ? titleImg.decode().catch(() => {}) : Promise.resolve()).then(res); }; if (titleImg.ok) done(); else { titleImg.addEventListener('load', done, { once: true }); titleImg.addEventListener('error', () => { clearTimeout(t); res(); }, { once: true }); } }),
  ]);
  if (titleImg.ok) { titleImg.alt = ''; titleImg.className = 'title-img'; $('#title-art').append(titleImg); }
  showTitle();
  $('#app').classList.remove('booting');
  registerSW();
}

function registerSW() {
  const local = ['localhost', '127.0.0.1'].includes(location.hostname);
  if ('serviceWorker' in navigator && (!local || new URLSearchParams(location.search).has('sw'))) navigator.serviceWorker.register('sw.js').catch(() => {});
}

function latestSave() {
  let best = null, bestId = null;
  for (const id of ['auto', '1', '2', '3']) { const s = readSlot(id); if (s && !s.broken && (!best || s.savedAt > best.savedAt)) { best = s; bestId = id; } }
  return bestId;
}

export function showTitle() {
  U.cancelPending(); resetWorld(); playAmb(null);
  $('#game').classList.remove('on');
  $('#title').classList.add('on');
  U.closeModal();
  const menu = $('#title-menu'); menu.innerHTML = '';
  const foot = $('#title-foot');
  const m = meta();
  const n = Object.keys(m.endings || {}).length;
  foot.textContent = n ? `Endings found: ${n} of 3` : 'A sword-and-sorcery text adventure';
  const items = () => {
    menu.innerHTML = '';
    const cont = latestSave();
    if (cont) menu.append(U.button('Continue', 'title:continue', async () => { await waitContent(); loadSlot(cont); }, 'primary'));
    menu.append(U.button('New Game', 'title:new', () => newGame(), cont ? '' : 'primary'));
    if (cont) menu.append(U.button('Load', 'title:load', () => openSaves('load')));
    if (n) {
      const fin = readSlot('final'), cho = readSlot('choice');
      if (fin && !fin.broken) menu.append(U.button('Return to the Final Choice', 'title:final', () => loadSlot('final')));
      if (cho && !cho.broken) menu.append(U.button('Replay from the Choice', 'title:choice', () => loadSlot('choice')));
    }
    const row = el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' } },
      U.button('Settings', 'title:settings', () => openSettings()), U.button('Credits', 'title:credits', () => openCredits()));
    menu.append(row);
    playMusic('title');
  };
  if (!audioState().context || audioState().context === 'none') {
    const b = U.button(matchMedia('(pointer: coarse)').matches ? 'Tap to begin' : 'Click to begin', 'title:start', () => { window.removeEventListener('keydown', k); unlock(); preload(SFX); items(); }, 'primary tap-start');
    menu.append(b);
    function k(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.removeEventListener('keydown', k); unlock(); preload(SFX); items(); } }
    window.addEventListener('keydown', k);
  } else items();
}

function showGame() {
  $('#title').classList.remove('on');
  $('#game').classList.add('on');
  U.layout();
  requestAnimationFrame(() => U.layout());
}

const PROLOGUE = [
  { img: 'bg-prologue', kicker: 'From an Old Chronicle', title: 'Know, O Traveler…', text: '…that in the long dusk after the drowning of the old world, when kingdoms rose like campfires on a dark plain and burned out as quickly, there were men who owed nothing to any throne.\n\nOne of them came down out of the grey, wind-bitten hills of Cimmeria with a notched sword, a scowl, and an empty purse.' },
  { img: 'bg-desert-gate', kicker: 'Zamora · the Desert Road', title: 'Shadizar, the Wicked', text: 'Shadizar: the City of Thieves, whose towers glitter over the desert like a harlot\'s rings. Its gold is stolen, its gods are bought, and its walls are older than anyone can say.\n\nBrannoc of Cimmeria has walked forty miles of sand to reach it. He has not eaten in two days. He is in no mood for anyone\'s nonsense.' },
];

let contentDone = false;
async function waitContent() {
  if (!contentDone) { U.toast('Loading the chronicle…'); await contentReady; contentDone = true; }
}
let starting = false;
async function newGame() {
  if (starting) return;
  starting = true;
  try { await newGameInner(); } catch (err) { if (!(err instanceof Abort)) throw err; } finally { starting = false; }
}
async function newGameInner() {
  unlock();
  await waitContent();
  U.cancelPending(); resetWorld();
  const s = newState();
  setState(s);
  S.easy = !!settings().easy;
  newMember('brannoc', 1);
  showGame();
  U.clearLog();
  renderParty();
  for (const p of PROLOGUE) await U.showCard({ ...p, buttons: [{ label: 'Continue ▸', act: 'continue', cls: 'primary' }] });
  await startChapter('ch1');
}

export async function resumeGame() {
  showGame();
  U.clearLog();
  resetWorld();
  try {
    renderParty(); updateTop();
    await enterRoom(S.room, { fromLoad: true, noSave: true, silent: true });
  } catch (err) {
    if (err && err.name === 'Error' && String(err.message) === '') return;
    console.error(err); U.toast('That save could not be loaded'); showTitle();
  }
}

function onKey(e) {
  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
    if (e.key === 'Escape') e.target.blur();
    return;
  }
  if (e.key === 'Escape') {
    if (!$('#card').classList.contains('hidden')) return;
    if (U.modalOpen()) { e.preventDefault(); U.closeModal(); return; }
    if ($('#game').classList.contains('on') && !W.busy && !B.on) { e.preventDefault(); openMenu(); }
    return;
  }
  if (!$('#game').classList.contains('on') || U.modalOpen() || !$('#card').classList.contains('hidden')) return;
  if (W.busy || B.on || W.mode !== 'explore') return;
  const k = e.key.toLowerCase();
  const dirKey = { arrowup: 'n', arrowdown: 's', arrowleft: 'w', arrowright: 'e', n: 'n', s: 's', e: 'e', w: 'w', u: 'u', d: 'd' }[k];
  if (dirKey) {
    const x = exitsForKeys().find(x => x.dir === dirKey);
    if (x) { e.preventDefault(); go(x); }
    return;
  }
  if (k === 'l') { e.preventDefault(); lookAround(); }
  else if (k === 'i') { e.preventDefault(); openBag(); }
  else if (k === 'p') { e.preventDefault(); openParty(); }
  else if (k === 'j') { e.preventDefault(); openJournal(); }
  else if (k === 'm') { e.preventDefault(); openMap(); }
  else if (k === '/' || k === 't') { const i = $('#cmd-input'); if (i && i.offsetParent) { e.preventDefault(); i.focus(); } }
}

// ---------- debug hook (for play-testing; reads state and sets up situations) ----------
window.__game = {
  state: () => ({
    screen: $('#game').classList.contains('on') ? (B.on ? 'battle' : 'game') : 'title',
    chapter: S.chapter, room: S.room, roomName: R.rooms[S.room]?.name, gold: S.gold, party: S.party.filter(id => S.members[id]).map(id => ({ id, level: S.members[id].level, hp: S.members[id].hp, mp: S.members[id].mp })),
    inv: { ...S.inv }, flags: Object.keys(S.flags), quests: { ...S.quests }, busy: W.busy, battle: battleState(),
    endings: Object.keys(meta().endings || {}), modal: U.modalOpen(), card: !$('#card').classList.contains('hidden'),
  }),
  S: () => S, R: () => R,
  rooms: () => Object.keys(R.rooms),
  audioState,
  win: () => debugWin(),
  setFlag: f => { S.flags[f] = true; },
  give: (id, n = 1) => giveItem(id, n, true),
  buttons: () => [...document.querySelectorAll('button[data-act]')].filter(b => b.offsetParent && !b.disabled).map(b => ({ act: b.dataset.act, label: b.textContent.trim() })),
  goto: async id => { await enterRoom(id); },
  // Jump to the start of chapter n with that chapter's preset party (from the manifest).
  chapter: async (n, branch, seed = 12345) => {
    await contentReady;
    const snap = R.chapterStarts?.[`ch${n}${branch ? '-' + branch : ''}`] || R.chapterStarts?.[`ch${n}`];
    const s = newState(seed); setState(s); newMember('brannoc', 1); unlock();
    if (snap) {
      for (const [id, lv] of Object.entries(snap.party)) { if (id === 'brannoc') { S.members.brannoc.level = lv; S.members.brannoc.xp = xpToReach(lv); } else await joinMember(id, lv, true); }
      for (const [id, eq] of Object.entries(snap.equip || {})) Object.assign(S.members[id].equip, eq);
      for (const [it, c] of Object.entries(snap.items || {})) giveItem(it, c, true);
      for (const f of snap.flags || []) S.flags[f] = true;
      for (const [id, list] of Object.entries(snap.learn || {})) { S.members[id].learned = [...(S.members[id].learned || []), ...list]; }
      for (const [id, eq] of Object.entries(snap.equip || {})) { if (eq.sidearm) { S.members[id].equip.side = eq.sidearm; delete S.members[id].equip.sidearm; } }
      Object.assign(S.vars, snap.vars || {}); Object.assign(S.quests, snap.quests || {});
      S.gold = snap.gold || 0;
      for (const id of S.party) { const st = stats(id); S.members[id].hp = st.maxhp; S.members[id].mp = st.maxmp; }
    }
    showGame(); U.clearLog(); renderParty();
    await startChapter('ch' + n);
  },
  newGame, loadSlot, B, run, dialogue,
  acts: () => [...document.querySelectorAll('[data-act]')].filter(b => b.offsetParent && !b.disabled && b.getAttribute('aria-disabled') !== 'true').map(b => b.dataset.act),
  act: id => { const b = [...document.querySelectorAll(`[data-act="${CSS.escape(id)}"]`)].find(b => b.offsetParent && !b.disabled); if (!b) return false; b.click(); return true; },
  seed: n => { S.seed = n; S.rngState = n; setState(S); },
  battlePolicy: p => { B.policy = p; B.auto = p === 'auto'; },
  fight: enemies => run([{ fight: { enemies } }]),
  errors: () => B.errors,
  check: c => check(c),
};

boot();
