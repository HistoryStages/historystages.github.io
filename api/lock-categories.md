---
title: Lock Categories
description: "Registering a new kind of gated thing, the way the eighteen built-in categories are registered themselves."
sidebar_position: 4
---

:::info
**API generation 6** · Requires History Stages **6.0.0+** on **NeoForge 1.21**, **Forge 1.20.1**
or **Fabric 1.21.1**. Everything marked **6.1** needs **6.1.0+ on NeoForge** until the Forge and
Fabric ports are out.
:::

**A lock category answers the question "what can be gated?" — and the eighteen things History Stages ships with are themselves categories, registered through the same path an addon uses.**

Items, tags, mods, structures, biomes, dimensions and the three entity locks are not hardcoded branches inside the lock engine. Each one is an entry in a registry that says three things: where its entries live on a stage, how they serialise, and how to recognise one of its subjects at runtime. Everything after that — walking the stages, global versus individual, skipping what the player has already unlocked, deduplicating the answer — happens on the mod's side, once, for built-ins and addons alike.

| Built-in category | Gates | Scopes |
| :--- | :--- | :--- |
| `historystages:items` | Item ids, optionally narrowed by NBT / data components | Global + Individual |
| `historystages:fluids` | What a stack is *carrying* — one entry covers the vanilla bucket, every modded bucket and every tank item | Global + Individual |
| `historystages:enchantments` | Enchantments a stack carries, from a level up, and the stations that apply them (6.1) | Global + Individual |
| `historystages:effects` | Potion effects a stack carries, from a level up, and the brewing stand (6.1) | Global + Individual³ |
| `historystages:tags` | Item tags | Global + Individual |
| `historystages:mods` | Every item from a mod id | Global + Individual |
| `historystages:mod_exceptions` | Carves items back out of a mod lock; gates nothing on its own | Global + Individual |
| `historystages:recipes` | Recipe ids | Global + Individual¹ |
| `historystages:dimensions` | Dimension ids | Global + Individual |
| `historystages:attacklock` | Entities a player may not damage | Global + Individual |
| `historystages:spawnlock` | Entity spawns — by source, and under conditions of place, time and weather | Global only |
| `historystages:interactionlock` | Non-combat entity interactions | Global + Individual |
| `historystages:trades` | Single merchant offers, named by merchant, level and both sides of the trade | Global + Individual |
| `historystages:trade_professions` | A merchant profession, optionally only some of its five levels | Global + Individual |
| `historystages:trade_levels` | A merchant level, for every profession at once | Global + Individual |
| `historystages:structures` | Structure ids and structure tags | Global + Individual |
| `historystages:biomes` | Biome ids and biome tags | Global + Individual |
| `historystages:zones` | Named areas a pack author draws themselves, each with its own rules | Global + Individual² |

¹ Individually only at the stations that know which player is standing at them — crafting table, the 2×2 inventory grid, stonecutter, smithing table. → [Global vs Individual Stages](/wiki/start-here/global-vs-individual) has the full list of what a per-player recipe gate does and does not reach.

² The one scope exception for zones is the "no mob spawns" rule, which is global-only for the same reason `spawnlock` is. → [Zones](/wiki/locking/world/zones).

³ The brewing stand brews with nobody at it, so only global stages stop it there. → [Enchantments & Effects](/wiki/locking/items-and-recipes/enchantments-and-effects)

Blocks have no category of their own — a block is gated through its item id in `historystages:items`.

Neither the tab nor the JSON key is the unit — **the question is.** A category is one thing the lock engine can be asked, and the two containers around it group by whatever is convenient at that end.

It comes apart in both directions. Attack, spawn and interaction are three categories sharing one `entities` object on disk *and* one tab, with a segment bar changing between the three sections; trades do the same with offers, professions and levels under `trades`. Both group coarser than the questions, because a packmaker gating a mob — or a merchant — thinks about one subject rather than three. Items go the other way: `items`, `tags` and `mods` are three categories, three keys and three tabs, and every one of them is a way of naming an item. Count the questions, not the tabs. → [Stage Configuration](/wiki/stage-file/anatomy) covers what those built-in fields mean for a packmaker.

