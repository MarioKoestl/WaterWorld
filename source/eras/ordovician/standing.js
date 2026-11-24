// ============================================================================
// ordovician: what stands still (meshes)
// ============================================================================
// Shapes follow the fossils as far as the sources describe them. Each is modelled at true size in metres (one unit
// is one metre). aux (the fourth number of a vertex) tells the material in look.js what part of the animal a place
// is. lo: the simpler mesh for far away.

// ---------------------------------------------------------------- brachiopod (lamp shell)
// Two shapes of this region: Rafinesquina (type 0: flat, wide, ~4 cm) and Platystrophia (type 1: ribbed, ~3 cm).
// Both have two unequal halves (top and bottom), a little open at the front. Many lie dead: single halves, hollow
// side up or down.
// Figures: shapes and sizes from the Digital Atlas of Ordovician Life (not verified here).
// Rafinesquina: flat concavo-convex, hinge wider than body, ~3.5 cm across.
// Platystrophia: biconvex, strong radial ribs (plicae), ~3 cm across.
// aux: 0 at centre of outer surface, up to 1 at the edge; negative on the inner (hollow) surface.
// dead: 0 living (two halves), 1 single upper half (dead shell)
function meshBrachiopod(type, dead, lo) {
  const m = new Mesh();
  const W = type ? 0.014 : 0.019, L = type ? 0.012 : 0.016;
  const Hu = type ? 0.005 : 0.003, Hl = type ? 0.006 : 0.004;
  const seg = lo ? 6 : 12, NR = lo ? 2 : 4, nRib = type ? 14 : 0;
  const valve = (H, sign) => {
    const rings = [];
    for (let r = 0; r <= NR; r++) {
      const t = r / NR, ring = [];
      for (let s = 0; s < seg; s++) {
        const a = s / seg * TAU, x = cos(a) * W * t, z = sin(a) * L * t;
        const dome = max(0, 1 - t * t), rib = nRib ? 0.0005 * cos(nRib * a) * t : 0;
        ring.push(m.v(x, sign * (H * dome + rib), z, sign * (0.2 + 0.8 * t)));
      }
      rings.push(ring);
    }
    const c = m.v(0, sign * H, 0, sign * 0.1);
    for (let s = 0; s < seg; s++) { const s2 = (s + 1) % seg; sign > 0 ? m.tri(c, rings[0][s2], rings[0][s]) : m.tri(c, rings[0][s], rings[0][s2]); }
    for (let r = 0; r < NR; r++) for (let s = 0; s < seg; s++) { const s2 = (s + 1) % seg; sign > 0 ? m.quad(rings[r][s], rings[r][s2], rings[r + 1][s2], rings[r + 1][s]) : m.quad(rings[r][s], rings[r + 1][s], rings[r + 1][s2], rings[r][s2]); }
    return rings[NR];
  };
  if (dead) { valve(Hu, 1); }
  else {
    const eu = valve(Hu, 1), el = valve(Hl, -1);
    for (let s = 0; s < seg; s++) { const s2 = (s + 1) % seg; m.quad(eu[s], eu[s2], el[s2], el[s]); }
  }
  return m;
}

// ---------------------------------------------------------------- bryozoan (moss animal colony)
// Stony branching twigs 5 to 15 cm, covered with pinprick pores. Three variants from seed.
// Genera and sizes from the Digital Atlas of Ordovician Life (not verified here).
// aux: 0 at base, 1 at tips
function meshBryozoan(sd, lo) {
  rseed(400 + sd);
  const m = new Mesh(), twigs = [];
  const nrm = (v) => { const l = hypot(...v) || 1; return v.map((c) => c / l); };
  const grow = (p, d, r, len, depth) => {
    const pts = [p]; let q = p;
    for (let i = 0; i < 3; i++) {
      d = nrm([d[0] + rr(-0.3, 0.3), d[1] + rr(0, 0.4), d[2] + rr(-0.3, 0.3)]);
      q = [q[0] + d[0] * len / 3, q[1] + d[1] * len / 3, q[2] + d[2] * len / 3]; pts.push(q);
    }
    twigs.push({ pts, r, depth });
    if (depth) for (let i = 1 + (rnd() < 0.4); i > 0; i--) grow(q, nrm([d[0] + rr(-0.6, 0.6), d[1] + rr(0.2, 0.6), d[2] + rr(-0.6, 0.6)]), r * 0.78, len * rr(0.65, 0.85), depth - 1);
  };
  const H = rr(0.06, 0.14);
  for (let i = 2 + (rnd() < 0.5); i > 0; i--) grow([rr(-0.004, 0.004), 0, rr(-0.004, 0.004)], nrm([rr(-0.25, 0.25), 1, rr(-0.25, 0.25)]), 0.0028, H / 3, 1);
  let top = 0.001; for (const t of twigs) for (const p of t.pts) top = max(top, p[1]);
  twigs.forEach((t) => {
    const P = lo ? [t.pts[0], t.pts[3]] : t.pts, sides = lo ? 3 : 5;
    m.tube(P, (j) => t.r * (lo ? 1.3 : 1) * (1 + 0.2 * j / (P.length - 1)), sides, true, (j) => 0.1 + 0.9 * P[min(j, P.length - 1)][1] / top);
  });
  return m;
}

