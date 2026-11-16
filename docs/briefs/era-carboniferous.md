# Brief: the Carboniferous world

The age of coal. The player dives about 308 million years back, into a shallow, muddy bay at the edge of a swamp
forest in what is now Illinois. The water is brown with mud and full of fallen leaves. It is a nursery of small and
strange animals, among them one that nobody has been able to place: the Tully monster.

- **Asked for by:** Mario, 2026-11-16.
- **Needs:** `eras.md` (done). `scale.md` for the size picture and for the close camera, which this world asks for.
- **Result:** `carboniferous.html`, chosen from the timeline in the title menu.

Read `CLAUDE.md`, then `era-common.md`: stages, rules, acceptance criteria, verification and how to treat facts are
there. This brief says what this world is.

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
| `tullimonstrum` | the Tully monster | 0.08 to 0.35 | a soft torpedo with faint segments, a tail with two fins like a squid's, a stiff bar across the back with an eye at each end, a long thin trunk ending in a small claw with teeth | swims by waving its tail fins; the trunk reaches and snaps | about 40 |
| `essexella` | the sea anemone Essexella | 0.01 to 0.15 | a soft barrel, its lower part dug into the mud, a ring of short tentacles on top | tentacles move; pulls in when something comes near | several hundred, in the mud |
| `bandringa` | young Bandringa sharks | 0.1 to 0.15 | a small shark with a very long, flat snout like a paddle, about half as long as its body | swim close to the floor, snout sweeping | about 60, near the roots |
| `belotelson` | the shrimp-like Belotelson | about 0.08 | like a sturdy shrimp: long feelers, a row of swimming legs, a tail fan | swarms, short darts | 8 swarms of about 100 |
| `euproops` | the horseshoe crab Euproops | about 0.05 | a domed, horseshoe-shaped shield with spines along its rim, a tail spike | walks on the mud and among the leaves | about 80 |
| `adelophthalmus` | the sea scorpion Adelophthalmus | about 0.2 | slim, with a rounded head shield, paddles and a tail spike | swims with its paddles | about 15 |
| `rhabdoderma` | young coelacanths | 0.05 to 0.1 | a deep-bodied little fish whose fins sit on short fleshy stalks, with a tail in three lobes | hover among the roots, fins moving one by one | about 40 |
| `scaletree` | the fallen scale tree | 30 long, trunk 1 thick at its foot | a straight trunk with bark in a pattern of diamonds, forking twice at the top end, with roots like spokes | none | 1, and about 20 stumps of the same kind |
| `leaves` | drifting leaves | fronds 0.1 to 0.5 | fern-like fronds and single leaflets, brown and dark green | sink slowly, turning; float on the surface | everywhere |
| `forest` | the coal forest | no `size` | the wall of trunks and green at the shore | sways a little in the wind | the shore side, as a backdrop |

Order of work, easiest first: the forest edge, stumps, fallen tree and leaves, then the anemones, then the swimmers
(`belotelson`, `rhabdoderma`, `bandringa`, `adelophthalmus`, `tullimonstrum`), then the walker (`euproops`).

What the engine already offers: scattering in masses, sprites (for sinking leaves, if they can be given a shape),
swarms, walkers, and the wave along a flap from the manta of `today` for the tail fins of the Tully monster.

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
    facts: [['Length here', '10 to 15 cm, all young'], ['Snout', 'about half as long as the body'], ['This bay', 'the oldest shark nursery known']],
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

**Not checked yet** (from Claude's knowledge, check before the text ships):

- The moment "about 308 million years ago" is the middle of the range above.
- `tullimonstrum`: details of the body (eye bar, trunk with claw, tail fins); the candidates fish, worm, snail.
- `essexella`: "thousands" of fossils restudied.
- `bandringa`: size of the young, length of the snout, egg cases, adults in freshwater rocks, "oldest nursery
  known".
- `belotelson`, `euproops`, `adelophthalmus`, `rhabdoderma`: that each is known from the Essex biota, and all sizes
  and facts on their cards (the idea that Euproops went ashore, the last sea scorpions, the coelacanth of 1938, the
  timing of the first four-legged animals).
- `scaletree`: Lepidodendron, 30 m, the bark, its build, coal. Also that its trunks reached the bay.
- `leaves`: seed ferns; no flowers and no grass before the age of the dinosaurs.
- `forest`: how coal forms, the meaning of the name, the oxygen level, giant insects, first reptiles.

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
