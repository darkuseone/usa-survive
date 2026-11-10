/* Шортс S3 в комбинированном стиле: 3D-диорама (пролёты, краны, толпа, жалюзи) + 2.5D (крупные эмоции: размытый 3D-фон, герой в 2D поверх).
   Голос — новые быстрые реплики k01…k14 (≈185 сл/мин), без голосового CTA: в конце — карточка со стрелкой на Related video. */
const CUE = {}; SHOTS.push([0, 'v']); SH.v = () => {};
function stack3(t) { const p = (step(t, 12) % 1.6) / 1.6; return kf(p, [[0, [215, 70]], [0.3, [130, 300]], [0.42, [130, 300]], [0.7, [175, 160]], [0.92, [215, 70]], [1, [215, 70]]]); }
function R3(o) { stFace(); dRender(o); }
const dCam0 = dCam; let HAND = 1;                                       // «ручная» камера: живое покачивание поверх любого движения
dCam = function (t, K, e) { dCam0(t, K, e); const c = DIO.cam; c.rotateY((Math.sin(t * 0.9) * 0.006 + Math.sin(t * 2.3 + 1) * 0.0025) * HAND); c.rotateX((Math.sin(t * 1.1 + 2) * 0.005 + Math.sin(t * 2.9) * 0.002) * HAND); };
const K_ = k => LS(k), W_ = (k, re, n) => WW(k, re, n);
const T = { k01: K_('k01'), k02: K_('k02'), k03: K_('k03'), k04: K_('k04'), k05: K_('k05'), k06: K_('k06'), k07: K_('k07'), k08: K_('k08'), k09: K_('k09'), k10: K_('k10'), k11: K_('k11'), k12: K_('k12'), k13: K_('k13'), k14: K_('k14'),
  chime: W_('k05', /^chime/i), walks: W_('k05', /^walks/i), not: W_('k05', /^not/i), gas: W_('k05', /^gas/i), slam: W_('k06', /^slam/i), steel: W_('k06', /^steel/i), crash: W_('k06', /^crash/i),
  alarm: W_('k07', /^alarm/i), sunrise: W_('k08', /^sunrise/i), forty: W_('k08', /^forty/i), pops: W_('k09', /^pops/i), another: W_('k09', /^another/i), six: W_('k09', /^six/i),
  panic: W_('k10', /^panic/i), scream: W_('k10', /^scream/i), run: W_('k10', /^run/i), opp: W_('k11', /^opposite/i), shoes: W_('k11', /^shoes/i), lights: W_('k11', /^lights/i),
  crawl: W_('k11', /^crawl/i), move: W_('k11', /^move/i), eleven: W_('k11', /^eleven/i), see: W_('k12', /^see/i), sound: W_('k12', /^sound/i), and40: W_('k12', /^and/i), drift: W_('k13', /^drift/i),
  knocks: W_('k14', /^knocks/i), end: LE('k14') };
T.kn = [T.end + 0.25, T.end + 0.75, T.end + 1.25]; T.card = T.end + 1.55;
const JA = [1.0, -3.25], JB = [4.0, -3.1];                              // Joe: проход у воды; за кассой

// ---------- 2D-герои поверх 3D (крупные планы 2.5D)
const joe2 = (o) => () => joe({ x: 0, y: -512, s: 1, still: true, noShadow: true, ...o });
const zom2 = (o) => () => zombie({ x: 0, y: -512, s: 1, v: 0, noShadow: true, ...o });
function fist2(x, y, k) { push(x, y, 2.6 * (0.8 + 0.2 * k), -0.6); const tb = tube([[0, -330], [0, -160], [0, -8]], 62, 56); piece(tb.pts, JOE.pal.top, { raw: true, seed: 346, lw: 2.6 });
  piece([[-34, -44], [34, -44], [34, -12], [-34, -12]], JOE.pal.topD, { seed: 347, lw: 2 }); blobP([[-34, -16], [34, -16], [38, 22], [0, 38], [-38, 22]], JOE.pal.skin, { seed: 348, lw: 2.6 }); pop(); }
