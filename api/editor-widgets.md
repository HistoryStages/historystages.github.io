---
title: Editor Widgets
description: "The row widget, pickers, right-click menus and the rest of the catalogue every editor tab is built from."
sidebar_position: 10
---

The reference side of the toolkit: the row widget every tab is built from, the ready-made picker, the
right-click menu, multi-section tabs, and the full widget catalogue. → [Editor Toolkit](./editor-toolkit.md)
covers the three tiers and how to register a tab in the first place.

## EditorRowList and its slots

`EditorRowList` is the editor's card row as a widget: chrome, hover lift, the staggered slide-in, the marquee for text too long to fit, the badge stack and hit testing. It does **not** own scrolling — the host screens keep their own scrollbar and smooth-scroll animation. Keep one instance per tab.

Inside the builder handed to `render`, a row declares what goes in it, never how it is drawn:

| Slot | Signature | What it is |
| :--- | :--- | :--- |
| `leading` | `Row leading(int width, RowPainter painter)` | Reserves `width` pixels at the row's left edge and lets you paint them yourself — a colour block, a swatch, anything. The only free-form slot. |
| `text` | `Row text(String text)` | The row's main label. Marquees on hover when it does not fit, and is ellipsised otherwise. |
| `subtitle` | `Row subtitle(String text)` / `Row subtitle(String text, int colour)` | A second, dimmer line under the label. Drawn only when the list was built with room for it — at the default row height it is ignored, so setting one on a normal list changes nothing rather than producing a clipped half-line. Cut rather than marqueed: two lines chasing each other under one cursor is noise. |
| `badge` | `Row badge(String text)` / `Row badge(String text, int colour)` | Short right-aligned text such as `[NBT]`. Several stack right to left in declaration order. Defaults to the editor's gold. |
| `button` | `Row button(String label, Runnable onClick)` / `Row button(String label, @Nullable String tooltip, Runnable onClick)` | A badge with a hit zone and a handler. |
| `dropdown` | `Row dropdown(String label, @Nullable String tooltip, boolean expanded, SlotClick onClick)` | A button wearing the caret every other menu in the editor wears. The handler is told the slot's rectangle so a popup can hang off it. Use it only when a menu really opens — a caret over something that merely cycles teaches people not to trust the first click. |
| `toggle` | `Row toggle(boolean value, @Nullable String tooltip, ToggleClick onPick)` | The editor's on/off switch as a slot, for a row whose whole content is one yes-or-no. Picked, not flipped: clicking the side already showing is a no-op, so a double click does not undo itself. Never draw a button labelled "on"/"off" instead — that is a third way of drawing the same question. |

The set was read off the built-in tabs rather than invented, and a row needing something outside it paints it through `leading`.

For a two-line row, build the list with a height that leaves room — `new EditorRowList(32)` — and override `contentHeight(int)` to return `rows.heightForRows(count)`. The default on `EditorTab` measures at the standard height, and a host scrolling by that measurement cuts the last rows off.

**The button in the demo tab is real editing, not decoration.** `moveUp` mutates the live `entries()` list and calls `markChanged()`; a category's entry order is part of what `store` writes back through `LockCategory.write`. Pressing that button changes the stage file. `Row.isHovered()` is set before your builder runs, so a builder can also decide to show something only while the cursor is on that row.

Two more pieces of the widget matter to a tab that uses it. `rows.rowAt(ctx, count)` is pure arithmetic and safe before the first frame has been drawn. `rows.mouseClicked(ctx)` fires whichever button zone the cursor is over, reading the rectangles the last `render` recorded — sound, because a click always follows a frame drawn with the same layout — and returns true when it hit one, so the caller stops there.

## Pickers

`GenericIdPicker` (`net.bananemdnsa.historystages.api.editor.GenericIdPicker`) is the ready-made one: a searchable list over whatever ids the addon says are available.

```java
GenericIdPicker picker = new GenericIdPicker(
        "editor.mymod.search.trades",   // lang key for the search hint, not a string
        MyTrades::allKnownTradeIds,     // asked each time the picker opens
        onSelect,
        alreadyAdded);
picker.setMultiSelect(true);
```

The candidates supplier is queried on every open rather than cached, so a list that depends on world state stays current. The search hint is a lang key so an addon's picker is translatable like the rest of the editor.