A section whose category does not serve the stage you are editing is greyed on the bar rather than hidden, and says why on hover — spawn locks on an individual stage are the one built-in case. The tab itself only disappears when *none* of its sections fits, so the two entity categories that do work per player stay reachable.

## Registering a category

Registration happens in `RegisterLockCategoriesEvent` on the mod bus, and only there. The event fires once and the registry freezes when dispatch ends, so everything that walks the list afterwards — editor tabs, dual-phase detection, config sync — may assume it never changes again, and a server and a client can never end up disagreeing about which categories exist. Registering after the freeze throws `IllegalStateException`; a duplicate id throws `IllegalArgumentException`, whether the id is taken by a built-in or by another addon.

The mod ships a stand-in addon under `net.bananemdnsa.historystages.demo` that exercises the whole addon path and is held to the public API by a test. Its entire category registration:

```java
@SubscribeEvent
public static void onRegisterCategories(RegisterLockCategoriesEvent event) {
    if (!enabled()) return;

    category = AddonLockCategory.<String>builder(CATEGORY_ID)
            .tabLangKey("editor.historystages.demo.tab.relics")
            .tooltipLangKey("editor.historystages.demo.tooltip.relics")
            .storage(CategoryStorage.gson(String.class))
            .matcher(String.class, String::equals)
            .build();
    event.register(category);
}
```

`CATEGORY_ID` is `"hsdemo:relics"`. `enabled()` is the demo's own switch — it reads the system property `historystages.demoCategory`, so the demo category never exists for a player unless the game is launched with `-Dhistorystages.demoCategory=true`. A real addon drops that guard and registers unconditionally.

| Builder method | What it does |
| :--- | :--- |
| `tabLangKey(String)` | Lang key for the category's editor tab label. Required — `build()` throws without it. |
| `tooltipLangKey(String)` | Lang key for that tab's tooltip. Required. |
| `storage(CategoryStorage<T>)` | Turns `List<T>` into the JSON stored on a stage and back. `CategoryStorage.gson(Type.class)` covers the ordinary case in one line. Required. |
| `matcher(Class<S>, CategoryMatcher<T, S>)` | Teaches the category to recognise its own subjects: does one stored entry gate one runtime object. Optional — without it the category still stores entries and shows a tab, it just never gates anything. |

One further builder method is worth knowing: `supportedScopes(StageScope...)`. A category means something in both scopes unless it says otherwise; pass only `StageScope.GLOBAL` for something that cannot sensibly be gated per player, the way spawn locks cannot. An empty set is rejected, because a category that supports no scope can never gate anything.

`CategoryStorage.read` must never throw. Stage files are hand-edited, and one malformed entry has to cost that entry rather than take stage loading down with it — the built-in `gson` storage swallows a `JsonParseException` per element and returns what it could read.

## Namespacing

`historystages` is reserved for the eighteen built-ins. An addon namespaces its category ids with its own mod id — `hsdemo:relics`, `mymod:villagertrades` — and this is a requirement rather than a convention: `AddonLockCategory.build()` rejects an id with no `:` at all, and rejects the `historystages` namespace outright.

```java
// The id passed to builder(), as judged by build():
"villagertrades"        // throws IllegalArgumentException: no namespace
"historystages:trades"  // throws IllegalArgumentException: reserved namespace
"mymod:villagertrades"  // fine
```

Both checks run in `build()`, so a bad id fails at registration time rather than at first use.

The id is a map key and a JSON key, never a display string — the label a player sees comes from `tabLangKey`.

## Keep what you built — do not look it up

Hold on to what the builder handed you. `AddonLockCategory.builder(...)` returns a fully typed `AddonLockCategory<String>`; fetching the same object back out of the registry hands back a `LockCategory<?>` and forces an unchecked cast. An addon should not have to cast to reach a thing it registered itself.

```java
// Keep the typed object the builder returned.
private static AddonLockCategory<String> category;
```

This is why **the registries themselves are deliberately not part of the public API**. `LockCategories` and the rest of `data.lock.category` are internal and carry no promise. That costs an addon nothing, because everything it would go looking for in there, it owned a moment earlier — the category object, its id, its entry type. The one lookup the API does expose, `CategoryLocks.category(String)`, exists to answer "did my registration actually run?" and returns `LockCategory<?>`, which is exactly the untyped shape you want to avoid holding.

