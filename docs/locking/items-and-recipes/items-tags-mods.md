---
title: Items, Tags & Mods
description: "Gating single items, whole item tags, every item from a mod, and carving exceptions back out of a mod lock."
sidebar_position: 1
---

# Items, Tags & Mods

<Scope global="yes" individual="yes" />

Four fields lock items, from one id to an entire mod. Once an item matches, all four behave the
same; they only differ in how wide the net is.

| Field | Locks | Good for |
| :--- | :--- | :--- |
| [`items`](#items) | One item id | A specific tool, block or ingredient |
| [`tags`](#tags) | Every item in an item tag, including ones added later | All iron ores, all ingots |
| [`mods`](#mods) | Everything a mod registers | Gating a whole tech mod |
| [`mod_exceptions`](#mod-exceptions) | Items taken back out of a `mods` lock | Letting one starter item through |

## Setting it up {/* #in-the-editor */}

<Tabs groupId="setup">
<TabItem value="editor" label="In the editor">

<Gallery items={[
  {src: "/img/editor/items-tab.webp", alt: "The Items tab, with action and NBT badges on narrowed entries", wide: true},
  {src: "/img/editor/tags-tab.webp", alt: "The Tags tab", wide: true},
  {src: "/img/editor/tag-picker.webp", alt: "The tag picker"},
  {src: "/img/editor/mod-picker.webp", alt: "The mod picker"},
  {src: "/img/editor/exceptions-tab.webp", alt: "The Exceptions tab, empty until a mod lock needs one", wide: true},
]} />

1. Open a stage and pick the **Items**, **Tags**, **Mods** or **Exceptions** tab.
2. Press **+ Add**. The picker searches the live registry; the **Inventory** tab picks straight out
   of your own inventory, and **Selected** collects several at once.
3. Press **Save**.

Everything you do to an entry that is already in the list is a **right-click**:

| Menu entry | What it does |
| :--- | :--- |
| **Edit NBT** | [NBT and data component criteria](/wiki/locking/items-and-recipes/nbt-and-components). |
| **Lock Actions** | [Narrow the entry to specific interactions](/wiki/locking/items-and-recipes/unlock-actions). |
| **Text Override** | This entry's own [hidden-display texts](/wiki/stage-file/hidden-display#overriding-it-for-a-single-entry). |
| **Copy ID** | The registry id, onto the clipboard. |
| **Remove** | Takes it out of the stage. |

Which of them appear depends on the tab (a mod entry has no NBT to edit), and an installed addon
can add its own further down, above Copy ID and Remove.

</TabItem>
<TabItem value="file" label="In the stage file">

All four are lists on the stage:

```json title="config/historystages/global/iron_age.json"
{
  "items": ["minecraft:iron_ingot"],
  "tags": ["c:ores/iron"],
  "mods": ["create"],
  "mod_exceptions": ["create:andesite_alloy"]
}
```

An entry is either a plain id or an object that adds more to it; the sections below show both. After
editing a file by hand, run `/history reload`.

</TabItem>
</Tabs>

## What "locked" means

<Gallery items={[
  {src: "/img/ingame/tooltip-item.webp", alt: "The tooltip of a locked item names the stage it needs"},
  {src: "/img/ingame/tooltip-tag.webp", alt: "An iron ingot, locked through the c:ingots/iron tag", wide: true},
  {src: "/img/ingame/hotbar-locks.webp", alt: "Locked items carry a padlock in the hotbar, and the last three slots are locked away", wide: true},
]} />

By default a matched item is locked for **everything**: using it, attacking with it, wearing it,
picking it up, placing it, breaking blocks with it, opening its GUI, appearing in loot, showing its
recipes, and trading it. To lock only some of that, use
[`unlock_actions`](/wiki/locking/items-and-recipes/unlock-actions).

A locked **block** is already in the world, so it goes a little further:

| A locked block… | Switch in [gameplay.toml](/wiki/server/config-files/gameplay-toml#gameplay) |
| :--- | :--- |
| breaks 20× slower and drops nothing | `lockBlockBreaking`, `lockedBlockBreakSpeedMultiplier` |
| does not open its GUI (a chest, a furnace, a machine) | `lockBlockInteraction` |
| on an armour stand or in an item frame, cannot be taken or broken | `lockEntityItems` |

Each of those has a per-player twin under `[individual_stages]`.

## Items

Item ids, either plain or as objects:

```json
"items": [
  "minecraft:diamond_pickaxe",
  {
    "id": "minecraft:diamond_sword",
    "unlock_actions": ["pickup", "equip"]
  }
]
```

The object form takes:

| Key | For |
| :--- | :--- |
| `nbt` / `components` | [Only the stacks that match a criterion](/wiki/locking/items-and-recipes/nbt-and-components) |
| `unlock_actions` | [Only some interactions](/wiki/locking/items-and-recipes/unlock-actions) |
| `name_text` / `tooltip_text` | This entry's own [hidden display](/wiki/stage-file/hidden-display) |

## Tags

Item tags lock every member at once. Entries take the same object form as items:

```json
"tags": [
  "c:ores/iron",
  {
    "id": "c:ingots/iron",
    "unlock_actions": ["pickup"]
  }
]
```

A tag is resolved live, so items another mod adds to `c:ores/iron` later are locked too, without
the stage file changing. That is usually the point, and occasionally the surprise, when a newly
installed mod quietly widens a lock nobody edited.

<details>
<summary>Tag entries with an NBT criterion</summary>

They are skipped wherever no actual item stack exists to match against, a loot-table check without
context for instance. Plain tag entries are unaffected. →
[NBT & Data Components](/wiki/locking/items-and-recipes/nbt-and-components)

</details>

## Mods

A mod id locks **every item that mod registers**:

```json
"mods": ["mekanism"]
```

This is the widest net there is, and it is resolved from the registry rather than from a list, so it
also covers items added by a later update of that mod.

It also covers **enchanted books and potions whose enchantment or effect comes from that
mod**.<Since v="6.1.0" /> While the entry locks the `recipe` action, the enchanting table, the anvil
and the brewing stand refuse that mod's enchantments and effects.

<details>
<summary>Gear with a modded enchantment</summary>

Gear is still judged by its own id: a vanilla sword with a modded enchantment is not caught by the
mod lock. Lock the enchantment itself for that. →
[Enchantments & Effects](/wiki/locking/items-and-recipes/enchantments-and-effects)

</details>

## Mod exceptions

`mod_exceptions` takes items back out of a `mods` lock: the usual shape of "lock the whole tech
mod, but leave the starter component craftable so players can get in at all".

```json
{
  "mods": ["create"],
  "mod_exceptions": [
    "create:andesite_alloy",
    { "id": "create:wrench", "nbt": { "components": { "minecraft:damage": 0 } } }
  ]
}
```

Exceptions accept the same NBT criteria as items. They only undo a `mods` lock: an item listed
explicitly in `items` stays locked no matter what `mod_exceptions` says.

<details>
<summary>Exceptions and dual-phase locks</summary>

An exception is the one category that never takes part in a
[dual-phase lock](/wiki/start-here/global-vs-individual#dual-phase-when-both-lists-target-the-same-content),
because it carves holes rather than locking.

</details>

## Enchantments

Enchantments have their own field, which also covers gear and the stations.<Since v="6.1.0" /> →
[Enchantments & Effects](/wiki/locking/items-and-recipes/enchantments-and-effects)

<details>
<summary>The older way: an enchanted book in <code>items</code></summary>

It still works and keeps doing what it did: an `items` entry for `minecraft:enchanted_book` whose
NBT carries `StoredEnchantments`. The mod reads that same entry when deciding whether an anvil or an
enchanting table may apply the enchantment at all:

```json
"items": [
  {
    "id": "minecraft:enchanted_book",
    "nbt": {
      "StoredEnchantments": [
        { "id": "minecraft:mending" },
        { "id": "minecraft:sharpness", "lvl": "4-5" },
        { "id": "minecraft:fortune", "lvl": 3 }
      ]
    }
  }
]
```

`lvl` decides how much of the enchantment is caught:

| `lvl` | Locked |
| :--- | :--- |
| left out | every level |
| a number, `3` | that exact level |
| a range string, `"4-5"` | that range, inclusive |

So the entry above locks Mending entirely, Sharpness only at IV and V, and Fortune only at III.
Sharpness III stays applicable.

Two details this depends on: the item id has to be exactly `minecraft:enchanted_book`, and the
criterion has to sit under the legacy `StoredEnchantments` key rather than under `components`. The
switch for whether anvils and enchanting tables honour it is `lockEnchanting` in
[gameplay.toml](/wiki/server/config-files/gameplay-toml#gameplay), with a per-player twin under
`[individual_stages]`.

</details>

## Global or individual?

Both. All four fields work in either scope, but what they *do* differs sharply:

| | Global stage | Individual stage |
| :--- | :--- | :--- |
| The recipe | is removed from the game | stays; other players can still craft it |
| The item | is locked for everyone | cannot reach that player's inventory |

That difference catches almost everybody once. →
[Global vs Individual](/wiki/start-here/global-vs-individual#global-and-individual-lock-at-different-layers)

## See also

- [Unlock Actions](/wiki/locking/items-and-recipes/unlock-actions): lock one interaction instead of
  all of them.
- [NBT & Data Components](/wiki/locking/items-and-recipes/nbt-and-components): lock only the items
  that match a criterion.
- [Recipes](/wiki/locking/items-and-recipes/recipes): lock the recipe rather than the item.
- [Fluids](/wiki/locking/items-and-recipes/fluids): one entry for every bucket and tank that holds a
  fluid.
- [Hidden Display](/wiki/stage-file/hidden-display): what locked players see instead.
