/* Глава 7 — Day 30 (7:04–8:04): тридцатая зарубка → что спасло → эвакуация, 6 миль → записка → 3:07, свет вспыхнул → вывеска, колокольчик → «кто-то знает, что ты здесь» → концовка. */
const C7 = { s: LS('c7_01'), scratch: WW('c7_01', /^scratch/i), rec: LS('c7_02'), recM: [WW('c7_02', /^counted/i), WW('c7_02', /^killed/i), WW('c7_02', /^stayed/i), WW('c7_02', /^found/i), WW('c7_02', /^never/i)],
  map: LS('c7_03'), note: LS('c7_03b'), noteM: [WW('c7_03b', /^count/i), WW('c7_03b', /^dark/i), WW('c7_03b', /^quiet/i), WW('c7_03b', /^don/i)], pack: LS('c7_04'), lights: WW('c7_04', /^lights/i),
  sign: LS('c7_05'), chime: WW('c7_05', /^chime/i), knows: LS('c7_06'), knowsW: WW('c7_06', /^knows/i), end: LS('c7_07') - 0.1 };
DAYS.push([C7.s - 0.1, 30, '06:30 AM'], [C7.pack - 0.1, 30, '03:07 AM']);
SHAKES.push([C7.lights, 0.3, 8], [C7.chime, 0.25, 6]);
function tallyIns(t, c) { shutterBg(2900); const done = t > c + 0.5 ? 30 : 29; push(300, 320, 1.6); tallyMarks(done, 0, 0, 1); pop();
  if (t > c + 0.2 && t < c + 1.0) { const k = clamp((t - c - 0.2) / 0.5); stroke([[300 + 5 * 110 * 1.6 * 1 - 10 * 1.6, 320 + 54 * 1.6], [300 + (5 * 110 - 10 + 86 * k) * 1.6, 320 + (54 - 38 * k) * 1.6]], '#c8241c', 10); }
  stamp('30', t, c + 1.4, 1500, 820, 200, 2901); }
function bellIns(t, c) {                                     // колокольчик над дверью: свет вернулся — и он звенит
  const k = t > c ? clamp(1 - (t - c) / 2.6) : 0, sw = Math.sin(step(t, 24) * 20) * 0.55 * k;
  bg('#8e949a', 2910); for (let y = 0; y < H; y += 30) { stroke([[0, y], [W, y]], '#6c7278', 4, { smooth: false }); stroke([[0, y - 8], [W, y - 8]], '#b0b6bb', 2, { smooth: false, a: 0.7 }); }
  rectP(-20, -20, W + 40, 150, '#cfd2c8', { seed: 2913, lw: 2.4 }); rectP(-20, 126, W + 40, 60, '#4c5158', { seed: 2914, lw: 2.6 });                                  // потолок и дверная коробка
  rectP(1250, 220, 260, 110, '#1a1614', { seed: 2915, lw: 2.4 }); txt('3:07', 1380, 276, 80, { font: 'Osw', weight: 600, col: '#ff4a3a' });
  push(820, 186); rectP(-14, 0, 28, 120, '#3a3d42', { seed: 2916, lw: 2 }); stroke([[0, 120], [60, 170], [130, 150]], '#3a3d42', 12);                               // кронштейн-пружина
  push(130, 150, 1, sw); stroke([[0, 0], [0, 50]], '#3a3d42', 8); const bell = spline([[-30, 50], [30, 50], [70, 110], [96, 230], [130, 280], [-130, 280], [-96, 230], [-70, 110]], true, 6);
  piece(bell, '#d9a12b', { seed: 2911, lw: 3, shade: () => { piece([[20, 60], [70, 110], [96, 230], [130, 280], [60, 280], [40, 150]], '#b07c18', { raw: true, line: false, a: 0.6 }); stroke([[-60, 120], [-84, 230]], '#fff1b8', 10, { a: 0.7 }); stroke([[-124, 262], [124, 262]], '#8a6418', 6); } });
  push(0, 280, 1, sw * 1.6); stroke([[0, 0], [0, 40]], '#8a6418', 8); ellP(0, 56, 24, 24, '#8a6418', { seed: 2917, lw: 2.4 }); pop(); pop(); pop();
  for (let i = 0; i < 3; i++) { const q = ((t - c) * 1.4 + i / 3) % 1; if (k > 0) { stroke([[1130 + q * 160, 420 - q * 60], [1160 + q * 200, 470 - q * 40]], '#ffd21f', 8, { a: (1 - q) * k }); stroke([[760 - q * 160, 420 - q * 60], [730 - q * 200, 470 - q * 40]], '#ffd21f', 8, { a: (1 - q) * k }); } }
  lightmap('#8a8ea6', () => { radial(950, 420, 900, 'rgba(255,244,210,1)', 0.75); radial(1380, 276, 300, 'rgba(255,70,50,1)', 0.5); }); glowAdd(950, 420, 420, 'rgba(255,230,160,1)', 0.25);
  stamp('DING.', t, c + 0.05, 430, 520, 150, 2912, -0.06); }
