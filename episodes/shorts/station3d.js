/* 3D-диорама заправки эп. 1 (v2). Оси: +x вправо (если смотреть со стоянки на магазин), +z — к трассе.
   Магазин: x −7…7, z −8…0 (витрина на z = 0), потолок 3.6. Жалюзи — снаружи стекла (z = 0.5), прогиб и вмятины до стекла не достают.
   Внутри: два стеллажа (x −4.7 и −2.3), холодильники вдоль задней стены, кофе/слаш у левой стены, справа — касса (x 2.4…5.8, z −2.8…−2.0)
   и перегородка за ней (z = −4): закуток кассира z −3.6…−2.9. Снаружи: тротуар, слева автоматы и лёд, справа урна, газеты, баллоны;
   навес z 2…11 (низ 4.6), колонки x ±2.5 z 6.5, столбы x ±5; машина на краю стоянки (−10.6, 11.4) под фонарём; трасса z 15…22.
   Ничего не висит в воздухе и не стоит друг в друге; толпа ходит по свободным коридорам между колонками (stPath).
   stBuild() — один раз; stSet(t, st) — состояние кадра (см. параметры в stSet). */
const ST = {};
const HEX = n => '#' + n.toString(16).padStart(6, '0');
const SWK = 0.08;                                                       // высота тротуара
const LANES = [-4.1, -0.8, 0, 0.8, 4.1];                                // свободные коридоры на линии колонок (z = 6.5)

function stBuild() {
  dSetup({ fov: 55, fog: 0x1b2340, fogD: 0.02 });
  stSky(); stLights(); stGround(); stFar(); stBuilding(); stFront(); stInterior(); stShutter(); stCanopy(); stCar(-10.6, 11.4, 0.25); stActors(); stNeon();
}

// ---------- небо (фон кадра) и туман по времени суток
function stSky() {
  const sky = (top, mid, bot, stars, sun) => dPaint(256, 512, (w, h) => { const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, top); g.addColorStop(0.62, mid); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    const r = rng(7); for (let i = 0; i < stars; i++) dot(r() * w, r() * h * 0.55, 0.6 + r() * 1.2, '#dfe6ff', 0.4 + r() * 0.5); if (sun) radial(w * 0.68, h * 0.7, 140, sun, 0.9); });
  ST.sky = { night: sky('#060a1c', '#182250', '#33336a', 90), dawn: sky('#27336a', '#c26a7c', '#ffb062', 8, 'rgba(255,225,160,1)'), day: sky('#7f9cc8', '#a9bfd8', '#dcd8c8', 0), dusk: sky('#171b46', '#7a4478', '#f58a4e', 24, 'rgba(255,170,110,1)') };
  ST.fogCol = { night: 0x1b2340, dawn: 0x7a5f72, day: 0x9aa6b4, dusk: 0x4a3558 };
}

