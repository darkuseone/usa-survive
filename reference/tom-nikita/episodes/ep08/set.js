/* Эп. 8 «Лампочный заговор?» — декорация (подъезд, лампа под потолком) и вставки-коллажи. */

function stairwell(t, o = {}) {
  rectP(-300, -300, 1680, 1100, '#e6e1d2', { seed: 8000, line: false, step: 60 });                         // побелка сверху
  rectP(-300, 780, 1680, 800, '#4f7a5a', { seed: 8001, line: false, step: 60 }); stroke([[-300, 782], [1380, 782]], '#3c5e45', 8);   // зелёная панель
  { const r = rng(8002); for (let i = 0; i < 6; i++) stroke([[r() * 1000, 820 + r() * 500], [r() * 1000 + 60, 840 + r() * 500]], '#3c5e45', 3); }   // царапины
  // окошко
  rectP(80, 300, 220, 300, '#9fc3dc', { seed: 8003, lw: 3, shade: () => { radial(190, 380, 160, 'rgba(255,255,255,0.6)', 1); } }); stroke([[190, 300], [190, 600]], '#d8d2c4', 8);
  // почтовые ящики
  push(180, 1050, 1); rectP(-130, -90, 260, 180, '#5a6470', { seed: 8004, lw: 2.6 }); for (let i = 0; i < 6; i++) rectP(-120 + (i % 3) * 82, -80 + Math.floor(i / 3) * 86, 72, 76, '#7a8490', { seed: 8005 + i, lw: 1.6 }); pop();
  // лестница вправо-вверх с перилами
  for (let i = 0; i < 6; i++) { const x = 700 + i * 90, y = 1540 - i * 70; rectP(x, y - 20, 400, 30, '#9a948a', { seed: 8020 + i, lw: 2.2 }); rectP(x, y + 10, 400, 70, '#7a746a', { seed: 8030 + i, line: false }); }
  stroke([[680, 1200], [1180, 850]], '#2a2420', 12); for (let i = 0; i < 6; i++) stroke([[720 + i * 90, 1190 - i * 63], [720 + i * 90, 1520 - i * 70]], '#2a2420', 6);
  rectP(-300, 1540, 1680, 700, '#8a7a6a', { seed: 8040, step: 60, shade: () => { for (let x = -300; x < 1380; x += 90) stroke([[x, 1540], [x - 40, 2240]], '#7a6a5a', 3, { smooth: false }); } });
  // табуретка
  rectP(330, 1380, 200, 26, '#c46a2c', { seed: 8050, lw: 2.4 }); [[345, 0], [500, 1]].forEach(([x, i]) => stroke([[x, 1400], [x + (i ? 14 : -14), 1550]], '#8a4a20', 12));
  // патрон и лампа
  stroke([[565, -300], [565, 560]], '#1c1512', 4); rectP(545, 556, 40, 50, '#3a3530', { seed: 8060, lw: 2 });
  if (o.bulb !== false) bulbP(565, 650, 1, o.lit ?? 0);
}
function bulbP(x, y, s, lit, seed = 8070) {                          // лампа накаливания-вырезка; lit 0..1
  push(x, y, s); ellP(0, 10, 46, 52, lit > 0.05 ? mix('#e9eef2', '#fff1a8', lit) : '#cfd6dc', { seed, lw: 2.4, tex: false, a: 0.92 });
  stroke([[-14, 30], [-8, -4], [0, 20], [8, -4], [14, 30]], lit > 0.05 ? '#ff9a2a' : '#6b655c', 4); rectP(-22, -48, 44, 22, '#b8b2a4', { seed: seed + 1, lw: 1.6 });
  for (let i = 0; i < 3; i++) stroke([[-22, -42 + i * 7], [22, -40 + i * 7]], '#8a8478', 2); pop();
  if (lit > 0.05) glowAdd(x, y + 10 * s, 160 * s, 'rgba(255,220,140,1)', 0.6 * lit);
}
function stairLight(lit, fn) { lightmap(lit > 0.05 ? '#b2aa9a' : '#7d7f98', () => { radial(190, 420, 600, 'rgba(220,235,255,1)', 0.8); if (lit > 0.05) radial(565, 660, 900, 'rgba(255,230,170,1)', lit); if (fn) fn(); }); }

