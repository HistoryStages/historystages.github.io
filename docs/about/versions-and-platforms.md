---
title: Versions & Platforms
description: "Which mod version runs on NeoForge, Forge and Fabric, and which features each of them has."
sidebar_position: 1
---

# Versions & Platforms

History Stages runs on three mod loaders. New features land on NeoForge first; the other two
follow when they follow.

| Loader | Minecraft | Line it is on |
| :--- | :--- | :--- |
| **NeoForge** | 1.21.1 | 6.1.x |
| **Forge** | 1.20.1 | 6.0.x — the 6.1 port is not out yet |
| **Fabric** | 1.21.1 | 6.0.x — the 6.1 port is not out yet |

The 1.19.X builds are no longer updated.

The column on the right is the **line**, not the exact build — which documentation stand applies to
you. The exact patch version moves with every release, so it is deliberately not written down here
where it would quietly go stale; the download pages have it:
[CurseForge](https://www.curseforge.com/minecraft/mc-mods/history-stages) ·
[Modrinth](https://modrinth.com/mod/history-stages) ·
[GitHub Releases](https://github.com/Flix100000/History-Stages/releases).

These pages describe 6.1.x, which is NeoForge only for now. **On Forge 1.20.1 or Fabric 1.21.1,
pick 6.0.x in the version picker in the top bar.** That stand also lists what those two builds do
differently from NeoForge.

## What 6.1 added

Everything below is NeoForge only until the Forge and Fabric ports are out.

- [Interchangeable stages](/wiki/stage-file/interchangeable-stages) — several stages that lock the
  same thing, where any one of them is enough.
- [Logic blocks](/wiki/stage-file/logic-blocks) — a stage blocked, hidden, cheaper or revoked
  depending on other stages.
- [Relocking](/wiki/stage-file/relocking) — the "While" mode and lock triggers, so a stage can
  close again.
- [Team sharing](/wiki/start-here/global-vs-individual#sharing-with-a-team) — individual stages
  shared inside an FTB Teams party.
- [Enchantments & Effects](/wiki/locking/items-and-recipes/enchantments-and-effects) — two new lock
  categories.
- [Disguises](/wiki/locking/items-and-recipes/disguises) — locked items and blocks that look like
  something else.
- [Fixed lock actions](/wiki/locking/items-and-recipes/unlock-actions#fixing-actions-for-a-whole-stage)
  for a whole stage, [scroll shelves](/wiki/in-game-tools/research/scrolls#scroll-shelves),
  [recipes using an item](/wiki/locking/items-and-recipes/recipes#recipes-using-an-item), and a
  reworked [stage graph editor](/wiki/in-game-tools/stage-graph).
- A much larger [addon API](/api/).

The zone map lost its 3D view in 6.1. It is the top-down view on every loader now.

## How this wiki is versioned

The version picker cuts by **mod version, not by Minecraft version**. Eight stands exist: the living
6.1.x tree, 6.0.x, and six older archives, 5.6.x down to 5.0.x. 6.0.x is still the current stand
for Forge and Fabric and stays findable in search engines; the 5.x archives do not.

It does not go back further than 5.0.x because the wiki itself only started in April 2026. 5.1 never
got a documentation pass of its own and is covered by the 5.0.x stand.

**The archives are word-for-word from their day.** Mistakes that were in them at the time are still
in them — a snapshot that gets corrected afterwards is no longer a snapshot. Two things were taken
out: the claim that the wiki is "always aligned with the latest version", which becomes a lie in an
archive, and the addon API pages in 5.6.x, which described an interface that did not exist yet on
that version.

The **API** tab is not versioned. It describes the current addon interface. The base of it exists
on all three loaders from 6.0.0 onwards; the parts added in 6.1.0 say so at the top of their
section and are NeoForge only until the ports are out.

## Porting to a loader or version that is not listed

Allowed under conditions. → [Porting & Permissions](/wiki/about/porting)

## Downloads

[CurseForge](https://www.curseforge.com/minecraft/mc-mods/history-stages) ·
[Modrinth](https://modrinth.com/mod/history-stages) ·
[GitHub Releases](https://github.com/Flix100000/History-Stages/releases)