function stLights() {
  const S3 = DIO.scene, P = (col, i, d, dec, x, y, z) => { const l = new T3.PointLight(col, i, d, dec); l.position.set(x, y, z); S3.add(l); return l; };
  ST.hemi = new T3.HemisphereLight(0x9aa8e0, 0x3a2a30, 0.7); S3.add(ST.hemi);
  ST.sun = new T3.DirectionalLight(0x9fb4ff, 0.6); ST.sun.castShadow = true; ST.sun.shadow.mapSize.set(1024, 1024);
  Object.assign(ST.sun.shadow.camera, { left: -26, right: 26, top: 26, bottom: -26, near: 1, far: 120 }); ST.sun.shadow.bias = -0.0008; S3.add(ST.sun);
  ST.spot = new T3.SpotLight(0xfff2dc, 34, 18, 1.1, 0.6, 1.2); ST.spot.position.set(0.3, 3.45, -3.0); ST.spot.target.position.set(1.2, 0, -2.6); ST.spot.castShadow = true; ST.spot.shadow.mapSize.set(1024, 1024); ST.spot.shadow.bias = -0.0006; S3.add(ST.spot, ST.spot.target);
  ST.fill = P(0xfff0d8, 16, 16, 1.4, -3.4, 3.2, -4.6); ST.fill2 = P(0xffe6c8, 10, 12, 1.4, 4.2, 3.2, -2.6);
  ST.can = [-3.5, 3.5].map(x => P(0xffe8c0, 40, 18, 1.6, x, 4.4, 6.5));
  ST.win = P(0xfff2d0, 12, 10, 1.6, 0, 2, -0.8); ST.alarm = P(0xff3020, 0, 16, 1.4, 0, 3.2, -2.4); ST.exitL = P(0x40ff80, 0, 6, 1.6, 6.3, 2.5, -3.5);
  ST.dark = P(0x8088b4, 0, 16, 1.1, 1.0, 3.0, -3.2); ST.cool = P(0x58c8e8, 0, 9, 1.5, -2.6, 1.6, -6.9); ST.carL = P(0xffb030, 0, 10, 1.6, -10.1, 0.9, 13.9); ST.dayFill = P(0xfff0dd, 0, 26, 1.2, 0, 3.6, 5.5);
  const cookie = dPaint(256, 256, (w, h) => { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#fff'; for (let y = 10; y < h; y += 30) ctx.fillRect(0, y, w, (y / 30 | 0) % 3 === 1 ? 5 : 11); });   // щели между ламелями
  ST.shaft = new T3.SpotLight(0xffd8a0, 0, 18, 0.7, 0.3, 0.9); ST.shaft.map = cookie; ST.shaft.castShadow = true; ST.shaft.shadow.mapSize.set(512, 512); ST.shaft.shadow.bias = -0.001; S3.add(ST.shaft, ST.shaft.target);
}

// ---------- земля: мокрый асфальт, лужи, тротуар, разметка, трасса, отбойник
function stGround() {
  const FL = { rx: -Math.PI / 2, noClip: true };
  const asph = dPaper('#2b2f38', { key: 'asph', w: 512, h: 512, rep: [12, 12], edge: false, fibers: 400, fn: (w, h) => { const r = rng(21);
    for (let i = 0; i < 14; i++) ellP(r() * w, r() * h, 20 + r() * 50, 10 + r() * 30, 'rgba(15,16,22,0.35)', { raw: true, line: false, tex: false });
    for (let i = 0; i < 6; i++) stroke([[r() * w, r() * h], [r() * w, r() * h], [r() * w, r() * h]], 'rgba(10,10,14,0.5)', 2); } });
  dQuad(160, 160, new T3.MeshStandardMaterial({ map: asph, roughness: 0.42, metalness: 0.15 }), 0, 0, 0, FL);
  const puddle = new T3.MeshStandardMaterial({ color: 0x0c1020, roughness: 0.08, metalness: 0.6, transparent: true, opacity: 0.75 });
  [[-3, 4.2, 1.6, 0.8], [3.8, 8.9, 2.2, 1.0], [-6.5, 9.5, 1.4, 0.6], [1.2, 12.5, 2.6, 1.1], [7, 3.5, 1.2, 0.5], [-9, 14.3, 2.4, 0.9]].forEach(([x, z, a, b]) => { const e = new T3.Mesh(new T3.CircleGeometry(1, 28), puddle); e.scale.set(a, b, 1); dAdd(e, x, 0.012, z, { ...FL, cast: false }); });
  const paint = dGlow(0xd9d4c4, 0.15); for (let x = -7; x <= 7; x += 2.8) dQuad(0.12, 4, paint, x, 0.013, 12.9, FL);
  dBox(16, SWK, 1.6, dMat('#8d8a82', { key: 'walk', rep: [8, 1] }), 0, SWK / 2, 0.95, { noClip: true });
  dQuad(160, 7, new T3.MeshStandardMaterial({ map: dPaper('#25282f', { key: 'road', rep: [30, 2], edge: false }), roughness: 0.5 }), 0, 0.011, 18.5, FL);
  const yel = dGlow(0xe3c64a, 0.2); for (let i = -15; i <= 15; i++) dQuad(1.8, 0.16, yel, i * 4, 0.014, 18.5, FL);
  [15.15, 21.85].forEach(z => dQuad(160, 0.12, paint, 0, 0.014, z, FL));
  for (let x = -30; x <= 30; x += 3) dBox(0.14, 0.7, 0.14, dMat('#7a7e86', { key: 'post' }), x, 0.35, 23); dBox(64, 0.25, 0.08, dMat('#a8acb2', { key: 'rail' }), 0, 0.62, 22.95);
}

// ---------- даль: столбы с проводами, лес, холмы, луна, облака — вырезанные силуэты
function stFar() {
  for (let i = 0; i < 4; i++) { const x = -24 + i * 16; dCyl(0.12, 0.16, 9, dMat('#3a2e26', { key: 'pole' }), x, 4.5, 26); dBox(2.4, 0.14, 0.14, dMat('#3a2e26', { key: 'pole' }), x, 8.4, 26); }
  [8.3, 8.0].forEach(y => dTube([[-24, y, 26], [-16, y - 0.6, 26], [-8, y, 26], [0, y - 0.6, 26], [8, y, 26], [16, y - 0.6, 26], [24, y, 26]], 0.025, new T3.MeshBasicMaterial({ color: 0x0c0c12 }), { cast: false, noClip: true }));
  const pine = dPaint(256, 512, () => { piece(spline([[128, 10], [190, 160], [160, 160], [220, 300], [180, 300], [244, 450], [12, 450], [76, 300], [36, 300], [96, 160], [66, 160]], true, 4), '#141e1c', { seed: 31, lw: 4 }); rectP(112, 440, 32, 72, '#1c1512', { seed: 32, line: false }); });
  const r = rng(33); for (let i = 0; i < 30; i++) { const s = 5 + r() * 4; dBill(pine, s * 0.5, s, -40 + i * 2.8 + r() * 2, s / 2, 30 + r() * 12, { basic: true }); }
  for (let i = 0; i < 10; i++) { const s = 6 + r() * 5; dBill(pine, s * 0.5, s, -26 + r() * 52, s / 2, -14 - r() * 10, { basic: true }); }
  const hills = dPaint(1024, 256, () => piece([[0, 256], [0, 150], [120, 90], [260, 140], [380, 70], [520, 130], [660, 60], [800, 120], [920, 80], [1024, 120], [1024, 256]], '#0d1324', { seed: 61, lw: 4 }));
  for (let i = -1; i <= 1; i++) { dBill(hills, 90, 20, i * 88, 8, 70, { basic: true }); dBill(hills, 90, 20, i * 88, 8, -60, { basic: true }); }
  ST.moon = dBill(dPaint(256, 256, () => ellP(128, 128, 110, 110, '#f1ecd2', { seed: 62, lw: 4 })), 9, 9, -30, 34, 80, { basic: true, fog: false, glow: true });
  const cloud = dPaint(512, 200, () => blobP([[30, 160], [80, 90], [160, 70], [230, 30], [320, 50], [400, 40], [470, 100], [490, 160]], '#3a4468', { seed: 63, lw: 3 }));
  ST.clouds = [[-20, 28, 75], [15, 32, 85], [40, 26, 70]].map(([x, y, z]) => dBill(cloud, 22, 8, x, y, z, { basic: true }));
}

// ---------- коробка магазина: стены, пол, потолок, лампы
function stBuilding() {
  const siding = ST.siding = dMat('#b9a98a', { key: 'siding', rep: [6, 2], fn: (w, h) => { for (let y = 16; y < h; y += 32) stroke([[0, y], [w, y]], 'rgba(80,60,30,0.45)', 3); } });
  dBox(14.4, 3.7, 0.2, siding, 0, 1.85, -8.1, { name: 'стена-зад' }); dBox(0.2, 3.7, 8.2, siding, -7.1, 1.85, -4, { name: 'стена-лев' }); dBox(0.2, 3.7, 8.2, siding, 7.1, 1.85, -4, { name: 'стена-прав' });
  const wallIn = ST.wallIn = dMat('#cfc3a8', { key: 'wallIn', rep: [4, 1], fn: (w, h) => { for (let y = 40; y < h; y += 64) stroke([[0, y], [w, y]], 'rgba(90,70,40,0.35)', 3); rectP(0, h - 30, w, 30, '#8a6a4a', { seed: 83, line: false }); } });
  dQuad(14, 3.6, wallIn, 0, 1.8, -7.99, { noClip: true }); dQuad(8, 3.6, wallIn, -6.99, 1.8, -4, { ry: Math.PI / 2, noClip: true }); dQuad(8, 3.6, wallIn, 6.99, 1.8, -4, { ry: -Math.PI / 2, noClip: true });
  const chk = dPaint(256, 256, () => { rectP(0, 0, 256, 256, '#d9d4c4', { seed: 63, line: false }); rectP(0, 0, 128, 128, '#b4ad98', { seed: 64, line: false }); rectP(128, 128, 128, 128, '#b4ad98', { seed: 65, line: false }); });
  chk.wrapS = chk.wrapT = T3.RepeatWrapping; chk.repeat.set(14, 8); dQuad(14, 8, new T3.MeshStandardMaterial({ map: chk, roughness: 0.5 }), 0, 0.012, -4, { rx: -Math.PI / 2, noClip: true });
  dQuad(1.7, 1.0, dMat('#7a2a2a', { key: 'mat', fn: (w, h) => { ctx.strokeStyle = '#3a1414'; ctx.lineWidth = 14; ctx.strokeRect(14, 14, w - 28, h - 28); } }), 0, 0.02, -0.75, { rx: -Math.PI / 2, noClip: true });
  const tiles = dMat('#d6d8d0', { key: 'tiles', rep: [7, 4], fn: (w, h) => { stroke([[0, 2], [w, 2]], '#9a9c94', 4); stroke([[2, 0], [2, h]], '#9a9c94', 4); } });
  dQuad(14, 8, tiles, 0, 3.6, -4, { rx: Math.PI / 2, noClip: true }); dBox(14.6, 0.3, 8.6, dMat('#5c6168', { key: 'roof' }), 0, 3.82, -4, { cast: false, name: 'крыша' });
  ST.lamps = [[-4.5, -2.0], [0, -2.0], [4.5, -2.2], [-4.5, -5.6], [-0.3, -5.6]].map(([x, z]) => dBox(1.8, 0.06, 0.5, dGlow(0xfff6e0, 2.2), x, 3.56, z, { cast: false, glow: true }));
}

// ---------- фасад: стенки под окнами, рамы, стекло, раздвижная дверь, вывеска; на тротуаре слева автоматы и лёд, справа урна, газеты, баллоны
function stFront() {
  const siding = ST.siding, frame = dMat('#5c6168', { key: 'frame' });
  dBox(6.2, 0.62, 0.25, siding, -4, 0.31, 0, { name: 'подоконник-л' }); dBox(6.2, 0.62, 0.25, siding, 4, 0.31, 0, { name: 'подоконник-п' }); dBox(14.4, 0.75, 0.25, siding, 0, 3.32, 0, { name: 'перемычка' });
  for (const x of [-7, -4.6, -2.3, -0.95, 0.95, 2.3, 4.6, 7]) dBox(0.12, 3.0, 0.16, frame, x, 1.6, 0, { name: 'рама' });
  dBox(14.2, 0.1, 0.18, frame, 0, 0.64, 0, { noClip: true }); dBox(14.2, 0.1, 0.18, frame, 0, 2.95, 0, { noClip: true });
  const glass = new T3.MeshStandardMaterial({ color: 0xbcd4ea, transparent: true, opacity: 0.12, roughness: 0.05, metalness: 0.1 });
  [[-4, 6.0], [4, 6.0]].forEach(([x, w], i) => dQuad(w, 2.3, glass, x, 1.8, 0.02, { recv: false, name: 'витрина' }));
  [['ATM INSIDE', '#2a2c30', 5.8, 2.35], ['ICE $2.99', '#3d7fc4', 1.62, 2.3], ['HOT COFFEE', '#7a4a2a', -1.62, 2.3]].forEach(([s, c, x, y]) => dQuad(1.05, 0.44, new T3.MeshBasicMaterial({ map: dSign(320, 136, c, s, 46, '#fbf8f0') }), x, y, 0.06, { recv: false, noClip: true }));
  ST.door = dBox(1.8, 2.9, 0.05, new T3.MeshStandardMaterial({ color: 0xbcd4ea, transparent: true, opacity: 0.2, roughness: 0.05 }), 0, 1.45, 0.03, { cast: false, name: 'дверь' });
  dBox(1.5, 0.07, 0.07, dMat('#c9ccd1', { key: 'bar', metal: 0.5, rough: 0.3 }), 0, -0.35, 0, { parent: ST.door, noClip: true });
  dQuad(0.7, 0.16, new T3.MeshBasicMaterial({ map: dSign(320, 72, '#f2c230', 'AUTOMATIC DOOR', 30, '#1c1512') }), 0, 0.15, 0.03, { parent: ST.door, recv: false, noClip: true });
  dQuad(9, 0.85, dTexMat(dSign(1024, 100, '#c8342c', 'HWY 40 FUEL & FOOD', 62, '#fbf8f0'), { emis: 0xffffff, ei: 0.35 }), 0, 4.18, 0.15, { noClip: true }); dBox(14.4, 0.95, 0.25, dMat('#c8342c', { key: 'band' }), 0, 4.18, 0, { name: 'вывеска' });
  ST.clockC = document.createElement('canvas'); ST.clockC.width = 256; ST.clockC.height = 110; ST.clockT = new T3.CanvasTexture(ST.clockC); ST.clockT.colorSpace = T3.SRGBColorSpace; ST.clockS = '';
  dBox(1.3, 0.55, 0.06, [0, 0, 0, 0, 0, 0].map((_, i) => i === 5 ? new T3.MeshBasicMaterial({ map: ST.clockT }) : dMat('#1a1614', { key: 'clockB' })), 0, 3.26, -0.17, { cast: false, noClip: true });
  dBox(0.3, 0.2, 0.35, dMat('#e9edf2', { key: 'cam' }), 6.6, 3.35, -0.5, { name: 'камера' }); dCyl(0.07, 0.07, 0.2, dMat('#1c1512', { key: 'lens' }), 6.6, 3.3, -0.3, { rx: Math.PI / 2, noClip: true });
  // тротуар слева: два автомата и ящик льда; справа: урна, газетный автомат, клетка с баллонами
  [[-6.6, '#c8242c', 'COLA'], [-5.65, '#2a6ad8', 'ICE COLD']].forEach(([x, c, s], i) => { const side = dMat(c, { key: 'vend' + i }), f = dTexMat(dSign(220, 420, c, s, 44, '#fbf8f0', 'Inter Black', { dy: -160, fn: (w, h) => { for (let r = 0; r < 4; r++) for (let q = 0; q < 3; q++) rectP(24 + q * 62, 120 + r * 60, 48, 46, '#fbf8f0', { seed: 50 + r * 3 + q, lw: 2 }); } }), { emis: 0xffffff, ei: 0.55 });
    dBox(0.85, 1.9, 0.7, [side, side, side, side, f, side], x, SWK + 0.95, 1.15, { name: 'автомат' }); });
  const ice = dMat('#e9edf2', { key: 'ice' }); dBox(1.3, 1.05, 0.75, [ice, ice, dMat('#3d7fc4', { key: 'iceTop' }), ice, dTexMat(dSign(256, 200, '#e9edf2', 'ICE', 90, '#3d7fc4', 'Inter Black', { fn: (w, h) => rectP(0, 0, w, 40, '#3d7fc4', { seed: 9, line: false }) })), ice], -4.55, SWK + 0.525, 0.95, { name: 'лёд' });
  dCyl(0.28, 0.24, 0.85, dMat('#4a6a4a', { key: 'trash', fn: (w, h) => { for (let x = 0; x < w; x += 32) stroke([[x, 0], [x, h]], '#2a3a2a', 4); } }), 4.85, SWK + 0.425, 0.9, { name: 'урна' });
  dBox(0.5, 1.05, 0.45, dMat('#3d7fc4', { key: 'news', fn: (w, h) => rectP(30, 40, w - 60, 80, '#e9edf2', { seed: 5, lw: 3 }) }), 5.5, SWK + 0.525, 0.9, { name: 'газеты' });
  dBox(1.1, 1.5, 0.65, dMat('#7a7e86', { key: 'cage', fn: (w, h) => { for (let x = 0; x < w; x += 24) stroke([[x, 0], [x, h]], '#3a3d42', 3); for (let y = 0; y < h; y += 24) stroke([[0, y], [w, y]], '#3a3d42', 3); } }), 6.35, SWK + 0.75, 0.9, { name: 'баллоны' });
}

// ---------- внутри
function stInterior() {
  const wood = dMat('#7a5a3a', { key: 'wood', fn: (w, h) => { for (let i = 1; i < 6; i++) stroke([[0, i * 42], [w, i * 42]], '#6a4c30', 3); } }), shelfSide = dMat('#c9c2b2', { key: 'shelf' }), dark = dMat('#2a2c30', { key: 'darkbox' });
  // стеллажи со снеками (два ряда) и торцы
  const snack = dPaint(512, 256, (w, h) => { rectP(0, 0, w, h, '#c9c2b2', { seed: 67, line: false }); for (let rr = 0; rr < 3; rr++) { rectP(0, 76 + rr * 84, w, 10, '#8a8274', { seed: 68 + rr, lw: 2 });
    for (let q = 0; q < 9; q++) { const c = ['#d8342c', '#f2c230', '#3d7fc4', '#46b86a', '#8a4fc4', '#ff7a1a'][(q + rr * 2) % 6]; piece([[8 + q * 56, 74 + rr * 84], [8 + q * 56, 18 + rr * 84], [56 + q * 56, 18 + rr * 84], [56 + q * 56, 74 + rr * 84]], c, { seed: 70 + q + rr * 9, lw: 2 }); ellP(32 + q * 56, 48 + rr * 84, 10, 8, '#fbf8f0', { raw: true, line: false, a: 0.7 }); } } });
  const sm = dTexMat(snack);
  [-4.7, -2.3].forEach((x, i) => { dBox(0.75, 1.9, 3.6, [sm, sm, shelfSide, shelfSide, shelfSide, shelfSide], x, 0.95, -4.8, { name: 'стеллаж' }); dBox(0.95, 1.3, 0.5, [shelfSide, shelfSide, shelfSide, shelfSide, sm, sm], x, 0.65, -2.72, { name: 'торец' });
    dBox(1.1, 0.34, 0.04, [0, 0, 0, 0, 0, 0].map((_, k) => k >= 4 ? new T3.MeshBasicMaterial({ map: dSign(300, 92, i ? '#2f6a6e' : '#c8342c', i ? 'CANDY' : 'SNACKS', 56, '#fbf8f0') }) : shelfSide), x, 2.9, -3.4, { cast: false, noClip: true });
    [-0.45, 0.45].forEach(dx => dBox(0.015, 0.5, 0.015, dark, x + dx, 3.3, -3.4, { cast: false, noClip: true })); });
  // холодильники вдоль задней стены + козырёк с надписью
  const bottles = dPaint(256, 512, (w, h) => { rectP(0, 0, w, h, '#a8d8e8', { seed: 90, line: false }); for (let rr = 0; rr < 4; rr++) { rectP(0, 110 + rr * 120, w, 8, '#e9edf2', { seed: 91 + rr, line: false });
    for (let q = 0; q < 6; q++) piece([[14 + q * 40, 108 + rr * 120], [14 + q * 40, 40 + rr * 120], [22 + q * 40, 26 + rr * 120], [34 + q * 40, 26 + rr * 120], [42 + q * 40, 40 + rr * 120], [42 + q * 40, 108 + rr * 120]], ['#d8342c', '#46b86a', '#f2c230', '#3d7fc4'][(q + rr) % 4], { seed: 95 + q + rr * 6, lw: 1.6 }); }
    ctx.strokeStyle = '#5c6168'; ctx.lineWidth = 14; ctx.strokeRect(7, 7, w - 14, h - 14); });
  ST.coolM = dTexMat(bottles, { emis: 0x6aa8c8, ei: 0.55, rough: 0.3 });
  for (let i = 0; i < 7; i++) dBox(1.25, 2.3, 0.1, ST.coolM, -6.2 + i * 1.3, 1.25, -7.9, { cast: false, name: 'холодильник' });
  dBox(9.2, 0.42, 0.12, [0, 0, 0, 0, 0, 0].map((_, k) => k === 4 ? new T3.MeshBasicMaterial({ map: dSign(1024, 48, '#2f6a6e', 'COLD DRINKS · BEER · WATER · SODA', 34, '#fbfaf6') }) : dMat('#2f6a6e', { key: 'coolTop' })), -2.3, 2.65, -7.88, { cast: false, noClip: true });
  // кофе и слаш у левой стены
  dBox(0.8, 1.0, 2.6, [wood, wood, dMat('#d9d4c4', { key: 'top' }), wood, wood, wood], -6.55, 0.5, -2.0, { name: 'кофе-стойка' });
  dBox(0.45, 0.6, 0.4, dMat('#1c1512', { key: 'cm' }), -6.6, 1.3, -1.2, { name: 'кофемашина' }); dCyl(0.1, 0.12, 0.25, dMat('#2a1a10', { key: 'pot' }), -6.5, 1.125, -1.65); for (let i = 0; i < 3; i++) dCyl(0.05, 0.04, 0.14, dMat('#fbf8f0', { key: 'cup' }), -6.42, 1.07, -1.95 + i * 0.12);
  dBox(0.6, 0.5, 0.8, dark, -6.6, 1.25, -2.75, { name: 'слаш' });
  [['#ff3a6a', -3.0], ['#3ad0ff', -2.75], ['#a6ff3a', -2.5]].forEach(([c, z]) => dCyl(0.1, 0.1, 0.42, new T3.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 1.4, transparent: true, opacity: 0.88, roughness: 0.2 }), -6.6, 1.71, z, { glow: true }));
  const poster = (w, h, fn) => dTexMat(dPaint(w, h, () => { fn(w, h); ctx.strokeStyle = '#1c1512'; ctx.lineWidth = 6; ctx.strokeRect(3, 3, w - 6, h - 6); }));
  dQuad(1.0, 1.3, poster(200, 260, (w, h) => { rectP(0, 0, w, h, '#f3ecd8', { seed: 81, line: false }); rectP(0, 0, w, 60, '#7a4a2a', { seed: 82, line: false }); txt('COFFEE', 100, 32, 34, { font: 'Inter Black', col: '#fbfaf6' }); txt('99¢', 100, 130, 86, { font: 'Osw', weight: 600, col: '#c8342c' }); txt('all night', 100, 210, 34, { font: 'Hand', col: '#1c1512' }); }), -6.98, 2.3, -1.6, { ry: Math.PI / 2, noClip: true });
  dQuad(1.2, 0.8, poster(240, 160, (w, h) => { rectP(0, 0, w, h, '#fbf8f0', { seed: 84, line: false }); txt('NO SHOES', 120, 40, 34, { font: 'Inter Black', col: '#c8342c' }); txt('NO SHIRT', 120, 82, 34, { font: 'Inter Black', col: '#c8342c' }); txt('NO SERVICE', 120, 124, 34, { font: 'Inter Black', col: '#1c1512' }); }), -6.98, 2.2, -4.6, { ry: Math.PI / 2, noClip: true });
  // правая стена (зал): банкомат и плакат
  const atm = dMat('#3a3d44', { key: 'atm' }); dBox(0.6, 1.6, 0.7, [atm, dTexMat(dSign(160, 360, '#2a2c30', 'ATM', 52, '#3ad0ff', 'Inter Black', { dy: -120, fn: (w, h) => rectP(20, 140, w - 40, 90, '#2a6ad8', { seed: 60, lw: 3 }) }), { emis: 0x2a6ad8, ei: 0.5 }), atm, atm, atm, atm], 6.6, 0.8, -1.0, { name: 'банкомат' });
  dQuad(1.0, 1.3, poster(200, 260, (w, h) => { rectP(0, 0, w, h, '#f3ecd8', { seed: 81, line: false }); rectP(0, 0, w, 60, '#d8342c', { seed: 82, line: false }); txt('HOT DOGS', 100, 32, 30, { font: 'Inter Black', col: '#fbfaf6' }); txt('2 for $3', 100, 150, 38, { font: 'Hand', col: '#1c1512' }); }), 6.98, 2.4, -1.0, { ry: -Math.PI / 2, noClip: true });
  // касса: прилавок (со стороны кассира — полки), столешница, кассовый аппарат, витринка LOTTO, роллер, кнопка LOCKDOWN
  const under = dTexMat(dPaint(512, 160, (w, h) => { rectP(0, 0, w, h, '#5a4028', { seed: 40, line: false }); rectP(0, 74, w, 10, '#3a2818', { seed: 41, line: false }); const r = rng(42);
    for (let i = 0; i < 12; i++) rectP(14 + i * 41, 16 + (i % 2) * 6, 30, 52, ['#b08a5a', '#d8342c', '#3d7fc4', '#f2c230'][i % 4], { seed: 43 + i, lw: 2 }); for (let i = 0; i < 9; i++) rectP(20 + i * 54, 96, 40, 50, ['#8a8274', '#b08a5a', '#2f6a6e'][i % 3], { seed: 60 + i, lw: 2 }); }));
  dBox(3.4, 1.05, 0.8, [wood, wood, wood, wood, wood, under], 4.1, 0.525, -2.4, { name: 'прилавок' }); dBox(3.6, 0.08, 1.0, dMat('#d9d4c4', { key: 'top' }), 4.1, 1.09, -2.4, { name: 'столешница' });
  dBox(0.5, 0.3, 0.42, dark, 5.0, 1.28, -2.5, { name: 'касса' }); dBox(0.44, 0.26, 0.04, dGlow(0x3aa070, 1.0), 5.0, 1.52, -2.62, { cast: false, rx: -0.3, noClip: true });
  dBox(0.45, 0.3, 0.3, dTexMat(dSign(200, 134, '#f2c230', 'LOTTO', 50, '#c8342c')), 4.35, 1.28, -2.55, { name: 'лото' });
  dBox(0.6, 0.16, 0.36, dMat('#8e949a', { key: 'roll' }), 5.55, 1.21, -2.15); for (let i = 0; i < 3; i++) dCyl(0.035, 0.035, 0.5, dMat('#c8642c', { key: 'dog' }), 5.55, 1.31, -2.26 + i * 0.11, { rz: Math.PI / 2, noClip: true });
  const haz = dPaint(128, 128, (w, h) => { rectP(0, 0, w, h, '#f2c230', { seed: 44, line: false }); for (let i = -4; i < 8; i++) piece([[i * 32, 0], [i * 32 + 16, 0], [i * 32 + 16 + h, h], [i * 32 + h, h]], '#1c1512', { raw: true, line: false }); ctx.strokeStyle = '#1c1512'; ctx.lineWidth = 8; ctx.strokeRect(4, 4, w - 8, h - 8); });
  dBox(0.42, 0.07, 0.42, dTexMat(haz), 3.6, 1.165, -2.25, { name: 'кнопка-осн' }); ST.btn = dCyl(0.125, 0.135, 0.09, new T3.MeshStandardMaterial({ color: 0xd8342c, emissive: 0x600000, roughness: 0.35 }), 3.6, 1.245, -2.25, { noClip: true });
  dBox(0.36, 0.012, 0.11, dTexMat(dSign(256, 78, '#1c1512', 'LOCKDOWN', 44, '#fbf8f0')), 3.6, 1.136, -1.97, { cast: false, noClip: true });
  // перегородка за кассой: сигареты, тумба, дверь «только для персонала» с табличкой EXIT
  dBox(4.6, 3.6, 0.14, ST.wallIn, 4.7, 1.8, -4.07, { name: 'перегородка' });
  const cigs = dPaint(512, 256, (w, h) => { rectP(0, 0, w, h, '#3a3d42', { seed: 40, line: false }); for (let rr = 0; rr < 4; rr++) for (let q = 0; q < 10; q++) rectP(10 + q * 50, 10 + rr * 62, 42, 52, ['#d8342c', '#fbf8f0', '#2f6a6e', '#f2c230', '#2a2c30'][(q * 3 + rr) % 5], { seed: 41 + q + rr * 10, lw: 2 }); });
  dBox(2.6, 1.25, 0.24, dTexMat(cigs), 4.0, 2.05, -3.88, { name: 'сигареты' }); dBox(2.6, 0.9, 0.4, [wood, wood, dMat('#d9d4c4', { key: 'top' }), wood, wood, wood], 4.0, 0.45, -3.8, { name: 'тумба' });
  dBox(0.9, 2.1, 0.05, dMat('#5c6168', { key: 'empDoor' }), 6.3, 1.06, -3.975, { noClip: true }); dQuad(0.8, 0.2, new T3.MeshBasicMaterial({ map: dSign(256, 64, '#c8342c', 'EMPLOYEES ONLY', 26, '#fbf8f0') }), 6.3, 1.7, -3.945, { recv: false, noClip: true });
  dQuad(0.62, 0.24, new T3.MeshBasicMaterial({ map: dSign(160, 60, '#0c3a1c', 'EXIT', 40, '#6aff9a', 'Osw') }), 6.3, 2.5, -3.99, { recv: false, noClip: true, glow: true });
  // у кассы — упаковки воды; у двери — табличка «мокрый пол»; у задней стены — коробки
  for (let i = 0; i < 3; i++) for (let j = 0; j < (i > 1 ? 1 : 2); j++) dBox(0.5, 0.32, 0.36, dMat('#3d7fc4', { key: 'water', fn: (w, h) => rectP(0, h * 0.3, w, h * 0.4, '#e9edf2', { seed: 7, line: false }) }), 1.6 + j * 0.52 - (i > 1 ? -0.26 : 0), 0.172 + i * 0.32, -3.75, { name: 'вода' });
  const wet = dPaint(128, 160, () => { piece([[64, 6], [120, 154], [8, 154]], '#f2c230', { seed: 61, lw: 4 }); txt('WET', 64, 96, 28, { font: 'Inter Black', col: '#1c1512' }); txt('FLOOR', 64, 124, 22, { font: 'Inter Black', col: '#1c1512' }); });
  dBill(wet, 0.55, 0.7, -1.7, 0.36, -0.95, { cast: true, ry: 0.5 });
  [[-0.2, -7.55], [0.4, -7.5], [1.9, -7.55]].forEach(([x, z], i) => dBox(0.55, 0.45, 0.45, dMat('#b08a5a', { key: 'cbox', fn: (w, h) => stroke([[0, h / 2], [w, h / 2]], '#8a6a40', 6) }), x, 0.24, z, { ry: i * 0.15 }));
}

