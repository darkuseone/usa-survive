// Рисованные текстуры заправки (Canvas2D, кэш по ключу): асфальт, плитка, стены, жалюзи, товары, вывески.
import * as THREE from "three";
import { ctex, jit } from "../../kit/paint";

type G = CanvasRenderingContext2D;
const INK = "rgba(36,23,38,0.9)";
const FONT = "'Osw', 'Arial Narrow', sans-serif";
const rect = (g: G, x: number, y: number, w: number, h: number, fill: string, ink = 0) => {
  g.fillStyle = fill; g.fillRect(x, y, w, h);
  if (ink) { g.lineWidth = ink; g.strokeStyle = INK; g.strokeRect(x + ink / 2, y + ink / 2, w - ink, h - ink); }
};
const ln = (g: G, pts: number[][], w: number, col = INK) => {
  g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.lineWidth = w; g.strokeStyle = col; g.lineCap = "round"; g.lineJoin = "round"; g.stroke();
};
const speck = (g: G, r: () => number, w: number, h: number, n: number, cols: string[], s0 = 1, s1 = 3) => {
  for (let i = 0; i < n; i++) { g.fillStyle = cols[i % cols.length]; const s = s0 + r() * (s1 - s0); g.fillRect(r() * w, r() * h, s, s); }
};
const text = (g: G, s: string, x: number, y: number, size: number, col: string, o: { stroke?: string; sw?: number; font?: string; maxW?: number } = {}) => {
  g.font = `600 ${size}px ${o.font ?? FONT}`; g.textAlign = "center"; g.textBaseline = "middle";
  if (o.stroke) { g.lineWidth = o.sw ?? size * 0.12; g.strokeStyle = o.stroke; g.lineJoin = "round"; g.strokeText(s, x, y, o.maxW); }
  g.fillStyle = col; g.fillText(s, x, y, o.maxW);
};
const PROD = ["#e8453c", "#f2c230", "#3d7fc4", "#46b86a", "#8a4fc4", "#ff7a1a", "#2fb3b0", "#f4f1ea"];

