---
title: Merchant Trades
description: "Gating a single villager offer, a whole profession, or a merchant level, and what a player sees in the trade screen."
sidebar_position: 2
---

# Merchant Trades

The `trades` object holds three lists. They are asked separately and they stack: an offer survives
only if none of the three gates it.

```json
"trades": {
  "offers": [
    {
      "merchant": "minecraft:librarian",
      "level": 2,
      "gives": "minecraft:bookshelf",
      "takes": ["minecraft:emerald"]
    }
  ],
  "professions": [
    "minecraft:weaponsmith",
    { "id": "minecraft:librarian", "levels": [4, 5] }
  ],
  "levels": [5]
}
```

## In the editor

The **Trades** tab. Its picker lists **real offers** rather than every item in the game — pick a
profession and you see what that merchant actually trades, at which level, for what price. Most of
this block is written by clicking.

Professions sit on the same tab. The pack-wide level gate is a **right-click** on a profession
entry and then **Merchant Levels**.

## `offers` — one named trade

| Field | Meaning |
| :--- | :--- |
| `merchant` | The profession id, or the entity id for a merchant with no profession (`minecraft:wandering_trader`, or a merchant from another mod). |
| `level` | The merchant level the offer belongs to. Defaults to `1`. |
| `gives` | What the player receives. |
| `takes` | One or both price items. |
| `nbt` | Optional criterion, narrowing it the same way it does on an item entry. |

:::note[Amounts are deliberately not part of an offer]
A merchant rolls its own price and stack size, so an entry naming them would gate the same trade on
one villager and miss it on the next.
:::

The editor's trade picker lists **real offers** rather than every item in the game, so most of the
time this block is written by clicking rather than by hand.

## `professions` — a whole merchant

A bare id gates that profession at every level:

```json
"professions": ["minecraft:weaponsmith"]
```

The object form gates only the levels listed — `{"id": "minecraft:librarian", "levels": [4, 5]}`
leaves novice, apprentice and journeyman librarians trading normally.

**Merchants without a profession** are locked by their entity id in the same list. Vinery's
wandering winemaker has no villager profession, so `"vinery:wandering_winemaker"` goes in
`professions` and gates every offer it has. The server asks each such merchant for its offers once,
so they show up in the offer and profession pickers like villagers do. The wandering trader is
listed the same way.

:::warning[`levels` here lists the gated ones, not the free ones]
That is the opposite of [`unlock_actions`](/wiki/locking/items-and-recipes/unlock-actions), and it
is deliberate. The `levels` list at the top of `trades` already means "these levels are gated", and
one word meaning two opposite things inside one block is a trap for whoever edits the file by hand.
:::

## `levels` — one rank, every profession

A merchant level gated for *every* profession at once. This is the rule behind "until the Bronze Age
there are only novices", which would be tedious to repeat profession by profession.

```json
"levels": [4, 5]
```

Written as numbers; strings are accepted on the way in.

**A wandering trader always counts as level 1**, so gating level 1 hides every wandering trader as
well.

## Gating an item everywhere it is traded

That is a different question and is not written here. Use the
[`trade` action](/wiki/locking/items-and-recipes/unlock-actions) on an ordinary `items` entry —
it gates buying or selling that item at any merchant, wherever it turns up.

The three tools, side by side:

| Goal | Where it goes |
| :--- | :--- |
| One specific trade | `trades` → `offers` |
| A merchant, or a rank of merchant | `trades` → `professions` / `levels` |
| This item is not traded by anybody | the `trade` action on an `items` entry |

## What the player sees

A merchant whose offers are **all** gated opens with a notice in the trade window rather than an
empty list — without it, an emptied merchant is indistinguishable from one that happens to have no
stock, which reads as a bug.

Whether that notice names the stages holding the offers back is `showStagesInWindow` under
[`[trade_lock]`](/wiki/server/config-files/visual-toml#trade_lock), **off by default**. That is the
opposite default from the dimension and mob messages, on purpose: those answer "why can I not go
there", where naming the stage is the whole help. A merchant with nothing to offer is a puzzle some
packs would rather keep as one.

The message itself is `tradeLocked` under
[`[lock_messages]`](/wiki/server/config-files/visual-toml#lock_messages).

## Global or individual

All three lists work in both scopes — a trade window always has a player standing in front of it.

## See also

- [Entities & Spawns](/wiki/locking/creatures-and-trade/entities-and-spawns#interactionlock) —
  `interactionlock` with the `trade` action stops a player interacting with the villager at all,
  which is a blunter instrument than gating its offers.
- [Complete Examples](/wiki/stage-file/complete-examples#fluids-trades-and-a-zone)
