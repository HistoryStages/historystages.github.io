---
title: Running a Server
description: "What lives on the server, what the world save holds, when a reload is enough, and what to copy when a pack moves."
sidebar_position: 2
---

# Running a Server

Nothing here is needed to try History Stages out in singleplayer. It is the set of questions that
only come up once a pack is on a dedicated server: where the pack actually lives, what belongs in a
backup, and what a reload does and does not touch.

## What lives where

History Stages is installed on both sides, like any mod that adds blocks and screens. What is
*not* symmetric is the pack itself.

| | Where it lives | Reaches the client? |
| :--- | :--- | :--- |
| Stage files (`global/`, `individual/`) | Server only | Yes — sent at login, as definitions. Nothing is written on the client. |
| The three settings files | Server only | Yes — the server's values apply for the session. |
| Unlock state | The world save | Yes, as the player's own state. |
| A player's own settings files | Their game folder | Used in singleplayer and while not connected. |

A client's own copies are **never overwritten** by a server. They are simply out of the way while
that player is connected, and come back when they leave. →
[Config Files](/wiki/6.0.x/server/config-files)

## What the world save holds

Unlock state is world data, not pack data. It sits in the overworld's data folder:

```text
<world>/data/
    historystages_global.dat             which global stages are open
    historystages_individual.dat         which players have which individual stages
    historystages_temporary.dat          running timers and cooldowns for temporary stages
    historystages_auto_progress.dat      progress towards auto-triggers, per player
    historystages_auto_progress_global.dat   the same for global auto-triggers
    historystages_structure_counts.dat   how often a capped structure has generated
```

This is the split worth internalising: **`config/historystages/` is the pack, `<world>/data/` is the
save.** Copying a pack to another server carries the stages and the settings and leaves every unlock
behind, which is usually exactly what you want. Copying a world carries the progress.

It also explains a thing that surprises people: unlock records are kept against the **stage id**,
which is the file name. Renaming `bronze_age.json` makes a new stage and orphans everything recorded
for the old one. Nothing migrates it.

## Reload or restart?

`/history reload` re-reads the stage folders and the settings files, and pushes the result to
everyone online. That covers almost everything you will change while a server is up.

| | |
| :--- | :--- |
| **A reload is enough** | Stage files added, edited or deleted. Settings changed by hand. Folder structure changed. |
| **A reload does nothing** | Unlock state. It is not pack data and is never touched by a reload — relocking is `/history global lock <stage>` or `/history individual lock <player> <stage>`. |
| **A restart is needed** | Only for what a recipe browser builds once at startup: an entry appearing in or disappearing from JEI's or EMI's list — the sealing setting on scrolls, for instance. Locks themselves take effect immediately. |

The editor reloads by itself on every save, so none of this applies while you are working in it.

## Editing a live server

The editor opens from the pause menu at permission level 2, on a live server, and a save writes the
file and syncs the result to everyone in the same step. There is no maintenance window to plan.

:::danger[One order of operations matters]
The server reads stage files at startup and on `/history reload` — **not** when a file changes on
disk. Editing a file by hand and then saving that stage from the editor overwrites your edit from
the copy the server still holds in memory, silently. Run `/history reload` after a hand edit, before
opening the editor. →
[In-Game Editor](/wiki/6.0.x/in-game-tools/in-game-editor#saving-and-multiplayer)
:::

## Backups

- `config/historystages/` — the whole pack: stages, folders, settings, and the graph layout.
- `<world>/data/historystages_*.dat` — everything players have earned.
- `config/historystages/logs/` — not worth backing up, but worth reading. The load report is written
  on every startup and is the first place a misbehaving pack shows up. →
  [Getting Help](/wiki/6.0.x/about/getting-help#before-reporting-check-the-load-report)

## Permissions

Every `/history` command needs permission level 2, with one useful exception: the client-side debug
subcommands run on the operator's own client and answer about their own position and their own held
item. → [Commands](/wiki/6.0.x/server/commands)

Players never need permission for anything. Research, scrolls, the graph and the scroll document are
all ordinary gameplay.
