// Размытие в движении для быстрых переездов камеры («хлыст», пролёт сквозь окно), как у образца @ricksclips3000:
// направленное размытие вдоль экранного вектора движения кадра. Вектор считает kit/shots.ts (F.blur, в долях кадра);
// при нулевом векторе проход ничего не делает.
import { Uniform, Vector2 } from "three";
import { Effect, EffectAttribute } from "postprocessing";

const frag = /* glsl */ `
uniform vec2 dir;
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  if (dot(dir, dir) < 1e-8) { outputColor = inputColor; return; }
  vec4 acc = vec4(0.0);
  for (int i = 0; i < 17; i++) { float k = float(i) / 16.0 - 0.5; acc += texture2D(inputBuffer, uv + dir * k); }
  outputColor = acc / 17.0;
}`;
export class DirBlurEffect extends Effect {
  constructor() { super("DirBlurEffect", frag, { attributes: EffectAttribute.CONVOLUTION, uniforms: new Map<string, Uniform>([["dir", new Uniform(new Vector2())]]) }); }
  set dir(v: [number, number]) { (this.uniforms.get("dir")!.value as Vector2).set(v[0], v[1]); }
}
