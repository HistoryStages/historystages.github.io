---
title: Stage State & Events
description: "Reading which stages a player has unlocked, changing them, and reacting when they change — the part of the API any mod can call."
sidebar_position: 2
---

:::info
**API generation 6** · Requires History Stages **6.0.0+** on **NeoForge 1.21**, **Forge 1.20.1**
or **Fabric 1.21.1**. Everything marked **6.1** needs **6.1.0+ on NeoForge**; Forge and Fabric get
it with their 6.1 port. `HistoryStagesAPI.API_MINOR` is `1` from 6.1.0 on.
:::

**Reading stages, changing them, and reacting when they change — the part of the API a mod needs even if it registers no extension point at all.**

Everything on this page lives in `net.bananemdnsa.historystages.api.stage`, except where a section names another package. None of it requires registration and none of it is addon-only: a compat layer, a quest reward, or a single mixin can call all of it without touching an extension point.

## Reading state

`StageStates` answers everything about who has what. All methods are `static` and server-side.

| What | Signature | |
| :--- | :--- | :--- |
| does the world have it | `isUnlockedGlobal(String stageId, ServerLevel level)` | |
| does this player have it | `isUnlockedIndividual(String stageId, ServerPlayer player)` | |
| either, by the stage's own tree | `isUnlockedFor(String stageId, ServerPlayer player)` | 6.1 |
| which tree an id is in | `scopeOf(String stageId)` → `StageScope` or `null` | 6.1 |
| the loaded definition | `findStage(String stageId)`, `loadedStages()` | 6.1 |
| everything unlocked | `unlockedGlobal(ServerLevel)`, `unlockedIndividual(ServerPlayer)` → copies | 6.1 |
| a live view | `globalView(ServerLevel)`, `individualView(ServerPlayer)` → `StageStateView` | 6.1 |
| when it was unlocked | `unlockedAtGlobal(...)`, `unlockedAtIndividual(...)` → `OptionalLong` game time | 6.1 |
| time left on a temporary stage | `remainingTicksGlobal(...)`, `remainingTicksIndividual(...)` → `OptionalLong` | 6.1 |
| blocked by its logic | `isBlocked(String stageId, ServerPlayer player)` | 6.1 |
| lost for good | `isLostForGood(String stageId, ServerPlayer player)` | 6.1 |
| requirements, group by group | `checkRequirements(String stageId, ServerPlayer player)` → `RequirementResult` | 6.1 |
| the name this player may see | `displayNameFor(String stageId, ServerPlayer player)` | 6.1 |
| may lock hints name it | `showsLockHints(String stageId)` | 6.1 |

A few of these have a catch:

