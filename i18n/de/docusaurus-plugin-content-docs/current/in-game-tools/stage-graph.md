---
title: Stufen-Graph
description: "Die Fortschrittskarte für Spieler: Knoten, Linien und wie viel vom Baum du zeigst."
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Der Stufen-Graph ist ein interaktiver Knoten-Graph des Fortschritts in einem Modpack, gemacht für Spieler. Er zeigt Stages als Knoten, verbunden durch Abhängigkeits-Linien, damit Spieler sehen, was sie freigeschaltet haben, was als Nächstes kommt und wie alles zusammenhängt, ohne Inhalte zu verraten, die sie noch nicht erreicht haben.

Es gibt einen Graph-Bildschirm mit zwei Eingängen. Aus dem **Pausemenü** ist es die Spieleransicht, gefiltert nach den Regeln unten. Aus der **Stage-Übersicht** im [Editor](/wiki/in-game-tools/in-game-editor) ist es die Admin-Ansicht, die diese Regeln ignoriert und jede Stage zeigt; dort werden Layout und Gestaltung pro Stage gemacht. `/history graph` öffnet die Spieleransicht, damit ein Operator prüfen kann, was ein Spieler tatsächlich sehen würde. Seit 6.2.0 hat die Spieleransicht einen Knopf **Zurück**, und große Graphen werden viel schneller gezeichnet.

![Der Stufen-Graph](/img/screenshots/stage-graph.webp)

## Einschalten {/* #enabling-it */}

