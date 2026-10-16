---
title: Unlock Actions
description: "Narrowing a lock to single interactions, so a locked item can still be carried, crafted or traded while the rest stays gated."
sidebar_position: 3
---

# Unlock Actions

By default, every entry in `items`, `tags` and `mods` blocks **all** interactions with the matching
content. `unlock_actions` narrows that down: it lists the interactions that stay available while the
stage is still locked.

```json
{
  "items": [
    "minecraft:diamond_pickaxe",
    {
      "id": "minecraft:diamond_sword",
      "unlock_actions": ["pickup", "equip"]
    }
  ],
  "tags": [
    {
      "id": "c:ingots/iron",
      "unlock_actions": ["pickup"]
    }
  ]
}
```

The diamond pickaxe stays fully locked. The diamond sword can be picked up and worn, but not swung,
crafted with, or traded. Iron ingots from the tag can be picked up and nothing else.

:::danger[The list says what stays free]
`unlock_actions` is not a list of what is locked — it is a list of what is **not** locked. Every
action you leave out stays blocked. A plain string entry, or an object without `unlock_actions`,
locks everything.
:::

## In the editor

Not a tab of its own — it hangs off an entry that is already in the list. **Right-click the entry**
and pick **Lock Actions** from the context menu; the popup that opens has one tick box per action,
labelled as in the table below.

Entity interaction entries have their own version of the same popup under **Interaction Actions**,
and fluid rows use the shorter fluid vocabulary.

## The actions

| Action | Editor label | What it covers |
| :--- | :--- | :--- |
| `use` | Use | Right-click use — food, a bow, activating a tool. |
| `attack` | Attack | Attacking entities with it. |
| `equip` | Equip | Wearing it in an armour or offhand slot. |
| `pickup` | Pickup | Taking it — off the ground, out of a container. |
| `place` | Place | Placing it as a block, or using it on a block. |
| `break` | Break | Breaking blocks with it. |
| `gui` | GUI | Opening the block's GUI. |
| `loot` | Loot | Appearing in container loot and mob drops. |
| `recipe` | Show in JEI / EMI | Its recipes in the recipe browser. |
| `trade` | Trade | Buying or selling it at a merchant. |
| `icon` | Icon | The padlock overlay drawn on the slot. |

[Fluids](/wiki/6.0.x/locking/items-and-recipes/fluids) use a shorter vocabulary of their own — seven
actions, including one (`ingredient`) that items do not have.

## `place` and `use` are not the same thing

This pair catches people out. `place` gates putting the item down as a block. `use` gates
right-click usage — opening a GUI, drinking a potion, activating a tool — and does **not** cover
block placement.

Locking `use` alone will not stop a placeable block from being placed. If the point is that the
block must not go into the world, `place` has to be gated.

## `trade` changed the meaning of existing files

:::warning[Added in 6.0, and it reaches backwards]
`trade` gates buying or selling the item at any merchant, wherever that item turns up. Because
`unlock_actions` stores the actions that stay *free*, an action nobody could have listed before
counts as locked in every file written earlier: an entry someone narrowed to `["use"]` gates trading
as well from this version onwards.

That is the intended reading — a narrowed entry means "only this" — but it is worth knowing before a
pack updates. There is deliberately no migration for it.
:::

Two smaller consequences travel with it:

- The **result slot of a trade window** is now judged by `trade` rather than by `pickup`. An entry
  that allowed pickup in order to allow trading has to say `trade` instead.
- The extra action costs room in the stage's network payload. A stage made entirely of narrowed item
  entries now holds about 544 of them rather than 581. →
  [Stage Graph and sync limits](/wiki/6.0.x/about/getting-help#a-stage-is-too-large-to-send)

## Two surfaces deliberately ignore the list

An item whose entry narrows the lock to, say, `recipe` alone still shows as `???` in the inventory
when the stage has [hidden display](/wiki/6.0.x/stage-file/hidden-display) on, and still carries the
"requires stage X" tooltip.

Both of those describe *that the item belongs to a stage*, which stays true however narrow the gate
is. Everything that actually refuses an action — containers, equip slots, item frames, anvils, the
recipe browser — reads the list.

## The legacy spelling

`lock_actions`, which listed the locked actions directly rather than the free ones, is still read so
old files keep working. New entries are always written as `unlock_actions`, and a file saved through
the editor is converted.

## See also

- [Items, Tags & Mods](/wiki/6.0.x/locking/items-and-recipes/items-tags-mods) — the fields this attaches
  to.
- [Fluids](/wiki/6.0.x/locking/items-and-recipes/fluids) — the seven-action fluid vocabulary.
- [Entities & Spawns](/wiki/6.0.x/locking/creatures-and-trade/entities-and-spawns#interactionlock) —
  `interactionlock` uses the same "what stays free" shape with its own set of actions.
- [Merchant Trades](/wiki/6.0.x/locking/creatures-and-trade/merchant-trades) — where `trades.professions`
  deliberately does the opposite and lists what *is* gated.
