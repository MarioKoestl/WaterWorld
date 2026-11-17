// Do the shaders of an era compile? Every WGSL module of its page (the engine's text with the era's pieces spliced in,
// minified the way build.mjs does it) is handed to the browser's WGSL compiler. This is the check for what the stand-in
// for WebGPU cannot see: a mistake in a shader piece of an era.
//   node tools/wgsl.mjs [era]         era: default today. Needs a running test Chrome, no build
// Nothing is drawn and no world is made: it asks for a WebGPU device, but takes no time on the graphics card, so it
// can run while the card is busy. It does not build the pipelines: a wrong name of an entry point shows only in the page.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { connect, sleep, checker, outFile, fileUrl, here, ROOT } from './cdp.mjs';

const era = process.argv[2] || 'today', dump = outFile('wgsl-' + era + '.json');
execFileSync(process.execPath, [path.join(here, 'shaders.cjs'), 'dump', path.join(ROOT, 'source'), era, dump], { stdio: 'ignore' });
const mods = JSON.parse(readFileSync(dump, 'utf8'));
const c = await connect(), ok = checker();
await c.nav(fileUrl(outFile('blank.html'))); await sleep(400);
await c.ev(`(async () => { const a = await navigator.gpu.requestAdapter(); window.__dev = await a.requestDevice(); return 0; })()`);
for (const [name, code] of Object.entries(mods)) {
  const msgs = JSON.parse(await c.ev(`(async () => { const d = window.__dev, code = ${JSON.stringify(code)}; d.pushErrorScope('validation');
    const info = await d.createShaderModule({ code }).getCompilationInfo(), e = await d.popErrorScope();
    const out = info.messages.map((m) => m.type + ': ' + m.message + '  …' + code.slice(Math.max(0, m.offset - 70), m.offset) + ' >>> ' + code.slice(m.offset, m.offset + 70));
    if (e && !out.length) out.push('error: ' + e.message);
    return JSON.stringify(out); })()`));
  const errs = msgs.filter((m) => m.startsWith('error'));
  ok(name, !errs.length, msgs.length ? '\n    ' + msgs.join('\n    ') : `${(code.length / 1000).toFixed(1)} kB`);
}
const fails = ok.done();
await c.done();
process.exit(fails ? 1 : 0);
