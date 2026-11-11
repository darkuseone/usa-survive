#!/bin/bash
# Забрать куски версии B из ветки render-out (рендер на GitHub Actions), склеить и подложить звук версии A.
set -e; cd "$(dirname "$0")/../.."
git fetch -q origin render-out && rm -rf r3/out/ci && mkdir -p r3/out/ci && git archive origin/render-out | tar -x -C r3/out/ci
ls r3/out/ci/chunk_*.mp4 | sort | sed 's#^r3/out/ci/#file #' > r3/out/ci/list.txt
ffmpeg -y -v error -f concat -safe 0 -i r3/out/ci/list.txt -c copy r3/out/gas/video_ci.mp4
ffmpeg -y -v error -i r3/out/gas/video_ci.mp4 -i build/s03c_shutter/audio.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart out/s03c_shutter_B.mp4
ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames,width,height:format=duration -of compact out/s03c_shutter_B.mp4
