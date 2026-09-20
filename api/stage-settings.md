---
title: Stage Settings
description: "Your own settings on every stage, stored in the stage file and travelling with the pack."
sidebar_position: 7
---

:::info
**API generation 6** · Requires History Stages **6.0.0+** on **NeoForge 1.21** or **Forge 1.20.1**.
The addon platform does not exist on Fabric yet.
:::

A settings group attaches your own settings to **every stage** — not to the mod, to the individual stage.

A packmaker opening the Bronze Age gets a card with your fields on it, fills them in, and gets different values on the Iron Age. History Stages draws the fields, validates them, stores them in the stage's JSON file, and syncs them. You declare what they are and read them back.

## The field kinds

`SettingKind` is a closed set of seven. It is closed on purpose: History Stages renders, validates and stores every field itself, so a kind it does not know is a kind it cannot draw.

| Kind | Stored as | Factory | Demo field |
| :--- | :--- | :--- | :--- |
| `BOOL` | `Boolean` | `Setting.bool(key)` | `ENABLE_LOOTING` |
| `INTEGER` | `Integer` | `Setting.integer(key)` | `RESPAWN_DELAY` |
| `TEXT` | `String` | `Setting.text(key)` | `WELCOME_MESSAGE` |
| `CHOICE` | `String` | `Setting.choice(key)` | `DIFFICULTY_MODE` |
| `ITEM` | `String` (item id) | `Setting.item(key)` | `REWARD_ITEM` |
| `LONG_TEXT` | `String` | `Setting.longText(key)` | `LORE` |
| `CUSTOM_SCREEN` | `String` | `Setting.customScreen(key)` | `RELIC_LAYOUT` |

Every field needs a `defaultValue` and a `langKey`; `build()` throws without either. An `INTEGER` field additionally needs a `.range(min, max)` that contains its default, and a `CHOICE` field needs at least one `.option(...)`, one of which has to be the default.

An `ITEM` field stores the item id as a plain string rather than a Minecraft type. The declaration layer does not depend on Minecraft, and `ITEM` already tells the editor to draw an item picker, so a richer type would buy no extra safety.

Two of the demo's fields carry more than a table row can:

```java
private static final Setting<String> DIFFICULTY_MODE = Setting.choice("difficulty_mode")
        .defaultValue("easy")
        .langKey("settings.hsdemo.settings.field.difficulty_mode")
        .option("easy", "settings.hsdemo.settings.field.difficulty_mode.option.easy")
        .option("hard", "settings.hsdemo.settings.field.difficulty_mode.option.hard")
        .build();
```

`.option(value, langKey)` is repeatable and keeps declaration order, which is the order the dropdown shows. The value is what lands in the JSON file; the lang key is what the packmaker reads. Declaring the same value twice throws.

```java
private static final Setting<String> LORE = Setting.longText("lore")
        .defaultValue("")
        .langKey("settings.hsdemo.settings.field.lore")
        .hintLangKey("settings.hsdemo.settings.field.lore.hint")
        .placeholder("{player}")
        .placeholder("{stage}")
        .build();
```

`LONG_TEXT` is a `String` like `TEXT`, but it is drawn as a button that opens the mod's wrapping, previewing text dialog instead of a one-line edit box — for values that carry format codes or placeholders, which are otherwise edited blind. `hintLangKey` is the greyed-out hint shown inside the text area; each `placeholder` is a literal token offered to the packmaker as a button in that dialog. `placeholder` is repeatable, keeps declaration order, and rejects a blank or duplicate token. Both are meaningful only on `LONG_TEXT`.

## Building the group

```java
public static StageSettingsGroup build() {
    return StageSettingsGroup.builder(GROUP_ID)
            .titleLangKey("settings.hsdemo.settings.title")
            .field(ENABLE_LOOTING)
            .field(RESPAWN_DELAY)
            .field(WELCOME_MESSAGE)
            .field(DIFFICULTY_MODE)
            .field(LORE)
            .field(REWARD_ITEM)
            .field(RELIC_LAYOUT)
            .build();
}
```

Registering it is one line in a `RegisterStageSettingsGroupsEvent` handler:

```java
@SubscribeEvent
public static void onRegisterGroups(RegisterStageSettingsGroupsEvent event) {
    event.register(build());
}
```

The demo builds the group in a method of its own rather than inline in that handler, **because tests call it without Minecraft on the classpath**. That is a pattern worth copying. `Setting`, `StageSettingsGroup` and `SettingsValues` name no Minecraft type, so an addon that keeps its group construction free of Minecraft types can unit-test the whole declaration — that the ranges are right, that a choice default is among its options, that the group builds at all — with no game running. Built inline inside an `@SubscribeEvent` method, the same check needs the event class, and the event class drags in the mod bus.

Registration is legal only while the event is being dispatched. When dispatch ends the registry freezes, so everything that walks it — the settings screen's card layout, the lang parity check, sync — may assume the list never changes afterwards. An always-open registry would let a server and a client disagree about which groups exist.

