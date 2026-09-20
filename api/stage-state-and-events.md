---
title: Stage State & Events
description: "Reading which stages a player has unlocked, changing them, and reacting when they change — the part of the API any mod can call."
sidebar_position: 2
---

:::info
**API generation 6** · Requires History Stages **6.0.0+** on **NeoForge 1.21** or **Forge 1.20.1**.
The addon platform does not exist on Fabric yet.
:::

**Reading stages, changing them, and reacting when they change — the part of the API a mod needs even if it registers no extension point at all.**

Everything on this page lives in `net.bananemdnsa.historystages.api.stage`, except `CategoryLocks`, which lives in `net.bananemdnsa.historystages.api.lock`. None of it requires registration and none of it is addon-only: a compat layer, a quest reward, or a single mixin can call all of it without touching an extension point.

## Unlocking and relocking

`StageStates` is how a stage's unlock state changes. Four methods, all `static`, all server-side:

| What | Signature |
| :--- | :--- |
| unlock globally | `StageStates.unlockGlobal(String stageId, ServerLevel level)` |
| unlock for one player | `StageStates.unlockIndividual(String stageId, ServerPlayer player)` |
| relock globally | `StageStates.relockGlobal(String stageId, ServerLevel level)` |
| relock for one player | `StageStates.relockIndividual(String stageId, ServerPlayer player)` |

**All four return `boolean`, and it answers "did this call change anything".** `true` when the stage was newly unlocked or newly locked; `false` when it was already in that state and the method did nothing. It is not a success flag — nothing throws, nothing is logged, and a `false` is a no-op rather than a failure.

Use it to decide whether your own follow-up work should run. The editor's packet handler counts how many players it actually changed:

```java
int changed = 0;
for (ServerPlayer target : targets) {
    boolean applied = unlock
            ? StageStates.unlockIndividual(stageId, target)
            : StageStates.relockIndividual(stageId, target);
    if (applied) changed++;
}
```

:::warning
**None of the four checks that the stage exists.** An id that is in no stage file is written into the save data anyway, the call returns `true`, and the display name falls back to the raw id. Every caller inside the mod guards first — `StageManager.getStages().containsKey(id)` for a global stage, `StageManager.getIndividualStages().get(id) != null` for an individual one — and returns early when the stage is unknown. Do the same, or a typo becomes a phantom unlock that nothing will ever report.
:::

### What each call does besides flipping the flag

| Also does | `unlockGlobal` | `unlockIndividual` | `relockGlobal` | `relockIndividual` |
| :--- | :---: | :---: | :---: | :---: |
| Writes the save data | yes | yes | yes | yes |
| Fires the matching `StageEvent` | yes | yes | yes | yes |
| Syncs the unlocked set to clients | all players | that player | all players | that player |
| Chat / actionbar / sound, config-gated | yes | yes | yes | yes |
| Unlock toast, config-gated | yes | yes | — | — |
| Clears the structure and biome lock caches | yes | yes | yes | yes |
| Reloads recipes | yes | — | yes | — |
| Drops now-locked items from the inventory | — | — | — | yes |

The recipe reload sits only on the two global methods because recipes are a global-only lock category — a reload per individual unlock would be work for nothing. → [Global vs Individual Stages](/wiki/start-here/global-vs-individual) for why that category cannot go per-player.

Two things these methods deliberately leave alone, because they belong to whoever is driving the change: **auto-trigger progress** and **temporary-mode timers**. Relocking a stage does not reset the progress a player made towards it, and does not stop a running temporary timer. `/history stage lock` clears both itself, right after its relock; a `lose_on_death` relock expires the timer itself, and keeps the progress on purpose.

## Why you must not roll your own

There is a reason this page insists on those four methods, and it is not tidiness.

During development the in-game editor did not call them. It had its own copy of the global-unlock logic written into its packet handler, and over time the two copies drifted — in both directions. The editor's copy never played the unlock sound, never sent the chat line, and never sent the toast. That is the half that got reported, as "the unlock sound is missing on the server".

The other half was worse and nobody reported it, because it does not look like a bug. **Every caller that was not the editor** — the research pedestal, `/history stage unlock`, auto-triggers, the FTB Quests reward — never cleared the structure and biome lock caches and never reloaded recipes. So the force field stayed standing on a structure that had just been unlocked, and the stage's recipes were granted to nobody until something unrelated happened to trigger a reload. Unlocking a stage at the pedestal is the intended way to play the mod, and it was the path that did not work.

