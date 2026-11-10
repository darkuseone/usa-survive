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
  knocks: W_('k14', /^knocks/i), end: LE('k14'), one: W_('k09', /^one/i), eyes: W_('k12', /^eyes/i) };
T.kn = [T.end + 0.25, T.end + 0.75, T.end + 1.25]; T.card = T.end + 1.55;

// ---------- 2D-герои поверх 3D (крупные планы 2.5D)
const joe2 = (o) => () => joe({ x: 0, y: -512, s: 1, still: true, noShadow: true, ...o });
const zom2 = (o) => () => zombie({ x: 0, y: -512, s: 1, v: 0, noShadow: true, ...o });
function fist2(x, y) { push(x, y, 3.2, 0.5);                                // рука сверху-справа: рукав, манжета, кулак с костяшками
  piece(tube([[40, -520], [20, -260], [0, -40]], 78, 66).pts, JOE.pal.top, { raw: true, seed: 346, lw: 3 }); piece([[-40, -60], [40, -60], [38, -22], [-38, -22]], JOE.pal.topD, { seed: 347, lw: 2.4 });
  blobP([[-42, -26], [42, -26], [48, 26], [30, 52], [-30, 52], [-48, 26]], JOE.pal.skin, { seed: 348, lw: 3 }); for (let q = -1; q <= 1; q++) stroke([[q * 22 - 11, 30], [q * 22 - 11, 50]], JOE.pal.skinD, 3); stroke([[-44, 8], [-52, 26], [-40, 40]], JOE.pal.skinD, 3); pop(); }
function redX(cx, cy, k) { if (k <= 0) return; const a = 150 * eo(k); stroke([[cx - a, cy - a], [cx + a, cy + a]], '#c8241c', 34); stroke([[cx + a, cy - a], [cx - a, cy + a]], '#c8241c', 34); }
function rings(cx, cy, t, a = 1) { for (let i = 0; i < 4; i++) { const q = (t * 0.9 + i / 4) % 1; ellP(cx, cy, 60 + q * 420, 40 + q * 280, 'rgba(0,0,0,0)', { raw: true, tex: false, lw: 8, lc: '#f2c230', a: a * 0.8 * (1 - q) }); } }
function vstamp(word, t, t0, y, size, seed, o = {}) { const age = t - t0; if (age < 0 || age > (o.life ?? 2.2)) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); S = 1; ctx.globalAlpha = 1 - pr(age, (o.life ?? 2.2) - 0.3, o.life ?? 2.2);
  push(o.x ?? PW / 2, y, 1, o.rot ?? -0.04); ransom(word, 0, 0, size, seed, { reveal: pr(t, t0, t0 + 0.25), pop: true, maxW: 960, bgs: o.bgs }); pop(); ctx.restore(); }
function vhs(t, a = 1) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const r = rng(hsh(Math.floor(t * 24), 71)); ctx.fillStyle = `rgba(20,30,60,${0.3 * a})`; ctx.fillRect(0, 0, PW, PH);
  for (let i = 0; i < 7; i++) { const y = r() * PH, h = 8 + r() * 40; ctx.fillStyle = `rgba(255,255,255,${(0.08 + r() * 0.18) * a})`; ctx.fillRect(0, y, PW, h); } for (let y = 0; y < PH; y += 6) { ctx.fillStyle = `rgba(0,0,0,${0.16 * a})`; ctx.fillRect(0, y, PW, 2); } ctx.restore(); }
function cctv(t) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = 'rgba(30,60,40,0.18)'; ctx.fillRect(0, 0, PW, PH); for (let y = 0; y < PH; y += 4) { ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(0, y, PW, 1); }
  ctx.font = "700 44px 'Courier 10 Pitch', monospace"; ctx.fillStyle = '#e8f0e0'; ctx.fillText('CAM 01', 70, 380); ctx.fillText('DAY 07  06:' + String(31 + Math.floor((t - T.shoes) * 3)).padStart(2, '0') + ' AM', 70, 1500);
  if (Math.floor(t * 2) % 2) { ctx.fillStyle = '#ff3030'; ctx.beginPath(); ctx.arc(PW - 150, 365, 16, 0, 6.3); ctx.fill(); ctx.fillStyle = '#e8f0e0'; ctx.fillText('REC', PW - 125, 380); } ctx.restore(); }

