/* «Аппликация» — движок рисованных кодом мультиков (canvas 2D, рендер HyperFrames).
   Эстетика: бумажная вырезка в духе ранних «Южного парка» (цветная бумага, ножничный край, тонкий тёмный контур,
   мягкая тень от каждой группы деталей), анимация «стоп-моушен» — позы держатся, детали чуть «переложены рукой» на двойках.
   Коллаж: факты — на вырезках, скотче и пробковой доске; удары — буквами «письма с угрозами» (ransom).
   Всё считается от времени t; случайность — только с зерном (FRAME = номер рисунка, меняется на двойках).
   Размер кадра W×H приходит из data.js (episode.json → "size", по умолчанию 1920×1080). */
const DFPS = 12;                                                   // W, H, DUR, T0, LINES — из data.js (tools/mkpage.py)
const cv = document.getElementById('c'), out = cv.getContext('2d');
const ink = document.createElement('canvas'); ink.width = W; ink.height = H;
let ctx = ink.getContext('2d');
let FRAME = 0, S = 1; const SS = [];
const paper = document.createElement('canvas'); paper.width = W; paper.height = H; (function () { const g = paper.getContext('2d'); g.fillStyle = '#1a1716'; g.fillRect(0, 0, W, H); })();
const grain = document.createElement('canvas'); grain.width = 4; grain.height = 4;

// ------------------------------------------------------------------ математика
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function hsh(...v) { let h = 2166136261; for (const x of v) { h ^= (x | 0); h = Math.imul(h, 16777619); } return h >>> 0; }
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const sm = k => { k = clamp(k); return k * k * (3 - 2 * k); };
const eo = k => 1 - Math.pow(1 - clamp(k), 3);
const eio = k => { k = clamp(k); return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
const pr = (t, a, b) => clamp((t - a) / (b - a));
function popK(t, t0, d = 0.3) { const u = clamp((t - t0) / d); return u >= 1 ? 1 : 1 - Math.exp(-6 * u) * Math.cos(u * 11); }
function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }
function mix(h1, h2, k) { const a = parseInt(h1.slice(1), 16), b = parseInt(h2.slice(1), 16); const c = s => Math.round(lerp((a >> s) & 255, (b >> s) & 255, clamp(k)));
  return '#' + ((1 << 24) + (c(16) << 16) + (c(8) << 8) + c(0)).toString(16).slice(1); }
const step = (t, fps = 12) => Math.floor(t * fps) / fps;            // стоп-моушен: движение ступеньками

// ------------------------------------------------------------------ трансформации
function push(x, y, s = 1, r = 0, fx = 1, sy = 1) { ctx.save(); SS.push(S); ctx.translate(x, y); if (r) ctx.rotate(r); ctx.scale(s * fx, s * sy); S *= s; }
function pop() { ctx.restore(); S = SS.pop(); }
function cam(cx, cy, z, rot = 0, shake = 0) {
  const r = rng(hsh(FRAME, 99)); const wx = shake ? (r() - 0.5) * shake : 0, wy = shake ? (r() - 0.5) * shake : 0;
  ctx.save(); SS.push(S); ctx.translate(W / 2 + wx, H / 2 + wy); if (rot) ctx.rotate(rot); ctx.scale(z, z); ctx.translate(-cx, -cy); S *= z;
}
/* «переложено рукой»: крошечный сдвиг/поворот детали, меняется на двойках */
function jig(key, amt = 1) { const r = rng(hsh(FRAME, key, 7)); return [(r() - 0.5) * 1.6 * amt, (r() - 0.5) * 1.6 * amt, (r() - 0.5) * 0.006 * amt]; }

