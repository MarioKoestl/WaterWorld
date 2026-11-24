# Brief: the Triassic world

Reptiles go back to the sea. The player dives about 242 million years back, into a tropical lagoon on the coast of
the Tethys ocean, where Monte San Giorgio stands today, on the border of Switzerland and Italy. Fish-shaped
reptiles 8 m long swim here, small ones in schools, armoured ones on the floor, and one with a neck of 3 m.

- **Asked for by:** Mario, 2026-11-16.
- **Needs:** `eras.md` (done). `scale.md` for the size picture on the cards; this world does not need the close
  camera.
- **Result:** `triassic.html`, chosen from the timeline in the title menu.

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
   a. Notes in `docs/research/triassic/<id>.md` from the sources named in "Build notes": what they print, what you
      measured on which figure, what stays an estimate.
   b. The mesh, with its figures in lengths of the body in a comment.
   c. `node tools/turntable.mjs triassic <id> <name>` (look at `node tools/chrome.mjs status` first).
   d. The visual critic on the turntable, with the list of "The look" as its questions.
   e. Correct, twice at most. Then the next kind.
4. **A source that cannot be opened:** say so in the notes and mark the figure as estimate. Never invent a
   measurement, a quotation or a colour.
5. **Budget.** Small edits in place. The engine is the only renderer. Hand-overs of 20 lines or fewer: what is in,
   what Mario should open and look at, what is still not verified, one commit message.

## The place

The Triassic lasted from 251.902 to 201.4 million years ago. The world shows one moment in its middle, about 242
million years ago, and one place: the lagoon whose mud became the rocks of Monte San Giorgio, a World Heritage site
south of Lake Lugano. It was a tropical lagoon, sheltered and partly cut off from the open sea by a reef. Its deep
water was still and had no oxygen, so what sank to the floor was kept whole, down to unborn young inside their
mothers.

The rocks of Monte San Giorgio span a few million years in several fossil beds. The world puts animals from more
than one of those beds into one lagoon. They are all from this place.

## What is special about the Triassic, and where the world shows it

| Special feature | Where the player meets it |
|---|---|
| Life starts again after the great dying, with new players | the whole cast: hardly a group here existed in the Permian sea |
| Reptiles return to the sea, in many different builds | ichthyosaurs, nothosaur, pachypleurosaur, placodont, thalattosaur, Tanystropheus |
| Giving birth in the water | Mixosaurus, the fish Saurichthys |
| The strangest neck in the history of reptiles | Tanystropheus |
| Still one continent, Pangaea, and one great ocean | the menu text |
| On land, later in this era: the first dinosaurs and the first mammals | the menu text |

## Decisions

| Decision | By |
|---|---|
| One real place: the lagoon of Monte San Giorgio, about 242 million years ago, with animals from several of its beds | Claude |
| Besanosaurus is the giant, at 8 m, the largest specimen. Most were 4 to 6 m | Claude |
| The list of the ten | Claude |

The decisions marked Claude are defaults. Mario can change them; ask before building something else.

## Atmosphere

The mood to aim for: a bright emerald lagoon between white banks of lime, lively near the surface, with a dark,
motionless deep in its middle that nothing enters.

| | World of today | Triassic |
|---|---|---|
| Water | clear blue | clear emerald green over the banks, dark green and still in the deep middle |
| How far one sees | far | about 45 m above, 15 m in the deep |
| Surface | visible from below, with waves | visible, calm |
| Sunlight | strong, sharp shafts, bright flecks | strong. Bright flecks on the white banks, shafts that stop at the dark water |
| Drifting particles | a few | few above, a slow rain of fine flakes into the deep |
| Ground | rock and sand, strong colours | white and cream lime banks with green algae crusts, black mud in the deep |
| Sound | rumble, surface wash, chimes, whale calls | gentle surface wash, distant surf on the reef, a low still tone over the deep. No calls |

## Sea floor

- **The banks.** Broad platforms of pale lime, 3 to 12 m deep, with ledges and shallow pools, around most of the
  world.