// ---------------------------------------------------------------- horn coral (Grewingkia canadensis)
// A straight or slightly curved horn of stone up to 13 cm with strong rings, lying loose on the mud. At the
// opening a low ring of plain short tentacles (soft parts not known, estimate). Over 100 thin walls inside the
// cup. Modelled along z-axis (tip at z=0, opening at z=length). Three sizes from seed.
// Figures: Digital Atlas of Ordovician Life, "Grewingkia canadensis": straight or slightly curved, strongly
// ringed, 100+ walls, reaching lengths in excess of 13 cm.
// aux: 0 at the tip, 1 at the opening rim; negative for tentacles and cup interior
function meshHornCoral(sd, lo) {
  rseed(500 + sd);
  const m = new Mesh();
  const Len = rr(0.07, 0.13), rOpen = Len * 0.18;
  const seg = lo ? 6 : 12, NZ = lo ? 6 : 18;
  const curve = Len * rr(0.02, 0.1);
  const rings = [];
  for (let i = 0; i <= NZ; i++) {
    const t = i / NZ, z = Len * t;
    const r0 = rOpen * (0.06 + 0.94 * pow(t, 0.65));
    const bump = !lo && t > 0.08 ? 0.002 * (1 - t * 0.2) * sin(t * 55 + sd * 10) : 0;
    const cy = curve * t * t;
    const ring = [];
    for (let s = 0; s < seg; s++) {
      const a = s / seg * TAU;
      ring.push(m.v(cos(a) * (r0 + bump), sin(a) * (r0 + bump) + cy, z, t));
    }
    rings.push(ring);
  }
  for (let i = 0; i < NZ; i++) for (let s = 0; s < seg; s++) {
    const s2 = (s + 1) % seg;
    m.quad(rings[i][s], rings[i + 1][s], rings[i + 1][s2], rings[i][s2]);
  }
  const tip = m.v(0, 0, 0, 0);
  for (let s = 0; s < seg; s++) { const s2 = (s + 1) % seg; m.tri(tip, rings[0][s2], rings[0][s]); }
  if (!lo) {
    const rRim = rOpen * 1.08, cy = curve;
    const rim = [], inner = [];
    for (let s = 0; s < seg; s++) {
      const a = s / seg * TAU;
      rim.push(m.v(cos(a) * rRim, sin(a) * rRim + cy, Len + 0.002, 0.95));
      inner.push(m.v(cos(a) * rRim * 0.88, sin(a) * rRim * 0.88 + cy, Len, -0.8));
    }
    for (let s = 0; s < seg; s++) { const s2 = (s + 1) % seg; m.quad(rings[NZ][s], rings[NZ][s2], rim[s2], rim[s]); }
    for (let s = 0; s < seg; s++) { const s2 = (s + 1) % seg; m.quad(rim[s], rim[s2], inner[s2], inner[s]); }
    const flr = m.v(0, cy, Len - rOpen * 0.5, -0.9);
    for (let s = 0; s < seg; s++) { const s2 = (s + 1) % seg; m.tri(inner[s], inner[s2], flr); }
    const nT = 8;
    for (let i = 0; i < nT; i++) {
      const a = i / nT * TAU, tL = rr(0.007, 0.014);
      const bx = cos(a) * rRim * 0.92, by = sin(a) * rRim * 0.92 + cy;
      m.tube([[bx, by, Len + 0.002], [cos(a) * (rRim + tL * 0.4), sin(a) * (rRim + tL * 0.4) + cy + tL * 0.25, Len + 0.002 + tL * 0.6]], 0.0012, 3, true, () => -0.4);
    }
  }
  return m;
}

