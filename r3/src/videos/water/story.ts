// Шортс S2 «The Water That Almost Got You Killed» в стиле B, версия 2 (13.11.2026): грамматика камеры образца @ricksclips3000
// по замечанию владельца «камера скучная, нужно непрерывно и чтобы каждые несколько секунд что-то происходило»:
//  - бит каждые ~1,5–2,5 с: камера за ~0,8 с переезжает в новый кадр (smootherstep) и держит его с медленным наездом;
//  - место меняется движением: камера идёт за Joe через дверь, влетает в дверь камеры и сквозь окошко, кран, «хлыст» с размытием;
//  - в каждом бите герой что-то делает: трясёт пустую бутылку, идёт, открывает дверь, крутит кран, оттаскивает стеллаж…;
//  - задняя дверь открывается полностью, прежде чем через неё пройдёт зомби (раньше он проходил сквозь створку).
// Склеек нет: 4 «хлыста» с размытием (смена времени и места) и 2 пролёта сквозь дверь/окно.
import { LINES, WORDS, DUR } from "./data";
import { LOOKS, mixLook } from "../gas/look";
import { JOE, zombieFit, fxBurst, fxWaves, FrontOpts, Pen, Expr } from "../../kit/toon";
import { Put, FxPut, St, V3 } from "../gas/world";
import { makeStory, ShotDef, pr, lerp, sm, FPS } from "../../kit/shots";

const L0 = (k: string) => LINES[k][0], L1 = (k: string) => LINES[k][1];
/** начало слова: первое слово реплики k, совпавшее с re */
export const Wd = (k: string, re: RegExp) => { const w = WORDS.find((x) => x[3] === k && re.test(x[0])); if (!w) throw new Error(`слово ${re} в ${k}`); return w[1]; };
export const T = {
  killed: Wd("k01", /^killed/), day: L0("k02"), last: Wd("k02", /^last/), bottle: Wd("k02", /^bottle/), fema: Wd("k03", /^FEMA/), every: Wd("k03", /^every/),
  heater: Wd("k03", /^heater/), forty: Wd("k04", /^Forty/), open: Wd("k04", /^open/), valve: Wd("k04", /^drain/), clean: Wd("k04", /^Clean/), weeks: Wd("k04", /^Weeks/),
  reach: Wd("k05", /^reach/), dragged: Wd("k05", /^dragged/), never: Wd("k05", /^never/), am3: L0("k06"), clicks: Wd("k06", /^clicks/), one: L0("k07"),
  inside: Wd("k07", /^inside/), between: Wd("k07", /^Between/), run: Wd("k08", /^run/), cooler: Wd("k08", /^cooler/), shut: Wd("k08", /^shut/),
  dark: L0("k09"), fog: Wd("k09", /^fog/), scratch: Wd("k09", /^scratching/), belt: Wd("k10", /^belt/), handset: Wd("k10", /^handset/),
  speakers: Wd("k10", /^speakers/), sound: Wd("k11", /^sound/), loudest: Wd("k11", /^loudest/), four: Wd("k11", /^four/), press: Wd("k12", /^press/),
  bang: Wd("k12", /^bang/), wall: Wd("k12", /^wall/), turns: Wd("k13", /^turns/), out: Wd("k13", /^out/), rain: Wd("k13", /^rain/), slam: Wd("k13", /^slam/),
  bury: Wd("k13", /^bury/), own: L1("k13"), survived: Wd("k14", /^survived/), county: Wd("k14", /^county/), end: L1("k14"),
};
// смены места («хлысты» и пролёты) — границы планов
export const S = { day: 4.62, cool: 30.9, spk: 38.0, bang: 43.9, out: 46.2, cnt: 52.25, end: T.end + 0.05, night: 21.95 };

const Z1 = zombieFit(2);
const joe = (x: number, z: number, fo: FrontOpts, o: Partial<Put> = {}): Put => ({ id: "joe", o: JOE, x, y: 0, z, fo: { mode: "stand", seed: 3, ...fo }, ...o });
const zom = (x: number, z: number, fo: FrontOpts, o: Partial<Put> = {}): Put => ({ id: "z1", o: Z1, x, y: 0, z, fo: { mode: "stand", expr: "zom", seed: 11, ...fo }, ...o });
const q = (v: number, n = 20) => Math.round(v * n) / n;
/** шаг сбоку: mirror — идёт к -x; back — пятится (тащит стеллаж) */
const jwalk = (x: number, z: number, t: number, mirror: boolean, expr: Expr = "nervous", run = false, back = false): Put => ({ id: "joe", o: JOE, x, y: 0, z, side: true, mirror,
  so: { mode: "march", phase: q(((((back ? -1 : 1) * t * (run ? 2.3 : 1.7)) % 1) + 1) % 1), stride: run ? 1.3 : 0.85, expr, seed: 3 } });
