---
title: Config Sections
description: "Your own rows in the History Stages config screen, with the values staying in your own config."
sidebar_position: 8
---

:::info
**API generation 6** · Requires History Stages **6.0.0+** on **NeoForge 1.21** or **Forge 1.20.1**.
The addon platform does not exist on Fabric yet.
:::

**A config section gives an addon its own rows in the History Stages config screen.**

Registered sections appear under an **Addons** tab, one card per section, in an order sorted by section id rather than by mod load order — so every instance shows the same list in the same order. The tab exists only when at least one section is registered.

## The asymmetry, and why

This is the one thing to get right about config sections, because the neighbouring extension point looks identical and is not.

*   A **stage setting** (→ [Stage Settings](./stage-settings.md)) belongs to the stage, and **History Stages stores it** — it is written into that stage's JSON file, travels with the pack, and survives an editing pass on an instance that does not have your addon.
*   A **config value** belongs to the addon, and **the addon stores it** — in the addon's own config file, under the addon's own keys.

History Stages lends the screen and nothing more. A section declares a `read()` and a `write()` callback per field: the screen calls `read()` to fill the row and `write()` to hand a new value back. The mod never owns the value, never has a copy of it, and has nowhere to put one — there is no `historystages` file that addon config values end up in.

## Registering a section

`RegisterConfigSectionsEvent` is fired once on the mod event bus during loading. Registration is legal only while it is being dispatched; afterwards the registry freezes for good, so that a server and a client cannot end up disagreeing about which sections exist.

```java
@EventBusSubscriber(modid = "yourmodid", bus = EventBusSubscriber.Bus.MOD)
public final class MyConfigSections {

    @SubscribeEvent
    public static void onRegisterConfigSections(RegisterConfigSectionsEvent event) {
        event.register(buildClientSection());
    }

    private static AddonConfigSection buildClientSection() {
        return AddonConfigSection.builder("hsdemo:display")
                .titleLangKey("config.hsdemo.display.title")
                .side(ConfigSide.CLIENT)
                .field(AddonConfigField.bool("showRelicGlow")
                        .labelLangKey("config.hsdemo.display.field.showRelicGlow")
                        .descLangKey("config.hsdemo.display.field.showRelicGlow.desc")
                        .defaultValue("true")
                        .read(() -> Boolean.toString(showRelicGlow))
                        .write(v -> showRelicGlow = Boolean.parseBoolean(v))
                        .build())
                .field(AddonConfigField.text("nickname")
                        .labelLangKey("config.hsdemo.display.field.nickname")
                        .descLangKey("config.hsdemo.display.field.nickname.desc")
                        .defaultValue("")
                        .read(() -> nickname)
                        .write(v -> nickname = v)
                        .build())
                .field(AddonConfigField.color("relicGlowColor")
                        .labelLangKey("config.hsdemo.display.field.relicGlowColor")
                        .descLangKey("config.hsdemo.display.field.relicGlowColor.desc")
                        .defaultValue("#FFD700")
                        .read(() -> relicGlowColor)
                        .write(v -> relicGlowColor = v)
                        .build())
                .build();
    }
}
```

That is `DemoConfigSections.buildClientSection()` trimmed to three fields for readability; the full version declares five, and the demo's second section another six. Both are in `net.bananemdnsa.historystages.demo.DemoConfigSections`.

What the builders insist on:

*   **The section id must be namespaced** (`yourmodid:display`). `historystages` is reserved for the mod's own sections and `build()` rejects it, as it rejects an id with no namespace at all.
*   A section needs a `titleLangKey`, a `side`, and at least one field. A field needs a `labelLangKey`, a `defaultValue`, a `read()` and a `write()`. `descLangKey` is the only optional one; a field without it simply shows no description line.
*   Labels, descriptions and choice options are **lang keys**, not literal text. They are your addon's keys and ship in your addon's lang files.
*   Every value crossing this boundary is a `String`, in both directions. The typed value stays on your side; the screen is string-based end to end.

## What read() and write() should do

Talk to your own config spec, and nothing else.

The demo keeps its values in plain `private static` fields. That is **a shortcut for a demo that has nothing to persist to, not something to copy** — the demo addon has no config file of its own, so a static field is the only place a value could go. A real addon has its own config spec — NeoForge's `ModConfigSpec` or whatever equivalent it already uses — and its `read()` and `write()` callbacks talk to that spec directly, the same way `CommonConfigSync` talks to this mod's own `Config`. Storing to a static field in a real addon means the setting is forgotten on the next restart, which will look like a History Stages bug and will not be one.

Two things worth knowing about when the callbacks run:

*   `read()` is called when the screen builds its rows, to show what is stored today.
*   `write()` is called on save, and **only for a field whose value actually changed**. It is your code; calling it for every field on every save would hand it work it never asked for.

## CLIENT and COMMON

A section declares one `ConfigSide` for all of its fields. The two rows look the same in the screen and behave completely differently, which is exactly why the side is declared once per section instead of once per field.

| Side | Where the value is written | What comes with it |
| :--- | :--- | :--- |
| `ConfigSide.CLIENT` | on the player's own client, straight into your `write()` | nothing is sent anywhere; the value is local to that player |
| `ConfigSide.COMMON` | on the server, then on every client | the mod's save packet, the `hasPermissions(2)` check, and distribution to all clients |

