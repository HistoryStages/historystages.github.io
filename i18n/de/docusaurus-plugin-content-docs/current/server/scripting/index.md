---
title: Skripte
description: "Was ein Skript lesen und ändern darf, und die harte Grenze zwischen dem Skripten des Stage-Zustands und dem Anlegen von Stages."
sidebar_position: 5
---

History Stages spricht mit beiden Skript-Mods. Ein Skript kann den Stage-Zustand **lesen**, **ändern** und
darauf **reagieren**, wenn er sich ändert: in JavaScript über KubeJS, in ZenScript über CraftTweaker, mit
denselben Möglichkeiten auf beiden Seiten.

:::note[Nicht auf Fabric, noch nicht auf 26.2]
Alles unter Skripte gilt nur für NeoForge 1.21.1 und Forge 1.20.1. KubeJS hat keine Fabric-Version für
1.21.1 und CraftTweaker überhaupt keine, also hat die Fabric-Version von History Stages keine
Skript-Anbindung. Den Stage-Zustand aus Code lesen, ändern und darauf reagieren geht trotzdem aus einer
Mod heraus, über die [API](/api/).

Die 26.2-Beta hat auf keinem Loader eine Skript-Anbindung: Weder KubeJS noch CraftTweaker gibt es schon
für 26.2.
:::

Ein Skript kann keine Stages **anlegen** oder entscheiden, was eine Stage sperrt. Welche Items, Tags,
Mods, Rezepte, Dimensionen, Strukturen, Biome und Mobs zu einer Stage gehören, wird im Editor im Spiel
festgelegt, und nur dort.

Keine der beiden Mods ist Pflicht. Installier eine, beide oder keine; History Stages lädt seine
Anbindung nur für die, die da ist.

---

## Vor 6.0.0 und ab 6.0.0 {/* #before-600-and-from-600-on */}

Diese Seite ist die einzige Stelle im Wiki, die eine ältere Version neben der aktuellen beschreibt, weil
Modpacks, die für das alte Verhalten geschrieben wurden, weiter funktionieren und es keinen Grund gibt,
sie neu zu schreiben.

| | Vor 6.0.0 | Ab 6.0.0 |
|---|---|---|
| Auf ein Freischalten reagieren | `ForgeEvents.onEvent('net.bananemdnsa.historystages.api.stage.StageEvent$Unlocked', …)` | `HistoryStagesEvents.unlocked(event => …)` |
| Auf eine bestimmte Stage reagieren | im Listener von Hand filtern | `HistoryStagesEvents.unlocked('bronze', event => …)` |
| Fragen, ob eine Stage freigeschaltet ist | nicht möglich | `HistoryStages.isUnlocked('bronze')` |
| Eine Stage freischalten oder wieder sperren | nicht möglich | `HistoryStages.unlock('bronze')` |
| Fragen, ob etwas gesperrt ist | nicht möglich | `HistoryStages.isLocked('items', 'minecraft:diamond', player)` |
| CraftTweaker | gar nichts | `mods.historystages.HistoryStages` |

**Die alte Form funktioniert weiter.** `ForgeEvents.onEvent` mit dem Klassennamen als String löst
weiterhin aus; es ist nur nicht mehr der Weg, wie man es macht. Der Grund zum Umsteigen: Nichts prüft
diesen String. Schreibst du ihn falsch oder aktualisierst auf eine Version, in der die Klasse umgezogen
ist, läuft der Listener still nie. Die Klasse *ist* in 6.0.0 umgezogen, von
`net.bananemdnsa.historystages.events.StageEvent` nach
`net.bananemdnsa.historystages.api.stage.StageEvent`, also braucht ein Skript mit dem alten String den
neuen. Mit `HistoryStagesEvents` kann das nicht schiefgehen.

---

Die beiden Sprachen, jeweils mit Lesen, Ändern und Reagieren auf den Stage-Zustand:

