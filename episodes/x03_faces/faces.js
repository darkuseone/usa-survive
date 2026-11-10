/* проверка эмоций Joe (крупно) */
const EP = { title: null, subs: false }; const SHAKES = []; const CUE = {}; const SH = {}; const SHOTS = [[0, 'f']];
function hudFrame() {}
const F = [['calm', {}], ['terror', { mood: 'shock', pupil: 0.55, eyeTilt: 0.8, mouthKind: 'grimace', pale: 1, tremble: 1, sweat: 1 }],
  ['scream', { mood: 'shock', scream: 1, eyeTilt: 0.6, pupil: 0.6 }], ['determined', { eyeTilt: -0.7, mouthKind: 'clench', lk: [0.3, 0] }],
  ['hold breath', { eyeTilt: 0.4, mouthKind: 'puff', lk: [-0.7, -0.2], sweat: 1 }], ['fear wavy', { eyeTilt: 0.9, mouthKind: 'wavy', pupil: 0.7, lk: [0.8, 0.1], pale: 0.6 }]];
SH.f = function (t) { rectP(-20, -20, W + 40, H + 40, '#3b4660', { seed: 1, line: false });
  F.forEach(([nm, o], i) => { const x = 170 + i * 316; layer(() => joe({ x, y: 330, s: 1.0, t: 0.3, still: true, noShadow: true, arms: { l: [-150, 300, 'open'], r: [150, 300, 'open'] }, ...o }), {}); txt(nm, x, 140, 40, { font: 'Inter Black', col: '#fbf8f0' }); }); };
