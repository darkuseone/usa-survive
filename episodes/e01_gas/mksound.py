"""Собирает sound.json эпизода по меткам страницы (build/e01_gas/cues.json): атмосфера, музыка по главам, шумы на действия, звуки переходов.
   python3 episodes/e01_gas/mksound.py  (после node tools/cues.cjs …)"""
import json
C = json.load(open('build/e01_gas/cues.json')); c = C['CUE']; DUR = C['DUR']; SC = C['SC']
A = 'wav:../../build/e01_gas/amb/'; S = 'wav:sfx/'
def T(k, d=0.0): return round(c[k] + d, 3)
sfx, music, stings = [], [], []
def fx(name, at, g): sfx.append([name, at, g])
# --- атмосфера
fx(A + 'drone.wav', 0, [DUR, 0.32])
fx(A + 'rain_in.wav', 0, [DUR, 0.22])
EXT = ['ext0', 'storeOut0', 'c1sign', 'c1signZ', 'c1signOff', 'c2grid', 'c3alarm', 'c3bump', 'c3horde', 'c3drift', 'c4truck', 'c4again', 'peekIns', 'c45tide', 'c5speaker', 'c6truck', 'c6dee', 'c6pump', 'c6horde', 'c6flee', 'c6look', 'c7sign', 'c4win', 'c4inch', 'c4dee', 'c4deeTalk', 'c4bottles', 'c4leave', 'c3knock']
for nm, t0, t1 in SC:
    if nm in EXT: fx(A + 'rain.wav', round(t0, 3), [round(t1, 3), 0.42])
fx(S + 'amb_buzz.wav', T('a_alone', -0.1), [T('a_crash'), 0.16]); fx(A + 'buzz.wav', T('s_c2hum'), [T('c_stops'), 0.2]); fx(A + 'buzz.wav', T('i_lights'), [DUR, 0.18])
# --- переходы
for nm, t0, t1 in SC:
    tr = None
for s in [x for x in json.load(open('build/e01_gas/cues.json'))['SC']]: pass
TR = {'tear': ('tear', 0.5), 'whip': ('whoosh', 0.45), 'flash': (S + 'es_thump.wav', 0.55), 'dip': (S + 'es_revswell.wav', 0.25)}
for nm, kind in json.load(open('build/e01_gas/trans.json')).items():
    if kind in TR: n, g = TR[kind]; fx(n, T('s_' + nm, -0.15 if kind == 'whip' else 0), g)
# заставки глав: глухой удар, бумага, стинг
for card in ['card3', 'card7', 'card12', 'card15', 'card19', 'card24', 'card30', 'title0']:
    fx(S + 'es_deep.wav', T('s_' + card, 0.1), 0.55); fx('paper', T('s_' + card, 0.15), 0.4); stings.append('s_' + card + '+0.1')
# --- холодное начало (как в тесте)
for e in [[S + 'es_revswell.wav', 'a_chime-0.75', 0.45], [S + 'amb_chime.wav', 'a_chime', 0.75], [S + 'es_bell.wav', 'a_chime+0.05', 0.4], ['door', 'a_chime', 0.5],
          [S + 'es_flick1.wav', 'a_whatever-0.1', 0.55], [S + 'amb_groan1.wav', 'a_whatever+0.45', 0.8], ['paper', 'a_drop+0.5', 0.5], ['thud', 'a_drop+0.55', 0.35],
          [S + 'amb_steps.wav', 'a_walked+0.45', 0.55], [S + 'es_flick2.wav', 'a_walked+0.7', 0.45], [S + 'amb_groan2.wav', 's_zomb0+1.6', 0.85], [S + 'amb_steps.wav', 'a_a3', ['a_button-0.25', 0.5]],
          [S + 'es_latch.wav', 'a_hit-0.03', 0.8], ['slam', 'a_hit', 1.0], [S + 'es_subdrop.wav', 'a_hit', 0.8], ['siren', 'a_hit+0.15', 'a_day+2.5'], [S + 'es_riser.wav', 'a_steel-0.35', 0.5],
          [S + 'amb_rattle.wav', 'a_steel', 0.9], [S + 'es_metal.wav', 'a_crash', 1.0], ['rumble', 'a_crash', 'a_crash+1.6'], [S + 'es_deep.wav', 'a_day', 0.8], [S + 'amb_heart.wav', 'a_day+0.2', 0.6],
          [S + 'es_metal.wav', 'a_day+0.5', 0.4], [S + 'amb_groan1.wav', 's_storeOut0+0.5', 0.4], [S + 'amb_bang.wav', 's_shutClose0', 0.5], ['bubbles', 's_tankIns+0.5', 0.3],
          [S + 'amb_heart.wav', 's_flash19', 0.6], ['scratch', 's_flash19+0.3', 0.5]]: sfx.append(e)