- **The basin.** In the middle the floor drops to about 45 m: smooth black mud, no life on it, a few skeletons
  lying whole.
- **The reef.** On one side, far out, a bright line of breaking water seen through the surface. The open sea lies
  beyond it and is not part of the world.
- **Not here:** kelp, sea lily meadows, anything from the Permian reef.

## The ten exhibits

Sizes in metres, one unit is one metre.

| Id | What | Size | Shape | Movement | Where and how many |
|---|---|---|---|---|---|
| `besanosaurus` | the ichthyosaur Besanosaurus | 8 | a long, slender body, a small head with a very long, thin snout and tiny teeth, four long narrow flippers, a long tail with a low fin, not the half-moon tail of later ichthyosaurs | swims like an eel, with the whole body, on wide paths over the basin | 2 |
| `mixosaurus` | the small ichthyosaur Mixosaurus | about 1 | like a small dolphin with a long snout, large eyes, a back fin and a tail fin with a triangular upper lobe | fast, in schools | 3 schools of about 12 |
| `tanystropheus` | Tanystropheus | up to 6, of which the neck 3 | a lizard body with a neck as long as body and tail together, stiff as a rod, a small head with curved teeth and nostrils on top | hangs still in murky water or glides slowly, the small head far ahead of the body; strikes sideways | 4 |
| `ceresiosaurus` | the nothosaur Ceresiosaurus | 3 | a long body, a long neck, a small flat head, a long tail; four limbs that have become paddles with long fingers | swims with its front paddles and tail | 5 |
| `neusticosaurus` | the small reptile Neusticosaurus | 0.2 to 0.5 | a slim little lizard shape with a long neck and tail and a small head | swims with a wave of body and tail, in groups; rests on the banks | 5 groups of about 30 |
| `cyamodus` | the placodont Cyamodus | about 1.3 | broad and flat under a shield of bony plates in two parts, much like a turtle; a short, wide head | paddles slowly over the banks, head down | 6 |
| `askeptosaurus` | the thalattosaur Askeptosaurus | about 3 | a long, slim lizard with a long neck, a long straight snout that ends bluntly, and a very long tail, flattened from side to side | swims like an eel | 3 |
| `saurichthys` | the fish Saurichthys | up to 1 | built like a pike: long, thin, with a beak full of teeth and its fins set far back | stands still, then shoots forward | about 30 |
| `ammonoid` | ammonoids | shell 0.05 to 0.15 across | coiled, ribbed shells with head and arms in the opening | swim in short jerks, in groups | 4 groups of about 30 |
| `daonella` | the clam Daonella | 0.03 to 0.08 | thin, flat, half-round shells with fine ribs, lying edge to edge | none | pavements on the slope down to the basin |

Order of work, easiest first: the clams, then the schools (`ammonoid`, `saurichthys`, `mixosaurus`,
`neusticosaurus`), then the single swimmers (`askeptosaurus`, `ceresiosaurus`, `cyamodus`, `tanystropheus`), then
`besanosaurus`.

What the engine already offers: a long animal that follows its path with its whole body (the plesiosaur of
`today`) is the model for five of these. Schools and pavements as in `today` and `cambrian`.

## The look: rules from the Cambrian and the Devonian

Mario accepted the rebuilt trilobite of the Cambrian ("exactly like this") and rejected the fish of the Devonian as
plastic and as cartoon. What made the difference:

- **L1. Form at three sizes.** The outline; forms of a few percent of the body in the mesh (ribs, steps between
  segments, lobes, spines); fine relief in the shader. Outline plus painted lines looks like a toy.
- **L2. Contrast belongs to light and shadow.** Detail of middle size is quiet. No noise that draws closed cells,
  except where the fossil has them: the plates of the placodont's shell, the scales of the fish.
  There they are relief, not outlines.
