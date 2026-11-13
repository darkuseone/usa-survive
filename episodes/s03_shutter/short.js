/* Шортс 3 «40 Zombies vs One Shutter»: флешфорвард (40 зомби давят ставню, болт вылетает) → перемотка «7 DAYS EARLIER» → 3:07 a.m., локдаун → День 7: сигнализация, 40 у ставни, 11 часов тишины → стук. */
const HOOK = { text: '40 ZOMBIES.|1 DOOR.', until: 3.6, seed: 7301 };
const SEGS = [
  { t0: 0, te0: 171.4 },                                                // 40 у ставни
  { t0: WW('h3', /^And/) - 0.08, te0: 180.85, tr: 'flash' },           // ставня гнётся, болт вылетает
  { t0: LS('b3') - 0.1, kind: 'rewind', te0: 183, speed: 125, text: '7 DAYS EARLIER', tr: 'cut' },
  ...lineSegs(['x01_c0_01', 'x02_c0_02', 'x03_c0_03', 'x04_c0_04', 'x05_c3_01', 'x06_c3_03', 'x07_c3_03b', 'x08_c3_04', 'x09_c3_05', 'x10_c3_06', 'x11_c3_07'], { x01_c0_01: { tr: 'flash' } }),
  { t0: LS('e3'), te0: 208.2 },                                         // «Who's knocking?»
  { t0: WW('e3', /^Find/) - 0.12, kind: 'end', photoTe: 172.5, title: 'ALL 30 DAYS', caption: 'the full story', seed: 7330 }
];
finishSegs();
EXPORT.marks = {};
