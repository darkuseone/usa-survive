#!/usr/bin/env bash
# Обзор эпизода по планам: один кадр из каждого плана (доля FR длительности, по умолч. 0.6) листами 3×3 по 640 px → build/<эп>/review/sheet_NN.jpg
#   tools/review.sh <эп> [FR] [от_сек] [до_сек]
set -euo pipefail; cd "$(dirname "$0")/.."; EP=$1; FR=${2:-0.6}; A=${3:-0}; B=${4:-99999}; D=build/$EP/review
python3 tools/mkpage.py "$EP" >/dev/null; node tools/cues.cjs build/$EP/film > build/$EP/cues.json; rm -rf "$D"; mkdir -p "$D"
python3 - "$EP" "$FR" "$A" "$B" > "$D/times.txt" <<'PY'
import json,sys
ep,fr,a,b=sys.argv[1],float(sys.argv[2]),float(sys.argv[3]),float(sys.argv[4]); c=json.load(open(f'build/{ep}/cues.json'))
ts=[(n,t0+(min(t1,c['DUR'])-t0)*fr) for n,t0,t1 in c['SC'] if t0<c['DUR'] and a<=t0<=b]
for i in range(0,len(ts),9): print(' '.join(f'{t:.2f}' for n,t in ts[i:i+9])+' #'+' '.join(n for n,t in ts[i:i+9]))
PY
i=0; while IFS= read -r line; do T=${line%%#*}; N=${line##*#}; SHEET_COLS=3 SHEET_TW=640 node tools/shot.cjs build/$EP/film "$D/s$i" $T | tail -1; mv "$D/s$i/sheet.jpg" "$D/sheet_$(printf %02d $i).jpg"; echo "sheet_$(printf %02d $i): $N"; i=$((i+1)); done < "$D/times.txt"
