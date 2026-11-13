/* Глава 2 — Day 3 (1:41–2:39): гудение стихло → холодильники гаснут → тишина и сердце → проблема 3: еда на таймере (4 ч / 48 ч) → порядок еды → фонарь → морозильная камера → «эта комната спасёт тебе жизнь» → ночью их десятки. */
const C2 = { s: LS('c2_01'), stops: WW('c2_01', /^stops/i), fr: WW('c2_02', /^fridges/i), grid: WW('c2_02', /^grid/i), quiet: LS('c2_02b'), p3: LS('c2_03'), food: WW('c2_03', /^safety/i),
  eat: LS('c2_04'), eatM: [WW('c2_04', /^hot/i), WW('c2_04', /^sandwiches/i), WW('c2_04', /^chips/i)], lan: LS('c2_04b'), lanOn: WW('c2_04b', /^lantern/i), cool: LS('c2_05'), save: LS('c2_06'),
  night: LS('c2_07'), dozens: WW('c2_07', /^dozens/i), card: LE('c2_07') + 0.1 };
LT.push(C2.grid + 0.2);
DAYS.push([C2.s - 0.1, 3, '02:14 PM'], [C2.night - 0.1, 3, '11:40 PM']);
function SL(t, c, o = {}) {                                   // магазин с питанием (жалюзи опущены), lit 0..1
  cam(c[0], c[1], c[2], 0, shakeAt(t)); TT = t; store(t, { shut: 1, neonOff: true, lit: o.lit, door: 0, drops: false }); if (o.tally) tallyMarks(o.tally, 260, 380, 0.9);
  shelf(t); if (o.crate) crate(o.crate, 1000); if (o.j) J(t, o.j); counter(t, o); dust(t, 700, 400, 1400, 500, 20); storeLight({ lit: o.lit, neonOff: true, flick: o.flick }); pop();
}
function coolerFront(t, lit) {                               // стена стеклянных дверей с напитками со стороны магазина
  bg('#3a3d42', 2400); for (let i = 0; i < 4; i++) { const x = 160 + i * 410;
    rectP(x, 120, 380, 860, '#1c1f24', { seed: 2401 + i, lw: 3, shade: () => {
      for (let j = 0; j < 5; j++) { rectP(x + 10, 230 + j * 150, 360, 10, '#8e949a', { raw: true, line: false }); for (let q = 0; q < 9; q++) rectP(x + 20 + q * 39, 160 + j * 150, 30, 68, ['#d8342c', '#46b86a', '#3d7fc4', '#f2c230', '#f2731c'][(q + j + i) % 5], { raw: true, lw: 1.2, tex: false }); }
      piece([[x + 30, 120], [x + 90, 120], [x + 10, 980], [x - 50, 980]], 'rgba(255,255,255,0.08)', { raw: true, line: false, tex: false }); } });
    rectP(x + 330, 480, 20, 160, '#c9ccd1', { seed: 2410 + i, lw: 1.6 }); }
  rectP(120, 24, 1680, 84, lit > 0.5 ? '#2f6a6e' : '#1c2a2e', { seed: 2415, lw: 2.4 }); txt('ICE COLD DRINKS', 960, 68, 52, { font: 'Inter Black', col: lit > 0.5 ? '#fbfaf6' : '#4a5a5e' });
  for (let i = 0; i < 4; i++) for (let j = 0; j < 5; j++) rectP(170 + i * 410, 244 + j * 150, 60, 20, '#f2c230', { raw: true, lw: 1.2, tex: false });
  lightmap(lit > 0.5 ? '#b8bccc' : '#5a5e74', () => { if (lit > 0.5) for (let i = 0; i < 4; i++) radial(350 + i * 410, 140, 500, 'rgba(230,245,255,1)', 0.7); });
  if (lit > 0.5) for (let i = 0; i < 4; i++) glowAdd(350 + i * 410, 130, 200, 'rgba(220,240,255,1)', 0.35);
}
function timerIns(t, c) { paperBg(2420); stamp('PROBLEM 3', t, c, W / 2, 170, 120, 2421); push(W / 2, 600); clockP(0, 0, 300, 0, (t - c) * 240, 0); pop();
  if (t > c + 1.2) { push(W / 2 + 480, 600, 1, 0.04); label(0, 0, 'FOOD CLOCK', 420, '#f2c230', 0, 52); pop(); } }
SHOTS.push([C2.s - 0.1, 'c2hum', 'dip'], [C2.fr - 0.1, 'c2fridge'], [C2.grid - 0.1, 'c2grid'], [C2.quiet - 0.1, 'c2quiet'], [C2.p3 - 0.1, 'timerIns', 'whip'], [C2.food - 0.5, 'fridgeIns'],
  [C2.eat - 0.1, 'eatIns'], [C2.lan - 0.1, 'c2lantern', 'tear'], [C2.cool - 0.1, 'c2coolerIn'], [C2.save - 0.1, 'c2coolerDoor'], [C2.night - 0.1, 'c2night', 'dip'], [C2.card, 'card7', 'tear']);
