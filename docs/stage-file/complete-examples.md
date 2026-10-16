---
title: Complete Examples
description: "Whole stage files ready to copy, each one naming the folder it belongs in."
sidebar_position: 8
---

# Complete Examples

Whole stage files, ready to copy. Each one says which folder it belongs in, because
[that is what decides whether it is global or individual](/wiki/start-here/global-vs-individual) —
and several of these use fields that only work in one of the two.

These are for reading and for dropping straight into a config folder. Building the same thing in
the [editor](/wiki/in-game-tools/in-game-editor) is usually quicker and is what most packs do; drop
a file in only if you want to start from one of these, and run `/history reload` afterwards.

Narrower, field-by-field examples live on the page for each lock type; these are the files that show
how the pieces sit together.

## A first global stage

Items and recipes, nothing else. The bread and butter of an era-based pack.

```json title="global/iron_age.json"
{
  "display_name": "Iron Age",
  "icon": "minecraft:iron_ingot",
  "research_time": 60,
  "items": [
    "minecraft:iron_ingot",
    "minecraft:iron_block",
    "minecraft:raw_iron"
  ],
  "recipes": [
    "minecraft:iron_pickaxe",
    "minecraft:iron_sword",
    "minecraft:iron_chestplate"
  ]
}
```

## Locking a whole mod, with an exception

`mods` gates everything a mod registers; `mod_exceptions` carves individual items back out, which is
how a pack gates Create but leaves its entry-level component craftable.

```json title="global/industrial_era.json"
{
  "display_name": "Industrial Era",
  "research_time": 120,
  "tags": [
    "c:ores/copper",
    "c:ingots/copper"
  ],
  "mods": ["create"],
  "mod_exceptions": ["create:andesite_alloy"]
}
```

## Gating a dimension and its inhabitants

`spawnlock` is **global-only** — a spawning mob does not know who it is appearing for. Keep this
file in `global/`.

```json title="global/nether_exploration.json"
{
  "display_name": "Nether Exploration",
  "research_time": 180,
  "dimensions": ["minecraft:the_nether"],
  "entities": {
    "attacklock": [
      "minecraft:blaze",
      "minecraft:wither_skeleton"
    ],
    "spawnlock": ["minecraft:ghast"]
  }
}
```

Since 6.0 a spawn lock no longer implies an attack lock, which is why blaze and wither skeleton are
listed separately — a ghast that comes out of a spawn egg is a perfectly ordinary ghast and can be
hit.

## A personal skill path

Individual stage: every player unlocks it themselves. The dependencies here — XP level and a kill
count — are **individual-only**, and so is `lose_on_death`. All of it belongs in `individual/`.

```json title="individual/monster_hunter.json"
{
  "display_name": "Monster Hunter",
  "icon": "minecraft:diamond_sword",
  "research_time": 90,
  "lose_on_death": true,
  "items": [
    "minecraft:netherite_sword",
    {
      "id": "minecraft:diamond_sword",
      "unlock_actions": ["pickup", "equip"]
    }
  ],
  "recipes": ["minecraft:netherite_sword"],
  "dependencies": [
    {
      "id": "proof",
      "logic": "AND",
      "xp_level": { "level": 30, "consume": true },
      "entity_kills": [
        { "entity_id": "minecraft:enderman", "count": 50 }
      ]
    }
  ]
}
```

The diamond sword can be carried and worn but not swung, because `unlock_actions` lists what stays
free. Dying relocks the stage — and because the relock happens on death rather than on respawn, the
netherite sword lands in the death drops.

## NBT-specific locking

Only the enchanted books carrying Mending are gated; every other enchanted book stays ordinary.

```json title="global/advanced_magic.json"
{
  "display_name": "Advanced Magic",
  "research_time": 240,
  "items": [
    {
      "id": "minecraft:enchanted_book",
      "nbt": {
        "StoredEnchantments": [
          { "id": "minecraft:mending", "lvl": 1 }
        ]
      }
    }
  ]
}
```

## A spawn rule with conditions

Zombies keep spawning underground but not in daylight on the surface; silverfish start turning up in
the badlands once the stage opens, where they otherwise would not. Global stage.

```json title="global/the_deep_dark.json"
{
  "display_name": "The Deep Dark",
  "entities": {
    "spawnlock": [
      {
        "id": "minecraft:zombie",
        "conditions": {
          "dimensions": { "mode": "only", "ids": ["minecraft:overworld"] },
          "sky": "visible",
          "time": "day"
        }
      },
      {
        "id": "minecraft:silverfish",
        "phase": "after_unlock",
        "extra_biomes": {
          "ids": ["#minecraft:is_badlands"],
          "weight": 30,
          "min_group": 2,
          "max_group": 4
        }
      }
    ]
  }
}
```

`phase: "after_unlock"` turns a rule around: it does nothing while the stage is locked and takes
effect once it opens. That is how a stage makes something *start* happening rather than stop.

