/* Эп. 1, третья версия: общие улучшения поверх set_store/set2/scenes (файл подключается ПОСЛЕ scenes.js и переопределяет функции):
   счётчик дней «по смыслу», субтитры, обёртки сцен с дрейфом камеры и молнией, туман и круги на лужах, вмятины и ладони на жалюзи, пальцы под жалюзи,
   толпы зомби рядами (hordeShutter, walkers), заставки глав с руками зомби, окно пикапа, вставки (инвентарь, вода, 19 дней, записка). */

// ------------------------------------------------------------------ счётчик дней и субтитры
const HIDE3 = /^(title|card|end|flash|thumb)|Ins$/;           // планы без счётчика: титул, заставки глав, вспышка из будущего, вставки на весь экран
function hudFrame(t) {
  const i = shotAt(t), nm = SHOTS[i][1]; if (/^thumb/.test(nm)) return;
  if (!HIDE3.test(nm) && t >= C0.day - 0.05) {                 // до «Day one» счётчика нет: первые секунды — зацепка
    const d = dayAt(t), t0 = Math.max(SHOTS[i][0], C0.day - 0.05), fresh = i > 0 && (HIDE3.test(SHOTS[i - 1][1]) || SHOTS[i][0] < C0.day), a = fresh ? popK(t, t0, 0.4) : 1;
    push(W - 175, 138, a, (1 - a) * 0.3); push(-(W - 175), -138); dayTag(t, d[1], { clock: d[2], stamp: (d[0] > 0 && t - d[0] < 1.4) ? d[0] + 0.2 : (t - C0.day < 1.4 ? C0.day + 0.1 : null) }); pop(); pop();
  }
  subWord(t);
}
function subWord(t) {
  let lo = 0, hi = SUBW.length - 1, k = -1; while (lo <= hi) { const m = (lo + hi) >> 1; if (SUBW[m].s - 0.03 <= t) { k = m; lo = m + 1; } else hi = m - 1; }
  if (k < 0 || t > SUBW[k].e) return; const w = SUBW[k].w.replace(/[.,!?…;"“”]/g, '').replace(/:(?!\d)/g, '').toUpperCase(); if (!w) return;
  const p = clamp((t - SUBW[k].s + 0.03) / 0.09), sc = 0.82 + 0.18 * eo(p), hot = HOT.test(w.replace(/'S$/, ''));
  push(W / 2, H - 132, sc); ctx.save(); ctx.font = `600 72px 'Osw'`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 18; ctx.lineWidth = 12; ctx.strokeStyle = '#141010'; ctx.strokeText(w, 0, 0); ctx.shadowBlur = 0;
  ctx.fillStyle = hot ? '#ffd21f' : '#fbf8f0'; ctx.fillText(w, 0, 0); ctx.restore(); pop();
}

// ------------------------------------------------------------------ атмосфера улицы: туман, круги на лужах, молния
const LT = [];                                                // моменты молний, сек (гром в звуке стоит там же)
function flashAt(t) { let f = 0; for (const t0 of LT) { const d = t - t0; if (d >= 0 && d < 0.7) f = Math.max(f, d < 0.08 ? 1 : d < 0.2 ? 0.25 : d < 0.32 ? 0.7 : 0.7 * (1 - (d - 0.32) / 0.38)); } return f; }
function mist(t, a = 1) { for (let i = 0; i < 7; i++) { const r = rng(3300 + i), x = ((t * (8 + r() * 10) + r() * 2400) % 2700) - 380, y = 700 + r() * 230; ellP(x, y, 380 + r() * 200, 40 + r() * 30, 'rgba(170,185,225,1)', { seed: 3301 + i, line: false, tex: false, a: 0.07 * a }); } }
function ripples(t) { for (let i = 0; i < 12; i++) { const r = rng(3350 + i), ph = ((step(t, 12) * (0.8 + r() * 0.6) + r()) % 1), x = 80 + r() * 1760, y = 830 + r() * 220; ellP(x, y, 10 + ph * 46, 3 + ph * 11, 'rgba(0,0,0,0)', { raw: true, tex: false, lw: 2.4, lc: '#c8d4ee', a: 0.5 * (1 - ph) }); } }

// ------------------------------------------------------------------ обёртки сцен: лёгкий дрейф камеры («с рук»), o.pre — реквизит ЗА героем
const drift = (t, c, a = 1) => [c[0] + Math.sin(t * 0.5) * 3 * a, c[1] + Math.cos(t * 0.37) * 2 * a];
function SD(t, c, o = {}, after) { const [x, y] = drift(t, c); cam(x, y, c[2], 0, shakeAt(t)); darkStore(t, o); if (o.pre) o.pre(); if (o.z) Z(t, o.z); if (o.j) J(t, o.j); counter(t, o); if (after) after(); darkLight(t, o); pop(); }
function SB(t, c, o = {}, after) { const [x, y] = drift(t, c); cam(x, y, c[2], 0, shakeAt(t)); backroom(t, o); if (o.pre) o.pre(); if (o.z) Z(t, o.z); if (o.j) J(t, o.j); if (after) after(); backLight(t, o); pop(); }
function SQ(t, c, o = {}, after) { const [x, y] = drift(t, c); cam(x, y, c[2], 0, shakeAt(t)); cooler(t, o); if (o.pre) o.pre(); if (o.j) J(t, o.j); if (after) after(); coolLight(t, o); pop(); }
function SE(t, c, o = {}) { const f = flashAt(t), [x, y] = drift(t, c, 1.3); cam(x, y, c[2], 0, shakeAt(t)); exterior(t, { noJoe: true, ...o }); ripples(t); mist(t);
  extLight(t, { ...o, fn: () => { if (o.fn) o.fn(); if (f > 0) { ctx.save(); ctx.globalAlpha = 0.5 * f; ctx.fillStyle = 'rgb(200,214,255)'; ctx.fillRect(-400, -400, 2800, 1900); ctx.restore(); } } }); pop(); }

// ------------------------------------------------------------------ жалюзи изнутри под напором толпы
const DENTS = [[640, 470, 120, 95], [900, 640, 150, 110], [1130, 430, 110, 90], [700, 800, 130, 90], [1010, 860, 120, 80], [330, 330, 110, 80], [1500, 380, 130, 95], [1700, 520, 110, 85]];
function dentP(x, y, w, h, k, seed) {                         // вмятина: затемнение, прогнутые ламели, блик сверху-слева и тень снизу-справа
  if (k <= 0.02) return;
  ellP(x, y, w, h, 'rgba(26,30,40,1)', { seed, line: false, tex: false, a: 0.26 * k }); ellP(x + w * 0.1, y + h * 0.14, w * 0.66, h * 0.62, 'rgba(26,30,40,1)', { seed: seed + 1, line: false, tex: false, a: 0.22 * k });
  for (let yy = Math.ceil((y - h - 10) / 30) * 30 + 10; yy < y + h; yy += 30) { const q = 1 - ((yy - y) / h) ** 2; if (q <= 0.05) continue; const ww = w * Math.sqrt(q), bow = 16 * k * q;
    stroke([[x - ww, yy], [x - ww * 0.4, yy + bow * 0.8], [x, yy + bow], [x + ww * 0.4, yy + bow * 0.8], [x + ww, yy]], '#4e545c', 4.5, { a: 0.9 });
    stroke([[x - ww, yy - 8], [x, yy - 8 + bow], [x + ww, yy - 8]], '#d0d6da', 2.4, { a: 0.75 }); }
  const arc = (a0, a1) => Array.from({ length: 9 }, (_, i) => { const a = lerp(a0, a1, i / 8); return [x + Math.cos(a) * w * 0.97, y + Math.sin(a) * h * 0.97]; });
  stroke(arc(Math.PI * 1.05, Math.PI * 1.6), '#eef1f4', 4, { a: 0.6 * k }); stroke(arc(Math.PI * 0.05, Math.PI * 0.6), '#343a42', 5, { a: 0.5 * k });
}
function handPrint(x, y, sc, rot, k, seed) {                  // отпечаток-выпуклость ладони, продавленной снаружи
  push(x, y, sc, rot); const c = 'rgba(222,228,234,1)';
  blobP([[-26, 10], [26, 10], [30, -30], [0, -42], [-30, -30]], c, { seed, line: false, tex: false, a: 0.5 * k });
  for (let q = -1.5; q <= 1.5; q++) stroke([[q * 13, -36], [q * 15, -76 - (1.5 - Math.abs(q)) * 8]], c, 11, { a: 0.5 * k }); stroke([[28, -4], [50, -24]], c, 11, { a: 0.5 * k });
  stroke([[-26, 14], [0, 22], [28, 12]], '#343a42', 4, { a: 0.45 * k }); pop();
}
function gapFingers(t, lvl) {                                 // щель у пола и пальцы, которые шарят под жалюзи
  rectP(-200, 988, 2320, 14, '#0b0d13', { raw: true, line: false, tex: false });
  [620, 720, 930, 1180, 1600, 1760].forEach((x, i) => { if (i / 6 > lvl * 1.2) return; const sk = ['#93b86a', '#a6c278', '#88b07a'][i % 3];
    for (let q = 0; q < 4; q++) { const wr = Math.sin(step(t, 12) * (5 + i) + q * 1.3 + i) * 7, len = 22 + (q % 2) * 10 + 10 * Math.max(0, Math.sin(step(t, 8) * 2 + i)); stroke([[x + q * 15, 992], [x + q * 15 + wr, 1002 + len]], sk, 12); dot(x + q * 15 + wr, 1000 + len, 3, '#3a4a2a', 0.8); } });
}
function shutterHits(t, lvl) {
  const n = Math.min(DENTS.length, Math.round(3 + 5 * Math.min(1, lvl)));
  for (let i = 0; i < n; i++) { const [x, y, w, h] = DENTS[i], hit = Math.max(0, Math.sin(step(t, 12) * (3.2 + (i % 4) * 0.9) + i * 1.9)), k = Math.min(1.2, lvl) * (0.55 + 0.45 * hit);
    dentP(x, y + (hit > 0.8 ? 2 : 0), w, h, k, 1040 + i * 3); if (hit > 0.7) handPrint(x + (i % 2 ? 30 : -24), y - 6, 1.15, (i % 3 - 1) * 0.3, (hit - 0.7) / 0.3, 1070 + i); }
  for (let i = 0; i < 16; i++) { const r = rng(1090 + i), x = 200 + r() * 1500, y = 110 + ((t * (90 + r() * 80) + r() * 700) % 700); dot(x + Math.sin(t * 2 + i) * 6, y, 1.6 + r() * 2, '#e8e4d8', 0.45 * Math.min(1, lvl)); }
  gapFingers(t, lvl);
}
function slits(a = 1, t = 0, crowd = 0) {                     // светящиеся щели; при толпе снаружи свет перекрывают тела (полосы «дышат»)
  const bl = []; if (crowd > 0) for (let i = 0; i < 14; i++) bl.push(i * 150 - 60 + Math.sin(step(t, 8) * (1 + (i % 3) * 0.4) + i * 2) * 40);
  for (let y = GL.y0 + 40; y < 980; y += 90) { const r = rng(y); [[-100 + r() * 200, 600 + r() * 600, y, 2.6, 0.55], [1100 + r() * 300, 1900, y + 30, 2.2, 0.4]].forEach(([x0, x1, yy, w, al]) => {
    let cur = x0; const cuts = bl.filter(b => b + 50 > x0 && b - 50 < x1).sort((p, q) => p - q);
    for (const b of cuts) { if (b - 50 > cur) stroke([[cur, yy], [b - 50, yy + 1]], '#e6eeff', w, { a: al * a, smooth: false }); cur = Math.max(cur, b + 50); }
    if (cur < x1) stroke([[cur, yy], [x1, yy + 1]], '#e6eeff', w, { a: al * a, smooth: false }); }); }
}
function darkStore(t, o = {}) {
  TT = t; store(t, { shut: 1, neonOff: true, lit: 0, door: 0, drops: false, ...o });
  if (o.tally) tallyMarks(o.tally, 260, 380, 0.9);
  if (o.slits) slits(o.slits, t, (o.bulge || o.shadows) ? 1 : 0);
  if (o.shadows) for (let i = 0; i < o.shadows; i++) { const x = ((t * (40 + (i % 4) * 14) + i * 290) % 2500) - 300; zShadow(x, 430 + (i % 3) * 40, 1.15, t, i, 'rgba(20,24,34,0.34)'); }
  if (o.bulge) shutterHits(t, o.bulge);
  shelf(t); if (o.crate) crate(o.crate, 1000);
}

// ------------------------------------------------------------------ магазин: детали прилавка и потолка, блики на полу
const store0 = window.store; window.store = function (t, o = {}) { store0(t, o);
  for (let i = 0; i < 2; i++) { const x = [480, 1440][i]; piece([[x - 150, 1004], [x + 150, 1004], [x + 230, 1300], [x - 230, 1300]], 'rgba(255,255,255,1)', { raw: true, line: false, tex: false, a: (o.lit ?? 1) > 0.4 ? 0.1 : 0.03 }); }   // блики ламп на плитке
  push(1790, 150); rectP(-30, -50, 60, 22, '#3a3d42', { seed: 3601, lw: 1.8 }); stroke([[0, -30], [0, 0]], '#3a3d42', 8); ellP(0, 14, 34, 26, '#22252a', { seed: 3602, lw: 2 }); ellP(-8, 18, 13, 11, '#0c0e12', { seed: 3603, lw: 1.4, tex: false });
  dot(16, 4, 4, (o.lit ?? 1) > 0.4 && Math.sin(t * 2.2) > 0 ? '#ff3a2a' : '#5a1a16'); pop();
  coffeeStand(t, o);                                                   // камера наблюдения
};
const counter0 = window.counter; window.counter = function (t, o = {}) { counter0(t, o);
  push(1660, 700, 1, -0.04); rectP(-28, -40, 56, 40, '#f3ecd8', { seed: 3612, lw: 1.6 }); txt('TIPS', 0, -20, 16, { font: 'Inter Black', col: '#1c1512' }); pop();
};
function coffeeStand(t, o = {}) {                             // стойка с кофемашиной и хот-дог-роллером (из инвентаря): рисуется в декорации, до героев
  push(1190, 1000); rectP(-66, -240, 132, 240, '#6a5038', { seed: 3613, lw: 2.4, shade: () => { rectP(-66, -240, 132, 18, '#8a6a4a', { raw: true, line: false }); stroke([[0, -220], [0, 0]], '#5a4028', 3); } });
  rectP(-52, -390, 104, 150, '#2a2c30', { seed: 3610, lw: 2.2, shade: () => { rectP(-40, -378, 80, 40, '#8a2a24', { raw: true, lw: 1.4 }); rectP(-34, -300, 68, 56, '#14161a', { raw: true, lw: 1.4 }); } });
  txt('COFFEE', 0, -358, 17, { font: 'Inter Black', col: '#fbfaf6' }); piece([[-20, -248], [20, -248], [16, -290], [-16, -290]], 'rgba(200,220,235,0.5)', { seed: 3611, lw: 1.6, tex: false }); rectP(-15, -270, 30, 22, '#3a2416', { raw: true, line: false, tex: false });
  dot(36, -320, 4, (o.lit ?? 1) > 0.4 ? '#ff5a3a' : '#4a1a16'); pop();
}
const cooler0 = window.cooler; window.cooler = function (t, o = {}) { cooler0(t, o);
  push(210, 330, 1, -0.02); card(0, 0, 250, 96, 0, 3620, '#f2c230'); txt('WALK-IN', 0, -20, 30, { font: 'Inter Black', col: '#1c1512' }); txt('COOLER', 0, 16, 30, { font: 'Inter Black', col: '#1c1512' }); pop();
  [260, 860].forEach((y, i) => rectP(40, y, 34, 70, '#5c6168', { seed: 3621 + i, lw: 2 }));                                                      // петли
  push(470, 420); rectP(-16, -70, 32, 140, '#e9edf2', { seed: 3623, lw: 1.8 }); rectP(-5, -56, 10, 96, '#cfd6dc', { raw: true, line: false, tex: false }); rectP(-5, 0, 10, 40, '#3d7fc4', { raw: true, line: false, tex: false }); ellP(0, 52, 11, 11, '#3d7fc4', { seed: 3624, lw: 1.4, tex: false }); pop();   // термометр
  for (let i = 0; i < 14; i++) { const r = rng(3630 + i); piece([[i * 150 - 100, 1000], [i * 150 - 40 + r() * 40, 1000 - 20 - r() * 34], [i * 150 + 60, 1000]], '#e8f0f6', { raw: true, line: false, tex: false, a: 0.5 }); }   // иней у пола
};

// ------------------------------------------------------------------ толпы
function hordeShutter(t, k = 1) {                             // ровно 40 у жалюзи, три ряда: задний колотит (со спины), передний крупный; k < 1 — расходятся в стороны
  const rows = [[772, 0.5, 16, 330, 1290, 0.38], [842, 0.62, 13, 290, 1330, 0.2], [926, 0.76, 11, 240, 1380, 0.04]]; let id = 0;
  rows.forEach(([fy, s, n, x0, x1, dim], ri) => { for (let i = 0; i < n; i++, id++) { const r = rng(3000 + id), th = 0.04 + r() * 0.96, jx = (r() - 0.5) * 26, jy = (r() - 0.5) * 10, turned = r() > (ri === 0 ? 0.93 : ri === 1 ? 0.8 : 0.72), far = 700 + r() * 500, upQ = r() > 0.5;
    const x = x0 + (x1 - x0) * (i + 0.5) / n + jx, gone = clamp((th - k) * 3); if (gone >= 1) continue; const dir = x > 810 ? 1 : -1;
    zMini(x + dir * eio(gone) * far, fy - 380 * s + jy, s, t, 100 + id, gone > 0 ? { walk: true, dim, lean: dir * 0.08 } : { back: !turned, pound: ri === 0 && !turned, up: ri === 1 && !turned && upQ, dim }); } });
}
function walkers(t, n, o = {}) {                              // бредущие по глубине: o.x(i, rnd, depth) → x; ряды y0…y1, масштаб s0…s1 (дальние мельче и синее)
  const sd = o.seed ?? 3200, L = []; for (let i = 0; i < n; i++) { const r = rng(sd + i), q = r(), d = r(); L.push([lerp(o.y0 ?? 800, o.y1 ?? 940, d), o.x ? o.x(i, q, d) : q * 1920, lerp(o.s0 ?? 0.5, o.s1 ?? 0.75, d), i, d]); }
  L.sort((a, b) => a[0] - b[0]).forEach(([y, x, s, i, d]) => zMini(x, y - 380 * s, s, t * (o.slow ?? 1), sd + i, { walk: o.walk !== false, dim: lerp(o.dim0 ?? 0.32, 0.03, d), lean: o.lean ?? 0.06, back: o.back }));
}
function zHandsRow(t, k = 1, n = 9) {                         // руки зомби лезут из-под нижнего края кадра (титул, заставки глав, концовка)
  for (let i = 0; i < n; i++) { const r = rng(3400 + i), x = 110 + i * (W - 220) / (n - 1) + (r() - 0.5) * 60, up = (60 + r() * 90) * eo(clamp(k * 1.4 - r() * 0.4)), wv = Math.sin(step(t, 8) * (2 + r() * 2) + i) * 0.12, sc = 1.5 + r() * 0.5, tw = (r() - 0.5) * 0.3,
      sk = ['#93b86a', '#a6c278', '#88b07a'][i % 3], sl = ['#6e5a48', '#5d6e7c', '#8a3e34', '#4a6a4a'][i % 4]; if (up < 4) continue;
    push(x, H + 40 - up, sc, wv + tw); piece(tube([[0, 260], [4, 120], [0, 20]], 46, 40).pts, sl, { raw: true, lw: 2.4 }); piece([[-22, 34], [22, 34], [21, 14], [-21, 14]], mix(sl, '#000000', 0.3), { raw: true, lw: 1.6 });
    blobP([[-26, 14], [26, 14], [30, -26], [0, -38], [-30, -26]], sk, { seed: 3410 + i, lw: 2.4 });
    for (let q = -1.5; q <= 1.5; q++) stroke([[q * 14, -30], [q * 17 + Math.sin(step(t, 8) * 3 + q + i) * 4, -66 - (1.5 - Math.abs(q)) * 8]], sk, 12); stroke([[28, -6], [48, -22]], sk, 12); pop(); }
}

// ------------------------------------------------------------------ заставки
function chapterCard(t, c, n, title) {
  paperBg(1600 + n); const k = popK(t, c, 0.4), tk = clamp((t - c - 0.35) / 0.7);
  push(W / 2, 450, 1, -0.02); piece([[-700, -230], [700, -250], [710, 230], [-690, 250]], '#f3ecd8', { seed: 1610 + n, step: 14, edge: 2.2, lw: 2 }); pop();
  tape(W / 2 - 650, 215, 160, -0.5, 1620 + n); tape(W / 2 + 650, 205, 160, 0.4, 1621 + n);
  push(W / 2, 380, 0.7 + 0.3 * k, -0.03); ransom('DAY ' + n, 0, 0, 210, 1630 + n, { reveal: pr(t, c, c + 0.35), pop: true }); pop();
  const g = Math.ceil(n / 5), sc = 0.8, tw = (g * 110 - 30) * sc; push(W / 2 - tw / 2, 555, 1, 0.01); tallyMarks(Math.max(0, Math.round(n * tk)), 0, 0, sc); pop();
  if (t > c + 0.6) { push(W / 2, 778, popK(t, c + 0.6, 0.3), 0.02); label(0, 0, title, title.length * 58 * 0.62 + 140, '#f2c230', 0, 58); pop(); }
  zHandsRow(t, clamp((t - c - 0.5) / 1.0), 9);
}
function titleCard(t, c) {
  paperBg(1700); push(W / 2, 330, 1, -0.03); ransom('ZOMBIE OUTBREAK', 0, 0, 160, 1701, { reveal: pr(t, c, c + 0.5), pop: true }); pop();
  if (t > c + 0.7) { push(W / 2, 560, popK(t, c + 0.7, 0.3), 0.015); label(0, 0, '30 DAYS LOCKED INSIDE A GAS STATION', 1560, '#f3ecd8', 0, 68); pop(); }
  if (t > c + 1.4) txt('PAPER SURVIVORS', W / 2, 700, 44, { font: 'Inter Black', col: '#f2731c' });
  zHandsRow(t, clamp((t - c - 0.6) / 1.2), 11);
}
function endCard(t, c) {
  paperBg(1800); push(W / 2, 290, 1, -0.03); ransom('DAY 31', 0, 0, 180, 1801, { reveal: pr(t, c, c + 0.4), pop: true }); pop();
  if (t > c + 0.8) { push(W / 2, 540, 1 + 0.04 * Math.sin(step(t, 6) * 2)); rectP(-300, -70, 600, 140, '#e0201a', { seed: 1802, lw: 3 }); txt('SUBSCRIBE', 0, 4, 72, { font: 'Inter Black', col: '#fbfaf6' }); pop(); }
  if (t > c + 1.4) txt('Would you have opened the window?', W / 2, 720, 56, { font: 'Hand', weight: 700, col: '#f3ecd8' });
  layer(() => joe({ x: 300, y: 560, s: 0.6, t, mood: 'dread', lk: [0.6, 0], arms: { l: [-150, 300, 'open'], r: [180, 160, 'fist'] } }), { sx: 6, sy: 8, sb: 10 });
  zHandsRow(t, clamp((t - c - 1.0) / 1.5), 11);
}

// ------------------------------------------------------------------ вставки (переопределяют set2.js)
function inventory(t, c, marks) {
  cork(); push(960, 540, 1, -0.02); rectP(-400, -455, 800, 910, '#7a5a3a', { seed: 1500, lw: 2.6 }); card(0, 22, 720, 830, 0, 1501, '#fbfaf6');
  rectP(-90, -486, 180, 66, '#8e949a', { seed: 1502, lw: 2.4 }); ellP(0, -452, 13, 13, '#5c6168', { seed: 1503, lw: 1.6 });
  txt('INVENTORY — DAY 1', 0, -330, 52, { font: 'Inter Black', col: '#1c1512' }); stroke([[-310, -290], [310, -288]], '#3a3530', 3);
  [['6', 'cases of water', '💧'], ['400', 'bags of chips', '🥔'], ['2', 'hot dog rollers', '🌭'], ['1', 'first aid kit', '🩹'], ['1', 'coffee machine', '☕']].forEach(([n, s, e], i) => { const k = popK(t, marks[i], 0.3); if (k <= 0) return;
    push(0, -196 + i * 126); if (t > marks[i] + 0.25) check(-300, 0, 0.6, clamp((t - marks[i] - 0.25) / 0.25));
    push(-250, 0, k); txt(n, 0, 0, 82, { font: 'Osw', weight: 600, col: '#c8241c', align: 'left' }); pop(); txt(s, -112, 4, 64, { font: 'Hand', weight: 700, col: '#1c1512', align: 'left', a: clamp((t - marks[i]) / 0.2) }); txt(e, 300, 0, 62, { font: 'Noto Color Emoji', a: k > 0.5 ? 1 : 0 }); pop(); });
  pop();
}
function waterFact(t, c) {
  cork(); push(690, 500, 1, -0.025); card(0, 0, 1000, 660, 0, 1510, '#f3ecd8'); txt('HOW MUCH WATER?', 0, -256, 68, { font: 'Inter Black', col: '#1c1512' }); stroke([[-420, -206], [420, -204]], '#3a3530', 3);
  const k = popK(t, c + 0.3, 0.35); if (k > 0) { push(-270, 40, k); piece([[-110, 180], [110, 180], [118, -50], [72, -134], [-72, -134], [-118, -50]], 'rgba(170,215,240,0.95)', { seed: 1511, lw: 2.8, tex: false, shade: () => { rectP(-118, 40, 236, 140, 'rgba(90,170,230,0.55)', { raw: true, line: false, tex: false }); stroke([[-80, -30], [-76, 150]], '#ffffff', 7, { a: 0.6 }); } });
    rectP(-36, -180, 72, 50, '#3d7fc4', { seed: 1512, lw: 2 }); txt('1 GAL', 0, 80, 54, { font: 'Inter Black', col: '#1c1512' }); pop(); }
  if (t > c + 0.7) { txt('=', -60, 40, 110, { font: 'Inter Black', col: '#1c1512' }); push(150, 30, popK(t, c + 0.7, 0.3)); personIcon(0, 0, 1.7, '#f2731c', 1513); pop(); txt('1 person', 330, -10, 62, { font: 'Hand', weight: 700, col: '#1c1512' }); txt('1 day', 330, 60, 62, { font: 'Hand', weight: 700, col: '#c8241c' }); }
  txt('drinking + cooking + hygiene', 0, 270, 38, { font: 'Inter', weight: 800, col: '#3a3530' }); pop(); pin(690, 186);
  if (t > c + 1.6) { push(1520, 380, 1, 0.04); ransom('WATER', 0, 0, 120, 1514, { reveal: pr(t, c + 1.6, c + 1.9), pop: true }); pop(); push(1520, 560, popK(t, c + 2.0, 0.3), -0.03); label(0, 0, 'is the real clock', 520, '#f2c230', 0, 50); pop(); }
  txt('source: FEMA / ready.gov', 690, 880, 30, { font: 'Inter', weight: 800, col: '#1c1512' });
}
function nineteen(t, c) {
  bg('#1c1a18'); push(W / 2, 230, 1, -0.03); ransom('6 CASES', 0, 0, 120, 1520, { reveal: pr(t, c, c + 0.3), pop: true }); pop();
  if (t > c + 0.9) { push(W / 2, 440, 1, 0.02); ransom('≈ 19 GALLONS', 0, 0, 100, 1521, { reveal: pr(t, c + 0.9, c + 1.3), pop: true }); pop(); }
  if (t > c + 2.0) { push(W / 2, 680, 1.0 + 0.06 * Math.sin(step(t, 6) * 2), -0.02); ransom('19 DAYS', 0, 0, 170, 1522, { reveal: pr(t, c + 2.0, c + 2.3), pop: true, bgs: [['#e0201a', '#fff'], ['#ffd21f', '#111'], ['#111', '#fff']] }); pop(); }
  for (let i = 0; i < 6; i++) { const k = popK(t, c + 0.1 + i * 0.08, 0.3); if (k > 0) { push(230 + (i % 2) * 110, 300 + Math.floor(i / 2) * 150, k * 0.8, (i - 2.5) * 0.03); rectP(-50, -60, 100, 120, '#3d6fa4', { seed: 1525 + i, lw: 2.2 }); txt('💧', 0, 0, 46, { font: 'Noto Color Emoji' }); pop(); } }
}
function recap(t, marks, title = 'WHAT KEPT YOU ALIVE', hand = false) {
  cork(); push(960, 500, 1, 0.015); card(0, 0, 1240, 800, 0, 1590, hand ? '#fbf7e8' : '#f3ecd8'); txt(title, 0, -320, hand ? 64 : 60, { font: hand ? 'Hand' : 'Inter Black', weight: 700, col: hand ? '#c8241c' : '#1c1512' });
  const items = hand ? ['Count first.', 'Stay dark.', 'Stay quiet.', "Don't open the door."] : ['Count before you act', 'Kill the light', 'Stay silent', 'Find the hidden water', 'Never open the door'];
  items.forEach((s, i) => { if (hand) { const k = clamp((t - marks[i]) / 0.55); if (k <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(-480, -230 + i * 132 - 60, 1000 * k, 120); ctx.clip(); txt(s, -440, -230 + i * 132, 92, { font: 'Hand', weight: 700, col: '#1c1512', align: 'left' }); ctx.restore(); return; }
    const k = popK(t, marks[i], 0.3); if (k <= 0) return; push(-470, -200 + i * 108, k); check(0, 0, 0.62, clamp((t - marks[i] - 0.2) / 0.25)); txt(s, 74, 0, 58, { font: 'Inter', weight: 800, col: '#1c1512', align: 'left' }); pop(); });
  pop(); pin(960, 120); if (hand) { tape(420, 180, 150, -0.5, 1594); tape(1500, 170, 150, 0.45, 1595); }
}

// ------------------------------------------------------------------ окно пикапа под дождём (Ди на пассажирском месте)
function cabClose(t, o = {}) {
  bg('#141a2e', 3500); rainOut(t, -100, 1100, 1.2);
  rectP(-100, 70, 2120, 1100, '#7a2e26', { seed: 3501, lw: 3, shade: () => { rectP(-100, 770, 2120, 34, '#521e18', { raw: true, line: false }); stroke([[-100, 850], [2020, 846]], '#9a4034', 6); for (let i = 0; i < 9; i++) dot(120 + i * 230, 930, 7, '#521e18'); } });
  const win = spline([[430, 190], [1490, 190], [1552, 250], [1552, 700], [368, 700], [368, 250]], true, 5), path = piece(win, '#1c2740', { raw: true, lw: 0, line: false, tex: false });
  ctx.save(); ctx.clip(path); rectP(960, 330, 470, 480, '#2c2e36', { seed: 3502, lw: 2.4 }); rectP(1020, 250, 300, 120, '#34363e', { seed: 3503, lw: 2 });
  dee({ x: 900, y: 430, s: 1.25, t, noShadow: true, ...(o.dee || {}) });
  for (let i = 0; i < 4; i++) piece([[520 + i * 300, 180], [600 + i * 300, 180], [440 + i * 300, 720], [360 + i * 300, 720]], 'rgba(255,255,255,1)', { raw: true, line: false, tex: false, a: 0.05 });
  for (let i = 0; i < 22; i++) { const r = rng(3510 + i), x = 380 + r() * 1160, y = 190 + ((t * (40 + r() * 70) + r() * 520) % 520); stroke([[x, y - 20 - r() * 20], [x + 1, y]], '#dcebff', 3, { a: 0.3 }); dot(x + 1, y + 2, 4.5, '#e8f2ff', 0.5); }
  ctx.restore(); stroke([...win, win[0]], '#2a1410', 16, { smooth: false }); stroke([...win, win[0]], '#c9ccd1', 4, { smooth: false, a: 0.5 });
  rectP(1380, 790, 150, 34, '#c9ccd1', { seed: 3504, lw: 2 }); push(250, 470); rectP(-70, -100, 140, 200, '#2a2c30', { seed: 3505, lw: 2.4 }); rectP(-56, -86, 112, 172, '#3a4a6a', { seed: 3506, lw: 1.6, tex: false }); pop();
  lightmap('#5a5e74', () => { radial(900, 440, 760, 'rgba(160,190,255,1)', 0.6); if (o.red) radial(1750, 900, 800, 'rgba(255,50,40,1)', 0.5 * o.red); if (o.fn) o.fn(); });
}
