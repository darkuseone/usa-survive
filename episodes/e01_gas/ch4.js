/* Глава 4 — Day 12 (3:31–4:26): ночное окно → лоток на дюйм → Ди, руки вверх → фура → новости: стадион, 18 дней, 6 миль → проблема 4: люди → «что бы ты сделал?» → две бутылки через лоток → она уходит → «в следующий раз не одна». */
const C4 = { s: LS('c4_01'), b: LS('c4_01b'), slide: WW('c4_01b', /^slide/i), dee: LS('c4_02'), please: WW('c4_02', /^please/i), name: LS('c4_03'), news: WW('c4_03', /^news/i), map: LS('c4_04'),
  p4: LS('c4_05'), partner: WW('c4_05', /^partner/i), someone: WW('c4_05', /^someone/i), ask: LS('c4_06'), what: WW('c4_06', /^what/i), bot: LS('c4_07'), nods: WW('c4_07', /^nods/i), again: LS('c4_08'), alone: WW('c4_08', /^alone/i), card: LE('c4_08') + 0.1 };
const DEEDARK = { pal: { top: '#2a2c34', topD: '#1c1e24', skin: '#3a3440', skinD: '#2a2430', hair: '#1c1a1c', pants: '#1c1e24' }, capCol: '#1c2430' };
function semiScene(t) {                                      // сложившаяся фура на шоссе ночью
  bg('#141a2e', 2600); piece([[-100, 560], [400, 500], [900, 540], [1400, 480], [2000, 530], [2000, 700], [-100, 700]], '#0e1424', { seed: 2601 });
  rectP(-100, 690, W + 200, 420, '#2a2e38', { seed: 2602, line: false, shade: () => { for (let x = -100; x < W; x += 240) rectP(x, 860, 130, 12, '#d9d0a0', { raw: true, line: false, a: 0.6 }); } });
  push(1000, 760, 1, -0.32); rectP(-520, -230, 760, 230, '#cfd2d6', { seed: 2603, lw: 2.8, shade: () => { stroke([[-520, -120], [240, -120]], '#a9adb2', 4); txt('HAUL', -150, -110, 90, { font: 'Inter Black', col: '#3d6fa4' }); } });
  for (let i = 0; i < 3; i++) ellP(-420 + i * 120, 0, 44, 44, '#1c1512', { seed: 2604 + i }); pop();
  push(1360, 800, 1, 0.5); rectP(-60, -230, 240, 230, '#3d6fa4', { seed: 2607, lw: 2.8, shade: () => rectP(60, -200, 100, 90, '#9fb4c8', { raw: true, lw: 2 }) }); ellP(40, 0, 50, 50, '#1c1512', { seed: 2608 }); pop();
  const hz = Math.floor(t * 1.6) % 2 === 0; [[560, 700], [1500, 700]].forEach(([x, y], i) => ellP(x, y, 14, 10, hz ? '#ffb030' : '#5a3a10', { seed: 2609 + i, lw: 1.4, tex: false }));
  rainOut(t, -100, 1100, 1.3);
  lightmap('#5a5e74', () => { if (hz) { radial(560, 700, 300, 'rgba(255,170,40,1)', 0.7); radial(1500, 700, 300, 'rgba(255,170,40,1)', 0.7); } radial(1600, 620, 500, 'rgba(255,240,200,1)', 0.4); });
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
  c4crawl(t, u) { const k = clamp(u / 2.8); SD(t, [1250, 640, 1.6], { slits: 0.3, amb: '#5a5e74', j: { P: { x: lerp(1100, 1420, k), y: 640 }, behind: true, lean: 0.3, legs: 'run', mood: 'dread', lid: 0, lk: [0.9, -0.2], arms: { l: [-150, 300, 'open'], r: [150, 300, 'open'] } } }); },
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
