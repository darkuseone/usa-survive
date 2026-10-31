/* Общий реквизит «Аппликации»: свет (lightmap), пробковая доска, карточки, капля, пузырь, человечек-иконка, штамп-крест, галочка,
   стакан, телефон-вырезка, пачка денег, часы. Реквизит конкретной декорации — в episodes/<эп>/set.js. */


// ------------------------------------------------------------------ свет: карта освещения (multiply) + свечения
const LM = document.createElement('canvas'); LM.width = W; LM.height = H;
/* lights: fn рисует на карте света в текущих координатах камеры; amb — цвет темноты */
function lightmap(amb, fn) {
  const g = LM.getContext('2d'), prev = ctx, pS = S; g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.fillStyle = amb; g.fillRect(0, 0, W, H);
  g.setTransform(prev.getTransform()); g.globalCompositeOperation = 'lighter'; ctx = g; fn(); ctx = prev; S = pS;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(LM, 0, 0); ctx.restore();
}
function radial(x, y, r, col, a = 1) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore(); }
function cone(x0, y0, x1, y1, w, col, a = 1) {                     // луч фонарика
  const ang = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0) * 1.25, nx = -Math.sin(ang), ny = Math.cos(ang);
  const g = ctx.createLinearGradient(x0, y0, x0 + Math.cos(ang) * L, y0 + Math.sin(ang) * L); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x0 + nx * 10, y0 + ny * 10); ctx.lineTo(x0 + Math.cos(ang) * L + nx * w, y0 + Math.sin(ang) * L + ny * w); ctx.lineTo(x0 + Math.cos(ang) * L - nx * w, y0 + Math.sin(ang) * L - ny * w); ctx.lineTo(x0 - nx * 10, y0 - ny * 10); ctx.fill(); ctx.restore();
}
function glowAdd(x, y, r, col, a = 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; radial(x, y, r, col, a); ctx.restore(); }

