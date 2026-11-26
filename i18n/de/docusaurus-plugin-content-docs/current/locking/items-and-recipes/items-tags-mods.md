---
title: Items, Tags & Mods
description: "Einzelne Items, ganze Item-Tags und jedes Item einer Mod sperren und Ausnahmen wieder aus einer Mod-Sperre herausnehmen."
sidebar_position: 1
---

# Items, Tags & Mods {/* #items-tags--mods */}

<Scope global="yes" individual="yes" />

Vier Felder sperren Items, von einer einzelnen ID bis zu einer ganzen Mod. Sobald ein Item passt,
verhalten sich alle vier gleich; sie unterscheiden sich nur darin, wie weit das Netz ausgeworfen wird.

| Feld | Sperrt | Gut für |
| :--- | :--- | :--- |
| [`items`](#items) | Eine Item-ID | Ein bestimmtes Werkzeug, einen Block, eine Zutat |
| [`tags`](#tags) | Jedes Item in einem Item-Tag, auch später hinzugekommene | Alle Eisenerze, alle Barren |
| [`mods`](#mods) | Alles, was eine Mod registriert | Eine ganze Tech-Mod sperren |
| [`mod_exceptions`](#mod-exceptions) | Items, die aus einer `mods`-Sperre wieder herausgenommen werden | Ein Einstiegs-Item durchlassen |

## Einrichten {/* #in-the-editor */}

<Tabs groupId="setup">
<TabItem value="editor" label="Im Editor">

<Gallery items={[
  {src: "/img/editor/items-tab.webp", alt: "Der Items-Reiter mit Kennzeichen für eingegrenzte Aktionen und NBT", wide: true},
  {src: "/img/editor/tags-tab.webp", alt: "Der Tags-Reiter", wide: true},
  {src: "/img/editor/tag-picker.webp", alt: "Die Tag-Auswahl"},
  {src: "/img/editor/mod-picker.webp", alt: "Die Mod-Auswahl"},
  {src: "/img/editor/exceptions-tab.webp", alt: "Der Ausnahmen-Reiter, leer bis eine Mod-Sperre eine braucht", wide: true},
]} />

1. Öffne eine Stage und wähle den Reiter **Items**, **Tags**, **Mods** oder **Ausnahmen**.
2. Drück **+ Add**. Die Auswahl durchsucht die echte Registry; der Reiter **Inventar** nimmt direkt
   aus deinem eigenen Inventar, und **Gewählt** sammelt mehrere auf einmal.
3. Drück **Save**.

Alles, was du mit einem Eintrag machst, der schon in der Liste steht, ist ein **Rechtsklick**:

| Menüeintrag | Was er tut |
| :--- | :--- |
| **NBT bearbeiten** | [Kriterien für NBT und Data Components](/wiki/locking/items-and-recipes/nbt-and-components). |
| **Sperr-Aktionen** | [Den Eintrag auf bestimmte Interaktionen eingrenzen](/wiki/locking/items-and-recipes/unlock-actions). |
| **Text überschreiben** | Die eigenen [Texte der verdeckten Anzeige](/wiki/stage-file/hidden-display#overriding-it-for-a-single-entry) dieses Eintrags. |
| **ID kopieren** | Die Registry-ID in die Zwischenablage. |
| **Entfernen** | Nimmt ihn aus der Stage. |

Welche davon erscheinen, hängt vom Reiter ab (ein Mod-Eintrag hat kein NBT zum Bearbeiten), und ein
installiertes Addon kann weiter unten eigene ergänzen, über „ID kopieren“ und „Entfernen“.

</TabItem>
<TabItem value="file" label="In der Stage-Datei">

Alle vier sind Listen an der Stage:

```json title="config/historystages/global/iron_age.json"
{
  "items": ["minecraft:iron_ingot"],
  "tags": ["c:ores/iron"],
  "mods": ["create"],
  "mod_exceptions": ["create:andesite_alloy"]
}
```

Ein Eintrag ist entweder eine einfache ID oder ein Object, das mehr dazu angibt; die Abschnitte
unten zeigen beides. Nach einer Änderung von Hand führst du `/history reload` aus.

</TabItem>
</Tabs>

## Was „gesperrt“ heißt {/* #what-locked-means */}

<Gallery items={[
  {src: "/img/ingame/tooltip-item.webp", alt: "Der Tooltip eines gesperrten Items nennt die Stage, die es braucht"},
  {src: "/img/ingame/tooltip-tag.webp", alt: "Ein Eisenbarren, gesperrt über den Tag c:ingots/iron", wide: true},
  {src: "/img/ingame/hotbar-locks.webp", alt: "Gesperrte Items tragen in der Hotbar ein Schloss, die letzten drei Slots sind ausgeblendet", wide: true},
]} />

Standardmäßig ist ein passendes Item für **alles** gesperrt: benutzen, damit angreifen, es tragen,
aufheben, platzieren, damit Blöcke abbauen, seine GUI öffnen, im Loot auftauchen, seine Rezepte zeigen
und damit handeln. Willst du nur einen Teil davon sperren, nimm
[`unlock_actions`](/wiki/locking/items-and-recipes/unlock-actions).

Ein gesperrter **Block** steht schon in der Welt, deshalb geht die Sperre etwas weiter:

| Ein gesperrter Block … | Schalter in [gameplay.toml](/wiki/server/config-files/gameplay-toml#gameplay) |
| :--- | :--- |
| lässt sich nur 20-mal langsamer abbauen und droppt nichts | `lockBlockBreaking`, `lockedBlockBreakSpeedMultiplier` |
| öffnet seine GUI nicht (Truhe, Ofen, Maschine) | `lockBlockInteraction` |
| lässt sich auf einem Rüstungsständer oder in einem Rahmen weder nehmen noch zerstören | `lockEntityItems` |

Jeder davon hat einen Zwilling pro Spieler unter `[individual_stages]`.

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

Die Object-Form nimmt:

| Schlüssel | Wofür |
| :--- | :--- |
| `nbt` / `components` | [Nur die Stacks, die zu einem Kriterium passen](/wiki/locking/items-and-recipes/nbt-and-components) |
| `unlock_actions` | [Nur bestimmte Interaktionen](/wiki/locking/items-and-recipes/unlock-actions) |
| `name_text` / `tooltip_text` | Die eigene [verdeckte Anzeige](/wiki/stage-file/hidden-display) dieses Eintrags |

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

<details>
<summary>Tag-Einträge mit einem NBT-Kriterium</summary>

Sie werden überall übersprungen, wo es keinen echten Item-Stack zum Vergleichen gibt, zum Beispiel
bei einer Loot-Table-Prüfung ohne Kontext. Einfache Tag-Einträge sind davon nicht betroffen. →
[NBT & Data Components](/wiki/locking/items-and-recipes/nbt-and-components)

</details>

## Mods {/* #mods */}

Eine Mod-ID sperrt **jedes Item, das diese Mod registriert**:

```json
"mods": ["mekanism"]
```

Das ist das weiteste Netz, das es gibt, und es wird aus der Registry aufgelöst statt aus einer Liste,
also deckt es auch Items ab, die ein späteres Update der Mod hinzufügt.

Es deckt auch **verzauberte Bücher und Tränke ab, deren Verzauberung oder Effekt aus dieser Mod
kommt**.<Since v="6.1.0" /> Solange der Eintrag die Aktion `recipe` sperrt, lehnen Zaubertisch,
Amboss und Braustand die Verzauberungen und Effekte dieser Mod ab.

<details>
<summary>Ausrüstung mit einer Mod-Verzauberung</summary>

Ausrüstung wird weiter nach ihrer eigenen ID beurteilt: Ein Vanilla-Schwert mit einer
Mod-Verzauberung fängt die Mod-Sperre nicht. Dafür sperrst du die Verzauberung selbst. →
[Verzauberungen & Effekte](/wiki/locking/items-and-recipes/enchantments-and-effects)

</details>

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
das ausdrücklich in `items` steht, bleibt gesperrt, egal was `mod_exceptions` sagt.

<details>
<summary>Ausnahmen und Dual-Phase-Sperren</summary>

Eine Ausnahme ist die einzige Kategorie, die nie an einer
[Dual-Phase-Sperre](/wiki/start-here/global-vs-individual#dual-phase-when-both-lists-target-the-same-content)
teilnimmt, weil sie Lücken schneidet statt zu sperren.

</details>

## Verzauberungen {/* #enchantments */}

Verzauberungen haben ein eigenes Feld, das auch Ausrüstung und die Stationen abdeckt.<Since v="6.1.0" /> →
[Verzauberungen & Effekte](/wiki/locking/items-and-recipes/enchantments-and-effects)

<details>
<summary>Der ältere Weg: ein verzaubertes Buch in <code>items</code></summary>

Er funktioniert weiter und tut, was er immer getan hat: ein `items`-Eintrag für
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
Kriterium muss unter dem alten Schlüssel `StoredEnchantments` stehen statt unter `components`. Der
Schalter, ob Ambosse und Zaubertische das beachten, ist `lockEnchanting` in
[gameplay.toml](/wiki/server/config-files/gameplay-toml#gameplay), mit einem Zwilling pro Spieler unter
`[individual_stages]`.

</details>

## Global oder individuell? {/* #global-or-individual */}

Beides. Alle vier Felder funktionieren in beiden Arten, aber was sie *tun*, unterscheidet sich stark:

| | Globale Stage | Individuelle Stage |
| :--- | :--- | :--- |
| Das Rezept | wird aus dem Spiel genommen | bleibt; andere Spieler können es weiter herstellen |
| Das Item | ist für alle gesperrt | kommt nicht in das Inventar dieses Spielers |

Über diesen Unterschied stolpert fast jeder einmal. →
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
