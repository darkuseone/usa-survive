/* 3D-диорама заправки эп. 1 (для шортсов и пролётов): улица, навес, колонки, машина, трасса, лес; магазин изнутри — стеллажи, холодильники,
   касса, кнопка LOCKDOWN, жалюзи (прогибаются, вмятины, болты), свет по времени суток. Магазин x −7…7, z −8…0 (витрина на z=0), навес z 2…11.
   stBuild() — один раз; stSet(t, st) — состояние кадра: {sky: 'night'|'dawn'|'day'|'dusk', lit, alarm, neon, shut, bulge, door, car, shafts, exit, rain, crowd, bolts}. */
const ST = {};
function stBuild() {
  const D = dSetup({ fov: 55, exposure: 1.0, fog: 0x1b2340, fogD: 0.022 }), S3 = D.scene;
  // ---- небо (фон кадра) по времени суток
  const sky = (top, mid, bot, stars, sun) => { const tx = dPaint(256, 512, (w, h) => { const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, top); g.addColorStop(0.6, mid); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    const r = rng(7); for (let i = 0; i < stars; i++) dot(r() * w, r() * h * 0.55, 0.6 + r() * 1.2, '#dfe6ff', 0.4 + r() * 0.5); if (sun) radial(w * 0.7, h * 0.66, 120, sun, 0.9); }); return tx; };
  ST.sky = { night: sky('#070b1c', '#18224a', '#2b2f52', 90), dawn: sky('#26305a', '#b0607a', '#f2a65a', 10, 'rgba(255,220,150,1)'), day: sky('#7f9cc8', '#a9bfd8', '#d8d6c8', 0), dusk: sky('#141a3a', '#4a3a6a', '#a05a5a', 30) };
  ST.fogCol = { night: 0x1b2340, dawn: 0x6a5a6a, day: 0x9aa6b4, dusk: 0x3a3048 };
  // ---- свет
  ST.hemi = new T3.HemisphereLight(0x9aa8e0, 0x3a2a30, 0.7); S3.add(ST.hemi);
  ST.sun = new T3.DirectionalLight(0x9fb4ff, 0.6); ST.sun.position.set(-20, 30, 25); ST.sun.castShadow = true; ST.sun.shadow.mapSize.set(1024, 1024);
  Object.assign(ST.sun.shadow.camera, { left: -24, right: 24, top: 24, bottom: -24, near: 1, far: 100 }); ST.sun.shadow.bias = -0.0008; S3.add(ST.sun);
  ST.spot = new T3.SpotLight(0xfff2dc, 34, 18, 1.1, 0.6, 1.2); ST.spot.position.set(0.5, 3.4, -3.4); ST.spot.target.position.set(1.5, 0, -2.6); ST.spot.castShadow = true; ST.spot.shadow.mapSize.set(1024, 1024); ST.spot.shadow.bias = -0.0006; S3.add(ST.spot, ST.spot.target);
  ST.fill = new T3.PointLight(0xfff0d8, 16, 16, 1.4); ST.fill.position.set(-3, 3.2, -4.5); ST.fill2 = new T3.PointLight(0xffe6c8, 10, 12, 1.4); ST.fill2.position.set(2.8, 3.2, -1.4); S3.add(ST.fill, ST.fill2);
  ST.can = [-3.5, 3.5].map(x => { const l = new T3.PointLight(0xffe8c0, 40, 18, 1.6); l.position.set(x, 4.6, 6.5); S3.add(l); return l; });
  ST.win = new T3.PointLight(0xfff2d0, 12, 10, 1.6); ST.win.position.set(0, 2, -0.8); S3.add(ST.win);
  ST.alarm = new T3.PointLight(0xff3020, 0, 16, 1.4); ST.alarm.position.set(0, 3.2, -2); S3.add(ST.alarm);
  ST.neon = new T3.PointLight(0xff4a7a, 6, 6, 1.6); ST.neon.position.set(4.6, 2.4, 0.6); S3.add(ST.neon);
  ST.exitL = new T3.PointLight(0x40ff80, 0, 7, 1.5); ST.exitL.position.set(5.5, 2.9, -7.3); S3.add(ST.exitL);
  ST.dark = new T3.PointLight(0x5a78c0, 0, 14, 1.2); ST.dark.position.set(2.5, 2.8, -3.0); S3.add(ST.dark);                // ночная подсветка: «нет темноты в ноль»
  ST.carL = new T3.PointLight(0xffb030, 0, 9, 1.6); ST.carL.position.set(-5.2, 0.9, 6.3); S3.add(ST.carL);
  const cookie = dPaint(256, 256, (w, h) => { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h); for (let x = 8; x < w; x += 26) { ctx.fillStyle = '#fff'; ctx.fillRect(x, 0, 9, h); } });   // полосы света сквозь щели жалюзи
  ST.shaft = new T3.SpotLight(0xffd8a0, 0, 16, 0.75, 0.25, 1.0); ST.shaft.map = cookie; ST.shaft.position.set(0.5, 2.6, 0.6); ST.shaft.target.position.set(2.5, 0, -4); ST.shaft.castShadow = false; S3.add(ST.shaft, ST.shaft.target);

  // ---- земля: асфальт с пятнами и разметкой парковки, лужи, тротуар, трасса
  const asph = dPaper('#2b2f38', { key: 'asph', w: 512, h: 512, rep: [12, 12], edge: false, fibers: 400, fn: (w, h) => { const r = rng(21); for (let i = 0; i < 14; i++) ellP(r() * w, r() * h, 20 + r() * 50, 10 + r() * 30, 'rgba(15,16,22,0.35)', { raw: true, line: false, tex: false });
    for (let i = 0; i < 6; i++) stroke([[r() * w, r() * h], [r() * w, r() * h], [r() * w, r() * h]], 'rgba(10,10,14,0.5)', 2); } });
  dQuad(160, 160, new T3.MeshStandardMaterial({ map: asph, roughness: 0.62 }), 0, 0, 0, { rx: -Math.PI / 2 });
  const puddle = new T3.MeshStandardMaterial({ color: 0x0c1020, roughness: 0.08, metalness: 0.6, transparent: true, opacity: 0.75 });
  [[-3, 4.2, 1.6, 0.8], [3.8, 8.4, 2.2, 1.0], [-6.5, 9.5, 1.4, 0.6], [1.2, 12.5, 2.6, 1.1], [7, 3.5, 1.2, 0.5]].forEach(([x, z, a, b]) => { const e = new T3.Mesh(new T3.CircleGeometry(1, 28), puddle); e.scale.set(a, b, 1); dAdd(e, x, 0.012, z, { rx: -Math.PI / 2, cast: false }); });
  for (let x = -7; x <= 7; x += 2.8) dQuad(0.12, 4, dGlow(0xd9d4c4, 0.15), x, 0.013, 12.8, { rx: -Math.PI / 2 });           // разметка стоянки
  dBox(16, 0.18, 1.6, dMat('#8d8a82', { key: 'walk', rep: [8, 1] }), 0, 0.09, 0.95);                                      // тротуар
  dQuad(160, 7, new T3.MeshStandardMaterial({ map: dPaper('#25282f', { key: 'road', rep: [30, 2], edge: false }), roughness: 0.5 }), 0, 0.011, 18.5, { rx: -Math.PI / 2 });
  for (let i = -15; i <= 15; i++) dQuad(1.8, 0.16, dGlow(0xe3c64a, 0.2), i * 4, 0.014, 18.5, { rx: -Math.PI / 2 });
  [15.15, 21.85].forEach(z => dQuad(160, 0.12, dGlow(0xd9d4c4, 0.15), 0, 0.014, z, { rx: -Math.PI / 2 }));
  for (let x = -30; x <= 30; x += 3) { dBox(0.14, 0.7, 0.14, dMat('#7a7e86', { key: 'post' }), x, 0.35, 23); } dBox(64, 0.25, 0.08, dMat('#a8acb2', { key: 'rail' }), 0, 0.62, 22.95);
  // столбы с проводами, лес, холмы, луна, облака — вырезанные силуэты
  for (let i = 0; i < 4; i++) { const x = -24 + i * 16; dCyl(0.12, 0.16, 9, dMat('#3a2e26', { key: 'pole' }), x, 4.5, 26); dBox(2.4, 0.14, 0.14, dMat('#3a2e26', { key: 'pole' }), x, 8.4, 26); }
  [8.3, 8.0].forEach(y => dTube([[-24, y, 26], [-16, y - 0.6, 26], [-8, y, 26], [0, y - 0.6, 26], [8, y, 26], [16, y - 0.6, 26], [24, y, 26]], 0.025, new T3.MeshBasicMaterial({ color: 0x0c0c12 }), { cast: false }));
  const pine = dPaint(256, 512, (w, h) => { piece(spline([[128, 10], [190, 160], [160, 160], [220, 300], [180, 300], [244, 450], [12, 450], [76, 300], [36, 300], [96, 160], [66, 160]], true, 4), '#141e1c', { seed: 31, lw: 4 }); rectP(112, 440, 32, 72, '#1c1512', { seed: 32, line: false }); });
  const r = rng(33); for (let i = 0; i < 30; i++) { const x = -40 + i * 2.8 + r() * 2, z = 30 + r() * 12, s = 5 + r() * 4; dBill(pine, s * 0.5, s, x, s / 2, z, { basic: true }); }
  for (let i = 0; i < 10; i++) { const x = -26 + r() * 52, z = -14 - r() * 10, s = 6 + r() * 5; dBill(pine, s * 0.5, s, x, s / 2, z, { basic: true }); }
  const hills = dPaint(1024, 256, () => piece([[0, 256], [0, 150], [120, 90], [260, 140], [380, 70], [520, 130], [660, 60], [800, 120], [920, 80], [1024, 120], [1024, 256]], '#0d1324', { seed: 61, lw: 4 }));
  for (let i = -1; i <= 1; i++) dBill(hills, 90, 20, i * 88, 8, 70, { basic: true }); for (let i = -1; i <= 1; i++) dBill(hills, 90, 20, i * 88, 8, -60, { basic: true });
  ST.moon = dBill(dPaint(256, 256, () => ellP(128, 128, 110, 110, '#f1ecd2', { seed: 62, lw: 4 })), 9, 9, -30, 34, 80, { basic: true, fog: false });
  const cloud = dPaint(512, 200, () => blobP([[30, 160], [80, 90], [160, 70], [230, 30], [320, 50], [400, 40], [470, 100], [490, 160]], '#3a4468', { seed: 63, lw: 3 }));
  ST.clouds = [[-20, 28, 75], [15, 32, 85], [40, 26, 70]].map(([x, y, z]) => dBill(cloud, 22, 8, x, y, z, { basic: true }));

  // ---- здание: сайдинг снаружи, панели внутри, пол-шашечка, потолок с плафонами
  const siding = dMat('#b9a98a', { key: 'siding', rep: [6, 2], fn: (w, h) => { for (let y = 16; y < h; y += 32) stroke([[0, y], [w, y]], 'rgba(80,60,30,0.45)', 3); } });
  dBox(14.4, 3.7, 0.2, siding, 0, 1.85, -8.1); dBox(0.2, 3.7, 8.2, siding, -7.1, 1.85, -4); dBox(0.2, 3.7, 8.2, siding, 7.1, 1.85, -4);
  const wallIn = dMat('#cfc3a8', { key: 'wallIn', rep: [4, 1], fn: (w, h) => { for (let y = 40; y < h; y += 64) stroke([[0, y], [w, y]], 'rgba(90,70,40,0.35)', 3); rectP(0, h - 30, w, 30, '#8a6a4a', { seed: 83, line: false }); } });
  dQuad(14, 3.6, wallIn, 0, 1.8, -7.99); dQuad(8, 3.6, wallIn, -6.99, 1.8, -4, { ry: Math.PI / 2 }); dQuad(8, 3.6, wallIn, 6.99, 1.8, -4, { ry: -Math.PI / 2 });
  const chk = dPaint(256, 256, () => { rectP(0, 0, 256, 256, '#d9d4c4', { seed: 63, line: false }); rectP(0, 0, 128, 128, '#b4ad98', { seed: 64, line: false }); rectP(128, 128, 128, 128, '#b4ad98', { seed: 65, line: false }); });
  chk.wrapS = chk.wrapT = T3.RepeatWrapping; chk.repeat.set(14, 8); dQuad(14, 8, new T3.MeshStandardMaterial({ map: chk, roughness: 0.55 }), 0, 0.012, -4, { rx: -Math.PI / 2 });
  const tiles = dMat('#d6d8d0', { key: 'tiles', rep: [7, 4], fn: (w, h) => { stroke([[0, 2], [w, 2]], '#9a9c94', 4); stroke([[2, 0], [2, h]], '#9a9c94', 4); } });
  dQuad(14, 8, tiles, 0, 3.6, -4, { rx: Math.PI / 2 }); dBox(14.6, 0.3, 8.6, dMat('#5c6168', { key: 'roof' }), 0, 3.82, -4, { cast: false });
  ST.lamps = [[-4.5, -2.4], [0, -2.4], [4.5, -2.4], [-4.5, -5.6], [0, -5.6], [4.5, -5.6]].map(([x, z]) => dBox(1.8, 0.06, 0.5, dGlow(0xfff6e0, 2.2), x, 3.56, z, { cast: false }));
  // фасад: стенки, рамы, стекло с плакатами, дверь, вывеска, неон, часы, камера
  dBox(6.2, 0.62, 0.25, siding, -4, 0.31, 0); dBox(6.2, 0.62, 0.25, siding, 4, 0.31, 0); dBox(14.4, 0.75, 0.25, siding, 0, 3.32, 0);
  for (const x of [-7, -4.6, -2.3, -0.95, 0.95, 2.3, 4.6, 7]) dBox(0.12, 3.0, 0.16, dMat('#5c6168', { key: 'frame' }), x, 1.6, 0);
  dBox(14.2, 0.1, 0.18, dMat('#5c6168', { key: 'frame' }), 0, 0.64, 0); dBox(14.2, 0.1, 0.18, dMat('#5c6168', { key: 'frame' }), 0, 2.95, 0);
  const glass = new T3.MeshStandardMaterial({ color: 0xbcd4ea, transparent: true, opacity: 0.12, roughness: 0.05, metalness: 0.1 });
  [[-4, 6.0], [4, 6.0]].forEach(([x, w]) => dQuad(w, 2.3, glass, x, 1.8, 0.02, { recv: false }));
  [['COLD BEER', '#2f6a6e', -5.8, 2.3], ['LOTTO', '#d8342c', -3.4, 2.4], ['ICE $2.99', '#3d7fc4', 3.3, 2.3], ['ATM', '#2a2c30', 5.8, 2.4]].forEach(([s, c, x, y], i) =>
    dQuad(1.3, 0.55, new T3.MeshBasicMaterial({ map: dSign(320, 136, c, s, 54, '#fbf8f0') }), x, y, 0.06, { recv: false }));
  ST.door = dBox(1.8, 2.9, 0.06, new T3.MeshStandardMaterial({ color: 0xbcd4ea, transparent: true, opacity: 0.18, roughness: 0.05 }), 0, 1.45, 0.02, { cast: false });
  ST.push = dQuad(0.5, 0.18, new T3.MeshBasicMaterial({ map: dSign(256, 96, '#f2c230', 'PUSH', 56, '#1c1512') }), 0, 1.0, 0.07, { recv: false });
  dQuad(9, 0.85, new T3.MeshStandardMaterial({ map: dSign(1024, 100, '#c8342c', 'HWY 40 FUEL & FOOD', 62, '#fbf8f0'), emissive: 0x501010, emissiveIntensity: 0.4 }), 0, 4.18, 0.15); dBox(14.4, 0.95, 0.25, dMat('#c8342c', { key: 'band' }), 0, 4.18, 0);
  ST.neonM = new T3.MeshBasicMaterial({ map: dSign(256, 96, '#1a0c14', 'OPEN 24/7', 54, '#ff5a7a', 'Osw') }); ST.neonOff = new T3.MeshBasicMaterial({ map: dSign(256, 96, '#140a10', 'OPEN 24/7', 54, '#4a2a30', 'Osw') });
  ST.neonQ = [dQuad(1.7, 0.6, ST.neonM, 4.6, 2.35, -0.08, { ry: Math.PI, recv: false }), dQuad(1.7, 0.6, ST.neonM, 4.6, 2.35, 0.08, { recv: false })];
  dQuad(1.3, 0.55, new T3.MeshBasicMaterial({ map: dSign(256, 110, '#1a1614', '3:07', 80, '#ff4a3a', 'Osw') }), 0, 3.2, -0.16, { ry: Math.PI, recv: false });
  dBox(0.3, 0.2, 0.35, dMat('#e9edf2', { key: 'cam' }), 6.6, 3.35, -0.5); dCyl(0.07, 0.07, 0.2, dMat('#1c1512', { key: 'lens' }), 6.6, 3.3, -0.3, { rx: Math.PI / 2 });
  // у входа: ящик ICE, клетка с баллонами, урна, газетный автомат
  dBox(1.4, 1.1, 0.8, [dMat('#e9edf2', { key: 'ice' }), dMat('#e9edf2', { key: 'ice' }), dMat('#3d7fc4', { key: 'iceTop' }), dMat('#e9edf2', { key: 'ice' }), new T3.MeshStandardMaterial({ map: dSign(256, 200, '#e9edf2', 'ICE', 90, '#3d7fc4', 'Inter Black', { fn: (w, h) => rectP(0, 0, w, 40, '#3d7fc4', { seed: 9, line: false }) }) }), dMat('#e9edf2', { key: 'ice' })], -6, 0.55, 0.75);
  dBox(1.2, 1.5, 0.7, dMat('#7a7e86', { key: 'cage', fn: (w, h) => { for (let x = 0; x < w; x += 24) stroke([[x, 0], [x, h]], '#3a3d42', 3); for (let y = 0; y < h; y += 24) stroke([[0, y], [w, y]], '#3a3d42', 3); } }), 6.2, 0.75, 0.8);
  [5.9, 6.3, 6.5].forEach((x, i) => dCyl(0.16, 0.16, 0.7, dMat('#e9edf2', { key: 'tank' }), x - 0.2, 0.4, 0.75 + (i % 2) * 0.1));
  dCyl(0.3, 0.26, 0.9, dMat('#4a6a4a', { key: 'trash', fn: (w, h) => { for (let x = 0; x < w; x += 32) stroke([[x, 0], [x, h]], '#2a3a2a', 4); } }), 1.7, 0.45, 0.75);
  dBox(0.5, 1.1, 0.45, dMat('#3d7fc4', { key: 'news', fn: (w, h) => rectP(30, 40, w - 60, 80, '#e9edf2', { seed: 5, lw: 3 }) }), -1.7, 0.55, 0.75);

  // ---- внутри: стеллажи со снеками, торцы, холодильники, касса, сигаретная стойка, кофе, хот-доги, вода, двери
  const snack = dPaint(512, 256, (w, h) => { rectP(0, 0, w, h, '#c9c2b2', { seed: 67, line: false }); for (let rr = 0; rr < 3; rr++) { rectP(0, 76 + rr * 84, w, 10, '#8a8274', { seed: 68 + rr, lw: 2 });
    for (let q = 0; q < 9; q++) { const c = ['#d8342c', '#f2c230', '#3d7fc4', '#46b86a', '#8a4fc4', '#ff7a1a'][(q + rr * 2) % 6]; piece([[8 + q * 56, 74 + rr * 84], [8 + q * 56, 18 + rr * 84], [56 + q * 56, 18 + rr * 84], [56 + q * 56, 74 + rr * 84]], c, { seed: 70 + q + rr * 9, lw: 2 }); ellP(32 + q * 56, 48 + rr * 84, 10, 8, '#fbf8f0', { raw: true, line: false, a: 0.7 }); } } });
  const sm = new T3.MeshStandardMaterial({ map: snack, roughness: 0.9 }), shelfSide = dMat('#c9c2b2', { key: 'shelf' });
  [-5.2, -2.8].forEach(x => { dBox(0.75, 1.9, 3.6, [sm, sm, shelfSide, shelfSide, shelfSide, shelfSide], x, 0.95, -4.8); dBox(0.95, 1.3, 0.5, [shelfSide, shelfSide, shelfSide, shelfSide, sm, sm], x, 0.65, -2.75); });
  dBox(0.6, 2.2, 6.0, [sm, sm, shelfSide, shelfSide, shelfSide, shelfSide], 6.65, 1.1, -5.0);
  const bottles = dPaint(256, 512, (w, h) => { rectP(0, 0, w, h, '#a8d8e8', { seed: 90, line: false }); for (let rr = 0; rr < 4; rr++) { rectP(0, 110 + rr * 120, w, 8, '#e9edf2', { seed: 91 + rr, line: false });
    for (let q = 0; q < 6; q++) piece([[14 + q * 40, 108 + rr * 120], [14 + q * 40, 40 + rr * 120], [22 + q * 40, 26 + rr * 120], [34 + q * 40, 26 + rr * 120], [42 + q * 40, 40 + rr * 120], [42 + q * 40, 108 + rr * 120]], ['#d8342c', '#46b86a', '#f2c230', '#3d7fc4'][(q + rr) % 4], { seed: 95 + q + rr * 6, lw: 1.6 }); }
    ctx.strokeStyle = '#5c6168'; ctx.lineWidth = 14; ctx.strokeRect(7, 7, w - 14, h - 14); });
  ST.coolM = new T3.MeshStandardMaterial({ map: bottles, emissive: 0x6aa8c8, emissiveMap: bottles, emissiveIntensity: 0.55, roughness: 0.3 });
  for (let i = 0; i < 5; i++) dBox(1.25, 2.3, 0.1, ST.coolM, -6.2 + i * 1.3, 1.25, -7.9, { cast: false });
  dQuad(2.8, 0.5, new T3.MeshBasicMaterial({ map: dSign(512, 96, '#2f6a6e', 'COLD DRINKS →', 54, '#fbfaf6') }), -3.6, 2.95, -7.85, { recv: false });
  dBox(1.0, 2.2, 0.08, dMat('#5c6168', { key: 'empDoor', fn: (w, h) => { rectP(30, 40, w - 60, 40, '#c8342c', { seed: 8, line: false }); } }), 5.4, 1.1, -7.92);
  dQuad(1.1, 0.3, new T3.MeshBasicMaterial({ map: dSign(256, 70, '#c8342c', 'EMPLOYEES ONLY', 26, '#fbf8f0') }), 5.4, 2.35, -7.86, { recv: false });
  ST.exitQ = dQuad(0.7, 0.26, new T3.MeshBasicMaterial({ map: dSign(160, 60, '#0c3a1c', 'EXIT', 40, '#6aff9a', 'Osw') }), 5.4, 2.75, -7.86, { recv: false });
  // касса: деревянный низ, столешница, кнопка, касса, лотерея, хот-дог роллер
  const wood = dMat('#7a5a3a', { key: 'wood', fn: (w, h) => { for (let i = 1; i < 6; i++) stroke([[0, i * 42], [w, i * 42]], '#6a4c30', 3); } });
  dBox(3.4, 1.05, 0.8, wood, 4.1, 0.53, -2.4); dBox(3.6, 0.08, 1.0, dMat('#d9d4c4', { key: 'top' }), 4.1, 1.09, -2.4);
  dBox(0.55, 0.32, 0.45, dMat('#2a2c30', { key: 'reg' }), 5.0, 1.29, -2.5); dBox(0.48, 0.05, 0.22, dGlow(0x3aa070, 1.2), 5.0, 1.48, -2.35, { cast: false });
  dBox(0.6, 0.45, 0.35, new T3.MeshStandardMaterial({ map: dSign(200, 150, '#f2c230', 'LOTTO', 48, '#c8342c') }), 2.75, 1.35, -2.55);
  dBox(0.8, 0.18, 0.4, dMat('#8e949a', { key: 'roll' }), 5.6, 1.22, -2.35); for (let i = 0; i < 4; i++) dCyl(0.035, 0.035, 0.6, dMat('#c8642c', { key: 'dog' }), 5.6, 1.33, -2.5 + i * 0.1, { rz: Math.PI / 2 });
  ST.btn = dCyl(0.12, 0.13, 0.08, new T3.MeshStandardMaterial({ color: 0xd8342c, emissive: 0x500000, roughness: 0.4 }), 3.55, 1.19, -2.2); dBox(0.36, 0.05, 0.36, dMat('#f2c230', { key: 'btnB' }), 3.55, 1.15, -2.2);
  const cigs = dPaint(512, 256, (w, h) => { rectP(0, 0, w, h, '#3a3d42', { seed: 40, line: false }); for (let rr = 0; rr < 4; rr++) for (let q = 0; q < 10; q++) rectP(10 + q * 50, 10 + rr * 62, 42, 52, ['#d8342c', '#fbf8f0', '#2f6a6e', '#f2c230', '#2a2c30'][(q * 3 + rr) % 5], { seed: 41 + q + rr * 10, lw: 2 }); });
  dBox(2.6, 1.3, 0.3, new T3.MeshStandardMaterial({ map: cigs }), 4.3, 2.0, -3.85);
  dBox(1.4, 1.0, 0.7, dMat('#5c4a3a', { key: 'coffee' }), -6.5, 0.5, -1.4); dBox(0.5, 0.6, 0.4, dMat('#1c1512', { key: 'cm' }), -6.5, 1.3, -1.6); dCyl(0.1, 0.12, 0.25, dMat('#2a1a10', { key: 'pot' }), -6.4, 1.13, -1.1);
  dQuad(1.0, 1.3, new T3.MeshStandardMaterial({ map: dPaint(200, 260, () => { rectP(0, 0, 200, 260, '#f3ecd8', { seed: 81, line: false }); rectP(0, 0, 200, 60, '#d8342c', { seed: 82, line: false }); txt('HOT DOGS', 100, 32, 30, { font: 'Inter Black', col: '#fbfaf6' }); txt('2 for $3', 100, 150, 38, { font: 'Hand', col: '#1c1512' }); ctx.strokeStyle = '#1c1512'; ctx.lineWidth = 6; ctx.strokeRect(3, 3, 194, 254); }) }), 6.98, 2.25, -1.6, { ry: -Math.PI / 2 });
  dQuad(1.2, 0.8, new T3.MeshStandardMaterial({ map: dPaint(240, 160, () => { rectP(0, 0, 240, 160, '#fbf8f0', { seed: 84, line: false }); txt('NO SHOES', 120, 40, 34, { font: 'Inter Black', col: '#c8342c' }); txt('NO SHIRT', 120, 82, 34, { font: 'Inter Black', col: '#c8342c' }); txt('NO SERVICE', 120, 124, 34, { font: 'Inter Black', col: '#1c1512' }); ctx.strokeStyle = '#1c1512'; ctx.lineWidth = 5; ctx.strokeRect(3, 3, 234, 154); }) }), -6.98, 2.1, -4.2, { ry: Math.PI / 2 });
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2 - (i > 1 ? 1 : 0); j++) dBox(0.5, 0.32, 0.36, dMat('#3d7fc4', { key: 'water', fn: (w, h) => { rectP(0, h * 0.3, w, h * 0.4, '#e9edf2', { seed: 7, line: false }); } }), 1.6 + j * 0.52, 0.16 + i * 0.32, -3.7);
  [[-1.0, -6.7], [-0.4, -7.0], [6.0, -6.9]].forEach(([x, z], i) => dBox(0.55, 0.45, 0.45, dMat('#b08a5a', { key: 'cbox', fn: (w, h) => stroke([[0, h / 2], [w, h / 2]], '#8a6a40', 6) }), x, 0.23, z, { ry: i * 0.4 }));
  // жалюзи снаружи витрины: сетка вершин — прогиб, вмятины; короб; болты на направляющих
  const shT = dPaint(256, 256, () => { rectP(0, 0, 256, 256, '#8e949a', { seed: 66, line: false }); for (let y = 8; y < 256; y += 24) { stroke([[0, y], [256, y]], '#6c7278', 5, { smooth: false }); stroke([[0, y - 7], [256, y - 7]], '#b0b6bb', 3, { smooth: false }); } });
  shT.wrapS = shT.wrapT = T3.RepeatWrapping; shT.repeat.set(10, 3);
  ST.shutM = new T3.MeshStandardMaterial({ map: shT, roughness: 0.55, metalness: 0.35, side: T3.DoubleSide });
  ST.shut = dQuad(14.2, 2.9, ST.shutM, 0, 1.6, 0.24, { sx: 56, sy: 14, cast: true }); ST.shut0 = ST.shut.geometry.attributes.position.array.slice();
  dBox(14.4, 0.34, 0.42, dMat('#5c6168', { key: 'box' }), 0, 3.12, 0.32);
  ST.bolts = [-2.3, 2.3, -4.6, 4.6].map(x => dCyl(0.06, 0.06, 0.18, dMat('#c9cfd4', { key: 'bolt', metal: 0.6, rough: 0.3 }), x, 2.75, 0.12, { rx: Math.PI / 2 }));
  // машина на стоянке
  const car = new T3.Group(); DIO.scene.add(car); car.position.set(-5.2, 0, 7.2); car.rotation.y = 0.35;
  const cm = dMat('#5a6b80', { key: 'car' }); dBox(1.8, 0.6, 4.2, cm, 0, 0.6, 0, { parent: car }); dBox(1.6, 0.55, 2.2, [cm, cm, cm, cm, new T3.MeshStandardMaterial({ color: 0x9fb4c8, roughness: 0.1 }), new T3.MeshStandardMaterial({ color: 0x9fb4c8, roughness: 0.1 })], 0, 1.15, -0.2, { parent: car });
  [[-0.85, 1.3], [0.85, 1.3], [-0.85, -1.3], [0.85, -1.3]].forEach(([x, z]) => dCyl(0.33, 0.33, 0.25, dMat('#1c1512', { key: 'tire' }), x, 0.33, z, { rz: Math.PI / 2, parent: car }));
  ST.carLights = [[-0.6, 2.1], [0.6, 2.1], [-0.6, -2.1], [0.6, -2.1]].map(([x, z], i) => dBox(0.35, 0.16, 0.05, new T3.MeshStandardMaterial({ color: i < 2 ? 0xfff2c0 : 0xff3020, emissive: i < 2 ? 0xffd070 : 0xff2010, emissiveIntensity: 0.2 }), x, 0.72, z, { parent: car, cast: false }));
  // навес: панели света, полоса, столбы; колонки со шлангами, островки, тумбы; столб с ценой
  dBox(16, 0.5, 9, dMat('#e7e3d6', { key: 'canopy', rep: [4, 2] }), 0, 5.1, 6.5); dBox(16.1, 0.3, 9.1, dMat('#c8342c', { key: 'canBand', fn: (w, h) => rectP(0, h * 0.4, w, h * 0.2, '#fbf8f0', { seed: 4, line: false }) }), 0, 4.75, 6.5);
  for (let x = -6; x <= 6; x += 3) for (const z of [4.5, 8.5]) dBox(1.4, 0.05, 0.45, dGlow(0xfff2d0, 2.5), x, 4.58, z, { cast: false });
  [[-5, 6.5], [5, 6.5]].forEach(([x, z]) => { dBox(0.45, 4.6, 0.45, dMat('#d9d4c4', { key: 'pillar', fn: (w, h) => { for (let y = 0; y < h; y += 40) rectP(0, y, w, 16, '#c8342c', { seed: y, line: false }); } }), x, 2.3, z); });
  [[-2.5, '3'], [2.5, '4']].forEach(([x, n], i) => { const side = dMat('#c8342c', { key: 'pump' }), face = new T3.MeshStandardMaterial({ map: dSign(160, 280, '#c8342c', n, 110, '#7dffb0', 'Osw', { fn: (w, h) => { rectP(0, 0, w, 50, '#f3ecd8', { seed: 3, line: false }); rectP(20, 70, w - 40, 80, '#10161e', { seed: 2, lw: 3 }); } }), emissive: 0x103010, emissiveIntensity: 0.4 });
    dBox(1.0, 1.75, 0.6, [side, side, dMat('#f3ecd8', { key: 'pumpTop' }), side, face, face], x, 1.05, 6.5); dBox(1.8, 0.2, 1.2, dMat('#9a968c', { key: 'island' }), x, 0.1, 6.5);
    dTube([[x + 0.5, 1.4, 6.5], [x + 0.85, 1.1, 6.4], [x + 0.8, 0.5, 6.3], [x + 0.6, 0.9, 6.2]], 0.035, dMat('#1c1512', { key: 'hose' })); [[x - 0.75, 7.2], [x + 0.75, 7.2], [x - 0.75, 5.8], [x + 0.75, 5.8]].forEach(([bx, bz]) => dCyl(0.08, 0.08, 0.8, dMat('#f2c230', { key: 'bollard' }), bx, 0.4, bz)); });
  dBox(0.3, 7, 0.3, dMat('#2a2e36', { key: 'signPole' }), 9.5, 3.5, 12.5);
  dQuad(3.0, 2.3, new T3.MeshStandardMaterial({ map: dPaint(300, 230, () => { rectP(0, 0, 300, 230, '#f3ecd8', { seed: 69, line: false }); rectP(0, 0, 300, 70, '#c8342c', { seed: 70, line: false }); txt('GAS', 150, 38, 48, { font: 'Inter Black', col: '#fbfaf6' }); rectP(30, 90, 240, 110, '#10161e', { seed: 71, lw: 3 }); txt('3.49', 150, 146, 78, { font: 'Osw', weight: 600, col: '#ff4a3a' }); ctx.strokeStyle = '#1c1512'; ctx.lineWidth = 6; ctx.strokeRect(3, 3, 294, 224); }), emissive: 0x2a2018, emissiveIntensity: 0.6 }), 9.5, 7.1, 12.67);
  // дождь
  const N = 2600, pos = new Float32Array(N * 6), rr = rng(71); ST.rain0 = []; for (let i = 0; i < N; i++) ST.rain0.push([rr() * 50 - 25, rr() * 12, rr() * 40 - 10, 0.6 + rr() * 0.4]);
  const rg = new T3.BufferGeometry(); rg.setAttribute('position', new T3.BufferAttribute(pos, 3)); ST.rain = new T3.LineSegments(rg, new T3.LineBasicMaterial({ color: 0xaac4f0, transparent: true, opacity: 0.45 })); S3.add(ST.rain);
  // толпа: 40 фигур (кэш поз: 3 вида × 8 кадров × спиной/лицом/уходят)
  const pose = (back, pound, walk) => dPoses(24, i => { const v = Math.floor(i / 8), f = i % 8; zMini(256, 660 - 380 * 1.32, 1.32, f * 0.125, 4 + v * 5, { back, pound, walk, dim: 0 }); });
  ST.poses = { pound: pose(true, true, false), walkBack: pose(true, false, true), walkFront: pose(false, false, true) };
  ST.crowd = Array.from({ length: 40 }, (_, k) => { const c = dCrowdCard(1.95 + rng(500 + k)() * 0.25); const q = rng(600 + k); c.home = [-6.2 + (k % 14) * 0.95 + (q() - 0.5) * 0.4, 0.75 + Math.floor(k / 14) * 0.85 + q() * 0.3]; c.v = k % 3; c.ph = Math.floor(q() * 8); return c; });
  // герои
  ST.joe = dCard(2.05, 1); ST.z1 = dCard(2.05, 1);
}
function stRain(t, a) { ST.rain.visible = a > 0; if (!a) return; ST.rain.material.opacity = 0.45 * a; const p = ST.rain.geometry.attributes.position.array;
  ST.rain0.forEach(([x, y, z, v], i) => { const yy = ((y - t * 9 * v) % 12 + 12) % 12, xx = x - (12 - yy) * 0.12; p.set([xx, yy, z, xx + 0.04, yy + 0.35, z], i * 6); }); ST.rain.geometry.attributes.position.needsUpdate = true; }
