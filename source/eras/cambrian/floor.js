// ============================================================================
// cambrian: the sea floor
// ============================================================================
// A basin of mud beside a reef wall. The wall stands in the east and is the edge of the world there: everything east
// of the line of its foot is rock, up to the top of the grid. West of it lies the plain, in low swells, with an apron
// of slid mud along the foot of the wall and a few tongues of mud that reach out from it. On the apron lie blocks that
// broke off the wall. See today's floor.js for what the engine reads from FLOOR.

// the line of the wall's foot: its x for a z. The density function below repeats it (wallx): change one, change both
const wallX = (z) => 60 + 10 * sin(z * 0.019 + 0.6) + 4.5 * sin(z * 0.051 + 2.1);
// tongues of mud that slid down from the wall: z at the wall and x, z of the tip, half width, height
const TONGUES = [
  [34, 16, 50, 9, 2.6],
  [-64, 6, -80, 11, 3],
  [-6, 36, -18, 7, 2],
  [84, 26, 72, 8, 2.4],
];
// fallen blocks: z, how far out from the foot of the wall, half length, turn, tilt, half height and half width as
// shares of the length, how high the middle lies above the mud
const BLOCKS = [
  [-96, 11, 3.6, 0.6, 0.35, 0.55, 0.8, 0.8], [-78, 9, 4.5, 0.5, 0.25, 0.55, 0.7, 0.9], [-70, 16, 2.4, 1.9, -0.4, 0.6, 0.8, 0.4],
  [-52, 7, 3.2, 2.6, 0.15, 0.7, 0.6, 0.8], [-38, 13, 5.5, 0.9, -0.2, 0.5, 0.65, 1.2], [-31, 21, 2, 0.2, 0.5, 0.7, 0.9, 0.3],
  [-12, 8, 2.8, 1.3, 0.3, 0.6, 0.75, 0.6], [4, 12, 4, 2.2, -0.3, 0.55, 0.7, 0.9], [10, 19, 1.8, 0.7, 0.6, 0.8, 0.7, 0.3],
  [24, 6, 3, 1.7, 0.2, 0.65, 0.8, 0.7], [47, 10, 4.8, 0.3, -0.25, 0.5, 0.6, 1], [55, 18, 2.2, 2.9, 0.45, 0.7, 0.85, 0.4],
  [72, 8, 3.4, 1.1, 0.1, 0.6, 0.7, 0.8], [90, 14, 2.6, 2.4, -0.5, 0.75, 0.6, 0.5],
];
// how much of a place is covered by a tongue (0 to 1), for the colour of the mud. The density function below has the
// same shape with a ragged rim
const tongueAt = (x, z) => {
  let m = 0;
  for (const t of TONGUES) {
    const ax = wallX(t[0]) - 2, az = t[0], bx = t[1] - ax, bz = t[2] - az, k = clamp(((x - ax) * bx + (z - az) * bz) / (bx * bx + bz * bz), 0, 1);
    const r = t[3] * mix(1.6, 1, sstep(0, 0.6, k));
    m = max(m, sstep(r, r * 0.15, hypot(x - ax - bx * k, z - az - bz * k)));
  }
  return m;
};
// how much of a place lies under a block (0 to 1), for the mud on the blocks, which is thinner than on the ground
const blockAt = (x, z) => { let m = 0; for (const b of BLOCKS) m = max(m, sstep(b[2] * 1.25, b[2] * 0.8, hypot(x - wallX(b[0]) + b[1], z - b[0]))); return m; };

// The line of the wall's foot and the height of the mud, as WGSL. The density function below needs them, and so do
// the shaders of the animals that keep close to the mud (swimmers.js). The two read the tongues from different
// places: n is the text for how many there are, tg(i) the text that reads the i-th vec4f of their list (two for each
// tongue: where it starts and where its tip is, then its half width and its height)
const groundWgsl = (n, tg) => /*wgsl*/`
fn wallx(z: f32) -> f32 { return 60. + 10. * sin(z * .019 + .6) + 4.5 * sin(z * .051 + 2.1); }
// the height of the mud: the plain in low swells, the apron along the wall, the tongues
fn ground(x: vec2f) -> f32 {
  var h = -46. + 14. * (fbm(vec3f(x * .015, 3.), 3) - .5) + 1.6 * (fbm(vec3f(x * .055, 9.), 2) - .5);
  // far out the plain sinks away under the grid, so that it has no edge that could be seen
  h -= 14. * ss(150., 192., length(x));
  h += (5. + 5. * vn(vec3f(x.y * .04, 2., 7.))) * exp(min(x.x - wallx(x.y), 0.) / 6.5);
  let rag = 4. * (fbm(vec3f(x * .11, 5.), 2) - .5);
  for (var i = 0u; i < ${n}; i++) {
    let a = ${tg('i * 2u')}; let b = ${tg('i * 2u + 1u')};
    let ba = a.zw - a.xy; let pa = x - a.xy;
    let t = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);
    let r = b.x * mix(1.6, 1., ss(0., .6, t));
    // rounded across, with no level top that would end in a crease
    let q = clamp((length(pa - ba * t) + rag) / r, 0., 1.);
    h += b.y * mix(2., 1., ss(0., .7, t)) * (1. - q * q) * (1. - q * q);
  }
  return h;
}
`;

