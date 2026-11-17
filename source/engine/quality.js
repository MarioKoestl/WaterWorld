// ============================================================================
// quality: the one detail level, and what the page remembers between visits
// ============================================================================
// The game has one detail level (docs/briefs/scope.md): the size of the shadow map, the samples of the anti-aliasing,
// the size of the water texture and the steps of the light shafts are fixed.
// localStorage.abyssal = "pixels,detail": the resolution and the draw distance the scene settled on last time (main.js
// reads them back and keeps them in their range, so a value that an older page left there does no harm).
// localStorage.abyssalSize: the size of the player (0 diver, 1 fish, 2 shrimp: main.js, key C).
const SHADOW = 4096, AA = 4, WATER = 512, RAYN = 34;
const keep = (k, v) => { try { localStorage[k] = v; } catch {} };
let SV = [], PSZ = 0;
try { SV = (localStorage.abyssal || '').split(','); PSZ = (+localStorage.abyssalSize | 0) % 3; } catch {}
