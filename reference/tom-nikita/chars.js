/* Персонажи v4 — бумажная вырезка (по мотивам ранних «Южного парка», но взрослые и свои).
   ТОМ: толстый серо-бурый табби-«груша», большая голова-овал, НОРМАЛЬНЫЕ уши (кончики чуть загнуты — намёк на вислоухость),
        огромные кислотно-зелёные глаза с вертикальным зрачком, вечный прищур, белая морда, «М» на лбу, сидит «лапка на лапке».
   НИКИТА: худой бледный парень ~25 лет, тёмно-каштановая лохматая шевелюра, веснушки, лёгкая щетина, мешки под глазами,
        горчичное худи на размер больше, джинсы, белые кеды. В руках — телефон с фонариком и стакан молока. */

const VIS = { A: [0, 0], B: [0.28, 0], C: [0.55, 0.1], D: [0.95, 0], E: [0.6, 0.55], F: [0.32, 0.9], G: [0.2, 0], H: [0.45, 0], X: [0, 0] };
function mouthAt(who, t) {
  const ln = LINES.find(l => l.speaker === who && t >= l.start - 0.02 && t <= l.end + 0.05);
  if (!ln) return { open: 0, round: 0, talking: false };
  const tq = step(t, 12), cues = ln.visemes; let i = cues.length - 1; while (i > 0 && cues[i].s > tq) i--;   // рты меняются на двойках, как вырезанные замены
  const v = VIS[cues[i]?.v ?? 'X']; return { open: v[0], round: v[1], talking: true };
}
function blinkAt(t, seed) { const per = 3.3 + (seed % 5) * 0.47, ph = (step(t) + seed * 1.37) % per; return ph < 0.17 ? 1 : 0; }

const TC = { fur: '#8f8475', furD: '#6d6357', stripe: '#3e352e', light: '#efe8dc', pink: '#e98fa0', eye: '#b6e64a', eyeD: '#5f9a1e', line: '#1c1512' };
const NC = { skin: '#f6d6c2', skinD: '#e9b9a0', hair: '#4b2d20', hairL: '#6e4330', hood: '#d9a12b', hoodD: '#b47f17', jeans: '#3d5c8f', shoe: '#f1efe9', line: '#1c1512' };

/* рот-замена: линия / открытый тёмный рот с зубами и языком */
function mouth(x, y, w, m, o = {}) {
  const open = m.open ?? 0, round = m.round ?? 0, smile = o.smile ?? 0;
  if (o.clench) {                                                   // стиснутые зубы (тужится/больно)
    const hw = w * 0.62, hh = 16; piece([[x - hw, y - hh], [x + hw, y - hh + 2], [x + hw * 0.9, y + hh], [x - hw * 0.9, y + hh]], '#fbf7ef', { step: 10, lw: 2.4 });
    for (let i = -2; i <= 2; i++) stroke([[x + i * hw / 3, y - hh + 2], [x + i * hw / 3, y + hh - 2]], '#1c1512', 2); stroke([[x - hw, y], [x + hw, y]], '#1c1512', 2); return;
  }
  if (open < 0.06) { stroke([[x - w / 2, y - smile * 8], [x, y + 4 + smile * 6], [x + w / 2, y - smile * 8 - (o.smirk ?? 0) * 10]], '#1c1512', 4); return; }
  const hw = w / 2 * (1 - round * 0.45), d = 10 + open * 40;
  const P = spline([[x - hw, y - smile * 6], [x, y - 3], [x + hw, y - smile * 6 - (o.smirk ?? 0) * 8], [x + hw * 0.6, y + d * 0.75], [x, y + d], [x - hw * 0.6, y + d * 0.75]], true, 6);
  const path = piece(P, '#3a1414', { raw: true, lw: 3 });
  ctx.save(); ctx.clip(path); if (open > 0.25 && !o.noTeeth) { ctx.fillStyle = '#fbf7ef'; ctx.fillRect(x - hw, y - 12, hw * 2, 13); }
  ctx.fillStyle = '#d4606f'; ctx.beginPath(); ctx.ellipse(x, y + d, hw * 0.6, d * 0.35, 0, 0, 6.3); ctx.fill(); ctx.restore();
}

