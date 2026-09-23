---
title: Versions & Platforms
description: "Which mod version runs on NeoForge, Forge and Fabric, and which features each of them has."
sidebar_position: 1
---

# Versions & Platforms

History Stages runs on three mod loaders, and all three are on the same line. New features land on
NeoForge first; the other two follow when they follow.

| Loader | Minecraft | Line it is on |
| :--- | :--- | :--- |
| **NeoForge** | 1.21.1 | 6.0.x |
| **Forge** | 1.20.1 | 6.0.x — everything from 6.0.0 and 6.0.1, with the differences below |
| **Fabric** | 1.21.1 | 6.0.x — everything from 6.0.0 and 6.0.1, with the differences below |

The 1.19.X builds are no longer updated.

The column on the right is the **line**, not the exact build — which documentation stand applies to
you. The exact patch version moves with every release, so it is deliberately not written down here
where it would quietly go stale; the download pages have it:
[CurseForge](https://www.curseforge.com/minecraft/mc-mods/history-stages) ·
[Modrinth](https://modrinth.com/mod/history-stages) ·
[GitHub Releases](https://github.com/Flix100000/History-Stages/releases).

These pages describe 6.0.x. Still running an older build? Pick its line in the version picker in
the top bar.

## What Forge 1.20.1 does differently

The 1.20.1 build carries the whole 6.0 feature set. Four things behave differently, because 1.20.1
itself does:

- **The zone map is the top-down view only.** The tilted 3D view is not part of this build. Every
  other part of the zone editor is the same.
- **A gated fluid is refused at the vanilla water and lava cauldrons.** A modded cauldron is not
  recognised — 1.20.1 has no registry to look one up in.
- **Once a KubeJS script adds recipes, KubeJS ends the recipe load early**, so the report about
  locked recipes that are not loaded does not run in those packs. The locks themselves are
  unaffected.
- **MixinExtras is bundled inside the jar**, because Forge 1.20.1 does not ship it. There is
  nothing extra to install.

## What Fabric 1.21.1 does differently

The Fabric build carries the whole 6.0 feature set too. Same Minecraft version as NeoForge, so the
differences come from the loader and from which mods exist for it:

- **The zone map is the top-down view only**, as on Forge. The rest of the zone editor is the same.
- **There is no scripting.** KubeJS has no Fabric build for 1.21.1 and CraftTweaker has none at
  all, so there is nothing for a script to talk to. Reading, changing and reacting to stage state
  from code goes through the [API](/api/) instead. → [Scripting](/wiki/server/scripting)
- **Equip locks cover Accessories instead of Curios.** Curios does not exist on Fabric. →
  [Mod Compatibility](/wiki/server/mod-compatibility#curios-and-accessories)
- **An addon registers through entrypoints in its `fabric.mod.json`**, not through a mod bus. What
  it can register is the same. → [Addon Development](/api/addon-development#on-fabric)
- **Settings from 5.2 are not carried over.** The Fabric 5.2 build kept them in a `config.json`
  that 6.0 does not read. → [Upgrading from 5.x](/wiki/server/upgrading-from-5x#coming-from-fabric-52)

One thing works better here than on Forge 1.20.1: a gated fluid is refused at modded cauldrons as
well, not only at the vanilla water and lava ones.

## How this wiki is versioned

The version picker cuts by **mod version, not by Minecraft version**. Seven stands exist: the living
6.0.x tree plus six frozen archives, 5.6.x down to 5.0.x.

It does not go back further than 5.0.x because the wiki itself only started in April 2026. 5.1 never
got a documentation pass of its own and is covered by the 5.0.x stand.

**The archives are word-for-word from their day.** Mistakes that were in them at the time are still
in them — a snapshot that gets corrected afterwards is no longer a snapshot. Two things were taken
out: the claim that the wiki is "always aligned with the latest version", which becomes a lie in an
archive, and the addon API pages in 5.6.x, which described an interface that did not exist yet on
that version.

The **API** tab is not versioned. It describes the current addon interface, which exists on all
three loaders from 6.0.0 onwards.

## Porting to a loader or version that is not listed

Allowed under conditions. → [Porting & Permissions](/wiki/about/porting)

## Downloads

[CurseForge](https://www.curseforge.com/minecraft/mc-mods/history-stages) ·
[Modrinth](https://modrinth.com/mod/history-stages) ·
[GitHub Releases](https://github.com/Flix100000/History-Stages/releases)
