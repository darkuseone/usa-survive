/* ТЕСТ 1 «Живая камера 2.5D» — холодное начало эп. 1 (0–20 с) с тем же голосом и звуком.
   Сцена раскладывается на планы глубины (ночь за стеклом 2.6, стены/витрина 1.4, полка и герои 1.0, касса 0.8, передний план 0.45);
   камера RIG {X, Y, Z (наезд), zoom, roll}: план на глубине d масштабируется zoom·d/(d−Z) и сдвигается на X/d → параллакс, наезды, «вертиго»;
   глубина резкости — размытие планов вне фокуса; склейки — «хлыст» камерой и пролёт сквозь витрину вместо монтажных стыков. */
const CUE = {};
const RIG = { X: 0, Y: 0, Z: 0, zoom: 1, roll: 0, shake: 0, focus: 1, dof: 5 };
const PL = [0, 1, 2, 3, 4, 5].map(() => { const c = document.createElement('canvas'); c.width = PW; c.height = PH; return c; });
const XF = document.createElement('canvas'); XF.width = PW; XF.height = PH;
function rigAt(t, K) { let a = K[0], b = K[K.length - 1]; for (let i = 1; i < K.length; i++) if (t < K[i][0]) { a = K[i - 1]; b = K[i]; break; }
  const k = t <= K[0][0] ? 0 : t >= K[K.length - 1][0] ? 1 : eio((t - a[0]) / (b[0] - a[0])), A = t >= K[K.length - 1][0] ? b : a, B = b;
  const v = j => lerp(A[j] ?? 0, B[j] ?? 0, t >= K[K.length - 1][0] ? 1 : k); Object.assign(RIG, { X: v(1), Y: v(2), Z: v(3), zoom: v(4), roll: v(5) }); }
function planeT(g, d) { const s = RIG.zoom * d / Math.max(0.08, d - RIG.Z), r = rng(hsh(FRAME, 99)), sx = RIG.shake ? (r() - 0.5) * RIG.shake : 0, sy = RIG.shake ? (r() - 0.5) * RIG.shake : 0;
  g.translate(W / 2 + sx, H / 2 + sy); if (RIG.roll) g.rotate(RIG.roll); g.scale(s, s); g.translate(-(960 + RIG.X / d), -(540 + RIG.Y / d)); return s; }
function plane(i, d, fn, o = {}) {                                     // нарисовать fn на плане глубины d (с параллаксом и размытием вне фокуса)
  const c = PL[i], g = c.getContext('2d'), prev = ctx, pS = S, pSS = SS.splice(0);
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none'; g.clearRect(0, 0, PW, PH);
  const s = planeT(g, d); ctx = g; S = pS * s; fn(); ctx = prev; S = pS; SS.push(...pSS);
  const b = RIG.dof * Math.abs(1 / d - 1 / RIG.focus) + (o.blur || 0);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); if (b > 0.4) ctx.filter = `blur(${Math.min(14, b).toFixed(1)}px)`; ctx.globalAlpha = o.a ?? 1; ctx.drawImage(c, 0, 0); ctx.restore();
}
function onPlane(d, fn) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const pS = S; S = planeT(ctx, d); fn(); S = pS; ctx.restore(); }

// ---------- передний план: то, что проплывает у самого объектива (размыто)
function fgRack(x, dark = 0.55) {                                      // торец стеллажа со снеками
  push(x, 0); rectP(-140, 180, 280, 1000, '#6e665a', { seed: 5001, lw: 3 });
  for (let r = 0; r < 4; r++) { rectP(-150, 300 + r * 210, 300, 26, '#8a8274', { seed: 5002 + r, lw: 2 });
    for (let q = 0; q < 3; q++) rectP(-120 + q * 82, 220 + r * 210, 70, 80, ['#d8342c', '#f2c230', '#3d7fc4', '#46b86a'][(r + q) % 4], { seed: 5010 + r * 3 + q, lw: 2 }); }
  rectP(-140, 180, 280, 1000, `rgba(8,8,16,${dark})`, { raw: true, line: false, tex: false }); pop();
}
function fgPump(x) {                                                   // колонка у объектива на улице
  push(x, 0); rectP(-170, 300, 340, 760, '#8a2a24', { seed: 5020, lw: 3, shade: () => { rectP(-170, 300, 340, 90, '#d9d0c0', { raw: true, line: false }); rectP(-110, 440, 220, 120, '#10161e', { raw: true, lw: 2 }); } });
  txt('3', 0, 500, 70, { font: 'Osw', weight: 600, col: '#7dffb0' }); stroke([[170, 520], [250, 640], [230, 900]], '#140f0c', 16); rectP(-170, 300, 340, 760, 'rgba(6,8,18,0.5)', { raw: true, line: false, tex: false }); pop();
}
function fgLamp(x, y) { push(x, y); stroke([[0, -400], [0, -60]], '#1c1512', 8); piece([[-150, -60], [150, -60], [110, 30], [-110, 30]], '#2f6a6e', { seed: 5030, lw: 3 }); ellP(0, 34, 90, 16, '#fff6cf', { seed: 5031, lw: 2, tex: false }); pop(); }
function fgx(sx, d, k) { const s = k[4] * d / Math.max(0.08, d - k[3]); return 960 + k[1] / d + (sx - 960) / s; }   // мир. x, чтобы на ключе k предмет стоял в экранной точке sx
function shafts25(a = 1) { [480, 1440].forEach(x => cone(x, 20, x + 40, 980, 300, 'rgba(255,250,232,1)', 0.07 * a)); }

