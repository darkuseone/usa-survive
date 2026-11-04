/* Тест «Paper Survivors» v2: снаружи под дождём → Joe раскладывает снеки → фары → колокольчик, зомби в дверях → пакет падает, крик →
   зомби шаркает внутрь → Joe бежит к кассе → кулак по LOCKDOWN → дверь захлопывается, жалюзи → Joe оседает на ящик, удары в жалюзи, «Day one». ~17 с. */
const WW = (k, re) => { const w = LN[k].words.find(x => re.test(x.w)); return w ? w.s : LN[k].start; };
const CUE = {
  alone: WW('a001', /^alone/i), shift: WW('a001', /^shift/i), a2: LN.a002.start, chime: WW('a002', /^chime/i), whatever: WW('a002', /^whatever/i), walked: WW('a002', /^walked/i), gas: WW('a002', /^gas/i),
  a3: LN.a003.start, slam: WW('a003', /^slam/i), button: WW('a003', /^button/i), steel: WW('a003', /^steel/i), crash: WW('a003', /^crash/i),
  a4: LN.a004.start, day: WW('a004', /^day/i), twenty: WW('a004', /^twenty/i)
};
CUE.lights = CUE.shift + 0.3;                      // фары по стене
CUE.drop = CUE.whatever + 0.05;                    // пакет выпал
CUE.hit = CUE.button + 0.02;                       // кулак по кнопке
CUE.close = CUE.hit + 0.05;                        // дверь захлопнулась
CUE.sit = CUE.a4 - 0.1;                            // Joe оседает
CUE.bang1 = CUE.a4 + 0.55; CUE.bang2 = CUE.twenty + 0.6; CUE.bang3 = CUE.twenty + 1.5;
const SHAKES = [[CUE.hit, 0.35, 16], [CUE.crash, 0.7, 24], [CUE.bang1, 0.3, 9], [CUE.bang2, 0.3, 9], [CUE.bang3, 0.35, 12]];
const EP = { title: null, subs: false };
const JP = { x: 640, y: 1000 - 508 * 0.95, s: 0.95 };

