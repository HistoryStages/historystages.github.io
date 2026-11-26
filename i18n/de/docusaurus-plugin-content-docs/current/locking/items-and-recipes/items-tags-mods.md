---
title: Items, Tags & Mods
description: "Einzelne Items, ganze Item-Tags und jedes Item einer Mod sperren und Ausnahmen wieder aus einer Mod-Sperre herausnehmen."
sidebar_position: 1
---

# Items, Tags & Mods {/* #items-tags--mods */}

<Scope global="yes" individual="yes" />

Vier Felder sperren Items, von einer einzelnen ID bis zu einer ganzen Mod. Sobald ein Item passt,
verhalten sich alle gleich; der Unterschied ist nur, wie weit das Netz ausgeworfen wird.

```json
{
  "items": ["minecraft:iron_ingot"],
  "tags": ["c:ores/iron"],
  "mods": ["create"],
  "mod_exceptions": ["create:andesite_alloy"]
}
```

## Im Editor {/* #in-the-editor */}

![Der Items-Reiter mit Kennzeichen für eingegrenzte Aktionen und NBT](/img/editor/items-tab.webp)

![Der Tags-Reiter](/img/editor/tags-tab.webp)

![Die Tag-Auswahl](/img/editor/tag-picker.webp)

![Die Mod-Auswahl](/img/editor/mod-picker.webp)

![Der Ausnahmen-Reiter, leer bis eine Mod-Sperre eine braucht](/img/editor/exceptions-tab.webp)

Vier eigene Reiter an einer Stage: **Items**, **Tags**, **Mods** und **Ausnahmen**. Jeder hat eine
Suchleiste über die echte Registry, einen Knopf zum Auswählen direkt aus deinem Inventar und einen
Mehrfachauswahl-Modus mit einem Reiter **Gewählt**, um viele auf einmal hinzuzufügen.

**Alles, was du mit einem Eintrag machst, der schon in der Liste steht, ist ein Rechtsklick.** Das
Kontextmenü, das sich öffnet, enthält:

| | |
| :--- | :--- |
| **NBT bearbeiten** | [Kriterien für NBT und Data Components](/wiki/locking/items-and-recipes/nbt-and-components). |
| **Sperr-Aktionen** | [Den Eintrag auf bestimmte Interaktionen eingrenzen](/wiki/locking/items-and-recipes/unlock-actions). |
| **Text überschreiben** | Die eigenen [Texte der verdeckten Anzeige](/wiki/stage-file/hidden-display#overriding-it-for-a-single-entry) dieses Eintrags. |
| **ID kopieren** | Die Registry-ID in die Zwischenablage. |
| **Entfernen** | Nimmt ihn aus der Stage. |

Welche davon erscheinen, hängt vom Reiter ab (ein Mod-Eintrag hat kein NBT zum Bearbeiten), und ein
installiertes Addon kann weiter unten eigene ergänzen, über „ID kopieren“ und „Entfernen“.

## Was „gesperrt“ heißt {/* #what-locked-means */}

![Der Tooltip eines gesperrten Items nennt die Stage, die es braucht](/img/ingame/tooltip-item.webp)

![Ein Eisenbarren, gesperrt über den Tag c:ingots/iron](/img/ingame/tooltip-tag.webp)

![Gesperrte Items tragen in der Hotbar ein Schloss, die letzten drei Slots sind ausgeblendet](/img/ingame/hotbar-locks.webp)

Standardmäßig ist ein passendes Item für **alles** gesperrt: benutzen, damit angreifen, es tragen,
aufheben, platzieren, damit Blöcke abbauen, seine GUI öffnen, im Loot auftauchen, seine Rezepte zeigen
und damit handeln. Das auf eine einzelne Interaktion einzugrenzen, ist die Aufgabe von
[`unlock_actions`](/wiki/locking/items-and-recipes/unlock-actions).

Ein gesperrter **Block** ist ein etwas größeres Thema als ein gesperrtes Item, weil er schon in der
Welt steht:

- Ihn abzubauen dauert 20-mal länger, und er droppt nichts (`lockedBlockBreakSpeedMultiplier`).
- Seine GUI öffnet sich nicht, ob Truhe, Ofen oder Maschine.
- Rüstungsständer und Rahmen mit einem gesperrten Item lassen sich ebenfalls weder benutzen noch
  zerstören.

Jedes davon ist ein Schalter in [gameplay.toml](/wiki/server/config-files/gameplay-toml#gameplay),
und jeder hat einen Zwilling pro Spieler unter `[individual_stages]`.

## Items {/* #items */}

Item-IDs, entweder einfach oder als Objects:

```json
"items": [
  "minecraft:diamond_pickaxe",
  {
    "id": "minecraft:diamond_sword",
    "unlock_actions": ["pickup", "equip"]
  }
]
```

Die Object-Form nimmt [Kriterien über `nbt` / `components`](/wiki/locking/items-and-recipes/nbt-and-components),
[`unlock_actions`](/wiki/locking/items-and-recipes/unlock-actions) und eigene `name_text`- /
`tooltip_text`-Überschreibungen pro Eintrag für die [verdeckte Anzeige](/wiki/stage-file/hidden-display).

## Tags {/* #tags */}

Item-Tags sperren jedes Mitglied auf einmal. Einträge nehmen dieselbe Object-Form wie Items:

```json
"tags": [
  "c:ores/iron",
  {
    "id": "c:ingots/iron",
    "unlock_actions": ["pickup"]
  }
]
```

Ein Tag wird live aufgelöst, also sind auch Items gesperrt, die eine andere Mod später zu
`c:ores/iron` hinzufügt, ohne dass sich die Stage-Datei ändert. Das ist meistens genau der Sinn, und
gelegentlich die Überraschung, wenn eine neu installierte Mod still eine Sperre erweitert, die niemand
angefasst hat.

:::note
Tag-Einträge mit einem NBT-Kriterium werden überall übersprungen, wo es keinen echten Item-Stack zum
Vergleichen gibt, zum Beispiel bei einer Loot-Table-Prüfung ohne Kontext. Einfache Tag-Einträge sind
davon nicht betroffen. → [NBT & Data Components](/wiki/locking/items-and-recipes/nbt-and-components)
:::

## Mods {/* #mods */}

Eine Mod-ID sperrt **jedes Item, das diese Mod registriert**:

```json
"mods": ["mekanism"]
```

Das ist das weiteste Netz, das es gibt, und es wird aus der Registry aufgelöst statt aus einer Liste,
also deckt es auch Items ab, die ein späteres Update der Mod hinzufügt.

Seit 6.1.0 deckt es auch **verzauberte Bücher und Tränke ab, deren Verzauberung oder Effekt aus dieser
Mod kommt**, und solange der Eintrag die Aktion `recipe` sperrt, lehnen Zaubertisch, Amboss und
Braustand die Verzauberungen und Effekte dieser Mod ab. Ausrüstung wird weiter nach ihrer eigenen ID
beurteilt: Ein Vanilla-Schwert mit einer Mod-Verzauberung fängt die Mod-Sperre nicht. Dafür sperrst du
die Verzauberung selbst. → [Verzauberungen & Effekte](/wiki/locking/items-and-recipes/enchantments-and-effects)

## Mod-Ausnahmen {/* #mod-exceptions */}

`mod_exceptions` nimmt Items wieder aus einer `mods`-Sperre heraus. Das ist die übliche Form von „die
ganze Tech-Mod sperren, aber das Einstiegs-Bauteil herstellbar lassen, damit Spieler überhaupt
reinkommen“.

```json
{
  "mods": ["create"],
  "mod_exceptions": [
    "create:andesite_alloy",
    { "id": "create:wrench", "nbt": { "components": { "minecraft:damage": 0 } } }
  ]
}
```

Ausnahmen nehmen dieselben NBT-Kriterien wie Items. Sie heben nur eine `mods`-Sperre auf: Ein Item,
das ausdrücklich in `items` steht, bleibt gesperrt, egal was `mod_exceptions` sagt. Und eine Ausnahme
ist die einzige Kategorie, die nie an einer
[Dual-Phase-Sperre](/wiki/start-here/global-vs-individual#dual-phase-when-both-lists-target-the-same-content)
teilnimmt, weil sie Lücken schneidet statt zu sperren.

## Verzauberungen {/* #enchantments */}

Seit 6.1.0 haben Verzauberungen ein eigenes Feld, das auch Ausrüstung und die Stationen abdeckt. →
[Verzauberungen & Effekte](/wiki/locking/items-and-recipes/enchantments-and-effects)

Der ältere Weg funktioniert weiter und tut, was er immer getan hat: ein `items`-Eintrag für
`minecraft:enchanted_book`, dessen NBT `StoredEnchantments` enthält. Die Mod liest genau diesen
Eintrag, wenn sie entscheidet, ob ein Amboss oder Zaubertisch die Verzauberung überhaupt auftragen
darf:

```json
"items": [
  {
    "id": "minecraft:enchanted_book",
    "nbt": {
      "StoredEnchantments": [
        { "id": "minecraft:mending" },
        { "id": "minecraft:sharpness", "lvl": "4-5" },
        { "id": "minecraft:fortune", "lvl": 3 }
      ]
    }
  }
]
```

`lvl` entscheidet, wie viel der Verzauberung erfasst wird:

| `lvl` | Gesperrt |
| :--- | :--- |
| weggelassen | jede Stufe |
| eine Zahl, `3` | genau diese Stufe |
| ein Bereich als String, `"4-5"` | dieser Bereich, einschließlich |

Der Eintrag oben sperrt also Reparatur komplett, Schärfe nur auf IV und V und Glück nur auf III.
Schärfe III bleibt auftragbar.

Zwei Details, auf die es ankommt: Die Item-ID muss genau `minecraft:enchanted_book` sein, und das
Kriterium muss unter dem alten Schlüssel `StoredEnchantments` stehen statt unter `components`, denn die
Verzauberungs-Prüfung liest genau diese eine Form und nichts anderes. Der Schalter, ob Ambosse und
Zaubertische das beachten, ist `lockEnchanting` in
[gameplay.toml](/wiki/server/config-files/gameplay-toml#gameplay), mit einem Zwilling pro Spieler unter
`[individual_stages]`.

## Global oder individuell? {/* #global-or-individual */}

Beides. Alle vier Felder funktionieren in beiden Arten, aber was sie *tun*, unterscheidet sich stark:
Eine globale Stage nimmt das Rezept aus dem Spiel, eine individuelle lässt das Rezept in Ruhe und lässt
das Item nicht in das Inventar dieses Spielers. Über diesen Unterschied stolpert fast jeder einmal. →
[Global vs. individuell](/wiki/start-here/global-vs-individual#global-and-individual-lock-at-different-layers)

## Siehe auch {/* #see-also */}

- [Unlock Actions](/wiki/locking/items-and-recipes/unlock-actions): eine Interaktion sperren statt
  aller.
- [NBT & Data Components](/wiki/locking/items-and-recipes/nbt-and-components): nur die Items sperren,
  die zu einem Kriterium passen.
- [Rezepte](/wiki/locking/items-and-recipes/recipes): das Rezept sperren statt des Items.
- [Flüssigkeiten](/wiki/locking/items-and-recipes/fluids): ein Eintrag für jeden Eimer und Tank, der
  eine Flüssigkeit enthält.
- [Verdeckte Anzeige](/wiki/stage-file/hidden-display): was gesperrte Spieler stattdessen sehen.
