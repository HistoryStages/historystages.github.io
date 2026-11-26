---
title: Unlock Actions
description: "Eine Sperre auf einzelne Interaktionen eingrenzen, damit ein gesperrtes Item weiter getragen, hergestellt oder gehandelt werden kann, während der Rest gesperrt bleibt."
sidebar_position: 3
---

# Unlock Actions {/* #unlock-actions */}

<Scope global="yes" individual="yes" />

Standardmäßig blockiert jeder Eintrag in `items`, `tags` und `mods` **alle** Interaktionen mit dem
passenden Inhalt. `unlock_actions` grenzt das ein: Es listet die Interaktionen auf, die verfügbar
bleiben, solange die Stage noch gesperrt ist.

:::danger[Die Liste sagt, was frei bleibt]
`unlock_actions` ist keine Liste dessen, was gesperrt ist, sondern dessen, was **nicht** gesperrt ist.
Jede Aktion, die du weglässt, bleibt blockiert. Ein einfacher String-Eintrag oder ein Object ohne
`unlock_actions` sperrt alles.
:::

## Einrichten {/* #in-the-editor */}

<Tabs groupId="setup">
<TabItem value="editor" label="Im Editor">

![Der Dialog „Blockierte Aktionen“ für einen Eintrag](/img/editor/lock-actions.webp)

Kein eigener Reiter, es hängt an einem Eintrag, der schon in der Liste steht. **Rechtsklick auf den
Eintrag** und **Sperr-Aktionen** im Kontextmenü; das Popup, das sich öffnet, hat ein Kästchen pro
Aktion, beschriftet wie in der Tabelle unten.