function stShutter(k, bulge, t, dents) {                               // k 0..1 — опущены; прогиб внутрь (−z) с дрожью; вмятины от ударов
  ST.shut.scale.y = Math.max(0.001, k); ST.shut.position.y = 3.05 - 2.9 * k / 2;
  const p = ST.shut.geometry.attributes.position, a = p.array, b = ST.shut0;
  for (let i = 0; i < a.length; i += 3) { const x = b[i], y = b[i + 1]; let dz = 0;
    if (bulge) { const bx = Math.cos(x / 7.1 * Math.PI / 2), by = Math.cos(y / 1.45 * Math.PI / 2); dz -= bulge * 0.55 * Math.max(0, bx) * Math.max(0, by) * (1 + 0.05 * Math.sin(t * 30 + x)); }
    if (dents) for (let j = 0; j < 9; j++) { const r = rng(300 + j), cx = -6 + r() * 12, cy = -1.1 + r() * 2.2, w = 0.35 + r() * 0.3, d2 = ((x - cx) ** 2 + (y - cy) ** 2) / (w * w); if (d2 < 1) dz -= dents * 0.12 * (1 - d2) * Math.min(1, Math.max(0, (t * 3 - j * 0.7) % 9)); }
    a[i + 2] = b[i + 2] + dz; }
  p.needsUpdate = true; ST.shut.geometry.computeVertexNormals();
}
function stSet(t, st = {}) {
  const sky = st.sky || 'night'; DIO.scene.background = ST.sky[sky]; DIO.scene.fog.color.setHex(ST.fogCol[sky]); DIO.scene.fog.density = st.fogD ?? (sky === 'day' ? 0.012 : 0.022);
  const SUN = { night: [0x9fb4ff, 0.6, -20, 30, 25], dawn: [0xffc890, 1.3, 30, 10, 40], day: [0xfff4e0, 1.6, 20, 30, 30], dusk: [0xc89ab0, 0.7, -30, 12, 30] }[sky];
  ST.sun.color.setHex(SUN[0]); ST.sun.intensity = SUN[1]; ST.sun.position.set(SUN[2], SUN[3], SUN[4]); ST.hemi.intensity = { night: 0.7, dawn: 0.9, day: 1.2, dusk: 0.7 }[sky];
  ST.moon.visible = sky === 'night'; ST.clouds.forEach(c => c.visible = sky !== 'day');
  const lit = st.lit ?? 1, fl = st.flick ? (hsh(Math.floor(t * 9)) % 4 === 0 ? 0.35 : 1) : 1, al = st.alarm ?? 0;
  ST.spot.intensity = 34 * lit * fl; ST.fill.intensity = 16 * lit * fl; ST.fill2.intensity = 10 * lit * fl; ST.win.intensity = 12 * lit * fl * (1 - (st.shut ?? 0));
  ST.lamps.forEach(l => l.material.emissiveIntensity = 2.2 * lit * fl); ST.coolM.emissiveIntensity = 0.55 * Math.max(0.15, lit);
  ST.alarm.intensity = al * 26 * (0.55 + 0.45 * Math.sin(t * Math.PI * 1.4)); ST.exitL.intensity = (st.exit ?? 0) * 12; ST.dark.intensity = Math.max(0, 0.35 - lit) / 0.35 * 14;
  const neon = st.neon ?? true; ST.neon.intensity = neon ? 6 : 0; ST.neonQ.forEach(q => q.material = neon ? ST.neonM : ST.neonOff);
  ST.can.forEach(l => l.intensity = (st.canopy ?? 1) * 40);
  ST.door.position.x = 1.6 * sm(st.door ?? 0); ST.push.position.x = ST.door.position.x;
  stShutter(st.shut ?? 0, st.bulge ?? 0, t, st.dents ?? 0);
  ST.btn.position.y = st.btnDown ? 1.15 : 1.19;
  const ca = st.car ? (Math.floor(t * 3) % 2 ? 1 : 0.1) : 0.2; ST.carLights.forEach(m => m.material.emissiveIntensity = st.car ? ca * 3 : 0.2); ST.carL.intensity = st.car ? ca * 14 : 0;
  ST.shaft.intensity = (st.shafts ?? 0) * 40; if (st.shafts) ST.shaft.target.position.set(lerp(-2, 5, st.shaftK ?? 0.5), 0, lerp(-5, -2.5, st.shaftK ?? 0.5));
  ST.bolts.forEach((b, i) => { const pop = (st.bolts || [])[i]; if (pop == null || t < pop) { b.position.set([-2.3, 2.3, -4.6, 4.6][i], 2.75, 0.12); b.rotation.set(Math.PI / 2, 0, 0); return; }
    const u = t - pop; b.position.set([-2.3, 2.3, -4.6, 4.6][i] + u * 1.2 * (i % 2 ? 1 : -1), 2.75 + u * 2.5 - 4.9 * u * u, 0.12 - u * 3.0); b.rotation.set(Math.PI / 2 + u * 14, u * 9, 0); });
  stRain(t, st.rain ?? 1);
  // толпа: 'pound' — у жалюзи, 'gather' — сходятся к магазину (k 0..1), 'leave' — расходятся (k 0..1), иначе скрыта
  const cr = st.crowd, ck = st.crowdK ?? 1, n = st.crowdN ?? 40;
  ST.crowd.forEach((c, k) => { const on = cr && k < n; c.q.visible = !!on; if (!on) return; const [hx, hz] = c.home, r = rng(700 + k), fr = (Math.floor(t * 8) + c.ph) % 8;
    let x = hx, z = hz, set = 'pound';
    if (cr === 'gather') { const q = clamp(ck * 1.3 - r() * 0.3); x = lerp(hx * 2.2 + (r() - 0.5) * 8, hx, eo(q)); z = lerp(12 + r() * 8, hz, eo(q)); set = q < 1 ? 'walkFront' : 'pound'; }
    if (cr === 'leave') { const q = clamp(ck * 1.4 - r() * 0.4); x = lerp(hx, hx * 2.4 + (r() - 0.5) * 6, eo(q)); z = lerp(hz, 14 + r() * 9, eo(q)); set = q > 0 ? 'walkBack' : 'pound'; }
    c.set(ST.poses[set][c.v * 8 + fr]); c.q.position.set(x, c.hM * (660 / 740 - 0.5), z); const cp = DIO.cam.position; c.q.rotation.set(0, Math.atan2(cp.x - x, cp.z - z), 0); });
}
function stFace() { const c = DIO.cam.position; [...DIO.cards.map(d => d.q), ...ST.crowd.map(d => d.q)].forEach(q => { if (q.visible) q.rotation.set(0, Math.atan2(c.x - q.position.x, c.z - q.position.z), 0); }); }
