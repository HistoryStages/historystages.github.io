---
title: Config Files
description: "The three settings files, who owns them, and which of them reaches the client."
sidebar_position: 1
---

# Config Files

History Stages keeps its settings in three TOML files:

```text
config/historystages/settings/
    visual.toml      what a player sees or hears
    gameplay.toml    what happens in the background
    graph.toml       the player-facing Stage Graph
```

They can be edited by hand or through the in-game
[Config Editor](/wiki/6.0.x/in-game-tools/in-game-editor), which writes the same files. Saving from the
editor needs permission level 2.

Hand edits need `/history reload` to take effect. The editor reloads by itself.

## They belong to the server, not to the player

**All three live on the server and are sent to every player who joins.** The split between them is
thematic rather than a question of ownership — a pack author sets all of them, and none of it is
something an individual player is expected to touch.

A client's own copies are used in singleplayer and while not connected anywhere. The moment they
join a server, that server's values apply for the session, and their own come back when they leave.
**Their files on disk are never overwritten by a server.**

## The three files

- **[visual.toml](/wiki/6.0.x/server/config-files/visual-toml)** — tooltips, overlays, lock messages,
  notifications, the recipe browser, the scroll tooltip and the open scroll document.
- **[gameplay.toml](/wiki/6.0.x/server/config-files/gameplay-toml)** — logging, the core gameplay locks,
  research and boosters, loot replacement, and the structure, biome and zone lock behaviour.
- **graph.toml** — around 90 keys of its own: canvas appearance, visibility rules, node styling. It
  is documented on the [Stage Graph](/wiki/6.0.x/in-game-tools/stage-graph) page and has its own tab in
  the config editor.

## Where the settings are actually explained

These two pages are **lookup lists**: every key, its default, and one line saying what it does. The
reasoning behind a setting lives on the page for the thing it configures —
[Biomes](/wiki/6.0.x/locking/world/biomes) explains what `[biome_lock]` is for,
[Loot](/wiki/6.0.x/locking/items-and-recipes/loot) explains `[loot_replacements]`, and so on. Each key
links back.

## Coming from 5.x?

The settings used to live in two differently-named files and were split by a different principle
entirely. Everything is carried over automatically on first launch. →
[Upgrading from 5.x](/wiki/6.0.x/server/upgrading-from-5x)
