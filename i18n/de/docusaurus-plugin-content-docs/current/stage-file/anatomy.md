---
title: Aufbau einer Stage-Datei
description: "Jedes Feld, das eine Stage-Datei haben kann, was der Editor hineinschreibt und was passiert, wenn eins fehlt."
sidebar_position: 1
---

# Aufbau einer Stage-Datei {/* #anatomy-of-a-stage-file */}

Meistens schreibst du das nie von Hand. Der [Editor im Spiel](/wiki/in-game-tools/in-game-editor)
erzeugt genau die Datei unten, mit einem Reiter pro Feldgruppe, und so entsteht fast jedes Modpack.

Die Seite lohnt sich trotzdem: Sie zeigt, was der Editor schreibt, wie der Rest dieses Wikis die Dinge
nennt, und was du liest, wenn eine Stage sich komisch verhält.

Eine Stage ist eine JSON-Datei. Jedes Feld ist optional: Eine Datei, die nur einen `display_name` hat,
ist gültig und sperrt einfach nichts.

```json title="config/historystages/global/bronze_age.json"
{
  "display_name": "Bronze Age",
  "icon": "minecraft:copper_ingot",
  "mode": "default",
  "research_time": 120,

  "items": ["minecraft:iron_ingot"],
  "tags": ["c:ores/iron"],
  "recipes": ["minecraft:iron_pickaxe"],

  "dependencies": [
    { "logic": "AND", "stages": ["stone_age"] }
  ]
}
```

Die **ID der Stage ist der Dateiname**, kein Feld. Siehe
[Wo die Stage-Dateien liegen](/wiki/start-here/where-stage-files-live).

Jede Gruppe unten verlinkt auf die Seite, die sie erklärt, und sagt, wo du dieselbe Einstellung im
Editor findest.

## Identität {/* #identity */}

*Im Editor:* **Stage-Einstellungen**, der Knopf im Bildschirm der Stage.

| Feld | Typ | Was es tut |
| :--- | :--- | :--- |
| `display_name` | String | Der Name, den Spieler lesen: Nachrichten, Tooltips, Toasts, der Graph. Nicht die ID. |
| `icon` | String | Item-ID, die als Symbol in Freischalt-Toasts dient. Ohne Angabe gilt die Einstellung `defaultStageIcon`. |

## Wie sie erforscht wird {/* #how-it-is-researched */}

*Im Editor:* **Stage-Einstellungen** für den Modus, die Forschungszeit und die Podest-Stufe; der
**Abhängigkeits-Editor** für `dependencies`.

