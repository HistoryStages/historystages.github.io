---
title: CraftTweaker
description: "Den Stage-Zustand lesen, Stages freischalten und wieder sperren und auf Stage-Events reagieren, aus CraftTweaker."
sidebar_position: 2
---

Die CraftTweaker-Seite der Skript-Anbindung. → [Skripte im Überblick](/wiki/server/scripting) erklärt,
was ein Skript kann und was nicht, und hat die Tabelle vor/ab 6.0.0. →
[Skripte: KubeJS](/wiki/server/scripting/kubejs) ist das Gegenstück in JavaScript, mit denselben
Möglichkeiten.

```zenscript
import mods.historystages.HistoryStages;

// Lesen
HistoryStages.isUnlocked("bronze");
HistoryStages.isUnlockedFor(player, "tutorial");
HistoryStages.stages();
HistoryStages.unlockedStages();
HistoryStages.categories();

// Ändern
HistoryStages.unlock("bronze");
HistoryStages.lock("bronze");
HistoryStages.unlockFor(player, "tutorial");
HistoryStages.lockFor(player, "tutorial");

// Fragen, ob etwas gesperrt ist: Spieler und Namespace sind optional
HistoryStages.isLocked("items", "minecraft:diamond", player);
HistoryStages.isLocked("recipes", "crafttweaker:my_recipe");
HistoryStages.missingStages("historystages:items", "minecraft:diamond", player);
```

## Am Spieler {/* #on-the-player */}

```zenscript
player.hasStage("bronze");
```

Fragt beide Arten ab, und genau das meint „hat dieser Spieler diese Stage“ meistens. Wenn du von
GameStages kommst, kennst du diesen Aufruf schon.

## Auf Stage-Änderungen reagieren {/* #reacting-to-stage-changes */}

```zenscript
import mods.historystages.HistoryStages;

HistoryStages.onStageUnlocked(event => {
    println("Stage unlocked: " + event.stage + " — " + event.displayName);
});

HistoryStages.onStageLocked(event => { … });

HistoryStages.onIndividualStageUnlocked(event => {
    // event.player kann null sein, wenn der Spieler offline ist
    println(event.stage + " for " + event.player.name);
});

HistoryStages.onIndividualStageLocked(event => { … });
```

Listener werden bei jedem `/reload` verworfen und neu angemeldet, also ist ein neu geladenes Skript
einmal angemeldet und nicht zweimal.
