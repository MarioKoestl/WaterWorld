// ============================================================================
// cambrian: the walkers, Hallucigenia and the trilobite Olenoides
// ============================================================================
// Their meshes, their shaders, where they are for the zoo, and makeWalkers, which gives them their places. Shapes
// follow the fossils as far as the sources in zoo.js describe them. Colours and how they walk are free: no fossil
// shows them.
// makeWalkers(W, gardens) is called at the end of makeWorld (world.js) with the gardens of the world. A garden may
// name a place for each walker: hallu and trilo, each [x, z, radius, how many], in metres.
// How they walk. Each walker goes round a small regular polygon of its own (with two corners: to and fro), in the plane
// of the ground under it: at each corner it stops, turns on the spot and walks straight on to the next one. Its legs
// step with the way walked, not with the time: a foot on the ground stays where it was set down (the shader works out
// where that was), so no foot slides, however fast or slow the walker goes. makeWalkers measures the ground under each
// round on the triangles of the terrain as they are drawn, and keeps only rounds where it is a plane to within a
// millimetre or two: the shaders put the feet on that plane and need no ground(). No round comes into another one,
// nor into anything that stands (stones, tulip animals, sponges), nor under rock.
// Each mesh is modelled around the middle of the animal, nose at +z, y up, standing on the ground at y = 0, one unit
// long without its spines and feelers: the instance says how large it is.

// ---------------------------------------------------------------- the two walkers in figures
// In lengths of the body. For each:
//   l0, l1, lp  how long they are: from l0 to l1 metres, more of them long the smaller lp is
//   c0, c1      how far the corners of a round are from its middle (from c0 to c1 lengths, less where it is crowded)
//   z0, dz, nl  the legs: nl pairs at z0, z0 - dz, ..., straight out to the sides (the shaders find the pair of a
//               vertex by its z); xf how far out a foot stands (the trilobite's: TXF below)
//   lam, be, lf, wave  a step: how far the walker gets with one, the share of it a foot is on the ground, how high a
//               foot is lifted, how far each pair is ahead of the pair in front of it (a share of a step)
//   rp     a turn on the spot counts as this much way for every radian: the steps that turn the walker
//   v0, v1 how fast it walks on average, in lengths a second: v0 + v1 * (0 to 1, from its seed)
//   hc, hh where its middle is over the ground, and how far it reaches up and down from there
//   rb, ra how far its body and legs reach from its middle, and with feelers or tentacles; rf: its feet
//   kd     its own part of how near the viewer may come before it gives way (dodge in swimmers.js)
//   line, rad  its zoo place: a line along it, this much ahead and behind its middle, and its radius
// (Hallucigenia: its body ends with its last pair of legs, see meshHallu, so that pair stands 0.45 behind its middle)
const HW = { l0: 0.012, l1: 0.05, lp: 0.7, c0: 0.5, c1: 2.2, z0: 0.12, dz: 0.095, nl: 7, xf: 0.082, lam: 0.1, be: 0.65, lf: 0.035, wave: 0.13, rp: 0.5, v0: 0.05, v1: 0.03, hc: 0.11, hh: 0.2, rb: 0.52, ra: 0.52, rf: 0.42, kd: 0.9, line: 0.45, rad: 0.1 };
//   hb     (the trilobite) how high the lower edge of the rim of its shield is over the ground when it walks
//   sink, dig, hd  how deep one that lies half dug in is sunk, what share of them do, and how high the middle of its
//               zoo place is over the ground (on what of its shield shows)
const TW = { l0: 0.04, l1: 0.09, lp: 0.6, c0: 0.3, c1: 1.2, z0: 0.3, dz: 0.052, nl: 15, lam: 0.085, be: 0.625, lf: 0.03, wave: 0.125, rp: 0.5, v0: 0.16, v1: 0.14, hc: 0.13, hh: 0.14, rb: 0.62, ra: 1.3, rf: 0.47, kd: 0.9, line: 0.4, rad: 0.3, hb: 0.07, sink: 0.095, dig: 0.12, hd: 0.1 };
// The trilobite in the round. Every fossil of it in the Burgess Shale is pressed flat, so its heights come from the
// restorations that Whittington drew after relatives kept in the round (Fossils and Strata 4, 1975; Palaeontology 23,
// 1980), its outline from his drawings and from the specimen USNM 65510 (Royal Ontario Museum). In lengths of the body:
// 0.75 wide across the head; head, thorax and tail piece 33 : 38 : 29; the head shield 0.18 high from the lower edge
// of its rim to the top of the glabella, which stands 0.1 over the furrows beside it; the cheeks fall about 20 degrees
// to the rim; the axis of the thorax 0.23 wide in front and 0.15 behind, its crest 0.08 over its furrows; the side
// lobes one gentle arch that steepens to the tips, 0.14 from tip to crest; the rim a rolled tube 0.02 thick; the lower
// edge of the rim 0.07 over the ground when it walks (0.05 to 0.08 in his drawings). How far the eyes stand up is not known (a low crescent in every
// source): here 0.015 over the cheek, so that they are seen at all.
// The shield is in three parts (part 0 the head shield, 1 the thorax, 2 the tail piece). The head shield is half an
// ellipse from TR_C to the front (TR_HA wide to either side, TR_HL long), the tail piece one from TR_P to the rear
// (TR_TA, TR_TL); the thorax between them has seven segments. trW: how wide a part is at z (half of it, without rim
// and spines); trA: how wide its axis is (on the head shield the glabella, TR_AG at its widest); TR_RT: the radius of
// the rolled rim; TR_YF: how high the furrows beside the axis of the thorax are. fsTrilo has trW and trA too (for z
// alone): change one, change the other
const TR_C = 0.17, TR_P = -0.21, TR_SEG = (TR_C - TR_P) / 7, TR_HA = 0.375, TR_HL = 0.33, TR_TA = 0.265, TR_TL = 0.29, TR_RT = 0.011, TR_AG = 0.115, TR_YF = TW.hb + 0.06;
const trW = (z, part) => part === 0 ? TR_HA * sqrt(max(1 - ((z - TR_C) / TR_HL) ** 2, 0)) : part === 1 ? 0.27 + 0.03 * (z - TR_P) / (TR_C - TR_P) : TR_TA * sqrt(max(1 - ((TR_P - z) / TR_TL) ** 2, 0));
const trA = (z, part) => part === 0 ? TR_AG * sqrt(max(1 - (max(z - 0.4, 0) / 0.068) ** 2, 0)) : part === 1 ? 0.075 + 0.04 * (z - TR_P) / (TR_C - TR_P) : (0.075 - 0.04 * min((TR_P - z) / 0.27, 1)) * sqrt(max(1 - (max((TR_P - z) / 0.27 - 0.85, 0) / 0.15) ** 2, 0));
// a bell of width 1, and how far a place (x, zr from the middle of a half ellipse a wide and b long) is inside its outline
const trG = (v) => exp(-v * v);
const trIn = (x, zr, a, b) => { const q = hypot(x / a, zr / b); return q < 1e-4 ? min(a, b) : max(1 - q, 0) * hypot(x, zr) / q; };
// How high the upper side of the head shield is at x, z. The cheeks rise from the rolled rim in a curve, with a shallow
// furrow just inside the rim, a low swell under each eye, and along their rear edge a low band with a furrow in front
// of it. Between them the glabella: a dome between two furrows, highest at its rear and round at its front, and
// behind it, across a furrow, the ring at the neck
const trHead = (x, z) => {
  const ax = abs(x), zr = z - TR_C, d = trIn(ax, zr, TR_HA, TR_HL), A = trA(z, 0);
  let y = TW.hb + TR_RT + 0.066 * pow(sin(PI / 2 * min(d / 0.19, 1)), 1.3) - 0.007 * trG((d - 0.03) / 0.016);
  y += 0.009 * trG((ax - 0.207) / 0.04) * trG((z - 0.3) / 0.045);
  y += sstep(TR_AG, TR_AG + 0.03, ax) * sstep(0, 0.04, d) * (0.006 * trG((zr - 0.008) / 0.008) - 0.005 * trG((zr - 0.027) / 0.01));
  if (ax < A) y += (0.08 + 0.02 * sstep(0.2, 0.26, z)) * (1 - 0.3 * max(z - 0.24, 0) / 0.22) * (A / TR_AG) * (1 - 0.45 * trG((z - 0.215) / 0.008)) * pow(1 - (ax / A) ** 2, 0.55);
  if (A > 0.02) y -= 0.005 * trG((ax - A - 0.004) / 0.009);
  return y;
};
// The thorax at x, z; v: 0 at the front of the segment there, 1 at its rear. Each segment is a low rib. The axis is a
// strong arch between two furrows; a side lobe is one gentle arch, nearly level beside the axis and steeper and
// steeper to its tip
const trThorax = (x, z, v) => {
  const ax = abs(x), W = trW(z, 1), A = trA(z, 1), s = clamp((ax - A) / (W - A), 0, 1), rib = 0.011 * pow(sin(PI * clamp(v, 0, 1)), 0.8);
  return TR_YF + rib * (1 - 0.5 * s) + (ax < A ? 0.07 * pow(1 - (ax / A) ** 2, 0.6) : -(W - A) * (-0.05 * s + 0.25 * s * s + 0.085 * s * s * s)) - 0.006 * trG((ax - A) / 0.008);
};
// The tail piece: its sides rise from the rim at about 20 degrees to the furrows beside the axis, which is ringed, lower
// than the axis of the thorax and falls to the rim at the rear: a dome
const trTail = (x, z) => {
  const ax = abs(x), tz = (TR_P - z) / 0.27, d = trIn(ax, TR_P - z, TR_TA, TR_TL), A = trA(z, 2);
  let y = TW.hb + 0.009 + 0.058 * pow(sin(PI / 2 * min(d / 0.16, 1)), 1.2) - 0.005 * trG((d - 0.026) / 0.014);
  if (ax < A) y += (0.062 - 0.036 * min(tz, 1)) * (0.87 + 0.13 * cos(TAU * 5.5 * tz)) * pow(1 - (ax / A) ** 2, 0.6);
  if (A > 0.015) y -= 0.005 * trG((ax - A - 0.003) / 0.008);
  return y;
};
// The legs: three pairs under the head, one under each segment, five under the tail piece (14 to 16 in the fossils,
// more in larger animals). TR_LK: how thick and long each is against the longest; TXF: how far out its foot stands, in
// mid-step under the tips of the spines of its segment
const TR_LK = [0.6, 0.78, 0.93, 1, 1, 1, 1, 1, 1, 0.97, 0.9, 0.8, 0.7, 0.6, 0.5];
const TXF = Array.from({ length: TW.nl }, (_, k) => k < 3 ? [0.2, 0.26, 0.305][k] : k < 10 ? trW(TW.z0 - k * TW.dz, 1) + 0.03 : [0.275, 0.24, 0.205, 0.17, 0.135][k - 10]);
// a number as WGSL takes it as a float
const wkNum = (v) => { const s = String(+v.toFixed(6)); return /[.e]/.test(s) ? s : s + '.'; };

