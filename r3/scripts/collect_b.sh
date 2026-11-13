#!/bin/bash
# Забрать куски стиля B из ветки render-out (рендер на GitHub Actions), склеить покадрово точно и подложить звук эпизода.
#   r3/scripts/collect_b.sh <эпизод> <имя>   ->  out/<имя>.mp4   (звук: build/<эпизод>/audio.wav)
#   пример: r3/scripts/collect_b.sh s02b_water s02b_water_B
#   KEEP=<папка> — сначала взять куски из папки (прошлый рендер), сверху — новые из render-out (дорендер упавших диапазонов, "ranges" в render-request.json)
#   FRAMES=<n> — проверить, что кадров ровно n (иначе ошибка: потерянный кусок)
# Склейка — concat-ФИЛЬТРОМ с перекодированием: concat-демуксер на кусках Remotion теряет кадры на стыках.
set -e; cd "$(dirname "$0")/../.."
EP=${1:?эпизод}; NAME=${2:-${1}_B}
git fetch -q origin render-out && rm -rf r3/out/ci && mkdir -p r3/out/ci
[ -n "$KEEP" ] && cp "$KEEP"/chunk_*.mp4 r3/out/ci/
git archive origin/render-out | tar -x -C r3/out/ci
mapfile -t CH < <(ls r3/out/ci/chunk_*.mp4 | sort); N=${#CH[@]}
IN=(); F=""; for i in "${!CH[@]}"; do IN+=(-i "${CH[$i]}"); F+="[$i:v]"; done
ffmpeg -y -v error "${IN[@]}" -i build/$EP/audio.wav -filter_complex "${F}concat=n=$N:v=1:a=0[v]" -map "[v]" -map $N:a \
  -c:v libx264 -crf 17 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart out/$NAME.mp4
ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames,width,height:format=duration -of compact out/$NAME.mp4
if [ -n "$FRAMES" ]; then N2=$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 out/$NAME.mp4); [ "$N2" = "$FRAMES" ] || { echo "ОШИБКА: кадров $N2, ожидалось $FRAMES"; exit 1; }; fi