// ------------------------------------------------------------------ геометрия
function spline(cp, closed = true, n = 8) {
  const P = []; const L = cp.length, m = closed ? L : L - 1;
  for (let i = 0; i < m; i++) {
    const p0 = cp[(i - 1 + L) % L], p1 = cp[i], p2 = cp[(i + 1) % L], p3 = cp[(i + 2) % L];
    const a0 = closed || i > 0 ? p0 : p1, a3 = closed || i < L - 2 ? p3 : p2;
    for (let k = 0; k < n; k++) { const t = k / n, t2 = t * t, t3 = t2 * t;
      P.push([0.5 * ((2 * p1[0]) + (-a0[0] + p2[0]) * t + (2 * a0[0] - 5 * p1[0] + 4 * p2[0] - a3[0]) * t2 + (-a0[0] + 3 * p1[0] - 3 * p2[0] + a3[0]) * t3),
              0.5 * ((2 * p1[1]) + (-a0[1] + p2[1]) * t + (2 * a0[1] - 5 * p1[1] + 4 * p2[1] - a3[1]) * t2 + (-a0[1] + 3 * p1[1] - 3 * p2[1] + a3[1]) * t3)]); }
  }
  if (!closed) P.push(cp[L - 1]); return P;
}
function pathOf(pts, close = true) { const p = new Path2D(); p.moveTo(pts[0][0], pts[0][1]); for (const v of pts) p.lineTo(v[0], v[1]); if (close) p.closePath(); return p; }
function bbOf(pts) { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const [x, y] of pts) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y); } return [a, b, c, d]; }
function ellPts(cx, cy, rx, ry, rot = 0, n = 40) { const P = []; for (let i = 0; i < n; i++) { const a = i / n * 6.2832, x = Math.cos(a) * rx, y = Math.sin(a) * ry; P.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]); } return P; }
function resampleN(pts, N) {
  let L = 0; const d = [0]; for (let i = 1; i < pts.length; i++) { L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); d.push(L); }
  const o = []; let j = 1; for (let i = 0; i < N; i++) { const s = L * i / (N - 1); while (j < d.length - 1 && d[j] < s) j++; const k = (s - d[j - 1]) / ((d[j] - d[j - 1]) || 1); o.push([lerp(pts[j - 1][0], pts[j][0], k), lerp(pts[j - 1][1], pts[j][1], k)]); }
  return o;
}
function morphPts(A, B, k) { const N = 90, ra = resampleN(A.concat([A[0]]), N), rb = resampleN(B.concat([B[0]]), N); return ra.map((p, i) => [lerp(p[0], rb[i][0], k), lerp(p[1], rb[i][1], k)]); }
/* ножничный край: контур ломается на короткие отрезки с крошечным разбросом (зерно постоянное — форма вырезана один раз) */
function cut(pts, seed, stepPx = 16, amt = 1.1) {
  const P = []; const r = rng(seed); let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  const n = Math.max(6, Math.round(L / stepPx)); const R = resampleN(pts.concat([pts[0]]), n + 1).slice(0, n);
  return R.map(([x, y]) => [x + (r() - 0.5) * amt * 2, y + (r() - 0.5) * amt * 2]);
}
function tube(cl, w0, w1) {                                       // трубка по осевой (рукава, хвост, лапы)
  const P = cl.length > 2 ? spline(cl, false, 8) : resampleN(cl, 10), n = P.length, Lf = [], Rt = [];
  for (let i = 0; i < n; i++) { const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, w = lerp(w0, w1, i / (n - 1)) / 2;
    Lf.push([P[i][0] - dy / L * w, P[i][1] + dx / L * w]); Rt.push([P[i][0] + dy / L * w, P[i][1] - dx / L * w]); }
  return { pts: Lf.concat(Rt.reverse()), axis: P };
}