`setMultiSelect(true)` is what the demo uses, and what every free-tier category editor turns on — a maintainer filling a category picks several ids in a row without the panel closing between them. There is one case where it must stay off: `RequirementEditor.ofIdCount` leaves it false, because with an amount every pick opens the amount dialog, and a second pick made behind an open dialog is lost.

`PickerOverlay` (`net.bananemdnsa.historystages.api.editor.widget.PickerOverlay`) is the interface underneath, for building your own. It names what a host screen needs from any overlay — `show`, `hide`, `isVisible`, `setFilter`, `render`, and the input methods `mouseClicked`, `mouseDragged`, `mouseReleased`, `mouseScrolled`, `keyPressed`, `charTyped`. `AbstractSearchableList<T>` implements it, so a tier-2 subclass gets the whole set for free, and `EditorTab.activeOverlay()` returns this type rather than a concrete picker — which is what lets a tab put up a dropdown of its own beside the Add picker and have the host render and feed both.

:::note
**Note:** What a tab hands its picker back through is `PickerFactory` — `PickerOverlay create(Consumer<String> onSelect, Supplier<Collection<String>> alreadyAdded)`. Configuration belongs in the factory rather than in the tab, because it differs per category. Passing `alreadyAdded` is what makes the picker's **Hide already added** filter option exist at all: `AbstractSearchableList` registers that option only when the supplier is non-null, and consults the supplier when a maintainer switches it on. It hides those entries rather than greying them out, and it is off unless toggled.
:::

## Right-click actions on entries

`EntryAction` adds rows to the context menu a maintainer gets on a tab row. Declare them from `entryActions()` on `CategoryEditor` or `RequirementEditor`; they are **appended** after the built-in entries, so copy and remove stay where a maintainer expects them and an addon adds to the menu instead of replacing it.

```java
@Override
public List<EntryAction> entryActions() {
    return List.of(EntryAction.of("editor.mymod.context.cycle_rarity",
            ctx -> tab.cycleRarity(ctx.index())));
}
```

An action takes the **row index**, not the entry. The tab already owns its rows, so threading a typed entry through every declaration would buy nothing — the addon closes over its own tab and looks the entry up itself.

`EntryActionContext` is what the action is handed when it runs, and it covers the three shapes an action can take:

| Member | What it does |
| :--- | :--- |
| `index()` | The row that was right-clicked. |
| `markChanged()` | Say the data changed, so the editor marks the stage dirty. |
| `openScreen(Screen)` | Ask the host to push a screen. |
| `openOverlay(PickerOverlay)` | Ask the host to show an overlay and feed it input until it hides itself. |
| `EntryActionContext.dataOnly(int, Runnable)` | Builds a context with both sinks inert — so a unit test can construct one at all. |

:::warning
**Note:** Call the methods, never the record accessors. `ctx.dirtySink()` hands back the `Runnable` and does nothing; it compiles, throws nothing, and the change is silently never registered. The same mistake on a tooltip sink once disabled the editor's whole add menu. It applies to `TabRenderContext.tooltip(...)` as well.
:::

Four built-in popups can be offered from an addon's menu rather than rebuilt:

| Factory | Opens |
| :--- | :--- |
| `EntryAction.editNbt(IntFunction<String> itemId, IntFunction<JsonObject> current, BiConsumer<Integer, JsonObject> apply)` | The mod's NBT editor, as a screen. |
| `EntryAction.dimensionFilter(IntFunction<String> entryId, IntFunction<List<String>> current, BiConsumer<Integer, List<String>> apply)` | The dimension allow-list popup. |
| `EntryAction.spawnSources(IntFunction<String> entryId, IntFunction<List<String>> current, BiConsumer<Integer, List<String>> apply)` | The spawn-source block-list popup. |
| `EntryAction.interactionActions(IntFunction<String> entryId, IntFunction<List<String>> current, BiConsumer<Integer, List<String>> apply)` | The interaction-action block-list popup. |

**All four live in `EntryAction.java`**, alongside the generic `EntryAction.of(...)`. `EntryActionScreens.java` is a separate, package-private class holding one method — `nbtEditor(...)`, which `editNbt` delegates to — and the split is deliberate rather than tidiness.

