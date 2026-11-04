#!/bin/bash
# Usage: tools/pw.sh SESSION act1 act2 ...  — clicks buttons by data-act in order (real clicks), prints state.
S=$1; shift
ACTS=$(printf '"%s",' "$@"); ACTS="[${ACTS%,}]"
playwright-cli -s=$S run-code "async page => {
  const out = [];
  for (const a of $ACTS) {
    if (a.startsWith('wait:')) { await page.waitForTimeout(+a.slice(5)); continue; }
    if (a.startsWith('key:')) { await page.keyboard.press(a.slice(4)); await page.waitForTimeout(250); continue; }
    const loc = page.locator('[data-act=\"' + a + '\"]:visible').first();
    try { await loc.click({ timeout: 4000 }); out.push('ok ' + a); } catch (e) { out.push('MISS ' + a + ' have: ' + JSON.stringify(await page.evaluate(() => window.__game.buttons().map(b => b.act)))); break; }
    await page.waitForTimeout(350);
  }
  const st = await page.evaluate(() => window.__game.state());
  return out.join('\n') + '\n' + JSON.stringify({room: st.room, screen: st.screen, gold: st.gold, party: st.party, inv: st.inv, battle: st.battle && st.battle.enemies.map(e=>e.hp), busy: st.busy, card: st.card, modal: st.modal});
}" 2>&1 | sed -n '/### Result/,/### Ran/p' | sed '1d;$d'
