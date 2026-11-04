/* Тест «Paper Survivors»: ночная смена на заправке → дверь, колокольчик, зомби → кулак по LOCKDOWN → жалюзи → «Day one». ~18 с, голос Knox Dark. */
const WW = (k, re) => { const w = LN[k].words.find(x => re.test(x.w)); return w ? w.s : LN[k].start; };
const CUE = {
  alone: WW('a001', /^alone/i), a2: LN.a002.start, chime: WW('a002', /^chime/i), whatever: WW('a002', /^whatever/i), gas: WW('a002', /^gas/i),
  a3: LN.a003.start, slam: WW('a003', /^slam/i), steel: WW('a003', /^steel/i), crash: WW('a003', /^crash/i), a4: LN.a004.start, day: WW('a004', /^day/i), twenty: WW('a004', /^twenty/i)
};
const SHAKES = [[CUE.slam + 0.12, 0.4, 16], [CUE.crash, 0.7, 22], [CUE.twenty + 0.3, 0.3, 8]];
const EP = { title: null, subs: false };
const JP = { x: 640, y: 1000 - 508 * 0.95, s: 0.95 };                      // Joe у полки
const ZD = { x: 960, y: 1000 - 508 * 0.9, s: 0.9 };                         // зомби в дверях

function scene(t, jo, o = {}) {
  TT = t; store(t, o);
  shelf(t);
  if (o.zIn) layer(() => zombie({ ...ZD, t, v: 0, ...o.zIn }), { sx: 8, sy: 10, sb: 14 });
  if (jo) layer(() => { joe({ ...JP, t, ...jo }); if (jo.bag) chips(JP.x + (jo.flip ? -1 : 1) * jo.bag[0] * JP.s, JP.y + jo.bag[1] * JP.s, jo.bagRot || 0); }, { sx: 8, sy: 10, sb: 14 });
  counter(t, o);
  storeLight(o);
}
function chips(x, y, r) { push(x, y, 1, r); blobP([[-34, -50], [34, -50], [40, 50], [-40, 50]], '#f2c230', { seed: 360, lw: 2.4, shade: () => { ellP(0, 0, 24, 20, '#d8342c', { seed: 361, line: false }); } }); pop(); }
function hudTime(t, t0) { push(420, 170, 1, -0.05); ransom('3:07 AM', 0, 0, 100, 501, { reveal: pr(t, t0, t0 + 0.3), pop: true }); pop(); }

const zOut = (t, k) => [{ x: lerp(1320, 1040, k), y: lerp(560, 600, k), s: lerp(0.42, 0.62, k), v: 1 }];   // фигура идёт к двери снаружи

const SHOTS = [[0, 'wide'], [CUE.alone - 0.1, 'joeMid'], [CUE.a2 - 0.05, 'door'], [CUE.whatever - 0.1, 'shock'], [CUE.gas - 0.35, 'zomb'],
  [CUE.a3 - 0.05, 'button'], [CUE.steel - 0.1, 'shut'], [CUE.a4 - 0.05, 'day1']];
