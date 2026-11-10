/* ТЕСТ 2 «Бумажная диорама 3D» — холодное начало эп. 1 (0–20 с) с тем же голосом и звуком.
   Заправка собрана в Three.js из «бумажных» коробок (текстуры рисует наш движок: фактура, ножничный край, тёмный контур),
   Joe и зомби — плоские вырезанные фигурки в 3D (рисуются каждый кадр нашим chars.js), отбрасывают честные тени.
   Камера летит по ключам: улица → сквозь дверь внутрь → «хлыст» к двери → наезд на крик → кнопка → жалюзи → снаружи. */
const CUE = {};
const T3 = THREE;
let DIO = null;

// ---------- текстуры: рисуем нашим движком на отдельном холсте
function paint(w, h, fn) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const prev = ctx, pS = S, pSS = SS.splice(0);
  ctx = c.getContext('2d'); S = 1; try { fn(w, h); } finally { ctx = prev; S = pS; SS.push(...pSS); }
  const tx = new T3.CanvasTexture(c); tx.colorSpace = T3.SRGBColorSpace; tx.anisotropy = 4; return tx;
}
const PAPER = {};
function paperTex(col, o = {}) {                                         // цветная бумага с волокнами и тёмным «ножничным» краем
  const key = col + JSON.stringify(o); if (PAPER[key]) return PAPER[key];
  const w = o.w || 256, h = o.h || 256, tx = paint(w, h, () => {
    rectP(0, 0, w, h, col, { seed: hsh(w, h, col.length * 7 + (o.seed || 0)), line: false, step: 40 });
    const r = rng(o.seed || 11); for (let i = 0; i < 70; i++) dot(r() * w, r() * h, 0.6 + r() * 1.4, r() < 0.5 ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)');
    if (o.fn) o.fn(w, h);
    if (o.edge !== false) { ctx.strokeStyle = 'rgba(28,21,18,0.9)'; ctx.lineWidth = o.lw || 5; ctx.strokeRect(2, 2, w - 4, h - 4); } });
  if (o.rep) { tx.wrapS = tx.wrapT = T3.RepeatWrapping; tx.repeat.set(o.rep[0], o.rep[1]); }
  return (PAPER[key] = tx);
}
function mat(col, o = {}) { return new T3.MeshStandardMaterial({ map: o.map || paperTex(col, o), roughness: o.rough ?? 0.92, metalness: 0, emissive: o.emis ? new T3.Color(o.emis) : undefined, emissiveIntensity: o.ei ?? 1, emissiveMap: o.emap, transparent: !!o.tr, opacity: o.op ?? 1, side: o.side ?? T3.FrontSide }); }
function box(w, h, d, m, x, y, z, o = {}) {
  const g = new T3.BoxGeometry(w, h, d), ms = Array.isArray(m) ? m : m; const b = new T3.Mesh(g, ms); b.position.set(x, y, z); b.castShadow = o.cast !== false; b.receiveShadow = true; if (o.ry) b.rotation.y = o.ry; DIO.scene.add(b); return b;
}
function quad(w, h, m, x, y, z, o = {}) { const q = new T3.Mesh(new T3.PlaneGeometry(w, h), m); q.position.set(x, y, z); if (o.rx) q.rotation.x = o.rx; if (o.ry) q.rotation.y = o.ry; q.receiveShadow = o.recv !== false; q.castShadow = !!o.cast; DIO.scene.add(q); return q; }
function signTex(w, h, bg, text, size, col, font = 'Inter Black') { return paint(w, h, () => { rectP(0, 0, w, h, bg, { seed: hsh(w, text.length), line: false }); txt(text, w / 2, h / 2 + 3, size, { font, col }); ctx.strokeStyle = '#1c1512'; ctx.lineWidth = 6; ctx.strokeRect(3, 3, w - 6, h - 6); }); }

