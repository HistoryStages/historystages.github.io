---
title: Rezepte
description: "Benannte Rezept-IDs sperren, was dabei in JEI und EMI passiert und warum eine individuelle Stage keinen Ofen erreicht."
sidebar_position: 4
---

# Rezepte {/* #recipes */}

<Scope global="yes" individual="partly" note="Individuell: nur an Stationen, die wissen, wer craftet. Öfen, Trichter und Autocrafter brauchen eine globale Stage." />

Ein Rezept kann auf zwei Wegen gesperrt werden, und es lohnt sich, sie auseinanderzuhalten:

1. **Das Item ist gesperrt.** Jedes Rezept, das es herstellt, verschwindet, weil die Aktion `recipe`
   zu den Aktionen gehört, die ein Item-Eintrag standardmäßig sperrt. Das ist der Normalfall, und du
   bekommst ihn gratis dazu.
2. **Das Rezept ist benannt.** `recipes` listet einzelne Rezept-IDs auf. Nimm das, wenn nur *einer* von
   mehreren Wegen, etwas herzustellen, gesperrt werden soll, oder wenn das Ergebnis selbst verfügbar
   bleiben soll.

```json
{
  "items": ["minecraft:iron_ingot"],
  "recipes": ["minecraft:iron_pickaxe", "minecraft:iron_sword"]
}
```

## Im Editor {/* #in-the-editor */}

![Der Rezepte-Reiter](/img/editor/recipes-tab.webp)

Der Reiter **Rezepte**. Seine Auswahl hat zwei Spalten: links alles, was Rezepte herstellen, rechts die
tatsächlichen Rezepte dieses Items als Karten, in der echten Form des Rezepts gezeichnet. Nur so lassen
sich zwei Rezepte auseinanderhalten, die dieselben Zutaten unterschiedlich anordnen.

Ein Linksklick auf eine Karte in der Liste einer Stage öffnet sie schreibgeschützt, damit du prüfen
kannst, was eine Rezept-ID tatsächlich herstellt, ohne den Reiter zu verlassen.