export const asphalt = () => ctex("g_asph", 1024, 1024, (g, r) => {
  rect(g, 0, 0, 1024, 1024, "#3b404d");
  for (let i = 0; i < 40; i++) { g.fillStyle = r() < 0.5 ? "rgba(70,76,92,0.35)" : "rgba(28,30,38,0.35)"; g.beginPath(); g.ellipse(r() * 1024, r() * 1024, 30 + r() * 110, 20 + r() * 70, r() * 3, 0, 7); g.fill(); }
  speck(g, r, 1024, 1024, 9000, ["#4a505e", "#2d313b", "#565c6b"], 1, 3);
  for (let i = 0; i < 9; i++) { let x = r() * 1024, y = r() * 1024; const P = [[x, y]]; for (let k = 0; k < 7; k++) { x += (r() - 0.5) * 90; y += (r() - 0.3) * 70; P.push([x, y]); } ln(g, P, 2.5, "rgba(18,18,24,0.75)"); }
  for (let i = 0; i < 5; i++) { g.fillStyle = "rgba(12,14,20,0.45)"; g.beginPath(); g.ellipse(r() * 1024, r() * 1024, 20 + r() * 40, 12 + r() * 20, r() * 3, 0, 7); g.fill(); }
});
export const concrete = () => ctex("g_walk", 512, 512, (g, r) => {
  rect(g, 0, 0, 512, 512, "#a7a39a");
  for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) rect(g, x * 256 + 3, y * 256 + 3, 250, 250, jit(r, "#aaa69c", 0.05), 0);
  speck(g, r, 512, 512, 2500, ["#8f8b82", "#bdb9af"], 1, 2.5);
  ln(g, [[0, 256], [512, 256]], 5); ln(g, [[256, 0], [256, 512]], 5);
});
export const floor = () => ctex("g_floor", 512, 512, (g, r) => {
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) rect(g, x * 128, y * 128, 128, 128, jit(r, (x + y) % 2 ? "#cdbfa2" : "#ece4d2", 0.04));
  speck(g, r, 512, 512, 1500, ["rgba(120,100,70,0.25)", "rgba(255,255,255,0.3)"], 1, 3);
  for (let i = 0; i <= 4; i++) { ln(g, [[0, i * 128], [512, i * 128]], 3, "rgba(80,64,50,0.6)"); ln(g, [[i * 128, 0], [i * 128, 512]], 3, "rgba(80,64,50,0.6)"); }
});
export const wallIn = () => ctex("g_wallIn", 512, 512, (g, r) => {
  rect(g, 0, 0, 512, 512, "#e7dcc0"); speck(g, r, 512, 512, 900, ["rgba(140,110,70,0.18)"], 2, 5);
  rect(g, 0, 300, 512, 212, "#2f7f86"); ln(g, [[0, 300], [512, 300]], 6);
  for (let x = 0; x < 512; x += 64) ln(g, [[x, 304], [x, 512]], 2.5, "rgba(20,50,55,0.7)");
  rect(g, 0, 490, 512, 22, "#3a2c24");
});
export const siding = () => ctex("g_siding", 512, 512, (g, r) => {
  for (let y = 0; y < 512; y += 32) { rect(g, 0, y, 512, 32, jit(r, "#c9b48a", 0.03)); ln(g, [[0, y + 30], [512, y + 30]], 3, "rgba(80,60,30,0.6)"); ln(g, [[0, y + 4], [512, y + 4]], 2, "rgba(255,240,210,0.4)"); }
});
export const ceiling = () => ctex("g_ceil", 256, 256, (g, r) => {
  rect(g, 0, 0, 256, 256, "#e9e6dc"); speck(g, r, 256, 256, 1200, ["rgba(120,120,110,0.25)"], 1, 2);
  ln(g, [[0, 2], [256, 2]], 4, "#9a9890"); ln(g, [[2, 0], [2, 256]], 4, "#9a9890");
});
export const shutterT = () => ctex("g_shut", 256, 256, (g) => {
  rect(g, 0, 0, 256, 256, "#9aa1a8");
  for (let y = 0; y < 256; y += 24) { rect(g, 0, y, 256, 6, "#c3c9ce"); rect(g, 0, y + 18, 256, 6, "#737a82"); ln(g, [[0, y + 23], [256, y + 23]], 2.2, "rgba(36,23,38,0.85)"); }
});
/** щели между ламелями: белые линии (для emissiveMap) */
export const slitsT = () => ctex("g_slits", 256, 256, (g) => { rect(g, 0, 0, 256, 256, "#000"); for (let y = 0; y < 256; y += 24) rect(g, 0, y + 22, 256, 3, "#fff"); });
/** то же для тени: непрозрачные ламели, прозрачные щели (MeshDepthMaterial map + alphaTest) */
export const slitsCut = () => ctex("g_slitsCut", 256, 256, (g) => { g.clearRect(0, 0, 256, 256); g.fillStyle = "#fff"; for (let y = 0; y < 256; y += 24) g.fillRect(0, y, 256, 21); });
export const snacks = () => ctex("g_snacks", 1024, 512, (g, r) => {
  rect(g, 0, 0, 1024, 512, "#d8d2c2");
  for (let row = 0; row < 4; row++) {
    const y0 = 20 + row * 122;
    for (let x = 6; x < 1010;) {
      const w = 34 + r() * 30, h = 70 + r() * 30, c = PROD[Math.floor(r() * PROD.length)];
      g.fillStyle = c; g.beginPath(); g.moveTo(x, y0 + 100); g.lineTo(x + 3, y0 + 100 - h); g.lineTo(x + w - 3, y0 + 100 - h); g.lineTo(x + w, y0 + 100); g.closePath(); g.fill();
      g.lineWidth = 2.5; g.strokeStyle = INK; g.stroke();
      rect(g, x + w * 0.2, y0 + 100 - h * 0.65, w * 0.6, h * 0.28, "rgba(255,255,255,0.75)");
      x += w + 4;
    }
    rect(g, 0, y0 + 100, 1024, 14, "#8a8274", 2.5); rect(g, 0, y0 + 103, 1024, 4, "#f2c230");
  }
});
export const cooler = () => ctex("g_cooler", 256, 512, (g, r) => {
  rect(g, 0, 0, 256, 512, "#9fd6e6");
  for (let row = 0; row < 4; row++) {
    const y0 = 30 + row * 118;
    rect(g, 0, y0 + 96, 256, 7, "#e9edf2");
    for (let q = 0; q < 6; q++) {
      const x = 16 + q * 38, c = ["#e8453c", "#46b86a", "#f2c230", "#3d7fc4", "#ff7a1a", "#8a4fc4"][(q + row * 2) % 6];
      g.fillStyle = c; g.beginPath(); g.moveTo(x, y0 + 96); g.lineTo(x, y0 + 34); g.lineTo(x + 8, y0 + 14); g.lineTo(x + 20, y0 + 14); g.lineTo(x + 28, y0 + 34); g.lineTo(x + 28, y0 + 96); g.closePath(); g.fill(); g.lineWidth = 2; g.strokeStyle = INK; g.stroke();
      rect(g, x + 3, y0 + 52, 22, 18, "rgba(255,255,255,0.8)");
    }
  }
  g.fillStyle = "rgba(255,255,255,0.25)"; g.beginPath(); g.moveTo(30, 0); g.lineTo(90, 0); g.lineTo(20, 512); g.lineTo(-40, 512); g.fill();
  g.lineWidth = 16; g.strokeStyle = "#59606a"; g.strokeRect(8, 8, 240, 496); g.lineWidth = 3; g.strokeStyle = INK; g.strokeRect(1, 1, 254, 510); g.strokeRect(16, 16, 224, 480);
  rect(g, 214, 200, 10, 110, "#c9ccd1", 2);
});
export const cigs = () => ctex("g_cigs", 512, 256, (g) => {
  rect(g, 0, 0, 512, 256, "#33363c");
  for (let rr = 0; rr < 4; rr++) for (let q = 0; q < 10; q++) {
    const c = ["#e8453c", "#f4f1ea", "#2f8f96", "#f2c230", "#3d7fc4"][(q * 3 + rr) % 5];
    rect(g, 10 + q * 50, 10 + rr * 61, 42, 50, c, 2.5); rect(g, 14 + q * 50, 26 + rr * 61, 34, 10, "rgba(0,0,0,0.25)");
  }
});
export const wood = () => ctex("g_wood", 512, 256, (g, r) => {
  rect(g, 0, 0, 512, 256, "#8a5d3b");
  for (let i = 0; i < 6; i++) { const y = i * 43; rect(g, 0, y, 512, 43, jit(r, "#8a5d3b", 0.06)); ln(g, [[0, y], [512, y]], 3); }
  for (let i = 0; i < 40; i++) { const y = r() * 256, x = r() * 512; ln(g, [[x, y], [x + 40 + r() * 80, y + (r() - 0.5) * 4]], 1.5, "rgba(60,36,20,0.5)"); }
});
/** вывеска: фон, текст, чернильная рамка; glowText — светлый текст для неона */
export const sign = (s: string, bg: string, fg: string, w = 512, h = 128, size = 80, o: { border?: boolean; stroke?: string } = {}) =>
  ctex(`g_sign_${s}_${bg}_${fg}_${w}x${h}_${size}`, w, h, (g) => {
    if (bg === "none") g.clearRect(0, 0, w, h); else rect(g, 0, 0, w, h, bg);
    text(g, s, w / 2, h / 2 + size * 0.04, size, fg, { stroke: o.stroke, maxW: w - 20 });
    if (o.border !== false && bg !== "none") { g.lineWidth = 8; g.strokeStyle = INK; g.strokeRect(4, 4, w - 8, h - 8); }
  });