// ---------- вырезанные фигурки: плоскость с текстурой, которую каждый кадр рисует chars.js
function cutCard(name, hM = 2.05) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 740; const tx = new T3.CanvasTexture(c); tx.colorSpace = T3.SRGBColorSpace;
  const m = new T3.MeshStandardMaterial({ map: tx, transparent: true, alphaTest: 0.45, roughness: 0.9, side: T3.DoubleSide });
  const wM = hM * 512 / 740, q = new T3.Mesh(new T3.PlaneGeometry(wM, hM), m); q.castShadow = true; q.receiveShadow = false;
  q.customDepthMaterial = new T3.MeshDepthMaterial({ depthPacking: T3.RGBADepthPacking, map: tx, alphaTest: 0.45 });
  DIO.scene.add(q); return { q, c, g: c.getContext('2d'), tx, hM, name };
}
function drawCard(cd, fn) {                                             // fn рисует героя: ноги — в точке (256, 660) холста
  const prev = ctx, pS = S, pSS = SS.splice(0); ctx = cd.g; S = 1; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, 512, 740);
  try { fn(); } finally { ctx = prev; S = pS; SS.push(...pSS); } cd.tx.needsUpdate = true;
}
function placeCard(cd, x, z, o = {}) {                                   // поставить на пол (ноги на y=0) лицом к камере
  const feet = 660 / 740; cd.q.visible = o.vis !== false; cd.q.position.set(x, (o.y || 0) + cd.hM * (feet - 0.5), z);
  const c = DIO.cam.position; cd.q.rotation.set(0, Math.atan2(c.x - x, c.z - z), 0);
}
const JOEc = (cd, t, jo) => drawCard(cd, () => joe({ x: 256, y: 660 - 512 * 0.88, s: 0.88, t, noShadow: true, ...jo }));
const ZOMc = (cd, t, zo) => drawCard(cd, () => zombie({ x: 256, y: 660 - 512 * 0.88, s: 0.88, t, v: 0, noShadow: true, ...zo }));