The reason is worth knowing before you write a public class of your own that touches a screen: **a public class whose constructor names a Minecraft type is a class no unit test can build.** `new NbtItemEditScreen(...)` passed to a `Screen` parameter is an assignment between two Minecraft types, and the bytecode verifier loads *both* the instant it touches the enclosing class. While that expression sat inside `EntryAction`, every unit test that so much as named `EntryAction` died with a `NoClassDefFoundError` — from tests mentioning no screen at all. Behind a call into another class, the verifier's check happens over there instead, in a class nothing tests. `EntryActionContext.dataOnly` exists for the same reason from the other side: its two sinks are typed on Minecraft classes, which test source cannot name.

## One tab, several sections

Some categories are one decision. A packmaker gating a merchant answers three questions in one sitting — which offers, which professions, which levels — and three entries in a strip that already holds a dozen would bury the other nine. `CompositeCategoryTab` is one tab holding several category tabs, with a bar of sections above the list to change between them.

```java
new CompositeCategoryTab(
        "mymod:relics",                          // the tab's own id
        "editor.mymod.tab.relics",               // its label on the strip
        "editor.mymod.tooltip.relics",           // its tooltip
        List.of(new CompositeCategoryTab.Section(commonTab, "editor.mymod.relics.section.common"),
                new CompositeCategoryTab.Section(rareTab,   "editor.mymod.relics.section.rare")),
        scope)                                   // the scope createTab handed you
```

Return one from `createTab` and the host does the rest: it recognises the type, reserves the strip above the list and draws the bar. The bar is the host's, not the tab's — it is fixed above the scrolling area rather than sitting at the top of it, because a switcher that scrolls out of sight once a section fills the screen is a switcher nobody can find their way back to.

**`load` and `store` reach every section, not just the visible one.** That is the whole reason this type exists rather than a tab that swaps its rows: the sections are a way of looking at the stage, and all of them are live. Storing only what was on screen would drop what a maintainer entered before switching sections, and they would find out when the stage came back without it.

**Sections the current stage cannot use are greyed rather than hidden.** A section is disabled when the stage being edited is individual and the section's category does not serve that scope — which the tab reads from the section itself, so a category that changes its mind about scopes cannot leave a stale copy behind. A disabled section cannot be selected, the tab never opens on one, and the whole tab is only withheld from individual stages when *none* of its sections fits. That last rule is why the built-in entity tab still works per player: spawn locks are global-only, attack and interaction locks are not.

Everything else about the tab answers for the section on screen — its entries, its rows, its picker, its right-click menu — because a row index means nothing else. The one exception is the number the strip shows in brackets after the tab's name, which sums every section: a tab holding twenty offers must not claim `(0)` because someone left it on another section.

## Widgets

Everything under `net.bananemdnsa.historystages.api.editor.widget`. Twenty-one types, and the built-in screens are made of these same twenty-one.

