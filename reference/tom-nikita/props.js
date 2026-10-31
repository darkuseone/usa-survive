/* Декорации и коллаж v4: коридор у туалета (ночь/свет), лоток, вставки — пробковая доска, кишечник, крыша, деревня-фото, телевизоры. */

// ------------------------------------------------------------------ свет: карта освещения (multiply) + свечения
const LM = document.createElement('canvas'); LM.width = W; LM.height = H;
/* lights: fn рисует на карте света в текущих координатах камеры; amb — цвет темноты */
function lightmap(amb, fn) {
  const g = LM.getContext('2d'), prev = ctx, pS = S; g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.fillStyle = amb; g.fillRect(0, 0, W, H);
  g.setTransform(prev.getTransform()); g.globalCompositeOperation = 'lighter'; ctx = g; fn(); ctx = prev; S = pS;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(LM, 0, 0); ctx.restore();
}
function radial(x, y, r, col, a = 1) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore(); }
function cone(x0, y0, x1, y1, w, col, a = 1) {                     // луч фонарика
  const ang = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0) * 1.25, nx = -Math.sin(ang), ny = Math.cos(ang);
  const g = ctx.createLinearGradient(x0, y0, x0 + Math.cos(ang) * L, y0 + Math.sin(ang) * L); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x0 + nx * 10, y0 + ny * 10); ctx.lineTo(x0 + Math.cos(ang) * L + nx * w, y0 + Math.sin(ang) * L + ny * w); ctx.lineTo(x0 + Math.cos(ang) * L - nx * w, y0 + Math.sin(ang) * L - ny * w); ctx.lineTo(x0 - nx * 10, y0 - ny * 10); ctx.fill(); ctx.restore();
}
function glowAdd(x, y, r, col, a = 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; radial(x, y, r, col, a); ctx.restore(); }

