// ============================================================================
// devonian: Goniatite (early ammonoid)
// ============================================================================
// An early ammonoid with a coiled shell, 3 to 8 cm across, in groups of about 40. Its mesh, its shaders and, for
// the zoo, where it is at a time. The first of a line that fills the seas for 300 million years. What it shares with
// the other animals is in swimmers.js.

// A generic goniatite in the round. One unit across the shell. Sources: ammonoid morphology review (Kennedy and
// Cobban 1976); goniatite suture pattern (Korn 2010); three ammonoid-bearing levels known in the Cleveland Shale.
// Estimates: all proportions and dimensions (the shell is a smooth planispiral with simple zigzag sutures)
// aux: 0 shell outer, 0.5 shell inner (visible at the opening), 0.9 tentacles
function meshGoniatite() {
  const m = new Mesh();
  rseed(350);
  // coiled shell in the YZ plane, 2.5 whorls, opening at +z. The tube grows as the spiral expands
  const N = 48, pts = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, a = t * 2.5 * TAU + PI;
    const r = 0.04 + 0.42 * pow(t, 1.3);
    pts.push([0, sin(a) * r, cos(a) * r]);
  }
  m.tube(pts, (k) => 0.012 + 0.065 * pow(k / N, 1.15), 8, true, (k) => k / N);
  // tentacles: short, emerging from the opening at the outer whorl
  const oZ = 0.46;
  for (let j = 0; j < 6; j++) {
    const ang = j / 6 * TAU, dx = cos(ang) * 0.04, dy = sin(ang) * 0.04;
    const tl = rr(0.05, 0.09);
    const n0 = m.p.length / 3;
    m.tube([[dx, dy, oZ + 0.01], [dx * 1.3, dy * 1.3, oZ + tl * 0.5], [dx * 0.9 + rr(-0.004, 0.004), dy * 0.9, oZ + tl]], () => 0.005, 4, true);
    for (let k = n0; k < m.aux.length; k++) m.aux[k] = 0.9;
  }
  return m;
}

