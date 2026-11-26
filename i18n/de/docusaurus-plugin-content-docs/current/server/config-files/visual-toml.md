---
title: visual.toml
description: "Nachschlage-Liste für jeden Schlüssel in visual.toml: was ein Spieler sieht oder hört."
sidebar_position: 2
---

# visual.toml {/* #visualtoml */}

Was ein Spieler sieht oder hört. Liegt unter `config/historystages/settings/visual.toml`, gehört dem
Server und wird an jeden Spieler geschickt, der beitritt. →
[Config-Dateien](/wiki/server/config-files) dazu, wie die drei Einstellungsdateien zusammenhängen ·
[gameplay.toml](/wiki/server/config-files/gameplay-toml) für das, was im Hintergrund passiert.

Diese Seite ist eine Nachschlage-Liste. Jeder Block verlinkt auf die Seite, die erklärt, wofür er da
ist.

## `[visuals]` {/* #visuals */}

![Der Config-Editor auf dem Reiter Visual](/img/editor/config-visual.webp)

→ Siehe auch: [Verdeckte Anzeige](/wiki/stage-file/hidden-display) · [Forschungsrollen](/wiki/in-game-tools/research/scrolls).

| Einstellung | Standard | Beschreibung |
| :--- | :--- | :--- |
| `showTooltips` | `true` | Info-Tooltips an gesperrten Items zeigen. |
| `showStageName` | `true` | Wenn Tooltips an sind, die nötige Stage nennen. |
| `showAllUntilComplete` | `true` | Gehört ein Item zu mehreren Stages, alle auflisten, bis alle freigeschaltet sind. |
| `showLockIcons` | `true` | Schloss-Overlay auf gesperrten Items in Inventaren und JEI/EMI. |
| `showBoosterTooltips` | `true` | Tooltip an Booster-Blöcken des Forschungspodests, der ihre Wirkung auf Tempo und Kosten beschreibt. |
| `showScrollTierTooltip` | `true` | Die nötige Mindest-Podeststufe im Tooltip der Forschungsrolle zeigen. |
| `openScrollBackdrop` | `60` | Wie stark die Welt hinter einer geöffneten Rolle abgedunkelt wird, in Prozent. `0` = gar nicht, `100` = schwarz. |
| `showWelcomeMessage` | `true` | Die Willkommensnachricht, die Spieler beim Beitreten sehen. |
| `showEditorButton` | `true` | Der Knopf „Stage-Editor“ im Pausemenü. Operatoren können den Editor weiterhin mit `/history debug editor` öffnen. |
| `groupInterchangeableStages` | `true` | [Austauschbare Stages](/wiki/stage-file/interchangeable-stages) im Tooltip unter einer Zeile „Eines davon:“ auflisten. Aus werden sie wie jede andere Stage aufgeführt. |

## `[structure_overlay]` {/* #structure_overlay */}