| Feld | Typ | Was es tut |
| :--- | :--- | :--- |
| `mode` | String | Wie die Stage freigeschaltet wird und ob es eine Forschungsrolle dafür gibt. Ohne Angabe `"default"`. → [Stage-Modi](/wiki/stage-file/stage-modes) |
| `auto_trigger` | Object | Für `auto`- und `temporary`-Stages: die Auslöser, die sie freischalten, und ob einer oder alle auslösen müssen. → [Stage-Modi](/wiki/stage-file/stage-modes#auto) |
| `temporary` | Object | Für `temporary`-Stages: wie lange sie offen bleibt, wie oft sie auslösen darf und die Abklingzeit dazwischen. → [Stage-Modi](/wiki/stage-file/stage-modes#temporary) |
| `lock_trigger` | Object | Für `default`- und `auto`-Stages: Auslöser, die die Stage wieder sperren, und ob sie danach wieder freigeschaltet werden kann. → [Wieder sperren](/wiki/stage-file/relocking#lock-triggers) |
| `notify` | Boolean | `false` unterdrückt die Nachrichten beim Freischalten und Wiedersperren dieser Stage. → [Wieder sperren](/wiki/stage-file/relocking#notify) |
| `research_time` | Integer | Sekunden am Podest. `0` oder ohne Angabe nimmt das serverweite `researchTimeInSeconds`. |
| `min_pedestal_tier` | Integer 1–4 | Niedrigste [Podest-Stufe](/wiki/in-game-tools/research/pedestal#tiers), die sie erforschen darf. Standard `1`. |
| `pedestal_tier_mode` | String | `"min"` (diese Stufe und höher) oder `"exact"` (nur diese Stufe). Standard `"min"`. |
| `dependencies` | Liste von Objects | Bedingungen, die erfüllt sein müssen, bevor sie überhaupt erforscht werden kann. → [Abhängigkeiten](/wiki/stage-file/dependencies) |
| `logic` | Liste von Objects | Regeln, die die Stage abhängig von anderen Stages blockieren, verstecken, verteuern oder entziehen. → [Logikbausteine](/wiki/stage-file/logic-blocks) |
| `scroll_completion` | String | Was mit der Rolle passiert, wenn die Forschung fertig ist: `"consume"`, `"replace"` oder `"open"`. Überschreibt das serverweite `defaultScrollCompletion`. → [Forschungsrollen](/wiki/in-game-tools/research/scrolls#what-happens-when-research-finishes) |

## Was sie sperrt {/* #what-it-locks */}

*Im Editor:* ein Reiter pro Zeile unten: Items, Tags, Mods, Ausnahmen, Rezepte, Flüssigkeiten,
Verzauberungen & Effekte, Dimensionen, Strukturen, Biome, Zonen, Kreaturen (als Angriff / Interaktion /
Spawn) und Handel.

| Feld | Typ | Was es sperrt |
| :--- | :--- | :--- |
| `items` | Strings / Objects | Item-IDs. Objects ergänzen [NBT-Kriterien](/wiki/locking/items-and-recipes/nbt-and-components) und [`unlock_actions`](/wiki/locking/items-and-recipes/unlock-actions). → [Items, Tags & Mods](/wiki/locking/items-and-recipes/items-tags-mods) |
| `tags` | Strings / Objects | Item-Tags wie `c:ores/iron`. Dieselbe Object-Form wie bei `items`. |
| `mods` | Strings | Mod-IDs: jedes Item, das die Mod registriert. |
| `mod_exceptions` | Strings / Objects | Items, die aus einer `mods`-Sperre wieder herausgenommen werden. |
| `recipes` | Strings | Rezept-IDs, mit Schloss in JEI und EMI. → [Rezepte](/wiki/locking/items-and-recipes/recipes) |
| `fluids` | Strings / Objects | Flüssigkeits-IDs. Sperrt, was ein Stack *enthält*, also deckt ein Eintrag jeden Eimer und Tank ab. → [Flüssigkeiten](/wiki/locking/items-and-recipes/fluids) |
| `enchantments` | Strings / Objects | Verzauberungs-IDs. Sperrt Bücher und Ausrüstung, die sie tragen, und die Stationen, die sie auftragen. → [Verzauberungen & Effekte](/wiki/locking/items-and-recipes/enchantments-and-effects) |
| `effects` | Strings / Objects | Trank-Effekt-IDs. Sperrt Tränke und Pfeile, die sie tragen. → [Verzauberungen & Effekte](/wiki/locking/items-and-recipes/enchantments-and-effects) |
| `dimensions` | Strings | Dimensions-IDs, die Spieler nicht betreten dürfen. → [Dimensionen & Strukturen](/wiki/locking/world/dimensions-and-structures) |
| `structures` | Object | `structures` verwehrt den Zutritt; `block_generation` begrenzt, wie oft eine generieren darf. → [Dimensionen & Strukturen](/wiki/locking/world/dimensions-and-structures) |
| `biomes` | Object | Biome, in denen Spieler nicht überleben können. → [Biome](/wiki/locking/world/biomes) |
| `zones` | Liste von Objects | Selbst gezeichnete Bereiche, jeder mit eigenen Regeln. → [Zonen](/wiki/locking/world/zones) |
| `entities` | Object | `attacklock`, `interactionlock`, `spawnlock`. → [Kreaturen & Spawns](/wiki/locking/creatures-and-trade/entities-and-spawns) |
| `trades` | Object | `offers`, `professions`, `levels`. → [Händler-Angebote](/wiki/locking/creatures-and-trade/merchant-trades) |

Loot hat kein eigenes Feld. Gesperrte Items werden über die Aktion `loot` aus Truhen-Loot und
Mob-Drops gefiltert, und die ist an, solange ein Eintrag sie nicht ausdrücklich weglässt. →
[Loot](/wiki/locking/items-and-recipes/loot)

## Wie sie sich verhält, wenn es sie gibt {/* #how-it-behaves-once-it-exists */}

*Im Editor:* **Stage-Einstellungen**: `hidden_display` als Karte „Anzeige“, `interchangeable` und die
fixierten Aktionen in der Karte „Sperren“, `lose_on_death` und `share_with_team` in der Karte
„Individuell“.

| Feld | Typ | Was es tut |
| :--- | :--- | :--- |
| `hidden_display` | Object | Was gesperrte Spieler statt des echten Namens und Tooltips sehen. → [Verdeckte Anzeige](/wiki/stage-file/hidden-display) |
| `lose_on_death` | Boolean | Nur individuelle Stages. Sperrt die Stage wieder, wenn ihr Besitzer stirbt. → [Bei Tod verlieren](/wiki/start-here/global-vs-individual#lose-on-death) |
| `share_with_team` | Boolean | Nur individuelle Stages. Wer sie freischaltet, schaltet sie auch für seine FTB-Teams-Party frei. → [Mit einem Team teilen](/wiki/start-here/global-vs-individual#sharing-with-a-team) |
| `interchangeable` | Boolean | Sperren mehrere Stages dasselbe, reicht eine der austauschbaren. → [Austauschbare Stages](/wiki/stage-file/interchangeable-stages) |
| `fixed_lock_actions` | Object | Sperr-Aktionen, die für jeden Item-, Flüssigkeits-, Interaktions-, Verzauberungs- oder Effekt-Eintrag der Stage fixiert sind. → [Unlock Actions](/wiki/locking/items-and-recipes/unlock-actions#fixing-actions-for-a-whole-stage) |
| `fixed_spawn_rule` | Object | Nur globale Stages. SpawnControl-Zeilen, die für jede Kreatur der Stage fixiert sind. → [Unlock Actions](/wiki/locking/items-and-recipes/unlock-actions#fixing-actions-for-a-whole-stage) |

## Felder, die anderen Mods gehören {/* #fields-other-mods-own */}

*Im Editor:* Ein installiertes Addon bekommt einen eigenen Reiter. Die Daten eines nicht installierten
Addons werden mitgeführt, ohne dass ein Reiter sie zeigt.

| Feld | Typ | Was es tut |
| :--- | :--- | :--- |
| `addons` | Object | Gesperrte Inhalte, die einer anderen Mod gehören, ein Block pro Addon. → [Addon-Entwicklung](/api/addon-development) |
| `addon_settings` | Object | Einstellungen pro Stage, die ein Addon angemeldet hat. |

Diese beiden schreibt und liest das Addon, dem sie gehören. History Stages führt sie unverändert mit:
Der Block eines Addons übersteht eine Bearbeitung im Editor auch dann, wenn das Addon gerade nicht
installiert ist. Eine Mod zu deinstallieren entfernt ihre Daten also nicht still aus deinen
Stage-Dateien.

## Zwei Formen für einen Eintrag {/* #two-shapes-for-one-entry */}

Die meisten Sperr-Felder nehmen entweder eine einfache ID oder ein Object. Die einfache Form ist der
Normalfall und sperrt alles am Eintrag:

```json
"items": ["minecraft:diamond_sword"]
```

Die Object-Form ist zum Eingrenzen da: ein Kriterium, das passen muss, oder eine Reihe von Aktionen,
die frei bleiben:

```json
"items": [
  {
    "id": "minecraft:diamond_sword",
    "unlock_actions": ["pickup", "equip"],
    "nbt": { "components": { "minecraft:enchantments": { "minecraft:sharpness": 5 } } }
  }
]
```

Beide Formen können in derselben Liste stehen.

<details>
<summary>Alte Schreibweisen werden weiter geladen</summary>

Dateien für ältere Versionen funktionieren weiter. `"structures": [ ... ]` als flaches Array wird
gelesen und beim nächsten Speichern in die Object-Form umgeschrieben; `lock_actions` wird neben dem
neueren `unlock_actions` gelesen; `unlock_dimensions` in einer Spawn-Regel wird als
Dimensions-Bedingung gelesen. Neue Dateien werden immer in der aktuellen Form geschrieben.

</details>

## Weiter {/* #next */}

- [Stage-Modi](/wiki/stage-file/stage-modes): wie eine Stage freigeschaltet wird, durch Forschung,
  Auslöser, Skript oder auf Zeit.
- [Abhängigkeiten](/wiki/stage-file/dependencies): was vorher passieren muss.
- [Verdeckte Anzeige](/wiki/stage-file/hidden-display): Namen und Tooltips vor gesperrten Spielern
  verbergen.
- [Komplette Beispiele](/wiki/stage-file/complete-examples): ganze Dateien zum Kopieren.