for i in range(5): fx('pop', T('s_fiveIns', 0.5 + i * 0.25), 0.4)
fx('slam', T('a_nearly'), 0.6)
# --- глава 1
for i in range(5): fx('pop', T(f'b_invM{i}'), 0.4); fx('click', T(f'b_invM{i}', 0.25), 0.4)
for k, g in [('s_nineIns', 0.6), ('s_nineIns+0.9', 0.6), ('s_nineIns+2.0', 0.8)]: fx('slam', k, g)
fx(A + 'buzz.wav', T('s_c1sign'), [T('b_dies'), 0.35]); fx(A + 'groan0.wav', T('b_dinner', 0.3), 0.45)
fx(S + 'es_latch.wav', T('b_dies', -0.25), 0.9); fx('thud', T('b_dies', -0.2), 0.4); fx(S + 'es_sink.wav', T('b_dies'), 0.5)
fx('scratch', T('s_c1shelf', 0.2), 0.6); fx('scratch', T('s_c1shelf', 1.6), 0.6); fx('thud', T('s_c1shelf', 3.6), 0.7)
for i in range(3): fx('scratch', T(f'b_ruleM{i}'), 0.35)
# --- глава 2
fx(S + 'es_sink.wav', T('c_stops'), 0.7); fx(S + 'es_flick1.wav', T('c_stops', -0.4), 0.4); fx('click', T('c_fr', 0.25), 0.5)
fx(S + 'amb_heart.wav', T('s_c2quiet'), 0.8); fx('ticks', T('s_timerIns'), T('s_fridgeIns'))
for i in range(3): fx('pop', T(f'c_eatM{i}'), 0.4)
fx('click', T('c_lanOn', 0.15), 0.6); fx('door', T('s_c2coolerIn'), 0.4); fx('hum', T('s_c2coolerIn'), T('s_c2night'))
for k, d in [('groan1', 0.2), ('groan2', 1.4), ('groan0', 2.6)]: fx(A + f'{k}.wav', T('s_c2night', d), 0.35)
fx(S + 'amb_steps.wav', T('c_dozens'), 0.4)
# --- глава 3
fx(A + 'caralarm.wav', T('s_c3alarm', 0.2), [T('s_c3horde'), 0.6]); fx('thud', T('d_some', 0.3), 0.6)
for i, k in enumerate(['groan0', 'groan1', 'groan2', 'groan3', 'groan0']): fx(A + f'{k}.wav', T('s_c3horde', 0.3 + i * 0.7), 0.45)
fx(S + 'amb_bang.wav', T('s_weightIns', 0.2), 0.5); fx('slam', T('s_weightIns', 1.2), 0.6)
fx(S + 'amb_bang.wav', T('d_bends', -0.2), 0.8); fx(S + 'es_metal.wav', T('d_pops'), 0.7); fx('clink', T('d_pops', 0.1), 0.8); fx(S + 'es_metal.wav', T('d_another'), 0.8); fx('clink', T('d_another', 0.1), 0.8)
for i in range(3): fx('slam', T(f'd_dM{i}', 0.15), 0.6)
fx(S + 'amb_heart.wav', T('s_c3hide'), 0.6); fx('ticks', T('d_eleven', -0.6), T('s_c3rule')); fx('scratch', T('d_sil', -0.2), 0.35)
for i in range(3): fx(S + 'es_glass2.wav', T(f'd_kn{i}'), 0.9)
# --- глава 4
fx('scratch', T('s_c4win', 2.0), 0.4); fx('scratch', T('e_slide'), 0.35); fx(S + 'amb_steps.wav', T('s_c4crawl'), 0.3)
fx('clink', T('s_c4bottles', 0.8), 0.6); fx('scratch', T('s_c4bottles', 0.9), 0.5); fx(S + 'amb_steps.wav', T('e_nods', 0.2), 0.4)
for i in range(2): fx('pop', T('s_choiceIns', 0.2 + i * 0.3), 0.4)
fx(A + 'engine.wav', T('e_alone', -0.3), [T('s_card15'), 0.3])
# --- глава 4.5
fx('scratch', T('s_notebookIns', 0.3), 0.4); fx('scratch', T('f_nbM1'), 0.4); fx('scratch', T('f_nbM2'), 0.4); fx('scratch', T('f_loudW'), 0.5)
for i, k in enumerate(['groan0', 'groan2', 'groan3']): fx(A + f'{k}.wav', T('s_c45tide', 0.3 + i * 1.1), 0.4)
fx(A + 'groan1.wav', T('s_peekIns', 0.5), 0.35)
# --- глава 5
fx('blip', T('s_c5bottle', 1.25), 0.5); fx('bubbles', T('g_open', 0.2), 0.5); fx(S + 'es_revswell.wav', T('g_never', -0.6), 0.5); fx('slam', T('g_never', 0.2), 0.7)
fx(S + 'es_latch.wav', T('g_clicks'), 1.0); fx(A + 'groan2.wav', T('s_c5inside', 0.2), 0.8); fx(S + 'amb_steps.wav', T('s_c5run'), 0.7); fx('slam', T('g_shut'), 0.9)
for i in range(4): fx('scratch', T('s_c5fog', 0.3 + i * 1.1), 0.55)
fx(S + 'amb_heart.wav', T('s_c5fog'), 0.7); fx('buzzer', T('s_handsetIns', 2.2), 0.25)
fx(S + 'es_metal.wav', T('g_bang'), 0.5); fx(S + 'es_metal.wav', T('g_bang', 0.45), 0.5); fx('buzzer', T('s_c5speaker'), 0.4)
fx(A + 'groan3.wav', T('s_c5out', 0.3), 0.7); fx(S + 'amb_steps.wav', T('s_c5out', 0.4), 0.5); fx('slam', T('g_slam'), 1.0); fx(S + 'es_metal.wav', T('g_slam'), 0.6); fx('scratch', T('g_bury'), 0.6); fx('thud', T('g_bury', 1.4), 0.7)
# --- глава 6
fx(A + 'engine.wav', T('s_c6lights'), [T('s_c6flee', 2.6), 0.45]); fx(S + 'amb_bang.wav', T('h_pound', 0.2), 0.8); fx('scratch', T('s_crowbarIns', 0.5), 0.8); fx(S + 'es_metal.wav', T('h_two'), 0.4); fx(S + 'es_metal.wav', T('h_four'), 0.5)
for i, k in enumerate(['groan0', 'groan1', 'groan2', 'groan3', 'groan1', 'groan0']): fx(A + f'{k}.wav', T('s_c6horde', 0.4 + i * 0.9), 0.5)
fx(S + 'es_thump.wav', T('s_c6flee'), 0.6); fx('whoosh', T('s_c6flee', 0.3), 0.6); fx('rumble', T('s_c6flee'), T('s_c6flee', 2.5))
# --- глава 7
fx('scratch', T('i_scratch', 0.2), 0.7); fx('slam', T('s_c7tally', 1.6), 0.6)
for i in range(5): fx('click', T(f'i_recM{i}', 0.2), 0.4)
for i in range(4): fx('scratch', T(f'i_noteM{i}'), 0.35)
fx(S + 'es_flick1.wav', T('i_lights', -0.05), 0.8); fx(S + 'es_flick2.wav', T('i_lights', 0.35), 0.6); fx(S + 'es_subdrop.wav', T('i_lights'), 0.6)
fx(S + 'amb_chime.wav', T('i_chime'), 0.9); fx(S + 'es_bell.wav', T('i_chime', 0.05), 0.5); fx(S + 'amb_heart.wav', T('s_c7joe'), 0.7)
# --- музыка по главам
M = lambda ty, a, b=None, **k: music.append({'type': ty, 'from': a, 'to': b, **k} if b is not None else {'type': ty, 'at': a, **k})
M('night', 0, 'a_a3'); M('stop', 'a_a3-0.25'); M('tension', 'a_a3', 'a_day'); M('night', 'a_day', 's_fiveIns'); M('tension', 's_fiveIns', 's_title0'); M('endsting', 's_title0+0.1')
M('night', 's_c1dawn', 's_invIns'); M('pluck', 's_invIns', 's_c1sign'); M('night', 's_c1sign', 's_card3')
M('night', 's_c2hum', 's_timerIns'); M('pluck', 's_timerIns', 's_c2lantern'); M('night', 's_c2lantern', 's_c2night'); M('tension', 's_c2night', 's_card7')
M('tension', 's_c3alarm', 's_dontIns'); M('stop', 's_dontIns-0.2'); M('pluck', 's_dontIns', 's_c3hide'); M('night', 's_c3hide', 's_c3knock'); M('tension', 's_c3knock', 's_card12')
M('night', 's_c4win', 's_mapIns'); M('pluck', 's_mapIns', 's_choiceIns'); M('tension', 's_choiceIns', 's_c4bottles'); M('night', 's_c4bottles', 's_card15')
M('pluck', 's_c45bored', 's_c45tide'); M('night', 's_c45tide', 's_card19')
M('night', 's_c5bottle', 's_heaterIns'); M('pluck', 's_heaterIns', 's_c5mistake'); M('stop', 's_c5mistake-0.2'); M('night', 's_c5mistake', 's_c5click'); M('tension', 's_c5click', 's_county2Ins'); M('night', 's_county2Ins', 's_card24')
M('tension', 's_c6lights', 's_c6flee'); M('stop', 's_c6look-0.3'); M('night', 's_c6look', 's_card30')
M('night', 's_c7tally', 's_recapIns'); M('pluck', 's_recapIns', 's_c7pack'); M('night', 's_c7pack', 'i_lights'); M('tension', 'i_lights', 's_end'); M('endsting', 's_end+0.1'); M('night', 's_end', DUR)
for e in sfx:
    if isinstance(e[1], str) and e[1].startswith('s_') and e[1].split('+')[0].split('-')[0] not in c: print('нет метки', e)
json.dump({'voice': 'episodes/e01_gas/out/voice.wav', 'key': 'D', 'music': music, 'stings': stings, 'sfx': sfx, 'levels': {'music': 0.12, 'fx': 0.26}}, open('episodes/e01_gas/sound.json', 'w'), indent=0)
print(len(sfx), 'sfx', len(music), 'music')
