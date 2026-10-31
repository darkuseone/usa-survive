/* Демо 16:9 — проверка движка: общий план, крупные планы, вставка на пробке, тревога (красный свет, тряска, ransom). Без озвучки. */
const CUE = { close: 3.5, close2: 6, card: 8, alarm: 11.2 };
const SHAKES = [[CUE.alarm, 0.6, 18]];
const EP = { title: ['BUNKER 101'], subs: false };
const AP = { x: 640, y: 492, s: 0.95 }, BP = { x: 1230, y: 640, s: 0.92 };      // A стоит (пол 1000: y = 1000 − 508·s); B сидит на ящике (сиденье 820 ≈ y + 345·s… подогнано на глаз)
const A = { pal: { top: '#6f7a3e', topD: '#535d2b', hair: '#3a2a20', pants: '#4a4238' }, hair: 'cap', capCol: '#c8402c', top: 'jacket', beard: 1, lk: [0.8, 0] };
const B = { pal: { top: '#d9692b', topD: '#b04f1a', hair: '#1c1512', skin: '#c99272', skinD: '#a8724f', pants: '#2f3e5a' }, hair: 'short', top: 'hoodie', legs: 'sit', lk: [-0.8, 0], flip: false };
function scene(t, ao, bo, o = {}) {
  TT = t; bunker(t, o);
  layer(() => person({ ...AP, t, ...A, ...ao }), { sx: 8, sy: 10, sb: 14 });
  layer(() => person({ ...BP, t, ...B, ...bo }), { sx: 8, sy: 10, sb: 14 });
  bunkerLight(o.lit ?? 1, o.red ?? 0);
}
const alarm = t => t > CUE.alarm;
const SHOTS = [[0, 'wide'], [CUE.close, 'closeA'], [CUE.close2, 'closeB'], [CUE.card, 'card'], [CUE.alarm - 0.6, 'alarm']];
const SH = {
  wide(t) { const [cx, cy, z] = ck(t, [[0, 960, 560, 1.0], [CUE.close, 900, 580, 1.08]]); cam(cx, cy, z); scene(t, { mood: '' , smile: 0.3 }, { mood: 'sleepy' }); pop(); },
  closeA(t) { cam(AP.x + 60, AP.y + 140, 2.0); scene(t, { mood: 'angry', brow: -0.5, arms: { l: [-150, 300, 'open'], r: [230, 190, 'point'] } }, { mood: 'sleepy' }); pop(); },
  closeB(t) { cam(BP.x - 40, BP.y + 120, 2.1); scene(t, {}, { mood: 'dumb', smile: 0.6, lk: [-0.9, -0.2] }); pop(); },
  card(t, u) { cam(W / 2, H / 2, 1); slideIn(u, () => waterCard(t, CUE.card)); pop(); },
  alarm(t) { const sh = shakeAt(t); cam(960, 600, alarm(t) ? 1.15 : 1.05, 0, sh);
    scene(t, alarm(t) ? { mood: 'shock', arms: { l: [-190, 40, 'open'], r: [190, 40, 'open'] } } : {}, alarm(t) ? { mood: 'shock', legs: 'run', lk: [0, -0.5] } : { mood: 'sleepy' }, { lit: alarm(t) ? 0.25 : 1, red: alarm(t) ? 1 : 0, spin: alarm(t) ? 0.6 : 0 }); pop();
    if (alarm(t)) { push(W / 2, 170, 1, -0.04); ransom('SIREN!', 0, 0, 150, 400, { reveal: pr(t, CUE.alarm, CUE.alarm + 0.25), pop: true }); pop(); } }
};