// ---------- жалюзи (сетка вершин — прогиб и вмятины), короб, анкерные пластины с болтами на перемычке изнутри
function stShutter() {
  const shT = dPaint(256, 256, () => { rectP(0, 0, 256, 256, '#8e949a', { seed: 66, line: false }); for (let y = 8; y < 256; y += 24) { stroke([[0, y], [256, y]], '#6c7278', 5, { smooth: false }); stroke([[0, y - 7], [256, y - 7]], '#b0b6bb', 3, { smooth: false }); } });
  shT.wrapS = shT.wrapT = T3.RepeatWrapping; shT.repeat.set(10, 3);
  const slT = dPaint(256, 256, () => { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 256, 256); ctx.fillStyle = '#fff'; for (let y = 8; y < 256; y += 24) ctx.fillRect(0, y - 1, 256, 3); }); slT.wrapS = slT.wrapT = T3.RepeatWrapping; slT.repeat.set(10, 3);   // щели между ламелями: свет снаружи (st.slits — только для планов изнутри)
  ST.shut = dQuad(14.2, 2.97, new T3.MeshStandardMaterial({ map: shT, roughness: 0.55, metalness: 0.35, side: T3.DoubleSide, emissive: 0xffffff, emissiveMap: slT, emissiveIntensity: 0 }), 0, 1.6, 0.5, { sx: 64, sy: 16, cast: true, name: 'жалюзи' }); ST.shut0 = ST.shut.geometry.attributes.position.array.slice();
  dBox(14.4, 0.34, 0.5, dMat('#5c6168', { key: 'box' }), 0, 3.25, 0.45, { name: 'короб' });
  const plateM = dMat('#8a9098', { key: 'plate', metal: 0.5, rough: 0.4, lw: 8 }), boltM = new T3.MeshStandardMaterial({ color: 0xd6dade, metalness: 0.7, roughness: 0.3 });
  ST.plates = [-5.8, -3.45, -1.6, 1.6, 3.45, 5.8].map(x => { const g = new T3.Group(); g.position.set(x, 3.3, -0.15); DIO.scene.add(g); dBox(0.56, 0.34, 0.035, plateM, 0, 0, 0, { parent: g, noClip: true });
    const b = [-0.19, 0.19].map(bx => { const m = dCyl(0.055, 0.055, 0.09, boltM, x + bx, 3.3, -0.2, { rx: Math.PI / 2, seg: 6, noClip: true }); dCyl(0.075, 0.075, 0.02, boltM, 0, 0.04, 0, { parent: m, seg: 16, noClip: true }); return m; }); return { g, b, x }; });
  const crack = dPaint(256, 256, () => { const r = rng(91); for (let k = 0; k < 5; k++) { let x = 128, y = 128; const P = [[x, y]], a0 = k * 1.26 + r(); for (let i = 0; i < 6; i++) { x += Math.cos(a0 + (r() - 0.5)) * 22; y += Math.sin(a0 + (r() - 0.5)) * 22; P.push([x, y]); } stroke(P, '#1c1512', 5 - k * 0.5, { smooth: false }); } });
  ST.cracks = [-0.19, 0.19].map(bx => dBill(crack, 0.7, 0.7, 1.6 + bx, 3.3, -0.128, { ry: Math.PI }));
  ST.spark = dHalo(0xffd890, 1.6, 3.3, -0.25, 0.9, 0);
  // силуэт за жалюзи (кто-то стоит снаружи и заслоняет свет в щелях): мягкая тень между стеклом и жалюзи, st.fig
  const fig = dPaint(256, 512, () => { ctx.filter = 'blur(7px)'; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(128, 100, 56, 62, 0, 0, 6.3); ctx.fill(); ctx.fillRect(58, 70, 150, 24);
    ctx.beginPath(); ctx.moveTo(36, 512); ctx.lineTo(50, 214); ctx.quadraticCurveTo(128, 150, 206, 214); ctx.lineTo(220, 512); ctx.closePath(); ctx.fill(); ctx.filter = 'none'; });
  ST.fig = dQuad(0.98, 1.95, new T3.MeshBasicMaterial({ map: fig, transparent: true, opacity: 0, depthWrite: false, fog: false, side: T3.DoubleSide }), 0, SWK + 0.975, 0.27, { recv: false, noClip: true }); ST.fig.visible = false;
}

