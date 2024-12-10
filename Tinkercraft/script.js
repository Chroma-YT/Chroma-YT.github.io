let selected = [];
let version = "21";
let incompatiblePacks = [
    ["modern_creepers", "fresh_crops"]
];
let packConfig = {
    modern_creepers: {
    files: [
        { name: 'file1.txt', path: 'folder1' },
        { name: 'file2.txt', path: 'folder1/subfolder' }
    ]
    },
    fresh_crops: {
    files: [
        { name: 'file3.txt', path: 'folder2' },
        { name: 'file4.txt', path: 'folder2/subfolder' }
    ]
    }
    // Add more packs here...
};



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
            img.src = square.getAttribute("name") + ".png";
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
    for (let i = 0; i < incompatiblePacks.length; i++)
    {
        if (selected.includes(incompatiblePacks[i][0]) && selected.includes(incompatiblePacks[i][1]))
        {
            console.log(`Incompatible packs detected: ${incompatiblePacks[i][0]} and ${incompatiblePacks[i][1]}.`);
            incompatiblePacksFound = true;
        }
    }
    
    if (!incompatiblePacksFound)
    {
        console.log("No incompatible packs found. Proceeding to manifest creation...");
        console.log(`Version: ${version}`);
        console.log(`Packs selected: ${selected.join(', ')}`);
        const fileTree = generateFileTree(selected);
        console.log("File Tree:");
        printFileTree(fileTree);
    }
}
// Get the button element
const button = document.getElementById("run-button");
// Add an event listener to the button
button.addEventListener("click", buildAndDownload);






//Function to generate the file tree
function generateFileTree(selectedPacks) {
    const fileTree = {};
    selectedPacks.forEach(pack => {
    const packConfig = packConfig[pack];
    packConfig.files.forEach(file => {
        const pathParts = file.path.split('/');
        let currentFolder = fileTree;
        pathParts.forEach(part => {
        if (!currentFolder[part]) {
            currentFolder[part] = {};
        }
        currentFolder = currentFolder[part];
        });
        currentFolder[file.name] = {};
    });
});
return fileTree;
}

function printFileTree(fileTree, indent = 0) {
    Object.keys(fileTree).forEach(key => {
    console.log('  '.repeat(indent) + key);
    if (typeof fileTree[key] === 'object') {
        printFileTree(fileTree[key], indent + 1);
    }
});
}