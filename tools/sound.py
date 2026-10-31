"""Звук эпизода кодом: музыка нотами + шумы по меткам сцен (те же CUE, что у картинки) + готовый голос.
  python tools/sound.py <эп> <voice.wav> [sfx_dir]   → build/<эп>/audio.wav  (−15 LUFS, пик ≤ −1 dBFS)
Метки берутся из build/<эп>/cues.json (tools/cues.cjs). Реалистичные «живот», «глоток», «дверь» — из sfx_dir, если есть."""
import json, subprocess, sys
from pathlib import Path
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
import pyloudnorm as pyln

SR = 48000
ROOT = Path(__file__).resolve().parent.parent
rs = np.random.default_rng(7)


# ------------------------------------------------------------------ база
def T(d): return np.arange(int(d * SR)) / SR
def filt(x, kind, f, order=2):
    sos = butter(order, f, btype=kind, fs=SR, output='sos'); return sosfilt(sos, x)
def env(n, a=0.005, r=0.1, curve=4.0):
    t = np.arange(n) / SR; e = np.minimum(1, t / max(a, 1e-4)); dur = n / SR
    return e * np.exp(-curve * np.maximum(0, t - a) / max(dur, 1e-3)) * np.minimum(1, (dur - t) / max(r, 1e-4)).clip(0, 1)
def noise(d): return rs.standard_normal(int(d * SR))
def note(n): return 440 * 2 ** ((n - 69) / 12)                    # MIDI → Гц
NN = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
def m(s):                                                           # 'Bb2' → MIDI
    k = NN[s[0]]; i = 1
    if len(s) > 2 and s[1] in 'b#': k += -1 if s[1] == 'b' else 1; i = 2
    return 12 * (int(s[i:]) + 1) + k


def stereo_reverb(x, size=1.2, mix=0.25, seed=1):
    r = np.random.default_rng(seed); n = int(size * SR); t = np.arange(n) / SR
    out = []
    for ch in range(2):
        ir = r.standard_normal(n) * np.exp(-t * 5.5 / size); ir = filt(ir, 'lowpass', 5000); ir /= np.sqrt((ir ** 2).sum())
        out.append(fftconvolve(x, ir)[:len(x)] * mix + x * (1 - mix * 0.5))
    return np.stack(out, 1)


class Bus:
    def __init__(s, dur): s.b = np.zeros(int(dur * SR) + SR)
    def add(s, sig, t, g=1.0):
        i = int(t * SR)
        if i < 0: sig = sig[-i:]; i = 0
        j = min(len(s.b), i + len(sig)); s.b[i:j] += sig[:j - i] * g


# ------------------------------------------------------------------ инструменты
def bass(f, d=0.6, g=1.0):
    t = T(d); ph = 2 * np.pi * f * t * (1 + 0.01 * np.exp(-t * 40))
    x = np.sin(ph) * np.exp(-t * 3) + 0.45 * np.sin(2 * ph) * np.exp(-t * 6) + 0.2 * np.sin(3 * ph) * np.exp(-t * 9)
    x += 0.15 * filt(noise(d), 'bandpass', [80, 400]) * np.exp(-t * 60)
    return filt(x * env(len(t), 0.004, 0.05, 0.5), 'lowpass', 1100) * g
def rhodes(f, d=1.6, g=1.0, idx=2.2):
    t = T(d); I = idx * np.exp(-t * 3) + 0.25
    x = np.sin(2 * np.pi * f * t + I * np.sin(2 * np.pi * f * t)) * np.exp(-t * 1.6)
    x += 0.12 * np.sin(2 * np.pi * f * 14 * t) * np.exp(-t * 30)
    x *= 1 + 0.15 * np.sin(2 * np.pi * 5 * t)                         # трёмоло
    return x * env(len(t), 0.003, 0.2, 0.3) * g
def chord(bus, t0, notes, d=2.2, g=0.16, strum=0.012):
    for i, n in enumerate(notes): bus.add(rhodes(note(m(n) if isinstance(n, str) else n), d, g), t0 + i * strum)
