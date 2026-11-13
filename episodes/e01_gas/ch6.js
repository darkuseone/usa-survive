/* Глава 6 — Day 24 (6:13–7:00): фары → пикап, трое, Ди → проблема 5: насосы → удары → лом под жалюзи → «никто не входит» → шум зовёт сорок → уехали → Ди оглядывается. */
const C6 = { s: LS('c6_01'), truck: LS('c6_02'), pass: WW('c6_02', /^passenger/i), p5: LS('c6_03'), pound: LS('c6_04'), open: WW('c6_04', /^open/i), crow: LS('c6_04b'), two: WW('c6_04b', /^two/i), four: WW('c6_04b', /^four/i),
  calm: LS('c6_05'), horde: LS('c6_06'), flee: LS('c6_07'), look: LS('c6_08'), card: LE('c6_08') + 0.1 };
DAYS.push([C6.s - 0.1, 24, '10:52 PM']); LT.push(C6.look + 1.4);
SHAKES.push([C6.pound + 0.3, 0.25, 12], [C6.pound + 0.9, 0.25, 12], [C6.open, 0.3, 14], [C6.two, 0.25, 8], [C6.four, 0.3, 10]);
function raiders(t, turn = 0) { [[760, 0], [900, 1], [1640, 2]].forEach(([x, i]) => layer(() => raider({ x, y: 880 - 508 * 0.6 + (i % 2) * 14, s: 0.6, t, flip: turn ? true : x > 1200, mood: turn ? 'shock' : 'angry', lk: turn ? [0.9, 0] : [x > 1200 ? 0.6 : -0.6, -0.2],
  arms: turn ? { l: [-170, 60, 'open'], r: [170, 40, 'open'] } : { l: [-150, 300, 'open'], r: [170, 120 + i * 30, 'fist'] }, band: ['#8a2a24', '#2f4a6a', '#3a3a3a'][i], hair: ['buzz', 'cap', 'bald'][i] }), { sx: 3, sy: 4, sb: 5 })); }
const flash3 = t => () => { for (let i = 0; i < 3; i++) cone(900 + i * 260, 560, 760 + i * 300 + Math.sin(step(t, 8) + i) * 120, 900, 70, 'rgba(255,250,210,1)', 0.55); };
function crowbarIns(t, c) { shutterBg(2800); const g = (t > C6.four ? 4 : t > C6.two ? 2 : 0.6) * 24, by = 800;
  rectP(-20, by, W + 40, g, '#fff1c8', { seed: 2801, line: false, tex: false }); glowAdd(W / 2, by + 10, 500, 'rgba(255,240,190,1)', 0.45);
  [[520, 0], [690, 1], [1380, 2], [1540, 3]].forEach(([x, i]) => { const sx = x + Math.sin(step(t, 12) * 3 + i) * 8; blobP([[sx - 60, by + g], [sx + 60, by + g], [sx + 70, by + g - Math.min(g, 60)], [sx - 50, by + g - Math.min(g, 70)]], '#14161a', { seed: 2807 + i, line: false }); });   // ботинки в просвете
  push(1010, by + g, 1, -0.22 + Math.sin(step(t, 12) * 8) * 0.03); rectP(-420, -16, 700, 32, '#2a2c30', { seed: 2802, lw: 2.4 }); piece([[280, -16], [350, -50], [366, -24], [280, 16]], '#2a2c30', { seed: 2803, lw: 2.4 }); stroke([[-400, -8], [260, -8]], '#5c6168', 4); pop();
  for (let i = 0; i < 10; i++) { const r = rng(2810 + i + Math.floor(step(t, 12) * 6)), a = -Math.PI * r(), d = 30 + r() * 110; stroke([[1300, by], [1300 + Math.cos(a) * d, by + Math.sin(a) * d]], '#ffd76a', 4, { a: 0.9 }); }                // искры
  rectP(-20, by + g, W + 40, 320, '#5f5a52', { seed: 2804, line: false }); stamp('2 IN', t, C6.two, 480, 300, 120, 2805); stamp('4 IN', t, C6.four, 1340, 300, 140, 2806); }
SHOTS.push([C6.s - 0.1, 'c6lights', 'dip'], [C6.truck - 0.1, 'c6truck', 'whip'], [C6.pass - 0.1, 'c6dee'], [C6.p5 - 0.1, 'c6pump', 'whip'], [C6.pound - 0.1, 'c6pound'], [C6.crow - 0.1, 'crowbarIns'],
  [C6.calm - 0.1, 'c6calm'], [C6.horde - 0.1, 'c6horde', 'whip'], [C6.flee - 0.1, 'c6flee'], [C6.look - 0.1, 'c6look', 'dip'], [C6.card, 'card30', 'tear']);
