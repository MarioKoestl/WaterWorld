# Brief: eras and the timeline in the title menu

Historic Ocean becomes a journey through the history of the Earth. Every era is a world of its own: its own sea floor,
its own animals and plants, its own light, its own zoo texts. The title menu gets a timeline from the formation of the
Earth to today, where the player picks the era to dive into.

This brief is the framework. It ends with the world of today running through that framework, unchanged, and the
timeline in the menu. The first new world has its own brief: `era-cambrian.md`. Since 2026-11-16 every
other era has a brief like that one, `era-<id>.md`, and `era-common.md` holds what they share.

- **Asked for by:** Mario, 2026-11-15.
- **Files expected to change:** almost everything under `source/`, `README.md`, `CLAUDE.md`, `index.html`.
- **Order:** this brief first, completely, then `era-cambrian.md`.

Read `CLAUDE.md` first. Its facts and working rules apply to every line below.

## What the player gets

1. **Timeline.** The title menu shows the eras in order of time, from the oldest to today, each with its name. The
   era of the page that is open is lit, like the detail level that is in use.
2. **Choosing.** An era that has been built is a button. Choosing it loads that world: its own page, with the usual
   loading bar. An era that has not been built yet is shown dimmed, with its dates, and cannot be chosen.
3. **Where am I.** Under the timeline the menu names the era that is open: its name, when it was, and a short
   paragraph (70 words at most) on what is special about it.
4. **Everything else stays.** Detail level, controls, the zoo hint and card, sound and the menu work the same in
   every era.

## The eras

Names and dates follow the International Chronostratigraphic Chart of the International Commission on Stratigraphy,
version 2024/12. The numbers are million years ago. Show them rounded to whole millions, in the form "539 to 487
million years ago". Check the chart again before changing a number.

| Id | Name | From | To | Built in |
|---|---|---|---|---|
| `hadean` | Hadean | 4567 | 4031 | `era-hadean.md` |
| `archean` | Archean | 4031 | 2500 | `era-archean.md` |
| `proterozoic` | Proterozoic | 2500 | 635 | `era-proterozoic.md` |
| `ediacaran` | Ediacaran | 635 | 538.8 | `era-ediacaran.md` |
| `cambrian` | Cambrian | 538.8 | 486.85 | `era-cambrian.md` |
| `ordovician` | Ordovician | 486.85 | 443.1 | `era-ordovician.md` |
| `silurian` | Silurian | 443.1 | 419.62 | `era-silurian.md` |
| `devonian` | Devonian | 419.62 | 358.86 | `era-devonian.md` |
| `carboniferous` | Carboniferous | 358.86 | 298.9 | `era-carboniferous.md` |
| `permian` | Permian | 298.9 | 251.902 | `era-permian.md` |
| `triassic` | Triassic | 251.902 | 201.4 | `era-triassic.md` |
| `jurassic` | Jurassic | 201.4 | 143.1 | `era-jurassic.md` |
| `cretaceous` | Cretaceous | 143.1 | 66.0 | `era-cretaceous.md` |
| `paleogene` | Paleogene | 66.0 | 23.04 | `era-paleogene.md` |
| `neogene` | Neogene | 23.04 | 2.58 | `era-neogene.md` |
| `today` | Today | 2.58 | 0 | this brief: the world that exists now |

The first three are eons, the rest are periods. That mix is on purpose: all the periods before the Cambrian would
make the list twice as long and say little to a visitor. One of them has an entry of its own, the Ediacaran, the
last period before the Cambrian (Mario). The entry Proterozoic stands for the time before it. `today` stands for the
Quaternary, the period we live in.

`source/eras.mjs` was written before the Ediacaran was decided and has fifteen rows. `era-common.md` says who adds
the sixteenth.

Sources, checked on 2026-11-15:

