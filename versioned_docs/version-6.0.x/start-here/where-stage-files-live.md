---
title: Where Stage Files Live
description: "Every folder History Stages reads or writes, why the file name is the stage id, and how subfolders work."
sidebar_position: 4
---

# Where Stage Files Live

Everything History Stages reads and writes sits under `config/historystages/`:

```text
config/historystages/
    global/              one .json per global stage
    individual/          one .json per individual stage
    settings/
        visual.toml      what a player sees or hears
        gameplay.toml    what happens in the background
        graph.toml       the player-facing Stage Graph
    logs/
        debug-*.log      the load report, written at startup
        runtime-*.log    stage changes and blocked actions, if switched on
```

Which of the two stage folders a file goes in is the whole difference between a server-wide stage and
a per-player one — there is no field inside the file that says which it is. →
[Global vs Individual Stages](/wiki/6.0.x/start-here/global-vs-individual).

## The file name is the stage id

`bronze_age.json` defines the stage `bronze_age`. That id is what `/history global unlock` takes,
what another stage's [dependencies](/wiki/6.0.x/stage-file/dependencies) point at, and what
[scripts](/wiki/6.0.x/server/scripting) name. `display_name` is only the label players read.

Renaming a file therefore renames the stage, and **every unlock recorded against the old id is
gone** — nothing migrates it.

## Folders

Both stage folders take nested subfolders, up to 8 levels deep:

```text
config/historystages/global/
    ages/
        stone_age.json
        bronze_age.json
    magic/
        arcane/
            runes.json
```

Folders are organisation and nothing else. **The stage id is still just the file name**, not the
path — `magic/arcane/runes.json` is the stage `runes`, and it can be moved to another folder without
anything breaking.

The consequence is that **ids have to be unique across the whole tree**. Two files called
`iron_age.json` in different subfolders of `global/` collide: the alphabetically first path is kept,
the other is skipped with an error in `debug-*.log`.

The same id in `global/` *and* in `individual/` is a different matter. Both load, and that is exactly
how a [dual-phase lock](/wiki/6.0.x/start-here/global-vs-individual#dual-phase-when-both-lists-target-the-same-content)
is written.

Names may hold letters, digits, `-` and `_`. They may not start with `_`, and may not use `..`,
backslashes or drive letters.

The editor's **organise mode** on the Stage Overview screen ticks several stages and folders at once
and drags them onto a target folder in one move; moving a folder brings its contents along. →
[In-Game Editor](/wiki/6.0.x/in-game-tools/in-game-editor).

## Parking a file without loading it

Any file or folder whose name starts with an underscore is skipped at load time:

```text
global/
    _templates/          a whole folder, ignored
        era_template.json
    _draft_endgame.json  one file, ignored
    stone_age.json       loaded
```

This is how templates, backups and half-finished stages live next to the real ones without being
loaded. It is also the quickest way to take a stage out of a pack temporarily — rename it rather than
delete it, and its unlock records survive for when it comes back.

## Making changes take effect

| What changed | What is needed |
| :--- | :--- |
| A stage file, edited by hand | `/history reload` |
| A `.toml` in `settings/`, edited by hand | `/history reload` |
| Anything saved from the in-game editor | nothing — it reloads itself |

`/history reload` re-reads definitions only. **It never changes unlock state**: a stage that was
open stays open, and a stage that was locked stays locked. It also runs only for whoever typed it
rather than fanning out to every operator on the server.

## Reading the load report

Every startup writes a `debug-*.log` into `logs/`, listing both stage trees and every problem found:
duplicate ids, unknown item or recipe ids, per-player conditions written into a global stage. It is
the first place to look when a stage does not do what the file says.

Runtime logging — stage changes, blocked actions, inventory strips as they happen — is off by
default and switched on with `logging.enableRuntimeLogging` in
[gameplay.toml](/wiki/6.0.x/server/config-files/gameplay-toml). → [Getting Help & Reporting
Bugs](/wiki/6.0.x/about/getting-help).
