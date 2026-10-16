---
title: Enchantments & Effects
description: "Locking books, gear and potions by the enchantments and potion effects they carry, and the enchanting table, anvil and brewing stand that make them."
sidebar_position: 6
---

# Enchantments & Effects

:::info[New in 6.1.0]
NeoForge only until the Forge and Fabric ports are out.
:::

Two lock categories that read **what a stack carries** instead of what it is. One entry for
Mending covers every book and every piece of gear with Mending on it, without listing a single item
id.

```json
{
  "enchantments": [
    "minecraft:mending",
    { "id": "minecraft:sharpness", "min_level": 4 }
  ],
  "effects": [
    { "id": "minecraft:strength", "min_level": 2 }
  ]
}
```

Mending is locked at every level, Sharpness from IV up, and Strength from level II up. Sharpness
III and plain Strength stay free.

## Enchantments

An enchantment entry locks:

- every enchanted book that stores the enchantment,
- every item that carries it — swords, armour, tools, anything,
- the **enchanting table** offering it, and the **anvil** producing it.

At the enchanting table a locked level is dropped from the offer; a lower free level of the same
enchantment can still come up, as vanilla rolls it. The anvil looks at the result rather than the
inputs, because it merges levels: if the result would carry a locked enchantment or level, the
result slot stays empty.

Modded and datapack enchantments are listed and matched like vanilla ones. Mods that keep their
bonuses outside the vanilla enchantment data, such as affix systems, are not enchantments to
Minecraft either and are not caught.

## Potion effects

An effect entry locks every potion item that carries the effect: potions, splash and lingering
potions, tipped arrows, and any modded item that stores potion contents the vanilla way. The
brewing stand refuses to start a brew whose result would carry it; nothing is consumed and no blaze
powder burns.

Food, beacons, suspicious stew and effects a mod applies on its own are not affected. An effect
entry never stops a player from **having** an effect, only from getting the potion.

:::warning[The brewing stand only checks global stages]
A brewing stand brews with nobody standing at it, so only a **global** stage can stop it. An
individual effect lock still locks the finished potion for that player — they cannot use or pick
it up — but the stand will brew it. The same goes for every machine that works without a player.
:::

## Levels

`min_level` is the first locked level. Left out, every level is locked.

| `min_level` | Sharpness I–III | Sharpness IV–V |
| :--- | :--- | :--- |
| left out | locked | locked |
| `4` | free | locked |

For effects, level I is the plain potion and level II the "Strength II" one.

*In the editor:* right-click the row → **Locked from level**. The dialog is a list, "Every level"
first, then "from level II" up to the enchantment's maximum. For effects it goes up to the highest
level any potion in the pack gives.

## Actions

Both categories take [`unlock_actions`](/wiki/locking/items-and-recipes/unlock-actions) like items
do, with the actions that make sense for them:

| Category | Item actions | Station actions |
| :--- | :--- | :--- |
| Enchantments | `use`, `attack`, `equip`, `pickup`, `trade`, `loot`, `recipe`, `icon` | `enchanting_table`, `anvil` |
| Effects | `use`, `pickup`, `trade`, `loot`, `recipe`, `icon` | `brew` |

Leaving every item action free keeps existing gear usable and only stops the stations from making
more:

```json
"enchantments": [
  {
    "id": "minecraft:mending",
    "unlock_actions": ["use", "attack", "equip", "pickup", "trade", "loot", "recipe", "icon"]
  }
]
```

## Sparing item types

**Applies to**, in the right-click menu, lists the item types an entry can reach. For an
enchantment that is the book plus every item it can go on, as the enchantment itself declares; for
an effect, every item that carries potions. Unticked types are spared:

```json
"effects": [
  { "id": "minecraft:poison", "excluded_item_types": ["minecraft:tipped_arrow"] }
]
```

Poison potions are locked, poison arrows are not. The brewing stand follows the same choice, and a
spared type is spared at the enchanting table and the anvil too.

## In the editor

The **Enchants & Effects** tab, with one section for enchantments and one for potion effects. Each
picker lists the live registry, so modded entries show up. Right-click a row for **Locked from
level**, **Lock Actions** and **Applies to**. All actions can also be
[fixed for the whole stage](/wiki/locking/items-and-recipes/unlock-actions#fixing-actions-for-a-whole-stage).

## How it relates to mod locks

A [mod lock](/wiki/locking/items-and-recipes/items-tags-mods#mods) also covers enchanted books and
potions whose enchantment or effect comes from that mod, and while it locks `recipe` the three
stations refuse them. Gear is still judged by its own id, so a vanilla sword carrying a modded
enchantment is not caught by the mod lock. Add an enchantment entry for that.

## The older way

Before 6.1.0 an enchantment was locked through an `minecraft:enchanted_book` item entry with a
`StoredEnchantments` criterion. Those entries still load and still do exactly what they did, books
and stations only. → [Items, Tags & Mods](/wiki/locking/items-and-recipes/items-tags-mods#enchantments)

## Global or individual?

Both. The only difference is the brewing stand, which only global stages can stop.

## See also

- [Unlock Actions](/wiki/locking/items-and-recipes/unlock-actions) — narrowing an entry to some
  interactions.
- [Items, Tags & Mods](/wiki/locking/items-and-recipes/items-tags-mods) — locking the item itself.