// ---------- навес: панели света, столбы, колонки на островках, столб с ценой
function stCanopy() {
  dBox(16, 0.5, 9, dMat('#e7e3d6', { key: 'canopy', rep: [4, 2] }), 0, 5.1, 6.5, { name: 'навес' });
  dBox(16.1, 0.3, 9.1, dMat('#c8342c', { key: 'canBand', fn: (w, h) => rectP(0, h * 0.4, w, h * 0.2, '#fbf8f0', { seed: 4, line: false }) }), 0, 4.75, 6.5, { name: 'навес-кайма' });
  ST.canLamps = []; for (let x = -6; x <= 6; x += 3) for (const z of [4.5, 8.5]) ST.canLamps.push(dBox(1.4, 0.05, 0.45, dGlow(0xfff2d0, 2.5), x, 4.57, z, { cast: false, glow: true }));
  [-5, 5].forEach(x => dBox(0.45, 4.6, 0.45, dMat('#d9d4c4', { key: 'pillar', fn: (w, h) => { for (let y = 0; y < h; y += 40) rectP(0, y, w, 16, '#c8342c', { seed: y, line: false }); } }), x, 2.3, 6.5, { name: 'столб' }));
  [[-2.5, '3'], [2.5, '4']].forEach(([x, n]) => { const side = dMat('#c8342c', { key: 'pump' }), face = dTexMat(dSign(160, 280, '#c8342c', n, 110, '#7dffb0', 'Osw', { dy: 40, fn: (w, h) => { rectP(0, 0, w, 50, '#f3ecd8', { seed: 3, line: false }); rectP(20, 70, w - 40, 80, '#10161e', { seed: 2, lw: 3 }); } }), { emis: 0x103010, ei: 0.4 });
    dBox(1.8, 0.2, 1.2, dMat('#9a968c', { key: 'island' }), x, 0.1, 6.5, { name: 'островок' }); dBox(1.0, 1.75, 0.6, [side, side, side, side, face, face], x, 1.075, 6.5, { name: 'колонка' }); dBox(1.1, 0.12, 0.7, dMat('#f3ecd8', { key: 'pumpTop' }), x, 2.01, 6.5, { noClip: true });
    dTube([[x + 0.5, 1.5, 6.5], [x + 0.8, 1.2, 6.45], [x + 0.78, 0.6, 6.4], [x + 0.56, 0.95, 6.35]], 0.035, dMat('#1c1512', { key: 'hose' }), { noClip: true });
    [[x - 0.75, 6.95], [x + 0.75, 6.95], [x - 0.75, 6.05], [x + 0.75, 6.05]].forEach(([bx, bz]) => dCyl(0.07, 0.07, 0.7, dMat('#f2c230', { key: 'bollard' }), bx, 0.55, bz, { noClip: true })); });
  dBox(0.3, 7, 0.3, dMat('#2a2e36', { key: 'signPole' }), 9.5, 3.5, 12.5, { name: 'столб-цена' });
  dQuad(3.0, 2.3, dTexMat(dPaint(300, 230, () => { rectP(0, 0, 300, 230, '#f3ecd8', { seed: 69, line: false }); rectP(0, 0, 300, 70, '#c8342c', { seed: 70, line: false }); txt('GAS', 150, 38, 48, { font: 'Inter Black', col: '#fbfaf6' }); rectP(30, 90, 240, 110, '#10161e', { seed: 71, lw: 3 }); txt('3.49', 150, 146, 78, { font: 'Osw', weight: 600, col: '#ff4a3a' }); ctx.strokeStyle = '#1c1512'; ctx.lineWidth = 6; ctx.strokeRect(3, 3, 294, 224); }), { emis: 0xffffff, ei: 0.45 }), 9.5, 7.1, 12.67, { noClip: true });
}

