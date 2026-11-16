// Compares two runs of poses.mjs: the six renders pixel by pixel, and the checksums of the world's buffers.
//   node tools/compare.mjs <nameA> <nameB>
// Two runs of the same build differ in a pixel or two by one brightness level. More than that is a real difference.
import { readFileSync, existsSync } from 'node:fs';
import { outFile } from './cdp.mjs';
import { diffPng } from './png.mjs';

const [a, b] = process.argv.slice(2);
if (!b) { console.log('usage: node tools/compare.mjs <nameA> <nameB>'); process.exit(2); }
let bad = 0;
for (let i = 1; existsSync(outFile('poses', `${a}-pose${i}.png`)); i++) {
  const d = diffPng(outFile('poses', `${a}-pose${i}.png`), outFile('poses', `${b}-pose${i}.png`));
  if (!(d.max <= 1 && d.differing <= 200)) bad++;
  console.log('pose', i, d.same ? 'identical' : d.note || `${d.differing} of ${d.size} pixels differ (${d.share}), by at most ${d.max} of 255`);
}
const sa = JSON.parse(readFileSync(outFile('poses', a + '-sums.json'))), sb = JSON.parse(readFileSync(outFile('poses', b + '-sums.json')));
let same = 0; const diff = [], onlyA = [], onlyB = [];
for (const k of Object.keys(sa)) if (!(k in sb)) onlyA.push(k); else if (sa[k] === sb[k]) same++; else diff.push(`${k}: ${sa[k]} -> ${sb[k]}`);
for (const k of Object.keys(sb)) if (!(k in sa)) onlyB.push(k);
console.log(`world: ${same} of ${Object.keys(sa).length} buffers identical`);
if (diff.length) { bad++; console.log('DIFFERENT:\n  ' + diff.join('\n  ')); }
if (onlyA.length) console.log(`only in ${a}: ` + onlyA.join(', '));
if (onlyB.length) console.log(`only in ${b}: ` + onlyB.join(', '));
console.log(bad ? '\nTHE TWO RUNS DIFFER' : '\nthe two runs are the same world and the same pictures');
process.exit(bad ? 1 : 0);
