// ============================================================================
// devonian: driftwood — trunks of the first trees, floating and sunk
// ============================================================================
// Two floating logs drift slowly near the surface. Three sunk logs lie half-buried on the floor at -45 m.
// All five are one kind with the same mesh; the vertex shader checks i.b.y to decide floating (>0) vs sunk (0).
// Instance: a.xyz = centre of orbit (floating) or position (sunk), a.w = orbit radius (floating) or yaw (sunk).
// b.x = initial phase (floating) or tilt (sunk), b.y = drift speed (>0 floating, 0 sunk), b.z = size, b.w = seed.
// See CLAUDE.md, "adding an animal" — these are not animals, but the same five parts apply.
// 1 mesh (meshDriftwood), 2 shaders (S_WOOD), 3 kind (WOOD in world.js), 4 instances (makeWorld), 5 zoo (zooDrift)

// ---------------------------------------------------------------- mesh
// a bare log 12 m along z (-6 to +6), about 0.3 m radius, with broken branch stumps. Modelled around the origin, z forward
function meshDriftwood() {
  rseed(300);
  const m = new Mesh(), N = 24, pts = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, z = -6 + t * 12;
    pts.push([sin(t * 5.1 + 1) * 0.08 + sin(t * 11.3) * 0.03, cos(t * 4.7 + 0.5) * 0.06, z]);
  }
  m.tube(pts, (k) => {
    const t = k / N;
    return 0.3 * (1 - 0.35 * t) * (1 + 0.07 * sin(t * 23));
  }, 10, true, (k) => k / N);
  for (let i = 0; i < 7; i++) {
    const t = 0.08 + i * 0.13, angle = i * 2.39 + rr(-0.3, 0.3);
    const z = -6 + t * 12, r0 = 0.3 * (1 - 0.35 * t);
    const bx = cos(angle), by = sin(angle), br = rr(0.05, 0.1), bl = rr(0.3, 0.6);
    const stump = [];
    for (let j = 0; j <= 3; j++) { const s = j / 3; stump.push([bx * (r0 + s * bl), by * (r0 + s * bl), z + s * 0.1]); }
    const n0 = m.p.length / 3;
    m.tube(stump, (k) => br * (1 - k / 4), 6, true);
    for (let k = n0; k < m.aux.length; k++) m.aux[k] = t;
  }
  return m;
}

// ---------------------------------------------------------------- shaders
const S_WOOD = /*wgsl*/`
@vertex fn vsDrift(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let sz = i.b.z; let sd = i.b.w;
  var l = i.p * sz;
  var nm = i.n.xyz;
  var T = vec3f(0., 0., 1.); var S = vec3f(1., 0., 0.); var Up = vec3f(0., 1., 0.);
  var base = vec3f(0.);
  if (i.b.y > 0.) {
    // floating: drift in a slow circle near the surface
    let R = i.a.w; let ta = t * i.b.y + i.b.x;
    base = i.a.xyz + vec3f(R * cos(ta), 0., R * sin(ta));
    T = normalize(vec3f(-sin(ta), 0., cos(ta)));
    S = vec3f(T.z, 0., -T.x);
    Up = vec3f(0., 1., 0.);
    let roll = sin(t * .3 + sd * 10.) * .08;
    let S2 = S * cos(roll) + Up * sin(roll);
    Up = Up * cos(roll) - S * sin(roll);
    S = S2;
  } else {
    // sunk: static on the floor, rotated and tilted
    base = i.a.xyz;
    let yaw = i.a.w; let tilt = i.b.x;
    let cy = cos(yaw); let sy = sin(yaw);
    let ct = cos(tilt); let st = sin(tilt);
    T = vec3f(sy * ct, st, cy * ct);
    S = vec3f(cy, 0., -sy);
    Up = cross(T, S);
  }
  let w = base + T * l.z + Up * l.y + S * l.x;
  nm = T * nm.z + Up * nm.y + S * nm.x;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = nm; o.op = i.p; o.sd = sd;
  o.lt = shadow1(w);
  return o;
}
@fragment fn fsDrift(i: VO) -> @location(0) vec4f {
  let dist = length(i.wp - g.cam.xyz);
  let n = normalize(i.n); let L = g.sun.xyz; let V = normalize(g.cam.xyz - i.wp);
  let z = zone(i.wp); let vv = vol(i.wp);
  let ca = caus(i.wp, dist);
  // bark: grain along the trunk, ring pattern across
  let tx = textureSample(tD, sR, i.op.yz * .6 + i.sd);
  let tx2 = textureSample(tD, sR, i.op.xz * 2.5 + i.sd * 3.);
  let grain = tx.a * .6 + tx2.a * .4;
  let rings = .5 + .5 * sin(length(i.op.xy) * 25. + grain * 8.);
  // waterlogged wood: dark grey-brown
  var alb = mix(vec3f(.07, .055, .035), vec3f(.14, .11, .07), rings * .4 + grain * .3);
  alb *= .85 + .3 * fract(i.sd * 7.3);
  let nn = normalize(n + (vec3f(tx.r, 0., tx.g) - vec3f(.5, 0., .5)) * .25);
  let E = sunE(i.wp.y, z) * i.lt;
  var c = alb * (E * (.25 + .75 * sat(dot(nn, L))) * (.3 + ca * .7) + amb(i.wp, nn, vv.g, z) * 1.1);
  c += E * pow(sat(dot(nn, normalize(V + L))), 12.) * .2;
  c += vec3f(.2, .4, .3) * pow(1. - sat(dot(n, V)), 3.) * .12 * vv.g;
  return fin(fog(c, i.wp, z));
}
`;

// ---------------------------------------------------------------- zoo
// where a driftwood instance is at the current time (see zooMove in engine/zoo.js): a line from one end of the log
// to the other, with the trunk radius around it. Runs every frame, allocates nothing
const zooDrift = (a, i) => {
  const sz = a[i + 6], half = sz * 6;
  let tx, tz;
  if (a[i + 5] > 0) {
    const R = a[i + 3], ta = F[TIME] * a[i + 5] + a[i + 4];
    const cx = a[i] + R * cos(ta), cz = a[i + 2] + R * sin(ta);
    tx = -sin(ta); tz = cos(ta);
    ZP[0] = cx - tx * half; ZP[1] = a[i + 1]; ZP[2] = cz - tz * half;
  } else {
    const yaw = a[i + 3];
    tx = sin(yaw); tz = cos(yaw);
    ZP[0] = a[i] - tx * half; ZP[1] = a[i + 1]; ZP[2] = a[i + 2] - tz * half;
  }
  ZP[3] = tx * half * 2; ZP[4] = 0; ZP[5] = tz * half * 2;
  ZP[7] = sz * 0.3;
};
