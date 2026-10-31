"""Звук эпизода по описанию: python tools/sound_spec.py <эп>  (читает episodes/<эп>/sound.json и build/<эп>/cues.json) → build/<эп>/audio.wav
Вся музыка и шумы синтезируются (tools/sound.py, sound2.py) — без чужих треков и Content ID. Файлы-сэмплы — assets/sfx.
sound.json:
{ "voice": "episodes/<эп>/out/voice.wav",          # от корня репозитория; без "voice" — звук без голоса (тест/демо)
  "key": "E",                                     # тональность ночной/грув-музыки: E, D, A, C, G
  "music": [ {"type": "night", "from": 0, "to": "lit"},          # тревожный пэд + пульс баса + тиканье
             {"type": "pluck", "from": "shortly", "to": "how"},  # «школьная» щипковая (наука/факты)
             {"type": "tension", "from": "gut", "to": "back"},   # арпеджио с бочкой и подъёмом
             {"type": "groove", "from": "lit", "to": "lied-0.3"},# акустический грув
             {"type": "trombone", "at": "hatBack+0.2"},          # грустный тромбон «вау-вау»
             {"type": "stop", "at": "also"},                    # стоп-пластинка
             {"type": "endsting", "at": "lightOff"} ],
  "stings": ["today", "shortly"],                 # гитарные стинги на склейках со вставками
  "sfx": [ ["slam", "nobody", 0.7], ["pop", "geo", 0.35], ["click", "lit", 0.9], ["foil", "remove", 0.8], ["ticks", 0, "lit"], ["hum", 0, "lit"] ],
  "levels": {"music": 0.22, "fx": 0.7} }
  "bleep": [["mat-0.03", "mat+1.55"]] }           # BLEEP=1 → мат запикан (запиканная версия) → audio_clean.wav
Метка — имя из CUE, число или «имя±сек». Шумы: drips (от, [до, громк.]) rumble/siren/geiger (от, до) slam pop click whoosh paper tear scratch buzzer bubbles chomp snip clink bell blip foil gurgle gulp door meow sniff purr chirp ticks hum riser."""
import json, os, re, subprocess, sys
from pathlib import Path
import numpy as np
sys.path.insert(0, str(Path(__file__).resolve().parent))
from sound import (SR, T, filt, noise, note, m, stereo_reverb, Bus, bass, chord, brush, hat, kick, pluck, pad, bell, whoosh, thud, pop, clink,
                   blip, gliss, slam, riser, click, hum, buzzer, load, bubbles, chomp, snip, sniff, purr, chirp, rumble)
from sound2 import strum, sting, trombone, paper, tear, scratch
import pyloudnorm as pyln

HF = Path(__file__).resolve().parent.parent                       # корень репозитория
KEYS = {'E': (['E2', 'B2', 'E3', 'G#3', 'B3'], ['A2', 'E3', 'A3', 'C#4', 'E4'], ['B2', 'F#3', 'B3', 'D#4', 'F#4'], ['A2', 'E3', 'A3', 'C#4', 'E4']),
        'D': (['D2', 'A2', 'D3', 'F#3', 'A3'], ['G2', 'D3', 'G3', 'B3', 'D4'], ['A2', 'E3', 'A3', 'C#4', 'E4'], ['G2', 'D3', 'G3', 'B3', 'D4']),
        'G': (['G2', 'D3', 'G3', 'B3', 'D4'], ['C3', 'G3', 'C4', 'E4', 'G4'], ['D3', 'A3', 'D4', 'F#4', 'A4'], ['C3', 'G3', 'C4', 'E4', 'G4']),
        'A': (['A2', 'E3', 'A3', 'C#4', 'E4'], ['D3', 'A3', 'D4', 'F#4', 'A4'], ['E3', 'B3', 'E4', 'G#4', 'B4'], ['D3', 'A3', 'D4', 'F#4', 'A4']),
        'C': (['C3', 'G3', 'C4', 'E4', 'G4'], ['F2', 'C3', 'F3', 'A3', 'C4'], ['G2', 'D3', 'G3', 'B3', 'D4'], ['F2', 'C3', 'F3', 'A3', 'C4'])}


def foil(d=0.6, g=1.0):
    t = T(d); r = np.random.default_rng(9); cr = np.convolve((r.random(len(t)) < 0.01).astype(float), np.hanning(40), 'same')
    return filt(noise(d), 'highpass', 3000) * (0.2 + cr) * np.sin(np.pi * t / d) * g


def drip(g=0.5):                                                    # капля в ведро: «плинк» с подъёмом тона + шлепок
    n = int(0.16 * SR); t = np.arange(n) / SR; f = 650 + 1500 * np.minimum(1, t / 0.035)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.045) + 0.25 * noise(0.16)[:n] * np.exp(-t / 0.01)
    return x / (np.abs(x).max() + 1e-9) * g


