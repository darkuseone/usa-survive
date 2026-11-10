/* «Бумажная диорама» — 3D-сцены на Three.js (engine/vendor/three.r180.js) в стиле «Аппликации».
   Декорации — коробки и плоскости с бумажными текстурами, которые рисует наш движок (фактура, ножничный край, тёмный контур).
   Персонажи — вырезанные фигурки (dCard): плоскость, повёрнутая к камере, рисуется нашим chars.js; тени честные (customDepthMaterial с альфой).
   Кадр 2.5D: dPlate() — 3D-фон с размытием (глубина резкости), поверх — герой в 2D в полном разрешении, привязан к точке 3D (dProj).
   Всё считается от времени t: кадры детерминированы и рендерятся в любом порядке. */
const T3 = window.THREE;
let DIO = null;

function dSetup(o = {}) {
  const cv = document.createElement('canvas'); cv.width = PW; cv.height = PH;
  const R = new T3.WebGLRenderer({ canvas: cv, antialias: true, preserveDrawingBuffer: true });
  R.setPixelRatio(1); R.setSize(PW, PH, false); R.shadowMap.enabled = true; R.shadowMap.type = T3.PCFSoftShadowMap;
  R.outputColorSpace = T3.SRGBColorSpace; R.toneMapping = T3.NeutralToneMapping; R.toneMappingExposure = o.exposure ?? 1.0;
  const scene = new T3.Scene(); scene.background = new T3.Color(o.bg ?? 0x111830); scene.fog = new T3.FogExp2(o.fog ?? 0x1b2340, o.fogD ?? 0.028);
  const cam = new T3.PerspectiveCamera(o.fov ?? 50, PW / PH, 0.05, 400);
  DIO = { R, scene, cam, cv, cards: [], tmp: new T3.Vector3() }; return DIO;
}

// ---------- текстуры, нарисованные движком
function dPaint(w, h, fn) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const prev = ctx, pS = S, pSS = SS.splice(0);
  ctx = c.getContext('2d'); S = 1; try { fn(w, h); } finally { ctx = prev; S = pS; SS.push(...pSS); }
  const tx = new T3.CanvasTexture(c); tx.colorSpace = T3.SRGBColorSpace; tx.anisotropy = 4; return tx;
}
const D_TEX = {};
function dPaper(col, o = {}) {                                         // цветная бумага: волокна, пятна, тёмный «ножничный» край
  const key = col + '|' + (o.key || '') + '|' + (o.rep || ''); if (D_TEX[key] && !o.fn) return D_TEX[key];
  const w = o.w || 256, h = o.h || 256, tx = dPaint(w, h, () => {
    rectP(0, 0, w, h, col, { seed: hsh(w, h, col.length * 7 + (o.seed || 0)), line: false, step: 40 });
    const r = rng(o.seed || 11); for (let i = 0; i < (o.fibers ?? 120); i++) dot(r() * w, r() * h, 0.6 + r() * 1.6, r() < 0.5 ? 'rgba(0,0,0,0.13)' : 'rgba(255,255,255,0.13)');
    for (let i = 0; i < 6; i++) stroke([[r() * w, r() * h], [r() * w, r() * h]], 'rgba(0,0,0,0.05)', 1 + r() * 2);
    if (o.fn) o.fn(w, h);
    if (o.edge !== false) { ctx.strokeStyle = 'rgba(28,21,18,0.9)'; ctx.lineWidth = o.lw || 5; ctx.strokeRect(2, 2, w - 4, h - 4); } });
  if (o.rep) { tx.wrapS = tx.wrapT = T3.RepeatWrapping; tx.repeat.set(o.rep[0], o.rep[1]); }
  if (!o.fn) D_TEX[key] = tx; return tx;
}
function dMat(col, o = {}) {
  return new T3.MeshStandardMaterial({ map: o.map || dPaper(col, o), roughness: o.rough ?? 0.92, metalness: o.metal ?? 0,
    emissive: o.emis ? new T3.Color(o.emis) : new T3.Color(0), emissiveIntensity: o.ei ?? 1, emissiveMap: o.emap || null,
    transparent: !!o.tr, opacity: o.op ?? 1, side: o.side ?? T3.FrontSide, alphaTest: o.at ?? 0 });
}
function dGlow(col, ei = 2) { return new T3.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: ei, roughness: 0.4 }); }
function dSign(w, h, bg, text, size, col, font = 'Inter Black', o = {}) {
  return dPaint(w, h, () => { rectP(0, 0, w, h, bg, { seed: hsh(w, text.length, size), line: false }); if (o.fn) o.fn(w, h);
    txt(text, w / 2, h / 2 + (o.dy ?? 3), size, { font, col, weight: o.weight }); if (o.edge !== false) { ctx.strokeStyle = '#1c1512'; ctx.lineWidth = 6; ctx.strokeRect(3, 3, w - 6, h - 6); } });
}
function dAdd(m, x, y, z, o = {}) { m.position.set(x, y, z); if (o.rx) m.rotation.x = o.rx; if (o.ry) m.rotation.y = o.ry; if (o.rz) m.rotation.z = o.rz; m.castShadow = o.cast ?? true; m.receiveShadow = o.recv ?? true; (o.parent || DIO.scene).add(m); return m; }
function dBox(w, h, d, m, x, y, z, o = {}) { return dAdd(new T3.Mesh(new T3.BoxGeometry(w, h, d), m), x, y, z, o); }
function dQuad(w, h, m, x, y, z, o = {}) { return dAdd(new T3.Mesh(new T3.PlaneGeometry(w, h, o.sx || 1, o.sy || 1), m), x, y, z, { cast: false, ...o }); }
function dCyl(r1, r2, h, m, x, y, z, o = {}) { return dAdd(new T3.Mesh(new T3.CylinderGeometry(r1, r2, h, o.seg || 20), m), x, y, z, o); }
function dTube(pts, r, m, o = {}) { const c = new T3.CatmullRomCurve3(pts.map(p => new T3.Vector3(...p))); return dAdd(new T3.Mesh(new T3.TubeGeometry(c, 40, r, 8), m), 0, 0, 0, o); }
function dBill(tex, w, h, x, y, z, o = {}) {                          // вырезанный силуэт (дерево, облако, холм): плоскость с альфой
  const m = new T3.MeshStandardMaterial({ map: tex, transparent: true, alphaTest: 0.4, roughness: 1, side: T3.DoubleSide, fog: o.fog ?? true });
  const q = dQuad(w, h, o.basic ? new T3.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.4, fog: o.fog ?? true, side: T3.DoubleSide }) : m, x, y, z, { cast: o.cast ?? false, ry: o.ry });
  if (o.cast) q.customDepthMaterial = new T3.MeshDepthMaterial({ depthPacking: T3.RGBADepthPacking, map: tex, alphaTest: 0.4 }); return q;
}

