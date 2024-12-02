let selected = [];

document.addEventListener("DOMContentLoaded", () => {
    // Collapsible Section Toggle
    var coll = document.getElementsByClassName("collapsible");

    for (let i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }

    // Hover Effect for Squares
    const squares = document.querySelectorAll(".square");
    const sidebarText = document.getElementById("sidebar").querySelector("p");

    squares.forEach(square => {
        const img = document.createElement("img");
        img.src = square.getAttribute("name")+".png";
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
            if(selected.includes(toAppend)) {
                selected = selected.filter(item => item !== toAppend);
                return;
            }
            selected.push(toAppend);
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const backgroundContainer = document.getElementById('background-tiles');
    const skyBlueScreenHeight = document.getElementById('sky-blue-screen').clientHeight;
    const totalHeight = document.body.scrollHeight;
    const tileCountX = Math.ceil(window.innerWidth / 100);
    const tileCountY = Math.ceil(totalHeight / 100);
    for (let i = 0; i < tileCountX * tileCountY; i++) {
        const tile = document.createElement('div');
        tile.className = 'background-tile';
        // Apply random rotation
        const rotations = [0, 90, 180, 270];
        const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];
        tile.style.transform = `rotate(${randomRotation}deg)`;
        backgroundContainer.appendChild(tile);
    }
});