def main(ep):
    S = json.load(open(HF / 'episodes' / ep / 'sound.json')); C = json.load(open(HF / 'build' / ep / 'cues.json')); c = C['CUE']; DUR = C['DUR']
    def at(v):
        if isinstance(v, (int, float)): return float(v)
        mm = re.match(r'^([A-Za-z0-9_]+)\s*([+-]\s*[\d.]+)?$', v.strip()); base = c[mm.group(1)] if mm.group(1) in c else float(mm.group(1))
        return base + (float(mm.group(2).replace(' ', '')) if mm.group(2) else 0)
    sfxdir = HF / 'assets/sfx'
    FILES = {k: load(sfxdir / f) for k, f in [('gurgle', 'stomach.mp3'), ('gulp', 'gulp.mp3'), ('door', 'door.mp3'), ('meow', 'cat_meow.mp3')]}
    V = load(HF / S['voice']) if S.get('voice') else np.zeros(int(DUR * SR)); V = V / (np.abs(V).max() + 1e-9) * 0.9; MUS, FX = Bus(DUR), Bus(DUR)
    prog = KEYS[S.get('key', 'E')]; root = prog[0][0]
    gb = 60 / 96
    def groove(t0, t1, g=0.09):
        tt, i = t0, 0
        while tt < t1:
            ch = prog[(i // 4) % 4]; strum(MUS, tt, ch if i % 2 == 0 else ch[1:], g * (1 if i % 2 == 0 else 0.6), 0.9, 0.012)
            if i % 4 == 0: MUS.add(bass(note(m(ch[0])), gb * 1.8, 0.45), tt)
            if i % 2 == 1: MUS.add(brush(0.12, 0.1), tt)
            tt += gb; i += 1
    for mu in S.get('music', []):
        ty = mu['type']
        if ty == 'night':
            a, b = at(mu['from']), at(mu['to']); MUS.add(pad(note(m(root)), b - a + 0.3, 0.8), a)
            for i, tt in enumerate(np.arange(a + 0.1, b, 60 / 76)): MUS.add(bass(note(m(root)) * [1, 1, 1.19, 1.12][i % 4], 0.5, 0.45), tt); MUS.add(hat(0.05), tt + 60 / 152)
        elif ty == 'pluck':
            a, b = at(mu['from']), at(mu['to']); mel = [prog[0][3], prog[0][4], prog[1][4], prog[0][4], prog[1][3], prog[2][4], prog[0][4], prog[0][3]]; k, tt = 0, a
            while tt < b: MUS.add(pluck(note(m(mel[k % 8]) + 12), 0.25, 0.1, 2600), tt); k += 1; tt += 0.25
        elif ty == 'tension':
            a, b = at(mu['from']), at(mu['to']); k, tt = 0, a; arp = prog[0][1:]
            while tt < b:
                it = (tt - a) / max(0.1, b - a); MUS.add(pluck(note(m(arp[k % 4])) * (2 if it > 0.6 and k % 2 else 1), 0.22, 0.1 + 0.06 * it, 1800 + 3000 * it), tt)
                if k % 4 == 0: MUS.add(kick(0.4 + 0.4 * it), tt)
                k += 1; tt += 60 / 130 / 2
            MUS.add(riser(min(3, b - a), 0.35), b - min(3, b - a))
        elif ty == 'groove': groove(at(mu['from']), at(mu['to']), mu.get('g', 0.09))
        elif ty == 'trombone':
            for i, (n, d) in enumerate([('A3', 0.4), ('G#3', 0.4), ('G3', 0.4), ('F#3', 1.0)]): MUS.add(trombone(note(m(n)), d, 0.7), at(mu['at']) + i * 0.4)
        elif ty == 'stop': MUS.add(gliss(420, 60, 0.45, 0.3), at(mu['at']))
        elif ty == 'endsting': sting(MUS, at(mu['at']), 1.1); MUS.add(bell(note(m(prog[0][4]) + 12), 2.0, 0.2), at(mu['at']) + 0.35)
    for s0 in S.get('stings', []): sting(MUS, at(s0), 0.7)
    LIB = {'slam': lambda g: slam(g), 'pop': lambda g: pop(g, 500), 'click': lambda g: click(g), 'whoosh': lambda g: whoosh(0.3, True, g, 400, 6000),
           'paper': lambda g: paper(0.2, g), 'tear': lambda g: tear(0.45, g), 'scratch': lambda g: scratch(g), 'buzzer': lambda g: buzzer(g),
           'bubbles': lambda g: bubbles(1.0, 30, g, 3), 'chomp': lambda g: chomp(g), 'snip': lambda g: snip(g), 'clink': lambda g: clink(g),
           'bell': lambda g: bell(note(m(prog[0][4]) + 24), 0.8, g), 'blip': lambda g: blip(1400, 0.08, g), 'foil': lambda g: foil(0.8, g),
           'sniff': lambda g: sniff(g), 'purr': lambda g: purr(1.4, g), 'chirp': lambda g: chirp(g), 'thud': lambda g: thud(g, 80, 0.3)}
    for item in S.get('sfx', []):
        name, t0, g = item[0], at(item[1]), item[2]
        if name == 'ticks': [FX.add(click(0.1), tt) for tt in np.arange(t0, at(g), 1.0)]; continue
        if name == 'drips':                                         # ритм капли ep09: удар в 0.45 + k·1.1; ["drips", от, [до, громкость]]
            t1, gg = at(g[0]), g[1]; k = int(np.ceil((t0 - 0.45) / 1.1))
            while 0.45 + k * 1.1 < t1: FX.add(drip(gg), 0.45 + k * 1.1); k += 1
            continue
        if name == 'rumble': FX.add(rumble(at(g) - t0, 1.0), t0); continue              # гул взрыва/обвала: ["rumble", от, до]
        if name == 'siren':                                                               # сирена гражданской обороны: ["siren", от, до]
            d = at(g) - t0; tt = np.arange(int(d * SR)) / SR; f = 450 + 350 * (0.5 - 0.5 * np.cos(2 * np.pi * tt / 6))
            FX.add(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, np.minimum(tt, d - tt) / 0.8) * 0.5, t0); continue
        if name == 'geiger':                                                              # счётчик Гейгера: ["geiger", от, до]
            rr = np.random.default_rng(7); tt = t0
            while tt < at(g): FX.add(click(0.5 + 0.5 * rr.random()), tt); tt += rr.exponential(0.09)
            continue
        if name == 'hum': FX.add(hum(at(g) - t0, 0.12), t0); continue
        if name == 'riser': FX.add(riser(at(g) - t0, 0.35), t0); continue
        if name in FILES: x = FILES[name]; FX.add(x, t0, g) if x is not None else None; continue
        FX.add(LIB[name](g), t0)
    n = int(DUR * SR); v = np.zeros(n); v[:min(n, len(V))] = V[:n]; vk = os.environ.get('BLEEP') == '1'
    if vk:
        for a0, b0 in S.get('bleep', []):
            i0, i1 = int(at(a0) * SR), int(at(b0) * SR); tt = np.arange(i1 - i0) / SR
            v[i0:i1] = 0.35 * np.sin(2 * np.pi * 1000 * tt) * np.minimum(1, np.minimum(tt, tt[::-1]) / 0.01)
    mus = MUS.b[:n]; fx = FX.b[:n]
    w = int(0.05 * SR); e = np.sqrt(np.convolve(v ** 2, np.ones(w) / w, 'same')); e = np.convolve(e, np.ones(int(0.25 * SR)) / int(0.25 * SR), 'same')
    duck = 1 - 0.5 * np.clip(e / (e.max() * 0.35 + 1e-9), 0, 1); L0 = S.get('levels', {})
    mus = mus / (np.abs(mus).max() + 1e-9) * L0.get('music', 0.22) * duck; fx = fx / (np.abs(fx).max() + 1e-9) * L0.get('fx', 0.7)
    st = stereo_reverb(mus, 1.2, 0.22, 1) + stereo_reverb(fx, 0.7, 0.12, 2) + np.stack([v, v], 1)
    meter = pyln.Meter(SR); L = meter.integrated_loudness(st)
    for nm, x, tg in (('музыка', stereo_reverb(mus, 1.2, 0.22, 1), '−14…−19'), ('шумы', stereo_reverb(fx, 0.7, 0.12, 2), '−11…−13')): print(f'  {nm}: {meter.integrated_loudness(x) - L:+.1f} LU (цель {tg})')
    st *= 10 ** ((-15 - L) / 20); lim = 10 ** (-1.2 / 20); a = np.abs(st)
    st *= np.where(a > lim * 0.85, (lim * 0.85 + lim * 0.15 * np.tanh((a - lim * 0.85) / (lim * 0.15))) / np.maximum(a, 1e-9), 1.0)
    out = HF / 'build' / ep / ('audio_clean.wav' if vk else 'audio.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_s16le', str(out)], input=st.astype(np.float32).tobytes(), check=True)
    print(out, f'LUFS {meter.integrated_loudness(st):.1f}, пик {20 * np.log10(np.abs(st).max()):.2f} dBFS')


if __name__ == '__main__':
    main(sys.argv[1])
