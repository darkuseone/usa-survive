"""sound.json шортса S3 (3D-версия): реальные записи Mixkit по меткам кадра (build/s03c_shutter/cues.json → EXP.T, EXP.shots).
   python3 tools/mkpage.py s03c_shutter && node tools/cues.cjs build/s03c_shutter/film > build/s03c_shutter/cues.json && python3 episodes/s03c_shutter/mksound.py"""
import json
C = json.load(open('build/s03c_shutter/cues.json')); T = C['EXP']['T']; SH = dict((n, t) for t, n in C['EXP']['shots']); DUR = C['DUR']
MK = 'wav:../../assets/mixkit/'; LP = 'wav:../../build/e01_gas/amb/'
sfx = []
def mk(n, at, g): sfx.append([MK + n + '.mp3', round(max(0, at), 3), g])
def loop(n, a, b, g, lp=False): sfx.append([(LP + n + '.wav') if lp else (MK + n + '.mp3'), round(a, 3), [round(b, 3), g]])
nxt = lambda nm: [t for t, n in C['EXP']['shots'] if t > SH[nm]][0] if any(t > SH[nm] for t, _ in C['EXP']['shots']) else DUR
# подложки
loop('mk_rain_roof', 0, DUR, 0.32, True); loop('mk_amb_drone', 0, DUR, 0.22, True)
loop('amb_terror', 0, SH['rewind'], 0.3); loop('amb_suspense', SH['arrive'], SH['crash'], 0.26); loop('amb_drone', SH['car'], SH['panic'], 0.28)
loop('amb_horror', SH['calm'], SH['leave'], 0.24); loop('amb_terror', SH['leave'], DUR, 0.26)
loop('mk_hum_fluor', SH['arrive'] + 2.5, SH['crash'], 0.18, True)
# крючок: толпа долбит жалюзи, сталь стонет
mk('hit_horror', 0.05, 0.8); mk('z_moan_crowd', 0.1, 0.7)
for i in range(9): mk('metal_hit', 0.25 + i * 0.52, 0.45 + 0.1 * (i % 2))
mk('metal_slide', SH['bend'] + 0.2, 0.6); mk('collapse', SH['bend'] + 0.8, 0.35); mk('heart_fast', SH['bend'], 0.5)
# перемотка
mk('wh_deep', SH['rewind'], 0.6); mk('elec_glitch', SH['rewind'] + 0.05, 0.5); mk('riser_short', SH['rewind'], 0.45); mk('hit_suspense', SH['arrive'] - 0.05, 0.6)
# ночь, колокольчик, зомби
mk('wh_air', SH['arrive'] + 1.1, 0.45); mk('steps_tunnel', SH['arrive'] + 2.2, 0.3); mk('paper_crinkle', SH['arrive'] + 3.2, 0.3)
mk('swell', T['chime'] - 1.2, 0.5); mk('doorbell', T['chime'], 0.9); mk('z_gasp', T['chime'] + 0.6, 0.6); mk('elec_glitch', T['walks'], 0.6); mk('z_growl', T['walks'] + 0.4, 0.8)
mk('hit_suspense', T['not'] - 0.05, 0.7); mk('heart_fast', T['not'], 0.6); mk('z_creature', T['gas'] + 0.2, 0.7)
# кнопка и жалюзи
mk('riser_short', T['slam'] - 0.6, 0.45); mk('lock', T['slam'] + 0.22, 0.9); mk('hit_big', T['slam'] + 0.25, 0.8)
mk('shutter_slide', T['steel'], 0.9); mk('metal_impact', T['crash'], 1.0); mk('metal_hit', T['crash'] + 0.5, 0.7); mk('z_growl', T['crash'] + 0.55, 0.5); mk('collapse', T['crash'] + 0.1, 0.4); mk('hit_heart', SH['car'] - 0.1, 0.6)
# день 7: сигнализация, толпа сходится
loop('caralarm', T['alarm'] - 0.1, SH['gather'] + 1.6, 0.42, True); mk('z_breath', SH['car'] + 0.3, 0.6); mk('metal_hit', T['alarm'] - 0.18, 0.7); mk('steps_puddle', SH['car'] + 0.2, 0.4)
mk('thunder_far', SH['gather'], 0.5); mk('z_moan_crowd', SH['gather'] + 0.4, 0.7); mk('steps_puddle', SH['gather'] + 0.2, 0.5); mk('hit_horror', T['forty'] - 0.05, 0.7)
# прогиб и болты
mk('metal_slide', SH['bolts'], 0.6); mk('riser_drama', SH['bolts'] + 0.3, 0.4)
for k, d in (('pops', 0.05), ('another', 0.25)): mk('metal_impact', T[k] + d, 0.9); mk('grill_hit', T[k] + d + 0.05, 0.6); mk('wh_fast', T[k] + d + 0.1, 0.5); mk('tool_drop', T[k] + d + 0.45, 0.5)
for i in range(6): mk('metal_hit', SH['bolts'] + 0.4 + i * 0.7, 0.35)
# паника
for k in ('panic', 'scream', 'run'): mk('hit_glass', T[k] - 0.1, 0.55); mk('wh_fast', T[k] - 0.15, 0.45)
# тишина: свет гаснет, прячется, 11 часов
mk('hit_suspense', SH['calm'], 0.5); mk('heart_slow', SH['calm'] + 0.2, 0.7)
for i in range(5): mk('elec_small', T['lights'] + i * 0.16, 0.5)
mk('paper_move', T['crawl'], 0.4); loop('clock_tick', T['eleven'] - 0.1, SH['eyes'], 0.6); mk('sweep_long', T['eleven'], 0.35)
mk('z_breath2', SH['eyes'] + 0.3, 0.6); mk('swell', T['sound'] - 0.5, 0.45); mk('z_calm', T['sound'] + 0.2, 0.5)
mk('heart_mid', SH['breath'], 0.7); mk('z_breath', SH['breath'] + 1.0, 0.5)
# уходят; ночь 12-го; стук
mk('thunder_rumble', SH['leave'], 0.5); mk('steps_puddle', SH['leave'] + 0.3, 0.4); mk('z_moan_crowd', SH['leave'] + 0.5, 0.35)
mk('heart_slow', SH['knock'], 0.6)
for i, k in enumerate(T['kn']): mk('knock_wood', k - 0.03, 1.0); mk('hit_heart', k, 0.35 if i else 0.6)
mk('hit_horror', T['card'] + 0.05, 0.7); mk('tape', T['card'] + 0.5, 0.45); mk('scribble', T['card'] + 0.8, 0.45)
# склейки: короткий свист
for t, n in C['EXP']['shots'][1:]:
    if n not in ('rewind', 'end', 'shock', 'door', 'arrive', 'bolt2', 'peek', 'knock3'): mk('wh_air', t - 0.08, 0.3)
json.dump({'voice': 'episodes/s03c_shutter/out/voice.wav', 'key': 'D', 'music': [], 'stings': [], 'sfx': sfx, 'levels': {'music': 0.0, 'fx': 0.22}}, open('episodes/s03c_shutter/sound.json', 'w'), indent=0)
print(len(sfx), 'звуков, DUR', DUR)
