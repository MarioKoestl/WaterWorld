# Brief: zoo info box

Turn WaterWorld into an interactive zoo. The world stays exactly as it is. New: the player swims up to an animal, a
plant or a set piece, sees a small hint with its name, presses a key, and a card tells a few facts about it, like the
sign next to an enclosure. This is the first step towards an educational game about prehistoric life (see "Later").

- **Asked for by:** Mario, 2026-11-15.
- **Language of the texts:** English (Mario).
- **Scope of this task:** the hint, the card, the eight kinds of exhibit that exist today, their texts.
- **Files expected to change:** `source/src/zoo.js` (new), `source/build.mjs` (one entry in `FILES`),
  `source/src/world.js`, `source/src/main.js`, `source/template.html`, `README.md` (controls table), `index.html`
  (rebuilt).
- **Shaders:** no change expected. Nothing new is drawn in the 3D scene.

Read `CLAUDE.md` first. Its facts and working rules apply to every line below.

## What the player gets

1. **Hint.** While the player looks at an exhibit from close enough, a small line appears at the bottom of the
   screen: its name and how to open the card, for example `Giant kelp · Space to read`. It disappears when the
   player looks or swims away.
2. **Card.** `Space` or a left click opens the card of the exhibit named in the hint. The card shows a title, a
   subtitle, up to three short fact rows and one paragraph. The scene keeps running behind it, the player can keep
   swimming.
3. **Closing.** `Space` or a click again closes it. It also closes when the player has swum 15 m away from where it
   was opened, when another card is opened, and when the menu opens. Only one card at a time.
4. **Touch.** On a touchscreen the hint itself is the button: tapping it opens the card, tapping the card closes it.
5. **Menu.** The controls list in the menu gets one more line for the new key.

## Decisions

| Decision | By |
|---|---|
| Texts in English | Mario |
| Looking plus a key press, not automatic. Mario left the kind of interaction open | Claude |
| `Space` and left click. `E` is taken (swim up), `F` and `B` are taken in `dev.html` | Claude |
| The card sits at a fixed place on the screen and does not follow the animal. Following it would mean DOM writes in every frame | Claude |
| Every kelp column, sponge and coral counts as an exhibit, not only a few marked ones | Claude |

The decisions marked Claude are defaults. Mario can change them; ask before building something else.

## Exhibits in version 1

| Id | What the player targets | Where it comes from | Reach to start with |
|---|---|---|---|
| `kelp` | any kelp column | `column()` in `world.js`: a vertical line from its base, `H` high | 5 m from the line |
| `sponge` | any sponge | `solid()` calls with mesh 4 to 6 | 3 m |
| `coral` | any coral | `solid()` calls with mesh 7 to 9 | 3 m |
| `manta` | each manta | the `mantas` list, moving | 9 m |
| `plesiosaur` | each plesiosaur | the `plesios` list, moving | 12 m |
| `fish` | each school of fish | the `SCH` list in `makeWorld`, moving | 9 m from the middle of the school |
| `fluke` | the stone whale tail | `solid(10, ...)`: a vertical line, about 16 m high | 12 m from the line |
| `ship` | the shipwreck | `solid(11, ...)`: a line along the hull, 34 m long | 12 m from the line |

The reach values are a first guess for tuning in the browser. The purple and magenta plants are left out for now: they
are invented and have no real counterpart to tell facts about.

## Texts

Put these into `source/src/zoo.js` as data. Keep the source links as comments next to each entry. Do not add or change
facts without a source, and say so in the hand-over if a text was changed.

