// ============================================================================
// zoo: the exhibits the player can read about, the hint that names one and the card that tells about it
// ============================================================================
// An exhibit is anything with an entry in ZOO, the texts of the era (its zoo.js). Where the exhibits are, the era
// registers in its makeWorld: what stays where it is with place() (tools.js), animals with zooMove(). zoo() finds the
// one the player looks at, in every frame. A new kind of exhibit is one entry in ZOO and one registration: nothing
// here knows the ids.

// ---------------------------------------------------------------- places
// A place says where an exhibit is: a line from A to B (the same point twice for a small thing), a reach in metres
// around that line inside which the player counts as close, and the radius of the thing itself. ZN floats each:
// A, the vector from A to B, reach, radius, kind (the position of the id in ZOO). A radius below zero marks a
// backdrop (backdrop() in tools.js): something so large that it is named only while nothing else is looked at.
const ZN = 9, ZK = Object.keys(ZOO);
const zooKind = (id) => { const k = ZK.indexOf(id); if (k < 0) throw new Error('No zoo text for ' + id); return k; };
// Animals move, so their places are worked out in every frame: `at` writes A, the vector to B and the radius of the
// animal at i in `list` (eight floats each, the way its vertex shader gets them) into ZP, for the scene time F[TIME].
// An animal that needs more than one line has `parts` of them. (The time is not handed over: a float passed to a
// function can cost an allocation, and this runs in every frame.)
const ZA = [], ZP = new Float32Array(ZN);
const zooMove = (id, list, at, reach, parts = 1) => ZA.push({ k: zooKind(id), list, at, reach, parts });

// ---------------------------------------------------------------- finding what the player looks at
// Runs in every frame and allocates nothing: floats that outlive a call are in ZF (0 to 2: where the card was opened,
// 3: the best score of the running search, 4: how far ahead along the view the place looked at is), the rest are
// small integers. -1 stands for none.
//   zAim   the place the player looks at (its position in Wd.zoo.data, the animals count on from there)
//   zKind  its kind      zHint  the kind the hint shows      zCard  the kind the open card shows
const ZF = new Float64Array(5);
let zAim = -1, zKind = -1, zHint = -1, zCard = -1, zNew = -1, zNewK = -1;
// A place counts as looked at when the view passes its line no further away than its radius plus ZTOL of the distance
// (a cone of about 6 degrees around it). The one aimed at in the last frame keeps that a little longer (ZHOLD times
// the reach and the cone) and has to be beaten clearly (by ZWIN), so the hint does not flicker between neighbours.
const ZTOL = 0.1, ZHOLD = 1.15, ZWIN = 0.6;
// Scores the places i0 to i1 of P: 0 is the middle of the view, 1 the edge of what counts. The best goes to zNew.
function zooScan(P, i0, i1, id0) {
  const cx = F[CX], cy = F[CY], cz = F[CZ], fx = F[FX], fy = F[FY], fz = F[FZ];
  for (let i = i0; i < i1; i++) {
    const o = i * ZN, dx = P[o + 3], dy = P[o + 4], dz = P[o + 5], dd = dx * dx + dy * dy + dz * dz;
    const wx = P[o] - cx, wy = P[o + 1] - cy, wz = P[o + 2] - cz, e = dx * wx + dy * wy + dz * wz;
    const cur = i + id0 === zAim, hold = cur ? ZHOLD : 1, r = P[o + 6] * hold;
    // the point of the line nearest to the camera has to be within reach
    let s = dd > 0 ? -e / dd : 0; s = s < 0 ? 0 : s > 1 ? 1 : s;
    let qx = wx + dx * s, qy = wy + dy * s, qz = wz + dz * s;
    if (qx * qx + qy * qy + qz * qz > r * r) continue;
    // the point of the line nearest to the view: how far along the view it is and how far off it
    const b = dx * fx + dy * fy + dz * fz, den = dd - b * b;
    if (den > 1e-6) { s = (b * (wx * fx + wy * fy + wz * fz) - e) / den; s = s < 0 ? 0 : s > 1 ? 1 : s; qx = wx + dx * s; qy = wy + dy * s; qz = wz + dz * s; }
    const t = qx * fx + qy * fy + qz * fz; if (t <= 0) continue; // behind the camera
    const off = qx * qx + qy * qy + qz * qz - t * t, rad = P[o + 7], wide = rad < 0;
    let sc = sqrt(off > 0 ? off : 0) / ((wide ? -rad : rad) + t * ZTOL);
    if (sc >= hold) continue;
    // A backdrop is so wide that the view passes it even when the player stands beside it and looks elsewhere: it
    // counts only when the view goes towards it (no further off its line than 1.2 times the way there). And it scores
    // worse than anything else that counts, so it is named only where nothing else is looked at
    if (wide) { if (off > 1.44 * t * t) continue; sc = 0.9 + 0.1 * sc; }
    if (cur) sc *= ZWIN;
    if (sc < ZF[3]) { ZF[3] = sc; ZF[4] = t; zNew = i + id0; zNewK = P[o + 8] | 0; }
  }
}
// Once per frame, after render() has set the view: finds the place looked at, shows its name, closes a card left behind
function zoo() {
  if (menu) return;
  const cx = F[CX], cz = F[CZ], Z = Wd.zoo;
  ZF[3] = 1e9; zNew = zNewK = -1;
  // what stays where it is: the camera's culling cell and the eight around it, as far as their places reach
  let ix = floor((cx - OX) / CELLW) | 0, iz = floor((cz - OZ) / CELLW) | 0;
  ix = ix < 0 ? 0 : ix > CELLS - 1 ? CELLS - 1 : ix; iz = iz < 0 ? 0 : iz > CELLS - 1 ? CELLS - 1 : iz;
  for (let z = iz > 0 ? iz - 1 : 0; z <= iz + 1 && z < CELLS; z++) for (let x = ix > 0 ? ix - 1 : 0; x <= ix + 1 && x < CELLS; x++) {
    const c = x + CELLS * z, ax = abs(OX + (x + 0.5) * CELLW - cx) - CELLW / 2, az = abs(OZ + (z + 0.5) * CELLW - cz) - CELLW / 2;
    const hx = ax > 0 ? ax : 0, hz = az > 0 ? az : 0, e = Z.ext[c] * ZHOLD;
    if (hx * hx + hz * hz < e * e) zooScan(Z.data, Z.start[c], Z.start[c + 1], 0);
  }
  // the animals
  for (let m = 0, id = Z.n; m < ZA.length; m++) {
    const o = ZA[m], a = o.list; ZP[6] = o.reach; ZP[8] = o.k;
    for (let i = 0; i < a.length; i += 8) for (let p = 0; p < o.parts; p++) { o.at(a, i, p); zooScan(ZP, 0, 1, id++); }
  }
  zAim = zNew; zKind = zNewK;
  // the card closes 15 m from where it was opened
  if (zCard >= 0) { const dx = F[CX] - ZF[0], dy = F[CY] - ZF[1], dz = cz - ZF[2]; if (dx * dx + dy * dy + dz * dz > 225) zooClose(); }
  // the hint names what the player looks at, unless its card is open already. The page changes only when that changes
  const h = zKind === zCard ? -1 : zKind;
  if (h !== zHint) { zHint = h; if (h < 0) zTip.className = ''; else { zTip.firstChild.textContent = ZOO[ZK[h]].name; zTip.className = 'on'; } }
}

