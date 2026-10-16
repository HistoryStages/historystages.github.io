---
title: Zones
description: "Areas you draw yourself, each with its own rules for entry, spawning and building."
sidebar_position: 3
---

A zone is an area the pack author draws themselves — a crater, a walled-off city, the far side of a river — rather than something Minecraft already has a name for. Unlike biome and structure locks, whose behaviour is set once for the whole server in the config, **every zone carries its own rules**: one can merely refuse interaction while the next one burns.

```json
{
  "zones": [
    {
      "name": "The Crater",
      "dimension": "minecraft:overworld",
      "shapes": [
        { "type": "cube", "from": [-120, 60, 340], "to": [-60, 90, 400], "full_height": true },
        { "type": "cylinder", "center": [-90, 63, 370], "radius": 24, "height": 32, "full_height": false },
        { "type": "sphere", "center": [-40, 70, 410], "radius": 16 }
      ],
      "rules": {
        "message": { "enabled": true, "text": "&cThe air here is still poison.", "in_chat": false },
        "damage": { "enabled": true, "amount": 1.0, "interval": 20 },
        "effects": {
          "enabled": true,
          "clear_on_leave": true,
          "list": [ { "id": "minecraft:blindness", "seconds": 30, "amplifier": 0 } ]
        },
        "block_right_click": true,
        "block_left_click": true,
        "block_projectiles": true,
        "block_explosions": true,
        "barrier": false,
        "block_spawns": false,
        "inverted": false,
        "show_border": false,
        "show_overlay": false
      }
    }
  ]
}
```

Zones are normally drawn in the game rather than typed. Sneak + left click with the marker item sets the first corner and sneak + right click the second (see [`[zone_lock]`](/wiki/server/config-files/gameplay-toml#zone_lock)); `/history zone mark`, `clear` and `info` do the same without an item, which is how you set a corner you cannot stand on.

**The dimension is mandatory and is never inverted.** Coordinates alone are ambiguous — 100/64/100 exists in the Overworld, the Nether and the End — so a zone meant for a Nether fortress would otherwise also fire in the middle of an Overworld village. An area spanning two worlds is two zones, on purpose: the editor then shows that there are two.

## Shapes

A zone is the union of its shapes, and a shape is one of three kinds:

| `type` | Fields | Meaning |
| :--- | :--- | :--- |
| `cube` | `from`, `to`, `full_height` | Two opposite corners, in any order. |
| `sphere` | `center`, `radius` | — |
| `cylinder` | `center`, `radius`, `height`, `full_height` | `center` is the middle of the **floor**; `height` is the extent upwards. |

`full_height` makes a cube or cylinder span the whole build range of its dimension and ignores the height numbers. It is the common case in practice — a village is gated as a whole, not as a slice of one.

A zone with no shapes at all is legal. It is shown as incomplete and applies to nobody.

## Rules

| Key | Default | Effect |
| :--- | :--- | :--- |
| `message.enabled` / `.text` / `.in_chat` | on / empty / off | A message while the player is inside. `{zone}` and `{stage}` are replaced; `&` sets a colour. `in_chat` prints it in chat as well as above the hotbar. |
| `damage.enabled` / `.amount` / `.interval` | off / `1.0` / `20` | Periodic damage. Never in creative mode. |
| `effects.enabled` / `.clear_on_leave` / `.list` | off / off / empty | Potion effects, as `{ "id", "seconds", "amplifier" }`. `clear_on_leave` removes them at once instead of letting them run out. |
| `block_right_click` | `true` | Blocks, items and creatures — including placing against the border from outside. |
| `block_left_click` | `true` | Attacking and breaking, including reaching through the wall from outside. |
| `block_projectiles` | `true` | Arrows, snowballs and the like vanish when they would land inside. |
| `block_explosions` | `true` | Blocks inside the zone are not destroyed by explosions. |
| `barrier` | `false` | The player physically cannot get in — not with an elytra, an ender pearl or a horse. Creative mode is exempt. |
| `block_spawns` | `false` | Suppresses natural spawning. Spawners, spawn eggs and commands are left alone. Global stages only. |
| `inverted` | `false` | Turns the zone around: the rules apply everywhere **except** here — but still only in this world. |
| `show_border` | `false` | Draws the zone's wall once the player is close enough. |
| `show_overlay` | `false` | Tints the screen red while the player is inside. |

The two visibility switches decide **whether** a zone is seen; `[zone_overlay]` in `visual.toml` decides how far the wall carries and how strong the tint is. A zone meant to stay secret leaves both off — the client is not told about a zone it is not allowed to see.

## Standing in two zones at once

Overlap is normal rather than exceptional; packs get built by dropping boxes onto a map until the area looks right. The rules are merged into one answer, and the merge is deliberate:

- **Switches are an OR.** One zone asking for interaction to be blocked is enough. A zone that does not ask cannot un-ask on another's behalf.
- **Damage takes the highest amount, never the sum** — nudging two zones into overlap while building must not quietly become lethal. The interval travels with the amount that won.
- **One message wins**, the first of the zones found. Three messages fighting over the action bar reads as a bug.
- **Effects are merged by effect ID**: the stronger amplifier wins, and at equal strength the longer duration.