const SH = {
  wide(t, u) { const [cx, cy, z] = ck(t, [[0, 960, 540, 1.0], [CUE.alone, 900, 580, 1.1]]); cam(cx, cy, z);
    scene(t, { flip: true, lk: [0.8, -0.2], mood: 'sleepy', arms: { l: [-150, 300, 'open'], r: [200 - 40 * Math.abs(Math.sin(step(t, 6) * 1.5)), 150, 'fist'] }, bag: [204 - 40 * Math.abs(Math.sin(step(t, 6) * 1.5)), 110] }, {});
    pop(); hudTime(t, 0.25); },
  joeMid(t, u) { cam(JP.x + 60, JP.y + 130, 1.9 + u * 0.03);
    scene(t, { flip: true, lk: [-0.6, 0.1], mood: 'sleepy', lid: 0.55, arms: { l: [-150, 300, 'open'], r: [170, 160, 'fist'] }, bag: [176, 118], bagRot: 0.2, tilt: Math.sin(step(t, 6)) * 0.03 }, {});
    pop(); },
  door(t, u) { const k = pr(t, CUE.a2, CUE.chime), od = pr(t, CUE.chime - 0.1, CUE.chime + 0.5);
    cam(960, 560, 1.55 + u * 0.04); scene(t, null, { zoms: od < 0.6 ? zOut(t, k) : [], zIn: od >= 0.6 ? { s: 0.8, x: 980, y: 1000 - 508 * 0.8 } : null, door: od, bell: od > 0 ? 1 - pr(t, CUE.chime + 0.4, CUE.chime + 1.6) : 0, car: true, carOpen: true });
    pop(); },
  shock(t, u) { cam(JP.x + 30, JP.y + 120, 2.05 - u * 0.05);
    scene(t, { lk: [0.7, 0], mood: 'shock', arms: { l: [-180, 170, 'open'], r: [180, 150, 'open'] }, sweat: 1 }, { door: 1, car: true, carOpen: true, flick: true, zIn: { s: 0.8, x: 980, y: 1000 - 508 * 0.8 } });
    pop(); },
  zomb(t, u) { cam(ZD.x, ZD.y + 120, 1.7 + u * 0.12);
    scene(t, null, { door: 1, car: true, carOpen: true, flick: true, zIn: { t: t, tilt: 0.18 + Math.sin(step(t, 8) * 3) * 0.05 } });
    pop(); },
  button(t, u) { cam(W / 2, H / 2, 1, 0, shakeAt(t)); lockBtn(t, CUE.slam + 0.12); pop();
    if (t > CUE.slam + 0.12) { push(W / 2, 170, 1, -0.04); ransom('LOCKDOWN!', 0, 0, 140, 502, { reveal: pr(t, CUE.slam + 0.12, CUE.slam + 0.35), pop: true }); pop(); } },
  shut(t, u) { const sh = pr(t, CUE.steel, CUE.crash + 0.1); cam(960, 560, 1.05, 0, shakeAt(t));
    scene(t, { lk: [0.6, -0.3], mood: 'dread', arms: { l: [-150, 300, 'open'], r: [150, 300, 'open'] }, legs: 'stand' }, { door: 1 - sm(pr(t, CUE.steel - 0.1, CUE.steel + 0.3)), zoms: [{ x: 1180, y: 590, s: 0.6, v: 1 }, { x: 760, y: 600, s: 0.55, v: 2 }], car: true, shut: sh, red: 1, lit: 0.35, neonOff: true });
    pop(); if (t > CUE.crash) { push(W / 2, 160, 1, 0.03); ransom('CRASH!', 0, 0, 130, 503, { reveal: pr(t, CUE.crash, CUE.crash + 0.2), pop: true }); pop(); } },
  day1(t, u) { cam(860, 540, 1.25 - u * 0.03, 0, shakeAt(t));
    scene(t, { lk: [0.5, -0.4], mood: 'dread', lid: 0.2, arms: { l: [-150, 300, 'open'], r: [150, 300, 'fist'] }, bob: Math.sin(step(t, 6) * 2) * 3 }, { shut: 1, red: 0.55, lit: 0.3, neonOff: true, cal: CUE.day - 0.1 });
    pop();
    if (t > CUE.day) { push(W / 2 - 330, 200, 1, -0.04); ransom('DAY 1', 0, 0, 150, 504, { reveal: pr(t, CUE.day, CUE.day + 0.25), pop: true }); pop(); }
    if (t > CUE.twenty) { push(W / 2 + 470, 700, 1, 0.04); label(0, 0, '29 TO GO', 380, '#f2c230', 0, 60); pop(); } }
};

