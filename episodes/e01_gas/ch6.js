/* Глава 6 — Day 24 (6:13–7:00): фары → пикап, трое, Ди → проблема 5: насосы → удары → лом под жалюзи → «никто не входит» → шум зовёт сорок → уехали → Ди оглядывается. */
const C6 = { s: LS('c6_01'), truck: LS('c6_02'), pass: WW('c6_02', /^passenger/i), p5: LS('c6_03'), pound: LS('c6_04'), open: WW('c6_04', /^open/i), crow: LS('c6_04b'), two: WW('c6_04b', /^two/i), four: WW('c6_04b', /^four/i),
  calm: LS('c6_05'), horde: LS('c6_06'), flee: LS('c6_07'), look: LS('c6_08'), card: LE('c6_08') + 0.1 };
DAYS.push([C6.s - 0.1, 24, '10:52 PM']);
SHAKES.push([C6.pound + 0.3, 0.25, 12], [C6.pound + 0.9, 0.25, 12], [C6.open, 0.3, 14], [C6.two, 0.25, 8], [C6.four, 0.3, 10]);
function raiders(t, turn = 0) { [[880, 0], [1000, 1], [1420, 2]].forEach(([x, i]) => layer(() => raider({ x, y: 600 + (i % 2) * 10, s: 0.42, t, flip: turn ? x < 1200 : x > 1200, arms: { l: [-150, 300, 'open'], r: [170, 120 + i * 30, 'fist'] }, band: ['#8a2a24', '#2f4a6a', '#3a3a3a'][i] }), { sx: 3, sy: 4, sb: 5 })); }
const flash3 = t => () => { for (let i = 0; i < 3; i++) cone(900 + i * 260, 560, 760 + i * 300 + Math.sin(step(t, 8) + i) * 120, 900, 70, 'rgba(255,250,210,1)', 0.55); };
function crowbarIns(t, c) { shutterBg(2800); const g = (t > C6.four ? 4 : t > C6.two ? 2 : 0.6) * 22; rectP(-20, 820, W + 40, g, '#fff1c8', { seed: 2801, line: false, tex: false }); glowAdd(W / 2, 830, 400, 'rgba(255,240,190,1)', 0.4);
  push(1100, 840 + g, 1, -0.25); rectP(-300, -14, 520, 28, '#2a2c30', { seed: 2802, lw: 2 }); piece([[220, -14], [270, -40], [280, -20], [220, 14]], '#2a2c30', { seed: 2803, lw: 2 }); pop();
  rectP(-20, 820 + g, W + 40, 300, '#5f5a52', { seed: 2804, line: false }); stamp('2 IN', t, C6.two, 500, 300, 120, 2805); stamp('4 IN', t, C6.four, 1300, 300, 140, 2806); }
SHOTS.push([C6.s - 0.1, 'c6lights', 'dip'], [C6.truck - 0.1, 'c6truck', 'whip'], [C6.pass - 0.1, 'c6dee'], [C6.p5 - 0.1, 'c6pump', 'whip'], [C6.pound - 0.1, 'c6pound'], [C6.crow - 0.1, 'crowbarIns'],
  [C6.calm - 0.1, 'c6calm'], [C6.horde - 0.1, 'c6horde', 'whip'], [C6.flee - 0.1, 'c6flee'], [C6.look - 0.1, 'c6look', 'dip'], [C6.card, 'card30', 'tear']);
