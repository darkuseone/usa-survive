/* Эп. 9 «Почему мы терпим?» — сцены. Общие помощники в engine2/common.js. */
const CUE = {
  used: Wd('n01', 7), gaveup: Wd('t01', 4), frog: Wd('n02', 7), jump: Wd('t02', 3), zoo: Wd('t02', 4), out: Wd('t02', 10), people: Wd('t02', 11),
  loss: Wd('t03', 1), twice: Wd('t03', 5), kahn: Wd('t03', 11), scary: Wd('t03', 13),
  plan: Wd('t04', 3), exit: Wd('t04', 10), paper: Wd('t04', 12), novice: Wd('t04', 13), p86: Wd('t04', 16), p37: Wd('t04', 20),
  worse: Wd('t05', 0), fifty: Wd('t05', 1), y16: Wd('t05', 8), def: Wd('t05', 15), act: Wd('t05', 17),
  today: Wd('t06', 3), call: Wd('t06', 4), brain: Wd('t06', 7), dep: Wd('t06', 13), second: Wd('n07', 2),
  mat: Wd('t07', 0), frog2: Wd('t07', 1), sub: Wd('t08', 0), pour: Wd('t08', 3), loop: LN.t08.end + 0.3
};
const SHAKES = [[CUE.gaveup, 0.3, 8], [CUE.jump, 0.25, 8], [CUE.twice, 0.25, 8], [CUE.y16, 0.25, 8], [CUE.mat, 0.5, 16]];
const EP = { title: ['ПОЧЕМУ МЫ', 'ТЕРПИМ?'], cens: { '…Блять.': '…БЛ*ТЬ.' },
  hot: /^(полгода|капает|привык|сдался|терпят|лягушка|выпрыгнет|зоологи|кипятке|люди|потерю|вдвое|канеман|страшно|хуже|сама|бумажка|восемьдесят|шесть|процентов|тридцать|семь|беспомощности|шестнадцатом|умолчанию|действовать|шаг|сегодня|сантехнику|зависит|второе|ведро|выпрыгнула|кожаный|вылей)/i,
  hideMat: [['t07', '…Блять', CUE.mat]] };
const TOMP = { x: 870, y: 951, s: 0.62 }, NIKP = { x: 330, y: 1077, s: 0.95 };
const TOMD = { lid: 0.55, lk: [-0.8, -0.1], smirk: 0.2 };
const PROUD = { mood: 'dumb', smile: 0.8, brow: 0.5, lk: [0.3, -0.2], arms: { l: [-150, 300, 'open'], r: [190, 60, 'open'] } };
const UPB = { l: [-150, 300, 'open'], r: [190, -200, 'fist'] };
const handW = a => [NIKP.x + a[0] * NIKP.s, NIKP.y + a[1] * NIKP.s];

function scene(t, tomO, nikO) {
  bathroom(t);
  if (tomO) layer(() => { const tk = talk('tom', t); tom({ ...TOMP, t, m: tk.m, bob: tk.bob, ...tomO }); }, { sx: 7, sy: 8, sb: 12 });
  if (nikO) layer(() => { const tk = talk('nikita', t), n = { legs: 'stand', ...PROUD, ...nikO }; nikita({ ...NIKP, t, m: tk.m, bob: tk.bob, ...n });
    if (n.hold) { const [hx, hy] = handW(n.arms.r), k = n.holdK ?? 1; bucketP(hx, hy + 206 * k, 0.8 * k, 0, t, { rip: false, col: '#e2533a', seed: 5 }); } }, { sx: 7, sy: 8, sb: 12 });
  bathLight();
}
const NCL = (t, z = 2.0, sh = 0) => cam(NIKP.x + 10, NIKP.y + 70, z, 0, sh);
const TCL = (t, z = 2.2, sh = 0) => cam(TOMP.x, TOMP.y + 80, z, 0, sh);

