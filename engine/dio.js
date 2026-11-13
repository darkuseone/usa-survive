/* «Бумажная диорама» — 3D-сцены на Three.js (engine/vendor/three.r180.js) в стиле «Аппликации».
   Декорации — коробки и плоскости с бумажными текстурами, которые рисует наш движок (фактура, ножничный край, тёмный контур).
   Персонажи — вырезанные фигурки (dCard): плоскость, повёрнутая к камере, рисуется нашим chars.js; тени честные (customDepthMaterial с альфой);
   яркость фигурок ограничена их же цветом (не пересвечиваются лампами и не проваливаются в черноту).
   Свечение — отдельным проходом: светятся только источники (o.glow: лампы, неон, ореолы), а не всё светлое в кадре.
   Кадр 2.5D: dRender({blur}) — 3D-фон с размытием, поверх — герой в 2D в полном разрешении (dHero), привязан к точке 3D,
   может быть обрезан краем стола (clipLine) и расчерчен полосами света (stripes).
   dClipCheck() — проверка постановки: камера не должна входить в предметы и фигурки (см. tools/clipcheck.cjs).
   Всё считается от времени t: кадры детерминированы и рендерятся в любом порядке. */
const T3 = window.THREE;
let DIO = null;

function dSetup(o = {}) {
  const cv = document.createElement('canvas'); cv.width = PW; cv.height = PH;
  const R = new T3.WebGLRenderer({ canvas: cv, antialias: true, preserveDrawingBuffer: true });
  R.setPixelRatio(1); R.setSize(PW, PH, false); R.shadowMap.enabled = true; R.shadowMap.type = T3.PCFSoftShadowMap;
  R.outputColorSpace = T3.SRGBColorSpace; R.toneMapping = T3.NeutralToneMapping; R.toneMappingExposure = 1.0;
  const scene = new T3.Scene(); scene.background = new T3.Color(o.bg ?? 0x111830); scene.fog = new T3.FogExp2(o.fog ?? 0x1b2340, o.fogD ?? 0.028);
  const cam = new T3.PerspectiveCamera(o.fov ?? 50, PW / PH, 0.05, 400);
  DIO = { R, scene, cam, cv, cards: [], crowd: [], tmp: new T3.Vector3(), dry: false, black0: new T3.Color(0),
    blackM: new T3.MeshBasicMaterial({ color: 0, fog: false, side: T3.DoubleSide }), blackOf: new WeakMap() };
  return DIO;
}

// ---------- текстуры, нарисованные движком
function dPaint(w, h, fn) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const prev = ctx, pS = S, pSS = SS.splice(0);
  ctx = c.getContext('2d'); S = 1; try { fn(w, h); } finally { ctx = prev; S = pS; SS.push(...pSS); }
  const tx = new T3.CanvasTexture(c); tx.colorSpace = T3.SRGBColorSpace; tx.anisotropy = 4; return tx;
}
const D_TEX = {};
function dPaper(col, o = {}) {                                         // цветная бумага: волокна, пятна, тёмный «ножничный» край
  const key = col + '|' + (o.key || '') + '|' + (o.rep || ''); if (D_TEX[key]) return D_TEX[key];
  const w = o.w || 256, h = o.h || 256, tx = dPaint(w, h, () => {
    rectP(0, 0, w, h, col, { seed: hsh(w, h, col.length * 7 + (o.seed || 0)), line: false, step: 40 });
    const r = rng(o.seed || 11); for (let i = 0; i < (o.fibers ?? 120); i++) dot(r() * w, r() * h, 0.6 + r() * 1.6, r() < 0.5 ? 'rgba(0,0,0,0.13)' : 'rgba(255,255,255,0.13)');
    for (let i = 0; i < 6; i++) stroke([[r() * w, r() * h], [r() * w, r() * h]], 'rgba(0,0,0,0.05)', 1 + r() * 2);
    if (o.fn) o.fn(w, h);
    if (o.edge !== false) { ctx.strokeStyle = 'rgba(28,21,18,0.9)'; ctx.lineWidth = o.lw || 5; ctx.strokeRect(2, 2, w - 4, h - 4); } });
  if (o.rep) { tx.wrapS = tx.wrapT = T3.RepeatWrapping; tx.repeat.set(o.rep[0], o.rep[1]); }
  if (o.key) D_TEX[key] = tx; return tx;                              // кэш — только по явному ключу (o.key обязателен при o.fn)
}
function dMat(col, o = {}) {
  return new T3.MeshStandardMaterial({ map: o.map || dPaper(col, o), roughness: o.rough ?? 0.92, metalness: o.metal ?? 0,
    emissive: o.emis ? new T3.Color(o.emis) : new T3.Color(0), emissiveIntensity: o.ei ?? 1, emissiveMap: o.emap || null,
    transparent: !!o.tr, opacity: o.op ?? 1, side: o.side ?? T3.FrontSide, alphaTest: o.at ?? 0 });
}
function dTexMat(tx, o = {}) { return new T3.MeshStandardMaterial({ map: tx, roughness: o.rough ?? 0.9, metalness: o.metal ?? 0, emissive: new T3.Color(o.emis ?? 0), emissiveMap: o.emis ? tx : null, emissiveIntensity: o.ei ?? 1, side: o.side ?? T3.FrontSide }); }
function dGlow(col, ei = 2) { return new T3.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: ei, roughness: 0.4 }); }
function dSign(w, h, bg, text, size, col, font = 'Inter Black', o = {}) {
  return dPaint(w, h, () => { rectP(0, 0, w, h, bg, { seed: hsh(w, text.length, size), line: false }); if (o.fn) o.fn(w, h);
    txt(text, w / 2, h / 2 + (o.dy ?? 3), size, { font, col, weight: o.weight }); if (o.edge !== false) { ctx.strokeStyle = '#1c1512'; ctx.lineWidth = 6; ctx.strokeRect(3, 3, w - 6, h - 6); } });
}
function dAdd(m, x, y, z, o = {}) { m.position.set(x, y, z); if (o.rx) m.rotation.x = o.rx; if (o.ry) m.rotation.y = o.ry; if (o.rz) m.rotation.z = o.rz; m.castShadow = o.cast ?? true; m.receiveShadow = o.recv ?? true;
  if (o.name) m.name = o.name; if (o.glow) m.userData.glow = true; if (o.noClip) m.userData.noClip = true; (o.parent || DIO.scene).add(m); return m; }
