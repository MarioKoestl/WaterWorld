# The quality gate: no toy leaves the workshop (2026-11-24)

Mario, on the first straight-shelled cephalopods of the Ordovician: they do not look good, again. They were cones
with a smaller cone for a head and boxes for arms, and they had passed the old check, because the old check asked one
question only: body or flat cut-out? A cone is a body. From now on every kind passes this gate before Mario sees it.

## Who builds

Any model may build. At present Opus 4.6 builds the animals, because it is the affordable one (Mario, 2026-11-24).
So the quality has to come from three things that do not depend on the builder: the living model, the recipe below,
and the gate.

## The living model

Every kind has a living model: an animal alive today that it must compare with under water. The brief of the era
names it in "Build notes". If it names none, propose one in the kind's research note before modelling, and say why.
The living model decides the forms the fossil does not show (soft parts, skin, how parts join). It never overrides a
source about the fossil itself.

## How to build a body (the recipe)

The first cephalopods were put together from basic shapes. Do not do that. For every kind:

1. **List the middle forms first.** Before any mesh, write into the kind's research note five to eight forms of 2 to
   10 % of the body's size that the living model has (for Nautilus: hood, eye swelling, funnel, tentacle sheaths, rim
   of the shell, the bulge of the body over the rim). Each of them gets modelled.
2. **No basic shapes.** No part is a cone, a cylinder, a ball or a box. Every part is a skin over cross-sections:
   stations along its axis, each with its own outline (width, height, how flat below, where it is widest), joined
   ring to ring. `meshTrilo` (`cambrian/walkers.js`), `meshKentuckia` and `meshDriftwood` (`devonian`) show how.
3. **Parts grow out of each other.** Where two parts meet, they share a ring of vertices, or the smaller one starts
   inside the larger one, and the surface swells around the joint. No seam, no gap, nothing stuck on.
4. **Openings are holes** with a rim and an inside: the mouth of a shell, a mouth, an eye socket. Model the lip, and
   make the inside dark.
5. **Eyes are form:** a ball in a socket, with a rim or a lid. Never a dot of colour.
6. **Thin parts are bodies too.** A tentacle is a tube along a curved line, tapering, round, with eight sides or
   more. A fin is two skins that meet in an edge.
7. **Nothing regular.** Repeated parts each get their own length, bend, twist and spacing from a hash of their
   number. Left and right differ a little.
8. **Then the surface**, by "The look" of the era's brief.
9. **Look before you call the critic.** Open your own render and answer questions 1, 2 and 4 of the list yourself.
   If one is a yes, correct it first: it saves a round.

## The gate, for every kind

0. **Build first, every round:** `cd source; npm run build; npm run build:dev; cd ..`. The turntable renders the dev
   page (`<era>-dev.html`). If that page is older than a source file of the era, the picture shows the old animal. On
   2026-11-24 six rounds judged yesterday's model this way. The tool must refuse to render then (see below).
1. Render: `node tools/turntable.mjs <era> <id> <name> --qa` (look at `node tools/chrome.mjs status` first).
2. Three pictures of ONE animal into `tools/out/qa/<era>/<id>/`, at most 1600 wide: `body` (side view, the animal
   fills at least half the picture's width), `head` (the front fifth of the animal fills half the picture; for a
   thing without a head, its most detailed part) and `diver` (from 1 m, a little above). Never a school, never an
   animal smaller than a quarter of the picture, never one cut by the edge. A picture that breaks this rule is
   made again, not shown to the critic.
3. Call the subagent `visual-critic` (`.claude/agents/visual-critic.md`). Give it the id, what it is, its size, its
   living model and the three paths. Nothing else: no code, no reasons, no excuses. One exception, the given form:
   where the real animal has a geometric form (the straight cone of an orthocone's shell), `docs/briefs/qa/<era>.md`
   says so in one sentence, and that sentence goes to the critic too. Only that file may name a given form.
4. FAIL: correct what it lists, worst first, and go back to 0. Two corrections at most. The critic knows no
   sources: where one of its fixes contradicts the brief (a colour, a count, a part the animal did not have), the
   brief wins, and the hand-over names the fix that was not followed.
5. Append the critic's whole answer of every round, word for word (not a summary), to
   `tools/out/qa/<era>/verdicts.md`.
6. A kind that still fails after two corrections is not done. Stop, hand over, and say so in the first line.

The list of twelve questions is in the agent file. Read it before you build, not after.

**The tool guards the build.** `turntable.mjs` (and `kinds.mjs`, `poses.mjs`) compare the time of the dev page with
the newest file under `source/` and stop with a clear message if the page is older. And before the critic is
called, look at the `head` picture yourself and name one thing in it that your last change made. If you cannot,
the picture is not of your change.

**Once, before the first use:** copy `docs/briefs/ref/visual-critic.agent.md` to `.claude/agents/visual-critic.md`
(Claude in the chat cannot write into `.claude`). The copy in `ref/` stays the master: change it there, copy again.

If the agent cannot start (the model name in its first lines may differ on this machine: see `/model`), fix the name
and say so in the hand-over. Never fall back to judging your own pictures.

## The second check

After each stage Mario asks Claude in the chat to look at `tools/out/qa/<era>/`. Claude writes what it finds to
`docs/briefs/qa/<era>.md`. That file is the first thing to work off in the next session. Where Claude fails a kind
the critic passed, the question that would have caught it is added to the agent file.

## What is open now

The kinds of the Ordovician that exist were built before this gate: `orthocones`, `endoceras`, `astraspis` and what
stands on the floor. Rebuild the first two after the new notes in `era-ordovician.md` ("Build notes"), then put every
existing kind through the gate.

## Not checked

The agent file was not run. The critic runs on `opus` (Mario, 2026-11-24). That this name is valid was not verified.
