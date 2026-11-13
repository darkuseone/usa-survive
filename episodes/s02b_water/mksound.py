"""sound.json шортса S2 в стиле B: реальные записи Mixkit по меткам слов (episodes/s02b_water/out/timeline.json).
   python3 episodes/s02b_water/mksound.py && .venv/bin/python -I tools/sound_spec.py s02b_water  -> build/s02b_water/audio.wav
   Метки и планы совпадают с r3/src/videos/water/story.ts (те же слова)."""
import json, os, re
EP = 'episodes/s02b_water'; TL = json.load(open(f'{EP}/out/timeline.json')); DUR = TL['duration']
LN = {l['key']: l for l in TL['lines']}
def W(k, rx): return next(w['s'] for w in LN[k]['words'] if re.match(rx, w['w'], re.I))
L0 = lambda k: LN[k]['start']; L1 = lambda k: LN[k]['end']
T = dict(bottle=W('k02', 'bottle'), fema=W('k03', 'FEMA'), heater=W('k03', 'heater'), forty=W('k04', 'Forty'), valve=W('k04', 'drain'), clean=W('k04', 'Clean'),
         never=W('k05', 'never'), am3=L0('k06'), clicks=W('k06', 'clicks'), inside=W('k07', 'inside'), run=W('k08', 'run'), shut=W('k08', 'shut'), fog=W('k09', 'fog'),
         scratch=W('k09', 'scratching'), belt=W('k10', 'belt'), speakers=W('k10', 'speakers'), sound=W('k11', 'sound'), loudest=W('k11', 'loudest'), four=W('k11', 'four'),
         press=W('k12', 'press'), bang=W('k12', 'bang'), wall=W('k12', 'wall'), turns=W('k13', 'turns'), out=W('k13', 'out'), rain=W('k13', 'rain'), slam=W('k13', 'slam'),
         bury=W('k13', 'bury'), county=W('k14', 'county'), end=L1('k14'))
