---
title: Plants
description: "Crops and saplings that do not grow and refuse bonemeal until the stage opens."
sidebar_position: 3
---

# Plants

<Scope global="yes" individual="no" />

Since 6.2.0 a stage can keep **plants** from growing. A locked crop stays at the stage it was
planted in, bonemeal does nothing on it, and a locked sapling never turns into a tree.

```json
{
  "crops": {
    "crops": [
      "minecraft:wheat",
      "minecraft:cherry_sapling",
      "#minecraft:saplings"
    ]
  }
}
```

Entries are block ids, or block **tags** with a `#` prefix. A plain list works as well:
`"crops": ["minecraft:wheat"]`.

## What a player runs into

- **Growth stops completely.** The plant never gets past the age it has. There is no "grows up to
  half" — it is locked or it is not.
- **Bonemeal is refused** and not used up. The player gets a message in the actionbar. A dispenser
  firing bonemeal is refused the same way.
- **Saplings, fungi and mushrooms do not turn into their tree or feature**, neither on their own nor
  with bonemeal.

Planting and harvesting are not part of this lock. To stop the seed going in the ground in the first
place, lock the seed item for the `place` action. →
[Unlock Actions](/wiki/locking/items-and-recipes/unlock-actions)

With [Jade](/wiki/server/mod-compatibility) installed, looking at a locked plant shows that it does
not grow yet.

## In the editor

![The Plants tab](/img/editor/plants-tab.webp)

The **Plants** tab on a stage, with a searchable picker over every block and block tag. Locking a
whole mod offers its plants as a step in the same popup chain as its creatures, structures and
biomes.

The tab only shows on global stages.

## Global only

Plants grow in random ticks with nobody attached, so there is no player whose individual stages
could be asked. Plant entries on an individual stage are removed when the stage loads, with a
warning in the load report. →
[Global vs Individual Stages](/wiki/start-here/global-vs-individual#what-can-each-one-lock)

## See also

- [Biomes](/wiki/locking/world/biomes) — making a whole region hostile instead.
- [Items, Tags & Mods](/wiki/locking/items-and-recipes/items-tags-mods) — locking the seed or
  sapling item itself.
