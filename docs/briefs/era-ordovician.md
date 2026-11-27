# Brief: the Ordovician world

The sea fills up. The player dives about 450 million years back, to a warm, shallow sea that covers most of North
America. The floor is crowded with shells, sea lilies and stony thickets, and above it hunts the largest animal the
Earth has seen so far: a squid relative in a straight shell almost 6 m long.

- **Asked for by:** Mario, 2026-11-16.
- **Needs:** `eras.md` (done). `scale.md` for the size picture on the cards; this world does not need the close
  camera, but its small exhibits gain from it.
- **Result:** `ordovician.html`, chosen from the timeline in the title menu.

Read `CLAUDE.md`, then `era-common.md`: stages, rules, acceptance criteria, verification and how to treat facts are
there. This brief says what this world is.

## How to work (version 2 of this brief, 2026-11-23)

Written for Claude Code on Opus 4.6. With `CLAUDE.md` and `era-common.md` this brief is all you need for this era.
Do not read the briefs of the Devonian. Since version 1 the facts were checked (see "Sources"; some numbers changed),
and "The look" and "Build notes" are new.

1. **Stages** as in `era-common.md`, five of them. Each ends with a hand-over, and then you stop. Never start a stage
   before Mario has accepted the one before.
2. **Start** from a copy of `source/eras/cambrian/` (floor life, walkers and swarms are there), then take out
   everything Cambrian.
3. **One kind at a time,** in the order given under "The ten exhibits". For each kind:
   a. Notes in `docs/research/ordovician/<id>.md` from the sources named in "Build notes": what they print, what you
      measured on which figure, what stays an estimate.
   b. The mesh, with its figures in lengths of the body in a comment.
   c. `node tools/turntable.mjs ordovician <id> <name>` (look at `node tools/chrome.mjs status` first).
   d. The visual critic on the turntable, with the list of "The look" as its questions.
   e. Correct, twice at most. Then the next kind.
4. **A source that cannot be opened:** say so in the notes and mark the figure as estimate. Never invent a
   measurement, a quotation or a colour.
5. **Budget.** Small edits in place. The engine is the only renderer. Hand-overs of 20 lines or fewer: what is in,
   what Mario should open and look at, what is still not verified, one commit message.

## The place

The Ordovician lasted from 486.85 to 443.1 million years ago. The world shows one moment late in it, about 450
million years ago, and one place: the shallow tropical sea over what is now Ohio, Kentucky and Indiana, around
Cincinnati. Its lime mud and shell beds are among the richest fossil grounds of this age. Storms stirred the floor
again and again and buried what lived on it.

One exhibit comes from the same sea a little further west and a few million years earlier: the armoured fish
Astraspis, from Colorado. The brief bends the rule of one place here, because the first fish with bone belong to
the story of this era.

## What is special about the Ordovician, and where the world shows it

| Special feature | Where the player meets it |
|---|---|
| Life in the sea multiplies: more than three times as many kinds at the end as at the start | the crowded floor; the menu text |
| The sea stands higher than ever: most continents are flooded | the wide shallow floor without a shore |
| New builders: moss animals, corals, sea lilies | the thickets, the horn corals, the meadows |
| Giant hunters in straight shells | Endoceras |
| The first sea scorpions | Megalograptus |
| The first fish with armour of bone, still without jaws | Astraspis |
| The land is still almost bare: the first tiny plants reach the shore | the menu text |
| It ends in ice and in the second largest mass extinction | the menu text; the trilobite card |

## Decisions

| Decision | By |
|---|---|
| One real sea and time: the Cincinnati region, about 450 million years ago | Claude |
| Astraspis is added from Colorado | Claude |
| The giant is Endoceras at 5.7 m, the largest estimate that the sources support, not the 9 m of older books | Claude |
| The list of the ten | Claude |
| Endoceras stays as a guest: the giant found in the Cincinnati rocks is Cameroceras, with no size found | Claude, 2026-11-23 |
| Megalograptus is 0.78 m, not 1 m (source) | Claude, 2026-11-23 |

The decisions marked Claude are defaults. Mario can change them; ask before building something else.

## Atmosphere

The mood to aim for: a bright, warm, busy sea floor in clear aquamarine water. After the dusk of the Cambrian and
the stillness before it, this is the first world that feels full.

