/* Глава 4 — Day 12 (3:31–4:26): ночное окно → лоток на дюйм → Ди, руки вверх → фура → новости: стадион, 18 дней, 6 миль → проблема 4: люди → «что бы ты сделал?» → две бутылки через лоток → она уходит → «в следующий раз не одна». */
const C4 = { s: LS('c4_01'), b: LS('c4_01b'), slide: WW('c4_01b', /^slide/i), dee: LS('c4_02'), please: WW('c4_02', /^please/i), name: LS('c4_03'), news: WW('c4_03', /^news/i), map: LS('c4_04'),
  p4: LS('c4_05'), partner: WW('c4_05', /^partner/i), someone: WW('c4_05', /^someone/i), ask: LS('c4_06'), what: WW('c4_06', /^what/i), bot: LS('c4_07'), nods: WW('c4_07', /^nods/i), again: LS('c4_08'), alone: WW('c4_08', /^alone/i), card: LE('c4_08') + 0.1 };
const DEEDARK = { pal: { top: '#2a2c34', topD: '#1c1e24', skin: '#3a3440', skinD: '#2a2430', hair: '#1c1a1c', pants: '#1c1e24' }, capCol: '#1c2430' };
function semiScene(t) {                                      // шоссе ночью: фура сложилась «ножом», аварийка, рассыпанный груз; Ди уходит с фонариком
  bg('#1a2238', 2600); const r0 = rng(2640); for (let i = 0; i < 40; i++) dot(r0() * W, r0() * 380, 1.5 + r0() * 2, '#8a96c0', 0.4);
  for (let i = 0; i < 10; i++) { const r = rng(2650 + i), x = i * 220 - 60 + r() * 60, h = 150 + r() * 130; piece(spline([[x - 80, 560], [x - 50, 560 - h * 0.6], [x - 10, 560 - h], [x + 30, 560 - h * 0.7], [x + 80, 560]], true, 6), '#111727', { seed: 2651 + i, line: false }); }
  piece([[-100, 540], [400, 500], [900, 530], [1400, 490], [2000, 520], [2000, 640], [-100, 640]], '#0f1526', { seed: 2601 });
  rectP(-100, 620, W + 200, 520, '#30343e', { seed: 2602, line: false, step: 70, shade: () => { for (let x = -100; x < W; x += 260) rectP(x, 840, 140, 14, '#d9d0a0', { raw: true, line: false, a: 0.7 });
    stroke([[-100, 660], [W + 100, 650]], '#e8e4d8', 6, { a: 0.5 }); stroke([[-100, 1040], [W + 100, 1050]], '#e8e4d8', 6, { a: 0.5 });
    stroke([[200, 980], [600, 900], [900, 800], [1100, 760]], '#1c1e24', 22, { a: 0.6 }); stroke([[260, 1010], [660, 930], [960, 830], [1140, 790]], '#1c1e24', 22, { a: 0.6 }); } });      // следы торможения
  for (let x = -60; x < W; x += 170) { rectP(x, 590, 12, 50, '#8e949a', { seed: 2660 + x, lw: 1.4 }); } rectP(-100, 584, W + 200, 16, '#b0b6bb', { seed: 2661, lw: 1.8 });            // отбойник
  push(250, 600); rectP(-6, -150, 12, 150, '#8e949a', { seed: 2662, lw: 1.4 }); rectP(-60, -230, 120, 86, '#2f6a4a', { seed: 2663, lw: 2 }); txt('MILE', 0, -204, 22, { font: 'Inter Black', col: '#fbfaf6' }); txt('61', 0, -172, 38, { font: 'Inter Black', col: '#fbfaf6' }); pop();
  const hz = 0.5 + 0.5 * Math.sin(t * Math.PI * 1.6);
  push(1010, 800, 1, -0.3); rectP(-560, -250, 820, 250, '#d8dade', { seed: 2603, lw: 2.8, shade: () => { stroke([[-560, -130], [260, -130]], '#a9adb2', 4); for (let x = -520; x < 260; x += 60) stroke([[x, -250], [x, 0]], '#c2c5ca', 2, { a: 0.6 }); txt('HAUL', -150, -124, 110, { font: 'Inter Black', col: '#3d6fa4' }); rectP(-560, -20, 820, 20, '#c8342c', { raw: true, line: false }); } });
  for (let i = 0; i < 3; i++) { ellP(-460 + i * 130, 6, 48, 48, '#1c1512', { seed: 2604 + i }); ellP(-460 + i * 130, 6, 20, 20, '#8e949a', { seed: 2607 + i }); } rectP(220, -150, 30, 60, mix('#5a3a10', '#ffb030', hz), { raw: true, lw: 1.4, tex: false }); pop();
  push(1390, 850, 1, 0.42); rectP(-70, -250, 260, 250, '#3d6fa4', { seed: 2610, lw: 2.8, shade: () => { rectP(60, -216, 110, 96, '#9fb4c8', { raw: true, lw: 2 }); rectP(-70, -40, 260, 40, '#2d5684', { raw: true, line: false }); stroke([[-40, -250], [-40, -330]], '#8e949a', 10); } });
  ellP(30, 4, 54, 54, '#1c1512', { seed: 2611 }); ellP(30, 4, 22, 22, '#8e949a', { seed: 2612 }); ellP(188, -70, 16, 22, '#fff6cf', { seed: 2613, lw: 1.6, tex: false }); pop();
  [[420, 940, 0.2], [560, 1000, -0.3], [300, 1030, 0.5], [700, 960, 0.1], [180, 950, -0.1]].forEach(([x, y, a], i) => { push(x, y, 1, a); rectP(-44, -40, 88, 80, '#b98a52', { seed: 2620 + i, lw: 2, shade: () => stroke([[-44, -8], [44, -8]], '#8a6034', 4) }); pop(); });   // груз на асфальте
  layer(() => dee({ x: 520 - (t % 60) * 6, y: 560, s: 0.5, t, flip: true, legs: 'walk', mood: 'dread', arms: { l: undefined, r: [170, 170, 'fist'] } }), { sx: 3, sy: 4, sb: 5 });
  ripples(t); rainOut(t, -100, 1100, 1.3); mist(t, 1.4);
  lightmap('#5a5e74', () => { radial(1040, 700, 320, 'rgba(255,170,40,1)', 0.5 * hz); radial(1600, 880, 300, 'rgba(255,170,40,1)', 0.45 * hz); cone(1560, 760, 1900, 900, 150, 'rgba(255,246,210,1)', 0.7); radial(1560, 770, 260, 'rgba(255,246,210,1)', 0.5);
    cone(430, 640, 150, 900, 110, 'rgba(255,250,220,1)', 0.6); radial(960, 300, 1300, 'rgba(120,150,220,1)', 0.35); });
}
function choiceIns(t) {                                      // партнёр или вор
  paperBg(2620); stamp('PROBLEM 4', t, C4.p4, W / 2, 140, 110, 2621);
  [[-1, 'PARTNER?', C4.partner, 0.8, '#46b86a'], [1, 'THIEF?', C4.someone, -0.6, '#c8241c']].forEach(([sd, s, t0, sm2, col], i) => { const k = popK(t, t0 - 0.2, 0.35); if (k <= 0) return;
    push(W / 2 + sd * 420, 600, k, sd * 0.03); card(0, 0, 640, 700, 0, 2622 + i, '#f3ecd8');
    ctx.save(); ctx.beginPath(); ctx.rect(-300, -330, 600, 520); ctx.clip(); dee({ x: 0, y: -80, s: 1.1, t, smile: sm2, mood: i ? 'angry' : '', lk: [-sd * 0.4, 0], ...(i ? DEEDARK : {}) }); ctx.restore();
    txt(s, 0, 270, 80, { font: 'Inter Black', col }); pop(); });
}
SHOTS.push([C4.s - 0.1, 'c4win', 'dip'], [C4.b - 0.1, 'c4crawl'], [C4.slide - 0.1, 'c4inch'], [C4.dee - 0.1, 'c4dee', 'flash'], [C4.name - 0.1, 'c4truck', 'whip'], [C4.news - 0.7, 'c4deeTalk'],
  [C4.map - 0.1, 'mapIns', 'whip'], [C4.p4 - 0.1, 'choiceIns', 'tear'], [C4.ask - 0.1, 'c4ask'], [C4.bot - 0.1, 'c4bottles'], [C4.nods - 0.1, 'c4leave'], [C4.again - 0.1, 'c4again', 'dip'], [C4.card, 'card15', 'tear']);
