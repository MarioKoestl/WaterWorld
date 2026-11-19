// ============================================================================
// cambrian: Marrella
// ============================================================================
// Its mesh, its shaders and, for the zoo, where it is at a time. world.js lists it as a kind and gives it its
// instances. The mesh is modelled around the origin, nose at +z, y up: the instance says how large the animal is in
// the world. aux, the fourth number of a vertex, tells the shaders which part of the animal a vertex belongs to.
// What it shares with the other animals of this era (pieces for the mesh, the light on a skin, giving way to the
// viewer) is in swimmers.js.

// Marrella splendens in the round. One unit from the front of the head shield to the tips of the long spines.
// What the sources say (Royal Ontario Museum, Burgess Shale fossil gallery, "Marrella splendens",
// https://burgess-shale.rom.on.ca/fossils/marrella-splendens/, and Wikipedia, "Marrella", after Garcia-Bellido and
// Collins 2006; both read on 2026-11-17): a wedge-shaped head shield; two pairs of long spines from its sides and
// from its upper rear edge, curved back along most of the body, and a smaller pair at its lower rear corners; a pair
// of long thin feelers of about 30 pieces, 15 to 30 degrees out from the middle line; behind them a pair of stout
// paddles fringed with bristles, with which it swam; a trunk of up to 26 small round segments, each with a leg of six
// pieces and, from near the foot of the leg, a tapering gill with long slim filaments; legs and gills shorter to the
// rear, faster from the ninth pair on; no tail piece to speak of.
// Estimates: every height. The fossils are pressed flat and no source at hand gives a section, so the shield is a
// wedge about half as high as wide at its rear, the spines are round, and the upper pair arches over the trunk. Of
// the 26 pairs of limbs the mesh has MR_N: more would be finer than anyone sees on an animal of 2 cm. The saw edge
// of the upper spines is left out for the same reason.
// The limbs in figures. MR_Z0, MR_DZ: where the first pair is and how far the pairs are apart. The gills all lie the
// same way: out and back along MR_GD (for the right side), their filaments along MR_GC, and the foot of the gill k
// is at MR_GX0 - k * MR_GDX to the side. So the fragment shader can tell from a place alone which gill it is on, how
// far out along it and how far from its shaft (it cuts the gaps between the filaments out of a plain strip).
// MR_LK: how long the limbs of a pair are against the longest
const MR_N = 15, MR_Z0 = 0.19, MR_DZ = 0.04, MR_GX0 = 0.034, MR_GDX = 0.0017, MR_GA = 38.5 * PI / 180, MR_GE = 6 * PI / 180;
const MR_GC = [cos(MR_GA), 0, sin(MR_GA)], MR_GD = [sin(MR_GA) * cos(MR_GE), -sin(MR_GE), -cos(MR_GA) * cos(MR_GE)];
const MR_LK = [1, 1, 1, 1, 0.98, 0.95, 0.92, 0.88, 0.84, 0.78, 0.7, 0.62, 0.54, 0.46, 0.38];
// the trunk as sections [z, half width, half height, height of its middle], from the tail forward to under the shield
const MR_TRUNK = [[-0.41, 0.005, 0.005, 0], [-0.32, 0.014, 0.012, 0], [-0.15, 0.028, 0.022, 0], [0.05, 0.04, 0.03, 0], [0.22, 0.046, 0.034, -0.004], [0.34, 0.04, 0.028, -0.012], [0.42, 0.02, 0.016, -0.012]];
// a number as WGSL takes it as a float
const mrNum = (v) => { const s = String(+v.toFixed(6)); return /[.e]/.test(s) ? s : s + '.'; };
// aux: 0 on the head shield, -.3 on its spines, -.5 on the trunk, .02 to .3 down a leg, .35 to .6 out along a gill,
// .65 to .85 along a feeler, .88 to 1 out along a paddle
function meshMarrella() {
  const m = new Mesh(), cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  // the head shield: a wedge, low and narrow in front, high and wide at its rear, vaulted above and nearly flat
  // below, with a round rim (no knife edge)
  loft(m, [[0.215, 0.098, 0.05, 0.014], [0.26, 0.115, 0.056, 0.016], [0.33, 0.1, 0.048, 0.012], [0.4, 0.075, 0.036, 0.006], [0.46, 0.045, 0.022, 0], [0.5, 0.012, 0.008, -0.004]], 2, 12, 0,
    (a) => [(cos(a) < 0 ? -1 : 1) * pow(abs(cos(a)), 0.7), sin(a) > 0 ? pow(sin(a), 0.9) : -0.45 * pow(-sin(a), 0.6)]);
  // the trunk, from its small end to under the shield, where the mouth is
  loft(m, MR_TRUNK, 2, 8, -0.5);
  for (const sx of [-1, 1]) {
    // the side spines: out of the sides of the shield in a wide curve and back along the body, rising a little
    m.tube(curve([[sx * 0.085, 0.012, 0.275], [sx * 0.22, 0.03, 0.235], [sx * 0.325, 0.048, 0.08], [sx * 0.35, 0.064, -0.13], [sx * 0.305, 0.076, -0.34], [sx * 0.215, 0.082, -0.5]], 8), (k) => 0.027 * (1 - k / 8.6), 5, true, () => -0.3);
    // the upper spines: from the rear of the shield's top up and back in an arch over the trunk
    m.tube(curve([[sx * 0.045, 0.045, 0.25], [sx * 0.07, 0.125, 0.15], [sx * 0.1, 0.18, -0.04], [sx * 0.125, 0.19, -0.26], [sx * 0.125, 0.16, -0.47]], 8), (k) => 0.023 * (1 - k / 8.6), 5, true, () => -0.3);
    // the small ones at the lower rear corners: back, out and down
    m.tube(curve([[sx * 0.08, 0.002, 0.235], [sx * 0.106, -0.022, 0.15], [sx * 0.116, -0.04, 0.06]], 3), (k) => 0.012 * (1 - k / 3.5), 4, true, () => -0.3);
    // a feeler: from under the front of the shield forward and out, thick at its foot
    m.tube(curve([[sx * 0.022, -0.016, 0.43], [sx * 0.05, -0.014, 0.55], [sx * 0.095, -0.004, 0.68], [sx * 0.16, 0.008, 0.8], [sx * 0.23, 0.012, 0.88]], 7), (k) => 0.0105 - 0.0078 * k / 7, 4, true, (k) => 0.65 + 0.2 * k / 7);
    // a paddle: a stout limb from under the head out to the side, a little down and forward, that widens to a blade
    {
      const l = hypot(0.8, 0.35, 0.3), d = [sx * 0.8 / l, -0.35 / l, 0.3 / l], h = hypot(d[2], d[0]), c = [-d[2] / h, 0, d[0] / h];
      slab(m, [sx * 0.03, -0.022, 0.335], d, c, cross(d, c), 0.2, (s) => mix(0.009, 0.026, sstep(0.15, 0.6, s)) * sqrt(1 - 0.8 * max(s - 0.75, 0) * max(s - 0.75, 0) * 16), (s) => 0.0085 * (1 - 0.6 * s), (s) => 0.88 + 0.12 * s, 4);
    }
    // under the trunk the pairs of limbs. A leg: out of the side of the trunk, over a knee and down to its claw,
    // no two quite alike. Over it a gill: a strip with a thickness, out and back, drooping to its tip
    const gd = [sx * MR_GD[0], MR_GD[1], MR_GD[2]], gc = [sx * MR_GC[0], 0, MR_GC[2]], gu = cross(gd, gc);
    for (let k = 0; k < MR_N; k++) {
      const z = MR_Z0 - k * MR_DZ, q = MR_LK[k], r = wideAt(MR_TRUNK, z), j = sin(k * 2.4 + sx);
      m.tube([[sx * (r - 0.006), -0.014, z], [sx * (r + 0.04 * q), -0.03 - 0.012 * q, z - 0.006 * q], [sx * (r + (0.068 + 0.007 * j) * q), -0.03 - 0.055 * q, z - (0.02 + 0.007 * j) * q], [sx * (r + 0.058 * q), -0.03 - 0.105 * q, z - (0.05 - 0.006 * j) * q]],
        (i) => [0.0078, 0.0068, 0.0052, 0.0017][i] * (0.6 + 0.4 * q), 3, true, (i) => 0.02 + 0.28 * i / 3);
      const root = [sx * (MR_GX0 - MR_GDX * k), 0.002, z], len = 0.17 * q, rings = [];
      for (let i = 0; i <= 2; i++) {
        const s = i / 2, w = 0.0118 * (1 - 0.5 * s), t = 0.0042 * (1 - 0.4 * s), c = root.map((v, a) => v + gd[a] * s * len); c[1] -= 0.014 * s * s * q;
        rings.push([[1, 0], [0, 1], [-1, 0], [0, -1]].map(([e, f]) => m.v(c[0] + gc[0] * e * w + gu[0] * f * t, c[1] + gc[1] * e * w + gu[1] * f * t, c[2] + gc[2] * e * w + gu[2] * f * t, 0.35 + 0.25 * s)));
      }
      for (let i = 0; i < 2; i++) for (let e = 0; e < 4; e++) m.quad(rings[i][e], rings[i][(e + 1) % 4], rings[i + 1][(e + 1) % 4], rings[i + 1][e]);
      m.quad(...rings[2]);
    }
  }
  return m;
}
const S_MARRELLA = /*wgsl*/`
const MR_NL = ${mrNum(MR_N - 1)}; const MR_Z0 = ${mrNum(MR_Z0)}; const MR_DZ = ${mrNum(MR_DZ)}; const MR_GX0 = ${mrNum(MR_GX0)}; const MR_GDX = ${mrNum(MR_GDX)};
const MR_GC = vec2f(${mrNum(MR_GC[0])}, ${mrNum(MR_GC[2])}); const MR_GD = vec3f(${MR_GD.map(mrNum).join(', ')});
// Instance: a = the middle of the round its swarm makes (x, z) and how wide that round is (w), b = its own seed, the
// speed of the swarm (rad/s, the sign is the direction), its length, the seed of the swarm.
// The round of a swarm (mrP) is repeated in zooMarrella below, which has to know where a swarm is: change one,
// change the other
fn mrP(ta: f32, a: vec4f, ph: f32) -> vec2f { return a.xz + a.w * vec2f(cos(ta) * (1. + .22 * sin(2. * ta + ph)), .7 * sin(ta) * (1. + .22 * cos(3. * ta + ph))); }
@vertex fn vsMarrella(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x; let h = vec3f(hs(s), hs(s + .37), hs(s + .71)); let R = i.a.w; let ph = i.b.w * 17.; let au = i.n.w;
  // each animal has its place in the swarm (so far along the round, so far to the side, so high over the mud) and
  // wanders about that place
  let ta = t * i.b.y + i.b.w * 6.3 + ((h.x - .5) * 14. + 1.5 * sin(t * .23 + s * 40.)) * TSC / R;
  let p0 = mrP(ta, i.a, ph); let T2 = normalize(mrP(ta + .4 * TSC / R, i.a, ph) - p0) * sign(i.b.y); let S2 = vec2f(T2.y, -T2.x);
  let q = p0 + S2 * ((h.y - .5) * 8. + sin(t * .31 + s * 31.)) * TSC;
  let bob = t * .5 + s * 50.;
  let y = ground(q) + (.4 + 2.2 * h.z * sqrt(h.z) + .3 * sin(bob)) * TSC;
  // it heads along the round, turning a little this way and that, nose up while it rises and down while it sinks
  let yaw = .5 * sin(t * .7 + s * 23.);
  var T = vec3f(T2.x, 0., T2.y) * cos(yaw) + vec3f(S2.x, 0., S2.y) * sin(yaw); let S = vec3f(T.z, 0., -T.x);
  T = normalize(T + vec3f(0., .3 * cos(bob), 0.)); let Up = cross(T, S);
  // How its parts move (aux says which part a vertex is of, and how far out along it). wl: down a leg, wg: out along
  // a gill, wf: along a feeler, wp: out along a paddle
  var l = i.p; let sg = select(-1., 1., l.x > 0.);
  let wl = sat((au - .02) / .28) * step(.01, au) * step(au, .325); let wg = sat((au - .35) / .25) * step(.325, au) * step(au, .625);
  let wf = sat((au - .65) / .2) * step(.625, au) * step(au, .865); let wp = sat((au - .88) / .12) * step(.865, au);
  // the legs beat one after the other: a wave runs forward along the body. Each swings back and forth about where
  // it leaves the trunk and lifts on its way forward
  let bt = t * 9. + l.z * 15. + s * 60.;
  l += vec3f(0., .016 * max(cos(bt), 0.), .04 * sin(bt)) * wl * wl;
  // the gills trail behind the legs' beat, and a ripple runs out along each
  let gt = bt - 1.2 - wg * 2.2;
  l += vec3f(0., .022 * sin(gt), .012 * cos(gt)) * wg;
  // the feelers sweep slowly from side to side and feel up and down
  l += vec3f(sg * .06 * sin(t * 1.1 + s * 20. + sg * .9 - wf * 1.5), .035 * sin(t * .8 + s * 13. + sg - wf * 2.), 0.) * wf * wf;
  // the paddles row: back fast and flat out, forward slowly and drooping
  let ro = t * 5. + s * 44.; let rs = sin(ro + .6 * sin(ro));
  l += vec3f(0., -.03 * max(cos(ro), 0.), -.085 * rs) * wp;
  // the trunk bends up and down behind the shield, and its legs and gills go with it
  let ub = sat((.22 - i.p.z) / .6) * (step(au, -.4) + step(.01, au) * step(au, .625));
  l.y += ub * ub * (.03 + .05 * sin(t * 2.1 + s * 37.));
  // the trunk sways as it swims: a low wave that runs back along the body
  l.x += ub * .012 * sin(t * 4.3 + s * 33. + (.22 - i.p.z) * 12.);
  let w = dodge(vec3f(q.x, y, q.y), .75 * i.b.z + 2. * g.fwd.w, 1., 0.) + (S * l.x + Up * l.y + T * l.z) * i.b.z;
  // (the fragment shader needs the length too: it travels with the seed, as whole quarter millimetres)
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * i.n.x + Up * i.n.y + T * i.n.z; o.op = i.p; o.sd = floor(i.b.z * 4000.) + s; o.lt = au;
  return o;
}
// The skin. Colours are free: no fossil shows them. A dark steel blue shell, darkest along the middle of the shield
// and paler to its rim, mottled, with a soft blue sheen where it is seen at a flat angle (strongest on the spines);
// a paler, ringed trunk; pale blue-grey legs with dark claws; and the gills in orange red, which light up against
// the sun. Each animal in its own tone.
// (That the spines shimmered in rainbow colours is not built: Parker 1998, Proc. R. Soc. B 265, reports a diffraction
// grating on Marrella, but the paper could not be read for this, and the same reading is disputed for the two other
// animals it names. The sheen here is plain, and a free choice like the rest.)
@fragment fn fsMarrella(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let L = floor(i.sd) / 4000.; let sd = fract(i.sd); let lt = i.lt;
  let x = abs(i.op.x); let y = i.op.y; let z = i.op.z;
  let leg = step(.01, lt) * step(lt, .325); let gill = step(.325, lt) * step(lt, .625); let feel = step(.625, lt) * step(lt, .865); let pad = step(.865, lt);
  let spine = step(lt, -.2) * step(-.4, lt); let trunk = step(lt, -.4); let shield = step(-.1, lt) * step(lt, .01);
  let wl = sat((lt - .02) / .28); let wg = sat((lt - .35) / .25); let wf = sat((lt - .65) / .2); let wp = sat((lt - .88) / .12);
  let ns = normalize(i.n) * select(-1., 1., ff); let V = normalize(g.cam.xyz - i.wp);
  // (two looks at the mottling, each turned its own way: one alone shows the grid of the texture)
  let tg = textureSample(tD, sR, vec2f(i.op.x * 41. + z * 23., z * 37. - i.op.x * 19.) + y * vec2f(29., 43.) + sd) * .5
    + textureSample(tD, sR, vec2f(i.op.x * 67. - z * 31., z * 71. + i.op.x * 43.) + y * vec2f(53., 31.) + .37) * .5;
  // (the relief fades where it would be finer than the pixels)
  let fine = ss(.02, .005, fwidth(z) + fwidth(x));
  // A gill: which one (gk), how far from its shaft (ga) and how far out along it (gu). Between its filaments, which
  // slant out towards the tip, there is nothing: those pixels are left out. Where the filaments get finer than the
  // pixels the gaps close, and the gill is a plain strip
  let gv = (dot(MR_GC, vec2f(MR_GX0, MR_Z0)) - dot(MR_GC, vec2f(x, z))) / dot(MR_GC, vec2f(MR_GDX, MR_DZ)); let gk = clamp(round(gv), 0., MR_NL);
  let ga = abs(gv - gk) * dot(MR_GC, vec2f(MR_GDX, MR_DZ));
  let gu = dot(MR_GD, vec3f(x - MR_GX0 + MR_GDX * gk, y, z - MR_Z0 + MR_DZ * gk));
  let gf = (gu - ga * .9) * 95.; let gap = ss(.9, .3, fwidth(gu) * 95.);
  let shaft = ss(.0042, .0028, ga);
  if (gill > .5 && shaft < .5 && fract(gf) > 1. - .5 * gap) { discard; }
  // the relief: granules on the shield and the spines, a low keel along the middle of the shield, a rib for every
  // segment of the trunk
  let rib = pow(abs(sin(3.14159 * (.22 - z) / .0242)), .7);
  let keel = exp(-x * x / .0004) * ss(.2, .3, z);
  let n = skinRelief(ns, i.wp, ((shield + spine) * .0028 * (tg.a - .5) + shield * .004 * keel + trunk * .007 * rib) * fine * L);
  let tone = fract(sd * 13.7); let hue = fract(sd * 5.3);
  let dk = mix(vec3f(.06, .10, .22), vec3f(.08, .09, .24), hue);
  let md = mix(vec3f(.14, .26, .46), vec3f(.18, .24, .48), hue);
  let pale = vec3f(.42, .58, .72);
  // the shell: dark along the middle and at the rear of the shield, paler to its rim and where it turns under; pale
  // flecks; the spines of the same stuff, darker to their tips
  let rim = shield * ss(.6, 1., x / max(.115 * pow(sat((.505 - z) / .245), .62) - max(.26 - z, 0.) * .38, .01));
  var alb = mix(md, dk, sat(shield * (ss(.06, .0, x) * .5 + ss(.3, .22, z) * .3) + spine * ss(.1, -.5, z) * .5));
  alb = mix(alb, pale, sat(rim * .65 + ss(.55, .8, tg.b) * .35 * (shield + spine)));
  alb *= (.8 + .4 * tg.g) * mix(.65, 1., ss(-.6, .1, ns.y));
  // seen at a flat angle the shell is paler and bluer: its sheen
  let graze = pow(1. - sat(dot(ns, V)), 2.5);
  alb = mix(alb, vec3f(.35, .60, .85), graze * (.45 * shield + .7 * spine + .12 * trunk));
  // the trunk: ringed, dark in the furrows between its segments, paler below
  alb = mix(alb, mix(vec3f(.24, .35, .48), vec3f(.12, .20, .34), ss(-.5, .6, ns.y)) * (.5 + .5 * mix(1., rib, fine)) * (.85 + .3 * tg.g), trunk);
  // legs and feelers: blue-grey, ringed at their joints, the claws dark; the paddles the same, their bristles pale
  let jt = mix(wl * 6., wf * 30., feel); let ring = ss(.34, .5, abs(fract(jt) - .5)) * ss(1.2, .4, fwidth(jt));
  alb = mix(alb, mix(vec3f(.40, .48, .56), vec3f(.09, .11, .16), ss(.7, 1., wl)) * (1. - .35 * ring), leg);
  alb = mix(alb, mix(md * 1.3, vec3f(.45, .56, .64), wf) * (1. - .35 * ring), feel);
  let br = wp * 26.; let bristle = ss(.2, .5, abs(fract(br) - .5)) * ss(1.2, .4, fwidth(br)) * ss(.25, .6, wp);
  alb = mix(alb, mix(md * 1.2, vec3f(.50, .58, .62), bristle * .7), pad);
  // the gills: a dark orange shaft, the filaments orange red, paler to their ends
  let gcol = mix(vec3f(1., .38, .12), vec3f(.90, .20, .10), hue);
  alb = mix(alb, mix(mix(gcol, vec3f(1., .65, .36), ss(.004, .012, ga) * .6), vec3f(.45, .15, .06), shaft) * (.85 + .3 * tg.g), gill);
  alb *= mix(.82, 1.3, tone);
  // its light: that of a wet skin (skinWet of S_SEA), and the sun that comes through the gills from behind
  let shell = shield + spine; let soft = trunk + leg + feel + pad;
  var c = skinWet(alb, n, ns, i.wp, .25 * shell + .12 * soft, .65 * shield + 1. * spine + .3 * soft + .18 * gill);
  c += gill * alb * vec3f(1.3, .9, .65) * sunE(i.wp.y, 0.) * shadow1(i.wp + g.sun.xyz * .05) * (.4 * sat(-dot(ns, g.sun.xyz)) + 1. * pow(sat(-dot(V, g.sun.xyz)), 4.)) * TRANS;
  return fin(fog(c, i.wp, zone(i.wp)));
}
`;
// A swarm of Marrella: mrP of vsMarrella. The swarm spreads 0.4 m along its round to both sides of its middle: a
// line through the middle, 0.23 m each way, each end 6 cm over the mud that is under it
const zooMarrella = (a, i) => {
  const R = a[i + 3], ph = a[i + 7] * 17, ta = F[TIME] * a[i + 5] + a[i + 7] * 6.3, t0 = ta - 4.5 * TS / R, t1 = ta + 4.5 * TS / R;
  const x = a[i] + R * cos(t0) * (1 + 0.22 * sin(2 * t0 + ph)), z = a[i + 2] + R * 0.7 * sin(t0) * (1 + 0.22 * cos(3 * t0 + ph));
  const x1 = a[i] + R * cos(t1) * (1 + 0.22 * sin(2 * t1 + ph)), z1 = a[i + 2] + R * 0.7 * sin(t1) * (1 + 0.22 * cos(3 * t1 + ph));
  ZP[0] = x1; ZP[1] = 1.2 * TS; ZP[2] = z1; zooGround(); const y1 = ZP[1];
  ZP[0] = x; ZP[1] = 1.2 * TS; ZP[2] = z; zooGround();
  ZP[3] = x1 - x; ZP[4] = y1 - ZP[1]; ZP[5] = z1 - z; ZP[7] = 2.5 * TS;
};
