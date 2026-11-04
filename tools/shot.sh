#!/bin/bash
# tools/shot.sh NAME CHAPTER BRANCH ROOM  -> media/screenshots/NAME.png (1280x720), after battles settle
N=$1; CH=$2; BR=${3:-null}; ROOM=$4; S=sh$N
playwright-cli -s=$S open http://127.0.0.1:8124/ >/dev/null 2>&1; playwright-cli -s=$S resize 1280 720 >/dev/null
playwright-cli -s=$S run-code "async page => {
  await page.waitForTimeout(2500);
  await page.evaluate(([c, b]) => { window.__game.B.speed = 99; window.__game.battlePolicy('auto'); window.__game.chapter(c, b); }, [$CH, $BR]);
  const settle = async () => { for (let i = 0; i < 120; i++) { const a = await page.evaluate(() => window.__game.acts()); const s = await page.evaluate(() => window.__game.state());
      if (a.includes('continue')) { await page.locator('[data-act=continue]:visible').first().click().catch(() => {}); await page.waitForTimeout(250); continue; }
      if (s.screen === 'game' && !s.busy && a.includes('look')) return; await page.waitForTimeout(500); } };
  await page.waitForTimeout(1500); await settle();
  if ('$ROOM') { await page.evaluate(r => { window.__game.goto(r); }, '$ROOM'); await page.waitForTimeout(1500); await settle(); }
  await page.evaluate(() => window.__game.battlePolicy('manual'));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'media/screenshots/$N.png' });
  return 'ok';
}" >/dev/null 2>&1
playwright-cli -s=$S close >/dev/null 2>&1
