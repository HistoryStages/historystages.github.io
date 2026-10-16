---
title: Stage Modes
description: "The four ways a stage can open — research at a pedestal, an automatic trigger, an external command, or a timed unlock that relocks itself."
sidebar_position: 2
---

# Stage Modes

A stage's `mode` decides **how it opens** — and, as a consequence, whether a
[Research Scroll](/wiki/6.0.x/in-game-tools/research/scrolls) exists for it at all. Leave the key out and
the stage is `default`.

| Mode | Scroll? | Opens when |
| :--- | :--- | :--- |
| [`default`](#default) | yes | a player researches it at a [pedestal](/wiki/6.0.x/in-game-tools/research/pedestal) |
| [`auto`](#auto) | no | the player does something that trips a trigger |
| [`external`](#external) | yes | a command or a script says so — the pedestal refuses it |
| [`temporary`](#temporary) | no | a trigger fires; it then relocks itself after a timer |

Picking between them is mostly a question of who is in control. `default` puts it in the player's
hands, `auto` makes it a consequence of play, `external` keeps it with the pack author or a quest
mod, and `temporary` is for anything that is supposed to end.

Mode and [dependencies](/wiki/6.0.x/stage-file/dependencies) are separate things: dependencies say what
has to be true *before* a stage may be researched, and only `default` and `external` stages have
research to gate.

## In the editor

**Stage Settings**, the button on the stage's own screen. The mode is a dropdown, and picking one
swaps the card underneath it for that mode's own settings — the trigger list for `auto`, the
duration and cooldown for `temporary`, a note for `external` explaining that the pedestal will
refuse it.

Triggers are added from a searchable list, with the combine mode (any or all) above them.

## default

The standard mode. A Research Scroll is generated for this stage and players unlock it by researching that scroll at a Research Pedestal.

```json
{
  "display_name": "Iron Age",
  "mode": "default"
}
```

The `"mode"` key can be omitted entirely — `default` is the fallback for any stage that does not specify one.

## auto

No scroll is generated. The stage unlocks automatically when the player meets one or more **trigger conditions** defined in the `"auto_trigger"` block.

```json
{
  "display_name": "Nether Explorer",
  "mode": "auto",
  "auto_trigger": {
    "mode": "any",
    "triggers": [
      { "type": "dimension", "id": "minecraft:the_nether" },
      { "type": "advancement", "id": "minecraft:story/enter_the_nether" }
    ]
  }
}
```

### Combine mode

The `"mode"` field inside `"auto_trigger"` controls how multiple triggers are evaluated:

| Value | Behaviour |
| :--- | :--- |
| `"any"` *(default)* | The stage unlocks when **any one** trigger fires |
| `"all"` | The stage unlocks only after **every** trigger has fired |

### Trigger types

Each entry in `"triggers"` requires a `"type"` field and type-specific parameters:

| Type | Parameters | Description |
| :--- | :--- | :--- |
| `"item"` | `"id"` | Player picks up or crafts the item |
| `"biome"` | `"id"` | Player enters the biome |
| `"dimension"` | `"id"` | Player enters the dimension |
| `"structure"` | `"id"` | Player enters the structure |
| `"entity"` | `"id"`, `"sub_mode"` | Player interacts with an entity |
| `"block_place"` | `"id"` | Player places the block |
| `"block_break"` | `"id"` | Player breaks the block |
| `"advancement"` | `"id"` | Player earns the advancement |
| `"playtime"` | `"days"` | Player has been online for N in-game days |
| `"stat"` | `"category"`, `"id"`, `"count"` | A vanilla statistic reaches `count` |
| `"xp_level"` | `"level"` | Player reaches the experience level |
| `"effect"` | `"id"` | Player is given the status effect |
| `"weather"` | `"state"` | The weather in the player's dimension |
| `"day_count"` | `"days"` | The world reaches day N |
| `"world_time"` | `"preset"`, `"from"`, `"to"` | The time of day |

The `"entity"` trigger supports an optional `"sub_mode"` field to restrict which interaction counts:

| `sub_mode` | Behaviour |
| :--- | :--- |
| `"any"` *(default)* | Either killing or interacting triggers the stage |
| `"kill"` | Only killing the entity counts |
| `"interact"` | Only right-clicking the entity counts |

#### The `"stat"` trigger

The generic one, and usually the one you want. `"category"` names which of the nine vanilla statistic types to read, and `"id"` is looked up in that category's registry:

| `category` | `id` comes from | Example |
| :--- | :--- | :--- |
| `"custom"` | The custom-stat registry | `minecraft:fish_caught` |
| `"mined"` | Blocks | `minecraft:diamond_ore` |
| `"crafted"` | Items | `minecraft:bread` |
| `"used"` | Items | `minecraft:diamond_pickaxe` |
| `"broken"` | Items | `minecraft:iron_axe` |
| `"picked_up"` | Items | `minecraft:emerald` |
| `"dropped"` | Items | `minecraft:rotten_flesh` |
| `"killed"` | Entity types | `minecraft:zombie` |
| `"killed_by"` | Entity types | `minecraft:creeper` |

Because `"custom"` reaches the whole custom-stat registry, several things that look like they would need triggers of their own do not: fishing (`minecraft:fish_caught`), sleeping (`minecraft:sleep_in_bed`), distance walked (`minecraft:walk_one_cm`), time riding, damage dealt. Before asking for a new trigger type, check whether the game already counts it.

`"count"` is clamped to at least 1 — a threshold of 0 would be met by every player before they had done anything. A `"category"` this build does not know, or an `"id"` missing from its registry, never fires.

#### The `"weather"` trigger

`"state"` is one of `"clear"`, `"rain"` or `"thunder"`.

`"rain"` matches a thunderstorm as well, because vanilla's own `isRaining()` does. Use `"thunder"` when you mean only the storm, and `"clear"` for dry weather.

#### The `"world_time"` trigger

`"preset"` is one of `"day"`, `"sunset"`, `"night"`, `"sunrise"` or `"custom"`:

| `preset` | Window (ticks) |
| :--- | :--- |
| `"day"` | 0 – 11999 |
| `"sunset"` | 12000 – 12999 |
| `"night"` | 13000 – 22999 |
| `"sunrise"` | 23000 – 23999 |

With `"custom"`, `"from"` and `"to"` are read instead, both clamped to 0 – 23999. `"from"` above `"to"` is a window running across midnight, not an empty one — `22000` to `2000` is the four hours around midnight. The named presets carry their own window, so they write no `"from"` or `"to"` into the file.

#### Examples

```json
"triggers": [
  { "type": "item", "id": "minecraft:diamond" },
  { "type": "biome", "id": "minecraft:jungle" },
  { "type": "entity", "id": "minecraft:villager", "sub_mode": "interact" },
  { "type": "playtime", "days": 3 },
  { "type": "stat", "category": "used", "id": "minecraft:diamond_pickaxe", "count": 50 },
  { "type": "xp_level", "level": 30 },
  { "type": "effect", "id": "minecraft:blindness" },
  { "type": "weather", "state": "thunder" },
  { "type": "day_count", "days": 7 },
  { "type": "world_time", "preset": "night" },
  { "type": "world_time", "preset": "custom", "from": 22000, "to": 2000 }
]
```

## external

A scroll **is** generated, but the Research Pedestal refuses to research it. The stage can only be unlocked by a server operator with
[`/history global unlock <stage>`](/wiki/6.0.x/server/commands), or by a
[script](/wiki/6.0.x/server/scripting).

Use it when unlocking should stay entirely with the pack author — an FTB Quests reward, a custom
event, a ceremony run by hand. The scroll still exists, so players can read what the stage holds
back and see it in the [Stage Graph](/wiki/6.0.x/in-game-tools/stage-graph); they simply cannot research
their way in.

```json
{
  "display_name": "Prestige Unlock",
  "mode": "external"
}
```

## temporary

Like `auto`, but the stage **re-locks automatically** after a configured duration. No scroll is generated.

Use it for anything that is meant to end: a trading window, a seasonal buff, a recurring event on
a cooldown.

A running timer and the trigger count are runtime state, not file state, so there is no way to read
them out of the stage file. [`/history temporary`](/wiki/6.0.x/server/commands#temporary-stage-commands)
is what inspects and resets them — `info`, `reset` and `setcount`, for global and individual stages
alike.

```json
{
  "display_name": "Harvest Festival",
  "mode": "temporary",
  "auto_trigger": {
    "triggers": [
      { "type": "advancement", "id": "mypack:events/harvest_begins" }
    ]
  },
  "temporary": {
    "duration": 3,
    "duration_unit": "days",
    "max_triggers": 0,
    "cooldown": 12,
    "cooldown_unit": "hours"
  }
}
```

### `temporary` options

| Key | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `duration` | Integer | `1` | How long the stage stays unlocked after the trigger fires |
| `duration_unit` | String | `"hours"` | Unit for `duration`: `"seconds"`, `"minutes"`, `"hours"`, or `"days"` |
| `max_triggers` | Integer | `1` | Maximum number of times the stage may unlock in total (see below) |
| `cooldown` | Integer | `0` | Wait time after re-locking before the trigger is accepted again |
| `cooldown_unit` | String | `"hours"` | Unit for `cooldown`: same options as `duration_unit` |

### `max_triggers` in detail

- **`1`** — the stage unlocks exactly once and stays locked permanently afterwards. The cooldown does not apply. A server operator can still unlock it manually via `/history global unlock`, but that does not start a new timer.
- **`N > 1`** — the stage may unlock up to N times total. After each re-lock, the cooldown must pass before the trigger is accepted again.
- **`0`** — unlimited unlocks. After each re-lock, only the cooldown prevents immediate
  re-triggering. A cooldown of `0` means the stage can fire again right away.

:::note[Dying ends a running timer early]
If a `temporary` individual stage also has
[`lose_on_death`](/wiki/6.0.x/start-here/global-vs-individual#lose-on-death), dying ends the timer and
starts the cooldown as though it had expired on its own — it does not count against `max_triggers`
any differently from a normal expiry.
:::

## See also

- [Dependencies](/wiki/6.0.x/stage-file/dependencies) — what has to be done before a `default` or
  `external` stage may be researched.
- [Research Scrolls](/wiki/6.0.x/in-game-tools/research/scrolls) — the item `default` and `external`
  stages produce.
- [Commands](/wiki/6.0.x/server/commands) — unlocking, relocking, and the `temporary` subcommands.