In der Auswahl bleibt die Markierung erhalten, wenn du zwischen Items wechselst, also kannst du mehrere
Rezepte über mehrere Items sammeln, bevor du **Hinzufügen** drückst. In einer individuellen Stage
bietet die Auswahl nur die Rezeptarten an, die pro Spieler gesperrt werden können, und sagt das unter
dem Raster. → [Die Rezept-Auswahl](/wiki/in-game-tools/in-game-editor#the-recipe-picker)

## Rezepte, die ein Item benutzen {/* #recipes-using-an-item */}

![Rezepte mit einem Item, aus dem Rechtsklick-Menü des Eintrags](/img/editor/recipes-using.webp)

:::info[Neu in 6.1.0]
:::

Ein Item zu sperren sperrt nicht, was sich **daraus** herstellen lässt. Um das auch zu schließen,
Rechtsklick auf einen Eintrag im Reiter **Items** und **Rezepte mit diesem Item**. Das listet jedes
Rezept auf, das das Item als Zutat nimmt, in zwei Gruppen:

- **Nur gesperrte Items**: Jeder Slot, den das Item füllt, kann nur mit gesperrten Items gefüllt
  werden. Diese sind schon angehakt.
- **Geht auch ohne**: Ein Slot nimmt auch ein Item, das nicht gesperrt ist, also funktioniert das
  Rezept auch ohne das gesperrte. Diese sind nicht angehakt.

Auf den Karten ist eine durchgezogene Markierung ein Slot, in den nur gesperrte Items passen, eine
gestrichelte ein Slot mit Alternative; der Tooltip eines gestrichelten Slots zeigt, was sonst noch
passt. Füge die angehakten Rezepte als Rezept-Einträge hinzu oder ihre Ergebnisse als Item-Einträge.

Das ist eine einmalige Momentaufnahme. Die Einträge, die es hinzufügt, sind ganz normale Rezept- oder
Item-Einträge, also sehen Werkbank, Mod-Maschinen und Rezept-Browser alle dasselbe, und ein Rezept,
das eine Mod später hinzufügt, wird nicht von selbst erfasst.

## Was es tut, hängt von der Stage-Art ab {/* #what-it-actually-does-depends-on-the-scope */}

Das ist die größte Quelle für Verwirrung in der Mod, deshalb hier ganz deutlich:

| | Globale Stage | Individuelle Stage |
| :--- | :--- | :--- |
| Das Rezept selbst | aus dem Recipe Manager gefiltert, **niemand** kann es herstellen | bleibt in der Registry; alle können es weiter herstellen |
| Wo die Sperre greift | überall: Ofen, Autocrafter, Trichter, Mod-Maschinen, alles | nur an Stationen, die wissen, wer davor steht |
| Zwei Spieler an einer Werkbank | gleiches Ergebnis, keiner kann es herstellen | verschiedene Ergebnisse, einer kann, der andere nicht |

Die vier Vanilla-Stationen, die eine individuelle Stage erreicht, sind die **Werkbank**, das
**2×2-Raster im Inventar des Spielers**, die **Steinsäge** und der **Schmiedetisch**. Öfen,
Braustände, der Crafter-Block, Trichter und Autocrafter aus Mods lösen Rezepte auf, ohne dass jemand
davorsteht, und bleiben nur global.

:::warning
Ein Rezept, das eine individuelle Stage sperrt, lässt sich in einem Autocrafter trotzdem herstellen. Für
Fortschritts-Design ist das in Ordnung, aber es ist **kein** Schutz gegen Schummeln. Wenn etwas wirklich
unerreichbar sein muss, pack es in eine globale Stage.
:::

Eine andere Mod kann ihre eigene Station auf die Liste setzen, indem sie eine ihrer Rezeptarten als
pro Spieler sperrbar anmeldet; der Editor bietet sie dann an wie die eingebauten. →
[Addon-Entwicklung](/api/addon-development) ·
[Global vs. individuell](/wiki/start-here/global-vs-individual#per-player-recipe-locks-and-where-they-stop)

Amboss, Webstuhl und Kartentisch stehen auf keiner der beiden Listen: Sie arbeiten gar nicht mit
Rezepten, also gibt es keine Rezept-ID, die man aufschreiben könnte.

Der Hauptschalter für Rezept-Sperren pro Spieler ist `lockRecipes` in
[gameplay.toml](/wiki/server/config-files/gameplay-toml#individual_stages), standardmäßig an.

## Was Spieler sehen {/* #what-players-see */}

![Ein gesperrtes Rezept in JEI](/img/ingame/jei-locked-recipe.webp)

**In JEI und EMI** bekommt ein gesperrtes Rezept ein Schloss-Overlay, statt zu verschwinden. Der Sinn
ist, dass Spieler sehen, dass es Fortschritt gibt. Zwei Einstellungen ändern das:

| Einstellung | Standard | Wirkung |
| :--- | :--- | :--- |
| `hideLockedItemsInJei` | `false` | Entfernt gesperrte Items ganz aus der Zutatenliste, in JEI und EMI. |
| `hideLockedRecipesInJei` | `false` | Versteckt gesperrte Rezepte. JEI erfasst Vanilla-Rezeptarten über ihr Ergebnis; EMI versteckt jedes Rezept, das das Schloss tragen würde, auch solche, die per ID oder über eine gesperrte Flüssigkeit gesperrt sind. |
| `lockedItemMultiStagePolicy` | `STRICT` | Für Items in mehreren Stages: `STRICT` hält sie gesperrt, solange irgendeine zugewiesene Stage gesperrt ist; `LENIENT` gibt sie frei, sobald irgendeine offen ist. |

Die Namen sagen noch JEI, weil sie älter sind als die EMI-Unterstützung, und ein Umbenennen würde
bestehende Configs kaputtmachen. → [Mod-Kompatibilität](/wiki/server/mod-compatibility#recipe-viewers--jei-and-emi)

→ [visual.toml](/wiki/server/config-files/visual-toml#jei_hiding)

**Im Vanilla-Rezeptbuch** sind gesperrte Rezepte standardmäßig versteckt (`hideLockedRecipesInBook`).
Vor 6.0.0 blieben sie sichtbar und ließen sich einfach nicht herstellen; schaltest du die Einstellung
ab, bekommst du dieses Verhalten zurück. Das Buch gehört einem Spieler und wird pro Spieler gefiltert,
also erreicht es auch eine individuelle Stage. →
[visual.toml](/wiki/server/config-files/visual-toml#recipe_book)

Die Nachricht, die ein Spieler bekommt, wenn er im Buch auf ein gesperrtes Rezept klickt, ist
`recipeLocked` unter [`[lock_messages]`](/wiki/server/config-files/visual-toml#lock_messages).

## Rezept-IDs finden {/* #finding-recipe-ids */}

Die Rezept-Auswahl im [Editor im Spiel](/wiki/in-game-tools/in-game-editor) ist der zuverlässige Weg:
Sie listet echte, geladene Rezepte, zeigt Zutaten und Ergebnis von jedem und kann keine ID erzeugen,
die es nicht gibt. In einer individuellen Stage bietet sie nur die Rezeptarten an, die pro Spieler
gesperrt werden können, und sagt das unter dem Raster.

IDs von Hand zu schreiben geht auch. Es sind die IDs, die Datapacks und Mods registrieren, etwa
`minecraft:iron_pickaxe`.

## Per Skript erzeugte Rezepte wandern {/* #script-generated-recipes-move */}

:::danger[KubeJS nummeriert Rezepte in der Reihenfolge, in der es sie sieht]
`kubejs:crafting_shaped_7` ist das siebte geformte Rezept in deinen Skripten. Sortierst du ein Skript
um, verschiebt sich die Nummerierung, und jede Stage, die die alte ID gesperrt hat, geht still kaputt.
:::

Seit 6.0.0 prüft History Stages das. Nach jedem Laden einer Welt und jedem `/reload` vergleicht es die
Rezept-IDs in deinen Stages mit den Rezepten, die tatsächlich geladen wurden, und schreibt für jedes
fehlende eine Warnung. Diese Einträge erscheinen im Editor im Reiter Rezepte der Stage in **Rot**.

Entfernt wird nichts, denn ein Rezept kann aus gutem Grund eine Weile fehlen, aber du erfährst es am
selben Tag und nicht erst, wenn ein Spieler fragt, warum er etwas herstellen kann, was er nicht sollte.

Ganz vermeiden lässt es sich, wenn du deinen Rezepten feste IDs gibst:

```javascript
ServerEvents.recipes(event => {
    event.shaped('4x minecraft:stick', ['A', 'A'], { A: 'minecraft:oak_planks' })
        .id('mypack:sticks')
})
```

Dann gehört die ID dir, sie wandert nie, und was du im Editor auswählst, bleibt. →
[Skripte](/wiki/server/scripting)

## Ein Rezept sperren, ohne sein Ergebnis zu sperren {/* #gating-a-recipe-without-gating-its-output */}

Nimm `recipe` aus der Sperre des Items heraus. `unlock_actions` listet, was frei bleibt, also:

```json
"items": [
  { "id": "minecraft:iron_ingot", "unlock_actions": ["recipe"] }
]
```

hält den Barren herstellbar, während alles andere daran gesperrt bleibt. Das Umgekehrte, nur das Rezept
zu sperren und sonst nichts, ist die Aufgabe des Felds `recipes`. →
[Unlock Actions](/wiki/locking/items-and-recipes/unlock-actions)

## Flüssigkeiten sperren auch Rezepte, und weiter als gedacht {/* #fluids-gate-recipes-too-and-further-than-you-expect */}

Ein [Flüssigkeits](/wiki/locking/items-and-recipes/fluids)-Eintrag hat zwei Rezept-Aktionen, nicht
eine: `recipe` für die Rezepte, die sie *herstellen*, und `ingredient` für die, die sie *verbrauchen*.
Beide sind an, solange sie nicht weggelassen werden, also nimmt `minecraft:water` ohne Eingrenzung jedes
Rezept heraus, das Wasser berührt. In einem großen Modpack ist das eine vierstellige Zahl.

Das ist auch die Antwort, wenn Rezepte verschwinden, die niemand aufgelistet hat.

## Siehe auch {/* #see-also */}

- [Items, Tags & Mods](/wiki/locking/items-and-recipes/items-tags-mods)
- [Rollen & Podeste beschaffen](/wiki/in-game-tools/research/obtaining): Rezepte *für* die eigenen
  Items von History Stages schreiben, was eine ganz andere Aufgabe ist.
- [Mod-Kompatibilität](/wiki/server/mod-compatibility): JEI, EMI und die Rezept-Browser.
