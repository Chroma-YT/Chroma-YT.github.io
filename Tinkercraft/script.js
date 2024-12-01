document.addEventListener("DOMContentLoaded", function() {
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
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

    const squares = document.querySelectorAll(".square");
    const sidebarText = document.getElementById("sidebar").querySelector("p");
    const packsSelected = [];
    const packsList = document.getElementById("packsList");

    squares.forEach(square => {
        let hoverTimer;

        square.addEventListener("mouseenter", function() {
            hoverTimer = setTimeout(() => {
                sidebarText.textContent = square.getAttribute("data-hover-text");
            }, 200);
        });

        square.addEventListener("mouseleave", function() {
            clearTimeout(hoverTimer);
        });

        square.addEventListener("click", function() {
            const packName = square.getAttribute('id');
            const index = packsSelected.indexOf(packName);

            if (index > -1) {
                packsSelected.splice(index, 1);
                square.classList.remove('clicked');
            } else {
                packsSelected.push(packName);
                square.classList.add('clicked');
            }

            updatePacksList();
        });
    });

    function updatePacksList() {
        packsList.innerHTML = "";
        packsSelected.forEach(pack => {
            const listItem = document.createElement("li");
            listItem.textContent = pack;
            packsList.appendChild(listItem);
        });
    }
});