// ------------------------------------------------------------------ коридор
function clockP(x, y, r, h, m, sec) {
  ellP(x, y, r, r, '#f4efe2', { seed: 501, lw: 3 }); ellP(x, y, r * 0.12, r * 0.12, '#1c1512', { line: false });
  for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; stroke([[x + Math.cos(a) * r * 0.74, y + Math.sin(a) * r * 0.74], [x + Math.cos(a) * r * 0.86, y + Math.sin(a) * r * 0.86]], '#1c1512', 3); }
  const ah = ((h % 12) + m / 60) / 12 * 6.283 - 1.5708, am = m / 60 * 6.283 - 1.5708; stroke([[x, y], [x + Math.cos(ah) * r * 0.48, y + Math.sin(ah) * r * 0.48]], '#1c1512', 6); stroke([[x, y], [x + Math.cos(am) * r * 0.72, y + Math.sin(am) * r * 0.72]], '#1c1512', 4);
  if (sec !== undefined) { const as = sec / 60 * 6.283 - 1.5708; stroke([[x, y], [x + Math.cos(as) * r * 0.75, y + Math.sin(as) * r * 0.75]], '#d8342c', 2); }
}
function cork() {                                                    // пробковая доска
  rectP(-200, -200, W + 400, H + 400, '#b5895a', { seed: 540, line: false, step: 60, shade: () => { const r = rng(541); for (let i = 0; i < 2600; i++) dot(-200 + r() * (W + 400), -200 + r() * (H + 400), 1 + r() * 2.2, r() < 0.5 ? '#8f6438' : '#d1a774', 0.7); } });
}
function card(x, y, w, h, rot, seed, col = '#f6f1e4') { push(x, y, 1, rot); piece([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], col, { seed, step: 30, lw: 2 }); pop(); }
function drop(x, y, s, seed) { push(x, y, s); piece(spline([[0, -34], [18, -4], [20, 14], [0, 28], [-20, 14], [-18, -4]], true, 5), '#5ab6ef', { raw: true, lw: 2.4 }); dot(-6, 2, 5, '#dff4ff', 0.9); pop(); }
function bubble(x, y, r, seed) { ellP(x, y, r, r, 'rgba(190,255,150,0.55)', { seed, lw: 2.2, tex: false }); dot(x - r * 0.35, y - r * 0.35, r * 0.18, '#ffffff', 0.85); }
function personIcon(x, y, s, col, seed) { push(x, y, s); ellP(0, -70, 34, 34, col, { seed, lw: 2.6 }); piece(spline([[-54, 70], [-46, -16], [0, -34], [46, -16], [54, 70]], true, 6), col, { seed: seed + 1, raw: true, lw: 2.6 }); pop(); }
function stampX(x, y, s, k) { if (k <= 0) return; push(x, y, s * (1.6 - 0.6 * k), 0.1); ctx.globalAlpha = 0.9; stroke([[-50, -50], [50, 50]], '#d8342c', 18); stroke([[50, -50], [-50, 50]], '#d8342c', 18); ctx.globalAlpha = 1; pop(); }
function check(x, y, s, k) { if (k <= 0) return; push(x, y, s * (1.4 - 0.4 * k)); stroke([[-40, 0], [-10, 32], [46, -40]], '#1c1512', 26); stroke([[-40, 0], [-10, 32], [46, -40]], '#45c25a', 18); pop(); }
function glassP(x, y, s, fill, o = {}) {
  push(x, y, s, o.rot || 0); const gw = 60, gh = 170;
  piece([[-gw, -gh / 2], [gw, -gh / 2], [gw - 10, gh / 2], [-gw + 10, gh / 2]], 'rgba(220,238,250,0.65)', { raw: true, tex: false, lw: 3 });
  if (fill > 0.02) { const y0 = gh / 2 - gh * fill; piece([[-gw + 10 * (1 - fill) + 3, y0], [gw - 10 * (1 - fill) - 3, y0], [gw - 12, gh / 2 - 3], [-gw + 12, gh / 2 - 3]], o.water ? '#7cc8f2' : '#fbfcf8', { raw: true, line: false, tex: false }); }
  stroke([[-gw + 14, -gh / 2 + 14], [-gw + 20, gh / 2 - 14]], '#ffffff', 8, { a: 0.6 });
  pop();
}
function phoneCut(x, y, s, rot, o = {}) {                          // телефон-вырезка покрупнее; o.dead, o.rice, o.drip, o.screen(fn)
  push(x, y, s, rot); piece([[-110, -210], [110, -210], [110, 210], [-110, 210]], '#1d2026', { seed: 3100, step: 20, lw: 3 });
  rectP(-96, -190, 192, 380, o.dead ? '#151a22' : '#bfe3ff', { seed: 3101, lw: 1.6, tex: false });
  if (o.dead) { stroke([[-40, -30], [-10, 0]], '#3a4250', 6); stroke([[-10, -30], [-40, 0]], '#3a4250', 6); stroke([[10, -30], [40, 0]], '#3a4250', 6); stroke([[40, -30], [10, 0]], '#3a4250', 6); stroke([[-30, 60], [0, 46], [30, 60]], '#3a4250', 6); }
  if (o.screen) { ctx.save(); ctx.beginPath(); ctx.rect(-96, -190, 192, 380); ctx.clip(); o.screen(); ctx.restore(); }
  if (o.rice) grains(0, 0, o.rice, 220, 3102);
  rectP(-26, 196, 52, 10, '#000', { seed: 3103, line: false, tex: false });
  pop();
}
function moneyStack(x, y, s, t, t0) {
  push(x, y, s); for (let i = 0; i < 6; i++) { const k = pr(t, t0 + i * 0.06, t0 + i * 0.06 + 0.15); if (k <= 0) continue; push(0, -i * 34 * k, 1, (i % 2 - 0.5) * 0.06);
    piece([[-200, -40], [200, -40], [200, 40], [-200, 40]], '#7fbf6a', { seed: 1620 + i, lw: 2.4 }); ellP(0, 0, 34, 28, '#5f9a4e', { seed: 1630 + i, lw: 1.6 }); txt('$', 0, 2, 40, { font: 'Inter Black', col: '#e9f6dc' }); pop(); }
  pop();
}
