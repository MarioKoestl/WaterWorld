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

1. Render: `node tools/turntable.mjs <era> <id> <name>` (look at `node tools/chrome.mjs status` first).
2. Copy the side view, one angle view and the diver's view into `tools/out/qa/<era>/<id>/`, at most 1600 wide.
3. Call the subagent `visual-critic` (`.claude/agents/visual-critic.md`). Give it the id, what it is, its size, its
   living model and the three paths. Nothing else: no code, no reasons, no excuses.
4. FAIL: correct what it lists, worst first, and go back to 1. Two corrections at most.
5. Append the verdict of every round, word for word, to `tools/out/qa/<era>/verdicts.md`.
6. A kind that still fails after two corrections is not done. Stop, hand over, and say so in the first line.

The list of twelve questions is in the agent file. Read it before you build, not after.

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
