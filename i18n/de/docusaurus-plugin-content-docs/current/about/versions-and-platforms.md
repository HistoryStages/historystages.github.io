---
title: Versionen & Plattformen
description: "Welche Mod-Version auf NeoForge, Forge und Fabric läuft und welche Funktionen jede davon hat."
sidebar_position: 1
---

# Versionen & Plattformen {/* #versions--platforms */}

History Stages läuft auf drei Mod-Loadern. Neue Funktionen kommen zuerst auf NeoForge 1.21.1; die
anderen folgen, wenn sie folgen.

| Loader | Minecraft | Version |
| :--- | :--- | :--- |
| **NeoForge** | 1.21.1 | 6.2.x |
| **Forge** | 1.20.1 | 6.2.x, mit den Unterschieden unten |
| **Fabric** | 1.21.1 | 6.2.x, mit den Unterschieden unten |
| **NeoForge** und **Fabric** | 26.2 | 6.2.x, Beta, mit den Unterschieden unten |

Die Versionen für 1.19.X werden nicht mehr aktualisiert.

Die rechte Spalte ist die **Versionslinie**, nicht der genaue Build, also welcher Stand der Dokumentation
für dich gilt. Die genaue Patch-Version ändert sich mit jedem Release, deshalb steht sie absichtlich
nicht hier, wo sie still veralten würde; die Download-Seiten haben sie:
[CurseForge](https://www.curseforge.com/minecraft/mc-mods/history-stages) ·
[Modrinth](https://modrinth.com/mod/history-stages) ·
[GitHub-Releases](https://github.com/Flix100000/History-Stages/releases).

Diese Seiten beschreiben 6.2.x, die Linie aller Loader, die 26.2-Beta eingeschlossen. Du bist auf einem
älteren Build? Wähl deine Linie im Versionsmenü oben in der Leiste.

## Was 6.2 hinzugefügt hat {/* #what-62-added */}

- [Slots](/wiki/locking/items-and-recipes/slots): Inventar- und Behälter-Slots, die geschlossen,
  versteckt oder abgedeckt bleiben, bis eine Stage offen ist.
- [Pflanzen](/wiki/locking/world/plants): Feldfrüchte und Setzlinge, die nicht wachsen und Knochenmehl
  ablehnen.
- [NBT-Varianten](/wiki/locking/items-and-recipes/nbt-and-components#several-variants-any-one-is-enough):
  mehrere Kriterien an einem Item-, Tag-, Ausnahme- oder Podest-Eintrag, von denen eins reicht.
- [Kreaturen nach NBT](/wiki/locking/creatures-and-trade/entities-and-spawns#only-some-creatures-of-a-type):
  Angriffs- und Interaktions-Sperren, die nur manche Kreaturen einer Art treffen, und Boote und Loren in
  der Interaktions-Liste.
- [Platzhalter](/wiki/server/config-files/visual-toml#lock_messages) in den Überschreibungen der
  Sperr-Nachrichten, und ein [Schalter für das JEI/EMI-Schloss-Overlay](/wiki/server/config-files/visual-toml#jei_hiding)
  mit Kategorien, die in Ruhe gelassen werden.
- Einträge von [Mods, die nicht mehr installiert sind](/wiki/in-game-tools/in-game-editor#managing-stages),
  erscheinen im Editor rot und lassen sich auf einmal entfernen.
- Eine Stage-Änderung [friert den Server nicht mehr ein](/wiki/server/stage-change-reload) durch einen
  vollen Datapack-Reload.
- [`SlotLockQuery`](/api/lock-categories#slots-slotlockquery) und NBT-Varianten in der [Addon-API](/api/).

## Was 6.1 hinzugefügt hat {/* #what-61-added */}

- [Austauschbare Stages](/wiki/stage-file/interchangeable-stages): mehrere Stages, die dasselbe sperren,
  wobei eine davon reicht.
- [Logikbausteine](/wiki/stage-file/logic-blocks): eine Stage, die abhängig von anderen Stages
  blockiert, versteckt, günstiger oder entzogen wird.
- [Wieder sperren](/wiki/stage-file/relocking): der Modus „Solange“ und Sperr-Auslöser, damit eine
  Stage wieder zugehen kann.
- [Teilen im Team](/wiki/start-here/global-vs-individual#sharing-with-a-team): individuelle Stages,
  die innerhalb einer FTB-Teams-Party geteilt werden.
- [Verzauberungen & Effekte](/wiki/locking/items-and-recipes/enchantments-and-effects): zwei neue
  Sperr-Kategorien.
- [Tarnungen](/wiki/locking/items-and-recipes/disguises): gesperrte Items und Blöcke, die wie etwas
  anderes aussehen.
- [Fixierte Sperr-Aktionen](/wiki/locking/items-and-recipes/unlock-actions#fixing-actions-for-a-whole-stage)
  für eine ganze Stage, [Rollenregale](/wiki/in-game-tools/research/scrolls#scroll-shelves),
  [Rezepte mit einem Item](/wiki/locking/items-and-recipes/recipes#recipes-using-an-item) und ein
  überarbeiteter [Graph-Editor](/wiki/in-game-tools/stage-graph).
- Eine viel größere [Addon-API](/api/).

Die Zonen-Karte hat in 6.1 ihre 3D-Ansicht verloren. Auf jedem Loader ist sie jetzt die Ansicht von oben.

## Was Forge 1.20.1 anders macht {/* #what-forge-1201-does-differently */}

Die 1.20.1-Version ist auf 6.2.x und hat alle Funktionen von 6.2. Vier Dinge verhalten sich anders,
weil 1.20.1 selbst es tut:

- **Eine gesperrte Flüssigkeit wird an den Vanilla-Kesseln für Wasser und Lava abgelehnt.** Ein Kessel
  aus einer Mod wird nicht erkannt, denn 1.20.1 hat keine Registry, in der man ihn nachschlagen könnte.
- **Sobald ein KubeJS-Skript Rezepte hinzufügt, beendet KubeJS das Laden der Rezepte vorzeitig**, also
  läuft der Bericht über gesperrte Rezepte, die nicht geladen sind, in solchen Modpacks nicht. Die
  Sperren selbst sind nicht betroffen.
- **MixinExtras steckt im Jar**, weil Forge 1.20.1 es nicht mitbringt. Du musst nichts extra
  installieren.
- **Der NBT-Editor für Kreaturen bietet keine Wolfs-Varianten an**, weil Wölfe erst in einer späteren
  Minecraft-Version Varianten bekommen haben. Alle anderen Vorlagen sind da.

## Was Fabric 1.21.1 anders macht {/* #what-fabric-1211-does-differently */}

Die Fabric-Version ist ebenfalls auf 6.2.x und hat alle Funktionen von 6.2. Gleiche Minecraft-Version wie NeoForge, also kommen die
Unterschiede vom Loader und davon, welche Mods es dafür gibt:

- **Es gibt keine Skripte.** KubeJS hat keine Fabric-Version für 1.21.1 und CraftTweaker überhaupt
  keine, also gibt es nichts, womit ein Skript reden könnte. Den Stage-Zustand aus Code lesen, ändern
  und darauf reagieren geht stattdessen über die [API](/api/). → [Skripte](/wiki/server/scripting)
- **Rüstungs-Sperren decken Accessories statt Curios ab.** Curios gibt es auf Fabric nicht. →
  [Mod-Kompatibilität](/wiki/server/mod-compatibility#curios-and-accessories)
- **Ein Addon meldet sich über Entrypoints in seiner `fabric.mod.json` an**, nicht über einen Mod-Bus.
  Was es anmelden kann, ist dasselbe. → [Addon-Entwicklung](/api/addon-development#on-fabric)
- **Einstellungen aus 5.2 werden nicht übernommen.** Die Fabric-Version 5.2 hat sie in einer
  `config.json` gespeichert, die 6.0 nicht liest. →
  [Von 5.x aktualisieren](/wiki/server/upgrading-from-5x#coming-from-fabric-52)
- **Slot-Sperren erreichen andere Mods über die Fabric Transfer API.** Rohre, Maschinen und
  „Give“-Helfer, die Items auf diesem Weg bewegen, werden an einem gesperrten Slot abgewiesen. Ein
  Mod-Slot, der die Frage „darf das hier rein?“ ganz allein beantwortet, ohne den Slot zu fragen, auf
  dem er aufbaut, ist nicht abgedeckt. → [Slots](/wiki/locking/items-and-recipes/slots)
- **Der Drygmy-Fix für Ars Nouveau fehlt hier**, weil es Ars Nouveau für Fabric 1.21.1 nicht gibt.

Eine Sache funktioniert hier besser als auf Forge 1.20.1: Eine gesperrte Flüssigkeit wird auch an
Kesseln aus Mods abgelehnt, nicht nur an den Vanilla-Kesseln für Wasser und Lava.

## Was 26.2 anders macht {/* #what-262-does-differently */}

26.2 ist ein Build für NeoForge und Fabric. Es ist in der Beta und hat alle Funktionen von 6.2, außer den
Anbindungen, deren Mods es noch nicht für 26.2 gibt:

- **Architectury API ist Pflicht** auf beiden Loadern, neben Lootr (und Fabric API auf Fabric). →
  [Installation](/wiki/start-here/installation#what-you-need-alongside-it)
- **Noch nicht auf 26.2:** EMI, FTB Quests, FTB Teams, KubeJS, CraftTweaker, Accessories und der Fix für
  FastSuite. Auf 26.2 gibt es also vorerst kein [Teilen im Team](/wiki/start-here/global-vs-individual#sharing-with-a-team),
  keine Quest-Aufgaben oder -Belohnungen und keine [Skripte](/wiki/server/scripting). Sie kommen zurück,
  sobald diese Mods aktualisieren.
- **JEI** gibt es für 26.2 nur als Beta, und History Stages ist gegen diese Beta gebaut. Der
  [Schalter für das Sperr-Overlay](/wiki/server/config-files/visual-toml#jei_hiding) und die
  ausgenommenen Kategorien funktionieren für JEI; für EMI kommen sie mit EMI.
- **Jede Holzart ist ein eigener Boot-Typ.** Seit 1.21.2 ist ein Eichenboot `minecraft:oak_boat`, ein
  Bambusfloß `minecraft:bamboo_raft`. Du wählst die Holzarten also direkt aus, die Abkürzung
  **Holzarten** gibt es nicht. Ein Eintrag `minecraft:boat` oder `minecraft:chest_boat` aus einer
  Stage-Datei von 1.21.1 wird als die Boote aller Holzarten gelesen, oder der Holzarten, die sein
  NBT-Filter über `Type` nennt. →
  [Nur manche Kreaturen einer Art](/wiki/locking/creatures-and-trade/entities-and-spawns#only-some-creatures-of-a-type)
- **Slot-Sperren erreichen andere Mods über die Transfer-API des Loaders**, die von NeoForge oder die
  von Fabric. Auf NeoForge sind Mod-Slots auf Basis seines Item-Slots mit abgedeckt; auf Fabric ist ein
  Mod-Slot, der „darf das hier rein?“ ganz allein beantwortet, nicht abgedeckt. →
  [Slots](/wiki/locking/items-and-recipes/slots)
- **Der Drygmy-Fix für Ars Nouveau fehlt hier**, weil es Ars Nouveau für 26.2 nicht gibt.
- **Rüstungs-Sperren in Accessoire-Slots** funktionieren auf NeoForge über Curios. Auf Fabric gibt es
  noch keine Accessoire-Mod, an die man sich hängen könnte. →
  [Mod-Kompatibilität](/wiki/server/mod-compatibility#curios-and-accessories)
- **Handel ist in 26.2 nur über Datapacks definiert.** Ein Händler, der einen eigenen Bildschirm statt
  des normalen Handelsfensters nutzt, wird nicht gefiltert.
- **Ein Addon meldet sich über den eigenen Event-Bus von History Stages an**, auf beiden Loadern, nicht
  über den von NeoForge. → [Addon-Entwicklung](/api/addon-development#on-minecraft-262)

## Wie dieses Wiki versioniert ist {/* #how-this-wiki-is-versioned */}

Das Versionsmenü schneidet nach **Mod-Version, nicht nach Minecraft-Version**. Es gibt neun Stände: den
lebenden Baum 6.2.x und acht Archive, 6.1.x bis 5.0.x. Die Archive werden von Suchmaschinen
ferngehalten, sind aber im Versionsmenü und im Suchfeld weiter da.

Weiter zurück als 5.0.x geht es nicht, weil das Wiki selbst erst im April 2026 angefangen hat. 5.1 hat
nie eine eigene Dokumentation bekommen und ist durch den Stand 5.0.x abgedeckt.

**Die Archive sind Wort für Wort von damals.** Fehler, die damals darin standen, stehen immer noch
darin; eine Momentaufnahme, die man hinterher korrigiert, ist keine Momentaufnahme mehr. Zwei Dinge
wurden herausgenommen: die Behauptung, das Wiki sei „immer auf dem Stand der neuesten Version“, die in
einem Archiv zur Lüge wird, und die Seiten zur Addon-API in 5.6.x, die eine Schnittstelle beschrieben, die
es in dieser Version noch nicht gab.

Der Reiter **API** ist nicht versioniert. Er beschreibt die aktuelle Addon-Schnittstelle. Ihre Grundlage
gibt es auf jedem Loader ab 6.0.0; die Teile, die in 6.1.0 oder 6.2.0 dazukamen, sagen das oben in ihrem
Abschnitt.

## Auf einen Loader oder eine Version portieren, die nicht aufgeführt ist {/* #porting-to-a-loader-or-version-that-is-not-listed */}

Unter Bedingungen erlaubt. → [Portieren & Erlaubnis](/wiki/about/porting)

## Downloads {/* #downloads */}

[CurseForge](https://www.curseforge.com/minecraft/mc-mods/history-stages) ·
[Modrinth](https://modrinth.com/mod/history-stages) ·
[GitHub-Releases](https://github.com/Flix100000/History-Stages/releases)