def brush(d=0.18, g=1.0):
    x = filt(noise(d), 'bandpass', [1800, 9000]); t = T(d); return x * np.sin(np.pi * np.minimum(1, t / d)) ** 2 * g
def hat(g=1.0): d = 0.05; return filt(noise(d), 'highpass', 6000) * np.exp(-T(d) * 90) * g
def kick(g=1.0):
    d = 0.4; t = T(d); f = 50 + 90 * np.exp(-t * 25); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7) * g
def pluck(f, d=0.35, g=1.0, cut=2500):                               # «арп» науки: квадрат с быстрым затуханием
    t = T(d); x = sum(np.sin(2 * np.pi * f * k * t) / k for k in (1, 3, 5, 7, 9))
    return filt(x * np.exp(-t * 9), 'lowpass', cut) * env(len(t), 0.002, 0.05, 0.1) * g
def pad(f, d, g=1.0):
    t = T(d); x = sum(sum(np.sin(2 * np.pi * f * k * (1 + dt) * t) / k for k in range(1, 12)) for dt in (-0.004, 0, 0.005))
    a = np.minimum(1, t / 0.8) * np.minimum(1, (d - t) / 0.8).clip(0, 1); return filt(x * a, 'lowpass', 1400) * g * 0.12
def ks(f, d=1.5, g=1.0, bright=0.5):                               # Karplus–Strong: гитара (через рекурсивный фильтр)
    from scipy.signal import lfilter
    n = int(d * SR); p = max(2, int(SR / f)); x = np.zeros(n); x[:p] = rs.uniform(-1, 1, p)
    a = np.zeros(p + 2); a[0] = 1; a[p] = -0.996 * bright; a[p + 1] = -0.996 * (1 - bright)
    return lfilter([1.0], a, x) * g * 0.5
def bell(f, d=2.0, g=1.0):
    t = T(d); return sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * dc) for r, a, dc in ((1, 1, 2), (2.76, 0.5, 4), (5.4, 0.25, 7), (8.9, 0.1, 10))) * env(len(t), 0.002, 0.1, 0.1) * g
def musicbox(f, g=1.0): t = T(0.8); return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t) + 0.1 * np.sin(2 * np.pi * 3 * f * t)) * np.exp(-t * 6) * g


# ------------------------------------------------------------------ шумы
def whoosh(d=0.5, up=True, g=1.0, f0=300, f1=4000):
    t = T(d); x = noise(d); fc = np.geomspace(f0, f1, 16) if up else np.geomspace(f1, f0, 16); out = np.zeros_like(x); seg = len(x) // 16 + 1
    for i, fcc in enumerate(fc): s = slice(i * seg, (i + 1) * seg); out[s] = filt(x, 'bandpass', [fcc * 0.6, min(fcc * 1.6, 20000)])[s]
    return out * np.sin(np.pi * t / d) ** 1.5 * g
def thud(g=1.0, f=70, d=0.35):
    t = T(d); fr = f + 60 * np.exp(-t * 30); x = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 12)
    return (x + 0.4 * filt(noise(d), 'lowpass', 600) * np.exp(-t * 30)) * g
def pop(g=1.0, f=500): d = 0.12; t = T(d); fr = f * (1 + 2 * np.exp(-t * 60)); return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 35) * g
def clink(g=1.0, f=2600):
    t = T(0.6); return sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * dc) for r, a, dc in ((1, 1, 9), (1.48, 0.6, 12), (2.13, 0.4, 16), (3.1, 0.2, 20))) * g
def glint(g=1.0):
    x = clink(0.6, 3200); t = T(0.6); return (x + 0.5 * np.sin(2 * np.pi * 6400 * t) * np.exp(-t * 14)) * g
def chalk(d=0.5, g=1.0):
    t = T(d); am = (np.abs(np.sin(2 * np.pi * 7 * t + 2 * np.sin(2 * np.pi * 3 * t)))) ** 2
    return filt(noise(d), 'bandpass', [1500, 7000]) * am * np.minimum(1, (d - t) / 0.05).clip(0, 1) * g * 0.6
