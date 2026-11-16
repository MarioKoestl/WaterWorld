# Tools

Checks for the pages of Historic Ocean, run from the repository root with Node 22 or newer. No dependencies. They
drive a Chrome of their own, without a window, through the DevTools Protocol.

Everything they write goes to `tools/out/`, which Git ignores.

## The test Chrome

```powershell
node tools/chrome.mjs start     # once, it keeps running
node tools/chrome.mjs status    # which graphics adapter, and how busy the card is (exit code 3: busy)
node tools/chrome.mjs stop
```

It uses the real graphics card when a page asks for WebGPU. Its page is 2560×1440 at device pixel ratio 1.

**Before any tool that renders the 3D scene, look at `status`.** If the card is busy with something else, do not run
it: it disturbs what is running there, and its timings are worthless. The tools that render ask themselves and do
not start then (`card.mjs`: 20 % load or more counts as busy). Most tools need no graphics card at all.

## Without the graphics card

| Tool | What it checks |
|---|---|
| `nogpu.mjs` | Every built page starts and runs up to its title screen. The only check of the minified pages |
| `accept.mjs <era> --mock` | The whole page of an era with real key presses and clicks: loading, menu, keys, mouse, the zoo hint and card of every exhibit, the card's rules, `F` and `B`, the console |
| `touch.mjs <era> --mock` | The same on an emulated phone with real touch events |
| `timeline.mjs` | The timeline of every built page: all eras, the three states, every link there and back |
| `menu.mjs <era>` | Pictures of the title menu at nine window sizes, and whether everything fits |
| `steady.mjs <era> <call> --mock` | Whether a piece of the frame loop allocates once it is compiled |
| `wgsl.mjs <era>` | Whether every shader of an era compiles, for the three detail levels. It asks the browser's WGSL compiler and draws nothing |
| `shaders.cjs` | Whether the shaders of a page are still the same shaders, by their text |
| `generator.cjs` | Whether two source trees build the same world, buffer by buffer |

`--mock` puts a stand-in in the place of WebGPU (`mockgpu.js`): every call does nothing, and the sea floor that the
compute shader would have made is a made-up one. All of the page's JavaScript runs for real, nothing is drawn.
Without `--mock` the same tools run the page with real graphics.

## With the graphics card

| Tool | What it gives |
|---|---|
| `poses.mjs <era> <name>` | The six viewpoints at 2560×1440 with the scene time frozen, and checksums of the world |
| `compare.mjs <nameA> <nameB>` | Two such runs side by side: pixels and checksums |
| `kinds.mjs <era> <name>` | A close render of every exhibit with its hint, and with its card open |
| `flight.mjs <era> <name>` | Frames of the fly-through in place of a video: twelve over the minute, and three runs of consecutive frames |
| `bench.mjs <era>` | The 60 s fly-through as a benchmark at full resolution: frame times and GPU times |
| `ways.mjs <era>` | Every animal followed along its path for ten minutes: does it keep to open water, how low does it get, how near does it come to the flight path and the viewpoints. It draws nothing of its own, but it needs the real sea floor, which the card makes |

## What to run when

**After any change:**

```powershell
cd source; npm run build; npm run build:dev; cd ..
node tools/nogpu.mjs
node tools/wgsl.mjs today
node tools/accept.mjs today --mock
node tools/touch.mjs today --mock
node tools/timeline.mjs
node tools/menu.mjs today
```

**A change that must leave an existing world as it is** (a change to the engine, a new era next to it). Keep a copy of
`source/` from before, or take the last commit: `mkdir tools/out/head; git archive HEAD source | tar -x -C tools/out/head`.

```powershell
node tools/shaders.cjs dump tools/out/head/source today tools/out/before.json
node tools/shaders.cjs dump source today tools/out/after.json
node tools/shaders.cjs compare tools/out/before.json tools/out/after.json
node --max-old-space-size=8192 tools/generator.cjs tools/out/head/source source today
```

Then, with the card free, the pictures: `poses.mjs today before` on the old state, `poses.mjs today after` on the new
one, `compare.mjs before after`. Two runs of the same build differ in a pixel or two by one brightness level.

**A change to where an animal swims:** `ways.mjs <era>`, with the card free.

**The two gates of `CLAUDE.md`** for an era: `poses.mjs`, `kinds.mjs` and `flight.mjs` make the renders for the visual critic,
`menu.mjs` the pictures of the menu, `bench.mjs` the performance report (once plain, once with `--card`).

## The other files

| File | What it is |
|---|---|
| `cdp.mjs` | The DevTools Protocol client the tools share |
| `card.mjs` | How busy the graphics card is, and the stop for tools that render when it is |
| `mockgpu.js` | The stand-in for WebGPU |
| `harness.mjs` | Makes a test page from a dev page: the page plus a hook to run code inside its bundle, and checksums |
| `inpage.js` | Helpers that run inside a test page: aim the camera at an exhibit, look away, read the card |
| `png.mjs` | Reads PNG files for `compare.mjs` |

The tools know no era. What there is to look at they read from the page: the entries of `ZOO`, the zoo places, the
animals, `ERA.views`.
