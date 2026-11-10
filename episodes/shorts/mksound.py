"""sound.json шортса из эп. 1: шумы эп. 1 теми же кусками, что и картинка (build/e01_gas/fx_stem.wav — STEM=1 tools/make.sh e01_gas sound),
   замедленные куски — растянуты atempo (стук и тряска совпадают), + удары на крючке, свисты на склейках, перемотка, финальная карточка (Mixkit).
   python3 tools/mkpage.py <эп> && node tools/cues.cjs build/<эп>/film > build/<эп>/cues.json && python3 episodes/shorts/mksound.py <эп>"""
import json, subprocess, sys
from pathlib import Path

ep = sys.argv[1]; R = Path(__file__).resolve().parents[2]; B = R / 'build' / ep
C = json.load(open(B / 'cues.json')); DUR = C['DUR']; SEGS = C['EXP']['segs']
STEM = 'stem:build/e01_gas/fx_stem.wav'; MK = 'wav:../../assets/mixkit/'
sfx = []
def mk(n, at, g): sfx.append([MK + n + '.mp3', round(max(0, at), 3), g])
HOOKFX = {'s01_door': [('hit_horror', 0.05, 0.8), ('knock_wood', 0.02, 0.0)], 's02_water': [('hit_horror', 0.05, 0.8), ('water_drip', 0.6, 0.6)],
          's03_shutter': [('metal_impact', 0.03, 0.9), ('z_moan_crowd', 0.2, 0.5)]}
for n, a, g in HOOKFX.get(ep, []):
    if g > 0: mk(n, a, g)
mk('scissors', 0.08, 0.35); mk('paper_slide', 0.4, 0.3)
for i, s in enumerate(SEGS):
    t0 = s['t0']; t1 = SEGS[i + 1]['t0'] if i + 1 < len(SEGS) else DUR; d = t1 - t0 + 0.08
    if s['kind'] == 'e1':
        if abs(s['rate'] - 1) < 1e-3: sfx.append([STEM, round(t0, 3), [round(s['te0'], 3), round(s['te0'] + d, 3), 1.0]])
        else:                                                           # замедленный план: шумы растянуты без смены высоты
            out = B / f'seg{i}.wav'
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(s['te0']), '-t', str(d * s['rate']), '-i', str(R / 'build/e01_gas/fx_stem.wav'), '-af', (f"atempo={s['rate']:.3f}" if s['rate'] >= 0.5 else f"atempo={s['rate'] ** 0.5:.4f},atempo={s['rate'] ** 0.5:.4f}"), str(out)], check=True)
            sfx.append([f'wav:../../build/{ep}/seg{i}.wav', round(t0, 3), 1.0])
    elif s['kind'] == 'rewind':                                         # перемотка: свист назад, глитч, райзер
        mk('wh_deep', t0, 0.6); mk('elec_glitch', t0 + 0.05, 0.5); mk('riser_short', t0, 0.45); mk('hit_suspense', t1 - 0.05, 0.6)
        sfx.append(['wav:../../assets/mixkit/amb_suspense.mp3', round(t0, 3), [round(t1, 3), 0.3]])
    elif s['kind'] == 'end':                                            # финал: удар, фото на скотч, стрелка-маркер, тихий эмбиент
        mk('hit_horror', t0 + 0.05, 0.7); mk('tape', t0 + 0.3, 0.5); mk('paper_slide', t0 + 0.5, 0.4); mk('scribble', t0 + 0.8, 0.45)
        sfx.append(['wav:../../assets/mixkit/amb_horror.mp3', round(t0, 3), [round(DUR, 3), 0.35]]); sfx.append(['wav:../../build/e01_gas/amb/mk_rain_roof.wav', round(t0, 3), [round(DUR, 3), 0.25]])
    if i > 0 and s['tr'] == 'whip': mk('wh_fast', t0 - 0.12, 0.55)
    if i > 0 and s['tr'] == 'flash': mk('hit_glass', t0, 0.5); mk('wh_hit', t0 - 0.05, 0.45)
json.dump({'voice': f'episodes/{ep}/out/voice.wav', 'key': 'D', 'music': [], 'stings': [], 'sfx': sfx, 'levels': {'music': 0.0, 'fx': {'s01_door': 0.34, 's02_water': 0.35, 's03_shutter': 0.27}.get(ep, 0.3)}},
          open(R / 'episodes' / ep / 'sound.json', 'w'), indent=0)
print(ep, len(SEGS), 'сегментов,', len(sfx), 'звуков, DUR', DUR)
