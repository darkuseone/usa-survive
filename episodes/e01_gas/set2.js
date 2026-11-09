/* Эп. 1 «30 дней на заправке» — новые локации (подсобка с бойлером и задней дверью, морозильная камера, ночное окно-лоток, магазин в темноте с фонарём и лучами из щелей жалюзи),
   вставки-факты на пробке (инвентарь, вода FEMA, холодильник 4 ч / морозилка 48 ч, порядок еды, бойлер, блокнот наблюдений, карта эвакуации, итог), заставки глав, титул, концовка, переходы. */

// ---------------- общие мелочи
function tallyMarks(n, x, y, s = 1) {                         // зарубки «IIII/» на жалюзи
  push(x, y, s); for (let i = 0; i < n; i++) { const g = Math.floor(i / 5), k = i % 5, gx = g * 110;
    if (k < 4) stroke([[gx + k * 20, 0], [gx + k * 20 + 4, 74]], '#1c1512', 6); else stroke([[gx - 10, 54], [gx + 76, 16]], '#c8241c', 6); } pop();
}
function lanternP(x, y, s = 1, on = 1) {                      // походный фонарь
  push(x, y, s); stroke([[-26, -84], [0, -110], [26, -84]], '#3a3530', 5); rectP(-34, -86, 68, 18, '#2f5961', { seed: 1001, lw: 2 });
  rectP(-28, -68, 56, 76, on ? '#fff1b8' : '#9aa6a8', { seed: 1002, lw: 2.2, tex: false, shade: () => { for (let i = -1; i <= 1; i++) stroke([[i * 18, -68], [i * 18, 8]], '#3a3530', 2.4); } });
  rectP(-36, 8, 72, 22, '#2f5961', { seed: 1003, lw: 2 }); pop();
}
function lanternGlow(x, y, k = 1) { radial(x, y, 900, 'rgba(255,200,120,1)', 0.85 * k); radial(x, y, 300, 'rgba(255,230,170,1)', 0.6 * k); }
function puffs(t, x, y, n = 3) {                              // пар изо рта
  for (let i = 0; i < n; i++) { const ph = ((step(t, 12) * 0.7 + i / n) % 1); ellP(x + ph * 60 + i * 6, y - ph * 70, 16 + ph * 40, 12 + ph * 26, 'rgba(235,245,255,1)', { seed: 1010 + i, line: false, tex: false, a: 0.45 * (1 - ph) }); }
}
function shafts(t, a = 1, col = 'rgba(200,215,255,1)') {      // лучи дневного света из щелей жалюзи (внутри lightmap)
  for (let i = 0; i < 6; i++) { const x = 160 + i * 300 + Math.sin(i * 7.1) * 60, w = 30 + (i % 3) * 18; cone(x, 300 + (i % 2) * 140, x + 220, 1060, w, col, 0.22 * a); }
}
function slits(a = 1) {                                       // светящиеся щели между ламелями (поверх жалюзи)
  for (let y = GL.y0 + 40; y < 980; y += 90) { const r = rng(y); stroke([[-100 + r() * 200, y], [600 + r() * 600, y + 2]], '#e6eeff', 2.6, { a: 0.55 * a, smooth: false }); stroke([[1100 + r() * 300, y + 30], [1900, y + 32]], '#e6eeff', 2.2, { a: 0.4 * a, smooth: false }); }
}
function shelvesAt(x, k = 1) {                                // стеллаж-баррикада, k — сколько придвинут
  push(x, 1000); rectP(-170, -560, 340, 560, '#8a8f96', { seed: 1020, lw: 2.6, shade: () => { for (let y = -520; y < 0; y += 130) rectP(-170, y, 340, 14, '#6c7278', { raw: true, line: false }); } });
  for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) rectP(-150 + i * 76, -640 + j * 130 + 30 + 120, 66, 80, ['#b98a52', '#c99a62', '#a77c46'][(i + j) % 3], { seed: 1021 + i + j * 4, lw: 1.8 });
  pop();
}

// ---------------- магазин в темноте (жалюзи опущены): фонарь, лучи, вспышки, зарубки
function darkStore(t, o = {}) {
  TT = t; store(t, { shut: 1, neonOff: true, lit: 0, door: 0, drops: false, ...o });
  if (o.tally) tallyMarks(o.tally, 260, 380, 0.9);
  if (o.slits) slits(o.slits);
  if (o.bulge) { const b = o.bulge; for (let i = 0; i < 4; i++) ellP(500 + i * 300, 620, 110, 50 * b, 'rgba(0,0,0,0.18)', { seed: 1030 + i, line: false, tex: false }); }
  shelf(t); if (o.crate) crate(o.crate, 1000);
}
function darkLight(t, o = {}) {
  const amb = o.amb || '#5a5e74';
  lightmap(amb, () => {
    if (o.lantern) lanternGlow(o.lantern[0], o.lantern[1], (o.lk ?? 1) * (0.93 + 0.07 * Math.sin(step(t, 12) * 5)));
    if (o.shafts) shafts(t, o.shafts);
    if (o.alarm) { const on = Math.floor(t * 2.6) % 2 === 0; if (on) radial(960, 500, 1500, 'rgba(255,160,40,1)', 0.45 * o.alarm); }
    if (o.red) radial(o.red[0], o.red[1], 500, 'rgba(255,40,30,1)', 0.7);
    if (o.cold) radial(960, 400, 1300, 'rgba(120,170,255,1)', 0.4 * o.cold);
    if (o.fn) o.fn();
  });
  if (o.lantern) glowAdd(o.lantern[0], o.lantern[1], 140, 'rgba(255,220,140,1)', 0.5);
}

