---
title: NBT & Data Components
description: "Nur die Stacks sperren, die zu einem Kriterium passen: ein verzaubertes Buch mit Schärfe, ein Trank mit einem bestimmten Effekt, ein Mod-Item in einem bestimmten Zustand."
sidebar_position: 2
---

# NBT & Data Components {/* #nbt--data-components */}

<Scope global="yes" individual="yes" />

Ein einfacher `items`-Eintrag sperrt jeden Stack dieses Items. Ein Eintrag mit Kriterium sperrt nur die
Stacks, die dazu passen: die verzauberten Bücher mit Schärfe, die Tränke mit einem bestimmten Effekt,
das Mod-Item in einem bestimmten Zustand.

```json
{
  "items": [
    {
      "id": "minecraft:enchanted_book",
      "nbt": {
        "StoredEnchantments": [
          { "id": "minecraft:sharpness", "lvl": "1-4" }
        ]
      }
    }
  ]
}
```

Hier sind nur Bücher mit Schärfe I–IV gesperrt. Jedes andere verzauberte Buch verhält sich normal.

## Mehrere Varianten: eine reicht {/* #several-variants-any-one-is-enough */}

Seit 6.2.0 kann `nbt` auch eine **Liste** von Kriterien sein. Der Eintrag greift dann, wenn irgendeins
davon passt. So deckt ein Eintrag „Schärfe oder Bann“ ab, oder, wofür es gebaut wurde, eine Mod wie
Tinkers' Construct, bei der eine Item-ID für jedes Material steht und nur die Daten des Items sie
unterscheiden:

```json
{
  "items": [
    {
      "id": "minecraft:enchanted_book",
      "nbt": [
        { "StoredEnchantments": [{ "id": "minecraft:sharpness" }] },
        { "StoredEnchantments": [{ "id": "minecraft:smite" }] }
      ]
    }
  ]
}
```

Ohne Varianten brauchte das einen Eintrag oder sogar eine Stage pro Material. Ein einzelnes Object wie
im ersten Beispiel ist weiterhin die normale Form und bleibt genau, wie es war.

