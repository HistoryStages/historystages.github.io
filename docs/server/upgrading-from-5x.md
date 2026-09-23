---
title: Upgrading from 5.x
description: "What changed for existing packs in 6.0.0, including the settings files moving and the two behaviour changes."
sidebar_position: 5
---

# Upgrading from 5.x

Most of 6.0.0 is additive: stage files written for 5.x load unchanged, and legacy spellings are
still read. Two things do change, and one of them changes the meaning of files you already have.

## The settings files moved

Before 6.0.0 the settings lived in `config/historystages-client.toml` and
`config/historystages-common.toml`, split by **who owned the value** rather than by what it does.
They are now `config/historystages/settings/visual.toml` and `gameplay.toml`, split by subject. →
[Config Files](/wiki/server/config-files)

**Nothing needs re-entering.** On the first launch of 6.0.0 both old files are read and every
setting is carried into its new home. The old files are renamed to
`historystages-client.toml.migrated` and `historystages-common.toml.migrated` and left in place, so
the originals are still there if anything looks wrong.

The migration writes a summary line to the log, and the config editor shows a one-off notice the
first time it is opened afterwards.

Two settings were removed rather than moved, because nothing in the mod ever read them:
`lockScrollWhileResearching` and `showDependencyScreenInPedestal`.

:::warning[The carry-over is not permanent]
It is kept until **6.3**. A pack skipping straight from 5.x to a later version than that will have
to set its options again.
:::

### Coming from Fabric 5.2

The carry-over above reads the two old NeoForge and Forge files. **The Fabric 5.2 build kept its
settings somewhere else**, in `config/historystages/config.json`, and 6.0 does not read that file.
On Fabric every setting starts from its default after the update, and the old values have to be set
again — in the config editor, or in `visual.toml` and `gameplay.toml`.

`config.json` is left where it is, so the old values can still be looked up. Nothing reads it any
more, and it can be deleted once the new files say what it said.

Stage files and the world's unlock records are not affected: they live in the same place and in the
same format as on 5.2.

Fabric also jumps straight from 5.2 to 6.0, past the 5.3 to 5.6 releases the other loaders had in
between. Their changes arrive at the same time; the
[release notes](https://github.com/Flix100000/History-Stages/releases) have them.

## `trade` is a new action, and it applies to old files

[`unlock_actions`](/wiki/locking/items-and-recipes/unlock-actions) stores the actions that stay
**free**, so an action that did not exist before is locked in every file written earlier. An entry
somebody narrowed to `["use"]` in 5.x gates trading as well from 6.0 onwards.

That is the intended reading — a narrowed entry means "only this" — and there is deliberately no
migration for it. But it is worth a pass over narrowed entries before shipping an update.

Two smaller consequences:

- The **result slot of a trade window** is judged by `trade` rather than by `pickup`. An entry that
  allowed pickup in order to allow trading has to say `trade` instead.
- A stage made entirely of narrowed item entries now fits about **544** of them in one network
  payload rather than 581.

## Recipe locks in individual stages are kept now

Before 6.0, a `recipes` entry written into an individual stage was stripped out at load time. It is
now kept and gated at the stations that know who is standing at them — crafting table, the player's
2×2 grid, stonecutter, smithing table.

So an individual stage that carried recipe entries which previously did nothing will start doing
something after the update. → [Recipes](/wiki/locking/items-and-recipes/recipes)

## A spawn lock no longer implies an attack lock

Until 6.0.0, gating an entity's spawning also stopped players hitting it. That coupling is gone. A
stage that relied on it now leaves the creature attackable — list it in `attacklock` as well. →
[Entities & Spawns](/wiki/locking/creatures-and-trade/entities-and-spawns#spawnlock)

## Locked recipes are hidden from the vanilla recipe book

They used to stay visible and simply refuse to craft. `hideLockedRecipesInBook` is on by default;
turning it off restores the old behaviour. →
[visual.toml](/wiki/server/config-files/visual-toml#recipe_book)

## Scripting has a proper API now

The old `ForgeEvents.onEvent` form with the event class name as a string still fires, so existing
scripts keep working — but **the class moved** in 6.0.0, from
`net.bananemdnsa.historystages.events.StageEvent` to
`net.bananemdnsa.historystages.api.stage.StageEvent`. A script carrying the old string needs the new
one, and nothing will tell you it does not match.

`HistoryStagesEvents` cannot go wrong that way, and reading and changing stage state is possible
from a script for the first time. → [Scripting](/wiki/server/scripting)

## Four commands are gone

`/history global info`, `/history global list`, `/history individual info` and
`/history individual list` were removed. They printed a text dump of a stage definition that the
editor shows better. A script or a quest reward still calling one hits a syntax error.

The two temporary-stage `info` commands stay — they show runtime state nothing else can. →
[Commands](/wiki/server/commands)

## What 6.0 added

Not a changelog — that lives with the
[release](https://github.com/Flix100000/History-Stages/releases). This is the short list of things
that did not exist in 5.x, so you know what is now worth reading:

| | |
| :--- | :--- |
| [Fluids](/wiki/locking/items-and-recipes/fluids) | Gate the fluid, not the bucket. |
| [Merchant Trades](/wiki/locking/creatures-and-trade/merchant-trades) | Single offers, professions and merchant levels. |
| [Zones](/wiki/locking/world/zones) | Areas drawn out of shapes, with a barrier and an overlay. **Beta.** |
| [Spawn rules](/wiki/locking/creatures-and-trade/entities-and-spawns) | A spawn entry carries a phase, eight conditions and extra biomes. |
| [Scripting](/wiki/server/scripting) | KubeJS and CraftTweaker can read and change stage state. Not on Fabric. |
| [Addon API](/api/) | Other mods can register their own locks, requirements and editor tabs. |
| [Recipes](/wiki/locking/items-and-recipes/recipes) | Per-player recipe locks at the stations that know who is standing there. |
| [Dependencies](/wiki/stage-file/dependencies) | Item-tag deposits, and requirements on the researcher's own individual stages. |
| [Stage Modes](/wiki/stage-file/stage-modes#auto) | Triggers that unlock a stage from player and world state. |

One thing to expect in an old world: stages unlocked before 6.0.0 have no recorded unlock time, and
the Stage Graph background uses that timestamp. Until something unlocks again, the deepest stage in
the tree decides the background once. → [Stage Graph](/wiki/in-game-tools/stage-graph)

## Things that did not change

- Stage file format — everything from 5.x loads.
- Stage ids and unlock records.
- The legacy `lock_actions`, flat `structures` arrays, and `unlock_dimensions` spellings are all
  still read.

## See also

- [Versions & Platforms](/wiki/about/versions-and-platforms) — which mod version runs on which
  loader, and which wiki version documents it.
