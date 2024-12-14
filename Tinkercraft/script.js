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
    });
});

// Get the button and modal window elements
const openModalButton = document.getElementById('open-modal');
const modal = document.getElementById('modal');
const modalOverlay = document.querySelector('.modal-overlay');

// Add an event listener to the button to toggle the modal window
openModalButton.addEventListener('click', () => {
    modal.style.display = 'block';
    modalOverlay.style.display = 'block';
    overrideConsoleLog();
    buildAndDownload();
});

// Get the cancel button
const cancelButton = document.querySelector('.cancel-button');

// Add an event listener to the cancel button to close the modal window
cancelButton.addEventListener('click', () => {
    modal.style.display = 'none';
    modalOverlay.style.display = 'none';
    restoreConsoleLog();
});

const originalConsoleLog = console.log;

// Function to override console.log
function overrideConsoleLog() {
    console.log = function(...args) {
        const modalConsole = document.querySelector('.modal-console');
        modalConsole.innerHTML += '' + args.join('') + '<br/>';
        originalConsoleLog.apply(console, args);
    };
}

// Function to restore original console.log
function restoreConsoleLog() {
    console.log = originalConsoleLog;
}




//Build and Download the file
async function buildAndDownload() {
    if (selected.length === 0) {
        console.log("No packs selected. Please select at least one pack.");
        return;
    } else {
        console.log("Checking Compatibility...");
        let langFilePaths = [];
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

            if (selected.includes("dark_ui") && (version === "21" || version === "20")) {

                zip.folder("resourcepack/assets/minecraft/shaders/core").file("rendertype_text.vsh", await fetch("pack_assets/dark_ui/rendertype_text.vsh").then(response => response.arrayBuffer()));

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
                        let response = await fetch(`pack_assets/dark_ui/${file}`);
                        let arrayBuffer = await response.arrayBuffer();
                        zip.folder("resourcepack/assets/minecraft/textures/item").file(file, arrayBuffer);
                    }
                console.log("Dark UI loaded file path at resourcepack/assets/minecraft/textures/item");
                    
                zip.folder("resourcepack/assets/minecraft/textures/gui").file("recipe_book.png", await fetch("pack_assets/dark_ui/recipe_book.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui").file("demo_background.png", await fetch("pack_assets/dark_ui/demo_background.png").then(response => response.arrayBuffer()));

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
                        let response = await fetch(`pack_assets/dark_ui/${file}`);
                        let arrayBuffer = await response.arrayBuffer();
                        zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/recipe_book").file(file, arrayBuffer);
                    }
                console.log("Dark UI loaded file path at resourcepack/assets/minecraft/textures/gui/sprites/recipe_book");

                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/social_interactions").file("background.png", await fetch("pack_assets/dark_ui/background.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/social_interactions").file("background.png.mcmeta", await fetch("pack_assets/dark_ui/background.png.mcmeta").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/statistics").file("header.png", await fetch("pack_assets/dark_ui/header.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container").file("slot.png", await fetch("pack_assets/dark_ui/slot.png").then(response => response.arrayBuffer()));

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
                    let response = await fetch(`pack_assets/dark_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/loom").file(file, arrayBuffer);
                }
                console.log("Dark UI loaded file path at resourcepack/assets/minecraft/textures/gui/sprites/container/loom");

                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/smithing").file("error.png", await fetch("pack_assets/dark_ui/error.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/smoker").file("burn_progress.png", await fetch("pack_assets/dark_ui/burn_progress.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/smoker").file("lit_progress.png", await fetch("pack_assets/dark_ui/lit_progress.png").then(response => response.arrayBuffer()));

                files = [
                    "out_of_stock.png",
                    "scroller.png",
                    "scroller_disabled.png"
                ];

                for (let file of files) {
                    let response = await fetch(`pack_assets/dark_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/villager").file(file, arrayBuffer);
                }
                console.log("Dark UI loaded file path at resourcepack/assets/minecraft/textures/gui/sprites/container/villager");

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
                    let response = await fetch(`pack_assets/dark_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/creative_inventory").file(file, arrayBuffer);
                }
                console.log("Dark UI loaded file path at resourcepack/assets/minecraft/textures/gui/sprites/container/creative_inventory");

                files = [
                    "enchantment_slot.png",
                    "enchantment_slot_disabled.png",
                    "enchantment_slot_highlighted.png"
                ];

                for (let file of files) {
                    let response = await fetch(`pack_assets/dark_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/enchanting_table").file(file, arrayBuffer);
                }
                console.log("Dark UI loaded file path at resourcepack/assets/minecraft/textures/gui/sprites/container/enchanting_table");

                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/furnace").file("burn_progress.png", await fetch("pack_assets/dark_ui/burn_progress.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/furnace").file("lit_progress.png", await fetch("pack_assets/dark_ui/lit_progress.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/grindstone").file("error.png", await fetch("pack_assets/dark_ui/error.png").then(response => response.arrayBuffer()));

                files = [
                    "armor_slot.png",
                    "chest_slots.png",
                    "llama_armor_slot.png",
                    "saddle_slot.png"
                ];

                for (let file of files) {
                    let response = await fetch(`pack_assets/dark_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/horse").file(file, arrayBuffer);
                }
                console.log("Dark UI loaded file path at resourcepack/assets/minecraft/textures/gui/sprites/container/horse");

                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/inventory").file("effect_background_large.png", await fetch("pack_assets/dark_ui/effect_background_large.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/inventory").file("effect_background_small.png", await fetch("pack_assets/dark_ui/effect_background_small.png").then(response => response.arrayBuffer()));

                files = [
                    "error.png",
                    "text_field.png",
                    "text_field_disabled.png"
                ];

                for (let file of files) {
                    let response = await fetch(`pack_assets/dark_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/anvil").file(file, arrayBuffer);
                }
                console.log("Dark UI loaded file path at resourcepack/assets/minecraft/textures/gui/sprites/container/anvil");

                files = [
                    "button.png",
                    "button_disabled.png",
                    "button_highlighted.png",
                    "button_selected.png"
                ];

                for (let file of files) {
                    let response = await fetch(`pack_assets/dark_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/beacon").file(file, arrayBuffer);
                }

                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/blast_furnace").file("burn_progress.png", await fetch("pack_assets/dark_ui/burn_progress.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/blast_furnace").file("lit_progress.png", await fetch("pack_assets/dark_ui/lit_progress.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/brewing_stand").file("brew_progress.png", await fetch("pack_assets/dark_ui/brew_progress.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/brewing_stand").file("bubbles.png", await fetch("pack_assets/dark_ui/bubbles.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/bundle").file("slot.png", await fetch("pack_assets/dark_ui/slot.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/bundle").file("blocked_slot.png", await fetch("pack_assets/dark_ui/blocked_slot.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/cartography_table").file("error.png", await fetch("pack_assets/dark_ui/error.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/crafter").file("disabled_slot.png", await fetch("pack_assets/dark_ui/disabled_slot.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/crafter").file("unpowered_redstone.png", await fetch("pack_assets/dark_ui/unpowered_redstone.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/hud").file("effect_background.png", await fetch("pack_assets/dark_ui/effect_background.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/hud").file("effect_background_ambient.png", await fetch("pack_assets/dark_ui/effect_background_ambient.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/advancements").file("window.png", await fetch("pack_assets/dark_ui/window.png").then(response => response.arrayBuffer()));
                console.log("Dark UI loaded assorted extra file paths");

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
                let response = await fetch(`pack_assets/dark_ui/${file}`);
                let arrayBuffer = await response.arrayBuffer();
                zip.folder("resourcepack/assets/minecraft/textures/gui/container").file(file, arrayBuffer);
            }
            console.log("Dark UI loaded file path at resourcepack/assets/minecraft/textures/gui/container");

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
                    let response = await fetch(`pack_assets/dark_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/container").file(file, arrayBuffer);
                }
                console.log("Dark UI loaded file path at resourcepack/assets/minecraft/textures/gui/container");

                files = [
                    "tab_item_search.png",
                    "tab_items.png",
                    "tab_inventory.png",
                    "tabs.png"
                ];

                for (let file of files) {
                    let response = await fetch(`pack_assets/dark_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/container/creative_inventory").file(file, arrayBuffer);
                }
                console.log("Dark UI loaded file path at resourcepack/assets/minecraft/textures/gui/container/creative_inventory");

                console.log("Dark UI Loaded");
            }

            if (selected.includes("immersive_ui")) {
                langFilePaths.push("pack_assets/immersive_ui/lang/en_us.json");
                console.log("Immersive UI loaded lang file");

                files = [
                    "accessibility.png",
                    "bars.png",
                    "book.png",
                    "checkbox.png",
                    "checkmark.png",
                    "footer_separator.png",
                    "header_separator.png",
                    "icons.png",
                    "recipe_book.png",
                    "recipe_button.png",
                    "report_button.png",
                    "resource_packs.png",
                    "server_selection.png",
                    "social_interactions.png",
                    "spectator_widgets.png",
                    "tab_button.png",
                    "toasts.png",
                    "widgets.png",
                    "world_selection.png"
                ];

                for (let file of files) {
                    let response = await fetch(`pack_assets/immersive_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui").file(file, arrayBuffer);
                }
                console.log("Immersive UI loaded file path at resourcepack/assets/minecraft/textures/gui");

                files = [
                    "anvil.png",
                    "beacon.png",
                    "blast_furnace.png",
                    "brewing_stand.png",
                    "brewing_stand_frame_0.png",
                    "brewing_stand_frame_1.png",
                    "brewing_stand_frame_2.png",
                    "brewing_stand_frame_3.png",
                    "brewing_stand_frame_4.png",
                    "brewing_stand_frame_5.png",
                    "bundle.png",
                    "cartography_table.png",
                    "crafter.png",
                    "crafting_table.png",
                    "dispenser.png",
                    "enchanting_table.png",
                    "furnace.png",
                    "generic_54.png",
                    "grindstone.png",
                    "hopper.png",
                    "inventory.png",
                    "legacy_smithing.png",
                    "loom.png",
                    "shulker_box.png",
                    "smoker.png",
                    "smithing.png",
                    "stats_icons.png",
                    "stonecutter.png",
                    "tabs.png",
                    "villager.png",
                    "wandering_trader_deprecated.png"
                ];

                for (let file of files) {
                    let response = await fetch(`pack_assets/immersive_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/container").file(file, arrayBuffer);
                }
                console.log("Immersive UI loaded file path at resourcepack/assets/minecraft/textures/gui/container");

                files = [
                    "move_down_highlighted.png",
                    "move_up_highlighted.png",
                    "select_highlighted.png",
                    "unselect_highlighted.png"
                ];

                for (let file of files) {
                    let response = await fetch(`pack_assets/immersive_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/transferable_list").file(file, arrayBuffer);
                }
                console.log("Immersive UI loaded file path at resourcepack/assets/minecraft/textures/gui/sprites/transferable_list");

                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/world_list").file("join_highlighted.png", await fetch("pack_assets/immersive_ui/join_highlighted.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/world_list").file("marked_join_highlighted.png", await fetch("pack_assets/immersive_ui/marked_join_highlighted.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/server_list").file("join_highlighted.png", await fetch("pack_assets/immersive_ui/join_highlighted.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/server_list").file("move_down_highlighted.png", await fetch("pack_assets/immersive_ui/move_down_highlighted.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/server_list").file("move_up_highlighted.png", await fetch("pack_assets/immersive_ui/move_up_highlighted.png").then(response => response.arrayBuffer()));

                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/social_interactions").file("background.png", await fetch("pack_assets/dark_ui/background.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/social_interactions").file("background.png.mcmeta", await fetch("pack_assets/dark_ui/background.png.mcmeta").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/statistics").file("header.png", await fetch("pack_assets/dark_ui/header.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container").file("slot.png", await fetch("pack_assets/dark_ui/slot.png").then(response => response.arrayBuffer()));

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
                    let response = await fetch(`pack_assets/immersive_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/loom").file(file, arrayBuffer);
                }
                console.log("Immersive UI loaded file path at resourcepack/assets/minecraft/textures/gui/sprites/container/loom");

                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/smithing").file("error.png", await fetch("pack_assets/immersive_ui/error.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/smoker").file("burn_progress.png", await fetch("pack_assets/immersive_ui/smoker/burn_progress.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/smoker").file("lit_progress.png", await fetch("pack_assets/immersive_ui/smoker/lit_progress.png").then(response => response.arrayBuffer()));

                files = [
                    "out_of_stock.png",
                    "scroller.png",
                    "scroller_disabled.png"
                ];

                for (let file of files) {
                    let response = await fetch(`pack_assets/immersive_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/villager").file(file, arrayBuffer);
                }
                console.log("Immersive UI loaded file path at resourcepack/assets/minecraft/textures/gui/sprites/container/villager");

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
                    let response = await fetch(`pack_assets/immersive_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/creative_inventory").file(file, arrayBuffer);
                }
                console.log("Immersive UI loaded file path at resourcepack/assets/minecraft/textures/gui/sprites/container/creative_inventory");

                files = [
                    "enchantment_slot.png",
                    "enchantment_slot_disabled.png",
                    "enchantment_slot_highlighted.png"
                ];

                for (let file of files) {
                    let response = await fetch(`pack_assets/immersive_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/enchanting_table").file(file, arrayBuffer);
                }
                console.log("Immersive UI loaded file path at resourcepack/assets/minecraft/textures/gui/sprites/container/enchanting_table");

                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/furnace").file("burn_progress.png", await fetch("pack_assets/immersive_ui/burn_progress.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/furnace").file("lit_progress.png", await fetch("pack_assets/immersive_ui/lit_progress.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/grindstone").file("error.png", await fetch("pack_assets/immersive_ui/error.png").then(response => response.arrayBuffer()));

                files = [
                    "armor_slot.png",
                    "chest_slots.png",
                    "llama_armor_slot.png",
                    "saddle_slot.png"
                ];

                for (let file of files) {
                    let response = await fetch(`pack_assets/immersive_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/horse").file(file, arrayBuffer);
                }
                console.log("Immersive UI loaded file path at resourcepack/assets/minecraft/textures/gui/sprites/container/horse");

                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/inventory").file("effect_background_large.png", await fetch("pack_assets/immersive_ui/effect_background_large.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/inventory").file("effect_background_small.png", await fetch("pack_assets/immersive_ui/effect_background_small.png").then(response => response.arrayBuffer()));

                files = [
                    "error.png",
                    "text_field.png",
                    "text_field_disabled.png"
                ];

                for (let file of files) {
                    let response = await fetch(`pack_assets/immersive_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/anvil").file(file, arrayBuffer);
                }
                console.log("Immersive UI loaded file path at resourcepack/assets/minecraft/textures/gui/sprites/container/anvil");

                files = [
                    "button.png",
                    "button_disabled.png",
                    "button_highlighted.png",
                    "button_selected.png"
                ];

                for (let file of files) {
                    let response = await fetch(`pack_assets/immersive_ui/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/beacon").file(file, arrayBuffer);
                }

                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/blast_furnace").file("burn_progress.png", await fetch("pack_assets/immersive_ui/blast/burn_progress.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/blast_furnace").file("lit_progress.png", await fetch("pack_assets/immersive_ui/blast/lit_progress.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/brewing_stand").file("brew_progress.png", await fetch("pack_assets/immersive_ui/brew_progress.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/brewing_stand").file("bubbles.png", await fetch("pack_assets/immersive_ui/bubbles.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/bundle").file("slot.png", await fetch("pack_assets/immersive_ui/slot.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/bundle").file("blocked_slot.png", await fetch("pack_assets/immersive_ui/blocked_slot.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/cartography_table").file("error.png", await fetch("pack_assets/immersive_ui/error.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/crafter").file("disabled_slot.png", await fetch("pack_assets/immersive_ui/disabled_slot.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/crafter").file("unpowered_redstone.png", await fetch("pack_assets/immersive_ui/unpowered_redstone.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/container/crafter").file("powered_redstone.png", await fetch("pack_assets/immersive_ui/powered_redstone.png").then(response => response.arrayBuffer()));
                console.log("Immersive UI loaded assorted extra file paths");

                console.log("Immersive UI Loaded");
            }

            if (selected.includes("wood_for_boomers") && (version === "21" || version === "20")) {
                zip.folder("resourcepack/assets/minecraft/textures/gui/sprites/toast").file("wooden_planks.png", await fetch("pack_assets/wood_for_boomers/wooden_planks.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/painting").file("back.png", await fetch("pack_assets/wood_for_boomers/back.png").then(response => response.arrayBuffer()));

                let files = [
                    "acacia_planks.png",
                    "acacia_planks_01.png",
                    "acacia_planks_02.png",
                    "acacia_planks_03.png",
                    "acacia_planks_04.png",
                    "acacia_planks_05.png",
                    "birch_planks.png",
                    "birch_planks_01.png",
                    "birch_planks_02.png",
                    "birch_planks_03.png",
                    "birch_planks_04.png",
                    "birch_planks_05.png",
                    "cartography_table_side1.png",
                    "cartography_table_side2.png",
                    "cartography_table_side3.png",
                    "cartography_table_top.png",
                    "cherry_planks.png",
                    "cherry_planks_01.png",
                    "cherry_planks_02.png",
                    "cherry_planks_03.png",
                    "cherry_planks_04.png",
                    "cherry_planks_05.png",
                    "crafter_east.png",
                    "crafter_east_crafting.png",
                    "crafter_east_triggered.png",
                    "crafter_north.png",
                    "crafter_north_crafting.png",
                    "crafter_south.png",
                    "crafter_south_triggered.png",
                    "crafter_west.png",
                    "crafter_west_crafting.png",
                    "crafter_west_triggered.png",
                    "crafting_table_front.png",
                    "crafting_table_side.png",
                    "crimson_planks.png",
                    "crimson_planks_01.png",
                    "crimson_planks_02.png",
                    "crimson_planks_03.png",
                    "crimson_planks_04.png",
                    "crimson_planks_05.png",
                    "dark_oak_planks.png",
                    "dark_oak_planks_01.png",
                    "dark_oak_planks_02.png",
                    "dark_oak_planks_03.png",
                    "dark_oak_planks_04.png",
                    "dark_oak_planks_05.png",
                    "fletching_table_front.png",
                    "fletching_table_side.png",
                    "fletching_table_top.png",
                    "jungle_planks.png",
                    "jungle_planks_01.png",
                    "jungle_planks_02.png",
                    "jungle_planks_03.png",
                    "jungle_planks_04.png",
                    "jungle_planks_05.png",
                    "lectern_base.png",
                    "mangrove_planks.png",
                    "mangrove_planks_01.png",
                    "mangrove_planks_02.png",
                    "mangrove_planks_03.png",
                    "mangrove_planks_04.png",
                    "mangrove_planks_05.png",
                    "oak_planks.png",
                    "oak_planks_01.png",
                    "oak_planks_02.png",
                    "oak_planks_03.png",
                    "oak_planks_04.png",
                    "oak_planks_05.png",
                    "smithing_table_front.png",
                    "smithing_table_side.png",
                    "spruce_planks.png",
                    "spruce_planks_01.png",
                    "spruce_planks_02.png",
                    "spruce_planks_03.png",
                    "spruce_planks_04.png",
                    "spruce_planks_05.png",
                    "warped_planks.png",
                    "warped_planks_01.png",
                    "warped_planks_02.png",
                    "warped_planks_03.png",
                    "warped_planks_04.png",
                    "warped_planks_05.png",
                    "pale_oak_planks.png",
                    "pale_oak_planks_01.png",
                    "pale_oak_planks_02.png",
                    "pale_oak_planks_03.png",
                    "pale_oak_planks_04.png",
                    "pale_oak_planks_05.png"
                ];
                    
                    for (let file of files) {
                        let response = await fetch(`pack_assets/wood_for_boomers/${file}`);
                        let arrayBuffer = await response.arrayBuffer();
                        zip.folder("resourcepack/assets/minecraft/textures/block").file(file, arrayBuffer);
                    }
                    console.log("Wood for Boomers loaded file path at resourcepack/assets/minecraft/textures/block");

                    files = [
                        "black.png",
                        "blue.png",
                        "brown.png",
                        "cyan.png",
                        "gray.png",
                        "green.png",
                        "light_blue.png",
                        "light_gray.png",
                        "lime.png",
                        "magenta.png",
                        "orange.png",
                        "pink.png",
                        "purple.png",
                        "red.png",
                        "white.png",
                        "yellow.png"
                    ];

                    for (let file of files) {
                        let response = await fetch(`pack_assets/wood_for_boomers/${file}`);
                        let arrayBuffer = await response.arrayBuffer();
                        zip.folder("resourcepack/assets/minecraft/textures/entity/bed").file(file, arrayBuffer);
                    }
                    console.log("Wood for Boomers loaded file path at resourcepack/assets/minecraft/textures/entity/bed");

                    files = [
                        "mangrove.png",
                        "oak.png",
                        "spruce.png",
                        "acacia.png",
                        "birch.png",
                        "cherry.png",
                        "dark_oak.png",
                        "jungle.png",
                        "pale_oak.png"
                    ];

                    for (let file of files) {
                        let response = await fetch(`pack_assets/wood_for_boomers/${file}`);
                        let arrayBuffer = await response.arrayBuffer();
                        zip.folder("resourcepack/assets/minecraft/textures/entity/boat").file(file, arrayBuffer);
                    }
                    console.log("Wood for Boomers loaded file path at resourcepack/assets/minecraft/textures/entity/boat");

                    files = [
                        "mangrove.png",
                        "oak.png",
                        "spruce.png",
                        "acacia.png",
                        "birch.png",
                        "cherry.png",
                        "dark_oak.png",
                        "jungle.png",
                        "pale_oak.png"
                    ];

                    for (let file of files) {
                        let response = await fetch(`pack_assets/wood_for_boomers/chest_boat/${file}`);
                        let arrayBuffer = await response.arrayBuffer();
                        zip.folder("resourcepack/assets/minecraft/textures/entity/chest_boat").file(file, arrayBuffer);
                    }
                    console.log("Wood for Boomers loaded file path at resourcepack/assets/minecraft/textures/entity/chest_boat");

                    files = [
                        "mangrove.png",
                        "oak.png",
                        "spruce.png",
                        "acacia.png",
                        "birch.png",
                        "cherry.png",
                        "dark_oak.png",
                        "jungle.png",
                        "pale_oak.png"
                    ];

                    for (let file of files) {
                        let response = await fetch(`pack_assets/wood_for_boomers/sign/${file}`);
                        let arrayBuffer = await response.arrayBuffer();
                        zip.folder("resourcepack/assets/minecraft/textures/entity/signs").file(file, arrayBuffer);
                    }
                    console.log("Wood for Boomers loaded file path at resourcepack/assets/minecraft/textures/entity/signs");

                console.log("Wood for Boomers Loaded");
            }

            if (selected.includes("ores_for_boomers") && (version === "21" || version === "20")) {
                let files = [
                    "iron_ore.png",
                    "lapis_ore.png",
                    "redstone_ore.png",
                    "redstone_ore_off.png",
                    "coal_ore.png",
                    "copper_ore.png",
                    "deepslate_coal_ore.png",
                    "deepslate_copper_ore.png",
                    "deepslate_diamond_ore.png",
                    "deepslate_emerald_ore.png",
                    "deepslate_gold_ore.png",
                    "deepslate_iron_ore.png",
                    "deepslate_lapis_ore.png",
                    "deepslate_redstone_ore.png",
                    "deepslate_redstone_ore_off.png",
                    "diamond_ore.png",
                    "emerald_ore.png",
                    "gold_ore.png"
                ];
                
                for (let file of files) {
                    let response = await fetch(`pack_assets/ores_for_boomers/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/block").file(file, arrayBuffer);
                }
                console.log("Ores for Boomers loaded file path at resourcepack/assets/minecraft/textures/block");
                console.log("Ores for Boomers Loaded");
            }

            if (selected.includes("gravel_for_boomers") && (version === "21" || version === "20")) {
                let files = [
                    "gravel.png",
                    "suspicious_gravel_0.png",
                    "suspicious_gravel_1.png",
                    "suspicious_gravel_2.png",
                    "suspicious_gravel_3.png"
                ];
                
                for (let file of files) {
                    let response = await fetch(`pack_assets/gravel_for_boomers/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/block").file(file, arrayBuffer);
                }
                console.log("Gravel for Boomers loaded file path at resourcepack/assets/minecraft/textures/block");
                console.log("Gravel for Boomers Loaded");
            }

            if (selected.includes("plants_for_boomers") && (version === "21" || version === "20")) {
                let files = [
                    "leaves.json",
                    "vine.json",
                    "acacia_leaves.json",
                    "birch_leaves.json",
                    "dark_oak_leaves.json",
                    "grass_block.json"
                ];
                
                for (let file of files) {
                    let response = await fetch(`pack_assets/plants_for_boomers/leaves/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/models/block").file(file, arrayBuffer);
                }
                console.log("Plants for Boomers loaded file path at resourcepack/assets/minecraft/models/block");

                files = [
                    "potted_azalea_bush_top.png",
                    "potted_flowering_azalea_bush_plant.png",
                    "potted_flowering_azalea_bush_side.png",
                    "potted_flowering_azalea_bush_top.png",
                    "short_grass.png",
                    "spruce_leaves.png",
                    "spruce_sapling.png",
                    "sugar_cane.png",
                    "tall_grass_bottom.png",
                    "tall_grass_top.png",
                    "vine.png",
                    "acacia_sapling.png",
                    "azalea_leaves.png",
                    "azalea_plant.png",
                    "azalea_side.png",
                    "azalea_top.png",
                    "birch_sapling.png",
                    "dark_oak_sapling.png",
                    "fern.png",
                    "flowering_azalea_leaves.png",
                    "flowering_azalea_side.png",
                    "flowering_azalea_top.png",
                    "grass.png",
                    "grass_block_side.png",
                    "grass_block_top.png",
                    "jungle_leaves.png",
                    "jungle_sapling.png",
                    "large_fern_bottom.png",
                    "large_fern_top.png",
                    "lily_pad.png",
                    "mangrove_leaves.png",
                    "moss_block.png",
                    "oak_leaves.png",
                    "oak_sapling.png",
                    "potted_azalea_bush_plant.png",
                    "potted_azalea_bush_side.png"
                ];
                
                for (let file of files) {
                    let response = await fetch(`pack_assets/plants_for_boomers/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/block").file(file, arrayBuffer);
                }
                console.log("Plants for Boomers loaded file path at resourcepack/assets/minecraft/textures/block");

                zip.folder("resourcepack/assets/minecraft/textures/colormap").file("grass.png", await fetch("pack_assets/plants_for_boomers/colormaps/grass.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/colormap").file("foliage.png", await fetch("pack_assets/plants_for_boomers/colormaps/foliage.png").then(response => response.arrayBuffer()));
                console.log("Plants for Boomers loaded file path at resourcepack/assets/minecraft/textures/colormap");

                console.log("Plants for Boomers Loaded");
            }

            if (selected.includes("wool_for_boomers") && (version === "21" || version === "20")) {
                let files = [
                    "light_gray_wool.png",
                    "lime_wool.png",
                    "magenta_wool.png",
                    "orange_wool.png",
                    "pink_wool.png",
                    "purple_wool.png",
                    "red_wool.png",
                    "white_wool.png",
                    "yellow_wool.png",
                    "black_wool.png",
                    "blue_wool.png",
                    "brown_wool.png",
                    "cyan_wool.png",
                    "gray_wool.png",
                    "green_wool.png",
                    "light_blue_wool.png"
                ];
                
                for (let file of files) {
                    let response = await fetch(`pack_assets/wool_for_boomers/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/block").file(file, arrayBuffer);
                }
                console.log("Wool for Boomers loaded file path at resourcepack/assets/minecraft/textures/block");
                console.log("Wool for Boomers Loaded");
            }

            if (selected.includes("shulkers_for_boomers") && (version === "21" || version === "20")) {
                let files = [
                    "shulker_brown.png",
                    "shulker_cyan.png",
                    "shulker_gray.png",
                    "shulker_green.png",
                    "shulker_light_blue.png",
                    "shulker_light_gray.png",
                    "shulker_lime.png",
                    "shulker_magenta.png",
                    "shulker_orange.png",
                    "shulker_pink.png",
                    "shulker_purple.png",
                    "shulker_red.png",
                    "shulker_white.png",
                    "shulker_yellow.png",
                    "shulker_black.png",
                    "shulker_blue.png"
                ];
                
                for (let file of files) {
                    let response = await fetch(`pack_assets/shulkers_for_boomers/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/entity/shulker").file(file, arrayBuffer);
                }
                console.log("Shulkers for Boomers loaded file path at resourcepack/assets/minecraft/textures/entity/shulker");

                files = files = [
                    "cyan_shulker_box.png",
                    "gray_shulker_box.png",
                    "green_shulker_box.png",
                    "light_blue_shulker_box.png",
                    "light_gray_shulker_box.png",
                    "lime_shulker_box.png",
                    "magenta_shulker_box.png",
                    "orange_shulker_box.png",
                    "pink_shulker_box.png",
                    "purple_shulker_box.png",
                    "red_shulker_box.png",
                    "white_shulker_box.png",
                    "yellow_shulker_box.png",
                    "black_shulker_box.png",
                    "blue_shulker_box.png",
                    "brown_shulker_box.png"
                ];
                
                for (let file of files) {
                    let response = await fetch(`pack_assets/shulkers_for_boomers/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/block").file(file, arrayBuffer);
                }
                console.log("Shulkers for Boomers loaded file path at resourcepack/assets/minecraft/textures/block");

                console.log("Shulkers for Boomers Loaded");
            }

            if (selected.includes("cobble_for_boomers") && (version === "21" || version === "20")) {
                zip.folder("resourcepack/assets/minecraft/textures/block").file("cobblestone.png", await fetch("pack_assets/cobble_for_boomers/cobblestone.png").then(response => response.arrayBuffer()));
                zip.folder("resourcepack/assets/minecraft/textures/block").file("mossy_cobblestone.png", await fetch("pack_assets/cobble_for_boomers/mossy_cobblestone.png").then(response => response.arrayBuffer()));
                console.log("Cobble for Boomers loaded file path at resourcepack/assets/minecraft/textures/block");

                console.log("Cobble for Boomers Loaded");
            }

            if (selected.includes("netherack_for_boomers") && (version === "21" || version === "20")) {
                let files = [
                    "nether_quartz_ore.png",
                    "netherrack.png",
                    "warped_nylium_side.png",
                    "crimson_nylium_side.png",
                    "nether_gold_ore.png"
                ];
                
                for (let file of files) {
                    let response = await fetch(`pack_assets/netherack_for_boomers/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/block").file(file, arrayBuffer);
                }
                console.log("Netherack for Boomers loaded file path at resourcepack/assets/minecraft/textures/block");
                console.log("Netherack for Boomers Loaded");
            }

            if (selected.includes("minecraft_for_boomers") && (version === "21" || version === "20")) {
                let files = [
                    "edition.png",
                    "minceraft.png",
                    "minecraft.png"
                ];
                
                for (let file of files) {
                    let response = await fetch(`pack_assets/minecraft_for_boomers/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/title").file(file, arrayBuffer);
                }
                console.log("Minecraft for Boomers loaded file path at resourcepack/assets/minecraft/textures/gui/title");
                console.log("Minecraft for Boomers Loaded");
            }

            if (selected.includes("pigman") && (version === "21" || version === "20")) {
                langFilePaths.push("pack_assets/pigman/lang/en_us.json");
                console.log("Pigman! loaded lang file");

                let files = [
                    "zombified_piglin2.png",
                    "zombified_piglin3.png",
                    "zombified_piglin.properties"
                ];
                
                for (let file of files) {
                    let response = await fetch(`pack_assets/pigman/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/optifine/random/entity/piglin").file(file, arrayBuffer);
                }
                console.log("Pigman! loaded file path at resourcepack/assets/minecraft/optifine/random/entity/piglin");

                files = [
                    "zombified_piglin.png",
                    "zombified_piglin.jem"
                ];

                for (let file of files) {
                    let response = await fetch(`pack_assets/pigman/model/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/optifine/cem").file(file, arrayBuffer);
                }
                console.log("Pigman! loaded file path at resourcepack/assets/minecraft/optifine/cem");

                zip.folder("resourcepack/assets/minecraft/textures/entity/piglin").file("zombified_piglin.png", await fetch("pack_assets/pigman/zombified_piglin.png").then(response => response.arrayBuffer()));

                console.log("Pigman! Loaded");
            }

            if (selected.includes("oof") && (version === "21" || version === "20")) {
                let files = [
                    "hit3.ogg",
                    "fallbig.ogg",
                    "fallsmall.ogg",
                    "hit1.ogg",
                    "hit2.ogg"
                ];
                
                for (let file of files) {
                    let response = await fetch(`pack_assets/oof/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/sounds/damage").file(file, arrayBuffer);
                }
                console.log("Oof! loaded file path at resourcepack/assets/minecraft/sounds/damage");
                console.log("Oof! Loaded");
            }

            if (selected.includes("i_hate_panoramas") && (version === "21" || version === "20")) {
                let files = [
                    "panorama_4.png",
                    "panorama_5.png",
                    "panorama_overlay.png",
                    "panorama_0.png",
                    "panorama_1.png",
                    "panorama_2.png",
                    "panorama_3.png"
                ];
                
                for (let file of files) {
                    let response = await fetch(`pack_assets/i_hate_panoramas/${file}`);
                    let arrayBuffer = await response.arrayBuffer();
                    zip.folder("resourcepack/assets/minecraft/textures/gui/title").file(file, arrayBuffer);
                }
                console.log("I Hate Panoramas! loaded file path at resourcepack/assets/minecraft/textures/gui/title");
                console.log("I Hate Panoramas! Loaded");
            }

            // Merge lang files
            console.log("langFilePaths:", langFilePaths);
            
            Promise.all(langFilePaths.map((filePath) => {
                console.log("Fetching file:", filePath);
                return fetch(filePath)
                .then((response) => {
                    console.log("Response received for file:", filePath);
                    return response.json();
                })
                .then((jsonData) => {
                    console.log("JSON data received for file:", filePath);
                    zip.file("resourcepack/assets/minecraft/lang/en_us.json", JSON.stringify(jsonData));
                    return jsonData;
                })
                .catch((error) => {
                    console.error("Error fetching file:", filePath, error);
                });
            })).then((jsonDatas) => {
                console.log("All lang files fetched and processed. Merging data...");
                if (jsonDatas.length > 0) {
                const mergedData = {};
                jsonDatas.forEach((jsonData) => {
                    Object.assign(mergedData, jsonData);
                });
                console.log("Merged data:", mergedData);
                console.log("Merged data added to zip file. Proceeding to download...");
                return zip.generateAsync({ type: 'blob' });
                } else {
                console.log("No lang files to be merged.");
                return zip.generateAsync({ type: 'blob' });
                }
            }).then((content) => {
                if (content) {
                console.log("Download initiated...")
                const link = document.createElement("a");
                link.href = URL.createObjectURL(content);
                link.download = "Tinkercraft Pack.zip";
                console.log(`Download link: ${link.href}`);
                console.log("Please note that this link is valid for 5 minutes, or until you close this tab.");
                link.click();
                console.log("Download completed. You can now safely close this pop-up window.");
                }
            }).catch((error) => {
                console.error("Error processing files:", error);
            });
        }
    }
}
// Get the button element
const button = document.getElementById("run-button");
// Add an event listener to the button
button.addEventListener("click", buildAndDownload);