| | World of today | Ordovician |
|---|---|---|
| Water | clear blue | clear aquamarine, greener towards the distance |
| How far one sees | far | about 60 m |
| Surface | visible from below, with waves | visible, 10 to 25 m above the floor |
| Sunlight | strong, sharp shafts, bright flecks | strong, a little softer. Flecks on the pale floor |
| Drifting particles | a few | a few, and shell grit lifted near the floor |
| Ground | rock and sand, strong colours | pale lime mud and pavements of shells, low ledges of grey limestone, no high rock |
| Sound | rumble, surface wash, chimes, whale calls | surface wash, soft clicks and crackle from the floor. No calls |

## Sea floor

- **The shelf.** A wide, gently rolling floor of pale mud, 10 to 25 m deep, with low limestone ledges a metre or two
  high. No wall, no canyon: the view ends in the haze.
- **Shell pavements.** Wide patches where lamp shells lie edge to edge.
- **Meadows.** Stands of sea lilies on the ledges and rises.
- **Thickets.** Moss animals and horn corals on every hard patch.
- **Storm beds.** A few fresh sheets of broken shells, swept together by the last storm.
- **Not here:** fish in schools, seaweed forests, anything with jaws.

## The ten exhibits

Sizes in metres, one unit is one metre.

| Id | What | Size | Shape | Movement | Where and how many |
|---|---|---|---|---|---|
| `endoceras` | Endoceras, the giant | shell 5.7 long, 0.3 thick at the opening | a long straight cone with low rings around it; at the wide end a head with eyes and a ring of arms | glides slowly 1 to 12 m over the floor, shell level, shell tip first; the arms of the low ones reach down | 100, from 1.8 to 5.7 m long, their rounds may cross |
| `orthocones` | small straight-shelled relatives | 0.15 to 0.4 | the same in small, smooth, with darker bands on the upper side only | swim in loose groups, in short jerks, shell tip first | 45 groups of 20 to 80, and 150 alone: about 2,500 |
| `isotelus` | the trilobite Isotelus | up to 0.4 | a broad smooth oval in three parts, head and tail like shovels, small eyes | walks, ploughs through the mud; some lie half dug in | about 600 |
| `megalograptus` | the sea scorpion Megalograptus | up to 0.78 | a scorpion shape: head shield, two long spiny grasping arms, paddles, a tail spike between two grasping blades | walks on the floor, swims in short bursts | about 45, each alone |
| `crinoid` | sea lilies | 0.3 to 1 high | a stalk of stacked discs, a cup on top with feathery arms | sway; the arms bend into a bowl against the current | meadows of 3 to 6 a square metre on about a quarter of the floor: tens of thousands |
| `horncoral` | horn corals | 0.05 to 0.13 | a ringed horn of stone lying loose on the mud, a ring of tentacles in its opening | the tentacles move | about 3,000, in loose fields |
| `bryozoan` | moss animals | twigs 0.05 to 0.15, mounds up to 0.3 | stony twigs, branching, and low domes, covered with pinprick pores | none | every ledge covered edge to edge |
| `brachiopod` | lamp shells | 0.02 to 0.05 | ribbed shells of two unequal halves, a little open | none | tens of thousands, in pavements |
| `graptolite` | graptolites | 0.02 to 0.1 | thin dark blades with a saw edge, hanging in the water | drift | 80 swarms of 80 to 220 in the open water |
| `astraspis` | the armoured fish Astraspis | about 0.2 | like a large tadpole: head and chest in a shield of small bony plates, a row of gill openings on each side, a scaly tail, no other fins, no jaws | swims with its whole tail, a little clumsily, near the floor | 30 groups of 15 to 45 |

Numbers raised on 2026-11-24 and again on 2026-11-25, with a smaller sea (Mario: far too few, the map too large).
Details and the motion of the cephalopods: `ordovician-life.md`.

The heads of the two cephalopods changed the same day: ten arms and no hood (stage E of that file). Where the
build notes below say otherwise (hood, 30 to 40 tentacles), that file wins.