MK = 'wav:../../assets/mixkit/'; LP = 'wav:../../build/e01_gas/amb/'
sfx = []
def mk(n, at, g): sfx.append([MK + n + '.mp3', round(max(0, at), 3), g])
def loop(n, a, b, g, lp=False): sfx.append([(LP + n + '.wav') if lp else (MK + n + '.mp3'), round(a, 3), [round(b, 3), g]])
oner1, oner2, cool, spk, bang, blast, oner3, county = L0('k02') - 0.1, L0('k06') - 0.15, L0('k09') - 0.1, T['speakers'] - 0.05, L0('k12') - 0.1, T['wall'] + 0.25, L0('k13') - 0.05, L0('k14') - 0.1
# подложки: ночь — дождь и хоррор-гул; день — гудение ламп, тише; камера — холодильный гул
loop('mk_rain_roof', 0, oner1, 0.3, True); loop('amb_terror', 0, oner1, 0.3)
loop('mk_hum_fluor', oner1, oner2, 0.2, True); loop('amb_suspense', oner1 + 1, oner2, 0.2); loop('water_drip', oner1, T['valve'], 0.25)
loop('mk_rain_roof', oner2, DUR, 0.26, True); loop('amb_horror', oner2, cool, 0.26); loop('mk_amb_coldroom', cool, spk, 0.45, True); loop('mk_amb_coldroom', bang, blast, 0.45, True)
loop('amb_drone', spk, DUR, 0.24); loop('rain_heavy', spk, bang, 0.35); loop('rain_heavy', blast, oner3, 0.35); loop('rain_heavy', county, DUR, 0.3)
# крючок: вода льётся, дверь скрипит, рычание
loop('water_pour', 0, oner1 - 0.1, 0.3); mk('hit_horror', 0.05, 0.75); mk('door_metal', 1.7, 0.5); mk('z_breath', 2.4, 0.5); mk('wh_deep', 4.2, 0.45)
# день 19: бутылка, FEMA, дверь подсобки, бойлер
mk('can_fall', T['bottle'] + 0.3, 0.25); mk('water_drip', T['bottle'] + 0.6, 0.6); mk('page', T['fema'], 0.45); mk('swell', T['fema'] + 0.1, 0.35)
mk('door_metal', T['fema'] + 0.2, 0.45); mk('steps_tunnel', T['fema'] + 0.9, 0.3); mk('hit_suspense', T['heater'] - 0.05, 0.5)
mk('tool_drop', T['valve'] - 0.15, 0.3); mk('metal_slide', T['valve'] - 0.05, 0.3); loop('water_fill', T['valve'] + 0.15, oner2 - 0.2, 0.42); mk('water_sip', T['clean'] + 0.6, 0.45)
mk('riser_short', L0('k05') + 0.2, 0.35); mk('hit_heart', T['never'], 0.6); mk('sweep_terror', L1('k05') - 0.4, 0.35)
# 3 часа ночи: щелчок, дверь, внутри
mk('heart_slow', oner2, 0.55); mk('lock2', T['clicks'] - 0.03, 0.9); mk('door_metal', T['clicks'] + 0.4, 0.55); mk('thunder_far', T['clicks'] + 0.5, 0.45)
mk('z_growl', T['inside'] - 0.2, 0.8); mk('hit_horror2', T['inside'] - 0.05, 0.6); mk('z_breath2', T['inside'] + 1.0, 0.5)
mk('steps_run', T['run'], 0.6); mk('door_metal', T['shut'] - 0.1, 0.8); mk('hit_big', T['shut'] - 0.05, 0.7); mk('heart_fast', T['shut'], 0.6)
# камера: пар, царапанье, трубка
mk('z_breath', cool + 0.5, 0.35); mk('wh_wind', T['fog'] - 0.3, 0.3); loop('paper_slide', T['scratch'], spk - 0.3, 0.55); mk('z_creature', T['scratch'] + 0.3, 0.5)
mk('keys', T['belt'], 0.5); mk('radio_broken', T['belt'] + 0.6, 0.3)
# громкоговоритель и кран: звук = оружие
mk('radio_terror', spk + 0.05, 0.4); mk('swell', T['sound'] - 0.4, 0.45); mk('riser_drama', T['loudest'] - 0.3, 0.45); mk('thunder_mid', T['four'] + 0.2, 0.4)
# удары трубкой и рёв громкоговорителя
mk('slap', T['press'] + 0.4, 0.4); mk('elec_small', T['press'] + 0.45, 0.6)
for k in ('bang', 'wall'): mk('metal_hit', T[k] + 0.05, 0.9); mk('hit_glass', T[k] + 0.06, 0.35)
mk('radio_terror', blast, 0.9); mk('elec_glitch', blast + 0.05, 0.6); mk('wh_hit', blast, 0.5)
# зомби уходит на звук, дверь, стеллаж
mk('z_growl', T['turns'], 0.6); mk('steps_puddle', T['out'], 0.45); loop('radio_broken', oner3, T['slam'], 0.25)
mk('steps_run', T['rain'] - 0.3, 0.6); mk('door_metal', T['slam'], 1.0); mk('metal_impact', T['slam'] + 0.03, 0.8); mk('lock', T['slam'] + 0.35, 0.7)
mk('metal_slide', T['bury'] - 0.05, 0.8); mk('collapse', T['bury'] + 0.9, 0.45); mk('heart_slow', L1('k13') - 0.3, 0.5)
# вся округа
mk('thunder_rumble', county, 0.55); mk('z_moan_crowd', county + 0.4, 0.6); mk('z_moan_crowd', T['county'], 0.45); mk('hit_horror', T['end'] + 0.1, 0.75)
mk('tape', T['end'] + 0.55, 0.45); mk('scribble', T['end'] + 0.9, 0.45)
for t in (oner2, cool, spk, bang, blast, oner3, county): mk('wh_air', t - 0.08, 0.28)
json.dump({'voice': f'{EP}/out/voice.wav', 'key': 'D', 'music': [], 'stings': [], 'sfx': sfx, 'levels': {'music': 0.0, 'fx': 0.22}}, open(f'{EP}/sound.json', 'w'), indent=1)
os.makedirs('build/s02b_water', exist_ok=True); json.dump({'CUE': {}, 'DUR': DUR}, open('build/s02b_water/cues.json', 'w'))
print(len(sfx), 'звуков, DUR', DUR)
