# Brief: the Jurassic world

The sea of the great reptiles. The player dives about 165 million years back, into a warm, green sea that covers
what is now England. Long-necked plesiosaurs, a hunter with a head of 1.5 m and fish-shaped reptiles with huge eyes
swim here, and among them the largest bony fish that ever lived, 16 m long and harmless.

- **Asked for by:** Mario, 2026-11-16. He decided on 2026-11-15 that the plesiosaur of `today` moves to a world of
  its own time. This is that world.
- **Needs:** `eras.md` (done). `scale.md` for the size picture on the cards; this world does not need the close
  camera.
- **Result:** `jurassic.html`, chosen from the timeline in the title menu.

Read `CLAUDE.md`, then `era-common.md`: stages, rules, acceptance criteria, verification and how to treat facts are
there. This brief says what this world is.

## How to work (version 2 of this brief, 2026-11-23)

Written for Claude Code on Opus 4.6. With `CLAUDE.md` and `era-common.md` this brief is all you need for this era.
Do not read the briefs of the Devonian or of the Dunkleosteus. Since version 1 the facts were checked (see
"Sources"; some sizes and shapes changed), and "The look" and "Build notes" are new.

1. **Stages** as in `era-common.md`, five of them. Each ends with a hand-over, and then you stop. Never start a stage
   before Mario has accepted the one before.
2. **Start** from a copy of `source/eras/today/` (the plesiosaur and the schools are there), then take out
   everything of today.
3. **One kind at a time,** in the order given under "The ten exhibits". For each kind:
   a. Notes in `docs/research/jurassic/<id>.md` from the sources named in "Build notes": what they print, what you
      measured on which figure, what stays an estimate.
   b. The mesh, with its figures in lengths of the body in a comment.
   c. `node tools/turntable.mjs jurassic <id> <name>` (look at `node tools/chrome.mjs status` first).
   d. The visual critic on the turntable, with the list of "The look" as its questions.
   e. Correct, twice at most. Then the next kind.
4. **A source that cannot be opened:** say so in the notes and mark the figure as estimate. Never invent a
   measurement, a quotation or a colour.
5. **Budget.** Small edits in place. The engine is the only renderer. Hand-overs of 20 lines or fewer: what is in,
   what Mario should open and look at, what is still not verified, one commit message.

## The place

The Jurassic lasted from 201.4 to 143.1 million years ago. The world shows one moment in its middle, about 165
million years ago, and one place: the shallow sea whose mud became the Oxford Clay of eastern England, around
Peterborough. Europe was a group of islands in a warm sea then. For more than a century the clay was dug for
bricks, and the workers collected the bones that came out of it: whole skeletons of marine reptiles, and the pieces
of one giant fish.

## What is special about the Jurassic, and where the world shows it

| Special feature | Where the player meets it |
|---|---|
| The seas belong to reptiles | plesiosaurs, the pliosaur, the ichthyosaur, the sea crocodile |
| Two ways to be a plesiosaur: long neck and small head, or short neck and huge head | Muraenosaurus and Cryptoclidus against Liopleurodon |
| Ichthyosaurs in their final, fish-like shape | Ophthalmosaurus |
| A giant that eats plankton: the sea is richer in small life than ever before | Leedsichthys |
| Ammonites and belemnites in masses | the two cards |
| Pangaea breaks up, and shallow seas flood the continents | the menu text |
| On land the giant dinosaurs, in the air the first birds | the menu text |

## Decisions

| Decision | By |
|---|---|
| The plesiosaur of `today` moves here | Mario |
| One real place and time: the sea of the Oxford Clay, about 165 million years ago | Claude |
| The plesiosaur becomes Muraenosaurus, a long-necked plesiosaur of this sea, at 5.2 m (source). In `today` it is 8.6 m | Claude |
| Liopleurodon at 6 m with one of 8 m, after a study of 2026, not at the 25 m of a well-known television film | Claude |
| The list of the ten | Claude |

The decisions marked Claude are defaults. Mario can change them; ask before building something else.

