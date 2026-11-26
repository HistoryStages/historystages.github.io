---
title: Troubleshooting
description: "Something does not behave the way you expected: the usual causes, sorted by what you see, each with the page that has the fix."
sidebar_position: 5
---

# Troubleshooting

Sorted by what you actually see. Each entry gives the usual cause in a sentence or two and links the
page that covers it properly.

:::tip[Look at the load report first]
Every startup and every `/history reload` writes a `debug-*.log` into `config/historystages/logs/`.
It lists the problems found in each stage file: ids that do not exist, duplicate stage ids, locks
written into a kind of stage that cannot hold them. A surprising share of the entries below show up
there by name. → [Getting Help](/wiki/about/getting-help#before-reporting-check-the-load-report)
:::

## Setting it up

**History Stages does not load.** Lootr is required, on Fabric Fabric API is too, and on 26.2
Architectury API is as well. → [Installation](/wiki/start-here/installation#what-you-need-alongside-it)

**Players cannot join the server.** Compare the `mods` folders. The server and every player need the
same History Stages and Lootr versions. →
[Putting It on a Server](/wiki/start-here/server-setup#4-give-every-player-the-same-mods)

**The editor button is missing from the pause menu.** It needs permission level 2. If you were made
operator while already on the server, close the pause menu and open it again. The button can also be
hidden with `showEditorButton`; `/history editor` still works then. →
[In-Game Editor](/wiki/in-game-tools/in-game-editor#opening-it)

## Editing stages

**A hand-edited stage file does nothing.** The folders are read at startup and on `/history reload`,
not whenever a file changes. Run the command. → [Commands](/wiki/server/commands)

**A hand edit vanished after saving in the editor.** The editor writes the whole file from the
version it still holds in memory. Run `/history reload` after a hand edit and before opening the
editor. → [In-Game Editor](/wiki/in-game-tools/in-game-editor#saving-and-multiplayer)

**A stage lost all its unlocks.** The file name is the stage id, and unlocks are stored against that
id. Renaming the file starts the stage over. →
[Where Stage Files Live](/wiki/start-here/where-stage-files-live)

**A stage file is skipped.** Two files with the same name anywhere inside `global/` (or inside
`individual/`) collide, and only the alphabetically first path is kept. →
[Global vs Individual](/wiki/start-here/global-vs-individual#pitfalls)

**The editor refuses to save a large stage.** A single stage has a size cap. Item tags instead of
hundreds of single ids are almost always the fix. → [Large Packs](/wiki/server/large-packs)

## Locks

**A lock is ignored entirely.** Check the kind of stage. Some locks only work in global stages and
some only in individual ones; the wrong one is skipped and named in the load report. →
[What can each one lock?](/wiki/start-here/global-vs-individual#what-can-each-one-lock)

**A locked block can still be placed.** The lock is narrowed with `unlock_actions`, and `use` does
not cover placing. Gate `place` as well. →
[Unlock Actions](/wiki/locking/items-and-recipes/unlock-actions#place-and-use-are-not-the-same-thing)

**Other players craft an item that is locked for me.** An item lock in an individual stage does not
touch the recipe; it bites when the locked player tries to obtain or use the item. →
[Global vs Individual](/wiki/start-here/global-vs-individual#pitfalls)

**A locked item vanished from a mob drop for the whole group.** Drops are judged against the player
who landed the kill. →
[Loot](/wiki/locking/items-and-recipes/loot#mob-drops-are-not-symmetrical-with-chest-loot)

**A player who joined later is still locked.** `/history individual unlock @a …` only reaches the
players online at that moment. → [Global vs Individual](/wiki/start-here/global-vs-individual#pitfalls)

## Recipes

**A recipe still crafts in a furnace or machine.** A recipe lock in an individual stage only reaches
stations that know who is using them. Furnaces, hoppers and autocrafters need a global stage. →
[Recipes](/wiki/locking/items-and-recipes/recipes#what-it-actually-does-depends-on-the-scope)

**A machine from another mod still offers a locked recipe after a stage change.** →
[Reloads After a Stage Change](/wiki/server/stage-change-reload#if-a-machine-still-offers-a-locked-recipe)

**Recipes disappeared that nobody listed.** Almost always a fluid entry. Without `unlock_actions` it
gates every recipe that uses the fluid, not only the ones that make it. →
[Fluids](/wiki/locking/items-and-recipes/fluids)

**A recipe id shows in red in the editor.** The recipe is not in the game any more. With KubeJS this
usually means a script was reordered and its numbered ids shifted. →
[Recipes](/wiki/locking/items-and-recipes/recipes#script-generated-recipes-move)

**A recipe is missing from the recipe picker.** A few kinds of recipe cannot be filed under an
output. → [In-Game Editor](/wiki/in-game-tools/in-game-editor#when-a-recipe-is-not-listed-at-all)

**JEI or EMI only shows a change after a restart.** Both build their recipe lists at startup. →
[Getting Help](/wiki/about/getting-help#common-first-suspects)

## Research

**Players have no way to get scrolls or pedestals.** History Stages ships no recipes for them on
purpose. → [Obtaining Scrolls & Pedestals](/wiki/in-game-tools/research/obtaining)

**The pedestal does not start.** Research waits for the **Start** button. If the button is disabled,
the side panel says why: a dependency that is not met yet, or a red box when the stage is blocked by
another stage. → [Research Pedestal](/wiki/in-game-tools/research/pedestal#handing-in-dependencies)

**The scroll shows a tier warning.** The stage asks for a different pedestal tier. →
[Research Pedestal](/wiki/in-game-tools/research/pedestal#tier-gating-per-stage)

## Still stuck?

[Getting Help & Reporting Bugs](/wiki/about/getting-help) says where to ask and what to bring along.
The short version: the `debug-*.log`, the stage file, and whether it is a global or an individual
stage.
