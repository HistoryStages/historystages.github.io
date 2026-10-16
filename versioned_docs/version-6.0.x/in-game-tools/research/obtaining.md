---
title: Obtaining Scrolls & Pedestals
description: "History Stages ships no recipes for scrolls or pedestals — ready-made routes for KubeJS, CraftTweaker and a plain datapack."
sidebar_position: 3
---

# Obtaining Scrolls & Pedestals

History Stages ships **no recipes** for the [Research Pedestal](/wiki/6.0.x/in-game-tools/research/pedestal)
or the [Research Scrolls](/wiki/6.0.x/in-game-tools/research/scrolls). How players earn the right to
progress is a pack decision, not a mod decision — so until you add a route, the only way to get one
is `/give` or creative mode.

This page has ready-made recipes for the three usual routes — KubeJS, CraftTweaker and a plain
datapack — plus the quest-reward route and the command for testing.

:::warning[Stage ids have to match exactly]
Every scroll recipe names a stage id, such as `iron_age`. It has to match the file name in
`config/historystages/global/` or `individual/` exactly. A typo here is the most common reason a
custom recipe "doesn't work" — the scroll crafts, and the pedestal then refuses it. →
[Where Stage Files Live](/wiki/6.0.x/start-here/where-stage-files-live)
:::

:::info[Components, not NBT]
From Minecraft 1.20.5 on, item data uses **data components** (`minecraft:custom_data`) rather than
raw NBT. The examples below use the modern syntax. For 1.20.4 and older, replace
`{"minecraft:custom_data":{...}}` with the old `{StageResearch:"..."}` form.
:::

---

## KubeJS

Place these files under `kubejs/server_scripts/`.

### Research Scroll

Works for both **global** and **individual** stages — the recipe form is identical. The `OwnerName` for individual scrolls is set automatically when a player starts researching at the pedestal, not at craft time. Just point `StageResearch` at the stage ID you want.

```js
ServerEvents.recipes(event => {
    event.shaped(
        Item.of('historystages:research_scroll', '{"minecraft:custom_data":{StageResearch:"iron_age"}}'),
        [
            'PPP',
            'PBP',
            'PPP'
        ],
        {
            P: 'minecraft:paper',
            B: 'minecraft:book'
        }
    )
})
```

Replace `iron_age` with your stage ID — global or individual.

### Creative Scroll

```js
ServerEvents.recipes(event => {
    event.shapeless(
        'historystages:creative_scroll',
        ['minecraft:nether_star', 'minecraft:writable_book', 'minecraft:paper']
    )
})
```

### Research Pedestal

```js
ServerEvents.recipes(event => {
    event.shaped(
        'historystages:research_pedestal',
        [
            'GBG',
            'SLS',
            'SSS'
        ],
        {
            G: 'minecraft:gold_ingot',
            B: 'minecraft:writable_book',
            S: 'minecraft:smooth_stone',
            L: 'minecraft:lectern'
        }
    )
})
```

---

## CraftTweaker

Place these files under `scripts/`. CraftTweaker uses ZenScript.

### Research Scroll

```zenscript
craftingTable.addShaped("historystages_research_scroll_iron_age",
    <item:historystages:research_scroll>.withTag({StageResearch: "iron_age" as string}),
    [
        [<item:minecraft:paper>, <item:minecraft:paper>, <item:minecraft:paper>],
        [<item:minecraft:paper>, <item:minecraft:book>,  <item:minecraft:paper>],
        [<item:minecraft:paper>, <item:minecraft:paper>, <item:minecraft:paper>]
    ]
);
```

:::info
**MC 1.20.5+ / 1.21:** Replace `.withTag({...})` with the component-based form:

```zenscript
<item:historystages:research_scroll>.withJsonComponents({
    "minecraft:custom_data": {StageResearch: "iron_age"} as IData
})
```
:::

Replace `iron_age` with your stage ID — works for global and individual stages.

### Creative Scroll

```zenscript
craftingTable.addShapeless("historystages_creative_scroll",
    <item:historystages:creative_scroll>,
    [<item:minecraft:nether_star>, <item:minecraft:writable_book>, <item:minecraft:paper>]
);
```

### Research Pedestal

```zenscript
craftingTable.addShaped("historystages_research_pedestal",
    <item:historystages:research_pedestal>,
    [
        [<item:minecraft:gold_ingot>,   <item:minecraft:writable_book>, <item:minecraft:gold_ingot>],
        [<item:minecraft:smooth_stone>, <item:minecraft:lectern>,       <item:minecraft:smooth_stone>],
        [<item:minecraft:smooth_stone>, <item:minecraft:smooth_stone>,  <item:minecraft:smooth_stone>]
    ]
);
```

---

## Vanilla Datapack

Place under `data/<your_pack>/recipe/`.

### Research Scroll for a specific stage (`research_scroll_iron_age.json`)

```json
{
  "type": "minecraft:crafting_shaped",
  "pattern": [
    "PPP",
    "PBP",
    "PPP"
  ],
  "key": {
    "P": { "item": "minecraft:paper" },
    "B": { "item": "minecraft:book" }
  },
  "result": {
    "id": "historystages:research_scroll",
    "count": 1,
    "components": {
      "minecraft:custom_data": {
        "StageResearch": "iron_age"
      }
    }
  }
}
```

---

## FTB Quests

No recipe needed. History Stages registers its own task and reward types in the FTB Quests editor,
so a quest can hand out a scroll, or skip the scroll entirely and unlock the stage directly as a
reward. Both pick their target through a searchable stage picker rather than a typed id, which
removes the typo problem above.

Scrolls can also be put into loot tables as structure treasure or mob drops, if a pack would rather
have players find them than craft them. → [Mod Compatibility](/wiki/6.0.x/server/mod-compatibility)

---

## Admin Command (for testing)

```text
/give @s historystages:research_scroll[minecraft:custom_data={StageResearch:"iron_age"}]
```

For Minecraft 1.20.4 and older:

```text
/give @s historystages:research_scroll{StageResearch:"iron_age"}
```

---

## Troubleshooting

| Problem | Likely cause |
| :--- | :--- |
| Scroll crafts but pedestal rejects it | Stage ID typo — check `config/historystages/global/*.json` |
| Recipe doesn't appear in JEI/EMI | Datapack/KubeJS didn't reload — run `/reload` |
| Result item has no name / falls back to "Research Scroll" | `StageResearch` field missing or wrong key casing |
| Old `{StageResearch:"..."}` NBT works on 1.20.4 but not 1.21 | Use the new `minecraft:custom_data` component form |
| CraftTweaker `.withTag()` doesn't apply on 1.21 | Use `.withJsonComponents({...})` instead |