SHOTS.push([C7.s - 0.1, 'c7tally', 'dip'], [C7.rec - 0.1, 'recapIns', 'whip'], [C7.map - 0.1, 'map2Ins'], [C7.note - 0.1, 'noteIns', 'whip'], [C7.pack - 0.1, 'c7pack', 'dip'],
  [C7.sign - 0.1, 'c7sign', 'flash'], [C7.chime - 0.4, 'c7bell'], [C7.knows - 0.1, 'c7joe'], [C7.end, 'end', 'tear']);
Object.assign(SH, {
  c7tally(t, u) { tallyIns(t, C7.scratch); const k = clamp((t - C7.scratch - 0.2) / 0.5), hx = 300 + (5 * 110 - 10 + 86 * k) * 1.6 + 30, hy = 320 + (54 - 38 * k) * 1.6;
    push(hx, hy, 2.2, -0.6); piece(tube([[0, 300], [0, 120], [0, 10]], 58, 52).pts, JOE.pal.top, { raw: true, lw: 2.4 }); blobP([[-30, -10], [30, -10], [34, 26], [0, 38], [-34, 26]], JOE.pal.skin, { seed: 2905, lw: 2.4 });
    piece([[-6, -10], [6, -10], [4, -60], [-4, -60]], '#c9ccd1', { raw: true, lw: 1.6 }); ellP(0, -10, 14, 10, '#d9a12b', { seed: 2906, lw: 1.6 }); pop(); },
  recapIns(t, u) { recap(t, C7.recM); },
  map2Ins(t, u) { mapIns(t, C7.map - 0.5); },
  noteIns(t, u) { recap(t, C7.noteM, 'for whoever comes next —', true); },
  c7pack(t, u) { const on = t > C7.lights, fl = on && t < C7.lights + 0.7, p = (step(t, 12) % 1.5) / 1.5, it = Math.floor(step(t, 12) / 1.5) % 3;                // кладёт припасы в рюкзак на ящике: берёт справа, несёт влево
    const hand = kf(p, [[0, [225, 150]], [0.3, [235, 110]], [0.62, [-120, 120]], [0.8, [-120, 170]], [1, [225, 150]]]), carry = p > 0.25 && p < 0.72;
    const jo = { P: { x: 1040 }, mood: on ? 'shock' : 'dread', lid: on ? 0 : 0.2, lk: on ? [0, -0.8] : [carry ? -0.5 : 0.6, 0.5], sweat: on ? 1 : 0, arms: on ? { l: [-180, 170, 'open'], r: [180, 150, 'open'] } : { l: [-140, 240, 'open'], r: [...hand, 'fist'] },
      bottle: !on && carry && it !== 1, bag: !on && carry && it === 1 ? [hand[0], hand[1] - 44] : null };
    const pre = () => { crate(790, 1000); backpack(790, 1000 - 220 - 118, 0.95); for (let i = 0; i < 3; i++) bottle(1230 + i * 44, 700 - 64, 0.8); };
    if (!on) SD(t, [960, 600, 1.4], { slits: 0.2, amb: '#5a5e74', lantern: [1320, 560], tally: 30, pre, j: jo }, () => lanternP(1330, 700, 0.9));
    else { cam(960 + jit(t, 1.5), 600, 1.4 + (t - C7.lights) * 0.05, 0, shakeAt(t)); TT = t; store(t, { shut: 1, neonOff: true, lit: fl ? 0.7 : 1, door: 0, drops: false }); tallyMarks(30, 260, 380, 0.9); shelf(t); pre(); J(t, jo); counter(t, { lit: 1 }); lanternP(1330, 700, 0.9, 0); dust(t, 700, 400, 1400, 500, 20); storeLight({ lit: fl ? (0.6 + 0.4 * Math.sin(step(t, 12) * 5)) : 1, neonOff: true }); pop(); } },
  c7sign(t, u) { SE(t, [1140, 470, 1.8 + u * 0.04], { shut: true, signOff: false, tally: 30 }); },
  c7bell(t, u) { bellIns(t, C7.chime); },
  c7joe(t, u) { SL(t, [1040, 470, 2.0 + u * 0.06], { lit: 1, tally: 30, j: { P: { x: 1040 }, mood: 'dread', lid: 0, lk: t > C7.knowsW ? [0, 0] : [-0.8, -0.2], sweat: 1, arms: { l: [-150, 300, 'open'], r: [150, 300, 'open'] } } }); },
  end(t, u) { endCard(t, C7.end + 0.1); }
});
// встряска для вставок: SHT = текущее время
for (const k of Object.keys(SH)) { const f = SH[k]; SH[k] = function (t, u) { SHT = t; f(t, u); }; }
// метки для звука: все C*-метки (префикс главы) + начала планов s_<имя>
const CUE = {};
[['a', C0], ['b', C1], ['c', C2], ['d', C3], ['e', C4], ['f', C45], ['g', C5], ['h', C6], ['i', C7]].forEach(([p, o]) => { for (const k in o) { if (typeof o[k] === 'number') CUE[p + '_' + k] = o[k]; else if (Array.isArray(o[k])) o[k].forEach((v, j) => CUE[p + '_' + k + j] = v); } });
SHOTS.forEach(s => { if (CUE['s_' + s[1]] == null) CUE['s_' + s[1]] = s[0]; });
