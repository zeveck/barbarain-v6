// Web Audio: music with a self-crossfade at the loop point, an ambience layer,
// overlapping sound effects with synthesized fallbacks, and mute settings.
const MUSIC_DIR = 'assets/audio/music/';
const SFX_DIR = 'assets/audio/sfx/';
const XFADE = 2.0;          // seconds of crossfade at each music loop
const AMB_XFADE = 0.4;

let ctx = null, musicGain = null, sfxGain = null, ambGain = null, master = null;
const buffers = new Map();       // url -> Promise<AudioBuffer|null>
let current = null;              // { id, timer, voices: [{src,gain}] }
let amb = null;                  // { id, voices }
let wanted = null, wantedAmb = null;
let settings = { music: true, sfx: true, musicVol: 0.5, sfxVol: 0.8, ambVol: 0.35 };
let ducked = false;

// Ids the engine and content use (the asset list's canonical names). Old names map onto them.
const ALIAS = { click: 'ui-click', menu: 'menu-open', step: 'footsteps', levelup: 'level-up', item: 'item-get', solve: 'sting-solved', victory: 'sting-victory', gameover: 'sting-gameover', status: 'status-tick', save: 'save-chime' };
// Sounds that are only ever synthesized (no file is generated for them).
// Per-file loudness fixes (some generated files came out soft).
const VOL = { drink: 1.7, refuse: 1.6, star: 1.7, holy: 1.6, pierce: 1.3 };
const SYNTH_ONLY = new Set(['ui-click', 'menu-open', 'equip', 'footsteps', 'save-chime', 'defend', 'status-tick', 'miss', 'coins', 'flee']);

export function audioInit(saved) { Object.assign(settings, saved || {}); }

export function unlock() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.connect(ctx.destination);
    musicGain = ctx.createGain(); musicGain.connect(master);
    ambGain = ctx.createGain(); ambGain.connect(master);
    sfxGain = ctx.createGain(); sfxGain.connect(master);
    applyVolumes();
    if (wanted) { const w = wanted; wanted = null; playMusic(w); }
    if (wantedAmb) { const w = wantedAmb; wantedAmb = null; playAmb(w); }
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
}

function applyVolumes() {
  if (!ctx) return;
  const t = ctx.currentTime;
  musicGain.gain.setTargetAtTime(settings.music ? settings.musicVol * (ducked ? 0.35 : 1) : 0, t, 0.08);
  ambGain.gain.setTargetAtTime(settings.music ? settings.ambVol * (ducked ? 0.5 : 1) : 0, t, 0.08);
  sfxGain.gain.setTargetAtTime(settings.sfx ? settings.sfxVol : 0, t, 0.02);
}

function load(url) {
  if (!buffers.has(url)) {
    buffers.set(url, fetch(url)
      .then(r => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(r.status))))
      .then(ab => new Promise((res, rej) => ctx.decodeAudioData(ab, res, rej)))
      .catch(() => null));
  }
  return buffers.get(url);
}

export function preload(ids, kind = 'sfx') {
  if (!ctx) return;
  for (let id of ids) { id = ALIAS[id] || id; if (kind === 'sfx' && SYNTH_ONLY.has(id)) continue; load((kind === 'sfx' ? SFX_DIR : MUSIC_DIR) + id + '.mp3'); }
}

// Trim leading/trailing near-silence (mp3 encoder padding) so loops don't gap.
function trimPoints(buf) {
  const d = buf.getChannelData(0), n = d.length, th = 0.004;
  let a = 0, b = n - 1;
  while (a < n && Math.abs(d[a]) < th) a++;
  while (b > a && Math.abs(d[b]) < th) b--;
  return { start: a / buf.sampleRate, end: (b + 1) / buf.sampleRate };
}

// ---------- music (self-crossfading loop) ----------
export async function playMusic(id) {
  if (!ctx) { wanted = id; return; }
  if (current && current.id === id) return;
  const old = current;
  current = id ? { id, voices: [], timer: null } : null;
  if (old) stopLoop(old, 1.2);
  if (!id) return;
  const mine = current;
  const buf = await load(MUSIC_DIR + id + '.mp3');
  if (!buf || current !== mine) return;
  startLoopVoice(mine, buf, musicGain, XFADE, true);
}

function startLoopVoice(holder, buf, out, xf, first) {
  const { start, end } = buf.__trim || (buf.__trim = trimPoints(buf));
  const len = end - start;
  const g = ctx.createGain(); g.connect(out);
  const src = ctx.createBufferSource(); src.buffer = buf; src.connect(g);
  const t0 = ctx.currentTime + 0.02;
  const fadeIn = first ? 0.6 : xf;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(1, t0 + fadeIn);
  src.start(t0, start);
  const voice = { src, gain: g };
  holder.voices.push(voice);
  const xfUse = Math.min(xf, len / 3);
  const next = (len - xfUse) * 1000;
  holder.timer = setTimeout(() => {
    if (!holder.voices.includes(voice)) return;
    // fade this voice out while the next starts
    const t = ctx.currentTime;
    g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(0, t + xfUse);
    setTimeout(() => { try { src.stop(); } catch (e) {} holder.voices = holder.voices.filter(v => v !== voice); }, xfUse * 1000 + 200);
    startLoopVoice(holder, buf, out, xfUse, false);
  }, Math.max(500, next));
}

