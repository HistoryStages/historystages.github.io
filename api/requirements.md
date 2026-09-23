---
title: Requirements
description: "Registering a new way to earn a stage, alongside the nine kinds that ship with the mod."
sidebar_position: 5
---

:::info
**API generation 6** · Requires History Stages **6.0.0+** on **NeoForge 1.21**, **Forge 1.20.1**
or **Fabric 1.21.1**.
:::

**A requirement answers the question "what must be done before this stage opens?".** Nine kinds ship with the mod, and an addon registers its own the same way.

| Requirement ID | What it demands | Scopes |
| :--- | :--- | :--- |
| `item` | Items handed in at the Research Pedestal. | Global, Individual |
| `item_tag` | An item tag handed in at the Research Pedestal — any member counts, until the first one decides which. | Global, Individual |
| `stage` | Another global stage is already unlocked. | Global, Individual |
| `individual_stage` | Another individual stage is already unlocked. | Global, Individual |
| `advancement` | The player has earned an advancement. | Individual |
| `xp_level` | The player has reached an experience level. | Individual |
| `entity_kill` | The player has killed a number of a given entity. | Individual |
| `stat` | A tracked Minecraft statistic has reached a value. | Individual |
| `scoreboard` | A scoreboard objective satisfies a numeric comparison. | Global, Individual |

Requirements sit inside dependency groups on a stage — every entry in a group has to be met before the group counts as satisfied. → [Stage Behavior](/wiki/stage-file/dependencies) covers the packmaker-facing side of that. Note that a requirement ID is a registry key, not a JSON field name: the built-ins keep their entries in typed fields whose names do not always match (`entity_kill` writes into `entity_kills`, `item_tag` into `item_tags`, `individual_stage` into `individual_stages`). Addon requirements have no such split — their ID is also the key they store under.

An addon requirement is stored, checked, and displayed exactly like a built-in. The one structural difference is where the entries live: a built-in is a view over a typed field on the dependency group, while an addon requirement has no such field and stores through the group's raw `addons` block instead — a map of requirement ID to raw JSON.

```json
{
  "dependencies": [
    {
      "addons": {
        "hsdemo:relic": [
          { "id": "hsdemo:amphora", "count": 3 }
        ]
      }
    }
  ]
}
```

A stage file edited or resaved on an instance that does not have the owning addon installed round-trips that block untouched, so the addon's data survives even when nothing on the running instance can interpret it.

## Registering a requirement type

Registration happens in a `RegisterRequirementTypesEvent` listener on the mod event bus. That is the only legal moment: when dispatch ends the registry freezes, and everything that walks it — the checker, the editor's tab strip, the graph's sections — may then assume the list never changes again.

```java
event.register(AddonRequirement.<IdCountEntry>builder(REQUIREMENT_ID)
        .tabLangKey("editor.historystages.demo.dep.tab.relics")
        .tooltipLangKey("editor.historystages.demo.dep.tooltip.relics")
        .sectionLangKey("editor.historystages.demo.graph.section.relics")
        .storage(RequirementStorage.gson(IdCountEntry.class))
        .displayKind(RequirementDisplay.Kind.COUNTED)
        .evaluator(DemoRequirement::check)
        .build());
```

| Builder method | Required | Description |
| :--- | :--- | :--- |
| `tabLangKey` | Yes | Lang key for the label of this requirement's tab in the dependency editor. |
| `tooltipLangKey` | Yes | Lang key for that tab's tooltip. |
| `sectionLangKey` | Yes | Lang key for this requirement's section heading in the stage graph's detail panel. |
| `storage` | Yes | How entries turn into JSON and back. `RequirementStorage.gson(Type.class)` covers the ordinary case in one line; a requirement with an awkward shape can implement the interface by hand. Reads must be forgiving — one malformed entry should cost that entry, not the whole group. |
| `displayKind` | No | How the graph may present this requirement: `COUNTED` (a `current/required` figure), `BINARY` (a status glyph only), or `DEPOSITED` (neither — the value is handed in at a pedestal and cannot be judged outside one). Defaults to `BINARY`. |
| `evaluator` | Yes | The addon's own logic: given one stored entry, is it satisfied and how far along? |

The ID must be namespaced (`mymod:relic`), and `historystages` is reserved for the built-ins. `build()` throws on a missing required field or a malformed ID, so a misconfigured requirement fails at startup rather than silently doing nothing. Registration also rejects an ID that is already taken, whether by a built-in or by another addon.

:::note
**Note:** Registering here is enough to *store* a requirement and to *gate* on it. It is not enough to *edit* it — a tab in the dependency editor is a separate, client-side registration, because History Stages cannot guess what a relic is nor which ones exist.
:::

## Writing the evaluator

