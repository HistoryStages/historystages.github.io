---
title: Large Packs
description: "Where the size limits actually sit, why item tags are the answer to most of them, and what does not get more expensive as a pack grows."
sidebar_position: 3
---

# Large Packs

A pack with three stages and a pack with three hundred are built the same way, and almost nothing
about the second one needs planning. Two limits are worth knowing before you hit them, and one habit
keeps you far away from both.

## The one habit: tags before ids

An entry costs room whether it gates one item or a thousand. `#c:ingots` is a single entry and
covers every ingot in the pack, including the ones a mod adds after you wrote it; the same lock
spelled out as ids is as many entries as there are ingots, and stops being complete the moment
someone adds a mod.

That is the whole trick, and it is worth applying long before size becomes a problem — a stage built
from tags is also shorter to read, quicker to edit, and does not quietly develop holes. →
[Items, Tags & Mods](/wiki/6.0.x/locking/items-and-recipes/items-tags-mods)

`mods` plus `mod_exceptions` does the same job from the other end: gate everything a mod adds, then
carve back the handful that should stay available.

## Limit one: a single stage, on save

The editor sends a stage to the server as one piece of text, and Minecraft caps how long a single
piece of text in a packet may be. History Stages checks against that cap **before** sending — a
stage over **65,536 characters** is refused with a message in the editor rather than by dropping the
connection.

In practice you only reach it one way: several hundred individually listed items, each narrowed with
its own [`unlock_actions`](/wiki/6.0.x/locking/items-and-recipes/unlock-actions). Every narrowed entry is
an object rather than a string, so it costs several times what a plain id costs.

The fix is the habit above, and it is usually dramatic: one tag entry replaces a page of ids.
Splitting one giant stage into two that unlock together also works, though it is the second-best
answer.

## Limit two: the whole pack, at login

Everything a joining player needs — both stage trees, the folder structure, the graph layout and
per-stage styling — arrives in one sync at login. Each of those payloads is **gzipped**, which for
stage JSON means roughly a tenth to a twentieth of its plain size, because a stage file is the same
dozen keys repeated once per entry.

There is still a ceiling — eight million characters of JSON per stage tree, counted before
compression — but it is a guard against a runaway file rather than a budget anyone is expected to
spend. Before 6.0.0 there was no compression at all, and a very large pack could fail to get a
client through login. →
[Upgrading from 5.x](/wiki/6.0.x/server/upgrading-from-5x)

## What does not get more expensive

Worth saying plainly, because it is the part people assume is the problem:

- **A lock check does not walk your stages.** The mod keeps an index from content to the stages that
  mention it, and rebuilds it when the stage set changes. Whether a pack has ten stages or a
  thousand is not what a check costs.
- **Folders are free.** Nest as deep as you like, up to eight levels. They exist for you, not for the
  loader. → [Where Stage Files Live](/wiki/6.0.x/start-here/where-stage-files-live)
- **Unlock state is small.** It is a list of ids per player, not a copy of anything. →
  [Running a Server](/wiki/6.0.x/server/running-a-server#what-the-world-save-holds)

## Things that do scale with the pack

- **`/history reload`** does the whole startup read again — every stage file, the settings, the
  derived indexes — and then syncs the result to everyone online. It is meant for between editing
  passes, not for a timer or a script that fires on every change.
- **The load report** grows with the pack, and is the reason it is worth reading rather than
  skimming: ids that no longer exist, locks written into the wrong scope, and duplicate stage ids
  all show up there and nowhere else. →
  [Getting Help](/wiki/6.0.x/about/getting-help#before-reporting-check-the-load-report)
- **The Stage Graph** draws every visible node. For a pack with hundreds of stages, the visibility
  rules are worth setting deliberately rather than showing everyone the whole tree. →
  [Stage Graph](/wiki/6.0.x/in-game-tools/stage-graph)
