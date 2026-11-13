"""План сверху для проверки камеры стиля B без рендера: стены/предметы мира заправки + конус обзора камеры (с учётом формата кадра)
   + герои. python3 scripts/plan.py out/water_cam.json out/water_plan.png [--aspect 0.5625] [--shots hook,oner1]
   Данные — scripts/campath.mjs. Прямоугольники мира — GAS ниже (x, z центр, ширина, глубина, подпись), из src/videos/gas/world.ts."""
import json, math, sys, argparse
import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Polygon, Circle
GAS = [  # x, z, w(x), d(z), подпись
  (0, -8.1, 14.4, 0.2, ''), (-7.1, -4, 0.2, 8.2, ''), (7.1, -7.05, 0.2, 2.1, ''), (7.1, -2.45, 0.2, 5.1, ''),  # стены магазина (дверь B z -6..-5)
  (-4, 0, 6.2, 0.25, 'витрина'), (4, 0, 6.2, 0.25, ''), (-4.7, -4.8, 0.75, 3.6, 'стелл.'), (-2.3, -4.8, 0.75, 3.6, ''), (-4.7, -2.72, 0.95, 0.5, ''), (-2.3, -2.72, 0.95, 0.5, ''),
  (-2.3, -7.95, 9.1, 0.12, 'холодильники'), (-6.55, -2.0, 0.8, 2.6, 'кофе'), (6.6, -1.0, 0.6, 0.7, 'ATM'), (4.1, -2.4, 3.6, 1.0, 'касса'),
  (4.7, -4.07, 4.6, 0.14, 'перегородка'), (4.0, -3.8, 2.6, 0.4, ''), (1.85, -3.75, 1.0, 0.36, 'вода'),
  (2.4, -6.8, 0.14, 2.4, ''), (2.4, -4.385, 0.14, 0.63, ''),  # стена зал|подсобка, дверь A z -5.6..-4.7
  (2.55, -7.05, 0.08, 1.8, ''), (4.55, -7.05, 0.08, 1.8, ''), (3.55, -7.95, 2.08, 0.08, ''), (2.825, -6.15, 0.55, 0.08, ''), (4.25, -6.15, 0.6, 0.08, 'камера'),
  (2.85, -7.2, 0.42, 1.6, 'полки'), (9.3, -7.2, 1.8, 1.0, 'бак'), (8.6, -4.3, 1.2, 1.0, 'поддон'),
  (-5, 6.5, 0.45, 0.45, 'столб'), (5, 6.5, 0.45, 0.45, 'столб'), (-2.5, 6.5, 1.0, 0.6, 'колонка'), (2.5, 6.5, 1.0, 0.6, 'кол.4'),
]
CIRC = [(6.5, -7.55, 0.32, 'бойлер'), (5.82, -6.9, 0.19, 'ведро'), (4.4, 6.5, 0.2, 'рупор')]
ap = argparse.ArgumentParser(); ap.add_argument('cam'); ap.add_argument('out'); ap.add_argument('--aspect', type=float, default=1080 / 1920); ap.add_argument('--shots', default='')
ap.add_argument('--step', type=int, default=6, help='кадр конуса каждые N записей (запись = 3 кадра)')
a = ap.parse_args(); D = json.load(open(a.cam)); shots = [s for s in dict.fromkeys(d['shot'] for d in D) if not a.shots or s in a.shots.split(',')]
n = len(shots); cols = min(3, n); rows = math.ceil(n / cols)
fig, axs = plt.subplots(rows, cols, figsize=(7 * cols, 7 * rows), squeeze=False)
for k, sh in enumerate(shots):
  ax = axs[k // cols][k % cols]; R = [d for d in D if d['shot'] == sh]
  for x, z, w, d_, lab in GAS:
    ax.add_patch(Rectangle((x - w / 2, z - d_ / 2), w, d_, fc='#c9c2b2', ec='#333', lw=0.6))
    if lab: ax.text(x, z, lab, fontsize=6, ha='center', va='center', color='#555')
  for x, z, r, lab in CIRC: ax.add_patch(Circle((x, z), r, fc='#e9e4d6', ec='#333', lw=0.6)); ax.text(x, z - r - 0.15, lab, fontsize=6, ha='center', color='#555', clip_on=True)
  xs = [d['pos'][0] for d in R] + [d['look'][0] for d in R]; zs = [d['pos'][2] for d in R] + [d['look'][2] for d in R]
  ax.plot([d['pos'][0] for d in R], [d['pos'][2] for d in R], '-', color='#d8342c', lw=1.2)
  for i, d in enumerate(R):
    if i % a.step and i != len(R) - 1: continue
    p, l = d['pos'], d['look']; vx, vz = l[0] - p[0], l[2] - p[2]; L = math.hypot(vx, vz) or 1; ang = math.atan2(vz, vx)
    hf = math.atan(math.tan(math.radians(d['fov']) / 2) * a.aspect); rr = 6
    c = plt.cm.viridis(i / max(1, len(R) - 1))
    ax.add_patch(Polygon([(p[0], p[2]), (p[0] + rr * math.cos(ang - hf), p[2] + rr * math.sin(ang - hf)), (p[0] + rr * math.cos(ang + hf), p[2] + rr * math.sin(ang + hf))], fc=(*c[:3], 0.12), ec=(*c[:3], 0.7), lw=0.7))
    ax.plot(p[0], p[2], 'o', color=c, ms=3); ax.text(p[0], p[2] + 0.12, f"{d['t']:.1f} y{p[1]:.1f}", fontsize=6, color=c)
    for pid, x, z in d['puts']: ax.plot(x, z, 's' if pid == 'joe' else '^', color='#f0801a' if pid == 'joe' else '#3a8a4a', ms=5, alpha=0.6)
  cx, cz = (min(xs) + max(xs)) / 2, (min(zs) + max(zs)) / 2; s = max(max(xs) - min(xs), max(zs) - min(zs)) / 2 + 2
  ax.set_xlim(cx - s, cx + s); ax.set_ylim(cz + s, cz - s); ax.set_aspect('equal'); ax.set_title(f"{sh}  {R[0]['t']:.1f}–{R[-1]['t']:.1f} c", fontsize=10); ax.grid(alpha=0.2)
for k in range(n, rows * cols): axs[k // cols][k % cols].axis('off')
plt.tight_layout(); plt.savefig(a.out, dpi=70); print(a.out)