// ------------------------------------------------------------------ коридор
function clockP(x, y, r, h, m, sec) {
  ellP(x, y, r, r, '#f4efe2', { seed: 501, lw: 3 }); ellP(x, y, r * 0.12, r * 0.12, '#1c1512', { line: false });
  for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; stroke([[x + Math.cos(a) * r * 0.74, y + Math.sin(a) * r * 0.74], [x + Math.cos(a) * r * 0.86, y + Math.sin(a) * r * 0.86]], '#1c1512', 3); }
  const ah = ((h % 12) + m / 60) / 12 * 6.283 - 1.5708, am = m / 60 * 6.283 - 1.5708; stroke([[x, y], [x + Math.cos(ah) * r * 0.48, y + Math.sin(ah) * r * 0.48]], '#1c1512', 6); stroke([[x, y], [x + Math.cos(am) * r * 0.72, y + Math.sin(am) * r * 0.72]], '#1c1512', 4);
  if (sec !== undefined) { const as = sec / 60 * 6.283 - 1.5708; stroke([[x, y], [x + Math.cos(as) * r * 0.75, y + Math.sin(as) * r * 0.75]], '#d8342c', 2); }
}
function clicheFrame(x, y, s, t) {                                 // «котик с блюдечком» в рамке на стене (клише)
  push(x, y, s, -0.03);
  rectP(-150, -120, 300, 240, '#a8742e', { seed: 510, lw: 3 }); rectP(-128, -98, 256, 196, '#fbe3ec', { seed: 511, lw: 2 });
  ellP(0, 70, 88, 20, '#ffffff', { seed: 512 }); ellP(0, 66, 66, 12, '#fffdf6', { seed: 513, line: false });
  blobP([[-46, 60], [-52, 10], [-30, -30], [30, -30], [52, 10], [46, 60]], '#ffb0c8', { seed: 514 });
  [-1, 1].forEach(sd => piece([[sd * 14, -26], [sd * 34, -62], [sd * 44, -20]], '#ffb0c8', { seed: 515 + sd }));
  [-1, 1].forEach(sd => { ellP(sd * 17, -4, 12, 15, '#fff', { seed: 517 + sd, lw: 2 }); dot(sd * 17 + 2, 0, 6, '#111'); dot(sd * 17 - 2, -6, 2.5, '#fff'); });
  piece([[-26, -38], [-6, -46], [-26, -56], [-46, -46]], '#ff4f7a', { seed: 519, lw: 1.6 }); dot(0, 16, 4, '#ff6f91');
  txt('♥', 90, -64, 36, { col: '#ff4f7a', font: 'DejaVu Sans' }); txt('♥', -96, -54, 26, { col: '#ff4f7a', font: 'DejaVu Sans' });
  pop();
}
function hallway(t, o = {}) {
  rectP(-300, -300, 1680, 1700, '#6b8775', { seed: 520, line: false, step: 60 });                              // стена
  for (let x = -300; x < 1380; x += 90) rectP(x, -300, 34, 1700, '#62806d', { seed: 521 + x, line: false, step: 80, texA: 0.3 });
  { const r = rng(535); for (let y = -260; y < 1360; y += 70) for (let x = -280; x < 1380; x += 90) { const xx = x + ((y / 70) % 2 ? 45 : 0); piece([[xx, y - 9], [xx + 7, y], [xx, y + 9], [xx - 7, y]], '#7c9a86', { raw: true, line: false, tex: false, a: 0.55 }); } }
  rectP(-300, 1378, 1680, 34, '#ece2c8', { seed: 522, step: 40 });                                           // плинтус
  rectP(-300, 1410, 1680, 800, '#8c5a36', { seed: 523, step: 60, shade: () => { for (let y = 1440; y < 2200; y += 70) stroke([[-300, y], [1380, y + 6]], '#6e4426', 3, { smooth: false }); } });
  // дверь туалета
  rectP(40, 430, 380, 960, '#e9e2d2', { seed: 524, lw: 3, shade: () => { rectP(80, 480, 300, 380, '#ddd4c0', { seed: 525, lw: 2 }); rectP(80, 920, 300, 400, '#ddd4c0', { seed: 526, lw: 2 }); } });
  rectP(18, 404, 424, 30, '#d8cdb6', { seed: 527, lw: 2.4 }); rectP(18, 420, 26, 980, '#d8cdb6', { seed: 536, lw: 2.4 }); rectP(416, 420, 26, 980, '#d8cdb6', { seed: 537, lw: 2.4 });
  rectP(560, 1030, 26, 36, '#f4efe2', { seed: 538, lw: 1.8 }); dot(568, 1042, 3, '#1c1512'); dot(578, 1042, 3, '#1c1512');
  ellP(370, 930, 18, 18, '#c9a24a', { seed: 528 }); rectP(180, 560, 100, 70, '#2f6db3', { seed: 529, lw: 2 }); txt('WC', 230, 597, 44, { col: '#fff', font: 'Inter Black' });
  if (o.doorLight) { ctx.save(); ctx.globalAlpha = o.doorLight; ctx.fillStyle = '#ffe9a8'; ctx.fillRect(48, 1386, 364, 8); ctx.restore(); }
  // выключатель, часы, клише в рамке
  rectP(468, 860, 54, 84, '#f4efe2', { seed: 530, lw: 2 }); rectP(484, 880, 22, 44, '#e2dccd', { seed: 531, lw: 1.6 });
  stroke([[495, o.switchOn ? 886 : 918], [495, o.switchOn ? 892 : 912]], '#1c1512', 6);
  clockP(860, 250, 82, 3, o.min ?? 7, o.sec);
  // бра над выключателем
  rectP(600, 480, 50, 18, '#c9a24a', { seed: 539, lw: 2 }); piece([[580, 420], [670, 420], [690, 498], [560, 498]], o.lamp ? '#ffe7a8' : '#d9cba8', { seed: 540, lw: 2.4 });
  // коврик и кеды у двери
  piece([[60, 1430], [520, 1430], [540, 1520], [40, 1520]], '#b44a3a', { seed: 541, lw: 2.4, shade: () => { for (let x = 70; x < 540; x += 46) stroke([[x, 1436], [x + 6, 1514]], '#e9d6b8', 8, { a: 0.8 }); } });
  [[150, 0], [240, 1]].forEach(([x, i]) => { blobP([[x - 40, 1420], [x + 30, 1414], [x + 46, 1440], [x - 44, 1446]], '#2f3a4a', { seed: 542 + i }); stroke([[x - 44, 1442], [x + 44, 1438]], '#f1efe9', 5); });
  clicheFrame(760, 600, 1, t);
  // лоток: задняя стенка (передняя — litterFront после кота)
  piece([[560, 1250], [960, 1250], [940, 1300], [580, 1300]], '#4f9b8a', { seed: 532, lw: 2.6 });
  ellP(760, 1300, 182, 22, '#cdbb98', { seed: 533, lw: 2 });
  ellP(760, 1426, 230, 22, 'rgba(20,12,6,0.35)', { line: false, tex: false });
}
function litterFront(o = {}) {
  piece([[560, 1300], [960, 1300], [930, 1420], [590, 1420]], '#5bb39f', { seed: 534, lw: 3, shade: () => { stroke([[600, 1330], [920, 1330]], '#3f8e7c', 6); } });
  txt('ТОМ', 760, 1374, 40, { col: '#e8fff8', font: 'Inter Black', rot: -0.02 });
}

