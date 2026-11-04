/* Тест «Paper Survivors» — ночная заправка изнутри: витрина во всю стену, за ней навес и колонки, дверь с колокольчиком, стальные жалюзи, полка со снеками, касса; вставка «кнопка LOCKDOWN». */

const GL = { y0: 140, y1: 880, door: [800, 1120] };          // витрина и дверь (мировые координаты), пол y 1000
let TT = 0;

function outside(t, o = {}) {                                // ночь за стеклом: небо, навес, колонки, асфальт, фигуры
  rectP(-200, GL.y0 - 20, 2320, 600, '#1d2643', { seed: 200, line: false, step: 90, shade: () => {
    const r = rng(201); for (let i = 0; i < 40; i++) dot(r() * 1920, GL.y0 + r() * 260, 1.5 + r() * 2, '#9aa6d0', 0.5); } });
  piece([[-200, 640], [300, 600], [700, 630], [1200, 590], [1700, 620], [2120, 600], [2120, 700], [-200, 700]], '#141a2e', { seed: 202 });   // лес/холмы
  rectP(-200, 690, 2320, 340, '#3b3f4b', { seed: 203, line: false, step: 70, shade: () => {                              // асфальт и разметка
    for (let x = -100; x < 2000; x += 260) rectP(x, 790, 120, 10, '#d9d0a0', { seed: 204 + x, line: false, a: 0.6 }); } });
  rectP(-200, GL.y0 + 20, 2320, 56, '#e7e3d6', { seed: 206, lw: 2.4, shade: () => { rectP(-200, GL.y0 + 58, 2320, 18, '#c8342c', { seed: 207, line: false }); } });   // навес
  for (let x = 120; x < 1920; x += 300) ellP(x, GL.y0 + 84, 34, 8, '#fff6cf', { seed: 208 + x, lw: 1.6, tex: false });
  [[380, 'A'], [1540, 'B']].forEach(([x, k], i) => {                                                                       // колонки
    rectP(x - 70, 520, 140, 230, '#c8342c', { seed: 210 + i, lw: 2.6, shade: () => { rectP(x - 70, 520, 140, 46, '#f3ecd8', { seed: 212 + i, line: false }); } });
    rectP(x - 44, 590, 88, 60, '#1c2330', { seed: 214 + i, lw: 2 }); txt(i ? '4' : '3', x, 620, 40, { font: 'Oswald', weight: 600, col: '#7dffb0' });
    txt('GAS', x, 543, 30, { font: 'Inter Black', col: '#c8342c' }); stroke([[x + 70, 600], [x + 104, 660], [x + 96, 740]], '#1c1512', 7);
    rectP(x - 90, 750, 180, 26, '#8d8f94', { seed: 216 + i, lw: 2 }); });
  if (o.car) { push(1180, 760, 1); piece([[-230, 0], [-210, -80], [-120, -130], [110, -130], [190, -80], [240, -10], [240, 30], [-230, 30]], '#5a6b80', { seed: 220 });
    piece([[-100, -118], [90, -118], [160, -76], [-180, -76]], '#9fb4c8', { seed: 221, lw: 2 }); ellP(-140, 30, 44, 44, '#1c1512', { seed: 222 }); ellP(150, 30, 44, 44, '#1c1512', { seed: 223 });
    if (o.carOpen) piece([[-60, -76], [-150, -150], [-150, 10], [-60, 20]], '#4d5d70', { seed: 224, lw: 2.4 }); pop(); }
  (o.zoms || []).forEach(z => layer(() => zombie({ t, ...z }), { sx: 4, sy: 6, sb: 8 }));
  rectP(-200, GL.y0 - 20, 2320, 1000, 'rgba(20,28,60,0.22)', { raw: true, line: false, tex: false });                    // ночной воздух
}