An einem [Forschungspodest](/wiki/in-game-tools/research/pedestal#handing-in-dependencies) zählt eine
Item-Anforderung mit Varianten die Stacks aller Varianten zur selben Summe.

## Im Editor {/* #in-the-editor */}

![Der NBT-Editor mit einem Verzauberungs-Kriterium](/img/editor/nbt-editor.webp)

**Rechtsklick auf den Eintrag** in der Liste Items, Tags oder Ausnahmen und dann **NBT bearbeiten**.
Kriterien werden als Karten gebaut, mit Vorlagen für die Felder, die Items oft tragen, einem
freien Dialog für alles andere und Live-Prüfung. **+ ODER-Variante** fügt eine weitere Variante hinzu;
jede erscheint als Chip über den Karten.

Am schnellsten geht es, gar keins zu bauen: Halte das Item und **Strg-klicke** einen Inventar-Slot, um
den Zustand genau dieses Stacks zu übernehmen. Ansonsten zeigen `/history debug nbt preset`,
`/history debug nbt custom` und `/history debug nbt components`, was das gehaltene Item trägt, fertig
zum Kopieren.

## Altes NBT und Data Components {/* #legacy-nbt-and-data-components */}

Minecraft 1.21 hat den meisten Zustand von Items aus freiem NBT in **Data Components** verlegt.
History Stages liest beides, und beides steht im selben `nbt`-Object: Components kommen unter einen
Schlüssel `components` neben den älteren Feldern:

```json
{
  "items": [
    {
      "id": "minecraft:leather_chestplate",
      "nbt": {
        "components": {
          "minecraft:dyed_color": { "rgb": 16711680 }
        }
      }
    }
  ]
}
```

So zielt eine Stage auf alles, was seinen Zustand auf die moderne Art speichert: gefärbte
Lederrüstung, Essen, Jukebox-Abspielbares, eigene Components anderer Mods. →
[Data component format](https://minecraft.wiki/w/Data_component_format)

Welches von beiden ein Item nutzt, musst du nicht raten: `/history debug nbt preset`,
`/history debug nbt custom` und `/history debug nbt components` zeigen, was das Item in deiner Hand
tatsächlich trägt, fertig zum Einfügen. → [Befehle](/wiki/server/commands#debug-subcommands-client-side)

## Kriterien an Tag-Einträgen {/* #criteria-on-tag-entries */}

`tags`-Einträge nehmen dieselben `nbt`- und `components`-Kriterien. Ist ein Kriterium da, sind nur die
Tag-Mitglieder gesperrt, die auch dazu passen; der Rest des Tags bleibt offen:

```json
{
  "tags": [
    "minecraft:swords",
    {
      "id": "minecraft:swords",
      "nbt": {
        "components": {
          "minecraft:enchantments": { "minecraft:sharpness": 5 }
        }
      }
    }
  ]
}
```

:::warning[Ein Kriterium braucht ein echtes Item zum Anschauen]
Tag-Einträge mit NBT-Kriterium werden **überall übersprungen, wo es keinen Item-Stack gibt**, zum
Beispiel bei einer Loot-Table-Prüfung ohne Kontext. Es gibt nichts zum Vergleichen, also kann der
Eintrag nicht antworten. Einfache Tag-Einträge als String sind davon nicht betroffen und gelten
weiterhin überall.
:::

## Verzauberungen und Trank-Effekte {/* #enchantments-and-potion-effects */}

Seit 6.1.0 haben beide ein eigenes Feld, das liest, was ein Stack trägt, ganz ohne NBT-Kriterien. →
[Verzauberungen & Effekte](/wiki/locking/items-and-recipes/enchantments-and-effects)

Die ältere Form, ein `minecraft:enchanted_book`-Eintrag mit einem `StoredEnchantments`-Kriterium, lädt
und funktioniert weiterhin. →
[Items, Tags & Mods](/wiki/locking/items-and-recipes/items-tags-mods#enchantments)

## Kriterien bauen, ohne JSON zu schreiben {/* #building-criteria-without-writing-json */}

Der [Editor im Spiel](/wiki/in-game-tools/in-game-editor) hat einen visuellen NBT-Editor: Kriterien
werden als Karten gebaut, mit Vorlagen für die Felder, die Items oft tragen (Verzauberungen, Custom
Model Data, Schaden), und einem freien Dialog für alles andere. Er schreibt genau das JSON von dieser
Seite, also lassen sich beide Wege mischen.

## Wo Kriterien angenommen werden {/* #where-criteria-are-accepted */}

| Feld | Kriterien? |
| :--- | :--- |
| `items` | ja, mit Varianten |
| `tags` | ja, mit Varianten und dem Vorbehalt oben |
| `mod_exceptions` | ja, mit Varianten |
| `dependencies` → `items` | ja, mit Varianten: Ein Eintrag kann am Podest ein *bestimmtes* verzaubertes Buch verlangen |
| `trades` → `offers` | ja, ein Kriterium |
| `entities` → `interactionlock` → `lock_items` | ja, mit Varianten (von Hand geschrieben; der Editor behält sie) |
| `entities` → `attacklock` / `interactionlock` | ja, mit Varianten, aber an den Daten der Kreatur, nicht eines Items. → [Kreaturen & Spawns](/wiki/locking/creatures-and-trade/entities-and-spawns#only-some-creatures-of-a-type) |
| `fluids` | **nein**, siehe unten |
| `mods` | von Natur aus nein: Eine Mod-ID ist kein Item |

## Warum Flüssigkeiten keine Kriterien haben {/* #why-fluids-have-no-criteria */}

Von den vier Stellen, an denen die Mod nach einer Flüssigkeit gefragt wird, könnte nur das
Behälter-Item überhaupt etwas zum Vergleichen liefern. Ein Flüssigkeits-Block in der Welt und ein
Eintrag im Rezept-Browser tragen nichts, also hätte ein Kriterium auf genau den zwei Flächen nichts
bewirkt, die ein Modpack-Autor zuerst prüft. Das Fehlen ist Absicht, kein Versäumnis. →
[Flüssigkeiten](/wiki/locking/items-and-recipes/fluids)

## Siehe auch {/* #see-also */}

- [Items, Tags & Mods](/wiki/locking/items-and-recipes/items-tags-mods): die Felder, an denen diese
  Kriterien hängen.
- [Unlock Actions](/wiki/locking/items-and-recipes/unlock-actions): der andere Weg, einen Eintrag
  einzugrenzen, über die Interaktion statt über den Zustand des Items.
- [Komplette Beispiele](/wiki/stage-file/complete-examples#nbt-specific-locking)
