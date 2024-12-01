document.addEventListener("DOMContentLoaded", function() {
    // Collapsible Section Toggle
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

    // Hover Effect for Squares
    const squares = document.querySelectorAll(".square");
    const sidebarText = document.getElementById("sidebar").querySelector("p");

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
    });
});