function redX(cx, cy, k) { if (k <= 0) return; const a = 150 * eo(k); stroke([[cx - a, cy - a], [cx + a, cy + a]], '#c8241c', 34); stroke([[cx + a, cy - a], [cx - a, cy + a]], '#c8241c', 34); }
function rings(cx, cy, t, a = 1) { for (let i = 0; i < 4; i++) { const q = (t * 0.9 + i / 4) % 1; ellP(cx, cy, 60 + q * 420, 40 + q * 280, 'rgba(0,0,0,0)', { raw: true, tex: false, lw: 8, lc: '#f2c230', a: a * 0.8 * (1 - q) }); } }
function vstamp(word, t, t0, y, size, seed, o = {}) { const age = t - t0; if (age < 0 || age > (o.life ?? 2.2)) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); S = 1; ctx.globalAlpha = 1 - pr(age, (o.life ?? 2.2) - 0.3, o.life ?? 2.2);
  push(o.x ?? PW / 2, y, 1, o.rot ?? -0.04); ransom(word, 0, 0, size, seed, { reveal: pr(t, t0, t0 + 0.25), pop: true, maxW: 960, bgs: o.bgs }); pop(); ctx.restore(); }
function vhs(t, a = 1) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const r = rng(hsh(Math.floor(t * 24), 71)); ctx.fillStyle = `rgba(20,30,60,${0.3 * a})`; ctx.fillRect(0, 0, PW, PH);
  for (let i = 0; i < 7; i++) { const y = r() * PH, h = 8 + r() * 40; ctx.fillStyle = `rgba(255,255,255,${(0.08 + r() * 0.18) * a})`; ctx.fillRect(0, y, PW, h); } for (let y = 0; y < PH; y += 6) { ctx.fillStyle = `rgba(0,0,0,${0.16 * a})`; ctx.fillRect(0, y, PW, 2); } ctx.restore(); }
function cctv(t) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = 'rgba(30,60,40,0.18)'; ctx.fillRect(0, 0, PW, PH); for (let y = 0; y < PH; y += 4) { ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(0, y, PW, 1); }
  ctx.font = "700 44px 'Courier 10 Pitch', monospace"; ctx.fillStyle = '#e8f0e0'; ctx.fillText('CAM 01', 70, 380); ctx.fillText('DAY 07  06:' + String(31 + Math.floor((t - T.shoes) * 3)).padStart(2, '0') + ' AM', 70, 1500);
  if (Math.floor(t * 2) % 2) { ctx.fillStyle = '#ff3030'; ctx.beginPath(); ctx.arc(PW - 150, 365, 16, 0, 6.3); ctx.fill(); ctx.fillStyle = '#e8f0e0'; ctx.fillText('REC', PW - 125, 380); } ctx.restore(); }

