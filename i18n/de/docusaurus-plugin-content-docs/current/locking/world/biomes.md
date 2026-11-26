---
title: Biome
description: "Ein Biom unbewohnbar machen, bis die Stage offen ist: Effekte, Schaden, eine Warnung und verweigerte Interaktionen."
sidebar_position: 2
---

# Biome {/* #biomes */}

<Scope global="yes" individual="yes" />

Eine Biom-Sperre hält einen Spieler nicht davon ab, hineinzulaufen. Sie macht den Ort
**unbewohnbar**: Effekte, Schaden, eine Warnung und verweigerte Interaktionen, bis die Stage offen ist.

## Einrichten {/* #in-the-editor */}

<Tabs groupId="setup">
<TabItem value="editor" label="Im Editor">

<Gallery items={[
  {src: "/img/editor/biomes-tab.webp", alt: "Der Biome-Reiter", wide: true},
  {src: "/img/editor/biome-picker.webp", alt: "Die Biom-Auswahl"},
]} />

Der Reiter **Biome** an einer Stage, mit einer durchsuchbaren Auswahl über jedes Biom und jedes
Biom-Tag, das das Modpack geladen hat.

Das Verhalten selbst steht nicht auf diesem Reiter. Es gilt für den ganzen Server und steht im Reiter
**Common** des [Config-Editors](/wiki/in-game-tools/in-game-editor#the-config-editor) unter
`biome_lock`.

</TabItem>
<TabItem value="file" label="In der Stage-Datei">

```json
{
  "biomes": {
    "biomes": [
      "minecraft:desert",
      "#minecraft:is_forest"
    ]
  }
}
```

Einträge sind Biom-IDs oder Biom-**Tags** mit `#` davor. Alles andere am Verhalten gilt für den ganzen
Server statt pro Eintrag.

Nach einer Änderung von Hand führst du `/history reload` aus.

</TabItem>
</Tabs>

## Was passiert, solange ein Spieler dort steht {/* #what-happens-while-a-player-stands-there */}

Alles davon wird einmal eingestellt, in
[`[biome_lock]`](/wiki/server/config-files/gameplay-toml#biome_lock), und gilt für jedes gesperrte
Biom im Modpack:

| Einstellung | Standard | |
| :--- | :--- | :--- |
| `effectsEnabled` / `effects` | an / Blindheit 30 s | Trank-Effekte, solange man drin ist. Geschrieben als `"effect_id, seconds, amplifier"`. |
| `clearEffectsOnLeave` | `false` | Sie in dem Moment entfernen, in dem der Spieler geht, statt sie auslaufen zu lassen. |
| `messageEnabled` / `messageFormat` / `showInChat` | an | Eine regelmäßige Warnung. `{stage}` und `{biome}` werden ersetzt. |
| `damageEnabled` / `damageAmount` / `damageInterval` | an / `1.0` / `20` | Regelmäßiger Schaden. |
| `blockRightClick` / `blockLeftClick` / `blockProjectiles` | alle an | Interaktionen, die drinnen verweigert werden. |
| `blockExplosions` | an | Explosionen zerstören drinnen keine Blöcke. |
| `checkInterval` | `10` | Ticks zwischen Positions-Prüfungen. Bereich 1–200. |

Beachte, dass **Schaden bei Biomen standardmäßig an ist** und bei
[Strukturen](/wiki/locking/world/dimensions-and-structures) standardmäßig aus: Aus einer Struktur wird
man herausgehalten, in einem Biom kann man nicht leben.

## Der Haken: Biome sind groß und unregelmäßig {/* #the-catch-biomes-are-large-and-irregular */}

Eine Struktur hat Wände. Ein Biom nicht: Sein Rand wandert, es verzahnt sich mit seinen Nachbarn, und in
1.21 ändert es sich mit der Höhe genauso wie mit der Position. Ein Spieler nahe einer Grenze kann sie
überqueren, ohne es zu wollen, und die Prüfung läuft alle `checkInterval` Ticks statt ständig.

In der Praxis heißt das: Eine Biom-Sperre liest sich als „diese ganze Gegend ist feindlich“, nicht als
genaue Grenze. Brauchst du eine genaue Grenze, etwa eine ummauerte Stadt, einen Krater oder eine Seite
eines Flusses, zeichne stattdessen eine [Zone](/wiki/locking/world/zones). Eine Zone hat exakte Ränder,
kann eine harte Barriere haben, die sich gar nicht überqueren lässt, und kann eigene Regeln haben statt
der für das ganze Modpack oben.

## Global oder individuell {/* #global-or-individual */}

Beides. Ein Spieler steht immer im Biom, wenn die Frage gestellt wird, also gibt es jemanden, an dem man
prüfen kann.

## Siehe auch {/* #see-also */}

- [Dimensionen & Strukturen](/wiki/locking/world/dimensions-and-structures): dieselben Werkzeuge rund
  um eine Struktur.
- [Zonen](/wiki/locking/world/zones): genaue Bereiche mit eigenen Regeln.
- [gameplay.toml](/wiki/server/config-files/gameplay-toml#biome_lock): der ganze Einstellungs-Block.
- [Komplette Beispiele](/wiki/stage-file/complete-examples#biome-and-interaction-locking)