// ---------- машина: кузов, кабина, стёкла, колёса с колпаками, бамперы, фары (мигают при сигнализации)
function stCar(x, z, ry) {
  const g = ST.car = new T3.Group(); g.position.set(x, 0, z); g.rotation.y = ry; DIO.scene.add(g); const O = { parent: g };
  const body = dMat('#8fb0d4', { key: 'carBody', lw: 7 }), dark = dMat('#1c1d22', { key: 'carDark' }), gl = new T3.MeshStandardMaterial({ color: 0x18263e, roughness: 0.12, metalness: 0.5, emissive: 0x0a1424 }), chrome = new T3.MeshStandardMaterial({ color: 0xc9cfd4, metalness: 0.7, roughness: 0.3 });
  dBox(1.85, 0.55, 4.3, body, 0, 0.64, 0, { ...O, name: 'машина' }); dBox(1.66, 0.52, 2.2, body, 0, 1.17, -0.3, { ...O, name: 'кабина' });
  dBox(1.5, 0.36, 0.04, gl, 0, 1.17, 0.815, { ...O, noClip: true }); dBox(1.5, 0.36, 0.04, gl, 0, 1.17, -1.415, { ...O, noClip: true }); [-0.84, 0.84].forEach(sx => dBox(0.04, 0.34, 1.8, gl, sx, 1.18, -0.3, { ...O, noClip: true }));
  [[-0.93, 1.38], [0.93, 1.38], [-0.93, -1.38], [0.93, -1.38]].forEach(([wx, wz]) => { dCyl(0.37, 0.37, 0.26, dark, wx, 0.37, wz, { ...O, rz: Math.PI / 2, noClip: true }); dCyl(0.19, 0.19, 0.28, chrome, wx, 0.37, wz, { ...O, rz: Math.PI / 2, seg: 12, noClip: true }); });
  [2.2, -2.2].forEach(bz => dBox(1.9, 0.16, 0.14, chrome, 0, 0.44, bz, { ...O, noClip: true }));
  dBox(0.5, 0.16, 0.03, dTexMat(dSign(128, 40, '#fbf8f0', 'HWY 40', 26, '#1c1512')), 0, 0.5, 2.28, { ...O, cast: false, noClip: true });
  const L = (col, em, lx, ly, lz, w = 0.36) => dBox(w, 0.16, 0.05, new T3.MeshStandardMaterial({ color: col, emissive: em, emissiveIntensity: 0.15 }), lx, ly, lz, { ...O, cast: false, glow: true });
  ST.carLights = [L(0xfff2c0, 0xffe090, -0.62, 0.74, 2.17), L(0xfff2c0, 0xffe090, 0.62, 0.74, 2.17), L(0xff3020, 0xff2010, -0.65, 0.74, -2.17), L(0xff3020, 0xff2010, 0.65, 0.74, -2.17), L(0xffa020, 0xff9010, -0.86, 0.58, 2.17, 0.14), L(0xffa020, 0xff9010, 0.86, 0.58, 2.17, 0.14)];
  ST.carHalo = [dHalo(0xffd070, x - 0.1, 0.8, z + 2.4, 3.2, 0), dRefl(0xffc060, x + 0.3, z + 4.2, 2.6, 4.5, 0)];
}

