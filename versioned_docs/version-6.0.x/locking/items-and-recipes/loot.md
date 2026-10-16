---
title: Loot
description: "Keeping locked items out of chest loot and mob drops, per player, and replacing them with something else."
sidebar_position: 6
---

# Loot

Loot has no field of its own. A locked item is kept out of chest loot and mob drops by the **`loot`
action**, which — like every other action — is on unless an entry narrows it away:

```json
{
  "items": [
    "minecraft:diamond",
    { "id": "minecraft:emerald", "unlock_actions": ["loot"] }
  ]
}
```

Diamonds will not appear in loot while the stage is locked. Emeralds still will, because `loot` is
listed as an action that stays free.

What happens to the filtered slot — empty, or something else in its place — is a server-wide
decision in [gameplay.toml](/wiki/6.0.x/server/config-files/gameplay-toml#loot_replacements).

## In the editor

There is no Loot tab, because loot is not a category of its own. **Right-click** an ordinary item,
tag or mod entry and pick **Lock Actions**; `loot` is one of the tick boxes in that popup, alongside
`use`, `pickup` and the rest.

Replacement is server-wide and lives in the **Common** tab of the
[Config Editor](/wiki/6.0.x/in-game-tools/in-game-editor#the-config-editor) under `loot_replacements`.

## Chest loot goes through Lootr

This is why [Lootr is a required dependency](/wiki/6.0.x/start-here/installation#what-you-need-alongside-it).
A vanilla container is shared: one roll, one inventory, whoever opens it first takes what is there.
That cannot be filtered per player. Lootr gives every player their own view of a container, and the
filter runs **while that view is being rolled** — so each player gets a copy matching their own
stages.

Because the filter sits at roll time rather than at open time, it covers every Lootr container in
one go, including the ones that never open a menu at all: the decorated pot and the suspicious sand
or gravel a player brushes.

:::note[Loot rolled before the lock does not disappear]
A container that was already rolled for a player keeps what it holds, even if a stage is locked
afterwards. This is deliberate. Inside a Lootr inventory, loot and whatever a player put in
themselves are indistinguishable, so a hook that cleaned out locked items on open would also throw
away their own belongings.
:::

## Mob drops are not symmetrical with chest loot

A mob drops **one shared set of items into the world** — there is no per-player copy to filter. So
drops are judged against the **killing player**:

- Killed by a player → that player's stages decide.
- Killed by anything else (a fall, another mob, a cactus) → only global stages apply, since there is
  nobody to ask.

:::warning[Known collateral damage]
If a player without the stage lands the kill, the item is gone for everyone standing there —
including teammates who *have* unlocked it. There is no way around this without a per-player copy of
a world item, so it was accepted rather than solved. Turn `lockLoot` off under `[individual_stages]`
if a pack would rather not have it.
:::

## Replacing instead of removing

By default a locked entry is simply removed from the loot. A pack can put something else there
instead:

| Setting | Default | What it does |
| :--- | :--- | :--- |
| `useReplacements` | `false` | Turn replacement on. Without it, locked loot is removed. |
| `replacementItems` | `[]` | Item ids to pick a random replacement from. Checked first. |
| `replacementTags` | `[]` | Item tags to pick from, used when `replacementItems` is empty or exhausted. |

→ [gameplay.toml](/wiki/6.0.x/server/config-files/gameplay-toml#loot_replacements)

Both chest loot and mob drops honour `replacementTags`. That was not always true — mob drops used to
read `replacementItems` only.

## The switches

| Setting | Block | Default | What it governs |
| :--- | :--- | :--- | :--- |
| `lockMobLoot` | `[gameplay]` | `true` | Remove globally-locked items from mob drops. |
| `lockLoot` | `[individual_stages]` | `true` | Apply individual stages to Lootr containers and mob drops. |
| `dropOnRevoke` | `[individual_stages]` | `true` | Drop locked items out of a player's inventory when their individual stage is revoked. |

`dropOnRevoke` is the other half of the story: it is what happens to items a player is already
holding when a stage is taken away from them, rather than what happens when loot is generated. The
same scan runs on login, which is how items that became locked while a player was offline are
caught.

## Global or individual

Both. Chest loot works per player because of Lootr; mob drops work per player only as far as the
killer can be identified.

## See also

- [Unlock Actions](/wiki/6.0.x/locking/items-and-recipes/unlock-actions) — the `loot` action among the
  rest.
- [Items, Tags & Mods](/wiki/6.0.x/locking/items-and-recipes/items-tags-mods) — what a locked entry covers
  by default.
- [Mod Compatibility](/wiki/6.0.x/server/mod-compatibility) — Lootr and the other integrations.
