---
title: Tarnungen
description: "Ein gesperrtes Item oder einen gesperrten Block wie etwas anderes aussehen lassen, bis der Spieler ihn benutzen darf: Smaragderz, das bis zur Eisenzeit Stein ist."
sidebar_position: 7
---

# Tarnungen {/* #disguises */}

:::info[Neu in 6.1.0]
:::

Ein gesperrtes Item kann wie ein anderes Item aussehen und ein gesperrter Block in der Welt wie ein
anderer Block, bis der Spieler ihn benutzen darf. Smaragderz, das wie Stein aussehen soll, wird als
Stein gezeichnet, klingt wie Stein, zeigt in jedem Inventar das Stein-Modell und den Namen Stein und
wird in dem Moment zu Erz, in dem die Stage, die es sperrt, freigeschaltet wird.

Das ist die Idee hinter Revelationary, fest eingebaut. Revelationary selbst wird weder gebraucht noch
benutzt.

## Wo die Regeln stehen {/* #where-the-rules-live */}

Tarnungen gehören zum **Item**, nicht zu einer Stage, damit zwei Stages sich nicht darüber streiten
können, wie derselbe Block aussieht. Alle stehen in einer Datei:

```json title="config/historystages/settings/disguises.json"
{
  "minecraft:emerald_ore": { "as": "minecraft:stone", "drops": "disguise", "hints": false },
  "#c:ores/diamond":       { "as": "minecraft:deepslate" }
}
```

Der Schlüssel ist eine Item-ID oder ein Item-Tag (`#...`). Mod-IDs sind nicht erlaubt.

| Feld | Standard | Was es tut |
| :--- | :--- | :--- |
| `as` | – (Pflicht) | Das Item, wie es aussieht. |
| `drops` | `"real"` | `"real"` behält die normalen Sperr-Regeln; `"disguise"` lässt den Block wie die Tarnung abbauen und droppen. |
| `hints` | `true` | `false` versteckt für dieses Item das Schloss, die Tooltip-Zeilen „benötigt Stage“ und die Sperr-Zeilen in Jade, damit nichts die Tarnung verrät. |
| `nbt` | – | Nur bei Item-Regeln: Die Tarnung gilt nur für Stacks, die passen. So eine Regel tarnt nie einen Block in der Welt, weil ein platzierter Block kein NBT hat. |

Fehlt die Datei, gibt es keine Tarnungen. Eine Regel mit einer unbekannten ID wird mit einer Zeile im
Lade-Bericht übersprungen.

## Wann eine Tarnung aktiv ist {/* #when-a-disguise-is-active */}

Solange **irgendeine** Stage, global oder individuell, das Item für den Spieler sperrt, der es
anschaut. Das wird pro Spieler entschieden, also können zwei Spieler nebeneinander verschiedene Blöcke
sehen. Austauschbare Stages und Logikbausteine zählen wie gewohnt.

Die Tarnung ignoriert [`unlock_actions`](/wiki/locking/items-and-recipes/unlock-actions): Ein Eintrag,
der auf eine einzelne Aktion eingegrenzt ist, behält seine Tarnung trotzdem, bis die Stage offen ist.

**Eine Item-Regel schlägt eine Tag-Regel.** Passen mehrere Tag-Regeln, gewinnt die erste nach
sortiertem Schlüssel, und der Editor warnt vor der Überschneidung.

**Ketten werden verfolgt.** Ist die Tarnung selbst gesperrt und hat eine Regel, gilt als Nächstes diese
Regel. Erz, getarnt als Andesit, wobei Andesit gesperrt und als Stein getarnt ist, zeigt sich als Stein;
sobald Andesit freigeschaltet ist, zeigt sich das Erz als Andesit. Schleifen zwischen Regeln werden
beim Laden der Datei und im Editor abgelehnt.

## Was sich ändert, solange sie aktiv ist {/* #what-changes-while-it-is-active */}

**In der Welt:** Der Block wird als Tarnung gezeichnet, mit ihren Partikeln und ihren Geräuschen beim
Abbauen, Betreten und Platzieren. Eigenschaften, die beide Blöcke haben, etwa die Ausrichtung, werden
übernommen.

**Als Item:** Modell und Name der Tarnung überall, wo Items erscheinen, JEI und EMI eingeschlossen.
Setzt eine sperrende Stage einen Namen für die [verdeckte Anzeige](/wiki/stage-file/hidden-display),
gewinnt dieser Name gegen den der Tarnung.

**Abbauen mit `"drops": "disguise"`:** Abbaugeschwindigkeit, nötiges Werkzeug, Drops und XP kommen alle
von der Tarnung, und die Sperre
[`break`](/wiki/locking/items-and-recipes/unlock-actions#the-actions) wird für diesen Block
übersprungen. Behutsamkeit und Glück wirken so, wie sie auf die Tarnung wirken würden. Eine Tarnung, die
sich nicht abbauen lässt, wie Grundgestein, macht auch den echten Block unzerstörbar. Das gilt nur für
Spieler: Explosionen, Kolben und Maschinen droppen den echten Block.

**Abbauen mit `"drops": "real"`:** Die Sperr-Regeln des Items gelten unverändert. Ein Stein, der
Smaragde droppt, verrät alles, also kombiniere `real` mit einer `break`-Sperre, wenn dir das wichtig
ist.

**Editor-Bildschirme zeigen immer die echten Items.**

## Grenzen {/* #limits */}

Nicht abgedeckt: der F3-Bildschirm, die Item-ID in erweiterten Tooltips, Block auswählen (Mittelklick),
das Licht, das der Block abgibt, und seine Umriss- und Kollisionsform.

Bekannte Konflikte:

- **Shaderpacks**, die Erze anhand ihrer echten Block-ID leuchten lassen.
- **Verbundene Texturen** (Continuity und Ähnliches) können Nähte zeigen, wo ein getarnter Block auf
  einen echten trifft.
- **Vein Miner** können den echten Block auslassen oder mitnehmen.
- Ein Tarnungs-Ziel mit durchsichtigen Teilen kann falsch gezeichnet werden, weil der Chunk die
  Render-Einstellungen des echten Blocks behält. Erz zu Stein ist kein Problem.

## Im Editor {/* #in-the-editor */}

- **Rechtsklick auf eine Item- oder Tag-Zeile → Tarnung.** Der Dialog hat das Item, wie es aussehen
  soll, **Drops** (Echt / Wie Tarnung) und **Sperr-Hinweise zeigen**, dazu, welche Stages das Item
  sperren und ob auch der Block in der Welt getarnt ist. Getarnte Zeilen tragen ein Abzeichen.
- **Tarnungen** im Kopfmenü der Übersicht listet jede Regel mit ihrem Aussehen, ihren Drops, ihren
  Hinweisen und den Stages, die sie sperren. Regeln, deren Item nirgends gesperrt ist, sind ausgegraut
  und unten einsortiert. **+ Hinzufügen** legt eine Regel für ein Item an, das noch in keiner Stage
  steht.

Der Editor speichert in `disguises.json` und schickt die neuen Regeln an jeden Spieler.

## Siehe auch {/* #see-also */}

- [Verdeckte Anzeige](/wiki/stage-file/hidden-display): Name und Tooltip ändern, ohne das Aussehen zu
  ändern.
- [Items, Tags & Mods](/wiki/locking/items-and-recipes/items-tags-mods): das Item selbst sperren.
