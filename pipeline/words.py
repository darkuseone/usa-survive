"""Слова озвучки с индексами для CUE: python pipeline/words.py episodes/<эп>"""
import json, sys
T = json.load(open(sys.argv[1].rstrip('/') + '/out/timeline.json')); print('длительность', T['duration'])
for l in T['lines']:
    ws = [w for w in l['words'] if w['w'] != '—']
    print(l['key'], f"{l['start']:.2f}-{l['end']:.2f}", '|', ' '.join(f"{i}:{w['w']}@{w['s']:.2f}" for i, w in enumerate(ws)))