// ---------- мир: магазин (x −7…7, z −8…0, высота 3.5), навес и колонки снаружи (z 1.5…10.5), трасса z≈16
function dioInit() {
  const cv = document.createElement('canvas'); cv.width = PW; cv.height = PH;
  const R = new T3.WebGLRenderer({ canvas: cv, antialias: true, preserveDrawingBuffer: true });
  R.setPixelRatio(1); R.setSize(PW, PH, false); R.shadowMap.enabled = true; R.shadowMap.type = T3.PCFSoftShadowMap;
  R.outputColorSpace = T3.SRGBColorSpace; R.toneMapping = T3.NeutralToneMapping; R.toneMappingExposure = 1.0;
  const scene = new T3.Scene(); scene.background = new T3.Color(0x111830); scene.fog = new T3.FogExp2(0x1b2340, 0.028);
  const cam = new T3.PerspectiveCamera(40, PW / PH, 0.05, 300);
  DIO = { R, scene, cam, cv, L: {} };
  // свет: холодная ночь + тёплые лампы навеса и магазина
  scene.add(new T3.HemisphereLight(0x9aa8e0, 0x3a2a30, 0.7));
  const moon = new T3.DirectionalLight(0x9fb4ff, 0.6); moon.position.set(-20, 30, 25); moon.castShadow = true; moon.shadow.mapSize.set(1024, 1024);
  Object.assign(moon.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, near: 1, far: 90 }); moon.shadow.bias = -0.0008; scene.add(moon);
  const store = new T3.SpotLight(0xfff2dc, 60, 18, 1.05, 0.6, 1.2); store.position.set(0.5, 3.4, -3.2); store.target.position.set(1.5, 0, -2.5); store.castShadow = true; store.shadow.mapSize.set(1024, 1024); store.shadow.bias = -0.0006; scene.add(store, store.target);
  const fill = new T3.PointLight(0xfff0d8, 16, 16, 1.4); fill.position.set(-3, 3.2, -4.5); scene.add(fill); const fill2 = new T3.PointLight(0xffe6c8, 10, 12, 1.4); fill2.position.set(2.5, 3.2, -1.2); scene.add(fill2);
  const can1 = new T3.PointLight(0xffe8c0, 40, 16, 1.6); can1.position.set(-3, 4.6, 6); const can2 = can1.clone(); can2.position.set(3, 4.6, 6); scene.add(can1, can2);
  const alarm = new T3.PointLight(0xff3020, 0, 16, 1.4); alarm.position.set(0, 3.2, -2); scene.add(alarm);
  const neon = new T3.PointLight(0xff4a7a, 6, 6, 1.6); neon.position.set(4.5, 2.4, 0.6); scene.add(neon);
  DIO.L = { store, fill, alarm, neon, can1, can2, moonL: moon };

  // земля, трасса, лужи
  quad(120, 120, mat('#2c303a', { rep: [30, 30], edge: false, rough: 0.55 }), 0, 0, 0, { rx: -Math.PI / 2 });
  for (let i = -12; i <= 12; i++) quad(1.8, 0.18, mat('#e3c64a', { edge: false }), i * 4, 0.01, 17, { rx: -Math.PI / 2 });
  // дальний лес/холмы и луна — вырезанные силуэты
  const hills = paint(1024, 256, (w, h) => { piece([[0, 256], [0, 150], [120, 90], [260, 140], [380, 70], [520, 130], [660, 60], [800, 120], [920, 80], [1024, 120], [1024, 256]], '#0d1324', { seed: 61, lw: 4 }); });
  for (let i = -1; i <= 1; i++) quad(70, 17, new T3.MeshBasicMaterial({ map: hills, transparent: true, fog: true }), i * 68, 7, -45, { recv: false });
  const moonT = paint(256, 256, () => { ellP(128, 128, 110, 110, '#f1ecd2', { seed: 62, lw: 4 }); });
  quad(9, 9, new T3.MeshBasicMaterial({ map: moonT, transparent: true, fog: false }), 30, 30, -70, { recv: false });

  // здание магазина: стены (изнутри и снаружи), пол-шашечка, потолок
  const wallIn = mat('#cfc3a8', { rep: [4, 1], fn: (w, h) => { for (let y = 40; y < h; y += 64) stroke([[0, y], [w, y]], 'rgba(90,70,40,0.35)', 3); rectP(0, h - 30, w, 30, '#8a6a4a', { seed: 83, line: false }); } }), wallOut = mat('#b9a98a', { rep: [4, 1] });
  box(14.4, 3.6, 0.2, wallOut, 0, 1.8, -8.1); box(0.2, 3.6, 8.2, wallOut, -7.1, 1.8, -4); box(0.2, 3.6, 8.2, wallOut, 7.1, 1.8, -4);
  quad(14, 3.5, wallIn, 0, 1.75, -7.99); quad(8, 3.5, wallIn, -6.99, 1.75, -4, { ry: Math.PI / 2 }); quad(8, 3.5, wallIn, 6.99, 1.75, -4, { ry: -Math.PI / 2 });
  const chk = paint(256, 256, () => { rectP(0, 0, 256, 256, '#d9d4c4', { seed: 63, line: false }); rectP(0, 0, 128, 128, '#bdb6a2', { seed: 64, line: false }); rectP(128, 128, 128, 128, '#bdb6a2', { seed: 65, line: false }); });
  chk.wrapS = chk.wrapT = T3.RepeatWrapping; chk.repeat.set(14, 8); quad(14, 8, new T3.MeshStandardMaterial({ map: chk, roughness: 0.7 }), 0, 0.012, -4, { rx: -Math.PI / 2 });
  box(14.4, 0.3, 8.4, mat('#cfd2c8', { rep: [6, 4] }), 0, 3.65, -4, { cast: false });
  [[-3, -3], [3, -3], [-3, -6], [3, -6]].forEach(([x, z]) => box(1.6, 0.06, 0.4, new T3.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff6e0, emissiveIntensity: 2.2 }), x, 3.47, z, { cast: false }));
  // фасад: стена под окнами, над окнами, рамы, стекло, дверь
  box(6.2, 0.6, 0.25, wallOut, -4, 0.3, 0); box(6.2, 0.6, 0.25, wallOut, 4, 0.3, 0); box(14.4, 0.7, 0.25, wallOut, 0, 3.3, 0);
  for (const x of [-7, -4.6, -2.3, -0.95, 0.95, 2.3, 4.6, 7]) box(0.12, 3.0, 0.16, mat('#5c6168'), x, 1.6, 0);
  box(14.2, 0.1, 0.18, mat('#5c6168'), 0, 0.62, 0); box(14.2, 0.1, 0.18, mat('#5c6168'), 0, 2.95, 0);
  const glass = new T3.MeshStandardMaterial({ color: 0xbcd4ea, transparent: true, opacity: 0.12, roughness: 0.05, metalness: 0.1 });
  [[-4, 6.0], [4, 6.0]].forEach(([x, w]) => quad(w, 2.3, glass, x, 1.8, 0.02, { recv: false }));
  DIO.door = box(1.8, 2.9, 0.06, new T3.MeshStandardMaterial({ color: 0xbcd4ea, transparent: true, opacity: 0.18, roughness: 0.05 }), 0, 1.45, 0.02, { cast: false });
  DIO.push = quad(0.5, 0.18, new T3.MeshBasicMaterial({ map: signTex(256, 96, '#f2c230', 'PUSH', 56, '#1c1512') }), 0, 1.0, 0.07, { recv: false });
  // вывеска, неон, часы
  quad(9, 0.9, new T3.MeshStandardMaterial({ map: signTex(1024, 104, '#c8342c', 'HWY 40 FUEL & FOOD', 64, '#fbf8f0'), emissive: 0x501010, emissiveIntensity: 0.3 }), 0, 4.15, 0.14);
  box(14.4, 0.95, 0.25, mat('#c8342c'), 0, 4.15, 0);
  DIO.neonQ = quad(1.7, 0.6, new T3.MeshBasicMaterial({ map: signTex(256, 96, '#1a0c14', 'OPEN 24/7', 54, '#ff5a7a', 'Osw') }), 4.6, 2.35, -0.08, { ry: Math.PI, recv: false });
  quad(1.7, 0.6, DIO.neonQ.material, 4.6, 2.35, 0.08, { recv: false });
  // жалюзи (снаружи перед витриной) и короб
  const shT = paint(256, 256, () => { rectP(0, 0, 256, 256, '#8e949a', { seed: 66, line: false }); for (let y = 8; y < 256; y += 24) { stroke([[0, y], [256, y]], '#6c7278', 5, { smooth: false }); stroke([[0, y - 7], [256, y - 7]], '#b0b6bb', 3, { smooth: false }); } });
  shT.wrapS = shT.wrapT = T3.RepeatWrapping; shT.repeat.set(10, 3);
  DIO.shut = quad(14.2, 2.9, new T3.MeshStandardMaterial({ map: shT, roughness: 0.6, metalness: 0.3, side: T3.DoubleSide }), 0, 1.6, 0.22, { cast: true });
  box(14.4, 0.32, 0.4, mat('#5c6168'), 0, 3.12, 0.3);
  // стеллажи со снеками (вдоль z), касса, кофемашина, кнопка LOCKDOWN
  const snack = paint(512, 256, (w, h) => { rectP(0, 0, w, h, '#c9c2b2', { seed: 67, line: false }); for (let r = 0; r < 3; r++) { rectP(0, 76 + r * 84, w, 10, '#8a8274', { seed: 68 + r, lw: 2 });
    for (let q = 0; q < 9; q++) piece([[8 + q * 56, 74 + r * 84], [8 + q * 56, 18 + r * 84], [56 + q * 56, 18 + r * 84], [56 + q * 56, 74 + r * 84]], ['#d8342c', '#f2c230', '#3d7fc4', '#46b86a', '#8a4fc4', '#ff7a1a'][(q + r * 2) % 6], { seed: 70 + q + r * 9, lw: 2 }); } });
  const shelfM = [mat('#c9c2b2'), mat('#c9c2b2'), mat('#c9c2b2'), mat('#c9c2b2'), new T3.MeshStandardMaterial({ map: snack, roughness: 0.9 }), new T3.MeshStandardMaterial({ map: snack, roughness: 0.9 })];
  [-4.8, -2.4].forEach(x => box(3.4, 1.9, 0.7, shelfM, x, 0.95, -5.2));
  box(0.9, 1.9, 3.4, [new T3.MeshStandardMaterial({ map: snack }), new T3.MeshStandardMaterial({ map: snack }), mat('#c9c2b2'), mat('#c9c2b2'), mat('#c9c2b2'), mat('#c9c2b2')], -6.4, 0.95, -2.6);
  const ctr = mat('#7a5a3a', { fn: (w, h) => { for (let i = 1; i < 6; i++) stroke([[0, i * 42], [w, i * 42]], '#6a4c30', 3); } });
  box(3.2, 1.05, 0.8, ctr, 4.3, 0.53, -2.4); box(3.4, 0.08, 1.0, mat('#d9d4c4'), 4.3, 1.09, -2.4);
  box(0.55, 0.35, 0.45, mat('#2a2c30'), 5.1, 1.3, -2.45); box(0.5, 0.06, 0.2, new T3.MeshStandardMaterial({ color: 0x3aa070, emissive: 0x3aa070, emissiveIntensity: 1.2 }), 5.1, 1.5, -2.3, { cast: false });
  box(0.4, 0.6, 0.4, mat('#1c1512'), 5.55, 1.43, -2.6);
  DIO.btnBase = box(0.36, 0.06, 0.36, mat('#f2c230'), 3.8, 1.16, -2.2); DIO.btn = new T3.Mesh(new T3.CylinderGeometry(0.12, 0.13, 0.08, 24), new T3.MeshStandardMaterial({ color: 0xd8342c, emissive: 0x400000, roughness: 0.4 }));
  DIO.btn.position.set(3.8, 1.22, -2.2); DIO.btn.castShadow = true; scene.add(DIO.btn);
  box(3.4, 1.6, 0.7, shelfM, -3.6, 0.8, -2.9);                                                       // ещё один ряд ближе к двери
  box(0.6, 2.2, 6.0, [new T3.MeshStandardMaterial({ map: snack }), new T3.MeshStandardMaterial({ map: snack }), mat('#c9c2b2'), mat('#c9c2b2'), mat('#c9c2b2'), mat('#c9c2b2')], 6.65, 1.1, -5.0);
  quad(2.6, 0.5, new T3.MeshBasicMaterial({ map: signTex(512, 96, '#2f6a6e', 'COLD DRINKS →', 54, '#fbfaf6') }), -3, 2.95, -7.85, { recv: false });
  quad(1.3, 0.55, new T3.MeshBasicMaterial({ map: signTex(256, 110, '#1a1614', '3:07', 80, '#ff4a3a', 'Osw') }), 0, 3.2, -0.16, { ry: Math.PI, recv: false });
  quad(1.0, 1.3, new T3.MeshStandardMaterial({ map: paint(200, 260, () => { rectP(0, 0, 200, 260, '#f3ecd8', { seed: 81, line: false }); rectP(0, 0, 200, 60, '#d8342c', { seed: 82, line: false }); txt('HOT DOGS', 100, 32, 30, { font: 'Inter Black', col: '#fbfaf6' }); txt('2 for $3', 100, 150, 38, { font: 'Hand', col: '#1c1512' }); ctx.strokeStyle = '#1c1512'; ctx.lineWidth = 6; ctx.strokeRect(3, 3, 194, 254); }) }), 6.98, 2.2, -2.4, { ry: -Math.PI / 2 });
  [[-1.2, -6.6], [-0.6, -6.9], [5.4, -6.8]].forEach(([x, z], i) => box(0.55, 0.45, 0.45, mat('#b08a5a', { seed: 90 + i, fn: (w, h) => stroke([[0, h / 2], [w, h / 2]], '#8a6a40', 6) }), x, 0.23, z, { ry: i * 0.4 }));
  // холодильники у задней стены — светящиеся двери
  for (let i = 0; i < 4; i++) box(1.3, 2.2, 0.1, new T3.MeshStandardMaterial({ color: 0x9fd4e8, emissive: 0x4a90b0, emissiveIntensity: 0.9, roughness: 0.2 }), -5 + i * 1.45, 1.2, -7.9, { cast: false });
  // навес, столбы, колонки
  box(16, 0.5, 9, mat('#e7e3d6', { rep: [4, 2] }), 0, 5.1, 6); box(16.1, 0.28, 9.1, mat('#c8342c', { rep: [4, 2] }), 0, 4.75, 6);
  for (let x = -6; x <= 6; x += 3) box(1.4, 0.05, 0.4, new T3.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff2d0, emissiveIntensity: 2.5 }), x, 4.6, 6, { cast: false });
  [[-5, 6], [5, 6]].forEach(([x, z]) => box(0.45, 4.6, 0.45, mat('#d9d4c4'), x, 2.3, z));
  [[-2.5, '3'], [2.5, '4']].forEach(([x, n]) => { box(1.0, 1.7, 0.6, [mat('#c8342c'), mat('#c8342c'), mat('#f3ecd8'), mat('#c8342c'), new T3.MeshStandardMaterial({ map: signTex(128, 220, '#c8342c', n, 90, '#7dffb0', 'Osw') }), new T3.MeshStandardMaterial({ map: signTex(128, 220, '#c8342c', n, 90, '#7dffb0', 'Osw') })], x, 0.85, 6);
    box(1.4, 0.2, 0.9, mat('#8d8f94'), x, 0.1, 6); });
  // столб с ценой
  box(0.25, 6, 0.25, mat('#2a2e36'), 9, 3, 12); quad(2.6, 2.0, new T3.MeshStandardMaterial({ map: paint(256, 200, () => { rectP(0, 0, 256, 200, '#f3ecd8', { seed: 69, line: false }); rectP(0, 0, 256, 64, '#c8342c', { seed: 70, line: false }); txt('GAS', 128, 34, 44, { font: 'Inter Black', col: '#fbfaf6' }); txt('$3.49', 128, 130, 72, { font: 'Osw', weight: 600, col: '#1c1512' }); ctx.strokeStyle = '#1c1512'; ctx.lineWidth = 6; ctx.strokeRect(3, 3, 250, 194); }), emissive: 0x222018 }), 9, 6.2, 12.15);
  // дождь
  const N = 2400, pos = new Float32Array(N * 6), rr = rng(71); DIO.rain0 = [];
  for (let i = 0; i < N; i++) DIO.rain0.push([rr() * 44 - 22, rr() * 12, rr() * 34 - 8, 0.6 + rr() * 0.4]);
  const rg = new T3.BufferGeometry(); rg.setAttribute('position', new T3.BufferAttribute(pos, 3));
  DIO.rain = new T3.LineSegments(rg, new T3.LineBasicMaterial({ color: 0xaac4f0, transparent: true, opacity: 0.45, fog: true })); scene.add(DIO.rain);
  // герои
  DIO.joe = cutCard("joe"); DIO.z1 = cutCard("z1"); DIO.zs = [0, 1, 2, 3, 4, 5].map(i => cutCard("zc" + i));
}
function rainAt(t) { const p = DIO.rain.geometry.attributes.position.array; DIO.rain0.forEach(([x, y, z, v], i) => { const yy = ((y - t * 9 * v) % 12 + 12) % 12, xx = x - (12 - yy) * 0.12; p.set([xx, yy, z, xx + 0.04, yy + 0.35, z], i * 6); }); DIO.rain.geometry.attributes.position.needsUpdate = true; }