function glassWall(t, o = {}) {                               // стекло, рамы, дверь (o.door 0..1 — открыта), колокольчик
  const [d0, d1] = GL.door, od = o.door ?? 0;
  // блики на стекле
  for (let x = -80; x < 2000; x += 330) { piece([[x, GL.y0], [x + 60, GL.y0], [x - 120, GL.y1], [x - 180, GL.y1]], 'rgba(255,255,255,0.07)', { raw: true, line: false, tex: false });
    piece([[x + 90, GL.y0], [x + 106, GL.y0], [x - 74, GL.y1], [x - 90, GL.y1]], 'rgba(255,255,255,0.06)', { raw: true, line: false, tex: false }); }
  // подоконная стенка (кроме двери) и рамы
  [[-200, d0], [d1, 2120]].forEach(([a, b], i) => rectP(a, GL.y1, b - a, 120, '#b9a98a', { seed: 230 + i, lw: 2.4, shade: () => { stroke([[a, GL.y1 + 18], [b, GL.y1 + 18]], '#9a8a6e', 4); } }));
  rectP(-200, GL.y0 - 30, 2320, 34, '#5c6168', { seed: 232, lw: 2.4 }); rectP(-200, GL.y1 - 10, 2320, 18, '#5c6168', { seed: 233, lw: 2 });
  for (let x = 160; x < 1920; x += 320) if (x < d0 - 40 || x > d1 + 40) rectP(x - 9, GL.y0, 18, GL.y1 - GL.y0, '#5c6168', { seed: 234 + x, lw: 2 });
  // дверь: открывается на зрителя, створка сужается к петле справа
  rectP(d0 - 16, GL.y0, 16, 1000 - GL.y0, '#4c5158', { seed: 240, lw: 2 }); rectP(d1, GL.y0, 16, 1000 - GL.y0, '#4c5158', { seed: 241, lw: 2 });
  const w = (d1 - d0) * (1 - 0.62 * sm(od)), xl = d1 - w, bulge = 60 * sm(od);
  piece([[xl, GL.y0 - bulge * 0.3], [d1, GL.y0], [d1, 1000], [xl, 1000 + bulge * 0.4]], 'rgba(180,205,230,0.16)', { seed: 242, lw: 0, line: false, tex: false });
  stroke([[xl, GL.y0 - bulge * 0.3], [d1, GL.y0], [d1, 1000], [xl, 1000 + bulge * 0.4], [xl, GL.y0 - bulge * 0.3]], '#4c5158', 14, { smooth: false });
  rectP(xl + w * 0.12, 560, w * 0.7, 22, '#c9ccd1', { seed: 243, lw: 2 });                                                     // ручка-штанга
  if (od < 0.3) { push(xl + w * 0.5, 470, 1, -0.03); card(0, 0, 170, 64, 0, 244, '#f2c230'); txt('PUSH', 0, 3, 36, { font: 'Inter Black', col: '#1c1512' }); pop(); }
  // табло часов и колокольчик над дверью
  rectP(866, 34, 188, 78, '#1a1614', { seed: 246, lw: 2.4 }); txt(o.clock || '3:07', 960, 74, 58, { font: 'Oswald', weight: 600, col: '#ff4a3a' });
  const sw = (o.bell ?? 0) * Math.sin(step(t, 24) * 22) * 0.5; stroke([[960, 112], [960, 126]], '#1c1512', 3);
  push(960, 126, 1, sw); piece([[-20, 0], [20, 0], [26, 34], [-26, 34]], '#d9a12b', { seed: 247, lw: 2 }); dot(0, 40, 7, '#8a6418'); pop();
  // неон OPEN 24/7
  push(1430, 330, 1, 0.02); rectP(-150, -50, 300, 100, 'rgba(10,10,20,0.6)', { seed: 248, lw: 2 });
  txt('OPEN 24/7', 0, 3, 50, { font: 'Oswald', weight: 600, col: o.neonOff ? '#4a2a30' : '#ff5a7a' }); pop();
}

function shutter(k, t) {                                     // стальные жалюзи сверху вниз, k 0..1
  if (k <= 0) return; const h = (1000 - GL.y0 + 40) * k, y0 = GL.y0 - 40, jj = Math.sin(step(t, 24) * 30) * (k < 1 ? 3 : 0);
  rectP(-200, y0, 2320, h, '#8e949a', { seed: 250, line: false, step: 60, shade: () => { for (let y = y0 + h; y > y0; y -= 30) { stroke([[-200, y], [2120, y]], '#6c7278', 4, { smooth: false }); stroke([[-200, y - 8], [2120, y - 8]], '#b0b6bb', 2, { smooth: false, a: 0.7 }); } } });
  rectP(-200, y0 + h - 26 + jj, 2320, 30, '#5c6168', { seed: 251, lw: 2.6 }); rectP(940, y0 + h - 20 + jj, 80, 16, '#c9ccd1', { seed: 252, lw: 2 });
}