// ---------------------------------------------------------------- hint and card
// Both are plain HTML over the canvas (template.html), shown while they carry the class `on`. The card is filled from
// ZOO when it opens.
const zTip = document.getElementById('n'), zBox = document.getElementById('z'), [zH, zSub, zRows, zPic, zText] = zBox.children;
// The size picture under the fact rows: the `size` of the entry (its largest measure, in metres) as a bar, and under
// it the diver (ZYOU) to the same scale, or the diver's hand (ZHAND) for anything shorter than ZSMALL. The longer bar
// fills the width, the CSS keeps the shorter one 2 px long at least. An entry without `size` shows no picture
const ZYOU = 1.8, ZHAND = 0.19, ZSMALL = 0.3, [zPicA, zBarA, zPicB, zBarB] = zPic.children;
// a length in metres as the card writes it: metres with one decimal at most from 1 m on, whole centimetres from 10 cm,
// centimetres with one decimal at most below that (2.5 cm), whole millimetres below 1 cm. A unit starts where the
// next smaller one would round up to it (0.996 is 1 m, not 100 cm)
const zooLen = (m) => m >= 0.995 ? round(m * 10) / 10 + ' m' : m >= 0.0995 ? round(m * 100) + ' cm' : m >= 0.0095 ? round(m * 1000) / 10 + ' cm' : max(round(m * 1000), 1) + ' mm';
const zooOpen = (k) => {
  const z = ZOO[ZK[k]], r = zRows.children, s = z.size, y = s < ZSMALL ? ZHAND : ZYOU, l = max(s, y);
  zH.textContent = z.name; zSub.textContent = z.sub; zText.textContent = z.text;
  for (let i = 0; i < 3; i++) { const f = z.facts[i]; r[i * 2].hidden = r[i * 2 + 1].hidden = !f; if (f) { r[i * 2].textContent = f[0]; r[i * 2 + 1].textContent = f[1]; } }
  zRows.hidden = !z.facts.length;
  zPic.hidden = !(s > 0);
  if (s > 0) {
    zPicA.textContent = z.name + ' · ' + zooLen(s); zPicB.textContent = (y === ZHAND ? 'Your hand · ' : 'You · ') + zooLen(y);
    zBarA.style.setProperty('--w', s / l); zBarB.style.setProperty('--w', y / l);
  }
  zCard = k; ZF[0] = F[CX]; ZF[1] = F[CY]; ZF[2] = F[CZ]; zBox.className = 'on';
};
const zooClose = () => { zCard = -1; zBox.className = ''; };
// the menu opens: no card and no hint behind it
const zooOff = () => { zooClose(); zAim = zKind = zHint = -1; zTip.className = ''; };
// Space or a click: opens the card of what the hint names (in place of an open one), or else closes the open one
const zooKey = () => { if (zKind >= 0 && zKind !== zCard) zooOpen(zKind); else if (zCard >= 0) zooClose(); };
// Touch: the hint is the button that opens the card, a tap on the card closes it. Both act when the finger goes down
// (a second finger can do it while the first one swims), so the click that would follow the tap is cancelled
zTip.onpointerdown = zooKey; zBox.onpointerdown = zooClose;
zTip.ontouchstart = zBox.ontouchstart = (e) => e.preventDefault();