function stopLoop(holder, fade = 1) {
  clearTimeout(holder.timer);
  holder.dead = true;
  if (!ctx) return;
  const t = ctx.currentTime;
  for (const v of holder.voices) {
    v.gain.gain.cancelScheduledValues(t); v.gain.gain.setValueAtTime(v.gain.gain.value, t); v.gain.gain.linearRampToValueAtTime(0, t + fade);
    const s = v.src; setTimeout(() => { try { s.stop(); } catch (e) {} }, fade * 1000 + 100);
  }
  holder.voices = [];
}

export function musicId() { return current ? current.id : wanted; }

// ---------- ambience ----------
export async function playAmb(id) {
  if (!ctx) { wantedAmb = id; return; }
  if ((amb && amb.id) === (id || null)) return;
  if (amb) stopLoop(amb, 0.8);
  amb = id ? { id, voices: [], timer: null } : null;
  if (!id) return;
  const mine = amb;
  const buf = await load(SFX_DIR + id + '.mp3');
  if (!buf || amb !== mine) return;
  startLoopVoice(mine, buf, ambGain, AMB_XFADE, true);
}

// ---------- sound effects ----------
const lastPlayed = new Map();
export async function sfx(id, { vol = 1, rate = 1 } = {}) {
  if (!ctx || !settings.sfx || !id) return;
  id = ALIAS[id] || id;
  const now = performance.now();
  if (now - (lastPlayed.get(id) || 0) < 45) return;
  lastPlayed.set(id, now);
  if (SYNTH_ONLY.has(id)) return synth(id, vol);
  const buf = await load(SFX_DIR + id + '.mp3');
  if (!buf) return synth(id, vol);
  const g = ctx.createGain(); g.gain.value = vol * (VOL[id] || 1); g.connect(sfxGain);
  const src = ctx.createBufferSource(); src.buffer = buf; src.playbackRate.value = rate; src.connect(g);
  src.start();
}

