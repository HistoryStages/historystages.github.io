---
title: Auto-Triggers
description: "Registering your own notion of progress so a stage can unlock itself when it happens."
sidebar_position: 6
---

:::info
**API generation 6** · Requires History Stages **6.0.0+** on **NeoForge 1.21**, **Forge 1.20.1**
or **Fabric 1.21.1**.
:::

An **auto-trigger** answers "what unlocks this stage by itself?" — no pedestal, no command, no quest reward.

The built-in types cover entering a biome, crafting an item, killing something, and so on; they are listed with their JSON parameters on **[Stage Modes](/wiki/stage-file/stage-modes)**. An addon that owns some other notion of progress — a relic found, a ritual completed, a machine built — registers a type of its own, and from then on it travels the same path as a built-in: the same `auto_trigger` block in the stage file, the same editor, the same progress storage.

---

## Registering a trigger type

Registration happens on the mod event bus, once, while `RegisterTriggerTypesEvent` is being dispatched. From `DemoAddonCategory`:

```java
@SubscribeEvent
public static void onRegisterTriggerTypes(RegisterTriggerTypesEvent event) {
    if (!enabled()) return;
    event.register(TRIGGER_TYPE, RelicFoundTrigger.class, StageScope.GLOBAL);
    // Carries a number and no id, so it cannot be authored by picking from a list.
    event.register(RelicHoardTrigger.TYPE, RelicHoardTrigger.class);
}
```

There are two overloads:

| Overload | Scopes the type applies to |
| :--- | :--- |
| `register(String type, Class<? extends TriggerCondition> conditionClass)` | Both — global and individual |
| `register(String type, Class<? extends TriggerCondition> conditionClass, StageScope... scopes)` | Only the scopes passed; passing none throws |

Both forms enforce the same rules:

*   The type string must be **namespaced** (`mymod:relic_found`). Unnamespaced type strings belong to the built-ins and are rejected.
*   The type string must not already be taken.
*   Registering after the window has closed throws.
*   `conditionClass` must implement `TriggerCondition` and be deserialisable by Gson.

The type string ends up in stage files **and** in the identity hash player progress is stored against, so it can never change once shipped.

Narrowing the scopes is a real restriction, not a display filter. A type registered `GLOBAL` only:

*   is not offered in the editor's add menu while an individual stage is being edited, and
*   is not indexed for dispatch on individual stages, so it cannot fire there even if someone hand-writes it into the JSON.

---

## Writing the condition

The registered class is the trigger. `RelicFoundTrigger` is the whole thing:

```java
package net.bananemdnsa.historystages.demo;

import net.bananemdnsa.historystages.api.trigger.TriggerCondition;

/**
 * The stand-in addon's own auto-trigger: "this relic was found".
 *
 * <p>Shows what a trigger type from another mod has to provide — a stable type string and a
 * signature derived only from its values, because player progress is stored against that hash
 * and must survive the stage being edited.
 *
 * <p>Registered global-only ({@link DemoAddonCategory#onRegisterTriggerTypes}) purely to exercise
 * the scope-narrowing rule at least once — not because finding a relic could not sensibly unlock
 * an individual stage too. Do not copy the narrowing itself as a modelling example.
 *
 * @param relic which relic, by the same ids the demo category offers
 */
public record RelicFoundTrigger(String relic) implements TriggerCondition {

    @Override
    public String type() {
        return DemoAddonCategory.TRIGGER_TYPE;
    }

    @Override
    public long signature() {
        return defaultSignature(relic);
    }
}
```

| Member | Provided by | Purpose |
| :--- | :--- | :--- |
| `type()` | You | The discriminator written into the stage file |
| `signature()` | You | The stable 64-bit identity progress is stored against |
| `defaultSignature(String value)` | `TriggerCondition` | Default derivation: a stable mix of `type()` and one string value |

`defaultSignature` takes a single value. A trigger carrying several — the way the built-in entity trigger carries an id and a submode — either passes a composite string (`id + "|" + subMode`) or overrides `signature()` outright.

A record's components become the fields of the trigger object in the stage file, with `"type"` written alongside them:

```json
{
  "type": "hsdemo:relic_found",
  "relic": "hsdemo:amber_pendant"
}
```

---

## Why signature() matters

A player's progress toward an auto-stage is stored per trigger, and the key it is stored under is `signature()` — not the trigger's position in the `"triggers"` array. That is the whole reason the hash exists.

Stage files get edited. A maintainer reorders the trigger list, deletes the second of five, adds one at the top, renames the stage, moves it into another folder. If progress were keyed by list index, every one of those edits would silently reassign half the players' partial progress to the wrong condition. Keying it by a hash of the trigger's own values means an untouched trigger keeps its identity no matter what happens around it.

So the rule for `signature()` is narrow and absolute: it must be derived **only from the trigger's own values**.