Der Stufen-Graph ist **standardmäßig aus**. Ein Modpack-Autor schaltet ihn ein, indem er `enabled = true` unter `[general]` in `graph.toml` setzt, entweder von Hand oder über den Reiter **Graph** im [Config-Editor](/wiki/in-game-tools/in-game-editor#the-config-editor) im Spiel. Danach erscheint im Vanilla-Pausemenü für jeden Spieler ein Knopf „Stufen-Graph“, neben dem Editor-Knopf, den weiterhin nur Operatoren haben.

Der Titel des Bildschirms ist standardmäßig ein Übersetzungsschlüssel (`graph.historystages.title`), lässt sich aber über denselben Rich-Text-Dialog wie an anderen Stellen im Editor auf eigenen formatierten Text setzen, auch mit `&`-Farbcodes.

## Sichtbarkeits-Modi {/* #visibility-modes */}

![Der Stage-Graph aus Spielersicht: nur Freigeschaltetes und was als Nächstes kommt](/img/ingame/graph-player-view.webp)

![Ein Klick auf eine Stage zeigt, was sie braucht und wohin sie führt](/img/ingame/graph-node-details.webp)

`[visibility].mode` legt fest, welche Stages ein Spieler sieht, vom offensten zum strengsten:

| Modus | Verhalten |
| :--- | :--- |
| `ALL` | Jede Stage wird gezeigt, egal wie weit der Spieler ist. |
| `PROGRESSIVE` *(Standard)* | Freigeschaltete Stages, ihre direkten Abhängigkeits-Nachbarn in beide Richtungen und alles, was gerade irgendwo erforschbar ist, auch frei stehende Wurzeln unberührter Zweige. |
| `PROGRESSIVE_STRICT` | Derselbe Nachbarschafts-Ring um freigeschaltete Stages, aber erforschbare Stages, die mit nichts verbunden sind, was der Spieler schon freigeschaltet hat, fallen weg (keine „schwebenden“ Wurzeln). Eine erforschbare Stage, die Nachbar von etwas Freigeschaltetem *ist*, wird weiterhin gezeigt. |
| `UNLOCKED_ONLY` | Nur Stages, die der Spieler schon freigeschaltet hat. |

Eine Stage, die der aktuelle Modus versteckt, versteckt auch ihre Linien; es gibt keinen Platzhalter- oder „???“-Knoten. Eine Stage, die im Editor von der Karte genommen wurde, wird Spielern nie gezeigt, und eine Stage mit einem Baustein [Versteckt, solange …](/wiki/stage-file/logic-blocks#hidden-while) erscheint als „???“ oder verschwindet, solange ihre Bedingung zutrifft. Das ist **nur ein Anzeige-Filter**: Er macht den Graph lesbarer und verhindert Spoiler, ist aber keine Sicherheitsgrenze, denn die Stage-Daten sind schon auf dem Client.

Zwei verwandte Schalter: `respectHiddenDisplay` (Standard `true`) wendet die Einstellungen der [verdeckten Anzeige](/wiki/stage-file/hidden-display) jeder Stage auch im Graph an, und `showIndividualStages` (Standard `true`) legt fest, ob individuelle Stages neben globalen erscheinen.

## Layout und Aussehen {/* #layout-and-appearance */}

`[canvas]` steuert die Fläche des Graphs selbst: Hintergrund-Stil (`GRID`, `SOLID` oder `TEXTURE` mit einstellbarer Textur), die Grundfarbe darunter (`backgroundColor`, Standard `#17171A`; sie scheint durch das Raster, steht bei `SOLID` allein und übernimmt überall, wo eine Textur nicht geladen werden kann), Rastergröße, Start-, Mindest- und Höchst-Zoom, ob sich die Ansicht beim Öffnen automatisch einpasst und ob Knoten- und Linien-Animationen an sind.

`[edges]` steuert, wie Abhängigkeits-Linien gezeichnet werden: eigene Farben und Linien-Stile (`SOLID`/`DASHED`) für erfüllte und offene Abhängigkeiten, Linienbreite, Führung (`STRAIGHT`, `ORTHOGONAL` oder `CURVED`), Pfeilspitzen und der Stil für „ODER“-Gruppen (standardmäßig gestrichelt; das ist das einzige sichtbare Zeichen, dass eine Gruppe ODER statt UND ist).

`[panel]` steuert, welche Abschnitte im Detail-Fenster einer Stage erscheinen: Stage-Abhängigkeiten, Items, XP, Fortschritte, Kills, Statistiken, Scoreboard, Auslöser, Freischaltungen und Beschreibung, jeder einzeln schaltbar. `showBlockedReason` (Standard `true`) ergänzt, warum eine [blockierte](/wiki/stage-file/logic-blocks#blocked-while) Stage blockiert ist. Abschnitte ohne eigenen Schalter, also Item-Tags und alles, was ein Addon beisteuert, werden immer gezeigt; die sieben Anforderungs-Schalter gehören zu Config-Werten, die es nur für diese sieben gibt.

## Knoten gestalten {/* #node-styling */}

`[style.global.<state>]` und `[style.individual.<state>]` (insgesamt acht Blöcke, einer pro Stage-Art × Zustand: `unlocked`, `reachable`, `locked`, `blocked`) steuern das Standard-Aussehen jedes Knotens: Form (`RECT`, `ROUNDED`, `CIRCLE`, `DIAMOND`, `HEXAGON`), Größe, Rahmenfarbe und -breite, Füllfarbe und -deckkraft, Beschriftung (`NONE`, `ID`, `DISPLAY_NAME`), Beschriftungsfarbe und ob das Status-Abzeichen gezeigt wird. Das Status-Abzeichen ist der Schalter `checkmark`: ein Haken an freigeschalteten Knoten, ein rotes Durchfahrt-verboten-Zeichen an [blockierten](/wiki/stage-file/logic-blocks#blocked-while). `blocked` ist standardmäßig rot mit Abzeichen. Globale Stages sind standardmäßig abgerundete Rechtecke, individuelle Rauten, damit man beide auf einen Blick unterscheiden kann.

### Gestaltung pro Stage {/* #per-stage-overrides */}

![Der Knoten-Stil mit einer Vorschau für jeden Zustand](/img/editor/graph-node-style.webp)

![Die Farbauswahl](/img/editor/graph-colour.webp)

Über die Standards des ganzen Graphs hinaus können einzelne Stages ihren eigenen Stil haben, optional je nach Sperr-Zustand. Das wird pro Modpack in `settings/graph_stages.json` gespeichert und normalerweise im Graph-Bildschirm selbst bearbeitet (für Operatoren zugänglich) statt von Hand. Jede angepasste Stage kann festlegen:

- Eine **Beschreibung** (wörtlicher Text oder ein Übersetzungsschlüssel), die in ihrem Detail-Fenster erscheint.
- Einen Grund-**Stil**, der in jedem Sperr-Zustand gilt.
- Eine **Stil-Vorlage**, auf die sie zeigt, siehe [Stil-Vorlagen](#style-presets).
- **Stil-Überschreibungen** pro Zustand (`unlocked` / `reachable` / `locked` / `blocked`), die über den Grund-Stil gelegt werden.
- Einen **Hintergrund**, den die ganze Karte annimmt, sobald die Stage freigeschaltet ist, siehe unten.

Überschreibbar sind dieselben Felder wie in den TOML-Stil-Blöcken (Form, Größe, Rahmen, Füllung, Beschriftung, Haken usw.). Die Reihenfolge ist: eingebauter Standard → Standards aus `graph.toml` → die Vorlage der Stage → der eigene Grund-Stil der Stage → die Überschreibung der Stage für den Zustand. So kann ein Modpack-Autor eine einzelne Meilenstein-Stage hervorheben (ein Sechseck, eine eigene Farbe), ohne das Gesamtbild des Graphs zu ändern. Die beiden Reiter unten zeigen dieselben Felder auf beiden Seiten dieser Reihenfolge: den Standard aus der Config für freigeschaltete globale Stages und eine Stage, die ihn überschreibt.

<Tabs>
<TabItem value="toml" label="⚙️ graph.toml">

```toml
[style.global.unlocked]
shape = "ROUNDED"
size = 1.0
border = "#44CC99"
borderWidth = 2
fill = "#2E8B62"
fillOpacity = 0.35
label = "DISPLAY_NAME"
labelColor = "#DDDDDD"
checkmark = true
```

</TabItem>
<TabItem value="json" label="🗂️ graph_stages.json">

```json
{
  "global": {
    "iron_age": {
      "styles": {
        "unlocked": {
          "shape": "HEXAGON",
          "border": "#E8B347",
          "fill": "#B8791F",
          "checkmark": true
        }
      }
    }
  }
}
```

</TabItem>
</Tabs>

Jedes Feld, das in der Überschreibung fehlt, hier `size`, `borderWidth`, `fillOpacity`, `label` und `labelColor`, fällt auf den Standard aus `graph.toml` oben zurück und nicht auf irgendeinen eigenen eingebauten Wert. Deshalb muss eine Meilenstein-Stage nur nennen, was sich tatsächlich ändert.

### Stil-Vorlagen {/* #style-presets */}

![Die Liste der Stil-Vorlagen](/img/editor/graph-presets.webp)

Eine Vorlage ist ein benanntes Knoten-Aussehen, auf das Stages zeigen. Änderst du die Vorlage einmal,
folgt jede Stage, die sie benutzt. Die eigenen Stil-Werte einer Stage liegen weiterhin obendrauf, also
bleibt „Boss, aber mit blauem Rahmen“ blau. Vorlagen decken das Knoten-Aussehen in jedem Zustand ab,
nicht den Karten-Hintergrund.

```json
{
  "presets": {
    "boss": { "name": "Boss", "style": { "shape": "HEXAGON", "size": 1.6 }, "styles": { "locked": { "fill": "#552222" } } }
  },
  "global": { "iron_age": { "preset": "boss", "style": { "border": "#4A7DFF" } } }
}
```

Sie stehen in `graph_stages.json` neben den Stage-Einträgen, reisen also mit dem Modpack. Die ID einer
Vorlage entsteht beim Anlegen aus ihrem Namen und ändert sich nie, also berührt ein Umbenennen keine
Stage. Eine Vorlage zu löschen entfernt sie aus jeder Stage; die Stages behalten ihre eigenen Werte.

*Im Graph-Editor:* **Vorlagen** in der oberen Leiste listet sie mit Vorschau, wie viele Stages jede
benutzen, und Bearbeiten, Umbenennen und Löschen. Rechtsklick → **Stil-Vorlage zuweisen** wirkt auf die
ganze Auswahl. Das Fenster für den Knoten-Stil hat eine Vorlagen-Zeile, um eine zu wählen, sie zu
bearbeiten oder das aktuelle Aussehen als neue zu speichern; Werte, die aus der Vorlage kommen, sind
markiert. Einen Stil zu kopieren und einzufügen nimmt die Vorlage mit.

### Der Hintergrund ändert sich mit dem Fortschritt {/* #the-background-changes-as-you-progress */}

Eine Stage kann einen eigenen `background`-Block haben, und die Karte nimmt ihn an, sobald diese Stage freigeschaltet ist. So geht die Karte sichtbar mit, während ein Modpack gespielt wird, statt an Tag eins und an Tag sechzig gleich auszusehen.

```json
{
  "global": {
    "iron_age": {
      "background": { "mode": "SOLID", "color": "#181899" }
    }
  }
}
```

Alle drei Felder, `mode`, `texture` und `color`, sind optional; ein leeres fällt auf `graph.toml` zurück. Der Block wird im Stil-Fenster des Graphs bearbeitet, in einem eigenen Reiter **Hintergrund**.

Vier Dinge daran solltest du wissen, weil jedes davon sonst wie ein Fehler wirkt:

- **Welcher Hintergrund gewinnt:** die **zuletzt freigeschaltete** Stage, die einen hat, pro Spieler ermittelt, wobei globale und individuelle Stages im selben Topf konkurrieren. Wird diese Stage wieder weggenommen, übernimmt die nächstjüngere.
- **Nur Spieler sehen ihn.** Der Editor zeichnet immer `graph.toml`, damit ein Operator, der den Graph anordnet, das Grund-Thema sieht statt dessen, was er selbst gerade freigeschaltet hat.
- **Welten aus der Zeit vor 6.0.0 haben keine Freischalt-Zeiten.** Bis wieder etwas freigeschaltet wird, gewinnt die tiefste schon freigeschaltete Stage im Baum, die beste Schätzung für „zuletzt“ ohne Uhr.
- **Etwas schon Freigeschaltetes noch einmal freizuschalten macht es nicht zum neuesten.** Gespeichert wird die Zeit der ersten Freischaltung.

## Das Layout bearbeiten {/* #editing-the-layout */}

![Der Stage-Graph im Editor, links die Stage-Liste](/img/editor/graph-editor.webp)

![Rechtsklick auf einen Knoten](/img/editor/graph-node-menu.webp)

![Die Legende des Graphen](/img/editor/graph-legend.webp)

Das ist die Editor-Ansicht, geöffnet aus der Stage-Übersicht.

**Stages platzieren.** Stages, die noch nicht auf der Karte sind, stehen in einem Abschnitt unten in
der Seitenleiste, mit ihren Symbolen und einem Vermerk „indiv.“, durchsuchbar wie der Rest der
Seitenleiste. Zieh eine Zeile auf die Karte, um sie zu platzieren. Um eine Stage von der Karte zu
nehmen, zieh sie auf die Seitenleiste oder nimm **Aus dem Graph entfernen** im Kontextmenü. Spieler
sehen eine entfernte Stage und ihre Linien nie.

**Mehrere auf einmal.** Strg+Klick fügt eine Stage zur Auswahl hinzu oder nimmt sie heraus, Strg+Ziehen
auf leerer Fläche zieht einen Auswahlrahmen, und eine markierte Stage zu ziehen bewegt die ganze Auswahl.
**Mit allen Abhängigen wählen** nimmt eine Stage und alles, was an ihr hängt. Esc leert zuerst die
Auswahl und schließt den Graph beim zweiten Drücken.

**Neu anordnen** legt einen Baum automatisch aus. Es lässt eine leere Spalte zwischen den Ebenen, damit
Beschriftungen nicht ineinanderlaufen, und schiebt eine Stage, die nichts braucht, in die Spalte vor
ihrer ersten abhängigen Stage.

**Rückgängig und Wiederholen** decken jede Layout-Änderung ab: Verschieben, Platzieren, Stages von der
Karte nehmen und Neu anordnen. Der Verlauf übersteht einen Abstecher in den Stage-Editor und endet, wenn
du die Verbindung trennst. Ändert jemand anderes in der Zwischenzeit denselben Baum, wird der Verlauf
verworfen, statt seine Arbeit zu überschreiben.

### Tastenkürzel {/* #keyboard-shortcuts */}

| Taste | Was sie tut | Wo |
| :--- | :--- | :--- |
| Strg+Z / Strg+Y (oder Strg+Shift+Z) | rückgängig / wiederholen | Editor |
| Strg+A / Strg+D | alles wählen / nichts wählen | Editor |
| Entf | die Auswahl von der Karte nehmen | Editor |
| Strg+F | zur Suche in der Seitenleiste springen | beide |
| Leertaste | alles ins Bild einpassen | beide |
| `+` / `-` / `0` | hineinzoomen / herauszoomen / zurück zum Start-Zoom | beide |
| F1 | die Kürzel-Übersicht zeigen oder verstecken | beide |
| Esc | die Übersicht schließen, dann die Auswahl leeren, dann schließen | beide |

Buchstaben richten sich nach dem Zeichen auf der Taste, also ist Strg+Z auch auf einer QWERTZ-Tastatur
das Z. Das **?** oben rechts öffnet dieselbe Übersicht, angedockt, damit die Karte benutzbar bleibt.

## Im Spiel einstellen {/* #configuring-in-game */}

`graph.toml` lässt sich komplett im Spiel bearbeiten, über den Reiter **Graph** im [Config-Editor](/wiki/in-game-tools/in-game-editor#the-config-editor), neben den Reitern Client und Common. Änderungen werden sofort gespeichert und an verbundene Clients übertragen, genau wie bei den anderen Config-Reitern.