/* обложка (после DUR — в видео не попадает): DAY 1 светлая половина | рваная бумага | DAY 30 тёмная, жалюзи гнутся, руки зомби из-под щели */
function tornX(y) { return 960 + Math.sin(y * 0.031) * 18 + Math.sin(y * 0.11 + 1.3) * 9 + (hsh(Math.floor(y / 14)) % 13) - 6; }
function tornPath(side) { const p = []; for (let y = -20; y <= H + 20; y += 14) p.push([tornX(y) + side * 14, y]); return p; }
function zHands(t) { [[560, 0.1], [760, -0.2], [1340, 0.15], [1560, -0.1]].forEach(([x, r], i) => { push(x, 930, 1.3, r); const P = ZPAL[i % 3];
  piece(tube([[0, 80], [0, 30], [6, -30]], 40, 34).pts, P.top, { raw: true, seed: 600 + i, lw: 2.4 });
  blobP([[-28, -30], [28, -30], [32, -70], [18, -96], [-18, -96], [-32, -70]], P.skin, { seed: 610 + i, lw: 2.4 }); for (let q = 0; q < 4; q++) stroke([[-21 + q * 14, -88], [-21 + q * 14, -112]], P.skinD, 9); pop(); }); }
const THUMB = false; if (THUMB) SHOTS.splice(0, SHOTS.length, [0, 'thumb']); else SHOTS.push([DUR + 0.5, 'thumb']);
SH.thumb = function (t) {
  ctx.save(); ctx.beginPath(); ctx.moveTo(-10, -10); tornPath(0).forEach(p => ctx.lineTo(p[0], p[1])); ctx.lineTo(-10, H + 10); ctx.closePath(); ctx.clip();
  push(-480, 0); cam(700, 640, 1.4); TT = 2; store(2, { car: true }); shelf(2); layer(() => { joe({ ...JP, t: 2, lk: [0.3, 0], mood: '', smile: 0.7, arms: { l: [-150, 300, 'open'], r: [200, 40, 'open'] } }); }, { sx: 8, sy: 10, sb: 14 }); counter(2); storeLight({ lit: 1.25 }); pop(); pop();
  ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.moveTo(W + 10, -10); tornPath(0).forEach(p => ctx.lineTo(p[0], p[1])); ctx.lineTo(W + 10, H + 10); ctx.closePath(); ctx.clip();
  push(480, 0); cam(700, 640, 1.4); TT = 7; store(7, { shut: 1, neonOff: true });
  for (let k = 0; k < 6; k++) { const x0 = 700 + k * 70; for (let q = 0; q < 4; q++) stroke([[x0 + q * 12, 330], [x0 + q * 12 + 4, 400]], '#1c1512', 5); stroke([[x0 - 8, 380], [x0 + 52, 346]], '#c8241c', 5); }   // зарубки дней на жалюзи
  shelf(7); layer(() => zombie({ x: 990, y: 1000 - 508 * 0.95, s: 0.95, t: 7, v: 2, flip: true, tilt: -0.18, arms: { l: [-170, 120, 'open'], r: [150, 110, 'open'] } }), { sx: 8, sy: 10, sb: 14 }); layer(() => zombie({ x: 430, y: 1000 - 508 * 0.92, s: 0.92, t: 7, v: 0, tilt: 0.16, arms: { l: [-150, 130, 'open'], r: [170, 120, 'open'] } }), { sx: 8, sy: 10, sb: 14 });
  layer(() => joe({ ...JP, x: 700, t: 7, lk: [0, -0.2], mood: 'shock', m: { open: 0.55, round: 0.9 }, smile: -0.8, sweat: 1, arms: { l: [-180, 160, 'open'], r: [180, 150, 'open'] } }), { sx: 8, sy: 10, sb: 14 }); counter(7);
  storeLight({ red: 0.25, lit: 0.05, neonOff: true, fn: () => radial(700, 420, 700, 'rgba(120,190,200,1)', 0.45) }); pop(); pop();
  ctx.restore();
  piece([...tornPath(-1), ...tornPath(1).reverse()], '#f3ecd8', { raw: true, lw: 2.4 });                                   // рваная кромка бумаги
  tape(tornX(120), 120, 150, 0.5, 620); tape(tornX(960), 960, 150, -0.45, 621);
  push(470, 130, 1, -0.05); ransom('DAY 1', 0, 0, 170, 630); pop();
  push(1440, 130, 1, 0.04); ransom('DAY 30', 0, 0, 150, 637); pop();
};
