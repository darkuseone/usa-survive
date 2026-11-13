// Заправка из эп. 1 одной сценой three.js в стиле репозитория claude-animated-shorts: двухтоновый свет (kit/shade),
// рисованные текстуры, чернильные контуры (kit/ink), светящиеся HDR-источники под bloom, герои — карточки (kit/cards).
// Раскладка та же, что в episodes/shorts/station3d.js (версия A): оси +x вправо со стоянки, +z к трассе, витрина z = 0.
import * as THREE from "three";
import { Batch, boxGeo, V } from "../../kit/geo";
import { twoTone, TONE, CHAR, untone } from "../../kit/shade";
import { NOINK } from "../../kit/ink";
import { Pool, Actor, Fx, tier } from "../../kit/cards";
import { Pen, Outfit, FrontOpts, SideOpts, bodyFront, bodySide, zombieFit, fxContact } from "../../kit/toon";
import { Look } from "./look";
import * as P from "./paint";

export const SWK = 0.08;
const LANES = [-4.1, -0.8, 0, 0.8, 4.1];
export type V3 = [number, number, number];

/** состояние мира в кадре */
export type St = {
  sky: "night" | "dawn" | "day" | "dusk"; lamps?: number; lampK?: number; flick?: boolean; alarm?: number; neon?: boolean; canopy?: number; exit?: number;
  door?: number; shut?: number; bulge?: number; dents?: number; knock?: [number, number, number]; slits?: number; slitCol?: number; fig?: number;
  btnDown?: boolean; car?: boolean; carBump?: number; shafts?: number; pop?: [number, number]; rain?: number; clock?: string;
  crowd?: "pound" | "gather" | "leave" | "rewind"; crowdK?: number;
  /** подсобка (шортс S2): empty — холодильники пустые; doorA — дверь из зала в подсобку, doorB — задняя дверь во двор, doorC — дверь
   *  холодильной камеры (0 закрыта … 1 открыта); shelf — стеллаж 0 у задней двери … 1 оттащен; heater — струя из крана бойлера 0..1;
   *  fill — уровень в ведре 0..1; bulb — лампочка подсобки 0..1; speaker — волны от громкоговорителя на колонке 0..1; coolLight — свет в камере */
  empty?: boolean; doorA?: number; doorB?: number; doorC?: number; shelf?: number; heater?: number; fill?: number; bulb?: number; speaker?: number; coolLight?: number;
};
/** персонаж в кадре */
export type Put = { id: string; o: Outfit; x: number; y: number; z: number; side?: boolean; mirror?: boolean; fo?: FrontOpts; so?: SideOpts;
  blob?: boolean; shadow?: boolean; scale?: number; maxTier?: number };
/** эффект-карточка (повёрнута к камере или лежит на полу) */
export type FxPut = { key: string; cw: number; ch: number; draw: (p: Pen) => void; x: number; y: number; z: number; w: number; h: number; rot?: number; soft?: boolean; flat?: boolean };
export type Frame = { t: number; st: St; look: Look; key: THREE.Vector3; cam: { pos: V3; look: V3; fov: number; roll: number }; focus: V3; puts: Put[]; fx: FxPut[] };

const mats = new Map<string, THREE.Material>();
const lam = (key: string, p: THREE.MeshLambertMaterialParameters) => {
  let m = mats.get(key);
  if (!m) { m = twoTone(new THREE.MeshLambertMaterial(p)); mats.set(key, m); }
  return m as THREE.MeshLambertMaterial;
};
const col = (hex: string | number, k = 1) => new THREE.Color(hex as THREE.ColorRepresentation).multiplyScalar(k);
/** самосветящийся материал (значения > 1 ловит bloom) */
const glow = (hex: string | number, k: number, o: THREE.MeshBasicMaterialParameters = {}) => new THREE.MeshBasicMaterial({ color: col(hex, k), ...o });
const addM = (map: THREE.Texture, c: string | number, k: number) => new THREE.MeshBasicMaterial({ map, color: col(c, k), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false });
const q = (v: number, n = 12) => Math.round(v * n) / n;
const hh = (i: number, s = 0) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const fkey = (o: object) => JSON.stringify(o, (_k, v) => (typeof v === "number" ? Math.round(v * 100) / 100 : v));

type Crowd = { home: [number, number]; lane: number; far: [number, number]; lag: number; v: number; ph: number; o: Outfit };

export class GasWorld {
  root = new THREE.Group();
  private pool = new Pool();
  private actors: Actor[] = [];
  private fxs: Fx[] = [];
  private key: THREE.DirectionalLight;
  private sky: THREE.Mesh; private skyMat: THREE.ShaderMaterial; private moon: THREE.Sprite;
  private fog = new THREE.Fog("#1b2340", 20, 140);
  private lamps: THREE.Mesh[] = []; private canLamps: THREE.Mesh[] = [];
  private night: THREE.Object3D[] = []; private storeNeon: THREE.Object3D[] = [];
  private shut!: THREE.Mesh; private shut0!: Float32Array; private shutMat!: THREE.MeshLambertMaterial;
  private door!: THREE.Object3D; private btn!: THREE.Mesh; private clock!: THREE.MeshBasicMaterial; private exitM!: THREE.MeshBasicMaterial;
  private plate!: { g: THREE.Group; b: THREE.Mesh[]; x: number }; private cracks: THREE.Mesh[] = []; private spark!: THREE.Sprite;
  private car!: THREE.Group; private carLights: { m: THREE.MeshBasicMaterial; c: THREE.Color }[] = []; private carHalo: THREE.Sprite[] = [];
  private alarmHalo: THREE.Sprite[] = []; private fig!: THREE.Mesh; private shafts: THREE.Mesh[] = [];
  private rain!: THREE.LineSegments; private rain0: number[][] = []; private dust!: THREE.Points; private dust0: number[][] = [];
  private coolM!: THREE.MeshBasicMaterial; private br!: { doorA: THREE.Group; doorB: THREE.Group; doorC: THREE.Group; shelf: THREE.Group; stream: THREE.Mesh;
    water: THREE.Mesh; bulb: THREE.MeshBasicMaterial; bulbHalo: THREE.Sprite; coolLamp: THREE.MeshBasicMaterial; horn: THREE.Vector3; full: THREE.Texture; empty: THREE.Texture }; private traffic!: THREE.Sprite; private crowd: Crowd[] = [];
  private frustum = new THREE.Frustum(); private m4 = new THREE.Matrix4(); private sph = new THREE.Sphere(); private v = new THREE.Vector3();

