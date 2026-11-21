---
title: Rollen & Podeste beschaffen
description: "History Stages bringt keine Rezepte für Rollen oder Podeste mit. Fertige Wege für KubeJS, CraftTweaker und ein einfaches Datapack."
sidebar_position: 3
---

# Rollen & Podeste beschaffen {/* #obtaining-scrolls--pedestals */}

History Stages bringt **keine Rezepte** für das [Forschungspodest](/wiki/in-game-tools/research/pedestal)
oder die [Forschungsrollen](/wiki/in-game-tools/research/scrolls) mit. Wie Spieler sich ihren
Fortschritt verdienen, entscheidet das Modpack, nicht die Mod. Solange du keinen Weg einbaust, kommt man
nur über `/give` oder den Kreativmodus daran.

Diese Seite hat fertige Rezepte für die drei üblichen Wege, KubeJS, CraftTweaker und ein einfaches
Datapack, dazu den Weg über Quest-Belohnungen und den Befehl zum Testen.

:::warning[Stage-IDs müssen genau stimmen]
Jedes Rollen-Rezept nennt eine Stage-ID, etwa `iron_age`. Sie muss genau zum Dateinamen in
`config/historystages/global/` oder `individual/` passen. Ein Tippfehler hier ist der häufigste Grund,
warum ein eigenes Rezept „nicht funktioniert“: Die Rolle lässt sich herstellen, aber das Podest lehnt
sie dann ab. → [Wo die Stage-Dateien liegen](/wiki/start-here/where-stage-files-live)
:::

:::info[Components, nicht NBT]
Ab Minecraft 1.20.5 nutzen Item-Daten **Data Components** (`minecraft:custom_data`) statt rohem NBT. Die
Beispiele unten nutzen die moderne Schreibweise. Für 1.20.4 und älter ersetzt du
`{"minecraft:custom_data":{...}}` durch die alte Form `{StageResearch:"..."}`.
:::

---

## KubeJS {/* #kubejs */}

Leg diese Dateien unter `kubejs/server_scripts/` ab.

### Forschungsrolle {/* #research-scroll */}

Funktioniert für **globale** und **individuelle** Stages, das Rezept ist gleich. Der `OwnerName` für individuelle Rollen wird automatisch gesetzt, wenn ein Spieler am Podest mit der Forschung beginnt, nicht beim Herstellen. Lass `StageResearch` einfach auf die Stage-ID zeigen, die du willst.

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

Ersetze `iron_age` durch deine Stage-ID, global oder individuell.

### Kreativ-Rolle {/* #creative-scroll */}

```js
ServerEvents.recipes(event => {
    event.shapeless(
        'historystages:creative_scroll',
        ['minecraft:nether_star', 'minecraft:writable_book', 'minecraft:paper']
    )
})
```

### Forschungspodest {/* #research-pedestal */}

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

## CraftTweaker {/* #crafttweaker */}

Leg diese Dateien unter `scripts/` ab. CraftTweaker nutzt ZenScript.

### Forschungsrolle {/* #research-scroll-1 */}

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
**MC 1.20.5+ / 1.21:** Ersetze `.withTag({...})` durch die Form mit Components:

```zenscript
<item:historystages:research_scroll>.withJsonComponents({
    "minecraft:custom_data": {StageResearch: "iron_age"} as IData
})
```
:::

Ersetze `iron_age` durch deine Stage-ID; funktioniert für globale und individuelle Stages.

### Kreativ-Rolle {/* #creative-scroll-1 */}

```zenscript
craftingTable.addShapeless("historystages_creative_scroll",
    <item:historystages:creative_scroll>,
    [<item:minecraft:nether_star>, <item:minecraft:writable_book>, <item:minecraft:paper>]
);
```

### Forschungspodest {/* #research-pedestal-1 */}

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

## Vanilla-Datapack {/* #vanilla-datapack */}

Leg es unter `data/<dein_pack>/recipe/` ab.

### Forschungsrolle für eine bestimmte Stage (`research_scroll_iron_age.json`) {/* #research-scroll-for-a-specific-stage-research_scroll_iron_agejson */}

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

## FTB Quests {/* #ftb-quests */}

Kein Rezept nötig. History Stages meldet eigene Aufgaben- und Belohnungs-Arten im FTB-Quests-Editor an,
also kann eine Quest eine Rolle vergeben oder die Rolle ganz überspringen und die Stage direkt als
Belohnung freischalten. Beide wählen ihr Ziel über eine durchsuchbare Stage-Auswahl statt über eine
getippte ID, und damit ist das Tippfehler-Problem von oben erledigt.

Rollen lassen sich auch als Struktur-Schatz oder Mob-Drop in Loot-Tables packen, wenn ein Modpack
Spieler sie lieber finden als herstellen lassen will. → [Mod-Kompatibilität](/wiki/server/mod-compatibility)

---

## Admin-Befehl (zum Testen) {/* #admin-command-for-testing */}

```text
/give @s historystages:research_scroll[minecraft:custom_data={StageResearch:"iron_age"}]
```

Für Minecraft 1.20.4 und älter:

```text
/give @s historystages:research_scroll{StageResearch:"iron_age"}
```

---

## Fehlersuche {/* #troubleshooting */}

| Problem | Wahrscheinliche Ursache |
| :--- | :--- |
| Rolle lässt sich herstellen, aber das Podest lehnt sie ab | Tippfehler in der Stage-ID; prüf `config/historystages/global/*.json` |
| Rezept erscheint nicht in JEI/EMI | Datapack/KubeJS wurde nicht neu geladen; führ `/reload` aus |
| Ergebnis-Item hat keinen Namen / heißt nur „Forschungsrolle“ | Feld `StageResearch` fehlt oder Groß-/Kleinschreibung des Schlüssels falsch |
| Altes NBT `{StageResearch:"..."}` geht auf 1.20.4, aber nicht auf 1.21 | Die neue Component-Form `minecraft:custom_data` nehmen |
| CraftTweaker `.withTag()` wirkt auf 1.21 nicht | Stattdessen `.withJsonComponents({...})` nehmen |
