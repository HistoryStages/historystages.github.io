---
title: Hidden Display
description: "What a player who has not unlocked the stage yet sees in place of the real name, tooltip and lock hint."
sidebar_position: 7
---

# Hidden Display

`hidden_display` decides what a player who has **not** unlocked the stage sees in place of the real
item. It changes nothing about whether the item is locked — only how it presents itself. Once the
stage is unlocked, everything displays normally again.

## In the editor

Not a tab — it belongs to the stage rather than to one lock category. **Stage Settings**, the button
on the stage's own screen, holds it as the **Display** card: the two modes as dropdowns, their
replacement texts as fields, and the lock-hint switch.

Per-entry overrides are set where the entry is: **right-click** the item, tag, mod or fluid in its
list and pick **Text Override**.

:::note[No Text Override in the menu?]
It only appears while this stage's `name_mode` or `tooltip_mode` is set to `"replace"` — with both
off or hidden there is no text for an entry to override, so the menu leaves it out rather than
offering something that would do nothing.
:::

```json
{
  "hidden_display": {
    "name_mode": "replace",
    "name_text": "???",
    "tooltip_mode": "replace",
    "tooltip_text": "Unlock the Stone Age to reveal this item.",
    "show_lock_hints": false
  }
}
```

| Key | Type | Default | What it does |
| :--- | :--- | :--- | :--- |
| `name_mode` | String | `"off"` | `"off"` — name unchanged. `"hidden"` — name is cleared. `"replace"` — name becomes `name_text`. |
| `name_text` | String | `""` | The replacement name, used when `name_mode` is `"replace"`. |
| `tooltip_mode` | String | `"off"` | `"off"` — tooltip unchanged. `"hidden"` — extra tooltip lines are stripped. `"replace"` — tooltip becomes `tooltip_text`. |
| `tooltip_text` | String | `""` | The replacement tooltip. `\n` starts a new line. |
| `show_lock_hints` | Boolean | `true` | With `false`, the padlock icon and the "Locked" hint line are left off the tooltip. |

## Taking full control of the tooltip

`show_lock_hints` on its own does very little — turning it off simply removes the padlock line and
leaves whatever the item would otherwise show. It earns its place in combination with
`tooltip_mode: "replace"`, which together is the only way to decide every line a locked player reads:

```json
{
  "hidden_display": {
    "name_mode": "replace",
    "name_text": "Ancient Relic",
    "tooltip_mode": "replace",
    "tooltip_text": "Recovered from the ruins.\nIts purpose is not yet clear.",
    "show_lock_hints": false
  }
}
```

Without `show_lock_hints: false`, the mod's own "requires stage X" line is appended underneath and
gives the answer away.

## Overriding it for a single entry

Entries in `items` and `tags` can carry their own `name_text` and `tooltip_text`, which take
precedence over the stage-wide ones:

```json
{
  "hidden_display": {
    "name_mode": "replace",
    "name_text": "???",
    "tooltip_mode": "replace",
    "tooltip_text": "Not yet discovered."
  },
  "items": [
    "minecraft:iron_ingot",
    {
      "id": "minecraft:netherite_ingot",
      "name_text": "A Heavy Metal",
      "tooltip_text": "Heavier than gold, and it does not burn."
    }
  ]
}
```

**Only the text is overridden, never the mode.** `name_mode` and `tooltip_mode` in `hidden_display`
still decide whether replacing happens at all — an entry with a `name_text` and a stage whose
`name_mode` is `"off"` shows the real name.

## When two stages both change the same item

Two locked stages can both set a hidden display for the same item. The one that matches it more
closely wins: an entry for the item itself beats a tag or a mod. When both match equally well, the
stage that sorts first by folder path and id wins, and global stages come before individual ones.
The "you still need" lines in the tooltip list the stages in that same order.

Before 6.1.0 such a tie was decided at random and could flip after a reload.

## `???` is the mod's own word for "unknown"

`hidden_display` is off by default, so nothing is renamed until a stage asks for it. But if you want
a replacement name that matches the rest of the mod, use `???` — that is what the built-in lock
messages ("*??? This item is still unknown to you ???*") and the Stage Graph's hidden-stage node
already say. It is a deliberate house style rather than an unfinished placeholder.

## What hidden display does not cover

An item whose entry narrows the lock down to a single action — say
[`recipe`](/wiki/locking/items-and-recipes/unlock-actions) alone — still shows as hidden and still
carries the "requires stage X" tooltip. Both statements describe *that the item belongs to a stage*,
which stays true however narrow the gate is. Everything that actually refuses an action reads the
action list; the two display surfaces deliberately do not.

## See also

- [Unlock Actions](/wiki/locking/items-and-recipes/unlock-actions) — narrowing which interactions a
  lock covers.
- [visual.toml](/wiki/server/config-files/visual-toml) — the server-wide defaults for lock messages,
  tooltips and the padlock overlay, which apply to every stage that does not override them.
