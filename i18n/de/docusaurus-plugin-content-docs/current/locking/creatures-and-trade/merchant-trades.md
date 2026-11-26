---
title: Händler-Angebote
description: "Ein einzelnes Dorfbewohner-Angebot, einen ganzen Beruf oder eine Händlerstufe sperren, und was ein Spieler im Handelsfenster sieht."
sidebar_position: 2
---

# Händler-Angebote {/* #merchant-trades */}

<Scope global="yes" individual="yes" />

Das Object `trades` enthält drei Listen. Sie werden einzeln gefragt und stapeln sich: Ein Angebot
bleibt nur, wenn keine der drei es sperrt.

```json
"trades": {
  "offers": [
    {
      "merchant": "minecraft:librarian",
      "level": 2,
      "gives": "minecraft:bookshelf",
      "takes": ["minecraft:emerald"]
    }
  ],
  "professions": [
    "minecraft:weaponsmith",
    { "id": "minecraft:librarian", "levels": [4, 5] }
  ],
  "levels": [5]
}
```

## Im Editor {/* #in-the-editor */}

![Der Handels-Reiter](/img/editor/trades-tab.webp)

Der Reiter **Handel**. Seine Auswahl listet **echte Angebote** statt jedes Items im Spiel: Wähl einen
Beruf, und du siehst, was dieser Händler tatsächlich handelt, auf welcher Stufe und zu welchem Preis.
Den größten Teil dieses Blocks schreibst du per Klick.

Berufe stehen auf demselben Reiter. Die Stufen-Sperre für das ganze Modpack ist ein **Rechtsklick** auf
einen Berufs-Eintrag und dann **Händlerstufen**.

## `offers`: ein benanntes Angebot {/* #offers--one-named-trade */}

| Feld | Bedeutung |
| :--- | :--- |
| `merchant` | Die Berufs-ID, oder die Kreatur-ID bei einem Händler ohne Beruf (`minecraft:wandering_trader` oder ein Händler aus einer anderen Mod). |
| `level` | Die Händlerstufe, zu der das Angebot gehört. Standard `1`. |
| `gives` | Was der Spieler bekommt. |
| `takes` | Ein oder beide Preis-Items. |
| `nbt` | Optionales Kriterium, das es so eingrenzt wie bei einem Item-Eintrag. |

:::note[Mengen gehören absichtlich nicht zu einem Angebot]
Ein Händler würfelt seinen eigenen Preis und seine eigene Stapelgröße aus. Ein Eintrag, der sie nennt,
würde dasselbe Angebot bei einem Dorfbewohner sperren und beim nächsten verfehlen.
:::

Die Handels-Auswahl im Editor listet **echte Angebote** statt jedes Items im Spiel, also schreibst du
diesen Block meistens per Klick statt von Hand.

## `professions`: ein ganzer Händler {/* #professions--a-whole-merchant */}

Eine einfache ID sperrt diesen Beruf auf jeder Stufe:

```json
"professions": ["minecraft:weaponsmith"]
```

Die Object-Form sperrt nur die aufgeführten Stufen: `{"id": "minecraft:librarian", "levels": [4, 5]}`
lässt Bibliothekare als Neuling, Lehrling und Geselle normal handeln.

**Händler ohne Beruf** werden über ihre Kreatur-ID in derselben Liste gesperrt. Der fahrende Winzer aus
Vinery hat keinen Dorfbewohner-Beruf, also kommt `"vinery:wandering_winemaker"` in `professions` und
sperrt jedes seiner Angebote. Der Server fragt jeden solchen Händler einmal nach seinen Angeboten,
damit sie in der Angebots- und Berufs-Auswahl erscheinen wie Dorfbewohner. Der fahrende Händler wird
genauso aufgeführt.

:::warning[`levels` listet hier die gesperrten auf, nicht die freien]
Das ist das Gegenteil von [`unlock_actions`](/wiki/locking/items-and-recipes/unlock-actions), und das
ist Absicht. Die Liste `levels` oben in `trades` heißt schon „diese Stufen sind gesperrt“, und ein Wort,
das innerhalb eines Blocks zwei gegensätzliche Dinge bedeutet, ist eine Falle für jeden, der die Datei
von Hand bearbeitet.
:::

## `levels`: ein Rang, jeder Beruf {/* #levels--one-rank-every-profession */}

Eine Händlerstufe, gesperrt für *jeden* Beruf auf einmal. Das ist die Regel hinter „bis zur Bronzezeit
gibt es nur Neulinge“, die Beruf für Beruf zu wiederholen mühsam wäre.

```json
"levels": [4, 5]
```

Als Zahlen geschrieben; Strings werden beim Einlesen akzeptiert.

**Ein fahrender Händler zählt immer als Stufe 1**, also versteckt eine Sperre auf Stufe 1 auch jeden
fahrenden Händler.

## Ein Item überall sperren, wo es gehandelt wird {/* #gating-an-item-everywhere-it-is-traded */}

Das ist eine andere Frage und wird nicht hier geschrieben. Nimm die
[Aktion `trade`](/wiki/locking/items-and-recipes/unlock-actions) an einem normalen `items`-Eintrag: Sie
sperrt das Kaufen oder Verkaufen dieses Items bei jedem Händler, wo immer es auftaucht.

Die drei Werkzeuge nebeneinander:

| Ziel | Wo es hingehört |
| :--- | :--- |
| Ein bestimmtes Angebot | `trades` → `offers` |
| Ein Händler oder ein Händler-Rang | `trades` → `professions` / `levels` |
| Dieses Item handelt niemand | die Aktion `trade` an einem `items`-Eintrag |

## Was der Spieler sieht {/* #what-the-player-sees */}

Ein Händler, dessen Angebote **alle** gesperrt sind, öffnet sich mit einem Hinweis im Handelsfenster
statt mit einer leeren Liste. Ohne ihn sieht ein ausgeräumter Händler genauso aus wie einer, der gerade
nichts auf Lager hat, und das wirkt wie ein Fehler.

Ob dieser Hinweis die Stages nennt, die die Angebote zurückhalten, regelt `showStagesInWindow` unter
[`[trade_lock]`](/wiki/server/config-files/visual-toml#trade_lock), **standardmäßig aus**. Das ist
absichtlich der umgekehrte Standard wie bei den Dimensions- und Mob-Nachrichten: Die beantworten „warum
komme ich da nicht hin“, und die Stage zu nennen ist dort die ganze Hilfe. Ein Händler, der nichts
anzubieten hat, ist ein Rätsel, das manche Modpacks lieber eins bleiben lassen.

Die Nachricht selbst ist `tradeLocked` unter
[`[lock_messages]`](/wiki/server/config-files/visual-toml#lock_messages).

## Global oder individuell {/* #global-or-individual */}

Alle drei Listen funktionieren in beiden Arten, denn vor einem Handelsfenster steht immer ein Spieler.

## Siehe auch {/* #see-also */}

- [Kreaturen & Spawns](/wiki/locking/creatures-and-trade/entities-and-spawns#interactionlock):
  `interactionlock` mit der Aktion `trade` verhindert, dass ein Spieler überhaupt mit dem Dorfbewohner
  interagiert. Das ist ein gröberes Werkzeug, als seine Angebote zu sperren.
- [Komplette Beispiele](/wiki/stage-file/complete-examples#fluids-trades-and-a-zone)
