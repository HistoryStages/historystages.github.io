---
title: NBT & Data Components
description: "Gating only the stacks that match a criterion — an enchanted book with Sharpness, a potion with one effect, a modded item in one state."
sidebar_position: 2
---

# NBT & Data Components

A plain `items` entry gates every stack of that item. An entry with a criterion gates only the
stacks that match it — the enchanted books carrying Sharpness, the potions with a specific effect,
the mod item in a particular state.

```json
{
  "items": [
    {
      "id": "minecraft:enchanted_book",
      "nbt": {
        "StoredEnchantments": [
          { "id": "minecraft:sharpness", "lvl": "1-4" }
        ]
      }
    }
  ]
}
```

Only Sharpness I–IV books are locked here. Every other enchanted book behaves normally.

## In the editor

**Right-click the entry** in the Items, Tags or Exceptions list and pick **Edit NBT**. Criteria are
built as cards, with presets for the fields items commonly carry and a free-form dialog for anything
else, plus live validation.

The quickest route is not to build one at all: hold the item and **Ctrl-click** an inventory slot to
import that exact stack's state. Failing that, `/history debug nbt preset`, `/history debug nbt
custom` and `/history debug nbt components` print what the held item carries, ready to copy.

## Legacy NBT and data components

Minecraft 1.21 moved most item state out of free-form NBT and into **data components**. History
Stages reads both, and they live in the same `nbt` object — components go under a `components` key
alongside the older fields:

```json
{
  "items": [
    {
      "id": "minecraft:leather_chestplate",
      "nbt": {
        "components": {
          "minecraft:dyed_color": { "rgb": 16711680 }
        }
      }
    }
  ]
}
```

That is how a stage targets anything storing its state the modern way — dyed leather armour, food,
jukebox playables, custom components from other mods. → [Data component
format](https://minecraft.wiki/w/Data_component_format)

Which of the two a given item uses is not a guess: `/history debug nbt preset`,
`/history debug nbt custom` and `/history debug nbt components` print what the item in your hand
actually carries, ready to paste. → [Commands](/wiki/6.0.x/server/commands#debug-subcommands-client-side)

## Criteria on tag entries

`tags` entries take the same `nbt` and `components` criteria. When a criterion is present, only tag
members that also match it are locked — the rest of the tag stays open:

```json
{
  "tags": [
    "minecraft:swords",
    {
      "id": "minecraft:swords",
      "nbt": {
        "components": {
          "minecraft:enchantments": { "minecraft:sharpness": 5 }
        }
      }
    }
  ]
}
```

:::warning[A criterion needs a real item to look at]
Tag entries carrying an NBT criterion are **skipped in code paths where no item stack exists** — a
loot-table check without context, for example. There is nothing to match against, so the entry
cannot answer. Plain string tag entries are unaffected and still apply everywhere.
:::

## Enchantments are written this way too

There is no enchantment field in a stage file. Gating an enchantment means writing an
`minecraft:enchanted_book` entry with a `StoredEnchantments` criterion, which the mod then also
consults when an anvil or enchanting table is used. The `lvl` field takes a number, a `"min-max"`
range, or nothing at all for every level. →
[Items, Tags & Mods](/wiki/6.0.x/locking/items-and-recipes/items-tags-mods#enchantments)

## Building criteria without writing JSON

The [in-game editor](/wiki/6.0.x/in-game-tools/in-game-editor) has a visual NBT editor: criteria are built
as cards, with presets for the fields items commonly carry (enchantments, custom model data,
damage) and a free-form dialog for anything else. It writes exactly the JSON shown on this page, so
the two approaches mix.

## Where criteria are accepted

| Field | Criteria? |
| :--- | :--- |
| `items` | yes |
| `tags` | yes, with the caveat above |
| `mod_exceptions` | yes |
| `dependencies` → `items` | yes — an entry can demand a *specific* enchanted book at the pedestal |
| `trades` → `offers` | yes |
| `entities` → `interactionlock` → `lock_items` | yes |
| `fluids` | **no** — see below |
| `mods` | no, by nature: a mod id is not an item |

## Why fluids have no criteria

Of the four places the mod is asked about a fluid, only the container item could ever supply
something to match against. A fluid block in the world and an entry in the recipe browser carry
nothing — so a criterion would have done nothing on the two surfaces a pack author checks first. The
omission is deliberate rather than missing. →
[Fluids](/wiki/6.0.x/locking/items-and-recipes/fluids)

## See also

- [Items, Tags & Mods](/wiki/6.0.x/locking/items-and-recipes/items-tags-mods) — the fields these criteria
  attach to.
- [Unlock Actions](/wiki/6.0.x/locking/items-and-recipes/unlock-actions) — the other way to narrow an
  entry, by interaction rather than by item state.
- [Complete Examples](/wiki/6.0.x/stage-file/complete-examples#nbt-specific-locking)
