"""sound.json эп. 1 по меткам страницы: только реальные записи (Mixkit, assets/mixkit — скачать tools/fetch_sfx.py) + петли в build/e01_gas/amb.
   Без синтезированной музыки: подложка — кинематографические хоррор-эмбиенты по главам, напряжение — свисты, райзеры, удары.
   python3 episodes/e01_gas/mksound.py  (после node tools/cues.cjs …; переходы — build/e01_gas/trans.json)"""
import json
C = json.load(open('build/e01_gas/cues.json')); c = C['CUE']; DUR = C['DUR']; SC = C['SC']
MK = 'wav:../../assets/mixkit/'; LP = 'wav:../../build/e01_gas/amb/mk_'; SY = 'wav:sfx/'
def T(k, d=0.0): return round(c[k] + d, 3)
sfx = []
def fx(n, at, g): sfx.append([n, at, g])
def mk(n, at, g): fx(MK + n + '.mp3', at, g)
# ---------- подложки
fx(LP + 'rain_roof.wav', 0, [DUR, 0.30])                                     # дождь по жалюзи/крыше — всё время
fx(LP + 'amb_drone.wav', 0, [DUR, 0.20])                                     # низкий тревожный гул
EXT = {'ext0', 'storeOut0', 'c1sign', 'c1signZ', 'c1signOff', 'c2grid', 'c3alarm', 'c3bump', 'c3horde', 'c3drift', 'c4truck', 'c4again', 'peekIns', 'c45tide', 'c5speaker', 'c6truck', 'c6dee', 'c6pump', 'c6horde', 'c6flee', 'c6look', 'c7sign',
       'c4win', 'c4inch', 'c4dee', 'c4deeTalk', 'c4bottles', 'c4leave', 'c3knock'}
for nm, t0, t1 in SC:
    if nm in EXT: fx(LP + 'rain_long.wav', round(t0, 3), [round(t1 + 0.3, 3), 0.42])
fx(LP + 'hum_fluor.wav', 0.1, [T('a_crash'), 0.16]); fx(LP + 'hum_fluor.wav', T('s_c2hum'), [T('c_stops'), 0.2]); fx(LP + 'hum_fluor.wav', T('i_lights'), [DUR, 0.2])
fx(MK + 'hum_machine.mp3', T('s_c2hum'), [T('c_stops'), 0.18])
fx(LP + 'amb_coldroom.wav', T('s_c2coolerIn'), [T('s_c2night'), 0.3]); fx(LP + 'amb_coldroom.wav', T('s_c5hold'), [T('s_handsetIns'), 0.3]); fx(LP + 'amb_coldroom.wav', T('s_c5bang'), [T('s_c5speaker'), 0.3])
# эмбиенты глав вместо музыки
BEDS = [('amb_suspense', 0, 's_title0', 0.32), ('amb_horror', 's_c1dawn', 's_card3', 0.28), ('amb_terror', 's_c2hum', 's_card7', 0.26), ('amb_drone', 's_c3alarm', 's_card12', 0.3),
        ('amb_suspense', 's_c4win', 's_card15', 0.28), ('amb_organ', 's_c45bored', 's_card19', 0.22), ('amb_terror', 's_c5bottle', 's_card24', 0.3), ('amb_drone', 's_c6lights', 's_card30', 0.3),
        ('amb_horror', 's_c7tally', DUR, 0.28)]
for n, a, b, g in BEDS: fx(MK + n + '.mp3', a if isinstance(a, (int, float)) else T(a), [b if isinstance(b, (int, float)) else T(b), g])
# ---------- переходы и заставки
TR = {'tear': [('paper_crinkle', 0.5), ('wh_air', 0.4)], 'whip': [('wh_fast', 0.55)], 'flash': [('hit_glass', 0.6)], 'dip': [('sweep_terror', 0.35)]}
for nm, kind in json.load(open('build/e01_gas/trans.json')).items():
    for n, g in TR.get(kind, []): mk(n, T('s_' + nm, -0.12 if kind == 'whip' else 0), g)
for card in ['card3', 'card7', 'card12', 'card15', 'card19', 'card24', 'card30']:
    mk('hit_horror', T('s_' + card, 0.1), 0.8); mk('tape', T('s_' + card, 0.5), 0.5); mk('thunder_rumble', T('s_' + card, 0.2), 0.35)
