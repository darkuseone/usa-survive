#!/bin/bash
# Полный рендер версии B кусками (готовые пропускаются) и сведение со звуком версии A.
#   bash scripts/render_gas.sh            — 3D в 540p без MSAA (надписи 1080p), 2 вкладки: ~10 с/кадр на 4 ядрах без GPU
#   PROPS='{"post":{}}' bash scripts/render_gas.sh  — полное качество (≈75 с/кадр на 4 ядрах без GPU)
set -e; cd "$(dirname "$0")/.."
CH=${CHROME:-/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell}
PROPS=${PROPS:-'{"post":{"dpr":0.5,"msaa":0}}'}; CC=${CC:-2}; CH_LEN=${CHUNK:-400}
TOTAL=$(node -e "console.log(Math.round(53.72*30))")
mkdir -p out/gas/chunks
for ((a=0; a<TOTAL; a+=CH_LEN)); do
  e=$(( a + CH_LEN - 1 < TOTAL - 1 ? a + CH_LEN - 1 : TOTAL - 1 )); P=out/gas/chunks/$(printf %04d $a).mp4
  [ -s "$P" ] && { echo "кусок $a-$e готов"; continue; }
  S=$(date +%s)
  npx remotion render src/index.ts GasShort "$P.tmp.mp4" --gl=swangle --browser-executable="$CH" --concurrency=$CC --frames=$a-$e \
    --codec=h264 --crf=16 --timeout=600000 --props="$PROPS" > out/gas/chunks/render_$a.log 2>&1 && mv "$P.tmp.mp4" "$P"
  echo "кусок $a-$e: $(( ($(date +%s) - S) / 60 )) мин"
done
ls out/gas/chunks/*.mp4 | grep -v tmp | sed 's#^out/gas/chunks/#file #' > out/gas/chunks/list.txt
ffmpeg -y -v error -f concat -safe 0 -i out/gas/chunks/list.txt -c copy out/gas/video.mp4
ffmpeg -y -v error -i out/gas/video.mp4 -i ../build/s03c_shutter/audio.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart ../out/s03c_shutter_B.mp4
ls -la ../out/s03c_shutter_B.mp4
