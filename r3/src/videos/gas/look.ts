// Свет и цвет по планам. Двухтоновая модель репозитория (kit/shade.ts): один «ключ» (направленный свет + тени),
// альбедо x mix(shade, lit, свет/тень). Ключ привязан к камере плана (az от оси камеры, el — высота) или к миру (dir —
// направление НА свет): так свет из-за жалюзи ложится полосами через щели. Цвета — линейные множители.
type C3 = [number, number, number];
export type Look = {
  az: number; el: number; dir?: C3;
  lit: C3; shade: C3; lift: C3; lambert: number; sideK: number; term: number; sat: number;
  charTint: C3; charShade: number; charGrad: number; bodyGrad: number; sideTint: C3;
  sky: [string, string, string]; fog: string; fogNear: number; fogFar: number; stars: number; moon: boolean;
  contact: C3; exposure: number;
};
const base = {
  lift: [0.03, 0.03, 0.07] as C3, lambert: 0.3, sideK: 0.85, term: 0.18, sat: 1.12,
  charGrad: 0.07, bodyGrad: 0.2, sideTint: [0.9, 0.9, 0.98] as C3, contact: [0.22, 0.22, 0.34] as C3, exposure: 1,
};
const NIGHT_SKY: [string, string, string] = ["#070b1f", "#1b2556", "#3a3a78"];
export const LOOKS = {
  /** магазин ночью, лампы горят */
  store: { ...base, az: 150, el: 58, lit: [1.42, 1.4, 1.3], shade: [0.52, 0.52, 0.68], charTint: [1, 0.97, 0.94], charShade: 0.9,
    sky: NIGHT_SKY, fog: "#1b2340", fogNear: 25, fogFar: 140, stars: 1, moon: true },
  /** стоянка ночью: тёплый натриевый свет навеса/фонарей, глубокие синие тени */
  nightExt: { ...base, az: 160, el: 52, lit: [1.38, 1.12, 0.84], shade: [0.17, 0.19, 0.4], lift: [0.02, 0.03, 0.09], charTint: [1, 0.9, 0.8], charShade: 0.8,
    sky: NIGHT_SKY, fog: "#1e2647", fogNear: 18, fogFar: 120, stars: 1, moon: true },
  /** рассвет снаружи: контровое розово-оранжевое солнце, фиолетовые тени */
  dawnExt: { ...base, az: 35, el: 9, lit: [1.62, 1.02, 0.72], shade: [0.3, 0.24, 0.48], charTint: [1, 0.86, 0.78], charShade: 0.86,
    sky: ["#27336a", "#c26a7c", "#ffb062"], fog: "#b47c86", fogNear: 30, fogFar: 170, stars: 0.15, moon: false },
  /** внутри на рассвете: свет только сквозь щели жалюзи */
  dawnIn: { ...base, az: 0, el: 30, dir: [0.25, 0.42, 1], lit: [1.75, 1.18, 0.78], shade: [0.22, 0.2, 0.34], charTint: [1, 0.88, 0.8], charShade: 0.6,
    sky: ["#27336a", "#c26a7c", "#ffb062"], fog: "#3a3048", fogNear: 20, fogFar: 120, stars: 0, moon: false },
  /** внутри, лампы тёплые и тусклые (макро болтов) */
  warmIn: { ...base, az: 165, el: 35, lit: [1.5, 1.12, 0.8], shade: [0.26, 0.22, 0.34], charTint: [1, 0.9, 0.8], charShade: 0.8,
    sky: ["#27336a", "#c26a7c", "#ffb062"], fog: "#3a3048", fogNear: 20, fogFar: 120, stars: 0, moon: false },
  /** тревога: красный ключ */
  alarm: { ...base, az: 150, el: 55, lit: [1.75, 0.55, 0.48], shade: [0.3, 0.09, 0.17], lift: [0.05, 0, 0.03], charTint: [1, 0.62, 0.56], charShade: 0.8,
    sky: NIGHT_SKY, fog: "#2a0c18", fogNear: 20, fogFar: 120, stars: 1, moon: true },
  /** свет почти погашен: холодный */
  dim: { ...base, az: 140, el: 50, lit: [0.85, 0.94, 1.25], shade: [0.17, 0.19, 0.34], charTint: [0.86, 0.9, 1.0], charShade: 0.75,
    sky: NIGHT_SKY, fog: "#141a30", fogNear: 20, fogFar: 120, stars: 1, moon: true },
  /** днём внутри, лампы выключены: солнце сквозь щели (направление меняется по ходу дня) */
  dayIn: { ...base, az: 0, el: 34, dir: [-0.5, 0.62, 1], lit: [1.7, 1.34, 0.92], shade: [0.2, 0.21, 0.34], charTint: [1, 0.92, 0.84], charShade: 0.58,
    sky: ["#7f9cc8", "#a9bfd8", "#dcd8c8"], fog: "#2a2c38", fogNear: 20, fogFar: 120, stars: 0, moon: false },
  /** день снаружи */
  dayExt: { ...base, az: 120, el: 40, lit: [1.55, 1.48, 1.32], shade: [0.36, 0.36, 0.52], charTint: [1, 0.96, 0.92], charShade: 0.88,
    sky: ["#4f82cf", "#8fb1dc", "#dcd8c8"], fog: "#b8c4d4", fogNear: 40, fogFar: 230, stars: 0, moon: false },
  /** сумерки: контровое оранжевое солнце */
  duskExt: { ...base, az: -15, el: 7, lit: [1.62, 0.82, 0.5], shade: [0.21, 0.17, 0.4], charTint: [1, 0.8, 0.7], charShade: 0.82,
    sky: ["#171b46", "#7a4478", "#f58a4e"], fog: "#5a3a5e", fogNear: 25, fogFar: 150, stars: 0.4, moon: false },
  /** ночь внутри без ламп: лунный свет сквозь щели */
  moonIn: { ...base, az: 0, el: 30, dir: [0.2, 0.5, 1], lit: [0.78, 0.98, 1.65], shade: [0.1, 0.11, 0.25], charTint: [0.82, 0.9, 1.06], charShade: 0.5,
    sky: NIGHT_SKY, fog: "#0c1024", fogNear: 20, fogFar: 120, stars: 1, moon: true },
  /** подсобка ночью: свет только с улицы через заднюю дверь (+x), холодный, тени глубокие, но не в ноль */
  backNight: { ...base, az: 0, el: 25, dir: [1, 0.38, -0.08], lit: [0.9, 1.04, 1.55], shade: [0.15, 0.16, 0.3], lift: [0.04, 0.04, 0.09], charTint: [0.84, 0.92, 1.08], charShade: 0.6,
    sky: NIGHT_SKY, fog: "#0c1024", fogNear: 20, fogFar: 120, stars: 1, moon: true },
  /** внутри холодильной камеры: голубой холодный свет лампы сверху */
  coolerIn: { ...base, az: 165, el: 68, lit: [0.85, 1.05, 1.35], shade: [0.22, 0.28, 0.44], lift: [0.03, 0.05, 0.1], charTint: [0.86, 0.95, 1.1], charShade: 0.78,
    sky: NIGHT_SKY, fog: "#0c1024", fogNear: 20, fogFar: 120, stars: 0, moon: false },
} satisfies Record<string, Look>;
export type LookName = keyof typeof LOOKS;

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const l3 = (a: C3, b: C3, k: number): C3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
/** смесь двух пресетов (переход снаружи -> внутрь в одном плане, лампы гаснут по одной) */
export const mixLook = (a: Look, b: Look, k: number): Look => k <= 0 ? a : k >= 1 ? b : ({
  ...a, lit: l3(a.lit, b.lit, k), shade: l3(a.shade, b.shade, k), lift: l3(a.lift, b.lift, k), charTint: l3(a.charTint, b.charTint, k),
  charShade: lerp(a.charShade, b.charShade, k), sideTint: l3(a.sideTint, b.sideTint, k), contact: l3(a.contact, b.contact, k),
  fogNear: lerp(a.fogNear, b.fogNear, k), fogFar: lerp(a.fogFar, b.fogFar, k),
});