mk('hit_big', T('s_title0', 0.1), 0.9); mk('scissors', T('s_title0', 0.05), 0.5)
# ---------- холодное начало
E = [('steps_tunnel', 's_wide0', 0.25), ('paper_crinkle', 's_wide0+0.8', 0.3), ('paper_crinkle', 's_mid0+0.6', 0.3), ('car_door', 'a_lights+0.6', 0.4),
     ('swell', 'a_chime-1.6', 0.5), ('doorbell', 'a_chime', 0.85), ('z_gasp', 'a_chime+0.6', 0.6), ('elec_glitch', 'a_whatever-0.1', 0.6), ('hit_suspense', 'a_whatever-0.05', 0.7),
     ('z_growl', 'a_whatever+0.6', 0.8), ('paper_move', 'a_drop+0.45', 0.4), ('steps_tunnel', 'a_walked+0.45', 0.5), ('z_breath', 'a_walked+1.0', 0.7), ('elec_small', 'a_walked+0.8', 0.5), ('z_creature', 's_zomb0+1.4', 0.8),
     ('steps_run', 'a_a3', 0.6), ('riser_short', 'a_button-0.9', 0.5), ('lock', 'a_hit-0.03', 0.9), ('hit_big', 'a_hit', 0.8), ('door_metal', 'a_hit+0.15', 0.6),
     ('shutter_slide', 'a_steel', 0.9), ('metal_impact', 'a_crash', 1.0), ('collapse', 'a_crash+0.1', 0.4), ('hit_heart', 'a_day', 0.7), ('heart_slow', 'a_day+0.2', 0.6), ('metal_hit', 'a_day+0.5', 0.5), ('z_moan_crowd', 'a_day+1.0', 0.3),
     ('z_calm', 's_storeOut0+0.4', 0.4), ('metal_hit', 's_shutClose0', 0.5), ('grill_hit', 's_shutClose0+0.5', 0.4), ('water_fill', 's_tankIns+0.4', 0.3), ('radio_broken', 's_countyIns', 0.35),
     ('heart_fast', 's_flash19', 0.6), ('z_growl', 's_flash19+0.3', 0.5), ('hit_horror', 'a_nearly', 0.7)]