def snip(g=1.0): d = 0.09; t = T(d); return (filt(noise(d), 'highpass', 2500) * np.exp(-t * 60) + 0.6 * np.sin(2 * np.pi * 3800 * t) * np.exp(-t * 50)) * g
def blip(f=880, d=0.12, g=1.0): t = T(d); return np.sin(2 * np.pi * f * t) * np.exp(-t * 25) * g
def gliss(f0, f1, d, g=1.0):
    t = T(d); f = np.geomspace(f0, f1, len(t)); x = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * np.sin(4 * np.pi * np.cumsum(f) / SR)
    return x * np.sin(np.pi * t / d) * g
def bubbles(d, rate=14, g=1.0, seed=3):
    r = np.random.default_rng(seed); out = np.zeros(int(d * SR))
    for _ in range(int(d * rate)):
        f0 = r.uniform(250, 900); dd = r.uniform(0.03, 0.09); t = T(dd); fr = f0 * (1 + 1.5 * t / dd)
        s = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 40); i = int(r.uniform(0, d - dd) * SR); out[i:i + len(s)] += s * r.uniform(0.3, 1)
    return out * g
def rumble(d, g=1.0):
    t = T(d); x = filt(noise(d), 'lowpass', 160) * (0.6 + 0.4 * np.sin(2 * np.pi * 3 * t + np.sin(2 * np.pi * 0.7 * t)))
    return x * np.minimum(1, t / 0.2) * np.minimum(1, (d - t) / 0.3).clip(0, 1) * g
def slam(g=1.0): x = thud(1.0, 55, 0.6); x[:int(0.5 * SR)] += 0.5 * filt(noise(0.5), 'lowpass', 2500) * np.exp(-T(0.5) * 12); return x * g
def riser(d, g=1.0):
    t = T(d); x = whoosh(d, True, 1.0, 200, 8000) + 0.4 * gliss(110, 880, d); return x * (t / d) ** 2 * g
def chomp(g=1.0): d = 0.1; t = T(d); return filt(noise(d), 'bandpass', [300, 2000]) * np.exp(-t * 40) * g
def sniff(g=1.0): d = 0.16; t = T(d); return filt(noise(d), 'bandpass', [2000, 6000]) * np.sin(np.pi * t / d) ** 2 * g
def purr(d, g=1.0):
    t = T(d); x = filt(noise(d), 'lowpass', 300) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 26 * t))) ; return filt(x, 'lowpass', 400) * np.sin(np.pi * t / d) * g
def chirp(g=1.0):
    d = 0.09; t = T(d); f = 3000 + 2500 * np.sin(np.pi * t / d); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) * g
def click(g=1.0): d = 0.012; return filt(noise(d), 'highpass', 1500) * np.exp(-T(d) * 400) * g
def hum(d, g=1.0): t = T(d); return (np.sin(2 * np.pi * 50 * t) + 0.5 * np.sin(2 * np.pi * 100 * t) + 0.2 * np.sin(2 * np.pi * 150 * t)) * g * 0.3
def buzzer(g=1.0): d = 0.35; t = T(d); return filt(np.sign(np.sin(2 * np.pi * 110 * t)) * 0.5, 'lowpass', 1600) * env(len(t), 0.005, 0.05, 0.5) * g


def load(path, gain=1.0):
    if not path or not Path(path).exists(): return None
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True)
    x = np.frombuffer(r.stdout, np.float32).astype(np.float64); return x / (np.abs(x).max() + 1e-9) * gain


