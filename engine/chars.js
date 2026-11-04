/* Персонажи канала строятся здесь, в стиле «Аппликации». Готовая заготовка — person(o): человек из бумажных деталей
   (конструкция взята у Никиты из reference/tom-nikita/chars.js и обобщена). Своих постоянных героев делать так:
   function hero(o) { return person({ pal: {...}, hair: 'cap', top: 'jacket', beard: 1, ...o }); } + свои аксессуары в том же layer.
   Высота стоящего: голова-центр (x, y), ноги до y + 508·s; сидя ('sit') — сиденье ≈ y + 345·s. Руки arms {l, r: [hx, hy, поза]} — от центра головы.
   o: x y s t flip rot | pal {skin skinD hair hairL top topD pants shoe stub} | hair 'shaggy'|'short'|'buzz'|'bald'|'cap'|'helmet' (capCol) | beard | stubble | freckles
      top 'hoodie'|'jacket'|'tee' | badge цвет | mood ''|'shock'|'dumb'|'angry'|'sleepy'|'dread'|'sick'|'eww' | lk [x,y] | lid | brow | browA | smile | m (рот: talk())
      arms {l,r:[hx,hy,'open'|'fist'|'point'|'phone'|'glass']} | legs 'stand'|'run'|'sit' | lean | tilt | bob | sweat | glass/drink (стакан) */
const PC0 = { skin: '#f6d6c2', skinD: '#e9b9a0', hair: '#4b2d20', hairL: '#6e4330', top: '#6f7a3e', topD: '#535d2b', pants: '#3d5c8f', shoe: '#f1efe9', stub: '#8a6a58', line: '#1c1512' };
let PC = PC0;

