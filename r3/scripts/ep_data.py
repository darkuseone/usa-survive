#!/usr/bin/env python3
"""Тайминги ролика для движка B: реплики и слова из episodes/<ep>/out/timeline.json -> r3/src/videos/<dir>/data.ts
   python3 r3/scripts/ep_data.py <ep> <dir>      (например: s02b_water water)"""
import json, os, sys
R = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ep, d = sys.argv[1], sys.argv[2]
tl = json.load(open(f'{R}/episodes/{ep}/out/timeline.json'))
lines, words = {}, []
for l in tl['lines']:
    lines[l['key']] = [round(l['start'], 3), round(l['end'], 3)]
    ws = [w for w in l['words'] if w['w'] != '—']
    for i, w in enumerate(ws):
        words.append([w['w'], round(w['s'], 3), round(ws[i + 1]['s'] if i + 1 < len(ws) else l['end'] + 0.12, 3), l['key']])
out = [f'// сгенерировано r3/scripts/ep_data.py из episodes/{ep}: не править руками',
       f'export const DUR = {tl["duration"]};',
       f'export const LINES: Record<string, [number, number]> = {json.dumps(lines)};',
       f'export const WORDS: [string, number, number, string][] = {json.dumps(words)};']
os.makedirs(f'{R}/r3/src/videos/{d}', exist_ok=True)
open(f'{R}/r3/src/videos/{d}/data.ts', 'w').write('\n'.join(out) + '\n')
print(len(words), 'слов,', len(lines), 'реплик ->', f'r3/src/videos/{d}/data.ts')
