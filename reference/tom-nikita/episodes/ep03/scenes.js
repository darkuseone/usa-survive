/* Эп. 3 «Телефон в рис?» — сцены. Общие помощники в engine2/common.js. */
const CUE = {
  died: Wd('n01', 7), hunt: Wd('t01', 5), all: Wd('n02', 2), apple: Wd('t02', 2), dont: Wd('t02', 7), particles: Wd('t02', 12),
  corr: Wd('t03', 1), dive: Wd('t03', 6), rice: Wd('t03', 7), cmp: Wd('t04', 2), last: Wd('t04', 7), dazhe: Wd('t04', 11), litter: Wd('t04', 13),
  tap: Wd('t05', 0), air: Wd('t05', 5), charge: Wd('t05', 10), half: Wd('t05', 15), day: Wd('t05', 16),
  fen: Wd('t06', 2), cotton: Wd('t06', 4), service: Wd('t06', 10), buck: Wd('n05', 3), mat: Wd('t07', 0), sub: Wd('t08', 0), out: Wd('t08', 5)
};
const SHAKES = [[CUE.died, 0.3, 10], [CUE.mat, 0.5, 16], [CUE.last, 0.3, 8], [CUE.buck, 0.25, 6]];
const EP = { title: ['ТЕЛЕФОН', 'В РИС?'], cens: { '…Ёб': 'Ё*' },
  hot: /^(рис|рисе|apple|айфон|коррозия|последнее|семи|наполнитель|разъёмом|сквозняк|полчаса|суток|фена|ваток|сервис|гречку|гречки|кожаный|частицы)/i,
  hideMat: [['t07', '…Ёб', CUE.mat]] };
const TOMP = { x: 830, y: 911, s: 0.62 }, NIKP = { x: 330, y: 1050, s: 0.95 };
const TOMD = { lid: 0.55, lk: [-0.8, 0], smirk: 0.3 };
const NIKD = { legs: 'stand', arms: { l: [-150, 300, 'open'], r: [190, 110, 'phone'] } };

function scene(t, tomO, nikO, o = {}) {                              // кухня днём + персонажи + свет из окна
  kitchen(t, o); counter(t, o);
  if (tomO) layer(() => { const tk = talk('tom', t); tom({ ...TOMP, t, m: tk.m, bob: tk.bob, ...tomO }); }, { sx: 7, sy: 8, sb: 12 });
  if (nikO) layer(() => { const tk = talk('nikita', t); nikita({ ...NIKP, t, m: tk.m, bob: tk.bob, ...NIKD, ...nikO }); }, { sx: 7, sy: 8, sb: 12 });
  if (o.extra) o.extra();
  lightmap('#d9cdbd', () => { radial(415, 460, 1150, 'rgba(255,250,232,1)', 0.95); radial(700, 1200, 1100, 'rgba(255,255,255,1)', 0.35); });
}
function handW(arm) { return [NIKP.x + arm[0] * NIKP.s, NIKP.y + arm[1] * NIKP.s]; }   // где рука Никиты в мире
function riceFall(t, x, y, n, seed) { for (let i = 0; i < n; i++) { const r = rng(seed + i), ph = ((t * 1.3 + r()) % 1); ellP(x + (r() - 0.5) * 60 + ph * (r() - 0.5) * 80, y + ph * ph * 420, 7, 3.4, '#f6f1e2', { rot: r() * 3 + t * 4, lw: 1.2, np: 10, tex: false, seed: seed + i }); } }

const SHOTS = [[0, 'cold'], [LN.t01.start - 0.03, 'tomA'], [CUE.hunt - 0.05, 'hunt'], [LN.n02.start - 0.05, 'nikA'], [LN.t02.start - 0.05, 'tomB'], [CUE.apple - 0.08, 'apple'],
  [CUE.particles - 0.08, 'port'], [LN.n03.start - 0.05, 'nikB'], [LN.t03.start - 0.05, 'corr'], [LN.t04.start - 0.05, 'table'], [CUE.dazhe - 0.05, 'scale'],
  [LN.n04.start - 0.05, 'wideA'], [CUE.tap - 0.05, 'tap'], [CUE.air - 0.05, 'window'], [CUE.charge - 0.05, 'charge'], [LN.t06.start - 0.05, 'nono'],
  [LN.n05.start - 0.05, 'buck'], [LN.n05.end + 0.05, 'stare'], [CUE.mat - 0.05, 'mat'], [LN.t08.start - 0.08, 'final']];