function person(o) {
  PC = { ...PC0, ...(o.pal || {}) };
  const t = o.t ?? 0, s = o.s ?? 1;
  push(o.x, o.y, s, o.rot || 0, o.flip ? -1 : 1);
  push(0, 0, 1, o.lean || 0);
  const jb = jig(51); push(jb[0], jb[1], 1, jb[2]); personLegs(o); personArms(o, 'back'); personBody(o); pop();
  const dt = -0.14 * sm(((o.drink ?? 0) - 0.28) / 0.45); const jh = jig(52); push(jh[0], jh[1] + (o.bob ?? 0), 1, jh[2] + (o.tilt || 0) + dt); personHead({ ...o, lid: (o.drink ?? 0) > 0.3 ? 1 : o.lid }); pop();
  personArms(o);
  pop(); pop();
}
function personLegs(o) {
  if (o.legs === 'sit') {                                            // сидит анфас: бёдра в ракурсе, колени, голени вниз
    [-1, 1].forEach(sd => {
      piece([[sd * 6, 300], [sd * 104, 300], [sd * 110, 372], [sd * 4, 372]], PC.pants, { seed: 160 + sd, step: 18, shade: () => { piece([[sd * 6, 350], [sd * 110, 350], [sd * 110, 372], [sd * 4, 372]], mix(PC.pants, '#000000', 0.15), { seed: 162 + sd, line: false }); } });
      piece([[sd * 20, 366], [sd * 92, 366], [sd * 86, 520], [sd * 26, 520]], PC.pants, { seed: 164 + sd, step: 18 });
      piece([[sd * 22, 500], [sd * 90, 500], [sd * 90, 520], [sd * 22, 520]], mix(PC.pants, '#000000', 0.18), { seed: 166 + sd, step: 10, lw: 2 });
      blobP([[sd * 18, 512], [sd * 96, 510], [sd * 106, 540], [sd * 14, 546]], PC.shoe, { seed: 168 + sd }); stroke([[sd * 14, 538], [sd * 104, 536]], '#c9c4b8', 4); });
    return;
  }
  const run = o.legs === 'run', ph = Math.sin(step(o.t ?? 0) * 18);
  [-1, 1].forEach(sd => { const sw = run ? ph * sd * 40 : 0;
    piece([[sd * 10, 318], [sd * 62, 318], [sd * 58 + sw, 486], [sd * 16 + sw, 486]], PC.pants, { seed: 60 + sd, step: 20, shade: () => {
      stroke([[sd * 36, 330], [sd * 37 + sw * 0.6, 470]], mix(PC.pants, '#ffffff', 0.25), 2.4, { a: 0.7 }); } });
    piece([[sd * 14 + sw, 466], [sd * 60 + sw, 466], [sd * 60 + sw, 486], [sd * 14 + sw, 486]], mix(PC.pants, '#000000', 0.18), { seed: 64 + sd, step: 10, lw: 2 });
    blobP([[sd * 10 + sw, 478], [sd * 72 + sw, 476], [sd * 86 + sw, 502], [sd * 8 + sw, 508]], PC.shoe, { seed: 62 + sd });
    stroke([[sd * 10 + sw, 500], [sd * 84 + sw, 498]], '#c9c4b8', 4);
    for (let q = 0; q < 3; q++) stroke([[sd * (26 + q * 12) + sw, 482], [sd * (32 + q * 12) + sw, 488]], '#9a958a', 2.4); });
}
function personBody(o) {
  // верх: o.top 'hoodie' (капюшон, шнурки, карман) | 'jacket' (молния, воротник, нагрудные карманы) | 'tee'
  const top = o.top || 'hoodie';
  rectP(-22, 84, 44, 30, PC.skinD, { seed: 69, lw: 2 });
  if (top === 'hoodie') piece(spline([[-70, 92], [0, 80], [70, 92], [62, 120], [-62, 120]], true, 6), PC.topD, { seed: 70 });
  const body = spline([[-50, 90], [50, 90], [82, 100], [96, 124], [100, 200], [104, 330], [-104, 330], [-100, 200], [-96, 124], [-82, 100]], true, 5);   // скруглённые плечи
  piece(body, PC.top, { seed: 71, step: 18, shade: () => {
    piece([[40, 92], [104, 200], [104, 330], [60, 330]], PC.topD, { seed: 75, line: false, a: 0.45 });
    stroke([[-104, 318], [104, 318]], PC.topD, 5);
    if (top === 'hoodie') { piece([[-60, 248], [60, 248], [74, 322], [-74, 322]], mix(PC.top, PC.topD, 0.35), { seed: 72, lw: 2.2 }); stroke([[0, 96], [0, 324]], PC.topD, 3, { a: 0.6 }); }
    if (top === 'jacket') { stroke([[0, 96], [0, 326]], '#c9c4b8', 5); [-1, 1].forEach(sd => { rectP(sd > 0 ? 24 : -78, 150, 54, 48, mix(PC.top, PC.topD, 0.4), { seed: 77 + sd, lw: 2 }); stroke([[sd * 24, 150], [sd * 78, 150]], PC.topD, 4); }); }
    if (o.badge) { ellP(-48, 170, 22, 22, '#f6efe0', { seed: 76, lw: 1.8 }); dot(-48, 170, 8, o.badge); }
  } });
  if (top === 'jacket') [-1, 1].forEach(sd => piece([[sd * 4, 90], [sd * 56, 88], [sd * 40, 140]], PC.topD, { seed: 78 + sd, lw: 2.2 }));   // воротник
  const sw = Math.sin(step(o.t ?? 0) * 1.4) * 3;
  if (top === 'hoodie') [-1, 1].forEach(sd => { stroke([[sd * 16, 104], [sd * 18 + sw, 160], [sd * 17 + sw, 196]], '#f4f1ea', 4); rectP(sd * 17 + sw - 5, 194, 10, 18, '#f4f1ea', { lw: 1.6, seed: 73 + sd }); });
  if (o.vest) personVest(o.vest);
  if ((o.belly ?? 0) > 0) { const g = ctx.createRadialGradient(0, 260, 5, 0, 260, 120); g.addColorStop(0, hexA('#9cff6a', 0.55 * o.belly)); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(-130, 140, 260, 240);
    const ph = step(o.t ?? 0) * 3; for (let i = 0; i < 3; i++) { const a = ph + i * 2.1; stroke([[Math.cos(a) * 40 - 14, 250 + Math.sin(a) * 30], [Math.cos(a) * 40, 240 + Math.sin(a) * 30], [Math.cos(a) * 40 + 14, 250 + Math.sin(a) * 30]], '#2d6b16', 4, { a: o.belly }); } }
}
/* стакан: c — центр, rg — наклон; молоко держит горизонт, убывает по f */
function glassAt(cx, cy, rg, f, o = {}) {
  const gw = 34, gh = 100, G = [[-gw, -gh / 2], [gw, -gh / 2], [gw - 7, gh / 2], [-gw + 7, gh / 2]];
  push(cx, cy, 1, rg);
  const path = piece(G, 'rgba(225,238,248,0.6)', { raw: true, tex: false, lw: 2.8 });
  if (f > 0.02) { ctx.save(); ctx.clip(path); ctx.rotate(-rg);
    const low = Math.max(...G.map(([x, y]) => x * Math.sin(-rg) * -1 + y * Math.cos(rg))), lvl = low - f * gh * Math.max(0.35, Math.abs(Math.cos(rg)));
    ctx.fillStyle = '#fbfcf6'; ctx.fillRect(-160, lvl, 320, 260); ctx.strokeStyle = '#c9d6e0'; ctx.lineWidth = 2 / S; ctx.beginPath(); ctx.moveTo(-160, lvl); ctx.lineTo(160, lvl); ctx.stroke(); ctx.restore(); }
  if (o.licked) for (let i = 0; i < 4; i++) stroke([[-20, -30 + i * 18], [0, -22 + i * 18], [20, -30 + i * 18]], '#b7c7d3', 2.4);
  stroke([[-gw + 9, -gh / 2 + 10], [-gw + 14, gh / 2 - 12]], '#ffffff', 5, { a: 0.65 });
  pop();
}
function personArms(o, pass = 'front') {
  const A = o.arms || {}, dr = o.drink ?? 0;
  [['l', -1], ['r', 1]].forEach(([k, sd]) => {
    let a = A[k] || [sd * 112, 300, 'open']; let [hx, hy, pose] = a; const sh = [sd * 70, 122];
    let gl = null;
    if (pose === 'glass') {
      if (k === 'r' && dr > 0) {                                     // питьё: стакан к губам, наклон, голова запрокинута
        const lift = sm(dr / 0.35), tk = sm((dr - 0.28) / 0.45), ht = -0.14 * tk, rg = -1.75 * tk;
        const mx = 0 - Math.sin(ht) * 62, my = 62 * Math.cos(ht);
        const rim = [mx + 6 + 12 * (1 - tk), my + 8], cTarget = [rim[0] - Math.sin(rg) * 50, rim[1] + Math.cos(rg) * 50];
        const cRest = [hx + sd * 6, hy - 46];
        const c = [lerp(cRest[0], cTarget[0], lift), lerp(cRest[1], cTarget[1], lift)], rgl = rg * lift;
        gl = [c[0], c[1], rgl]; const grip = [c[0] + Math.cos(rgl) * 40 - Math.sin(rgl) * 18, c[1] + Math.sin(rgl) * 40 + Math.cos(rgl) * 18];
        hx = grip[0]; hy = grip[1] + 22;
      } else gl = [hx + sd * 6, hy - 46, 0];
    }
    const el = [lerp(sh[0], hx, 0.5) + sd * 30, lerp(sh[1], hy, 0.5) + 22];
    const tb = tube([sh, el, [hx, hy]], 50, 42);
    if (pass === 'back') { piece(tb.pts, PC.top, { raw: true, seed: 80 + sd, lw: 2.6 }); return; }    // плечо крепится за туловищем — без углов
    const fa = tube([el, [lerp(el[0], hx, 0.5), lerp(el[1], hy, 0.5)], [hx, hy]], 47, 42); piece(fa.pts, PC.top, { raw: true, seed: 84 + sd, lw: 2.6 });
    dot(el[0], el[1], 5, mix(PC.top, '#000000', 0.35), 0.8);                                            // «гвоздик»-шарнир локтя, как у бумажной куклы

    if (gl) glassAt(gl[0], gl[1], gl[2], o.glass ?? 0.7, { licked: o.licked });
    const c0 = tb.axis[tb.axis.length - 3], ang = Math.atan2(hy - c0[1], hx - c0[0]);
    push(hx, hy, 1, ang - Math.PI / 2);
    piece([[-26, -16], [26, -16], [26, 2], [-26, 2]], PC.topD, { seed: 86 + sd, step: 10, lw: 2.2 });         // манжета
    hand(pose, sd, o); pop();
  });
}
function hand(pose, sd, o) {
  if (pose === 'phone') { rectP(-24, 4, 48, 82, '#20242c', { seed: 90, lw: 2.4 }); rectP(-18, 10, 36, 66, o.phoneLit === false ? '#2c3440' : '#bfe3ff', { seed: 91, lw: 1.4, tex: false }); }
  const fist = pose === 'fist' || pose === 'glass' || pose === 'phone' || pose === 'belly';
  blobP(fist ? [[-26, -6], [26, -6], [30, 22], [0, 34], [-30, 22]] : [[-24, -6], [24, -6], [28, 34], [0, 46], [-28, 34]], PC.skin, { seed: 92 + sd, lw: 2.6 });
  if (fist) for (let q = 0; q < 3; q++) stroke([[-14 + q * 14, 20], [-14 + q * 14, 30]], PC.skinD, 2.6);
  else for (let q = 0; q < 3; q++) stroke([[-14 + q * 14, 22], [-14 + q * 14, 42]], PC.skinD, 2.6);
  blobP([[sd * 18, 2], [sd * 40, 12], [sd * 36, 28], [sd * 20, 22]], PC.skin, { seed: 94 + sd, lw: 2.4 });
  if (pose === 'point') { piece([[-8, 30], [8, 30], [7, 84], [-7, 84]], PC.skin, { seed: 96, lw: 2.4 }); stroke([[-4, 76], [4, 76]], PC.skinD, 2); }
}
function personHead(o) {
  const t = o.t ?? 0, mood = o.mood || '', lk = o.lk || [0, 0];
  // уши
  [-1, 1].forEach(sd => { ellP(sd * 96, 6, 16, 24, PC.skin, { seed: 100 + sd }); stroke([[sd * 96, -6], [sd * 102, 6], [sd * 96, 16]], PC.skinD, 3); });
  // голова: широкий овал с подбородком (взрослые пропорции)
  const head = [[0, -102], [72, -94], [98, -42], [98, 22], [82, 76], [44, 110], [0, 120], [-44, 110], [-82, 76], [-98, 22], [-98, -42], [-72, -94]];
  blobP(head, PC.skin, { seed: 101, shade: () => {
    const r = rng(102); ctx.fillStyle = PC.stub; if (o.stubble) for (let i = 0; i < 90; i++) { const a = 0.2 + r() * 2.7, rr = 0.6 + r() * 0.4, x = Math.cos(a) * 84 * rr, y = 44 + Math.sin(a) * 72 * rr; if (y < 60) continue; ctx.globalAlpha = 0.55; ctx.fillRect(x, y, 2.4, 2.4); }   // щетина
    ctx.globalAlpha = 1; if (o.freckles) [[-54, 28], [-44, 36], [-62, 40], [52, 30], [42, 38], [62, 42], [-50, 46], [50, 48]].forEach(([x, y]) => dot(x, y, 3, '#d58a5e', 0.85));     // веснушки
    ellP(-60, 40, 18, 10, '#f2a99a', { line: false, a: 0.3, tex: false }); ellP(60, 40, 18, 10, '#f2a99a', { line: false, a: 0.3, tex: false });
  } });
  // глаза-овалы (как в «ЮП»), мешки, веки
  const bl = Math.max(blinkAt(t, 3), o.blink ?? 0); let lid = bl ? 1 : (o.lid ?? 0.12);
  if (mood === 'sleepy') lid = Math.max(lid, 0.5); if (mood === 'shock' || mood === 'dread') lid = bl ? 1 : 0; if (mood === 'eww' || mood === 'sick') lid = Math.max(lid, 0.45);
  const big = mood === 'shock' ? 1.15 : 1;
  [-1, 1].forEach(sd => {
    const ex = sd * 28, ey = -10, rx = 28 * big, ry = 34 * big;
    if (lid > 0.95) { stroke([[ex - 24, ey + 4], [ex, ey + 10], [ex + 24, ey + 4]], PC.line, 5); return; }
    piece(ellPts(ex, ey, rx, ry, 0, 32), '#fbfaf6', { seed: 110 + sd, lw: 2.8, tex: false, shade: () => {
      const pr2 = mood === 'shock' || mood === 'dread' ? 5 : 7.5; dot(ex + lk[0] * 13 - sd * 3, ey + 4 + lk[1] * 12, pr2, '#140f0c');
      if (lid > 0.02) { const ly = ey - ry + lid * ry * 2; piece([[ex - rx - 3, ey - ry - 4], [ex + rx + 3, ey - ry - 4], [ex + rx + 3, ly], [ex - rx - 3, ly]], PC.skin, { raw: true, line: false }); stroke([[ex - rx, ly], [ex + rx, ly]], PC.line, 4); }
    } });
    stroke([[ex - 18, ey + ry + 8], [ex, ey + ry + 13], [ex + 18, ey + ry + 7]], '#b98974', 2.6, { a: 0.9 });              // мешки
  });
  // брови
  const br = o.brow ?? 0, ba = o.browA ?? 0;
  [-1, 1].forEach(sd => { const lift = br * 10 + sd * ba * 10, inner = mood === 'angry' || mood === 'eww' ? 12 : (mood === 'shock' || mood === 'dread' || mood === 'dumb' ? -9 : 0);
    piece([[sd * 10, -60 - lift + inner], [sd * 58, -66 - lift], [sd * 58, -56 - lift], [sd * 10, -50 - lift + inner]], PC.hair, { raw: true, lw: 2 }); });
  // нос — короткий штрих
  stroke([[4, 14], [12, 32], [0, 36]], '#b98974', 3.4);
  // рот
  const m = o.m || { open: 0, round: 0 };
  if (mood === 'eww' && m.open < 0.06) { mouth(0, 64, 54, { open: 0.35, round: 0 }, { noTeeth: true }); piece(spline([[-8, 76], [10, 76], [8, 100], [-6, 100]], true, 5), '#e07a8a', { raw: true, lw: 2.2 }); }
  else if (mood === 'dread' && m.open < 0.06) mouth(0, 64, 46, { open: 0.0 }, { smile: -0.9 });
  else if (o.scream) screamMouth(0, 62, 64, o.scream);
  else mouth(0, 62, 58, m, { smile: o.smile ?? (mood === 'dumb' ? 0.8 : 0), smirk: o.smirkN ?? 0 });
    hairdo(o.hair || 'short', o);
  if (o.beard) piece(spline([[-92, 30], [-70, 96], [-30, 128], [0, 134], [30, 128], [70, 96], [92, 30], [70, 70], [30, 92], [0, 88], [-30, 92], [-70, 70]], true, 6), PC.hair, { seed: 130, step: 10, edge: 1.1 });
  if (o.sweat) { const ph = (step(t) * 0.8) % 1; piece(spline([[118, -40 + ph * 50], [128, -20 + ph * 50], [118, -8 + ph * 50], [108, -20 + ph * 50]], true, 5), '#9fd8ff', { raw: true, lw: 2 }); }
}

