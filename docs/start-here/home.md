---
title: Home
description: "A progression framework for modpacks: define stages, list what each one holds back, and let players research their way forward."
slug: /
sidebar_position: 1
---

# History Stages

History Stages is a progression and gatekeeping framework for modpack authors. You define
**stages**, you list what each stage holds back, and players unlock them by researching at a
pedestal. Until a stage opens, everything listed in it is out of reach — the item cannot be used,
the recipe cannot be crafted, the dimension cannot be entered, the mob does not spawn.

Nothing is locked out of the box. An installed History Stages with no stage files changes nothing
about the game.

:::note[Which version is this?]
These pages describe **6.0.x**, which runs on NeoForge 1.21.1, Forge 1.20.1 and Fabric 1.21.1.
Where a loader does something differently, [Versions &
Platforms](/wiki/about/versions-and-platforms) lists it. On an older build, pick its line in the
version picker in the top bar.
:::

## Two kinds of stage

|  | Unlocked by | Applies to | Typical use |
| :--- | :--- | :--- | :--- |
| **Global** | one player, once | the whole server | eras — Stone Age, Iron Age, Endgame |
| **Individual** | every player, separately | that player only | personal skill paths, professions |

They mix freely in the same pack, and a few lock types only work in one of them. When the same
content is listed in a global *and* an individual stage, History Stages turns on a two-step
**dual-phase lock** for it by itself.

→ [Global vs Individual Stages](/wiki/start-here/global-vs-individual) is the page to read before
designing a pack. It carries the full matrix of which lock works in which mode, and why.

## What a stage can hold back

| | |
| :--- | :--- |
| [Items, Tags & Mods](/wiki/locking/items-and-recipes/items-tags-mods) | Single items, whole item tags, or every item from a mod id. |
| [NBT & Data Components](/wiki/locking/items-and-recipes/nbt-and-components) | Only the enchanted books with Sharpness, only the red leather chestplate. |
| [Unlock Actions](/wiki/locking/items-and-recipes/unlock-actions) | Gate one interaction instead of all of them — carry it but do not swing it. |
| [Recipes](/wiki/locking/items-and-recipes/recipes) | Specific recipe ids, with a lock overlay in JEI and EMI. |
| [Fluids](/wiki/locking/items-and-recipes/fluids) | The fluid, not the bucket — one entry covers every tank and bucket in the pack. |
| [Loot](/wiki/locking/items-and-recipes/loot) | Remove or replace locked items in chest loot and mob drops. |
| [Dimensions & Structures](/wiki/locking/world/dimensions-and-structures) | Refuse entry to a dimension, wall off a structure, or cap how often it generates. |
| [Biomes](/wiki/locking/world/biomes) | Make a biome unsurvivable until the stage opens. |
| [Zones](/wiki/locking/world/zones) | Areas you draw yourself, each with its own rules. **Beta.** |
| [Entities & Spawns](/wiki/locking/creatures-and-trade/entities-and-spawns) | Stop attacks, stop breeding and mounting, or write a full spawn rule. |
| [Merchant Trades](/wiki/locking/creatures-and-trade/merchant-trades) | Gate one offer, a whole villager profession, or a merchant level everywhere. |

## Build it in the game

The [In-Game Editor](/wiki/in-game-tools/in-game-editor) is the normal way to build a pack, and
almost every pack is built entirely in it. Pause menu, permission level 2, or `/history editor`.

A stage opens with one tab per thing it can lock, plus searchable pickers that read the live
registry, a visual NBT editor, a zone editor with a map, and a dependency editor. You cannot write
an id that does not exist, and a save reloads immediately.

**The files underneath are plain JSON**, one per stage, under `config/historystages/`. They are
readable and editable by hand, and the editor writes the same format — so the two mix freely. This
wiki describes stages by their fields rather than by which button to press, because a field is
easier to name; each page says where in the editor the same thing lives.

→ [Installation & Your First Stage](/wiki/start-here/installation) ·
[Where Stage Files Live](/wiki/start-here/where-stage-files-live) ·
[Anatomy of a Stage File](/wiki/stage-file/anatomy)

## Showing players where they are

Large packs can open an interactive [Stage Graph](/wiki/in-game-tools/stage-graph) from the pause
menu, drawing the whole progression tree with the player's own position in it.

Scripts read and change stage state through [KubeJS and CraftTweaker](/wiki/server/scripting), and
other mods extend History Stages through the [Addon API](/api/addon-development).
