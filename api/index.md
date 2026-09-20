---
title: API Overview
description: "Where to start when your own mod needs to work with History Stages — reading stage state, or registering content of your own."
slug: /
sidebar_position: 1
---

# API Overview

:::info
**API generation 6** · Requires History Stages **6.0.0+** on **NeoForge 1.21** or **Forge 1.20.1**.
The addon platform does not exist on Fabric yet.
:::

These pages are for people writing a **mod**. If you are building a pack, you want the
[Wiki](/wiki/) instead — nothing here is needed to make stages, and an addon is never required to
gate content that History Stages already knows about.

## Which half do you need?

Almost every mod that touches History Stages needs only the first one.

| | |
| :--- | :--- |
| **"My mod needs to know what a player has unlocked."** | Read stage state, change it, and react when it changes. A plain API surface, no registration, no events to subscribe to at load time. → [Stage State & Events](./stage-state-and-events.md) |
| **"My mod adds something History Stages should be able to gate."** | Register your own lock category, requirement, auto-trigger, stage settings or config section — each with a native tab in the in-game editor. → [Addon Development](./addon-development.md) |

The second one builds on the first: an addon still reads stage state the same way anybody else does.

## The extension points

| Page | Answers |
| :--- | :--- |
| [Lock Categories](./lock-categories.md) | What can be gated? The sixteen built-in kinds are registered through this same path. |
| [Requirements](./requirements.md) | What must a player do before the stage opens? |
| [Auto-Triggers](./auto-triggers.md) | What unlocks a stage by itself, with no pedestal and no command? |
| [Stage Settings](./stage-settings.md) | Your own settings on every stage, stored in the stage file. |
| [Config Sections](./config-sections.md) | Your own rows in the config screen, stored in your own config. |

## The editor toolkit

An addon's tab looks like a built-in tab because it is made of the same widgets. How much of it you
write is a choice, and the cheapest tier is "none at all".

| Page | Covers |
| :--- | :--- |
| [Editor Toolkit](./editor-toolkit.md) | The three tiers, and how a tab is registered in the first place. |
| [Editor Widgets](./editor-widgets.md) | The row widget, pickers, right-click menus — the reference catalogue. |
| [Editor Screens](./editor-screens.md) | The lifecycle a tab may override, and the one hook that is easy to forget. |

## Versioning

The API generation equals the mod's major version: 6.x is generation 6, and a breaking change to
anything in the API waits for 7.0. Declaring `versionRange="[6.0,7.0)"` in your mod metadata is
therefore the whole compatibility check, and the loader performs it before any addon code runs. →
[Adding the dependency](./addon-development.md#adding-the-dependency)

Unlike the wiki, these pages are **not** versioned — they describe the current generation only.