// ---------------------------------------------------------------- meshes
// Hallucigenia sparsa, in the round: a soft tube of a body on seven pairs of legs, with seven pairs of long spines on
// its back, three pairs of thin tentacles under a long neck, and a small head held low. Every fossil of it is pressed
// flat and seen from the side. It was a lobopodian, a relative of the velvet worms, whose bodies and legs are soft
// tubes: so its sections are round here. What the sources say:
//   Smith and Caron, Nature 523 (2015), as the University of Cambridge tells it (zoo.js) and National Geographic
//   (https://www.nationalgeographic.com/science/article/scientists-finally-decide-which-bit-of-this-weird-animal-is-the-head):
//   an elongated head with a pair of simple eyes above a mouth with a ring of teeth; behind it ten pairs of limbs, the
//   first three slender and without claws (the tentacles), the last seven legs with claws and without joints; the
//   body ends with a pair of legs.
//   Royal Ontario Museum, Burgess Shale gallery (https://burgess-shale.rom.on.ca/fossils/hallucigenia-sparsa/): a
//   small, slightly swollen head at the end of a long neck, the eyes on its upper side, the mouth at its tip, a ring
//   of many small plates round its opening; the first pair of spines over the last pair of tentacles, one pair over
//   each of the first six pairs of legs, none over the last pair; the spines stand in sheaths of skin; each leg ends
//   in a pair of claws.
//   Wikipedia, "Hallucigenia" (https://en.wikipedia.org/wiki/Hallucigenia): the spines rigid cones; the trunk of this
//   species shows no rings; one end often droops as if to reach the ground.
// Estimates, which no source gives: how thick the trunk is (a sixteenth of its length), how long legs and spines are
// against it, how far the spines lean out and back, how high their sheaths reach, how large eyes and mouth are.
// The body is one unit long from its rear end to its mouth, as far along its middle line (the neck curves down).
// hlY: how high its middle line is at z; hlR: how thick it is there (half of it): round at the blunt rear end just
// behind the last legs, thinning from the first spines on into the neck, swollen at the head, narrower at the mouth.
// fsHallu has hlY and hlR too: change one, change the other. HL_ZN, HL_WN: where the neck begins to bend and how long
// that part is
const HL_YA = 0.112, HL_ZN = 0.235, HL_WN = 0.2;
const hlY = (z) => HL_YA - 0.066 * clamp((z - 0.2) / 0.3, 0, 1) ** 2 - 0.012 * sstep(0.38, 0.5, -z);
const hlR = (z) => (0.034 - 0.019 * sstep(0.14, 0.32, z) + 0.01 * exp(-(((z - 0.447) / 0.04) ** 2))) * sqrt(max(1 - (max(-0.455 - z, 0) / 0.047) ** 2, 0)) * (1 - 0.4 * sstep(0.478, 0.502, z));
// The point of its surface at z, the angle a round from its right side over its back (k: this share of the way out
// from the middle line). A section stands across the middle line; the head is a little wider than high
const hlAt = (z, a, k = 1) => {
  const z1 = min(z + 0.002, 0.5), dy = (hlY(z1) - hlY(z1 - 0.004)) / 0.004, tl = hypot(1, dy), r = hlR(z) * k, rv = r * (1 - 0.1 * exp(-(((z - 0.447) / 0.04) ** 2))) * sin(a) / tl;
  return [cos(a) * r, hlY(z) + rv, z - rv * dy];
};
// the middle of the right eye, the middle of the mouth and the way the mouth looks: forward and down
const HL_EYE = hlAt(0.44, 1.08, 0.88), HL_MC = [0, hlY(0.499), 0.499];
const HL_MT = (() => { const dy = (hlY(0.499) - hlY(0.495)) / 0.004, l = hypot(1, dy); return [0, dy / l, 1 / l]; })();
// aux: 0 on the body, .008 to .5 down a leg (how much of the way of its foot a place on it goes along), .51 on the
// claws, .6 to 1 along a tentacle, -.12 to -.28 up the sheath of a spine, -.4 to -.7 up a spine, -.8 on the mouth, -1
// on the eyes
function meshHallu() {
  const m = new Mesh(), H = HW, M = 14;
  // ---- the body: rings round its middle line, from the rear end to the mouth
  const zs = [-0.499, -0.495, -0.487, -0.474, -0.455];
  for (let z = -0.43; z < 0.135; z += 0.04) zs.push(z);
  zs.push(0.165, 0.2, 0.235, 0.265, 0.295, 0.32, 0.345, 0.37, 0.39, 0.408, 0.424, 0.438, 0.452, 0.465, 0.476, 0.485, 0.492, 0.499);
  const rings = zs.map((z) => Array.from({ length: M }, (_, s) => m.v(...hlAt(z, s / M * TAU), 0)));
  for (let j = 0; j < rings.length - 1; j++) for (let s = 0; s < M; s++) { const s2 = (s + 1) % M; m.quad(rings[j][s], rings[j][s2], rings[j + 1][s2], rings[j + 1][s]); }
  const e0 = m.v(0, hlY(-0.5), -0.502, 0);
  for (let s = 0; s < M; s++) m.tri(rings[0][(s + 1) % M], rings[0][s], e0);
  // ---- the mouth at its tip: a lip all round (fsHallu draws the ring of plates on it) and the throat inside it
  const [, ty, tz] = HL_MT, lip = [];
  for (let s = 0; s < M; s++) {
    const a = s / M * TAU, ring = [];
    for (let b = 0; b < 4; b++) { const e = (b + 0.5) / 4 * TAU, r = 0.0088 + 0.0032 * cos(e), f = 0.0035 + 0.0032 * sin(e), v = 0.9 * r * sin(a); ring.push(m.v(r * cos(a), HL_MC[1] + v * tz + f * ty, HL_MC[2] - v * ty + f * tz, -0.8)); }
    lip.push(ring);
  }
  const th = m.v(0, HL_MC[1] - 0.012 * ty, HL_MC[2] - 0.012 * tz, -0.8);
  for (let s = 0; s < M; s++) { const s2 = (s + 1) % M; for (let b = 0; b < 4; b++) m.quad(lip[s][b], lip[s2][b], lip[s2][(b + 1) % 4], lip[s][(b + 1) % 4]); m.tri(lip[s][1], lip[s2][1], th); }
  // (how long a spine is against the longest, how thick a leg is, and how far its root is ahead of its foot)
  const SK = [0.8, 0.94, 1, 1, 1, 0.93, 0.82], LK = [0.9, 1, 1.05, 1.05, 1, 0.96, 0.9], LEAN = [-0.01, -0.005, 0, 0, 0, 0, -0.004];
  // a leg, in the plane of its z: [how far out (of the way to its foot), how high, how thick, how much of the way of
  // its foot it goes along]. A soft tube without joints: out of the side of the body below its middle, in an arch
  // out and down to its foot
  const LEG = [[0.17, 0.1, 0.02, 0], [0.36, 0.091, 0.019, 0.02], [0.58, 0.08, 0.017, 0.1], [0.8, 0.065, 0.015, 0.25], [0.96, 0.046, 0.013, 0.45], [1.03, 0.028, 0.0115, 0.7], [1.02, 0.014, 0.0103, 0.9], [1, 0.007, 0.008, 1]];
  for (const sx of [-1, 1]) {
    // the eye: a low dome on the upper side of the head
    ball(m, [sx * HL_EYE[0], HL_EYE[1], HL_EYE[2]], 0.0062, -1, 8, 4);
    for (let k = 0; k < 7; k++) {
      // ---- a spine: the first pair over the last pair of tentacles, then one pair over each pair of legs but the
      // last. From inside the body up, out and back, curved back a little towards its tip; no two quite alike
      const z = H.z0 + H.dz * (1 - k), B = hlAt(z, PI / 2 - sx * 0.42, 0.5), q = 0.18 * SK[k] * (1 + 0.035 * sin(k * 1.9 + sx));
      const D = [sx * (0.34 + 0.05 * sin(k * 2.3 + 2 * sx)), 1, -0.2 - 0.04 * cos(k * 1.3 + sx)], dl = hypot(...D);
      const at = (s, bend) => [B[0] + (D[0] / dl * s + sx * 0.012 * bend) * q, B[1] + D[1] / dl * s * q, B[2] + (D[2] / dl * s - 0.11 * bend) * q];
      m.tube(curve([at(0, 0), at(0.33, 0.1), at(0.67, 0.42), at(1, 1)], 6), (j) => 0.012 * pow(1 - j / 6.3, 0.85), 6, true, (j) => -0.4 - 0.3 * j / 6);
      // its sheath: a collar of the body's skin round its foot, wide where it grows out of the back, with a rim that
      // lies against the spine
      m.tube([0.03, 0.1, 0.18, 0.25, 0.3].map((s) => at(s, 0)), (j) => [0.029, 0.023, 0.017, 0.013, 0.008][j], 6, false, (j) => -0.12 - 0.04 * j);
    }
    for (let k = 0; k < H.nl; k++) {
      // ---- a leg, each bowed a little more or less than the next, and at its end two claws, curved forward and down
      const z = H.z0 - k * H.dz, f = H.xf, bow = 0.38 * sin(k * 2.4 + sx * 1.3);
      m.tube(LEG.map(([u, y, , w]) => [sx * f * u * (1 + bow * w * (1 - w)), y, z + LEAN[k] * (1 - w)]), (j) => LEG[j][2] * LK[k], 6, true, (j) => 0.008 + 0.49 * LEG[j][3]);
      for (const e of [-1, 1]) m.tube([[sx * f + e * 0.004, 0.008, z + 0.002], [sx * f + e * 0.0062, 0.004, z + 0.015], [sx * f + e * 0.007, 0.0006, z + 0.027], [sx * f + e * 0.006, -0.001, z + 0.034]], (j) => [0.0042, 0.003, 0.0014, 0.0003][j], 4, true, () => 0.515);
    }
    // ---- the tentacles: the last pair under the first spines, two pairs on the neck in front of it. Thin, out of the
    // under side, down and forward, their tips just over the ground
    for (let k = 0; k < 3; k++) {
      const z = [H.z0 + H.dz, 0.285, 0.345][k], R = hlAt(z, -PI / 2 + sx * 0.52, 0.6), yt = 0.013, xt = sx * (0.034 - 0.003 * k);
      m.tube(curve([R, [R[0] + sx * 0.01, mix(R[1], yt, 0.42), z + 0.004], [mix(R[0], xt, 0.8), mix(R[1], yt, 0.8), z + 0.02], [xt, yt, z + 0.05]], 8), (j) => 0.0055 - 0.0035 * j / 8, 5, true, (j) => 0.6 + 0.4 * j / 8);
    }
  }
  return m;
}
// Olenoides serratus, in the round (the figures: see TW and what follows it).
// The head shield: a vaulted half moon with the glabella as a dome in its middle, the ring at the neck behind it, a
// rolled rim all round that runs out into a long spine at each rear corner, and on each cheek an eye: a dark lens
// under a raised crescent lid, with a thin ridge from the front of the glabella to it.
// The thorax: seven segments, each a piece of its own that lies over the next like a roof tile: its front edge tucked
// under the piece in front, its rear edge a lip. Each has the arch of the axis with a small knob on it, a side lobe
// to either side that ends in a rolled edge, and there a round spine like a thorn that sweeps back.
// The tail piece: a dome with the ringed axis, a rolled rim, and five pairs of spines that point back.
// Under it: the body along the middle, the plate under the mouth, fifteen pairs of jointed legs, each from the body out
// under the shield, over a knee and down to its foot, most with a flat gill above it that trails back, two long
// feelers in front and two behind.
// All that is shell is drawn from both sides: from below its inside is seen (the fragment shader gives it another
// colour). Its upper side is the outer side of its triangles.
// aux: 0 on the upper side of the shield, -.2 on rim and spines, -.4 on body and mouth plate, -.6 on the gills, -.8 on
// what is raised on the shield (the knobs of the axis, the lids of the eyes and the ridges to them), -1 on the lenses
// of the eyes, .008 to .5 down a leg, .6 to 1 along a feeler
function meshTrilo() {
  const m = new Mesh(), hb = TW.hb, ry = hb + TR_RT, S = TR_SEG;
  // (sheet() of swimmers.js: rows of points, each from -x to +x, joined into a surface whose outer side is up)
  const join = (rows, flip) => sheet(m, rows, flip);
  // a row across the head shield or the tail piece at z: over the axis (at AX of its width) and over both sides out to
  // the outline (at T of the way). h: its height; dy: this much lower; zAt: with the shape it has at this z
  const row = (z, part, h, AX, T, dy = 0, zAt = z) => {
    const W = trW(zAt, part), A = clamp(trA(zAt, part), 0.3 * W, 0.8 * W), xs = [];
    for (let c = T.length - 1; c >= 0; c--) xs.push(-(A + (W - A) * T[c]));
    for (const c of AX) xs.push(A * c);
    for (const t of T) xs.push(A + (W - A) * t);
    return xs.map((x) => m.v(x, h(x, zAt) + dy, z, 0));
  };
  // ---- the head shield: a lip down its rear edge, then row by row to the front
  const HAX = [-1, -0.9, -0.72, -0.48, -0.24, 0, 0.24, 0.48, 0.72, 0.9, 1], HT = [0.07, 0.16, 0.28, 0.42, 0.56, 0.69, 0.8, 0.89, 0.96, 1];
  join([row(TR_C + 0.004, 0, trHead, HAX, HT, -0.03, TR_C)].concat([0.17, 0.178, 0.188, 0.198, 0.207, 0.215, 0.223, 0.235, 0.255, 0.28, 0.305, 0.33, 0.355, 0.38, 0.402, 0.422, 0.44, 0.454, 0.465, 0.474, 0.482, 0.489, 0.495, 0.5].map((z) => row(z, 0, trHead, HAX, HT))));
  // its rolled rim, from the tip of one spine at a rear corner round the front to the tip of the other
  {
    const P = [], R = [], gen = [[TR_HA - 0.012, ry - 0.01, TR_C - 0.16, 0.0012], [TR_HA - 0.008, ry - 0.007, TR_C - 0.12, 0.0045], [TR_HA - 0.004, ry - 0.004, TR_C - 0.075, 0.0078], [TR_HA - 0.002, ry - 0.001, TR_C - 0.03, 0.0105], [TR_HA, ry, TR_C - 0.004, 0.0122]];
    for (const [x, y, z, r] of gen) { P.push([-x, y, z]); R.push(r); }
    for (let j = 0; j <= 30; j++) { const a = (j / 30 - 0.5) * PI; P.push([TR_HA * sin(a), ry, TR_C + TR_HL * cos(a)]); R.push(TR_RT + (abs(a) > 1.4 ? 0.0012 : 0)); }
    for (const [x, y, z, r] of gen.slice().reverse()) { P.push([x, y, z]); R.push(r); }
    m.tube(P, (j) => R[j], 6, true, () => -0.2);
  }
  for (const sx of [-1, 1]) {
    // an eye: the lens, a crescent lid over it that is bowed outwards, and the ridge from the glabella to the lid
    ball(m, [sx * 0.223, trHead(0.223, 0.3) + 0.0025, 0.3], [0.012, 0.0125, 0.027], -1, 8, 4);
    m.tube(curve([[0.203, 0.327], [0.214, 0.315], [0.219, 0.3], [0.214, 0.285], [0.203, 0.273]].map(([x, z]) => [sx * x, trHead(x, z) + 0.006, z]), 6), (j) => 0.0078 * (0.55 + 0.45 * sin(PI * j / 6)), 5, true, () => -0.8);
    m.tube(curve([[0.1, 0.405], [0.14, 0.385], [0.178, 0.355], [0.203, 0.327]].map(([x, z]) => [sx * x, trHead(x, z) - 0.0042, z]), 5), () => 0.007, 5, true, () => -0.8);
  }
  ball(m, [0, trHead(0, 0.19) - 0.0015, 0.19], [0.011, 0.0055, 0.0095], -0.8, 6, 3);
  // ---- the thorax: seven tiles. The rows of one, from the front to the rear: [z, v, this much lower, with the shape at]
  for (let k = 0; k < 7; k++) {
    const zf = TR_C - k * S, zr = zf - S, zc = zf - 0.5 * S;
    join([[zf + 0.012, 0, -0.02, zf], [zf - 0.03 * S, 0.03, -0.008], [zf - 0.2 * S, 0.2, 0], [zf - 0.45 * S, 0.45, 0], [zf - 0.72 * S, 0.72, 0], [zf - 0.93 * S, 0.93, 0], [zr - 0.001, 1, 0.001, zr], [zr + 0.002, 1, -0.013, zr]].map(([z, v, dy, zAt = z]) => {
      const W = trW(zAt, 1), A = trA(zAt, 1), h = (x) => trThorax(x, zAt, v) + dy, yt = h(W);
      // (a side lobe from the axis out to its tip, and round its rolled edge to its under side)
      const lobe = [0.12, 0.28, 0.46, 0.64, 0.8, 0.92, 1].map((s) => { const x = A + (W - A) * s; return [x, h(x)]; }).concat([[W + 0.004, yt - 0.008], [W - 0.004, yt - 0.016], [W - 0.02, yt - 0.015]]);
      const axis = [-1, -0.86, -0.6, -0.25, 0.25, 0.6, 0.86, 1].map((c) => [A * c, h(A * c)]);
      return lobe.map(([x, y]) => [-x, y]).reverse().concat(axis, lobe).map(([x, y]) => m.v(x, y, z, 0));
    }), true);
    const W = trW(zc, 1), yt = trThorax(W, zc, 0.5) - 0.004;
    for (const sx of [-1, 1]) m.tube(curve([[W - 0.022, yt, zc + 0.004], [W + 0.012, yt - 0.002, zc - 0.022], [W + 0.032, yt - 0.006, zc - 0.07], [W + 0.045, yt - 0.012, zc - 0.125]].map(([x, y, z]) => [sx * x, y, z]), 5), (j) => 0.0125 * (1 - j / 5.6), 5, true, () => -0.2);
    ball(m, [0, trThorax(0, zf - 0.8 * S, 0.8) - 0.0015, zf - 0.8 * S], [0.011, 0.0055, 0.0095], -0.8, 6, 3);
  }
  // ---- the tail piece: its front edge tucked under the last tile, then row by row to the rear
  const TAX = [-1, -0.8, -0.45, 0, 0.45, 0.8, 1], TT = [0.1, 0.24, 0.4, 0.56, 0.72, 0.86, 0.95, 1];
  join([row(TR_P + 0.012, 2, trTail, TAX, TT, -0.024, TR_P), row(TR_P - 0.002, 2, trTail, TAX, TT, -0.012, TR_P)].concat([-0.228, -0.25, -0.275, -0.3, -0.325, -0.35, -0.375, -0.4, -0.422, -0.442, -0.458, -0.471, -0.481, -0.489, -0.495, -0.5].map((z) => row(z, 2, trTail, TAX, TT))), true);
  {
    const P = [], yr = hb + 0.009;
    for (let j = 0; j <= 22; j++) { const a = (j / 22 - 0.5) * PI; P.push([TR_TA * sin(a), yr, TR_P - TR_TL * cos(a)]); }
    m.tube(P, (j) => 0.0095 * (0.6 + 0.4 * sstep(0, 3, min(j, 22 - j))), 6, true, () => -0.2);
    // five pairs of spines on it: each a little out from the rim and then straight back, shorter towards the rear
    for (let j = 0; j < 5; j++) for (const sx of [-1, 1]) {
      const a = [78, 60, 43, 27, 11][j] * PI / 180, len = [0.14, 0.11, 0.09, 0.06, 0.06][j], x = TR_TA * sin(a), z = TR_P - TR_TL * cos(a), ox = sin(a), oz = -cos(a);
      m.tube(curve([[x - 0.008 * ox, yr, z - 0.008 * oz], [x + 0.012 * ox, yr - 0.002, z + 0.012 * oz - 0.3 * len], [x + 0.016 * ox, yr - 0.007, z + 0.012 * oz - 0.65 * len], [x + 0.014 * ox, yr - 0.012, z + 0.012 * oz - len]].map(([px, y, pz]) => [sx * px, y, pz]), 5), (q) => 0.0115 * (1 - q / 5.6), 5, true, () => -0.2);
    }
  }
  for (let j = 1; j < 5; j++) { const z = TR_P - 0.27 * j / 5.5; ball(m, [0, trTail(0, z) - 0.0015, z], [0.009, 0.0048, 0.008], -0.8, 6, 3); }
  // ---- under the shield: the plate under the mouth and the body along the middle
  ball(m, [0, hb + 0.034, 0.37], [0.062, 0.022, 0.085], -0.4, 8, 4);
  loft(m, [[-0.46, 0.015, 0.012, hb + 0.045], [-0.4, 0.045, 0.028, hb + 0.05], [-0.22, 0.07, 0.04, hb + 0.062], [0.1, 0.09, 0.045, hb + 0.066], [0.3, 0.085, 0.042, hb + 0.064], [0.4, 0.05, 0.026, hb + 0.055]], 2, 8, -0.4);
  // the legs, each in the plane of its z: a thick first piece from the body out, then an arch up and over a knee down to
  // the foot (aux: how much of the way of its foot a place on it goes along). Over all but the first two a gill: a flat
  // lobe close under the shield that trails back
  const LEG = [[0.1, hb + 0.022, 0.017, 0], [0.25, hb + 0.018, 0.018, 0.03], [0.41, hb + 0.021, 0.0145, 0.1], [0.6, hb + 0.026, 0.0102, 0.25], [0.77, hb + 0.016, 0.0128, 0.45], [0.9, hb - 0.014, 0.009, 0.7], [0.97, 0.03, 0.0078, 0.88], [1, 0.004, 0.0042, 1]];
  const GILL = [[0.37, hb + 0.04, 0.006, 0.011], [0.55, hb + 0.036, 0.02, 0.019], [0.72, hb + 0.022, 0.036, 0.017], [0.84, hb + 0.008, 0.05, 0.006]];
  for (let k = 0; k < TW.nl; k++) for (const sx of [-1, 1]) {
    // (no two legs quite alike: each foot a little further out or in, those in front set forward, those behind back)
    const z = TW.z0 - k * TW.dz, f = TXF[k] * (1 + 0.035 * sin(k * 2.4 + sx)), q = 0.7 + 0.3 * TR_LK[k], fore = 0.018 * (1 - k / 7);
    m.tube(LEG.map(([u, y, , w]) => [sx * u * f, y, z + fore * w]), (j) => LEG[j][2] * q, 4, true, (j) => 0.008 + 0.49 * LEG[j][3]);
    if (k < 2) continue;
    const rings = GILL.map(([u, y, back, wide]) => { const x = sx * u * f, zz = z - back * q, w = wide * q; return [m.v(x, y + 0.0035, zz, -0.6), m.v(x, y, zz + w, -0.6), m.v(x, y - 0.0035, zz, -0.6), m.v(x, y, zz - w, -0.6)]; });
    for (let j = 0; j < rings.length - 1; j++) for (let e = 0; e < 4; e++) m.quad(rings[j][e], rings[j][(e + 1) % 4], rings[j + 1][(e + 1) % 4], rings[j + 1][e]);
    m.quad(...rings[0]); m.quad(...rings[rings.length - 1]);
  }
  for (const sx of [-1, 1]) {
    // a feeler in front: from beside the mouth plate forward under the rim and out, its tip lifted; one behind: from
    // under the rear of the tail piece back under its rim and out, low over the mud. Each three quarters as long as the body
    m.tube(curve([[0.045, hb + 0.018, 0.4], [0.058, hb - 0.014, 0.49], [0.075, hb - 0.014, 0.57], [0.12, hb + 0.006, 0.72], [0.19, hb + 0.04, 0.9], [0.27, hb + 0.075, 1.06], [0.33, hb + 0.11, 1.2]].map(([x, y, z]) => [sx * x, y, z]), 14), (j) => 0.006 - 0.0045 * j / 14, 4, true, (j) => 0.6 + 0.4 * j / 14);
    m.tube(curve([[0.02, hb + 0.012, -0.41], [0.028, hb - 0.016, -0.49], [0.04, hb - 0.018, -0.57], [0.07, hb - 0.03, -0.72], [0.12, hb - 0.038, -0.9], [0.18, hb - 0.04, -1.06], [0.23, hb - 0.036, -1.18]].map(([x, y, z]) => [sx * x, y, z]), 12), (j) => 0.0056 - 0.0042 * j / 12, 4, true, (j) => 0.6 + 0.4 * j / 12);
  }
  return m;
}

