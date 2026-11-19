// Is the graphics card free? The tools that render the 3D scene ask before they start, and do not start when
// something else is using it (a game): the run would disturb that, and its timings would be worthless.
// Read from nvidia-smi. Where that does not exist nothing is known, and the tools run.
import { execSync } from 'node:child_process';
import { sleep } from './cdp.mjs';

const smi = (q) => { try { return execSync(`nvidia-smi --query-gpu=${q} --format=csv,noheader,nounits`, { encoding: 'utf8' }).trim(); } catch { return null; } };
// name, load in percent, memory in use and in all
export const card = () => { const s = smi('name,utilization.gpu,memory.used,memory.total'); if (!s) return 'unknown (nvidia-smi not found)'; const [n, u, m, t] = s.split(', '); return `${n}, ${u} % busy, ${m} of ${t} MiB in use`; };
// the load in percent: the middle one of five readings over two seconds, or -1 where it cannot be read
export async function load() {
  const r = [];
  for (let i = 0; i < 5; i++) { const s = smi('utilization.gpu'); if (s === null) return -1; r.push(+s); if (i < 4) await sleep(500); }
  return r.sort((a, b) => a - b)[2];
}
export const BUSY = 20; // percent: a desktop at rest is below 10, a game above 30 even in its menu
// for a tool that renders the scene: ends it when the card is busy. Not with --mock (nothing is drawn then)
export async function needCard(args = process.argv) {
  if (args.includes('--mock')) return;
  if (args.includes('--force')) return;
  // a tool of this folder that has just ended leaves the card busy for a moment: look up to three times, 4 s apart
  let u = await load();
  for (let i = 0; i < 2 && u >= BUSY; i++) { await sleep(4000); u = await load(); }
  if (u >= BUSY) { console.log(`Not started: the graphics card is ${u} % busy with something else. Run this when it is free (node tools/chrome.mjs status).`); process.exit(3); }
}
