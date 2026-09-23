---
title: Installation & Your First Stage
description: "What to install alongside History Stages, and how to build your first stage in the in-game editor."
sidebar_position: 2
---

# Installation & Your First Stage

## What you need alongside it

**Lootr is required.** ([Modrinth](https://modrinth.com/mod/lootr) ·
[CurseForge](https://www.curseforge.com/minecraft/mc-mods/lootr)) Chest loot in vanilla is shared:
one container, one roll, whoever opens it first takes it. That cannot be filtered per player, so on
an individual stage a locked item would either vanish for everybody or reach everybody. Lootr gives
each player their own view of a container, which is what makes [per-player loot
filtering](/wiki/locking/items-and-recipes/loot) possible at all. History Stages does not load
without it.

**On Fabric, Fabric API is required too**, as it is for nearly every Fabric mod.

**Recommended, not required:**

| | |
| :--- | :--- |
| [JEI](https://www.curseforge.com/minecraft/mc-mods/jei) or [EMI](https://modrinth.com/mod/emi) | Draws the padlock overlay on locked recipes. Without a recipe browser, players get no warning before they try to craft something gated. |
| [Jade](https://modrinth.com/mod/jade) | Shows the required stage when a player looks at a locked block, entity, armour stand or item frame. |

## First launch

Install the mod and start the game once. History Stages creates its folders and writes its default
settings:

```text
config/historystages/
    global/              stage files that apply to everyone
    individual/          stage files tracked per player
    settings/            visual.toml, gameplay.toml, graph.toml
    logs/                load reports and runtime logs
```

Nothing is locked yet. The two stage folders are empty, and an empty folder means an unchanged game.

## Your first stage

**Open the editor.** Pause menu, History Stages button, or `/history editor` — you need permission
level 2. Press **New stage**, give it a display name, and you are looking at a stage with a tab per
thing it can lock: Items, Tags, Mods, Recipes, Fluids, Dimensions, Structures, Biomes, Zones,
Entities, Trades.

Go to **Items**, search for `iron_ingot`, tick it, press **Add**. Save. That is a working stage —
iron ingots are now out of reach until somebody unlocks it.

This is how nearly every pack gets built. The pickers read the live registry, so you cannot type an
id that does not exist, and a save reloads immediately. Past a handful of entries, typing ids by
hand stops being worth it.

### The same stage as a file

The editor writes plain JSON, one file per stage, and those files are readable and editable by
hand. Knowing what they look like is worth it even if you never write one — it is what the rest of
this wiki shows, because a field is easier to name than a button.

The stage you just made is `config/historystages/global/<its id>.json`:

```json title="config/historystages/global/bronze_age.json"
{
  "display_name": "Bronze Age",
  "research_time": 60,
  "items": ["minecraft:iron_ingot"],
  "tags": ["c:ores/iron"],
  "recipes": ["minecraft:iron_pickaxe"]
}
```

The stage's **id is the file name** — `bronze_age.json` is the stage `bronze_age` — and that id is
what commands, dependencies and scripts refer to. `display_name` is only the label players read.

Writing one by hand works fine. Two rules come with it:

:::warning[Hand edits need a reload, and the editor can overwrite them]
A file you edited by hand does nothing until `/history reload` runs — the server reads the folders
at startup and on that command, not when a file changes.

And it has to be that way round: if you edit a file and then save that stage from the editor, the
editor writes the whole file from the version it still has in memory, and your edit is gone. Reload
first, then open the editor.
:::

Whichever way you built it, `/history global unlock bronze_age` opens the stage again, and
`/history global lock bronze_age` puts it back.

## Players still cannot research anything

History Stages ships **no recipes** for the Research Pedestal or the Research Scrolls. That is
deliberate: how players earn the right to progress is a pack decision, not a mod decision. Until you
add a way to obtain them, the only route is `/give` or creative mode.

→ [Obtaining Scrolls & Pedestals](/wiki/in-game-tools/research/obtaining) has ready-made recipes for
KubeJS, CraftTweaker, vanilla datapacks and FTB Quests.

## Where to go next

- [Global vs Individual Stages](/wiki/start-here/global-vs-individual) — which of the two you want,
  and which locks only work in one of them. Read this before designing a pack.
- [Anatomy of a Stage File](/wiki/stage-file/anatomy) — every field a stage file can hold.
- [Where Stage Files Live](/wiki/start-here/where-stage-files-live) — folders, naming rules, and how
  to park a file without loading it.
- [Complete Examples](/wiki/stage-file/complete-examples) — whole stage files to copy.
