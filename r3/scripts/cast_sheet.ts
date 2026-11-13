// Стенд персонажей версии B (без 3D): node scripts/cast_sheet.mjs -> out/gas/cast.png
import { Pen, bodyFront, bodySide, JOE, zombieFit, Expr } from "../src/kit/toon";
const cv = document.createElement("canvas"); cv.width = 2400; cv.height = 1500; document.body.appendChild(cv);
const g = cv.getContext("2d")!; g.fillStyle = "#8a93a8"; g.fillRect(0, 0, 2400, 1500);
const cell = (i: number, j: number, fn: (p: Pen) => void) => { g.setTransform(0.48, 0, 0, 0.48, i * 300, j * 500); fn(new Pen(g)); };
const ex: Expr[] = ["sleepy", "fear", "scream", "resolve", "puff", "neutral", "shock", "stern"];
ex.forEach((e, i) => cell(i, 0, (p) => bodyFront(p, JOE, { mode: "stand", expr: e, seed: 3, armsUp: e === "scream" ? 1 : 0 })));
cell(0, 1, (p) => bodyFront(p, JOE, { mode: "stand", prop: "bottle", expr: "sleepy", seed: 3 }));
cell(1, 1, (p) => bodyFront(p, JOE, { mode: "stand", prop: ["handset", 0], expr: "resolve", seed: 3 }));
cell(2, 1, (p) => bodyFront(p, JOE, { mode: "stand", prop: ["handset", 1], expr: "scream", seed: 3 }));
cell(3, 1, (p) => bodyFront(p, JOE, { mode: "march", phase: 0.3, expr: "scream", seed: 3 }));
for (let v = 0; v < 4; v++) cell(4 + v, 1, (p) => bodyFront(p, zombieFit(v), { mode: "stroll", reach: 1, phase: 0.2, expr: (["zom", "zom2", "zomO", "zom"] as Expr[])[v], seed: 4 + v * 5 }));
for (let v = 0; v < 4; v++) cell(v, 2, (p) => bodyFront(p, zombieFit(v + 3), { mode: "stand", back: true, pound: v / 4, seed: 4 + v * 5 }));
for (let v = 0; v < 2; v++) cell(4 + v, 2, (p) => bodySide(p, zombieFit(v + 1), { mode: "march", phase: v * 0.4, stride: 0.6, expr: "zom", seed: 9 }));
cell(6, 2, (p) => bodyFront(p, zombieFit(2), { mode: "stand", pound: 0.3, expr: "zom2", seed: 11 }));
cell(7, 2, (p) => bodyFront(p, zombieFit(2), { mode: "stand", expr: "zom", headTilt: 14, reach: 0.6, seed: 11 }));
(window as unknown as { done: boolean }).done = true;
