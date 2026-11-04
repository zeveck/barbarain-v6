#!/bin/bash
# tools/scan.sh SESSION  -> runs the gamegen text scanner on the current screen
# Set GAMEGEN_SKILL_DIR to gamegen's skill folder (it holds scripts/scan-text.js).
SCAN="${GAMEGEN_SKILL_DIR:?set GAMEGEN_SKILL_DIR to the gamegen skill folder}/scripts/scan-text.js"
playwright-cli -s=$1 run-code "async page => { await page.addScriptTag({ path: '$SCAN' }); return JSON.stringify(await page.evaluate(() => window.__scanText())); }" 2>&1 | sed -n '/### Result/,/### Ran/p' | sed '1d;$d'