A COMMON section is published into the mod's own config sync (`CommonConfigSync`) as soon as the registry freezes, under the wire key `sectionId.fieldKey`. From there it inherits the whole existing path: the admin's edit travels in the save packet, the server refuses it unless the sender `hasPermissions(2)`, your `write()` runs server-side, and the new value is then synced out to every connected client, where your `write()` runs again. You do not write any networking for this — declaring the side is the whole of it.

Pick COMMON for anything that decides game behaviour and has to be the same for everyone, CLIENT for anything cosmetic or personal.

## No scopes here

Config sections deliberately have **no scope concept**, and that is not an omission.

Every other extension point declares `supportedScopes(...)` over `StageScope.GLOBAL` and `StageScope.INDIVIDUAL`, because the thing it describes hangs off a stage, and a stage is either unlocked once for the world or once per player. A config value hangs off nothing: it is your addon's setting, not a property of any stage, so there is no per-stage notion to narrow it to. Global is global.

`ConfigSide` is not a scope in disguise either. It decides which machine owns the value, not which stage map a question is asked against.

## Field kinds

`AddonConfigField.AddonConfigKind` has **twelve** constants. Eleven have a factory method on `AddonConfigField` and are listed here; the twelfth, `CUSTOM_SCREEN`, is covered below.

| Kind | Factory | What the editor shows |
| :--- | :--- | :--- |
| `BOOL` | `AddonConfigField.bool(key)` | A toggle flipped in the row itself, no dialog. |
| `INTEGER` | `AddonConfigField.integer(key)` | A number input dialog, clamped to `.range(min, max)`. |
| `DECIMAL` | `AddonConfigField.decimal(key)` | A decimal input dialog, clamped to `.range(min, max)`. |
| `TEXT` | `AddonConfigField.text(key)` | A plain single-line text dialog, up to 256 characters. |
| `RICH_TEXT` | `AddonConfigField.richText(key)` | The formatted-text dialog: `&`-style colour codes, plus one insert button per `.placeholder(token)` you declared. |
| `COLOR` | `AddonConfigField.color(key)` | A `#RRGGBB` picker — hex field, hue bar, saturation/value area, and swatches for the current and the default value. |
| `ITEM` | `AddonConfigField.item(key)` | A searchable item picker; stores one item id. |
| `ITEM_LIST` | `AddonConfigField.itemList(key)` | A list screen with add and remove, backed by the same item picker; stored as a comma-separated string. |
| `TAG_LIST` | `AddonConfigField.tagList(key)` | A list screen with add and remove, backed by a tag search; stored as a comma-separated string. |
| `TEXTURE` | `AddonConfigField.texture(key)` | A searchable grid of block textures; stores a texture path such as `minecraft:textures/block/gold_block.png`. |
| `CHOICE` | `AddonConfigField.choice(key)` | A dropdown anchored to the row, one entry per `.option(value, langKey)`, in declaration order. |

`.range(...)` is meaningful only for `INTEGER` and `DECIMAL`, `.option(...)` only for `CHOICE`, `.placeholder(...)` only for `RICH_TEXT`. `build()` validates what it can up front: a numeric default outside its range, a choice default that is not among the declared options, or a choice field with no options at all are all rejected there rather than in the screen.

### CUSTOM_SCREEN, the escape hatch

`CUSTOM_SCREEN` is stored exactly like `TEXT` — a plain string — and edited in a screen your addon supplies. Because the storage is a string, nothing about storing, syncing or permissions is new: a COMMON `CUSTOM_SCREEN` field travels the same wire key and the same save packet as a `TEXT` one, and your `write()` receives a string either way. All that changes is who draws the editor.

The screen is registered separately, on `RegisterCustomFieldScreensEvent`, which fires client-side only and covers both axes — stage settings and config fields alike:

```java
modEventBus.addListener(RegisterCustomFieldScreensEvent.class, event -> event.register(
        MySettings.LAYOUT,
        (parent, current, onDone) -> new MyLayoutScreen(parent, current, onDone)));
```

The declaration and the screen are kept apart on purpose: a declaration is common-side, because the server may read and sync the value, while a screen is pure client UI that server code must never reach. Registration is keyed by the field object itself, so hold your field in a `static final` constant and register against that same constant — there is no key string to mistype. A field with no screen registered still shows its row and still syncs; it just cannot be edited there.

:::note
**Note:** In 6.0.0 as it stands, `AddonConfigField` has factory methods for the other eleven kinds but none for `CUSTOM_SCREEN`, and its `Builder` constructor is private — so a `CUSTOM_SCREEN` **config field** cannot be declared through the public API yet, even though the editor already renders and routes one. The equivalent on the stage-settings axis, `Setting.customScreen(key)`, does exist. → [Stage Settings](./stage-settings.md).
:::

### What the demo covers

`DemoConfigSections` exercises **eleven of the twelve** kinds, exactly once each, across its two sections. The one it does not cover is `CUSTOM_SCREEN` — for the reason above, it cannot. (Its own javadoc says "all eleven kinds", counting the kinds it can reach rather than the constants in the enum.) The custom-screen escape hatch is demonstrated on the stage-settings axis instead, by `DemoSettingsGroup` and `DemoRequirementEditor`.

→ [Addon Development](./addon-development.md)
