# Historic Ocean

**An underwater zoo you can swim through, right in your browser: the sea of today, and step by step the seas of the past.**

Towering kelp forests, sunbeams pouring through a rippling surface, a sunken ship, manta rays gliding overhead.
And all of it is made by code: no images, no 3D models, no sound files. Every era is a world of its own that fits in **one HTML file of about 116 KB**.

![Kelp forest with a stone whale tail and a manta ray](.github/screenshots/whale-fluke.jpg)

## Try it

1. Download [`index.html`](index.html).
2. Open it in **Chrome** or **Edge** on a desktop computer.
3. Wait a few seconds while the world is built, then press **Dive in** and start swimming.

Nothing to install, and it works offline. It needs a browser with **WebGPU**. If you see *"This scene needs WebGPU"*, update your browser or switch to Chrome / Edge.

## Eras

The title menu has a timeline from the formation of the Earth to today. Every era is meant to become a world of its own, with its own sea floor, its own life and its own light. An era that is built is a link in the timeline and opens its own page. The others are shown dimmed, with their dates. So far there are two: **Today**, which is `index.html`, and the **Cambrian** (`cambrian.html`), which is under construction: a deep basin at the foot of a reef wall, 508 million years ago, with its own water and light. Its life is gathered in gardens: beds of tulip animals, sponges and algae, and the first animals that swim there: swarms of Marrella, shoals of the early fish Metaspriggina, jellyfish, Opabinia with its five eyes and its trunk, and the big hunter Anomalocaris. Everything there has its real size, and the largest hunter is as long as your forearm: shrink to a fish or a shrimp with `C` to meet them. Every zoo card shows how large its animal is next to you or your hand. On the mud walk Hallucigenia, on spines and claws, and the trilobite Olenoides.

## What's down there

- **Kelp forests** that sway in the current and sparkle with tiny gold and green specks
- **Light rays** streaming down from a wavy surface, with shimmering caustics on the sea floor
- **A sunken wooden ship**, a **giant stone whale tail**, rock arches, canyons and floating boulders
- **Manta rays**, schools of fish, rising bubbles and drifting particles
- **A purple grotto** with glowing magenta ground cover, coral and barrel sponges
- **A soundscape** made up as you listen: a deep rumble, distant whale calls, soft chimes and bubbles

| | |
|---|---|
| ![Shipwreck](.github/screenshots/shipwreck.jpg) | ![Looking up through the kelp](.github/screenshots/kelp-forest.jpg) |
| ![Barrel sponges](.github/screenshots/sponge-garden.jpg) | ![Light rays over the kelp basin](.github/screenshots/light-rays.jpg) |

![The purple grotto](.github/screenshots/purple-grotto.jpg)

## Controls

| | Keyboard & mouse |
|---|---|
| Look around | Move the mouse |
| Swim | `W` `A` `S` `D` |
| Up / down | `E` / `Q` |
| Swim faster | Hold `Shift` |
| Change your size | `C`: diver (1.8 m), fish (18 cm) or shrimp (1.8 cm), to look at small animals up close |
| Read about an animal, a plant or a set piece | Swim close and look at it: its name appears at the bottom of the screen. `Space` or a left click opens a card with a few facts, the same again closes it |
| Menu | `Esc` releases the mouse and opens the menu with the list of controls; **Resume** takes you back |
| Sound on / off | `M` (sound starts when you dive in) |
| Performance stats | `H` |

The seabed, cliffs and arches are solid: you glide along the rock instead of swimming into it, and you still fit through every tunnel and arch. Kelp, plants, corals, sponges, loose rocks, the floating boulders, the ship and the whale tail you can swim through.

Historic Ocean is made for a computer with a keyboard and a mouse. It does not support phones or touch screens.

## How it works

- The seabed is sculpted on your graphics card every time the page opens, then decorated with about two million kelp leaves and plants, tens of thousands of rocks, and thousands of sponges, corals and fish.
- Everything is drawn with **WebGPU** directly. No game engine or 3D library is used.
- The ship, whale tail, mantas, fish and corals are built from simple mathematical shapes.
- The sound is synthesized live with the Web Audio API.
- It's built to run smoothly: about 180 fps at 2560×1440 on an RTX 5070 Ti. On slower hardware it aims for 60 fps by lowering first the resolution and then how far away plants and rocks are drawn, in small steps. The scene is already running, blurred, behind the start menu, so most of that tuning is done before you dive in. Your browser remembers the resolution and draw distance the scene settled on, for the next visit.

