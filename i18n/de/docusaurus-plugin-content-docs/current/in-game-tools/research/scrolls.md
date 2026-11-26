---
title: Forschungsrollen
description: "Das Item, das eine Stage ins Podest bringt, der Fortschritt, den es sich merkt, und das lesbare Dokument, zu dem eine geöffnete Rolle wird."
sidebar_position: 2
---

# Forschungsrollen {/* #research-scrolls */}

Eine Rolle ist das Item, das eine Stage ins [Podest](/wiki/in-game-tools/research/pedestal) bringt.
Sie trägt auch den Forschungs-Fortschritt, also merkt sich die Rolle und nicht der Block, wie weit ein
Spieler ist.

| Rolle | Was sie ist |
| :--- | :--- |
| **Stage-Rolle** | An eine Stage-ID gebunden. Sie zu erforschen schaltet diese Stage frei. |
| **Individuelle Rolle** | Per UUID an einen Spieler gebunden. Nur dieser Spieler kann sie erforschen; Tooltip und Podest-GUI zeigen den Namen des Besitzers, und für alle anderen ist der Slot ausgegraut. |
| **Kreativ-Rolle** | Schaltet alle Stages auf einmal frei. Zum Testen und für den Kreativmodus. |

## Was passiert, wenn die Forschung fertig ist {/* #what-happens-when-research-finishes */}

