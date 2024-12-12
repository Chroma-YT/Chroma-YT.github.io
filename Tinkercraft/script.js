// Define the selected packs
let selected = [];

// Define the version
let version = "21";

// Define the incompatible packs
let incompatiblePacks = [
    ["transparent_ui", "dark_ui", "immersive_ui"]
];

const resourcepacks = ['modern_creepers', 'fresh_crops', 'immersive_ui', 'dark_ui', 'transparent_ui'];
const datapacks = ['grand_world'];


function selectButton(button) {
    const buttons = document.querySelectorAll('.header-button');
    buttons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
}

document.addEventListener("DOMContentLoaded", () => {
    const collapsibles = document.querySelectorAll(".collapsible");

    collapsibles.forEach(collapsible => {
        collapsible.addEventListener("click", () => {
            collapsible.classList.toggle("active");
            const content = collapsible.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    });

    const squares = document.querySelectorAll(".square");
    const sidebarText = document.getElementById("sidebar").querySelector("p");

    squares.forEach(square => {
        if (!square.querySelector('.square-img')) {
            const img = document.createElement("img");
            img.src = square.getAttribute("name") + ".svg";
            img.classList.add("square-img");
            square.appendChild(img);
        }

        let hoverTimer;

        square.addEventListener("mouseenter", () => {
            hoverTimer = setTimeout(() => {
                const content = square.getAttribute('data-sidebar-content');
                sidebarText.innerHTML = content;
                // Reinitialize the range input to ensure it works
                const rangeInput = sidebarText.querySelector('.c-compare input[type="range"]');
                if (rangeInput) {
                    rangeInput.addEventListener('input', function() {
                        this.parentNode.style.setProperty('--value', `${this.value}%`);
                    });
                }
            }, 200);
        });

        square.addEventListener("mouseleave", () => {
            clearTimeout(hoverTimer);
        });

        square.addEventListener("click", () => {
            square.classList.toggle("clicked");

            const toAppend = square.getAttribute("name");
            if (selected.includes(toAppend)) {
                selected = selected.filter(item => item !== toAppend);
            } else {
                selected.push(toAppend);
            }
        });
    });
});

// Get all buttons with class header-button
const buttons = document.querySelectorAll('.header-button');

// Loop through each button
buttons.forEach((button) => {
  // Add an event listener to each button
    button.addEventListener('click', () => {
    // Remove the selected class from all buttons
    buttons.forEach((b) => b.classList.remove('selected'));
    button.classList.add('selected');
    version = button.getAttribute('data-selected-version'); // Save the selected version in the variable
    console.log(version);
    });
});






//Build and Download the file
async function buildAndDownload() {
    if (selected.length === 0) {
        console.log("No packs selected. Please select at least one pack.");
        return;
    } else {
        console.log("Checking Compatibility...");

        let incompatiblePacksFound = false;
        // Check if selected array contains any of the incompatible pairs
        for (let i = 0; i < incompatiblePacks.length; i++) {
            const incompatiblePack = incompatiblePacks[i];
            const sharedPacks = selected.filter(pack => incompatiblePack.includes(pack));
            if (sharedPacks.length >= 2) {
                console.log(`Incompatible packs detected: ${sharedPacks.join(', ')}.`);
                incompatiblePacksFound = true;
            }
        }

        if (!incompatiblePacksFound) {
            console.log("No incompatible packs found. Proceeding to file creation...");
            console.log(`Version: ${version}`);
            console.log(`Packs selected: ${selected.join(', ')}`);

            const hasResourcepack = resourcepacks.some(value => selected.includes(value));
            const hasDatapack = datapacks.some(value => selected.includes(value));
            
            if (hasResourcepack) {
                console.log("Resourcepack detected");
            }
            if (hasDatapack) {
                console.log("Datapack detected");
            }

            // Create the zip file
            const zip = new JSZip();
            if (hasResourcepack) {
                if (version === "20") {
                    zip.folder("resourcepack").file("pack.mcmeta", await fetch("pack_assets/core/20/resource/pack.mcmeta").then(response => response.arrayBuffer()));
                    console.log("Resourcepack root created for version 20");
                } else if (version === "21") {
                    zip.folder("resourcepack").file("pack.mcmeta", await fetch("pack_assets/core/21/resource/pack.mcmeta").then(response => response.arrayBuffer()));
                    console.log("Resourcepack root created for version 21");
                }
            }
            if (hasDatapack) {
                if (version === "20") {
                    zip.folder("datapack").file("pack.mcmeta", await fetch("pack_assets/core/20/datapack/pack.mcmeta").then(response => response.arrayBuffer()));
                    console.log("Datapack root created for version 20");
                } else if (version === "21") {
                    zip.folder("datapack").file("pack.mcmeta", await fetch("pack_assets/core/21/datapack/pack.mcmeta").then(response => response.arrayBuffer()));
                    console.log("Datapack root created for version 21");
                }
            }

            //Load Packs
            if (selected.includes("modern_creepers") && (version === "21" || version === "20")) {
                zip.folder("resourcepack/assets/minecraft/textures/entity/creeper").file("creeper.png", await fetch("pack_assets/modern_creepers/creeper.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/entity/creeper").file("creeper_armor.png", await fetch("pack_assets/modern_creepers/creeper_armor.png").then(response => response.arrayBuffer()));
                console.log("Modern Creepers loaded file path at resourcepack/assets/minecraft/textures/entity/creeper");
                console.log("Modern Creepers Loaded");
            }
            if (selected.includes("fresh_crops") && (version === "21" || version === "20")) {
                let files = [
                "beetroots.json",
                "carrots.json",
                "melon_stem.json",
                "potatoes.json",
                "pumpkin_stem.json",
                "wheat.json"
                ];
                
                for (let file of files) {
                    let response = await fetch(`pack_assets/fresh_crops/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/blockstates").file(file, arrayBuffer);
                }
                console.log("Fresh Crops loaded file path at resourcepack/assets/minecraft/blockstates");

                files = [
                    "attached_melon_stem.png",
                    "attached_pumpkin_stem.png",
                    "beetroots_stage0.png",
                    "beetroots_stage1.png",
                    "beetroots_stage2.png",
                    "beetroots_stage3.png",
                    "beetroots_stage3a.png",
                    "beetroots_stage3b.png",
                    "beetroots_stage3c.png",
                    "beetroots_stage3d.png",
                    "carrots_break.png",
                    "carrots_stage0.png",
                    "carrots_stage1.png",
                    "carrots_stage2.png",
                    "carrots_stage3.png",
                    "carrots_stage3a.png",
                    "carrots_stage3b.png",
                    "carrots_stage3c.png",
                    "carrots_stage3d.png",
                    "melon_break.png",
                    "melon_stem_stage0.png",
                    "melon_stem_stage1.png",
                    "melon_stem_stage2.png",
                    "melon_stem_stage3.png",
                    "melon_stem_stage4.png",
                    "melon_stem_stage5.png",
                    "melon_stem_stage6.png",
                    "melon_stem_stage7.png",
                    "potatoes_break.png",
                    "potatoes_stage0.png",
                    "potatoes_stage1.png",
                    "potatoes_stage2.png",
                    "potatoes_stage3.png",
                    "potatoes_stage3a.png",
                    "potatoes_stage3b.png",
                    "potatoes_stage3c.png",
                    "potatoes_stage3d.png",
                    "pumpkin_break.png",
                    "pumpkin_stem_stage0.png",
                    "pumpkin_stem_stage1.png",
                    "pumpkin_stem_stage2.png",
                    "pumpkin_stem_stage3.png",
                    "pumpkin_stem_stage4.png",
                    "pumpkin_stem_stage5.png",
                    "pumpkin_stem_stage6.png",
                    "pumpkin_stem_stage7.png",
                    "wheat_break.png",
                    "wheat_stage1.png",
                    "wheat_stage2.png",
                    "wheat_stage3.png",
                    "wheat_stage4.png",
                    "wheat_stage5.png",
                    "wheat_stage6.png",
                    "wheat_stage7.png",
                    "wheat_stage7a.png",
                    "wheat_stage7b.png",
                    "wheat_stage7c.png",
                    "wheat_stage7d.png"
                    ];
                    
                    for (let file of files) {
                        let response = await fetch(`pack_assets/fresh_crops/${file}`);
                        let arrayBuffer = await response.arrayBuffer();
                        zip.folder("resourcepack/assets/minecraft/textures/block").file(file, arrayBuffer);
                    }
                    console.log("Fresh Crops loaded file path at resourcepack/assets/minecraft/textures/block");

                files = [
                    "attached_melon_stem.json",
                    "attached_pumpkin_stem.json",
                    "beetroots_stage0.json",
                    "beetroots_stage1.json",
                    "beetroots_stage2.json",
                    "beetroots_stage3.json",
                    "beetroots_stage3a.json",
                    "beetroots_stage3b.json",
                    "beetroots_stage3c.json",
                    "beetroots_stage3d.json",
                    "carrots_stage0.json",
                    "carrots_stage1.json",
                    "carrots_stage2.json",
                    "carrots_stage3.json",
                    "carrots_stage3a.json",
                    "carrots_stage3b.json",
                    "carrots_stage3c.json",
                    "carrots_stage3d.json",
                    "melon_stem_growth0.json",
                    "melon_stem_growth1.json",
                    "melon_stem_growth2.json",
                    "melon_stem_growth3.json",
                    "melon_stem_growth4.json",
                    "melon_stem_growth5.json",
                    "melon_stem_growth6.json",
                    "melon_stem_growth7.json",
                    "potatoes_stage0.json",
                    "potatoes_stage1.json",
                    "potatoes_stage2.json",
                    "potatoes_stage3.json",
                    "potatoes_stage3a.json",
                    "potatoes_stage3b.json",
                    "potatoes_stage3c.json",
                    "potatoes_stage3d.json",
                    "pumpkin_stem_growth0.json",
                    "pumpkin_stem_growth1.json",
                    "pumpkin_stem_growth2.json",
                    "pumpkin_stem_growth3.json",
                    "pumpkin_stem_growth4.json",
                    "pumpkin_stem_growth5.json",
                    "pumpkin_stem_growth6.json",
                    "pumpkin_stem_growth7.json",
                    "wheat_stage0.json",
                    "wheat_stage1.json",
                    "wheat_stage2.json",
                    "wheat_stage3.json",
                    "wheat_stage4.json",
                    "wheat_stage5.json",
                    "wheat_stage6.json",
                    "wheat_stage7.json",
                    "wheat_stage7a.json",
                    "wheat_stage7b.json",
                    "wheat_stage7c.json",
                    "wheat_stage7d.json"
                    ];
                    
                    for (let file of files) {
                        let response = await fetch(`pack_assets/fresh_crops/${file}`);
                        let arrayBuffer = await response.arrayBuffer();
                        zip.folder("resourcepack/assets/minecraft/models/block").file(file, arrayBuffer);
                    }
                    console.log("Fresh Crops loaded file path at resourcepack/assets/minecraft/models/block");
                
                console.log("Fresh Crops Loaded");
            }
            if (selected.includes("transparent_ui") && (version === "21" || version === "20")) {

                zip.folder("resourcepack/assets/minecraft/shaders/core").file("rendertype_text.vsh", await fetch("pack_assets/transparent_ui/rendertype_text.vsh").then(response => response.arrayBuffer()));

                let files = [
                    "empty_armor_slot_boots.png",
                    "empty_armor_slot_chestplate.png",
                    "empty_armor_slot_helmet.png",
                    "empty_armor_slot_leggings.png",
                    "empty_armor_slot_shield.png",
                    "empty_slot_amethyst_shard.png",
                    "empty_slot_axe.png",
                    "empty_slot_diamond.png",
                    "empty_slot_emerald.png",
                    "empty_slot_hoe.png",
                    "empty_slot_ingot.png",
                    "empty_slot_lapis_lazuli.png",
                    "empty_slot_pickaxe.png",
                    "empty_slot_quartz.png",
                    "empty_slot_redstone_dust.png",
                    "empty_slot_shovel.png",
                    "empty_slot_smithing_template_armor_trim.png",
                    "empty_slot_smithing_template_netherite_upgrade.png",
                    "empty_slot_sword.png",
                ];
                
                    for (let file of files) {
                        let response = await fetch(`pack_assets/transparent_ui/${file}`);
                        let arrayBuffer = await response.arrayBuffer();
                        zip.folder("resourcepack/assets/minecraft/textures/item").file(file, arrayBuffer);
                    }
                console.log("Transparent UI loaded file path at resourcepack/assets/minecraft/textures/item");
                    
                zip.folder("resourcepack/assets/minecraft/textures/gui").file("recipe_book.png", await fetch("pack_assets/transparent_ui/recipe_book.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui").file("demo_background.png", await fetch("pack_assets/transparent_ui/demo_background.png").then(response => response.arrayBuffer()));

                files = [
                    "button.png",
                    "button_highlighted.png",
                    "filter_disabled.png",
                    "filter_disabled_highlighted.png",
                    "filter_enabled.png",
                    "filter_enabled_highlighted.png",
                    "furnace_filter_disabled.png",
                    "furnace_filter_disabled_highlighted.png",
                    "furnace_filter_enabled.png",
                    "furnace_filter_enabled_highlighted.png",
                    "slot_craftable.png",
                    "slot_many_craftable.png",
                    "slot_many_uncraftable.png",
                    "slot_uncraftable.png",
                    "tab.png",
                    "tab_selected.png"
                ];

                    for (let file of files) {
                        let response = await fetch(`pack_assets/transparent_ui/${file}`);
                        let arrayBuffer = await response.arrayBuffer();
                        zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/recipe_book").file(file, arrayBuffer);
                    }
                console.log("Transparent UI loaded file path at resourcepack/assets/minecraft/textures/gui/sprites/recipe_book");

                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/social_interactions").file("background.png", await fetch("pack_assets/transparent_ui/background.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/social_interactions").file("background.png.mcmeta", await fetch("pack_assets/transparent_ui/background.png.mcmeta").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/statistics").file("header.png", await fetch("pack_assets/transparent_ui/header.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container").file("slot.png", await fetch("pack_assets/transparent_ui/slot.png").then(response => response.arrayBuffer()));

                files = [
                    "banner_slot.png",
                    "dye_slot.png",
                    "pattern.png",
                    "pattern_highlighted.png",
                    "pattern_selected.png",
                    "pattern_slot.png",
                    "scroller.png",
                    "scroller_disabled.png"
                ];

                for (let file of files) {
                    let response = await fetch(`pack_assets/transparent_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/loom").file(file, arrayBuffer);
                }
                console.log("Transparent UI loaded file path at resourcepack/assets/minecraft/textures/gui/sprites/container/loom");

                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/smithing").file("error.png", await fetch("pack_assets/transparent_ui/error.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/smoker").file("burn_progress.png", await fetch("pack_assets/transparent_ui/burn_progress.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/smoker").file("lit_progress.png", await fetch("pack_assets/transparent_ui/lit_progress.png").then(response => response.arrayBuffer()));

                files = [
                    "out_of_stock.png",
                    "scroller.png",
                    "scroller_disabled.png"
                ];

                for (let file of files) {
                    let response = await fetch(`pack_assets/transparent_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/villager").file(file, arrayBuffer);
                }
                console.log("Transparent UI loaded file path at resourcepack/assets/minecraft/textures/gui/sprites/container/villager");

                files = [
                    "scroller.png",
                    "scroller_disabled.png",
                    "tab_bottom_selected_1.png",
                    "tab_bottom_selected_2.png",
                    "tab_bottom_selected_3.png",
                    "tab_bottom_selected_4.png",
                    "tab_bottom_selected_5.png",
                    "tab_bottom_selected_6.png",
                    "tab_bottom_selected_7.png",
                    "tab_bottom_unselected_1.png",
                    "tab_bottom_unselected_2.png",
                    "tab_bottom_unselected_3.png",
                    "tab_bottom_unselected_4.png",
                    "tab_bottom_unselected_5.png",
                    "tab_bottom_unselected_6.png",
                    "tab_bottom_unselected_7.png",
                    "tab_top_selected_1.png",
                    "tab_top_selected_2.png",
                    "tab_top_selected_3.png",
                    "tab_top_selected_4.png",
                    "tab_top_selected_5.png",
                    "tab_top_selected_6.png",
                    "tab_top_selected_7.png",
                    "tab_top_unselected_1.png",
                    "tab_top_unselected_2.png",
                    "tab_top_unselected_3.png",
                    "tab_top_unselected_4.png",
                    "tab_top_unselected_5.png",
                    "tab_top_unselected_6.png",
                    "tab_top_unselected_7.png"
                ];

                for (let file of files) {
                    let response = await fetch(`pack_assets/transparent_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/creative_inventory").file(file, arrayBuffer);
                }
                console.log("Transparent UI loaded file path at resourcepack/assets/minecraft/textures/gui/sprites/container/creative_inventory");

                files = [
                    "enchantment_slot.png",
                    "enchantment_slot_disabled.png",
                    "enchantment_slot_highlighted.png"
                ];

                for (let file of files) {
                    let response = await fetch(`pack_assets/transparent_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/enchanting_table").file(file, arrayBuffer);
                }
                console.log("Transparent UI loaded file path at resourcepack/assets/minecraft/textures/gui/sprites/container/enchanting_table");

                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/furnace").file("burn_progress.png", await fetch("pack_assets/transparent_ui/burn_progress.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/furnace").file("lit_progress.png", await fetch("pack_assets/transparent_ui/lit_progress.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/grindstone").file("error.png", await fetch("pack_assets/transparent_ui/error.png").then(response => response.arrayBuffer()));

                files = [
                    "armor_slot.png",
                    "chest_slots.png",
                    "llama_armor_slot.png",
                    "saddle_slot.png"
                ];

                for (let file of files) {
                    let response = await fetch(`pack_assets/transparent_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/horse").file(file, arrayBuffer);
                }
                console.log("Transparent UI loaded file path at resourcepack/assets/minecraft/textures/gui/sprites/container/horse");

                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/inventory").file("effect_background_large.png", await fetch("pack_assets/transparent_ui/effect_background_large.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/inventory").file("effect_background_small.png", await fetch("pack_assets/transparent_ui/effect_background_small.png").then(response => response.arrayBuffer()));

                files = [
                    "error.png",
                    "text_field.png",
                    "text_field_disabled.png"
                ];

                for (let file of files) {
                    let response = await fetch(`pack_assets/transparent_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/anvil").file(file, arrayBuffer);
                }
                console.log("Transparent UI loaded file path at resourcepack/assets/minecraft/textures/gui/sprites/container/anvil");

                files = [
                    "button.png",
                    "button_disabled.png",
                    "button_highlighted.png",
                    "button_selected.png"
                ];

                for (let file of files) {
                    let response = await fetch(`pack_assets/transparent_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/beacon").file(file, arrayBuffer);
                }

                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/blast_furnace").file("burn_progress.png", await fetch("pack_assets/transparent_ui/burn_progress.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/blast_furnace").file("lit_progress.png", await fetch("pack_assets/transparent_ui/lit_progress.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/brewing_stand").file("brew_progress.png", await fetch("pack_assets/transparent_ui/brew_progress.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/brewing_stand").file("bubbles.png", await fetch("pack_assets/transparent_ui/bubbles.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/bundle").file("slot.png", await fetch("pack_assets/transparent_ui/slot.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/bundle").file("blocked_slot.png", await fetch("pack_assets/transparent_ui/blocked_slot.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/cartography_table").file("error.png", await fetch("pack_assets/transparent_ui/error.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/crafter").file("disabled_slot.png", await fetch("pack_assets/transparent_ui/disabled_slot.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/crafter").file("unpowered_redstone.png", await fetch("pack_assets/transparent_ui/unpowered_redstone.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/hud").file("effect_background.png", await fetch("pack_assets/transparent_ui/effect_background.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/hud").file("effect_background_ambient.png", await fetch("pack_assets/transparent_ui/effect_background_ambient.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/advancements").file("window.png", await fetch("pack_assets/transparent_ui/window.png").then(response => response.arrayBuffer()));
                console.log("Transparent UI loaded assorted extra file paths");

                files = [
                    "tab_above_left.png",
                    "tab_above_left_selected.png",
                    "tab_above_middle.png",
                    "tab_above_middle_selected.png",
                    "tab_above_right.png",
                    "tab_above_right_selected.png",
                    "tab_below_left.png",
                    "tab_below_left_selected.png",
                    "tab_below_middle.png",
                    "tab_below_middle_selected.png",
                    "tab_below_right.png",
                    "tab_below_right_selected.png",
                    "tab_left_bottom.png",
                    "tab_left_bottom_selected.png",
                    "tab_left_middle.png",
                    "tab_left_middle_selected.png",
                    "tab_left_top.png",
                    "tab_left_top_selected.png",
                    "tab_right_bottom.png",
                    "tab_right_bottom_selected.png",
                    "tab_right_middle.png",
                    "tab_right_middle_selected.png",
                    "tab_right_top.png",
                    "tab_right_top_selected.png"
                ];

            for (let file of files) {
                let response = await fetch(`pack_assets/transparent_ui/${file}`);
                let arrayBuffer = await response.arrayBuffer();
                zip.folder("resourcepack/assets/minecraft/textures/gui/container").file(file, arrayBuffer);
            }
            console.log("Transparent UI loaded file path at resourcepack/assets/minecraft/textures/gui/container");

                files = [
                    "anvil.png",
                    "beacon.png",
                    "blast_furnace.png",
                    "brewing_stand.png",
                    "cartography_table.png",
                    "crafter.png",
                    "crafting_table.png",
                    "dispenser.png",
                    "enchanting_table.png",
                    "furnace.png",
                    "generic_54.png",
                    "grindstone.png",
                    "hopper.png",
                    "horse.png",
                    "inventory.png",
                    "loom.png",
                    "shulker_box.png",
                    "smithing.png",
                    "smoker.png",
                    "stonecutter.png",
                    "villager.png"
                ];

                for (let file of files) {
                    let response = await fetch(`pack_assets/transparent_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/container").file(file, arrayBuffer);
                }
                console.log("Transparent UI loaded file path at resourcepack/assets/minecraft/textures/gui/container");

                files = [
                    "tab_item_search.png",
                    "tab_items.png",
                    "tab_inventory.png",
                    "tabs.png"
                ];

                for (let file of files) {
                    let response = await fetch(`pack_assets/transparent_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/container/creative_inventory").file(file, arrayBuffer);
                }
                console.log("Transparent UI loaded file path at resourcepack/assets/minecraft/textures/gui/container/creative_inventory");

                console.log("Transparent UI Loaded");
            }

            // Generate and download zip
            console.log("Generating and downloading zip...");
            zip.generateAsync({ type: "blob" }).then((content) => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(content);
            link.download = "Tinkercraft Pack.zip";
            link.click();
            });
        }
    }
}
// Get the button element
const button = document.getElementById("run-button");
// Add an event listener to the button
button.addEventListener("click", buildAndDownload);
