// ============================================================================
// ordovician: the walker, the trilobite Isotelus
// ============================================================================
// Isotelus maximus, in the round: a broad, smooth, flat oval in three parts, head and tail shields half-circles of
// about the same size, eight thoracic segments between them, thin genal spines, raised eye crescents, and under it
// legs, antennae and the forked hypostome. Figures and quotes: docs/research/ordovician/isotelus.md (Wikipedia,
// "Isotelus"; the GeoFacts 6 PDF could not be read, what it was to give is from Wikipedia instead). The living
// model for surface and motion is the horseshoe crab: a smooth domed shield gliding low and ploughing through mud
// (ordovician-life.md, "The next animal after stage G"). Colours and the walk are free: no fossil shows them.
// The walk machinery is that of the Cambrian walkers (cambrian/walkers.js, the accepted pattern): each walker goes
// round a small polygon of its own in the plane of the drawn ground under it, measured at load time, and its feet
// step with the way walked, so no foot slides. Many lie half dug in ("often buried itself in sediment, with only
// its eyes and portions of the dorsal exoskeleton exposed"), each with the mud it heaped up round itself.
// The mesh is modelled around the middle, nose at +z, y up, standing on the ground at y = 0, one unit long without
// the antennae: the instance says how large it is.

// ---------------------------------------------------------------- the walker in figures
// In lengths of the body; the fields mean what they do in cambrian/walkers.js (HW, TW there).
// l0..l1: 0.18 to 0.40 m (the card: up to about 40 cm). Slow: it ploughs, 2 to 6 cm/s at 0.4 m.
const IW = { l0: 0.18, l1: 0.4, lp: 0.65, c0: 0.25, c1: 0.8, z0: 0.26, dz: 0.050769, nl: 14, lam: 0.07, be: 0.65, lf: 0.022, wave: 0.11, rp: 0.5, v0: 0.08, v1: 0.06, hc: 0.1, hh: 0.12, rb: 0.55, ra: 0.95, rf: 0.45, kd: 0.9, line: 0.4, rad: 0.28, hb: 0.045, sink: 0.075, dig: 0.3, hd: 0.07 };
// The shape, in lengths. Width 0.69 of the length (Huffman Dam specimen, 37 by 25.5 cm); head, thorax and tail
// 35 : 30 : 35 (estimate after "semi-circular cephalon and pygidium" of about the same size); height about 0.10 of
// the length (I. rex holotype, carried over as estimate); eight thoracic segments of equal size (source); the
// pygidium "subtriangular in outline" (a touch more tapered than the head). IT_RT: the rounded edge's thickness
const IT_C = 0.15, IT_P = -0.15, IT_SEG = (IT_C - IT_P) / 8, IT_HA = 0.345, IT_HL = 0.35, IT_TA = 0.33, IT_TL = 0.35, IT_RT = 0.008, IT_YF = IW.hb + IT_RT;
const isoW = (z, part) => part === 0 ? IT_HA * sqrt(max(1 - ((z - IT_C) / IT_HL) ** 2, 0)) : part === 1 ? 0.33 + 0.015 * (z - IT_P) / (IT_C - IT_P) : IT_TA * sqrt(max(1 - ((IT_P - z) / IT_TL) ** 2, 0)) * (1 - 0.12 * (IT_P - z) / IT_TL);
// the axis: broad and faint. The glabella "was sloping and poorly defined", the axial furrow "shallow and smooth",
// the lobes of the pygidium "poorly defined": the axis is a low arch that fades on head and tail
const isoA = (z, part) => part === 0 ? 0.12 * sqrt(max(1 - (max(z - 0.33, 0) / 0.14) ** 2, 0)) : part === 1 ? 0.1 + 0.02 * (z - IT_P) / (IT_C - IT_P) : (0.1 - 0.05 * min((IT_P - z) / 0.28, 1)) * sqrt(max(1 - (max((IT_P - z) / 0.28 - 0.8, 0) / 0.2) ** 2, 0));
const isoG = (v) => exp(-v * v);
const isoIn = (x, zr, a, b) => { const q = hypot(x / a, zr / b); return q < 1e-4 ? min(a, b) : max(1 - q, 0) * hypot(x, zr) / q; };
// the low dome of the shield over the distance d inside the outline, with the flattened border: a concave band
// with a shallow furrow inside it (sourced for the pygidium, carried round the head as estimate)
const isoDome = (d) => 0.075 * pow(sin(PI / 2 * min(d / 0.28, 1)), 1.15) - 0.006 * isoG((d - 0.05) / 0.022) - 0.016 * isoG(d / 0.014);
// the upper side of the head shield at x, z: the dome, the faint glabella between two shallow furrows, and a low
// swell under each eye
const isoHead = (x, z) => {
  const ax = abs(x), d = isoIn(ax, z - IT_C, IT_HA, IT_HL), A = isoA(z, 0);
  let y = IT_YF + isoDome(d);
  y += 0.005 * isoG((ax - 0.132) / 0.05) * isoG((z - 0.3) / 0.06);
  if (ax < A) y += 0.02 * (A / 0.12) * pow(1 - (ax / A) ** 2, 0.7) * (1 - 0.3 * max(z - 0.33, 0) / 0.14);
  if (A > 0.02) y -= 0.004 * isoG((ax - A - 0.006) / 0.014);
  return y;
};
// the thorax at x, z; v: 0 at the front of the segment there, 1 at its rear. Each segment is a tile with a low
// rib, "smooth dorsally"; the sides one gentle arch to the edge (dT: a pseudo-distance so the dome profile of the
// head carries over)
const isoThorax = (x, z, v) => {
  const ax = abs(x), W = isoW(z, 1), A = isoA(z, 1), dT = (1 - min(ax / W, 1)) * 0.3;
  let y = IT_YF + isoDome(dT) + 0.003 * pow(sin(PI * clamp(v, 0, 1)), 0.8) * (1 - 0.4 * min(ax / W, 1));
  if (ax < A) y += 0.02 * pow(1 - (ax / A) ** 2, 0.7);
  y -= 0.004 * isoG((ax - A - 0.006) / 0.014);
  return y;
};
// the tail piece: the dome with the border band, the faint ringed axis fading to the rear
const isoTail = (x, z) => {
  const ax = abs(x), tz = (IT_P - z) / 0.28, d = isoIn(ax, IT_P - z, IT_TA, IT_TL), A = isoA(z, 2);
  let y = IT_YF + isoDome(d);
  if (ax < A) y += 0.018 * (1 - 0.5 * min(tz, 1)) * (0.92 + 0.08 * cos(TAU * 4 * tz)) * pow(1 - (ax / A) ** 2, 0.7);
  if (A > 0.015) y -= 0.0035 * isoG((ax - A - 0.005) / 0.012);
  return y;
};
// the legs: "at least 26 pairs of identical legs"; 15 are modelled along the whole underside, the rest could not
// be told apart under the flat shield (estimate, see the research note). IXF: where a foot stands, inside the rim
// qa I1: seen from above no part of a leg may ever leave the shield's outline, with a margin of 0.03 through
// the whole step; the last pair stands no farther back than z = -0.40, and under the tail the legs get shorter
// and stand closer to the middle pair by pair. A foot wanders up to 0.023 along the body in a step (half of be
// times lam) and the roots shift by fore: so a foot stands inside the narrowest width over that whole range,
// 0.042 in from the outline (the 0.03 margin, the foot's own radius and the sideways jitter of 9 %)
const IT_LK = [0.7, 0.85, 0.95, 1, 1, 1, 1, 1, 1, 0.95, 0.85, 0.75, 0.62, 0.5];
const isoWAt = (z) => isoW(clamp(z, -0.4999, 0.4999), z > IT_C ? 0 : z > IT_P ? 1 : 2);
const IXF = Array.from({ length: IW.nl }, (_, k) => {
  const zk = IW.z0 - k * IW.dz;
  let Wmin = Infinity;
  for (let d = -0.048; d <= 0.032; d += 0.004) Wmin = min(Wmin, isoWAt(zk + d));
  return max(min(isoWAt(zk) * 0.62, (Wmin - 0.042) / 1.09), 0.06);
});
const isoNum = (v) => { const s = String(+v.toFixed(6)); return /[.e]/.test(s) ? s : s + '.'; };

