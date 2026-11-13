// Общая сборка ролика стиля B: 3D-мир (Inner: мир + пост-обработка репозитория claude-animated-shorts) + SVG-надписи поверх.
// makeShort({ world, frameAt, Overlay }) -> React-компонент для <Composition>. Размер кадра — width/height (шортс 1080x1920,
// длинный 1920x1080). Переключатели для черновиков и замеров — inputProps { post: { dpr, msaa, ink, lens, bloom, grade, shadow } }.
import React, { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { AbsoluteFill, continueRender, delayRender, getInputProps, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { BlendFunction, BloomEffect, ToneMappingEffect, ToneMappingMode } from "postprocessing";
import { InkPass, noInkFallback } from "./ink";
import { LensBlur } from "./lensblur";
import { GradeEffect, GradeParams } from "./grade";
import type { Frame } from "../videos/gas/world";

type PostToggles = { ink: boolean; lens: boolean; bloom: boolean; grade: boolean; msaa: number; dpr: number; shadow: number; shadowType: "basic" | "percentage" | "soft" };
export const toggles = (): PostToggles => ({ ink: true, lens: true, bloom: true, grade: true, msaa: 4, dpr: 1, shadow: 2048, shadowType: "soft", ...((getInputProps() as { post?: Partial<PostToggles> }).post ?? {}) });
/** грейд канала: мягкая S-кривая, насыщенность в середине и светах, лёгкий холод в тенях, виньетка */
export const GRADE_CHANNEL: GradeParams = { ky: [0, 0.085, 0.26, 0.56, 0.82, 0.94, 1], sat: [1.05, 1.16, 1.1], tintS: [0.025, -0.004], tintM: [0, 0], tintH: [-0.012, 0.008], vig: [0.24, 0.42] };

export type WorldLike = { root: THREE.Group; update: (F: Frame, cam: THREE.PerspectiveCamera, scene: THREE.Scene) => void };
type Spec = { world: (shadowMap: number) => WorldLike; frameAt: (f: number) => Frame & { dof: number }; Overlay: React.FC<{ f: number }>; width?: number; height?: number; grade?: GradeParams };
const fwd = new THREE.Vector3(), fpt = new THREE.Vector3();

export const useFont = () => {
  const [ok, setOk] = useState(false);
  const [h] = useState(() => delayRender("font Osw"));
  useEffect(() => {
    const ff = new FontFace("Osw", `url(${staticFile("fonts/Oswald600.ttf")})`, { weight: "600" });
    ff.load().then((x) => { (document.fonts as unknown as { add: (f: FontFace) => void }).add(x); setOk(true); continueRender(h); });
  }, [h]);
  return ok;
};

export const makeShort = (spec: Spec): React.FC => {
  const Inner: React.FC = () => {
    const f = useCurrentFrame();
    const { camera, scene } = useThree();
    const on = useMemo(toggles, []);
    const world = useMemo(() => spec.world(on.shadow), [on]);
    const fx = useMemo(() => ({
      ink: new InkPass(scene, camera as THREE.PerspectiveCamera),
      lens: new LensBlur({ maxCoC: 22, nearScale: 1.2 }),
      bloom: new BloomEffect({ blendFunction: BlendFunction.ADD, intensity: 0.65, luminanceThreshold: 1.0, luminanceSmoothing: 0.25, mipmapBlur: true, levels: 6, radius: 0.65 }),
      tone: new ToneMappingEffect({ mode: ToneMappingMode.NEUTRAL }),
      grade: new GradeEffect(spec.grade ?? GRADE_CHANNEL, 1),
    }), [camera, scene]);
    useEffect(() => () => fx.ink.dispose(), [fx]);
    const post = useMemo(() => (
      <EffectComposer multisampling={on.msaa}>
        {[on.ink && <primitive key="ink" object={fx.ink} dispose={null} />, on.lens && <primitive key="pre" object={fx.lens.pre} dispose={null} />,
          on.lens && <primitive key="lens" object={fx.lens.main} dispose={null} />, on.bloom && <primitive key="bloom" object={fx.bloom} dispose={null} />,
          <primitive key="tone" object={fx.tone} dispose={null} />, on.grade && <primitive key="grade" object={fx.grade} dispose={null} />].filter((x): x is JSX.Element => !!x)}
      </EffectComposer>
    ), [fx, on]);
    const F = spec.frameAt(f), cam = camera as THREE.PerspectiveCamera;
    world.update(F, cam, scene);
    noInkFallback(world.root);
    cam.getWorldDirection(fwd); fpt.set(...F.focus);
    fx.lens.focus = Math.max(0.3, fpt.sub(cam.position).dot(fwd));
    fx.lens.cInf = F.dof;
    return (<><primitive object={world.root} dispose={null} />{post}</>);
  };
  const W = spec.width ?? 1080, H = spec.height ?? 1920;
  const Short: React.FC = () => {
    const f = useCurrentFrame();
    const ok = useFont();
    if (!ok) return null;
    const O = spec.Overlay;
    return (
      <AbsoluteFill style={{ background: "#0c1024" }}>
        <ThreeCanvas width={W} height={H} dpr={toggles().dpr} shadows={toggles().shadowType} gl={{ antialias: false, stencil: false, toneMappingExposure: 1.0 }} camera={{ fov: 50, near: 0.05, far: 900 }}>
          <Inner />
        </ThreeCanvas>
        <O f={f} />
      </AbsoluteFill>
    );
  };
  return Short;
};
