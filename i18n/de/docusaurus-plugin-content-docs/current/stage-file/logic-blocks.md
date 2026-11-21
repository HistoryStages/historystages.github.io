---
title: Logikbausteine
description: "Regeln zwischen Stages: eine Stage, die blockiert, versteckt, günstiger oder entzogen wird, je nachdem, welche anderen Stages freigeschaltet sind."
sidebar_position: 5
---

# Logikbausteine {/* #logic-blocks */}

:::info[Neu in 6.1.0]
:::

[Abhängigkeiten](/wiki/stage-file/dependencies) sagen „A muss vor B kommen“. Logikbausteine decken ab,
was Abhängigkeiten nicht können: eine Stage, die nicht verfügbar, unsichtbar, günstiger oder verloren
ist, weil mit **anderen** Stages etwas passiert ist.

Der klassische Fall sind zwei Wege, die sich gegenseitig ausschließen. Ein Magier wählt Feuer oder
Eis; wer mit einem anfängt, sperrt den anderen, bis der erste gemeistert ist.

Ein Logikbaustein ist eine Regel: eine **Art** (was passiert) plus eine **Bedingung** (wann). Eine
Stage kann mehrere haben.

| Art | Was sie tut |
| :--- | :--- |
| [Blockiert, solange …](#blocked-while) | die Stage kann nicht freigeschaltet werden, solange die Bedingung zutrifft |
| [Versteckt, solange …](#hidden-while) | die Stage ist nicht zu sehen, solange die Bedingung zutrifft |
| [Günstiger/teurer, solange …](#cheapercostlier-while) | Forschungszeit, Item- und XP-Kosten ändern sich, solange die Bedingung zutrifft |
| [Entziehen, wenn …](#revoke-when) | die Stage wird in dem Moment weggenommen, in dem die Bedingung wahr wird |

## Bedingungen {/* #conditions */}

Eine Bedingung schaut auf andere Stages: **ist freigeschaltet** oder **ist gesperrt**, gruppiert als
**Alle** oder **Eines davon**. Der Editor baut bis zu fünf Gruppen, und alle Gruppen müssen gleichzeitig
zutreffen:

> (Feuer I ist freigeschaltet **und** Feuer III ist gesperrt)

In der Datei ist das ein kleiner Baum aus `all`, `any`, `not` und `unlocked`:

```json
"logic": [
  {
    "type": "blocked_while",
    "condition": {
      "all": [
        { "unlocked": "fire_1" },
        { "not": { "unlocked": "fire_3" } }
      ]
    }
  }
]
```

Jeder Baum wird gelesen und ausgewertet, auch Verschachtelungen, die der Editor nicht darstellen kann.
Der Editor zeigt den Baustein dann schreibgeschützt an und lässt ihn, wie er ist.

**Für wen die Bedingung geprüft wird.** Die Bedingung einer individuellen Stage wird für diesen Spieler
geprüft und darf auf globale und individuelle Stages schauen. Die Bedingung einer globalen Stage darf
nur auf globale Stages schauen; eine individuelle Stage darin zählt als gesperrt, und der Lade-Bericht
sagt das. Haben eine individuelle und eine globale Stage dieselbe ID, sagt `"scope": "global"` oder
`"scope": "individual"` neben `"unlocked"`, welche gemeint ist.

Eine Stage, die es nicht gibt, zählt als gesperrt. Der Editor markiert sie rot.

## Blockiert, solange {/* #blocked-while */}

Die Stage **kann nicht freigeschaltet werden**, solange die Bedingung zutrifft. Eine schon
freigeschaltete Stage bleibt freigeschaltet, wenn ihre Bedingung wahr wird; sie wegzunehmen ist die
Aufgabe von [Entziehen, wenn](#revoke-when).

Die beiden Magier-Wege, jeder drei Stages lang. Nur die Einstiegs-Stages brauchen einen Baustein:

| Stage | Blockiert, solange |
| :--- | :--- |
| Feuer I | Eis I ist freigeschaltet **und** Eis III ist gesperrt |
| Eis I | Feuer I ist freigeschaltet **und** Feuer III ist gesperrt |

Am Anfang sind beide offen. Erforsche Feuer I, und Eis I ist blockiert. Schalte Feuer III frei, und
Eis I öffnet sich wieder.

**Welche Wege zum Freischalten das beachten:**

| Weg | Wenn die Stage blockiert ist |
| :--- | :--- |
| Forschungspodest | startet nicht und fragt noch einmal, wenn die Forschung fertig ist |
| Auto-Auslöser, `Solange`-Stages | lösen nicht aus; sie versuchen es beim nächsten Mal wieder |
| Belohnungen aus KubeJS, CraftTweaker, FTB Quests | abgelehnt, mit einer Zeile im Debug-Log |
| `/history`-Befehle, der Freischalt-Schalter im Editor | **schalten trotzdem frei** und sagen es dem Operator |
| Kreativ-Rolle | geht durch |

Das Podest fragt am Ende ein zweites Mal, weil zwei Spieler Feuer I und Eis I im selben Moment
starten können. Ist die Stage bis dahin blockiert, entscheidet `researchWhenBlocked` in
[`gameplay.toml`](/wiki/server/config-files/gameplay-toml#stage_logic): `PAUSE` (Standard) behält den
Fortschritt und wartet, `CANCEL` bricht ab und gibt die Rolle zurück.

`warnOnForcedUnlock` schaltet den Hinweis ab, den ein Operator bekommt, wenn ein Befehl eine blockierte
Stage durchdrückt.

## Versteckt, solange {/* #hidden-while */}

Die Stage ist **nicht zu sehen**, solange die Bedingung zutrifft. Freischalten lässt sie sich
trotzdem, ein geheimer Weg über eine erbeutete Rolle funktioniert also weiter. Kombiniere es mit
„Blockiert, solange“, um das zu verhindern.

`mode` wählt, wie sie sich versteckt: `"anonymous"` (Standard) oder `"vanish"`.

| Wo | `anonymous` | `vanish` |
| :--- | :--- | :--- |
| Stufen-Graph (Spieleransicht) | Knoten als „???“ | Knoten und seine Linien weg |
| Item-Tooltip, Jade, Sperr-Nachrichten | „???“ | „???“ |
| Anforderungen einer anderen Stage | „???“ | „???“ |
| Ihre Rolle in JEI / EMI | versteckt | versteckt |
| Editor, Befehle, Debug-Log | unverändert | unverändert |

Wo die Stage nur gezeigt wird, verschwindet sie; wo sie etwas erklärt, steht „???“.

```json
{ "type": "hidden_while", "mode": "vanish", "condition": { "not": { "unlocked": "explorer" } } }
```

## Günstiger/teurer, solange {/* #cheapercostlier-while */}

Skaliert die Forschungs**zeit**, die **Item**-Kosten und die **XP**-Kosten in Prozent, solange die
Bedingung zutrifft. 100 ist unverändert, 50 die Hälfte, 0 gratis oder sofort, bis zu 1000. Ein
fehlendes Feld ist 100.

```json
{ "type": "cost_while", "time": 50, "items": 100, "xp": 75, "condition": { "unlocked": "scholar" } }
```

- Mehrere Bausteine, die zutreffen, multiplizieren sich miteinander und mit dem
  [Booster](/wiki/in-game-tools/research/pedestal#boosters) des Podests.
- Item-Anzahlen werden aufgerundet und fallen nie unter 1, außer der Faktor ist 0. XP wird genauso
  gerundet.
- **Item- und XP-Kosten werden bei der ersten Abgabe auf der Rolle festgeschrieben.** Schaltet man
  Gelehrter mittendrin frei, ändert das nicht, was schon geschuldet ist. Die Zeit ändert sich live.

Das Podest zeigt, was gilt und warum. Der Rollen-Tooltip listet außerdem Rabatte auf, die der Spieler
noch bekommen könnte, wenn er etwas freischaltet; `showInactiveCostHints` in
[`visual.toml`](/wiki/server/config-files/visual-toml#stage_logic) schaltet diese Hinweise ab.

## Entziehen, wenn {/* #revoke-when */}

Nimmt die Stage **einmal** weg, in dem Moment, in dem ihre Bedingung von falsch zu wahr wechselt, falls
der Besitzer sie hat. Besitzer ist bei einer globalen Stage die Welt, bei einer individuellen der
Spieler.

```json
{ "type": "revoke_when", "condition": { "unlocked": "shadow_pact" } }
```

Wer den Schattenpakt eingeht, verliert den Weg des Lichts.

- Es löst aus, egal was die andere Stage freigeschaltet oder gesperrt hat: Podest, Auslöser, Befehl,
  Skript, Quest.
- Ketten funktionieren. Der Verlust einer Stage kann das Entziehen einer anderen auslösen, und weil
  Entziehen immer nur Stages wegnimmt, endet eine Kette immer.
- Spieler, die offline waren, verlieren die Stage beim nächsten Einloggen.
- Die Stage kann danach wieder erforscht werden. Füge „Blockiert, solange“ mit derselben Bedingung
  hinzu, um das zu verhindern.
- Entziehen wirkt wie ein Wiedersperren: Rezepte werden wieder gesperrt, und bei einer individuellen
  Stage fallen die gesperrten Items des Spielers heraus, solange `dropOnRevoke` in
  [`[individual_stages]`](/wiki/server/config-files/gameplay-toml#individual_stages) an ist.

Der Spieler bekommt einen Toast, der sagt, was weggenommen wurde und warum. Ein Operator, dessen Befehl
oder Klick im Editor es ausgelöst hat, bekommt auch einen.

Zwei Warnungen können **vorher** erscheinen, jede mit eigenem Schalter in
[`visual.toml`](/wiki/server/config-files/visual-toml#stage_logic):

- `showRevokeWarningOnStage`: „Wird entzogen, wenn …“ im Rollen-Tooltip und im Graph-Panel der Stage
  selbst.
- `showRevokeWarningOnTrigger`: „Freischalten nimmt dir …“ an Rolle und Podest der Stage, deren
  Freischaltung es auslösen würde.

:::note[Eine „Solange“-Stage löst ein Entziehen bei jedem Öffnen aus]
Eine [`Solange`-Stage](/wiki/stage-file/relocking#the-while-mode), die immer wieder auf- und zugeht,
schaltet „ist freigeschaltet“ an und aus. Ein Entziehen, das auf sie schaut, löst bei jedem Öffnen aus.
So funktioniert die Regel, das ist kein Fehler.
:::

## Was Spieler sehen {/* #what-players-see */}

Das Podest, der Rollen-Tooltip und der [Stufen-Graph](/wiki/in-game-tools/stage-graph) sagen, warum
eine Stage blockiert ist. Im Graph hat eine blockierte Stage ein eigenes Aussehen, standardmäßig ein
rotes Durchfahrt-verboten-Abzeichen, gestaltet als `blocked` in `graph.toml` wie die anderen
Knoten-Zustände.

`blockedDisplay = "PLAIN"` in [`visual.toml`](/wiki/server/config-files/visual-toml#stage_logic)
versteckt die Bedingungen überall und sagt nur, dass die Stage blockiert ist. Die Actionbar-Texte für
eine blockierte und eine entzogene Stage sind `lock_messages.stageBlocked` und
`lock_messages.stageRevoked`.

## Im Editor {/* #in-the-editor */}

**Logik**, der Knopf neben Einstellungen und Abhängigkeiten im Bildschirm der Stage. Jeder Baustein
ist eine Karte; **+ Baustein** fügt einen hinzu. Eine Karte zeigt live, ob ihre Bedingung für dich
gerade zutrifft, und markiert jeden Teil, der erfüllt ist. Die Stage-Auswahl bietet nur Stages an, auf
die die Bedingung schauen darf.

## Siehe auch {/* #see-also */}

- [Abhängigkeiten](/wiki/stage-file/dependencies): was erledigt sein muss, bevor eine Stage erforscht
  werden kann.
- [Austauschbare Stages](/wiki/stage-file/interchangeable-stages): mehrere Stages, die dasselbe
  sperren, wobei eine reicht.
- [Wieder sperren](/wiki/stage-file/relocking): Stages, die sich durch Auslöser selbst wieder sperren.
