---
title: Verdeckte Anzeige
description: "Was ein Spieler, der die Stage noch nicht freigeschaltet hat, statt des echten Namens, Tooltips und Sperr-Hinweises sieht."
sidebar_position: 7
---

# Verdeckte Anzeige {/* #hidden-display */}

`hidden_display` entscheidet, was ein Spieler, der die Stage **nicht** freigeschaltet hat, statt des
echten Items sieht. Ob das Item gesperrt ist, ändert es nicht, nur wie es sich zeigt. Sobald die Stage
freigeschaltet ist, wird alles wieder normal angezeigt.

## Im Editor {/* #in-the-editor */}

Kein Reiter, denn es gehört zur Stage und nicht zu einer Sperr-Kategorie. **Stage-Einstellungen**, der
Knopf im Bildschirm der Stage, hat es als Karte **Anzeige**: die beiden Modi als Auswahlmenüs, ihre
Ersatztexte als Felder und den Schalter für den Sperr-Hinweis.

Überschreibungen pro Eintrag stellst du direkt beim Eintrag ein: **Rechtsklick** auf das Item, das Tag,
die Mod oder die Flüssigkeit in der Liste und dann **Text überschreiben**.

:::note[Kein „Text überschreiben“ im Menü?]
Das erscheint nur, solange `name_mode` oder `tooltip_mode` dieser Stage auf `"replace"` steht. Sind beide
aus oder auf hidden, gibt es keinen Text, den ein Eintrag überschreiben könnte, also lässt das Menü den
Punkt weg, statt etwas anzubieten, das nichts bewirkt.
:::

```json
{
  "hidden_display": {
    "name_mode": "replace",
    "name_text": "???",
    "tooltip_mode": "replace",
    "tooltip_text": "Unlock the Stone Age to reveal this item.",
    "show_lock_hints": false
  }
}
```

| Schlüssel | Typ | Standard | Was er tut |
| :--- | :--- | :--- | :--- |
| `name_mode` | String | `"off"` | `"off"`: Name unverändert. `"hidden"`: Name wird geleert. `"replace"`: Name wird zu `name_text`. |
| `name_text` | String | `""` | Der Ersatzname, wenn `name_mode` auf `"replace"` steht. |
| `tooltip_mode` | String | `"off"` | `"off"`: Tooltip unverändert. `"hidden"`: zusätzliche Tooltip-Zeilen werden entfernt. `"replace"`: Tooltip wird zu `tooltip_text`. |
| `tooltip_text` | String | `""` | Der Ersatz-Tooltip. `\n` beginnt eine neue Zeile. |
| `show_lock_hints` | Boolean | `true` | Mit `false` fehlen das Schloss-Symbol und die Zeile „Gesperrt“ im Tooltip. |

## Den Tooltip komplett selbst bestimmen {/* #taking-full-control-of-the-tooltip */}

`show_lock_hints` allein bewirkt wenig: Ausgeschaltet entfernt es nur die Schloss-Zeile und lässt
stehen, was das Item sonst zeigen würde. Seinen Zweck erfüllt es zusammen mit
`tooltip_mode: "replace"`. Nur beides zusammen lässt dich jede Zeile bestimmen, die ein gesperrter
Spieler liest:

```json
{
  "hidden_display": {
    "name_mode": "replace",
    "name_text": "Ancient Relic",
    "tooltip_mode": "replace",
    "tooltip_text": "Recovered from the ruins.\nIts purpose is not yet clear.",
    "show_lock_hints": false
  }
}
```

Ohne `show_lock_hints: false` hängt die Mod ihre eigene Zeile „benötigt Stage X“ darunter und verrät
die Antwort.

## Für einen einzelnen Eintrag überschreiben {/* #overriding-it-for-a-single-entry */}

Einträge in `items` und `tags` können ihren eigenen `name_text` und `tooltip_text` haben, die Vorrang
vor denen der ganzen Stage haben:

```json
{
  "hidden_display": {
    "name_mode": "replace",
    "name_text": "???",
    "tooltip_mode": "replace",
    "tooltip_text": "Not yet discovered."
  },
  "items": [
    "minecraft:iron_ingot",
    {
      "id": "minecraft:netherite_ingot",
      "name_text": "A Heavy Metal",
      "tooltip_text": "Heavier than gold, and it does not burn."
    }
  ]
}
```

**Überschrieben wird nur der Text, nie der Modus.** `name_mode` und `tooltip_mode` in
`hidden_display` entscheiden weiterhin, ob überhaupt ersetzt wird. Ein Eintrag mit `name_text` in einer
Stage, deren `name_mode` auf `"off"` steht, zeigt den echten Namen.

## Wenn zwei Stages dasselbe Item ändern {/* #when-two-stages-both-change-the-same-item */}

Zwei gesperrte Stages können beide eine verdeckte Anzeige für dasselbe Item festlegen. Gewinnt, wer
genauer passt: Ein Eintrag für das Item selbst schlägt ein Tag oder eine Mod. Passen beide gleich gut,
gewinnt die Stage, die nach Ordnerpfad und ID zuerst kommt, und globale Stages kommen vor
individuellen. Die Zeilen „du brauchst noch“ im Tooltip listen die Stages in derselben Reihenfolge.

Vor 6.1.0 wurde so ein Gleichstand zufällig entschieden und konnte nach einem Reload umspringen.

## `???` ist das Wort der Mod für „unbekannt“ {/* #-is-the-mods-own-word-for-unknown */}

`hidden_display` ist standardmäßig aus, also wird nichts umbenannt, bis eine Stage es verlangt. Willst
du aber einen Ersatznamen, der zum Rest der Mod passt, nimm `???`. Genau das sagen schon die
eingebauten Sperr-Nachrichten („*??? Dieses Item ist dir noch unbekannt ???*“) und der Knoten einer
versteckten Stage im Stufen-Graph. Das ist bewusster Hausstil, kein vergessener Platzhalter.

## Was die verdeckte Anzeige nicht abdeckt {/* #what-hidden-display-does-not-cover */}

Ein Item, dessen Eintrag die Sperre auf eine einzelne Aktion eingrenzt, etwa nur
[`recipe`](/wiki/locking/items-and-recipes/unlock-actions), wird trotzdem verdeckt angezeigt und hat
trotzdem den Tooltip „benötigt Stage X“. Beides beschreibt, *dass das Item zu einer Stage gehört*, und
das bleibt wahr, egal wie eng die Sperre ist. Alles, was tatsächlich eine Aktion verweigert, liest die
Aktionsliste; die beiden Anzeigen tun das absichtlich nicht.

## Siehe auch {/* #see-also */}

- [Unlock Actions](/wiki/locking/items-and-recipes/unlock-actions): eingrenzen, welche Interaktionen
  eine Sperre abdeckt.
- [visual.toml](/wiki/server/config-files/visual-toml): die serverweiten Standards für
  Sperr-Nachrichten, Tooltips und das Schloss-Overlay. Sie gelten für jede Stage, die sie nicht
  überschreibt.
