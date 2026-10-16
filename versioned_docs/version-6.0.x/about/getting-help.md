---
title: Getting Help & Reporting Bugs
description: "Where to ask, what the load report already tells you, and what belongs in a bug report."
sidebar_position: 2
---

# Getting Help & Reporting Bugs

Questions, bugs and feature requests are all welcome in either place — take whichever you already
have open:

- [**Discord**](https://discord.gg/BeZzxyZ9c4) — quickest for questions and pack-building help, and
  fine for reporting a bug or suggesting a feature.
- [**GitHub Issues**](https://github.com/Flix100000/History-Stages/issues) — better for anything
  that needs a log attached or that should stay findable later.

A bug raised on Discord does not get lost; it ends up as an issue if it needs one.

## Before reporting: check the load report

Every startup writes a `debug-*.log` into `config/historystages/logs/`. It lists both stage trees
and every problem found while loading them:

- duplicate stage ids across a folder tree
- item, recipe, entity or structure ids that do not exist
- recipe ids that were in a stage but are not in the game any more — the KubeJS renumbering trap
- per-player conditions written into a global stage, which are skipped rather than checked
- lock types used in a scope that cannot support them

A surprising share of "the lock does not work" turns out to be one line in that file. It is also the
first thing worth attaching to a report.

## Turning on runtime logging

The load report covers startup. For what happens *during* play — stage changes, blocked actions,
inventory strips — switch on runtime logging:

```toml
[logging]
enableRuntimeLogging = true
```

It writes `runtime-*.log` next to the load report. Off by default, because it is chatty. →
[gameplay.toml](/wiki/6.0.x/server/config-files/gameplay-toml#logging)

`showDebugErrors` in the same block controls whether stage-loading problems are also announced in
chat when a player joins. Turn it off for a published pack.

## Looking at things in-game

| Command | Shows |
| :--- | :--- |
| `/history debug structure` | Structure ids and tags at your position — the reliable way to get an id right. |
| `/history debug viz` | Draws the lock zone built around nearby structures, so `lockPadding` and `clusterDistance` are visible rather than guessed. |
| `/history debug shapes` | The individual pieces that zone was clustered from. |
| `/history debug nbt preset` | Recognised NBT fields on the held item. |
| `/history debug nbt custom` | Unrecognised NBT keys on the held item. |
| `/history debug nbt components` | The held item's data components. |

All of them run on your own client and need only your own operator status. →
[Commands](/wiki/6.0.x/server/commands#debug-subcommands-client-side)

## Common first suspects

**A hand-edited stage file does nothing.** `/history reload` has to run — the folders are read at
startup and on that command, not on every file change.

**A lock is ignored entirely.** Check the scope. `spawnlock` and `block_generation` are global-only,
`lose_on_death` is individual-only, and four dependency kinds need a single player. The load report
names them. → [Global vs Individual](/wiki/6.0.x/start-here/global-vs-individual#what-can-each-one-lock)

**A recipe still crafts in a machine.** An individual stage reaches only the stations that know who
is standing at them. Furnaces, hoppers and autocrafters are global-only. →
[Recipes](/wiki/6.0.x/locking/items-and-recipes/recipes)

**Recipes disappeared that nobody listed.** Almost always a fluid entry: without `unlock_actions` it
gates every recipe that *consumes* the fluid as well as those that produce it. →
[Fluids](/wiki/6.0.x/locking/items-and-recipes/fluids)

**A stage renamed itself into nothing.** The file name is the stage id, and unlock records are kept
against that id. Renaming the file discards them.

**Something only changes after a restart.** JEI and EMI build their recipe lists at startup, so
anything that adds or removes a recipe entry in the browser — resealing, for instance — only shows
up after one.

## A stage is too large to send

A single stage has a size cap on the packet that saves it. A stage with several hundred individually
listed items, each narrowed with `unlock_actions`, can reach it — the editor refuses the save and
shows a toast saying so rather than dropping the connection.

**The fix is almost always item tags.** One `#c:ingots` entry replaces however many individual ingot
ids, does the same job, and costs a fraction of the room. It also picks up items that mods add
later.

Stage data sent to players is compressed as of 6.0.0, which is what removed the older failure where
a very large pack could not get a client through login at all.

## What to put in a report

- Mod version, loader, and Minecraft version — see
  [Versions & Platforms](/wiki/6.0.x/about/versions-and-platforms).
- The `debug-*.log` from `config/historystages/logs/`.
- The stage file that misbehaves, or the relevant part of it.
- Whether it is a global or an individual stage. This matters more often than it looks.
- Whether it happens in singleplayer, on a dedicated server, or both.

If another mod is involved, say which — the useful reports usually name one. →
[Mod Compatibility](/wiki/6.0.x/server/mod-compatibility)

The same list applies wherever you report it. Discord is fine for all of it, a log file included.
