---
title: Von 5.x aktualisieren
description: "Was sich in 6.0.0 für bestehende Modpacks geändert hat, darunter der Umzug der Einstellungsdateien und die zwei Verhaltensänderungen."
sidebar_position: 5
---

# Von 5.x aktualisieren {/* #upgrading-from-5x */}

Das meiste in 6.0.0 kommt nur dazu: Stage-Dateien für 5.x laden unverändert, und alte Schreibweisen
werden weiter gelesen. Zwei Dinge ändern sich doch, und eins davon ändert die Bedeutung von Dateien, die
du schon hast.

## Die Einstellungsdateien sind umgezogen {/* #the-settings-files-moved */}

Vor 6.0.0 lagen die Einstellungen in `config/historystages-client.toml` und
`config/historystages-common.toml`, aufgeteilt danach, **wem der Wert gehört**, statt danach, was er tut.
Jetzt sind es `config/historystages/settings/visual.toml` und `gameplay.toml`, nach Thema aufgeteilt. →
[Config-Dateien](/wiki/server/config-files)

**Nichts muss neu eingegeben werden.** Beim ersten Start von 6.0.0 werden beide alten Dateien gelesen,
und jede Einstellung wird an ihren neuen Platz übernommen. Die alten Dateien werden in
`historystages-client.toml.migrated` und `historystages-common.toml.migrated` umbenannt und bleiben
liegen, damit die Originale noch da sind, falls etwas komisch aussieht.

Die Übernahme schreibt eine Zusammenfassung ins Log, und der Config-Editor zeigt beim ersten Öffnen
danach einmalig einen Hinweis.

Zwei Einstellungen wurden entfernt statt übernommen, weil nichts in der Mod sie je gelesen hat:
`lockScrollWhileResearching` und `showDependencyScreenInPedestal`.

:::warning[Die Übernahme bleibt nicht für immer]
Sie bleibt bis **6.3**. Ein Modpack, das von 5.x direkt auf eine spätere Version springt, muss seine
Optionen neu setzen.
:::

### Von Fabric 5.2 {/* #coming-from-fabric-52 */}

Die Übernahme oben liest die beiden alten Dateien von NeoForge und Forge. **Die Fabric-Version 5.2 hat
ihre Einstellungen woanders gespeichert**, in `config/historystages/config.json`, und 6.0 liest diese
Datei nicht. Auf Fabric startet nach dem Update jede Einstellung mit ihrem Standard, und die alten Werte
müssen neu gesetzt werden, im Config-Editor oder in `visual.toml` und `gameplay.toml`.

`config.json` bleibt liegen, damit man die alten Werte noch nachschauen kann. Nichts liest sie mehr, und
sie kann gelöscht werden, sobald die neuen Dateien sagen, was sie gesagt hat.

Stage-Dateien und die Freischaltungen der Welt sind nicht betroffen: Sie liegen am selben Ort und im
selben Format wie unter 5.2.

