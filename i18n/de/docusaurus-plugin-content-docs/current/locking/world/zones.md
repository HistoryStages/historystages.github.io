---
title: Zonen
description: "Selbst gezeichnete Bereiche, jeder mit eigenen Regeln für Zutritt, Spawns und Bauen."
sidebar_position: 4
---

Eine Zone ist ein Bereich, den der Modpack-Autor selbst zeichnet, etwa ein Krater, eine ummauerte Stadt oder die andere Seite eines Flusses, statt etwas, wofür Minecraft schon einen Namen hat. Anders als bei Biom- und Struktur-Sperren, deren Verhalten einmal für den ganzen Server in der Config eingestellt wird, **hat jede Zone ihre eigenen Regeln**: Eine verweigert vielleicht nur Interaktionen, während die nächste brennt.

```json
{
  "zones": [
    {
      "name": "The Crater",
      "dimension": "minecraft:overworld",
      "shapes": [
        { "type": "cube", "from": [-120, 60, 340], "to": [-60, 90, 400], "full_height": true },
        { "type": "cylinder", "center": [-90, 63, 370], "radius": 24, "height": 32, "full_height": false },
        { "type": "sphere", "center": [-40, 70, 410], "radius": 16 }
      ],
      "rules": {
        "message": { "enabled": true, "text": "&cThe air here is still poison.", "in_chat": false },
        "damage": { "enabled": true, "amount": 1.0, "interval": 20 },
        "effects": {
          "enabled": true,
          "clear_on_leave": true,
          "list": [ { "id": "minecraft:blindness", "seconds": 30, "amplifier": 0 } ]
        },
        "block_right_click": true,
        "block_left_click": true,
        "block_projectiles": true,
        "block_explosions": true,
        "barrier": false,
        "block_spawns": false,
        "inverted": false,
        "show_border": false,
        "show_overlay": false
      }
    }
  ]
}
```

Zonen werden normalerweise im Spiel gezeichnet statt getippt. Schleichen + Linksklick mit dem Markierungs-Item setzt die erste Ecke, Schleichen + Rechtsklick die zweite (siehe [`[zone_lock]`](/wiki/server/config-files/gameplay-toml#zone_lock)); `/history zone mark`, `clear` und `info` tun dasselbe ohne Item. So setzt du auch eine Ecke, auf der du nicht stehen kannst.

**Die Dimension ist Pflicht und wird nie umgekehrt.** Koordinaten allein sind mehrdeutig, denn 100/64/100 gibt es in Oberwelt, Nether und End. Eine Zone für eine Netherfestung würde sonst auch mitten in einem Dorf der Oberwelt auslösen. Ein Bereich über zwei Welten sind absichtlich zwei Zonen: Der Editor zeigt dann, dass es zwei sind.

## Formen {/* #shapes */}

Eine Zone ist die Vereinigung ihrer Formen, und eine Form ist eine von drei Arten:

| `type` | Felder | Bedeutung |
| :--- | :--- | :--- |
| `cube` | `from`, `to`, `full_height` | Zwei gegenüberliegende Ecken, in beliebiger Reihenfolge. |
| `sphere` | `center`, `radius` | – |
| `cylinder` | `center`, `radius`, `height`, `full_height` | `center` ist die Mitte des **Bodens**; `height` ist die Ausdehnung nach oben. |

`full_height` lässt einen Quader oder Zylinder über die ganze Bauhöhe seiner Dimension reichen und ignoriert die Höhenangaben. In der Praxis ist das der Normalfall: Ein Dorf wird als Ganzes gesperrt, nicht als Scheibe davon.

Eine Zone ganz ohne Formen ist erlaubt. Sie wird als unvollständig angezeigt und gilt für niemanden.

## Regeln {/* #rules */}

| Schlüssel | Standard | Wirkung |
| :--- | :--- | :--- |
| `message.enabled` / `.text` / `.in_chat` | an / leer / aus | Eine Nachricht, solange der Spieler drin ist. `{zone}` und `{stage}` werden ersetzt; `&` setzt eine Farbe. `in_chat` schreibt sie zusätzlich zur Anzeige über der Hotbar in den Chat. |
| `damage.enabled` / `.amount` / `.interval` | aus / `1.0` / `20` | Regelmäßiger Schaden. Nie im Kreativmodus. |
| `effects.enabled` / `.clear_on_leave` / `.list` | aus / aus / leer | Trank-Effekte, als `{ "id", "seconds", "amplifier" }`. `clear_on_leave` entfernt sie sofort, statt sie auslaufen zu lassen. |
| `block_right_click` | `true` | Blöcke, Items und Kreaturen, auch das Platzieren gegen die Grenze von außen. |
| `block_left_click` | `true` | Angreifen und Abbauen, auch durch die Wand von außen hindurch. |
| `block_projectiles` | `true` | Pfeile, Schneebälle und Ähnliches verschwinden, wenn sie drinnen landen würden. |
| `block_explosions` | `true` | Blöcke in der Zone werden von Explosionen nicht zerstört. |
| `barrier` | `false` | Der Spieler kommt körperlich nicht hinein, weder mit Elytren noch mit Enderperle noch mit Pferd. Der Kreativmodus ist ausgenommen. |
| `block_spawns` | `false` | Unterdrückt natürliches Spawnen. Spawner, Spawn-Eier und Befehle bleiben unberührt. Nur globale Stages. |
| `inverted` | `false` | Dreht die Zone um: Die Regeln gelten überall **außer** hier, aber trotzdem nur in dieser Welt. |
| `show_border` | `false` | Zeichnet die Wand der Zone, sobald der Spieler nah genug ist. |
| `show_overlay` | `false` | Tönt den Bildschirm rot, solange der Spieler drin ist. |

Die beiden Sichtbarkeits-Schalter entscheiden, **ob** eine Zone zu sehen ist; `[zone_overlay]` in `visual.toml` entscheidet, wie weit die Wand reicht und wie stark die Tönung ist. Eine Zone, die geheim bleiben soll, lässt beide aus: Der Client erfährt nichts von einer Zone, die er nicht sehen darf.

## In zwei Zonen gleichzeitig stehen {/* #standing-in-two-zones-at-once */}

Überschneidungen sind normal, keine Ausnahme; Modpacks entstehen, indem man Kästen auf eine Karte wirft, bis der Bereich passt. Die Regeln werden zu einer Antwort zusammengeführt, und das mit Absicht so:

- **Schalter sind ein ODER.** Eine Zone, die Interaktionen blockieren will, reicht. Eine Zone, die das nicht verlangt, kann es für eine andere nicht zurücknehmen.
- **Schaden nimmt den höchsten Wert, nie die Summe**: Zwei Zonen beim Bauen aus Versehen überlappen zu lassen, darf nicht still tödlich werden. Das Intervall gehört zum Wert, der gewonnen hat.
- **Eine Nachricht gewinnt**, die der zuerst gefundenen Zone. Drei Nachrichten, die sich um die Actionbar streiten, sehen aus wie ein Fehler.
- **Effekte werden nach Effekt-ID zusammengeführt**: Die stärkere Stufe gewinnt, bei gleicher Stärke die längere Dauer.