Order of work, easiest first: what stands or lies (`brachiopod`, `bryozoan`, `horncoral`, `crinoid`), then the
swimmers (`graptolite`, `orthocones`, `astraspis`, `endoceras`), then the walkers (`isotelus`, `megalograptus`).

What the engine already offers: scattering in masses and standing kinds that sway, the swarms and walkers of
`cambrian`, a long animal that follows its path with its whole body (the plesiosaur of `today`). Endoceras is a
stiff body with a soft head: a rigid cone on a path, arms that move.

## The look: rules from the Cambrian and the Devonian

Mario accepted the rebuilt trilobite of the Cambrian ("exactly like this") and rejected the fish of the Devonian as
plastic and as cartoon. What made the difference:

- **L1. Form at three sizes.** The outline; forms of a few percent of the body in the mesh (ribs, rings, steps
  between segments, lobes, spines); fine relief in the shader. Outline plus painted lines looks like a toy.
- **L2. Contrast belongs to light and shadow.** Detail of middle size is quiet. No noise that draws closed cells,
  except where the fossil has plates (the head shield of Astraspis), and there as relief with soft grooves.
- **L3. No drawn dark line of one width.** A joint, a suture, a growth line is a step or a groove, shaded by the light.
- **L4. Nothing shines under water.** Shell, armour and skin are matte, with a faint broad sheen at most.
- **L5. Colour only from a source.** Sourced here: Megalograptus (brown and black) and the small orthocones (darker
  bands, upper side only). Everything else gets the plain colour of its material (shell and stone: greys, creams,
  browns), with low saturation, and no card says anything about it. Each kind still has its own colour family.
- **L6. Eyes are small and dark,** never the brightest thing on an animal.
- **L7. Colour follows relief:** hollows darker and dirtier, edges and tops worn paler.
- **L8. Individuals differ** in size, tone, wear and pose, from their seed.
- **L9. Motion.** What was soft bends and lags (arms, tentacles, the arms of sea lilies). What was stiff does not
  bend (shells). Nothing repeats exactly.
- **L10. The dead belong on this floor.** Empty shells, broken twigs, shed shields of trilobites: the storm beds and
  the thin cover between the patches are made of them.

## Build notes

