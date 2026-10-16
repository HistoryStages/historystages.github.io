---
title: Relocking
description: "Stages that lock themselves again: the While mode for states that come and go, and lock triggers on Default and Auto stages."
sidebar_position: 3
---

# Relocking

:::info[New in 6.1.0]
NeoForge only until the Forge and Fabric ports are out.
:::

A stage normally stays unlocked once it is open. Two things can close it again on their own:

| | [The While mode](#the-while-mode) | [Lock triggers](#lock-triggers) |
| :--- | :--- | :--- |
| What for | states that come and go: being in the Nether, raining, an effect running | anything, including events and counters |
| On which stages | its own mode, `"conditional"` | `default` and `auto` stages |
| How it opens | by the same triggers that close it | as before: scroll or auto-triggers |
| Progress | none, checked all the time | counted, like auto-triggers |

Both use the trigger types from [Stage Modes](/wiki/stage-file/stage-modes#trigger-types). They
fall into three groups, and the group decides what a trigger can do here:

| Group | Triggers | Can it end? |
| :--- | :--- | :--- |
| **States** | `biome`, `structure`, `dimension`, `item` (in the inventory), `effect`, `xp_level`, `weather`, `world_time` | yes — the player leaves, the rain stops, the effect runs out |
| **Counters** | `advancement`, `playtime`, `stat`, `day_count` | no, they only go up |
| **Events** | `entity`, `block_place`, `block_break` | no, they happen once |

Only states can be used by the While mode, and only states can be [negated](#negate-is-reached-or-no-longer-holds).

## The While mode

A stage in mode `"conditional"` (**While** in the editor) is open **only while its triggers hold**.
Leave the Nether and it locks; come back and it opens again. There is no scroll, and the pedestal
refuses it.

```json title="config/historystages/individual/nether_adapted.json"
{
  "display_name": "Nether Adapted",
  "mode": "conditional",
  "auto_trigger": {
    "mode": "all",
    "triggers": [
      { "type": "dimension", "id": "minecraft:the_nether" },
      { "type": "effect", "id": "minecraft:fire_resistance" }
    ]
  }
}
```

It uses the normal `auto_trigger` block with **any** or **all**, but only state triggers are
allowed. Anything else is skipped with a warning when the stage loads; the editor does not offer
it.

- The state is checked once a second, and right away at login, at server start and after a
  reload.
- **Dependencies are checked only at the moment it opens.** If a dependency goes away while the
  stage is open, it stays open until its condition next fails.
- [Blocked while ...](/wiki/stage-file/logic-blocks#blocked-while) stops it from opening.
- An operator's `/history ... unlock` or `lock` is overwritten on the next check. The state decides,
  not the command.
- Messages are off by default for this mode, because a stage that flickers with the weather would
  otherwise announce itself every few minutes. `"notify": true` turns them on.

**Global While stages can only use world states** — `weather` and `world_time`. "Some player is in
the Nether" is not a state of the world. For player states, use an individual stage.

## Lock triggers

A `default` or `auto` stage can carry a `lock_trigger` block: triggers that lock it again once
they fire.

```json title="config/historystages/individual/peaceful_trader.json"
{
  "display_name": "Peaceful Trader",
  "mode": "auto",
  "auto_trigger": {
    "triggers": [{ "type": "advancement", "id": "minecraft:adventure/trade" }]
  },
  "lock_trigger": {
    "mode": "any",
    "triggers": [
      { "type": "entity", "id": "minecraft:villager", "sub_mode": "kill" }
    ],
    "re_unlockable": false
  }
}
```

Kill a villager and the stage is gone.

- Lock triggers count **only while the stage is open**, and their progress starts at zero every
  time it unlocks, whichever way it unlocked.
- `mode` is `any` or `all`, as for auto-triggers.
- `lock_trigger` on an `external`, `temporary` or `conditional` stage is ignored with a warning.
- Locking a stage does not lock the stages that depend on it.

### Lost for good

`re_unlockable` decides what happens afterwards. It is `false` by default.

| `re_unlockable` | After the lock trigger fires |
| :--- | :--- |
| `true` | the stage can be unlocked again the normal way, by its scroll or its auto-triggers |
| `false` | the stage is **lost for good**: the pedestal, auto-triggers, scripts and FTB Quests rewards all refuse it |

A `default` stage that is lost for good keeps its scroll; the pedestal refuses the research. An
operator can still bring it back with a command or the editor, which also clears the mark. In the
overview a global stage that is lost for good carries a `[Lost]` badge; individual ones show
"lost for good" in their tooltip.

### Negate: "is reached" or "no longer holds"

A state trigger in a lock list normally fires when the state **is reached**. With `"negate": true`
it fires when the state **no longer holds** instead.

Take the fire resistance effect. A player drinks the potion, it runs for three minutes, then it
runs out:

| Moment | Effect | `"negate": false` (is reached) | `"negate": true` (no longer holds) |
| :--- | :--- | :--- | :--- |
| Drinks the potion | starts | **fires — locks** | — |
| Three minutes later | still running | — | — |
| Effect runs out | ends | — | **fires — locks** |

The first locks the stage the moment the player drinks; the second keeps it open exactly as long as
the effect lasts.

```json
"lock_trigger": {
  "triggers": [
    { "type": "effect", "id": "minecraft:fire_resistance", "negate": true }
  ],
  "re_unlockable": true
}
```

- Only state triggers can be negated. On a counter or an event `negate` is ignored with a warning,
  because something that happened cannot stop having happened. The editor labels those rows
  **Event**.
- A negated trigger is checked once a second, like the While mode.
- On a **global** stage only world states can be negated, for the same reason as the While mode.
  Plain player states stay allowed there: the first player to reach one locks the stage for
  everyone.

:::warning[Negated and not re-unlockable]
A negated trigger whose state does not hold when the stage unlocks fires within a second. With
`re_unlockable: false` the stage is then gone for good right after it opened. The editor warns
about this combination.
:::

## `notify`

`"notify": false` on any stage keeps its unlock and relock messages quiet. The settings in
[`[notifications]`](/wiki/server/config-files/visual-toml#notifications) stay the master switch.
Left out, it is `false` for While stages and `true` for every other stage, so existing stages do
not change.

## In the editor

**Stage Settings.** The mode dropdown has **While**, with a card to configure its conditions and
the message switch. On Default and Auto stages a **Re-lock** card sits below the mode card:
**Configure lock triggers →**, **Can be unlocked again** and **Messages on unlock/lock**.

The lock trigger list is the same screen as the auto-trigger list. State rows have a switch between
**is reached** and **no longer holds**; event and counter rows carry an **Event** label.

## See also

- [Stage Modes](/wiki/stage-file/stage-modes) — the trigger types and the other modes.
- [Logic Blocks](/wiki/stage-file/logic-blocks) — "Revoke when" takes a stage away because of other
  stages, not because of a trigger.
- [Lose on Death](/wiki/start-here/global-vs-individual#lose-on-death) — the other way an
  individual stage can be taken away.