// ---------------- подсобка: шлакоблок, стеллажи, бойлер, задняя дверь, мониторы, щиток
const BR = { door: [1080, 1380], heater: 720 };
function backroom(t, o = {}) {
  TT = t;
  rectP(-200, -200, 2320, 1300, '#cfc6ad', { seed: 1100, line: false, step: 80, shade: () => {
    for (let y = -200; y < 1000; y += 64) { stroke([[-200, y], [2120, y]], '#b6ad94', 3, { smooth: false }); for (let x = -200 + ((y / 64) % 2) * 80; x < 2120; x += 160) stroke([[x, y], [x, y + 64]], '#b6ad94', 3, { smooth: false }); }
    const r = rng(1101); for (let i = 0; i < 60; i++) dot(r() * 1920, r() * 1000, 2 + r() * 4, '#a39a82', 0.5); } });
  rectP(-200, -200, 2320, 120, '#5c6168', { seed: 1102, lw: 2.4 }); for (let x = 0; x < 1920; x += 260) rectP(x, -80, 30, 100, '#4c5158', { seed: 1103 + x, lw: 1.6 });   // трубы под потолком
  stroke([[-200, 60], [2120, 60]], '#8a8f96', 14); stroke([[-200, 90], [2120, 90]], '#b06030', 10);
  // лампочка
  stroke([[900, -80], [900, 130]], '#1c1512', 4); ellP(900, 160, 26, 30, (o.bulb ?? 1) > 0.3 ? '#fff1a8' : '#9aa6a8', { seed: 1104, lw: 2, tex: false });
  // стеллаж с коробками слева
  rectP(60, 300, 460, 700, '#8a8f96', { seed: 1105, lw: 2.6, shade: () => { for (let y = 300; y < 1000; y += 170) rectP(60, y, 460, 16, '#6c7278', { raw: true, line: false }); } });
  for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) { const c = ['#b98a52', '#c99a62', '#a77c46', '#3d6fa4'][(i * 3 + j) % 4]; rectP(80 + i * 108, 316 + j * 170 + 40, 96, 110, c, { seed: 1110 + i + j * 4, lw: 1.8, shade: () => { if (c !== '#3d6fa4') stroke([[80 + i * 108, 316 + j * 170 + 80], [176 + i * 108, 316 + j * 170 + 80]], '#8a6034', 3); } }); }
  // бойлер
  const hx = BR.heater; push(hx, 0);
  rectP(-100, 400, 200, 560, '#e8e6e0', { seed: 1120, lw: 2.8, shade: () => { rectP(40, 400, 60, 560, '#cfccc4', { raw: true, line: false }); } });
  ellP(0, 400, 100, 34, '#f2f0ea', { seed: 1121, lw: 2.6 }); stroke([[-40, 380], [-40, 120]], '#b06030', 12); stroke([[40, 380], [40, 90]], '#8a8f96', 12);
  push(-10, 560, 1, -0.04); card(0, 0, 130, 80, 0, 1122, '#f2c230'); txt('40 GAL', 0, 2, 30, { font: 'Inter Black', col: '#1c1512' }); pop();
  rectP(-20, 900, 40, 30, '#8a8f96', { seed: 1123, lw: 2 }); ellP(0, 905, 22, 22, '#d8342c', { seed: 1124, lw: 2 });                            // кран слива
  if (o.drain) { const k = o.drain; stroke([[0, 930], [0, 930 + 60 * k]], '#bfe3ff', 10, { a: 0.85 }); rectP(-60, 950, 120, 50, '#3d7fc4', { seed: 1125, lw: 2.2, shade: () => { rectP(-60, 1000 - 46 * k, 120, 46 * k, '#9fd0f0', { raw: true, line: false }); } }); }
  pop();
  // задняя дверь, табличка EXIT, засов
  const [d0, d1] = BR.door, od = o.door ?? 0;
  rectP(d0 - 20, 330, d1 - d0 + 40, 670, '#4c5158', { seed: 1130, lw: 2.6 });
  if (od > 0) { rectP(d0, 350, d1 - d0, 650, '#141a2a', { seed: 1131, line: false }); rainOut(t, 350, 1000, 0.8); if (o.zDoor) o.zDoor(); }
  const w = (d1 - d0) * (1 - 0.7 * sm(od)); rectP(d1 - w, 350, w, 650, '#7a8088', { seed: 1132, lw: 2.6, shade: () => { rectP(d1 - w + w * 0.1, 640, w * 0.8, 30, '#c9ccd1', { raw: true, lw: 2 }); } });
  if (od < 0.3) { push((d0 + d1) / 2, 470, 1, 0.02); card(0, 0, 250, 70, 0, 1133, '#fbfaf6'); txt('EMPLOYEES ONLY', 0, 3, 28, { font: 'Inter Black', col: '#c8241c' }); pop(); }
  rectP((d0 + d1) / 2 - 70, 260, 140, 54, '#2a1a1a', { seed: 1134, lw: 2 }); txt('EXIT', (d0 + d1) / 2, 288, 40, { font: 'Osw', weight: 600, col: '#ff4a3a' });
  if (o.blocked != null) shelvesAt(lerp(1780, (d0 + d1) / 2, o.blocked));
  // стол с мониторами камер, щиток
  if (!o.noDesk) { rectP(1500, 760, 420, 240, '#6a5038', { seed: 1140, lw: 2.6 }); rectP(1480, 740, 460, 30, '#8a6a4a', { seed: 1141, lw: 2.2 });
    [[1540, 560], [1720, 560], [1540, 660], [1720, 660]].forEach(([x, y], i) => { rectP(x, y, 170, 96, '#1c1f24', { seed: 1142 + i, lw: 2.2, shade: () => { rectP(x + 8, y + 8, 154, 80, '#2c4a3a', { raw: true, line: false });
      const r = rng(hsh(i, Math.floor(step(t, 12) * 12))); for (let q = 0; q < 14; q++) stroke([[x + 10, y + 12 + r() * 76], [x + 160, y + 12 + r() * 76]], '#5a8a6a', 1.5, { a: 0.6, smooth: false });
      if (o.cctvZ) for (let q = 0; q < 3; q++) ellP(x + 40 + q * 40, y + 50, 8, 10, '#0c1410', { line: false, tex: false }); } }); }); }
  rectP(380, 120, 120, 160, '#8e949a', { seed: 1150, lw: 2.4, shade: () => { for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) rectP(395 + j * 52, 140 + i * 44, 40, 30, '#3a3d42', { raw: true, lw: 1.4 }); } });
  rectP(-200, 1000, 2320, 300, '#7a7468', { seed: 1160, line: false, step: 60, shade: () => { ellP(1300, 1040, 300, 20, '#6a6458', { line: false, tex: false }); } });
}
function backLight(t, o = {}) {
  lightmap(o.amb || '#5e6278', () => { if ((o.bulb ?? 1) > 0.3) radial(900, 180, 1100, 'rgba(255,235,190,1)', 0.75 * (o.bulb ?? 1));
    radial(1720, 650, 450, 'rgba(120,255,170,1)', 0.35); if (o.lantern) lanternGlow(o.lantern[0], o.lantern[1], 1); if ((o.door ?? 0) > 0) radial(1230, 700, 500, 'rgba(120,150,220,1)', 0.4 * o.door); if (o.fn) o.fn(); });
  if ((o.bulb ?? 1) > 0.3) glowAdd(900, 160, 120, 'rgba(255,230,160,1)', 0.45);
  glowAdd(1300, 288, 120, 'rgba(255,60,40,1)', 0.35);
}

