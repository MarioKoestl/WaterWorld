# Brief: the Cretaceous world

The chalk sea. The player dives about 85 million years back, into a warm sea that cuts North America in two. Its
water is pale with the shells of tiny algae that will become chalk. Sea lizards 12 m long hunt here, with
long-necked plesiosaurs, giant turtles, fish with fangs, birds that have teeth and flying reptiles overhead.

- **Asked for by:** Mario, 2026-11-16.
- **Needs:** `eras.md` (done). `scale.md` for the size picture on the cards; this world does not need the close
  camera.
- **Result:** `cretaceous.html`, chosen from the timeline in the title menu.

Read `CLAUDE.md`, then `era-common.md`: stages, rules, acceptance criteria, verification and how to treat facts are
there. This brief says what this world is.

## How to work (version 2 of this brief, 2026-11-23)

Written for Claude Code on Opus 4.6. With `CLAUDE.md` and `era-common.md` this brief is all you need for this era.
Do not read the briefs of the Devonian or of the Dunkleosteus. Since version 1 some facts were checked (see
"Sources"), and "The look" and "Build notes" are new.

1. **Stages** as in `era-common.md`, five of them. Each ends with a hand-over, and then you stop. Never start a stage
   before Mario has accepted the one before.
2. **Start** from a copy of `source/eras/today/` (the plesiosaur, the schools, the leaves and the kelp are there),
   then take out everything of today.
3. **One kind at a time,** in the order given under "The ten exhibits". For each kind:
   a. Notes in `docs/research/cretaceous/<id>.md` from the sources named in "Build notes": what they print, what you
      measured on which figure, what stays an estimate.
   b. The mesh, with its figures in lengths of the body in a comment.
   c. `node tools/turntable.mjs cretaceous <id> <name>` (look at `node tools/chrome.mjs status` first).
   d. The visual critic on the turntable, with the list of "The look" as its questions.
   e. Correct, twice at most. Then the next kind.
4. **A source that cannot be opened:** say so in the notes and mark the figure as estimate. Never invent a
   measurement, a quotation or a colour.
5. **Budget.** Small edits in place. The engine is the only renderer. Hand-overs of 20 lines or fewer: what is in,
   what Mario should open and look at, what is still not verified, one commit message.

## The place

The Cretaceous lasted from 143.1 to 66.0 million years ago. The world shows one moment late in it, about 85 million
years ago, and one place: the Western Interior Sea over what is now Kansas, whose floor became the Smoky Hill Chalk
of the Niobrara Formation. The chalk was laid down between 87 and 82 million years ago. It holds fish, turtles,
sea lizards, flying reptiles and toothed birds, many of them as whole skeletons, some with their last meal inside.

## What is special about the Cretaceous, and where the world shows it

| Special feature | Where the player meets it |
|---|---|
| Chalk: the era is named after it | the pale water, the white floor, the chalk card |
| The warmest climate and the highest seas since animals exist: seas in the middle of continents | the place itself; the menu text |
| Lizards that became sea monsters | Tylosaurus |
| The longest necks | Styxosaurus |
| Fish and sharks as large as the reptiles | Xiphactinus, the shark |
| Birds with teeth, and reptiles in the air | Hesperornis, Pteranodon |
| Clams as wide as a table | the giant clam |
| It ends with a rock from space | the menu text; the card of Tylosaurus |

## Decisions

| Decision | By |
|---|---|
| One real place and time: the chalk sea of Kansas, about 85 million years ago | Claude |
| Tylosaurus at 12 m, the size of the largest skeleton that was collected | Claude |
| What flies is seen from below: on the surface, through it, or diving in | Claude |
| Eleven cards: ten living exhibits and the chalk | Claude |

The decisions marked Claude are defaults. Mario can change them; ask before building something else.

## Atmosphere

The mood to aim for: a bright, milky, pale sea. Everything is soft and light, and out of that brightness come the
largest hunters of the whole journey.