const zwalk = (x: number, z: number, t: number, mirror: boolean): Put => ({ id: "z1", o: Z1, x, y: 0, z, side: true, mirror, so: { mode: "march", phase: q((t * 0.9) % 1), stride: 0.6, expr: "zom", seed: 11 } });
/** точка на ломаной pts в доле u 0..1 (по длине) */
const along = (pts: [number, number][], u: number): [number, number] => {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), tot = seg.reduce((a, b) => a + b, 0);
  let d = Math.max(0, Math.min(1, u)) * tot, i = 0; while (i < seg.length - 1 && d > seg[i]) { d -= seg[i]; i++; }
  const k = seg[i] ? d / seg[i] : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)];
};
const blink = (t: number, s = 0) => { const p = (t + s * 0.37) % 2.1; return p < 4 / FPS ? [0.5, 1, 1, 0.5][Math.floor(p * FPS)] : 0; };
const waves = (t: number, t0: number, x: number, y: number, z: number, s: number, d = 0.9): FxPut[] => {
  const u = (t - t0) / d; if (u < 0) return [];
  const uq = Math.round((u % 1) * 20) / 20; return [{ key: `waves${uq}`, cw: 500, ch: 500, draw: (p) => fxWaves(p, uq), x, y, z, w: s, h: s, soft: true }];
};
const burst = (t: number, t0: number, x: number, y: number, z: number, s: number, d = 0.25): FxPut[] => {
  const u = (t - t0) / d; if (u < 0 || u >= 1) return [];
  const uq = Math.round(u * 15) / 15; return [{ key: `burst${uq}`, cw: 500, ch: 500, draw: (p) => fxBurst(p, uq), x, y, z, w: s, h: s }];
};
const fogPuff = (p: Pen, u: number) => {
  const g = p.g;
  for (let i = 0; i < 6; i++) { const a = (1 - u) * 0.38; g.globalAlpha = a * (0.6 + 0.4 * Math.sin(i * 2.1)); p.ell(150 + i * 26 * u + 18 * Math.sin(i), 150 - i * 10 * u, 40 + 60 * u, 30 + 40 * u, "#eef6ff", 0); }
  g.globalAlpha = 1;
};
const breath = (t: number, x: number, y: number, z: number): FxPut[] => {
  const uq = Math.round(((t * 0.7) % 1) * 12) / 12;
  return [{ key: `fog${uq}`, cw: 300, ch: 300, draw: (p) => fogPuff(p, uq), x: x + 0.24 + 0.12 * uq, y: y - 0.05 + 0.08 * uq, z: z - 0.25, w: 0.36, h: 0.36, soft: true }];
};

const HORN: V3 = [4.4, 3.7, 6.5];
const JH: [number, number] = [3.95, -6.62];          // Joe в камере справа от двери: окошко двери (x 3.53) остаётся видно
const DAY: St = { sky: "day", lamps: 5, lampK: 0.75, neon: false, shut: 1, empty: true, doorA: 0, doorB: 0, doorC: 0, shelf: 0, heater: 0, fill: 0, bulb: 1, rain: 0, clock: "2:10", coolLight: 0.6 };
const NIGHT: St = { sky: "night", lamps: 0, neon: false, shut: 1, empty: true, doorA: 0, doorB: 0, doorC: 0, shelf: 1, heater: 0.6, fill: 0.85, bulb: 0, rain: 1, clock: "3:00", coolLight: 0.7, exit: 1 };
/** стеллаж: k 0 — у задней двери, 1 — оттащен (как в world.ts, со сглаживанием) */
const shelfAt = (k: number): [number, number] => { const s = sm(k); return [lerp(6.8, 5.35, s), lerp(-5.5, -4.5, s)]; };
const P = (x: number, y: number, z: number): V3 => [x, y, z];