// ---------- вырезанные фигурки
function dCard(hM = 2.05, res = 1) {                                  // холст 512×740·res; ноги — в точке (256, 660)·res
  const c = document.createElement('canvas'); c.width = 512 * res; c.height = 740 * res; const tx = new T3.CanvasTexture(c); tx.colorSpace = T3.SRGBColorSpace;
  const m = new T3.MeshStandardMaterial({ map: tx, transparent: true, alphaTest: 0.45, roughness: 0.9, side: T3.DoubleSide });
  const q = new T3.Mesh(new T3.PlaneGeometry(hM * 512 / 740, hM), m); q.castShadow = true;
  q.customDepthMaterial = new T3.MeshDepthMaterial({ depthPacking: T3.RGBADepthPacking, map: tx, alphaTest: 0.45 });
  DIO.scene.add(q); const cd = { q, c, g: c.getContext('2d'), tx, hM, res, m }; DIO.cards.push(cd); return cd;
}
function dDraw(cd, fn) {
  const prev = ctx, pS = S, pSS = SS.splice(0); ctx = cd.g; S = 1; ctx.setTransform(cd.res, 0, 0, cd.res, 0, 0); ctx.clearRect(0, 0, 512, 740);
  try { fn(); } finally { ctx = prev; S = pS; SS.push(...pSS); } cd.tx.needsUpdate = true;
}
function dPlace(cd, x, z, o = {}) {                                   // ноги на полу (y), лицом к камере
  const feet = 660 / 740; cd.q.visible = o.vis !== false; cd.q.position.set(x, (o.y || 0) + cd.hM * (feet - 0.5), z);
  const c = DIO.cam.position; cd.q.rotation.set(0, o.face ?? Math.atan2(c.x - x, c.z - z), 0);
}
// кэш поз для толпы: n рисунков один раз → текстуры, фигурке меняется только map
function dPoses(n, draw) { return Array.from({ length: n }, (_, i) => { const c = document.createElement('canvas'); c.width = 384; c.height = 560; const prev = ctx, pS = S, pSS = SS.splice(0);
  ctx = c.getContext('2d'); S = 1; ctx.setTransform(384 / 512, 0, 0, 384 / 512, 0, 0); try { draw(i); } finally { ctx = prev; S = pS; SS.push(...pSS); }
  const tx = new T3.CanvasTexture(c); tx.colorSpace = T3.SRGBColorSpace; return tx; }); }
