// ============================================================================
// devonian: Titanichthys
// ============================================================================
// A giant filter-feeding arthrodire, about 4 m. Its mesh, its shaders and, for the zoo, where it is at a time.
// world.js lists it as a kind and gives it its instances. What it shares with the other animals of this era is in
// swimmers.js.

// Titanichthys cf. agassizi in the round. One unit from snout to tail. Sources: Engelman 2023 "A Devonian Fish Tale"
// (about 4 m, similar body plan to Dunkleosteus but flatter, wider head); Boyle & Ryan 2017 (jaw mechanics suggest
// filter feeding). Long thin jaws without cutting blades, very wide mouth held open while swimming. Head and chest
// armour with a craniothoracic joint; smooth skin behind the armour.
// The mouth is built OPEN (like a basking shark): no mouth animation needed.
// Estimates: all widths and cross-sections behind the armour; tail shape (not preserved)
//
// Two lofts: trunk+body+tail (stationary), and head shield (built in the lifted position).
// The lower jaw is a separate slab built in the dropped position.
//
// aux: 0 body behind armour, 0.35 gill slits, 0.4 pelvic+anal fins, 0.45 dorsal fin,
//      0.5 pectoral fins, 0.6 trunk shield, 0.65 plate ridges, 0.8 tail,
//      0.9 head shield, -0.5 upper jaw rim (move with head), -0.9 lower jaw (dropped, static),
//      -0.7 iris, -1 lens
function meshTitanichthys() {
  const m = new Mesh();
  // --- trunk + body + tail: from tail tip to the nuchal gap. Wider and flatter than Dunkleosteus
  const KB = [
    [-0.50, 0.001, 0.003, 0.00],
    [-0.46, 0.010, 0.016, 0.00],
    [-0.40, 0.032, 0.052, 0.00],
    [-0.30, 0.062, 0.105, 0.00],
    [-0.18, 0.084, 0.136, 0.00],
    [-0.06, 0.096, 0.142, 0.00],
    [ 0.02, 0.098, 0.136, 0.005],
    [ 0.05, 0.098, 0.128, 0.01],
  ];
  loft(m, KB, 2, 14, 0, (a) => {
    const c = cos(a), s = sin(a);
    // angular armoured trunk shield, rounder behind
    return [(c < 0 ? -1 : 1) * pow(abs(c), 0.55), s > 0 ? pow(s, 0.50) + 0.05 * pow(s, 3) : -pow(-s, 0.72)];
  });
  // mark the front two rings (trunk shield) with aux 0.6
  const bodyN = m.aux.length;
  for (let j = bodyN - 14 * 4; j < bodyN; j++) m.aux[j] = 0.6;

  // --- head shield: BOXY armoured skull, wider than tall (spatulate filter feeder)
  const KH = [
    [ 0.05, 0.098, 0.145, 0.018],
    [ 0.09, 0.096, 0.140, 0.022],
    [ 0.14, 0.092, 0.134, 0.026],
    [ 0.20, 0.088, 0.126, 0.030],
    [ 0.26, 0.082, 0.115, 0.034],
    [ 0.32, 0.072, 0.098, 0.037],
    [ 0.38, 0.058, 0.076, 0.040],
    [ 0.44, 0.040, 0.052, 0.038],
    [ 0.50, 0.010, 0.018, 0.028],
  ];
  loft(m, KH, 2, 14, 0.9, (a) => {
    const c = cos(a), s = sin(a);
    // boxy: flat top plate, flat side plates, sharper plate edges, rounder belly
    return [(c < 0 ? -1 : 1) * pow(abs(c), 0.35), s > 0 ? pow(s, 0.35) + 0.08 * pow(s, 2) : -pow(-s, 0.72)];
  });

  // --- plate boundary ridges on head shield
  // median ridge along the top centre
  m.tube(curve([[0, 0.118, 0.08], [0, 0.126, 0.14], [0, 0.130, 0.22], [0, 0.120, 0.32], [0, 0.098, 0.42]], 10),
    (k) => 0.003 * (1 - 0.3 * k / 10), 5, true, () => 0.65);
  // transverse ridges
  for (const rz of [0.14, 0.28]) {
    for (const sx of [-1, 1]) {
      const w0 = wideAt(KH, rz) * 0.85;
      m.tube(curve([[sx * w0, 0.096, rz], [sx * w0 * 0.6, 0.118 + (rz - 0.14) * 0.04, rz], [0.001 * sx, 0.126 + (rz - 0.14) * 0.04, rz]], 6),
        (k) => 0.0025 * (1 - 0.2 * k / 6), 4, true, () => 0.65);
    }
  }
  // orbital ridges around the eyes
  for (const sx of [-1, 1]) {
    m.tube(curve([[sx * 0.062, 0.058, 0.30], [sx * 0.078, 0.052, 0.32], [sx * 0.084, 0.048, 0.34], [sx * 0.078, 0.038, 0.36]], 8),
      (k) => 0.002 * (1 - 0.15 * k / 8), 4, true, () => 0.65);
  }

  // --- lower jaw: wide, thin, hanging low — a filter feeder's scoop. Wide to match boxy head
  slab(m, [0, -0.11, 0.28], [0, 0, 1], [0, -1, 0.18], [1, 0, 0], 0.36,
    (s) => {
      const t = s < 0.5 ? s * 2 : 2 - s * 2;
      return 0.098 * pow(sin(PI * pow(t, 0.5)), 0.6);
    },
    (s) => 0.016 * (1 - 0.35 * s),
    (s) => -0.9, 8);

  // --- upper jaw rim: thin ridges along the lower front edge of the head shield
  for (const sx of [-1, 1]) {
    m.tube(curve([
      [sx * 0.045, -0.022, 0.46], [sx * 0.058, -0.018, 0.42], [sx * 0.072, -0.008, 0.36],
      [sx * 0.082, 0.002, 0.30], [sx * 0.088, 0.010, 0.24]
    ], 10), (k) => 0.003 * (1 - 0.25 * k / 10), 5, true, () => -0.5);
  }

  // --- lower jaw rim: thin ridges along the top edge of the jaw
  for (const sx of [-1, 1]) {
    m.tube(curve([
      [sx * 0.040, -0.082, 0.46], [sx * 0.055, -0.078, 0.40], [sx * 0.068, -0.068, 0.34],
      [sx * 0.075, -0.058, 0.28]
    ], 8), (k) => 0.0025 * (1 - 0.2 * k / 8), 4, true, () => -0.9);
  }

  // --- eyes: larger, with bony orbit, on the sides of the wide head
  for (const sx of [-1, 1]) {
    ball(m, [sx * 0.076, 0.035, 0.33], [0.016, 0.018, 0.014], -0.7, 10, 5);
    ball(m, [sx * 0.085, 0.040, 0.342], 0.006, -1, 8, 4);
  }

  // --- gill openings: 5 narrow vertical slits on each side behind the trunk shield
  for (const sx of [-1, 1]) {
    for (let g = 0; g < 5; g++) {
      const gz = 0.02 - g * 0.025;
      const gx = sx * (0.125 - g * 0.004);
      slab(m, [gx, 0.015, gz], [0, -1, 0], [0, 0, 0.004], [sx, 0, 0], 0.045,
        (s) => 0.002 * sin(PI * s),
        (s) => 0.001,
        (s) => 0.35, 3);
    }
  }

  // --- dorsal fin: moderate, behind the trunk shield
  slab(m, [0, 0.098, -0.15], [0, 0, -1], [0, 1, 0], [1, 0, 0], 0.14,
    (s) => 0.035 * pow(sin(PI * pow(s, 0.5)), 0.8),
    (s) => 0.003 * (1 - 0.3 * s),
    (s) => 0.45, 5);

  // --- pectoral fins: broad, behind the trunk shield
  for (const sx of [-1, 1]) {
    slab(m, [sx * 0.095, -0.030, -0.02],
      [sx * 0.7, -0.28, -0.50], [0, 0, -1], [0, 1, 0], 0.16,
      (s) => 0.044 * pow(sin(PI * pow(s, 0.5)), 0.9),
      (s) => 0.005 * (1 - 0.5 * s),
      (s) => 0.5, 6);
  }

  // --- pelvic fins: small paired fins
  for (const sx of [-1, 1]) {
    slab(m, [sx * 0.065, -0.072, -0.22],
      [sx * 0.6, -0.30, -0.50], [0, 0, -1], [0, 1, 0], 0.06,
      (s) => 0.018 * sin(PI * s),
      (s) => 0.002 * (1 - 0.4 * s),
      (s) => sx * 0.4, 3);
  }

  // --- anal fin: small, below and behind the body
  slab(m, [0, -0.082, -0.32], [0, 0, -1], [0, -1, 0], [1, 0, 0], 0.07,
    (s) => 0.022 * sin(PI * s),
    (s) => 0.002 * (1 - 0.4 * s),
    (s) => 0.4, 3);

  // --- caudal fin: short, powerful, slightly heterocercal
  slab(m, [0, 0.012, -0.48], [0, 0.5, -1], [1, 0, 0], [0, 0.8, 0.5], 0.11,
    (s) => 0.036 * sin(PI * s), (s) => 0.003 * (1 - 0.4 * s), (s) => 0.8, 5);
  slab(m, [0, -0.012, -0.48], [0, -0.4, -1], [1, 0, 0], [0, -0.8, 0.5], 0.09,
    (s) => 0.028 * sin(PI * s), (s) => 0.003 * (1 - 0.4 * s), (s) => 0.8, 4);

  return m;
}

