# Brief: the Carboniferous world

The age of coal. The player dives about 308 million years back, into a shallow, muddy bay at the edge of a swamp
forest in what is now Illinois. The water is brown with mud and full of fallen leaves. It is a nursery of small and
strange animals, among them one that nobody has been able to place: the Tully monster.

- **Asked for by:** Mario, 2026-11-16.
- **Needs:** `eras.md` (done). `scale.md` for the size picture and for the close camera, which this world asks for.
- **Result:** `carboniferous.html`, chosen from the timeline in the title menu.

Read `CLAUDE.md`, then `era-common.md`: stages, rules, acceptance criteria, verification and how to treat facts are
there. This brief says what this world is.

## How to work (version 2 of this brief, 2026-11-23)

Written for Claude Code on Opus 4.6. With `CLAUDE.md` and `era-common.md` this brief is all you need for this era.
Do not read the briefs of the Devonian or of the Dunkleosteus. Since version 1 the facts were checked (see
"Sources"; some shapes changed), and "The look" and "Build notes" are new.

1. **Stages** as in `era-common.md`, five of them. Each ends with a hand-over, and then you stop. Never start a stage
   before Mario has accepted the one before.
2. **Start** from a copy of `source/eras/devonian/` (murky water, driftwood, swarms, sharks), then take out
   everything Devonian.
3. **One kind at a time,** in the order given under "The ten exhibits". For each kind:
   a. Notes in `docs/research/carboniferous/<id>.md` from the sources named in "Build notes": what they print, what you
      measured on which figure, what stays an estimate.
   b. The mesh, with its figures in lengths of the body in a comment.
   c. `node tools/turntable.mjs carboniferous <id> <name>` (look at `node tools/chrome.mjs status` first).
   d. The visual critic on the turntable, with the list of "The look" as its questions.
   e. Correct, twice at most. Then the next kind.
4. **A source that cannot be opened:** say so in the notes and mark the figure as estimate. Never invent a
   measurement, a quotation or a colour.
5. **Budget.** Small edits in place. The engine is the only renderer. Hand-overs of 20 lines or fewer: what is in,
   what Mario should open and look at, what is still not verified, one commit message.

## The place

The Carboniferous lasted from 358.86 to 298.9 million years ago. The world shows one moment late in it, about 308
million years ago, and one place: the bay whose mud became the Mazon Creek fossil beds in Grundy County, Illinois.
The sea had risen and flooded a swamp forest. Rivers carried mud and plants into shallow bays and river mouths, and
whatever was buried in that mud was sealed into nodules of ironstone, soft bodies included. The animals of the
salty and brackish part are called the Essex biota. All of the living exhibits are known from it.

## What is special about the Carboniferous, and where the world shows it

| Special feature | Where the player meets it |
|---|---|
| Swamp forests that become coal, and give the era its name | the forest at the shore; the fallen scale tree |
| Trees that are giant club mosses and ferns, no flowers anywhere | the scale tree, the drifting leaves |
| More oxygen in the air than ever, and giant insects | the card of the forest |
| Soft animals kept as fossils, some of them riddles | the Tully monster, Essexella |
| Sharks take over after the armoured fish are gone | the young sharks |
| The oldest shark nursery known | the young sharks |
| The lobe-finned fish, relatives of everything with four legs | the coelacanth |
| The last sea scorpions | Adelophthalmus |
| The first reptiles, with eggs that need no water | the menu text |

## Decisions

| Decision | By |
|---|---|
| One real place and time: the bay of Mazon Creek, about 308 million years ago | Claude |
| The forest is seen from the water and has a card. The player does not go ashore | Claude |
| The giant of this world is a tree, lying in the water | Claude |
| The list of the ten | Claude |

The decisions marked Claude are defaults. Mario can change them; ask before building something else.

## Atmosphere

The mood to aim for: warm, brown, close. Sunlight comes down through water the colour of tea, leaves turn slowly as
they sink, roots and trunks stand in the gloom. A flooded forest, quiet and full of small movements.