Main source for the shapes of the floor kinds: the Digital Atlas of Ordovician Life (https://ordovicianatlas.org),
which shows the fossils of the Cincinnati region kind by kind, with photographs and how to tell them. Read the page
of each genus before modelling it. Do not copy its pictures into the repo: measure on them.

| Id | Start from | Vertices each (guide) |
|---|---|---|
| `brachiopod`, `bryozoan`, `horncoral` | a standing kind of `cambrian` (`standing.js`) | 300 to 1,500 |
| `crinoid` | the sea lily in `meshDriftwood` (`devonian/driftwood.js`): stem of discs, cup, arms | 1,500 |
| `graptolite` | the swarm of `MARRELLA` (`cambrian`) | 200 |
| `orthocones`, `endoceras` | new, after Nautilus (see below); nothing of `meshGoniatite` | 5,000 and 30,000 |
| `astraspis` | `meshMetaspriggina` (`cambrian`) for a small fish that swims with its tail | 4,000 |
| `isotelus` | `meshTrilo`, `S_TRILO`, `TRILO_HEAP`, `TRILO_SHADOW` (`cambrian/walkers.js`) | 6,000 |
| `megalograptus` | the walker code of `TRILO`; legs as in `meshHallu` | 12,000 |

- **`brachiopod`.** Two shapes, both named for this region: Rafinesquina (flat, wide) and Platystrophia (ribbed).
  Shapes and sizes from the Atlas (not verified here). Many lie dead: single halves, hollow side up or down (L10).
- **`bryozoan`.** Twigs and low domes. Genera, sizes and the pattern of pores from the Atlas (not verified here).
- **`horncoral`.** Grewingkia canadensis, the one large horn coral of this sea: a straight or slightly curved horn up
  to 13 cm with strong rings around it, more than a hundred thin walls in its cup. It lies loose on the mud, not
  cemented. Its soft parts are not known: a low ring of plain short tentacles, estimate.
- **`crinoid`.** Genera and heights from the Atlas (not verified here; if the sea lilies of this region were smaller
  than 0.3 to 1 m, the source wins, and the card with it).
- **`graptolite`.** Graptolites are in these rocks, some preserved in the round. Shape and size of the kind found
  here from the Atlas (not verified here).
- **`orthocones`, `endoceras`: the living model is Nautilus** (rebuilt 2026-11-24; the first version was a cone with a
  smaller cone for a head and boxes for arms). Nautilus is the only living cephalopod with an outer shell. The soft
  parts of these fossils are not known: everything about them here is an estimate after Nautilus, and no card says
  more. What to take from it:
  - **The shell is a tube with a wall.** Its opening has a rim with a thickness, and one looks into a dark inside.
    Fine growth lines run around the shell, parallel to the rim, as relief.
  - **The animal sits in the last chamber** and comes out of the opening. It fills the opening; there is no head
    stuck onto the shell. Where body and shell meet, the soft body bulges a little over the rim.
  - **A hood**: a tough, leathery, wrinkled flap over the top of the head, shaped to close the opening when the
    animal draws back.
  - **Many tentacles, not five.** Nautilus has about 90, slim, without suckers, in two rings around the mouth, and
    can draw them in. Model 30 to 40: round, tapering, each from a thicker sheath, of different lengths, bent and
    trailing, no two alike. Never straight rods, never evenly spaced.
  - **The eye** is a round swelling on each side under the hood with a small dark hole in its middle (Nautilus has
    no lens). Form, not a painted dot.
  - **The funnel**: a soft tube under the head. It pulses when the animal swims: each pulse pushes the shell
    backward, tip first, and the tentacles trail.
  - Colour of the soft parts: not known. Plain pale brown, the hood darker (estimate).
  - Vertices: about 5,000 for an orthocone, about 30,000 for Endoceras.
  - **`orthocones`.** Treptoceras: a straight cone, a little wider than high, smooth outside. Darker bands on a pale
    shell, on the upper side only; the underside plain and pale. It swims level, the banded side up.
  - **`endoceras`.** A straight cone 5.7 m long with low rings around it (Endoceras has them; Cameroceras, the giant
    found in the Cincinnati rocks, is smooth). 0.3 thick at the opening is an estimate.
- **`astraspis`.** 20 cm. Oval in cross-section. Head and chest under a shield of many-sided little plates wider
  than 2 mm, each with star-shaped or round bumps; the tail with scales under 1 mm. Large eyes at the sides; behind
  each a line of eight open gill holes slanting down and back. No fins but the tail. Read the abstract of Sansom and
  others 1997 for the tail before modelling it.
- **`isotelus`.** Isotelus maximus, 40 cm. Smooth: head and tail shields are half-circles of about the same size,
  with a spine at each back corner of the head. Figures: Ohio Geological Survey, GeoFacts 6. Number of segments and
  the eyes from there (not verified here). Shed shields lie about (L10).
- **`megalograptus`.** Megalograptus ohioensis, up to 78 cm. The labelled drawing in Ohio Geological Survey,
  GeoFacts 34 (fig. 2) names every part: head, pincers, the long spiny third pair of arms, two pairs of walking legs,
  the swimming paddles, the tail spike with a rounded blade on each side that could grasp. Brown and black, covered
  in scales; this species the darkest.

## Texts

For the zoo file of this era. Put the source links next to each entry as comments once the facts are checked (see
`era-common.md`, "Facts and sources").

```js
// Zoo texts of the Ordovician. name, sub and text are shown as they are, facts are [label, value] rows.
const ZOO = {
  endoceras: {
    name: 'Endoceras', sub: 'Endoceras giganteum · giant relative of squid and nautilus', size: 5.7,
    facts: [['Shell', 'up to about 5.7 m long'], ['Longest piece found', '3 m'], ['Hunted', 'probably close to the sea floor']],
    text: 'The largest animal of its time, and perhaps the first giant of all: a relative of the squid in a straight shell longer than a car. The longest piece ever found measures 3 m, and it is only part of a shell. Its owner probably hunted trilobites and other animals of the sea floor.',
  },
  orthocones: {
    name: 'Straight-shelled cephalopods', sub: 'small relatives of the giant', size: 0.4,
    facts: [['Shell', '15 to 40 cm long'], ['Moved by', 'squirting water'], ['Living relative', 'the nautilus']],
    text: 'The shell is a row of chambers filled with gas. They carry the animal like a diving tank, and it lives only in the last and widest one. To move, it squirts water out of a tube. Squid still swim like that. The nautilus is the last animal that still carries such a shell.',
  },
  isotelus: {
    name: 'Trilobite', sub: 'Isotelus · a giant among trilobites', size: 0.4,
    facts: [['Length', 'up to about 40 cm'], ['Largest relative', 'over 70 cm, found in Canada'], ['Shell', 'shed again and again as it grew']],
    text: 'Most trilobites would fit in your hand. This one is as long as your forearm, and a relative from the same time reached more than 70 cm, the largest complete trilobite ever found. It ploughed through the mud for food. The ice age at the end of the Ordovician wiped out most of its kind.',
  },
  megalograptus: {
    name: 'Sea scorpion', sub: 'Megalograptus · an early sea scorpion', size: 0.78,
    facts: [['Length', 'up to 78 cm'], ['Colour', 'brown and black, read from the fossils'], ['Tail', 'a spike between two grasping blades']],
    text: 'Sea scorpions are new in this sea. They are not true scorpions, but relatives of them, and of spiders and horseshoe crabs. This one swept the floor with two long, spiny arms, like a rake. Droppings found with it hold pieces of trilobites, and of its own kind. Later relatives will become the largest arthropods that ever lived.',
  },
  crinoid: {
    name: 'Sea lilies', sub: 'animals, not flowers', size: 1,
    facts: [['Height', '30 cm to 1 m'], ['Relatives', 'starfish and sea urchins'], ['Food', 'caught from the passing water']],
    text: 'A stalk, a cup and a crown of feathery arms: it looks like a flower and is a relative of the starfish. The arms spread into a bowl against the current and pass food down to the mouth in the middle. Whole meadows of them stood in this sea. A few hundred kinds still live in the oceans today.',
  },
  horncoral: {
    name: 'Horn coral', sub: 'a single polyp in a horn of stone', size: 0.13,
    facts: [['Length', 'up to 13 cm'], ['Lives', 'alone, not in a colony'], ['Its group', 'died out 252 million years ago']],
    text: 'One animal like a small sea anemone sits in the open end of each horn and builds it longer as it grows. The fine lines on the outside are growth lines, something like the rings of a tree. These corals are not the ancestors of the corals of today: their whole group has died out.',
  },
  bryozoan: {
    name: 'Moss animals', sub: 'colonies of thousands', size: 0.15,
    facts: [['Twigs', '5 to 15 cm'], ['Each animal', 'smaller than a millimetre'], ['First appear', 'in the Ordovician']],
    text: 'Every pinprick in these stony twigs is the home of one tiny animal with a crown of tentacles. Thousands of them build a colony together. Moss animals are the one large group of animals that does not go back to the Cambrian: they appear here, in the Ordovician, and are still common.',
  },
  brachiopod: {
    name: 'Lamp shells', sub: 'brachiopods · not clams', size: 0.05,
    facts: [['Width', '2 to 5 cm'], ['Halves of the shell', 'top and bottom, not left and right'], ['Today', 'rare']],
    text: 'They look like clams and are not related to them. A clam has a left and a right shell, a lamp shell an upper and a lower one, and inside it a coiled, feathery arm that filters the water. In this sea they pave the floor. Today clams have taken their place almost everywhere.',
  },
  graptolite: {
    name: 'Graptolites', sub: 'drifting colonies', size: 0.1,
    facts: [['Length', '2 to 10 cm'], ['Each tooth of the saw', 'the home of one tiny animal'], ['Used for', 'telling the age of rocks']],
    text: 'Each blade is a colony: every tooth of the saw is a little cup with one animal in it. They drifted through all the oceans and changed their shapes quickly over time. So a geologist who finds one can tell how old the rock is, almost anywhere in the world.',
  },
  astraspis: {
    name: 'Astraspis', sub: 'Astraspis desiderata · an early fish in armour', size: 0.2,
    facts: [['Length', 'about 20 cm'], ['Armour', 'small plates of bone'], ['Jaws', 'none']],
    text: 'One of the first animals with bone. It carries it on the outside, as a shield of small plates over head and chest. It has no jaws and no fins except its tail, so it could neither bite nor steer well. All the same, this is your side of the family: an early fish.',
  },
};
```

The sentences for the title menu:

> **Ordovician · 487 to 443 million years ago.** The sea rises higher than ever before and covers most of the
> continents. Life in it multiplies: sea lilies, corals, moss animals, and hunters in shells as long as a car.
> The land is still almost bare. You dive about 450 million years back, to the sea over North America. This world
> ends in an ice age that wipes out most kinds of animals.

## Sources

Quotations are word for word from the page named. Everything else in this brief is Claude's wording or conclusion.

**Checked on 2026-11-16:**

- **Dates.** International Chronostratigraphic Chart v2024/12
  (https://stratigraphy.org/ICSchart/ChronostratChart2024-12.pdf): 486.85 and 443.1.
- `endoceras`: Wikipedia, "Endoceras" (https://en.wikipedia.org/wiki/Endoceras): a specimen of Endoceras giganteum
  in the Museum of Comparative Zoology measures 3 m as preserved, a 2015 estimate puts the complete shell at about
  5.73 m; a report of a 9.1 m shell was never confirmed. Wikipedia, "Endocerida"
  (https://en.wikipedia.org/wiki/Endocerida): possibly the top hunters of the Ordovician, close to the sea floor.

**Checked on 2026-11-23:**

- **Place and time.** Britannica, "Cincinnatian Series" (https://www.britannica.com/science/Cincinnatian-Series):
  "deposited between approximately 451 and 443 million years ago". Miami University, Limper Geology Museum,
  "Geological history of SW Ohio"
  (https://miamioh.edu/cas/centers-institutes/limper-geology-museum/geological-history-sw-ohio.html): "Bryozoans and
  brachiopods, nearly equal in abundance, form about 60%" of the grains of the limestone; sea lilies about 20 %,
  trilobites nearly 10 %.
- **Many more kinds.** Sepkoski 1995, "Global diversification of genera during the Ordovician radiations"
  (Cambridge Core, abstract): "more than tripled over the course of the Ordovician radiations".
- **Sea level.** Scientific Reports, https://link.springer.com/10.1038/srep18884: "a Phanerozoic sea level maximum
  in the Late Ordovician" (the authors write "potentially").
- **The end.** Britannica, "Ordovician-Silurian extinction": "eliminated an estimated 85 percent of all Ordovician
  species"; second in severity after the end of the Permian.
- **Nautilus** (the living model of the cephalopods): Animal Diversity Web, "Nautilus pompilius"
  (https://animaldiversity.org/accounts/Nautilus_pompilius): "about 90 small suckerless tentacles" below a tough
  hood; a funnel beneath; eyes without lens. Aquarium of the Pacific, "Chambered Nautilus": the hood closes the
  opening; it swims by blowing water out of a siphon under the tentacles.
- `megalograptus`: Wikipedia, "Megalograptus" (https://en.wikipedia.org/wiki/Megalograptus), section "Size":
  "ranged in length from 49 to 78 centimeters". Same article: colour inferred as brown and black, this species the
  darkest; possible fossil droppings with pieces of trilobites and of its own kind; blades under the tail spike that
  could grasp. Ohio Geological Survey, GeoFacts 34 (Peter 2021,
  https://dam.assets.ohio.gov/image/upload/ohiodnr.gov/documents/geology/GF34_Peter_2021.pdf): labelled drawing;
  "coprolite also contained remains of the large trilobite Isotelus".
- `isotelus`: Wikimedia Commons, file "Isotelus maximus fossil trilobite (Upper Ordovician; southwestern Ohio, USA)
  1", description: "up to 15 inches for complete Ohio specimens"; Isotelus maximus has spines at the corners of the
  head at every size and half-round head and tail. Cincinnati Museum Center,
  https://www.cincymuseum.org/2019/03/08/isotelus-ohio-states-fossil/: "an Isotelus specimen from the Ordovician of
  Manitoba that measures 70 cm". (Wikipedia, "Isotelus", gives over 70 cm; a dealer's page gives 720 mm. The card
  says "over 70 cm".) Figures: GeoFacts 6
  (https://dam.assets.ohio.gov/image/upload/ohiodnr.gov/documents/geology/GF6_Shrake_2023.pdf).
- `astraspis`: Wikipedia, "Astraspis" (https://en.wikipedia.org/wiki/Astraspis), section "Description": "a series
  of eight gill openings on each side"; about 200 mm; large eyes at the sides; oval in cross-section; tail scales
  under 1 mm, plates of the forebody over 2 mm. Sansom and others 1997, Palaeontology 40 (3), abstract
  (https://palass.org/publications/palaeontology-journal/archive/40/3/article_pp625-643): "dorsal headshield formed
  from polygonal tesserae", with star-shaped or smooth bumps; Harding Sandstone, Colorado.
- `orthocones`: Frey, Journal of Paleontology, "Paleoecology of a well-preserved nautiloid assemblage from a Late
  Ordovician shale unit, southwestern Ohio" (abstract): "dominated by three species of the longiconic orthocerid
  Treptoceras", with fewer of the endocerid Cameroceras. Digital Atlas of Ordovician Life, "Treptoceras"
  (https://ordovicianatlas.org/atlas/mollusca/cephalopoda/orthocerida/proteoceratidae/treptoceras): "darker markings
  on the lighter ground of the shell". Estonian Journal of Earth Sciences 2015, 64 (1), 74 to 79
  (https://kirj.ee/public/Estonian_Journal_of_Earth_Sciences/2015/issue_1/earth-2015-1-74-79.pdf): "in Ordovician
  pseudorthocerids colour bands are restricted dorsally".
- `endoceras`, the place: Wikipedia, "Cameroceras" (https://en.wikipedia.org/wiki/Cameroceras): "Cameroceras lacks
  annulations". Conclusion: the giant of the Cincinnati rocks is Cameroceras; Endoceras at 5.7 m is a guest in this
  world, like Astraspis. No size was found for the Cameroceras of this region.
- `horncoral`: Digital Atlas of Ordovician Life, "Grewingkia canadensis"
  (https://www.ordovicianatlas.org/atlas/cnidaria/anthozoa/rugosa/streptelasmatidae/grewingkia/grewingkia-canadensis/):
  "reaching lengths in excess of 13cm"; straight or slightly curved, strongly ringed, a hundred or more walls.
- `graptolite`: Mitchell 1975, Ohio State University (https://core.ac.uk/download/159555958.pdf): "Three
  dimensionally preserved graptolites occur abundantly in some of the nodules".

**Not checked yet** (from Claude's knowledge; check before the text ships, and put the source next to the entry):

- The first land plants. That Endoceras lived in this region (see above: it probably did not).
- `orthocones`: sizes, gas chambers, the nautilus as the last with such a shell.
- `isotelus`: that it ploughed through the mud; the number of segments; the eyes.
- `megalograptus`: that later relatives were the largest arthropods.
- `crinoid`: genera of this region, heights, relatives, the number of living kinds.
- `horncoral`: growth lines as on a tree, extinction 252 million years ago.
- `bryozoan`: genera, sizes; first appearance in the Ordovician (a Cambrian find has been claimed and disputed).
- `brachiopod`: sizes and shapes of Rafinesquina and Platystrophia; all facts of the card.
- `graptolite`: which kind, its size; all facts of the card.
- `astraspis`: its age in millions of years; the shape of the tail.

## Zoo reach to start with

| Id | Reach in metres |
|---|---|
| `endoceras` | 15 |
| `megalograptus`, `crinoid` | 5 |
| `orthocones`, `astraspis`, `graptolite` | 6 from the middle of the group |
| `isotelus` | 3 |
| `horncoral`, `bryozoan`, `brachiopod` | 2 |

## Only in this world

- **The giant needs a stage.** One viewpoint looks along the floor so that an Endoceras passes through the picture
  from side to side, with sea lilies in front of it for scale.
- **Crowded, not cluttered.** The floor is full, but the kinds keep to their patches: pavements, meadows, thickets.
  Leave bare mud between them.
- **A stiff shell.** Endoceras and its small relatives do not bend. Turn them slowly, on wide curves.

## Later, not in this task

- The ice age at the end: the same floor, fallen dry or dark and cold.
- More of this sea: starfish, sea snails, the trilobite Flexicalymene rolled into a ball.
