/* Глава 3 — Day 7 (2:39–3:31): сигнализация → «звонок» на всю округу → сорок у жалюзи → 6000 фунтов, болты → ошибки (паника, шум, бег) → тишина 11 часов → правило 4 → расходятся → стук в окно ночью 12-го дня. */
const C3 = { s: LS('c3_01'), some: WW('c3_02', /^something/i), every: WW('c3_02', /^everything/i), sun: LS('c3_03'), w: LS('c3_03b'), bends: WW('c3_03b', /^bends/i), pops: WW('c3_03b', /^pops/i), another: WW('c3_03b', /^another/i),
  dont: LS('c3_04'), dM: [WW('c3_04', /^panic/i), WW('c3_04', /^noise/i), WW('c3_04', /^run/i)], hide: LS('c3_05'), eleven: WW('c3_05', /^eleven/i), rule: LS('c3_06'), sil: WW('c3_06', /^silence/i),
  drift: LS('c3_07'), knockS: WW('c3_07', /^someone/i), kn: [WW('c3_07', /^knocks/i), WW('c3_07', /^knock\b/i), WW('c3_07', /^times/i)], card: LE('c3_07') + 0.1 };
DAYS.push([C3.s - 0.1, 7, '04:40 AM'], [C3.sun - 0.1, 7, '06:31 AM'], [C3.drift - 0.1, 7, '08:10 PM'], [C3.knockS - 0.2, 12, '01:12 AM']);
SHAKES.push([C3.bends, 0.4, 10], [C3.pops, 0.3, 16], [C3.another, 0.3, 18], ...C3.kn.map(k => [k, 0.2, 10]));
function horde(t, n, y0 = 650, press = 0) { for (let i = 0; i < n; i++) { const r = rng(2500 + i), x = 380 + r() * 1000, y = y0 + (i % 4) * 26 + r() * 20; zSil(x + Math.sin(step(t, 8) + i) * 6 * press, y, 0.3 + (i % 4) * 0.03, t, i, mix('#3a4636', '#1c2228', (i % 4) / 4)); } }
function shutterBg(seed = 2510) { bg('#8e949a', seed); for (let y = 0; y < H; y += 30) { stroke([[0, y], [W, y]], '#6c7278', 4, { smooth: false }); stroke([[0, y - 8], [W, y - 8]], '#b0b6bb', 2, { smooth: false, a: 0.7 }); } }
function boltsAt(t) { [[300, 960], [1620, 960]].forEach(([x, y], i) => { const t0 = i ? C3.another : C3.pops, k = clamp((t - t0) / 0.6);
  if (k <= 0) { ellP(x, y, 16, 16, '#5c6168', { seed: 2520 + i, lw: 2 }); return; } const bx = x + (i ? 1 : -1) * k * 260, by = y - Math.sin(k * Math.PI) * 220 + k * 40; push(bx, by, 1, k * 12); rectP(-14, -6, 28, 12, '#5c6168', { seed: 2522 + i, lw: 1.6 }); pop(); }); }
SHOTS.push([C3.s - 0.1, 'c3alarm', 'dip'], [C3.some - 0.1, 'c3bump'], [C3.every - 0.1, 'ringIns', 'whip'], [C3.sun - 0.1, 'c3horde', 'flash'], [C3.w - 0.1, 'weightIns'], [C3.bends - 0.3, 'c3bend'],
  [C3.dont - 0.1, 'dontIns', 'whip'], [C3.hide - 0.1, 'c3hide'], [C3.rule - 0.1, 'c3rule', 'whip'], [C3.drift - 0.1, 'c3drift', 'dip'], [C3.knockS - 0.2, 'c3knock'], [C3.card, 'card12', 'tear']);