```js
// Zoo texts: one entry per kind of exhibit. name, sub and text are shown as they are, facts are [label, value] rows.
const ZOO = {
  kelp: {
    name: 'Giant kelp', sub: 'Macrocystis pyrifera · brown alga',
    facts: [['Grows', 'up to 60 cm a day'], ['Length', 'about 30 m, up to 53 m'], ['Holds on with', 'a holdfast, not roots']],
    text: 'Not a plant but a giant brown alga. Gas-filled floats lift its blades towards the light, and in good conditions it grows up to 60 cm in a single day. Sharks, fish, lobsters and squid live in and around kelp forests.',
  },
  manta: {
    name: 'Giant manta ray', sub: 'Mobula birostris · ray',
    facts: [['Wingspan', 'up to about 8 m'], ['Food', 'plankton, filtered from the water'], ['Brain', 'the largest of any fish']],
    text: 'The largest ray in the world eats some of the smallest food: plankton, which it filters from the water as it glides along with its mouth open. Mantas have the largest brain of any fish. The pattern of spots on the belly is different on every animal, like a fingerprint.',
  },
  fish: {
    name: 'School of fish', sub: 'many fish moving as one',
    facts: [['Why', 'safety in numbers']],
    text: 'Hundreds of fish that turn together are hard to attack: a hunter struggles to pick out a single one, and with so many eyes on watch, danger is spotted early. Swimming in formation may also save energy, although researchers still argue about that.',
  },
  sponge: {
    name: 'Giant barrel sponge', sub: 'Xestospongia muta · sponge, an animal',
    facts: [['Age', 'more than 2,000 years (estimated)'], ['Height', 'up to 1.8 m'], ['Food', 'tiny particles, filtered from the water']],
    text: 'A sponge is an animal, even though it never moves. It draws seawater in through its walls and filters out tiny bits of food. Giant barrel sponges grow slowly and are called the redwoods of the reef: the largest are estimated to be more than 2,000 years old.',
  },
  coral: {
    name: 'Coral', sub: 'a colony of tiny animals',
    facts: [['Made of', 'hundreds to hundreds of thousands of polyps'], ['Relatives', 'jellyfish and sea anemones'], ['Reefs', 'under 1 % of the sea floor, home to 25 % of sea life']],
    text: 'What looks like a bush or a fan is a colony of tiny soft animals called polyps, relatives of jellyfish and sea anemones. Hard corals build limestone skeletons that grow into reefs over thousands of years. Reefs cover less than one percent of the ocean floor but support about a quarter of all marine creatures.',
  },
  plesiosaur: {
    name: 'Plesiosaur', sub: 'Plesiosauria · extinct marine reptile',
    facts: [['Lived', 'in the age of dinosaurs, until 66 million years ago'], ['Swam with', 'four flippers'], ['Young', 'born alive, one large baby']],
    text: 'Not a dinosaur but a reptile of the sea, a hunter in the water while dinosaurs ruled the land. It beat its four wing-shaped flippers to fly through the water. A 78-million-year-old fossil of a mother with her unborn young shows that plesiosaurs gave birth to live young instead of laying eggs on land.',
  },
  fluke: {
    name: 'The stone whale tail', sub: 'a sculpture of a fluke',
    facts: [['Real name', 'fluke'], ['On a humpback', 'its underside is unique, like a fingerprint']],
    text: 'This one is made of stone, but it shows the tail of a whale, called a fluke. On a humpback whale the black and white pattern on the underside is different on every animal. Researchers photograph flukes to recognise single whales. One humpback was identified again 35 years after it was first photographed.',
  },
  ship: {
    name: 'Shipwreck', sub: 'a new home for sea life',
    facts: [['Wrecks worldwide', 'about three million (estimated)']],
    text: 'A sunken ship does not stay empty. First a thin layer of microbes coats it, then sponges and corals settle on the hard surfaces. Small fish hide in its cracks while larger hunters patrol around it. Fish sometimes arrive within minutes of a ship going down.',
  },
};
```

Sources, checked on 2026-11-15:

- `kelp`: NOAA National Marine Sanctuaries, photo gallery "Giant kelp"
  (https://sanctuaries.noaa.gov/pgallery/pgchannel/living/living_9.html): growth of 50 to 60 cm a day, gas-filled
  floats. Oceana, Marine Life Encyclopedia, "Giant Kelp" (https://oceana.org/?p=16450): not a plant, holdfast, 30 m on
  average and up to 53 m, animals in and near kelp forests.
- `manta`: Hawaii Division of Aquatic Resources, "Giant Oceanic Manta Ray" (https://dar.hawaii.gov/?p=8174), citing
  NOAA Fisheries: largest ray, wingspan up to 26 feet (7.9 m), spot pattern used to tell animals apart. NOAA Fisheries
  via Sail-World (https://www.sailworldcruising.com/news/248581/New-study-about-where-giant-manta-rays-go-and-why):
  filter feeder, biggest brain of any fish. That article gives 29 feet for the wingspan, so "about 8 m" is the
  cautious figure. Shark Angels, "The Manta Ray" (https://sharkangels.org/manta-ray/): feeds gliding with its mouth
  open, belly markings differ from animal to animal.
- `fish`: Wikipedia, "Shoaling and schooling" (https://en.wikipedia.com/wiki/Shoaling): defence through earlier
  detection of predators and a smaller chance for each fish of being caught, energy saving probable but disputed.
- `sponge`: NOAA National Centers for Coastal Ocean Science (https://coastalscience.noaa.gov/?p=46711): redwoods of the
  reef, up to about 6 feet tall, more than 2,000 years old. Oceana, "Giant Barrel Sponge"
  (https://oceana.org/marine-life/giant-barrel-sponge/): filter feeding, ages are estimates.
- `coral`: NOAA Fisheries, "Corals" (https://fisheries.noaa.gov/corals): animals, polyps, relatives, colonies of
  hundreds to hundreds of thousands, reefs over thousands of years, under one percent of the ocean floor and about 25
  percent of marine creatures.
- `plesiosaur`: Scientific American, "Pregnant Plesiosaur Fossil Suggests the Sea Reptile Cared for Its Young"
  (https://www.scientificamerican.com/article/pregnant-plesiosaur-fossil/) and NBC News
  (https://www.nbcnews.com/news/amp/wbna44112861), both on O'Keefe and Chiappe, Science 2011: marine reptile, 78
  million years old, live birth, one large young, four wing-shaped flippers, predator while dinosaurs lived on land.
  **Not verified today:** "until 66 million years ago" is the usual date for the end of the Cretaceous, taken from
  general knowledge.
- `fluke`: NOAA digital library, "Humpback whale flukes" (https://noaa.gov/media/78257): single whales are told apart
  by the black and white pattern under the flukes. NOAA Fisheries news release of 2007-05-14
  (https://webarchive.library.unt.edu/eot2008/20080916143814/http://www.fakr.noaa.gov/newsreleases/2007/humpback.htm):
  one whale identified over 35 years.
- `ship`: Avery Paxton (NOAA), "Shipwrecks teem with underwater life, from microbes to sharks"
  (https://discovermagazine.com/the-sciences/shipwrecks-teem-with-underwater-life-from-microbes-to-sharks): about
  three million wrecks, microbes first, then sponges and corals, small fish in the cracks, fish within minutes.

## How to build it

A suggestion, not a prescription. The hooks are real, the design is yours to improve.

**No picking on the graphics card.** Finding what the player looks at needs only the camera and a list of places.

- **Camera.** Position `F[CX]`, `F[CY]`, `F[CZ]` and view direction `F[FX]`, `F[FY]`, `F[FZ]` are set in `render()`
  in every frame. Scene time is `F[TIME]`.
- **Places that do not move.** Register them while the world is generated, in `makeWorld`, at the spots named in
  the table above. A place is a line segment plus a reach, which covers a kelp column, the whale tail, the ship and,
  with both ends equal, a single sponge. There are thousands of them, so store them the way the world already
  stores rocks: sorted by culling cell (`cellOf`, `packC`, 16 by 16 cells of 24 m) in one typed array, and search
  only the camera's cell and its eight neighbours.
- **Animals that move.** Their place comes from the same formula as in their vertex shader, evaluated in
  JavaScript at `F[TIME]`: `vsManta` for the mantas, `plP` for the plesiosaurs, `vsFish` for the schools (use the
  school's own angle, without the per-fish offset). `Wd.mantas` and `Wd.plesios` are still there at run time. The
  list of schools (`SCH`) is local to `makeWorld` and has to be returned. Write a comment at both copies of each
  formula that names the other one.
- **Choosing.** Of everything within reach and roughly in front of the camera, the one nearest to the middle of
  the view wins. Keep the current target until another one is clearly better, so the hint does not flicker.
- **Page.** Hint and card are ordinary HTML over the canvas, like the menu and the stats line. `template.html`
  uses single-letter ids and keeps the state of the page in the class on `<body>`. Free ids include `e`, `j`, `n`,
  `r`, `t`, `u`, `v`, `x`, `y`, `z`. Hint and card must be invisible while loading and in the menu.
- **Keys.** Keys are handled in `key()` in `main.js`, clicks by the `click` listener on the canvas, which also
  captures the mouse. Both have to keep working as they do now.
- **Content.** `zoo.js` goes into `FILES` in `build.mjs` before `main.js`. The code that shows a card must not
  know any id: a new kind of exhibit is one entry in `ZOO` and one registration, nothing else.

## Rules that matter here

- **No allocation per frame.** The search runs in every frame and must not create arrays, objects or strings.
  Touch the DOM only when the target changes or a card opens or closes.
- **The world must stay the same.** Registering places must not call `rnd()`. Check: the six viewpoints look the
  same as before.
- **All detail levels.** Low and Medium thin out leaves, not kelp columns, sponges or corals. The exhibits are the
  same on every level.
- **Readable.** The card uses the type and colours of the menu and stays readable over bright water.

## Acceptance criteria

1. For each of the eight kinds: swimming close and looking at it shows the hint with the right name; looking away
   or swimming away hides it.
2. `Space` and left click open the card with title, subtitle, fact rows and text exactly as in `zoo.js`; the same
   input closes it.
3. The card closes by itself 15 m from where it was opened, when another card opens and when the menu opens.
   Never two cards.
4. Nothing of this is visible while loading or behind the menu.
5. `W` `A` `S` `D`, `Q`, `E`, `Shift`, `1` to `6`, `H`, `M`, `Esc` and mouse look work as before. In `dev.html`,
   `F` and `B` work as before.
6. A card for a moving animal stays open while the animal swims on.
7. No new messages in the browser console.
8. `frame()`, `render()` and everything they call for this feature are free of `new`, array and object literals
   and string building.
9. Both builds run. The hand-over names the new bundle size and how much the texts added.

## Verification

Both gates of `CLAUDE.md` apply.

- **Visual critic.** The six poses must look as before. In addition give the critic renders of the new things:
  a hint over kelp, an open card for a manta, an open card for the plesiosaur, and one card on Low detail at a
  small window. It should judge legibility, placement and whether anything covers the view more than it has to.
- **Performance.** Run the benchmark once as it is and once with a card open. Report both. The search must not
  show up in the frame times.

## Later, not in this task

- More species, above all prehistoric ones. Each is the recipe "adding an animal" in `CLAUDE.md` plus one entry
  in `ZOO`.
- A time skipper that travels through epochs, each with its own animals and a list of what lived when. Probably
  several HTML files. Keep that in mind when naming things, build nothing for it now.
- A counter of exhibits found, texts in German, a card that follows the animal, markers in the world.
