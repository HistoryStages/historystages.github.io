---
title: gameplay.toml
description: "Lookup list for every key in gameplay.toml — what happens in the background."
sidebar_position: 3
---

# gameplay.toml

What happens in the background. Lives at `config/historystages/settings/gameplay.toml`, belongs to
the server, and is sent to every player who joins. →
[Config Files](/wiki/server/config-files) for how the three settings files relate ·
[visual.toml](/wiki/server/config-files/visual-toml) for what a player sees or hears.

This page is a lookup list. Each block links to the page that explains what it is for.

## `[logging]`

→ Explained on [Getting Help & Reporting Bugs](/wiki/about/getting-help).

| Setting | Default | Description |
| :--- | :--- | :--- |
| `showDebugErrors` | `true` | Show stage loading errors and warnings in chat on join. |
| `enableRuntimeLogging` | `false` | Write detailed runtime information (stage changes, blocked actions, inventory issues) to `config/historystages/logs/`. |

## `[gameplay]`

→ Explained on [Items, Tags & Mods](/wiki/locking/items-and-recipes/items-tags-mods#what-locked-means).

| Setting | Default | Description |
| :--- | :--- | :--- |
| `lockMobLoot` | `true` | Remove locked items from mob drops. |
| `lockBlockBreaking` | `true` | Locked blocks become far harder to break and drop nothing. |
| `lockedBlockBreakSpeedMultiplier` | `0.05` | Break-speed multiplier for locked blocks. `0.05` means 20× slower. |
| `lockItemUsage` | `true` | Prevent using locked items — eating, equipping, attacking with. |
| `lockEntityItems` | `true` | Prevent interacting with or breaking armor stands and item frames holding locked items. |
| `lockBlockInteraction` | `true` | Prevent opening the GUI of locked blocks (chests, furnaces, crafting tables, …). |
| `lockContainerInteraction` | `true` | Prevent moving locked items within containers. |
| `lockEnchanting` | `true` | Prevent applying locked enchantments via anvils and enchanting tables. |

## `[research]`

→ Explained on [Research Pedestal](/wiki/in-game-tools/research/pedestal) and [Research Scrolls](/wiki/in-game-tools/research/scrolls).

| Setting | Default | Description |
| :--- | :--- | :--- |
| `researchTimeInSeconds` | `20` | Default research duration, used when a stage's JSON does not set `research_time`. |
| `researchBoosters` | `[]` | Booster blocks placed under a pedestal to speed up or discount research. Format per entry: `"block_id, speed%, cost%, tier, mode"`. See [Research System](/wiki/in-game-tools/research/pedestal#boosters). |
| `defaultScrollCompletion` | `"consume"` | What happens to a scroll when its research finishes. `consume` uses it up; `replace` puts a fresh scroll for the same stage back into the pedestal; `open` leaves an open scroll as a keepsake. A stage can override this with its own `scroll_completion`. |
| `enableScrollResealing` | `true` | Allow crafting an open scroll back into a sealed one. Crafting follows this immediately, but JEI and EMI build their recipe lists at startup, so the entry only appears or disappears there after a restart. |

## `[stage_logic]`

→ Explained on [Logic Blocks](/wiki/stage-file/logic-blocks).

| Setting | Default | Description |
| :--- | :--- | :--- |
| `researchWhenBlocked` | `PAUSE` | What a pedestal does when its stage becomes blocked while researching. `PAUSE` keeps the progress and goes on once the block clears; `CANCEL` stops and hands the scroll back. |
| `warnOnForcedUnlock` | `true` | Tell an operator when a command or the editor unlocks a stage that was blocked. Those paths unlock anyway; this only decides whether they say so. |

## `[loot_replacements]`

→ Explained on [Loot](/wiki/locking/items-and-recipes/loot#replacing-instead-of-removing).

| Setting | Default | Description |
| :--- | :--- | :--- |
| `useReplacements` | `false` | Replace locked loot with something else instead of removing it. |
| `replacementItems` | `[]` | Item IDs to pick a random replacement from. Checked first. |
| `replacementTags` | `[]` | Item tags (e.g. `c:dusts`) to pick a random replacement from. Used when `replacementItems` is empty or exhausted. |

## `[individual_stages]`

→ Explained on [Global vs Individual Stages](/wiki/start-here/global-vs-individual).

The per-player counterparts of the `[gameplay]` locks. Their notification settings live in `visual.toml` under `[notifications.individual]`.

| Setting | Default | Description |
| :--- | :--- | :--- |
| `lockItemPickup` | `true` | Prevent picking up items locked by individual stages. |
| `lockLoot` | `true` | Handle individually-locked items in Lootr containers and mob loot. Lootr loot is checked against the player it is rolled for; mob drops are shared world items, so they are checked against the killing player. |
| `dropOnRevoke` | `true` | Drop locked items from a player's inventory when their individual stage is revoked. |
| `lockBlockBreaking` | `true` | Individually-locked blocks become far harder to break. |
| `lockedBlockBreakSpeedMultiplier` | `0.05` | Break-speed multiplier for individually-locked blocks. |
| `lockItemUsage` | `true` | Prevent using individually-locked items. |
| `lockBlockInteraction` | `true` | Prevent opening the GUI of individually-locked blocks. |
| `lockEnchanting` | `true` | Prevent applying individually-locked enchantments. |
| `lockRecipes` | `true` | Let individual stages gate recipes at the stations that know who is crafting: crafting table, 2×2 inventory grid, stonecutter, smithing table. Furnaces, hoppers and autocrafters resolve recipes with nobody there and stay global-only. |

## `[team_mods]`

→ Explained on [Sharing with a team](/wiki/start-here/global-vs-individual#sharing-with-a-team).

| Setting | Default | Description |
| :--- | :--- | :--- |
| `shareOnJoin` | `false` | Hand a player who joins a party every shared stage someone in it already has. Checked again at each login. Leaving never takes stages away. |
| `shareLoss` | `false` | When one player loses a shared stage, the rest of the party loses it too, the normal way. Admin locks are never shared. |
| `useFtbTeams` | `true` | Count FTB Teams parties as teams. Solo teams never count. |

## `[structure_lock]`

→ Explained on [Dimensions & Structures](/wiki/locking/world/dimensions-and-structures#structures).

| Setting | Default | Description |
| :--- | :--- | :--- |
| `checkInterval` | `10` | Ticks between checks for whether a player is inside a locked structure. |
| `messageEnabled` | `true` | Send a message when a player enters a locked structure. |
| `messageFormat` | `"&cYou cannot enter &e{structure}&c yet!"` | Format of that message. Supports `{stage}` and `{structure}`. |
| `showInChat` | `false` | Also send it to chat, not just the actionbar. |
| `damageEnabled` | `false` | Damage players inside a locked structure. |
| `damageAmount` | `1.0` | Damage per tick interval. |
| `damageInterval` | `20` | Ticks between damage ticks. |
| `lockPadding` | `0` | **Advanced.** Extra blocks around each structure piece when building the lock zone, on top of a fixed 2-block buffer. Range 0–16. |
| `clusterDistance` | `6` | **Advanced.** How far apart two pieces of the same structure can be while still joining into one lock zone. Higher = larger, more filled-in zones. Range 0–32. |
| `blockRightClick` | `true` | Cancel right-click interactions inside a locked structure. |
| `blockLeftClick` | `true` | Cancel left-click interactions inside a locked structure. |
| `blockProjectiles` | `true` | Cancel projectiles the moment they would impact something inside a locked structure. |
| `blockExplosions` | `true` | Keep explosions from destroying blocks inside a locked structure. |

## `[biome_lock]`

→ Explained on [Biomes](/wiki/locking/world/biomes).

| Setting | Default | Description |
| :--- | :--- | :--- |
| `checkInterval` | `10` | Ticks between checks for whether a player is inside a locked biome. Range 1–200. |
| `effectsEnabled` | `true` | Apply potion effects to players standing in a locked biome. |
| `effects` | `["minecraft:blindness, 30, 0"]` | Effects applied. Format per entry: `"effect_id, seconds, amplifier"`. |
| `clearEffectsOnLeave` | `false` | Clear those effects as soon as the player leaves, instead of letting them run out. |
| `messageEnabled` | `true` | Send a periodic message while inside a locked biome. |
| `messageFormat` | `"&cYou cannot survive in &e{biome}&c yet!"` | Format of that message. Supports `{stage}` and `{biome}`. |
| `showInChat` | `false` | Also send it to chat. |
| `damageEnabled` | `true` | Damage players inside a locked biome. |
| `damageAmount` | `1.0` | Damage per tick interval. Range 0.1–100.0. |
| `damageInterval` | `20` | Ticks between damage ticks. Range 1–600. |
| `blockRightClick` | `true` | Cancel right-click interactions inside a locked biome. |
| `blockLeftClick` | `true` | Cancel left-click interactions inside a locked biome. |
| `blockProjectiles` | `true` | Cancel projectiles the moment they would impact something inside a locked biome. |
| `blockExplosions` | `true` | Keep explosions from destroying blocks inside a locked biome. |

## `[zone_lock]`

→ Explained on [Zones](/wiki/locking/world/zones).

Zones carry their own rules per zone, so almost nothing about them is configured server-wide. The one thing that is: which item marks out corners in the world.

| Setting | Default | Description |
| :--- | :--- | :--- |
| `markerItem` | `"minecraft:stick"` | Item used to mark out zone corners. Sneak + left click sets the first corner, sneak + right click the second. Requires permission level 2, the same bar as opening the editor. Without sneaking the item behaves completely normally, so something you already carry is a safe choice. Leave empty to switch marking by item off and use `/history zone` instead. |
