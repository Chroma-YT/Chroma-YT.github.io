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
    'files': ['file1.txt', 'file2.txt'],
    'path': 'path/to/pack1'
    },
    'pack2': {
    'files': ['file3.txt', 'file4.txt'],
    'path': 'path/to/pack2'
    }
},
'21': {
    'modern_creepers': {
    'files': ['file5.txt', 'file6.txt'],
    'path': 'path/to/pack1/v21'
    },
    'pack2': {
    'files': ['file7.txt', 'file8.txt'],
    'path': 'path/to/pack2/v21'
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
    }
}
// Get the button element
const button = document.getElementById("run-button");
// Add an event listener to the button
button.addEventListener("click", buildAndDownload);


// Function to generate the file tree
function generateFileTree(selected, version) {
    const fileTree = {};
    
    // Iterate over the selected packs
    selected.forEach(pack => {
        // Check if the pack has configuration rules for the current version
        if (configRules[version] && configRules[version][pack]) {
            // Get the files and path for the pack
            const files = configRules[version][pack].files;
            const path = configRules[version][pack].path;
            
            // Add the files to the file tree
            files.forEach(file => {
                const filePath = `${path}/${file}`;
                fileTree[filePath] = {};
            });
        }
    });
    
    return fileTree;
}