→ Erklärt unter [Dimensionen & Strukturen](/wiki/locking/world/dimensions-and-structures#structures).

| Einstellung | Standard | Beschreibung |
| :--- | :--- | :--- |
| `structureBorderEnabled` | `true` | Eine Grenze im Kraftfeld-Stil an den Wänden gesperrter Strukturen zeichnen, wenn man nah kommt. |
| `structureBorderDistance` | `8.0` | Wie nah, in Blöcken, bis die Grenze sichtbar wird. Sie blendet beim Näherkommen ein. Bereich 1.0–32.0. |
| `structureLockOverlayEnabled` | `true` | Solange man in einer gesperrten Struktur steht, den ganzen Bildschirm rot tönen. |
| `structureLockOverlayOpacity` | `0.30` | Deckkraft dieser roten Tönung. Bereich 0.0–1.0. |

## `[zone_overlay]` {/* #zone_overlay */}

→ Erklärt unter [Zonen](/wiki/locking/world/zones).

Zonen sind Bereiche, die ein Modpack-Autor selbst zeichnet, und jede hat ihren eigenen Schalter, ob sie überhaupt eine Wand zeigt oder den Bildschirm tönt. Dieser Block beantwortet nur, **wie stark**; einen zweiten Schalter, der dem der Zone widersprechen könnte, gibt es hier absichtlich nicht.

| Einstellung | Standard | Beschreibung |
| :--- | :--- | :--- |
| `zoneBorderDistance` | `8.0` | Wie nah, in Blöcken, bis die Wand einer gesperrten Zone sichtbar wird. Sie blendet beim Näherkommen ein. `0` schaltet die Wand ganz ab. Bereich 0.0–32.0. |
| `zoneLockOverlayOpacity` | `0.30` | Deckkraft der roten Tönung, solange man in einer gesperrten Zone steht. `0.0` schaltet sie ab. Bereich 0.0–1.0. |
| `zoneBorderFullView` | `false` | Die Wand weit über die üblichen paar Blöcke hinaus zeichnen, damit eine ganze Seite auf einmal sichtbar ist. Sie blendet trotzdem mit der Entfernung aus: Die Wand wird aus den Blöcken vor dir berechnet, und je weiter sie reicht, desto mehr sind es. |
| `zoneBorderOutline` | `false` | Zusätzlich ein Drahtgitter jeder Form einer gesperrten Zone zeichnen, das ab etwa fünfzig Blöcken einblendet. Eher beim Anlegen eines Modpacks nützlich als beim Spielen. |
| `zoneBorderColor` | `#E61414` | Farbe von Wand und Drahtgitter. |

Zonen lesen diese Werte statt der Struktur-Werte oben, weil ein Modpack eine ganze Gegend als Zone und eine einzelne Hütte als Struktur sperren kann, und den Wunsch, die Gegend von weiter weg zu sehen, sagt nichts über die Hütte aus.

## `[jade]` (braucht Jade) {/* #jade-requires-jade */}

→ Siehe [Mod-Kompatibilität](/wiki/server/mod-compatibility).

| Einstellung | Standard | Beschreibung |
| :--- | :--- | :--- |
| `showInfo` | `true` | Stage-Infos an gesperrten Blöcken im Jade-Overlay zeigen. |
| `showStageName` | `true` | Wenn Jade-Infos an sind, die nötige Stage nennen. |
| `showAllUntilComplete` | `true` | Gehört ein Block zu mehreren Stages, alle auflisten, bis alle freigeschaltet sind. |
| `groupInterchangeableStages` | `true` | Wie in `[visuals]`, für das Jade-Overlay. |

## `[dimension_lock]` und `[mob_lock]` {/* #dimension_lock-and-mob_lock */}

→ Erklärt unter [Dimensionen & Strukturen](/wiki/locking/world/dimensions-and-structures#dimensions) und [Kreaturen & Spawns](/wiki/locking/creatures-and-trade/entities-and-spawns#attacklock).

Beide Blöcke haben dieselben drei Schlüssel; sie steuern nur die Rückmeldung, nicht die Sperre selbst.

| Einstellung | Standard | Beschreibung |
| :--- | :--- | :--- |
| `useActionbar` | `true` | Eine kurze Nachricht in der Actionbar zeigen. |
| `showInChat` | `false` | Die Nachricht auch in den Chat schicken. |
| `showStagesInChat` | `true` | Wenn die Chat-Nachricht an ist, die nötigen Stages mit aufführen. |

## `[trade_lock]` {/* #trade_lock */}

→ Erklärt unter [Händler-Angebote](/wiki/locking/creatures-and-trade/merchant-trades#what-the-player-sees).

Steuert den Hinweis **im** Handelsfenster, wenn ein Händler nach Anwendung der Handels-Sperren nichts mehr anzubieten hat. Ohne ihn sieht ein ausgeräumter Händler genauso aus wie einer, der gerade nichts auf Lager hat, und das wirkt wie ein Fehler.

| Einstellung | Standard | Beschreibung |
| :--- | :--- | :--- |
| `showStagesInWindow` | `false` | Zusätzlich die Stages nennen, die die Angebote zurückhalten. |

Standardmäßig aus, anders als die Schalter für Dimensionen und Mobs. Die beantworten „warum komme ich da nicht hin“, und die Stage zu nennen ist dort die ganze Hilfe; ein Händler, der nichts anzubieten hat, ist ein Rätsel, das manche Modpacks lieber eins bleiben lassen.

## `[individual_stages]` {/* #individual_stages */}

→ Erklärt unter [Globale vs. individuelle Stages](/wiki/start-here/global-vs-individual).

| Einstellung | Standard | Beschreibung |
| :--- | :--- | :--- |
| `showSilverLockIcons` | `true` | Silbernes Schloss-Symbol an Items, die individuelle Stages sperren. |
| `showIndividualTooltips` | `true` | Tooltip-Infos für Items, die individuelle Stages sperren. |

## `[recipe_book]` {/* #recipe_book */}

→ Erklärt unter [Rezepte](/wiki/locking/items-and-recipes/recipes#what-players-see).

| Einstellung | Standard | Beschreibung |
| :--- | :--- | :--- |
| `hideLockedRecipesInBook` | `true` | Gesperrte Rezepte im **Vanilla**-Rezeptbuch an der Werkbank verstecken. Deckt beide Hälften der Rezept-Sperre ab: eine Rezept-ID, die in einer Stage steht, und ein Item, dessen gesperrte Aktionen `recipe` enthalten. |

**Das ist eine Änderung gegenüber der Zeit vor 6.0.0**, als ein gesperrtes Rezept im Buch sichtbar blieb und sich nur nicht herstellen ließ. Ausschalten bringt dieses Verhalten zurück. Das Buch gehört einem Spieler, also wird es pro Spieler gefiltert, und eine individuelle Stage erreicht es.

## `[jei_hiding]` {/* #jei_hiding */}

→ Erklärt unter [Rezepte](/wiki/locking/items-and-recipes/recipes#what-players-see).

Abschnitt und Schlüssel sind nach JEI benannt, steuern aber auch EMI.

| Einstellung | Standard | Beschreibung |
| :--- | :--- | :--- |
| `hideLockedItemsInJei` | `false` | Gesperrte Items ganz aus den Zutatenlisten von JEI und EMI entfernen, statt sie mit einem Schloss-Overlay zu markieren. |
| `hideLockedRecipesInJei` | `false` | Gesperrte Rezepte verstecken. JEI erfasst nur Vanilla-Rezeptarten über ihr Ergebnis; EMI versteckt jedes Rezept, das das Schloss-Overlay markieren würde. |
| `lockedItemMultiStagePolicy` | `STRICT` | Wie sich Items verhalten, die mehreren Stages zugewiesen sind. `STRICT` = gesperrt, solange irgendeine zugewiesene Stage gesperrt ist. `LENIENT` = frei, sobald irgendeine zugewiesene Stage frei ist. |
| `showLockOverlay` | `true` | Gesperrte Rezepte in JEI und EMI abdunkeln und Hovern über ihre Slots blockieren. Aus sieht ein gesperrtes Rezept aus wie jedes andere; verstecken bleibt `hideLockedRecipesInJei`. *Seit 6.2.0.* |
| `lockOverlayExemptions` | keine | JEI- und EMI-Kategorien, die die Rezept-Sperre ganz in Ruhe lässt: kein Overlay, Hovern geht, nichts versteckt. `create:mixing` nennt eine Kategorie, `create` jede Kategorie dieser Mod. Für Seiten, die nur zeigen, wo Dinge herkommen. Just Enough Resources bleibt immer unberührt. *Seit 6.2.0.* |

Im [Config-Editor](/wiki/in-game-tools/in-game-editor#the-config-editor) ist `lockOverlayExemptions` eine Auswahl über die Kategorien, die JEI oder EMI tatsächlich hat, nach Mod gruppiert, mit einer Option **Ganze Mod** pro Mod. Einträge für Mods, die nicht installiert sind, bleiben beim Speichern erhalten.

## `[slot_lock]` {/* #slot_lock */}

→ Erklärt unter [Slots](/wiki/locking/items-and-recipes/slots#the-tooltip). *Seit 6.2.0.*

Der Tooltip, der erscheint, wenn ein Spieler über einen gesperrten Slot im Modus `overlay` fährt.

| Einstellung | Standard | Beschreibung |
| :--- | :--- | :--- |
| `showTooltip` | `true` | Den Tooltip überhaupt zeigen. |
| `tooltipLines` | eingebaute Standards | Welche Zeilen er zeigt (Titel, der Hinweis des Eintrags, die nötigen Stages), in welcher Reihenfolge, mit welchem Text und welcher Farbe. Am einfachsten im Layout-Editor unter **Slot Lock** im Config-Editor zu bearbeiten. |
| `showAllUntilComplete` | `true` | Solange mehrere Stages einen Slot sperren, alle mit ihrem Status auflisten, nicht nur die fehlenden. |

## `[notifications]` {/* #notifications */}

![Der Moment, in dem eine Stage aufgeht: ein Hinweis in der Ecke und eine Zeile im Chat](/img/ingame/unlock-toast.webp)

| Einstellung | Standard | Beschreibung |
| :--- | :--- | :--- |
| `broadcastChat` | `true` | Freischalt-Nachrichten an alle auf dem Server senden. |
| `unlockMessageFormat` | `"&aNew Era: {stage}"` | Format der globalen Freischalt-Nachricht. Kennt `{stage}` und `&`-Farbcodes. |
| `useActionbar` | `true` | Freischalt-Nachrichten in der Actionbar zeigen. |
| `useSounds` | `true` | Beim Freischalten einen Benachrichtigungs-Sound spielen. |
| `useToasts` | `true` | Beim Freischalten einen Toast wie bei Fortschritten zeigen. |
| `defaultStageIcon` | `"minecraft:book"` | Item, das als Toast-Symbol dient, wenn eine Stage kein eigenes `icon` angibt. |

## `[notifications.individual]` {/* #notificationsindividual */}

Dieselben fünf Einstellungen noch einmal, für Stages pro Spieler. Sie stehen unter `[notifications]` statt in einem eigenen Block, damit beide Reichweiten nebeneinander stehen.

| Einstellung | Standard | Beschreibung |
| :--- | :--- | :--- |
| `broadcastChat` | `true` | Individuelle Freischalt-Nachrichten an alle senden. |
| `unlockMessageFormat` | `"&a{player} unlocked: {stage}"` | Format der individuellen Freischalt-Nachricht. Kennt `{player}` und `{stage}`. |
| `useActionbar` | `true` | Actionbar-Nachricht bei einer individuellen Freischaltung. |
| `useSounds` | `true` | Sound bei einer individuellen Freischaltung. |
| `useToasts` | `true` | Toast bei einer individuellen Freischaltung. |

## `[lock_messages]` {/* #lock_messages */}

![Einen gesperrten Block benutzen](/img/ingame/message-block.webp)

![Mit einer gesperrten Kreatur interagieren](/img/ingame/message-creature.webp)

→ Siehe auch: [Verdeckte Anzeige](/wiki/stage-file/hidden-display).

Überschreibungen für die Actionbar- und Chat-Nachrichten, die ein Spieler sieht, wenn er mit gesperrtem Inhalt interagiert. Jede ist standardmäßig ein leerer String, der auf den eingebauten Übersetzungsschlüssel zurückfällt, also bleiben vorhandene Übersetzungen erhalten, solange nichts überschrieben wird. Überschreibungen kennen `&`-Farbcodes und seit 6.2.0 Platzhalter für das, worauf der Spieler gestoßen ist; die Tabelle nennt, welche jede Nachricht nimmt. Namen werden in der Sprache des Spielers eingesetzt und behalten die Farbe, die davor aktiv war. `{stage}` nennt nur die Stages, die genau diese Aktion blockieren, und zeigt `???` für eine Stage, die [ihre Sperr-Hinweise versteckt](/wiki/stage-file/hidden-display). Der Config-Editor bietet die Platzhalter als Chips neben jedem Feld an.

| Einstellung | Fällt zurück auf | Erscheint, wenn |
| :--- | :--- | :--- |
| `itemLocked` | `message.historystages.item_locked` | Mit einem gesperrten Item interagiert wird. Nimmt `{item}`, `{stage}`. |
| `fluidLocked` | `message.historystages.fluid_locked` | Eine gesperrte Flüssigkeit aus der Welt genommen wird. Nimmt `{fluid}`, `{stage}`. |
| `tradeLocked` | `message.historystages.trade_locked` | Ein Händler nach Anwendung der Handels-Sperren nichts mehr hat. |
| `blockLocked` | `message.historystages.block_locked` | Mit einem gesperrten Block interagiert wird. Nimmt `{block}`, `{stage}`. |
| `entityItemLocked` | `message.historystages.entity_item_locked` | Mit Rüstungsständern oder Rahmen mit gesperrten Items interagiert wird. Nimmt `{item}` (das angezeigte Item), `{stage}`. |
| `enchantmentLocked` | `message.historystages.enchantment_locked` | Eine gesperrte Verzauberung über Amboss oder Zaubertisch aufgetragen wird. Nimmt `{enchantment}`, `{item}`, `{stage}`. |
| `recipeLocked` | `message.historystages.recipe_locked` | Im Rezeptbuch auf ein gesperrtes Rezept geklickt wird. Nimmt `{item}` (was das Rezept herstellt), `{stage}`. |
| `dimensionUnknown` | `message.historystages.dimension_unknown` | Eine gesperrte Dimension betreten wird. Nimmt `{dimension}`, `{stage}`. |
| `mobUnknown` | `message.historystages.mob_unknown` | Ein gesperrter Mob angegriffen wird. Nimmt `{mob}`, `{stage}`. |
| `stageBlocked` | eingebauter Text | Eine Stage nicht freigeschaltet werden kann, weil ein [Logikbaustein](/wiki/stage-file/logic-blocks#blocked-while) sie blockiert. `{stage}` ist ihr Name. |
| `stageRevoked` | eingebauter Text, der den Grund nennt | Der Toast, wenn ein Baustein [Entziehen, wenn](/wiki/stage-file/logic-blocks#revoke-when) eine Stage wegnimmt. `{stage}` ist ihr Name. |

## `[stage_logic]` {/* #stage_logic */}

→ Erklärt unter [Logikbausteine](/wiki/stage-file/logic-blocks).

| Einstellung | Standard | Beschreibung |
| :--- | :--- | :--- |
| `blockedDisplay` | `REASON` | `REASON` listet die Bedingungen auf, die eine Stage blockieren (Podest, Graph, Tooltip); `PLAIN` sagt nur, dass sie blockiert ist. |
| `showInactiveCostHints` | `true` | Hinweise „Wäre günstiger, solange …“ für Kosten-Bausteine zeigen, deren Bedingung noch nicht zutrifft. Wirksame Kosten-Änderungen werden immer gezeigt. |
| `showRevokeWarningOnStage` | `true` | An einer Stage warnen, dass ein Baustein „Entziehen, wenn“ sie wieder wegnehmen kann (Rollen-Tooltip, Graph). |
| `showRevokeWarningOnTrigger` | `true` | An einer Stage warnen, deren Freischaltung dem Spieler eine Stage wegnehmen würde (Rollen-Tooltip, Podest). |

## `[scroll_tooltip]` {/* #scroll_tooltip */}

→ Erklärt unter [Forschungsrollen](/wiki/in-game-tools/research/scrolls#the-scroll-tooltip).

| Einstellung | Standard | Beschreibung |
| :--- | :--- | :--- |
| `lines` | eingebaute Standards | Geordnetes Layout des Tooltips der Forschungsrolle, pro Abschnitt. Siehe [Forschungssystem](/wiki/in-game-tools/research/scrolls#the-scroll-tooltip). |
| `hideFulfilledDependencies` | `false` | Abhängigkeiten, die der Spieler schon erfüllt, aus der Abhängigkeitsliste im Tooltip verstecken. |

## `[open_scroll]` {/* #open_scroll */}

→ Erklärt unter [Forschungsrollen](/wiki/in-game-tools/research/scrolls#the-open-scroll-document).

| Einstellung | Standard | Beschreibung |
| :--- | :--- | :--- |
| `tabStyle` | `"icons"` | Wie die Kapitel oben markiert werden: `"icons"` zeichnet ein kleines Tinten-Symbol pro Kapitel mit dem Namen beim Drüberfahren, `"words"` schreibt die Namen aus. |
| `chapters` | eingebaute Standards | Geordnetes Kapitel-Layout des [Dokuments der geöffneten Rolle](/wiki/in-game-tools/research/scrolls#the-open-scroll-document) (`overview`, `items`, `creatures`, `world`). |
| `lockedDisplay` | `"obscured"` | `"visible"` zeigt gesperrte Einträge normal; `"obscured"` zeigt sie als Silhouetten mit geschwärztem Namen. |
| `overviewBlocks` | eingebaute Standards | Welche Blöcke (`icon`, `title`, `description`, `counts`) auf der Übersichtsseite erscheinen und in welcher Reihenfolge. |
| `showSearch` | `true` | Eine Suchleiste zeigen. |
| `showEntryIds` | `true` | Die Registry-ID jedes Eintrags neben seinem Anzeigenamen zeigen. |
| `entrySort` | `"defined"` | `"defined"` behält die Reihenfolge aus der Stage; `"alphabetical"` sortiert nach Namen. |
| `inkHeading` | `#3F2D13` | Tinte für Überschriften. |
| `inkBody` | `#4A3416` | Tinte für Einträge und die Beschreibung. |
| `inkFaint` | `#7A5A2C` | Tinte für Gruppen-Überschriften, die Zeile mit den Anzahlen und den Blatt-Zähler. |
