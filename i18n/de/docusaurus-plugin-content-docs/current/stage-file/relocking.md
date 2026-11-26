---
title: Wieder sperren
description: "Stages, die sich selbst wieder sperren: der Solange-Modus für Zustände, die kommen und gehen, und Sperr-Auslöser an Default- und Auto-Stages."
sidebar_position: 3
---

# Wieder sperren {/* #relocking */}

:::info[Neu in 6.1.0]
:::

Eine Stage bleibt normalerweise freigeschaltet, sobald sie offen ist. Zwei Dinge können sie von selbst
wieder schließen:

| | [Der Solange-Modus](#the-while-mode) | [Sperr-Auslöser](#lock-triggers) |
| :--- | :--- | :--- |
| Wofür | Zustände, die kommen und gehen: im Nether sein, Regen, ein laufender Effekt | alles, auch Ereignisse und Zähler |
| An welchen Stages | eigener Modus, `"conditional"` | `default`- und `auto`-Stages |
| Wie sie aufgeht | durch dieselben Auslöser, die sie schließen | wie vorher: Rolle oder Auto-Auslöser |
| Fortschritt | keiner, wird ständig geprüft | gezählt, wie bei Auto-Auslösern |

Beide nutzen die Auslöser-Arten aus [Stage-Modi](/wiki/stage-file/stage-modes#trigger-types). Sie
fallen in drei Gruppen, und die Gruppe entscheidet, was ein Auslöser hier kann:

| Gruppe | Auslöser | Kann es enden? |
| :--- | :--- | :--- |
| **Zustände** | `biome`, `structure`, `dimension`, `item` (im Inventar), `effect`, `xp_level`, `weather`, `world_time` | ja: Der Spieler geht weg, der Regen hört auf, der Effekt läuft aus |
| **Zähler** | `advancement`, `playtime`, `stat`, `day_count` | nein, sie steigen nur |
| **Ereignisse** | `entity`, `block_place`, `block_break` | nein, sie passieren einmal |

Nur Zustände kann der Solange-Modus nutzen, und nur Zustände lassen sich
[umkehren](#negate-is-reached-or-no-longer-holds).

## Der Solange-Modus {/* #the-while-mode */}

Eine Stage im Modus `"conditional"` (im Editor **Solange**) ist **nur offen, solange ihre Auslöser
zutreffen**. Verlass den Nether, und sie sperrt sich; komm zurück, und sie öffnet sich wieder. Es gibt
keine Rolle, und das Podest lehnt sie ab.

```json title="config/historystages/individual/nether_adapted.json"
{
  "display_name": "Nether Adapted",
  "mode": "conditional",
  "auto_trigger": {
    "mode": "all",
    "triggers": [
      { "type": "dimension", "id": "minecraft:the_nether" },
      { "type": "effect", "id": "minecraft:fire_resistance" }
    ]
  }
}
```

Er nutzt den normalen Block `auto_trigger` mit **any** oder **all**, aber nur Zustands-Auslöser sind
erlaubt. Alles andere wird beim Laden der Stage mit einer Warnung übersprungen; der Editor bietet es
gar nicht an.

- Der Zustand wird einmal pro Sekunde geprüft, und sofort beim Einloggen, beim Serverstart und nach
  einem Reload.
- **Abhängigkeiten werden nur in dem Moment geprüft, in dem sie aufgeht.** Fällt eine Abhängigkeit weg,
  während die Stage offen ist, bleibt sie offen, bis ihre Bedingung das nächste Mal nicht zutrifft.
- [Blockiert, solange …](/wiki/stage-file/logic-blocks#blocked-while) verhindert, dass sie aufgeht.
- `/history ... unlock` oder `lock` eines Operators wird bei der nächsten Prüfung überschrieben. Der
  Zustand entscheidet, nicht der Befehl.
- Nachrichten sind in diesem Modus standardmäßig aus, weil eine Stage, die mit dem Wetter flackert,
  sich sonst alle paar Minuten ankündigen würde. `"notify": true` schaltet sie ein.

**Globale Solange-Stages können nur Welt-Zustände nutzen**, also `weather` und `world_time`.
„Irgendein Spieler ist im Nether“ ist kein Zustand der Welt. Für Spieler-Zustände nimm eine
individuelle Stage.

## Sperr-Auslöser {/* #lock-triggers */}

Eine `default`- oder `auto`-Stage kann einen Block `lock_trigger` haben: Auslöser, die sie wieder
sperren, sobald sie auslösen.

```json title="config/historystages/individual/peaceful_trader.json"
{
  "display_name": "Peaceful Trader",
  "mode": "auto",
  "auto_trigger": {
    "triggers": [{ "type": "advancement", "id": "minecraft:adventure/trade" }]
  },
  "lock_trigger": {
    "mode": "any",
    "triggers": [
      { "type": "entity", "id": "minecraft:villager", "sub_mode": "kill" }
    ],
    "re_unlockable": false
  }
}
```

Töte einen Dorfbewohner, und die Stage ist weg.

- Sperr-Auslöser zählen **nur, solange die Stage offen ist**, und ihr Fortschritt fängt bei jedem
  Freischalten bei null an, egal auf welchem Weg sie freigeschaltet wurde.
- `mode` ist `any` oder `all`, wie bei Auto-Auslösern.
- `lock_trigger` an einer `external`-, `temporary`- oder `conditional`-Stage wird mit einer Warnung
  ignoriert.
- Eine Stage zu sperren sperrt nicht die Stages, die von ihr abhängen.

### Endgültig verloren {/* #lost-for-good */}

`re_unlockable` entscheidet, was danach passiert. Standardmäßig ist es `false`.

| `re_unlockable` | Nachdem der Sperr-Auslöser ausgelöst hat |
| :--- | :--- |
| `true` | die Stage kann auf normalem Weg wieder freigeschaltet werden, über ihre Rolle oder ihre Auto-Auslöser |
| `false` | die Stage ist **endgültig verloren**: Podest, Auto-Auslöser, Skripte und FTB-Quests-Belohnungen lehnen sie alle ab |

Eine endgültig verlorene `default`-Stage behält ihre Rolle; das Podest lehnt die Forschung ab. Ein
Operator kann sie per Befehl oder im Editor trotzdem zurückholen, das löscht auch die Markierung. In
der Übersicht trägt eine endgültig verlorene globale Stage ein Abzeichen `[Verloren]`; individuelle
zeigen „endgültig verloren“ im Tooltip.

### Umkehren: „wird erreicht“ oder „gilt nicht mehr“ {/* #negate-is-reached-or-no-longer-holds */}

Ein Zustands-Auslöser in einer Sperr-Liste löst normalerweise aus, wenn der Zustand **erreicht wird**.
Mit `"negate": true` löst er stattdessen aus, wenn der Zustand **nicht mehr gilt**.

Nimm den Effekt Feuerresistenz. Ein Spieler trinkt den Trank, er wirkt drei Minuten, dann läuft er
aus:

| Moment | Effekt | `"negate": false` (wird erreicht) | `"negate": true` (gilt nicht mehr) |
| :--- | :--- | :--- | :--- |
| Trinkt den Trank | beginnt | **löst aus, sperrt** | – |
| Drei Minuten später | wirkt noch | – | – |
| Effekt läuft aus | endet | – | **löst aus, sperrt** |

Das erste sperrt die Stage in dem Moment, in dem der Spieler trinkt; das zweite hält sie genau so lange
offen, wie der Effekt anhält.

```json
"lock_trigger": {
  "triggers": [
    { "type": "effect", "id": "minecraft:fire_resistance", "negate": true }
  ],
  "re_unlockable": true
}
```

- Nur Zustands-Auslöser lassen sich umkehren. Bei einem Zähler oder Ereignis wird `negate` mit einer
  Warnung ignoriert, weil etwas, das passiert ist, nicht aufhören kann, passiert zu sein. Der Editor
  beschriftet solche Zeilen mit **Ereignis**.
- Ein umgekehrter Auslöser wird einmal pro Sekunde geprüft, wie beim Solange-Modus.
- In einer **globalen** Stage lassen sich nur Welt-Zustände umkehren, aus demselben Grund wie beim
  Solange-Modus. Einfache Spieler-Zustände bleiben dort erlaubt: Der erste Spieler, der einen erreicht,
  sperrt die Stage für alle.

:::warning[Umgekehrt und nicht wieder freischaltbar]
Ein umgekehrter Auslöser, dessen Zustand beim Freischalten der Stage nicht zutrifft, löst innerhalb
einer Sekunde aus. Mit `re_unlockable: false` ist die Stage dann direkt nach dem Öffnen endgültig weg.
Der Editor warnt vor dieser Kombination.
:::

## `notify` {/* #notify */}

`"notify": false` an einer beliebigen Stage unterdrückt ihre Nachrichten beim Freischalten und
Wiedersperren. Die Einstellungen in
[`[notifications]`](/wiki/server/config-files/visual-toml#notifications) bleiben der Hauptschalter.
Ohne Angabe ist es `false` für Solange-Stages und `true` für alle anderen, damit sich bestehende
Stages nicht ändern.

## Im Editor {/* #in-the-editor */}

![Der Bildschirm für Sperr-Auslöser mit der Liste der Auslöser-Arten](/img/editor/lock-triggers.webp)

**Stage-Einstellungen.** Das Modus-Menü hat **Solange**, mit einer Karte für seine Bedingungen und den
Nachrichten-Schalter. Bei Default- und Auto-Stages sitzt unter der Modus-Karte eine Karte **Sperren**:
**Sperr-Trigger konfigurieren →**, **Wieder freischaltbar** und **Meldungen beim Öffnen/Sperren**.

Die Liste der Sperr-Auslöser ist derselbe Bildschirm wie die Liste der Auto-Auslöser.
Zustands-Zeilen haben einen Schalter zwischen **wird erreicht** und **gilt nicht mehr**;
Ereignis- und Zähler-Zeilen tragen die Beschriftung **Ereignis**.

## Siehe auch {/* #see-also */}

- [Stage-Modi](/wiki/stage-file/stage-modes): die Auslöser-Arten und die anderen Modi.
- [Logikbausteine](/wiki/stage-file/logic-blocks): „Entziehen, wenn“ nimmt eine Stage wegen anderer
  Stages weg, nicht wegen eines Auslösers.
- [Bei Tod verlieren](/wiki/start-here/global-vs-individual#lose-on-death): der andere Weg, wie einer
  individuellen Stage etwas weggenommen werden kann.
