---
title: Slots
description: "Inventar- und Behälter-Slots geschlossen halten, bis eine Stage offen ist: die Hotbar, Rüstung, Nebenhand oder ausgewählte Slots einer Truhe oder Maschine."
sidebar_position: 9
---

# Slots {/* #slots */}

<Scope global="yes" individual="partly" note="Individuell: nur das eigene Inventar. Behälter-Slots brauchen eine globale Stage." />

Eine Stage kann **Slots** geschlossen halten: einen Teil des eigenen Inventars des Spielers
oder ausgewählte Slots einer Truhe, eines Ofens oder einer Mod-Maschine.<Since v="6.2.0" /> Ein Modpack, das Spieler mit
einer Hotbar aus drei Slots starten lässt und den Rest Stage für Stage verteilt, braucht eine
Stage-Datei pro Schritt.

```json
{
  "slots": [
    { "target": "player", "slots": [3, 4, 5, 6, 7, 8], "mode": "hide" },
    { "target": "minecraft:chest", "slots": [18, 19, 20, 21, 22, 23, 24, 25, 26], "mode": "overlay" }
  ]
}
```

Hier fehlen die rechten zwei Drittel der Hotbar, und die unterste Reihe jeder Truhe ist mit einem
Schloss abgedeckt, bis die Stage offen ist.

## Was ein Eintrag enthält {/* #what-one-entry-holds */}