// ---------------- морозильная камера (вид изнутри): стальные стены, стеллажи с напитками, задние стороны стеклянных дверей, тяжёлая дверь
function cooler(t, o = {}) {
  TT = t;
  rectP(-200, -200, 2320, 1300, '#a9b2ba', { seed: 1200, line: false, step: 80, shade: () => { for (let x = -200; x < 2120; x += 180) { stroke([[x, -200], [x, 1000]], '#8e979f', 4, { smooth: false }); stroke([[x + 8, -200], [x + 8, 1000]], '#c8d0d6', 2, { smooth: false }); } } });
  // стеклянные двери витрины сзади стеллажей (за ними — тёмный магазин)
  for (let i = 0; i < 3; i++) { const x = 560 + i * 280; rectP(x, 140, 250, 760, '#1a2030', { seed: 1201 + i, lw: 3, shade: () => { piece([[x + 20, 160], [x + 60, 160], [x + 10, 880], [x - 30, 880]], 'rgba(255,255,255,0.06)', { raw: true, line: false, tex: false }); } }); }
  // стеллажи с ящиками напитков: бутылки видны «со спины»
  [[540, 0], [1380, 1]].forEach(([x0, side]) => { for (let j = 0; j < 4; j++) { rectP(x0 - 40, 260 + j * 190, side ? 560 : 900, 14, '#c9ccd1', { seed: 1210 + j + side * 9, lw: 1.6 });
    if (!side) for (let i = 0; i < 26; i++) { const c = ['#d8342c', '#46b86a', '#3d7fc4', '#f2c230', '#f2731c'][(i + j) % 5]; rectP(x0 - 20 + i * 32, 190 + j * 190, 24, 70, c, { seed: 1220 + i + j * 30, lw: 1.2, tex: false }); } } });
  // тяжёлая дверь камеры слева
  const sc = o.scratch ? Math.sin(step(t, 24) * 31) * 3 : 0;
  push(sc, 0); rectP(40, 160, 400, 840, '#c4cbd1', { seed: 1240, lw: 3, shade: () => { rectP(40, 160, 400, 30, '#8e979f', { raw: true, line: false }); stroke([[60, 180], [60, 980]], '#8e979f', 6); } });
  rectP(340, 520, 70, 160, '#5c6168', { seed: 1241, lw: 2.4 }); rectP(355, 560, 40, 90, '#2a2c30', { seed: 1242, lw: 1.6 });
  if (o.scratch) { const r = rng(Math.floor(step(t, 12) * 3)); for (let i = 0; i < 3; i++) stroke([[120 + r() * 160, 400 + r() * 300], [140 + r() * 160, 470 + r() * 300]], '#5c6168', 3, { a: 0.7 }); }
  pop();
  rectP(-200, 1000, 2320, 300, '#8e979f', { seed: 1250, line: false, step: 50, shade: () => { for (let x = -200; x < 2120; x += 60) for (let y = 1000; y < 1300; y += 60) dot(x + 30, y + 30, 5, '#7a838b', 0.8); } });
}
function coolLight(t, o = {}) {
  lightmap(o.amb || '#5e6a86', () => { if (o.lantern) lanternGlow(o.lantern[0], o.lantern[1], 0.9); radial(960, 120, 1300, 'rgba(160,200,255,1)', o.power ? 0.6 : 0.25); if (o.fn) o.fn(); });
}

