// Are the shaders of a page still the same shaders? Works on the text of the WGSL modules, without a browser.
//   node tools/shaders.cjs dump <sourceDir> <era> <out.json>
//       writes every module (the W_... strings of engine/shaders.js, with the era's pieces spliced in), minified the
//       way build.mjs does it. A source tree from before docs/briefs/scope.md had three detail levels: its dump is of
//       the highest
//   node tools/shaders.cjs compare <before.json> <after.json> [NAME,NAME,...]
//       A module counts as the same when it has the same top-level declarations (structs, constants, variables,
//       functions) with the same text. Their order does not matter in WGSL. NAME: constants that are new in "after".
//       Each is put back in place of its name first, so `const SKY = vec3f(.3,.78,1.)` with `SKY*1.3` compares equal to
//       `vec3f(.3,.78,1.)*1.3`.
// Typical use: dump before a change to the engine's shaders, dump after, compare. A module that should not have
// changed and did shows its first difference.
const fs = require('fs'), path = require('path'), vm = require('vm');
const minWgsl = (s) => s.replace(/\/\/[^\n]*/g, '').replace(/\s+/g, ' ').replace(/ ?([{}()\[\];,:=+\-*\/<>&|!%@]) ?/g, '$1').trim();
const [cmd, ...a] = process.argv.slice(2);

if (cmd === 'dump') {
  const [src, era, out] = a, eraDir = path.join(src, 'eras', era);
  const files = [...['quality.js', 'math.js', 'tools.js'].map((f) => path.join(src, 'engine', f)), ...fs.readdirSync(eraDir).filter((f) => f.endsWith('.js')).sort().map((f) => path.join(eraDir, f)), path.join(src, 'engine', 'shaders.js')];
  const code = files.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
  const names = [...new Set([...code.matchAll(/^const (W_[A-Z0-9_]+)\b/gm)].map((m) => m[1]))];
  const el = () => ({ children: [], firstChild: {}, setAttribute() {} });
  // (an older tree read its detail level from localStorage and its guesses from the rest: "0" is the highest)
  const box = { localStorage: { abyssal: '0' }, matchMedia: () => ({ matches: false }), navigator: { deviceMemory: 8 }, Math, console, location: { reload() {} }, document: { getElementById: el } };
  vm.createContext(box);
  vm.runInContext(code + `\n;globalThis.__out = { ${names.join(', ')} };`, box);
  const res = Object.fromEntries(Object.entries(box.__out).map(([k, v]) => [k, minWgsl(v)]));
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(res, null, 1));
  console.log(`${names.length} modules -> ${out}`);
} else if (cmd === 'compare') {
  // a dump made before docs/briefs/scope.md has the modules of three detail levels: the highest is compared
  const read = (f) => { const d = JSON.parse(fs.readFileSync(f)); return d.level0 || d; };
  const A = read(a[0]), B = read(a[1]), NEW = (a[2] || '').split(',').filter(Boolean);
  // the top-level declarations of minified WGSL: each ends at a ; or a } at brace depth 0
  const decls = (s) => { const out = []; let d = 0, st = 0; for (let i = 0; i < s.length; i++) { const c = s[i]; if (c === '{') d++; else if (c === '}') { d--; if (!d) { out.push(s.slice(st, i + 1)); st = i + 1; } } else if (c === ';' && !d) { if (i > st) out.push(s.slice(st, i + 1)); st = i + 1; } } if (s.slice(st).trim()) out.push(s.slice(st)); return out.map((x) => x.trim()).filter((x) => x && x !== ';'); };
  let bad = 0, total = 0;
  for (const mod of Object.keys(A)) {
    total++;
    if (!(mod in B)) { console.log(`${mod}: missing after`); bad++; continue; }
    const da = decls(A[mod]), def = {};
    let db = decls(B[mod]).filter((x) => { const m = x.match(/^const (\w+)=(.*);$/); if (m && NEW.includes(m[1])) { def[m[1]] = m[2]; return false; } return true; });
    db = db.map((x) => { for (const [n, e] of Object.entries(def)) x = x.replace(new RegExp('(?<![\\w.])' + n + '(?!\\w)', 'g'), e); return x; });
    const sa = [...da].sort(), sb = [...db].sort();
    if (sa.length === sb.length && sa.every((x, i) => x === sb[i])) continue;
    bad++;
    const onlyA = sa.filter((x) => !sb.includes(x)), onlyB = sb.filter((x) => !sa.includes(x));
    console.log(`${mod}: DIFFERENT (${da.length} declarations before, ${db.length} after)`);
    for (const x of onlyA.slice(0, 3)) console.log('   only before: ' + x.slice(0, 160));
    for (const x of onlyB.slice(0, 3)) console.log('   only after:  ' + x.slice(0, 160));
    if (onlyA.length && onlyB.length) { const p = onlyA[0], q = onlyB.find((x) => x.slice(0, 20) === p.slice(0, 20)) || onlyB[0]; let i = 0; while (i < p.length && p[i] === q[i]) i++; console.log(`   first difference at character ${i}: before "…${p.slice(Math.max(0, i - 40), i + 60)}" | after "…${q.slice(Math.max(0, i - 40), i + 60)}"`); }
  }
  const extra = Object.keys(B).filter((m) => !(m in A));
  console.log(`${total - bad} of ${total} modules are the same shaders` + (extra.length ? `; new modules: ${extra.join(', ')}` : ''));
  process.exit(bad ? 1 : 0);
} else console.log('usage: node tools/shaders.cjs dump <sourceDir> <era> <out.json>\n       node tools/shaders.cjs compare <before.json> <after.json> [NEW,CONSTANTS]');
