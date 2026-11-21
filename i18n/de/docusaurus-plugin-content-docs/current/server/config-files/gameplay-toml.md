---
title: gameplay.toml
description: "Nachschlage-Liste für jeden Schlüssel in gameplay.toml: was im Hintergrund passiert."
sidebar_position: 3
---

# gameplay.toml {/* #gameplaytoml */}

Was im Hintergrund passiert. Liegt unter `config/historystages/settings/gameplay.toml`, gehört dem
Server und wird an jeden Spieler geschickt, der beitritt. →
[Config-Dateien](/wiki/server/config-files) dazu, wie die drei Einstellungsdateien zusammenhängen ·
[visual.toml](/wiki/server/config-files/visual-toml) für das, was ein Spieler sieht oder hört.

Diese Seite ist eine Nachschlage-Liste. Jeder Block verlinkt auf die Seite, die erklärt, wofür er da
ist.

## `[logging]` {/* #logging */}

→ Erklärt unter [Hilfe & Fehler melden](/wiki/about/getting-help).

| Einstellung | Standard | Beschreibung |
| :--- | :--- | :--- |
| `showDebugErrors` | `true` | Fehler und Warnungen beim Laden der Stages beim Beitreten im Chat zeigen. |
| `enableRuntimeLogging` | `false` | Ausführliche Laufzeit-Informationen (Stage-Änderungen, blockierte Aktionen, Inventar-Probleme) nach `config/historystages/logs/` schreiben. |

## `[gameplay]` {/* #gameplay */}