function dCrowdCard(hM = 2.0) { const m = new T3.MeshStandardMaterial({ transparent: true, alphaTest: 0.45, roughness: 0.95, side: T3.DoubleSide });
  const q = new T3.Mesh(new T3.PlaneGeometry(hM * 512 / 740, hM), m); q.castShadow = true; q.customDepthMaterial = new T3.MeshDepthMaterial({ depthPacking: T3.RGBADepthPacking, alphaTest: 0.45 });
  DIO.scene.add(q); return { q, m, hM, set(tx) { if (m.map !== tx) { m.map = tx; m.needsUpdate = true; q.customDepthMaterial.map = tx; q.customDepthMaterial.needsUpdate = true; } } }; }

// ---------- камера по ключам: [t, px, py, pz, tx, ty, tz, fov, roll]
function dCam(t, K, ease = eio) { let i = 1; while (i < K.length - 1 && t >= K[i][0]) i++; const a = K[i - 1], b = K[i], k = t <= a[0] ? 0 : t >= b[0] ? 1 : ease((t - a[0]) / (b[0] - a[0]));
  const v = j => lerp(a[j] ?? 0, b[j] ?? 0, k), c = DIO.cam; c.position.set(v(1), v(2), v(3)); c.fov = a[7] != null ? v(7) : 50; c.updateProjectionMatrix(); c.up.set(0, 1, 0); c.lookAt(v(4), v(5), v(6));
  const roll = v(8); if (roll) c.rotateZ(roll); }
function dShake(a) { if (!a) return; const r = rng(hsh(FRAME, 5)); DIO.cam.position.x += (r() - 0.5) * a * 0.008; DIO.cam.position.y += (r() - 0.5) * a * 0.008; }
function dProj(x, y, z) { const v = DIO.tmp.set(x, y, z).project(DIO.cam); const d = DIO.cam.position.distanceTo(new T3.Vector3(x, y, z));
  return { x: (v.x + 1) / 2 * PW, y: (1 - v.y) / 2 * PH, ppm: PH / (2 * Math.tan(DIO.cam.fov * Math.PI / 360) * d), front: v.z < 1 }; }
// рендер 3D-кадра в текущий ctx (blur — глубина резкости фона для кадров 2.5D)
function dRender(o = {}) { DIO.R.render(DIO.scene, DIO.cam); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); if (o.blur > 0.3) ctx.filter = `blur(${o.blur.toFixed(1)}px)`;
  if (o.scale) { const s = o.scale; ctx.drawImage(DIO.cv, -PW * (s - 1) / 2, -PH * (s - 1) / 2, PW * s, PH * s); } else ctx.drawImage(DIO.cv, 0, 0); ctx.restore(); }
// 2D-герой поверх 3D, в точке (x, y, z) мира; ppm → масштаб; tint — окраска светом сцены
const D_LAY = document.createElement('canvas'); D_LAY.width = PW; D_LAY.height = PH;
function dHero(x, y, z, fn, o = {}) {
  const f = dProj(x, y, z), h = dProj(x, y + (o.hM ?? 1.9), z); if (!f.front || !h.front) return; const p = f, s = Math.hypot(f.x - h.x, f.y - h.y) / 672, g = D_LAY.getContext('2d'), prev = ctx, pS = S, pSS = SS.splice(0);   // масштаб — по проекции ног и макушки
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, PW, PH); ctx = g; S = 1;
  try { push(p.x + (o.dx || 0), p.y + (o.dy || 0), s); fn(); pop(); } finally { ctx = prev; S = pS; SS.push(...pSS); }
  if (o.tint) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-atop'; g.fillStyle = o.tint; g.fillRect(0, 0, PW, PH); g.restore(); }
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.shadowColor = 'rgba(8,6,10,0.5)'; ctx.shadowBlur = 24; ctx.shadowOffsetX = 10; ctx.shadowOffsetY = 14; ctx.drawImage(D_LAY, 0, 0); ctx.restore();
}