// ---------------------------------------------------------------- shaders
const S_TITANICHTHYS = /*wgsl*/`
// Instance: a.xyz = orbit centre, a.w = orbit radius R. b.x = seed, b.y = speed (rad/s, sign is direction),
// b.z = size in metres (~4.0), b.w = seed2. The orbit path is repeated in zooTitanichthys: change one, change
// the other. No mouth animation: the mesh is built with the mouth open
@vertex fn vsTitanichthys(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  let h = vec3f(hs(s), hs(s + .37), hs(s + .71));
  let R = i.a.w;
  // wide, very slow orbit
  let ta = t * i.b.y + i.b.w * 6.3 + s * 1.9;
  let ph = i.b.w * 17.;
  let P = i.a.xyz + vec3f(R * cos(ta), 1.2 * sin(2. * ta + ph), R * .5 * sin(ta));
  let T = normalize(vec3f(0. - R * sin(ta), 2.4 * cos(2. * ta + ph), R * .5 * cos(ta))) * sign(i.b.y);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  var l = i.p; var n = i.n.xyz;
  let sz = i.b.z * (.95 + .1 * h.z);
  // body wave: gentle, mostly the tail (body stiff under armour)
  let u = .5 - l.z;
  let stiff = step(0., u);
  let A = (.004 + .035 * u * u) * stiff;
  let wv = t * 4.5 + s * 25. - u * 4.;
  l.x += A * sin(wv);
  let sl = 4. * A * cos(wv) * stiff;
  n = vec3f(n.x + sl * n.z, n.y, n.z - sl * n.x);
  let w = dodge(P, sz + 4. * g.fwd.w, 0., 0.) + (S * l.x + Up * l.y + T * l.z) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z; o.op = i.p; o.sd = s; o.lt = i.n.w;
  return o;
}
@fragment fn fsTitanichthys(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let x = abs(i.op.x); let y = i.op.y; let z = i.op.z; let lt = i.lt;
  let h1 = hs(i.sd * 7.); let h2 = hs(i.sd * 23.);
  // parts
  let armour = step(.55, lt) * step(lt, .95);
  let head = step(.85, lt) * step(lt, .95);
  let trunk = step(.55, lt) * step(lt, .65);
  let body = step(-.25, lt) * step(lt, .25);
  let jaw = step(lt, -.85);
  let jawRim = step(-.55, lt) * step(lt, -.45);
  let gill = step(.30, lt) * step(lt, .40);
  let dfin = step(.42, lt) * step(lt, .48);
  let pvaf = step(.38, lt) * step(lt, .42);
  let fp = step(.48, lt) * step(lt, .52);
  let ridge = step(.62, lt) * step(lt, .68);
  let tail = step(.75, lt) * step(lt, .85);
  let iris = step(-.75, lt) * step(lt, -.65);
  let lens = step(lt, -.95);
  // disambiguate eyes from jaw by position
  let atEye = step(.24, z) * step(z, .40) * step(.005, x);
  let realIris = iris * atEye;
  let realLens = lens * atEye;
  let eye = realIris + realLens;
  let realJaw = jaw * (1. - atEye);
  let allFin = max(max(fp, dfin), max(pvaf, tail));
  // armour texture: cracks and grain, two lookups
  let tg = textureSample(tD, sR, vec2f(z * 14. + x * 9., y * 14.) + i.sd) * .5
    + textureSample(tD, sR, vec2f(z * 33. - x * 21., y * 29. + x * 17.) + i.sd + .37) * .5;
  let fine = ss(.006, .0015, fwidth(z) + fwidth(x) + fwidth(y));
  // plate seam patterns on the head armour: median line, transverse, orbital
  let median = ss(.005, .002, x) * step(.08, z) * step(z, .42) * head;
  let trans1 = ss(.005, .002, abs(z - .14)) * head;
  let trans2 = ss(.005, .002, abs(z - .28)) * head;
  let orb = ss(.012, .005, abs(length(vec2f(x - .08, z - .33)) - .035)) * head;
  let seam = sat(median + trans1 + trans2 + orb);
  let armRh = .004 * (tg.a - .5) * fine * (armour + head) + .002 * seam * fine;
  let skinRh = .002 * (tg.g - .5) * fine * body;
  let ridgeRh = .003 * fine * ridge;
  let rh = armRh + skinRh + ridgeRh;
  let n = skinRelief(ns, i.wp, rh);
  // colour: warmer grey-brown armour than Dunkleosteus, smooth dark skin behind
  let armC = mix(vec3f(.30, .26, .20), vec3f(.36, .31, .24), tg.g * .5 + h2 * .4);
  let skinC = mix(vec3f(.19, .17, .14), vec3f(.23, .20, .16), h2);
  var alb = mix(skinC, armC, armour + head);
  // plate seam lines: lighter, bonier
  alb = mix(alb, armC * 1.25 + vec3f(.06, .05, .03), seam * .6);
  // plate ridges: pale bone
  alb = mix(alb, vec3f(.42, .38, .30), ridge);
  // counter-shading: lighter belly
  alb = mix(alb, alb * 1.3 + vec3f(.06, .05, .04), ss(-.08, -.02, y) * .4);
  alb *= .85 + .32 * h1;
  alb *= .88 + .24 * tg.g;
  // jaw interior: pinkish, fleshy
  alb = mix(alb, mix(vec3f(.24, .16, .14), vec3f(.18, .13, .11), h2), realJaw);
  // jaw rim: pale bone
  alb = mix(alb, vec3f(.38, .34, .28), jawRim);
  // gill slits: dark interior
  alb = mix(alb, vec3f(.06, .05, .04), gill);
  // all fins and tail: slightly translucent, darker
  alb = mix(alb, alb * .6 + vec3f(.03, .02, .01), allFin);
  // eyes
  alb = mix(alb, vec3f(.04, .035, .02), realIris);
  alb = mix(alb, vec3f(.010, .008, .008), realLens);
  let zn = zone(i.wp);
  var c = skinWet(alb, n, ns, i.wp,
    .15 * body + .22 * (armour + head) + .30 * ridge + .08 * allFin + .15 * gill + .12 * jawRim + 1.0 * eye,
    .35 * body + .50 * (armour + head) + .55 * ridge + .20 * allFin + .25 * gill + .30 * jawRim + .6 * realIris + 1.5 * realLens);
  return fin(fog(c, i.wp, zn));
}
`;

// ---------------------------------------------------------------- zoo
// A Titanichthys on its orbit. Two parts spread along the orbit
const zooTitanichthys = (a, i, part) => {
  const R = a[i + 3], ph = a[i + 7] * 17, ta = F[TIME] * a[i + 5] + a[i + 7] * 6.3 + a[i + 4] * 1.9;
  const tb = ta + (part * 2 - 1) * 5 / R;
  const x = R * cos(ta), y = 1.2 * sin(2 * ta + ph), z = R * 0.5 * sin(ta);
  ZP[0] = a[i] + x; ZP[1] = a[i + 1] + y; ZP[2] = a[i + 2] + z;
  ZP[3] = R * cos(tb) - x; ZP[4] = 1.2 * sin(2 * tb + ph) - y; ZP[5] = R * 0.5 * sin(tb) - z; ZP[7] = 5.0;
};