const FLOOR = {
  // as the density function reads them, two vec4f each: first the tongues, then the blocks
  prims: new Float32Array([
    ...TONGUES.flatMap((t) => [wallX(t[0]) - 2, t[0], t[1], t[2], t[3], t[4], 0, 0]),
    // (they lie half sunk into the mud: 0.45 deeper than their list says, so that none hangs over a hollow)
    ...BLOCKS.flatMap((b) => [wallX(b[0]) - b[1], b[7] - 0.45, b[0], b[2], b[3], b[4], b[5], b[6]]),
  ]),
  counts: [TONGUES.length, BLOCKS.length, 0, 0],
  wgsl: groundWgsl('u.c.x', (i) => 'P[' + i + ']') + /*wgsl*/`
// how far a bed of the wall stands out at a place along it. Each bed does so differently: where the lower one stands
// out further there is a ledge, where the upper one does, an overhang. Its rim is scalloped, not a straight line
fn bed(i: f32, z: f32) -> f32 { return 9. * ss(.42, .8, vn(vec3f(z * .03, i * 3.7, 1.))) * (.7 + .6 * vn(vec3f(z * .17, i * 5.1, 9.))); }
fn dens(p: vec3f) -> f32 {
  let mud = ground(p.xz) - p.y;
  let w = vec3f(fbm(p * .05 + 11., 3), fbm(p * .05 + 47., 3), fbm(p * .05 + 83., 3)) - .5;
  // the wall, in beds about 7 units thick, with buttresses, leaning back a little
  // (the beds are not level sheets: where one ends and the next begins wanders up and down, so that no ledge and no
  // underside of an overhang is a plane)
  let yb = (p.y + 56.) / 7. + .3 * sin(p.z * .013 + 1.) + w.y * .6 + .3 * (fbm(vec3f(p.xz * .13, 4.), 2) - .5);
  let bi = floor(yb);
  let jut = mix(bed(bi, p.z), bed(bi + 1., p.z), ss(.7, 1., yb - bi));
  var rock = p.x - wallx(p.z) + w.x * 8. + jut + 7. * (fbm(vec3f(p.z * .05, p.y * .03, 3.), 2) - .5) - (p.y + 46.) * .04;
  // the blocks: turned and tilted, each lying on the mud where it is
  for (var i = 0u; i < u.c.y; i++) {
    let a = P[(u.c.x + i) * 2u]; let b = P[(u.c.x + i) * 2u + 1u];
    if (distance(p.xz, a.xz) > a.w * 1.8 + 4.) { continue; }
    var r = p - vec3f(a.x, ground(a.xz) + a.y, a.z);
    let cy = cos(b.x); let sy = sin(b.x); r = vec3f(cy * r.x + sy * r.z, r.y, cy * r.z - sy * r.x);
    let ct = cos(b.y); let st = sin(b.y); r = vec3f(r.x, ct * r.y + st * r.z, ct * r.z - st * r.y);
    // its shape: between a box and an egg, so that it has no level faces and no straight edges, and lumpy all over
    let e = abs(r) / (a.w * vec3f(1., b.z, b.w)); let fi = f32(i);
    let db = a.w * min(b.z, b.w) * (1. - pow(e.x * e.x * e.x + e.y * e.y * e.y + e.z * e.z * e.z, 1. / 3.));
    rock = max(rock, db + a.w * .3 * (fbm(r * (2.2 / a.w) + fi * 7., 2) - .5));
  }
  var d = smax(mud, rock, 2.);
  // rock is rough and bedded, mud is smooth
  let rk = ss(-2., .5, rock - mud);
  d += rk * ((.5 - wor(p * .17 + w * 2.)) * 3.2 + (.5 - wor(p * .41 + 7.)) * 1.2 + (fbm(p * .3, 3) - .5) * 2.);
  d += rk * 1.5 * (abs(fract(p.y * .21 + w.y * 2.2) - .5) - .25);
  return min(d, 3. - p.y);
}
`,
};
