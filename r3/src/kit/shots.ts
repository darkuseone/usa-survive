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
/** бит камеры (грамматика образца): к моменту t камера приезжает в кадр за d с (smootherstep, по умолчанию 0,8 с), затем держит его
 *  с медленным наездом push (доля фокусного за кадр). pos/look могут быть функциями времени — камера ведёт героя. */
export type Vf = V3 | ((t: number) => V3);
export type Beat = { t: number; d?: number; pos: Vf; look: Vf; fov: number; roll?: number; push?: number };
export type ShotDef = {
  a: number; name: string; look: LookName | ((t: number, cam: V3) => Look); keys?: K[]; beats?: Beat[]; push?: number; st: (t: number) => St;
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

const ev = (v: Vf, t: number): V3 => (typeof v === "function" ? v(t) : v);
const zoomFov = (fov: number, z: number) => (360 / Math.PI) * Math.atan(Math.tan((fov * Math.PI) / 360) * z);

export const makeStory = (shots: ShotDef[], kicks: [number, number][], dur: number, aspect = 9 / 16) => {
  const pc = new THREE.PerspectiveCamera(50, aspect, 0.05, 900), pv = new THREE.Vector3();
  /** камера по битам: удержание с наездом -> переезд -> удержание; непрерывна по положению и фокусному */
  const beatCam = (s: ShotDef, t: number): Cam => {
    const B = s.beats!, P0 = s.push ?? 0.0025;
    const held = (i: number, u: number) => { const b = B[i]; return { pos: ev(b.pos, u), look: ev(b.look, u), roll: b.roll ?? 0,
      fov: zoomFov(b.fov, Math.max(0.72, 1 - (b.push ?? P0) * Math.max(0, u - b.t) * FPS)) }; };
    let i = 0; while (i < B.length - 1 && t >= B[i + 1].t - (B[i + 1].d ?? 0.8)) i++;
    if (t >= B[i].t || i === 0) return held(i, t);
    const d = B[i].d ?? 0.8, s0 = B[i].t - d, k = glide((t - s0) / d), A = held(i - 1, Math.min(t, s0)), Bn = held(i, B[i].t);
    const a2 = held(i - 1, t), b2 = held(i, t);   // цели-функции продолжают двигаться во время переезда
    const L = (x: V3, y: V3): V3 => [lerp(x[0], y[0], k), lerp(x[1], y[1], k), lerp(x[2], y[2], k)];
    return { pos: L(a2.pos, b2.pos), look: L(a2.look, b2.look), fov: lerp(A.fov, Bn.fov, k), roll: lerp(A.roll, Bn.roll, k) };
  };
  const TOTAL = Math.round(dur * FPS);
  const shotAt = (t: number) => { let i = 0; while (i < shots.length - 1 && t >= shots[i + 1].a) i++; return i; };
  const kickAt = (t: number) => { let a = 0; for (const [t0, g] of kicks) { const n = Math.floor((t - t0) * FPS + 1e-6); if (n >= 0 && n < 7) a += g * (n % 2 ? -1 : 1) * (1 - n / 7) ** 1.5; } return a; };
  const camOf = (s: ShotDef, t: number): Cam => {
    if (s.beats) return withKick(beatCam(s, t), t);
    const K = s.keys!; let vals: number[];
    // все 8 значений (x y z, цель x y z, fov, крен): у ключа без крена slice давал 7, крен = undefined -> матрица камеры NaN -> падение кадра
    const all = (k: K) => [1, 2, 3, 4, 5, 6, 7, 8].map((c) => (k[c] ?? 0) as number);
    if (K.length < 2 || t <= K[0][0]) vals = all(K[0]);
    else if (t >= K[K.length - 1][0]) vals = all(K[K.length - 1]);
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
    return withKick({ pos, look, fov: zoomFov(vals[6], creep), roll: vals[7] }, t);
  };
  const withKick = (c: Cam, t: number): Cam => {
    const { pos } = c, look: V3 = [...c.look], fov = c.fov; let roll = c.roll;
    const kk = kickAt(t);
    if (kk) {
      const d = [look[0] - pos[0], look[1] - pos[1], look[2] - pos[2]], len = Math.hypot(d[0], d[1], d[2]), h = Math.hypot(d[0], d[2]) || 1;
      const m = (10 / 960) * Math.tan((fov * Math.PI) / 360) * len * kk;
      look[0] -= (d[2] / h) * m; look[1] += 0.6 * m; look[2] += (d[0] / h) * m; roll += kk * 0.006;
    }
    return { pos, look, fov, roll };
  };
  /** экранный сдвиг за кадр (для размытия в движении): точку цели текущей камеры проецируем предыдущей камерой того же плана */
  const ndc = (c: Cam, p: V3) => { pc.fov = c.fov; pc.position.set(...c.pos); pc.up.set(0, 1, 0); pc.lookAt(...c.look); pc.rotateZ(c.roll); pc.updateMatrixWorld(); pc.updateProjectionMatrix(); return pv.set(...p).project(pc).clone(); };
  const blurAt = (s: ShotDef, t: number, c: Cam): [number, number] => {
    if (t - 1 / FPS < s.a) return [0, 0];
    // размытие только на быстрых переездах (хлыст, пролёт: d ≤ 0,5 с); при ведении героя он должен оставаться резким
    if (s.beats && !s.beats.some((b) => (b.d ?? 0.8) <= 0.5 && t >= b.t - (b.d ?? 0.8) && t <= b.t + 1 / FPS)) return [0, 0];
    const p = camOf(s, t - 1 / FPS), a = ndc(c, c.look), b = ndc(p, c.look);
    const Wp = aspect < 1 ? 1080 : 1920, Hp = Wp / aspect;          // кадр в пикселях
    let px = ((a.x - b.x) / 2) * Wp * 0.6, py = ((a.y - b.y) / 2) * Hp * 0.6;   // сдвиг за выдержку 0,6 кадра
    const m = Math.hypot(px, py); if (m < 24) return [0, 0];   // обычные переезды образца — до ~50 px/кадр без размытия; размытие только «хлыстам»
    if (m > 160) { px *= 160 / m; py *= 160 / m; }
    return [px / Wp, py / Hp];
  };
  const keyOf = (s: ShotDef, L: Look, t: number): THREE.Vector3 => {
    if (s.keyDir) return new THREE.Vector3(...s.keyDir(t)).normalize();
    if (L.dir) return new THREE.Vector3(...L.dir).normalize();
    const c0 = s.beats ? beatCam(s, s.beats[0].t) : null, k0: number[] = c0 ? [0, ...c0.pos, ...c0.look] : (s.keys![0] as number[]);
    const fw = new THREE.Vector3(k0[4] - k0[1], 0, k0[6] - k0[3]).normalize(), rt = new THREE.Vector3(-fw.z, 0, fw.x);
    const az = (L.az * Math.PI) / 180, el = (L.el * Math.PI) / 180;
    return fw.multiplyScalar(Math.cos(az)).addScaledVector(rt, Math.sin(az)).multiplyScalar(Math.cos(el)).add(new THREE.Vector3(0, Math.sin(el), 0)).normalize();
  };
  const frameAt = (f: number): Frame & { dof: number; shot: number; name: string; blur: [number, number] } => {
    const t = f / FPS, i = shotAt(t), s = shots[i], cam = camOf(s, t);
    const look = typeof s.look === "string" ? LOOKS[s.look] : s.look(t, cam.pos);
    const focus = s.focus ? (typeof s.focus === "function" ? s.focus(t) : s.focus) : cam.look;
    return { t, st: s.st(t), look, key: keyOf(s, look, t), cam, focus, puts: s.cast ? s.cast(t) : [], fx: s.fx ? s.fx(t, cam) : [],
      dof: typeof s.dof === "function" ? s.dof(t) : s.dof, shot: i, name: s.name, blur: blurAt(s, t, cam) };
  };
  /** скорость камеры на экране, px/кадр при 1080 по ширине (для проверки темпа переездов против образца) */
  const speedAt = (f: number) => { const t = f / FPS, s = shots[shotAt(t)]; if (t - 1 / FPS < s.a) return 0; const c = camOf(s, t), p = camOf(s, t - 1 / FPS);
    const Wp = aspect < 1 ? 1080 : 1920, Hp = Wp / aspect; let m = 0;
    const { r: R, u: U } = camAxes(c), D = Math.hypot(c.look[0] - c.pos[0], c.look[1] - c.pos[1], c.look[2] - c.pos[2]);
    for (const [u, v] of [[0, 0], [0.35, 0.35], [-0.35, -0.35]]) { const P3: V3 = [c.look[0] + (R.x * u + U.x * v) * D, c.look[1] + (R.y * u + U.y * v) * D, c.look[2] + (R.z * u + U.z * v) * D];
      const a = ndc(c, P3), b = ndc(p, P3); m = Math.max(m, Math.hypot(((a.x - b.x) / 2) * Wp, ((a.y - b.y) / 2) * Hp)); }
    return m; };
  return { speedAt, TOTAL, SHOT_LIST: shots.map((s) => [s.a, s.name] as const), shotAt, frameAt, camAt: (t: number) => camOf(shots[shotAt(t)], t) };
};