// Small recipes: noise bursts for hits, pitched sweeps for spells and chimes.
function noise(dur) {
  const b = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return b;
}
function env(g, t, a, peak, dec) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec);
}
function tone(type, f0, f1, dur, peak = 0.25, delay = 0) {
  const t = ctx.currentTime + delay;
  const o = ctx.createOscillator(); o.type = type;
  o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  const g = ctx.createGain(); env(g, t, 0.005, peak, dur); o.connect(g); g.connect(sfxGain);
  o.start(t); o.stop(t + dur + 0.05);
}
function burst(dur, freq, q = 1, peak = 0.4, type = 'lowpass', delay = 0) {
  const t = ctx.currentTime + delay;
  const s = ctx.createBufferSource(); s.buffer = noise(dur + 0.05);
  const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
  const g = ctx.createGain(); env(g, t, 0.004, peak, dur);
  s.connect(f); f.connect(g); g.connect(sfxGain); s.start(t); s.stop(t + dur + 0.05);
}
const RECIPES = {
  'ui-click': () => tone('square', 900, 700, 0.04, 0.06),
  'menu-open': () => { tone('triangle', 500, 800, 0.08, 0.1); tone('triangle', 800, 1000, 0.08, 0.06, 0.05); },
  equip: () => { burst(0.08, 3000, 4, 0.2, 'bandpass'); tone('square', 220, 180, 0.06, 0.06, 0.03); },
  footsteps: () => { burst(0.05, 500, 1, 0.12); burst(0.05, 420, 1, 0.1, 'lowpass', 0.16); },
  'save-chime': () => { tone('sine', 660, 660, 0.25, 0.15); tone('sine', 990, 990, 0.35, 0.12, 0.12); },
  defend: () => { burst(0.12, 1800, 6, 0.2, 'bandpass'); tone('triangle', 300, 260, 0.2, 0.12); },
  'status-tick': () => tone('sine', 300, 180, 0.15, 0.12),
  miss: () => burst(0.18, 1200, 0.7, 0.18, 'highpass'),
  coins: () => { for (let i = 0; i < 4; i++) tone('triangle', 2200 + i * 230, 2000 + i * 200, 0.08, 0.08, i * 0.05); },
  flee: () => { for (let i = 0; i < 5; i++) burst(0.04, 600, 1, 0.12, 'lowpass', i * 0.06); },
  slash: () => burst(0.18, 2500, 0.8, 0.35, 'highpass'),
  pierce: () => { burst(0.08, 3000, 2, 0.3, 'bandpass'); tone('sawtooth', 600, 200, 0.08, 0.08); },
  blunt: () => { burst(0.14, 300, 1, 0.5); tone('sine', 120, 50, 0.18, 0.4); },
  crit: () => { burst(0.2, 2000, 0.8, 0.4, 'highpass'); tone('sine', 140, 40, 0.3, 0.45); },
  'enemy-die': () => { tone('sawtooth', 300, 40, 0.5, 0.15); burst(0.4, 400, 1, 0.2); },
  hurt: () => { burst(0.12, 700, 1, 0.35); tone('square', 200, 90, 0.15, 0.1); },
  bite: () => { burst(0.06, 1500, 2, 0.3, 'bandpass'); burst(0.06, 1200, 2, 0.3, 'bandpass', 0.07); },
  fire: () => burst(0.5, 900, 0.5, 0.35),
  lightning: () => { burst(0.3, 4000, 0.5, 0.35, 'highpass'); tone('sawtooth', 1200, 60, 0.3, 0.12); },
  cold: () => { for (let i = 0; i < 5; i++) tone('sine', 1800 + i * 300, 2400 + i * 300, 0.25, 0.05, i * 0.04); },
  holy: () => { tone('sine', 523, 523, 0.6, 0.12); tone('sine', 659, 659, 0.6, 0.1, 0.08); tone('sine', 784, 784, 0.7, 0.1, 0.16); },
  star: () => { tone('triangle', 400, 1600, 0.4, 0.15); tone('sine', 1600, 3200, 0.3, 0.06, 0.15); },
  heal: () => { tone('sine', 440, 880, 0.35, 0.12); tone('sine', 660, 1320, 0.35, 0.08, 0.1); },
  buff: () => { tone('triangle', 330, 660, 0.25, 0.12); tone('triangle', 495, 990, 0.25, 0.1, 0.1); },
  debuff: () => tone('triangle', 500, 160, 0.4, 0.12),
  steal: () => { burst(0.05, 2500, 3, 0.15, 'bandpass'); tone('triangle', 1800, 2400, 0.08, 0.08, 0.05); },
  drink: () => { for (let i = 0; i < 3; i++) tone('sine', 300 + i * 40, 200, 0.08, 0.1, i * 0.1); },
  summon: () => { tone('sawtooth', 80, 160, 0.8, 0.12); burst(0.8, 500, 1, 0.12); },
  rumble: () => { burst(1.6, 120, 1, 0.5); tone('sine', 50, 35, 1.6, 0.3); },
  'gate-open': () => { tone('sine', 110, 440, 1.6, 0.15); tone('triangle', 220, 880, 1.6, 0.08, 0.2); burst(1.4, 1200, 0.5, 0.1); },
  heartbeat: () => { tone('sine', 70, 45, 0.15, 0.4); tone('sine', 70, 45, 0.15, 0.3, 0.25); },
  roar: () => { burst(0.9, 350, 0.8, 0.45); tone('sawtooth', 110, 60, 0.9, 0.15); },
  'dragon-roar': () => { burst(1.6, 260, 0.8, 0.55); tone('sawtooth', 90, 40, 1.6, 0.2); tone('sawtooth', 135, 60, 1.4, 0.12); },
  'level-up': () => { [523, 659, 784, 1046].forEach((f, i) => tone('square', f, f, 0.12, 0.08, i * 0.08)); },
  'item-get': () => { tone('square', 784, 784, 0.07, 0.08); tone('square', 1046, 1046, 0.12, 0.08, 0.07); },
  door: () => { burst(0.4, 220, 3, 0.25, 'bandpass'); tone('sawtooth', 90, 70, 0.4, 0.06); },
  refuse: () => { tone('sine', 140, 90, 0.18, 0.3); burst(0.08, 300, 1, 0.2); },
  'battle-start': () => { tone('sine', 90, 40, 0.4, 0.5); burst(0.25, 200, 1, 0.4); },
  'sting-victory': () => { [392, 523, 659, 784].forEach((f, i) => tone('square', f, f, i === 3 ? 0.5 : 0.12, 0.08, i * 0.12)); },
  'sting-gameover': () => { tone('sine', 110, 55, 2.5, 0.35); burst(1.5, 300, 1, 0.15); },
  'sting-solved': () => { tone('triangle', 784, 784, 0.12, 0.12); tone('triangle', 1175, 1175, 0.4, 0.12, 0.1); },
};
function synth(id, vol) {
  const r = RECIPES[id];
  if (r) { try { r(); } catch (e) {} }
}

export function setDuck(on) { ducked = on; applyVolumes(); }
export function setAudio(patch) { Object.assign(settings, patch); applyVolumes(); return settings; }
export function audioSettings() { return { ...settings }; }
export function suspend() { if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {}); }
export function resume() { if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {}); }
export function audioState() {
  return { context: ctx ? ctx.state : 'none', music: current ? current.id : null, amb: amb ? amb.id : null, musicMuted: !settings.music, sfxMuted: !settings.sfx };
}