## Atmosphere

The mood to aim for: a warm, sunlit sea, jade green and full of life, over a soft dark floor. Large animals pass in
the middle distance all the time. The friendliest of the great-reptile worlds.

| | World of today | Jurassic |
|---|---|---|
| Water | clear blue | jade green, bright, a little cloudy with plankton |
| How far one sees | far | about 40 m |
| Surface | visible from below, with waves | visible, lively, with sun glitter |
| Sunlight | strong, sharp shafts, bright flecks | strong and slightly green. Clear shafts, soft flecks on the floor |
| Drifting particles | a few | many small ones, pale green, drifting more than sinking |
| Ground | rock and sand, strong colours | soft grey-olive clay with beds of shells, a few low banks of shelly limestone, sunk logs |
| Sound | rumble, surface wash, chimes, whale calls | surface wash, a warm low hum. No whale calls: nothing here sings |

## Sea floor

- **The clay floor.** Gently rolling mud 30 to 45 m under the surface, soft, with the shells of ammonites and
  oysters lying on it.
- **Shell banks.** A few low rises of hard, shelly ground where oysters grow in beds.
- **Driftwood.** Logs from the islands, floating at the surface and sunk on the floor.
- **No wall.** The world runs out into green haze on all sides. The animals need the room.
- **Not here:** kelp, coral reef, wreck, whale tail.

## The ten exhibits

Sizes in metres, one unit is one metre.

| Id | What | Size | Shape | Movement | Where and how many |
|---|---|---|---|---|---|
| `leedsichthys` | the giant fish Leedsichthys | one of 16, one of 9 | a huge fish with a broad head, a very wide mouth, long narrow breast fins and a tall, forked tail almost 3 m high | swims slowly and steadily with its mouth open, on the widest paths of the world | 2 |
| `liopleurodon` | the pliosaur Liopleurodon | 6, one of 8 | a massive body with four large flippers, a short neck, and a head a quarter as long as the whole animal, with long jaws and big teeth | flies through the water with its four flippers, in slow, strong beats | 3 |
| `muraenosaurus` | the long-necked plesiosaur Muraenosaurus | up to 5.2 | the plesiosaur that exists in `today`: barrel body, four flippers, a neck about as long as the body, a small head, a short tail | as in `today` | 3 |
| `cryptoclidus` | the plesiosaur Cryptoclidus | about 4 | like the one above but smaller and stockier, the neck shorter, the head broader, with many thin teeth like a comb | flies with four flippers, in a group | 5 |
| `ophthalmosaurus` | the ichthyosaur Ophthalmosaurus | about 4 | shaped like a tuna or a dolphin: round body, long thin snout, a back fin, a half-moon tail; eyes as large as dinner plates | fast, with beats of the tail, in a small group | 6 |
| `crocodile` | the sea crocodile | about 3 | a slim crocodile without armour, with flippers for legs, a long narrow snout and a tail that bends down at the end and carries a fin | swims with its tail, like a fish | 5 |
| `hybodus` | the shark Hybodus | about 2 | a sturdy shark with two back fins, each with a spine in front, and small horns above the eyes of the males | cruises near the floor | 6 |
| `ammonite` | ammonites | shell 0.05 to 0.15 across | coiled shells with strong ribs and rows of small knobs, head and arms in the opening | swim in short jerks, in groups | 8 groups of about 40 |
| `belemnite` | belemnites | 0.3 to 0.5 | like small squid, with ten arms, large eyes and two fins at the pointed rear end | swim in dense schools, darting | 6 schools of about 200 |
| `gryphaea` | oyster beds | shells 0.05 to 0.1 | thick, curled oyster shells lying in beds, each with a small flat lid | none | on the shell banks |

Order of work, easiest first: oysters and driftwood, the schools (`belemnite`, `ammonite`), then
`muraenosaurus`, which exists, and from it `cryptoclidus` and `liopleurodon`, then `ophthalmosaurus`, `crocodile`,
`hybodus`, and `leedsichthys` last.

