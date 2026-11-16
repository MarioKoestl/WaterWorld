// Tiny PNG reader (8-bit RGB / RGBA, not interlaced) and a pixel comparison, for before / after renders.
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

export function readPng(file) {
  const b = readFileSync(file); let o = 8, w = 0, h = 0, ch = 0; const idat = [];
  while (o < b.length) {
    const len = b.readUInt32BE(o), type = b.toString('latin1', o + 4, o + 8), d = b.subarray(o + 8, o + 8 + len);
    if (type === 'IHDR') { w = d.readUInt32BE(0); h = d.readUInt32BE(4); if (d[8] !== 8 || d[12]) throw new Error('unsupported png'); ch = d[9] === 6 ? 4 : d[9] === 2 ? 3 : 0; if (!ch) throw new Error('unsupported colour type ' + d[9]); }
    else if (type === 'IDAT') idat.push(d);
    o += 12 + len;
  }
  const raw = inflateSync(Buffer.concat(idat)), st = w * ch, px = new Uint8Array(w * h * ch);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (st + 1)], r = y * (st + 1) + 1, p = y * st;
    for (let x = 0; x < st; x++) {
      const a = x >= ch ? px[p + x - ch] : 0, u = y ? px[p + x - st] : 0, c = x >= ch && y ? px[p + x - st - ch] : 0;
      let v = raw[r + x];
      if (f === 1) v += a; else if (f === 2) v += u; else if (f === 3) v += (a + u) >> 1;
      else if (f === 4) { const q = a + u - c, pa = Math.abs(q - a), pb = Math.abs(q - u), pc = Math.abs(q - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? u : c; }
      px[p + x] = v;
    }
  }
  return { w, h, ch, px };
}

// returns { same, differing pixels, largest channel difference, mean absolute difference }
export function diffPng(fa, fb) {
  const a = readPng(fa), b = readPng(fb);
  if (a.w !== b.w || a.h !== b.h) return { same: false, note: `size ${a.w}x${a.h} vs ${b.w}x${b.h}` };
  let n = 0, mx = 0, sum = 0;
  for (let i = 0; i < a.w * a.h; i++) {
    let d = 0;
    for (let c = 0; c < 3; c++) { const e = Math.abs(a.px[i * a.ch + c] - b.px[i * b.ch + c]); if (e > d) d = e; sum += e; }
    if (d) n++; if (d > mx) mx = d;
  }
  return { same: n === 0, size: `${a.w}x${a.h}`, differing: n, share: (n / (a.w * a.h) * 100).toFixed(4) + ' %', max: mx, mean: (sum / (a.w * a.h * 3)).toFixed(5) };
}
