/* Главы 4.5 и 5 — Day 15 (4:26–5:00) и Day 19 (5:00–6:13): скука → наблюдение в щель → блокнот → «прилив» в 6 вечера → громкий звук побеждает → последняя бутылка → бойлер FEMA →
   слив воды → ошибка (стеллажи у двери) → 3 утра, щелчок → один внутри → бег в морозилку → пар и скрежет → трубка и динамики колонок → приманка → дверь завалена → округ услышал. */
const C45 = { s: LS('c45_01'), watch: WW('c45_01', /^watch/i), nb: LS('c45_02'), nbM: [WW('c45_03', /^see/i), WW('c45_03', /^follow/i), WW('c45_03', /^every/i)], tide: LS('c45_04'), loud: LS('c45_05'), loudW: WW('c45_05', /^loudest/i), card: LE('c45_05') + 0.1 };
const C5 = { s: LS('c5_01'), but: LS('c5_02'), fema: WW('c5_02', /^FEMA/i), drain: LS('c5_03'), open: WW('c5_03', /^open/i), laugh: WW('c5_03', /^laugh/i), mis: LS('c5_04'), drag: WW('c5_04', /^dragged/i), never: WW('c5_04', /^never/i),
  click: LS('c5_05'), clicks: WW('c5_05', /^clicks/i), inside: LS('c5_06'), run: LS('c5_07'), pull: WW('c5_07', /^pull/i), shut: WW('c5_07', /^shut/i), fog: LS('c5_08'), hs: LS('c5_09'), press: LS('c5_10'), bang: WW('c5_10', /^bang/i),
  out: LS('c5_11'), sprint: WW('c5_11', /^sprint/i), slam: WW('c5_11', /^slam/i), bury: WW('c5_11', /^bury/i), county: LS('c5_12'), card: LE('c5_12') + 0.1 };
DAYS.push([C45.s - 0.1, 15, '02:20 PM'], [C45.tide - 0.1, 15, '06:00 PM'], [C5.s - 0.1, 19, '09:15 PM'], [C5.click - 0.1, 19, '03:00 AM']);
SHAKES.push([C5.shut, 0.35, 14], [C5.bang, 0.25, 10], [C5.bang + 0.45, 0.25, 10], [C5.slam, 0.4, 18]);
function peekIns(t) {                                        // взгляд в щель жалюзи: снаружи бредут фигуры
  ctx.save(); ctx.beginPath(); ctx.rect(0, 420, W, 220); ctx.clip(); cam(900, 640, 1.6); exterior(t, { noJoe: true, shut: true, signOff: true, canopy: 0.2, extra: () => { for (let i = 0; i < 8; i++) zSil(((t * 40 + i * 260) % 2000) - 100, 650 + (i % 2) * 20, 0.34, t, i); } }); extLight(t, { amb: '#6a6880' }); pop(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 420); ctx.rect(0, 640, W, H - 640); ctx.clip(); shutterBg(2700); ctx.restore(); rectP(-20, 410, W + 40, 16, '#5c6168', { seed: 2701, lw: 2 }); rectP(-20, 636, W + 40, 16, '#5c6168', { seed: 2702, lw: 2 });
}
function bottleIns(t, c) { bg('#1c1a18', 2710); lightmap('#5a5e74', () => lanternGlow(W / 2, 700, 0.9));
  const sh = jit(t, 0.08); push(W / 2, 470, 2.2, Math.PI + sh); bottle(0, 0, 1, 0, 0); pop(); const k = clamp((t - c - 1.2) / 0.5); if (k > 0 && k < 1) drop(W / 2, 640 + k * 300, 1.2, 2711);
  stamp('0 BOTTLES', t, c + 1.6, W / 2, 900, 110, 2712); }
