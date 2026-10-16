---
title: Fluids
description: "Gating a fluid rather than a bucket, so one entry covers every tank and container item in the pack — and every recipe that touches it."
sidebar_position: 5
---

# Fluids

The `fluids` block gates a fluid by its registry id:

```json
{
  "fluids": [
    "minecraft:lava",
    {
      "id": "minecraft:water",
      "unlock_actions": ["pickup"]
    }
  ]
}
```

**What is gated is the fluid, but what is recognised is the container.** The mod asks every item
stack what it is *carrying* rather than what it is, so a single `minecraft:lava` entry covers the
vanilla bucket, every modded bucket, and every filled tank item in the pack — without one item id
appearing in the stage file.

## In the editor

The **Fluids** tab, with a picker over every fluid in the pack. Each row carries a
`[Recipes: N]` badge saying how many recipes that entry would reach — worth a look before adding
one, since that number is frequently larger than people expect.

The seven actions below are set the same way item entries work — **right-click the row**, then
**Lock Actions**.

## The seven actions

A fluid's action vocabulary is shorter than an item's, and has one action items do not have:

`use` · `place` · `pickup` · `recipe` · `ingredient` · `loot` · `icon`

`equip`, `attack`, `break` and `gui` are not offered — a fluid is not worn, not swung, not mined,
and opens no GUI of its own.

:::danger[`recipe` and `ingredient` are different things, and both are on by default]
`recipe` gates the recipes that **produce** the fluid. `ingredient` gates the ones that **consume**
it. An entry without `unlock_actions` locks all seven, so gating `minecraft:water` takes every
recipe that touches water out of the pack — in a large modpack that is a four-digit number of
recipes.

This is the single most common surprise with fluid locks. Narrow the entry with `unlock_actions` if
that is not what you meant.
:::

It also answers a question that otherwise reads as a bug: **recipes disappear that nobody listed.**
Gating a fluid removes the recipes touching it from crafting and from the recipe browser, including
recipes inside other mods' machines.

The `[Recipes: N]` badge the editor shows on a fluid row exists so the reach of an entry is visible
*before* the decision rather than after it. The index behind that number is only built when a fluid
is actually gated or the editor is open, so a row with no badge means either "none" or "not counted
yet" — open the fluid tab once and it settles.

## Three deliberate limits

**There are no NBT criteria for fluids.** Of the four places the mod is asked about a fluid, only the
container item could ever supply one. A fluid block in the world and an entry in the recipe browser
carry nothing to match against, so a criterion would have done nothing on the two surfaces a pack
author checks first.

**Name and tooltip overrides reach the container, not the fluid.** A foreign tank's own GUI, and
Jade's tank readout, keep showing the real name.

**Pumps, pipes and placed tanks are not gated.** A player who already has lava in a tank can keep
moving it. Gating that would mean taking the fluid interface away from other mods' tanks, which
crashes inside foreign code and cannot be caught from outside. In practice it rarely shows, because
without recipes and without buckets nothing reaches the first tank. Fluids already lying in the
world also keep flowing — a lock governs what a player *does*, not what the world contains.

## Global or individual

Both, because a fluid is only ever asked about with a player at hand. The exception is the recipe
side: on an individual stage it reaches only the stations that know who is crafting, exactly as
[`recipes`](/wiki/6.0.x/locking/items-and-recipes/recipes) does. Furnaces, hoppers, autocrafters and most
modded machines answer globally or not at all, and the mod writes a warning into the load report
when an individual stage asks for something they cannot answer.

## The message players get

Taking a locked fluid out of the world produces the `fluidLocked` message, which a pack can override
under [`[lock_messages]`](/wiki/6.0.x/server/config-files/visual-toml#lock_messages).

## See also

- [Unlock Actions](/wiki/6.0.x/locking/items-and-recipes/unlock-actions) — the item vocabulary this one
  parallels.
- [Recipes](/wiki/6.0.x/locking/items-and-recipes/recipes) — where the `recipe` and `ingredient` actions
  land.
- [Mod Compatibility](/wiki/6.0.x/server/mod-compatibility#fluid-locks-and-other-mods-tanks) — how far a
  fluid lock reaches into other mods.
- [Complete Examples](/wiki/6.0.x/stage-file/complete-examples#fluids-trades-and-a-zone)