`defaultScrollCompletion` in [`[research]`](/wiki/server/config-files/gameplay-toml#research)
entscheidet, und eine Stage kann das mit ihrem eigenen `scroll_completion` überschreiben:

| Wert | Ergebnis |
| :--- | :--- |
| `consume` (Standard) | Die Rolle wird verbraucht. |
| `replace` | Eine frische Rolle für dieselbe Stage erscheint im Podest. |
| `open` | Eine **geöffnete Rolle** bleibt als Andenken zurück. |

## Der Rollen-Tooltip {/* #the-scroll-tooltip */}

![Eine Forschungsrolle listet, was ihre Stage vor der Forschung braucht](/img/ingame/tooltip-scroll.webp)

Der Tooltip lässt sich unter [`[scroll_tooltip]`](/wiki/server/config-files/visual-toml#scroll_tooltip)
in **visual.toml** komplett einstellen, und über einen eigenen Bildschirm im
[Config-Editor](/wiki/in-game-tools/in-game-editor).

Die Strings mit Trennstrichen unten sind nicht zum Tippen gedacht. Der
[Config-Editor](/wiki/in-game-tools/in-game-editor#the-config-editor) hat dafür einen Bildschirm:
Abschnitte als Zeilen, die du in die richtige Reihenfolge ziehst, mit ihren Schaltern und Farben
daneben und einer Live-Vorschau des fertigen Tooltips. Das Format steht hier, weil dieser Bildschirm es
schreibt und weil ein Server-Betreiber es am Ende vielleicht in der Datei liest.

Jeder Eintrag in `lines` ist ein String mit Trennstrichen:

```text
id|enabled|spacerBefore|style|text
```

| Teil | Bedeutung |
| :--- | :--- |
| `id` | Welchen Abschnitt die Zeile steuert. |
| `enabled` | Ob der Abschnitt überhaupt erscheint. |
| `spacerBefore` | Ob eine Leerzeile davor kommt. |
| `style` | Mit `+` verbundene Minecraft-Formatnamen, z. B. `gray+italic`. Leer nimmt die eingebaute Farbe. |
| `text` | Eigener Text, oder leer für die eingebaute Übersetzung. |

Der Item-Name steht immer zuerst und lässt sich nicht verschieben. Die Abschnitte, die sich umsortieren
**lassen**, sind `individual_badge`, `owner`, `info1`, `info2`, `tier` und `dependencies`.

Der Abhängigkeits-Block besteht aus eigenen Teil-Vorlagen, `dep.header`, `dep.group_header`,
`dep.item`, `dep.stage`, `dep.individual`, `dep.xp`, `dep.separator`, dazu Symbol- und Farb-Optionen
(`dep.icon_fulfilled`, `dep.icon_open`, `dep.icon_unknown`, `dep.color_fulfilled`, `dep.color_open`).

Unbekannte IDs werden ignoriert, und eine bekannte ID, die in der Liste fehlt, fällt auf ihren Standard
zurück. So funktioniert eine Config weiter, wenn spätere Versionen Abschnitte hinzufügen.

<details>
<summary>UND und ODER stehen an zwei verschiedenen Stellen</summary>

`dep.group_header` steht **über** einer Gruppe und sagt, wie die eigenen Einträge dieser Gruppe
verknüpft sind: *Alle davon* oder *Eines davon*. `dep.separator` steht **zwischen** Gruppen und sagt
immer UND, weil Gruppen immer mit UND verbunden sind.

Früher war das eine Zeile, die die Logik einer Gruppe in die Lücke vor der nächsten schrieb, und so sah
eine ODER-Gruppe aus, als gelte sie für alles danach. →
[Abhängigkeiten](/wiki/stage-file/dependencies#and-or-and-where-the-line-runs)

</details>

`hideFulfilledDependencies` lässt Zeilen weg, die der Spieler schon erfüllt hat, und zeigt nur, was noch
offen ist. Die Sichtbarkeit wird ausgerechnet, *bevor* eine abgeschaltete Zeile verschwindet, also
erfüllt ein erledigter Eintrag, dessen Zeile versteckt ist, trotzdem seine ODER-Gruppe.

## Das Dokument der geöffneten Rolle {/* #the-open-scroll-document */}

Eine erforschte Rolle, oder eine schon freigeschaltete, die ein Spieler öffnet, wird zu einer
**geöffneten Rolle**: einer GUI wie ein Buch, die die Stage vollständig beschreibt.

![Das Dokument der geöffneten Rolle](/img/screenshots/open-scroll.webp)

Sie hat eine Übersichtsseite und drei Kapitel: **Items**, **Kreaturen** und **Welt**. Oben sind sie mit
kleinen Tinten-Symbolen markiert, der Kapitelname erscheint beim Drüberfahren; `tabStyle = "words"` in
[`[open_scroll]`](/wiki/server/config-files/visual-toml#open_scroll) schreibt die Namen stattdessen aus.
Gesperrte Einträge werden standardmäßig als Silhouetten mit geschwärztem Namen gezeichnet
(`lockedDisplay = "obscured"`), mit `"visible"` ganz normal.

Das Kapitel **Welt** sammelt alles, was weder Item noch Kreatur ist:

| Gruppe | Inhalt |
| :--- | :--- |
| Dimensionen, Strukturen, Biome | Wie in der Stage aufgeführt. |
| Zonen | Nach Namen. Eine Zone ohne Namen hat nichts zu zeigen und fehlt; derselbe Name in zwei Welten erscheint einmal. |
| Flüssigkeiten | Unter ihrem echten Namen im Spiel statt ihrer Registry-ID. |
| Händler-Berufe | Der Beruf, mit den gesperrten Stufen. |
| Handels-Angebote | Einzelne Angebote. Händler, Preis und Stufen stehen im Tooltip; ein Angebot für jeden Händler sagt das. |
| Händlerstufen | Stufen, die für jeden Beruf auf einmal gesperrt sind. |

Eine Gruppe ohne Inhalt bekommt gar keine Überschrift.

**Rezepte, Mods, Mod-Ausnahmen und Addon-Kategorien fehlen absichtlich.** Eine Rolle beschreibt für
Spieler, was eine Stage zurückhält, und diese vier sind Begriffe für Modpack-Autoren, nichts, worauf ein
Spieler zeigen kann.

Kapitel, Layout der Übersicht, Suche, Eintrags-IDs, Sortierung und die Tintenfarben der Seiten stellst
du unter [`[open_scroll]`](/wiki/server/config-files/visual-toml#open_scroll) in **visual.toml** ein.
Wie stark die Welt hinter der Seite abgedunkelt wird, regelt `openScrollBackdrop` in
[`[visuals]`](/wiki/server/config-files/visual-toml#visuals).

### Vom Lesepult lesen {/* #reading-from-a-lectern */}

Eine geöffnete Rolle lässt sich wie ein Buch auf ein **Lesepult** legen, und ein Rechtsklick auf das
Pult öffnet dasselbe Dokument direkt vom Block aus, praktisch für Bibliotheken oder Archive. Sperren
gelten weiterhin: Ein Lesepult in einem gesperrten Bereich lässt sich erst lesen, wenn dieser Bereich
offen ist.

### Wieder versiegeln {/* #resealing */}

Eine geöffnete Rolle lässt sich über ein Rezept `reseal_scroll` wieder zu einer versiegelten
Forschungsrolle herstellen, gesteuert durch `enableScrollResealing` in
[`[research]`](/wiki/server/config-files/gameplay-toml#research).

Das Herstellen folgt der Einstellung sofort, aber JEI und EMI bauen ihre Rezeptlisten beim Start auf,
also erscheint oder verschwindet der Eintrag im Rezept-Browser erst nach einem Neustart.

## Rollenregale {/* #scroll-shelves */}

Ein gemeißeltes Bücherregal für Forschungsrollen, in elf Holzarten von Eiche bis Wirrholz. Es fasst
sechs Rollen:<Since v="6.1.0" />

- Klick mit einer Rolle auf einen Slot, um sie hineinzulegen, mit leerer Hand, um sie herauszunehmen.
- Ein Komparator liest den zuletzt benutzten Slot; Trichter können es füllen und leeren.
- [Jade](/wiki/server/mod-compatibility#jade) nennt die Rolle in dem Slot, den du anschaust.

Forschungs- und Kreativ-Rollen passen hinein, geöffnete Rollen nicht. Das Item-Tag
`historystages:scroll_shelf_scrolls` entscheidet, was passt, also kann ein Modpack mehr hinzufügen.

Hergestellt wie das gemeißelte Bücherregal, aus Brettern und Stufen einer Holzart, mit **Papier in der
Mitte**, damit sich die beiden Rezepte nicht in die Quere kommen. Anders als das Vanilla-Regal droppt
es immer sich selbst, mit oder ohne Behutsamkeit.

## Eine Rolle per Befehl geben {/* #giving-a-scroll-by-command */}

Zum Testen oder als Quest-Belohnung:

```text
/give @s historystages:research_scroll[minecraft:custom_data={StageResearch:"bronze_age"}]
```

Ersetze `bronze_age` durch die Stage-ID. In Versionen vor 1.20.5 gilt stattdessen die ältere
NBT-Schreibweise:

```text
/give @s historystages:research_scroll{StageResearch:"bronze_age"}
```

## Siehe auch {/* #see-also */}

- [Rollen & Podeste beschaffen](/wiki/in-game-tools/research/obtaining): echte Rezepte für KubeJS,
  CraftTweaker, Datapacks und FTB Quests.
- [Forschungspodest](/wiki/in-game-tools/research/pedestal): wo die Rolle hinkommt.
- [visual.toml](/wiki/server/config-files/visual-toml#scroll_tooltip): die vollständigen
  Einstellungs-Blöcke.