// ---------- планы: [начало, имя, функция(t, u)]
const night = { sky: 'night', lit: 1, neon: true, shut: 0, rain: 1 };
const SHOT3 = [
  [0, 'hook', (t, u) => { stSet(t, { sky: 'dawn', lit: 0.25, neon: false, shut: 1, dents: 1, crowd: 'pound', rain: 0.5, canopy: 0.3, exit: 1 }); ST.joe.q.visible = false; ST.z1.q.visible = false;
    dCam(t, [[0, 0.9, 1.0, 5.2, -1.6, 1.5, 0.8, 64], [T.k02 - 0.1, 3.4, 3.4, 8.6, 0, 1.2, 0.8, 58]]); dShake(Math.max(0, Math.sin(t * 9)) * 3); R3(); }],
  [T.k02 - 0.1, 'bend', (t, u) => { stSet(t, { sky: 'dawn', lit: 0.35, neon: false, shut: 1, bulge: 0.25 + 0.6 * pr(t, T.k02, T.k03), dents: 1, exit: 1, rain: 0 }); ST.joe.q.visible = false; ST.z1.q.visible = false;
    dCam(t, [[T.k02 - 0.1, 5.6, 1.4, -4.3, 0, 1.6, 0.2, 60, 0.04], [T.k03, 4.6, 1.6, -3.4, 0, 1.7, 0.2, 48, -0.03]]); dShake(4 + 3 * Math.sin(t * 13)); R3({ blur: 3 });
    dHero(3.3, 0, -3.0, joe2({ t, mood: 'shock', pupil: 0.55, eyeTilt: 0.8, mouthKind: 'grimace', pale: 1, tremble: 1, sweat: 1, lk: [-0.9, -0.1], arms: { l: [-170, 160, 'open'], r: [160, 190, 'open'] } }), { tint: 'rgba(40,30,60,0.25)' }); }],
  [T.k03 - 0.15, 'rewind', (t, u) => { const k = pr(t, T.k03 - 0.15, T.k04 - 0.05); stSet(t, { sky: 'night', lit: 1, neon: true, shut: 1 - eo(k), rain: 1 }); ST.joe.q.visible = false; ST.z1.q.visible = false;
    dCam(t, [[T.k03 - 0.15, 3.0, 1.5, -2.5, 0, 1.6, 0.2, 58], [T.k04 - 0.05, -1.0, 1.4, 12, 0, 1.8, 0, 60]], k => k); R3(); vhs(t);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); S = 1; push(PW / 2, 900, 1, -0.03); ransom('7 DAYS EARLIER', 0, 0, 110, 7040, { reveal: pr(u, 0.05, 0.35), pop: true, maxW: 960 }); pop(); txt('◀◀', 120, 300, 70, { font: "'Courier 10 Pitch'", weight: 700, col: '#fbf8f0' }); ctx.restore(); }],
  [T.k04 - 0.05, 'arrive', (t, u) => { const a = { hand: stack3(t) }; stSet(t, night); dCam(t, [[T.k04 - 0.05, 0, 1.0, 15, 0, 2.0, 0, 58], [T.k04 + 1.5, 0, 1.45, 7.5, 0, 1.7, 0, 58], [T.k04 + 2.7, 0.1, 1.55, 0.7, 0.5, 1.4, -2, 56], [T.chime - 0.35, 0.1, 1.55, -0.9, JA[0], 1.15, JA[1], 50]]);
    dDraw(ST.joe, () => joe({ x: 256, y: 660 - 512 * 0.88, s: 0.88, t, noShadow: true, flip: true, lk: [0.8, 0.1], mood: 'sleepy', arms: { l: [-150, 300, 'open'], r: [...a.hand, 'fist'] } })); dPlace(ST.joe, ...JA); ST.z1.q.visible = false; R3();
    if (u < 2.2) vstamp('3:07 AM', t, T.k04 + 0.4, 520, 120, 501); }],
  [T.chime - 0.35, 'door', (t, u) => { const od = pr(t, T.chime - 0.1, T.chime + 0.45), zin = pr(t, T.chime - 0.35, T.not); stSet(t, { ...night, door: od, flick: t > T.walks });
    dCam(t, [[T.chime - 0.35, 0.1, 1.55, -0.9, JA[0], 1.15, JA[1], 50], [T.chime - 0.05, 0.4, 1.5, -1.6, 0.2, 1.3, 2.0, 52], [T.not, 0.5, 1.45, -2.1, 0.2, 1.3, 1.4, 44]]);
    ST.joe.q.visible = false; dDraw(ST.z1, () => zombie({ x: 256, y: 660 - 512 * 0.88, s: 0.88, t, v: 0, noShadow: true, legs: 'run', tilt: 0.15 + Math.sin(step(t, 8) * 3) * 0.05, arms: { l: [-150, 110, 'open'], r: [150, 90, 'open'] } }));
    dPlace(ST.z1, lerp(1.4, 0.2, zin), t < T.chime + 0.3 ? lerp(6.5, 0.9, zin) : lerp(0.8, -0.6, pr(t, T.chime + 0.3, T.not))); R3(); }],
  [T.not - 0.1, 'shock', (t, u) => { stSet(t, { ...night, door: 1, flick: true }); ST.z1.q.visible = false; ST.joe.q.visible = false;
    dCam(t, [[T.not - 0.1, 0.3, 1.55, -1.7, JA[0], 1.45, JA[1], 44], [T.k06, 0.55, 1.55, -2.25, JA[0], 1.5, JA[1], 34]]); R3({ blur: 5 });
    const sc = t > T.gas - 0.05; dHero(JA[0], 0, JA[1], joe2({ t, mood: 'shock', scream: sc ? 1 : 0, mouthKind: sc ? '' : 'wavy', pupil: 0.55, eyeTilt: 0.7, pale: 0.6, tremble: sc ? 1 : 0.4, sweat: 1, lk: [-0.8, -0.1], arms: { l: [-180, 170, 'open'], r: [180, 150, 'open'] } }), { tint: 'rgba(255,240,220,0.05)' }); }],
  [T.k06 - 0.05, 'button', (t, u) => { const hit = T.slam + 0.25; stSet(t, { ...night, door: 1, alarm: t > hit ? 1 : 0, btnDown: t > hit && t < hit + 0.4 }); ST.z1.q.visible = false; ST.joe.q.visible = false;
    dCam(t, [[T.k06 - 0.05, 3.25, 1.75, -1.5, 3.55, 1.19, -2.2, 46], [T.steel - 0.1, 3.3, 1.62, -1.68, 3.55, 1.19, -2.2, 38]]); dShake(t > hit && t < hit + 0.35 ? 18 : 0); R3();
    const b = dProj(3.55, 1.2, -2.2), k = t < hit ? eo(clamp((t - (hit - 0.3)) / 0.3)) : 1; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); S = 1; fist2(lerp(PW + 200, b.x + 40, k), lerp(-200, b.y - 40, k) + (t > hit ? 20 : 0), k); ctx.restore();
    vstamp('LOCKDOWN!', t, hit, 560, 120, 502); }],
  [T.steel - 0.1, 'crash', (t, u) => { const sh = pr(t, T.steel, T.crash + 0.05); stSet(t, { ...night, door: 0, alarm: 1, lit: 0.55, neon: false, shut: sh, flick: true }); ST.z1.q.visible = false; ST.joe.q.visible = false;
    dCam(t, [[T.steel - 0.1, 5.4, 1.1, -3.8, 0, 1.9, 0.3, 66, 0], [T.crash, 5.0, 1.2, -3.5, 0, 1.6, 0.3, 60, 0.05], [T.k07 - 0.1, 4.6, 1.35, -3.2, 0, 1.75, 0.3, 56, 0]]); dShake(t > T.crash && t < T.crash + 0.6 ? 22 * (1 - (t - T.crash) / 0.6) : 0); R3();
    vstamp('CRASH!', t, T.crash, 560, 130, 503); }],
  [T.k07 - 0.1, 'car', (t, u) => { stSet(t, { sky: 'night', lit: 0.2, neon: false, shut: 1, car: t > T.alarm - 0.2, rain: 0.8, canopy: 0.6 }); ST.joe.q.visible = false;
    dCam(t, [[T.k07 - 0.1, 0.5, 0.6, 13.0, -5.0, 1.0, 7.4, 60], [T.alarm, -2.0, 0.75, 10.9, -5.0, 1.0, 7.3, 52], [T.k08 - 0.05, -2.8, 1.0, 10.2, -5.0, 1.0, 7.2, 46]]);
    dDraw(ST.z1, () => zombie({ x: 256, y: 660 - 512 * 0.88, s: 0.88, t, v: 1, noShadow: true, legs: 'run', tilt: 0.2 + Math.sin(step(t, 8) * 3) * 0.06, arms: { l: [-150, 110, 'open'], r: [150, 90, 'open'] } }));
    const zk = pr(t, T.k07, T.alarm), bump = t > T.alarm - 0.2 ? Math.sin((t - T.alarm) * 20) * 0.05 * Math.max(0, 1 - (t - T.alarm)) : 0; dPlace(ST.z1, lerp(-1.5, -3.9, zk) + bump, lerp(12.5, 8.6, zk)); R3(); }],
  [T.k08 - 0.05, 'gather', (t, u) => { stSet(t, { sky: 'dawn', lit: 0.25, neon: false, shut: 1, crowd: 'gather', crowdK: pr(t, T.k08 - 0.3, T.k09 - 0.4), rain: 0.25, canopy: 0.3 }); ST.joe.q.visible = false; ST.z1.q.visible = false;
    dCam(t, [[T.k08 - 0.05, 2.0, 0.9, 13.5, 0, 1.6, 1.0, 60], [T.k09 - 0.05, -1.5, 6.8, 15.5, 0, 0.8, 1.0, 56]]); R3(); vstamp('40', t, T.forty, 520, 200, 2530); }],
  [T.k09 - 0.05, 'bolts', (t, u) => { stSet(t, { sky: 'dawn', lit: 0.35, neon: false, shut: 1, bulge: 0.75 + 0.1 * Math.sin(t * 7), dents: 1, exit: 1, bolts: [T.pops + 0.1, T.another + 0.1], rain: 0 }); ST.z1.q.visible = false;
    dDraw(ST.joe, () => joe({ x: 256, y: 660 - 512 * 0.88, s: 0.88, t, noShadow: true, mood: 'shock', pupil: 0.6, eyeTilt: 0.8, mouthKind: 'grimace', pale: 1, tremble: 1, lk: [-0.7, -0.4], arms: { l: [-170, 160, 'open'], r: [160, 190, 'open'] } })); dPlace(ST.joe, ...JB);
    dCam(t, [[T.k09 - 0.05, 1.6, 2.0, -2.0, -0.8, 2.3, 0.2, 54], [T.pops, 0.2, 2.2, -1.5, -2.3, 2.7, 0.1, 46], [T.another - 0.2, 0.6, 2.2, -1.5, 2.0, 2.7, 0.1, 46], [T.k10, 1.0, 2.0, -1.8, 2.3, 2.6, 0.1, 50]]);
    const kick = Math.max(t > T.pops + 0.1 && t < T.pops + 0.5 ? 1 - (t - T.pops - 0.1) / 0.4 : 0, t > T.another + 0.1 && t < T.another + 0.5 ? 1 - (t - T.another - 0.1) / 0.4 : 0); dShake(6 + 20 * kick); R3();
    vstamp('6000 LBS', t, T.six + 0.2, 520, 130, 2531); }],
  [T.k10 - 0.05, 'panic', (t, u) => { stSet(t, { ...night, lit: 0.6, alarm: 0.8, neon: false, shut: 1 }); ST.z1.q.visible = false; ST.joe.q.visible = false;
    dCam(t, [[T.k10 - 0.05, 0.4, 1.5, -1.2, 1.4, 1.3, -3.3, 46], [T.k11 - 0.05, 0.6, 1.5, -1.5, 1.4, 1.3, -3.3, 42]]); R3({ blur: 6 });
    const ph = t < T.scream - 0.05 ? 0 : t < T.run - 0.05 ? 1 : 2, t0 = [T.panic - 0.1, T.scream - 0.05, T.run - 0.05][ph];
    const jo = [{ mood: 'shock', scream: 0.7, pupil: 0.6, eyeTilt: 0.8, arms: { l: [-190, 40, 'open'], r: [190, 40, 'open'] } }, { mood: 'shock', scream: 1, pupil: 0.5, eyeTilt: 1, tremble: 1, arms: { l: [-150, -40, 'open'], r: [150, -40, 'open'] } }, { mood: 'shock', scream: 0.6, legs: 'run', lean: 0.2, arms: { l: [-170, 120, 'fist'], r: [170, 220, 'fist'] } }][ph];
    dHero(1.4 + (ph === 2 ? (t - t0) * 1.6 : 0), 0, -3.3, joe2({ t, sweat: 1, ...jo }), { tint: 'rgba(255,40,30,0.18)' });
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); S = 1; redX(PW / 2, 900, pr(t, t0 + 0.35, t0 + 0.55)); ctx.restore(); vstamp(['PANIC', 'SCREAM', 'RUN'][ph], t, t0, 470, 130, 2600 + ph, { life: 0.9 }); }],
  [T.k11 - 0.05, 'calm', (t, u) => { stSet(t, { ...night, lit: 0.45, neon: false, shut: 1, exit: 1 }); ST.z1.q.visible = false; ST.joe.q.visible = false;
    dCam(t, [[T.k11 - 0.05, 0.2, 1.55, -1.3, JA[0], 1.45, JA[1], 40], [T.shoes - 0.1, 0.35, 1.55, -1.6, JA[0], 1.45, JA[1], 34]]); R3({ blur: 6 });
    dHero(JA[0], 0, JA[1], joe2({ t, eyeTilt: -0.7, mouthKind: 'clench', lk: [-0.2, 0], arms: { l: [-150, 300, 'fist'], r: [150, 300, 'fist'] } }), { tint: 'rgba(20,30,60,0.2)' }); }],
  [T.shoes - 0.1, 'cctv', (t, u) => { stSet(t, { ...night, lit: t < T.lights + 0.1 ? 0.45 : Math.max(0, 0.45 - (t - T.lights - 0.1) * 1.5), neon: false, shut: 1, exit: 1 }); ST.z1.q.visible = false;
    dDraw(ST.joe, () => joe({ x: 256, y: 660 - 512 * 0.88, s: 0.88, t, noShadow: true, lk: [0.5, 0.5], eyeTilt: -0.4, arms: { l: [-150, 260, 'open'], r: [130, 330, 'open'] } })); dPlace(ST.joe, 2.0, -3.0);
    dCam(t, [[T.shoes - 0.1, 6.5, 3.25, -0.6, 0.5, 0.4, -4.4, 74], [T.crawl - 0.1, 6.5, 3.25, -0.6, 1.0, 0.4, -4.0, 70]]); R3(); cctv(t); }],
  [T.crawl - 0.1, 'hide', (t, u) => { const tl = pr(t, T.eleven - 0.1, T.k12 - 0.1); stSet(t, { sky: tl > 0 ? 'day' : 'night', lit: 0, neon: false, shut: 1, exit: 1, shafts: tl > 0 ? 1 : 0, shaftK: tl, rain: 0, canopy: 0 });
    dDraw(ST.joe, () => joe({ x: 256, y: 660 - 512 * 0.88, s: 0.88, t, noShadow: true, legs: 'sit', mood: 'dread', lid: 0.2, lk: [-0.6, -0.2], arms: { l: [-120, 250, 'fist'], r: [120, 250, 'fist'] } })); dPlace(ST.joe, 4.2, -3.15, { y: -0.42 });
    ST.z1.q.visible = false; dCam(t, [[T.crawl - 0.1, 0.2, 0.35, -3.3, 4.2, 0.5, -3.2, 56], [T.move, 2.0, 0.45, -3.3, 4.2, 0.6, -3.2, 48], [T.k12 - 0.1, 2.4, 0.55, -3.35, 4.2, 0.65, -3.2, 46]]); R3();
    vstamp('11 HOURS', t, T.eleven, 520, 120, 2550); }],
  [T.k12 - 0.05, 'eyes', (t, u) => { stSet(t, { sky: 'day', lit: 0, neon: false, shut: 1, crowd: 'pound', rain: 0, canopy: 0 }); ST.joe.q.visible = false; ST.z1.q.visible = false;
    dCam(t, [[T.k12 - 0.05, 1.3, 1.85, 3.8, 0.8, 1.6, 1.0, 46], [T.sound - 0.3, 1.2, 1.85, 3.4, 0.8, 1.6, 1.0, 40]]); R3({ blur: 6 });
    const tilt = t > T.sound - 0.35 ? 0.35 * sm(pr(t, T.sound - 0.35, T.sound)) : 0; dHero(0.8, 0, 1.25, zom2({ t: t * 0.4, v: 2, lid: 0.38, eyeBig: 1, lk: [Math.sin(t * 2.3) * 0.8, 0.3], tilt: 0.1 + tilt, arms: { l: [-150, 110, 'open'], r: [150, 90, 'open'] } }), { tint: 'rgba(255,240,220,0.06)' });
    if (t > T.sound - 0.35) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); S = 1; const p = dProj(0.8, 1.75, 1.25); rings(p.x, p.y, t, pr(t, T.sound - 0.35, T.sound)); ctx.restore(); } }],
  [T.and40 - 0.1, 'breath', (t, u) => { stSet(t, { sky: 'day', lit: 0, neon: false, shut: 1, exit: 1, shafts: 1, shaftK: 0.85, rain: 0, canopy: 0, crowd: 'pound' }); ST.joe.q.visible = false; ST.z1.q.visible = false;
    dCam(t, [[T.and40 - 0.1, 2.2, 1.05, -3.3, 4.2, 1.0, -3.15, 44], [T.k13 - 0.05, 2.5, 1.05, -3.3, 4.2, 1.0, -3.15, 38]]); R3({ blur: 5 });
    dHero(4.2, -0.42, -3.15, joe2({ t, legs: 'sit', mouthKind: 'puff', eyeTilt: 0.5, sweat: 1, lk: [Math.sin(t * 3) > 0 ? 0.9 : -0.9, -0.3], arms: { l: [-120, 250, 'fist'], r: [120, 250, 'fist'] } }), { tint: 'rgba(30,30,70,0.32)' }); }],
  [T.k13 - 0.05, 'leave', (t, u) => { stSet(t, { sky: 'dusk', lit: 0, neon: false, shut: 1, crowd: 'leave', crowdK: pr(t, T.k13, T.k14 - 0.1), rain: 0.4, canopy: 0.2 }); ST.joe.q.visible = false; ST.z1.q.visible = false;
    dCam(t, [[T.k13 - 0.05, 0.2, 1.6, 2.6, 0, 1.2, 15, 60], [T.k14 - 0.05, 0.2, 4.8, 3.6, 0, 0.6, 16, 58]]); R3(); }],
  [T.k14 - 0.05, 'knock', (t, u) => { stSet(t, { sky: 'night', lit: 0, neon: false, shut: 1, exit: 1, rain: 0.8, canopy: 0, dents: 0.6 }); ST.z1.q.visible = false; ST.joe.q.visible = false;
    dCam(t, [[T.k14 - 0.05, 1.6, 1.5, -3.4, 0, 1.6, 0.2, 56], [T.card, 0.8, 1.55, -1.7, 0, 1.6, 0.2, 48]]); const kk = Math.max(...T.kn.map(k => t > k && t < k + 0.25 ? 1 - (t - k) / 0.25 : 0)); dShake(18 * kk); R3();
    T.kn.forEach((k, i) => vstamp('KNOCK', t, k, 560 + i * 160, 110, 2560, { x: PW / 2 - 140 + i * 140, life: 2 })); }],
  [T.card, 'end', (t, u) => { endCard3(t, u); }]
];
function endCard3(t, u) {                                              // финал без голоса: вопрос, «полная история», стрелка вниз на Related video
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); S = 1; rectP(-40, -40, PW + 80, PH + 80, '#1d1714', { seed: 7001, line: false, step: 90, shade: () => { const r = rng(7002); for (let i = 0; i < 1200; i++) dot(r() * PW, r() * PH, 1 + r() * 2.4, r() < 0.5 ? '#120d0a' : '#3a2c22', 0.6); } });
  push(PW / 2, 520, 1, -0.04); ransom("WHO'S", 0, -80, 130, 7051, { reveal: pr(u, 0.05, 0.3), pop: true }); ransom('KNOCKING?', 0, 80, 130, 7052, { reveal: pr(u, 0.2, 0.5), pop: true, maxW: 960 }); pop();
  if (u > 0.5) { push(PW / 2, 900, 1, 0.02); label0c('FULL STORY ON MY CHANNEL'); pop(); }
  const a = pr(u, 0.8, 1.3); if (a > 0) { const P = []; for (let i = 0; i <= 24 * a; i++) { const q = i / 24; P.push([lerp(820, 250, q) + Math.sin(q * 3.1) * 110, lerp(1050, 1600, q)]); }
    if (P.length > 1) { stroke(P, '#1c1512', 30); stroke(P, '#ffd21f', 18); if (a >= 1) { const e = P[P.length - 1], p = P[P.length - 4], an = Math.atan2(e[1] - p[1], e[0] - p[0]); push(e[0], e[1], 1, an); piece([[34, 0], [-30, -34], [-16, 0], [-30, 34]], '#ffd21f', { seed: 7031, lw: 3 }); pop(); } } }
  ctx.restore();
}
function label0c(s) { card(0, 0, s.length * 46 * 0.62 + 80, 96, 0, 7060, '#ffd21f'); txt(s, 0, 4, 46, { font: 'Inter Black', col: '#1c1512' }); }

