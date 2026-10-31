#!/usr/bin/env bash
# Окружение «Аппликации» в новом контейнере/чате. Запуск из корня репозитория: bash tools/setup.sh
# Ставит: .venv (numpy, scipy, pyloudnorm, faster-whisper), Rhubarb Lip Sync → tools/bin/rhubarb, npm-зависимости (HyperFrames, puppeteer-core).
# Проверяет: ffmpeg, node, Chromium, системные шрифты, ключ ELEVENLABS_API_KEY (значение не печатается).
set -euo pipefail
cd "$(dirname "$0")/.."
[ -x .venv/bin/python ] || python3 -m venv .venv
.venv/bin/pip install -q --upgrade pip && .venv/bin/pip install -q numpy scipy pyloudnorm faster-whisper
if [ ! -x tools/bin/rhubarb/rhubarb ]; then
  tmp=$(mktemp -d); curl -sSL -o "$tmp/rh.zip" https://github.com/DanielSWolf/rhubarb-lip-sync/releases/download/v1.13.0/Rhubarb-Lip-Sync-1.13.0-Linux.zip
  (cd "$tmp" && unzip -q rh.zip); mkdir -p tools/bin; mv "$tmp/Rhubarb-Lip-Sync-1.13.0-Linux" tools/bin/rhubarb; rm -rf "$tmp"
fi
tools/bin/rhubarb/rhubarb --version
npm install --silent
command -v ffmpeg >/dev/null || echo "!! нет ffmpeg: apt-get install -y ffmpeg"
CH=${CHROME:-/opt/pw-browsers/chromium}; [ -x "$CH" ] || echo "!! нет Chromium по пути $CH — задайте CHROME=/путь/к/chromium"
FONTS=$(fc-list : family)
for f in "Inter" "DejaVu Serif" "Courier 10 Pitch" "Noto Color Emoji" "FreeSans" "Liberation Serif"; do grep -qF "$f" <<<"$FONTS" || echo "!! нет шрифта: $f (apt: fonts-inter fonts-dejavu fonts-noto-color-emoji fonts-freefont-ttf fonts-liberation xfonts-scalable)"; done
[ -n "${ELEVENLABS_API_KEY:-}" ] && echo "ELEVENLABS_API_KEY: задан" || echo "!! ELEVENLABS_API_KEY не задан — озвучка не заработает (секрет окружения)"
echo "готово: Python = .venv/bin/python"