// ---------- Joe днём: бутылка -> к двери подсобки -> бойлер -> к задней двери -> оттаскивает стеллаж ----------
const W1: [number, number][] = [[0.3, -7.25], [1.3, -6.1], [2.05, -5.15]];
const W2: [number, number][] = [[2.05, -5.15], [3.4, -5.2], [4.4, -6.3], [5.0, -7.1]];
const W3: [number, number][] = [[5.0, -7.1], [5.5, -6.2], [6.0, -5.5]];
const tW1: [number, number] = [8.55, 10.0], tW2: [number, number] = [10.35, 12.35], tW3: [number, number] = [17.3, 18.35], tDrag: [number, number] = [T.dragged, T.dragged + 1.45];
const joeDay = (t: number): Put | null => {
  if (t < tW1[0]) return joe(0.3, -7.25, { prop: "bottle", expr: t < T.last ? "sleepy" : t < T.fema ? "nervous" : "shock", look: t < T.fema ? 0.15 : 0.85, blink: blink(t),
    headTilt: t > T.bottle && t < T.fema ? 6 * Math.sin(t * 9) : 0 });
  if (t < tW1[1]) { const [x, z] = along(W1, pr(t, ...tW1)); return jwalk(x, z, t, false, "resolve"); }
  if (t < tW2[0]) return joe(2.05, -5.15, { expr: "resolve", look: 0.8, blink: blink(t) });
  if (t < tW2[1]) { const [x, z] = along(W2, pr(t, ...tW2)); return jwalk(x, z, t, false, "nervous"); }
  if (t < tW3[0]) return joe(5.0, -7.1, { expr: t < T.clean ? "nervous" : t < T.weeks ? "relief_open" : "laugh", look: t < T.clean ? 0.7 : 0.05, blink: blink(t, 2),
    headTilt: t > T.weeks ? 5 * Math.sin(t * 11) : 0 });
  if (t < tDrag[0]) { const [x, z] = along(W3, pr(t, ...tW3)); return jwalk(x, z, t, false, "relief"); }
  if (t < tDrag[1] + 0.4) { const [sx, sz] = shelfAt(pr(t, ...tDrag)); return jwalk(sx - 0.8, sz, t, false, "resolve", false, true); }
  return null;
};
// ---------- ночь: спит у камеры -> просыпается -> бежит в камеру ----------
const JS: [number, number] = [4.1, -5.35];
const tRun: [number, number] = [T.run + 0.05, T.run + 1.0];
const joeNight = (t: number): Put | null => {
  if (t < T.between) return joe(...JS, { mode: "sit", hug: true, expr: "sleepy", blink: 1 });
  if (t < tRun[0]) return joe(...JS, { mode: "sit", hug: true, expr: "fear", look: 0.85, blink: blink(t, 1), headTilt: 3 * Math.sin(t * 13) });
  if (t < tRun[1]) { const u = pr(t, ...tRun); return joe(lerp(JS[0], 3.52, u), lerp(JS[1], -6.7, u), { back: true, mode: "march", phase: q((t * 2.3) % 1), lift: 80, expr: "scream" }); }
  return null;
};
// зомби ночью: входит в полностью открытую дверь, идёт к Joe
const tDoorB: [number, number] = [T.clicks + 0.1, T.clicks + 1.0], tZin: [number, number] = [T.one - 0.2, T.inside + 0.4];
const zomNight = (t: number): Put | null => {
  if (t < tZin[0]) return null;
  if (t < tZin[1]) return zwalk(lerp(8.4, 6.3, pr(t, ...tZin)), -5.5, t, true);
  if (t < tRun[0]) return zom(6.3, -5.5, { expr: "zom2", reach: 1, phase: t * 0.5 });
  return zwalk(lerp(6.3, 4.6, pr(t, tRun[0], S.cool)), -5.5, t, true);
};
// после удара трубкой: зомби у окошка поворачивается и уходит на звук через открытую дверь; Joe выбегает, хлопает дверью, задвигает стеллаж
const ZW: [number, number][] = [[3.7, -4.95], [6.2, -5.45], [7.1, -5.5], [9.3, -5.5]];
const tZout: [number, number] = [T.turns + 0.5, T.rain + 0.5];
const tJout: [number, number] = [T.rain - 0.25, T.slam], tJback: [number, number] = [T.slam + 0.15, T.bury], tPush: [number, number] = [T.bury, T.own - 0.3];
const JO: [number, number][] = [[3.5, -6.35], [5.6, -6.05], [6.6, -5.4]];
const zomOut = (t: number): Put | null => {
  if (t < tZout[0]) return zom(3.7, -4.95, { expr: t < T.turns ? "zom2" : "zomO", pound: t < T.turns ? (t * 2.4) % 1 : undefined, back: t > T.turns + 0.25 });
  if (t < tZout[1]) { const [x, z] = along(ZW, pr(t, ...tZout)); return zwalk(x, z, t, false); }
  return null;
};
const joeOut = (t: number): Put | null => {
  if (t < tJout[0]) return null;
  if (t < tJout[1]) { const [x, z] = along(JO, pr(t, ...tJout)); return jwalk(x, z, t, false, "scream", true); }
  if (t < tJback[0]) return joe(6.6, -5.4, { expr: "scream", look: 0.6 });
  if (t < tJback[1]) return jwalk(lerp(6.6, 4.55, pr(t, ...tJback)), lerp(-5.4, -4.5, pr(t, ...tJback)), t, true, "resolve", true);
  if (t < tPush[1]) { const [sx, sz] = shelfAt(1 - pr(t, ...tPush)); return jwalk(sx - 0.8, sz, t, false, "resolve"); }
  return joe(6.0, -5.5, { expr: "relief", look: 0.3, blink: blink(t, 4), headTilt: 2 * Math.sin(t * 3) });
};
/** цель камеры, которая ведёт героя */
const tracking = (f: (t: number) => Put | null, y: number, fb: V3) => (t: number): V3 => { const p = f(t); return p ? [p.x, y, p.z] : fb; };

