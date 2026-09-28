---
title: visual.toml
description: "Lookup list for every key in visual.toml — what a player sees or hears."
sidebar_position: 2
---

# visual.toml

What a player sees or hears. Lives at `config/historystages/settings/visual.toml`, belongs to the
server, and is sent to every player who joins. →
[Config Files](/wiki/server/config-files) for how the three settings files relate ·
[gameplay.toml](/wiki/server/config-files/gameplay-toml) for what happens in the background.

This page is a lookup list. Each block links to the page that explains what it is for.

## `[visuals]`

→ Related: [Hidden Display](/wiki/stage-file/hidden-display) · [Research Scrolls](/wiki/in-game-tools/research/scrolls).

| Setting | Default | Description |
| :--- | :--- | :--- |
| `showTooltips` | `true` | Show information tooltips on locked items. |
| `showStageName` | `true` | If tooltips are enabled, name the required stage. |
| `showAllUntilComplete` | `true` | If an item belongs to several stages, list all of them until all are unlocked. |
| `showLockIcons` | `true` | Padlock overlay on locked items in inventories and JEI/EMI. |
| `showBoosterTooltips` | `true` | Tooltip on Research Pedestal booster blocks describing their speed/cost effect. |
| `showScrollTierTooltip` | `true` | Show the minimum required Pedestal tier on Research Scroll tooltips. |
| `openScrollBackdrop` | `60` | How far the world behind an open scroll is dimmed, in percent. `0` = not at all, `100` = black. |
| `showWelcomeMessage` | `true` | The welcome message shown to players when they join. |
| `showEditorButton` | `true` | The Stage Editor button in the pause menu. Operators can still open the editor with `/history debug editor`. |

## `[structure_overlay]`