// ---------------------------------------------------------------- shaders
// What both walkers share comes with the first of them. They light their skin with skin() and give way to the viewer
// with dodge() of S_SEA (swimmers.js).
const S_WALK = /*wgsl*/`
// Instance: a = the middle of its round, on the ground (x, y, z), and how far the corners of the round are from that
// middle (w; the sign says which way round it goes, 0 that it stays where it is), b = how much the ground rises along
// x and along z, its length, how many corners its round has (2 to 5) plus a seed (the fraction).
// A walker is worked out in lengths of its body, in the plane of its ground (wkFrame: e1 and e2 along it, N up from
// it). wkOf, wkS and wkPose are repeated in wkAt in walkers.js: change one, change the other
struct WK { rc: f32, A: f32, dir: f32, b0: f32, Lp: f32, Ls: f32 };
fn wkOf(a: vec4f, b: vec4f, rp: f32) -> WK {
  var w: WK; w.rc = abs(a.w) / b.z; w.dir = sign(a.w); w.A = TAU / floor(b.w); w.b0 = fract(b.w) * 37.7;
  // a turn on the spot counts as rp of the way for each radian, a side of the round is 2 rc sin(A / 2) long
  w.Lp = rp * w.A; w.Ls = w.Lp + 2. * w.rc * sin(.5 * w.A);
  return w;
}
// how far it has walked at the time t: one side of its round in a while its speed v (lengths a second on average)
// gives, standing still at each corner and fastest halfway
fn wkS(t: f32, w: WK, sd: f32, v: f32) -> f32 {
  let u = t * v * TAU / w.Ls + sd * 53.1;
  return abs(w.dir) * w.Ls * (u - 1.3333333 * sin(u) + .16666667 * sin(2. * u)) / TAU;
}
// where it is after it has walked s (from the middle of its round, along e1 and e2) and the angle it heads in. A side
// begins with the turn at its corner
fn wkPose(s: f32, w: WK) -> vec3f {
  let k = floor(s / w.Ls); let r = s - k * w.Ls;
  let ak = w.b0 + k * w.A * w.dir; let h = ak + w.dir * (1.5707963 + .5 * w.A); let q = sat(r / w.Lp);
  return vec3f(w.rc * vec2f(cos(ak), sin(ak)) + vec2f(cos(h), sin(h)) * max(r - w.Lp, 0.), h - w.dir * w.A * (1. - q * q * (3. - 2. * q)));
}
// the angle it heads in after it has walked s, alone (as in wkPose)
fn wkHead(s: f32, w: WK) -> f32 {
  let k = floor(s / w.Ls); let q = sat((s - k * w.Ls) / w.Lp);
  return w.b0 + k * w.A * w.dir + w.dir * (1.5707963 + .5 * w.A) - w.dir * w.A * (1. - q * q * (3. - 2. * q));
}
// a point f of the body (x across, z ahead) as it is when the walker stands at B, seen from the walker at A
fn wkTo(A: vec3f, B: vec3f, f: vec2f) -> vec2f {
  let q = B.xy + f.x * vec2f(sin(B.z), -cos(B.z)) + f.y * vec2f(cos(B.z), sin(B.z)) - A.xy;
  return vec2f(dot(q, vec2f(sin(A.z), -cos(A.z))), dot(q, vec2f(cos(A.z), sin(A.z))));
}
// Where a foot is (in the body's frame: x, height, z) when the walker has walked s and stands at P. f: where it is at
// rest, ph: how far it is ahead in its step. On the ground it stays where it was set down: where its place at rest is
// in the middle of that time on the ground. Lifted, it swings from where it left the ground to where it will be set
// down. lam, be, lf: a step (HW and TW in walkers.js)
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
// a point l of the body (x across, y up, z ahead, in lengths) in the world, when it stands at P
fn wkWorld(a: vec4f, L: f32, fr: WF, P: vec3f, l: vec3f) -> vec3f {
  return a.xyz + L * (fr.e1 * (P.x + l.x * sin(P.z) + l.z * cos(P.z)) + fr.e2 * (P.y - l.x * cos(P.z) + l.z * sin(P.z)) + fr.N * l.y);
}
fn wkDir(fr: WF, P: vec3f, n: vec3f) -> vec3f { return (fr.e1 * sin(P.z) - fr.e2 * cos(P.z)) * n.x + fr.N * n.y + (fr.e1 * cos(P.z) + fr.e2 * sin(P.z)) * n.z; }
// how far all of it moves to give way to the viewer: dodge of S_SEA for its middle c, along the plane of its ground.
// r: its own part of how near the viewer may come, h: how far it reaches up and down from c
fn wkGive(c: vec3f, r: f32, h: f32, b: vec4f) -> vec3f {
  var d = dodge(c, r + 2. * g.fwd.w, 1., h) - c;
  d.y = b.x * d.x + b.y * d.z;
  return d;
}
`;
const S_HALLU = /*wgsl*/`
const HL_Z0 = ${wkNum(HW.z0)}; const HL_DZ = ${wkNum(HW.dz)}; const HL_NL = ${wkNum(HW.nl - 1)}; const HL_XF = ${wkNum(HW.xf)};
const HL_LAM = ${wkNum(HW.lam)}; const HL_BE = ${wkNum(HW.be)}; const HL_LF = ${wkNum(HW.lf)}; const HL_WAVE = ${wkNum(HW.wave)};
const HL_RP = ${wkNum(HW.rp)}; const HL_V0 = ${wkNum(HW.v0)}; const HL_V1 = ${wkNum(HW.v1)}; const HL_HC = ${wkNum(HW.hc)}; const HL_HH = ${wkNum(HW.hh)}; const HL_KD = ${wkNum(HW.kd)};
const HL_YA = ${wkNum(HL_YA)}; const HL_ZN = ${wkNum(HL_ZN)}; const HL_WN = ${wkNum(HL_WN)};
const HL_EYE = vec3f(${HL_EYE.map(wkNum).join(', ')}); const HL_MC = vec3f(${HL_MC.map(wkNum).join(', ')}); const HL_MT = vec3f(${HL_MT.map(wkNum).join(', ')});
// How it bends. HL_BEND: a place along the body heads the way the walker will head (in front of its middle) or did
// head (behind it) when it has walked on by this share of the way between them: in a turn the head goes first and
// the rear end follows. HL_SW: how far the trunk sways to either side with the steps of its legs. HL_PIV: the height
// about which the neck bends up and down
const HL_BEND = .12; const HL_SW = .01; const HL_PIV = .11;
fn hlG(v: f32) -> f32 { return exp(-v * v); }
fn hlY(z: f32) -> f32 { let u = sat((z - .2) / .3); return HL_YA - .066 * u * u - .012 * ss(.38, .5, -z); }
fn hlR(z: f32) -> f32 {
  return (.034 - .019 * ss(.14, .32, z) + .01 * hlG((z - .447) / .04)) * sqrt(max(1. - pow(max(-.455 - z, 0.) / .047, 2.), 0.)) * (1. - .4 * ss(.478, .502, z));
}
@vertex fn vsHallu(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let L = i.b.z; let sd = fract(i.b.w); let au = i.n.w;
  let w = wkOf(i.a, i.b, HL_RP); let s = wkS(t, w, sd, HL_V0 + HL_V1 * fract(sd * 7.3)); let P = wkPose(s, w);
  var l = i.p; let sg = select(-1., 1., l.x > 0.);
  // The tentacles feel about (aux .6 to 1, out along one): each sweeps forward and back and in and out and lifts its
  // tip, in waves that run out along it
  let tn = sat((au - .6) / .4) * step(.55, au); let tp = sd * 40. + sg * 1.9 + l.z * 37.;
  l += vec3f(sg * .014 * sin(t * .8 + tp * 1.3 - tn * 2.), .011 * (.5 + .5 * sin(t * 1.1 + tp * .7 - tn * 3.)), .028 * sin(t * .9 + tp - tn * 2.5)) * tn * tn;
  // The legs step (aux up to .5: how much of the way of its foot a place on a leg goes along), the two of a pair in
  // turn, each pair a little after the one behind it. Too far away to be seen, they are left as they are
  let wl = sat((au - .008) / .49) * step(.004, au) * step(au, .52);
  var d = vec3f(0.);
  if (wl > 0. && distance(g.cam.xyz, i.a.xyz) < 12. + abs(i.a.w)) {
    let k = clamp(round((HL_Z0 - l.z) / HL_DZ), 0., HL_NL); let f = vec2f(sg * HL_XF, HL_Z0 - k * HL_DZ);
    d = wkFoot(s, P, f, k * HL_WAVE + .25 + .25 * sg, w, HL_LAM, HL_BE, HL_LF) - vec3f(f.x, 0., f.y);
  }
  // The body bends, each place along it (zc) about its own middle. The neck (nk: how much of its bend a place has,
  // ink: how far that has carried it) lifts and lowers the head, now and then down to the mud, and turns it this way
  // and that, and into a turn before the body follows (ya, pn). The trunk bends into a turn (dt) and sways with the
  // steps (HL_SW). xo: how far all that puts a place to the side
  let zc = clamp(l.z, -.5, .5); let ze = l.z - zc;
  let u = sat((zc - HL_ZN) / HL_WN); let nk = u * u * (3. - 2. * u); let ink = HL_WN * (u * u * u - .5 * u * u * u * u) + max(zc - HL_ZN - HL_WN, 0.);
  let ya = .2 * sin(t * .31 + sd * 9.) + .1 * sin(t * .83 + sd * 23.) + .6 * clamp(wkHead(s + .3, w) - P.z, -.7, .7);
  let pn = .02 + .1 * sin(t * .5 + sd * 20.) - .08 * ss(.6, 1., sin(t * .23 + sd * 50.));
  let dt = wkHead(s + HL_BEND * zc, w) - P.z; let da = dt + ya * nk; let pa = pn * nk;
  let xo = (HL_SW * sin(TAU * (s / HL_LAM + (HL_Z0 - zc) / HL_DZ * HL_WAVE)) + .006 * sin(t * 1.2 + sd * 15. + zc * 7.)) * (1. - nk) - .5 * dt * zc - ya * ink;
  let cp = cos(pa); let sp = sin(pa); let cy = cos(da); let sy = sin(da);
  let yr = l.y - HL_PIV; let z1 = ze * cp - yr * sp;
  var bd = vec3f(l.x * cy - z1 * sy + xo, HL_PIV + pn * ink + yr * cp + ze * sp, zc + l.x * sy + z1 * cy);
  // (neck, head and tentacles never go into the mud)
  bd.y = max(bd.y, .004 * (1. - step(.004, au) * step(au, .52)));
  // A leg goes with the body where it leaves it, and with its foot at its end: a foot on the ground stays there. It has
  // no joint: lifted, the whole leg bows outwards
  l = mix(bd, l, wl) + vec3f(d.x * wl + sg * .55 * d.y * sin(3.1415927 * wl), d.y * pow(wl, 2.5), d.z * wl);
  let n1 = vec3f(i.n.x, i.n.y * cp + i.n.z * sp, i.n.z * cp - i.n.y * sp); let n = vec3f(n1.x * cy - n1.z * sy, n1.y, n1.x * sy + n1.z * cy);
  let fr = wkFrame(i.b); let c = wkWorld(i.a, L, fr, P, vec3f(0., HL_HC, 0.));
  let wp = wkWorld(i.a, L, fr, P, l) + wkGive(c, HL_KD * L, HL_HH * L, i.b);
  // (the fragment shader needs the length too: it travels with the seed, as whole thousandths of a quarter millimetre)
  o.cp = g.vp * vec4f(wp, 1.); o.wp = wp; o.n = wkDir(fr, P, n); o.op = i.p; o.sd = floor(L * 4000.) + sd; o.lt = au;
  return o;
}
// The skin. Colours are free: no fossil shows them. Rose and violet: the back dark mauve, darkest in a saddle round
// each pair of spines, the sides rose, the under side pale; the legs pale where they leave the body and dark at their
// feet; spines and claws nearly black, hard and glossy against the soft body; each animal in its own tone. Its relief
// is free too (the fossils show a smooth trunk, no rings): soft, uneven wrinkles across body and legs and small
// papillae, as the skin of a velvet worm has them, and a fold of skin round the foot of each sheath and the root of
// each leg. It is dark in its folds, it shines like something wet, and what is thin lets the sun through
@fragment fn fsHallu(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let L = floor(i.sd) / 4000.; let sd = fract(i.sd); let lt = i.lt; let p = i.op; let ax = abs(p.x);
  let leg = step(.004, lt) * step(lt, .52); let claw = leg * step(.505, lt); let tent = step(.55, lt);
  let body = step(-.05, lt) * step(lt, .003); let sheath = step(-.3, lt) * step(lt, -.1); let spine = step(-.75, lt) * step(lt, -.35);
  let mouth = step(-.9, lt) * step(lt, -.76); let eye = step(lt, -.95);
  let limb = leg - claw + tent; let soft = body + sheath + limb;
  // where on the body: v from -1 on the under side to 1 on the back; the nearest pair of spines (zs: how far in
  // front of the place it is) and the nearest pair of legs (zl); how far up a sheath (sr) and up a spine (su)
  let ya = hlY(p.z); let ra = max(hlR(p.z), .004); let v = clamp((p.y - ya) / ra, -1., 1.);
  let ks = (HL_Z0 + HL_DZ - p.z) / HL_DZ; let zs = (fract(ks + .5) - .5) * HL_DZ; let onS = step(-.5, ks) * step(ks, 6.5);
  let kl = (HL_Z0 - p.z) / HL_DZ; let zl = (fract(kl + .5) - .5) * HL_DZ; let onL = step(-.5, kl) * step(kl, 6.5);
  let sr = sat((-lt - .12) / .16); let su = sat((-lt - .4) / .3);
  // the fold round the foot of each sheath and round the root of each leg
  let fS = hlG((length(vec2f(ax - .0125, zs - .004)) - .021) / .006) * onS * ss(.15, .55, v) * body;
  let fL = hlG((length(vec2f((v + .62) * ra, zl)) - .018) / .006) * onL * ss(.15, -.2, v) * body;
  // The relief (it fades where it would be finer than the pixels): wrinkles that run across the body and across a
  // limb (wr), papillae (pap), the folds, and on the spines a fine grain
  let fine = ss(.007, .002, fwidth(p.z) + fwidth(p.x) + fwidth(p.y));
  let q = mix(vec3f(p.x * 14., p.y * 14., p.z * 105.), vec3f(p.z * 18., (ax - p.y) * 9., lt * 48.), sat(limb));
  let wr = vn(q + sd * 31.) + .6 * vn(q * vec3f(1.7, 1.7, .6) + 7.3) - .8;
  let pap = ss(.5, .12, wor(p * 125. + sd * 17.));
  let grain = vn(vec3f(p.x, p.y * .5, p.z) * 90.) - .5;
  let lgr = sin(lt * 200.) * leg * ss(.05, .15, lt) * ss(.48, .4, lt);
  let ns = normalize(i.n) * select(-1., 1., ff);
  let n = skinRelief(ns, i.wp, ((.003 * wr + .004 * pap + .0015 * lgr) * (1. - .5 * tent) * soft - .005 * (fS + fL) + .001 * grain * spine) * fine * L);
  // (one in seven is a pale one, the large ones are darker)
  let tone = fract(sd * 13.7); let hue = fract(sd * 5.3); let lite = step(.86, fract(sd * 3.1));
  let cb = mix(vec3f(.24, .09, .34), vec3f(.38, .09, .24), hue);
  let cf = mix(vec3f(.64, .30, .62), vec3f(.82, .34, .48), hue);
  let cv = vec3f(.94, .76, .80);
  let mo = vn(p * vec3f(30., 30., 22.) + sd * 9.);
  // the body: pale below, rose on the sides, the back dark with a saddle at each pair of spines; the snout dark, and
  // a pale ring round each eye
  var alb = mix(cv, cf, ss(-.8, -.15, v));
  alb = mix(alb, cb, ss(-.1, .55, v) * (.4 + .6 * hlG(zs / .02) * onS));
  alb = mix(alb, cb, .5 * ss(.465, .5, p.z));
  alb = mix(alb, cv * .95, ss(.0135, .009, distance(vec3f(ax, p.y, p.z), HL_EYE)) * .7);
  // the sheaths: of the back's colour, paler to their rims; the legs: pale at the body, dark down to their feet; the
  // tentacles pale
  alb = mix(alb, mix(cb, cf, .15 + .45 * sr), sheath);
  alb = mix(alb, mix(mix(cf, cv, .4), cb, .8 * ss(.12, .5, lt)), leg);
  alb = mix(alb, mix(cv, cf, .3), tent);
  alb *= mix(1., (.75 + .5 * mo) * (1. + .3 * pap * fine) * mix(.72, 1.28, tone) * (1. + .4 * lite) * mix(1.1, .88, ss(.02, .045, L)), soft);
  // spines and claws: black-violet, a little paler towards the tip of a spine
  alb = mix(alb, mix(vec3f(.03, .016, .045), vec3f(.15, .07, .17), su * su) * (.85 + .3 * mo), spine);
  alb = mix(alb, vec3f(.045, .022, .05), claw);
  // the mouth: the dark throat, and round it the ring of small pale plates (ma: the angle round the mouth)
  let mv = p - HL_MC; let mr = length(mv - HL_MT * dot(mv, HL_MT)); let ma = atan2(mv.x, mv.y * HL_MT.z - mv.z * HL_MT.y);
  alb = mix(alb, mix(vec3f(.05, .015, .03), mix(vec3f(.3, .12, .2), vec3f(.95, .86, .78), ss(-.3, .4, cos(ma * 14.))), ss(.0055, .0075, mr)), mouth);
  alb = mix(alb, vec3f(.02, .012, .02), eye);
  // shade: in the folds and the wrinkles, under the body, where a leg, a tentacle or a sheath leaves the body, and at
  // the foot of a spine inside its sheath
  let sh = (1. - .55 * (fS + fL)) * (1. - .4 * body * ss(-.3, -1., v)) * (1. - .5 * leg * ss(.09, 0., lt)) * (1. - .5 * sheath * ss(.3, 0., sr))
    * (1. - .45 * spine * ss(.2, 0., su)) * (1. - .45 * tent * ss(.68, .6, lt)) * (1. - .3 * soft * ss(-.1, -.7, wr) * fine);
  // its light: that of a wet skin (skinWet of S_SEA), soft on the body, hard on spines, claws and eyes
  var c = skinWet(alb * sh, n, ns, i.wp, .2 * soft + .55 * (spine + claw) + 1.6 * eye + .25 * mouth, .5 * soft + 1.5 * (spine + claw) + 3. * eye + .3 * mouth);
  // and the sun that comes through what is soft and thin, seen against it (TRANS of air.js): the tentacles most, then
  // the legs, then the body
  let V = normalize(g.cam.xyz - i.wp);
  c += alb * vec3f(1.2, .85, .8) * sunE(i.wp.y, zone(i.wp)) * shadow1(i.wp + g.sun.xyz * .05) * (.35 * sat(-dot(ns, g.sun.xyz)) + 1. * pow(sat(-dot(V, g.sun.xyz)), 3.)) * TRANS
    * (.25 * (body + sheath) + .5 * (leg - claw) + .7 * tent);
  return fin(fog(c, i.wp, zone(i.wp)));
}
`;
const S_TRILO = /*wgsl*/`
const TR_Z0 = ${wkNum(TW.z0)}; const TR_DZ = ${wkNum(TW.dz)}; const TR_NL = ${wkNum(TW.nl - 1)}; const TR_XF = array<f32, ${TW.nl}>(${TXF.map(wkNum).join(', ')});
const TR_LAM = ${wkNum(TW.lam)}; const TR_BE = ${wkNum(TW.be)}; const TR_LF = ${wkNum(TW.lf)}; const TR_WAVE = ${wkNum(TW.wave)};
const TR_RP = ${wkNum(TW.rp)}; const TR_V0 = ${wkNum(TW.v0)}; const TR_V1 = ${wkNum(TW.v1)}; const TR_HC = ${wkNum(TW.hc)}; const TR_HH = ${wkNum(TW.hh)}; const TR_KD = ${wkNum(TW.kd)};
const TR_SINK = ${wkNum(TW.sink)}; const TR_C = ${wkNum(TR_C)}; const TR_P = ${wkNum(TR_P)}; const TR_SEG = ${wkNum(TR_SEG)};
const TR_HA = ${wkNum(TR_HA)}; const TR_HL = ${wkNum(TR_HL)}; const TR_TA = ${wkNum(TR_TA)}; const TR_TL = ${wkNum(TR_TL)}; const TR_AG = ${wkNum(TR_AG)};
// How it bends. TR_BEND: a place along the body heads the way the walker will head (in front of its middle) or did head
// (behind it) when it has walked on by this share of the way between them: in a turn the head goes first and the tail
// piece follows. TR_PIV: the height about which the body bends up and down
const TR_BEND = .15; const TR_PIV = ${wkNum(TW.hb + 0.07)};
fn trG(v: f32) -> f32 { return exp(-v * v); }
fn trIn(x: f32, zr: f32, a: f32, b: f32) -> f32 { let q = max(length(vec2f(x / a, zr / b)), 1e-4); return max(1. - q, 0.) * length(vec2f(x, zr)) / q; }
@vertex fn vsTrilo(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let L = i.b.z; let sd = fract(i.b.w); let au = i.n.w; let mv = abs(sign(i.a.w));
  let w = wkOf(i.a, i.b, TR_RP); let s = wkS(t, w, sd, TR_V0 + TR_V1 * fract(sd * 7.3)); let P = wkPose(s, w);
  var l = i.p; let sg = select(-1., 1., l.x > 0.);
  // one that stays where it is lies half dug in: the rim of its shield and its legs under the mud
  l.y -= (1. - mv) * TR_SINK;
  // The legs step (aux up to .5: how much of the way of its foot a place on a leg goes along). The two of a pair step
  // together, each pair a little after the one behind it: waves of eight legs run forward along the body, five of
  // them on the ground (Whittington 1980). Too far away to be seen, they are left as they are
  let wl = sat((au - .008) / .49) * step(.004, au) * step(au, .52);
  var d = vec3f(0.);
  if (wl > 0. && mv > 0. && distance(g.cam.xyz, i.a.xyz) < 12. + abs(i.a.w)) {
    let k = clamp(round((TR_Z0 - l.z) / TR_DZ), 0., TR_NL); let f = vec2f(sg * TR_XF[u32(k)], TR_Z0 - k * TR_DZ);
    d = wkFoot(s, P, f, k * TR_WAVE, w, TR_LAM, TR_BE, TR_LF) - vec3f(f.x, 0., f.y);
  }
  // the feelers (aux .6 to 1, out along one): those in front sweep from side to side and feel up and down, those
  // behind trail and sway a little
  let an = sat((au - .6) / .4) * step(.55, au); let rear = step(l.z, 0.); let fa = t * .9 + sd * 31. + sg * 1.3;
  l += vec3f(sg * mix(.05, .03, rear) * sin(fa - an * 2.), mv * mix(.02, .006, rear) * sin(t * 1.3 + sd * 17. + 2. * sg - an * 3.), 0.) * an * an;
  // The body bends, each place along it (zc; what reaches out beyond its ends goes with the end) about its own middle:
  // sideways into a turn (da), and up and down: the head lifts and the tail piece dips, each in its own slow rhythm
  // (pa: how steep the back is there, yc: how high that puts its middle)
  let zc = clamp(l.z, -.5, .5); let ze = l.z - zc;
  let da = (wkHead(s + TR_BEND * zc, w) - P.z) * mv;
  let th = mv * (.05 + .06 * sin(t * .43 + sd * 20.)); let tt = mv * (.04 + .04 * sin(t * .37 + sd * 11.));
  let u1 = sat((zc - .02) / .28); let u2 = sat((-zc - .02) / .3);
  let pa = th * u1 * u1 * (3. - 2. * u1) + tt * u2 * u2 * (3. - 2. * u2);
  let yc = th * (.28 * (u1 * u1 * u1 - .5 * u1 * u1 * u1 * u1) + max(zc - .3, 0.)) - tt * (.3 * (u2 * u2 * u2 - .5 * u2 * u2 * u2 * u2) + max(-zc - .32, 0.));
  let cp = cos(pa); let sp = sin(pa); let cy = cos(da); let sy = sin(da);
  let yr = l.y - TR_PIV; let z1 = ze * cp - yr * sp;
  var bd = vec3f(l.x * cy - z1 * sy - .5 * da * zc, TR_PIV + yc + yr * cp + ze * sp, zc + l.x * sy + z1 * cy);
  // (a feeler never goes into the mud; those of one that lies dug in come up out of the mud heaped in front of its rim)
  bd.y = mix(bd.y, max(bd.y, .012 + (1. - mv) * .028 * ss(.08, .2, an) * (1. - .9 * ss(.3, .9, an))), step(.55, au));
  // a leg goes with the body where it leaves it, and with its foot at its end: a foot on the ground stays there
  l = mix(bd, l, wl) + vec3f(d.x * wl, d.y * pow(wl, 2.5), d.z * wl);
  let n1 = vec3f(i.n.x, i.n.y * cp + i.n.z * sp, i.n.z * cp - i.n.y * sp); let n = vec3f(n1.x * cy - n1.z * sy, n1.y, n1.x * sy + n1.z * cy);
  let fr = wkFrame(i.b); let c = wkWorld(i.a, L, fr, P, vec3f(0., TR_HC, 0.));
  let wp = wkWorld(i.a, L, fr, P, l) + wkGive(c, TR_KD * L, TR_HH * L, i.b) * mv;
  // (the fragment shader needs the length too: it travels with the seed, as whole thousandths of a quarter millimetre)
  o.cp = g.vp * vec4f(wp, 1.); o.wp = wp; o.n = wkDir(fr, P, n); o.op = i.p; o.sd = floor(L * 4000.) + sd; o.lt = au;
  return o;
}
// The skin. Colours are free: no fossil shows them. A dark back and paler sides, the rim and the spines pale amber, a
// dark band across the rear of every segment, pale spots on the sides; each animal in its own tone, the large ones
// darker. The shell has a relief: the furrows of the glabella, the furrow along each side lobe, the rings and ribs of
// the tail piece, and granules everywhere but in the furrows (Whittington 1980). It is dark in its furrows, and it
// shines like something wet
@fragment fn fsTrilo(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let L = floor(i.sd) / 4000.; let sd = fract(i.sd); let lt = i.lt;
  let x = abs(i.op.x); let y = i.op.y; let z = i.op.z;
  let leg = step(.004, lt) * step(lt, .52); let ant = step(.55, lt); let rim = step(-.3, lt) * step(lt, -.1);
  let und = step(-.5, lt) * step(lt, -.3); let gill = step(-.7, lt) * step(lt, -.5); let knob = step(-.9, lt) * step(lt, -.7); let eye = step(lt, -.95);
  // the upper side of the shell, and its inside, which is seen from below
  let shell = step(-.05, lt) * step(lt, .003); let outer = shell * select(0., 1., ff); let inner = shell - outer;
  let tx = textureSample(tD, sR, i.op.zx * vec2f(6., 8.) + i.op.y * vec2f(5., 7.) + sd * 3.);
  // (two looks at the mottling, each turned its own way: one alone shows the grid of the texture, like a woven mesh)
  let tg = textureSample(tD, sR, vec2f(i.op.x * 41. + i.op.z * 23., i.op.z * 37. - i.op.x * 19.) + i.op.y * vec2f(29., 43.) + sd) * .5
    + textureSample(tD, sR, vec2f(i.op.x * 67. - i.op.z * 31., i.op.z * 71. + i.op.x * 43.) + i.op.y * vec2f(53., 31.) + .37) * .5;
  // (the relief fades where it would be finer than the pixels)
  let fine = ss(.02, .005, fwidth(z) + fwidth(x));
  let hd = step(TR_C, z); let tl = 1. - step(TR_P, z); let th = 1. - hd - tl;
  // the thorax: where in its segment (v, 0 at its front), how far out on its side lobe (s); the furrow that runs
  // along a side lobe, from its front by the axis to its rear at the tip, and the one across the front of a ring
  let kz = (z - TR_P) / (TR_C - TR_P); let Wt = .27 + .03 * kz; let At = .075 + .04 * kz;
  let v = fract((TR_C - z) / TR_SEG); let s = sat((x - At) / (Wt - At)); let onP = ss(At - .002, At + .012, x);
  let fP = trG((v - .3 - .42 * s) / .11) * onP * ss(1., .8, s) * ss(0., .1, s);
  let fA = trG((v - .2) / .09) * (1. - onP) * .7;
  // the head: three pairs of short furrows on the sides of the glabella, each slanting back towards its middle
  let Ah = TR_AG * sqrt(max(1. - pow(max(z - .4, 0.) / .068, 2.), 0.)); let onG = ss(Ah, Ah - .012, x);
  let zz = z + (Ah - x) * .35;
  let fG = (trG((zz - .275) / .007) + trG((zz - .325) / .007) + trG((zz - .372) / .007)) * onG * ss(.03, .06, x);
  let dh = trIn(x, z - TR_C, TR_HA, TR_HL);
  // the tail piece: the furrows between the rings of its axis, and the ribs of its sides, which sweep back to the rim
  let tz = (TR_P - z) / .27; let Ap = (.075 - .04 * min(tz, 1.)) * sqrt(max(1. - pow(max(tz - .85, 0.) / .15, 2.), 0.)); let onA = ss(Ap + .004, Ap - .006, x);
  let fR = (.5 - .5 * cos(TAU * 5.5 * tz)) * onA * .6;
  let dp = trIn(x, TR_P - z, TR_TA, TR_TL);
  let fT = pow(.5 - .5 * cos(TAU * (tz * 5.5 - (x - Ap) * 8.)), 3.) * (1. - onA) * ss(0., .03, dp) * .8;
  let fur = sat(hd * fG * .5 + th * (fP + fA) + tl * (fR + fT));
  let ns = normalize(i.n) * select(-1., 1., ff); let ny = ns.y;
  let n = skinRelief(ns, i.wp, (.0022 * (tg.a - .5) * (1. - fur) - .005 * fur) * outer * fine * L * 1.6);
  // (one in seven is a pale one)
  let tone = fract(sd * 13.7); let hue = fract(sd * 5.3); let lite = step(.86, fract(sd * 3.1));
  let dk = mix(vec3f(.12, .05, .03), vec3f(.095, .066, .035), hue);
  let md = mix(vec3f(.43, .19, .088), vec3f(.35, .225, .1), hue);
  let pale = vec3f(.6, .42, .24);
  let A = hd * Ah + th * At + tl * Ap; let axm = ss(A + .014, A - .008, x);
  var alb = mix(md, dk, axm * .9);
  // the dark bands, and a dark patch round each eye
  alb *= 1. - .4 * (th * ss(.5, .95, v) * (1. - .5 * s) + tl * onA * ss(.25, .9, fract(tz * 5.5)) + hd * trG(length(vec2f(x - .215, z - .3) / vec2f(.05, .06))));
  // paler to the rim and to the tips of the side lobes; pale spots on the sides
  let edge = hd * ss(.05, 0., dh) + tl * ss(.045, 0., dp) + th * ss(.72, 1., s);
  alb = mix(alb, pale, edge * .75);
  alb = mix(alb, pale, ss(.5, .8, tx.b * .6 + tg.b * .4) * (1. - axm) * (1. - edge) * .45);
  alb *= (.8 + .4 * tx.g) * (1. - .55 * fur * mix(.5, 1., fine)) * mix(.75, 1.3, tone) * mix(1.08, .85, ss(.055, .085, L)) * (1. + .6 * lite) * (1. + .12 * knob);
  // the inside of the shell: dark, darker the deeper under it
  alb = mix(alb, vec3f(.2, .12, .09) * (.6 + .4 * tx.g), inner);
  // rim and spines: of the shell's own colour, paler, mottled as it is, their under sides in shade
  alb = mix(alb, mix(md, pale, .45) * (.7 + .6 * tx.g) * mix(.75, 1.3, tone) * (1. + .5 * lite) * mix(.5, 1., ss(-.7, .2, ny)), rim);
  // the body and the plate under the mouth; the gills, finely feathered
  alb = mix(alb, vec3f(.4, .27, .19) * mix(.45, 1., ss(.11, .085, y)), und);
  let gf = x * 140.;
  alb = mix(alb, mix(vec3f(.5, .33, .25), vec3f(.24, .13, .09), (.5 + .5 * cos(TAU * gf)) * ss(1.2, .4, fwidth(gf))), gill);
  // legs and feelers: a pale red-brown, ringed at the joints; the legs darker to their feet, and in shade under the shield
  let jt = mix(x * 52., z * 130., ant);
  let ring = ss(.36, .5, abs(fract(jt) - .5)) * ss(1.2, .4, fwidth(jt));
  alb = mix(alb, mix(vec3f(.2, .1, .06), vec3f(.44, .25, .15), ss(0., .05, y)) * (1. - .3 * ring) * mix(.45, 1., ss(.16, .3, x)), leg);
  alb = mix(alb, vec3f(.46, .29, .17) * (1. - .3 * ring), ant);
  alb = mix(alb, vec3f(.03, .025, .02), eye);
  // its light: that of a wet skin (skinWet of S_SEA), strongest on the shell and on the lenses of the eyes
  let c = skinWet(alb, n, ns, i.wp, .25 * (outer + knob + rim) + 1.6 * eye + .12 * (und + leg + gill + ant + inner), .6 * (outer + knob) + .35 * rim + 3. * eye);
  return fin(fog(c, i.wp, zone(i.wp)));
}
`;
// The soft dark patch on the mud right under a walker, so that it stands on the ground and is not laid over it. It is
// see-through (a glass kind, see kind() in engine/tools.js): a disc on the plane of the walker's ground, under its body,
// that goes where the walker goes. The plane is within tol of the drawn ground (makeWalkers), so the disc lies that
// much over it. The disc darkens what is behind it, and adds back the haze in front of it: far away it is gone
const S_WSHADOW = /*wgsl*/`
// rp, v0, v1, hc, hh, kd: of the walker (HW, TW in walkers.js); sx, sz, zc: how wide and how long the patch is (half of
// it, in lengths) and where its middle is along the body
fn wkShadow(i: VI, rp: f32, v0: f32, v1: f32, hc: f32, hh: f32, kd: f32, sx: f32, sz: f32, zc: f32) -> VO {
  var o: VO;
  let L = i.b.z; let sd = fract(i.b.w); let mv = abs(sign(i.a.w));
  let w = wkOf(i.a, i.b, rp); let P = wkPose(wkS(g.cam.w, w, sd, v0 + v1 * fract(sd * 7.3)), w);
  let fr = wkFrame(i.b); let c = wkWorld(i.a, L, fr, P, vec3f(0., hc, 0.));
  // (it lies a little to the side that is away from the sun, as far as a shadow falls from half the walker's height,
  // and it is longer on that side: the sun is low)
  let w0 = wkWorld(i.a, L, fr, P, vec3f(i.p.x * sx, 0., zc + i.p.z * sz)); let sh = normalize(vec2f(g.sun.x, g.sun.z) + 1e-5);
  let so = sh * ((hc * L * .9 / max(g.sun.y, .25) + .7 * max(-dot((w0 - wkWorld(i.a, L, fr, P, vec3f(0., 0., zc))).xz, sh), 0.)) * mv);
  // (round one that lies dug in it lies higher: over the mud heaped up there, which would hide it)
  let wp = w0 - vec3f(so.x, i.b.x * so.x + i.b.y * so.y, so.y) + fr.N * (min(.002, .05 * L) + .0003 + (1. - mv) * .03 * L) + wkGive(c, kd * L, hh * L, i.b) * mv;
  o.cp = g.vp * vec4f(wp, 1.); o.wp = wp; o.n = fr.N; o.op = i.p; o.sd = sd; o.lt = mv;
  return o;
}
@vertex fn vsHalluShadow(i: VI) -> VO { return wkShadow(i, HL_RP, HL_V0, HL_V1, HL_HC, HL_HH, HL_KD, .2, .62, 0.); }
@vertex fn vsTriloShadow(i: VI) -> VO { return wkShadow(i, TR_RP, TR_V0, TR_V1, TR_HC, TR_HH, TR_KD, .62, .72, -.03); }
// (it returns its colour times its alpha, and the alpha: the haze that lies in front of the ground, times its alpha.
// Weaker round one that lies dug in)
@fragment fn fsWalkShadow(i: VO) -> @location(0) vec4f {
  let a = (.6 - .2 * (1. - i.lt)) * (1. - ss(.3, 1., length(i.op.xz)));
  return vec4f(fog(vec3f(0.), i.wp, zone(i.wp)) * a, a);
}
`;
// a flat disc of radius 1 for the patch
function meshWalkShadow() {
  const m = new Mesh(), N = 24, c = m.v(0, 0, 0, 0), ring = [];
  for (let k = 0; k < N; k++) ring.push(m.v(cos(k / N * TAU), 0, sin(k / N * TAU), 0));
  for (let k = 0; k < N; k++) m.tri(c, ring[(k + 1) % N], ring[k]);
  return m;
}
// the kinds: drawn in this order, before the kinds of world.js (this file is joined before it); the patches with what
// is see-through, after everything solid. A patch has the instances of its walker (makeWalkers)
const HALLU = kind({ mesh: () => meshHallu().build(), wgsl: S_WALK + S_HALLU, vs: 'vsHallu', fs: 'fsHallu' });
const TRILO = kind({ mesh: () => meshTrilo().build(), wgsl: S_TRILO, vs: 'vsTrilo', fs: 'fsTrilo' });
const HALLU_SHADOW = kind({ glass: 1, mesh: () => meshWalkShadow().build(), wgsl: S_WSHADOW, vs: 'vsHalluShadow', fs: 'fsWalkShadow' });
const TRILO_SHADOW = kind({ glass: 1, mesh: () => meshWalkShadow().build(), wgsl: '', vs: 'vsTriloShadow', fs: 'fsWalkShadow' });
// The mud that a trilobite which lies dug in has heaped up around itself: a low heap round its shield. It is a piece of
// the ground: one mesh for all of them, with its points at their places in the world, drawn as the ground is (material
// 0), so that it has the look of the mud right there. makeWalkers fills TR_HEAPS, for each such trilobite the rings of
// its heap from the inside out, and gives the kind its one instance; the engine builds the mesh after that
const TR_HEAPS = [];
const TRILO_HEAP = kind({ solid: 1, mesh: () => {
  const m = new Mesh();
  for (const rings of TR_HEAPS) {
    const R = rings.map((r) => r.map((p) => m.v(p[0], p[1], p[2], 1)));
    for (let j = 0; j < R.length - 1; j++) for (let s = 0; s < R[j].length; s++) { const s2 = (s + 1) % R[j].length; m.quad(R[j][s], R[j + 1][s], R[j + 1][s2], R[j][s2]); }
  }
  // (its light is that of level ground and a third that of its own slopes: the sun is low, and in the full light of its
  // slopes a heap a few millimetres high stands out like a plate laid on the mud)
  return m.build((x, y, z, nx, ny, nz) => { const l = hypot(nx, ny, nz) || 1; return [0.35 * nx / l, 0.35 * ny / l + 0.65, 0.35 * nz / l]; });
} });

