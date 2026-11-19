// ============================================================================
// Reference zoo distance for Dunkleosteus with the hunt (brief: docs/briefs/dunkleosteus-hunt.md)
// ============================================================================
// Not loaded by the build. Replaces dunkZooDist in source/eras/devonian/swimmers_dunkleosteus.js and adds dunkHunt and
// dunkRamp before it. dunkFr, dunkZooPath and zooDunkleosteus stay. Mirrors vsDunkleosteus: change one, change the other.
const dunkFr = (x) => x - floor(x);
// dunkHunt and dunkRamp of the shader
const dunkHunt = (k, s) => 0.05 + 0.5 * dunkFr(0.618034 * k + 0.37 * sin(2.3 * k + 9 * s) + 3.1 * s);
const dunkRamp = (x) => (x <= 0 ? 0 : x < 1 ? x * x * x - 0.5 * x * x * x * x : x - 0.5);
// metres swum along its path by time t: cruising speed v0 with its two slow swells, and the hunts
const dunkZooDist = (s, v0, t) => {
  const f1 = 0.031 + 0.02 * dunkFr(s * 7.31), f2 = 0.083 + 0.03 * dunkFr(s * 3.17);
  const q1 = f1 * t + 6.3 * dunkFr(s * 5.13), q2 = f2 * t + 6.3 * dunkFr(s * 9.71);
  const hPer = 35 + 20 * dunkFr(s * 13.7), hc = t / hPer + dunkFr(s * 2.9), hk = floor(hc);
  const tau = dunkFr(hc) * hPer - hPer * dunkHunt(hk, s);
  const te = 1 + 3 + 2 * dunkFr(s * 5.9), vb = 2 + 0.6 * dunkFr(s * 8.3);
  return v0 * (t + 0.25 / f1 * sin(q1) + 0.15 / f2 * sin(q2))
    + vb * (hk * (te + 0.75) + dunkRamp(tau) - 2.5 * dunkRamp((tau - te) / 2.5));
};