## Where entries are stored

An addon category's entries live in the `addons` block of the stage's JSON file, keyed by category id and held as raw JSON:

```json
{
  "display_name": "Ruins of the First Age",
  "items": ["minecraft:iron_ingot"],
  "addons": {
    "hsdemo:relics": ["hsdemo:amber_pendant", "hsdemo:bone_flute"]
  }
}
```

Built-in categories read and write typed fields on the stage; an addon category cannot, because the stage does not know its entry type. Storing the block unparsed is what buys the payoff for packmakers: **a stage file survives being loaded and saved by an instance that does not have the owning addon installed.** Unknown keys under `addons` are round-tripped verbatim rather than dropped on read and lost on the next save. A pack maintainer can edit stages on a client missing half the addons and hand the files back intact.

Two details fall out of that:

* An emptied category leaves no stub. Writing an empty list removes the key instead of storing `[]`, and a stage with no addon data gains no `"addons": {}` at all.
* Stage settings groups get their own `addon_settings` block rather than a corner of this one, so a group id that happens to match a category id cannot silently overwrite it.

## Asking at runtime

`CategoryLocks` is what an addon calls to ask whether something is gated, by one of its own
categories or a built-in one. All methods are server-side.

| Method | Returns | |
| :--- | :--- | :--- |
| `isLockedForPlayer(String categoryId, Object subject, UUID playerUuid)` | `boolean` — true when a stage gating it is still locked, in either scope | |
| `missingStagesForPlayer(String categoryId, Object subject, UUID playerUuid)` | `List<String>` — the stages this player still needs, global ones first; empty when not gated | |
| `isLockedGlobally(String categoryId, Object subject)` | global stages only, for paths with no player, such as a machine | 6.1 |
| `missingStagesGlobally(String categoryId, Object subject)` | the global stages the world still needs | 6.1 |
| `hits(LockCategory<T> category, Object subject, UUID playerUuid)` | `List<LockHit<T>>` — every matching entry, see below | 6.1 |
| `hits(String categoryId, Object subject, UUID playerUuid)` | the same by id | 6.1 |
| `category(String categoryId)` | `@Nullable LockCategory<?>` — a check that your registration ran in time | |

```java
UUID uuid = player.getUUID();
if (CategoryLocks.isLockedForPlayer("hsdemo:relics", relicId, uuid)) {
    List<String> missing = CategoryLocks.missingStagesForPlayer("hsdemo:relics", relicId, uuid);
    LockFeedbacks.actionbar(player, "hsdemo:relics", Component.literal("This relic is sealed."), missing);
}
```

Both scopes are consulted: a subject is locked when a global stage gating it is not yet unlocked for the world, **or** an individual stage gating it is not yet unlocked for this player. A category that says it means nothing in a scope is not asked about that scope. An unknown category id answers "not locked" and an empty list rather than throwing.

[Interchangeable stages](/wiki/stage-file/interchangeable-stages) are counted in from 6.1 on: a
subject gated by two interchangeable stages is free once either is unlocked, and only the stages
that still stand in the way are listed as missing.

An addon supplies only the matcher. Which stages to consult, global versus individual, what the player has unlocked, deduplication — all of that stays on the mod's side, because those are the parts an addon would otherwise have to reimplement and could get subtly wrong.

**The demo hooks nothing, because it has nothing to hook.** History Stages has no idea when a villager trade is about to be offered, when a spell is about to resolve, or when a quest reward is about to be handed out. A real addon owns that moment — it already has the event, the callback or the mixin — and calls `CategoryLocks` right there. That is the whole integration: register a category, ask at the moment your thing happens.

### Every matching entry: `LockHit`

**6.1.** A yes-or-no is not enough for an addon whose most specific entry wins, or whose entries can
grant as well as deny. `hits(...)` returns every stored entry that matches, global stages first:

```java
record LockHit<T>(String stageId, StageScope scope, T entry, boolean unlocked, boolean locks)
```