  constructor(shadowMap = 2048) {
    const R = this.root;
    // ---- небо, луна, ключевой свет ----
    this.skyMat = new THREE.ShaderMaterial({
      uniforms: { top: { value: new THREE.Color() }, mid: { value: new THREE.Color() }, bot: { value: new THREE.Color() }, stars: { value: 0 } },
      vertexShader: "varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: `uniform vec3 top, mid, bot; uniform float stars; varying vec3 vP;
        float h(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
        void main(){ vec3 d = normalize(vP); float e = d.y;
          vec3 c = mix(bot, mid, smoothstep(-0.02, 0.18, e)); c = mix(c, top, smoothstep(0.18, 0.7, e));
          vec3 g = floor(d * 220.0); float s = step(0.9965, h(g)) * smoothstep(0.05, 0.3, e) * stars;
          gl_FragColor = vec4(c + vec3(s) * 1.4, 1.0); }`,
      side: THREE.BackSide, depthWrite: false, fog: false,
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(600, 32, 16), this.skyMat);
    this.sky.renderOrder = -1; this.sky.frustumCulled = false; this.sky.layers.set(NOINK); R.add(this.sky);
    this.moon = new THREE.Sprite(new THREE.SpriteMaterial({ map: P.glowT(), color: col("#f4f0ff", 2.2), fog: false, depthWrite: false }));
    this.moon.position.set(-60, 70, 260); this.moon.scale.set(26, 26, 1); this.moon.layers.set(NOINK); R.add(this.moon);
    this.key = new THREE.DirectionalLight("#ffffff", 2);
    this.key.castShadow = true; this.key.shadow.mapSize.set(shadowMap, shadowMap);
    R.add(this.key, this.key.target);
    this.buildGround(); this.buildFar(); this.buildShell(); this.buildFront(); this.buildInterior(); this.buildShutter(); this.buildCanopy(); this.buildCar(-10.6, 11.4, 0.25); this.buildBackRoom(); this.buildFx();
    // ---- толпа: 40 мест у жалюзи в три ряда, проход к трассе через коридоры между колонками ----
    for (let k = 0; k < 40; k++) {
      const row = k < 14 ? 0 : k < 28 ? 1 : 2, i = k - row * 14, n = row < 2 ? 14 : 12, r = (j: number) => hh(600 + k, j);
      const home: [number, number] = [-3.6 + ((i + 0.5 + (r(1) - 0.5) * 0.5) * 7.6) / n + (row % 2) * 0.25, 1.15 + row * 0.82 + r(2) * 0.22];
      const want = home[0] * 1.5 + (r(3) - 0.5) * 2, lane = LANES.reduce((a, b) => (Math.abs(b - want) < Math.abs(a - want) ? b : a)) + (r(4) - 0.5) * 0.3;
      this.crowd.push({ home, lane, far: [Math.max(-8.6, Math.min(20, lane * 1.4 + (r(5) - 0.5) * 5)), 14 + r(6) * 8], lag: r(7), v: k % 7, ph: Math.round(r(8) * 6) / 6, o: zombieFit(k % 7) });
    }
  }

  // =============================== постройка ===============================
  private quadAt(w: number, h: number, mat: THREE.Material, x: number, y: number, z: number, o: { rx?: number; ry?: number; noInk?: boolean; cast?: boolean } = {}) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    m.position.set(x, y, z); m.rotation.set(o.rx ?? 0, o.ry ?? 0, 0); m.receiveShadow = true; m.castShadow = !!o.cast;
    if (o.noInk) m.layers.set(NOINK);
    this.root.add(m); return m;
  }
  private box(b: Batch, cx: number, cy: number, cz: number, w: number, h: number, d: number, mat: THREE.Material, tile = 0) {
    b.add(boxGeo(V(cx - w / 2, cy - h / 2, cz - d / 2), V(cx + w / 2, cy + h / 2, cz + d / 2), tile), mat);
  }
  private mesh(geo: THREE.BufferGeometry, mat: THREE.Material | THREE.Material[], x: number, y: number, z: number, o: { rx?: number; ry?: number; rz?: number; cast?: boolean; parent?: THREE.Object3D; noInk?: boolean } = {}) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z); m.rotation.set(o.rx ?? 0, o.ry ?? 0, o.rz ?? 0); m.castShadow = o.cast ?? true; m.receiveShadow = true;
    if (o.noInk) m.layers.set(NOINK);
    (o.parent ?? this.root).add(m); return m;
  }
  private halo(c: string | number, x: number, y: number, z: number, s: number, op = 1, k = 1) {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: P.glowT(), color: col(c, k), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, fog: false, opacity: op }));
    sp.position.set(x, y, z); sp.scale.set(s, s, 1); sp.layers.set(NOINK); this.root.add(sp); return sp;
  }
  /** светящаяся надпись: прозрачный текст на плоскости (HDR), ореол, отражение на мокром асфальте */
  private neon(text: string, c: string, x: number, y: number, z: number, w: number, o: { ry?: number; k?: number; refl?: boolean; list?: THREE.Object3D[] } = {}) {
    const tex = P.sign(text, "none", "#ffffff", 512, 160, 110, { border: false });
    const m = this.quadAt(w, (w * 160) / 512, new THREE.MeshBasicMaterial({ map: tex, color: col(c, o.k ?? 3), transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: false }), x, y, z, { ry: o.ry, noInk: true });
    const out: THREE.Object3D[] = [m, this.halo(c, x, y, z + 0.05, w * 1.4, 0.35)];
    if (o.refl !== false) { const r = this.quadAt(w * 0.7, 2.6, addM(P.glowT(), c, 0.35), x, 0.02, z + 1.9, { rx: -Math.PI / 2, noInk: true }); out.push(r); }
    (o.list ?? this.storeNeon).push(...out);
    return out;
  }

  private buildGround() {
    const b = new Batch();
    const asph = lam("asph", { map: P.rep(P.asphalt(), 20, 20) });
    this.quadAt(160, 160, asph, 0, 0, 0, { rx: -Math.PI / 2 });
    const paint = lam("paintW", { color: "#e8e2d0" }), yel = lam("paintY", { color: "#f0c840" });
    for (let x = -7; x <= 7; x += 2.8) this.quadAt(0.12, 4, paint, x, 0.013, 12.9, { rx: -Math.PI / 2 });
    this.quadAt(160, 7, lam("road", { map: P.rep(P.asphalt(), 30, 1.4), color: "#9aa0b0" }), 0, 0.011, 18.5, { rx: -Math.PI / 2 });
    for (let i = -15; i <= 15; i++) this.quadAt(1.8, 0.16, yel, i * 4, 0.014, 18.5, { rx: -Math.PI / 2 });
    for (const z of [15.15, 21.85]) this.quadAt(160, 0.12, paint, 0, 0.014, z, { rx: -Math.PI / 2 });
    this.box(b, 0, SWK / 2, 0.95, 16, SWK, 1.6, lam("walk", { map: P.rep(P.concrete(), 8, 0.8) }));
    for (let x = -30; x <= 30; x += 3) this.box(b, x, 0.35, 23, 0.14, 0.7, 0.14, lam("post", { color: "#7a7e86" }));
    this.box(b, 0, 0.62, 22.95, 64, 0.25, 0.08, lam("rail", { color: "#b4b8be" }));
    b.build(this.root);
    // лужи: тёмные пятна + отражения неона/фонарей (аддитивные)
    const pud = lam("puddle", { color: "#151a2a" });
    for (const [x, z, a, c] of [[-3, 4.2, 1.6, 0.8], [3.8, 8.9, 2.2, 1.0], [-6.5, 9.5, 1.4, 0.6], [1.2, 12.5, 2.6, 1.1], [-9, 14.3, 2.4, 0.9]]) {
      const m = this.mesh(new THREE.CircleGeometry(1, 28), pud, x, 0.012, z, { rx: -Math.PI / 2, cast: false }); m.scale.set(a, c, 1);
    }
  }
  private buildFar() {
    const b = new Batch(), pole = lam("pole", { color: "#3a2e26" });
    for (let i = 0; i < 4; i++) { const x = -24 + i * 16; this.box(b, x, 4.5, 26, 0.24, 9, 0.24, pole); this.box(b, x, 8.4, 26, 2.4, 0.14, 0.14, pole); }
    b.build(this.root);
    // сосны (конусы) и холмы — простые формы с контуром
    const pine = lam("pine", { color: "#1f4a3a" }), pine2 = lam("pine2", { color: "#2a5a40" }), trunk = lam("trunk", { color: "#4a3426" });
    const cone = new THREE.ConeGeometry(1, 1, 7), cyl = new THREE.CylinderGeometry(0.12, 0.16, 1, 6);
    for (let i = 0; i < 46; i++) {
      const side = i % 2 ? 1 : -1, x = (i < 30 ? -42 + ((i * 2.9) % 84) : side * (12 + (i % 8) * 3.5)) + (hh(i, 1) - 0.5) * 3;
      const z = i < 30 ? 30 + hh(i, 2) * 16 : -12 - hh(i, 3) * 18, h = 5 + hh(i, 4) * 5;
      if (Math.abs(x) < 11 && z > 25 && z < 36) continue;
      const m = this.mesh(cone, i % 3 ? pine : pine2, x, h / 2 + 0.6, z); m.scale.set(h * 0.32, h, h * 0.32);
      const t = this.mesh(cyl, trunk, x, 0.4, z); t.scale.set(1, 0.9, 1);
    }
    const hill = lam("hill", { color: "#2b3350" }), sph = new THREE.SphereGeometry(1, 20, 10);
    for (const [x, z, sx, sy] of [[-70, 120, 60, 22], [10, 140, 70, 28], [80, 115, 55, 18], [-40, -90, 60, 20], [50, -100, 70, 26]]) {
      const m = this.mesh(sph, hill, x, -4, z, { cast: false }); m.scale.set(sx, sy, 30);
    }
  }
  private buildShell() {
    const b = new Batch(), nb = new Batch();
    const sid = lam("siding", { map: P.rep(P.siding(), 4, 1.2) }), win = lam("wallIn", { map: P.rep(P.wallIn(), 4, 1) });
    this.box(nb, 0, 1.85, -8.1, 14.4, 3.7, 0.2, sid, 0); this.box(nb, -7.1, 1.85, -4, 0.2, 3.7, 8.2, sid); this.box(nb, 7.1, 1.85, -7.05, 0.2, 3.7, 2.1, sid); this.box(nb, 7.1, 1.85, -2.45, 0.2, 3.7, 5.1, sid); this.box(nb, 7.1, 2.925, -5.5, 0.2, 1.55, 1.0, sid);
    this.quadAt(14, 3.6, win, 0, 1.8, -7.99); this.quadAt(8, 3.6, win, -6.99, 1.8, -4, { ry: Math.PI / 2 }); this.quadAt(2, 3.6, win, 6.99, 1.8, -7, { ry: -Math.PI / 2 }); this.quadAt(5, 3.6, win, 6.99, 1.8, -2.5, { ry: -Math.PI / 2 });
    this.quadAt(1, 1.45, win, 6.99, 2.875, -5.5, { ry: -Math.PI / 2 });
    this.quadAt(14, 8, lam("floor", { map: P.rep(P.floor(), 7, 4) }), 0, 0.012, -4, { rx: -Math.PI / 2 });
    this.quadAt(1.7, 1.0, lam("mat", { color: "#8a2a2a" }), 0, 0.02, -0.75, { rx: -Math.PI / 2 });
    this.quadAt(14, 8, lam("ceil", { map: P.rep(P.ceiling(), 14, 8) }), 0, 3.6, -4, { rx: Math.PI / 2 });
    this.box(nb, 0, 3.82, -4, 14.6, 0.3, 8.6, lam("roof", { color: "#5c6168" }));
    for (const [x, z] of [[-4.5, -2.0], [0, -2.0], [4.5, -2.2], [-4.5, -5.6], [-0.3, -5.6]]) {
      this.box(b, x, 3.585, z, 1.9, 0.03, 0.6, lam("lampFrame", { color: "#d9d6cc" }));
      this.lamps.push(this.mesh(new THREE.BoxGeometry(1.8, 0.03, 0.5), glow("#fff6e0", 2.4), x, 3.56, z, { cast: false }));
    }
    b.build(this.root); nb.build(this.root, false);
  }
  private buildFront() {
    const b = new Batch(), nb = new Batch(), sid = lam("siding", {}), frame = lam("frame", { color: "#5c6168" });
    this.box(b, -4, 0.31, 0, 6.2, 0.62, 0.25, sid); this.box(b, 4, 0.31, 0, 6.2, 0.62, 0.25, sid);
    this.box(nb, 0, 3.32, 0, 14.4, 0.75, 0.25, sid);
    for (const x of [-7, -4.6, -2.3, -0.95, 0.95, 2.3, 4.6, 7]) this.box(b, x, 1.6, 0, 0.12, 3.0, 0.16, frame);
    this.box(b, -4, 0.64, 0, 6.1, 0.1, 0.18, frame); this.box(b, 4, 0.64, 0, 6.1, 0.1, 0.18, frame); this.box(b, 0, 2.95, 0, 14.2, 0.1, 0.18, frame);
    const glass = new THREE.MeshBasicMaterial({ color: "#9cc4e8", transparent: true, opacity: 0.1, depthWrite: false });
    for (const x of [-4, 4]) this.quadAt(6.0, 2.3, glass, x, 1.8, 0.02, { noInk: true });
    const decal = (s: string, bg: string, x: number) => this.quadAt(1.05, 0.44, lam("dec" + s, { map: P.sign(s, bg, "#fbf8f0", 320, 136, 46) }), x, 2.35, 0.08);
    decal("ATM INSIDE", "#2a2c30", 5.8); decal("ICE $2.99", "#3d7fc4", 1.62); decal("HOT COFFEE", "#7a4a2a", -1.62);
    // раздвижная дверь: стекло + ручка (ручка с контуром)
    const door = this.door = new THREE.Group(); door.position.set(0, 1.45, 0.03); this.root.add(door);
    const dg = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.9, 0.04), new THREE.MeshBasicMaterial({ color: "#9cc4e8", transparent: true, opacity: 0.16, depthWrite: false }));
    dg.layers.set(NOINK); door.add(dg);
    this.mesh(new THREE.BoxGeometry(1.84, 0.08, 0.06), frame, 0, 1.43, 0, { parent: door }); this.mesh(new THREE.BoxGeometry(1.84, 0.08, 0.06), frame, 0, -1.43, 0, { parent: door });
    this.mesh(new THREE.BoxGeometry(0.06, 2.9, 0.06), frame, -0.89, 0, 0, { parent: door }); this.mesh(new THREE.BoxGeometry(0.06, 2.9, 0.06), frame, 0.89, 0, 0, { parent: door });
    this.mesh(new THREE.BoxGeometry(1.4, 0.06, 0.08), lam("bar", { color: "#c9ccd1" }), 0, -0.35, 0.03, { parent: door });
    // вывеска фасада, полоса
    this.box(nb, 0, 4.18, 0, 14.4, 0.95, 0.25, lam("band", { color: "#c8342c" }));
    this.quadAt(9, 0.85, new THREE.MeshBasicMaterial({ map: P.sign("HWY 40 FUEL & FOOD", "#c8342c", "#fbf8f0", 1024, 100, 66), color: col("#ffffff", 1.25) }), 0, 4.18, 0.14);
    // часы над жалюзи изнутри
    this.clock = new THREE.MeshBasicMaterial({ map: P.clockT("3:07"), color: col("#ffffff", 1.6) });
    this.box(nb, 0, 3.26, -0.17, 1.3, 0.55, 0.06, lam("clockB", { color: "#1a1614" }));
    this.quadAt(1.2, 0.5, this.clock, 0, 3.26, -0.205, { ry: Math.PI });
    this.box(b, 6.6, 3.35, -0.5, 0.3, 0.2, 0.35, lam("cam", { color: "#e9edf2" }));
    // тротуар: автоматы, лёд, урна, газеты, баллоны
    for (const [x, c, s] of [[-6.6, "#c8242c", "COLA"], [-5.65, "#2a6ad8", "ICE COLD"]] as const) {
      this.box(b, x, SWK + 0.95, 1.15, 0.85, 1.9, 0.7, lam("vend" + c, { color: c }));
      this.quadAt(0.7, 1.6, new THREE.MeshBasicMaterial({ map: P.sign(s, c, "#fbf8f0", 220, 420, 50), color: col("#ffffff", 1.35) }), x, SWK + 1.0, 1.505);
      this.night.push(this.halo(c, x, 1.3, 1.7, 2.0, 0.35));
    }
    this.box(b, -4.55, SWK + 0.525, 0.95, 1.3, 1.05, 0.75, lam("ice", { color: "#e9edf2" }));
    this.quadAt(1.1, 0.5, lam("iceS", { map: P.sign("ICE", "#e9edf2", "#3d7fc4", 256, 120, 90) }), -4.55, SWK + 0.7, 1.33);
    this.mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.85, 12), lam("trash", { color: "#4a6a4a" }), 4.85, SWK + 0.425, 0.9);
    this.box(b, 5.5, SWK + 0.525, 0.9, 0.5, 1.05, 0.45, lam("news", { color: "#3d7fc4" }));
    this.box(b, 6.35, SWK + 0.75, 0.9, 1.1, 1.5, 0.65, lam("cage", { color: "#7a7e86" }));
    b.build(this.root); nb.build(this.root, false);
  }
  private buildInterior() {
    const b = new Batch(), wood = lam("wood", { map: P.wood() }), shelf = lam("shelf", { color: "#c9c2b2" }), dark = lam("dark", { color: "#2a2c30" });
    const snack = lam("snack", { map: P.snacks() });
    for (const [i, x] of [[0, -4.7], [1, -2.3]] as const) {
      this.box(b, x, 0.95, -4.8, 0.75, 1.9, 3.6, shelf);
      for (const s of [-1, 1]) this.quadAt(3.5, 1.8, snack, x + s * 0.385, 0.97, -4.8, { ry: (s * Math.PI) / 2 });
      this.box(b, x, 0.65, -2.72, 0.95, 1.3, 0.5, shelf); this.quadAt(0.9, 1.2, snack, x, 0.66, -2.465);
      const sg = P.sign(i ? "CANDY" : "SNACKS", i ? "#2f6a6e" : "#c8342c", "#fbf8f0", 300, 92, 60);
      this.box(b, x, 2.9, -3.4, 1.1, 0.34, 0.04, lam("hang" + i, { color: i ? "#2f6a6e" : "#c8342c" }));
      this.quadAt(1.08, 0.33, lam("hangS" + i, { map: sg }), x, 2.9, -3.375); this.quadAt(1.08, 0.33, lam("hangS" + i, { map: sg }), x, 2.9, -3.425, { ry: Math.PI });
      for (const dx of [-0.45, 0.45]) this.box(b, x + dx, 3.3, -3.4, 0.015, 0.5, 0.015, dark);
    }
    this.coolM = new THREE.MeshBasicMaterial({ map: P.cooler(), color: col("#ffffff", 1.12) });
    for (let i = 0; i < 7; i++) { this.box(b, -6.2 + i * 1.3, 1.25, -7.95, 1.3, 2.4, 0.12, lam("coolBox", { color: "#59606a" })); this.quadAt(1.22, 2.3, this.coolM, -6.2 + i * 1.3, 1.25, -7.885); }
    this.box(b, -2.3, 2.65, -7.88, 9.2, 0.42, 0.12, lam("coolTop", { color: "#2f6a6e" }));
    this.quadAt(9, 0.38, lam("coolTopS", { map: P.sign("COLD DRINKS · BEER · WATER · SODA", "#2f6a6e", "#fbfaf6", 1024, 48, 34) }), -2.3, 2.65, -7.815);
    this.neon("ICE COLD", "#5ad8ff", -2.3, 3.15, -7.78, 2.6, { refl: false });
    // кофе и слаш у левой стены
    this.box(b, -6.55, 0.5, -2.0, 0.8, 1.0, 2.6, wood); this.box(b, -6.55, 1.02, -2.0, 0.84, 0.04, 2.64, lam("top", { color: "#d9d4c4" }));
    this.box(b, -6.6, 1.34, -1.2, 0.45, 0.6, 0.4, lam("cm", { color: "#1c1512" }));
    this.box(b, -6.6, 1.29, -2.75, 0.6, 0.5, 0.8, dark);
    for (const [c, z] of [["#ff3a6a", -3.0], ["#3ad0ff", -2.75], ["#a6ff3a", -2.5]] as const) this.mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.42, 14), glow(c, 1.5), -6.6, 1.75, z);
    this.quadAt(1.0, 1.3, lam("postC", { map: P.poster("COFFEE", "99¢", "#7a4a2a") }), -6.98, 2.3, -1.6, { ry: Math.PI / 2 });
    this.quadAt(1.0, 1.3, lam("postH", { map: P.poster("HOT DOGS", "2/$3", "#d8342c") }), 6.98, 2.4, -1.0, { ry: -Math.PI / 2 });
    this.box(b, 6.6, 0.8, -1.0, 0.6, 1.6, 0.7, lam("atm", { color: "#3a3d44" }));
    this.quadAt(0.6, 0.9, new THREE.MeshBasicMaterial({ map: P.sign("ATM", "#1a2a5a", "#3ad0ff", 160, 240, 70), color: col("#ffffff", 1.4) }), 6.29, 1.0, -1.0, { ry: -Math.PI / 2 });
    // касса
    this.box(b, 4.1, 0.525, -2.4, 3.4, 1.05, 0.8, wood); this.box(b, 4.1, 1.09, -2.4, 3.6, 0.08, 1.0, lam("top", {}));
    this.box(b, 5.0, 1.28, -2.5, 0.5, 0.3, 0.42, dark);
    this.mesh(new THREE.BoxGeometry(0.44, 0.26, 0.03), glow("#3aa070", 1.3), 5.0, 1.52, -2.62, { rx: -0.3, cast: false });
    this.box(b, 4.35, 1.28, -2.55, 0.45, 0.3, 0.3, lam("lotto", { map: P.sign("LOTTO", "#f2c230", "#c8342c", 200, 134, 60) }));
    this.box(b, 5.55, 1.21, -2.15, 0.6, 0.16, 0.36, lam("roll", { color: "#8e949a" }));
    for (let i = 0; i < 3; i++) this.mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.5, 8), lam("dog", { color: "#c8642c" }), 5.55, 1.31, -2.26 + i * 0.11, { rz: Math.PI / 2 });
    this.box(b, 3.6, 1.165, -2.25, 0.42, 0.07, 0.42, lam("haz", { map: P.hazard() }));
    this.btn = this.mesh(new THREE.CylinderGeometry(0.125, 0.135, 0.09, 24), lam("btn", { color: "#e0302a", emissive: "#5a0000" }), 3.6, 1.245, -2.25);
    this.quadAt(0.36, 0.11, lam("lockS", { map: P.sign("LOCKDOWN", "#1c1512", "#fbf8f0", 256, 78, 48) }), 3.6, 1.137, -1.97, { rx: -Math.PI / 2 });
    // перегородка, сигареты, тумба, служебная дверь, EXIT
    this.box(b, 4.7, 1.8, -4.07, 4.6, 3.6, 0.14, lam("wallIn", {}));
    this.box(b, 4.0, 2.05, -3.88, 2.6, 1.25, 0.24, dark); this.quadAt(2.56, 1.21, lam("cigs", { map: P.cigs() }), 4.0, 2.05, -3.755);
    this.box(b, 4.0, 0.45, -3.8, 2.6, 0.9, 0.4, wood); this.box(b, 4.0, 0.92, -3.8, 2.64, 0.04, 0.44, lam("top", {}));
    this.box(b, 6.3, 1.06, -3.975, 0.9, 2.1, 0.05, lam("empDoor", { color: "#5c6168" }));
    this.quadAt(0.8, 0.2, lam("emp", { map: P.sign("EMPLOYEES ONLY", "#c8342c", "#fbf8f0", 256, 64, 30) }), 6.3, 1.7, -3.945);
    this.exitM = new THREE.MeshBasicMaterial({ map: P.sign("EXIT", "#0c3a1c", "#6aff9a", 160, 60, 44), color: col("#ffffff", 1.5) });
    this.quadAt(0.62, 0.24, this.exitM, 6.3, 2.5, -3.99);
    // вода у кассы, табличка «мокрый пол», коробки
    const water = lam("water", { map: P.sign("WATER", "#3d7fc4", "#fbf8f0", 128, 84, 34) });
    for (let i = 0; i < 3; i++) for (let j = 0; j < (i > 1 ? 1 : 2); j++) this.box(b, 1.6 + j * 0.52 + (i > 1 ? 0.26 : 0), 0.172 + i * 0.32, -3.75, 0.5, 0.32, 0.36, water);
    const wet = lam("wet", { color: "#f2c230" });
    for (const s of [-1, 1]) this.mesh(new THREE.PlaneGeometry(0.42, 0.62), wet, -1.7 + s * 0.08, 0.3, -0.95, { ry: 0.5 + (s * Math.PI) / 2 + s * 0.35 });
    const cbox = lam("cbox", { color: "#b08a5a" });
    for (const [x, z] of [[-0.2, -7.55], [0.4, -7.5], [1.9, -7.55]]) this.box(b, x, 0.24, z, 0.55, 0.45, 0.45, cbox);
    b.build(this.root);
    this.neon("BEER", "#3fa8ff", -5.8, 2.2, -0.07, 1.5, {}); this.neon("LOTTO", "#ffc840", -3.45, 2.2, -0.07, 1.5, {}); this.neon("OPEN 24/7", "#ff4a6a", 3.45, 2.2, -0.07, 2.0, {});
    const strip = this.mesh(new THREE.BoxGeometry(14.3, 0.06, 0.06), glow("#ff3fa0", 3.2), 0, 3.68, 0.17, { cast: false }); strip.layers.set(NOINK); this.storeNeon.push(strip);
  }
  private buildShutter() {
    const st = P.rep(P.shutterT(), 10, 3), sl = P.rep(P.slitsT(), 10, 3), cut = P.rep(P.slitsCut(), 10, 3);
    this.shutMat = lam("shutter", { map: st, emissiveMap: sl, emissive: "#ffc890", emissiveIntensity: 0, side: THREE.DoubleSide });
    this.shut = this.mesh(new THREE.PlaneGeometry(14.2, 2.97, 64, 16), this.shutMat, 0, 1.6, 0.5);
    this.shut.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: cut, alphaTest: 0.5, side: THREE.DoubleSide });
    this.shut0 = (this.shut.geometry.attributes.position.array as Float32Array).slice();
    const b = new Batch(); this.box(b, 0, 3.25, 0.45, 14.4, 0.34, 0.5, lam("frame", {})); b.build(this.root, false);
    // анкерные пластины с болтами на перемычке изнутри; анимируется пластина x = 1.6
    const plateM = lam("plate", { color: "#8a9098" }), boltM = lam("bolt", { color: "#dfe3e8" });
    for (const x of [-5.8, -3.45, -1.6, 1.6, 3.45, 5.8]) {
      const g = new THREE.Group(); g.position.set(x, 3.3, -0.15); this.root.add(g);
      this.mesh(new THREE.BoxGeometry(0.56, 0.34, 0.035), plateM, 0, 0, 0, { parent: g });
      const bs = [-0.19, 0.19].map((bx) => { const m = this.mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.09, 6), boltM, bx, 0, -0.05, { rx: Math.PI / 2, parent: x === 1.6 ? this.root : g });
        this.mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.02, 16), boltM, 0, 0.04, 0, { parent: m }); return m; });
      if (x === 1.6) this.plate = { g, b: bs, x };
    }
    const crack = new THREE.MeshBasicMaterial({ map: P.crackT(), transparent: true, depthWrite: false, side: THREE.DoubleSide });
    this.cracks = [-0.19, 0.19].map((bx) => { const m = this.quadAt(0.7, 0.7, crack, 1.6 + bx, 3.3, -0.128, { ry: Math.PI, noInk: true }); m.visible = false; return m; });
    this.spark = this.halo("#ffd890", 1.6, 3.3, -0.25, 1.1, 0, 1.6); this.spark.visible = false;
    // силуэт за жалюзи (затеняет щели): multiply-квад на внутренней стороне
    this.fig = this.quadAt(1.0, 2.0, new THREE.MeshBasicMaterial({ map: P.figT(), transparent: true, depthWrite: false, blending: THREE.MultiplyBlending, premultipliedAlpha: true, side: THREE.DoubleSide, fog: false }), 0, SWK + 1.0, 0.46, { ry: Math.PI, noInk: true });
    this.fig.visible = false;
    // объёмные лучи из щелей
    for (let i = 0; i < 3; i++) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), addM(P.shaftT(), "#ffd8a0", 0.22)); m.layers.set(NOINK); m.visible = false; m.renderOrder = 3; this.root.add(m); this.shafts.push(m);
    }
  }
  private buildCanopy() {
    const b = new Batch(), nb = new Batch();
    this.box(nb, 0, 5.1, 6.5, 16, 0.5, 9, lam("canopy", { color: "#e7e3d6" }));
    this.box(nb, 0, 4.75, 6.5, 16.1, 0.3, 9.1, lam("canBand", { color: "#c8342c" }));
    for (let x = -6; x <= 6; x += 3) for (const z of [4.5, 8.5]) this.canLamps.push(this.mesh(new THREE.BoxGeometry(1.4, 0.04, 0.45), glow("#fff2d0", 2.6), x, 4.58, z, { cast: false }));
    const pil = lam("pillar", { color: "#e9e4d8" }), red = lam("pillarR", { color: "#c8342c" });
    for (const x of [-5, 5]) { this.box(b, x, 2.3, 6.5, 0.45, 4.6, 0.45, pil); for (let y = 0.3; y < 4.5; y += 0.8) this.box(b, x, y, 6.5, 0.47, 0.3, 0.47, red); }
    for (const [x, n] of [[-2.5, "3"], [2.5, "4"]] as const) {
      this.box(b, x, 0.1, 6.5, 1.8, 0.2, 1.2, lam("island", { color: "#9a968c" }));
      this.box(b, x, 1.075, 6.5, 1.0, 1.75, 0.6, lam("pump", { color: "#c8342c" }));
      for (const s of [-1, 1]) this.quadAt(0.9, 1.6, new THREE.MeshBasicMaterial({ map: P.pumpFace(n), color: col("#ffffff", 1.15) }), x, 1.1, 6.5 + s * 0.305, { ry: s > 0 ? 0 : Math.PI });
      this.box(b, x, 2.01, 6.5, 1.1, 0.12, 0.7, lam("pumpTop", { color: "#f3ecd8" }));
      const hose = new THREE.CatmullRomCurve3([V(x + 0.5, 1.5, 6.5), V(x + 0.8, 1.2, 6.45), V(x + 0.78, 0.6, 6.4), V(x + 0.56, 0.95, 6.35)]);
      this.mesh(new THREE.TubeGeometry(hose, 20, 0.035, 6), lam("hose", { color: "#1c1512" }), 0, 0, 0);
      for (const [bx, bz] of [[x - 0.75, 6.95], [x + 0.75, 6.95], [x - 0.75, 6.05], [x + 0.75, 6.05]]) this.mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.7, 10), lam("bollard", { color: "#f2c230" }), bx, 0.55, bz);
    }
    this.box(b, 9.5, 3.5, 12.5, 0.3, 7, 0.3, lam("signPole", { color: "#2a2e36" }));
    this.quadAt(2.4, 3.0, new THREE.MeshBasicMaterial({ map: P.priceSign(), color: col("#ffffff", 1.3) }), 9.5, 7.6, 12.67);
    b.build(this.root); nb.build(this.root, false);
    // неон по краю навеса, фонари, мотель
    const cyan = "#38e8ff";
    for (const [x, z, l, ry] of [[0, 2.0, 16.2, 0], [0, 11.0, 16.2, 0], [-8.05, 6.5, 9, Math.PI / 2], [8.05, 6.5, 9, Math.PI / 2]]) {
      const m = this.mesh(new THREE.BoxGeometry(l, 0.06, 0.06), glow(cyan, 3.2), x, 4.6, z, { ry, cast: false }); m.layers.set(NOINK); this.night.push(m);
    }
    const lb = new Batch();
    for (const [x, z] of [[-12, 14.2], [12, 14.2], [30, 14.2], [-30, 14.2]]) {
      this.box(lb, x, 3.25, z, 0.2, 6.5, 0.2, lam("lampPole", { color: "#4a4e56" })); this.box(lb, x + 0.5, 6.5, z, 1.2, 0.18, 0.4, lam("lampHead", { color: "#2a2e36" }));
      const m = this.mesh(new THREE.BoxGeometry(0.9, 0.03, 0.3), glow("#ffb060", 3), x + 0.5, 6.4, z, { cast: false });
      this.night.push(m, this.halo("#ffa040", x + 0.5, 6.35, z, 3.0, 0.6), this.quadAt(2.4, 5, addM(P.glowT(), "#ffa040", 0.22), x + 0.5, 0.02, z + 2.5, { rx: -Math.PI / 2, noInk: true }));
    }
    lb.build(this.root);
    const mp = new Batch(); this.box(mp, -16, 3.5, 31, 0.36, 7, 0.36, lam("mPole", { color: "#3a3d44" })); this.box(mp, 17, 2.3, 33.2, 0.3, 4.6, 0.3, lam("mPole", {})); mp.build(this.root);
    this.neon("MOTEL", "#ff4fb0", -16, 7.6, 31.2, 3.6, { ry: Math.PI, refl: false, list: this.night }); this.neon("VACANCY", "#40f0ff", -16, 6.3, 31.2, 2.8, { ry: Math.PI, refl: false, list: this.night });
    this.neon("EAT", "#ffd040", 17, 5.2, 33, 3.2, { ry: Math.PI, refl: false, list: this.night });
    this.traffic = this.halo("#ffb000", 22, 5.2, 17, 1.4, 1);
  }
  private buildCar(x: number, z: number, ry: number) {
    const g = this.car = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; this.root.add(g);
    const body = lam("carBody", { color: "#8fb0d4" }), dk = lam("carDark", { color: "#1c1d22" }), gl = lam("carGlass", { color: "#1a2a44" }), chrome = lam("chrome", { color: "#c9cfd4" });
    const B = (w: number, h: number, d: number, m: THREE.Material, px: number, py: number, pz: number) => this.mesh(new THREE.BoxGeometry(w, h, d), m, px, py, pz, { parent: g });
    B(1.85, 0.55, 4.3, body, 0, 0.64, 0); B(1.66, 0.52, 2.2, body, 0, 1.17, -0.3);
    B(1.5, 0.36, 0.04, gl, 0, 1.17, 0.815); B(1.5, 0.36, 0.04, gl, 0, 1.17, -1.415); for (const sx of [-0.84, 0.84]) B(0.04, 0.34, 1.8, gl, sx, 1.18, -0.3);
    for (const [wx, wz] of [[-0.93, 1.38], [0.93, 1.38], [-0.93, -1.38], [0.93, -1.38]]) {
      this.mesh(new THREE.CylinderGeometry(0.37, 0.37, 0.26, 16), dk, wx, 0.37, wz, { rz: Math.PI / 2, parent: g });
      this.mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.28, 12), chrome, wx, 0.37, wz, { rz: Math.PI / 2, parent: g });
    }
    for (const bz of [2.2, -2.2]) B(1.9, 0.16, 0.14, chrome, 0, 0.44, bz);
    const L = (c: string, lx: number, ly: number, lz: number, w = 0.36) => { const m = new THREE.MeshBasicMaterial({ color: col(c, 0.4) }); this.carLights.push({ m, c: col(c, 1) }); this.mesh(new THREE.BoxGeometry(w, 0.16, 0.05), m, lx, ly, lz, { parent: g, cast: false }); };
    L("#fff2c0", -0.62, 0.74, 2.18); L("#fff2c0", 0.62, 0.74, 2.18); L("#ff3020", -0.65, 0.74, -2.18); L("#ff3020", 0.65, 0.74, -2.18); L("#ffa020", -0.86, 0.58, 2.18, 0.14); L("#ffa020", 0.86, 0.58, 2.18, 0.14);
    this.carHalo = [this.halo("#ffd070", x - 0.1 + 2.3 * Math.sin(ry), 0.8, z + 2.3 * Math.cos(ry), 3.2, 0), this.halo("#ff6040", x - 2.3 * Math.sin(ry), 0.8, z - 2.3 * Math.cos(ry), 2.4, 0)];
  }
  /** подсобка x 2.4…7.0, z -8.0…-4.07: дверь A из зала (стена x 2.4, проём z -5.6…-4.7), бойлер в углу (6.5, -7.55) с краном, шлангом и
   *  ведром, стеллаж (у задней двери или оттащен), задняя дверь B (x 7.1, z -6.0…-5.0) во двор, холодильная камера x 2.55…4.55, z -7.95…-6.15
   *  (дверь C x 3.1…3.95), лампочка; снаружи — мусорный бак, фонарь над дверью; громкоговоритель на столбе навеса у колонки 4. */
  private buildBackRoom() {
    const b = new Batch(), win = lam("wallIn", {}), dark = lam("dark", {}), steel = lam("coolSteel", { map: P.steelT() });
    const W = (x: number, z: number, w: number, d: number, h = 3.6, y0 = 0, m: THREE.Material = win) => this.box(b, x, y0 + h / 2, z, w, h, d, m);
    W(2.4, -6.8, 0.14, 2.4); W(2.4, -4.385, 0.14, 0.63); W(2.4, -5.15, 0.14, 0.9, 1.45, 2.15);                     // стена зал | подсобка
    this.quadAt(0.7, 0.24, lam("empA", { map: P.sign("EMPLOYEES ONLY", "#c8342c", "#fbf8f0", 256, 64, 30) }), 2.32, 2.4, -5.15, { ry: -Math.PI / 2 });
    // холодильная камера (стены 0.08, крыша), проём двери C
    const cw = (x: number, z: number, w: number, d: number, h = 2.6, y0 = 0) => this.box(b, x, y0 + h / 2, z, w, h, d, steel);
    cw(2.55, -7.05, 0.08, 1.8); cw(4.55, -7.05, 0.08, 1.8); cw(3.55, -7.95, 2.08, 0.08); cw(2.825, -6.15, 0.55, 0.08); cw(4.25, -6.15, 0.6, 0.08);
    cw(3.525, -6.15, 0.85, 0.08, 0.5, 2.1); this.box(b, 3.55, 2.64, -7.05, 2.1, 0.08, 1.88, steel);
    for (const z of [-7.75, -7.2, -6.65]) for (const y of [0.35, 1.0, 1.65]) this.box(b, 2.85, y, z, 0.42, 0.04, 0.5, lam("rack", { color: "#9aa3ad" }));
    const crate = lam("crate", { color: "#2f6fc4" }), milk = lam("milk", { color: "#f4f1ea" });
    for (const [z, y] of [[-7.75, 0.37], [-7.2, 1.02], [-6.65, 0.37], [-7.75, 1.67]]) { this.box(b, 2.85, y + 0.14, z, 0.38, 0.26, 0.42, crate); this.box(b, 2.85, y + 0.33, z, 0.3, 0.12, 0.34, milk); }
    const coolLamp = glow("#cfe8ff", 1.2); this.mesh(new THREE.BoxGeometry(0.5, 0.03, 0.12), coolLamp, 3.55, 2.58, -7.0, { cast: false });
    // бойлер, кран, шланг, ведро, бутылки
    const heat = lam("heater", { color: "#e9e4d6" }), brass = lam("brass", { color: "#c99a3a" });
    this.mesh(new THREE.CylinderGeometry(0.32, 0.32, 1.5, 24), heat, 6.5, 0.8, -7.55);
    this.mesh(new THREE.SphereGeometry(0.32, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2), heat, 6.5, 1.55, -7.55);
    this.mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.06, 24), dark, 6.5, 0.05, -7.55);
    for (const dx of [-0.12, 0.12]) this.mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8, 8), brass, 6.5 + dx, 2.7, -7.55);
    const lbl = this.quadAt(0.36, 0.5, lam("heatLbl", { map: P.heaterLabel() }), 6.5 - 0.325 * 0.6, 1.05, -7.55 + 0.325 * 0.8, { ry: Math.atan2(-0.6, 0.8) });
    lbl.castShadow = false;
    this.box(b, 6.29, 0.2, -7.27, 0.1, 0.1, 0.1, brass); this.mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 10), lam("valveRed", { color: "#d8342c" }), 6.24, 0.2, -7.22, { rx: Math.PI / 2 });
    const hose = new THREE.CatmullRomCurve3([V(6.25, 0.18, -7.22), V(6.1, 0.05, -7.1), V(5.95, 0.08, -6.98), V(5.88, 0.36, -6.95)]);
    this.mesh(new THREE.TubeGeometry(hose, 16, 0.025, 6), lam("hoseG", { color: "#3a8a4a" }), 0, 0, 0);
    this.mesh(new THREE.CylinderGeometry(0.19, 0.16, 0.32, 18, 1, true), lam("bucket", { color: "#e8a032", side: THREE.DoubleSide }), 5.82, 0.16, -6.9);
    const water = this.mesh(new THREE.CircleGeometry(0.17, 18), glow("#4fb4ff", 0.9), 5.82, 0.05, -6.9, { rx: -Math.PI / 2, cast: false });
    const stream = this.mesh(new THREE.CylinderGeometry(0.018, 0.024, 1, 8), new THREE.MeshBasicMaterial({ color: col("#8fd6ff", 1.3), transparent: true, opacity: 0.85, depthWrite: false }), 5.86, 0.25, -6.93, { cast: false });
    stream.layers.set(NOINK);
    const bott = lam("bottleFull", { color: "#5ab0f0" });
    for (let i = 0; i < 5; i++) this.mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.3, 10), bott, 5.35 + (i % 3) * 0.12, 0.15, -7.4 + Math.floor(i / 3) * 0.13);
    // стеллаж (группа: двигается между задней дверью и серединой подсобки)
    const shelf = new THREE.Group(); this.root.add(shelf);
    const rk = lam("rackMetal", { color: "#7a828c" }), cb = lam("cbox", {});
    for (const [x, z] of [[-0.6, -0.22], [0.6, -0.22], [-0.6, 0.22], [0.6, 0.22]]) this.mesh(new THREE.BoxGeometry(0.04, 1.9, 0.04), rk, x, 0.95, z, { parent: shelf });
    for (const y of [0.15, 0.7, 1.25, 1.8]) this.mesh(new THREE.BoxGeometry(1.24, 0.03, 0.46), rk, 0, y, 0, { parent: shelf });
    for (const [x, y, w] of [[-0.3, 0.33, 0.5], [0.3, 0.3, 0.45], [0, 0.88, 0.9], [-0.35, 1.42, 0.4], [0.25, 1.45, 0.5]]) this.mesh(new THREE.BoxGeometry(w, 0.3, 0.38), cb, x, y, 0, { parent: shelf });
    // двери: A — из зала (петли z -4.7), B — задняя во двор (петли z -5.0), C — холодильная камера (петли x 3.1)
    const doorM = lam("backDoor", { color: "#6b7480" });
    const doorA = new THREE.Group(); doorA.position.set(2.4, 0, -4.7); this.root.add(doorA);
    this.mesh(new THREE.BoxGeometry(0.05, 2.12, 0.88), lam("empDoor", {}), 0, 1.06, -0.45, { parent: doorA });
    this.mesh(new THREE.BoxGeometry(0.04, 0.05, 0.14), lam("bar", {}), -0.05, 1.05, -0.78, { parent: doorA });
    const doorB = new THREE.Group(); doorB.position.set(7.1, 0, -5.0); this.root.add(doorB);
    this.mesh(new THREE.BoxGeometry(0.06, 2.12, 0.98), doorM, 0, 1.06, -0.5, { parent: doorB });
    this.mesh(new THREE.BoxGeometry(0.08, 0.07, 0.8), lam("bar", {}), -0.06, 1.05, -0.5, { parent: doorB });
    const sB = this.quadAt(0.6, 0.3, lam("keepClosed", { map: P.sign("KEEP CLOSED", "#f2c230", "#1c1512", 256, 128, 46) }), -0.035, 1.55, -0.5, { ry: -Math.PI / 2 });
    this.root.remove(sB); doorB.add(sB);
    const doorC = new THREE.Group(); doorC.position.set(3.1, 0, -6.15); this.root.add(doorC);
    this.mesh(new THREE.BoxGeometry(0.85, 2.1, 0.07), steel, 0.425, 1.05, 0, { parent: doorC });
    this.mesh(new THREE.BoxGeometry(0.06, 0.32, 0.1), lam("bar", {}), 0.75, 1.05, 0.06, { parent: doorC });
    this.mesh(new THREE.BoxGeometry(0.06, 0.32, 0.1), lam("bar", {}), 0.75, 1.05, -0.06, { parent: doorC });
    const frost = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.34), new THREE.MeshBasicMaterial({ color: "#dfefff", transparent: true, opacity: 0.38, depthWrite: false, side: THREE.DoubleSide }));
    frost.position.set(0.43, 1.6, 0); frost.layers.set(NOINK); doorC.add(frost);
    // лампочка подсобки
    const bulb = glow("#fff0c8", 2.8); this.mesh(new THREE.SphereGeometry(0.06, 12, 8), bulb, 4.9, 3.3, -5.4, { cast: false });
    this.box(b, 4.9, 3.46, -5.4, 0.01, 0.28, 0.01, dark);
    const bulbHalo = this.halo("#ffe2a0", 4.9, 3.3, -5.4, 1.4, 0.5);
    // двор за задней дверью: бак, поддон, фонарь над дверью (ночью)
    this.box(b, 9.3, 0.65, -7.2, 1.8, 1.3, 1.0, lam("dumpster", { color: "#2f6a4a" }));
    this.box(b, 8.6, 0.07, -4.3, 1.2, 0.14, 1.0, lam("pallet", { color: "#a07a4a" }));
    this.box(b, 7.25, 2.55, -5.5, 0.16, 0.12, 0.34, dark);
    const wl = this.mesh(new THREE.BoxGeometry(0.06, 0.06, 0.26), glow("#ffc070", 3), 7.3, 2.48, -5.5, { cast: false }); wl.layers.set(NOINK);
    this.night.push(this.halo("#ffb060", 7.4, 2.45, -5.5, 2.6, 0.55), this.quadAt(2.2, 3.2, addM(P.glowT(), "#ffb060", 0.25), 8.3, 0.02, -5.5, { rx: -Math.PI / 2, noInk: true }));
    // громкоговоритель на столбе навеса (x 5, z 6.5) — «pump four is ready»
    this.mesh(new THREE.CylinderGeometry(0.06, 0.24, 0.42, 14, 1, true), lam("horn", { color: "#d9d4c4", side: THREE.DoubleSide }), 4.62, 3.7, 6.5, { rz: Math.PI / 2 });
    this.box(b, 4.8, 3.7, 6.5, 0.1, 0.18, 0.12, dark);
    b.build(this.root);
    this.br = { doorA, doorB, doorC, shelf, stream, water, bulb, bulbHalo, coolLamp, horn: V(4.4, 3.7, 6.5), full: P.cooler(), empty: P.coolerEmpty() };
  }

  private buildFx() {
    // дождь (линии) и пыль в лучах (точки), без контура
    const N = 2600, pos = new Float32Array(N * 6);
    for (let i = 0; i < N; i++) this.rain0.push([hh(i, 1) * 50 - 25, hh(i, 2) * 12, hh(i, 3) * 40 - 10, 0.6 + hh(i, 4) * 0.4]);
    const rg = new THREE.BufferGeometry(); rg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    this.rain = new THREE.LineSegments(rg, new THREE.LineBasicMaterial({ color: "#aac4f0", transparent: true, opacity: 0.4, depthWrite: false })); this.rain.layers.set(NOINK); this.rain.frustumCulled = false; this.root.add(this.rain);
    const n = 420, pp = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) this.dust0.push([hh(i, 5) * 13 - 6.5, hh(i, 6) * 3.3, -hh(i, 7) * 7.6, hh(i, 8)]);
    const dg = new THREE.BufferGeometry(); dg.setAttribute("position", new THREE.BufferAttribute(pp, 3));
    this.dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: "#fff2d8", size: 0.022, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.dust.layers.set(NOINK); this.dust.frustumCulled = false; this.root.add(this.dust);
    this.alarmHalo = [this.halo("#ff2a1a", -3.2, 3.3, -3.0, 4.5, 0), this.halo("#ff2a1a", 3.0, 3.3, -5.0, 4.5, 0)];
  }

  // =============================== кадр ===============================
  private actor(i: number) { while (this.actors.length <= i) this.actors.push(new Actor(this.root)); return this.actors[i]; }
  private fxAt(i: number) { while (this.fxs.length <= i) this.fxs.push(new Fx(this.root)); return this.fxs[i]; }

  update(F: Frame, cam: THREE.PerspectiveCamera, scene: THREE.Scene) {
    const { t, st, look: L } = F;
    // ---- камера ----
    cam.position.set(...F.cam.pos); cam.up.set(0, 1, 0); cam.lookAt(...F.cam.look); cam.rotateZ(F.cam.roll);
    cam.fov = F.cam.fov; cam.near = 0.05; cam.far = 900; cam.updateProjectionMatrix(); cam.updateMatrixWorld();
    cam.layers.enable(NOINK);
    const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0), up = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 1);
    // ---- свет: ключ + двухтоновые униформы ----
    const focus = V(...F.focus), dist = cam.position.distanceTo(focus), Rr = THREE.MathUtils.clamp(dist * 1.2 + 6, 9, 40);
    this.key.position.copy(focus).addScaledVector(F.key, 80); this.key.target.position.copy(focus);
    const sc = this.key.shadow.camera; sc.left = -Rr; sc.right = Rr; sc.top = Rr; sc.bottom = -Rr; sc.near = 10; sc.far = 200; sc.updateProjectionMatrix();
    this.key.shadow.bias = -0.0004; this.key.shadow.normalBias = 0.02 * (Rr / 12);
    TONE.uLitCol.value.set(...L.lit); TONE.uShadeCol.value.set(...L.shade); TONE.uShadeLift.value.set(...L.lift);
    TONE.uLambert.value = L.lambert; TONE.uSideK.value = L.sideK; TONE.uTerm.value = L.term; TONE.uBounce.value.set(0, 0, 0); TONE.uSat.value = L.sat;
    CHAR.uCharTint.value.set(...L.charTint); CHAR.uCharShade.value = L.charShade; CHAR.uGrad.value = L.charGrad; CHAR.uBodyGrad.value = L.bodyGrad; CHAR.uSideTint.value.set(...L.sideTint);
    // ---- небо, туман, луна ----
    const su = this.skyMat.uniforms; untone(L.sky[0], su.top.value); untone(L.sky[1], su.mid.value); untone(L.sky[2], su.bot.value); su.stars.value = L.stars;
    this.sky.position.copy(cam.position); this.moon.visible = L.moon;
    untone(L.fog, this.fog.color); this.fog.near = L.fogNear; this.fog.far = L.fogFar; scene.fog = this.fog; scene.background = null;
    // ---- лампы, неон, тревога ----
    const dark = st.sky !== "day", on = st.lamps ?? 5, fl = st.flick ? (hh(Math.floor(t * 9), 3) < 0.25 ? 0.3 : 1) : 1, lk = (st.lampK ?? 1) * fl;
    this.lamps.forEach((l, i) => { (l.material as THREE.MeshBasicMaterial).color.set("#fff6e0").multiplyScalar(i < on ? 0.25 + 2.2 * lk : 0.22); });
    this.coolM.color.setScalar(0.45 + 0.7 * Math.min(1, lk * (on / 5) + 0.2));
    const neon = st.neon ?? true, nf = neon && hh(Math.floor(t * 14), 5) < 0.035 ? 0 : 1;
    this.storeNeon.forEach((o) => { o.visible = neon && nf > 0; });
    this.night.forEach((o) => { o.visible = dark; });
    const cnp = st.canopy ?? 1;
    this.canLamps.forEach((l) => (l.material as THREE.MeshBasicMaterial).color.set("#fff2d0").multiplyScalar(0.2 + 2.4 * cnp));
    this.traffic.visible = dark && Math.floor(t * 1.4) % 2 === 1;
    const al = (st.alarm ?? 0) * (0.55 + 0.45 * Math.sin(t * Math.PI * 2.8));
    this.alarmHalo.forEach((h) => { h.material.opacity = al; h.visible = al > 0.01; });
    this.exitM.color.setScalar(0.5 + 1.2 * (st.exit ?? 0.6));
    this.clock.map = P.clockT(st.clock ?? "3:07");
    // ---- дверь, жалюзи, кнопка, силуэт, лучи ----
    this.door.position.x = 1.85 * sm(st.door ?? 0);
    this.poseShutter(st.shut ?? 0, Math.min(0.7, st.bulge ?? 0), t, st.dents ?? 0, st.knock);
    this.shutMat.emissive.setHex(st.slitCol ?? 0xffc890); this.shutMat.emissiveIntensity = (st.slits ?? 0) * 2.6;
    this.fig.visible = (st.fig ?? 0) > 0.01; (this.fig.material as THREE.MeshBasicMaterial).opacity = st.fig ?? 0;
    this.btn.position.y = st.btnDown ? 1.215 : 1.245;
    const sh = st.shafts ?? 0;
    this.shafts.forEach((m, i) => {
      m.visible = sh > 0 && (st.shut ?? 0) > 0.9; if (!m.visible) return;
      const x0 = -3 + i * 3 + 0.4 * Math.sin(t * 0.2 + i), a = V(x0, 2.2, 0.4), dirIn = F.key.clone().multiplyScalar(-1), b = a.clone().addScaledVector(dirIn, (2.2 / Math.max(0.2, -dirIn.y)) * 0.95);
      this.beam(m, a, b, 1.9, cam.position);
      (m.material as THREE.MeshBasicMaterial).color.setHex(st.slitCol ?? 0xffd8a0).multiplyScalar(0.12 * sh);
    });
    // ---- пластина и болты ----
    const Pl = this.plate, [p1, p2] = st.pop ?? [1e9, 1e9], u1 = t - p1, u2 = t - p2, jit = (st.bulge ?? 0) * 0.004 * Math.sin(t * 47);
    Pl.g.position.set(Pl.x, 3.3 + jit - (u2 > 0 ? 4.9 * u2 * u2 : 0), -0.15 - (u2 > 0 ? u2 * 0.5 : 0));
    Pl.g.rotation.z = (u1 > 0 ? -0.16 * (1 - Math.exp(-9 * u1)) + 0.02 * Math.sin(t * 40) * Math.exp(-4 * u1) : 0) - (u2 > 0 ? u2 * 3.2 : 0);
    Pl.b.forEach((bm, i) => {
      const u = i ? u2 : u1, bx = Pl.x + (i ? 0.19 : -0.19);
      if (u <= 0) { bm.position.set(bx, 3.3 + jit, -0.2); bm.rotation.set(Math.PI / 2, 0, 0); }
      else { bm.position.set(bx + u * (i ? 0.9 : 0.5), 3.3 + u * 1.2 - 4.9 * u * u, -0.2 - u * 3.4); bm.rotation.set(Math.PI / 2 + u * 17, u * 11, 0); }
      bm.visible = u < 1.2;
    });
    this.cracks.forEach((c, i) => { const u = i ? u2 : u1; c.visible = u > 0; c.scale.setScalar(u > 0 ? 0.5 + 0.5 * Math.min(1, u * 8) : 0.01); });
    const spk = Math.max(u1 > 0 && u1 < 0.14 ? 1 - u1 / 0.14 : 0, u2 > 0 && u2 < 0.14 ? 1 - u2 / 0.14 : 0);
    this.spark.visible = spk > 0; this.spark.material.opacity = spk; this.spark.position.x = Pl.x + (u2 > 0 ? 0.19 : -0.19);
    // ---- машина ----
    const ca = st.car ? (Math.floor(t * 3.2) % 2 ? 1 : 0.06) : 0;
    this.carLights.forEach(({ m, c }) => m.color.copy(c).multiplyScalar(0.35 + 3.0 * ca));
    this.carHalo.forEach((h) => { h.visible = ca > 0.1; h.material.opacity = 0.55 * ca; });
    this.car.rotation.z = (st.carBump ?? 0) * 0.025;
    // ---- подсобка ----
    const B_ = this.br;
    this.coolM.map = st.empty ? B_.empty : B_.full;
    B_.doorA.rotation.y = -1.5 * sm(st.doorA ?? 0); B_.doorB.rotation.y = -1.35 * sm(st.doorB ?? 0); B_.doorC.rotation.y = -1.45 * sm(st.doorC ?? 0);
    const sk = sm(st.shelf ?? 1); B_.shelf.position.set(lerp(6.8, 5.35, sk), 0, lerp(-5.5, -4.5, sk)); B_.shelf.rotation.y = lerp(Math.PI / 2, 0, sk);
    const hf = st.heater ?? 0, wl_ = st.fill ?? 0;
    B_.stream.visible = hf > 0.02; B_.stream.scale.set(0.6 + 0.6 * hf, 0.2 + 0.1 * hf, 0.6 + 0.6 * hf); B_.stream.position.y = 0.1 + 0.14 + wl_ * 0.12;
    B_.water.visible = wl_ > 0.02; B_.water.position.y = 0.03 + 0.28 * wl_;
    const bl = st.bulb ?? 1; B_.bulb.color.set("#fff0c8").multiplyScalar(0.2 + 2.6 * bl); B_.bulbHalo.visible = bl > 0.1; B_.bulbHalo.material.opacity = 0.5 * bl;
    B_.coolLamp.color.set("#cfe8ff").multiplyScalar(0.15 + 1.2 * (st.coolLight ?? 0.6));
    // ---- дождь, пыль ----
    const ra = st.rain ?? 1; this.rain.visible = ra > 0;
    if (ra > 0) { (this.rain.material as THREE.LineBasicMaterial).opacity = 0.4 * ra; const p = this.rain.geometry.attributes.position.array as Float32Array;
      this.rain0.forEach(([x, y, z, v], i) => { const yy = (((y - t * 9 * v) % 12) + 12) % 12, xx = x - (12 - yy) * 0.12; p.set([xx, yy, z, xx + 0.04, yy + 0.35, z], i * 6); });
      this.rain.geometry.attributes.position.needsUpdate = true; }
    const dp = this.dust.geometry.attributes.position.array as Float32Array;
    this.dust0.forEach(([x, y, z, v], i) => { dp[i * 3] = x + Math.sin(t * 0.3 + v * 9) * 0.3; dp[i * 3 + 1] = (y + t * 0.05 * (v - 0.5) + 3.3) % 3.3; dp[i * 3 + 2] = z + Math.cos(t * 0.25 + v * 7) * 0.3; });
    this.dust.geometry.attributes.position.needsUpdate = true; (this.dust.material as THREE.PointsMaterial).opacity = 0.15 + 0.45 * Math.max(Math.min(1, lk * on / 5), sh);
    // ---- герои, толпа, эффекты ----
    this.frustum.setFromProjectionMatrix(this.m4.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse));
    const puts = this.resolveViews([...F.puts, ...this.crowdPuts(st, t)], cam);
    const lightA = (mirror: boolean) => { const sx = F.key.dot(right) * (mirror ? -1 : 1), sy = -F.key.dot(up); return Math.round(Math.atan2(sy, sx) / (Math.PI / 4)) * (Math.PI / 4); };
    let ai = 0, fi = 0; const used: Actor[] = [], fused: Fx[] = [];
    const fxs: FxPut[] = [...F.fx];
    for (const p of puts) {
      const scl = p.scale ?? 1;
      if (!this.frustum.intersectsSphere(this.sph.set(this.v.set(p.x, p.y + 1, p.z), 1.8 * scl)) && !p.shadow) continue;
      const d = cam.position.distanceTo(this.v.set(p.x, p.y + 1.3 * scl, p.z)) / scl;
      let [w, h, k] = tier(d); if (p.maxTier && w > p.maxTier) [w, h, k] = tier(p.maxTier >= 960 ? 3 : p.maxTier >= 480 ? 6 : 20);
      const mirror = !!(p.side && p.mirror), light = lightA(mirror);
      const fo: FrontOpts = { ...(p.fo ?? {}), light, seed: (p.fo?.seed ?? 3) }, so: SideOpts = { ...(p.so ?? {}), light, seed: (p.so?.seed ?? 3) };
      const key = p.side ? `S|${p.id}|${fkey(so)}` : `F|${p.id}|${fkey(fo)}`;
      const a = this.actor(ai++);
      a.r = this.pool.req(key, w, h, k, (pen) => {
        // сбой рисунка одной карточки (нечисловой градиент) не должен ронять весь кадр: пишем в лог, карточка остаётся пустой
        try { if (p.side) bodySide(pen, p.o, so); else bodyFront(pen, p.o, fo); }
        catch (e) { console.error("card draw failed", p.id, key, JSON.stringify({ w, h, k, d }), String(e).slice(0, 120)); }
      });
      a.mesh.visible = true; a.mesh.position.set(p.x, p.y, p.z);
      a.mesh.rotation.set(0, Math.atan2(cam.position.x - p.x, cam.position.z - p.z), 0);
      a.mesh.scale.set(mirror ? -scl : scl, scl, scl); a.mesh.castShadow = p.shadow ?? true;
      used.push(a);
      if (p.blob !== false && p.y >= -0.01 && p.y < 0.2) {
        const cc = "#" + L.contact.map((c) => Math.round(255 * Math.pow(Math.min(1, c * 2.2), 1 / 2.2)).toString(16).padStart(2, "0")).join("");
        fxs.push({ key: `blob|contact|${cc}`, cw: 128, ch: 128, draw: (pp) => fxContact(pp, cc), x: p.x, y: p.y + 0.02, z: p.z, w: 0.6 * scl, h: 0.45 * scl, flat: true });
      }
    }
    for (let i = ai; i < this.actors.length; i++) this.actors[i].mesh.visible = false;
    for (const p of fxs) {
      if (!this.frustum.intersectsSphere(this.sph.set(this.v.set(p.x, p.y, p.z), Math.max(p.w, p.h)))) continue;
      const e = this.fxAt(fi++);
      e.r = this.pool.req(p.key, p.cw, p.ch, 1, p.draw); e.use(!!p.soft);
      e.mesh.visible = true; e.mesh.position.set(p.x, p.y, p.z);
      if (p.flat) e.mesh.rotation.set(-Math.PI / 2, 0, p.rot ?? 0); else { e.mesh.quaternion.copy(cam.quaternion); e.mesh.rotateZ(p.rot ?? 0); }
      e.mesh.scale.set(p.w, p.h, 1); fused.push(e);
    }
    for (let i = fi; i < this.fxs.length; i++) this.fxs[i].mesh.visible = false;
    this.pool.flush();
    for (const a of used) a.bind();
    for (const e of fused) e.bind();
  }

  /** полоса-луч от a к b шириной w, развёрнутая к камере вокруг своей оси */
  private beam(m: THREE.Mesh, a: THREE.Vector3, b: THREE.Vector3, w: number, eye: THREE.Vector3) {
    const ax = b.clone().sub(a), len = ax.length(); ax.normalize();
    const c = a.clone().add(b).multiplyScalar(0.5), toE = eye.clone().sub(c), n = toE.sub(ax.clone().multiplyScalar(toE.dot(ax))).normalize(), side = ax.clone().cross(n).normalize();
    m.position.copy(c); m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(side, ax.clone().multiplyScalar(-1), n)); m.scale.set(w, len, 1);
  }
  private poseShutter(k: number, bulge: number, t: number, dents: number, knock?: [number, number, number]) {
    const s = this.shut; s.visible = k > 0.002; s.scale.y = Math.max(0.001, k); s.position.y = 3.08 - (2.97 * k) / 2;
    const p = s.geometry.attributes.position, a = p.array as Float32Array, b0 = this.shut0;
    for (let i = 0; i < a.length; i += 3) {
      const x = b0[i], y = b0[i + 1]; let dz = 0;
      if (bulge) dz -= bulge * 0.42 * Math.max(0, Math.cos(((x / 7.1) * Math.PI) / 2)) * Math.max(0, Math.cos(((y / 1.49) * Math.PI) / 2)) * (1 + 0.05 * Math.sin(t * 30 + x));
      if (dents) for (let j = 0; j < 9; j++) { const cx = -3.4 + hh(300 + j, 1) * 7.2, cy = -1.1 + hh(300 + j, 2) * 2.0, w = 0.35 + hh(300 + j, 3) * 0.3, d2 = ((x - cx) ** 2 + (y - cy) ** 2) / (w * w);
        if (d2 < 1) dz -= dents * 0.1 * (1 - d2) * (0.6 + 0.4 * Math.max(0, Math.sin(t * (5 + j) + j * 2))); }
      if (knock) { const d2 = ((x - knock[0]) ** 2 + (y - knock[1]) ** 2) / 0.36; if (d2 < 1) dz -= knock[2] * 0.2 * (1 - d2) ** 2; }
      a[i + 2] = b0[i + 2] + dz;
    }
    p.needsUpdate = true; s.geometry.computeVertexNormals();
  }
  private path(c: Crowd, u: number): [number, number] {
    const [hx, hz] = c.home;
    if (u < 0.42) { const k = u / 0.42; return [lerp(hx, c.lane, sm(k)), lerp(hz, 6.5, k)]; }
    const k = (u - 0.42) / 0.58; return [lerp(c.lane, c.far[0], k), lerp(6.5, c.far[1], k)];
  }
  /** толпа: у жалюзи бьют (спиной к стоянке), сходятся / расходятся по коридорам, на перемотке пятятся */
  private crowdPuts(st: St, t: number): Put[] {
    const out: Put[] = [], cr = st.crowd, ck = st.crowdK ?? 1;
    if (!cr) return out;
    this.crowd.forEach((c, k) => {
      let u = 0;
      if (cr === "gather") u = 1 - clamp01(ck * 1.35 - c.lag * 0.35);
      if (cr === "leave" || cr === "rewind") u = clamp01(ck * 1.4 - c.lag * 0.4);
      const [x, z] = u > 0 ? this.path(c, u) : c.home, y = z < 1.75 ? SWK : 0, id = `c${c.v}`;
      if (u <= 0) {
        out.push({ id, o: c.o, x, y, z, maxTier: 480, fo: { mode: "stand", pound: q((t * 1.7 + c.ph) % 1, 6), expr: "zom", seed: 4 + c.v * 5 },
          so: { mode: "stand", expr: "zom", seed: 4 + c.v * 5 }, _face: [0, -1] } as Put & { _face: number[] });
        return;
      }
      const [x2, z2] = this.path(c, clamp01(u + (cr === "gather" ? -0.02 : 0.02)));
      const mx = x2 - x, mz = z2 - z, ml = Math.hypot(mx, mz) || 1;
      const face = cr === "rewind" ? [0, -1] : [mx / ml, mz / ml];
      out.push({ id, o: c.o, x, y, z, maxTier: 480, fo: { mode: "stroll", phase: q((t * (cr === "rewind" ? -1.4 : 0.8) + c.ph) % 1 + 1, 8) % 1, reach: 1, expr: "zom", seed: 4 + c.v * 5 },
        so: { mode: "march", phase: q((t * 0.8 + c.ph) % 1, 8), stride: 0.6, expr: "zom", seed: 4 + c.v * 5 }, side: false, mirror: false, _face: face } as Put & { _face: number[] });
    });
    return out;
  }
  /** вид карточки идущего: к камере — спереди, от камеры — со спины, вбок — в профиль (вызывается из update через resolveViews) */
  resolveViews(puts: Put[], cam: THREE.PerspectiveCamera) {
    const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0);
    for (const p of puts as (Put & { _face?: number[] })[]) {
      if (!p._face) continue;
      const tx = cam.position.x - p.x, tz = cam.position.z - p.z, tl = Math.hypot(tx, tz) || 1, c = (tx * p._face[0] + tz * p._face[1]) / tl;
      if (c > 0.55) p.side = false;
      else if (c < -0.55) { p.side = false; p.fo = { ...p.fo, back: true }; }
      else { p.side = true; p.mirror = p._face[0] * right.x + p._face[1] * right.z < 0; }
    }
    return puts;
  }
}
