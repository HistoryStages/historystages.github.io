---
title: Entities & Spawns
description: "Stopping attacks, stopping non-combat interaction, and writing spawn rules with conditions of place, time and weather."
sidebar_position: 1
---

# Entities & Spawns

The `entities` object holds three independent lists. They answer three different questions, and
since 6.0 none of them implies another:

```json
{
  "entities": {
    "attacklock": ["minecraft:zombie"],
    "interactionlock": ["minecraft:villager"],
    "spawnlock": ["minecraft:ghast"]
  }
}
```

| List | Question | Scope |
| :--- | :--- | :--- |
| [`attacklock`](#attacklock) | May the player hit it? | global + individual |
| [`interactionlock`](#interactionlock) | May the player breed, mount, shear, name it? | global + individual |
| [`spawnlock`](#spawnlock) | May it appear at all? | **global only** |

## In the editor

The three lists are three tabs of their own: **Attack**, **Interaction** and **Spawn**. The entity
pickers work like the item picker, multi-select included.

A spawn entry is a rule rather than a tick. **Right-click it** and pick **SpawnControl** for the
full [spawn dialog](/wiki/6.0.x/in-game-tools/in-game-editor#the-spawn-rule-dialog) — phase at the top,
then Sources, Location, Time & Weather and Extra biomes as tabs, with a line underneath spelling the
finished rule out in words.

An interaction entry right-clicks to **Interaction Actions** for its action list and **Item Filter**
for the held-item condition.

## `attacklock`

A flat list of entity ids. While the stage is locked, every attack the player makes against one is
cancelled.

```json
"attacklock": ["minecraft:blaze", "minecraft:wither_skeleton"]
```

The mob is otherwise completely normal: it spawns, it moves, it fights back. This is the
individual-friendly way to gate combat progression, because there is always a player doing the
attacking.

The feedback is configured under
[`[mob_lock]`](/wiki/6.0.x/server/config-files/visual-toml#dimension_lock-and-mob_lock), and the wording
under `mobUnknown` in [`[lock_messages]`](/wiki/6.0.x/server/config-files/visual-toml#lock_messages).

## `interactionlock`

Everything that is not combat: naming, leashing, shearing, milking, breeding, trading, mounting,
equipping armour and saddles. Attacking and spawning are untouched.

An entry is either a plain entity id — which blocks every recognised interaction — or an object:

```json
"interactionlock": [
  "minecraft:villager",
  {
    "id": "minecraft:horse",
    "unlock_actions": ["mount"],
    "lock_items": ["minecraft:saddle"]
  }
]
```

| Field | Type | What it does |
| :--- | :--- | :--- |
| `unlock_actions` | Strings | Actions that stay **free**; everything else stays blocked. Recognised: `breed`, `mount`, `trade`, `leash`, `shear`, `milk`, `name`, `equip`, `other`. |
| `lock_items` | Strings / Objects | A held-item filter. The lock only applies while the player holds one of these — item ids, `#tag` entries, or `{ "id": …, "nbt": {…} }` objects. Omitted means the lock applies whatever is held, empty hand included. |

In the example, villagers cannot be interacted with at all. Horses can be mounted freely but not
saddled, bred or leashed — and only while a saddle is actually in hand.

`unlock_actions` here works the same way round as it does for
[items](/wiki/6.0.x/locking/items-and-recipes/unlock-actions): the list is what stays available.

## `spawnlock`

A spawn rule: which sources it covers, when it applies, and under what conditions the entity may
still appear. **Global stages only** — a spawn does not know who it is appearing for, and an
individual lock needs a concrete player.

:::warning[Changed in 6.0: a spawn lock no longer implies an attack lock]
Until 6.0.0, gating an entity's spawning also stopped players hitting it. That coupling is gone
entirely — whether a creature may be hit is a separate question from whether it may appear, and a
zombie out of a spawner or an egg is a perfectly ordinary zombie.

A stage that relied on the implication now leaves the creature attackable. List it in `attacklock`
as well if that is what you wanted.
:::

The simple form is a plain entity id, which blocks every source everywhere:

```json
"spawnlock": ["minecraft:skeleton"]
```

**Everything an existing pack already wrote keeps working and is written back unchanged.** A rule
the old format can express — `unlock_sources`, `unlock_dimensions` — is saved in exactly that form,
so stage files that never touch the new options stay byte-identical.

| Field | Meaning |
| :--- | :--- |
| `id` | The entity. |
| `unlock_sources` | Sources that are **not** blocked; everything else is. Recognised: `natural`, `spawner`, `structure`, `breeding`, `summon`, `spawn_egg`. Absent means every source is blocked. |
| `phase` | `"while_locked"` (default) — the rule applies until the stage opens. `"after_unlock"` — it applies only once the stage is open, which is how you make something *start* appearing rather than stop. |
| `conditions` | Where and when the entity may still spawn. Every slot is optional; all present slots have to hold. |
| `extra_biomes` | Biomes the entity **additionally** spawns in. |
| `unlock_dimensions` | The pre-6.0 spelling of an "only in these dimensions" condition. Still read; new rules write `conditions.dimensions` instead. |

### `conditions`

```json
"spawnlock": [
  {
    "id": "minecraft:phantom",
    "conditions": {
      "dimensions": { "mode": "only", "ids": ["minecraft:overworld"] },
      "biomes":     { "mode": "exclude", "ids": ["#minecraft:is_ocean"] },
      "sky": "visible",
      "y": { "min": 60, "max": 180 },
      "time": "night",
      "light": { "min": 0, "max": 7 },
      "weather": "clear",
      "moon_phases": [0, 4]
    }
  }
]
```

| Slot | Values |
| :--- | :--- |
| `dimensions`, `biomes` | `mode` is `"only"` or `"exclude"`; `ids` are ids, and biomes also accept `#tag` entries. |
| `sky` | `"visible"` or `"hidden"` — whether the spawn position can see the sky. |
| `y` | `{ "min", "max" }`, inclusive. A reversed pair is swapped rather than rejected. |
| `time` | `"day"` or `"night"`. |
| `light` | `{ "min", "max" }`, 0–15 inclusive. |
| `weather` | `"clear"`, `"rain"` or `"thunder"`. A thunderstorm counts as rain as well. |
| `moon_phases` | A list of phase numbers, 0–7. |

### `extra_biomes`

The inverse of a lock: biomes the entity spawns in that it otherwise would not.

```json
"extra_biomes": {
  "ids": ["minecraft:desert", "#minecraft:is_badlands"],
  "weight": 30,
  "min_group": 2,
  "max_group": 4,
  "ignore_spawn_rules": false
}
```

Leaving `weight`, `min_group` and `max_group` out copies the frequency from the biomes the entity
already spawns in. `ignore_spawn_rules` skips the entity's own placement rules — its light level,
its surface preference — but not the physical ones: something still needs space and solid ground,
and a fish still needs water.

The rest of the rule's `conditions` apply here too; only the biome condition is set aside, since it
would otherwise exclude the very biome being added.

**Four limits worth knowing before building around this:**

- **Animals placed during world generation are not added.** Chunk generation reads the biome's own
  list directly. Extra biomes only affect ongoing natural spawning — invisible for monsters,
  noticeable for animals in land that is already explored.
- **The Nether and the End report a fixed clock**, so a `time` condition is constant there.
- **Weather is per world, not per biome.** `"rain"` also matches in a desert while it is raining
  somewhere else.
- **Space and ground still count**, even with `ignore_spawn_rules`.

## Building spawn rules in the editor

Spawn rules are normally built in the editor's spawn dialog rather than typed: phase at the top,
then four tabs — Sources, Location, Time & Weather, Extra biomes — and a line underneath that spells
the whole rule out in words. →
[In-Game Editor](/wiki/6.0.x/in-game-tools/in-game-editor#the-spawn-rule-dialog)

## See also

- [Merchant Trades](/wiki/6.0.x/locking/creatures-and-trade/merchant-trades) — gating what a villager will
  trade, which is a different question from whether you may interact with it.
- [Zones](/wiki/6.0.x/locking/world/zones) — a zone can suppress natural spawning inside an area, which is
  the same question asked about a place rather than a species.
- [Complete Examples](/wiki/6.0.x/stage-file/complete-examples#a-spawn-rule-with-conditions)
