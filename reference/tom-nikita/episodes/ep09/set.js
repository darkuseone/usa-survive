/* Эп. 9 «Почему мы терпим?» — декорация (ванная вечером, протечка с потолка в ведро, Том на стиральной машине) и вставки-коллажи. */

const DRIP = { x: 560, y0: 452, y1: 1428, P: 1.1, fall: 0.45 };     // капля: с потолка в ведро; удар в t = k·P + fall (sound.json «drips» — тот же ритм)
function bathroom(t, o = {}) {
  rectP(-300, -300, 1680, 750, '#d6d2c6', { seed: 9000, line: false, step: 60 });                           // потолок
  { const r = rng(9001); [[560, 400, 210, 70], [520, 420, 140, 46], [620, 430, 90, 30]].forEach(([x, y, rx, ry], i) => ellP(x + (r() - 0.5) * 20, y, rx, ry, i ? '#a98a5c' : '#bfa577', { seed: 9002 + i, line: false, a: 0.55 + i * 0.12 })); }   // пятно-протечка
  rectP(-300, 440, 1680, 470, '#b8c9ae', { seed: 9010, line: false, step: 60 }); stroke([[-300, 442], [1380, 442]], '#a8a493', 10);   // стена: бледно-зелёная краска, карниз
  stroke([[548, 446], [544, 520], [550, 600]], '#9a8f6a', 7, { a: 0.5 }); stroke([[590, 446], [596, 500]], '#9a8f6a', 5, { a: 0.45 });   // подтёки под пятном
  rectP(-300, 900, 1680, 660, '#d9a493', { seed: 9011, lw: 2, shade: () => { for (let y = 900; y < 1560; y += 62) stroke([[-300, y], [1380, y]], '#c28a78', 3, { smooth: false });
    for (let x = -300; x < 1380; x += 62) stroke([[x, 900], [x, 1560]], '#c28a78', 3, { smooth: false }); } });                   // кафель цвета «советский лосось»
  // счёт дней маркером на стене: полгода
  { const r = rng(9020); for (let row = 0; row < 5; row++) for (let g = 0; g < 4; g++) { const x0 = 300 + g * 56, y0 = 590 + row * 56;
      for (let i = 0; i < 4; i++) stroke([[x0 + i * 10, y0 + (r() - 0.5) * 4], [x0 + i * 10 + (r() - 0.5) * 4, y0 + 38]], '#3a3530', 3.4);
      stroke([[x0 - 6, y0 + 30], [x0 + 38, y0 + 8]], '#3a3530', 3.4); } }
  // ванна и шторка слева
  stroke([[-300, 470], [250, 470]], '#c9ccd2', 10);
  piece([[-300, 476], [236, 476], [250, 700], [226, 940], [244, 1190], [-300, 1190]], '#5f9fc9', { seed: 9030, step: 30, lw: 2.4, shade: () => {
    for (let x = -260; x < 250; x += 90) rectP(x, 476, 40, 720, '#f2efe6', { seed: 9031 + x, line: false, step: 40 }); } });
  for (let x = -280; x < 250; x += 52) ellP(x, 470, 9, 9, '#c9ccd2', { seed: 9040 + x, lw: 1.4, tex: false });
  piece([[-300, 1170], [250, 1170], [260, 1190], [232, 1560], [-300, 1560]], '#efebe2', { seed: 9050, step: 24, lw: 2.6, shade: () => { stroke([[-300, 1196], [252, 1196]], '#d3cdbf', 6); } });
  // полка с бутылками и зеркало
  rectP(616, 560, 150, 190, '#cfe2ea', { seed: 9060, lw: 3, shade: () => { stroke([[640, 590], [700, 650]], '#ffffff', 6, { a: 0.7 }); } }); rectP(606, 550, 170, 14, '#e9e3d6', { seed: 9061, lw: 2 });
  rectP(600, 800, 190, 16, '#e9e3d6', { seed: 9062, lw: 2.2 }); [[630, '#e2533a', 56], [680, '#f2e85c', 40], [730, '#46b86a', 70]].forEach(([x, c, h], i) => { rectP(x - 16, 800 - h, 32, h, c, { seed: 9063 + i, lw: 1.8 }); rectP(x - 7, 788 - h, 14, 14, '#f3efe6', { seed: 9066 + i, lw: 1.4 }); });
  // крючок с жёлтым полотенцем
  ellP(1060, 640, 10, 10, '#c9ccd2', { seed: 9070, lw: 1.6 }); piece([[1010, 650], [1110, 650], [1124, 960], [1090, 940], [1060, 970], [1030, 942], [996, 966]], '#f0c24a', { seed: 9071, lw: 2.4, shade: () => { stroke([[1004, 880], [1120, 880]], '#d9a82c', 8); } });
  // стиральная машина (на ней сидит Том)
  rectP(730, 1190, 290, 370, '#f2f0ea', { seed: 9080, lw: 2.8 }); rectP(730, 1190, 290, 60, '#e2ded4', { seed: 9081, lw: 2 });
  ellP(960, 1220, 18, 18, '#9aa3ad', { seed: 9082, lw: 1.8 }); rectP(760, 1210, 90, 22, '#5a6470', { seed: 9083, lw: 1.4 });
  ellP(875, 1400, 104, 104, '#b9c2ca', { seed: 9084, lw: 2.6 }); ellP(875, 1400, 76, 76, '#5d86a6', { seed: 9085, lw: 2, shade: () => { stroke([[830, 1370], [860, 1350]], '#cfe7f5', 6, { a: 0.7 }); } });
  // пол: серо-голубая плитка, лужа вокруг ведра
  rectP(-300, 1550, 1680, 700, '#b9c3c8', { seed: 9090, step: 60, shade: () => { for (let y = 1560, j = 0; y < 2240; y += 90, j++) for (let x = -300 + (j % 2) * 90; x < 1380; x += 180) rectP(x, y, 90, 90, '#a3afb5', { seed: 9091 + j * 40 + x, line: false, step: 45 }); } });
  ellP(560, 1572, 190, 26, '#8fc1e2', { seed: 9100, line: false, a: 0.75 }); ellP(430, 1590, 70, 12, '#8fc1e2', { seed: 9101, line: false, a: 0.6 });
  // светильник-плафон
  ellP(860, 448, 70, 22, '#f6f2e2', { seed: 9110, lw: 2.2 });
  if (o.bucket !== false) bucketP(560, 1562, 1, 0.93, t);
  if (o.drip !== false) drip(t);
}
function bucketP(x, y, s, fill, t, o = {}) {                         // пластиковое ведро (низ в x,y); fill 0..1; ряби от капли, если в нём капает
  push(x, y, s, o.rot || 0); const c = o.col || '#3d7fc4';
  piece([[-84, -150], [84, -150], [64, 0], [-64, 0]], c, { seed: 9120 + (o.seed || 0), step: 20, lw: 2.6, shade: () => { stroke([[-80, -128], [80, -128]], hexA('#000000', 0.18), 6); } });
  if (fill > 0) { const wy = -150 + 8 + (1 - fill) * 120; ellP(0, wy, 78 - (1 - fill) * 16, 13, '#79b4de', { seed: 9122 + (o.seed || 0), lw: 1.6, tex: false });
    if (o.rip !== false) { const ph = ((t - DRIP.fall) % DRIP.P + DRIP.P) % DRIP.P; if (ph < 0.5) { const k = ph / 0.5; ellP(0, wy, 14 + 60 * k, 3 + 9 * k, 'rgba(0,0,0,0)', { raw: true, lw: 2.4, lc: hexA('#e9f6ff', 1 - k), tex: false }); } } }
  ellP(0, -150, 86, 12, 'rgba(0,0,0,0)', { raw: true, lw: 4, lc: '#2a5f99', tex: false });
  stroke([[-84, -146], [-70, -230], [0, -258], [70, -230], [84, -146]], '#c9ccd2', 6); pop();
}
function drip(t) {                                                   // капля: формируется, падает (стоп-моушен на двойках), брызги
  const tt = step(t, 12), ph = ((tt % DRIP.P) + DRIP.P) % DRIP.P;
  if (ph < DRIP.fall) { const k = ph / DRIP.fall; drop(DRIP.x, lerp(DRIP.y0, DRIP.y1 - 20, k * k), 0.7, 9130); }
  else { const g = (ph - DRIP.fall) / (DRIP.P - DRIP.fall); if (g > 0.5) drop(DRIP.x, DRIP.y0 + 6, 0.25 + 0.4 * (g - 0.5) * 2, 9131);   // набухает на потолке
    if (g < 0.25) { const k = g / 0.25; [-1, -0.4, 0.5, 1].forEach((d, i) => ellP(DRIP.x + d * 50 * k, DRIP.y1 - 6 - 50 * k + 60 * k * k, 6, 8, '#9fd3f0', { seed: 9132 + i, line: false, tex: false, a: 1 - k })); } }
}
function bathLight(fn) { lightmap('#b9bcb1', () => { radial(860, 520, 950, 'rgba(255,236,190,1)', 0.85); radial(330, 1100, 520, 'rgba(230,240,255,1)', 0.35); if (fn) fn(); }); }

