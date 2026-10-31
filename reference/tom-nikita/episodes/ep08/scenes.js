/* Эп. 8 «Лампочный заговор?» — сцены. Общие помощники в engine2/common.js. */
const CUE = {
  pop: Wd('n01', 1), planned: Wd('t01', 1), agreed: Wd('t01', 5), y24: Wd('t02', 0), cartel: Wd('t02', 8), k1000: Wd('t02', 14),
  lab: Wd('t03', 0), fine: Wd('t03', 10), liver: Wd('t04', 4), y1901: Wd('t04', 8), apple: Wd('t05', 2), bln: Wd('t05', 5),
  newph: Wd('n05', 3), mat: Wd('t06', 0), sub: Wd('t07', 0), loop: LN.t07.end + 0.3
};
const SHAKES = [[CUE.pop, 0.35, 12], [CUE.mat, 0.5, 16], [CUE.fine, 0.25, 8], [CUE.bln, 0.25, 8]];
const EP = { title: ['ЛАМПОЧНЫЙ', 'ЗАГОВОР?'], cens: { '…Сука.': '…С*КА.' },
  hot: /^(перегорела|третья|задумано|договорились|женева|картель|«фебус»|тысячу|часов|штраф|ливермора|горит|девятьсот|первого|apple|полумиллиарда|долларов|айфоны|айфон|расчёт|кожаный|перегорел)/i,
  hideMat: [['t06', '…Сука', CUE.mat]] };
const TOMP = { x: 900, y: 1021, s: 0.62 }, NIKP = { x: 420, y: 897, s: 0.95 };
const TOMD = { lid: 0.55, lk: [-0.8, -0.2], smirk: 0.3 };
const UP = { arms: { l: [-150, 300, 'open'], r: [150, -230, 'fist'] } };
const handW = a => [NIKP.x + a[0] * NIKP.s, NIKP.y + a[1] * NIKP.s];

function scene(t, tomO, nikO, o = {}) {
  const lit = o.lit ?? 0; stairwell(t, { lit, bulb: !(nikO && nikO.hold) });
  if (tomO) layer(() => { const tk = talk('tom', t); tom({ ...TOMP, t, m: tk.m, bob: tk.bob, ...tomO }); }, { sx: 7, sy: 8, sb: 12 });
  if (nikO) layer(() => { const tk = talk('nikita', t), n = { legs: 'stand', ...UP, ...nikO }; nikita({ ...NIKP, t, m: tk.m, bob: tk.bob, ...n });
    if (n.hold) { const [hx, hy] = handW(n.arms.r); bulbP(hx, hy - 30, 0.9, 0, 8090); } }, { sx: 7, sy: 8, sb: 12 });
  stairLight(lit);
}
const flash = t => t >= CUE.pop - 0.1 && t < CUE.pop + 0.12 ? 1 : 0;

const SHOTS = [[0, 'cold'], [LN.t01.start - 0.03, 'tomA'], [LN.n02.start - 0.05, 'nikA'], [CUE.y24 - 0.05, 'phoebus'], [LN.t03.start - 0.05, 'lab'], [LN.n03.start - 0.05, 'nikB'],
  [LN.t04.start - 0.05, 'tomB'], [CUE.liver - 0.05, 'liver'], [LN.n04.start - 0.05, 'nikC'], [LN.t05.start - 0.05, 'apple'], [LN.n05.start - 0.05, 'nikD'],
  [LN.n05.end + 0.06, 'stare'], [CUE.mat - 0.05, 'mat'], [LN.t07.start - 0.08, 'final']];

