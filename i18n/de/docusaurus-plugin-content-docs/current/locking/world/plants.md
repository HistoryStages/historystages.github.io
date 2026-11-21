---
title: Pflanzen
description: "Feldfrüchte und Setzlinge, die nicht wachsen und Knochenmehl ablehnen, bis die Stage offen ist."
sidebar_position: 3
---

# Pflanzen {/* #plants */}

Seit 6.2.0 kann eine Stage **Pflanzen** am Wachsen hindern. Eine gesperrte Feldfrucht bleibt in dem
Stadium, in dem sie gepflanzt wurde, Knochenmehl bewirkt nichts, und ein gesperrter Setzling wird nie
zu einem Baum.

```json
{
  "crops": {
    "crops": [
      "minecraft:wheat",
      "minecraft:cherry_sapling",
      "#minecraft:saplings"
    ]
  }
}
```

Einträge sind Block-IDs oder Block-**Tags** mit `#` davor. Eine einfache Liste geht auch:
`"crops": ["minecraft:wheat"]`.

## Worauf ein Spieler stößt {/* #what-a-player-runs-into */}

- **Das Wachstum hört komplett auf.** Die Pflanze kommt nie über ihr aktuelles Alter hinaus. Ein
  „wächst bis zur Hälfte“ gibt es nicht: gesperrt oder nicht.
- **Knochenmehl wird abgelehnt** und nicht verbraucht. Der Spieler bekommt eine Nachricht in der
  Actionbar. Ein Spender, der Knochenmehl verschießt, wird genauso abgelehnt.
- **Setzlinge, Pilze und Wurzelpilze werden nicht zu ihrem Baum oder Gebilde**, weder von selbst noch
  mit Knochenmehl.

Pflanzen und Ernten gehören nicht zu dieser Sperre. Soll der Samen gar nicht erst in den Boden, sperr
das Samen-Item für die Aktion `place`. →
[Unlock Actions](/wiki/locking/items-and-recipes/unlock-actions)

Mit [Jade](/wiki/server/mod-compatibility) zeigt ein Blick auf eine gesperrte Pflanze, dass sie noch
nicht wächst.

## Im Editor {/* #in-the-editor */}

Der Reiter **Pflanzen** an einer Stage, mit einer durchsuchbaren Auswahl über jeden Block und jedes
Block-Tag. Sperrst du eine ganze Mod, werden ihre Pflanzen als Schritt in derselben Popup-Kette
angeboten wie ihre Kreaturen, Strukturen und Biome.

Den Reiter gibt es nur bei globalen Stages.

## Nur global {/* #global-only */}

Pflanzen wachsen in zufälligen Ticks ohne zugehörigen Spieler, also gibt es keinen Spieler, dessen
individuelle Stages man fragen könnte. Pflanzen-Einträge in einer individuellen Stage werden beim Laden
der Stage entfernt, mit einer Warnung im Lade-Bericht. →
[Globale vs. individuelle Stages](/wiki/start-here/global-vs-individual#what-can-each-one-lock)

## Siehe auch {/* #see-also */}

- [Biome](/wiki/locking/world/biomes): stattdessen eine ganze Gegend feindlich machen.
- [Items, Tags & Mods](/wiki/locking/items-and-recipes/items-tags-mods): das Samen- oder
  Setzlings-Item selbst sperren.
