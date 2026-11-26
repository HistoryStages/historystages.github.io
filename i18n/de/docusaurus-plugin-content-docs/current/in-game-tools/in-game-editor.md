---
title: Editor im Spiel
description: "Die Stages eines ganzen Modpacks aus dem Pausemenü bauen: Reiter, Auswahllisten, Rechtsklick-Menüs und was jedes davon schreibt."
sidebar_position: 1
---

# Editor im Spiel {/* #in-game-editor */}

Alles, was eine Stage-Datei enthalten kann, lässt sich stattdessen hier bauen, ohne das Spiel zu
verlassen. Der Editor schreibt dasselbe JSON in dieselben Ordner, also kann ein Modpack im Editor
angefangen und von Hand fertiggestellt werden, oder umgekehrt.

![Der Stage-Editor im Spiel](/img/screenshots/in-game-editor.webp)

## Öffnen {/* #opening-it */}

Berechtigungsstufe 2, im Einzelspieler oder auf einem Server. Entweder der **Knopf „History Stages“ im
Pausemenü** oder `/history editor`.

Der Knopf im Pausemenü lässt sich mit `showEditorButton` in
[`[visuals]`](/wiki/server/config-files/visual-toml#visuals) ausblenden; der Befehl funktioniert für
Operatoren trotzdem.

## Stages verwalten {/* #managing-stages */}

![Die Editor-Übersicht: jede Stage mit ihrem Zustand und einem Knopf zum Freischalten oder Sperren](/img/editor/overview.webp)

Die **Stage-Übersicht** ist die Startseite: Stages anlegen, bearbeiten, kopieren und löschen. Eine
neue Stage fragt gleich nach ihrem Anzeigenamen.

**Stage-Einstellungen** ist ein eigener Bildschirm für die Metadaten der Stage, also ID, Anzeigename
und Forschungszeit, getrennt von den Sperr-Einträgen, damit sich beides nicht gegenseitig im Weg
steht. Er enthält auch die
[Podest-Stufe pro Stage](/wiki/in-game-tools/research/pedestal#tier-gating-per-stage)
(`min_pedestal_tier`, `pedestal_tier_mode`), den Modus mit seinen
[Sperr-Auslösern](/wiki/stage-file/relocking) und die Karten unten:

- **Sperren**: der Schalter [Austauschbar](/wiki/stage-file/interchangeable-stages) und die Zeilen, die
  [Sperr-Aktionen für die ganze Stage fixieren](/wiki/locking/items-and-recipes/unlock-actions#fixing-actions-for-a-whole-stage).
- **Individuell**: [Bei Tod verlieren](/wiki/start-here/global-vs-individual#lose-on-death) und
  [Im Team teilen](/wiki/start-here/global-vs-individual#sharing-with-a-team), nur bei individuellen
  Stages.

**Logik**, der Knopf neben Einstellungen und Abhängigkeiten, öffnet die
[Logikbausteine](/wiki/stage-file/logic-blocks) der Stage. Seine Beschriftung zählt sie mit:
`Logik (2)`.

Der **Organisieren-Modus**, ebenfalls in der Übersicht, ist für große Modpacks: Hak mehrere Stages und
[Ordner](/wiki/start-here/where-stage-files-live#folders) an und zieh sie in einem Rutsch in einen
Zielordner. Wird ein Ordner verschoben, kommt sein Inhalt mit.

**Tarnungen** im Kopfmenü der Übersicht listet jede
[Tarnungs-Regel](/wiki/locking/items-and-recipes/disguises) im Modpack, mit ihrem Aussehen, ihren Drops
und den Stages, die sie sperren.

**Unbekannte Einträge entfernen**, im selben Kopfmenü, räumt auf, nachdem eine Mod das Modpack
verlassen hat. Ihre Einträge bleiben in den Stage-Dateien und sperren nichts, und seit 6.2.0 werden
sie im Stage-Editor **rot** angezeigt. Das Menü entfernt sie auf einmal aus jeder Stage, nach einer
Bestätigung, die die Anzahl nennt, und speichert sofort. Innerhalb einer Stage tut ein Knopf
**Unbekannte entfernen** dasselbe nur für diese Stage und wartet, bis du speicherst. Eine fehlende Mod zu
entfernen nimmt ihre verknüpften Kreaturen, Strukturen, Biome und Ausnahmen mit. Tags und Rezepte von
Mods, die noch installiert sind, bleiben unberührt.

**Freischalten pro Spieler** sitzt ebenfalls dort: Eine individuelle Stage für einen Spieler, der
online ist, oder für alle, die online sind, freischalten oder wieder sperren, ohne
[`/history individual unlock`](/wiki/server/commands) zu tippen. Es läuft über denselben Weg auf dem
Server wie der Befehl (Sync, Benachrichtigungen, Aufräumen der Items beim Wiedersperren), verhält sich
also genauso. Es erreicht nur Spieler, die in dem Moment online sind.

## Auswählen, was gesperrt wird {/* #picking-what-to-lock */}

![Die Item-Auswahl, die die echte Registry liest](/img/editor/item-picker.webp)

**Durchsuchbare Auswahllisten** für Items, Flüssigkeiten, Rezepte, Kreaturen, Dimensionen, Biome,
Strukturen und Dorfbewohner-Angebote. Eine Such- und Filterleiste für alle, Durchblättern der ganzen
Registry oder Auswahl direkt aus deinem eigenen Inventar, und ein Mehrfachauswahl-Modus mit einem
Reiter **Gewählt** für viele auf einmal.

Weil sie die echte Registry lesen, kann eine Auswahl keine ID erzeugen, die es nicht gibt. Das ist der
Hauptgrund, den Editor für alles zu nehmen, was über eine Handvoll Einträge hinausgeht.

**Rechtsklick ist der Weg, einen Eintrag zu bearbeiten, der schon in einer Liste steht.** Die Auswahl
fügt nur hinzu; alles danach, also NBT-Kriterien, Sperr-Aktionen, eine Spawn-Regel, eine
Generierungs-Grenze, ID kopieren und wieder entfernen, steht im Kontextmenü, das sich per Rechtsklick
öffnet. Welche Punkte erscheinen, hängt vom Reiter ab:

| Menüpunkt | Wo er erscheint |
| :--- | :--- |
| **NBT bearbeiten** | Items, Tags, Ausnahmen, Handel |
| **Rezepte mit diesem Item** | Items → [Rezepte](/wiki/locking/items-and-recipes/recipes#recipes-using-an-item) |
| **Tarnung** | Items, Tags → [Tarnungen](/wiki/locking/items-and-recipes/disguises) |
| **Sperr-Aktionen** | Items, Tags, Mods, Fluide, Verzauberungen, Trank-Effekte |
| **Gesperrt ab Stufe**, **Gilt für** | Verzauberungen, Trank-Effekte → [Verzauberungen & Effekte](/wiki/locking/items-and-recipes/enchantments-and-effects) |
| **Text überschreiben** | Items, Tags, Mods, Fluide, aber nur, solange die Karte „Anzeige“ der Stage auf *ersetzen* steht |
| **Generierung** | Strukturen, nur bei globalen Stages |
| **SpawnControl** | Spawn |
| **Interaktions-Aktionen**, **Item-Filter** | Interaktion |
| **Händlerstufen** | Handels-Berufe |
| **Bearbeiten** | Mods und Zonen |
| **ID kopieren**, **Entfernen** | überall |

Zwei davon fehlen ganz, statt ausgegraut zu sein, und das wirkt beim ersten Mal wie ein Fehler.
**Text überschreiben** fehlt, bis `hidden_display` tatsächlich einen Namen oder Tooltip ersetzt; sonst
gibt es nichts zu überschreiben. **Generierung** fehlt bei einer individuellen Stage, weil sich die
Weltgenerierung nicht pro Spieler sperren lässt.

Ein installiertes Addon hängt seine eigenen Punkte unter die eingebauten und über „ID kopieren“ und
„Entfernen“ an.

Linksklick tut auf zwei Reitern etwas Nützliches: Eine Rezept-Karte öffnet sich schreibgeschützt,
damit du siehst, was eine ID tatsächlich herstellt, und eine Zonen-Zeile öffnet den Zonen-Editor.

Die [Rezept-Auswahl](#the-recipe-picker) funktioniert anders genug für einen eigenen Abschnitt weiter
unten, ebenso der [Zonen-Editor](#the-zone-editor) und der [Spawn-Dialog](#the-spawn-rule-dialog).

**Der NBT-Editor** baut [Kriterien für NBT und Data Components](/wiki/locking/items-and-recipes/nbt-and-components)
als Karten, mit Autovervollständigung und Live-Prüfung. Ab 1.21 nimmt er Data Components neben den alten
Feldern, und ein **Strg-Klick** auf einen Inventar-Slot übernimmt den aktuellen Zustand dieses Items,
statt ihn von Hand abzuschreiben.

**Der Editor für Sperr-Aktionen** grenzt einen Eintrag auf bestimmte Interaktionen ein, statt ihn ganz
zu sperren, pro Item-, Tag- oder Mod-Eintrag. →
[Unlock Actions](/wiki/locking/items-and-recipes/unlock-actions)

## Abhängigkeiten {/* #dependencies */}

![Der Abhängigkeits-Editor mit einer UND-Gruppe](/img/editor/dependencies.webp)

Der **Abhängigkeits-Editor** baut Voraussetzungen visuell: abgegebene Items und Item-Tags, getötete
Kreaturen, XP-Level, Statistiken, Scoreboard-Ziele, andere Stages, angeordnet in
[Gruppen](/wiki/stage-file/dependencies) mit eigener UND/ODER-Logik.

Um zu sehen, wie die ganze Kette zusammenhängt, öffne den
[Stufen-Graph](/wiki/in-game-tools/stage-graph) aus der Stage-Übersicht. Er zeichnet jede Stage als
Knoten und ihre Abhängigkeiten als Linien, und so fallen eine lange Kette oder eine Verbindung, die du
nicht wolltest, auf einen Blick auf.

:::note[Der Editor sieht mehr davon als Spieler]
Es ist ein Bildschirm mit zwei Eingängen. Aus dem Editor geöffnet, zeigt er **jede** Stage und
ignoriert die Sichtbarkeits-Regeln in `graph.toml`. Aus dem Pausemenü geöffnet, wendet er sie an, also
sehen Spieler nur, was das Modpack sie sehen lassen will.

Dort werden auch das Layout des Graphs und die Gestaltung pro Stage gemacht: Die Knoten-Positionen und
der Knopf **Neu anordnen** sitzen im Graph selbst, nicht in einem eigenen Werkzeug.
:::

## Warnungen beim Bauen {/* #warnings-while-you-build */}

Der Editor markiert Überschneidungen zwischen globalen und individuellen Stages, sobald du sie anlegst,
weil genau das eine
[Dual-Phase-Sperre](/wiki/start-here/global-vs-individual#dual-phase-when-both-lists-target-the-same-content)
einschaltet, manchmal mit Absicht, manchmal nicht. Einträge, die eine auslösen, tragen ein Abzeichen
`[Dual]`.

Rezept-Einträge, deren ID es im Spiel nicht mehr gibt, werden im Reiter Rezepte rot angezeigt. →
[Rezepte](/wiki/locking/items-and-recipes/recipes#script-generated-recipes-move)

Speichern, Kopieren und Löschen melden sich über Toasts statt über Chat-Nachrichten, damit der Ablauf
nicht unterbrochen wird.

## Der Config-Editor {/* #the-config-editor */}

![Der Config-Editor auf dem Reiter Gameplay](/img/editor/config-editor.webp)

Ein eigener Reiter für jede Einstellung in `visual.toml`, `gameplay.toml` und `graph.toml`, gruppiert in
die Reiter Common, Client und Graph, mit einer Option zum Zurücksetzen auf Standard. Dazu gehören die
Liste der [Forschungs-Booster](/wiki/in-game-tools/research/pedestal#boosters), das Layout des
[Rollen-Tooltips](/wiki/in-game-tools/research/scrolls#the-scroll-tooltip), das Layout des
[Slot-Tooltips](/wiki/locking/items-and-recipes/slots#the-tooltip) und die
[Ausnahmen für JEI/EMI-Kategorien](/wiki/server/config-files/visual-toml#jei_hiding). Alles das ist
unangenehm, wenn man es als TOML-Strings von Hand schreiben muss.

Speichern braucht Berechtigungsstufe 2, dieselbe Schwelle wie der Editor selbst. →
[Config-Dateien](/wiki/server/config-files)

## Die Rezept-Auswahl {/* #the-recipe-picker */}

![Die Rezept-Auswahl](/img/editor/recipe-picker.webp)

Die Rezept-Auswahl ist ein Panel mit zwei Spalten. Links ein Raster mit allem, was Rezepte herstellen;
ein Klick darauf füllt rechts die Rezepte dieses Items, gezeichnet als Karten in der echten Form des
Rezepts. Ein geformtes Rezept zeigt sein Muster mit den Lücken, wo das Rezept Lücken hat. Nur so lassen
sich zwei Rezepte auseinanderhalten, die dieselben Zutaten anders anordnen.

Klick Karten an, um sie zu markieren. Die Markierung bleibt erhalten, wenn du zu einem anderen Item
wechselst, also kannst du mehrere Rezepte über mehrere Items sammeln, bevor du **Hinzufügen** drückst.
Der Reiter **Gewählt** listet, was gerade ausgewählt ist; Abwählen dort arbeitet auf einer
Momentaufnahme, damit die Karten unter dem Mauszeiger nicht herumspringen. Die Knöpfe **Alle wählen**
und **Alle abwählen** wirken auf das, was die rechte Spalte gerade zeigt, nicht auf das ganze Modpack.

Die Suche trifft den Namen eines Items, seine ID und die Rezeptarten, die es hat: `smelting` findet
alles mit einem Ofen-Rezept. Die Namespace-Filter und `@namespace`-Suchen lesen die ID **des Rezepts**,
nicht die seines Ergebnis-Items. Der Unterschied ist wichtig: Ein Rezept aus KubeJS oder CraftTweaker
stellt fast immer ein Vanilla-Item her, also würde ein Filter nach dem Item genau die Rezepte
verstecken, die ein Modpack-Autor selbst geschrieben hat.

### Flüssigkeiten {/* #fluids */}

Rezepte, die eine Flüssigkeit und kein Item herstellen, tauchen in der Auswahl auch auf. Ihre
Flüssigkeiten stehen im selben Raster wie die Items, nach ihnen, mit der eigenen Textur der
Flüssigkeit gezeichnet; am schnellsten kommst du hin, wenn du nach dem Namen der Flüssigkeit suchst.
Ein Klick darauf listet die Rezepte, die sie herstellen könnten.

**Gespeichert wird immer eine Rezept-ID.** Der Weg über eine Flüssigkeit legt keine
Flüssigkeits-Sperre an; er macht diese Rezepte nur erreichbar, weil ein Rezept ohne Item-Ergebnis sonst
nirgends im Editor auftaucht und sich eine Rezept-ID nicht von Hand eintippen lässt.

Eine Karte zeigt die Flüssigkeits-Zutaten eines Rezepts in einer eigenen Reihe unter dem Item-Muster,
absichtlich getrennt: Nichts in einem Rezept sagt, wo im Muster eine Flüssigkeit hingehört, also würde
eine Flüssigkeit in einer Rasterzelle eine Position behaupten, die nicht bekannt ist. Mengen werden aus
demselben Grund nicht gezeigt: Die Information ist nicht da, um sie zu lesen.

### Die lila Markierung und das Fragezeichen {/* #the-purple-mark-and-the-question-mark */}

Ob eine Flüssigkeit in ein Rezept hineingeht oder herauskommt, kann man Minecraft nicht fragen. Es wird
daraus gelesen, wie das Rezept geschrieben ist, und Mods schreiben das unterschiedlich: manche
`ingredients` und `results`, andere `input` und `output`, wieder andere `ingredient` und `result`. Eine
Schreibweise, die zu keiner davon passt, lässt die Seite unbekannt, und darum geht es bei den
Markierungen.

*   **Ein lila Rand an einem Raster-Eintrag** heißt, dass von keinem Rezept darunter bekannt ist, dass es
    diese Flüssigkeit herstellt; der Eintrag beruht ganz auf der Möglichkeit. Die aufgelisteten Rezepte
    solltest du vor dem Sperren mit einem Rezept-Browser abgleichen.
*   **Ein lila Rand an einem Slot in einer Karte** heißt, dass diese eine Flüssigkeit keiner Seite
    zugeordnet werden konnte. Die Sperre behandelt so eine Flüssigkeit als Zutat und Ergebnis
    zugleich, also zeigt die Karte sie, statt sie zu verstecken.
*   **Ein Fragezeichen im Ergebnis-Slot einer Karte** heißt, dass dort nichts sicher hingehört. Das
    Rezept stellt kein Item her, und keine Flüssigkeit konnte als Ergebnis bestätigt werden.

### Wenn ein Rezept gar nicht aufgelistet ist {/* #when-a-recipe-is-not-listed-at-all */}

Ein Rezept erscheint, wenn es ein Item herstellt oder eine Flüssigkeit, die es herstellen könnte. Drei
Arten fallen durch:

*   Rezepte, deren Flüssigkeiten alle sicher als Zutaten gelesen wurden; es gibt nichts, worunter man
    sie einsortieren könnte;
*   Rezepte ohne erkennbares Ergebnis irgendeiner Art;
*   Rezepte, die sich nicht zurück in ihre eigene Textform schreiben lassen, denn genau so werden die
    Flüssigkeiten überhaupt gelesen.

**Die Sperre ist weniger streng als die Auswahl.** Eine Flüssigkeit zu sperren sperrt weiterhin jedes
Rezept, das sie berührt, auch die, die die Auswahl auslässt, weil die Sperre eine unlesbare Seite als
beides zählt. Ein Rezept, das in der Auswahl fehlt, fehlt also nicht in der Sperre.

### Bei individuellen Stages {/* #on-individual-stages */}

Die Auswahl bietet in einer individuellen Stage weniger Rezepte an und sagt das über der Liste. Eine
Sperre pro Spieler funktioniert, indem sie fragt, wer gerade herstellt, und das kann nur eine Station
beantworten, vor der ein Spieler mit offenem Bildschirm steht. Öfen, Trichter und Autocrafter lösen
Rezepte auf, ohne dass jemand da ist, also werden ihre Rezeptarten nicht angeboten. Ein Eintrag dafür
würde in die Stage-Datei geschrieben und dann nichts tun.

## Der Zonen-Editor {/* #the-zone-editor */}

![Der Zonen-Editor mit drei Formen auf der Karte](/img/editor/zone-shapes.webp)

Zonen sind die eine Sperr-Art ohne Registry zum Auswählen: Der Bereich muss gezeichnet werden. Der Zonen-Reiter listet die Zonen einer Stage mit einer einzeiligen Zusammenfassung dessen, was jede tut (`3 Formen · Schaden · Barriere · umgekehrt`), und **Bearbeiten** öffnet den eigenen Bildschirm der Zone.

Dieser Bildschirm hat vier Abschnitte. **Allgemein** enthält den Namen, die Welt und die Liste der Formen. **Wirkung** enthält die Nachricht, den Schaden und die Trank-Effekte. **Schutz** enthält die Interaktions-Schalter, die harte Barriere und das Unterdrücken von Spawns. **Anzeige** enthält die beiden Sichtbarkeits-Schalter.

### Die Formen zeichnen {/* #drawing-the-shapes */}

Es gibt zwei Wege hinein, und beide treffen sich an derselben Stelle:

*   **In der Welt markieren.** Schleichen + Linksklick mit dem Markierungs-Item setzt die erste Ecke, Schleichen + Rechtsklick die zweite (das Item steht in [`[zone_lock]`](/wiki/server/config-files/gameplay-toml#zone_lock)); `/history zone mark` tut dasselbe ohne Item. Zurück im Editor zeigt **In der Welt markiert** die Auswahl, und **Übernehmen** macht daraus einen Quader.
*   **Eintippen.** **Form hinzufügen** bietet Quader, Kugel oder Zylinder an, und **Zahlen** öffnet die Koordinaten zum Bearbeiten von Hand. So setzt du eine Ecke an einem Ort, an dem du lieber nicht stehen würdest.

Eine Zone ist die Vereinigung ihrer Formen, also baust du einen unhandlichen Bereich, indem du mehrere übereinanderlegst, statt einen Kasten zu suchen, der passt.

### Die Karte {/* #the-map */}

Jeder Zonen-Bildschirm hat eine kleine Karte; ein Klick darauf öffnet die große. Sie zeigt die Ansicht von oben, wird zum Verschieben gezogen und zum Zoomen gescrollt und hat Knöpfe, um zum Spieler zu springen (**zu mir**) oder die ganze Zone einzurahmen (**zur Zone**). Eine Anzeige darunter nennt die Koordinaten unter dem Mauszeiger. Eine Zone in einer Welt, in der der Spieler gerade nicht ist, wird ohne Gelände gezeichnet: Die Formen sitzen trotzdem an der richtigen Stelle, es gibt nur nichts, worauf man sie zeichnen könnte.


## Der Spawn-Dialog {/* #the-spawn-rule-dialog */}

Ein Spawn-Sperr-Eintrag ist eine Regel statt eines Kästchens, und der Editor öffnet ihn als Dialog. Die **Phase** der Sperre sitzt oben, *solange gesperrt* oder *nach dem Freischalten*, und der Rest sind vier Reiter, jeder mit einem Zähler, wie viel davon eingestellt ist:

1.  **Quellen**: die sechs Spawn-Quellen.
2.  **Ort**: Dimensionen und Biome (jeweils *beliebig* / *nur in* / *nicht in*, mit Auswahl), ob der Himmel sichtbar ist, und ein Höhenbereich.
3.  **Zeit & Wetter**: Tag oder Nacht, ein Lichtbereich, das Wetter und die Mondphase.
4.  **Zusätzliche Biome**: Biome, in denen die Kreatur *zusätzlich* spawnen soll, mit optionaler Häufigkeit, und ein Schalter, um die eigenen Platzierungsregeln der Kreatur zu ignorieren.

Eine Zeile unter den Reitern schreibt die ganze Regel in Worten aus, damit sich das, was gespeichert wird, in einem Satz zurücklesen lässt, statt es aus vier Reitern zusammenzusetzen. Bedingungen, die nicht gesetzt sind, sind ausgegraut.

→ [Kreaturen & Spawns](/wiki/locking/creatures-and-trade/entities-and-spawns) zeigt, was jeder davon in die Stage-Datei schreibt, und die vier Grenzen, die man bei zusätzlichen Biomen kennen sollte.

## Speichern und Multiplayer {/* #saving-and-multiplayer */}

Speichern schreibt die Stage-Datei und lädt sofort neu, ganz ohne `/history reload`, anders als bei
einer Datei, die von Hand bearbeitet wurde. Die Änderung wird im selben Schritt an verbundene Spieler
übertragen.

:::danger[Handänderungen können ohne Warnung überschrieben werden]
Der Server liest die Stage-Ordner beim Start und bei `/history reload`, **nicht**, wenn sich eine Datei
auf der Festplatte ändert. Bearbeitest du also eine Stage-Datei von Hand und speicherst dann diese Stage
im Editor, schreibt der Editor die ganze Datei aus der Version, die er noch im Speicher hat, und deine
Änderung ist weg, ohne dass etwas gesagt wird.

**Führ nach jeder Handänderung `/history reload` aus, bevor du den Editor öffnest.** Beide
Arbeitsweisen zu mischen ist in Ordnung; in dieser Reihenfolge ist es sicher.
:::
