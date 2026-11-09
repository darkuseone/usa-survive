/* Глава 1 — Day 1 (0:37–1:41): рассвет, дрожащие руки → проблема 1: инвентарь → вода FEMA → 19 дней → вывеска-«звонок к ужину» → рубильник → баррикада задней двери → правила ночной смены. */
const C1 = { s: LS('c1_01'), hands: WW('c1_01', /^your/i), p1: LS('c1_02'), inv: LS('c1_03'), invM: [WW('c1_03', /^Six/i), WW('c1_03', /^Four/i), WW('c1_03', /^Two/i), WW('c1_03', /^One/i), WW('c1_03', /^coffee/i)],
  water: LS('c1_04'), nine: LS('c1_05'), sign: LS('c1_06'), dinner: WW('c1_06', /^dinner/i), breaker: LS('c1_07'), dies: WW('c1_07', /^dies/i), shelf: LS('c1_07b'), rule: LS('c1_08'),
  ruleM: [WW('c1_08', /^lights/i), WW('c1_08', /^noise/i), WW('c1_08', /^nobody/i)], card: LE('c1_08') + 0.1 };
DAYS.push([C1.s - 0.1, 1, '06:12 AM']);
SHAKES.push([C1.dies, 0.25, 6]);
function rulesSign(t, marks, n = 3, extra) {                // листок «правила ночной смены» на скотче на жалюзи
  bg('#8e949a', 2300); for (let y = 0; y < H; y += 30) { stroke([[0, y], [W, y]], '#6c7278', 4, { smooth: false }); stroke([[0, y - 8], [W, y - 8]], '#b0b6bb', 2, { smooth: false, a: 0.7 }); }
  push(W / 2, 540, 1, -0.02); card(0, 0, 1000, 820, 0, 2301, '#fbf7e8'); txt('NIGHT SHIFT RULES', 0, -320, 66, { font: 'Hand', weight: 700, col: '#c8241c' }); stroke([[-360, -280], [360, -276]], '#c8241c', 4);
  const L = ['1. No lights.', '2. No noise.', '3. Nobody comes in.', '4. Silence never runs out.'];
  for (let i = 0; i < n; i++) { const k = clamp((t - marks[i]) / 0.5); if (k <= 0) continue; ctx.save(); ctx.beginPath(); ctx.rect(-420, -200 + i * 130 - 50, 900 * k, 100); ctx.clip(); txt(L[i], -380, -200 + i * 130, 76, { font: 'Hand', weight: 700, col: '#1c1512', align: 'left' }); ctx.restore(); }
  pop(); tape(W / 2 - 430, 150, 160, -0.5, 2302); tape(W / 2 + 430, 140, 160, 0.45, 2303); if (extra) extra();
}
SHOTS.push([C1.s - 0.1, 'c1dawn', 'dip'], [C1.hands - 0.1, 'c1hands'], [C1.p1 - 0.1, 'c1count'], [C1.inv - 0.1, 'invIns', 'whip'], [C1.water - 0.1, 'waterIns'], [C1.nine - 0.1, 'nineIns', 'flash'],
  [C1.sign - 0.1, 'c1sign', 'tear'], [C1.dinner - 0.6, 'c1signZ'], [C1.breaker - 0.1, 'c1breaker'], [C1.dies - 0.1, 'c1signOff'], [C1.shelf - 0.1, 'c1shelf'], [C1.rule - 0.1, 'c1rule', 'whip'], [C1.card, 'card3', 'tear']);
Object.assign(SH, {
  c1dawn(t, u) { SD(t, [1000, 560, 1.05 + u * 0.03], { shafts: 1, slits: 0.9, amb: '#626884', crate: 980, tally: 1,
    j: { P: { x: 980, y: 1000 - 220 - 345 * 0.95 }, legs: 'sit', mood: 'dread', lid: 0.2, lk: [0, 0.3], arms: { l: [-90 + jit(t, 5), 180, 'fist'], r: [90 + jit(t + 1, 5), 170, 'fist'] }, bob: jit(t, 2) } }); },
  c1hands(t, u) { SD(t, [980, 520, 1.9 + u * 0.03], { shafts: 1, slits: 0.9, amb: '#626884', crate: 980,
    j: { P: { x: 980, y: 1000 - 220 - 345 * 0.95 }, legs: 'sit', mood: 'dread', lid: 0.1, lk: [0, 0.6], sweat: 1, arms: { l: [-60 + jit(t, 8), 120 + jit(t + 2, 6), 'open'], r: [60 + jit(t + 1, 8), 110 + jit(t + 3, 6), 'open'] } } }); },
  c1count(t, u) { const x = lerp(560, 720, clamp(u / 5)); SD(t, [700, 600, 1.45], { shafts: 0.8, slits: 0.6, amb: '#626884', lantern: [x - 170, 640],
    j: { P: { x }, flip: true, lk: [0.7, 0.1], mood: '', arms: { l: [-140, 150, 'fist'], r: [190, 170, 'fist'] }, clip: true, lantern: true } });
    stamp('PROBLEM 1', t, C1.p1 + 0.1, 520, 180, 110, 2310); },
  invIns(t, u) { inventory(t, C1.inv, C1.invM); },
  waterIns(t, u) { waterFact(t, C1.water); },
  nineIns(t, u) { nineteen(t, C1.nine); },
  c1sign(t, u) { SE(t, [1000, 480, 1.0 + u * 0.05], { shut: true, tally: 1, zom: false }); },
  c1signZ(t, u) { const k = clamp(u / 3); SE(t, [1140, 470, 1.9 + u * 0.03], { shut: true, extra: () => { for (let i = 0; i < 4; i++) zSil(1500 + i * 110 - k * 260, 640 + (i % 2) * 20, 0.34, t, i + 3); } });
    stamp('DINNER BELL', t, C1.dinner, W / 2, 180, 110, 2311); },
  c1breaker(t, u) { const pull = t > C1.dies - 0.25; SB(t, [540, 400, 1.45], { bulb: pull ? 0.2 : 1, noDesk: true,
    j: { P: { x: 620, y: 1000 - 508 * 0.95 }, flip: true, lk: [0.7, -0.6], mood: 'dread', arms: { l: [-150, 300, 'open'], r: [230, pull ? -110 : -170, 'fist'] } } }); },
  c1signOff(t, u) { SE(t, [1140, 470, 1.9], { shut: true, signOff: true, canopy: 0.6, extra: () => { for (let i = 0; i < 4; i++) zSil(1240 + i * 110, 640 + (i % 2) * 20, 0.34, t * 0.2, i + 3); } }); },
  c1shelf(t, u) { const k = sm(clamp(u / 3.6)), sx = lerp(1780, 1230, k);
    SB(t, [1300, 600, 1.15], { blocked: k, j: { P: { x: sx + 230 }, flip: true, lean: -0.22, legs: u < 3.6 ? 'run' : 'stand', mood: 'angry', lk: [0.8, 0], arms: { l: [-120, 160, 'fist'], r: [150, 150, 'fist'] } } }); },
  c1rule(t, u) { rulesSign(t, C1.ruleM, 3); },
  card3(t, u) { chapterCard(t, C1.card + 0.05, 3, 'THE HUM STOPS'); }
});
