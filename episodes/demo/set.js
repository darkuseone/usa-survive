/* Демо 16:9 — бункер: бетон, полки с припасами, гермодверь, лампа на проводе; вставка-факт на пробковой доске. Проверка движка, а не серия. */

function bunker(t, o = {}) {
  rectP(-200, -200, 2320, 1500, '#8d9384', { seed: 100, line: false, step: 80, shade: () => {                       // бетонная стена с опалубкой
    for (let x = -200; x < 2120; x += 240) stroke([[x, -200], [x + 6, 1000]], '#7b8173', 4, { smooth: false });
    for (let y = 120; y < 1000; y += 300) stroke([[-200, y], [2120, y + 4]], '#7b8173', 3, { smooth: false });
    const r = rng(101); for (let i = 0; i < 90; i++) dot(r() * 1920, r() * 1000, 2 + r() * 4, '#6f7568', 0.6); } });
  rectP(-200, -200, 2320, 150, '#6c7166', { seed: 102, lw: 2.4 }); for (let x = 60; x < 1920; x += 380) rectP(x, -60, 40, 110, '#5a5f55', { seed: 103 + x, lw: 2 });   // балки
  // полки с консервами и водой
  [[90, 300], [90, 520], [90, 740]].forEach(([x, y], j) => { rectP(x, y, 420, 18, '#7a5a3a', { seed: 110 + j, lw: 2.2 });
    for (let i = 0; i < 6; i++) { const c = ['#c8402c', '#d9a12b', '#3d7fc4', '#6f7a3e'][(i + j) % 4]; rectP(x + 14 + i * 66, y - 70, 54, 70, c, { seed: 120 + j * 10 + i, lw: 2, shade: () => { rectP(x + 14 + i * 66, y - 52, 54, 26, '#f3efe4', { seed: 140 + j * 10 + i, line: false }); } }); } });
  [[120, 1000], [250, 1000]].forEach(([x, y], i) => { piece([[x - 50, y], [x + 50, y], [x + 46, y - 150], [x + 20, y - 170], [x - 20, y - 170], [x - 46, y - 150]], 'rgba(170,215,240,0.85)', { seed: 150 + i, lw: 2.6, tex: false });
    rectP(x - 14, y - 190, 28, 22, '#3d7fc4', { seed: 152 + i, lw: 2 }); });                                       // канистры воды
  // гермодверь со штурвалом
  ellP(1660, 560, 250, 300, '#5f6a70', { seed: 160, lw: 3, shade: () => { ellP(1660, 560, 200, 250, '#6f7b82', { seed: 161, lw: 2.4 }); } });
  push(1660, 560, 1, step(t, 12) * (o.spin ?? 0)); ellP(0, 0, 90, 90, 'rgba(0,0,0,0)', { raw: true, lw: 14, lc: '#c8402c', tex: false });
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; stroke([[0, 0], [Math.cos(a) * 90, Math.sin(a) * 90]], '#c8402c', 12); } ellP(0, 0, 18, 18, '#c8402c', { seed: 162 }); pop();
  // знак радиации
  push(1180, 300, 1, -0.04); card(0, 0, 200, 200, 0, 170, '#f2c230'); ellP(0, 0, 16, 16, '#1c1512', { seed: 171, line: false });
  for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / 3; piece([[0, 0], ...Array.from({ length: 7 }, (_, k) => { const b = a - 0.5 + k / 6; return [Math.cos(b) * 70, Math.sin(b) * 70]; })], '#1c1512', { raw: true, line: false, tex: false }); }
  ellP(0, 0, 26, 26, '#f2c230', { seed: 172, line: false }); ellP(0, 0, 14, 14, '#1c1512', { seed: 173, line: false }); pop(); tape(1180, 196, 110, 0.05, 174);
  // ящик, пол
  rectP(1060, 820, 320, 180, '#9a7a4a', { seed: 180, lw: 2.6, shade: () => { stroke([[1060, 820], [1380, 1000]], '#7a5a30', 6); stroke([[1380, 820], [1060, 1000]], '#7a5a30', 6); } });
  rectP(-200, 1000, 2320, 400, '#5f5a52', { seed: 190, step: 60, shade: () => { for (let x = -200; x < 2120; x += 160) stroke([[x, 1000], [x - 60, 1400]], '#544f48', 3, { smooth: false }); } });
  // лампа на проводе
  stroke([[900, -60], [900, 150]], '#1c1512', 4); rectP(884, 146, 32, 30, '#3a3530', { seed: 195, lw: 2 });
  ellP(900, 200, 30, 34, (o.lit ?? 1) > 0.2 ? '#fff1a8' : '#cfd6dc', { seed: 196, lw: 2.2, tex: false });
}
function bunkerLight(lit, red, fn) {
  lightmap(mix('#5a5e74', '#7a3a3a', red), () => { radial(900, 220, 1300, 'rgba(255,226,160,1)', lit); if (red > 0) radial(1660, 300, 1200, 'rgba(255,60,40,1)', red * (0.5 + 0.5 * Math.abs(Math.sin(step(TT, 12) * 4)))); if (fn) fn(); });
  if (lit > 0.2) glowAdd(900, 200, 160, 'rgba(255,220,140,1)', 0.5 * lit);
}
let TT = 0;

function waterCard(t, c) {                                          // вставка-факт: FEMA — галлон воды на человека в день, запас минимум на 3 дня
  cork(); push(760, 520, 1, -0.03); card(0, 0, 900, 560, 0, 300, '#f3ecd8');
  txt('EMERGENCY WATER', 0, -210, 64, { font: 'Inter Black', col: '#1c1512' }); stroke([[-380, -164], [380, -164]], '#3a3530', 3);
  for (let i = 0; i < 3; i++) { const k = popK(t, c + 0.3 + i * 0.35, 0.3); if (k <= 0) continue; push(-260 + i * 260, 40, k); piece([[-60, 110], [60, 110], [56, -60], [26, -86], [-26, -86], [-56, -60]], 'rgba(170,215,240,0.95)', { seed: 310 + i, lw: 2.6, tex: false });
    rectP(-16, -110, 32, 26, '#3d7fc4', { seed: 313 + i, lw: 2 }); txt('DAY ' + (i + 1), 0, 20, 34, { font: 'Inter Black', col: '#1c1512' }); pop(); }
  txt('1 gallon per person per day', 0, 220, 40, { font: 'Inter', weight: 800, col: '#3a3530' }); pop(); pin(760, 250);
  if (t > c + 1.4) { push(1480, 640, 1, 0.05); ransom('3 DAYS', 0, 0, 130, 320, { reveal: pr(t, c + 1.4, c + 1.7), pop: true }); pop(); }
  txt('source: FEMA, ready.gov', 760, 880, 30, { font: 'Inter', weight: 800, col: '#1c1512' });
}