export const pumpFace = (n: string) => ctex("g_pump" + n, 256, 448, (g) => {
  rect(g, 0, 0, 256, 448, "#d9342c"); rect(g, 0, 0, 256, 70, "#f3ecd8"); text(g, "UNLEADED", 128, 36, 34, "#d9342c");
  rect(g, 28, 96, 200, 120, "#10161e", 5); text(g, "$ 3.49", 128, 156, 54, "#7dffb0");
  text(g, n, 128, 300, 150, "#f3ecd8", { stroke: "#241726", sw: 10 }); rect(g, 40, 390, 176, 30, "#262a33", 4);
  g.lineWidth = 8; g.strokeStyle = INK; g.strokeRect(4, 4, 248, 440);
});
export const hazard = () => ctex("g_haz", 128, 128, (g) => {
  rect(g, 0, 0, 128, 128, "#f2c230"); g.fillStyle = "#1c1512";
  for (let i = -4; i < 8; i++) { g.beginPath(); g.moveTo(i * 32, 0); g.lineTo(i * 32 + 16, 0); g.lineTo(i * 32 + 144, 128); g.lineTo(i * 32 + 128, 128); g.fill(); }
  g.lineWidth = 8; g.strokeStyle = INK; g.strokeRect(4, 4, 120, 120);
});
export const priceSign = () => ctex("g_price", 320, 400, (g) => {
  rect(g, 0, 0, 320, 400, "#f3ecd8"); rect(g, 0, 0, 320, 90, "#d9342c"); text(g, "HWY 40", 160, 48, 62, "#fbfaf6");
  for (let i = 0; i < 2; i++) { rect(g, 26, 112 + i * 140, 268, 120, "#10161e", 5); text(g, i ? "3.89" : "3.49", 190, 172 + i * 140, 84, "#ff5a3a"); text(g, i ? "DSL" : "REG", 70, 172 + i * 140, 34, "#f3ecd8"); }
  g.lineWidth = 10; g.strokeStyle = INK; g.strokeRect(5, 5, 310, 390);
});
export const poster = (title: string, big: string, col: string) => ctex("g_post" + title, 256, 320, (g, r) => {
  rect(g, 0, 0, 256, 320, "#f3ecd8"); speck(g, r, 256, 320, 300, ["rgba(140,110,70,0.25)"], 1, 3);
  rect(g, 0, 0, 256, 76, col); text(g, title, 128, 40, 44, "#fbfaf6"); text(g, big, 128, 190, 110, col, { stroke: "#241726", sw: 6 });
  g.lineWidth = 8; g.strokeStyle = INK; g.strokeRect(4, 4, 248, 312);
});
export const clockT = (s: string) => ctex("g_clock" + s, 256, 110, (g) => { rect(g, 0, 0, 256, 110, "#140c0c"); text(g, s, 128, 58, 84, "#ff4a3a"); });
/** тёмный силуэт на белом (multiply): кто-то стоит за жалюзи */
export const figT = () => ctex("g_fig", 256, 512, (g) => {
  rect(g, 0, 0, 256, 512, "#fff"); g.filter = "blur(9px)"; g.fillStyle = "#151020";
  g.beginPath(); g.ellipse(128, 104, 54, 60, 0, 0, 7); g.fill();
  g.beginPath(); g.moveTo(30, 512); g.lineTo(46, 214); g.quadraticCurveTo(128, 150, 210, 214); g.lineTo(226, 512); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(52, 230); g.lineTo(-10, 120); g.lineTo(20, 104); g.lineTo(84, 214); g.fill(); g.filter = "none";
});
/** луч света: вертикальный градиент с полосами (аддитивно) */
export const shaftT = () => ctex("g_shaft", 256, 512, (g) => {
  const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "rgba(255,255,255,0.9)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; for (let x = 0; x < 256; x += 32) g.fillRect(x, 0, 18, 512);
});
export const glowT = () => ctex("g_glow", 128, 128, (g) => {
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.3, "rgba(255,255,255,0.45)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
});
export const crackT = () => ctex("g_crack", 256, 256, (g, r) => {
  g.clearRect(0, 0, 256, 256);
  for (let k = 0; k < 5; k++) { let x = 128, y = 128; const pts = [[x, y]], a0 = k * 1.26 + r(); for (let i = 0; i < 6; i++) { x += Math.cos(a0 + (r() - 0.5)) * 22; y += Math.sin(a0 + (r() - 0.5)) * 22; pts.push([x, y]); } ln(g, pts, 5 - k * 0.5, "#1c1512"); }
});
export const rep = (t: THREE.Texture, x: number, y: number) => { const c = t.clone(); c.wrapS = c.wrapT = THREE.RepeatWrapping; c.repeat.set(x, y); c.needsUpdate = true; return c; };
/** пустые холодильники: голые полки, пара сиротливых бутылок, ценники */
export const coolerEmpty = () => ctex("g_coolerEmpty", 256, 512, (g, r) => {
  rect(g, 0, 0, 256, 512, "#9fd6e6");
  for (let row = 0; row < 4; row++) {
    const y0 = 30 + row * 118; rect(g, 0, y0 + 96, 256, 7, "#e9edf2");
    for (let q = 0; q < 5; q++) rect(g, 20 + q * 46, y0 + 90, 26, 8, "#f2c230", 2);
    if (row === 2) { g.fillStyle = "#e8453c"; g.fillRect(170, y0 + 40, 26, 56); g.lineWidth = 2; g.strokeStyle = INK; g.strokeRect(170, y0 + 40, 26, 56); }
  }
  g.fillStyle = "rgba(255,255,255,0.25)"; g.beginPath(); g.moveTo(30, 0); g.lineTo(90, 0); g.lineTo(20, 512); g.lineTo(-40, 512); g.fill();
  g.lineWidth = 16; g.strokeStyle = "#59606a"; g.strokeRect(8, 8, 240, 496); g.lineWidth = 3; g.strokeStyle = INK; g.strokeRect(1, 1, 254, 510); g.strokeRect(16, 16, 224, 480);
  rect(g, 214, 200, 10, 110, "#c9ccd1", 2);
});
/** нержавейка холодильной камеры: панели со швами, иней внизу */
export const steelT = () => ctex("g_steel", 256, 256, (g, r) => {
  rect(g, 0, 0, 256, 256, "#c9d2da"); speck(g, r, 256, 256, 900, ["rgba(255,255,255,0.35)", "rgba(80,90,110,0.18)"], 1, 3);
  for (let x = 0; x < 256; x += 64) ln(g, [[x + 1, 0], [x + 1, 256]], 3, "rgba(60,70,90,0.6)");
  for (let i = 0; i < 40; i++) { g.fillStyle = "rgba(255,255,255,0.5)"; g.fillRect(r() * 256, 220 + r() * 36, 3 + r() * 8, 2); }
});
/** наклейка бойлера: «40 GAL» */
export const heaterLabel = () => ctex("g_heatLbl", 160, 220, (g) => {
  rect(g, 0, 0, 160, 220, "#f4f1ea"); rect(g, 0, 0, 160, 50, "#2f6a6e"); text(g, "WATER HEATER", 80, 26, 22, "#fbfaf6");
  text(g, "40", 80, 110, 90, "#c8342c"); text(g, "GALLONS", 80, 170, 30, "#1c1512"); g.lineWidth = 6; g.strokeStyle = INK; g.strokeRect(3, 3, 154, 214);
});
