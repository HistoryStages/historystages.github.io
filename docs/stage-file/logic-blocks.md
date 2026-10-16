---
title: Logic Blocks
description: "Rules between stages: a stage that is blocked, hidden, cheaper or taken away depending on which other stages are unlocked."
sidebar_position: 5
---

# Logic Blocks

:::info[New in 6.1.0]
NeoForge only until the Forge and Fabric ports are out.
:::

[Dependencies](/wiki/stage-file/dependencies) say "A has to come before B". Logic blocks cover what
dependencies cannot: a stage that becomes unavailable, invisible, cheaper or lost because of what
happened to **other** stages.

The classic case is two paths that exclude each other. A mage picks fire or ice; starting one shuts
the other until the first is mastered.

A logic block is one rule: a **type** (what happens) plus a **condition** (when). A stage can carry
several.

| Type | What it does |
| :--- | :--- |
| [Blocked while ...](#blocked-while) | the stage cannot be unlocked while the condition holds |
| [Hidden while ...](#hidden-while) | the stage is out of sight while the condition holds |
| [Cheaper/costlier while ...](#cheapercostlier-while) | research time, item and XP costs change while the condition holds |
| [Revoke when ...](#revoke-when) | the stage is taken away the moment the condition becomes true |

## Conditions

A condition looks at other stages: **is unlocked** or **is locked**, grouped as **All** or
**One of**. The editor builds up to five groups, and all groups must hold at once:

> (Fire I is unlocked **and** Fire III is locked)

In the file it is a small tree of `all`, `any`, `not` and `unlocked`:

```json
"logic": [
  {
    "type": "blocked_while",
    "condition": {
      "all": [
        { "unlocked": "fire_1" },
        { "not": { "unlocked": "fire_3" } }
      ]
    }
  }
]
```

Any tree is read and evaluated, also nestings the editor cannot draw. The editor then shows the
block read-only and keeps it as it is.

**Who the condition is checked for.** An individual stage's condition is checked for that player
and may look at global and individual stages. A global stage's condition may look at global stages
only; an individual stage in it counts as locked and the load report says so. When an individual
and a global stage share an id, `"scope": "global"` or `"scope": "individual"` next to
`"unlocked"` says which one is meant.

A stage that does not exist counts as locked. The editor marks it red.

## Blocked while

The stage **cannot be unlocked** while the condition holds. An already unlocked stage stays
unlocked when its condition becomes true; taking it away is what [Revoke when](#revoke-when) is
for.

The two mage paths, each three stages long. Only the entry stages need a block:

| Stage | Blocked while |
| :--- | :--- |
| Fire I | Ice I is unlocked **and** Ice III is locked |
| Ice I | Fire I is unlocked **and** Fire III is locked |

At the start both are open. Research Fire I and Ice I is blocked. Unlock Fire III and Ice I opens
again.

**Which unlock paths respect it:**

| Path | When the stage is blocked |
| :--- | :--- |
| Research pedestal | refuses to start, and asks again when research finishes |
| Auto-triggers, `While` stages | do not fire; they try again the next time |
| KubeJS, CraftTweaker, FTB Quests rewards | refused, with a line in the debug log |
| `/history` commands, the editor's unlock toggle | **unlock anyway** and tell the operator |
| Creative scroll | goes through |

The pedestal asks a second time at the end because two players can start Fire I and Ice I at the
same moment. If the stage is blocked by then, `researchWhenBlocked` in
[`gameplay.toml`](/wiki/server/config-files/gameplay-toml#stage_logic) decides: `PAUSE` (default)
keeps the progress and waits, `CANCEL` stops and hands the scroll back.

`warnOnForcedUnlock` turns off the notice an operator gets when a command pushes a blocked stage
through.

## Hidden while

The stage is **out of sight** while the condition holds. It can still be unlocked, so a secret
path found through a looted scroll still works. Combine it with "Blocked while" to stop that.

`mode` picks how it hides: `"anonymous"` (default) or `"vanish"`.

| Where | `anonymous` | `vanish` |
| :--- | :--- | :--- |
| Stage graph (player view) | node shown as "???" | node and its lines gone |
| Item tooltip, Jade, lock messages | "???" | "???" |
| Another stage's requirements | "???" | "???" |
| Its scroll in JEI / EMI | hidden | hidden |
| Editor, commands, debug log | unchanged | unchanged |

Where the stage is only shown, it vanishes; where it explains something, it reads "???".

```json
{ "type": "hidden_while", "mode": "vanish", "condition": { "not": { "unlocked": "explorer" } } }
```

## Cheaper/costlier while

Scales the research **time**, the **item** costs and the **XP** costs in percent while the
condition holds. 100 is unchanged, 50 half, 0 free or instant, up to 1000. A missing field is 100.

```json
{ "type": "cost_while", "time": 50, "items": 100, "xp": 75, "condition": { "unlocked": "scholar" } }
```

- Several blocks that hold multiply with each other and with the pedestal
  [booster](/wiki/in-game-tools/research/pedestal#boosters).
- Item counts round up and never fall below 1 unless the factor is 0. XP rounds the same way.
- **Item and XP costs are fixed on the scroll at the first deposit.** Unlocking Scholar halfway
  through does not change what is already owed. Time changes live.

The pedestal shows what applies and why. The scroll tooltip also lists discounts the player could
still get by unlocking something; `showInactiveCostHints` in
[`visual.toml`](/wiki/server/config-files/visual-toml#stage_logic) turns those hints off.

## Revoke when

Takes the stage away **once**, at the moment its condition turns from false to true, if the owner
has it. The owner is the world for a global stage and the player for an individual one.

```json
{ "type": "revoke_when", "condition": { "unlocked": "shadow_pact" } }
```

Take the shadow pact and the light path is gone.

- It fires whatever unlocked or locked the other stage: pedestal, trigger, command, script, quest.
- Chains work. Losing one stage can fire the revoke of another, and since a revoke only ever
  removes stages, a chain always ends.
- Players who were offline lose the stage at their next login.
- The stage can be researched again afterwards. Add "Blocked while" with the same condition to
  stop that.
- Revoking works like a relock: recipes lock again, and on an individual stage the player's locked
  items drop while `dropOnRevoke` in
  [`[individual_stages]`](/wiki/server/config-files/gameplay-toml#individual_stages) is on.

The player gets a toast saying what was taken and why. An operator whose command or editor click
started it gets one too.

Two warnings can show **before** it happens, each with its own switch in
[`visual.toml`](/wiki/server/config-files/visual-toml#stage_logic):

- `showRevokeWarningOnStage` — "Revoked when ..." on the stage's own scroll tooltip and graph
  panel.
- `showRevokeWarningOnTrigger` — "Unlocking takes away ..." on the scroll and pedestal of the stage
  whose unlock would fire it.

:::note[A "While" stage fires a revoke every time it opens]
A [`While` stage](/wiki/stage-file/relocking#the-while-mode) that keeps opening and closing turns
"is unlocked" on and off. A revoke that looks at it fires on every opening. That is how the rule
works, not a bug.
:::

## What players see

The pedestal, the scroll tooltip and the [stage graph](/wiki/in-game-tools/stage-graph) say why a
stage is blocked. In the graph a blocked stage has its own look, a red no-entry badge by default,
styled as `blocked` in `graph.toml` like the other node states.

`blockedDisplay = "PLAIN"` in [`visual.toml`](/wiki/server/config-files/visual-toml#stage_logic)
hides the conditions everywhere and only says that the stage is blocked. The actionbar texts for a
blocked and a revoked stage are `lock_messages.stageBlocked` and `lock_messages.stageRevoked`.

## In the editor

**Logic**, the button next to Settings and Dependencies on the stage's screen. Each block is a
card; **+ Block** adds one. A card shows live whether its condition holds for you right now, and
marks every term that is met. The stage picker only offers stages the condition may look at.

## See also

- [Dependencies](/wiki/stage-file/dependencies) — what has to be done before a stage can be
  researched.
- [Interchangeable Stages](/wiki/stage-file/interchangeable-stages) — several stages that lock the
  same thing, where one is enough.
- [Relocking](/wiki/stage-file/relocking) — stages that lock themselves again from triggers.
