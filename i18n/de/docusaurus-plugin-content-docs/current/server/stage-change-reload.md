---
title: Reloads nach einer Stage-Änderung
description: "Warum das Freischalten einer Stage früher den Server einfror, was History Stages seit 6.2.0 stattdessen tut, die Messungen und die drei Einstellungen für Modpacks, die sie brauchen."
sidebar_position: 3.5
---

# Reloads nach einer Stage-Änderung {/* #reloads-after-a-stage-change */}

Eine Stage, die Rezepte sperrt, ändert die Rezeptliste, wenn sie aufgeht oder zugeht. History Stages
selbst braucht dafür nichts, weil es bei jeder Benutzung eines Rezepts die Sperre fragt. **Andere Mods**
schon: Eine Maschine, die ihre eigene Kopie der Rezeptliste hält, bietet ein gesperrtes Rezept weiter an,
bis ihr etwas sagt, diese Kopie neu zu bauen.

Bis 6.1 war dieses Etwas bei jeder Stage-Änderung, die Rezepte betraf, ein voller Datapack-Reload,
dasselbe wie `/reload`. Seit 6.2.0 macht History Stages einen viel kleineren Reload, der nur die Mods
erreicht, die ihn brauchen, und der Server läuft dabei weiter.

**Einstellen musst du dafür nichts.** Es ist der Standard. Diese Seite ist für den Fall, dass du wissen
willst, was passiert, oder dass eine Mod in deinem Modpack eine Änderung nicht mitbekommt.

## Warum der alte Weg den Server einfror {/* #why-the-old-way-froze-the-server */}

Ein voller Reload macht viel, was eine Stage-Änderung nicht braucht. Er öffnet jedes Ressourcenpaket
neu (eins pro Mod), liest jede Rezept-, Loot-Table-, Tag- und Fortschritts-Datei noch einmal, kompiliert
Funktionen neu, speichert alle Spieler und schickt Tags und Rezepte noch einmal an jeden Client. Der
Server-Thread wartet, bis all das fertig ist, bevor er wieder tickt.

Bei einem kleinen Modpack merkte das niemand. Bei einem großen stand der ganze Server bei jeder
Freischaltung zwanzig Sekunden und länger still: Mobs eingefroren, Chat tot, nichts bewegte sich. Auf
dem Client fingen JEI und EMI obendrein noch einmal von vorn an.

Was eine Stage-Änderung tatsächlich braucht, ist eine Sache: „Mods, vergesst die Rezeptlisten, die ihr
euch gemerkt habt.“

## Was 6.2.0 stattdessen tut {/* #what-620-does-instead */}

Jede Mod, die auf einen Datapack-Reload reagiert, meldet dafür einen Listener an. History Stages merkt
sich diese Listener beim Start und führt nach einer Stage-Änderung **nur sie** neu aus, nicht Minecrafts
eigene Lader, kein Einlesen von Dateien, keine Tags. Der Server tickt weiter, während sie arbeiten.

- **Nur wenn es zählt.** Eine Stage-Änderung, die nicht ändert, welche Rezepte gesperrt sind, löst gar
  nichts aus.
- **Skripte bleiben draußen.** KubeJS- und CraftTweaker-Skripte würden ihre Rezept-Änderungen ein
  zweites Mal auf eine Rezeptliste anwenden, die sie schon bearbeitet haben, also gehören sie nie dazu.
- **JEI und EMI starten nicht neu.** Ihnen wird gesagt, welche Items sie zeigen oder verstecken sollen,
  und nur die ändern sich.

## Die Messungen {/* #the-measurements */}

Gemessen an einem Modpack mit 121 Mods und rund 11.800 Rezepten, NeoForge 1.21.1. „Stillstand“ ist die
längste Strecke ohne einen einzigen Server-Tick. Jede Zeile sperrt eine Stage und schaltet sie frei;
beide Zahlen stehen da.

| Stage-Änderung | `FULL` (bis 6.1) | `BACKGROUND` | `TARGETED` (Standard ab 6.2) |
| :--- | :--- | :--- | :--- |
| 10 Items, 28 Rezepte | 27,7 / 29,2 s | 14,1 / 14,4 s | 0,79 / 0,83 s |
| Gefärbte Blöcke, 231 Rezepte | 22,6 / 22,1 s | 13,1 / 16,4 s | 0,82 / 1,02 s |
| Ganz Mekanism, 308 Rezepte | 23,5 / 23,1 s | 14,1 / 15,0 s | 1,07 / 0,83 s |
| Schlimmster Fall, 3.731 Rezepte | 22,2 / 24,0 s | 23,0 / 26,1 s | 0,88 / 1,19 s |

Bei `FULL` startete außerdem JEI nach jeder Freischaltung auf jedem Client neu, was weitere 1,6–4,4
Sekunden dauerte. Mit den anderen beiden Modi startete es kein einziges Mal neu; die geänderten Items
zu zeigen und zu verstecken dauerte 50–400 ms.

