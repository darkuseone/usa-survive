/* Эп. 3 «Телефон в рис?» — декорация (кухня днём) и вставки-коллажи. */

function grains(x, y, n, spread, seed, col = '#f6f1e2', sz = 1) {   // рисинки-вырезки
  const r = rng(seed); for (let i = 0; i < n; i++) ellP(x + (r() - 0.5) * spread, y + (r() - 0.5) * spread * 0.5, 7 * sz, 3.4 * sz, col, { rot: r() * 3.1, lw: 1.2, step: 4, np: 10, tex: false, seed: seed + i });
}
function jarP(x, y, s, label, fill, seed, o = {}) {                // банка с крупой и бумажной этикеткой
  push(x, y, s, o.rot || 0);
  piece([[-54, -70], [54, -70], [62, -50], [62, 80], [52, 92], [-52, 92], [-62, 80], [-62, -50]], 'rgba(220,240,245,0.55)', { seed, lw: 2.6, tex: false });
  piece([[-56, -10], [56, -10], [56, 80], [48, 88], [-48, 88], [-56, 80]], fill, { seed: seed + 1, step: 10, line: false });
  if (o.dots) { const r = rng(seed + 2); for (let i = 0; i < 26; i++) dot(-48 + r() * 96, -2 + r() * 84, 3, o.dots, 0.8); }
  rectP(-60, -92, 120, 26, '#b8322a', { seed: seed + 3, lw: 2 });
  rectP(-46, 14, 92, 40, '#fbf4e2', { seed: seed + 4, lw: 1.6 }); txt(label, 0, 35, 22, { font: 'Inter Black', col: '#1c1512' });
  pop();
}
function kitchen(t, o = {}) {
  const open = o.open ?? 0;
  rectP(-300, -300, 1680, 1860, '#cfe0c4', { seed: 3000, line: false, step: 60 });                         // стена: фисташковая
  { for (let y = -260; y < 900; y += 120) stroke([[-300, y], [1380, y + 4]], '#c2d6b6', 4, { smooth: false }); }
  // окно с дневным небом; open — створка распахнута, шторы полощутся
  rectP(250, 250, 330, 420, '#9fd3f0', { seed: 3001, lw: 3, shade: () => {
    ellP(330, 340, 70, 30, '#ffffff', { seed: 3002, line: false, a: 0.9 }); ellP(470, 420, 90, 34, '#ffffff', { seed: 3003, line: false, a: 0.85 });
    [[250, 590, 330, 80], [330, 560, 120, 110], [450, 600, 130, 70]].forEach(([x, y, w, h], i) => rectP(x, y, w, h, '#7aa6bf', { seed: 3004 + i, line: false })); } });
  if (open > 0) { push(415, 250, 1); piece([[0, 0], [-150 * (1 - open * 0.55), 18 * open], [-150 * (1 - open * 0.55), 440 - 18 * open], [0, 420]], '#e9f4fb', { seed: 3008, lw: 2.6, tex: false, a: 0.85 }); pop(); }
  stroke([[415, 250], [415, 670]], '#f3efe6', 12); stroke([[250, 460], [580, 460]], '#f3efe6', 12);
  rectP(232, 236, 366, 24, '#f3efe6', { seed: 3010, lw: 2.4 }); rectP(220, 664, 390, 30, '#f3efe6', { seed: 3011, lw: 2.4 });   // подоконник
  const fl = open * Math.sin(step(t) * 9) * 26;
  [-1, 1].forEach(sd => { const a = sd < 0 ? 196 : 534, b = a + 100, f = fl * (sd < 0 ? 1 : 0.7);
    piece([[a, 230], [b, 230], [b + f + sd * 10, 700], [a + f - sd * 10, 700]], '#e8a23a', { seed: 3012 + sd, step: 16, lw: 2.4,
      shade: () => { stroke([[a + 50, 240], [a + 50 + f, 690]], '#cf8a26', 5); } }); });
  stroke([[200, 228], [630, 228]], '#6b4a2e', 8);
  if (open > 0) { const r = rng(3020); for (let i = 0; i < 6; i++) { const yy = 300 + i * 60, xx = 600 + ((t * 600 + r() * 600) % 500); stroke([[xx, yy], [xx + 90, yy - 6]], 'rgba(255,255,255,0.8)', 5); } }
  // холодильник слева
  piece([[-60, 520], [200, 520], [204, 1550], [-60, 1550]], '#eef0ee', { seed: 3021, lw: 3, step: 30, shade: () => { stroke([[-60, 900], [202, 900]], '#c9ccc8', 5); stroke([[176, 600], [176, 760]], '#9aa09a', 10); stroke([[176, 960], [176, 1160]], '#9aa09a', 10);
    push(70, 700, 1, 0.08); card(0, 0, 110, 80, 0, 3022, '#f2e85c'); txt('купить', 0, -12, 18, { font: 'Inter', weight: 800, col: '#1c1512' }); txt('РИС!', 0, 14, 22, { font: 'Inter Black', col: '#b8322a' }); pop(); pin(70, 666, '#2f6db3'); } });
  // навесной шкаф и полка с банками
  rectP(660, 240, 420, 300, '#d9b98a', { seed: 3023, lw: 3, shade: () => { stroke([[870, 250], [870, 530]], '#b8976a', 5); dot(850, 480, 8, '#6b4a2e'); dot(890, 480, 8, '#6b4a2e'); } });
  rectP(650, 690, 440, 22, '#b8976a', { seed: 3024, lw: 2.4 });
  jarP(720, 620, 0.9, 'РИС', '#f6f1e2', 3030, { dots: '#e6dfcc' }); if (!o.buckDown) jarP(850, 620, 0.9, 'ГРЕЧКА', '#8a5a34', 3040, { dots: '#6b4226', rot: o.buck ? Math.sin(t * 30) * 0.05 * o.buck : 0 }); jarP(980, 620, 0.9, 'СОЛЬ', '#f4f4f4', 3050);
  if (o.buck) glowAdd(850, 620, 140, 'rgba(255,220,120,0.6)', o.buck);
  // фартук из плитки за столешницей
  rectP(560, 900, 600, 280, '#f4f1ea', { seed: 3060, lw: 2.4, shade: () => { for (let y = 900; y < 1180; y += 56) stroke([[560, y], [1160, y]], '#d8d2c4', 3, { smooth: false }); for (let x = 560; x < 1160; x += 70) stroke([[x, 900], [x, 1180]], '#d8d2c4', 3, { smooth: false }); } });
  // пол — шашечки
  rectP(-300, 1540, 1680, 700, '#e9e1cf', { seed: 3061, step: 60, shade: () => { for (let y = 1540, j = 0; y < 2240; y += 90, j++) for (let x = -300 + (j % 2) * 90; x < 1380; x += 180) piece([[x, y], [x + 90, y], [x + 90, y + 90], [x, y + 90]], '#3c5a6e', { line: false, step: 30, seed: 3070 + j * 20 + x }); } });
}
function counter(t, o = {}) {                                        // столешница, кастрюля риса, чайник
  piece([[540, 1180], [1100, 1180], [1100, 1550], [540, 1550]], '#5b8a9a', { seed: 3080, step: 20, shade: () => { stroke([[820, 1200], [820, 1540]], '#4a7482', 5); [700, 940].forEach(x => stroke([[x - 40, 1260], [x + 40, 1260]], '#d7cfbf', 9)); } });
  rectP(520, 1150, 600, 40, '#c99a62', { seed: 3081, lw: 2.6 });
  if (o.jar) { phoneCut(600, 1010, 0.36, 0.22, { dead: true }); jarP(612, 1050, 1.1, 'ГРЕЧКА', '#8a5a34', 3040, { dots: '#6b4226' }); grains(560, 1146, 6, 80, 3095, '#8a5a34'); }
  // кастрюля с рисом
  else { push(612, 1150, 1); ellP(0, -86, 100, 22, '#f6f1e2', { seed: 3082, lw: 2 }); grains(0, -88, 22, 170, 3083);
  piece([[-104, -86], [104, -86], [96, 0], [-96, 0]], '#9aa3ad', { seed: 3084, lw: 2.8, step: 14, shade: () => { stroke([[-90, -60], [90, -60]], '#b9c0c8', 6); } });
  [-1, 1].forEach(sd => rectP(sd * 104 - (sd < 0 ? 26 : 0), -70, 26, 14, '#2a2420', { seed: 3085 + sd, lw: 1.6 })); pop(); }
  if (o.spill) grains(700, 1146, 9, 120, 3090);
  // чайник
  push(1030, 1150, 0.9); piece(spline([[-60, 0], [-66, -70], [-30, -110], [30, -110], [66, -70], [60, 0]], true, 6), '#d8342c', { raw: true, seed: 3091, lw: 2.6 });
  stroke([[-30, -120], [0, -150], [30, -120]], '#2a2420', 8); stroke([[60, -70], [100, -100]], '#d8342c', 16); pop();
}

