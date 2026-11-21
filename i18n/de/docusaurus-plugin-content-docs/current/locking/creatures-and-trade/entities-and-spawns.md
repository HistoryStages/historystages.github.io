---
title: Kreaturen & Spawns
description: "Angriffe verhindern, Interaktionen außerhalb des Kampfes verhindern und Spawn-Regeln mit Bedingungen für Ort, Zeit und Wetter schreiben."
sidebar_position: 1
---

# Kreaturen & Spawns {/* #entities--spawns */}

Das Object `entities` enthält drei unabhängige Listen. Sie beantworten drei verschiedene Fragen, und
seit 6.0 bedeutet keine davon eine andere mit:

```json
{
  "entities": {
    "attacklock": ["minecraft:zombie"],
    "interactionlock": ["minecraft:villager"],
    "spawnlock": ["minecraft:ghast"]
  }
}
```

| Liste | Frage | Stage-Art |
| :--- | :--- | :--- |
| [`attacklock`](#attacklock) | Darf der Spieler sie schlagen? | global + individuell |
| [`interactionlock`](#interactionlock) | Darf der Spieler sie züchten, reiten, scheren, benennen? | global + individuell |
| [`spawnlock`](#spawnlock) | Darf sie überhaupt erscheinen? | **nur global** |

## Im Editor {/* #in-the-editor */}

Die drei Listen sind drei eigene Reiter: **Angriff**, **Interaktion** und **Spawn**. Die
Kreaturen-Auswahl funktioniert wie die Item-Auswahl, Mehrfachauswahl eingeschlossen.

Ein Spawn-Eintrag ist eine Regel statt eines Häkchens. **Rechtsklick darauf** und **SpawnControl** für
den vollständigen [Spawn-Dialog](/wiki/in-game-tools/in-game-editor#the-spawn-rule-dialog): oben die
Phase, dann Quellen, Ort, Zeit & Wetter und Zusätzliche Biome als Reiter, mit einer Zeile darunter, die
die fertige Regel in Worten ausschreibt.

Ein Interaktions-Eintrag bietet per Rechtsklick **Interaktions-Aktionen** für seine Aktionsliste und
**Item-Filter** für die Bedingung zum gehaltenen Item. Angriffs- und Interaktions-Einträge bieten beide
per Rechtsklick **NBT bearbeiten**, um sie [auf manche Kreaturen einzugrenzen](#only-some-creatures-of-a-type).

## `attacklock` {/* #attacklock */}

Eine Liste von Kreatur-IDs oder [Objects mit NBT-Filter](#only-some-creatures-of-a-type). Solange die
Stage gesperrt ist, wird jeder Angriff des Spielers auf eine davon abgebrochen.

```json
"attacklock": ["minecraft:blaze", "minecraft:wither_skeleton"]
```

Ansonsten ist der Mob ganz normal: Er spawnt, bewegt sich und wehrt sich. Das ist der Weg, den
Kampf-Fortschritt auch mit individuellen Stages zu sperren, weil immer ein Spieler angreift.

Die Rückmeldung stellst du unter
[`[mob_lock]`](/wiki/server/config-files/visual-toml#dimension_lock-and-mob_lock) ein, den Wortlaut
unter `mobUnknown` in [`[lock_messages]`](/wiki/server/config-files/visual-toml#lock_messages).

## `interactionlock` {/* #interactionlock */}

Alles, was kein Kampf ist: benennen, anleinen, scheren, melken, züchten, handeln, reiten, Rüstung und
Sättel anlegen. Angreifen und Spawnen bleiben unberührt.

Seit 6.2.0 nimmt die Liste auch **Boote, Kistenboote und Loren**, die keine Kreaturen sind und vorher
in der Auswahl fehlten. Einsteigen zählt als `mount`.

Ein Eintrag ist entweder eine einfache Kreatur-ID, die jede erkannte Interaktion blockiert, oder ein
Object:

```json
"interactionlock": [
  "minecraft:villager",
  {
    "id": "minecraft:horse",
    "unlock_actions": ["mount"],
    "lock_items": ["minecraft:saddle"]
  }
]
```

| Feld | Typ | Was es tut |
| :--- | :--- | :--- |
| `unlock_actions` | Strings | Aktionen, die **frei** bleiben; alles andere bleibt blockiert. Erkannt werden: `breed`, `mount`, `trade`, `leash`, `shear`, `milk`, `name`, `equip`, `other`. |
| `lock_items` | Strings / Objects | Ein Filter für das gehaltene Item. Die Sperre gilt nur, solange der Spieler eins davon hält: Item-IDs, `#tag`-Einträge oder `{ "id": …, "nbt": {…} }`-Objects. Ohne Angabe gilt die Sperre egal was gehalten wird, leere Hand eingeschlossen. |

Im Beispiel lässt sich mit Dorfbewohnern gar nicht interagieren. Pferde lassen sich frei reiten, aber
nicht satteln, züchten oder anleinen, und das nur, solange wirklich ein Sattel in der Hand ist.

`unlock_actions` funktioniert hier genauso herum wie bei
[Items](/wiki/locking/items-and-recipes/unlock-actions): Die Liste ist das, was verfügbar bleibt.

## Nur manche Kreaturen einer Art {/* #only-some-creatures-of-a-type */}

Seit 6.2.0 kann ein Eintrag in `attacklock` oder `interactionlock` einen `nbt`-Filter haben, der gegen
die gespeicherten Daten der Kreatur geprüft wird. Die Sperre trifft dann nur die Kreaturen, die passen:
Eichenboote, aber keine Birkenboote, ein Zombie mit einem bestimmten Command-Tag, ein Pferd, das nie
despawnt.

```json
"interactionlock": [
  { "id": "minecraft:boat", "nbt": [{ "Type": "oak" }, { "Type": "spruce" }] }
],
"attacklock": [
  { "id": "minecraft:zombie", "nbt": { "Tags": ["boss"] } }
]
```

`nbt` ist ein Object oder eine Liste davon, und eins aus der Liste reicht, dieselbe Form wie bei
[Item-Kriterien](/wiki/locking/items-and-recipes/nbt-and-components#several-variants-any-one-is-enough).
Ein Eintrag ohne `nbt` bleibt eine einfache ID und trifft jede Kreatur dieser Art.

Der Bildschirm **NBT bearbeiten** ist gebaut wie der für Items: Vorlagen mit jeweils einer
Beschreibung (lautlos, keine Schwerkraft, Command-Tags, Leben, …), eine Liste der Schlüssel, die diese
Kreatur-Art tatsächlich speichert, und **Von einer Kreatur übernehmen**, was die liest, die du
anschaust oder neben der du stehst. Boote und Kistenboote bieten per Rechtsklick **Holzarten** als
Abkürzung für den häufigsten Fall.

Spawn-Regeln nehmen keinen NBT-Filter.

## `spawnlock` {/* #spawnlock */}

Eine Spawn-Regel: welche Quellen sie abdeckt, wann sie gilt und unter welchen Bedingungen die Kreatur
trotzdem erscheinen darf. **Nur globale Stages**: Ein Spawn weiß nicht, für wen er erscheint, und eine
individuelle Sperre braucht einen konkreten Spieler.

:::warning[Geändert in 6.0: Eine Spawn-Sperre bedeutet keine Angriffs-Sperre mehr]
Bis 6.0.0 hielt eine Spawn-Sperre Spieler auch davon ab, die Kreatur zu schlagen. Diese Kopplung ist
ganz weg: Ob eine Kreatur geschlagen werden darf, ist eine andere Frage als ob sie erscheinen darf, und
ein Zombie aus einem Spawner oder Ei ist ein ganz normaler Zombie.

Eine Stage, die sich darauf verlassen hat, lässt die Kreatur jetzt angreifbar. Trag sie zusätzlich in
`attacklock` ein, wenn du das wolltest.
:::

Die einfache Form ist eine einfache Kreatur-ID, die jede Quelle überall blockiert:

```json
"spawnlock": ["minecraft:skeleton"]
```

**Alles, was ein bestehendes Modpack schon geschrieben hat, funktioniert weiter und wird unverändert
zurückgeschrieben.** Eine Regel, die das alte Format ausdrücken kann, also `unlock_sources` und
`unlock_dimensions`, wird genau in dieser Form gespeichert. Stage-Dateien, die die neuen Optionen nie
anfassen, bleiben Byte für Byte gleich.

| Feld | Bedeutung |
| :--- | :--- |
| `id` | Die Kreatur. |
| `unlock_sources` | Quellen, die **nicht** blockiert sind; alles andere ist es. Erkannt werden: `natural`, `spawner`, `structure`, `breeding`, `summon`, `spawn_egg`. Ohne Angabe ist jede Quelle blockiert. |
| `phase` | `"while_locked"` (Standard): Die Regel gilt, bis die Stage offen ist. `"after_unlock"`: Sie gilt erst, wenn die Stage offen ist. So lässt du etwas *anfangen* zu erscheinen, statt es zu stoppen. |
| `conditions` | Wo und wann die Kreatur trotzdem spawnen darf. Jedes Feld ist optional; alle vorhandenen müssen zutreffen. |
| `extra_biomes` | Biome, in denen die Kreatur **zusätzlich** spawnt. |
| `unlock_dimensions` | Die Schreibweise vor 6.0 für eine Bedingung „nur in diesen Dimensionen“. Wird weiter gelesen; neue Regeln schreiben stattdessen `conditions.dimensions`. |

### `conditions` {/* #conditions */}

```json
"spawnlock": [
  {
    "id": "minecraft:phantom",
    "conditions": {
      "dimensions": { "mode": "only", "ids": ["minecraft:overworld"] },
      "biomes":     { "mode": "exclude", "ids": ["#minecraft:is_ocean"] },
      "sky": "visible",
      "y": { "min": 60, "max": 180 },
      "time": "night",
      "light": { "min": 0, "max": 7 },
      "weather": "clear",
      "moon_phases": [0, 4]
    }
  }
]
```

| Feld | Werte |
| :--- | :--- |
| `dimensions`, `biomes` | `mode` ist `"only"` oder `"exclude"`; `ids` sind IDs, und Biome nehmen auch `#tag`-Einträge. |
| `sky` | `"visible"` oder `"hidden"`: ob die Spawn-Position den Himmel sieht. |
| `y` | `{ "min", "max" }`, einschließlich. Ein vertauschtes Paar wird getauscht statt abgelehnt. |
| `time` | `"day"` oder `"night"`. |
| `light` | `{ "min", "max" }`, 0–15 einschließlich. |
| `weather` | `"clear"`, `"rain"` oder `"thunder"`. Ein Gewitter zählt auch als Regen. |
| `moon_phases` | Eine Liste von Phasen-Nummern, 0–7. |

### `extra_biomes` {/* #extra_biomes */}

Das Gegenteil einer Sperre: Biome, in denen die Kreatur spawnt, in denen sie es sonst nicht tun würde.

```json
"extra_biomes": {
  "ids": ["minecraft:desert", "#minecraft:is_badlands"],
  "weight": 30,
  "min_group": 2,
  "max_group": 4,
  "ignore_spawn_rules": false
}
```

Lässt du `weight`, `min_group` und `max_group` weg, wird die Häufigkeit aus den Biomen übernommen, in
denen die Kreatur schon spawnt. `ignore_spawn_rules` überspringt die eigenen Platzierungsregeln der
Kreatur, etwa ihr Lichtlevel oder ihre bevorzugte Oberfläche, aber nicht die physikalischen: Etwas
braucht weiterhin Platz und festen Boden, und ein Fisch braucht weiterhin Wasser.

Der Rest der `conditions` der Regel gilt hier auch; nur die Biom-Bedingung wird beiseitegelassen, weil
sie sonst genau das Biom ausschließen würde, das hinzugefügt wird.

**Vier Grenzen, die du kennen solltest, bevor du darauf aufbaust:**

- **Tiere, die bei der Weltgenerierung platziert werden, kommen nicht dazu.** Die Chunk-Generierung
  liest die eigene Liste des Bioms direkt. Zusätzliche Biome wirken nur auf das laufende natürliche
  Spawnen: Bei Monstern merkt man das nicht, bei Tieren in schon erkundetem Land schon.
- **Nether und End melden eine feste Uhrzeit**, also ist eine `time`-Bedingung dort konstant.
- **Wetter gilt pro Welt, nicht pro Biom.** `"rain"` trifft auch in einer Wüste zu, während es woanders
  regnet.
- **Platz und Boden zählen weiterhin**, auch mit `ignore_spawn_rules`.

## Spawn-Regeln im Editor bauen {/* #building-spawn-rules-in-the-editor */}

Spawn-Regeln werden normalerweise im Spawn-Dialog des Editors gebaut statt getippt: oben die Phase,
dann vier Reiter (Quellen, Ort, Zeit & Wetter, Zusätzliche Biome) und eine Zeile darunter, die die ganze
Regel in Worten ausschreibt. →
[Editor im Spiel](/wiki/in-game-tools/in-game-editor#the-spawn-rule-dialog)

## Siehe auch {/* #see-also */}

- [Händler-Angebote](/wiki/locking/creatures-and-trade/merchant-trades): sperren, was ein Dorfbewohner
  handelt. Das ist eine andere Frage als ob du mit ihm interagieren darfst.
- [Zonen](/wiki/locking/world/zones): Eine Zone kann natürliches Spawnen in einem Bereich unterdrücken.
  Das ist dieselbe Frage, gestellt für einen Ort statt für eine Art.
- [Komplette Beispiele](/wiki/stage-file/complete-examples#a-spawn-rule-with-conditions)