What the engine already offers: the plesiosaur of `today` with mesh, shaders, path and zoo entry
(`source/eras/today/sealife.js`, search for `lesio`). Copy it into this era as the start for three exhibits. The
fish school of `today` for the belemnites. The manta of `today` for wide, slow paths.

## The look: rules from the Cambrian and the Devonian

Mario accepted the rebuilt trilobite of the Cambrian ("exactly like this") and rejected the fish of the Devonian as
plastic and as cartoon. What made the difference:

- **L1. Form at three sizes.** The outline; forms of a few percent of the body in the mesh (ribs, steps between
  segments, lobes, spines); fine relief in the shader. Outline plus painted lines looks like a toy.
- **L2. Contrast belongs to light and shadow.** Detail of middle size is quiet. No noise that draws closed cells,
  except where the fossil has them: the small scales at the rear edge of a plesiosaur's flipper, the ribs of the ammonites.
  There they are relief, not outlines.
- **L3. No drawn dark line of one width.** A joint, a suture, a growth line is a step or a groove, shaded by the light.
- **L4. Nothing shines under water.** Shell, armour, stone and skin are matte, with a faint broad sheen at most.
- **L5. Colour only from a source.** No colour of any animal of this world Colour is sourced only for ichthyosaurs, and only for an earlier relative: dark above, pale
  below. The other large animals get the same scheme as an assumption; shells plain.
  Low saturation, each kind its own colour family, and no card says anything about colour.
- **L6. Eyes are small and dark,** never the brightest thing on an animal.
- **L7. Colour follows relief:** hollows darker and dirtier, edges and tops worn paler.
- **L8. Individuals differ** in size, tone, wear and pose, from their seed.
- **L9. Motion.** What was soft bends and lags. What was stiff does not bend. Nothing repeats exactly.
- **L10. The dead belong here.** Ammonite and oyster shells on the clay (the brief asks for them), belemnite bullets,
  sunk logs, here and there a rib or a backbone of a reptile.

### Skin of the large animals (why the fish of the Devonian failed)

This world is full of large animals with skin. That is the hardest thing for this engine: the Dunkleosteus of the
Devonian failed on it three times. So:

- **One test animal first.** Stage 3 starts with `muraenosaurus` alone. Stop after it and let Mario look. Only when he
  accepts it, build the others the same way.
- **K1. Smooth skin is smooth.** No scale texture, no cell noise, no wrinkle lines drawn on. The life is in the large
  soft forms in the mesh: muscle swelling at the base of each flipper, the ribcage as a faint barrel, a fold where a
  flipper or a neck bends, the eye in a socket, the lips of the mouth.
- **K2. Colour in zones.** Dark back, flank, pale belly, with soft wandering borders. No stripes, no spots.
- **K3. No shine,** no bright rim, no highlight but a small one in the eye.
- **K4. Wear,** sparse and from the seed: a few long scratches, a nick in a flipper edge.
- **K5. The test for every skin** is a living animal of the same build seen under water: a dolphin for the
  ichthyosaurs, a leatherback turtle for the plesiosaurs and the placodont, a marine iguana for the lizard shapes.
  If the render shows a pattern or a shine such an animal does not have, take it out.

## Build notes

| Id | Start from | Vertices each (guide) |
|---|---|---|
| `gryphaea` | a standing kind of `cambrian` (`standing.js`) | 300 |
| driftwood | `meshDriftwood` (`devonian`), without the sea lilies | as there |
| `ammonite`, `belemnite` | `meshGoniatite` (`devonian`) for shell, head and arms; the fish school of `today` | 2,500 |
| `muraenosaurus`, `cryptoclidus`, `liopleurodon` | the plesiosaur of `today` (`sealife.js`, search `lesio`) | 25,000 to 40,000 |
| `ophthalmosaurus`, `crocodile` | the plesiosaur of `today` for path and zoo; `meshCladoselache` (`devonian`) for a tail that beats | 20,000 |
| `hybodus` | `meshCtenacanthus` (`devonian`): a shark with fin spines | 12,000 |
| `leedsichthys` | `meshTitanichthys` (`devonian`): a giant that swims with its mouth open | 40,000 |