// ---------------- ночное окно с выдвижным лотком (крупно, изнутри)
function nightWin(t, o = {}) {
  TT = t;
  rectP(-200, -200, 2320, 1300, '#121a30', { seed: 1300, line: false });
  outside(t, { car: false, rainA: 1.2, zoms: o.zoms || [] });
  if (o.dee) layer(() => dee({ x: 980, y: 470, s: 1.15, t, ...o.dee }), { sx: 6, sy: 8, sb: 10 });
  // толстое стекло с переговорной решёткой
  piece([[300, 120], [1620, 120], [1620, 760], [300, 760]], 'rgba(160,190,220,0.14)', { raw: true, line: false, tex: false });
  for (let x = 380; x < 1600; x += 320) piece([[x, 120], [x + 70, 120], [x - 100, 760], [x - 170, 760]], 'rgba(255,255,255,0.07)', { raw: true, line: false, tex: false });
  ellP(1420, 360, 60, 60, '#5c6168', { seed: 1301, lw: 2.4, shade: () => { for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) if (i * i + j * j < 8) dot(1420 + i * 14, 360 + j * 14, 4, '#1c1512', 0.9); } });
  rectP(220, 80, 1480, 50, '#4c5158', { seed: 1302, lw: 2.4 }); rectP(220, 740, 1480, 60, '#4c5158', { seed: 1303, lw: 2.4 }); rectP(220, 80, 90, 720, '#4c5158', { seed: 1304, lw: 2.4 }); rectP(1610, 80, 90, 720, '#4c5158', { seed: 1305, lw: 2.4 });
  // стойка и лоток
  rectP(-200, 780, 2320, 400, '#7a5a3a', { seed: 1310, lw: 2.6, shade: () => { for (let x = -200; x < 2120; x += 100) stroke([[x, 800], [x, 1180]], '#6a4c30', 3); } });
  rectP(-200, 770, 2320, 40, '#d9d4c4', { seed: 1311, lw: 2.2 });
  const k = o.drawer ?? 0; push(960, 800 + k * 120);
  rectP(-260, -40, 520, 120, '#8e949a', { seed: 1312, lw: 2.8, shade: () => { rectP(-240, -30, 480, 70, '#5c6168', { raw: true, line: false }); } });
  if (o.bottles) for (let i = 0; i < 2; i++) { push(-60 + i * 120, -10, 1, 1.57); piece([[-60, 26], [60, 26], [70, 10], [70, -10], [60, -26], [-60, -26]], 'rgba(170,215,240,0.95)', { seed: 1313 + i, lw: 2, tex: false }); rectP(70, -10, 20, 20, '#3d7fc4', { seed: 1315 + i, lw: 1.4 }); pop(); }
  rectP(-60, 70, 120, 20, '#c9ccd1', { seed: 1317, lw: 2 }); pop();
  if (o.hand) { push(o.hand[0], o.hand[1], 1.6, -0.3); piece(tube([[0, 400], [0, 200], [0, 0]], 60, 54).pts, JOE.pal.top, { raw: true, lw: 2.4 }); blobP([[-34, -10], [34, -10], [38, 30], [0, 44], [-38, 30]], JOE.pal.skin, { seed: 1318, lw: 2.4 }); pop(); }
}
function winLight(t, o = {}) {
  lightmap('#5a5e74', () => { radial(960, 120, 1100, 'rgba(255,240,210,1)', 0.75); radial(960, 900, 700, 'rgba(255,200,120,1)', 0.35); if (o.fn) o.fn(); });
}

// ---------------- пикап мародёров
function pickup(x, y, s, t, o = {}) {
  push(x, y, s); piece([[-300, 0], [-280, -90], [-170, -100], [-120, -190], [60, -190], [110, -100], [300, -90], [310, 30], [-300, 30]], '#6a2a24', { seed: 1400 });
  piece([[-110, -176], [50, -176], [92, -104], [-150, -104]], '#2a3444', { seed: 1401, lw: 2 }); ellP(-190, 30, 56, 56, '#1c1512', { seed: 1402 }); ellP(200, 30, 56, 56, '#1c1512', { seed: 1403 });
  ellP(-190, 30, 24, 24, '#8e949a', { seed: 1404 }); ellP(200, 30, 24, 24, '#8e949a', { seed: 1405 });
  ellP(296, -50, 18, 14, '#fff6cf', { seed: 1406, lw: 1.6, tex: false });
  for (let i = 0; i < 3; i++) rectP(140 + i * 50, -150, 40, 56, '#d8342c', { seed: 1407 + i, lw: 1.6 });   // канистры в кузове
  pop();
}