const alarmFx = t => () => { const on = Math.floor(t * 3) % 2 === 0; if (on) { radial(1350, 820, 600, 'rgba(255,170,40,1)', 0.8); radial(1640, 800, 400, 'rgba(255,250,220,1)', 0.6); } };
Object.assign(SH, {
  c3alarm(t, u) { SE(t, [1100, 560, 1.15 + u * 0.03], { shut: true, signOff: true, canopy: 0.3, tally: 7, fn: alarmFx(t), extra: () => layer(() => zombie({ x: 1080, y: 560, s: 0.5, t, v: 1, legs: 'run', tilt: 0.3 }), { sx: 3, sy: 4, sb: 5 }) }); },
  c3bump(t, u) { SE(t, [1250, 720, 2.0 + u * 0.04], { shut: true, signOff: true, canopy: 0.3, fn: alarmFx(t), extra: () => layer(() => zombie({ x: 1120 + u * 20, y: 560, s: 0.5, t, v: 1, legs: 'run', tilt: 0.35, arms: { l: [-150, 160, 'open'], r: [200, 140, 'open'] } }), { sx: 3, sy: 4, sb: 5 }) }); },
  ringIns(t, u) { convergeMap(t, C3.every, { n: 40, rings: true, label: 'EVERYTHING WITHIN A MILE', dur: 5 }); },
  c3horde(t, u) { SE(t, [820, 560, 1.15 + u * 0.03], { shut: true, signOff: true, canopy: 0.2, amb: '#6e748e', rainA: 0.6, tally: 7, extra: () => horde(t, 40, 640, 1) }); stamp('40', t, C3.sun + 1.4, 300, 200, 180, 2530); },
  weightIns(t, u) { shutterBg(); stamp('6,000 LBS', t, C3.w + 1.2, W / 2, 420, 170, 2531); if (t > C3.w + 0.2) { for (let i = 0; i < 5; i++) { const x = 360 + i * 300, k = clamp((t - C3.w - 0.2 - i * 0.12) / 0.4); stroke([[x, 700], [x, 700 + 200 * k]], '#c8241c', 14); piece([[x - 34, 700 + 200 * k], [x + 34, 700 + 200 * k], [x, 760 + 200 * k]], '#c8241c', { raw: true, lw: 2 }); } }
    txt('against ONE sheet of steel', W / 2, 1010, 44, { font: 'Hand', weight: 700, col: '#1c1512' }); },
  c3bend(t, u) { const b = 0.8 + 0.5 * Math.sin(step(t, 8) * 4); SD(t, [960, 620, 1.1], { bulge: b, slits: 0.6, amb: '#6a6e88', tally: 7,
    j: { P: { x: 1340, y: 600 }, behind: true, mood: 'shock', lid: 0, lk: [-0.9, -0.2], sweat: 1, arms: { l: [-150, 300, 'open'], r: [150, 300, 'open'] } } }, () => boltsAt(t)); },
  dontIns(t, u) { paperBg(2540); txt('MOST PEOPLE:', W / 2, 170, 70, { font: 'Inter Black', col: '#f3ecd8' });
    ['PANIC', 'MAKE NOISE', 'RUN'].forEach((s, i) => { const k = popK(t, C3.dM[i] - 0.1, 0.3); if (k <= 0) return; push(400 + i * 560, 560, k, (i - 1) * 0.04); card(0, 0, 460, 300, 0, 2541 + i, '#f3ecd8'); txt(s, 0, 0, 70, { font: 'Inter Black', col: '#1c1512' }); stampX(0, 0, 1.4, clamp((t - C3.dM[i] - 0.25) / 0.25)); pop(); }); },
  c3hide(t, u) { SD(t, [1300, 600, 1.7 + u * 0.03], { slits: 0.4, amb: '#5c6078', bulge: 0.4,
    j: { P: { x: 1340, y: 610 }, behind: true, mood: 'dread', lid: 0, lk: [-0.8, -0.3], sweat: 1, arms: { l: [-150, 300, 'open'], r: [150, 300, 'open'] } } });
    if (t > C3.eleven - 0.6) { push(330, 300); clockP(0, 0, 140, 0, (t - C3.eleven + 0.6) * 1800, 0); pop(); stamp('11 HOURS', t, C3.eleven, 330, 520, 90, 2550); } },
  c3rule(t, u) { rulesSign(t, [0, 0, 0, C3.sil - 0.2], 4); },
  c3drift(t, u) { const k = clamp(u / 3.6); SE(t, [820, 560, 1.15], { shut: true, signOff: true, canopy: 0.2, amb: '#6a6080', rainA: 0.6, tally: 7, extra: () => horde(t, Math.round(lerp(40, 1, k)), 640, 0.5) }); },
  c3knock(t, u) { const kk = C3.kn.filter(k => t > k).length; cam(W / 2, H / 2, 1.15, 0, shakeAt(t)); nightWin(t, { dee: { mood: 'dread', arms: { l: [-150, 300, 'open'], r: [170, -20, 'fist'] }, pal: { top: '#2a2c34', topD: '#1c1e24', skin: '#3a3440', skinD: '#2a2430', hair: '#1c1a1c' } } });
    lightmap('#5a5e74', () => radial(960, 900, 600, 'rgba(255,200,120,1)', 0.25)); pop();
    for (let i = 0; i < kk; i++) stamp('KNOCK', t, C3.kn[i], 380 + i * 580, 160 + (i % 2) * 40, 110, 2560 + i, (i - 1) * 0.05); },
  card12(t, u) { chapterCard(t, C3.card + 0.05, 12, 'THE NIGHT WINDOW'); }
});