// ---------- камера по ключам: [t, px, py, pz, tx, ty, tz, fov]
function camAt(t, K) { let i = 1; while (i < K.length - 1 && t >= K[i][0]) i++; const a = K[i - 1], b = K[i], k = t <= a[0] ? 0 : t >= b[0] ? 1 : eio((t - a[0]) / (b[0] - a[0]));
  const v = j => lerp(a[j], b[j], k); DIO.cam.position.set(v(1), v(2), v(3)); DIO.cam.fov = a[7] != null ? v(7) : 40; DIO.cam.updateProjectionMatrix(); DIO.cam.lookAt(v(4), v(5), v(6)); }
function shake(a) { if (!a) return; const r = rng(hsh(FRAME, 5)); DIO.cam.position.x += (r() - 0.5) * a * 0.01; DIO.cam.position.y += (r() - 0.5) * a * 0.01; }

const JX = 2.0, JZ = -3.6, BX = 3.6, BZ = -2.95;                        // Joe в проходе у кассы; за кассой у кнопки
const KS = [
  [0,     [[0, -6, 0.7, 17, 0, 2.0, 0, 42], [1.6, -2.6, 1.5, 9, 0, 1.8, 0, 42], [3.0, 0, 1.6, 2.0, 0.6, 1.5, -2, 44], [3.8, 0.3, 1.55, -0.7, JX, 1.25, JZ, 44], [4.88, 0.6, 1.5, -1.0, JX, 1.2, JZ, 36]]],
  [4.88,  [[4.88, 0.6, 1.5, -1.0, JX, 1.2, JZ, 36], [5.25, 0.8, 1.5, -1.4, 0.3, 1.3, 2.0, 42], [7.03, 0.9, 1.45, -1.9, 0.3, 1.3, 1.6, 34]]],
  [7.03,  [[7.03, 0.9, 1.45, -1.9, 0.3, 1.3, 1.6, 34], [7.22, 1.3, 1.45, -2.4, JX, 1.42, JZ, 28], [8.18, 1.65, 1.45, -3.0, JX, 1.42, JZ, 50]]],
  [8.18,  [[8.18, -1.4, 0.55, -3.2, 0.4, 1.15, -0.6, 44], [10.44, -0.9, 0.6, -3.3, 1.6, 1.15, -1.8, 38]]],
  [10.44, [[10.44, 0.6, 1.45, -0.8, JX, 1.1, JZ, 44], [11.22, 1.8, 1.5, -0.9, BX, 1.15, BZ, 44]]],
  [11.22, [[11.22, 3.55, 1.75, -1.55, 3.8, 1.18, -2.2, 40], [11.99, 3.65, 1.6, -1.75, 3.8, 1.18, -2.2, 34]]],
  [11.99, [[11.99, -0.6, 1.25, -4.2, 0.6, 1.7, 0.4, 50], [14.17, -0.2, 1.35, -4.0, 0.4, 1.8, 0.4, 46]]],
  [14.17, [[14.17, 0.4, 1.5, -1.5, 2.2, 1.15, -3.7, 38], [16.78, 2.9, 1.55, -1.7, 2.2, 1.2, -3.7, 34]]],
  [16.78, [[16.78, 1.5, 1.2, 7.5, 0, 1.6, 0, 46], [20, -3.5, 4.5, 16, 0, 1.5, 0, 46]]]
];
function shotI(t) { let i = 0; while (i < KS.length - 1 && t >= KS[i + 1][0]) i++; return i; }