for n, a, g in E: mk(n, a, g)
for i in range(5): mk('paper_slide', T('s_fiveIns', 0.5 + i * 0.25), 0.4)
# ---------- глава 1
mk('heart_slow', T('s_c1dawn'), 0.4); mk('steps_tunnel', T('s_c1count'), 0.3); mk('pencil', T('s_c1count', 0.8), 0.5); mk('scribble', T('s_c1count', 2.4), 0.5)
for i in range(5): mk('pencil', T(f'b_invM{i}'), 0.45)
mk('paper_slide', T('s_waterIns'), 0.4); [mk('scissors', T('s_nineIns', d), 0.45) for d in (0, 0.9, 2.0)]; mk('hit_suspense', T('s_nineIns', 2.0), 0.5)
fx(LP + 'hum_fluor.wav', T('s_c1sign'), [T('b_dies'), 0.25]); mk('hum_neon', T('s_c1sign'), 0.35); mk('z_calm', T('b_dinner', 0.3), 0.45); mk('z_breath2', T('b_dinner', 1.4), 0.4); mk('thunder_far', T('s_c1sign', 0.5), 0.45)
mk('steps_tunnel', T('s_c1breaker'), 0.4); mk('lock2', T('b_dies', -0.25), 0.9); mk('elec_small', T('b_dies', -0.2), 0.7); mk('sweep_terror', T('b_dies'), 0.4)
mk('metal_slide', T('s_c1shelf', 0.2), 0.7); mk('metal_slide', T('s_c1shelf', 1.6), 0.7); mk('metal_hit', T('s_c1shelf', 3.6), 0.6)
for i in range(3): mk('scribble', T(f'b_ruleM{i}'), 0.5)
mk('tape', T('s_c1rule', 0.1), 0.5)
# ---------- глава 2
mk('water_sip', T('s_c2hum', 0.6), 0.5); mk('elec_glitch', T('c_stops', -0.4), 0.6); mk('elec_small', T('c_stops'), 0.6); mk('trans_terror', T('c_stops', 0.1), 0.4)
mk('elec_small', T('c_fr', 0.25), 0.6); mk('thunder_far', T('s_c2grid', 0.3), 0.5); mk('heart_slow', T('s_c2quiet'), 0.8)
mk('clock_tick', T('s_timerIns'), [T('s_fridgeIns'), 0.5]) if False else fx(MK + 'clock_tick.mp3', T('s_timerIns'), [T('s_fridgeIns'), 0.5])
mk('paper_slide', T('s_fridgeIns'), 0.4); [mk('paper_slide', T(f'c_eatM{i}'), 0.4) for i in range(3)]
mk('metal_slide', T('s_c2lantern', 0.6), 0.3); mk('lock', T('c_lanOn', 0.15), 0.6); mk('door_metal', T('s_c2coolerIn'), 0.4); mk('steps_tunnel', T('s_c2coolerIn', 0.2), 0.35)
mk('riser_drama', T('s_c2coolerDoor'), 0.35); mk('z_moan_crowd', T('s_c2night', 0.2), 0.45); mk('z_breath', T('c_dozens', -0.4), 0.5); mk('hit_heart', T('c_dozens'), 0.6)
# ---------- глава 3
fx(SY.replace('sfx/', '../../build/e01_gas/amb/') + 'caralarm.wav', T('s_c3alarm', 0.2), [T('s_c3horde'), 0.45])
mk('car_door', T('d_some', 0.3), 0.6); mk('z_growl', T('d_some', 0.6), 0.6); mk('radio_broken', T('s_ringIns'), 0.3); mk('swell', T('s_ringIns', 1), 0.4)
fx(LP + 'z_moan_crowd.wav', T('s_c3horde'), [T('s_dontIns'), 0.5]); mk('z_scream', T('s_c3horde', 1.4), 0.5); mk('hit_horror2', T('s_c3horde', 1.4), 0.6)
mk('metal_hit', T('s_weightIns', 0.2), 0.6); mk('scissors', T('s_weightIns', 1.2), 0.5); mk('metal_impact', T('d_bends', -0.2), 0.8); mk('grill_hit', T('d_pops'), 0.8); mk('keys_drop', T('d_pops', 0.3), 0.6); mk('grill_hit', T('d_another'), 0.8); mk('tool_drop', T('d_another', 0.4), 0.6)
for i in range(3): mk('hit_horror2', T(f'd_dM{i}', 0.15), 0.4); mk('paper_slide', T(f'd_dM{i}', -0.1), 0.3)
mk('heart_slow', T('s_c3hide'), 0.6); fx(MK + 'clock_tick.mp3', T('d_eleven', -0.6), [T('s_c3rule'), 0.45]); mk('scribble', T('d_sil', -0.2), 0.5)
mk('z_calm', T('s_c3drift', 0.6), 0.35); mk('thunder_far', T('s_c3drift', 0.2), 0.4)
for i in range(3): mk('knock_wood', T(f'd_kn{i}'), 1.0)
mk('hit_heart', T('d_kn2', 0.3), 0.6)
# ---------- глава 4
mk('metal_slide', T('s_c4win', 2.0), 0.5); mk('steps_tunnel', T('s_c4crawl'), 0.3); mk('metal_slide', T('e_slide'), 0.35); mk('heart_mid', T('s_c4inch'), 0.5)
mk('swell', T('s_c4dee', -0.8), 0.4); mk('truck_pass', T('s_c4truck'), 0.4); mk('radio_terror', T('s_mapIns', 0.1), 0.35); mk('paper_slide', T('s_mapIns'), 0.4)
for i in range(2): mk('scissors', T('s_choiceIns', 0.2 + i * 0.3), 0.4)
mk('heart_slow', T('s_c4ask'), 0.5); mk('metal_slide', T('s_c4bottles', 0.9), 0.6); mk('can_fall', T('s_c4bottles', 0.8), 0.25); mk('steps_puddle', T('e_nods', 0.2), 0.5); mk('steps_puddle', T('e_nods', 1.4), 0.4)
fx(LP + 'truck_steady.wav', T('e_alone', -0.3), [T('s_card15'), 0.3]); mk('hit_suspense', T('e_alone'), 0.5)
# ---------- глава 4.5
mk('paper_move', T('s_c45bored', 1.0), 0.3); mk('z_breath2', T('s_peekIns', 0.5), 0.45); mk('page', T('s_notebookIns'), 0.5)
for k in ('f_nbM0', 'f_nbM1', 'f_nbM2'): mk('pencil', T(k), 0.5)
fx(LP + 'z_moan_crowd.wav', T('s_c45tide'), [T('s_notebook2Ins'), 0.4]); mk('scribble', T('f_loudW'), 0.6); mk('hit_suspense', T('f_loudW', 0.6), 0.5)
# ---------- глава 5
mk('water_drip', T('s_c5bottle', 1.1), 0.6); mk('hit_heart', T('s_c5bottle', 1.6), 0.5); mk('page', T('s_heaterIns'), 0.4)
mk('tool_drop', T('g_open', -0.4), 0.4); mk('water_pour', T('g_open', 0.2), 0.6); mk('water_fill', T('g_open', 1.0), 0.4)
mk('metal_slide', T('g_drag'), 0.6); mk('hit_horror', T('g_never', 0.2), 0.8)
mk('riser_drama', T('s_c5click', -2.0), 0.3); mk('lock2', T('g_clicks'), 1.0); mk('door_metal', T('g_clicks', 0.4), 0.3); mk('z_breath', T('g_clicks', 1.2), 0.6)
mk('z_growl', T('s_c5inside', 0.2), 0.9); mk('hit_suspense', T('s_c5inside'), 0.6); mk('steps_run', T('s_c5run'), 0.7); mk('z_gasp', T('s_c5run', 1.0), 0.6)
mk('door_metal', T('g_shut'), 0.9); mk('hit_big', T('g_shut'), 0.5)
for i in range(4): mk('grill_hit', T('s_c5fog', 0.3 + i * 1.1), 0.4)
mk('heart_fast', T('s_c5fog'), 0.6); mk('z_breath2', T('s_c5fog', 1.6), 0.6)
mk('radio_broken', T('s_handsetIns', 2.2), 0.4); mk('metal_hit', T('g_bang'), 0.8); mk('metal_hit', T('g_bang', 0.45), 0.8); mk('radio_terror', T('s_c5speaker'), 0.4)
mk('z_creature', T('s_c5out', 0.3), 0.7); mk('steps_puddle', T('s_c5out', 0.6), 0.5); mk('steps_run', T('g_sprint', -0.2), 0.6); mk('door_metal', T('g_slam'), 1.0); mk('metal_impact', T('g_slam'), 0.6)
mk('metal_slide', T('g_bury'), 0.7); mk('metal_hit', T('g_bury', 1.4), 0.6); mk('radio_broken', T('s_county2Ins'), 0.3); fx(LP + 'z_moan_crowd.wav', T('s_county2Ins'), [T('s_card24'), 0.4])
# ---------- глава 6
mk('truck_start', T('s_c6lights', 0.2), 0.5); fx(LP + 'truck_steady.wav', T('s_c6truck'), [T('s_c6flee'), 0.3]); mk('car_door', T('s_c6truck', 0.8), 0.6); mk('car_door', T('s_c6truck', 1.6), 0.5)
mk('metal_hit', T('s_c6pump', 0.3), 0.6); mk('metal_hit', T('s_c6pump', 0.8), 0.6); mk('metal_hit', T('h_pound', 0.3), 0.8); mk('metal_hit', T('h_pound', 0.9), 0.8); mk('metal_impact', T('h_open'), 0.7)
mk('tool_drop', T('s_crowbarIns', 0.2), 0.5); mk('metal_slide', T('s_crowbarIns', 0.5), 0.8); mk('grill_hit', T('h_two'), 0.6); mk('metal_slide', T('h_four', -0.3), 0.7); mk('heart_mid', T('s_c6calm'), 0.6)
fx(LP + 'z_moan_crowd.wav', T('s_c6horde'), [T('s_c6look'), 0.55]); mk('z_scream', T('s_c6horde', 2.0), 0.5); mk('z_growl', T('s_c6horde', 3.5), 0.6)
mk('truck_accel', T('s_c6flee'), 0.8); mk('wh_deep', T('s_c6flee', 0.2), 0.5); mk('rain_carglass', T('s_c6look'), 0.45); mk('thunder_far', T('s_c6look', 1.5), 0.4)
# ---------- глава 7
mk('keys', T('i_scratch', -0.2), 0.5); mk('scribble', T('i_scratch', 0.2), 0.7); mk('hit_suspense', T('s_c7tally', 1.6), 0.5)
for i in range(5): mk('pencil', T(f'i_recM{i}', 0.2), 0.4)
mk('paper_slide', T('s_map2Ins'), 0.4); mk('page', T('s_noteIns'), 0.4)
for i in range(4): mk('scribble', T(f'i_noteM{i}'), 0.45)
mk('paper_move', T('s_c7pack', 0.5), 0.4); mk('paper_move', T('s_c7pack', 2.0), 0.4)
mk('elec_powerup', T('i_lights', -0.05), 0.9); mk('elec_up2', T('i_lights', 0.2), 0.6); mk('elec_glitch', T('i_lights', 0.4), 0.5); mk('hit_big', T('i_lights'), 0.6)
mk('hum_neon', T('s_c7sign'), 0.4); mk('swell', T('i_chime', -1.4), 0.5); mk('doorbell', T('i_chime'), 1.0); mk('hit_heart', T('i_chime', 0.9), 0.6); mk('heart_fast', T('s_c7joe'), 0.6)
mk('riser_drama', T('i_knowsW', -2.0), 0.4); mk('hit_big', T('s_end', 0.1), 0.9); mk('thunder_rumble', T('s_end', 0.5), 0.4)
for e in sfx:
    if isinstance(e[1], str): pass
json.dump({'voice': 'episodes/e01_gas/out/voice.wav', 'key': 'D', 'music': [], 'stings': [], 'sfx': sfx, 'levels': {'music': 0.0, 'fx': 0.30}}, open('episodes/e01_gas/sound.json', 'w'), indent=0)
print(len(sfx), 'sfx')
