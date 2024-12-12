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
