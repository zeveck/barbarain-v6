// Shops: buy and sell with comparisons and a one-tap junk sale.
import { R, S } from './state.js';
import * as U from './ui.js';
import { el } from './util.js';
import { sfx } from './audio.js';
import { itemDef, itemName, statLine, canEquip, giveItem, takeItem } from './items.js';
import { stats, memberName } from './party.js';

const SH = { tab: 'buy', sel: null };

export function openShop(id) {
  const shop = R.shops[id];
  if (!shop) { console.error('no shop', id); return Promise.resolve(); }
  SH.tab = 'buy'; SH.sel = null;
  return new Promise(res => {
    U.openModal(shop.name, body => build(body, shop), () => { res(); import('./world.js').then(w => { w.updateTop(); }); });
  });
}

function deltasFor(id) {
  const it = itemDef(id);
  const box = el('div', { class: 'deltas' });
  if (!['weapon', 'body', 'head', 'offhand', 'trinket'].includes(it.type)) return box;
  let any = false;
  for (const m of S.party) {
    if (!canEquip(m, id, it.type)) continue;
    any = true;
    const a = stats(m), b = stats(m, { slot: it.type, item: id });
    const d = it.type === 'weapon' ? b.atk - a.atk : (b.def - a.def) + (b.res - a.res) + (b.agi - a.agi) + (b.str - a.str) + (b.wil - a.wil);
    box.append(el('span', { class: d > 0 ? 'up' : d < 0 ? 'down' : 'same' }, `${memberName(m)} ${d > 0 ? '+' : ''}${d}`));
  }
  if (!any) box.append(el('span', { class: 'same', text: 'no one in your party can use it' }));
  return box;
}

function build(body, shop) {
  const keeper = shop.keeper && R.npcs[shop.keeper];
  if (shop.greet) body.append(el('p', { text: shop.greet }));
  body.append(el('div', { class: 'seg' },
    el('button', { class: SH.tab === 'buy' ? 'on' : '', 'data-act': 'shop:tab:buy', text: 'Buy', onclick: () => { SH.tab = 'buy'; SH.sel = null; U.refreshModal(null, b => build(b, shop)); } }),
    el('button', { class: SH.tab === 'sell' ? 'on' : '', 'data-act': 'shop:tab:sell', text: 'Sell', onclick: () => { SH.tab = 'sell'; SH.sel = null; U.refreshModal(null, b => build(b, shop)); } }),
    el('span', { style: { marginLeft: 'auto', alignSelf: 'center', color: 'var(--gold-l)' }, text: `${S.gold} gold` })));
  const list = el('div', { class: 'list' });
  if (SH.tab === 'buy') {
    for (const id of shop.items) {
      const it = itemDef(id); if (!it) continue;
      const price = it.price || 1;
      const owned = S.inv[id] || 0;
      const row = el('div', { class: 'row', style: { cursor: 'default', flexWrap: 'wrap' } },
        U.iconCanvas(it.icon || 'key', 32),
        el('div', { class: 'main' }, el('div', { class: 't' }, el('b', { text: it.name }), owned ? el('span', { class: 'n', text: `have ${owned}` }) : null),
          el('div', { class: 'd', text: statLine(id) }), deltasFor(id)),
        el('div', { class: 'side' }, `${price}g`));
      const buy = (n) => {
        const cost = price * n;
        if (S.gold < cost) { U.toast('Not enough gold'); sfx('refuse'); return; }
        const go = () => { S.gold -= cost; giveItem(id, n, true); sfx('coins'); U.toast(`Bought ${it.name}${n > 1 ? ' ×' + n : ''}`); U.refreshModal(null, b => build(b, shop)); };
        if (cost > 200 && SH.confirm !== id) { SH.confirm = id; U.toast(`Tap again to buy for ${cost} gold`); return; }
        SH.confirm = null; go();
      };
      const acts = el('div', { class: 'actions', style: { flexBasis: '100%' } },
        U.button(`Buy · ${price}g`, 'shop:buy:' + id, () => buy(1), S.gold >= price ? 'primary' : '', S.gold < price ? { disabled: true } : {}));
      if (it.type === 'consumable') acts.append(U.button(`×5 · ${price * 5}g`, 'shop:buy5:' + id, () => buy(5), '', S.gold < price * 5 ? { disabled: true } : {}));
      row.append(acts);
      list.append(row);
    }
  } else {
    const ids = Object.keys(S.inv).filter(id => S.inv[id] > 0 && itemDef(id) && itemDef(id).type !== 'key' && itemDef(id).price);
    const junk = ids.filter(id => itemDef(id).type === 'junk');
    if (junk.length) {
      const total = junk.reduce((a, id) => a + Math.floor(itemDef(id).price / 2) * S.inv[id], 0);
      body.append(el('div', { class: 'actions' }, U.button(`Sell all junk · ${total}g`, 'sell-junk', () => {
        for (const id of junk) { S.gold += Math.floor(itemDef(id).price / 2) * S.inv[id]; takeItem(id, S.inv[id], true); }
        sfx('coins'); U.toast(`Sold junk for ${total} gold`); U.refreshModal(null, b => build(b, shop));
      }, 'primary')));
    }
    if (!ids.length) list.append(el('p', { text: 'You have nothing to sell. (Equipped gear must be taken off first.)' }));
    ids.sort((a, b) => (itemDef(a).type === 'junk' ? 0 : 1) - (itemDef(b).type === 'junk' ? 0 : 1) || itemName(a).localeCompare(itemName(b)));
    for (const id of ids) {
      const it = itemDef(id); const p = Math.floor(it.price / 2);
      list.append(el('div', { class: 'row' + (it.type === 'junk' ? ' junk' : ''), style: { cursor: 'default' } },
        U.iconCanvas(it.icon || 'key', 32),
        el('div', { class: 'main' }, el('div', { class: 't' }, el('b', { text: it.name }), S.inv[id] > 1 ? el('span', { class: 'n', text: '×' + S.inv[id] }) : null), el('div', { class: 'd', text: statLine(id) || it.desc || '' })),
        U.button(`Sell · ${p}g`, 'shop:sell:' + id, () => { S.gold += p; takeItem(id, 1, true); sfx('coins'); U.refreshModal(null, b => build(b, shop)); })));
    }
  }
  body.append(list);
  body.append(el('div', { class: 'actions', style: { marginTop: '12px' } }, U.button('Leave the shop', 'shop:close', () => U.closeModal(), 'ghost')));
}
