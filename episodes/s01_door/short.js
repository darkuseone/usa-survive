/* Шортс 1 «Would You Open the Door?»: стук на День 12 → ночное окно, Dee, дилемма → через 12 дней Dee в пикапе с налётчиками → вопрос в комментарии. */
const HOOK = { text: 'WOULD YOU|OPEN IT?', until: 3.5, seed: 7101 };
const SEGS = [
  { t0: 0, te0: 207.25, rate: 0.64 },                                   // стук: «someone knocks» (замедлено, до заставки главы)
  ...lineSegs(['x01_c4_01', 'x02_c4_01b', 'x03_c4_02', 'x04_c4_03', 'x05_c4_04', 'x06_c4_05', 'x07_c4_06', 'x08_c4_07', 'x09_c6_02', 'x10_c6_04']),
  { t0: LS('b1'), te0: 376.55, tr: 'flash' },                           // «Twelve days later… headlights.»
  { t0: LS('e1'), te0: LS('c6_08') + 0.1 },                             // Dee оглядывается: пленница или наводчица?
  { t0: WW('e1', /^All/) - 0.12, kind: 'end', photoTe: 229.6, title: 'ALL 30 DAYS', caption: 'the full story', seed: 7130 }
];
finishSegs();
EXPORT.marks = { kn: C3.kn.map(k => (k - 207.25) / 0.64) };