// ------------------------------------------------------------------ вставки
function phoneCut(x, y, s, rot, o = {}) {                          // телефон-вырезка покрупнее; o.dead, o.rice, o.drip, o.screen(fn)
  push(x, y, s, rot); piece([[-110, -210], [110, -210], [110, 210], [-110, 210]], '#1d2026', { seed: 3100, step: 20, lw: 3 });
  rectP(-96, -190, 192, 380, o.dead ? '#151a22' : '#bfe3ff', { seed: 3101, lw: 1.6, tex: false });
  if (o.dead) { stroke([[-40, -30], [-10, 0]], '#3a4250', 6); stroke([[-10, -30], [-40, 0]], '#3a4250', 6); stroke([[10, -30], [40, 0]], '#3a4250', 6); stroke([[40, -30], [10, 0]], '#3a4250', 6); stroke([[-30, 60], [0, 46], [30, 60]], '#3a4250', 6); }
  if (o.screen) { ctx.save(); ctx.beginPath(); ctx.rect(-96, -190, 192, 380); ctx.clip(); o.screen(); ctx.restore(); }
  if (o.rice) grains(0, 0, o.rice, 220, 3102);
  rectP(-26, 196, 52, 10, '#000', { seed: 3103, line: false, tex: false });
  pop();
}
function appleSheet(t, c) {                                          // «инструкция Apple»: цитата маркером
  push(540, 820, 1.08, -0.03); card(0, 0, 820, 860, 0, 3110, '#fbfaf6'); tape(-330, -420, 140, -0.4, 3111); tape(330, -420, 140, 0.4, 3112);
  ellP(-330, -340, 30, 34, '#1c1512', { seed: 3113, line: false }); ellP(-318, -380, 9, 14, '#1c1512', { seed: 3114, line: false, rot: 0.5 });
  txt('Support', -280, -340, 40, { font: 'Inter', weight: 700, col: '#1c1512', align: 'left' });
  txt('Если в iPhone попала жидкость', -360, -250, 38, { font: 'Inter Black', col: '#1c1512', align: 'left' });
  for (let i = 0; i < 4; i++) stroke([[-360, -180 + i * 44], [i === 3 ? 120 : 360, -180 + i * 44]], '#c9c4b8', 10);
  if (t > c.dont - 0.1) { const k = pr(t, c.dont - 0.1, c.dont + 0.5); ctx.save(); ctx.globalAlpha = 0.85; piece([[-380, -20], [-380 + 760 * k, -24], [-380 + 760 * k, 70], [-380, 74]], '#ffe54a', { seed: 3115, line: false, step: 20 }); ctx.restore(); }
  txt('Не кладите iPhone в рис.', 0, 24, 54, { font: 'Inter Black', col: '#1c1512' });
  if (t > c.particles - 0.1) txt('Частицы риса могут его повредить.', 0, 110, 38, { font: 'Inter', weight: 700, col: '#1c1512', reveal: pr(t, c.particles - 0.1, c.particles + 0.8) });
  for (let i = 0; i < 4; i++) stroke([[-360, 190 + i * 44], [i === 3 ? -40 : 360, 190 + i * 44]], '#c9c4b8', 10);
  pop();
}
function portMacro(t, t0) {                                          // разъём под лупой: рисинки и крахмальная пыль
  rectP(-100, -100, 1280, 2200, '#2b2a3a', { seed: 3120, line: false, step: 80 });
  phoneCut(540, 1300, 2.6, 0, {});
  const k = popK(t, t0, 0.35); push(540, 760, k);
  ellP(0, 0, 330, 330, '#e9eef2', { seed: 3121, lw: 5 });
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 316, 0, 6.3); ctx.clip();
  rectP(-330, -330, 660, 660, '#1d2026', { seed: 3122, line: false });
  rectP(-230, -60, 460, 120, '#0c0e12', { seed: 3123, lw: 3 }); for (let i = 0; i < 8; i++) rectP(-180 + i * 48, -16, 24, 32, '#c9a24a', { seed: 3124 + i, lw: 1.4 });
  grains(-60, 0, 4, 240, 3135, '#f6f1e2', 4.2); const r = rng(3140); for (let i = 0; i < 30; i++) dot(-200 + r() * 400, -50 + r() * 100, 4 + r() * 4, '#efe8d6', 0.9);
  ctx.restore(); stroke([[230, 230], [400, 400]], '#6b4a2e', 46); pop();
}
function corrosion(t, c) {                                           // плата: ржавчина растёт, рисинка ничего не может
  rectP(-100, -100, 1280, 2200, '#20302a', { seed: 3150, line: false, step: 80 });
  push(540, 860, 1, 0.02); piece([[-380, -300], [380, -300], [380, 300], [-380, 300]], '#2f7a4a', { seed: 3151, lw: 3, step: 20, shade: () => {
    for (let i = 0; i < 9; i++) stroke([[-360, -250 + i * 60], [-100 + (i % 3) * 120, -250 + i * 60], [-60 + (i % 3) * 120, -210 + i * 60], [360, -210 + i * 60]], '#c9a24a', 5);
    rectP(-120, -90, 240, 180, '#1d2026', { seed: 3152, lw: 2.4 }); txt('A17', 0, 0, 44, { font: 'Inter Black', col: '#9aa3ad' }); } });
  const g = pr(t, c.corr - 0.2, c.rice + 1.4), r = rng(3160);
  for (let i = 0; i < 16; i++) { const k = clamp(g * 16 - i * 0.6); if (k <= 0) continue; const x = -330 + r() * 660, y = -260 + r() * 520;
    blobP([[x - 40 * k, y], [x - 10, y - 34 * k], [x + 36 * k, y - 10], [x + 26 * k, y + 30 * k], [x - 20, y + 36 * k]], i % 2 ? '#7fae3a' : '#b56a2a', { seed: 3170 + i, lw: 1.6, a: 0.9 }); }
  pop();
  if (t > c.rice) { push(540, 1250, popK(t, c.rice, 0.3), -0.1); ellP(0, 0, 110, 52, '#f6f1e2', { seed: 3190, lw: 3 }); [-1, 1].forEach(sd => { ellP(sd * 30, -6, 13, 16, '#fff', { seed: 3191 + sd, lw: 2 }); dot(sd * 30, -2, 6, '#111'); });
    stroke([[-24, 26], [0, 18], [24, 26]], '#1c1512', 4); txt('…', 120, -70, 70, { font: 'Inter Black', col: '#f6f1e2' }); pop(); }
}
function rankTable(t, c) {                                           // «турнир сушилок»: рис последний из семи
  push(540, 860, 1, 0.02); card(0, 0, 860, 1040, 0, 3200, '#fbfaf6'); pin(-380, -490); pin(380, -490, '#2f6db3');
  txt('ЧЕМ СУШИТЬ ТЕЛЕФОН', 0, -430, 50, { font: 'Inter Black', col: '#1c1512' }); stroke([[-380, -385], [380, -385]], '#1c1512', 5);
  for (let i = 0; i < 7; i++) { const k = pr(t, c.cmp - 0.1 + i * 0.16, c.cmp + 0.1 + i * 0.16); if (k <= 0) continue; const y = -320 + i * 116, last = i === 6;
    push(0, y, 1); rectP(-380, -48, 760, 96, last ? '#ffd9d2' : '#eef1f6', { seed: 3201 + i, lw: 2 });
    txt(String(i + 1), -330, 2, 56, { font: 'Inter Black', col: i === 0 ? '#c9a24a' : '#1c1512' });
    if (i === 0) txt('силикагель', -270, 2, 44, { font: 'Inter', weight: 800, col: '#1c1512', align: 'left' });
    else if (!last) { stroke([[-270, 0], [lerp(-270, 300 - i * 30, k), 0]], '#c9c4b8', 22); }
    else txt('РИС', -270, 2, 56, { font: 'Inter Black', col: '#c8241c', align: 'left' });
    pop(); }
  if (t > c.last) { push(200, 380, 1.6 - 0.6 * popK(t, c.last, 0.3), -0.16); ctx.globalAlpha = 0.9; piece([[-200, -56], [200, -56], [200, 56], [-200, 56]], 'rgba(0,0,0,0)', { raw: true, lc: '#c8241c', lw: 9, tex: false });
    txt('ПОСЛЕДНИЙ', 0, 4, 58, { font: 'Inter Black', col: '#c8241c' }); ctx.globalAlpha = 1; pop(); }
  pop();
}
function litterBag(x, y, s, rot) { push(x, y, s, rot); piece([[-110, -150], [110, -150], [124, 160], [-124, 160]], '#7a5cb8', { seed: 3220, lw: 3 });
  rectP(-84, -60, 168, 110, '#fbf4e2', { seed: 3221, lw: 2 }); txt('НАПОЛНИТЕЛЬ', 0, -26, 24, { font: 'Inter Black', col: '#7a5cb8' }); txt('для котиков', 0, 14, 22, { font: 'Inter', weight: 700, col: '#1c1512' });
  [-1, 1].forEach(sd => piece([[sd * 12, 100], [sd * 32, 72], [sd * 46, 104]], '#fbf4e2', { seed: 3222 + sd, step: 6, lw: 1.6 })); ellP(0, 118, 34, 24, '#fbf4e2', { seed: 3225, lw: 1.6 }); pop(); }