→ Explained on [Dimensions & Structures](/wiki/locking/world/dimensions-and-structures#structures).

| Setting | Default | Description |
| :--- | :--- | :--- |
| `structureBorderEnabled` | `true` | Render a force-field-style border on the walls of locked structures when you get close. |
| `structureBorderDistance` | `8.0` | How close, in blocks, before the border becomes visible. It fades in as you approach. Range 1.0–32.0. |
| `structureLockOverlayEnabled` | `true` | While standing inside a locked structure, tint the whole screen red. |
| `structureLockOverlayOpacity` | `0.30` | Opacity of that red overlay. Range 0.0–1.0. |

## `[zone_overlay]`

→ Explained on [Zones](/wiki/locking/world/zones).

Zones are areas a pack author draws themselves, and each one carries its own switch for whether it shows a wall or tints the screen at all. This block only answers **how much** — there is deliberately no second switch here that could contradict the zone's own.

| Setting | Default | Description |
| :--- | :--- | :--- |
| `zoneBorderDistance` | `8.0` | How close, in blocks, before a locked zone's wall becomes visible. It fades in as you approach. `0` turns the wall off entirely. Range 0.0–32.0. |
| `zoneLockOverlayOpacity` | `0.30` | Opacity of the red tint while you stand inside a locked zone. `0.0` turns it off. Range 0.0–1.0. |
| `zoneBorderFullView` | `false` | Draw the wall far past the usual few blocks, so a whole side is visible at once. It still fades with distance — the wall is worked out from the blocks in front of you, and the further it reaches the more of them there are. |
| `zoneBorderOutline` | `false` | Also draw a wireframe of every shape in a locked zone, fading in from about fifty blocks out. More use while laying a pack out than while playing one. |
| `zoneBorderColor` | `#E61414` | Colour of both the wall and the wireframe. |

Zones read these rather than the structure values above, because a pack can gate a whole region as a zone and a single hut as a structure, and wanting to see the region from further off says nothing about the hut.

## `[jade]` (requires Jade)

→ See [Mod Compatibility](/wiki/server/mod-compatibility).

| Setting | Default | Description |
| :--- | :--- | :--- |
| `showInfo` | `true` | Show stage information on locked blocks in the Jade overlay. |
| `showStageName` | `true` | If Jade info is enabled, name the required stage. |
| `showAllUntilComplete` | `true` | If a block belongs to several stages, list all of them until all are unlocked. |

## `[dimension_lock]` and `[mob_lock]`

→ Explained on [Dimensions & Structures](/wiki/locking/world/dimensions-and-structures#dimensions) and [Entities & Spawns](/wiki/locking/creatures-and-trade/entities-and-spawns#attacklock).

Both blocks carry the same three keys; they control only the feedback, not the lock itself.

| Setting | Default | Description |
| :--- | :--- | :--- |
| `useActionbar` | `true` | Show a short message in the actionbar. |
| `showInChat` | `false` | Also send the message to chat. |
| `showStagesInChat` | `true` | If the chat message is on, list the required stages with it. |

## `[trade_lock]`

→ Explained on [Merchant Trades](/wiki/locking/creatures-and-trade/merchant-trades#what-the-player-sees).

Controls the notice shown **inside** the trade window when a merchant has nothing left to offer once the trade locks have been applied. Without it an emptied merchant is indistinguishable from a merchant who happens to have no stock, which reads as a bug.

| Setting | Default | Description |
| :--- | :--- | :--- |
| `showStagesInWindow` | `false` | Also name the stages holding the offers back. |

Off by default, unlike the dimension and mob switches. Those answer "why can I not go there", where naming the stage is the whole help; a merchant with nothing to offer is a puzzle some packs would rather keep as one.

## `[individual_stages]`

→ Explained on [Global vs Individual Stages](/wiki/start-here/global-vs-individual).

| Setting | Default | Description |
| :--- | :--- | :--- |
| `showSilverLockIcons` | `true` | Silver lock icon on items locked by individual stages. |
| `showIndividualTooltips` | `true` | Tooltip information for items locked by individual stages. |

## `[recipe_book]`

→ Explained on [Recipes](/wiki/locking/items-and-recipes/recipes#what-players-see).

| Setting | Default | Description |
| :--- | :--- | :--- |
| `hideLockedRecipesInBook` | `true` | Hide locked recipes from the **vanilla** recipe book at the crafting table. Covers both halves of recipe gating: a recipe id named on a stage, and an item whose locked actions include `recipe`. |

**This is a change from before 6.0.0**, where a locked recipe stayed visible in the book and simply refused to craft. Turning it off restores that. The book belongs to one player, so it is filtered per player — an individual stage reaches it.

## `[jei_hiding]`

→ Explained on [Recipes](/wiki/locking/items-and-recipes/recipes#what-players-see).

The section and the keys are named after JEI, but they drive EMI too (NeoForge 6.0.2 and later;
on Forge and Fabric JEI only).

| Setting | Default | Description |
| :--- | :--- | :--- |
| `hideLockedItemsInJei` | `false` | Remove locked items from the JEI and EMI ingredient panels entirely instead of marking them with a lock overlay. |
| `hideLockedRecipesInJei` | `false` | Hide locked recipes. JEI only catches vanilla recipe types by their output; EMI hides every recipe the lock overlay would mark. |
| `lockedItemMultiStagePolicy` | `STRICT` | How items assigned to several stages behave. `STRICT` = locked while any assigned stage is still locked. `LENIENT` = unlocked as soon as any assigned stage is. |

## `[notifications]`

| Setting | Default | Description |
| :--- | :--- | :--- |
| `broadcastChat` | `true` | Broadcast unlock messages to everyone on the server. |
| `unlockMessageFormat` | `"&aNew Era: {stage}"` | Format of the global unlock message. Supports `{stage}` and `&`-style colour codes. |
| `useActionbar` | `true` | Show unlock messages in the actionbar. |
| `useSounds` | `true` | Play a notification sound on unlock. |
| `useToasts` | `true` | Show an advancement-style toast on unlock. |
| `defaultStageIcon` | `"minecraft:book"` | Item used as the toast icon when a stage specifies no `icon` of its own. |

## `[notifications.individual]`

The same five settings again, for per-player stages. They are nested under `[notifications]` rather than kept in their own block so the two reaches sit side by side.

| Setting | Default | Description |
| :--- | :--- | :--- |
| `broadcastChat` | `true` | Broadcast individual unlock messages. |
| `unlockMessageFormat` | `"&a{player} unlocked: {stage}"` | Format of the individual unlock message. Supports `{player}` and `{stage}`. |
| `useActionbar` | `true` | Actionbar message on an individual unlock. |
| `useSounds` | `true` | Sound on an individual unlock. |
| `useToasts` | `true` | Toast on an individual unlock. |

## `[lock_messages]`

→ Related: [Hidden Display](/wiki/stage-file/hidden-display).

Overrides for the actionbar/chat messages shown when a player interacts with locked content. Each defaults to an empty string, which falls back to the built-in translation key — so existing localisations are preserved unless overridden. Override strings support `&`-style colour codes and the same `{stage}` / `{player}` / `{structure}` placeholders as the other message settings, where applicable.

| Setting | Falls back to | Shown when |
| :--- | :--- | :--- |
| `itemLocked` | `message.historystages.item_locked` | Interacting with a locked item. |
| `fluidLocked` | `message.historystages.fluid_locked` | Taking a locked fluid out of the world. |
| `tradeLocked` | `message.historystages.trade_locked` | A merchant has nothing left once the trade locks have been applied. |
| `blockLocked` | `message.historystages.block_locked` | Interacting with a locked block. |
| `entityItemLocked` | `message.historystages.entity_item_locked` | Interacting with armor stands or item frames holding locked items. |
| `enchantmentLocked` | `message.historystages.enchantment_locked` | Applying a locked enchantment via an anvil or enchanting table. |
| `recipeLocked` | `message.historystages.recipe_locked` | Clicking a locked recipe in the recipe book. |
| `dimensionUnknown` | `message.historystages.dimension_unknown` | Entering a locked dimension. |
| `mobUnknown` | `message.historystages.mob_unknown` | Attacking a locked mob. |

## `[scroll_tooltip]`

→ Explained on [Research Scrolls](/wiki/in-game-tools/research/scrolls#the-scroll-tooltip).

| Setting | Default | Description |
| :--- | :--- | :--- |
| `lines` | built-in defaults | Ordered, per-section layout of the Research Scroll tooltip. See [Research System](/wiki/in-game-tools/research/scrolls#the-scroll-tooltip). |
| `hideFulfilledDependencies` | `false` | Hide dependencies the player already meets from the tooltip's dependency list. |

## `[open_scroll]`

→ Explained on [Research Scrolls](/wiki/in-game-tools/research/scrolls#the-open-scroll-document).

| Setting | Default | Description |
| :--- | :--- | :--- |
| `chapters` | built-in defaults | Ordered chapter layout of the [open scroll document](/wiki/in-game-tools/research/scrolls#the-open-scroll-document) (`overview`, `items`, `creatures`, `world`). |
| `lockedDisplay` | `"obscured"` | `"visible"` shows locked entries normally; `"obscured"` shows them as silhouettes with a redacted name. |
| `overviewBlocks` | built-in defaults | Which blocks (`icon`, `title`, `description`, `counts`) appear on the overview page, and in what order. |
| `showSearch` | `true` | Show a search bar. |
| `showEntryIds` | `true` | Show each entry's registry ID alongside its display name. |
| `entrySort` | `"defined"` | `"defined"` keeps the order listed in the stage; `"alphabetical"` sorts by name. |
| `inkHeading` | `#3F2D13` | Ink for headings. |
| `inkBody` | `#4A3416` | Ink for entries and the description. |
| `inkFaint` | `#7A5A2C` | Ink for group headings, the counts line and the sheet counter. |