| Allowed | Not allowed |
| :--- | :--- |
| The `type()` discriminator | The index in the JSON array |
| The trigger's own fields (id, count, submode, …) | Which stage the trigger currently sits on |
| Anything stable across a restart | Memory addresses, identity hashes, runtime state |

`String.hashCode()` is safe here: the Java Language Specification fixes its result, which is why `defaultSignature` builds on it and why the value can be persisted.

---

## A warning the demo carries, and you must keep

`RelicFoundTrigger` is registered global-only **purely to exercise the scope-narrowing rule once**. It is not a modelling recommendation. Finding a relic could perfectly sensibly unlock an individual stage — the demo just needed one type somewhere in the codebase that proves narrowing works end to end.

The demo's own javadoc says it plainly:

> Do not copy the narrowing itself as a modelling example.

Narrow the scopes when your trigger genuinely cannot mean anything in the other one. The two-argument overload — both scopes — is the correct default, and what most addon triggers want.

---

## When there is nothing to pick

The free editor tier is a searchable list of ids: the maintainer picks one, and your factory turns it into a trigger. That covers any trigger whose only content is an id. It cannot cover a trigger that has no id at all.

```java
package net.bananemdnsa.historystages.demo;

import net.bananemdnsa.historystages.api.trigger.TriggerCondition;

/**
 * The stand-in addon's second auto-trigger: "this many relics have been found".
 *
 * <p>Exists to exercise the authoring escape hatch. It carries a number and no id at all, so the
 * free tier — a searchable list of ids — cannot author it: there is nothing to pick. Its editor
 * supplies a screen instead.
 *
 * @param count how many relics
 */
public record RelicHoardTrigger(int count) implements TriggerCondition {

    public static final String TYPE = "hsdemo:relic_hoard";

    @Override
    public String type() {
        return TYPE;
    }

    @Override
    public long signature() {
        return defaultSignature(String.valueOf(count));
    }
}
```

`RelicHoardTrigger` carries a number. There is no list of candidates to search and no id to pick out of one, so a picker has nothing to show. Registering the type is still enough to load, save and fire the trigger — but not enough to author one.

A trigger like this supplies an authoring screen instead, by overriding `TriggerEditor.authoringScreen(Screen parent, Consumer<TriggerCondition> onCreated)`. The addon returns a screen rather than opening one, because the editor owns how its overlays are shown. Returning `null` — the default — keeps the built-in id picker.

`RelicHoardTrigger` is a number, so its editor returns a `CountInputScreen` and is done in four lines:

```java
@Override
public Screen authoringScreen(Screen parent, Consumer<TriggerCondition> onCreated) {
    return new CountInputScreen(parent,
            Component.translatable("editor.historystages.demo.auto_trigger.relic_hoard"),
            "", 5, 1, 999,
            count -> onCreated.accept(new RelicHoardTrigger(count)));
}
```

### The third shape: one of a handful of named things

An id list and a number do not cover everything either. A trigger whose content is a small, fixed vocabulary — a rarity, a weather state, a difficulty — has nothing worth searching and nothing to count. Building a searchable list over three rows is ceremony; typing a number to mean "rare" is worse.

`ChoiceScreen` is that third shape. The demo's `RelicRarityTrigger` uses it:

```java
@Override
public Screen authoringScreen(Screen parent, Consumer<TriggerCondition> onCreated) {
    List<ChoiceOverlay.Option> rows = RelicRarityTrigger.RARITIES.stream()
            .map(rarity -> ChoiceOverlay.Option.of(
                    Component.translatable("editor.historystages.demo.rarity." + rarity).getString(),
                    () -> onCreated.accept(new RelicRarityTrigger(rarity))))
            .toList();
    return new ChoiceScreen(parent,
            Component.translatable("editor.historystages.demo.auto_trigger.relic_rarity"),
            rows);
}
```

Each row carries its own action, so a row is free to open the next question rather than finish — a choice, then a picker, then a count is three panels in a row. `ChoiceOverlay.Option.more(...)` marks a row that leads onwards with a chevron. Worth using: a row that looks final but opens another panel is the kind of surprise that makes people stop trusting the first click.

So there are three tiers, and an addon should reach for the first one that fits:

| The question | What to use |
| :--- | :--- |
| "Which of these hundreds of ids?" | `TriggerEditor.ofIdList` — one call, no UI code |
| "How many?" | `authoringScreen` returning a `CountInputScreen` |
| "Which of these four?" | `authoringScreen` returning a `ChoiceScreen` |

Anything none of these fit is an `AbstractInputScreen` of your own — several fields, live validation, one confirm.

→ How to build that screen, and the widgets to build it from: **[Editor Toolkit](./editor-toolkit.md)**.

---

→ [Addon Development](./addon-development.md)
