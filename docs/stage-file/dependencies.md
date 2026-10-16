---
title: Dependencies
description: "Demanding items, levels, kills, stats or other stages before a stage opens, and how AND and OR groups are combined."
sidebar_position: 4
---

# Dependencies

A stage can demand that things be done before it opens. Dependencies are normally built in the
visual Dependency Editor inside the [in-game editor](/wiki/in-game-tools/in-game-editor), but they
are plain JSON and can be written by hand.

`dependencies` is a list of **groups**. A group is not a single condition — it holds one list per
kind of requirement, plus a `logic` field saying how its own entries are connected.

```json
"dependencies": [
  {
    "id": "tribute",
    "logic": "AND",
    "items": [ { "id": "minecraft:iron_ingot", "count": 16 } ],
    "item_tags": [ { "id": "#minecraft:planks", "count": 8 } ],
    "stages": [ "stone_age" ],
    "individual_stages": [ { "stage_id": "apprentice", "mode": "all_online" } ],
    "advancements": [ "minecraft:story/mine_diamond" ],
    "xp_level": { "level": 30, "consume": true },
    "entity_kills": [ { "entity_id": "minecraft:enderman", "count": 50 } ],
    "stats": [ { "stat_id": "minecraft:play_time", "min_value": 72000 } ],
    "scoreboard": [ { "objective": "quests", "op": ">=", "value": 5 } ]
  }
]
```

Every list is optional — leave out what the group does not use. An `addons` block can sit alongside
them for requirement kinds owned by other mods; see [Requirements](/api/requirements).

## The conditions

Two fields describe the group itself: `id` (see [below](#group-ids-and-why-they-matter-in-a-live-world))
and `logic`. Everything after them is a requirement list.

| Field | Demands |
| :--- | :--- |
| `items` | Items handed in at the Research Pedestal. Entries take `id`, `count`, and an optional `nbt` criterion. |
| `item_tags` | An item tag handed in at the pedestal, same entry shape. A tag entry does not behave like a list of items — see [below](#item-tags-settle-on-the-first-deposit). |
| `stages` | Another global stage is already unlocked. Plain stage ids. |
| `individual_stages` | An individual stage is held. `mode` is `"all_online"`, `"all_ever"` or `"player"` — see [below](#the-individual_stages-condition-is-collective). |
| `advancements` | The player has earned an advancement. |
| `xp_level` | A single object rather than a list. `consume` takes the levels away on unlock. |
| `entity_kills` | The player has killed `count` of `entity_id`. |
| `stats` | A tracked statistic has reached `min_value`. |
| `scoreboard` | An objective satisfies a comparison. `op` is one of `>=`, `<=`, `==`, `>`, `<`, `!=`. Without `score_holder`, the acting player's own score is read. |

## Four of them are individual-only

`advancements`, `xp_level`, `entity_kills` and `stats` each need a single player to measure. An
individual scroll has a fixed owner from the moment research starts; a global scroll has none.

Written into a global stage by hand, those four are **skipped rather than checked** — they are not
stripped from the file, and they are not measured against whoever happened to open the pedestal. The
editor simply does not offer them there. The load report names them.

The rest — items, item tags, stages, individual stages and scoreboard — work in both scopes. →
[Requirements](/api/requirements) has the same split from the addon side.

A scoreboard condition works on a global stage because it can name the holder it reads. Left without
one it falls back to the acting player, which on a global stage is whoever happens to be standing at
the pedestal — so name the holder when you use it there.

## AND, OR, and where the line runs

:::warning
**`logic` applies inside a group and never between groups.** Groups are always joined by AND: every
group has to be satisfied. Within one group, `"AND"` (the default) demands every entry and `"OR"`
demands any single one.
:::

So "sixteen iron *or* eight gold, and thirty levels either way" is two groups:

```json
"dependencies": [
  {
    "logic": "OR",
    "items": [
      { "id": "minecraft:iron_ingot", "count": 16 },
      { "id": "minecraft:gold_ingot", "count": 8 }
    ]
  },
  {
    "logic": "AND",
    "xp_level": { "level": 30 }
  }
]
```

Putting all three into one OR group would let thirty levels alone open the stage.

The Research Scroll tooltip and the graph's detail panel both print the heading of each group, so a
player can see which entries an OR applies to.

## Item tags settle on the first deposit

An `item_tags` entry is not shorthand for "any one of these items". The first matching item thrown
into the pedestal is written onto the scroll, and from then on that entry demands **that** item for
the rest of its count — so `8x #minecraft:planks` means eight planks of one kind, not eight planks
scraped together from four different woods.

The choice lives on the individual scroll, next to the counter, and there is no way to reset it. Two
players researching the same stage can settle on different items. While an entry is still open, its
icon cycles through the tag's members once a second, so it reads as a choice rather than as one
specific item.

Deposits are matched in a fixed order: concrete items first, then tags that have already settled,
then open tags. An open tag gives up its freedom last.

## The `individual_stages` condition is collective

It does not target one named player. The `mode` field picks whose stage is read:

| `mode` | Who must hold the stage |
| :--- | :--- |
| `all_online` | Every player currently online. |
| `all_ever` | Every player the server has ever seen. |
| `player` | Only whoever is doing the research. **Individual stages only.** |

The first two are how "nobody moves on until everyone is ready" is spelled. `player` is the ordinary
personal prerequisite, and it is deliberately refused on a global stage: a global stage unlocks once
for everybody, so a personal gate would let the first qualifying player open it for the whole
server, including everyone without the prerequisite. That reads as "everyone needs it" and does the
opposite.

## Group ids, and why they matter in a live world

What a player has already deposited is filed against the **group's `id`**, not against its position
in the list:

```json
"dependencies": [
  { "id": "ores", "logic": "OR", "items": [ … ] },
  { "id": "levels", "xp_level": { "level": 30 } }
]
```

Because the id travels with the group, deleting, reordering or duplicating groups in the editor
leaves everyone's deposits attached to the requirement they were made for.

A group written **without** an `id` falls back to its position, and is given that position as its id
when the stage loads — which is exactly what its existing progress is already filed under, so
scrolls from older versions keep working untouched. The id is written into the file the first time
the editor saves the stage.

:::warning[Hand-edited files, before the editor has ever saved them]
Until ids are in the file, a group is only identified by where it sits. Reordering groups in a
hand-written stage that is already live in a running world will therefore shift what players have
handed in. Either open and save the stage in the editor once — which stamps the ids in — or write
the `id` fields yourself.

Two groups carrying the **same** id is the other way to get there; copying a group in a text editor
makes it easy. The later one has its id taken away and replaced on load, and the load report names
it.
:::

## See also

- [Research Pedestal](/wiki/in-game-tools/research/pedestal) — where items are handed in.
- [Research Scrolls](/wiki/in-game-tools/research/scrolls) — how the requirements are shown to
  players.
- [Stage Graph](/wiki/in-game-tools/stage-graph) — drawing the dependency chain for players.
