// ============================================================================
// cambrian: Metaspriggina
// ============================================================================
// Its mesh, its shaders and, for the zoo, where it is at a time. world.js lists it as a kind and gives it its
// instances. The mesh is modelled around the origin, nose at +z, y up: the instance says how large the animal is in
// the world. aux, the fourth number of a vertex, tells the shaders which part of the animal a vertex belongs to.
// What it shares with the other animals of this era (pieces for the mesh, the light on a skin, giving way to the
// viewer) is in swimmers.js.

// Metaspriggina walcotti in the round. One unit from snout to tail. Sources: Conway Morris and Caron,
// Nature 2014, as cited by Royal Ontario Museum and Oceanbites (both read 2026-11-17): a notochord, a pair
// of large camera eyes with lenses, paired nasal sacs, W-shaped myomeres (muscle blocks), a post-anal tail,
// seven pairs of gill bars each of an upper and a lower piece, the first pair thicker than the rest.
// Estimates: every width. The fossils are compressed and no source gives a cross-section, so the body is an
// oval about 2.6 times as tall as wide, with a low dorsal ridge (the notochord) and a flatter belly.
// aux: -1 on the lenses, -.7 on the eye iris, -.5 on the gill bars, 0 on the body, .3 on the nasal sacs
function meshMetaspriggina() {
  const m = new Mesh();
  // body sections from tail to head: [z, half width, half height, y centre]
  const K = [[-0.5, 0.002, 0.004, 0], [-0.44, 0.005, 0.018, 0], [-0.35, 0.012, 0.042, 0], [-0.2, 0.022, 0.065, 0], [-0.05, 0.030, 0.082, 0], [0.1, 0.034, 0.088, 0], [0.22, 0.035, 0.082, 0.001], [0.32, 0.032, 0.065, 0.003], [0.40, 0.025, 0.048, 0.005], [0.46, 0.019, 0.032, 0.006], [0.5, 0.005, 0.009, 0.005]];
  // laterally compressed (taller than wide), with a low dorsal ridge for the notochord and a flatter belly
  loft(m, K, 3, 12, 0, (a) => {
    const c = cos(a), s = sin(a);
    return [(c < 0 ? -1 : 1) * pow(abs(c), 0.85), s > 0 ? pow(s, 0.8) + 0.06 * pow(s, 5) : -pow(-s, 0.7)];
  });
  for (const sx of [-1, 1]) {
    // seven pairs of gill bars: short arcs from the body outward and slightly back and down.
    // The first pair (the hyomandibular, precursor of the jaw) is thicker
    for (let k = 0; k < 7; k++) {
      const z = 0.34 - k * 0.022, bw = wideAt(K, z);
      const thick = k === 0 ? 0.006 : 0.0045, len = k === 0 ? 0.04 : 0.03;
      m.tube([[sx * (bw - 0.002), -0.015, z], [sx * (bw + 0.4 * len), -0.028, z - 0.004], [sx * (bw + len), -0.044, z - 0.01]], () => thick, 4, true, () => -0.5);
    }
    // eyes: large, set high and forward, with a lens bump that catches the light
    ball(m, [sx * 0.019, 0.032, 0.445], [0.013, 0.014, 0.012], -0.7, 12, 6);
    ball(m, [sx * 0.023, 0.038, 0.452], 0.006, -1, 8, 4);
    // nasal sacs: paired bumps between the eyes and the snout
    ball(m, [sx * 0.008, 0.016, 0.47], 0.004, 0.3, 6, 3);
  }
  return m;
}
const S_METASPRIGGINA = /*wgsl*/`
// Instance: a = how far the round of its shoal keeps from the line of the wall's foot (x), the height (y) and the z
// of its middle, half its length along the wall (w), b = its own seed, the speed of the shoal (rad/s, the sign is the
// direction), its length, the seed of the shoal.
// A shoal swims a long round beside the wall, following its line. msP is repeated in zooMetaspriggina below: change
// one, change the other
fn msP(ta: f32, a: vec4f, ph: f32) -> vec3f {
  let z = a.z + a.w * sin(ta);
  return vec3f(wallx(z) - a.x + 4. * TSC * cos(ta), a.y + 2.2 * TSC * sin(2. * ta + ph), z);
}
@vertex fn vsMetaspriggina(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x; let h = vec3f(hs(s), hs(s + .37), hs(s + .71)); let ph = i.b.w * 17.; let e = .5 * TSC / i.a.w;
  let ta = t * i.b.y + i.b.w * 6.3 + ((h.x - .5) * 11. + sin(t * .27 + s * 40.)) * TSC / i.a.w;
  let T = normalize(msP(ta + e, i.a, ph) - msP(ta - e, i.a, ph)) * sign(i.b.y);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  let off = (S * ((h.y - .5) * 3.4 + .5 * sin(t * .6 + s * 31.)) + Up * ((h.z - .5) * 2.6 + .4 * cos(t * .5 + s * 23.))) * TSC;
  // a wave runs down the whole body, wider towards the tail: it swims like an eel
  var l = i.p; var n = i.n.xyz;
  let u = .5 - l.z; let A = .012 + .085 * u * u; let wv = t * 8. + s * 50. - u * 5.5;
  l.x += A * sin(wv);
  let sl = 5.5 * A * cos(wv) - .17 * u * sin(wv);
  n = vec3f(n.x + sl * n.z, n.y, n.z - sl * n.x);
  let w = dodge(msP(ta, i.a, ph) + off, .75 * i.b.z + 2. * g.fwd.w, 0., 0.) + (S * l.x + Up * l.y + T * l.z) * i.b.z;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z; o.op = i.p; o.sd = s; o.lt = i.n.w;
  return o;
}
@fragment fn fsMetaspriggina(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let x = abs(i.op.x); let y = i.op.y; let z = i.op.z; let lt = i.lt;
  let h1 = hs(i.sd * 7.); let h2 = hs(i.sd * 23.);
  // which part of the animal
  let body = step(-.25, lt) * step(lt, .15);
  let gbar = step(-.6, lt) * step(lt, -.25);
  let iris = step(-.8, lt) * step(lt, -.6);
  let lens = step(lt, -.8);
  let nose = step(.15, lt);
  let eye = iris + lens; let soft = body + gbar + nose;
  // two texture samples turned against each other (no grid artifact)
  let tg = textureSample(tD, sR, vec2f(x * 55. + z * 32., z * 48. + x * 28.) + y * vec2f(38., 55.) + i.sd) * .5
    + textureSample(tD, sR, vec2f(x * 78. + z * 36., z * 83. + x * 52.) + y * vec2f(62., 38.) + .37) * .5;
  let fine = ss(.02, .005, fwidth(z) + fwidth(x));
  // W-shaped myomere (muscle block) relief: chevrons pointing forward, deeper on the flanks
  let mz = (z + abs(y) * 1.3) * 270.;
  let myo = sin(mz) * ss(1.6, .5, fwidth(mz)) * ss(.42, .3, z) * ss(-.45, -.35, z);
  // notochord: a low ridge along the dorsal midline
  let noto = exp(x * x / -.00006) * ss(-.42, .15, z) * ss(.46, .42, z) * step(.006, y);
  // relief from myomeres, notochord and fine noise
  let rh = (.0025 * myo + .003 * noto + .002 * (tg.a - .5)) * fine * body;
  let n = skinRelief(ns, i.wp, rh);
  // colour: silver-grey, counter-shaded (dark back, pale belly), each animal a little different
  let dk = mix(vec3f(.10, .11, .08), vec3f(.09, .10, .07), h2);
  let md = mix(vec3f(.32, .34, .28), vec3f(.29, .31, .25), h2);
  var alb = mix(md, dk, ss(-.015, .045, y));
  // paler belly: countershading
  alb = mix(alb, vec3f(.50, .52, .46), ss(-.05, -.015, y) * .5);
  // notochord as a pale line
  alb = mix(alb, vec3f(.44, .42, .36), noto * .45);
  // myomere shading: darker in the furrows
  alb *= 1. - .18 * myo * fine;
  // texture variation
  alb *= .88 + .24 * tg.g;
  // gill bars: faintly red
  alb = mix(alb, vec3f(.50, .28, .24), gbar);
  // nasal sacs
  alb = mix(alb, vec3f(.46, .40, .38), nose);
  // eyes
  alb = mix(alb, vec3f(.05, .04, .035), iris);
  alb = mix(alb, vec3f(.012, .010, .010), lens);
  // per-individual brightness
  alb *= .85 + .4 * h1;
  // the light: a wet skin with myomere relief, a bright highlight on the lens
  var c = skinWet(alb, n, ns, i.wp, .12 * soft + 1.2 * eye, .35 * soft + 1. * iris + 2. * lens);
  return fin(fog(c, i.wp, zone(i.wp)));
}
`;
// A shoal of Metaspriggina: msP of vsMetaspriggina (with the line of the wall's foot, wallX of floor.js, written out).
// The shoal spreads 0.3 m along its round to both sides of its middle: two lines from the middle, each 0.23 m along
// the round, one back and one ahead
const zooMetaspriggina = (a, i, part) => {
  const L = a[i + 3], ph = a[i + 7] * 17, ta = F[TIME] * a[i + 5] + a[i + 7] * 6.3, tb = ta + (part * 2 - 1) * 4.5 * TS / L;
  const z0 = a[i + 2] + L * sin(ta), z1 = a[i + 2] + L * sin(tb);
  const x0 = 60 + 10 * sin(z0 * 0.019 + 0.6) + 4.5 * sin(z0 * 0.051 + 2.1) - a[i] + 4 * TS * cos(ta), y0 = a[i + 1] + 2.2 * TS * sin(2 * ta + ph);
  ZP[0] = x0; ZP[1] = y0; ZP[2] = z0;
  ZP[3] = 60 + 10 * sin(z1 * 0.019 + 0.6) + 4.5 * sin(z1 * 0.051 + 2.1) - a[i] + 4 * TS * cos(tb) - x0; ZP[4] = a[i + 1] + 2.2 * TS * sin(2 * tb + ph) - y0; ZP[5] = z1 - z0; ZP[7] = 1.6 * TS;
};
