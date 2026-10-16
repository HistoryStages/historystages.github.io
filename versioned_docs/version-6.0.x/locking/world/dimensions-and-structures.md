---
title: Dimensions & Structures
description: "Refusing entry to a dimension, walling off a structure, and capping how often a structure may generate."
sidebar_position: 1
---

# Dimensions & Structures

Two ways to put a place out of reach: refuse entry to a whole dimension, or wall off a single
structure inside the world. A third option caps how often a structure is allowed to generate at all.

## In the editor

Two tabs: **Dimensions** and **Structures**, each with a searchable picker. The structure picker
takes structure tags as well as ids.

**Right-click a structure** in the list and pick **Generation** — that is where
[generation limits](#generation-limits) are set. `block_generation` is not a separate tab, which is
why it is easy to miss. On an individual stage the menu entry is not there at all, since the cap
only works globally.

Standing somewhere and not knowing what it is called is the usual problem.
`/history debug structure` prints the structure ids and tags at your feet, and
`/history debug viz` draws the lock zone the current settings would produce.

## Dimensions

A flat list of dimension ids. A player who tries to enter one while the stage is locked is turned
back.

```json
{
  "dimensions": [
    "minecraft:the_nether",
    "minecraft:the_end"
  ]
}
```

The feedback — actionbar message, optional chat copy, whether the required stage is named — is
configured under [`[dimension_lock]`](/wiki/6.0.x/server/config-files/visual-toml#dimension_lock-and-mob_lock),
and the wording itself under `dimensionUnknown` in
[`[lock_messages]`](/wiki/6.0.x/server/config-files/visual-toml#lock_messages).

Works in both global and individual stages. This is the cleanest lock in the mod: there is one door,
and it is either open for you or it is not.

## Structures

The `structures` object holds a `structures` list of structure ids, or structure **tags** with a `#`
prefix:

```json
{
  "structures": {
    "structures": [
      "minecraft:stronghold",
      "#minecraft:village"
    ]
  }
}
```

The mod builds a tight, piece-aware lock zone around each structure — not a bounding box around the
whole thing, but a shape clustered from the pieces the structure is actually made of. Inside that
zone it can cancel right-clicks, left-clicks and projectile impacts, show a message, and optionally
deal periodic damage.

:::note[A flat array still works]
`"structures": ["minecraft:stronghold"]` — the pre-6.0 spelling — is still read, and rewritten into
the object form the next time the stage is saved.
:::

### Tuning the lock zone

Two advanced settings in
[`[structure_lock]`](/wiki/6.0.x/server/config-files/gameplay-toml#structure_lock) decide how the zone is
shaped:

| Setting | Default | What it does |
| :--- | :--- | :--- |
| `lockPadding` | `0` | Extra blocks around each structure piece, on top of a fixed 2-block buffer. Range 0–16. |
| `clusterDistance` | `6` | How far apart two pieces may be and still join into one zone. Higher means larger, more filled-in zones. Range 0–32. |

Those two are hard to picture from numbers, so there are commands that draw the result:

```text
/history debug structure
/history debug viz
/history debug shapes
```

The first names the structures and tags at your feet — which is the reliable way to get an id right.
The second draws the zone the current settings produced. The third prints the individual pieces it
was clustered from. → [Commands](/wiki/6.0.x/server/commands#debug-subcommands-client-side)

### What a player runs into

| Setting | Default | |
| :--- | :--- | :--- |
| `messageEnabled` / `messageFormat` / `showInChat` | on | A message on entry. `{stage}` and `{structure}` are replaced. |
| `damageEnabled` / `damageAmount` / `damageInterval` | off / `1.0` / `20` | Periodic damage while inside. |
| `blockRightClick` / `blockLeftClick` / `blockProjectiles` | all on | Interactions cancelled inside the zone. |
| `checkInterval` | `10` | Ticks between position checks. |

The visible side — the force-field wall as you approach and the red screen tint while inside — is in
[`[structure_overlay]`](/wiki/6.0.x/server/config-files/visual-toml#structure_overlay).

Unlike [zones](/wiki/6.0.x/locking/world/zones), these settings are **server-wide**: every locked structure
in the pack behaves the same way. If you need one place to merely warn and another to burn, draw
them as zones instead.

## Generation limits

Rather than blocking entry, an entry can cap how often a structure is allowed to generate in the
first place. That lives in a separate `block_generation` list inside the same object:

```json
{
  "structures": {
    "block_generation": [
      "minecraft:stronghold",
      {
        "id": "#minecraft:village",
        "phase": "while_locked",
        "max": 3,
        "reset_on_relock": false
      }
    ]
  }
}
```

| Field | Type | Default | Meaning |
| :--- | :--- | :--- | :--- |
| `id` | String | — | Structure id, or a tag with `#`. |
| `phase` | String | `"while_locked"` | `"while_locked"` — the cap counts while the stage is locked, generation is free afterwards. `"after_unlock"` — nothing generates while locked, and the cap starts counting once the stage opens. |
| `max` | Integer | `0` | How many times it may generate. A tag counts all its members together. `0` blocks it entirely, same as a plain string entry. |
| `reset_on_relock` | Boolean | `false` | Whether the counter resets when the stage is relocked. |

:::warning[Global stages only]
World generation is a permanent, world-wide decision — there is no per-player chunk to gate. Written
into an individual stage, `block_generation` does nothing.
:::

Counts are tracked world-wide rather than per dimension, starting from the moment the rule takes
effect. **Chunks generated before the rule was added are not affected** — a cap added to a world
that has already been explored only governs what happens from then on.

Treasure maps also stop pointing at structures whose limit has been reached, so players are not sent
to a place that will never exist.

## Global or individual

Dimensions and structure entry locks work in both. `block_generation` is global-only, for the reason
above. → [Global vs Individual](/wiki/6.0.x/start-here/global-vs-individual#what-can-each-one-lock)

## See also

- [Biomes](/wiki/6.0.x/locking/world/biomes) — the same toolkit applied to a biome rather than a
  structure.
- [Zones](/wiki/6.0.x/locking/world/zones) — areas you draw yourself, each with its own rules instead of
  the server-wide ones.
- [Complete Examples](/wiki/6.0.x/stage-file/complete-examples#capping-how-often-a-structure-generates)
