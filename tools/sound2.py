"""Звук эп. 1 v4 (бумажная вырезка): музыка нотами + шумы по меткам CUE (build/<эп>/cues.json) + голос.
  python tools/sound2.py <эп> <voice.wav> <sfx_dir>  → build/<эп>/audio.wav (−15 LUFS, пик ≤ −1 dBFS)
Музыка: ночь — гул и тиканье; наука — «школьная» щипковая; тайминг-«стинги» гитарой на склейках, как в ситкомах;
при свете — акустический грув; после «пиздец» — грустный тромбон."""
import json, subprocess, sys
from pathlib import Path
import numpy as np
sys.path.insert(0, str(Path(__file__).resolve().parent))
from sound import (SR, T, filt, env, noise, note, m, stereo_reverb, Bus, bass, rhodes, chord, brush, hat, kick, pluck, pad, ks, bell, musicbox,
                   whoosh, thud, pop, clink, chalk, snip, blip, gliss, bubbles, rumble, slam, riser, chomp, sniff, purr, chirp, click, hum, buzzer, load)
import pyloudnorm as pyln

ROOT = Path(__file__).resolve().parent.parent


def strum(bus, t0, notes, g=0.16, dur=1.4, gap=0.014, bright=0.55):
    for i, n in enumerate(notes): bus.add(ks(note(m(n)), dur, g, bright), t0 + i * gap)
def sting(bus, t0, g=1.0):                                          # «склейка»: быстрый бой по струнам (как переходы в ситкомах)
    for k, ch in enumerate([['G2', 'D3', 'G3', 'B3', 'D4', 'G4'], ['C3', 'G3', 'C4', 'E4', 'G4']]): strum(bus, t0 + k * 0.16, ch, 0.2 * g, 1.6 if k else 0.5, 0.009, 0.6)
def trombone(f, d, g=1.0):                                          # «вау-вау»: пила с вибрато, сурдинка — фильтром
    t = T(d); fr = f * (1 + 0.012 * np.sin(2 * np.pi * 5.5 * t)) * (1 - 0.06 * t / d); ph = 2 * np.pi * np.cumsum(fr) / SR
    x = sum(np.sin(k * ph) / k for k in range(1, 14)); wah = 900 + 700 * np.sin(np.pi * t / d)
    return filt(x * env(len(t), 0.03, 0.12, 0.6), 'lowpass', 1600) * g * 0.35
def paper(d=0.18, g=1.0): t = T(d); return filt(noise(d), 'bandpass', [600, 5000]) * np.sin(np.pi * t / d) ** 0.7 * g
def tear(d=0.5, g=1.0):
    t = T(d); x = filt(noise(d), 'bandpass', [900, 6000]); cr = (np.random.default_rng(5).random(len(t)) < 0.004).astype(float); cr = np.convolve(cr, np.hanning(60), 'same')
    return (x * (0.4 + 0.6 * cr) * np.minimum(1, (d - t) / 0.05).clip(0, 1)) * g
def scratch(g=1.0): d = 0.45; t = T(d); f = 300 + 1600 * np.abs(np.sin(2 * np.pi * 3.2 * t)); return filt(noise(d), 'bandpass', [400, 3000]) * 0.5 * g + np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.15 * g * np.exp(-t * 3)
def litter(d, g=1.0): t = T(d); return filt(noise(d), 'bandpass', [2500, 9000]) * (np.abs(np.sin(2 * np.pi * 4 * t)) ** 3) * g * 0.5


