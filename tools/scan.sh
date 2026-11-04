#!/bin/bash
# tools/scan.sh SESSION  -> runs the gamegen text scanner on the current screen
playwright-cli -s=$1 run-code "async page => { await page.addScriptTag({ path: '/home/vscode/.claude/plugins/cache/gamegen/gamegen/2026.11.3.4/gamegen/scripts/scan-text.js' }); return JSON.stringify(await page.evaluate(() => window.__scanText())); }" 2>&1 | sed -n '/### Result/,/### Ran/p' | sed '1d;$d'