| | World of today | Carboniferous |
|---|---|---|
| Water | clear blue | tea brown to olive, cloudy with mud |
| How far one sees | far | about 12 m, less near the river mouth |
| Surface | visible from below, with waves | near: the bay is 1 to 8 m deep. Flat, with leaves floating on it, dark tree shapes behind it at the shore |
| Sunlight | strong, sharp shafts, bright flecks | golden-green shafts through the brown water, broken by the shadows of floating leaves |
| Drifting particles | a few | many: mud, plant fibres, sinking leaves |
| Ground | rock and sand, strong colours | soft grey-brown mud under a litter of dark leaves and twigs |
| Sound | rumble, surface wash, chimes, whale calls | muffled and close: soft bubbling from the mud, a slow drip and lap. No calls, no surf |

## Sea floor

- **The bay.** A floor of soft mud, 1 to 8 m deep, with shallow channels cut by the tide.
- **The drowned forest.** Along the shore side the stumps and spreading roots of dead scale trees still stand in
  the water, a few metres apart.
- **The fallen tree.** One scale tree of 30 m lies along the floor from the shore out into the bay, half sunk in
  the mud.
- **The shore.** One side of the world rises out of the water into the forest: trunks with diamond bark, giant
  horsetails at the waterline, tree ferns behind. It is the edge of the world on that side.
- **The river mouth.** One corner where the water is thickest with mud and leaves.
- **Not here:** rock, reef, clear water, flowers, grass, anything that sings.

## The ten exhibits

Sizes in metres, one unit is one metre. Almost every animal here is smaller than a hand: this world asks for the
close camera of `scale.md`.

| Id | What | Size | Shape | Movement | Where and how many |
|---|---|---|---|---|---|
| `tullimonstrum` | the Tully monster | 0.08 to 0.35 | a soft torpedo with faint segments, a tail fin with an upper and a lower lobe, a long narrow fin on the back, a stiff bar across the back with an eye at each end, a long thin trunk ending in a small claw with teeth | swims with its tail fin; the trunk reaches and snaps | about 40 |
| `essexella` | the sea anemone Essexella | 0.01 to 0.15 | a soft barrel, its lower part dug into the mud, a ring of short tentacles on top | tentacles move; pulls in when something comes near | several hundred, in the mud |
| `bandringa` | young Bandringa sharks | 0.1 to 0.15 | a small shark with a very long, flat snout like a spoon, up to half of its whole length | swim close to the floor, snout sweeping | about 60, near the roots |
| `belotelson` | the shrimp-like Belotelson | about 0.08 | like a sturdy shrimp: long feelers, a row of swimming legs, a tail fan | swarms, short darts | 8 swarms of about 100 |
| `euproops` | the horseshoe crab Euproops | about 0.05 | a domed, horseshoe-shaped shield with spines along its rim, a tail spike | walks on the mud and among the leaves | about 80 |
| `adelophthalmus` | the sea scorpion Adelophthalmus | about 0.2 | slim, with a rounded head shield, paddles and a tail spike | swims with its paddles | about 15 |
| `rhabdoderma` | young coelacanths | 0.05 to 0.1 | a deep-bodied little fish whose fins sit on short fleshy stalks, with a tail in three lobes | hover among the roots, fins moving one by one | about 40 |
| `scaletree` | the fallen scale tree | 30 long, trunk 1 thick at its foot | a straight trunk with bark in a pattern of diamonds, forking again and again at the top end, with forking roots | none | 1, and about 20 stumps of the same kind |
| `leaves` | drifting leaves | fronds 0.1 to 0.5 | fern-like fronds and single leaflets, brown and dark green | sink slowly, turning; float on the surface | everywhere |
| `forest` | the coal forest | no `size` | the wall of trunks and green at the shore | sways a little in the wind | the shore side, as a backdrop |

Order of work, easiest first: the forest edge, stumps, fallen tree and leaves, then the anemones, then the swimmers
(`belotelson`, `rhabdoderma`, `bandringa`, `adelophthalmus`, `tullimonstrum`), then the walker (`euproops`).

What the engine already offers: scattering in masses, sprites (for sinking leaves, if they can be given a shape),
swarms, walkers, and the wave along a flap from the manta of `today` for the tail fins of the Tully monster.

## The look: rules from the Cambrian and the Devonian

