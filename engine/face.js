/* Лицо для любых персонажей «Аппликации»: рты-замены по виземам Rhubarb (липсинк на двойках), моргание, рот-вырезка.
   Персонажей строить в engine/chars.js (свои для канала) по образцу reference/tom-nikita/chars.js. */

const VIS = { A: [0, 0], B: [0.28, 0], C: [0.55, 0.1], D: [0.95, 0], E: [0.6, 0.55], F: [0.32, 0.9], G: [0.2, 0], H: [0.45, 0], X: [0, 0] };
function mouthAt(who, t) {
  const ln = LINES.find(l => l.speaker === who && t >= l.start - 0.02 && t <= l.end + 0.05);
  if (!ln) return { open: 0, round: 0, talking: false };
  const tq = step(t, 12), cues = ln.visemes; let i = cues.length - 1; while (i > 0 && cues[i].s > tq) i--;   // рты меняются на двойках, как вырезанные замены
  const v = VIS[cues[i]?.v ?? 'X']; return { open: v[0], round: v[1], talking: true };
}
function blinkAt(t, seed) { const per = 3.3 + (seed % 5) * 0.47, ph = (step(t) + seed * 1.37) % per; return ph < 0.17 ? 1 : 0; }

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
