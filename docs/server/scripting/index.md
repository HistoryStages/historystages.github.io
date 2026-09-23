---
title: Scripting
description: "What a script may read and change, and the hard line between scripting stage state and defining stages."
sidebar_position: 5
---

History Stages talks to both scripting mods. A script can **read** stage state, **change** it, and
**react** when it changes — in JavaScript through KubeJS, in ZenScript through CraftTweaker, with
the same capabilities on both sides.

:::note[Not on Fabric]
Everything under Scripting is NeoForge and Forge only. KubeJS has no Fabric build for 1.21.1 and
CraftTweaker has none at all, so the Fabric build of History Stages has no script bridge. Reading,
changing and reacting to stage state from code is still possible from a mod, through the
[API](/api/).
:::

A script cannot **define** stages or decide what a stage locks — which items, tags, mods, recipes,
dimensions, structures, biomes and mobs belong to a stage is set in the in-game editor, and only
there.

Neither mod is required. Install one, both, or neither; History Stages loads its bridge only for
the one that is present.

---

## Before 6.0.0 and from 6.0.0 on

This page is the one place in the wiki that documents an older version alongside the current one,
because packs written against the old behaviour still work and there is no reason to rewrite them.

| | Before 6.0.0 | From 6.0.0 |
|---|---|---|
| React to an unlock | `ForgeEvents.onEvent('net.bananemdnsa.historystages.api.stage.StageEvent$Unlocked', …)` | `HistoryStagesEvents.unlocked(event => …)` |
| React to one specific stage | filter by hand inside the listener | `HistoryStagesEvents.unlocked('bronze', event => …)` |
| Ask whether a stage is unlocked | not possible | `HistoryStages.isUnlocked('bronze')` |
| Unlock or relock a stage | not possible | `HistoryStages.unlock('bronze')` |
| Ask whether something is gated | not possible | `HistoryStages.isLocked('items', 'minecraft:diamond', player)` |
| CraftTweaker | nothing at all | `mods.historystages.HistoryStages` |

**The old form still works.** `ForgeEvents.onEvent` with the class name as a string keeps firing;
it is simply no longer the way to do it. The reason to move is that nothing checks that string —
misspell it, or upgrade to a version where the class moved, and the listener silently never runs.
The class *did* move in 6.0.0 — from `net.bananemdnsa.historystages.events.StageEvent` to
`net.bananemdnsa.historystages.api.stage.StageEvent` — so a script carrying the old string needs
the new one. `HistoryStagesEvents` cannot go wrong that way.

---

The two languages, each with reading, changing, and reacting to stage state:

- **[Scripting: KubeJS](/wiki/server/scripting/kubejs)** — JavaScript, `server_scripts` and `client_scripts`.
- **[Scripting: CraftTweaker](/wiki/server/scripting/crafttweaker)** — ZenScript, including the `player.hasStage(...)` shortcut.

---

## When something is wrong

Mistyped ids do not crash the server. The call returns `false` (or an empty list), and History
Stages writes one line to the log:

| What you did | What you get |
|---|---|
| Unknown stage id | `a script used unknown stage id 'bronce'. Known global stages: bronze, iron` |
| Individual stage passed to `unlock` / `isUnlocked` | a line naming the scope and the method to use instead |
| Global stage passed to `unlockFor` / `isUnlockedFor` | the same, the other way round |
| Unknown lock category | `unknown lock category 'itemz'. Known categories: historystages:items, …` |
| Any call while no server is running | one line saying so |

**Each distinct mistake is logged once**, not once per call — a query inside a tick handler would
otherwise write the same line sixty times a second. That counting is shared between the two
languages: if a KubeJS script and a ZenScript script make the same mistake, you get one line, not
two. The counter resets on `/reload`, so a corrected script gets to complain again about anything
it still has wrong.

The lines go to the normal game log (`logs/latest.log`), next to the KubeJS and CraftTweaker
errors — not into the History Stages stage-load report, which is written once at startup and is
not where you look when a script misbehaves.

Every changing call returns a boolean, so a script can check rather than assume:

```javascript
if (!HistoryStages.unlock('bronze')) {
    console.warn('bronze was already unlocked, or the id is wrong')
}
```

---

## A note on script-generated recipes

KubeJS builds recipe ids out of the order things appear in your scripts —
`kubejs:crafting_shaped_7` is the seventh shaped recipe it saw. Reorder the script and the
numbering shifts, which silently breaks any stage that gated the old id.

Since 6.0.0 History Stages checks this. After every world load and every `/reload` it compares
the recipe ids in your stages against the recipes actually loaded, and writes a warning for each
one that is missing. In the editor, those entries are shown in red on the stage's Recipes tab.

Nothing is removed — a recipe can be legitimately absent for a while — but you find out on the
same day instead of when a player asks why they can craft something they should not.

The way to avoid it entirely is to give your recipes explicit ids:

```javascript
ServerEvents.recipes(event => {
    event.shaped('4x minecraft:stick', ['A', 'A'], { A: 'minecraft:oak_planks' })
        .id('mypack:sticks')
})
```

Then the id is yours, it never moves, and picking it in the editor sticks.

---

**See also:** [Stage State & Events](/api/stage-state-and-events) for the Java side of the same events ·
[Lock Categories](/api/lock-categories) for what the category ids mean ·
[Mod Compatibility](/wiki/server/mod-compatibility) for the other integrations
