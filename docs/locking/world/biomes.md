---
title: Biomes
description: "Making a biome unsurvivable until the stage opens — effects, damage, a warning, and refused interactions."
sidebar_position: 2
---

# Biomes

A biome lock does not stop a player walking in. It makes the place **unsurvivable** — effects,
damage, a warning, and interactions refused — until the stage opens.

```json
{
  "biomes": {
    "biomes": [
      "minecraft:desert",
      "#minecraft:is_forest"
    ]
  }
}
```

Entries are biome ids, or biome **tags** with a `#` prefix. Everything else about the behaviour is
server-wide rather than per entry.

## In the editor

The **Biomes** tab on a stage, with a searchable picker over every biome and biome tag the pack has
loaded.

The behaviour itself is not on this tab — it is server-wide, and lives in the **Common** tab of the
[Config Editor](/wiki/in-game-tools/in-game-editor#the-config-editor) under `biome_lock`.

## What happens while a player stands there

All of it is configured once, in
[`[biome_lock]`](/wiki/server/config-files/gameplay-toml#biome_lock), and applies to every locked
biome in the pack:

| Setting | Default | |
| :--- | :--- | :--- |
| `effectsEnabled` / `effects` | on / blindness 30s | Potion effects applied while inside. Written as `"effect_id, seconds, amplifier"`. |
| `clearEffectsOnLeave` | `false` | Clear them the moment the player leaves rather than letting them run out. |
| `messageEnabled` / `messageFormat` / `showInChat` | on | A periodic warning. `{stage}` and `{biome}` are replaced. |
| `damageEnabled` / `damageAmount` / `damageInterval` | on / `1.0` / `20` | Periodic damage. |
| `blockRightClick` / `blockLeftClick` / `blockProjectiles` | all on | Interactions refused inside. |
| `blockExplosions` | on | Explosions do not destroy blocks inside. |
| `checkInterval` | `10` | Ticks between position checks. Range 1–200. |

Note that **damage is on by default for biomes** and off by default for
[structures](/wiki/locking/world/dimensions-and-structures) — a structure is something you are kept
out of, a biome is something you cannot live in.

## The catch: biomes are large and irregular

A structure has walls. A biome does not — its edge wanders, it interlocks with its neighbours, and
in 1.21 it varies with height as well as position. A player standing near a border can cross it
without meaning to, and the check runs every `checkInterval` ticks rather than continuously.

In practice this means a biome lock reads as "this whole region is hostile", not as a precise
boundary. If you need a precise boundary — a walled city, a crater, one side of a river — draw a
[zone](/wiki/locking/world/zones) instead. A zone has exact edges, can carry a hard barrier that
cannot be crossed at all, and can have rules of its own rather than the pack-wide ones above.

## Global or individual

Both. A player is always standing in the biome when the question is asked, so there is someone to
check against.

## See also

- [Dimensions & Structures](/wiki/locking/world/dimensions-and-structures) — the same toolkit around
  a structure.
- [Zones](/wiki/locking/world/zones) — precise areas with their own rules.
- [gameplay.toml](/wiki/server/config-files/gameplay-toml#biome_lock) — the full settings block.
- [Complete Examples](/wiki/stage-file/complete-examples#biome-and-interaction-locking)