// ------------------------------------------------------------------ вставки-коллаж
function cork() {                                                    // пробковая доска
  rectP(-200, -200, 1480, 2320, '#b5895a', { seed: 540, line: false, step: 60, shade: () => { const r = rng(541); for (let i = 0; i < 2600; i++) dot(-200 + r() * 1480, -200 + r() * 2320, 1 + r() * 2.2, r() < 0.5 ? '#8f6438' : '#d1a774', 0.7); } });
}
function card(x, y, w, h, rot, seed, col = '#f6f1e4') { push(x, y, 1, rot); piece([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], col, { seed, step: 30, lw: 2 }); pop(); }
function kittenCut(x, y, s, t) {                                    // котёнок-вырезка (большая голова, маленькое тело)
  push(x, y, s);
  blobP([[0, 40], [70, 70], [90, 150], [60, 200], [0, 210], [-60, 200], [-90, 150], [-70, 70]], TC.fur, { seed: 550 });
  ellP(0, 150, 46, 50, TC.light, { seed: 551, line: false });
  [-1, 1].forEach(sd => piece([[sd * 40, -60], [sd * 70, -130], [sd * 96, -40]], TC.fur, { seed: 552 + sd }));
  ellP(0, -10, 110, 92, TC.fur, { seed: 554 });
  [-1, 1].forEach(sd => { ellP(sd * 38, -20, 32, 38, TC.eye, { seed: 555 + sd, lw: 2.4 }); ellP(sd * 38 + 4, -14, 10, 24, '#0a0806', { line: false, tex: false }); dot(sd * 38 - 8, -36, 7, '#fff'); });
  [-1, 1].forEach(sd => ellP(sd * 20, 34, 26, 18, TC.light, { seed: 557 + sd, lw: 2 })); piece([[-10, 16], [10, 16], [0, 28]], TC.pink, { seed: 559, step: 6 });
  pop();
}
function scissors(x, y, s, t, o = {}) {                             // лактаза: ножницы с глазами
  const op = o.open ?? (0.25 + 0.25 * Math.sin(step(t) * 14)), a = o.a ?? 1; push(x, y, s, o.rot || 0); ctx.globalAlpha = a;
  [-1, 1].forEach(sd => { push(0, 0, 1, sd * op); piece([[-6, -8], [110, -4 * sd - 3], [112, 6 * sd + 3], [-6, 8]], '#cfd6dc', { seed: 560 + sd, lw: 2.4 }); pop(); });
  [-1, 1].forEach(sd => { push(0, 0, 1, -sd * op); ellP(-54, sd * 30, 30, 22, o.col || '#2fb5a0', { seed: 562 + sd, lw: 2.6 }); ellP(-54, sd * 30, 16, 10, '#b5895a', { line: false, tex: false }); pop(); });
  dot(0, 0, 6, '#1c1512');
  [-1, 1].forEach(sd => { ellP(40 + sd * 14, -26, 11, 13, '#fff', { seed: 564 + sd, lw: 1.6, tex: false }); dot(42 + sd * 14, o.sleep ? -22 : -24, o.sleep ? 0 : 4.5, '#111'); if (o.sleep) stroke([[30 + sd * 14, -24], [50 + sd * 14, -24]], '#111', 3); });
  if (o.sleep) txt('z', 90, -60, 40, { col: '#1c1512', font: 'Inter Black', rot: 0.2 });
  ctx.globalAlpha = 1; pop();
}
function cube(x, y, s, seed, col = '#fbfaf5') { push(x, y, s); piece([[-30, -30], [30, -30], [30, 30], [-30, 30]], col, { seed, step: 10, lw: 2.4, shade: () => { const r = rng(seed); for (let i = 0; i < 26; i++) dot(-28 + r() * 56, -28 + r() * 56, 1.6, '#cfcabc', 0.8); } }); pop(); }
function sugarPair(x, y, s, split, seed) {                          // лактоза: два кубика на скотче; split — разрезаны
  push(x, y, s); const d = 34 + split * 46; cube(-d, 0, 1, seed); cube(d, 0, 1, seed + 1, '#fff6d8');
  if (split < 0.5) tape(0, 0, 90 * (1 - split), 0.05, seed + 2); else { tape(-d + 34, 0, 30, 0.2, seed + 3); tape(d - 34, 0, 30, -0.2, seed + 4); }
  pop();
}
function bacterium(x, y, s, t, seed, chew = true) {
  push(x, y, s, Math.sin(step(t) * 3 + seed) * 0.2); const P = []; for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283, r = 52 + (i % 2) * 14; P.push([Math.cos(a) * r, Math.sin(a) * r]); }
  piece(P, '#7fd34a', { seed, step: 10, lw: 2.6 });
  [-1, 1].forEach(sd => { ellP(sd * 16, -14, 11, 13, '#fff', { seed: seed + 3 + sd, lw: 1.6, tex: false }); dot(sd * 16 + 3, -12, 5, '#111'); });
  const mo = chew ? 6 + 16 * Math.abs(Math.sin(step(t) * 9 + seed)) : 8; piece([[-24, 14], [24, 14], [16, 14 + mo], [-16, 14 + mo]], '#2a1010', { raw: true, lw: 2 });
  for (let i = -2; i <= 2; i++) piece([[i * 9 - 4, 14], [i * 9 + 4, 14], [i * 9, 22]], '#fff', { raw: true, line: false, tex: false });
  pop();
}
function drop(x, y, s, seed) { push(x, y, s); piece(spline([[0, -34], [18, -4], [20, 14], [0, 28], [-20, 14], [-18, -4]], true, 5), '#5ab6ef', { raw: true, lw: 2.4 }); dot(-6, 2, 5, '#dff4ff', 0.9); pop(); }
function bubble(x, y, r, seed) { ellP(x, y, r, r, 'rgba(190,255,150,0.55)', { seed, lw: 2.2, tex: false }); dot(x - r * 0.35, y - r * 0.35, r * 0.18, '#ffffff', 0.85); }
function gutBoard(t, o = {}) {                                        // разрез живота: розовая бумажная кишка петлями
  const k = 1 + (o.swell ?? 0) * 0.08 + Math.sin(step(t) * 20) * (o.wob ?? 0) * 0.02;
  push(540, 860, k);
  blobP([[-380, -420], [380, -420], [420, 0], [380, 440], [-380, 440], [-420, 0]], '#f2c9b9', { seed: 580, lw: 4 });
  const loops = [[-300, -300], [300, -300], [300, -100], [-300, -100], [-300, 100], [300, 100], [300, 300], [-300, 300]];
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; const P = spline(loops, false, 10);
  ctx.strokeStyle = '#1c1512'; ctx.lineWidth = 150 / S; ctx.beginPath(); P.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
  ctx.strokeStyle = '#e8829a'; ctx.lineWidth = 142 / S; ctx.stroke(); ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 40 / S; ctx.stroke(); ctx.restore();
  pop();
}
function roofInsert(t, k) {                                         // «все коты орут в три ночи»
  rectP(-100, -100, 1280, 2200, '#1d2a52', { seed: 590, line: false, step: 80 });
  const r = rng(591); for (let i = 0; i < 40; i++) txt('✦', r() * 1080, r() * 900, 14 + r() * 18, { col: '#f7f0c8', font: 'DejaVu Sans', a: 0.5 + 0.5 * Math.abs(Math.sin(step(t) * 2 + i)) });
  ellP(820, 260, 110, 110, '#f6efc6', { seed: 592 });
  piece([[-100, 1200], [540, 900], [1180, 1200], [1180, 2100], [-100, 2100]], '#5a2f2a', { seed: 593, step: 30, shade: () => { for (let y = 980; y < 2100; y += 60) stroke([[-100, y + 220], [540, y - 80], [1180, y + 220]], '#4a2420', 4, { smooth: false }); } });
  push(540, 860, 1.05); const yell = 0.6 + 0.4 * Math.abs(Math.sin(step(t) * 6));
  blobP([[-90, 60], [-100, 0], [-60, -40], [60, -40], [100, 0], [90, 60]], '#1a1412', { seed: 594, lc: '#3a3030' });
  [-1, 1].forEach(sd => piece([[sd * 30, -90], [sd * 60, -150], [sd * 80, -80]], '#1a1412', { seed: 595 + sd, lc: '#3a3030' }));
  ellP(0, -70, 82, 64, '#1a1412', { seed: 597, lc: '#3a3030' });
  [-1, 1].forEach(sd => ellP(sd * 28, -86, 15, 12, '#f2e85c', { seed: 598 + sd, line: false, tex: false }));
  ellP(0, -36, 22 * yell, 26 * yell, '#5a1010', { seed: 600 });
  pop();
  ransom('МЯУУУ!!!', 540, 560, 96 * (0.9 + 0.1 * k), 610, { reveal: k });
  push(250, 330, 1); clockP(0, 0, 90, 3, 0); pop();
}
function sepiaPhoto(x, y, s, rot, t, o = {}) {                     // «деревня»: старое фото-коллаж
  push(x, y, s, rot);
  piece([[-420, -330], [420, -330], [420, 360], [-420, 360]], '#f3ead6', { seed: 620, step: 20, lw: 2 });
  ctx.save(); ctx.beginPath(); ctx.rect(-390, -300, 780, 600); ctx.clip();
  rectP(-400, -310, 800, 620, '#c7a878', { seed: 621, line: false });
  ellP(220, -170, 70, 70, '#f1dfb0', { seed: 622, line: false });
  piece([[-400, 40], [-120, -60], [200, 20], [400, -40], [400, 320], [-400, 320]], '#8f6b40', { seed: 623, lc: '#3b2a18' });
  piece([[-360, 60], [-360, -150], [-250, -240], [-140, -150], [-140, 60]], '#6d4a2a', { seed: 624, lc: '#3b2a18' });
  for (let i = 0; i < 6; i++) stroke([[-100 + i * 70, 70], [-100 + i * 70, -20]], '#e9d8b4', 6);
  stroke([[-120, 0], [320, 0]], '#e9d8b4', 5); stroke([[-120, 40], [320, 40]], '#e9d8b4', 5);
  // ведро со сливками и коты
  push(10, 40, 1.4); piece([[-70, 50], [70, 50], [56, 190], [-56, 190]], '#a98654', { seed: 625, lc: '#3b2a18' }); ellP(0, 50, 70, 16, '#fff3d0', { seed: 626, lc: '#3b2a18' }); ellP(0, 48, 54, 10, '#ffe7a0', { line: false, seed: 627 }); pop();
  const lick = Math.abs(Math.sin(step(t) * 10)); [[-1, -150], [1, 175]].forEach(([sd, cx]) => { push(cx, 170, 1.45, 0, sd); villageCat(lick); pop(); });
  ctx.restore();
  if (o.notes) { push(-210, -230, 1, -0.06); piece([[-150, -36], [150, -36], [150, 36], [-150, 36]], '#f4e6a8', { seed: 628, step: 10, lw: 1.6 }); txt('ЖИРА ↑', 0, 2, 48, { col: '#1c1512', font: 'Inter Black' }); pop(); }
  if (o.notes2) { push(200, 290, 1, 0.05); piece([[-170, -36], [170, -36], [170, 36], [-170, 36]], '#f4e6a8', { seed: 629, step: 10, lw: 1.6 }); txt('САХАРА ↓', 0, 2, 48, { col: '#1c1512', font: 'Inter Black' }); pop(); }
  tape(-380, -310, 120, -0.6, 630); tape(380, -310, 120, 0.6, 631);
  pop();
}
function villageCat(lick) {                                         // кот сбоку тянется к ведру (сепия)
  push(0, 0, 0.9);
  blobP([[-100, 40], [-80, -20], [20, -30], [60, -10], [70, 40]], '#5b3d22', { seed: 640, lc: '#2a1a0e' });
  [[-80], [-50], [30], [55]].forEach(([x], i) => piece([[x - 8, 30], [x + 8, 30], [x + 8, 80], [x - 8, 80]], '#5b3d22', { seed: 641 + i, lc: '#2a1a0e', step: 10 }));
  ellP(96, -40 + lick * 6, 40, 34, '#5b3d22', { seed: 645, lc: '#2a1a0e' });
  [[70, -64], [110, -66]].forEach(([x, y], i) => piece([[x - 14, y + 4], [x, y - 34], [x + 14, y + 4]], '#5b3d22', { seed: 646 + i, lc: '#2a1a0e', step: 8 }));
  piece([[124, -26 + lick * 6], [140, -22 + lick * 10], [128, -10 + lick * 10]], '#d98b8b', { seed: 648, step: 6, lw: 1.6 });
  stroke([[-100, 20], [-150, -20], [-140, -80]], '#5b3d22', 14);
  pop();
}
function tv(x, y, s, t, seed, o = {}) {                              // телевизор с клише-котиком
  push(x, y, s, o.rot || 0); rectP(-150, -120, 300, 230, '#5e4a3a', { seed, lw: 3 }); rectP(-128, -100, 200, 170, '#b8d8e8', { seed: seed + 1, lw: 2 });
  ctx.save(); ctx.beginPath(); ctx.rect(-128, -100, 200, 170); ctx.clip(); push(-28, -12, 0.55); clicheFrame(0, 0, 1, t); pop(); ctx.restore();
  ellP(110, -60, 14, 14, '#2a2420', { seed: seed + 2 }); ellP(110, -10, 14, 14, '#2a2420', { seed: seed + 3 });
  stroke([[-60, -120], [-100, -190]], '#2a2420', 4); stroke([[-40, -120], [10, -195]], '#2a2420', 4);
  pop();
}
function personIcon(x, y, s, col, seed) { push(x, y, s); ellP(0, -70, 34, 34, col, { seed, lw: 2.6 }); piece(spline([[-54, 70], [-46, -16], [0, -34], [46, -16], [54, 70]], true, 6), col, { seed: seed + 1, raw: true, lw: 2.6 }); pop(); }
function stampX(x, y, s, k) { if (k <= 0) return; push(x, y, s * (1.6 - 0.6 * k), 0.1); ctx.globalAlpha = 0.9; stroke([[-50, -50], [50, 50]], '#d8342c', 18); stroke([[50, -50], [-50, 50]], '#d8342c', 18); ctx.globalAlpha = 1; pop(); }
function check(x, y, s, k) { if (k <= 0) return; push(x, y, s * (1.4 - 0.4 * k)); stroke([[-40, 0], [-10, 32], [46, -40]], '#1c1512', 26); stroke([[-40, 0], [-10, 32], [46, -40]], '#45c25a', 18); pop(); }
function glassP(x, y, s, fill, o = {}) {
  push(x, y, s, o.rot || 0); const gw = 60, gh = 170;
  piece([[-gw, -gh / 2], [gw, -gh / 2], [gw - 10, gh / 2], [-gw + 10, gh / 2]], 'rgba(220,238,250,0.65)', { raw: true, tex: false, lw: 3 });
  if (fill > 0.02) { const y0 = gh / 2 - gh * fill; piece([[-gw + 10 * (1 - fill) + 3, y0], [gw - 10 * (1 - fill) - 3, y0], [gw - 12, gh / 2 - 3], [-gw + 12, gh / 2 - 3]], o.water ? '#7cc8f2' : '#fbfcf8', { raw: true, line: false, tex: false }); }
  stroke([[-gw + 14, -gh / 2 + 14], [-gw + 20, gh / 2 - 14]], '#ffffff', 8, { a: 0.6 });
  pop();
}
function cartonP(x, y, s, rot = 0) {
  push(x, y, s, rot);
  piece([[-90, -120], [90, -120], [90, 160], [-90, 160]], '#f6f3ea', { seed: 650, lw: 3 }); piece([[-90, -120], [-46, -180], [46, -180], [90, -120]], '#e6e1d4', { seed: 651, lw: 3 });
  rectP(-90, -50, 180, 120, '#3a9a6f', { seed: 652, lw: 2 }); txt('КОШАЧЬЕ', 0, -18, 34, { col: '#fff', font: 'Inter Black' }); txt('МОЛОКО', 0, 18, 34, { col: '#fff', font: 'Inter Black' }); txt('без лактозы', 0, 50, 22, { col: '#e9fff2', font: 'Inter', weight: 700 });
  [-18, 0, 18].forEach((dx, i) => ellP(dx, 106 - (i === 1 ? 8 : 0), 8, 9, '#3a9a6f', { seed: 653 + i, line: false })); ellP(0, 128, 22, 16, '#3a9a6f', { seed: 656, line: false });
  pop();
}
function polaroid(x, y, s, rot, t, label) {                         // «вчера»: голова Тома в стакане
  push(x, y, s, rot); piece([[-170, -190], [170, -190], [170, 210], [-170, 210]], '#fbfaf6', { seed: 660, lw: 2 });
  ctx.save(); ctx.beginPath(); ctx.rect(-148, -168, 296, 296); ctx.clip(); rectP(-160, -180, 320, 320, '#6b8775', { seed: 661, line: false });
  push(0, 30, 0.55); tom({ x: 0, y: 0, s: 1, t, body: true, mood: 'bliss', lid: 1, m: { open: 0.3 } }); pop();
  glassP(0, -40, 1.05, 0.15, { rot: Math.PI }); ctx.restore();
  txt(label, 0, 168, 44, { col: '#1c1512', font: 'Hand', weight: 700, rot: -0.03 }); tape(0, -196, 140, 0.04, 662); pop();
}
function diploma(x, y, s, rot, tear) {                              // «диетолог» — рвётся пополам
  push(x, y, s, rot);
  [-1, 1].forEach(sd => { push(sd * tear * 60, tear * 40, 1, sd * tear * 0.35); ctx.save(); ctx.beginPath(); if (sd < 0) { ctx.rect(-400, -400, 400, 800); } else { ctx.rect(0, -400, 400, 800); } ctx.clip();
    piece([[-230, -150], [230, -150], [230, 150], [-230, 150]], '#f5edd6', { seed: 670, lw: 3, shade: () => { piece([[-210, -130], [210, -130], [210, 130], [-210, 130]], '#f5edd6', { seed: 671, lc: '#b8913a', lw: 4 }); } });
    txt('ДИПЛОМ', 0, -70, 54, { col: '#1c1512', font: 'DejaVu Serif', weight: 700 }); txt('ДИЕТОЛОГ', 0, 10, 64, { col: '#b8322a', font: 'Inter Black' }); ellP(130, 90, 40, 40, '#d8a83a', { seed: 672 });
    ctx.restore(); pop(); });
  pop();
}