// ---------------------------------------------------------------- crinoid (sea lily)
// A stalk of stacked discs, a cup on top with feathery arms. 30 cm to 1 m high. Modelled with the foot at y=0,
// crown at y=H. Three sizes from seed. The sway comes from a negative bobbing value on the instance.
// Genera and heights from the Digital Atlas of Ordovician Life (not verified here; if the sea lilies of this
// region were smaller than 0.3 to 1 m, the source wins).
// Figures in lengths of the body: stalk 65-70 % of height, cup 8-10 %, arms 20-25 %, arm spread ≈ cup
// diameter × 2. Stalk radius about 0.6-1 cm, cup radius 1.5-2.5 cm.
// aux: 0 at base, 0.45 at top of stalk, 0.5 at cup, 0.55 to 1.0 up the arms
function meshCrinoid(sd, lo) {
  rseed(600 + sd);
  const m = new Mesh();
  const H = rr(0.3, 0.9);
  const rStalk = 0.006 + 0.004 * (H - 0.3) / 0.6;
  const rCup = rStalk * 2.8;
  const cupH = H * 0.09;
  const armLen = H * 0.22;
  const stalkH = H - cupH - armLen;
  const nArms = 5;
  const sides = lo ? 4 : 6;
  const lean = rr(-0.02, 0.02);
  // holdfast: wider base
  if (!lo) {
    const hf = [];
    for (let i = 0; i < 4; i++) {
      const t = i / 3, ring = [];
      for (let s = 0; s < sides; s++) {
        const a = s / sides * TAU, r = rStalk * [2.2, 1.8, 1.3, 1.05][i] * (1 + 0.15 * sin(a * 3 + sd));
        ring.push(m.v(cos(a) * r, t * 0.015, sin(a) * r, t * 0.03));
      }
      hf.push(ring);
    }
    for (let i = 0; i < 3; i++) for (let s = 0; s < sides; s++) { const s2 = (s + 1) % sides; m.quad(hf[i][s], hf[i + 1][s], hf[i + 1][s2], hf[i][s2]); }
  }
  // stalk: tube with disc ridges
  const stalkN = lo ? 5 : 24;
  const stalkPts = [];
  for (let i = 0; i <= stalkN; i++) {
    const t = i / stalkN, y = t * stalkH + 0.015;
    stalkPts.push([lean * t, y, 0]);
  }
  m.tube(stalkPts, (k) => {
    const disc = !lo ? 0.0012 * max(0, sin(k / stalkN * stalkH * 160)) : 0;
    return rStalk + disc;
  }, sides, false, (k) => k / stalkN * 0.45);
  // cup: wider, tapering up to where the arms begin
  const cupBase = stalkH + 0.015;
  const cupPts = [];
  const cupN = lo ? 2 : 5;
  for (let i = 0; i <= cupN; i++) {
    const t = i / cupN;
    cupPts.push([lean, cupBase + cupH * t, 0]);
  }
  m.tube(cupPts, (k) => {
    const t = k / cupN;
    return rStalk + (rCup - rStalk) * sin(t * PI * 0.5);
  }, sides, false, (k) => 0.46 + 0.09 * k / cupN);
  // arms: five tubes fanning out and curving slightly inward (forming a bowl against the current)
  const armBase = cupBase + cupH;
  for (let i = 0; i < nArms; i++) {
    const a = i / nArms * TAU + rr(-0.15, 0.15);
    const dx = cos(a), dz = sin(a);
    const nP = lo ? 3 : 7;
    const pts = [];
    for (let j = 0; j <= nP; j++) {
      const t = j / nP;
      const spread = rCup * (0.3 + 1.5 * t);
      const rise = armLen * (0.6 * t - 0.25 * t * t);
      pts.push([lean + dx * spread, armBase + rise, dz * spread]);
    }
    m.tube(pts, (k) => rCup * 0.28 * (1 - 0.75 * k / nP), lo ? 3 : 4, true, (k) => 0.56 + 0.44 * k / nP);
  }
  return m;
}