| Type | What it is |
| :--- | :--- |
| `AbstractModalScreen` | Shared chrome for every modal dialog: backdrop, gold-accented frame, title, optional subtitle, confirm/cancel row. Subclasses declare `contentHeight()` and draw into what they are handed, so no dialog hardcodes a box size. |
| `AbstractInputScreen` | A modal built from a declarative list of `InputField` specs — builds the boxes, lays them out, validates live, and shows the first error above the button row. Errors stay hidden until the user has typed or pressed confirm once. |
| `AbstractSearchableList<T>` | The scaffold behind every picker overlay: search bar, filter dropdown, panel frame, scrollbar maths, input handling, show and hide. Implements `PickerOverlay`. |
| `PickerOverlay` | The interface a host screen needs from any overlay — show it, draw it, hand it input, ask whether it is still up. What `EditorTab.activeOverlay()` returns. |
| `EditorRowList` | The editor's card row: chrome, hover, slide-in, marquee, badge stack, hit testing. Seven slots per row. |
| `InputField` | The declarative spec for one field on an `AbstractInputScreen`. `number` and `decimal` derive their typing filter, max length and range validator from the range itself. |
| `InputValues` | The trimmed field values handed to `onConfirm`, produced only after validation passed — so the numeric getters cannot see malformed input. |
| `CountInputScreen` | The ready-made "ask for one count or threshold" dialog, showing the subject id as its subtitle. |
| `ChoiceOverlay` | A modal list of named choices: a title, one row per option, a click runs that option's action. For the question a searchable list is too heavy for and a number field cannot express — "which of these four". Rows carrying `Option.more` draw a chevron, marking a choice that opens another step. Arrow keys move the selection, Enter takes it, ESC closes. Implements `PickerOverlay`, so anything that can show a searchable list can show this. |
| `ChoiceScreen` | That same list as a screen of its own, for `TriggerEditor.authoringScreen` and anywhere else a `Screen` is what gets returned. Picking a row or pressing ESC returns to the parent; a row that opens a screen of its own is free to do so. |
| `FormattedTextScreen` | The dialog for text carrying format codes and placeholders: wrapping field, live preview underneath, codes and placeholders as buttons. Codes are written `&`, not `§`. |
| `NumberStepper` | A bounded integer as minus, readout, plus. Clamps internally, greys a button out at its end of the range, and the readout doubles as a small digits-only field for wide ranges. |
| `Badge` | **6.1.** The editor's badge: a short label in a 1px frame over a dark fill, all three shades of the one text colour you pass. Every badge in the editor is this one — row badges, overview markers, graph pills. Square brackets around the label are dropped, since the frame does their job. |
| `Checkbox` | **6.1.** The editor's tick box: grey frame off, gold frame and tick on, and a bar for "some of what is below". The filter menu and the "Applies to" and "Recipes using this item" panels use it. One `Checkbox.State` per box, `update()` once a frame, then `draw()`. |
| `SearchBar` | The search field plus funnel-icon filter button, owning its text, focus and clipboard handling and an embedded `FilterDropdown`. |
| `FilterDropdown` | The funnel button and its checkbox popup. Options sharing a non-null `groupId` are mutually exclusive; a null `groupId` makes an independent checkbox. |
| `ToggleControl` | The editor's on/off switch: both halves side by side, the active one filled, and the fill travels when the value changes. A click sets the half it landed on rather than flipping, so clicking what is already set does nothing. Keep one `ToggleControl.State` per switch and call `update()` once a frame before `draw()`. |
| `ToggleGeometry` | Where that switch's two halves begin and end. Names no Minecraft type, so a tab can lay a switch out — or work out which half a click meant — without drawing anything. |
| `SegmentBar` | The same switch with more than two segments: the selected one filled, the fill travelling when it changes, a click selecting the segment it landed on rather than advancing. For a control you draw inside your own `renderContent` — the bar above a `CompositeCategoryTab` is drawn by the host and needs nothing from you. Keep one `SegmentBar.State` per bar and call `update()` once a frame before `draw()`; pass one `disabled` flag per label, and hand `update()` a hovered index of `-1` for a segment nobody can choose. |
| `TradeRowGeometry` | Where the parts of a trade row sit, in the merchant window's reading order: what it costs, an arrow, what you get. The painted zone is one fixed width for every row and the second price keeps its place even when an offer has only one, so the names all start at the same x and the list can be read down a column. Names no Minecraft type. |
| `SegmentBarGeometry` | The arithmetic under both, for any number of labels: segment width sized from the widest so nothing moves when the selection does, where segment *n* starts, and which one a click landed in. `ToggleGeometry` is the two-segment front door onto it and is unchanged — a value that is on or off is a different gesture from choosing which section you are looking at, and only the naming differs. |

## Added in 6.1

**6.1**, NeoForge only until the ports are out. All additive; nothing an addon built against 6.0
calls has changed.

- **`EditorRowList.Row`** gets `badge(text, colour, minWidth)` and a tooltip on badges,
  `button(label, tooltip, minWidth, onClick)` with a minimum width so rows line up in columns, and
  `segments(labels, selected, tooltip, onPick)` for a small segmented switch inside a row.
- **`EditorTab.badgeTooltip(int index)`** lets an addon tab put a tooltip on its row badges.
- **`AbstractSearchableList`** gets `footerButtons()`, a list of `FooterButton(label, onClick)`
  drawn along the bottom of the picker; `onRowClicked(entry, index, mouseX, rowX)` to take a click
  on a row yourself (return `true` to swallow it); and `reloadEntriesKeepingScroll()` to refilter
  without jumping back to the top.
- **`AbstractCategoryTab.addIfAbsent(String id)`** adds an entry unless it is already there, and
  marks the stage changed.