// ---------------- вставки на пробке
function inventory(t, c, marks) {                             // планшет-инвентарь: пункты по меткам слов
  cork(); push(800, 540, 1, -0.02); rectP(-360, -440, 720, 880, '#7a5a3a', { seed: 1500, lw: 2.6 }); card(0, 20, 640, 800, 0, 1501, '#fbfaf6');
  rectP(-80, -470, 160, 60, '#8e949a', { seed: 1502, lw: 2.4 }); txt('INVENTORY — DAY 1', 0, -320, 44, { font: 'Inter Black', col: '#1c1512' }); stroke([[-280, -284], [280, -284]], '#3a3530', 3);
  const items = [['6', 'cases of water', '💧'], ['400', 'bags of chips', '🥔'], ['2', 'hot dog rollers', '🌭'], ['1', 'first aid kit', '🩹'], ['1', 'coffee machine', '☕']];
  items.forEach(([n, s, e], i) => { const k = popK(t, marks[i], 0.3); if (k <= 0) return; push(-250, -200 + i * 116, 1, 0); push(0, 0, k);
    txt(n, 40, 0, 76, { font: 'Osw', weight: 600, col: '#c8241c', align: 'right' }); txt(s, 66, 0, 62, { font: 'Hand', weight: 700, col: '#1c1512', align: 'left' }); txt(e, 500, 0, 60, { font: 'Noto Color Emoji' }); pop();
    if (t > marks[i] + 0.25) check(-60, 0, 0.55, clamp((t - marks[i] - 0.25) / 0.25)); pop(); });
  pop(); pin(800, 110);
}
function waterFact(t, c) {
  cork(); push(760, 520, 1, -0.03); card(0, 0, 940, 600, 0, 1510, '#f3ecd8'); txt('HOW MUCH WATER?', 0, -230, 64, { font: 'Inter Black', col: '#1c1512' }); stroke([[-400, -186], [400, -186]], '#3a3530', 3);
  const k = popK(t, c + 0.3, 0.35); if (k > 0) { push(-200, 30, k); piece([[-90, 150], [90, 150], [96, -40], [60, -110], [-60, -110], [-96, -40]], 'rgba(170,215,240,0.95)', { seed: 1511, lw: 2.8, tex: false }); rectP(-30, -150, 60, 44, '#3d7fc4', { seed: 1512, lw: 2 }); txt('1 GAL', 0, 30, 46, { font: 'Inter Black', col: '#1c1512' }); pop(); }
  if (t > c + 0.7) { personIcon(160, 40, 1.2, '#2f6a6e', 1513); txt('= 1 person, 1 day', 200, 200, 44, { font: 'Hand', weight: 700, col: '#1c1512' }); }
  txt('drinking + cooking + hygiene', 0, 250, 34, { font: 'Inter', weight: 800, col: '#3a3530' }); pop(); pin(760, 230);
  txt('source: FEMA / ready.gov', 760, 900, 30, { font: 'Inter', weight: 800, col: '#1c1512' });
}
function nineteen(t, c) {
  bg('#1c1a18'); push(W / 2, 330, 1, -0.03); ransom('6 CASES', 0, 0, 120, 1520, { reveal: pr(t, c, c + 0.3), pop: true }); pop();
  if (t > c + 0.9) { push(W / 2, 560, 1, 0.02); ransom('≈ 19 GALLONS', 0, 0, 100, 1521, { reveal: pr(t, c + 0.9, c + 1.3), pop: true }); pop(); }
  if (t > c + 2.0) { push(W / 2, 800, 1.0 + 0.1 * Math.sin(step(t, 6) * 2), -0.02); ransom('19 DAYS', 0, 0, 160, 1522, { reveal: pr(t, c + 2.0, c + 2.3), pop: true, bgs: [['#e0201a', '#fff'], ['#ffd21f', '#111'], ['#111', '#fff']] }); pop(); }
}
function fridgeFact(t, c) {
  cork(); [[-1, '4 HOURS', 'fridge (door closed)', c + 0.3], [1, '48 HOURS', 'full freezer', c + 1.6]].forEach(([sd, big, s, t0], i) => { const k = popK(t, t0, 0.35); if (k <= 0) return;
    push(960 + sd * 420, 500, k, sd * 0.03); card(0, 0, 640, 620, 0, 1530 + i, '#f3ecd8');
    rectP(-110, -260, 220, 300, i ? '#cfe4f4' : '#e8e6e0', { seed: 1532 + i, lw: 2.6, shade: () => { stroke([[-110, -150], [110, -150]], '#8e949a', 4); rectP(70, -230, 16, 60, '#8e949a', { raw: true, lw: 1.4 }); } });
    if (i) for (let q = 0; q < 6; q++) stroke([[-80 + q * 30, -230], [-70 + q * 30, -170]], '#ffffff', 4);
    txt(big, 0, 130, 86, { font: 'Inter Black', col: '#c8241c' }); txt(s, 0, 220, 40, { font: 'Hand', weight: 700, col: '#1c1512' }); pop(); pin(960 + sd * 420, 205); });
  txt('source: USDA / FoodSafety.gov', 960, 940, 30, { font: 'Inter', weight: 800, col: '#1c1512' });
}
function eatOrder(t, marks) {
  cork(); push(960, 520, 1, 0.02); card(0, 0, 1100, 640, 0, 1540, '#fbfaf6'); txt('EAT IN THIS ORDER', 0, -250, 60, { font: 'Inter Black', col: '#1c1512' });
  [['1', 'hot dogs + milk', '🌭🥛'], ['2', 'sandwiches', '🥪'], ['3', 'chips + canned food', '🥫']].forEach(([n, s, e], i) => { const k = popK(t, marks[i], 0.3); if (k <= 0) return;
    push(-420, -110 + i * 140, k); ellP(0, 0, 44, 44, '#c8241c', { seed: 1541 + i, lw: 2 }); txt(n, 0, 2, 52, { font: 'Inter Black', col: '#fbfaf6' }); txt(s, 80, 0, 74, { font: 'Hand', weight: 700, col: '#1c1512', align: 'left' }); txt(e, 800, 0, 70, { font: 'Noto Color Emoji' }); pop(); });
  pop(); pin(960, 215);
}
function heaterFact(t, c) {
  cork(); push(700, 520, 1, -0.03); card(0, 0, 560, 720, 0, 1550, '#f3ecd8');
  rectP(-90, -240, 180, 420, '#e8e6e0', { seed: 1551, lw: 2.6 }); ellP(0, -240, 90, 30, '#f2f0ea', { seed: 1552, lw: 2.4 }); ellP(0, 190, 18, 18, '#d8342c', { seed: 1553, lw: 2 });
  txt('WATER HEATER', 0, 260, 46, { font: 'Inter Black', col: '#1c1512' }); pop(); pin(700, 175);
  if (t > c + 0.6) { push(1350, 420, 1, 0.05); ransom('40 GAL', 0, 0, 140, 1554, { reveal: pr(t, c + 0.6, c + 0.9), pop: true }); pop(); }
  if (t > c + 1.4) { push(1350, 640, 1, -0.02); label(0, 0, 'hidden water source', 620, '#f4e6a8', 0, 44); pop(); }
  txt('source: FEMA / ready.gov — "Water" (emergency sources)', 960, 940, 28, { font: 'Inter', weight: 800, col: '#1c1512' });
}
function notebook(t, marks) {
  bg('#2a2420'); push(960, 540, 1, -0.02); rectP(-520, -440, 1040, 880, '#f6f1e2', { seed: 1560, lw: 2.6, shade: () => { for (let y = -360; y < 440; y += 62) stroke([[-520, y], [520, y]], '#9fc0dc', 2, { smooth: false }); stroke([[-400, -440], [-400, 440]], '#e08a8a', 3, { smooth: false }); } });
  for (let i = 0; i < 10; i++) ellP(-520, -400 + i * 88, 14, 14, '#2a2420', { seed: 1561 + i, line: false });
  txt('THEM — notes', -360, -390, 60, { font: 'Hand', weight: 700, col: '#1c1512', align: 'left' });
  [['can\'t see well in the dark', -280], ['follow SOUND — miles', -156], ['6 PM: ~20 pass on hwy', -32], ['LOUDEST SOUND WINS', 154]].forEach(([s, y], i) => { const k = clamp((t - marks[i]) / 0.6); if (k <= 0) return;
    ctx.save(); ctx.beginPath(); ctx.rect(-380, y - 50, 860 * k, 100); ctx.clip(); txt(s, -360, y, i === 3 ? 66 : 56, { font: 'Hand', weight: 700, col: i === 3 ? '#c8241c' : '#1c1512', align: 'left' }); ctx.restore();
    if (i === 3 && k >= 1) stroke([[-370, y + 42], [420, y + 46]], '#c8241c', 6); });
  pop();
}
function mapIns(t, c) {
  cork(); push(960, 520, 1, -0.015); rectP(-640, -400, 1280, 800, '#e6e2c8', { seed: 1570, lw: 2.6, shade: () => {
    for (let i = 0; i < 6; i++) ellP(-500 + i * 220, -200 + (i % 2) * 300, 160, 90, '#cfdcae', { seed: 1571 + i, line: false });
    stroke([[-660, 300], [-300, 200], [0, 120], [300, -40], [660, -200]], '#8e8a7a', 30); stroke([[-660, 300], [-300, 200], [0, 120], [300, -40], [660, -200]], '#f2c230', 4);
    stroke([[-660, -300], [-200, -250], [200, -330], [660, -280]], '#9fc8e8', 18); } });
  push(-420, 240); ellP(0, 0, 30, 30, '#f2731c', { seed: 1580, lw: 2.4 }); txt('⛽', 0, -2, 34, { font: 'Noto Color Emoji' }); pop(); label(-420, 330, 'YOU', 200, '#f2731c', -0.03, 40);
  push(420, -120); ellP(0, 0, 70, 50, 'rgba(0,0,0,0)', { raw: true, lw: 8, lc: '#c8241c', tex: false }); rectP(-60, -36, 120, 72, '#8e949a', { seed: 1581, lw: 2 }); pop(); label(420, -230, 'STADIUM', 340, '#fbfaf6', 0.03, 40);
  const k = clamp((t - c - 0.5) / 2.2), path = [[-420, 240], [-200, 180], [0, 120], [200, 20], [420, -120]], N = 40;
  for (let i = 0; i < N * k; i += 2) { const a = i / N, j = Math.min(3, Math.floor(a * 4)), q = a * 4 - j, p0 = path[j], p1 = path[j + 1]; dot(lerp(p0[0], p1[0], q), lerp(p0[1], p1[1], q), 7, '#c8241c'); }
  pop(); pin(960, 130);
  if (t > c + 2.8) { push(1500, 860, 1, -0.04); ransom('6 MILES', 0, 0, 110, 1582, { reveal: pr(t, c + 2.8, c + 3.1), pop: true }); pop(); }
  if (t > c + 1.5) { push(420, 860, 1, 0.03); ransom('18 DAYS', 0, 0, 100, 1583, { reveal: pr(t, c + 1.5, c + 1.8), pop: true }); pop(); }
}
function recap(t, marks, title = 'WHAT KEPT YOU ALIVE', hand = false) {
  cork(); push(960, 520, 1, 0.015); card(0, 0, 1180, 820, 0, 1590, hand ? '#fbf7e8' : '#f3ecd8'); txt(title, 0, -330, 58, { font: hand ? 'Hand' : 'Inter Black', weight: 700, col: '#1c1512' });
  const items = hand ? ['Count first.', 'Stay dark.', 'Stay quiet.', "Don't open the door."] : ['Count before you act', 'Kill the light', 'Stay silent', 'Find the hidden water', 'Never open the door'];
  items.forEach((s, i) => { const k = popK(t, marks[i], 0.3); if (k <= 0) return; push(-460, -200 + i * (hand ? 130 : 110), k); if (!hand) check(0, 0, 0.6, clamp((t - marks[i] - 0.2) / 0.25));
    txt(s, 70, 0, hand ? 72 : 54, { font: hand ? 'Hand' : 'Inter', weight: 800, col: '#1c1512', align: 'left' }); pop(); });
  pop(); pin(960, 125);
}

