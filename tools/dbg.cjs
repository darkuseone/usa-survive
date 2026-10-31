// Прогон страницы выпуска в Chromium без рендера: ловит JS-ошибки на любых секундах.
//   node tools/dbg.cjs build/<эп>/film 0 3 6.5 12 ...      (без времён — каждые 0.5 с по всей длине)
const puppeteer = require('puppeteer-core'); const path = require('path');
(async () => {
  const b = await puppeteer.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--allow-file-access-from-files'] });
  const p = await b.newPage(); let errs = 0;
  p.on('pageerror', e => { errs++; console.log('ERR', e.message); });
  await p.goto('file://' + path.resolve(process.argv[2]) + '/index.html'); await new Promise(r => setTimeout(r, 1500));
  let ts = process.argv.slice(3).map(Number);
  if (!ts.length) { const D = await p.evaluate(() => DUR); for (let t = 0; t < D; t += 0.5) ts.push(+t.toFixed(2)); }
  for (const t of ts) {
    const r = await p.evaluate(t => { try { lastFr = -1; draw(t); return 'ok'; } catch (e) { return e.message + ' @ ' + (e.stack || '').split('\n').slice(1, 3).join(' | '); } }, t);
    if (r !== 'ok') { errs++; console.log(t, r); }
  }
  console.log(errs ? `ошибок: ${errs}` : `ok: ${ts.length} кадров без ошибок`); await b.close(); process.exit(errs ? 1 : 0);
})();
