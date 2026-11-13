// Шортс S2 «The Water That Almost Got You Killed» в стиле B. Сюжет: день 19, бутылка пуста -> FEMA: вода в бойлере -> 40 галлонов в
// подсобке, но ради них оттащил стеллаж от задней двери -> 3 часа ночи, дверь открывается -> зомби внутри -> Joe в холодильной
// камере, пар изо рта, царапает дверь -> трубка кассы связана с громкоговорителями -> «они охотятся на звук» -> стук в трубку,
// громкоговоритель ревёт -> зомби уходит во двор, Joe захлопывает дверь и заваливает стеллажом -> но тебя услышала вся округа.
// Камера по желанию владельца 13.11 «больше непрерывной»: три длинных проезда (4,6–22 с через дверь подсобки к бойлеру и назад к
// двери; 22–30,8 с от задней двери к Joe и в камеру; 46–52 с за зомби до двора), остальные склейки — только при смене места.
import { LINES, WORDS, DUR } from "./data";
import { LOOKS, mixLook } from "../gas/look";
import { JOE, zombieFit, fxBurst, fxWaves, FrontOpts, Pen } from "../../kit/toon";
import { Put, FxPut, St, SWK, V3 } from "../gas/world";
import { makeStory, ShotDef, pr, lerp, eo, sm, kick, FPS } from "../../kit/shots";

const L0 = (k: string) => LINES[k][0], L1 = (k: string) => LINES[k][1];
/** начало слова: первое слово реплики k, совпавшее с re */
export const Wd = (k: string, re: RegExp) => { const w = WORDS.find((x) => x[3] === k && re.test(x[0])); if (!w) throw new Error(`слово ${re} в ${k}`); return w[1]; };
export const T = {
  hook: 0, bottle: Wd("k02", /^bottle/), fema: Wd("k03", /^FEMA/), heater: Wd("k03", /^heater/), forty: Wd("k04", /^Forty/), valve: Wd("k04", /^drain/),
  clean: Wd("k04", /^Clean/), dragged: Wd("k05", /^dragged/), never: Wd("k05", /^never/), am3: L0("k06"), clicks: Wd("k06", /^clicks/), inside: Wd("k07", /^inside/),
  run: Wd("k08", /^run/), shut: Wd("k08", /^shut/), fog: Wd("k09", /^fog/), scratch: Wd("k09", /^scratching/), belt: Wd("k10", /^belt/), speakers: Wd("k10", /^speakers/),
  sound: Wd("k11", /^sound/), loudest: Wd("k11", /^loudest/), four: Wd("k11", /^four/), press: Wd("k12", /^press/), bang: Wd("k12", /^bang/), wall: Wd("k12", /^wall/),
  turns: Wd("k13", /^turns/), out: Wd("k13", /^out/), rain: Wd("k13", /^rain/), slam: Wd("k13", /^slam/), bury: Wd("k13", /^bury/), county: Wd("k14", /^county/),
  end: L1("k14"),
};
const Z1 = zombieFit(2);
const joe = (x: number, y: number, z: number, fo: FrontOpts, o: Partial<Put> = {}): Put => ({ id: "joe", o: JOE, x, y, z, fo: { mode: "stand", seed: 3, ...fo }, ...o });
const zom = (x: number, y: number, z: number, fo: FrontOpts, o: Partial<Put> = {}): Put => ({ id: "z1", o: Z1, x, y, z, fo: { mode: "stand", expr: "zom", seed: 11, ...fo }, ...o });
const zside = (x: number, z: number, t: number, mirror = false): Put => ({ id: "z1", o: Z1, x, y: 0, z, side: true, mirror, so: { mode: "march", phase: (t * 0.9) % 1, stride: 0.6, expr: "zom", seed: 11 } });
const jside = (x: number, z: number, t: number, mirror = false): Put => ({ id: "joe", o: JOE, x, y: 0, z, side: true, mirror, so: { mode: "march", phase: (t * 1.8) % 1, stride: 1.2, expr: "scream", seed: 3 } });
const blink = (t: number, s = 0) => { const p = (t + s * 0.37) % 2.3; return p < 4 / FPS ? [0.5, 1, 1, 0.5][Math.floor(p * FPS)] : 0; };
const waves = (t: number, t0: number, x: number, y: number, z: number, s: number, d = 0.9): FxPut[] => {
  const u = (t - t0) / d; if (u < 0) return [];
  const uq = Math.round((u % 1) * 20) / 20; return [{ key: `waves${uq}`, cw: 500, ch: 500, draw: (p) => fxWaves(p, uq), x, y, z, w: s, h: s, soft: true }];
};
const burst = (t: number, t0: number, x: number, y: number, z: number, s: number, d = 0.25): FxPut[] => {
  const u = (t - t0) / d; if (u < 0 || u >= 1) return [];
  const uq = Math.round(u * 15) / 15; return [{ key: `burst${uq}`, cw: 500, ch: 500, draw: (p) => fxBurst(p, uq), x, y, z, w: s, h: s }];
};
/** облачко пара изо рта (мягкая карточка): puff 0..1 — фаза выдоха */
const fogPuff = (p: Pen, u: number) => {
  const g = p.g;
  for (let i = 0; i < 6; i++) { const a = (1 - u) * 0.55; g.globalAlpha = a * (0.6 + 0.4 * Math.sin(i * 2.1)); p.ell(150 + i * 26 * u + 18 * Math.sin(i), 150 - i * 10 * u, 40 + 60 * u, 30 + 40 * u, "#eef6ff", 0); }
  g.globalAlpha = 1;
};
const breath = (t: number, x: number, y: number, z: number): FxPut[] => {
  const u = ((t * 0.7) % 1); const uq = Math.round(u * 12) / 12;
  return [{ key: `fog${uq}`, cw: 300, ch: 300, draw: (p) => fogPuff(p, uq), x: x + 0.2 * uq, y: y + 0.05 + 0.15 * uq, z: z + 0.15, w: 0.55, h: 0.55, soft: true }];
};
const HORN: V3 = [4.4, 3.7, 6.5];
const DAY: St = { sky: "day", lamps: 5, lampK: 0.75, neon: false, shut: 1, empty: true, doorA: 0, doorB: 0, doorC: 0, shelf: 1, heater: 0, fill: 0, bulb: 1, rain: 0, clock: "2:10", coolLight: 0.6 };
const NIGHT: St = { sky: "night", lamps: 0, neon: false, shut: 1, empty: true, doorA: 0, doorB: 0, doorC: 0, shelf: 1, heater: 0, fill: 0.85, bulb: 0, rain: 1, clock: "3:00", coolLight: 0.7, exit: 1 };
const JOE_HIDE: V3 = [3.5, 0, -6.55];

