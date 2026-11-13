// "Report a bug": the gh-feedback form (vendor/gh-feedback.js), opened from the
// Menu and Settings, or with Ctrl+Shift+F (set up in index.html).
// It files a GitHub issue in the game's repo from the player's own account.
export const fb = document.getElementById('report');

// Shown when the game has a repo (feedback: on).
const FEEDBACK = 'on';
const KEY = 'barbarain.v1.feedback';
const q = new URLSearchParams(location.search);
if (q.has('feedback')) {
  try {
    if (q.get('feedback') === 'off') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, '1');
  } catch {}
}
export const showReport = () => !!fb?.getAttribute('repo') &&
  (FEEDBACK === 'on' || (() => { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } })());

export function openReport() { fb?.open(); }

// While the form is open (focus is in it), the game ignores every key and touch.
export const reportOpen = () => !!fb && document.activeElement === fb;
export const reportBlocks = e => !!fb && (!!e?.composedPath?.().includes(fb) || reportOpen());

// The picture of the moment: the scene as it was when the game paused (the
// Menu or Settings opened over it), cleared when the game resumes.
let pauseShot = null;
const scene = () => document.getElementById('scene');
const inGame = () => document.getElementById('game')?.classList.contains('on');
export function snapshot() { if (inGame()) pauseShot = new Promise(r => scene().toBlob(r, 'image/png')); }
export function clearShot() { pauseShot = null; }

// The last few errors, for the report.
const errors = [];
const keep = m => { errors.push(String(m).replace(/\s+/g, ' ').slice(0, 200)); errors.splice(0, errors.length - 5); };
addEventListener('error', e => keep(e.message));
addEventListener('unhandledrejection', e => keep(e.reason?.message ?? e.reason));
const flat = v => String(v).replace(/\s+/g, ' ');

function stateLine() {
  const s = window.__game?.state?.();
  if (!s) return '';
  if (s.screen === 'title') return 'title screen';
  const party = (s.party || []).map(p => `${p.id} L${p.level} ${p.hp}hp ${p.mp}mp`).join(', ');
  const b = s.battle ? ` · battle round ${s.battle.round}: ${s.battle.enemies.filter(e => !e.dead).map(e => `${e.name} ${e.hp}hp`).join(', ')}` : '';
  return `${s.screen} · ${s.chapter} · ${s.roomName || ''} (${s.room}) · gold ${s.gold} · party ${party}${b}${s.card ? ' · story card' : ''}${s.busy ? ' · busy' : ''}`;
}

if (fb) {
  // On the title there's no scene in play, so no picture.
  fb.getScreenshot = () => pauseShot ?? (inGame() ? new Promise(r => scene().toBlob(r, 'image/png')) : null);
  fb.getContext = () => ({
    game: 'BarbarAIn',
    address: location.origin + location.pathname,
    updated: document.lastModified,
    build: window.desktop ? `desktop app (${window.desktop.platform})` : 'web',
    browser: navigator.userAgent,
    screen: `${innerWidth}x${innerHeight} @${devicePixelRatio}x`,
    input: matchMedia('(pointer: coarse)').matches ? 'touch' : 'mouse and keyboard',
    state: flat(stateLine()).slice(0, 400),
    errors: errors.join(' | ') || 'none',
  });
  if (window.desktop) fb.openLink = url => { window.open(url, '_blank'); return true; };
}