## Make it your own

The readable source code is in the [`source`](source) folder. To change something and rebuild the pages you need [Node.js](https://nodejs.org) 18 or newer:

```bash
cd source
npm install
npm run build
```

This writes one page per era next to this README: `index.html` for the era Today, and `<id>.html` for every other folder under [`source/eras`](source/eras). `npm run build:readable` writes unminified pages instead, which are easier to debug in the browser's developer tools.

`npm run build:dev` writes separate pages (`dev.html`, and `<id>-dev.html` for other eras) with extra tools that are not part of the game: `F` flies the camera along a one-minute path through the whole world, `B` runs that flight as a benchmark and reports frame and GPU times, and `1` to `6` jump to the six test poses that every check of a world looks from.

The code has two parts. The **engine** in [`source/engine`](source/engine) is the same for every era and knows no animal, no place and no colour of water. An **era** is one folder under [`source/eras`](source/eras) with everything that makes its world. [`CLAUDE.md`](CLAUDE.md) has the recipes for adding an animal and for adding an era.

| File | What's inside |
|---|---|
| [`source/eras/today/world.js`](source/eras/today/world.js) | The world of today: what is drawn and where it stands, from kelp forests and sponge gardens to fish schools, mantas, the ship and the whale tail. **A good place to start.** |
| [`source/eras/today/floor.js`](source/eras/today/floor.js) | Its sea floor: rock walls, arches and tunnels |
| [`source/eras/today/air.js`](source/eras/today/air.js), [`look.js`](source/eras/today/look.js) | Its look: the colours of water and light, the materials of rock, wood, sponges and corals, the kinds of leaf (WGSL shader code) |
| [`source/eras/today/sealife.js`](source/eras/today/sealife.js), [`setpieces.js`](source/eras/today/setpieces.js) | Its animals and set pieces: their shapes and how they move |
| [`source/eras/today/era.js`](source/eras/today/era.js) | Its six test poses (where you start, and the fixed views of every check), the camera path the world is laid out around, sun, brightness and the mood of the sound |
| [`source/eras/today/zoo.js`](source/eras/today/zoo.js), [`about.txt`](source/eras/today/about.txt) | The zoo texts about its animals, plants and set pieces, and the sentences about the era in the title menu |
| [`source/eras.mjs`](source/eras.mjs) | The list of all eras with their dates |
| [`source/engine/main.js`](source/engine/main.js) | The renderer, the camera and the controls |
| [`source/engine/shaders.js`](source/engine/shaders.js) | Lighting, fog, the water surface, light rays and the frame of every other shader |
| [`source/engine/tools.js`](source/engine/tools.js) | The tools an era builds its world with |
| [`source/engine/zoo.js`](source/engine/zoo.js) | The zoo: finding what you look at, the hint and the card |
| [`source/engine/audio.js`](source/engine/audio.js) | The soundscape |
| [`source/engine/quality.js`](source/engine/quality.js) | The fixed detail settings, and what is remembered between visits |
| [`source/engine/math.js`](source/engine/math.js) | Noise, random numbers and mesh-building helpers |
| [`source/engine/dev.js`](source/engine/dev.js) | Development tools (fly-through and benchmark), only in the dev pages |
| [`source/template.html`](source/template.html) | The page around the scene: loading bar, title menu with the timeline, and their styles |
| [`tools`](tools) | Checks for the pages, run with Node: see [`tools/README.md`](tools/README.md) |

Some easy first tweaks:

- **Water color:** `WCOL` (blue-green water) and `PCOL` (purple grotto) in `source/eras/today/air.js`
- **Sunlight color:** `SUNC` right next to them
- **Brightness and light rays:** `expo` and `rays` in `source/eras/today/era.js`
- **Swimming speed:** search for `26 : 7` in `source/engine/main.js` (fast speed : normal speed, in metres a second
  for the diver). The fish and the shrimp swim at a share of that: the third number of each size in `SIZES`, same file

## License

[MIT](LICENSE): free to use, change and share, including in your own projects.

Historic Ocean started as a copy of [Abyssal Garden](https://github.com/Noniv/abyssal-garden) by Noniv, which is under the same license.