// ---------------- заставки: титул, главы, концовка
function paperBg(seed = 1600) { bg('#26221e', seed); const r = rng(seed); for (let i = 0; i < 40; i++) dot(r() * W, r() * H, 1 + r() * 2, '#f3ecd8', 0.15); }
function chapterCard(t, c, n, title, problem) {
  paperBg(1600 + n); const k = popK(t, c, 0.4);
  push(W / 2, 470, 1, -0.02); piece([[-760, -160], [760, -190], [770, 170], [-750, 190]], '#f3ecd8', { seed: 1610 + n, step: 14, edge: 2.2, lw: 2 }); pop();
  tape(W / 2 - 700, 300, 160, -0.5, 1620 + n); tape(W / 2 + 700, 290, 160, 0.4, 1621 + n);
  push(W / 2 - 200, 470, 0.7 + 0.3 * k, -0.04); ransom('DAY ' + n, 0, 0, 200, 1630 + n, { reveal: pr(t, c, c + 0.35), pop: true }); pop();
  push(W / 2 + 420, 470, 1, 0.03); tallyMarks(Math.min(n, 30), -150, -40, 0.9 * clamp((t - c - 0.3) / 0.5 + 0.01)); pop();
  if (t > c + 0.6) { push(W / 2, 770, 1, 0.02); label(0, 0, title, title.length * 46 * 0.62 + 140, '#f2c230', 0, 54); pop(); }
  if (problem && t > c + 1.0) txt(problem, W / 2, 900, 38, { font: 'Inter', weight: 800, col: '#e8dcc0' });
}
function titleCard(t, c) {
  paperBg(1700); push(W / 2, 360, 1, -0.03); ransom('ZOMBIE OUTBREAK', 0, 0, 150, 1701, { reveal: pr(t, c, c + 0.5), pop: true }); pop();
  if (t > c + 0.7) { push(W / 2, 600, 1, 0.015); label(0, 0, '30 DAYS LOCKED INSIDE A GAS STATION', 1500, '#f3ecd8', 0, 66); pop(); }
  if (t > c + 1.4) txt('PAPER SURVIVORS', W / 2, 820, 40, { font: 'Inter Black', col: '#f2731c' });
  if (t > c + 0.7) layer(() => joe({ x: 1640, y: 760, s: 0.55, t, mood: 'dread', lk: [-0.6, 0], arms: { l: [-150, 300, 'open'], r: [150, 300, 'open'] } }), { sx: 6, sy: 8, sb: 10 });
}
function endCard(t, c) {
  paperBg(1800); push(W / 2, 300, 1, -0.03); ransom('DAY 31', 0, 0, 170, 1801, { reveal: pr(t, c, c + 0.4), pop: true }); pop();
  if (t > c + 0.8) { push(W / 2, 560, 1 + 0.04 * Math.sin(step(t, 6) * 2)); rectP(-300, -70, 600, 140, '#e0201a', { seed: 1802, lw: 3 }); txt('SUBSCRIBE', 0, 4, 72, { font: 'Inter Black', col: '#fbfaf6' }); pop(); }
  if (t > c + 1.4) txt('Would you have opened the window?', W / 2, 760, 52, { font: 'Hand', weight: 700, col: '#f3ecd8' });
  layer(() => joe({ x: 300, y: 640, s: 0.6, t, mood: 'dread', lk: [0.6, 0], arms: { l: [-150, 300, 'open'], r: [180, 160, 'fist'] } }), { sx: 6, sy: 8, sb: 10 });
}

