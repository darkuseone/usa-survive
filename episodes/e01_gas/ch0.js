/* Холодное начало 0:00–0:37: ночная смена → колокольчик, зомби → LOCKDOWN → «Day one» → цистерны под ногами → «5 проблем» и вспышка из будущего (день 19) → титул. */
const C0 = {
  alone: WW('c0_01', /^alone/i), shift: WW('c0_01', /^shift/i), a2: LS('c0_02'), chime: WW('c0_02', /^chime/i), whatever: WW('c0_02', /^whatever/i), walked: WW('c0_02', /^walked/i),
  a3: LS('c0_03'), button: WW('c0_03', /^button/i), steel: WW('c0_03', /^steel/i), crash: WW('c0_03', /^crash/i), day: WW('c0_04', /^day/i), twenty: WW('c0_04', /^twenty/i),
  store: LS('c0_05'), shutter: WW('c0_05', /^steel/i), fuel: WW('c0_05', /^thousands/i), five: WW('c0_06', /^five/i), nearly: WW('c0_06', /^nearly/i), title: LE('c0_06') + 0.1
};
C0.lights = C0.shift + 0.3; C0.drop = C0.whatever + 0.05; C0.hit = C0.button + 0.02; C0.sit = LS('c0_04') - 0.1;
SHAKES.push([C0.hit, 0.35, 16], [C0.crash, 0.7, 24], [C0.day + 0.5, 0.3, 9], [C0.twenty + 0.6, 0.3, 9]);
DAYS.push([0, 1, '03:07 AM'], [C0.a3, 1, '03:08 AM']);

function stackArm(t) { const p = (step(t, 12) % 1.6) / 1.6;
  const h = kf(p, [[0, [215, 70]], [0.3, [130, 300]], [0.42, [130, 300]], [0.7, [175, 160]], [0.92, [215, 70]], [1, [215, 70]]]); return { hand: h, bag: p > 0.36 && p < 0.93 }; }
function scene0(t, jo, o = {}) {
  TT = t; store(t, o); if (o.drops !== false) glassDrops(t); shelf(t); if (o.box) boxP(470, 1000, 0.9); if (o.crate) crate(o.crate, 1000);
  if (o.zIn) Z(t, o.zIn); if (jo && !jo.behind) J(t, jo); counter(t, o); if (jo && jo.behind) J(t, jo); if (o.fallBag) o.fallBag();
  dust(t, 700, 400, 1400, 500, 26); storeLight(o);
}
function sweep0(t) { const k = pr(t, C0.lights, C0.lights + 1.3); if (k > 0 && k < 1) radial(lerp(1900, 100, k), 520, 700, 'rgba(255,250,225,1)', 0.65 * Math.sin(k * Math.PI)); }
function tankIns(t, c) {                                     // разрез: магазин сверху, цистерны с топливом под асфальтом
  bg('#1d2238'); rectP(-100, 430, W + 200, 800, '#5a4a3a', { seed: 2100, line: false, shade: () => { const r = rng(2101); for (let i = 0; i < 140; i++) dot(r() * W, 440 + r() * 640, 2 + r() * 5, '#4a3c2e', 0.7); } });
  rectP(-100, 410, W + 200, 30, '#3b3f4b', { seed: 2102, lw: 2.4 });
  rectP(260, 200, 620, 210, '#b9a98a', { seed: 2103, lw: 2.4, shade: () => { rectP(260, 200, 620, 40, '#c8342c', { raw: true, line: false }); rectP(300, 260, 540, 150, '#8e949a', { raw: true, lw: 2 }); } });
  [[1180, '3'], [1500, '4']].forEach(([x, n], i) => { rectP(x - 40, 290, 80, 120, '#c8342c', { seed: 2104 + i, lw: 2 }); stroke([[x, 410], [x, 560]], '#8e949a', 10); });
  [[640, 0], [1300, 1]].forEach(([x, i]) => { const k = clamp((t - c - 0.4 - i * 0.4) / 1.2);
    push(x, 700); piece(spline([[-230, -100], [230, -100], [280, 0], [230, 100], [-230, 100], [-280, 0]], true, 6), '#8e949a', { seed: 2110 + i, lw: 3, shade: () => {
      rectP(-280, 100 - 200 * 0.8 * k, 560, 200, '#e0a030', { raw: true, line: false, a: 0.9 }); for (let q = 0; q < 3; q++) stroke([[-150 + q * 150, -100], [-150 + q * 150, 100]], '#6c7278', 4); } }); pop();
    stroke([[x, 590], [x, 440]], '#6c7278', 14); });
  if (t > c + 1.6) { push(W / 2, 960, 1, -0.02); ransom('THOUSANDS OF GALLONS', 0, 0, 80, 2120, { reveal: pr(t, c + 1.6, c + 2.1), pop: true }); pop(); }
  push(560, 130, 1, 0.03); label(0, 0, 'YOU ARE HERE', 380, '#f2731c', 0, 40); pop(); stroke([[560, 180], [560, 250]], '#f2731c', 6);
}
function fiveIns(t, c) {
  paperBg(2130); stamp('5 PROBLEMS', t, c, W / 2, 250, 140, 2131);
  ['1', '2', '3', '4', '5'].forEach((n, i) => { const k = popK(t, c + 0.5 + i * 0.25, 0.3); if (k <= 0) return; push(330 + i * 315, 640, k, (i % 2 ? 0.04 : -0.04)); card(0, 0, 240, 300, 0, 2132 + i, '#f3ecd8'); txt(n, 0, -10, 150, { font: 'Osw', weight: 600, col: '#1c1512' });
    if (i === 3 && t > C0.nearly) stampX(0, 0, 1.2, clamp((t - C0.nearly) / 0.25)); pop(); });
}

