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
S_DAY, S_NIGHT, S_COOL, S_SPK, S_BANG, S_OUT, S_CNT = 4.62, 21.95, 30.9, 38.0, 43.9, 46.2, 52.25   # = S в r3/src/videos/water/story.ts
T.update(killed=W('k01', 'killed'), day=L0('k02'), last=W('k02', 'last'), every=W('k03', 'every'), open=W('k04', 'open'), weeks=W('k04', 'Weeks'), dragged=W('k05', 'dragged'),
         one=L0('k07'), between=W('k07', 'Between'), handset=W('k10', 'handset'), turns=W('k13', 'turns'))
# --- подложки: крючок — ночь; день — гудение ламп; с 21,9 — ночь, дождь (громче, когда задняя дверь открыта); камера — холодильный гул
loop('mk_rain_roof', 0, S_DAY, 0.3, True); loop('amb_terror', 0, S_DAY, 0.28); loop('water_pour', 0, S_DAY - 0.05, 0.3)
loop('mk_hum_fluor', S_DAY, S_NIGHT, 0.2, True); loop('amb_suspense', S_DAY + 0.5, S_NIGHT, 0.18); loop('water_drip', S_DAY, T['valve'], 0.22)
loop('mk_rain_roof', S_NIGHT, DUR, 0.26, True); loop('amb_horror', S_NIGHT, S_COOL, 0.26); loop('rain_heavy', T['clicks'] + 0.3, S_COOL, 0.32)
loop('mk_amb_coldroom', S_COOL, S_SPK, 0.45, True); loop('mk_amb_coldroom', S_BANG, S_OUT, 0.45, True)
loop('amb_drone', S_SPK, DUR, 0.22); loop('rain_heavy', S_SPK, S_BANG, 0.35); loop('rain_heavy', S_OUT, T['slam'], 0.33); loop('rain_heavy', S_CNT, DUR, 0.3)
# --- хлысты и пролёты (смены места): свист
for t_, g in ((S_DAY - 0.3, 0.55), (S_SPK - 0.35, 0.55), (S_BANG - 0.35, 0.55), (S_CNT - 0.35, 0.55)): mk('wh_fast', t_, g)
mk('wh_air', S_COOL - 0.35, 0.45); mk('wh_air', S_OUT - 0.4, 0.45)
# --- крючок: вода, скрип двери, зомби в щели, удар на «killed»
mk('hit_horror', 0.05, 0.7); mk('door_metal', 2.5, 0.45); mk('z_breath', 2.9, 0.55); mk('hit_suspense', T['killed'] - 0.05, 0.6); mk('z_growl', T['killed'] + 0.1, 0.45)
# --- день: бутылка, FEMA, шаги, дверь подсобки, кран, вода, смех, стеллаж по полу
mk('water_drip', T['bottle'] + 0.2, 0.6); mk('can_fall', T['bottle'] + 0.6, 0.25); mk('page', T['fema'], 0.45); mk('swell', T['fema'] + 0.1, 0.32)
for a, b in ((8.55, 10.0), (10.35, 12.35), (17.3, 18.35)):
    k = a
    while k < b: mk('steps_tunnel', k, 0.18); k += 1.6
