/* <Эпизод> — общее для всех глав: метки, герои, scene(). Главы (ch01.js…) дописывают SHOTS и SH. Общие помощники — engine/common.js. */
const CUE = {
  // имя: Wd('ключ реплики', индекс слова) ± сдвиг — индексы печатает pipeline/words.py
  fact1: Wd('a002', 6)
};
const SHAKES = [/* [CUE.boom, 0.6, 18] */];
const EP = { title: ['WHAT IF', '…?'], subs: false, hot: /^(ключевые|слова)/i };
const HP = { x: 640, y: 1000 - 508 * 0.95, s: 0.95 }, RP = { x: 1280, y: 1000 - 508 * 0.95, s: 0.95 };   // стоят на полу y 1000
function scene(t, ho, ro, o = {}) {
  location1(t, o);
  layer(() => { const tk = talk('host', t); person({ ...HP, t, m: tk.m, bob: tk.bob, lk: [0.8, 0], ...ho }); }, { sx: 8, sy: 10, sb: 14 });
  layer(() => { const tk = talk('rookie', t); person({ ...RP, t, m: tk.m, bob: tk.bob, lk: [-0.8, 0], hair: 'shaggy', pal: { top: '#d9692b', topD: '#b04f1a' }, ...ro }); }, { sx: 8, sy: 10, sb: 14 });
  light1();
}
const SHOTS = [];
const SH = {};