// ---------------------------------------------------------------- where they are, for the zoo
// wkOf, wkS and wkPose of S_WALK, for the walker at i in its list and the scene time F[TIME]: writes its middle into
// WKP (0 to 2) and the way it heads (3 to 5), and gives way to the viewer as its shader does. sp: HW or TW. It runs in
// every frame and allocates nothing: no float is handed to a function
const WKP = new Float64Array(6);
const wkAt = (a, i, sp) => {
  const L = a[i + 6], f = a[i + 7], nn = floor(f), sd = f - nn, w = a[i + 3], dir = w > 0 ? 1 : w < 0 ? -1 : 0, rc = (w < 0 ? -w : w) / L;
  const A = TAU / nn, Lp = sp.rp * A, Ls = Lp + 2 * rc * sin(0.5 * A), q7 = sd * 7.3, v = sp.v0 + sp.v1 * (q7 - floor(q7));
  const u = F[TIME] * v * TAU / Ls + sd * 53.1, s = (dir === 0 ? 0 : Ls) * (u - 4 / 3 * sin(u) + sin(2 * u) / 6) / TAU;
  const k = floor(s / Ls), r = s - k * Ls, ak = sd * 37.7 + k * A * dir, h = ak + dir * (PI / 2 + 0.5 * A), q = r < Lp ? r / Lp : 1;
  const ps = h - dir * A * (1 - q * q * (3 - 2 * q)), go = r > Lp ? r - Lp : 0, px = rc * cos(ak) + cos(h) * go, pz = rc * sin(ak) + sin(h) * go;
  // the frame of its ground (wkFrame): e1 = (1, gx, 0), N = (-gx, 1, -gz), e2 = e1 x N
  const gx = a[i + 4], gz = a[i + 5], l1 = sqrt(1 + gx * gx), e1x = 1 / l1, e1y = gx / l1, l2 = sqrt(1 + gx * gx + gz * gz), nx = -gx / l2, ny = 1 / l2, nz = -gz / l2;
  const e2x = e1y * nz, e2y = -e1x * nz, e2z = e1x * ny - e1y * nx, cs = cos(ps), sn = sin(ps), hc = (dir === 0 ? sp.hd : sp.hc) * L;
  WKP[3] = e1x * cs + e2x * sn; WKP[4] = e1y * cs + e2y * sn; WKP[5] = e2z * sn;
  const mx = a[i] + L * (e1x * px + e2x * pz) + nx * hc, my = a[i + 1] + L * (e1y * px + e2y * pz) + ny * hc, mz = a[i + 2] + L * e2z * pz + nz * hc;
  ZP[0] = mx; ZP[1] = my; ZP[2] = mz;
  if (dir !== 0) { ZH[0] = sp.hh * L; ZH[1] = sp.kd * L; zooDodge(1); ZP[1] = my + gx * (ZP[0] - mx) + gz * (ZP[2] - mz); }
  WKP[0] = ZP[0]; WKP[1] = ZP[1]; WKP[2] = ZP[2];
};
// a walker's zoo place: a line along its body through its middle, as thick as it is wide
const zooWalker = (a, i, sp) => {
  wkAt(a, i, sp);
  const e = sp.line * a[i + 6];
  ZP[0] = WKP[0] - WKP[3] * e; ZP[1] = WKP[1] - WKP[4] * e; ZP[2] = WKP[2] - WKP[5] * e;
  ZP[3] = WKP[3] * 2 * e; ZP[4] = WKP[4] * 2 * e; ZP[5] = WKP[5] * 2 * e; ZP[7] = sp.rad * a[i + 6];
};
const zooHallu = (a, i) => zooWalker(a, i, HW), zooTrilo = (a, i) => zooWalker(a, i, TW);