- **`muraenosaurus`** (the test animal). Up to 5.2 m. 44 neck bones; behind them 3 and 19 more to the hips. Correct
  the plesiosaur of `today` to these proportions from a skeleton drawing (Wikipedia, "Muraenosaurus", has a side
  view and a scale picture: measure). It swam with the neck held straight.
- **Skin of the three plesiosaurs.** A plesiosaur of the Early Jurassic with skin shows smooth skin without scales on
  body and tail, and small scales along the rear edge of the flippers. Assumed here for all three. So: K1 for the
  body, and a narrow band of small scales as relief at the rear edge of each flipper, nowhere else.
- **`cryptoclidus`.** About 4 m. On each side 6 and 21 teeth above and 24 to 26 below: about 100 in all, thin and
  curved, meshing when the mouth is shut.
- **`liopleurodon`.** As in version 1 (sizes from the study of 2026). The head a quarter of the length.
- **`ophthalmosaurus`.** Ophthalmosaurus icenicus, about 4 m (version 1 said 5), the head a fifth of that. A robust
  body nearly as wide as high. Eyes of 22 to 23 cm, in a ring of bone plates that does not show in life. Smooth
  skin without scales, dark above and pale below (shown for a relative, Stenopterygius).
- **`crocodile`.** The common one of this clay is the narrow-snouted Metriorhynchus superciliosus (now placed in
  another genus by some: not verified). The tail bends down at its end and carries a soft upper lobe, so it ends in
  a fin like a shark's turned upside down; flattened from side to side. Its length: not verified.
- **`hybodus`.** A hybodont shark is known from this clay (Hybodus dawni). Size and build: not verified here; use
  Martill 1989 or a museum page with a scale.
- **`leedsichthys`.** Only pieces are known. The body is an estimate; say so on no card beyond what the text says.
- **`ammonite`.** Kosmoceras, the common ammonite of this clay. Ribs and knobs are relief; no zigzag lines on a
  living shell.
- **`belemnite`.** Two kinds are known from this clay: Cylindroteuthis (the bullets) and Belemnotheutis, found with
  its soft parts: ten arms with pairs of small hooks, an ink sac, a muscular body, 10 to 30 cm long in all. Build
  the soft body after Belemnotheutis. The 30 to 50 cm of version 1 are not verified: if no source for the size of
  Cylindroteuthis is found, use 10 to 30 cm and correct the card.
- **`gryphaea`.** Found in shell beds with the belemnites.

## Texts

For the zoo file of this era. Put the source links next to each entry as comments once the facts are checked (see
`era-common.md`, "Facts and sources").

