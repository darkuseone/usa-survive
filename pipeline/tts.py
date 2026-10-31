"""Озвучка реплик эпизода через ElevenLabs (ключ из ELEVENLABS_API_KEY, не печатается).
  python pipeline/tts.py <episode_dir> [ключи...]   # <ep>/script.json -> <ep>/vo/<ключ>.mp3 (готовые пропускает, если ключи не названы)
Текст для синтеза — поле "tts" (теги эмоций [whispers], [shouting]…), для субтитров — "text"."""
import json, os, sys, urllib.request, urllib.error
from pathlib import Path


def main(ep, keys):
    d = Path(ep); S = json.load(open(d / 'script.json')); (d / 'vo').mkdir(exist_ok=True)
    model = S.get('model', 'eleven_v4')
    for ln in S['lines']:
        out = d / 'vo' / f"{ln['key']}.mp3"
        if (keys and ln['key'] not in keys) or (not keys and out.exists()): continue
        v = S['voices'][ln['speaker']]
        body = {'text': ln.get('tts', ln['text']), 'model_id': model, 'voice_settings': v['settings']}
        req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{v['voice_id']}?output_format=mp3_44100_128", json.dumps(body).encode(),
                                     {'xi-api-key': os.environ['ELEVENLABS_API_KEY'], 'Content-Type': 'application/json'})
        try:
            with urllib.request.urlopen(req, timeout=180) as r: out.write_bytes(r.read()); print(out, r.headers.get('character-cost'))
        except urllib.error.HTTPError as e: sys.exit(f"{ln['key']}: HTTP {e.code}: {e.read()[:300]!r}")


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2:])