The fix was to put everything either side had into one place and delete the copy. That place is `StageStates`.

The point for an addon author: **unlocking a stage is not "set a flag".** It is a save-data write, a packet to every affected client, two cache invalidations, a recipe reload on the global paths, an inventory sweep on the individual relock, an event, and four separate config-gated pieces of player feedback. Reproducing that by hand gets you a stage that is technically unlocked and visibly broken — and the broken part is usually the part you were not thinking about.

## Reacting to changes

`StageEvent` is a loader `Event` — NeoForge's on 1.21, Forge's on 1.20.1 — with four concrete subclasses:

| Event | Fired after |
| :--- | :--- |
| `StageEvent.Unlocked` | a global stage is unlocked |
| `StageEvent.Locked` | a global stage is relocked |
| `StageEvent.IndividualUnlocked` | a stage is unlocked for one player |
| `StageEvent.IndividualLocked` | a stage is relocked for one player |

All four carry:

| Accessor | Returns |
| :--- | :--- |
| `getStageId()` | the stage's id, as written in its JSON file |
| `getDisplayName()` | the stage's display name, or the id when the stage has no entry |

The two individual variants add one more:

| Accessor | Returns |
| :--- | :--- |
| `getPlayerUUID()` | `UUID` of the player the change applies to |

Note that `IndividualUnlocked` and `IndividualLocked` hand you a `UUID`, not a `ServerPlayer`. Resolve it when you need the player, and handle `null` — the mod's own FTB Quests bridge does exactly that, and skips the work when the player is not online.

### Subscribing

These are game-bus events, not mod-bus events. That is the one thing to get right: the `Register…Event` classes an addon uses to register extension points are on the **mod bus**, `StageEvent` is on the **game bus**, and `@EventBusSubscriber` defaults to the game bus.

```java
@EventBusSubscriber(modid = "yourmodid")
public final class MyStageListener {

    private MyStageListener() {}

    @SubscribeEvent
    public static void onUnlocked(StageEvent.Unlocked event) {
        // A global stage opened up for the whole server.
        LOGGER.info("Stage unlocked: {}", event.getStageId());
    }

    @SubscribeEvent
    public static void onIndividualUnlocked(StageEvent.IndividualUnlocked event) {
        MinecraftServer server = ServerLifecycleHooks.getCurrentServer();
        if (server == null) return;

        ServerPlayer player = server.getPlayerList().getPlayer(event.getPlayerUUID());
        if (player == null) return; // offline — nothing to do here

        // Refresh whatever your mod caches per player.
    }
}
```

A lambda listener works just as well when you have no natural place for a subscriber class, which is how the FTB Quests bridge registers all four in its own `init()`:

```java
NeoForge.EVENT_BUS.addListener((StageEvent.Unlocked event) ->
        HistoryStageTask.onGlobalStageChanged(event.getStageId(), true));
```

On Forge 1.20.1 the bus is `MinecraftForge.EVENT_BUS`; the listener itself is unchanged.

### They fire from every path

Every way a stage can change posts the matching event: the research pedestal, every `/history stage` and `/history individual` subcommand, the in-game editor, an auto-trigger firing, an FTB Quests reward, a temporary stage's timer running out, a `lose_on_death` relock, and any mod calling `StageStates` itself. **A listener therefore runs regardless of what caused the change, and never has to know what caused it.**

:::warning
**One gap worth knowing about.** The creative research scroll's "unlock everything" path writes the state directly and fires no events at all. It is a testing item that never reaches a player in a normal pack, so a listener that reacts to progression is unaffected — but a listener that keeps a *mirror* of unlock state should not treat "I saw every event" as "my mirror is correct" on a creative world.
:::

## Asking whether something is gated

To ask about a *subject* rather than a stage, use `CategoryLocks` in `net.bananemdnsa.historystages.api.lock`. Both methods are server-side and consult both scopes:

| Method | Returns |
| :--- | :--- |
| `CategoryLocks.isLockedForPlayer(String categoryId, Object subject, UUID playerUuid)` | `boolean` — true when any stage gating this subject is still locked, in either scope |
| `CategoryLocks.missingStagesForPlayer(String categoryId, Object subject, UUID playerUuid)` | `List<String>` — the stage ids this player still needs, global ones first; empty when the subject is not gated |

An unknown category id answers "not locked" and an empty list rather than throwing.

→ [Lock Categories](./lock-categories.md) for what a category is, how to register one, and how the matcher decides whether a stored entry gates a runtime object.

## Scopes and reading state

### `StageScope`

A two-value enum, `GLOBAL` and `INDIVIDUAL` — which of the two stage maps a question is asked against.

An addon touches it when it declares what its own contribution means. Every extension point takes the same `supportedScopes(...)` on its builder, and the default is both:

```java
.supportedScopes(StageScope.INDIVIDUAL)
```

That is a statement about the data, not about the editor. A per-player measurement has no answer on a global stage, because there is no single player to ask. The declaration then drives both which editor tabs a packmaker is offered and which entries the runtime actually evaluates, from one source, so the two cannot disagree. `RequirementContext.scope()` is the other side of it: a requirement being evaluated is told which kind of stage it is being asked about.

Passing no scopes at all is rejected — something that supports no scope can never apply to anything.

### `StageStateView`

A `@FunctionalInterface` with one method:

```java
boolean isUnlocked(String stageId);
```

It is the "what is already unlocked" half of a lock question, for exactly one viewer: the server's global set, one player's individual set, or the matching client-side cache. It names no Minecraft types on purpose, which is what keeps the lock-resolution logic unit-testable and what let the engine move to a bitmask lookup without changing a caller.

**An addon will almost never construct one.** Nothing in the public API takes a `StageStateView` as a parameter — `CategoryLocks` builds the right viewer internally from the player UUID you pass it. You will meet the type in javadoc and in stack traces; you will not normally pass one. If you do need it — a test, or your own resolution over ids you already hold — there are two ways in: `StageStateView.NONE_UNLOCKED` for a viewer with nothing unlocked, and `StageStateView.of(Set<String>)` to wrap a set. `of` does not copy: the view keeps reflecting whatever the set says later.

### Reading whether one stage is unlocked

There is no "is stage X unlocked for player Y" method under `api`. The classes that hold that state are internal and carry no promise, so do not reach for them. What is available instead:

* `CategoryLocks.missingStagesForPlayer(...)` — the right question when what you actually care about is whether one of *your* subjects is gated.
* The `boolean` from `StageStates.unlockGlobal` / `unlockIndividual` — `false` means it was already unlocked. A blunt read, but a real one, and it is idempotent.
* `StageEvent` — track changes from the moment your mod loads and keep your own view.


---

## Older versions and Fabric

The rest of this page describes 6.0.0, which is what NeoForge 1.21.1 and Forge 1.20.1 both run. Two
things differ elsewhere.

### The class moved in 6.0.0

Use the path that matches the version you target:

| Version | Class |
| :--- | :--- |
| **6.0.0+ (NeoForge and Forge)** | `net.bananemdnsa.historystages.api.stage.StageEvent` |
| **5.6.x and older** | `net.bananemdnsa.historystages.events.StageEvent` |

Nothing else changed: the same four variants and the same accessors exist on both. Only the import
line — or, if you name the class as a string from a script, that string.

### Fabric

Fabric has no addon API and no `StageEvent` bus class. The same four changes are exposed as Fabric
`Event<>` listeners under `net.bananemdnsa.historystages.api.StageEvents`. Register them in your
mod initializer:

```java
import net.bananemdnsa.historystages.api.StageEvents;

StageEvents.UNLOCKED.register((stageId, displayName) ->
        System.out.println("History Stages: Stage Unlocked: " + stageId));

StageEvents.LOCKED.register((stageId, displayName) -> { /* ... */ });

StageEvents.INDIVIDUAL_UNLOCKED.register((stageId, displayName, playerUuid) -> { /* ... */ });
StageEvents.INDIVIDUAL_LOCKED.register((stageId, displayName, playerUuid) -> { /* ... */ });
```

They fire from the same central path, so a listener runs regardless of what caused the change —
admin command, Research Pedestal, FTB Quests reward, or another mod's API call.

---

→ [Addon Development](./addon-development.md)