// ------------------------------------------------------------------ вставки
function phoebusCard(t, c) {                                         // картель «Фебус», Женева, 1924
  bg('#2b2622', 8100); push(540, 760, 1.04, -0.03); card(0, 0, 820, 900, 0, 8101, '#f3ecd8');
  txt('PHOEBUS S.A.', 0, -360, 64, { font: 'DejaVu Serif', weight: 700, col: '#1c1512' }); txt('Женева · 23 декабря 1924', 0, -290, 34, { font: 'DejaVu Serif', weight: 400, col: '#3a3530' });
  stroke([[-360, -250], [360, -250]], '#3a3530', 3);
  ['Osram', 'Philips', 'General Electric (через дочерние)', 'Compagnie des Lampes', 'и другие'].forEach((s, i) => { const k = pr(t, c.cartel - 0.3 + i * 0.15, c.cartel - 0.1 + i * 0.15); if (k > 0) txt(s, 0, -190 + i * 56, 34, { font: 'DejaVu Serif', weight: 700, col: '#1c1512', a: k }); });
  for (let i = 0; i < 4; i++) { const x = -300 + i * 200; stroke([[x - 60, 200], [x - 20, 170], [x + 10, 210], [x + 50, 180]], '#2f3a7a', 4); stroke([[x - 70, 220], [x + 70, 220]], '#3a3530', 2); }
  pop();
  if (t > c.k1000) { push(540, 1260, 1, -0.03); ransom('1000 ЧАСОВ', 0, 0, 110, 8110, { reveal: pr(t, c.k1000, c.k1000 + 0.3), pop: true }); pop();
    push(780, 1080, 1.6 - 0.6 * popK(t, c.k1000 + 0.6, 0.3), -0.15); ctx.globalAlpha = 0.9; piece([[-170, -50], [170, -50], [170, 50], [-170, 50]], 'rgba(0,0,0,0)', { raw: true, lc: '#c8241c', lw: 9, tex: false });
    txt('НЕ БОЛЬШЕ', 0, 4, 54, { font: 'Inter Black', col: '#c8241c' }); ctx.globalAlpha = 1; pop(); }
}
function labInsert(t, c) {                                           // лаборатория в Швейцарии: кто дольше 1000 ч — штраф
  bg('#e9eef2', 8200); rectP(-100, 900, 1280, 40, '#5a6470', { seed: 8201, lw: 2.4 });
  txt('ИСПЫТАНИЯ · ШВЕЙЦАРИЯ', 540, 300, 52, { font: 'Inter Black', col: '#1c1512' });
  const h = Math.min(1200, Math.max(0, (t - c.lab) * 380));
  for (let i = 0; i < 5; i++) { const x = 160 + i * 190, dead = i !== 3 && h > 900 + i * 40; stroke([[x, 900], [x, 760]], '#3a3530', 4); bulbP(x, 700, 1.2, dead ? 0 : 1, 8210 + i * 3);
    txt(Math.floor(dead ? 900 + i * 40 : h) + ' ч', x, 990, 36, { font: 'Inter Black', col: dead ? '#9a9488' : '#1c1512' }); }
  if (t > c.fine) { push(730, 520, 1.6 - 0.6 * popK(t, c.fine, 0.3), -0.15); ctx.globalAlpha = 0.9; piece([[-150, -56], [150, -56], [150, 56], [-150, 56]], 'rgba(0,0,0,0)', { raw: true, lc: '#c8241c', lw: 9, tex: false });
    txt('ШТРАФ', 0, 4, 72, { font: 'Inter Black', col: '#c8241c' }); ctx.globalAlpha = 1; pop(); }
  txt('лампа дольше нормы = штраф производителю', 540, 1200, 36, { font: 'Inter Black', col: '#3a3530' });
}
function centennial(t, c) {                                          // Ливермор: лампа горит с 1901 года
  cork(); push(540, 760, 1.1, 0.03); card(0, 0, 620, 720, 0, 8300, '#fbfaf6'); rectP(-270, -320, 540, 500, '#c46a2c', { seed: 8301, lw: 2.4 });
  rectP(-200, -120, 400, 300, '#8a3a2a', { seed: 8302, lw: 2 }); rectP(-140, -40, 280, 220, '#2a2420', { seed: 8303, lw: 2 }); txt('FIRE DEPT', 0, -200, 44, { font: 'Inter Black', col: '#fbfaf6' });
  bulbP(0, 30, 1.3, 0.8 + 0.2 * Math.sin(t * 4), 8304);
  txt('Ливермор, США', 0, 250, 40, { font: 'Inter Black', col: '#1c1512' }); pop(); tape(540, 380, 160, 0.05, 8305);
  if (t > c.y1901) { push(540, 1280, 1, -0.03); ransom('ГОРИТ С 1901', 0, 0, 100, 8310, { reveal: pr(t, c.y1901, c.y1901 + 0.3), pop: true }); pop(); }
}
function appleInsert(t, c) {                                         // иск о замедлении старых айфонов, 2020
  cork(); phoneCut(320, 760, 2.1, -0.06, { screen: () => { rectP(-96, -190, 192, 380, '#f6f4ef', { seed: 8400, line: false, tex: false });
      const a = t * 2; for (let i = 0; i < 8; i++) dot(Math.cos(a + i * 0.785) * 30, -40 + Math.sin(a + i * 0.785) * 30, 5, `rgba(60,60,60,${(i + 1) / 8})`);
      txt('загрузка…', 0, 40, 22, { font: 'Inter', weight: 700, col: '#6b655c' }); txt('🐌', 0, 120, 50, { font: 'Noto Color Emoji' }); } });
  if (t > c.bln - 0.6) { moneyStack(800, 860, 0.9, t, c.bln - 0.6); push(540, 300, 1, -0.04); ransom('$500 000 000', 0, 0, 104, 8410, { reveal: pr(t, c.bln - 0.5, c.bln + 0.3) }); pop(); }
  push(540, 1250, popK(t, c.apple, 0.3), 0.03); card(0, 0, 860, 150, 0, 8411, '#fbfaf6'); txt('Apple, США, 2020: до $500 млн по иску', 0, -24, 38, { font: 'Inter Black', col: '#1c1512' });
  txt('вину компания не признала', 0, 32, 32, { font: 'Inter', weight: 800, col: '#6b655c' }); pop();
}