// ------------------------------------------------------------------ бумага
const TEX = (() => {                                              // волокнистая фактура цветной бумаги (серый, поверх цвета multiply/overlay)
  const c = document.createElement('canvas'); c.width = c.height = 384; const g = c.getContext('2d'), r = rng(31);
  g.fillStyle = '#808080'; g.fillRect(0, 0, 384, 384);
  const id = g.getImageData(0, 0, 384, 384), d = id.data; for (let i = 0; i < d.length; i += 4) { const n = (r() - 0.5) * 34; d[i] += n; d[i + 1] += n; d[i + 2] += n; } g.putImageData(id, 0, 0);
  for (let i = 0; i < 900; i++) { const x = r() * 384, y = r() * 384, a = r() * 6.28, l = 4 + r() * 20; g.strokeStyle = r() < 0.5 ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.18)'; g.lineWidth = 0.6 + r() * 0.8; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
  for (let i = 0; i < 60; i++) { const x = r() * 384, y = r() * 384, rad = 20 + r() * 60, gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, r() < 0.5 ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
  return c;
})();
let TEXP = null;
/* деталь из цветной бумаги: заливка + фактура + ножничный край + тонкий тёмный контур */
function piece(pts, col, o = {}) {
  const P = o.raw ? pts : cut(pts, o.seed ?? hsh(Math.round(pts[0][0]), Math.round(pts[0][1]), pts.length), o.step ?? 16, o.edge ?? 0.65), path = pathOf(P);
  ctx.save(); ctx.globalAlpha = o.a ?? 1; ctx.fillStyle = col; ctx.fill(path);
  if (o.tex !== false) { if (!TEXP) TEXP = ctx.createPattern(TEX, 'repeat'); ctx.clip(path); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = (o.a ?? 1) * (o.texA ?? 0.42); ctx.fillStyle = TEXP; ctx.fill(path); }
  ctx.restore();
  if (o.shade) { ctx.save(); ctx.clip(path); o.shade(); ctx.restore(); }
  if (o.line !== false) { ctx.save(); ctx.globalAlpha = (o.a ?? 1) * (o.la ?? 0.9); ctx.strokeStyle = o.lc || '#1c1512'; ctx.lineWidth = (o.lw ?? 2.6) / S; ctx.lineJoin = 'round'; ctx.stroke(path); ctx.restore(); }
  return path;
}
function blobP(cp, col, o = {}) { return piece(spline(cp, true, o.n ?? 8), col, o); }
function ellP(cx, cy, rx, ry, col, o = {}) { return piece(ellPts(cx, cy, rx, ry, o.rot || 0, o.np ?? 40), col, o); }
function rectP(x, y, w, h, col, o = {}) { return piece([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], col, { step: 24, ...o }); }
function stroke(pts, col, w, o = {}) {                            // маркер/фломастер: линия с концами-закруглениями
  ctx.save(); ctx.globalAlpha = o.a ?? 1; ctx.strokeStyle = col; ctx.lineWidth = w / S; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const P = o.smooth === false || pts.length < 3 ? pts : spline(pts, false, 6); ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]); for (const p of P) ctx.lineTo(p[0], p[1]); ctx.stroke(); ctx.restore();
}
function dot(x, y, r, col, a = 1) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.3); ctx.fill(); ctx.restore(); }

/* слой с тенью: всё, что нарисует fn, ложится как бумага на бумагу — с общей мягкой тенью */
const LAY = [0, 1, 2].map(() => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; }); let LAYI = 0;
function layer(fn, o = {}) {
  const c = LAY[LAYI++ % LAY.length], g = c.getContext('2d'), prev = ctx, pS = S, pSS = SS.splice(0);
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H); g.setTransform(prev.getTransform()); ctx = g; S = pS; fn(); ctx = prev; S = pS; SS.push(...pSS);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (o.shadow !== false) { ctx.shadowColor = o.sc || 'rgba(10,6,4,0.45)'; ctx.shadowBlur = o.sb ?? 10; ctx.shadowOffsetX = o.sx ?? 5; ctx.shadowOffsetY = o.sy ?? 7; }
  ctx.globalAlpha = o.a ?? 1; ctx.drawImage(c, 0, 0); ctx.restore();
}

