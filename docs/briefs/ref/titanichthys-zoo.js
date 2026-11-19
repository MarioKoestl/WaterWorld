// ============================================================================
// Reference zoo distance for Titanichthys with the feeding runs (brief: docs/briefs/titanichthys-feeding.md)
// ============================================================================
// Not loaded by the build. Replaces titanZooDist in source/eras/devonian/swimmers_titanichthys.js and adds titanRun and
// titanRamp before it. titanFr, titanZooPath and zooTitanichthys stay. Mirrors vsTitanichthys: change one, change the
// other.

// titanRun and titanRamp of the shader
const titanRun = (k, s) => 0.05 + 0.3 * titanFr(0.618034 * k + 0.37 * sin(2.3 * k + 9 * s) + 3.1 * s);
const titanRamp = (x) => (x <= 0 ? 0 : x < 1 ? x * x * x - 0.5 * x * x * x * x : x - 0.5);
// metres swum along its path by time t: cruising speed v0 with its two slow swells, and the feeding runs
const titanZooDist = (s, v0, t) => {
  const f1 = 0.031 + 0.02 * titanFr(s * 7.31), f2 = 0.083 + 0.03 * titanFr(s * 3.17);
  const q1 = f1 * t + 6.3 * titanFr(s * 5.13), q2 = f2 * t + 6.3 * titanFr(s * 9.71);
  const hPer = 50 + 20 * titanFr(s * 13.7), hc = t / hPer + titanFr(s * 2.9), hk = floor(hc);
  const tau = titanFr(hc) * hPer - hPer * titanRun(hk, s);
  const te = 3 + 12 + 13 * titanFr(s * 5.9), vb = 0.5 + 0.3 * titanFr(s * 8.3);
  return v0 * (t + 0.15 / f1 * sin(q1) + 0.10 / f2 * sin(q2))
    + vb * (hk * (te + 0.25) + 3 * titanRamp(tau / 3) - 3.5 * titanRamp((tau - te) / 3.5));
};