- **An id in both trees counts as global** for `scopeOf`, `isUnlockedFor` and `findStage`. When
  both trees meet and that matters, use [`StageRef`](#the-stage-graph).
- **`displayNameFor` returns `"???"`** for a stage the player does not have and whose
  [Hidden while](/wiki/stage-file/logic-blocks#hidden-while) block hides it. Use it for every
  message that names a stage, so an addon never gives a hidden one away.
- **`checkRequirements` is asked without a scroll**, so requirements measured by what was handed in
  at a pedestal read as not met. Everything measured off the player or the world is accurate.
- `findStage` and `loadedStages` hand out the loaded definitions. Treat them as read-only; changes
  are neither saved nor synced.

## Unlocking and relocking

`StageStates` is also how a stage's state changes:

| What | Signature | |
| :--- | :--- | :--- |
| unlock globally | `unlockGlobal(String stageId, ServerLevel level)` | |
| unlock for one player | `unlockIndividual(String stageId, ServerPlayer player)` | |
| … for a player who may be offline | `unlockIndividual(String stageId, UUID player, MinecraftServer server)` | 6.1 |
| relock globally | `relockGlobal(String stageId, ServerLevel level)` | |
| relock for one player | `relockIndividual(String stageId, ServerPlayer player)` | |
| … for a player who may be offline | `relockIndividual(String stageId, UUID player, MinecraftServer server)` | 6.1 |
| several at once | `unlockGlobal(Collection<String>, ServerLevel)`, `unlockIndividual(Collection<String>, ServerPlayer)` → `List<String>` | 6.1 |
| past the logic, for admin tools | `forceUnlockGlobal(...)`, `forceUnlockIndividual(...)` → `UnlockOutcome` | 6.1 |

**The single calls return `boolean`, and it answers "did this call change anything".** `true` when
the stage was newly unlocked or newly locked; `false` when nothing changed. Use it to decide
whether your own follow-up should run:

```java
int changed = 0;
for (ServerPlayer target : targets) {
    if (StageStates.unlockIndividual(stageId, target)) changed++;
}
```

**A normal unlock can be refused.** Since 6.1, `unlockGlobal` and `unlockIndividual` return `false`
without doing anything when:

- no loaded stage of that tree has the id — a typo, or a global id passed to the individual
  method. A warning is logged once per id;
- the stage is [lost for good](/wiki/stage-file/relocking#lost-for-good);
- its [logic](/wiki/stage-file/logic-blocks#blocked-while) blocks it;
- a listener cancels [`StageEvent.BeforeUnlock`](#vetoing-an-unlock).

Relocking stays permissive on purpose, so a stage deleted from the files can still be cleared out of
a save.

The **batch** forms run every stage through the same checks and post its own event, but players hear
about it once, with every name in one message. They return the ids that were newly unlocked, in the
order given.

The **force** forms are what commands and the editor use: they go past a logic block, clear a
lost-for-good mark, and return `UnlockOutcome(boolean unlocked, boolean wasBlocked)` so the caller
can tell the operator what it overrode. They skip `BeforeUnlock`. Use them only for tools that act
as an admin.

The **offline** forms write the stage, log it and post the event; the sync and the messages wait
for the next login, where the player's stages are sent anyway.

:::note[On 6.0.x]
Forge and Fabric, until their 6.1 port, have only the four single calls, and those do **not** check
that the stage exists: an unknown id is written into the save and the call returns `true`. Guard
with `StageManager.getStages().containsKey(id)` or `StageManager.getIndividualStages().get(id) != null`
there.
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
| Drops now-locked items from the inventory | — | — | — | yes, with `dropOnRevoke` |
| Shares with the team | — | yes, for [shared stages](/wiki/start-here/global-vs-individual#sharing-with-a-team) | — | with `shareLoss` |

The recipe reload sits only on the two global methods because individual recipe locks are checked
at the station rather than by removing the recipe. → [Global vs Individual Stages](/wiki/start-here/global-vs-individual)

Two things these methods deliberately leave alone, because they belong to whoever is driving the change: **auto-trigger progress** and **temporary-mode timers**. Relocking a stage does not reset the progress a player made towards it, and does not stop a running temporary timer. `/history stage lock` clears both itself, right after its relock; a `lose_on_death` relock expires the timer itself, and keeps the progress on purpose.

## Why you must not roll your own

There is a reason this page insists on these methods, and it is not tidiness.

During development the in-game editor did not call them. It had its own copy of the global-unlock logic written into its packet handler, and over time the two copies drifted — in both directions. The editor's copy never played the unlock sound, never sent the chat line, and never sent the toast. **Every caller that was not the editor** never cleared the structure and biome lock caches and never reloaded recipes. So the force field stayed standing on a structure that had just been unlocked.

It happened again: until 6.1 the research pedestal and the FTB Quests reward kept their own copies. Both ran a full `/history reload` on every unlock, skipped the cache invalidation and the actionbar line, and gave addons no way to refuse. Both go through `StageStates` now.

The point for an addon author: **unlocking a stage is not "set a flag".** It is a save-data write, a packet to every affected client, two cache invalidations, a recipe reload on the global paths, an inventory sweep on the individual relock, team sharing, logic checks, an event, and four separate config-gated pieces of player feedback. Reproducing that by hand gets you a stage that is technically unlocked and visibly broken.

## Reacting to changes

`StageEvent` is a loader `Event` — NeoForge's on 1.21, Forge's on 1.20.1, History Stages' own on Fabric — with these subclasses:

| Event | Fired | |
| :--- | :--- | :--- |
| `StageEvent.Unlocked` | after a global stage is unlocked | |
| `StageEvent.Locked` | after a global stage is relocked | |
| `StageEvent.IndividualUnlocked` | after a stage is unlocked for one player | |
| `StageEvent.IndividualLocked` | after a stage is relocked for one player | |
| `StageEvent.BeforeUnlock` | before a normal unlock, cancellable | 6.1 |
| `StageEvent.LostForGood` | after a stage is marked lost for good | 6.1 |

All carry:

| Accessor | Returns | |
| :--- | :--- | :--- |
| `getStageId()` | the stage's id, as written in its JSON file | |
| `getDisplayName()` | the stage's display name, or the id when the stage has no entry | |
| `getCause()` | a `StageChangeCause` saying why | 6.1 |

The individual variants add `getPlayerUUID()`. `BeforeUnlock` and `LostForGood` cover both trees:
`isGlobal()` tells which, and `getPlayerUUID()` is `null` for a global stage.

Note that the individual events hand you a `UUID`, not a `ServerPlayer`. Resolve it when you need the player, and handle `null` — the player may be offline.

A stage shared with a team posts `IndividualUnlocked` once per teammate who receives it, each with
that teammate's UUID. Offline teammates get theirs when they next log in.

### Why it happened: `StageChangeCause`

**6.1.** One of `RESEARCH`, `CREATIVE`, `AUTO_TRIGGER`, `CONDITIONAL`, `LOCK_TRIGGER`, `TEMPORARY`,
`DEATH`, `LOGIC`, `TEAM`, `QUEST`, `SCRIPT`, `COMMAND`, `EDITOR` and `ADDON`. A call from your own
mod is `ADDON`.

Nested changes keep their own cause: a teammate who receives a stage through team sharing sees
`TEAM`, even though the original unlock was `RESEARCH`.

### Vetoing an unlock

**6.1.** `StageEvent.BeforeUnlock` is cancellable. Cancel it to keep the stage locked — while a
player cannot pay what your addon charges for it, say:

```java
@SubscribeEvent
public static void onBeforeUnlock(StageEvent.BeforeUnlock event) {
    if (!event.isGlobal() && !Wallet.canPay(event.getPlayerUUID(), event.getStageId())) {
        event.setCanceled(true);
    }
}
```

It fires for every unlock a logic block could also stop: the pedestal, auto-triggers, FTB Quests
rewards, scripts, team sharing and any mod calling `unlockGlobal` / `unlockIndividual`. It comes
after those checks, so it only fires for an unlock that would otherwise happen. Admin unlocks skip
it. A refusal is silent; tell the player yourself if they should know why. A pedestal whose
research is refused keeps the scroll.

### Taking over the messages

**6.1.** `StageAnnounceEvent` fires just before the mod tells players about an unlock or relock —
chat, actionbar, sound and toast. Cancel it to show something of your own; the change itself has
already happened.

| Accessor | Returns |
| :--- | :--- |
| `getStageIds()`, `getDisplayNames()` | the stages announced, usually one, in the same order |
| `getPlayerUUID()` | the one player told, or `null` when every player is told |
| `isUnlock()` | `true` for an unlock, `false` for a relock |
| `getCause()` | the `StageChangeCause` |

It is not fired for a stage set not to [notify](/wiki/stage-file/relocking#notify). A batch arrives
as one event naming all its stages, and so do "unlock everything" and the creative scroll.

### When the definitions change

**6.1.** `StageDefinitionsChangedEvent` says the loaded stage **definitions** changed: a reload, a
stage saved, moved or deleted in the editor, or a new set synced to the client. Rebuild anything
you derive from the stages, reading them through `StageStates.loadedStages()`.

It is posted on the game bus once, at the end of the tick in which the change happened, so the
definitions are complete by then. Several changes in one tick arrive as one event. In single player
it is posted once for client and server together. Who has what is `StageEvent`, not this.

### Subscribing

These are game-bus events, not mod-bus events. That is the one thing to get right: the `Register…Event` classes an addon uses to register extension points are on the **mod bus**, `StageEvent` is on the **game bus**, and `@EventBusSubscriber` defaults to the game bus.

```java
@EventBusSubscriber(modid = "yourmodid")
public final class MyStageListener {

    private MyStageListener() {}

    @SubscribeEvent
    public static void onUnlocked(StageEvent.Unlocked event) {
        LOGGER.info("Stage unlocked: {} ({})", event.getStageId(), event.getCause());
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

A lambda listener works just as well when you have no natural place for a subscriber class:

```java
NeoForge.EVENT_BUS.addListener((StageEvent.Unlocked event) ->
        HistoryStageTask.onGlobalStageChanged(event.getStageId(), true));
```

On Forge 1.20.1 the bus is `MinecraftForge.EVENT_BUS`; the listener itself is unchanged.

### Subscribing on Fabric

Fabric has no game bus. History Stages posts `StageEvent` on a small bus of its own,
`net.bananemdnsa.historystages.platform.bus.EventBus`, and a listener goes there. Your mod
initializer is a fine place to add it — nothing fires before a world is running:

```java
import net.bananemdnsa.historystages.api.stage.StageEvent;
import net.bananemdnsa.historystages.platform.bus.EventBus;

EventBus.addListener(StageEvent.Unlocked.class,
        event -> LOGGER.info("Stage unlocked: {}", event.getStageId()));

EventBus.addListener(StageEvent.IndividualUnlocked.class, event -> {
    // A UUID, not a player: look it up in your server's player list, and expect null
    // when the player is offline.
});
```

Two differences from the other loaders:

- **Subscribe to the concrete class.** The bus dispatches by the event's own class, not its
  supertypes, so a listener on `StageEvent` itself receives nothing. Add one per variant you need.
- **The bus class sits outside `api`.** It is the bus `StageEvent` is posted on, and the event's own
  javadoc points to it, but the API generation promise covers the `api` package only.

There is also `EventBus.register(...)`, which takes a class with static methods (or an object) and
subscribes every method marked with `platform.bus.SubscribeEvent` — the same shape as
`@EventBusSubscriber` on the other loaders, without the annotation on the class.

### They fire from every path

Every way a stage can change posts the matching event: the research pedestal, every `/history` subcommand, the in-game editor, an auto-trigger, a lock trigger, a While stage, a logic block, team sharing, an FTB Quests reward, a temporary stage's timer running out, a `lose_on_death` relock, and any mod calling `StageStates` itself. **A listener therefore runs regardless of what caused the change**, and `getCause()` says what did.

Since 6.1 that includes the creative scroll. On 6.0.x its "unlock everything" path wrote the state
directly and fired no events.

## Progress

**6.1.** `StageProgress` says how far along a stage is, for progress bars, HUDs and quest books.

| Method | Returns |
| :--- | :--- |
| `triggers(String stageId, ServerPlayer player)` | `Optional<Triggers>` — the auto-trigger state: the world's for a global stage, this player's for an individual one |
| `research(ServerLevel level, BlockPos pos)` | `Optional<Research>` — what the pedestal at `pos` is researching |
| `research(ItemStack scroll)` | `Optional<Research>` — the research stored on a scroll |

`Triggers(boolean all, List<TriggerEntry> entries, boolean complete)` has `met()` for the count, and
each `TriggerEntry(TriggerCondition trigger, boolean met)`. Negated triggers are left out; they are
checked on the spot and never recorded.

`Research(String stageId, int progress, int total, boolean running, UUID owner)` has `fraction()`.
`running` is `false` while paused, while requirements are missing, and for a scroll lying in an
inventory.

## The stage graph

**6.1.** `StageGraph` is the stages as a graph: which stage requires which, and where a player
stands. Reachability follows the stage graph screen exactly, so an addon and the graph never
disagree. Only stage requirements make edges; items, XP and the rest do not.

| Method | Returns |
| :--- | :--- |
| `requires(StageRef stage)` | the stages it names in its dependency groups, in order |
| `requiredBy(StageRef stage)` | the stages that name it |
| `state(StageRef stage, ServerPlayer player)` | `Node.UNLOCKED`, `REACHABLE`, `BLOCKED` or `LOCKED` |
| `missingOnPathTo(StageRef target, ServerPlayer player)` | every stage still missing on the way, requirements first |

`missingOnPathTo` lists every alternative of an OR group, since any could be the way; a quest book
showing one route has to pick. A stage the player already has ends its branch.

`StageRef(String id, StageScope scope)` names a stage together with its tree, because a global and
an individual stage may share an id. Build one with `StageRef.global(id)`, `StageRef.individual(id)`
or `StageRef.of(id)`, which looks the id up global first and returns `null` for an unknown one.

## Asking whether something is gated

To ask about a *thing* rather than a stage, there are three classes in
`net.bananemdnsa.historystages.api.lock`, all server-side:

- **`ItemLocks`** for item stacks — **6.1**, and the one to use for items.
- **`PlaceLocks`** for positions — **6.1**.
- **`CategoryLocks`** for everything else, by category id.

→ [Lock Categories: Asking at runtime](./lock-categories.md#asking-at-runtime) has the methods and
the subjects each category takes.

## On the client

**6.1.** `net.bananemdnsa.historystages.api.client` answers the same questions for the local player,
from what the server last synced — for a screen that greys something out, or a tooltip that names a
stage before the server has been asked.

| Class | What it has |
| :--- | :--- |
| `ClientStages` | `isUnlockedGlobal`, `isUnlockedIndividual`, `isUnlocked`, `globalView()`, `individualView()`, `displayName`, `scopeOf` |
| `ClientLocks` | `isLocked(categoryId, subject)`, `missingStages(...)`, `isItemGated(stack)`, `isItemActionLocked(stack, action)` |
| `ClientStagesChangedEvent` | game bus, client side: the synced sets changed; redraw |

**Client only.** Touching these from code that also runs on a dedicated server crashes it there;
keep the call behind a client-only class. The answers trail a change by one packet, and the server
stays the authority: never let a client answer decide something that matters.
`ClientStagesChangedEvent` may also fire for a resync that changed nothing, so keep the listener
cheap.

The 6.0 class `client.cache.ClientCategoryLocks` was internal and is gone; use `ClientLocks`.

## Teams

**6.1.** `net.bananemdnsa.historystages.api.team` is how
[team sharing](/wiki/start-here/global-vs-individual#sharing-with-a-team) finds out who plays
together.

`Teams` asks the active providers: `teammates(ServerPlayer)`, `teammates(UUID, MinecraftServer)`,
`areTeammates(UUID, UUID, MinecraftServer)`, and `isSharedWithTeam(String stageId)`, which is true
when the stage is set to share and its mode allows it.

FTB Teams ships as a provider. Another team mod registers its own on the mod bus:

```java
modEventBus.addListener(RegisterTeamProvidersEvent.class, event ->
        event.register("mymod:parties", (server, player) -> MyParties.membersOf(player)));
```

A `TeamProvider` returns the other members of the player's team, online or not, without the player
itself. **Leave out teams a player did not choose**: a mod that gives everyone a solo team must not
report it, and a server-wide team would share everything with everyone. With several providers the
teammates are the union.

If your mod knows when a player joins a team, call `TeamChanges.joined(player)` on the server
thread, so `shareOnJoin` works with your teams too.

## Scopes and views

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

It is the "what is already unlocked" half of a lock question, for exactly one viewer: the server's global set, one player's individual set, or the client-side copy. It names no Minecraft types on purpose, which keeps the lock-resolution logic unit-testable.

`StageStates.globalView` / `individualView` and `ClientStages.globalView` / `individualView` hand
out live ones that answer from the current state on every call, so holding one across ticks is
safe. For a test, `StageStateView.NONE_UNLOCKED` has nothing unlocked and `StageStateView.of(Set<String>)`
wraps a set without copying it.

---

## Older versions

Code written against 5.x needs one change, and which one depends on the loader.

### NeoForge and Forge: the class moved

| Version | Class |
| :--- | :--- |
| **6.0.0+** | `net.bananemdnsa.historystages.api.stage.StageEvent` |
| **5.6.x and older** | `net.bananemdnsa.historystages.events.StageEvent` |

The same four variants and the same accessors exist on both. Only the import line changes — or, if
you name the class as a string from a script, that string.

### Fabric: `StageEvents` is gone

Fabric 5.2 exposed the four changes as Fabric `Event<>` fields on
`net.bananemdnsa.historystages.api.StageEvents`. That class no longer exists in 6.0.0. Each field
maps to one `StageEvent` variant, registered as shown in
[Subscribing on Fabric](#subscribing-on-fabric):

| 5.2 | 6.0.0 |
| :--- | :--- |
| `StageEvents.UNLOCKED` | `StageEvent.Unlocked` |
| `StageEvents.LOCKED` | `StageEvent.Locked` |
| `StageEvents.INDIVIDUAL_UNLOCKED` | `StageEvent.IndividualUnlocked` |
| `StageEvents.INDIVIDUAL_LOCKED` | `StageEvent.IndividualLocked` |

The callback's `(stageId, displayName)` and `playerUuid` arguments are now the event's
`getStageId()`, `getDisplayName()` and `getPlayerUUID()`.

---

→ [Addon Development](./addon-development.md)