## Fluids, trades and a zone

The three categories added in 6.0.0 in one file. The fluid entry is narrowed so lava can still be
picked up — only using it, placing it and its recipes are gated. The zone seals the caldera until
the stage opens.

```json title="global/the_volcano.json"
{
  "display_name": "The Volcano",
  "research_time": 300,
  "fluids": [
    {
      "id": "minecraft:lava",
      "unlock_actions": ["pickup", "icon"]
    }
  ],
  "trades": {
    "professions": [
      { "id": "minecraft:weaponsmith", "levels": [4, 5] }
    ]
  },
  "zones": [
    {
      "name": "Caldera",
      "dimension": "minecraft:overworld",
      "shapes": [
        { "type": "cylinder", "center": [1240, 64, -880], "radius": 90, "height": 0, "full_height": true }
      ],
      "rules": {
        "message": { "enabled": true, "text": "&cThe heat drives you back.", "in_chat": false },
        "damage": { "enabled": true, "amount": 2.0, "interval": 20 },
        "barrier": true,
        "show_border": true
      }
    }
  ]
}
```

Leaving a rule out of `rules` keeps its default — the four interaction switches are on unless turned
off, everything else is off unless turned on.

:::warning
Without `unlock_actions`, a fluid entry gates all seven of its actions, and that includes every
recipe that *consumes* the fluid. Gating `minecraft:water` unnarrowed takes a four-digit number of
recipes out of a large pack. → [Fluids](/wiki/locking/items-and-recipes/fluids)
:::

## Biome and interaction locking

```json title="global/desert_survival.json"
{
  "display_name": "Desert Survival",
  "research_time": 90,
  "biomes": {
    "biomes": ["minecraft:desert", "#minecraft:is_savanna"]
  },
  "entities": {
    "interactionlock": [
      {
        "id": "minecraft:camel",
        "unlock_actions": ["mount"],
        "lock_items": ["minecraft:saddle"]
      }
    ]
  }
}
```

Players cannot survive in deserts or savannas until the stage opens, and camels can be mounted
freely but not saddled — and only while a saddle is actually in hand.

## Capping how often a structure generates

World generation happens once, permanently, for the whole world, so `block_generation` is
**global-only**. At most three villages generate while the stage is locked; afterwards village
generation is unrestricted again.

```json title="global/settlers.json"
{
  "display_name": "Settlers",
  "research_time": 60,
  "structures": {
    "block_generation": [
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

## The flagship: an endgame stage

Several mechanisms at once. Everything here works in a **global** stage — note that `structures`
takes the object form, and that the dependencies are the kinds a global stage can actually measure
(a deposit at the pedestal, and a previously unlocked stage).

```json title="global/the_end_game.json"
{
  "display_name": "The End Game",
  "icon": "minecraft:dragon_egg",
  "research_time": 300,
  "items": [
    "minecraft:ender_pearl",
    "minecraft:ender_eye"
  ],
  "tags": ["c:end_stones"],
  "recipes": ["minecraft:end_crystal"],
  "dimensions": ["minecraft:the_end"],
  "structures": {
    "structures": ["minecraft:end_city"]
  },
  "entities": {
    "attacklock": ["minecraft:enderman"],
    "spawnlock": ["minecraft:ender_dragon"]
  },
  "hidden_display": {
    "name_mode": "replace",
    "name_text": "???",
    "tooltip_mode": "replace",
    "tooltip_text": "Something from beyond the world."
  },
  "dependencies": [
    {
      "id": "tribute",
      "logic": "AND",
      "items": [ { "id": "minecraft:blaze_rod", "count": 12 } ],
      "stages": ["nether_exploration"]
    }
  ]
}
```

:::note[Why not XP levels and kill counts here]
Advancements, XP level, entity kills and tracked statistics need one identifiable researcher, and a
global stage has none — a global scroll has no owner. Written into a global stage they are skipped
rather than checked. Put them in an individual stage, as the Monster Hunter example above does. →
[Dependencies](/wiki/stage-file/dependencies#four-of-them-are-individual-only)
:::

## Making a pair: the dual-phase lock

The same entry in a global *and* an individual stage turns on a two-step lock by itself. Nothing in
the files says so — it is the overlap that does it.

```json title="global/bronze_age.json"
{
  "display_name": "Bronze Age",
  "items": ["minecraft:copper_ingot"]
}
```

```json title="individual/smithing.json"
{
  "display_name": "Smithing",
  "items": ["minecraft:copper_ingot"]
}
```

Until *Bronze Age* opens server-wide, nobody can craft copper ingots at all. Afterwards the recipe
comes back for everyone, but each player still has to unlock *Smithing* before they can pick one up.
→ [Dual-Phase](/wiki/start-here/global-vs-individual#dual-phase-when-both-lists-target-the-same-content)
