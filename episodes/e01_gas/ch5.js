/* Главы 4.5 и 5 — Day 15 (4:26–5:00) и Day 19 (5:00–6:13): скука → наблюдение в щель → блокнот → «прилив» в 6 вечера → громкий звук побеждает → последняя бутылка → бойлер FEMA →
   слив воды → ошибка (стеллажи у двери) → 3 утра, щелчок → один внутри → бег в морозилку → пар и скрежет → трубка и динамики колонок → приманка → дверь завалена → округ услышал. */
const C45 = { s: LS('c45_01'), watch: WW('c45_01', /^watch/i), nb: LS('c45_02'), nbM: [WW('c45_03', /^see/i), WW('c45_03', /^follow/i), WW('c45_03', /^every/i)], tide: LS('c45_04'), loud: LS('c45_05'), loudW: WW('c45_05', /^loudest/i), card: LE('c45_05') + 0.1 };
const C5 = { s: LS('c5_01'), but: LS('c5_02'), fema: WW('c5_02', /^FEMA/i), drain: LS('c5_03'), open: WW('c5_03', /^open/i), laugh: WW('c5_03', /^laugh/i), mis: LS('c5_04'), drag: WW('c5_04', /^dragged/i), never: WW('c5_04', /^never/i),
  click: LS('c5_05'), clicks: WW('c5_05', /^clicks/i), inside: LS('c5_06'), run: LS('c5_07'), pull: WW('c5_07', /^pull/i), shut: WW('c5_07', /^shut/i), fog: LS('c5_08'), hs: LS('c5_09'), press: LS('c5_10'), bang: WW('c5_10', /^bang/i),
  out: LS('c5_11'), sprint: WW('c5_11', /^sprint/i), slam: WW('c5_11', /^slam/i), bury: WW('c5_11', /^bury/i), county: LS('c5_12'), card: LE('c5_12') + 0.1 };