// ---------- кадр: 3D/2.5D план + склейки («хлыст» со смазом на смене локации)
let SINIT = false;
function shot3(t) { let i = 0; while (i < SHOT3.length - 1 && t >= SHOT3[i + 1][0]) i++; return i; }
frame = function (t) {
  if (!SINIT) { if (!document.fonts.check("600 40px 'Osw'")) return; stBuild(); SINIT = true; }
  const i = shot3(t), [t0, nm, fn] = SHOT3[i], u = t - t0; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); S = 1; fn(t, u); ctx.restore();
  if (i > 0 && u < 0.18 && !['rewind', 'end'].includes(nm)) {             // «хлыст»: камера прилетает со смазом (направление чередуется)
    const k = 1 - u / 0.18, dir = i % 2 ? 1 : -1, sp = 140 * k * k; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (let j = 1; j <= 3; j++) { ctx.globalAlpha = 0.28 * k; ctx.drawImage(ctx.canvas, dir * sp * j / 3, 0); } ctx.restore(); }
};

// ---------- поверх: день (вверху справа), крючок, субтитры по слову
const HOOK = { text: '40 ZOMBIES.|1 DOOR.', until: 2.9, seed: 7301 };
function dayNow(t) { if (t < T.k03 - 0.15) return [7, '06:31 AM']; if (t < T.k07 - 0.1) return [1, '03:07 AM']; if (t < T.k08) return [7, '04:40 AM']; if (t < T.k12) return [7, '06:31 AM']; if (t < T.k14 - 0.05) return [7, t < T.k13 - 0.05 ? '02:15 PM' : '08:10 PM']; return [12, '01:12 AM']; }
function vSub3(t) {
  let lo = 0, hi = SUBW.length - 1, k = -1; while (lo <= hi) { const m = (lo + hi) >> 1; if (SUBW[m].s - 0.03 <= t) { k = m; lo = m + 1; } else hi = m - 1; }
  if (k < 0 || t > SUBW[k].e) return; const w = SUBW[k].w.replace(/[.,!?…;"“”]/g, '').replace(/:(?!\d)/g, '').toUpperCase(); if (!w) return;
  const p = clamp((t - SUBW[k].s + 0.03) / 0.09), sc = 0.82 + 0.18 * eo(p), hot = HOT.test(w.replace(/'S$/, ''));
  push(PW / 2, 1330, sc); ctx.save(); ctx.font = `600 ${Math.min(96, 980 / Math.max(1, w.length * 0.52))}px 'Osw'`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 20; ctx.lineWidth = 15; ctx.strokeStyle = '#141010'; ctx.strokeText(w, 0, 0); ctx.shadowBlur = 0; ctx.fillStyle = hot ? '#ffd21f' : '#fbf8f0'; ctx.fillText(w, 0, 0); ctx.restore(); pop();
}
let LASTDAY = null, DAYT = 0;
hudFrame = function (t) {
  const i = shot3(t), nm = SHOT3[i][1];
  if (!['rewind', 'end', 'cctv'].includes(nm)) { const [n, clk] = dayNow(t), key = n + clk; if (key !== LASTDAY) { DAYT = SHOT3[i][0]; LASTDAY = key; }
    push(PW - 158, 232, 0.86); push(-(W - 175), -138); dayTag(t, n, { clock: clk, stamp: t - DAYT < 1.4 ? DAYT + 0.1 : null }); pop(); pop(); }
  if (t < HOOK.until) { const a = 1 - pr(t, HOOK.until - 0.25, HOOK.until); HOOK.text.split('|').forEach((ln, j) => { push(PW / 2 - 20 + j * 40, 420 + j * 150, 0.9 + 0.1 * a, -0.035 + j * 0.03); ctx.globalAlpha = a; ransom(ln, 0, 0, 130, HOOK.seed + j * 17, { reveal: pr(t, 0.05 + j * 0.3, 0.4 + j * 0.3), pop: true, maxW: 900 }); ctx.globalAlpha = 1; pop(); }); }
  if (nm !== 'end') vSub3(t);
};
const BLOOM = document.createElement('canvas'); BLOOM.width = PW / 2; BLOOM.height = PH / 2;
post = function (t, o) {
  o.save(); o.filter = 'saturate(1.2) contrast(1.08) brightness(1.03)'; o.drawImage(o.canvas, 0, 0); o.restore();
  const b = BLOOM.getContext('2d'); b.setTransform(1, 0, 0, 1, 0, 0); b.filter = 'brightness(0.6) contrast(2.8) saturate(1.6)'; b.clearRect(0, 0, PW / 2, PH / 2); b.drawImage(o.canvas, 0, 0, PW / 2, PH / 2); b.filter = 'none';   // только яркое: неон, лампы
  o.save(); o.globalCompositeOperation = 'screen'; o.globalAlpha = 0.55; o.filter = 'blur(22px)'; o.drawImage(BLOOM, 0, 0, PW, PH); o.globalAlpha = 0.35; o.filter = 'blur(6px)'; o.drawImage(BLOOM, 0, 0, PW, PH); o.restore();
  o.save(); o.globalCompositeOperation = 'soft-light'; const gg = o.createLinearGradient(0, 0, 0, PH); gg.addColorStop(0, 'rgba(40,120,170,0.35)'); gg.addColorStop(1, 'rgba(255,140,60,0.25)'); o.fillStyle = gg; o.fillRect(0, 0, PW, PH); o.restore();
  o.save(); o.globalCompositeOperation = 'overlay'; o.globalAlpha = 0.05; const fr = Math.floor(t * 12), gx = -(hsh(fr) % 256), gy = -(hsh(fr, 7) % 256); for (let x = gx; x < PW; x += 512) for (let y = gy; y < PH; y += 512) o.drawImage(GRAIN, x, y); o.restore();
  const v = o.createRadialGradient(PW / 2, PH * 0.48, PW * 0.45, PW / 2, PH * 0.5, PH * 0.62); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.38)'); o.save(); o.fillStyle = v; o.fillRect(0, 0, PW, PH); o.restore();
};
window.EXPORT = { T, shots: SHOT3.map(s => [s[0], s[1]]) };
