// The test Chrome: a Chrome without a window and with its own profile, which the other tools drive.
//   node tools/chrome.mjs start     start it (it keeps running after this command returns)
//   node tools/chrome.mjs stop      close it
//   node tools/chrome.mjs status    is it running, which graphics adapter does it give WebGPU, how busy is the card.
//                                   Its exit code is 3 when the card is busy, so `status && <tool>` stops there
// It uses the real graphics card when a page asks for WebGPU. Before any run that renders the 3D scene, look at
// `status`: if the card is busy with something else (a game), the run disturbs that and its timings are worthless.
// Tools that say "no graphics card needed" can run at any time.
// The Chrome that is used: the environment variable CHROME, else the usual place on Windows.
// A second test Chrome for a second run at the same time (each tool drives the one page of its Chrome, so two runs on
// one Chrome get in each other's way): the environment variable PORT, for this command and for the tools. Each port
// has its own profile. Two runs that render at the same time disturb each other's timings: render one at a time.
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { PORT, OUT, outFile, fileUrl, sleep, connect } from './cdp.mjs';
import { card, load, BUSY } from './card.mjs';

const exe = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const up = async () => { try { return (await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json()).Browser; } catch { return null; } };
const cmd = process.argv[2];

if (cmd === 'start') {
  if (await up()) { console.log('already running on port ' + PORT); process.exit(0); }
  mkdirSync(OUT, { recursive: true });
  const blank = outFile('blank.html'); writeFileSync(blank, '<!doctype html><title>test</title>');
  // the window size gives a page of 2560x1440 at device pixel ratio 1
  spawn(exe, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${outFile(PORT === 9334 ? 'profile' : 'profile-' + PORT, 'x').slice(0, -2)}`, '--no-first-run', '--no-default-browser-check', '--mute-audio',
    '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--window-size=2578,1536', fileUrl(blank)], { detached: true, stdio: 'ignore' }).unref();
  for (let i = 0; i < 40 && !(await up()); i++) await sleep(250);
  console.log((await up()) ? `started on port ${PORT}: ${await up()}` : 'did not start: is the path right? ' + exe);
} else if (cmd === 'stop') {
  if (!(await up())) { console.log('not running'); process.exit(0); }
  const c = await connect(); c.send('Browser.close').catch(() => 0); await sleep(500); console.log('closed'); process.exit(0);
} else if (cmd === 'status') {
  const u = await load(), busy = u >= BUSY;
  console.log('graphics card: ' + card() + (u < 0 ? '' : busy ? ': BUSY with something else, run nothing that renders the scene' : ': free'));
  const v = await up();
  if (!v) { console.log('test Chrome: not running'); process.exit(busy ? 3 : 0); }
  const c = await connect();
  await c.nav(fileUrl(outFile('blank.html'))); await sleep(500);
  console.log('test Chrome: ' + v + ', page ' + await c.ev("innerWidth + 'x' + innerHeight + ' at device pixel ratio ' + devicePixelRatio"));
  console.log('WebGPU adapter: ' + await c.ev(`(async () => { if (!navigator.gpu) return 'none (WebGPU not available)'; const a = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' }); if (!a) return 'none'; const i = a.info || {}; return [i.vendor, i.architecture].filter(Boolean).join(' ') + (i.isFallbackAdapter ? ' (software fallback: not usable)' : '') + ', timestamp-query ' + (a.features.has('timestamp-query') ? 'yes' : 'no'); })()`));
  c.close();
  process.exit(busy ? 3 : 0);
} else console.log('usage: node tools/chrome.mjs start | stop | status');
