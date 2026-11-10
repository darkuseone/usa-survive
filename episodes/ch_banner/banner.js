/* Баннер канала (2560×1440). Безопасная зона для всех устройств — 1546×423 по центру (x 507…2053, y 508…931): название, слоган, Joe и зомби.
   Вне её (ТВ/широкий экран): ночная трасса, луна, дождь, толпа силуэтов, вывеска заправки. */
const EP = { title: null, subs: false }; const SHAKES = []; const CUE = {}; const SH = {}; const SHOTS = [[0, 'bn']];
function hudFrame() {}
function torn(y, seed, amp = 12) { const P = []; for (let x = -60; x <= W + 60; x += 22) P.push([x, y + Math.sin(x * 0.013 + seed) * amp * 0.6 + ((hsh(Math.floor(x / 22), seed) % 13) - 6)]); return P; }
SH.bn = function (t) {
  rectP(-40, -40, W + 80, H + 80, '#1f2742', { seed: 9001, line: false, step: 90, shade: () => { radial(2120, 250, 900, 'rgba(70,90,150,1)', 0.5); radial(400, 1300, 900, 'rgba(120,40,60,1)', 0.25); } });
  layer(() => ellP(2140, 250, 120, 120, '#f1ecd2', { seed: 9002, lw: 2.4 }), { sx: 0, sy: 0, sb: 40, sc: 'rgba(240,235,200,0.6)' });
  piece([[-60, 1060], ...Array.from({ length: 30 }, (_, i) => [i * 92, 980 - (hsh(i, 3) % 90) - (i % 3) * 25]), [W + 60, 1060]], '#141a24', { seed: 9003, lw: 0, line: false });   // лес
  rectP(-40, 1060, W + 80, 420, '#2a2d34', { seed: 9004, line: false, step: 80 }); for (let i = 0; i < 14; i++) rectP(i * 200 - 20, 1240, 110, 18, '#e9c43a', { seed: 9010 + i, lw: 1.2 });   // трасса
  push(2330, 820); rectP(-12, 0, 24, 260, '#3a3d44', { seed: 9020, lw: 2 }); rectP(-150, -160, 300, 170, '#d8342c', { seed: 9021, lw: 2.4 }); txt('HWY 40', 0, -112, 52, { font: 'Inter Black', col: '#fbf8f0' }); txt('FUEL & FOOD', 0, -50, 40, { font: 'Inter Black', col: '#ffd21f' }); pop();
  radial(2330, 740, 300, 'rgba(255,90,70,1)', 0.25);
  for (let i = 0; i < 26; i++) { const r = rng(9030 + i), x = 60 + i * 98 + r() * 40; if (x > 520 && x < 2040) continue; layer(() => zMini(x, 1015 + r() * 60, 0.42 + r() * 0.12, t + i, 9030 + i, { walk: true, dim: 0.35 }), { sx: 3, sy: 4, sb: 6 }); }
  const r = rng(9100); for (let i = 0; i < 260; i++) { const x = r() * W, y = r() * H; stroke([[x, y], [x - 8, y + 46]], 'rgba(190,215,250,0.28)', 2); }
  // полоса бумаги поперёк безопасной зоны
  layer(() => piece([...torn(548, 1), ...torn(900, 2).reverse()], '#f3ecd8', { seed: 9200, raw: true, lw: 2.6 }), { sx: 0, sy: 14, sb: 30 });
  tape(560, 552, 200, -0.08, 9201); tape(2000, 556, 200, 0.07, 9202);
  push(1280, 666, 1, -0.02); ransom('PAPER SURVIVORS', 0, 0, 150, 9210, { maxW: 1040, bgs: [['#111', '#fbfaf6'], ['#ffd21f', '#111'], ['#d8342c', '#fff'], ['#2bb3e0', '#fff'], ['#111', '#ffd21f'], ['#ff7a1a', '#fff'], ['#fbfaf6', '#d8342c']] }); pop();
  push(1280, 820, 1, 0.015); card(0, 0, 820, 92, 0, 9220, '#ffd21f'); txt('CAN YOU SURVIVE 30 DAYS?', 0, 4, 54, { font: 'Inter Black', col: '#1c1512' }); pop();
  layer(() => joe({ x: 650, y: 650, s: 0.76, t: 0.6, still: true, mood: 'dread', lk: [0.7, 0], arms: { l: [-150, 300, 'open'], r: [150, 120, 'fist'] } }), { sx: 8, sy: 10, sb: 16 });
  layer(() => zombie({ x: 1920, y: 655, s: 0.76, t: 1.2, v: 1, flip: true, tilt: -0.15, m: { open: 0 }, smile: -0.9, arms: { l: [-170, 110, 'open'], r: [160, 140, 'open'] } }), { sx: 8, sy: 10, sb: 16 });
};
function post(t, o) { o.save(); o.filter = 'saturate(1.18) contrast(1.06) brightness(1.03)'; o.drawImage(o.canvas, 0, 0); o.restore(); }