DAYS.push([C45.s - 0.1, 15, '02:20 PM'], [C45.tide - 0.1, 15, '06:00 PM'], [C5.s - 0.1, 19, '09:15 PM'], [C5.click - 0.1, 19, '03:00 AM']);
SHAKES.push([C5.shut, 0.35, 14], [C5.bang, 0.25, 10], [C5.bang + 0.45, 0.25, 10], [C5.slam, 0.4, 18]);
function peekIns(t) {                                        // взгляд в отогнутую щель жалюзи: снаружи, в упор, бредут они
  bg('#18203a', 2700); rectP(-100, 620, W + 200, 300, '#30343e', { seed: 2705, line: false }); rectP(1500, 330, 180, 330, '#c8342c', { seed: 2706, lw: 2.6, shade: () => rectP(1500, 330, 180, 60, '#f3ecd8', { raw: true, line: false }) });
  walkers(t, 9, { seed: 3230, x: (i, q, d) => ((t * 46 * (0.7 + d * 0.6) + q * 2600) % 2700) - 400, y0: 860, y1: 1010, s0: 0.85, s1: 1.15, dim0: 0.3 });
  rainOut(t, 300, 720, 1.2); lightmap('#6a6880', () => radial(960, 300, 1400, 'rgba(200,190,230,1)', 0.5));
  ctx.save(); const top = [], bot = []; for (let x = -20; x <= W + 20; x += 60) { top.push([x, 372 + Math.sin(x * 0.011) * 26 + (hsh(x) % 9)]); bot.push([x, 700 - Math.sin(x * 0.009 + 1) * 22 - (hsh(x, 3) % 9)]); }
  const drawPart = (pts, y0) => { ctx.save(); ctx.beginPath(); ctx.moveTo(-20, y0); pts.forEach(p => ctx.lineTo(p[0], p[1])); ctx.lineTo(W + 20, y0); ctx.closePath(); ctx.clip(); shutterBg(2700); ctx.restore(); };
  drawPart(top, -20); drawPart(bot, H + 20); ctx.restore(); stroke(top, '#3a4048', 10, { smooth: false }); stroke(bot, '#3a4048', 10, { smooth: false }); stroke(top.map(p => [p[0], p[1] - 9]), '#d0d6da', 3, { smooth: false, a: 0.7 });
  push(250, 720, 2.0, 0.5); blobP([[-30, -10], [30, -10], [34, 26], [0, 38], [-34, 26]], JOE.pal.skin, { seed: 2707, lw: 2.4 }); for (let q = -1; q <= 1; q++) stroke([[q * 14, -8], [q * 15, -34]], JOE.pal.skin, 13); pop();    // пальцы Joe отгибают ламель
}
function bottleIns(t, c) { bg('#1c1a18', 2710); const sh = jit(t, 0.05), k = clamp((t - c - 1.2) / 0.5);
  push(W / 2 + 40, 420, 1, 0.5 + sh); piece(tube([[520, 300], [260, 150], [60, 30]], 110, 96).pts, JOE.pal.top, { raw: true, lw: 3 }); piece([[20, -40], [110, 10], [80, 70], [-10, 20]], JOE.pal.topD, { raw: true, lw: 2.4 });
  blobP([[-70, -60], [50, -70], [70, 40], [-10, 80], [-80, 30]], JOE.pal.skin, { seed: 2713, lw: 3 }); pop();
  push(W / 2 - 60, 400, 2.6, Math.PI + 0.35 + sh); bottle(0, 0, 1, 0, 0); pop(); for (let q = 0; q < 3; q++) stroke([[W / 2 - 10 + q * 30, 330], [W / 2 + q * 30, 392]], JOE.pal.skin, 26);
  if (k > 0 && k < 1) drop(W / 2 - 128, 600 + k * 260, 1.3, 2711); if (k >= 1) { ellP(W / 2 - 128, 880, 30 + (t - c - 1.7) * 20, 8, 'rgba(120,190,240,1)', { line: false, tex: false, a: 0.5 }); }
  lightmap('#5a5e74', () => lanternGlow(W / 2, 640, 0.95)); stamp('0 BOTTLES', t, c + 1.6, 470, 300, 110, 2712, -0.04); }