Two flags, because they answer different questions. `unlocked` is the plain fact about this one
stage. `locks` is the verdict with interchangeable stages counted in: once one stage of an
interchangeable group is unlocked, the others stop standing in the way, though they are still
locked. A hit with `locks == true` is exactly a stage `missingStagesForPlayer` would name. **Block
by `locks`, grant by `unlocked`.**

### Subjects for the built-in categories

**6.1.** Most built-ins take a bare id string: dimensions, recipes, structures, biomes, trade levels
and attack locks. Registry handles (`ResourceLocation`, `ResourceKey`, `Holder`) work wherever an id
does. Items, tags and mods take an `ItemStack`, `Item` or item id; fluids a fluid id, `Fluid` or
`FluidStack`. Everything that looks at more than an id is built with `Subjects`:

| Category | Subject |
| :--- | :--- |
| items, tags, mods, fluids, enchantments, effects | `Subjects.item(ItemStack)` — with its fluid, enchantments and potion contents; also `item(Item)`, `item(String)` |
| fluids, standing in the world | `Subjects.fluid(String fluidId)` |
| enchantments, without an item | `Subjects.enchantment(String id, int level)` |
| effects, without an item | `Subjects.effect(String id, int level)` |
| spawnlock | `Subjects.spawn(String entityId, String source, String dimension)` |
| interactionlock | `Subjects.interaction(String entityId, String action, ItemStack held)` |
| trade_professions | `Subjects.merchant(String professionOrEntityId, int level)` |
| trades | `Subjects.tradeOffer(String merchantKey, int level, ItemStack gives, ItemStack costA, ItemStack costB)` |

