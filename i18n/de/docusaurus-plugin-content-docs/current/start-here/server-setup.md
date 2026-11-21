---
title: Auf einen Server bringen
description: "Eine Schritt-für-Schritt-Anleitung, wie du History Stages auf einen Multiplayer-Server bringst und Spieler verbindest. Geschrieben für alle, die noch nie einen Server mit Mods eingerichtet haben."
sidebar_position: 2.5
---

# Auf einen Server bringen {/* #putting-it-on-a-server */}

Diese Seite ist für dich, wenn du einen Multiplayer-Server hast und History Stages darauf haben willst,
aber noch nie eine Mod auf einem Server installiert hast. Sie geht Schritt für Schritt vor und setzt
nichts voraus. Wenn du schon einen Server mit Mods betreibst, ist
[Einen Server betreiben](/wiki/server/running-a-server) die kürzere, technischere Fassung.

## Die Kurzfassung {/* #the-short-version */}

History Stages gehört auf den Server **und** in das Spiel jedes Spielers. Dasselbe gilt für Lootr.
Beide Seiten brauchen dieselbe Version. Danach baust du die Stages im Spiel direkt auf dem Server, und
Spieler sehen sie, sobald sie beitreten.

## 1. Prüfen, welche Version du brauchst {/* #1-check-which-version-you-need */}

History Stages gibt es für verschiedene Loader und Minecraft-Versionen. Dein Server sagt dir, welche du
brauchst: Schau, was er laufen lässt (zum Beispiel NeoForge 1.21.1 oder Forge 1.20.1), und lade die
History-Stages-Datei für genau diese Kombination herunter.

[Versionen & Plattformen](/wiki/about/versions-and-platforms) listet auf, welche Versionen es gibt.

## 2. Herunterladen, was du brauchst {/* #2-download-what-you-need */}

Du brauchst diese Dateien, alle für denselben Loader und dieselbe Minecraft-Version wie dein Server:

