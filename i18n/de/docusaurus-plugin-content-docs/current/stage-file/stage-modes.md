---
title: Stage-Modi
description: "Die fünf Wege, wie eine Stage freigeschaltet wird: Forschung am Podest, ein automatischer Auslöser, ein externer Befehl, eine Freischaltung auf Zeit, die sich selbst wieder sperrt, oder ein Zustand, der anhält."
sidebar_position: 2
---

# Stage-Modi {/* #stage-modes */}

Der `mode` einer Stage entscheidet, **wie sie freigeschaltet wird**, und damit auch, ob es überhaupt
eine [Forschungsrolle](/wiki/in-game-tools/research/scrolls) für sie gibt. Lässt du den Schlüssel weg,
ist die Stage `default`.

| Modus | Rolle? | Wird freigeschaltet, wenn |
| :--- | :--- | :--- |
| [`default`](#default) | ja | ein Spieler sie an einem [Podest](/wiki/in-game-tools/research/pedestal) erforscht |
| [`auto`](#auto) | nein | der Spieler etwas tut, das einen Auslöser auslöst |
| [`external`](#external) | ja | ein Befehl oder ein Skript es sagt; das Podest lehnt sie ab |
| [`temporary`](#temporary) | nein | ein Auslöser auslöst; danach sperrt sie sich nach einem Timer selbst wieder |
| [`conditional`](/wiki/stage-file/relocking#the-while-mode) | nein | ihre Auslöser zutreffen, und sie sperrt sich wieder, sobald sie nicht mehr zutreffen |

Welchen du nimmst, ist vor allem eine Frage, wer die Kontrolle hat. `default` legt sie in die Hand des
Spielers, `auto` macht sie zur Folge des Spielens, `external` lässt sie beim Modpack-Autor oder einer
Quest-Mod, `temporary` ist für alles, was enden soll, und `conditional` (im Editor **Solange**) folgt
einem Zustand, der kommt und geht. `default`- und `auto`-Stages können außerdem
[Sperr-Auslöser](/wiki/stage-file/relocking#lock-triggers) haben, die sie wieder schließen.

Modus und [Abhängigkeiten](/wiki/stage-file/dependencies) sind zwei verschiedene Dinge: Abhängigkeiten
sagen, was *bevor* eine Stage erforscht werden darf, erfüllt sein muss, und nur `default`- und
`external`-Stages haben eine Forschung, die man so absichern kann.

## Im Editor {/* #in-the-editor */}

**Stage-Einstellungen**, der Knopf im Bildschirm der Stage. Der Modus ist ein Auswahlmenü, und wählst
du einen, tauscht sich die Karte darunter gegen die Einstellungen dieses Modus aus: die Auslöser-Liste
für `auto`, Dauer und Abklingzeit für `temporary`, ein Hinweis für `external`, dass das Podest sie
ablehnt.

Auslöser fügst du aus einer durchsuchbaren Liste hinzu, darüber steht die Verknüpfung (einer oder
alle).

## default {/* #default */}

Der Standardmodus. Für die Stage wird eine Forschungsrolle erzeugt, und Spieler schalten sie frei,
indem sie diese Rolle an einem Forschungspodest erforschen.

```json
{
  "display_name": "Iron Age",
  "mode": "default"
}
```

Den Schlüssel `"mode"` kannst du ganz weglassen: `default` gilt für jede Stage, die keinen angibt.

## auto {/* #auto */}

Es wird keine Rolle erzeugt. Die Stage wird automatisch freigeschaltet, wenn der Spieler eine oder
mehrere **Auslöser-Bedingungen** aus dem Block `"auto_trigger"` erfüllt.

```json
{
  "display_name": "Nether Explorer",
  "mode": "auto",
  "auto_trigger": {
    "mode": "any",
    "triggers": [
      { "type": "dimension", "id": "minecraft:the_nether" },
      { "type": "advancement", "id": "minecraft:story/enter_the_nether" }
    ]
  }
}
```

### Verknüpfung {/* #combine-mode */}

Das Feld `"mode"` in `"auto_trigger"` legt fest, wie mehrere Auslöser ausgewertet werden:

| Wert | Verhalten |
| :--- | :--- |
| `"any"` *(Standard)* | Die Stage wird freigeschaltet, sobald **irgendein** Auslöser auslöst |
| `"all"` | Die Stage wird erst freigeschaltet, wenn **jeder** Auslöser ausgelöst hat |

### Auslöser-Arten {/* #trigger-types */}

Jeder Eintrag in `"triggers"` braucht ein Feld `"type"` und Parameter, die zur Art passen:

| Art | Parameter | Beschreibung |
| :--- | :--- | :--- |
| `"item"` | `"id"` | Spieler hebt das Item auf oder stellt es her |
| `"biome"` | `"id"` | Spieler betritt das Biom |
| `"dimension"` | `"id"` | Spieler betritt die Dimension |
| `"structure"` | `"id"` | Spieler betritt die Struktur |
| `"entity"` | `"id"`, `"sub_mode"` | Spieler interagiert mit einer Kreatur |
| `"block_place"` | `"id"` | Spieler platziert den Block |
| `"block_break"` | `"id"` | Spieler baut den Block ab |
| `"advancement"` | `"id"` | Spieler erreicht den Fortschritt |
| `"playtime"` | `"days"` | Spieler war N Spieltage online |
| `"stat"` | `"category"`, `"id"`, `"count"` | Eine Vanilla-Statistik erreicht `count` |
| `"xp_level"` | `"level"` | Spieler erreicht das Erfahrungslevel |
| `"effect"` | `"id"` | Spieler bekommt den Statuseffekt |
| `"weather"` | `"state"` | Das Wetter in der Dimension des Spielers |
| `"day_count"` | `"days"` | Die Welt erreicht Tag N |
| `"world_time"` | `"preset"`, `"from"`, `"to"` | Die Tageszeit |

Der Auslöser `"entity"` kennt ein optionales Feld `"sub_mode"`, das einschränkt, welche Interaktion
zählt:

| `sub_mode` | Verhalten |
| :--- | :--- |
| `"any"` *(Standard)* | Töten oder Interagieren löst die Stage aus |
| `"kill"` | Nur das Töten der Kreatur zählt |
| `"interact"` | Nur ein Rechtsklick auf die Kreatur zählt |

#### Der Auslöser `"stat"` {/* #the-stat-trigger */}

Der allgemeine, und meistens der, den du willst. `"category"` nennt, welche der neun Vanilla-Statistik-
Arten gelesen wird, und `"id"` wird in der Registry dieser Kategorie nachgeschlagen:

| `category` | `id` kommt aus | Beispiel |
| :--- | :--- | :--- |
| `"custom"` | Der Registry für eigene Statistiken | `minecraft:fish_caught` |
| `"mined"` | Blöcke | `minecraft:diamond_ore` |
| `"crafted"` | Items | `minecraft:bread` |
| `"used"` | Items | `minecraft:diamond_pickaxe` |
| `"broken"` | Items | `minecraft:iron_axe` |
| `"picked_up"` | Items | `minecraft:emerald` |
| `"dropped"` | Items | `minecraft:rotten_flesh` |
| `"killed"` | Kreatur-Arten | `minecraft:zombie` |
| `"killed_by"` | Kreatur-Arten | `minecraft:creeper` |

Weil `"custom"` die ganze Registry für eigene Statistiken erreicht, brauchen einige Dinge, die nach
einem eigenen Auslöser aussehen, gar keinen: Angeln (`minecraft:fish_caught`), Schlafen
(`minecraft:sleep_in_bed`), gelaufene Strecke (`minecraft:walk_one_cm`), Reitzeit, ausgeteilter
Schaden. Bevor du nach einer neuen Auslöser-Art fragst, schau, ob das Spiel es nicht schon zählt.

`"count"` ist mindestens 1. Eine Schwelle von 0 hätte jeder Spieler erfüllt, bevor er überhaupt etwas
getan hat. Eine `"category"`, die diese Version nicht kennt, oder eine `"id"`, die in ihrer Registry
fehlt, löst nie aus.

#### Der Auslöser `"weather"` {/* #the-weather-trigger */}

`"state"` ist einer von `"clear"`, `"rain"` oder `"thunder"`.

`"rain"` trifft auch bei Gewitter zu, weil Vanillas eigenes `isRaining()` das tut. Nimm `"thunder"`,
wenn du nur das Gewitter meinst, und `"clear"` für trockenes Wetter.

#### Der Auslöser `"world_time"` {/* #the-world_time-trigger */}

`"preset"` ist einer von `"day"`, `"sunset"`, `"night"`, `"sunrise"` oder `"custom"`:

| `preset` | Fenster (Ticks) |
| :--- | :--- |
| `"day"` | 0 – 11999 |
| `"sunset"` | 12000 – 12999 |
| `"night"` | 13000 – 22999 |
| `"sunrise"` | 23000 – 23999 |

Mit `"custom"` werden stattdessen `"from"` und `"to"` gelesen, beide auf 0 – 23999 begrenzt. Ist
`"from"` größer als `"to"`, läuft das Fenster über Mitternacht, statt leer zu sein: `22000` bis `2000`
sind die vier Stunden um Mitternacht. Die benannten Presets haben ihr eigenes Fenster und schreiben
deshalb kein `"from"` oder `"to"` in die Datei.

#### Beispiele {/* #examples */}

```json
"triggers": [
  { "type": "item", "id": "minecraft:diamond" },
  { "type": "biome", "id": "minecraft:jungle" },
  { "type": "entity", "id": "minecraft:villager", "sub_mode": "interact" },
  { "type": "playtime", "days": 3 },
  { "type": "stat", "category": "used", "id": "minecraft:diamond_pickaxe", "count": 50 },
  { "type": "xp_level", "level": 30 },
  { "type": "effect", "id": "minecraft:blindness" },
  { "type": "weather", "state": "thunder" },
  { "type": "day_count", "days": 7 },
  { "type": "world_time", "preset": "night" },
  { "type": "world_time", "preset": "custom", "from": 22000, "to": 2000 }
]
```

## external {/* #external */}

Es **wird** eine Rolle erzeugt, aber das Forschungspodest lehnt es ab, sie zu erforschen. Freischalten
kann die Stage nur ein Server-Operator mit
[`/history global unlock <stage>`](/wiki/server/commands) oder ein [Skript](/wiki/server/scripting).

Nimm das, wenn das Freischalten ganz beim Modpack-Autor bleiben soll: eine FTB-Quests-Belohnung, ein
eigenes Event, eine Zeremonie, die von Hand läuft. Die Rolle gibt es trotzdem, also können Spieler
lesen, was die Stage zurückhält, und sie im [Stufen-Graph](/wiki/in-game-tools/stage-graph) sehen. Sie
können sich nur nicht hineinforschen.

```json
{
  "display_name": "Prestige Unlock",
  "mode": "external"
}
```

## temporary {/* #temporary */}

Wie `auto`, aber die Stage **sperrt sich nach einer eingestellten Dauer automatisch wieder**. Es wird
keine Rolle erzeugt.

Nimm das für alles, was enden soll: ein Handelsfenster, ein saisonaler Buff, ein wiederkehrendes Event
mit Abklingzeit.

Ein laufender Timer und die Anzahl der Auslösungen sind Laufzeit-Zustand, nicht Datei-Zustand, also
kann man sie nicht aus der Stage-Datei lesen.
[`/history temporary`](/wiki/server/commands#temporary-stage-commands) zeigt und setzt sie zurück:
`info`, `reset` und `setcount`, für globale und individuelle Stages gleichermaßen.

```json
{
  "display_name": "Harvest Festival",
  "mode": "temporary",
  "auto_trigger": {
    "triggers": [
      { "type": "advancement", "id": "mypack:events/harvest_begins" }
    ]
  },
  "temporary": {
    "duration": 3,
    "duration_unit": "days",
    "max_triggers": 0,
    "cooldown": 12,
    "cooldown_unit": "hours"
  }
}
```

### Optionen von `temporary` {/* #temporary-options */}

| Schlüssel | Typ | Standard | Beschreibung |
| :--- | :--- | :--- | :--- |
| `duration` | Integer | `1` | Wie lange die Stage nach dem Auslösen freigeschaltet bleibt |
| `duration_unit` | String | `"hours"` | Einheit für `duration`: `"seconds"`, `"minutes"`, `"hours"` oder `"days"` |
| `max_triggers` | Integer | `1` | Wie oft die Stage insgesamt höchstens freigeschaltet werden darf (siehe unten) |
| `cooldown` | Integer | `0` | Wartezeit nach dem Wiedersperren, bevor der Auslöser wieder angenommen wird |
| `cooldown_unit` | String | `"hours"` | Einheit für `cooldown`: dieselben Optionen wie bei `duration_unit` |

### `max_triggers` im Detail {/* #max_triggers-in-detail */}

- **`1`**: Die Stage wird genau einmal freigeschaltet und bleibt danach für immer gesperrt. Die
  Abklingzeit gilt nicht. Ein Server-Operator kann sie trotzdem per `/history global unlock` von Hand
  freischalten, das startet aber keinen neuen Timer.
- **`N > 1`**: Die Stage darf insgesamt bis zu N-mal freigeschaltet werden. Nach jedem Wiedersperren
  muss die Abklingzeit vergehen, bevor der Auslöser wieder angenommen wird.
- **`0`**: unbegrenzt oft. Nach jedem Wiedersperren verhindert nur die Abklingzeit ein sofortiges
  erneutes Auslösen. Eine Abklingzeit von `0` heißt, die Stage kann sofort wieder auslösen.

:::note[Sterben beendet einen laufenden Timer vorzeitig]
Hat eine individuelle `temporary`-Stage auch
[`lose_on_death`](/wiki/start-here/global-vs-individual#lose-on-death), beendet der Tod den Timer und
startet die Abklingzeit, als wäre er von selbst abgelaufen. Für `max_triggers` zählt das genauso wie
ein normales Ablaufen.
:::

## Siehe auch {/* #see-also */}

- [Abhängigkeiten](/wiki/stage-file/dependencies): was erledigt sein muss, bevor eine `default`- oder
  `external`-Stage erforscht werden darf.
- [Forschungsrollen](/wiki/in-game-tools/research/scrolls): das Item, das `default`- und
  `external`-Stages erzeugen.
- [Befehle](/wiki/server/commands): Freischalten, Wiedersperren und die `temporary`-Unterbefehle.
