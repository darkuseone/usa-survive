"""Собирает страницу эпизода для HyperFrames: build/<эп>/film/ = engine/* + episodes/<эп>/*.js + шрифты + data.js (размер, реплики, слова, виземы).
  python3 tools/mkpage.py <эпизод>                       # весь ролик (для snap/dbg/cues)
  python3 tools/mkpage.py <эпизод> --part A B [папка]    # часть [A, B) с — для рендера длинного ролика по частям (по умолчанию build/<эп>/part_A)
episode.json: {"timeline": "episodes/<эп>/out/timeline.json" | "duration": сек, "size": [1920, 1080], "page": [1080, 1920] — холст страницы, если отличается от мира сцен (шортсы из горизонтальных сцен), "scripts": ["set.js", "scenes.js"],
               "libs": ["engine/chars.js"]  — общие файлы из корня репозитория (персонажи канала), "subs": {"y": 960, ...} — настройки субтитров (SUB в common.js)}"""
import json, shutil, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def main(ep, part=None, dest=None):
    d = ROOT / 'episodes' / ep; meta = json.load(open(d / 'episode.json'))
    f = Path(dest) if dest else ROOT / 'build' / ep / ('film' if not part else f'part_{part[0]:07.2f}')
    if f.exists(): shutil.rmtree(f)
    f.mkdir(parents=True)
    E = ROOT / 'engine'
    for p in [*E.glob('*.js'), E / 'vendor/gsap.min.js', *(ROOT / 'assets/fonts').glob('*.ttf')]: shutil.copy(p, f)
    T = json.load(open(ROOT / meta['timeline'])) if meta.get('timeline') else {'duration': meta['duration'], 'lines': []}
    DUR = round(meta.get('duration', T['duration']), 3); W, H = meta.get('size', [1920, 1080]); PW, PH = meta.get('page', [W, H])
    T0, T1 = (part[0], min(part[1], DUR)) if part else (0, DUR); PART = round(T1 - T0, 3)
    lines = [{k: l[k] for k in ('key', 'speaker', 'text', 'start', 'end', 'words', 'visemes')} for l in T['lines']]
    data = f"const W = {W}, H = {H}, PW = {PW}, PH = {PH}, DUR = {DUR}, T0 = {T0}, PART = {PART};\nconst LINES = {json.dumps(lines, ensure_ascii=False)};\n"
    if meta.get('subs'): data += f"const SUBCFG = {json.dumps(meta['subs'], ensure_ascii=False)};\n"
    (f / 'data.js').write_text(data)
    libs = []
    for p in meta.get('libs', []):
        shutil.copy(ROOT / p, f / Path(p).name); libs.append(Path(p).name)
    for p in meta['scripts']: shutil.copy(d / p, f)
    html = (E / 'page.html').read_text().replace('__DUR__', str(PART)).replace('__PW__', str(PW)).replace('__PH__', str(PH)).replace('__W__', str(W)).replace('__H__', str(H))
    html = html.replace('__LIBS__', ''.join(f'<script src="{p}"></script>' for p in libs))
    html = html.replace('__SCRIPTS__', ''.join(f'<script src="{p}"></script>' for p in meta['scripts']))
    (f / 'index.html').write_text(html)
    print(f, f'{W}x{H}', 'DUR', DUR, *(['part', T0, T1] if part else []))


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: sys.exit(__doc__)
    if '--part' in a:
        i = a.index('--part'); main(a[0], (float(a[i + 1]), float(a[i + 2])), a[i + 3] if len(a) > i + 3 else None)
    else: main(a[0])