| | World of today | Cretaceous |
|---|---|---|
| Water | clear blue | pale turquoise, milky, almost white towards the light |
| How far one sees | far | about 35 m, with shapes showing as grey shadows beyond that |
| Surface | visible from below, with waves | visible, very bright. Shadows of birds and flying reptiles on it |
| Sunlight | strong, sharp shafts, bright flecks | very bright and spread out. Broad soft shafts, no sharp flecks |
| Drifting particles | a few | a fine white dust everywhere, sinking very slowly |
| Ground | rock and sand, strong colours | flat, soft, white to pale grey ooze. The only hard things on it are giant clam shells |
| Sound | rumble, surface wash, chimes, whale calls | open-water hush, surface wash, now and then a splash from above. No whale calls |

## Sea floor

- **The chalk floor.** A flat plain of white ooze about 45 m under the surface, with very low swells. No rock.
- **Clam fields.** Loose fields of giant clams lying flat on the ooze, some alive, some empty shells overgrown with
  oysters.
- **No wall.** The world runs out into pale haze on all sides.
- **Above.** The surface is part of this world: birds swim on it, flying reptiles skim it.
- **Not here:** reefs, kelp, rock, wrecks.

## The exhibits

Sizes in metres, one unit is one metre.

| Id | What | Size | Shape | Movement | Where and how many |
|---|---|---|---|---|---|
| `tylosaurus` | the mosasaur Tylosaurus | 12 | a giant lizard built for the sea: a long head of almost 2 m with a blunt, bony tip to the snout, a long body, four flippers, a long tail with a fin at its end | swims with slow, strong waves of the tail on wide paths | 2 |
| `styxosaurus` | the long-necked plesiosaur Styxosaurus | about 10.5, more than half of it neck | a small head with long teeth on a very long neck, a broad body, four long flippers, a short tail | flies slowly with its four flippers, the neck held almost straight | 2 |
| `xiphactinus` | the fish Xiphactinus | 4, one of 5 | like a giant tarpon: a long silver body, an upturned mouth with long fangs, a deeply forked tail | fast, alone or in twos | 5 |
| `shark` | the shark Cretoxyrhina | about 6 | built like a great white: a heavy spindle-shaped body, a pointed snout, a half-moon tail | cruises steadily, alone | 2 |
| `protostega` | the giant turtle Protostega | about 2.5 | a sea turtle with a leathery shell that shows the ribs beneath, a large head with a hooked beak, long front flippers | rows with its front flippers, slowly | 4 |
| `hesperornis` | the diving bird Hesperornis | 1.5 | a long-bodied bird like a huge grebe, with tiny wings, strong legs set far back with lobed toes, and a long beak with small teeth | swims on the surface, dives and chases fish under water with its feet | about 12, in two groups |
| `pteranodon` | the flying reptile Pteranodon | wingspan about 6 | seen from below: a long toothless beak, a long crest at the back of the head, narrow wings | glides above the surface as a shadow, floats on it, dips its beak in | 5 |
| `platyceramus` | the giant clam | up to 1.5 across, a few of 3 | a thin, flat, nearly round shell with wide ripples, lying on the ooze, with oysters grown on top | none; small fish shelter inside the open ones | about 60 |
| `uintacrinus` | the floating sea lily Uintacrinus | body 0.06, arms up to 1 | a ball-shaped body without a stalk, with ten long, thin, feathery arms | hang in the water in loose rafts, arms spread | 3 rafts of about 150 |
| `enchodus` | the fanged fish Enchodus | 0.3 to 0.6 | a slim silver fish with two long fangs at the front of the mouth | schools | 8 schools of about 150 |
| `chalk` | the chalk | no `size` | the pale water and the white floor | | a backdrop |

Order of work, easiest first: floor and clams, the rafts and schools, then `protostega`, `xiphactinus`, `shark`,
then the animals of the surface (`hesperornis`, `pteranodon`), then `styxosaurus` and `tylosaurus`.

What the engine already offers: the plesiosaur of `today` (or of `jurassic`, if it is built) as the start for
Styxosaurus, with a much longer neck. A long animal that follows its path with its whole body for Tylosaurus. The
manta of `today` for the turtle's flippers. New: animals at and above the surface. They are drawn in the world
like any other, and the surface is seen in front of those above it. Check with the engine how the surface is drawn
before planning Pteranodon, and ask Mario if it cannot be done without a large change.

## The look: rules from the Cambrian and the Devonian