// ------------------------------------------------------------------ текст
function txt(s, x, y, size, o = {}) {
  if ((o.a ?? 1) <= 0.005) return 0;
  ctx.save(); ctx.font = `${o.weight ?? 800} ${size / S}px ${o.font || 'Inter'}`; ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle';
  const w = ctx.measureText(s).width; ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot);
  if (o.reveal !== undefined && o.reveal < 1) { const x0 = o.align === 'left' ? 0 : -w / 2; ctx.beginPath(); ctx.rect(x0 - 10, -size, (w + 20) * clamp(o.reveal), size * 2); ctx.clip(); }
  ctx.globalAlpha = o.a ?? 1;
  if (o.stroke) { ctx.lineJoin = 'round'; ctx.lineWidth = o.stroke / S; ctx.strokeStyle = o.sc || '#120d0b'; ctx.strokeText(s, 0, 0); }
  ctx.fillStyle = o.col || '#1c1512'; ctx.fillText(s, 0, 0); ctx.restore(); return w;
}
/* «письмо с угрозами»: каждая буква вырезана из разной бумаги/газеты, разным шрифтом, чуть повёрнута; переложена на двойках */
const RFONTS = ['Inter Black', 'DejaVu Serif', 'Osw', 'Liberation Serif', 'Courier 10 Pitch', 'Inter Display', 'FreeSans'];
const RBG = [['#f3efe4', '#111'], ['#111', '#f3efe4'], ['#d8342c', '#fff'], ['#f2c230', '#111'], ['#cfd8dc', '#111'], ['#fff', '#d8342c'], ['#e9e0c8', '#2b2b2b']];
function ransom(s, x, y, size, seed, o = {}) {
  const r = rng(seed), letters = [...s], k = o.k ?? 1; let widths = [], total = 0;
  const spec = letters.map((ch, i) => { const f = RFONTS[Math.floor(r() * RFONTS.length)], bg = o.bgs ? o.bgs[i % o.bgs.length] : RBG[Math.floor(r() * RBG.length)], sz = size * (0.82 + r() * 0.36), rot = (r() - 0.5) * 0.22, dy = (r() - 0.5) * size * 0.16; return { ch, f, bg, sz, rot, dy }; });
  ctx.save(); spec.forEach(sp => { ctx.font = `900 ${sp.sz / S}px '${sp.f}'`; const w = ch => ctx.measureText(ch).width; sp.w = sp.ch === ' ' ? size * 0.35 : w(sp.ch) + sp.sz * 0.28; total += sp.w; }); ctx.restore();
  const fit = Math.min(1, (o.maxW ?? W * 0.9) / Math.max(1, total * k)); const kk = k * fit; let cx = x - total / 2 * kk;
  push(0, 0, 1);
  spec.forEach((sp, i) => {
    const vis = clamp((o.reveal ?? 1) * letters.length - i); if (vis <= 0 || sp.ch === ' ') { cx += sp.w * kk; return; }
    const jj = jig(seed + i * 13, 1.2), sk = (o.pop ? 1 + 0.6 * (1 - vis) : 1) * kk;
    push(cx + sp.w * kk / 2 + jj[0], y + sp.dy + jj[1], sk, sp.rot + jj[2] * 4);
    const bw = sp.w, bh = sp.sz * 1.18;
    piece([[-bw / 2, -bh / 2], [bw / 2, -bh / 2 + (r() - 0.5) * 4], [bw / 2, bh / 2], [-bw / 2 + (r() - 0.5) * 4, bh / 2]], sp.bg[0], { step: 10, edge: 1.4, lw: 1.4, la: 0.5, seed: seed + i });
    ctx.font = `900 ${sp.sz / S}px '${sp.f}'`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = sp.bg[1]; ctx.fillText(sp.ch, 0, sp.sz * 0.04);
    pop(); cx += sp.w * kk;
  });
  pop(); return total * kk;
}
/* скотч и булавка: крепёж коллажа */
function tape(x, y, w, rot, seed) { push(x, y, 1, rot); piece([[-w / 2, -18], [w / 2, -18], [w / 2 + 4, 18], [-w / 2 - 3, 18]], '#f4ecc8', { a: 0.72, line: false, edge: 2.2, step: 8, seed, texA: 0.3 }); pop(); }
function pin(x, y, col = '#d8342c') { ellP(x + 4, y + 6, 13, 13, 'rgba(0,0,0,0.25)', { line: false, tex: false }); ellP(x, y, 13, 13, col, { lw: 2 }); dot(x - 4, y - 4, 4, '#fff', 0.7); }
