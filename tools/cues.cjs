// Выгружает метки сцен (CUE, SC, DUR) со страницы эпизода — звук синтезируется по тем же константам, что и картинка.
//   node tools/cues.cjs build/<эп>/film > build/<эп>/cues.json
const puppeteer = require('puppeteer-core'); const path = require('path');
(async () => {
  const b = await puppeteer.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--allow-file-access-from-files'] });
  const p = await b.newPage(); await p.goto('file://' + path.resolve(process.argv[2]) + '/index.html');
  const r = await p.evaluate(() => { const c = {}; for (const k in CUE) if (typeof CUE[k] === 'number') c[k] = CUE[k]; return { DUR, TURN: typeof TURN !== 'undefined' ? TURN : (CUE.lightOn ?? 0), CUE: c, SC: SC.map(s => [s[0], s[1], s[2]]) }; });
  console.log(JSON.stringify(r, null, 1)); await b.close();
})();
