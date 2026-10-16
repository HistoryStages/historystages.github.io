---
title: Porting & Permissions
description: "History Stages is All Rights Reserved with one carve-out: porting it to another version or loader, and the conditions attached."
sidebar_position: 3
---

# Porting to Other Versions & Loaders

History Stages is All Rights Reserved, but there is one carve-out: **you may port it to another
Minecraft version or another mod loader without asking first.** You still have to follow a few
conditions, and this page walks through them in plain terms.

The exact wording is Section 3 of
[LICENSE.txt](https://github.com/Flix100000/History-Stages/blob/neoforge-1.21.X/LICENSE.txt) —
that text is what counts if this page and the license ever disagree.

## Why this exists

The mod only ships for the versions the maintainer actually plays and tests on. Everything else —
older versions, newer ones, loaders that aren't covered — would otherwise sit there unreachable,
and a mod nobody is allowed to move forward quietly dies with its last release. The port exception
is the way out of that without handing the whole project over.

## What counts as a port

A **technical port** is the same mod, running somewhere else. You rewrite the parts that the target
version or loader forces you to rewrite — registries, events, mixins, rendering, networking — and
the mod behaves the way it does in the official version.

Anything else is not a port:

- New stage types, new lock categories, new blocks, new GUIs
- Removing or reworking features because you'd rather they worked differently
- Rebalancing research times, drops, or costs
- Bundling it into a larger mod of your own

None of that is forbidden forever — it just needs to be agreed first. Ask on
[Discord](https://discord.gg/BeZzxyZ9c4) or in a GitHub issue **before** you start building, not
after.

## The three conditions

| | What you have to do |
| :--- | :--- |
| **1. Stay a port** | No features, content, or gameplay changes beyond the technical adaptation. Bug fixes that a version difference forces on you are fine; new behaviour is not. |
| **2. Say hello** | Before or when you release, contact the maintainer (Discord or a GitHub issue) and give access to the port's full source. On every platform you publish on, set the license field to a **custom license** that links to your port's license file. |
| **3. Stay public and credited** | The port's source stays publicly available. It ships an unmodified copy of the original license (e.g. as `LICENSE-ORIGINAL.txt`) plus your own port license from Appendix A. Every project page — and the in-game credits, where the port has them — names **History Stages** as the original mod and links to the [official repository](https://github.com/Flix100000/History-Stages). |

A port that meets all three can be listed as a **verified port** on the wiki and on the official
CurseForge, Modrinth, and GitHub pages, so players find it from the main project instead of by
luck.

A port that doesn't meet them isn't authorised, and falls back under the normal "no standalone
forks" rule.

## Your port's license file

You don't have to write legal text yourself. Appendix A of the license is a fill-in-the-blanks
template — copy it into your repository as its own license file, fill in the bracketed fields, and
keep an unmodified copy of the original license next to it.

The template layers two copyrights on purpose: the original mod stays with Flix100000, and the code
you wrote to make the port work is yours. The terms themselves stay the same as the original, so a
port can't be used to relicense the mod into something more permissive by going around the back.

## A note on platform license fields

Both CurseForge and Modrinth have a real **Custom License** option, separate from their
"All Rights Reserved" preset. Use the custom one and point it at your port's license file. The ARR
preset reads to players as "no permissions granted at all", which isn't what either the original or
your port actually says.

## Questions

If anything here is unclear, or your plan sits somewhere between "port" and "own mod", just ask
before you invest the time:

- [Discord](https://discord.gg/BeZzxyZ9c4)
- [GitHub issue](https://github.com/Flix100000/History-Stages/issues)
