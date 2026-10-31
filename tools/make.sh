#!/usr/bin/env bash
# Сборка эпизода «Аппликации» одной командой (горизонталь 1920×1080 по умолчанию, длинные ролики — рендер по частям).
#   tools/make.sh <эп> snap 0,3.5,12        — контрольные кадры → build/<эп>/snaps/sheet.jpg (секунды через запятую)
#   tools/make.sh <эп> dbg                  — прогон всех секунд (шаг 0.5 с) на JS-ошибки
#   tools/make.sh <эп> sound                — метки CUE + звук → build/<эп>/audio.wav (печатает LU музыки и шумов)
#   tools/make.sh <эп> all <имя>            — dbg, звук, рендер по частям (PART=60 с, готовые части пропускает), склейка, сведение
#                                             → out/<имя>.mp4 + out/<имя>_sheet.jpg + out/<имя>.srt
#   tools/make.sh <эп> mux <имя>            — правка только звука: новый audio.wav + уже отрендеренные части (без рендера)
#   tools/make.sh <эп> thumb <имя> <сек>    — кадр в полном размере → out/<имя>_thumb.png (обложка; лучше отдельный план 'thumb' в SHOTS)
# Перерендер изменённого куска: удалить build/<эп>/parts/<начало>.mp4 нужной части (или всю папку) и снова all.
# Длинный рендер запускать в фоне (run_in_background): ~15 мин на минуту ролика при -w 4.
set -euo pipefail
cd "$(dirname "$0")/.."
EP=$1; MODE=${2:-all}; B=build/$EP; PY=${PY:-$( [ -x .venv/bin/python ] && echo .venv/bin/python || echo python3 )}
PARTLEN=${PART:-60}; WORKERS=${WORKERS:-4}
python3 tools/mkpage.py "$EP" >/dev/null
if [ "$MODE" = snap ]; then node tools/shot.cjs "$B/film" "$B/snaps" ${3//,/ } | tail -1; exit 0; fi
if [ "$MODE" = dbg ]; then node tools/dbg.cjs "$B/film" | tail -3; exit 0; fi
NAME=${3:-$EP}; mkdir -p out
if [ "$MODE" = thumb ]; then SCALE=1 node tools/shot.cjs "$B/film" "$B/thumb" "$4" | tail -1; cp "$B/thumb/t$(printf %.2f "$4").png" "out/${NAME}_thumb.png"; ls -la "out/${NAME}_thumb.png"; exit 0; fi
node tools/cues.cjs "$B/film" > "$B/cues.json"
$PY -I tools/sound_spec.py "$EP"
[ "$MODE" = sound ] && exit 0
DUR=$(python3 -c "import json; print(json.load(open('$B/cues.json'))['DUR'])")
if [ "$MODE" != mux ]; then
  node tools/dbg.cjs "$B/film" | tail -1
  mkdir -p "$B/parts"
  for A in $(python3 -c "import math; d=$DUR; print(' '.join(f'{i*$PARTLEN:07.2f}' for i in range(math.ceil(d/$PARTLEN))))"); do
    P="$B/parts/$A.mp4"; [ -s "$P" ] && { echo "часть $A — готова, пропускаю"; continue; }
    E=$(python3 -c "print($A + $PARTLEN)"); python3 tools/mkpage.py "$EP" --part "$A" "$E" "$B/part_$A" >/dev/null
    echo "часть $A…$E: рендер"; npx hyperframes render "$B/part_$A" -f 24 -q high -w "$WORKERS" -o "$P.tmp.mp4" > "$B/render_$A.log" 2>&1 && mv "$P.tmp.mp4" "$P"
    rm -rf "$B/part_$A"
  done
fi
ls "$B"/parts/*.mp4 | sed "s#^$B/parts/#file '#; s#\$#'#" > "$B/parts/list.txt"
ffmpeg -y -v error -f concat -safe 0 -i "$B/parts/list.txt" -c copy "$B/video.mp4"
OUT=out/${NAME}.mp4
ffmpeg -y -v error -i "$B/video.mp4" -i "$B/audio.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT"
VD=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")
mkdir -p "$B/vchk"; rm -f "$B"/vchk/*.png; i=0
for t in $(python3 -c "d=$VD; print(' '.join(f'{d*k/24:.2f}' for k in range(24)))"); do ffmpeg -v error -y -ss $t -i "$OUT" -frames:v 1 -vf scale=320:-1 "$B/vchk/$(printf %02d $i).png"; i=$((i+1)); done
ffmpeg -v error -y -i "$B/vchk/%02d.png" -vf tile=6x4 -frames:v 1 "out/${NAME}_sheet.jpg"
python3 tools/srt.py "$EP" > "out/${NAME}.srt"
ls -la "$OUT" "out/${NAME}_sheet.jpg" "out/${NAME}.srt"; echo "длительность $VD с (сценарий $DUR с)"
