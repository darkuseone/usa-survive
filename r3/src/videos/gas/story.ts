// Раскадровка версии B: те же 23 плана и метки слов, что в версии A (episodes/s03c_shutter/combo.js), но по грамматике
// камеры репозитория: плавные проезды (smootherstep), каждый план медленно «вползает» (наезд ~0.15 %/кадр), удары —
// «кики» (смещение меняет знак каждый кадр и затухает за 7 кадров), без ручной тряски; глубина резкости по планам.
import * as THREE from "three";
import { T, DUR } from "./data";
import { LOOKS, Look, LookName, mixLook } from "./look";
import { JOE, zombieFit, fxBurst, fxWaves, fxFist, FrontOpts } from "../../kit/toon";
import { Frame, Put, FxPut, St, SWK, V3 } from "./world";

export const FPS = 30;
export const TOTAL = Math.round(DUR * FPS);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const pr = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const eo = (x: number) => 1 - (1 - clamp01(x)) ** 3;
const glide = (x: number) => { const u = clamp01(x); return u * u * u * (u * (u * 6 - 15) + 10); };
const sm = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
const kick = (t: number, t0: number, d = 0.35) => (t > t0 && t < t0 + d ? 1 - (t - t0) / d : 0);

type Cam = { pos: V3; look: V3; fov: number; roll: number };
/** оси камеры (вправо, вверх) для эффектов, привязанных к экрану */
const camAxes = (c: Cam) => { const f = new THREE.Vector3(c.look[0] - c.pos[0], c.look[1] - c.pos[1], c.look[2] - c.pos[2]).normalize();
  const r = new THREE.Vector3().crossVectors(f, new THREE.Vector3(0, 1, 0)).normalize(), u = new THREE.Vector3().crossVectors(r, f); return { f, r, u }; };
/** ключ камеры: [время, позиция x y z, цель x y z, fov, крен] */
type K = [number, number, number, number, number, number, number, number, number?];
type ShotDef = {
  a: number; name: string; look: LookName | ((t: number, cam: V3) => Look); keys: K[]; st: (t: number) => St;
  cast?: (t: number) => Put[]; fx?: (t: number, cam: Cam) => FxPut[]; dof: number | ((t: number) => number); focus?: V3 | ((t: number) => V3);
  keyDir?: (t: number) => V3; linear?: boolean;
};

const JN: [number, number] = [4.0, -3.25];
const Z1 = zombieFit(2);
const joe = (x: number, y: number, z: number, fo: FrontOpts, o: Partial<Put> = {}): Put => ({ id: "joe", o: JOE, x, y, z, fo: { mode: "stand", seed: 3, ...fo }, ...o });
const zom = (x: number, y: number, z: number, fo: FrontOpts, o: Partial<Put> = {}): Put => ({ id: "z1", o: Z1, x, y, z, fo: { mode: "stand", expr: "zom", seed: 11, ...fo }, ...o });
/** моргание: раз в ~2 с, 4 кадра */
const blink = (t: number, s = 0) => { const p = (t + s * 0.37) % 2.3; return p < 4 / FPS ? [0.5, 1, 1, 0.5][Math.floor(p * FPS)] : 0; };
const night: St = { sky: "night", lamps: 5, lampK: 1, neon: true, shut: 0, rain: 1, clock: "3:07" };
const KN = [T.kn[0], T.kn[1], T.kn[2]], HIT = T.slam + 0.25, P1 = T.pops + 0.05, P2 = T.another + 0.25;
const burst = (t: number, t0: number, x: number, y: number, z: number, s: number, d = 0.3): FxPut[] => {
  const u = (t - t0) / d; if (u < 0 || u >= 1) return [];
  const uq = Math.round(u * 15) / 15; return [{ key: `burst${uq}`, cw: 500, ch: 500, draw: (p) => fxBurst(p, uq), x, y, z, w: s, h: s }];
};
const waves = (t: number, t0: number, x: number, y: number, z: number, s: number, d = 0.9): FxPut[] => {
  const u = (t - t0) / d; if (u < 0 || u >= 1) return [];
  const uq = Math.round(u * 20) / 20; return [{ key: `waves${uq}`, cw: 500, ch: 500, draw: (p) => fxWaves(p, uq), x, y, z, w: s, h: s, soft: true }];
};
const sunArc = (phi: number, el: number): V3 => [Math.sin(phi) * Math.cos(el), Math.sin(el), Math.cos(phi) * Math.cos(el)];
const HIDE_DIR = (t: number) => { const k = sm(pr(t, T.eleven - 0.3, T.k12 - 0.1)); return sunArc(lerp(-0.62, 0.55, k), 0.6); };