// ---------------------------------------------------------------- shaders
const S_GONIATITE = /*wgsl*/`
// Instance: a.xyz = group centre, a.w = orbit radius R. b.x = individual seed, b.y = group speed (rad/s, sign is
// direction), b.z = size in metres (the shell diameter), b.w = group seed. The path P is repeated in zooGoniatite:
// change one, change the other
@vertex fn vsGoniatite(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  let h = vec3f(hs(s), hs(s + .37), hs(s + .71));
  let R = i.a.w;
  // jet propulsion: every 2 to 3 s (a beat of its own for each animal) it jets, then coasts and slows down. tj is
  // the time it has swum at the speed of its group: it only ever grows, fast just after a jet, slowly before the
  // next one, so the animal never slides back. Peak speed about 2.7 times the mean
  let Pj = 2. + fract(s * 7.31);
  let jc = t / Pj + fract(s * 3.7);
  let jx = fract(jc);
  let tj = Pj * (floor(jc) + (1. - exp(0. - 2.5 * jx)) / .917915);
  let ta = tj * i.b.y + i.b.w * 6.3 + (h.x - .5) * (6. / R);
  let ph = i.b.w * 17.;
  let P = i.a.xyz + vec3f(R * cos(ta), .8 * sin(2. * ta + ph), R * .5 * sin(ta));
  let T = normalize(vec3f(0. - R * sin(ta), 1.6 * cos(2. * ta + ph), R * .5 * cos(ta))) * sign(i.b.y);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  let off = S * ((h.y - .5) * .6 + sin(t * .3 + s * 30.) * .1) + Up * ((h.z - .5) * .4 + cos(t * .3 + s * 20.) * .08);
  var l = i.p; var n = i.n.xyz;
  let sz = i.b.z * (.85 + .3 * h.z);
  // the shell rocks with each jet: it tips as the jet pushes and settles while it coasts (0 at the jet and before it)
  let bob = .12 * sin(TAU * jx) * exp(0. - 2. * jx);
  let cb = cos(bob); let sb = sin(bob);
  l = vec3f(l.x, l.y * cb - l.z * sb, l.y * sb + l.z * cb);
  n = vec3f(n.x, n.y * cb - n.z * sb, n.y * sb + n.z * cb);
  let w = dodge(P + off, .5 * sz + 2. * g.fwd.w, 0., 0.) + (S * l.x + Up * l.y + T * l.z) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z; o.op = i.p; o.sd = s; o.lt = i.n.w;
  // ---- dead on the floor (devonian-remains.md): b.y = 0.0001 marks an animal that lies still on its left side on the
  // mud, at a.xyz (world.js has raised a.y so that it is sunk in by a fifth of its width), turned by a.w
  if (abs(i.b.y) < .001) {
    let Td = vec3f(sin(i.a.w), 0., cos(i.a.w)); let Sd = vec3f(0., 1., 0.); let Ud = cross(Td, Sd);
    let pd = select(i.p, vec3f(0., 0., .44), i.n.w > .8);
    let wd = i.a.xyz + (Sd * pd.x + Ud * pd.y + Td * pd.z) * i.b.z;
    o.cp = g.vp * vec4f(wd, 1.); o.wp = wd; o.n = Sd * i.n.x + Ud * i.n.y + Td * i.n.z; o.sd = i.b.x + 10.;
  }
  return o;
}
@fragment fn fsGoniatite(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let z = i.op.z; let lt = i.lt;
  let h1 = hs(i.sd * 7.); let h2 = hs(i.sd * 23.);
  let tg = textureSample(tD, sR, vec2f(z * 25. + i.op.x * 15., i.op.y * 25.) + i.sd) * .5
    + textureSample(tD, sR, vec2f(z * 51. - i.op.x * 31., i.op.y * 47.) + i.sd + .37) * .5;
  let shell = step(lt, .6);
  let tent = 1. - shell;
  // zigzag suture lines along the shell: lt carries the position along the spiral (0 at centre, 1 at opening)
  let su = lt * 20.;
  let sv = atan2(i.op.y, i.op.x) * 2.;
  let fine = ss(.006, .0015, fwidth(z) + fwidth(i.op.x) + fwidth(i.op.y));
  let zig = abs(sin(su * 6.3 + sv * 3.)) * fine;
  // growth bands: concentric ridges following the spiral
  let gb = (.5 + .5 * cos(lt * 120.)) * ss(1.8, .6, fwidth(lt * 120.)) * shell;
  let rh = (.004 * zig + .002 * gb + .002 * (tg.a - .5) * fine) * shell;
  let n = skinRelief(ns, i.wp, rh);
  // colour: warm shell with growth band variation and per-individual tone
  let warm = mix(vec3f(.44, .38, .28), vec3f(.56, .48, .34), h2);
  let cool = mix(vec3f(.38, .40, .34), vec3f(.50, .52, .42), h2);
  var alb = mix(warm, cool, .3 + .3 * sin(lt * 25. + h1 * 6.));
  // growth bands as color stripes
  alb *= .92 + .16 * gb;
  // darker suture grooves
  alb *= 1. - .25 * zig;
  // inner shell (visible at aperture): slightly pearlescent
  alb = mix(alb, alb * vec3f(1.1, 1.05, .95) + vec3f(.06, .04, .02), step(.5, lt) * shell * .3);
  alb *= .82 + .4 * h1;
  alb *= .88 + .24 * tg.g;
  // tentacles: pinkish-brown with darker tips
  let tv = sat((lt - .9) / .1);
  alb = mix(alb, mix(vec3f(.52, .36, .28), vec3f(.35, .22, .18), tv), tent);
  // ---- dead on the floor (devonian-remains.md): duller and darker, black mud settled on what faces up
  let deadF = step(5., i.sd); let deadUp = ss(.15, .75, normalize(i.n).y);
  alb = mix(alb, mix(alb * .55, vec3f(.030, .028, .024) * (.8 + .4 * vn(i.wp * 6.)), .85 * deadUp), deadF);
  // light
  let dist = length(i.wp - g.cam.xyz);
  let ca = caus(i.wp, dist);
  let zn = zone(i.wp); let V = normalize(g.cam.xyz - i.wp); let H = normalize(V + g.sun.xyz);
  let E = sunE(i.wp.y, zn);
  let vv = vol(i.wp).g;
  var c = alb * (E * sat(dot(n, g.sun.xyz)) * .65 * (.3 + ca.g * .7) + amb(i.wp, vec3f(n.x, abs(n.y) * .55 + .25, n.z), vv, zn) * 1.1 + side(i.wp, n, 1., zn) * .8)
    + E * (pow(sat(dot(n, H)), 50.) * (.25 * shell + .10 * tent) + pow(sat(dot(ns, H)), 70.) * (.50 * shell + .15 * tent));
  c += amb(i.wp, vec3f(0., 1., 0.), vv, zn) * pow(1. - sat(dot(n, V)), 3.) * .2 * shell;
  return fin(fog(c, i.wp, zn));
}
`;

// ---------------------------------------------------------------- zoo
// A group of goniatites: the path of vsGoniatite without the per-individual offset, with the same jets (the group
// has seed 0 here). Two lines from the middle
const zooGoniatite = (a, i, part) => {
  const s = a[i + 4], Pj = 2 + (s * 7.31 - floor(s * 7.31)), jc = F[TIME] / Pj + (s * 3.7 - floor(s * 3.7));
  const tj = Pj * (floor(jc) + (1 - exp(-2.5 * (jc - floor(jc)))) / 0.917915);
  const R = a[i + 3], ph = a[i + 7] * 17, ta = tj * a[i + 5] + a[i + 7] * 6.3, tb = ta + (part * 2 - 1) * 2 / R;
  const x = R * cos(ta), y = 0.8 * sin(2 * ta + ph), z = R * 0.5 * sin(ta);
  ZP[0] = a[i] + x; ZP[1] = a[i + 1] + y; ZP[2] = a[i + 2] + z;
  ZP[3] = R * cos(tb) - x; ZP[4] = 0.8 * sin(2 * tb + ph) - y; ZP[5] = R * 0.5 * sin(tb) - z; ZP[7] = 0.6;
};