Object.assign(SH, {
  c6lights(t, u) { const k = pr(t, C6.s + 0.3, C6.s + 2.2); SD(t, [980, 560, 1.2], { slits: 0.3 + 0.7 * Math.sin(k * Math.PI), amb: '#5a5e74', crate: 980, lantern: [1180, 760], lk: 0.4, tally: 24,
    fn: () => { if (k > 0 && k < 1) radial(lerp(1800, 200, k), 500, 700, 'rgba(255,240,200,1)', 0.7 * Math.sin(k * Math.PI)); },
    j: { P: { x: 980, y: 1000 - 220 - 345 * 0.95 }, legs: 'sit', mood: 'shock', lid: 0, lk: [-0.7, -0.3], arms: { l: [-90, 180, 'fist'], r: [90, 170, 'fist'] } } }); },
  c6truck(t, u) { SE(t, [1060, 560, 1.15 + u * 0.03], { shut: true, signOff: true, canopy: 0.3, tally: 24, extra: () => { pickup(1150, 840, 0.9, t); raiders(t); }, fn: flash3(t) }); },
  c6dee(t, u) { SE(t, [1090, 700, 2.4 + u * 0.05], { shut: true, signOff: true, canopy: 0.3, extra: () => { pickup(1150, 840, 0.9, t); push(1080, 715); ctx.save(); ctx.beginPath(); ctx.rect(-80, -60, 150, 70); ctx.clip(); dee({ x: 0, y: 10, s: 0.3, t, mood: 'dread', lk: [0.8, 0] }); ctx.restore(); pop(); } }); },
  c6pump(t, u) { const hit = Math.floor((t - C6.p5) / 0.5) % 2 === 0; SE(t, [1160, 640, 1.9], { shut: true, signOff: true, canopy: 0.3, extra: () => layer(() => raider({ x: 1300, y: 600, s: 0.42, t, flip: true, arms: { l: [-150, 300, 'open'], r: [200, hit ? 60 : 140, 'fist'] } }), { sx: 3, sy: 4, sb: 5 }), fn: flash3(t) });
    stamp('PROBLEM 5', t, C6.p5 + 0.1, 450, 180, 110, 2810); },
  c6pound(t, u) { SD(t, [1100, 600, 1.3], { slits: 0.6, amb: '#5a5e74', bulge: 0.6, fn: flash3(t), j: { P: { x: 1340, y: 610 }, behind: true, mood: 'shock', lid: 0, lk: [-0.9, -0.2], sweat: 1, arms: { l: [-150, 300, 'open'], r: [150, 300, 'open'] } } });
    stamp('"OPEN UP!"', t, C6.open, 560, 200, 110, 2811); },
  crowbarIns(t, u) { crowbarIns(t, C6.crow); },
  c6calm(t, u) { SD(t, [1340, 470, 2.2 + u * 0.03], { slits: 0.6, amb: '#5a5e74', fn: () => cone(600, 600, 1500, 520, 80, 'rgba(255,250,210,1)', 0.5), j: { P: { x: 1340, y: 560 }, behind: true, mood: 'angry', lid: 0.35, lk: [-0.3, 0], arms: { l: [-150, 300, 'open'], r: [150, 300, 'open'] } } }); },
  c6horde(t, u) { const k = clamp(u / 7); SE(t, [1000, 580, 1.1], { shut: true, signOff: true, canopy: 0.3, tally: 24, extra: () => { pickup(1150, 840, 0.9, t); raiders(t, k > 0.4); for (let i = 0; i < 40; i++) { const r = rng(2820 + i); zSil(-200 - r() * 600 + k * 900, 620 + r() * 120, 0.3, t, i); } }, fn: flash3(t) }); },
  c6flee(t, u) { const k = eo(clamp(u / 2.6)); SE(t, [1000, 580, 1.1], { shut: true, signOff: true, canopy: 0.3, extra: () => { pickup(1150 + k * 1400, 840, 0.9, t); for (let i = 0; i < 6; i++) stroke([[900 + k * 1400 - 400 - i * 30, 700 + i * 22], [900 + k * 1400 - 700, 700 + i * 22]], '#c8d4ee', 4, { a: 0.5 * (1 - k) });
    for (let i = 0; i < 30; i++) { const r = rng(2820 + i); zSil(500 + r() * 900, 620 + r() * 120, 0.3, t, i); } } }); stamp('GONE.', t, LS('c6_07') + 2.4, 1500, 200, 120, 2830); },
  c6look(t, u) { cam(W / 2, H / 2, 1.0 + u * 0.03); bg('#1a2238', 2840); layer(() => dee({ x: 960, y: 520, s: 1.3, t, flip: true, mood: 'dread', lid: 0.2, lk: [-0.8, 0.1], arms: { l: [-150, 300, 'open'], r: [150, 300, 'open'] } }), { sx: 8, sy: 10, sb: 14 });
    rainOut(t, -100, 1100, 1.6); lightmap('#5a5e74', () => { radial(1300, 900, 700, 'rgba(255,50,40,1)', 0.6); radial(700, 300, 800, 'rgba(160,190,255,1)', 0.4); }); pop(); },
  card30(t, u) { chapterCard(t, C6.card + 0.05, 30, 'CLOSING TIME'); }
});