function handsetIns(t, c) {                                  // трубка кассира → провод → динамик на столбе навеса
  paperBg(2720); const on = t > c + 2.2, tw = Math.sin(step(t, 12) * 2) * 0.03;
  push(470, 620, 1, -0.18 + tw); piece(tube([[-420, 520], [-200, 260], [-40, 60]], 150, 130).pts, JOE.pal.top, { raw: true, lw: 3 }); piece([[-110, 60], [20, -10], [70, 70], [-60, 150]], JOE.pal.topD, { raw: true, lw: 2.4 });
  push(0, -40, 3.0); handset(0, 0, 1); pop(); blobP([[-150, -30], [-60, -60], [-40, 120], [-130, 150]], JOE.pal.skin, { seed: 2724, lw: 3 }); for (let q = 0; q < 4; q++) stroke([[70, -150 + q * 76], [150, -140 + q * 76]], JOE.pal.skin, 44); pop();
  const cord = []; for (let i = 0; i <= 40; i++) { const k = i / 40; cord.push([640 + k * 640, 880 - Math.sin(k * Math.PI) * 120 + Math.sin(k * 40) * 14]); } stroke(cord, '#1c1512', 7, { smooth: false });
  push(1440, 620); rectP(-22, -330, 44, 760, '#d9d4c4', { seed: 2721, lw: 2.4 }); rectP(-260, -420, 820, 60, '#e7e3d6', { seed: 2725, lw: 2.4, shade: () => rectP(-260, -384, 820, 24, '#c8342c', { raw: true, line: false }) });
  push(-70, -200, 1, -0.1); piece([[60, -40], [-60, -110], [-60, 110], [60, 40]], '#5c6168', { seed: 2722, lw: 3, shade: () => { for (let q = -2; q <= 2; q++) stroke([[-50, q * 36], [50, q * 14]], '#3a3d42', 3); } }); rectP(60, -30, 40, 60, '#3a3d42', { seed: 2726, lw: 2 }); pop(); pop();
  for (let i = 0; i < 4; i++) { const q = ((t - c) * 0.8 + i / 4) % 1; ellP(1280, 420, 60 + q * 300, 46 + q * 240, 'rgba(0,0,0,0)', { raw: true, tex: false, lw: 6, lc: '#f2c230', a: (1 - q) * (on ? 1 : 0.25) }); }
  if (on) { push(920, 250, popK(t, c + 2.2, 0.3), -0.04); card(0, 0, 620, 150, 0, 2723, '#fbfaf6'); txt('"PUMP 4 IS READY"', 0, 6, 62, { font: 'Hand', weight: 700, col: '#1c1512' }); pop(); tape(920, 176, 130, 0.08, 2727); }
}
SHOTS.push([C45.s - 0.1, 'c45bored', 'dip'], [C45.watch - 0.1, 'peekIns'], [C45.nbM[0] - 0.8, 'notebookIns', 'whip'], [C45.tide - 0.1, 'c45tide', 'whip'], [C45.loud - 0.1, 'notebook2Ins'], [C45.card, 'card19', 'tear'],
  [C5.s - 0.1, 'c5bottle', 'dip'], [C5.but - 0.1, 'c5think'], [C5.fema - 0.1, 'heaterIns', 'whip'], [C5.drain - 0.1, 'c5drain', 'tear'], [C5.mis - 0.1, 'c5mistake', 'flash'], [C5.click - 0.1, 'c5click', 'dip'],
  [C5.inside - 0.1, 'c5inside'], [C5.run - 0.1, 'c5run'], [C5.pull - 0.2, 'c5hold'], [C5.fog - 0.1, 'c5fog'], [C5.hs - 0.1, 'handsetIns', 'whip'], [C5.press - 0.1, 'c5bang'], [C5.bang + 0.9, 'c5speaker'],
  [C5.out - 0.1, 'c5out'], [C5.sprint - 0.1, 'c5slam'], [C5.county - 0.1, 'county2Ins', 'whip'], [C5.card, 'card24', 'tear']);