Object.assign(SH, {
  c6lights(t, u) { const k = pr(t, C6.s + 0.3, C6.s + 2.2); SD(t, [980, 560, 1.2], { slits: 0.3 + 0.7 * Math.sin(k * Math.PI), amb: '#5a5e74', crate: 980, lantern: [1180, 760], lk: 0.4, tally: 24,
    fn: () => { if (k > 0 && k < 1) radial(lerp(1800, 200, k), 500, 700, 'rgba(255,240,200,1)', 0.7 * Math.sin(k * Math.PI)); },
    j: { P: { x: 980, y: 1000 - 220 - 345 * 0.95 }, legs: 'sit', mood: 'shock', lid: 0, lk: [-0.7, -0.3], arms: { l: [-90, 180, 'fist'], r: [90, 170, 'fist'] } } }); },
  c6truck(t, u) { const k = eo(clamp(u / 1.2)); SE(t, [1160, 620, 1.12 + u * 0.02], { shut: true, signOff: true, canopy: 0.3, tally: 24, extra: () => { pickup(lerp(2300, 1250, k), 880, 1.3, t); if (k > 0.9) raiders(t); }, fn: flash3(t) }); },
  c6dee(t, u) { cam(W / 2, H / 2, 1.0 + u * 0.03); cabClose(t, { dee: { mood: 'dread', lid: 0.15, lk: [0.2, 0.4], arms: { l: [-120, 250, 'fist'], r: [120, 250, 'fist'] } } }); pop(); },
  c6pump(t, u) { const hit = Math.floor((t - C6.p5) / 0.5) % 2 === 0; SE(t, [1200, 660, 1.7], { shut: true, signOff: true, canopy: 0.3, extra: () => { pickup(1750, 880, 1.3, t);
      layer(() => raider({ x: 1330, y: 880 - 508 * 0.6, s: 0.6, t, flip: true, lean: hit ? -0.08 : 0, arms: { l: [-150, 300, 'open'], r: [210, hit ? 150 : 60, 'fist'] } }), { sx: 3, sy: 4, sb: 5 }); if (hit) for (let i = 0; i < 3; i++) stroke([[1250 - i * 14, 640 - i * 20], [1226 - i * 20, 620 - i * 28]], '#fbfaf6', 5, { a: 0.8 }); }, fn: flash3(t) });
    stamp('PROBLEM 5', t, C6.p5 + 0.1, 450, 180, 110, 2810); },
  c6pound(t, u) { SD(t, [1100, 600, 1.3], { slits: 0.6, amb: '#5a5e74', bulge: 0.6, fn: flash3(t), j: { P: { x: 1340, y: 610 }, behind: true, mood: 'shock', lid: 0, lk: [-0.9, -0.2], sweat: 1, arms: { l: [-150, 300, 'open'], r: [150, 300, 'open'] } } });
    stamp('"OPEN UP!"', t, C6.open, 560, 200, 110, 2811); },
  crowbarIns(t, u) { crowbarIns(t, C6.crow); },
  c6calm(t, u) { SD(t, [1340, 470, 2.2 + u * 0.03], { slits: 0.6, amb: '#5a5e74', fn: () => cone(600, 600, 1500, 520, 80, 'rgba(255,250,210,1)', 0.5), j: { P: { x: 1340, y: 560 }, behind: true, mood: 'angry', lid: 0.35, lk: [-0.3, 0], arms: { l: [-150, 300, 'open'], r: [150, 300, 'open'] } } }); },
  c6horde(t, u) { const k = clamp(u / 7); SE(t, [1000, 640, 1.1], { shut: true, signOff: true, canopy: 0.3, tally: 24, extra: () => { pickup(1250, 880, 1.3, t); raiders(t, k > 0.35);
      walkers(t, 40, { seed: 3250, x: (i, q, d) => -220 - q * 900 + k * 1250 * (0.6 + d * 0.5), y0: 800, y1: 1010, s0: 0.5, s1: 0.82 }); }, fn: flash3(t) }); },
  c6flee(t, u) { const k = eo(clamp(u / 2.4)); SE(t, [1000, 640, 1.1], { shut: true, signOff: true, canopy: 0.3, extra: () => { pickup(1250 + k * 1500, 880, 1.3, t);
      for (let i = 0; i < 7; i++) stroke([[1250 + k * 1500 - 420 - i * 30, 700 + i * 26], [1250 + k * 1500 - 760, 700 + i * 26]], '#c8d4ee', 5, { a: 0.5 * (1 - k) });
      walkers(t, 40, { seed: 3250, x: (i, q, d) => -220 - q * 900 + (1 + u * 0.03) * 1250 * (0.6 + d * 0.5), y0: 800, y1: 1010, s0: 0.5, s1: 0.82 }); } }); stamp('GONE.', t, LS('c6_07') + 2.4, 1450, 220, 120, 2830); },
  c6look(t, u) { cam(W / 2 + u * 14, H / 2, 1.04 + u * 0.02); cabClose(t, { red: 1, dee: { flip: true, mood: 'dread', lid: 0.2, lk: [0.9, 0.1], tilt: 0.08, arms: { l: [-120, 250, 'fist'], r: [120, 250, 'fist'] } },
      fn: () => { const f = flashAt(t); if (f > 0) { ctx.save(); ctx.globalAlpha = 0.5 * f; ctx.fillStyle = 'rgb(200,214,255)'; ctx.fillRect(-400, -400, 2800, 1900); ctx.restore(); } } }); pop(); },
  card30(t, u) { chapterCard(t, C6.card + 0.05, 30, 'CLOSING TIME'); }
});
