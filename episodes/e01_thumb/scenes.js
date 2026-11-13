/* Обложка эп. 1: DAY 1 (светло, Joe с чипсами) | рваная бумага | DAY 30 (зомби внутри, зарубки, крик). */
const EP = { title: null, subs: false }; const SHAKES = []; const CUE = {}; const SH = {}; const SHOTS = [];
const JP = { x: 640, y: 1000 - 508 * 0.95, s: 0.95 };
function chips(x, y, r, s = 1) { push(x, y, s, r); const zz = []; for (let q = 0; q <= 8; q++) zz.push([-34 + q * 8.5, -50 + (q % 2) * 7]);
  piece([[-34, 50], [-38, 0], ...zz, [38, 0], [34, 50]], '#f2c230', { raw: true, seed: 360, lw: 2.4, shade: () => { ellP(0, 4, 24, 18, '#d8342c', { seed: 361, line: false }); } }); pop(); }
/* обложка (после DUR — в видео не попадает): DAY 1 светлая половина | рваная бумага | DAY 30 тёмная, зомби внутри */
function tornX(y) { return 960 + Math.sin(y * 0.031) * 18 + Math.sin(y * 0.11 + 1.3) * 9 + (hsh(Math.floor(y / 14)) % 13) - 6; }
function tornPath(side) { const p = []; for (let y = -20; y <= H + 20; y += 14) p.push([tornX(y) + side * 14, y]); return p; }
SHOTS.push([0, 'thumb']);
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
  for (let k = 0; k < 6; k++) { const x0 = 330 + k * 70; for (let q = 0; q < 4; q++) stroke([[x0 + q * 12, 360], [x0 + q * 12 + 4, 430]], '#1c1512', 5); stroke([[x0 - 8, 410], [x0 + 52, 376]], '#c8241c', 5); }   // зарубки дней на жалюзи
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
