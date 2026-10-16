---
title: Disguises
description: "Making a locked item or block look like something else until the player may use it — emerald ore that is stone until the Iron Age."
sidebar_position: 7
---

# Disguises

:::info[New in 6.1.0]
NeoForge only until the Forge and Fabric ports are out.
:::

A locked item can look like another item, and a locked block in the world like another block,
until the player is allowed to use it. Emerald ore set to look like stone renders as stone, sounds
like stone, shows the stone model and name in every inventory, and turns into ore the moment the
stage that locks it is unlocked.

It is the idea behind Revelationary, built in. Revelationary itself is not needed and not used.

## Where the rules live

Disguises belong to the **item**, not to a stage, so two stages cannot disagree about what the
same block looks like. All of them sit in one file:

```json title="config/historystages/settings/disguises.json"
{
  "minecraft:emerald_ore": { "as": "minecraft:stone", "drops": "disguise", "hints": false },
  "#c:ores/diamond":       { "as": "minecraft:deepslate" }
}
```

The key is an item id or an item tag (`#...`). Mod ids are not allowed.

| Field | Default | What it does |
| :--- | :--- | :--- |
| `as` | — (required) | The item it looks like. |
| `drops` | `"real"` | `"real"` keeps the usual lock rules; `"disguise"` makes the block break and drop like the disguise. |
| `hints` | `true` | `false` hides the padlock, the "requires stage" tooltip lines and the Jade lock lines for this item, so nothing gives the disguise away. |
| `nbt` | — | Item rules only: the disguise applies only to stacks that match. Such a rule never disguises a block in the world, because a placed block has no NBT. |

A missing file means no disguises. A rule naming an unknown id is skipped with a line in the load
report.

## When a disguise is active

While **any** stage, global or individual, locks the item for the player looking at it. That is
decided per player, so two players next to each other can see different blocks. Interchangeable
stages and logic blocks count as usual.

The disguise ignores [`unlock_actions`](/wiki/locking/items-and-recipes/unlock-actions): an entry
narrowed to a single action still keeps its disguise until the stage opens.

**An item rule beats a tag rule.** When several tag rules match, the first by sorted key wins and
the editor warns about the overlap.

**Chains are followed.** If the disguise is itself locked and has a rule, that rule applies next.
Ore disguised as andesite, with andesite locked and disguised as stone, shows as stone; once
andesite unlocks, the ore shows as andesite. Loops between rules are refused when the file loads
and in the editor.

## What changes while it is active

**In the world:** the block renders as the disguise, with its particles and its break, step and
place sounds. Properties both blocks share, like facing, carry over.

**As an item:** the disguise's model and name everywhere items show, JEI and EMI included. If a
locking stage sets a [hidden display](/wiki/stage-file/hidden-display) name, that name wins over
the disguise's.

**Breaking with `"drops": "disguise"`:** break speed, the tool needed, the drops and the XP all come
from the disguise, and the [`break`](/wiki/locking/items-and-recipes/unlock-actions#the-actions)
lock is skipped for that block. Silk Touch and Fortune work as they would on the disguise. A
disguise that cannot be broken, like bedrock, makes the real block unbreakable too. This only
applies to players: explosions, pistons and machines drop the real block.

**Breaking with `"drops": "real"`:** the item's lock rules apply unchanged. A stone that drops
emeralds gives the game away, so pair `real` with a `break` lock if that matters.

**Editor screens always show the real items.**

## Limits

Not covered: the F3 screen, advanced tooltips' item id, pick block (middle click), light the block
gives off, and its outline and collision shape.

Known to clash:

- **Shader packs** that make ores glow by their real block id.
- **Connected textures** (Continuity and similar) can show seams where a disguised block meets a
  real one.
- **Vein miners** may skip or include the real block.
- A disguise target with see-through parts may render wrong, because the chunk keeps the real
  block's render settings. Ore to stone is fine.

## In the editor

- **Right-click an item or tag row → Disguise.** The dialog has the item it should look like,
  **Drops** (Real / Like disguise) and **Show lock hints**, plus which stages lock the item and
  whether the world block is disguised too. Disguised rows carry a badge.
- **Disguises** in the overview's header menu lists every rule with what it looks like, how it
  drops, its hints and the stages that lock it. Rules whose item is locked nowhere are greyed out
  and sorted to the bottom. **+ Add** creates a rule for an item that is not in any stage yet.

The editor saves into `disguises.json` and sends the new rules to every player.

## See also

- [Hidden Display](/wiki/stage-file/hidden-display) — changing the name and tooltip without
  changing the look.
- [Items, Tags & Mods](/wiki/locking/items-and-recipes/items-tags-mods) — locking the item itself.
