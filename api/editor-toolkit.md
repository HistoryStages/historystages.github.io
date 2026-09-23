---
title: Editor Toolkit
description: "The three tiers of editor UI an addon can write, from reusing a ready-made list to drawing a tab yourself."
sidebar_position: 9
---

:::info
**API generation 6** · Requires History Stages **6.0.0+** on **NeoForge 1.21**, **Forge 1.20.1**
or **Fabric 1.21.1**.
:::

**The same toolkit serves all five extension points, and that is the whole reason an addon's tab looks like a built-in one — it is built from the same widgets.**

A lock category, a requirement, an auto-trigger, a stage settings group and a config section all reach the packmaker through the same rows, search bars, pickers and input screens the mod draws for itself. There is no addon-flavoured widget set beside the real one, so a tab is not "styled to match": it matches because it is the same code. → [Addon Development](./addon-development.md) covers where each extension point plugs in; this page is what a maintainer then sees.

## Three tiers

How much UI you write is a choice, and the first tier is none at all.

| Tier | What you write | How you get it |
| :--- | :--- | :--- |
| 1 — reuse a list | Nothing. The addon says which ids exist. | `CategoryEditor.ofIdList`, `TriggerEditor.ofIdList`, `RequirementEditor.ofIdList` / `ofIdCount` |
| 2 — your own list | A subclass of `AbstractSearchableList<T>`, supplying the data source, the row drawing and the match predicate | Hand it back from the tab's picker factory, the way `GenericIdPicker` is |
| 3 — draw it yourself | `renderContent`, `rowAt` and whichever input hooks you need | Implement `createTab` and return a tab of your own |

Tier 2 is the middle ground and is easy to miss. `AbstractSearchableList<T>` already owns the search bar, the filter dropdown, the panel frame, the scrollbar arithmetic, the mouse and keyboard handling and show/hide; a subclass supplies `loadEntries`, `getIdForFilter`, `matchesQuery`, `selectionValueOf` and `renderRow`. `GenericIdPicker` is that subclass for the case where four of those five answers are the identity — which is why tier 1 exists at all.

Nothing forces a whole addon into one tier. The demo takes tier 1 for one of its auto-triggers and tier 3 for its lock category, in the same file.

## Tier 1: one call

The demo registers its "relic found" trigger with no UI code whatsoever:

```java
event.register(TriggerEditor.ofIdList(
        DemoAddonCategory.TRIGGER_TYPE,
        "editor.historystages.demo.auto_trigger.relic_found",
        "editor.historystages.demo.search.relics",
        DemoAddonCategory::candidateRelics,
        RelicFoundTrigger::new,
        t -> t instanceof RelicFoundTrigger r ? r.relic() : ""));
```

The last two arguments are the pair that makes the free tier work in both directions.

`RelicFoundTrigger::new` is the **factory**: `Function<String, TriggerCondition>`, called with whichever id the maintainer picked out of the list, returning the condition to store on the stage.

`t -> t instanceof RelicFoundTrigger r ? r.relic() : ""` is the **way back**: `Function<TriggerCondition, String>`, handed a condition that was loaded from disk and asked which id it was built from. Only the addon can read its own trigger, so without this the editor has nothing to print in the value column. The five-argument overload of `ofIdList` supplies `t -> ""` for it, and lists render that as the bare type — honest, but a trigger list where every row says the same thing.

:::note
**Note:** The type string passed first must name a trigger type that is actually registered, and the same holds for `CategoryEditor.ofIdList` and `RequirementEditor.ofIdList` / `ofIdCount`. Those two build their tab against the registered category or requirement and throw `IllegalStateException` from `createTab` when nothing is registered under the id — at the moment the tab is opened, naming the id.
:::

`RequirementEditor` has one extra wrinkle: both of its factories read and write `IdCountEntry`, so a requirement using either must have registered with `RequirementStorage.gson(IdCountEntry.class)`. `ofIdCount` adds an amount dialog on top of the picker; `ofIdList` stores the same entry shape with a count of 1, rather than a second shape differing by one field.

## Tier 3: drawing your own tab

At the other end, a tab draws its own content and the host stays out of the way. This is the demo's lock-category tab in full — `onShown`, `contentHeight`, `rowAt`, `renderContent`, `mouseClicked` and all four row slots, in one file:

```java
package net.bananemdnsa.historystages.demo;

import net.bananemdnsa.historystages.api.editor.StringListCategoryTab;
import net.bananemdnsa.historystages.api.editor.TabInputContext;
import net.bananemdnsa.historystages.api.editor.TabRenderContext;
import net.bananemdnsa.historystages.api.editor.widget.EditorRowList;
import net.bananemdnsa.historystages.api.lock.LockCategory;
import net.minecraft.network.chat.Component;

/**
 * The stand-in addon's lock-category tab, drawing itself.
 *
 * <p>Its twin on the dependency side gets more attention, but this one is the proof that matters
 * for the <em>lock</em> axis: the stage editor honours the same hooks, so an addon writes a tab the
 * same way whichever axis it plugs into. Without something like this the hook is only claimed to
 * work there.
 *
 * <p>What it shows that a plain row list cannot: taller rows, a colour block painted per entry, and
 * a button inside the row that moves the entry up. That last one is real editing and not a
 * decoration — the order of a category's entries is stored, so the button changes the stage file.
 *
 * <p>Reading and writing are inherited untouched from {@link StringListCategoryTab}. An addon that
 * only wants the list keeps {@code CategoryEditor.ofIdList} and writes none of this.
 */
final class DemoCategoryTab extends StringListCategoryTab {

    private static final int ROW_HEIGHT = 30;

    private final EditorRowList rows = new EditorRowList(ROW_HEIGHT);

    DemoCategoryTab(LockCategory<String> category, PickerFactory pickerFactory, Runnable onChanged) {
        super(category, pickerFactory, onChanged);
    }

    @Override
    public void onShown() {
        rows.resetSlideIn();
    }

    @Override
    public int contentHeight(int width) {
        return rows.heightForRows(entries().size());
    }

    @Override
    public int rowAt(TabInputContext ctx) {
        return rows.rowAt(ctx, entries().size());
    }

    @Override
    public boolean renderContent(TabRenderContext ctx) {
        rows.render(ctx, entries().size(), (row, i) -> {
            String relic = entries().get(i);
            row.leading(10, (g, x, y, w, h) -> g.fill(x, y + 2, x + w, y + h - 2, colourFor(relic)));
            row.text(relic);
            row.badge("#" + (i + 1), 0x888888);
            if (i > 0) {
                row.button(Component.translatable("editor.historystages.demo.row.move_up").getString(),
                        () -> moveUp(i));
            }
        });
        return true;
    }

    @Override
    public boolean mouseClicked(TabInputContext ctx, int button) {
        return button == 0 && rows.mouseClicked(ctx);
    }

    private void moveUp(int index) {
        if (index <= 0 || index >= entries().size()) return;
        String moved = entries().remove(index);
        entries().add(index - 1, moved);
        markChanged();
    }

    /** A stable colour per id, so the same relic looks the same every time the screen opens. */
    private static int colourFor(String relic) {
        int hash = relic.hashCode();
        return 0xFF000000 | (0x404040 + (hash & 0x7F7F7F));
    }
}
```

Three things in there are worth pulling out.

`renderContent` returns **true**, which is the tab saying "I drew it". Returning false — the default — means the host falls back to drawing `entries()` as its own standard rows, which is what every tab written before the self-drawing hooks existed relies on.

`rowAt` exists because the host knows where *its* rows are and cannot know where yours went. Without an answer, a self-drawing tab could never offer a right-click menu on a row.

Reading and writing are not overridden at all. `load` and `store` come down untouched from `StringListCategoryTab`, which goes through `LockCategory.read` / `write` — so a tab and a lock check can never disagree about where a category's entries live.

## Registering the editor

The demo's category editor, whole:

```java
@SubscribeEvent
public static void onRegisterEditors(RegisterCategoryEditorsEvent event) {
    if (!DemoAddonCategory.enabled()) return;

    event.register(new CategoryEditor() {
        @Override
        public String categoryId() {
            return DemoAddonCategory.CATEGORY_ID;
        }

        @Override
        public CategoryTab createTab(Runnable onChanged, StageScope scope) {
            return new DemoCategoryTab(DemoAddonCategory.category(),
                    (onSelect, alreadyAdded) -> {
                        GenericIdPicker picker = new GenericIdPicker(
                                "editor.historystages.demo.search.relics",
                                DemoAddonCategory::candidateRelics, onSelect, alreadyAdded);
                        picker.setMultiSelect(true);
                        return picker;
                    },
                    onChanged);
        }
    });
}
```

Two things about that.

**Editor registration is client-side.** The subscriber carries `value = Dist.CLIENT`:

```java
@EventBusSubscriber(modid = HistoryStages.MOD_ID, value = Dist.CLIENT,
        bus = EventBusSubscriber.Bus.MOD)
```

On Fabric the same split is the `historystages:client` entrypoint and its `HistoryStagesClientPlugin`. → [On Fabric](./addon-development.md#on-fabric)

`RegisterCategoryEditorsEvent` and `RegisterTriggerEditorsEvent` fire once on the client only, deliberately separate from the common-side events that register the category or the trigger type itself — the server gates with those, while a tab is pure UI. Registering a category and giving it no editor is legal and means exactly what it looks like: the category loads, stores and gates, it just cannot be edited in game.

**`createTab(Runnable onChanged, StageScope scope)` hands you the callback you must fire.** It is how the editor learns the stage is dirty and re-measures its scroll extent, and nothing calls it for you. Pass it down to whatever you build — `AbstractCategoryTab` takes it in its constructor and exposes it as the protected `markChanged()`, which is what the demo's `moveUp` calls. A tab that changes data without firing `onChanged` leaves the editor believing nothing happened.

`createTab` runs once, when the editor opens. `rebuildPicker()` is called from the screen's `init()`, which Minecraft runs again on **every window resize** — so the picker is rebuilt each time while the tab and its entries are created once and must survive. A tab that rebuilt its entry list from `init()` would throw the maintainer's edits away on a resize.

## Going further

- **[Editor Widgets](./editor-widgets.md)** — the `EditorRowList` row widget, `GenericIdPicker`, right-click actions on entries, and multi-section tabs.
- **[Editor Screens](./editor-screens.md)** — the `onShown()` gotcha, custom authoring screens for triggers with no list to pick from, and the full `EditorTab` hook contract.

---

→ [Lock Categories](./lock-categories.md) — giving a lock category its tab.
→ [Requirements](./requirements.md) — the dependency axis and its own tabs.
→ [Auto-Triggers](./auto-triggers.md) — trigger types, and what an editor authors.
→ [Stage Settings](./stage-settings.md) — settings groups, including the custom-screen escape hatch.
→ [Config Sections](./config-sections.md) — the config screen's own field kinds.
→ [Addon Development](./addon-development.md) — the entry point and the five extension points.