They return a `LockSubject`, a marker type whose implementations are internal. Zones gate a place,
not a thing; ask [`PlaceLocks`](#places-placelocks) for them.

:::warning[Fixed in 6.1]
Until 6.1, `isLocked('items', 'minecraft:diamond')` — and every `CategoryLocks` call for items, tags,
mods, fluids or enchantments — answered "unlocked", because those categories only matched an
internal subject record. Subjects are normalised now. Code that worked around it on 6.0.x can drop
the workaround on 6.1.
:::

### Items: `ItemLocks`

**6.1.** For items, use `ItemLocks` rather than `CategoryLocks`. An item is gated by more than its own
entry — its tags, its mod, the fluid it carries, the enchantments and effects on it — each possibly
narrowed to certain actions. `ItemLocks` asks all of that at once through the indexed path the mod's
own handlers use, so it is cheap enough to call per tick.

| Method | Use it for |
| :--- | :--- |
| `isActionLocked(ItemStack, String action, ServerPlayer or UUID)` | **blocking** something: may the player not do this |
| `isActionLockedGlobally(ItemStack, String action)` | the same with no player, for machines |
| `isGated(ItemStack, ServerPlayer or UUID)`, `isGatedGlobally(ItemStack)` | display: does a missing stage mention the item at all |
| `missingStages(ItemStack, ServerPlayer or UUID)` | what the player still needs |
| `isFluidActionLocked(String fluidId, String action, ServerPlayer)` | a fluid outside any container |
| `isEnchantmentLocked(String id, int level, String station, String itemId, ServerPlayer)` | a station applying an enchantment; `station` is `enchanting_table` or `anvil` |

**To block, ask `isActionLocked`.** `isGated` ignores action narrowing and answers whether any locked
stage mentions the item. That is right for a tooltip and wrong for a gate: it is how a mod entry
meant only for recipes once blocked container clicks, item frames and the anvil. The actions are
those in `LockActions.ITEM`.

### Places: `PlaceLocks`

**6.1.** May this player be at, or reach into, a position? A place is gated four ways: its dimension,
its biome, a structure covering it and a zone drawn around it. `PlaceLocks` asks all four with the
same rules the mod's own handlers apply, for any position — what a teleport, waypoint or portal mod
needs before it moves someone.

| Method | Returns |
| :--- | :--- |
| `isLocked(ServerPlayer or UUID, ServerLevel, BlockPos)` | locked by any of the four |
| `missingStages(ServerPlayer or UUID, ServerLevel, BlockPos)` | dimension first, then biome, structure and zone, each once |
| `isDimensionLocked(ServerPlayer, ServerLevel)` | the dimension alone; cheap |

Structure checks look at the structures near the position and cost more than the rest. Call it when
a player is about to go somewhere, not every tick for every block.

### Telling the player: `LockFeedbacks`

**6.1.** So an addon's lock feels like part of the mod: dark red italics on the actionbar, at most once
every two seconds per kind of lock.

| Method | What it does |
| :--- | :--- |
| `actionbar(ServerPlayer, String bucket, Component message)` | shows the message unless this bucket spoke to the player in the last two seconds |
| `actionbar(ServerPlayer, String bucket, Component message, List<String> missingStageIds)` | the same, with " (Required: …)" naming the stages |
| `requiredSuffix(ServerPlayer, List<String> missingStageIds)` | only that suffix, for a message of your own; `null` when there is nothing to name |

`bucket` keeps its own cooldown, so a recent item message does not swallow a block message. Prefix it
with your mod id. The stage names are the ones the player may see — `"???"` for hidden stages — and
the suffix is left out when a stage asks for its lock hints to be hidden.

## Making lookups fast (optional)

Two `default` methods on `LockCategory` opt a category into the reverse index, which lets a lock check skip the stages that cannot possibly match instead of asking all of them:

| Method | Purpose |
| :--- | :--- |
| `indexKeys(StageEntry stage)` | The ids this stage should be filed under. Returning nothing leaves the category on the full scan. |
| `lookupKey(Object subject)` | The id to look a runtime subject up under. Returning `null` skips the index for that query. |

They are counterparts — implementing one without the other gains nothing, because whatever `indexKeys` files a stage under is exactly what `lookupKey` has to produce from the runtime object.

Both are optional, and a category that stays silent is still **correct**, just scanned in full. It starts being worth implementing once a pack runs a few hundred stages: the scan is linear in stage count and costs roughly four microseconds at three hundred stages, against about fifty nanoseconds through the index.

:::warning
**A category must over-estimate its keys, never under-estimate.** List every id that `gates` could possibly answer "yes" to on this stage, including the ones whose real answer depends on something else — an NBT criterion, a spawn source, a held item. The exact check still runs afterwards on the candidates, so a key too many costs one comparison. **A key too few means the stage is never asked, and the thing it should gate is silently unlocked.** That is the failure mode: no crash, no log line, no error in the debug output — a lock that simply is not there.
:::

The same warning has teeth for a category whose `gates` reads a neighbouring category on the same stage: the ids from that neighbour belong in `indexKeys` too, or the stage is never asked and the thing it should gate is quietly free. The built-in attack lock used to be the worked example — until 6.0.0 it also gated entities named by a source-less spawn lock, and had to index both lists. That implication is gone, and the attack lock now indexes only its own entries; the trap it illustrates has not gone anywhere.

An addon almost never needs to override `gates` at all. Supplying `matches` gets the loop over the category's own entries for free, and that is the whole answer for every addon category.

## The matcher takes `Object`, on purpose

The matcher hook on `LockCategory` is:

```java
default boolean matches(T entry, Object subject)
```

The entry is typed. The subject is not, and that is a decision rather than an oversight. A single lock check hands the same subject to several categories in turn: the item path asks `historystages:items`, `historystages:mods` and `historystages:tags` in **one pass** over the candidate stages, with one subject object. It has to work that way — asking the three separately would report a stage that gates an item both by id and by mod twice, in a different order, and that order is what the "you still need" tooltip prints to the player.

A typed second parameter would therefore force every category in such a pass to know every other category's subject type, foreign addon types included. Untyped, a category that cannot make sense of what it was handed answers "no" and the pass moves on.

Addon categories do not pay for that looseness. `AddonLockCategory` stores the `Class<S>` you passed to `matcher(...)` and checks it before your code runs:

```java
.matcher(String.class, String::equals)
```

A subject of the wrong type fails with a message naming both classes rather than silently returning false, and a subject of `null` is simply not a match. This is safe precisely because addon categories are only ever asked by id through `CategoryLocks`, never folded into a multi-category pass — so the only object your matcher can be handed is one you asked about yourself.

---

→ [Editor Toolkit](./editor-toolkit.md) — giving the category a tab so a packmaker can fill it in.
→ [Addon Development](./addon-development.md) — the entry point, the mod-bus events, and the other extension points.