// ---------------- переходы между планами: SHOTS [t, 'имя', 'tear'|'flash'|'whip'|'dip']
const TRD = { tear: 0.45, flash: 0.3, whip: 0.3, dip: 0.7 };
function tornEdgeX(y, p) { return p * (W + 300) - 150 + Math.sin(y * 0.03) * 22 + Math.sin(y * 0.13 + 2) * 10 + ((hsh(Math.floor(y / 16)) % 15) - 7); }
function frame(t) {
  const i = shotAt(t), [t0, name, tr] = SHOTS[i], d = TRD[tr] || 0, u = t - t0;
  if (!tr || i === 0 || u >= d) { SH[name](t, u); return; }
  const [pt0, pname] = SHOTS[i - 1], p = u / d;
  if (tr === 'flash') { SH[name](t, u); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(255,250,240,${1 - p})`; ctx.fillRect(0, 0, W, H); ctx.restore(); return; }
  if (tr === 'dip') { if (p < 0.5) SH[pname](t, t - pt0); else SH[name](t, u); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(0,0,0,${1 - Math.abs(p - 0.5) * 2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); return; }
  if (tr === 'whip') { const e = eio(p); push(-e * W * 1.1, 0); SH[pname](t, t - pt0); pop(); push((1 - e) * W * 1.1, 0); SH[name](t, u); pop();
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 0.5 * Math.sin(p * Math.PI); ctx.drawImage(ctx.canvas, -40, 0); ctx.drawImage(ctx.canvas, 40, 0); ctx.restore(); return; }
  // tear: новый план «отрывается» поверх старого рваной кромкой слева направо
  SH[pname](t, t - pt0); const e = eio(p);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.moveTo(-10, -10); for (let y = -10; y <= H + 10; y += 16) ctx.lineTo(tornEdgeX(y, e), y); ctx.lineTo(-10, H + 10); ctx.closePath(); ctx.clip();
  S = 1; SH[name](t, u); ctx.restore();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); S = 1; const pts = []; for (let y = -10; y <= H + 10; y += 16) pts.push([tornEdgeX(y, e), y]); for (let y = H + 10; y >= -10; y -= 16) pts.push([tornEdgeX(y, e) + 18 + ((hsh(y) % 7)), y]);
  piece(pts, '#f3ecd8', { raw: true, lw: 2 }); ctx.restore();
}

// ---------------- карта округа: точки (люди/зомби) сходятся к заправке; кольца звука
function convergeMap(t, c, o = {}) {
  bg('#1d2238', 2200); push(W / 2, H / 2 + 30, 1, -0.01); rectP(-760, -440, 1520, 880, '#2a3448', { seed: 2201, lw: 2.6, shade: () => {
    const r = rng(2202); for (let i = 0; i < 18; i++) rectP(-700 + r() * 1300, -400 + r() * 760, 60 + r() * 90, 40 + r() * 70, '#33405a', { raw: true, line: false });
    stroke([[-760, 300], [-300, 200], [0, 40], [400, -120], [760, -260]], '#4a5470', 26); stroke([[-760, -340], [-100, -220], [760, 60]], '#4a5470', 18); } });
  const k = clamp((t - c) / (o.dur ?? 3.5)), n = o.n ?? 30;
  if (o.rings) for (let i = 0; i < 4; i++) { const q = ((t - c) * 0.6 + i / 4) % 1; ellP(0, 40, 80 + q * 700, 50 + q * 440, 'rgba(0,0,0,0)', { raw: true, tex: false, lw: 5, lc: '#f2c230', a: 0.7 * (1 - q) }); }
  for (let i = 0; i < n; i++) { const r = rng(2210 + i), a = r() * 6.28, d = 380 + r() * 420, kk = clamp(k * (0.8 + r() * 0.5)), x = Math.cos(a) * d * (1 - kk * 0.75), y = 40 + Math.sin(a) * d * 0.6 * (1 - kk * 0.75);
    if (o.ppl) personIcon(x, y, 0.35, r() > 0.5 ? '#f3ecd8' : '#f2c230', 2230 + i); else dot(x, y, 9, '#8ad06a', 0.95); }
  ellP(0, 40, 40, 40, '#f2731c', { seed: 2203, lw: 2.6 }); txt('⛽', 0, 38, 40, { font: 'Noto Color Emoji' }); pop();
  if (o.label && t > c + 0.6) { push(W / 2, 140, 1, -0.02); ransom(o.label, 0, 0, 96, 2204, { reveal: pr(t, c + 0.6, c + 1.0), pop: true }); pop(); }
}