Mario accepted the rebuilt trilobite of the Cambrian ("exactly like this") and rejected the fish of the Devonian as
plastic and as cartoon. What made the difference:

- **L1. Form at three sizes.** The outline; forms of a few percent of the body in the mesh (ribs, steps between
  segments, lobes, spines); fine relief in the shader. Outline plus painted lines looks like a toy.
- **L2. Contrast belongs to light and shadow.** Detail of middle size is quiet. No noise that draws closed cells,
  except where the fossil has them: the leaf cushions on the bark of the scale tree, the scales of the fish.
  There they are relief, not outlines.
- **L3. No drawn dark line of one width.** A joint, a suture, a growth line is a step or a groove, shaded by the light.
- **L4. Nothing shines under water.** Shell, armour, stone and skin are matte, with a faint broad sheen at most.
- **L5. Colour only from a source.** No colour of any animal of this world was found in a source.
  Plain colours of the material: soft bodies pale and a little translucent, armour brown, bark and leaves brown
  and dark green.
  Low saturation, each kind its own colour family, and no card says anything about colour.
- **L6. Eyes are small and dark,** never the brightest thing on an animal.
- **L7. Colour follows relief:** hollows darker and dirtier, edges and tops worn paler.
- **L8. Individuals differ** in size, tone, wear and pose, from their seed.
- **L9. Motion.** What was soft bends and lags. What was stiff does not bend. Nothing repeats exactly.
- **L10. The dead belong here.** Sunk leaves and twigs, shed shields of horseshoe crabs, the stumps: the litter on the
  mud is most of what the player sees in this water.

## Build notes

| Id | Start from | Vertices each (guide) |
|---|---|---|
| `forest`, `leaves` | the leaves and sprites of the engine (`pal`, `types` in `LOOK`) | few |
| `scaletree` | `meshDriftwood` (`devonian/driftwood.js`): bark relief by one function in mesh and shader | 15,000 |
| `essexella` | a standing kind of `cambrian` that sways (`standing.js`) | 600 |
| `belotelson` | the swarm of `CONCAVICARIS` (`devonian`) | 1,500 |
| `rhabdoderma` | `meshKentuckia` (`devonian`) | 2,500 |
| `bandringa` | `meshCladoselache` (`devonian`), scaled down, with a new head | 4,000 |
| `adelophthalmus` | a sea scorpion of `ordovician` or `silurian` if built, else the walker code of `TRILO` | 4,000 |
| `tullimonstrum` | new; the wave along a flap from the manta of `today` for its fins | 4,000 |
| `euproops` | `meshTrilo`, `S_TRILO` (`cambrian/walkers.js`) | 3,000 |