function dBox(w, h, d, m, x, y, z, o = {}) { return dAdd(new T3.Mesh(new T3.BoxGeometry(w, h, d), m), x, y, z, o); }
function dQuad(w, h, m, x, y, z, o = {}) { return dAdd(new T3.Mesh(new T3.PlaneGeometry(w, h, o.sx || 1, o.sy || 1), m), x, y, z, { cast: false, ...o }); }
function dCyl(r1, r2, h, m, x, y, z, o = {}) { return dAdd(new T3.Mesh(new T3.CylinderGeometry(r1, r2, h, o.seg || 20), m), x, y, z, o); }
function dTube(pts, r, m, o = {}) { const c = new T3.CatmullRomCurve3(pts.map(p => new T3.Vector3(...p))); return dAdd(new T3.Mesh(new T3.TubeGeometry(c, 40, r, 8), m), 0, 0, 0, o); }
function dBill(tex, w, h, x, y, z, o = {}) {                          // вырезанный силуэт (дерево, облако, холм): плоскость с альфой
  const P = { map: tex, transparent: true, alphaTest: 0.4, side: T3.DoubleSide, fog: o.fog ?? true };
  const q = dQuad(w, h, o.basic ? new T3.MeshBasicMaterial(P) : new T3.MeshStandardMaterial({ ...P, roughness: 1 }), x, y, z, { cast: o.cast ?? false, ry: o.ry, noClip: o.noClip ?? true, glow: o.glow });
  if (o.cast) q.customDepthMaterial = new T3.MeshDepthMaterial({ depthPacking: T3.RGBADepthPacking, map: tex, alphaTest: 0.4 }); return q;
}

