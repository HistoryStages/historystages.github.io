---
title: Mod-Kompatibilität
description: "Die Mods, die History Stages erkennt, und was jede Anbindung tut: Rezept-Browser, FTB Quests, Jade, Curios und das Pflicht-Lootr."
sidebar_position: 4
---

# Mod-Kompatibilität {/* #mod-compatibility */}

History Stages erkennt eine Reihe verbreiteter Mods und passt sein Verhalten an, wenn sie da sind.
**Nichts davon muss eingestellt werden**: Installier die Mod, und die Anbindung ist an.

:::info[Auf Minecraft 26.2]
EMI, FTB Quests, FTB Teams, KubeJS, CraftTweaker und Accessories gibt es noch nicht für 26.2, also hat
die 26.2-Beta keine ihrer Anbindungen. Sie kommen zurück, sobald diese Mods aktualisieren. JEI, Jade,
Lootr, Spell Engine, Better Combat und Curios (NeoForge) funktionieren auf 26.2.
:::

Eine davon ist nicht freiwillig: **[Lootr](https://modrinth.com/mod/lootr) ist Pflicht**, und History
Stages lädt ohne es nicht. → [Warum](/wiki/locking/items-and-recipes/loot#chest-loot-goes-through-lootr)

## Rezept-Browser: JEI und EMI {/* #recipe-viewers--jei-and-emi */}

![Ein gesperrtes Rezept in JEI](/img/ingame/jei-locked-recipe.webp)

Installier einen von beiden; beide bekommen das Schloss-Overlay, und beide können verstecken.

Gesperrte Rezepte bekommen ein Schloss-Overlay, statt zu verschwinden, damit Spieler sehen, dass es
Fortschritt gibt, statt sich zu fragen, wo ein Rezept hin ist. Gesperrte Items tragen dasselbe Schloss
in Inventaren und in der Zutatenliste.

Zwei Einstellungen machen daraus echtes Verstecken: `hideLockedItemsInJei` entfernt gesperrte Items aus
der Zutatenliste, `hideLockedRecipesInJei` versteckt gesperrte Rezepte. Trotz der Namen gelten beide auch
für EMI. → [Rezepte](/wiki/locking/items-and-recipes/recipes#what-players-see)

Die beiden Browser verstecken nicht ganz dieselben Rezepte. JEI erfasst nur Vanilla-Rezeptarten, und
nur über ihr Ergebnis. EMI versteckt jedes Rezept, das das Schloss-Overlay markieren würde: ein
gesperrtes Ergebnis, eine Rezept-ID, die in einer Stage steht, und ein Rezept, das eine gesperrte
Flüssigkeit herstellt oder verbraucht. Die Drop- und Loot-Seiten von JER bleiben in EMI sichtbar, auch
wenn ein Drop darauf gesperrt ist.

[Forschungs-Booster](/wiki/in-game-tools/research/pedestal#boosters)-Blöcke sind als eigene
Rezept-Kategorie angemeldet, damit Spieler nachschauen können, welche Blöcke die Forschung beschleunigen
und um wie viel.

## FTB Quests {/* #ftb-quests */}

History Stages bringt eigene Aufgaben- und Belohnungs-Arten **History Stage** direkt in den
FTB-Quests-Editor.

Beide wählen ihr Ziel über eine durchsuchbare Stage-Auswahl statt über eine getippte ID, was in einem
Modpack mit hundert Stages zählt. Das Questbuch zeigt den eingestellten Anzeigenamen und das eigene
Symbol jeder Stage.

Aufgaben reagieren auf Ereignisse und erledigen sich selbst, wenn die Stage freigeschaltet wird. Ein
Schalter `negate` dreht die Bedingung um, dann ist die Aufgabe erledigt, wenn die Stage *gesperrt* ist.
Der Fortschritt einer Aufgabe setzt sich von selbst zurück, wenn die Stage wieder gesperrt wird.

Belohnungen können eine Stage freischalten oder wieder sperren. Zusammen mit dem
[Modus `external`](/wiki/stage-file/stage-modes#external) ist das der übliche Weg, den Fortschritt ganz
in die Hand des Questbuchs zu legen.

## FTB Teams {/* #ftb-teams */}

Eine individuelle Stage mit eingeschaltetem **Im Team teilen** wird innerhalb einer FTB-Teams-Party
geteilt: Ein Spieler schaltet sie frei, die ganze Party hat sie. Ab 6.1.0, noch nicht auf 26.2. →
[Mit einem Team teilen](/wiki/start-here/global-vs-individual#sharing-with-a-team)

## Jade {/* #jade */}

![Jade nennt die Stage, die ein gesperrter Block braucht](/img/ingame/jade-locked-block.webp)

Schaut ein Spieler auf einen Block, eine Kreatur, einen Rüstungsständer oder einen Rahmen, den History
Stages gesperrt hat, nennt Jade die Stage, die er braucht. Ein
[getarnter](/wiki/locking/items-and-recipes/disguises) Block erscheint als seine Tarnung, und die Rolle in
einem Slot eines [Rollenregals](/wiki/in-game-tools/research/scrolls#scroll-shelves) wird genannt, wenn
du ihn anschaust. → [`[jade]`](/wiki/server/config-files/visual-toml#jade-requires-jade)

## Lootr, Pflicht {/* #lootr--required */}

Gibt jedem Spieler seine eigene Sicht auf einen Behälter, und nur deshalb ist Loot-Filterung pro Spieler
überhaupt möglich. Ein Vanilla-Behälter ist geteilt: ein Wurf, und wer ihn zuerst öffnet, nimmt, was
drin ist. → [Loot](/wiki/locking/items-and-recipes/loot)

## Spell Engine und Better Combat {/* #spell-engine-and-better-combat */}

Ein Item, das für einen Spieler gesperrt ist, gilt als **wirkungslos**: Es macht keinen Zauberschaden und
kann keinen Better-Combat-Angriff starten.

Ohne das wäre jede der beiden Mods ein Weg um die normale Benutzungs-Sperre herum: Das Item geht nie
durch den Vanilla-Benutzungsweg, an dem History Stages ansetzt, also würde eine gesperrte Waffe einfach
weiter als Waffe funktionieren.

## Curios und Accessories {/* #curios-and-accessories */}

Beide erweitern die Item-Sperre auf Accessoire-Slots, damit sich ein gesperrtes Item nicht als
Schmuckstück, Ring oder Gürtel anlegen lässt.

**Curios** gibt es nur für Forge und NeoForge, nicht für Fabric. **Accessories** meldet einen
`CanEquipCallback` an, der dieselbe Aufgabe erledigt, mit derselben Actionbar-Rückmeldung wie
anderswo, und deckt auch Vanilla-Rüstungs-Slots ab, die über seine eigene Behälter-Oberfläche gezeichnet
werden.

Auf 26.2 ist nur Curios abgedeckt. Accessories gibt es noch nicht für 26.2, also gibt es auf Fabric 26.2
keine Accessoire-Slots zum Sperren.

## KubeJS und CraftTweaker {/* #kubejs-and-crafttweaker */}

Skripte können den Stage-Zustand lesen, ändern und darauf reagieren, wenn er sich ändert. Sie können
keine Stages *anlegen* oder entscheiden, was eine Stage sperrt; das bleibt im Editor und in den
Stage-Dateien.

Das funktioniert nur auf NeoForge 1.21.1 und Forge 1.20.1. Keine der beiden Mods hat eine Fabric-Version
für 1.21.1, also hat die Fabric-Version von History Stages keine Skript-Anbindung, und keine der beiden
gibt es schon für 26.2.

Groß genug für eigene Seiten: → [Skripte](/wiki/server/scripting)

## Flüssigkeits-Sperren und die Tanks anderer Mods {/* #fluid-locks-and-other-mods-tanks */}

Eine [Flüssigkeits-Sperre](/wiki/locking/items-and-recipes/fluids) reicht weiter in andere Mods hinein als die meisten Sperr-Arten, also lohnt es sich zu wissen, wo sie aufhört.

**Was sie erreicht:** jedes Item, das meldet, was es enthält. Das sind der Vanilla-Eimer, jeder Mod-Eimer und jedes gefüllte Tank-Item im Modpack, ohne dass eine einzige Item-ID aufgelistet wird. Sie erreicht auch die Rezepte: Eine Flüssigkeit zu sperren nimmt jedes Rezept, das sie herstellt oder verbraucht, aus dem Herstellen und aus dem Rezept-Browser, auch Rezepte, die zu Maschinen anderer Mods gehören.

**Was sie nicht erreicht:**

- **Pumpen, Rohre und platzierte Tanks.** Ein Spieler, der die Flüssigkeit schon in einem Tank hat, kann sie weiter bewegen. Das zu sperren hieße, den Blöcken anderer Mods ihre Flüssigkeits-Schnittstelle wegzunehmen, und das stürzt in fremdem Code ab und lässt sich von außen nicht abfangen. In der Praxis spielt es selten eine Rolle, denn ohne Rezepte und Eimer gibt es keinen Weg, den ersten Tank zu füllen.
- **Fremde Anzeigenamen.** Eine Namens- oder Tooltip-Überschreibung an einem Flüssigkeits-Eintrag wird auf das Behälter-Item angewendet, also zeigen die Tank-GUI einer anderen Mod und die Tank-Anzeige von Jade weiter den echten Namen der Flüssigkeit.

## Deine eigene Mod mit History Stages verbinden {/* #making-your-own-mod-work-with-history-stages */}

Du schreibst eine Mod statt eines Modpacks? Zwei Einstiege:

- **[Stage State & Events](/api/stage-state-and-events)**: den Stage-Zustand lesen und ändern und darauf
  reagieren, wenn er sich ändert. Das brauchst du, wenn deine Mod nur über Stages *Bescheid wissen* muss.
- **[Addon-Entwicklung](/api/addon-development)**: eigene gesperrte Inhalte, Anforderungen,
  Auto-Auslöser, Einstellungen pro Stage und Config-Abschnitte anmelden, jeweils mit eigenem Reiter im
  Editor im Spiel. Jeder Loader, ab 6.0.0.
