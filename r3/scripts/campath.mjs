// Траектория камеры и расстановка героев без рендера (для плана сверху scripts/plan.py):
// node scripts/campath.mjs src/videos/water/story.ts > out/<эп>_cam.json   (собирает story через esbuild, шаг 3 кадра)
import { build } from "esbuild";
import path from "node:path";
import fs from "node:fs";
const src = path.resolve(process.argv[2]), tmp = path.resolve("out/.campath.mjs");
fs.mkdirSync("out", { recursive: true });
fs.writeFileSync(tmp + ".in.mjs", `import { STORY } from ${JSON.stringify(src)};
const out = [];
for (let f = 0; f < STORY.TOTAL; f += 3) { const F = STORY.frameAt(f), c = F.cam; out.push({ f, t: +(f / 30).toFixed(2), shot: F.name, pos: c.pos, look: c.look, fov: c.fov, puts: F.puts.map((p) => [p.id, p.x, p.z]) }); }
process.stdout.write(JSON.stringify(out));`);
await build({ entryPoints: [tmp + ".in.mjs"], bundle: true, platform: "node", format: "esm", outfile: tmp, logLevel: "error" });
await import(tmp);