SHOTS.push([0, 'ext0'], [C0.alone - 0.1, 'wide0'], [C0.shift - 0.05, 'mid0'], [C0.a2 - 0.05, 'door0'], [C0.whatever - 0.1, 'shock0'], [C0.walked + 0.45, 'zomb0'],
  [C0.a3 - 0.05, 'run0'], [C0.button - 0.25, 'btnIns'], [C0.steel - 0.1, 'shut0'], [C0.sit, 'day0'],
  [C0.store - 0.1, 'storeOut0', 'dip'], [C0.shutter - 0.1, 'shutClose0'], [C0.fuel - 0.1, 'tankIns', 'whip'], [WW('c0_05', /^every/i) - 0.1, 'countyIns'], [C0.five - 0.4, 'fiveIns', 'flash'], [C0.nearly - 0.1, 'flash19', 'flash'], [C0.title, 'title0', 'tear']);
Object.assign(SH, {
  ext0(t, u) { const [cx, cy, z] = ck(t, [[0, 900, 560, 1.0], [C0.alone, 820, 520, 1.3]]); cam(cx, cy, z); exterior(t, { zom: true }); extLight(t); pop();
    stamp('3:07 AM', t, 0.3, 420, 900, 110, 501); },
  wide0(t, u) { const [cx, cy, z] = ck(t, [[C0.alone - 0.1, 900, 560, 1.06], [C0.shift, 820, 590, 1.16]]); cam(cx, cy, z);
    const a = stackArm(t); scene0(t, { flip: true, lk: [0.8, 0.1], mood: 'sleepy', arms: { l: [-150, 300, 'open'], r: [...a.hand, 'fist'] }, bag: a.bag ? [a.hand[0] + 4, a.hand[1] - 40] : null, tilt: Math.sin(step(t, 6)) * 0.02 }, { box: true, car: true }); pop(); },
  mid0(t, u) { const look = t > C0.lights + 0.2; cam(JP.x - 20, JP.y + 140, 1.9 + u * 0.04); const a = stackArm(t), hold = look ? [180, 150] : a.hand;
    scene0(t, { flip: true, lk: look ? [-0.9, -0.1] : [0.6, 0.2], mood: look ? '' : 'sleepy', lid: look ? 0.1 : 0.5, arms: { l: [-150, 300, 'open'], r: [...hold, 'fist'] }, bag: (look || a.bag) ? [hold[0] + 4, hold[1] - 40] : null, tilt: look ? -0.06 : 0 }, { box: true, car: true, fn: () => sweep0(t) }); pop(); },
  door0(t, u) { const k = pr(t, C0.a2, C0.chime - 0.05), od = pr(t, C0.chime - 0.1, C0.chime + 0.45); cam(960, 560, 1.5 + u * 0.05);
    const zo = { x: lerp(1500, 1010, k), y: lerp(560, 610, k), s: lerp(0.4, 0.66, k), v: 0, legs: 'run' };
    scene0(t, null, { zoms: od < 0.5 ? [zo] : [], zIn: od >= 0.5 ? { s: 0.8, x: 980, y: 1000 - 508 * 0.8, legs: 'run' } : null, door: od, bell: od > 0 ? 1 - pr(t, C0.chime + 0.4, C0.chime + 1.8) : 0, car: true, rainA: 1 + od * 0.5 }); pop(); },
  shock0(t, u) { const z = u < 0.15 ? lerp(1.85, 2.25, eo(u / 0.15)) : 2.25; cam(JP.x + 40, JP.y + 130, z);
    const dk = clamp((t - C0.drop) / 0.55), bx = JP.x - 180 * JP.s - dk * 40, by = JP.y + 110 * JP.s + dk * dk * 380;
    scene0(t, { lk: [0.8, -0.1], mood: 'shock', scream: t > C0.drop + 0.1 ? 1 : 0, sweat: 1, arms: { l: [-180, 170, 'open'], r: [180, 150, 'open'] } },
      { door: 1, car: true, flick: true, zIn: { s: 0.8, x: 1010, y: 1000 - 508 * 0.8 }, fallBag: () => chips(bx, Math.min(by, 990), dk < 1 ? dk * 2.4 : 1.4, 0.9) }); pop(); },
  zomb0(t, u) { const k = clamp(u / 1.9); cam(960, 560 + k * 20, 1.55 + k * 0.45);
    scene0(t, null, { door: 1, car: true, flick: true, zIn: { s: 0.9 + k * 0.08, x: 960 - k * 60, y: 1000 - 508 * (0.9 + k * 0.08), legs: 'run', tilt: 0.18 + Math.sin(step(t, 8) * 3) * 0.06, arms: { l: [-150, 110 - k * 30, 'open'], r: [150, 90 - k * 20, 'open'] } } }); pop(); },
  run0(t, u) { const k = clamp(u / 0.75), x = lerp(700, 1480, eio(k)); cam(lerp(820, 1300, eio(k)), 600, 1.3);
    scene0(t, { P: { x }, legs: 'run', lean: 0.18, mood: 'shock', scream: 0.7, lk: [0.9, 0], arms: { l: [-170, 120, 'fist'], r: [170, 220, 'fist'] }, behind: k > 0.75 }, { door: 1, car: true, flick: true, zIn: { s: 0.9, legs: 'run' } }); pop(); },
  btnIns(t, u) { cam(W / 2, H / 2, 1, 0, shakeAt(t)); lockBtn(t, C0.hit); pop(); stamp('LOCKDOWN!', t, C0.hit, W / 2, 170, 140, 502); },
  shut0(t, u) { const sh = pr(t, C0.steel, C0.crash + 0.05); cam(960, 580, 1.05 + u * 0.03, 0, shakeAt(t)); const press = Math.sin(step(t, 8) * 5) * 8;
    scene0(t, { P: { x: 1480 }, behind: true, lk: [-0.8, -0.3], mood: 'dread', arms: { l: [-150, 200, 'open'], r: [140, 200, 'fist'] } },
      { door: 0, zoms: [{ x: 960, y: 1000 - 508 * 0.85 - 40, s: 0.85, v: 0, arms: { l: [-140, 40 + press, 'open'], r: [140, 30 - press, 'open'] } }, { x: 1250, y: 600, s: 0.6, v: 1, legs: 'run' }, { x: 640, y: 610, s: 0.55, v: 2, legs: 'run' }],
        car: true, shut: sh, red: 0.4, lit: 0.45, neonOff: true, drops: sh < 0.9, fn: () => radial(960, 600, 500, 'rgba(120,220,190,1)', 0.35 * (1 - sh)) }); pop();
    stamp('CRASH!', t, C0.crash, W / 2, 170, 130, 503, 0.03); },
  day0(t, u) { const sk = sm(clamp((t - C0.sit) / 0.6)), z = lerp(1.2, 1.5, sm(clamp((t - C0.twenty) / 1.6))); cam(1020, 620 - (z - 1.2) * 140, z, 0, shakeAt(t));
    const P = { x: 980, y: lerp(1000 - 508 * 0.95, 1000 - 220 - 345 * 0.95, sk) };
    scene0(t, { P, legs: sk > 0.5 ? 'sit' : 'stand', lk: [0.1, 0.2], mood: 'dread', lid: 0.3, sweat: 1, arms: sk > 0.5 ? { l: [-120, 250, 'fist'], r: [120, 250, 'fist'] } : { l: [-150, 300, 'open'], r: [150, 300, 'open'] }, bob: Math.sin(step(t, 6) * 2) * 3 },
      { shut: 1, red: 0.5, lit: 0.35, neonOff: true, drops: false, crate: 980 }); pop();
    stamp('DAY 1', t, C0.day, 430, 190, 140, 504); if (t > C0.twenty) { push(1500, 760, 1, 0.03); label(0, 0, '29 TO GO', 380, '#f2c230', 0, 60); pop(); } },
  storeOut0(t, u) { SE(t, [860, 520, 1.0 + u * 0.02], { shut: true, signOff: false, zom: false, extra: () => { for (let i = 0; i < 5; i++) zSil(1500 + i * 90, 640, 0.3, t, i); } }); },
  shutClose0(t, u) { SD(t, [900, 600, 1.6 - u * 0.04], { bulge: 0.6 + 0.4 * Math.sin(step(t, 8) * 3), slits: 0.5, lantern: [1200, 300], lk: 0.6 }); },
  tankIns(t, u) { tankIns(t, C0.fuel); },
  countyIns(t, u) { convergeMap(t, WW('c0_05', /^every/i), { n: 26, label: 'EVERY SURVIVOR', ppl: true }); },
  fiveIns(t, u) { fiveIns(t, C0.five - 0.4); },
  flash19(t, u) { SQ(t, [700, 600, 1.45 + u * 0.08], { scratch: true, lantern: [700, 650], j: { P: { x: 700 }, mood: 'shock', scream: 0.6, sweat: 1, lk: [-0.9, 0], arms: { l: [-180, 120, 'fist'], r: [150, 300, 'open'] } } }, () => puffs(t, 700 + 20, JP.y + 60));
    stamp('DAY 19', t, C0.nearly + 0.2, 430, 190, 140, 2140, 0.04, [['#e0201a', '#fff'], ['#111', '#fff'], ['#e0201a', '#fff'], ['#111', '#ffd21f'], ['#e0201a', '#fff'], ['#111', '#fff']]); },
  title0(t, u) { titleCard(t, C0.title + 0.1); }
});