// ---------------------------------------------------------------- the mesh
// aux: 0 on the upper side of the shield, -.2 on the edge and the genal spines, -.4 on body, hypostome and prongs,
// -.8 on the eye lids, -1 on the lenses, .008 to .5 down a leg, .6 to 1 along an antenna.
// lo: the simpler build for a far mesh: the three shields only, coarser, nothing under them
function meshIso(lo) {
  const m = new Mesh(), hb = IW.hb, S = IT_SEG;
  const join = (rows, flip) => sheet(m, rows, flip);
  const row = (z, part, h, AX, T, dy = 0, zAt = z) => {
    const W = isoW(zAt, part), A = clamp(isoA(zAt, part), 0.3 * W, 0.8 * W), xs = [];
    for (let c = T.length - 1; c >= 0; c--) xs.push(-(A + (W - A) * T[c]));
    for (const c of AX) xs.push(A * c);
    for (const t of T) xs.push(A + (W - A) * t);
    return xs.map((x) => m.v(x, h(x, zAt) + dy, z, 0));
  };
  // ---- the head shield: a lip down its rear edge, then row by row to the front
  const HAX = lo ? [-1, -0.5, 0, 0.5, 1] : [-1, -0.9, -0.7, -0.45, -0.2, 0, 0.2, 0.45, 0.7, 0.9, 1];
  const HT = lo ? [0.25, 0.55, 0.8, 1] : [0.08, 0.18, 0.3, 0.44, 0.58, 0.71, 0.82, 0.9, 0.96, 1];
  const HZ = lo ? [0.16, 0.24, 0.33, 0.41, 0.46, 0.49, 0.499] : [0.152, 0.16, 0.17, 0.185, 0.2, 0.22, 0.245, 0.27, 0.295, 0.32, 0.345, 0.37, 0.395, 0.415, 0.435, 0.452, 0.466, 0.478, 0.487, 0.494, 0.499];
  join([row(IT_C - 0.002, 0, isoHead, HAX, HT, -0.008, IT_C)].concat(HZ.map((z) => row(z, 0, isoHead, HAX, HT))));
  // ---- the thorax: eight tiles, each tucked under the one in front, its rear edge a lip
  const TRS = lo ? [[0.06, 0.06, 0], [0.5, 0.5, 0], [0.94, 0.94, 0]] : [[0.012, 0, -0.003], [0.06, 0.06, -0.001], [0.22, 0.22, 0], [0.45, 0.45, 0], [0.7, 0.7, 0], [0.92, 0.92, 0], [1.001, 1, 0.001], [0.998, 1, -0.004]];
  for (let k = 0; k < 8; k++) {
    const zf = IT_C - k * S;
    join(TRS.map(([q, v, dy]) => {
      // qa I6: the end of each segment is rounded and points a little backward (the tile's front rows pulled
      // inboard, its rear at full width), and its edge lies level with the rims of head and tail: a shallow
      // under-roll, no square tooth hanging under the rim line
      const z = zf - q * S, zAt = clamp(z, IT_P, IT_C), W = isoW(zAt, 1) - 0.013 * pow(1 - clamp(v, 0, 1), 1.6), A = isoA(zAt, 1), h = (x) => isoThorax(x, zAt, v) + dy, yt = h(W);
      const side = (lo ? [0.3, 0.65, 1] : [0.14, 0.3, 0.48, 0.66, 0.82, 0.93, 1]).map((s) => { const x = A + (W - A) * s; return [x, h(x)]; });
      if (!lo) side.push([W + 0.003, yt - 0.003], [W - 0.004, yt - 0.007]);
      const axis = (lo ? [-1, 0, 1] : [-1, -0.85, -0.55, -0.2, 0.2, 0.55, 0.85, 1]).map((c) => [A * c, h(A * c)]);
      return side.map(([x, y]) => [-x, y]).reverse().concat(axis, side).map(([x, y]) => m.v(x, y, z, 0));
    }), true);
  }
  // ---- the tail piece: its front edge tucked under the last tile, then row by row to the rear
  const TAX = lo ? [-1, 0, 1] : [-1, -0.8, -0.45, 0, 0.45, 0.8, 1], TT = lo ? [0.3, 0.65, 1] : [0.1, 0.24, 0.4, 0.56, 0.72, 0.86, 0.95, 1];
  const TZ = lo ? [-0.2, -0.3, -0.4, -0.46, -0.49, -0.499] : [-0.158, -0.175, -0.2, -0.23, -0.26, -0.29, -0.32, -0.35, -0.38, -0.408, -0.432, -0.452, -0.468, -0.481, -0.49, -0.496, -0.499];
  join([row(IT_P + 0.012, 2, isoTail, TAX, TT, -0.01, IT_P), row(IT_P - 0.002, 2, isoTail, TAX, TT, -0.006, IT_P)].concat(TZ.map((z) => row(z, 2, isoTail, TAX, TT))), true);
  if (lo) return m;
  // ---- the rounded edge: a thin roll along the whole outline, so the shield has a thickness, never a sheet
  {
    const P = [], R = [];
    for (let j = 0; j <= 26; j++) { const a = (j / 26 - 0.5) * PI; P.push([IT_HA * sin(a) * 0.995, IT_YF - 0.009, IT_C + IT_HL * cos(a) * 0.995]); R.push(0.0055); }
    m.tube(P, (j) => R[j], 8, true, () => -0.2);
    const Q = [];
    for (let j = 0; j <= 22; j++) { const a = (j / 22 - 0.5) * PI, zz = IT_P - IT_TL * cos(a) + (j === 0 || j === 22 ? 0.004 : 0); Q.push([(a < 0 ? -1 : 1) * isoW(zz, 2) * 0.99, IT_YF - 0.009, zz]); }
    m.tube(Q, () => 0.0055, 8, true, () => -0.2);
    // (no tube along the thorax flank: qa I6. Its edge is the tiles' own rounded under-roll, level with the
    // rims of head and tail, and the only thing lying on it is the genal blade, to the fourth segment)
  }
  // ---- the eyes (qa I4): "large short eyes", holochroal ("small contiguous lenses set on a curving visual
  // surface"; in Asaphus that surface is a piece of a spheroid). One low tower out of each cheek, in one skin
  // with the head: the footprint a bean of 0.06 by 0.03, round side outward, 0.023 high. The outer wall is the
  // eye: a smooth bulging band that runs round the outer half and leans a little outward, so it also looks up
  // (aux -1). The top is the lid: a nearly flat cap of the shield's own skin (aux 0) that rises out of the
  // cheek as a gentle ramp on the inner side and ends outward in a small rim over the band. All measures are
  // estimates: no source gives them for Isotelus
  for (const sx of [-1, 1]) {
    const xc = 0.132, zc = 0.3, EN = 22, HT = 0.023;
    // the profile from the lid down to the skirt: [height over the cheek, radius factor, 1 on the eye band]
    const prof = [[0.0215, 0.72, 0], [0.019, 0.93, 0], [0.0165, 1.045, 0], [0.0145, 1.02, 1], [0.009, 1.05, 1], [0.003, 1.0, 1], [-0.002, 1.07, 0]];
    const rings = prof.map(([h, rf, band]) => Array.from({ length: EN }, (_, j) => {
      const a = j / EN * TAU, co = cos(a), si = sin(a), u = sstep(0.02, 0.3, co);
      // the inner half is a gentle ramp out of the cheek up to the lid; the band and its rim live on the outer
      // half, and the band's belly leans outward
      const ramp = 1.05 - (h + 0.002) / (HT + 0.002) * 0.6;
      const f = mix(ramp, rf + 0.05 * max(co, 0) * band, u);
      const rx = 0.015 * (1 + 0.15 * co) * f, rz = 0.03 * f;
      const px = xc + rx * co, pz = zc + rz * si;
      return m.v(sx * px, isoHead(px, pz) + h, pz, band && u > 0.5 ? -1 : 0);
    }));
    for (let k = 0; k < rings.length - 1; k++) for (let j = 0; j < EN; j++) {
      const j2 = (j + 1) % EN;
      if (sx > 0) m.quad(rings[k][j], rings[k][j2], rings[k + 1][j2], rings[k + 1][j]);
      else m.quad(rings[k][j2], rings[k][j], rings[k + 1][j], rings[k + 1][j2]);
    }
    const top = m.v(sx * xc, isoHead(xc, zc) + HT + 0.0005, zc, 0);
    for (let j = 0; j < EN; j++) { const j2 = (j + 1) % EN; if (sx > 0) m.tri(rings[0][j2], rings[0][j], top); else m.tri(rings[0][j], rings[0][j2], top); }
  }
  // ---- the genal spines (qa I2): not wires but the head's own rim drawn out backward as a flat blade on each
  // side: its root starts inside the head at the rear corner, its outer edge continues the head's outline
  // without a step, it lies against the edge of the thorax (never more than 0.005 away) and tapers evenly to a
  // point at the fourth segment. As thick as the rim, 0.03 wide at the root. aux -0.28: the shaders colour it as
  // rim, and the vertex shader pins it to the head's bend so it moves with the head and does not sway
  for (const sx of [-1, 1]) {
    const rz = 0.152, tz = 0.004, rx = 0.329, tx = isoW(tz, 1) + 0.001, ry = IT_YF - 0.009, ty = IT_YF - 0.011;
    const dl = hypot(tx - rx, ty - ry, tz - rz);
    slab(m, [sx * rx, ry, rz], [sx * (tx - rx) / dl, (ty - ry) / dl, (tz - rz) / dl], [sx, 0, 0], [0, 1, 0], dl,
      (s) => 0.0145 * pow(1 - s, 0.9) + 0.0005, (s) => 0.0052 * (1 - 0.75 * s) + 0.0006, () => -0.28, 6);
  }
  // ---- under the shield: the body along the middle, and the hypostome, "large and forked", its two prongs
  // facing back ("2 large posteriorly-facing prongs")
  // the body ends at z = -0.36 and tapers, and its top stays 0.008 or more under the shield everywhere (qa I5:
  // its rear end used to stand through the low rear of the tail shield as a glossy lump)
  loft(m, [[-0.36, 0.012, 0.008, hb + 0.02], [-0.3, 0.035, 0.018, hb + 0.026], [-0.18, 0.07, 0.03, hb + 0.034], [0.08, 0.095, 0.038, hb + 0.042], [0.26, 0.08, 0.034, hb + 0.038], [0.36, 0.045, 0.022, hb + 0.032]], 3, 16, -0.4);
  ball(m, [0, hb + 0.022, 0.36], [0.055, 0.016, 0.07], -0.4, 14, 7);
  for (const sx of [-1, 1]) m.tube([[sx * 0.018, hb + 0.02, 0.3], [sx * 0.026, hb + 0.017, 0.26], [sx * 0.03, hb + 0.015, 0.225]], (j) => [0.009, 0.006, 0.0025][j], 6, true, () => -0.4);
  // ---- the legs, each in the plane of its z: out of the body, over a low arch down to the foot (aux: how much of
  // the way of its foot a place on it goes along). Short: the shield rides low over the mud
  // out of the body nearly level, over a knee, and steeply down to the foot; each pair with its own bend and
  // reach, so no two read the same
  const LEG = [[0.08, hb + 0.02, 0.012, 0], [0.3, hb + 0.023, 0.0125, 0.04], [0.52, hb + 0.026, 0.0105, 0.14], [0.68, hb + 0.02, 0.0115, 0.3], [0.8, hb + 0.004, 0.009, 0.52], [0.9, hb - 0.014, 0.0075, 0.74], [0.96, 0.014, 0.005, 0.9], [1, 0.002, 0.003, 1]];
  for (let k = 0; k < IW.nl; k++) for (const sx of [-1, 1]) {
    const z = IW.z0 - k * IW.dz, f = IXF[k] * (1 + 0.09 * sin(k * 2.4 + sx)), q = (0.7 + 0.3 * IT_LK[k]) * (0.92 + 0.16 * (sin(k * 3.1 + 2 * sx) * 0.5 + 0.5)), fore = 0.014 * (1 - k / 8) + 0.008 * sin(k * 1.7 - sx);
    m.tube(LEG.map(([u, y, , w]) => [sx * u * f, y, z + fore * w]), (j) => LEG[j][2] * q, 5, true, (j) => 0.008 + 0.49 * LEG[j][3]);
  }
  // ---- the antennae: "a pair of anteriorly directed antennae", from under the front rim, forward and out, the
  // tips lifted. About half as long as the body (estimate)
  for (const sx of [-1, 1]) m.tube(curve([[0.045, hb + 0.018, 0.42], [0.058, hb - 0.005, 0.5], [0.085, hb - 0.006, 0.58], [0.15, hb + 0.012, 0.7], [0.24, hb + 0.045, 0.82], [0.31, hb + 0.08, 0.92]].map(([x, y, z]) => [sx * x, y, z]), 12), (j) => 0.005 - 0.0036 * j / 12, 4, true, (j) => 0.6 + 0.4 * j / 12);
  return m;
}

