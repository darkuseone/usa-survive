/* Шортсы 9:16 из сцен эп. 1 (общий модуль, грузится после ch0…ch7.js эп. 1 и e01_lines.js).
   Страница 1080×1920 (PW×PH), мир сцен — 1920×1080 (W×H). Сцена эп. 1 играет по своему времени te; кадр шортса — вертикальное окно
   в горизонтальном плане (CROP по имени плана: центр x, панорама, зум) или «фото на скотче» поверх пробки для вставок во всю ширину ('fit').
   Шортс (short.js) объявляет: HOOK {text, until, seed}, SEGS [{t0, te0, rate, tr: 'cut'|'whip'|'flash', kind: 'e1'|'rewind'|'end', …}], ENDC.
   Матрица BASE (engine.js) — мир→холст: экранные оверлеи сцен эп. 1 (переходы) рисуются в ней же и кадрируются вместе со сценой. */
const E1SHOTS = SHOTS.splice(0), E1FRAME = frame;
SHOTS.push([0, 'v']); SH.v = () => {};
for (const k in CUE) delete CUE[k];
const VK = PH / H;                                                      // 1.778: высота мира = высота кадра
const SRC = k => k.replace(/^x\d+_/, '');                               // ключ реплики шортса → ключ реплики эп. 1
const TRN = { whip: 0.28, flash: 0.28 };
let VFIT = false, VDX = 0, VT = 0, VREW = false;                                 // VT — время шортса в текущем кадре

function e1shot(te) { let lo = 0, hi = E1SHOTS.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (E1SHOTS[m][0] <= te) lo = m; else hi = m - 1; } return lo; }
function e1(te) { SHOTS.splice(0, SHOTS.length, ...E1SHOTS); try { E1FRAME(te); } finally { SHOTS.splice(0, SHOTS.length, [0, 'v']); } }
function mat(s, rot, cx, cy, fx, fy, dx = 0) { const c = Math.cos(rot) * s, n = Math.sin(rot) * s; return [c, n, -n, c, cx + dx - (fx * c - fy * n), cy - (fx * n + fy * c)]; }
function kfx(K, u) { if (u <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (u < K[i][0]) { const a = K[i - 1], b = K[i]; return lerp(a[1], b[1], eio((u - a[0]) / (b[0] - a[0]))); } return K[K.length - 1][1]; }

// ---------- кадрирование планов эп. 1: x центра окна (мир 1920), {k: [[u, x]…]} — панорама по времени плана, 'fit' — вставка целиком
const CROP = {
  ext0: 760, wide0: 740, mid0: 980, door0: 1040, shock0: 880, zomb0: 900, run0: 950, btnIns: 960, shut0: 1420, day0: 940,
  c3alarm: 960, c3bump: 800, ringIns: { fit: 0.58 }, c3horde: { k: [[0, 700], [4.4, 1250]] }, weightIns: 1000, c3bend: { k: [[0, 760], [3.2, 1300]] },
  dontIns: { fit: 0.62 }, c3hide: 1000, c3rule: { fit: 0.9, fx: 960, fy: 560 }, c3drift: 960, c3knock: 960,
  c4win: 960, c4crawl: 920, c4inch: 960, c4dee: 960, c4truck: { k: [[0, 850], [3.8, 1450]] }, c4deeTalk: 1000, mapIns: { fit: 0.6, fx: 980 }, choiceIns: { fit: 0.7 },
  c4ask: 960, c4bottles: 960, c4leave: 1120, c4again: 1600,
  c5bottle: 960, c5think: 960, heaterIns: { fit: 0.75, fx: 1060 }, c5drain: 960, c5mistake: 880, c5click: 960, c5inside: { k: [[0, 640], [1.7, 640], [3.0, 1340]] },
  c5run: { k: [[0, 1000], [3.1, 680]] }, c5hold: 1100, c5fog: 960, handsetIns: { fit: 0.8, fx: 900 }, c5bang: 1040, c5speaker: 960, c5out: 960, c5slam: { k: [[0, 850], [3.9, 1100]] }, county2Ins: { fit: 0.58 },
  c6lights: 960, c6truck: 900, c6dee: 940, c6pump: 1150, c6pound: 1200, crowbarIns: { fit: 0.62 }, c6calm: 960, c6horde: 960, c6flee: 960, c6look: 960
};
const cropOf = nm => CROP[nm] ?? (/^card|Ins$/.test(nm) ? 'fit' : 960);

// ---------- фон для вставок «на скотче»: тёмная пробка, белая рамка фото, скотч по углам
function backdrop(dx = 0) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, dx, 0); S = 1;
  rectP(-40, -40, PW + 80, PH + 80, '#3b2d22', { seed: 7001, line: false, step: 90, shade: () => { const r = rng(7002); for (let i = 0; i < 1500; i++) dot(r() * PW, r() * PH, 1 + r() * 2.4, r() < 0.5 ? '#2a1f17' : '#5a4532', 0.6); } });
  ctx.restore();
}
function photo(B, fn, o = {}) {                                         // B — матрица мир→холст; fn рисует мир 0…W×0…H
  ctx.save(); ctx.setTransform(...B); S = 1;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18;
  piece([[-34, -34], [W + 34, -34], [W + 34, H + (o.chin ?? 34)], [-34, H + (o.chin ?? 34)]], '#f6f1e4', { seed: 7010, step: 60, lw: 3 }); ctx.restore();
  ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip(); BASE = B; fn(); ctx.restore();
  ctx.save(); ctx.setTransform(...B); S = 1; tape(40, -20, 260, -0.6, 7011); tape(W - 40, -20, 260, 0.62, 7012); if (o.tape4) { tape(40, H + 20, 260, 0.6, 7013); tape(W - 40, H + 20, 260, -0.6, 7014); } ctx.restore();
}

