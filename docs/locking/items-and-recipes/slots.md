---
title: Slots
description: "Keeping inventory and container slots shut until a stage opens — the hotbar, armour, offhand, or chosen slots of a chest or machine."
sidebar_position: 9
---

# Slots

<Scope global="yes" individual="partly" note="Individual: only the player's own inventory. Container slots need a global stage." />

Since 6.2.0 a stage can keep **slots** shut: part of the player's own inventory, or chosen slots of
a chest, furnace or modded machine. A pack that starts players on a three-slot hotbar and hands out
the rest stage by stage is one stage file per step.

```json
{
  "slots": [
    { "target": "player", "slots": [3, 4, 5, 6, 7, 8], "mode": "hide" },
    { "target": "minecraft:chest", "slots": [18, 19, 20, 21, 22, 23, 24, 25, 26], "mode": "overlay" }
  ]
}
```

Here the right two thirds of the hotbar are gone, and the bottom row of every chest is covered by
a lock until the stage opens.

## What one entry holds

| Field | What it does |
| :--- | :--- |
| `target` | `player` for the player's own inventory. Otherwise the block a container is opened from (`minecraft:chest`, `minecraft:furnace`, a machine id), or the menu type when there is no block behind it — a backpack opened from an item, for example. |
| `slots` | Slot numbers. See [below](#which-number-is-which-slot). |
| `mode` | `hide` or `overlay`. Defaults to `overlay`. |
| `look` | Only for `overlay`: how the cover looks. See [The look](#the-look). |
| `hint` | Optional text shown when a player hovers the locked slot. |

### `hide` and `overlay`

- **`hide`** — the slot is simply gone. No item, no frame in vanilla screens, a gap in the hotbar.
  Use it when the slot should not exist yet.
- **`overlay`** — the slot stays visible with a lock on top, refuses items and shows a tooltip on
  hover. Use it when the player should see that there is more to come.

Either way the slot refuses everything: clicks, shift-clicks, number-key and offhand swaps,
pick-block, picking items up from the ground, other mods putting items in, and right-click or
dispenser armour. On vanilla containers hoppers and droppers are refused too.

Players in creative mode are not affected.

### Which number is which slot

**For `player`** the numbers are inventory positions:

| Slots | Where |
| :--- | :--- |
| 0–8 | Hotbar, left to right |
| 9–35 | The three main inventory rows |
| 36–39 | Armour: boots, leggings, chestplate, helmet |
| 40 | Offhand |

A number above 40 does not exist and is dropped with a warning in the load report.

**For a container** the numbers are the slots of that container's screen, counted from 0 —
a single chest has 0–26. A **double chest is the same target as a single one**: the picker switches
between small and large, slots 0–26 apply to both, and 27–53 exist only in the large one.

The easy way is not to count at all — the editor's picker draws the real screen and you click the
slots.

## Items already in a locked slot

When a slot becomes locked while something lies in it — a stage relocks, or you add the lock to a
running world — the item is **dropped at the player's feet**. That keeps a locked hotbar slot from
holding a sword the player can still swing.

Set [`dropItemsFromLockedSlots`](/wiki/server/config-files/gameplay-toml#gameplay) to `false` to
keep them where they are instead. The item stays, still works, and the slot is frozen around it:
it cannot be taken out or swapped until the stage opens.

For an individual stage relocked while its player is offline, the items drop at their next login.

## The look

![The inventory with locked items and the locked hotbar slots hidden](/img/ingame/inventory-locked.webp)

![A chest whose bottom row is locked with the overlay mode](/img/ingame/chest-locked-row.webp)

An `overlay` slot gets a tint and a symbol on top. All of it is optional; an entry without a `look`
block gets a half-transparent black cover with a lock symbol.

```json
{
  "target": "player",
  "slots": [36, 37, 38, 39],
  "mode": "overlay",
  "look": { "color": "#3a2a10", "opacity": 70, "icon": "item", "item": "minecraft:iron_chestplate", "size": "full" },
  "hint": "Armour comes with the Iron Age"
}
```

| Field | Values | Default |
| :--- | :--- | :--- |
| `color` | A hex colour, `#rrggbb`. | `#000000` |
| `opacity` | 0–100. | `50` |
| `icon` | `lock`, `item` or `none`. | `lock` |
| `item` | The item drawn when `icon` is `item`. | — |
| `size` | `small`, `medium` or `full`. | `medium` |
| `texture` | A block or item texture that covers the slot instead of colour and symbol. | — |

A resource pack can bring its own texture under `textures/block` or `textures/item` and pick it here.

**When several stages lock the same slot,** a customised look wins over the default one. Between two
customised looks, the stage whose id sorts first alphabetically wins.

## The tooltip

Hovering an `overlay` slot shows a tooltip with the title, the entry's `hint` and the stages it
needs. Which lines it shows, in which order and in which colour is set once for the whole pack
under [`[slot_lock]`](/wiki/server/config-files/visual-toml#slot_lock) in visual.toml. The
[config editor](/wiki/in-game-tools/in-game-editor#the-config-editor) has a small layout editor
for it with a live preview, under **Slot Lock**.

`hide` slots have no tooltip — there is nothing left to hover.

## In the editor

![The Slots tab](/img/editor/slots-tab.webp)

The **Slots** tab on a stage. **Player inventory** sits at the top; containers are added from a
searchable list of every block with a screen, grouped by mod, with a second tab for menu types.

**Edit slots** opens the picker. It draws the real screen, so you click the slots you want, with
quick buttons for the hotbar, the inventory, the armour, all, none and invert. Mode and look sit on
a second page, with a preview of how it looks in game.

Some modded screens cannot be drawn outside the world. For those the picker offers **Pick in
world**: open the real container in the world and click the slots there; Esc cancels.

## Global or individual

| Target | Global | Individual |
| :--- | :---: | :---: |
| `player` | yes | yes |
| A container | yes | **no** |

Two players looking into the same chest cannot see different slots, and a hopper has no player at
all. Container entries on an individual stage are removed when the stage loads, with a warning in
the load report.

## For addons and other mods

Inventory sorters, mods with slots of their own and scripts can ask whether a slot is open, hidden
or covered. → [Lock Categories](/api/lock-categories#slots-slotlockquery)

## See also

- [Items, Tags & Mods](/wiki/locking/items-and-recipes/items-tags-mods) — locking what goes in a
  slot rather than the slot itself.
- [gameplay.toml](/wiki/server/config-files/gameplay-toml#gameplay) — `dropItemsFromLockedSlots`.
- [visual.toml](/wiki/server/config-files/visual-toml#slot_lock) — the tooltip layout.
