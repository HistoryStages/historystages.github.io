---
title: Hilfe & Fehler melden
description: "Wo du fragen kannst, was dir der Lade-Bericht schon sagt und was in einen Fehlerbericht gehört."
sidebar_position: 2
---

# Hilfe & Fehler melden {/* #getting-help--reporting-bugs */}

Fragen, Fehler und Wünsche sind an beiden Orten willkommen; nimm den, den du sowieso offen hast:

- [**Discord**](https://discord.gg/BeZzxyZ9c4): am schnellsten für Fragen und Hilfe beim Bauen eines
  Modpacks, und auch gut, um einen Fehler zu melden oder eine Funktion vorzuschlagen.
- [**GitHub Issues**](https://github.com/Flix100000/History-Stages/issues): besser für alles, wo ein Log
  dazugehört oder was später noch auffindbar sein soll.

Ein Fehler, der auf Discord gemeldet wird, geht nicht verloren; er wird zu einem Issue, wenn er eins
braucht.

## Vor dem Melden: den Lade-Bericht prüfen {/* #before-reporting-check-the-load-report */}

Jeder Start und jedes `/history reload` schreibt eine `debug-*.log` nach `config/historystages/logs/`.
Ihr Kopf nennt die Versionen von History Stages, Minecraft und NeoForge, die geladenen Kompat-Mods und
jedes Addon, das die API nutzt. Darunter kommen die Probleme, die beim Laden gefunden wurden, nach der
Stage-Datei gruppiert, zu der sie gehören, Fehler zuerst:

- doppelte Stage-IDs in einem Ordnerbaum
- Item-, Rezept-, Kreatur- oder Struktur-IDs, die es nicht gibt
- Rezept-IDs, die in einer Stage standen, aber nicht mehr im Spiel sind, die KubeJS-Nummerierungsfalle
- Bedingungen pro Spieler in einer globalen Stage, die übersprungen statt geprüft werden
- Sperr-Arten in einer Stage-Art, die sie nicht unterstützen kann

Wiederholte Hinweise derselben Art werden nach fünf zusammengefasst, und der Config-Abschnitt listet nur
Einstellungen, die vom Standard abweichen. Fehler und Warnungen landen außerdem in `latest.log`, mit dem
Pfad zum Bericht. Addons können eigene Prüfungen und Abschnitte hinzufügen. →
[Diagnostics](/api/diagnostics)

Ein überraschend großer Teil von „die Sperre funktioniert nicht“ ist am Ende eine Zeile in dieser Datei.
Sie ist auch das Erste, was du an einen Bericht anhängen solltest.

## Laufzeit-Logging einschalten {/* #turning-on-runtime-logging */}

Der Lade-Bericht deckt den Start ab. Für das, was *während* des Spielens passiert, also
Stage-Änderungen, blockierte Aktionen und entfernte Inventar-Items, schaltest du das Laufzeit-Logging
ein:

```toml
[logging]
enableRuntimeLogging = true
```

Es schreibt `runtime-*.log` neben den Lade-Bericht. Standardmäßig aus, weil es gesprächig ist. →
[gameplay.toml](/wiki/server/config-files/gameplay-toml#logging)

`showDebugErrors` im selben Block regelt, ob Probleme beim Laden der Stages auch im Chat angekündigt
werden, wenn ein Spieler beitritt. Schalte es bei einem veröffentlichten Modpack ab.

## Dinge im Spiel anschauen {/* #looking-at-things-in-game */}

| Befehl | Zeigt |
| :--- | :--- |
| `/history debug structure` | Struktur-IDs und -Tags an deiner Position, der zuverlässige Weg, eine ID richtig zu bekommen. |
| `/history debug viz` | Zeichnet die Sperrzone um Strukturen in der Nähe, damit `lockPadding` und `clusterDistance` sichtbar sind statt geraten. |
| `/history debug shapes` | Die einzelnen Teile, aus denen diese Zone zusammengesetzt wurde. |
| `/history debug nbt preset` | Bekannte NBT-Felder am gehaltenen Item. |
| `/history debug nbt custom` | Unbekannte NBT-Schlüssel am gehaltenen Item. |
| `/history debug nbt components` | Die Data Components des gehaltenen Items. |

Alle laufen auf deinem eigenen Client und brauchen nur deinen eigenen Operator-Status. →
[Befehle](/wiki/server/commands#debug-subcommands-client-side)

## Die üblichen Verdächtigen {/* #common-first-suspects */}

**Eine von Hand bearbeitete Stage-Datei tut nichts.** `/history reload` muss laufen: Die Ordner werden
beim Start und bei diesem Befehl gelesen, nicht bei jeder Änderung einer Datei.

**Eine Sperre wird komplett ignoriert.** Prüf die Stage-Art. `spawnlock` und `block_generation` gehen nur
global, `lose_on_death` nur individuell, und vier Abhängigkeits-Arten brauchen einen einzelnen Spieler.
Der Lade-Bericht nennt sie. →
[Global vs. individuell](/wiki/start-here/global-vs-individual#what-can-each-one-lock)

**Ein Rezept lässt sich in einer Maschine noch herstellen.** Eine individuelle Stage erreicht nur die
Stationen, die wissen, wer davor steht. Öfen, Trichter und Autocrafter gehen nur global. →
[Rezepte](/wiki/locking/items-and-recipes/recipes)

**Es sind Rezepte verschwunden, die niemand aufgelistet hat.** Fast immer ein Flüssigkeits-Eintrag: Ohne
`unlock_actions` sperrt er jedes Rezept, das die Flüssigkeit *verbraucht*, genauso wie die, die sie
herstellen. → [Flüssigkeiten](/wiki/locking/items-and-recipes/fluids)

**Eine Stage hat sich ins Nichts umbenannt.** Der Dateiname ist die Stage-ID, und Freischaltungen werden
unter dieser ID gespeichert. Die Datei umzubenennen verwirft sie.

**Etwas ändert sich erst nach einem Neustart.** JEI und EMI bauen ihre Rezeptlisten beim Start auf, also
erscheint alles, was einen Rezept-Eintrag im Browser hinzufügt oder entfernt, etwa das Wiederversiegeln,
erst danach.

## Eine Stage ist zu groß zum Senden {/* #a-stage-is-too-large-to-send */}

Eine einzelne Stage hat eine Größengrenze für das Paket, das sie speichert. Eine Stage mit mehreren
hundert einzeln aufgeführten Items, jedes mit `unlock_actions` eingegrenzt, kann sie erreichen. Der Editor
lehnt das Speichern dann ab und zeigt einen Toast, der das sagt, statt die Verbindung abbrechen zu
lassen.

**Die Lösung sind fast immer Item-Tags.** Ein Eintrag `#c:ingots` ersetzt beliebig viele einzelne
Barren-IDs, erledigt dieselbe Aufgabe und kostet einen Bruchteil des Platzes. Er erfasst auch Items, die
Mods später hinzufügen.

Stage-Daten, die an Spieler geschickt werden, sind seit 6.0.0 komprimiert. Das hat den älteren Fehler
beseitigt, bei dem ein sehr großes Modpack einen Client gar nicht durchs Einloggen bekam.

## Was in einen Bericht gehört {/* #what-to-put-in-a-report */}

- Mod-Version, Loader und Minecraft-Version, siehe
  [Versionen & Plattformen](/wiki/about/versions-and-platforms).
- Die `debug-*.log` aus `config/historystages/logs/`.
- Die Stage-Datei, die sich falsch verhält, oder der passende Teil davon.
- Ob es eine globale oder eine individuelle Stage ist. Das zählt öfter, als man denkt.
- Ob es im Einzelspieler passiert, auf einem dedizierten Server oder bei beidem.

Ist eine andere Mod beteiligt, sag welche; die hilfreichen Berichte nennen meistens eine. →
[Mod-Kompatibilität](/wiki/server/mod-compatibility)

Dieselbe Liste gilt, egal wo du es meldest. Auf Discord geht das alles, eine Log-Datei eingeschlossen.