const SHOTS: ShotDef[] = [
  { a: 0, name: "hook", look: "dawnExt", dof: 4, focus: [0, 1.6, 1.8],
    keys: [[0, 0.5, 1.3, 7.0, 0, 1.7, 0.5, 60], [T.k02 - 0.1, -0.3, 3.3, 4.9, 0, 1.1, 0.6, 56]],
    st: () => ({ sky: "dawn", lamps: 5, lampK: 0.2, neon: false, shut: 1, dents: 1, bulge: 0.2, crowd: "pound", rain: 0.4, canopy: 0.35, clock: "6:31" }) },
  { a: T.k02 - 0.1, name: "bend", look: "dawnIn", dof: 9, focus: [-0.35, 1.5, -2.4],
    keys: [[T.k02 - 0.1, -1.3, 1.3, -4.6, 1.4, 1.75, 0.4, 58, 0.05], [T.k03, -0.9, 1.4, -3.9, 1.2, 1.8, 0.4, 50, -0.03]],
    st: (t) => ({ sky: "dawn", lamps: 5, lampK: 0.15, neon: false, shut: 1, bulge: 0.25 + 0.45 * pr(t, T.k02, T.k03), dents: 1, slits: 1, shafts: 0.9, alarm: 0.45, crowd: "pound", rain: 0, clock: "6:31" }),
    cast: (t) => [joe(-0.35, 0, -2.4, { expr: "fear", armsUp: 0.3, look: 0.5, blink: blink(t), headTilt: 3 * Math.sin(t * 7) })] },
  { a: T.k03 - 0.15, name: "rewind", dof: 0, linear: true,
    look: (t) => { const k = pr(t, T.k03 - 0.15, T.k04 - 0.05); return LOOKS[k < 0.25 ? "dawnExt" : k < 0.5 ? "nightExt" : k < 0.68 ? "duskExt" : k < 0.82 ? "dayExt" : "nightExt"]; },
    keys: [[T.k03 - 0.15, 0.2, 3.0, 12.6, 0, 1.9, 0, 56], [T.k04 - 0.05, 0, 3.2, 14, 0, 1.9, 0, 58]],
    st: (t) => { const k = pr(t, T.k03 - 0.15, T.k04 - 0.05);
      return { sky: k < 0.25 ? "dawn" : k < 0.5 ? "night" : k < 0.68 ? "dusk" : k < 0.82 ? "day" : "night", lamps: 5, lampK: k > 0.82 ? 1 : 0.2, neon: k > 0.82,
        shut: 1 - eo(pr(k, 0.45, 0.85)), dents: 1 - k, crowd: k < 0.82 ? "rewind" : undefined, crowdK: k * 0.55, rain: 0.6, canopy: k > 0.82 ? 1 : 0.4, clock: "3:07" }; } },
  { a: T.k04 - 0.05, name: "arrive", dof: (t) => 10 * pr(t, T.k04 + 2.7, T.chime - 0.4), focus: [JN[0], 1.5, JN[1]],
    look: (t, c) => mixLook(LOOKS.nightExt, LOOKS.store, clamp01((2.0 - c[2]) / 2.5)),
    keys: [[T.k04 - 0.05, 0, 3.2, 14, 0, 1.9, 0, 58], [T.k04 + 1.55, 0, 1.55, 6.6, 0, 1.6, 0, 58], [T.k04 + 2.7, 0, 1.55, 0.3, 1.2, 1.45, -2.2, 56], [T.chime - 0.4, 2.3, 1.55, -1.55, JN[0], 1.3, JN[1], 36]],
    st: (t) => ({ ...night, door: pr(t, T.k04 + 1.05, T.k04 + 1.85) }),
    cast: (t) => [joe(JN[0], 0, JN[1], { expr: "sleepy", look: 0.3, blink: blink(t, 1), headTilt: 4 * Math.sin(t * 1.3), facing: 1 })] },
  { a: T.chime - 0.4, name: "door", look: "store", dof: 7, focus: (t) => { const k = eo(pr(t, T.chime - 0.4, T.walks + 0.5)); return [lerp(1.3, -0.35, k), 1.6, lerp(7.2, 0.8, k)]; },
    keys: [[T.chime - 0.4, 3.3, 1.55, -3.3, -0.1, 1.4, 0.8, 50, 0], [T.not - 0.1, 3.05, 1.5, -3.2, -0.25, 1.4, 0.8, 28, 0.05]],
    st: (t) => ({ ...night, door: pr(t, T.chime - 0.15, T.chime + 0.4), flick: t > T.walks }),
    cast: (t) => { const k = pr(t, T.chime - 0.4, T.walks + 0.5), e = eo(k), x = lerp(1.3, -0.35, e), z = lerp(7.2, 0.8, e);
      return [zom(x, z < 1.75 ? SWK : 0, z, { mode: k < 1 ? "stroll" : "stand", phase: (t * 0.9) % 1, reach: 1, expr: k < 1 ? "zom" : "zom2", headTilt: 6 * Math.sin(t * 2) })]; } },
  { a: T.not - 0.1, name: "shock", look: "store", dof: 16, focus: [JN[0], 1.5, JN[1]],
    keys: [[T.not - 0.1, 2.0, 1.5, -1.0, JN[0], 1.28, JN[1], 42], [T.k06, 2.3, 1.5, -1.5, JN[0], 1.32, JN[1], 36]],
    st: () => ({ ...night, door: 1, flick: true }),
    cast: (t) => { const sc = t > T.gas - 0.05; return [joe(JN[0], 0, JN[1], { expr: sc ? "scream" : "fear", armsUp: sc ? 0.55 : 0.15, look: -0.8, headTilt: sc ? -4 : 2 * Math.sin(t * 9) })]; } },
  { a: T.k06 - 0.05, name: "button", dof: 10, focus: [3.6, 1.25, -2.25],
    look: (t) => (t < HIT ? LOOKS.store : LOOKS.alarm),
    keys: [[T.k06 - 0.05, 3.2, 1.66, -1.5, 3.6, 1.2, -2.25, 46], [T.steel - 0.1, 3.3, 1.56, -1.66, 3.6, 1.2, -2.25, 38]],
    st: (t) => ({ ...night, door: 1, alarm: t > HIT ? 1 : 0, btnDown: t > HIT && t < HIT + 0.5, lampK: 0.8 }),
    fx: (t, c) => { const k = t < HIT ? eo(pr(t, HIT - 0.22, HIT)) : 1, bob = t > HIT ? 0.02 * kick(t, HIT, 0.2) : 0, { f, r, u } = camAxes(c);
      // костяшки (0.173 м ниже центра карточки) ложатся точно на верх кнопки; карточка чуть ближе к камере, чем кнопка
      const rot = lerp(0.5, 0.1, k), tgt = new THREE.Vector3(3.6, 1.29, -2.25).addScaledVector(f, -0.1);
      const P = tgt.clone().addScaledVector(r, -0.173 * Math.sin(rot) + 0.32 * (1 - k)).addScaledVector(u, 0.173 * Math.cos(rot) + 0.6 * (1 - k) - bob);
      const b = new THREE.Vector3(3.6, 1.3, -2.25).addScaledVector(f, -0.15);
      return [{ key: "fist", cw: 300, ch: 600, draw: fxFist, x: P.x, y: P.y, z: P.z, w: 0.2, h: 0.4, rot }, ...burst(t, HIT, b.x, b.y, b.z, 0.42, 0.22)]; } },
  { a: T.steel - 0.1, name: "crash", look: "alarm", dof: 4, focus: [0.3, 1.5, 0.6],
    keys: [[T.steel - 0.1, -0.8, 0.5, -3.4, 0.6, 1.9, 0.4, 64, 0], [T.crash, -0.7, 0.55, -3.2, 0.5, 1.7, 0.4, 60, 0.05], [T.k07 - 0.1, -0.6, 0.6, -3.0, 0.5, 1.75, 0.4, 58, 0]],
    st: (t) => ({ ...night, door: 1 - pr(t, T.steel - 0.1, T.steel + 0.25), alarm: 1, lampK: 0.55, neon: t < T.crash, shut: sm(pr(t, T.steel, T.crash + 0.05)), flick: true, knock: [0.1, -0.2, kick(t, T.crash + 0.5, 0.4)] }),
    cast: (t) => [zom(0.1, SWK, 0.8, { pound: (t * 2.2) % 1, expr: "zom2" })] },
  { a: T.k07 - 0.1, name: "car", look: "nightExt", dof: 6, focus: (t) => { const zk = pr(t, T.k07 - 0.1, T.alarm - 0.15); return [lerp(-6.2, -8.55, zk), 1.5, lerp(14.6, 13.45, zk)]; },
    keys: [[T.k07 - 0.1, -8.4, 0.55, 19.4, -9.3, 0.95, 13.0, 54], [T.alarm, -8.8, 0.6, 18.8, -9.4, 0.95, 13.0, 51], [T.k08 - 0.05, -9.0, 0.6, 18.5, -9.5, 0.95, 13.0, 50]],
    st: (t) => { const on = t > T.alarm - 0.15, bump = on ? Math.sin((t - T.alarm) * 22) * Math.exp(-(t - T.alarm + 0.15) * 3) : 0;
      return { sky: "night", lamps: 5, lampK: 0.15, neon: false, shut: 1, car: on, carBump: bump, rain: 0.8, canopy: 0.6, clock: "4:40" }; },
    cast: (t) => { const on = t > T.alarm - 0.15, zk = pr(t, T.k07 - 0.1, T.alarm - 0.15), x = lerp(-6.2, -8.55, zk), z = lerp(14.6, 13.45, zk);
      if (on) return [zom(x, 0, z, { expr: "zomO", armsUp: 0.8, headTilt: -6 })];
      return [{ id: "z1", o: Z1, x, y: 0, z, side: true, mirror: true, so: { mode: "march", phase: (t * 0.9) % 1, stride: 0.6, expr: "zom", seed: 11 } }]; } },
  { a: T.k08 - 0.05, name: "gather", look: "dawnExt", dof: 0,
    keys: [[T.k08 - 0.05, 6.8, 2.4, 5.6, 0.5, 1.2, 3.0, 60], [T.k09 - 0.05, 5.9, 3.5, 4.2, -1.0, 1.0, 1.6, 54]],
    st: (t) => { const k = pr(t, T.k08 - 3.05, T.k09 - 0.6); return { sky: "dawn", lamps: 5, lampK: 0.2, neon: false, shut: 1, crowd: "gather", crowdK: k, dents: k, rain: 0.2, canopy: 0.3, clock: "6:31" }; } },
  { a: T.k09 - 0.05, name: "bolts", look: "dawnIn", dof: 0,
    keys: [[T.k09 - 0.05, -1.2, 0.9, -5.2, 0.9, 1.8, 0.4, 58, -0.03], [T.one, -0.7, 1.05, -4.3, 0.8, 1.8, 0.4, 52, 0.03]],
    st: (t) => ({ sky: "dawn", lamps: 5, lampK: 0.3, neon: false, shut: 1, bulge: 0.5 + 0.2 * Math.abs(Math.sin(t * 5)), dents: 1, slits: 1, shafts: 1, alarm: 0.25, crowd: "pound", rain: 0, clock: "6:31" }) },
  { a: T.one - 0.15, name: "bolt2", look: "warmIn", dof: 10, focus: [1.6, 3.3, -0.15],
    keys: [[T.one - 0.15, 2.7, 2.75, -1.9, 1.6, 3.25, -0.15, 40], [P1, 2.55, 2.8, -1.7, 1.6, 3.28, -0.15, 34], [T.k10 - 0.05, 2.45, 2.8, -1.7, 1.6, 3.2, -0.15, 36]],
    st: (t) => ({ sky: "dawn", lamps: 5, lampK: 0.85, neon: false, shut: 1, bulge: 0.6 + 0.1 * Math.sin(t * 9), dents: 1, slits: 1, shafts: 1, crowd: "pound", pop: [P1, P2], rain: 0, clock: "6:31" }),
    fx: (t) => [...burst(t, P1, 1.41, 3.3, -0.3, 0.5, 0.25), ...burst(t, P2, 1.79, 3.3, -0.3, 0.55, 0.25)] },
  { a: T.k10 - 0.05, name: "panic", look: "alarm", dof: 14, focus: [0.2, 1.5, -3.4],
    keys: [[T.k10 - 0.05, -0.7, 1.5, -0.9, 0.2, 1.3, -3.4, 46], [T.k11 - 0.05, -0.5, 1.5, -1.3, 0.2, 1.3, -3.4, 42]],
    st: () => ({ sky: "dawn", lamps: 5, lampK: 0.6, alarm: 0.8, neon: false, shut: 1, dents: 1, slits: 0.6, crowd: "pound", rain: 0, clock: "6:31" }),
    cast: (t) => { const ph = t < T.scream - 0.05 ? 0 : t < T.run - 0.05 ? 1 : 2;
      const fo: FrontOpts[] = [{ expr: "fear", armsUp: 0.6 }, { expr: "scream", armsUp: 1, headTilt: 5 * Math.sin(t * 20) }, { expr: "scream", mode: "march", phase: (t * 2.6) % 1, lift: 90 }];
      return [joe(0.2, 0, -3.4, fo[ph])]; } },
  { a: T.k11 - 0.05, name: "calm", look: "dim", dof: 16, focus: [JN[0], 1.5, JN[1]],
    keys: [[T.k11 - 0.05, 2.5, 1.5, -1.15, JN[0], 1.35, JN[1], 38], [T.shoes - 0.1, 2.75, 1.5, -1.5, JN[0], 1.38, JN[1], 32]],
    st: () => ({ sky: "dawn", lamps: 5, lampK: 0.5, alarm: 0.3, neon: false, shut: 1, dents: 1, crowd: "pound", rain: 0, clock: "6:31" }),
    cast: (t) => [joe(JN[0], 0, JN[1], { expr: "resolve", look: -0.2, blink: blink(t, 2) })] },
  { a: T.shoes - 0.1, name: "cctv", dof: 0,
    look: (t) => { const on = t < T.lights ? 5 : Math.max(0, 4 - Math.floor((t - T.lights) / 0.16)); return mixLook(LOOKS.store, LOOKS.dim, 1 - on / 5); },
    keys: [[T.shoes - 0.1, 6.3, 3.2, -0.9, 2.6, 0.6, -3.4, 72], [T.crawl - 0.1, 6.3, 3.2, -0.9, 3.0, 0.6, -3.2, 68]],
    st: (t) => ({ sky: "dawn", lamps: t < T.lights ? 5 : Math.max(0, 4 - Math.floor((t - T.lights) / 0.16)), lampK: 0.7, neon: false, shut: 1, dents: 1, slits: 1, shafts: 0.4, crowd: "pound", rain: 0, clock: "6:31" }),
    cast: (t) => [joe(JN[0], 0, JN[1], { expr: "resolve", look: 0.5, wave: t > T.lights - 0.2 ? 0.3 : undefined })] },
  { a: T.crawl - 0.1, name: "hide", look: "dayIn", dof: 12, focus: [3.4, 0.8, -3.25], keyDir: HIDE_DIR,
    keys: [[T.crawl - 0.1, 5.75, 0.5, -3.25, 3.4, 0.62, -3.25, 54], [T.move, 5.4, 0.55, -3.25, 3.4, 0.68, -3.25, 48], [T.k12 - 0.1, 5.2, 0.6, -3.25, 3.4, 0.72, -3.25, 46]],
    st: () => ({ sky: "day", lamps: 0, neon: false, shut: 1, dents: 0.6, slits: 1, shafts: 1, crowd: "pound", rain: 0, canopy: 0, clock: "6:31" }),
    cast: (t) => [joe(3.4, 0, -3.25, { mode: "sit", hug: true, expr: "fear", look: -0.5, blink: blink(t, 3) })] },
  { a: T.k12 - 0.05, name: "eyes", look: "dayExt", dof: 14, focus: [0.3, 1.55, 3.9],
    keys: [[T.k12 - 0.05, 0.45, 1.8, 7.6, 0.3, 1.32, 3.9, 44], [T.sound - 0.3, 0.5, 1.8, 7.0, 0.3, 1.36, 3.9, 40]],
    st: () => ({ sky: "day", lamps: 0, neon: false, shut: 1, dents: 1, bulge: 0.3, crowd: "pound", rain: 0, canopy: 0, clock: "2:15" }),
    cast: (t) => { const tilt = t > T.sound - 0.35 ? 14 * sm(pr(t, T.sound - 0.35, T.sound)) : 0;
      return [zom(0.3, 0, 3.9, { expr: "zom", look: Math.sin(t * 2.3) * 0.8, headTilt: 3 + tilt, reach: 0.6, phase: t * 0.2 }, { scale: 1.02 })]; },
    fx: (t) => (t > T.sound - 0.35 ? waves(t, T.sound - 0.35, 0.3, 1.62, 3.85, 1.5, 3.6) : []) },
  { a: T.and40 - 0.1, name: "breath", look: "dayIn", dof: 16, focus: [3.4, 0.85, -3.25], keyDir: () => HIDE_DIR(1e9),
    keys: [[T.and40 - 0.1, 5.6, 1.0, -3.25, 3.4, 0.82, -3.25, 44], [T.k13 - 0.05, 5.3, 1.0, -3.25, 3.4, 0.82, -3.25, 40]],
    st: () => ({ sky: "day", lamps: 0, neon: false, shut: 1, dents: 1, slits: 1, shafts: 1, crowd: "pound", rain: 0, canopy: 0, clock: "2:15" }),
    cast: (t) => [joe(3.4, 0, -3.25, { mode: "sit", hug: true, expr: "puff", look: Math.sin(t * 3) > 0 ? 0.9 : -0.9 })] },
  { a: T.k13 - 0.05, name: "leave", look: "duskExt", dof: 0,
    keys: [[T.k13 - 0.05, 0, 3.3, 2.2, 0, 0.6, 15, 58], [T.k14 - 0.05, 0, 3.9, 2.6, 0, 0.2, 17, 56]],
    st: (t) => ({ sky: "dusk", lamps: 0, neon: false, shut: 1, dents: 0.5, crowd: "leave", crowdK: pr(t, T.k13 - 0.35, T.k14 + 0.3), rain: 0.3, canopy: 0.35, clock: "8:10" }) },
  { a: T.k14 - 0.05, name: "knock", look: "moonIn", dof: 6, focus: [0, 1.5, 0.4],
    keys: [[T.k14 - 0.05, 0.9, 1.3, -5.6, 0, 1.6, 0.4, 52], [KN[0], 0.6, 1.4, -3.9, 0, 1.6, 0.4, 48], [KN[1], 0.55, 1.4, -3.6, 0, 1.6, 0.4, 46]],
    st: (t) => ({ sky: "night", lamps: 0, neon: false, shut: 1, slits: 0.55, slitCol: 0xb4ccff, shafts: 0.9, rain: 0.8, canopy: 0.25, exit: 1, clock: "1:12",
      fig: pr(t, T.k14 + 0.9, KN[0] - 0.2), knock: [0, -0.1, t > KN[0] ? 0.3 + 0.7 * kick(t, KN[0], 0.3) : 0] }),
    cast: (t) => (t > T.k14 + 0.9 ? [zom(0.05, SWK, 0.95, { expr: "zom", reach: 0.4 }, { blob: false })] : []),
    fx: (t) => waves(t, KN[0], 0, 1.4, 0.3, 1.8, 0.7) },
  { a: KN[1] - 0.06, name: "peek", look: "moonIn", dof: 14, focus: [3.8, 1.25, -3.25],
    keys: [[KN[1] - 0.06, 2.2, 1.3, -1.3, 3.8, 1.25, -3.25, 30], [KN[2], 2.25, 1.3, -1.4, 3.8, 1.25, -3.25, 28]],
    st: () => ({ sky: "night", lamps: 0, neon: false, shut: 1, slits: 0.55, slitCol: 0xb4ccff, shafts: 0.9, rain: 0.8, canopy: 0.25, exit: 1, clock: "1:12", fig: 1, knock: [0, -0.1, 0.5] }),
    cast: () => [joe(3.8, -0.25, -3.25, { expr: "fear", look: -0.9 }, { blob: false }), zom(0.05, SWK, 0.95, { expr: "zom" }, { blob: false })] },
  { a: KN[2] - 0.06, name: "knock3", look: "moonIn", dof: 5, focus: [0, 1.5, 0.4],
    keys: [[KN[2] - 0.06, 0.3, 1.45, -2.9, 0, 1.55, 0.4, 46], [T.card, 0.25, 1.45, -2.5, 0, 1.55, 0.4, 40]],
    st: (t) => ({ sky: "night", lamps: 0, neon: false, shut: 1, slits: 0.55, slitCol: 0xb4ccff, shafts: 0.9, rain: 0.8, canopy: 0.25, exit: 1, clock: "1:12", fig: 1, knock: [0, -0.1, 0.6 + 0.4 * kick(t, KN[2], 0.3)] }),
    cast: () => [zom(0.05, SWK, 0.95, { expr: "zom", reach: 0.4 }, { blob: false })],
    fx: (t) => waves(t, KN[2], 0, 1.4, 0.3, 2.0, 0.8) },
  { a: T.card, name: "end", look: "moonIn", dof: 0, keys: [[T.card, 0.25, 1.45, -2.5, 0, 1.55, 0.4, 40]],
    st: () => ({ sky: "night", lamps: 0, neon: false, shut: 1, clock: "1:12" }) },
];
export const SHOT_LIST = SHOTS.map((s) => [s.a, s.name] as const);
export const shotAt = (t: number) => { let i = 0; while (i < SHOTS.length - 1 && t >= SHOTS[i + 1].a) i++; return i; };

