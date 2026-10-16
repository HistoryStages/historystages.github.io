---
title: Items, Tags & Mods
description: "Gating single items, whole item tags, every item from a mod, and carving exceptions back out of a mod lock."
sidebar_position: 1
---

# Items, Tags & Mods

Four fields gate items, from one id to an entire mod. They all behave the same way once an item
matches — the difference is only how wide the net is.

```json
{
  "items": ["minecraft:iron_ingot"],
  "tags": ["c:ores/iron"],
  "mods": ["create"],
  "mod_exceptions": ["create:andesite_alloy"]
}
```

## In the editor

Four tabs of their own on a stage: **Items**, **Tags**, **Mods** and **Exceptions**. Each has a
search bar over the live registry, a button to pick straight out of your own inventory, and a
multi-select mode with a **Selected** tab for adding many at once.

**Everything you do to an entry that is already in the list is a right-click.** The context menu
that opens holds:

| | |
| :--- | :--- |
| **Edit NBT** | [NBT and data component criteria](/wiki/6.0.x/locking/items-and-recipes/nbt-and-components). |
| **Lock Actions** | [Narrow the entry to specific interactions](/wiki/6.0.x/locking/items-and-recipes/unlock-actions). |
| **Text Override** | This entry's own [hidden-display texts](/wiki/6.0.x/stage-file/hidden-display#overriding-it-for-a-single-entry). |
| **Copy ID** | The registry id, onto the clipboard. |
| **Remove** | Takes it out of the stage. |

Which of them appear depends on the tab — a mod entry has no NBT to edit — and an installed addon
can add its own further down, above Copy ID and Remove.

## What "locked" means

By default a matched item is gated for **everything**: using it, attacking with it, wearing it,
picking it up, placing it, breaking blocks with it, opening its GUI, appearing in loot, showing its
recipes, and trading it. Narrowing that down to a single interaction is what
[`unlock_actions`](/wiki/6.0.x/locking/items-and-recipes/unlock-actions) is for.

A locked **block** is a slightly bigger deal than a locked item, because it is already in the world:

- Breaking it is 20× slower and it drops nothing (`lockedBlockBreakSpeedMultiplier`).
- Its GUI will not open — a chest, a furnace, a machine.
- Armour stands and item frames holding a locked item cannot be interacted with or broken either.

Each of those is a switch in
[gameplay.toml](/wiki/6.0.x/server/config-files/gameplay-toml#gameplay), and each has a per-player twin
under `[individual_stages]`.

## Items

Item ids, either plain or as objects:

```json
"items": [
  "minecraft:diamond_pickaxe",
  {
    "id": "minecraft:diamond_sword",
    "unlock_actions": ["pickup", "equip"]
  }
]
```

The object form takes [`nbt` / `components`
criteria](/wiki/6.0.x/locking/items-and-recipes/nbt-and-components),
[`unlock_actions`](/wiki/6.0.x/locking/items-and-recipes/unlock-actions), and per-entry `name_text` /
`tooltip_text` overrides for [hidden display](/wiki/6.0.x/stage-file/hidden-display).

## Tags

Item tags gate every member at once. Entries take the same object form as items:

```json
"tags": [
  "c:ores/iron",
  {
    "id": "c:ingots/iron",
    "unlock_actions": ["pickup"]
  }
]
```

A tag is resolved live, so items another mod adds to `c:ores/iron` later are gated too, without the
stage file changing. That is usually the point — and occasionally the surprise, when a newly
installed mod quietly widens a lock nobody edited.

:::note
Tag entries carrying an NBT criterion are skipped wherever no actual item stack exists to match
against — a loot-table check without context, for instance. Plain tag entries are unaffected. →
[NBT & Data Components](/wiki/6.0.x/locking/items-and-recipes/nbt-and-components)
:::

## Mods

A mod id gates **every item that mod registers**:

```json
"mods": ["mekanism"]
```

This is the widest net there is, and it is resolved from the registry rather than from a list, so it
also covers items added by a later update of that mod.

## Mod exceptions

`mod_exceptions` carves items back out of a `mods` lock — the usual shape of "gate the whole tech
mod, but leave the starter component craftable so players can get in at all".

```json
{
  "mods": ["create"],
  "mod_exceptions": [
    "create:andesite_alloy",
    { "id": "create:wrench", "nbt": { "components": { "minecraft:damage": 0 } } }
  ]
}
```

Exceptions accept the same NBT criteria as items. They only undo a `mods` lock — an item listed
explicitly in `items` stays locked no matter what `mod_exceptions` says, and an exception is the one
category that never takes part in a
[dual-phase lock](/wiki/6.0.x/start-here/global-vs-individual#dual-phase-when-both-lists-target-the-same-content),
because it carves holes rather than locking.

## Enchantments

**There is no enchantment field.** An enchantment is gated by writing an `items` entry for
`minecraft:enchanted_book` whose NBT carries `StoredEnchantments` — and the mod then reads that same
entry when deciding whether an anvil or an enchanting table may apply the enchantment at all:

```json
"items": [
  {
    "id": "minecraft:enchanted_book",
    "nbt": {
      "StoredEnchantments": [
        { "id": "minecraft:mending" },
        { "id": "minecraft:sharpness", "lvl": "4-5" },
        { "id": "minecraft:fortune", "lvl": 3 }
      ]
    }
  }
]
```

`lvl` decides how much of the enchantment is caught:

| `lvl` | Gated |
| :--- | :--- |
| left out | every level |
| a number — `3` | that exact level |
| a range string — `"4-5"` | that range, inclusive |

So the entry above gates Mending entirely, Sharpness only at IV and V, and Fortune only at III.
Sharpness III stays applicable.

Two details this depends on: the item id has to be exactly `minecraft:enchanted_book`, and the
criterion has to sit under the legacy `StoredEnchantments` key rather than under `components` — the
enchantment check reads that one shape and nothing else. The switch for whether anvils and
enchanting tables honour it is `lockEnchanting` in
[gameplay.toml](/wiki/6.0.x/server/config-files/gameplay-toml#gameplay), with a per-player twin under
`[individual_stages]`.

## Global or individual?

Both. All four fields work in either scope — but what they *do* differs sharply: a global stage
removes the recipe from the game, while an individual stage leaves the recipe alone and refuses to
let the item reach that player's inventory. That difference catches almost everybody once. →
[Global vs Individual](/wiki/6.0.x/start-here/global-vs-individual#global-and-individual-lock-at-different-layers)

## See also

- [Unlock Actions](/wiki/6.0.x/locking/items-and-recipes/unlock-actions) — gate one interaction instead of
  all of them.
- [NBT & Data Components](/wiki/6.0.x/locking/items-and-recipes/nbt-and-components) — gate only the items
  that match a criterion.
- [Recipes](/wiki/6.0.x/locking/items-and-recipes/recipes) — gating the recipe rather than the item.
- [Fluids](/wiki/6.0.x/locking/items-and-recipes/fluids) — one entry for every bucket and tank that holds
  a fluid.
- [Hidden Display](/wiki/6.0.x/stage-file/hidden-display) — what locked players see instead.
