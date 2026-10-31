/* Эп. 7 «Курицу моют?» — сцены. Общие помощники в engine2/common.js. */
const CUE = {
  washed: Wd('n01', 2), spray: Wd('t01', 6), mom: Wd('n02', 2), p60: Wd('t02', 7), sink: Wd('t02', 13), p26: Wd('t03', 2), splash: Wd('t03', 7),
  wash: Wd('t04', 1), seventh: Wd('t04', 7), tip1: Wd('t05', 0), tip2: Wd('t05', 8), tip3: Wd('t05', 11), hands: Wd('n05', 6),
  mat: Wd('t06', 0), p31: Wd('t06', 3), sub: Wd('t07', 0), soap: Wd('t07', 3), loop: LN.t07.end + 0.3
};
const SHAKES = [[CUE.spray, 0.3, 10], [CUE.mat, 0.5, 16], [CUE.seventh, 0.25, 8], [CUE.p60, 0.25, 8]];
const EP = { title: ['КУРИЦУ', 'МОЮТ?'], cens: { '…Сука.': '…С*КА.' },
  hot: /^(курицу|помыл|чистенькая|распылил|мама|шестидесяти|процентов|раковине|двадцати|шести|салате|брызги|седьмого|готовка|мылом|доска|руки|тридцать|один|руками|кожаный)/i,
  hideMat: [['t06', '…Сука', CUE.mat]] };
const TOMP = { x: 860, y: 911, s: 0.62 }, NIKP = { x: 300, y: 1050, s: 0.95 };
const TOMD = { lid: 0.55, lk: [-0.8, 0], smirk: 0.3 };
const HOLD = { arms: { l: [-150, 300, 'open'], r: [190, 110, 'fist'] }, chick: true };
const handW = a => [NIKP.x + a[0] * NIKP.s, NIKP.y + a[1] * NIKP.s];

function scene(t, tomO, nikO, o = {}) {
  kitchen7(t, o);
  if (tomO) layer(() => { const tk = talk('tom', t); tom({ ...TOMP, t, m: tk.m, bob: tk.bob, ...tomO }); }, { sx: 7, sy: 8, sb: 12 });
  if (nikO) layer(() => { const tk = talk('nikita', t), n = { legs: 'stand', ...nikO }; nikita({ ...NIKP, t, m: tk.m, bob: tk.bob, ...n });
    if (n.chick) { const [hx, hy] = handW(n.arms.r); chicken(hx + 10, hy + 20, 0.85, -0.2); } }, { sx: 7, sy: 8, sb: 12 });
  nightLight();
  microbes(t, o.uv ?? 1, SPLASH.concat(nikO && (o.uv ?? 1) > 0 ? [[NIKP.x + 20, NIKP.y + 230, 5, 140]] : []));
}

const SHOTS = [[0, 'cold'], [LN.t01.start - 0.03, 'tomA'], [LN.n02.start - 0.05, 'nikA'], [LN.t02.start - 0.05, 'wideA'], [CUE.p60 - 0.25, 'usda'], [LN.t03.start - 0.05, 'salad'],
  [LN.n03.start - 0.05, 'nikB'], [LN.t04.start - 0.05, 'seventh'], [LN.n04.start - 0.05, 'nikC'], [CUE.tip1 - 0.3, 'tips'], [LN.n05.start - 0.05, 'nikD'],
  [LN.n05.end + 0.06, 'stare'], [CUE.mat - 0.05, 'mat'], [CUE.p31 - 0.08, 'hands'], [LN.t07.start - 0.08, 'final']];