- International Commission on Stratigraphy, International Chronostratigraphic Chart v2024/12
  (https://stratigraphy.org/ICSchart/ChronostratChart2024-12.pdf): 4567, 4031, 2500, 635, 538.8, 486.85, 143.1, 66.0,
  23.04, 2.58.
- The same chart as a list, University of Maryland, T. Holtz (https://geol.umd.edu/~tholtz/G102/geocolumn2025.pdf):
  the boundaries from the Ediacaran to the Cretaceous.

## Decisions

| Decision | By |
|---|---|
| Every era is a world of its own | Mario |
| The era is chosen in the title menu, from all eras since the Earth formed | Mario |
| Every era has its own atmosphere: light, colour of the water, haze | Mario |
| One HTML file per era, built from a shared engine and one folder per era. Mario expected several HTML files | Claude |
| `index.html` is the world of today. The Cambrian is `cambrian.html`, next to it | Claude |
| Eras that are not built yet are visible in the timeline, dimmed | Claude |
| The list above: three eons, then the periods | Claude |
| The Ediacaran is an entry of its own | Mario |
| The plesiosaur was a test. It stays in `today` until a world of its own time exists (Jurassic or Cretaceous) and moves there then | Mario |
| One unit is one metre in every era, and the player is as large as a diver (`scale.md`) | Mario |

The decisions marked Claude are defaults. Mario can change them; ask before building something else.

## How the code has to change

Today the engine and the one world are woven together: `world.js` holds the layout and the species, `shaders.js` the
colours of the water and the shaders of the animals, `main.js` the viewpoints, the flight path and one pipeline and
draw call per species, `zoo.js` the texts. An era has to be able to bring all of that itself.

**The rule after this brief:** the shared engine names no species, no place, no colour of water and no viewpoint. An
era is one folder. Adding an era means adding a folder and nothing else.

What an era brings:

| Part | Today it is in |
|---|---|
| Name, dates, the sentences for the menu | new |
| Atmosphere: colour and clearness of the water, colour and direction of the sun, exposure, strength of the light shafts, haze near and far, drifting particles, whether the surface can be seen and how far up the player may swim | `SIG`, `KD`, `WCOL`, `KDZ`, `PCOL`, `SUNC`, `KDF` and the colours in `amb` and in the surface shader in `shaders.js`; `SUN`, `EXPO`, `RAYS` in `main.js`; the height limits in `frame()` |
| Sea floor: the rock masses and the numbers of the density field | `MESAS`, `ARCHES`, `HOLES`, `CLEARS` in `world.js`, the constants inside `dens` in `shaders.js` |
| Scattering: what grows and lies where | `makeWorld` in `world.js` |
| Species: mesh, instances, shaders, pipeline, draw call | the recipe "adding an animal" in `CLAUDE.md` |
| Zoo: texts and where the exhibits are | `ZOO`, `zooManta` and the like in `zoo.js`, `place()` in `makeWorld`, the `zooMove()` line in `main.js` |
| Six viewpoints and the flight path | `POSES`, `FLY` in `main.js` |
| Sound: the mood of the soundscape | `audio.js` |

How to split the files is yours to design. Two things are fixed:

- **Build.** `build.mjs` writes one page per era folder: `index.html` for `today`, `<id>.html` for the others, and
  the matching pages for `build:dev`. The list of eras above is one piece of data that goes into every page, and the
  build marks an era as built when its folder exists. Nobody keeps a second list by hand.
- **Links.** Pages link to each other with relative links, so the set still works when opened from a folder on disk,
  without a server.

**Start with a plan.** Before changing code, write down in a few lines how you will split engine and era (which
files, what an era file has to define, how the frame draws species it does not know by name without allocating) and
show it to Mario. Build after he agrees.

## Stages

Each stage ends with a hand-over, both builds running and nothing broken.

1. **The world of today as an era.** Move everything that belongs to the present world into its era folder. The page
   looks and runs exactly as before. Nothing new is visible.
2. **Timeline.** The menu shows the eras, with `today` lit and all others dimmed, and names the open era underneath.

## Rules that matter here

- **Nothing changes in the world of today.** It is deterministic: same seed, same picture. Render the six viewpoints
  at a fixed scene time before and after stage 1 and compare them. They have to match.
- **No allocation per frame**, also in the code that draws an era's species.
- **One scope.** All files of a page still end up in one function. Names of one era must not collide with the
  engine. Two eras are never in the same page, so they may use the same names.
- **Settings.** The detail level is remembered in `localStorage` under `abyssal`. Pages opened from disk may each
  keep their own copy. That is acceptable; do not build anything around it.
- **The menu on a phone.** Sixteen names do not fit in one row. The timeline may scroll sideways; the era that is
  open has to be in view when the menu opens.

## Acceptance criteria

1. `npm run build` writes `index.html` from the `today` folder. Opening it shows the same world as before: the six
   viewpoints match the renders taken before the change.
2. Frame times and GPU times of the benchmark are the same as before, within what two runs of the same build differ.
3. The engine files contain no species, no place name and no viewpoint. Check by search: `manta`, `plesio`, `kelp`,
   `fluke`, `ship`, `POSES` appear only in the era folder.
4. The menu shows all sixteen eras in order, `today` lit, the others dimmed with their dates, and under them the
   name, the dates and the sentences of the open era.
5. A dimmed era cannot be chosen, by mouse, keyboard or touch.
6. Copying `today` to a second folder with another id and building gives a second page, and both pages link to each
   other from their menus. (Try it, then remove the copy.)
7. Keys, zoo hint and card, sound and detail levels work as before.
8. `CLAUDE.md` describes the new layout and has a recipe "adding an era". `README.md` is up to date.

## Verification

Both gates of `CLAUDE.md` apply.

- **Visual critic.** The six poses of `today`, compared with the renders from before. In addition the menu on a
  desktop window and on a small one. It should judge whether the timeline is readable and whether the open era is
  obvious.
- **Performance.** The benchmark of `today`, before and after.

From now on every era has its own six poses and its own flight path, and both gates run per era.
