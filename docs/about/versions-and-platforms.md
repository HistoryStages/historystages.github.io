---
title: Versions & Platforms
description: "Which mod version runs on NeoForge, Forge and Fabric, and which features each of them has."
sidebar_position: 1
---

# Versions & Platforms

History Stages runs on three mod loaders. New features land on NeoForge 1.21.1 first; the others
follow when they follow.

| Loader | Minecraft | Line it is on |
| :--- | :--- | :--- |
| **NeoForge** | 1.21.1 | 6.2.x |
| **Forge** | 1.20.1 | 6.2.x — with the differences below |
| **Fabric** | 1.21.1 | 6.2.x — with the differences below |
| **NeoForge** and **Fabric** | 26.2 | 6.1.x — beta, with the differences below |

The 1.19.X builds are no longer updated.

The column on the right is the **line**, not the exact build — which documentation stand applies to
you. The exact patch version moves with every release, so it is deliberately not written down here
where it would quietly go stale; the download pages have it:
[CurseForge](https://www.curseforge.com/minecraft/mc-mods/history-stages) ·
[Modrinth](https://modrinth.com/mod/history-stages) ·
[GitHub Releases](https://github.com/Flix100000/History-Stages/releases).

These pages describe 6.2.x, which NeoForge 1.21.1, Forge 1.20.1 and Fabric 1.21.1 are on. On the
26.2 beta, or on an older build? Pick its line in the version picker in the top bar — 6.1.x for 26.2.

## What 6.2 added

- [Slots](/wiki/locking/items-and-recipes/slots) — inventory and container slots that stay shut,
  hidden or covered, until a stage opens.
- [Plants](/wiki/locking/world/plants) — crops and saplings that do not grow and refuse bonemeal.
- [NBT variants](/wiki/locking/items-and-recipes/nbt-and-components#several-variants-any-one-is-enough)
  — several criteria on one item, tag, exception or pedestal entry, where any one is enough.
- [Creatures by NBT](/wiki/locking/creatures-and-trade/entities-and-spawns#only-some-creatures-of-a-type)
  — attack and interaction locks that hit only some creatures of a type, and boats and minecarts
  in the interaction list.
- [Placeholders](/wiki/server/config-files/visual-toml#lock_messages) in the lock message
  overrides, and a [switch for the JEI/EMI lock overlay](/wiki/server/config-files/visual-toml#jei_hiding)
  with categories that are left alone.
- Entries of [mods that are no longer installed](/wiki/in-game-tools/in-game-editor#managing-stages)
  show red in the editor and can be removed in one go.
- A stage change [no longer freezes the server](/wiki/server/stage-change-reload)
  with a full datapack reload.
- [`SlotLockQuery`](/api/lock-categories#slots-slotlockquery) and NBT variants in the [addon API](/api/).

## What 6.1 added

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

## What Forge 1.20.1 does differently

The 1.20.1 build is on 6.2.x and carries the whole 6.2 feature set. Four things behave differently,
because 1.20.1 itself does:

- **A gated fluid is refused at the vanilla water and lava cauldrons.** A modded cauldron is not
  recognised — 1.20.1 has no registry to look one up in.
- **Once a KubeJS script adds recipes, KubeJS ends the recipe load early**, so the report about
  locked recipes that are not loaded does not run in those packs. The locks themselves are
  unaffected.
- **MixinExtras is bundled inside the jar**, because Forge 1.20.1 does not ship it. There is
  nothing extra to install.
- **The creature NBT editor offers no wolf variants**, because wolves only got variants in a later
  Minecraft version. Every other preset is there.

## What Fabric 1.21.1 does differently

The Fabric build is on 6.2.x too and carries the whole 6.2 feature set. Same Minecraft version as NeoForge, so the
differences come from the loader and from which mods exist for it:

- **There is no scripting.** KubeJS has no Fabric build for 1.21.1 and CraftTweaker has none at
  all, so there is nothing for a script to talk to. Reading, changing and reacting to stage state
  from code goes through the [API](/api/) instead. → [Scripting](/wiki/server/scripting)
- **Equip locks cover Accessories instead of Curios.** Curios does not exist on Fabric. →
  [Mod Compatibility](/wiki/server/mod-compatibility#curios-and-accessories)
- **An addon registers through entrypoints in its `fabric.mod.json`**, not through a mod bus. What
  it can register is the same. → [Addon Development](/api/addon-development#on-fabric)
- **Settings from 5.2 are not carried over.** The Fabric 5.2 build kept them in a `config.json`
  that 6.0 does not read. → [Upgrading from 5.x](/wiki/server/upgrading-from-5x#coming-from-fabric-52)
- **Slot locks reach other mods through the Fabric Transfer API.** Pipes, machines and "give"
  helpers that move items that way are refused at a locked slot. A modded slot that answers
  "may I put this here?" all by itself, without asking the slot it is built on, is not covered. →
  [Slots](/wiki/locking/items-and-recipes/slots)
- **The Ars Nouveau Drygmy fix is not here**, because Ars Nouveau has no Fabric build for 1.21.1.

One thing works better here than on Forge 1.20.1: a gated fluid is refused at modded cauldrons as
well, not only at the vanilla water and lava ones.

## What 26.2 does differently

26.2 is one build for NeoForge and Fabric. It is in beta and carries the 6.1 feature set, apart from
the integrations whose mods have no 26.2 version yet:

- **Architectury API is required** on both loaders, next to Lootr (and Fabric API on Fabric). →
  [Installation](/wiki/start-here/installation#what-you-need-alongside-it)
- **Not on 26.2 yet:** EMI, FTB Quests, FTB Teams, KubeJS, CraftTweaker, Accessories and the
  FastSuite fix. So there is no [team sharing](/wiki/start-here/global-vs-individual#sharing-with-a-team),
  no quest tasks or rewards and no [scripting](/wiki/server/scripting) on 26.2 for now. They come
  back once those mods update.
- **JEI** exists for 26.2 only as a beta, and History Stages is built against that beta.
- **Equip locks in accessory slots** work through Curios on NeoForge. On Fabric there is no
  accessory mod to hook into yet. → [Mod Compatibility](/wiki/server/mod-compatibility#curios-and-accessories)
- **Trades are data-pack only in 26.2.** A merchant that uses its own screen instead of the normal
  trade window is not filtered.
- **An addon registers through History Stages' own event bus** on both loaders, not through
  NeoForge's. → [Addon Development](/api/addon-development#on-minecraft-262)

## How this wiki is versioned

The version picker cuts by **mod version, not by Minecraft version**. Nine stands exist: the living
6.2.x tree and eight archives, 6.1.x down to 5.0.x. 6.1.x is still the live line on the 26.2
beta, so search engines see it as well as the living tree; the older archives are kept out of
them but are still in the version picker and in the search box.

It does not go back further than 5.0.x because the wiki itself only started in April 2026. 5.1 never
got a documentation pass of its own and is covered by the 5.0.x stand.

**The archives are word-for-word from their day.** Mistakes that were in them at the time are still
in them — a snapshot that gets corrected afterwards is no longer a snapshot. Two things were taken
out: the claim that the wiki is "always aligned with the latest version", which becomes a lie in an
archive, and the addon API pages in 5.6.x, which described an interface that did not exist yet on
that version.

The **API** tab is not versioned. It describes the current addon interface. The base of it exists
on every loader from 6.0.0 onwards; the parts added in 6.1.0 or 6.2.0 say so at the top of their
section.

## Porting to a loader or version that is not listed

Allowed under conditions. → [Porting & Permissions](/wiki/about/porting)

## Downloads

[CurseForge](https://www.curseforge.com/minecraft/mc-mods/history-stages) ·
[Modrinth](https://modrinth.com/mod/history-stages) ·
[GitHub Releases](https://github.com/Flix100000/History-Stages/releases)
