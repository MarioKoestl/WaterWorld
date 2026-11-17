// Pictures of the fly-through of an era, in place of a video for the visual critic: frames spread over the whole
// minute, and short runs of consecutive frames (1/60 s apart), which show shimmer, popping and banding.
//   node tools/flight.mjs [era] [name] [--spread 12] [--runs 14,33,50] [--frames 4] [--jpg]
// THIS RENDERS THE 3D SCENE: it needs the graphics card. Look at `node tools/chrome.mjs status` first.
// era: default today. name: the label of this run, default the era. Needs `npm run build:dev` and a running test Chrome.
// --spread: how many frames over the 60 s (0 for none). --runs: the seconds of the flight at which a run of
// consecutive frames starts. --frames: how many frames each run has. --jpg: JPEG, a tenth of the size.
// Output: tools/out/flight/<name>-at<seconds>.png and <name>-run<seconds>-<frame>.png
import { connect, sleep, outFile } from './cdp.mjs';
import { needCard } from './card.mjs';
import { harness } from './harness.mjs';

const args = process.argv.slice(2), opt = (n) => { const i = args.indexOf(n); return i < 0 ? null : args[i + 1]; };
const plain = args.filter((a, i) => !a.startsWith('--') && !(args[i - 1] || '').startsWith('--')), era = plain[0] || 'today', name = plain[1] || era;
const spread = +(opt('--spread') ?? 12), runs = (opt('--runs') ?? '14,33,50').split(',').filter(Boolean).map(Number), frames = +(opt('--frames') || 4), ext = args.includes('--jpg') ? 'jpg' : 'png';
await needCard();
const c = await connect();
await c.desktop();
if (args.includes('--mock')) await c.mock(); // only to try the tool itself: the pictures are empty
await c.open(harness(era)); await sleep(500); await c.loaded();
// into the scene as with a captured mouse, frame loop stopped, full resolution and full draw distance
await c.w("ui(false); body.className = 'g p'; frame = () => {}; 0");
await sleep(2600);
await c.w('pix = PIXMAX; det = 1; dynT = -Infinity; resize(); 0');
console.log('canvas', await c.w("W + 'x' + H"));
// the camera where the flight has it after t seconds, the scene time running along with it (the frame loop is
// stopped, so the zoo is asked here: the hint names what this frame looks at)
const at = async (t, file) => {
  await c.w(`F[FLT] = ${t}; F[TIME] = ${20 + t}; flyAt(); render(); if (typeof zoo === 'function') zoo(); Q.onSubmittedWorkDone().then(() => 0)`);
  await c.w('render(); Q.onSubmittedWorkDone().then(() => 0)');
  await sleep(300);
  await c.shot(outFile('flight', file));
};
for (let i = 0; i < spread; i++) { const t = Math.round((i + 0.5) / spread * 600) / 10; await at(t, `${name}-at${String(t).padStart(4, '0')}.${ext}`); console.log('at', t, 's'); }
for (const t of runs) { for (let k = 0; k < frames; k++) await at(t + k / 60, `${name}-run${t}-${k + 1}.${ext}`); console.log('run of', frames, 'frames at', t, 's'); }
const logs = c.news(); console.log(logs.length ? 'console:\n' + logs.join('\n') : 'console: no messages');
await c.done();