// ---------------------------------------------------------------- giving them their places (load-time only)
// The ground as it is drawn: the triangles of the terrain (T, see buildTerrain in engine/tools.js) within r of x0, z0,
// sorted into cells of 10 cm. at(x, z, y0) is the height of the drawn ground at x, z (where there are several layers,
// the one nearest to y0), NaN where there is none
const groundNet = (W, x0, z0, r) => {
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
    const L = bins[k + n * j]; let best = NaN, bd = Infinity;
    for (let e = 0; e < L.length; e += 3) {
      const a = L[e], b = L[e + 1], d = L[e + 2], ax = wp[a], az = wp[a + 2], bxx = wp[b], bzz = wp[b + 2], dx = wp[d], dz = wp[d + 2];
      const det = (bzz - dz) * (ax - dx) + (dx - bxx) * (az - dz);
      if (abs(det) < 1e-12) continue;
      const u = ((bzz - dz) * (x - dx) + (dx - bxx) * (z - dz)) / det, v = ((dz - az) * (x - dx) + (ax - dx) * (z - dz)) / det;
      if (u < -1e-7 || v < -1e-7 || u + v > 1 + 1e-7) continue;
      const y = u * wp[a + 1] + v * wp[b + 1] + (1 - u - v) * wp[d + 1];
      if (abs(y - y0) < bd) { bd = abs(y - y0); best = y; }
    }
    return best;
  };
  return { at };
};
// What stands on the ground within r of x0, z0 (every solid kind of the world: stones, tulip animals, sponges, ...),
// as discs: the middle of a thing and how far its parts reach from there within 5 cm over the ground. meshes keeps the
// vertices of each kind's mesh once it is made
const standingNear = (W, net, x0, z0, r, meshes) => {
  const out = [], c0 = W.cellOf(x0 - r - 2, z0 - r - 2), c1 = W.cellOf(x0 + r + 2, z0 + r + 2);
  for (const k of KINDS) {
    if (!k.solid || !k.at) continue;
    const lists = [];
    if (k.cells) { for (let cz = floor(c0 / CELLS); cz <= floor(c1 / CELLS); cz++) for (let cx = c0 % CELLS; cx <= c1 % CELLS; cx++) lists.push(k.at[cx + CELLS * cz]); } else lists.push(k.at);
    for (const L of lists) for (let i = 0; i < L.length; i += 12) {
      const x = L[i], y = L[i + 1], z = L[i + 2], sc = L[i + 3], qx = L[i + 4], qy = L[i + 5], qz = L[i + 6], qw = L[i + 7];
      if (hypot(x - x0, z - z0) > r + 2 * sc) continue;
      if (!meshes.has(k)) meshes.set(k, new Float32Array(k.mesh().vb));
      const V = meshes.get(k); let reach = -1;
      for (let j = 0; j < V.length; j += 4) {
        // (turned by its quaternion, as piece() in engine/tools.js does)
        const vx = V[j] * sc, vy = V[j + 1] * sc, vz = V[j + 2] * sc, tx = 2 * (qy * vz - qz * vy), ty = 2 * (qz * vx - qx * vz), tz = 2 * (qx * vy - qy * vx);
        const px = x + vx + qw * tx + qy * tz - qz * ty, py = y + vy + qw * ty + qz * tx - qx * tz, pz = z + vz + qw * tz + qx * ty - qy * tx, gv = net.at(px, pz, py);
        if (py < (gv === gv ? gv : y) + 0.05) reach = max(reach, hypot(px - x, pz - z));
      }
      if (reach >= 0) out.push([x, z, reach]);
    }
  }
  return out;
};
// The plane of the drawn ground under a round of radius R about x, z: [its height at x, z, how much it rises along x,
// along z]. It is the plane through the rim of the round. Null where a point of the round lies further than tol from
// it, where it is steeper than about 25 degrees, or where there is rock less than 5 cm over the walker (top: how high
// that is)
const WK_RIM = Array.from({ length: 24 }, (_, k) => [cos(k / 24 * TAU), sin(k / 24 * TAU)]);
const planeAt = (W, net, x, z, R, tol, top) => {
  const y0 = W.gyExact(x, z); let sy = 0, sx = 0, sz = 0;
  for (const [c, s] of WK_RIM) { const y = net.at(x + R * c, z + R * s, y0); if (!(y === y)) return null; sy += y; sx += c * y; sz += s * y; }
  const a = sy / 24, gx = sx / (12 * R), gz = sz / (12 * R);
  if (gx * gx + gz * gz > 0.2345) return null;
  for (const f of [0, 0.25, 0.5, 0.75, 1]) for (let k = 0; k < (f ? 24 : 1); k++) {
    const dx = f * R * WK_RIM[k][0], dz = f * R * WK_RIM[k][1], p = a + gx * dx + gz * dz;
    if (!(abs(net.at(x + dx, z + dz, y0) - p) <= tol) || W.Dw(x + dx, p + 0.05 + top, z + dz) > 0) return null;
  }
  return [a, gx, gz];
};
// W: the tools of the engine; gardens: see the top of this file. Instances: see S_WALK
function makeWalkers(W, gardens) {
  // every walker placed so far, of both kinds: the middle of its round, how far its body reaches from there and how
  // far its feelers do. Two rounds keep so far apart that neither walker comes into the other. heapNets: for each one
  // that lies dug in, the ground of its site (for the mud heaped round it, below)
  const placed = [], meshes = new Map(), heapNets = [];
  // (the ground and what stands on it are read before the random streams start: some meshes start streams of their own)
  const sites = (key) => gardens.filter((G) => G[key]).map((G) => { const [x, z, r] = G[key], net = groundNet(W, x, z, r + 0.3); return { at: G[key], net, obs: standingNear(W, net, x, z, r + 0.35, meshes) }; });
  const hs = sites('hallu'), ts = sites('trilo');
  // Rounds at random places of a site, of random walkers, until there are as many as it asks for or no more fit. Each
  // one keeps clear of the others and of what stands there, on ground that is a plane to within 2 mm (less for the
  // smallest) under all its feet, also when it gives way to a viewer of the size of a fish (a diver is never near
  // enough to make it)
  // (one that lies dug in needs far less room than one that walks: no more of them than the share dig of all)
  const fill = (sp, { at: [sx, sz, sr, count], net, obs }, out, dig) => {
    for (let made = 0, dug = 0, tries = 0, most = 80 * count; made < count && tries < most; tries++) {
      const a = rnd() * TAU, r = sqrt(rnd()) * sr, x = sx + cos(a) * r, z = sz + sin(a) * r, L = mix(sp.l0, sp.l1, pow(rnd(), sp.lp));
      const still = rnd() < dig && dug < round(dig * count), n = 2 + floor(rnd() * 4), dir = rnd() < 0.5 ? -1 : 1, sd = rr(0.001, 0.999), c = rr(sp.c0, sp.c1);
      // (the fuller the site, the smaller the rounds)
      const rc = still ? 0 : L * c * (1 - 0.7 * tries / most), rb = rc + sp.rb * L, ra = rc + sp.ra * L;
      if (placed.some((p) => hypot(x - p[0], z - p[1]) < max(rb + p[3], ra + p[2]) + 0.004)) continue;
      if (obs.some((o) => hypot(x - o[0], z - o[1]) < ra + o[2] + 0.004)) continue;
      // (under one that lies dug in the ground has to be that plane as far as the mud reaches that it has heaped up)
      const pl = planeAt(W, net, x, z, still ? 0.85 * L : rc + sp.rf * L + 0.6 * (sp.kd * L + 0.02), min(0.002, 0.05 * L), (sp.hc + sp.hh) * L);
      if (!pl) continue;
      out.push(x, pl[0], z, rc * dir, pl[1], pl[2], L, n + sd);
      placed.push([x, z, rb, ra]); made++; if (still) { dug++; heapNets.push(net); }
    }
  };
  rseed(20);
  const hallus = []; for (const s of hs) fill(HW, s, hallus, 0);
  rseed(21);
  const trilos = []; for (const s of ts) fill(TW, s, trilos, TW.dig);
  HALLU.data = HALLU_SHADOW.data = new Float32Array(hallus); TRILO.data = TRILO_SHADOW.data = new Float32Array(trilos);
  // The mud round each trilobite that lies dug in: a low, uneven heap. It follows an egg-shaped line a little inside
  // the outline of the shield (E: how far from that line each ring is, in lengths). Inside that line it is level and
  // laps on to the shell, which rises out of it; outside it falls away to nothing, without an edge. Each point stands
  // on the ground as it is drawn there (so the heap has the small ups and downs of the ground under it), turned as the
  // trilobite is (wkPose and wkWorld of S_WALK, for one that stays where it is). Its first ring, deep under the shell,
  // lies 3 mm under the ground, its last a hair under it
  const E = [-0.2, -0.14, -0.07, -0.02, 0.02, 0.06, 0.1, 0.15, 0.2, 0.25];
  for (let i = 0, hn = 0; i < trilos.length; i += 8) if (trilos[i + 3] === 0) {
    const net = heapNets[hn++], gx = trilos[i + 4], gz = trilos[i + 5], L = trilos[i + 6], sd = trilos[i + 7] % 1, ps = sd * 37.7, cs = cos(ps), sn = sin(ps);
    const l1 = hypot(1, gx), e1 = [1 / l1, gx / l1, 0], l2 = hypot(gx, 1, gz), N = [-gx / l2, 1 / l2, -gz / l2], e2 = [e1[1] * N[2], -e1[0] * N[2], e1[0] * N[1] - e1[1] * N[0]];
    TR_HEAPS.push(E.map((e, j) => Array.from({ length: 32 }, (_, s) => {
      // (how far out it reaches differs all the way round: where it lies on an algae mat it covers the threads, and an
      // even outline shows there as a clean oval)
      const a = s / 32 * TAU, eo = e < 0 ? e : e * (0.8 + 0.35 * sin(2 * a + sd * 23) + 0.2 * sin(5 * a + sd * 61)), ox = sin(a) / 0.3, oz = cos(a) / 0.45, ol = hypot(ox, oz);
      const px = (0.27 + 0.03 * cos(a)) * sin(a) + eo * ox / ol, pz = 0.45 * cos(a) - 0.01 + eo * oz / ol;
      const h = 0.02 * (0.8 + 0.3 * sin(3 * a + sd * 40) + 0.12 * sin(7 * a + sd * 90)) * (e < -0.07 ? 1 : exp(-(((e + 0.07) / 0.1) ** 2)));
      const u = px * sn + pz * cs, v = pz * sn - px * cs, p = [0, 1, 2].map((c) => trilos[i + c] + L * (e1[c] * u + e2[c] * v)), y = net.at(p[0], p[2], p[1]);
      p[1] = (y === y ? y : p[1]) + (j === 0 ? -0.003 : j === E.length - 1 ? -0.0005 : L * h + 0.0002);
      return p;
    })));
  }
  if (TR_HEAPS.length) TRILO_HEAP.at.push(0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0);
  // zoo: where each of them is (engine/zoo.js): id of the ZOO entry, the instances, where one of them is, reach
  zooMove('hallucigenia', HALLU.data, zooHallu, 1); zooMove('olenoides', TRILO.data, zooTrilo, 1.5);
}