function dioFrame(t) {
  if (!DIO) dioInit();
  const i = shotI(t), s = KS[i]; camAt(t, s[1]); shake(shakeAt(t));
  // свет по сюжету: мигание ламп после колокольчика, тревога после кнопки
  const fl = t > C0.whatever && t < C0.hit ? (hsh(Math.floor(t * 9)) % 4 === 0 ? 0.35 : 1) : 1, alarmOn = t > C0.hit;
  DIO.L.store.intensity = (alarmOn ? 14 : 34) * fl; DIO.L.fill.intensity = (alarmOn ? 3 : 16) * fl;
  DIO.L.alarm.intensity = alarmOn ? 26 * (0.55 + 0.45 * Math.sin(t * Math.PI * 1.4)) : 0; DIO.L.neon.intensity = alarmOn ? 0 : 6;
  // дверь, жалюзи, кнопка
  const od = pr(t, C0.chime - 0.1, C0.chime + 0.45), sh = pr(t, C0.steel, C0.crash + 0.05);
  DIO.door.position.x = 1.6 * sm(od); DIO.push.position.x = DIO.door.position.x;
  DIO.shut.scale.y = Math.max(0.001, sh); DIO.shut.position.y = 3.05 - 2.9 * sh / 2;
  DIO.btn.position.y = 1.22 - (t > C0.hit && t < C0.hit + 0.5 ? 0.04 : 0);
  rainAt(t);
  // Joe: у кассы → крик → бежит к кнопке → стоит в красном свете
  const run = pr(t, C0.a3, C0.a3 + 0.75), look = t > C0.lights + 0.2;
  let jx = JX, jz = JZ, jo;
  if (t < C0.a2) { const a = stackArm(t); jo = { flip: true, lk: look ? [-0.9, -0.1] : [0.8, 0.1], mood: look ? '' : 'sleepy', lid: look ? 0.1 : 0.5, arms: { l: [-150, 300, 'open'], r: [...(look ? [180, 150] : a.hand), 'fist'] } }; }
  else if (t < C0.a3) jo = { lk: [-0.9, -0.1], mood: t > C0.whatever ? 'shock' : 'dread', scream: t > C0.drop + 0.1 ? 1 : 0, sweat: 1, arms: { l: [-180, 170, 'open'], r: [180, 150, 'open'] } };
  else if (t < C0.steel) { jx = lerp(JX, BX, run); jz = lerp(JZ, BZ, run); jo = { legs: run < 1 ? 'run' : 'stand', mood: 'shock', scream: 0.7, lk: [0.9, 0], arms: { l: [-170, 120, 'fist'], r: run >= 1 ? [120, 60, 'fist'] : [170, 220, 'fist'] } }; }
  else { jx = t > C0.sit ? 2.2 : BX; jz = t > C0.sit ? -3.7 : BZ; jo = { lk: [-0.6, -0.2], mood: 'dread', sweat: 1, lid: 0.25, arms: { l: [-150, 300, 'open'], r: [150, 300, 'open'] } }; }
  JOEc(DIO.joe, t, jo); placeCard(DIO.joe, jx, jz);
  // зомби: подходит к двери → входит → идёт к кассе; после жалюзи — толпа снаружи
  const zin = pr(t, C0.a2, C0.chime + 0.6), zwalk = pr(t, C0.walked, C0.a3 + 1.2);
  const zx = lerp(1.6, 0.2, zin) + 1.2 * zwalk, zz = t < C0.chime + 0.3 ? lerp(7.5, 0.9, zin) : lerp(0.2, -2.0, zwalk);
  const z1on = t > C0.a2 - 0.2 && t < C0.steel; if (z1on) ZOMc(DIO.z1, t, { legs: 'run', tilt: 0.15 + Math.sin(step(t, 8) * 3) * 0.05, arms: { l: [-150, 110, 'open'], r: [150, 90, 'open'] } });
  placeCard(DIO.z1, zx, zz, { vis: z1on });
  DIO.zs.forEach((cd, k) => { const r = rng(900 + k), on = t > C0.steel - 0.3, side = k % 2 ? 1 : -1, x0 = -5 + k * 2 + r() * 0.6, q = t > C0.store ? 1 - pr(t, C0.store - 0.5, 20.5 + r() * 2) : 0, x = x0 + side * q * (6 + r() * 4), z = 0.9 + r() * 1.4 + q * (3 + r() * 4);
    if (on) ZOMc(cd, t + k * 0.7, { v: k % 3, legs: 'run', tilt: 0.1 + (r() - 0.5) * 0.2, arms: { l: [-150 + r() * 30, 40 + r() * 80, 'open'], r: [150, 30 + r() * 80, 'open'] } }); placeCard(cd, x, z, { vis: on }); });
  const outShot = i === 0 && t < 3.0 || i === KS.length - 1; DIO.L.moonL.castShadow = outShot; DIO.L.store.castShadow = !outShot;
  DIO.R.render(DIO.scene, DIO.cam);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(DIO.cv, 0, 0); ctx.restore();
  // надписи-удары поверх кадра (как в эпизоде)
  if (t < 2.2) stamp('3:07 AM', t, 0.3, 420, 200, 110, 501);
  if (t >= C0.hit && t < C0.steel) stamp('LOCKDOWN!', t, C0.hit, W / 2, 170, 140, 502);
  if (t >= C0.crash && t < C0.sit) stamp('CRASH!', t, C0.crash, W / 2, 170, 130, 503, 0.03);
  if (t >= C0.day && t < C0.store) { stamp('DAY 1', t, C0.day, 430, 190, 140, 504); if (t > C0.twenty) { push(1500, 760, 1, 0.03); label(0, 0, '29 TO GO', 380, '#f2c230', 0, 60); pop(); } }
}
frame = function (t) { if (!document.fonts.check("600 40px 'Osw'") && !DIO) return; dioFrame(t); };
