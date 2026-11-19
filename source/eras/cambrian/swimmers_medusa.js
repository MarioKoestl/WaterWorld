// ============================================================================
// cambrian: the jellyfish Burgessomedusa
// ============================================================================
// Its mesh, its shaders and, for the zoo, where it is at a time. world.js lists it as a kind and gives it its
// instances. The mesh is modelled around the origin, y up: the instance says how large the animal is in the world.
// aux, the fourth number of a vertex, tells the shaders which part of the animal a vertex belongs to.
// What it shares with the other animals of this era (pieces for the mesh, the light on a skin, giving way to the
// viewer) is in swimmers.js.

// The jellyfish Burgessomedusa phasmiformis in the round. Moon, Caron and Moysiuk (Proceedings of the Royal Society B
// 290, 2023: https://pmc.ncbi.nlm.nih.gov/articles/PMC10394413) describe it from 182 fossils, every one pressed flat.
// From them, in heights of the bell: the bell is oblong, 0.4 wide, and tapers to a smooth, domed top; it has four
// sides (some fossils are "cuboidal") and four textured zones down its corners with smooth ones between them. The
// stomach is a large half ball under the top, the top third of the height. From it hangs a thin column, the mouth
// tube, to between a half and two thirds of the height (here 0.62). Four long ovoid gonads, 0.45 long, lie along the
// corners, halfway between the rim and the tube. More than 90 tentacles like fingers, 0.15 long and evenly spaced,
// grow from the inner side of the rim and taper to a smooth point. No canals, no sense organs and no shelf at the rim
// were found.
// Estimates, because no fossil shows them: how thick the wall is (as in living box jellyfish: about 0.09 at the top,
// 0.03 down the sides, under 0.01 at the rim), the four shallow pouches of the stomach and the four lips of the mouth.
// One unit from the rim (y = 0) to the top (y = 1), the tentacles hang below.
// MD_TOP: how high the hollow under the bell reaches. mdOut, mdIn: how wide the bell is at a height on its outside
// and in its hollow (half of it, across its flat sides). mdEx: its outline at a height, from square with round
// corners (4.2) below to a circle (2) at the top. fsMedusa has mdOut and the thickness of the wall too: change one,
// change the other
const MD_TOP = 0.91;
const mdOut = (y) => 0.2 * sqrt(max(1 - pow(max(y, 0), 3.4), 0));
const mdIn = (y) => 0.176 * sqrt(max(1 - pow(max(y, 0) / MD_TOP, 3), 0)) + 0.016 * (1 - sstep(0, 0.14, y));
const mdEx = (y) => 2 + 2.2 * (1 - sstep(0.5, 0.97, y));
// the outline of a section at the angle a: e = 2 a circle, more a square with round corners, less a star with four
// blunt points on the axes
const mdSq = (a, e) => { const c = cos(a), s = sin(a), k = pow(pow(abs(c), e) + pow(abs(s), e), -1 / e); return [c * k, s * k]; };
// n angles that stand evenly along such an outline (evenly by angle, the corners would get fewer)
const mdEven = (n, e) => {
  const M = 1440, L = [0]; let p = mdSq(0, e);
  for (let k = 1; k <= M; k++) { const q = mdSq(k / M * TAU, e); L.push(L[k - 1] + hypot(q[0] - p[0], q[1] - p[1])); p = q; }
  return Array.from({ length: n }, (_, j) => { const l = (j + 0.5) / n * L[M]; let k = 0; while (L[k + 1] < l) k++; return (k + (l - L[k]) / (L[k + 1] - L[k])) / M * TAU; });
};
// The mesh. The animal is see-through: its triangles are laid over each other in the order of the mesh, and nothing
// sorts them. So the parts come from the inside out: the hollow under the bell, the stomach with the mouth tube, the
// gonads, the tentacles, and last the outside of the bell with its rim. Every part but the hollow is shown from its
// outside only (fsMedusa), so each is built with its outside as its front. The order is right from the side, from
// above and from below.
// aux: 0 the outside of the bell, -0.5 the hollow, -0.75 a gonad, -0.9 the mouth tube, -1 the stomach. Above 0 a
// tentacle, which carries two numbers there: (1 + 16 k + h) / 127, with k the ring down the tentacle (0 at its root,
// 6 its tip) and h a number of its own from 0 to 15, so that each tentacle can move a little differently
function meshMedusa() {
  const m = new Mesh();
  // a ring of points round the axis at the height y, w wide, with the outline e, at the angles A
  const ring = (y, w, e, A, aux) => A.map((a) => { const [x, z] = mdSq(a, e); return m.v(x * w, y, z * w, aux); });
  // A surface through rings that all go round the same way (from +x towards +z), closed with a point before the
  // first (first) and after the last (last) where one is given. With the rings from the top down its front is its
  // outside, from the bottom up its inside
  const skin = (rings, first, last) => {
    for (let k = 0; k < rings.length - 1; k++) for (let s = 0, n = rings[k].length; s < n; s++) { const s2 = (s + 1) % n; m.quad(rings[k][s], rings[k][s2], rings[k + 1][s2], rings[k + 1][s]); }
    const a = rings[0], b = rings[rings.length - 1];
    if (first !== undefined) for (let s = 0; s < a.length; s++) m.tri(a[(s + 1) % a.length], a[s], first);
    if (last !== undefined) for (let s = 0; s < b.length; s++) m.tri(b[s], b[(s + 1) % b.length], last);
  };
  // n angles round the axis; bend: closer together at the four corners, where the outline of the bell turns
  const round = (n, bend = 0) => Array.from({ length: n }, (_, s) => { const u = s / n * TAU; return u + bend * sin(4 * u); });
  // the hollow, from the rim up: its front looks into the hollow
  const AI = round(48, 0.12), hollow = [];
  for (let k = 0; k < 14; k++) { const y = 0.001 + (MD_TOP - 0.001) * (1 - pow(1 - k / 14, 2)); hollow.push(ring(y, mdIn(y), mdEx(y / MD_TOP), AI, -0.5)); }
  skin(hollow, undefined, m.v(0, MD_TOP, 0, -0.5));
  // the stomach: a dome that fills the top of the hollow, with four shallow pouches towards the flat sides; its
  // under side runs into the mouth tube, a thin column that ends in four lips (each: height, half width, outline, aux)
  const AO = round(16), gut = [];
  for (const y of [0.893, 0.875, 0.85, 0.815, 0.775, 0.735, 0.7, 0.672]) gut.push(ring(y, 0.84 * mdIn(y + 0.012), 1.5, AO, -1));
  for (const [y, w, e, aux] of [[0.648, 0.1, 1.55, -1], [0.628, 0.076, 1.65, -1], [0.612, 0.052, 1.8, -1], [0.598, 0.035, 2, -1], [0.57, 0.027, 2, -0.9], [0.51, 0.024, 2, -0.9],
    [0.45, 0.024, 2, -0.9], [0.415, 0.027, 1.8, -0.9], [0.395, 0.036, 1.5, -0.9], [0.382, 0.048, 1.3, -0.9], [0.386, 0.03, 1.3, -0.9]]) gut.push(ring(y, w, e, AO, aux));
  skin(gut, m.v(0, 0.899, 0, -1), m.v(0, 0.405, 0, -0.9));
  // the gonads: four long ovoids along the corners, flat towards the wall, thickest below their middle and a
  // little lumpy
  for (const [sx, sz] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
    const d = [sx * sqrt(0.5), sz * sqrt(0.5)], c = [-d[1], d[0]], rings = [], out = (s) => mix(0.11, 0.124, s);
    for (let k = 1; k < 10; k++) {
      const s = k / 10, f = pow(sin(PI * pow(s, 1.2)), 0.75), row = [];
      for (let b = 0; b < 8; b++) {
        const a = b / 8 * TAU, lump = 1 + 0.12 * sin(k * 2.3 + sx * 1.9 + sz * 0.7 + b * 2.4), r = out(s) + cos(a) * 0.019 * f * lump, t = sin(a) * 0.034 * f * lump;
        row.push(m.v(d[0] * r + c[0] * t, 0.65 - 0.45 * s, d[1] * r + c[1] * t, -0.75));
      }
      rings.push(row);
    }
    skin(rings, m.v(d[0] * out(0), 0.653, d[1] * out(0), -0.75), m.v(d[0] * out(1), 0.197, d[1] * out(1), -0.75));
  }
  // the tentacles: 96 fingers under the inner side of the rim, evenly spaced along it. Each as long as it likes
  // (0.1 to 0.17), curving out a little, round, and tapering to a blunt point
  const AT = mdEven(96, 4.2);
  for (let j = 0; j < 96; j++) {
    const [x, z] = mdSq(AT[j], 4.2), l = hypot(x, z), d = [x / l, z / l], c = [-d[1], d[0]];
    const h = 0.1 + 0.07 * ihash(j, 3, 7), o = 0.04 + 0.2 * ihash(j, 5, 1), own = floor(16 * ihash(j, 9, 4)), rings = [];
    for (let k = 0; k < 6; k++) {
      const q = k / 6, r = 0.188 * (1 + o * q * q), rad = 0.0068 * pow(1 - pow(q, 2.4), 0.6), row = [];
      for (let s = 0; s < 5; s++) { const b = s / 5 * TAU, e = cos(b) * rad, f = sin(b) * rad; row.push(m.v(x * r + d[0] * e + c[0] * f, 0.006 - h * q, z * r + d[1] * e + c[1] * f, (1 + 16 * k + own) / 127)); }
      rings.push(row);
    }
    skin(rings, undefined, m.v(x * 0.188 * (1 + o), 0.006 - h, z * 0.188 * (1 + o), (97 + own) / 127));
  }
  // the outside of the bell, from the top down, the rings closer together where it rounds off; then round the rim
  // to the edge of the hollow: the rim is a lip with a thickness
  const AB = round(64, 0.12), bell = [];
  for (let k = 18; k >= 0; k--) { const y = 1 - pow(1 - k / 19, 2.2); bell.push(ring(y, mdOut(y), mdEx(y), AB, 0)); }
  bell.push(ring(-0.005, 0.1962, 4.2, AB, 0), ring(0.001, mdIn(0.001), 4.2, AB, 0));
  skin(bell, m.v(0, 1, 0, 0));
  return m;
}
const S_MEDUSA = /*wgsl*/`
// Instance: a = where it floats (the middle of its bell) and how far it drifts around that place (w), b = where in
// its pulse it is, how fast it pulses (rad/s), the height of its bell, a seed.
// It drifts about its place, slowly rising and sinking, and every pulse lifts it a little. mdP is repeated in
// zooMedusa below: change one, change the other
fn mdP(t: f32, a: vec4f, b: vec4f) -> vec3f {
  let d = t * .033 + b.w * 40.;
  return a.xyz + vec3f(a.w * cos(d), 1.6 * TSC * sin(t * .045 + b.w * 17.) + .03 * b.z * sin(t * b.y + b.x - 1.6), a.w * sin(d * 1.3 + 1.));
}
// how far the bell is drawn in at a place ph in its pulse (0 to 1): it draws in quickly and lets go slowly
fn mdK(ph: f32) -> f32 { let u = fract(ph / TAU); return ss(0., .3, u) * ss(1., .3, u); }
// how milky the jelly of the wall is: how much of the light a way of one height of the bell through it scatters
const MD_MILK = 2.5;
@vertex fn vsMedusa(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let sd = i.b.w; let au = i.n.w; let fp = t * i.b.y + i.b.x;
  // a tentacle carries two numbers in aux (see meshMedusa): how far down it a place is (tn, 1 at its tip), and a
  // number of its own (th)
  let cd = round(au * 127.) - 1.; let isT = step(0., cd); let tk = floor(max(cd, 0.) / 16.);
  let tn = isT * tk / 6.; let th = (max(cd, 0.) - 16. * tk) / 16.;
  var l = i.p; let hy = sat(l.y); let r2 = dot(l.xz, l.xz); let cx = l.x * l.x / max(r2, 1e-8);
  // The pulse. The rim leads: it draws in first and most, the wall above it follows a little later and less, the top
  // hardly moves. The flat sides fold in further than the four corners (c4: 1 at a side, -1 at a corner; the lower
  // half of the bell is the soft one in the fossils). What is inside goes with the wall beside it. The tentacles
  // follow the rim like whips: a place down a tentacle is where the rim was a little earlier, each tentacle with
  // its own delay. And the bell gets a little longer as it draws in
  let c4 = (8. * cx * cx - 8. * cx + 1.) * ss(.03, .1, sqrt(r2));
  let k = mdK(fp - 1.1 * hy - tn * (1.3 + .9 * th));
  let sq = 1. - .22 * k * pow(1. - hy, 1.6) * (1. + .35 * c4);
  l = vec3f(l.x * sq, l.y * (1. + .05 * mdK(fp - .6) * step(0., l.y)), l.z * sq);
  // the mouth tube hangs: it swings a little, and its lips open as the bell draws in
  let hang = step(-.95, au) * step(au, -.82) * sat((.6 - l.y) / .22);
  let lip = 1. + .3 * mdK(fp - .8) * hang * ss(.44, .39, l.y);
  l = vec3f(l.x * lip + hang * hang * .02 * sin(t * .8 + sd * 23.), l.y, l.z * lip + hang * hang * .02 * cos(t * .67 + sd * 41.));
  // the tentacles sway, each in its own slow rhythm and each set a little to one side, in waves that run down them;
  // and they trail behind the bell as it rises and sinks with its pulse
  let rd = normalize(l.xz + vec2f(1e-5, 0.)); let td = vec2f(-rd.y, rd.x); let ta = pow(tn, 1.5);
  let own = rd * (.018 * sin(t * .9 + th * 6.28 + 2.2 * tn + sd * 31.) + .012) + td * (.022 * sin(t * .63 + th * 19. - 2.8 * tn + sd * 17.) + .05 * (fract(th * 7.37 + sd) - .5));
  l = vec3f(l.x + own.x * ta, l.y + tn * .025 * (sin(fp - 1.6 - 1.2 * tn) - sin(fp - 1.6)), l.z + own.y * ta);
  // the soft lower half of the bell sways a little, and the tentacles with it
  let sk = (1. - hy) * (1. - hy) * .03;
  l = vec3f(l.x + sk * sin(t * .5 + sd * 13.), l.y, l.z + sk * cos(t * .43 + sd * 7.));
  // each stands turned its own way
  let c0 = cos(sd * 40.); let s0 = sin(sd * 40.);
  let p = vec3f(l.x * c0 - l.z * s0, l.y - .5, l.x * s0 + l.z * c0);
  let n0 = vec3f(i.n.x * c0 - i.n.z * s0, i.n.y, i.n.x * s0 + i.n.z * c0);
  // and leans its own way, and a little this way and that: turned about its middle, and its normals with it
  let tl = .16 * vec2f(sin(sd * 71.), cos(sd * 53.)) + .18 * vec2f(sin(t * .21 + sd * 9.), cos(t * .17 + sd * 5.));
  let ang = length(tl); let ax = vec3f(tl.y, 0., -tl.x) / max(ang, 1e-4); let ca = cos(ang); let sa = sin(ang);
  let pw = p * ca + cross(ax, p) * sa + ax * dot(ax, p) * (1. - ca);
  let n = n0 * ca + cross(ax, n0) * sa + ax * dot(ax, n0) * (1. - ca);
  let w = dodge(mdP(t, i.a, i.b), .4 * i.b.z + 2. * g.fwd.w, 1., .55 * i.b.z) + pw * i.b.z;
  // (to the fragment shader a tentacle says how far down it a place is: .03 at its root, 1 at its tip)
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = n; o.op = i.p; o.sd = sd; o.lt = mix(au, .03 + .97 * tn, isT);
  return o;
}
// It is see-through (glass in its kind): this returns its colour times its alpha, and the alpha.
// Colours are free: no fossil shows them. The bell is glass with a milk in it, blue-white: clear where one looks
// straight through its wall and milky where the view runs along it, so that the outside and the hollow each show
// their own outline, with the wall between them. Its jelly scatters the blue of the light and lets the warm part
// through, so against the sun it glows warm. Inside it the stomach, rose, the mouth tube, pale, and the gonads,
// orange; the tentacles pale with warm tips. Each animal in its own tone, from rose to orange
@fragment fn fsMedusa(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let lt = i.lt; let sd = i.sd; let y = i.op.y;
  let organ = step(lt, -.62); let inner = step(-.62, lt) * step(lt, -.25); let tent = step(.015, lt); let wall = 1. - organ - inner - tent;
  let gon = organ * step(-.82, lt); let tube = (organ - gon) * step(-.95, lt); let stom = organ - gon - tube;
  let tn = sat((lt - .03) / .97) * tent;
  let an = atan2(i.op.z, i.op.x + 1e-5);
  // two looks at the mottling, each turned its own way (one alone shows the grid of the texture), with a share of
  // the height in them (or they run in streaks down the wall); coarser on what is inside
  let q = i.op * mix(1., .5, organ);
  let tg = textureSample(tD, sR, vec2f(q.x * 41. + q.z * 23., q.z * 37. - q.x * 19.) + q.y * vec2f(29., 43.) + sd) * .5
    + textureSample(tD, sR, vec2f(q.x * 67. - q.z * 31., q.z * 71. + q.x * 43.) + q.y * vec2f(53., 31.) + .37) * .5;
  // (the relief fades where it would be finer than the pixels)
  let fine = ss(.02, .005, fwidth(i.op.x) + fwidth(i.op.y) + fwidth(i.op.z));
  // The relief. Outside: granules on the four corner zones, the sides and the top smooth (as the fossils show them).
  // In the hollow: the fine bands of the muscle that draws the bell in. The stomach lies in folds, the gonads are
  // grainy
  let cz = pow(abs(sin(2. * an)), 4.) * ss(.97, .72, y) * wall;
  let band = (.5 + .5 * cos(y * TAU * 34.)) * ss(.9, .5, y) * inner;
  let fold = (.5 + .5 * cos(an * 14. + 4. * tg.a)) * stom;
  let ns = normalize(i.n) * select(-1., 1., ff);
  let nr = skinRelief(ns, i.wp, ((tg.a - .5) * .0008 * cz - band * .00025 + fold * .0009 + (tg.b - .5) * .0018 * gon) * fine);
  // Only the hollow is seen from both its sides. Every other part shows its outside alone: the far side of the bell
  // would be laid over what is inside it, and the far side of a round thing over its near side
  if (!ff && inner < .5) { return vec4f(0.); }
  let V = normalize(g.cam.xyz - i.wp); let dist = distance(g.cam.xyz, i.wp); let L = g.sun.xyz;
  // (a tentacle is too thin for its five sides to show: its light is that of a round, soft thing)
  let n = normalize(mix(nr, V, .6 * tent)); let ndv = sat(dot(n, V)); let nds = sat(dot(ns, V)); let edge = pow(1. - ndv, 2.5);
  let z = zone(i.wp); let vv = vol(i.wp); let sh = shadow1(i.wp);
  let E = sunE(i.wp.y, z) * sh; let am = amb(i.wp, vec3f(n.x, abs(n.y) * .5 + .45, n.z), vv.g, z);
  let hue = fract(sd * 5.3); let tone = fract(sd * 13.7);
  // From afar it is a soft pale shape and not a drawn outline: its skins count for more there and their edges for
  // less, and what is inside is denser
  let far = ss(6. * TSC, 26. * TSC, dist);
  // The wall. Its jelly is milky by the way the view takes through it: wo is how wide the bell is at this height, tw
  // how thick its wall (mdOut and mdIn of the mesh). Straight through, the way is the thickness; at a slant it is
  // longer, up to where the view misses the hollow and leaves by the outside again. On top of that the skin of the
  // outside, milky towards its edge, and the frost of the corner zones
  let wo = max(.2 * sqrt(max(1. - pow(sat(y), 3.4), 0.)), .08);
  let tw = .008 + .018 * ss(0., .14, y) + .075 * pow(ss(.3, 1., y), 3.);
  let milk = 1. - exp(-MD_MILK * min(tw / max(nds, .07), 2. * wo * nds));
  let aw = .06 + .12 * far + (.48 - .18 * far) * edge + milk + cz * (.05 + .14 * tg.a * fine);
  // the skin of the hollow: milky towards its edge too, so the hollow has its own outline inside that of the bell
  let ai = .07 + .1 * far + (.46 - .14 * far) * pow(1. - ndv, 2.) + .06 * band;
  // what is inside is denser in its middle than at its edge, as a soft body is; the tentacles denser to their tips
  let ao = (mix(.56, .72, gon) - .12 * tube + .32 * ndv) * (1. + .3 * far);
  let at = mix(.5, .76, tn) + .18 * far;
  // (and it goes with the haze: beyond what the water lets one see, nothing of it is left)
  let al = min(wall * aw + inner * ai + organ * ao + tent * at, .95) * ss(70., 35., dist);
  // the colours: the bell blue-white, its hollow a little warmer; stomach and gonads rose to orange, mottled, dark in
  // the folds; the mouth tube pale with lips of the stomach's colour; the tentacles pale with warm tips
  let warm = mix(vec3f(.9, .28, .32), vec3f(1., .46, .16), hue);
  var co = mix(warm, vec3f(1., .52, .2), .6 * gon);
  co = mix(co, vec3f(.92, .72, .68), tube * ss(.37, .43, y)) * (.68 + .64 * tg.a) * (1. - .42 * fold) * mix(.82, 1.18, tone);
  let alb = wall * mix(vec3f(.88, .9, 1.5), vec3f(.76, .96, 1.4), hue) + inner * vec3f(1., .86, 1.2) + organ * co
    + tent * mix(vec3f(.93, .88, .93), vec3f(1., .56, .36), ss(.2, 1., tn));
  // its light. Glass takes it from all round, and little from the sun: what is inside is lit as a soft round body,
  // darker where it turns away from the viewer
  let glass = wall + inner; let dif = sat(dot(n, L));
  let c = alb * (E * mix(.32 + .52 * dif, .2 + .22 * dif, glass) + am * mix(1.35, 1.75, glass)) * mix(1., .58 + .42 * ndv, organ);
  // the sheen of the outside: a soft light of the sun on the smooth shape, not on every granule (that glitters)
  let H = normalize(V + L);
  let spec = E * (pow(sat(dot(ns, H)), 70.) * (wall * .75 + organ * .18 + tent * .22) + pow(sat(dot(ns, H)), 10.) * wall * .07) * (1. - .6 * far);
  // Where the sun comes through, it glows. Its jelly lets the warm light through; organs glow in their colour but
  // less than the bell, so the hollow and the organs read from below instead of burning out
  let gc = wall * vec3f(1., .97, .82) + inner * vec3f(1., .9, .85) + organ * co * co * 1.3 + tent * vec3f(1., .8, .7);
  let back = pow(sat(-dot(V, L)), 3.) * 1.2 + .12 * sat(-dot(n, L)) + .05;
  let damp = mix(1., .3, sat(-V.y * 1.5));
  let gl = gc * E * back * TRANS * (wall * (.3 + .7 * edge) + inner * .5 + organ * .7 + tent * .8) * damp;
  return vec4f(min(max(fog(c, i.wp, z), vec3f(0.)), vec3f(40.)) * al + (gl * al * 1.5 + spec * ss(70., 35., dist)) * exp(-sg(z) * dist), al);
}
`;
// A jellyfish: mdP of vsMedusa. A line up its bell, from near the rim to near the top
const zooMedusa = (a, i) => {
  const t = F[TIME], sz = a[i + 6], sd = a[i + 7], d = t * 0.033 + sd * 40;
  ZP[0] = a[i] + a[i + 3] * cos(d); ZP[1] = a[i + 1] + 1.6 * TS * sin(t * 0.045 + sd * 17) + 0.03 * sz * sin(t * a[i + 5] + a[i + 4] - 1.6) - sz * 0.4; ZP[2] = a[i + 2] + a[i + 3] * sin(d * 1.3 + 1);
  ZP[1] += sz * 0.4; ZH[0] = 0.55 * sz; ZH[1] = 0.4 * sz; zooDodge(1); ZP[1] -= sz * 0.4;
  ZP[3] = 0; ZP[4] = sz * 0.8; ZP[5] = 0; ZP[7] = sz * 0.22;
};