| Feld | Was es tut |
| :--- | :--- |
| `target` | `player` für das eigene Inventar des Spielers. Sonst der Block, aus dem ein Behälter geöffnet wird (`minecraft:chest`, `minecraft:furnace`, eine Maschinen-ID), oder der Menü-Typ, wenn kein Block dahintersteht, etwa bei einem Rucksack, der aus einem Item geöffnet wird. |
| `slots` | Slot-Nummern. Siehe [unten](#which-number-is-which-slot). |
| `mode` | `hide` oder `overlay`. Standard ist `overlay`. |
| `look` | Nur bei `overlay`: wie die Abdeckung aussieht. Siehe [Das Aussehen](#the-look). |
| `hint` | Optionaler Text, der erscheint, wenn ein Spieler mit der Maus über den gesperrten Slot fährt. |

### `hide` und `overlay` {/* #hide-and-overlay */}

- **`hide`**: Der Slot ist einfach weg. Kein Item, kein Rahmen in Vanilla-Bildschirmen, eine Lücke in
  der Hotbar. Nimm das, wenn es den Slot noch nicht geben soll.
- **`overlay`**: Der Slot bleibt sichtbar, mit einem Schloss darüber, nimmt keine Items an und zeigt
  beim Drüberfahren einen Tooltip. Nimm das, wenn der Spieler sehen soll, dass noch mehr kommt.

So oder so lehnt der Slot alles ab: Klicks, Shift-Klicks, Tauschen per Zifferntaste und Nebenhand,
Block auswählen, Aufheben vom Boden, andere Mods, die Items hineinlegen, und Rüstung per Rechtsklick
oder Werfer. Bei Vanilla-Behältern werden auch Trichter und Spender abgelehnt.

Spieler im Kreativmodus sind nicht betroffen.

### Welche Nummer welcher Slot ist {/* #which-number-is-which-slot */}

**Bei `player`** sind die Nummern Inventar-Positionen:

| Slots | Wo |
| :--- | :--- |
| 0–8 | Hotbar, von links nach rechts |
| 9–35 | Die drei Reihen des Hauptinventars |
| 36–39 | Rüstung: Stiefel, Hose, Brustpanzer, Helm |
| 40 | Nebenhand |

Eine Nummer über 40 gibt es nicht; sie wird mit einer Warnung im Lade-Bericht verworfen.

**Bei einem Behälter** sind die Nummern die Slots seines Bildschirms, ab 0 gezählt; eine einfache Truhe
hat 0–26. Eine **große Truhe ist dasselbe Ziel wie eine einfache**: Die Auswahl schaltet zwischen klein
und groß um, Slots 0–26 gelten für beide, und 27–53 gibt es nur in der großen.

Am einfachsten zählst du gar nicht: Die Auswahl im Editor zeichnet den echten Bildschirm, und du klickst
die Slots an.

## Items, die schon in einem gesperrten Slot liegen {/* #items-already-in-a-locked-slot */}

Wird ein Slot gesperrt, während etwas darin liegt, weil eine Stage wieder gesperrt wird oder du die
Sperre in einer laufenden Welt hinzufügst, wird das Item **vor die Füße des Spielers geworfen**. So
hält ein gesperrter Hotbar-Slot kein Schwert, das der Spieler noch schwingen kann.

Setz [`dropItemsFromLockedSlots`](/wiki/server/config-files/gameplay-toml#gameplay) auf `false`, um sie
stattdessen liegen zu lassen. Das Item bleibt, funktioniert weiter, und der Slot ist um es herum
eingefroren: Es lässt sich nicht herausnehmen oder tauschen, bis die Stage offen ist.

Wird eine individuelle Stage wieder gesperrt, während ihr Spieler offline ist, fallen die Items beim
nächsten Einloggen heraus.

## Das Aussehen {/* #the-look */}

<Gallery items={[
  {src: "/img/ingame/inventory-locked.webp", alt: "Das Inventar mit gesperrten Items und ausgeblendeten Hotbar-Slots"},
  {src: "/img/ingame/chest-locked-row.webp", alt: "Eine Truhe, deren untere Reihe im Overlay-Modus gesperrt ist"},
]} />

Ein `overlay`-Slot bekommt eine Tönung und ein Symbol darüber. Alles davon ist optional; ein Eintrag
ohne `look`-Block bekommt eine halbtransparente schwarze Abdeckung mit Schloss-Symbol.

```json
{
  "target": "player",
  "slots": [36, 37, 38, 39],
  "mode": "overlay",
  "look": { "color": "#3a2a10", "opacity": 70, "icon": "item", "item": "minecraft:iron_chestplate", "size": "full" },
  "hint": "Armour comes with the Iron Age"
}
```

| Feld | Werte | Standard |
| :--- | :--- | :--- |
| `color` | Eine Hex-Farbe, `#rrggbb`. | `#000000` |
| `opacity` | 0–100. | `50` |
| `icon` | `lock`, `item` oder `none`. | `lock` |
| `item` | Das Item, das gezeichnet wird, wenn `icon` auf `item` steht. | – |
| `size` | `small`, `medium` oder `full`. | `medium` |
| `texture` | Eine Block- oder Item-Textur, die den Slot statt Farbe und Symbol abdeckt. | – |

Ein Ressourcenpaket kann eine eigene Textur unter `textures/block` oder `textures/item` mitbringen, die
hier ausgewählt wird.

**Sperren mehrere Stages denselben Slot,** gewinnt ein angepasstes Aussehen gegen das Standard-Aussehen.
Zwischen zwei angepassten gewinnt die Stage, deren ID alphabetisch zuerst kommt.

## Der Tooltip {/* #the-tooltip */}

Fährt man über einen `overlay`-Slot, erscheint ein Tooltip mit dem Titel, dem `hint` des Eintrags und
den Stages, die er braucht. Welche Zeilen er zeigt, in welcher Reihenfolge und in welcher Farbe, legst
du einmal für das ganze Modpack unter
[`[slot_lock]`](/wiki/server/config-files/visual-toml#slot_lock) in visual.toml fest. Der
[Config-Editor](/wiki/in-game-tools/in-game-editor#the-config-editor) hat dafür einen kleinen
Layout-Editor mit Live-Vorschau, unter **Slot Lock**.

`hide`-Slots haben keinen Tooltip, denn es ist nichts mehr da, worüber man fahren könnte.

## Im Editor {/* #in-the-editor */}

![Der Slots-Reiter](/img/editor/slots-tab.webp)

Der Reiter **Slots** an einer Stage. **Spieler-Inventar** steht oben; Behälter fügst du aus einer
durchsuchbaren Liste aller Blöcke mit Bildschirm hinzu, nach Mod gruppiert, mit einem zweiten Reiter
für Menü-Typen.

**Slots bearbeiten** öffnet die Auswahl. Sie zeichnet den echten Bildschirm, du klickst also die Slots
an, die du willst, mit Schnellknöpfen für Hotbar, Inventar, Rüstung, alle, keine und umkehren. Modus
und Aussehen liegen auf einer zweiten Seite, mit einer Vorschau, wie es im Spiel aussieht.

Manche Mod-Bildschirme lassen sich außerhalb der Welt nicht zeichnen. Für die bietet die Auswahl
**In der Welt wählen**: Öffne den echten Behälter in der Welt und klick dort die Slots an; Esc bricht
ab.

## Global oder individuell {/* #global-or-individual */}

| Ziel | Global | Individuell |
| :--- | :---: | :---: |
| `player` | ja | ja |
| Ein Behälter | ja | **nein** |

Zwei Spieler, die in dieselbe Truhe schauen, können nicht unterschiedliche Slots sehen, und ein
Trichter hat gar keinen Spieler. Behälter-Einträge in einer individuellen Stage werden beim Laden der
Stage entfernt, mit einer Warnung im Lade-Bericht.

## Für Addons und andere Mods {/* #for-addons-and-other-mods */}

Inventar-Sortierer, Mods mit eigenen Slots und Skripte können fragen, ob ein Slot offen, versteckt oder
abgedeckt ist. → [Lock Categories](/api/lock-categories#slots-slotlockquery)

## Siehe auch {/* #see-also */}

- [Items, Tags & Mods](/wiki/locking/items-and-recipes/items-tags-mods): sperren, was in einen Slot
  kommt, statt den Slot selbst.
- [gameplay.toml](/wiki/server/config-files/gameplay-toml#gameplay): `dropItemsFromLockedSlots`.
- [visual.toml](/wiki/server/config-files/visual-toml#slot_lock): das Tooltip-Layout.