// ------------------------------------------------------------------ вставки
function frogCut(x, y, s, rot, o = {}) {                            // лягушка-вырезка; o.leap — прыжок (лапы вытянуты)
  push(x, y, s, rot); const g = '#5fb04a', gd = '#3f8a34';
  if (o.leap) { [-1, 1].forEach(sd => stroke([[sd * 30, 30], [sd * 50, 90], [sd * 40, 150]], g, 22)); }
  else [-1, 1].forEach(sd => blobP([[sd * 20, 20], [sd * 80, 10], [sd * 90, 50], [sd * 40, 56]], g, { seed: 9200 + sd, lw: 2.2 }));
  blobP([[-70, 0], [-60, -40], [0, -56], [60, -40], [70, 0], [50, 40], [-50, 40]], g, { seed: 9203, lw: 2.6, shade: () => { ellP(0, 14, 40, 18, '#cfe8a8', { seed: 9204, line: false }); [[-30, -10], [26, -20]].forEach(([a, b], i) => dot(a, b, 6, gd)); } });
  [-1, 1].forEach(sd => { ellP(sd * 36, -56, 22, 22, g, { seed: 9205 + sd, lw: 2.2 }); ellP(sd * 36, -56, 13, 13, '#fbfaf5', { seed: 9207 + sd, lw: 1.4, tex: false }); dot(sd * 36 + (o.lk || 0) * 5, -54, 6, '#1c1512'); });
  stroke([[-26, -20], [0, -12], [26, -20]], '#1c1512', 3.4); pop();
}
function potP(x, y, s, heat, t) {                                    // кастрюля на конфорке; heat 0..1 — пламя и пар
  push(x, y, s);
  if (heat > 0) for (let i = 0; i < 7; i++) { const f = 0.7 + 0.3 * Math.sin(step(t, 12) * 9 + i * 1.7); piece([[-150 + i * 50, 150], [-130 + i * 50, 150 - 70 * heat * f], [-110 + i * 50, 150]], i % 2 ? '#f2a03a' : '#e2533a', { seed: 9220 + i, lw: 1.4 }); }
  rectP(-200, 150, 400, 26, '#3a3530', { seed: 9230, lw: 2 });
  piece([[-170, -110], [170, -110], [156, 150], [-156, 150]], '#a7afb8', { seed: 9231, step: 24, lw: 2.8, shade: () => { stroke([[-140, -60], [140, -60]], '#8a929b', 6); } });
  [-1, 1].forEach(sd => rectP(sd > 0 ? 166 : -216, -90, 50, 24, '#3a3530', { seed: 9232 + sd, lw: 1.8 }));
  ellP(0, -110, 172, 26, '#5d86a6', { seed: 9234, lw: 2.4, tex: false });
  if (heat > 0.3) for (let i = 0; i < 3; i++) { const ph = (t * 0.8 + i / 3) % 1; stroke([[-60 + i * 60, -140 - ph * 160], [-40 + i * 60, -180 - ph * 160], [-60 + i * 60, -220 - ph * 160]], '#ffffff', 10, { a: (1 - ph) * (heat - 0.3) }); }
  pop();
}
function thermo(x, y, k) {                                           // градусник 20…40°
  rectP(x - 22, y - 320, 44, 360, '#fbfaf6', { seed: 9240, lw: 2.4 }); ellP(x, y + 40, 34, 34, '#d8342c', { seed: 9241, lw: 2.4 });
  rectP(x - 8, y - 300 + 300 * (1 - k), 16, 300 * k + 30, '#d8342c', { seed: 9242, line: false, tex: false });
  txt(Math.round(20 + 20 * k) + '°', x + 80, y - 300 + 300 * (1 - k), 40, { font: 'Inter Black', col: '#fbfaf6' });
}
function mythCard(t, c) {                                           // «лягушка варится и не замечает» — штамп МИФ
  cork(); push(540, 720, 1.02, -0.03); card(0, 0, 820, 860, 0, 9300, '#f3ecd8');
  txt('ПРИТЧА ПРО ЛЯГУШКУ', 0, -350, 54, { font: 'DejaVu Serif', weight: 700, col: '#1c1512' }); stroke([[-340, -306], [340, -306]], '#3a3530', 3);
  potP(0, 60, 0.95, 0.5, t); frogCut(0, -60, 0.9, 0, { lk: 0 }); push(0, -56, 1); stroke([[-24, -16], [0, -2], [24, -16]], '#1c1512', 3.4); pop();
  txt('«греется медленно — и не замечает»', 0, 330, 34, { font: 'DejaVu Serif', weight: 400, col: '#3a3530' }); pop(); pin(540, 300);
  if (t > c.jump) { push(720, 1110, 1.6 - 0.6 * popK(t, c.jump, 0.3), -0.15); ctx.globalAlpha = 0.9; piece([[-150, -64], [150, -64], [150, 64], [-150, 64]], 'rgba(0,0,0,0)', { raw: true, lc: '#c8241c', lw: 10, tex: false });
    txt('МИФ', 0, 6, 92, { font: 'Inter Black', col: '#c8241c' }); ctx.globalAlpha = 1; pop(); }
}
function frogPot(t, c, o = {}) {                                     // опыт: воду греют — лягушка выбирается наружу
  bg('#24304a', 9400); const k = o.out ? 1 : pr(t, c.zoo, c.out); thermo(950, 800, k);
  potP(470, 960, 1.5, 0.3 + 0.7 * k, t);
  const j = o.out ? 1 : pr(t, c.out - 0.15, c.out + 0.35);
  if (j <= 0) frogCut(470, 740 - 10 * Math.sin(step(t, 12) * 10) * k, 1.25, 0, { lk: 0.6 * k });
  else { const x = lerp(470, 820, j), y = lerp(740, 1150, j) - 420 * Math.sin(Math.PI * Math.min(1, j)); frogCut(x, y, 1.25, j < 1 ? 0.5 * Math.sin(Math.PI * j) : 0, { leap: j < 1, lk: 1 }); }
  if (!o.out && t > c.out) { push(540, 300, 1, -0.04); ransom('ВЫПРЫГНЕТ!', 0, 0, 120, 9410, { reveal: pr(t, c.out, c.out + 0.25), pop: true }); pop(); }
  else txt('опыты зоологов: при нагреве лягушка лезет наружу', 540, 1290, 30, { font: 'Inter', weight: 800, col: '#cfd6e0' });
}
function scaleIns(t, c) {                                           // потеря весит примерно вдвое больше выгоды
  cork(); const a = -0.32 * sm(pr(t, c.loss, c.twice + 0.2)); push(540, 760);
  rectP(-16, -40, 32, 470, '#6b4a2e', { seed: 9500, lw: 2.4 }); rectP(-130, 420, 260, 40, '#6b4a2e', { seed: 9501, lw: 2.4 });
  push(0, -40, 1, a); rectP(-400, -14, 800, 28, '#8a6a4a', { seed: 9502, lw: 2.4 }); pop();
  [[-1, 'ПОТЕРЯ', '−$100', '#e2533a'], [1, 'ВЫГОДА', '+$100', '#46b86a']].forEach(([sd, s1, s2, col], i) => { const px = sd * 390 * Math.cos(a), py = -40 + sd * 390 * Math.sin(a);
    stroke([[px, py], [px - 110, py + 170]], '#3a3530', 3); stroke([[px, py], [px + 110, py + 170]], '#3a3530', 3);
    piece([[px - 150, py + 170], [px + 150, py + 170], [px + 110, py + 220], [px - 110, py + 220]], '#c9ccd2', { seed: 9503 + i, lw: 2.2 });
    card(px, py + 100, 230, 120, 0, 9505 + i, col); txt(s1, px, py + 76, 34, { font: 'Inter Black', col: '#fbfaf6' }); txt(s2, px, py + 122, 40, { font: 'Inter Black', col: '#fbfaf6' }); });
  pop();
  if (t > c.twice) { push(540, 330, 1, -0.04); ransom('×2 БОЛЬНЕЕ', 0, 0, 100, 9510, { reveal: pr(t, c.twice, c.twice + 0.25), pop: true }); pop(); }
  if (t > c.kahn - 0.1) { push(540, 1250, popK(t, c.kahn - 0.1, 0.3), 0.02); card(0, 0, 900, 140, 0, 9511, '#fbfaf6'); txt('Канеман и Тверски · теория перспектив', 0, -22, 32, { font: 'Inter Black', col: '#1c1512' });
    txt('Нобелевская премия по экономике, 2002', 0, 32, 30, { font: 'Inter', weight: 800, col: '#6b655c' }); pop(); }
}
function formIns(t, c) {                                            // пенсионный план: тебя уже записали, выйти — одна бумажка
  bg('#e9e3d6', 9600); push(500, 740, 1.05, -0.03); card(0, 0, 760, 900, 0, 9601, '#fbfaf6');
  txt('ПЕНСИОННЫЙ ПЛАН', 0, -370, 56, { font: 'Inter Black', col: '#1c1512' }); txt('компания в США, 1998', 0, -312, 32, { font: 'Inter', weight: 800, col: '#6b655c' });
  stroke([[-320, -270], [320, -270]], '#3a3530', 3); for (let i = 0; i < 4; i++) stroke([[-300, -180 + i * 70], [300, -180 + i * 70]], '#cfc8b8', 4);
  rectP(-300, 140, 70, 70, '#ffffff', { seed: 9602, lw: 3 }); check(-265, 172, 0.9, pr(t, c.plan - 0.2, c.plan + 0.1));
  txt('вы уже участвуете', 40, 176, 44, { font: 'Inter Black', col: '#1c1512' }); txt('(по умолчанию)', 40, 236, 32, { font: 'Inter', weight: 800, col: '#6b655c' }); pop();
  if (t > c.exit - 0.1) { push(720, 1000, popK(t, c.exit - 0.1, 0.3), 0.08); card(0, 0, 420, 240, 0, 9603, '#f4e6a8'); txt('ЗАЯВЛЕНИЕ', 0, -60, 40, { font: 'Inter Black', col: '#1c1512' });
    txt('о выходе', 0, -12, 34, { font: 'Inter', weight: 800, col: '#3a3530' }); stroke([[-140, 60], [40, 60]], '#3a3530', 3); stroke([[60, 50], [90, 30], [110, 66], [140, 40]], '#2f3a7a', 4); pop(); tape(720, 880, 140, 0.1, 9604); }
  if (t > c.paper) { push(540, 1250, 1, -0.03); ransom('ОДНА БУМАЖКА', 0, 0, 96, 9605, { reveal: pr(t, c.paper, c.paper + 0.25), pop: true }); pop(); }
}
function barsIns(t, c) {                                            // 37 % сами записывались → 86 % записали по умолчанию
  cork(); push(540, 760, 1, 0.02); card(0, 0, 900, 1000, 0, 9700, '#fbfaf6'); txt('НОВИЧКИ В ПЛАНЕ', 0, -430, 52, { font: 'Inter Black', col: '#1c1512' }); stroke([[-380, 330], [380, 330]], '#3a3530', 4);
  [[-190, 37, 'ЗАПИШИСЬ САМ', '#9a9488', c.p37], [190, 86, 'ЗАПИСАЛИ САМИ', '#e2533a', c.p86]].forEach(([x, v, s, col, t0], i) => { const h = 6 * v * sm(pr(t, i ? c.novice : t0 - 0.4, t0 + 0.2));
    if (h > 2) rectP(x - 110, 330 - h, 220, h, col, { seed: 9701 + i, lw: 2.4 }); txt(s, x, 390, 34, { font: 'Inter Black', col: '#1c1512' });
    if (t > t0) ransom(v + '%', x, 330 - h - 70, 96, 9710 + i, { reveal: pr(t, t0, t0 + 0.25), pop: true }); });
  pop(); txt('Madrian & Shea, 2001: одна компания в США', 540, 1240, 30, { font: 'Inter', weight: 800, col: '#1c1512' });
}
function dogCard(x, y, s, rot, yr, l1, l2, col, seed) {             // карточка теории с собакой-вырезкой
  push(x, y, s, rot); card(0, 0, 820, 470, 0, seed, col); txt(yr, -270, -150, 80, { font: 'Inter Black', col: '#d8342c' });
  push(-250, 70, 1); blobP([[-90, 40], [-70, -10], [40, -20], [80, 10], [70, 50], [-80, 60]], '#b98a5a', { seed: seed + 1, lw: 2.2 }); ellP(90, -20, 44, 38, '#b98a5a', { seed: seed + 2, lw: 2.2 }); ellP(70, -50, 16, 30, '#8a6038', { seed: seed + 3, lw: 1.8 }); dot(100, -26, 6, '#1c1512');
  [-60, -20, 30, 60].forEach((lx, i) => stroke([[lx, 50], [lx, 110]], '#b98a5a', 18)); pop();
  txt(l1, 120, -40, 42, { font: 'Inter Black', col: '#1c1512' }); txt(l2, 120, 30, 42, { font: 'Inter Black', col: '#1c1512' }); pop();
}
function helpIns(t, c, o = {}) {                                    // «беспомощности учатся» (1967) → 2016: пассивность — по умолчанию
  cork(); dogCard(540, o.b ? 420 : 640, o.b ? 0.8 : 1.05, -0.03, '1967', 'беспомощности', 'УЧАТСЯ', '#f3ecd8', 9800); pin(540, o.b ? 260 : 420);
  if (!o.b) { txt('теория выученной беспомощности', 540, 1060, 36, { font: 'Inter', weight: 800, col: '#1c1512' }); return; }
  stampX(540, 420, 1.6, pr(t, c.y16 - 0.1, c.y16 + 0.15));
  if (t > c.y16 + 0.3) { push(540, 900, popK(t, c.y16 + 0.3, 0.3), 0.03); card(0, 0, 860, 360, 0, 9810, '#fbfaf6'); txt('2016 · сами авторы:', 0, -120, 44, { font: 'Inter Black', col: '#d8342c' });
    txt('пассивность — реакция', 0, -30, 48, { font: 'Inter Black', col: '#1c1512' }); txt('по умолчанию', 0, 40, 48, { font: 'Inter Black', col: '#1c1512' });
    txt('учатся как раз контролю', 0, 120, 36, { font: 'Inter', weight: 800, col: '#3a3530' }); pop(); pin(540, 740); }
  if (t > c.def) { push(540, 1250, 1, -0.03); ransom('ПО УМОЛЧАНИЮ', 0, 0, 96, 9820, { reveal: pr(t, c.def, c.def + 0.25), pop: true }); pop(); }
  txt('Maier & Seligman, Psychological Review, 2016', 540, 1170, 28, { font: 'Inter', weight: 800, col: '#1c1512', a: t > c.y16 + 0.3 ? 1 : 0 });
}
function brainP(x, y, s, k) {                                        // мозг-вырезка; k — «загорелся»
  push(x, y, s); if (k > 0) glowAdd(0, 0, 260, 'rgba(255,230,140,1)', 0.7 * k);
  blobP([[-150, 20], [-140, -60], [-80, -110], [0, -120], [80, -110], [140, -60], [150, 20], [110, 80], [20, 90], [-60, 90], [-120, 70]], '#f2a6b4', { seed: 9900, lw: 2.6, shade: () => {
    stroke([[-90, -60], [-40, -30], [-60, 20], [-10, 50]], '#d8788c', 6); stroke([[40, -80], [70, -30], [30, 0], [80, 40]], '#d8788c', 6); stroke([[0, -110], [0, 80]], '#d8788c', 5); } });
  stroke([[40, 86], [60, 150]], '#f2a6b4', 30); pop();
}
function stepIns(t, c) {                                            // один шаг сегодня: звонок сантехнику → мозг: «от меня зависит»
  cork(); const on = pr(t, c.call - 0.1, c.call + 0.4);
  phoneCut(330, 760, 1.4, -0.06, { screen: () => { rectP(-96, -190, 192, 380, '#20242c', { seed: 9910, line: false, tex: false });
      txt('САНТЕХНИК', 0, -110, 26, { font: 'Inter Black', col: '#fbfaf6' }); txt(on > 0.5 ? 'вызов…' : '', 0, -70, 20, { font: 'Inter', weight: 700, col: '#9fd3f0' });
      ellP(0, 110, 34, 34, '#46b86a', { seed: 9911, line: false, tex: false }); txt('📞', 0, 112, 30, { font: 'Noto Color Emoji' }); } });
  if (on > 0) for (let i = 0; i < 3; i++) { const k = ((t * 1.5 + i / 3) % 1); ellP(480, 560, 30 + 60 * k, 30 + 60 * k, 'rgba(0,0,0,0)', { raw: true, lw: 5, lc: hexA('#46b86a', (1 - k) * on), tex: false }); }
  if (t > c.brain - 0.1) brainP(780, 860, 1.4 * popK(t, c.brain - 0.1, 0.3), pr(t, c.dep - 0.2, c.dep + 0.2));
  push(540, 300, 1, -0.03); ransom('1 ШАГ. СЕГОДНЯ', 0, 0, 100, 9920, { reveal: pr(t, c.call - 0.05, c.call + 0.25) }); pop();
  if (t > c.dep) { push(540, 1250, 1, 0.02); ransom('ОТ МЕНЯ ЗАВИСИТ', 0, 0, 84, 9921, { reveal: pr(t, c.dep, c.dep + 0.25), pop: true }); pop(); }
}
