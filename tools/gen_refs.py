"""Справочник API для скиллов (экономит токены: не читать большие файлы целиком). Запуск из корня после правок движка или новой серии:
  python3 tools/gen_refs.py   → .claude/skills/applique-engine/api.md — функции движка, персонажей канала и декораций эпизодов"""
import re
from pathlib import Path
R = Path(__file__).resolve().parent.parent
FN = re.compile(r'^(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)\s*\{?(.*)$')
AR = re.compile(r'^const\s+(\w+)\s*=\s*\(?([\w\s,=.\'\-]*)\)?\s*=>(.*)$')
def funcs(p):
    out = []
    for line in p.read_text().splitlines():
        m = FN.match(line) or AR.match(line)
        if m:
            c = re.search(r'//\s*(.+)$', m.group(3)); out.append(f"- `{m.group(1)}({m.group(2).strip()})`" + (f" — {c.group(1).strip()}" if c else ''))
    return out
api = ['# API движка «Аппликации» (сгенерировано tools/gen_refs.py — не править руками)', '',
       'Перед вызовом незнакомой функции — `grep -n "function имя" <файл>` и прочитать 5–10 строк.', '']
for f in ['engine.js', 'face.js', 'props.js', 'common.js', 'chars.js']:
    p = R / 'engine' / f
    if p.exists(): api += [f'## engine/{f}', *funcs(p), '']
api += ['# Декорации и вставки эпизодов (копировать и менять, а не писать с нуля)', '']
for p in sorted(R.glob('episodes/*/set.js')) + sorted(R.glob('reference/tom-nikita/episodes/*/set.js')):
    head = p.read_text().splitlines()[0].strip('/* ').rstrip('*/ ')
    api += [f'## {p.relative_to(R)} — {head}', *funcs(p), '']
api += ['# Образец персонажей (только как пример построения — в эпизодах НЕ использовать)', '', '## reference/tom-nikita/chars.js', *funcs(R / 'reference/tom-nikita/chars.js'), '']
(R / '.claude/skills/applique-engine/api.md').write_text('\n'.join(api) + '\n'); print('api.md:', len(api), 'строк')