// ---------- движение
function kf(t, K) { if (t <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (t < K[i][0]) { const a = K[i - 1], b = K[i], k = eio((t - a[0]) / (b[0] - a[0])); return a[1].map((v, j) => lerp(v, b[1][j], k)); } return K[K.length - 1][1]; }
function stackArm(t) {                             // цикл «взял из коробки → поднял → поставил на полку», 1.6 с, на двойках
  const p = (step(t, 12) % 1.6) / 1.6;
  const h = kf(p, [[0, [215, 70]], [0.3, [130, 300]], [0.42, [130, 300]], [0.7, [175, 160]], [0.92, [215, 70]], [1, [215, 70]]]);
  return { hand: h, bag: p > 0.36 && p < 0.93 };
}
const hw = (P, h, flip) => [P.x + (flip ? -1 : 1) * h[0] * P.s, P.y + h[1] * P.s];
function chips(x, y, r, s = 1) { push(x, y, s, r); const zz = []; for (let q = 0; q <= 8; q++) zz.push([-34 + q * 8.5, -50 + (q % 2) * 7]);
  piece([[-34, 50], [-38, 0], ...zz, [38, 0], [34, 50]], '#f2c230', { raw: true, seed: 360, lw: 2.4, shade: () => { ellP(0, 4, 24, 18, '#d8342c', { seed: 361, line: false }); } }); pop(); }

function scene(t, jo, o = {}) {
  TT = t; store(t, o); if (o.drops !== false) glassDrops(t);
  shelf(t); if (o.box) boxP(470, 1000, 0.9); if (o.crate) crate(o.crate, 1000);
  if (o.zIn) layer(() => zombie({ x: 960, y: 1000 - 508 * 0.9, s: 0.9, t, v: 0, ...o.zIn }), { sx: 8, sy: 10, sb: 14 });
  if (jo && !jo.behind) drawJoe(t, jo);
  counter(t, o);
  if (jo && jo.behind) drawJoe(t, jo);
  if (o.fallBag) o.fallBag();
  dust(t, 700, 400, 1400, 500, 26);
  storeLight(o);
}
function drawJoe(t, jo) { const P = { ...JP, ...jo.P }; layer(() => { joe({ ...P, t, ...jo }); if (jo.bag) chips(...hw(P, jo.bag, jo.flip), jo.bagRot || 0, 0.9); }, { sx: 8, sy: 10, sb: 14 }); }
function sweep(t) {                                // свет фар проходит по магазину
  const k = pr(t, CUE.lights, CUE.lights + 1.3); if (k <= 0 || k >= 1) return;
  radial(lerp(1900, 100, k), 520, 700, 'rgba(255,250,225,1)', 0.65 * Math.sin(k * Math.PI));
}

const SHOTS = [[0, 'ext'], [CUE.alone - 0.1, 'wide'], [CUE.shift - 0.05, 'joeMid'], [CUE.a2 - 0.05, 'door'], [CUE.whatever - 0.1, 'shock'], [CUE.walked + 0.45, 'zomb'],
  [CUE.a3 - 0.05, 'run'], [CUE.button - 0.25, 'button'], [CUE.steel - 0.1, 'shut'], [CUE.sit, 'day1']];
const SH = {
  ext(t, u) { const [cx, cy, z] = ck(t, [[0, 900, 560, 1.0], [CUE.alone, 820, 520, 1.3]]); cam(cx, cy, z); exterior(t, { zom: true }); extLight(t); pop();
    push(420, 900, 1, -0.05); ransom('3:07 AM', 0, 0, 110, 501, { reveal: pr(t, 0.3, 0.7), pop: true }); pop(); },
  wide(t, u) { const [cx, cy, z] = ck(t, [[CUE.alone - 0.1, 900, 560, 1.06], [CUE.shift, 820, 590, 1.16]]); cam(cx, cy, z);
    const a = stackArm(t); scene(t, { flip: true, lk: [0.8, 0.1], mood: 'sleepy', arms: { l: [-150, 300, 'open'], r: [...a.hand, 'fist'] }, bag: a.bag ? [a.hand[0] + 4, a.hand[1] - 40] : null, tilt: Math.sin(step(t, 6)) * 0.02 }, { box: true, car: true });
    pop(); },
  joeMid(t, u) { const look = t > CUE.lights + 0.2; cam(JP.x - 20, JP.y + 140, 1.9 + u * 0.04);
    const a = stackArm(t), hold = look ? [180, 150] : a.hand;
    scene(t, { flip: true, lk: look ? [-0.9, -0.1] : [0.6, 0.2], mood: look ? '' : 'sleepy', lid: look ? 0.1 : 0.5, arms: { l: [-150, 300, 'open'], r: [...hold, 'fist'] }, bag: (look || a.bag) ? [hold[0] + 4, hold[1] - 40] : null, tilt: look ? -0.06 : 0 },
      { box: true, car: true, fn: () => sweep(t) });
    pop(); },
  door(t, u) { const k = pr(t, CUE.a2, CUE.chime - 0.05), od = pr(t, CUE.chime - 0.1, CUE.chime + 0.45);
    cam(960, 560, 1.5 + u * 0.05);
    const zo = { x: lerp(1500, 1010, k), y: lerp(560, 610, k), s: lerp(0.4, 0.66, k), v: 0, legs: 'run' };
    scene(t, null, { zoms: od < 0.5 ? [zo] : [], zIn: od >= 0.5 ? { s: 0.8, x: 980, y: 1000 - 508 * 0.8, legs: 'run' } : null, door: od, bell: od > 0 ? 1 - pr(t, CUE.chime + 0.4, CUE.chime + 1.8) : 0, car: true, rainA: 1 + od * 0.5 });
    pop(); },
  shock(t, u) { const z = u < 0.15 ? lerp(1.85, 2.25, eo(u / 0.15)) : 2.25; cam(JP.x + 40, JP.y + 130, z);
    const dropK = clamp((t - CUE.drop) / 0.55), bagX = JP.x - 180 * JP.s - dropK * 40, bagY = JP.y + 110 * JP.s + dropK * dropK * 380;
    scene(t, { lk: [0.8, -0.1], mood: 'shock', scream: t > CUE.drop + 0.1 ? 1 : 0, sweat: 1, arms: { l: [-180, 170, 'open'], r: [180, 150, 'open'] } },
      { door: 1, car: true, flick: true, zIn: { s: 0.8, x: 1010, y: 1000 - 508 * 0.8, t }, fallBag: () => { if (dropK < 1) chips(bagX, Math.min(bagY, 990), dropK * 2.4, 0.9); else chips(bagX - 10, 990, 1.4, 0.9); } });
    pop(); },
  zomb(t, u) { const k = clamp(u / 1.9); cam(960, 560 + k * 20, 1.55 + k * 0.45);
    scene(t, null, { door: 1, car: true, flick: true, zIn: { s: 0.9 + k * 0.08, x: 960 - k * 60, y: 1000 - 508 * (0.9 + k * 0.08), legs: 'run', tilt: 0.18 + Math.sin(step(t, 8) * 3) * 0.06, arms: { l: [-150, 110 - k * 30, 'open'], r: [150, 90 - k * 20, 'open'] } } });
    pop(); },
  run(t, u) { const k = clamp(u / 0.75), x = lerp(700, 1480, eio(k)); cam(lerp(820, 1300, eio(k)), 600, 1.3);
    scene(t, { P: { x }, legs: 'run', lean: 0.18, mood: 'shock', scream: 0.7, lk: [0.9, 0], arms: { l: [-170, 120, 'fist'], r: [170, 220, 'fist'] }, behind: k > 0.75 }, { door: 1, car: true, flick: true, zIn: { s: 0.9, legs: 'run' } });
    pop(); },
  button(t, u) { cam(W / 2, H / 2, 1, 0, shakeAt(t)); lockBtn(t, CUE.hit); pop();
    if (t > CUE.hit) { push(W / 2, 170, 1, -0.04); ransom('LOCKDOWN!', 0, 0, 140, 502, { reveal: pr(t, CUE.hit, CUE.hit + 0.25), pop: true }); pop(); } },
  shut(t, u) { const sh = pr(t, CUE.steel, CUE.crash + 0.05); cam(960, 580, 1.05 + u * 0.03, 0, shakeAt(t));
    const press = Math.sin(step(t, 8) * 5) * 8;
    scene(t, { P: { x: 1480 }, behind: true, lk: [-0.8, -0.3], mood: 'dread', arms: { l: [-150, 200, 'open'], r: [140, 200, 'fist'] } },
      { door: 0, zoms: [{ x: 960, y: 1000 - 508 * 0.85 - 40, s: 0.85, v: 0, arms: { l: [-140, 40 + press, 'open'], r: [140, 30 - press, 'open'] } }, { x: 1250, y: 600, s: 0.6, v: 1, legs: 'run' }, { x: 640, y: 610, s: 0.55, v: 2, legs: 'run' }],
        car: true, shut: sh, red: 0.4, lit: 0.45, neonOff: true, drops: sh < 0.9, fn: () => radial(960, 600, 500, 'rgba(120,220,190,1)', 0.35 * (1 - sh)) });
    pop(); if (t > CUE.crash) { push(W / 2, 170, 1, 0.03); ransom('CRASH!', 0, 0, 130, 503, { reveal: pr(t, CUE.crash, CUE.crash + 0.2), pop: true }); pop(); } },
  day1(t, u) { const sk = sm(clamp((t - CUE.sit) / 0.6)), z = lerp(1.2, 1.55, sm(clamp((t - CUE.twenty) / 2.2))); cam(1020, 620 - (z - 1.2) * 140, z, 0, shakeAt(t));
    const bang = SHAKES.slice(2).some(([t0]) => t > t0 && t < t0 + 0.25);
    const P = { x: 980, y: lerp(1000 - 508 * 0.95, 1000 - 220 - 345 * 0.95, sk) };
    scene(t, { P, legs: sk > 0.5 ? 'sit' : 'stand', lk: bang ? [-0.8, -0.4] : [0.1, 0.2], mood: 'dread', lid: bang ? 0 : 0.3, scream: bang ? 0.5 : 0, sweat: 1,
      arms: sk > 0.5 ? { l: [-120, 250, 'fist'], r: [120, 250, 'fist'] } : { l: [-150, 300, 'open'], r: [150, 300, 'open'] }, bob: Math.sin(step(t, 6) * 2) * 3 }, { shut: 1, red: 0.5, lit: 0.35, neonOff: true, drops: false, crate: 980 });
    pop();
    if (t > CUE.day) { push(430, 190, 1, -0.04); ransom('DAY 1', 0, 0, 140, 504, { reveal: pr(t, CUE.day, CUE.day + 0.25), pop: true }); pop(); }
    if (t > CUE.twenty) { push(1500, 760, 1, 0.03); label(0, 0, '29 TO GO', 380, '#f2c230', 0, 60); pop(); }
    if (t > DUR - 0.9) { ctx.save(); ctx.fillStyle = `rgba(0,0,0,${clamp((t - DUR + 0.9) / 0.8) * 0.85})`; ctx.fillRect(0, 0, W, H); ctx.restore(); } }
};
// счётчик дней в углу — поверх каждого плана (кроме вставки с кнопкой)
for (const k of Object.keys(SH)) { const f = SH[k]; SH[k] = function (t, u) { f(t, u); if (k !== 'button' && k !== 'thumb') dayTag(t, 1, { stamp: k === 'day1' ? CUE.day : null, clock: t > CUE.a3 ? '03:08 AM' : '03:07 AM' }); }; }

/* обложка (после DUR — в видео не попадает): DAY 1 светлая половина | рваная бумага | DAY 30 тёмная, зомби внутри */
function tornX(y) { return 960 + Math.sin(y * 0.031) * 18 + Math.sin(y * 0.11 + 1.3) * 9 + (hsh(Math.floor(y / 14)) % 13) - 6; }
function tornPath(side) { const p = []; for (let y = -20; y <= H + 20; y += 14) p.push([tornX(y) + side * 14, y]); return p; }
const THUMB = false; if (THUMB) SHOTS.splice(0, SHOTS.length, [0, 'thumb']); else SHOTS.push([DUR + 0.5, 'thumb']);
const TB1 = [['#ffd21f', '#111'], ['#fbfaf6', '#d8342c'], ['#2bb3e0', '#fff'], ['#fbfaf6', '#111'], ['#ff7a1a', '#fff']];
const TB30 = [['#e0201a', '#fff'], ['#ffd21f', '#111'], ['#111', '#ffd21f'], ['#fbfaf6', '#e0201a'], ['#e0201a', '#fff'], ['#111', '#fff']];
SH.thumb = function (t) {
  ctx.save(); ctx.beginPath(); ctx.moveTo(-10, -10); tornPath(0).forEach(p => ctx.lineTo(p[0], p[1])); ctx.lineTo(-10, H + 10); ctx.closePath(); ctx.clip();
  push(-480, 0); cam(700, 640, 1.4); TT = 2; store(2, { car: true }); shelf(2); boxP(470, 1000, 0.9);
  layer(() => { joe({ ...JP, t: 2, lk: [0.3, 0], smile: 0.8, arms: { l: [-150, 300, 'open'], r: [200, 140, 'fist'] } }); chips(JP.x + 210 * JP.s, JP.y + 90 * JP.s, 0.15); }, { sx: 8, sy: 10, sb: 14 });
  counter(2); storeLight({ lit: 1.5, fn: () => { radial(640, 520, 800, 'rgba(255,225,160,1)', 0.7); radial(1000, 300, 600, 'rgba(255,240,200,1)', 0.4); } }); pop(); pop();
  ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.moveTo(W + 10, -10); tornPath(0).forEach(p => ctx.lineTo(p[0], p[1])); ctx.lineTo(W + 10, H + 10); ctx.closePath(); ctx.clip();
  push(480, 0); cam(700, 640, 1.4); TT = 7; store(7, { shut: 1, neonOff: true });
  for (let k = 0; k < 5; k++) { const x0 = 420 + k * 70; for (let q = 0; q < 4; q++) stroke([[x0 + q * 12, 360], [x0 + q * 12 + 4, 430]], '#1c1512', 5); stroke([[x0 - 8, 410], [x0 + 52, 376]], '#c8241c', 5); }   // зарубки дней на жалюзи
  shelf(7); layer(() => zombie({ x: 990, y: 1000 - 508 * 0.95, s: 0.95, t: 7, v: 2, flip: true, tilt: -0.18, arms: { l: [-170, 120, 'open'], r: [150, 110, 'open'] } }), { sx: 8, sy: 10, sb: 14 });
  layer(() => zombie({ x: 410, y: 1000 - 508 * 0.92, s: 0.92, t: 7, v: 0, tilt: 0.16, arms: { l: [-150, 130, 'open'], r: [170, 120, 'open'] } }), { sx: 8, sy: 10, sb: 14 });
  layer(() => joe({ ...JP, x: 700, t: 7, lk: [0, -0.3], mood: 'shock', scream: 1, sweat: 1, arms: { l: [-190, 120, 'open'], r: [190, 110, 'open'] } }), { sx: 8, sy: 10, sb: 14 }); counter(7);
  storeLight({ red: 0.28, lit: 0.1, neonOff: true, fn: () => { radial(700, 420, 800, 'rgba(110,230,200,1)', 0.75); radial(700, 300, 320, 'rgba(255,255,255,1)', 0.3); radial(1000, 80, 500, 'rgba(255,60,50,1)', 0.5); } }); pop(); pop();
  ctx.restore();
  piece([...tornPath(-1), ...tornPath(1).reverse()], '#fbfaf6', { raw: true, lw: 2.4 });                                   // рваная кромка бумаги
  tape(tornX(120), 120, 150, 0.5, 620); tape(tornX(960), 960, 150, -0.45, 621);
  push(470, 130, 1, -0.05); ransom('DAY 1', 0, 0, 180, 630, { bgs: TB1 }); pop();
  push(1440, 130, 1, 0.04); ransom('DAY 30', 0, 0, 160, 637, { bgs: TB30 }); pop();
};
