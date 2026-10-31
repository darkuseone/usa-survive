/* Эп. 7 «Курицу моют?» — декорация (кухня вечером, раковина) и вставки-коллажи. */

function kitchen7(t, o = {}) {
  rectP(-300, -300, 1680, 1860, '#e8d9b0', { seed: 7000, line: false, step: 60 });                         // стена: тёплый беж
  rectP(-300, 860, 1680, 330, '#2f5f7a', { seed: 7001, lw: 2, shade: () => { for (let y = 860; y < 1190; y += 55) stroke([[-300, y], [1380, y]], '#27506a', 3, { smooth: false });
    for (let x = -300; x < 1380; x += 55) stroke([[x, 860], [x, 1190]], '#27506a', 3, { smooth: false }); } });            // фартук: синяя плитка
  rectP(460, 300, 360, 420, '#1d2448', { seed: 7002, lw: 3, shade: () => { ellP(740, 380, 40, 40, '#f3edc8', { seed: 7003, line: false }); } });
  stroke([[640, 300], [640, 720]], '#f3efe6', 10); rectP(444, 286, 392, 24, '#f3efe6', { seed: 7004, lw: 2.4 });
  // полка с посудой и полотенце
  rectP(-40, 520, 360, 20, '#6b4a2e', { seed: 7010, lw: 2.4 }); [[20, '#e2533a'], [110, '#f2e85c'], [200, '#46b86a']].forEach(([x, c], i) => ellP(x + 30, 490, 40, 30, c, { seed: 7011 + i, lw: 2 }));
  // столешница, раковина со смесителем, разделочная доска, салатник
  piece([[-300, 1180], [1380, 1180], [1380, 1560], [-300, 1560]], '#8a6a4a', { seed: 7020, step: 24, shade: () => { [100, 500, 900].forEach(x => stroke([[x - 40, 1260], [x + 40, 1260]], '#d7cfbf', 9)); stroke([[300, 1200], [300, 1550]], '#6b5038', 5); stroke([[700, 1200], [700, 1550]], '#6b5038', 5); } });
  rectP(-300, 1150, 1680, 40, '#e9e3d6', { seed: 7021, lw: 2.6 });
  ellP(620, 1162, 130, 22, '#9aa3ad', { seed: 7022, lw: 2.6 }); ellP(620, 1164, 110, 14, '#5a6470', { seed: 7023, line: false });
  stroke([[700, 1150], [700, 1030], [640, 1010], [610, 1040]], '#c9ccd2', 14); rectP(680, 1130, 50, 22, '#c9ccd2', { seed: 7024, lw: 2 });
  if (o.water) for (let i = 0; i < 5; i++) { const ph = (t * 3 + i / 5) % 1; ellP(610 + Math.sin(i) * 4, 1050 + ph * 100, 5, 9, '#9fd3f0', { seed: 7030 + i, line: false, tex: false, a: 0.8 }); }
  push(1000, 1150, 1); piece([[-110, 0], [110, 0], [100, -16], [-100, -16]], '#d9b98a', { seed: 7031, lw: 2.4 }); pop();                   // доска
  push(420, 1150, 1); piece([[-80, 0], [80, 0], [96, -56], [-96, -56]], '#fbfaf6', { seed: 7032, lw: 2.4 }); [[-40, -66], [0, -76], [40, -64], [-15, -86], [25, -84]].forEach(([x, y], i) => ellP(x, y, 26, 14, i % 2 ? '#7fbf6a' : '#5fa35a', { seed: 7033 + i, rot: i, lw: 1.6 })); pop();   // салат
  rectP(-300, 1540, 1680, 700, '#c9b8a0', { seed: 7040, step: 60, shade: () => { for (let y = 1560, j = 0; y < 2240; y += 80, j++) for (let x = -300 + (j % 2) * 80; x < 1380; x += 160) rectP(x, y, 80, 80, '#b8a68c', { seed: 7041 + j * 30 + x, line: false, step: 40 }); } });
}
function microbes(t, k, pts, seed = 7100) {                          // «УФ-микробы»: светящиеся зелёные пятна
  if (k <= 0) return; const r = rng(seed);
  pts.forEach(([x, y, n, sp], j) => { for (let i = 0; i < n; i++) { const xx = x + (r() - 0.5) * sp, yy = y + (r() - 0.5) * sp * 0.6, s = (6 + r() * 10) * k * (0.85 + 0.15 * Math.sin(t * 8 + i));
    glowAdd(xx, yy, s * 2.6, 'rgba(120,255,90,0.9)', 0.7); ellP(xx, yy, s, s * 0.8, '#9cff6a', { seed: seed + j * 50 + i, line: false, tex: false, a: 0.9 }); } });
}
const SPLASH = [[620, 1120, 14, 260], [420, 1080, 9, 160], [880, 1120, 8, 200], [1000, 1130, 5, 140], [330, 1200, 6, 160], [180, 1150, 4, 160]];
function chicken(x, y, s, rot) {                                    // сырая курица-вырезка
  push(x, y, s, rot); blobP([[-60, -30], [-20, -54], [40, -50], [70, -10], [56, 34], [0, 50], [-54, 36]], '#f4c9b0', { seed: 7200, lw: 2.4, shade: () => { stroke([[-30, -10], [20, -20]], '#e2a88a', 4); } });
  [-1, 1].forEach(sd => { stroke([[sd * 40, 30], [sd * 62, 74]], '#f4c9b0', 22); ellP(sd * 64, 80, 14, 14, '#fbfaf6', { seed: 7201 + sd, lw: 1.6 }); }); pop();
}
function nightLight(fn) { lightmap('#9a9ab4', () => { radial(620, 700, 900, 'rgba(255,236,200,1)', 0.9); radial(300, 1150, 700, 'rgba(255,240,220,1)', 0.5); if (fn) fn(); }); }