const winL = (dim = 1) => lightmap('#5a5e74', () => { radial(960, 120, 1100, 'rgba(255,240,210,1)', 0.75 * dim); radial(960, 900, 700, 'rgba(255,200,120,1)', 0.35); });
Object.assign(SH, {
  c4win(t, u) { cam(W / 2, H / 2, 1.0 + u * 0.02); nightWin(t, { drawer: Math.sin(clamp((t - C4.s - 2) / 3) * Math.PI) }); winL(); pop(); push(470, 160, 1, -0.03); label(0, 0, 'NIGHT PAY WINDOW', 560, '#f2c230', 0, 50); pop(); },
  c4crawl(t, u) { const k = clamp(u / 3.2), x = lerp(1285, 1395, k), by = Math.abs(Math.sin(step(t, 12) * 5)) * 8;                        // крадётся пригнувшись за прилавком: над стойкой — шапка и глаза
    SD(t, [1400, 600, 1.8 + u * 0.03], { slits: 0.3, amb: '#5a5e74', j: { P: { x, y: 612 - by }, lean: 0.05, legs: 'walk', mood: 'dread', lid: 0, lk: [0.9, -0.3], sweat: 1, noShadow: true, arms: { l: [-150, 300, 'open'], r: [150, 300, 'open'] } } }); },
  c4inch(t, u) { cam(W / 2, 600, 1.35); nightWin(t, { drawer: 0.08 * clamp((t - C4.slide) / 0.6), dee: { mood: 'dread', arms: { l: [-150, 300, 'open'], r: [150, 300, 'open'] }, ...DEEDARK } }); winL(0.5); pop(); },
  c4dee(t, u) { const talk = t > C4.please - 0.05 && t < C4.please + 1.2; cam(980, 560, 1.25 + u * 0.03); nightWin(t, { drawer: 0.08, dee: { mood: 'shock', lid: 0, lk: [0, 0.1], arms: { l: [-170, -40, 'open'], r: [170, -40, 'open'] }, m: talk ? { open: 0.3 + 0.3 * Math.abs(Math.sin(step(t, 12) * 9)), round: 0.3 } : undefined } }); winL(); pop(); },
  c4truck(t, u) { cam(W / 2, H / 2, 1.0 + u * 0.03); semiScene(t); pop(); },
  c4deeTalk(t, u) { cam(980, 430, 1.9 + u * 0.03); nightWin(t, { drawer: 0.08, dee: { mood: '', lk: [-0.2, 0], arms: { l: [-150, 300, 'open'], r: [170, 120, 'open'] }, smile: 0.2 } }); winL(); pop(); },
  mapIns(t, u) { mapIns(t, C4.map); },
  choiceIns(t, u) { choiceIns(t); },
  c4ask(t, u) { SD(t, [1150, 470, 2.3 + u * 0.03], { slits: 0.3, amb: '#5a5e74', lantern: [1350, 640], lk: 0.6, j: { P: { x: 1150 }, mood: 'dread', lid: 0.1, lk: [0, 0], arms: { l: [-150, 300, 'open'], r: [150, 300, 'open'] } } });
    stamp('WHAT WOULD YOU DO?', t, C4.what, 760, 170, 80, 2630); },
  c4bottles(t, u) { const k = clamp((t - C4.bot - 0.8) / 1.2); cam(W / 2, 640, 1.2); nightWin(t, { drawer: 1 - k, bottles: true, dee: { mood: '', arms: { l: [-150, 300, 'open'], r: [150, 300, 'open'] } } }); winL(); pop(); },
  c4leave(t, u) { const k = clamp(u / 4); cam(W / 2, 560, 1.15); nightWin(t, { dee: { x: lerp(980, 1500, k), y: lerp(470, 520, k), s: lerp(1.15, 0.55, k), flip: true, legs: 'run', mood: 'dread', arms: { l: [-120, 160, 'fist'], r: [150, 300, 'open'] } } }); winL(); pop(); },
  c4again(t, u) { SE(t, [1000, 540, 1.1 + u * 0.03], { shut: true, signOff: true, canopy: 0.3, tally: 12, extra: () => layer(() => dee({ x: 1700 + u * 30, y: 640, s: 0.3, t, flip: true, legs: 'run', arms: { l: [-150, 300, 'open'], r: [150, 300, 'open'] } }), { sx: 2, sy: 3, sb: 4 }),
    fn: () => { if (t > C4.alone - 0.3) for (let i = 0; i < 3; i++) cone(1850 + i * 60, 580, 1500 + i * 120, 760, 60, 'rgba(255,250,210,1)', 0.7); } }); },
  card15(t, u) { chapterCard(t, C4.card + 0.05, 15, 'THE PATTERN'); }
});
