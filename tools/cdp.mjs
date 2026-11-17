// Chrome DevTools Protocol client for the checks in this folder (Node 22 or newer, no dependencies).
// It speaks WebSocket over a plain socket itself: a full-size screenshot is several megabytes in one message, and
// Node's built-in WebSocket drops the connection on those.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import net from 'node:net';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const here = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.join(here, '..'), OUT = path.join(here, 'out');
export const PORT = +process.env.PORT || 9334;
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const fileUrl = (f) => pathToFileURL(path.resolve(f)).href;
export const outFile = (...p) => { const f = path.join(OUT, ...p); mkdirSync(path.dirname(f), { recursive: true }); return f; };
// a line per check, and the count of failed ones
export const checker = () => { let fails = 0; const ok = (name, cond, extra = '') => { console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra ? '  [' + extra + ']' : '')); if (!cond) fails++; return cond; }; ok.done = () => { console.log(fails ? `\n${fails} FAILED` : '\nall passed'); return fails; }; return ok; };

const VK = { Space: 32, Escape: 27, Enter: 13, ShiftLeft: 16 };
for (const k of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') VK['Key' + k] = k.charCodeAt(0);
for (let i = 0; i < 10; i++) VK['Digit' + i] = 48 + i;
const KEYNAME = { Space: ' ', Escape: 'Escape', Enter: 'Enter', ShiftLeft: 'Shift' };

function wsOpen(url, onText, onClose) {
  const u = new URL(url);
  return new Promise((res, rej) => {
    const sock = net.connect(+u.port, u.hostname);
    let q = [], qlen = 0, open = false, parts = [];
    const peek = (n) => { if (qlen < n) return null; if (q[0].length < n) q = [Buffer.concat(q)]; return q[0]; };
    const frame = (op, data) => {
      const n = data.length, h = n < 126 ? Buffer.from([128 | op, 128 | n]) : n < 65536 ? Buffer.from([128 | op, 254, n >> 8, n & 255]) : (() => { const b = Buffer.alloc(10); b[0] = 128 | op; b[1] = 255; b.writeBigUInt64BE(BigInt(n), 2); return b; })();
      const mask = crypto.randomBytes(4), out = Buffer.from(data);
      for (let i = 0; i < n; i++) out[i] ^= mask[i & 3];
      sock.write(Buffer.concat([h, mask, out]));
    };
    const pump = () => {
      if (!open) {
        if (!peek(4)) return;
        const all = Buffer.concat(q), e = all.indexOf('\r\n\r\n'); if (e < 0) return;
        if (!/^HTTP\/1\.1 101/.test(all.toString('latin1', 0, 20))) return rej(new Error('websocket refused: ' + all.toString('latin1', 0, 80)));
        const rest = all.subarray(e + 4); q = rest.length ? [rest] : []; qlen = rest.length; open = true;
        res({ send: (t) => frame(1, Buffer.from(t)), close: () => { frame(8, Buffer.alloc(0)); sock.end(); } });
      }
      for (;;) {
        let h = peek(2); if (!h) return;
        let len = h[1] & 127, off = 2;
        if (len === 126) { h = peek(4); if (!h) return; len = h.readUInt16BE(2); off = 4; }
        else if (len === 127) { h = peek(10); if (!h) return; len = Number(h.readBigUInt64BE(2)); off = 10; }
        const f = peek(off + len); if (!f) return;
        const op = f[0] & 15, fin = f[0] & 128, data = f.subarray(off, off + len);
        const rest = f.subarray(off + len); qlen -= off + len; if (rest.length) q[0] = rest; else q.shift();
        if (op === 9) frame(10, data);
        else if (op === 8) { sock.end(); return; }
        else if (op < 3) { parts.push(Buffer.from(data)); if (fin) { onText(Buffer.concat(parts).toString('utf8')); parts = []; } }
      }
    };
    sock.on('connect', () => sock.write(`GET ${u.pathname} HTTP/1.1\r\nHost: ${u.host}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: ${crypto.randomBytes(16).toString('base64')}\r\nSec-WebSocket-Version: 13\r\n\r\n`));
    sock.on('data', (d) => { q.push(d); qlen += d.length; pump(); });
    sock.on('error', rej);
    sock.on('close', () => onClose());
  });
}

// Connects to the page of the test Chrome (start it with `node tools/chrome.mjs start`).
export async function connect(port = PORT) {
  let list;
  try { list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); } catch { throw new Error(`No test Chrome on port ${port}. Start one with: node tools/chrome.mjs start`); }
  const page = list.find((t) => t.type === 'page');
  if (!page) throw new Error('the test Chrome has no page');
  let id = 0; const pending = new Map(), logs = [];
  const ws = await wsOpen(page.webSocketDebuggerUrl, (text) => {
    const d = JSON.parse(text);
    if (d.id) { const p = pending.get(d.id); pending.delete(d.id); if (d.error) p.rej(new Error(d.error.message)); else p.res(d.result); return; }
    if (d.method === 'Runtime.consoleAPICalled') logs.push(`[console.${d.params.type}] ` + d.params.args.map((a) => a.value ?? a.description ?? '').join(' '));
    else if (d.method === 'Runtime.exceptionThrown') logs.push('[exception] ' + (d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text));
    else if (d.method === 'Log.entryAdded') logs.push(`[log.${d.params.entry.level}] ${d.params.entry.text}`);
  }, () => { for (const p of pending.values()) p.rej(new Error('connection to Chrome closed')); pending.clear(); });
  const send = (method, params = {}) => new Promise((res, rej) => { pending.set(++id, { res, rej }); ws.send(JSON.stringify({ id, method, params })); });
  await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable');
  const before = logs.length; // what the browser replays from pages that were open before is not this run's
  const ev = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error('in the page: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text) + '\n  code: ' + expression.slice(0, 200));
    return r.result.value;
  };
  const keyArgs = (code) => ({ code, key: KEYNAME[code] || code.replace(/^(Key|Digit)/, '').toLowerCase(), windowsVirtualKeyCode: VK[code], nativeVirtualKeyCode: VK[code] });
  const c = {
    send, ev,
    close: () => ws.close(),
    // the end of a tool: leave an empty page behind, so that no world keeps rendering in the test Chrome
    done: async () => { const b = outFile('blank.html'); writeFileSync(b, '<!doctype html><title>test</title>'); try { await send('Page.navigate', { url: fileUrl(b) }); await sleep(200); } catch {} ws.close(); },
    // console messages of this run. Chrome's note that it ignores powerPreference on Windows is always there
    news: () => logs.slice(before).filter((l) => !l.includes('powerPreference')),
    // the size of the page in CSS pixels at device pixel ratio 1 (the window of the test Chrome gives 2560x1440 without this)
    size: (width, height) => send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false }),
    // a phone: coarse pointer, touch events
    phone: async (width, height) => { await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: true }); await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 }); },
    desktop: async () => { await send('Emulation.setTouchEmulationEnabled', { enabled: false }); await send('Emulation.clearDeviceMetricsOverride'); },
    // code that runs in every page before its own script, until the connection is closed
    before: (source) => send('Page.addScriptToEvaluateOnNewDocument', { source }),
    // the stand-in for WebGPU: the page then needs no graphics card and draws nothing (see mockgpu.js)
    mock: () => c.before(readFileSync(path.join(here, 'mockgpu.js'), 'utf8')),
    // Opens a page of the game as on a first visit: remembered settings cleared (the resolution and the draw distance
    // the page had settled on)
    open: async (file) => {
      await c.before('try { localStorage.clear(); } catch {}');
      await send('Page.navigate', { url: fileUrl(file) });
    },
    nav: (url) => send('Page.navigate', { url }),
    // run code inside the bundle's own scope (test pages made by harness.mjs only)
    w: (code) => ev(`__w(${JSON.stringify(code)})`),
    keyDown: (code) => send('Input.dispatchKeyEvent', { type: 'rawKeyDown', ...keyArgs(code) }),
    keyUp: (code) => send('Input.dispatchKeyEvent', { type: 'keyUp', ...keyArgs(code) }),
    key: async (code, hold = 40) => { await c.keyDown(code); await sleep(hold); await c.keyUp(code); },
    click: async (x, y) => {
      await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
      await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
    },
    touchDown: (pts) => send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pts }),
    // touchDown and touchMove take all fingers that are on the screen: one that is no longer in the list is lifted.
    // touchUp lifts all of them
    touchMove: (pts) => send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: pts }),
    touchUp: () => send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }),
    tap: async (x, y) => { await c.touchDown([{ x, y, id: 1 }]); await sleep(60); await c.touchUp(); },
    // the middle of an element, and its box
    rect: async (sel) => JSON.parse(await ev(`JSON.stringify(document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect())`)),
    mid: async (sel) => { const r = await c.rect(sel); return [r.x + r.width / 2, r.y + r.height / 2]; },
    // a screenshot as PNG (or JPEG when the name ends in .jpg), optionally of one region
    shot: async (file, clip) => {
      const jpg = /\.jpe?g$/.test(file);
      const r = await send('Page.captureScreenshot', { format: jpg ? 'jpeg' : 'png', ...(jpg ? { quality: 92 } : {}), ...(clip ? { clip: { ...clip, scale: 1 } } : {}) });
      mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
      writeFileSync(file, Buffer.from(r.data, 'base64'));
    },
    // wait until the page has left the loading state (body class m = menu) or failed to start
    loaded: async (timeout = 240e3) => {
      const t0 = Date.now();
      for (;;) {
        let cls = 'l'; try { cls = await ev('document.body.className'); } catch {}
        if (cls === 'm' || cls.startsWith('g')) return cls;
        if (cls.includes('e')) throw new Error('the page failed to start: ' + await ev("document.getElementById('s').textContent"));
        if (Date.now() - t0 > timeout) throw new Error('the page is still loading after ' + timeout / 1000 + ' s');
        await sleep(250);
      }
    },
    // wait until the document of a file has loaded (after a click on a link)
    arrived: async (file, timeout = 20e3) => { for (const t0 = Date.now(); Date.now() - t0 < timeout;) { await sleep(100); try { if ((await ev("location.pathname.split('/').pop()")) === file && (await ev('document.readyState')) === 'complete') return true; } catch {} } return false; },
  };
  return c;
}
