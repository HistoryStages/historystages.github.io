---
title: Flüssigkeiten
description: "Eine Flüssigkeit sperren statt eines Eimers, damit ein Eintrag jeden Tank und jedes Behälter-Item im Modpack abdeckt, und jedes Rezept, das sie berührt."
sidebar_position: 5
---

# Flüssigkeiten {/* #fluids */}

<Scope global="yes" individual="yes" />

Der Block `fluids` sperrt eine Flüssigkeit über ihre Registry-ID:

```json
{
  "fluids": [
    "minecraft:lava",
    {
      "id": "minecraft:water",
      "unlock_actions": ["pickup"]
    }
  ]
}
```

**Gesperrt wird die Flüssigkeit, erkannt wird aber der Behälter.** Die Mod fragt jeden Item-Stack, was
er *enthält*, statt was er ist. Ein einziger Eintrag `minecraft:lava` deckt also den Vanilla-Eimer,
jeden Mod-Eimer und jedes gefüllte Tank-Item im Modpack ab, ohne dass eine einzige Item-ID in der
Stage-Datei steht.

## Im Editor {/* #in-the-editor */}

![Der Flüssigkeiten-Reiter mit Rezept-Zählern](/img/editor/fluids-tab.webp)

Der Reiter **Fluide**, mit einer Auswahl über jede Flüssigkeit im Modpack. Jede Zeile trägt ein
Abzeichen `[Recipes: N]`, das sagt, wie viele Rezepte dieser Eintrag erreichen würde. Ein Blick darauf
lohnt sich vor dem Hinzufügen, denn die Zahl ist oft größer, als man denkt.

Die sieben Aktionen unten stellst du genauso ein wie bei Item-Einträgen: **Rechtsklick auf die
Zeile**, dann **Sperr-Aktionen**.

## Die sieben Aktionen {/* #the-seven-actions */}

Das Aktions-Vokabular einer Flüssigkeit ist kürzer als das eines Items und hat eine Aktion, die Items
nicht haben:

`use` · `place` · `pickup` · `recipe` · `ingredient` · `loot` · `icon`

`equip`, `attack`, `break` und `gui` werden nicht angeboten: Eine Flüssigkeit trägt man nicht, schwingt
man nicht, baut man nicht ab, und sie öffnet keine eigene GUI.

:::danger[`recipe` und `ingredient` sind zwei verschiedene Dinge, und beide sind standardmäßig an]
`recipe` sperrt die Rezepte, die die Flüssigkeit **herstellen**. `ingredient` sperrt die, die sie
**verbrauchen**. Ein Eintrag ohne `unlock_actions` sperrt alle sieben, also nimmt `minecraft:water`
jedes Rezept aus dem Modpack, das Wasser berührt. In einem großen Modpack ist das eine vierstellige
Zahl an Rezepten.

Das ist die häufigste Überraschung bei Flüssigkeits-Sperren. Grenz den Eintrag mit `unlock_actions`
ein, wenn du das nicht wolltest.
:::

Es beantwortet auch eine Frage, die sonst wie ein Fehler aussieht: **Es verschwinden Rezepte, die
niemand aufgelistet hat.** Eine Flüssigkeit zu sperren nimmt die Rezepte, die sie berühren, aus dem
Herstellen und aus dem Rezept-Browser, auch Rezepte in Maschinen anderer Mods.

Das Abzeichen `[Recipes: N]`, das der Editor an einer Flüssigkeits-Zeile zeigt, gibt es, damit die
Reichweite eines Eintrags *vor* der Entscheidung sichtbar ist und nicht erst danach. Der Index hinter
der Zahl wird nur gebaut, wenn eine Flüssigkeit wirklich gesperrt ist oder der Editor offen ist. Eine
Zeile ohne Abzeichen heißt also entweder „keine“ oder „noch nicht gezählt“; öffne den Reiter einmal,
dann stimmt es.

## Drei bewusste Grenzen {/* #three-deliberate-limits */}

**Für Flüssigkeiten gibt es keine NBT-Kriterien.** Von den vier Stellen, an denen die Mod nach einer
Flüssigkeit gefragt wird, könnte nur das Behälter-Item eins liefern. Ein Flüssigkeits-Block in der Welt
und ein Eintrag im Rezept-Browser tragen nichts zum Vergleichen, also hätte ein Kriterium auf genau den
zwei Flächen nichts bewirkt, die ein Modpack-Autor zuerst prüft.

**Namens- und Tooltip-Überschreibungen erreichen den Behälter, nicht die Flüssigkeit.** Die eigene GUI
eines fremden Tanks und die Tank-Anzeige von Jade zeigen weiter den echten Namen.

**Pumpen, Rohre und platzierte Tanks werden nicht gesperrt.** Ein Spieler, der schon Lava in einem
Tank hat, kann sie weiter bewegen. Das zu sperren hieße, den Tanks anderer Mods die
Flüssigkeits-Schnittstelle wegzunehmen, und das stürzt in fremdem Code ab und lässt sich von außen
nicht abfangen. In der Praxis fällt es selten auf, denn ohne Rezepte und ohne Eimer kommt nichts in
den ersten Tank. Flüssigkeiten, die schon in der Welt liegen, fließen ebenfalls weiter: Eine Sperre
regelt, was ein Spieler *tut*, nicht was die Welt enthält.

## Global oder individuell {/* #global-or-individual */}

Beides, weil nach einer Flüssigkeit nur gefragt wird, wenn ein Spieler dabei ist. Die Ausnahme ist die
Rezept-Seite: In einer individuellen Stage erreicht sie nur die Stationen, die wissen, wer gerade
herstellt, genau wie [`recipes`](/wiki/locking/items-and-recipes/recipes). Öfen, Trichter,
Autocrafter und die meisten Mod-Maschinen antworten global oder gar nicht, und die Mod schreibt eine
Warnung in den Lade-Bericht, wenn eine individuelle Stage etwas verlangt, das sie nicht beantworten
können.

## Die Nachricht für Spieler {/* #the-message-players-get */}

Eine gesperrte Flüssigkeit aus der Welt zu nehmen erzeugt die Nachricht `fluidLocked`, die ein Modpack
unter [`[lock_messages]`](/wiki/server/config-files/visual-toml#lock_messages) überschreiben kann.

## Siehe auch {/* #see-also */}

- [Unlock Actions](/wiki/locking/items-and-recipes/unlock-actions): das Item-Vokabular, dem dieses
  hier entspricht.
- [Rezepte](/wiki/locking/items-and-recipes/recipes): wo die Aktionen `recipe` und `ingredient`
  landen.
- [Mod-Kompatibilität](/wiki/server/mod-compatibility#fluid-locks-and-other-mods-tanks): wie weit eine
  Flüssigkeits-Sperre in andere Mods reicht.
- [Komplette Beispiele](/wiki/stage-file/complete-examples#fluids-trades-and-a-zone)