// =========================================================================================== ТОМ
/* o: x y s t flip | lid 0..1 (0.45 — прищур) | pup 0..1 (0 щель, 1 круг) | lk [x,y] | brow -1..1 | m {open,round} | smirk 0..1
      mood: ''|'strain'|'shock'|'bliss'|'pain'|'smug' | ears 0..1 (1 — прижаты) | sweat 0..1 | fur 0..1 (дыбом) | paw 0..1 (поднять правую) | body | tail */
function tom(o) {
  const t = o.t ?? 0, s = o.s ?? 1, mood = o.mood || '';
  const shake = mood === 'strain' || mood === 'pain' ? (rng(hsh(FRAME, 3))() - 0.5) * 6 * (o.shakeK ?? 1) : 0;
  push(o.x + shake, o.y, s, o.rot || 0, o.flip ? -1 : 1);
  if (o.body !== false) { const j = jig(11); push(j[0], j[1], 1, j[2]); tomBody(o); pop(); }
  const j = jig(12), bob = o.bob ?? 0; push(j[0], j[1] + bob, 1, j[2] + (o.tilt || 0)); tomHead(o); pop();
  if (o.body !== false && (o.paw ?? 0) > 0.02) tomPaw(o);
  pop();
}
function tomBody(o) {
  const t = o.t ?? 0, sw = Math.sin(step(t) * 1.6) * 10 + (o.tailK ?? 0) * 30;
  // хвост позади-сбоку, полосатый
  const tl = tube([[150, 330], [235, 300], [262, 200], [240 + sw * 0.4, 120], [205 + sw, 92]], 52, 38);
  piece(tl.pts, TC.fur, { raw: true, seed: 41, shade: () => { for (let i = 1; i < 5; i++) { const a = tl.axis[Math.floor(tl.axis.length * i / 5)]; stroke([[a[0] - 30, a[1] - 6], [a[0] + 30, a[1] + 6]], TC.stripe, 10); } const e = tl.axis[tl.axis.length - 1]; ellP(e[0], e[1], 26, 22, TC.light, { seed: 48, line: false }); } });
  // туловище-груша
  const body = [[0, 40], [125, 72], [192, 170], [200, 285], [150, 365], [0, 385], [-150, 365], [-200, 285], [-192, 170], [-125, 72]];
  blobP(body, TC.fur, { seed: 42, shade: () => {
    piece([[60, 40], [200, 160], [210, 300], [150, 380], [40, 390]], mix(TC.fur, TC.stripe, 0.22), { seed: 49, line: false, a: 0.55 });
    ellP(0, 255, 110, 125, TC.light, { seed: 43, line: false });
    piece([[-60, 140], [-34, 118], [-18, 150], [0, 112], [16, 150], [36, 118], [60, 140], [40, 170], [-40, 170]], TC.light, { seed: 50, line: false });
    [[-185, 190, -130, 200], [-195, 250, -135, 258], [-185, 310, -130, 312], [185, 190, 130, 200], [195, 250, 135, 258], [185, 310, 130, 312]].forEach(v => stroke([[v[0], v[1]], [v[2], v[3]]], TC.stripe, 11));
  } });
  // лапы: левая прямо, правая сверху крест-накрест
  ellP(-48, 372, 50, 27, TC.light, { seed: 44 }); [-1, 0, 1].forEach(k => stroke([[-48 + k * 16, 362], [-48 + k * 16, 384]], TC.line, 2.4));
  if ((o.paw ?? 0) < 0.02) { ellP(30, 362, 52, 26, TC.light, { seed: 45, rot: -0.35 }); [-1, 0, 1].forEach(k => stroke([[30 + k * 16 + 3, 350 + k * 5], [30 + k * 16 - 2, 372 + k * 5]], TC.line, 2.4)); }
}
function tomPaw(o) {                                                // поднятая правая лапа подушечками к зрителю («щас объясню»)
  const k = sm(o.paw), hx = lerp(30, o.pawX ?? 175, k), hy = lerp(362, o.pawY ?? 150, k);
  const lg = tube([[120, 200], [lerp(100, 160, k), lerp(300, 260, k)], [hx, hy + 30]], 66, 56); piece(lg.pts, TC.fur, { raw: true, seed: 46, lw: 2.6 });
  for (let q = 1; q < 3; q++) { const a = lg.axis[Math.floor(lg.axis.length * q / 3)]; stroke([[a[0] - 24, a[1]], [a[0] + 24, a[1] + 4]], TC.stripe, 8); }
  push(hx, hy, 1, -0.15); ellP(0, 0, 44, 46, TC.light, { seed: 47, lw: 2.6 });
  blobP([[-20, 8], [20, 8], [24, 30], [0, 38], [-24, 30]], TC.pink, { seed: 51, lw: 2 });
  [[-28, -14], [-10, -28], [10, -28], [28, -14]].forEach(([x, y], q) => ellP(x, y, 9, 11, TC.pink, { seed: 52 + q, lw: 1.8 }));
  pop();
}
function tomHead(o) {
  const t = o.t ?? 0, mood = o.mood || '', ears = o.ears ?? (mood === 'pain' || mood === 'strain' ? 0.6 : 0), fur = o.fur ?? (mood === 'shock' ? 1 : 0);
  // уши: треугольники, кончики загнуты вперёд (тёмный загиб), внутри розовое
  [-1, 1].forEach(sd => {
    push(sd * 108, -95, 1, sd * (0.15 + ears * 0.9)); const j = jig(20 + sd, 0.8); push(j[0], j[1], 1, j[2]);
    piece([[-sd * 52, 40], [sd * 6, -95], [sd * 56, 30]].map(([x, y]) => [x * sd * sd, y]), TC.fur, { seed: 21 + sd });
    piece([[-sd * 30, 26], [sd * 4, -62], [sd * 34, 20]], TC.pink, { seed: 23 + sd, lw: 1.8 });
    piece([[sd * 6, -95], [sd * 30, -58], [-sd * 14, -62]], TC.furD, { seed: 25 + sd, lw: 2.2 });            // загнутый кончик
    for (let q = 0; q < 3; q++) stroke([[-sd * 14 + q * sd * 12, 22], [-sd * 6 + q * sd * 10, -12 - q * 6]], '#fbf1ee', 2.4);
    pop(); pop();
  });
  // голова-овал с бакенбардами
  const R = [[0, -135], [95, -122], [158, -70], [178, 0], [190, 38], [168, 50], [182, 72], [150, 100], [90, 128], [0, 138], [-90, 128], [-150, 100], [-182, 72], [-168, 50], [-190, 38], [-178, 0], [-158, -70], [-95, -122]];
  const furK = 1 + fur * 0.12, head = R.map(([x, y], i) => [x * furK + (fur && i % 2 ? Math.sign(x) * 14 * fur : 0), y * furK]);
  blobP(head, TC.fur, { seed: 30, n: fur ? 2 : 8, shade: () => {
    // «М» на лбу
    const br = o.brow ?? 0;
    [[-34, -70, -30, -122], [-11, -78, -8, -132], [11, -78, 8, -132], [34, -70, 30, -122]].forEach((v, i) => stroke([[v[0], v[1] + (i < 2 ? br * 10 : br * 10) * (i % 3 === 0 ? 1 : 0.5)], [v[2], v[3]]], TC.stripe, 11));
    [-1, 1].forEach(sd => { stroke([[sd * 178, 10], [sd * 130, 22]], TC.stripe, 10); stroke([[sd * 182, 52], [sd * 135, 58]], TC.stripe, 10); });
  } });
  [-1, 1].forEach(sd => { piece([[sd * 186, 30], [sd * 222, 46], [sd * 190, 56], [sd * 214, 74], [sd * 176, 74]], TC.fur, { seed: 27 + sd, step: 8 }); });
  // глаза: огромные зелёные овалы, вертикальный зрачок, тяжёлое веко
  const lk = o.lk || [0, 0], bl = Math.max(blinkAt(t, 5), o.blink ?? 0);
  let lid = mood === 'bliss' || bl ? 1 : (o.lid ?? 0.45); if (mood === 'shock') lid = 0; if (mood === 'strain') lid = Math.max(lid, 0.62);
  [-1, 1].forEach(sd => {
    const ex = sd * 55, ey = -22, rx = 52, ry = 58;
    if (lid > 0.95) { stroke(mood === 'bliss' ? [[ex - 38, ey + 12], [ex, ey - 12], [ex + 38, ey + 12]] : [[ex - 40, ey + 6], [ex, ey + 14], [ex + 40, ey + 6]], TC.line, 6); return; }
    const ep = ellPts(ex, ey, rx, ry, 0, 36), path = piece(ep, TC.eye, { seed: 32 + sd, lw: 3.2, shade: () => {
      ellP(ex, ey + 14, rx * 0.9, ry * 0.72, mix(TC.eye, TC.eyeD, 0.35), { line: false, seed: 34 + sd, tex: false });
      const pw = lerp(7, 34, o.pup ?? 0.12) * (mood === 'shock' ? 0.45 : 1), ph = mood === 'shock' ? 26 : 44;
      ctx.fillStyle = '#0a0806'; ctx.beginPath(); ctx.ellipse(ex + lk[0] * 18, ey + 4 + lk[1] * 10, pw, ph, 0, 0, 6.3); ctx.fill();
      dot(ex - 16 + lk[0] * 6, ey - 22, 9, '#ffffff', 0.95); dot(ex + 18, ey + 18, 4, '#ffffff', 0.8);
      if (lid > 0.02) {                                             // веко цветом шерсти, срез наклонён бровью
        const br = o.brow ?? 0, tilt = (mood === 'angry' ? 0.35 : 0) - br * 0.15, ly = ey - ry + lid * ry * 2, dIn = sd * tilt * rx;
        const lp = [[ex - rx - 4, ey - ry - 6], [ex + rx + 4, ey - ry - 6], [ex + rx + 4, ly - dIn], [ex - rx - 4, ly + dIn]];
        piece(lp, TC.fur, { raw: true, line: false }); stroke([[ex - rx, ly + dIn], [ex + rx, ly - dIn]], TC.line, 5);
      }
    } });
  });
  // морда: белая «буква W», нос, рот
  [-1, 1].forEach(sd => ellP(sd * 33, 62, 46, 34, TC.light, { seed: 36 + sd, lw: 2.4 }));
  ellP(0, 92, 30, 18, TC.light, { seed: 38, line: false });
  const m = o.m || { open: 0, round: 0 };
  if (mood === 'strain' || mood === 'pain') mouth(0, 92, 64, m, { clench: m.open < 0.15, smile: -0.3 });
  else mouth(0, 88, 54, m, { smile: mood === 'bliss' ? 0.8 : 0.1, smirk: o.smirk ?? 0.4 });
  piece([[-18, 30], [18, 30], [0, 50]], TC.pink, { seed: 39, step: 8, lw: 2.4 });
  stroke([[0, 50], [0, m.open > 0.06 ? 84 : 86]], TC.line, 3);
  [-1, 1].forEach(sd => { for (let k = 0; k < 3; k++) { const yy = 58 + k * 13, wv = Math.sin(step(t) * 2 + k) * 3; stroke([[sd * 70, yy], [sd * 150, yy - 18 + k * 18 + wv], [sd * 215, yy - 34 + k * 34 + wv]], TC.line, 2.2, { a: 0.85 }); }
    for (let k = 0; k < 3; k++) dot(sd * (22 + k * 12), 66 + (k % 2) * 8, 3, TC.line, 0.8); });
  // пот и вена — когда тужится
  if ((o.sweat ?? (mood === 'strain' || mood === 'pain' ? 1 : 0)) > 0) { const ph = (step(t) * 0.9) % 1;
    [[150, -60], [-140, -30]].forEach(([x, y], i) => { const yy = y + ((ph + i * 0.5) % 1) * 60; piece(spline([[x, yy - 18], [x + 11, yy + 4], [x, yy + 16], [x - 11, yy + 4]], true, 5), '#9fd8ff', { raw: true, lw: 2 }); });
    stroke([[78, -110], [92, -96], [80, -88], [94, -76]], '#7a2b2b', 4, { smooth: false }); }
}

