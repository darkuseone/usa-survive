// Быстрые контрольные кадры без HyperFrames: рисует кадры в Chromium и сохраняет PNG + контакт-лист.
//   node tools/shot.cjs <папка film> <папка вывода> 0.5 3 8.2 ...        (PNG — в полном размере кадра)
// Пишет <вывод>/t<время>.png и <вывод>/sheet.jpg (по 4 в ряд, 480 px по ширине для 16:9, 360 — для вертикали). JS-ошибки печатает со стеком.
const puppeteer = require('puppeteer-core'); const path = require('path'); const fs = require('fs'); const { execFileSync } = require('child_process');
(async () => {
  const [film, out, ...ts] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
  const b = await puppeteer.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--allow-file-access-from-files'] });
  const p = await b.newPage(); let errs = 0;
  p.on('pageerror', e => { errs++; console.log('ERR(load)', e.message); });
  await p.goto('file://' + path.resolve(film) + '/index.html'); const [CW, CH] = await p.evaluate(() => [W, H]); await p.setViewport({ width: CW, height: CH }); await p.evaluate(() => document.fonts.ready); await new Promise(r => setTimeout(r, 800));
  const files = [];
  for (const t of ts.map(Number)) {
    const r = await p.evaluate(t => { try { lastFr = -1; const t0 = performance.now(); draw(t); const ms = performance.now() - t0; return { ms, ok: document.getElementById('c').toDataURL('image/png') }; } catch (e) { return { err: e.message + ' @ ' + (e.stack || '').split('\n').slice(1, 4).join(' | ') }; } }, t);
    if (r.err) { errs++; console.log(t, 'ERR', r.err); continue; }
    console.log(`t=${t.toFixed(2)}  ${Math.round(r.ms)} мс/кадр`); const f = path.join(out, `t${t.toFixed(2)}.png`); fs.writeFileSync(f, Buffer.from(r.ok.split(',')[1], 'base64')); files.push(f);
  }
  await b.close();
  if (files.length) {
    const TW = +process.env.SHEET_TW || (CW > CH ? 480 : 360), TH = Math.round(TW * CH / CW / 2) * 2, cols = Math.min(+process.env.SHEET_COLS || 4, files.length), rows = Math.ceil(files.length / cols), inp = [], fl = [];
    files.forEach((f, i) => { inp.push('-i', f); fl.push(`[${i}]scale=${TW}:${TH},drawtext=text='${path.basename(f, '.png').slice(1)}':x=8:y=8:fontsize=28:fontcolor=yellow:box=1:boxcolor=black@0.6[v${i}]`); });
    for (let i = files.length; i < rows * cols; i++) { fl.push(`color=black:s=${TW}x${TH}[v${i}]`); }
    const rowsF = []; for (let r = 0; r < rows; r++) { const ins = Array.from({ length: cols }, (_, c) => `[v${r * cols + c}]`).join(''); rowsF.push(cols > 1 ? `${ins}hstack=${cols}[r${r}]` : `${ins}null[r${r}]`); }
    const fin = rows > 1 ? `${Array.from({ length: rows }, (_, r) => `[r${r}]`).join('')}vstack=${rows}[o]` : `[r0]null[o]`;
    try { execFileSync('ffmpeg', ['-v', 'error', '-y', ...inp, '-filter_complex', [...fl, ...rowsF, fin].join(';'), '-map', '[o]', '-frames:v', '1', path.join(out, 'sheet.jpg')]); } catch (e) { console.log('sheet: ошибка ffmpeg', e.message.slice(0, 200)); }
  }
  console.log(errs ? `ошибок: ${errs}` : `ok: ${files.length} кадров`, '→', out); process.exit(errs ? 1 : 0);
})();
