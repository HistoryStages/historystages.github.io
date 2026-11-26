---
title: Loot
description: "Gesperrte Items pro Spieler aus Truhen-Loot und Mob-Drops heraushalten und durch etwas anderes ersetzen."
sidebar_position: 8
---

# Loot {/* #loot */}

<Scope global="yes" individual="yes" />

Loot hat kein eigenes Feld. Ein gesperrtes Item wird über die **Aktion `loot`** aus Truhen-Loot und
Mob-Drops herausgehalten, und die ist, wie jede andere Aktion, an, solange ein Eintrag sie nicht
weglässt:

```json
{
  "items": [
    "minecraft:diamond",
    { "id": "minecraft:emerald", "unlock_actions": ["loot"] }
  ]
}
```

Diamanten tauchen nicht im Loot auf, solange die Stage gesperrt ist. Smaragde schon, weil `loot` als
Aktion aufgeführt ist, die frei bleibt.

Was mit dem gefilterten Slot passiert, ob er leer bleibt oder etwas anderes an seine Stelle kommt,
entscheidet der ganze Server in [gameplay.toml](/wiki/server/config-files/gameplay-toml#loot_replacements).

## Im Editor {/* #in-the-editor */}

Es gibt keinen Loot-Reiter, weil Loot keine eigene Kategorie ist. **Rechtsklick** auf einen normalen
Item-, Tag- oder Mod-Eintrag und **Sperr-Aktionen**; `loot` ist eins der Kästchen in diesem Popup,
neben `use`, `pickup` und dem Rest.

Das Ersetzen gilt für den ganzen Server und steht im Reiter **Common** des
[Config-Editors](/wiki/in-game-tools/in-game-editor#the-config-editor) unter `loot_replacements`.

## Truhen-Loot läuft über Lootr {/* #chest-loot-goes-through-lootr */}

Deshalb ist [Lootr Pflicht](/wiki/start-here/installation#what-you-need-alongside-it). Ein
Vanilla-Behälter ist geteilt: ein Wurf, ein Inventar, und wer ihn zuerst öffnet, nimmt, was drin ist.
Das lässt sich nicht pro Spieler filtern. Lootr gibt jedem Spieler seine eigene Sicht auf einen
Behälter, und der Filter läuft **in dem Moment, in dem diese Sicht ausgewürfelt wird**. So bekommt
jeder Spieler eine Kopie, die zu seinen eigenen Stages passt.

Weil der Filter beim Würfeln sitzt und nicht beim Öffnen, deckt er jeden Lootr-Behälter auf einmal ab,
auch die, die nie ein Menü öffnen: den verzierten Krug und den seltsamen Sand oder Kies, den ein
Spieler abpinselt.

:::note[Loot, der vor der Sperre gewürfelt wurde, verschwindet nicht]
Ein Behälter, der für einen Spieler schon gewürfelt wurde, behält seinen Inhalt, auch wenn danach eine
Stage gesperrt wird. Das ist Absicht. In einem Lootr-Inventar lassen sich Loot und das, was ein Spieler
selbst hineingelegt hat, nicht unterscheiden, also würde ein Hook, der beim Öffnen gesperrte Items
ausräumt, auch seine eigenen Sachen wegwerfen.
:::

## Mob-Drops funktionieren anders als Truhen-Loot {/* #mob-drops-are-not-symmetrical-with-chest-loot */}

Ein Mob droppt **einen gemeinsamen Satz Items in die Welt**; es gibt keine Kopie pro Spieler, die man
filtern könnte. Drops werden deshalb am **Spieler, der getötet hat**, gemessen:

- Von einem Spieler getötet → die Stages dieses Spielers entscheiden.
- Durch etwas anderes getötet (Sturz, anderer Mob, Kaktus) → nur globale Stages gelten, weil es niemanden
  gibt, den man fragen könnte.

:::warning[Bekannter Kollateralschaden]
Landet ein Spieler ohne die Stage den Kill, ist das Item für alle weg, die dabeistehen, auch für
Teammitglieder, die es freigeschaltet *haben*. Ohne eine Kopie eines Welt-Items pro Spieler gibt es
keinen Weg drumherum, also wurde das hingenommen statt gelöst. Schalte `lockLoot` unter
`[individual_stages]` ab, wenn ein Modpack das lieber nicht hätte.
:::

## Ersetzen statt entfernen {/* #replacing-instead-of-removing */}

Standardmäßig wird ein gesperrter Eintrag einfach aus dem Loot entfernt. Ein Modpack kann stattdessen
etwas anderes dorthin legen:

| Einstellung | Standard | Was sie tut |
| :--- | :--- | :--- |
| `useReplacements` | `false` | Schaltet das Ersetzen ein. Ohne sie wird gesperrter Loot entfernt. |
| `replacementItems` | `[]` | Item-IDs, aus denen zufällig ein Ersatz gewählt wird. Wird zuerst geprüft. |
| `replacementTags` | `[]` | Item-Tags, aus denen gewählt wird, wenn `replacementItems` leer oder erschöpft ist. |

→ [gameplay.toml](/wiki/server/config-files/gameplay-toml#loot_replacements)

Truhen-Loot und Mob-Drops beachten beide `replacementTags`. Das war nicht immer so: Mob-Drops lasen
früher nur `replacementItems`.

## Die Schalter {/* #the-switches */}

| Einstellung | Block | Standard | Was sie regelt |
| :--- | :--- | :--- | :--- |
| `lockMobLoot` | `[gameplay]` | `true` | Global gesperrte Items aus Mob-Drops entfernen. |
| `lockLoot` | `[individual_stages]` | `true` | Individuelle Stages auf Lootr-Behälter und Mob-Drops anwenden. |
| `dropOnRevoke` | `[individual_stages]` | `true` | Gesperrte Items aus dem Inventar eines Spielers werfen, wenn ihm seine individuelle Stage entzogen wird. |

`dropOnRevoke` ist die andere Hälfte der Geschichte: Es regelt, was mit Items passiert, die ein Spieler
schon hat, wenn ihm eine Stage weggenommen wird, und nicht, was beim Erzeugen von Loot passiert.
Dieselbe Prüfung läuft beim Einloggen; so werden Items erfasst, die gesperrt wurden, während ein
Spieler offline war.

## Global oder individuell {/* #global-or-individual */}

Beides. Truhen-Loot funktioniert dank Lootr pro Spieler; Mob-Drops funktionieren pro Spieler nur so
weit, wie sich der Töter bestimmen lässt.

## Siehe auch {/* #see-also */}

- [Unlock Actions](/wiki/locking/items-and-recipes/unlock-actions): die Aktion `loot` zwischen den
  anderen.
- [Items, Tags & Mods](/wiki/locking/items-and-recipes/items-tags-mods): was ein gesperrter Eintrag
  standardmäßig abdeckt.
- [Mod-Kompatibilität](/wiki/server/mod-compatibility): Lootr und die anderen Anbindungen.
