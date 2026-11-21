---
title: Befehle & Rechte
description: "Jeder /history-Befehl, was er nimmt und welche Berechtigungsstufe er braucht."
sidebar_position: 1
---

History Stages bringt eine Reihe von Admin-Befehlen mit, um Stages, Einstellungen und den Fortschritt von Spielern zu verwalten. Sie sind für Server-Operatoren und Modpack-Entwickler gedacht.

Alle Admin-Befehle brauchen **Berechtigungsstufe 2 (OP)** und beginnen mit `/history`.

## Befehle für globale Stages (serverweit) {/* #global-stage-commands-server-wide */}

Diese Befehle verwalten globale Stages, die für alle Spieler auf dem Server gelten.

| Befehl | Aktion | Details |
| :--- | :--- | :--- |
| `/history global unlock <stage_id>` | Schaltet eine bestimmte globale Stage frei. | Ersetze `<stage_id>` durch die ID der Stage. Mit `*` werden alle angelegten globalen Stages freigeschaltet. |
| `/history global lock <stage_id>` | Sperrt eine bestimmte globale Stage wieder. | Ersetze `<stage_id>` durch die ID der Stage. Mit `*` werden alle globalen Stages wieder gesperrt. |

:::note[Befehle gehen an Logikbausteinen vorbei, nicht an Solange-Stages]
Ein Freischalten per Befehl geht auch durch, wenn ein [Logikbaustein](/wiki/stage-file/logic-blocks#blocked-while)
die Stage blockiert, und löscht eine Markierung [endgültig verloren](/wiki/stage-file/relocking#lost-for-good).
Es teilt die Stage nicht mit einem [Team](/wiki/start-here/global-vs-individual#sharing-with-a-team).
Eine [Solange-Stage](/wiki/stage-file/relocking#the-while-mode) wird bei der nächsten Prüfung, eine
Sekunde später, von ihrer Bedingung überschrieben.
:::

## Befehle für individuelle Stages (pro Spieler) {/* #individual-stage-commands-per-player */}

Diese Befehle verwalten individuelle Stages (pro Spieler) und ermöglichen persönliche Fortschrittswege.

| Befehl | Aktion | Details |
| :--- | :--- | :--- |
| `/history individual unlock <player> <stage_id>` | Schaltet eine Stage für einen bestimmten Spieler frei. | Ersetze `<player>` durch den Namen des Spielers oder einen Selektor (z. B. `@a`, `@p`). Ersetze `<stage_id>` durch die ID der Stage. |
| `/history individual lock <player> <stage_id>` | Sperrt eine Stage für einen bestimmten Spieler wieder. | `<player>` und `<stage_id>` wie oben. |

## Befehle für temporäre Stages {/* #temporary-stage-commands */}

Stages im Modus `temporary` sperren sich nach einer Weile selbst wieder und zählen, wie oft sie ausgelöst wurden. Diese Befehle lesen und ändern diesen Laufzeit-Zustand; anders lässt sich ein Auslöse-Zähler oder eine laufende Abklingzeit nicht sehen.

| Befehl | Aktion | Details |
| :--- | :--- | :--- |
| `/history temporary global info <stage_id>` | Zeigt, wie oft die Stage freigeschaltet wurde, ihre Obergrenze und einen laufenden Timer oder eine laufende Abklingzeit. | |
| `/history temporary global reset <stage_id>` | Löscht den Auslöse-Zähler und einen laufenden Timer. | |
| `/history temporary global setcount <stage_id> <count>` | Setzt den Auslöse-Zähler auf eine bestimmte Zahl. | |
| `/history temporary individual <player> info <stage_id>` | Dasselbe für einen Spieler. | `<player>` nimmt einen Namen oder einen Selektor. |
| `/history temporary individual <player> reset <stage_id>` | | |
| `/history temporary individual <player> setcount <stage_id> <count>` | | |

## Zonen-Befehle {/* #zone-commands */}

Die Ecken markieren, aus denen eine Zone gebaut wird, ohne das Markierungs-Item zu brauchen. Das zählt auf einem Server, auf dem das Item abgeschaltet ist, und um eine Ecke zu setzen, auf der du nicht stehen kannst.

| Befehl | Aktion | Details |
| :--- | :--- | :--- |
| `/history zone mark` | Setzt die nächste Ecke an deiner Position. | Wechselt zwischen erster und zweiter Ecke. |
| `/history zone mark <1\|2> [pos]` | Setzt eine bestimmte Ecke, optional an angegebenen Koordinaten. | |
| `/history zone clear` | Verwirft die aktuelle Auswahl. | |
| `/history zone info` | Zeigt die markierten Ecken, die Welt, in der sie liegen, und die Größe des Kastens. | |

Die Auswahl gilt pro Spieler und bleibt, bis sie gelöscht oder überschrieben wird. Übernimmst du sie im Editor, wird daraus eine Form.

## Hilfsbefehle {/* #utility-commands */}

| Befehl | Aktion | Details |
| :--- | :--- | :--- |
| `/history reload` | Lädt alle Einstellungen neu und synchronisiert die Daten. | Dieser Befehl ist **Pflicht** nach Handänderungen an JSON-Stage-Dateien (in `config/historystages/global/` oder `individual/`) oder TOML-Einstellungsdateien (z. B. `historystages/settings/gameplay.toml`). Reload läuft jetzt lokal für den, der es eingibt, und nicht mehr für alle anderen Operatoren auf dem Server. |

### Bildschirm-Unterbefehle (Client-Seite) {/* #screen-subcommands-client-side */}

`/history editor` und `/history graph` öffnen einen Bildschirm auf dem Client des Spielers, der sie eingibt. Sie sind deshalb auf der Client-Seite registriert und brauchen keinen Umweg über den Server.

| Befehl | Aktion | Details |
| :--- | :--- | :--- |
| `/history editor` | Öffnet den Stage-Editor im Spiel. | Braucht OP. Wie ein Klick auf den Editor-Knopf im Pausemenü. |
| `/history graph` | Öffnet die Spieleransicht des Stufen-Graphs. | Wie ein Klick auf den Knopf „Stufen-Graph“ im Pausemenü, also dieselbe gefilterte, schreibgeschützte Ansicht, die Spieler bekommen. Für alle verfügbar, solange `graph.toml` `[general] enabled` an ist; ist es aus, können Operatoren sie trotzdem öffnen, um die Spieleransicht vorab zu prüfen. |

### Debug-Unterbefehle (Client-Seite) {/* #debug-subcommands-client-side */}

Die Unterbefehle `/history debug` sind auf der **Client-Seite** registriert, laufen also auf dem Client des Spielers, der sie eingibt, und brauchen nur, dass dieser Spieler OP hat. Andere Operatoren sehen sie nicht und können sie nicht ausführen, und sie brauchen keinen Umweg über den Server.

| Befehl | Aktion | Details |
| :--- | :--- | :--- |
| `/history debug structure` | Listet Struktur-IDs und -Tags an der aktuellen Position. | Nützlich, um Strukturen für die Sperre `structures` zu bestimmen. Funktioniert nur für Spieler. |
| `/history debug viz` | Schaltet eine Anzeige der Sperrzone um Strukturen in der Nähe ein oder aus. | Zeigt, was `lockPadding` und `clusterDistance` tatsächlich ergeben haben. |
| `/history debug shapes` | Zeigt die einzelnen Teile, aus denen die Sperrzone der Struktur in der Nähe zusammengesetzt wurde. | Das Gegenstück zu `viz` in Zahlen. |
| `/history debug nbt preset` | Listet bekannte NBT-Felder des gehaltenen Items. | Zeigt Werte für Felder, die der NBT-Editor kennt (z. B. `Enchantments`, `CustomModelData`). |
| `/history debug nbt custom` | Listet unbekannte NBT-Schlüssel des gehaltenen Items. | Zeigt Schlüssel-Wert-Paare, fertig für den Dialog `+ Custom NBT Key` im Editor. |
| `/history debug nbt components` | Listet die Data Components des gehaltenen Items. | Die 1.21-Sicht auf dasselbe Item, für Kriterien, die über Components statt über altes NBT geschrieben werden. |