// ---------- кадр сцены эп. 1 по времени te (dx — сдвиг для «хлыста»)
function drawE1(te, dx = 0) {
  const i = e1shot(te), [t0, nm] = E1SHOTS[i], u = te - t0, sp = cropOf(nm); VDX = dx;
  if (sp === 'fit' || sp.fit) { VFIT = true; backdrop(dx); photo(mat(sp.fit ?? 0.56, -0.014, 540, 880, sp.fx ?? 960, sp.fy ?? 540, dx), () => e1(te)); VFIT = false; return; }
  const z = (sp.z ?? 1) * Math.min(1.09, 1 + 0.018 * u), s = VK * z, hw = PW / 2 / s, hh = PH / 2 / s;
  const fx = clamp(typeof sp === 'number' ? sp : sp.k ? kfx(sp.k, u) : (sp.fx ?? 960), hw, W - hw), fy = clamp(sp.fy ?? 520, hh, H - hh);
  BASE = mat(s, 0, PW / 2, PH / 2, fx, fy, dx); ctx.save(); ctx.setTransform(...BASE); S = 1; e1(te); ctx.restore();
}
const teOf = (s, t) => s.te0 + (t - s.t0) * (s.rate ?? 1);
function segAt(t) { let i = 0; while (i < SEGS.length - 1 && t >= SEGS[i + 1].t0) i++; return i; }

// перемотка назад (флешфорвард → «семь дней назад»): сцены эп. 1 мелькают в обратную сторону, VHS-полосы
function rewind(s, t, dx) {
  const u = t - s.t0, te = Math.max(0.6, s.te0 - u * s.speed); VREW = true; drawE1(te, dx); VREW = false;   // при перемотке штампы сцен не показываем
  ctx.save(); ctx.setTransform(1, 0, 0, 1, dx, 0); S = 1; const r = rng(hsh(Math.floor(t * 24), 71));
  ctx.fillStyle = 'rgba(20,30,60,0.28)'; ctx.fillRect(0, 0, PW, PH);
  for (let i = 0; i < 6; i++) { const y = r() * PH, h = 8 + r() * 40; ctx.fillStyle = `rgba(255,255,255,${0.08 + r() * 0.18})`; ctx.fillRect(0, y, PW, h); }
  for (let y = 0; y < PH; y += 6) { ctx.fillStyle = 'rgba(0,0,0,0.16)'; ctx.fillRect(0, y, PW, 2); }
  ctx.restore();
}