// ------------------------------------------------------------------ вставки
function usdaInsert(t, c) {                                          // 60 % — бактерии в раковине
  cork(); push(540, 560, 1, -0.03); card(0, 0, 820, 260, 0, 7300, '#fbfaf6'); pin(-370, -110); pin(370, -110, '#2f6db3');
  txt('Минсельхоз США (USDA), 2019', 0, -60, 40, { font: 'Inter Black', col: '#1c1512' }); txt('наблюдали, как люди готовят курицу', 0, 0, 34, { font: 'Inter', weight: 700, col: '#3a3530' });
  txt('в тестовой кухне', 0, 50, 34, { font: 'Inter', weight: 700, col: '#3a3530' }); pop();
  push(540, 1000, 1.3); ellP(0, 0, 220, 70, '#9aa3ad', { seed: 7301, lw: 3 }); ellP(0, 6, 190, 50, '#5a6470', { seed: 7302, line: false }); pop();
  microbes(t, pr(t, c.p60 - 0.5, c.p60), [[540, 1000, 18, 380]], 7310);
  if (t > c.p60) { push(540, 1260, 1, 0.03); ransom('60 % — В РАКОВИНЕ', 0, 0, 84, 7320, { reveal: pr(t, c.p60, c.p60 + 0.3), pop: true }); pop(); }
}
function saladInsert(t, c) {                                         // 26 % — в салате; брызги летят далеко
  bg('#1d2026', 7400); push(540, 760, 1.6); piece([[-130, 0], [130, 0], [160, -80], [-160, -80]], '#fbfaf6', { seed: 7401, lw: 3 });
  [[-80, -96], [-20, -110], [50, -100], [100, -90], [0, -126], [-60, -120]].forEach(([x, y], i) => ellP(x, y, 40, 22, i % 2 ? '#7fbf6a' : '#5fa35a', { seed: 7402 + i, rot: i, lw: 1.6 })); pop();
  microbes(t, pr(t, c.p26 - 0.3, c.p26 + 0.2), [[540, 580, 10, 380]], 7410);
  if (t > c.p26) { push(540, 300, 1, -0.03); ransom('26 % — В САЛАТЕ', 0, 0, 92, 7420, { reveal: pr(t, c.p26, c.p26 + 0.3), pop: true }); pop(); }
  if (t > c.splash) { const k = eo(pr(t, c.splash, c.splash + 0.7)); for (let i = 0; i < 9; i++) { const a = -2.6 + i * 0.65, d = 380 * k; stroke([[540, 1100], [540 + Math.cos(a) * d * 0.5, 1100 + Math.sin(a) * d * 0.9 - 120 * k], [540 + Math.cos(a) * d, 1100 + Math.sin(a) * d * 0.5]], '#9fd3f0', 6); }
    label(540, 1260, 'брызги летят дальше, чем кажется', 0, '#f4e6a8', 0.02, 38); }
}
function seventhInsert(t, c) {                                       // каждая седьмая раковина — с бактериями даже после мытья
  cork(); txt('ПОСЛЕ МЫТЬЯ РАКОВИНЫ', 540, 300, 54, { font: 'Inter Black', col: '#1c1512' });
  for (let i = 0; i < 7; i++) { const k = pr(t, c.wash + i * 0.1, c.wash + 0.2 + i * 0.1); if (k <= 0) continue; const x = 180 + (i % 4) * 240, y = 620 + Math.floor(i / 4) * 300, bad = i === 6;
    push(x, y, k * 0.9); card(0, 0, 200, 200, (i % 2 - 0.5) * 0.08, 7500 + i, bad ? '#ffd9d2' : '#fbfaf6'); ellP(0, 10, 70, 26, '#9aa3ad', { seed: 7510 + i, lw: 2 }); pop();
    if (bad) microbes(t, k, [[x, y + 10, 8, 120]], 7520); else check(x + 50, y - 50, 0.5, k); }
  if (t > c.seventh) { push(540, 1260, 1, 0.03); ransom('КАЖДЫЙ СЕДЬМОЙ', 0, 0, 90, 7530, { reveal: pr(t, c.seventh, c.seventh + 0.3), pop: true }); pop(); }
}
function tips7(t, c) {
  cork(); const T = [[c.tip1, 'НЕ МЫТЬ — ГОТОВИТЬ', '🍗', '#fbfaf6'], [c.tip2, 'РУКИ — С МЫЛОМ', '🧼', '#f4e6a8'], [c.tip3, 'ДОСКА ДЛЯ СЫРОГО — ОТДЕЛЬНАЯ', '🔪', '#d9f0d2']];
  T.forEach(([t0, s, em, col], i) => { if (t < t0 - 0.1) return; push(540 + (i - 1) * 20, 420 + i * 330, popK(t, t0 - 0.1, 0.3), (i % 2 ? 0.04 : -0.04));
    card(0, 0, 860, 230, 0, 7600 + i, col); txt(String(i + 1), -360, 0, 90, { font: 'Inter Black', col: '#d8342c' }); txt(em, -250, 0, 80, { font: 'Noto Color Emoji' });
    txt(s, 60, 4, s.length > 20 ? 34 : 46, { font: 'Inter Black', col: '#1c1512' }); pop(); pin(540 + (i - 1) * 20, 320 + i * 330); });
}
function handsInsert(t, c) {                                         // 31 % — даже без мытья курицы, руками
  bg('#1d2026', 7700); [-1, 1].forEach(sd => { push(540 + sd * 190, 800, 1.4, sd * 0.2, sd); blobP([[-60, 120], [-70, -20], [-50, -110], [-20, -130], [0, -100], [20, -140], [44, -110], [70, -60], [70, 120]], '#f2c7a5', { seed: 7701, lw: 2.6 }); pop(); });
  microbes(t, pr(t, c.p31 - 0.2, c.p31 + 0.3), [[350, 760, 9, 180], [730, 760, 9, 180]], 7710);
  if (t > c.p31) { push(540, 330, 1, -0.03); ransom('31 % — РУКАМИ', 0, 0, 100, 7720, { reveal: pr(t, c.p31, c.p31 + 0.3), pop: true }); pop(); }
  txt('даже у тех, кто курицу НЕ мыл', 540, 1180, 40, { font: 'Inter Black', col: '#e9eef2' });
}