// удары: [время, сила]
const KICKS: [number, number][] = [[HIT, 1.0], [T.crash, 1.3], [T.alarm, 0.7], [P1, 0.9], [P2, 1.1], [KN[0], 1.0], [KN[1], 0.9], [KN[2], 1.3]];
const kickAt = (t: number) => { let a = 0; for (const [t0, g] of KICKS) { const n = Math.floor((t - t0) * FPS + 1e-6); if (n >= 0 && n < 7) a += g * (n % 2 ? -1 : 1) * (1 - n / 7) ** 1.5; } return a; };

const camOf = (s: ShotDef, t: number) => {
  const K = s.keys; let i = 1;
  while (i < K.length - 1 && t >= K[i][0]) i++;
  const a = K[Math.max(0, i - 1)], b = K[Math.min(K.length - 1, i)], k = K.length < 2 || t <= a[0] ? 0 : t >= b[0] ? 1 : (s.linear ? (x: number) => clamp01(x) : glide)((t - a[0]) / (b[0] - a[0]));
  const L = (j: number) => lerp(a[j] as number, b[j] as number, k);
  const pos: V3 = [L(1), L(2), L(3)], look: V3 = [L(4), L(5), L(6)];
  // «вползание»: каждый кадр плана объект чуть растёт (fov сужается ~0.15 %/кадр, не больше 15 %)
  const creep = Math.max(0.85, 1 - 0.0015 * (t - s.a) * FPS);
  let fov = (360 / Math.PI) * Math.atan(Math.tan((L(7) * Math.PI) / 360) * creep), roll = lerp((a[8] ?? 0) as number, (b[8] ?? 0) as number, k);
  const kk = kickAt(t);
  if (kk) {
    const d = [look[0] - pos[0], look[1] - pos[1], look[2] - pos[2]], len = Math.hypot(d[0], d[1], d[2]), h = Math.hypot(d[0], d[2]) || 1;
    const m = (10 / 960) * Math.tan((fov * Math.PI) / 360) * len * kk;
    look[0] -= (d[2] / h) * m; look[1] += 0.6 * m; look[2] += (d[0] / h) * m; roll += kk * 0.006;
  }
  return { pos, look, fov, roll };
};
/** направление НА ключевой свет: мировое (look.dir / keyDir) или от оси камеры первого ключа плана (az, el) */
const keyOf = (s: ShotDef, L: Look, t: number): THREE.Vector3 => {
  if (s.keyDir) return new THREE.Vector3(...s.keyDir(t)).normalize();
  if (L.dir) return new THREE.Vector3(...L.dir).normalize();
  const k0 = s.keys[0], fw = new THREE.Vector3(k0[4] - k0[1], 0, k0[6] - k0[3]).normalize(), rt = new THREE.Vector3(-fw.z, 0, fw.x);
  const az = (L.az * Math.PI) / 180, el = (L.el * Math.PI) / 180;
  return fw.multiplyScalar(Math.cos(az)).addScaledVector(rt, Math.sin(az)).multiplyScalar(Math.cos(el)).add(new THREE.Vector3(0, Math.sin(el), 0)).normalize();
};

export const frameAt = (f: number): Frame & { dof: number; shot: number; name: string } => {
  const t = f / FPS, i = shotAt(t), s = SHOTS[i], cam = camOf(s, t);
  const look = typeof s.look === "string" ? LOOKS[s.look] : s.look(t, cam.pos);
  const focus = s.focus ? (typeof s.focus === "function" ? s.focus(t) : s.focus) : cam.look;
  return { t, st: s.st(t), look, key: keyOf(s, look, t), cam, focus, puts: s.cast ? s.cast(t) : [], fx: s.fx ? s.fx(t, cam) : [],
    dof: typeof s.dof === "function" ? s.dof(t) : s.dof, shot: i, name: s.name };
};