mk('door_metal', 9.75, 0.4); mk('hit_suspense', T['heater'] - 0.05, 0.45)
mk('metal_slide', T['open'], 0.35); mk('tool_drop', T['valve'] - 0.1, 0.25); loop('water_fill', T['valve'] + 0.1, S_NIGHT, 0.4); mk('water_sip', T['clean'] + 0.4, 0.4)
loop('metal_slide', T['dragged'], T['dragged'] + 1.45, 0.5); mk('collapse', T['dragged'] + 1.4, 0.3); mk('riser_short', L0('k05') + 0.1, 0.32)
mk('hit_heart', T['never'], 0.6)
# --- день гаснет в ночь: мигание лампы, гул, щелчок, скрип, зомби входит
mk('elec_glitch', 21.3, 0.45); mk('elec_small', 21.6, 0.5); mk('sweep_terror', 21.4, 0.4); mk('heart_slow', S_NIGHT + 0.2, 0.5)
mk('lock2', T['clicks'] - 0.03, 0.9); mk('door_metal', T['clicks'] + 0.15, 0.6); mk('thunder_far', T['clicks'] + 0.6, 0.45)
k = T['one'] - 0.2
while k < T['inside'] + 0.4: mk('steps_puddle', k, 0.3); k += 1.1
mk('z_growl', T['inside'] - 0.2, 0.8); mk('hit_horror2', T['inside'] - 0.05, 0.6); mk('z_gasp', T['between'] + 0.05, 0.5); mk('heart_fast', T['between'] + 0.3, 0.5)
mk('steps_run', T['run'], 0.6); mk('door_metal', T['run'] + 0.1, 0.45); mk('door_metal', T['shut'] - 0.1, 0.8); mk('hit_big', T['shut'] - 0.05, 0.7)
# --- камера: пар, царапанье, трубка
mk('z_breath', S_COOL + 0.5, 0.35); mk('wh_wind', T['fog'] - 0.3, 0.3); loop('paper_slide', T['scratch'], S_SPK - 0.3, 0.55); mk('z_creature', T['scratch'] + 0.3, 0.5)
mk('keys', T['handset'], 0.5); mk('radio_broken', T['handset'] + 0.5, 0.3)
# --- громкоговоритель и кран
mk('radio_terror', S_SPK + 0.05, 0.4); mk('swell', T['sound'] - 0.4, 0.45); mk('riser_drama', T['loudest'] - 0.3, 0.45); mk('thunder_mid', T['four'] + 0.2, 0.4)
mk('z_moan_crowd', T['sound'] + 0.3, 0.3)
# --- кнопка, удары, рёв громкоговорителя
mk('slap', T['press'] + 0.4, 0.4); mk('elec_small', T['press'] + 0.45, 0.6)
for k_ in ('bang', 'wall'): mk('metal_hit', T[k_] + 0.05, 0.9); mk('hit_glass', T[k_] + 0.06, 0.35); mk('radio_terror', T[k_] + 0.1, 0.55)
# --- зомби уходит, Joe выбегает, хлопает, задвигает стеллаж
mk('z_growl', T['turns'], 0.6); k = T['turns'] + 0.5
while k < T['rain'] + 0.5: mk('steps_puddle', k, 0.35); k += 1.0
loop('radio_broken', S_OUT, T['slam'], 0.22); mk('door_metal', T['rain'] - 0.3, 0.45); mk('steps_run', T['rain'] - 0.25, 0.6)
mk('door_metal', T['slam'], 1.0); mk('metal_impact', T['slam'] + 0.03, 0.8); mk('lock', T['slam'] + 0.35, 0.7)
loop('metal_slide', T['bury'], L1('k13') - 0.3, 0.75); mk('collapse', L1('k13') - 0.4, 0.45); mk('heart_slow', L1('k13') - 0.2, 0.5)
# --- вся округа
mk('thunder_rumble', S_CNT, 0.55); mk('z_moan_crowd', S_CNT + 0.4, 0.6); mk('z_moan_crowd', T['county'], 0.45); mk('hit_horror', T['end'] + 0.1, 0.75)
mk('tape', T['end'] + 0.55, 0.45); mk('scribble', T['end'] + 0.9, 0.45)
json.dump({'voice': f'{EP}/out/voice.wav', 'key': 'D', 'music': [], 'stings': [], 'sfx': sfx, 'levels': {'music': 0.0, 'fx': 0.22}}, open(f'{EP}/sound.json', 'w'), indent=1)
os.makedirs('build/s02b_water', exist_ok=True); json.dump({'CUE': {}, 'DUR': DUR}, open('build/s02b_water/cues.json', 'w'))
print(len(sfx), 'звуков, DUR', DUR)
