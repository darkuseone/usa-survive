/* Эп. 1 «Zombie Outbreak: 30 Days Locked Inside a Gas Station» — общее: метки слов, помощники сцен, счётчик дней (HUD), тряски. Главы — ch0.js … ch7.js (SHOTS.push + Object.assign(SH, …)). */
const WW = (k, re, n = 0) => { const ws = LN[k].words.filter(x => re.test(x.w)); return ws.length > n ? ws[n].s : LN[k].start; };
const LS = k => LN[k].start, LE = k => LN[k].end;
const EP = { title: null, subs: false };
const SHAKES = [];
const SHOTS = [];
const SH = {};
const JP = { x: 640, y: 1000 - 508 * 0.95, s: 0.95 };
const jit = (t, a = 6) => Math.sin(step(t, 24) * 41) * a;

// ---------- движение и реквизит
function kf(t, K) { if (t <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (t < K[i][0]) { const a = K[i - 1], b = K[i], k = eio((t - a[0]) / (b[0] - a[0])); return a[1].map((v, j) => lerp(v, b[1][j], k)); } return K[K.length - 1][1]; }
const hw = (P, h, flip) => [P.x + (flip ? -1 : 1) * h[0] * P.s, P.y + h[1] * P.s];
function chips(x, y, r, s = 1) { push(x, y, s, r); const zz = []; for (let q = 0; q <= 8; q++) zz.push([-34 + q * 8.5, -50 + (q % 2) * 7]);
  piece([[-34, 50], [-38, 0], ...zz, [38, 0], [34, 50]], '#f2c230', { raw: true, seed: 360, lw: 2.4, shade: () => { ellP(0, 4, 24, 18, '#d8342c', { seed: 361, line: false }); } }); pop(); }
function clipboard(x, y, s = 1, r = 0) { push(x, y, s, r); rectP(-60, -80, 120, 160, '#7a5a3a', { seed: 2001, lw: 2.2 }); rectP(-50, -66, 100, 136, '#fbfaf6', { seed: 2002, lw: 1.6, shade: () => { for (let i = 0; i < 5; i++) stroke([[-38, -40 + i * 24], [30, -40 + i * 24]], '#8a8f96', 2.4); } }); rectP(-20, -88, 40, 18, '#8e949a', { seed: 2003, lw: 1.6 }); pop(); }
function bottle(x, y, s = 1, r = 0, fill = 0) { push(x, y, s, r); piece([[-26, 70], [26, 70], [28, -30], [12, -60], [-12, -60], [-28, -30]], 'rgba(170,215,240,0.9)', { seed: 2010, lw: 2.2, tex: false, shade: () => { if (fill > 0) rectP(-28, 70 - 130 * fill, 56, 130 * fill, 'rgba(90,170,230,0.8)', { raw: true, line: false, tex: false }); } }); rectP(-12, -76, 24, 18, '#3d7fc4', { seed: 2011, lw: 1.6 }); pop(); }
function backpack(x, y, s = 1) { push(x, y, s); blobP([[-90, 120], [90, 120], [96, -60], [60, -120], [-60, -120], [-96, -60]], '#4a5a3a', { seed: 2020, lw: 2.4, shade: () => { rectP(-60, 10, 120, 80, '#3a4a2c', { raw: true, lw: 2 }); } }); stroke([[-40, -120], [-30, -160], [30, -160], [40, -120]], '#2a2c30', 8); pop(); }
function handset(x, y, s = 1, r = 0) { push(x, y, s, r); rectP(-40, -110, 80, 220, '#2a2c30', { seed: 2030, lw: 2.4, shade: () => { rectP(-28, -90, 56, 50, '#3a5a4a', { raw: true, line: false }); for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) dot(-18 + j * 18, 0 + i * 22, 6, '#8e949a'); rectP(-30, 72, 60, 22, '#d8342c', { raw: true, lw: 1.4 }); } }); pop(); }

// ---------- Joe в кадре (в своём слое) + реквизит в руке
function J(t, jo = {}) { const P = { ...JP, ...(jo.P || {}) };
  layer(() => { joe({ ...P, t, ...jo });
    if (jo.lantern) lanternP(...hw(P, [jo.arms.r[0], jo.arms.r[1] + 20], jo.flip), 0.9 * P.s, jo.lanternOn ?? 1);
    if (jo.bag) chips(...hw(P, jo.bag, jo.flip), jo.bagRot || 0, 0.9);
    if (jo.clip) clipboard(...hw(P, [jo.arms.l[0] + 10, jo.arms.l[1] - 50], jo.flip), P.s, -0.15);
    if (jo.bottle) bottle(...hw(P, [jo.arms.r[0], jo.arms.r[1] - 60], jo.flip), P.s, jo.bottleRot || 0, jo.bottleFill || 0);
    if (jo.handset) handset(...hw(P, [jo.arms.r[0], jo.arms.r[1] - 70], jo.flip), 0.6 * P.s, jo.handsetRot || 0);
  }, { sx: 8, sy: 10, sb: 14 }); }
function Z(t, zo = {}) { layer(() => zombie({ x: 960, y: 1000 - 508 * 0.9, s: 0.9, t, v: 0, ...zo }), { sx: 8, sy: 10, sb: 14 }); }

