// Define the selected packs
let selected = [];

// Define the version
let version = "21";

// Define the incompatible packs
let incompatiblePacks = [
    ["transparent_ui", "dark_ui", "immersive_ui"]
];

// Define the configuration rules
const configRules = {
    '20': {
        'modern_creepers': {
            'files': [
                { 'file': 'creeper.png', 'path': 'resourcepack/assets/minecraft/textures/entity/creeper', 'libraryPath': 'pack_assets/modern_creepers' },
                { 'file': 'creeper_armor.png', 'path': 'resourcepack/assets/minecraft/textures/entity/creeper', 'libraryPath': 'pack_assets/modern_creepers' }
            ]
        },
        'pack2': {
            'files': [
                { 'file': 'file3.txt', 'path': 'path/to/pack3', 'libraryPath': 'path/to/library3' },
                { 'file': 'file4.txt', 'path': 'path/to/pack4', 'libraryPath': 'path/to/library4' }
            ]
        }
    },
    '21': {
        'modern_creepers': {
            'files': [
                { 'file': 'creeper.png', 'path': 'resourcepack/assets/minecraft/textures/entity/creeper', 'libraryPath': 'pack_assets/modern_creepers' },
                { 'file': 'creeper_armor.png', 'path': 'resourcepack/assets/minecraft/textures/entity/creeper', 'libraryPath': 'pack_assets/modern_creepers' }
            ]
        },
        'pack2': {
            'files': [
                { 'file': 'file7.txt', 'path': 'path/to/pack7', 'libraryPath': 'path/to/library7' },
                { 'file': 'file8.txt', 'path': 'path/to/pack8', 'libraryPath': 'path/to/library8' }
            ]
        }
    }
};

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
function buildAndDownload() {
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
            console.log("No incompatible packs found. Proceeding to manifest creation...");
            console.log(`Version: ${version}`);
            console.log(`Packs selected: ${selected.join(', ')}`);

            // Generate the file tree
            const fileTree = generateFileTree(selected, version);
            console.log("File Tree:");
            Object.keys(fileTree).forEach(filePath => {
                console.log(`  ${filePath}`);
            });

            // Create a zip archive using JSZip
            const zip = new JSZip();
            console.log("Creating zip archive...");
            Object.keys(fileTree).forEach(filePath => {
                const libraryPath = fileTree[filePath].libraryPath;
                console.log(`Adding file to zip archive: ${filePath}`);
                zip.file(filePath, '', { createFolders: true });
                fetch(libraryPath)
                    .then(response => {
                        console.log(`Fetched file from library path: ${libraryPath}`);
                        return response.blob();
                    })
                    .then(blob => {
                        console.log(`Added file to zip archive: ${filePath}`);
                        zip.file(filePath, blob);
                    })
                    .catch(error => {
                        console.error(`Error adding file to zip archive: ${filePath}`, error);
                    });
            });

            // Generate the zip archive as a blob
            console.log("Generating zip archive as blob...");
            zip.generateAsync({ type: 'blob' })
                .then(blob => {
                    console.log("Zip archive generated as blob.");
                    // Create a URL that points to the blob
                    const url = URL.createObjectURL(blob);
                    console.log(`Created URL for zip archive: ${url}`);
                    // Download the zip archive from the URL
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'download.zip';
                    console.log("Downloading zip archive...");
                    link.click();
                })
                .catch(error => {
                    console.error("Error generating zip archive as blob:", error);
                });
        }
    }
}
// Get the button element
const button = document.getElementById("run-button");
// Add an event listener to the button
button.addEventListener("click", buildAndDownload);



// Function to generate the file tree
function generateFileTree(selected, version) {
    const fileTree = {};

    selected.forEach(pack => {
        if (configRules[version] && configRules[version][pack]) {
            const files = configRules[version][pack].files;
            files.forEach(file => {
                const filePath = `${file.path}/${file.file}`;
                const libraryPath = `${file.libraryPath}/${file.file}`;
                fileTree[filePath] = { libraryPath };
                console.log(`  ${filePath} has library at ${libraryPath}`);
            });
        }
    });

    return fileTree;
}