// ---------- финальная карточка: фото полного ролика, «ALL 30 DAYS», стрелка вниз — на ссылку Related video
function endCard(s, t, dx) {
  const u = t - s.t0; backdrop(dx);
  const k = popK(t, s.t0 + 0.05, 0.45), B = mat(0.44 * (0.85 + 0.15 * k), -0.035, 540, 740, 960, 540, dx);
  photo(B, () => e1(s.photoTe + u * 0.5), { chin: 150, tape4: false });
  ctx.save(); ctx.setTransform(...B); S = 1;                            // «кнопка» ▶ на фото и подпись на полях полароида
  push(960, 540, 1 + 0.06 * Math.sin(u * 5)); ellP(0, 0, 120, 120, '#d8342c', { seed: 7020, lw: 3 }); piece([[-38, -62], [66, 0], [-38, 62]], '#fbf8f0', { seed: 7021, lw: 2 }); pop();
  txt(s.caption || 'the full story', W / 2, H + 88, 120, { font: 'Hand', col: '#1c1512' }); ctx.restore();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, dx, 0); S = 1;
  if (t > s.t0 + 0.15) { push(540, 300, 1, -0.04); ransom(s.title, 0, 0, 120, s.seed || 7030, { reveal: pr(t, s.t0 + 0.15, s.t0 + 0.5), pop: true, maxW: 960 }); pop(); }
  if (t > s.t0 + 0.45) { push(540, 1170, 1, 0.02); label0(0, 0, s.cta || 'FULL VIDEO ON MY CHANNEL', 0, '#ffd21f', 0.02, 54); pop(); }
  const a = pr(t, s.t0 + 0.8, s.t0 + 1.3);                              // стрелка рисуется к ссылке под роликом
  if (a > 0) { const P = []; for (let i = 0; i <= 24 * a; i++) { const q = i / 24; P.push([lerp(820, 250, q) + Math.sin(q * 3.1) * 110, lerp(1400, 1640, q)]); }
    if (P.length > 1) { stroke(P, '#1c1512', 30); stroke(P, '#ffd21f', 18);
      if (a >= 1) { const e = P[P.length - 1], p = P[P.length - 4], an = Math.atan2(e[1] - p[1], e[0] - p[0]); push(e[0], e[1], 1, an); piece([[34, 0], [-30, -34], [-16, 0], [-30, 34]], '#ffd21f', { seed: 7031, lw: 3 }); pop(); } } }
  ctx.restore();
}

