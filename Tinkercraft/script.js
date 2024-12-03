let selected = [];

document.addEventListener("DOMContentLoaded", () => {
    // Collapsible Section Toggle
    var coll = document.getElementsByClassName("collapsible");

    for (let i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                content.style.paddingTop = "0";
                content.style.paddingBottom = "0";
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                content.style.paddingTop = "10px";
                content.style.paddingBottom = "10px";
            }
        });
    }

    // Hover Effect for Squares
    const squares = document.querySelectorAll(".square");
    const sidebarText = document.getElementById("sidebar").querySelector("p");

    squares.forEach(square => {
        const img = document.createElement("img");
        img.src = square.getAttribute("name") + ".png";
        img.classList.add("square-img");
        square.appendChild(img);

        let hoverTimer;

        square.addEventListener("mouseenter", () => {
            hoverTimer = setTimeout(() => {
                sidebarText.innerHTML = square.innerHTML;
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
                return;
            }
            selected.push(toAppend);
        });
    });

    // Background Tiles
    const backgroundContainer = document.getElementById('background-tiles');
    const totalHeight = document.body.scrollHeight;
    const tileCountX = Math.ceil(window.innerWidth / 100);
    const tileCountY = Math.ceil(totalHeight / 100);
    
    for (let i = 0; i < tileCountX * tileCountY; i++) {
        const tile = document.createElement('div');
        tile.className = 'background-tile';
        
        // Ensure background tiles work
        const rotations = [0, 90, 180, 270];
        const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];
        tile.style.transform = `rotate(${randomRotation}deg)`;
        
        backgroundContainer.appendChild(tile);
    }
});

