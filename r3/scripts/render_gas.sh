#!/bin/bash
# Полный рендер версии B и сведение со звуком версии A: bash scripts/render_gas.sh [concurrency=3]
set -e; cd "$(dirname "$0")/.."
CH=${CHROME:-/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell}
mkdir -p out/gas
START=$(date +%s)
npx remotion render src/index.ts GasShort out/gas/video.mp4 --gl=swangle --browser-executable="$CH" --concurrency=${1:-3} \
  --codec=h264 --crf=16 --timeout=300000 --log=info 2>&1 | grep -v "fallback to software" | tail -5 > out/gas/render.log
echo "рендер: $(( ($(date +%s) - START) / 60 )) мин" >> out/gas/render.log
ffmpeg -y -v error -i out/gas/video.mp4 -i ../build/s03c_shutter/audio.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart ../out/s03c_shutter_B.mp4
cat out/gas/render.log; ls -la ../out/s03c_shutter_B.mp4
