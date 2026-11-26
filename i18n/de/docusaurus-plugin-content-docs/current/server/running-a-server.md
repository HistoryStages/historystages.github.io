---
title: Einen Server betreiben
description: "Was auf dem Server liegt, was der Weltspielstand enthält, wann ein Reload reicht und was du kopierst, wenn ein Modpack umzieht."
sidebar_position: 2
---

# Einen Server betreiben {/* #running-a-server */}

Nichts hiervon brauchst du, um History Stages im Einzelspieler auszuprobieren. Es sind die Fragen, die
erst auftauchen, wenn ein Modpack auf einem dedizierten Server läuft: wo das Modpack eigentlich liegt,
was in ein Backup gehört und was ein Reload anfasst und was nicht.

Du richtest zum ersten Mal einen Server ein? →
[Auf einen Server bringen](/wiki/start-here/server-setup) geht es Schritt für Schritt durch.

## Was wo liegt {/* #what-lives-where */}

History Stages wird auf beiden Seiten installiert, wie jede Mod, die Blöcke und Bildschirme mitbringt.
*Nicht* auf beiden Seiten gleich ist das Modpack selbst.

| | Wo es liegt | Kommt es beim Client an? |
| :--- | :--- | :--- |
| Stage-Dateien (`global/`, `individual/`) | Nur auf dem Server | Ja, beim Einloggen als Definitionen. Auf dem Client wird nichts geschrieben. |
| Die drei Einstellungsdateien | Nur auf dem Server | Ja, die Werte des Servers gelten für die Sitzung. |
| Freischaltungen | Im Weltspielstand | Ja, als eigener Zustand des Spielers. |
| Die eigenen Einstellungsdateien eines Spielers | In seinem Spielordner | Gelten im Einzelspieler und solange er nicht verbunden ist. |

Die eigenen Kopien eines Clients werden von einem Server **nie überschrieben**. Sie liegen nur so lange
beiseite, wie der Spieler verbunden ist, und gelten wieder, wenn er geht. →
[Config-Dateien](/wiki/server/config-files)

## Was der Weltspielstand enthält {/* #what-the-world-save-holds */}

Freischaltungen sind Weltdaten, keine Modpack-Daten. Sie liegen im Datenordner der Oberwelt:

```text
<world>/data/
    historystages_global.dat             welche globalen Stages offen sind
    historystages_individual.dat         welche Spieler welche individuellen Stages haben
    historystages_temporary.dat          laufende Timer und Abklingzeiten für temporäre Stages
    historystages_auto_progress.dat      Fortschritt bei Auto-Auslösern, pro Spieler
    historystages_auto_progress_global.dat   dasselbe für globale Auto-Auslöser
    historystages_structure_counts.dat   wie oft eine begrenzte Struktur generiert hat
```

Diese Aufteilung solltest du verinnerlichen: **`config/historystages/` ist das Modpack,
`<world>/data/` ist der Spielstand.** Ein Modpack auf einen anderen Server zu kopieren nimmt Stages und
Einstellungen mit und lässt jede Freischaltung zurück, und meistens ist genau das gewollt. Eine Welt zu
kopieren nimmt den Fortschritt mit.

Das erklärt auch etwas, das viele überrascht: Freischaltungen werden unter der **Stage-ID** gespeichert,
und die ist der Dateiname. `bronze_age.json` umzubenennen erzeugt eine neue Stage, und alles, was für die
alte gespeichert war, hängt in der Luft. Nichts überträgt es.

## Reload oder Neustart? {/* #reload-or-restart */}

`/history reload` liest die Stage-Ordner und die Einstellungsdateien neu ein und schickt das Ergebnis an
alle, die online sind. Das deckt fast alles ab, was du änderst, während ein Server läuft.

| | |
| :--- | :--- |
| **Ein Reload reicht** | Stage-Dateien hinzugefügt, bearbeitet oder gelöscht. Einstellungen von Hand geändert. Ordnerstruktur geändert. |
| **Ein Reload tut nichts** | Freischaltungen. Sie sind keine Modpack-Daten und werden von einem Reload nie angefasst; wieder sperren geht mit `/history global lock <stage>` oder `/history individual lock <player> <stage>`. |
| **Ein Neustart ist nötig** | Nur für das, was ein Rezept-Browser einmal beim Start aufbaut: ein Eintrag, der in der Liste von JEI oder EMI erscheint oder verschwindet, etwa durch die Einstellung zum Versiegeln von Rollen. Die Sperren selbst wirken sofort. |

Der Editor lädt bei jedem Speichern selbst neu, also gilt nichts davon, solange du in ihm arbeitest.

## Einen laufenden Server bearbeiten {/* #editing-a-live-server */}

Der Editor öffnet sich auf einem laufenden Server bei Berechtigungsstufe 2 aus dem Pausemenü, und
Speichern schreibt die Datei und überträgt das Ergebnis im selben Schritt an alle. Ein Wartungsfenster
musst du nicht planen.

:::danger[Eine Reihenfolge ist wichtig]
Der Server liest Stage-Dateien beim Start und bei `/history reload`, **nicht**, wenn sich eine Datei auf
der Festplatte ändert. Bearbeitest du eine Datei von Hand und speicherst dann diese Stage im Editor,
überschreibt er deine Änderung still mit der Kopie, die der Server noch im Speicher hat. Führ nach einer
Handänderung `/history reload` aus, bevor du den Editor öffnest. →
[Editor im Spiel](/wiki/in-game-tools/in-game-editor#saving-and-multiplayer)
:::

## Backups {/* #backups */}

| Pfad | Was es ist |
| :--- | :--- |
| `config/historystages/` | das ganze Modpack, also Stages, Ordner, Einstellungen und das Graph-Layout. |
| `<world>/data/historystages_*.dat` | alles, was Spieler sich verdient haben. |
| `config/historystages/logs/` | kein Backup wert, aber lesenswert. Der Lade-Bericht wird bei jedem Start geschrieben und ist die erste Stelle, an der ein Modpack, das sich komisch verhält, auffällt. → [Hilfe bekommen](/wiki/about/getting-help#before-reporting-check-the-load-report) |

## Rechte {/* #permissions */}

Jeder `/history`-Befehl braucht Berechtigungsstufe 2, mit einer nützlichen Ausnahme: Die
Debug-Unterbefehle auf der Client-Seite laufen auf dem eigenen Client des Operators und antworten zu
seiner eigenen Position und seinem eigenen gehaltenen Item. → [Befehle](/wiki/server/commands)

Spieler brauchen nie Rechte für irgendetwas. Forschung, Rollen, der Graph und das Rollen-Dokument sind
ganz normales Gameplay.