// ---------- дождь, толпа (40 фигур, кэш поз), герои
function stActors() {
  const N = 2600, pos = new Float32Array(N * 6), rr = rng(71); ST.rain0 = []; for (let i = 0; i < N; i++) ST.rain0.push([rr() * 50 - 25, rr() * 12, rr() * 40 - 10, 0.6 + rr() * 0.4]);
  const rg = new T3.BufferGeometry(); rg.setAttribute('position', new T3.BufferAttribute(pos, 3)); ST.rain = new T3.LineSegments(rg, new T3.LineBasicMaterial({ color: 0xaac4f0, transparent: true, opacity: 0.45 })); DIO.scene.add(ST.rain);
  const pose = (back, pound, walk) => dPoses(24, i => { const v = Math.floor(i / 8), f = i % 8; zMini(256, 660 - 380 * 1.32, 1.32, f * 0.125, 4 + v * 5, { back, pound, walk, dim: 0 }); });
  ST.poses = { pound: pose(true, true, false), walkBack: pose(true, false, true), walkFront: pose(false, false, true) };
  ST.crowd = Array.from({ length: 40 }, (_, k) => { const q = rng(600 + k), c = dCrowdCard(1.9 + q() * 0.3), row = k < 14 ? 0 : k < 28 ? 1 : 2, i = k - row * 14, n = row < 2 ? 14 : 12;
    c.home = [-3.6 + (i + 0.5 + (q() - 0.5) * 0.5) * 7.6 / n + (row % 2) * 0.25, 1.15 + row * 0.82 + q() * 0.22]; c.v = k % 3; c.ph = Math.floor(q() * 8);
    const want = c.home[0] * 1.5 + (q() - 0.5) * 2; c.lane = LANES.reduce((a, b) => Math.abs(b - want) < Math.abs(a - want) ? b : a) + (q() - 0.5) * 0.3; c.far = [clamp(c.lane * 1.4 + (q() - 0.5) * 5, -8.6, 20), 14 + q() * 8]; c.lag = q(); return c; });
  ST.joe = dCard(2.05, 1); ST.z1 = dCard(2.05, 1);
}
function stPath(c, q) {                                                  // q: 0 — у жалюзи … 1 — далеко на стоянке; путь идёт через свободный коридор между колонками
  const [hx, hz] = c.home; if (q < 0.42) { const k = q / 0.42; return [lerp(hx, c.lane, sm(k)), lerp(hz, 6.5, k)]; }
  const k = (q - 0.42) / 0.58; return [lerp(c.lane, c.far[0], k), lerp(6.5, c.far[1], k)];
}

// ---------- неон, ореолы, лучи, отражения на мокром асфальте
function dGlowTex() { return ST.glowTex || (ST.glowTex = dPaint(128, 128, () => { const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,0.45)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128); })); }
function dHalo(col, x, y, z, s, a = 0.8) { const sp = new T3.Sprite(new T3.SpriteMaterial({ map: dGlowTex(), color: col, blending: T3.AdditiveBlending, transparent: true, depthWrite: false, opacity: a })); sp.position.set(x, y, z); sp.scale.set(s, s, 1); sp.userData.glow = true; DIO.scene.add(sp); return sp; }
function dNeonTex(text, col, w = 512, h = 160, size = 96) { return dPaint(w, h, () => { ctx.clearRect(0, 0, w, h); ctx.font = `600 ${size}px 'Osw'`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowColor = col;
  for (const [b, a] of [[40, 0.9], [18, 1], [6, 1]]) { ctx.shadowBlur = b; ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillText(text, w / 2, h / 2); } ctx.shadowBlur = 0; ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.85; ctx.fillText(text, w / 2, h / 2); }); }
function dRefl(col, x, z, w, l, a) { const q = new T3.Mesh(new T3.PlaneGeometry(w, l), new T3.MeshBasicMaterial({ map: dGlowTex(), color: col, blending: T3.AdditiveBlending, transparent: true, depthWrite: false, opacity: a })); q.rotation.x = -Math.PI / 2; q.position.set(x, 0.02, z); q.userData.noClip = true; DIO.scene.add(q); return q; }
function dNeon(text, col, x, y, z, w, o = {}) { const q = dQuad(w, w * 160 / 512, new T3.MeshBasicMaterial({ map: dNeonTex(text, col, 512, 160, o.size || 96), transparent: true, depthWrite: false, blending: T3.AdditiveBlending, side: T3.DoubleSide, fog: o.fog ?? true }), x, y, z, { ry: o.ry, recv: false, glow: true, noClip: true });
  return [q, dHalo(col, x, y, z + (o.hz ?? 0.05), w * 1.5, o.halo ?? 0.3), ...(o.refl === false ? [] : [dRefl(col, x, z + (o.rz ?? 1.9), w * 0.7, o.rl ?? 2.6, o.ra ?? 0.3)])]; }
function dCone(col, x, y, z, r, h, a = 0.09) { const tx = ST.coneTex || (ST.coneTex = dPaint(64, 256, () => { const g = ctx.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(0,0,0,1)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 256); }));
  const c = new T3.Mesh(new T3.ConeGeometry(r, h, 28, 1, true), new T3.MeshBasicMaterial({ map: tx, color: col, blending: T3.AdditiveBlending, transparent: true, depthWrite: false, opacity: a, side: T3.DoubleSide })); c.position.set(x, y - h / 2, z); c.userData.noClip = true; DIO.scene.add(c); return c; }