const SHOTS: ShotDef[] = [
  // 0. Крючок (из будущего): 3 часа ночи, вода ещё течёт в ведро, камера скользит от ведра к задней двери — она приоткрывается
  { a: 0, name: "hook", look: "backNight", dof: 6, focus: [6.6, 1.2, -5.5], spline: true,
    keys: [[0, 5.0, 0.7, -5.55, 5.85, 0.2, -6.9, 46], [2.0, 5.1, 1.0, -5.35, 6.6, 0.8, -6.5, 46], [4.5, 5.0, 1.35, -5.15, 7.1, 1.15, -5.55, 44]],
    st: (t) => ({ ...NIGHT, heater: 0.6, fill: 0.5, doorB: 0.12 + 0.3 * sm(pr(t, 1.6, 3.6)) }),
    cast: (t) => (t > 1.6 ? [zom(7.75, 0, -5.55, { expr: "zom2", reach: 0.8, phase: t * 0.4 }, { blob: false })] : []) },
  // 1. Один проезд 4,6–22 с: пустые холодильники -> Joe с пустой бутылкой -> дверь подсобки -> бойлер, кран, вода -> назад к задней двери
  { a: L0("k02") - 0.1, name: "oner1", spline: true, focus: (t) => (t < T.fema ? [0.3, 1.4, -7.25] : t < T.forty ? [4.5, 1.2, -6.4] : t < L0("k05") ? [5.3, 1.0, -6.95] : [7.05, 1.2, -5.5]),
    dof: (t) => (t < T.fema ? 12 : t < T.forty ? 4 : t < L0("k05") ? 9 : 7),
    look: (t, c) => mixLook(LOOKS.store, LOOKS.warmIn, pr(c[0], 1.6, 3.2)),
    keys: [[L0("k02") - 0.1, 0.55, 1.45, -4.9, 0.3, 1.3, -7.3, 44], [T.bottle, 0.45, 1.4, -5.6, 0.3, 1.25, -7.3, 38], [L0("k03") + 0.6, 0.9, 1.5, -5.3, 2.4, 1.4, -5.15, 46],
      [T.fema + 1.0, 1.6, 1.5, -5.15, 4.5, 1.2, -5.5, 46], [T.heater - 0.1, 2.6, 1.5, -5.15, 6.3, 1.0, -7.2, 46], [T.forty + 0.3, 4.3, 1.4, -5.2, 5.7, 0.9, -7.2, 46],
      [T.valve + 0.3, 5.4, 0.75, -5.8, 6.0, 0.25, -7.05, 42], [T.clean + 0.6, 5.05, 1.4, -5.4, 5.3, 1.3, -6.95, 42], [L0("k05") + 0.6, 4.7, 1.55, -5.2, 7.1, 1.15, -5.5, 46],
      [T.never, 4.75, 1.55, -5.2, 7.1, 1.2, -5.5, 40], [L1("k05") + 0.2, 4.8, 1.55, -5.2, 7.1, 1.2, -5.5, 38]],
    st: (t) => ({ ...DAY, doorA: pr(t, T.fema + 0.2, T.fema + 1.0), shelf: t < L0("k05") ? 1 : sm(pr(t, T.dragged - 0.1, T.dragged + 0.9)), heater: pr(t, T.valve + 0.1, T.valve + 0.4), fill: 0.85 * pr(t, T.valve + 0.2, L1("k05") + 2) }),
    cast: (t) => {
      const out: Put[] = [];
      if (t < T.fema + 0.9) out.push(joe(0.3, 0, -7.25, { prop: "bottle", expr: t < T.bottle + 0.6 ? "sleepy" : "nervous", look: 0.2, blink: blink(t), headTilt: 4 * Math.sin(t * 6) }));
      if (t > T.fema + 0.9) out.push(joe(5.3, 0, -6.95, { expr: t < T.clean ? "nervous" : t < L0("k05") ? "relief_open" : "relief", look: t < T.clean ? 0.6 : 0.1, blink: blink(t, 2) }));
      return out;
    } },
  // 2. Один проезд 22–30,8 с: 3 часа ночи, щёлкает задняя дверь -> зомби внутри, Joe у холодильной камеры -> бежит внутрь, захлопывает
  { a: L0("k06") - 0.15, name: "oner2", look: "backNight", spline: true, focus: (t) => (t < T.inside - 0.2 ? [7.1, 1.15, -5.5] : t < L0("k08") ? [3.9, 1.35, -5.7] : [3.5, 1.3, -6.2]),
    dof: (t) => (t < T.inside ? 9 : 5),
    keys: [[L0("k06") - 0.15, 2.65, 1.6, -4.95, 7.1, 1.15, -5.5, 30], [T.clicks + 0.3, 2.65, 1.6, -4.95, 7.1, 1.15, -5.5, 26], [T.inside - 0.3, 2.7, 1.6, -4.95, 6.4, 1.2, -5.45, 40],
      [T.inside + 0.5, 2.7, 1.6, -4.95, 3.9, 1.35, -5.7, 46], [L1("k07"), 2.7, 1.6, -4.95, 3.9, 1.35, -5.7, 42], [T.run + 0.4, 2.7, 1.6, -4.95, 3.5, 1.2, -6.6, 46], [L1("k08") + 0.1, 2.75, 1.6, -4.95, 3.5, 1.2, -6.3, 42]],
    st: (t) => ({ ...NIGHT, doorB: lerp(0, 0.18, pr(t, T.clicks - 0.05, T.clicks + 0.2)) + 0.45 * sm(pr(t, T.clicks + 0.5, T.inside)),
      doorC: pr(t, T.run - 0.05, T.run + 0.25) * (1 - pr(t, T.shut - 0.35, T.shut - 0.1)) }),
    cast: (t) => {
      const out: Put[] = [];
      const zin = pr(t, T.clicks + 0.4, T.inside + 0.2);
      const zr = pr(t, T.run, L1("k08"));
      if (t > T.clicks + 0.1) out.push(zin < 1 ? zside(lerp(7.7, 6.2, eo(zin)), -5.45, t, true) : zr > 0 ? zside(lerp(6.2, 4.7, zr), -5.5, t, true) : zom(6.2, 0, -5.45, { expr: "zom2", reach: 1, phase: t * 0.5 }));
      const r = pr(t, T.run - 0.05, T.shut - 0.4);
      if (r <= 0) out.push(joe(3.9, 0, -5.7, { expr: t < T.inside ? "sleepy" : "fear", look: 0.8, blink: blink(t, 1), headTilt: t > T.inside ? 3 * Math.sin(t * 9) : 0 }));
      else if (r < 1) out.push(joe(lerp(3.9, 3.5, r), 0, lerp(-5.7, -6.6, r), { back: true, mode: "march", phase: (t * 2.2) % 1, lift: 80, expr: "scream" }));
      return out;
    } },
  // 3. Внутри камеры: темно, иней, пар изо рта, за мутным окошком царапается тень -> вниз к трубке на поясе
  { a: L0("k09") - 0.1, name: "cooler", look: "coolerIn", focus: [3.5, 1.45, -6.55], dof: 14, spline: true,
    keys: [[L0("k09") - 0.1, 4.3, 1.62, -7.8, 3.5, 1.42, -6.45, 46], [L1("k09"), 4.15, 1.55, -7.55, 3.5, 1.45, -6.45, 40], [T.belt + 0.5, 4.0, 1.15, -7.3, 3.55, 0.85, -6.55, 36],
      [T.speakers, 3.98, 1.1, -7.25, 3.55, 0.8, -6.55, 34]],
    st: (t) => ({ ...NIGHT, coolLight: 0.6 + 0.08 * Math.sin(t * 13) }),
    cast: (t) => [joe(...JOE_HIDE, { expr: t < T.belt ? "fear" : "resolve", look: t < T.scratch ? -0.6 : 0.6, blink: blink(t, 3), prop: t > T.belt - 0.3 ? ["handset", 0] : undefined, headTilt: 2 * Math.sin(t * 8) }, { blob: false }),
      ...(t > T.scratch - 0.5 ? [zom(3.55, 0, -5.8, { pound: (t * 2.4) % 1, expr: "zom2" }, { blob: false })] : [])],
    fx: (t) => (t < T.belt ? breath(t, 3.5, 1.62, -6.55) : []) },
  // 4. Громкоговоритель на столбе навеса под дождём -> кран вверх над станцией: «самое громкое на милю — колонка 4»
  { a: T.speakers - 0.05, name: "speaker", look: "nightExt", focus: HORN, dof: (t) => (t < T.sound ? 10 : 0), spline: true,
    keys: [[T.speakers - 0.05, 3.55, 3.35, 7.7, 4.55, 3.7, 6.5, 40], [T.sound, 3.3, 3.5, 9.6, 4.4, 3.6, 6.5, 44], [T.loudest - 0.2, 3.0, 3.7, 12.6, 3.6, 3.0, 6.5, 50],
      [T.four - 0.3, 2.6, 4.3, 14.6, 2.0, 2.0, 5.0, 52], [L1("k11") + 0.1, 2.0, 9.5, 19.5, 0.5, 1.2, 3.0, 54]],
    st: () => ({ ...NIGHT, lamps: 0, canopy: 0.8, rain: 1, speaker: 0 }),
    fx: (t) => (t > T.loudest ? waves(t, T.loudest, ...HORN, 3.5 + 6 * pr(t, T.loudest, L1("k11")), 1.1) : []) },
  // 5. В камере: кнопка, удар трубкой о стену
  { a: L0("k12") - 0.1, name: "bang", look: "coolerIn", focus: [3.5, 1.45, -6.55], dof: 14,
    keys: [[L0("k12") - 0.1, 4.2, 1.55, -7.6, 3.45, 1.5, -6.5, 42], [T.wall + 0.4, 4.15, 1.55, -7.5, 3.45, 1.55, -6.5, 38]],
    st: () => ({ ...NIGHT }),
    cast: (t) => [joe(...JOE_HIDE, { expr: t < T.bang ? "resolve" : "scream", prop: ["handset", t < T.bang - 0.15 ? 0.3 : 1], look: 0.3 }, { blob: false })],
    fx: (t) => [...burst(t, T.bang + 0.05, 3.2, 1.7, -6.5, 0.6), ...burst(t, T.wall + 0.05, 3.2, 1.7, -6.5, 0.6), ...(t < T.bang ? breath(t, 3.5, 1.62, -6.55) : [])] },
  // 6. Громкоговоритель ревёт (короткая вставка)
  { a: T.wall + 0.25, name: "blast", look: "nightExt", focus: HORN, dof: 8,
    keys: [[T.wall + 0.25, 3.7, 3.4, 8.2, 4.5, 3.7, 6.5, 44], [L0("k13") - 0.05, 3.6, 3.45, 8.0, 4.5, 3.7, 6.5, 38]],
    st: () => ({ ...NIGHT, canopy: 0.8 }), fx: (t) => [...waves(t, T.wall + 0.25, ...HORN, 2.6, 0.5), ...waves(t, T.wall + 0.5, ...HORN, 1.6, 0.5)] },
  // 7. Один проезд 46–52 с: зомби поворачивается и уходит на звук во двор -> Joe выскакивает, захлопывает дверь, задвигает стеллаж
  { a: L0("k13") - 0.05, name: "oner3", look: "backNight", spline: true, focus: (t) => (t < T.out ? [3.6, 1.4, -5.85] : t < T.slam ? [7.4, 1.3, -5.5] : [6.4, 1.3, -5.6]), dof: 6,
    keys: [[L0("k13") - 0.05, 2.75, 1.7, -4.5, 3.5, 1.4, -6.0, 46], [T.out, 3.4, 1.7, -4.4, 6.2, 1.25, -5.6, 48], [T.rain + 0.2, 4.0, 1.7, -4.4, 7.4, 1.2, -5.5, 48],
      [T.bury, 4.3, 1.6, -4.55, 6.9, 1.1, -5.5, 44], [L1("k13") + 0.2, 4.35, 1.6, -4.6, 6.85, 1.1, -5.5, 42]],
    st: (t) => ({ ...NIGHT, doorB: 0.55 * (1 - sm(pr(t, T.slam - 0.12, T.slam + 0.05))), doorC: pr(t, T.rain - 0.7, T.rain - 0.4), shelf: 1 - sm(pr(t, T.bury - 0.1, L1("k13") - 0.3)) }),
    cast: (t) => {
      const out: Put[] = [];
      const zt = pr(t, T.turns + 0.2, T.rain + 0.4);
      if (t < T.turns + 0.2) out.push(zom(3.55, 0, -5.8, { pound: (t * 2.4) % 1, expr: "zom2" }));
      else if (zt < 1) out.push(zside(lerp(3.7, 9.0, zt), lerp(-5.75, -5.6, zt), t, false));
      const jr = pr(t, T.rain - 0.35, T.slam - 0.1);
      if (jr > 0 && jr < 1) out.push(jside(lerp(3.5, 6.6, eo(jr)), lerp(-6.3, -5.5, jr), t));
      else if (jr >= 1) out.push(joe(lerp(6.6, 6.2, pr(t, T.slam, T.bury)), 0, lerp(-5.5, -6.05, pr(t, T.slam, T.bury)), { expr: t < T.bury ? "scream" : "relief", look: 0.8 }));
      return out;
    } },
  // 8. Кран над станцией под дождём: из темноты со всех сторон к свету идут фигуры — «ты сказал всей округе, где ты»
  { a: L0("k14") - 0.1, name: "county", look: "nightExt", dof: 0, spline: true,
    keys: [[L0("k14") - 0.1, -4.5, 6.5, 19.5, 0, 1.5, 2.0, 52], [T.county, -7.5, 11.5, 27.0, 0, 0.8, 6.0, 54], [T.end + 0.6, -9.0, 14.0, 31.0, 0, 0.5, 8.0, 54]],
    st: (t) => ({ ...NIGHT, lamps: 2, lampK: 0.4, canopy: 1, crowd: "gather", crowdK: 0.12 + 0.3 * pr(t, L0("k14"), T.end), speaker: 0 }),
    fx: (t) => (t < T.county ? waves(t, L0("k14"), ...HORN, 7, 1.4) : []) },
  { a: T.end + 0.05, name: "end", look: "nightExt", dof: 0, keys: [[T.end, -9.0, 14.0, 31.0, 0, 0.5, 8.0, 54]], st: () => ({ ...NIGHT }) },
];

const KICKS: [number, number][] = [[T.clicks, 0.8], [T.shut - 0.05, 1.2], [T.bang + 0.05, 1.0], [T.wall + 0.05, 1.1], [T.wall + 0.25, 0.9], [T.slam, 1.4]];
export const STORY = makeStory(SHOTS, KICKS, DUR);