export const SHOTS: ShotDef[] = [
  // 0–4,6: крючок из будущего. Вода льётся в ведро -> бойлер «40 GALLONS» -> задняя дверь приоткрывается, в щели зомби -> наезд на лицо -> хлыст
  { a: 0, name: "hook", look: "backNight", dof: (t) => (t < 3.6 ? 7 : 10), push: 0.003,
    beats: [
      { t: 0, pos: P(5.15, 0.55, -5.85), look: P(5.85, 0.2, -6.9), fov: 44 },
      { t: 1.85, d: 1.5, pos: P(5.0, 1.05, -5.4), look: P(6.4, 0.95, -7.45), fov: 44 },
      { t: 3.45, d: 1.45, pos: P(5.1, 1.3, -5.2), look: P(7.1, 1.15, -5.6), fov: 42 },
      { t: T.killed + 0.05, d: 0.45, pos: P(5.6, 1.45, -5.4), look: P(7.6, 1.5, -5.85), fov: 30, roll: 0.06 },
      { t: S.day, d: 0.3, pos: P(5.6, 1.45, -5.4), look: P(7.5, 1.45, -5.0), fov: 32, roll: 0.06 },
    ],
    st: (t) => ({ ...NIGHT, doorB: 0.75 * sm(pr(t, 2.5, 3.7)), fill: lerp(0.35, 0.6, pr(t, 0, 4.6)) }),
    cast: (t) => (t > 2.6 ? [zom(7.65, -5.85, { expr: "zom2", reach: 0.8, phase: t * 0.4 }, { blob: false })] : []) },

  // 4,6–30,9: один непрерывный план. День 19: Joe и пустая бутылка -> идёт к двери подсобки, камера за ним сквозь дверь -> бойлер ->
  // кран -> «чистая вода» -> оттаскивает стеллаж от задней двери -> голая дверь, на том же кадре день гаснет в ночь -> щелчок, дверь
  // открывается настежь -> отъезд: входит зомби, Joe спит у камеры -> лицо Joe -> бежит в камеру -> камера влетает в закрытую дверь.
  { a: S.day, name: "day", push: 0.0025,
    look: (t, c) => (t < 21.3 ? mixLook(LOOKS.store, LOOKS.warmIn, pr(c[0], 1.6, 3.2)) : mixLook(LOOKS.warmIn, LOOKS.backNight, pr(t, 21.3, 22.3))),
    dof: (t) => (t < 8 ? 10 : t < 12 ? 6 : t < 17.3 ? 9 : t < 25 ? 6 : 9),
    beats: [
      { t: S.day, pos: P(0.7, 1.4, -4.7), look: P(-0.5, 1.3, -7.2), fov: 44 },
      { t: T.day + 0.32, d: 0.32, pos: P(0.7, 1.4, -4.7), look: P(0.3, 1.3, -7.25), fov: 44 },
      { t: T.bottle, d: 0.8, pos: P(0.45, 1.2, -5.65), look: P(0.3, 1.05, -7.25), fov: 44 },
      { t: T.fema + 0.5, d: 1.1, pos: P(0.55, 1.5, -4.5), look: P(0.6, 1.3, -7.0), fov: 46 },
      { t: tW1[0] + 0.9, d: 0.9, pos: P(0.4, 1.5, -4.15), look: tracking(joeDay, 1.25, P(2.05, 1.25, -5.15)), fov: 46 },
      { t: tW2[0] + 0.85, d: 1.2, pos: P(1.85, 1.5, -4.95), look: tracking(joeDay, 1.2, P(3.4, 1.2, -5.2)), fov: 46 },
      { t: T.heater + 0.55, d: 0.85, pos: P(3.6, 1.5, -5.0), look: P(6.2, 1.0, -7.3), fov: 44 },
      { t: T.forty + 0.7, d: 0.7, pos: P(5.4, 1.3, -5.9), look: P(6.35, 1.05, -7.4), fov: 40 },
      { t: T.valve + 0.05, d: 1.15, pos: P(6.3, 0.8, -6.0), look: P(6.05, 0.22, -7.05), fov: 42 },
      { t: T.clean + 0.6, d: 1.15, pos: P(4.85, 1.4, -5.5), look: P(5.0, 1.3, -7.1), fov: 42 },
      { t: T.dragged + 0.2, d: 1.5, pos: P(3.6, 1.6, -5.6), look: P(6.4, 1.1, -5.3), fov: 46 },
      { t: T.never, d: 0.8, pos: P(5.0, 1.45, -5.45), look: P(7.1, 1.2, -5.5), fov: 40 },
      { t: T.clicks + 0.05, d: 0.25, pos: P(5.0, 1.45, -5.45), look: P(7.1, 1.18, -5.52), fov: 32 },
      { t: T.inside + 0.3, d: 1.3, pos: P(2.65, 1.75, -5.25), look: P(6.3, 1.0, -5.5), fov: 42 },
      { t: T.between + 0.55, d: 0.6, pos: P(2.7, 1.1, -5.3), look: P(4.3, 1.2, -5.45), fov: 44 },
      { t: T.run + 0.65, d: 0.7, pos: P(3.45, 1.55, -4.6), look: P(3.5, 1.2, -6.6), fov: 46 },
      { t: S.cool, d: 0.35, pos: P(3.5, 1.5, -5.95), look: P(3.5, 1.4, -6.6), fov: 40 },
    ],
    st: (t) => t < S.night
      ? { ...DAY, doorA: sm(pr(t, tW1[1] - 0.25, tW1[1] + 0.35)), valve: pr(t, T.open, T.valve + 0.2), heater: pr(t, T.valve, T.valve + 0.3), fill: 0.85 * pr(t, T.valve + 0.1, 22),
          shelf: pr(t, ...tDrag), bulb: t > 21.3 ? (Math.floor(t * 14) % 3 ? 0.3 : 1) : 1, lampK: lerp(0.75, 0.2, pr(t, 21.3, S.night)) }
      : { ...NIGHT, doorB: sm(pr(t, ...tDoorB)), doorC: pr(t, tRun[0] - 0.1, tRun[0] + 0.25) * (1 - pr(t, T.shut - 0.3, T.shut)), rain: pr(t, S.night, 22.4) },
    cast: (t) => (t < S.night ? [joeDay(t)] : [joeNight(t), zomNight(t)]).filter((p): p is Put => !!p) },

  // 30,9–38: в камере. Камера изнутри от двери отъезжает к Joe -> пар изо рта -> за окошком скребётся тень -> трубка на поясе -> хлыст вверх
  { a: S.cool, name: "cooler", look: "coolerIn", dof: (t) => (t < T.scratch - 0.3 ? 12 : t < T.belt ? 8 : 12), push: 0.0028,
    beats: [
      { t: S.cool, pos: P(3.85, 1.5, -6.32), look: P(3.55, 1.5, -5.6), fov: 46 },
      { t: S.cool + 1.0, d: 1.0, pos: P(4.3, 1.6, -7.8), look: P(JH[0], 1.4, JH[1]), fov: 46 },
      { t: T.fog - 0.2, d: 0.7, pos: P(4.3, 1.6, -7.7), look: P(JH[0], 1.55, JH[1]), fov: 40 },
      { t: T.scratch + 0.25, d: 0.7, pos: P(3.3, 1.65, -7.4), look: P(3.55, 1.62, -6.15), fov: 36 },
      { t: T.belt + 0.4, d: 0.9, pos: P(4.35, 1.3, -7.85), look: P(JH[0], 1.1, JH[1]), fov: 46 },
      { t: T.speakers - 0.42, d: 0.6, pos: P(4.35, 1.3, -7.85), look: P(JH[0], 1.25, JH[1]), fov: 40 },
      { t: S.spk, d: 0.35, pos: P(4.35, 1.3, -7.85), look: P(JH[0], 3.0, JH[1] + 0.2), fov: 40 },
    ],
    st: (t) => ({ ...NIGHT, coolLight: 0.55 + 0.1 * Math.sin(t * 13) }),
    cast: (t) => [joe(...JH, { expr: t < T.belt ? "fear" : "resolve", look: t < T.scratch ? 0.2 : t < T.belt ? -0.8 : 0.4, blink: blink(t, 3),
        prop: t > T.belt + 0.4 ? ["handset", lerp(0, 0.35, pr(t, T.handset, T.handset + 0.4))] : undefined, headTilt: t < T.belt ? 3 * Math.sin(t * 17) : 0 }, { blob: false }),
      ...(t > T.scratch - 0.6 ? [zom(3.55, -5.8, { pound: (t * 2.4) % 1, expr: "zom2" }, { blob: false })] : [])],
    fx: (t) => (t < T.belt ? breath(t, JH[0], 1.5, JH[1]) : []) },

  // 38–43,9: снаружи. Влёт снизу к громкоговорителю под дождём -> кран назад и вверх над станцией, из темноты идут фигуры -> хлыст вниз
  { a: S.spk, name: "speaker", look: "nightExt", focus: HORN, dof: (t) => (t < T.sound ? 9 : 0), push: 0.002,
    beats: [
      { t: S.spk, pos: P(3.55, 3.35, 7.7), look: P(4.55, 2.2, 6.5), fov: 40 },
      { t: S.spk + 0.35, d: 0.35, pos: P(3.55, 3.35, 7.7), look: P(4.55, 3.7, 6.5), fov: 40 },
      { t: T.sound + 0.4, d: 2.0, pos: P(3.0, 4.6, 13.0), look: P(3.0, 2.6, 5.5), fov: 46 },
      { t: T.four, d: 1.4, pos: P(2.0, 9.5, 19.5), look: P(1.5, 1.2, 4.0), fov: 52 },
      { t: S.bang, d: 0.35, pos: P(2.0, 9.5, 19.5), look: P(1.5, -3, 7.0), fov: 52 },
    ],
    st: (t) => ({ ...NIGHT, lamps: 0, canopy: 0.8, rain: 1, crowd: "gather", crowdK: 0.04 + 0.04 * pr(t, T.sound, S.bang) }),
    fx: (t) => (t > T.loudest ? waves(t, T.loudest, ...HORN, 3.5 + 6 * pr(t, T.loudest, S.bang), 1.1) : []) },

  // 43,9–46,2: в камере. Влёт сверху -> кнопка -> BANG (рывок наезда) -> BANG -> мимо Joe к окошку -> сквозь окошко наружу
  { a: S.bang, name: "bang", look: "coolerIn", focus: [JH[0], 1.5, JH[1]], dof: 10, push: 0.003,
    beats: [
      { t: S.bang, pos: P(4.4, 1.5, -7.85), look: P(3.9, 2.8, -6.5), fov: 46 },
      { t: S.bang + 0.35, d: 0.35, pos: P(4.4, 1.5, -7.85), look: P(3.9, 1.4, -6.55), fov: 46 },
      { t: T.bang + 0.02, d: 0.12, pos: P(4.4, 1.5, -7.85), look: P(3.95, 1.55, -6.6), fov: 34, roll: -0.05 },
      { t: T.wall + 0.02, d: 0.12, pos: P(4.4, 1.5, -7.85), look: P(4.0, 1.6, -6.6), fov: 30, roll: 0.05 },
      { t: S.out - 0.2, d: 0.25, pos: P(3.3, 1.6, -7.0), look: P(3.53, 1.6, -6.15), fov: 40 },
      { t: S.out, d: 0.2, pos: P(3.53, 1.6, -6.22), look: P(3.55, 1.6, -5.0), fov: 40 },
    ],
    st: () => ({ ...NIGHT }),
    cast: (t) => [joe(...JH, { expr: t < T.bang ? "resolve" : "scream", prop: ["handset", t < T.press + 0.3 ? 0.35 : 1], look: 0.3, blink: blink(t, 5) }, { blob: false }),
      zom(3.55, -5.8, { pound: (t * 2.4) % 1, expr: "zom2" }, { blob: false })],
    fx: (t) => [...burst(t, T.bang + 0.05, 4.35, 1.85, -6.4, 0.6), ...burst(t, T.wall + 0.05, 4.35, 1.85, -6.4, 0.6)] },

  // 46,2–52,25: за окошком. Зомби оборачивается и уходит на звук через открытую дверь в дождь (камера ведёт его) -> Joe выбегает,
  // хлопает дверью -> задвигает стеллаж -> облегчение -> хлыст вверх
  { a: S.out, name: "out", look: "backNight", dof: (t) => (t < T.out ? 7 : 5), push: 0.0025,
    beats: [
      { t: S.out, pos: P(3.53, 1.6, -6.05), look: P(3.62, 1.55, -4.6), fov: 42 },
      { t: T.out + 0.5, d: 1.5, pos: P(3.6, 1.65, -5.95), look: tracking(zomOut, 1.3, P(7.6, 1.3, -5.5)), fov: 40 },
      { t: T.slam - 0.15, d: 0.65, pos: P(5.0, 1.6, -5.75), look: P(7.2, 1.2, -5.45), fov: 44 },
      { t: T.bury + 0.35, d: 0.8, pos: P(6.1, 1.65, -6.75), look: P(5.2, 1.1, -4.7), fov: 46 },
      { t: T.own - 0.2, d: 0.65, pos: P(5.85, 1.55, -6.9), look: P(6.0, 1.35, -5.5), fov: 42 },
      { t: S.cnt, d: 0.35, pos: P(5.85, 1.55, -6.9), look: P(6.0, 3.4, -5.5), fov: 42 },
    ],
    st: (t) => ({ ...NIGHT, doorB: 1 - sm(pr(t, T.slam - 0.02, T.slam + 0.14)), doorC: pr(t, tJout[0] - 0.2, tJout[0] + 0.1), shelf: 1 - pr(t, ...tPush) }),
    cast: (t) => [zomOut(t), joeOut(t)].filter((p): p is Put => !!p) },

  // 52,25–56,5: кран над станцией под дождём: из темноты со всех сторон к свету идут фигуры
  { a: S.cnt, name: "county", look: "nightExt", dof: 0, push: 0.0015,
    beats: [
      { t: S.cnt, pos: P(-4.5, 6.5, 19.5), look: P(0, 4.2, 2.0), fov: 52 },
      { t: S.cnt + 0.35, d: 0.35, pos: P(-4.5, 6.5, 19.5), look: P(0, 1.5, 2.0), fov: 52 },
      { t: T.county, d: 2.5, pos: P(-7.5, 11.5, 27.0), look: P(0, 0.8, 6.0), fov: 54 },
      { t: T.end + 0.4, d: 1.2, pos: P(-9.0, 14.0, 31.0), look: P(0, 0.5, 8.0), fov: 54 },
    ],
    st: (t) => ({ ...NIGHT, lamps: 2, lampK: 0.4, canopy: 1, crowd: "gather", crowdK: 0.12 + 0.3 * pr(t, S.cnt, T.end), speaker: 0 }),
    fx: (t) => waves(t, S.cnt, ...HORN, 7, 1.4) },
  { a: S.end, name: "end", look: "nightExt", dof: 0, beats: [{ t: S.end, pos: P(-9.0, 14.0, 31.0), look: P(0, 0.5, 8.0), fov: 54 }], st: () => ({ ...NIGHT }) },
];

const KICKS: [number, number][] = [[T.killed, 0.9], [T.clicks, 0.9], [T.shut - 0.02, 1.2], [T.bang + 0.05, 1.0], [T.wall + 0.05, 1.1], [T.slam, 1.4]];
export const STORY = makeStory(SHOTS, KICKS, DUR);