function shelf(t) {                                          // полка со снеками слева
  rectP(40, 520, 500, 480, '#c9c2b2', { seed: 260, lw: 2.6 });
  [600, 740, 880].forEach((y, j) => { rectP(40, y, 500, 18, '#8a8f96', { seed: 261 + j, lw: 2 });
    for (let i = 0; i < 6; i++) { const c = ['#d8342c', '#f2c230', '#3d7fc4', '#46b86a', '#f2731c', '#8a4ac4'][(i + j * 2) % 6], x = 64 + i * 78;
      const zz = []; for (let q = 0; q <= 8; q++) zz.push([x + 2 + q * 7.5, y - 108 + (q % 2) * 7]);
      piece([[x + 4, y - 2], [x + 2, y - 30], [x - 2, y - 70], ...zz, [x + 66, y - 70], [x + 62, y - 30], [x + 60, y - 2]], c, { raw: true, seed: 270 + j * 10 + i, lw: 2.2, shade: () => {
        ellP(x + 32, y - 58, 22, 15, '#f6efe0', { seed: 290 + j * 10 + i, line: false, a: 0.9 }); stroke([[x + 18, y - 58], [x + 46, y - 58]], c, 3); stroke([[x + 6, y - 92], [x + 58, y - 92]], mix(c, '#000000', 0.25), 2.4); } }); } });
  rectP(40, 500, 500, 30, '#d8342c', { seed: 264, lw: 2.2 }); txt('SNACKS', 290, 516, 26, { font: 'Inter Black', col: '#fbfaf6' });
}

function counter(t, o = {}) {                                // касса справа на переднем плане
  rectP(1260, 720, 760, 300, '#7a5a3a', { seed: 300, lw: 2.8, shade: () => { for (let x = 1260; x < 2020; x += 90) stroke([[x, 740], [x, 1020]], '#6a4c30', 3); } });
  rectP(1240, 700, 800, 34, '#d9d4c4', { seed: 301, lw: 2.4 });
  rectP(1420, 600, 190, 104, '#2a2e36', { seed: 302, lw: 2.4, shade: () => { rectP(1436, 614, 158, 52, '#7dd0a0', { seed: 303, line: false, tex: false }); } });   // касса
  txt('$0.00', 1515, 640, 30, { font: 'Oswald', weight: 600, col: '#1c3a28' });
  rectP(1700, 560, 220, 140, '#f3ecd8', { seed: 304, lw: 2.2 }); txt('LOTTO', 1810, 600, 40, { font: 'Inter Black', col: '#3d7fc4' });
  for (let i = 0; i < 4; i++) rectP(1716 + i * 50, 630, 40, 56, ['#f2c230', '#46b86a', '#d8342c', '#8a4ac4'][i], { seed: 305 + i, lw: 1.6 });
}

function store(t, o = {}) {                                  // вся декорация, кроме героев и света
  rectP(-200, -200, 2320, 340, '#cfd2c8', { seed: 310, line: false, step: 70, shade: () => { for (let x = -200; x < 2120; x += 200) stroke([[x, -200], [x, 140]], '#b9bcb2', 3, { smooth: false }); } });
  [480, 1440].forEach((x, i) => rectP(x - 160, 0, 320, 26, (o.lit ?? 1) > 0.4 ? '#fbfcf2' : '#8a8e90', { seed: 312 + i, lw: 2, tex: false }));
  outside(t, o); glassWall(t, o); shutter(o.shut ?? 0, t);
  if (o.cal) calendar(o.cal, t);
  rectP(-200, 1000, 2320, 300, '#d9d4c4', { seed: 320, line: false, step: 60, shade: () => { for (let x = -200; x < 2120; x += 120) for (let y = 1000; y < 1300; y += 120) if (((x + y) / 120) % 2 === 0) rectP(x, y, 120, 120, '#c4bfae', { raw: true, line: false, tex: false }); } });
}