// ---------------------------------------------------------------- shaders
// The walk: wkOf, wkS, wkPose and what belongs to them are those of the Cambrian walkers (cambrian/walkers.js),
// copied here because eras share nothing. wkOf, wkS and wkPose are repeated in wkAt below: change one, change the
// other. Instance: a = the middle of its round on the ground and how far the corners are from it (w, sign = which
// way round, 0 = it lies half dug in), b = the rise of the ground along x and z, its length, corners plus seed.
const S_WALK = /*wgsl*/`
struct WK { rc: f32, A: f32, dir: f32, b0: f32, Lp: f32, Ls: f32 };
fn wkOf(a: vec4f, b: vec4f, rp: f32) -> WK {
  var w: WK; w.rc = abs(a.w) / b.z; w.dir = sign(a.w); w.A = TAU / floor(b.w); w.b0 = fract(b.w) * 37.7;
  w.Lp = rp * w.A; w.Ls = w.Lp + 2. * w.rc * sin(.5 * w.A);
  return w;
}
fn wkS(t: f32, w: WK, sd: f32, v: f32) -> f32 {
  let u = t * v * TAU / w.Ls + sd * 53.1;
  return abs(w.dir) * w.Ls * (u - 1.3333333 * sin(u) + .16666667 * sin(2. * u)) / TAU;
}
fn wkPose(s: f32, w: WK) -> vec3f {
  let k = floor(s / w.Ls); let r = s - k * w.Ls;
  let ak = w.b0 + k * w.A * w.dir; let h = ak + w.dir * (1.5707963 + .5 * w.A); let q = sat(r / w.Lp);
  return vec3f(w.rc * vec2f(cos(ak), sin(ak)) + vec2f(cos(h), sin(h)) * max(r - w.Lp, 0.), h - w.dir * w.A * (1. - q * q * (3. - 2. * q)));
}
fn wkHead(s: f32, w: WK) -> f32 {
  let k = floor(s / w.Ls); let q = sat((s - k * w.Ls) / w.Lp);
  return w.b0 + k * w.A * w.dir + w.dir * (1.5707963 + .5 * w.A) - w.dir * w.A * (1. - q * q * (3. - 2. * q));
}
fn wkTo(A: vec3f, B: vec3f, f: vec2f) -> vec2f {
  let q = B.xy + f.x * vec2f(sin(B.z), -cos(B.z)) + f.y * vec2f(cos(B.z), sin(B.z)) - A.xy;
  return vec2f(dot(q, vec2f(sin(A.z), -cos(A.z))), dot(q, vec2f(cos(A.z), sin(A.z))));
}
fn wkFoot(s: f32, P: vec3f, f: vec2f, ph: f32, w: WK, lam: f32, be: f32, lf: f32) -> vec3f {
  let p = fract(s / lam + ph);
  if (p < be) { let q = wkTo(P, wkPose(s + (.5 * be - p) * lam, w), f); return vec3f(q.x, 0., q.y); }
  let s0 = s - (p - be) * lam; let s1 = s + (1. - p) * lam;
  let a = wkTo(wkPose(s0, w), wkPose(s0 - .5 * be * lam, w), f);
  let b = wkTo(wkPose(s1, w), wkPose(s1 + .5 * be * lam, w), f);
  let q = (p - be) / (1. - be); let e = q * q * (3. - 2. * q);
  return vec3f(mix(a.x, b.x, e), lf * sin(3.1415927 * q), mix(a.y, b.y, e));
}
struct WF { e1: vec3f, e2: vec3f, N: vec3f };
fn wkFrame(b: vec4f) -> WF { var o: WF; o.e1 = normalize(vec3f(1., b.x, 0.)); o.N = normalize(vec3f(-b.x, 1., -b.y)); o.e2 = cross(o.e1, o.N); return o; }
fn wkWorld(a: vec4f, L: f32, fr: WF, P: vec3f, l: vec3f) -> vec3f {
  return a.xyz + L * (fr.e1 * (P.x + l.x * sin(P.z) + l.z * cos(P.z)) + fr.e2 * (P.y - l.x * cos(P.z) + l.z * sin(P.z)) + fr.N * l.y);
}
fn wkDir(fr: WF, P: vec3f, n: vec3f) -> vec3f { return (fr.e1 * sin(P.z) - fr.e2 * cos(P.z)) * n.x + fr.N * n.y + (fr.e1 * cos(P.z) + fr.e2 * sin(P.z)) * n.z; }
fn wkGive(c: vec3f, r: f32, h: f32, b: vec4f) -> vec3f {
  var d = dodge(c, r + 2. * g.fwd.w, 1., h) - c;
  d.y = b.x * d.x + b.y * d.z;
  return d;
}
`;
const S_ISO = /*wgsl*/`
const IT_Z0 = ${isoNum(IW.z0)}; const IT_DZ = ${isoNum(IW.dz)}; const IT_NL = ${isoNum(IW.nl - 1)}; const IT_XF = array<f32, ${IW.nl}>(${IXF.map(isoNum).join(', ')});
const IT_LAM = ${isoNum(IW.lam)}; const IT_BE = ${isoNum(IW.be)}; const IT_LF = ${isoNum(IW.lf)}; const IT_WAVE = ${isoNum(IW.wave)};
const IT_RP = ${isoNum(IW.rp)}; const IT_V0 = ${isoNum(IW.v0)}; const IT_V1 = ${isoNum(IW.v1)}; const IT_HC = ${isoNum(IW.hc)}; const IT_HH = ${isoNum(IW.hh)}; const IT_KD = ${isoNum(IW.kd)};
const IT_SINK = ${isoNum(IW.sink)}; const IT_C = ${isoNum(IT_C)}; const IT_P = ${isoNum(IT_P)}; const IT_SEG = ${isoNum(IT_SEG)};
const IT_HA = ${isoNum(IT_HA)}; const IT_HL = ${isoNum(IT_HL)}; const IT_TA = ${isoNum(IT_TA)}; const IT_TL = ${isoNum(IT_TL)};
// IT_BEND: a place along the body heads the way the walker will head (in front of its middle) or did head (behind
// it) when it has walked on by this share of the way between them. IT_PIV: the height about which the body bends
const IT_BEND = .15; const IT_PIV = ${isoNum(IW.hb + 0.05)};
fn isoG(v: f32) -> f32 { return exp(-v * v); }
fn isoIn(x: f32, zr: f32, a: f32, b: f32) -> f32 { let q = max(length(vec2f(x / a, zr / b)), 1e-4); return max(1. - q, 0.) * length(vec2f(x, zr)) / q; }
@vertex fn vsIso(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let L = i.b.z; let sd = fract(i.b.w); let au = i.n.w; let mv = abs(sign(i.a.w));
  let w = wkOf(i.a, i.b, IT_RP); let s = wkS(t, w, sd, IT_V0 + IT_V1 * fract(sd * 7.3)); let P = wkPose(s, w);
  var l = i.p; let sg = select(-1., 1., l.x > 0.);
  // one that stays where it is lies half dug in: the rim of its shield and its legs under the mud, the dome and
  // the eyes out of it ("only its eyes and portions of the dorsal exoskeleton exposed")
  l.y -= (1. - mv) * IT_SINK;
  // the legs step (aux up to .5): the two of a pair together, each pair a little after the one behind it. Too far
  // away to be seen, they are left as they are
  let wl = sat((au - .008) / .49) * step(.004, au) * step(au, .52);
  var d = vec3f(0.);
  if (wl > 0. && mv > 0. && distance(g.cam.xyz, i.a.xyz) < 12. + abs(i.a.w)) {
    let k = clamp(round((IT_Z0 - l.z) / IT_DZ), 0., IT_NL); let f = vec2f(sg * IT_XF[u32(k)], IT_Z0 - k * IT_DZ);
    d = wkFoot(s, P, f, k * IT_WAVE, w, IT_LAM, IT_BE, IT_LF) - vec3f(f.x, 0., f.y);
  }
  // the antennae (aux .6 to 1) sweep slowly from side to side and feel up and down; on one that lies dug in they
  // come up out of the mud heaped in front of its rim
  let an = sat((au - .6) / .4) * step(.55, au); let fa = t * .7 + sd * 31. + sg * 1.3;
  l += vec3f(sg * .04 * sin(fa - an * 2.), mv * .015 * sin(t * 1.1 + sd * 17. + 2. * sg - an * 3.), 0.) * an * an;
  // The body bends, each place along it about its own middle: sideways into a turn, and up and down a little. It
  // ploughs: the head dips toward the mud now and then (th goes below zero), the tail rides level
  // the genal spine blade (aux -0.28) bends about the head's own place, so it moves with the head (qa I2)
  var zc = clamp(l.z, -.5, .5); zc = select(zc, .15, au > -.295 && au < -.265); let ze = l.z - zc;
  let da = (wkHead(s + IT_BEND * zc, w) - P.z) * mv;
  let th = mv * (.02 * sin(t * .43 + sd * 20.) - .02 * ss(.5, 1., sin(t * .19 + sd * 47.)));
  let tt = mv * (.015 + .015 * sin(t * .37 + sd * 11.));
  let u1 = sat((zc - .02) / .28); let u2 = sat((0. - zc - .02) / .3);
  let pa = th * u1 * u1 * (3. - 2. * u1) + tt * u2 * u2 * (3. - 2. * u2);
  let yc = th * (.28 * (u1 * u1 * u1 - .5 * u1 * u1 * u1 * u1) + max(zc - .3, 0.)) - tt * (.3 * (u2 * u2 * u2 - .5 * u2 * u2 * u2 * u2) + max(0. - zc - .32, 0.));
  let cp = cos(pa); let sp = sin(pa); let cy = cos(da); let sy = sin(da);
  let yr = l.y - IT_PIV; let z1 = ze * cp - yr * sp;
  var bd = vec3f(l.x * cy - z1 * sy - .5 * da * zc, IT_PIV + yc + yr * cp + ze * sp, zc + l.x * sy + z1 * cy);
  // (an antenna never goes into the mud; those of one that lies dug in come up over the heap at its rim)
  bd.y = mix(bd.y, max(bd.y, .012 + (1. - mv) * .05 * ss(.08, .2, an) * (1. - .9 * ss(.3, .9, an))), step(.55, au));
  l = mix(bd, l, wl) + vec3f(d.x * wl, d.y * pow(wl, 2.5), d.z * wl);
  let n1 = vec3f(i.n.x, i.n.y * cp + i.n.z * sp, i.n.z * cp - i.n.y * sp); let n = vec3f(n1.x * cy - n1.z * sy, n1.y, n1.x * sy + n1.z * cy);
  let fr = wkFrame(i.b); let c = wkWorld(i.a, L, fr, P, vec3f(0., IT_HC, 0.));
  let wp = wkWorld(i.a, L, fr, P, l) + wkGive(c, IT_KD * L, IT_HH * L, i.b) * mv;
  o.cp = g.vp * vec4f(wp, 1.); o.wp = wp; o.n = wkDir(fr, P, n); o.op = i.p; o.sd = floor(L * 4000.) + sd; o.lt = au;
  return o;
}
// The shell. Colours are free: no fossil shows them. After the horseshoe crab, the living model for the surface:
// a plain olive-brown family with low saturation, a dull broad sheen at most, no light through it. The relief is
// the sourced one: a smooth shield "marked with small pits and occasionally shallow bumps", the shallow smooth
// axial furrows, the border furrow, the steps of the segment joints. Hollows darker, worn edges paler (L7), the
// tone uneven at three sizes but quieter than a soft skin (skinTone at half strength), each animal its own (L8)
@fragment fn fsIso(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let L = floor(i.sd) / 4000.; let sd = fract(i.sd); let lt = i.lt;
  let x = abs(i.op.x); let y = i.op.y; let z = i.op.z;
  let leg = step(.004, lt) * step(lt, .52); let ant = step(.55, lt); let rim = step(-.3, lt) * step(lt, -.1);
  let und = step(-.5, lt) * step(lt, -.3); let eye = step(lt, -.95);
  let shell = step(-.05, lt) * step(lt, .003); let outer = shell * select(0., 1., ff); let inner = shell - outer;
  let tg = textureSample(tD, sR, vec2f(i.op.x * 37. + i.op.z * 21., i.op.z * 33. - i.op.x * 17.) + i.op.y * vec2f(27., 41.) + sd) * .5
    + textureSample(tD, sR, vec2f(i.op.x * 61. - i.op.z * 29., i.op.z * 67. + i.op.x * 41.) + i.op.y * vec2f(49., 29.) + .37) * .5;
  // fine detail fades before it can flicker (qa I3): fine for the broad relief, fdot for the dust of dots and
  // the pits, ftg for the texture mottle, each gone before its cells shrink toward a pixel
  let fw = fwidth(z) + fwidth(x);
  let fine = ss(.02, .005, fw); let fdot = ss(.0045, .0018, fw); let ftg = ss(.01, .004, fw);
  let hd = step(IT_C, z); let tl = 1. - step(IT_P, z); let th = 1. - hd - tl;
  // where on the shield: the axis half-width A, the distance d inside the outline, the segment joint
  let kz = (z - IT_P) / (IT_C - IT_P);
  let Ah = .12 * sqrt(max(1. - pow(max(z - .33, 0.) / .14, 2.), 0.));
  let At = .1 + .02 * kz;
  let tz = (IT_P - z) / .28;
  let Ap = (.1 - .05 * min(tz, 1.)) * sqrt(max(1. - pow(max(tz - .8, 0.) / .2, 2.), 0.));
  let A = hd * Ah + th * At + tl * Ap;
  let W = hd * IT_HA + th * (.33 + .015 * kz) + tl * IT_TA;
  let dh = isoIn(x, z - IT_C, IT_HA, IT_HL); let dp = isoIn(x, IT_P - z, IT_TA, IT_TL);
  let d = hd * dh + tl * dp + th * (1. - min(x / W, 1.)) * .3;
  // the furrows, all of them shallow: beside the axis, inside the border, between the rings of the tail's axis,
  // and the joint at the front of every segment
  let fA = isoG((x - A - .006) / .014) * ss(.015, .03, A);
  let fB = isoG((d - .05) / .022) * (1. - th);
  let v = fract((IT_C - z) / IT_SEG);
  let fJ = isoG(v / .06) * th * .5;
  let fR = (.5 - .5 * cos(TAU * 4. * tz)) * ss(Ap + .004, Ap - .006, x) * tl * .5;
  let fur = sat(.7 * fA + .6 * fB + .5 * fJ + fR);
  // the sourced skin: small pits of differing sizes and depths, sparse shallow bumps
  let pv = .4 + .8 * vn(i.op * 7. + sd * 5.);
  let pit = (ss(.24, .12, wor(i.op * 320. + sd * 17.)) * .7 + ss(.2, .09, wor(i.op * 150. + sd * 29.)) * .5) * pv;
  let bmp = ss(.65, .85, vn(i.op * 44. + sd * 9.)) * ss(.5, .62, tg.b);
  let ns = normalize(i.n) * select(-1., 1., ff); let ny = ns.y;
  let n = skinRelief(ns, i.wp, ((.0005 * (tg.a - .5) * ftg + .002 * bmp - .001 * pit * fdot) * fine - .005 * fur * fine) * (outer + .4 * und + .3 * leg) * L * 1.6);
  // one in eight is a pale one; the large ones a little darker
  let tone = fract(sd * 13.7); let hue = fract(sd * 5.3); let lite = step(.88, fract(sd * 3.1));
  let md = mix(vec3f(.30, .26, .15), vec3f(.26, .25, .18), hue);
  let pale = vec3f(.46, .42, .28);
  var alb = mix(md, md * .55, .4 * ss(A + .012, A - .006, x));
  // worn paler to the edge and on the crests of the ribs, darker round each eye; the blotches and the dust of
  // skinTone, at a shell's quarter strength
  let edge = hd * ss(.05, 0., dh) + tl * ss(.045, 0., dp) + th * ss(.8, 1., min(x / W, 1.));
  alb = mix(alb, pale, .7 * edge + .12 * bmp);
  alb *= 1. - .3 * hd * isoG(length(vec2f(x - .132, z - .3) / vec2f(.055, .07)));
  alb = mix(alb, skinTone(alb, i.op * 5.2, ny, 1. - fdot, sd), .28);
  alb *= (.9 + .2 * mix(.5, tg.g, ftg)) * (1. - .5 * fur * mix(.5, 1., fine)) * (1. - .08 * pit * fdot) * mix(.8, 1.22, tone) * mix(1.06, .86, ss(.24, .38, L)) * (1. + .4 * lite);
  // the inside of the shell: dark, warmer
  alb = mix(alb, vec3f(.18, .13, .09) * (.6 + .4 * tg.g), inner);
  // the edge and the genal spines: the shell's colour, paler, their under sides in shade
  alb = mix(alb, mix(md, pale, .5) * (.75 + .5 * tg.g) * mix(.8, 1.22, tone) * mix(.5, 1., ss(-.7, .2, ny)), rim);
  // the body, the hypostome and its prongs; the legs, ringed at the joints, darker to their feet; the antennae
  alb = mix(alb, vec3f(.44, .34, .23) * mix(.4, 1., ss(.1, .07, y)), und);
  let jt = mix(x * 48., z * 120., ant);
  let ring = ss(.36, .5, abs(fract(jt) - .5)) * ss(1.2, .4, fwidth(jt));
  alb = mix(alb, mix(vec3f(.16, .1, .055), vec3f(.44, .3, .17), ss(0., .05, y)) * (1. - .3 * ring) * mix(.45, 1., ss(.12, .28, x)), leg);
  alb = mix(alb, vec3f(.46, .35, .2) * (1. - .3 * ring), ant);
  // the eye band (qa I4): very dark and smooth, dark (L6), with from close up a very fine EVEN grain of lenses
  // (even is right here: it is what the fossil has), fading with the dots so it cannot flicker
  let gr = sin(i.op.z * 3100. + i.op.y * 900.) * sin(i.op.y * 2900. + i.op.z * 1100. + i.op.x * 700.);
  alb = mix(alb, vec3f(.045, .04, .032) * (1. + .12 * gr * fdot), eye);
  // its light: skinLive with nothing shining through (a shell), and the broad dull sheen of a wet carapace (as
  // the Cambrian trilobite has it): no sharp hot spot anywhere. The eye band carries the one gloss of the
  // animal, and it is the soft broad one, long because the band is long
  var c = skinLive(alb, n, ns, i.wp, 0., .5 * (tg.a + bmp) * outer, 0.);
  let Vw = normalize(g.cam.xyz - i.wp); let Hw = normalize(Vw + g.sun.xyz);
  let Ew = sunE(i.wp.y, zone(i.wp)) * shadow4(i.wp + n * .3);
  c += Ew * (pow(sat(dot(n, Hw)), 40.) * (.2 * (outer + rim) + .7 * eye) + pow(sat(dot(ns, Hw)), 70.) * (.3 * outer + .2 * (leg + rim)));
  return fin(fog(c, i.wp, zone(i.wp)));
}
`;
// the soft dark patch on the mud under a walker, and the heap of mud round one that lies dug in: both as in
// cambrian/walkers.js (wkShadow there)
const S_ISO_SHADOW = /*wgsl*/`
@vertex fn vsIsoShadow(i: VI) -> VO {
  var o: VO;
  let L = i.b.z; let sd = fract(i.b.w); let mv = abs(sign(i.a.w));
  let w = wkOf(i.a, i.b, IT_RP); let P = wkPose(wkS(g.cam.w, w, sd, IT_V0 + IT_V1 * fract(sd * 7.3)), w);
  let fr = wkFrame(i.b); let c = wkWorld(i.a, L, fr, P, vec3f(0., IT_HC, 0.));
  let w0 = wkWorld(i.a, L, fr, P, vec3f(i.p.x * .5, 0., i.p.z * .66 - .02)); let sh = normalize(vec2f(g.sun.x, g.sun.z) + 1e-5);
  let so = sh * ((IT_HC * L * .9 / max(g.sun.y, .25) + .7 * max(0. - dot((w0 - wkWorld(i.a, L, fr, P, vec3f(0., 0., -.02))).xz, sh), 0.)) * mv);
  let wp = w0 - vec3f(so.x, i.b.x * so.x + i.b.y * so.y, so.y) + fr.N * (min(.002, .05 * L) + .0003 + (1. - mv) * .03 * L) + wkGive(c, IT_KD * L, IT_HH * L, i.b) * mv;
  o.cp = g.vp * vec4f(wp, 1.); o.wp = wp; o.n = fr.N; o.op = i.p; o.sd = sd; o.lt = mv;
  return o;
}
@fragment fn fsIsoShadow(i: VO) -> @location(0) vec4f {
  let a = (.6 - .2 * (1. - i.lt)) * (1. - ss(.3, 1., length(i.op.xz)));
  return vec4f(fog(vec3f(0.), i.wp, zone(i.wp)) * a, a);
}
`;
function meshIsoShadow() {
  const m = new Mesh(), N = 24, c = m.v(0, 0, 0, 0), ring = [];
  for (let k = 0; k < N; k++) ring.push(m.v(cos(k / N * TAU), 0, sin(k / N * TAU), 0));
  for (let k = 0; k < N; k++) m.tri(c, ring[(k + 1) % N], ring[k]);
  return m;
}
// the mud a trilobite that lies dug in has heaped up round itself: a piece of the ground (material 0), one mesh
// for all of them. makeIsotelus fills ISO_HEAPS; the engine builds the mesh after that
const ISO_HEAPS = [];
function meshIsoHeap() {
  const m = new Mesh();
  for (const rings of ISO_HEAPS) {
    const R = rings.map((r) => r.map((p) => m.v(p[0], p[1], p[2], 1)));
    for (let j = 0; j < R.length - 1; j++) for (let s = 0; s < R[j].length; s++) { const s2 = (s + 1) % R[j].length; m.quad(R[j][s], R[j + 1][s], R[j + 1][s2], R[j][s2]); }
  }
  return m.build((x, y, z, nx, ny, nz) => { const l = hypot(nx, ny, nz) || 1; return [0.35 * nx / l, 0.35 * ny / l + 0.65, 0.35 * nz / l]; });
}

