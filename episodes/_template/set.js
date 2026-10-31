/* <Эпизод> — декорации (функция на локацию) и вставки (функция на факт). Образцы: episodes/demo/set.js, reference/tom-nikita/episodes/ep09/set.js. */

function location1(t, o = {}) {
  rectP(-200, -200, W + 400, 1200, '#8d9384', { seed: 1000, line: false, step: 80 });              // стена
  rectP(-200, 1000, W + 400, 400, '#5f5a52', { seed: 1001, step: 60 });                             // пол (y 1000)
}
function light1(fn) { lightmap('#8a8aa0', () => { radial(960, 200, 1300, 'rgba(255,226,160,1)', 0.9); if (fn) fn(); }); }

function fact1(t, c) {                                              // вставка-факт: карточка + цифра ransom + источник
  cork(); push(760, 520, 1, -0.03); card(0, 0, 900, 560, 0, 1100, '#f3ecd8'); txt('FACT TITLE', 0, -210, 64, { font: 'Inter Black', col: '#1c1512' }); pop(); pin(760, 250);
  if (t > c) { push(1480, 640, 1, 0.05); ransom('10 MIN', 0, 0, 130, 1101, { reveal: pr(t, c, c + 0.3), pop: true }); pop(); }
  txt('source: …', 760, 880, 30, { font: 'Inter', weight: 800, col: '#1c1512' });
}