Interaktions-Einträge von Kreaturen haben ihre eigene Version desselben Popups unter
**Interaktions-Aktionen**, und Flüssigkeits-Zeilen nutzen das kürzere Flüssigkeits-Vokabular. Zeilen
für [Verzauberungen und Effekte](/wiki/locking/items-and-recipes/enchantments-and-effects#actions)
haben ebenfalls eigene Listen.

</TabItem>
<TabItem value="file" label="In der Stage-Datei">

```json
{
  "items": [
    "minecraft:diamond_pickaxe",
    {
      "id": "minecraft:diamond_sword",
      "unlock_actions": ["pickup", "equip"]
    }
  ],
  "tags": [
    {
      "id": "c:ingots/iron",
      "unlock_actions": ["pickup"]
    }
  ]
}
```

Die Diamantspitzhacke bleibt komplett gesperrt. Das Diamantschwert lässt sich aufheben und anlegen,
aber nicht schwingen, nicht zum Herstellen benutzen und nicht handeln. Eisenbarren aus dem Tag lassen
sich aufheben und sonst nichts.

Nach einer Änderung von Hand führst du `/history reload` aus.

</TabItem>
</Tabs>

## Die Aktionen {/* #the-actions */}

| Aktion | Im Editor | Was sie abdeckt |
| :--- | :--- | :--- |
| `use` | Benutzen | Rechtsklick-Benutzung: Essen, ein Bogen, ein Werkzeug aktivieren. |
| `attack` | Angreifen | Damit Kreaturen angreifen. |
| `equip` | Anlegen | Es in einem Rüstungs- oder Nebenhand-Slot tragen. |
| `pickup` | Aufheben | Es nehmen: vom Boden, aus einem Behälter. |
| `place` | Platzieren | Es als Block platzieren oder auf einem Block benutzen. |
| `break` | Abbauen | Damit Blöcke abbauen. |
| `gui` | GUI | Die GUI des Blocks öffnen. |
| `loot` | Loot | In Behälter-Loot und Mob-Drops auftauchen. |
| `recipe` | Rezept | Seine Rezepte im Rezept-Browser (JEI / EMI). |
| `trade` | Handeln | Es bei einem Händler kaufen oder verkaufen. |
| `icon` | Symbol | Das Schloss-Overlay, das auf den Slot gezeichnet wird. |

[Flüssigkeiten](/wiki/locking/items-and-recipes/fluids) nutzen ein eigenes, kürzeres Vokabular:
sieben Aktionen, darunter eine (`ingredient`), die Items nicht haben.

## `place` und `use` sind nicht dasselbe {/* #place-and-use-are-not-the-same-thing */}

Über dieses Paar stolpern viele. `place` sperrt, das Item als Block hinzustellen. `use` sperrt die
Rechtsklick-Benutzung, also eine GUI öffnen, einen Trank trinken, ein Werkzeug aktivieren, und deckt
das Platzieren von Blöcken **nicht** ab.

`use` allein zu sperren hält einen platzierbaren Block nicht davon ab, platziert zu werden. Soll der
Block nicht in die Welt, muss `place` gesperrt sein.

## Gesperrte Munition wird übersprungen {/* #locked-ammo-is-skipped */}

Ein Bogen, eine Armbrust oder jede Waffe, die auf dieselbe Art nach Munition sucht, übergeht einen
Pfeil, dessen `use` gesperrt ist, und nimmt den nächsten, den sie benutzen darf. Ist keiner mehr übrig,
hat sie keine Munition. Das gilt für jede Item-Sperre, ob einfach oder eingegrenzt; vor 6.1.0 ließ sich
ein gesperrter Pfeil noch verschießen.

## Aktionen für eine ganze Stage fixieren {/* #fixing-actions-for-a-whole-stage */}

![Der Bereich Sperren in den Stage-Einstellungen: austauschbar und fixierte Aktionen](/img/editor/stage-locks-section.webp)

Dasselbe Kästchen bei vierzig Einträgen anzuhaken ist mühsam, und den einundvierzigsten vergisst man.
Eine Stage kann eine Aktion stattdessen für alle ihre Einträge einer Art **fixieren**.<Since v="6.1.0" />

**Stage-Einstellungen → Sperren** hat eine Zeile pro Art: **Item-Aktionen** (Items, Tags und Mods),
**Fluid-Aktionen**, **Verzauberungs-Aktionen**, **Effekt-Aktionen**, **Interaktions-Aktionen** und, bei
globalen Stages, **SpawnControl**. Jede öffnet das bekannte Popup im Fixier-Modus:

- Linksklick setzt einen Wert wie gewohnt.
- **Rechtsklick fixiert ihn**, gesperrt oder erlaubt, und markiert ihn mit einem Schloss.
- Nur fixierte Werte zählen. Was du in diesem Popup nicht fixierst, bedeutet nichts.

Eine fixierte Aktion gewinnt gegen das, was der Eintrag sagt. Am Eintrag zeigt sie den Wert der Stage,
mit Schloss und gesperrt für Eingaben; alles, was nicht fixiert ist, bleibt pro Eintrag änderbar. Die
Einträge behalten darunter ihre eigenen Werte, also bringt das Lösen einer Fixierung (noch einmal
Rechtsklick) sie zurück.

```json
"fixed_lock_actions": {
  "items": { "trade": false, "loot": true },
  "fluids": { "pickup": true }
}
```

`true` ist gesperrt, `false` erlaubt. Die Schlüssel sind `items`, `fluids`, `interactions`,
`enchantments` und `effects`.

SpawnControl funktioniert genauso, pro Zeile statt pro Aktion, und wird als `fixed_spawn_rule`
gespeichert. Individuelle Stages haben keine Spawn-Sperre, dort gibt es das also nicht. →
[Kreaturen & Spawns](/wiki/locking/creatures-and-trade/entities-and-spawns#spawnlock)

## `trade` hat die Bedeutung bestehender Dateien verändert {/* #trade-changed-the-meaning-of-existing-files */}

:::warning[Neu in 6.0, und es wirkt rückwärts]
`trade` sperrt das Kaufen oder Verkaufen des Items bei jedem Händler, wo immer das Item auftaucht. Weil
`unlock_actions` die Aktionen speichert, die *frei* bleiben, zählt eine Aktion, die vorher niemand
aufführen konnte, in jeder älteren Datei als gesperrt: Ein Eintrag, den jemand auf `["use"]`
eingegrenzt hat, sperrt ab dieser Version auch den Handel.

Das ist so gewollt, denn ein eingegrenzter Eintrag heißt „nur das“, aber man sollte es wissen, bevor
ein Modpack aktualisiert. Eine Umwandlung dafür gibt es absichtlich nicht.
:::

Zwei kleinere Folgen kommen mit:

- Der **Ergebnis-Slot eines Handelsfensters** wird jetzt nach `trade` beurteilt statt nach `pickup`.
  Ein Eintrag, der Aufheben erlaubt hat, um Handeln zu erlauben, muss stattdessen `trade` angeben.
- Die zusätzliche Aktion kostet Platz im Netzwerk-Paket der Stage. Eine Stage, die nur aus
  eingegrenzten Item-Einträgen besteht, fasst jetzt etwa 544 statt 581 davon. →
  [Stufen-Graph und Sync-Grenzen](/wiki/about/getting-help#a-stage-is-too-large-to-send)

## Zwei Stellen ignorieren die Liste absichtlich {/* #two-surfaces-deliberately-ignore-the-list */}

Ein Item, dessen Eintrag die Sperre etwa nur auf `recipe` eingrenzt, wird im Inventar trotzdem als
`???` angezeigt, wenn die Stage die [verdeckte Anzeige](/wiki/stage-file/hidden-display) an hat, und
hat trotzdem den Tooltip „benötigt Stage X“.

Beides beschreibt, *dass das Item zu einer Stage gehört*, und das bleibt wahr, egal wie eng die Sperre
ist. Alles, was tatsächlich eine Aktion verweigert, also Behälter, Rüstungs-Slots, Rahmen, Ambosse und
der Rezept-Browser, liest die Liste.

## Die alte Schreibweise {/* #the-legacy-spelling */}

`lock_actions`, das die gesperrten Aktionen direkt aufgelistet hat statt der freien, wird weiterhin
gelesen, damit alte Dateien funktionieren. Neue Einträge werden immer als `unlock_actions` geschrieben,
und eine Datei, die über den Editor gespeichert wird, wird umgewandelt.

## Siehe auch {/* #see-also */}

- [Items, Tags & Mods](/wiki/locking/items-and-recipes/items-tags-mods): die Felder, an denen das
  hängt.
- [Flüssigkeiten](/wiki/locking/items-and-recipes/fluids): das Flüssigkeits-Vokabular mit sieben
  Aktionen.
- [Kreaturen & Spawns](/wiki/locking/creatures-and-trade/entities-and-spawns#interactionlock):
  `interactionlock` nutzt dieselbe Form „was frei bleibt“ mit eigenen Aktionen.
- [Händler-Angebote](/wiki/locking/creatures-and-trade/merchant-trades): wo `trades.professions`
  absichtlich das Gegenteil tut und auflistet, was gesperrt *ist*.