function stNeon() {
  const N = ST.nx = { store: [], night: [], cones: [] }, cyan = 0x38e8ff, pink = 0xff3fa0, gold = 0xffc840;
  [[0, 4.6, 2.0, 16.2, 0], [0, 4.6, 11.0, 16.2, 0], [-8.05, 4.6, 6.5, 9, Math.PI / 2], [8.05, 4.6, 6.5, 9, Math.PI / 2]].forEach(([x, y, z, l, ry]) => N.night.push(dBox(l, 0.06, 0.06, dGlow(cyan, 3.2), x, y, z, { cast: false, ry, glow: true })));
  N.store.push(dBox(14.3, 0.06, 0.06, dGlow(pink, 3.0), 0, 3.68, 0.17, { cast: false, glow: true }));
  [['BEER', 0x3fa8ff, -5.8, 2.2], ['LOTTO', gold, -3.45, 2.2], ['OPEN 24/7', 0xff4a6a, 3.45, 2.2]].forEach(([s, c, x, y]) => N.store.push(...dNeon(s, HEX(c), x, y, -0.07, s.length > 6 ? 2.0 : 1.5, { size: s.length > 6 ? 80 : 96 })));
  [[-6.6, 0xc8242c], [-5.65, 0x2a6ad8]].forEach(([x, c]) => N.night.push(dHalo(c, x, 1.3, 1.6, 2.0, 0.3)));
  const lampHead = dMat('#2a2e36', { key: 'lampHead' });
  [[-12, 14.2], [12, 14.2], [30, 14.2], [-30, 14.2]].forEach(([x, z]) => { dCyl(0.1, 0.12, 6.5, dMat('#4a4e56', { key: 'lampPole' }), x, 3.25, z, { name: 'фонарь' }); dBox(1.2, 0.18, 0.4, lampHead, x + 0.5, 6.5, z, { noClip: true }); dBox(0.9, 0.04, 0.3, dGlow(0xffb060, 3), x + 0.5, 6.4, z, { cast: false, glow: true });
    const l = new T3.PointLight(0xffa040, 70, 18, 1.5); l.position.set(x + 0.5, 6.2, z); DIO.scene.add(l); N.night.push(dHalo(0xffa040, x + 0.5, 6.35, z, 3.0, 0.5), dCone(0xffa040, x + 0.5, 6.35, z, 2.6, 6.3, 0.07), dRefl(0xffa040, x + 0.5, z + 2.5, 2.4, 5, 0.2), l); });
  dCyl(0.18, 0.22, 7, dMat('#3a3d44', { key: 'mPole' }), -16, 3.5, 31); N.night.push(...dNeon('MOTEL', '#ff4fb0', -16, 7.6, 31.2, 3.6, { refl: false, halo: 0.4, fog: false, size: 110, ry: Math.PI }), ...dNeon('VACANCY', '#40f0ff', -16, 6.3, 31.2, 2.8, { refl: false, halo: 0.35, fog: false, size: 100, ry: Math.PI }));
  dCyl(0.15, 0.18, 4.6, dMat('#3a3d44', { key: 'mPole' }), 17, 2.3, 33.2); N.night.push(...dNeon('EAT', '#ffd040', 17, 5.2, 33, 3.2, { refl: false, halo: 0.45, fog: false, ry: Math.PI }));
  ST.traffic = dHalo(0xffb000, 22, 5.2, 17, 1.4, 0.9); dBox(0.4, 1.0, 0.35, dMat('#1c1d22', { key: 'tl' }), 22, 5.2, 17.15, { noClip: true }); dTube([[14, 6.2, 17], [22, 5.8, 17], [30, 6.2, 17]], 0.03, new T3.MeshBasicMaterial({ color: 0x0c0c12 }), { cast: false, noClip: true });
  for (let x = -6; x <= 6; x += 3) for (const z of [4.5, 8.5]) N.cones.push(dCone(0xfff0d0, x, 4.55, z, 1.3, 4.5, 0.05));
  N.store.push(...dNeon('ICE COLD', '#5ad8ff', -2.3, 3.15, -7.8, 2.6, { refl: false, halo: 0.25, size: 84 }));
  ST.inPink = new T3.PointLight(0xff3fa0, 5, 6, 1.6); ST.inPink.position.set(3.45, 2.2, -0.7); ST.cyanL = new T3.PointLight(0x38e8ff, 10, 14, 1.6); ST.cyanL.position.set(0, 4.3, 6.5); DIO.scene.add(ST.inPink, ST.cyanL); N.store.push(ST.inPink); N.night.push(ST.cyanL);
  const n = 360, pp = new Float32Array(n * 3), rr = rng(81); ST.dust0 = []; for (let i = 0; i < n; i++) ST.dust0.push([rr() * 13 - 6.5, rr() * 3.3, -rr() * 7.6, rr()]);
  const dg = new T3.BufferGeometry(); dg.setAttribute('position', new T3.BufferAttribute(pp, 3)); ST.dust = new T3.Points(dg, new T3.PointsMaterial({ color: 0xfff2d8, size: 0.025, transparent: true, opacity: 0.55, depthWrite: false, blending: T3.AdditiveBlending })); DIO.scene.add(ST.dust);
}

// ---------- состояние кадра
function stClock(s) { if (s === ST.clockS) return; ST.clockS = s; const prev = ctx, pS = S, pSS = SS.splice(0); ctx = ST.clockC.getContext('2d'); S = 1; ctx.setTransform(1, 0, 0, 1, 0, 0);
  try { ctx.fillStyle = '#140c0c'; ctx.fillRect(0, 0, 256, 110); txt(s, 128, 58, 82, { font: 'Osw', weight: 600, col: '#ff4a3a' }); } finally { ctx = prev; S = pS; SS.push(...pSS); } ST.clockT.needsUpdate = true; }
function stRain(t, a) { ST.rain.visible = a > 0; if (!a) return; ST.rain.material.opacity = 0.45 * a; const p = ST.rain.geometry.attributes.position.array;
  ST.rain0.forEach(([x, y, z, v], i) => { const yy = ((y - t * 9 * v) % 12 + 12) % 12, xx = x - (12 - yy) * 0.12; p.set([xx, yy, z, xx + 0.04, yy + 0.35, z], i * 6); }); ST.rain.geometry.attributes.position.needsUpdate = true; }
function stShutter2(k, bulge, t, dents, knock) {                        // k — опущены (0…1); bulge ≤ 0.7 — прогиб внутрь; dents — вмятины от ударов толпы; knock [x, y, сила] — один удар
  ST.shut.scale.y = Math.max(0.001, k); ST.shut.position.y = 3.05 - 2.97 * k / 2; const p = ST.shut.geometry.attributes.position, a = p.array, b = ST.shut0;
  for (let i = 0; i < a.length; i += 3) { const x = b[i], y = b[i + 1]; let dz = 0;
    if (bulge) dz -= bulge * 0.42 * Math.max(0, Math.cos(x / 7.1 * Math.PI / 2)) * Math.max(0, Math.cos(y / 1.49 * Math.PI / 2)) * (1 + 0.05 * Math.sin(t * 30 + x));
    if (dents) for (let j = 0; j < 9; j++) { const r = rng(300 + j), cx = -3.4 + r() * 7.2, cy = -1.1 + r() * 2.0, w = 0.35 + r() * 0.3, d2 = ((x - cx) ** 2 + (y - cy) ** 2) / (w * w); if (d2 < 1) dz -= dents * 0.1 * (1 - d2) * (0.6 + 0.4 * Math.max(0, Math.sin(t * (5 + j) + j * 2))); }
    if (knock) { const d2 = ((x - knock[0]) ** 2 + (y - knock[1]) ** 2) / 0.36; if (d2 < 1) dz -= knock[2] * 0.2 * (1 - d2) ** 2; }
    a[i + 2] = b[i + 2] + dz; }
  p.needsUpdate = true; ST.shut.geometry.computeVertexNormals();
}
/* stSet(t, {sky, lit, lampsOn, flick, alarm, neon, canopy, exit, door, shut, bulge, dents, knock, btnDown, car, shafts, shaftX, shaftCol, pop, rain, clock,
            crowd: 'pound' | 'gather' | 'leave', crowdK, crowdN}) */