const SH = {
  cold(t) { const [cx, cy, z] = ck(t, [[0, 500, 880, 1.7], [CUE.pop, 490, 900, 1.6]]); cam(cx, cy, z, 0, shakeAt(t));
    scene(t, null, ex(t, [[0, { mood: 'dumb', lk: [0.5, -0.9], brow: 0.4 }], [CUE.pop + 0.1, { mood: 'angry', brow: -0.7, lk: [0.6, 0.2], hold: true, arms: { l: [-190, 120, 'open'], r: [150, -120, 'fist'] } }]]), { lit: t < CUE.pop ? 1 : flash(t) * 2 }); pop();
    if (t > CUE.pop - 0.05 && t < CUE.pop + 0.6) { push(640, 520, 1, 0.1); ransom('ПЫЩ!', 0, 0, 110, 8500, { pop: true, reveal: pr(t, CUE.pop - 0.05, CUE.pop + 0.1) }); pop(); } },
  tomA(t) { cam(900, 1100, t > CUE.agreed ? 2.4 : 2.2); scene(t, ex(t, [[0, { ...TOMD, lid: 0.62 }], [CUE.agreed, { lid: 0.5, lk: [-0.9, -0.4], smirk: 0.6 }]]), { mood: 'angry', hold: true }); pop(); },
  nikA(t) { cam(430, 980, 2.0); scene(t, TOMD, { mood: 'dread', brow: 0.7, lk: [0.9, 0.3], hold: true, arms: { l: [-150, 300, 'open'], r: [150, -120, 'fist'] } }); pop(); },
  phoebus(t, u) { cam(540, 960, 1, 0, shakeAt(t)); slideIn(u, () => phoebusCard(t, CUE)); pop(); },
  lab(t, u) { cam(540, 960, 1, 0, shakeAt(t)); slideIn(u, () => labInsert(t, CUE)); pop(); },
  nikB(t) { cam(430, 980, 2.1, 0, 4); scene(t, TOMD, { mood: 'angry', brow: -0.9, lk: [0.9, 0.3], hold: true, arms: { l: [-190, 40, 'open'], r: [150, -120, 'fist'] } }); pop(); },
  tomB(t) { cam(900, 1100, 2.2); scene(t, { ...TOMD, paw: 1, pawX: 175, pawY: 110, smirk: 0.6 }, { mood: 'dumb', hold: true }); pop(); },
  liver(t, u) { cam(540, 960, 1); slideIn(u, () => centennial(t, CUE)); pop(); },
  nikC(t) { cam(430, 980, 2.0); scene(t, TOMD, { mood: 'dumb', smile: 0.5, brow: 0.4, lk: [0.9, 0.2], hold: true, arms: { l: [-150, 300, 'open'], r: [150, -120, 'fist'] } }); pop(); },
  apple(t, u) { cam(540, 960, 1, 0, shakeAt(t)); slideIn(u, () => appleInsert(t, CUE)); pop(); },
  nikD(t) { cam(600, 1060, 1.3); scene(t, ex(t, [[0, TOMD], [CUE.newph, { lid: 0.3, lk: [-0.9, -0.3], smirk: 0 }]]), { mood: 'dumb', smile: 0.9, brow: 1, lk: [0.7, -0.4], hold: true, arms: { l: [-150, 300, 'open'], r: [160, -230, 'fist'] } }); pop();
    if (t > CUE.newph) { push(820, 520, popK(t, CUE.newph, 0.3), 0.06); phoneCut(0, 0, 0.9, 0, {}); pop(); push(820, 330, 1, -0.03); ransom('НОВЫЙ!', 0, 0, 80, 8520, { reveal: pr(t, CUE.newph, CUE.newph + 0.3) }); pop(); } },
  stare(t) { cam(900, 1090, 2.3); scene(t, { lid: 0.62, lk: [-0.2, 0.1], smirk: 0, brow: -0.2 }, { mood: 'dumb', hold: true }); pop(); },
  mat(t) { cam(900, 1090, 2.5, 0, shakeAt(t)); scene(t, { lid: 0.88, lk: [0, 0.3], brow: -0.8, smirk: 0 }, { mood: 'dumb', hold: true }); pop();
    push(540, 330, 1, -0.04); ransom('С*КА', 0, 0, 170, 8530, { reveal: pr(t, CUE.mat, CUE.mat + 0.2), pop: true }); pop(); },
  final(t) { cam(640, 1060, 1.3); scene(t, ex(t, [[0, { ...TOMD, lid: 0.5, smirk: 0.8 }], [CUE.sub, { lid: 0.45, lk: [0, 0.2], paw: 1, pawX: 175, pawY: 110, smirk: 0.8 }], [CUE.loop - 0.3, { paw: 0, lk: [-0.8, -0.2] }]]),
      ex(t, [[0, { mood: 'dread', lk: [0.8, 0.2], hold: true, arms: { l: [-150, 300, 'open'], r: [150, -120, 'fist'] } }], [CUE.loop, { mood: 'dumb', lk: [0.5, -0.9], brow: 0.4, hold: false, arms: UP.arms }]]), { lit: t > CUE.loop ? 1 : 0 }); pop();
    if (t > CUE.sub && t < CUE.loop) { push(540, 300, 1, -0.03); ransom('ПЕРЕШЛИ ТОМУ,', 0, 0, 92, 8540, { reveal: pr(t, CUE.sub, CUE.sub + 0.3) }); pop();
      push(540, 430, 1, 0.02); ransom('У КОГО ВСЁ ПЕРЕГОРАЕТ', 0, 0, 72, 8541, { reveal: pr(t, CUE.sub + 0.3, CUE.sub + 0.7) }); pop(); } }
};