Fabric springt außerdem direkt von 5.2 auf 6.0, an den Versionen 5.3 bis 5.6 vorbei, die die anderen
Loader dazwischen hatten. Deren Änderungen kommen gleichzeitig an; die
[Release-Notes](https://github.com/Flix100000/History-Stages/releases) haben sie.

## `trade` ist eine neue Aktion und gilt für alte Dateien {/* #trade-is-a-new-action-and-it-applies-to-old-files */}

[`unlock_actions`](/wiki/locking/items-and-recipes/unlock-actions) speichert die Aktionen, die **frei**
bleiben, also ist eine Aktion, die es vorher nicht gab, in jeder älteren Datei gesperrt. Ein Eintrag, den
jemand in 5.x auf `["use"]` eingegrenzt hat, sperrt ab 6.0 auch den Handel.

Das ist so gewollt, denn ein eingegrenzter Eintrag heißt „nur das“, und eine Umwandlung dafür gibt es
absichtlich nicht. Vor einem Update lohnt sich aber ein Blick über die eingegrenzten Einträge.

Zwei kleinere Folgen:

- Der **Ergebnis-Slot eines Handelsfensters** wird nach `trade` beurteilt statt nach `pickup`. Ein
  Eintrag, der Aufheben erlaubt hat, um Handeln zu erlauben, muss stattdessen `trade` angeben.
- Eine Stage, die nur aus eingegrenzten Item-Einträgen besteht, fasst jetzt etwa **544** davon in einem
  Netzwerk-Paket statt 581.

## Rezept-Sperren in individuellen Stages bleiben jetzt erhalten {/* #recipe-locks-in-individual-stages-are-kept-now */}

Vor 6.0 wurde ein `recipes`-Eintrag in einer individuellen Stage beim Laden entfernt. Jetzt bleibt er und
wird an den Stationen gesperrt, die wissen, wer davor steht: Werkbank, das 2×2-Raster des Spielers,
Steinsäge, Schmiedetisch.

Eine individuelle Stage mit Rezept-Einträgen, die bisher nichts getan haben, fängt nach dem Update also
an, etwas zu tun. → [Rezepte](/wiki/locking/items-and-recipes/recipes)

## Eine Spawn-Sperre bedeutet keine Angriffs-Sperre mehr {/* #a-spawn-lock-no-longer-implies-an-attack-lock */}

Bis 6.0.0 hielt eine Spawn-Sperre Spieler auch davon ab, die Kreatur zu schlagen. Diese Kopplung ist weg.
Eine Stage, die sich darauf verlassen hat, lässt die Kreatur jetzt angreifbar; trag sie zusätzlich in
`attacklock` ein. → [Kreaturen & Spawns](/wiki/locking/creatures-and-trade/entities-and-spawns#spawnlock)

## Gesperrte Rezepte sind im Vanilla-Rezeptbuch versteckt {/* #locked-recipes-are-hidden-from-the-vanilla-recipe-book */}

Früher blieben sie sichtbar und ließen sich nur nicht herstellen. `hideLockedRecipesInBook` ist
standardmäßig an; ausschalten bringt das alte Verhalten zurück. →
[visual.toml](/wiki/server/config-files/visual-toml#recipe_book)

## Skripte haben jetzt eine richtige API {/* #scripting-has-a-proper-api-now */}

Die alte Form `ForgeEvents.onEvent` mit dem Klassennamen des Events als String löst weiterhin aus, also
funktionieren bestehende Skripte weiter, aber **die Klasse ist in 6.0.0 umgezogen**, von
`net.bananemdnsa.historystages.events.StageEvent` nach
`net.bananemdnsa.historystages.api.stage.StageEvent`. Ein Skript mit dem alten String braucht den neuen,
und nichts sagt dir, wenn er nicht passt.

Mit `HistoryStagesEvents` kann das nicht schiefgehen, und den Stage-Zustand aus einem Skript zu lesen und
zu ändern geht zum ersten Mal. → [Skripte](/wiki/server/scripting)

## Vier Befehle sind weg {/* #four-commands-are-gone */}

`/history global info`, `/history global list`, `/history individual info` und
`/history individual list` wurden entfernt. Sie gaben eine Stage-Definition als Text aus, die der Editor
besser zeigt. Ein Skript oder eine Quest-Belohnung, die einen davon noch aufruft, bekommt einen
Syntaxfehler.

Die beiden `info`-Befehle für temporäre Stages bleiben, denn sie zeigen Laufzeit-Zustand, den sonst nichts
zeigen kann. → [Befehle](/wiki/server/commands)

## Was 6.0 hinzugefügt hat {/* #what-60-added */}

Kein Changelog, der steht beim [Release](https://github.com/Flix100000/History-Stages/releases). Das hier
ist die kurze Liste der Dinge, die es in 5.x nicht gab, damit du weißt, was sich jetzt zu lesen lohnt:

| | |
| :--- | :--- |
| [Flüssigkeiten](/wiki/locking/items-and-recipes/fluids) | Die Flüssigkeit sperren, nicht den Eimer. |
| [Händler-Angebote](/wiki/locking/creatures-and-trade/merchant-trades) | Einzelne Angebote, Berufe und Händlerstufen. |
| [Zonen](/wiki/locking/world/zones) | Aus Formen gezeichnete Bereiche, mit Barriere und Overlay. **Beta.** |
| [Spawn-Regeln](/wiki/locking/creatures-and-trade/entities-and-spawns) | Ein Spawn-Eintrag hat eine Phase, acht Bedingungen und zusätzliche Biome. |
| [Skripte](/wiki/server/scripting) | KubeJS und CraftTweaker können den Stage-Zustand lesen und ändern. Nicht auf Fabric. |
| [Addon-API](/api/) | Andere Mods können eigene Sperren, Anforderungen und Editor-Reiter anmelden. |
| [Rezepte](/wiki/locking/items-and-recipes/recipes) | Rezept-Sperren pro Spieler an den Stationen, die wissen, wer davor steht. |
| [Abhängigkeiten](/wiki/stage-file/dependencies) | Abgaben über Item-Tags und Anforderungen an die eigenen individuellen Stages des Forschers. |
| [Stage-Modi](/wiki/stage-file/stage-modes#auto) | Auslöser, die eine Stage über Spieler- und Welt-Zustand freischalten. |

Eine Sache, mit der du in einer alten Welt rechnen solltest: Stages, die vor 6.0.0 freigeschaltet wurden,
haben keine gespeicherte Freischalt-Zeit, und der Hintergrund des Stufen-Graphs nutzt genau diesen
Zeitstempel. Bis wieder etwas freigeschaltet wird, entscheidet einmal die tiefste Stage im Baum über den
Hintergrund. → [Stufen-Graph](/wiki/in-game-tools/stage-graph)

## Was sich nicht geändert hat {/* #things-that-did-not-change */}

- Das Format der Stage-Dateien: Alles aus 5.x lädt.
- Stage-IDs und Freischaltungen.
- Die alten Schreibweisen `lock_actions`, flache `structures`-Arrays und `unlock_dimensions` werden alle
  weiter gelesen.

## Siehe auch {/* #see-also */}

- [Versionen & Plattformen](/wiki/about/versions-and-platforms): welche Mod-Version auf welchem Loader
  läuft und welche Wiki-Version sie beschreibt.
