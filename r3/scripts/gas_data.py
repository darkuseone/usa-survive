#!/usr/bin/env python3
"""Данные шортса для версии B: метки слов (T), начала планов и слова субтитров из версии A.
python3 r3/scripts/gas_data.py  (после tools/make.sh s03c_shutter sound|all — нужен build/s03c_shutter/cues.json)"""
import json, os
R = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
cues = json.load(open(f'{R}/build/s03c_shutter/cues.json'))
tl = json.load(open(f'{R}/episodes/s03c_shutter/out/timeline.json'))
exp = cues['EXP']
words = []
for l in tl['lines']:
    ws = [w for w in l['words'] if w['w'] != '—']
    for i, w in enumerate(ws):
        words.append([w['w'], round(w['s'], 3), round(ws[i + 1]['s'] if i + 1 < len(ws) else l['end'] + 0.12, 3)])
out = ['// сгенерировано scripts/gas_data.py из версии A (episodes/s03c_shutter): не править руками',
       f'export const DUR = {tl["duration"]};',
       f'export const T = {json.dumps(exp["T"])} as const;',
       f'export const SHOT_STARTS: [number, string][] = {json.dumps([[round(a, 3), n] for a, n in exp["shots"]])};',
       f'export const WORDS: [string, number, number][] = {json.dumps(words)};']
open(f'{R}/r3/src/videos/gas/data.ts', 'w').write('\n'.join(out) + '\n')
print(len(words), 'слов,', len(exp['shots']), 'планов')
