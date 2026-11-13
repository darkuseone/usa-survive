/* Шортс 2 «The Day 19 Mistake»: последняя бутылка → скрытые 40 галлонов (FEMA) → ради них открыл заднюю дверь → зомби внутри → холодильная камера → громкоговоритель → «вся округа знает, где ты». */
const HOOK = { text: '0 WATER|LEFT', until: 3.4, seed: 7201 };
const SEGS = [
  { t0: 0, te0: 303.9, rate: 0.46 },                                    // пустая бутылка (замедлено)
  ...lineSegs(['x01_c5_02', 'x02_c5_03', 'x03_c5_04', 'x04_c5_05', 'x05_c5_06', 'x06_c5_07', 'x07_c5_08', 'x08_c5_09', 'x09_c5_10', 'x10_c5_11', 'x11_c5_12']),
  { t0: LS('e2') - 0.1, kind: 'end', photoTe: 337.2, title: 'ALL 30 DAYS', caption: 'the full story', seed: 7230 }
];
finishSegs();
EXPORT.marks = {};
