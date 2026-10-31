/* Общее для всех серий «Аппликации»: слова озвучки, выражения по времени, камера, тряска, вставки, субтитры, обложка, виньетка.
   Серия объявляет: CUE (метки от слов), SHOTS [[t, 'имя']...], SH { имя(t, u) }, EP { title: ['СТРОКА 1', 'СТРОКА 2'], cens: {'слово,': 'С*ОВО,'}, hot: /.../i, hideMat: [[ключРеплики, начало слова, CUE]] },
   SHAKES [[t, длит, сила]]. Необязательно: SUB — настройки субтитров (см. ниже), EP.subs = false — без вшитых субтитров (длинные ролики: .srt). */
const WS = {}; LINES.forEach(l => { WS[l.key] = l.words.filter(w => w.w !== '—').map(w => w.s); });
const Wd = (k, i) => WS[k][i]; const LN = {}; LINES.forEach(l => { LN[l.key] = l; });

function ex(t, list, d = 0.08) { let cur = {}, prev = {}, t0 = -1e9; for (const [tt, o] of list) if (t >= tt) { prev = cur; cur = { ...cur, ...o }; t0 = tt; }
  const k = sm((t - t0) / d), r = { ...cur }; for (const key in cur) if (typeof cur[key] === 'number' && typeof prev[key] === 'number') r[key] = lerp(prev[key], cur[key], k); return r; }
function ck(t, K) { if (t <= K[0][0]) return K[0].slice(1); for (let i = 1; i < K.length; i++) if (t < K[i][0]) { const a = K[i - 1], b = K[i], k = eio((t - a[0]) / (b[0] - a[0])); return [lerp(a[1], b[1], k), lerp(a[2], b[2], k), lerp(a[3], b[3], k)]; } return K[K.length - 1].slice(1); }
function talk(who, t) { const m = mouthAt(who, t); return { m, bob: m.talking ? -m.open * 5 : 0 }; }
function shakeAt(t) { let s = 0; for (const [t0, d, a] of (typeof SHAKES !== 'undefined' ? SHAKES : [])) if (t >= t0 && t < t0 + d) s = Math.max(s, a * (1 - (t - t0) / d)); return s; }
function slideIn(u, fn) { const k = step(clamp(u / 0.25), 24); push((1 - eo(k)) * (W + 20), 0, 1, (1 - k) * 0.08); fn(); pop(); }   // вставка «въезжает» карточкой
function bg(col, seed = 2999) { rectP(-100, -100, W + 200, H + 200, col, { seed, line: false, step: 80 }); }
function label(x, y, s, w, col = '#f4e6a8', rot = 0.03, size = 46) { push(x, y, 1, rot); card(0, 0, Math.max(300, s.length * size * 0.62 + 80), 110, 0, hsh(s.length, x), col); txt(s, 0, 4, size, { font: 'Inter Black', col: '#1c1512' }); pop(); }
function slam(word, t, t0, seed, y = H * 0.17, size = 150, rot = -0.04) { if (t > t0) { push(W / 2, y, 1, rot); ransom(word, 0, 0, size, seed, { reveal: pr(t, t0, t0 + 0.2), pop: true }); pop(); } }

let _shot = 0;
function shotAt(t) { let i = 0; while (i < SHOTS.length - 1 && t >= SHOTS[i + 1][0]) i++; return i; }
function frame(t) { const i = shotAt(t); SH[SHOTS[i][1]](t, t - SHOTS[i][0]); }
Object.defineProperty(window, 'SC', { get: () => SHOTS.map((s, i) => [s[1], s[0], i + 1 < SHOTS.length ? SHOTS[i + 1][0] : DUR]) });

// ------------------------------------------------------------------ субтитры: по 1–3 слова, Inter 900, обводка; цвета — по говорящему (SUB.cols), ключевые — жёлтым (EP.hot)
// Горизонталь 16:9: по центру, y = H − 150, до 1100 px. Вертикаль 9:16 (Shorts): x 520, y 1440, ≤ 860 px — выше интерфейса TikTok/Reels.
const SUB = Object.assign(W > H ? { x: W / 2, y: H - 150, size: 64, maxW: 1100, words: 4, chars: 24 } : { x: 520, y: 1440, size: 76, maxW: 860, words: 3, chars: 15 },
  { cols: {} }, typeof SUBCFG !== 'undefined' ? SUBCFG : {});
const GROUPS = (() => { const out = [];
  for (const ln of LINES) { const ws = ln.words.filter(w => w.w !== '—'), gs = []; let cur = [];
    const flush = () => { if (cur.length) gs.push({ sp: ln.speaker, key: ln.key, words: cur }); cur = []; };
    for (const w of ws) { const len = cur.reduce((n, x) => n + x.w.length + 1, 0) + w.w.length; if (cur.length >= SUB.words || len > SUB.chars) flush(); cur.push(w); if (/[.!?…:]$/.test(w.w)) flush(); }
    flush(); gs.forEach((g, i) => { g.s = g.words[0].s - 0.04; g.e = i + 1 < gs.length ? gs[i + 1].words[0].s - 0.04 : ln.end + 0.2; }); out.push(...gs); }
  return out; })();
function hudFrame(t) {
  const first = SHOTS.length > 1 ? SHOTS[1][0] : 1;
  if (t < first && EP.title) EP.title.forEach((ln, i) => { push(W / 2, (W > H ? 150 : 230) + i * 150, 1, i % 2 ? 0.02 : -0.03); ransom(ln, 0, 0, i ? 104 : 120, 990 + i); pop(); });
  if (EP.subs === false) return;
  const g = GROUPS.find(x => t >= x.s && t < x.e); if (!g) return;
  for (const [key, start, t0] of (EP.hideMat || [])) if (g.key === key && t > t0 - 0.05 && g.words.some(w => w.w.startsWith(start))) return;   // мат в этот момент — вырезками на экране
  const size = SUB.size, y = SUB.y, cens = EP.cens || {}; ctx.save(); ctx.font = `900 ${size}px Inter`;
  const words = g.words.map(w => (cens[w.w] || w.w).replace(/[«»]/g, '').toUpperCase()), sp = ctx.measureText(' ').width * 1.1, wd = words.map(w => ctx.measureText(w).width), tw = wd.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
  ctx.restore(); const sc = Math.min(1, SUB.maxW / tw); let x = -tw / 2;
  push(SUB.x, y, sc * (0.92 + 0.08 * popK(t, g.s, 0.15)));
  words.forEach((w, i) => { const on = t >= g.words[i].s - 0.03, bare = g.words[i].w.replace(/[,!?.…:«»]/g, ''), mat = !!cens[g.words[i].w];
    const col = mat ? '#ff4a3a' : (EP.hot && EP.hot.test(bare)) ? '#ffd23a' : SUB.cols[g.sp] || '#ffffff';
    txt(w, x + wd[i] / 2, 0, size, { font: 'Inter', weight: 900, col: on ? col : 'rgba(255,255,255,0.5)', stroke: 15, sc: '#120d0b' }); x += wd[i] + sp; });
  pop();
}
function post(t, o) { const v = o.createRadialGradient(W / 2, H * 0.45, H * 0.35, W / 2, H * 0.5, H * 0.8); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.35)'); o.save(); o.fillStyle = v; o.fillRect(0, 0, W, H); o.restore(); }
