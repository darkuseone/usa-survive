// Проверка постановки 3D-эпизода (engine/dio.js): на каждом кадре камера не должна входить в предметы и стоять вплотную к фигуркам.
//   python3 tools/mkpage.py <эп> && node tools/clipcheck.cjs build/<эп>/film [шаг, с = 1/30]
// Эпизод должен объявить shot3(t) и SHOT3 (или SHOTS) — для имён планов в отчёте. Выход 1, если есть пересечения.
const puppeteer = require('puppeteer-core'); const path = require('path');
(async () => {
  const b = await puppeteer.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--allow-file-access-from-files', '--enable-webgl', '--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=swiftshader'] });
  const p = await b.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.resolve(process.argv[2]) + '/index.html'); await p.evaluate(() => document.fonts.ready); await new Promise(r => setTimeout(r, 800));
  const step = +process.argv[3] || 1 / 30;
  const res = await p.evaluate((step) => { lastFr = -1; draw(0); if (!DIO) return { err: 'нет 3D-сцены (DIO)' }; DIO.dry = true; const out = {};
    for (let t = 0; t < DUR; t += step) { ctx.save(); try { frame(t); } catch (e) { ctx.restore(); return { err: 't=' + t.toFixed(2) + ': ' + e }; } ctx.restore();
      const nm = typeof shot3 === 'function' ? SHOT3[shot3(t)][1] : '?'; if (nm === 'end') continue;
      for (const h of dClipCheck()) { const k = nm + ' | ' + h; (out[k] = out[k] || []).push(+t.toFixed(2)); } }
    return { out }; }, step);
  if (errs.length) console.log('JS-ошибки:', errs.slice(0, 3).join(' | '));
  if (res.err) { console.log('ошибка:', res.err); await b.close(); process.exit(2); }
  const keys = Object.keys(res.out); if (!keys.length) console.log('ok: камера нигде не входит в предметы');
  else keys.forEach(k => console.log(`${k}  — ${res.out[k].length} кадр., ${res.out[k][0]}…${res.out[k][res.out[k].length - 1]} с`));
  await b.close(); process.exit(keys.length ? 1 : 0);
})();
