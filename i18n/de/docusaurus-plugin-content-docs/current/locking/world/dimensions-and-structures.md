---
title: Dimensionen & Strukturen
description: "Den Zutritt zu einer Dimension verweigern, eine Struktur abriegeln und begrenzen, wie oft eine Struktur generieren darf."
sidebar_position: 1
---

# Dimensionen & Strukturen {/* #dimensions--structures */}

<Scope global="yes" individual="partly" note="Individuell: alles außer den Generierungs-Grenzen für Strukturen." />

Zwei Wege, einen Ort unerreichbar zu machen: den Zutritt zu einer ganzen Dimension verweigern oder eine
einzelne Struktur in der Welt abriegeln. Eine dritte Möglichkeit begrenzt, wie oft eine Struktur
überhaupt generieren darf.

## Im Editor {/* #in-the-editor */}

<Gallery items={[
  {src: "/img/editor/dimensions-tab.webp", alt: "Der Dimensionen-Reiter", wide: true},
  {src: "/img/editor/dimension-picker.webp", alt: "Die Dimensions-Auswahl"},
  {src: "/img/editor/structures-tab.webp", alt: "Der Strukturen-Reiter", wide: true},
  {src: "/img/editor/structure-picker.webp", alt: "Die Struktur-Auswahl, Struktur-Tags auf einem eigenen Reiter"},
]} />

Zwei Reiter: **Dimensionen** und **Strukturen**, jeder mit einer durchsuchbaren Auswahl. Die
Struktur-Auswahl nimmt Struktur-Tags genauso wie IDs.

