/* Глава 7 — Day 30 (7:04–8:04): тридцатая зарубка → что спасло → эвакуация, 6 миль → записка → 3:07, свет вспыхнул → вывеска, колокольчик → «кто-то знает, что ты здесь» → концовка. */
const C7 = { s: LS('c7_01'), scratch: WW('c7_01', /^scratch/i), rec: LS('c7_02'), recM: [WW('c7_02', /^counted/i), WW('c7_02', /^killed/i), WW('c7_02', /^stayed/i), WW('c7_02', /^found/i), WW('c7_02', /^never/i)],
  map: LS('c7_03'), note: LS('c7_03b'), noteM: [WW('c7_03b', /^count/i), WW('c7_03b', /^dark/i), WW('c7_03b', /^quiet/i), WW('c7_03b', /^don/i)], pack: LS('c7_04'), lights: WW('c7_04', /^lights/i),
  sign: LS('c7_05'), chime: WW('c7_05', /^chime/i), knows: LS('c7_06'), knowsW: WW('c7_06', /^knows/i), end: LS('c7_07') - 0.1 };
DAYS.push([C7.s - 0.1, 30, '06:30 AM'], [C7.pack - 0.1, 30, '03:07 AM']);
SHAKES.push([C7.lights, 0.3, 8], [C7.chime, 0.25, 6]);
function tallyIns(t, c) { shutterBg(2900); const done = t > c + 0.5 ? 30 : 29; push(300, 320, 1.6); tallyMarks(done, 0, 0, 1); pop();
  if (t > c + 0.2 && t < c + 1.0) { const k = clamp((t - c - 0.2) / 0.5); stroke([[300 + 5 * 110 * 1.6 * 1 - 10 * 1.6, 320 + 54 * 1.6], [300 + (5 * 110 - 10 + 86 * k) * 1.6, 320 + (54 - 38 * k) * 1.6]], '#c8241c', 10); }
  stamp('30', t, c + 1.4, 1500, 820, 200, 2901); }
function bellIns(t, c) { bg('#2a2c34', 2910); const sw = Math.sin(step(t, 24) * 20) * 0.5 * clamp(1 - (t - c) / 2.5) * (t > c ? 1 : 0);
  stroke([[W / 2, 0], [W / 2, 300]], '#1c1512', 8); push(W / 2, 300, 3, sw); piece([[-20, 0], [20, 0], [26, 34], [-26, 34]], '#d9a12b', { seed: 2911, lw: 1.6 }); dot(0, 40, 7, '#8a6418'); pop();
  lightmap('#6a6e86', () => { radial(W / 2, 400, 700, 'rgba(255,240,200,1)', 0.8); }); glowAdd(W / 2, 380, 300, 'rgba(255,220,140,1)', 0.4); stamp('DING.', t, c + 0.05, 1350, 700, 140, 2912); }
SHOTS.push([C7.s - 0.1, 'c7tally', 'dip'], [C7.rec - 0.1, 'recapIns', 'whip'], [C7.map - 0.1, 'map2Ins'], [C7.note - 0.1, 'noteIns', 'whip'], [C7.pack - 0.1, 'c7pack', 'dip'],
  [C7.sign - 0.1, 'c7sign', 'flash'], [C7.chime - 0.4, 'c7bell'], [C7.knows - 0.1, 'c7joe'], [C7.end, 'end', 'tear']);
Object.assign(SH, {
  c7tally(t, u) { tallyIns(t, C7.scratch); },
  recapIns(t, u) { recap(t, C7.recM); },
  map2Ins(t, u) { mapIns(t, C7.map - 0.5); },
  noteIns(t, u) { recap(t, C7.noteM, 'for whoever comes next —', true); },
  c7pack(t, u) { const on = t > C7.lights, fl = on && t < C7.lights + 0.7; const jo = { P: { x: 980 }, mood: on ? 'shock' : 'dread', lid: on ? 0 : 0.2, lk: on ? [0, -0.8] : [0.5, 0.6], sweat: on ? 1 : 0, arms: on ? { l: [-180, 170, 'open'], r: [180, 150, 'open'] } : { l: [-120, 260 + jit(t, 20), 'fist'], r: [130, 260, 'fist'] }, pack: true };
    if (!on) SD(t, [980, 600, 1.4], { slits: 0.2, amb: '#5a5e74', lantern: [1200, 900], tally: 30, j: jo }, () => lanternP(1200, 1000, 0.9));
    else SL(t, [980, 600, 1.4 + (t - C7.lights) * 0.05], { lit: fl ? (Math.sin(step(t, 24) * 37) > 0 ? 1 : 0.2) : 1, tally: 30, j: jo }); },
  c7sign(t, u) { SE(t, [1140, 470, 1.8 + u * 0.04], { shut: true, signOff: false, tally: 30 }); },
  c7bell(t, u) { bellIns(t, C7.chime); },
  c7joe(t, u) { SL(t, [980, 470, 2.0 + u * 0.06], { lit: 1, tally: 30, j: { P: { x: 980 }, mood: 'dread', lid: 0, lk: t > C7.knowsW ? [0, 0] : [-0.8, -0.2], sweat: 1, arms: { l: [-150, 300, 'open'], r: [150, 300, 'open'] }, pack: true } }); },
  end(t, u) { endCard(t, C7.end + 0.1); }
});
// встряска для вставок: SHT = текущее время
for (const k of Object.keys(SH)) { const f = SH[k]; SH[k] = function (t, u) { SHT = t; f(t, u); }; }
// метки для звука: все C*-метки (префикс главы) + начала планов s_<имя>
const CUE = {};
[['a', C0], ['b', C1], ['c', C2], ['d', C3], ['e', C4], ['f', C45], ['g', C5], ['h', C6], ['i', C7]].forEach(([p, o]) => { for (const k in o) { if (typeof o[k] === 'number') CUE[p + '_' + k] = o[k]; else if (Array.isArray(o[k])) o[k].forEach((v, j) => CUE[p + '_' + k + j] = v); } });
SHOTS.forEach(s => { if (CUE['s_' + s[1]] == null) CUE['s_' + s[1]] = s[0]; });