/* причёски: 'shaggy' — лохматая шапка с чёлкой (как у Никиты) | 'short' — короткая | 'buzz' — под машинку | 'bald' | 'cap' — бейсболка | 'helmet' — каска */
function hairdo(kind, o) {
  if (kind === 'bald') { stroke([[-60, -80], [-20, -96]], '#ffffff', 6, { a: 0.35 }); return; }
  if (kind === 'buzz') { piece(spline([[-96, -30], [-90, -80], [-50, -112], [0, -120], [50, -112], [90, -80], [96, -30], [70, -60], [0, -84], [-70, -60]], true, 6), PC.hair, { seed: 131, a: 0.85, step: 10 }); return; }
  if (kind === 'shaggy') {
    const hair = [[-120, -10], [-126, -64], [-104, -110], [-62, -138], [-14, -150], [34, -146], [82, -128], [116, -92], [128, -44], [120, -6], [104, -34], [88, -52], [70, -40], [54, -64], [30, -48], [10, -70], [-12, -50], [-34, -72], [-54, -48], [-74, -66], [-92, -40], [-104, -52]].map(([x, y]) => [x * 0.87, y]);
    [[[90, -96], [122, -100], [104, -74]], [[-88, -92], [-118, -94], [-100, -68]], [[-20, -146], [-6, -160], [10, -146]]].forEach((tp, q) => piece(tp, PC.hair, { seed: 124 + q, step: 8 }));
    piece(hair, PC.hair, { seed: 120, step: 12, edge: 1.2, shade: () => { piece([[-70, -120], [-10, -140], [40, -134], [10, -112], [-40, -104]], PC.hairL, { seed: 122, line: false, a: 0.8 }); [[-80, -110, -40, -80], [-20, -130, 10, -96], [40, -128, 60, -90], [90, -100, 100, -70]].forEach(v => stroke([[v[0], v[1]], [v[2], v[3]]], PC.hairL, 5)); } });
    return; }
  if (kind === 'beanie') {                                           // вязаная шапка с отворотом (Joe)
    const c = o.capCol || '#2f5961', cd = mix(c, '#000000', 0.22);
    [-1, 1].forEach(sd => piece([[sd * 96, -40], [sd * 110, -40], [sd * 106, 10], [sd * 94, 6]], PC.hair, { seed: 134 + sd, lw: 1.8 }));   // виски
    piece(spline([[-106, -40], [-100, -104], [-56, -146], [0, -156], [56, -146], [100, -104], [106, -40]], true, 6).concat([[106, -40], [-106, -40]]), c, { seed: 136, step: 14, shade: () => {
      for (let x = -90; x <= 90; x += 22) stroke([[x * 0.9, -146 + Math.abs(x) * 0.25], [x, -60]], cd, 3, { a: 0.7 }); } });
    piece([[-114, -66], [114, -66], [112, -26], [-112, -26]], mix(c, '#ffffff', 0.06), { seed: 137, step: 12, lw: 2.4, shade: () => { for (let x = -104; x <= 104; x += 13) stroke([[x, -62], [x, -30]], cd, 2.4, { a: 0.6 }); } });
    return; }
  if (kind === 'cap' || kind === 'helmet') {
    const c = o.capCol || (kind === 'helmet' ? '#6b7a3a' : '#c8402c'), cd = mix(c, '#000000', 0.25);
    piece(spline([[-104, -28], [-100, -96], [-50, -138], [0, -146], [50, -138], [100, -96], [104, -28]], true, 6).concat([[104, -28], [-104, -28]]), c, { seed: 132, step: 14, shade: () => { stroke([[0, -144], [0, -34]], cd, 4); } });
    if (kind === 'cap') piece([[-20, -40], [130, -46], [150, -24], [-10, -22]], cd, { seed: 133, lw: 2.4 });   // козырёк вправо
    else { piece([[-122, -30], [122, -30], [116, -14], [-116, -14]], cd, { seed: 133, lw: 2.4 }); }
    [-1, 1].forEach(sd => piece([[sd * 98, -30], [sd * 112, -30], [sd * 108, 14], [sd * 96, 10]], PC.hair, { seed: 134 + sd, lw: 1.8 }));   // виски
    return; }
  // short: аккуратная короткая стрижка с пробором
  piece(spline([[-104, -6], [-108, -70], [-70, -124], [-10, -140], [56, -132], [100, -96], [108, -40], [104, -6], [92, -40], [70, -78], [20, -88], [-30, -82], [-80, -60], [-94, -30]], true, 6), PC.hair, { seed: 135, step: 12, edge: 1.0,
    shade: () => { stroke([[-30, -128], [-10, -90]], PC.hairL, 5); stroke([[20, -132], [50, -100]], PC.hairL, 4); } });
}