| Datei | Warum |
| :--- | :--- |
| History Stages | Die Mod selbst. |
| [Lootr](https://modrinth.com/mod/lootr) | Pflicht. Ohne Lootr startet History Stages nicht. |
| Fabric API | Nur auf Fabric. |
| [Architectury API](https://modrinth.com/mod/architectury-api) | Nur auf Minecraft 26.2. |

JEI oder EMI und Jade sind freiwillig, lohnen sich aber. Sie zeigen Spielern, was gesperrt ist, bevor
sie dagegenlaufen. [Installation](/wiki/start-here/installation#what-you-need-alongside-it) erklärt,
was jede davon bringt.

## 3. Die Dateien auf den Server legen {/* #3-put-the-files-on-the-server */}

Jeder Server mit Mods hat einen Ordner `mods` neben seinem Welt-Ordner. Bei einem gemieteten Server
kommst du meistens über das Webpanel des Anbieters dran, unter einem Dateimanager oder einem Reiter
„Dateien“.

1. Stopp den Server.
2. Lade die Dateien aus Schritt 2 in den Ordner `mods` hoch.
3. Starte den Server wieder.

Sobald er läuft, taucht ein neuer Ordner `config/historystages/` auf. Dort werden deine Stages liegen.
Im Moment ist er leer, und ein leerer Ordner heißt: Noch ist nichts gesperrt.

## 4. Jedem Spieler dieselben Mods geben {/* #4-give-every-player-the-same-mods */}

Diesen Schritt vergessen die meisten. History Stages bringt eigene Blöcke, Items und Bildschirme mit,
also kann ein Spieler ohne die Mod dem Server gar nicht beitreten.

Jeder Spieler legt dieselben Dateien in **seinen eigenen** Ordner `mods`, den in seiner
Minecraft-Installation. Die Versionen müssen zu denen auf dem Server passen. Eine fehlende oder
falsche Mod zeigt sich meistens als Fehlerbildschirm, wenn der Spieler beitreten will.

Am einfachsten gibst du das als Modpack weiter: Pack die Mods des Servers in ein CurseForge- oder
Modrinth-Profil und teile es, dann bekommen alle mit einem Klick dasselbe. Bei wenigen Spielern
funktioniert es genauso gut, ihnen die Dateien direkt zu schicken.

## 5. Dich zum Operator machen {/* #5-make-yourself-an-operator */}

Zum Bauen von Stages brauchst du Operator-Rechte (Berechtigungsstufe 2). Gib in der Server-Konsole ein:

```text
op DeinName
```

Bei einem gemieteten Server ist die Konsole meistens im Webpanel. Spieler ohne Operator-Rechte brauchen
sie nie. Forschen, Rollen lesen und den Stufen-Graph ansehen geht für alle.

## 6. Deine erste Stage bauen {/* #6-build-your-first-stage */}

Tritt dem Server bei, drück Escape und klick oben rechts im Pausemenü auf **Stage-Editor**. `/history
editor` im Chat öffnet denselben Bildschirm. Alles, was du dort speicherst, geht direkt an den Server
und an jeden Spieler, der online ist. Neu starten musst du nichts.

[Installation & deine erste Stage](/wiki/start-here/installation#your-first-stage) zeigt Schritt für
Schritt, wie du eine erste Stage im Editor baust. Auf einem Server geht das genauso wie im
Einzelspieler.

## 7. Spieler Stages freischalten lassen {/* #7-let-players-unlock-stages */}

Von Haus aus haben Spieler keinen Weg, etwas zu erforschen. Die Mod bringt keine Rezepte für das
Forschungspodest oder die Rollen mit, weil du als Modpack-Autor entscheidest, wie Spieler sich ihren
Fortschritt verdienen. Solange du kein Rezept, keine Quest-Belohnung oder etwas Ähnliches einbaust,
gibt es sie nur über `/give` und den Kreativmodus.

[Rollen & Podeste beschaffen](/wiki/in-game-tools/research/obtaining) hat fertige Rezepte zum
Kopieren.

Um eine Stage ohne Forschung zu testen, schaltest du sie per Befehl frei und sperrst sie wieder:

```text
/history global unlock <stage id>
/history global lock <stage id>
```

## Wie alles zusammenhängt {/* #how-it-all-fits-together */}

Falls die Einrichtung klappt, die Mod selbst aber noch verwirrend wirkt, hier die ganze Idee in ein
paar Sätzen.

Du legst **Stages** an, zum Beispiel „Eisenzeit“. Jede Stage hat eine Liste von Dingen, die sie
gesperrt hält: Items, Rezepte, Dimensionen, Mobs und so weiter. Solange die Stage gesperrt ist, können
Spieler nichts von dieser Liste benutzen. Sobald jemand die Stage an einem Forschungspodest mit einer
Forschungsrolle **erforscht**, öffnet sie sich, und der Inhalt wird verfügbar.

Eine Stage ist entweder **global**, dann schaltet ein Spieler sie für den ganzen Server frei, oder
**individuell**, dann muss jeder Spieler sie für sich selbst freischalten.
[Globale vs. individuelle Stages](/wiki/start-here/global-vs-individual) erklärt, was zu welcher Art
Server passt.

## Etwas funktioniert nicht? {/* #something-does-not-work */}

- **Spieler können nicht beitreten:** Vergleiche die `mods`-Ordner. Server und Spieler brauchen
  dieselben Versionen von History Stages und Lootr.
- **Der Knopf „Stage-Editor“ fehlt im Pausemenü:** Du bist noch kein Operator, siehe Schritt 5. Wurdest
  du zum Operator, während du schon auf dem Server warst, schließ das Pausemenü und öffne es neu.
- **Eine Sperre tut nicht, was du erwartet hast:** Schau dir die neueste `debug-*.log` in
  `config/historystages/logs/` auf dem Server an. Sie listet die Probleme auf, die in jeder Stage-Datei
  gefunden wurden, zum Beispiel IDs, die es nicht gibt.

Wenn du nicht weiterkommst, steht unter [Hilfe bekommen](/wiki/about/getting-help), wo du fragen kannst
und was du mitbringen solltest.
