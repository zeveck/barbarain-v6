// Layout, scene picture, text log, action dock, modals, cards and toasts.
import { $, el, richText, sleep, Abort } from './util.js';
import { sfx, unlock } from './audio.js';

// ---------- icons (one consistent line style) ----------
const P = {
  here: '<circle cx="12" cy="10" r="3"/><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/>',
  go: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5 13 13l-4.5 2.5L11 11z"/>',
  bag: '<path d="M6 8h12l1 12H5z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  party: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/><path d="M15 14.5c3 0 6 1.8 6 5.5"/>',
  more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  journal: '<path d="M6 3h11a2 2 0 0 1 2 2v16H8a2 2 0 0 1-2-2z"/><path d="M6 19a2 2 0 0 1 2-2h11"/><path d="M10 7h6M10 10h5"/>',
  map: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
  save: '<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7V4"/><rect x="8" y="13" width="8" height="5"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  look: '<path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.6"/>',
  hunt: '<path d="M4 20 20 4M14 4h6v6"/><path d="M4 14l6 6"/>',
  image: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-8 8"/>',
  sword: '<path d="M14 4h6v6L9 21l-3-3z"/><path d="M5 15l4 4M3 21l3-3"/>',
  back: '<path d="M15 5 8 12l7 7"/>',
};
export function icon(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ''}</svg>`;
}
export function iconEl(name) { const s = el('span', { html: icon(name) }); return s.firstChild; }

// ---------- images ----------
const imgs = new Map();
export function img(path) {
  let i = imgs.get(path);
  if (!i) {
    i = new Image();
    i.decoding = 'async';
    i.ok = false;
    i.onload = () => { i.ok = true; i.onready && i.onready(); };
    i.onerror = () => { i.failed = true; };
    i.src = path;
    imgs.set(path, i);
  }
  return i;
}
export const bgPath = id => `assets/bg/${id}.png`;
export const portraitPath = id => `assets/portraits/${id}.png`;
export const enemyPath = id => `assets/enemies/${id}.png`;
export const iconPath = id => `assets/icons/${id}.png`;
export function whenLoaded(i) {
  return new Promise(res => {
    if (i.ok || i.failed) return res(i);
    const t = setTimeout(() => res(i), 4000);
    i.addEventListener('load', () => { clearTimeout(t); res(i); }, { once: true });
    i.addEventListener('error', () => { clearTimeout(t); res(i); }, { once: true });
  });
}

// portrait onto a small canvas (fallback: silhouette with an initial)
export function portraitCanvas(id, name = '?', size = 96, face = false) {
  const c = el('canvas', { width: size, height: size });
  paintPortrait(c, id, name, face);
  return c;
}
export function paintPortrait(c, id, name = '?', face = false) {
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  const fi = face && id ? img(portraitPath(id + '-face')) : null;
  const draw = () => {
    g.clearRect(0, 0, c.width, c.height);
    if (fi && fi.ok) { g.drawImage(fi, 0, 0, c.width, c.height); return; }
    const i = id ? img(portraitPath(id)) : null;
    if (i && i.ok) { if (face) g.drawImage(i, 24, 8, 48, 48, 0, 0, c.width, c.height); else g.drawImage(i, 0, 0, c.width, c.height); return; }
    // silhouette
    g.fillStyle = '#241c26'; g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = '#3a2a30';
    const s = c.width / 96;
    g.beginPath(); g.arc(48 * s, 38 * s, 18 * s, 0, Math.PI * 2); g.fill();
    g.fillRect(20 * s, 62 * s, 56 * s, 40 * s);
    g.fillStyle = '#e8b04b'; g.font = `${Math.round(30 * s)}px "Metal Mania"`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText((name || '?')[0].toUpperCase(), 48 * s, 44 * s);
  };
  draw();
  if (id) { const i = img(portraitPath(id)); if (!i.ok && !i.failed) i.addEventListener('load', draw, { once: true }); }
  if (fi && !fi.ok && !fi.failed) fi.addEventListener('load', draw, { once: true });
}
const ICON_TINTS = { teal: '#3e8c9a', cyan: '#6cd0e0', steel: '#8fa3b8', bone: '#e9dec4', dark: '#5a5a70', green: '#8fb04a', red: '#d0503f', grey: '#9a9aa3', blue: '#5fb4d9', gold: '#e8b04b', orange: '#e0883a', violet: '#a07ad0', white: '#f0f0f0', tan: '#cdbf9f', pink: '#ef8a9a' };
export function iconCanvas(idT, size = 32) {
  const [id, tint] = String(idT || 'key').split('@');
  const c = el('canvas', { width: size, height: size, class: 'ic' });
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
  const i = id === 'empty' ? { ok: false, failed: true, addEventListener() {} } : img(iconPath(id));
  const draw = () => {
    g.clearRect(0, 0, size, size);
    if (i.ok) {
      g.drawImage(i, 0, 0, size, size);
      if (tint && ICON_TINTS[tint]) {
        g.globalCompositeOperation = 'source-atop'; g.globalAlpha = 0.45; g.fillStyle = ICON_TINTS[tint]; g.fillRect(0, 0, size, size);
        g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
      }
    } else if (id === 'empty' || i.failed) {
      g.strokeStyle = '#4a3a2e'; g.setLineDash([3, 3]); g.lineWidth = 2; g.strokeRect(size * 0.15, size * 0.15, size * 0.7, size * 0.7);
    }
  };
  draw(); if (!i.ok) i.addEventListener('load', draw, { once: true });
  return c;
}

// ---------- layout ----------
export const ui = {
  mode: 'phone', sceneScale: 1, sceneSmall: false,
  logEl: null, dockEl: null, tabsEl: null,
};

export function layout() {
  const game = $('#game');
  requestAnimationFrame(settleLog);
  const w = window.innerWidth, h = window.innerHeight;
  const mode = w >= 880 && h >= 560 ? 'wide' : (w > h ? 'land' : 'phone');
  ui.mode = mode;
  game.classList.toggle('wide', mode === 'wide');
  game.classList.toggle('land', mode === 'land');
  const wrap = $('#scene-wrap');
  let cw, ch;
  const left = $('#left');
  const avail = (left.clientWidth || w) - (mode === 'phone' ? 12 : 4);
  const dpr0 = Math.min(window.devicePixelRatio || 1, 3);
  const maxH = mode === 'wide' ? Math.min((h - 42) * 0.56, h * 0.45 > 180 ? (h - 42) * 0.56 : 180) : mode === 'land' ? (h - 36) * 0.5 : Math.max(150, h * 0.30);
  // largest whole-number scale in device pixels that fits; fractional only above 3x
  let s = Math.min(avail / 320, maxH / 180);
  if (s < 3) { const k = Math.max(1, Math.floor(s * dpr0)); s = k / dpr0; }
  if (320 * s > avail + 1) s = avail / 320;
  cw = 320 * s; ch = 180 * s; ui.sceneScale = s;
  wrap.style.width = Math.round(cw) + 'px';
  wrap.style.height = Math.round(ch) + 'px';
  game.classList.toggle('scene-small', ui.sceneSmall && mode === 'phone' && !game.classList.contains('battle'));
  const cv = $('#scene');
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const bw = Math.round(cw * dpr), bh = Math.round(ch * dpr);
  if (cv.width !== bw || cv.height !== bh) { cv.width = bw; cv.height = bh; }
  scene.dirty = true;
  drawScene();
}

// ---------- scene picture ----------
export const scene = { bg: null, tint: null, dim: 0, overlay: null, dirty: true, extra: null, prevBg: null, fade: 1 };

export function setScene(bg, tint = null) {
  if (bg && bg.includes('@')) { const p = bg.split('@'); bg = p[0]; tint = tint || p[1]; }
  if (scene.bg === bg && scene.tint === tint) return;
  scene.prevBg = scene.bg; scene.prevTint = scene.tint;
  scene.bg = bg; scene.tint = tint; scene.fade = 0;
  const i = img(bgPath(bg));
  i.addEventListener('load', () => { scene.dirty = true; }, { once: true });
  animateFade();
}

let fading = false;
function animateFade() {
  if (fading) return;
  fading = true;
  const t0 = performance.now();
  const step = t => {
    scene.fade = Math.min(1, (t - t0) / 350);
    drawScene();
    if (scene.fade < 1) requestAnimationFrame(step); else fading = false;
  };
  requestAnimationFrame(step);
}

function drawBg(g, id, tint, alpha, W, H) {
  if (!id) return;
  if (id.includes('@')) { const p = id.split('@'); id = p[0]; tint = tint || p[1]; }
  const i = img(bgPath(id));
  g.globalAlpha = alpha;
  if (i.ok) g.drawImage(i, 0, 0, W, H);
  else { g.fillStyle = '#14162b'; g.fillRect(0, 0, W, H); }
  if (tint) applyTint(g, tint, W, H);
  g.globalAlpha = 1;
}

export function applyTint(g, tint, W, H) {
  const T = {
    night: [['multiply', '#3a4a8a'], ['source-over', 'rgba(10,12,40,.25)']],
    fire: [['multiply', '#c86a4a'], ['screen', 'rgba(120,30,0,.35)']],
    dim: [['source-over', 'rgba(0,0,0,.45)']],
    dark: [['source-over', 'rgba(5,4,10,.5)']],
    dusk: [['multiply', '#c89ab0'], ['source-over', 'rgba(60,20,40,.12)']],
    fog: [['source-over', 'rgba(150,170,150,.28)']],
    past: [['multiply', '#d8b48a'], ['source-over', 'rgba(60,30,0,.12)']],
    void: [['multiply', '#7a5aa8'], ['screen', 'rgba(40,0,80,.3)']],
    dawn: [['screen', 'rgba(255,170,90,.18)']],
  }[tint];
  if (!T) return;
  const prev = g.globalCompositeOperation;
  for (const [op, col] of T) { g.globalCompositeOperation = op; g.fillStyle = col; g.fillRect(0, 0, W, H); }
  g.globalCompositeOperation = prev;
}

export function drawScene() {
  const cv = $('#scene');
  if (!cv) return;
  const g = cv.getContext('2d');
  g.imageSmoothingEnabled = false;
  const W = cv.width, H = cv.height;
  g.save();
  g.clearRect(0, 0, W, H);
  if (scene.fade < 1 && scene.prevBg) drawBg(g, scene.prevBg, scene.prevTint, 1, W, H);
  drawBg(g, scene.bg, scene.tint, scene.prevBg ? scene.fade : 1, W, H);
  if (scene.dim) { g.fillStyle = `rgba(8,6,12,${scene.dim})`; g.fillRect(0, 0, W, H); }
  if (scene.extra) scene.extra(g, W / 320, W, H);   // battle sprites etc. in 320x180 units * k
  g.restore();
}

export function sceneToCanvasUnits() { const cv = $('#scene'); return cv.width / 320; }

// ---------- log ----------
const MAX_LOG = 160;
// After entering a room the log keeps the room's heading in view (read from the top);
// speech, battle lines and the player's own actions scroll to the newest line.
let anchor = null, userScrolled = false, logWired = false;
function settleLog() {
  const log = $('#log');
  if (!log || userScrolled) return;
  if (anchor && anchor.isConnected) log.scrollTop = Math.max(0, anchor.offsetTop - 6);
  else log.scrollTop = log.scrollHeight;
}
function wireLog(log) {
  if (logWired) return; logWired = true;
  const mark = () => { userScrolled = true; };
  log.addEventListener('wheel', mark, { passive: true });
  log.addEventListener('touchmove', mark, { passive: true });
  log.addEventListener('scroll', () => { if (log.scrollHeight - log.scrollTop - log.clientHeight < 8) userScrolled = false; }, { passive: true });
  if (window.ResizeObserver) new ResizeObserver(() => settleLog()).observe(log);
}
function pushLog(node, follow = false) {
  const log = $('#log');
  node.classList.add('new');
  log.append(node);
  while (log.childElementCount > MAX_LOG) log.firstElementChild.remove();
  wireLog(log);
  if (follow) { anchor = null; userScrolled = false; }
  requestAnimationFrame(settleLog);
  return node;
}
export function logHeading(text) { userScrolled = false; const h = pushLog(el('h3', { text })); anchor = h; return h; }
export function logSay(text) {
  const parts = String(text).split(/\n\n+/);
  let last;
  for (const p of parts) last = pushLog(el('p', { html: richText(p) }));
  return last;
}
export function logLine(name, text, portrait, isParty) {
  const c = portraitCanvas(portrait, name, 48);
  return pushLog(el('div', { class: 'speech' + (isParty ? ' party' : '') }, c,
    el('div', {}, el('span', { class: 'who', text: name }), el('p', { html: richText(text) }))), !ui.entering);
}
export function logSys(text, kind = '') { return pushLog(el('p', { class: 'sys ' + kind, text })); }
export function logYou(text) { return pushLog(el('p', { class: 'you', text }), true); }
export function logBattle(html) { return pushLog(el('p', { class: 'battle', html }), true); }
export function logDivider() { return pushLog(el('div', { class: 'divider' })); }
export function clearLog() { $('#log').innerHTML = ''; }

// ---------- speaker overlay ----------
export function showSpeaker(portrait, name) {
  const sp = $('#speaker');
  if (!portrait && !name) { sp.classList.remove('on'); sp.innerHTML = ''; $('#room-label').classList.remove('hidden'); return; }
  sp.innerHTML = '';
  const size = ui.sceneScale >= 2.5 ? 192 : ui.sceneScale >= 1.6 ? 128 : 84;
  const c = portraitCanvas(portrait, name, 96);
  c.style.width = c.style.height = size + 'px';
  sp.append(c, el('span', { class: 'nm', text: name }));
  sp.classList.add('on');
  $('#room-label').classList.add('hidden');
}

// ---------- dock ----------
let dockResolve = null;
export function setTabs(tabs, active, onPick) {
  const t = $('#tabs');
  t.innerHTML = '';
  if (!tabs) { t.classList.add('hidden'); return; }
  t.classList.remove('hidden');
  for (const tab of tabs) {
    const b = el('button', { class: 'tab' + (tab.id === active ? ' on' : ''), 'data-act': 'tab:' + tab.id, 'aria-label': tab.label, onclick: () => { sfx('click'); onPick(tab.id); } });
    b.innerHTML = icon(tab.icon) + `<span>${tab.label}</span>` + (tab.badge ? '<i class="badge"></i>' : '');
    t.append(b);
  }
}
export function dockClear() { $('#dock-body').innerHTML = ''; }
export function dockAdd(node) { $('#dock-body').append(node); return node; }
export function dockLabel(text) { return dockAdd(el('div', { class: 'row-label', text })); }
export function dockPrompt(text) { return dockAdd(el('div', { class: 'prompt', text })); }

export function button(label, act, onclick, cls = '', extra = {}) {
  const b = el('button', { class: 'btn ' + cls, 'data-act': act, type: 'button', ...extra });
  if (typeof label === 'string') b.innerHTML = label; else b.append(label);
  b.addEventListener('click', e => { e.preventDefault(); unlock(); if (b.disabled) return; sfx('click'); onclick(e); });
  return b;
}

// Show choice buttons in the dock and wait for one. options: [{label, act, cls, key}]
// Every pending choice or card, so loading or quitting can cancel them all.
const pending = new Set();
export function cancelPending() {
  for (const p of [...pending]) p();
  pending.clear();
  const card = document.getElementById('card'); card.classList.add('hidden'); card.innerHTML = '';
  dockClear();
}

export function choose(options, { prompt, tabs = false } = {}) {
  return new Promise((res, rej) => {
    setTabs(null);
    dockClear();
    if (prompt) dockPrompt(prompt);
    options.forEach((o, i) => {
      const lbl = `${o.label}`;
      dockAdd(button(lbl, o.act || ('choice:' + i), () => { cleanup(); res(i); }, (o.cls || '') + (options.length === 1 || o.full ? ' full' : ''), o.disabled ? { disabled: true } : {}));
    });
    const keys = e => {
      if (document.querySelector('#modal:not(.hidden), #card:not(.hidden)')) return;
      if (e.target && e.target.tagName === 'INPUT') return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= options.length && !options[n - 1].disabled) { e.preventDefault(); cleanup(); res(n - 1); }
      else if ((e.key === ' ' || e.key === 'Enter') && options.length === 1) { e.preventDefault(); cleanup(); res(0); }
    };
    const cancel = () => { window.removeEventListener('keydown', keys); dockResolve = null; rej(new Abort()); };
    pending.add(cancel);
    const cleanup = () => { window.removeEventListener('keydown', keys); dockResolve = null; pending.delete(cancel); dockClear(); };
    window.addEventListener('keydown', keys);
    dockResolve = i => { cleanup(); res(i); };
  });
}
export function continueBtn(label = 'Continue') {
  return choose([{ label: `${label} ▸`, act: 'continue', cls: 'primary full' }]);
}

// ---------- modal ----------
let modalOnClose = null;
export function openModal(title, build, onClose) {
  $('#modal-title').textContent = title;
  const body = $('#modal-body');
  body.innerHTML = '';
  build(body);
  $('#modal').classList.remove('hidden');
  modalOnClose = onClose || null;
  sfx('menu');
}
export function refreshModal(title, build) {
  const body = $('#modal-body');
  const st = body.scrollTop;
  if (title) $('#modal-title').textContent = title;
  body.innerHTML = '';
  build(body);
  body.scrollTop = st;
}
export function closeModal() {
  if ($('#modal').classList.contains('hidden')) return;
  $('#modal').classList.add('hidden');
  $('#modal-body').innerHTML = '';
  const f = modalOnClose; modalOnClose = null;
  if (f) f();
}
export function modalOpen() { return !$('#modal').classList.contains('hidden'); }

// ---------- full-screen card ----------
export function showCard({ img: bg, tint, kicker, title, text, list, buttons = [{ label: 'Continue ▸', act: 'continue', cls: 'primary' }] }) {
  return new Promise((res, rej) => {
    const card = $('#card');
    card.innerHTML = '';
    if (bg && bg.includes('@')) { const p = bg.split('@'); bg = p[0]; tint = tint || p[1]; }
    if (bg) {
      const c = el('canvas', { width: 640, height: 360 });
      const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
      const isIcon = bg === 'starheart';
      const i = img(isIcon ? iconPath(bg) : bgPath(bg));
      const draw = () => {
        if (isIcon) {
          g.fillStyle = '#07060a'; g.fillRect(0, 0, 640, 360);
          const grd = g.createRadialGradient(320, 180, 10, 320, 180, 170); grd.addColorStop(0, 'rgba(95,180,217,.55)'); grd.addColorStop(1, 'rgba(7,6,10,0)');
          g.fillStyle = grd; g.fillRect(0, 0, 640, 360);
          if (i.ok) g.drawImage(i, 320 - 96, 180 - 96, 192, 192);
        } else drawBg(g, bg, tint, 1, 640, 360);
      };
      draw(); if (!i.ok) i.addEventListener('load', draw, { once: true });
      card.append(c);
    }
    if (kicker) card.append(el('div', { class: 'kicker', text: kicker }));
    if (title) card.append(el('h2', { text: title }));
    if (text || list) {
      const cap = el('div', { class: 'cap' });
      for (const p of String(text || '').split(/\n\n+/)) if (p) cap.append(el('p', { html: richText(p) }));
      if (list) { cap.append(el('h4', { text: list.head })); const ul = el('ul'); for (const x of list.items) ul.append(el('li', { text: x })); cap.append(ul); }
      card.append(cap);
    }
    const row = el('div', { class: 'btns' });
    const keys = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); done(0); } };
    const cancel = () => { window.removeEventListener('keydown', keys); rej(new Abort()); };
    pending.add(cancel);
    const done = i => { window.removeEventListener('keydown', keys); pending.delete(cancel); card.classList.add('hidden'); card.innerHTML = ''; res(i); };
    buttons.forEach((b, i) => row.append(button(b.label, b.act || 'card:' + i, () => done(i), b.cls || '')));
    card.append(row);
    card.classList.remove('hidden');
    setTimeout(() => window.addEventListener('keydown', keys), 300);
  });
}

// ---------- toasts ----------
export function toast(text) {
  const t = el('div', { class: 'toast', text });
  $('#toasts').append(t);
  setTimeout(() => t.remove(), 2700);
}

export function shake() {
  const w = $('#scene-wrap');
  w.classList.remove('shake'); void w.offsetWidth; w.classList.add('shake');
}

// floating numbers over the scene, x/y in 320x180 units
export function popNumber(x, y, text, cls = '', tagText = '') {
  const fx = $('#scene-fx');
  const k = ui.sceneScale;
  const d = el('div', { class: 'dmg ' + cls, style: { left: (x * k) + 'px', top: (y * k) + 'px' } });
  if (tagText) d.append(el('span', { class: 'tagw', text: tagText }));
  d.append(document.createTextNode(text));
  fx.append(d);
  setTimeout(() => d.remove(), 1000);
}

export { sleep };
