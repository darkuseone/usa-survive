/* Эп. 4 «Подписки — развод?» — сцены. Общие помощники в engine2/common.js. */
const CUE = {
  charge: Wd('n01', 3), trial: Wd('t01', 3), small: Wd('t01', 5) + 0.2, consp: Wd('n03', 2),
  s17: Wd('t03', 8), s10: Wd('t03', 16), s86: Wd('t04', 8), s219: Wd('t04', 14),
  cancel: Wd('t05', 3), iliad: Wd('t05', 8), ten: Wd('t05', 15), y25: Wd('t06', 1), bln: Wd('t06', 11),
  tip1: Wd('t07', 3), tip2: Wd('t07', 5), tip3: Wd('t07', 14), app: Wd('n06', 3), subsub: Wd('t08', 0), mat: Wd('t08', 3),
  sub: Wd('t09', 0), loop: LN.t09.end + 0.45
};
const SHAKES = [[CUE.charge, 0.3, 10], [CUE.mat, 0.5, 16], [CUE.s219, 0.3, 8], [CUE.bln, 0.3, 10]];
const EP = { title: ['ПОДПИСКИ —', 'РАЗВОД?'], cens: { 'Пиздец.': 'П*ЗДЕЦ.' },
  hot: /^(списали|бесплатный|пробный|бизнес|семнадцати|десять|восемьдесят|шесть|двести|девятнадцать|amazon|«илиада»|илиада|войну|миллиарда|выписку|напоминание|отменяй|сразу|подписками|подписки|кожаный|бесплатно)/i,
  hideMat: [['t08', 'Пиздец', CUE.mat]] };
const TOMP = { x: 860, y: 931, s: 0.62 }, NIKP = { x: 330, y: 1040, s: 0.95 };
const TOMD = { lid: 0.55, lk: [-0.8, 0], smirk: 0.3 };
const NIKD = { legs: 'sit', arms: { l: [-30, 196, 'phone'], r: [40, 214, 'fist'] } };

function scene(t, tomO, nikO, o = {}) {                              // комната вечером + стол + персонажи + лампа
  room4(t, o); chairBack(); desk(t, o);
  if (tomO) layer(() => { const tk = talk('tom', t); tom({ ...TOMP, t, m: tk.m, bob: tk.bob, ...tomO }); }, { sx: 7, sy: 8, sb: 12 });
  if (nikO) layer(() => { const tk = talk('nikita', t); nikita({ ...NIKP, t, m: tk.m, bob: tk.bob, ...NIKD, ...nikO }); }, { sx: 7, sy: 8, sb: 12 });
  chairFront(); if (o.extra) o.extra();
  lamp4(() => { const [px, py] = [NIKP.x - 30 * NIKP.s, NIKP.y + 230 * NIKP.s]; radial(px, py - 60, 260, 'rgba(200,225,255,1)', 0.6); });
}
const notifs = (t, list) => list.forEach(([t0, x, y, sum, i]) => notif(x, y, 0.9, (i % 2 ? 0.05 : -0.05), sum, 4200 + i * 7, popK(t, t0, 0.3) * (t >= t0)));

const SHOTS = [[0, 'cold'], [LN.t01.start - 0.03, 'tomA'], [CUE.trial - 0.08, 'trial'], [LN.n02.start - 0.05, 'nikA'], [LN.t02.start - 0.05, 'tomB'], [LN.n03.start - 0.05, 'nikB'],
  [LN.t03.start - 0.05, 'gym'], [LN.t04.start - 0.05, 'bars'], [LN.n04.start - 0.05, 'nikC'], [CUE.cancel - 0.35, 'maze'], [CUE.iliad - 0.12, 'iliad'], [LN.t06.start - 0.05, 'fine'],
  [LN.n05.start - 0.05, 'wideA'], [CUE.tip1 - 0.3, 'tips'], [LN.n06.start - 0.05, 'nikD'], [CUE.app - 0.05, 'app'], [LN.n06.end + 0.08, 'stare'], [CUE.subsub - 0.05, 'mat'], [LN.t09.start - 0.08, 'final']];

