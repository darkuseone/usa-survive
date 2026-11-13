// Надписи стиля B (SVG поверх кадра): слово-штамп, красный крест, счётчик дня, карточка-факт с источником, субтитры по одному
// слову (белые с обводкой, ключевые — жёлтые, y 1330 из 1920 — ниже лиц), финальная карточка.
import React from "react";

export const W = 1080, H = 1920;
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const pr = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const eo = (x: number) => 1 - (1 - clamp01(x)) ** 3;
export const HOT = /^(day|days|zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|nineteen|forty|thousand|\d.*|never|nobody|silence|knock|knocks|alone|sound|eyes|opposite|water|fema|mistake|loudest|county|inside|dark|freezing)$/i;

export const Word: React.FC<{ s: string; x?: number; y: number; size: number; t: number; t0: number; life?: number; col?: string; rot?: number; pop?: boolean }> = ({ s, x = W / 2, y, size, t, t0, life = 2.2, col = "#fbf8f0", rot = -2, pop = true }) => {
  const age = t - t0; if (age < 0 || age > life) return null;
  const a = 1 - pr(age, life - 0.25, life), k = pop ? 0.7 + 0.3 * eo(age / 0.12) + 0.08 * Math.sin(Math.min(1, age / 0.25) * Math.PI) : 1;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`} opacity={a}>
      <text textAnchor="middle" dominantBaseline="middle" fontFamily="Osw" fontWeight={600} fontSize={size} stroke="#120d10" strokeWidth={size * 0.16} strokeLinejoin="round" paintOrder="stroke" fill={col}
        style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.45))" }}>{s}</text>
    </g>
  );
};
export const RedX: React.FC<{ x: number; y: number; k: number; r?: number }> = ({ x, y, k, r = 150 }) => {
  if (k <= 0) return null; const a = r * eo(k);
  return (<g stroke="#d8241c" strokeWidth={34} strokeLinecap="round"><line x1={x - a} y1={y - a} x2={x + a} y2={y + a} /><line x1={x + a} y1={y - a} x2={x - a} y2={y + a} /></g>);
};
export const DayTag: React.FC<{ n: number; clock: string }> = ({ n, clock }) => (
  <g transform="translate(905 215)">
    <rect x={-105} y={-75} width={210} height={170} rx={22} fill="#fbf8f0" stroke="#120d10" strokeWidth={7} />
    <rect x={-105} y={-75} width={210} height={52} rx={18} fill="#d8342c" stroke="#120d10" strokeWidth={7} />
    <text x={0} y={-40} textAnchor="middle" fontFamily="Osw" fontWeight={600} fontSize={38} fill="#fbf8f0">DAY</text>
    <text x={0} y={40} textAnchor="middle" fontFamily="Osw" fontWeight={600} fontSize={92} fill="#120d10">{n}</text>
    <text x={0} y={82} textAnchor="middle" fontFamily="Osw" fontWeight={600} fontSize={22} fill="#120d10">{clock}</text>
  </g>
);
/** карточка-факт: заголовок, 1–2 строки, источник мелко; выезжает снизу */
export const FactCard: React.FC<{ t: number; t0: number; t1: number; head: string; lines: string[]; src: string; y?: number }> = ({ t, t0, t1, head, lines, src, y = 520 }) => {
  if (t < t0 || t > t1) return null;
  const k = eo((t - t0) / 0.25), out = pr(t, t1 - 0.2, t1), dy = (1 - k) * 260 + out * 260, op = (1 - out);
  const w = 860, h = 150 + lines.length * 64;
  return (
    <g transform={`translate(${W / 2} ${y + dy}) rotate(-1.5)`} opacity={op}>
      <rect x={-w / 2 + 10} y={-h / 2 + 12} width={w} height={h} rx={26} fill="rgba(0,0,0,0.45)" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={26} fill="#fbf8f0" stroke="#120d10" strokeWidth={8} />
      <rect x={-w / 2} y={-h / 2} width={w} height={84} rx={22} fill="#2f6a6e" stroke="#120d10" strokeWidth={8} />
      <text x={0} y={-h / 2 + 56} textAnchor="middle" fontFamily="Osw" fontWeight={600} fontSize={50} fill="#fbf8f0">{head}</text>
      {lines.map((l, i) => <text key={i} x={0} y={-h / 2 + 140 + i * 64} textAnchor="middle" fontFamily="Osw" fontWeight={600} fontSize={56} fill="#120d10">{l}</text>)}
      <text x={w / 2 - 24} y={h / 2 - 18} textAnchor="end" fontFamily="Osw" fontWeight={600} fontSize={26} fill="#5a5560">{src}</text>
    </g>
  );
};
/** субтитры: одно слово, всплывает; words = [слово, начало, конец, ...] */
export const Captions: React.FC<{ t: number; words: [string, number, number, ...unknown[]][]; y?: number; hot?: RegExp }> = ({ t, words, y = 1330, hot = HOT }) => {
  let lo = 0, hi = words.length - 1, k = -1;
  while (lo <= hi) { const m = (lo + hi) >> 1; if (words[m][1] - 0.03 <= t) { k = m; lo = m + 1; } else hi = m - 1; }
  if (k < 0 || t > words[k][2]) return null;
  const w = String(words[k][0]).replace(/[.,!?…;:"“”]/g, "").toUpperCase(); if (!w) return null;
  const p = clamp01((t - words[k][1] + 0.03) / 0.09), sc = 0.82 + 0.18 * eo(p), size = Math.min(96, 980 / Math.max(1, w.length * 0.52));
  return (
    <g transform={`translate(${W / 2} ${y}) scale(${sc})`}>
      <text textAnchor="middle" dominantBaseline="middle" fontFamily="Osw" fontWeight={600} fontSize={size} stroke="#141010" strokeWidth={15} strokeLinejoin="round" paintOrder="stroke"
        fill={hot.test(w.replace(/'S$/, "")) ? "#ffd21f" : "#fbf8f0"} style={{ filter: "drop-shadow(0 0 10px rgba(0,0,0,0.6))" }}>{w}</text>
    </g>
  );
};
/** финальная карточка без голоса: два слова-вопроса, плашка, стрелка вниз на Related video */
export const EndCard: React.FC<{ u: number; t: number; t0: number; l1: string; l2: string; chip?: string }> = ({ u, t, t0, l1, l2, chip = "FULL STORY ON MY CHANNEL" }) => {
  const a = pr(u, 0.8, 1.3), P: [number, number][] = [];
  for (let i = 0; i <= 24 * a; i++) { const q = i / 24; P.push([820 + (250 - 820) * q + Math.sin(q * 3.1) * 110, 1050 + 550 * q]); }
  const d = "M" + P.map((p) => p.join(" ")).join(" L");
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill="#16121a" />
      <Word s={l1} y={440} size={140} t={t} t0={t0 + 0.05} life={99} />
      <Word s={l2} y={600} size={140} t={t} t0={t0 + 0.25} life={99} col="#ffd21f" rot={2} />
      {u > 0.5 && <g transform="translate(540 900) rotate(2)"><rect x={-330} y={-50} width={660} height={100} rx={12} fill="#ffd21f" stroke="#120d10" strokeWidth={6} />
        <text textAnchor="middle" dominantBaseline="middle" y={4} fontFamily="Osw" fontWeight={600} fontSize={52} fill="#120d10">{chip}</text></g>}
      {P.length > 1 && <><path d={d} fill="none" stroke="#120d10" strokeWidth={30} strokeLinecap="round" /><path d={d} fill="none" stroke="#ffd21f" strokeWidth={18} strokeLinecap="round" /></>}
    </g>
  );
};