function calendar(k, t) {                                    // листок «DAY 1» на скотче, приклеен к жалюзи
  const p = popK(t, k, 0.3); if (p <= 0) return; push(1250, 420, p, 0.05); card(0, 0, 300, 340, 0, 330, '#fbfaf6');
  rectP(-150, -170, 300, 70, '#c8241c', { seed: 331, lw: 2 }); txt('NOVEMBER', 0, -134, 36, { font: 'Inter Black', col: '#fbfaf6' });
  txt('1', 0, 30, 170, { font: 'Oswald', weight: 600, col: '#1c1512' }); pop(); tape(1250, 250, 120, -0.06, 332);
}

function storeLight(o = {}) {                                // свет: люминесцентные лампы, мигание, тревога
  const lit = o.lit ?? 1, red = o.red ?? 0, fl = o.flick ? (Math.sin(step(TT, 24) * 37) > 0.2 ? 1 : 0.35) : 1;
  lightmap(mix(mix('#5e6478', '#b4b8c8', lit * fl), '#7a3434', red), () => {
    radial(480, 60, 1000, 'rgba(240,248,255,1)', 0.55 * lit * fl); radial(1440, 60, 1000, 'rgba(240,248,255,1)', 0.55 * lit * fl);
    radial(1430, 330, 260, 'rgba(255,90,130,1)', o.neonOff ? 0 : 0.35);
    if (red > 0) { const b = 0.55 + 0.45 * Math.abs(Math.sin(step(TT, 12) * 4)); radial(960, 80, 1400, 'rgba(255,70,50,1)', red * b); }
    if (o.fn) o.fn(); });
  if (!o.neonOff) glowAdd(1430, 333, 200, 'rgba(255,80,120,1)', 0.25);
  if (red > 0) glowAdd(960, 80, 300, 'rgba(255,60,40,1)', 0.4 * red);
}

function lockBtn(t, c) {                                     // вставка: удар кулаком по кнопке LOCKDOWN
  bg('#5c4430'); for (let i = 0; i < 9; i++) stroke([[0, 120 * i + 40], [W, 120 * i + 30]], '#4d3826', 4);
  const hit = c, press = t > hit ? 1 - sm((t - hit - 0.15) / 0.5) * 0.4 : 0;
  push(960, 600, 1, -0.03); rectP(-360, -230, 720, 460, '#8e949a', { seed: 340, lw: 3 });
  for (let i = 0; i < 12; i++) piece([[-360 + i * 64, -230], [-328 + i * 64, -230], [-360 + i * 64 + 2, -198], [-392 + i * 64 + 2, -198]], '#f2c230', { raw: true, line: false });
  rectP(-360, -230, 720, 32, 'rgba(0,0,0,0)', { seed: 341, lw: 2.4 }); rectP(-220, 150, 440, 60, '#1c1512', { seed: 342, lw: 2 });
  txt('LOCKDOWN', 0, 182, 46, { font: 'Inter Black', col: '#fbfaf6' });
  ellP(0, 10, 170, 60, '#3a3d42', { seed: 343, lw: 2.6 }); ellP(0, -10 + press * 30, 150, 110 - press * 40, '#d8342c', { seed: 344, lw: 3, shade: () => { ellP(-50, -40 + press * 20, 40, 22, '#ff8a7a', { seed: 345, line: false, a: 0.7 }); } });
  pop();
  const kf = t < hit ? eo(clamp((t - (hit - 0.3)) / 0.3)) : 1, fx = lerp(1500, 990, kf), fy = lerp(-120, 470, kf) + press * 24;   // кулак по диагонали сверху-справа
  push(fx, fy, 3.4, -0.55); const tb = tube([[0, -330], [0, -160], [0, -8]], 62, 56); piece(tb.pts, JOE.pal.top, { raw: true, seed: 346, lw: 2.6 });
  piece([[-34, -44], [34, -44], [34, -12], [-34, -12]], JOE.pal.topD, { seed: 347, lw: 2 });
  blobP([[-34, -16], [34, -16], [38, 22], [0, 38], [-38, 22]], JOE.pal.skin, { seed: 348, lw: 2.6 }); for (let q = 0; q < 3; q++) stroke([[-18 + q * 18, 18], [-18 + q * 18, 32]], JOE.pal.skinD, 2.6);
  blobP([[30, -6], [48, 4], [44, 22], [28, 16]], JOE.pal.skin, { seed: 349, lw: 2.4 }); pop();
  if (t > hit && t < hit + 0.25) glowAdd(960, 600, 500, 'rgba(255,80,60,1)', 0.6 * (1 - (t - hit) / 0.25));
}
