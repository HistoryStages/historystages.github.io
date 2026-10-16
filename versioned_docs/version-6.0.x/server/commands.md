---
title: Commands & Permissions
description: "Every /history command, what it takes, and which permission level it needs."
sidebar_position: 1
---

History Stages provides a set of administrative commands for managing stages, configurations, and player progression. These commands are intended for server operators and modpack developers.

All administrative commands require **Permission Level 2 (OP)** and utilize the `/history` prefix.

## Global Stage Commands (Server-Wide)

These commands manage global stages, which affect all players on the server.

| Command | Action | Details |
| :--- | :--- | :--- |
| `/history global unlock <stage_id>` | Unlocks a specific global stage. | Replace `<stage_id>` with the ID of the stage. Use `*` to unlock all defined global stages. |
| `/history global lock <stage_id>` | Relocks a specific global stage. | Replace `<stage_id>` with the ID of the stage. Use `*` to relock all global stages. |

## Individual Stage Commands (Per-Player)

These commands manage individual (per-player) stages, enabling personalized progression paths.

| Command | Action | Details |
| :--- | :--- | :--- |
| `/history individual unlock <player> <stage_id>` | Unlocks a stage for a specific player. | Replace `<player>` with the target player's username or a selector (e.g., `@a`, `@p`). Replace `<stage_id>` with the ID of the stage. |
| `/history individual lock <player> <stage_id>` | Relocks a stage for a specific player. | Replace `<player>` and `<stage_id>` as above. |

## Temporary Stage Commands

Stages in `temporary` mode relock themselves after a while and count how often they have been triggered. These commands read and edit that runtime state — there is no other way to see a trigger counter or a running cooldown.

| Command | Action | Details |
| :--- | :--- | :--- |
| `/history temporary global info <stage_id>` | Shows how often the stage has been unlocked, its cap, and any running timer or cooldown. | |
| `/history temporary global reset <stage_id>` | Clears the trigger count and any running timer. | |
| `/history temporary global setcount <stage_id> <count>` | Sets the trigger count to a specific number. | |
| `/history temporary individual <player> info <stage_id>` | The same, for one player. | `<player>` accepts a name or a selector. |
| `/history temporary individual <player> reset <stage_id>` | | |
| `/history temporary individual <player> setcount <stage_id> <count>` | | |

## Zone Commands

Marking out the corners a zone is built from, without needing the marker item — which matters on a server where the item is switched off, and for setting a corner you cannot stand on.

| Command | Action | Details |
| :--- | :--- | :--- |
| `/history zone mark` | Sets the next corner at your position. | Alternates between the first and second corner. |
| `/history zone mark <1\|2> [pos]` | Sets a specific corner, optionally at given coordinates. | |
| `/history zone clear` | Discards the current selection. | |
| `/history zone info` | Prints the marked corners, the world they are in, and the size of the box. | |

The selection is per player and lives until it is cleared or overwritten. Picking it up in the editor turns it into a shape.

## Utility Commands

| Command | Action | Details |
| :--- | :--- | :--- |
| `/history reload` | Reloads all configurations and synchronizes data. | This command is **mandatory** after manual changes to JSON stage files (in `config/historystages/global/` or `individual/`) or TOML configuration files (e.g., `historystages/settings/gameplay.toml`). Reload now runs locally per invoker — it no longer fans out to other operators on the server. |

### Screen Subcommands (Client-Side)

`/history editor` and `/history graph` open a screen on the invoking player's client, so they are registered on the client-side dispatcher and need no server round-trip.

| Command | Action | Details |
| :--- | :--- | :--- |
| `/history editor` | Opens the in-game stage editor. | Requires OP. Equivalent to clicking the editor button in the pause menu. |
| `/history graph` | Opens the player view of the stage graph. | Equivalent to clicking the Stage Graph button in the pause menu — the same filtered, read-only view players get. Available to everyone while `graph.toml` `[general] enabled` is on; with it off, operators can still open it to preview the player view. |

### Debug Subcommands (Client-Side)

The `/history debug` subcommands are registered on the **client-side** command dispatcher, so they execute on the invoking player's client and only require that player to have OP. They are not visible to or executable by other operators, and do not require a server round-trip.

| Command | Action | Details |
| :--- | :--- | :--- |
| `/history debug structure` | Lists structure IDs and tags at the current position. | Useful for identifying structures for the `structures` lock feature. Only works for players. |
| `/history debug viz` | Toggles a visualisation of the lock zone built around nearby structures. | Shows what `lockPadding` and `clusterDistance` actually produced. |
| `/history debug shapes` | Prints the individual pieces the nearby structure's lock zone was clustered from. | The numeric counterpart to `viz`. |
| `/history debug nbt preset` | Lists preset NBT fields for the held item. | Shows values for fields recognized by the NBT editor (e.g., `Enchantments`, `CustomModelData`). |
| `/history debug nbt custom` | Lists unrecognized NBT keys for the held item. | Shows key/value pairs ready for the editor's `+ Custom NBT Key` dialog. |
| `/history debug nbt components` | Lists the held item's data components. | The 1.21 component view of the same item, for criteria written against components rather than legacy NBT. |
