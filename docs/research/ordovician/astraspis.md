# Astraspis (early armoured fish)

Rebuilt 2026-11-25 by section A of `docs/briefs/qa/ordovician.md` (the first build of 2026-11-23 was a spindle
with pegs and stuck-on balls and never went through the gate).

Sources:
- Sansom, Smith, Smith and Turner 1997, "Astraspis: the anatomy and histology of an Ordovician fish",
  Palaeontology 40, abstract (https://palass.org/publications/palaeontology-journal/archive/40/3/article_pp625-643):
  dorsal head shield of many-sided plates, the ones below more irregular; bumps on them star-shaped or smooth,
  round or oval; well-developed eye sockets right in front of the gill openings; eight uncovered gill openings in
  a line that slopes back and down; grooves of the senses on each side of a pineal spot on top; the tail covered
  by large diamond-shaped scales; the end of the tail unknown.
- Wikipedia "Astraspis" (https://en.wikipedia.org/wiki/Astraspis): about 20 cm; oval in cross-section; plates of
  the forebody over 2 mm; "relatively large" eyes at the sides. Its "under 1 mm" tail scales lose against
  Sansom's "large": Sansom is the first-hand source.
- Not in any source read: the width, the outline, the mouth, how tall the tail was, every colour, how it swam.

**Living models:** the armour of a boxfish (many-sided bony plates under thin skin) for the surface; a tadpole
for the tail and the way of swimming. The shape comes from the fossil.

## Middle forms (recipe step 1 of quality-gate.md; 2 to 10 % of the body)

1. The rear edge of the shield: a small step down to the tail, with shade under it (e)
2. The eye sockets: a round opening with a low raised rim, about 0.035 across, dark ball sunk in it (e: size)
3. The row of eight gill openings: slanting oval holes with a soft rim and a dark inside, in a line sloping back
   and down (Sansom; size e)
4. The mouth: a small cross slit, low at the very front, soft dark inside (e)
5. The pineal spot on the midline between the eyes, a sensory groove on each side (Sansom; size e)
6. The tail blade: the tail grows taller than wide and runs out into a low rounded blade of the same skin (e)
7. The flat belly of the shield against the arched back (oval cross-section, flatter below: e)

## Figures used in the mesh (body lengths; 1 unit = one animal, nose at +0.5; (e) = estimate)

- Shield: z +0.048 to +0.50, about 45 % of the length (e, from "head and chest"); widest half-width 0.090 at
  z = +0.15, half-height 0.066 (an arched back); belly flattened (e)
- Step at the shield's rear edge: half-width 0.084 -> 0.063 over z +0.048 to +0.030, the edge sloping backward
  over the trunk (e)
- Tail: narrower and lower at once (half-height 0.038 at z = -0.08, waist 0.027 at -0.30), then the blade: peak
  half-height 0.050 at z = -0.40, 0.007 wide, rounded end at -0.50 (e: "tail termination unknown")
- Eye sockets: centre (±0.083, 0.027, 0.24), opening 0.035 across, rim 0.0025 proud, ball of 0.024 sunk 0.0055;
  round the socket the plates give way to smooth, darker skin (e)
- Gill openings: 8, first at z = 0.185 just behind the eye, one every 0.025 back and 0.13 rad down the
  cross-section, ovals 0.026 by 0.012 slanting with the line, 0.008 deep (Sansom's line; sizes e)
- Mouth: centre (0, -0.014, 0.490), slit 0.040 by 0.012, 0.008 deep (e)
- Plates: worley cells of about 0.012 (Wikipedia: > 2 mm on a 20 cm fish), low dome on each, some with short
  star rays (Sansom); more irregular below (warped and rescaled below the midline)
- Tail scales: diamonds of about 0.022 in slanting rows, overlapping backward, rows jittered, smaller toward the
  end (Sansom "large diamond-shaped scales"; sizes e)
- Motion: shield rigid, swinging about 2.5 degrees against the tail; tail-only bend rising toward the tip; beats
  in bouts with glides (envelope from one slow sine per fish); small roll and pitch (all e, after the tadpole)