function handsetIns(t, c) { paperBg(2720); push(560, 560, 2.6, -0.15); handset(0, 0, 1); pop(); stroke([[760, 560], [960, 520], [1150, 540]], '#1c1512', 8);
  push(1350, 560, 1.8); rectP(-20, -60, 40, 300, '#8e949a', { seed: 2721, lw: 2 }); piece([[-90, -120], [0, -170], [0, -20], [-90, -60]], '#5c6168', { seed: 2722, lw: 2.4 }); pop();
  if (t > c + 2.2) { push(1500, 260, 1, 0.03); card(0, 0, 520, 130, 0, 2723, '#fbfaf6'); txt('"PUMP 4 IS READY"', 0, 4, 46, { font: 'Hand', weight: 700, col: '#1c1512' }); pop(); }
  for (let i = 0; i < 3; i++) { const q = ((t - c) * 0.8 + i / 3) % 1; ellP(1260, 420, 40 + q * 220, 30 + q * 180, 'rgba(0,0,0,0)', { raw: true, tex: false, lw: 5, lc: '#f2c230', a: (1 - q) * clamp((t - c - 2.2) * 2) }); } }
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
  c45tide(t, u) { SE(t, [960, 600, 1.05 + u * 0.03], { shut: true, signOff: true, canopy: 0.2, amb: '#7a6a80', rainA: 0.4, tally: 15, extra: () => { for (let i = 0; i < 20; i++) zSil(((t * 70 + i * 120) % 2600) - 400, 790 + (i % 3) * 18, 0.34, t, i); } });
    stamp('6 PM', t, C45.tide + 0.3, 330, 190, 110, 2730); },
  notebook2Ins(t, u) { notebook(t, [0, 0, 0, C45.loudW - 0.1]); },
  card19(t, u) { chapterCard(t, C45.card + 0.05, 19, 'THE MISTAKE'); },
  c5bottle(t, u) { bottleIns(t, C5.s); },
  c5think(t, u) { SD(t, [980, 490, 1.8 + u * 0.03], { slits: 0.2, amb: '#5a5e74', lantern: [1180, 700], crate: 980, j: { P: { x: 980, y: 1000 - 220 - 345 * 0.95 }, legs: 'sit', mood: '', lk: [0.5, -0.8], smile: 0.2, arms: { l: [-90, 180, 'fist'], r: [90, 170, 'fist'] } } }); },
  heaterIns(t, u) { heaterFact(t, C5.fema); },
  c5drain(t, u) { const k = clamp((t - C5.open) / 2.5), la = t > C5.laugh - 0.2, turn = t < C5.open + 0.6 ? Math.sin(step(t, 12) * 7) * 30 : 0;
    SB(t, [800, 680, 1.45], { bulb: 0, lantern: [960, 900], blocked: 0, drain: k,
      j: { P: { x: 880, y: 1000 - 220 - 345 * 0.95 + 40 }, legs: 'sit', flip: true, lk: [0.6, 0.7], mood: '', smile: la ? 0.9 : 0.2, arms: { l: [-120, 260, 'fist'], r: [180 + turn * 0.3, 330 + turn, 'fist'] } } },
      () => { lanternP(1000, 1000, 0.9); if (k > 0.3) bottle(720, 940, 0.9, 0, (k - 0.3) / 0.7); }); },
  c5mistake(t, u) { const k = sm(clamp((t - C5.drag) / 2)), sx = lerp(1230, 1780, k); SB(t, [1300, 600, 1.12], { bulb: 0.6, blocked: 1 - k, amb: '#6a5e70',
    j: k < 1 ? { P: { x: sx + 230 }, lean: 0.2, legs: 'run', mood: '', lk: [-0.8, 0], arms: { l: [-150, 150, 'fist'], r: [120, 160, 'fist'] }, flip: true } : null });
    if (t > C5.never) { cam(1300, 600, 1.12); ellP(1230, 660, 220, 360, 'rgba(0,0,0,0)', { raw: true, tex: false, lw: 10, lc: '#e0201a', a: clamp((t - C5.never) / 0.3) }); pop(); stamp('MISTAKE', t, C5.never + 0.2, 420, 190, 130, 2740); } },
  c5click(t, u) { const d = 0.25 * sm(clamp((t - C5.clicks) / 1.2)); SB(t, [1230, 620, 1.3 + u * 0.05], { bulb: 0, amb: '#5a5e74', door: d, blocked: 0, zDoor: () => zSil(1300, 560, 0.6, t, 3, '#1c2228') }); },
  c5inside(t, u) { SD(t, [1000, 580, 1.25], { slits: 0.2, amb: '#5a5e74', lantern: [1500, 620], z: { x: 700, s: 0.95, y: 1000 - 508 * 0.95, legs: 'run', t },
    j: { P: { x: 1350 }, mood: 'shock', scream: 0.5, sweat: 1, lk: [-0.9, 0], arms: { l: [-150, 300, 'open'], r: [180, 130, 'fist'] }, lantern: true } }); },
  c5run(t, u) { const k = clamp(u / 2.4), x = lerp(1400, 300, k); SD(t, [lerp(1200, 500, k), 600, 1.3], { slits: 0.2, amb: '#5a5e74', lantern: [x + 160, 620], z: { x: x + 600, s: 0.95, y: 1000 - 508 * 0.95, legs: 'run', t },
    j: { P: { x }, flip: true, legs: 'run', lean: -0.18, mood: 'shock', scream: 0.8, lk: [0.9, 0], arms: { l: [-170, 120, 'fist'], r: [170, 150, 'fist'] }, lantern: true } }); },
  c5hold(t, u) { SQ(t, [420, 600, 1.45], { scratch: t > C5.shut, lantern: [700, 900], j: { P: { x: 560 }, flip: true, lean: -0.15, mood: 'angry', lk: [0.9, 0], sweat: 1, arms: { l: [-150, 160, 'fist'], r: [200, 140, 'fist'] } } }, () => lanternP(700, 1000, 0.9)); },
  c5fog(t, u) { SQ(t, [560, 500, 2.0 + u * 0.03], { scratch: true, amb: '#5a6078', lantern: [700, 900], j: { P: { x: 560 }, mood: 'dread', lid: 0, lk: [-0.9, 0], sweat: 1, arms: { l: [-120, 160, 'fist'], r: [120, 160, 'fist'] } } }, () => puffs(t, 600, JP.y + 70, 4)); },
  handsetIns(t, u) { handsetIns(t, C5.hs); },
  c5bang(t, u) { const b = (t > C5.bang && Math.floor((t - C5.bang) / 0.45) % 2 === 0); SQ(t, [500, 560, 1.5], { scratch: true, lantern: [700, 900],
    j: { P: { x: 560 }, flip: true, mood: 'angry', lk: [0.9, -0.2], arms: { l: [-150, 160, 'fist'], r: [b ? 260 : 190, b ? 40 : 100, 'fist'] }, handset: true, handsetRot: b ? -0.8 : -0.3 } }); },
  c5speaker(t, u) { SE(t, [760, 360, 1.6], { shut: true, signOff: true, canopy: 0.2, extra: () => { push(760, 290); piece([[-60, -40], [0, -80], [0, 40], [-60, 10]], '#5c6168', { seed: 2750, lw: 2.4 }); pop();
    for (let i = 0; i < 4; i++) { const q = ((t - C5.bang) * 0.9 + i / 4) % 1; ellP(700, 270, 40 + q * 600, 30 + q * 380, 'rgba(0,0,0,0)', { raw: true, tex: false, lw: 6, lc: '#f2c230', a: 1 - q }); } } }); stamp('BANG! BANG!', t, C5.bang + 0.95, 1200, 860, 110, 2751); },
  c5out(t, u) { const k = clamp(u / 2.6); SB(t, [1150, 600, 1.2], { bulb: 0, amb: '#5a5e74', door: 1, blocked: 0, lantern: [600, 900], z: { x: lerp(900, 1240, k), s: lerp(0.95, 0.7, k), y: lerp(1000 - 508 * 0.95, 560, k), legs: 'run', t, flip: true } }); },
  c5slam(t, u) { const k = clamp(u / 0.9), d = t < C5.slam ? 1 : 1 - sm(clamp((t - C5.slam) / 0.25)), bl = sm(clamp((t - C5.bury) / 1.5)); SB(t, [1150, 600, 1.15], { bulb: 0, amb: '#5a5e74', door: d, blocked: bl, lantern: [600, 900],
    j: { P: { x: lerp(500, 1000 + bl * 300, k) }, legs: k < 1 || (bl > 0 && bl < 1) ? 'run' : 'stand', mood: 'angry', lean: 0.15, lk: [0.9, 0], arms: { l: [-120, 160, 'fist'], r: [170, 120, 'fist'] } } }); },
  county2Ins(t, u) { convergeMap(t, C5.county, { n: 60, rings: true, label: 'THE WHOLE COUNTY HEARD', dur: 5 }); },
  card24(t, u) { chapterCard(t, C5.card + 0.05, 24, 'HEADLIGHTS'); }
});