const SHOTS = [[0, 'cold'], [LN.t01.start - 0.03, 'tomA'], [LN.n02.start - 0.05, 'nikA'], [LN.t02.start - 0.05, 'myth'], [CUE.zoo - 0.05, 'frog'], [CUE.people - 0.05, 'wide'],
  [LN.n03.start - 0.05, 'nikB'], [CUE.loss - 0.05, 'scale'], [CUE.scary - 0.05, 'tomC'], [LN.n04.start - 0.05, 'nikC'], [LN.t04.start - 0.05, 'form'], [CUE.novice - 0.05, 'bars'],
  [LN.n05.start - 0.05, 'nikD'], [CUE.fifty - 0.05, 'help1'], [CUE.y16 - 0.3, 'help2'], [CUE.act - 0.05, 'tomE'], [LN.n06.start - 0.05, 'nikE'], [LN.t06.start - 0.05, 'tomF'],
  [CUE.call - 0.05, 'step'], [LN.n07.start - 0.05, 'nikF'], [LN.n07.end + 0.06, 'stare'], [CUE.mat - 0.05, 'mat'], [CUE.frog2 - 0.05, 'frogX'], [LN.t08.start - 0.08, 'final']];

const SH = {
  cold(t) { const [cx, cy, z] = ck(t, [[0, 470, 1010, 1.55], [CUE.used, 480, 1020, 1.62]]); cam(cx, cy, z);
    scene(t, null, ex(t, [[0, PROUD], [CUE.used, { smile: 1, brow: 0.8, lk: [0.2, -0.4] }]])); pop(); },
  tomA(t) { TCL(t, t > CUE.gaveup ? 2.5 : 2.25, shakeAt(t)); scene(t, ex(t, [[0, { ...TOMD, lid: 0.62 }], [CUE.gaveup, { lid: 0.5, lk: [-0.9, 0], smirk: 0.5, brow: -0.3 }]]), PROUD); pop(); },
  nikA(t) { NCL(t); scene(t, TOMD, ex(t, [[0, { mood: 'dumb', smile: 0.4, brow: 0.6, lk: [0.9, 0], arms: { l: [-190, 60, 'open'], r: [190, 60, 'open'] } }], [CUE.frog, { smile: 0.7, lk: [0.6, -0.6] }]])); pop(); },
  myth(t, u) { cam(540, 960, 1, 0, shakeAt(t)); slideIn(u, () => mythCard(t, CUE)); pop(); },
  frog(t) { cam(540, 960, 1); frogPot(t, CUE); pop(); },
  wide(t) { const [cx, cy, z] = ck(t, [[CUE.people - 0.05, 610, 1090, 1.3], [LN.n03.start, 560, 1100, 1.42]]); cam(cx, cy, z);
    scene(t, { ...TOMD, lid: 0.45, smirk: 0.6 }, { mood: 'dumb', smile: 0.6, lk: [0.6, 0.6], brow: 0.3 }); pop(); },
  nikB(t) { NCL(t, 2.1, 4); scene(t, TOMD, { mood: 'shock', brow: 1, lk: [0.9, -0.1], arms: { l: [-190, 40, 'open'], r: [190, 40, 'open'] } }); pop(); },
  scale(t, u) { cam(540, 960, 1, 0, shakeAt(t)); slideIn(u, () => scaleIns(t, CUE)); pop(); },
  tomC(t) { TCL(t, 2.2); scene(t, { ...TOMD, paw: 1, pawX: 175, pawY: 110, smirk: 0.4 }, { mood: 'dread' }); pop(); },
  nikC(t) { NCL(t, 2.05); scene(t, TOMD, { mood: 'shock', brow: 1, smile: 0, lk: [0.9, -0.2], arms: { l: [-150, 300, 'open'], r: [150, -30, 'point'] } }); pop(); },
  form(t, u) { cam(540, 960, 1); slideIn(u, () => formIns(t, CUE)); pop(); },
  bars(t, u) { cam(540, 960, 1); slideIn(u, () => barsIns(t, CUE)); pop(); },
  nikD(t) { NCL(t, t > CUE.worse ? 2.2 : 2.0); scene(t, TOMD, ex(t, [[0, { mood: 'dumb', smile: 0.7, brow: 0.8, lk: [0.9, -0.3], arms: { l: [-150, 300, 'open'], r: [190, 110, 'open'] } }],
      [CUE.worse, { mood: 'dread', smile: 0, brow: 0.9, lk: [0.9, 0] }]])); pop(); },
  help1(t, u) { cam(540, 960, 1); slideIn(u, () => helpIns(t, CUE)); pop(); },
  help2(t) { cam(540, 960, 1, 0, shakeAt(t)); helpIns(t, CUE, { b: true }); pop(); },
  tomE(t) { cam(610, 1090, 1.3); scene(t, { ...TOMD, paw: 1, pawX: 175, pawY: 110, lid: 0.5 }, { mood: 'dread', lk: [0.8, -0.2], arms: { l: [-150, 300, 'open'], r: [150, 300, 'open'] } }); pop(); },
  nikE(t) { NCL(t, 2.1, 3); scene(t, TOMD, { mood: 'dread', brow: 1, lk: [0.9, -0.2], arms: { l: [-190, -60, 'open'], r: [190, -60, 'open'] } }); pop(); },
  tomF(t) { TCL(t, t > CUE.today ? 2.4 : 2.2); scene(t, { ...TOMD, lid: 0.6, smirk: 0, lk: [-0.7, 0] }, { mood: 'dread' }); pop(); },
  step(t, u) { cam(540, 960, 1); slideIn(u, () => stepIns(t, CUE)); pop(); },
  nikF(t) { cam(470, 1060, 1.55); const k = popK(t, CUE.second - 0.1, 0.3);
    scene(t, ex(t, [[0, TOMD], [CUE.second, { lid: 0.3, lk: [-0.9, -0.3], smirk: 0 }]]), { mood: 'dumb', smile: 1, brow: 1, lk: [0.5, -0.4], hold: t > CUE.second - 0.1, holdK: k, arms: UPB }); pop(); },
  stare(t) { TCL(t, 2.3); scene(t, { lid: 0.62, lk: [-0.2, 0.1], smirk: 0, brow: -0.2 }, { mood: 'dumb', smile: 1, hold: true, arms: UPB }); pop(); },
  mat(t) { TCL(t, 2.5, shakeAt(t)); scene(t, { lid: 0.88, lk: [0, 0.3], brow: -0.8, smirk: 0 }, { mood: 'dumb', smile: 1, hold: true, arms: UPB }); pop();
    push(540, 330, 1, -0.04); ransom('БЛ*ТЬ', 0, 0, 170, 9950, { reveal: pr(t, CUE.mat, CUE.mat + 0.2), pop: true }); pop(); },
  frogX(t, u) { cam(540, 960, 1); slideIn(u, () => frogPot(t, CUE, { out: true })); pop(); },
  final(t) { const [cx, cy, z] = ck(t, [[0, 610, 1090, 1.3], [CUE.loop - 0.2, 610, 1090, 1.3], [DUR, 475, 1012, 1.55]]); cam(cx, cy, z);
    scene(t, ex(t, [[0, { ...TOMD, lid: 0.5, smirk: 0.8 }], [CUE.sub, { lid: 0.45, lk: [0, 0.2], paw: 1, pawX: 175, pawY: 110, smirk: 0.8 }], [CUE.loop - 0.3, { paw: 0, lk: [-0.8, -0.1], smirk: 0.2 }]]),
      ex(t, [[0, { mood: 'dumb', smile: 0.8, lk: [0.8, -0.2], hold: true, arms: UPB }], [CUE.pour, { mood: 'dread', smile: 0, brow: 0.8, lk: [0.6, 0.4] }], [CUE.loop, { ...PROUD, hold: false }]])); pop();
    if (t > CUE.sub && t < CUE.loop) { push(540, 300, 1, -0.03); ransom('ПЕРЕШЛИ ТОМУ,', 0, 0, 92, 9960, { reveal: pr(t, CUE.sub, CUE.sub + 0.3) }); pop();
      push(540, 430, 1, 0.02); ransom('КТО ВСЁ ТЕРПИТ', 0, 0, 80, 9961, { reveal: pr(t, CUE.sub + 0.3, CUE.sub + 0.7) }); pop(); } }
};