const SH = {
  cold(t) { const [cx, cy, z] = ck(t, [[0, 470, 1130, 2.3], [CUE.died, 440, 1120, 2.05]]); cam(cx, cy, z, 0, shakeAt(t));
    const sh = t < CUE.died ? Math.sin(t * 40) * 16 : 0, arm = [190 + sh, 90, 'phone'], [hx, hy] = handW(arm);
    scene(t, null, { mood: 'angry', brow: -0.6, lk: [0.6, 0.4], arms: { l: [-150, 300, 'fist'], r: arm }, phoneLit: t < CUE.died ? Math.floor(t * 10) % 4 !== 0 : false },
      { spill: true, extra: () => { riceFall(t, hx, hy + 40, 7, 4000); if (t > CUE.died) txt('✕', hx, hy + 40, 40, { font: 'Inter Black', col: '#d8342c', a: pr(t, CUE.died, CUE.died + 0.1) }); } }); pop(); },
  tomA(t) { cam(830, 990, 2.2); scene(t, ex(t, [[0, { ...TOMD, lid: 0.62 }], [Wd('t01', 4), { lid: 0.5, lk: [-0.9, -0.3], smirk: 0.5 }]]), { mood: 'angry' }, { spill: true }); pop(); },
  hunt(t, u) { cam(540, 960, 1); slideIn(u, () => { cork(); phoneCut(330, 820, 1.2, -0.1, {}); for (let i = 0; i < 4; i++) drop(330 + (i - 1.5) * 50, 1100 + ((t * 2 + i * 0.3) % 1) * 240, 1, 4010 + i);
      push(760, 760, 1, 0.05); clockP(0, 0, 200, 9, ((t - CUE.hunt) * 40) % 60); pop();
      label(540, 1260, 'ПОКА ИСКАЛ РИС…', 0, '#f4e6a8', -0.03, 56); }); pop(); },
  nikA(t) { cam(380, 1150, 2.0); scene(t, TOMD, ex(t, [[0, { mood: 'shock', lk: [0.8, 0], brow: 0.7 }], [CUE.all, { mood: 'dumb', brow: 0.9, arms: { l: [-190, 120, 'open'], r: [190, 110, 'phone'] } }]]), { spill: true }); pop(); },
  tomB(t) { cam(830, 990, 2.3); scene(t, { ...TOMD, lid: 0.68, smirk: 0.5 }, { mood: 'dumb' }, { spill: true }); pop(); },
  apple(t, u) { cam(540, 960, 1); slideIn(u, () => { cork(); appleSheet(t, CUE); }); pop(); },
  port(t, u) { cam(540, 960, 1); slideIn(u, () => portMacro(t, CUE.particles)); pop(); },
  nikB(t) { cam(360, 1120, 2.1, 0, 4); scene(t, TOMD, { mood: 'shock', brow: 1, lk: [0.6, -0.2], arms: { l: [-120, 40, 'open'], r: [190, 110, 'phone'] } }, { spill: true }); pop(); },
  corr(t, u) { const z = t > CUE.dive ? 1.12 : 1; cam(540, 960, z); slideIn(u, () => corrosion(t, CUE)); pop();
    push(540, 260, 1, -0.03); ransom('КОРРОЗИЯ', 0, 0, 104, 4020, { reveal: pr(t, CUE.corr, CUE.corr + 0.3) }); pop(); },
  table(t, u) { cam(540, 960, 1, 0, shakeAt(t)); slideIn(u, () => { cork(); rankTable(t, CUE); }); pop(); },
  scale(t, u) { cam(540, 960, 1); slideIn(u, () => scaleInsert(t, CUE.litter - 0.1)); pop();
    if (t > CUE.litter) { push(540, 300, 1, 0.03); ransom('СУШИТ ЛУЧШЕ', 0, 0, 90, 4030, { reveal: pr(t, CUE.litter, CUE.litter + 0.3), pop: true }); pop(); } },
  wideA(t) { cam(600, 1060, 1.25); scene(t, { ...TOMD, lid: 0.6 }, { mood: 'dread', lk: [0.8, -0.2], arms: { l: [-200, 60, 'open'], r: [200, 60, 'phone'] } }, { spill: true }); pop(); },
  tap(t, u) { cam(540, 960, 1); slideIn(u, () => tapInsert(t, CUE.tap)); pop(); },
  window(t) { const k = eo(pr(t, CUE.air, CUE.air + 0.5)); cam(420, 560, 1.55);
    kitchen(t, { open: k }); push(415, 610, 0.3, 0.08); phoneCut(0, 0, 1, Math.PI / 2, {}); pop();
    lightmap('#d9cdbd', () => { radial(415, 460, 900, 'rgba(255,250,232,1)', 1); }); pop();
    if (t > CUE.air + 0.2) label(540, 1240, '2. НА СКВОЗНЯК', 0, '#f4e6a8', 0.03, 56); },
  charge(t, u) { cam(540, 960, 1); slideIn(u, () => chargeInsert(t, CUE)); pop(); },
  nono(t, u) { cam(540, 960, 1); slideIn(u, () => noNo(t, CUE)); pop(); },
  buck(t) { const b = pr(t, CUE.buck - 0.1, CUE.buck + 0.2); cam(640, 980, 1.3, 0, shakeAt(t));
    scene(t, ex(t, [[0, { ...TOMD }], [CUE.buck, { lid: 0.3, lk: [-0.9, -0.2], smirk: 0 }]]),
      { mood: 'dumb', smile: 0.8, brow: 1, lk: [0.7, -0.8], arms: { l: [-150, 300, 'open'], r: [lerp(190, 230, b), lerp(110, -160, b), b > 0.5 ? 'point' : 'phone'] } }, { spill: true, buck: b }); pop(); },
  stare(t) { cam(830, 980, 2.3); scene(t, { lid: 0.62, lk: [-0.2, 0.15], smirk: 0, brow: -0.2 }, { mood: 'dumb' }, { spill: true }); pop(); },     // тишина и неподвижность
  mat(t) { cam(830, 980, 2.45, 0, shakeAt(t)); scene(t, { lid: 0.85, lk: [0, 0.3], brow: -0.8, smirk: 0 }, { mood: 'dumb' }, { spill: true }); pop();
    push(540, 330, 1, -0.04); ransom('Ё* ТВОЮ МАТЬ', 0, 0, 120, 4040, { reveal: pr(t, CUE.mat, CUE.mat + 0.5), pop: true }); pop(); },
  final(t) { cam(600, 1060, 1.25); scene(t, ex(t, [[0, { ...TOMD, lid: 0.5, smirk: 1 }], [CUE.sub, { lid: 0.45, lk: [0, 0.2], paw: 1, pawX: 175, pawY: 110, smirk: 1 }], [CUE.out, { paw: 0, lk: [-0.8, 0] }]]),
      { mood: '', smile: 0.7, lid: 0.3, lk: [0.6, 0], arms: { l: [-150, 300, 'open'], r: [180, 260, 'fist'] } }, { jar: true, buckDown: true }); pop();
    if (t > CUE.sub) { push(540, 300, 1, -0.03); ransom('ПЕРЕШЛИ ТОМУ,', 0, 0, 92, 4050, { reveal: pr(t, CUE.sub, CUE.sub + 0.3) }); pop();
      push(540, 430, 1, 0.02); ransom('КТО СУШИТ В РИСЕ', 0, 0, 80, 4051, { reveal: pr(t, CUE.sub + 0.3, CUE.sub + 0.7) }); pop(); } }
};