const SH = {
  cold(t) { const [cx, cy, z] = ck(t, [[0, 440, 1120, 1.75], [CUE.washed, 430, 1110, 1.6]]); cam(cx, cy, z); scene(t, null, { mood: '', smile: 0.9, lid: 0.3, lk: [0.6, 0], ...HOLD }, { water: true }); pop(); },
  tomA(t) { cam(860, 1000, t > CUE.spray ? 2.4 : 2.2, 0, shakeAt(t)); scene(t, ex(t, [[0, { ...TOMD, lid: 0.62 }], [CUE.spray, { lid: 0.5, lk: [-0.9, -0.3], smirk: 0.6 }]]), { mood: '', ...HOLD }); pop(); },
  nikA(t) { cam(330, 1120, 2.0); scene(t, TOMD, { mood: 'angry', brow: -0.5, lk: [0.9, 0], ...HOLD }); pop(); },
  wideA(t) { cam(600, 1100, 1.25); scene(t, { ...TOMD, paw: 1, pawX: 175, pawY: 110 }, { mood: 'dumb', lk: [0.8, 0], ...HOLD }); pop(); },
  usda(t, u) { cam(540, 960, 1, 0, shakeAt(t)); slideIn(u, () => usdaInsert(t, CUE)); pop(); },
  salad(t, u) { cam(540, 960, 1); slideIn(u, () => saladInsert(t, CUE)); pop(); },
  nikB(t) { cam(330, 1120, 2.0); scene(t, TOMD, { mood: '', smile: 0.6, lid: 0.3, lk: [0.9, 0], arms: { l: [-150, 300, 'open'], r: [150, -30, 'point'] } }); pop(); },
  seventh(t, u) { cam(540, 960, 1, 0, shakeAt(t)); slideIn(u, () => seventhInsert(t, CUE)); pop(); },
  nikC(t) { cam(330, 1120, 2.0); scene(t, TOMD, { mood: 'dread', brow: 0.8, lk: [0.9, 0], ...HOLD }); pop(); },
  tips(t, u) { cam(540, 960, 1); slideIn(u, () => tips7(t, CUE)); pop(); },
  nikD(t) { cam(360, 1100, 1.9); scene(t, ex(t, [[0, TOMD], [CUE.hands, { lid: 0.3, lk: [-0.9, -0.2], smirk: 0 }]]), ex(t, [[0, { mood: 'dumb', smile: 0.8, brow: 1, lk: [0.7, -0.3], ...HOLD }],
      [CUE.hands, { mood: 'dumb', smile: 0.9, brow: 1, lk: [0.2, -0.3], arms: { l: [-190, -40, 'open'], r: [190, -40, 'open'] }, chick: false }]])); pop(); },
  stare(t) { cam(860, 990, 2.3); scene(t, { lid: 0.62, lk: [-0.2, 0.15], smirk: 0, brow: -0.2 }, { mood: 'dumb' }); pop(); },
  mat(t) { cam(860, 990, 2.5, 0, shakeAt(t)); scene(t, { lid: 0.88, lk: [0, 0.3], brow: -0.8, smirk: 0 }, { mood: 'dumb' }); pop();
    push(540, 330, 1, -0.04); ransom('С*КА', 0, 0, 170, 7800, { reveal: pr(t, CUE.mat, CUE.mat + 0.2), pop: true }); pop(); },
  hands(t, u) { cam(540, 960, 1); slideIn(u, () => handsInsert(t, CUE)); pop(); },
  final(t) { cam(600, 1100, 1.25); scene(t, ex(t, [[0, { ...TOMD, lid: 0.5, smirk: 0.8 }], [CUE.sub, { lid: 0.45, lk: [0, 0.2], paw: 1, pawX: 175, pawY: 110, smirk: 0.8 }], [CUE.loop - 0.3, { paw: 0, lk: [-0.8, 0] }]]),
      ex(t, [[0, { mood: 'dread', lk: [0.8, 0.2], arms: { l: [-150, 300, 'open'], r: [190, 110, 'fist'] } }], [CUE.loop, { mood: '', smile: 0.9, lid: 0.3, lk: [0.6, 0], ...HOLD }]]), { water: t > CUE.soap, uv: t > CUE.loop ? 1 : 0.6 }); pop();
    if (t > CUE.sub && t < CUE.loop) { push(540, 300, 1, -0.03); ransom('ПЕРЕШЛИ ТОМУ,', 0, 0, 92, 7820, { reveal: pr(t, CUE.sub, CUE.sub + 0.3) }); pop();
      push(540, 430, 1, 0.02); ransom('КТО МОЕТ КУРИЦУ', 0, 0, 80, 7821, { reveal: pr(t, CUE.sub + 0.3, CUE.sub + 0.7) }); pop(); } }
};
