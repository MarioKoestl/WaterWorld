// Helpers for the test tools, evaluated once inside a test page (see harness.mjs), in the scope of the bundle. They know
// no era: what there is to look at they read from the zoo (ZOO, the places in Wd.zoo, the animals in ZA).
(() => {
  const Z = Wd.zoo, PI = Math.PI;
  const tick = (ms = 160) => new Promise((r) => setTimeout(r, ms));
  // count frames, note the longest gap between two, and let a test hold the scene time still (the animals stop)
  window.__n = 0; window.__gap = 0; window.__T = undefined;
  { let last = performance.now(); const draw = render; render = () => { const t = performance.now(); if (t - last > window.__gap) window.__gap = t - last; last = t; window.__n++; if (window.__T !== undefined) F[TIME] = window.__T; draw(); }; }
  const state = () => ({ cls: body.className, menu, cam: [F[CX], F[CY], F[CZ]], yaw: F[YAW], pit: F[PIT], kind: zKind < 0 ? null : ZK[zKind], hint: zTip.className === 'on' ? zTip.firstChild.textContent : null,
    card: zCard < 0 ? null : ZK[zCard], cardShown: zBox.className === 'on', hud, muted, lock: !!document.pointerLockElement, info: info.textContent });
  // distance to the rock at a point (< 0 in water)
  const rock = (x, y, z) => { const sx = F[CX], sy = F[CY], sz = F[CZ]; F[CX] = x; F[CY] = y; F[CZ] = z; sd(0); const d = CS[0]; F[CX] = sx; F[CY] = sy; F[CZ] = sz; return d; };
  // is kind k what the player looks at from where the camera is now? One search, without waiting for a frame
  const looksAt = (k) => { zAim = -1; render(); zoo(); return zKind === k; };
  // camera spots `dist` away from a point, in open water with a clear line to it: all round, a little above and below
  const spots = function* (t, dist) {
    for (const up of [0.2, -0.25, 0.5]) for (let j = 0; j < 16; j++) {
      const a = j / 16 * 2 * PI, x = t[0] + Math.cos(a) * dist, y = Math.min(t[1] + up * dist, TOP - 0.5), z = t[2] + Math.sin(a) * dist;
      let ok = rock(x, y, z) < -0.6; for (let s = 0.2; ok && s < 1; s += 0.2) ok = rock(x + (t[0] - x) * s, y + (t[1] - y) * s, z + (t[2] - z) * s) < -0.1;
      if (ok) yield [x, y, z];
    }
  };
  // Put the camera where the exhibit with this id is what the player looks at. pin: an open card comes along instead
  // of closing after 15 m. Returns false if no such spot was found
  const aim = (id, pin) => {
    const k = ZK.indexOf(id); if (k < 0) return false;
    const from = (t, dist) => { for (const c of spots(t, dist)) { lookAt(...c, ...t); F[VX] = F[VY] = F[VZ] = 0; if (pin) { ZF[0] = c[0]; ZF[1] = c[1]; ZF[2] = c[2]; } if (looksAt(k)) return true; } return false; };
    // an animal: beside where it is now
    for (const o of ZA) if (o.k === k) for (let i = 0; i < o.list.length; i += 8) for (let p = 0; p < o.parts; p++) {
      o.at(o.list, i, p); const t = [ZP[0] + ZP[3] / 2, ZP[1] + ZP[4] / 2, ZP[2] + ZP[5] / 2];
      if (from(t, o.reach * 0.55) || from(t, o.reach * 0.3)) return true;
    }
    // something that stands: the places nearest to the first viewpoint first
    const v = ERA.views[0], near = [];
    for (let i = 0; i < Z.n; i++) if (Z.data[i * ZN + 8] === k) { const o = i * ZN; near.push([Math.hypot(Z.data[o] - v[0], Z.data[o + 1] - v[1], Z.data[o + 2] - v[2]), i]); }
    near.sort((a, b) => a[0] - b[0]);
    for (const [, i] of near.slice(0, 16)) { const o = i * ZN, d = Z.data, t = [d[o] + d[o + 3] * 0.35, d[o + 1] + d[o + 4] * 0.35, d[o + 2] + d[o + 5] * 0.35]; if (from(t, d[o + 6] * 0.7) || from(t, d[o + 6] * 0.4)) return true; }
    return false;
  };
  // turn the view until the exhibit with this id is no longer what the player looks at (true if such a direction exists)
  const away = (id) => { const k = ZK.indexOf(id), y0 = F[YAW], p0 = F[PIT]; for (const [dy, p] of [[PI, p0], [PI / 2, p0], [-PI / 2, p0], [0, -1.5], [0, 1.5], [PI, -0.9], [PI, 0.9]]) { F[YAW] = y0 + dy; F[PIT] = p; if (!looksAt(k)) return true; } F[YAW] = y0; F[PIT] = p0; return false; };
  // move 60 m back and up: true if the exhibit is then no longer what the player looks at
  const leave = (id) => { render(); F[CX] -= 60 * F[FX]; F[CZ] -= 60 * F[FZ]; F[CY] = Math.min(F[CY] + 12, TOP - 1); return !looksAt(ZK.indexOf(id)); };
  // a level direction with 17 m of open water from the camera, as [dx, dz]
  const open = () => { const x = F[CX], y = F[CY], z = F[CZ]; for (let j = 0; j < 48; j++) { const a = j / 48 * 2 * PI, dx = Math.cos(a), dz = Math.sin(a); let free = true; for (let d = 1; d <= 17 && free; d++) free = rock(x + dx * d, y, z + dz * d) < -0.6; if (free) return [dx, dz]; } return null; };
  // the exhibits that are somewhere in this world, and whether each moves
  const kinds = () => { const has = new Set(); for (let i = 0; i < Z.n; i++) has.add(Z.data[i * ZN + 8]); for (const o of ZA) has.add(o.k); return ZK.filter((id, k) => has.has(k)).map((id) => ({ id, name: ZOO[id].name, moves: ZA.some((o) => o.k === ZK.indexOf(id)) })); };
  // what the card shows, in the form of a ZOO entry
  const cardText = () => { const [h, sub, dl, text] = zBox.children, facts = []; for (let i = 0; i < 6; i += 2) if (!dl.children[i].hidden) facts.push([dl.children[i].textContent, dl.children[i + 1].textContent]); return { name: h.textContent, sub: sub.textContent, facts, text: text.textContent }; };
  window.__z = { tick, state, rock, looksAt, aim, away, leave, open, kinds, cardText };
  return 'ready';
})()