:::note
**Note:** The group id has to be namespaced with your own mod id (`yourmodid:trades`). `build()` rejects an id without a namespace, an id in the reserved `historystages` namespace, a group without a `titleLangKey`, and a group with no fields. Two fields sharing a key in one group throw as well.
:::

## Scopes

Both the group and each field declare which stage scopes they apply to, and the **intersection** decides what a packmaker sees.

| Level | Builder call | Accessor | Default |
| :--- | :--- | :--- | :--- |
| Group | `StageSettingsGroup.Builder.supportedScopes(StageScope...)` | `StageSettingsGroup.supportedScopes()` | both scopes |
| Field | `Setting.Builder.supportedScopes(StageScope...)` | `Setting.supportedScopes()` | both scopes |

Both take a varargs of `StageScope` (`GLOBAL`, `INDIVIDUAL`), both default to supporting both, and both throw when passed nothing at all — a group or field that supports no scope could never be shown.

The editor applies them in that order. It asks for the groups that support the scope of the stage being edited, then, inside a group it kept, skips every field whose own `supportedScopes()` does not contain that scope — a field declares its scope independently of its group's. A card left with no rows at all is dropped rather than rendered as an empty header.

Values stored for the wrong scope are never deleted. An individual stage carrying a block for a group that supports only `GLOBAL` produces a load-time warning saying the values are ignored but kept in the file; an out-of-scope *field* inside an in-scope group simply becomes an unclaimed key, which the mechanism below preserves. The reasoning is the same in both cases: the data belongs to another mod whose scope declaration may change on its next update, so ignoring it is reversible and deleting it is not.

## Where the values are stored

In a separate top-level block called `addon_settings` in the stage's JSON file, keyed by group id:

```json
{
  "display_name": "Bronze Age",
  "addon_settings": {
    "hsdemo:settings": {
      "enable_looting": true,
      "respawn_delay": 40,
      "difficulty_mode": "hard"
    }
  }
}
```

This is deliberately **not** the `addons` block. That block has one documented owner — the lock categories (→ [Lock Categories](./lock-categories.md)) — and a settings-group id that happened to equal a category id would have silently overwritten it.

Only values that differ from their field's default are written. When nothing differs, the group's block is dropped instead of being stored as `{}`, and a stage with no addon settings at all gains no `addon_settings` key.

**A key that no registered field claims is preserved verbatim** and written straight back out on the next save. So is a whole group block whose addon is not installed, because the block is held as raw JSON until a registered group asks for it. Together that is the packmaker payoff: a stage file can be opened, edited and saved on an instance running an older version of your addon, or no version of it at all, and the data that instance could not interpret is still in the file afterwards.

Reads are forgiving for the same reason — stage files get hand-edited. A value that is missing, the wrong type, or not among a choice's declared options falls back to that field's default; an integer outside its range is clamped into it. A malformed value never takes the group, or the stage, down with it.

The group itself is the accessor: `load(stage, scope)` returns a `SettingsValues`, `values.get(FIELD)` reads one field and never throws, `values.set(FIELD, value)` writes one, and `store(stage, values)` puts them back on the stage. Passing the `Setting` constant rather than a key string is the point — a typo is a compile error instead of a value that silently stays at its default.

## The custom-screen escape hatch

When none of the fixed kinds expresses what you need, `CUSTOM_SCREEN` lets the addon draw the editor itself:

```java
public static final Setting<String> RELIC_LAYOUT = Setting.customScreen("relic_layout")
        .defaultValue("")
        .langKey("settings.hsdemo.settings.field.relic_layout")
        .build();
```

The value stays a plain `String`, so nothing about reading, writing, syncing or scoping it is new — those are all paths that already existed. What the string means is the addon's own business; only the editing is yours to build. The field renders as a button that opens the screen you registered.

Registering the screen is a separate, client-only step: the declaration above is common-side, because the server reads and syncs the value, while a screen is pure UI and must never be reachable from server code. You register against the `Setting` constant itself, not against its key string, so there is no name to mistype. A field whose screen was never registered renders as a disabled button — it cannot be edited, which is the honest outcome rather than opening nothing.

→ How to register it: **[Editor Toolkit](./editor-toolkit.md)**.

## How this differs from a config section

The two look alike — a builder, a namespaced id, a list of typed fields, a card in a screen — and they answer different questions.

| | Stage setting | Config section |
| :--- | :--- | :--- |
| The value belongs to | one stage | the addon |
| Who stores it | History Stages, in the stage's JSON file | the addon, wherever it keeps its config |
| How many values exist | one per stage | one |

A stage setting is per-stage data that History Stages persists for you. A config section stores nothing at all: it declares fields and hands History Stages the addon's own read and write callbacks, so an existing config gets a section in the config screen.

If the answer can be different on the Bronze Age than on the Iron Age, it is a stage setting. If it is one answer for the whole install, it is a config value. → [Config Sections](./config-sections.md).

→ [Addon Development](./addon-development.md)