- **L3. No drawn dark line of one width.** A joint, a suture, a growth line is a step or a groove, shaded by the light.
- **L4. Nothing shines under water.** Shell, armour, stone and skin are matte, with a faint broad sheen at most.
- **L5. Colour only from a source.** No colour of any animal of this world Colour is sourced only for ichthyosaurs, and only for a later relative: dark above, pale
  below. The other reptiles get the same scheme as an assumption; shells and fish plain.
  Low saturation, each kind its own colour family, and no card says anything about colour.
- **L6. Eyes are small and dark,** never the brightest thing on an animal.
- **L7. Colour follows relief:** hollows darker and dirtier, edges and tops worn paler.
- **L8. Individuals differ** in size, tone, wear and pose, from their seed.
- **L9. Motion.** What was soft bends and lags. What was stiff does not bend. Nothing repeats exactly.
- **L10. The dead belong here.** Whole skeletons on the black mud of the basin (the brief asks for them), single
  clam shells on the slope.

### Skin of the large animals (why the fish of the Devonian failed)

This world is full of large animals with skin. That is the hardest thing for this engine: the Dunkleosteus of the
Devonian failed on it three times. So:

- **One test animal first.** Stage 3 starts with `mixosaurus` alone. Stop after it and let Mario look. Only when he
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
| `daonella` | a standing kind of `cambrian` (`standing.js`) | 150 |
| `ammonoid` | `meshGoniatite` (`devonian`) | 2,500 |
| `saurichthys` | `meshKentuckia` (`devonian`): a fish that darts | 3,000 |
| `mixosaurus`, `besanosaurus` | the plesiosaur of `today` for body, path and zoo; `meshCladoselache` for a tail that beats | 12,000 and 30,000 |
| `neusticosaurus`, `askeptosaurus`, `ceresiosaurus`, `tanystropheus` | the plesiosaur of `today` (a long animal that follows its path with its whole body) | 5,000 to 25,000 |
| `cyamodus` | the plesiosaur of `today` for the paddling; the shell is new | 15,000 |

- **`mixosaurus`** (the test animal). Mixosaurus cornalianus. Two skeletons with skin are described in Renesto and
  others 2020 (open access, with photographs and drawings: measure there): a back fin, a tail fin whose upper lobe is
  a well-developed triangle, and skin without scales. It ate squid relatives and small fish. Dark above, pale below
  (shown for a later ichthyosaur, assumed here).
- **`besanosaurus`.** Shape from the figures of Bindellini and others 2021 (PeerJ, open access). Whether it had a
  back fin is not known: none, or a low one, estimate.
- **`tanystropheus`.** The large species of this lagoon is Tanystropheus hydroides. Thirteen very long neck bones,
  stiffened by long neck ribs: the neck is three times as long as the trunk and bends little. Nostrils on top of the
  snout, curved teeth. It lived in the water and hunted from ambush, the small head far ahead of the body. Skeleton
  drawing with a diver for scale: press release of the University of Zurich, 2020 (measure, do not copy).
- **`askeptosaurus`.** Up to 3 m, the skull 26 cm. A long neck, small but complete limbs, a tail of more than half
  the length. The snout is long and straight and ends bluntly (not pointed, as version 1 said).
- **`cyamodus`.** Cyamodus hildegardis. Scheyer 2010 (Palaeontologia Electronica, open access) has a life
  reconstruction: a rounder shell than in its relatives, with a row of larger plates along its edge. The plates are
  real (L2): low bumps with soft grooves between, under skin, not a drawn pattern.
- **`ceresiosaurus`, `neusticosaurus`.** Shapes and sizes of the species: not verified beyond version 1. The small
  ones (pachypleurosaurs) lived in shallow water. Find a skeleton drawing with a scale for each before modelling.
- **`saurichthys`, `ammonoid`, `daonella`.** As in the table. Living ammonoids show no zigzag lines (they are inside
  the shell); ribs are relief.

## Texts

For the zoo file of this era. Put the source links next to each entry as comments once the facts are checked (see
`era-common.md`, "Facts and sources").