Mario accepted the rebuilt trilobite of the Cambrian ("exactly like this") and rejected the fish of the Devonian as
plastic and as cartoon. What made the difference:

- **L1. Form at three sizes.** The outline; forms of a few percent of the body in the mesh (ribs, steps between
  segments, lobes, spines); fine relief in the shader. Outline plus painted lines looks like a toy.
- **L2. Contrast belongs to light and shadow.** Detail of middle size is quiet. No noise that draws closed cells,
  except where the fossil has them: the small scales of the mosasaur, the scales of the fish, the plates of the
  turtle. There they are relief, not outlines.
- **L3. No drawn dark line of one width.** A joint, a suture, a growth line is a step or a groove, shaded by the
  light.
- **L4. Nothing shines under water.** Shell, armour, stone and skin are matte, with a faint broad sheen at most.
- **L5. Colour only from a source.** Colour is sourced for the mosasaur (dark; pigment found in its scales) and, from
  earlier relatives, for smooth dark-above, pale-below skin. The fish are pale silver-grey with a soft sheen on the
  flank, never a mirror. Everything else plain. Low saturation, each kind its own colour family, and no card says
  anything about colour.
- **L6. Eyes are small and dark,** never the brightest thing on an animal.
- **L7. Colour follows relief:** hollows darker and dirtier, edges and tops worn paler.
- **L8. Individuals differ** in size, tone, wear and pose, from their seed.
- **L9. Motion.** What was soft bends and lags. What was stiff does not bend. Nothing repeats exactly.
- **L10. The dead belong here.** Giant clam shells, empty and broken, on the white ooze; here and there a backbone.

### Skin of the large animals (why the fish of the Devonian failed)

This world is full of large animals with skin. That is the hardest thing for this engine: the Dunkleosteus of the
Devonian failed on it three times. So:

- **One test animal first.** Stage 3 starts with `tylosaurus` alone. Stop after it and let Mario look. Only when he
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
| `platyceramus` | a standing kind of `cambrian` (`standing.js`) | 800 |
| `uintacrinus` | the sea lily in `meshDriftwood` (`devonian`), without the stalk | 2,000 |
| `enchodus`, `xiphactinus` | `meshKentuckia` (`devonian`) | 2,500 and 15,000 |
| `shark` | `meshCladoselache` (`devonian`), with the build of a great white | 20,000 |
| `styxosaurus` | the plesiosaur of `jurassic` if built, else of `today` | 35,000 |
| `tylosaurus` | the plesiosaur of `today` for path and zoo; `meshCladoselache` for a tail that beats | 40,000 |
| `protostega` | the manta of `today` for the flippers; the shell is new | 15,000 |
| `hesperornis`, `pteranodon` | new | 8,000 |

