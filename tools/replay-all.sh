#!/bin/bash
# Replay every solution file, 4 sessions in parallel. Output: design/solutions/RESULTS.txt
cd "$(dirname "$0")/.."
run() { local f=$1 s=$2; playwright-cli -s=$s open http://127.0.0.1:8124/ >/dev/null 2>&1; playwright-cli -s=$s resize 1280 720 >/dev/null 2>&1; echo "== $(basename $f)"; tools/replay.sh $s $f; playwright-cli -s=$s close >/dev/null 2>&1; }
i=0; for f in design/solutions/*.json; do s="rp$((i%4))"; run $f $s > ${TMPDIR:-/tmp}/replay-$(basename $f).log 2>&1 & i=$((i+1)); if (( i % 4 == 0 )); then wait; fi; done; wait
cat ${TMPDIR:-/tmp}/replay-*.log > design/solutions/RESULTS.txt; rm -f ${TMPDIR:-/tmp}/replay-*.log; cat design/solutions/RESULTS.txt
