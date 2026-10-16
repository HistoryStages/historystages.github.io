---
title: KubeJS
description: "Reading stage state, unlocking and relocking stages, and reacting to stage events from KubeJS."
sidebar_position: 1
---

The KubeJS side of the scripting bridge. → [Scripting Overview](/wiki/server/scripting)
covers what a script can and cannot do, and the before/after-6.0.0 table. → [Scripting: CraftTweaker](/wiki/server/scripting/crafttweaker)
is the ZenScript equivalent, with the same capabilities.

## Reacting to stage changes

In `server_scripts`:

```javascript
HistoryStagesEvents.unlocked(event => {
    console.log(event.stage + ' — ' + event.displayName)
})

// Only this one stage. The first argument is optional.
HistoryStagesEvents.unlocked('bronze', event => {
    server.runCommandSilent('say The Bronze Age begins')
})

HistoryStagesEvents.locked(event => { … })

HistoryStagesEvents.individualUnlocked(event => {
    // event.player may be null — an individual stage can be relocked by a timer
    // while that player is offline.
    if (event.player) event.player.tell('You now know ' + event.displayName)
})

HistoryStagesEvents.individualLocked(event => { … })
```

All four fire from **every** path that changes a stage: the in-game editor, the Research Pedestal,
`/history stage unlock`, an auto-trigger, an FTB Quests reward, another mod's API call. There is
one code path underneath and the events sit in it.

## Reading and changing state

```javascript
// Reading
HistoryStages.isUnlocked('bronze')                  // global stage, world-wide
HistoryStages.isUnlockedFor(player, 'tutorial')     // individual stage, this player
HistoryStages.hasStage(player, 'bronze')            // either scope, whichever the id belongs to

HistoryStages.stages()                              // every defined global stage id
HistoryStages.individualStages()                    // every defined individual stage id
HistoryStages.unlockedStages()                      // the global ones currently open
HistoryStages.unlockedStagesFor(player)             // this player's individual ones
HistoryStages.categories()                          // every valid lock-category id

// Changing — returns true when something actually changed
HistoryStages.unlock('bronze')
HistoryStages.lock('bronze')
HistoryStages.unlockFor(player, 'tutorial')
HistoryStages.lockFor(player, 'tutorial')
```

`unlock` and friends go through the same code the editor and the pedestal use, so a script unlock
is a real unlock: it is saved, synced to every client, announced with the configured chat line,
sound and toast, it drops the structure and biome caches, it reloads recipes, and it fires the
events above.

## Asking whether something is gated

```javascript
HistoryStages.isLocked('items', 'minecraft:diamond', player)
HistoryStages.isLocked('recipes', 'kubejs:crafting_shaped_7')   // no player: recipes gate globally
HistoryStages.missingStages('items', 'minecraft:diamond', player)   // what is still needed
```

The first argument is a **lock category id**. Use it to gate your own machine, your own GUI or
your own tooltip the same way the mod gates its own content.

Category ids are namespaced. The eighteen built-in ones live under `historystages:`, and you may
leave that off — `'items'` and `'historystages:items'` mean the same thing, the way a bare item id
means `minecraft:`. A category added by an **addon mod** must be named in full (`'hsdemo:relics'`),
because guessing a namespace for it would break the day two addons pick the same short name.

`HistoryStages.categories()` lists what is actually registered, in full:

```text
historystages:items          historystages:mods            historystages:recipes
historystages:tags           historystages:mod_exceptions  historystages:dimensions
historystages:structures     historystages:biomes          historystages:attacklock
historystages:spawnlock      historystages:interactionlock historystages:fluids
historystages:trades         historystages:trade_professions
historystages:trade_levels   historystages:zones
historystages:enchantments   historystages:effects
```

## Client scripts

`client_scripts` get a read-only `HistoryStages` that answers from the state the client already
has, which is what you want for a tooltip or a HUD element:

```javascript
HistoryStages.isUnlocked('bronze')
HistoryStages.isUnlockedIndividually('tutorial')
HistoryStages.hasStage('bronze')                    // either scope
```

Nothing that changes state exists there. Calling `HistoryStages.unlock(...)` in a client script is
an error, not a silent no-op — you find out immediately instead of wondering why nothing happened.

`startup_scripts` get nothing at all: they run before a world exists, so every answer about stage
state would be a lie rather than a "no".
