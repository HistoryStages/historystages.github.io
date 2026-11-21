---
title: Komplette Beispiele
description: "Ganze Stage-Dateien zum Kopieren, jede mit dem Ordner, in den sie gehört."
sidebar_position: 8
---

# Komplette Beispiele {/* #complete-examples */}

Ganze Stage-Dateien zum Kopieren. Jede sagt, in welchen Ordner sie gehört, weil
[genau das entscheidet, ob sie global oder individuell ist](/wiki/start-here/global-vs-individual),
und einige davon nutzen Felder, die nur in einer der beiden Arten funktionieren.

Sie sind zum Lesen da und zum direkten Ablegen in einem Config-Ordner. Dasselbe im
[Editor](/wiki/in-game-tools/in-game-editor) zu bauen geht meistens schneller und ist das, was die
meisten Modpacks machen. Leg eine Datei nur ab, wenn du von einem dieser Beispiele ausgehen willst, und
führ danach `/history reload` aus.

Engere Beispiele Feld für Feld stehen auf der Seite der jeweiligen Sperr-Art; diese hier zeigen, wie
die Teile zusammenpassen.

## Eine erste globale Stage {/* #a-first-global-stage */}

Items und Rezepte, sonst nichts. Das Brot-und-Butter-Geschäft eines Modpacks mit Epochen.

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

## Eine ganze Mod sperren, mit Ausnahme {/* #locking-a-whole-mod-with-an-exception */}

`mods` sperrt alles, was eine Mod registriert; `mod_exceptions` nimmt einzelne Items wieder heraus. So
sperrt ein Modpack Create, lässt aber das Einstiegs-Bauteil herstellbar.

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

## Eine Dimension und ihre Bewohner sperren {/* #gating-a-dimension-and-its-inhabitants */}

`spawnlock` geht **nur global**: Ein spawnender Mob weiß nicht, für wen er erscheint. Diese Datei
gehört nach `global/`.

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

Seit 6.0 bedeutet eine Spawn-Sperre keine Angriffs-Sperre mehr, deshalb stehen Lohe und
Witherskelett extra da. Ein Ghast aus einem Spawn-Ei ist ein ganz normaler Ghast und lässt sich
schlagen.

## Ein persönlicher Skill-Pfad {/* #a-personal-skill-path */}

Individuelle Stage: Jeder Spieler schaltet sie selbst frei. Die Abhängigkeiten hier, XP-Level und eine
Kill-Anzahl, gehen **nur individuell**, ebenso `lose_on_death`. Alles davon gehört nach
`individual/`.

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

Das Diamantschwert lässt sich tragen und ausrüsten, aber nicht schwingen, weil `unlock_actions`
auflistet, was frei bleibt. Sterben sperrt die Stage wieder, und weil das beim Tod passiert und nicht
beim Respawn, landet das Netheritschwert in den Drops.

## Sperren nach NBT {/* #nbt-specific-locking */}

Nur die verzauberten Bücher mit Reparatur werden gesperrt; jedes andere verzauberte Buch bleibt normal.

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

## Eine Spawn-Regel mit Bedingungen {/* #a-spawn-rule-with-conditions */}

Zombies spawnen weiter unter der Erde, aber nicht bei Tageslicht an der Oberfläche; Silberfische
tauchen in den Tafelbergen auf, sobald die Stage offen ist, wo sie sonst nicht vorkommen würden.
Globale Stage.

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

`phase: "after_unlock"` dreht eine Regel um: Sie tut nichts, solange die Stage gesperrt ist, und
wirkt, sobald sie offen ist. So lässt eine Stage etwas *anfangen*, statt es zu stoppen.

## Flüssigkeiten, Handel und eine Zone {/* #fluids-trades-and-a-zone */}

Die drei Kategorien aus 6.0.0 in einer Datei. Der Flüssigkeits-Eintrag ist eingegrenzt, damit Lava
weiter aufgehoben werden kann; gesperrt sind nur Benutzen, Platzieren und ihre Rezepte. Die Zone
riegelt die Caldera ab, bis die Stage offen ist.

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

Lässt du eine Regel in `rules` weg, behält sie ihren Standard: Die vier Interaktions-Schalter sind an,
solange du sie nicht ausschaltest, alles andere ist aus, solange du es nicht einschaltest.

:::warning
Ohne `unlock_actions` sperrt ein Flüssigkeits-Eintrag alle sieben seiner Aktionen, und dazu gehört
jedes Rezept, das die Flüssigkeit *verbraucht*. `minecraft:water` ohne Eingrenzung zu sperren nimmt in
einem großen Modpack eine vierstellige Zahl an Rezepten heraus. →
[Flüssigkeiten](/wiki/locking/items-and-recipes/fluids)
:::

## Biom- und Interaktions-Sperren {/* #biome-and-interaction-locking */}

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

Spieler überleben in Wüsten und Savannen nicht, bis die Stage offen ist, und Kamele lassen sich frei
reiten, aber nicht satteln, und das nur, solange wirklich ein Sattel in der Hand ist.

## Begrenzen, wie oft eine Struktur generiert {/* #capping-how-often-a-structure-generates */}

Die Weltgenerierung passiert einmal, dauerhaft und für die ganze Welt, deshalb geht `block_generation`
**nur global**. Höchstens drei Dörfer generieren, solange die Stage gesperrt ist; danach ist die
Dorf-Generierung wieder unbegrenzt.

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

## Das Aushängeschild: eine Endgame-Stage {/* #the-flagship-an-endgame-stage */}

Mehrere Mechaniken auf einmal. Alles hier funktioniert in einer **globalen** Stage. Beachte, dass
`structures` die Object-Form nimmt und dass die Abhängigkeiten von der Art sind, die eine globale Stage
wirklich messen kann (eine Abgabe am Podest und eine schon freigeschaltete Stage).

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

:::note[Warum hier keine XP-Level und Kill-Anzahlen]
Fortschritte, XP-Level, getötete Kreaturen und erfasste Statistiken brauchen einen eindeutigen Forscher,
und eine globale Stage hat keinen, denn eine globale Rolle hat keinen Besitzer. In einer globalen Stage
werden sie übersprungen statt geprüft. Pack sie in eine individuelle Stage, wie im Beispiel Monster
Hunter oben. → [Abhängigkeiten](/wiki/stage-file/dependencies#four-of-them-are-individual-only)
:::

## Ein Paar bilden: die Dual-Phase-Sperre {/* #making-a-pair-the-dual-phase-lock */}

Derselbe Eintrag in einer globalen *und* einer individuellen Stage schaltet von selbst eine zweistufige
Sperre ein. In den Dateien steht das nirgends, die Überschneidung macht es.

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

Bis *Bronze Age* serverweit offen ist, kann niemand Kupferbarren herstellen. Danach kommt das Rezept
für alle zurück, aber jeder Spieler muss erst *Smithing* freischalten, bevor er einen aufheben kann. →
[Dual-Phase](/wiki/start-here/global-vs-individual#dual-phase-when-both-lists-target-the-same-content)