// ---------- магазин по планам (те же функции декорации, что в эпизоде)
function scene25(t, jo, o = {}) {
  TT = t;
  plane(0, 2.6, () => { outside(t, o); });
  plane(1, 1.4, () => { const f = outside; outside = () => {}; try { store(t, o); } finally { outside = f; } if (o.drops !== false) glassDrops(t); });
  plane(2, 1.0, () => { shelf(t); if (o.box) boxP(470, 1000, 0.9); if (o.crate) crate(o.crate, 1000); if (o.zIn) Z(t, o.zIn); if (jo && !jo.behind) J(t, jo); dust(t, 700, 400, 1400, 500, 26); });
  plane(3, 0.8, () => { counter(t, o); if (jo && jo.behind) J(t, jo); if (o.fallBag) o.fallBag(); });
  onPlane(1.0, () => { storeLight(o); shafts25(o.lit ?? 1); });
  if (o.fg) plane(4, 0.7, o.fg);
}
function ext25(t, o = {}) {
  plane(0, 1.0, () => { exterior(t, { noJoe: false, ...o }); extLight(t, o); });
  if (o.fg) plane(4, 0.42, o.fg);
}

// ---------- планы теста: [начало, функция(t, u)]; камера — ключи RIG по времени ролика
const K = {
  ext:  [[0, -40, -70, 0, 1.0], [1.25, -140, -20, 0.26, 1.0], [1.55, -150, 10, 0.5, 1.0]],
  wide: [[1.52, -60, 10, -0.06, 1.12], [2.65, -220, 70, 0.12, 1.18], [4.7, -330, 110, 0.32, 1.42]],
  door: [[4.88, -330, 110, 0.32, 1.42], [5.2, 10, 30, 0.2, 1.3], [7.03, 30, 30, 0.3, 1.25]],
  shock:[[7.03, 30, 30, 0.3, 1.25], [7.2, -280, 115, 0.22, 1.56], [8.18, -280, 115, 0.46, 1.08]],
  zomb: [[8.18, 0, 30, 0.08, 1.45, 0], [10.44, -50, 55, 0.34, 1.4, 0.05]],
  run:  [[10.44, -140, 60, 0.1, 1.2], [11.22, 360, 60, 0.12, 1.2]],
  btn:  [[11.22, 0, 0, 0, 1.0], [11.99, 0, 0, 0.16, 1.0]],
  shut: [[11.99, -20, 130, 0, 1.05, -0.02], [14.17, 40, 60, 0.12, 1.05, 0]],
  day:  [[14.17, -150, 120, 0.04, 1.25], [16.78, 170, 70, 0.3, 1.25]],
  out:  [[16.78, -90, -20, 0.32, 1.0], [20, 0, -70, 0, 1.0]]
};
const SHOT25 = [
  [0, 'ext', (t, u) => { rigAt(t, K.ext); RIG.focus = 1; ext25(t, { zom: true, fg: () => fgPump(260 - u * 40) }); stamp('3:07 AM', t, 0.3, 420, 200, 110, 501); }],
  [C0.alone - 0.1, 'wide', (t, u) => { rigAt(t, K.wide); RIG.focus = 1;
    if (t < C0.shift - 0.05) { const a = stackArm(t); scene25(t, { flip: true, lk: [0.8, 0.1], mood: 'sleepy', arms: { l: [-150, 300, 'open'], r: [...a.hand, 'fist'] }, bag: a.bag ? [a.hand[0] + 4, a.hand[1] - 40] : null, tilt: Math.sin(step(t, 6)) * 0.02 }, { box: true, car: true, fg: () => fgLamp(fgx(1500, 0.7, K.wide[2]), 330) }); }
    else { const look = t > C0.lights + 0.2, a = stackArm(t), hold = look ? [180, 150] : a.hand;
      scene25(t, { flip: true, lk: look ? [-0.9, -0.1] : [0.6, 0.2], mood: look ? '' : 'sleepy', lid: look ? 0.1 : 0.5, arms: { l: [-150, 300, 'open'], r: [...hold, 'fist'] }, bag: (look || a.bag) ? [hold[0] + 4, hold[1] - 40] : null, tilt: look ? -0.06 : 0 },
        { box: true, car: true, fn: () => sweep0(t), fg: () => fgLamp(fgx(1500, 0.7, K.wide[2]), 330) }); } }],
  [C0.a2 - 0.05, 'door', (t, u) => { rigAt(t, K.door); RIG.focus = 1.2; const k = pr(t, C0.a2, C0.chime - 0.05), od = pr(t, C0.chime - 0.1, C0.chime + 0.45);
    const zo = { x: lerp(1500, 1010, k), y: lerp(560, 610, k), s: lerp(0.4, 0.66, k), v: 0, legs: 'run' };
    scene25(t, null, { zoms: od < 0.5 ? [zo] : [], zIn: od >= 0.5 ? { s: 0.8, x: 980, y: 1000 - 508 * 0.8, legs: 'run' } : null, door: od, bell: od > 0 ? 1 - pr(t, C0.chime + 0.4, C0.chime + 1.8) : 0, car: true, rainA: 1 + od * 0.5, fg: () => fgLamp(fgx(1450, 0.7, K.door[2]), 330) }); }],
  [C0.whatever - 0.1, 'shock', (t, u) => { rigAt(t, K.shock); RIG.focus = 1; const dk = clamp((t - C0.drop) / 0.55), bx = JP.x - 180 * JP.s - dk * 40, by = JP.y + 110 * JP.s + dk * dk * 380;
    scene25(t, { lk: [0.8, -0.1], mood: 'shock', scream: t > C0.drop + 0.1 ? 1 : 0, sweat: 1, arms: { l: [-180, 170, 'open'], r: [180, 150, 'open'] } },
      { door: 1, car: true, flick: true, zIn: { s: 0.8, x: 1010, y: 1000 - 508 * 0.8 }, fallBag: () => chips(bx, Math.min(by, 990), dk < 1 ? dk * 2.4 : 1.4, 0.9) }); }],
  [C0.walked + 0.45, 'zomb', (t, u) => { rigAt(t, K.zomb); RIG.focus = 1; const k = clamp(u / 1.9);
    scene25(t, null, { door: 1, car: true, flick: true, zIn: { s: 0.9 + k * 0.08, x: 960 - k * 60, y: 1000 - 508 * (0.9 + k * 0.08), legs: 'run', tilt: 0.18 + Math.sin(step(t, 8) * 3) * 0.06, arms: { l: [-150, 110 - k * 30, 'open'], r: [150, 90 - k * 20, 'open'] } }, fg: () => fgRack(fgx(120, 0.7, K.zomb[1]), 0.7) }); }],
  [C0.a3 - 0.05, 'run', (t, u) => { rigAt(t, K.run); RIG.focus = 1; const k = clamp(u / 0.75), x = lerp(700, 1480, eio(k));
    scene25(t, { P: { x }, legs: 'run', lean: 0.18, mood: 'shock', scream: 0.7, lk: [0.9, 0], arms: { l: [-170, 120, 'fist'], r: [170, 220, 'fist'] }, behind: k > 0.75 }, { door: 1, car: true, flick: true, zIn: { s: 0.9, legs: 'run' } }); }],
  [C0.button - 0.25, 'btn', (t, u) => { rigAt(t, K.btn); RIG.shake = shakeAt(t); plane(2, 1, () => lockBtn(t, C0.hit)); RIG.shake = 0; stamp('LOCKDOWN!', t, C0.hit, W / 2, 170, 140, 502); }],
  [C0.steel - 0.1, 'shut', (t, u) => { rigAt(t, K.shut); RIG.shake = shakeAt(t); RIG.focus = 1.4; const sh = pr(t, C0.steel, C0.crash + 0.05), press = Math.sin(step(t, 8) * 5) * 8;
    scene25(t, { P: { x: 1480 }, behind: true, lk: [-0.8, -0.3], mood: 'dread', arms: { l: [-150, 200, 'open'], r: [140, 200, 'fist'] } },
      { door: 0, zoms: [{ x: 960, y: 1000 - 508 * 0.85 - 40, s: 0.85, v: 0, arms: { l: [-140, 40 + press, 'open'], r: [140, 30 - press, 'open'] } }, { x: 1250, y: 600, s: 0.6, v: 1, legs: 'run' }, { x: 640, y: 610, s: 0.55, v: 2, legs: 'run' }],
        car: true, shut: sh, red: 0.4, lit: 0.45, neonOff: true, drops: sh < 0.9, fn: () => radial(960, 600, 500, 'rgba(120,220,190,1)', 0.35 * (1 - sh)) }); RIG.shake = 0;
    stamp('CRASH!', t, C0.crash, W / 2, 170, 130, 503, 0.03); }],
  [C0.sit, 'day', (t, u) => { rigAt(t, K.day); RIG.shake = shakeAt(t); RIG.focus = 1; const sk = sm(clamp((t - C0.sit) / 0.6)), P = { x: 980, y: lerp(1000 - 508 * 0.95, 1000 - 220 - 345 * 0.95, sk) };
    scene25(t, { P, legs: sk > 0.5 ? 'sit' : 'stand', lk: [0.1, 0.2], mood: 'dread', lid: 0.3, sweat: 1, arms: sk > 0.5 ? { l: [-120, 250, 'fist'], r: [120, 250, 'fist'] } : { l: [-150, 300, 'open'], r: [150, 300, 'open'] }, bob: Math.sin(step(t, 6) * 2) * 3 },
      { shut: 1, red: 0.5, lit: 0.35, neonOff: true, drops: false, crate: 980, fg: () => fgRack(fgx(1800, 0.7, K.day[1]), 0.75) }); RIG.shake = 0;
    stamp('DAY 1', t, C0.day, 430, 190, 140, 504); if (t > C0.twenty) { push(1500, 760, 1, 0.03); label(0, 0, '29 TO GO', 380, '#f2c230', 0, 60); pop(); } }],
  [C0.store - 0.1, 'out', (t, u) => { rigAt(t, K.out); RIG.focus = 1;
    ext25(t, { shut: true, signOff: false, zom: false, extra: () => walkers(t, 7, { seed: 3210, x: (i, q, d) => 1380 + q * 460 - u * 14 * (0.5 + d), y0: 800, y1: 900, s0: 0.45, s1: 0.64 }), fg: () => fgPump(300 + u * 30) }); }]
];
// пролёт сквозь витрину / растворение со «взрывом» масштаба на стыках улица↔магазин
const XFADE = { wide: 0.32, out: 0.45 };
function shot25(t) { let i = 0; while (i < SHOT25.length - 1 && t >= SHOT25[i + 1][0]) i++; return i; }
function drawShot(i, t) { RIG.shake = 0; RIG.roll = 0; RIG.dof = 5; SHOT25[i][2](t, t - SHOT25[i][0]); }
frame = function (t) {
  const i = shot25(t), [t0, nm] = SHOT25[i], u = t - t0, xf = XFADE[nm];
  drawShot(i, t);
  if (xf && i > 0 && u < xf) {                                        // старый план поверх нового — растворяется и «улетает» в объектив
    const prev = ctx, g = XF.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, PW, PH); ctx = g; S = 1; SS.length = 0; drawShot(i - 1, t); ctx = prev; S = 1;
    const p = u / xf, sc = 1 + 0.9 * eo(p); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1 - sm(p); ctx.translate(PW / 2, PH / 2); ctx.scale(sc, sc); ctx.filter = `blur(${(6 * p).toFixed(1)}px)`; ctx.drawImage(XF, -PW / 2, -PH / 2); ctx.restore();
  }
  // смаз при резком панорамировании («хлыст»)
  let sp = 0; { const save = { ...RIG }; const keys = K[nm]; if (keys) { rigAt(t - 1 / 24, keys); sp = Math.abs(RIG.X - save.X) * save.zoom; } Object.assign(RIG, save); }
  if (sp > 25) { const a = Math.min(0.5, (sp - 25) / 80); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.drawImage(ctx.canvas, -sp * 0.5, 0); ctx.drawImage(ctx.canvas, sp * 0.5, 0); ctx.restore(); }
};