/* светоотражающая жилетка поверх верха: две полы, серебристые полосы, лямки через плечи (фирменная деталь Joe) */
function personVest(col) {
  const cd = mix(col, '#000000', 0.2), sil = '#e9ebe6';
  [-1, 1].forEach(sd => {
    const pts = [[sd * 30, 96], [sd * 74, 102], [sd * 98, 196], [sd * 104, 330], [sd * 26, 330], [sd * 24, 200]];
    piece(pts, col, { seed: 140 + sd, step: 16, shade: () => {
      piece([[sd * 60, 96], [sd * 110, 200], [sd * 110, 340], [sd * 80, 340]], cd, { line: false, a: sd > 0 ? 0.5 : 0.25, seed: 142 + sd });
      [236, 286].forEach((y, q) => piece([[sd * 10, y], [sd * 116, y - 2], [sd * 116, y + 18], [sd * 10, y + 18]], sil, { seed: 144 + sd + q * 3, step: 12, lw: 1.6, shade: () => { stroke([[sd * 14, y + 6], [sd * 112, y + 4]], '#ffffff', 3, { a: 0.8 }); } }));
      piece([[sd * 40, 92], [sd * 62, 94], [sd * 58, 236], [sd * 38, 236]], sil, { seed: 150 + sd, step: 12, lw: 1.6 });
    } });
  });
  rectP(-32, 168, 22, 34, '#f4f1ea', { seed: 152, lw: 1.6 }); stroke([[-28, 178], [-14, 178]], '#3d5c8f', 3); stroke([[-28, 188], [-16, 188]], '#9a958a', 2);   // бейджик
}