```js
// Zoo texts of the Triassic. name, sub and text are shown as they are, facts are [label, value] rows.
const ZOO = {
  besanosaurus: {
    name: 'Besanosaurus', sub: 'Besanosaurus leptorhynchus · an early giant ichthyosaur', size: 8,
    facts: [['Length', 'up to about 8 m, most 4 to 6 m'], ['Snout', 'very long and thin, with tiny teeth'], ['Found', 'only at Monte San Giorgio']],
    text: 'Ichthyosaurs are reptiles whose ancestors walked on land. Within a few million years in the sea they looked like fish, and some grew huge. This one is the largest animal of the lagoon. With its long, thin snout and tiny teeth it snapped up small, quick prey such as fish and squid relatives.',
  },
  mixosaurus: {
    name: 'Mixosaurus', sub: 'Mixosaurus cornalianus · a small ichthyosaur', size: 1,
    facts: [['Length', 'about 1 m'], ['Breathes', 'air, at the surface'], ['Young', 'born alive, in the water']],
    text: 'A reptile shaped like a small dolphin, long before there were dolphins. It could not go ashore to lay eggs any more. Fossils from this lagoon show how it solved that: mothers with unborn young inside them. Ichthyosaurs gave birth in the water, as whales do today.',
  },
  tanystropheus: {
    name: 'Tanystropheus', sub: 'Tanystropheus hydroides · the reptile with the impossible neck', size: 6,
    facts: [['Length', 'up to 6 m'], ['Neck', 'half of that, on only 13 bones'], ['Food', 'fish and squid relatives']],
    text: 'Its neck is as long as its body and tail together, and it has only 13 bones in it, each one stretched like a rod. So the neck was stiff. When its bones were first found, they were taken for the wing bones of a flying reptile. It probably waited for fish and struck sideways with its small, toothed head.',
  },
  ceresiosaurus: {
    name: 'Ceresiosaurus', sub: 'Ceresiosaurus · a nothosaur', size: 3,
    facts: [['Length', 'about 3 m'], ['Limbs', 'paddles with long fingers'], ['Named after', 'Lake Lugano, in Italian Ceresio']],
    text: 'Halfway between a lizard and a sea monster. Its legs are turning into paddles, but it still has fingers and toes, and it could probably haul itself onto a beach, as seals do. From reptiles like this one the plesiosaurs will arise, the long-necked swimmers of the next two eras.',
  },
  neusticosaurus: {
    name: 'Neusticosaurus', sub: 'Neusticosaurus · the most common reptile of the lagoon', size: 0.5,
    facts: [['Length', '20 to 50 cm'], ['Fossils found', 'many hundreds'], ['Swims with', 'its body and tail']],
    text: 'The little reptile that everything larger eats. Hundreds of skeletons have been found at Monte San Giorgio, from newly hatched young to adults, so its whole life is known: how fast it grew, how old it got, how males and females differed. Few extinct animals are known that well.',
  },
  cyamodus: {
    name: 'Cyamodus', sub: 'Cyamodus · a placodont', size: 1.3,
    facts: [['Length', 'about 1.3 m'], ['Shell', 'bony plates, in two parts'], ['Teeth', 'flat, like paving stones']],
    text: 'It looks like a turtle and is not one: armour was invented twice. Its mouth holds a few large, flat teeth, black and round like pebbles. With them it cracked the shells of clams and snails that it found on the lime banks. The whole group dies out at the end of the Triassic.',
  },
  askeptosaurus: {
    name: 'Askeptosaurus', sub: 'Askeptosaurus italicus · a thalattosaur', size: 3,
    facts: [['Length', 'about 3 m'], ['Tail', 'more than half of that'], ['Its group', 'lived only in the Triassic']],
    text: 'One more kind of reptile that tried the sea: long, slim, with a tail like an eel and feet that still had claws. The Triassic is full of such experiments. Most of them last a few million years and disappear, and only a handful of lines make it into the Jurassic.',
  },
  saurichthys: {
    name: 'Saurichthys', sub: 'Saurichthys · a hunter built like a pike', size: 1,
    facts: [['Length', 'up to 1 m'], ['Hunts', 'from ambush, with a sudden dash'], ['Young', 'born alive']],
    text: 'Long body, long beak, fins set far back: the build of a pike or a needlefish, for a sudden dash from standstill. Most fish lay eggs. This one did not. Fossils from the lagoon show females with unborn young inside, some of the oldest proof of live birth in ray-finned fishes.',
  },
  ammonoid: {
    name: 'Ammonoids', sub: 'the survivors of the great dying', size: 0.15,
    facts: [['Shell', '5 to 15 cm across'], ['Came through the great dying', 'only a few kinds'], ['Used here for', 'telling the age of each bed']],
    text: 'Only a few kinds of ammonoids survived the end of the Permian. From them the seas filled again within a few million years, with hundreds of new kinds. They change so fast that geologists use them as a clock: the layers of Monte San Giorgio are dated by their ammonoids.',
  },
  daonella: {
    name: 'Daonella', sub: 'a clam as thin as paper', size: 0.08,
    facts: [['Width', '3 to 8 cm'], ['Shell', 'thin, with fine ribs'], ['Lies', 'on the mud, by the thousand']],
    text: 'These thin shells cover whole layers of the lagoon mud. How they lived is a puzzle, because the deep floor had no oxygen. Perhaps they lived at its upper edge, where a little air was left, or settled the floor in the short times when fresh water reached it.',
  },
};
```