The evaluator receives one stored entry plus a `RequirementContext` (the player, the level, the deposited NBT, the group's key, the booster cost reduction, and the scope) and returns a `RequirementOutcome`.

If your requirement remembers something between checks — anything a player hands in — write it into the deposited NBT under `ctx.progressKey("...")` rather than a key of your own. The suffix you pass identifies your requirement inside the group, so put something of your requirement's ID in it; the group is all that keeps two requirements' keys apart otherwise. The key names the group's identity, not its position, so what a player deposited stays with the requirement it was meant for when a packmaker reorders or deletes groups later.

```java
private static RequirementOutcome check(IdCountEntry entry, RequirementContext ctx) {
    int found = entry.id().length();
    return new RequirementOutcome(entry.id(), entry.count() + "x " + entry.id(),
            found >= entry.count(), found, entry.count());
}
```

The demo counts the letters of the relic ID. That is deterministic, needs no world state, and is enough to watch a requirement flip from open to met when the required amount is lowered past it. A real addon counts what the player actually has.

Returning `null` skips the entry, which is the right answer when the addon can tell the entry is meaningless — an ID that no longer exists, for instance.

```java
RequirementOutcome(String id, String description, boolean fulfilled, int current, int required)
```

| Component | Type | Description |
| :--- | :--- | :--- |
| `id` | String | The entry's machine ID, used for the tooltip icon. Never a display string. |
| `description` | String | Human-readable, already translated by the addon if it wants that. |
| `fulfilled` | boolean | Whether this entry is satisfied right now. |
| `current` | int | Progress towards `required`. Pass `fulfilled ? 1 : 0` when the requirement is a yes/no rather than a count. |
| `required` | int | What `current` is measured against. Pass `1` for a yes/no. |

History Stages turns the outcome into its internal `RequirementResult.EntryResult` itself. Addons deliberately do not build one: it has four constructors, and the shortest silently sets `id` to the empty string, which drops the tooltip icon to "unknown". Assembling it on the mod's side means an addon never has to pick an overload.

## Two shapes of entry

This is the structural idea worth understanding before writing anything.

*   An entry shaped like `IdCountEntry` — an ID plus a count — gets a working editor tab for **one registration call**. The searchable picker, the amount dialog, the row list, add, duplicate and remove, and saving into the stage file all come from having said which IDs exist and that entries carry an amount. No UI code at all.
*   An entry of your own shape needs a tab of its own.

**Registering the requirement is identical in both cases.** The difference lives entirely on the client side.

The demo's second requirement is the awkward one: two fields, neither of them a count.

```java
public record RelicSetDep(String relic, String rarity, int count) {

    /** An entry read from an older file has no count; one is the sensible reading of that. */
    public RelicSetDep {
        if (count < 1) count = 1;
    }

    public RelicSetDep withCount(int newCount) {
        return new RelicSetDep(relic, rarity, newCount);
    }

    /** The rarities a maintainer may cycle through, in order. */
    public static final java.util.List<String> RARITIES =
            java.util.List.of("common", "rare", "epic");

    public RelicSetDep withNextRarity() {
        int next = (RARITIES.indexOf(rarity) + 1) % RARITIES.size();
        return new RelicSetDep(relic, RARITIES.get(next), count);
    }
}
```

The compact constructor pulling `count < 1` up to `1` is worth copying. An entry read from an older file has no count, and Gson leaves an absent field at its default, so it deserialises as `0` — a required amount of zero, which is not what any file ever meant. One is the sensible reading of that. Normalising inside the record covers every path that builds one, deserialisation included, which is what any addon whose entry shape may grow a field later wants.

Registering it looks the same as the simple case:

```java
// The interesting one: two fields, neither a count. Nothing about registering it differs
// from the simple case — the difference is entirely on the client, where its editor has to
// supply a tab rather than take the free one.
relicSet = AddonRequirement.<RelicSetDep>builder(RELIC_SET_ID)
        .tabLangKey("editor.historystages.demo.dep.tab.relic_sets")
        .tooltipLangKey("editor.historystages.demo.dep.tooltip.relic_sets")
        .sectionLangKey("editor.historystages.demo.graph.section.relics")
        .storage(RequirementStorage.gson(RelicSetDep.class))
        .evaluator((entry, ctx) -> new RequirementOutcome(entry.relic(),
                entry.rarity() + " " + entry.relic(),
                "common".equals(entry.rarity()), 0, 1))
        .build();
event.register(relicSet);
```

Same builder, same event, same `RequirementStorage.gson`. Only `displayKind` differs, and only because a relic set is a yes/no rather than a count, so it stays at the `BINARY` default. Building the tab is → [Editor Toolkit](./editor-toolkit.md).

## Keep what you built

Note that the demo assigns the relic-set requirement to a field before registering it, rather than looking it up again later.

```java
/**
 * Kept rather than looked up again.
 *
 * <p>An addon that wants its own requirement back should hold on to what it built, not ask
 * the mod's registry for it. The registries are not part of the public surface, and this is
 * why they do not need to be: everything an addon would look up there, it owned a moment
 * earlier.
 */
private static AddonRequirement<RelicSetDep> relicSet;
```

The client-side editor needs the same `AddonRequirement` instance to read and write entries with, and holding the reference is how it gets one. `read(group)` and `write(group, entries)` are the two methods a tab calls; both are on the object the addon already owns.

## Scopes

`supportedScopes()` declares which stage scopes a requirement means anything in.

```java
default Set<StageScope> supportedScopes() {
    return EnumSet.allOf(StageScope.class);
}
```

The default is both `StageScope.GLOBAL` and `StageScope.INDIVIDUAL`. Restrict it on the builder:

```java
.supportedScopes(StageScope.INDIVIDUAL)
```

This is a fact about the data, not about the editor. A kill belongs to a player, so demanding one of a global stage has no answer — there is no single player to ask. That is why `advancement`, `xp_level`, `entity_kill`, and `stat` are individual-only among the built-ins.

The scope decides both which tabs the dependency editor offers and which requirements the checker evaluates, from the same source, so the two can no longer disagree. Passing no scopes at all throws — a requirement that supports no scope can never be demanded of anything.

→ [Editor Toolkit](./editor-toolkit.md) for building a tab for your own entry shape.
→ [Addon Development](./addon-development.md) for the entry point and the rest of the addon surface.