```js
// Zoo texts of the Jurassic. name, sub and text are shown as they are, facts are [label, value] rows.
const ZOO = {
  leedsichthys: {
    name: 'Leedsichthys', sub: 'Leedsichthys problematicus · the largest bony fish known', size: 16,
    facts: [['Length', 'up to about 16.5 m'], ['Food', 'plankton, strained from the water'], ['Age of the largest', 'about 38 years']],
    text: 'The largest bony fish that ever lived, and it ate the smallest food in the sea. It swam with its mouth open and strained plankton out of the water, as whale sharks do today. Its skeleton was partly cartilage and fell apart after death, so no whole one exists. Its length was worked out from pieces.',
  },
  liopleurodon: {
    name: 'Liopleurodon', sub: 'Liopleurodon ferox · the top hunter of this sea', size: 8,
    facts: [['Length', 'most 5 to 6 m, the largest about 8 m'], ['Head', 'a quarter of its length'], ['Named after', 'one tooth, found in France']],
    text: 'A plesiosaur with a short neck and a head as long as a tall man. A television film once showed it at 25 m, as long as a blue whale. In 2026 researchers measured every known specimen again: most were 5 to 6 m long, the largest just over 8 m. It still had no enemy in this sea.',
  },
  muraenosaurus: {
    name: 'Muraenosaurus', sub: 'Muraenosaurus leedsii · a long-necked plesiosaur', size: 5.2,
    facts: [['Length', 'up to 5.2 m'], ['Swims with', 'four flippers'], ['Breathes', 'air, at the surface']],
    text: 'Plesiosaurs are not dinosaurs. They are sea reptiles that rowed through the water with four flippers, something like an underwater flight. With its small head on a long neck this one could reach into a school of fish before its heavy body had come close enough to scare it.',
  },
  cryptoclidus: {
    name: 'Cryptoclidus', sub: 'Cryptoclidus eurymerus · a plesiosaur with a comb of teeth', size: 4,
    facts: [['Length', 'about 4 m'], ['Teeth', 'about 100, long and thin'], ['Young', 'probably born alive, in the water']],
    text: 'Its mouth holds about a hundred thin, pointed teeth that fit between each other when it closes: a trap for small, soft prey such as little fish and squid relatives. It is one of the best known of all plesiosaurs. Whole skeletons came out of the clay pits near Peterborough.',
  },
  ophthalmosaurus: {
    name: 'Ophthalmosaurus', sub: 'Ophthalmosaurus icenicus · the eye lizard', size: 4,
    facts: [['Length', 'about 4 m'], ['Eye', 'more than 20 cm across'], ['Young', 'born alive, tail first']],
    text: 'A reptile in the shape of a tuna, with some of the largest eyes any animal with a backbone has had: wider than a dinner plate. With such eyes it could hunt squid relatives in deep, dark water or at night. A ring of bone inside each eye kept it in shape under pressure.',
  },
  crocodile: {
    name: 'Sea crocodile', sub: 'a relative of the crocodiles, built like a fish', size: 3,
    facts: [['Length', 'about 3 m'], ['Legs', 'flippers'], ['Tail', 'ends in a fin']],
    text: 'A relative of the crocodiles that went all the way: no armour, flippers for legs, a fin on its tail and smooth skin. It could hardly move on land any more. Animals like this lived in the open sea for tens of millions of years. Its fossils were long known under the name Metriorhynchus.',
  },
  hybodus: {
    name: 'Hybodus', sub: 'Hybodus · a shark of the reptile seas', size: 2,
    facts: [['Length', 'about 2 m'], ['Teeth', 'pointed in front, flat behind'], ['Back fins', 'each with a spine']],
    text: 'While reptiles rule this sea, the sharks keep to the second row. This one has two kinds of teeth: sharp ones in front to grab slippery prey, flat ones behind to crush shells. Sharks of this group lived for more than 200 million years and died out near the end of the age of dinosaurs.',
  },
  ammonite: {
    name: 'Ammonites', sub: 'Kosmoceras · relatives of the squid in a coiled shell', size: 0.15,
    facts: [['Shell', '5 to 15 cm across'], ['Inside', 'chambers of gas, like a diving tank'], ['Die out', 'together with the dinosaurs']],
    text: 'The most common fossils of this sea. The animal lives in the last and widest chamber of its shell, and the gas in the others carries it. Ammonites change their ribs and knobs so quickly through time that geologists divide the whole Jurassic into slices named after them.',
  },
  belemnite: {
    name: 'Belemnites', sub: 'squid relatives with a bullet inside', size: 0.5,
    facts: [['Length', '30 to 50 cm'], ['Arms', 'ten, with small hooks'], ['Their fossils', 'called thunderbolts']],
    text: 'They look like squid, but they carry a pointed rod of stone in their rear end. That rod is what remains of them. The clay workers of Peterborough called them thunderbolts, because people once believed they fell from the sky in storms. Schools of them fed nearly every hunter in this sea.',
  },
  gryphaea: {
    name: 'Oysters', sub: 'Gryphaea · the devil\'s toenail', size: 0.1,
    facts: [['Shell', '5 to 10 cm'], ['Shape', 'thick and curled, with a flat lid'], ['Folk name', 'devil\'s toenail']],
    text: 'A thick, curled oyster that lay on the soft mud like a little boat, heavy enough not to be rolled over. Farmers who ploughed them up later called them devil\'s toenails. Oysters, clams and snails now take the places on the sea floor that the lamp shells held before the great dying.',
  },
};
```

