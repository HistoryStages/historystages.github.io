---
title: Reloads After a Stage Change
description: "Why unlocking a stage used to freeze the server, what History Stages does instead since 6.2.0, the measurements, and the three settings for packs that need them."
sidebar_position: 3.5
---

# Reloads After a Stage Change

A stage that locks recipes changes the recipe list when it opens or closes. History Stages itself
needs nothing for that, because it asks the lock every time a recipe is used. **Other mods** do: a
machine that keeps its own copy of the recipe list still offers a locked recipe until something
tells it to rebuild that copy.

Up to 6.1 that something was a full datapack reload, the same as typing `/reload`, on every stage
change that touched recipes. History Stages does a much smaller reload that only reaches
the mods that need it, and the server keeps running while it happens.<Since v="6.2.0" />

**Nothing has to be set for this.** It is the default. This page is for when you want to know what
happens, or when a mod in your pack does not pick up a change.

## Why the old way froze the server

A full reload does a lot that a stage change does not need. It reopens every resource pack (one per
mod), reads every recipe, loot table, tag and advancement file again, recompiles functions, saves
all players and sends tags and recipes to every client again. The server thread waits for all of it
to finish before it ticks again.

On a small pack nobody noticed. On a large one the whole server stood still for twenty seconds and
more on every unlock — mobs frozen, chat dead, nothing moving. On the client, JEI and EMI
then started over from scratch on top of that.

What a stage change actually needs is one thing: "mods, let go of the recipe lists you remembered."

## What 6.2.0 does instead

Every mod that reacts to a datapack reload registers a listener for it. History Stages remembers
those listeners at startup, and after a stage change re-runs **only them** — not Minecraft's own
loaders, no file parsing, no tags. The server keeps ticking while they work.

- **Only when it matters.** A stage change that does not change which recipes are locked sets off
  nothing at all.
- **Scripts are left out.** KubeJS and CraftTweaker scripts would run their recipe edits a second
  time on a recipe list they already edited, so they are never part of it.
- **JEI and EMI do not restart.** They are told which items to show or hide, and only those change.

## The measurements

Measured on a pack with 121 mods and about 11,800 recipes, NeoForge 1.21.1. "Standstill" is the
longest stretch without a single server tick. Each row locks and unlocks one stage; both numbers
are shown.

| Stage change | `FULL` (up to 6.1) | `BACKGROUND` | `TARGETED` (6.2 default) |
| :--- | :--- | :--- | :--- |
| 10 items, 28 recipes | 27.7 / 29.2 s | 14.1 / 14.4 s | 0.79 / 0.83 s |
| Dyed blocks, 231 recipes | 22.6 / 22.1 s | 13.1 / 16.4 s | 0.82 / 1.02 s |
| All of Mekanism, 308 recipes | 23.5 / 23.1 s | 14.1 / 15.0 s | 1.07 / 0.83 s |
| Worst case, 3,731 recipes | 22.2 / 24.0 s | 23.0 / 26.1 s | 0.88 / 1.19 s |

On top of `FULL`, JEI restarted on every client after every unlock, which took another 1.6–4.4
seconds. With the other two modes it did not restart once; showing and hiding the changed items
took 50–400 ms.

The whole targeted reload took 1.8–3.3 seconds from start to finish, but the server ticked all the
way through it.

**Where the rest of the time went.** The first targeted runs still stood still for about ten
seconds. Almost all of that was one listener, Modular Machinery Reborn's machine loader, which
re-reads its machine definitions and keeps no recipes at all. Leaving it out brought the standstill
under a second. That is what [`targetedReloadSkip`](#targetedreloadskip) is for, and that listener
is on it by default.

How big the gain is depends on the pack. A small one had little to win: on a 17-mod test setup the
standstill went from about 2 seconds to about 50 ms.

## The settings

All three live in the [`[advanced]`](/wiki/server/config-files/gameplay-toml#advanced) section of
gameplay.toml, and in the config editor under **Advanced**. The section is last on purpose; the
defaults are right for almost every pack.

### `reloadAfterStageChange`

| Value | What it does |
| :--- | :--- |
| `TARGETED` | The default. Re-runs only the mods' own reload listeners, server keeps running. |
| `BACKGROUND` | The full datapack reload, but the server keeps running while it loads. Every mod sees it exactly like `/reload`. Each mod still finishes its own part in one go, so there can be shorter hitches. |
| `FULL` | The full reload with the server waiting for it — exactly what every 6.x version before 6.2.0 did. Only as a fallback. |

### `targetedReloadSkip`

Listeners the targeted reload leaves out, by their full class name. Default: Modular Machinery
Reborn's machine loader and The Hordes' spawn tables.

Only put a listener here if it **loads its own data and keeps no recipes**. Leaving out one that
does keep recipes makes its machines miss stage changes until the next `/reload`.

### `slowListenerHintMs`

After every targeted reload, the server log names the listeners that held the server thread at
least this long (default 250 ms; `0` turns the hint off). The line looks like this:

```text
[HistoryStages/TargetedReload] Held the server thread longest: some.mod.SomeLoader [somemod] 1100 ms, ...
```

That is the list to check when stage changes still feel slow. Look up what each named mod loads
there. Machine definitions, spawn tables or quest data are candidates for `targetedReloadSkip`;
anything to do with recipes is not.

## If a machine still offers a locked recipe

1. Lock a stage that locks one of that machine's recipes, and check the machine.
2. If it still offers the recipe, set `reloadAfterStageChange` to `BACKGROUND` and try again.
3. If that fixes it, the mod rebuilds its recipe list somewhere the targeted reload does not reach.
   Please [report it](/wiki/about/getting-help) with the mod's name, so it can be covered.
4. `FULL` is the last resort and behaves exactly like 6.1.

## Which versions have this

6.2.0 on every loader: NeoForge 1.21.1, Forge 1.20.1, Fabric 1.21.1 and the 26.2 beta. →
[Versions & Platforms](/wiki/about/versions-and-platforms)

## See also

- [Large Packs](/wiki/server/large-packs) — what else grows with the size of a pack.
- [gameplay.toml](/wiki/server/config-files/gameplay-toml#advanced) — the settings at a glance.
- [Recipes](/wiki/locking/items-and-recipes/recipes) — what a recipe lock does in the first place.