- **[Skripte: KubeJS](/wiki/server/scripting/kubejs)**: JavaScript, `server_scripts` und `client_scripts`.
- **[Skripte: CraftTweaker](/wiki/server/scripting/crafttweaker)**: ZenScript, mit der Abkürzung `player.hasStage(...)`.

---

## Wenn etwas nicht stimmt {/* #when-something-is-wrong */}

Falsch getippte IDs bringen den Server nicht zum Absturz. Der Aufruf gibt `false` (oder eine leere
Liste) zurück, und History Stages schreibt eine Zeile ins Log:

| Was du getan hast | Was du bekommst |
|---|---|
| Unbekannte Stage-ID | `a script used unknown stage id 'bronce'. Known global stages: bronze, iron` |
| Individuelle Stage an `unlock` / `isUnlocked` übergeben | eine Zeile, die die Stage-Art und die richtige Methode nennt |
| Globale Stage an `unlockFor` / `isUnlockedFor` übergeben | dasselbe, umgekehrt |
| Unbekannte Sperr-Kategorie | `unknown lock category 'itemz'. Known categories: historystages:items, …` |
| Irgendein Aufruf, während kein Server läuft | eine Zeile, die das sagt |

**Jeder einzelne Fehler wird einmal ins Log geschrieben**, nicht einmal pro Aufruf; eine Abfrage in einem
Tick-Handler würde sonst dieselbe Zeile sechzigmal pro Sekunde schreiben. Diese Zählung teilen sich beide
Sprachen: Machen ein KubeJS-Skript und ein ZenScript-Skript denselben Fehler, bekommst du eine Zeile,
nicht zwei. Der Zähler wird bei `/reload` zurückgesetzt, also darf sich ein korrigiertes Skript wieder
über alles beschweren, was noch falsch ist.

Die Zeilen landen im normalen Spiel-Log (`logs/latest.log`), neben den Fehlern von KubeJS und
CraftTweaker, und nicht im Lade-Bericht von History Stages. Der wird einmal beim Start geschrieben und
ist nicht die Stelle, an der du suchst, wenn ein Skript sich komisch verhält.

Jeder ändernde Aufruf gibt einen Boolean zurück, also kann ein Skript prüfen, statt anzunehmen:

```javascript
if (!HistoryStages.unlock('bronze')) {
    console.warn('bronze was already unlocked, or the id is wrong')
}
```

---

## Ein Hinweis zu Rezepten aus Skripten {/* #a-note-on-script-generated-recipes */}

KubeJS baut Rezept-IDs aus der Reihenfolge, in der Dinge in deinen Skripten stehen:
`kubejs:crafting_shaped_7` ist das siebte geformte Rezept, das es gesehen hat. Sortierst du das Skript
um, verschiebt sich die Nummerierung, und jede Stage, die die alte ID gesperrt hat, geht still kaputt.

Seit 6.0.0 prüft History Stages das. Nach jedem Laden einer Welt und jedem `/reload` vergleicht es die
Rezept-IDs in deinen Stages mit den Rezepten, die tatsächlich geladen sind, und schreibt für jedes
fehlende eine Warnung. Im Editor werden diese Einträge im Reiter Rezepte der Stage rot angezeigt.

Entfernt wird nichts, denn ein Rezept kann aus gutem Grund eine Weile fehlen, aber du erfährst es am
selben Tag und nicht erst, wenn ein Spieler fragt, warum er etwas herstellen kann, was er nicht sollte.

Ganz vermeiden lässt es sich, wenn du deinen Rezepten feste IDs gibst:

```javascript
ServerEvents.recipes(event => {
    event.shaped('4x minecraft:stick', ['A', 'A'], { A: 'minecraft:oak_planks' })
        .id('mypack:sticks')
})
```

Dann gehört die ID dir, sie wandert nie, und was du im Editor auswählst, bleibt.

---

**Siehe auch:** [Stage State & Events](/api/stage-state-and-events) für die Java-Seite derselben Events ·
[Lock Categories](/api/lock-categories) dafür, was die Kategorie-IDs bedeuten ·
[Mod-Kompatibilität](/wiki/server/mod-compatibility) für die anderen Anbindungen