// ---------- вырезанные фигурки
function dCap(sh) { sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', 'outgoingLight = clamp(outgoingLight, diffuseColor.rgb * 0.24, diffuseColor.rgb * 1.15 + 0.015);\n#include <opaque_fragment>'); }
function dCard(hM = 2.05, res = 1) {                                  // холст 512×740·res; ноги — в точке (256, 660)·res
  const c = document.createElement('canvas'); c.width = 512 * res; c.height = 740 * res; const tx = new T3.CanvasTexture(c); tx.colorSpace = T3.SRGBColorSpace;
  const m = new T3.MeshStandardMaterial({ map: tx, transparent: true, alphaTest: 0.45, roughness: 0.9, side: T3.DoubleSide }); m.onBeforeCompile = dCap;
  const q = new T3.Mesh(new T3.PlaneGeometry(hM * 512 / 740, hM), m); q.castShadow = true; q.userData.card = hM;
  q.customDepthMaterial = new T3.MeshDepthMaterial({ depthPacking: T3.RGBADepthPacking, map: tx, alphaTest: 0.45 });
  DIO.scene.add(q); const cd = { q, c, g: c.getContext('2d'), tx, hM, res, m }; DIO.cards.push(cd); return cd;
}
function dDraw(cd, fn) {
  if (DIO.dry) return; const prev = ctx, pS = S, pSS = SS.splice(0); ctx = cd.g; S = 1; ctx.setTransform(cd.res, 0, 0, cd.res, 0, 0); ctx.clearRect(0, 0, 512, 740);
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
function dCrowdCard(hM = 2.0) { const m = new T3.MeshStandardMaterial({ transparent: true, alphaTest: 0.45, roughness: 0.95, side: T3.DoubleSide }); m.onBeforeCompile = dCap;
  const q = new T3.Mesh(new T3.PlaneGeometry(hM * 512 / 740, hM), m); q.castShadow = true; q.userData.card = hM; q.customDepthMaterial = new T3.MeshDepthMaterial({ depthPacking: T3.RGBADepthPacking, alphaTest: 0.45 });
  DIO.scene.add(q); const cd = { q, m, hM, set(tx) { if (m.map !== tx) { m.map = tx; m.needsUpdate = true; q.customDepthMaterial.map = tx; q.customDepthMaterial.needsUpdate = true; } } }; DIO.crowd.push(cd); return cd; }

// ---------- камера по ключам: [t, px, py, pz, tx, ty, tz, fov, roll]
function dCam(t, K, ease = eio) { let i = 1; while (i < K.length - 1 && t >= K[i][0]) i++; const a = K[i - 1], b = K[i], k = t <= a[0] ? 0 : t >= b[0] ? 1 : ease((t - a[0]) / (b[0] - a[0]));
  const v = j => lerp(a[j] ?? 0, b[j] ?? 0, k), c = DIO.cam; c.position.set(v(1), v(2), v(3)); c.fov = a[7] != null ? v(7) : 50; c.updateProjectionMatrix(); c.up.set(0, 1, 0); c.lookAt(v(4), v(5), v(6));
  const roll = v(8); if (roll) c.rotateZ(roll); }
function dShake(a) { if (!a) return; const r = rng(hsh(FRAME, 5)); DIO.cam.position.x += (r() - 0.5) * a * 0.008; DIO.cam.position.y += (r() - 0.5) * a * 0.008; }
function dProj(x, y, z) { DIO.cam.updateMatrixWorld(); const v = DIO.tmp.set(x, y, z).project(DIO.cam);
  return { x: (v.x + 1) / 2 * PW, y: (1 - v.y) / 2 * PH, front: v.z < 1 }; }

// ---------- рендер: кадр 3D в текущий ctx + свечение источников (отдельный проход в четверть размера)
const D_BL = document.createElement('canvas'); D_BL.width = PW >> 2; D_BL.height = PH >> 2;
function dBlackOf(m) { if (Array.isArray(m) || !(m.alphaTest > 0 && m.map)) return DIO.blackM; let b = DIO.blackOf.get(m); if (!b) { b = new T3.MeshBasicMaterial({ color: 0, fog: false, side: T3.DoubleSide, alphaTest: m.alphaTest }); DIO.blackOf.set(m, b); } if (b.map !== m.map) { b.map = m.map; b.needsUpdate = true; } return b; }
function dGlowPass() {
  const R = DIO.R, sc = DIO.scene, w = PW >> 2, h = PH >> 2, sw = [];
  sc.traverse(o => { if (!(o.isMesh || o.isSprite || o.isPoints || o.isLineSegments) || o.userData.glow || !o.visible) return; const m = o.material;
    if (!o.isMesh || (!Array.isArray(m) && m.transparent && !(m.alphaTest > 0))) { sw.push([o, null]); o.visible = false; } else { sw.push([o, m]); o.material = dBlackOf(m); } });
  const bg = sc.background, fog = sc.fog, au = R.shadowMap.autoUpdate; sc.background = DIO.black0; sc.fog = null; R.shadowMap.autoUpdate = false;
  R.setViewport(0, 0, w, h); R.setScissor(0, 0, w, h); R.setScissorTest(true); R.render(sc, DIO.cam); R.setScissorTest(false); R.setViewport(0, 0, PW, PH);
  R.shadowMap.autoUpdate = au; sc.background = bg; sc.fog = fog; sw.forEach(([o, m]) => { if (m) o.material = m; else o.visible = true; });
  const g = D_BL.getContext('2d'); g.globalCompositeOperation = 'copy'; g.drawImage(DIO.cv, 0, PH - h, w, h, 0, 0, w, h);
}
function dRender(o = {}) {
  if (DIO.dry) return; DIO.R.toneMappingExposure = o.exp ?? 1; DIO.R.render(DIO.scene, DIO.cam);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); if (o.blur > 0.3) ctx.filter = `blur(${o.blur.toFixed(1)}px)`; ctx.drawImage(DIO.cv, 0, 0); ctx.filter = 'none';
  const bl = o.bloom ?? 1; if (bl > 0) { dGlowPass(); ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = Math.min(1, 0.85 * bl); ctx.filter = 'blur(26px)'; ctx.drawImage(D_BL, 0, 0, PW, PH);
    ctx.globalAlpha = Math.min(1, 0.6 * bl); ctx.filter = 'blur(7px)'; ctx.drawImage(D_BL, 0, 0, PW, PH); }
  ctx.restore();
}
// 2D-герой поверх 3D, в точке (x, y, z) мира; масштаб — по проекции ног и макушки; tint — окраска светом сцены;
// clipLine [[x,y,z],[x,y,z]] — герой виден только выше этой линии (край стола перед ним); stripes — полосы света по герою
const D_LAY = document.createElement('canvas'); D_LAY.width = PW; D_LAY.height = PH;
function dHero(x, y, z, fn, o = {}) {
  if (DIO.dry) return; const f = dProj(x, y, z), hd = dProj(x, y + (o.hM ?? 1.9), z); if (!f.front || !hd.front) return;
  const s = Math.hypot(f.x - hd.x, f.y - hd.y) / 672, g = D_LAY.getContext('2d'), prev = ctx, pS = S, pSS = SS.splice(0);
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.filter = 'none'; g.clearRect(0, 0, PW, PH); g.save();
  if (o.clipLine) { let a = dProj(...o.clipLine[0]), b = dProj(...o.clipLine[1]); if (a.x > b.x) [a, b] = [b, a]; const dx = b.x - a.x, dy = b.y - a.y;
    g.beginPath(); g.moveTo(a.x - dx * 30, a.y - dy * 30); g.lineTo(b.x + dx * 30, b.y + dy * 30); g.lineTo(b.x + dx * 30, -1e5); g.lineTo(a.x - dx * 30, -1e5); g.closePath(); g.clip(); }
  ctx = g; S = 1; try { push(f.x + (o.dx || 0), f.y + (o.dy || 0), s, o.rot || 0); fn(); pop(); } finally { ctx = prev; S = pS; SS.push(...pSS); }
  g.setTransform(1, 0, 0, 1, 0, 0);
  if (o.tint) { g.globalCompositeOperation = 'source-atop'; g.fillStyle = o.tint; g.fillRect(0, 0, PW, PH); }
  if (o.stripes) { const st = o.stripes; g.globalCompositeOperation = 'source-atop'; g.fillStyle = st.col || 'rgba(255,205,130,0.4)'; g.translate(PW / 2, PH / 2); g.rotate(st.ang ?? -0.35);
    for (let k = -12; k <= 12; k++) g.fillRect(-PW * 2, k * (st.gap ?? 150) + (st.off ?? 0) % (st.gap ?? 150), PW * 4, st.w ?? 44); }
  g.restore();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.shadowColor = 'rgba(8,6,10,0.5)'; ctx.shadowBlur = 24; ctx.shadowOffsetX = 10; ctx.shadowOffsetY = 14; ctx.drawImage(D_LAY, 0, 0); ctx.restore();
}

// ---------- проверка постановки: камера внутри предмета (с запасом margin) или вплотную к фигурке
function dClipCheck(margin = 0.14) {
  const p = DIO.cam.position, hits = [], bx = new T3.Box3(), sz = new T3.Vector3(); DIO.scene.updateMatrixWorld();
  DIO.scene.traverse(o => { if (!o.isMesh || o.userData.noClip || o.userData.glow && !o.name) return; for (let v = o; v; v = v.parent) if (!v.visible) return;
    if (o.userData.card) { if (Math.hypot(p.x - o.position.x, p.z - o.position.z) < 1.0 && p.y < o.position.y + o.userData.card * 0.6 + 0.15) hits.push('card@' + o.position.x.toFixed(1) + ',' + o.position.z.toFixed(1)); return; }
    bx.setFromObject(o); bx.getSize(sz); if (sz.x > 40 || sz.z > 40) return; bx.expandByScalar(margin);
    if (bx.containsPoint(p)) hits.push(o.name || (o.geometry.type.replace('Geometry', '') + '@' + [o.position.x, o.position.y, o.position.z].map(n => n.toFixed(1)).join(','))); });
  return hits;
}