Der ganze gezielte Reload dauerte von Anfang bis Ende 1,8–3,3 Sekunden, aber der Server tickte die ganze
Zeit durch.

**Wo der Rest der Zeit hinging.** Die ersten gezielten Durchläufe standen noch etwa zehn Sekunden still.
Fast alles davon war ein einziger Listener, der Maschinen-Lader von Modular Machinery Reborn, der seine
Maschinen-Definitionen neu liest und überhaupt keine Rezepte hält. Ihn auszulassen brachte den
Stillstand unter eine Sekunde. Genau dafür gibt es [`targetedReloadSkip`](#targetedreloadskip), und
dieser Listener steht standardmäßig drauf.

Wie groß der Gewinn ist, hängt vom Modpack ab. Ein kleines hatte wenig zu gewinnen: Bei einem Test-Aufbau
mit 17 Mods ging der Stillstand von etwa 2 Sekunden auf etwa 50 ms.

## Die Einstellungen {/* #the-settings */}

Alle drei stehen im Abschnitt [`[advanced]`](/wiki/server/config-files/gameplay-toml#advanced) von
gameplay.toml und im Config-Editor unter **Erweitert**. Der Abschnitt steht absichtlich zuletzt; die
Standards passen für fast jedes Modpack.

### `reloadAfterStageChange` {/* #reloadafterstagechange */}

| Wert | Was er tut |
| :--- | :--- |
| `TARGETED` | Der Standard. Führt nur die eigenen Reload-Listener der Mods neu aus, der Server läuft weiter. |
| `BACKGROUND` | Der volle Datapack-Reload, aber der Server läuft weiter, während er lädt. Jede Mod sieht ihn genau wie `/reload`. Jede Mod erledigt ihren Teil trotzdem in einem Rutsch, also kann es kürzere Ruckler geben. |
| `FULL` | Der volle Reload, bei dem der Server wartet, genau wie jede 6.x-Version vor 6.2.0. Nur als Notlösung. |

### `targetedReloadSkip` {/* #targetedreloadskip */}

Listener, die der gezielte Reload auslässt, mit vollem Klassennamen. Standard: der Maschinen-Lader von
Modular Machinery Reborn und die Spawn-Tabellen von The Hordes.

Trag einen Listener nur ein, wenn er **eigene Daten lädt und keine Rezepte hält**. Lässt du einen aus,
der doch Rezepte hält, bekommen seine Maschinen Stage-Änderungen erst beim nächsten `/reload` mit.

### `slowListenerHintMs` {/* #slowlistenerhintms */}

Nach jedem gezielten Reload nennt das Server-Log die Listener, die den Server-Thread mindestens so lange
aufgehalten haben (Standard 250 ms; `0` schaltet den Hinweis ab). Die Zeile sieht so aus:

```text
[HistoryStages/TargetedReload] Held the server thread longest: some.mod.SomeLoader [somemod] 1100 ms, ...
```

Das ist die Liste, die du prüfst, wenn sich Stage-Änderungen noch langsam anfühlen. Schau nach, was jede
genannte Mod dort lädt. Maschinen-Definitionen, Spawn-Tabellen oder Quest-Daten sind Kandidaten für
`targetedReloadSkip`; alles, was mit Rezepten zu tun hat, nicht.

## Wenn eine Maschine noch ein gesperrtes Rezept anbietet {/* #if-a-machine-still-offers-a-locked-recipe */}

1. Sperr eine Stage, die eins der Rezepte dieser Maschine sperrt, und prüf die Maschine.
2. Bietet sie das Rezept noch an, setz `reloadAfterStageChange` auf `BACKGROUND` und versuch es noch
   einmal.
3. Behebt das das Problem, baut die Mod ihre Rezeptliste irgendwo neu, wo der gezielte Reload nicht
   hinkommt. Bitte [melde das](/wiki/about/getting-help) mit dem Namen der Mod, damit sie abgedeckt
   werden kann.
4. `FULL` ist die letzte Notlösung und verhält sich genau wie 6.1.

## Welche Versionen das haben {/* #which-versions-have-this */}

6.2.0 auf allen Loadern: NeoForge 1.21.1, Forge 1.20.1, Fabric 1.21.1 und die 26.2-Beta. →
[Versionen & Plattformen](/wiki/about/versions-and-platforms)

## Siehe auch {/* #see-also */}

- [Große Modpacks](/wiki/server/large-packs): was sonst noch mit der Größe eines Modpacks wächst.
- [gameplay.toml](/wiki/server/config-files/gameplay-toml#advanced): die Einstellungen auf einen Blick.
- [Rezepte](/wiki/locking/items-and-recipes/recipes): was eine Rezept-Sperre überhaupt tut.
