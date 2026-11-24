# Brief: the Ediacaran world

The first large animals. The player dives about 555 million years back, to a shallow sandy sea floor in what is now
South Australia. It is covered by a carpet of microbes, and on that carpet lie and stand soft, quilted bodies unlike
anything alive today. Nothing hunts, nothing hides, and nothing swims.

- **Asked for by:** Mario, 2026-11-16. He decided on 2026-11-15 that the Ediacaran gets an entry of its own.
- **Needs:** `eras.md` (done), and the row for the Ediacaran in `source/eras.mjs` (see `era-common.md`, "Before the
  first of these worlds is started": check whether it is there, add it if not). `scale.md` for the size picture and
  for the close camera, which this world asks for.
- **Result:** `ediacaran.html`, chosen from the timeline in the title menu.

Read `CLAUDE.md`, then `era-common.md`: stages, rules, acceptance criteria, verification and how to treat facts are
there. This brief says what this world is.

## How to work (version 2 of this brief, 2026-11-23)

Written for Claude Code on Opus 4.6. With `CLAUDE.md` and `era-common.md` this brief is all you need for this era.
Do not read the briefs of the Devonian or of the Dunkleosteus. Since version 1 some facts were checked (see
"Sources"), and "The look" and "Build notes" are new.

1. **Stages** as in `era-common.md`, five of them. Each ends with a hand-over, and then you stop. Never start a stage
   before Mario has accepted the one before.
2. **Start** from a copy of `source/eras/cambrian/` (floor, standing kinds and scattering are there), then take out
   everything Cambrian.
3. **One kind at a time,** in the order given under "The ten exhibits". For each kind:
   a. Notes in `docs/research/ediacaran/<id>.md` from the sources named in "Build notes": what they print, what you
      measured on which figure, what stays an estimate.
   b. The mesh, with its figures in lengths of the body in a comment.
   c. `node tools/turntable.mjs ediacaran <id> <name>` (look at `node tools/chrome.mjs status` first).
   d. The visual critic on the turntable, with the list of "The look" as its questions.
   e. Correct, twice at most. Then the next kind.
4. **A source that cannot be opened:** say so in the notes and mark the figure as estimate. Never invent a
   measurement, a quotation or a colour.
5. **Budget.** Small edits in place. The engine is the only renderer. Hand-overs of 20 lines or fewer: what is in,
   what Mario should open and look at, what is still not verified, one commit message.

## The place

The Ediacaran lasted from 635 to 538.8 million years ago. The world shows one moment near its end, about 555 million
years ago, and one place: the sea floor that is today the Ediacara Member of the Rawnsley Quartzite in the Flinders
Ranges of South Australia, at the sites Ediacara and Nilpena. It was a shallow, sandy sea within reach of storm
waves. Storms buried the floor under sand again and again, and the imprints of the soft bodies stayed on the
undersides of the sand beds. All ten exhibits are known from those beds.

## What is special about the Ediacaran, and where the world shows it

| Special feature | Where the player meets it |
|---|---|
| The first large, complex living things, after billions of years of microbes | all ten; the menu text |
| Bodies with no living relatives: quilted, threefold, frond-shaped | Dickinsonia, Tribrachidium, Arborea |
| The first animals that move | Kimberella and its scratch marks, Dickinsonia and its resting marks |
| The first animal with a front, a back and a gut | Ikaria and its tunnels |
| The first hard parts | Coronacollina |
| Perhaps the first sex | Funisia |
| A sea floor sealed by a carpet of microbes, and no animal that digs | the mat |
| No hunters: no eyes, jaws, shells or spines anywhere | the stillness; the menu text |

## Decisions

| Decision | By |
|---|---|
| The Ediacaran is an era of its own | Mario |
| One real place and time: Ediacara and Nilpena in South Australia, about 555 million years ago | Claude |
| True scale: most of this world is smaller than a hand, a few Dickinsonia are a metre long | follows from `scale.md` |
| Nothing swims. The water is empty on purpose | Claude |
| The list of the ten | Claude |

The decisions marked Claude are defaults. Mario can change them; ask before building something else.

## Atmosphere

The mood to aim for: a warm, shallow, golden-green sea over an endless plain of rippled sand under a dark wrinkled
skin. Gentle and a little unreal, like a garden before anyone has walked in it.

| | World of today | Ediacaran |
|---|---|---|
| Water | clear blue | soft turquoise turning gold-green in the distance, slightly hazy |
| How far one sees | far | about 35 m |
| Surface | visible from below, with waves | visible and near: the floor is 8 to 15 m deep. A slow swell |
| Sunlight | strong, sharp shafts, bright flecks | warm and soft. Wide moving flecks on the sand, faint shafts |
| Drifting particles | a few | a little fine sand close to the ground, lifted by the swell |
| Ground | rock and sand, strong colours | pale ripple sand, almost all of it under a mat in olive, brown and dull red, wrinkled like elephant skin |
| Sound | rumble, surface wash, chimes, whale calls | surface wash and the slow hiss of sand. No calls |

## Sea floor

- **The plain.** Rippled sand in long low waves, a metre or two high, to the haze in every direction. There is no
  wall and no rock.
- **Storm marks.** A few shallow channels and fresh, bare sheets of sand where the last storm tore the mat away.
  Nothing lives on the bare sand yet.
- **Gardens.** The life is gathered in patches a few metres across, one in front of each viewpoint, with open mat
  between them (see `era-common.md`, "Scale and size").
- **Not here:** fish, shells, burrows, seaweed, anything with eyes.

## The ten exhibits

Sizes in metres, one unit is one metre. This world asks for the close camera of `scale.md`.

| Id | What | Size | Shape | Movement | Where and how many |
|---|---|---|---|---|---|
| `dickinsonia` | Dickinsonia | most 0.08 to 0.1 long, a few up to 0.9 | a flat ribbed oval, the ribs running out from a middle line, one end a little broader | glides very slowly; behind it a row of faint ovals where it rested | about 300 small ones, 3 giants |
| `kimberella` | Kimberella | up to 0.15 long | like a slug under a soft oval cap with a frilled edge, a long trunk in front | creeps; the trunk rakes the mat; fans of paired scratches lie in front of it | about 60 |
| `spriggina` | Spriggina | 0.03 to 0.05 long | a narrow body of about 40 segments with a crescent-shaped head | creeps slowly | about 80 |
| `tribrachidium` | Tribrachidium | disc up to 0.05 across, 0.01 high | a low disc with three bent arms spiralling out from its middle | none | about 200 |
| `parvancorina` | Parvancorina | 0.01 to 0.025 long | a small shield with a raised ridge shaped like an anchor | most point the same way, into the current | about 400, in loose groups |
| `arborea` | the frond Arborea | about 0.3 high, holdfast disc 0.05 | a leaf of fine branches on a stalk, held by a disc in the sand | sways | about 150 |
| `funisia` | Funisia | tubes up to 0.3 long, about 0.01 thick | soft upright tubes with shallow rings, like pieces of rope | sway together | dense lawns, more than 1,000 to a square metre, in 6 patches |
| `coronacollina` | Coronacollina | needles up to 0.37 long, cone 0.04 high | a small cone with four straight needles spread out from it | none | about 50 |
| `ikaria` | Ikaria and its tunnels | 0.002 to 0.007 long | a rice grain at the end of a thin winding groove in the mat | creeps very slowly | about 100 grooves |
| `mat` | the living carpet | a few millimetres thick | wrinkled skin on the sand | none | everywhere |

Order of work, easiest first: the mat, then what stands (`tribrachidium`, `coronacollina`, `arborea`, `funisia`),
then what creeps (`dickinsonia`, `kimberella`, `spriggina`, `parvancorina`, `ikaria`).

What the engine already offers: standing kinds that sway, as the tulip animal of `cambrian`; scattering in masses.
New: animals that creep on the ground. `makeWorld` knows the height of the ground while it places things. Keep the
creepers on flat sand, and keep the rule that animation has no state. The marks they leave (resting ovals, scratch
fans, grooves) are part of the ground or flat kinds on it, placed with the animal.

## The look: rules from the Cambrian and the Devonian

Mario accepted the rebuilt trilobite of the Cambrian ("exactly like this") and rejected the fish of the Devonian as
plastic and as cartoon. What made the difference:

- **L1. Form at three sizes.** The outline; forms of a few percent of the body in the mesh (ribs, steps between
  segments, lobes, spines); fine relief in the shader. Outline plus painted lines looks like a toy.
- **L2. Contrast belongs to light and shadow.** Detail of middle size is quiet. No noise that draws closed cells,
  except where the fossil has them: the ribs of Dickinsonia, the segments of Spriggina, the rings of Funisia, the
  branches of the frond: quilted bodies, soft pillows side by side. There they are relief, not outlines.
- **L3. No drawn dark line of one width.** A joint, a suture, a growth line is a step or a groove, shaded by the
  light.
- **L4. Nothing shines under water.** Shell, armour, stone and skin are matte, with a faint broad sheen at most.
- **L5. Colour only from a source.** No colour of anything in this world is known. Soft, pale, a little translucent
  bodies in quiet tones, each kind its own; the mat darker. Low saturation, each kind its own colour family, and no
  card says anything about colour.
- **L6. No eyes, no mouths, no legs.** Nothing here has them. Do not add any to make a body readable.
- **L7. Colour follows relief:** hollows darker and dirtier, edges and tops worn paler.
- **L8. Individuals differ** in size, tone, wear and pose, from their seed.
- **L9. Motion.** What was soft bends and lags. What was stiff does not bend. Nothing repeats exactly.
- **L10. The dead belong here.** Faint resting marks of Dickinsonia on the mat, torn mat with sand showing, flattened
  tubes.

## Build notes

All ten are low, soft things on a mat: start each from a standing kind of `cambrian` (`standing.js`), the creeping
ones from the walker code of `TRILO` without legs. 300 to 3,000 vertices each; Dickinsonia up to 6,000.

- **Soft, not rubber.** These bodies were thin and soft. Edges sag onto the mat, large ones follow its wrinkles.
  Matte, a little light through the thin rim.
- **`funisia`.** Settled: up to about 30 cm long and 12 mm thick (version 1 doubted 30 cm against 30 mm), built of
  ring-shaped units up to 8 mm long. The most common fossil of these beds, in dense lawns.
- **The other nine.** Sizes and shapes as in the table: not verified beyond version 1. The pages of the South
  Australian Museum and Droser and Gehling 2015 (PNAS, open access, with photographs and scale bars) are the place
  to measure.

## Texts

For the zoo file of this era. Put the source links next to each entry as comments once the facts are checked (see
`era-common.md`, "Facts and sources").

```js
// Zoo texts of the Ediacaran. name, sub and text are shown as they are, facts are [label, value] rows.
const ZOO = {
  dickinsonia: {
    name: 'Dickinsonia', sub: 'Dickinsonia costata · one of the first animals', size: 0.9,
    facts: [['Length', 'most 8 to 10 cm, the largest about 1 m'], ['Body', 'flat, a few millimetres thick'], ['Mouth, gut, eyes', 'none found']],
    text: 'A flat, ribbed oval, like a quilted bath mat. It lay on the carpet of microbes, digested the patch under its body and moved on: faint ovals in the rock show where one had rested. Traces of cholesterol in its remains are the best evidence that it was an animal, one of the oldest known.',
  },
  kimberella: {
    name: 'Kimberella', sub: 'Kimberella quadrata · perhaps an early relative of snails', size: 0.15,
    facts: [['Length', 'up to about 15 cm'], ['Moved', 'on a muscular foot'], ['Left behind', 'fans of scratch marks']],
    text: 'One of the first animals that clearly went somewhere under its own power. It crept over the carpet on a broad foot, as a snail does, and scraped food towards itself. Fans of paired scratches mark the places where it fed. It may be an early relative of snails and clams.',
  },
  spriggina: {
    name: 'Spriggina', sub: 'Spriggina floundersi · a puzzle with a head', size: 0.05,
    facts: [['Length', '3 to 5 cm'], ['Body', 'about 40 segments'], ['Named after', 'Reg Sprigg, who found the first fossils here']],
    text: 'A small body of many segments, with a crescent at one end that looks like a head. If it is one, this is among the first animals with a front and a back. Some researchers see an early relative of the trilobites in it, others a creature with no living relatives at all.',
  },
  tribrachidium: {
    name: 'Tribrachidium', sub: 'Tribrachidium heraldicum · built in threes', size: 0.05,
    facts: [['Width', 'a few centimetres'], ['Height', '5 to 10 mm'], ['Arms', 'three, bent into a spiral']],
    text: 'A small disc with three bent arms that spiral out from its middle. No animal alive today is built in threes like this. It sat on the sea floor and did not move. The arms may have slowed the passing water, so that food sank into the hollows between them.',
  },
  parvancorina: {
    name: 'Parvancorina', sub: 'Parvancorina minchami · the little anchor', size: 0.025,
    facts: [['Length', '1 to 2.5 cm'], ['Shape', 'a shield with a ridge like an anchor'], ['Points', 'into the current']],
    text: 'A tiny shield with a raised ridge in the shape of an anchor. On the fossil beds many of them point the same way: they seem to have turned themselves into the current, as a fish does in a stream. That would make it one of the first animals known to sense its surroundings and answer them.',
  },
  arborea: {
    name: 'Arborea', sub: 'Arborea arborea · a frond on a stalk', size: 0.3,
    facts: [['Height', 'about 30 cm'], ['Holds on with', 'a disc buried in the sand'], ['Plant or animal', 'not a plant']],
    text: 'It looks like a fern or a sea pen and is neither. A disc under the sand anchors a stalk, and the stalk carries a leaf of fine branches. Fronds like this are among the oldest large living things in the fossil record. How they fed is still argued about: they had no mouth.',
  },
  funisia: {
    name: 'Funisia', sub: 'Funisia dorothea · the rope animal', size: 0.3,
    facts: [['Length', 'up to 30 cm'], ['Stood', 'more than 1,000 to a square metre'], ['Known for', 'perhaps the oldest signs of sex']],
    text: 'Soft tubes like pieces of rope, standing in dense lawns. On each fossil bed the neighbours are all the same size, as if they had all begun life at the same moment. Corals of today do that when they spawn together. So these tubes may be the oldest evidence of sex among animals.',
  },
  coronacollina: {
    name: 'Coronacollina', sub: 'Coronacollina acula · the first hard parts', size: 0.37,
    facts: [['Needles', 'up to 37 cm long'], ['Body', 'a cone a few centimetres high'], ['Perhaps', 'a relative of sponges']],
    text: 'A small cone with four stiff needles that spread out from it like the legs of a stand. They probably held the body up on the sea floor. They are the oldest hard supporting parts known in any animal: a first step towards skeletons, long before shells and bones.',
  },
  ikaria: {
    name: 'Ikaria', sub: 'Ikaria wariootia · a worm the size of a rice grain', size: 0.007,
    facts: [['Length', '2 to 7 mm'], ['Left behind', 'thin winding tunnels'], ['Described', '2020']],
    text: 'The thin grooves in the carpet are tunnels, and at the end of one lies its maker, no larger than a grain of rice. It had a front and a back, two matching sides and a gut from one end to the other. Nearly every animal you know is built on that plan, including you.',
  },
  mat: {
    name: 'The living carpet', sub: 'a sea floor that nobody digs up', size: 0.005,
    facts: [['Thickness', 'a few millimetres'], ['Made of', 'microbes'], ['Feeds', 'most animals here']],
    text: 'The wrinkled skin on the sand is a mat of microbes, and almost everything here lives on it or from it. Nothing burrows through it yet. When a storm buried this floor under sand, the mat held the imprint of every body like a mask. That is why animals without any hard part became fossils.',
  },
};
```

The sentences for the title menu:

> **Ediacaran · 635 to 539 million years ago.** After the great ice, the first large animals appear: flat, quilted,
> soft, and unlike anything alive today. They lie on a carpet of microbes in a shallow sea. Nothing has eyes, jaws
> or a shell. Nothing hunts and nothing hides. You dive about 555 million years back, to a sea floor in South
> Australia. Most of what you see is smaller than your hand.

## Sources

**Checked on 2026-11-16:**

- **Dates.** International Chronostratigraphic Chart v2024/12
  (https://stratigraphy.org/ICSchart/ChronostratChart2024-12.pdf): 635 and 538.8.
- **Place and who lived there.** Droser and Gehling, PNAS 2015 (https://pmc.ncbi.nlm.nih.gov/articles/PMC4413262):
  common fossils of the Ediacara Member, Rawnsley Quartzite, Flinders Ranges, from the Ediacara Conservation Park
  and the Nilpena site, among them Dickinsonia costata, Funisia dorothea, Parvancorina minchami and Kimberella
  quadrata. A summary of Droser and others on the Nilpena beds
  (https://sciencythoughts.blogspot.com/2019/01/reconstructing-ediacaran-nilpena.html) and SciSpace
  (https://scispace.com/topics/spriggina-20th0tws): Parvancorina, Spriggina, Dickinsonia, Tribrachidium, Kimberella
  and the frond Charniodiscus on the same bed surfaces.
- `dickinsonia`: Ediacara Foundation (https://ediacarafoundation.org/?p=1248): most on the display bed at Nilpena
  are 8 to 10 cm, they can reach a metre; (https://ediacarafoundation.org/ediacaran-fossils/): one of 90 cm, young
  ones under a centimetre. The cholesterol: Wikipedia, "Ediacaran biota" (https://wikipedia.com/wiki/Vendian_biota),
  which says that it points to animals, fungi or red algae. The card says "best evidence", not proof.
- `kimberella` and `tribrachidium`: South Australian Museum on Google Arts & Culture
  (https://artsandculture.google.com/story/4wWx3v3KW85QKQ): Kimberella crawled on a muscular foot and scraped the
  mat, its paired scratch marks show that Ediacaran animals moved, a possible ancestor of snails; Tribrachidium is
  a disc with three bent arms, 5 to 10 mm high, with a radius of up to 5 cm.
- `funisia`: the summary of the Nilpena beds above: densely packed, over 1,000 to a square metre, neighbours on one
  bed of similar size.

**Checked on 2026-11-23** (quotations are word for word from the page named):

- `funisia`: Wikipedia, "Funisia" (https://en.wikipedia.org/wiki/Funisia): "stood about 0.3 m (11.8 in) tall, with
  a diameter of 12 mm"; units up to 8 mm long. A journal article on Funisia at Cambridge Core (core
  reader): Funisia is "the most abundant by an order of magnitude" of the fossils of the Ediacara Member, which is
  about 555 to 550 million years old.

**Not checked yet** (from Claude's knowledge, check before the text ships; what is listed as checked above is no
longer open):

- The age "about 555 million years" for these beds.
- `dickinsonia`: body a few millimetres thick; no mouth or gut found; the resting marks as feeding traces; the
  species of the giants (Dickinsonia rex, up to 1.4 m in the literature as Claude remembers it).
- `kimberella`: 15 cm.
- `spriggina`: 3 to 5 cm, about 40 segments, the two readings, Reg Sprigg and the year of his find (1946).
- `tribrachidium`: its width. The museum page gives a radius of up to 5 cm, the literature as Claude remembers it
  a diameter of up to 4 cm. The table uses 5 cm across. Also how it fed.
- `parvancorina`: size, and that many point into the current.
- `arborea`: height; that it is the frond listed as Charniodiscus in older papers.
- `funisia`: **length.** The first description gives up to 30 cm as Claude remembers it, the summary above says
  30 mm. Check the paper (Droser and Gehling, Science 2008) before building. Also the link to spawning.
- `coronacollina`: needles up to 37 cm, four of them, the oldest hard parts, the link to sponges.
- `ikaria`: 2 to 7 mm, described in 2020, maker of the tunnels named Helminthoidichnites, the body plan.
- `mat`: the mat as the reason for the fossils (the "death mask" idea).

## Zoo reach to start with

| Id | Reach in metres |
|---|---|
| `dickinsonia` | 2, for the giants 4 |
| `kimberella`, `arborea`, `funisia`, `coronacollina` | 2 |
| `spriggina`, `tribrachidium`, `parvancorina`, `ikaria` | 1.5 |
| `mat` | a backdrop, named when nothing else is looked at |

## Only in this world

- **Nothing swims, so the stages of `era-common.md` change:** 1 the place and its light, 2 the mat and what stands,
  3 what creeps and the marks it leaves, 4 the cards, 5 sound and menu text.
- **Flat things on flat ground.** Dickinsonia is a few millimetres thick. It has to be readable from above and from
  the side: give it relief and a rim that catches the light.
- **The giants are the surprise.** Put the three large Dickinsonia where the player comes upon them after the small
  ones.
- **No tricks to make it lively.** No fish, no jellyfish, no drifting plankton clouds. The emptiness of the water is
  what this world is about.

## Later, not in this task

- A storm that buries a garden under sand.
- The deep-water fronds of Mistaken Point in Newfoundland, as a second place.
- More of the Nilpena beds: Obamus, Attenborites, Rugoconites, Yorgia, Phyllozoon.