// ------------------------------------------------------------------ общие вставки (из эп. 2–3)
function phoneCut(x, y, s, rot, o = {}) {                          // телефон-вырезка покрупнее; o.dead, o.rice, o.drip, o.screen(fn)
  push(x, y, s, rot); piece([[-110, -210], [110, -210], [110, 210], [-110, 210]], '#1d2026', { seed: 3100, step: 20, lw: 3 });
  rectP(-96, -190, 192, 380, o.dead ? '#151a22' : '#bfe3ff', { seed: 3101, lw: 1.6, tex: false });
  if (o.dead) { stroke([[-40, -30], [-10, 0]], '#3a4250', 6); stroke([[-10, -30], [-40, 0]], '#3a4250', 6); stroke([[10, -30], [40, 0]], '#3a4250', 6); stroke([[40, -30], [10, 0]], '#3a4250', 6); stroke([[-30, 60], [0, 46], [30, 60]], '#3a4250', 6); }
  if (o.screen) { ctx.save(); ctx.beginPath(); ctx.rect(-96, -190, 192, 380); ctx.clip(); o.screen(); ctx.restore(); }
  if (o.rice) grains(0, 0, o.rice, 220, 3102);
  rectP(-26, 196, 52, 10, '#000', { seed: 3103, line: false, tex: false });
  pop();
}
function moneyStack(x, y, s, t, t0) {
  push(x, y, s); for (let i = 0; i < 6; i++) { const k = pr(t, t0 + i * 0.06, t0 + i * 0.06 + 0.15); if (k <= 0) continue; push(0, -i * 34 * k, 1, (i % 2 - 0.5) * 0.06);
    piece([[-200, -40], [200, -40], [200, 40], [-200, 40]], '#7fbf6a', { seed: 1620 + i, lw: 2.4 }); ellP(0, 0, 34, 28, '#5f9a4e', { seed: 1630 + i, lw: 1.6 }); txt('$', 0, 2, 40, { font: 'Inter Black', col: '#e9f6dc' }); pop(); }
  pop();
}
