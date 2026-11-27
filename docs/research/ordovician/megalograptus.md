# Megalograptus (giant sea scorpion)

Sources:
- Ohio Geological Survey, GeoFacts 34, "Megalograptus ohioensis: Ohio's Giant Sea Scorpion" (M. E. Peter, 2021,
  https://dam.assets.ohio.gov/image/upload/ohiodnr.gov/documents/geology/GF34_Peter_2021.pdf): up to 75 cm,
  "among the largest marine predators living 445 million years ago". Figure 2: a full reconstruction in dorsal
  and ventral views, labeled, modified from Caster and Kjellesvig-Waering (1964).
- Wikipedia, "Megalograptus" (https://en.wikipedia.org/wiki/Megalograptus), read through a summary: M. ohioensis
  49 to 78 cm. Head shield roughly square, flat, without a raised rim; front edge turned down with six small
  spikes. Compound eyes kidney-shaped, middle size, near the edge; two small simple eyes (ocelli) in the middle.
  Six pairs of limbs; the third pair massive, heavily spined, bendable, about 3.5 times as long as the head
  shield. The fourth pair short and spiny, the fifth without spines, the sixth the swimming paddles. Behind the
  head six broad segments, widest at the third; then the body narrows. At the end a stout sharp spike (telson)
  with rounded blades (cercal blades) beside it that could close as a grasping organ. Small scales of uneven size
  all over; many with a hole that probably held a bristle. Colour of M. ohioensis from the fossils: mostly dark
  brown with black scales, limbs darker toward their tips, spike black. Near the shore, among trilobites.
- Not in what was read: how it walked, how fast, how it swam, the exact measures of the parts (except the third
  pair's proportion), every colour but those above.

**Living models:** a horseshoe crab and a scorpion for shell, joints and bearing; the swimming leg of a swimming
crab for the paddle. The shape comes from the fossil.

## Middle forms (recipe step 1 of quality-gate.md; 2 to 10 % of the body)

1. The overlapping plates of the mesosoma: each lapping over the next with a real edge and a shadowed gap
2. The joint between head shield and first segment: the shield's rear edge over the first plate
3. The great limb's spines: long, inward-pointing, each growing out of its piece with a widened foot
4. The paddle of the swimming leg: the last pieces flattened to an oval blade
5. The compound eyes: kidney-shaped low mounds near the edge, outer wall the dark seeing band
6. The cercal blades beside the telson: two rounded blades that could close
7. The joints of a limb: a narrower ring of paler skin between two hard pieces

## Figures measured from figure 2 of GeoFacts 34 (body lengths; 1 unit = front of head to tip of telson)

All widths are half-widths (to one side of the midline). (e) = estimate where the figure is not precise enough.
Checked against figure 2 once more on 2026-11-26 (both views, extracted from the PDF and measured in pixels);
where this list and the earlier one differ, this one is the measured one.

**Body**:
- Head shield (prosoma/carapace): 0.20 long (dorsal view: the front edge is turned down, so the true length is a
  touch more), 0.105 half-width at the rear, 0.085 at the rounded front corners: roughly square, as Wikipedia
  says. Flat, no raised rim; front edge turned down with 6 small downward spikes
- Mesosoma (6 broad segments): 0.28 long; widest half-width 0.11 at the third segment, narrowing to 0.07 at the
  sixth; each plate overlaps the one behind
- Narrow tail (opisthosoma segments 7–12): 0.27 long; tapers from half-width 0.05 at the first ring to 0.027 at
  the last; rings increasingly round in cross-section; each ring's rear edge carries a fringe of short dark
  marks (scale spurs) in the figure
- Pretelson: a bulb of 0.06 long, up to 0.055 half-width, the cercal blades grow from it
- Cercal blades: each about 0.12 long and 0.07 wide, rounded, dark, one on each side; far larger than the
  earlier note had them
- Telson (spike): about 0.21 from its base in the pretelson to the tip, an arrow-shaped base tapering to a
  needle point, black. Terminal apparatus (pretelson to tip) about 0.24

**Limbs** (both views; all lengths are estimates from pixel measures):
- Chelicera (I): small pincers at the front middle, about 0.06 long (e)
- Pedipalp (II): about 0.18 long, pointing forward, its distal pieces with combs of spines (the forward spiny
  pair between the great limbs in the figure)
- Third appendage (III, the great limbs): massive, about 0.55 long with its spines (Wikipedia's 3.5× head fits
  the earlier 0.15 head, not the measured 0.20; the figure's limb is about 0.4 of pieces plus 0.16 of terminal
  spines). Combs of long curved spines (0.03 to 0.12) in two rows, uneven, each with a widened foot. Two very
  long thin terminal spines, up to about 0.25, each ending in a small flattened oval pad (clear in both views).
  At rest held forward, half folded, a basket in front of the mouth (e)
- Walking leg (IV): about 0.20, with whorls (rosettes) of spines at its joints
- Walking leg (V): about 0.25, slender, without spines, ending in small claws; longer than IV, so its feet
  stand wider
- Swimming leg (VI): about 0.25 in all; broad, strongly flattened pieces, then an oval paddle blade of about
  0.11 by 0.06 with a small claw at its tip; the paddle and blades are drawn darker than the body

**Eyes**:
- Compound eyes: kidney-shaped, on top of the head near its front (about 0.6 of the half-width out from the
  middle, centre at about 0.44 of the length from the middle of the body), about 0.03 long and 0.015 wide, the
  outer wall the dark seeing band (e)
- Two ocelli (simple eyes): small dark dots between the compound eyes on the middle of the head, about 0.005
  across

## How thick it is (our estimate; 2026-11-27, section M3 of docs/briefs/qa/ordovician.md)

No source gives a thickness: the fossils are pressed flat and figure 2 is a view from above. These figures are
ours, after the living models (horseshoe crab, scorpion), in the same body lengths. They are what
`walkers_megalograptus.js` is built from, and what makes the animal a body and not a cut-out.

- Head shield: 0.060 over its edge in the middle, with a flank wall of 0.015 before the edge; the front margin
  turned down by 0.044. Under it a real underside, 0.034 deep at the rear and 0.018 forward, holding the roots of
  the limbs round the mouth and, behind them, the metastoma: a broadly triangular plate about 0.11 long and 0.072
  wide standing a little proud of it
- Mesosoma plates: the back rises 0.048 to 0.050 over the edge, each plate turning down into a flank wall of
  0.015; the belly hangs 0.035 under the edge at the widest plate (0.028 at the sixth) and is 0.85 as wide as the
  plates, with a flat shelf (the doublure) out to the edge. The rear plates stay thick, so the sixth still meets
  the first tail ring. Thickness in the middle 0.088 at a width of 0.234: well over a third
- Tail rings: as tall as they are wide, the first blending out of the sixth plate's cross-section (0.72 of its
  width tall) to fully round at the last. Pretelson 0.076 tall at 0.104 wide; telson 0.036 tall at its widest
- It stands with the shell's edge 0.060 over the mud (its belly clears it), and the walking legs reach down to it

**Motion** (our reconstruction; nothing may jump):
- Walking: slowly on pairs IV and V, the feet forward and out beside the head shield (no foot behind z = 0.31 at
  any moment of a step), the head nodding and the body rolling a little with every step, the great limbs (III)
  feeling ahead, paddles (VI) folded back along the plates, tail trailing. Steps tied to the way walked as for
  the trilobite
- What feels ahead are the great limbs, not antennae: a sea scorpion has none. Some of their spines end in bulbs
  that may have been organs of sense (Wikipedia, "Megalograptus", read through a summary). Each limb sweeps on
  its own clock, 0.12 to the side and 0.06 up and down at the tip once in 3 to 6 s, bending in its joints; now
  and then a tip taps the mud ahead; every 15 to 30 s both close in front of the mouth and open again slowly
- The paddle (VI) works like an oar: it sweeps about its root, and the blade turns on its own long axis, broad
  side against the water on the way back and edge first on the way forward. Between bursts it lies folded and
  now and then makes one slow fanning stroke
- The tail lifts by 6 to 12 degrees and sinks again once in 6 to 10 s; the cercal blades open and close by 0.03
- Swimming: lifts off, paddles row together five to eight strokes, all other limbs fold against the body, cercal
  blades spread as a rudder, then glides down and lands. Most of the time it walks or stands. The pose is its own
  (M3.7): nose up by 8 to 15 degrees, each animal its own, a small roll and a small rise with every stroke, the
  tail bending at its joints (up at the stroke, trailing between), and a lean into the turn of its round
- Animals from 0.50 to 0.78 m