def main(ep, voice, sfxdir=None):
    C = json.load(open(ROOT / 'build' / ep / 'cues.json')); c = C['CUE']; DUR = C['DUR']; TURN = C['TURN']
    sd = Path(sfxdir) if sfxdir else None
    V = load(voice); V = V / np.abs(V).max() * 0.9
    MUS, FX = Bus(DUR), Bus(DUR)

    # ======================= МУЗЫКА =======================
    # A: нуар на кухне (84 BPM), ре минор; до «Чё?» — только гул и удары баса
    beat = 60 / 84
    MUS.add(pad(note(m('D2')), 3.2, 0.9), 0)
    for k, tt in enumerate([0.25, 0.97, 2.13]): MUS.add(bass(note(m('D2')), 0.9, 0.9), tt)
    prog = [['D3', 'F3', 'A3', 'C4', 'E4'], ['Bb2', 'D3', 'F3', 'A3', 'C4'], ['G2', 'Bb2', 'D3', 'F3', 'A3'], ['A2', 'C#3', 'G3', 'Bb3', 'E4']]
    walk = [['D2', 'F2', 'A2', 'C3'], ['Bb1', 'D2', 'F2', 'A2'], ['G1', 'Bb1', 'D2', 'F2'], ['A1', 'C#2', 'E2', 'G2']]
    t0 = c['stand']; bar = 0
    while t0 < c['dive'] - 0.05:
        ch = prog[bar % 4]; chord(MUS, t0, ch, 2.4, 0.11)
        for i in range(4):
            tb = t0 + i * beat
            if tb >= c['dive']: break
            MUS.add(bass(note(m(walk[bar % 4][i])), beat * 0.95, 0.75), tb)
            if i in (1, 3): MUS.add(brush(0.16, 0.18), tb)
            MUS.add(hat(0.06), tb + beat / 2)
        t0 += 4 * beat; bar += 1
    # B: наука (120 BPM) — арпеджио + пэд, к тоннелю добавляется бочка, к ПОНОСУ — подъём; в TURN — тишина
    sb = 60 / 120 / 4; arps = [['D4', 'F4', 'A4', 'D5'], ['Bb3', 'D4', 'F4', 'Bb4'], ['C4', 'E4', 'G4', 'C5'], ['A3', 'C#4', 'E4', 'A4']]
    MUS.add(pad(note(m('D3')), c['grow'] - c['kitten'] + 0.6, 1.0), c['kitten'] - 0.1); MUS.add(pad(note(m('A2')), c['sugar'] - c['grow'], 1.0), c['grow'])
    k = 0; tt = c['kitten']
    while tt < c['poo']:
        bar_i = int((tt - c['kitten']) / (16 * sb)) % 4; n = arps[bar_i][k % 4] if (k // 4) % 2 == 0 else arps[bar_i][3 - k % 4]
        inten = min(1, max(0, (tt - c['sugar']) / (c['poo'] - c['sugar'])))
        MUS.add(pluck(note(m(n)) * (2 if inten > 0.6 and k % 2 else 1), 0.3, 0.12 + 0.06 * inten, 1800 + 3000 * inten), tt)
        if tt >= c['sugar'] and k % 4 == 0: MUS.add(kick(0.5 + 0.3 * inten), tt)
        if tt >= c['sugar'] and k % 8 == 4: MUS.add(brush(0.12, 0.25), tt)
        k += 1; tt += sb
    MUS.add(riser(c['poo'] - c['bact'], 0.35), c['bact'])
    # C: ПОВОРОТ — лампа: тёплый аккорд фа мажор; клише-котик — музыкальная шкатулка
    chord(MUS, c['lamp'], ['F2', 'C3', 'A3', 'E4', 'G4'], 4.0, 0.16, 0.03); MUS.add(pad(note(m('F2')), c['village'] - c['lamp'] + 0.5, 0.9), c['lamp'])
    for i, n in enumerate(['C6', 'A5', 'F5', 'G5', 'A5', 'C6']): MUS.add(musicbox(note(m(n)), 0.22), c['kitty'] + i * 0.16)
    # D: деревня — гитара (Karplus–Strong), фа мажор, 96 BPM; на «мультфильмах» — старая пластинка
    gb = 60 / 96; strum = [['F2', 'C3', 'F3', 'A3', 'C4'], ['C2', 'G2', 'C3', 'E3', 'G3'], ['Bb1', 'F2', 'Bb2', 'D3', 'F3'], ['F2', 'C3', 'F3', 'A3', 'C4']]
    tt = c['village']; i = 0
    while tt < c['cartoons']:
        chs = strum[(i // 4) % 4]; pat = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]
        for j, n in enumerate(chs): MUS.add(ks(note(m(n)), 1.2, 0.16, 0.5), tt + j * 0.012)
        tt += gb * 2; i += 2
    for j in range(5): MUS.add(chirp(0.08), c['village'] + 0.4 + j * 0.13); MUS.add(chirp(0.06), c['circle'] + 1.2 + j * 0.11)
    for j, n in enumerate(['F4', 'A4', 'C5', 'A4', 'F4', 'C4']): MUS.add(musicbox(note(m(n)), 0.16), c['cartoons'] + j * 0.2)
    # E: тёплая кухня (84 BPM): Fmaj7 – Dm7 – Gm7 – C7; на «лактаза тоже» — пластинка останавливается
    progW = [['F3', 'A3', 'C4', 'E4'], ['D3', 'F3', 'A3', 'C4'], ['G2', 'Bb2', 'D3', 'F3'], ['C3', 'E3', 'Bb3', 'D4']]
    walkW = [['F1', 'A1', 'C2', 'E2'], ['D2', 'C2', 'A1', 'F1'], ['G1', 'A1', 'Bb1', 'B1'], ['C2', 'E2', 'G2', 'Bb1']]
    stop = c['lact2'] + 0.1; t0 = c['busted']; bar = 0
    while t0 < stop:
        chord(MUS, t0, progW[bar % 4], 2.4, 0.09)
        for i in range(4):
            tb = t0 + i * beat
            if tb >= stop: break
            MUS.add(bass(note(m(walkW[bar % 4][i])), beat * 0.95, 0.6), tb)
            if i in (1, 3): MUS.add(brush(0.16, 0.14), tb)
            MUS.add(hat(0.05), tb + beat / 2)
        t0 += 4 * beat; bar += 1
    MUS.add(gliss(420, 60, 0.45, 0.35), stop)                               # «зажёванная пластинка»
    # F: трон и постер — лаунж и финальный аккорд
    t0 = c['notake'] - 0.05; bar = 0
    while t0 < c['poster']:
        chord(MUS, t0, progW[bar % 4], 2.4, 0.08)
        for i in range(4):
            tb = t0 + i * beat
            if tb >= c['poster']: break
            MUS.add(bass(note(m(walkW[bar % 4][i])), beat * 0.95, 0.55), tb)
            if i in (1, 3): MUS.add(brush(0.16, 0.12), tb)
        t0 += 4 * beat; bar += 1
    chord(MUS, c['poster'], ['F2', 'C3', 'G3', 'A3', 'D4', 'G4'], 3.2, 0.15, 0.025); MUS.add(bass(note(m('F1')), 2.5, 0.7), c['poster'])
    MUS.add(bell(note(m('F5')), 2.5, 0.25), c['three'])

    # ======================= ШУМЫ =======================
    A = lambda name, g=1.0: (lambda x: x * g if x is not None else None)(load(sd / name) if sd else None)
    stomach, gulp, door = A('stomach.mp3'), A('gulp.mp3'), A('door.mp3')
    FX.add(hum(c['dive'] - c['saucerCut'] + 0.3, 0.25), c['saucerCut'] - 0.1)                       # холодильник
    for tt in np.arange(0, c['dive'], 1.0): FX.add(click(0.12), tt)                                   # часы тикают
    FX.add(glint(0.5), c['eyes']); FX.add(thud(0.6, 45, 0.8), c['eyes'])
    FX.add(whoosh(0.35, True, 0.35), c['saucerCut'] - 0.15)
    for i in range(30): FX.add(clink(0.05, 2200 + 300 * (i % 3)), c['slowly'] + i * 0.028)
    FX.add(whoosh(0.4, True, 0.35, 200, 2000), c['stand']); FX.add(clink(0.25), c['milk']); FX.add(glint(0.3), c['milk'] + 0.05)
    FX.add(chalk(0.55, 0.5), c['boxes']); FX.add(chalk(0.4, 0.45), c['box']); FX.add(chalk(0.3, 0.45), c['food'])
    FX.add(buzzer(0.3), c['notfood']); FX.add(whoosh(0.18, True, 0.3, 1000, 6000), c['notfood'])
    FX.add(thud(0.7, 60), c['sit'] + 0.2); FX.add(pop(0.3, 700), c['explain'])
    FX.add(pop(0.45, 400), c['ticket']); FX.add(whoosh(0.3, True, 0.25, 800, 5000), c['ticket']); FX.add(slam(0.55), c['litter'])
    FX.add(whoosh(0.6, True, 0.5, 200, 6000), c['dive']); FX.add(pop(0.5, 220), c['kitten'] - 0.05)
    for i in range(5): FX.add(blip(1200 + 150 * i, 0.08, 0.12), c['mama'] + i * 0.25)
    FX.add(whoosh(0.5, True, 0.35, 300, 3000), c['belly'] - 0.1)
    for i in range(3): FX.add(blip(660 + i * 110, 0.12, 0.3), c['enzyme'] + i * 0.12)
    for i in range(3): FX.add(snip(0.55), c['split'] + 0.05 + i * 0.09)
    FX.add(gliss(180, 520, 0.9, 0.25), c['grow'])
    for i in range(9): FX.add(blip(700 - i * 50, 0.15, 0.15), c['left'] + i * 0.09)
    FX.add(bell(note(m('A5')), 1.5, 0.3), c['tenth'] - 0.15)
    FX.add(rumble(TURN - c['sugar'], 0.5), c['sugar'])
    for i in range(8): FX.add(bubbles(0.2, 30, 0.25, i), c['water'] + i * 0.25)
    for i in range(10): FX.add(chomp(0.35), c['bact'] + 0.1 + i * 0.11)
    FX.add(bubbles(c['boil'] - c['gas'], 22, 0.45, 11), c['gas']); FX.add(bubbles(TURN - c['boil'], 45, 0.55, 12), c['boil'])
    FX.add(slam(0.5), c['gas']); FX.add(slam(0.6), c['boil']); FX.add(slam(1.0), c['poo']); FX.add(buzzer(0.3), c['poo'] + 0.05)
    if stomach is not None: FX.add(stomach[:int(1.6 * SR)], c['boil'] - 0.2, 0.45)
    FX.add(whoosh(0.5, False, 0.5, 200, 8000), TURN - 0.3)
    FX.add(click(0.7), c['lamp'] - 0.05); FX.add(hum(0.5, 0.25), c['lamp'])
    FX.add(whoosh(0.6, True, 0.4, 300, 5000), c['village'] - 0.5)
    for i in range(6): FX.add(chomp(0.12), c['lick'] + i * 0.09)
    FX.add(chalk(0.35, 0.35), c['fat']); FX.add(chalk(0.35, 0.35), c['less'])
    for tt in np.arange(c['cartoons'], c['busted'], 1 / 24): FX.add(click(0.08), tt)                # проектор
    FX.add(slam(0.55), c['myth'])
    FX.add(whoosh(0.3, True, 0.3), c['busted'] - 0.1); FX.add(clink(0.35, 2400), c['bottom'] + 0.05); FX.add(whoosh(0.25, True, 0.45, 600, 7000), c['caught'])
    FX.add(thud(0.5, 90, 0.3), c['caught'] + 0.15)
    for i in range(3): FX.add(sniff(0.45), c['sniff'] + i * 0.22)
    FX.add(purr(1.6, 0.6), c['tasty'])
    FX.add(whoosh(0.3, True, 0.3), c['box2'] - 0.1); FX.add(thud(0.5, 80), c['box2'] + 0.1); FX.add(slam(0.4), c['litter2'])
    FX.add(whoosh(0.25, True, 0.45, 600, 7000), c['you'] - 0.1)
    FX.add(pop(0.35, 500), c['water2'] - 0.1); FX.add(bell(note(m('E6')), 0.8, 0.15), c['water2'] + 0.45)
    FX.add(pop(0.35, 420), c['catmilk'] - 0.15); FX.add(bell(note(m('G6')), 0.8, 0.15), c['nolact'])
    for i in range(3):
        if gulp is not None: FX.add(gulp[:int(0.5 * SR)], c['drink'] + 0.35 + i * 0.5, 0.5)
        else: FX.add(thud(0.4, 120, 0.2), c['drink'] + 0.35 + i * 0.5)
    FX.add(whoosh(0.4, True, 0.25), c['twothirds'] - 0.5)
    for i in range(2): FX.add(buzzer(0.12), c['twothirds'] + 0.3 + i * 0.15)
    if stomach is not None: FX.add(stomach, c['lact2'] + 0.3, 0.55); FX.add(stomach, c['throne'] - 0.1, 0.6)
    else: FX.add(rumble(1.5, 0.6), c['lact2'] + 0.3)
    FX.add(whoosh(0.3, True, 0.35, 400, 5000), c['tomq'] - 0.05)
    for i in range(6): FX.add(thud(0.25, 100, 0.12), c['notake'] + 0.6 + i * 0.11)
    if door is not None: FX.add(door, c['notake'] + 1.1, 0.6)
    else: FX.add(slam(0.6), c['notake'] + 1.12)
    FX.add(pop(0.35, 600), c['sub']); FX.add(whoosh(0.4, True, 0.3), c['poster'] - 0.1)
    for tt in np.arange(c['poster'], DUR, 0.5): FX.add(click(0.12), tt)

    # ======================= МИКС =======================
    n = max(len(MUS.b), len(FX.b), len(V)); n = int(DUR * SR)
    v = np.zeros(n); v[:min(n, len(V))] = V[:n]
    mus = MUS.b[:n]; fx = FX.b[:n]
    # дакинг музыки под голос
    w = int(0.05 * SR); e = np.sqrt(np.convolve(v ** 2, np.ones(w) / w, 'same')); e = np.convolve(e, np.ones(int(0.25 * SR)) / int(0.25 * SR), 'same')
    duck = 1 - 0.55 * np.clip(e / (e.max() * 0.35 + 1e-9), 0, 1)
    mus = mus / (np.abs(mus).max() + 1e-9) * 0.5 * duck
    fx = fx / (np.abs(fx).max() + 1e-9) * 0.72
    st = stereo_reverb(mus, 1.6, 0.3, 1) + stereo_reverb(fx, 0.9, 0.18, 2) + np.stack([v, v], 1)
    meter = pyln.Meter(SR); L = meter.integrated_loudness(st)
    for nm, x in (('голос', np.stack([v, v], 1)), ('музыка', stereo_reverb(mus, 1.6, 0.3, 1)), ('шумы', stereo_reverb(fx, 0.9, 0.18, 2))):
        print(f'  {nm}: {meter.integrated_loudness(x) - L:+.1f} LU от общего')
    st *= 10 ** ((-15 - L) / 20)
    pk = np.abs(st).max(); lim = 10 ** (-1.2 / 20)
    if pk > lim:                                                      # мягкий лимитер на пиках
        a = np.abs(st); g = np.where(a > lim * 0.85, (lim * 0.85 + (lim - lim * 0.85) * np.tanh((a - lim * 0.85) / (lim - lim * 0.85))) / np.maximum(a, 1e-9), 1.0); st *= g
    L2 = meter.integrated_loudness(st); out = ROOT / 'build' / ep / 'audio.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_s16le', str(out)], input=st.astype(np.float32).tobytes(), check=True)
    print(out, f'LUFS {L2:.1f}, peak {20 * np.log10(np.abs(st).max()):.2f} dBFS, {n / SR:.2f} s')


if __name__ == '__main__':
    if len(sys.argv) < 3: sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None)