// =========================================================================================== НИКИТА
/* o: x y s t flip | lk | lid | brow | browA | mood: ''|'shock'|'dumb'|'angry'|'sleepy'|'dread'|'sick'|'eww' | m | smile
      arms {l:[hx,hy,'phone'|'glass'|'open'|'fist'|'point'|'belly'], r:[...]} (от центра головы) | glass 0..1 (молоко в стакане) | drink 0..1
      legs 'stand'|'run' | lean | belly 0..1 (бурлит) */
function nikita(o) {
  const t = o.t ?? 0, s = o.s ?? 1;
  push(o.x, o.y, s, o.rot || 0, o.flip ? -1 : 1);
  push(0, 0, 1, o.lean || 0);
  const jb = jig(51); push(jb[0], jb[1], 1, jb[2]); nikLegs(o); nikBody(o); pop();
  const dt = -0.14 * sm(((o.drink ?? 0) - 0.28) / 0.45); const jh = jig(52); push(jh[0], jh[1] + (o.bob ?? 0), 1, jh[2] + (o.tilt || 0) + dt); nikHead({ ...o, lid: (o.drink ?? 0) > 0.3 ? 1 : o.lid }); pop();
  nikArms(o);
  pop(); pop();
}
function nikLegs(o) {
  if (o.legs === 'sit') {                                            // сидит анфас: бёдра в ракурсе, колени, голени вниз
    [-1, 1].forEach(sd => {
      piece([[sd * 6, 300], [sd * 104, 300], [sd * 110, 372], [sd * 4, 372]], NC.jeans, { seed: 160 + sd, step: 18, shade: () => { piece([[sd * 6, 350], [sd * 110, 350], [sd * 110, 372], [sd * 4, 372]], mix(NC.jeans, '#000000', 0.15), { seed: 162 + sd, line: false }); } });
      piece([[sd * 20, 366], [sd * 92, 366], [sd * 86, 520], [sd * 26, 520]], NC.jeans, { seed: 164 + sd, step: 18 });
      piece([[sd * 22, 500], [sd * 90, 500], [sd * 90, 520], [sd * 22, 520]], mix(NC.jeans, '#000000', 0.18), { seed: 166 + sd, step: 10, lw: 2 });
      blobP([[sd * 18, 512], [sd * 96, 510], [sd * 106, 540], [sd * 14, 546]], NC.shoe, { seed: 168 + sd }); stroke([[sd * 14, 538], [sd * 104, 536]], '#c9c4b8', 4); });
    return;
  }
  const run = o.legs === 'run', ph = Math.sin(step(o.t ?? 0) * 18);
  [-1, 1].forEach(sd => { const sw = run ? ph * sd * 40 : 0;
    piece([[sd * 10, 318], [sd * 62, 318], [sd * 58 + sw, 486], [sd * 16 + sw, 486]], NC.jeans, { seed: 60 + sd, step: 20, shade: () => {
      stroke([[sd * 36, 330], [sd * 37 + sw * 0.6, 470]], mix(NC.jeans, '#ffffff', 0.25), 2.4, { a: 0.7 }); } });
    piece([[sd * 14 + sw, 466], [sd * 60 + sw, 466], [sd * 60 + sw, 486], [sd * 14 + sw, 486]], mix(NC.jeans, '#000000', 0.18), { seed: 64 + sd, step: 10, lw: 2 });
    blobP([[sd * 10 + sw, 478], [sd * 72 + sw, 476], [sd * 86 + sw, 502], [sd * 8 + sw, 508]], NC.shoe, { seed: 62 + sd });
    stroke([[sd * 10 + sw, 500], [sd * 84 + sw, 498]], '#c9c4b8', 4);
    for (let q = 0; q < 3; q++) stroke([[sd * (26 + q * 12) + sw, 482], [sd * (32 + q * 12) + sw, 488]], '#9a958a', 2.4); });
}
function nikBody(o) {
  // худи: трапеция на размер больше, капюшон за шеей, шнурки, карман
  rectP(-22, 84, 44, 30, NC.skinD, { seed: 69, lw: 2 });
  piece(spline([[-70, 92], [0, 80], [70, 92], [62, 120], [-62, 120]], true, 6), NC.hoodD, { seed: 70 });
  const body = [[-80, 104], [-52, 92], [52, 92], [80, 104], [100, 200], [104, 330], [-104, 330], [-100, 200]];
  piece(body, NC.hood, { seed: 71, step: 18, shade: () => {
    piece([[40, 92], [104, 200], [104, 330], [60, 330]], NC.hoodD, { seed: 75, line: false, a: 0.45 });
    piece([[-60, 248], [60, 248], [74, 322], [-74, 322]], mix(NC.hood, NC.hoodD, 0.35), { seed: 72, lw: 2.2 });
    stroke([[-104, 318], [104, 318]], NC.hoodD, 5);
    ellP(-48, 170, 22, 22, '#f6efe0', { seed: 76, lw: 1.8 }); [[-56, 164], [-48, 160], [-40, 164]].forEach(([x, y]) => dot(x, y, 3.2, NC.hoodD)); dot(-48, 176, 6, NC.hoodD);
    stroke([[0, 96], [0, 324]], NC.hoodD, 3, { a: 0.6 });
  } });
  const sw = Math.sin(step(o.t ?? 0) * 1.4) * 3;
  [-1, 1].forEach(sd => { stroke([[sd * 16, 104], [sd * 18 + sw, 160], [sd * 17 + sw, 196]], '#f4f1ea', 4); rectP(sd * 17 + sw - 5, 194, 10, 18, '#f4f1ea', { lw: 1.6, seed: 73 + sd }); });
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
function nikArms(o) {
  const A = o.arms || {}, dr = o.drink ?? 0;
  [['l', -1], ['r', 1]].forEach(([k, sd]) => {
    let a = A[k] || [sd * 112, 300, 'open']; let [hx, hy, pose] = a; const sh = [sd * 80, 112];
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
    const tb = tube([sh, el, [hx, hy]], 50, 42); piece(tb.pts, NC.hood, { raw: true, seed: 80 + sd, lw: 2.6 });
    if (gl) glassAt(gl[0], gl[1], gl[2], o.glass ?? 0.7, { licked: o.licked });
    const c0 = tb.axis[tb.axis.length - 3], ang = Math.atan2(hy - c0[1], hx - c0[0]);
    push(hx, hy, 1, ang - Math.PI / 2);
    piece([[-26, -16], [26, -16], [26, 2], [-26, 2]], NC.hoodD, { seed: 86 + sd, step: 10, lw: 2.2 });         // манжета
    hand(pose, sd, o); pop();
  });
}
function hand(pose, sd, o) {
  if (pose === 'phone') { rectP(-24, 4, 48, 82, '#20242c', { seed: 90, lw: 2.4 }); rectP(-18, 10, 36, 66, o.phoneLit === false ? '#2c3440' : '#bfe3ff', { seed: 91, lw: 1.4, tex: false }); }
  const fist = pose === 'fist' || pose === 'glass' || pose === 'phone' || pose === 'belly';
  blobP(fist ? [[-26, -6], [26, -6], [30, 22], [0, 34], [-30, 22]] : [[-24, -6], [24, -6], [28, 34], [0, 46], [-28, 34]], NC.skin, { seed: 92 + sd, lw: 2.6 });
  if (fist) for (let q = 0; q < 3; q++) stroke([[-14 + q * 14, 20], [-14 + q * 14, 30]], NC.skinD, 2.6);
  else for (let q = 0; q < 3; q++) stroke([[-14 + q * 14, 22], [-14 + q * 14, 42]], NC.skinD, 2.6);
  blobP([[sd * 18, 2], [sd * 40, 12], [sd * 36, 28], [sd * 20, 22]], NC.skin, { seed: 94 + sd, lw: 2.4 });
  if (pose === 'point') { piece([[-8, 30], [8, 30], [7, 84], [-7, 84]], NC.skin, { seed: 96, lw: 2.4 }); stroke([[-4, 76], [4, 76]], NC.skinD, 2); }
}
function nikHead(o) {
  const t = o.t ?? 0, mood = o.mood || '', lk = o.lk || [0, 0];
  // уши
  [-1, 1].forEach(sd => { ellP(sd * 96, 6, 16, 24, NC.skin, { seed: 100 + sd }); stroke([[sd * 96, -6], [sd * 102, 6], [sd * 96, 16]], NC.skinD, 3); });
  // голова: широкий овал с подбородком (взрослые пропорции)
  const head = [[0, -102], [72, -94], [98, -42], [98, 22], [82, 76], [44, 110], [0, 120], [-44, 110], [-82, 76], [-98, 22], [-98, -42], [-72, -94]];
  blobP(head, NC.skin, { seed: 101, shade: () => {
    const r = rng(102); ctx.fillStyle = '#8a6a58'; for (let i = 0; i < 90; i++) { const a = 0.2 + r() * 2.7, rr = 0.6 + r() * 0.4, x = Math.cos(a) * 84 * rr, y = 44 + Math.sin(a) * 72 * rr; if (y < 60) continue; ctx.globalAlpha = 0.55; ctx.fillRect(x, y, 2.4, 2.4); }   // щетина
    ctx.globalAlpha = 1; [[-54, 28], [-44, 36], [-62, 40], [52, 30], [42, 38], [62, 42], [-50, 46], [50, 48]].forEach(([x, y]) => dot(x, y, 3, '#d58a5e', 0.85));     // веснушки
    ellP(-60, 40, 18, 10, '#f2a99a', { line: false, a: 0.3, tex: false }); ellP(60, 40, 18, 10, '#f2a99a', { line: false, a: 0.3, tex: false });
  } });
  // глаза-овалы (как в «ЮП»), мешки, веки
  const bl = Math.max(blinkAt(t, 3), o.blink ?? 0); let lid = bl ? 1 : (o.lid ?? 0.12);
  if (mood === 'sleepy') lid = Math.max(lid, 0.5); if (mood === 'shock' || mood === 'dread') lid = bl ? 1 : 0; if (mood === 'eww' || mood === 'sick') lid = Math.max(lid, 0.45);
  const big = mood === 'shock' ? 1.15 : 1;
  [-1, 1].forEach(sd => {
    const ex = sd * 28, ey = -10, rx = 28 * big, ry = 34 * big;
    if (lid > 0.95) { stroke([[ex - 24, ey + 4], [ex, ey + 10], [ex + 24, ey + 4]], NC.line, 5); return; }
    piece(ellPts(ex, ey, rx, ry, 0, 32), '#fbfaf6', { seed: 110 + sd, lw: 2.8, tex: false, shade: () => {
      const pr2 = mood === 'shock' || mood === 'dread' ? 5 : 7.5; dot(ex + lk[0] * 13 - sd * 3, ey + 4 + lk[1] * 12, pr2, '#140f0c');
      if (lid > 0.02) { const ly = ey - ry + lid * ry * 2; piece([[ex - rx - 3, ey - ry - 4], [ex + rx + 3, ey - ry - 4], [ex + rx + 3, ly], [ex - rx - 3, ly]], NC.skin, { raw: true, line: false }); stroke([[ex - rx, ly], [ex + rx, ly]], NC.line, 4); }
    } });
    stroke([[ex - 18, ey + ry + 8], [ex, ey + ry + 13], [ex + 18, ey + ry + 7]], '#b98974', 2.6, { a: 0.9 });              // мешки
  });
  // брови
  const br = o.brow ?? 0, ba = o.browA ?? 0;
  [-1, 1].forEach(sd => { const lift = br * 10 + sd * ba * 10, inner = mood === 'angry' || mood === 'eww' ? 12 : (mood === 'shock' || mood === 'dread' || mood === 'dumb' ? -9 : 0);
    piece([[sd * 10, -60 - lift + inner], [sd * 58, -66 - lift], [sd * 58, -56 - lift], [sd * 10, -50 - lift + inner]], NC.hair, { raw: true, lw: 2 }); });
  // нос — короткий штрих
  stroke([[4, 14], [12, 32], [0, 36]], '#b98974', 3.4);
  // рот
  const m = o.m || { open: 0, round: 0 };
  if (mood === 'eww' && m.open < 0.06) { mouth(0, 64, 54, { open: 0.35, round: 0 }, { noTeeth: true }); piece(spline([[-8, 76], [10, 76], [8, 100], [-6, 100]], true, 5), '#e07a8a', { raw: true, lw: 2.2 }); }
  else if (mood === 'dread' && m.open < 0.06) mouth(0, 64, 46, { open: 0.0 }, { smile: -0.9 });
  else mouth(0, 62, 58, m, { smile: o.smile ?? (mood === 'dumb' ? 0.8 : 0), smirk: o.smirkN ?? 0 });
  if (o.milkMoustache) piece(spline([[-36, 52], [0, 44], [36, 52], [30, 62], [0, 56], [-30, 62]], true, 5), '#fbfcf8', { raw: true, lw: 2 });
  // шевелюра: лохматая бумажная «шапка» с чёлкой
  const hair = [[-120, -10], [-126, -64], [-104, -110], [-62, -138], [-14, -150], [34, -146], [82, -128], [116, -92], [128, -44], [120, -6], [104, -34], [88, -52], [70, -40], [54, -64], [30, -48], [10, -70], [-12, -50], [-34, -72], [-54, -48], [-74, -66], [-92, -40], [-104, -52]].map(([x, y]) => [x * 0.87, y]);
  [[[90, -96], [122, -100], [104, -74]], [[-88, -92], [-118, -94], [-100, -68]], [[-20, -146], [-6, -160], [10, -146]]].forEach((tp, q) => piece(tp, NC.hair, { seed: 124 + q, step: 8 }));
  piece(hair, NC.hair, { seed: 120, step: 12, edge: 1.2, shade: () => { piece([[-70, -120], [-10, -140], [40, -134], [10, -112], [-40, -104]], NC.hairL, { seed: 122, line: false, a: 0.8 }); [[-80, -110, -40, -80], [-20, -130, 10, -96], [40, -128, 60, -90], [90, -100, 100, -70]].forEach(v => stroke([[v[0], v[1]], [v[2], v[3]]], NC.hairL, 5)); } });
  if ((o.foil ?? 0) > 0) foilHat(o.foilLift ?? 0, t);
  if (o.sweat) { const ph = (step(t) * 0.8) % 1; piece(spline([[118, -40 + ph * 50], [128, -20 + ph * 50], [118, -8 + ph * 50], [108, -20 + ph * 50]], true, 5), '#9fd8ff', { raw: true, lw: 2 }); }
}

function foilHat(lift, t) {                                          // мятая фольга конусом; lift — приподнята над головой
  push(lift * 30, -lift * 120, 1, -lift * 0.25);
  const P = [[-118, -78], [-96, -132], [-52, -180], [-8, -248], [18, -236], [56, -176], [100, -128], [120, -80], [60, -64], [0, -60], [-60, -66]];
  piece(P, '#c9d1d8', { seed: 700, step: 10, edge: 1.6, lw: 3, texA: 0.25, shade: () => {
    const r = rng(701); for (let i = 0; i < 16; i++) { const x = -100 + r() * 200, y = -230 + r() * 160, w = 18 + r() * 30; piece([[x, y], [x + w, y + 6 + r() * 10], [x + w * 0.4, y + 18 + r() * 14]], r() < 0.5 ? '#eef3f6' : '#9ea9b2', { raw: true, line: false, tex: false, a: 0.9 }); }
    for (let i = 0; i < 7; i++) { const x = -90 + r() * 180, y = -200 + r() * 120; stroke([[x, y], [x + 14 + r() * 20, y + 10], [x + 6, y + 24]], '#7d8891', 2, { a: 0.7 }); }
  } });
  piece([[-122, -86], [122, -86], [124, -64], [-124, -64]], '#b7c0c8', { seed: 702, step: 10, lw: 2.6 });
  dot(30, -200, 6, '#ffffff', 0.9); dot(-50, -150, 4, '#ffffff', 0.8);
  pop();
}