Photographs of most of these fossils: Field Museum, "Mazon Creek Fossil Invertebrates"
(https://fieldmuseum.org/blog/mazon-creek-fossil-invertebrates). Measure on them, do not copy them.

- **`scaletree`.** Lepidodendron. A trunk without branches up to the crown, where it forks again and again. The bark
  is covered in spindle-shaped leaf cushions in rising spirals, up to 8 cm long and 2 cm wide: these are the
  "diamonds" (L2). The roots (Stigmaria) fork like the crown. 30 m long and 1 m thick is within the sources (30 to
  50 m, trunks often over 1 m).
- **`leaves`, `forest`.** Which plants: not verified. Fern-like fronds only; nothing with flowers, no grass.
- **`essexella`.** A sea anemone that burrowed, 1 to 15 cm. Soft, a little translucent, never glossy.
- **`belotelson`.** Belotelson magister, one of the most common animals of this biota. A sturdy shrimp shape with
  eight pairs of walking legs. Use the reconstruction in Schram 2006
  (https://decapoda.nhm.org/pdfs/12047/12047.pdf). Its size: not verified.
- **`rhabdoderma`**, **`adelophthalmus`**, **`euproops`**. Shapes, sizes, and whether each belongs to the salty part
  of the bay: not verified. Euproops in particular may belong to the freshwater side (the Braidwood biota). Check
  before modelling; if it does, it walks at the shore side and the river mouth only.
- **`bandringa`.** Young ones of 10 to 15 cm; adults reached about 3 m and lived in fresh water. A spoon-shaped snout
  of up to half the whole length, needle-like spines on head and cheeks. Outline: the painting by John Megahan in
  the University of Michigan's press release (measure, do not copy) and Sallan and Coates 2014.
- **`tullimonstrum`.** After McCoy and others 2016: a long segmented body; a jointed trunk ending in a claw with two
  rows of cone-shaped teeth; the eyes at the ends of a stiff bar that sticks out sideways; a tail fin with an upper
  and a lower lobe (upright, like a fish's, not flat like a squid's) and a long narrow fin on the back. What kind
  of animal it is, is still open: the card says so. Soft, matte, the fins thin enough to let light through.

## Texts

For the zoo file of this era. Put the source links next to each entry as comments once the facts are checked (see
`era-common.md`, "Facts and sources").

```js
// Zoo texts of the Carboniferous. name, sub and text are shown as they are, facts are [label, value] rows.
const ZOO = {
  tullimonstrum: {
    name: 'Tully monster', sub: 'Tullimonstrum gregarium · nobody knows what it is', size: 0.35,
    facts: [['Length', '8 to 35 cm'], ['Found', 'only here, in Illinois'], ['First found', '1955, by Francis Tully']],
    text: 'A soft body like a torpedo, eyes on the ends of a bar across its back, and a long trunk that ends in a claw with tiny teeth. Whether it is a fish, a worm or a snail without a shell is still argued about. It has been found in this one bay and nowhere else on Earth.',
  },
  essexella: {
    name: 'Essexella', sub: 'Essexella asherae · a sea anemone, long taken for a jellyfish', size: 0.15,
    facts: [['Length', '1 to 15 cm'], ['Lived', 'dug into the mud'], ['Recognized as an anemone', '2023']],
    text: 'The most common fossil of this bay is a blob. For more than forty years it was read as a jellyfish. In 2023 researchers looked at thousands of them again and found a sea anemone that lived dug into the mud. Soft animals like this almost never become fossils. Here they did, by the thousand.',
  },
  bandringa: {
    name: 'Bandringa', sub: 'Bandringa rayi · a young shark with a long snout', size: 0.15,
    facts: [['Length here', '10 to 15 cm, all young'], ['Snout', 'up to half of its whole length'], ['This bay', 'one of the oldest shark nurseries known']],
    text: 'This bay is a nursery. The little sharks with the long, flat snout are all young ones, and the egg cases they hatched from are found with them. The adults, several times larger, are found in other rocks, laid down in rivers and swamps. The young must have moved there once they had grown.',
  },
  belotelson: {
    name: 'Belotelson', sub: 'Belotelson magister · a relative of shrimps', size: 0.08,
    facts: [['Length', 'about 8 cm'], ['Role here', 'food for many others'], ['Build', 'feelers, swimming legs, tail fan']],
    text: 'One of the most common animals of the bay, and food for many of the others. It looks much like a shrimp of today, with long feelers, a row of swimming legs and a tail fan. Animals of this build had been around for a long time already, and they have changed little since.',
  },
  euproops: {
    name: 'Horseshoe crab', sub: 'Euproops danae · small, spiny, built to last', size: 0.05,
    facts: [['Length', 'about 5 cm'], ['Relatives', 'spiders and scorpions, not crabs'], ['Its family', 'still alive today']],
    text: 'A small horseshoe crab with a spiny rim. Those of today are ten times larger and built the same way: a domed shield, a hinged back, a tail spike. Some researchers think that this one could leave the water and hide in the litter of the shore, where its spines looked like bits of plants.',
  },
  adelophthalmus: {
    name: 'Sea scorpion', sub: 'Adelophthalmus · one of the last of its kind', size: 0.2,
    facts: [['Length', 'about 20 cm'], ['Lives', 'where salt and fresh water meet'], ['Sea scorpions die out', 'at the end of the next era']],
    text: 'The sea scorpions that ruled the lagoons of the Silurian are almost gone. This small swimmer, about as long as a hand, is one of the last. It lives in bays and swamps like this one. The whole group ends in the great dying at the close of the next era, the Permian.',
  },
  rhabdoderma: {
    name: 'Coelacanth', sub: 'Rhabdoderma · a young lobe-finned fish', size: 0.1,
    facts: [['Length here', '5 to 10 cm, all young'], ['Fins', 'on short fleshy stalks with bones inside'], ['Living relatives', 'two kinds, in the deep sea']],
    text: 'A fish whose fins sit on fleshy stalks with bones inside, like short arms. From fish built this way the first four-legged animals arose, more than 50 million years before this bay. The young of this one grew up here. Its relatives were thought to be long dead, until a living one was caught in 1938.',
  },
  scaletree: {
    name: 'Scale tree', sub: 'Lepidodendron · a giant club moss', size: 30,
    facts: [['Height', '30 m and more'], ['Bark', 'a pattern of diamonds'], ['Relatives today', 'club mosses a few centimetres high']],
    text: 'A fallen giant from the swamp forest. The diamonds on its bark are the scars where leaves once sat. It is not a tree like those of today. It is a club moss with little wood, held up mostly by its thick bark. Forests of them became much of the coal of Europe and North America.',
  },
  leaves: {
    name: 'Drifting leaves', sub: 'fronds from the coal forest', size: 0.5,
    facts: [['Fronds', '10 to 50 cm'], ['Kinds of plants known from here', 'more than 400'], ['Flowers', 'none yet, anywhere']],
    text: 'Every tide carries leaves out of the forest. Most look like fern fronds, but many belonged to plants that no longer exist: ferns that made seeds. More than 400 kinds of plants are known from the rocks of this bay. There is not one flower among them, and not one blade of grass.',
  },
  forest: {
    name: 'The coal forest', sub: 'the swamp at the edge of the bay',
    facts: [['Becomes', 'coal'], ['Oxygen in the air', 'more than at any other time'], ['Lives in it', 'giant insects, the first reptiles']],
    text: 'Behind the shore stands a swamp forest. Its trees fall into wet ground where they do not rot, pile up for millions of years and turn into coal. The era is named after it: Carboniferous means coal-bearing. So much carbon is buried that the air holds more oxygen than ever before or since.',
  },
};
```

The sentences for the title menu:

> **Carboniferous · 359 to 299 million years ago.** Swamp forests of giant club mosses and ferns cover the lowlands.
> Their wood becomes coal, the air fills with oxygen, and insects grow huge. The first reptiles lay eggs on dry
> ground. You dive about 308 million years back, into a muddy bay at the edge of such a forest, in what is now
> Illinois. Most of its animals are smaller than your hand.

## Sources

Quotations are word for word from the page named. Everything else in this brief is Claude's wording or conclusion.

**Checked on 2026-11-16:**

- **Dates.** International Chronostratigraphic Chart v2024/12
  (https://stratigraphy.org/ICSchart/ChronostratChart2024-12.pdf): 358.86 and 298.9.
- **Place.** Wikipedia, "Mazon Creek fossil beds", read through Wikiwand
  (https://wikiwand.com/en/articles/Mazon_Creek): near Morris, Grundy County, Illinois; Francis Creek Shale, Upper
  Carboniferous, about 309 to 307 million years; a flora of over 400 species. Eton College Natural History Museum,
  "Mazon Creek fossils" (https://collections.etoncollege.com/museums/natural-history-museum/mazon-creek-fossils/):
  a tropical coast where the rising sea flooded swamp forest and formed shallow bays and river mouths; the fossils
  of the brackish and marine part are the Essex biota.
- `tullimonstrum`: Wikipedia, "Tullimonstrum" (https://Www.Wikipedia.org/wiki/Tully_Monster): soft-bodied, lived
  in shallow tropical coastal waters of muddy river mouths, up to 35 cm, the smallest about 8 cm, first found in
  1955 by the collector Francis Tully, known only from the Essex biota of Mazon Creek; its place among the animals
  is not settled. The same article through Wikiwand (https://wikiwand.com/en/Tullimonstrum): found together with
  Belotelson, Essexella and Bandringa.
- `essexella`: Eton College, as above: 1 to 15 cm, a recent study suggests sea anemones, not jellyfish. A summary of
  that study (https://sciencythoughts.blogspot.com/2023/03/essexella-asherae-burrowing-sea-anemone.html): described
  as a jellyfish in 1979, redescribed in 2023 as an abundant sea anemone that burrowed.
- `bandringa`: Earth Science Club of Northern Illinois (https://esconi.org/tag/mazonmonday/page/11/): a shark
  nursery about 307 million years old in the Mazon Creek nodules, species Bandringa rayi.

**Checked on 2026-11-23:**

- `tullimonstrum`: McCoy and others 2016, "The 'Tully monster' is a vertebrate", Nature, abstract
  (https://doi.org/10.1038/nature16992): "the eyes project laterally on a long rigid bar"; a trunk ending in a mouth
  piece with teeth; a segmented body; a tail fin with an upper and a lower lobe. Mikami and others 2023,
  Palaeontology 66 (2), abstract (https://palass.org/node/5854): it "may have been either a non-vertebrate chordate
  or a protostome". So the question is open.
- `bandringa`: Sallan and Coates 2014, Journal of Vertebrate Paleontology, abstract
  (https://earth.sas.upenn.edu/content/long-rostrumed-elasmobranch-bandringa-zangerl): "an elongated snout
  constituting up to half of total body length". University of Michigan, "Ancient sharks reared young in prehistoric
  river-delta nursery" (https://news.umich.edu/ancient-sharks-reared-young-in-prehistoric-river-delta-nursery): young
  of 4 to 6 inches, adults up to 10 feet; "one of the earliest known shark nurseries"; egg cases and young in the
  same beds; adults in fresh water.
- `belotelson`: Schram 2006 (https://decapoda.nhm.org/pdfs/12047/12047.pdf): "eight pairs of uniramous reptant
  thoracopods" and a generalized shrimp body. University of Illinois, "Synthesis of a Middle Pennsylvanian soft-bodied
  fauna from western Illinois" (https://www.ideals.illinois.edu/items/21434): Essexella, Belotelson and
  Tullimonstrum are among the most common fossils of the Essex assemblage.
- `scaletree`: Wikipedia, "Lepidodendron" (https://en.wikipedia.org/wiki/Lepidodendron): "sometimes reached heights
  of 50 metres"; trunks often over 1 m thick; leaf cushions at most 8 cm long and 2 cm wide. Britannica,
  "Lepidodendron": up to 40 m high; the underground parts are called Stigmaria.

**Not checked yet** (from Claude's knowledge; check before the text ships, and put the source next to the entry):

- The moment "about 308 million years ago" is the middle of the range above (other pages say 305 or 310).
- `essexella`: "thousands" of fossils restudied.
- `belotelson`: its size. `euproops`, `adelophthalmus`, `rhabdoderma`: that each is known from the salty part of the
  bay, and all sizes and facts on their cards.
- `scaletree`: that its trunks reached the bay. `leaves`: which plants.
- `forest`: how coal forms, the oxygen level (one popular source gives about 35 %), giant insects, first reptiles.

## Zoo reach to start with

| Id | Reach in metres |
|---|---|
| `scaletree` | 10 along the trunk |
| `tullimonstrum`, `adelophthalmus` | 3 |
| `belotelson` | 3 from the middle of the swarm |
| `essexella`, `bandringa`, `euproops`, `rhabdoderma`, `leaves` | 2 |
| `forest` | a backdrop, 12 from the shore |

## Only in this world

- **Murky on purpose.** With 12 m of view the player is always close to something. Place the gardens of animals
  densely, and let roots and stumps appear out of the brown as landmarks.
- **Light through leaves.** The moving shadows of floating leaves replace the flecks of sunlight of `today`: that
  is the era's own `caus`.
- **The tree shows the scale.** One viewpoint looks along the fallen trunk from its roots, so that its 30 m run
  away into the haze, with the small animals in front.
- **Land seen from the water**, as in the Silurian: trunks behind the surface and where the floor comes out of it.

## Later, not in this task

- The open sea of the same time, with sea lily meadows and the scissor-toothed shark Edestus, several metres long.
- A giant dragonfly above the surface.
- The same bay as it floods: the forest dying in salt water.