Object.assign(SH, {
  c2hum(t, u) { const lit = t < C2.stops ? 1 : 0.0, dr = t < C2.stops - 0.3 ? sm(clamp((u - 0.3) / 0.8)) : 1 - sm(clamp((t - C2.stops + 0.3) / 0.5));
    SL(t, [1000, 580, 1.1 + u * 0.03], { lit, tally: 3, flick: t > C2.stops - 0.4 && t < C2.stops, crate: 760,
      j: { P: { x: 1150 }, lk: t > C2.stops ? [0, -0.8] : [-0.5, 0.2], lid: dr > 0.6 ? 0.8 : 0.1, mood: t > C2.stops ? 'dread' : '', tilt: -0.12 * dr, arms: { l: [-150, 300, 'open'], r: [lerp(170, 70, dr), lerp(120, 20, dr), 'fist'] }, bottle: true, bottleFill: 0.6 - 0.3 * dr, bottleRot: -2.2 * dr } }); },
  c2fridge(t, u) { coolerFront(t, t < C2.fr + 0.25 ? 1 : 0); },
  c2grid(t, u) { SE(t, [900, 480, 1.0 + u * 0.03], { shut: true, signOff: true, canopy: 0, amb: '#7c8296', rainA: 0.5, tally: 3 }); },
  c2quiet(t, u) { const b = Math.max(0, Math.sin(((t - C2.quiet) * 92 / 60) * Math.PI * 2)) ** 8; SD(t, [980, 450, 2.15 + b * 0.04 + u * 0.02], { slits: 0.5, amb: '#5e6478', crate: 980,
    j: { P: { x: 980, y: 1000 - 220 - 345 * 0.95 }, legs: 'sit', mood: 'dread', lid: 0, lk: [0.6, -0.3], arms: { l: [-90, 180, 'fist'], r: [90, 170, 'fist'] } } }); },
  timerIns(t, u) { timerIns(t, C2.p3); },
  fridgeIns(t, u) { fridgeFact(t, C2.food - 0.4); },
  eatIns(t, u) { eatOrder(t, C2.eatM); },
  c2lantern(t, u) { const on = clamp((t - C2.lanOn - 0.2) / 0.4), grab = clamp(u / 1.6), down = clamp((u - 1.6) / 0.8), has = u > 1.4;
    SD(t, [760, 560, 1.6 + u * 0.03], { slits: 0.4, lantern: on > 0 ? [760 + 170, 620] : null, lk: on },
      () => { if (!has) lanternP(540, 520, 0.9, 0); J(t, { P: { x: 760 }, flip: !has, lk: has ? [0.6, 0.3] : [0.9, -0.5], mood: on > 0.5 ? '' : 'dread', smile: on * 0.5,
        arms: { l: [-150, 300, 'open'], r: has ? [lerp(220, 180, down), lerp(-20, 130, down), 'fist'] : [lerp(150, 230, grab), lerp(200, -20, grab), 'open'] }, lantern: has, lanternOn: on }); }); },
  c2coolerIn(t, u) { const k = clamp(u / 3), x = lerp(1350, 1000, eo(k)), sw = Math.sin(step(t, 12) * 4) * 0.2;
    SQ(t, [900, 560, 1.15 + u * 0.03], { lantern: [x + 150, 600], j: { P: { x }, flip: k < 1, legs: k < 1 ? 'walk' : 'stand', lk: k < 1 ? [0.6, -0.2] : [-0.7, -0.4], mood: '', arms: { l: [-150, 300, 'open'], r: [180, 120, 'fist'] }, lantern: true } }, () => puffs(t, x, JP.y + 70)); },
  c2coolerDoor(t, u) { SQ(t, [330, 560, 1.45 + u * 0.07], { amb: '#55607a', lantern: [900, 700] }, () => puffs(t, 560, 600, 2)); },
  c2night(t, u) { const many = t > C2.dozens; SD(t, [960, 560, 1.05 + u * 0.02], { slits: 0.6, amb: '#5a5e74', lantern: [980, 700], lk: 0.35, crate: 980, shadows: many ? 12 : 2,
    j: { P: { x: 980, y: 1000 - 220 - 345 * 0.95 }, legs: 'sit', mood: 'shock', lid: 0, lk: many ? [-0.6, -0.6] : [-0.4, -0.5], sweat: 1, arms: { l: [-90, 180, 'fist'], r: [90, 170, 'fist'] }, lantern: true, lanternOn: 0.5 } }); },
  card7(t, u) { chapterCard(t, C2.card + 0.05, 7, 'FORTY OF THEM'); }
});
