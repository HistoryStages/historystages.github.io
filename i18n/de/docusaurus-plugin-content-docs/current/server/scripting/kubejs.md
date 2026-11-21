---
title: KubeJS
description: "Den Stage-Zustand lesen, Stages freischalten und wieder sperren und auf Stage-Events reagieren, aus KubeJS."
sidebar_position: 1
---

Die KubeJS-Seite der Skript-Anbindung. → [Skripte im Überblick](/wiki/server/scripting) erklärt, was ein
Skript kann und was nicht, und hat die Tabelle vor/ab 6.0.0. →
[Skripte: CraftTweaker](/wiki/server/scripting/crafttweaker) ist das Gegenstück in ZenScript, mit
denselben Möglichkeiten.

## Auf Stage-Änderungen reagieren {/* #reacting-to-stage-changes */}

In `server_scripts`:

```javascript
HistoryStagesEvents.unlocked(event => {
    console.log(event.stage + ' — ' + event.displayName)
})

// Nur diese eine Stage. Das erste Argument ist optional.
HistoryStagesEvents.unlocked('bronze', event => {
    server.runCommandSilent('say The Bronze Age begins')
})

HistoryStagesEvents.locked(event => { … })

HistoryStagesEvents.individualUnlocked(event => {
    // event.player kann null sein: Eine individuelle Stage kann durch einen Timer
    // wieder gesperrt werden, während der Spieler offline ist.
    if (event.player) event.player.tell('You now know ' + event.displayName)
})

HistoryStagesEvents.individualLocked(event => { … })
```

Alle vier lösen bei **jedem** Weg aus, der eine Stage ändert: Editor im Spiel, Forschungspodest,
`/history stage unlock`, ein Auto-Auslöser, eine FTB-Quests-Belohnung, der API-Aufruf einer anderen Mod.
Darunter liegt ein einziger Code-Weg, und die Events sitzen darin.

## Zustand lesen und ändern {/* #reading-and-changing-state */}

```javascript
// Lesen
HistoryStages.isUnlocked('bronze')                  // globale Stage, für die ganze Welt
HistoryStages.isUnlockedFor(player, 'tutorial')     // individuelle Stage, dieser Spieler
HistoryStages.hasStage(player, 'bronze')            // beide Arten, je nachdem, wozu die ID gehört

HistoryStages.stages()                              // jede angelegte globale Stage-ID
HistoryStages.individualStages()                    // jede angelegte individuelle Stage-ID
HistoryStages.unlockedStages()                      // die globalen, die gerade offen sind
HistoryStages.unlockedStagesFor(player)             // die individuellen dieses Spielers
HistoryStages.categories()                          // jede gültige Sperr-Kategorie-ID

// Ändern: gibt true zurück, wenn sich tatsächlich etwas geändert hat
HistoryStages.unlock('bronze')
HistoryStages.lock('bronze')
HistoryStages.unlockFor(player, 'tutorial')
HistoryStages.lockFor(player, 'tutorial')
```

`unlock` und Co. laufen über denselben Code wie Editor und Podest, also ist ein Freischalten per Skript
ein echtes Freischalten: Es wird gespeichert, an jeden Client übertragen, mit der eingestellten
Chat-Zeile, dem Sound und dem Toast angekündigt, es leert die Struktur- und Biom-Caches, lädt Rezepte neu
und löst die Events oben aus.

## Fragen, ob etwas gesperrt ist {/* #asking-whether-something-is-gated */}

```javascript
HistoryStages.isLocked('items', 'minecraft:diamond', player)
HistoryStages.isLocked('recipes', 'kubejs:crafting_shaped_7')   // kein Spieler: Rezepte sperren global
HistoryStages.missingStages('items', 'minecraft:diamond', player)   // was noch gebraucht wird
```

Das erste Argument ist eine **Sperr-Kategorie-ID**. Damit sperrst du deine eigene Maschine, deine eigene
GUI oder deinen eigenen Tooltip genauso, wie die Mod ihre eigenen Inhalte sperrt.

Kategorie-IDs haben einen Namespace. Die achtzehn eingebauten liegen unter `historystages:`, und den
darfst du weglassen: `'items'` und `'historystages:items'` bedeuten dasselbe, so wie eine Item-ID ohne
Namespace `minecraft:` bedeutet. Eine Kategorie, die eine **Addon-Mod** hinzufügt, muss voll ausgeschrieben
werden (`'hsdemo:relics'`), weil ein geratener Namespace an dem Tag kaputtginge, an dem zwei Addons
denselben kurzen Namen wählen.

`HistoryStages.categories()` listet, was tatsächlich angemeldet ist, voll ausgeschrieben:

```text
historystages:items          historystages:mods            historystages:recipes
historystages:tags           historystages:mod_exceptions  historystages:dimensions
historystages:structures     historystages:biomes          historystages:attacklock
historystages:spawnlock      historystages:interactionlock historystages:fluids
historystages:trades         historystages:trade_professions
historystages:trade_levels   historystages:zones
historystages:enchantments   historystages:effects
```

## Client-Skripte {/* #client-scripts */}

`client_scripts` bekommen ein schreibgeschütztes `HistoryStages`, das aus dem Zustand antwortet, den der
Client schon hat. Genau das willst du für einen Tooltip oder ein HUD-Element:

```javascript
HistoryStages.isUnlocked('bronze')
HistoryStages.isUnlockedIndividually('tutorial')
HistoryStages.hasStage('bronze')                    // beide Arten
```

Nichts, was den Zustand ändert, gibt es dort. `HistoryStages.unlock(...)` in einem Client-Skript
aufzurufen ist ein Fehler, kein stilles Nichtstun; du merkst es sofort, statt dich zu fragen, warum
nichts passiert ist.

`startup_scripts` bekommen gar nichts: Sie laufen, bevor es eine Welt gibt, also wäre jede Antwort zum
Stage-Zustand eine Lüge statt eines „Nein“.