→ Erklärt unter [Items, Tags & Mods](/wiki/locking/items-and-recipes/items-tags-mods#what-locked-means).

| Einstellung | Standard | Beschreibung |
| :--- | :--- | :--- |
| `lockMobLoot` | `true` | Gesperrte Items aus Mob-Drops entfernen. |
| `lockBlockBreaking` | `true` | Gesperrte Blöcke werden viel schwerer abzubauen und droppen nichts. |
| `lockedBlockBreakSpeedMultiplier` | `0.05` | Faktor für die Abbaugeschwindigkeit gesperrter Blöcke. `0.05` heißt 20-mal langsamer. |
| `lockItemUsage` | `true` | Benutzen gesperrter Items verhindern: essen, anlegen, damit angreifen. |
| `lockEntityItems` | `true` | Benutzen oder Zerstören von Rüstungsständern und Rahmen mit gesperrten Items verhindern. |
| `lockBlockInteraction` | `true` | Öffnen der GUI gesperrter Blöcke verhindern (Truhen, Öfen, Werkbänke, …). |
| `lockContainerInteraction` | `true` | Verschieben gesperrter Items in Behältern verhindern. |
| `lockEnchanting` | `true` | Auftragen gesperrter Verzauberungen über Ambosse und Zaubertische verhindern. |
| `dropItemsFromLockedSlots` | `true` | Items aus einem Slot werfen, wenn dieser Slot [gesperrt](/wiki/locking/items-and-recipes/slots#items-already-in-a-locked-slot) wird. `false` lässt sie liegen und friert den Slot um sie herum ein. *Seit 6.2.0.* |

## `[research]` {/* #research */}

→ Erklärt unter [Forschungspodest](/wiki/in-game-tools/research/pedestal) und [Forschungsrollen](/wiki/in-game-tools/research/scrolls).

| Einstellung | Standard | Beschreibung |
| :--- | :--- | :--- |
| `researchTimeInSeconds` | `20` | Standard-Forschungsdauer, wenn das JSON einer Stage kein `research_time` setzt. |
| `researchBoosters` | `[]` | Booster-Blöcke unter einem Podest, die die Forschung beschleunigen oder verbilligen. Format pro Eintrag: `"block_id, speed%, cost%, tier, mode"`. Siehe [Forschungssystem](/wiki/in-game-tools/research/pedestal#boosters). |
| `defaultScrollCompletion` | `"consume"` | Was mit einer Rolle passiert, wenn ihre Forschung fertig ist. `consume` verbraucht sie; `replace` legt eine frische Rolle für dieselbe Stage zurück ins Podest; `open` lässt eine geöffnete Rolle als Andenken zurück. Eine Stage kann das mit ihrem eigenen `scroll_completion` überschreiben. |
| `enableScrollResealing` | `true` | Erlauben, eine geöffnete Rolle wieder zu einer versiegelten herzustellen. Das Herstellen folgt dem sofort, aber JEI und EMI bauen ihre Rezeptlisten beim Start auf, also erscheint oder verschwindet der Eintrag dort erst nach einem Neustart. |

## `[stage_logic]` {/* #stage_logic */}

→ Erklärt unter [Logikbausteine](/wiki/stage-file/logic-blocks).

| Einstellung | Standard | Beschreibung |
| :--- | :--- | :--- |
| `researchWhenBlocked` | `PAUSE` | Was ein Podest tut, wenn seine Stage während der Forschung blockiert wird. `PAUSE` behält den Fortschritt und macht weiter, sobald die Blockade weg ist; `CANCEL` bricht ab und gibt die Rolle zurück. |
| `warnOnForcedUnlock` | `true` | Einen Operator benachrichtigen, wenn ein Befehl oder der Editor eine blockierte Stage freischaltet. Freigeschaltet wird trotzdem; das entscheidet nur, ob es gesagt wird. |

## `[loot_replacements]` {/* #loot_replacements */}

→ Erklärt unter [Loot](/wiki/locking/items-and-recipes/loot#replacing-instead-of-removing).

| Einstellung | Standard | Beschreibung |
| :--- | :--- | :--- |
| `useReplacements` | `false` | Gesperrten Loot durch etwas anderes ersetzen, statt ihn zu entfernen. |
| `replacementItems` | `[]` | Item-IDs, aus denen zufällig ein Ersatz gewählt wird. Wird zuerst geprüft. |
| `replacementTags` | `[]` | Item-Tags (z. B. `c:dusts`), aus denen zufällig ein Ersatz gewählt wird. Wird genommen, wenn `replacementItems` leer oder erschöpft ist. |

## `[individual_stages]` {/* #individual_stages */}

→ Erklärt unter [Globale vs. individuelle Stages](/wiki/start-here/global-vs-individual).

Die Gegenstücke pro Spieler zu den Sperren in `[gameplay]`. Ihre Benachrichtigungs-Einstellungen stehen in `visual.toml` unter `[notifications.individual]`.

| Einstellung | Standard | Beschreibung |
| :--- | :--- | :--- |
| `lockItemPickup` | `true` | Aufheben von Items verhindern, die individuelle Stages sperren. |
| `lockLoot` | `true` | Individuell gesperrte Items in Lootr-Behältern und Mob-Loot behandeln. Lootr-Loot wird gegen den Spieler geprüft, für den er gewürfelt wird; Mob-Drops sind gemeinsame Welt-Items und werden gegen den Spieler geprüft, der getötet hat. |
| `dropOnRevoke` | `true` | Gesperrte Items aus dem Inventar eines Spielers werfen, wenn ihm seine individuelle Stage entzogen wird. |
| `lockBlockBreaking` | `true` | Individuell gesperrte Blöcke werden viel schwerer abzubauen. |
| `lockedBlockBreakSpeedMultiplier` | `0.05` | Faktor für die Abbaugeschwindigkeit individuell gesperrter Blöcke. |
| `lockItemUsage` | `true` | Benutzen individuell gesperrter Items verhindern. |
| `lockBlockInteraction` | `true` | Öffnen der GUI individuell gesperrter Blöcke verhindern. |
| `lockEnchanting` | `true` | Auftragen individuell gesperrter Verzauberungen verhindern. |
| `lockRecipes` | `true` | Individuelle Stages Rezepte an den Stationen sperren lassen, die wissen, wer herstellt: Werkbank, 2×2-Raster im Inventar, Steinsäge, Schmiedetisch. Öfen, Trichter und Autocrafter lösen Rezepte ohne Spieler auf und bleiben nur global. |

## `[team_mods]` {/* #team_mods */}

→ Erklärt unter [Mit einem Team teilen](/wiki/start-here/global-vs-individual#sharing-with-a-team).

| Einstellung | Standard | Beschreibung |
| :--- | :--- | :--- |
| `shareOnJoin` | `false` | Einem Spieler, der einer Party beitritt, jede geteilte Stage geben, die schon jemand darin hat. Wird bei jedem Einloggen erneut geprüft. Verlassen nimmt nie Stages weg. |
| `shareLoss` | `false` | Verliert ein Spieler eine geteilte Stage, verliert sie der Rest der Party auch, auf normalem Weg. Sperren durch Admins werden nie geteilt. |
| `useFtbTeams` | `true` | FTB-Teams-Partys als Teams zählen. Solo-Teams zählen nie. |

## `[structure_lock]` {/* #structure_lock */}

→ Erklärt unter [Dimensionen & Strukturen](/wiki/locking/world/dimensions-and-structures#structures).

| Einstellung | Standard | Beschreibung |
| :--- | :--- | :--- |
| `checkInterval` | `10` | Ticks zwischen den Prüfungen, ob ein Spieler in einer gesperrten Struktur ist. |
| `messageEnabled` | `true` | Eine Nachricht schicken, wenn ein Spieler eine gesperrte Struktur betritt. |
| `messageFormat` | `"&cYou cannot enter &e{structure}&c yet!"` | Format dieser Nachricht. Kennt `{stage}` und `{structure}`. |
| `showInChat` | `false` | Sie auch in den Chat schicken, nicht nur in die Actionbar. |
| `damageEnabled` | `false` | Spieler in einer gesperrten Struktur verletzen. |
| `damageAmount` | `1.0` | Schaden pro Tick-Intervall. |
| `damageInterval` | `20` | Ticks zwischen Schadens-Ticks. |
| `lockPadding` | `0` | **Fortgeschritten.** Zusätzliche Blöcke um jedes Strukturteil beim Bauen der Sperrzone, zusätzlich zu einem festen Puffer von 2 Blöcken. Bereich 0–16. |
| `clusterDistance` | `6` | **Fortgeschritten.** Wie weit zwei Teile derselben Struktur auseinander sein dürfen und trotzdem eine Sperrzone bilden. Höher = größere, stärker gefüllte Zonen. Bereich 0–32. |
| `blockRightClick` | `true` | Rechtsklick-Interaktionen in einer gesperrten Struktur abbrechen. |
| `blockLeftClick` | `true` | Linksklick-Interaktionen in einer gesperrten Struktur abbrechen. |
| `blockProjectiles` | `true` | Projektile in dem Moment abbrechen, in dem sie in einer gesperrten Struktur etwas treffen würden. |
| `blockExplosions` | `true` | Verhindern, dass Explosionen Blöcke in einer gesperrten Struktur zerstören. |

## `[biome_lock]` {/* #biome_lock */}

→ Erklärt unter [Biome](/wiki/locking/world/biomes).

| Einstellung | Standard | Beschreibung |
| :--- | :--- | :--- |
| `checkInterval` | `10` | Ticks zwischen den Prüfungen, ob ein Spieler in einem gesperrten Biom ist. Bereich 1–200. |
| `effectsEnabled` | `true` | Spielern in einem gesperrten Biom Trank-Effekte geben. |
| `effects` | `["minecraft:blindness, 30, 0"]` | Die Effekte. Format pro Eintrag: `"effect_id, seconds, amplifier"`. |
| `clearEffectsOnLeave` | `false` | Diese Effekte entfernen, sobald der Spieler geht, statt sie auslaufen zu lassen. |
| `messageEnabled` | `true` | Eine regelmäßige Nachricht schicken, solange man in einem gesperrten Biom ist. |
| `messageFormat` | `"&cYou cannot survive in &e{biome}&c yet!"` | Format dieser Nachricht. Kennt `{stage}` und `{biome}`. |
| `showInChat` | `false` | Sie auch in den Chat schicken. |
| `damageEnabled` | `true` | Spieler in einem gesperrten Biom verletzen. |
| `damageAmount` | `1.0` | Schaden pro Tick-Intervall. Bereich 0.1–100.0. |
| `damageInterval` | `20` | Ticks zwischen Schadens-Ticks. Bereich 1–600. |
| `blockRightClick` | `true` | Rechtsklick-Interaktionen in einem gesperrten Biom abbrechen. |
| `blockLeftClick` | `true` | Linksklick-Interaktionen in einem gesperrten Biom abbrechen. |
| `blockProjectiles` | `true` | Projektile in dem Moment abbrechen, in dem sie in einem gesperrten Biom etwas treffen würden. |
| `blockExplosions` | `true` | Verhindern, dass Explosionen Blöcke in einem gesperrten Biom zerstören. |

## `[zone_lock]` {/* #zone_lock */}

→ Erklärt unter [Zonen](/wiki/locking/world/zones).

Zonen haben ihre eigenen Regeln pro Zone, also wird fast nichts davon für den ganzen Server eingestellt. Das Einzige: mit welchem Item man in der Welt Ecken markiert.

| Einstellung | Standard | Beschreibung |
| :--- | :--- | :--- |
| `markerItem` | `"minecraft:stick"` | Item zum Markieren von Zonen-Ecken. Schleichen + Linksklick setzt die erste Ecke, Schleichen + Rechtsklick die zweite. Braucht Berechtigungsstufe 2, dieselbe Schwelle wie das Öffnen des Editors. Ohne Schleichen verhält sich das Item ganz normal, also ist etwas, das du sowieso dabeihast, eine sichere Wahl. Leer lassen, um das Markieren per Item abzuschalten und stattdessen `/history zone` zu nehmen. |

## `[advanced]` {/* #advanced */}

→ Erklärt unter [Reloads nach einer Stage-Änderung](/wiki/server/stage-change-reload). *Seit 6.2.0.*

Absichtlich der letzte Block und im Config-Editor auch so beschriftet. Die Standards passen für fast
jedes Modpack.

| Einstellung | Standard | Beschreibung |
| :--- | :--- | :--- |
| `reloadAfterStageChange` | `TARGETED` | Was eine Stage-Änderung auslöst, die gesperrte Rezepte verändert. `TARGETED` führt nur die Teile von Mods neu aus, die auf einen Reload reagieren, und der Server läuft weiter. `BACKGROUND` führt den vollen Datapack-Reload aus, während der Server weiterläuft. `FULL` ist der volle Reload, bei dem der Server darauf wartet, so wie sich jede 6.x-Version vor 6.2.0 verhalten hat. |
| `targetedReloadSkip` | Der Maschinen-Lader von Modular Machinery Reborn, die Spawn-Tabellen von The Hordes | Reload-Listener, die `TARGETED` auslässt, mit vollem Klassennamen. Nur für Listener, die eigene Daten laden und keine Rezepte halten. KubeJS- und CraftTweaker-Skripte werden immer ausgelassen und brauchen keinen Eintrag. |
| `slowListenerHintMs` | `250` | Nach einem `TARGETED`-Reload jeden Listener ins Log schreiben, der den Server mindestens so viele Millisekunden aufgehalten hat. `0` schaltet den Hinweis ab. Bereich 0–60000. |