/* ================================================================= ГЕРОИ КАНАЛА «Paper Survivors» */
/* Joe — «каждый»: серое худи, оранжевая светоотражающая жилетка (узнаётся по цвету на обложке), бини цвета морской волны, щетина.
   Аксессуары (скотч, фонарик) — после joe() в том же layer, в точке кисти. */
const JOE = { pal: { top: '#7b828c', topD: '#5d636c', hair: '#5a3a26', hairL: '#7a5238', pants: '#3d4f6e', shoe: '#e9e4d8', skin: '#f2cfb4', skinD: '#dfae92', stub: '#7a5a48' },
  hair: 'beanie', capCol: '#2f6a6e', top: 'hoodie', vest: '#f2731c', stubble: 1 };
function joe(o = {}) { person({ ...JOE, ...o, pal: { ...JOE.pal, ...(o.pal || {}) } }); }

/* зомби: серо-зелёная кожа, рваная футболка, тусклые глаза; руки вперёд-в стороны; ноги шаркают (run на малой амплитуде через t/2) */
const ZPAL = [
  { skin: '#93b86a', skinD: '#76994f', hair: '#3a362c', hairL: '#4c473a', top: '#6e5a48', topD: '#4f4033', pants: '#45485a', shoe: '#5a5048', stub: '#5c6650' },
  { skin: '#a6c278', skinD: '#87a35c', hair: '#6a5a40', hairL: '#7c6a4c', top: '#5d6e7c', topD: '#45535e', pants: '#3e3a36', shoe: '#4a443c', stub: '#5c6650' },
  { skin: '#88b07a', skinD: '#6c915e', hair: '#26221c', hairL: '#3a342a', top: '#8a3e34', topD: '#6a2e26', pants: '#2f3646', shoe: '#3a3632', stub: '#5c6650' }];
