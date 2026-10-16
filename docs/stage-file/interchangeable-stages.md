---
title: Interchangeable Stages
description: "Several stages lock the same thing and any one of them should be enough: the interchangeable switch."
sidebar_position: 6
---

# Interchangeable Stages

:::info[New in 6.1.0]
NeoForge only until the Forge and Fabric ports are out.
:::

Normally, something locked by several stages stays locked until **every one** of them is unlocked.
Put Arcane Ore into a Magic stage and a Mining stage, and a player needs both.

Turn on **Interchangeable** in those stages and they stand in for each other: unlocking either one
is enough.

```json title="config/historystages/global/magic.json"
{
  "display_name": "Magic",
  "interchangeable": true,
  "items": ["mypack:arcane_ore"]
}
```

## How it combines

Only the stages with the switch on form the either-or group. Every other stage that locks the same
thing still has to be unlocked as before.

Arcane Ore locked in **Magic** (on), **Mining** (on) and **Endgame** (off):

| Unlocked | Arcane Ore |
| :--- | :--- |
| Magic | locked — Endgame is missing |
| Endgame | locked — neither Magic nor Mining |
| Endgame + Mining | free |
| Endgame + Magic + Mining | free |

Read it as `(Magic OR Mining) AND Endgame`. A stage without the switch never loses its lock
because of one that has it.

The rule is decided per thing that is locked, so the same stage can be part of an either-or group
for one item and the only stage gating another.

## What it covers

Every kind of lock goes through the same rule: items, tags, mods, fluids, recipes, enchantments and
effects, dimensions, structures, biomes, zones, creatures and trades, plus the
[lock actions](/wiki/locking/items-and-recipes/unlock-actions) of an entry.

**Global and individual stages are checked separately.** Each tree forms its own either-or group,
and the thing is locked if either tree still locks it. A global stage cannot stand in for an
individual one.

Spawn and generation *rules* are not affected. Those switch per stage between "while locked" and
"after unlock" and are not a thing several stages gate together.

## What players see

The tooltip and Jade list the stages that are still missing. Interchangeable ones that are all
still locked appear indented under **One of:**; once one of them is unlocked the group disappears
from the list. A single remaining interchangeable stage is listed plainly.

Players who would rather see a flat list can turn the grouping off with
`groupInterchangeableStages`, separately in
[`[visuals]`](/wiki/server/config-files/visual-toml#visuals) and in `[jade]`.

## In the editor

**Stage Settings → Locks → Interchangeable.** The switch is there on global and individual stages.
A pack that never turns it on behaves exactly as it did before 6.1.

## Scripts and the API

KubeJS and CraftTweaker cannot read or set the switch, but their `isLocked(...)` follows the rule
without any change. For addons, `LockHit.locks()` already accounts for it. →
[Lock Categories](/api/lock-categories)

## See also

- [Logic Blocks](/wiki/stage-file/logic-blocks) — rules between stages that go beyond "one of them
  is enough".
- [Global vs Individual](/wiki/start-here/global-vs-individual) — why the two trees never mix.
