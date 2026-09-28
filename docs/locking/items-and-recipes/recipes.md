---
title: Recipes
description: "Gating named recipe ids, what happens in JEI and EMI, and why an individual stage cannot reach a furnace."
sidebar_position: 4
---

# Recipes

There are two ways a recipe ends up gated, and they are worth keeping apart:

1. **The item is locked.** Every recipe producing it disappears, because the `recipe` action is one
   of the actions an item entry locks by default. This is the common case, and you get it for free.
2. **The recipe is named.** `recipes` lists individual recipe ids. Use it when only *one* of several
   ways to make something should be gated, or when the output itself should stay available.

```json
{
  "items": ["minecraft:iron_ingot"],
  "recipes": ["minecraft:iron_pickaxe", "minecraft:iron_sword"]
}
```

## In the editor

The **Recipes** tab. Its picker is two columns: everything recipes produce on the left, that item's
actual recipes as cards on the right, drawn in the recipe's real shape — which is the only way to
tell apart two recipes that use the same ingredients differently.

Left-clicking a card in the list of a stage opens it read-only, so you can check what a recipe id
actually makes without leaving the tab.

In the picker, selection survives moving between items, so several recipes across several items can
be gathered before pressing **Add**. On an individual stage the picker offers only the recipe types that can be
gated per player, and says so under the grid. →
[The Recipe Picker](/wiki/in-game-tools/in-game-editor#the-recipe-picker)

## What it actually does depends on the scope

This is the single biggest source of confusion in the mod, so it is worth stating plainly:

| | Global stage | Individual stage |
| :--- | :--- | :--- |
| The recipe itself | filtered out of the recipe manager — **nobody** can craft it | stays in the registry; everyone can still craft it |
| Where the gate bites | everywhere: furnace, autocrafter, hopper, mod machines, all of it | only at stations that know who is standing at them |
| Two players at one table | same result — neither can craft it | different results — one crafts, the other cannot |

The four vanilla stations an individual stage reaches are the **crafting table**, the **2×2 grid in
the player's inventory**, the **stonecutter** and the **smithing table**. Furnaces, brewing stands,
the crafter block, hoppers and mod autocrafters resolve recipes with nobody there and stay
global-only.

:::warning
A recipe locked by an individual stage can still be produced in an autocrafter. That is fine for
progression design and is **not** cheat protection. If something must be genuinely unobtainable, put
it in a global stage.
:::

Another mod can add its own station to that list by declaring one of its recipe types
per-player-gateable; the editor then offers it like the built-in ones. →
[Addon Development](/api/addon-development) ·
[Global vs Individual](/wiki/start-here/global-vs-individual#per-player-recipe-locks-and-where-they-stop)

Anvil, loom and cartography table are on neither list — they are not recipe-driven at all, so there
is no recipe id to write down.

The master switch for per-player recipe gating is `lockRecipes` in
[gameplay.toml](/wiki/server/config-files/gameplay-toml#individual_stages), on by default.

## What players see

**In JEI and EMI**, a locked recipe gets a padlock overlay rather than vanishing — the point being
that players can see progression exists. Two settings change that:

| Setting | Default | Effect |
| :--- | :--- | :--- |
| `hideLockedItemsInJei` | `false` | Removes locked items from the ingredient panel entirely, in JEI and EMI. |
| `hideLockedRecipesInJei` | `false` | Hides locked recipes. JEI catches vanilla recipe types by their output; EMI hides every recipe that would carry the padlock, including ones locked by id or by a gated fluid. |
| `lockedItemMultiStagePolicy` | `STRICT` | For items in several stages: `STRICT` keeps them locked while any assigned stage is; `LENIENT` frees them as soon as any one is. |

The names still say JEI because they predate EMI support, and renaming them would break existing
configs. Hiding in EMI needs 6.0.2 or later on NeoForge or Forge; on Fabric the two settings
reach JEI only. → [Mod Compatibility](/wiki/server/mod-compatibility#recipe-viewers--jei-and-emi)

→ [visual.toml](/wiki/server/config-files/visual-toml#jei_hiding)

**In the vanilla recipe book**, locked recipes are hidden by default (`hideLockedRecipesInBook`).
Before 6.0.0 they stayed visible and simply refused to craft; turning the setting off restores that
behaviour. The book belongs to one player and is filtered per player, so an individual stage reaches
it. → [visual.toml](/wiki/server/config-files/visual-toml#recipe_book)

The message a player gets when clicking a locked recipe in the book is `recipeLocked` under
[`[lock_messages]`](/wiki/server/config-files/visual-toml#lock_messages).

## Finding recipe ids

The [in-game editor](/wiki/in-game-tools/in-game-editor)'s recipe picker is the reliable route: it
lists real, loaded recipes, shows the inputs and output of each, and cannot produce an id that does
not exist. On an individual stage it offers only the recipe types that can be gated per player, and
says so under the grid.

Writing ids by hand works too — they are the ids datapacks and mods register, such as
`minecraft:iron_pickaxe`.

## Script-generated recipes move

:::danger[KubeJS numbers recipes by the order it sees them]
`kubejs:crafting_shaped_7` is the seventh shaped recipe in your scripts. Reorder a script and the
numbering shifts, which silently breaks every stage that gated the old id.
:::

Since 6.0.0 History Stages checks for this. After every world load and every `/reload` it compares
the recipe ids in your stages against the recipes that actually loaded, and writes a warning for
each one that is missing. Those entries show in **red** on the stage's Recipes tab in the editor.

Nothing is removed — a recipe can be legitimately absent for a while — but you find out the same
day rather than when a player asks why they can craft something they should not.

The way to avoid it entirely is to give your recipes explicit ids:

```javascript
ServerEvents.recipes(event => {
    event.shaped('4x minecraft:stick', ['A', 'A'], { A: 'minecraft:oak_planks' })
        .id('mypack:sticks')
})
```

Then the id is yours, it never moves, and picking it in the editor sticks. →
[Scripting](/wiki/server/scripting)

## Gating a recipe without gating its output

Leave `recipe` out of the item's lock. `unlock_actions` lists what stays free, so:

```json
"items": [
  { "id": "minecraft:iron_ingot", "unlock_actions": ["recipe"] }
]
```

keeps the ingot craftable while everything else about it stays gated. The reverse — gating only the
recipe and nothing else — is what the `recipes` field is for. →
[Unlock Actions](/wiki/locking/items-and-recipes/unlock-actions)

## Fluids gate recipes too, and further than you expect

A [fluid](/wiki/locking/items-and-recipes/fluids) entry has two recipe actions, not one: `recipe`
for the recipes that *produce* it, `ingredient` for the ones that *consume* it. Both are on unless
narrowed away, so gating `minecraft:water` unnarrowed removes every recipe that touches water — a
four-digit number in a large pack.

That is also the answer when recipes disappear that nobody listed.

## See also

- [Items, Tags & Mods](/wiki/locking/items-and-recipes/items-tags-mods)
- [Obtaining Scrolls & Pedestals](/wiki/in-game-tools/research/obtaining) — writing recipes *for*
  History Stages' own items, which is a different job entirely.
- [Mod Compatibility](/wiki/server/mod-compatibility) — JEI, EMI and the recipe viewers.