function zombie(o = {}) {
  const v = o.v ?? 0, sway = Math.sin(step(o.t ?? 0, 8) * 2.2 + v) * 0.05;
  person({ pal: ZPAL[v % ZPAL.length], hair: ['shaggy', 'bald', 'short'][v % 3], top: 'tee', mood: 'dread', lid: 0.38, lk: [0, 0.3],
    arms: { l: [-150, 130, 'open'], r: [150, 110, 'open'] }, legs: 'stand', tilt: 0.12 + sway, lean: sway * 0.6, ...o, t: (o.t ?? 0) * 0.5 });
  zombieMarks(o);
}
/* приметы зомби поверх person(): тёмные круги у глаз, шов-царапина, рваный подол и дыры на одежде (та же геометрия, что у person) */
function zombieMarks(o) {
  const s = o.s ?? 1, tl = (o.tilt ?? 0.12);
  push(o.x, o.y, s, o.rot || 0, o.flip ? -1 : 1); push(0, 0, 1, o.lean || 0);
  piece([[-104, 318], [-80, 300], [-60, 334], [-34, 304], [-8, 338], [20, 306], [44, 336], [70, 302], [104, 318], [104, 340], [-104, 340]], '#2a2420', { raw: true, line: false, a: 0.55 });   // рваный подол
  ellP(-40, 220, 18, 12, '#3a2e26', { seed: 700, line: false, a: 0.6 }); ellP(50, 170, 12, 16, '#3a2e26', { seed: 701, line: false, a: 0.6 });
  push(0, 0, 1, tl); [-1, 1].forEach(sd => ellP(sd * 28, -4, 36, 42, '#3c4a2c', { seed: 702 + sd, line: false, a: 0.35, tex: false }));
  stroke([[40, -80], [70, -50]], '#5a2a22', 4); for (let q = 0; q < 3; q++) stroke([[44 + q * 9, -58 - q * 9], [56 + q * 9, -70 - q * 9]], '#5a2a22', 3);
  pop(); pop(); pop();
}
