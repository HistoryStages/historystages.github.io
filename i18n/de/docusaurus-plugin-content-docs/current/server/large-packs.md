---
title: Große Modpacks
description: "Wo die Größengrenzen wirklich liegen, warum Item-Tags die Antwort auf die meisten davon sind und was nicht teurer wird, wenn ein Modpack wächst."
sidebar_position: 3
---

# Große Modpacks {/* #large-packs */}

Ein Modpack mit drei Stages und eins mit dreihundert werden gleich gebaut, und fast nichts am zweiten
muss man planen. Zwei Grenzen solltest du kennen, bevor du an sie stößt, und eine Gewohnheit hält dich
weit von beiden fern.

## Die eine Gewohnheit: Tags vor IDs {/* #the-one-habit-tags-before-ids */}

Ein Eintrag kostet Platz, egal ob er ein Item sperrt oder tausend. `#c:ingots` ist ein einziger Eintrag
und deckt jeden Barren im Modpack ab, auch die, die eine Mod hinzufügt, nachdem du ihn geschrieben hast.
Dieselbe Sperre als IDs ausgeschrieben sind so viele Einträge, wie es Barren gibt, und sie ist nicht
mehr vollständig, sobald jemand eine Mod hinzufügt.

Das ist der ganze Trick, und er lohnt sich lange, bevor die Größe zum Problem wird: Eine Stage aus Tags
ist auch kürzer zu lesen, schneller zu bearbeiten und bekommt nicht still Lücken. →
[Items, Tags & Mods](/wiki/locking/items-and-recipes/items-tags-mods)

`mods` plus `mod_exceptions` erledigt dasselbe von der anderen Seite: alles sperren, was eine Mod
hinzufügt, und dann die Handvoll wieder herausnehmen, die verfügbar bleiben soll.

## Grenze eins: eine einzelne Stage, beim Speichern {/* #limit-one-a-single-stage-on-save */}

Der Editor schickt eine Stage als ein Stück Text an den Server, und Minecraft begrenzt, wie lang ein
einzelnes Stück Text in einem Paket sein darf. History Stages prüft das **vor** dem Senden: Eine Stage
über **65.536 Zeichen** wird mit einer Nachricht im Editor abgelehnt, statt die Verbindung abbrechen zu
lassen.

In der Praxis erreichst du das nur auf einem Weg: mehrere hundert einzeln aufgeführte Items, jedes mit
eigenen [`unlock_actions`](/wiki/locking/items-and-recipes/unlock-actions) eingegrenzt. Jeder
eingegrenzte Eintrag ist ein Object statt eines Strings und kostet deshalb ein Mehrfaches einer
einfachen ID.

Die Lösung ist die Gewohnheit oben, und sie wirkt meistens drastisch: Ein Tag-Eintrag ersetzt eine
ganze Seite IDs. Eine riesige Stage in zwei aufzuteilen, die zusammen freigeschaltet werden, geht auch,
ist aber die zweitbeste Antwort.

## Grenze zwei: das ganze Modpack, beim Einloggen {/* #limit-two-the-whole-pack-at-login */}

Alles, was ein beitretender Spieler braucht, also beide Stage-Bäume, die Ordnerstruktur, das
Graph-Layout und die Gestaltung pro Stage, kommt beim Einloggen in einem Sync an. Jede dieser Ladungen
ist **gzip-komprimiert**, was bei Stage-JSON etwa ein Zehntel bis ein Zwanzigstel der normalen Größe
bedeutet, weil eine Stage-Datei dieselben zwölf Schlüssel einmal pro Eintrag wiederholt.

Eine Obergrenze gibt es trotzdem, acht Millionen Zeichen JSON pro Stage-Baum, vor der Kompression
gezählt, aber sie schützt vor einer ausufernden Datei und ist kein Budget, das irgendwer ausgeben soll.
Vor 6.0.0 gab es gar keine Kompression, und ein sehr großes Modpack konnte einen Client beim Einloggen
scheitern lassen. → [Von 5.x aktualisieren](/wiki/server/upgrading-from-5x)

## Was nicht teurer wird {/* #what-does-not-get-more-expensive */}

Das sollte man deutlich sagen, weil die meisten genau hier das Problem vermuten:

- **Eine Sperr-Prüfung geht nicht deine Stages durch.** Die Mod hält einen Index vom Inhalt zu den
  Stages, die ihn nennen, und baut ihn neu, wenn sich die Stages ändern. Ob ein Modpack zehn Stages hat
  oder tausend, bestimmt nicht, was eine Prüfung kostet.
- **Ordner kosten nichts.** Verschachtle so tief du willst, bis zu acht Ebenen. Sie sind für dich da,
  nicht für den Lader. → [Wo die Stage-Dateien liegen](/wiki/start-here/where-stage-files-live)
- **Freischaltungen sind klein.** Sie sind eine Liste von IDs pro Spieler, keine Kopie von irgendetwas.
  → [Einen Server betreiben](/wiki/server/running-a-server#what-the-world-save-holds)

## Was eine Stage-Änderung auslöst {/* #what-a-stage-change-sets-off */}

Eine Stage, die Rezepte sperrt, lässt andere Mods ihre Rezeptlisten neu bauen, wenn sie aufgeht oder
zugeht. Bis 6.1 war das ein voller Datapack-Reload, und bei einem großen Modpack fror das den Server bei
jeder Freischaltung zwanzig Sekunden und länger ein. Inzwischen ist es ein gezielter Reload, der etwa
eine Sekunde dauert und den Server weiterlaufen lässt.<Since v="6.2.0" /> →
[Reloads nach einer Stage-Änderung](/wiki/server/stage-change-reload)

## Was mit dem Modpack wächst {/* #things-that-do-scale-with-the-pack */}

- **`/history reload`** macht das ganze Einlesen vom Start noch einmal, also jede Stage-Datei, die
  Einstellungen und die abgeleiteten Indizes, und schickt das Ergebnis dann an alle, die online sind.
  Es ist für die Zeit zwischen zwei Bearbeitungsrunden gedacht, nicht für einen Timer oder ein Skript,
  das bei jeder Änderung auslöst.
- **Der Lade-Bericht** wächst mit dem Modpack, und genau deshalb lohnt es sich, ihn zu lesen statt zu
  überfliegen: IDs, die es nicht mehr gibt, Sperren in der falschen Stage-Art und doppelte Stage-IDs
  tauchen dort auf und nirgends sonst. →
  [Hilfe bekommen](/wiki/about/getting-help#before-reporting-check-the-load-report)
- **Der Stufen-Graph** zeichnet jeden sichtbaren Knoten. Bei einem Modpack mit Hunderten von Stages
  lohnt es sich, die Sichtbarkeits-Regeln bewusst einzustellen, statt allen den ganzen Baum zu zeigen.
  → [Stufen-Graph](/wiki/in-game-tools/stage-graph)