The sentences for the title menu:

> **Triassic · 252 to 201 million years ago.** The great dying has emptied the seas, and new animals fill them.
> Reptiles go back into the water and become swimmers of many builds. On land, late in this era, the first dinosaurs
> and the first mammals appear. You dive about 242 million years back, into a tropical lagoon where Monte San
> Giorgio stands today, south of the Alps.

## Sources

Quotations are word for word from the page named. Everything else in this brief is Claude's wording or conclusion.

**Checked on 2026-11-16:**

- **Dates.** International Chronostratigraphic Chart v2024/12
  (https://stratigraphy.org/ICSchart/ChronostratChart2024-12.pdf): 251.902 and 201.4.
- **Place.** UNESCO, World Heritage nomination of Monte San Giorgio with the evaluation by IUCN
  (https://webarchive.unesco.org/web/20160819121735/http://whc.unesco.org/uploads/nominations/1090bis.pdf): life in
  a tropical lagoon, sheltered and partly separated from the open sea by an offshore reef, with reptiles, fish,
  bivalves, ammonites and echinoderms. Klug and others, Swiss Journal of Palaeontology 2024
  (https://doi.org/10.1186/s13358-024-00308-7): Monte San Giorgio as the type of Triassic black shale fossil beds;
  Tanystropheus, Cyamodus and Mixosaurus cornalianus from there; unborn young inside the mother in Mixosaurus and in
  Saurichthys; the clam Daonella.
- `besanosaurus`: Phys.org (https://phys.org/news/2021-05-slender-snouted-besanosaurus-meter-long-marine-snapper.pdf)
  on Bindellini and others, PeerJ 2021: an 8 m ichthyosaur with an extremely long, thin snout and tiny pointed
  teeth. Deposits Magazine, "Triassic beasts and where to find them"
  (https://depositsmag.com/2019/01/25/triassic-beasts-and-where-to-find-them/): skeletons of 4 to 6 m, found only
  at Monte San Giorgio.
- `ceresiosaurus`, `neusticosaurus`: the same article of Deposits Magazine: Ceresiosaurus is a nothosaur 3 m long;
  Neusticosaurus is the most abundant reptile of its beds; Tanystropheus, Ceresiosaurus and Neusticosaurus occur
  together in the Cassina beds.
- `saurichthys`: Museo cantonale di storia naturale, Ticino, "I fossili"
  (https://m4.ti.ch/fileadmin/DT/temi/mcsn/Monte_San_Giorgio/documentazione/I_Fossili.pdf): a predator up to 1 m
  long with a lightning strike.

**Checked on 2026-11-23:**

- `tanystropheus`: University of Zurich, "Long Neck Helped Reptile Hunt Underwater", 2020
  (https://www.news.uzh.ch/en/articles/2020/Tanystropheus.html, also at https://idw-online.de/en/news752210): "had
  only 13 extremely elongated vertebrae"; the neck three times as long as the torso; it lived in water; two species
  in this lagoon, a large and a small one. Spiekman and others 2020, Current Biology, summary: aquatic habits, the
  large species named T. hydroides. Phys.org on the same study: nostrils on top of the snout, curved teeth, the
  large ones about twenty feet long.
- `mixosaurus`: Renesto and others 2020, Acta Palaeontologica Polonica 65 (3), 511 to 522
  (https://doi.org/10.4202/app.00731.2020), abstract: "the oldest amniote so far known that developed a dorsal fin";
  a triangular upper lobe of the tail fin; skin without scales; stomach contents of squid relatives and small fish.
- `askeptosaurus`: Wikipedia, "Askeptosaurus": "a total length up to 3 metres", skull 26 cm, a long neck, a very long
  tail. Klein and others 2023, Swiss Journal of Palaeontology (https://pmc.ncbi.nlm.nih.gov/articles/PMC10432342):
  "a long, straight, and bluntly terminating snout" and a tail of more than half the length.
- `cyamodus`: Scheyer 2010, Palaeontologia Electronica (https://palaeo-electronica.org/2010_2/232/232.pdf),
  abstract: "a series of similar-sized, enlarged lateral armour plates"; the shell rounder than thought; a new life
  reconstruction.
- **Skin and colour of ichthyosaurs.** Lindgren and others 2018, Nature
  (https://doi.org/10.1038/s41586-018-0775-x), abstract, on Stenopterygius, an ichthyosaur of the Early Jurassic:
  "flexible remnants of the original scaleless skin"; the spread of the pigment cells suggests dark above and pale
  below. This is a later relative: for the animals of this lagoon it is an assumption.

**Not checked yet** (from Claude's knowledge; check before the text ships, and put the source next to the entry):

- The moment "about 242 million years ago" (the Zurich release gives the same figure for Tanystropheus).
- `besanosaurus`: its food; how it swam; a back fin.
- `mixosaurus`: 1 m.
- `tanystropheus`: 6 m exactly; its food on the card.
- `ceresiosaurus`: the name; nothosaurs as relatives of the plesiosaurs' ancestors.
- `neusticosaurus`: sizes, number of skeletons.
- `cyamodus`: 1.3 m, the shell in two parts, the teeth.
- `askeptosaurus`: the life span of its group.
- `saurichthys`, `ammonoid`, `daonella`: as in version 1.
- Menu text: first dinosaurs and mammals late in the Triassic.

## Zoo reach to start with

| Id | Reach in metres |
|---|---|
| `besanosaurus` | 15 |
| `tanystropheus`, `ceresiosaurus`, `askeptosaurus` | 8 |
| `cyamodus`, `saurichthys` | 5 |
| `mixosaurus`, `neusticosaurus`, `ammonoid` | 6 from the middle of the group |
| `daonella` | 2 |

## Only in this world

- **A stiff neck.** Tanystropheus must not bend its neck like a swan. It turns the whole neck from the shoulders,
  a little.
- **Not yet a fish shape.** The ichthyosaurs of the Triassic have long tails with a low fin. The half-moon tail and
  the round body come in the Jurassic. Keep the two worlds apart.
- **The dark middle.** Exposure and haze change with the depth (`ERA.tick()`). No animal path goes below 25 m.
- **One whole skeleton on the black mud**, a Neusticosaurus or a Mixosaurus, at the one viewpoint in the deep: it
  shows why this place is famous.

## Later, not in this task

- The giants of the late Triassic: ichthyosaurs of 20 m and more.
- The shore, with the land reptiles that fell into the lagoon.
- The first modern corals.