function stSet(t, st = {}) {
  const sky = st.sky || 'night', dark = sky !== 'day';
  DIO.scene.background = ST.sky[sky]; DIO.scene.fog.color.setHex(ST.fogCol[sky]); DIO.scene.fog.density = st.fogD ?? { night: 0.02, dawn: 0.014, day: 0.01, dusk: 0.014 }[sky];
  const SUN = { night: [0x9fb4ff, 0.6, -20, 30, 25], dawn: [0xffc08a, 1.5, 32, 9, 36], day: [0xfff4e0, 1.7, 18, 30, 28], dusk: [0xff9a70, 1.1, -34, 9, 34] }[sky];
  ST.sun.color.setHex(SUN[0]); ST.sun.intensity = SUN[1]; ST.sun.position.set(SUN[2], SUN[3], SUN[4]); ST.hemi.intensity = { night: 0.7, dawn: 1.0, day: 1.5, dusk: 0.95 }[sky]; ST.dayFill.intensity = { night: 0, dawn: 18, day: 34, dusk: 14 }[sky];
  ST.moon.visible = sky === 'night'; ST.clouds.forEach(c => c.visible = sky !== 'day');
  const on = st.lampsOn ?? 5, fl = st.flick ? (hsh(Math.floor(t * 9)) % 4 === 0 ? 0.35 : 1) : 1, lit = (st.lit ?? 1) * on / 5 * fl, al = st.alarm ?? 0;
  ST.spot.intensity = 34 * lit; ST.fill.intensity = 16 * lit; ST.fill2.intensity = 10 * lit; ST.win.intensity = 12 * lit * (1 - (st.shut ?? 0));
  ST.lamps.forEach((l, i) => { const k = i < on ? (st.lit ?? 1) * fl : 0; l.material.emissiveIntensity = 0.03 + 2.2 * k; l.userData.glow = k > 0.15; });
  ST.coolM.emissiveIntensity = 0.2 + 0.4 * Math.min(1, lit + 0.2); ST.cool.intensity = 5 * (1 - Math.min(1, lit));
  ST.alarm.intensity = al * 26 * (0.55 + 0.45 * Math.sin(t * Math.PI * 1.4)); ST.exitL.intensity = (st.exit ?? 0.6) * 7; ST.dark.intensity = clamp((0.4 - lit) / 0.4) * 9;
  const neon = st.neon ?? true, cnp = st.canopy ?? 1, nf = neon && hsh(Math.floor(t * 14), 3) % 29 === 0 ? 0 : 1;
  ST.nx.store.forEach(o => { o.visible = neon && nf > 0; }); ST.nx.night.forEach(o => { o.visible = dark; });
  ST.can.forEach(l => l.intensity = cnp * 40); ST.canLamps.forEach(l => { l.material.emissiveIntensity = 0.05 + 2.5 * cnp; l.userData.glow = cnp > 0.15; });
  ST.nx.cones.forEach(c => { c.visible = dark && cnp > 0.4; c.material.opacity = 0.05 * cnp; }); ST.traffic.material.opacity = dark && Math.floor(t * 1.4) % 2 ? 0.9 : 0.05;
  ST.door.position.x = 1.85 * sm(st.door ?? 0); stShutter2(st.shut ?? 0, Math.min(0.7, st.bulge ?? 0), t, st.dents ?? 0, st.knock); ST.shut.material.emissive.setHex(st.slitCol ?? 0xffc890); ST.shut.material.emissiveIntensity = (st.slits ?? 0) * 1.8; ST.fig.visible = (st.fig ?? 0) > 0.01; ST.fig.material.opacity = 0.66 * (st.fig ?? 0); ST.btn.position.y = st.btnDown ? 1.215 : 1.245; stClock(st.clock || '3:07');
  const ca = st.car ? (Math.floor(t * 3.2) % 2 ? 1 : 0.06) : 0; ST.carLights.forEach(m => m.material.emissiveIntensity = 0.15 + 2.0 * ca); ST.carL.intensity = ca * 12; ST.carHalo[0].material.opacity = 0.45 * ca; ST.carHalo[1].material.opacity = 0.25 * ca;
  const sh = st.shafts ?? 0; ST.shaft.intensity = sh * 60; if (sh) { const sx = st.shaftX ?? 1; ST.shaft.color.setHex(st.shaftCol ?? 0xffd8a0); ST.shaft.position.set(sx, 2.7, -0.25); ST.shaft.target.position.set(sx + (st.shaftTX ?? 1.6), 0.4, -3.6); ST.shaft.target.updateMatrixWorld(); }
  // анкерная пластина с двумя болтами (x = 1.6): pop = [t1, t2] — болты вылетают по очереди, пластина повисает и падает
  const P = ST.plates[3], [p1, p2] = st.pop || [1e9, 1e9], u1 = t - p1, u2 = t - p2, jit = (st.bulge ?? 0) * 0.004 * Math.sin(t * 47);
  P.g.position.set(P.x, 3.3 + jit - (u2 > 0 ? 4.9 * u2 * u2 : 0), -0.15 - (u2 > 0 ? u2 * 0.5 : 0)); P.g.rotation.z = (u1 > 0 ? -0.16 * (1 - Math.exp(-9 * u1)) + 0.02 * Math.sin(t * 40) * Math.exp(-4 * u1) : 0) - (u2 > 0 ? u2 * 3.2 : 0);
  P.b.forEach((b, i) => { const u = i ? u2 : u1, bx = P.x + (i ? 0.19 : -0.19); if (u <= 0) { b.position.set(bx, 3.3 + jit, -0.2); b.rotation.set(Math.PI / 2, 0, 0); } else { b.position.set(bx + u * (i ? 0.9 : 0.5), 3.3 + u * 1.2 - 4.9 * u * u, -0.2 - u * 3.4); b.rotation.set(Math.PI / 2 + u * 17, u * 11, 0); } b.visible = u < 1.2; });
  ST.cracks.forEach((c, i) => { const u = i ? u2 : u1; c.visible = u > 0; c.scale.setScalar(u > 0 ? 0.5 + 0.5 * Math.min(1, u * 8) : 0.01); });
  const sp = Math.max(u1 > 0 && u1 < 0.14 ? 1 - u1 / 0.14 : 0, u2 > 0 && u2 < 0.14 ? 1 - u2 / 0.14 : 0); ST.spark.material.opacity = sp; ST.spark.position.x = P.x + (u2 > 0 ? 0.19 : -0.19);
  stRain(t, st.rain ?? 1);
  const p = ST.dust.geometry.attributes.position.array; ST.dust0.forEach(([x, y, z, v], i) => { p[i * 3] = x + Math.sin(t * 0.3 + v * 9) * 0.3; p[i * 3 + 1] = (y + t * 0.05 * (v - 0.5) + 3.3) % 3.3; p[i * 3 + 2] = z + Math.cos(t * 0.25 + v * 7) * 0.3; });
  ST.dust.geometry.attributes.position.needsUpdate = true; ST.dust.material.opacity = 0.2 + 0.45 * Math.max(Math.min(1, lit), sh);
  // толпа
  const cr = st.crowd, ck = st.crowdK ?? 1, n = st.crowdN ?? 40;
  ST.crowd.forEach((c, k) => { const vis = !!cr && k < n; c.q.visible = vis; if (!vis) return; const fr = (Math.floor(t * 8) + c.ph) % 8; let q = 0, set = 'pound';
    if (cr === 'gather') { q = 1 - clamp(ck * 1.35 - c.lag * 0.35); set = q > 0.001 ? 'walkFront' : 'pound'; }
    if (cr === 'leave') { q = clamp(ck * 1.4 - c.lag * 0.4); set = q > 0.001 ? 'walkBack' : 'pound'; }
    const [x, z] = q > 0 ? stPath(c, q) : c.home; c.q.position.set(x, (z < 1.75 ? SWK : 0) + c.hM * (660 / 740 - 0.5), z); c.fr = c.v * 8 + fr;
    if (set === 'pound') { c.mv = null; c.pose = 'pound'; } else { const [x2, z2] = stPath(c, clamp(q + (cr === 'leave' ? 0.02 : -0.02))); c.mv = [x2 - x, z2 - z]; c.pose = st.crowdPose || null; } });
}
function stFace() { const c = DIO.cam.position; [...DIO.cards, ...DIO.crowd].forEach(d => { const q = d.q; if (!q.visible) return; q.rotation.set(0, Math.atan2(c.x - q.position.x, c.z - q.position.z), 0);
  if (d.fr != null) d.set(ST.poses[d.pose || (d.mv[0] * (c.x - q.position.x) + d.mv[1] * (c.z - q.position.z) > 0 ? 'walkFront' : 'walkBack')][d.fr]); }); }   // идущий к камере — лицом, от камеры — спиной