// ---------------------------------------------------------------- where they are, for the zoo
// wkOf, wkS and wkPose of S_WALK for the walker at i, at the scene time: the middle into WKP (0 to 2), the way it
// heads (3 to 5). Runs in every frame and allocates nothing
const WKP = new Float64Array(6);
const wkAt = (a, i, sp) => {
  const L = a[i + 6], f = a[i + 7], nn = floor(f), sd = f - nn, w = a[i + 3], dir = w > 0 ? 1 : w < 0 ? -1 : 0, rc = (w < 0 ? -w : w) / L;
  const A = TAU / nn, Lp = sp.rp * A, Ls = Lp + 2 * rc * sin(0.5 * A), q7 = sd * 7.3, v = sp.v0 + sp.v1 * (q7 - floor(q7));
  const u = F[TIME] * v * TAU / Ls + sd * 53.1, s = (dir === 0 ? 0 : Ls) * (u - 4 / 3 * sin(u) + sin(2 * u) / 6) / TAU;
  const k = floor(s / Ls), r = s - k * Ls, ak = sd * 37.7 + k * A * dir, h = ak + dir * (PI / 2 + 0.5 * A), q = r < Lp ? r / Lp : 1;
  const ps = h - dir * A * (1 - q * q * (3 - 2 * q)), go = r > Lp ? r - Lp : 0, px = rc * cos(ak) + cos(h) * go, pz = rc * sin(ak) + sin(h) * go;
  const gx = a[i + 4], gz = a[i + 5], l1 = sqrt(1 + gx * gx), e1x = 1 / l1, e1y = gx / l1, l2 = sqrt(1 + gx * gx + gz * gz), nx = -gx / l2, ny = 1 / l2, nz = -gz / l2;
  const e2x = e1y * nz, e2y = -e1x * nz, e2z = e1x * ny - e1y * nx, cs = cos(ps), sn = sin(ps), hc = (dir === 0 ? sp.hd : sp.hc) * L;
  WKP[3] = e1x * cs + e2x * sn; WKP[4] = e1y * cs + e2y * sn; WKP[5] = e2z * sn;
  const mx = a[i] + L * (e1x * px + e2x * pz) + nx * hc, my = a[i + 1] + L * (e1y * px + e2y * pz) + ny * hc, mz = a[i + 2] + L * e2z * pz + nz * hc;
  ZP[0] = mx; ZP[1] = my; ZP[2] = mz;
  if (dir !== 0) { ZH[0] = sp.hh * L; ZH[1] = sp.kd * L; zooDodge(1); ZP[1] = my + gx * (ZP[0] - mx) + gz * (ZP[2] - mz); }
  WKP[0] = ZP[0]; WKP[1] = ZP[1]; WKP[2] = ZP[2];
};
// a walker's zoo place: a line along its body through its middle, as thick as it is wide
const zooIso = (a, i) => {
  wkAt(a, i, IW);
  const e = IW.line * a[i + 6];
  ZP[0] = WKP[0] - WKP[3] * e; ZP[1] = WKP[1] - WKP[4] * e; ZP[2] = WKP[2] - WKP[5] * e;
  ZP[3] = WKP[3] * 2 * e; ZP[4] = WKP[4] * 2 * e; ZP[5] = WKP[5] * 2 * e; ZP[7] = IW.rad * a[i + 6];
};

