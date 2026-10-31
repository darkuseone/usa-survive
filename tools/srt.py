"""Субтитры .srt из таймлайна озвучки (для YouTube CC — в длинных роликах вшитые субтитры не обязательны).
  python3 tools/srt.py <эп> > out/<имя>.srt        — блоки до 2 строк × 42 символа, по словам реплик"""
import json, sys
from pathlib import Path
R = Path(__file__).resolve().parent.parent
meta = json.load(open(R / 'episodes' / sys.argv[1] / 'episode.json')); T = json.load(open(R / meta['timeline'])) if meta.get('timeline') else {'lines': []}
ts = lambda s: f"{int(s // 3600):02d}:{int(s % 3600 // 60):02d}:{int(s % 60):02d},{int(round(s % 1 * 1000)) % 1000:03d}"
blocks = []
for l in T['lines']:
    ws = [w for w in l['words'] if w['w'] != '—']; cur = []
    for w in ws:
        if cur and (len(' '.join(x['w'] for x in cur + [w])) > 84 or cur[-1]['w'][-1] in '.!?…'): blocks.append(cur); cur = []
        cur.append(w)
    if cur: blocks.append(cur)
for i, b in enumerate(blocks):
    text = ' '.join(w['w'] for w in b)
    if len(text) > 42: cut = text.rfind(' ', 0, len(text) // 2 + 10); text = text[:cut] + '\n' + text[cut + 1:]
    end = min(b[-1]['e'] + 0.3, blocks[i + 1][0]['s'] - 0.02) if i + 1 < len(blocks) else b[-1]['e'] + 0.5
    print(f"{i + 1}\n{ts(b[0]['s'])} --> {ts(end)}\n{text}\n")