The sentences for the title menu:

> **Jurassic · 201 to 143 million years ago.** The great continent breaks apart, and warm, shallow seas spread over
> its edges. Reptiles rule them: plesiosaurs, ichthyosaurs, sea crocodiles. On land the largest dinosaurs walk, and
> the first birds fly. You dive about 165 million years back, into the sea over what is now England, beside the
> largest bony fish that ever lived.

## Sources

Quotations are word for word from the page named. Everything else in this brief is Claude's wording or conclusion.

**Checked on 2026-11-16:**

- **Dates.** International Chronostratigraphic Chart v2024/12
  (https://stratigraphy.org/ICSchart/ChronostratChart2024-12.pdf): 201.4 and 143.1.
- `leedsichthys`: University of Glasgow, "Prehistoric giant fish could grow more than 16 metres long"
  (https://www.gla.ac.uk/news/archiveofnews/2013/august/headline_286495_en.html): a huge bony, plankton-eating fish
  of the Middle Jurassic, about 165 million years ago; 8 to 9 m after 20 years, 16.5 m after 38 years; a new
  specimen from Peterborough. University of Bristol (https://bristol.ac.uk/news/2013/9614.html): skeletons preserve
  poorly, often only as fragments; the existence of such large plankton feeders points to a major change in the
  plankton of the Jurassic seas. Liston, L'Écho des Falaises 2008 (https://eprints.gla.ac.uk/58380/1/58380.pdf): a
  tail 2.74 m high.
- `liopleurodon`: University of Portsmouth, "Jurassic sea monster was smaller than once thought, but no less
  formidable"
  (https://www.port.ac.uk/news-events-and-blogs/news/jurassic-sea-monster-was-smaller-than-once-thought-but-no-less-formidable)
  and the abstract of Bartlett, Martill and Smith, Journal of Vertebrate Paleontology 2026
  (https://researchportal.port.ac.uk/en/publications/re-evaluating-body-size-in-the-middle-jurassic-pliosaur-iliopleur/):
  37 specimens give 2.46 to 8.09 m; lengths of 5.7 to 25 m had been reported before; the skull is about a quarter of
  the body length; top hunter of the Oxford Clay; first described from a single tooth found near Boulogne.
  Sci.News (https://www.sci.news/paleontology/liopleurodon-ferox-14939.html): the more complete skeletons cluster
  around 4.8 to 6 m.
- **Place** and `belemnite`: the same page of the University of Portsmouth: the brick industry around Peterborough
  exposed the Jurassic clay, and workers were paid to remove fossils, from belemnites, called thunderbolts, to
  bones. Plesiosaur Directory (https://plesiosauria.com/age/middle-jurassic/): Muraenosaurus and Kosmoceras zones in
  the Oxford Clay.

**Checked on 2026-11-23:**

- `muraenosaurus`: Wikipedia, "Muraenosaurus" (https://en.wikipedia.org/wiki/Muraenosaurus): "grew up to 5.2 metres
  (17 ft) in length"; 44 neck bones, then 3 and 19; from the Oxford Clay; thought to have swum with a straight neck.
- `cryptoclidus`: The Plesiosaur Directory, "Cryptoclidus" (https://plesiosauria.com/genera/cryptoclidus/): "adults
  about four metres long"; the tooth counts; type from Peterborough.
- `ophthalmosaurus`: Wikipedia, "Ophthalmosaurus" (https://en.wikipedia.org/wiki/Ophthalmosaurus): "growing to
  measure 4 m (13 ft) in length"; a robust body nearly as wide as high; eyes of about 220 to 230 mm. British Journal
  of Ophthalmology, cover note (https://pmc.ncbi.nlm.nih.gov/articles/PMC1771016): slightly over 4 m, the head a
  fifth of the length. Moon and Kirton 2016: most material from the Oxford Clay around Peterborough.
- **Skin of plesiosaurs.** Discover Magazine, 2025, on a study in Current Biology
  (https://discovermagazine.com/the-sciences/183-million-year-old-fossil-reveals-that-plesiosaur-skin-was-smooth-and):
  a plesiosaur 183 million years old with "smooth skin in the tail region" and scales along the rear edge of the
  flipper. An earlier relative, from Germany: for this sea an assumption.
- **Skin and colour of ichthyosaurs.** Lindgren and others 2018, Nature
  (https://doi.org/10.1038/s41586-018-0775-x), abstract, on Stenopterygius: "flexible remnants of the original
  scaleless skin"; pigment cells spread so as to suggest dark above and pale below. An earlier relative.
- `crocodile`: Grange and Benton 1996, Palaeontology, abstract: Metriorhynchus superciliosus, "a common
  narrow-skulled species" of the Oxford Clay around Peterborough. Foffa and others 2014, PeerJ
  (https://peerj.com/articles/608): metriorhynchids had a "hypocercal tail with a soft-tissue upper lobe".
- `hybodus`: Martill 1989, "A new hybodont shark (Hybodus dawni) from the Oxford Clay of Peterborough" (title only,
  through shark-references.com).
- `ammonite`, `gryphaea`, `belemnite`: Scottish Geology Trust GeoGuide, Peterborough brickpits
  (https://geoguide.scottishgeologytrust.org/page/2234): "Gryphaea and belemnites (Cylindroteuthis) occur in shell
  beds". Hart and others, on a dig in the Peterborough Member (https://core.ac.uk/download/74389956.pdf):
  ammonites "dominated by abundant Kosmoceras". Donovan and Crane 1992, Palaeontology, abstract
  (https://archive.org/download/biostor-165996/biostor-165996.pdf): Belemnotheutis of the Lower Oxford Clay had
  "ten arms furnished with pairs of hooks", an ink sac, and was about 100 to 300 mm long.

**Not checked yet** (from Claude's knowledge; check before the text ships, and put the source next to the entry):

- `leedsichthys`: the shape of the living animal.
- `liopleurodon`: the television film.
- `cryptoclidus`, `ophthalmosaurus`: live birth; birth tail first.
- `crocodile`: its length, its present name, that it had no armour.
- `hybodus`: 2 m, the teeth, the horns of the males.
- `ammonite`, `gryphaea`: sizes. `belemnite`: the size of Cylindroteuthis, the fins.
- The moment "about 165 million years ago" and Europe as a group of islands.

## Zoo reach to start with

| Id | Reach in metres |
|---|---|
| `leedsichthys` | 25 |
| `liopleurodon`, `muraenosaurus`, `ophthalmosaurus` | 12 |
| `cryptoclidus`, `crocodile`, `hybodus` | 8 |
| `ammonite`, `belemnite` | 6 from the middle of the group |
| `gryphaea` | 2 |

## Only in this world

- **Room for 16 m.** Leedsichthys needs a path with a radius of 40 m or more and open water around it. One
  viewpoint has to show the whole animal from the side, with a school of belemnites or a Cryptoclidus near it for
  scale.
- **The plesiosaur moves.** When Mario has accepted this world, take the plesiosaur out of `today`: its kind, its
  instances, its shaders, its zoo entry and its text. This is the one allowed change to `today`. Viewpoint 1 of
  `today` showed it, so that viewpoint gets a new reference render. Ask Mario before doing it, and do it as a step
  of its own.
- **Four flippers, two rhythms.** Plesiosaurs beat the front and the hind pair out of step. The shader of `today`
  does that already. Keep it for all three.
- **A tail that beats sideways.** Ichthyosaur, sea crocodile and sharks swing the tail from side to side, not up
  and down as whales do.

## Later, not in this task

- A coral reef and lagoon of the late Jurassic, as at Solnhofen.
- Floating logs overgrown with giant sea lilies, as at Holzmaden.
- Liopleurodon hunting.
