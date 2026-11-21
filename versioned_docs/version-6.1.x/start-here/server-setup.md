---
title: Putting It on a Server
description: "A step-by-step walk-through for adding History Stages to a multiplayer server and getting players connected, written for people who have never set up a modded server before."
sidebar_position: 2.5
---

# Putting It on a Server

This page is for you if you have a multiplayer server and want History Stages on it, but have never
installed a mod on a server before. It goes step by step and assumes nothing. If you already run a
modded server, [Running a Server](/wiki/6.1.x/server/running-a-server) is the shorter, more technical
version.

## The short version

History Stages goes on the server **and** on every player's game. The same goes for Lootr. Both
sides need the same version. After that, you build stages on the server from inside the game, and
the players see them the moment they join.

## 1. Check which version you need

History Stages comes in builds for different loaders and Minecraft versions. Your server tells you
which one you need: look at what it runs (for example NeoForge 1.21.1 or Forge 1.20.1) and download
the History Stages file for exactly that combination.

[Versions & Platforms](/wiki/6.1.x/about/versions-and-platforms) lists which builds exist.

## 2. Download what you need

You need these files, all for the same loader and Minecraft version as your server:

| File | Why |
| :--- | :--- |
| History Stages | The mod itself. |
| [Lootr](https://modrinth.com/mod/lootr) | Required. History Stages will not start without it. |
| Fabric API | Only on Fabric. |
| [Architectury API](https://modrinth.com/mod/architectury-api) | Only on Minecraft 26.2. |

JEI or EMI and Jade are optional but worth adding. They show players what is locked before they run
into it. [Installation](/wiki/6.1.x/start-here/installation#what-you-need-alongside-it) explains what each
one adds.

## 3. Put the files on the server

Every modded server has a `mods` folder next to its world folder. On a rented server you usually
reach it through the host's web panel, under a file manager or "Files" tab.

1. Stop the server.
2. Upload the files from step 2 into the `mods` folder.
3. Start the server again.

When it is running, a new folder `config/historystages/` appears. That is where your stages will
live. It is empty for now, and an empty folder means nothing is locked yet.

## 4. Give every player the same mods

This is the step people forget. History Stages adds its own blocks, items and screens, so a player
without it cannot join the server at all.

Every player puts the same files into **their own** `mods` folder, the one in their Minecraft
installation. The versions must match the server's. A missing or mismatched mod usually shows up as
an error screen when the player tries to join.

The easiest way to hand this to players is a modpack: put the server's mods into a CurseForge or
Modrinth profile and share it, so everybody gets the same set with one click. If you only have a few
players, sending them the files directly works just as well.

## 5. Make yourself an operator

Building stages needs operator rights (permission level 2). In the server console, type:

```text
op YourName
```

On a rented server the console is usually in the web panel. Players without operator rights never
need them. Researching, reading scrolls and looking at the stage graph work for everybody.

## 6. Build your first stage

Join the server, press Escape, and click **Stage Editor** in the top right corner of the pause menu.
Typing `/history editor` in chat opens the same screen. Everything you save there goes straight to the server and to every player who is online.
You do not need to restart anything.

[Installation & Your First Stage](/wiki/6.1.x/start-here/installation#your-first-stage) walks through
building a first stage in the editor. It works the same on a server as in singleplayer.

## 7. Let players unlock stages

Out of the box, players have no way to research anything. The mod ships no recipes for the
Research Pedestal or the scrolls, because how players earn progress is your decision as the pack
author. Until you add a recipe, a quest reward or something similar, only `/give` and creative mode
hand them out.

[Obtaining Scrolls & Pedestals](/wiki/6.1.x/in-game-tools/research/obtaining) has ready-made recipes you
can copy.

To test a stage without the research loop, open and close it by command:

```text
/history global unlock <stage id>
/history global lock <stage id>
```

## How it all fits together

If the setup works but the mod itself still feels confusing, this is the whole idea in a few
sentences.

You create **stages**, for example "Iron Age". Each stage holds a list of things it keeps locked:
items, recipes, dimensions, mobs and so on. As long as the stage is locked, players cannot use
anything on that list. Once someone **researches** the stage at a Research Pedestal using a Research
Scroll, it opens and the content becomes available.

A stage is either **global**, which means one player unlocks it for the whole server, or
**individual**, which means every player has to unlock it for themselves.
[Global vs Individual Stages](/wiki/6.1.x/start-here/global-vs-individual) explains which one fits which
kind of server.

## Something does not work?

- **Players cannot join:** compare the `mods` folders. The server and the player need the same
  History Stages and Lootr versions.
- **The Stage Editor button is missing in the pause menu:** you are not an operator yet, see step 5.
  If you were made operator while already on the server, close the pause menu and open it again.
- **A lock does not do what you expected:** look at the newest `debug-*.log` in
  `config/historystages/logs/` on the server. It lists the problems it found in each stage file, such
  as ids that do not exist.

If you are stuck, [Getting Help](/wiki/6.1.x/about/getting-help) says where to ask and what to bring along.
