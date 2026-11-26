---
title: Verzauberungen & Effekte
description: "Bücher, Ausrüstung und Tränke nach den Verzauberungen und Trank-Effekten sperren, die sie tragen, und Zaubertisch, Amboss und Braustand, die sie herstellen."
sidebar_position: 6
---

# Verzauberungen & Effekte {/* #enchantments--effects */}

<Scope global="yes" individual="partly" note="Individuell: Trankeffekte werden am Braustand nicht gesperrt." />

Zwei Sperr-Kategorien, die lesen, **was ein Stack trägt**, statt was er ist. Ein Eintrag für Reparatur
deckt jedes Buch und jedes Ausrüstungsteil mit Reparatur ab, ohne eine einzige Item-ID aufzulisten.<Since v="6.1.0" />

```json
{
  "enchantments": [
    "minecraft:mending",
    { "id": "minecraft:sharpness", "min_level": 4 }
  ],
  "effects": [
    { "id": "minecraft:strength", "min_level": 2 }
  ]
}
```

Reparatur ist auf jeder Stufe gesperrt, Schärfe ab IV und Stärke ab Stufe II. Schärfe III und
einfache Stärke bleiben frei.

## Verzauberungen {/* #enchantments */}

Ein Verzauberungs-Eintrag sperrt:

- jedes verzauberte Buch, das die Verzauberung speichert,
- jedes Item, das sie trägt: Schwerter, Rüstung, Werkzeuge, alles,
- dass der **Zaubertisch** sie anbietet und der **Amboss** sie herstellt.

Am Zaubertisch fällt eine gesperrte Stufe aus dem Angebot; eine niedrigere freie Stufe derselben
Verzauberung kann trotzdem auftauchen, so wie Vanilla würfelt. Der Amboss schaut auf das Ergebnis statt
auf die Zutaten, weil er Stufen zusammenführt: Würde das Ergebnis eine gesperrte Verzauberung oder
Stufe tragen, bleibt der Ergebnis-Slot leer.

Verzauberungen aus Mods und Datapacks werden aufgelistet und erkannt wie Vanilla-Verzauberungen. Mods,
die ihre Boni außerhalb der Vanilla-Verzauberungsdaten speichern, etwa Affix-Systeme, sind für
Minecraft auch keine Verzauberungen und werden nicht erfasst.

## Trank-Effekte {/* #potion-effects */}

Ein Effekt-Eintrag sperrt jedes Trank-Item, das den Effekt trägt: Tränke, Wurf- und Verweiltränke,
getränkte Pfeile und jedes Mod-Item, das Trankinhalte auf die Vanilla-Art speichert. Der Braustand
weigert sich, ein Brauen zu starten, dessen Ergebnis ihn tragen würde; nichts wird verbraucht, und
kein Lohenstaub verbrennt.

Essen, Leuchtfeuer, Seltsame Suppe und Effekte, die eine Mod selbst vergibt, sind nicht betroffen. Ein
Effekt-Eintrag hindert einen Spieler nie daran, einen Effekt zu **haben**, nur daran, den Trank zu
bekommen.

:::warning[Der Braustand prüft nur globale Stages]
Ein Braustand braut, ohne dass jemand davorsteht, also kann ihn nur eine **globale** Stage stoppen.
Eine individuelle Effekt-Sperre sperrt den fertigen Trank für diesen Spieler trotzdem, er kann ihn
weder benutzen noch aufheben, aber der Braustand braut ihn. Dasselbe gilt für jede Maschine, die ohne
Spieler arbeitet.
:::

## Stufen {/* #levels */}

`min_level` ist die erste gesperrte Stufe. Ohne Angabe ist jede Stufe gesperrt.

| `min_level` | Schärfe I–III | Schärfe IV–V |
| :--- | :--- | :--- |
| weggelassen | gesperrt | gesperrt |
| `4` | frei | gesperrt |

Bei Effekten ist Stufe I der einfache Trank und Stufe II der „Stärke II“.

*Im Editor:* Rechtsklick auf die Zeile → **Gesperrt ab Stufe**. Der Dialog ist eine Liste, zuerst
„Jede Stufe“, dann „ab Stufe II“ bis zur Höchststufe der Verzauberung. Bei Effekten geht sie bis zur
höchsten Stufe, die irgendein Trank im Modpack vergibt.