// ---------------------------------------------------------------- giving them their places (load-time only)
// The ground as it is drawn, what stands on it, and the plane under a round: the way of cambrian/walkers.js,
// copied because eras share nothing. The one change: obstacles smaller than 5 cm (the shell grit, the loose
// brachiopod carpet: they lie everywhere, and a trilobite may plough past them) do not block a round.
const isoNet = (W, x0, z0, r) => {
  const { wp, ib, start } = W.T, G = 0.1, n = Math.ceil(2 * r / G), bx = x0 - r, bz = z0 - r, bins = Array.from({ length: n * n }, () => []);
  const cell = (v, o) => clamp(floor((v - o) / CELLW), 0, CELLS - 1);
  for (let cz = cell(z0 - r - 1, OZ); cz <= cell(z0 + r + 1, OZ); cz++) for (let cx = cell(x0 - r - 1, OX); cx <= cell(x0 + r + 1, OX); cx++) {
    const c = cx + CELLS * cz;
    for (let q = start[c] * 6; q < start[c + 1] * 6; q += 3) {
      const a = ib[q] * 3, b = ib[q + 1] * 3, d = ib[q + 2] * 3;
      const x1 = min(wp[a], wp[b], wp[d]), x2 = max(wp[a], wp[b], wp[d]), z1 = min(wp[a + 2], wp[b + 2], wp[d + 2]), z2 = max(wp[a + 2], wp[b + 2], wp[d + 2]);
      if (x2 < bx || x1 > bx + 2 * r || z2 < bz || z1 > bz + 2 * r) continue;
      for (let j = max(0, floor((z1 - bz) / G)); j <= min(n - 1, floor((z2 - bz) / G)); j++) for (let k = max(0, floor((x1 - bx) / G)); k <= min(n - 1, floor((x2 - bx) / G)); k++) bins[k + n * j].push(a, b, d);
    }
  }
  const at = (x, z, y0) => {
    const k = floor((x - bx) / G), j = floor((z - bz) / G);
    if (k < 0 || j < 0 || k >= n || j >= n) return NaN;
    const Lb = bins[k + n * j]; let best = NaN, bd = Infinity;
    for (let e = 0; e < Lb.length; e += 3) {
      const a = Lb[e], b = Lb[e + 1], dd = Lb[e + 2], ax = wp[a], az = wp[a + 2], bxx = wp[b], bzz = wp[b + 2], dx = wp[dd], dz = wp[dd + 2];
      const det = (bzz - dz) * (ax - dx) + (dx - bxx) * (az - dz);
      if (abs(det) < 1e-12) continue;
      const u = ((bzz - dz) * (x - dx) + (dx - bxx) * (z - dz)) / det, v = ((dz - az) * (x - dx) + (ax - dx) * (z - dz)) / det;
      if (u < -1e-7 || v < -1e-7 || u + v > 1 + 1e-7) continue;
      const yv = u * wp[a + 1] + v * wp[b + 1] + (1 - u - v) * wp[dd + 1];
      if (abs(yv - y0) < bd) { bd = abs(yv - y0); best = yv; }
    }
    return best;
  };
  return { at };
};
const isoStanding = (W, net, x0, z0, r, meshes, skip) => {
  const out = [], c0 = W.cellOf(x0 - r - 2, z0 - r - 2), c1 = W.cellOf(x0 + r + 2, z0 + r + 2);
  for (const k of KINDS) {
    if (!k.solid || !k.at || skip.has(k)) continue;
    const lists = [];
    if (k.cells) { for (let cz = floor(c0 / CELLS); cz <= floor(c1 / CELLS); cz++) for (let cx = c0 % CELLS; cx <= c1 % CELLS; cx++) lists.push(k.at[cx + CELLS * cz]); } else lists.push(k.at);
    for (const Li of lists) for (let i = 0; i < Li.length; i += 12) {
      const x = Li[i], y = Li[i + 1], z = Li[i + 2], sc = Li[i + 3], qx = Li[i + 4], qy = Li[i + 5], qz = Li[i + 6], qw = Li[i + 7];
      if (hypot(x - x0, z - z0) > r + 2 * sc) continue;
      if (!meshes.has(k)) meshes.set(k, new Float32Array(k.mesh().vb));
      const V = meshes.get(k); let reach = -1;
      for (let j = 0; j < V.length; j += 4) {
        const vx = V[j] * sc, vy = V[j + 1] * sc, vz = V[j + 2] * sc, tx = 2 * (qy * vz - qz * vy), ty = 2 * (qz * vx - qx * vz), tz = 2 * (qx * vy - qy * vx);
        const px = x + vx + qw * tx + qy * tz - qz * ty, py = y + vy + qw * ty + qz * tx - qx * tz, pz = z + vz + qw * tz + qx * ty - qy * tx, gv = net.at(px, pz, py);
        if (py < (gv === gv ? gv : y) + 0.05) reach = max(reach, hypot(px - x, pz - z));
      }
      if (reach >= 0.05) out.push([x, z, reach]);
    }
  }
  return out;
};
// the plane of the drawn ground under a round. The tolerance is wider than the Cambrian's smallest walkers need
// (these are 4 to 8 times as large, and the shelf rolls): a few millimetres under a foot of near a centimetre
const ISO_RIM = Array.from({ length: 24 }, (_, k) => [cos(k / 24 * TAU), sin(k / 24 * TAU)]);
const isoPlane = (W, net, x, z, R, tol, top) => {
  const y0 = W.gyExact(x, z); let sy = 0, sx = 0, sz = 0;
  for (const [c, s] of ISO_RIM) { const y = net.at(x + R * c, z + R * s, y0); if (!(y === y)) return null; sy += y; sx += c * y; sz += s * y; }
  const a = sy / 24, gx = sx / (12 * R), gz = sz / (12 * R);
  if (gx * gx + gz * gz > 0.2345) return null;
  for (const f of [0, 0.25, 0.5, 0.75, 1]) for (let k = 0; k < (f ? 24 : 1); k++) {
    const dx = f * R * ISO_RIM[k][0], dz = f * R * ISO_RIM[k][1], p = a + gx * dx + gz * dz;
    if (!(abs(net.at(x + dx, z + dz, y0) - p) <= tol) || W.Dw(x + dx, p + 0.05 + top, z + dz) > 0) return null;
  }
  return [a, gx, gz];
};
// about 600 of them, many half dug in, in loose crowds on the mud between the meadows (ordovician-life.md). The
// crowds lie within 80 m; the first is at the start, so the first view has them. Instances: see S_WALK
// ISO_SITES keeps the crowd centres [x, z, r]: the sea scorpions are placed near them (walkers_megalograptus.js)
const ISO_SITES = [];
function makeIsotelus(W) {
  rseed(140);
  const skip = new Set([GRIT, BRACH[0], BRACH[1], BRACH_DEAD]);
  const placed = [], meshes = new Map(), heapNets = [], trilos = [];
  // the crowd centres: on open mud (no meadow, no ledge), at least 9 m apart
  const sites = [[7, 10, 5.5]];
  for (let tries = 0; sites.length < 26 && tries < 600; tries++) {
    const an = rnd() * TAU, rad = 8 + 70 * sqrt(rnd()), x = cos(an) * rad, z = sin(an) * rad;
    if (sstep(0.47, 0.52, fbm(x * 0.021, z * 0.021, 61, 3)) > 0.25 || ledgeAt(x, z) > 0.3) continue;
    if (sites.some((s) => hypot(x - s[0], z - s[1]) < 9)) continue;
    sites.push([x, z, rr(3.5, 6)]);
  }
  ISO_SITES.push(...sites);
  for (const [sx, sz, sr] of sites) {
    const net = isoNet(W, sx, sz, sr + 0.5), obs = isoStanding(W, net, sx, sz, sr + 0.55, meshes, skip);
    const count = 18 + (rnd() * 11 | 0);
    for (let made = 0, dug = 0, tries = 0, most = 60 * count; made < count && tries < most; tries++) {
      const a = rnd() * TAU, r = sqrt(rnd()) * sr, x = sx + cos(a) * r, z = sz + sin(a) * r, L = mix(IW.l0, IW.l1, pow(rnd(), IW.lp));
      const still = rnd() < IW.dig && dug < round(IW.dig * count), n = 2 + floor(rnd() * 4), dir = rnd() < 0.5 ? -1 : 1, sd = rr(0.001, 0.999), c = rr(IW.c0, IW.c1);
      const rc = still ? 0 : L * c * (1 - 0.7 * tries / most), rb = rc + IW.rb * L, ra = rc + IW.ra * L;
      if (W.nearPose(x, z, 1.2) || W.nearFly(x, W.gy(x, z), z, 0.7)) continue;
      if (placed.some((p) => hypot(x - p[0], z - p[1]) < max(rb + p[3], ra + p[2]) + 0.004)) continue;
      if (obs.some((o) => hypot(x - o[0], z - o[1]) < ra + o[2] + 0.004)) continue;
      const pl = isoPlane(W, net, x, z, still ? 0.85 * L : rc + IW.rf * L + 0.6 * (IW.kd * L + 0.02), min(0.004, 0.015 * L), (IW.hc + IW.hh) * L);
      if (!pl) continue;
      trilos.push(x, pl[0], z, rc * dir, pl[1], pl[2], L, n + sd);
      placed.push([x, z, rb, ra]); made++; if (still) { dug++; heapNets.push(net); }
    }
  }
  ISOTELUS.data = ISO_SHADOW.data = new Float32Array(trilos);
  // the mud round each one that lies dug in: a low uneven heap a little inside the shield's outline, standing on
  // the ground as it is drawn there (as in cambrian/walkers.js, with the broad oval of Isotelus)
  const E = [-0.2, -0.14, -0.07, -0.02, 0.02, 0.06, 0.1, 0.15, 0.2, 0.25];
  for (let i = 0, hn = 0; i < trilos.length; i += 8) if (trilos[i + 3] === 0) {
    const net = heapNets[hn++], gx = trilos[i + 4], gz = trilos[i + 5], L = trilos[i + 6], sd = trilos[i + 7] % 1, ps = sd * 37.7, cs = cos(ps), sn = sin(ps);
    const l1 = hypot(1, gx), e1 = [1 / l1, gx / l1, 0], l2 = hypot(gx, 1, gz), N = [-gx / l2, 1 / l2, -gz / l2], e2 = [e1[1] * N[2], -e1[0] * N[2], e1[0] * N[1] - e1[1] * N[0]];
    ISO_HEAPS.push(E.map((e, j) => Array.from({ length: 32 }, (_, s) => {
      const a = s / 32 * TAU, eo = e < 0 ? e : e * (0.8 + 0.35 * sin(2 * a + sd * 23) + 0.2 * sin(5 * a + sd * 61)), ox = sin(a) / 0.35, oz = cos(a) / 0.48, ol = hypot(ox, oz);
      const px = 0.33 * sin(a) + eo * ox / ol, pz = 0.48 * cos(a) + eo * oz / ol;
      const h = 0.022 * (0.8 + 0.3 * sin(3 * a + sd * 40) + 0.12 * sin(7 * a + sd * 90)) * (e < -0.07 ? 1 : exp(-(((e + 0.07) / 0.1) ** 2)));
      const u = px * sn + pz * cs, v = pz * sn - px * cs, p = [0, 1, 2].map((c) => trilos[i + c] + L * (e1[c] * u + e2[c] * v)), y = net.at(p[0], p[2], p[1]);
      p[1] = (y === y ? y : p[1]) + (j === 0 ? -0.003 : j === E.length - 1 ? -0.0005 : L * h + 0.0002);
      return p;
    })));
  }
  if (ISO_HEAPS.length) ISO_HEAP.at.push(0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0);
  zooMove('isotelus', ISOTELUS.data, zooIso, 3);
}
