"""Проверка озвучки на слух машиной: расшифровка faster-whisper (язык — LANG=en|ru…, по умолчанию en).
  .venv/bin/python -I pipeline/transcribe.py episodes/<эп>/vo/*.mp3
Печатает «файл | текст | длительность». Ищем: прочитанные вслух теги [..], пропущенные слова, опечатки."""
import os, sys, subprocess, numpy as np
from faster_whisper import WhisperModel
m = WhisperModel('small', device='cpu', compute_type='int8')
for f in sys.argv[1:]:
    a = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True).stdout, np.float32)
    segs, _ = m.transcribe(a, language=os.environ.get('LANG_STT', 'en')); print(f, '|', ' '.join(s.text for s in segs), f'| {len(a)/16000:.2f}s')
