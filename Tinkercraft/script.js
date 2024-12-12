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
                console.log("Fresh Crops Loaded");
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
