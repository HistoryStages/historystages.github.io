---
title: Diagnostics
description: "Checking your addon's data in stage files, adding a section to the debug report, and writing runtime log lines."
sidebar_position: 10
---

:::info
**New in 6.1.0** · Requires History Stages **6.1.0+** on **NeoForge 1.21**. Forge and Fabric get it
with their 6.1 port.
:::

**The debug report a pack author attaches to a bug is also yours.** An addon can check its own data
in every stage file, add a block of its own to the report, and write lines into the runtime log.
Everything here lives in `net.bananemdnsa.historystages.api.diagnostics`.

The report itself is `config/historystages/logs/debug-*.log`, written at every world start and after
`/history reload`. Its header names every mod that uses the API, so a report already shows that your
addon is installed. → [Getting Help](/wiki/about/getting-help#before-reporting-check-the-load-report)

## Checking stage data

Register a `StageCheck` on the mod bus. It runs once per loaded stage, after History Stages' own
checks:

```java
modEventBus.addListener(RegisterStageChecksEvent.class, event ->
        event.register("mymod:relic_sets", ctx -> {
            for (String set : MyCategory.get().read(ctx.entry())) {
                if (!RelicSets.exists(set)) {
                    ctx.problems().warn("Relic Sets", "Unknown relic set '" + set + "'.");
                }
            }
        }));
```

- It runs when the world starts and after `/history reload`. Registries are complete by then, so
  item and entity ids can be looked up. It does **not** run while the stage files load, because
  stages load before the registries are filled.
- What it reports lands in the report under that stage's file. Errors and warnings also go to
  `latest.log`.
- `ctx.problems()` has `error`, `warn` and `info`. **Error**: the stage cannot work as written.
  **Warn**: it works, but probably not as meant. **Info**: worth knowing.
- Your namespace is put in front of the category, so `warn("Relic Sets", …)` from `mymod:` shows
  as `mymod: Relic Sets`.
- Keep it to reading. A check must not change the stage.
- A check that throws is reported in the report, never thrown on.

## A section of your own

A `ReportSection` adds a block to the report — your version, counts, anything that helps when someone
attaches it to a bug:

```java
modEventBus.addListener(RegisterReportSectionsEvent.class, event ->
        event.register("mymod:relics", "Relic sets",
                out -> out.value("Sets loaded", RelicSets.count())));
```

`ReportWriter` has `line(String)` and `value(String label, Object value)`; History Stages does the
indenting. It is called every time the report is written. A section that writes nothing is left
out; one that throws shows the exception, and the report carries on.

History Stages' own lock totals and config sections are registered the same way.

## Runtime log lines

The runtime log, `config/historystages/logs/runtime-*.log`, records what happens during play while a
pack has `enableRuntimeLogging` on. Keep a category as a constant and write through `RuntimeLog`:

```java
static final RuntimeCategory RELIC_LOCK =
        RuntimeCategory.of("mymod:relic_lock", "Relic Lock", Kind.LOCK);

RuntimeLog.write(RELIC_LOCK, player, "Opened a sealed relic.");
```

| Method | What it does |
| :--- | :--- |
| `write(RuntimeCategory, String)` | one line |
| `write(RuntimeCategory, ServerPlayer, String)` | one line, starting with `<player name>` |
| `throttled(RuntimeCategory, String key, String)` | at most one line per key every five seconds, for things that can happen every tick |

`Kind` is the column a reader skims by: `LOCK` (a lock stopped something), `STAGE` (a stage was
gained, lost or refused), `ADMIN` (a command or the editor changed something) and `SYSTEM` (the mod
itself).

No registration: two categories with the same id are the same category. With logging off,
`RuntimeLog` does nothing, so a call on a hot path costs one config read. Lines are buffered and
written every 30 seconds. Throttle keys are kept apart per category, so an addon cannot silence one
of History Stages' own lines.

---

→ [Addon Development](./addon-development.md)