const SH = {
  cold(t) { const [cx, cy, z] = ck(t, [[0, 420, 1050, 1.9], [CUE.charge, 400, 1010, 1.75]]); cam(cx, cy, z, 0, shakeAt(t));
    scene(t, null, { mood: 'angry', brow: -0.7, lk: [0.2, 0.5], arms: { l: [-30, 150, 'phone'], r: [150, 60, 'fist'] } }); pop();
    notifs(t, [[CUE.charge - 0.1, 600, 470, '−799', 0], [CUE.charge + 0.35, 640, 600, '−299', 1], [CUE.charge + 0.7, 600, 730, '−1 490', 2]]); },
  tomA(t) { cam(860, 1000, 2.2); scene(t, ex(t, [[0, { ...TOMD, lid: 0.62 }], [Wd('t01', 1), { lid: 0.5, lk: [-0.9, -0.3], smirk: 0.5 }]]), { mood: 'shock' }); pop(); },
  trial(t, u) { cam(540, 960, 1); slideIn(u, () => { cork(); trialCard(t, CUE.trial, CUE.small); }); pop(); },
  nikA(t) { cam(330, 1110, 2.0); scene(t, TOMD, { mood: 'angry', brow: -0.6, lk: [0.9, 0], arms: { l: [-30, 150, 'phone'], r: [160, 40, 'open'] } }); pop(); },
  tomB(t) { cam(860, 1000, 2.3); scene(t, { ...TOMD, lid: 0.6, smirk: 0.7, lk: [0, 0.1] }, { mood: 'angry' }, { hot: 2 }); pop(); },
  nikB(t) { cam(330, 1110, 2.0); scene(t, TOMD, ex(t, [[0, { mood: 'dumb', brow: 0.4, lk: [0.9, -0.2] }], [CUE.consp, { mood: 'dumb', smile: 0.5, brow: 1, arms: { l: [-30, 196, 'phone'], r: [150, -30, 'point'] } }]])); pop(); },
  gym(t, u) { cam(540, 960, 1, 0, shakeAt(t)); slideIn(u, () => gymInsert(t, CUE)); pop(); },
  bars(t, u) { cam(540, 960, 1, 0, shakeAt(t)); slideIn(u, () => barsInsert(t, CUE)); pop(); },
  nikC(t) { cam(330, 1110, 2.0); scene(t, TOMD, { mood: '', smile: 0.7, lid: 0.3, lk: [0.8, 0], arms: { l: [-30, 196, 'phone'], r: [140, 110, 'fist'] } }); pop(); },
  maze(t, u) { cam(540, 960, 1); slideIn(u, () => cancelMaze(t, CUE)); pop(); },
  iliad(t) { cam(540, 960, 1); iliad(t, CUE); pop(); },
  fine(t, u) { cam(540, 960, 1, 0, shakeAt(t)); slideIn(u, () => fineInsert(t, CUE)); pop(); },
  wideA(t) { cam(630, 1080, 1.25); scene(t, { ...TOMD, lid: 0.6 }, { mood: 'dread', lk: [0.8, -0.2], arms: { l: [-30, 196, 'phone'], r: [180, 40, 'open'] } }); pop(); },
  tips(t, u) { cam(540, 960, 1); slideIn(u, () => tipsInsert(t, CUE)); pop(); },
  nikD(t) { cam(360, 1090, 1.9); scene(t, TOMD, { mood: 'dumb', smile: 0.8, brow: 1, lk: [0.7, -0.5], arms: { l: [-60, 60, 'phone'], r: [160, -60, 'point'] } }); pop(); },
  app(t, u) { cam(540, 960, 1); bg('#4a3a6a', 4300); slideIn(u, () => phoneCut(540, 900, 2.6, -0.04, { screen: () => appScreen(t, CUE.app) })); pop();
    push(540, 260, 1, 0.03); ransom('СЛЕДИТ ЗА ПОДПИСКАМИ', 0, 0, 70, 4301, { reveal: pr(t, CUE.app, CUE.app + 0.4) }); pop(); },
  stare(t) { cam(860, 990, 2.3); scene(t, { lid: 0.62, lk: [-0.2, 0.15], smirk: 0, brow: -0.2 }, { mood: 'dumb' }); pop(); },     // тишина и неподвижность
  mat(t) { cam(860, 990, t > CUE.mat ? 2.5 : 2.3, 0, shakeAt(t)); scene(t, { lid: t > CUE.mat ? 0.88 : 0.7, lk: [0, 0.3], brow: -0.8, smirk: 0 }, { mood: 'dumb' }); pop();
    if (t > CUE.mat) { push(540, 330, 1, -0.04); ransom('П*ЗДЕЦ', 0, 0, 150, 4310, { reveal: pr(t, CUE.mat, CUE.mat + 0.2), pop: true }); pop(); } },
  final(t) { cam(630, 1080, 1.25); scene(t, ex(t, [[0, { ...TOMD, lid: 0.5, smirk: 1 }], [CUE.sub, { lid: 0.45, lk: [0, 0.2], paw: 1, pawX: 175, pawY: 110, smirk: 1 }], [CUE.loop - 0.3, { paw: 0, lk: [-0.8, 0] }]]),
      ex(t, [[0, { mood: '', smile: 0.6, lk: [0.6, 0] }], [CUE.loop, { mood: 'shock', brow: 0.8, smile: 0, lk: [0.2, 0.5], arms: { l: [-30, 150, 'phone'], r: [150, 60, 'open'] } }]])); pop();
    if (t > CUE.sub && t < CUE.loop) { push(540, 300, 1, -0.03); ransom('ПЕРЕШЛИ ТОМУ,', 0, 0, 92, 4320, { reveal: pr(t, CUE.sub, CUE.sub + 0.3) }); pop();
      push(540, 430, 1, 0.02); ransom('У КОГО 5 ПОДПИСОК', 0, 0, 80, 4321, { reveal: pr(t, CUE.sub + 0.3, CUE.sub + 0.7) }); pop(); }
    notifs(t, [[CUE.loop, 600, 560, '−299', 3]]); }
};
