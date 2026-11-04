#!/bin/bash
# Replay a solution file with real clicks in a playwright-cli session.
#   tools/replay.sh SESSION design/solutions/ch1.json
# The session must already be open on the game (playwright-cli -s=SESSION open http://127.0.0.1:8123/).
# Steps click [data-act=...] elements. While waiting for a step, "continue" buttons are clicked
# automatically (dialogue and cards), battles run with the auto policy, and a defeat is retried.
S=$1; SOL=$2
JSON=$(cat "$SOL")
playwright-cli -s=$S run-code "async page => {
  const sol = $JSON;
  const log = [];
  const st = sol.start || {};
  await page.evaluate(() => { try { localStorage.removeItem('barbarain.v1.slot.auto'); } catch (e) {} });
  await page.reload(); await page.waitForTimeout(1500);
  if (st.newGame) {
    for (const a of ['title:start', 'title:new']) { const l = page.locator('[data-act=\"' + a + '\"]:visible').first(); await l.click({ timeout: 8000 }); await page.waitForTimeout(300); }
  } else {
    await page.evaluate(([n, b, s]) => { window.__game.chapter(n, b, s); }, [st.chapter || 1, st.branch || null, st.seed || 1234]);
  }
  await page.waitForTimeout(500);
  if ((sol.battle || 'auto') === 'auto') await page.evaluate(() => window.__game.battlePolicy('auto'));
  if (!sol.realtime) await page.evaluate(() => { window.__game.B.speed = 99; });
  const acts = () => page.evaluate(() => window.__game.acts());
  const click = async a => { const l = page.locator('[data-act=\"' + a.replace(/\"/g, '\\\\\"') + '\"]:visible').first(); await l.click({ timeout: 5000 }); };
  let retries = 0;
  for (const [i, step] of sol.steps.entries()) {
    const t0 = Date.now(); let done = false;
    while (Date.now() - t0 < (sol.stepTimeout || 90000)) {
      const a = await acts();
      try {
        if (a.includes(step)) { await click(step); done = true; break; }
        if (a.includes('retry')) { retries++; if (retries > 5) break; await click('retry'); continue; }
        if (a.includes('continue')) { await click('continue'); await page.waitForTimeout(120); continue; }
      } catch (e) { log.push('click failed (' + step + '): ' + String(e.message).split('\\n')[0]); }
      await page.waitForTimeout(200);
    }
    if (!done) {
      const s = await page.evaluate(() => window.__game.state());
      log.push('STUCK at step ' + i + ' \"' + step + '\" in room ' + s.room + '; visible: ' + JSON.stringify(await acts()));
      return log.join('\\n');
    }
    await page.waitForTimeout(sol.stepDelay || 150);
  }
  // wait for a trailing battle or script to finish
  for (let k = 0; k < 600; k++) { const s = await page.evaluate(() => window.__game.state()); if (s.screen !== 'battle' && !s.busy) break; const a = await acts(); if (a.includes('retry')) { retries++; await click('retry'); } await page.waitForTimeout(500); }
  // drain trailing continues
  for (let k = 0; k < 40; k++) { const a = await acts(); if (a.includes('continue')) { await click('continue'); await page.waitForTimeout(150); } else { await page.waitForTimeout(250); if (!(await acts()).includes('continue')) break; } }
  const res = await page.evaluate(exp => { const g = window.__game; return { state: g.state(), expect: exp.map(c => [c, g.check(c)]), errors: g.errors() }; }, sol.expect || []);
  const failed = res.expect.filter(([, ok]) => !ok);
  log.push((failed.length ? 'FAIL ' : 'PASS ') + 'room=' + res.state.room + ' level=' + (res.state.party[0] || {}).level + ' gold=' + res.state.gold + ' retries=' + retries);
  for (const [c, ok] of res.expect) log.push((ok ? '  ok   ' : '  FAIL ') + c);
  if (res.errors.length) log.push('battle errors: ' + JSON.stringify(res.errors));
  return log.join('\\n');
}" 2>&1 | sed -n '/### Result/,/### Ran/p' | sed '1d;$d' | sed 's/\\n/\n/g'
