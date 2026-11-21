---
title: Austauschbare Stages
description: "Mehrere Stages sperren dasselbe, und eine davon soll reichen: der Schalter „Austauschbar“."
sidebar_position: 6
---

# Austauschbare Stages {/* #interchangeable-stages */}

:::info[Neu in 6.1.0]
:::

Normalerweise bleibt etwas, das mehrere Stages sperren, gesperrt, bis **jede einzelne** davon
freigeschaltet ist. Steckst du Arkanerz in eine Stage Magie und eine Stage Bergbau, braucht ein
Spieler beide.

Schalte in diesen Stages **Austauschbar** ein, dann vertreten sie sich gegenseitig: Eine von beiden
freizuschalten reicht.

```json title="config/historystages/global/magic.json"
{
  "display_name": "Magic",
  "interchangeable": true,
  "items": ["mypack:arcane_ore"]
}
```

## Wie es sich kombiniert {/* #how-it-combines */}

Nur die Stages mit eingeschaltetem Schalter bilden die Entweder-oder-Gruppe. Jede andere Stage, die
dasselbe sperrt, muss weiterhin wie bisher freigeschaltet werden.

Arkanerz gesperrt in **Magie** (an), **Bergbau** (an) und **Endgame** (aus):

| Freigeschaltet | Arkanerz |
| :--- | :--- |
| Magie | gesperrt, Endgame fehlt |
| Endgame | gesperrt, weder Magie noch Bergbau |
| Endgame + Bergbau | frei |
| Endgame + Magie + Bergbau | frei |

Lies es als `(Magie ODER Bergbau) UND Endgame`. Eine Stage ohne den Schalter verliert ihre Sperre nie
wegen einer, die ihn hat.

Die Regel wird pro gesperrtem Ding entschieden. Dieselbe Stage kann also für ein Item Teil einer
Entweder-oder-Gruppe sein und ein anderes ganz allein sperren.

## Was es abdeckt {/* #what-it-covers */}

Jede Art von Sperre läuft über dieselbe Regel: Items, Tags, Mods, Flüssigkeiten, Rezepte,
Verzauberungen und Effekte, Dimensionen, Strukturen, Biome, Zonen, Kreaturen und Handel, dazu die
[Sperr-Aktionen](/wiki/locking/items-and-recipes/unlock-actions) eines Eintrags.

**Globale und individuelle Stages werden getrennt geprüft.** Jeder Baum bildet seine eigene
Entweder-oder-Gruppe, und das Ding ist gesperrt, wenn einer der beiden Bäume es noch sperrt. Eine
globale Stage kann keine individuelle vertreten.

Spawn- und Generierungs-*Regeln* sind nicht betroffen. Die schalten pro Stage zwischen „solange
gesperrt“ und „nach dem Freischalten“ um und sind nichts, was mehrere Stages gemeinsam sperren.

## Was Spieler sehen {/* #what-players-see */}

Tooltip und Jade listen die Stages auf, die noch fehlen. Austauschbare, die alle noch gesperrt sind,
erscheinen eingerückt unter **Eines davon:**; sobald eine davon freigeschaltet ist, verschwindet die
Gruppe aus der Liste. Eine einzelne übrige austauschbare Stage wird ganz normal aufgeführt.

Spieler, die lieber eine flache Liste sehen, können die Gruppierung mit `groupInterchangeableStages`
abschalten, getrennt in [`[visuals]`](/wiki/server/config-files/visual-toml#visuals) und in `[jade]`.

## Im Editor {/* #in-the-editor */}

**Stage-Einstellungen → Sperren → Austauschbar.** Den Schalter gibt es bei globalen und individuellen
Stages. Ein Modpack, das ihn nie einschaltet, verhält sich genau wie vor 6.1.

## Skripte und die API {/* #scripts-and-the-api */}

KubeJS und CraftTweaker können den Schalter weder lesen noch setzen, aber ihr `isLocked(...)` folgt der
Regel ohne jede Änderung. Für Addons berücksichtigt `LockHit.locks()` sie bereits. →
[Lock Categories](/api/lock-categories)

## Siehe auch {/* #see-also */}

- [Logikbausteine](/wiki/stage-file/logic-blocks): Regeln zwischen Stages, die über „eine davon
  reicht“ hinausgehen.
- [Global vs. individuell](/wiki/start-here/global-vs-individual): warum sich die beiden Bäume nie
  mischen.