// ---------- планы: [начало, имя, функция(t, u)]. Камера нигде не входит в предметы (проверка: tools/clipcheck.cjs)
const night = { sky: 'night', lit: 1, neon: true, shut: 0, rain: 1, clock: '3:07' };
const CTR = [[2.3, 1.13, -2.9], [5.9, 1.13, -2.9]];                     // задний край столешницы: герой за кассой виден только выше него
const JN = [4.0, -3.25];                                                // Joe за кассой
const card3 = (cd, fn, x, z, o) => { dDraw(cd, fn); dPlace(cd, x, z, o); };
const jc = o => () => joe({ x: 256, y: 660 - 512 * 0.88, s: 0.88, noShadow: true, ...o });
const zc = o => () => zombie({ x: 256, y: 660 - 512 * 0.88, s: 0.88, noShadow: true, v: 0, ...o });
const hide = (...c) => c.forEach(x => { x.q.visible = false; });
const kick = (t, t0, d = 0.35) => t > t0 && t < t0 + d ? 1 - (t - t0) / d : 0;
const SHOT3 = [
  // 0. Крючок: рассвет, сорок спин у жалюзи; камера поднимается из-за колонок над головами
  [0, 'hook', (t, u) => { stSet(t, { sky: 'dawn', lit: 0.2, neon: false, shut: 1, dents: 1, bulge: 0.2, crowd: 'pound', rain: 0.4, canopy: 0.35, clock: '6:31' }); hide(ST.joe, ST.z1);
    dCam(t, [[0, 0.5, 1.3, 7.0, 0, 1.7, 0.5, 60], [T.k02 - 0.1, -0.3, 3.3, 4.9, 0, 1.1, 0.6, 56]]); dShake(Math.max(0, Math.sin(t * 9)) * 4); R3(); }],
  // 1. Изнутри: сталь прогибается, свет бьёт сквозь щели; Joe на переднем плане
  [T.k02 - 0.1, 'bend', (t, u) => { stSet(t, { sky: 'dawn', lit: 0.3, neon: false, shut: 1, bulge: 0.25 + 0.45 * pr(t, T.k02, T.k03), dents: 1, shafts: 0.9, shaftX: -0.6, shaftTX: 0.8, rain: 0, alarm: 0.45, crowd: 'pound', clock: '6:31' }); hide(ST.joe, ST.z1);
    dCam(t, [[T.k02 - 0.1, -1.3, 1.3, -4.6, 1.4, 1.75, 0.4, 58, 0.05], [T.k03, -0.9, 1.4, -3.9, 1.2, 1.8, 0.4, 50, -0.03]]); dShake(4 + 3 * Math.sin(t * 13)); R3({ blur: 2.5 });
    dHero(-0.1, 0, -3.1, joe2({ t, mood: 'shock', pupil: 0.55, eyeTilt: 0.8, mouthKind: 'grimace', pale: 1, tremble: 1, sweat: 1, lk: [0.8, -0.3], arms: { l: [-170, 160, 'open'], r: [160, 190, 'open'] } }), { tint: 'rgba(60,30,50,0.22)', stripes: { col: 'rgba(255,190,120,0.3)', off: t * 40 } }); }],
  // 2. «Семь дней назад»: перемотка — толпа пятится, жалюзи поднимаются, небо листает сутки
  [T.k03 - 0.15, 'rewind', (t, u) => { const k = pr(t, T.k03 - 0.15, T.k04 - 0.05), sky = k < 0.25 ? 'dawn' : k < 0.5 ? 'night' : k < 0.68 ? 'dusk' : k < 0.82 ? 'day' : 'night';
    stSet(t, { sky, lit: k > 0.82 ? 1 : 0.2, neon: k > 0.82, shut: 1 - eo(pr(k, 0.45, 0.85)), dents: 1 - k, crowd: k < 0.82 ? 'leave' : null, crowdK: k * 0.75, rain: 0.6, canopy: k > 0.82 ? 1 : 0.4 }); hide(ST.joe, ST.z1);
    dCam(t, [[T.k03 - 0.15, 0.2, 3.0, 12.6, 0, 1.9, 0, 56], [T.k04 - 0.05, 0, 3.2, 14, 0, 1.9, 0, 58]], k => k); R3(); vhs(t);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); S = 1; push(PW / 2, 900, 1, -0.03); ransom('7 DAYS EARLIER', 0, 0, 110, 7040, { reveal: pr(u, 0.05, 0.35), pop: true, maxW: 960 }); pop(); txt('◀◀', 120, 300, 70, { font: "'Courier 10 Pitch'", weight: 700, col: '#fbf8f0' }); ctx.restore(); }],
  // 3. Одним планом: со стоянки между колонок, в раздвижную дверь, к Joe за кассой
  [T.k04 - 0.05, 'arrive', (t, u) => { const s = T.k04 - 0.05, a = stack3(t); stSet(t, { ...night, door: pr(t, s + 1.1, s + 1.9) }); hide(ST.z1);
    dCam(t, [[s, 0, 3.2, 14, 0, 1.9, 0, 58], [s + 1.6, 0, 1.55, 6.6, 0, 1.6, 0, 58], [s + 2.75, 0, 1.55, 0.3, 1.2, 1.45, -2.2, 56], [T.chime - 0.4, 1.5, 1.5, -1.25, JN[0], 1.3, JN[1], 46]]);
    card3(ST.joe, jc({ t, flip: true, lk: [0.8, 0.1], mood: 'sleepy', arms: { l: [-150, 300, 'open'], r: [...a, 'fist'] } }), ...JN); R3();
    if (u < 2.2) vstamp('3:07 AM', t, T.k04 + 0.4, 520, 120, 501); }],
  // 4. Из-за кассы: дверь разъезжается, в проёме — он
  [T.chime - 0.4, 'door', (t, u) => { const s = T.chime - 0.4, zin = pr(t, s, T.walks + 0.5), z = lerp(7.2, 1.05, eo(zin)); stSet(t, { ...night, door: pr(t, T.chime - 0.15, T.chime + 0.4), flick: t > T.walks }); hide(ST.joe);
    dCam(t, [[s, 3.3, 1.55, -3.3, 0.1, 1.35, 0.6, 50, 0], [T.not - 0.1, 3.05, 1.5, -3.2, 0.1, 1.3, 0.6, 38, 0.05]]);
    card3(ST.z1, zc({ t, legs: 'run', tilt: 0.15 + Math.sin(step(t, 8) * 3) * 0.05, arms: { l: [-150, 110, 'open'], r: [150, 90, 'open'] } }), lerp(1.3, 0.1, eo(zin)), z, { y: z < 1.75 ? SWK : 0 }); R3(); }],
  // 5. 2.5D: Joe за кассой — оцепенение, потом крик
  [T.not - 0.1, 'shock', (t, u) => { stSet(t, { ...night, door: 1, flick: true }); hide(ST.joe, ST.z1);
    dCam(t, [[T.not - 0.1, 2.0, 1.5, -1.0, JN[0], 1.45, JN[1], 42], [T.k06, 2.3, 1.5, -1.5, JN[0], 1.5, JN[1], 36]]); R3({ blur: 5 });
    const sc = t > T.gas - 0.05; dHero(JN[0], 0, JN[1], joe2({ t, mood: 'shock', scream: sc ? 1 : 0, mouthKind: sc ? '' : 'wavy', pupil: 0.55, eyeTilt: 0.7, pale: 0.6, tremble: sc ? 1 : 0.4, sweat: 1, lk: [-0.8, -0.1], arms: { l: [-180, 170, 'open'], r: [180, 150, 'open'] } }), { clipLine: CTR }); }],
  // 6. Макро: кулак по кнопке LOCKDOWN
  [T.k06 - 0.05, 'button', (t, u) => { const hit = T.slam + 0.25; stSet(t, { ...night, door: 1, alarm: t > hit ? 1 : 0, btnDown: t > hit && t < hit + 0.5, lit: 0.8 }); hide(ST.joe, ST.z1);
    dCam(t, [[T.k06 - 0.05, 3.2, 1.66, -1.5, 3.6, 1.2, -2.25, 46], [T.steel - 0.1, 3.3, 1.56, -1.66, 3.6, 1.2, -2.25, 38]]); dShake(26 * kick(t, hit, 0.3)); R3({ exp: 0.8 });
    const b = dProj(3.6, 1.25, -2.25), k = t < hit ? eo(clamp((t - (hit - 0.22)) / 0.22)) : 1; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); S = 1;
    fist2(lerp(b.x + 520, b.x + 20, k), lerp(b.y - 900, b.y - 70, k) + (t > hit ? 18 : 0)); const q = kick(t, hit, 0.28);
    if (q > 0) for (let i = 0; i < 10; i++) { const an = i / 10 * 6.283 + 0.3, r0 = 150 + (1 - q) * 160; stroke([[b.x + Math.cos(an) * r0, b.y + Math.sin(an) * r0 * 0.6], [b.x + Math.cos(an) * (r0 + 110), b.y + Math.sin(an) * (r0 + 110) * 0.6]], '#fbf8f0', 14 * q); }
    ctx.restore(); vstamp('LOCKDOWN!', t, hit, 520, 120, 502); }],
  // 7. С пола: жалюзи падают, красная тревога, он остаётся снаружи
  [T.steel - 0.1, 'crash', (t, u) => { const sh = pr(t, T.steel, T.crash + 0.05); stSet(t, { ...night, door: 1 - pr(t, T.steel - 0.1, T.steel + 0.25), alarm: 1, lit: 0.55, neon: t < T.crash, shut: sh, flick: true, knock: [0.1, -0.2, kick(t, T.crash + 0.5, 0.4)] }); hide(ST.joe);
    dCam(t, [[T.steel - 0.1, -0.8, 0.5, -3.4, 0.6, 1.9, 0.4, 64, 0], [T.crash, -0.7, 0.55, -3.2, 0.5, 1.7, 0.4, 60, 0.05], [T.k07 - 0.1, -0.6, 0.6, -3.0, 0.5, 1.75, 0.4, 58, 0]]); dShake(24 * kick(t, T.crash, 0.6));
    const pd = Math.sin(step(t, 12) * 9) * 14; card3(ST.z1, zc({ t, tilt: 0.1, arms: { l: [-120, -10 + pd, 'open'], r: [120, -20 - pd, 'open'] } }), 0.1, 1.05, { y: SWK }); R3();
    vstamp('CRASH!', t, T.crash, 520, 130, 503); }],
  // 8. День 7, ночь: зомби натыкается на машину под фонарём — сигнализация
  [T.k07 - 0.1, 'car', (t, u) => { const on = t > T.alarm - 0.15, zk = pr(t, T.k07 - 0.1, T.alarm - 0.15), bump = on ? Math.sin((t - T.alarm) * 22) * Math.exp(-(t - T.alarm + 0.15) * 3) : 0;
    stSet(t, { sky: 'night', lit: 0.15, neon: false, shut: 1, car: on, rain: 0.8, canopy: 0.6, clock: '4:40' }); hide(ST.joe); ST.car.rotation.z = bump * 0.025;
    dCam(t, [[T.k07 - 0.1, -7.2, 0.6, 16.6, -10.0, 1.0, 12.2, 56], [T.alarm, -7.8, 0.75, 15.9, -10.3, 0.95, 12.2, 48], [T.k08 - 0.05, -8.2, 0.9, 15.4, -10.4, 0.9, 12.2, 44]]); dShake(on ? 5 * (Math.floor(t * 3.2) % 2) : 0);
    card3(ST.z1, zc({ t, v: 1, legs: on ? 'stand' : 'run', mood: on ? 'shock' : 'dread', tilt: on ? -0.1 : 0.2 + Math.sin(step(t, 8) * 3) * 0.06, arms: on ? { l: [-170, 60, 'open'], r: [170, 50, 'open'] } : { l: [-150, 110, 'open'], r: [150, 90, 'open'] } }), lerp(-5.6, -8.55, zk) + bump * 0.06, lerp(14.2, 13.35, zk)); R3(); }],
  // 9. Рассвет: сорок фигур сходятся к жалюзи между колонок; камера с краю навеса поднимается
  [T.k08 - 0.05, 'gather', (t, u) => { const s = T.k08 - 0.05, k = pr(t, s - 0.2, T.k09 - 0.5); stSet(t, { sky: 'dawn', lit: 0.2, neon: false, shut: 1, crowd: 'gather', crowdK: k, dents: k, rain: 0.2, canopy: 0.3, clock: '6:31' }); hide(ST.joe, ST.z1); ST.car.rotation.z = 0;
    dCam(t, [[s, 7.4, 2.4, 7.8, 0.5, 1.2, 3.0, 58], [T.k09 - 0.05, 5.9, 3.5, 4.4, -1.0, 1.0, 1.6, 54]]); R3(); vstamp('40', t, T.forty, 520, 200, 2530); }],
  // 10. Изнутри, широко: три тонны на одном листе стали
  [T.k09 - 0.05, 'bolts', (t, u) => { stSet(t, { sky: 'dawn', lit: 0.3, neon: false, shut: 1, bulge: 0.5 + 0.2 * Math.abs(Math.sin(t * 5)), dents: 1, shafts: 1, shaftX: -1, shaftTX: 1.2, rain: 0, alarm: 0.4, crowd: 'pound', clock: '6:31' }); hide(ST.joe, ST.z1);
    dCam(t, [[T.k09 - 0.05, -1.2, 0.9, -5.2, 0.9, 1.8, 0.4, 58, -0.03], [T.one, -0.7, 1.05, -4.3, 0.8, 1.8, 0.4, 52, 0.03]]); dShake(5 + 4 * Math.abs(Math.sin(t * 5))); R3(); vstamp('6000 LBS', t, T.six + 0.2, 520, 130, 2531); }],
  // 11. Макро: анкерная пластина на перемычке — болт вылетает, потом второй, пластина падает
  [T.one - 0.15, 'bolt2', (t, u) => { const p1 = T.pops + 0.05, p2 = T.another + 0.25; stSet(t, { sky: 'dawn', lit: 0.4, neon: false, shut: 1, bulge: 0.6 + 0.1 * Math.sin(t * 9), dents: 1, shafts: 1, shaftX: 0.6, shaftTX: 1.2, rain: 0, alarm: 0.4, crowd: 'pound', pop: [p1, p2], clock: '6:31' }); hide(ST.joe, ST.z1);
    dCam(t, [[T.one - 0.15, 2.35, 2.9, -1.35, 1.6, 3.3, -0.15, 34], [p1, 2.2, 2.95, -1.2, 1.6, 3.3, -0.15, 28], [T.k10 - 0.05, 2.1, 2.9, -1.25, 1.6, 3.2, -0.15, 30]]); dShake(5 + 26 * Math.max(kick(t, p1, 0.4), kick(t, p2, 0.4))); R3();
    [p1, p2].forEach((p, i) => vstamp('POP!', t, p, 1010 + i * 150, 110, 2540 + i, { x: PW / 2 - 130 + i * 260, life: 0.9, rot: i ? 0.06 : -0.06 })); }],
  // 12. 2.5D: «большинство» — паника, крик, бег (три красных креста)
  [T.k10 - 0.05, 'panic', (t, u) => { stSet(t, { ...night, lit: 0.6, alarm: 0.8, neon: false, shut: 1, dents: 1, crowd: 'pound', clock: '6:31' }); hide(ST.joe, ST.z1);
    dCam(t, [[T.k10 - 0.05, -0.7, 1.5, -0.9, 0.2, 1.3, -3.4, 46], [T.k11 - 0.05, -0.5, 1.5, -1.3, 0.2, 1.3, -3.4, 42]]); R3({ blur: 6 });
    const ph = t < T.scream - 0.05 ? 0 : t < T.run - 0.05 ? 1 : 2, t0 = [T.panic - 0.1, T.scream - 0.05, T.run - 0.05][ph];
    const jo = [{ mood: 'shock', scream: 0.7, pupil: 0.6, eyeTilt: 0.8, arms: { l: [-190, 40, 'open'], r: [190, 40, 'open'] } }, { mood: 'shock', scream: 1, pupil: 0.5, eyeTilt: 1, tremble: 1, arms: { l: [-150, -40, 'open'], r: [150, -40, 'open'] } }, { mood: 'shock', scream: 0.6, legs: 'run', lean: 0.2, eyeTilt: 0.8, arms: { l: [-170, 120, 'fist'], r: [170, 220, 'fist'] } }][ph];
    if (ph === 2) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); S = 1; const r = rng(hsh(Math.floor(t * 15), 9)); for (let i = 0; i < 9; i++) { const y = 500 + r() * 1000, x = r() * 500; stroke([[x, y], [x + 220 + r() * 260, y]], 'rgba(255,255,255,0.55)', 8 + r() * 10); } ctx.restore(); }
    dHero(0.2, 0, -3.4, joe2({ t, sweat: 1, ...jo }), { tint: 'rgba(255,40,30,0.14)', dx: ph === 2 ? Math.sin(t * 40) * 6 : 0 });
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); S = 1; redX(PW / 2, 900, pr(t, t0 + 0.35, t0 + 0.55)); ctx.restore(); vstamp(['PANIC', 'SCREAM', 'RUN'][ph], t, t0, 470, 130, 2600 + ph, { life: 0.9 }); }],
  // 13. 2.5D: «ты делаешь наоборот» — решимость
  [T.k11 - 0.05, 'calm', (t, u) => { stSet(t, { ...night, lit: 0.5, alarm: 0.3, neon: false, shut: 1, dents: 1, crowd: 'pound', clock: '6:31' }); hide(ST.joe, ST.z1);
    dCam(t, [[T.k11 - 0.05, 2.5, 1.5, -1.15, JN[0], 1.45, JN[1], 38], [T.shoes - 0.1, 2.75, 1.5, -1.5, JN[0], 1.5, JN[1], 32]]); R3({ blur: 6 });
    dHero(JN[0], 0, JN[1], joe2({ t, eyeTilt: -0.7, mouthKind: 'clench', lk: [-0.2, 0], arms: { l: [-150, 300, 'fist'], r: [150, 300, 'fist'] } }), { tint: 'rgba(20,30,60,0.14)', clipLine: CTR }); }],
  // 14. Камера наблюдения: лампы гаснут одна за другой
  [T.shoes - 0.1, 'cctv', (t, u) => { const on = t < T.lights ? 5 : Math.max(0, 4 - Math.floor((t - T.lights) / 0.16)); stSet(t, { sky: 'dawn', lit: 0.6, lampsOn: on, neon: false, shut: 1, dents: 1, shafts: 0.5, shaftX: 0, shaftTX: 1, rain: 0, crowd: 'pound', clock: '6:31' }); hide(ST.z1);
    dCam(t, [[T.shoes - 0.1, 6.3, 3.2, -0.9, 2.6, 0.6, -3.4, 72], [T.crawl - 0.1, 6.3, 3.2, -0.9, 3.0, 0.6, -3.2, 68]]);
    card3(ST.joe, jc({ t, lk: [-0.3, 0.6], eyeTilt: -0.4, mouthKind: 'clench', arms: { l: [-150, 260, 'open'], r: [130, 330, 'open'] } }), ...JN); R3(); cctv(t); }],
  // 15. В закутке за кассой: сидит не шевелясь; полосы света ползут по стене — 11 часов
  [T.crawl - 0.1, 'hide', (t, u) => { const tl = pr(t, T.eleven - 0.3, T.k12 - 0.1); stSet(t, { sky: 'day', lit: 0, lampsOn: 0, neon: false, shut: 1, dents: 0.6, shafts: 1, shaftX: lerp(-1, 4, eio(tl)), shaftTX: 0.6, rain: 0, canopy: 0, crowd: 'pound', clock: '6:31' }); hide(ST.z1);
    dCam(t, [[T.crawl - 0.1, 5.75, 0.5, -3.25, 3.4, 0.55, -3.25, 54], [T.move, 5.2, 0.55, -3.25, 3.4, 0.6, -3.25, 46], [T.k12 - 0.1, 4.9, 0.6, -3.25, 3.4, 0.65, -3.25, 44]]);
    card3(ST.joe, jc({ t, legs: 'sit', mood: 'dread', lid: 0.2, lk: [-0.6, -0.2], eyeTilt: 0.4, arms: { l: [-120, 250, 'fist'], r: [120, 250, 'fist'] } }), 3.4, -3.25, { y: -0.42 }); R3();
    vstamp('11 HOURS', t, T.eleven, 520, 120, 2550);
    if (tl > 0) { const m = 6 * 60 + 31 + Math.floor(eio(tl) * 660), h = Math.floor(m / 60) % 24; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.font = "700 64px 'Courier 10 Pitch', monospace"; ctx.textAlign = 'center'; ctx.lineWidth = 10; ctx.strokeStyle = '#141010'; ctx.fillStyle = '#ffd21f';
      const s = `${String(((h + 11) % 12) + 1).padStart(2, '0')}:${String(m % 60).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; ctx.strokeText(s, PW / 2, 700); ctx.fillText(s, PW / 2, 700); ctx.restore(); } }],
  // 16. 2.5D, день: один оборачивается — мутные глаза не видят, голова наклоняется на звук
  [T.k12 - 0.05, 'eyes', (t, u) => { stSet(t, { sky: 'day', lit: 0, lampsOn: 0, neon: false, shut: 1, dents: 1, bulge: 0.3, crowd: 'pound', rain: 0, canopy: 0, clock: '2:15' }); hide(ST.joe, ST.z1);
    dCam(t, [[T.k12 - 0.05, 0.4, 1.75, 6.3, 0.3, 1.55, 3.9, 44], [T.sound - 0.3, 0.45, 1.75, 5.7, 0.3, 1.55, 3.9, 38]]); R3({ blur: 5 });
    const tilt = t > T.sound - 0.35 ? 0.35 * sm(pr(t, T.sound - 0.35, T.sound)) : 0; dHero(0.3, 0, 3.9, zom2({ t: t * 0.4, v: 2, lid: 0.38, eyeBig: 1, lk: [Math.sin(t * 2.3) * 0.8, 0.3], tilt: 0.1 + tilt, arms: { l: [-150, 110, 'open'], r: [150, 90, 'open'] } }));
    vstamp('EYES', t, T.eyes - 0.05, 470, 130, 2570, { life: T.sound - T.eyes - 0.25 }); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); S = 1; if (t < T.sound - 0.35) redX(PW / 2, 470, pr(t, T.eyes + 0.3, T.eyes + 0.5) * 0.6);
    if (t > T.sound - 0.35) { const p = dProj(0.3, 1.75, 3.9); rings(p.x, p.y, t, pr(t, T.sound - 0.35, T.sound)); } ctx.restore(); vstamp('SOUND', t, T.sound - 0.05, 470, 130, 2571, { life: 1.4 }); }],
  // 17. 2.5D: Joe в закутке не дышит, по лицу — полосы света
  [T.and40 - 0.1, 'breath', (t, u) => { stSet(t, { sky: 'day', lit: 0, lampsOn: 0, neon: false, shut: 1, dents: 1, shafts: 1, shaftX: 3.4, shaftTX: 0.6, rain: 0, canopy: 0, crowd: 'pound', clock: '2:15' }); hide(ST.joe, ST.z1);
    dCam(t, [[T.and40 - 0.1, 5.0, 0.95, -3.25, 3.4, 0.9, -3.25, 40], [T.k13 - 0.05, 4.6, 0.95, -3.25, 3.4, 0.9, -3.25, 34]]); R3({ blur: 5 });
    dHero(3.4, -0.42, -3.25, joe2({ t, legs: 'sit', mouthKind: 'puff', eyeTilt: 0.5, sweat: 1, lk: [Math.sin(t * 3) > 0 ? 0.9 : -0.9, -0.3], arms: { l: [-120, 250, 'fist'], r: [120, 250, 'fist'] } }), { tint: 'rgba(30,30,70,0.3)', stripes: { off: t * 14 } }); }],
  // 18. Сумерки: расходятся по одному; камера у автоматов смотрит через стоянку на трассу
  [T.k13 - 0.05, 'leave', (t, u) => { const s = T.k13 - 0.05; stSet(t, { sky: 'dusk', lit: 0, lampsOn: 0, neon: false, shut: 1, dents: 0.5, crowd: 'leave', crowdK: pr(t, s - 0.3, T.k14 + 0.3), rain: 0.3, canopy: 0.35, clock: '8:10' }); hide(ST.joe, ST.z1);
    dCam(t, [[s, -6.6, 2.45, 2.7, 2.0, 1.0, 8.5, 58], [T.k14 - 0.05, -5.9, 3.3, 3.3, 3.0, 0.8, 10, 54]]); R3(); }],
  // 19. Ночь 12-го: лунные полосы на полу, камера крадётся к двери — и первый удар
  [T.k14 - 0.05, 'knock', (t, u) => { const k1 = T.kn[0]; stSet(t, { sky: 'night', lit: 0, lampsOn: 0, neon: false, shut: 1, shafts: 0.8, shaftCol: 0x9ab8ff, shaftX: -0.6, shaftTX: 0.9, rain: 0.8, canopy: 0.25, exit: 1, clock: '1:12', knock: [0, -0.1, t > k1 ? 0.3 + 0.7 * kick(t, k1, 0.3) : 0] }); hide(ST.joe, ST.z1);
    dCam(t, [[T.k14 - 0.05, 0.9, 1.3, -5.3, 0, 1.5, 0.4, 50], [k1, 0.5, 1.4, -2.9, 0, 1.5, 0.4, 44], [T.kn[1], 0.45, 1.4, -2.6, 0, 1.5, 0.4, 40]]); dShake(22 * kick(t, k1, 0.25)); R3(); }],
  // 20. 2.5D: глаза над прилавком — второй удар
  [T.kn[1] - 0.06, 'peek', (t, u) => { stSet(t, { sky: 'night', lit: 0, lampsOn: 0, neon: false, shut: 1, shafts: 0.8, shaftCol: 0x9ab8ff, shaftX: 2.4, shaftTX: 0.9, rain: 0.8, canopy: 0.25, exit: 1, clock: '1:12', knock: [0, -0.1, 0.5] }); hide(ST.joe, ST.z1);
    dCam(t, [[T.kn[1] - 0.06, 2.2, 1.3, -1.3, 3.8, 1.25, -3.25, 30], [T.kn[2], 2.25, 1.3, -1.4, 3.8, 1.25, -3.25, 28]]); dShake(18 * kick(t, T.kn[1], 0.25)); R3({ blur: 5 });
    dHero(3.8, -0.25, -3.25, joe2({ t, mood: 'shock', pupil: 0.5, eyeTilt: 0.8, sweat: 1, lk: [-0.9, 0], arms: { l: [-150, 300, 'open'], r: [150, 300, 'open'] } }), { tint: 'rgba(30,40,90,0.34)', clipLine: CTR, stripes: { col: 'rgba(170,200,255,0.3)', off: 40 } }); }],
  // 21. Третий удар — в упор
  [T.kn[2] - 0.06, 'knock3', (t, u) => { stSet(t, { sky: 'night', lit: 0, lampsOn: 0, neon: false, shut: 1, shafts: 0.8, shaftCol: 0x9ab8ff, shaftX: -0.6, shaftTX: 0.9, rain: 0.8, canopy: 0.25, exit: 1, clock: '1:12', knock: [0, -0.1, 0.6 + 0.4 * kick(t, T.kn[2], 0.3)] }); hide(ST.joe, ST.z1);
    dCam(t, [[T.kn[2] - 0.06, 0.3, 1.45, -1.9, 0, 1.5, 0.4, 40], [T.card, 0.25, 1.45, -1.5, 0, 1.5, 0.4, 34]]); dShake(28 * kick(t, T.kn[2], 0.25)); R3(); }],
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
  if (i > 0 && u < 0.15 && !['rewind', 'end', 'door', 'shock', 'bolt2', 'peek', 'knock3', 'arrive'].includes(nm)) {             // «хлыст»: камера прилетает со смазом (направление чередуется)
    const k = 1 - u / 0.15, dir = i % 2 ? 1 : -1, sp = 140 * k * k; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (let j = 1; j <= 3; j++) { ctx.globalAlpha = 0.28 * k; ctx.drawImage(ctx.canvas, dir * sp * j / 3, 0); } ctx.restore(); }
};

// ---------- поверх: день (вверху справа), крючок, субтитры по слову
const HOOK = { text: '40 ZOMBIES.|1 DOOR.', until: 2.9, seed: 7301 };
function dayNow(t) { if (t < T.k03 - 0.15) return [7, '06:31 AM']; if (t < T.k07 - 0.1) return [1, '03:07 AM']; if (t < T.k08) return [7, '04:40 AM']; if (t < T.k12 - 0.05) return [7, '06:31 AM']; if (t < T.k14 - 0.05) return [7, t < T.k13 - 0.05 ? '02:15 PM' : '08:10 PM']; return [12, '01:12 AM']; }
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
  T.kn.forEach((k, i) => { if (t < T.card) vstamp('KNOCK', t, k, 560 + i * 160, 110, 2560, { x: PW / 2 - 140 + i * 140, life: 2 }); });
  if (nm !== 'end') vSub3(t);
};
post = function (t, o) {                                               // свечение — в dRender (только источники); здесь — цвет, зерно, виньетка
  o.save(); o.filter = 'saturate(1.18) contrast(1.07) brightness(1.02)'; o.drawImage(o.canvas, 0, 0); o.restore();
  o.save(); o.globalCompositeOperation = 'soft-light'; const gg = o.createLinearGradient(0, 0, 0, PH); gg.addColorStop(0, 'rgba(40,120,170,0.28)'); gg.addColorStop(1, 'rgba(255,140,60,0.2)'); o.fillStyle = gg; o.fillRect(0, 0, PW, PH); o.restore();
  o.save(); o.globalCompositeOperation = 'overlay'; o.globalAlpha = 0.05; const fr = Math.floor(t * 12), gx = -(hsh(fr) % 256), gy = -(hsh(fr, 7) % 256); for (let x = gx; x < PW; x += 512) for (let y = gy; y < PH; y += 512) o.drawImage(GRAIN, x, y); o.restore();
  const v = o.createRadialGradient(PW / 2, PH * 0.48, PW * 0.45, PW / 2, PH * 0.5, PH * 0.62); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.38)'); o.save(); o.fillStyle = v; o.fillRect(0, 0, PW, PH); o.restore();
};
window.EXPORT = { T, shots: SHOT3.map(s => [s[0], s[1]]) };
