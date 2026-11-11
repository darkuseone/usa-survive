// Версия B шортса S3 «Shutter»: та же озвучка, тайминги и сюжет, что у версии A, собранные на движке репозитория
// claude-animated-shorts (three.js + Remotion): мир-диорама с двухтоновым светом, чернильный контур мира (InkPass),
// глубина резкости (LensBlur), bloom только от HDR-источников, тон-маппинг Neutral, грейд. Персонажи — плоские карточки
// (Joe и зомби дорисованы в kit/toon.ts). Надписи и субтитры — SVG поверх кадра. Звук сводится отдельно (ffmpeg).
import React, { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { AbsoluteFill, continueRender, delayRender, getInputProps, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { BlendFunction, BloomEffect, ToneMappingEffect, ToneMappingMode } from "postprocessing";
import { InkPass, noInkFallback } from "../../kit/ink";
import { LensBlur } from "../../kit/lensblur";
import { GradeEffect, GradeParams } from "../../kit/grade";
import { GasWorld } from "./world";
import { frameAt, TOTAL, FPS, SHOT_LIST, shotAt } from "./story";
import { T, WORDS } from "./data";

export const GAS_FRAMES = TOTAL;
/** переключатели для замеров и черновиков (inputProps `{ post: { msaa: 0, dpr: 0.667 } }`); dpr < 1 — 3D в меньшем разрешении, надписи остаются чёткими */
type PostToggles = { ink: boolean; lens: boolean; bloom: boolean; grade: boolean; msaa: number; dpr: number; shadow: number; shadowType: "basic" | "percentage" | "soft" };
const toggles = (): PostToggles => ({ ink: true, lens: true, bloom: true, grade: true, msaa: 4, dpr: 1, shadow: 2048, shadowType: "soft", ...((getInputProps() as { post?: Partial<PostToggles> }).post ?? {}) });

/** грейд канала: мягкая S-кривая, насыщенность в середине и светах, лёгкий холод в тенях, виньетка */
const GRADE_GAS: GradeParams = { ky: [0, 0.085, 0.26, 0.56, 0.82, 0.94, 1], sat: [1.05, 1.16, 1.1], tintS: [0.025, -0.004], tintM: [0, 0], tintH: [-0.012, 0.008], vig: [0.24, 0.42] };
const makeBloom = () => {
  // цепочка размытия — в размере кадра (у автора она всегда 1080x1920: при 3D в 720p это лишние ~4 с на кадр)
  return new BloomEffect({ blendFunction: BlendFunction.ADD, intensity: 0.65, luminanceThreshold: 1.0, luminanceSmoothing: 0.25, mipmapBlur: true, levels: 6, radius: 0.65 });
};
const fwd = new THREE.Vector3(), fpt = new THREE.Vector3();

const Inner: React.FC = () => {
  const f = useCurrentFrame();
  const { camera, scene } = useThree();
  const on = useMemo(toggles, []);
  const world = useMemo(() => new GasWorld(on.shadow), [on]);
  const fx = useMemo(() => ({
    ink: new InkPass(scene, camera as THREE.PerspectiveCamera),
    lens: new LensBlur({ maxCoC: 22, nearScale: 1.2 }),
    bloom: makeBloom(),
    tone: new ToneMappingEffect({ mode: ToneMappingMode.NEUTRAL }),
    grade: new GradeEffect(GRADE_GAS, 1),
  }), [camera, scene]);
  useEffect(() => () => fx.ink.dispose(), [fx]);
  const post = useMemo(() => (
    <EffectComposer multisampling={on.msaa}>
      {[on.ink && <primitive key="ink" object={fx.ink} dispose={null} />, on.lens && <primitive key="pre" object={fx.lens.pre} dispose={null} />,
        on.lens && <primitive key="lens" object={fx.lens.main} dispose={null} />, on.bloom && <primitive key="bloom" object={fx.bloom} dispose={null} />,
        <primitive key="tone" object={fx.tone} dispose={null} />, on.grade && <primitive key="grade" object={fx.grade} dispose={null} />].filter((x): x is JSX.Element => !!x)}
    </EffectComposer>
  ), [fx, on]);
  const F = frameAt(f), cam = camera as THREE.PerspectiveCamera;
  world.update(F, cam, scene);
  noInkFallback(world.root);
  cam.getWorldDirection(fwd); fpt.set(...F.focus);
  fx.lens.focus = Math.max(0.3, fpt.sub(cam.position).dot(fwd));
  fx.lens.cInf = F.dof;
  return (<><primitive object={world.root} dispose={null} />{post}</>);
};

// ------------------------------------------------------------------ надписи поверх кадра (SVG)
const W = 1080, H = 1920;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const pr = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const eo = (x: number) => 1 - (1 - clamp01(x)) ** 3;
const HOT = /^(day|days|zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|forty|thousand|\d.*|never|nobody|silence|knock|knocks|alone|sound|eyes|opposite)$/i;
const Word: React.FC<{ s: string; x?: number; y: number; size: number; t: number; t0: number; life?: number; col?: string; rot?: number; pop?: boolean }> = ({ s, x = W / 2, y, size, t, t0, life = 2.2, col = "#fbf8f0", rot = -2, pop = true }) => {
  const age = t - t0; if (age < 0 || age > life) return null;
  const a = 1 - pr(age, life - 0.25, life), k = pop ? 0.7 + 0.3 * eo(age / 0.12) + 0.08 * Math.sin(Math.min(1, age / 0.25) * Math.PI) : 1;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`} opacity={a}>
      <text textAnchor="middle" dominantBaseline="middle" fontFamily="Osw" fontWeight={600} fontSize={size} stroke="#120d10" strokeWidth={size * 0.16} strokeLinejoin="round" paintOrder="stroke" fill={col}
        style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.45))" }}>{s}</text>
    </g>
  );
};
const RedX: React.FC<{ x: number; y: number; k: number; r?: number }> = ({ x, y, k, r = 150 }) => {
  if (k <= 0) return null; const a = r * eo(k);
  return (<g stroke="#d8241c" strokeWidth={34} strokeLinecap="round"><line x1={x - a} y1={y - a} x2={x + a} y2={y + a} /><line x1={x + a} y1={y - a} x2={x - a} y2={y + a} /></g>);
};
const dayNow = (t: number): [number, string] => {
  if (t < T.k03 - 0.15) return [7, "06:31 AM"]; if (t < T.k07 - 0.1) return [1, "03:07 AM"]; if (t < T.k08) return [7, "04:40 AM"];
  if (t < T.k12 - 0.05) return [7, "06:31 AM"]; if (t < T.k14 - 0.05) return [7, t < T.k13 - 0.05 ? "02:15 PM" : "08:10 PM"]; return [12, "01:12 AM"];
};
const SUBW = WORDS;

const Overlay: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS, si = shotAt(t), name = SHOT_LIST[si][1], u = t - SHOT_LIST[si][0];
  const els: React.ReactNode[] = [];
  // перемотка: VHS
  if (name === "rewind") {
    els.push(<rect key="vt" x={0} y={0} width={W} height={H} fill="rgba(20,30,70,0.28)" />);
    for (let y = 0; y < H; y += 6) els.push(<rect key={"sl" + y} x={0} y={y} width={W} height={2} fill="rgba(0,0,0,0.16)" />);
    for (let i = 0; i < 6; i++) { const r = Math.sin((Math.floor(t * 24) + i) * 91.7) * 0.5 + 0.5; els.push(<rect key={"vb" + i} x={0} y={r * H} width={W} height={10 + 30 * ((r * 7) % 1)} fill="rgba(255,255,255,0.12)" />); }
    els.push(<Word key="rw" s="7 DAYS EARLIER" y={880} size={118} t={t} t0={T.k03 - 0.05} life={1.6} />, <Word key="rwi" s="◀◀" x={150} y={300} size={80} t={t} t0={T.k03 - 0.15} life={1.6} pop={false} rot={0} />);
  }
  if (name === "cctv") {
    els.push(<rect key="ct" x={0} y={0} width={W} height={H} fill="rgba(30,70,40,0.2)" />);
    for (let y = 0; y < H; y += 4) els.push(<rect key={"cl" + y} x={0} y={y} width={W} height={1} fill="rgba(0,0,0,0.13)" />);
    const mm = String(31 + Math.floor((t - T.shoes) * 3)).padStart(2, "0");
    els.push(<text key="cam" x={70} y={380} fontFamily="monospace" fontWeight={700} fontSize={46} fill="#e8f0e0">CAM 01</text>,
      <text key="ts" x={70} y={1500} fontFamily="monospace" fontWeight={700} fontSize={44} fill="#e8f0e0">{`DAY 07  06:${mm} AM`}</text>);
    if (Math.floor(t * 2) % 2) els.push(<circle key="rc" cx={W - 170} cy={366} r={16} fill="#ff3030" />, <text key="rt" x={W - 145} y={380} fontFamily="monospace" fontWeight={700} fontSize={44} fill="#e8f0e0">REC</text>);
  }
  // хук
  if (t < 2.9) { const a = 1 - pr(t, 2.65, 2.9);
    els.push(<g key="hook" opacity={a}><Word s="40 ZOMBIES." y={420} size={128} t={t} t0={0.05} life={3} /><Word s="1 DOOR." y={570} size={150} t={t} t0={0.35} life={3} col="#ffd21f" rot={2} /></g>); }
  // штампы по словам
  els.push(<Word key="307" s="3:07 AM" y={520} size={120} t={t} t0={T.k04 + 0.4} life={2.0} />);
  els.push(<Word key="lock" s="LOCKDOWN!" y={520} size={124} t={t} t0={T.slam + 0.25} life={1.2} col="#ffd21f" />);
  els.push(<Word key="crash" s="CRASH!" y={520} size={140} t={t} t0={T.crash} life={1.0} />);
  els.push(<Word key="40" s="40" y={520} size={230} t={t} t0={T.forty} life={2.2} col="#ffd21f" />);
  els.push(<Word key="lbs" s="6000 LBS" y={520} size={130} t={t} t0={T.six + 0.2} life={1.5} />);
  [T.pops + 0.05, T.another + 0.25].forEach((p, i) => els.push(<Word key={"pop" + i} s="POP!" x={W / 2 - 130 + i * 260} y={1010 + i * 150} size={110} t={t} t0={p} life={0.9} rot={i ? 6 : -6} col="#ffd21f" />));
  if (name === "panic") {
    const ph = t < T.scream - 0.05 ? 0 : t < T.run - 0.05 ? 1 : 2, t0 = [T.panic - 0.1, T.scream - 0.05, T.run - 0.05][ph];
    els.push(<Word key="pw" s={["PANIC", "SCREAM", "RUN"][ph]} y={470} size={130} t={t} t0={t0} life={0.9} />, <RedX key="px" x={W / 2} y={1150} r={120} k={pr(t, t0 + 0.35, t0 + 0.55)} />);
  }
  if (name === "hide") {
    els.push(<Word key="11h" s="11 HOURS" y={1520} size={120} t={t} t0={T.eleven} life={2.2} col="#ffd21f" />);
    const tl = pr(t, T.eleven - 0.3, T.k12 - 0.1);
    if (tl > 0) { const m = 6 * 60 + 31 + Math.floor(tl * tl * (3 - 2 * tl) * 660), h = Math.floor(m / 60) % 24;
      els.push(<Word key="clk" s={`${String(((h + 11) % 12) + 1).padStart(2, "0")}:${String(m % 60).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`} y={1660} size={64} t={t} t0={T.eleven - 0.3} life={9} pop={false} rot={0} col="#ffd21f" />); }
  }
  if (name === "eyes") {
    els.push(<Word key="eyes" s="EYES" x={400} y={330} size={120} t={t} t0={T.eyes - 0.05} life={T.sound - T.eyes - 0.25} />);
    if (t < T.sound - 0.35) els.push(<RedX key="ex" x={400} y={330} k={pr(t, T.eyes + 0.3, T.eyes + 0.5) * 0.6} />);
    els.push(<Word key="snd" s="SOUND" x={400} y={330} size={120} t={t} t0={T.sound - 0.05} life={1.4} col="#ffd21f" />);
  }
  T.kn.forEach((k, i) => { if (t < T.card) els.push(<Word key={"kn" + i} s="KNOCK" x={W / 2 - 140 + i * 140} y={1400 + i * 150} size={110} t={t} t0={k} life={2} col={i === 2 ? "#ffd21f" : "#fbf8f0"} rot={[-5, 4, -2][i]} />); });
  // день в углу
  if (name !== "rewind" && name !== "end" && name !== "cctv") {
    const [n, clk] = dayNow(t);
    els.push(<g key="day" transform="translate(905 215)">
      <rect x={-105} y={-75} width={210} height={170} rx={22} fill="#fbf8f0" stroke="#120d10" strokeWidth={7} />
      <rect x={-105} y={-75} width={210} height={52} rx={18} fill="#d8342c" stroke="#120d10" strokeWidth={7} />
      <text x={0} y={-40} textAnchor="middle" fontFamily="Osw" fontWeight={600} fontSize={38} fill="#fbf8f0">DAY</text>
      <text x={0} y={40} textAnchor="middle" fontFamily="Osw" fontWeight={600} fontSize={92} fill="#120d10">{n}</text>
      <text x={0} y={82} textAnchor="middle" fontFamily="Osw" fontWeight={600} fontSize={22} fill="#120d10">{clk}</text>
    </g>);
  }
  // субтитры: одно слово, белое с обводкой, ключевые — жёлтые
  if (name !== "end") {
    let lo = 0, hi = SUBW.length - 1, k = -1;
    while (lo <= hi) { const m = (lo + hi) >> 1; if (SUBW[m][1] - 0.03 <= t) { k = m; lo = m + 1; } else hi = m - 1; }
    if (k >= 0 && t <= SUBW[k][2]) {
      const w = SUBW[k][0].replace(/[.,!?…;"“”]/g, "").replace(/:(?!\d)/g, "").toUpperCase();
      if (w) { const p = clamp01((t - SUBW[k][1] + 0.03) / 0.09), sc = 0.82 + 0.18 * eo(p), size = Math.min(96, 980 / Math.max(1, w.length * 0.52));
        els.push(<g key="sub" transform={`translate(${W / 2} 1330) scale(${sc})`}>
          <text textAnchor="middle" dominantBaseline="middle" fontFamily="Osw" fontWeight={600} fontSize={size} stroke="#141010" strokeWidth={15} strokeLinejoin="round" paintOrder="stroke"
            fill={HOT.test(w.replace(/'S$/, "")) ? "#ffd21f" : "#fbf8f0"} style={{ filter: "drop-shadow(0 0 10px rgba(0,0,0,0.6))" }}>{w}</text></g>); }
    }
  }
  // финальная карточка
  if (name === "end") {
    const a = pr(u, 0.8, 1.3), P: [number, number][] = [];
    for (let i = 0; i <= 24 * a; i++) { const q = i / 24; P.push([820 + (250 - 820) * q + Math.sin(q * 3.1) * 110, 1050 + 550 * q]); }
    els.push(<rect key="eb" x={0} y={0} width={W} height={H} fill="#16121a" />,
      <Word key="e1" s="WHO'S" y={440} size={140} t={t} t0={T.card + 0.05} life={9} />, <Word key="e2" s="KNOCKING?" y={600} size={140} t={t} t0={T.card + 0.25} life={9} col="#ffd21f" rot={2} />);
    if (u > 0.5) els.push(<g key="e3" transform="translate(540 900) rotate(2)"><rect x={-330} y={-50} width={660} height={100} rx={12} fill="#ffd21f" stroke="#120d10" strokeWidth={6} />
      <text textAnchor="middle" dominantBaseline="middle" y={4} fontFamily="Osw" fontWeight={600} fontSize={52} fill="#120d10">FULL STORY ON MY CHANNEL</text></g>);
    if (P.length > 1) { const d = "M" + P.map((p) => p.join(" ")).join(" L"); els.push(<path key="ea" d={d} fill="none" stroke="#120d10" strokeWidth={30} strokeLinecap="round" />, <path key="eb2" d={d} fill="none" stroke="#ffd21f" strokeWidth={18} strokeLinecap="round" />); }
  }
  return <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>{els}</svg>;
};

const useFont = () => {
  const [ok, setOk] = useState(false);
  const [h] = useState(() => delayRender("font Osw"));
  useEffect(() => {
    const ff = new FontFace("Osw", `url(${staticFile("fonts/Oswald600.ttf")})`, { weight: "600" });
    ff.load().then((x) => { (document.fonts as unknown as { add: (f: FontFace) => void }).add(x); setOk(true); continueRender(h); });
  }, [h]);
  return ok;
};

export const GasShort: React.FC = () => {
  const f = useCurrentFrame();
  const ok = useFont();
  if (!ok) return null;
  return (
    <AbsoluteFill style={{ background: "#0c1024" }}>
      <ThreeCanvas width={W} height={H} dpr={toggles().dpr} shadows={toggles().shadowType} gl={{ antialias: false, stencil: false, toneMappingExposure: 1.0 }} camera={{ fov: 50, near: 0.05, far: 900 }}>
        <Inner />
      </ThreeCanvas>
      <Overlay f={f} />
    </AbsoluteFill>
  );
};
