"""Атмосферные шумы «Paper Survivors» (синтез, без сэмплов): дождь, гул неона/ламп, дрон, стон зомби, шаркающие шаги, лязг жалюзи, сердцебиение, ветер.
  python3 tools/ambience.py <папка>   → <папка>/amb_*.wav (44.1 кГц, моно)"""
import sys, numpy as np, subprocess
from pathlib import Path
from scipy.signal import butter, sosfilt
SR = 44100; R = np.random.default_rng(11)
def T(d): return np.arange(int(d * SR)) / SR
def nz(d): return R.standard_normal(int(d * SR))
def f(x, kind, fr, o=2): return sosfilt(butter(o, fr, kind, fs=SR, output='sos'), x)
def norm(x, p=0.9): return x / (np.abs(x).max() + 1e-9) * p
def fade(x, a=0.3, b=0.3):
    x = x.copy(); na, nb = int(a * SR), int(b * SR); x[:na] *= np.linspace(0, 1, na); x[-nb:] *= np.linspace(1, 0, nb); return x

def rain(d):                                   # шум дождя по навесу/стеклу: розовый шум + капли-щелчки
    x = f(nz(d), 'bandpass', [400, 7000]) * 0.5 + f(nz(d), 'lowpass', 900) * 0.6
    drops = np.zeros(len(x)); idx = R.integers(0, len(x) - 400, int(d * 160))
    for i in idx: drops[i:i + 300] += R.uniform(0.2, 1) * np.exp(-np.arange(300) / 40) * R.choice([-1, 1])
    x += f(drops, 'highpass', 2000) * 0.5
    x *= 1 + 0.15 * np.sin(2 * np.pi * 0.13 * T(d)); return fade(norm(x, 0.8), 1.2, 1.2)
def buzz(d):                                   # люминесцентные лампы / неон: 60 Гц США + гармоники + треск
    t = T(d); x = sum(np.sin(2 * np.pi * 120 * k * t) / k for k in range(1, 9)) * 0.3
    x += f(nz(d), 'bandpass', [3000, 6000]) * 0.04 * (1 + np.sin(2 * np.pi * 7.3 * t))
    return fade(norm(x, 0.6), 0.5, 0.5)
def drone(d, f0=55):                           # тёмный дрон: биения двух пил + шум, медленный фильтр
    t = T(d); x = sum(np.sin(2 * np.pi * f0 * k * (1 + 0.003 * i) * t + i) / k for k in (1, 2, 3, 5) for i in (0, 1))
    x += f(nz(d), 'lowpass', 300) * 0.8; x = f(x, 'lowpass', 600); x *= 0.7 + 0.3 * np.sin(2 * np.pi * 0.07 * t)
    return fade(norm(x, 0.8), 2, 2)
def groan(d=2.2, f0=95, seed=0):               # стон: пила с вибрато через форманты «о-у», хрип
    r = np.random.default_rng(seed); t = T(d); fr = f0 * (1 + 0.06 * np.sin(2 * np.pi * 4.5 * t) + 0.15 * np.sin(np.pi * t / d) - 0.1 * t / d)
    ph = np.cumsum(fr) / SR; src = 2 * (ph % 1) - 1 + 0.6 * r.standard_normal(len(t)) * 0.3
    x = f(src, 'bandpass', [350, 650]) * 1.0 + f(src, 'bandpass', [800, 1100]) * 0.5 + f(r.standard_normal(len(t)), 'bandpass', [1500, 3500]) * 0.15
    x *= np.sin(np.pi * t / d) ** 1.5; return norm(x, 0.9)
def steps(n=6, gap=0.62, drag=True):           # шаркающие шаги по плитке
    out = np.zeros(int((n * gap + 0.6) * SR))
    for i in range(n):
        i0 = int(i * gap * SR + R.uniform(-0.03, 0.03) * SR); k = np.arange(int(0.08 * SR))
        hit = f(R.standard_normal(len(k)), 'bandpass', [150, 1800]) * np.exp(-k / (0.012 * SR)); out[i0:i0 + len(k)] += hit
        if drag: m = np.arange(int(0.32 * SR)); out[i0 + 200:i0 + 200 + len(m)] += f(R.standard_normal(len(m)), 'bandpass', [1200, 5000]) * 0.18 * np.sin(np.pi * m / len(m))
    return norm(out, 0.9)
def rattle(d=1.6):                             # стальные жалюзи катятся вниз: частые металлические щелчки + гул ламелей
    out = np.zeros(int(d * SR)); tt = 0
    while tt < d - 0.05:
        i = int(tt * SR); k = np.arange(int(0.03 * SR)); fr = R.uniform(1800, 3200)
        out[i:i + len(k)] += (np.sin(2 * np.pi * fr * k / SR) + 0.5 * R.standard_normal(len(k))) * np.exp(-k / (0.006 * SR)) * R.uniform(0.4, 1)
        tt += R.uniform(0.018, 0.035)
    out += f(R.standard_normal(len(out)), 'bandpass', [200, 900]) * 0.35
    return fade(norm(out, 0.9), 0.05, 0.15)
def heart(n=5, bpm=92):                        # сердцебиение «лаб-даб»
    gap = 60 / bpm; out = np.zeros(int((n * gap + 0.5) * SR))
    for i in range(n):
        for dt, g in ((0, 1), (0.16, 0.7)):
            i0 = int((i * gap + dt) * SR); k = np.arange(int(0.12 * SR)); out[i0:i0 + len(k)] += np.sin(2 * np.pi * 52 * k / SR) * np.exp(-k / (0.03 * SR)) * g
    return norm(f(out, 'lowpass', 180), 0.95)
def bang(n=3):                                 # удары кулаками по стальным жалюзи с той стороны
    out = np.zeros(int((n * 0.55 + 1.2) * SR))
    for i in range(n):
        i0 = int((i * 0.55 + R.uniform(0, 0.12)) * SR); k = np.arange(int(0.9 * SR))
        x = sum(np.sin(2 * np.pi * fr * k / SR) * np.exp(-k / (dc * SR)) for fr, dc in ((97, 0.25), (231, 0.12), (523, 0.06), (1340, 0.03))) + f(R.standard_normal(len(k)), 'lowpass', 2500) * np.exp(-k / (0.02 * SR))
        out[i0:i0 + len(k)] += x * R.uniform(0.7, 1)
    return norm(out, 0.95)
def chime2():                                  # дверной «динь-дон» магазина (две ноты, электронный)
    out = np.zeros(int(1.8 * SR))
    for dt, fr in ((0, 659.3), (0.38, 523.3)):
        i0 = int(dt * SR); k = np.arange(int(1.3 * SR)); t = k / SR
        out[i0:i0 + len(k)] += (np.sin(2 * np.pi * fr * t) + 0.25 * np.sin(2 * np.pi * 2.76 * fr * t) * np.exp(-t * 6)) * np.exp(-t * 2.6)
    return norm(out, 0.9)

def save(x, p): subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f64le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'pcm_s16le', str(p)], input=x.astype(np.float64).tobytes(), check=True)
if __name__ == '__main__':
    d = Path(sys.argv[1]); d.mkdir(parents=True, exist_ok=True)
    for name, x in [('rain', rain(24)), ('buzz', buzz(24)), ('drone', drone(24)), ('groan1', groan(2.4, 92, 1)), ('groan2', groan(1.8, 120, 2)), ('steps', steps(6)),
                    ('rattle', rattle(1.7)), ('heart', heart(6)), ('bang', bang(3)), ('chime', chime2())]: save(x, d / f'amb_{name}.wav'); print(name, f'{len(x) / SR:.2f}s')
