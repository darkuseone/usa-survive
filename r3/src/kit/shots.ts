// Общая раскадровка стиля B: планы (ShotDef) -> кадр мира (Frame). Грамматика камеры из claude-animated-shorts + пожелание
// владельца 13.11.2026 «больше непрерывной камеры»:
//  - spline: true — камера идёт одним движением через все ключи плана (Catmull-Rom), ускоряется в начале и тормозит в конце
//    (smootherstep по всему плану), без остановок на промежуточных ключах — «oner», проезд между объектами;
//  - без spline — от ключа к ключу со smootherstep (стоп на каждом ключе), linear — равномерно;
//  - creep — медленный наезд (сужение fov) каждый кадр плана; kicks — удары (знак меняется каждый кадр, 7 кадров);
//  - свет: ключ от оси камеры первого ключа (look.az/el) или мировой (look.dir / keyDir).
import * as THREE from "three";
import { LOOKS, Look, LookName } from "../videos/gas/look";
import { Frame, Put, FxPut, St, V3 } from "../videos/gas/world";

export const FPS = 30;
/** ключ камеры: [время, позиция x y z, цель x y z, fov, крен] */
export type K = [number, number, number, number, number, number, number, number, number?];
export type Cam = { pos: V3; look: V3; fov: number; roll: number };
export type ShotDef = {
  a: number; name: string; look: LookName | ((t: number, cam: V3) => Look); keys: K[]; st: (t: number) => St;
  cast?: (t: number) => Put[]; fx?: (t: number, cam: Cam) => FxPut[]; dof: number | ((t: number) => number); focus?: V3 | ((t: number) => V3);
  keyDir?: (t: number) => V3; linear?: boolean; spline?: boolean; creep?: number;
};
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const pr = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const eo = (x: number) => 1 - (1 - clamp01(x)) ** 3;
export const sm = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
export const glide = (x: number) => { const u = clamp01(x); return u * u * u * (u * (u * 6 - 15) + 10); };
export const kick = (t: number, t0: number, d = 0.35) => (t > t0 && t < t0 + d ? 1 - (t - t0) / d : 0);
/** оси камеры (вправо, вверх, вперёд) — для эффектов, привязанных к экрану */
export const camAxes = (c: Cam) => {
  const f = new THREE.Vector3(c.look[0] - c.pos[0], c.look[1] - c.pos[1], c.look[2] - c.pos[2]).normalize();
  const r = new THREE.Vector3().crossVectors(f, new THREE.Vector3(0, 1, 0)).normalize(), u = new THREE.Vector3().crossVectors(r, f);
  return { f, r, u };
};

const cr = (p0: number, p1: number, p2: number, p3: number, u: number) =>
  0.5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (-p0 + 3 * p1 - 3 * p2 + p3) * u * u * u);

