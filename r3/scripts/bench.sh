#!/bin/bash
# Замер скорости рендера версии B: bash scripts/bench.sh '<json post>' [кадры=700-705] [concurrency=1]
cd "$(dirname "$0")/.."
CH=${CHROME:-/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell}
S=$(date +%s)
npx remotion render src/index.ts GasShort out/gas/bench.mp4 --gl=swangle --browser-executable="$CH" --concurrency=${3:-1} --frames=${2:-700-705} \
  --codec=h264 --crf=16 --timeout=600000 --props="{\"post\":$1}" > /dev/null 2>&1
echo "$1 кадры ${2:-700-705} c${3:-1}: $(( $(date +%s) - S )) с"
