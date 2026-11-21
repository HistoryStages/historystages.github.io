---
title: Config-Dateien
description: "Die drei Einstellungsdateien, wem sie gehören und welche davon beim Client ankommt."
sidebar_position: 1
---

# Config-Dateien {/* #config-files */}

History Stages speichert seine Einstellungen in drei TOML-Dateien:

```text
config/historystages/settings/
    visual.toml      was ein Spieler sieht oder hört
    gameplay.toml    was im Hintergrund passiert
    graph.toml       der Stufen-Graph für Spieler
```

Sie lassen sich von Hand bearbeiten oder über den [Config-Editor](/wiki/in-game-tools/in-game-editor)
im Spiel, der dieselben Dateien schreibt. Speichern aus dem Editor braucht Berechtigungsstufe 2.

Handänderungen brauchen `/history reload`, um zu wirken. Der Editor lädt selbst neu.

## Sie gehören dem Server, nicht dem Spieler {/* #they-belong-to-the-server-not-to-the-player */}

**Alle drei liegen auf dem Server und werden an jeden Spieler geschickt, der beitritt.** Die Aufteilung
zwischen ihnen ist thematisch und keine Frage, wem sie gehören: Ein Modpack-Autor stellt sie alle ein,
und nichts davon soll ein einzelner Spieler anfassen.

Die eigenen Kopien eines Clients gelten im Einzelspieler und solange er nirgends verbunden ist. Sobald
er einem Server beitritt, gelten für die Sitzung die Werte dieses Servers, und seine eigenen kommen
zurück, wenn er geht. **Seine Dateien auf der Festplatte werden von einem Server nie überschrieben.**

## Die drei Dateien {/* #the-three-files */}

- **[visual.toml](/wiki/server/config-files/visual-toml)**: Tooltips, Overlays, Sperr-Nachrichten,
  Benachrichtigungen, der Rezept-Browser, der Rollen-Tooltip und das Dokument der geöffneten Rolle.
- **[gameplay.toml](/wiki/server/config-files/gameplay-toml)**: Logging, die grundlegenden
  Gameplay-Sperren, Forschung und Booster, Loot-Ersatz und das Verhalten der Struktur-, Biom- und
  Zonen-Sperren.
- **graph.toml**: rund 90 eigene Schlüssel für Aussehen der Fläche, Sichtbarkeits-Regeln und
  Knoten-Gestaltung. Erklärt auf der Seite [Stufen-Graph](/wiki/in-game-tools/stage-graph), mit
  eigenem Reiter im Config-Editor.

## Wo die Einstellungen wirklich erklärt werden {/* #where-the-settings-are-actually-explained */}

Diese beiden Seiten sind **Nachschlage-Listen**: jeder Schlüssel, sein Standard und eine Zeile, was er
tut. Warum es eine Einstellung gibt, steht auf der Seite zu dem, was sie einstellt:
[Biome](/wiki/locking/world/biomes) erklärt, wofür `[biome_lock]` da ist,
[Loot](/wiki/locking/items-and-recipes/loot) erklärt `[loot_replacements]` und so weiter. Jeder
Schlüssel verlinkt dorthin zurück.

## Du kommst von 5.x? {/* #coming-from-5x */}

Die Einstellungen lagen früher in zwei anders benannten Dateien und waren nach einem ganz anderen
Prinzip aufgeteilt. Beim ersten Start wird alles automatisch übernommen. →
[Von 5.x aktualisieren](/wiki/server/upgrading-from-5x)