**Rechtsklick auf eine Struktur** in der Liste und **Generierung**: Dort stellst du
[Generierungs-Grenzen](#generation-limits) ein. `block_generation` ist kein eigener Reiter, deshalb
übersieht man es leicht. In einer individuellen Stage fehlt der Menüpunkt ganz, weil die Grenze nur
global funktioniert.

Irgendwo zu stehen und nicht zu wissen, wie es heißt, ist das übliche Problem.
`/history debug structure` zeigt die Struktur-IDs und -Tags an deiner Position, und
`/history debug viz` zeichnet die Sperrzone, die die aktuellen Einstellungen ergeben würden.

## Dimensionen {/* #dimensions */}

Eine flache Liste von Dimensions-IDs. Ein Spieler, der eine davon betreten will, solange die Stage
gesperrt ist, wird zurückgeschickt.

```json
{
  "dimensions": [
    "minecraft:the_nether",
    "minecraft:the_end"
  ]
}
```

Die Rückmeldung, also Actionbar-Nachricht, optionale Kopie im Chat und ob die nötige Stage genannt wird,
stellst du unter [`[dimension_lock]`](/wiki/server/config-files/visual-toml#dimension_lock-and-mob_lock)
ein, den Wortlaut selbst unter `dimensionUnknown` in
[`[lock_messages]`](/wiki/server/config-files/visual-toml#lock_messages).

Funktioniert in globalen und individuellen Stages. Das ist die sauberste Sperre der Mod: Es gibt eine
Tür, und die ist für dich entweder offen oder nicht.

## Strukturen {/* #structures */}

Das Object `structures` enthält eine Liste `structures` mit Struktur-IDs oder Struktur-**Tags** mit
`#` davor:

```json
{
  "structures": {
    "structures": [
      "minecraft:stronghold",
      "#minecraft:village"
    ]
  }
}
```

Die Mod baut um jede Struktur eine enge Sperrzone, die ihre Teile kennt: keinen Quader um das Ganze,
sondern eine Form, die aus den Teilen zusammengesetzt ist, aus denen die Struktur tatsächlich besteht.
In dieser Zone kann sie Rechtsklicks, Linksklicks und Projektil-Treffer abbrechen, eine Nachricht zeigen
und optional regelmäßig Schaden zufügen.

<details>
<summary>Ein flaches Array geht weiterhin</summary>

`"structures": ["minecraft:stronghold"]`, die Schreibweise vor 6.0, wird weiter gelesen und beim
nächsten Speichern der Stage in die Object-Form umgeschrieben.

</details>

### Die Sperrzone einstellen {/* #tuning-the-lock-zone */}

Zwei fortgeschrittene Einstellungen in
[`[structure_lock]`](/wiki/server/config-files/gameplay-toml#structure_lock) bestimmen die Form der
Zone:

| Einstellung | Standard | Was sie tut |
| :--- | :--- | :--- |
| `lockPadding` | `0` | Zusätzliche Blöcke um jedes Strukturteil, zusätzlich zu einem festen Puffer von 2 Blöcken. Bereich 0–16. |
| `clusterDistance` | `6` | Wie weit zwei Teile auseinander sein dürfen und trotzdem eine Zone bilden. Höher heißt größere, stärker gefüllte Zonen. Bereich 0–32. |

Die beiden kann man sich aus Zahlen schwer vorstellen, deshalb gibt es Befehle, die das Ergebnis
zeichnen:

```text
/history debug structure
/history debug viz
/history debug shapes
```

Der erste nennt die Strukturen und Tags an deiner Position; so bekommst du eine ID zuverlässig richtig.
Der zweite zeichnet die Zone, die die aktuellen Einstellungen ergeben haben. Der dritte zeigt die
einzelnen Teile, aus denen sie zusammengesetzt wurde. →
[Befehle](/wiki/server/commands#debug-subcommands-client-side)

### Worauf ein Spieler stößt {/* #what-a-player-runs-into */}

![Das rote Kraftfeld um einen gesperrten Plünderer-Außenposten](/img/ingame/structure-force-field.webp)

| Einstellung | Standard | |
| :--- | :--- | :--- |
| `messageEnabled` / `messageFormat` / `showInChat` | an | Eine Nachricht beim Betreten. `{stage}` und `{structure}` werden ersetzt. |
| `damageEnabled` / `damageAmount` / `damageInterval` | aus / `1.0` / `20` | Regelmäßiger Schaden, solange man drin ist. |
| `blockRightClick` / `blockLeftClick` / `blockProjectiles` | alle an | Interaktionen, die in der Zone abgebrochen werden. |
| `blockExplosions` | an | Explosionen zerstören drinnen keine Blöcke. |
| `checkInterval` | `10` | Ticks zwischen Positions-Prüfungen. |

Die sichtbare Seite, die Kraftfeld-Wand beim Näherkommen und die rote Bildschirm-Tönung drinnen, steht in
[`[structure_overlay]`](/wiki/server/config-files/visual-toml#structure_overlay).

Anders als bei [Zonen](/wiki/locking/world/zones) gelten diese Einstellungen **für den ganzen Server**:
Jede gesperrte Struktur im Modpack verhält sich gleich. Soll ein Ort nur warnen und ein anderer
brennen, zeichne sie stattdessen als Zonen.

## Generierungs-Grenzen {/* #generation-limits */}

Statt den Zutritt zu verwehren, kann ein Eintrag begrenzen, wie oft eine Struktur überhaupt generieren
darf. Das steht in einer eigenen Liste `block_generation` im selben Object:

```json
{
  "structures": {
    "block_generation": [
      "minecraft:stronghold",
      {
        "id": "#minecraft:village",
        "phase": "while_locked",
        "max": 3,
        "reset_on_relock": false
      }
    ]
  }
}
```

| Feld | Typ | Standard | Bedeutung |
| :--- | :--- | :--- | :--- |
| `id` | String | – | Struktur-ID oder ein Tag mit `#`. |
| `phase` | String | `"while_locked"` | `"while_locked"`: Die Grenze zählt, solange die Stage gesperrt ist, danach ist die Generierung frei. `"after_unlock"`: Solange gesperrt, generiert nichts, und die Grenze fängt an zu zählen, sobald die Stage offen ist. |
| `max` | Integer | `0` | Wie oft sie generieren darf. Ein Tag zählt alle seine Mitglieder zusammen. `0` verhindert sie ganz, wie ein einfacher String-Eintrag. |
| `reset_on_relock` | Boolean | `false` | Ob der Zähler zurückgesetzt wird, wenn die Stage wieder gesperrt wird. |

:::warning[Nur globale Stages]
Die Weltgenerierung ist eine dauerhafte Entscheidung für die ganze Welt; es gibt keinen Chunk pro
Spieler, den man sperren könnte. In einer individuellen Stage tut `block_generation` nichts.
:::

Gezählt wird für die ganze Welt statt pro Dimension, ab dem Moment, in dem die Regel wirkt. **Chunks,
die generiert wurden, bevor die Regel dazukam, sind nicht betroffen**: Eine Grenze, die einer schon
erkundeten Welt hinzugefügt wird, regelt nur, was ab dann passiert.

Schatzkarten zeigen auch nicht mehr auf Strukturen, deren Grenze erreicht ist, damit Spieler nicht zu
einem Ort geschickt werden, den es nie geben wird.

## Global oder individuell {/* #global-or-individual */}

Zutritts-Sperren für Dimensionen und Strukturen funktionieren in beiden. `block_generation` geht aus dem
Grund oben nur global. →
[Global vs. individuell](/wiki/start-here/global-vs-individual#what-can-each-one-lock)

## Siehe auch {/* #see-also */}

- [Biome](/wiki/locking/world/biomes): dieselben Werkzeuge für ein Biom statt einer Struktur.
- [Zonen](/wiki/locking/world/zones): selbst gezeichnete Bereiche, jeder mit eigenen Regeln statt den
  serverweiten.
- [Komplette Beispiele](/wiki/stage-file/complete-examples#capping-how-often-a-structure-generates)
