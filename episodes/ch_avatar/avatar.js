/* Аватар канала Paper Survivors (800×800, YouTube обрежет кругом): Joe крупно на жёлтом, бумажный круг, зелёная рука зомби тянется снизу. */
const EP = { title: null, subs: false }; const SHAKES = []; const CUE = {}; const SH = {}; const SHOTS = [[0, 'av']];
function hudFrame() {}
SH.av = function (t) {
  rectP(-20, -20, W + 40, H + 40, '#ffc81f', { seed: 8001, line: false, step: 70, shade: () => { const r = rng(8002); for (let i = 0; i < 500; i++) dot(r() * W, r() * H, 1 + r() * 2.5, r() < 0.5 ? '#f2a81c' : '#ffe27a', 0.6); } });
  for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283 + 0.1; piece([[400, 400], [400 + Math.cos(a) * 700, 400 + Math.sin(a) * 700], [400 + Math.cos(a + 0.22) * 700, 400 + Math.sin(a + 0.22) * 700]], '#ffd84a', { raw: true, line: false, a: 0.6, seed: 8010 + i }); }
  layer(() => ellP(400, 400, 374, 370, '#f6f1e4', { seed: 8003, lw: 3, np: 72 }), { sx: 6, sy: 9, sb: 18 });
  ctx.save(); ctx.beginPath(); ctx.arc(400, 400, 356, 0, 6.283); ctx.clip();
  rectP(60, 60, 680, 680, '#28304a', { seed: 8004, line: false, step: 60, shade: () => { const r = rng(8005); for (let i = 0; i < 70; i++) { const x = r() * 800, y = r() * 800; stroke([[x, y], [x - 6, y + 34]], 'rgba(190,215,250,0.4)', 2); } } });
  radial(380, 300, 420, 'rgba(255,225,160,1)', 0.45);
  layer(() => zombie({ x: 650, y: 340, s: 1.15, t: 1, v: 0, tilt: -0.2, m: { open: 0 }, smile: -0.9, lk: [-0.6, 0.2], arms: { l: [-270, 150, 'open'], r: [120, 200, 'open'] } }), { sx: 8, sy: 10, sb: 16 });
  layer(() => joe({ x: 340, y: 310, s: 1.55, t: 0.5, still: true, mood: 'dread', lk: [0.8, 0.1], sweat: 1, arms: { l: [-120, 330, 'open'], r: [120, 330, 'open'] } }), { sx: 10, sy: 12, sb: 20 });
  layer(() => { push(512, 500, 0.95, -1.15); ellP(0, 0, 40, 34, '#93b86a', { seed: 8020, lw: 2.6 });                // рука зомби на плече Joe
    [[-46, -26, -0.5], [-56, -4, -0.15], [-52, 18, 0.2], [-36, 34, 0.6]].forEach(([fx, fy, r], i) => { push(fx, fy, 1, r); piece([[-26, -9], [14, -11], [16, 10], [-26, 9]], '#93b86a', { seed: 8021 + i, lw: 2.2 }); pop(); });
    stroke([[8, -10], [22, 6]], '#76994f', 3); pop(); }, { sx: 6, sy: 8, sb: 12 });
  ctx.restore();
  ellP(400, 400, 356, 356, 'rgba(0,0,0,0)', { raw: true, tex: false, lw: 6, lc: '#1c1512', seed: 8006 });
  tape(140, 150, 150, -0.75, 8007); tape(668, 660, 150, -0.75, 8008);
};
function post(t, o) { o.save(); o.filter = 'saturate(1.18) contrast(1.06) brightness(1.03)'; o.drawImage(o.canvas, 0, 0); o.restore(); }
