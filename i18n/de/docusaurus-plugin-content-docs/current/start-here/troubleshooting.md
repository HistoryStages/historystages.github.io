---
title: Fehlersuche
description: "Etwas verhält sich nicht so, wie du erwartet hast: die üblichen Ursachen, sortiert nach dem, was du siehst, jeweils mit der Seite, die die Lösung hat."
sidebar_position: 5
---

# Fehlersuche {/* #troubleshooting */}

Sortiert nach dem, was du tatsächlich siehst. Jeder Eintrag nennt in ein, zwei Sätzen die übliche
Ursache und verlinkt die Seite, die sie ausführlich erklärt.

:::tip[Schau zuerst in den Lade-Bericht]
Jeder Start und jedes `/history reload` schreibt eine `debug-*.log` nach
`config/historystages/logs/`. Darin stehen die Probleme, die in jeder Stage-Datei gefunden wurden:
IDs, die es nicht gibt, doppelte Stage-IDs, Sperren in einer Art von Stage, die sie nicht tragen kann.
Ein überraschend großer Teil der Einträge unten steht dort schon beim Namen. →
[Hilfe & Fehler melden](/wiki/about/getting-help#before-reporting-check-the-load-report)
:::

## Einrichten {/* #setting-it-up */}

**History Stages lädt nicht.** Lootr ist Pflicht, auf Fabric zusätzlich Fabric API und auf 26.2
außerdem Architectury API. → [Installation](/wiki/start-here/installation#what-you-need-alongside-it)

**Spieler können dem Server nicht beitreten.** Vergleiche die `mods`-Ordner. Server und jeder
Spieler brauchen dieselbe Version von History Stages und Lootr. →
[Auf einen Server bringen](/wiki/start-here/server-setup#4-give-every-player-the-same-mods)

**Der Editor-Knopf fehlt im Pausemenü.** Er braucht Berechtigungsstufe 2. Wenn du Operator geworden
bist, während du schon auf dem Server warst, schließ das Pausemenü und öffne es neu. Der Knopf lässt
sich auch mit `showEditorButton` ausblenden; `/history editor` funktioniert dann trotzdem. →
[Editor im Spiel](/wiki/in-game-tools/in-game-editor#opening-it)

## Stages bearbeiten {/* #editing-stages */}

**Eine von Hand bearbeitete Stage-Datei bewirkt nichts.** Die Ordner werden beim Start und bei
`/history reload` gelesen, nicht bei jeder Dateiänderung. Führ den Befehl aus. →
[Befehle](/wiki/server/commands)

**Eine Handänderung ist nach dem Speichern im Editor weg.** Der Editor schreibt die ganze Datei aus der
Version, die er noch im Speicher hat. Führ nach einer Handänderung `/history reload` aus, bevor du den
Editor öffnest. → [Editor im Spiel](/wiki/in-game-tools/in-game-editor#saving-and-multiplayer)

**Eine Stage hat alle Freischaltungen verloren.** Der Dateiname ist die Stage-ID, und Freischaltungen
werden unter dieser ID gespeichert. Eine umbenannte Datei fängt von vorn an. →
[Wo die Stage-Dateien liegen](/wiki/start-here/where-stage-files-live)

**Eine Stage-Datei wird übersprungen.** Zwei Dateien mit demselben Namen irgendwo in `global/` (oder
in `individual/`) kollidieren, und nur der alphabetisch erste Pfad bleibt. →
[Globale vs. individuelle Stages](/wiki/start-here/global-vs-individual#pitfalls)

**Der Editor weigert sich, eine große Stage zu speichern.** Eine einzelne Stage hat eine
Größengrenze. Item-Tags statt Hunderter einzelner IDs sind fast immer die Lösung. →
[Große Modpacks](/wiki/server/large-packs)

## Sperren {/* #locks */}

**Eine Sperre wird komplett ignoriert.** Prüf die Art der Stage. Manche Sperren funktionieren nur in
globalen Stages, manche nur in individuellen; in der falschen wird sie übersprungen und im Lade-Bericht
genannt. → [Was kann welche sperren?](/wiki/start-here/global-vs-individual#what-can-each-one-lock)

**Ein gesperrter Block lässt sich trotzdem setzen.** Die Sperre ist mit `unlock_actions` eingegrenzt,
und `use` deckt das Setzen nicht ab. Sperr `place` mit. →
[Unlock Actions](/wiki/locking/items-and-recipes/unlock-actions#place-and-use-are-not-the-same-thing)

**Andere Spieler craften ein Item, das für mich gesperrt ist.** Eine Item-Sperre in einer individuellen
Stage fasst das Rezept nicht an; sie greift erst, wenn der gesperrte Spieler das Item bekommen oder
benutzen will. → [Globale vs. individuelle Stages](/wiki/start-here/global-vs-individual#pitfalls)

**Ein gesperrtes Item ist für die ganze Gruppe aus einem Mob-Drop verschwunden.** Drops werden nach dem
Spieler beurteilt, der den letzten Treffer gelandet hat. →
[Loot](/wiki/locking/items-and-recipes/loot#mob-drops-are-not-symmetrical-with-chest-loot)

**Ein Spieler, der später beigetreten ist, ist noch gesperrt.** `/history individual unlock @a …`
erreicht nur die Spieler, die in dem Moment online sind. →
[Globale vs. individuelle Stages](/wiki/start-here/global-vs-individual#pitfalls)

## Rezepte {/* #recipes */}

**Ein Rezept geht im Ofen oder in einer Maschine noch.** Eine Rezept-Sperre in einer individuellen
Stage erreicht nur Stationen, die wissen, wer sie benutzt. Öfen, Trichter und Autocrafter brauchen eine
globale Stage. →
[Rezepte](/wiki/locking/items-and-recipes/recipes#what-it-actually-does-depends-on-the-scope)

**Eine Maschine aus einer anderen Mod bietet nach einer Stage-Änderung noch ein gesperrtes Rezept an.** →
[Reloads nach einer Stage-Änderung](/wiki/server/stage-change-reload#if-a-machine-still-offers-a-locked-recipe)

**Rezepte sind verschwunden, die niemand eingetragen hat.** Fast immer ein Flüssigkeits-Eintrag. Ohne
`unlock_actions` sperrt er jedes Rezept, das die Flüssigkeit verwendet, nicht nur die, die sie
herstellen. → [Flüssigkeiten](/wiki/locking/items-and-recipes/fluids)

**Eine Rezept-ID ist im Editor rot.** Das Rezept gibt es im Spiel nicht mehr. Mit KubeJS heißt das
meistens, dass ein Skript umsortiert wurde und sich die durchnummerierten IDs verschoben haben. →
[Rezepte](/wiki/locking/items-and-recipes/recipes#script-generated-recipes-move)

**Ein Rezept fehlt in der Rezept-Auswahl.** Ein paar Arten von Rezepten lassen sich keinem Ergebnis
zuordnen. → [Editor im Spiel](/wiki/in-game-tools/in-game-editor#when-a-recipe-is-not-listed-at-all)

**JEI oder EMI zeigt eine Änderung erst nach einem Neustart.** Beide bauen ihre Rezeptlisten beim
Start. → [Hilfe & Fehler melden](/wiki/about/getting-help#common-first-suspects)

## Forschung {/* #research */}

**Spieler kommen nicht an Rollen oder Podeste.** History Stages bringt absichtlich keine Rezepte dafür
mit. → [Rollen & Podeste beschaffen](/wiki/in-game-tools/research/obtaining)

**Das Podest startet nicht.** Die Forschung wartet auf den **Start**-Knopf. Ist der Knopf ausgegraut,
sagt die Seitenleiste warum: eine Abhängigkeit, die noch nicht erfüllt ist, oder ein roter Kasten, wenn
die Stage durch eine andere Stage blockiert ist. →
[Forschungspodest](/wiki/in-game-tools/research/pedestal#handing-in-dependencies)

**Die Rolle zeigt eine Stufen-Warnung.** Die Stage verlangt eine andere Podest-Stufe. →
[Forschungspodest](/wiki/in-game-tools/research/pedestal#tier-gating-per-stage)

## Immer noch nicht weiter? {/* #still-stuck */}

[Hilfe & Fehler melden](/wiki/about/getting-help) sagt, wo du fragen kannst und was du mitbringen
solltest. Kurz gesagt: die `debug-*.log`, die Stage-Datei und ob es eine globale oder eine individuelle
Stage ist.
