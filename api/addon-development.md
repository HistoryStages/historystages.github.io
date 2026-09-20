---
title: Addon Development
description: "Registering your own gated content, requirements and editor tabs from another mod, with no fork and no mixin."
sidebar_position: 3
---

:::info
**API generation 6** · Requires History Stages **6.0.0+** on **NeoForge 1.21** or **Forge 1.20.1**.
The addon platform does not exist on Fabric yet.
:::

**History Stages 6.0.0** is an addon platform: another mod can register its own kind of gated content, its own way to earn a stage, and its own tabs in the in-game editor, without a fork and without a mixin.

## What you can plug into

| Extension point | What it does | Page |
| :--- | :--- | :--- |
| Lock category | gate a new kind of thing | → [Lock Categories](./lock-categories.md) |
| Requirement | a new way to earn a stage | → [Requirements](./requirements.md) |
| Auto-trigger | unlock a stage automatically | → [Auto-Triggers](./auto-triggers.md) |
| Stage settings group | your own settings on every stage | → [Stage Settings](./stage-settings.md) |
| Config section | your own section in the config screen | → [Config Sections](./config-sections.md) |

Two smaller windows sit beside them, both about recipes and both optional: → [Recipe types](#recipe-types).

Each one is a mod-bus event named `Register…Event`, fired once during mod loading. There is no static facade beside them and no registration method on `HistoryStagesAPI` — the events are the whole entry point.

Reading which stages a player has unlocked, and reacting when that changes, is not an extension point: it is a plain API surface any mod can call, addon or not. → [Stage State & Events](./stage-state-and-events.md).

What you write to plug in is plain Java. A lock category, a requirement, a trigger condition or a settings group names no loader at all — of everything under `api`, only the eleven `Register…Event` classes, `StageEvent` and `StageStates` name a loader at all, and `ApiLoaderLeakGuardTest` fails if a fourteenth appears. That is also why the same addon code compiles against the NeoForge 1.21 and the Forge 1.20.1 build — those thirteen classes are what differs between them.

## Two layers

Where you plug in and how it looks are separate decisions. The five extension points above decide what your addon adds; the editor toolkit decides what a packmaker sees, and the same toolkit serves all five. A lock category and a requirement build their tab out of the same rows, search bars, pickers, and input screens. That is why an addon's tab looks like it shipped with the mod — it is literally the same widgets the built-in tabs are made of.

→ Widgets, tab hooks, and the two editor tiers: **[Editor Toolkit](./editor-toolkit.md)**.

## Adding the dependency

```gradle
repositories {
    maven { url "https://api.modrinth.com/maven" }
}

dependencies {
    implementation "maven.modrinth:history-stages:6.0.0-1.21.1"
}
```

The version string is the Modrinth version, so it carries the loader: `6.0.0-1.21.1` is the NeoForge build, `6.0.0-1.20.1` the Forge one.

History Stages has **Lootr** as a required dependency, so your dev environment needs it too — History Stages will not load without it. See [Mod Compatibility](/wiki/server/mod-compatibility) for why.

## Declaring it in your mods.toml

On NeoForge 1.21 that file is `META-INF/neoforge.mods.toml`:

```toml
[[dependencies.yourmodid]]
modId="historystages"
type="required"
versionRange="[6.0,7.0)"
ordering="AFTER"
side="BOTH"
```

On Forge 1.20.1 it is `META-INF/mods.toml`, and the required flag is spelled differently:

```toml
[[dependencies.yourmodid]]
modId="historystages"
mandatory=true
versionRange="[6.0,7.0)"
ordering="AFTER"
side="BOTH"
```

The API generation equals the mod's major version: 6.x is generation 6, and a breaking change to anything under the `api` package waits for 7.0. That is what makes this `versionRange` the API check. The loader performs it at load time, before any addon code runs, so a mismatch is refused with a loader error the player can read instead of a `NoSuchMethodError` at the first call.

`HistoryStagesAPI.API_VERSION` reports the same number — 6 — for a log line or a crash report. It is not a second gate, and there is deliberately no `requireAtLeast(...)` to call: by the time your code could run such a check, the loader has already made the decision.

`ordering="AFTER"` is needed because the registration events come from History Stages. Your mod has to load after the mod that fires them.

## Hello world: gate something

```java
@EventBusSubscriber(modid = "yourmodid", bus = EventBusSubscriber.Bus.MOD)
public final class MyLocks {

    public static final String CATEGORY_ID = "yourmodid:quest_rewards";

    @SubscribeEvent
    public static void onRegisterCategories(RegisterLockCategoriesEvent event) {
        event.register(AddonLockCategory.<String>builder(CATEGORY_ID)
                .tabLangKey("editor.yourmodid.tab.quest_rewards")
                .tooltipLangKey("editor.yourmodid.tooltip.quest_rewards")
                .storage(CategoryStorage.gson(String.class))
                .matcher(String.class, String::equals)
                .build());
    }
}
```

**What that already gets you:** the category has its own tab in the stage editor, a packmaker can add entries to it there, and the values are written into the `addons` block of the stage's JSON file. A stage file opened, edited, and saved on an instance that does not have your addon installed round-trips that block untouched, so entries survive an editing pass that could not interpret them.

**What is still missing: asking.** Nothing is gated yet. History Stages has no idea when a quest reward is about to be handed out — the addon owns that moment, hooks it itself, and calls `CategoryLocks.isLockedForPlayer(...)` there. Which stages to consult, global versus individual, and what this player has unlocked all stay on the History Stages side. → [Lock Categories](./lock-categories.md).

:::note
**Note:** The `historystages` namespace is reserved for the built-in categories. An addon namespaces its ids with its own mod id (`yourmodid:quest_rewards`); `build()` rejects an id that has no namespace or uses the reserved one.
:::

:::note
**This example used to gate villager trades, and no longer does.** Merchant offers are a built-in category now — `historystages:trades`, `historystages:trade_professions` and `historystages:trade_levels`, all three sharing one editor tab — so an addon reaching for them would be rebuilding what ships. The pattern is unchanged; only the example moved to something History Stages still knows nothing about.
:::

## Recipe types

Neither of these adds anything. They describe recipe types History Stages already sees, so it
stops guessing about them. Both are optional, and both are fired once.

### What your recipe type looks like in the editor

`RegisterRecipeTypeMetaEvent`, fired during **client setup**.

```java
modEventBus.addListener(RegisterRecipeTypeMetaEvent.class, event -> event.register(
        new RecipeTypeMeta("mymod:assembling", "mymod:assembler", 0xFF3399FF,
                "recipe_type.mymod.assembling")));
```

Without it your recipes still appear in the recipe picker and still lock. They simply draw with
no workstation icon, a neutral accent, and their registry id where a name would be. Registering
here is cosmetic, not functional.

`RecipeTypeMeta` takes four things:

| Field | Meaning |
| :--- | :--- |
| `typeId` | registry id of the recipe type, e.g. `mymod:assembling` |
| `workstationItemId` | **item** id standing for the station, or `""` for none |
| `accentColor` | ARGB, drawn as the bar down the left of every card of this type |
| `nameLangKey` | lang key for the display name, or `""` to fall back to the registry id |

The station is an item id rather than an `ItemStack` on purpose. The table is read on the unit
test classpath, which carries no Minecraft at all; the renderer resolves the id when it draws.

Client setup rather than common setup, unlike every registration event that gates or stores:
everything here is UI, so a listener registered on a dedicated server is never called.

### That your recipe type can be gated per player

`RegisterIndividualRecipeSupportEvent`, fired during **common setup** — this one gates and
stores, so a dedicated server needs it too.

```java
modEventBus.addListener(RegisterIndividualRecipeSupportEvent.class,
        event -> event.register("mymod:assembler"));
```

:::tip
**Only register a type whose station has its own menu.** An individual stage gates a recipe by
asking who is crafting, and that question has an answer only while a player is standing at the
station with its screen open. A furnace, a hopper or an autocrafter resolves recipes with nobody
there. Registering such a type makes the editor offer a per-player lock that cannot work: the
entry is written to the stage file and then silently does nothing.
:::

Vanilla seeds three — crafting, stonecutting and smithing. Everything else is global-only, which
is why the recipe picker on an individual stage offers fewer recipes than on a global one, and
says so above the list.

### Both tables freeze

Registration is legal only inside the listener. When dispatch ends the registry is frozen, and
every reader — the picker, the card renderer, the load-time audit — may treat it as constant from
then on.

## The worked example

The demo addon lives in the mod's own source tree, under `net.bananemdnsa.historystages.demo`. It is a stand-in for a fictional relics mod, written the way a real addon would be written, and it exercises all five extension points:

| Class | What it registers |
| :--- | :--- |
| `DemoAddonCategory` | the lock category `hsdemo:relics`, plus two auto-trigger types |
| `DemoRequirement` | the requirement `hsdemo:relic` — "hand in N of a relic" |
| `DemoSettingsGroup` | the stage settings group `hsdemo:settings`, covering every setting kind including the custom-screen escape hatch |
| `DemoConfigSections` | one client and one common config section, covering all eleven config field kinds an addon can declare |
| `DemoAddonCategoryEditor` | the client half: the editor tabs for the above |

It also shows both editor tiers side by side. `CategoryEditor.ofIdList` is a single call that gives a category of bare ids a tab which looks and behaves like a built-in; `DemoCategoryTab` and `DemoRelicSetEditor` are tabs that draw themselves, with taller rows, a colour block per entry, and a button inside the row that reorders entries — real editing, since entry order is stored in the stage file.

The demo is off unless the game is started with `-Dhistorystages.demoCategory=true`, which the client, server, and gametest run configurations set. It never exists for a player.

Two tests keep it honest. `DemoUsesOnlyApiTest` fails if the demo has to reach past the `api` package — whatever the demo needs, a real addon needs too. `ApiSurfaceGuardTest` fails if a type under `api` names an internal type in a public signature, which would drag that type into the contract whether anyone meant it or not.

## Documentation versions

These pages describe API generation 6. When 7.0 arrives, they will be copied to `Addon-API-6-*` and the live pages move on to generation 7, so a link you save today keeps describing the API you built against.
