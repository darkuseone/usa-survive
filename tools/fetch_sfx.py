"""Реальные записанные звуки с Mixkit (Mixkit Sound Effects Free License: коммерческое использование и YouTube разрешены без атрибуции;
   распространять файлы отдельно нельзя — поэтому они НЕ в git, а скачиваются этим скриптом в assets/mixkit/).
   python3 tools/fetch_sfx.py   (готовые пропускает)"""
import os, sys, urllib.request
from pathlib import Path
SFX = {  # имя: (id Mixkit, название на сайте)
 'rain_long': (1247, 'Long rain ambience'), 'rain_roof': (1265, 'Heavy rain over metal roof'), 'rain_carglass': (1248, 'Heavy rain on car glass interior'), 'rain_heavy': (1262, 'Heavy rain ambience'),
 'thunder_far': (1278, 'Distant thunder explosion'), 'thunder_rumble': (1296, 'Thunder deep rumble'), 'thunder_mid': (1298, 'Mid strength single thunder'),
 'amb_horror': (2482, 'Horror ambience'), 'amb_terror': (2481, 'Terror night ambiance'), 'amb_suspense': (2510, 'Cinematic suspense ambience'), 'amb_drone': (2749, 'Drone terror ambience'),
 'amb_windhum': (1177, 'Deep cinematic wind hum'), 'amb_coldroom': (1172, 'Wind cold interior'), 'amb_roomtone': (3199, 'Cinematic room tone loop'), 'amb_organ': (2750, 'Drone terror long organ'),
 'hum_fluor': (2132, 'Low electricity humming'), 'hum_neon': (910, 'Electricity buzz'), 'hum_machine': (2504, 'Industrial machine hum'),
 'elec_glitch': (2594, 'Electric buzz glitch'), 'elec_small': (2595, 'Small electric glitch'), 'elec_powerup': (2600, 'Electricity static power up'), 'elec_up2': (2602, 'Electronics power up'),
 'doorbell': (113, 'Modern classic door bell sound'), 'doorbell2': (111, 'Melodic classic door bell'),
 'z_gasp': (963, 'Gasping zombie'), 'z_growl': (1973, 'Zombie monster growl'), 'z_breath': (2233, 'Single zombie breath'), 'z_pain': (2207, 'Exclamation of pain from a zombie'),
 'z_calm': (1956, 'Monster calm growl'), 'z_breath2': (1978, 'Monster breath'), 'z_moan_crowd': (469, 'People moaning sadly'), 'z_scream': (1958, 'Monsters scream'), 'z_creature': (2234, 'Terrifying Creature Breath'),
 'steps_tunnel': (543, 'Footsteps in a tunnel loop'), 'steps_run': (1274, 'Crunchy road fast walking loop'), 'steps_puddle': (536, 'Footsteps in a muddy puddle'),
 'door_metal': (201, 'Prison metal door close'), 'shutter_slide': (200, 'Industrial metal sliding door'), 'metal_slide': (1534, 'Metallic door sliding'), 'metal_hit': (2980, 'Factory metal hard hit'),
 'metal_impact': (783, 'Submarine metal impact'), 'collapse': (2958, 'Collapsing structure'), 'tool_drop': (835, 'Metal tool drop'), 'grill_hit': (2177, 'Metal grill quick hit'), 'can_fall': (389, 'Falling empty can'),
 'keys_drop': (2839, 'Dropping keys in the floor'), 'lock': (2858, 'Gear metallic lock sound'), 'lock2': (2856, 'Gear lock sound'), 'keys': (1558, 'Keys moving'),
 'truck_steady': (1621, 'Truck driving steady'), 'truck_accel': (1617, 'Truck accelerating'), 'truck_stop': (1626, 'Stopping truck'), 'truck_start': (1623, 'Truck start engine'), 'truck_pass': (1627, 'Truck in highway passing by'),
 'car_door': (1564, 'Car door slam'), 'knock_wood': (2182, 'Wood hard hit'), 'slap': (2167, 'Short slap or clap'),
 'water_pour': (1324, 'Pouring water to glass'), 'water_drip': (1879, 'Bathroom sink water drip'), 'water_sip': (1307, 'Sip of water'), 'water_fill': (1819, 'Filling sink with water'),
 'paper_slide': (1530, 'Paper slide'), 'paper_move': (2379, 'Papers being moved or wrinkling'), 'paper_crinkle': (2385, 'Paper crinkle'), 'pencil': (3194, 'Writing pencil'), 'scribble': (2369, 'Writing scribble on paper'),
 'tape': (3102, 'Duct tape bandage'), 'scissors': (2378, 'Scissors cutting paper'), 'page': (1105, 'Big paper page turn'),
 'wh_fast': (1490, 'Fast whoosh transition'), 'wh_air': (2637, 'Fast air transition sweep'), 'wh_wind': (1468, 'Cinematic transition wind swoosh'), 'wh_cine': (1492, 'Cinematic whoosh fast transition'),
 'wh_hit': (2919, 'Movie trailer whoosh hit'), 'wh_deep': (1143, 'Cinematic whoosh deep impact'), 'hit_big': (788, 'Big cinematic impact'), 'hit_horror': (565, 'Hard horror hit drum'), 'hit_horror2': (773, 'Horror impact'),
 'hit_suspense': (2917, 'Suspence cinematic impact'), 'hit_heart': (498, 'Deep heartbeat impact'), 'hit_glass': (677, 'Cinematic glass hit suspense'), 'sweep_terror': (2630, 'Terror sweep of darkness'),
 'trans_terror': (2484, 'Terror transition'), 'sweep_long': (561, 'Cinematic horror trailer long sweep'), 'riser_drama': (632, 'Cinematic drama riser'), 'swell': (786, 'Cinematic suspense swell'), 'riser_short': (790, 'Cinematic trailer riser'),
 'heart_slow': (494, 'Slow heartbeat'), 'heart_fast': (493, 'Fast Heartbeat'), 'heart_mid': (495, 'Heartbeat medium speed'),
 'radio_broken': (2563, 'Broken radio frequency signal'), 'radio_terror': (2566, 'Terror radio frequency'), 'clock_tick': (1046, 'Bell tick tock timer'), 'service_bell': (931, 'Service bell'),
}
def main():
    d = Path(__file__).resolve().parent.parent / 'assets' / 'mixkit'; d.mkdir(parents=True, exist_ok=True); n = 0
    for name, (i, title) in SFX.items():
        p = d / f'{name}.mp3'
        if p.exists() and p.stat().st_size > 1000: continue
        url = f'https://assets.mixkit.co/active_storage/sfx/{i}/{i}-preview.mp3'
        try: p.write_bytes(urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=60).read()); n += 1
        except Exception as e: print('!!', name, i, e)
    print(f'скачано {n}, всего {len(list(d.glob("*.mp3")))} → {d}')
if __name__ == '__main__': main()