// ---------- сцены-обёртки: камера [x, y, z], персонажи, свет
function SD(t, c, o = {}, after) { cam(c[0], c[1], c[2], 0, shakeAt(t)); darkStore(t, o); if (o.z) Z(t, o.z); if (o.j) J(t, o.j); counter(t, o); if (after) after(); darkLight(t, o); pop(); }
function SE(t, c, o = {}) { cam(c[0], c[1], c[2], 0, shakeAt(t)); exterior(t, { noJoe: true, ...o }); extLight(t, o); pop(); }
function SB(t, c, o = {}, after) { cam(c[0], c[1], c[2], 0, shakeAt(t)); backroom(t, o); if (o.z) Z(t, o.z); if (o.j) J(t, o.j); if (after) after(); backLight(t, o); pop(); }
function SQ(t, c, o = {}, after) { cam(c[0], c[1], c[2], 0, shakeAt(t)); cooler(t, o); if (o.j) J(t, o.j); if (after) after(); coolLight(t, o); pop(); }
function ins(fn) { cam(W / 2, H / 2, 1, 0, shakeAt(SHT)); fn(); pop(); }
let SHT = 0;
function stamp(word, t, t0, x, y, size = 130, seed = 3000, rot = -0.04, bgs) { if (t < t0) return; push(x, y, 1, rot); ransom(word, 0, 0, size, seed, { reveal: pr(t, t0, t0 + 0.25), pop: true, bgs }); pop(); }

// ---------- счётчик дней (поверх виньетки) и номер дня по времени
const DAYS = [];                       // [[t, день, 'часы']]
const NOTAG = /^(thumb)/;
function dayAt(t) { let d = [0, 1, '03:07 AM']; for (const x of DAYS) if (t >= x[0]) d = x; return d; }
// субтитры по одному слову (как у образца, но в нашем стиле: плотный Oswald, белый с тёмной обводкой, ключевые — жёлтые)
const SUBW = []; LINES.forEach(l => { const ws = l.words.filter(w => w.w !== '—'); ws.forEach((w, i) => SUBW.push({ w: w.w, s: w.s, e: i + 1 < ws.length ? ws[i + 1].s : l.end + 0.12 })); });
const HOT = /^(day|days|zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|eighteen|nineteen|twenty|thirty|forty|forty-eight|thousand|thousands|\d.*|fema|never|nobody|silence|mistake|problem|dee|loudest|knock|knocks|dozens|empty|alone)$/i;
function subWord(t) {
  let lo = 0, hi = SUBW.length - 1, k = -1; while (lo <= hi) { const m = (lo + hi) >> 1; if (SUBW[m].s - 0.03 <= t) { k = m; lo = m + 1; } else hi = m - 1; }
  if (k < 0 || t > SUBW[k].e) return; const w = SUBW[k].w.replace(/[.,!?…:;"“”]/g, '').toUpperCase(); if (!w) return;
  const p = clamp((t - SUBW[k].s + 0.03) / 0.09), sc = 0.82 + 0.18 * eo(p), hot = HOT.test(w.replace(/'S$/, ''));
  push(W / 2, H - 132, sc); ctx.save(); ctx.font = `600 72px 'Osw'`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 18; ctx.lineWidth = 12; ctx.strokeStyle = '#141010'; ctx.strokeText(w, 0, 0); ctx.shadowBlur = 0;
  ctx.fillStyle = hot ? '#ffd21f' : '#fbf8f0'; ctx.fillText(w, 0, 0); ctx.restore(); pop();
}
function hudFrame(t) { const i = shotAt(t), nm = SHOTS[i][1]; if (NOTAG.test(nm)) return; const d = dayAt(t);
  dayTag(t, d[1], { clock: d[2], stamp: d[0] > 0 && t - d[0] < 1.2 ? d[0] + 0.15 : null }); subWord(t); }
// цветокоррекция как на обложке + мягкое свечение + плёночное зерно + виньетка
const GRAIN = (() => { const c = document.createElement('canvas'); c.width = 512; c.height = 512; const g = c.getContext('2d'), im = g.createImageData(512, 512), r = rng(4242);
  for (let i = 0; i < im.data.length; i += 4) { const v = 128 + (r() - 0.5) * 90; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } g.putImageData(im, 0, 0); return c; })();
function post(t, o) {
  o.save(); o.filter = 'saturate(1.18) contrast(1.06) brightness(1.03)'; o.drawImage(o.canvas, 0, 0); o.restore();
  o.save(); o.globalCompositeOperation = 'screen'; o.globalAlpha = 0.16; o.filter = 'blur(16px) brightness(0.9)'; o.drawImage(o.canvas, 0, 0); o.restore();
  o.save(); o.globalCompositeOperation = 'overlay'; o.globalAlpha = 0.05; const fr = Math.floor(t * 12), gx = -(hsh(fr) % 256), gy = -(hsh(fr, 7) % 256);
  for (let x = gx; x < W; x += 512) for (let y = gy; y < H; y += 512) o.drawImage(GRAIN, x, y); o.restore();
  const v = o.createRadialGradient(W / 2, H * 0.48, H * 0.38, W / 2, H * 0.5, H * 0.85); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.38)'); o.save(); o.fillStyle = v; o.fillRect(0, 0, W, H); o.restore();
}