Object.assign(SH, {
  c45bored(t, u) { const by = Math.abs(Math.sin(step(t, 12) * 2.4)) * 160; SD(t, [980, 560, 1.15 + u * 0.03], { shafts: 0.8, slits: 0.8, amb: '#646a86', crate: 980, tally: 15,
    j: { P: { x: 980, y: 1000 - 220 - 345 * 0.95 }, legs: 'sit', mood: 'sleepy', lid: 0.5, lk: [0, -0.6], arms: { l: [-150, 300, 'open'], r: [160, 120 - by * 0.3, 'open'] } } },
    () => chips(980 + 160 * 0.95, 1000 - 220 - 345 * 0.95 - 40 - by, step(t, 12) * 3, 0.9)); },
  peekIns(t, u) { peekIns(t); },
  notebookIns(t, u) { notebook(t, [...C45.nbM, 1e9]); },
  c45tide(t, u) { SE(t, [960, 640, 1.08 + u * 0.02], { shut: true, signOff: true, canopy: 0.2, amb: '#7a6a80', rainA: 0.4, tally: 15,
      extra: () => walkers(t, 22, { seed: 3240, x: (i, q, d) => ((t * 60 * (0.7 + d * 0.6) + q * 2700) % 2800) - 450, y0: 850, y1: 1040, s0: 0.5, s1: 0.86 }) }); stamp('6 PM', t, C45.tide + 0.3, 330, 250, 110, 2730); },
  notebook2Ins(t, u) { notebook(t, [0, 0, 0, C45.loudW - 0.1]); },
  card19(t, u) { chapterCard(t, C45.card + 0.05, 19, 'THE MISTAKE'); },
  c5bottle(t, u) { bottleIns(t, C5.s); },
  c5think(t, u) { SD(t, [980, 490, 1.8 + u * 0.03], { slits: 0.2, amb: '#5a5e74', lantern: [1180, 700], crate: 980, j: { P: { x: 980, y: 1000 - 220 - 345 * 0.95 }, legs: 'sit', mood: '', lk: [0.5, -0.8], smile: 0.2, arms: { l: [-90, 180, 'fist'], r: [90, 170, 'fist'] } } }); },
  heaterIns(t, u) { heaterFact(t, C5.fema); },
  c5drain(t, u) { const k = clamp((t - C5.open) / 2.5), la = t > C5.laugh - 0.2, turn = t < C5.open + 0.7 ? Math.sin(step(t, 12) * 7) * 22 : 0;                       // нагнулся к крану бойлера, крутит вентиль, вода бежит в бутылку
    SB(t, [800, 690, 1.45], { bulb: 0, lantern: [1010, 900], blocked: 0, drain: k,
      j: { P: { x: 900 }, flip: true, lean: la ? -0.12 : -0.3, lk: [0.7, 0.8], mood: '', smile: la ? 0.9 : 0.2, arms: { l: [60, 300, 'open'], r: la ? [170, 60, 'fist'] : [150 + turn * 0.2, 330 + turn * 0.4, 'fist'] }, bottle: la, bottleFill: 1 } },
      () => { lanternP(1030, 1000, 0.9); if (!la) bottle(718, 958, 0.9, 0, clamp((k - 0.15) / 0.8)); else for (let i = 0; i < 3; i++) stroke([[980 + i * 26, 400 - i * 10], [1000 + i * 30, 370 - i * 16]], '#fbfaf6', 5, { a: 0.7 }); }); },
  c5mistake(t, u) { const k = sm(clamp((t - C5.drag) / 2)), sx = lerp(1230, 1780, k), mv = k > 0 && k < 1, hv = mv ? Math.sin(step(t, 12) * 6) * 6 : 0;                 // днём раньше: отодвигает стеллаж от двери вправо, чтобы добраться до крана
    SB(t, [1300, 600, 1.12], { bulb: 0.6, blocked: 1 - k, amb: '#6a5e70',
      j: { P: { x: sx - (mv ? 335 : 300) }, lean: mv ? 0.2 : 0.06, legs: mv ? 'walk' : 'stand', gait: 6, stride: 32, mood: '', lk: [0.8, 0.2], arms: { l: [-150, 300, 'open'], r: [105, 150 - hv, 'open'], ...(mv ? { l: [96, 215 + hv, 'open'] } : {}) } } });
    if (t > C5.never) { cam(1300, 600, 1.12); ellP(1230, 660, 220, 360, 'rgba(0,0,0,0)', { raw: true, tex: false, lw: 10, lc: '#e0201a', a: clamp((t - C5.never) / 0.3) }); pop(); stamp('MISTAKE', t, C5.never + 0.2, 420, 190, 130, 2740); } },
  c5click(t, u) { const d = 0.25 * sm(clamp((t - C5.clicks) / 1.2)); SB(t, [1230, 620, 1.3 + u * 0.05], { bulb: 0, amb: '#5a5e74', door: d, blocked: 0, zDoor: () => zSil(1300, 560, 0.6, t, 3, '#1c2228') }); },
  c5inside(t, u) { SD(t, [1000, 580, 1.25], { slits: 0.2, amb: '#5a5e74', lantern: [1500, 620], z: { x: 700, s: 0.95, y: 1000 - 508 * 0.95, legs: 'run', t },
    j: { P: { x: 1350 }, mood: 'shock', scream: 0.5, sweat: 1, lk: [-0.9, 0], arms: { l: [-150, 300, 'open'], r: [180, 130, 'fist'] }, lantern: true } }); },
  c5run(t, u) { const k = clamp(u / 2.4), x = lerp(1400, 300, k); SD(t, [lerp(1200, 500, k), 600, 1.3], { slits: 0.2, amb: '#5a5e74', lantern: [x + 160, 620], z: { x: x + 600, s: 0.95, y: 1000 - 508 * 0.95, legs: 'run', t },
    j: { P: { x }, flip: true, legs: 'run', lean: -0.18, mood: 'shock', scream: 0.8, lk: [0.9, 0], arms: { l: [-170, 120, 'fist'], r: [170, 150, 'fist'] }, lantern: true } }); },
  c5hold(t, u) { const pull = Math.sin(step(t, 12) * 9) * 5; SQ(t, [420, 600, 1.45], { scratch: t > C5.shut, lantern: [760, 900], pre: () => lanternP(760, 1000, 0.9),                       // двумя руками держит ручку, откинувшись назад
      j: { P: { x: 590 }, flip: true, lean: 0.14, mood: 'angry', lk: [0.9, 0], sweat: 1, arms: { l: [205 + pull, 120, 'fist'], r: [215 + pull, 80, 'fist'] } } }); },
  c5fog(t, u) { SQ(t, [560, 500, 2.0 + u * 0.03], { scratch: true, amb: '#5a6078', lantern: [700, 900], j: { P: { x: 560 }, mood: 'dread', lid: 0, lk: [-0.9, 0], sweat: 1, arms: { l: [-120, 160, 'fist'], r: [120, 160, 'fist'] } } }, () => puffs(t, 600, JP.y + 70, 4)); },
  handsetIns(t, u) { handsetIns(t, C5.hs); },
  c5bang(t, u) { const b = (t > C5.bang && Math.floor((t - C5.bang) / 0.45) % 2 === 0); SQ(t, [500, 560, 1.5], { scratch: true, lantern: [700, 900],
    j: { P: { x: 560 }, flip: true, mood: 'angry', lk: [0.9, -0.2], arms: { l: [-150, 160, 'fist'], r: [b ? 260 : 190, b ? 40 : 100, 'fist'] }, handset: true, handsetRot: b ? -0.8 : -0.3 } }); },
  c5speaker(t, u) { SE(t, [760, 360, 1.6], { shut: true, signOff: true, canopy: 0.2, extra: () => { push(760, 290); piece([[-60, -40], [0, -80], [0, 40], [-60, 10]], '#5c6168', { seed: 2750, lw: 2.4 }); pop();
    for (let i = 0; i < 4; i++) { const q = ((t - C5.bang) * 0.9 + i / 4) % 1; ellP(700, 270, 40 + q * 600, 30 + q * 380, 'rgba(0,0,0,0)', { raw: true, tex: false, lw: 6, lc: '#f2c230', a: 1 - q }); } } }); stamp('BANG! BANG!', t, C5.bang + 0.95, 1300, 760, 100, 2751); },
  c5out(t, u) { const k = clamp(u / 2.6); SB(t, [1150, 600, 1.2], { bulb: 0, amb: '#5a5e74', door: 1, blocked: 0, lantern: [600, 900], z: { x: lerp(900, 1240, k), s: lerp(0.95, 0.7, k), y: lerp(1000 - 508 * 0.95, 560, k), legs: 'run', t, flip: true } }); },
  c5slam(t, u) { const k = clamp(u / 0.9), d = t < C5.slam ? 1 : 1 - sm(clamp((t - C5.slam) / 0.25)), bl = sm(clamp((t - C5.bury) / 1.5)); SB(t, [1150, 600, 1.15], { bulb: 0, amb: '#5a5e74', door: d, blocked: bl, lantern: [600, 900],
    j: { P: { x: lerp(500, 1000 + bl * 300, k) }, legs: k < 1 || (bl > 0 && bl < 1) ? 'run' : 'stand', mood: 'angry', lean: 0.15, lk: [0.9, 0], arms: { l: [-120, 160, 'fist'], r: [170, 120, 'fist'] } } }); },
  county2Ins(t, u) { convergeMap(t, C5.county, { n: 60, rings: true, label: 'THE WHOLE COUNTY HEARD', dur: 5 }); },
  card24(t, u) { chapterCard(t, C5.card + 0.05, 24, 'HEADLIGHTS'); }
});
