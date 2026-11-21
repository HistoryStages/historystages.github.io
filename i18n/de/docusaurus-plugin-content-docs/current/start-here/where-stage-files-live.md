---
title: Wo die Stage-Dateien liegen
description: "Jeder Ordner, den History Stages liest oder schreibt, warum der Dateiname die Stage-ID ist und wie Unterordner funktionieren."
sidebar_position: 4
---

# Wo die Stage-Dateien liegen {/* #where-stage-files-live */}

Alles, was History Stages liest und schreibt, liegt unter `config/historystages/`:

```text
config/historystages/
    global/              eine .json pro globaler Stage
    individual/          eine .json pro individueller Stage
    settings/
        visual.toml      was ein Spieler sieht oder hört
        gameplay.toml    was im Hintergrund passiert
        graph.toml       der Stufen-Graph für Spieler
        graph_stages.json   Graph-Layout, Stile pro Stage und Stil-Vorlagen
        disguises.json      wie gesperrte Items aussehen (seit 6.1.0)
    logs/
        debug-*.log      der Lade-Bericht, geschrieben beim Start und nach /history reload
        runtime-*.log    Stage-Änderungen und blockierte Aktionen, wenn eingeschaltet
```

In welchem der beiden Stage-Ordner eine Datei liegt, ist der ganze Unterschied zwischen einer Stage für
den ganzen Server und einer pro Spieler. In der Datei selbst gibt es kein Feld dafür. →
[Globale vs. individuelle Stages](/wiki/start-here/global-vs-individual).

## Der Dateiname ist die Stage-ID {/* #the-file-name-is-the-stage-id */}

`bronze_age.json` legt die Stage `bronze_age` an. Diese ID nimmt `/history global unlock`, auf sie
zeigen die [Abhängigkeiten](/wiki/stage-file/dependencies) anderer Stages, und sie nennen
[Skripte](/wiki/server/scripting). `display_name` ist nur das, was Spieler lesen.

Eine Datei umzubenennen benennt also die Stage um, und **jede Freischaltung unter der alten ID ist
weg**. Nichts überträgt sie.

Stage-Dateien werden als **UTF-8** gelesen und geschrieben, also überleben Namen mit Umlauten oder
Symbolen auf jedem System. Vor 6.1.0 wurde der Standard-Zeichensatz des Systems benutzt, und unter
Windows konnten Namen kaputt herauskommen.

## Ordner {/* #folders */}

Beide Stage-Ordner können Unterordner haben, bis zu 8 Ebenen tief:

```text
config/historystages/global/
    ages/
        stone_age.json
        bronze_age.json
    magic/
        arcane/
            runes.json
```

Ordner dienen nur der Ordnung. **Die Stage-ID ist trotzdem nur der Dateiname**, nicht der Pfad:
`magic/arcane/runes.json` ist die Stage `runes`, und du kannst sie in einen anderen Ordner verschieben,
ohne dass etwas kaputtgeht.

Daraus folgt: **IDs müssen im ganzen Baum eindeutig sein.** Zwei Dateien namens `iron_age.json` in
verschiedenen Unterordnern von `global/` kollidieren. Der alphabetisch erste Pfad wird behalten, der
andere mit einem Fehler in `debug-*.log` übersprungen.

Dieselbe ID in `global/` *und* in `individual/` ist etwas anderes. Beide werden geladen, und genau so
schreibt man eine [Dual-Phase-Sperre](/wiki/start-here/global-vs-individual#dual-phase-when-both-lists-target-the-same-content).

Namen dürfen Buchstaben, Ziffern, `-` und `_` enthalten. Sie dürfen nicht mit `_` anfangen und kein
`..`, keine Backslashes und keine Laufwerksbuchstaben enthalten.

Der **Ordnungsmodus** des Editors in der Stage-Übersicht hakt mehrere Stages und Ordner gleichzeitig an
und zieht sie in einem Rutsch in einen Zielordner. Wird ein Ordner verschoben, kommt sein Inhalt mit. →
[Editor im Spiel](/wiki/in-game-tools/in-game-editor).

## Eine Datei ablegen, ohne sie zu laden {/* #parking-a-file-without-loading-it */}

Jede Datei und jeder Ordner, dessen Name mit einem Unterstrich anfängt, wird beim Laden übersprungen:

```text
global/
    _templates/          ein ganzer Ordner, ignoriert
        era_template.json
    _draft_endgame.json  eine Datei, ignoriert
    stone_age.json       geladen
```

So liegen Vorlagen, Backups und halbfertige Stages neben den echten, ohne geladen zu werden. Es ist
auch der schnellste Weg, eine Stage vorübergehend aus einem Modpack zu nehmen: umbenennen statt
löschen, dann bleiben ihre Freischaltungen erhalten, bis sie zurückkommt.

## Änderungen wirksam machen {/* #making-changes-take-effect */}

| Was sich geändert hat | Was nötig ist |
| :--- | :--- |
| Eine Stage-Datei, von Hand bearbeitet | `/history reload` |
| Eine `.toml` in `settings/`, von Hand bearbeitet | `/history reload` |
| Alles, was im Editor gespeichert wurde | nichts, er lädt selbst neu |

`/history reload` liest nur die Definitionen neu ein. **Freischaltungen ändert es nie**: Eine offene
Stage bleibt offen, eine gesperrte bleibt gesperrt. Außerdem läuft es nur für den, der es eingegeben
hat, und nicht für jeden Operator auf dem Server.

## Den Lade-Bericht lesen {/* #reading-the-load-report */}

Jeder Start schreibt eine `debug-*.log` nach `logs/`. Sie listet beide Stage-Bäume und jedes gefundene
Problem auf: doppelte IDs, unbekannte Item- oder Rezept-IDs, Bedingungen pro Spieler in einer globalen
Stage. Hier schaust du zuerst nach, wenn eine Stage nicht tut, was in der Datei steht.

Das Laufzeit-Logging, also Stage-Änderungen, blockierte Aktionen und entfernte Inventar-Items in dem
Moment, in dem sie passieren, ist standardmäßig aus. Eingeschaltet wird es mit
`logging.enableRuntimeLogging` in [gameplay.toml](/wiki/server/config-files/gameplay-toml). →
[Hilfe & Fehler melden](/wiki/about/getting-help).
