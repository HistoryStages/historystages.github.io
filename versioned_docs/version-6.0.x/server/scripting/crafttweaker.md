---
title: CraftTweaker
description: "Reading stage state, unlocking and relocking stages, and reacting to stage events from CraftTweaker."
sidebar_position: 2
---

The CraftTweaker side of the scripting bridge. → [Scripting Overview](/wiki/6.0.x/server/scripting)
covers what a script can and cannot do, and the before/after-6.0.0 table. → [Scripting: KubeJS](/wiki/6.0.x/server/scripting/kubejs)
is the JavaScript equivalent, with the same capabilities.

```zenscript
import mods.historystages.HistoryStages;

// Reading
HistoryStages.isUnlocked("bronze");
HistoryStages.isUnlockedFor(player, "tutorial");
HistoryStages.stages();
HistoryStages.unlockedStages();
HistoryStages.categories();

// Changing
HistoryStages.unlock("bronze");
HistoryStages.lock("bronze");
HistoryStages.unlockFor(player, "tutorial");
HistoryStages.lockFor(player, "tutorial");

// Asking whether something is gated — the player is optional, the namespace is too
HistoryStages.isLocked("items", "minecraft:diamond", player);
HistoryStages.isLocked("recipes", "crafttweaker:my_recipe");
HistoryStages.missingStages("historystages:items", "minecraft:diamond", player);
```

## On the player

```zenscript
player.hasStage("bronze");
```

Asks both scopes, which is what "does this player have this stage" usually means. If you are
coming from GameStages, this is the call you already know.

## Reacting to stage changes

```zenscript
import mods.historystages.HistoryStages;

HistoryStages.onStageUnlocked(event => {
    println("Stage unlocked: " + event.stage + " — " + event.displayName);
});

HistoryStages.onStageLocked(event => { … });

HistoryStages.onIndividualStageUnlocked(event => {
    // event.player may be null when that player is offline
    println(event.stage + " for " + event.player.name);
});

HistoryStages.onIndividualStageLocked(event => { … });
```

Listeners are dropped and re-registered on every `/reload`, so a reloaded script is subscribed
once rather than twice.