function riceBag(x, y, s, rot) { push(x, y, s, rot); piece([[-100, -130], [100, -130], [110, 150], [-110, 150]], '#f2ead6', { seed: 3230, lw: 3 });
  rectP(-80, -40, 160, 90, '#d8342c', { seed: 3231, lw: 2 }); txt('РИС', 0, 6, 46, { font: 'Inter Black', col: '#fff' }); pop(); }
function scaleInsert(t, t0) {                                        // весы «кто сушит лучше»: наполнитель перевешивает рис
  cork(); const k = eio(pr(t, t0, t0 + 0.6)), a = -0.22 * k;
  push(540, 1000, 1); rectP(-20, -40, 40, 460, '#6b4a2e', { seed: 3240, lw: 2.6 }); ellP(0, 430, 160, 30, '#6b4a2e', { seed: 3241, lw: 2.6 });
  push(0, -40, 1, a); rectP(-380, -14, 760, 28, '#8a6a42', { seed: 3242, lw: 2.4 });
  [[-340, 1], [340, -1]].forEach(([x, sd], i) => { push(x, 0, 1, -a); stroke([[-90, 180], [0, 0], [90, 180]], '#2a2420', 4); ellP(0, 190, 130, 26, '#c9c4b8', { seed: 3243 + i, lw: 2.4 });
    if (i === 0) litterBag(0, 30, 0.85, 0.04); else riceBag(0, 50, 0.75, -0.05); pop(); });
  pop(); pop();
}
function tapInsert(t, t0) {                                          // шаг 1: постучать разъёмом вниз о ладонь
  bg('#e8eef2', 3250); const ph = step(t, 12), hit = Math.abs(Math.sin((t - t0) * 9));
  push(540, 1240, 1, -0.05); blobP([[-260, 60], [-200, -40], [0, -60], [220, -40], [280, 40], [200, 120], [-180, 130]], '#f2c7a5', { seed: 3251, lw: 3, shade: () => { stroke([[-120, 30], [120, 20]], '#d8a684', 5); } }); pop();
  phoneCut(540, 960 - hit * 80, 1.1, Math.PI, {});
  if (hit < 0.2) for (let i = 0; i < 5; i++) { const r = rng(hsh(FRAME, i)); drop(500 + r() * 80, 1170 + r() * 60, 0.8, 3260 + i); }
  label(540, 380, '1. РАЗЪЁМОМ ВНИЗ', 0, '#f4e6a8', -0.03, 54);
}
function chargeInsert(t, c) {                                        // шаг 3: не заряжать полчаса; сохнуть до суток
  bg('#2b2a3a', 3270);
  push(540, 760, 1); ellP(0, 0, 300, 300, '#f4efe2', { seed: 3271, lw: 4 });
  const m = c.day > 0 && t > c.day ? 30 + (t - c.day) * 400 : Math.min(30, (t - c.charge + 0.3) * 22);
  clockP(0, 0, 290, 12 + Math.floor(m / 60), m % 60);
  ctx.save(); ctx.globalAlpha = 0.45; ctx.fillStyle = '#ffb81a'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 250, -1.5708, -1.5708 + Math.min(m, 60) / 60 * 6.283); ctx.closePath(); ctx.fill(); ctx.restore(); pop();
  push(540, 1340, 1); stroke([[-300, 0], [-60, 0]], '#f4efe2', 18); rectP(-70, -30, 90, 60, '#f4efe2', { seed: 3272, lw: 2.4 }); stampX(-20, 0, 1.2, pr(t, c.charge, c.charge + 0.2)); pop();
  if (t > c.half) label(540, 260, 'ЗАРЯЖАТЬ ЧЕРЕЗ 30 МИН', 0, '#f4e6a8', -0.03, 46);
  if (t > c.day) { push(540, 1170, 1, 0.04); ransom('ДО 24 Ч', 0, 0, 110, 3273, { reveal: pr(t, c.day, c.day + 0.25), pop: true }); pop(); }
}
function noNo(t, c) {                                                // без фена и ваток; не помогло — в сервис
  cork();
  push(320, 700, 1.1, -0.08); card(0, 0, 400, 380, 0, 3280, '#fbfaf6');
  piece([[-120, -60], [90, -90], [110, -20], [-100, 30]], '#e25ca8', { seed: 3281, lw: 2.6 }); piece([[-40, 10], [10, 0], [30, 130], [-20, 140]], '#e25ca8', { seed: 3282, lw: 2.6 });
  ellP(100, -55, 30, 44, '#2a2420', { seed: 3283, lw: 2 }); txt('ФЕН', 0, 150, 40, { font: 'Inter Black', col: '#1c1512' }); stampX(0, 0, 1.6, pr(t, c.fen, c.fen + 0.2)); pop();
  push(760, 760, 1.1, 0.07); card(0, 0, 400, 380, 0, 3284, '#fbfaf6');
  stroke([[-130, 60], [130, -60]], '#f4efe2', 18); [[-130, 60], [130, -60]].forEach(([x, y], i) => ellP(x, y, 30, 22, '#ffffff', { seed: 3285 + i, lw: 2, rot: -0.43 }));
  txt('ВАТКИ', 0, 150, 40, { font: 'Inter Black', col: '#1c1512' }); stampX(0, 0, 1.6, pr(t, c.cotton, c.cotton + 0.2)); pop();
  pin(320, 530); pin(760, 590, '#2f6db3');
  if (t > c.service - 0.1) { push(540, 1230, popK(t, c.service - 0.1, 0.3), -0.03); card(0, 0, 640, 220, 0, 3290, '#2f6db3');
    txt('🔧', -230, 0, 90, { font: 'Noto Color Emoji' }); txt('В СЕРВИС', 60, 4, 76, { font: 'Inter Black', col: '#fff' }); pop(); }
}