def main(ep, voice, sfxdir):
    C = json.load(open(ROOT / 'build' / ep / 'cues.json')); c = C['CUE']; DUR = C['DUR']; sd = Path(sfxdir)
    V = load(voice); V = V / np.abs(V).max() * 0.9
    MUS, FX = Bus(DUR), Bus(DUR)
    A = lambda nm, g=1.0: (lambda x: x * g if x is not None else None)(load(sd / nm))
    stomach, gulp, door, meow = A('stomach.mp3'), A('gulp.mp3'), A('door.mp3'), A('cat_meow.mp3')

    # ======================= МУЗЫКА =======================
    # ночь: гул + редкие басовые щипки (70 BPM), до науки
    b = 60 / 70
    MUS.add(pad(note(m('D2')), c['shortly'] + 0.3, 0.7), 0)
    for i, tt in enumerate(np.arange(0.2, c['roof'], b * 2)): MUS.add(bass(note(m(['D2', 'A1', 'C2', 'A1'][i % 4])), 1.2, 0.5), tt)
    MUS.add(pad(note(m('D2')), c['shortly'] - c['notMean'] + 0.3, 0.6), c['notMean'] - 0.1)
    # крыша: тревожный аккорд
    chord(MUS, c['roof'], ['D3', 'F3', 'Ab3', 'C4'], 2.4, 0.1)
    # наука: «школьная» щипковая мелодия, до мажор, 120 BPM
    sb = 60 / 120 / 2; mel = ['C5', 'E5', 'G5', 'E5', 'F5', 'A5', 'G5', 'E5', 'D5', 'F5', 'E5', 'C5', 'D5', 'B4', 'C5', 'G4']
    k = 0; tt = c['shortly'] + 0.1
    while tt < c['sowhat'] - 0.1:
        MUS.add(pluck(note(m(mel[k % len(mel)])), 0.28, 0.11, 2600), tt)
        if k % 2 == 0: MUS.add(bass(note(m(['C2', 'G1', 'A1', 'F1'][(k // 8) % 4])), 0.4, 0.35), tt)
        k += 1; tt += sb
    # кишки: напряжение — арпеджио с бочкой и подъём, обрыв на «и…»
    k = 0; tt = c['gut'] + 0.05; arp = ['D4', 'F4', 'A4', 'D5']
    while tt < c['back']:
        inten = (tt - c['gut']) / (c['back'] - c['gut']); MUS.add(pluck(note(m(arp[k % 4])) * (2 if inten > 0.6 and k % 2 else 1), 0.22, 0.1 + 0.06 * inten, 1800 + 3000 * inten), tt)
        if k % 4 == 0: MUS.add(kick(0.4 + 0.4 * inten), tt)
        k += 1; tt += 60 / 130 / 4 * 2
    MUS.add(riser(c['back'] - c['gas'], 0.35), c['gas'])
    # свет: акустический грув (96 BPM), G–C–D–C; деревня теплее; «культ» — стинг
    gb = 60 / 96; prog = [['G2', 'D3', 'G3', 'B3', 'D4'], ['C3', 'G3', 'C4', 'E4', 'G4'], ['D3', 'A3', 'D4', 'F#4', 'A4'], ['C3', 'G3', 'C4', 'E4', 'G4']]
    def groove(t0, t1, g=0.1):
        tt, i = t0, 0
        while tt < t1:
            ch = prog[(i // 4) % 4]; strum(MUS, tt, ch if i % 2 == 0 else ch[1:], g * (1 if i % 2 == 0 else 0.6), 0.9, 0.012 if i % 2 == 0 else 0.008)
            if i % 4 == 0: MUS.add(bass(note(m(ch[0])) / 2 * 2, gb * 1.8, 0.45), tt)
            if i % 2 == 1: MUS.add(brush(0.12, 0.1), tt)
            tt += gb; i += 1
    groove(c['where'] - 0.2, c['also'])
    for j in range(6): MUS.add(chirp(0.07), c['village'] + 0.3 + j * 0.13)
    # стоп-пластинка на «тоже», грустный тромбон после «пиздец», финальный грув и аккорд
    MUS.add(gliss(420, 60, 0.45, 0.3), c['also'])
    for i, (n, d) in enumerate([('A3', 0.42), ('G#3', 0.42), ('G3', 0.42), ('F#3', 1.2)]): MUS.add(trombone(note(m(n)), d, 0.8), c['pzdc'] + 0.75 + i * 0.42)
    groove(c['busy'] + 0.4, c['lightOff'], 0.08)
    sting(MUS, c['lightOff'] + 0.05, 1.2); MUS.add(bell(note(m('G5')), 2.0, 0.2), c['lightOff'] + 0.4)
    for tt in [c['roof'], c['shortly'] - 0.05, c['gut'], c['village'] - 0.05, c['toons'] - 0.05]: sting(MUS, tt, 0.8)

    # ======================= ШУМЫ =======================
    FX.add(hum(c['lightOn'], 0.15), 0)
    for tt in np.arange(0, c['shortly'], 1.0): FX.add(click(0.12), tt)
    FX.add(litter(1.2, 0.5), 0.1); FX.add(litter(0.8, 0.4), c['pay'] + 0.6)
    FX.add(whoosh(0.25, True, 0.25), c['what'] - 0.1)
    if meow is not None: FX.add(meow[:int(1.4 * SR)], c['yell'] - 0.05, 0.6)
    for tt in [c['shortly'], c['gut'], c['village'], c['toons']]: FX.add(paper(0.22, 0.5), tt - 0.02)
    FX.add(pop(0.35, 600), c['kitten']); FX.add(pop(0.3, 700), c['belly'])
    for i in range(3): FX.add(blip(880 + i * 120, 0.1, 0.25), c['enzyme'] + i * 0.1)
    FX.add(slam(0.3), c['lactase']); FX.add(snip(0.7), c['sugar']); FX.add(snip(0.5), c['sugar'] + 0.12)
    FX.add(pop(0.5, 300), c['grown'])
    for i in range(9): FX.add(clink(0.18, 2400 + 200 * (i % 3)), c['left'] + 0.45 + i * 0.07)
    FX.add(slam(0.6), c['ten'])
    FX.add(rumble(c['back'] - c['gut'], 0.35), c['gut'])
    for i in range(10): FX.add(bubbles(0.12, 40, 0.2, i), c['water'] + i * 0.25)
    for i in range(10): FX.add(chomp(0.35), c['bact'] + 0.1 + i * 0.1)
    FX.add(bubbles(c['boil'] - c['gas'], 22, 0.45, 11), c['gas']); FX.add(bubbles(c['back'] - c['boil'], 45, 0.5, 12), c['boil'])
    FX.add(slam(0.5), c['gas']); FX.add(slam(0.55), c['boil'])
    if stomach is not None: FX.add(stomach[:int(1.6 * SR)], c['back'] - 0.05, 0.9)
    FX.add(click(0.9), c['lightOn'] - 0.02); FX.add(hum(0.3, 0.2), c['lightOn'])
    FX.add(slam(0.8), c['fuck'])
    FX.add(whoosh(0.5, True, 0.35, 300, 5000), c['saucer'] - 0.1)
    for i in range(8): FX.add(blip(1900, 0.06, 0.15), c['toons'] + i * 0.18); FX.add(hum(0.15, 0.08), c['toons'] + i * 0.18)
    FX.add(slam(0.6), c['cult'])
    FX.add(click(0.5), c['bottom']); FX.add(whoosh(0.15, True, 0.3, 2000, 8000), c['bottom'] + 0.02)
    FX.add(pop(0.35, 500), c['iam']); FX.add(tear(0.45, 0.8), c['diet'] + 0.1)
    FX.add(pop(0.35, 520), c['water2'] - 0.05); FX.add(bell(note(m('E6')), 0.7, 0.15), c['water3'])
    FX.add(pop(0.35, 420), c['catmilk'] - 0.1); FX.add(bell(note(m('G6')), 0.7, 0.15), c['nolact'])
    for i in range(3):
        if gulp is not None: FX.add(gulp[:int(0.5 * SR)], c['drink'] + 0.2 + i * 0.45, 0.55)
    for i in range(3): FX.add(pop(0.25, 400 + 60 * i), c['two'] - 0.2 + i * 0.1)
    for i in range(2): FX.add(thud(0.4, 90, 0.2), c['thirds'] + i * 0.18)
    FX.add(scratch(0.5), c['also'])
    if stomach is not None: FX.add(stomach, c['gurgle'], 0.8)
    FX.add(slam(0.8), c['pzdc'])
    for i in range(6): FX.add(thud(0.25, 110, 0.12), c['run'] + i * 0.08)
    if door is not None: FX.add(door, c['slam'] - 0.05, 0.6)
    FX.add(slam(0.4), c['slam']); FX.add(click(0.6), c['lightOff'] - 0.02)

    # ======================= МИКС =======================
    n = int(DUR * SR); v = np.zeros(n); v[:min(n, len(V))] = V[:n]; mus = MUS.b[:n]; fx = FX.b[:n]
    w = int(0.05 * SR); e = np.sqrt(np.convolve(v ** 2, np.ones(w) / w, 'same')); e = np.convolve(e, np.ones(int(0.25 * SR)) / int(0.25 * SR), 'same')
    duck = 1 - 0.5 * np.clip(e / (e.max() * 0.35 + 1e-9), 0, 1)
    mus = mus / (np.abs(mus).max() + 1e-9) * 0.27 * duck; fx = fx / (np.abs(fx).max() + 1e-9) * 0.5
    st = stereo_reverb(mus, 1.2, 0.22, 1) + stereo_reverb(fx, 0.7, 0.12, 2) + np.stack([v, v], 1)
    meter = pyln.Meter(SR); L = meter.integrated_loudness(st)
    for nm, x in (('голос', np.stack([v, v], 1)), ('музыка', stereo_reverb(mus, 1.2, 0.22, 1)), ('шумы', stereo_reverb(fx, 0.7, 0.12, 2))): print(f'  {nm}: {meter.integrated_loudness(x) - L:+.1f} LU')
    st *= 10 ** ((-15 - L) / 20); lim = 10 ** (-1.2 / 20); a = np.abs(st)
    st *= np.where(a > lim * 0.85, (lim * 0.85 + lim * 0.15 * np.tanh((a - lim * 0.85) / (lim * 0.15))) / np.maximum(a, 1e-9), 1.0)
    out = ROOT / 'build' / ep / 'audio.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_s16le', str(out)], input=st.astype(np.float32).tobytes(), check=True)
    print(out, f'LUFS {meter.integrated_loudness(st):.1f}, peak {20 * np.log10(np.abs(st).max()):.2f} dBFS')


if __name__ == '__main__':
    if len(sys.argv) < 4: sys.exit(__doc__)
    main(*sys.argv[1:4])