Main source for shapes: "Oceans of Kansas" by Mike Everhart (https://oceansofkansas.com), with field guides to the
fossils of this chalk (FieldGuide3.html for the reptiles) and photographs of the skeletons. Measure, do not copy.

- **`tylosaurus`** (the test animal). The largest mosasaur of this chalk. Skin: small smooth scales, like a lizard's
  but fine (relief only when the camera is near; from a few metres the skin reads as smooth). Dark, as the pigment in
  mosasaur scales shows; pale below as an assumption. The tail ends in a fin like a shark's turned upside down.
  12 m is not verified here (a popular page gives 45 feet); the skull of one large skeleton is 1.24 m.
- **`styxosaurus`.** Plesiosaurs are rare in this chalk. Skin as in the Jurassic brief: smooth, with small scales
  only at the rear edge of the flippers (from an earlier relative).
- **`protostega`.** In this chalk no Protostega longer than about 2 to 2.5 m is known; the 3.4 m one is from Texas.
  The table and the card now say 2.5.
- **`pteranodon`.** A wingspan of more than 24 feet (7.3 m) is the figure of the State of Kansas; the table's 6 m is
  within it.
- **`xiphactinus`**, **`shark`**, **`hesperornis`**, **`enchodus`**, **`platyceramus`**, **`uintacrinus`.** Shapes and
  sizes from the field guides above: not verified here.

## Texts

For the zoo file of this era. Put the source links next to each entry as comments once the facts are checked (see
`era-common.md`, "Facts and sources").

```js
// Zoo texts of the Cretaceous. name, sub and text are shown as they are, facts are [label, value] rows.
const ZOO = {
  tylosaurus: {
    name: 'Tylosaurus', sub: 'Tylosaurus proriger · a mosasaur, a lizard of the sea', size: 12,
    facts: [['Length', 'about 12 m'], ['Skull', 'almost 2 m'], ['Closest living relatives', 'monitor lizards and snakes']],
    text: 'Not a dinosaur, but a lizard that went to sea and grew as long as a bus. One fossil had the bones of a smaller mosasaur, a diving bird and a fish in its stomach. Mosasaurs ruled the seas for the last 25 million years of this era. The asteroid that ended it ended them too.',
  },
  styxosaurus: {
    name: 'Styxosaurus', sub: 'Styxosaurus snowii · a plesiosaur with an extreme neck', size: 10.5,
    facts: [['Length', 'about 10.5 m'], ['Neck', 'more than half of that'], ['Neck bones', 'more than 60']],
    text: 'More than half of this animal is neck. You have seven neck bones, a giraffe has seven, and this plesiosaur has more than sixty. The neck was not a snake: it could bend only a little. It let the small head reach a school of fish while the big body stayed far behind, out of sight.',
  },
  xiphactinus: {
    name: 'Xiphactinus', sub: 'Xiphactinus audax · the bulldog fish', size: 5,
    facts: [['Length', '4 to 5 m'], ['Teeth', 'long fangs'], ['Famous fossil', 'a fish inside a fish']],
    text: 'A bony fish as long as a car, with fangs. The most famous fossil of this sea is one of them, 4 m long, with a fish of almost 2 m lying whole inside it. It had swallowed its prey head first and died soon after, perhaps because the meal was still struggling.',
  },
  shark: {
    name: 'Ginsu shark', sub: 'Cretoxyrhina mantelli · the great shark of the chalk sea', size: 6,
    facts: [['Length', 'about 6 m'], ['Teeth', 'up to 6 cm, smooth blades'], ['Ate', 'fish, turtles, mosasaurs']],
    text: 'As large as a great white shark and built much the same, tens of millions of years before it. Its teeth are found stuck in the bones of mosasaurs and plesiosaurs. Researchers named it after a brand of kitchen knives, because it sliced its prey into pieces.',
  },
  protostega: {
    name: 'Protostega', sub: 'Protostega gigas · a giant sea turtle', size: 2.5,
    facts: [['Length', 'about 2.5 m here, 3.4 m elsewhere'], ['Shell', 'leathery, with little bone'], ['Laid its eggs', 'on a beach']],
    text: 'One of the largest turtles of all time. To swim well it has given up most of its armour: the shell is a frame of ribs under leathery skin, as in the leatherback turtle of today. That made it light and fast, and easy to bite. Some fossils show the tooth marks of sharks.',
  },
  hesperornis: {
    name: 'Hesperornis', sub: 'Hesperornis regalis · a bird with teeth', size: 1.5,
    facts: [['Length', 'about 1.5 m'], ['Wings', 'tiny, useless for flying'], ['Beak', 'with small, sharp teeth']],
    text: 'A bird as long as a man is tall, and it cannot fly. It hunts fish under water, driven by its large feet, as loons and grebes do today. Look at its beak: it has teeth. Birds descend from small hunting dinosaurs, and many early birds still carried the teeth of their ancestors.',
  },
  pteranodon: {
    name: 'Pteranodon', sub: 'Pteranodon longiceps · a flying reptile', size: 6,
    facts: [['Wingspan', 'about 6 m'], ['Teeth', 'none'], ['Is it a dinosaur?', 'no, and not a bird either']],
    text: 'The shadows on the surface belong to flying reptiles with wings that span 6 m. They are neither birds nor dinosaurs. Their wing is skin, stretched from one very long finger. They soared far out over this sea and took fish from the surface. More than a thousand of them have been found in the chalk.',
  },
  platyceramus: {
    name: 'Giant clam', sub: 'Platyceramus platinus · wider than a table', size: 3,
    facts: [['Width', 'most about 1 m, the largest up to 3 m'], ['Shell', 'very thin'], ['Lodgers', 'oysters outside, fish inside']],
    text: 'The widest clams that ever lived lie flat on the soft ooze, like snowshoes, so as not to sink in. On this floor they are the only hard ground. Oysters cover their shells, and schools of small fish lived inside, between the valves: they are found fossilized in there.',
  },
  uintacrinus: {
    name: 'Uintacrinus', sub: 'Uintacrinus socialis · a sea lily without a stalk', size: 1,
    facts: [['Body', 'a ball about 6 cm wide'], ['Arms', 'ten, up to 1 m long'], ['Lives', 'in crowds']],
    text: 'The sea lilies of the old seas stood on stalks. This one has none. Whether it floated in the water or lay on the soft floor with its long arms spread out is still discussed. Its fossils are found as slabs of chalk on which hundreds of animals lie tangled together.',
  },
  enchodus: {
    name: 'Enchodus', sub: 'Enchodus · the saber-toothed herring', size: 0.6,
    facts: [['Length', '30 to 60 cm'], ['Fangs', 'two, at the front of the mouth'], ['Role here', 'food for almost everyone']],
    text: 'It is no herring, but it filled the same place: a schooling fish in huge numbers, with two fangs that earned it the name saber-toothed herring. Its bones turn up in the stomachs of larger fish, sea birds, plesiosaurs and mosasaurs. Without it, the giants of this sea would starve.',
  },
  chalk: {
    name: 'Chalk', sub: 'the white dust in the water',
    facts: [['Made of', 'shells of single-celled algae'], ['Each shell', 'a few thousandths of a millimetre'], ['The name Cretaceous', 'from creta, Latin for chalk']],
    text: 'The water is pale because algae bloom in it, each a single cell in a coat of tiny lime plates. When they die, the plates sink like snow. On this floor they pile up a few centimetres in a thousand years. In the end the layer is hundreds of metres thick: the white cliffs of Dover are the same stuff.',
  },
};
```

The sentences for the title menu:

> **Cretaceous · 143 to 66 million years ago.** The warmest time since animals exist. The seas stand so high that
> they flood the middle of continents, and tiny algae fill them with chalk. Giant lizards rule the water, flying
> reptiles the air above it. On land the last dinosaurs walk among the first flowers. You dive about 85 million
> years back, into the sea over Kansas. This world ends with a rock from space.

## Sources

**Checked on 2026-11-16:**

- **Dates.** International Chronostratigraphic Chart v2024/12
  (https://stratigraphy.org/ICSchart/ChronostratChart2024-12.pdf): 143.1 and 66.0.
- **Place.** Wikipedia, "Niobrara Formation", read through a mirror
  (https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.4everland.io/wiki/Niobrara_Chalk.html):
  chalk laid down between 87 and 82 million years ago, with the Smoky Hill Chalk Member. Everhart, Transactions of
  the Kansas Academy of Science 2005
  (https://bioone.org/journals/Transactions-of-the-Kansas-Academy-of-Science/volume-108/issue-3/0022-8443(2005)108%5B0149:EROTGT%5D2.0.CO;2/Earliest-record-of-the-genus-span-classgenus-speciesTylosaurus-span-Squamata/10.1660/0022-8443(2005)108%5B0149:EROTGT%5D2.0.CO;2.pdf):
  the Smoky Hill Chalk holds a rich variety of well-preserved fish, turtles, mosasaurs, pteranodons and toothed
  birds.
- `tylosaurus`: Oceans of Kansas, "The Bunker Mosasaur" (https://oceansofkansas.com/ku-bunker.html): at almost 12 m
  one of the largest mosasaurs collected in North America, probably Tylosaurus proriger, with a skull almost 6 feet
  long. Oceans of Kansas, art page (https://oceansofkansas.com/varner.html): a Tylosaurus with the bones of a
  smaller mosasaur, a Hesperornis and a fish as stomach contents. Everhart, "Tylosaurus kansasensis", Netherlands
  Journal of Geosciences 2005
  (https://core-prod.cambridgecore.org/core/services/aop-cambridge-core/content/view/EDBDFC14E3547C2F74B51E9866D521BE/S0016774600021016a.pdf/tylosaurus-kansasensis-a-new-species-of-tylosaurine-squamata-mosasauridae-from-the-niobrara-chalk-of-western-kansas-usa.pdf):
  mosasaurs are sea lizards that flourished worldwide during the last 25 million years of the Cretaceous.
- `xiphactinus`, `hesperornis`, `protostega`, `styxosaurus`: the same art page of Oceans of Kansas: a Xiphactinus
  of 13 feet (4 m) that swallowed a Gillicus of 6 feet (1.8 m), the "fish within a fish"; Hesperornis regalis five
  feet (1.5 m) long; the giant turtle Protostega gigas; the elasmosaur Styxosaurus snowii in this sea.
- `enchodus`: Pteros, "Niobrara Formation" (https://pteros.com/environments/niobrara-formation): saber-toothed
  herrings and Xiphactinus, the bulldog fish, in this sea. The same page gives 15 m for Tylosaurus; the brief uses
  the measured skeleton.

**Checked on 2026-11-23** (quotations are word for word from the page named):

- `tylosaurus`: Oceans of Kansas, "Tylosaurus proriger" (https://oceansofkansas.com/page10.html): "The skull is 49
  inches long"; tylosaurs are the largest of the three kinds of mosasaur common in the chalk. FossilGuy, mosasaur
  gallery (https://www.fossilguy.com/gallery/vert/reptile/mosasaur/): skin impressions show "smooth scales rather
  than the rough, crocodile-like skin"; pigment bodies in fossil scales point to a dark animal; a tail fin like a
  shark's.
- `protostega`: Oceans of Kansas, field guide part 3 (https://oceansofkansas.com/FieldGuide3.html): "the largest
  Protostega is a 3.4m beast in the Dallas Museum"; nothing from this chalk over about 2 to 2.5 m.
- `pteranodon`: Kansas Historical Society, state fossils (https://www.kansashistory.gov/kansapedia/state-fossils/18626):
  "a wingspread of more than 24 feet".
- `styxosaurus`: Oceans of Kansas, Dan Varner page (https://oceansofkansas.com/varner.html): plesiosaurs "were rare
  during the deposition of the Smoky Hill Chalk".

**Not checked yet** (from Claude's knowledge, check before the text ships; what is listed as checked above is no
longer open):

- `tylosaurus`: relatives; the shape of the tail fin.
- `styxosaurus`: 10.5 m, the share of the neck, more than 60 neck bones, how far it could bend.
- `xiphactinus`: the largest at 5 m; swallowed head first.
- `shark`: Cretoxyrhina in this chalk, 6 m, tooth size, bite marks, the name.
- `protostega`: 3 m, the shell, bite marks.
- `hesperornis`: flightless, foot-driven diving, teeth.
- `pteranodon`: wingspan (males about 6 m, the largest more), toothless, the wing, feeding, "more than a thousand"
  specimens.
- `platyceramus`: sizes, fish and oysters living on and in it.
- `uintacrinus`: sizes, the debate about how it lived, the slabs.
- `enchodus`: sizes, found in stomachs.
- `chalk`: coccoliths, the rate of settling, the name, Dover. Also "the warmest time" and "highest seas" of the menu
  text, the first flowers, and the asteroid 66 million years ago.

## Zoo reach to start with

| Id | Reach in metres |
|---|---|
| `tylosaurus`, `styxosaurus` | 20 |
| `shark`, `xiphactinus` | 12 |
| `protostega`, `pteranodon` | 8 |
| `hesperornis` | 6 |
| `enchodus`, `uintacrinus` | 6 from the middle of the group |
| `platyceramus` | 4 |
| `chalk` | a backdrop, named when nothing else is looked at |

## Only in this world

- **Giants out of the haze.** With 35 m of view a 12 m animal fills the picture when it is seen at all. Let the
  paths of Tylosaurus and Styxosaurus pass within 15 m of at least two viewpoints.
- **The surface is a stage.** One viewpoint lies 3 m under the surface and looks up at Hesperornis and at the
  shadows of Pteranodon.
- **Scale on a bare floor.** The clams are the yardstick: a 3 m clam with a Protostega passing above it.
- **Nobody attacks the player.** The hunters pass. They do not turn towards the camera.

## Later, not in this task

- A mosasaur taking prey.
- The reefs of this era, built by clams (rudists), in a tropical sea.
- The day of the impact.
