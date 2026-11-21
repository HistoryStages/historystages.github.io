---
title: Abhängigkeiten
description: "Items, Level, Kills, Statistiken oder andere Stages verlangen, bevor eine Stage freigeschaltet wird, und wie UND- und ODER-Gruppen kombiniert werden."
sidebar_position: 4
---

# Abhängigkeiten {/* #dependencies */}

Eine Stage kann verlangen, dass vorher etwas erledigt wird. Abhängigkeiten baut man normalerweise im
visuellen Abhängigkeits-Editor im [Editor im Spiel](/wiki/in-game-tools/in-game-editor), aber sie
sind einfaches JSON und lassen sich auch von Hand schreiben.

`dependencies` ist eine Liste von **Gruppen**. Eine Gruppe ist keine einzelne Bedingung: Sie hat eine
Liste pro Art von Anforderung und dazu ein Feld `logic`, das sagt, wie ihre eigenen Einträge verknüpft
sind.

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

Jede Liste ist optional; lass weg, was die Gruppe nicht braucht. Daneben kann ein `addons`-Block
stehen, für Anforderungsarten, die anderen Mods gehören, siehe [Requirements](/api/requirements).

## Die Bedingungen {/* #the-conditions */}

Zwei Felder beschreiben die Gruppe selbst: `id` (siehe
[unten](#group-ids-and-why-they-matter-in-a-live-world)) und `logic`. Alles danach ist eine
Anforderungsliste.

| Feld | Verlangt |
| :--- | :--- |
| `items` | Items, die am Forschungspodest abgegeben werden. Einträge haben `id`, `count` und optional ein `nbt`-Kriterium. |
| `item_tags` | Ein Item-Tag, das am Podest abgegeben wird, gleiche Eintragsform. Ein Tag-Eintrag verhält sich nicht wie eine Liste von Items, siehe [unten](#item-tags-settle-on-the-first-deposit). |
| `stages` | Eine andere globale Stage ist schon freigeschaltet. Einfache Stage-IDs. |
| `individual_stages` | Eine individuelle Stage ist vorhanden. `mode` ist `"all_online"`, `"all_ever"` oder `"player"`, siehe [unten](#the-individual_stages-condition-is-collective). |
| `advancements` | Der Spieler hat einen Fortschritt (Advancement) erreicht. |
| `xp_level` | Ein einzelnes Object statt einer Liste. `consume` zieht die Level beim Freischalten ab. |
| `entity_kills` | Der Spieler hat `count` Stück von `entity_id` getötet. |
| `stats` | Eine erfasste Statistik hat `min_value` erreicht. |
| `scoreboard` | Ein Scoreboard-Ziel erfüllt einen Vergleich. `op` ist einer von `>=`, `<=`, `==`, `>`, `<`, `!=`. Ohne `score_holder` wird der Wert des handelnden Spielers gelesen. |

## Vier davon gehen nur individuell {/* #four-of-them-are-individual-only */}

`advancements`, `xp_level`, `entity_kills` und `stats` brauchen jeweils einen einzelnen Spieler, an dem
sie messen. Eine individuelle Rolle hat ab dem Start der Forschung einen festen Besitzer, eine globale
hat keinen.

Schreibt man diese vier von Hand in eine globale Stage, werden sie **übersprungen statt geprüft**. Sie
werden nicht aus der Datei entfernt, und sie werden auch nicht an dem gemessen, der zufällig das Podest
geöffnet hat. Der Editor bietet sie dort einfach nicht an. Der Lade-Bericht nennt sie.

Der Rest, also Items, Item-Tags, Stages, individuelle Stages und Scoreboard, funktioniert in beiden
Arten. → [Requirements](/api/requirements) zeigt dieselbe Aufteilung von der Addon-Seite aus.

Eine Scoreboard-Bedingung funktioniert in einer globalen Stage, weil sie den Halter benennen kann,
dessen Wert sie liest. Ohne Halter nimmt sie den handelnden Spieler, und das ist bei einer globalen
Stage, wer gerade zufällig am Podest steht. Gib dort also den Halter an.

## UND, ODER, und wo die Grenze verläuft {/* #and-or-and-where-the-line-runs */}

:::warning
**`logic` gilt innerhalb einer Gruppe und nie zwischen Gruppen.** Gruppen sind immer mit UND
verbunden: Jede Gruppe muss erfüllt sein. Innerhalb einer Gruppe verlangt `"AND"` (der Standard) jeden
Eintrag und `"OR"` irgendeinen einzelnen.
:::

„Sechzehn Eisen *oder* acht Gold, und in jedem Fall dreißig Level“ sind also zwei Gruppen:

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

Alle drei in eine ODER-Gruppe zu packen, würde die Stage schon allein mit dreißig Leveln öffnen.

Der Tooltip der Forschungsrolle und das Detail-Panel des Graphs zeigen beide die Überschrift jeder
Gruppe an, damit ein Spieler sieht, für welche Einträge ein ODER gilt.

## Item-Tags legen sich bei der ersten Abgabe fest {/* #item-tags-settle-on-the-first-deposit */}

Ein `item_tags`-Eintrag ist keine Abkürzung für „irgendeins dieser Items“. Das erste passende Item, das
ins Podest geworfen wird, wird auf die Rolle geschrieben, und ab dann verlangt der Eintrag für den Rest
seiner Anzahl **genau dieses** Item. `8x #minecraft:planks` heißt also acht Bretter einer Sorte, nicht
acht Bretter aus vier verschiedenen Holzarten zusammengekratzt.

Die Wahl steht auf der einzelnen Rolle, neben dem Zähler, und lässt sich nicht zurücksetzen. Zwei
Spieler, die dieselbe Stage erforschen, können sich auf verschiedene Items festlegen. Solange ein
Eintrag noch offen ist, wechselt sein Symbol einmal pro Sekunde durch die Mitglieder des Tags, damit
er als Auswahl erkennbar ist und nicht wie ein bestimmtes Item aussieht.

Abgaben werden in fester Reihenfolge zugeordnet: zuerst konkrete Items, dann Tags, die sich schon
festgelegt haben, dann offene Tags. Ein offener Tag gibt seine Freiheit zuletzt auf.

## Die Bedingung `individual_stages` ist gemeinsam {/* #the-individual_stages-condition-is-collective */}

Sie zielt nicht auf einen bestimmten Spieler. Das Feld `mode` wählt, wessen Stage gelesen wird:

| `mode` | Wer die Stage haben muss |
| :--- | :--- |
| `all_online` | Jeder Spieler, der gerade online ist. |
| `all_ever` | Jeder Spieler, den der Server je gesehen hat. |
| `player` | Nur wer gerade forscht. **Nur individuelle Stages.** |

Mit den ersten beiden schreibt man „keiner geht weiter, bis alle so weit sind“. `player` ist die
normale persönliche Voraussetzung, und sie wird in einer globalen Stage absichtlich abgelehnt: Eine
globale Stage wird einmal für alle freigeschaltet, also würde eine persönliche Schranke den ersten
Spieler, der sie erfüllt, die Stage für den ganzen Server öffnen lassen, auch für alle ohne die
Voraussetzung. Das liest sich wie „jeder braucht sie“ und bewirkt das Gegenteil.

## Gruppen-IDs, und warum sie in einer laufenden Welt wichtig sind {/* #group-ids-and-why-they-matter-in-a-live-world */}

Was ein Spieler schon abgegeben hat, wird unter der **`id` der Gruppe** abgelegt, nicht unter ihrer
Position in der Liste:

```json
"dependencies": [
  { "id": "ores", "logic": "OR", "items": [ … ] },
  { "id": "levels", "xp_level": { "level": 30 } }
]
```

Weil die ID mit der Gruppe wandert, bleiben die Abgaben aller Spieler an der Anforderung hängen, für
die sie gemacht wurden, auch wenn du Gruppen im Editor löschst, umsortierst oder kopierst.

Eine Gruppe **ohne** `id` nimmt ihre Position, und beim Laden der Stage bekommt sie diese Position als
ID. Genau darunter ist ihr bisheriger Fortschritt schon abgelegt, also funktionieren Rollen aus älteren
Versionen unverändert weiter. Die ID wird in die Datei geschrieben, wenn der Editor die Stage zum
ersten Mal speichert.

:::warning[Von Hand bearbeitete Dateien, bevor der Editor sie je gespeichert hat]
Solange keine IDs in der Datei stehen, erkennt man eine Gruppe nur daran, wo sie steht. Gruppen in
einer handgeschriebenen Stage umzusortieren, die in einer laufenden Welt schon benutzt wird,
verschiebt deshalb, was Spieler abgegeben haben. Öffne und speichere die Stage entweder einmal im
Editor, der die IDs dann einträgt, oder schreib die `id`-Felder selbst.

Zwei Gruppen mit **derselben** ID sind der andere Weg dorthin; beim Kopieren einer Gruppe im
Texteditor passiert das leicht. Der späteren wird beim Laden die ID weggenommen und ersetzt, und der
Lade-Bericht nennt sie.
:::

## Siehe auch {/* #see-also */}

- [Forschungspodest](/wiki/in-game-tools/research/pedestal): wo Items abgegeben werden.
- [Forschungsrollen](/wiki/in-game-tools/research/scrolls): wie Spielern die Anforderungen gezeigt
  werden.
- [Stufen-Graph](/wiki/in-game-tools/stage-graph): die Abhängigkeitskette für Spieler zeichnen.
