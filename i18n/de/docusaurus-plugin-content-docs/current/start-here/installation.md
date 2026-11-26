---
title: Installation & deine erste Stage
description: "Was du neben History Stages installieren musst und wie du deine erste Stage im Editor im Spiel baust."
sidebar_position: 2
---

# Installation & deine erste Stage {/* #installation--your-first-stage */}

## Was du dazu brauchst {/* #what-you-need-alongside-it */}

**Lootr ist Pflicht.** ([Modrinth](https://modrinth.com/mod/lootr) ·
[CurseForge](https://www.curseforge.com/minecraft/mc-mods/lootr)) Truhen-Loot ist in Vanilla geteilt:
ein Behälter, ein Wurf, und wer ihn zuerst öffnet, nimmt alles. Das lässt sich nicht pro Spieler
filtern. Bei einer individuellen Stage würde ein gesperrtes Item also entweder für alle verschwinden
oder bei allen ankommen. Lootr gibt jedem Spieler seine eigene Sicht auf einen Behälter, und erst
dadurch wird [Loot-Filterung pro Spieler](/wiki/locking/items-and-recipes/loot) überhaupt möglich.
Ohne Lootr lädt History Stages nicht.

**Auf Fabric ist zusätzlich die Fabric API Pflicht**, wie bei fast jeder Fabric-Mod.

**Auf Minecraft 26.2 ist zusätzlich die Architectury API Pflicht**
([Modrinth](https://modrinth.com/mod/architectury-api) ·
[CurseForge](https://www.curseforge.com/minecraft/mc-mods/architectury-api)), auf NeoForge und auf
Fabric. Die 26.2-Version ist eine Mod für beide Loader, und Architectury ist das, worauf sie aufbaut.

**Empfohlen, aber nicht Pflicht:**

| | |
| :--- | :--- |
| [JEI](https://www.curseforge.com/minecraft/mc-mods/jei) oder [EMI](https://modrinth.com/mod/emi) | Zeichnet das Schloss-Overlay auf gesperrte Rezepte. Ohne Rezept-Browser bekommen Spieler keine Warnung, bevor sie etwas Gesperrtes herstellen wollen. |
| [Jade](https://modrinth.com/mod/jade) | Zeigt die nötige Stage an, wenn ein Spieler auf einen gesperrten Block, eine Kreatur, einen Rüstungsständer oder einen Rahmen schaut. |

## Erster Start {/* #first-launch */}

Installiere die Mod und starte das Spiel einmal. History Stages legt seine Ordner an und schreibt
seine Standard-Einstellungen:

```text
config/historystages/
    global/              Stage-Dateien, die für alle gelten
    individual/          Stage-Dateien, die pro Spieler gezählt werden
    settings/            visual.toml, gameplay.toml, graph.toml
    logs/                Lade-Berichte und Laufzeit-Logs
```

Noch ist nichts gesperrt. Die beiden Stage-Ordner sind leer, und ein leerer Ordner heißt: Das Spiel
bleibt, wie es ist.

## Deine erste Stage {/* #your-first-stage */}

![Der Dialog „Neue Stage“](/img/editor/new-stage.webp)

**Öffne den Editor.** Pausemenü, Knopf „History Stages“ oder `/history editor`. Du brauchst dafür
Berechtigungsstufe 2. Drück auf **Neue Stage**, gib ihr einen Anzeigenamen, und schon siehst du eine
Stage mit einem Reiter für alles, was sie sperren kann: Items, Tags, Mods, Rezepte, Flüssigkeiten,
Dimensionen, Strukturen, Biome, Zonen, Kreaturen, Handel.

Geh auf **Items**, such nach `iron_ingot`, hak es an und drück **Hinzufügen**. Speichern. Das ist schon
eine funktionierende Stage: Eisenbarren sind jetzt unerreichbar, bis jemand sie freischaltet.

So entsteht fast jedes Modpack. Die Auswahllisten lesen die echte Registry, also kannst du keine ID
eintippen, die es nicht gibt, und Speichern lädt sofort neu. Ab einer Handvoll Einträgen lohnt es sich
nicht mehr, IDs von Hand zu tippen.

### Dieselbe Stage als Datei {/* #the-same-stage-as-a-file */}

Der Editor schreibt einfaches JSON, eine Datei pro Stage, und diese Dateien lassen sich von Hand lesen
und bearbeiten. Zu wissen, wie sie aussehen, lohnt sich auch dann, wenn du nie eine selbst schreibst.
Der Rest dieses Wikis zeigt genau das, weil sich ein Feld leichter benennen lässt als ein Knopf.

Die Stage, die du gerade gebaut hast, liegt unter `config/historystages/global/<ihre id>.json`:

```json title="config/historystages/global/bronze_age.json"
{
  "display_name": "Bronze Age",
  "research_time": 60,
  "items": ["minecraft:iron_ingot"],
  "tags": ["c:ores/iron"],
  "recipes": ["minecraft:iron_pickaxe"]
}
```

Die **ID der Stage ist der Dateiname**: `bronze_age.json` ist die Stage `bronze_age`. Auf diese ID
beziehen sich Befehle, Abhängigkeiten und Skripte. `display_name` ist nur das, was Spieler lesen.

Eine Datei von Hand zu schreiben funktioniert gut. Dabei gelten zwei Regeln:

:::warning[Handänderungen brauchen ein Reload, und der Editor kann sie überschreiben]
Eine Datei, die du von Hand geändert hast, wirkt erst nach `/history reload`. Der Server liest die
Ordner beim Start und bei diesem Befehl, nicht wenn sich eine Datei ändert.

Und die Reihenfolge ist wichtig: Änderst du eine Datei und speicherst dann dieselbe Stage im Editor,
schreibt der Editor die ganze Datei aus der Version, die er noch im Speicher hat, und deine Änderung
ist weg. Erst neu laden, dann den Editor öffnen.
:::

Egal wie du sie gebaut hast: `/history global unlock bronze_age` schaltet die Stage frei, und
`/history global lock bronze_age` sperrt sie wieder.

## Spieler können noch nichts erforschen {/* #players-still-cannot-research-anything */}

History Stages bringt **keine Rezepte** für das Forschungspodest oder die Forschungsrollen mit. Das ist
Absicht: Wie Spieler sich ihren Fortschritt verdienen, entscheidet das Modpack, nicht die Mod. Solange
du keinen Weg einbaust, an sie zu kommen, geht es nur über `/give` oder den Kreativmodus.

→ [Rollen & Podeste beschaffen](/wiki/in-game-tools/research/obtaining) hat fertige Rezepte für KubeJS,
CraftTweaker, Vanilla-Datapacks und FTB Quests.

## Wie es weitergeht {/* #where-to-go-next */}

- [Auf einen Server bringen](/wiki/start-here/server-setup): dieselben Schritte für einen
  Multiplayer-Server, geschrieben für den ersten Modserver.
- [Globale vs. individuelle Stages](/wiki/start-here/global-vs-individual): welche der beiden du willst
  und welche Sperren nur in einer davon funktionieren. Lies das, bevor du ein Modpack planst.
- [Aufbau einer Stage-Datei](/wiki/stage-file/anatomy): jedes Feld, das eine Stage-Datei haben kann.
- [Wo die Stage-Dateien liegen](/wiki/start-here/where-stage-files-live): Ordner, Namensregeln und wie
  du eine Datei ablegst, ohne dass sie geladen wird.
- [Komplette Beispiele](/wiki/stage-file/complete-examples): ganze Stage-Dateien zum Kopieren.
- [Fehlersuche](/wiki/start-here/troubleshooting): wenn sich etwas nicht so verhält wie erwartet.
