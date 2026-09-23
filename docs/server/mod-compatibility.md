---
title: Mod Compatibility
description: "The mods History Stages recognises and what each integration does — recipe viewers, FTB Quests, Jade, Curios, and the required Lootr."
sidebar_position: 4
---

# Mod Compatibility

History Stages recognises a number of widely used mods and adjusts its behaviour when they are
present. **Nothing here needs configuring** — install the mod and the integration is on.

One of them is not optional: **[Lootr](https://modrinth.com/mod/lootr) is a required dependency**
and History Stages will not load without it. →
[Why](/wiki/locking/items-and-recipes/loot#chest-loot-goes-through-lootr)

## Recipe viewers — JEI and EMI

The two are at feature parity; install either.

Locked recipes get a padlock overlay rather than disappearing, so players can see that progression
exists rather than wondering where a recipe went. Locked items carry the same padlock in
inventories and in the ingredient panel.

Two settings change that to outright hiding: `hideLockedItemsInJei` removes locked items from the
ingredient panel, `hideLockedRecipesInJei` hides recipes whose output is locked. →
[Recipes](/wiki/locking/items-and-recipes/recipes#what-players-see)

[Research Booster](/wiki/in-game-tools/research/pedestal#boosters) blocks are registered as their
own recipe category, so players can look up which blocks speed research up and by how much.

## FTB Quests

History Stages adds native **History Stage** task and reward types straight into the FTB Quests
editor.

Both pick their target through a searchable stage picker rather than a typed id, which matters in a
pack with a hundred stages. The quest book shows each stage's configured display name and its own
icon.

Tasks are event-driven and complete themselves when the stage unlocks. A `negate` flag inverts the
condition, so the task completes when the stage is *locked* instead. Task progress resets by itself
if the stage is relocked.

Rewards can either unlock or relock a stage — which, combined with
[`external` mode](/wiki/stage-file/stage-modes#external), is the usual way to put progression
entirely in the quest book's hands.

## Jade

When a player looks at a block, entity, armour stand or item frame that History Stages has locked,
Jade names the stage it needs. → [`[jade]`](/wiki/server/config-files/visual-toml#jade-requires-jade)

## Lootr — required

Gives every player their own view of a container, which is the only reason per-player loot filtering
is possible at all. A vanilla container is shared: one roll, whoever opens it first takes what is
there. →  [Loot](/wiki/locking/items-and-recipes/loot)

## Spell Engine and Better Combat

An item that is locked for a player is treated as **inert**: it deals no spell damage and cannot
start a Better Combat attack.

Without this, either mod would be a way around the ordinary use-lock — the item never goes through
the vanilla use path that History Stages hooks, so a locked weapon would keep working as a weapon.

## Curios and Accessories

Both extend item locking into accessory slots, so a locked item cannot be equipped as a trinket,
ring or belt.

**Curios** is Forge and NeoForge only; it does not exist for Fabric. **Accessories** registers a
`CanEquipCallback` doing the same job, with the same actionbar feedback used elsewhere, and also
covers vanilla armour slots rendered through its own container UI.

## KubeJS and CraftTweaker

Scripts can read stage state, change it, and react when it changes. They cannot *define* stages or
decide what a stage locks — that stays in the editor and the stage files.

This works on NeoForge and Forge only. Neither mod has a Fabric build for 1.21.1, so the Fabric
build of History Stages has no script bridge.

Big enough to have their own pages: → [Scripting](/wiki/server/scripting)

## Fluid locks and other mods' tanks

A [fluid lock](/wiki/locking/items-and-recipes/fluids) reaches further into other mods than most lock types, so it is worth knowing where it stops.

**What it does reach:** any item that reports what it is carrying. That is the vanilla bucket, every modded bucket, and every filled tank item in the pack, without a single item ID being listed. It also reaches the recipes — gating a fluid takes every recipe producing or consuming it out of crafting and out of the recipe browser, including recipes belonging to other mods' machines.

**What it does not reach:**

- **Pumps, pipes and placed tanks.** A player who already has the fluid in a tank can keep moving it. Gating that would mean taking their fluid interface away from other mods' blocks, which crashes inside foreign code and cannot be caught from outside. In practice it rarely matters, because with the recipes and the buckets gone there is no way to fill the first tank.
- **Foreign display names.** A name or tooltip override on a fluid entry is applied to the container item, so another mod's tank GUI — and Jade's tank readout — keep showing the fluid's real name.

## Making your own mod work with History Stages

Writing a mod rather than a pack? Two starting points:

- **[Stage State & Events](/api/stage-state-and-events)** — read and change stage state, and react when
  it changes. This is what you want if your mod only needs to *know* about stages.
- **[Addon Development](/api/addon-development)** — register your own gated content, requirements,
  auto-triggers, per-stage settings and config sections, each with a native tab in the in-game
  editor. All three loaders, 6.0.0 and up.
