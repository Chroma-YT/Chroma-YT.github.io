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

    squares.forEach(square => {
        let hoverTimer;

        square.addEventListener("mouseenter", function() {
            hoverTimer = setTimeout(() => {
                sidebarText.textContent = `Hovered over ${square.id}`;
            }, 200);
        });

        square.addEventListener("mouseleave", function() {
            clearTimeout(hoverTimer);
        });
    });
});