function drawSeg(s, t, dx = 0) {
  if (s.kind === 'end') return endCard(s, t, dx);
  if (s.kind === 'rewind') return rewind(s, t, dx);
  drawE1(teOf(s, t), dx);
}
frame = function (t) {
  VT = t; const i = segAt(t), s = SEGS[i], u = t - s.t0;
  if (s.tr === 'whip' && i > 0 && u < TRN.whip) {
    const e = eio(u / TRN.whip); drawSeg(SEGS[i - 1], t, -e * PW * 1.05); drawSeg(s, t, (1 - e) * PW * 1.05);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 0.45 * Math.sin(e * Math.PI); ctx.drawImage(ctx.canvas, -50, 0); ctx.drawImage(ctx.canvas, 50, 0); ctx.restore(); return;
  }
  drawSeg(s, t);
  if (s.tr === 'flash' && u < TRN.flash) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(255,250,240,${1 - u / TRN.flash})`; ctx.fillRect(0, 0, PW, PH); ctx.restore(); }
};

// ---------- надписи сцен эп. 1 в вертикальном окне: штампы и плашки — в экранных координатах, по центру, в верхней половине
const stamp0 = stamp, label0 = label;
function vText(x, y, fn, band = [640, 620, 1150, 0.8], dy = 0) { const pS = S, X = PW / 2 + clamp((x - 960) * 0.25, -170, 170); ctx.save(); ctx.setTransform(1, 0, 0, 1, VDX, 0); S = 1; push(X, clamp(band[0] + (y - 200) * band[3], band[1], band[2]) + dy); fn(2 * Math.min(X, PW - X) - 70); pop(); ctx.restore(); S = pS; }
stamp = function (word, t, t0, x, y, size = 130, seed = 3000, rot = -0.04, bgs) {
  if (VFIT) return stamp0(word, t, t0, x, y, size, seed, rot, bgs);
  const age = t - t0; if (VREW || age < 0 || age > 2.4 || VT - age < HOOK.until) return;   // штамп живёт 2,4 с; появившиеся под крючком — не показываем
  ctx.save(); ctx.globalAlpha = 1 - pr(age, 2.1, 2.4);
  vText(x, y, mw => { push(0, 0, 1, rot); ransom(word, 0, 0, size * 1.15, seed, { reveal: pr(t, t0, t0 + 0.25), pop: true, bgs, maxW: mw }); pop(); }, undefined, word === 'KNOCK' ? (x - 330) / 430 * 150 : 0); ctx.restore();    // три стука — лесенкой
};
label = function (x, y, s, w, col, rot, size) {
  if (VFIT) return label0(x, y, s, w, col, rot, size);
  if (VREW || VT < HOOK.until) return; vText(x, y, mw => label0(0, 0, s, w, col, rot, Math.min((size ?? 46) * 1.2, (mw - 80) / (s.length * 0.62))), [930, 900, 1160, 0.3]);   // плашки — ниже штампов
};

// ---------- поверх кадра: счётчик дня (вверху справа), крючок-заголовок (первые секунды), субтитры по слову
function vSub(t) {
  let lo = 0, hi = SUBW.length - 1, k = -1; while (lo <= hi) { const m = (lo + hi) >> 1; if (SUBW[m].s - 0.03 <= t) { k = m; lo = m + 1; } else hi = m - 1; }
  if (k < 0 || t > SUBW[k].e) return; const w = SUBW[k].w.replace(/[.,!?…;"“”]/g, '').replace(/:(?!\d)/g, '').toUpperCase(); if (!w) return;
  const p = clamp((t - SUBW[k].s + 0.03) / 0.09), sc = 0.82 + 0.18 * eo(p), hot = HOT.test(w.replace(/'S$/, ''));
  push(PW / 2, 1330, sc); ctx.save(); ctx.font = `600 ${Math.min(96, 980 / Math.max(1, w.length * 0.52))}px 'Osw'`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 20; ctx.lineWidth = 15; ctx.strokeStyle = '#141010'; ctx.strokeText(w, 0, 0); ctx.shadowBlur = 0;
  ctx.fillStyle = hot ? '#ffd21f' : '#fbf8f0'; ctx.fillText(w, 0, 0); ctx.restore(); pop();
}
function vDay(t, i, s) {
  const te = teOf(s, t), d = dayAt(te), ps = i > 0 ? SEGS[i - 1] : null, pd = ps && ps.kind !== 'end' ? dayAt(teOf(ps, s.t0 - 0.01))[1] : null;
  push(PW - 158, 232, 0.86); push(-(W - 175), -138);
  if ((pd === null || pd !== d[1] || ps.kind === 'rewind') && t - s.t0 < 1.4) dayTag(t, d[1], { clock: d[2], stamp: s.t0 + 0.1 });
  else if (d[0] > 0 && te >= d[0] && te - d[0] < 1.4) dayTag(te, d[1], { clock: d[2], stamp: d[0] + 0.15 });
  else dayTag(te, d[1], { clock: d[2] });
  pop(); pop();
}
hudFrame = function (t) {
  const i = segAt(t), s = SEGS[i];
  if (s.kind !== 'end' && s.kind !== 'rewind' && !(s.tr === 'whip' && t - s.t0 < TRN.whip * 0.5)) vDay(t, i, s);
  if (t < HOOK.until) { const a = 1 - pr(t, HOOK.until - 0.25, HOOK.until), L = HOOK.text.split('|');          // крючок: 1–2 строки ransom
    L.forEach((ln, j) => { push(PW / 2 - 20 + j * 40, 420 + j * 150, 0.9 + 0.1 * a, -0.035 + j * 0.03); ctx.globalAlpha = a; ransom(ln, 0, 0, 130, HOOK.seed + j * 17, { reveal: pr(t, 0.05 + j * 0.3, 0.4 + j * 0.3), pop: true, maxW: 900 }); ctx.globalAlpha = 1; pop(); }); }
  const r = SEGS.find(x => x.kind === 'rewind');                         // «7 DAYS EARLIER» поверх перемотки
  if (r && s === r) { const u = t - r.t0; push(PW / 2, 760, 1, -0.03); ransom(r.text, 0, 0, 110, 7040, { reveal: pr(u, 0.05, 0.35), pop: true, maxW: 960 }); pop();
    txt('◀◀', 120, 150, 70, { font: "'Courier 10 Pitch'", weight: 700, col: '#fbf8f0' }); }
  vSub(t);
};

// цветокоррекция как у длинного ролика (насыщенность, контраст, свечение, зерно, виньетка) — под вертикальный холст
post = function (t, o) {
  o.save(); o.filter = 'saturate(1.18) contrast(1.06) brightness(1.03)'; o.drawImage(o.canvas, 0, 0); o.restore();
  o.save(); o.globalCompositeOperation = 'screen'; o.globalAlpha = 0.16; o.filter = 'blur(16px) brightness(0.9)'; o.drawImage(o.canvas, 0, 0); o.restore();
  o.save(); o.globalCompositeOperation = 'overlay'; o.globalAlpha = 0.05; const fr = Math.floor(t * 12), gx = -(hsh(fr) % 256), gy = -(hsh(fr, 7) % 256);
  for (let x = gx; x < PW; x += 512) for (let y = gy; y < PH; y += 512) o.drawImage(GRAIN, x, y); o.restore();
  const v = o.createRadialGradient(PW / 2, PH * 0.48, PW * 0.45, PW / 2, PH * 0.5, PH * 0.62); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.36)'); o.save(); o.fillStyle = v; o.fillRect(0, 0, PW, PH); o.restore();
};

// реплики шортса, взятые из эп. 1: сегмент на начало каждой, склейка «хлыстом», если время эп. 1 прыгает
function lineSegs(keys, o = {}) { return keys.map(k => ({ t0: LS(k), te0: LS(SRC(k)), ...(o[k] || {}) })); }
function finishSegs() {
  SEGS.sort((a, b) => a.t0 - b.t0);
  SEGS.forEach((s, i) => { s.kind = s.kind || 'e1'; if (s.tr) return; if (i === 0) { s.tr = 'cut'; return; }
    const p = SEGS[i - 1]; s.tr = p.kind === 'e1' && s.kind === 'e1' && Math.abs(teOf(p, s.t0) - s.te0) < 0.8 ? 'cut' : 'whip'; });
  window.EXPORT = { segs: SEGS.map(s => ({ t0: s.t0, te0: s.te0 ?? null, rate: s.rate ?? 1, tr: s.tr, kind: s.kind, speed: s.speed ?? null })), DUR };
}