export const makeStory = (shots: ShotDef[], kicks: [number, number][], dur: number) => {
  const TOTAL = Math.round(dur * FPS);
  const shotAt = (t: number) => { let i = 0; while (i < shots.length - 1 && t >= shots[i + 1].a) i++; return i; };
  const kickAt = (t: number) => { let a = 0; for (const [t0, g] of kicks) { const n = Math.floor((t - t0) * FPS + 1e-6); if (n >= 0 && n < 7) a += g * (n % 2 ? -1 : 1) * (1 - n / 7) ** 1.5; } return a; };
  const camOf = (s: ShotDef, t: number): Cam => {
    const K = s.keys; let vals: number[];
    if (K.length < 2 || t <= K[0][0]) vals = K[0].slice(1).map((v) => (v ?? 0) as number);
    else if (t >= K[K.length - 1][0]) vals = K[K.length - 1].slice(1).map((v) => (v ?? 0) as number);
    else if (s.spline && K.length > 2) {
      // время плана -> время ключей: разгон и торможение только на краях (~0,7 с), в середине ключи проходятся по своим временам
      const t0 = K[0][0], t1 = K[K.length - 1][0], span = t1 - t0, q = Math.min(0.25, 0.7 / span), x = clamp01((t - t0) / span);
      const F = (u: number) => u * u * u - (u * u * u * u) / 2, A = 1 - q;
      const P_ = x < q ? q * F(x / q) : x > 1 - q ? A - q * F((1 - x) / q) : q / 2 + (x - q);
      const tt = t0 + (P_ / A) * span;
      let i = 0; while (i < K.length - 2 && tt >= K[i + 1][0]) i++;
      const u = clamp01((tt - K[i][0]) / (K[i + 1][0] - K[i][0]));
      const P = (j: number) => K[Math.max(0, Math.min(K.length - 1, j))];
      vals = [1, 2, 3, 4, 5, 6, 7, 8].map((c) => cr((P(i - 1)[c] ?? 0) as number, (P(i)[c] ?? 0) as number, (P(i + 1)[c] ?? 0) as number, (P(i + 2)[c] ?? 0) as number, u));
    } else {
      let i = 1; while (i < K.length - 1 && t >= K[i][0]) i++;
      const a = K[i - 1], b = K[i], k = (s.linear ? clamp01 : glide)((t - a[0]) / (b[0] - a[0]));
      vals = [1, 2, 3, 4, 5, 6, 7, 8].map((c) => lerp((a[c] ?? 0) as number, (b[c] ?? 0) as number, k));
    }
    const pos: V3 = [vals[0], vals[1], vals[2]], look: V3 = [vals[3], vals[4], vals[5]];
    const creep = Math.max(0.85, 1 - (s.creep ?? 0.0015) * (t - s.a) * FPS);
    const fov = (360 / Math.PI) * Math.atan(Math.tan((vals[6] * Math.PI) / 360) * creep); let roll = vals[7];
    const kk = kickAt(t);
    if (kk) {
      const d = [look[0] - pos[0], look[1] - pos[1], look[2] - pos[2]], len = Math.hypot(d[0], d[1], d[2]), h = Math.hypot(d[0], d[2]) || 1;
      const m = (10 / 960) * Math.tan((fov * Math.PI) / 360) * len * kk;
      look[0] -= (d[2] / h) * m; look[1] += 0.6 * m; look[2] += (d[0] / h) * m; roll += kk * 0.006;
    }
    return { pos, look, fov, roll };
  };
  const keyOf = (s: ShotDef, L: Look, t: number): THREE.Vector3 => {
    if (s.keyDir) return new THREE.Vector3(...s.keyDir(t)).normalize();
    if (L.dir) return new THREE.Vector3(...L.dir).normalize();
    const k0 = s.keys[0], fw = new THREE.Vector3(k0[4] - k0[1], 0, k0[6] - k0[3]).normalize(), rt = new THREE.Vector3(-fw.z, 0, fw.x);
    const az = (L.az * Math.PI) / 180, el = (L.el * Math.PI) / 180;
    return fw.multiplyScalar(Math.cos(az)).addScaledVector(rt, Math.sin(az)).multiplyScalar(Math.cos(el)).add(new THREE.Vector3(0, Math.sin(el), 0)).normalize();
  };
  const frameAt = (f: number): Frame & { dof: number; shot: number; name: string } => {
    const t = f / FPS, i = shotAt(t), s = shots[i], cam = camOf(s, t);
    const look = typeof s.look === "string" ? LOOKS[s.look] : s.look(t, cam.pos);
    const focus = s.focus ? (typeof s.focus === "function" ? s.focus(t) : s.focus) : cam.look;
    return { t, st: s.st(t), look, key: keyOf(s, look, t), cam, focus, puts: s.cast ? s.cast(t) : [], fx: s.fx ? s.fx(t, cam) : [],
      dof: typeof s.dof === "function" ? s.dof(t) : s.dof, shot: i, name: s.name };
  };
  return { TOTAL, SHOT_LIST: shots.map((s) => [s.a, s.name] as const), shotAt, frameAt, camAt: (t: number) => camOf(shots[shotAt(t)], t) };
};