## Aktionen {/* #actions */}

Beide Kategorien nehmen [`unlock_actions`](/wiki/locking/items-and-recipes/unlock-actions) wie Items,
mit den Aktionen, die für sie Sinn ergeben:

| Kategorie | Item-Aktionen | Stations-Aktionen |
| :--- | :--- | :--- |
| Verzauberungen | `use`, `attack`, `equip`, `pickup`, `trade`, `loot`, `recipe`, `icon` | `enchanting_table`, `anvil` |
| Effekte | `use`, `pickup`, `trade`, `loot`, `recipe`, `icon` | `brew` |

Lässt du jede Item-Aktion frei, bleibt vorhandene Ausrüstung benutzbar, und nur die Stationen hören
auf, neue herzustellen:

```json
"enchantments": [
  {
    "id": "minecraft:mending",
    "unlock_actions": ["use", "attack", "equip", "pickup", "trade", "loot", "recipe", "icon"]
  }
]
```

## Item-Arten verschonen {/* #sparing-item-types */}

**Gilt für** im Rechtsklick-Menü listet die Item-Arten auf, die ein Eintrag erreichen kann. Bei einer
Verzauberung sind das das Buch und jedes Item, auf das sie passt, wie die Verzauberung selbst es
angibt; bei einem Effekt jedes Item, das Tränke trägt. Nicht angehakte Arten werden verschont:

```json
"effects": [
  { "id": "minecraft:poison", "excluded_item_types": ["minecraft:tipped_arrow"] }
]
```

Gifttränke sind gesperrt, Giftpfeile nicht. Der Braustand folgt derselben Wahl, und eine verschonte
Art ist auch am Zaubertisch und am Amboss verschont.

## Im Editor {/* #in-the-editor */}

<Gallery items={[
  {src: "/img/editor/enchantments-tab.webp", alt: "Der Reiter Verzauberungen & Effekte", wide: true},
  {src: "/img/editor/effects-subtab.webp", alt: "Der Bereich Trankeffekte im selben Reiter", wide: true},
  {src: "/img/editor/effect-picker.webp", alt: "Die Effekt-Auswahl"},
]} />

Der Reiter **Verzauberungen & Effekte**, mit einem Abschnitt für Verzauberungen und einem für
Trank-Effekte. Jede Auswahl listet die echte Registry, also tauchen auch Einträge aus Mods auf.
Rechtsklick auf eine Zeile für **Gesperrt ab Stufe**, **Sperr-Aktionen** und **Gilt für**. Alle
Aktionen lassen sich auch
[für die ganze Stage fixieren](/wiki/locking/items-and-recipes/unlock-actions#fixing-actions-for-a-whole-stage).

## Wie es mit Mod-Sperren zusammenhängt {/* #how-it-relates-to-mod-locks */}

Eine [Mod-Sperre](/wiki/locking/items-and-recipes/items-tags-mods#mods) deckt auch verzauberte Bücher
und Tränke ab, deren Verzauberung oder Effekt aus dieser Mod kommt, und solange sie `recipe` sperrt,
lehnen die drei Stationen sie ab. Ausrüstung wird weiter nach ihrer eigenen ID beurteilt, also fängt
die Mod-Sperre ein Vanilla-Schwert mit einer Mod-Verzauberung nicht. Dafür fügst du einen
Verzauberungs-Eintrag hinzu.

## Der ältere Weg {/* #the-older-way */}

Vor 6.1.0 wurde eine Verzauberung über einen Item-Eintrag `minecraft:enchanted_book` mit einem
`StoredEnchantments`-Kriterium gesperrt. Solche Einträge laden weiter und tun genau das, was sie immer
getan haben: nur Bücher und Stationen. →
[Items, Tags & Mods](/wiki/locking/items-and-recipes/items-tags-mods#enchantments)

## Global oder individuell? {/* #global-or-individual */}

Beides. Der einzige Unterschied ist der Braustand, den nur globale Stages stoppen können.

## Siehe auch {/* #see-also */}

- [Unlock Actions](/wiki/locking/items-and-recipes/unlock-actions): einen Eintrag auf manche
  Interaktionen eingrenzen.
- [Items, Tags & Mods](/wiki/locking/items-and-recipes/items-tags-mods): das Item selbst sperren.
